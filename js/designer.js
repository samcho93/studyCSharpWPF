/* XAML 비주얼 디자이너
 *
 * Visual Studio 의 디자이너처럼 컨트롤을 끌어다 놓아 화면을 꾸민다.
 *
 * 원칙
 *  1) XAML 텍스트가 원본이다. 모든 조작은 편집기 텍스트를 고치는 것으로 끝난다
 *     → 되돌리기(Ctrl+Z)가 그대로 되고, 학생은 자기가 한 조작이 XAML 로 어떻게 적히는지 본다.
 *  2) 미리 보기는 실행 창과 같은 렌더러(WpfRender)로 그린다 → 보이는 그대로 실행된다.
 *     .NET 런타임을 거치지 않으므로 글자를 고치는 즉시 다시 그려진다.
 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ================================================================== 도구 상자
  const TOOLBOX = [
    {
      group: '컨테이너', items: [
        { t: 'Grid', icon: '▦', xaml: '<Grid Background="#F4F4F8"/>', w: 200, h: 120 },
        { t: 'StackPanel', icon: '▥', xaml: '<StackPanel/>', w: 160, h: 120 },
        { t: 'WrapPanel', icon: '▤', xaml: '<WrapPanel/>', w: 200, h: 100 },
        { t: 'DockPanel', icon: '▣', xaml: '<DockPanel/>', w: 200, h: 120 },
        { t: 'Canvas', icon: '◫', xaml: '<Canvas Background="#FAFAFF"/>', w: 200, h: 140 },
        { t: 'Border', icon: '▢', xaml: '<Border BorderBrush="#888888" BorderThickness="1" Padding="8"/>', w: 160, h: 80 },
        { t: 'GroupBox', icon: '🗂', xaml: '<GroupBox Header="묶음"/>', w: 180, h: 110 },
      ]
    },
    {
      group: '기본 컨트롤', items: [
        { t: 'Button', icon: '🔘', xaml: '<Button Content="단추"/>', w: 90, h: 30 },
        { t: 'TextBlock', icon: '🅣', xaml: '<TextBlock Text="글자"/>', w: 80, h: 22 },
        { t: 'Label', icon: '🏷', xaml: '<Label Content="이름:"/>', w: 70, h: 26 },
        { t: 'TextBox', icon: '⌨', xaml: '<TextBox Text=""/>', w: 140, h: 26 },
        { t: 'PasswordBox', icon: '🔒', xaml: '<PasswordBox/>', w: 140, h: 26 },
        { t: 'CheckBox', icon: '☑', xaml: '<CheckBox Content="선택"/>', w: 100, h: 24 },
        { t: 'RadioButton', icon: '◉', xaml: '<RadioButton Content="항목"/>', w: 100, h: 24 },
        { t: 'ComboBox', icon: '▼', xaml: '<ComboBox/>', w: 130, h: 26 },
        { t: 'ListBox', icon: '☰', xaml: '<ListBox/>', w: 150, h: 110 },
        { t: 'Slider', icon: '━', xaml: '<Slider Minimum="0" Maximum="100" Value="50"/>', w: 160, h: 24 },
        { t: 'ProgressBar', icon: '▬', xaml: '<ProgressBar Minimum="0" Maximum="100" Value="40"/>', w: 160, h: 18 },
        { t: 'Image', icon: '🖼', xaml: '<Image Stretch="Uniform"/>', w: 120, h: 90 },
      ]
    },
    {
      group: '도형', items: [
        { t: 'Rectangle', icon: '▭', xaml: '<Rectangle Fill="#6B2FA0"/>', w: 100, h: 60 },
        { t: 'Ellipse', icon: '⬭', xaml: '<Ellipse Fill="#2F8FA0"/>', w: 80, h: 80 },
        { t: 'Line', icon: '╱', xaml: '<Line X1="0" Y1="0" X2="100" Y2="60" Stroke="#333333" StrokeThickness="2"/>', w: 100, h: 60 },
      ]
    },
  ];

  // 속성 편집기 정의: 모든 요소 공통 + 형식별
  const COMMON = [
    { k: 'x:Name', label: '이름', kind: 'text', hint: '코드에서 이 컨트롤을 부를 이름' },
    { k: 'Width', label: '너비', kind: 'num' },
    { k: 'Height', label: '높이', kind: 'num' },
    { k: 'Margin', label: '바깥 여백', kind: 'text', hint: '왼쪽,위,오른쪽,아래' },
    { k: 'HorizontalAlignment', label: '가로 정렬', kind: 'sel', opts: ['', 'Left', 'Center', 'Right', 'Stretch'] },
    { k: 'VerticalAlignment', label: '세로 정렬', kind: 'sel', opts: ['', 'Top', 'Center', 'Bottom', 'Stretch'] },
    { k: 'Background', label: '배경색', kind: 'color' },
    { k: 'Foreground', label: '글자색', kind: 'color' },
    { k: 'FontSize', label: '글자 크기', kind: 'num' },
    { k: 'FontWeight', label: '굵기', kind: 'sel', opts: ['', 'Normal', 'Bold'] },
    { k: 'IsEnabled', label: '사용 가능', kind: 'bool' },
    { k: 'Visibility', label: '보이기', kind: 'sel', opts: ['', 'Visible', 'Hidden', 'Collapsed'] },
  ];
  const BY_TYPE = {
    Button: [{ k: 'Content', label: '글자', kind: 'text' }],
    Label: [{ k: 'Content', label: '글자', kind: 'text' }],
    CheckBox: [{ k: 'Content', label: '글자', kind: 'text' }, { k: 'IsChecked', label: '체크됨', kind: 'bool' }],
    RadioButton: [{ k: 'Content', label: '글자', kind: 'text' }, { k: 'IsChecked', label: '선택됨', kind: 'bool' }, { k: 'GroupName', label: '그룹', kind: 'text' }],
    TextBlock: [{ k: 'Text', label: '글자', kind: 'text' }, { k: 'TextWrapping', label: '줄바꿈', kind: 'sel', opts: ['', 'NoWrap', 'Wrap'] }, { k: 'TextAlignment', label: '문단 정렬', kind: 'sel', opts: ['', 'Left', 'Center', 'Right'] }],
    TextBox: [{ k: 'Text', label: '글자', kind: 'text' }, { k: 'IsReadOnly', label: '읽기 전용', kind: 'bool' }, { k: 'AcceptsReturn', label: '여러 줄', kind: 'bool' }, { k: 'TextWrapping', label: '줄바꿈', kind: 'sel', opts: ['', 'NoWrap', 'Wrap'] }],
    GroupBox: [{ k: 'Header', label: '제목', kind: 'text' }],
    Expander: [{ k: 'Header', label: '제목', kind: 'text' }, { k: 'IsExpanded', label: '펼침', kind: 'bool' }],
    Slider: [{ k: 'Minimum', label: '최소', kind: 'num' }, { k: 'Maximum', label: '최대', kind: 'num' }, { k: 'Value', label: '값', kind: 'num' }],
    ProgressBar: [{ k: 'Minimum', label: '최소', kind: 'num' }, { k: 'Maximum', label: '최대', kind: 'num' }, { k: 'Value', label: '값', kind: 'num' }],
    StackPanel: [{ k: 'Orientation', label: '방향', kind: 'sel', opts: ['', 'Vertical', 'Horizontal'] }],
    WrapPanel: [{ k: 'Orientation', label: '방향', kind: 'sel', opts: ['', 'Horizontal', 'Vertical'] }],
    Border: [{ k: 'BorderBrush', label: '테두리색', kind: 'color' }, { k: 'BorderThickness', label: '테두리 두께', kind: 'text' }, { k: 'CornerRadius', label: '모서리', kind: 'text' }, { k: 'Padding', label: '안쪽 여백', kind: 'text' }],
    Rectangle: [{ k: 'Fill', label: '채움색', kind: 'color' }, { k: 'Stroke', label: '선색', kind: 'color' }, { k: 'StrokeThickness', label: '선 두께', kind: 'num' }, { k: 'RadiusX', label: '모서리 X', kind: 'num' }, { k: 'RadiusY', label: '모서리 Y', kind: 'num' }],
    Ellipse: [{ k: 'Fill', label: '채움색', kind: 'color' }, { k: 'Stroke', label: '선색', kind: 'color' }, { k: 'StrokeThickness', label: '선 두께', kind: 'num' }],
    Line: [{ k: 'X1', label: 'X1', kind: 'num' }, { k: 'Y1', label: 'Y1', kind: 'num' }, { k: 'X2', label: 'X2', kind: 'num' }, { k: 'Y2', label: 'Y2', kind: 'num' }, { k: 'Stroke', label: '선색', kind: 'color' }, { k: 'StrokeThickness', label: '선 두께', kind: 'num' }],
    Window: [{ k: 'Title', label: '제목', kind: 'text' }, { k: 'Width', label: '너비', kind: 'num' }, { k: 'Height', label: '높이', kind: 'num' }, { k: 'WindowStartupLocation', label: '열릴 위치', kind: 'sel', opts: ['', 'Manual', 'CenterScreen', 'CenterOwner'] }],
    Image: [{ k: 'Source', label: '그림 경로', kind: 'text' }, { k: 'Stretch', label: '채우기', kind: 'sel', opts: ['', 'None', 'Fill', 'Uniform', 'UniformToFill'] }],
  };
  // 형식별 기본 이벤트 (더블클릭하면 이 처리기를 만든다)
  const DEFAULT_EVENT = {
    Button: ['Click', '(object sender, RoutedEventArgs e)'],
    CheckBox: ['Checked', '(object sender, RoutedEventArgs e)'],
    RadioButton: ['Checked', '(object sender, RoutedEventArgs e)'],
    TextBox: ['TextChanged', '(object sender, TextChangedEventArgs e)'],
    ComboBox: ['SelectionChanged', '(object sender, SelectionChangedEventArgs e)'],
    ListBox: ['SelectionChanged', '(object sender, SelectionChangedEventArgs e)'],
    Slider: ['ValueChanged', '(object sender, RoutedPropertyChangedEventArgs<double> e)'],
    Window: ['Loaded', '(object sender, RoutedEventArgs e)'],
  };
  const PANELS = new Set(['Grid', 'StackPanel', 'WrapPanel', 'DockPanel', 'Canvas', 'UniformGrid']);
  const ONE_CHILD = new Set(['Border', 'GroupBox', 'Expander', 'ScrollViewer', 'Window']);
  const EVENT_ATTR = /^(Click|Checked|Unchecked|TextChanged|SelectionChanged|ValueChanged|Loaded|MouseDown|MouseUp|MouseMove|KeyDown|KeyUp|Closing|Closed|GotFocus|LostFocus|MouseLeftButtonDown|MouseDoubleClick|Drop|SizeChanged)$/;

  // ================================================================== 상태
  const D = {
    on: false, cm: null, doc: null, file: null, files: [],
    nodeOfId: new Map(), idOfNode: new Map(), rootId: 0,
    selected: null, dragging: null, pending: null, err: null,
  };
  let surface, toolboxEl, propsEl, statusEl, overlay;

  // ================================================================== 파일 나누기 (위치 포함)
  const FILE_MARK = /^[ \t]*\/\/[ \t]*=+[ \t]*(?:file|파일)[ \t]*:[ \t]*([\w./-]+?\.(?:cs|xaml|txt|dat|csv|json|xml|md))[ \t]*=*[ \t]*$/i;
  function splitRanges(text) {
    const lines = text.split('\n');
    const out = [];
    let cur = { name: 'Program.cs', start: 0, end: text.length, marked: false };
    let off = 0, any = false;
    for (const l of lines) {
      const m = FILE_MARK.exec(l);
      if (m) {
        cur.end = off > 0 ? off - 1 : 0;
        if (any || text.slice(cur.start, cur.end).trim()) out.push(cur);
        cur = { name: m[1], start: off + l.length + 1, end: text.length, marked: true };
        any = true;
      }
      off += l.length + 1;
    }
    cur.end = text.length;
    out.push(cur);
    if (!any && /^\s*<(Window|UserControl|Page)\b/.test(text)) out[0].name = 'MainWindow.xaml';
    return out.map((f) => Object.assign(f, { text: text.slice(f.start, f.end) }));
  }
  function findXamlFile(files) {
    return files.find((f) => /\.xaml$/i.test(f.name) && /<Window\b/.test(f.text)) ||
      files.find((f) => /\.xaml$/i.test(f.name) && !/^App\.xaml$/i.test(f.name)) || null;
  }
  function findCodeFile(files, xamlName) {
    const want = (xamlName || '') + '.cs';
    return files.find((f) => f.name.toLowerCase() === want.toLowerCase()) || files.find((f) => /\.cs$/i.test(f.name)) || null;
  }

  // ================================================================== XAML → 렌더 명령
  function buildOps(doc) {
    const ops = [];
    let next = 1;
    D.nodeOfId.clear(); D.idOfNode.clear();
    if (!doc.root) return { ops, rootId: 0 };

    function contentText(node) {
      if (node.selfClose) return '';
      const raw = doc.text.slice(node.contentStart, node.contentEnd);
      if (/<[A-Za-z]/.test(raw)) return '';        // 자식 요소가 있으면 글자 내용이 아니다
      return XamlDoc.decode(raw).trim();
    }
    function tracks(node, kind) {
      const holder = node.children.find((c) => c.local === node.local + '.' + kind + 'Definitions');
      if (!holder) return '';
      const key = kind === 'Row' ? 'Height' : 'Width';
      const list = holder.children.filter((c) => c.local === kind + 'Definition').map((c) => {
        const v = String(XamlDoc.attrValue(c, key, '*')).trim();
        if (/^auto$/i.test(v)) return 'auto';
        if (v.endsWith('*')) { const f = parseFloat(v) || 1; return f + 'fr'; }
        const n = parseFloat(v);
        return Number.isFinite(n) ? n + 'px' : '1fr';
      });
      return list.join(' ');
    }

    function walk(node) {
      const id = next++;
      D.nodeOfId.set(id, node); D.idOfNode.set(node, id);
      const type = node.local;
      ops.push(['new', id, type, type]);
      for (const a of node.attrs) {
        if (/^xmlns(:|$)/.test(a.name)) continue;
        if (a.name === 'x:Class' || a.name === 'x:Key' || a.name === 'x:Uid') continue;
        if (a.name === 'x:Name' || a.name === 'Name') { ops.push(['prop', id, 'Name', a.value]); continue; }
        if (EVENT_ATTR.test(a.name)) continue;                 // 처리기 이름은 화면과 무관
        if (/^\{/.test(a.value)) {                              // {Binding …} 은 값이 없으므로 자리만 보여 준다
          if (a.name === 'Text' || a.name === 'Content') ops.push(['prop', id, a.name, '[' + a.name + ']']);
          continue;
        }
        ops.push(['prop', id, a.name, a.value]);
      }
      if (type === 'Grid') {
        const r = tracks(node, 'Row'), c = tracks(node, 'Column');
        if (r) ops.push(['prop', id, '$rows', r]);
        if (c) ops.push(['prop', id, '$cols', c]);
      }
      const kids = [];
      for (const c of node.children) {
        if (c.local.indexOf('.') >= 0) {
          // <Button.Content> 같은 속성 요소: 안에 요소가 있으면 자식으로 보여 준다
          const inner = c.children.filter((x) => x.local.indexOf('.') < 0);
          if (/\.(Content|Child|Header)$/.test(c.local)) { inner.forEach((x) => kids.push(walk(x))); continue; }
          // <Button.Background><LinearGradientBrush…> 처럼 브러시를 속성 요소로 쓴 경우
          const pn = c.local.split('.').pop();
          if (/^(Background|Foreground|Fill|Stroke|BorderBrush)$/.test(pn)) {
            const css = brushCss(inner.find((x) => /Brush$/.test(x.local)));
            if (css) ops.push(['prop', id, pn, css]);
          }
          continue;
        }
        kids.push(walk(c));
      }
      const txt = contentText(node);
      if (txt) ops.push(['prop', id, /^(TextBlock|TextBox|PasswordBox|Run)$/.test(type) ? 'Text' : 'Content', txt]);
      if (kids.length) ops.push(['children', id, kids]);
      return id;
    }
    const rootId = walk(doc.root);
    ops.push(['window', rootId, 'show', {}]);
    return { ops, rootId };
  }

  /** 브러시 요소를 CSS 값으로 (렌더러는 CSS 문자열을 그대로 쓴다) */
  function brushCss(el) {
    if (!el) return '';
    if (el.local === 'SolidColorBrush') return XamlDoc.attrValue(el, 'Color', '');
    if (el.local !== 'LinearGradientBrush' && el.local !== 'RadialGradientBrush') return '';
    const stops = [];
    (function find(n) { for (const c of n.children) { if (c.local === 'GradientStop') stops.push(c); else find(c); } })(el);
    const list = stops.map((c) => `${XamlDoc.attrValue(c, 'Color', '#000000')} ${(parseFloat(XamlDoc.attrValue(c, 'Offset', '0')) * 100) || 0}%`);
    if (!list.length) return '';
    if (el.local === 'RadialGradientBrush') return `radial-gradient(ellipse at 50% 50%, ${list.join(', ')})`;
    const sp = String(XamlDoc.attrValue(el, 'StartPoint', '0,0')).split(',').map(Number);
    const ep = String(XamlDoc.attrValue(el, 'EndPoint', '1,1')).split(',').map(Number);
    const deg = Math.atan2((ep[1] || 0) - (sp[1] || 0), (ep[0] || 0) - (sp[0] || 0)) * 180 / Math.PI + 90;
    return `linear-gradient(${deg.toFixed(1)}deg, ${list.join(', ')})`;
  }

  // ================================================================== 그리기
  function rerender() {
    const full = D.cm.getValue();
    D.files = splitRanges(full);
    D.file = findXamlFile(D.files);
    if (!D.file) { fail('XAML 파일이 없습니다. <code>// ===== File: MainWindow.xaml =====</code> 로 시작하는 XAML 을 넣어 주세요.'); return; }
    D.doc = XamlDoc.parse(D.file.text);
    if (!D.doc.root) { fail('XAML 에서 &lt;Window&gt; 를 찾지 못했습니다.'); return; }
    const bad = D.doc.errors[0];
    const built = buildOps(D.doc);
    D.rootId = built.rootId;
    const keep = D.selected ? nodePath(D.selected) : null;
    WpfRender.setHost(surface, { bare: true });
    WpfRender.setDesignMode(true);
    try { WpfRender.apply(built.ops); } catch (e) { fail('그리는 중 오류: ' + e.message); return; }
    hookSurface();
    D.selected = D.pendingSelect ? nodeAtPath(D.pendingSelect) : (keep ? nodeAtPath(keep) : null);
    D.pendingSelect = null;
    if (bad) status(`⚠ ${bad.message}`, 'warn');
    else if (!D.msgUntil || Date.now() > D.msgUntil) status(hintFor(D.selected), '');
    drawOverlay();
    renderProps();
  }
  function fail(html) {
    surface.innerHTML = `<div class="dsn-empty">${html}</div>`;
    D.doc = null; D.selected = null; overlay = null;
    status('', '');
    renderProps();
  }
  function status(msg, cls) {
    if (!statusEl) return;
    statusEl.className = 'dsn-status ' + (cls || '');
    statusEl.innerHTML = msg || '';
    D.msgUntil = cls ? Date.now() + 2600 : 0;
  }
  /** 아무 메시지도 없을 때 보여 줄 안내 */
  function hintFor(node) {
    if (!node || node === (D.doc && D.doc.root)) return '컨트롤을 클릭하면 속성이 보입니다';
    const p = node.parent ? node.parent.local : '';
    if (p === 'Canvas') return '끌어서 옮기고, 모서리를 끌어 크기를 바꿉니다';
    if (p === 'Grid') return '오른쪽에서 행 · 열을 정할 수 있습니다';
    return '이 패널은 자리를 스스로 정합니다 — 여백 · 정렬로 조절하세요';
  }
  /** 선택을 다시 그린 뒤에도 유지하기 위한 경로 (자식 순번 목록) */
  function nodePath(node) {
    const path = [];
    for (let n = node; n && n.parent; n = n.parent) path.unshift(n.parent.children.indexOf(n));
    return path;
  }
  function nodeAtPath(path) {
    let n = D.doc.root;
    for (const i of path) { if (!n || !n.children[i]) return null; n = n.children[i]; }
    return n;
  }

  // ================================================================== 오버레이 (선택 · 이동 · 크기)
  function hookSurface() {
    const client = WpfRender.clientOf(D.rootId);
    if (!client) return;
    if (!overlay || overlay.parentNode !== client) {
      overlay = document.createElement('div');
      overlay.className = 'dsn-overlay';
      client.appendChild(overlay);
    } else client.appendChild(overlay);
    if (client.dataset.dsnHooked) return;
    client.dataset.dsnHooked = '1';
    // 캡처 단계에서 가로채 컨트롤 자신의 동작(단추 눌림 · 체크 전환)을 막는다
    for (const ev of ['mousedown', 'click', 'dblclick', 'keydown', 'contextmenu', 'wheel']) {
      client.addEventListener(ev, (e) => {
        if (!D.on) return;
        if (e.target.closest('.dsn-handle, .dsn-overlay')) { if (ev !== 'mousedown') { e.preventDefault(); e.stopPropagation(); } return; }
        e.preventDefault(); e.stopPropagation();
        if (ev === 'mousedown') onSurfaceDown(e);
        else if (ev === 'dblclick') makeHandler();
      }, true);
    }
  }
  function nodeFromEvent(e) {
    const el = e.target.closest ? e.target.closest('.wpf-el') : null;
    if (!el) return D.doc.root;
    const id = +el.dataset.id;
    return D.nodeOfId.get(id) || D.doc.root;
  }
  function onSurfaceDown(e) {
    const node = nodeFromEvent(e);
    select(node);
    startMove(e, node);
  }
  function select(node) {
    D.selected = node || null;
    drawOverlay();
    renderProps();
    if (D.selected) highlightSource(D.selected);
  }
  /** 선택한 요소의 XAML 줄을 편집기에서 잠깐 표시 */
  function highlightSource(node) {
    if (!D.cm || !D.file) return;
    const from = D.cm.posFromIndex(D.file.start + node.openStart);
    const to = D.cm.posFromIndex(D.file.start + node.openEnd);
    if (D._mark) D._mark.clear();
    D._mark = D.cm.markText(from, to, { className: 'dsn-src' });
    D.cm.scrollIntoView({ from, to }, 60);
  }

  function rectOf(node) {
    const id = D.idOfNode.get(node);
    const dom = id ? WpfRender.nodeOf(id) : null;
    const client = WpfRender.clientOf(D.rootId);
    if (!dom || !client) return null;
    const a = dom.getBoundingClientRect(), b = client.getBoundingClientRect();
    return { left: a.left - b.left + client.scrollLeft, top: a.top - b.top + client.scrollTop, width: a.width, height: a.height };
  }
  const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  function drawOverlay() {
    if (!overlay) return;
    const node = D.selected;
    if (!node || !D.doc || node === D.doc.root) { overlay.innerHTML = ''; return; }
    const r = rectOf(node);
    if (!r) { overlay.innerHTML = ''; return; }
    overlay.innerHTML = `<div class="dsn-sel" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px">
      <span class="dsn-tag">${esc(node.local)}${XamlDoc.attrValue(node, 'x:Name') ? ' · ' + esc(XamlDoc.attrValue(node, 'x:Name')) : ''}</span>
      ${HANDLES.map((h) => `<i class="dsn-handle h-${h}" data-h="${h}"></i>`).join('')}</div>`;
    overlay.querySelectorAll('.dsn-handle').forEach((h) => {
      h.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); startResize(e, node, h.dataset.h); });
    });
  }

  function parentIsCanvas(node) { return node.parent && node.parent.local === 'Canvas'; }
  function num(v, d) { const n = parseFloat(v); return Number.isFinite(n) ? n : d; }

  function startMove(e, node) {
    if (!node || node === D.doc.root) return;
    const r = rectOf(node);
    if (!r) return;
    const sx = e.clientX, sy = e.clientY;
    const sel = overlay.querySelector('.dsn-sel');
    let moved = false;
    const onMove = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
      moved = true;
      if (sel) { sel.style.left = (r.left + dx) + 'px'; sel.style.top = (r.top + dy) + 'px'; }
    };
    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onUp, true);
      if (!moved) return;
      const dx = Math.round(ev.clientX - sx), dy = Math.round(ev.clientY - sy);
      if (parentIsCanvas(node)) {
        const l = num(XamlDoc.attrValue(node, 'Canvas.Left'), 0) + dx;
        const t = num(XamlDoc.attrValue(node, 'Canvas.Top'), 0) + dy;
        commit(XamlDoc.setAttrs(node, { 'Canvas.Left': String(Math.max(0, Math.round(l))), 'Canvas.Top': String(Math.max(0, Math.round(t))) }), '위치 옮김');
      } else {
        const m = String(XamlDoc.attrValue(node, 'Margin', '0')).split(',').map((x) => num(x, 0));
        const [ml, mt, mr, mb] = m.length === 1 ? [m[0], m[0], m[0], m[0]] : m.length === 2 ? [m[0], m[1], m[0], m[1]] : m;
        commit(XamlDoc.setAttr(node, 'Margin', `${Math.round(ml + dx)},${Math.round(mt + dy)},${Math.round(mr - dx)},${Math.round(mb - dy)}`), '여백으로 위치 옮김');
      }
    };
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onUp, true);
  }

  function startResize(e, node, dir) {
    const r = rectOf(node);
    if (!r) return;
    const sx = e.clientX, sy = e.clientY;
    const sel = overlay.querySelector('.dsn-sel');
    const box = { l: r.left, t: r.top, w: r.width, h: r.height };
    const onMove = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      const b = calc(box, dir, dx, dy);
      if (sel) { sel.style.left = b.l + 'px'; sel.style.top = b.t + 'px'; sel.style.width = b.w + 'px'; sel.style.height = b.h + 'px'; }
    };
    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onUp, true);
      const b = calc(box, dir, ev.clientX - sx, ev.clientY - sy);
      const map = { Width: String(Math.round(b.w)), Height: String(Math.round(b.h)) };
      if (parentIsCanvas(node) && (b.l !== box.l || b.t !== box.t)) {
        map['Canvas.Left'] = String(Math.round(num(XamlDoc.attrValue(node, 'Canvas.Left'), 0) + (b.l - box.l)));
        map['Canvas.Top'] = String(Math.round(num(XamlDoc.attrValue(node, 'Canvas.Top'), 0) + (b.t - box.t)));
      }
      commit(XamlDoc.setAttrs(node, map), '크기 바꿈');
    };
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onUp, true);
  }
  function calc(box, dir, dx, dy) {
    let { l, t, w, h } = box;
    if (dir.includes('e')) w = Math.max(8, box.w + dx);
    if (dir.includes('s')) h = Math.max(8, box.h + dy);
    if (dir.includes('w')) { w = Math.max(8, box.w - dx); l = box.l + (box.w - w); }
    if (dir.includes('n')) { h = Math.max(8, box.h - dy); t = box.t + (box.h - h); }
    return { l, t, w, h };
  }

  // ================================================================== 텍스트 반영
  /** XAML 안의 오프셋 기준 편집 목록을 편집기에 적용한다 */
  function commit(edits, label) {
    if (!edits || !edits.length) return;
    const cm = D.cm, base = D.file.start;
    const sorted = edits.slice().sort((a, b) => b.from - a.from || b.to - a.to);
    cm.operation(() => {
      for (const e of sorted) cm.replaceRange(e.text, cm.posFromIndex(base + e.from), cm.posFromIndex(base + e.to));
    });
    if (label) status('✔ ' + label, 'ok');
    // change 이벤트로 rerender 가 불린다
  }

  function deleteSelected() {
    const node = D.selected;
    if (!node || node === D.doc.root) return;
    const parent = node.parent;
    commit(XamlDoc.remove(D.doc, node), '지움');
    D.selected = parent && parent !== D.doc.root ? parent : null;
  }

  /** 컨테이너를 찾아 새 컨트롤을 넣는다 */
  function addControl(item, target, pos) {
    let parent = target;
    while (parent && !PANELS.has(parent.local) && !ONE_CHILD.has(parent.local)) parent = parent.parent;
    if (!parent) parent = D.doc.root;
    if (ONE_CHILD.has(parent.local) && XamlDoc.elementChildren(parent).length) {
      status(`⚠ ${parent.local} 안에는 요소를 하나만 넣을 수 있습니다. 패널을 먼저 넣으세요.`, 'warn');
      return;
    }
    let xaml = item.xaml;
    if (parent.local === 'Canvas' && pos) {
      const ins = ` Canvas.Left="${Math.max(0, Math.round(pos.x))}" Canvas.Top="${Math.max(0, Math.round(pos.y))}"`;
      xaml = xaml.replace(/(\/?)>$/, (m, sl) => ins + (sl ? '/>' : '>'));
    }
    if ((parent.local === 'Canvas' || parent.local === 'Grid') && item.w && !/\bWidth=/.test(xaml) && item.t !== 'Line') {
      const size = parent.local === 'Canvas' ? ` Width="${item.w}" Height="${item.h}"` : '';
      xaml = xaml.replace(/(\/?)>$/, (m, sl) => size + (sl ? '/>' : '>'));
    }
    const path = nodePath(parent).concat(parent.children.length);
    commit(XamlDoc.insertChild(D.doc, parent, xaml), `${item.t} 넣음`);
    D.pendingSelect = path;
  }

  // ================================================================== 이벤트 처리기 만들기
  function makeHandler() {
    const node = D.selected || D.doc.root;
    const def = DEFAULT_EVENT[node.local];
    if (!def) { status(`⚠ ${node.local} 에는 기본 이벤트가 없습니다.`, 'warn'); return; }
    const [evName, sig] = def;
    let name = XamlDoc.attrValue(node, evName);
    const id = XamlDoc.attrValue(node, 'x:Name') || node.local.charAt(0).toLowerCase() + node.local.slice(1);
    if (!name) {
      name = `${id}_${evName}`;
      commit(XamlDoc.setAttr(node, evName, name), `${evName} 처리기 연결`);
    }
    setTimeout(() => insertHandlerCode(name, sig, evName), 0);
  }
  function insertHandlerCode(name, sig, evName) {
    const full = D.cm.getValue();
    const files = splitRanges(full);
    const xaml = findXamlFile(files);
    const cs = findCodeFile(files, xaml && xaml.name);
    if (!cs) { status('⚠ 코드 비하인드(.xaml.cs) 파일이 없습니다.', 'warn'); return; }
    if (new RegExp(`\\b${name}\\s*\\(`).test(cs.text)) { jumpTo(cs, new RegExp(`\\b${name}\\s*\\(`)); return; }
    // 클래스 본문의 마지막 } 앞에 넣는다
    const open = cs.text.search(/partial\s+class\s+\w+[^{]*\{/);
    if (open < 0) { status('⚠ partial class 를 찾지 못했습니다.', 'warn'); return; }
    let i = cs.text.indexOf('{', open), depth = 0, close = -1;
    for (; i < cs.text.length; i++) {
      if (cs.text[i] === '{') depth++;
      else if (cs.text[i] === '}') { depth--; if (depth === 0) { close = i; break; } }
    }
    if (close < 0) { status('⚠ 클래스의 끝을 찾지 못했습니다.', 'warn'); return; }
    const body = `\n        private void ${name}${sig}\n        {\n            \n        }\n`;
    const at = cs.start + close;
    D.cm.replaceRange(body, D.cm.posFromIndex(at));
    status(`✔ ${name} 처리기를 만들었습니다`, 'ok');
    setTimeout(() => jumpTo(null, new RegExp(`\\b${name}\\s*\\(`)), 0);
  }
  function jumpTo(file, re) {
    const text = D.cm.getValue();
    const m = re.exec(text);
    if (!m) return;
    const pos = D.cm.posFromIndex(m.index);
    D.cm.setCursor({ line: pos.line + 2, ch: 12 });
    D.cm.scrollIntoView({ line: pos.line, ch: 0 }, 80);
    D.cm.focus();
  }

  // ================================================================== 속성 패널
  function renderProps() {
    if (!propsEl) return;
    const node = D.selected || (D.doc && D.doc.root);
    if (!node) { propsEl.innerHTML = '<div class="dsn-hint">XAML 을 불러오면 속성이 표시됩니다.</div>'; return; }
    const type = node.local;
    const list = (BY_TYPE[type] || []).concat(type === 'Window' ? [] : COMMON);
    const inCanvas = parentIsCanvas(node);
    const pos = inCanvas ? [{ k: 'Canvas.Left', label: '왼쪽(X)', kind: 'num' }, { k: 'Canvas.Top', label: '위(Y)', kind: 'num' }] :
      node.parent && node.parent.local === 'Grid' ? [{ k: 'Grid.Row', label: '행', kind: 'num' }, { k: 'Grid.Column', label: '열', kind: 'num' }, { k: 'Grid.RowSpan', label: '행 합치기', kind: 'num' }, { k: 'Grid.ColumnSpan', label: '열 합치기', kind: 'num' }] :
        node.parent && node.parent.local === 'DockPanel' ? [{ k: 'DockPanel.Dock', label: '붙일 곳', kind: 'sel', opts: ['', 'Left', 'Top', 'Right', 'Bottom'] }] : [];
    const ev = DEFAULT_EVENT[type];
    propsEl.innerHTML = `
      <div class="dsn-ptitle"><b>${esc(type)}</b>${XamlDoc.attrValue(node, 'x:Name') ? ` <span class="muted">${esc(XamlDoc.attrValue(node, 'x:Name'))}</span>` : ''}</div>
      ${pos.length ? `<div class="dsn-pgroup">배치</div>${pos.map((f) => field(node, f)).join('')}` : ''}
      <div class="dsn-pgroup">속성</div>
      ${list.map((f) => field(node, f)).join('')}
      ${ev ? `<div class="dsn-pgroup">이벤트</div>
        <label class="dsn-field"><span>${esc(ev[0])}</span><input data-p="${esc(ev[0])}" value="${esc(XamlDoc.attrValue(node, ev[0], ''))}" placeholder="처리기 이름"></label>
        <button class="btn small ghost dsn-mk" type="button">＋ ${esc(ev[0])} 처리기 만들기</button>` : ''}
      ${D.doc && node !== D.doc.root ? '<button class="btn small danger dsn-del" type="button">🗑 이 컨트롤 지우기</button>' : ''}`;
    propsEl.querySelectorAll('[data-p]').forEach((inp) => {
      const key = inp.dataset.p;
      const apply = () => {
        let v = inp.type === 'checkbox' ? (inp.checked ? 'True' : null) : inp.value.trim();
        if (v === '') v = null;
        commit(XamlDoc.setAttr(node, key, v), `${key} 바꿈`);
      };
      inp.addEventListener('change', apply);
      if (inp.tagName === 'INPUT' && inp.type !== 'checkbox' && inp.type !== 'color') inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
    });
    const del = propsEl.querySelector('.dsn-del'); if (del) del.onclick = deleteSelected;
    const mk = propsEl.querySelector('.dsn-mk'); if (mk) mk.onclick = makeHandler;
  }
  function field(node, f) {
    const v = XamlDoc.attrValue(node, f.k, '');
    const title = f.hint ? ` title="${esc(f.hint)}"` : '';
    if (f.kind === 'bool') return `<label class="dsn-field"${title}><span>${esc(f.label)}</span><input type="checkbox" data-p="${esc(f.k)}" ${/^true$/i.test(v) ? 'checked' : ''}></label>`;
    if (f.kind === 'sel') return `<label class="dsn-field"${title}><span>${esc(f.label)}</span><select data-p="${esc(f.k)}">${f.opts.map((o) => `<option value="${esc(o)}"${o === v ? ' selected' : ''}>${o === '' ? '(기본)' : esc(o)}</option>`).join('')}</select></label>`;
    if (f.kind === 'color') {
      const hex = /^#[0-9a-f]{6}$/i.test(v) ? v : '';
      return `<label class="dsn-field"${title}><span>${esc(f.label)}</span><span class="dsn-color"><input type="color" data-p="${esc(f.k)}" value="${hex || '#ffffff'}"><input type="text" data-p="${esc(f.k)}" value="${esc(v)}" placeholder="(기본)"></span></label>`;
    }
    return `<label class="dsn-field"${title}><span>${esc(f.label)}</span><input type="${f.kind === 'num' ? 'number' : 'text'}" data-p="${esc(f.k)}" value="${esc(v)}" placeholder="(기본)"></label>`;
  }

  // ================================================================== 도구 상자
  function renderToolbox() {
    toolboxEl.innerHTML = TOOLBOX.map((g) => `<div class="dsn-tgroup">${esc(g.group)}</div>
      <div class="dsn-titems">${g.items.map((it) => `<button class="dsn-tool" type="button" data-t="${esc(it.t)}" title="${esc(it.t)} — 화면으로 끌어다 놓거나 클릭한 뒤 화면을 클릭">${it.icon}<span>${esc(it.t)}</span></button>`).join('')}</div>`).join('');
    toolboxEl.querySelectorAll('.dsn-tool').forEach((b) => {
      const item = TOOLBOX.flatMap((g) => g.items).find((i) => i.t === b.dataset.t);
      b.addEventListener('mousedown', (e) => { e.preventDefault(); startPlace(e, item, b); });
    });
  }
  function startPlace(e, item, btn) {
    const ghost = document.createElement('div');
    ghost.className = 'dsn-ghost';
    ghost.textContent = item.t;
    document.body.appendChild(ghost);
    const move = (ev) => { ghost.style.left = (ev.clientX + 12) + 'px'; ghost.style.top = (ev.clientY + 12) + 'px'; };
    move(e);
    const up = (ev) => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('mouseup', up, true);
      ghost.remove();
      const client = WpfRender.clientOf(D.rootId);
      if (!client) return;
      const r = client.getBoundingClientRect();
      const inside = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
      if (!inside) { status('화면 안에 놓아야 합니다.', 'warn'); return; }
      if (overlay) overlay.style.pointerEvents = 'none';
      const under = document.elementFromPoint(ev.clientX, ev.clientY);
      if (overlay) overlay.style.pointerEvents = '';
      const target = nodeFromEvent({ target: under || client });
      addControl(item, target, { x: ev.clientX - r.left, y: ev.clientY - r.top });
    };
    document.addEventListener('mousemove', move, true);
    document.addEventListener('mouseup', up, true);
  }

  // ================================================================== 열기 · 닫기
  function open(cm) {
    D.cm = cm;
    D.on = true;
    surface = $('dsnSurface'); toolboxEl = $('dsnToolbox'); propsEl = $('dsnProps'); statusEl = $('dsnStatus');
    if (!surface) return;
    document.body.classList.add('designing');
    renderToolbox();
    rerender();
    if (!D._bound) {
      D._bound = true;
      cm.on('change', () => { if (D.on) { clearTimeout(D._t); D._t = setTimeout(rerender, 180); } });
      document.addEventListener('keydown', (e) => {
        if (!D.on || !D.selected) return;
        if (e.target.closest && e.target.closest('input, select, textarea, .CodeMirror')) return;
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); }
        if (e.key === 'Escape') { select(null); }
      });
      window.addEventListener('resize', () => { if (D.on) drawOverlay(); });
    }
  }
  function close() {
    D.on = false;
    document.body.classList.remove('designing');
    if (D._mark) { D._mark.clear(); D._mark = null; }
    WpfRender.setDesignMode(false);
    WpfRender.setHost(null);
    if (surface) surface.innerHTML = '';
    overlay = null;
    D.selected = null;
  }

  window.CsDesigner = { open, close, get isOpen() { return D.on; }, refresh: rerender };
})();
