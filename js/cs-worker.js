/* C# 실행 워커: .NET(mono) WebAssembly 런타임 + Roslyn(CsRunner) 을 웹 워커 안에서 띄운다.
 *  - 메인 화면(js/cs-engine.js) 과 postMessage 로 통신
 *  - 입력(ReadLine) · 메시지 박스 · 모달 창처럼 "기다려야 하는" 호출은 SharedArrayBuffer + Atomics.wait 로 블록
 *    (교차 출처 격리가 아니면 미리 받은 입력만 사용하고, 모달은 기다리지 않는다)
 *  - 중지 = 메인이 워커를 terminate
 */
let runtime = null, exports = null, cfg = null;
let ctrl = null, data = null, canBlock = false;
let prefed = [];                 // 블록 불가 환경의 미리 받은 입력
const refBytes = new Map();      // 참조 어셈블리 이름 → Uint8Array
const dec = new TextDecoder();
let outBuf = [], outTimer = 0;

function post(m) { self.postMessage(m); }
// 디버그: 워커의 console 출력을 메인 화면에도 전달한다
for (const k of ['log', 'warn', 'error', 'info', 'debug']) { const orig = console[k].bind(console); console[k] = (...a) => { orig(...a); try { post({ type: 'debug', level: k, text: a.map((x) => typeof x === 'string' ? x : (x && x.message) || JSON.stringify(x)).join(' ') }); } catch (e) { /* 무시 */ } }; }
self.addEventListener('error', (e) => post({ type: 'debug', level: 'error', text: 'worker error: ' + (e.message || e) }));
self.addEventListener('unhandledrejection', (e) => post({ type: 'debug', level: 'error', text: 'unhandled rejection: ' + ((e.reason && (e.reason.stack || e.reason.message)) || e.reason) }));

// ------------------------------------------------------------ 출력 모으기 (한 틱에 한 번)
function flushOut() { if (outBuf.length) { post({ type: 'out', chunks: outBuf }); outBuf = []; } outTimer = 0; }
function write(fd, text) {
  if (fd === 3) { flushOut(); post({ type: 'ctl', text }); return; }
  outBuf.push([fd === 2 ? 'e' : 'o', text]);
  if (outBuf.length > 200) flushOut();
  else if (!outTimer) outTimer = setTimeout(flushOut, 16);
}

// ------------------------------------------------------------ 동기 채널 (메인 → 워커)
function waitSync() {
  // ctrl[0]: 0 비어 있음, 1 메시지 있음 · ctrl[1]: 길이
  for (;;) {
    if (Atomics.load(ctrl, 0) === 1) break;
    Atomics.wait(ctrl, 0, 0);
  }
  const len = ctrl[1];
  const text = dec.decode(data.slice(0, len));
  Atomics.store(ctrl, 0, 0);
  Atomics.notify(ctrl, 0);
  post({ type: 'ack' });
  return JSON.parse(text);
}
/** 동기 요청을 보내고 응답을 기다린다. 기다리는 동안 들어온 UI 이벤트는 그 자리에서 처리한다 (중첩 메시지 루프) */
function syncRequest(kind, payload) {
  flushOut();
  post({ type: 'sync', kind, payload });
  for (;;) {
    const m = waitSync();
    if (m.kind === 'event') { dispatchEvent(m.id, m.name, m.args); flushOut(); continue; }
    if (m.kind === 'result') return m.value == null ? null : String(m.value);
    if (m.kind === 'line') return m.text;
    if (m.kind === 'eof') return null;
  }
}
function readLine() {
  flushOut();
  if (!canBlock) {
    if (prefed.length) { const l = prefed.shift(); post({ type: 'echo', text: l }); return l; }
    post({ type: 'noInput' });
    return null;
  }
  post({ type: 'waitInput' });
  const r = syncRequest('line', '');
  post({ type: 'gotInput' });
  return r;
}
function syncCall(kind, payload) {
  if (!canBlock) { post({ type: 'sync', kind, payload, noWait: true }); return null; }
  return syncRequest(kind, payload);
}
function uiOps(json) { flushOut(); post({ type: 'ui', ops: json }); }
function appExit() { flushOut(); post({ type: 'appExit' }); }

