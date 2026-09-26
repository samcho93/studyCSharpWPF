/* 브라우저 C# 실행 엔진 (메인 화면 쪽)
 *  - 워커(js/cs-worker.js) 안에서 .NET 런타임 + Roslyn 을 준비하고 코드를 컴파일 · 실행한다
 *  - 실행 중 입력(Console.ReadLine): 교차 출처 격리(crossOriginIsolated) 상태면 SharedArrayBuffer 로 블록 대기
 *    (GitHub Pages 는 coi-sw.js 서비스 워커가 격리를 켠다). 아니면 실행 전에 입력을 미리 받는다.
 *  - WPF: 워커가 보내는 UI 명령을 js/wpf-render.js 가 화면에 그리고, DOM 이벤트를 워커로 돌려보낸다
 *  - 중지: 워커 종료 (무한 반복도 즉시 멈춤). 다음 실행을 위해 새 워커를 미리 준비한다
 */
(function () {
  const VERSION = '20260926';
  const enc = new TextEncoder();
  const BASE = new URL('runtime/cs/', location.href).href;

  const E = {
    state: 'idle', message: '', pct: 0, loadMs: 0, listeners: [], version: VERSION, log: [],
    onChange(fn) { this.listeners.push(fn); fn(this); },
    set(state, message, pct) {
      this.state = state; this.message = message || ''; if (pct != null) this.pct = pct;
      this.listeners.forEach((f) => { try { f(this); } catch (e) { /* 무시 */ } });
    },
    supported() { return typeof Worker !== 'undefined' && typeof WebAssembly === 'object' && typeof DecompressionStream !== 'undefined'; },
    interactive() { return !!(self.crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined'); }
  };

  // ------------------------------------------------------------------ 워커 수명
  let worker = null, readyP = null, manifest = null, rid = 0;
  const pending = {};
  let ctrlBuf = null, ctrl = null, data = null;
  const syncQueue = [];            // 워커로 보낼 동기 메시지 (한 번에 하나)
  let syncBusy = false;
  let run = null;                  // 현재 실행 { resolve, h }
  let inputQueue = [];             // 실행 중 입력 줄 (블록 가능 환경)
  let waitingInput = false;

  async function loadManifest() {
    if (manifest) return manifest;
    const r = await fetch(BASE + 'manifest.json?v=' + VERSION, { cache: 'no-cache' });
    if (!r.ok) throw new Error('런타임 파일(runtime/cs/manifest.json)이 없습니다. tools/build-runtime.ps1 로 만들어야 합니다.');
    manifest = await r.json();
    return manifest;
  }

  E.load = function () {
    if (readyP) return readyP;
    const t0 = performance.now();
    E.set('loading', 'C# 실행 환경 준비 중…', 0);
    readyP = (async () => {
      const mf = await loadManifest();
      await new Promise((resolve, reject) => {
        worker = new Worker(`js/cs-worker.js?v=${VERSION}`, { type: 'module' });
        if (E.interactive()) {
          ctrlBuf = new SharedArrayBuffer(16 + 1024 * 1024);
          ctrl = new Int32Array(ctrlBuf, 0, 4);
          data = new Uint8Array(ctrlBuf, 16);
        } else { ctrlBuf = null; ctrl = null; data = null; }
        worker.onmessage = (e) => onMessage(e.data, resolve, reject);
        worker.onerror = (e) => { const err = new Error(e.message || '워커를 시작하지 못했습니다'); E.set('error', err.message); reject(err); };
        worker.postMessage({ type: 'init', base: BASE, manifest: mf, ctrl: ctrlBuf, wanted: [] });
      });
      E.loadMs = performance.now() - t0;
      E.set('ready', '준비 완료', 100);
    })().catch((err) => {
      E.set('error', String(err && err.message || err));
      readyP = null;
      if (worker) { worker.terminate(); worker = null; }
      throw err;
    });
    return readyP;
  };

  /**
   * 실행 환경을 처음부터 다시 받는다.
   * 배포로 파일 이름이 바뀌었는데 브라우저에 옛 목록이 남아 404 가 날 때 쓴다.
   */
  E.reset = async function () {
    try { if (worker) worker.terminate(); } catch (e) { /* 무시 */ }
    worker = null; readyP = null; manifest = null;
    try { if (window.caches) for (const k of await caches.keys()) await caches.delete(k); } catch (e) { /* 무시 */ }
    location.reload();
  };

  function onMessage(m, resolveInit, rejectInit) {
    switch (m.type) {
      case 'status': E.set('loading', m.message, m.pct); break;
      case 'debug': E.log.push(m.text); if (E.log.length > 200) E.log.shift(); (m.level === 'error' ? console.error : console.log)('[cs-worker]', m.text); break;
      case 'ready': resolveInit && resolveInit(); break;
      case 'error':
        if (m.rid && pending[m.rid]) { const p = pending[m.rid]; delete pending[m.rid]; p.reject(new Error(m.message)); }
        else if (E.state === 'loading') { rejectInit && rejectInit(new Error(m.message)); }
        else if (run) { run.h.onOutput('e', '오류: ' + m.message + '\n'); }
        break;
      case 'compiled': { const p = pending[m.rid]; if (p) { delete pending[m.rid]; p.resolve(m.result); } break; }
      case 'files': case 'file': { const p = pending[m.rid]; if (p) { delete pending[m.rid]; p.resolve(m.list != null ? m.list : m.text); } break; }
      case 'out': if (run) m.chunks.forEach(([s, t]) => run.h.onOutput(s, t)); break;
      case 'ctl': if (run) run.h.onControl && run.h.onControl(m.text); break;
      case 'echo': if (run) run.h.onOutput('i', m.text + '\n'); break;
      case 'waitInput': waitingInput = true; pumpInput(); if (waitingInput && run) run.h.onWaitInput && run.h.onWaitInput(true); break;
      case 'gotInput': waitingInput = false; if (run) run.h.onWaitInput && run.h.onWaitInput(false); break;
      case 'noInput': if (run) run.h.onNoInput && run.h.onNoInput(); break;
      case 'ack': syncBusy = false; pumpSync(); break;
      case 'sync': handleSync(m); break;
      case 'ui': if (window.WpfRender) WpfRender.apply(JSON.parse(m.ops)); break;
      case 'appExit': if (window.WpfRender) WpfRender.appExit(); break;
      case 'done': {
        const r = run; run = null;
        waitingInput = false;
        if (window.WpfRender) WpfRender.appExit();
        if (r) r.resolve({ exit: m.exit, ms: m.ms });
        break;
      }
    }
  }

  // ------------------------------------------------------------------ 동기 채널 (메인 → 워커, SharedArrayBuffer)
  function sendSync(obj) { syncQueue.push(obj); pumpSync(); }
  function pumpSync() {
    if (!ctrl || syncBusy || !syncQueue.length) return;
    if (Atomics.load(ctrl, 0) !== 0) return;   // 워커가 아직 읽지 않음
    const obj = syncQueue.shift();
    let bytes = enc.encode(JSON.stringify(obj));
    if (bytes.length > data.length) bytes = bytes.subarray(0, data.length);
    data.set(bytes);
    ctrl[1] = bytes.length;
    syncBusy = true;
    Atomics.store(ctrl, 0, 1);
    Atomics.notify(ctrl, 0);
  }
  function pumpInput() {
    if (!waitingInput || !ctrl) return;
    if (!inputQueue.length) return;
    const item = inputQueue.shift();
    waitingInput = false;
    if (item === null) sendSync({ kind: 'eof' });
    else { sendSync({ kind: 'line', text: item }); if (run && run.h.onEcho) run.h.onEcho(item); }
  }

  /** 워커의 동기 요청(메시지 박스 · 파일 대화상자 · 모달 창) 처리 */
  function handleSync(m) {
    const reply = (value) => { if (!m.noWait) sendSync({ kind: 'result', value }); };
    if (m.kind === 'line') return;   // 입력 줄은 waitInput → pumpInput 경로로 보낸다
    const R = window.WpfRender;
    if (m.kind === 'msgbox') { if (R) R.messageBox(JSON.parse(m.payload), reply); else reply('OK'); return; }
    if (m.kind === 'filedialog') { if (R) R.fileDialog(JSON.parse(m.payload), reply); else reply(''); return; }
    if (m.kind === 'dialog') { if (R) R.waitDialog(JSON.parse(m.payload).id, () => reply('')); else reply(''); return; }
    reply('');
  }

  /** 모달 대기 중 워커로 이벤트를 넣는다 (렌더러가 호출) */
  E.uiEvent = function (id, name, args) {
    if (!worker) return;
    if (syncBusy || syncQueue.length || (ctrl && Atomics.load(ctrl, 0) !== 0) || E.modalDepth > 0) {
      // 워커가 동기 대기 중이면 같은 채널로 전달 (중첩 처리)
      if (ctrl && E.modalDepth > 0) { sendSync({ kind: 'event', id, name, args }); return; }
    }
    worker.postMessage({ type: 'uiEvent', id, name, args });
  };
  E.modalDepth = 0;   // 렌더러가 모달 대기 시작/끝에 맞춰 조정

  // ------------------------------------------------------------------ 컴파일 · 실행
  E.compile = async function (files) {
    if (run) E.stop();   // 실행 중(WPF 창이 열린 채)이면 먼저 중지 — 새 워커에서 컴파일한다
    await E.load();
    return new Promise((resolve, reject) => {
      const id = 'c' + (++rid);
      pending[id] = { resolve, reject };
      worker.postMessage({ type: 'compile', rid: id, files });
    });
  };

  /**
   * 실행. h: { stdin, onOutput(s,text), onWaitInput(on), onNoInput(), onEcho(line), onControl(text) }
   * @returns {Promise<{exit:number, ms:number, killed?:boolean}>}
   */
  E.run = async function (h) {
    if (run) E.stop();
    await E.load();
    inputQueue = [];
    if (h.stdin) { h.stdin.replace(/\r/g, '').split('\n').forEach((l, i, a) => { if (!(i === a.length - 1 && l === '')) inputQueue.push(l); }); }
    return new Promise((resolve) => {
      run = { resolve, h };
      if (window.WpfRender) WpfRender.beginRun();
      worker.postMessage({ type: 'run', stdin: E.interactive() ? '' : (h.stdin || '') });
    });
  };
  E.running = () => !!run;
  E.input = function (text) { inputQueue.push(text.replace(/\n$/, '')); pumpInput(); };
  E.eof = function () { inputQueue.push(null); pumpInput(); };

  /** 실행 중지: 워커를 종료하고 새 워커를 미리 준비한다 */
  E.stop = function () {
    const r = run;
    run = null;
    waitingInput = false;
    syncQueue.length = 0; syncBusy = false;
    if (worker) { worker.terminate(); worker = null; }
    readyP = null;
    E.set('idle', '중지됨', 0);
    if (window.WpfRender) WpfRender.appExit();
    if (r) r.resolve({ exit: 143, ms: 0, killed: true });
    setTimeout(() => { if (!readyP) E.load().catch(() => {}); }, 300);
  };

  // ------------------------------------------------------------------ 작업 폴더 (워커 안의 /work)
  E.listFiles = async function () {
    if (!worker || E.state !== 'ready') return [];
    return new Promise((resolve, reject) => { const id = 'f' + (++rid); pending[id] = { resolve, reject }; worker.postMessage({ type: 'files', rid: id }); });
  };
  E.readFile = async function (name) {
    if (!worker || E.state !== 'ready') return null;
    return new Promise((resolve, reject) => { const id = 'r' + (++rid); pending[id] = { resolve, reject }; worker.postMessage({ type: 'readFile', rid: id, name }); });
  };
  E.writeFile = function (name, text) { if (worker) worker.postMessage({ type: 'writeFile', name, text }); };
  E.clearFiles = function () { if (worker) worker.postMessage({ type: 'clearFiles' }); };

  window.CsEngine = E;
})();
