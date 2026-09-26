/* WPF 화면 렌더러: 워커(WpfShim)가 보내는 UI 명령을 받아 브라우저 DOM 으로 윈도우 · 컨트롤을 그린다.
 *  명령 형식(JSON 배열): ["new", id, type, fullType] · ["prop", id, name, value] · ["children", id, [ids]]
 *                      ["window", id, "show"|"close"|"hide"|"activate", props] · ["call", id, fn, ...args] · ["anim", id, prop, from, to, ms, forever, autoReverse]
 *  DOM 이벤트는 CsEngine.uiEvent(id, name, args) 로 워커에 돌려보낸다.
 */
(function () {
  const els = new Map();          // id → 요소 기록
  const windows = new Map();      // id → { rec, frame, minimized }
  let desktop = null, taskbar = null, host = null;
  let zTop = 10, activeWin = null, dirty = new Set(), dirtyKids = new Set();
  const dialogWaiters = new Map();   // 창 id → 닫히면 호출
  let mouseStateT = 0;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const px = (v) => (v == null || v === '' || Number.isNaN(+v)) ? '' : (+v) + 'px';
  const num = (v, d) => (v == null || v === '' || Number.isNaN(+v)) ? d : +v;
  const thick = (v) => { if (v == null) return null; const p = String(v).split(',').map(Number); if (p.length === 1) return [p[0], p[0], p[0], p[0]]; if (p.length === 2) return [p[0], p[1], p[0], p[1]]; return p; };
  const thickCss = (v) => { const t = thick(v); return t ? `${t[1]}px ${t[2]}px ${t[3]}px ${t[0]}px` : ''; };
  const PANELS = new Set(['Grid', 'StackPanel', 'WrapPanel', 'DockPanel', 'Canvas', 'UniformGrid', 'VirtualizingStackPanel']);
  const KO = { OK: '확인', Cancel: '취소', Yes: '예', No: '아니요' };

  // ================================================================== 초기화
  // 디자이너는 같은 렌더러를 다른 자리(디자인 화면)에 그린다 → 실행 창과 화면이 정확히 같다
  let hostTarget = null, bare = false, designMode = false;
  function setHost(el, opts) {
    appExit();
    // 이전 자리를 비운다 — 안 비우면 id="wpfDesktop" 인 요소가 둘이 되어
    // 다음 실행 창이 숨겨진 쪽(디자인 화면)으로 들어간다
    if (host && host !== el) host.innerHTML = '';
    hostTarget = el || null;
    bare = !!(opts && opts.bare);
    host = null; desktop = null; taskbar = null;
  }
  function setDesignMode(on) {
    designMode = !!on;
    if (desktop) desktop.classList.toggle('wpf-designing', designMode);
  }
  function ensureHost() {
    if (host) return host;
    host = hostTarget || $('wpfHost');
    if (!host) return null;
    host.innerHTML = (bare ? '' : `<div class="wpf-bar"><span class="wpf-bar-title">🪟 WPF 창</span><span class="spacer"></span>
      <button class="btn small ghost" data-wpf="zoom" title="창 영역 크게 보기 / 원래대로">⛶ 크게</button>
      <button class="btn small ghost" data-wpf="closeAll" title="모든 창 닫기 (프로그램 종료)">✕ 모두 닫기</button></div>`) +
      `<div class="wpf-desktop${designMode ? ' wpf-designing' : ''}" id="wpfDesktop"><div class="wpf-taskbar" id="wpfTaskbar"></div></div>`;
    desktop = $('wpfDesktop');
    taskbar = $('wpfTaskbar');
    if (!bare) {
      host.querySelector('[data-wpf="zoom"]').onclick = () => toggleZoom();
      host.querySelector('[data-wpf="closeAll"]').onclick = () => { for (const id of [...windows.keys()]) send(id, 'close', {}); };
    }
    desktop.addEventListener('mousemove', (e) => {
      if (mouseStateT) return;
      mouseStateT = setTimeout(() => { mouseStateT = 0; }, 40);
      const w = activeWin && windows.get(activeWin);
      if (!w) return;
      const r = w.frame.querySelector('.wpf-client').getBoundingClientRect();
      send(0, 'mousestate', { wx: e.clientX - r.left, wy: e.clientY - r.top, buttons: e.buttons });
    });
    desktop.addEventListener('mousedown', () => closeMenus());
    return host;
  }
  function toggleZoom(force) {
    const on = force != null ? force : !document.body.classList.contains('wpf-zoom');
    document.body.classList.toggle('wpf-zoom', on);
    const b = host && host.querySelector('[data-wpf="zoom"]');
    if (b) b.textContent = on ? '⛶ 원래대로' : '⛶ 크게';
    if (on) { document.querySelector('#wpfHost .wpf-bar').onclick = null; }
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('wpf-zoom') && !document.querySelector('.wpf-modal')) toggleZoom(false); });

  function send(id, name, args) { if (designMode) return; if (window.CsEngine) CsEngine.uiEvent(id, name, Object.assign({ name }, args || {})); }

  // ================================================================== 명령 적용
  function apply(ops) {
    for (const op of ops) {
      try {
        switch (op[0]) {
          case 'new': els.set(op[1], { id: op[1], type: op[2], full: op[3], props: {}, children: [], dom: null, parent: null, bound: false }); break;
          case 'prop': { const el = els.get(op[1]); if (!el) break; el.props[op[2]] = op[3]; dirty.add(el.id); if (/^(Header|DockPanel\.Dock|Grid\.|Canvas\.|IsSelected|Panel\.ZIndex|Visibility)/.test(op[2]) && el.parent) dirtyKids.add(el.parent); break; }
          case 'children': { const el = els.get(op[1]); if (!el) break; el.children = op[2].slice(); el.children.forEach((cid) => { const c = els.get(cid); if (c) c.parent = el.id; }); dirtyKids.add(el.id); break; }
          case 'window': windowOp(op[1], op[2], op[3]); break;
          case 'call': callOp(op[1], op[2], op.slice(3)); break;
          case 'anim': animOp(op[1], op[2], op[3], op[4], op[5], op[6], op[7]); break;
        }
      } catch (e) { console.error('wpf op', op, e); }
    }
    flush();
  }
  function flush() {
    for (const id of dirtyKids) { const el = els.get(id); if (el && el.dom) reconcile(el); }
    for (const id of dirty) { const el = els.get(id); if (el && el.dom) paint(el); }
    dirtyKids.clear(); dirty.clear();
    for (const w of windows.values()) fitWindow(w);
  }

  // ================================================================== 창
  function windowOp(id, action, props) {
    const rec = els.get(id);
    if (!rec) return;
    if (action === 'show') { showWindow(rec, props || {}); return; }
    const w = windows.get(id);
    if (!w) return;
    if (action === 'close') { closeWindow(id); }
    else if (action === 'hide') { w.frame.style.display = 'none'; }
    else if (action === 'activate') { activate(id); }
  }
  function showWindow(rec, props) {
    ensureHost();
    if (!desktop) return;
    document.body.classList.add('wpf-active');
    if (windows.has(rec.id)) { const w0 = windows.get(rec.id); w0.frame.style.display = ''; activate(rec.id); return; }
    const frame = document.createElement('div');
    frame.className = 'wpf-win';
    frame.dataset.id = rec.id;
    frame.innerHTML = `<div class="wpf-title"><span class="wpf-ico">▣</span><span class="wpf-title-text"></span><span class="wpf-title-btns"><button data-w="min" title="최소화">─</button><button data-w="max" title="최대화">☐</button><button data-w="close" title="닫기">✕</button></span></div><div class="wpf-client"></div>`;
    const client = frame.querySelector('.wpf-client');
    rec.dom = client; rec.isWindow = true;
    desktop.insertBefore(frame, taskbar);
    const w = { rec, frame, minimized: false, maximized: false, modal: !!props.modal, owner: props.owner, cascade: props.cascade || 0, placed: false };
    windows.set(rec.id, w);
    frame.querySelector('[data-w="close"]').onclick = (e) => { e.stopPropagation(); send(rec.id, 'close', {}); };
    frame.querySelector('[data-w="min"]').onclick = (e) => { e.stopPropagation(); minimize(rec.id, true); };
    frame.querySelector('[data-w="max"]').onclick = (e) => { e.stopPropagation(); maximize(rec.id); };
    frame.querySelector('.wpf-title').ondblclick = () => maximize(rec.id);
    frame.addEventListener('mousedown', () => activate(rec.id));
    frame.addEventListener('keydown', (e) => {
      // WPF 창 안에서는 브라우저 단축키(Ctrl+S 페이지 저장, Ctrl+N 새 창 …) 대신 프로그램의 명령이 받는다
      if ((e.ctrlKey || e.metaKey) && /^[snopfhrwdgjkl]$/i.test(e.key)) e.preventDefault();
      if (e.key === 'F1' || e.key === 'F3' || e.key === 'F5' || e.key === 'F7') e.preventDefault();
      // 입력 칸 밖(게임 화면 등)에서 스페이스 · 방향키가 강좌 페이지를 스크롤하지 않도록
      const tg = e.target && e.target.tagName;
      if (/^( |Spacebar|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown|Home|End)$/.test(e.key) && !/^(INPUT|TEXTAREA|SELECT)$/.test(tg || '')) {
        if (!(e.key === ' ' && tg === 'BUTTON')) e.preventDefault();
      }
      keyEvent(rec.id, e, 'keydown'); send(0, 'keystate', keyArgs(e, 'keydown'));
    });
    frame.addEventListener('keyup', (e) => { keyEvent(rec.id, e, 'keyup'); send(0, 'keystate', keyArgs(e, 'keyup')); });
    frame.tabIndex = -1;
    dragTitle(frame, w);
    reconcile(rec);
    paint(rec);
    observeSize(rec, client);
    placeWindow(w);
    activate(rec.id);
    if (w.modal && w.owner != null) { const ow = windows.get(w.owner); if (ow) ow.frame.classList.add('wpf-blocked'); }
    updateTaskbar();
    if (window.CsApp && CsApp.onWpfWindow) CsApp.onWpfWindow(w.frame.offsetWidth, w.frame.offsetHeight);
    setTimeout(() => { const f = client.querySelector('input, textarea, select, button'); if (f) f.focus({ preventScroll: true }); else frame.focus({ preventScroll: true }); }, 30);
  }
  function fitWindow(w) {
    const p = w.rec.props;
    const f = w.frame;
    if (w.maximized) return;
    const stc = p.SizeToContent || 'Manual';
    const W = num(p.Width, NaN), H = num(p.Height, NaN);
    f.style.width = (stc === 'Width' || stc === 'WidthAndHeight') ? 'auto' : px(Number.isNaN(W) ? 525 : W);
    f.style.height = (stc === 'Height' || stc === 'WidthAndHeight') ? 'auto' : px(Number.isNaN(H) ? 350 : H);
    f.style.minWidth = px(num(p.MinWidth, 0)) || '120px';
    f.style.minHeight = px(num(p.MinHeight, 0)) || '60px';
    f.style.maxWidth = p.MaxWidth != null && Number.isFinite(+p.MaxWidth) ? px(p.MaxWidth) : '';
    f.style.maxHeight = p.MaxHeight != null && Number.isFinite(+p.MaxHeight) ? px(p.MaxHeight) : '';
    f.querySelector('.wpf-title-text').textContent = p.Title || '';
    f.classList.toggle('wpf-noresize', p.ResizeMode === 'NoResize' || p.ResizeMode === 'CanMinimize');
    f.querySelector('[data-w="max"]').style.display = (p.ResizeMode === 'NoResize' || p.ResizeMode === 'CanMinimize') ? 'none' : '';
    f.querySelector('[data-w="min"]').style.display = p.ResizeMode === 'NoResize' ? 'none' : '';
    f.classList.toggle('wpf-toolwin', p.WindowStyle === 'ToolWindow');
    f.classList.toggle('wpf-nostyle', p.WindowStyle === 'None');
    f.querySelector('.wpf-title').style.display = p.WindowStyle === 'None' ? 'none' : '';
    const client = f.querySelector('.wpf-client');
    client.style.background = p.Background || '#fff';
    if (p.WindowState === 'Maximized' && !w.maximized) maximize(w.rec.id, true);
    if (p.WindowState === 'Minimized' && !w.minimized) minimize(w.rec.id, true);
    if (p.WindowState === 'Normal' && (w.maximized || w.minimized)) { if (w.maximized) maximize(w.rec.id, false); if (w.minimized) minimize(w.rec.id, false); }
    if (p.Topmost) f.style.zIndex = 500 + (+f.style.zIndex || 0) % 100;
    if (!w.placed) { placeWindow(w); }
    else if (p.Left != null && p.Top != null && (w.lastLeft !== p.Left || w.lastTop !== p.Top) && p.WindowStartupLocation !== 'CenterScreen') { f.style.left = px(p.Left); f.style.top = px(p.Top); w.lastLeft = p.Left; w.lastTop = p.Top; }
  }
  function placeWindow(w) {
    const p = w.rec.props, f = w.frame;
    if (!f.offsetWidth) return;
    w.placed = true;
    const dw = desktop.clientWidth, dh = desktop.clientHeight - 30;
    let left, top;
    const loc = p.WindowStartupLocation || 'Manual';
    if (loc === 'CenterScreen' || (loc === 'Manual' && (p.Left == null || p.Top == null)) || loc === 'CenterOwner') {
      const ow = loc === 'CenterOwner' && w.owner != null ? windows.get(w.owner) : null;
      if (ow) { left = ow.frame.offsetLeft + (ow.frame.offsetWidth - f.offsetWidth) / 2; top = ow.frame.offsetTop + (ow.frame.offsetHeight - f.offsetHeight) / 2; }
      else if (loc === 'Manual') { left = 16 + (w.cascade % 6) * 24; top = 12 + (w.cascade % 6) * 24; }
      else { left = (dw - f.offsetWidth) / 2; top = (dh - f.offsetHeight) / 2; }
    } else { left = num(p.Left, 16); top = num(p.Top, 12); }
    left = Math.max(0, Math.min(left, Math.max(0, dw - 60)));
    top = Math.max(0, Math.min(top, Math.max(0, dh - 40)));
    f.style.left = px(Math.round(left)); f.style.top = px(Math.round(top));
    w.lastLeft = p.Left; w.lastTop = p.Top;
    send(w.rec.id, 'move', { left, top });
  }
  function activate(id) {
    const w = windows.get(id);
    if (!w) return;
    if (activeWin !== id) {
      const prev = windows.get(activeWin);
      if (prev) { prev.frame.classList.remove('active'); send(prev.rec.id, 'deactivate', {}); }
      activeWin = id;
      send(id, 'activate', {});
    }
    w.frame.classList.add('active');
    w.frame.style.zIndex = String(++zTop + (w.rec.props.Topmost ? 500 : 0));
    updateTaskbar();
  }
  function closeWindow(id) {
    const w = windows.get(id);
    if (!w) return;
    w.frame.remove();
    windows.delete(id);
    if (w.owner != null) { const ow = windows.get(w.owner); if (ow) ow.frame.classList.remove('wpf-blocked'); }
    const waiter = dialogWaiters.get(id);
    if (waiter) { dialogWaiters.delete(id); if (window.CsEngine) CsEngine.modalDepth = Math.max(0, CsEngine.modalDepth - 1); waiter(); }
    if (activeWin === id) { activeWin = null; const last = [...windows.values()].sort((a, b) => (+b.frame.style.zIndex || 0) - (+a.frame.style.zIndex || 0))[0]; if (last) activate(last.rec.id); }
    updateTaskbar();
    if (!windows.size) setTimeout(() => { if (!windows.size) document.body.classList.remove('wpf-active'); }, 400);
  }
  function minimize(id, on) {
    const w = windows.get(id); if (!w) return;
    w.minimized = on != null ? on : !w.minimized;
    w.frame.style.display = w.minimized ? 'none' : '';
    send(id, 'state', { value: w.minimized ? 'Minimized' : (w.maximized ? 'Maximized' : 'Normal') });
    if (!w.minimized) activate(id);
    updateTaskbar();
  }
  function maximize(id, force) {
    const w = windows.get(id); if (!w) return;
    if (w.rec.props.ResizeMode === 'NoResize' || w.rec.props.ResizeMode === 'CanMinimize') return;
    const on = force != null ? force : !w.maximized;
    if (on && !w.maximized) { w.saved = { l: w.frame.style.left, t: w.frame.style.top, w: w.frame.style.width, h: w.frame.style.height }; }
    w.maximized = on;
    w.frame.classList.toggle('wpf-max', on);
    if (on) { w.frame.style.left = '0'; w.frame.style.top = '0'; w.frame.style.width = '100%'; w.frame.style.height = 'calc(100% - 30px)'; }
    else if (w.saved) { Object.assign(w.frame.style, { left: w.saved.l, top: w.saved.t, width: w.saved.w, height: w.saved.h }); }
    w.frame.querySelector('[data-w="max"]').textContent = on ? '❐' : '☐';
    send(id, 'state', { value: on ? 'Maximized' : 'Normal' });
    activate(id);
  }
  function updateTaskbar() {
    if (!taskbar) return;
    taskbar.innerHTML = [...windows.values()].map((w) => `<button class="wpf-task${activeWin === w.rec.id && !w.minimized ? ' on' : ''}${w.minimized ? ' min' : ''}" data-id="${w.rec.id}">▣ ${esc(w.rec.props.Title || '창')}</button>`).join('');
    taskbar.querySelectorAll('[data-id]').forEach((b) => b.onclick = () => { const id = +b.dataset.id; const w = windows.get(id); if (!w) return; if (w.minimized) minimize(id, false); else if (activeWin === id) minimize(id, true); else activate(id); });
  }
  function dragTitle(frame, w) {
    const bar = frame.querySelector('.wpf-title');
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || w.maximized) return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      const sx = e.clientX - frame.offsetLeft, sy = e.clientY - frame.offsetTop;
      const move = (ev) => { frame.style.left = px(Math.max(-frame.offsetWidth + 80, ev.clientX - sx)); frame.style.top = px(Math.max(0, ev.clientY - sy)); };
      const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); send(w.rec.id, 'move', { left: frame.offsetLeft, top: frame.offsetTop }); };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
    });
  }
  function appExit() {
    for (const id of [...windows.keys()]) closeWindow(id);
    closeMenus();
    document.querySelectorAll('.wpf-modal').forEach((m) => m.remove());
    if (window.CsEngine) CsEngine.modalDepth = 0;
    dialogWaiters.clear();
    els.clear();
    document.body.classList.remove('wpf-active');
    toggleZoom(false);
  }
  function beginRun() { appExit(); }
  function waitDialog(id, done) {
    if (!windows.has(id)) { done(); return; }
    if (window.CsEngine) CsEngine.modalDepth++;
    dialogWaiters.set(id, done);
  }

  // ================================================================== 요소 렌더링
  function nodeFor(el) {
    if (el.dom) return el.dom;
    const t = el.type;
    let n;
    switch (t) {
      case 'TextBox': n = document.createElement(el.props.AcceptsReturn ? 'textarea' : 'input'); if (!el.props.AcceptsReturn) n.type = 'text'; n.className = 'wpf-textbox'; break;
      case 'PasswordBox': n = document.createElement('input'); n.type = 'password'; n.className = 'wpf-textbox'; break;
      case 'RichTextBox': n = document.createElement('textarea'); n.className = 'wpf-textbox'; break;
      case 'Button': case 'RepeatButton': case 'ToggleButton': n = document.createElement('button'); n.type = 'button'; n.className = 'wpf-button'; break;
      case 'CheckBox': case 'RadioButton': n = document.createElement('label'); n.className = t === 'CheckBox' ? 'wpf-check' : 'wpf-radio'; n.innerHTML = `<input type="${t === 'CheckBox' ? 'checkbox' : 'radio'}"><span class="wpf-cnt"></span>`; break;
      case 'Slider': case 'ScrollBar': n = document.createElement('input'); n.type = 'range'; n.className = 'wpf-slider'; break;
      case 'ProgressBar': n = document.createElement('div'); n.className = 'wpf-progress'; n.innerHTML = '<div class="wpf-progress-fill"></div>'; break;
      case 'ComboBox': n = document.createElement('div'); n.className = 'wpf-combo'; break;
      case 'Image': n = document.createElement('img'); n.className = 'wpf-image'; n.draggable = false; break;
      case 'DatePicker': case 'Calendar': n = document.createElement('input'); n.type = 'date'; n.className = 'wpf-textbox wpf-date'; break;
      case 'Rectangle': case 'Ellipse': case 'Line': case 'Polygon': case 'Polyline': case 'Path': n = document.createElement('div'); n.className = 'wpf-shape'; break;
      case 'Menu': n = document.createElement('ul'); n.className = 'wpf-menu'; break;
      case 'ContextMenu': n = document.createElement('ul'); n.className = 'wpf-menu wpf-ctxmenu'; break;
      case 'MenuItem': n = document.createElement('li'); n.className = 'wpf-mi'; n.innerHTML = '<span class="wpf-mi-hdr"><span class="wpf-mi-ico"></span><span class="wpf-mi-txt"></span><span class="wpf-mi-gst"></span><span class="wpf-mi-arrow"></span></span><ul class="wpf-submenu"></ul>'; break;
      case 'Separator': n = document.createElement('div'); n.className = 'wpf-sep'; break;
      case 'TabControl': n = document.createElement('div'); n.className = 'wpf-tabs'; n.innerHTML = '<div class="wpf-tabs-hdr"></div><div class="wpf-tabs-body"></div>'; break;
      case 'GroupBox': n = document.createElement('div'); n.className = 'wpf-groupbox'; n.innerHTML = '<div class="wpf-gb-hdr"></div><div class="wpf-gb-body"></div>'; break;
      case 'Expander': n = document.createElement('div'); n.className = 'wpf-expander'; n.innerHTML = '<div class="wpf-exp-hdr"><span class="wpf-exp-arrow">▶</span><span class="wpf-exp-txt"></span></div><div class="wpf-exp-body"></div>'; break;
      case 'ListView': case 'DataGrid': n = document.createElement('div'); n.className = 'wpf-listbox wpf-gridview'; break;
      case 'TreeViewItem': n = document.createElement('div'); n.className = 'wpf-tvi'; n.innerHTML = '<div class="wpf-tvi-hdr"><span class="wpf-tvi-arrow">▷</span><span class="wpf-tvi-txt"></span></div><div class="wpf-tvi-kids"></div>'; break;
      default: n = document.createElement('div'); n.className = 'wpf-' + t.toLowerCase();
    }
    n.classList.add('wpf-el');
    n.dataset.id = el.id;
    n.dataset.type = t;
    el.dom = n;
    bindEvents(el);
    return n;
  }

  /** 자식 목록을 DOM 에 반영 */
  function reconcile(el) {
    const n = nodeFor(el);
    const t = el.type;
    if (t === 'DockPanel') { renderDock(el); return; }
    if (t === 'TabControl') { renderTabs(el); return; }
    if (t === 'MenuItem') { fillChildren(el, n.querySelector('.wpf-submenu')); n.classList.toggle('has-sub', el.children.length > 0); return; }
    if (t === 'GroupBox') { fillChildren(el, n.querySelector('.wpf-gb-body')); return; }
    if (t === 'Expander') { fillChildren(el, n.querySelector('.wpf-exp-body')); return; }
    if (t === 'TreeViewItem') { fillChildren(el, n.querySelector('.wpf-tvi-kids')); return; }
    if (t === 'ComboBox') { paint(el); return; }
    if (t === 'ListView' && el.props.$grid) { paint(el); return; }
    if (t === 'DataGrid') { paint(el); return; }
    if (t === 'CheckBox' || t === 'RadioButton') { fillChildren(el, n.querySelector('.wpf-cnt')); return; }
    if (t === 'Window') { fillChildren(el, n); return; }
    fillChildren(el, n);
  }
  function fillChildren(el, container) {
    const want = el.children.map((id) => els.get(id)).filter(Boolean).filter((c) => c.props.Visibility !== 'Collapsed' || true);
    const nodes = want.map((c) => nodeFor(c));
    const cur = [...container.children].filter((x) => x.classList.contains('wpf-el'));
    let same = cur.length === nodes.length && cur.every((x, i) => x === nodes[i]);
    if (!same) {
      cur.forEach((x) => { if (!nodes.includes(x)) x.remove(); });
      nodes.forEach((x) => container.appendChild(x));
    }
    // 텍스트 내용(Content 문자열)과 자식 요소가 섞이지 않게: 자식이 있으면 텍스트 스팬 제거
    if (nodes.length) { const txt = container.querySelector(':scope > .wpf-content-text'); if (txt) txt.remove(); }
    want.forEach((c) => { if (!c.dom.isConnected || c.dom.parentNode !== container) container.appendChild(c.dom); paint(c); if (c.children.length) reconcile(c); layoutChild(c, el); });
  }
  function renderDock(el) {
    const n = nodeFor(el);
    n.innerHTML = '';
    const kids = el.children.map((id) => els.get(id)).filter(Boolean);
    const fill = el.props.LastChildFill !== false;
    let cur = n;
    cur.style.display = 'flex'; cur.style.flexDirection = 'column';
    kids.forEach((c, i) => {
      const cn = nodeFor(c); paint(c); if (c.children.length) reconcile(c);
      const last = i === kids.length - 1 && fill;
      if (last) { cur.appendChild(cn); cn.style.flex = '1 1 0'; cn.style.minHeight = '0'; cn.style.minWidth = '0'; layoutChild(c, el, 'fill'); return; }
      const dock = c.props['DockPanel.Dock'] || 'Left';
      const rest = document.createElement('div'); rest.className = 'wpf-dock-rest'; rest.style.cssText = 'flex:1 1 0;display:flex;min-width:0;min-height:0;flex-direction:column';
      cur.style.flexDirection = (dock === 'Top' || dock === 'Bottom') ? 'column' : 'row';
      if (dock === 'Top' || dock === 'Left') { cur.appendChild(cn); cur.appendChild(rest); } else { cur.appendChild(rest); cur.appendChild(cn); }
      cn.style.flex = '0 0 auto';
      layoutChild(c, el, dock);
      cur = rest;
    });
  }
  function renderTabs(el) {
    const n = nodeFor(el);
    const hdr = n.querySelector('.wpf-tabs-hdr'), body = n.querySelector('.wpf-tabs-body');
    const kids = el.children.map((id) => els.get(id)).filter(Boolean);
    const sel = num(el.props.SelectedIndex, 0);
    hdr.innerHTML = kids.map((c, i) => `<button class="wpf-tab${i === sel ? ' on' : ''}" data-i="${i}">${headerHtml(c.props.Header)}</button>`).join('');
    hdr.querySelectorAll('.wpf-tab').forEach((b) => b.onclick = () => { send(el.id, 'select', { index: +b.dataset.i }); });
    body.innerHTML = '';
    kids.forEach((c, i) => { const cn = nodeFor(c); paint(c); if (c.children.length) reconcile(c); body.appendChild(cn); cn.style.display = i === sel ? '' : 'none'; layoutChild(c, el, 'fill'); });
    n.classList.toggle('bottom', el.props.TabStripPlacement === 'Bottom');
  }
  function headerHtml(h) {
    if (h && typeof h === 'object' && h.$el != null) { const c = els.get(h.$el); if (c) { const cn = nodeFor(c); paint(c); if (c.children.length) reconcile(c); return cn.outerHTML; } }
    return accessKey(h);
  }
  function accessKey(s) { return esc(s).replace(/__/g, '\u0000').replace(/_(.)/g, '<u>$1</u>').replace(/\u0000/g, '_'); }

  /** 부모 종류에 따라 자식의 정렬 · 위치 스타일을 정한다 */
  function layoutChild(c, parent, dockHint) {
    const n = c.dom, p = c.props, pt = parent.type;
    const H = p.HorizontalAlignment || 'Stretch', V = p.VerticalAlignment || 'Stretch';
    const map = { Left: 'flex-start', Top: 'flex-start', Center: 'center', Right: 'flex-end', Bottom: 'flex-end', Stretch: 'stretch' };
    n.style.position = ''; n.style.left = ''; n.style.top = ''; n.style.right = ''; n.style.bottom = ''; n.style.gridArea = ''; n.style.justifySelf = ''; n.style.alignSelf = ''; n.style.zIndex = '';
    if (!dockHint) n.style.flex = '';
    const explicitW = p.Width != null && !Number.isNaN(+p.Width), explicitH = p.Height != null && !Number.isNaN(+p.Height);
    if (pt === 'Grid') {
      const r = num(p['Grid.Row'], 0), col = num(p['Grid.Column'], 0), rs = num(p['Grid.RowSpan'], 1), cs = num(p['Grid.ColumnSpan'], 1);
      n.style.gridArea = `${r + 1} / ${col + 1} / span ${rs} / span ${cs}`;
      n.style.justifySelf = explicitW && H === 'Stretch' ? 'center' : (map[H] || 'stretch');
      n.style.alignSelf = explicitH && V === 'Stretch' ? 'center' : (map[V] || 'stretch');
      n.style.minWidth = '0'; n.style.minHeight = '0';
    } else if (pt === 'StackPanel' || pt === 'VirtualizingStackPanel' || pt === 'StatusBar' || pt === 'ToolBar' || pt === 'ItemsControl' || pt === 'ListBox' || pt === 'Menu') {
      const horiz = (parent.props.Orientation || (pt === 'StatusBar' || pt === 'ToolBar' || pt === 'Menu' ? 'Horizontal' : 'Vertical')) === 'Horizontal';
      if (horiz) n.style.alignSelf = explicitH && V === 'Stretch' ? 'center' : (map[V] || 'stretch');
      else n.style.alignSelf = explicitW && H === 'Stretch' ? 'center' : (map[H] || 'stretch');
      n.style.flex = '0 0 auto';
    } else if (pt === 'WrapPanel' || pt === 'UniformGrid') {
      if (pt === 'WrapPanel') {
        // WPF: ItemWidth/ItemHeight 는 여백(Margin)을 포함한 칸 크기
        const mt = thick(p.Margin) || [0, 0, 0, 0];
        if (parent.props.ItemWidth != null && !Number.isNaN(+parent.props.ItemWidth)) n.style.width = px(Math.max(0, +parent.props.ItemWidth - mt[0] - mt[2]));
        if (parent.props.ItemHeight != null && !Number.isNaN(+parent.props.ItemHeight)) n.style.height = px(Math.max(0, +parent.props.ItemHeight - mt[1] - mt[3]));
      }
      else { n.style.justifySelf = map[H] || 'stretch'; n.style.alignSelf = map[V] || 'stretch'; n.style.minWidth = '0'; n.style.minHeight = '0'; }
    } else if (pt === 'Canvas') {
      n.style.position = 'absolute';
      const l = p['Canvas.Left'], t = p['Canvas.Top'], r = p['Canvas.Right'], b = p['Canvas.Bottom'];
      if (r != null && (l == null)) n.style.right = px(r); else n.style.left = px(num(l, 0));
      if (b != null && (t == null)) n.style.bottom = px(b); else n.style.top = px(num(t, 0));
      n.style.zIndex = String(num(p['Panel.ZIndex'], 0));
    } else if (pt === 'Viewbox') {
      n.style.flex = '0 0 auto'; n.style.alignSelf = 'center'; n.style.margin = thickCss(p.Margin) || '0';
    } else if (pt === 'DockPanel') {
      if (dockHint === 'Top' || dockHint === 'Bottom') n.style.alignSelf = explicitW && H === 'Stretch' ? 'center' : (map[H] || 'stretch');
      else if (dockHint === 'Left' || dockHint === 'Right') n.style.alignSelf = explicitH && V === 'Stretch' ? 'center' : (map[V] || 'stretch');
      else { n.style.alignSelf = explicitW && H === 'Stretch' ? 'center' : (map[H] || 'stretch'); }
    } else {
      // ContentControl · Border · ScrollViewer · Window: 자식이 영역을 채운다
      n.style.alignSelf = explicitH && V === 'Stretch' ? 'center' : (map[V] || 'stretch');
      n.style.justifySelf = explicitW && H === 'Stretch' ? 'center' : (map[H] || 'stretch');
      if (!explicitH && V === 'Stretch') n.style.flex = '1 1 auto';
      n.style.minWidth = '0'; n.style.minHeight = '0';
      if (H !== 'Stretch') n.style.marginLeft = H === 'Left' ? thickLeft(p) : 'auto', n.style.marginRight = H === 'Right' ? thickRight(p) : 'auto';
      if (H === 'Center') { n.style.marginLeft = 'auto'; n.style.marginRight = 'auto'; }
    }
    if (pt === 'Window' || pt === 'Border' || pt === 'ScrollViewer' || pt === 'GroupBox' || pt === 'TabItem' || pt === 'Expander' || pt === 'UserControl' || pt === 'ContentControl' || pt === 'ContentPresenter' || pt === 'Viewbox') {
      if (V !== 'Stretch') { n.style.flex = '0 0 auto'; n.style.marginTop = V === 'Top' ? thickTop(p) : 'auto'; n.style.marginBottom = V === 'Bottom' ? thickBottom(p) : 'auto'; if (V === 'Center') { n.style.marginTop = 'auto'; n.style.marginBottom = 'auto'; } }
    }
  }
  const thickLeft = (p) => { const t = thick(p.Margin); return t ? t[0] + 'px' : '0'; };
  const thickRight = (p) => { const t = thick(p.Margin); return t ? t[2] + 'px' : '0'; };
  const thickTop = (p) => { const t = thick(p.Margin); return t ? t[1] + 'px' : '0'; };
  const thickBottom = (p) => { const t = thick(p.Margin); return t ? t[3] + 'px' : '0'; };

  /** 속성을 DOM 에 반영 */
  function paint(el) {
    const n = nodeFor(el), p = el.props, t = el.type, s = n.style;
    // 공통 크기 · 여백 · 보임
    s.width = t === 'Window' ? '' : px(p.Width);
    s.height = t === 'Window' ? '' : px(p.Height);
    s.minWidth = p.MinWidth ? px(p.MinWidth) : s.minWidth;
    s.minHeight = p.MinHeight ? px(p.MinHeight) : s.minHeight;
    s.maxWidth = p.MaxWidth != null && Number.isFinite(+p.MaxWidth) ? px(p.MaxWidth) : '';
    s.maxHeight = p.MaxHeight != null && Number.isFinite(+p.MaxHeight) ? px(p.MaxHeight) : '';
    if (t !== 'Window') s.margin = thickCss(p.Margin);
    s.display = p.Visibility === 'Collapsed' ? 'none' : (n.dataset.display || '');
    s.visibility = p.Visibility === 'Hidden' ? 'hidden' : '';
    s.opacity = p.Opacity != null && p.Opacity !== 1 ? String(p.Opacity) : '';
    n.classList.toggle('wpf-disabled', p.IsEnabled === false);
    if (p.IsEnabled === false) n.querySelectorAll('input,select,textarea,button').forEach((x) => x.disabled = true); else if (n.dataset.wasDisabled) { n.querySelectorAll('input,select,textarea,button').forEach((x) => x.disabled = false); }
    if (n.tagName === 'INPUT' || n.tagName === 'BUTTON' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT') n.disabled = p.IsEnabled === false || (p.IsReadOnly === true && n.tagName === 'BUTTON');
    n.dataset.wasDisabled = p.IsEnabled === false ? '1' : '';
    s.pointerEvents = p.IsHitTestVisible === false ? 'none' : '';
    s.transform = p.RenderTransform && p.RenderTransform !== 'none' ? p.RenderTransform : '';
    if (p.RenderTransformOrigin) { const o = String(p.RenderTransformOrigin).split(','); s.transformOrigin = `${(+o[0] || 0) * 100}% ${(+o[1] || 0) * 100}%`; } else s.transformOrigin = '0 0';
    s.cursor = p.Cursor || '';
    if (p.ToolTip != null) n.title = String(p.ToolTip); else n.removeAttribute('title');
    s.overflow = p.ClipToBounds ? 'hidden' : s.overflow;
    // 글꼴 · 색
    if (p.FontSize != null) s.fontSize = px(p.FontSize);
    if (p.FontFamily) s.fontFamily = `"${p.FontFamily}", "Segoe UI", "Malgun Gothic", sans-serif`;
    if (p.FontWeight != null) s.fontWeight = String(p.FontWeight);
    if (p.FontStyle) s.fontStyle = p.FontStyle === 'Italic' || p.FontStyle === 'Oblique' ? 'italic' : 'normal';
    if ('Foreground' in p) s.color = p.Foreground || '';
    if ('Background' in p && t !== 'Window') s.background = p.Background || '';
    if ('BorderBrush' in p || 'BorderThickness' in p) { const bt = thick(p.BorderThickness); s.borderStyle = 'solid'; s.borderColor = p.BorderBrush || (bt ? 'transparent' : ''); s.borderWidth = bt ? `${bt[1]}px ${bt[2]}px ${bt[3]}px ${bt[0]}px` : ''; if (!p.BorderBrush && bt && (t === 'Button' || t === 'TextBox' || t === 'ListBox' || t === 'ComboBox')) s.borderColor = ''; }
    if ('Padding' in p) s.padding = thickCss(p.Padding);
    if (p.TextAlignment) s.textAlign = p.TextAlignment.toLowerCase();
    if (p.HorizontalContentAlignment && (t === 'Button' || t === 'Label' || t === 'ContentControl' || t === 'ListBoxItem' || t === 'TextBox')) { n.classList.remove('hc-left', 'hc-center', 'hc-right'); n.classList.add('hc-' + p.HorizontalContentAlignment.toLowerCase()); if (t === 'TextBox') s.textAlign = p.HorizontalContentAlignment.toLowerCase(); }
    if (p.VerticalContentAlignment && (t === 'Button' || t === 'Label' || t === 'ContentControl' || t === 'ListBoxItem' || t === 'TextBox')) { n.classList.remove('vc-top', 'vc-center', 'vc-bottom'); n.classList.add('vc-' + p.VerticalContentAlignment.toLowerCase()); }
    if (p.$hover) hoverStyle(el, n);
    if (p.ContextMenu != null) bindContextMenu(el, n);

    switch (t) {
      case 'TextBlock': paintTextBlock(el, n); break;
      case 'Label': case 'Button': case 'RepeatButton': case 'ToggleButton': case 'ListBoxItem': case 'ComboBoxItem': case 'ListViewItem': case 'ContentControl': case 'ContentPresenter': case 'UserControl': case 'StatusBarItem': case 'Page': case 'Frame': case 'ScrollViewer': case 'Border': case 'Viewbox': case 'TabItem': case 'ToolTip': case 'Popup': case 'DataGridRow':
        paintContent(el, n);
        if (t === 'Button') { n.classList.toggle('wpf-default', !!p.IsDefault); }
        if (t === 'ToggleButton') n.classList.toggle('on', p.IsChecked === true);
        if (t === 'ListBoxItem' || t === 'ComboBoxItem' || t === 'ListViewItem') n.classList.toggle('sel', !!p.IsSelected);
        if (t === 'ScrollViewer') { s.overflowY = ({ Disabled: 'hidden', Hidden: 'hidden', Auto: 'auto', Visible: 'scroll' })[p.VerticalScrollBarVisibility || 'Visible']; s.overflowX = ({ Disabled: 'hidden', Hidden: 'hidden', Auto: 'auto', Visible: 'scroll' })[p.HorizontalScrollBarVisibility || 'Disabled']; }
        if (t === 'Border') { const cr = thick(p.CornerRadius); s.borderRadius = cr ? `${cr[0]}px ${cr[1]}px ${cr[2]}px ${cr[3]}px` : ''; }
        break;
      case 'TextBox': case 'RichTextBox': {
        if (t === 'TextBox' && !!p.AcceptsReturn !== (n.tagName === 'TEXTAREA')) { /* 요소 종류가 바뀌면 다시 만든다 */ const old = n; el.dom = null; const nn = nodeFor(el); old.replaceWith(nn); paint(el); return; }
        if (n.value !== (p.Text || '')) n.value = p.Text || '';
        n.readOnly = !!p.IsReadOnly; n.maxLength = p.MaxLength > 0 ? p.MaxLength : 524288;
        if (n.tagName === 'TEXTAREA') { s.whiteSpace = p.TextWrapping === 'Wrap' || p.TextWrapping === 'WrapWithOverflow' ? 'pre-wrap' : 'pre'; s.overflowY = ({ Disabled: 'hidden', Hidden: 'hidden', Auto: 'auto', Visible: 'scroll' })[p.VerticalScrollBarVisibility || 'Hidden']; s.overflowX = ({ Disabled: 'hidden', Hidden: 'hidden', Auto: 'auto', Visible: 'scroll' })[p.HorizontalScrollBarVisibility || 'Hidden']; }
        if (p.CharacterCasing === 'Upper') s.textTransform = 'uppercase'; else if (p.CharacterCasing === 'Lower') s.textTransform = 'lowercase';
        break;
      }
      case 'PasswordBox': if (n.value !== (p.Password || '')) n.value = p.Password || ''; n.maxLength = p.MaxLength > 0 ? p.MaxLength : 524288; break;
      case 'CheckBox': case 'RadioButton': {
        const inp = n.querySelector('input');
        inp.checked = p.IsChecked === true; inp.indeterminate = p.IsChecked == null && 'IsChecked' in p;
        inp.disabled = p.IsEnabled === false;
        if (t === 'RadioButton') inp.name = 'rb-' + (el.parent || 0) + '-' + (p.GroupName || '');
        paintContent(el, n, n.querySelector('.wpf-cnt'));
        break;
      }
      case 'Slider': case 'ScrollBar': {
        n.min = num(p.Minimum, 0); n.max = num(p.Maximum, t === 'Slider' ? 10 : 100);
        n.step = p.IsSnapToTickEnabled ? num(p.TickFrequency, 1) : 'any';
        if (+n.value !== num(p.Value, 0)) n.value = num(p.Value, 0);
        n.classList.toggle('vertical', p.Orientation === 'Vertical');
        break;
      }
      case 'ProgressBar': {
        const f = n.querySelector('.wpf-progress-fill');
        const mn = num(p.Minimum, 0), mx = num(p.Maximum, 100), v = num(p.Value, 0);
        f.style.width = p.IsIndeterminate ? '30%' : Math.max(0, Math.min(100, (v - mn) / ((mx - mn) || 1) * 100)) + '%';
        n.classList.toggle('indet', !!p.IsIndeterminate);
        n.classList.toggle('vertical', p.Orientation === 'Vertical');
        break;
      }
      case 'ComboBox': paintCombo(el, n); break;
      case 'ListBox': n.classList.add('wpf-listbox'); n.classList.toggle('multi', p.SelectionMode && p.SelectionMode !== 'Single'); break;
      case 'ListView': if (p.$grid) paintGrid(el, n, p.$grid); else n.classList.add('wpf-listbox'); break;
      case 'DataGrid': paintGrid(el, n, p.$grid || { heads: [], rows: [] }); break;
      case 'Image': { const src = p.Source || ''; n.src = imgUrl(src); s.objectFit = ({ None: 'none', Fill: 'fill', Uniform: 'contain', UniformToFill: 'cover' })[p.Stretch || 'Uniform']; break; }
      case 'Rectangle': case 'Ellipse': case 'Line': case 'Polygon': case 'Polyline': case 'Path': paintShape(el, n); break;
      case 'Grid': {
        s.display = p.Visibility === 'Collapsed' ? 'none' : 'grid';
        s.gridTemplateRows = p.$rows || 'minmax(0, 1fr)'; s.gridTemplateColumns = p.$cols || 'minmax(0, 1fr)';
        n.classList.toggle('wpf-gridlines', !!p.ShowGridLines);
        break;
      }
      case 'StackPanel': case 'VirtualizingStackPanel': s.display = p.Visibility === 'Collapsed' ? 'none' : 'flex'; s.flexDirection = (p.Orientation || 'Vertical') === 'Horizontal' ? 'row' : 'column'; break;
      case 'WrapPanel': s.display = p.Visibility === 'Collapsed' ? 'none' : 'flex'; s.flexWrap = 'wrap'; s.flexDirection = (p.Orientation || 'Horizontal') === 'Horizontal' ? 'row' : 'column'; s.alignContent = 'flex-start'; break;
      case 'UniformGrid': {
        s.display = p.Visibility === 'Collapsed' ? 'none' : 'grid';
        const cnt = el.children.length || 1; let rows = num(p.Rows, 0), cols = num(p.Columns, 0);
        if (!rows && !cols) { cols = Math.ceil(Math.sqrt(cnt)); rows = Math.ceil(cnt / cols); } else if (!rows) rows = Math.ceil(cnt / cols); else if (!cols) cols = Math.ceil(cnt / rows);
        s.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`; s.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        break;
      }
      case 'Canvas': s.position = s.position || 'relative'; s.overflow = p.ClipToBounds ? 'hidden' : 'visible'; break;
      case 'DockPanel': s.display = p.Visibility === 'Collapsed' ? 'none' : 'flex'; break;
      case 'GroupBox': n.querySelector('.wpf-gb-hdr').innerHTML = headerHtml(p.Header); break;
      case 'Expander': n.querySelector('.wpf-exp-txt').innerHTML = headerHtml(p.Header); n.classList.toggle('open', !!p.IsExpanded); n.querySelector('.wpf-exp-arrow').textContent = p.IsExpanded ? '▼' : '▶'; break;
      case 'TabControl': renderTabs(el); break;
      case 'Menu': case 'ContextMenu': break;
      case 'MenuItem': {
        n.querySelector('.wpf-mi-txt').innerHTML = headerHtml(p.Header);
        n.querySelector('.wpf-mi-gst').textContent = p.InputGestureText || '';
        n.querySelector('.wpf-mi-ico').textContent = p.IsCheckable && p.IsChecked ? '✔' : (typeof p.Icon === 'string' ? p.Icon : '');
        n.classList.toggle('checked', !!(p.IsCheckable && p.IsChecked));
        break;
      }
      case 'TreeViewItem': n.querySelector('.wpf-tvi-txt').innerHTML = headerHtml(p.Header); n.classList.toggle('open', !!p.IsExpanded); n.classList.toggle('sel', !!p.IsSelected); n.querySelector('.wpf-tvi-arrow').textContent = el.children.length ? (p.IsExpanded ? '◢' : '▷') : ''; break;
      case 'DatePicker': case 'Calendar': if (n.value !== (p.SelectedDate || '')) n.value = p.SelectedDate || ''; break;
      case 'StatusBar': case 'ToolBar': s.display = 'flex'; break;
      case 'Separator': break;
      case 'Window': break;
    }
    if (el.parent) {
      const pe = els.get(el.parent);
      if (pe && pe.dom && n.parentNode) layoutChild(el, pe, pe.type === 'DockPanel' ? (p['DockPanel.Dock'] || 'Left') : undefined);
      if (pe && pe.type === 'Viewbox') fitViewbox(pe);
    }
    if (t === 'Viewbox') fitViewbox(el);
  }

  /** Viewbox: 자식을 원래 크기로 둔 채 영역에 맞게 확대 · 축소한다 (CSS transform) */
  function fitViewbox(el) {
    const n = el.dom;
    if (!n) return;
    n.style.display = el.props.Visibility === 'Collapsed' ? 'none' : 'flex';
    n.style.alignItems = 'center'; n.style.justifyContent = 'center'; n.style.overflow = 'hidden';
    const c = el.children.length ? els.get(el.children[0]) : null;
    if (!c || !c.dom) return;
    const cn = c.dom;
    cn.style.transform = 'none';
    requestAnimationFrame(() => {
      const cw = n.clientWidth, ch = n.clientHeight, w = cn.offsetWidth, h = cn.offsetHeight;
      if (!w || !h || !cw || !ch) return;
      const st = el.props.Stretch || 'Uniform';
      let sx = cw / w, sy = ch / h;
      if (st === 'Uniform') sx = sy = Math.min(sx, sy);
      else if (st === 'UniformToFill') sx = sy = Math.max(sx, sy);
      else if (st === 'None') sx = sy = 1;
      cn.style.transformOrigin = 'center center';
      cn.style.transform = `scale(${sx}, ${sy})`;
    });
    if (!el.vbRO && typeof ResizeObserver !== 'undefined') { el.vbRO = new ResizeObserver(() => fitViewbox(el)); el.vbRO.observe(n); }
  }
  function imgUrl(src) {
    src = String(src || '').replace(/^pack:\/\/application:,,,/, '').replace(/^siteoforigin:,,,/, '');
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    src = src.replace(/^\/+/, '').replace(/^(\.\/)+/, '');
    if (/^(images|img|assets)\//i.test(src)) src = src.replace(/^(images|img|assets)\//i, '');
    return 'assets/img/' + src;
  }
  function paintContent(el, n, container) {
    const c = container || n;
    const p = el.props;
    if (el.children.length) { const txt = c.querySelector(':scope > .wpf-content-text'); if (txt) txt.remove(); return; }
    let txt = c.querySelector(':scope > .wpf-content-text');
    if (p.Content == null || p.Content === '') { if (txt) txt.remove(); return; }
    if (!txt) { txt = document.createElement('span'); txt.className = 'wpf-content-text'; c.appendChild(txt); }
    const html = (el.type === 'Label' || el.type === 'Button' || el.type === 'CheckBox' || el.type === 'RadioButton' || el.type === 'MenuItem') ? accessKey(p.Content) : esc(p.Content);
    if (txt.innerHTML !== html) txt.innerHTML = html;
  }
  function paintTextBlock(el, n) {
    const p = el.props, s = n.style;
    s.whiteSpace = (p.TextWrapping === 'Wrap' || p.TextWrapping === 'WrapWithOverflow') ? 'pre-wrap' : 'pre';
    s.overflow = p.TextTrimming && p.TextTrimming !== 'None' ? 'hidden' : s.overflow; s.textOverflow = p.TextTrimming && p.TextTrimming !== 'None' ? 'ellipsis' : '';
    s.textDecoration = p.TextDecorations ? String(p.TextDecorations).replace('Strikethrough', 'line-through').replace('Underline', 'underline') : '';
    if (p.LineHeight != null) s.lineHeight = px(p.LineHeight);
    if (p.$inlines && p.$inlines.length) n.innerHTML = p.$inlines.map(inlineHtml).join('');
    else if (n.textContent !== (p.Text || '')) n.textContent = p.Text || '';
  }
  function inlineHtml(i) {
    if (i.t === 'br') return '<br>';
    const st = [i.fg ? `color:${i.fg}` : '', i.fw && i.fw !== 400 ? `font-weight:${i.fw}` : '', i.fs ? `font-size:${i.fs}px` : '', i.it ? 'font-style:italic' : '', i.td ? `text-decoration:${String(i.td).replace('Strikethrough', 'line-through').toLowerCase()}` : ''].filter(Boolean).join(';');
    if (i.t === 'run') return `<span style="${st}">${esc(i.text)}</span>`;
    const inner = (i.inlines || []).map(inlineHtml).join('');
    if (i.t === 'bold') return `<b style="${st}">${inner}</b>`;
    if (i.t === 'italic') return `<i style="${st}">${inner}</i>`;
    if (i.t === 'underline') return `<u style="${st}">${inner}</u>`;
    if (i.t === 'hyperlink') return `<a href="#" style="${st}" onclick="return false">${inner}</a>`;
    return `<span style="${st}">${inner}</span>`;
  }
  function paintCombo(el, n) {
    const p = el.props;
    const kids = el.children.map((id) => els.get(id)).filter(Boolean);
    const sel = num(p.SelectedIndex, -1);
    const editable = !!p.IsEditable;
    if (editable) {
      n.innerHTML = `<input class="wpf-textbox wpf-combo-input" list="cb-${el.id}" value="${esc(p.Text != null ? p.Text : (sel >= 0 && kids[sel] ? itemText(kids[sel]) : ''))}"><datalist id="cb-${el.id}">${kids.map((k) => `<option value="${esc(itemText(k))}">`).join('')}</datalist>`;
      const inp = n.querySelector('input');
      inp.oninput = () => { send(el.id, 'input', { value: inp.value }); const i = kids.findIndex((k) => itemText(k) === inp.value); if (i >= 0) send(el.id, 'select', { index: i }); };
      inp.readOnly = !!p.IsReadOnly;
    } else {
      const html = `<select class="wpf-select">${sel < 0 ? '<option value="-1" selected hidden></option>' : ''}${kids.map((k, i) => `<option value="${i}"${i === sel ? ' selected' : ''}>${esc(itemText(k))}</option>`).join('')}</select>`;
      if (n.innerHTML !== html) n.innerHTML = html;
      const s = n.querySelector('select');
      s.onchange = () => send(el.id, 'select', { index: +s.value });
      s.disabled = p.IsEnabled === false;
    }
  }
  function itemText(k) {
    if (!k) return '';
    if (k.props.Content != null && !k.children.length) return String(k.props.Content);
    if (k.children.length) { const c = els.get(k.children[0]); if (c) { paint(c); return c.dom ? c.dom.textContent : ''; } }
    return k.props.Text != null ? String(k.props.Text) : '';
  }
  function paintGrid(el, n, g) {
    const p = el.props;
    const sel = num(p.SelectedIndex, -1);
    const heads = g.heads || [], rows = g.rows || [], kinds = g.kinds || [], widths = g.widths || [];
    const showHead = el.type === 'DataGrid' ? (p.HeadersVisibility == null || p.HeadersVisibility === 'Column' || p.HeadersVisibility === 'All') : true;
    let html = '<table class="wpf-table">';
    if (showHead && heads.length) html += `<thead><tr>${heads.map((h, i) => `<th style="${widths[i] != null && widths[i] !== 'Auto' && widths[i] !== '' && !String(widths[i]).endsWith('*') ? 'width:' + parseFloat(widths[i]) + 'px' : ''}">${esc(h)}</th>`).join('')}</tr></thead>`;
    html += '<tbody>' + rows.map((r, ri) => `<tr class="${ri === sel ? 'sel' : ''}${ri % 2 ? ' alt' : ''}" data-i="${ri}">${r.map((c, ci) => kinds[ci] === 'check' ? `<td><input type="checkbox" ${c === 'True' ? 'checked' : ''} disabled></td>` : `<td data-c="${ci}">${esc(c)}</td>`).join('')}</tr>`).join('');
    if (el.type === 'DataGrid' && p.CanUserAddRows !== false && !p.IsReadOnly) html += `<tr class="newrow"><td colspan="${Math.max(1, heads.length)}"></td></tr>`;
    html += '</tbody></table>';
    if (n.innerHTML !== html) n.innerHTML = html;
    if (p.AlternatingRowBackground) n.querySelectorAll('tr.alt').forEach((tr) => tr.style.background = p.AlternatingRowBackground);
    if (p.RowBackground) n.querySelectorAll('tbody tr:not(.alt):not(.sel)').forEach((tr) => tr.style.background = p.RowBackground);
    n.querySelectorAll('tbody tr[data-i]').forEach((tr) => {
      tr.onclick = () => send(el.id, 'select', { index: +tr.dataset.i, indices: [+tr.dataset.i] });
      if (el.type === 'DataGrid' && !p.IsReadOnly) tr.querySelectorAll('td[data-c]').forEach((td) => td.ondblclick = () => {
        const inp = document.createElement('input'); inp.className = 'wpf-cell-edit'; inp.value = td.textContent;
        td.textContent = ''; td.appendChild(inp); inp.focus(); inp.select();
        const done = (commit) => { const v = inp.value; td.textContent = commit ? v : inp.defaultValue; if (commit) send(el.id, 'edit', { row: +tr.dataset.i, col: +td.dataset.c, value: v }); };
        inp.onblur = () => done(true); inp.onkeydown = (e) => { if (e.key === 'Enter') { inp.onblur = null; done(true); } if (e.key === 'Escape') { inp.onblur = null; done(false); } e.stopPropagation(); };
      });
    });
    n.classList.toggle('nolines', p.GridLinesVisibility === 'None');
  }
  // SVG 는 선 끝 모양이 하나뿐 → 시작 · 끝 중 둥근/사각 모양이 있으면 그것을 쓴다
  function capCss(a, b) {
    const c = [String(a || 'Flat').toLowerCase(), String(b || 'Flat').toLowerCase()];
    return c.includes('round') ? 'round' : c.includes('square') ? 'square' : 'butt';
  }
  function paintShape(el, n) {
    const p = el.props, t = el.type;
    const fill = p.Fill || 'none', stroke = p.Stroke || 'none', sw = num(p.StrokeThickness, 1);
    const W = num(p.Width, NaN), H = num(p.Height, NaN);
    const dash = p.StrokeDashArray ? String(p.StrokeDashArray).split(' ').map((d) => +d * sw).join(' ') : '';
    const common = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linecap="${capCss(p.StrokeStartLineCap, p.StrokeEndLineCap)}" stroke-linejoin="${(p.StrokeLineJoin || 'miter').toLowerCase()}"`;
    let inner = '', w = W, h = H, view = '';
    const half = sw / 2;
    if (t === 'Rectangle') inner = `<rect x="${half}" y="${half}" width="calc(100% - ${sw}px)" height="calc(100% - ${sw}px)" rx="${num(p.RadiusX, 0)}" ry="${num(p.RadiusY, 0)}" ${common}/>`;
    else if (t === 'Ellipse') inner = `<ellipse cx="50%" cy="50%" rx="calc(50% - ${half}px)" ry="calc(50% - ${half}px)" ${common}/>`;
    else if (t === 'Line') { const x1 = num(p.X1, 0), y1 = num(p.Y1, 0), x2 = num(p.X2, 0), y2 = num(p.Y2, 0); inner = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${common}/>`; if (Number.isNaN(w)) w = Math.max(x1, x2) + sw; if (Number.isNaN(h)) h = Math.max(y1, y2) + sw; }
    else if (t === 'Polygon' || t === 'Polyline') { const pts = String(p.Points || '').trim(); const nums = pts.split(/[\s,]+/).map(Number).filter((x) => !Number.isNaN(x)); let mx = 0, my = 0; for (let i = 0; i + 1 < nums.length; i += 2) { mx = Math.max(mx, nums[i]); my = Math.max(my, nums[i + 1]); } inner = `<${t === 'Polygon' ? 'polygon' : 'polyline'} points="${esc(pts)}" fill-rule="${p.FillRule === 'Nonzero' ? 'nonzero' : 'evenodd'}" ${common}/>`; if (Number.isNaN(w)) w = mx + sw; if (Number.isNaN(h)) h = my + sw; }
    else if (t === 'Path') { inner = `<path d="${esc(p.Data || '')}" ${common}/>`; if (Number.isNaN(w)) w = 1; if (Number.isNaN(h)) h = 1; }
    const stretch = p.Stretch && p.Stretch !== 'None' && (t === 'Polygon' || t === 'Polyline' || t === 'Path');
    n.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block;overflow:visible"${stretch ? ` viewBox="0 0 ${w} ${h}" preserveAspectRatio="${p.Stretch === 'Uniform' ? 'xMidYMid meet' : p.Stretch === 'UniformToFill' ? 'xMidYMid slice' : 'none'}"` : ''}>${inner}</svg>`;
    if (!Number.isNaN(w) && Number.isNaN(W)) n.style.width = px(w);
    if (!Number.isNaN(h) && Number.isNaN(H)) n.style.height = px(h);
    if (Number.isNaN(W) && (t === 'Rectangle' || t === 'Ellipse')) n.style.width = '';
    if (Number.isNaN(H) && (t === 'Rectangle' || t === 'Ellipse')) n.style.height = '';
    n.style.overflow = 'visible';
  }
  function hoverStyle(el, n) {
    if (n.dataset.hoverBound) return;
    n.dataset.hoverBound = '1';
    const map = { Background: 'background', Foreground: 'color', BorderBrush: 'borderColor', Opacity: 'opacity', FontWeight: 'fontWeight', Fill: 'fill', Stroke: 'stroke' };
    n.addEventListener('mouseenter', () => { const h = el.props.$hover || {}; n._hsave = {}; for (const k in h) { const css = map[k]; if (!css) continue; n._hsave[css] = n.style[css]; if (css === 'fill' || css === 'stroke') { n.querySelectorAll('svg *').forEach((x) => x.setAttribute(css, h[k])); } else n.style[css] = h[k]; } });
    n.addEventListener('mouseleave', () => { const sv = n._hsave || {}; for (const css in sv) n.style[css] = sv[css]; paint(el); });
  }

  // ================================================================== 이벤트
  function relArgs(el, e, extra) {
    const n = el.dom;
    const r = n.getBoundingClientRect();
    const w = findWindow(el);
    const cr = w && w.frame ? w.frame.querySelector('.wpf-client').getBoundingClientRect() : r;
    const anc = {};
    for (let p = el.parent; p != null; p = (els.get(p) || {}).parent) { const pe = els.get(p); if (!pe || !pe.dom) break; const pr = pe.dom.getBoundingClientRect(); anc[p] = [pr.left - cr.left, pr.top - cr.top]; }
    const srcEl = e.target && e.target.closest ? e.target.closest('.wpf-el') : null;
    return Object.assign({ x: e.clientX - r.left, y: e.clientY - r.top, wx: e.clientX - cr.left, wy: e.clientY - cr.top, button: e.button, buttons: e.buttons, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, clicks: e.detail || 1, delta: e.deltaY != null ? -Math.sign(e.deltaY) * 120 : 0, anc, src: srcEl ? +srcEl.dataset.id : el.id }, extra || {});
  }
  function findWindow(el) { for (let e = el; e; e = els.get(e.parent)) { if (windows.has(e.id)) return windows.get(e.id); if (e.parent == null) break; } return null; }
  function keyArgs(e, name) { const t = e.target; return { name, key: e.key, code: e.code, repeat: e.repeat, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, text: !!(t && t.matches && t.matches('input, textarea, select')) }; }
  function keyEvent(id, e, name) { if (e.target.closest('.wpf-modal')) return; send(id, name, keyArgs(e, name)); }

  function bindEvents(el) {
    const n = el.dom, t = el.type;
    const stop = (e) => e.stopPropagation();
    switch (t) {
      case 'Button': case 'RepeatButton': n.addEventListener('click', (e) => { e.stopPropagation(); if (el.props.IsEnabled !== false) send(el.id, 'click', {}); }); break;
      case 'ToggleButton': n.addEventListener('click', (e) => { e.stopPropagation(); if (el.props.IsEnabled === false) return; const v = el.props.IsChecked === true ? false : true; el.props.IsChecked = v; n.classList.toggle('on', v); send(el.id, 'toggle', { checked: v }); }); break;
      case 'CheckBox': case 'RadioButton': {
        const inp = n.querySelector('input');
        inp.addEventListener('change', () => {
          let v = inp.checked;
          if (t === 'CheckBox' && el.props.IsThreeState) { const cur = el.props.IsChecked; v = cur === false ? true : cur === true ? null : false; inp.checked = v === true; inp.indeterminate = v == null; }
          el.props.IsChecked = v;
          if (t === 'RadioButton') { const par = els.get(el.parent); if (par) par.children.forEach((cid) => { const c = els.get(cid); if (c && c !== el && c.type === 'RadioButton' && (c.props.GroupName || '') === (el.props.GroupName || '')) { c.props.IsChecked = false; const ci = c.dom && c.dom.querySelector('input'); if (ci) ci.checked = false; } }); }
          send(el.id, 'toggle', { checked: v });
        });
        n.addEventListener('click', stop);
        break;
      }
      case 'TextBox': case 'RichTextBox':
        n.addEventListener('input', () => { el.props.Text = n.value; send(el.id, 'input', { value: n.value, selStart: n.selectionStart || 0 }); });
        {
          // 캐럿 · 선택 영역이 바뀌면 알린다 (방향키 · 클릭 포함) — WPF 의 SelectionChanged
          let lastSel = '';
          const reportSel = () => { const s = n.selectionStart || 0, l = (n.selectionEnd || 0) - s, k = s + ':' + l; if (k === lastSel) return; lastSel = k; send(el.id, 'select', { selStart: s, selLength: l }); };
          n.addEventListener('select', reportSel);
          n.addEventListener('keyup', (e) => { if (/^(Arrow|Home|End|Page)/.test(e.key)) reportSel(); });
          n.addEventListener('mouseup', () => setTimeout(reportSel, 0));
          n.addEventListener('input', () => { lastSel = (n.selectionStart || 0) + ':0'; });
        }
        n.addEventListener('keydown', (e) => { if (e.key === 'Enter' && n.tagName === 'INPUT') { const w = findWindow(el); const def = w && w.rec.dom.querySelector('.wpf-button.wpf-default'); if (def && !el.props.AcceptsReturn) { setTimeout(() => def.click(), 0); } } });
        break;
      case 'PasswordBox': n.addEventListener('input', () => { el.props.Password = n.value; send(el.id, 'input', { value: n.value }); }); break;
      case 'Slider': case 'ScrollBar': n.addEventListener('input', () => { el.props.Value = +n.value; send(el.id, 'change', { value: +n.value }); }); break;
      case 'DatePicker': case 'Calendar': n.addEventListener('change', () => { el.props.SelectedDate = n.value; send(el.id, 'change', { value: n.value }); }); break;
      case 'ListBox': case 'ListView': n.addEventListener('click', (e) => {
        const item = e.target.closest('.wpf-listboxitem, .wpf-comboboxitem, .wpf-listviewitem');
        if (!item || !n.contains(item)) return;
        const idx = el.children.indexOf(+item.dataset.id);
        if (idx < 0) return;
        let indices = [idx];
        const multi = el.props.SelectionMode && el.props.SelectionMode !== 'Single';
        if (multi && (e.ctrlKey || el.props.SelectionMode === 'Multiple')) { const cur = [...n.querySelectorAll(':scope > .sel')].map((x) => el.children.indexOf(+x.dataset.id)); indices = cur.includes(idx) ? cur.filter((i) => i !== idx) : cur.concat(idx); }
        else if (multi && e.shiftKey && n._anchor != null) { const a = Math.min(n._anchor, idx), b = Math.max(n._anchor, idx); indices = []; for (let i = a; i <= b; i++) indices.push(i); }
        else n._anchor = idx;
        el.children.forEach((cid, i) => { const c = els.get(cid); if (c && c.dom) { c.props.IsSelected = indices.includes(i); c.dom.classList.toggle('sel', indices.includes(i)); } });
        send(el.id, 'select', { index: idx, indices });
      }); break;
      case 'MenuItem': {
        const hdr = n.querySelector('.wpf-mi-hdr');
        hdr.addEventListener('click', (e) => {
          e.stopPropagation();
          if (el.props.IsEnabled === false) return;
          if (el.children.length) { const open = n.classList.toggle('open'); n.parentElement.querySelectorAll(':scope > .wpf-mi.open').forEach((x) => { if (x !== n) x.classList.remove('open'); }); if (!open) closeMenus(n.closest('.wpf-menu')); return; }
          closeMenus();
          send(el.id, 'click', {});
        });
        hdr.addEventListener('mouseenter', () => { const sib = n.parentElement && n.parentElement.querySelector(':scope > .wpf-mi.open'); if (sib && sib !== n && el.children.length) { sib.classList.remove('open'); n.classList.add('open'); } else if (n.parentElement && n.parentElement.classList.contains('wpf-submenu') && el.children.length) { n.parentElement.querySelectorAll(':scope > .wpf-mi.open').forEach((x) => x.classList.remove('open')); n.classList.add('open'); } });
        break;
      }
      case 'Expander': n.querySelector('.wpf-exp-hdr').addEventListener('click', (e) => { e.stopPropagation(); const v = !el.props.IsExpanded; el.props.IsExpanded = v; paint(el); send(el.id, 'toggle', { checked: v }); }); break;
      case 'TreeViewItem': {
        n.querySelector('.wpf-tvi-arrow').addEventListener('click', (e) => { e.stopPropagation(); const v = !el.props.IsExpanded; el.props.IsExpanded = v; paint(el); send(el.id, 'toggle', { checked: v }); });
        n.querySelector('.wpf-tvi-txt').addEventListener('click', (e) => { e.stopPropagation(); send(el.id, 'select', {}); });
        n.querySelector('.wpf-tvi-txt').addEventListener('dblclick', (e) => { e.stopPropagation(); const v = !el.props.IsExpanded; el.props.IsExpanded = v; paint(el); send(el.id, 'toggle', { checked: v }); });
        break;
      }
    }
    if (t === 'Window' || t === 'Canvas' || PANELS.has(t) || t === 'Border') observeSize(el, n);
  }
  function observeSize(el, n) {
    if (el.ro || typeof ResizeObserver === 'undefined') return;
    el.ro = new ResizeObserver(() => { const r = n.getBoundingClientRect(); if (r.width || r.height) send(el.id, 'size', { w: r.width, h: r.height }); });
    el.ro.observe(n);
  }
  /** $events 목록에 따라 일반 마우스 · 키보드 리스너를 붙인다 */
  function bindGeneric(el) {
    const n = el.dom, list = el.props.$events || [];
    el.bound = el.bound || new Set();
    for (const ev of list) {
      if (el.bound.has(ev)) continue;
      el.bound.add(ev);
      const h = (e) => {
        if (e.target.closest('.wpf-modal')) return;
        if (ev === 'keydown' || ev === 'keyup') { if (el.type !== 'Window') send(el.id, ev, keyArgs(e, ev)); return; }
        if (ev === 'focus' || ev === 'blur') { send(el.id, ev, {}); return; }
        if (ev === 'textinput') { if (e.data) send(el.id, 'textinput', { text: e.data }); return; }
        if (ev === 'size') return;
        if (ev === 'mousemove') { const now = performance.now(); if (n._mmT && now - n._mmT < 25) return; n._mmT = now; }
        send(el.id, ev, relArgs(el, e, { name: ev }));
        if (ev === 'wheel') e.preventDefault();
      };
      const dom = ev === 'textinput' ? 'beforeinput' : ev;
      if (ev === 'size') { observeSize(el, n); continue; }
      n.addEventListener(dom, h, { passive: ev !== 'wheel' });
    }
  }
  const _paint = paint;
  paint = function (el) {
    _paint(el);
    if (el.props.$events) bindGeneric(el);
    // Focusable="False": 클릭해도 포커스를 가져가지 않는다 (계산기 버튼 등 — 키 입력은 창이 계속 받음)
    const n = el.dom;
    if (n && el.props.Focusable === false && !n.dataset.nofocus) {
      n.dataset.nofocus = '1'; n.tabIndex = -1;
      n.addEventListener('mousedown', (e) => { if (el.props.Focusable === false) e.preventDefault(); });
    }
  };

  // 마우스 캡처 (CaptureMouse): 요소 밖으로 나가도 이동 · 놓기 이벤트를 그 요소가 받는다
  let captured = null, capT = 0;
  function sendCaptured(e, ev) {
    if (!captured || !captured.dom || !captured.bound || !captured.bound.has(ev)) return;
    if (captured.dom.contains(e.target)) return;   // 안쪽이면 원래 처리기가 보낸다
    if (ev === 'mousemove') { const now = performance.now(); if (now - capT < 25) return; capT = now; }
    send(captured.id, ev, relArgs(captured, e, { name: ev, src: captured.id }));
  }
  document.addEventListener('mousemove', (e) => sendCaptured(e, 'mousemove'), true);
  document.addEventListener('mouseup', (e) => { sendCaptured(e, 'mouseup'); }, true);

  function bindContextMenu(el, n) {
    if (n.dataset.ctx) return;
    n.dataset.ctx = '1';
    n.addEventListener('contextmenu', (e) => {
      e.preventDefault(); e.stopPropagation();
      const cm = els.get(el.props.ContextMenu);
      if (!cm) return;
      closeMenus();
      const m = nodeFor(cm); paint(cm); reconcile(cm);
      m.classList.add('open');
      desktop.appendChild(m);
      const r = desktop.getBoundingClientRect();
      m.style.left = px(e.clientX - r.left + desktop.scrollLeft); m.style.top = px(e.clientY - r.top + desktop.scrollTop);
    });
  }
  function closeMenus(except) {
    document.querySelectorAll('.wpf-mi.open').forEach((x) => { if (!except || !except.contains(x)) x.classList.remove('open'); });
    document.querySelectorAll('.wpf-ctxmenu.open').forEach((x) => x.classList.remove('open'));
  }
  document.addEventListener('mousedown', (e) => { if (!e.target.closest('.wpf-menu')) closeMenus(); });

  // ================================================================== call · anim
  function callOp(id, fn, args) {
    const el = els.get(id); if (!el || !el.dom) return;
    const n = el.dom;
    const inp = n.matches('input,textarea') ? n : n.querySelector('input,textarea');
    switch (fn) {
      case 'focus': (inp || n.querySelector('button,select,[tabindex]') || n).focus({ preventScroll: true }); break;
      case 'selectAll': if (inp && inp.select) inp.select(); break;
      case 'select': if (inp && inp.setSelectionRange) { try { inp.setSelectionRange(args[0] || 0, (args[0] || 0) + (args[1] || 0)); } catch (e) { /* 무시 */ } } break;
      case 'scrollToEnd': (inp || n).scrollTop = (inp || n).scrollHeight; break;
      case 'scrollToTop': (inp || n).scrollTop = 0; break;
      case 'scrollTo': (inp || n).scrollTop = args[0] || 0; break;
      case 'scrollIntoView': n.scrollIntoView({ block: 'nearest' }); break;
      case 'capture': captured = el; break;
      case 'release': if (captured === el) captured = null; break;
    }
  }
  function animOp(id, prop, from, to, ms, forever, autoReverse) {
    const el = els.get(id); if (!el || !el.dom || !el.dom.animate) return;
    const n = el.dom;
    const css = { Opacity: 'opacity', Width: 'width', Height: 'height', 'Canvas.Left': 'left', 'Canvas.Top': 'top', Background: 'backgroundColor', Foreground: 'color', Fill: 'fill', FontSize: 'fontSize', Angle: 'rotate' }[prop] || null;
    if (!css) return;
    const unit = (css === 'opacity' || css === 'backgroundColor' || css === 'color' || css === 'fill') ? '' : css === 'rotate' ? 'deg' : 'px';
    const f = {}, t = {};
    if (from != null) f[css] = from + unit; t[css] = to + unit;
    try { n.animate(from != null ? [f, t] : [t], { duration: ms, iterations: forever ? Infinity : 1, direction: autoReverse ? 'alternate' : 'normal', fill: 'forwards', easing: 'ease-in-out' }); } catch (e) { /* 무시 */ }
  }

  // ================================================================== 메시지 박스 · 파일 대화상자
  function modal(html, cls) {
    ensureHost();
    const m = document.createElement('div');
    m.className = 'wpf-modal ' + (cls || '');
    m.innerHTML = html;
    (desktop || document.body).appendChild(m);
    document.body.classList.add('wpf-active');
    const first = m.querySelector('button.default, button');
    if (first) setTimeout(() => first.focus(), 20);
    return m;
  }
  function messageBox(o, reply) {
    const btns = { OK: ['OK'], OKCancel: ['OK', 'Cancel'], YesNo: ['Yes', 'No'], YesNoCancel: ['Yes', 'No', 'Cancel'] }[o.button] || ['OK'];
    const icon = { Error: '⛔', Hand: '⛔', Stop: '⛔', Question: '❓', Exclamation: '⚠️', Warning: '⚠️', Information: 'ℹ️', Asterisk: 'ℹ️' }[o.icon] || '';
    const def = o.def && btns.includes(o.def) ? o.def : btns[0];
    const m = modal(`<div class="wpf-mbox"><div class="wpf-title"><span class="wpf-title-text">${esc(o.caption)}</span><span class="wpf-title-btns"><button data-r="${btns.includes('Cancel') ? 'Cancel' : btns.includes('No') && !btns.includes('Cancel') ? '' : 'OK'}" ${o.button === 'YesNo' ? 'disabled' : ''}>✕</button></span></div>
      <div class="wpf-mbox-body">${icon ? `<span class="wpf-mbox-icon">${icon}</span>` : ''}<div class="wpf-mbox-text">${esc(o.text)}</div></div>
      <div class="wpf-mbox-btns">${btns.map((b) => `<button data-r="${b}" class="${b === def ? 'default' : ''}">${KO[b]}</button>`).join('')}</div></div>`);
    if (window.CsEngine) CsEngine.modalDepth++;
    const finish = (r) => { m.remove(); if (window.CsEngine) CsEngine.modalDepth = Math.max(0, CsEngine.modalDepth - 1); reply(r); };
    m.querySelectorAll('[data-r]').forEach((b) => b.onclick = () => { if (b.dataset.r) finish(b.dataset.r); });
    m.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') finish(btns.includes('Cancel') ? 'Cancel' : btns.includes('No') ? 'No' : 'OK'); if (e.key === 'Enter') finish(def); });
    if (window.CsApp && CsApp.onWpfWindow) CsApp.onWpfWindow(380, 160);
  }
  function fileDialog(o, reply) {
    const filters = String(o.filter || '').split('|');
    const opts = []; for (let i = 0; i + 1 < filters.length; i += 2) opts.push([filters[i], filters[i + 1]]);
    const m = modal(`<div class="wpf-mbox wpf-fdlg"><div class="wpf-title"><span class="wpf-title-text">${esc(o.title || (o.kind === 'open' ? '열기' : '다른 이름으로 저장'))}</span><span class="wpf-title-btns"><button data-r="">✕</button></span></div>
      <div class="wpf-fdlg-body"><div class="wpf-fdlg-path">📁 ${esc(o.dir || '/work')} <span class="muted">(브라우저 메모리 안의 작업 폴더)</span></div>
      <div class="wpf-fdlg-list">${(o.files || []).length ? o.files.map((f) => `<div class="wpf-fdlg-file" data-f="${esc(f)}">📄 ${esc(f)}</div>`).join('') : '<div class="muted" style="padding:8px">파일이 없습니다</div>'}</div>
      <div class="wpf-fdlg-row"><label>파일 이름:</label><input type="text" class="wpf-textbox" value="${esc(o.fileName || '')}"><select class="wpf-select">${opts.map((x) => `<option>${esc(x[0])}</option>`).join('') || '<option>모든 파일 (*.*)</option>'}</select></div></div>
      <div class="wpf-mbox-btns"><button data-r="ok" class="default">${o.kind === 'open' ? '열기(O)' : '저장(S)'}</button><button data-r="">취소</button></div></div>`);
    if (window.CsEngine) CsEngine.modalDepth++;
    const inp = m.querySelector('input');
    const finish = (r) => { m.remove(); if (window.CsEngine) CsEngine.modalDepth = Math.max(0, CsEngine.modalDepth - 1); reply(r); };
    m.querySelectorAll('.wpf-fdlg-file').forEach((f) => { f.onclick = () => { m.querySelectorAll('.wpf-fdlg-file').forEach((x) => x.classList.remove('sel')); f.classList.add('sel'); inp.value = f.dataset.f; }; f.ondblclick = () => finish(f.dataset.f); });
    m.querySelectorAll('[data-r]').forEach((b) => b.onclick = () => finish(b.dataset.r === 'ok' ? inp.value.trim() : ''));
    m.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') finish(''); if (e.key === 'Enter') finish(inp.value.trim()); });
    setTimeout(() => inp.focus(), 30);
  }

  window.WpfRender = {
    apply, appExit, beginRun, waitDialog, messageBox, fileDialog, toggleZoom,
    hasWindows: () => windows.size > 0,
    // 디자이너용
    setHost, setDesignMode,
    nodeOf: (id) => { const e = els.get(id); return e ? e.dom : null; },
    frameOf: (id) => { const w = windows.get(id); return w ? w.frame : null; },
    clientOf: (id) => { const w = windows.get(id); return w ? w.frame.querySelector('.wpf-client') : null; },
    idOfNode: (node) => { const el = node && node.closest ? node.closest('.wpf-el') : null; return el ? +el.dataset.id : null; },
  };
})();
