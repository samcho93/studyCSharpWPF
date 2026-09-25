/* 콘솔 화면 + 브라우저 C# 실행(CsEngine) 연결, 오류 도움말 */
(function () {
  const { esc, splitFiles } = window.JU;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } }
  };
  const E = window.CsEngine;

  // ------------------------------------------------------------------ 오류 도움말 (Roslyn 메시지 → 한국어 설명)
  const COMPILE_HINTS = [
    [/^CS1002$/, '문장 끝에 <b>세미콜론(;)</b>이 빠졌습니다. 표시된 줄이나 바로 윗줄 끝을 확인하세요.'],
    [/^CS0103$/, '선언하지 않은 <b>이름</b>을 사용했습니다. 철자 · 대소문자(C# 은 구분합니다), 변수가 선언된 범위(블록 { })를 확인하세요. <code>Console</code> 처럼 클래스 이름이면 <code>using System;</code> 이 있는지 확인하세요.'],
    [/^CS0246$/, '<b>형식(클래스) 이름</b>을 찾을 수 없습니다. 철자와 <code>using</code> 지시문(예: <code>using System.Collections.Generic;</code>, <code>using System.Windows.Controls;</code>)을 확인하세요.'],
    [/^CS1513$/, '<b>닫는 중괄호 <code>}</code></b>가 빠졌습니다. 여는 괄호와 닫는 괄호의 개수를 세어 보세요.'],
    [/^CS1026$|^CS1003$|^CS1525$/, '<b>괄호 짝</b>이나 연산자 · 쉼표 위치가 맞지 않습니다. 표시된 줄의 <code>( )</code>, <code>[ ]</code> 를 확인하세요.'],
    [/^CS1010$|^CS1039$/, '문자열의 <b>큰따옴표(")</b>가 닫히지 않았습니다. 줄 안에서 따옴표를 닫아야 합니다(여러 줄은 <code>@"…"</code> 또는 <code>"""…"""</code>).'],
    [/^CS0161$|^CS0165$/, '반환형이 있는 메서드는 <b>모든 경우</b>에 <code>return 값;</code> 이 있어야 하고, 지역 변수는 <b>값을 넣은 뒤</b> 사용해야 합니다.'],
    [/^CS0029$|^CS0266$|^CS1503$/, '<b>자료형이 맞지 않습니다.</b> <code>int</code> 변수에 <code>double</code> 값을 넣으려면 <code>(int)</code> 로 명시적 형 변환이 필요하고, 문자열은 <code>int.Parse()</code> 로 바꿔야 합니다.'],
    [/^CS1501$|^CS1729$|^CS7036$/, '메서드/생성자를 호출할 때 <b>인수의 개수나 자료형</b>이 선언과 다릅니다.'],
    [/^CS0122$/, '<code>private</code> 멤버는 클래스 <b>밖에서 접근할 수 없습니다.</b> <code>public</code> 으로 바꾸거나 속성(getter/setter)을 사용하세요.'],
    [/^CS0128$|^CS0102$|^CS0111$/, '같은 범위에 <b>같은 이름</b>이 이미 선언되어 있습니다.'],
    [/^CS0131$|^CS0191$/, '<code>const</code>/<code>readonly</code> 로 선언한 값은 <b>바꿀 수 없습니다.</b>'],
    [/^CS0144$|^CS0534$/, '추상 클래스(<code>abstract</code>)는 객체를 만들 수 없고, 상속받은 클래스는 모든 추상 멤버를 <code>override</code> 해야 합니다.'],
    [/^CS0139$/, '<code>break</code> / <code>continue</code> 는 반복문(또는 switch) 안에서만 사용할 수 있습니다.'],
    [/^CS0019$/, '이 연산자를 쓸 수 없는 <b>자료형 조합</b>입니다. 예: <code>string + int</code> 는 되지만 <code>string - int</code> 는 안 됩니다.'],
    [/^CS0117$/, '그 형식에는 그런 이름의 <b>멤버(메서드·속성)가 없습니다.</b> 철자와 대소문자(<code>WriteLine</code>, <code>Length</code>, <code>Count</code>)를 확인하세요.'],
    [/^CS1061$/, '이 값에는 그런 이름의 <b>메서드나 속성이 없습니다.</b> 배열은 <code>Length</code>, <code>List</code> 는 <code>Count</code>, 문자열은 <code>Length</code> 입니다.'],
    [/^CS5001$/, '프로그램 진입점 <code>static void Main()</code> 이 없습니다. (최상위 문을 쓰거나 <code>Main</code> 을 작성하세요. WPF 라면 <code>App.xaml</code> 이나 <code>MainWindow.xaml</code> 이 필요합니다)'],
    [/^CS0120$/, '<b>인스턴스 멤버</b>를 <code>static</code> 메서드(Main)에서 객체 없이 사용했습니다. 객체를 만들어 호출하거나 멤버를 <code>static</code> 으로 만드세요.'],
    [/^CS0176$/, '<code>static</code> 멤버는 객체가 아니라 <b>클래스 이름</b>으로 접근합니다. 예: <code>Math.Sqrt()</code>.'],
    [/^CS0201$/, '식만 있고 문장이 되지 않습니다. 대입(<code>=</code>), 호출(<code>()</code>), 증감(<code>++</code>) 형태여야 합니다.'],
    [/^CS0236$|^CS0236$/, '필드 초기화식에서는 다른 인스턴스 멤버를 쓸 수 없습니다. 생성자에서 초기화하세요.'],
    [/^CS0428$/, '메서드 이름 뒤에 <b>괄호 <code>()</code></b>가 빠졌습니다. 메서드를 호출하려면 괄호가 필요합니다.'],
    [/^CS0106$|^CS1519$|^CS1520$/, '선언 형태가 잘못되었습니다. 메서드는 클래스 안에, 문장은 메서드 안에 써야 하며, 메서드에는 반환형(<code>void</code>, <code>int</code> …)이 필요합니다.'],
    [/^CS0246$|^CS0234$/, '네임스페이스 또는 형식을 찾을 수 없습니다. <code>using</code> 을 확인하세요.'],
    [/^CS0173$|^CS8957$/, '삼항 연산자(<code>? :</code>)의 두 값이 <b>같은 자료형</b>이어야 합니다.'],
    [/^CS8600$|^CS8602$|^CS8618$/, 'null 이 될 수 있는 값을 다루고 있습니다. (경고) 값이 null 이 아닌지 확인하거나 <code>?</code> 표시된 형식을 쓰세요.'],
    [/^CS0656$|^CS0518$/, '이 기능은 브라우저 실행 환경에서 지원하지 않는 형식을 참조합니다.'],
    [/^XAML$/, 'XAML 문법 오류입니다. 태그가 올바로 닫혔는지(<code>&lt;Button … /&gt;</code> 또는 <code>&lt;/Button&gt;</code>), 속성값에 큰따옴표가 있는지, <code>&amp;</code> 같은 특수문자를 <code>&amp;amp;</code> 로 썼는지 확인하세요.'],
    [/^CS0117$/, '']
  ];
  const RUNTIME_HINTS = [
    [/DivideByZeroException/, '<b>정수를 0으로 나누었습니다.</b> 나누기 전에 값이 0인지 확인하세요. (실수 나눗셈은 예외 없이 ∞ 가 됩니다)'],
    [/IndexOutOfRangeException/, '배열의 <b>인덱스 범위</b>를 벗어났습니다. 인덱스는 0 부터 <code>Length - 1</code> 까지입니다.'],
    [/ArgumentOutOfRangeException/, '<code>List</code> 인덱스나 <code>Substring</code> 위치 등이 <b>범위를 벗어났습니다.</b> <code>Count</code>/<code>Length</code> 를 확인하세요.'],
    [/NullReferenceException/, '<b>null 인 객체</b>의 멤버를 사용했습니다. 객체를 <code>new</code> 로 만들었는지, 메서드가 null 을 돌려주지 않았는지 확인하세요.'],
    [/FormatException/, '문자열을 숫자로 바꿀 수 없습니다. (예: <code>int.Parse("abc")</code>) 입력값을 확인하거나 <code>int.TryParse</code> 를 쓰세요.'],
    [/InvalidCastException/, '<b>형 변환</b>이 잘못되었습니다. 실제 객체의 형식과 변환하려는 형식을 확인하세요.'],
    [/StackOverflow|stack overflow|Maximum call stack/i, '메서드가 끝없이 자기 자신을 호출했습니다(<b>재귀 종료 조건</b> 확인).'],
    [/KeyNotFoundException/, '<code>Dictionary</code> 에 없는 <b>키</b>를 읽었습니다. <code>ContainsKey</code> 나 <code>TryGetValue</code> 로 먼저 확인하세요.'],
    [/OverflowException/, '값이 자료형의 <b>범위를 넘었습니다.</b> 더 큰 자료형(<code>long</code>)을 쓰거나 <code>checked</code> 범위를 확인하세요.'],
    [/FileNotFoundException|DirectoryNotFoundException/, '파일/폴더를 찾을 수 없습니다. 브라우저 안의 작업 폴더에는 프로그램이 만든 파일만 있습니다(📁 작업 폴더에서 확인).'],
    [/XamlParseException/, '<b>XAML 을 해석하는 중 오류</b>가 났습니다. 메시지의 행 번호를 보고 태그 · 속성 · 리소스 키 · 이벤트 처리기 이름을 확인하세요.'],
    [/InvalidOperationException/, '지금 상태에서는 할 수 없는 작업입니다. 메시지를 읽어 보세요. (예: 컬렉션을 foreach 로 도는 중에 항목 추가/삭제)'],
    [/처리되지 않은 예외|Unhandled exception/, '<b>처리하지 않은 예외</b>가 Main 밖으로 나가 프로그램이 종료되었습니다. <code>try-catch</code> 로 잡아 보세요.']
  ];
  const hintFor = (list, text) => { for (const [re, h] of list) if (h && re.test(text)) return h; return null; };

  // ------------------------------------------------------------------ 콘솔
  class Console {
    constructor(el) {
      this.el = el;
      this.out = el.querySelector('#jcConsole');
      this.form = el.querySelector('#stdinForm');
      this.input = el.querySelector('#stdinInput');
      this.eofBtn = el.querySelector('#eofBtn');
      this.stopBtn = el.querySelector('#stopBtn');
      this.state = el.querySelector('#runState');
      this.left = el.querySelector('#statusLeft');
      this.right = el.querySelector('#statusRight');
      this.main = el.querySelector('#consoleMain');
      this.run = null;
      this.onJump = null;
      this.history = [];
      this.hIndex = 0;
      this.fontSize = +store.get('cs.consoleFont', 14);
      this.applyFont();
      this.colors = { fg: null, bg: null };

      this.form.addEventListener('submit', (e) => { e.preventDefault(); this.sendLine(); });
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'd' && e.ctrlKey) { e.preventDefault(); this.sendEof(); }
        if (e.key === 'ArrowUp' && this.history.length) { e.preventDefault(); this.hIndex = Math.max(0, this.hIndex - 1); this.input.value = this.history[this.hIndex] || ''; }
        if (e.key === 'ArrowDown' && this.history.length) { e.preventDefault(); this.hIndex = Math.min(this.history.length, this.hIndex + 1); this.input.value = this.history[this.hIndex] || ''; }
        e.stopPropagation();
      });
      this.eofBtn.addEventListener('click', () => this.sendEof());
      this.stopBtn.addEventListener('click', () => this.stop());
      el.querySelector('#clearBtn').addEventListener('click', () => this.clear());
      el.querySelector('#cFontUp').addEventListener('click', () => { this.fontSize = Math.min(28, this.fontSize + 1); this.applyFont(); });
      el.querySelector('#cFontDown').addEventListener('click', () => { this.fontSize = Math.max(10, this.fontSize - 1); this.applyFont(); });
      this.out.addEventListener('click', (e) => {
        const loc = e.target.closest('[data-jump]');
        if (loc && this.onJump && +loc.dataset.jump > 0) this.onJump(+loc.dataset.jump);
      });
    }

    applyFont() {
      this.el.style.setProperty('--c-font', this.fontSize + 'px');
      store.set('cs.consoleFont', this.fontSize);
    }

    clear() {
      this.out.innerHTML = '';
      this.last = null;
    }

    atBottom() { return this.out.scrollHeight - this.out.scrollTop - this.out.clientHeight < 40; }

    write(cls, text) {
      if (!text) return;
      const stick = this.atBottom();
      const welcome = this.out.querySelector('.console-welcome');
      if (welcome) welcome.remove();
      const styled = cls === 'o' && (this.colors.fg || this.colors.bg);
      const key = styled ? cls + '|' + this.colors.fg + '|' + this.colors.bg : cls;
      if (this.last && this.last.dataset.k === key && this.last.parentNode === this.out && this.last.textContent.length < 20000) {
        this.last.textContent += text;
      } else {
        const span = document.createElement('span');
        span.className = cls;
        span.dataset.k = key;
        if (styled) { if (this.colors.fg) span.style.color = this.colors.fg; if (this.colors.bg) span.style.background = this.colors.bg; }
        span.textContent = text;
        this.out.appendChild(span);
        this.last = span;
      }
      if (this.out.textContent.length > 300000) {
        while (this.out.firstChild && this.out.textContent.length > 200000) this.out.firstChild.remove();
      }
      if (stick) this.out.scrollTop = this.out.scrollHeight;
    }

    html(html) {
      const stick = this.atBottom();
      const welcome = this.out.querySelector('.console-welcome');
      if (welcome) welcome.remove();
      const div = document.createElement('span');
      div.innerHTML = html;
      while (div.firstChild) this.out.appendChild(div.firstChild);
      this.last = null;
      if (stick) this.out.scrollTop = this.out.scrollHeight;
    }

    /** Console.ForegroundColor · Clear 등 제어 */
    control(text) {
      const CC = ['#000000', '#000080', '#008000', '#008080', '#800000', '#800080', '#808000', '#c0c0c0', '#808080', '#5c8cff', '#4cc983', '#4fc3b0', '#ff6b61', '#c77dff', '#f2c14e', '#ffffff'];
      if (text === 'clear') { this.clear(); return; }
      if (text === 'reset') { this.colors = { fg: null, bg: null }; this.last = null; return; }
      if (text.startsWith('fg:')) { const i = +text.slice(3); this.colors.fg = i === 7 ? null : CC[i] || null; this.last = null; return; }
      if (text.startsWith('bg:')) { const i = +text.slice(3); this.colors.bg = i === 0 ? null : CC[i] || null; this.last = null; return; }
      if (text === 'beep') { try { const ac = new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(); o.frequency.value = 800; o.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.15); } catch (e) { /* 무시 */ } }
    }

    setState(kind, text) {
      this.state.className = 'run-state ' + kind;
      this.state.textContent = text;
    }

    setRunning(on) {
      this.input.disabled = !on;
      this.eofBtn.disabled = !on;
      this.stopBtn.disabled = !on;
      if (!on) this.form.classList.remove('waiting');
    }

    sendLine() {
      if (!this.run || this.run.done) return;
      const text = this.input.value;
      this.input.value = '';
      if (text) { this.history.push(text); this.hIndex = this.history.length; }
      this.form.classList.remove('waiting');
      if (E.interactive()) E.input(text + '\n');   // 에코는 엔진이 실제로 전달할 때 한다
      else this.write('i', text + '\n');
    }

    sendEof() {
      if (!this.run || this.run.done) return;
      this.write('m', '^Z\n');
      E.eof();
    }

    stop() {
      const r = this.run;
      if (!r || r.done) return;
      E.stop();
    }

    /**
     * 코드 컴파일 + 실행
     * @param {string} code 편집기 전체 내용 (파일 구분 주석 포함 가능)
     * @param {{label?:string, stdin?:string, onDiagnostics?:Function, clear?:boolean, focusInput?:boolean}} opts
     */
    async execute(code, opts = {}) {
      if (this.run && !this.run.done) { this.run.superseded = true; E.stop(); }
      const run = { code, done: false, label: opts.label || '' };
      this.run = run;
      if (opts.clear !== false && store.get('cs.keepConsole', '0') !== '1') this.clear();
      else if (this.out.textContent.trim()) this.html('<span class="run-sep"></span>');
      this.colors = { fg: null, bg: null };
      this.main.textContent = opts.label ? '· ' + opts.label : '';
      if (opts.onDiagnostics) opts.onDiagnostics([]);

      if (!E || !E.supported()) {
        this.setState('error', '실행 불가');
        this.html('<span class="hint"><b>⚠ 이 브라우저에서는 C# 을 실행할 수 없습니다.</b><br>최신 Chrome · Edge · Firefox · Safari 를 사용하세요.</span>');
        run.done = true;
        return { ok: false };
      }
      if (E.state !== 'ready') {
        this.setState('compiling', '준비 중…');
        this.html(`<span class="hint"><b>⚙ 브라우저에서 .NET 런타임과 C# 컴파일러를 준비하는 중…</b><br>
          처음 한 번은 실행 환경(약 ${window.CS_RUNTIME_MB || 25}MB)을 내려받느라 <b>20초 ~ 1분</b> 정도 걸립니다. 이후에는 브라우저 캐시를 사용해 빨라집니다.</span>`);
        const upd = (b) => { if (!run.done && b.state === 'loading') this.left.textContent = b.message || '준비 중…'; };
        E.onChange(upd);
      }
      try {
        await E.load();
      } catch (e) {
        this.setState('error', '준비 실패');
        this.write('e', 'C# 실행 환경을 준비하지 못했습니다: ' + (e && e.message || e) + '\n');
        this.html('<span class="hint">인터넷 연결을 확인하고 페이지를 새로고침하세요. 파일을 직접 연 경우(<code>file://</code>)에는 동작하지 않습니다 — <code>start.bat</code> 으로 로컬 서버를 켜거나 GitHub Pages 주소로 접속하세요.</span>');
        run.done = true;
        return { ok: false };
      }
      if (run.superseded) return { ok: false };

      // ---- 컴파일
      this.setState('compiling', '컴파일 중…');
      this.left.textContent = '컴파일 중… (Roslyn · C# 13)';
      this.right.textContent = '';
      const files = splitFiles(code);
      const tc = performance.now();
      const tick0 = setInterval(() => { this.right.textContent = ((performance.now() - tc) / 1000).toFixed(1) + '초'; }, 100);
      let r;
      try { r = await E.compile(files.map((f) => ({ name: f.name, text: f.text }))); }
      catch (e) { clearInterval(tick0); run.done = true; this.setState('error', '오류'); this.write('e', '컴파일러 오류: ' + (e && e.message || e) + '\n'); return { ok: false }; }
      finally { clearInterval(tick0); }
      if (run.superseded) return { ok: false };
      const compileMs = performance.now() - tc;
      // 진단의 파일 행 → 편집기 행
      const diags = (r.diagnostics || []).map((d) => {
        const f = files.find((x) => x.name === d.file) || (files.length === 1 ? files[0] : null);
        return Object.assign({}, d, { editorLine: f ? f.startLine + d.line - 1 : 0 });
      });
      r.diagnostics = diags;
      if (!r.ok) {
        run.done = true;
        this.setState('error', '컴파일 오류');
        this.left.textContent = `컴파일 실패 (${diags.filter((d) => d.kind === 'error').length}개 오류)`;
        this.showDiagnostics(r, true);
        if (opts.onDiagnostics) opts.onDiagnostics(diags);
        return r;
      }
      if (diags.length && store.get('cs.showWarnings', '1') === '1') this.showDiagnostics(r, false);
      if (opts.onDiagnostics) opts.onDiagnostics(diags);

      // ---- 실행
      this.setRunning(true);
      this.setState('running', '실행 중');
      this.left.textContent = `▶ 실행 중 · 컴파일 ${(compileMs / 1000).toFixed(1)}초`;
      const needsInput = /Console\s*\.\s*Read(Line|Key)?\s*\(/.test(code);
      let stdin = opts.stdin || '';
      if (stdin) this.write('m', `[예시 입력을 자동으로 보냅니다: ${stdin.replace(/\n$/, '').replace(/\n/g, ' ⏎ ')}]\n`);
      else if (needsInput && !E.interactive()) {
        const v = window.prompt('이 프로그램은 키보드 입력이 필요합니다.\n입력할 값을 적으세요. (여러 줄은 | 로 구분, 예: 10|20)\n\n※ 이 브라우저 창은 실행 중 입력을 지원하지 않아 미리 입력받습니다.', '');
        stdin = v == null ? '' : v.split('|').join('\n') + '\n';
        if (v != null) this.write('m', `[미리 받은 입력: ${v.split('|').join(' ⏎ ')}]\n`);
      }
      if (needsInput && !stdin && opts.focusInput !== false) setTimeout(() => { if (!run.done) this.input.focus({ preventScroll: true }); }, 50);

      const started = performance.now();
      const tick = setInterval(() => { this.right.textContent = ((performance.now() - started) / 1000).toFixed(1) + '초'; }, 100);
      let stderr = '', endsWithNewline = true;
      let res;
      try {
        res = await E.run({
          stdin,
          onOutput: (s, text) => {
            if (s === 'e') stderr += text;
            this.write(s, text);
            endsWithNewline = /\n$/.test(text);
          },
          onEcho: (line) => this.write('i', line + '\n'),
          onControl: (t) => this.control(t),
          onWaitInput: (on) => {
            this.form.classList.toggle('waiting', on);
            if (on && opts.focusInput !== false && !(window.WpfRender && WpfRender.hasWindows())) this.input.focus({ preventScroll: true });
          },
          onNoInput: () => this.write('m', '\n[입력이 더 없습니다(EOF). 실행 중 입력은 교차 출처 격리가 켜진 페이지에서만 지원됩니다.]\n')
        });
      } finally {
        clearInterval(tick);
        run.done = true;
        if (this.run === run) this.setRunning(false);
      }
      if (run.superseded) return { ok: false };
      if (!endsWithNewline) this.write('o', '\n');
      if (res.killed) this.write('e', '⚠ 실행을 중지했습니다.\n');
      const sec = ((res.ms || (performance.now() - started)) / 1000).toFixed(2);
      this.write('m', `\n── 프로그램 종료 (종료 코드 ${res.exit}, ${sec}초) ──\n`);
      const h = hintFor(RUNTIME_HINTS, stderr);
      if (h && !res.killed) this.html(`<span class="hint"><b>💡 도움말</b> ${h}</span>`);
      this.setState(res.exit === 0 ? 'done' : 'error', res.exit === 0 ? '완료' : res.killed ? '중지됨' : `종료 코드 ${res.exit}`);
      this.left.textContent = res.exit === 0 ? `✓ 실행 완료 · 컴파일 ${(compileMs / 1000).toFixed(1)}초` : res.killed ? '■ 중지됨' : '✗ 오류로 종료';
      this.right.textContent = sec + '초';
      return { ok: true, exit: res.exit };
    }

    showDiagnostics(r, isError) {
      const diags = (r.diagnostics || []);
      if (!diags.length) {
        this.write('e', (r.message || '컴파일하지 못했습니다.') + '\n');
        return;
      }
      const errors = diags.filter((d) => d.kind === 'error');
      const warns = diags.filter((d) => d.kind === 'warning');
      if (isError) this.write('e', `✗ 컴파일 오류 ${errors.length}개\n`);
      else this.write('m', `⚠ 컴파일 경고 ${warns.length}개 (실행은 계속합니다)\n`);
      const shown = new Set();
      diags.slice(0, 30).forEach((d) => {
        const label = d.kind === 'error' ? '오류' : '경고';
        const cls = d.kind === 'error' ? 'e' : 's';
        this.html(`<span class="diag"><span class="loc" data-jump="${d.editorLine || 0}" title="편집기에서 이 줄로 이동">${esc(d.file || 'Program.cs')}:${d.line}행</span> <span class="${cls}">${label} ${esc(d.id)}: ${esc(d.message)}</span>\n</span>`);
        const h = hintFor(COMPILE_HINTS, d.id);
        if (h && !shown.has(h)) { shown.add(h); this.html(`<span class="hint"><b>💡 도움말</b> ${h}</span>`); }
      });
      if (diags.length > 30) this.write('m', `… 외 ${diags.length - 30}개\n`);
    }
  }

  window.Runner = { Console, store, engine: E };
})();