function dispatchEvent(id, name, args) {
  try { exports.CsRunner.Interop.UiEvent(id | 0, String(name), typeof args === 'string' ? args : JSON.stringify(args || {})); }
  catch (e) { post({ type: 'out', chunks: [['e', '이벤트 처리 오류: ' + (e && e.message || e) + '\n']] }); }
}

// ------------------------------------------------------------ 런타임 준비
async function gunzip(res) {
  if (typeof DecompressionStream === 'undefined') throw new Error('이 브라우저는 DecompressionStream 을 지원하지 않습니다 (Chrome 80+, Edge 80+, Firefox 113+, Safari 16.4+ 필요)');
  const ds = new DecompressionStream('gzip');
  return new Response(res.body.pipeThrough(ds)).arrayBuffer();
}

async function init(m) {
  const base = m.base;                           // …/runtime/cs/
  if (m.ctrl) { ctrl = new Int32Array(m.ctrl, 0, 4); data = new Uint8Array(m.ctrl, 16); canBlock = true; }
  const manifest = m.manifest || { files: [] };
  const gzSet = new Set(manifest.files.filter((f) => f.gz).map((f) => f.name));
  const sizes = {}; manifest.files.forEach((f) => { sizes[f.name] = f.gzSize || f.size; });
  const totalBytes = manifest.files.reduce((a, f) => a + (f.gzSize || f.size), 0) || 1;
  let loadedBytes = 0, count = 0;
  const wanted = new Set(m.wanted || []);
  const progress = (name) => { loadedBytes += sizes[name] || 0; count++; post({ type: 'status', message: `런타임 내려받는 중… ${(loadedBytes / 1048576).toFixed(1)} / ${(totalBytes / 1048576).toFixed(1)} MB`, pct: Math.min(99, Math.round(loadedBytes / totalBytes * 100)) }); };

  post({ type: 'status', message: '.NET 런타임 준비 중…', pct: 0 });
  // .NET 9: 파일 이름에 지문(fingerprint)이 붙는다 → 논리 이름(System.Runtime.dll) 으로 되돌리는 표
  let fp = {};
  try { const boot = await (await fetch(base + '_framework/blazor.boot.json', { cache: 'no-cache' })).json(); fp = (boot.resources && boot.resources.fingerprinting) || {}; } catch (e) { /* 무시 */ }
  const logical = (f) => (fp[f] || f);
  const { dotnet } = await import(base + '_framework/dotnet.js');
  runtime = await dotnet
    .withConfigSrc(base + '_framework/blazor.boot.json')
    .withResourceLoader((type, name, defaultUri, integrity, behavior) => {
      if (type === 'dotnetjs' || type === 'js-module-dotnet' || type === 'js-module-native' || type === 'js-module-runtime' || type === 'js-module-threads' || String(type).startsWith('js-module') || type === 'configuration' || type === 'manifest') return defaultUri;
      const fname = name.split('/').pop();
      const gz = gzSet.has(fname) || gzSet.has(name);
      return (async () => {
        const res = await fetch(gz ? defaultUri + '.gz' : defaultUri, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`${name} 을 내려받지 못했습니다 (${res.status})`);
        const buf = gz ? await gunzip(res) : await res.arrayBuffer();
        progress(fname);
        if (type === 'assembly' || type === 'core-assembly' || type === 'coreAssembly') {
          const short = logical(fname).replace(/\.(dll|wasm)$/i, '');
          refBytes.set(short, new Uint8Array(buf));
        }
        const ct = type === 'dotnetwasm' ? 'application/wasm' : 'application/octet-stream';
        return new Response(buf, { status: 200, headers: { 'Content-Type': ct, 'Content-Length': String(buf.byteLength) } });
      })();
    })
    .withApplicationCulture('ko-KR')
    .withModuleConfig({ onAbort: (e) => console.error('[cs-worker] abort', e), onDotnetReady: () => console.log('[cs-worker] dotnet ready') })
    .withDiagnosticTracing(false)
    .withExitOnUnhandledError(false)
    .create();
  console.log('[cs-worker] runtime created');
  cfg = runtime.getConfig();
  runtime.setModuleImports('runner', { write, readLine, uiOps, syncCall, appExit, canBlock: () => canBlock });
  post({ type: 'status', message: '컴파일러 초기화 중…', pct: 99 });
  const asmName = (cfg.mainAssemblyName || 'CsRunner');
  try { exports = await runtime.getAssemblyExports(asmName); }
  catch (e) { exports = await runtime.getAssemblyExports(asmName.endsWith('.dll') ? asmName.slice(0, -4) : asmName + '.dll'); }
  console.log('[cs-worker] exports ok', Object.keys(exports));
  exports.CsRunner.Interop.Init();
  console.log('[cs-worker] Init ok');
  // 참조 어셈블리 등록 (부팅 중 받은 바이트 재사용, 빠진 것은 추가로 받는다)
  const names = JSON.parse(exports.CsRunner.Interop.ReferenceNames());
  for (const n of names) {
    let bytes = refBytes.get(n);
    if (!bytes) {
      const cand = manifest.files.find((f) => logical(f.name) === n + '.dll' || logical(f.name) === n + '.wasm');
      if (!cand) continue;
      try {
        const res = await fetch(base + '_framework/' + cand.name + (cand.gz ? '.gz' : ''), { cache: 'force-cache' });
        if (!res.ok) continue;
        bytes = new Uint8Array(cand.gz ? await gunzip(res) : await res.arrayBuffer());
      } catch (e) { continue; }
    }
    exports.CsRunner.Interop.AddReference(n, bytes);
    refBytes.delete(n);
  }
  refBytes.clear();
  console.log('[cs-worker] references registered');
  post({ type: 'ready', bytes: loadedBytes, files: count });
}

