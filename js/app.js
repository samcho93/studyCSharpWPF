/* C# · WPF 웹 실습 강좌 — 메인 앱 (네비게이션 · 강좌 문서 · 에디터 · 진도 · 역할/보기 전환) */
(function () {
  const { esc, highlightLines, makeEditor } = window.JU;
  const { store } = window.Runner;
  const C = window.CS_COURSE;
  const $ = (id) => document.getElementById(id);
  const stripTags = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

  const app = {
    role: 'student',
    view: 'doc',
    route: { type: 'home' },
    done: new Set(),
    blockCodes: {},
    activeEditor: null
  };
  window.CsApp = app;

  // ================================================================== 초기화
  async function init() {
    applyTheme(store.get('cs.theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    try { JSON.parse(store.get('cs.done', '[]')).forEach((id) => app.done.add(id)); } catch (e) { /* 무시 */ }

    const q = new URLSearchParams(location.search);
    app.role = q.get('role') === 'teacher' ? 'teacher' : q.get('role') === 'student' ? 'student' : store.get('cs.role', 'student');
    app.viewPref = q.get('view');
    setRole(app.role, true);

    app.console = new Runner.Console($('consolePanel'));
    app.console.onJump = (line) => { if (app.activeEditor) app.activeEditor.jump(line); };
    setupEditor();
    app.deck = new Deck(app);
    setupLayout();
    setupServerBadge();
    bindUi();

    await Promise.all([loadLessons(), loadShots()]);
    buildNav();
    updateProgress();
    window.addEventListener('hashchange', () => routeFromHash());
    routeFromHash();
  }

  function loadLessons() {
    return Promise.all(C.order.map((o) => new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = `lessons/${o.id}.js`;
      s.async = false;
      s.onload = resolve;
      s.onerror = resolve;
      document.body.appendChild(s);
    })));
  }

  /** Visual Studio 실행 화면 캡처 목록 (assets/shots/index.json) — 예제 id 규칙은 tools/shots.mjs 참조 */
  app.shots = new Set();
  async function loadShots() {
    try {
      const r = await fetch('assets/shots/index.json', { cache: 'no-cache' });
      if (r.ok) (await r.json()).forEach((id) => app.shots.add(id));
    } catch (e) { /* 캡처 없음 */ }
  }
  app.shotPath = (id) => (app.shots.has(id) ? `assets/shots/${id}.png` : null);
  const isWpfCode = (code) => /<Window\b|<UserControl\b|<Application\b|System\.Windows/.test(code || '');

  const lbl = (c) => (c && c.group === 'project' ? 'Project' : 'Chapter');
  const chapters = () => C.order.map((o) => C.chapters[o.id] ? Object.assign({ icon: o.icon, group: o.group }, C.chapters[o.id]) : null).filter(Boolean);
  const allSections = () => chapters().flatMap((ch) => ch.sections.map((s) => ({ ch, sec: s })));
  function findSection(id) {
    for (const ch of chapters()) {
      const sec = ch.sections.find((s) => s.id === id);
      if (sec) return { ch, sec };
    }
    return null;
  }

  // ================================================================== 테마 · 역할 · 보기
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    store.set('cs.theme', t);
  }

  /** 교사용 진입 비밀번호 (기본값). 한 번 확인하면 그 브라우저에서는 다시 묻지 않는다. */
  const TEACHER_PASSWORD = 'csharp2026';

  function teacherAllowed() {
    if (store.get('cs.teacherOk', '') === '1') return true;
    const v = window.prompt('🧑‍🏫 교사용 화면 비밀번호를 입력하세요.');
    if (v == null) return false;
    if (v.trim() !== TEACHER_PASSWORD) { alert('비밀번호가 맞지 않습니다.'); return false; }
    store.set('cs.teacherOk', '1');
    return true;
  }

  function setRole(role, silent) {
    if (role === 'teacher' && !teacherAllowed()) {
      role = 'student';
      if (silent) { const q0 = new URLSearchParams(location.search); q0.set('role', 'student'); history.replaceState(null, '', `${location.pathname}?${q0}${location.hash}`); }
    }
    app.role = role;
    store.set('cs.role', role);
    document.body.classList.toggle('role-teacher', role === 'teacher');
    document.querySelectorAll('.role-switch button').forEach((b) => b.classList.toggle('active', b.dataset.role === role));
    $('brandSub').textContent = role === 'teacher' ? '🧑‍🏫 교사용 · PPT 수업 모드' : '🎓 학생용 · 문서 + 실습';
    const q = new URLSearchParams(location.search);
    q.set('role', role);
    q.delete('view');
    history.replaceState(null, '', `${location.pathname}?${q}${location.hash}`);
    if (!silent) {
      app.view = role === 'teacher' ? 'slides' : 'doc';
      app.viewInit = true;
      render();
    }
  }

  function setView(view) {
    app.view = view;
    render();
  }
  app.setView = setView;

  // ================================================================== 에디터
  function setupEditor() {
    app.editor = makeEditor($('editorHost'), '', { onRun: runEditor });
    app.editorState = { key: null, label: '', original: '' };
    app.editor.on('change', () => {
      const st = app.editorState;
      if (st.key) store.set('cs.ed.' + st.key, JSON.stringify({ code: app.editor.getValue(), label: st.label, original: st.original }));
    });
    const font = +store.get('cs.edFont', 14.5);
    setEditorFont(font);
  }

  function setEditorFont(px) {
    app.edFont = Math.max(10, Math.min(28, px));
    document.documentElement.style.setProperty('--ed-font', app.edFont + 'px');
    store.set('cs.edFont', app.edFont);
    app.editor.refresh();
  }

  function loadEditor(code, label, key) {
    app.editorState = { key: key || app.editorState.key, label: label || '', original: code };
    app.editor.setValue(code);
    $('editorLabel').textContent = label ? '· ' + label : '';
    if (app.editorState.key) store.set('cs.ed.' + app.editorState.key, JSON.stringify({ code, label, original: code }));
    $('editorPane').classList.remove('folded');
    $('foldBtn').textContent = '▾ 접기';
    setTimeout(() => app.editor.refresh(), 0);
  }

  function restoreEditor(sectionId, fallbackCode, fallbackLabel) {
    let saved = null;
    try { saved = JSON.parse(store.get('cs.ed.' + sectionId, 'null')); } catch (e) { saved = null; }
    if (saved && saved.code != null) {
      app.editorState = { key: sectionId, label: saved.label || '', original: saved.original || saved.code };
      app.editor.setValue(saved.code);
      $('editorLabel').textContent = saved.label ? '· ' + saved.label : '';
    } else {
      app.editorState = { key: sectionId, label: fallbackLabel || '', original: fallbackCode || '' };
      app.editor.setValue(fallbackCode || '');
      $('editorLabel').textContent = fallbackLabel ? '· ' + fallbackLabel : '';
    }
    setTimeout(() => app.editor.refresh(), 0);
  }

  function runEditor(stdin) {
    app.runCode(app.editor.getValue(), { label: app.editorState.label || '실습 코드', stdin, editor: app.editor });
  }

  app.runCode = function (code, opts = {}) {
    app.activeEditor = opts.editor || null;
    return app.console.execute(code, {
      label: opts.label,
      stdin: opts.stdin,
      onDiagnostics: (d) => { if (opts.editor) opts.editor.markErrors(d); }
    });
  };

  /** WPF 창이 열릴 때: 오른쪽 패널이 좁으면 넓힌다 */
  app.onWpfWindow = function (w, h) {
    const root = document.documentElement;
    const cur = parseFloat(getComputedStyle(root).getPropertyValue('--out-w')) || 430;
    const want = Math.min(window.innerWidth * 0.6, Math.max(cur, w + 60));
    if (want > cur + 10 && window.innerWidth > 900) { root.style.setProperty('--out-w', want + 'px'); app.deck && app.deck.fit(); app.editor.refresh(); }
    // 창이 WPF 영역보다 크면 영역을 키운다 (콘솔 패널의 80% 까지)
    const panel = $('consolePanel').getBoundingClientRect().height;
    const host = $('wpfHost');
    const curH = host ? host.getBoundingClientRect().height : 0;
    const wantH = Math.min(panel * 0.8, h + 80);
    if (host && wantH > curH + 10) root.style.setProperty('--wpf-h', Math.round(wantH) + 'px');
  };

  app.toast = function (msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(app._toast);
    app._toast = setTimeout(() => t.classList.add('hidden'), 1800);
  };

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); app.toast('복사했습니다'); } catch (e) { app.toast('복사하지 못했습니다'); }
  }

  // ================================================================== 네비게이션
  function buildNav() {
    const q = $('navSearch').value.trim().toLowerCase();
    const tree = $('navTree');
    const cur = app.route;
    let html = `<a class="nav-home${cur.type === 'home' ? ' active' : ''}" href="#home">🏠 강좌 소개</a>`;
    let lastGroup = null;
    C.order.forEach((o) => {
      const ch = C.chapters[o.id];
      if (o.group !== lastGroup && !q) {
        lastGroup = o.group;
        const g = C.groups && C.groups[o.group];
        if (g) html += `<div class="nav-group">${esc(g)}</div>`;
      }
      if (!ch) {
        if (!q) html += `<div class="nav-ch"><div class="nav-ch-head" style="cursor:default;opacity:.6"><span class="no">${esc(o.no)}</span><span class="t">${esc(o.title)}</span><span class="pending">준비 중</span></div></div>`;
        return;
      }
      let secs = ch.sections;
      const hits = {};
      if (q) {
        const chHit = (ch.title + ' ' + (ch.subtitle || '')).toLowerCase().includes(q);
        secs = secs.filter((s) => {
          if (chHit || s.title.toLowerCase().includes(q)) return true;
          const text = sectionText(s).toLowerCase();
          const i = text.indexOf(q);
          if (i >= 0) { hits[s.id] = text.slice(Math.max(0, i - 18), i + q.length + 26); return true; }
          return false;
        });
        if (!secs.length) return;
      }
      const active = (cur.ch && cur.ch.id === ch.id);
      const open = q || active || (store.get('cs.open.' + ch.id, '0') === '1');
      const doneN = ch.sections.filter((s) => app.done.has(s.id)).length;
      html += `<div class="nav-ch${open ? ' open' : ''}${active ? ' active' : ''}" data-ch="${ch.id}">
        <div class="nav-ch-head"><span class="no">${esc(ch.no)}</span><span class="t" title="${esc(ch.title)}">${esc(o.icon || '')} ${esc(ch.title)}</span>
          <span class="pending">${doneN}/${ch.sections.length}</span><span class="caret">▶</span></div>
        <div class="nav-secs"><a class="nav-sec nav-overview${cur.type === 'chapter' && active ? ' active' : ''}" href="#${ch.id}"><span class="chk">ⓘ</span><span>${o.group === 'project' ? '프로젝트 개요' : '챕터 개요'}</span></a>
        ${secs.map((s) => `<a class="nav-sec${cur.sec && cur.sec.id === s.id ? ' active' : ''}${app.done.has(s.id) ? ' done' : ''}" href="#${s.id}">
          <span class="chk">${app.done.has(s.id) ? '✔' : ch.sections.indexOf(s) + 1}</span><span>${window.JU.textish(s.title)}${hits[s.id] ? `<span class="hit">…${esc(hits[s.id])}…</span>` : ''}</span></a>`).join('')}
        </div></div>`;
    });
    tree.innerHTML = html;
    const act = tree.querySelector('.nav-sec.active');
    if (act && !q) act.scrollIntoView({ block: 'nearest' });
  }

  const textCache = new Map();
  function sectionText(s) {
    if (textCache.has(s.id)) return textCache.get(s.id);
    const parts = [s.title, ...(s.goals || [])];
    (s.content || []).forEach((b) => parts.push(b.text || '', stripTags(b.html), b.title || '', (b.items || []).map(stripTags).join(' '), b.code || '', (b.rows || []).flat().map(stripTags).join(' ')));
    (s.practice || []).forEach((p) => parts.push(p.title, stripTags(p.desc)));
    const t = parts.join(' ');
    textCache.set(s.id, t);
    return t;
  }

  function updateProgress() {
    const all = allSections();
    const n = all.filter((x) => app.done.has(x.sec.id)).length;
    $('progressText').textContent = `${n} / ${all.length}`;
    $('progressBar').style.width = all.length ? (n / all.length * 100) + '%' : '0';
  }

  function toggleDone(id) {
    if (app.done.has(id)) app.done.delete(id); else app.done.add(id);
    store.set('cs.done', JSON.stringify([...app.done]));
    updateProgress();
    buildNav();
  }

  // ================================================================== 라우팅
  function routeFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const [id, slide] = h.split('@');
    if (!id || id === 'home') { app.route = { type: 'home' }; }
    else if (C.chapters[id]) { app.route = { type: 'chapter', ch: chapters().find((c) => c.id === id) }; }
    else {
      const f = findSection(id);
      if (f) {
        let at = slide ? Math.max(0, (+slide || 1) - 1) : (slide === '' ? 0 : null);
        if (at == null) {
          let mem = null;
          try { mem = JSON.parse(sessionStorage.getItem('cs.slidePos') || 'null'); } catch (e) { mem = null; }
          at = (mem && mem.id === id) ? mem.i : 0;
        }
        app.route = { type: 'section', ch: f.ch, sec: f.sec, slide: at };
        store.set('cs.last', id);
      } else app.route = { type: 'home' };
    }
    if (app.viewPref) { app.view = app.viewPref === 'slides' ? 'slides' : 'doc'; app.viewPref = null; }
    else if (!app.viewInit) app.view = app.role === 'teacher' ? 'slides' : 'doc';
    app.viewInit = true;
    render();
  }

  function go(hash) {
    if (location.hash === '#' + hash) routeFromHash();
    else location.hash = hash;
  }

  app.stepSection = function (dir, slide) {
    const all = allSections();
    const r = app.route;
    if (r.type !== 'section') return;
    const i = all.findIndex((x) => x.sec.id === r.sec.id);
    const n = all[i + dir];
    if (!n) { app.toast(dir > 0 ? '마지막 슬라이드입니다' : '첫 슬라이드입니다'); return; }
    app.pendingSlide = slide;
    go(n.sec.id);
  };

  app.onSlideChange = function (sec, index) {
    try { sessionStorage.setItem('cs.slidePos', JSON.stringify({ id: sec.id, i: index })); } catch (e) { /* 무시 */ }
    const h = `#${sec.id}@${index + 1}`;
    if (location.hash !== h) history.replaceState(null, '', location.pathname + location.search + h);
  };

  // ================================================================== 렌더링
  function render() {
    const r = app.route;
    buildNav();
    document.querySelectorAll('.view-switch button').forEach((b) => b.classList.toggle('active', b.dataset.view === app.view));
    const isSection = r.type === 'section';
    const slides = isSection && app.view === 'slides';
    $('docView').classList.toggle('hidden', slides);
    $('slideView').classList.toggle('hidden', !slides);
    document.querySelector('.view-switch').style.visibility = isSection ? 'visible' : 'hidden';
    $('prevBtn').style.visibility = isSection ? 'visible' : 'hidden';
    $('nextBtn').style.visibility = isSection ? 'visible' : 'hidden';

    if (r.type === 'home') {
      $('crumb').innerHTML = '<b>강좌 소개</b>';
      renderHome();
    } else if (r.type === 'chapter') {
      $('crumb').innerHTML = `${lbl(r.ch)} ${esc(r.ch.no)} · <b>${esc(r.ch.title)}</b>`;
      renderChapter(r.ch);
    } else {
      $('crumb').innerHTML = `${lbl(r.ch)} ${esc(r.ch.no)} ${esc(r.ch.title)} › <b>${window.JU.textish(r.sec.title)}</b>`;
      if (slides) {
        const idx = app.pendingSlide != null ? app.pendingSlide : (r.slide != null ? r.slide : 0);
        app.pendingSlide = null;
        app.deck.open(r.ch, r.sec, idx);
      } else {
        renderSection(r.ch, r.sec);
      }
    }
    if (!slides) setTimeout(() => app.editor.refresh(), 0);
  }

  // ------------------------------------------------------------------ 홈
  function renderHome() {
    const chs = chapters();
    const all = allSections();
    let nCode = 0, nSlides = 0, nPractice = 0, nQuiz = 0, nShots = 0;
    all.forEach(({ sec }) => {
      nCode += (sec.content || []).filter((b) => b.type === 'code').length;
      nSlides += (sec.slides || []).length;
      nPractice += (sec.practice || []).length;
      nQuiz += (sec.quiz || []).length;
      nShots += (sec.content || []).filter((b) => b.type === 'code' && b.shot).length;
    });
    const last = store.get('cs.last', '');
    const lastF = last && findSection(last);
    const first = all[0];
    const teacher = app.role === 'teacher';
    const nBasic = chs.filter((c) => c.group === 'basic').length;
    const nWpf = chs.filter((c) => c.group === 'wpf').length;
    const nPr = chs.filter((c) => c.group === 'project').length;
    const card = (o) => {
      const ch = C.chapters[o.id];
      if (!ch) return `<div class="card disabled"><span class="ci">${o.icon}</span><span class="cn">${lbl(o)} ${esc(o.no)}</span><span class="ct">${esc(o.title)}</span><span class="cs">준비 중</span></div>`;
      const d = ch.sections.filter((s) => app.done.has(s.id)).length;
      return `<a class="card" href="#${ch.id}"><span class="ci">${o.icon}</span><span class="cn">${lbl(o)} ${esc(ch.no)}</span><span class="ct">${esc(ch.title)}</span>
        <span class="cs">${ch.sections.length}교시 · ${esc(stripTags(ch.summary).slice(0, 60))}${stripTags(ch.summary).length > 60 ? '…' : ''}</span>
        <span class="cp"><i style="width:${ch.sections.length ? d / ch.sections.length * 100 : 0}%"></i></span></a>`;
    };
    $('content').innerHTML = `<div class="doc">
      <div class="hero">
        <h1>🪟 ${esc(C.title)}</h1>
        <p><b>C# 언어의 기초</b>부터 <b>WPF 로 윈도우 프로그램을 만드는 방법</b>까지, 설치 없이 <b>브라우저 안에서 C# 코드를 컴파일 · 실행</b>하고 WPF 창까지 띄워 보며 배우는 실습 강좌입니다. 마지막에는 배운 내용을 모아 만드는 <b>응용 프로젝트 ${nPr || 10}개</b>가 있습니다.</p>
        <p>C# 기초 ${nBasic}장 · WPF ${nWpf}장 · 프로젝트 ${nPr}개 · 교시 ${all.length}개 · 예제 ${nCode}개 · 실습 ${nPractice}개 · 퀴즈 ${nQuiz}문항 · 슬라이드 ${nSlides}장${nShots ? ` · Visual Studio 실행 화면 ${nShots}장` : ''}</p>
        <div class="hero-actions">
          ${lastF ? `<a class="btn" href="#${lastF.sec.id}">⏯ 이어서 학습: ${esc(lastF.sec.title)}</a>` : ''}
          ${first ? `<a class="btn${lastF ? ' outline' : ''}" href="#${first.sec.id}">▶ 처음부터 시작</a>` : ''}
          <button class="btn outline" data-role-go="${teacher ? 'student' : 'teacher'}">${teacher ? '🎓 학생용 화면으로' : '🧑‍🏫 교사용(PPT) 화면으로'}</button>
        </div>
        <div class="cup">C#</div>
      </div>

      <h2>📘 Part 1 · C# 기초</h2>
      <div class="cards">${C.order.filter((o) => o.group === 'basic').map(card).join('')}</div>
      <h2>🪟 Part 2 · WPF 윈도우 프로그래밍</h2>
      <p class="muted">Visual Studio 로 만드는 WPF 데스크톱 앱. 예제마다 실제 실행 화면(캡처)을 함께 보여 주고, 브라우저 안에서도 같은 창을 띄워 조작해 볼 수 있습니다.</p>
      <div class="cards">${C.order.filter((o) => o.group === 'wpf').map(card).join('')}</div>
      <h2>🚀 응용 프로젝트</h2>
      <p class="muted">챕터에서 배운 문법을 모아 완성된 프로그램을 단계별로 만듭니다. 각 프로젝트 개요에 필요한 선수 챕터가 표시됩니다.</p>
      <div class="cards">${C.order.filter((o) => o.group === 'project').map(card).join('')}</div>

      <h2>🧭 화면 구성과 사용 방법</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>구분</th><th>🎓 학생용</th><th>🧑‍🏫 교사용</th></tr></thead>
        <tbody>
          <tr><td>기본 화면</td><td>문서형 강좌 (개념 → 예제 → 실습 → 퀴즈)</td><td>PPT 형태 슬라이드 (16:9) + 판서 · 교사 노트</td></tr>
          <tr><td>코드 실행</td><td>예제의 <b>▶ 실행</b> 또는 아래 에디터에서 <kbd>Ctrl</kbd>+<kbd>Enter</kbd></td><td>코드 슬라이드에서 직접 수정하고 <b>▶ 실행</b> (전체 화면에서도 결과 패널 표시)</td></tr>
          <tr><td>실행 결과</td><td colspan="2">오른쪽 <b>콘솔</b>에 <code>Console.WriteLine</code> 출력, <code>Console.ReadLine</code> 입력은 콘솔 아래 입력칸에 입력. <b>WPF 프로그램은 오른쪽 위에 실제 창이 열립니다</b> (버튼 클릭 · 입력 등 조작 가능)</td></tr>
          <tr><td>추가 기능</td><td>진도 저장, 검색, 슬라이드 보기</td><td>교사 노트 · 수업 흐름 · 퀴즈 정답 · 실습 정답 실행 · 타이머 · 발표자 창 · 전체 화면 · 판서</td></tr>
        </tbody></table></div>
      <ul class="steps">
        <li><b>교시 선택</b> — 왼쪽 목차에서 챕터와 교시를 고릅니다. 상단의 📄 문서 / 🖼️ 슬라이드 버튼으로 보기를 바꿉니다.</li>
        <li><b>코드 실행</b> — 예제의 ▶ 실행을 누르면 아래 에디터로 코드가 들어가고 오른쪽 콘솔(또는 WPF 창)에 결과가 나옵니다. 코드를 고쳐 다시 실행해 보세요.
          <b>처음 실행할 때</b>는 브라우저가 .NET 런타임과 C# 컴파일러를 내려받느라 20초 ~ 1분 걸립니다.</li>
        <li><b>WPF 예제</b> — 한 편집기 안에 <code>// ===== File: MainWindow.xaml =====</code> 와 <code>// ===== File: MainWindow.xaml.cs =====</code> 처럼 파일 구분 주석으로 XAML 과 코드 비하인드를 나눕니다. Visual Studio 의 프로젝트와 같은 구조입니다.</li>
        <li><b>교사용 수업</b> — 🧑‍🏫 교사용으로 바꾸면 슬라이드가 열립니다. <kbd>F</kbd> 전체 화면, <kbd>←</kbd> <kbd>→</kbd> 이동, <kbd>R</kbd> 결과 패널, <kbd>G</kbd> 목록, <kbd>N</kbd> 노트, <kbd>B</kbd> 화면 가리기, <kbd>T</kbd> 타이머.</li>
      </ul>
      <div class="callout info"><div class="ct">ℹ️ 실행 환경 <span id="homeEngine" class="muted" style="font-weight:600">확인 중</span></div><div>
        <p>설치할 것이 없습니다. <b>.NET 런타임(mono)을 WebAssembly 로 만든 것</b>과 <b>C# 컴파일러(Roslyn)</b>가 브라우저 안에서 코드를 컴파일하고 실행합니다.
        WPF 화면은 이 강좌에 포함된 <b>WPF 호환 라이브러리</b>가 브라우저 화면(DOM)에 그립니다 — 실제 WPF 와 모양이 조금 다를 수 있으며, 예제마다 Visual Studio 에서 실행한 <b>실제 화면 캡처</b>를 함께 실었습니다.
        GitHub Pages 에서도 그대로 동작합니다. 최신 Chrome · Edge · Firefox · Safari 를 사용하세요.</p>
        <p>파일 입출력 예제가 만든 파일은 콘솔의 <b>📁 작업 폴더</b>에서 확인합니다 (브라우저 메모리 안, 새로고침하면 비워짐).</p>
      </div></div>
    </div>`;
    updateEngineText();
    $('content').scrollTop = 0;
    restoreEditor('home', 'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("안녕하세요, C#!");\n    }\n}\n', 'Program.cs');
  }

  // ------------------------------------------------------------------ 챕터 개요
  function renderChapter(ch) {
    const secMeta = (s) => {
      const nc = (s.content || []).filter((b) => b.type === 'code').length;
      return `${s.minutes || 50}분 · 예제 ${nc} · 실습 ${(s.practice || []).length} · 슬라이드 ${(s.slides || []).length}`;
    };
    $('content').innerHTML = `<div class="doc">
      <span class="chapter-badge">${esc(ch.icon || '')} ${lbl(ch)} ${esc(ch.no)}</span>
      <h1>${esc(ch.title)} ${ch.subtitle ? `<span class="muted" style="font-size:.6em;font-weight:600">${esc(ch.subtitle)}</span>` : ''}</h1>
      <p class="lead">${window.JU.textish(ch.summary || '')}</p>
      ${(ch.goals || []).length ? `<div class="goals"><b>🎯 챕터 학습 목표</b><ul>${ch.goals.map((g) => `<li>${window.JU.textish(g)}</li>`).join('')}</ul></div>` : ''}
      ${(ch.requires || []).length ? `<p class="muted">📌 선수 학습: ${ch.requires.map((id) => { const o = C.order.find((x) => x.id === id); return o ? `<a href="#${id}">${esc(o.no)} ${esc(o.title)}</a>` : esc(id); }).join(' · ')}</p>` : ''}
      ${(() => { const fin = app.shotPath(`${ch.id}-final`); if (!ch.preview && !fin) return ''; return `<div class="callout tip"><div class="ct">🖥 완성 화면 미리 보기</div>${fin || /^assets\//.test(ch.preview || '') ? `<img class="shot" src="${esc(fin || ch.preview)}" alt="완성 화면" style="max-width:100%;border:1px solid var(--line);border-radius:8px;cursor:zoom-in">` : `<pre class="term" style="background:var(--term-bg);color:var(--term-fg);padding:10px 14px;border-radius:8px;white-space:pre-wrap;margin:0">${esc(ch.preview)}</pre>`}</div>`; })()}
      <div class="meta-row">
        <a class="btn primary" href="#${ch.sections[0].id}">▶ 첫 교시 시작</a>
        <button class="btn" data-slides="${ch.sections[0].id}">🖼️ 슬라이드로 수업</button>
      </div>
      <h2>교시 구성</h2>
      <div class="sec-list">${ch.sections.map((s, i) => `<a class="sec-item" href="#${s.id}"><span class="sn">${i + 1}</span>
        <span class="st">${window.JU.textish(s.title)}<div class="sm">${secMeta(s)}</div></span><span>${app.done.has(s.id) ? '✅' : ''}</span></a>`).join('')}</div>
    </div>`;
    $('content').scrollTop = 0;
    restoreEditor(ch.id, '', '');
  }

  // ------------------------------------------------------------------ 교시(섹션) 문서
  function codeBlockHtml(b, id, opts = {}) {
    const runnable = b.run !== false;
    const stdin = b.stdin ? `<div class="stdin-hint">⌨ 입력이 필요한 예제입니다. 실행 후 콘솔 입력칸에 입력하세요. 예: <code>${esc(b.stdin.replace(/\n$/, '').replace(/\n/g, ' ⏎ '))}</code>
      ${runnable ? `<button class="btn small ghost" data-code-act="run-stdin" data-code="${id}">예시 입력으로 실행</button>` : ''}</div>` : '';
    const expect = b.expect != null && !b.nondeterministic && !opts.noExpect ? `<details class="expect"><summary>실행 결과 예시</summary><pre class="term">${esc(String(b.expect).replace(/\s+$/, ''))}</pre></details>` : '';
    const shot = b.shot ? `<figure class="shot-box"><img class="shot" src="${esc(b.shot)}" alt="${esc(b.shotCaption || 'Visual Studio 실행 화면')}" loading="lazy"><figcaption>🖥 ${esc(b.shotCaption || 'Visual Studio 에서 실행한 실제 화면')}</figcaption></figure>` : '';
    const tag = opts.tag ? `<span class="tag">${esc(opts.tag)}</span>` : '';
    const isWpf = /<Window\b|System\.Windows|\.xaml\b/.test(b.code || '');
    return `<div class="code-block${isWpf ? ' wpf' : ''}" id="cb-${id}">
      <div class="code-head"><span class="t">${tag}${isWpf ? '<span class="tag wpf">WPF</span>' : ''}${b.title ? window.JU.textish(b.title) : esc(window.JU.fileName(b.code))}</span>
        ${runnable ? `<button class="btn small primary" data-code-act="run" data-code="${id}" title="편집기로 불러와 실행">▶ 실행</button>` : '<span class="chip">실행 불가 코드 조각</span>'}
        <button class="btn small ghost" data-code-act="edit" data-code="${id}" title="아래 편집기로 불러오기">✎ 편집기로</button>
        <button class="btn small ghost" data-code-act="copy" data-code="${id}" title="코드 복사">⧉</button></div>
      <pre>${highlightLines(b.code)}</pre>${stdin}
      ${b.desc ? `<div class="code-desc">${b.desc}</div>` : ''}${shot}${expect}</div>`;
  }

  function renderSection(ch, sec) {
    const teacher = app.role === 'teacher';
    app.blockCodes = {};
    let n = 0;
    const reg = (code, title, stdin) => { const id = 'c' + (n++); app.blockCodes[id] = { code, title, stdin }; return id; };
    const idx = ch.sections.indexOf(sec);
    const all = allSections();
    const gi = all.findIndex((x) => x.sec.id === sec.id);
    const prev = all[gi - 1], next = all[gi + 1];
    let firstCode = null;

    let wpfN = 0;
    const blocks = (sec.content || []).map((b) => {
      switch (b.type) {
        case 'h': return `<h3>${esc(b.text)}</h3>`;
        case 'p': return `<p>${window.JU.scoped(b.html)}</p>`;
        case 'list': {
          const tagName = b.ordered ? 'ol' : 'ul';
          return `<${tagName}>${(b.items || []).map((i) => `<li>${i}</li>`).join('')}</${tagName}>`;
        }
        case 'table':
          return `<div class="table-wrap"><table><thead><tr>${(b.head || []).map((h) => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${(b.rows || []).map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${b.caption ? `<p class="caption">${b.caption}</p>` : ''}`;
        case 'code': {
          const id = reg(b.code, b.title, b.stdin);
          if (!firstCode && b.run !== false) firstCode = b;
          let blk = b;
          if (b.run !== false && isWpfCode(b.code)) {
            const auto = app.shotPath(`${sec.id}-${wpfN}`);
            wpfN++;
            if (!b.shot && auto) blk = Object.assign({}, b, { shot: auto });
          }
          return codeBlockHtml(blk, id, { tag: b.title && /^예제/.test(b.title) ? '예제' : b.title && /추가/.test(b.title) ? '추가' : '' });
        }
        case 'callout': {
          const icon = { tip: '💡', warn: '⚠️', info: 'ℹ️', more: '📘', vs: '🖥️' }[b.kind] || 'ℹ️';
          let t = String(b.title || '').replace(/^\s*📘?\s*더 알아보기\s*[—·:\-–]?\s*/, '').replace(/^\s*📘\s*/, '');
          t = window.JU.textish(t);
          const title = t || { tip: '팁', warn: '주의', info: '참고', more: '더 알아보기', vs: 'Visual Studio 에서' }[b.kind];
          return `<div class="callout ${esc(b.kind)}"><div class="ct">${icon} ${b.kind === 'more' && t ? '더 알아보기 · ' + t : title}</div><div>${window.JU.scoped(b.html)}</div></div>`;
        }
        case 'figure':
          return `<div class="figure">${window.JU.scoped(b.html)}${b.caption ? `<p class="caption">${b.caption}</p>` : ''}</div>`;
        case 'shot':
          return `<figure class="shot-box standalone"><img class="shot" src="${esc(b.src)}" alt="${esc(b.caption || '')}" loading="lazy">${b.caption ? `<figcaption>🖥 ${b.caption}</figcaption>` : ''}</figure>`;
        default:
          return b.html ? `<div>${b.html}</div>` : '';
      }
    }).join('\n');

    const practice = (sec.practice || []).map((p, i) => {
      const sid = reg(p.starter || '', p.title + ' (시작 코드)', p.stdin);
      const solId = p.solution ? reg(p.solution, p.title + ' (정답)', p.stdin) : null;
      const lv = '★'.repeat(p.level || 1) + '☆'.repeat(3 - (p.level || 1));
      const pShot = p.shot || app.shotPath(`${sec.id}-p${i}`);
      return `<div class="practice"><div class="practice-head"><b>🛠️ ${window.JU.textish(p.title)}</b><span class="level" title="난이도">${lv}</span></div>
        <div class="practice-body">${p.desc || ''}
          ${pShot ? `<figure class="shot-box"><img class="shot" src="${esc(pShot)}" alt="완성 화면" loading="lazy"><figcaption>🖥 ${esc(p.shotCaption || '완성 화면 (Visual Studio 실행)')}</figcaption></figure>` : ''}
          ${p.stdin ? `<p class="muted" style="font-size:13px">⌨ 입력 예: <code>${esc(p.stdin.replace(/\n$/, '').replace(/\n/g, ' ⏎ '))}</code></p>` : ''}
          ${p.expect != null && !p.nondeterministic ? `<details><summary>기대 출력 보기</summary><pre class="term" style="background:var(--term-bg);color:var(--term-fg);padding:10px 14px;border-radius:8px;white-space:pre-wrap">${esc(String(p.expect).replace(/\s+$/, ''))}</pre></details>` : ''}
          ${p.hint ? `<details><summary>💡 힌트</summary><div>${p.hint}</div></details>` : ''}
          <div class="actions"><button class="btn small primary" data-code-act="edit" data-code="${sid}">✎ 시작 코드를 편집기로</button>
            ${teacher && solId ? `<button class="btn small blue" data-code-act="run" data-code="${solId}">▶ 정답 실행</button><button class="btn small ghost" data-toggle-sol="${i}">🔑 정답 코드 보기</button>` : ''}</div>
          ${teacher && solId ? `<div class="solution hidden" data-sol="${i}">${codeBlockHtml({ code: p.solution, title: '정답 코드', stdin: p.stdin, expect: p.expect, nondeterministic: p.nondeterministic }, solId, { tag: '교사용' })}</div>` : ''}
        </div></div>`;
    }).join('');

    const quiz = (sec.quiz || []).map((q, i) => `<div class="quiz" data-quiz="${i}"><div class="q"><span class="qn">Q${i + 1}.</span>${q.q}</div>
      <div class="opts">${(q.options || []).map((o, j) => `<button class="opt" data-q="${i}" data-o="${j}"><span class="n">${j + 1}</span><span>${o}</span></button>`).join('')}</div>
      <div class="explain hidden">${teacher ? `<b>정답 ${q.answer + 1}번.</b> ` : ''}${q.explain || ''}</div></div>`).join('');

    const flow = (sec.flow || []).length ? `<div class="flow teacher-only">${sec.flow.map((f) => `<div style="flex:${f[1]}"><b>${esc(f[0])}</b> ${f[1]}분</div>`).join('')}</div>` : '';
    const done = app.done.has(sec.id);

    $('content').innerHTML = `<div class="doc">
      <span class="chapter-badge">${esc(ch.icon || '')} ${lbl(ch)} ${esc(ch.no)} · ${esc(ch.title)} · ${idx + 1}/${ch.sections.length}교시</span>
      <h1>${window.JU.textish(sec.title)}</h1>
      <div class="meta-row"><span class="chip">⏱ ${sec.minutes || 50}분</span><span class="chip">💻 예제 ${(sec.content || []).filter((b) => b.type === 'code').length}</span>
        <span class="chip">🛠️ 실습 ${(sec.practice || []).length}</span><span class="chip">❓ 퀴즈 ${(sec.quiz || []).length}</span>
        <button class="btn small ghost" data-slides="${sec.id}">🖼️ 슬라이드로 보기</button>
        ${teacher ? '<button class="btn small ghost" id="showAllAnswers">🔑 퀴즈 정답 모두 보기</button>' : ''}</div>
      ${(sec.goals || []).length ? `<div class="goals"><b>🎯 학습 목표</b><ul>${sec.goals.map((g) => `<li>${window.JU.textish(g)}</li>`).join('')}</ul></div>` : ''}
      ${flow}
      ${blocks}
      ${practice ? `<h2>🛠️ 실습 과제</h2>${practice}` : ''}
      ${quiz ? `<h2>❓ 확인 퀴즈</h2>${quiz}` : ''}
      <div class="section-end">
        <button class="btn done-btn${done ? ' done' : ''}" id="doneBtn">${done ? '✔ 학습 완료' : '☐ 학습 완료로 표시'}</button>
        <span class="spacer"></span>
        ${prev ? `<a class="btn ghost" href="#${prev.sec.id}">◀ ${window.JU.textish(prev.sec.title)}</a>` : ''}
        ${next ? `<a class="btn primary" href="#${next.sec.id}">${window.JU.textish(next.sec.title)} ▶</a>` : ''}
      </div>
    </div>`;
    $('content').scrollTop = 0;
    restoreEditor(sec.id, firstCode ? firstCode.code : '', firstCode ? firstCode.title : '');
  }

  // ================================================================== 레이아웃 (크기 조절)
  function setupLayout() {
    const root = document.documentElement;
    const nav = store.get('cs.navW', ''), out = store.get('cs.outW', ''), ed = store.get('cs.edH', '');
    if (nav) root.style.setProperty('--nav-w', nav);
    if (out) root.style.setProperty('--out-w', out);
    if (ed) root.style.setProperty('--editor-h', ed);
    if (store.get('cs.navCollapsed', '0') === '1') $('app').classList.add('nav-collapsed');

    document.querySelectorAll('[data-resize]').forEach((g) => {
      g.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        g.setPointerCapture(e.pointerId);
        g.classList.add('drag');
        const kind = g.dataset.resize;
        const move = (ev) => {
          if (kind === 'nav') {
            const w = Math.max(200, Math.min(480, ev.clientX)) + 'px';
            root.style.setProperty('--nav-w', w); store.set('cs.navW', w);
          } else if (kind === 'out') {
            const w = Math.max(260, Math.min(window.innerWidth * 0.7, window.innerWidth - ev.clientX)) + 'px';
            root.style.setProperty('--out-w', w); store.set('cs.outW', w);
          } else if (kind === 'editor') {
            const rect = $('docView').getBoundingClientRect();
            const h = Math.max(60, Math.min(rect.height - 80, rect.bottom - ev.clientY));
            const v = (h / rect.height * 100).toFixed(1) + '%';
            root.style.setProperty('--editor-h', v); store.set('cs.edH', v);
            app.editor.refresh();
          } else if (kind === 'wpf') {
            const panel = $('consolePanel').getBoundingClientRect();
            const h = Math.max(120, Math.min(panel.height - 120, ev.clientY - panel.top - 40));
            root.style.setProperty('--wpf-h', h + 'px'); store.set('cs.wpfH', h + 'px');
          }
          app.deck && app.deck.fit();
        };
        const up = () => { g.classList.remove('drag'); g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); app.editor.refresh(); };
        g.addEventListener('pointermove', move);
        g.addEventListener('pointerup', up);
      });
    });
    const wh = store.get('cs.wpfH', '');
    if (wh) root.style.setProperty('--wpf-h', wh);
  }

  // ================================================================== 실행 환경 상태 · 모달
  function engineLabel() {
    const E = window.CsEngine;
    if (!E || !E.supported()) return ['bad', '⚠ C# 실행 불가 (브라우저 미지원)'];
    if (location.protocol === 'file:') return ['bad', '⚠ 파일로 열림 — start.bat 필요'];
    if (E.state === 'ready') return ['ok', '⚙ C# 실행 환경 준비 완료'];
    if (E.state === 'loading') return ['', `⚙ 준비 중… ${E.pct ? E.pct + '%' : ''}`];
    if (E.state === 'error') return ['bad', '⚠ 실행 환경 준비 오류'];
    return ['', '⚙ C# 실행 환경 (대기)'];
  }

  function updateEngineText() {
    const [cls, text] = engineLabel();
    const b = $('serverBtn');
    b.classList.toggle('ok', cls === 'ok');
    b.classList.toggle('bad', cls === 'bad');
    $('serverText').textContent = text;
    const he = $('homeEngine');
    if (he) he.textContent = text.replace(/^⚙\s*/, '');
  }

  function setupServerBadge() {
    if (window.CsEngine) CsEngine.onChange(updateEngineText);
    else updateEngineText();
    setTimeout(() => {
      const E = window.CsEngine;
      if (E && E.supported() && E.state === 'idle' && location.protocol !== 'file:' && store.get('cs.preload', '1') === '1') E.load().catch(() => {});
    }, 2000);
  }

  function openModal(title, html) {
    $('modalTitle').textContent = title;
    $('modalBody').innerHTML = html;
    $('modal').classList.remove('hidden');
  }
  function closeModal() { $('modal').classList.add('hidden'); }

  function serverModal() {
    const E = window.CsEngine;
    const st = E ? { idle: '아직 준비 안 함', loading: E.message || '준비 중…', ready: `준비 완료 (첫 준비 ${E.loadMs ? (E.loadMs / 1000).toFixed(1) + '초' : ''})`, error: '오류: ' + E.message }[E.state] : '사용할 수 없음';
    const ok = (b) => b ? '<b style="color:var(--ok)">✔ 지원</b>' : '<b style="color:var(--danger)">✖ 미지원</b>';
    openModal('C# 실행 환경', `
      <div class="table-wrap"><table><tbody>
        <tr><th>런타임 · 컴파일러</th><td>.NET 9 (mono WebAssembly) · Roslyn C# 13 · WPF 호환 라이브러리(WpfShim)<br><b>${esc(st)}</b>
          <div style="margin-top:6px"><button class="btn small" id="engLoad" ${E && E.state !== 'idle' && E.state !== 'error' ? 'disabled' : ''}>지금 준비하기</button></div></td></tr>
        <tr><th>실행 중 입력(ReadLine)</th><td>${ok(E && E.interactive())} — ${E && E.interactive() ? '프로그램이 입력을 기다리면 콘솔 입력칸에 입력합니다. MessageBox · ShowDialog 도 진짜로 기다립니다.' : '이 창에서는 실행 전에 입력을 미리 받고, MessageBox 는 기다리지 않고 기본값을 돌려줍니다. (새로고침하면 켜질 수 있습니다)'}</td></tr>
        <tr><th>WPF</th><td>${ok(true)} — Window · 레이아웃 · 컨트롤 · 이벤트 · 바인딩 · 스타일 · MVVM · 타이머 등 강좌에서 다루는 기능을 브라우저 화면에 그립니다. (ControlTemplate · 3D · 일부 고급 기능은 미지원)</td></tr>
        <tr><th>파일 입출력</th><td>${ok(true)} — 브라우저 메모리 안의 <b>작업 폴더</b> (새로고침하면 비워짐)</td></tr>
        <tr><th>중지</th><td>${ok(true)} — 무한 반복도 <b>■ 중지</b> 버튼으로 즉시 멈춥니다. (중지하면 실행 환경을 다시 준비합니다 — 몇 초)</td></tr>
      </tbody></table></div>
      <h3>설정</h3>
      <label class="chip" style="cursor:pointer"><input type="checkbox" id="optWarn" ${store.get('cs.showWarnings', '1') === '1' ? 'checked' : ''} style="margin-right:6px">컴파일 경고 표시</label>
      <label class="chip" style="cursor:pointer"><input type="checkbox" id="optKeep" ${store.get('cs.keepConsole', '0') === '1' ? 'checked' : ''} style="margin-right:6px">실행할 때 콘솔 지우지 않기</label>
      <label class="chip" style="cursor:pointer"><input type="checkbox" id="optPre" ${store.get('cs.preload', '1') === '1' ? 'checked' : ''} style="margin-right:6px">페이지를 열면 실행 환경 미리 준비</label>
      <h3 style="margin-top:18px">내 컴퓨터에서 열기</h3>
      <p>강좌 폴더를 받아 <b>start.bat</b> (macOS/Linux: <code>./start.sh</code>, Python 3 필요)을 실행한 뒤 <code>http://localhost:8080</code> 으로 접속합니다.
      <code>index.html</code> 을 더블클릭해 파일로 열면(<code>file://</code>) 실행 환경을 불러올 수 없습니다.</p>`);
    const lb = $('engLoad');
    if (lb) lb.onclick = () => { lb.disabled = true; lb.textContent = '준비 중…'; E.load().then(serverModal, serverModal); };
    $('optWarn').onchange = (e) => store.set('cs.showWarnings', e.target.checked ? '1' : '0');
    $('optKeep').onchange = (e) => store.set('cs.keepConsole', e.target.checked ? '1' : '0');
    $('optPre').onchange = (e) => store.set('cs.preload', e.target.checked ? '1' : '0');
  }

  async function filesModal() {
    const E = window.CsEngine;
    const files = E ? await E.listFiles() : [];
    const size = (n) => n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB';
    openModal('📁 작업 폴더', `<p class="muted">파일 입출력 예제(<code>File.WriteAllText</code> 등)가 만든 파일입니다. 다음 실행에서도 그대로 읽을 수 있습니다(새로고침 · 중지하면 비워짐). 파일을 누르면 내용을 볼 수 있습니다.</p>
      <div class="file-list">${files.length ? files.map((f) => `<div class="file-row" data-file="${esc(f.name)}"><span class="fn">📄 ${esc(f.name)}</span><span class="fs">${size(f.size)}</span></div>`).join('') : '<p class="muted">아직 파일이 없습니다.</p>'}</div>
      <div id="fileView"></div>
      <div class="meta-row"><button class="btn ghost" id="filesRefresh">↻ 새로고침</button><button class="btn danger" id="filesClear">🗑 작업 폴더 비우기</button></div>`);
    $('modalBody').querySelectorAll('[data-file]').forEach((row) => row.onclick = async () => {
      const t = await E.readFile(row.dataset.file);
      $('fileView').innerHTML = t != null ? `<h4 style="margin:10px 0 4px">${esc(row.dataset.file)}</h4><pre>${esc(t)}</pre>` : '<p>읽을 수 없습니다.</p>';
    });
    $('filesRefresh').onclick = filesModal;
    $('filesClear').onclick = () => {
      if (E.running()) { app.toast('프로그램이 실행 중입니다'); return; }
      if (!confirm('작업 폴더의 파일을 모두 지울까요?')) return;
      E.clearFiles();
      setTimeout(filesModal, 200);
    };
  }

  // ================================================================== 이벤트
  function bindUi() {
    $('themeBtn').onclick = () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    document.querySelectorAll('.role-switch button').forEach((b) => b.onclick = () => setRole(b.dataset.role));
    document.querySelectorAll('.view-switch button').forEach((b) => b.onclick = () => setView(b.dataset.view));
    $('navSearch').addEventListener('input', () => buildNav());
    $('navTree').addEventListener('click', (e) => {
      const head = e.target.closest('.nav-ch-head');
      if (!head) return;
      const box = head.parentElement;
      if (!box.dataset.ch) return;
      box.classList.toggle('open');
      store.set('cs.open.' + box.dataset.ch, box.classList.contains('open') ? '1' : '0');
    });
    $('navCloseBtn').onclick = () => { $('app').classList.add('nav-collapsed'); store.set('cs.navCollapsed', '1'); setTimeout(() => { app.editor.refresh(); app.deck.fit(); }, 50); };
    $('navOpenBtn').onclick = () => { $('app').classList.remove('nav-collapsed'); store.set('cs.navCollapsed', '0'); setTimeout(() => { app.editor.refresh(); app.deck.fit(); }, 50); };
    $('prevBtn').onclick = () => app.stepSection(-1, 0);
    $('nextBtn').onclick = () => app.stepSection(1, 0);

    $('runBtn').onclick = () => runEditor();
    $('resetBtn').onclick = () => { app.editor.setValue(app.editorState.original || ''); app.toast('불러온 원래 코드로 되돌렸습니다'); };
    $('copyBtn').onclick = () => copyText(app.editor.getValue());
    $('fontUpBtn').onclick = () => setEditorFont(app.edFont + 1);
    $('fontDownBtn').onclick = () => setEditorFont(app.edFont - 1);
    $('foldBtn').onclick = () => {
      const f = $('editorPane').classList.toggle('folded');
      $('foldBtn').textContent = f ? '▴ 펼치기' : '▾ 접기';
      if (!f) app.editor.refresh();
    };
    $('serverBtn').onclick = serverModal;
    $('filesBtn').onclick = filesModal;
    $('modalClose').onclick = closeModal;
    $('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal').classList.contains('hidden')) closeModal(); });

    $('content').addEventListener('click', (e) => {
      const act = e.target.closest('[data-code-act]');
      if (act) {
        const b = app.blockCodes[act.dataset.code];
        if (!b) return;
        const a = act.dataset.codeAct;
        if (a === 'copy') return copyText(b.code);
        if (a === 'edit' || a === 'run' || a === 'run-stdin') {
          loadEditor(b.code, b.title, app.route.sec ? app.route.sec.id : null);
          if (a === 'run') runEditor();
          if (a === 'run-stdin') runEditor(b.stdin);
          if (a === 'edit') app.toast('편집기로 불러왔습니다');
        }
        return;
      }
      const img = e.target.closest('img.shot');
      if (img) { openModal(img.alt || '실행 화면', `<img src="${esc(img.getAttribute('src'))}" alt="" style="max-width:100%;display:block;margin:0 auto;border:1px solid var(--line);border-radius:8px">`); return; }
      const opt = e.target.closest('.quiz .opt');
      if (opt) {
        const q = app.route.sec.quiz[+opt.dataset.q];
        const box = opt.closest('.quiz');
        const j = +opt.dataset.o;
        opt.classList.add(j === q.answer ? 'right' : 'wrong');
        if (j === q.answer) box.querySelector('.explain').classList.remove('hidden');
        return;
      }
      const sol = e.target.closest('[data-toggle-sol]');
      if (sol) {
        const el = $('content').querySelector(`[data-sol="${sol.dataset.toggleSol}"]`);
        const hidden = el.classList.toggle('hidden');
        sol.textContent = hidden ? '🔑 정답 코드 보기' : '🔑 정답 코드 숨기기';
        return;
      }
      const sl = e.target.closest('[data-slides]');
      if (sl) { app.view = 'slides'; go(sl.dataset.slides); if (location.hash === '#' + sl.dataset.slides) render(); return; }
      const rg = e.target.closest('[data-role-go]');
      if (rg) { setRole(rg.dataset.roleGo); return; }
      if (e.target.id === 'doneBtn') { toggleDone(app.route.sec.id); render(); }
      if (e.target.id === 'showAllAnswers') {
        app.route.sec.quiz.forEach((q, i) => {
          const box = $('content').querySelector(`[data-quiz="${i}"]`);
          box.querySelector(`[data-o="${q.answer}"]`).classList.add('right');
          box.querySelector('.explain').classList.remove('hidden');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (app.view === 'slides' && app.route.type === 'section') return;
      const t = e.target;
      if (t.closest && (t.closest('.CodeMirror') || t.closest('.wpf-desktop') || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); app.stepSection(1, 0); }
      if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); app.stepSection(-1, 0); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