// ------------------------------------------------------------ 메시지
// 주의: self.onmessage 에 대입하면 dotnet.js 가 pthread 워커로 오인해 create() 가 끝나지 않는다 → addEventListener 사용
self.addEventListener('message', async (e) => {
  const m = e.data;
  try {
    switch (m.type) {
      case 'init': await init(m); break;
      case 'compile': {
        const t0 = performance.now();
        const r = JSON.parse(exports.CsRunner.Interop.Compile(JSON.stringify(m.files)));
        r.ms = performance.now() - t0;
        post({ type: 'compiled', rid: m.rid, result: r });
        break;
      }
      case 'run': {
        prefed = (m.stdin || '').replace(/\r/g, '').split('\n');
        if (prefed.length && prefed[prefed.length - 1] === '') prefed.pop();
        if (canBlock) prefed = [];   // 블록 가능하면 메인이 입력 큐를 관리한다
        const t0 = performance.now();
        let exit = 0;
        try { exit = await exports.CsRunner.Interop.Run(); }
        catch (err) { write(2, '실행 오류: ' + (err && err.message || err) + '\n'); exit = 134; }
        flushOut();
        post({ type: 'done', exit, ms: performance.now() - t0 });
        break;
      }
      case 'uiEvent': dispatchEvent(m.id, m.name, m.args); flushOut(); break;
      case 'files': post({ type: 'files', rid: m.rid, list: JSON.parse(exports.CsRunner.Interop.ListFiles()) }); break;
      case 'readFile': post({ type: 'file', rid: m.rid, name: m.name, text: exports.CsRunner.Interop.ReadFile(m.name) }); break;
      case 'writeFile': exports.CsRunner.Interop.WriteFile(m.name, m.text); break;
      case 'clearFiles': exports.CsRunner.Interop.ClearFiles(); break;
    }
  } catch (err) {
    post({ type: 'error', message: (err && err.message) || String(err), stack: err && err.stack, rid: m.rid });
  }
});
