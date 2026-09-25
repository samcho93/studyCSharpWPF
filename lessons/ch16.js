/* Chapter 16. 기본 컨트롤 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* ---------- ch16-1 그림: 컨트롤 클래스 계층 ---------- */
  const SVG_TREE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="WPF 컨트롤의 세 가지 분류와 클래스 계층">
  <defs><marker id="ah16a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="520" y="20" width="240" height="60" rx="12" fill="var(--card)" stroke="var(--fg)" stroke-width="2"/>
  <text x="640" y="60" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--fg)">Control</text>
  <line x1="600" y1="82" x2="240" y2="140" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah16a)"/>
  <line x1="640" y1="82" x2="640" y2="140" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah16a)"/>
  <line x1="680" y1="82" x2="1040" y2="140" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah16a)"/>
  <rect x="40" y="145" width="400" height="300" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="240" y="185" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">① 콘텐츠 컨트롤</text>
  <text x="240" y="220" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">ContentControl</text>
  <text x="240" y="255" text-anchor="middle" style="font-size:21px;fill:var(--muted)">Content 하나를 보여 준다</text>
  <text x="70" y="305" style="font-size:22px;fill:var(--fg)">Button · Label</text>
  <text x="70" y="345" style="font-size:22px;fill:var(--fg)">CheckBox · RadioButton</text>
  <text x="70" y="385" style="font-size:22px;fill:var(--fg)">ToggleButton</text>
  <text x="70" y="425" style="font-size:22px;fill:var(--fg)">GroupBox · Expander · TabItem</text>
  <rect x="470" y="145" width="340" height="300" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="640" y="185" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">② 항목 컨트롤</text>
  <text x="640" y="220" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">ItemsControl</text>
  <text x="640" y="255" text-anchor="middle" style="font-size:21px;fill:var(--muted)">Items 여러 개를 보여 준다</text>
  <text x="500" y="305" style="font-size:22px;fill:var(--fg)">ComboBox · ListBox</text>
  <text x="500" y="345" style="font-size:22px;fill:var(--fg)">ListView · TabControl</text>
  <text x="500" y="385" style="font-size:22px;fill:var(--fg)">TreeView · Menu</text>
  <rect x="840" y="145" width="400" height="300" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1040" y="185" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">③ 범위 컨트롤</text>
  <text x="1040" y="220" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">RangeBase</text>
  <text x="1040" y="255" text-anchor="middle" style="font-size:21px;fill:var(--muted)">Minimum ~ Maximum 사이의 Value</text>
  <text x="870" y="305" style="font-size:22px;fill:var(--fg)">Slider</text>
  <text x="870" y="345" style="font-size:22px;fill:var(--fg)">ProgressBar</text>
  <text x="870" y="385" style="font-size:22px;fill:var(--fg)">ScrollBar</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:22px;fill:var(--fg)">그 밖에: <tspan font-weight="700">TextBox · PasswordBox · DatePicker</tspan> (Control 을 바로 상속)</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:21px;fill:var(--muted)">TextBlock · Image 는 Control 도 아닌 가벼운 FrameworkElement — 글자 · 그림을 “보여 주기만” 한다</text>
</svg>`;

  /* ---------- ch16-1 그림: 콘텐츠 모델 ---------- */
  const SVG_CONTENT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Content 속성에 문자열과 요소를 넣었을 때">
  <defs><marker id="ah16b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="40" y="20" width="560" height="400" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="320" y="62" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">① Content = 문자열</text>
  <text x="80" y="125" style="${MONO};font-size:22px;fill:var(--fg)">&lt;Button Content="확인"/&gt;</text>
  <line x1="320" y1="150" x2="320" y2="265" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah16b)"/>
  <text x="340" y="215" style="font-size:20px;fill:var(--muted)">글자로 표시</text>
  <rect x="220" y="280" width="200" height="60" rx="6" fill="var(--line)" fill-opacity="0.35" stroke="var(--muted)" stroke-width="2"/>
  <text x="320" y="320" text-anchor="middle" style="font-size:24px;fill:var(--fg)">확인</text>
  <text x="320" y="395" text-anchor="middle" style="font-size:21px;fill:var(--muted)">가장 흔한 형태 — 속성 한 줄로 끝</text>
  <rect x="680" y="20" width="560" height="400" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="960" y="62" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">② Content = 요소 (패널로 묶기)</text>
  <g style="${MONO};font-size:20px;fill:var(--fg)">
    <text x="710" y="105">&lt;Button&gt;</text>
    <text x="710" y="132">  &lt;StackPanel Orientation="Horizontal"&gt;</text>
    <text x="710" y="159">    &lt;Ellipse Fill="Tomato" …/&gt;</text>
    <text x="710" y="186">    &lt;TextBlock Text="저장"/&gt;</text>
    <text x="710" y="213">  &lt;/StackPanel&gt;</text>
    <text x="710" y="240">&lt;/Button&gt;</text>
  </g>
  <line x1="960" y1="250" x2="960" y2="265" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah16b)"/>
  <rect x="860" y="280" width="200" height="60" rx="6" fill="var(--line)" fill-opacity="0.35" stroke="var(--muted)" stroke-width="2"/>
  <circle cx="905" cy="310" r="12" fill="tomato"/>
  <text x="975" y="320" text-anchor="middle" style="font-size:24px;fill:var(--fg)">저장</text>
  <text x="960" y="395" text-anchor="middle" style="font-size:21px;fill:var(--muted)">요소를 그대로 그림 — 아이콘 + 글자 버튼</text>
  <text x="640" y="475" text-anchor="middle" style="font-size:24px;fill:var(--fg)"><tspan style="${MONO}" font-weight="700">Content</tspan> 의 형식은 <tspan style="${MONO}">object</tspan> — 무엇이든 넣을 수 있지만 <tspan font-weight="700" fill="var(--warn)">딱 하나</tspan>만</text>
  <text x="640" y="520" text-anchor="middle" style="font-size:22px;fill:var(--muted)">여러 개를 넣고 싶으면 StackPanel · Grid 같은 패널 하나로 묶어서 넣는다</text>
</svg>`;

  /* ---------- ch16-2 그림: Items 와 ItemsSource ---------- */
  const SVG_ITEMS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Items 에 직접 넣기와 ItemsSource 로 연결하기">
  <defs><marker id="ah16c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="30" y="20" width="520" height="420" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="290" y="62" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">① Items 에 직접 넣기</text>
  <text x="60" y="115" style="${MONO};font-size:21px;fill:var(--fg)">lstNames.Items.Add("김민준");</text>
  <text x="60" y="145" style="${MONO};font-size:21px;fill:var(--fg)">lstNames.Items.Add("이서연");</text>
  <line x1="290" y1="165" x2="290" y2="205" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah16c)"/>
  <rect x="170" y="215" width="240" height="140" rx="4" fill="var(--line)" fill-opacity="0.2" stroke="var(--muted)" stroke-width="2"/>
  <text x="185" y="250" style="font-size:22px;fill:var(--fg)">김민준</text>
  <text x="185" y="285" style="font-size:22px;fill:var(--fg)">이서연</text>
  <text x="290" y="340" text-anchor="middle" style="font-size:18px;fill:var(--muted)">ListBox (항목을 직접 보관)</text>
  <text x="290" y="400" text-anchor="middle" style="font-size:21px;fill:var(--muted)">간단한 목록 · XAML 에 바로 적을 때</text>
  <rect x="580" y="20" width="670" height="420" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="915" y="62" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">② ItemsSource 로 연결하기</text>
  <rect x="610" y="100" width="300" height="150" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <text x="760" y="135" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">데이터 (코드)</text>
  <text x="760" y="170" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">ObservableCollection</text>
  <text x="760" y="195" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">&lt;string&gt; subjects</text>
  <text x="760" y="228" text-anchor="middle" style="font-size:18px;fill:var(--muted)">"국어", "영어", "수학" …</text>
  <line x1="912" y1="150" x2="1030" y2="120" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah16c)"/>
  <line x1="912" y1="200" x2="1030" y2="250" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah16c)"/>
  <text x="965" y="185" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--accent)">ItemsSource</text>
  <rect x="1040" y="85" width="180" height="70" rx="4" fill="var(--line)" fill-opacity="0.2" stroke="var(--muted)" stroke-width="2"/>
  <text x="1130" y="128" text-anchor="middle" style="font-size:21px;fill:var(--fg)">ListBox</text>
  <rect x="1040" y="220" width="180" height="60" rx="4" fill="var(--line)" fill-opacity="0.2" stroke="var(--muted)" stroke-width="2"/>
  <text x="1130" y="258" text-anchor="middle" style="font-size:21px;fill:var(--fg)">ComboBox ▾</text>
  <text x="915" y="320" text-anchor="middle" style="font-size:21px;fill:var(--fg)">subjects.Add / Remove → 화면이 <tspan font-weight="700">자동으로</tspan> 바뀜</text>
  <text x="915" y="352" text-anchor="middle" style="font-size:19px;fill:var(--muted)">(컬렉션이 “바뀌었다”고 알려 줌: CollectionChanged)</text>
  <text x="915" y="400" text-anchor="middle" style="font-size:21px;fill:var(--muted)">데이터와 화면 분리 · 여러 컨트롤이 함께 사용</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:23px;fill:var(--warn);font-weight:700">둘 중 하나만! ItemsSource 를 쓰는 중에 Items.Add 를 하면 예외(InvalidOperationException)</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:21px;fill:var(--muted)">ItemsSource 를 쓸 때는 항상 “데이터 컬렉션” 쪽을 고친다</text>
</svg>`;

  /* ---------- ch16-2 그림: Slider · ProgressBar 의 범위 ---------- */
  const SVG_RANGE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Slider 와 ProgressBar 의 Minimum, Maximum, Value">
  <defs><marker id="ah16d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">Slider — 사용자가 끌어서 값을 고른다</text>
  <line x1="140" y1="180" x2="1140" y2="180" stroke="var(--muted)" stroke-width="6" stroke-linecap="round"/>
  <line x1="140" y1="180" x2="540" y2="180" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
  <g stroke="var(--muted)" stroke-width="2">
    <line x1="140" y1="200" x2="140" y2="215"/><line x1="240" y1="200" x2="240" y2="215"/><line x1="340" y1="200" x2="340" y2="215"/><line x1="440" y1="200" x2="440" y2="215"/><line x1="540" y1="200" x2="540" y2="215"/><line x1="640" y1="200" x2="640" y2="215"/>
    <line x1="740" y1="200" x2="740" y2="215"/><line x1="840" y1="200" x2="840" y2="215"/><line x1="940" y1="200" x2="940" y2="215"/><line x1="1040" y1="200" x2="1040" y2="215"/><line x1="1140" y1="200" x2="1140" y2="215"/>
  </g>
  <rect x="528" y="158" width="24" height="44" rx="5" fill="var(--accent)"/>
  <text x="540" y="130" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">Value = 40</text>
  <text x="140" y="255" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Minimum = 0</text>
  <text x="1140" y="255" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Maximum = 100</text>
  <path d="M740,225 L740,235 L840,235 L840,225" fill="none" stroke="var(--ok)" stroke-width="2"/>
  <text x="790" y="265" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--ok)">TickFrequency = 10</text>
  <text x="640" y="310" text-anchor="middle" style="font-size:21px;fill:var(--muted)">IsSnapToTickEnabled="True" → 눈금 위에만 멈춘다 (40, 50, 60 …) · 값이 바뀔 때마다 ValueChanged</text>
  <line x1="40" y1="345" x2="1240" y2="345" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="640" y="395" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">ProgressBar — 코드가 값을 바꿔 “보여 주기만” 한다</text>
  <rect x="140" y="420" width="1000" height="40" rx="4" fill="none" stroke="var(--muted)" stroke-width="2"/>
  <rect x="142" y="422" width="398" height="36" fill="var(--ok)"/>
  <text x="340" y="448" text-anchor="middle" style="font-size:20px;fill:#fff;font-weight:700">Value = 40</text>
  <text x="640" y="505" text-anchor="middle" style="font-size:21px;fill:var(--muted)">둘 다 RangeBase 를 상속 — Minimum · Maximum · Value 사용법이 같다</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:21px;fill:var(--muted)">얼마나 걸릴지 모를 때는 IsIndeterminate="True" (막대가 계속 흘러감)</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch16',
    no: '16',
    title: '기본 컨트롤',
    subtitle: 'Basic Controls',
    summary: 'WPF 가 제공하는 기본 컨트롤을 콘텐츠 · 항목 · 범위 컨트롤로 나누어 익힙니다. TextBox · PasswordBox · Button · CheckBox · RadioButton 으로 입력 화면을 만들고, ComboBox · ListBox · Slider · ProgressBar · DatePicker 와 GroupBox · Expander · TabControl 로 쓸모 있는 화면을 구성합니다.',
    goals: [
      'WPF 컨트롤을 콘텐츠 컨트롤 · 항목 컨트롤 · 범위 컨트롤로 분류하고 각각의 핵심 속성을 말할 수 있다',
      'TextBlock · Label · TextBox · PasswordBox · Button 으로 입력 화면을 만들 수 있다',
      'CheckBox · RadioButton · ToggleButton 의 IsChecked 와 Checked/Unchecked 이벤트를 처리할 수 있다',
      'ComboBox · ListBox 의 항목을 추가 · 삭제하고 선택 항목을 읽을 수 있다 (Items 와 ItemsSource 구분)',
      'Slider · ProgressBar · DatePicker 로 값을 입력 · 표시하고, GroupBox · Expander · TabControl 로 화면을 묶을 수 있다'
    ],
    sections: [
      /* ===================== ch16-1 ===================== */
      {
        id: 'ch16-1',
        title: '텍스트 · 버튼 · 선택 컨트롤',
        minutes: 50,
        goals: [
          '컨트롤을 콘텐츠 · 항목 · 범위 컨트롤로 분류할 수 있다',
          'TextBlock 과 Label 의 차이, Label 의 액세스 키(_)와 Target 을 설명할 수 있다',
          'TextBox 의 여러 줄 입력 · 글자 수 제한 · TextChanged 이벤트를 사용할 수 있다',
          'PasswordBox 와 Button(IsDefault · IsCancel)으로 로그인 창을 만들 수 있다',
          'CheckBox · RadioButton · ToggleButton 으로 선택 값을 읽고 가격을 계산할 수 있다',
          'Content 속성에 문자열과 요소를 넣는 콘텐츠 모델을 설명할 수 있다'
        ],
        flow: [['도입: 컨트롤 분류', 6], ['TextBlock · Label · TextBox', 12], ['PasswordBox · Button', 8], ['CheckBox · RadioButton · ToggleButton', 12], ['콘텐츠 모델', 5], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: 'WPF 컨트롤 한눈에 보기' },
          { type: 'p', html: '<b>컨트롤(control)</b>은 버튼 · 입력 칸 · 체크 상자처럼 사용자가 보고 <b>조작하는 화면 부품</b>입니다. 15장까지 배운 패널(Grid · StackPanel …)이 “어디에 놓을지”를 정한다면, 이번 장의 컨트롤은 “무엇을 놓을지”입니다. WPF 컨트롤은 수십 개나 되지만, <b>어떤 클래스를 물려받았는지</b>로 나누면 세 부류로 정리되고, 같은 부류는 사용법이 거의 같습니다.' },
          { type: 'table', head: ['분류', '기반 클래스', '핵심 속성', '대표 컨트롤'], rows: [
            ['<b>콘텐츠 컨트롤</b>', '<code>ContentControl</code>', '<code>Content</code> — 내용 <b>하나</b>', 'Button, Label, CheckBox, RadioButton, ToggleButton, GroupBox, Expander'],
            ['<b>항목 컨트롤</b>', '<code>ItemsControl</code>', '<code>Items</code> / <code>ItemsSource</code> — 항목 <b>여러 개</b>', 'ComboBox, ListBox, ListView, TabControl, TreeView, Menu'],
            ['<b>범위 컨트롤</b>', '<code>RangeBase</code>', '<code>Value</code>, <code>Minimum</code>, <code>Maximum</code>', 'Slider, ProgressBar, ScrollBar'],
            ['텍스트 · 기타', '<code>Control</code> / <code>FrameworkElement</code>', '<code>Text</code>, <code>Password</code>, <code>SelectedDate</code> …', 'TextBlock, TextBox, PasswordBox, DatePicker, Image']
          ], caption: 'WPF 기본 컨트롤의 분류 — 이 장의 1교시는 콘텐츠 컨트롤과 텍스트, 2교시는 항목 · 범위 컨트롤' },
          { type: 'figure', html: SVG_TREE, caption: 'Control 에서 갈라지는 세 가지 부류. 같은 부류는 같은 속성(Content · Items · Value)을 공유한다' },
          { type: 'callout', kind: 'vs', title: '도구 상자로 컨트롤 놓기', html: '<ol><li><b>보기 → 도구 상자</b>(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd>)를 엽니다. <b>일반 WPF 컨트롤</b> / <b>모든 WPF 컨트롤</b> 목록에 이 장의 컨트롤이 모두 있습니다.</li><li>컨트롤을 디자이너 창이나 XAML 편집기 안으로 끌어다 놓으면 태그가 만들어집니다. (디자이너에 놓으면 <code>Margin</code> 이 제멋대로 붙기 쉬우므로, 익숙해지면 XAML 을 직접 쓰는 편이 깔끔합니다.)</li><li>컨트롤을 선택하고 <b>속성 창</b>(<kbd>F4</kbd>) 맨 위 <b>이름</b> 칸에 <code>txtName</code> 처럼 입력하면 <code>x:Name</code> 이 붙어 코드에서 쓸 수 있습니다. 속성 창의 <b>⚡(이벤트)</b> 단추를 누르면 이벤트 목록이 나오고, 칸을 더블클릭하면 처리기가 자동으로 만들어집니다.</li></ol>' },

          { type: 'h', text: 'TextBlock 과 Label — 글자 보여 주기' },
          { type: 'p', html: '둘 다 글자를 보여 주지만 쓰임이 다릅니다. <b>TextBlock</b> 은 가볍고 <code>Text</code> 속성에 문자열을 넣어 <b>글자만</b> 보여 줍니다. 설명 문구 · 결과 표시처럼 대부분의 글자는 TextBlock 으로 씁니다. <b>Label</b> 은 콘텐츠 컨트롤이라 <code>Content</code> 를 쓰며, 입력 칸 앞의 <b>이름표</b> 역할을 합니다. Label 만의 기능은 <b>액세스 키(access key)</b> 입니다. <code>Content="이름(_N):"</code> 처럼 밑줄(<code>_</code>) 뒤 글자를 정하고 <code>Target</code> 에 입력 칸을 연결하면, <kbd>Alt</kbd>+<kbd>N</kbd> 을 눌렀을 때 그 입력 칸으로 커서가 이동합니다.' },
          { type: 'table', head: ['', 'TextBlock', 'Label'], rows: [
            ['글자를 넣는 속성', '<code>Text</code> (문자열)', '<code>Content</code> (무엇이든)'],
            ['기반 클래스', 'FrameworkElement (가벼움)', 'ContentControl (컨트롤)'],
            ['줄 바꿈', '<code>TextWrapping="Wrap"</code>', '안에 TextBlock 을 넣어야 함'],
            ['액세스 키', '없음', '<code>_N</code> + <code>Target</code> 으로 입력 칸에 포커스'],
            ['주 용도', '설명 · 결과 · 제목 등 대부분의 글자', '입력 칸 앞의 이름표']
          ] },
          { type: 'code', title: '예제 16-1. TextBlock 과 Label — 액세스 키로 입력 칸 이동', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16LabelDemo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="TextBlock 과 Label" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="Alt 키를 누르면 Label 의 밑줄 글자가 보입니다. Alt+N, Alt+A 로 입력 칸을 옮겨 다녀 보세요."
                   TextWrapping="Wrap" Foreground="DimGray" Margin="0,0,0,10"/>
        <Label Content="이름(_N):" Target="{Binding ElementName=txtName}"/>
        <TextBox x:Name="txtName" Margin="5,0,5,5"/>
        <Label Content="나이(_A):" Target="{Binding ElementName=txtAge}"/>
        <TextBox x:Name="txtAge" Margin="5,0,5,10"/>
        <Button Content="확인" Width="80" HorizontalAlignment="Left" Margin="5,0" Click="btnOk_Click"/>
        <TextBlock x:Name="txtResult" Margin="5,10" FontSize="14" FontWeight="Bold" TextWrapping="Wrap"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch16LabelDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtName.Text = "홍길동";
            txtAge.Text = "17";
            txtResult.Text = "확인 버튼을 눌러 보세요.";
        }

        private void btnOk_Click(object sender, RoutedEventArgs e)
        {
            txtResult.Text = $"{txtName.Text} 님은 {txtAge.Text}살입니다.";
        }
    }
}`, desc: '<code>Target="{Binding ElementName=txtName}"</code> 은 “이 Label 의 짝은 <code>txtName</code> 이라는 이름의 컨트롤”이라는 뜻입니다(바인딩은 18장에서 자세히). 밑줄 글자 자체를 쓰고 싶으면 <code>__</code> 처럼 두 번 씁니다. 결과 표시는 가벼운 <b>TextBlock</b> 에 맡겼습니다.' },

          { type: 'h', text: 'TextBox — 글자 입력받기' },
          { type: 'p', html: '<b>TextBox</b> 는 사용자가 글자를 입력하는 칸입니다. 입력된 글자는 <code>Text</code> 속성(문자열)에 들어 있고, 글자가 바뀔 때마다 <b>TextChanged</b> 이벤트가 발생합니다. 기본은 한 줄 입력이지만 속성 두 개로 여러 줄 메모장이 됩니다.' },
          { type: 'table', head: ['속성 · 이벤트', '의미', '예'], rows: [
            ['<code>Text</code>', '입력된 글자 (읽기 · 쓰기)', '<code>txtMemo.Text = "";</code>'],
            ['<code>MaxLength</code>', '입력할 수 있는 최대 글자 수 (0 = 제한 없음)', '<code>MaxLength="200"</code>'],
            ['<code>IsReadOnly</code>', '읽기 전용 (선택 · 복사는 가능, 수정 불가)', '<code>IsReadOnly="True"</code>'],
            ['<code>AcceptsReturn</code>', '<kbd>Enter</kbd> 로 줄 바꿈 허용 → <b>여러 줄 입력</b>', '<code>AcceptsReturn="True"</code>'],
            ['<code>TextWrapping</code>', '칸 너비를 넘으면 자동 줄 바꿈', '<code>TextWrapping="Wrap"</code>'],
            ['<code>VerticalScrollBarVisibility</code>', '세로 스크롤 막대 표시', '<code>"Auto"</code> (넘칠 때만)'],
            ['<code>TextChanged</code>', '글자가 바뀔 때마다 발생', '<code>(object sender, TextChangedEventArgs e)</code>']
          ] },
          { type: 'code', title: '예제 16-2. 글자 수를 세는 메모장', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16MemoCounter.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="글자 수 세는 메모" Width="420" Height="340">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,6">
            <TextBlock Text="오늘의 메모 (최대 200자)" FontWeight="Bold" VerticalAlignment="Center"/>
            <CheckBox x:Name="chkReadOnly" Content="읽기 전용" Margin="20,0,0,0" VerticalAlignment="Center"
                      Checked="chkReadOnly_Changed" Unchecked="chkReadOnly_Changed"/>
        </StackPanel>
        <TextBlock x:Name="txtCount" DockPanel.Dock="Bottom" Margin="0,6,0,0"/>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" TextWrapping="Wrap" MaxLength="200"
                 VerticalScrollBarVisibility="Auto" FontSize="14"
                 TextChanged="txtMemo_TextChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16MemoCounter
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // 모든 컨트롤이 준비된 뒤에 글자를 넣으면 TextChanged 가 바로 한 번 실행됩니다
            txtMemo.Text = "WPF 기본 컨트롤 공부하기\\n1. TextBox\\n2. Button";
        }

        private void txtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            string text = txtMemo.Text;
            int lines = text.Split('\\n').Length;
            txtCount.Text = $"글자 수: {text.Length} / {txtMemo.MaxLength}   줄 수: {lines}";
            txtCount.Foreground = text.Length >= 180 ? Brushes.Red : Brushes.Gray;   // 거의 다 차면 빨간색
        }

        private void chkReadOnly_Changed(object sender, RoutedEventArgs e)
        {
            txtMemo.IsReadOnly = chkReadOnly.IsChecked == true;
            txtMemo.Background = txtMemo.IsReadOnly ? Brushes.WhiteSmoke : Brushes.White;
        }
    }
}`, desc: '글자를 입력 · 삭제할 때마다 아래 글자 수가 바뀌고, 180자를 넘으면 빨간색이 됩니다. 200자가 되면 더 입력되지 않습니다(<code>MaxLength</code>). “읽기 전용”을 체크하면 글자를 고칠 수 없습니다. <code>DockPanel</code> 의 마지막 자식(TextBox)이 남은 공간을 모두 채워 메모장 모양이 됩니다.' },
          { type: 'callout', kind: 'warn', title: 'InitializeComponent 도중에 이벤트가 먼저 올 수 있어요', html: 'XAML 에 <code>Text="…"</code>, <code>IsChecked="True"</code>, <code>Value="50"</code> 처럼 값을 적으면, <code>InitializeComponent()</code> 가 화면을 만드는 <b>도중에</b> TextChanged · Checked · ValueChanged 이벤트가 발생할 수 있습니다. 이때 XAML 에서 <b>더 아래에 있는</b> 컨트롤은 아직 만들어지지 않아 <code>null</code> 이므로, 처리기에서 그 컨트롤을 쓰면 <code>NullReferenceException</code> 으로 프로그램이 멈춥니다. 해결 방법은 두 가지입니다.<ol><li>처음 값은 XAML 대신 <b>생성자에서 InitializeComponent() 다음에</b> 넣는다 (예제 16-2 방식)</li><li>처리기 첫 줄에 <code>if (txtTotal == null) return;</code> 처럼 <b>가드(guard)</b>를 둔다 (예제 16-4 방식)</li></ol>' },

          { type: 'h', text: 'PasswordBox 와 Button — 로그인 창' },
          { type: 'p', html: '<b>PasswordBox</b> 는 입력한 글자를 ●로 가려 보여 주는 비밀번호 전용 칸입니다. 보안을 위해 <code>Text</code> 가 없고 <b><code>Password</code></b> 속성으로만 값을 읽으며, 바뀔 때 <b>PasswordChanged</b> 이벤트가 발생합니다.' },
          { type: 'p', html: '<b>Button</b> 은 <code>Click</code> 이벤트가 핵심이고, 대화 상자에서 편리한 두 속성이 있습니다. <code>IsDefault="True"</code> 인 버튼은 창 어디서든 <kbd>Enter</kbd> 를 누르면 눌리고(기본 버튼), <code>IsCancel="True"</code> 인 버튼은 <kbd>Esc</kbd> 를 누르면 눌립니다(취소 버튼). 또 Button 은 콘텐츠 컨트롤이므로 <code>Content</code> 에 글자 대신 <b>StackPanel 을 넣어 아이콘 + 글자</b> 버튼을 만들 수 있습니다.' },
          { type: 'code', title: '예제 16-3. 로그인 창 — PasswordBox · IsDefault · IsCancel', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Login.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="로그인" Width="360" Height="260" ResizeMode="NoResize">
    <Grid Margin="15">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Label Content="아이디(_I):" Target="{Binding ElementName=txtId}"/>
        <TextBox x:Name="txtId" Grid.Column="1" Margin="0,3" MaxLength="12"/>
        <Label Content="비밀번호(_P):" Grid.Row="1" Target="{Binding ElementName=pwdBox}"/>
        <PasswordBox x:Name="pwdBox" Grid.Row="1" Grid.Column="1" Margin="0,3" MaxLength="16"
                     PasswordChanged="pwdBox_PasswordChanged"/>
        <TextBlock x:Name="txtStrength" Grid.Row="2" Grid.Column="1" Foreground="Gray" Margin="0,2"/>
        <TextBlock x:Name="txtMessage" Grid.Row="3" Grid.ColumnSpan="2" VerticalAlignment="Center" TextWrapping="Wrap"/>
        <StackPanel Grid.Row="4" Grid.ColumnSpan="2" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button IsDefault="True" Padding="10,4" Click="btnLogin_Click">
                <StackPanel Orientation="Horizontal">
                    <TextBlock Text="🔑" Margin="0,0,5,0"/>
                    <TextBlock Text="로그인"/>
                </StackPanel>
            </Button>
            <Button Content="취소" IsCancel="True" Padding="10,4" Margin="8,0,0,0" Click="btnCancel_Click"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch16Login
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtId.Text = "admin";
            txtStrength.Text = "비밀번호를 입력하세요 (연습용 정답: 1234)";
            txtMessage.Text = "Enter = 로그인, Esc = 취소(창 닫기)";
        }

        private void pwdBox_PasswordChanged(object sender, RoutedEventArgs e)
        {
            int len = pwdBox.Password.Length;
            if (len == 0) txtStrength.Text = "";
            else if (len < 4) txtStrength.Text = $"{len}자 — 너무 짧아요";
            else if (len < 8) txtStrength.Text = $"{len}자 — 보통";
            else txtStrength.Text = $"{len}자 — 좋아요";
        }

        private void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            if (txtId.Text == "admin" && pwdBox.Password == "1234")
            {
                txtMessage.Foreground = Brushes.Green;
                txtMessage.Text = $"{txtId.Text} 님, 환영합니다!";
            }
            else
            {
                txtMessage.Foreground = Brushes.Red;
                txtMessage.Text = "아이디 또는 비밀번호가 틀렸습니다.";
                pwdBox.Clear();      // 틀리면 비밀번호 칸을 비우고
                pwdBox.Focus();      // 다시 입력하도록 커서를 옮김
            }
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`, desc: '비밀번호 칸에 <code>1234</code> 를 입력하고 <kbd>Enter</kbd> 를 눌러 보세요. 버튼을 누르지 않아도 <code>IsDefault</code> 버튼이 눌립니다. <kbd>Esc</kbd> 는 취소 버튼을 눌러 창을 닫습니다. 로그인 버튼의 <code>Content</code> 는 문자열이 아니라 <b>StackPanel</b>(아이콘 TextBlock + 글자 TextBlock)입니다.' },
          { type: 'callout', kind: 'info', title: '실제 프로그램에서는', html: '비밀번호를 코드에 그대로 적어 비교하는 것은 <b>연습용</b>입니다. 실제 서비스에서는 서버에 보내 확인하고, 저장할 때는 해시(hash)로 바꿔 저장합니다. PasswordBox 가 <code>Password</code> 를 바인딩으로 내보내지 않는 것도 비밀번호가 메모리 여기저기에 남지 않게 하려는 보안 설계입니다.' },

          { type: 'h', text: 'CheckBox · RadioButton · ToggleButton — 선택하기' },
          { type: 'p', html: '세 컨트롤은 모두 <code>ToggleButton</code> 계열로, “눌림/안 눌림” 상태를 <b><code>IsChecked</code></b> 속성에 저장합니다. 체크되면 <b>Checked</b>, 해제되면 <b>Unchecked</b> 이벤트가 발생합니다. 차이는 <b>몇 개를 고를 수 있느냐</b>입니다.' },
          { type: 'table', head: ['컨트롤', '고르는 방식', '모양', '쓰임 예'], rows: [
            ['<b>CheckBox</b>', '각각 독립 — <b>여러 개</b> 선택', '☑ 네모 체크', '토핑 선택, 약관 동의, “다시 보지 않기”'],
            ['<b>RadioButton</b>', '같은 그룹에서 <b>하나만</b> 선택', '◉ 동그라미', '크기(S/M/L), 성별, 결제 방법'],
            ['<b>ToggleButton</b>', '버튼 하나가 켜짐/꺼짐 유지', '눌린 채로 있는 버튼', '굵게 B, 음소거, 알림 켜기']
          ] },
          { type: 'p', html: 'RadioButton 은 기본적으로 <b>같은 패널 안의</b> 라디오 버튼끼리 한 그룹입니다. 한 패널 안에 그룹을 여러 개 두려면 <code>GroupName="Size"</code> 처럼 이름을 붙여 나눕니다.' },
          { type: 'code', title: '예제 16-4. 피자 주문 — RadioButton + CheckBox 로 가격 계산', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16PizzaOrder.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="피자 주문" Width="440" Height="300">
    <Grid Margin="15">
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <TextBlock Text="① 크기 (하나만)" FontWeight="Bold"/>
        <TextBlock Text="② 토핑 (여러 개)" FontWeight="Bold" Grid.Column="1"/>
        <StackPanel Grid.Row="1" Margin="0,8">
            <RadioButton x:Name="rdoS" GroupName="Size" Content="S (12,000원)" Margin="0,3" Checked="Option_Changed"/>
            <RadioButton x:Name="rdoM" GroupName="Size" Content="M (15,000원)" Margin="0,3" IsChecked="True" Checked="Option_Changed"/>
            <RadioButton x:Name="rdoL" GroupName="Size" Content="L (18,000원)" Margin="0,3" Checked="Option_Changed"/>
        </StackPanel>
        <StackPanel Grid.Row="1" Grid.Column="1" Margin="0,8">
            <CheckBox x:Name="chkCheese" Content="치즈 추가 (+2,000원)" Margin="0,3" Checked="Option_Changed" Unchecked="Option_Changed"/>
            <CheckBox x:Name="chkBacon" Content="베이컨 (+3,000원)" Margin="0,3" Checked="Option_Changed" Unchecked="Option_Changed"/>
            <CheckBox x:Name="chkOlive" Content="올리브 (+1,000원)" Margin="0,3" Checked="Option_Changed" Unchecked="Option_Changed"/>
        </StackPanel>
        <TextBlock x:Name="txtTotal" Grid.Row="2" Grid.ColumnSpan="2" FontSize="16" FontWeight="Bold" TextWrapping="Wrap"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch16PizzaOrder
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            chkCheese.IsChecked = true;   // 기본으로 치즈 추가
            UpdatePrice();
        }

        // 라디오 버튼 3개 + 체크 상자 3개가 모두 이 처리기 하나를 함께 씁니다
        private void Option_Changed(object sender, RoutedEventArgs e)
        {
            if (txtTotal == null) return;   // InitializeComponent 도중(rdoM 의 IsChecked="True")에는 아직 없음
            UpdatePrice();
        }

        private void UpdatePrice()
        {
            int price = 0;
            string size = "";
            if (rdoS.IsChecked == true) { price = 12000; size = "S"; }
            else if (rdoM.IsChecked == true) { price = 15000; size = "M"; }
            else if (rdoL.IsChecked == true) { price = 18000; size = "L"; }

            int toppings = 0;
            if (chkCheese.IsChecked == true) { price += 2000; toppings++; }
            if (chkBacon.IsChecked == true) { price += 3000; toppings++; }
            if (chkOlive.IsChecked == true) { price += 1000; toppings++; }

            txtTotal.Text = $"{size} 사이즈 + 토핑 {toppings}개 = 합계 {price:N0}원";
        }
    }
}`, desc: '크기는 하나만, 토핑은 여러 개 고를 수 있습니다. 무엇을 바꾸든 같은 <code>Option_Changed</code> 가 불려 <b>처음부터 다시 계산</b>합니다. “바뀐 것만 더하고 빼기”보다 “매번 전부 다시 계산”이 훨씬 실수가 적습니다. 첫 화면은 M + 치즈로 <b>17,000원</b>입니다.' },
          { type: 'callout', kind: 'tip', title: '왜 IsChecked == true 라고 쓸까?', html: '<code>IsChecked</code> 의 형식은 <code>bool</code> 이 아니라 <b><code>bool?</code></b>(null 이 될 수 있는 bool)입니다. 체크 상자에는 “체크 · 해제 · <b>일부(모름)</b>” 세 가지 상태가 있기 때문입니다. 그래서 <code>if (chkCheese.IsChecked)</code> 는 컴파일 오류(CS0266)이고, <code>== true</code> 로 비교해야 합니다. null 이면 <code>== true</code> 가 false 이므로 안전합니다.' },
          { type: 'p', html: '세 번째 상태를 실제로 쓰는 곳이 <b>“전체 선택”</b> 체크 상자입니다. <code>IsThreeState="True"</code> 로 하면 IsChecked 가 <code>null</code>(일부 선택, ■ 모양)이 될 수 있습니다. 같은 예제에서 <b>ToggleButton</b> 도 살펴봅니다.' },
          { type: 'code', title: '예제 16-5. 전체 선택(IsThreeState)과 ToggleButton', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ThreeState.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="전체 선택과 토글 버튼" Width="420" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="장보기 목록" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
        <CheckBox x:Name="chkAll" Content="전체 선택" IsThreeState="True" FontWeight="Bold" Click="chkAll_Click"/>
        <StackPanel Margin="20,5,0,10">
            <CheckBox x:Name="chkMilk" Content="우유" Margin="0,2" Checked="Item_Changed" Unchecked="Item_Changed"/>
            <CheckBox x:Name="chkEgg" Content="달걀" Margin="0,2" Checked="Item_Changed" Unchecked="Item_Changed"/>
            <CheckBox x:Name="chkBread" Content="식빵" Margin="0,2" Checked="Item_Changed" Unchecked="Item_Changed"/>
        </StackPanel>
        <TextBlock x:Name="txtState" Foreground="SteelBlue"/>
        <Separator Margin="0,12"/>
        <StackPanel Orientation="Horizontal">
            <ToggleButton x:Name="tglBold" Content="굵게" Width="70" Checked="tglBold_Changed" Unchecked="tglBold_Changed"/>
            <TextBlock x:Name="txtSample" Text="토글 버튼은 눌린 상태가 유지됩니다" Margin="10,0" VerticalAlignment="Center"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch16ThreeState
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            chkMilk.IsChecked = true;   // 하나만 체크 → 전체 선택은 '일부' 상태가 됨
        }

        // 사용자가 '전체 선택'을 눌렀을 때 (Click 은 사용자가 누를 때만 발생)
        private void chkAll_Click(object sender, RoutedEventArgs e)
        {
            if (chkAll.IsChecked == null) chkAll.IsChecked = false;   // 눌러서 '일부'가 되면 '해제'로
            bool value = chkAll.IsChecked == true;
            chkMilk.IsChecked = value;
            chkEgg.IsChecked = value;
            chkBread.IsChecked = value;
        }

        // 항목 하나가 바뀌면 '전체 선택'의 상태를 다시 정함
        private void Item_Changed(object sender, RoutedEventArgs e)
        {
            int count = 0;
            if (chkMilk.IsChecked == true) count++;
            if (chkEgg.IsChecked == true) count++;
            if (chkBread.IsChecked == true) count++;

            if (count == 3) chkAll.IsChecked = true;
            else if (count == 0) chkAll.IsChecked = false;
            else chkAll.IsChecked = null;              // 일부만 선택 = 세 번째 상태
            txtState.Text = $"선택 {count}개 / 전체 선택: {chkAll.IsChecked?.ToString() ?? "null (일부)"}";
        }

        private void tglBold_Changed(object sender, RoutedEventArgs e)
        {
            bool on = tglBold.IsChecked == true;
            txtSample.FontWeight = on ? FontWeights.Bold : FontWeights.Normal;
            tglBold.Content = on ? "굵게 ✔" : "굵게";
        }
    }
}`, desc: '항목을 하나씩 체크해 보면 “전체 선택”이 해제 → 일부(■) → 체크로 바뀝니다. “전체 선택”을 누르면 세 항목이 한꺼번에 바뀝니다. 전체 선택에는 <code>Checked</code> 대신 <b><code>Click</code></b> 을 썼는데, 코드가 <code>IsChecked</code> 를 바꿀 때는 Click 이 발생하지 않아 “서로 계속 부르는” 무한 반복을 피할 수 있기 때문입니다.' },

          { type: 'h', text: '콘텐츠 모델 — Content 에는 무엇이든 하나' },
          { type: 'p', html: 'Button · Label · CheckBox · RadioButton · ToggleButton 은 모두 <code>ContentControl</code> 을 상속한 <b>콘텐츠 컨트롤</b>입니다. 이들의 <code>Content</code> 속성은 형식이 <code>object</code> 라서 <b>문자열이면 글자로</b>, <b>UIElement(요소)면 그 요소를 그대로</b> 그립니다. 이것을 WPF 의 <b>콘텐츠 모델(content model)</b>이라고 합니다. 단, 넣을 수 있는 것은 <b>하나</b>뿐이라 여러 요소를 넣으려면 패널로 묶습니다.' },
          { type: 'figure', html: SVG_CONTENT, caption: 'Content 에 문자열을 넣으면 글자, 요소를 넣으면 그 요소가 그대로 그려진다' },
          { type: 'code', title: '예제 16-6. 콘텐츠 모델 — Content 에 문자열 · 요소 넣기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ContentModel.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="콘텐츠 모델" Width="420" Height="340">
    <StackPanel Margin="15">
        <Button Content="① 글자만 넣은 버튼" Margin="0,4" Padding="6"/>
        <Button Margin="0,4" Padding="6">
            <StackPanel Orientation="Horizontal">
                <Ellipse Width="16" Height="16" Fill="Tomato" Margin="0,0,8,0"/>
                <TextBlock Text="② 도형 + 글자를 넣은 버튼" VerticalAlignment="Center"/>
            </StackPanel>
        </Button>
        <CheckBox Margin="0,8">
            <StackPanel>
                <TextBlock Text="③ 두 줄짜리 체크 상자" FontWeight="Bold"/>
                <TextBlock Text="Content 에 StackPanel 을 넣었습니다" Foreground="Gray"/>
            </StackPanel>
        </CheckBox>
        <Button x:Name="btnSwap" Content="④ 눌러서 Content 바꾸기" Margin="0,4" Padding="6" Click="btnSwap_Click"/>
        <TextBlock x:Name="txtInfo" Margin="0,8" TextWrapping="Wrap" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16ContentModel
{
    public partial class MainWindow : Window
    {
        private int clicks = 0;

        public MainWindow()
        {
            InitializeComponent();
            ShowType();
        }

        private void btnSwap_Click(object sender, RoutedEventArgs e)
        {
            clicks++;
            if (clicks % 2 == 1)
            {
                // Content 에 요소(TextBlock)를 코드로 만들어 넣기
                btnSwap.Content = new TextBlock
                {
                    Text = "★ 요소로 바뀌었습니다 ★",
                    Foreground = Brushes.Crimson,
                    FontWeight = FontWeights.Bold
                };
            }
            else
            {
                btnSwap.Content = "④ 다시 문자열로";   // Content 에 문자열 넣기
            }
            ShowType();
        }

        private void ShowType()
        {
            txtInfo.Text = $"지금 btnSwap.Content 의 형식: {btnSwap.Content?.GetType().Name}";
        }
    }
}`, desc: '④ 버튼을 누를 때마다 <code>Content</code> 가 <code>String</code> ↔ <code>TextBlock</code> 으로 바뀌는 것을 아래 글자로 확인하세요. ③처럼 CheckBox 의 글자도 여러 줄 · 여러 색으로 꾸밀 수 있습니다. XAML 에서 태그 사이에 넣은 자식은 자동으로 <code>Content</code> 에 들어갑니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Content 에 일반 객체를 넣으면?', html: '<code>Content</code> 에 <code>Student</code> 같은 일반 클래스 객체를 넣으면, 기본적으로 그 객체의 <code>ToString()</code> 결과가 글자로 표시됩니다. <b>DataTemplate</b> 을 지정하면 객체를 원하는 모양(사진 + 이름 + 점수 …)으로 그릴 수 있는데, 이것은 18장(데이터 바인딩)과 19장(템플릿)에서 다시 만납니다.' }
        ],
        practice: [
          {
            title: '실습 16-1. 글자 수 제한 게시글 작성기',
            level: 1,
            desc: '<p>최대 100자까지 쓸 수 있는 게시글 작성 창을 완성하세요.</p><ul><li>글자를 입력할 때마다 아래에 <code>남은 글자: 85</code> 처럼 표시합니다. 남은 글자가 <b>10 이하</b>면 빨간색, 아니면 회색.</li><li>내용이 비어 있으면(공백만 있어도) <b>게시</b> 버튼을 누를 수 없게(<code>IsEnabled = false</code>) 합니다.</li><li>게시 버튼을 누르면 맨 아래에 <code>게시됨: (내용)</code> 을 표시하고 입력 칸을 비웁니다.</li></ul>',
            hint: '남은 글자 = <code>txtPost.MaxLength - txtPost.Text.Length</code>. 빈 내용 검사는 <code>txtPost.Text.Trim().Length &gt; 0</code>. XAML 에서 btnPost 가 txtPost 보다 아래에 있으므로 처리기 첫 줄에 <code>if (btnPost == null) return;</code> 가드를 두세요.',
            starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="게시글 작성" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="무슨 생각을 하고 있나요? (최대 100자)" FontWeight="Bold" Margin="0,0,0,6"/>
        <TextBox x:Name="txtPost" Height="110" AcceptsReturn="True" TextWrapping="Wrap" MaxLength="100"
                 TextChanged="txtPost_TextChanged"/>
        <DockPanel Margin="0,6">
            <Button x:Name="btnPost" Content="게시" Width="70" DockPanel.Dock="Right" IsEnabled="False" Click="btnPost_Click"/>
            <TextBlock x:Name="txtRemain" Text="남은 글자: 100" Foreground="Gray" VerticalAlignment="Center"/>
        </DockPanel>
        <TextBlock x:Name="txtLast" Margin="0,10" TextWrapping="Wrap" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16Practice1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void txtPost_TextChanged(object sender, TextChangedEventArgs e)
        {
            // TODO: 남은 글자 표시 (10 이하 빨간색), 비어 있으면 게시 버튼 끄기
        }

        private void btnPost_Click(object sender, RoutedEventArgs e)
        {
            // TODO: "게시됨: 내용" 표시 후 입력 칸 비우기
        }
    }
}
`,
            solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="게시글 작성" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="무슨 생각을 하고 있나요? (최대 100자)" FontWeight="Bold" Margin="0,0,0,6"/>
        <TextBox x:Name="txtPost" Height="110" AcceptsReturn="True" TextWrapping="Wrap" MaxLength="100"
                 TextChanged="txtPost_TextChanged"/>
        <DockPanel Margin="0,6">
            <Button x:Name="btnPost" Content="게시" Width="70" DockPanel.Dock="Right" IsEnabled="False" Click="btnPost_Click"/>
            <TextBlock x:Name="txtRemain" Text="남은 글자: 100" Foreground="Gray" VerticalAlignment="Center"/>
        </DockPanel>
        <TextBlock x:Name="txtLast" Margin="0,10" TextWrapping="Wrap" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16Practice1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtPost.Text = "오늘 WPF 컨트롤을 배웠다!";
        }

        private void txtPost_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (btnPost == null || txtRemain == null) return;   // 초기화 도중에는 무시

            int remain = txtPost.MaxLength - txtPost.Text.Length;
            txtRemain.Text = $"남은 글자: {remain}";
            txtRemain.Foreground = remain <= 10 ? Brushes.Red : Brushes.Gray;
            btnPost.IsEnabled = txtPost.Text.Trim().Length > 0;
        }

        private void btnPost_Click(object sender, RoutedEventArgs e)
        {
            txtLast.Text = "게시됨: " + txtPost.Text;
            txtPost.Clear();       // TextChanged 가 다시 불려 남은 글자 100, 버튼 꺼짐
            txtPost.Focus();
        }
    }
}
`
          },
          {
            title: '실습 16-2. 회원 가입 창',
            level: 2,
            desc: '<p>아이디 · 비밀번호 · 비밀번호 확인 · 약관 동의로 이루어진 회원 가입 창을 완성하세요.</p><ul><li>비밀번호 두 칸이 바뀔 때마다 <code>✔ 비밀번호가 일치합니다</code>(초록) 또는 <code>✖ 비밀번호가 다릅니다</code>(빨강)를 표시합니다. 둘 다 비어 있으면 아무것도 표시하지 않습니다.</li><li>아이디가 비어 있지 않고, 비밀번호가 4자 이상이면서 일치하고, 약관에 동의(체크)했을 때만 <b>가입</b> 버튼이 켜집니다.</li><li>가입 버튼(<code>IsDefault</code>)을 누르면 <code>MessageBox</code> 로 “○○ 님, 가입을 환영합니다!” 를 보여 줍니다.</li></ul>',
            hint: '모든 이벤트(TextChanged · PasswordChanged · Checked · Unchecked)에서 같은 <code>Validate()</code> 메서드를 부르게 하면 간단합니다. 조건은 <code>bool ok = … &amp;&amp; … &amp;&amp; …;</code> 한 줄로 만들고 <code>btnJoin.IsEnabled = ok;</code>',
            starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice2.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="회원 가입" Width="380" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="아이디"/>
        <TextBox x:Name="txtId" Margin="0,2,0,8" TextChanged="Input_Changed"/>
        <TextBlock Text="비밀번호 (4자 이상)"/>
        <PasswordBox x:Name="pwd1" Margin="0,2,0,8" PasswordChanged="Input_Changed"/>
        <TextBlock Text="비밀번호 확인"/>
        <PasswordBox x:Name="pwd2" Margin="0,2,0,4" PasswordChanged="Input_Changed"/>
        <TextBlock x:Name="txtMatch" Margin="0,0,0,8"/>
        <CheckBox x:Name="chkAgree" Content="이용 약관에 동의합니다" Checked="Input_Changed" Unchecked="Input_Changed"/>
        <Button x:Name="btnJoin" Content="가입" Width="80" Margin="0,12,0,0" HorizontalAlignment="Right"
                IsDefault="True" IsEnabled="False" Click="btnJoin_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch16Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Input_Changed(object sender, RoutedEventArgs e)
        {
            // TODO: 비밀번호 일치 표시 + 가입 버튼 켜기/끄기
        }

        private void btnJoin_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 환영 메시지
        }
    }
}
`,
            solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice2.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="회원 가입" Width="380" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="아이디"/>
        <TextBox x:Name="txtId" Margin="0,2,0,8" TextChanged="Input_Changed"/>
        <TextBlock Text="비밀번호 (4자 이상)"/>
        <PasswordBox x:Name="pwd1" Margin="0,2,0,8" PasswordChanged="Input_Changed"/>
        <TextBlock Text="비밀번호 확인"/>
        <PasswordBox x:Name="pwd2" Margin="0,2,0,4" PasswordChanged="Input_Changed"/>
        <TextBlock x:Name="txtMatch" Margin="0,0,0,8"/>
        <CheckBox x:Name="chkAgree" Content="이용 약관에 동의합니다" Checked="Input_Changed" Unchecked="Input_Changed"/>
        <Button x:Name="btnJoin" Content="가입" Width="80" Margin="0,12,0,0" HorizontalAlignment="Right"
                IsDefault="True" IsEnabled="False" Click="btnJoin_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch16Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtId.Text = "coder";   // 확인용 기본값
        }

        // TextChanged 의 TextChangedEventArgs 도 RoutedEventArgs 를 상속하므로 처리기 하나로 함께 받을 수 있습니다
        private void Input_Changed(object sender, RoutedEventArgs e)
        {
            Validate();
        }

        private void Validate()
        {
            if (btnJoin == null) return;   // 초기화 도중에는 무시

            string p1 = pwd1.Password, p2 = pwd2.Password;
            bool same = p1 == p2;
            if (p1 == "" && p2 == "")
            {
                txtMatch.Text = "";
            }
            else if (same)
            {
                txtMatch.Text = "✔ 비밀번호가 일치합니다";
                txtMatch.Foreground = Brushes.Green;
            }
            else
            {
                txtMatch.Text = "✖ 비밀번호가 다릅니다";
                txtMatch.Foreground = Brushes.Red;
            }

            bool ok = txtId.Text.Trim() != "" && p1.Length >= 4 && same && chkAgree.IsChecked == true;
            btnJoin.IsEnabled = ok;
        }

        private void btnJoin_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show($"{txtId.Text} 님, 가입을 환영합니다!", "가입 완료");
        }
    }
}
`
          }
        ],
        quiz: [
          { q: '<code>&lt;Label Content="이름(_N):" Target="{Binding ElementName=txtName}"/&gt;</code> 에서 <kbd>Alt</kbd>+<kbd>N</kbd> 을 누르면?', options: ['Label 의 글자가 N 으로 바뀐다', '창이 닫힌다', 'txtName 입력 칸으로 커서(포커스)가 이동한다', '아무 일도 일어나지 않는다'], answer: 2, explain: '밑줄(<code>_</code>) 뒤 글자가 액세스 키가 되고, <code>Target</code> 으로 연결한 컨트롤로 포커스가 이동합니다. TextBlock 에는 이 기능이 없습니다.' },
          { q: 'TextBox 에서 <kbd>Enter</kbd> 로 줄을 바꾸고, 긴 줄은 자동으로 접히는 <b>여러 줄 메모장</b>을 만들려면?', options: ['<code>AcceptsReturn="True"</code> 와 <code>TextWrapping="Wrap"</code>', '<code>MaxLength="0"</code>', '<code>IsReadOnly="True"</code>', '<code>MultiLine="True"</code>'], answer: 0, explain: 'WPF TextBox 에는 MultiLine 속성이 없습니다. <code>AcceptsReturn</code> 이 Enter 줄 바꿈을, <code>TextWrapping</code> 이 자동 줄 바꿈을 담당합니다.' },
          { q: 'PasswordBox 에 입력된 비밀번호를 코드에서 읽는 방법은?', options: ['<code>pwdBox.Text</code>', '<code>pwdBox.Content</code>', '<code>pwdBox.Value</code>', '<code>pwdBox.Password</code>'], answer: 3, explain: '보안 때문에 PasswordBox 에는 Text 가 없고 <code>Password</code> 속성만 있습니다. 바뀔 때는 PasswordChanged 이벤트가 발생합니다.' },
          { q: '한 StackPanel 안의 RadioButton 6개를 “크기 3개”와 “배달 방법 3개”의 두 그룹으로 나누려면?', options: ['IsThreeState 를 True 로 한다', '<code>GroupName</code> 을 그룹별로 다르게 준다', 'Checked 이벤트를 따로 만든다', 'CheckBox 로 바꾼다'], answer: 1, explain: '같은 부모 안의 RadioButton 은 기본적으로 한 그룹입니다. <code>GroupName="Size"</code>, <code>GroupName="Delivery"</code> 처럼 이름을 주면 그룹이 나뉩니다.' },
          { q: '다음 코드가 컴파일 오류가 나는 이유는?<pre><code>if (chkAgree.IsChecked)\n{\n    btnJoin.IsEnabled = true;\n}</code></pre>', options: ['IsChecked 는 string 이라서', 'Checked 이벤트 안에서만 쓸 수 있어서', 'IsChecked 는 bool? 이라 bool 로 자동 변환되지 않아서', 'if 문에는 속성을 쓸 수 없어서'], answer: 2, explain: '<code>IsChecked</code> 는 null(세 번째 상태)이 될 수 있는 <code>bool?</code> 입니다. <code>if (chkAgree.IsChecked == true)</code> 로 비교해야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '텍스트 · 버튼 · 선택 컨트롤', subtitle: 'Chapter 16 · Section 01 — 기본 컨트롤 ①', badge: '16-1',
            notes: '<p><b>[도입 2분]</b> 회원 가입 화면이나 피자 주문 앱 화면을 보여 주며 “이 화면에 어떤 부품이 보이나요?” — 입력 칸, 버튼, 체크 상자, 동그라미 선택… 오늘 이 부품들을 모두 만들어 봅니다.</p><p>오늘 목표: 컨트롤 분류 3가지, TextBox · PasswordBox · Button, CheckBox · RadioButton, 콘텐츠 모델.</p>' },
          { layout: 'bullets', title: '컨트롤은 세 부류로 나뉜다', lead: '어떤 클래스를 상속했는지 알면 사용법이 보인다',
            bullets: ['<b>콘텐츠 컨트롤</b> (ContentControl) — <code>Content</code> 하나', ['Button · Label · CheckBox · RadioButton · ToggleButton'], '<b>항목 컨트롤</b> (ItemsControl) — <code>Items</code> 여러 개', ['ComboBox · ListBox · TabControl (2교시)'], '<b>범위 컨트롤</b> (RangeBase) — <code>Value</code> · <code>Minimum</code> · <code>Maximum</code>', ['Slider · ProgressBar (2교시)']],
            notes: '<p><b>[3분]</b> “Button 을 배우면 CheckBox 의 Content 도 이미 아는 것”이라는 점을 강조. 같은 부모 클래스 → 같은 속성.</p><p>발문: “ListBox 는 어느 부류일까?” → 항목 여러 개 → 항목 컨트롤.</p>' },
          { layout: 'diagram', title: '컨트롤 클래스 계층', html: SVG_TREE, caption: 'Control → ContentControl / ItemsControl / RangeBase',
            notes: '<p><b>[2분]</b> 세 상자의 둘째 줄(Content · Items · Value)만 기억하게 합니다. TextBlock 은 Control 이 아니라 “가벼운 글자”라는 점도 짚어 주세요.</p><p>Visual Studio 의 도구 상자를 열어 실제 목록을 보여 주면 좋습니다.</p>' },
          { layout: 'two', title: 'TextBlock vs Label', left: { title: 'TextBlock', bullets: ['<code>Text</code> 에 문자열', '가벼움 · 줄 바꿈(<code>TextWrapping</code>)', '설명 · 결과 · 제목 등 <b>대부분</b>'] }, right: { title: 'Label', bullets: ['<code>Content</code> (콘텐츠 컨트롤)', '액세스 키 <code>_N</code> + <code>Target</code>', '<kbd>Alt</kbd>+<kbd>N</kbd> → 입력 칸으로 이동', '입력 칸 앞의 <b>이름표</b>'] },
            notes: '<p><b>[4분]</b> 예제 16-1 을 실행해 Alt 키를 누르면 밑줄이 보이고 Alt+N / Alt+A 로 이동하는 것을 시연합니다.</p><p>정리: “글자는 TextBlock, 입력 칸 이름표는 Label”.</p>' },
          { layout: 'code', title: 'TextBox — 글자 수 세기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideMemo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="글자 수 세기" Width="360" Height="240">
    <DockPanel Margin="10">
        <TextBlock x:Name="txtCount" DockPanel.Dock="Bottom" Margin="0,6,0,0"/>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" TextWrapping="Wrap"
                 MaxLength="100" TextChanged="txtMemo_TextChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
namespace Ch16SlideMemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtMemo.Text = "여기에 메모를 쓰세요";
        }
        private void txtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            txtCount.Text = $"글자 수: {txtMemo.Text.Length} / {txtMemo.MaxLength}";
        }
    }
}`, points: ['<code>AcceptsReturn</code> + <code>TextWrapping</code> = 여러 줄', '<code>MaxLength</code> 로 글자 수 제한', '<code>TextChanged</code>: 바뀔 때마다 실행', '처음 글자는 <b>생성자에서</b> 넣기'],
            notes: '<p><b>[6분]</b> 실행 후 글자를 입력하며 숫자가 바뀌는 것을 보여 줍니다. AcceptsReturn 을 지우고 다시 실행해 Enter 가 안 먹히는 것도 비교.</p><p><b>주의점</b>: XAML 에 <code>Text="…"</code> 를 쓰면 InitializeComponent 도중 TextChanged 가 불려 txtCount 가 null 일 수 있다 → 생성자에서 넣거나 null 가드.</p>' },
          { layout: 'code', title: 'PasswordBox · IsDefault · IsCancel', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideLogin.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="로그인" Width="320" Height="210">
    <StackPanel Margin="12">
        <TextBox x:Name="txtId" Text="admin" Margin="0,3"/>
        <PasswordBox x:Name="pwdBox" Margin="0,3"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,8">
            <Button Content="로그인" IsDefault="True" Width="70" Click="btnLogin_Click"/>
            <Button Content="취소" IsCancel="True" Width="70" Margin="6,0,0,0" Click="btnCancel_Click"/>
        </StackPanel>
        <TextBlock x:Name="txtMsg"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch16SlideLogin
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); txtMsg.Text = "Enter=로그인, Esc=취소"; }
        private void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            bool ok = txtId.Text == "admin" && pwdBox.Password == "1234";
            txtMsg.Text = ok ? "환영합니다!" : "아이디 또는 비밀번호 오류";
        }
        private void btnCancel_Click(object sender, RoutedEventArgs e) { Close(); }
    }
}`, points: ['비밀번호는 <code>Password</code> 로 읽기 (Text 없음)', '<code>IsDefault</code>: <kbd>Enter</kbd> 로 눌림', '<code>IsCancel</code>: <kbd>Esc</kbd> 로 눌림', 'Content 에 StackPanel → 아이콘 버튼 (예제 16-3)'],
            notes: '<p><b>[6분]</b> 비밀번호 1234 입력 후 Enter 로 로그인되는 것을 시연. 대화 상자형 창에서는 IsDefault/IsCancel 을 꼭 넣는 것이 사용자 배려라고 설명합니다.</p><p>발문: “왜 PasswordBox 에는 Text 속성이 없을까?” → 보안.</p>' },
          { layout: 'table', title: 'CheckBox · RadioButton · ToggleButton', head: ['컨트롤', '고르는 방식', 'IsChecked', '쓰임'], rows: [['CheckBox', '여러 개', 'true / false / (null)', '토핑, 약관 동의'], ['RadioButton', '그룹에서 하나', 'true / false', '크기 S·M·L'], ['ToggleButton', '버튼이 켜짐 유지', 'true / false', '굵게, 음소거']], lead: '셋 다 IsChecked(bool?) + Checked / Unchecked 이벤트',
            notes: '<p><b>[4분]</b> 공통점(IsChecked, Checked/Unchecked)부터 말하고 차이는 “몇 개를 고르나”로 정리합니다.</p><p><code>bool?</code> 이므로 <code>== true</code> 로 비교해야 한다는 점, RadioButton 그룹은 같은 부모 또는 GroupName 이라는 점을 강조.</p>' },
          { layout: 'code', title: '피자 주문 — 매번 전부 다시 계산', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlidePizza.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="피자 주문" Width="320" Height="240">
    <StackPanel Margin="12">
        <RadioButton x:Name="rdoM" GroupName="Size" Content="M 15,000원" IsChecked="True" Checked="Option_Changed"/>
        <RadioButton x:Name="rdoL" GroupName="Size" Content="L 18,000원" Checked="Option_Changed"/>
        <CheckBox x:Name="chkCheese" Content="치즈 +2,000원" Margin="0,8,0,0" Checked="Option_Changed" Unchecked="Option_Changed"/>
        <CheckBox x:Name="chkBacon" Content="베이컨 +3,000원" Checked="Option_Changed" Unchecked="Option_Changed"/>
        <TextBlock x:Name="txtTotal" FontSize="16" FontWeight="Bold" Margin="0,10"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch16SlidePizza
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); UpdatePrice(); }
        private void Option_Changed(object sender, RoutedEventArgs e) { if (txtTotal != null) UpdatePrice(); }
        private void UpdatePrice()
        {
            int price = rdoL.IsChecked == true ? 18000 : 15000;
            if (chkCheese.IsChecked == true) price += 2000;
            if (chkBacon.IsChecked == true) price += 3000;
            txtTotal.Text = $"합계 {price:N0}원";
        }
    }
}`, points: ['이벤트 6개 → 처리기 <b>하나</b>', '<code>txtTotal != null</code> 가드 (초기화 중 Checked)', '<code>== true</code> 로 bool? 비교', '<code>{price:N0}</code> 천 단위 쉼표'],
            notes: '<p><b>[7분]</b> 가드를 지우고 실행하면 어떻게 될지 먼저 물어봅니다. rdoM 의 IsChecked="True" 때문에 InitializeComponent 도중 Checked 가 불리고, 그때 txtTotal 은 아직 null → NullReferenceException.</p><p>예제 16-4 의 전체 버전(S/M/L + 토핑 3개), 16-5 의 전체 선택(IsThreeState)을 이어서 보여 주세요.</p>' },
          { layout: 'diagram', title: '콘텐츠 모델', html: SVG_CONTENT, caption: 'Content 는 object — 문자열이면 글자, 요소면 그대로, 단 하나만',
            notes: '<p><b>[4분]</b> 예제 16-6 을 실행해 ④ 버튼을 눌러 Content 형식이 String ↔ TextBlock 으로 바뀌는 것을 보여 줍니다.</p><p>“여러 개를 넣고 싶으면?” → 패널(StackPanel)로 묶기. 15장의 패널 지식이 여기서 쓰입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '창 어디서든 <kbd>Enter</kbd> 를 누르면 눌리는 “기본 버튼”을 만드는 속성은?', options: ['<code>IsCancel="True"</code>', '<code>IsEnabled="True"</code>', '<code>IsChecked="True"</code>', '<code>IsDefault="True"</code>'], answer: 3, explain: '<code>IsDefault</code> 는 Enter, <code>IsCancel</code> 은 Esc 에 반응합니다.',
            notes: '<p>답을 공개한 뒤 IsCancel 도 함께 복습합니다. 로그인 · 저장 대화 상자에서 필수.</p>' },
          { layout: 'practice', title: '실습 16-1. 게시글 작성기', desc: '<p>최대 100자 TextBox — 입력할 때마다 <code>남은 글자: n</code> 표시(10 이하 빨강), 비어 있으면 게시 버튼 끄기, 게시하면 아래에 <code>게시됨: 내용</code> 표시 후 입력 칸 비우기.</p>', starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="게시글 작성" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBox x:Name="txtPost" Height="110" AcceptsReturn="True" TextWrapping="Wrap" MaxLength="100"
                 TextChanged="txtPost_TextChanged"/>
        <DockPanel Margin="0,6">
            <Button x:Name="btnPost" Content="게시" Width="70" DockPanel.Dock="Right" IsEnabled="False" Click="btnPost_Click"/>
            <TextBlock x:Name="txtRemain" Text="남은 글자: 100" Foreground="Gray"/>
        </DockPanel>
        <TextBlock x:Name="txtLast" Margin="0,10" TextWrapping="Wrap"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16Practice1
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }

        private void txtPost_TextChanged(object sender, TextChangedEventArgs e)
        {
            // TODO
        }

        private void btnPost_Click(object sender, RoutedEventArgs e)
        {
            // TODO
        }
    }
}`, solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="게시글 작성" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBox x:Name="txtPost" Height="110" AcceptsReturn="True" TextWrapping="Wrap" MaxLength="100"
                 TextChanged="txtPost_TextChanged"/>
        <DockPanel Margin="0,6">
            <Button x:Name="btnPost" Content="게시" Width="70" DockPanel.Dock="Right" IsEnabled="False" Click="btnPost_Click"/>
            <TextBlock x:Name="txtRemain" Text="남은 글자: 100" Foreground="Gray"/>
        </DockPanel>
        <TextBlock x:Name="txtLast" Margin="0,10" TextWrapping="Wrap"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch16Practice1
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }

        private void txtPost_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (btnPost == null || txtRemain == null) return;
            int remain = txtPost.MaxLength - txtPost.Text.Length;
            txtRemain.Text = $"남은 글자: {remain}";
            txtRemain.Foreground = remain <= 10 ? Brushes.Red : Brushes.Gray;
            btnPost.IsEnabled = txtPost.Text.Trim().Length > 0;
        }

        private void btnPost_Click(object sender, RoutedEventArgs e)
        {
            txtLast.Text = "게시됨: " + txtPost.Text;
            txtPost.Clear();
        }
    }
}`,
            notes: '<p><b>[7분]</b> 먼저 TextChanged 만 완성하게 하고, 빨리 끝난 학생은 게시 버튼 → 실습 16-2(회원 가입)로 넘어갑니다.</p><p>자주 하는 실수: 가드 없이 btnPost 를 써서 NullReferenceException, <code>Text.Length == 0</code> 만 검사해 공백 게시 허용.</p>' },
          { layout: 'summary', title: '정리', bullets: ['컨트롤 3부류: <b>Content</b> · <b>Items</b> · <b>Value</b>', 'TextBlock(글자) vs Label(이름표 · 액세스 키)', 'TextBox: Text · MaxLength · AcceptsReturn · TextChanged', 'PasswordBox.Password · Button 의 IsDefault / IsCancel', 'CheckBox(여러 개) · RadioButton(하나, GroupName) · <code>IsChecked == true</code>', 'Content 에는 문자열도 요소도 — 단 하나'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 목록(ComboBox · ListBox) · 범위(Slider · ProgressBar) · 날짜 · 화면 묶기 컨트롤.</p>' }
        ]
      },

      /* ===================== ch16-2 ===================== */
      {
        id: 'ch16-2',
        title: '목록 · 범위 · 기타 컨트롤',
        minutes: 50,
        goals: [
          'ComboBox 의 SelectedIndex · SelectedItem · SelectionChanged 와 IsEditable 을 사용할 수 있다',
          'ListBox 에 항목을 추가 · 삭제하고, SelectionMode="Multiple" 과 SelectedItems 로 여러 항목을 읽을 수 있다',
          'Items 에 직접 넣는 방식과 ItemsSource(ObservableCollection)로 연결하는 방식을 구분할 수 있다',
          'Slider 의 Minimum · Maximum · Value · ValueChanged 로 값을 입력받고, ProgressBar 로 진행률을 표시할 수 있다',
          'DatePicker 로 날짜를 입력받고, GroupBox · Expander · TabControl · ToolTip 으로 화면을 정리할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['ComboBox', 8], ['ListBox · Items vs ItemsSource', 14], ['Slider · ProgressBar · DatePicker', 12], ['GroupBox · Expander · TabControl · ToolTip', 6], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: 'ComboBox — 펼쳐서 하나 고르기' },
          { type: 'p', html: '<b>ComboBox</b> 는 눌렀을 때 목록이 펼쳐지고 그중 <b>하나</b>를 고르는 항목 컨트롤입니다. 좁은 공간에 선택지를 많이 넣을 때 씁니다. 항목은 XAML 에 <code>&lt;ComboBoxItem Content="서울"/&gt;</code> 으로 적거나, 코드에서 <code>cbo.Items.Add("서울")</code> 로 넣습니다.' },
          { type: 'table', head: ['속성 · 이벤트', '의미'], rows: [
            ['<code>Items</code>', '항목 목록 (<code>Add</code>, <code>Remove</code>, <code>Clear</code>, <code>Count</code>)'],
            ['<code>SelectedIndex</code>', '선택된 항목의 번호 (0부터, <b>선택 없음 = -1</b>)'],
            ['<code>SelectedItem</code>', '선택된 항목 객체 (XAML 의 ComboBoxItem 이면 <code>ComboBoxItem</code>, Add 한 문자열이면 <code>string</code>)'],
            ['<code>SelectionChanged</code>', '선택이 바뀔 때 발생 — <code>(object sender, SelectionChangedEventArgs e)</code>'],
            ['<code>IsEditable</code>', '<code>True</code> 면 목록에 없는 값도 직접 입력 가능. 입력된 글자는 <code>Text</code> 로 읽음']
          ] },
          { type: 'code', title: '예제 16-7. ComboBox — 도시 고르기와 직접 입력(IsEditable)', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ComboBox.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ComboBox" Width="440" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="여행할 도시를 고르세요" FontWeight="Bold"/>
        <ComboBox x:Name="cboCity" Margin="0,5" SelectionChanged="cboCity_SelectionChanged">
            <ComboBoxItem Content="서울"/>
            <ComboBoxItem Content="부산"/>
            <ComboBoxItem Content="제주"/>
            <ComboBoxItem Content="강릉"/>
        </ComboBox>
        <TextBlock x:Name="txtCity" Margin="0,5,0,20" TextWrapping="Wrap" Foreground="SteelBlue"/>
        <TextBlock Text="이메일 (도메인은 고르거나 직접 입력)" FontWeight="Bold"/>
        <StackPanel Orientation="Horizontal" Margin="0,5">
            <TextBox x:Name="txtUser" Width="110" Text="hong"/>
            <TextBlock Text=" @ " VerticalAlignment="Center"/>
            <ComboBox x:Name="cboDomain" Width="150" IsEditable="True"/>
            <Button Content="확인" Margin="8,0,0,0" Padding="8,0" Click="btnEmail_Click"/>
        </StackPanel>
        <TextBlock x:Name="txtEmail" Margin="0,5"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch16ComboBox
{
    public partial class MainWindow : Window
    {
        private readonly string[] info =
        {
            "경복궁, 남산타워, 한강 공원",
            "해운대, 광안대교, 자갈치 시장",
            "한라산, 성산일출봉, 올레길",
            "경포대, 안목 커피 거리, 정동진"
        };

        public MainWindow()
        {
            InitializeComponent();
            // 코드로 항목 넣기 (문자열 항목)
            cboDomain.Items.Add("naver.com");
            cboDomain.Items.Add("gmail.com");
            cboDomain.Items.Add("daum.net");
            cboDomain.SelectedIndex = 1;

            cboCity.SelectedIndex = 0;   // SelectionChanged 가 발생해 txtCity 가 채워짐
        }

        private void cboCity_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (txtCity == null) return;
            if (cboCity.SelectedItem is ComboBoxItem item)   // XAML 항목은 ComboBoxItem
            {
                txtCity.Text = $"{cboCity.SelectedIndex}번 [{item.Content}] 추천 장소: {info[cboCity.SelectedIndex]}";
            }
        }

        private void btnEmail_Click(object sender, RoutedEventArgs e)
        {
            // IsEditable 콤보 상자는 Text 로 '고른 값 또는 직접 입력한 값'을 읽습니다
            txtEmail.Text = $"완성된 주소: {txtUser.Text}@{cboDomain.Text}";
        }
    }
}`, desc: '위쪽 콤보 상자에서 도시를 바꾸면 추천 장소가 바뀝니다. 아래쪽은 <code>IsEditable="True"</code> 라서 목록에서 고르거나 <code>korea.kr</code> 처럼 직접 입력할 수 있습니다. 처음 선택은 XAML 이 아니라 <b>생성자에서</b> <code>SelectedIndex = 0</code> 으로 정해, SelectionChanged 가 모든 컨트롤이 준비된 뒤 실행되게 했습니다.' },
          { type: 'callout', kind: 'warn', title: 'SelectedItem 의 정체를 확인하세요', html: 'XAML 에 <code>&lt;ComboBoxItem Content="서울"/&gt;</code> 로 넣으면 <code>SelectedItem</code> 은 문자열이 아니라 <b>ComboBoxItem 객체</b>입니다. 그래서 <code>SelectedItem.ToString()</code> 은 <code>"System.Windows.Controls.ComboBoxItem: 서울"</code> 처럼 나옵니다. 글자가 필요하면 <code>((ComboBoxItem)cbo.SelectedItem).Content</code> 또는 위 예제처럼 <code>is ComboBoxItem item</code> 패턴을 씁니다. 반대로 코드에서 <code>Items.Add("naver.com")</code> 한 항목은 SelectedItem 이 곧 문자열입니다.' },

          { type: 'h', text: 'ListBox — 목록 보여 주기, 추가 · 삭제' },
          { type: 'p', html: '<b>ListBox</b> 는 항목을 <b>펼친 상태로</b> 여러 줄 보여 줍니다. ComboBox 와 같은 <code>Selector</code> 계열이라 <code>Items</code> · <code>SelectedIndex</code> · <code>SelectedItem</code> · <code>SelectionChanged</code> 를 똑같이 씁니다. 항목 추가는 <code>Items.Add</code>, 삭제는 <code>Items.RemoveAt(번호)</code> 또는 <code>Items.Remove(항목)</code>, 전체 삭제는 <code>Items.Clear()</code> 입니다.' },
          { type: 'code', title: '예제 16-8. ListBox — 이름 추가 · 삭제', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ListBoxItems.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ListBox — 추가 · 삭제" Width="420" Height="340">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button Content="추가" DockPanel.Dock="Right" Width="70" Margin="6,0,0,0" IsDefault="True" Click="btnAdd_Click"/>
            <TextBox x:Name="txtName"/>
        </DockPanel>
        <StackPanel DockPanel.Dock="Right" Width="90" Margin="8,0,0,0">
            <Button Content="선택 삭제" Margin="0,0,0,6" Click="btnRemove_Click"/>
            <Button Content="모두 지우기" Click="btnClear_Click"/>
        </StackPanel>
        <TextBlock x:Name="txtStatus" DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray"/>
        <ListBox x:Name="lstNames" SelectionChanged="lstNames_SelectionChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch16ListBoxItems
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstNames.Items.Add("김민준");
            lstNames.Items.Add("이서연");
            lstNames.Items.Add("박도윤");
            UpdateStatus();
        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            string name = txtName.Text.Trim();
            if (name == "") return;                             // 빈 이름은 추가하지 않음
            lstNames.Items.Add(name);
            lstNames.SelectedIndex = lstNames.Items.Count - 1;  // 방금 추가한 항목 선택
            txtName.Clear();
            txtName.Focus();
            UpdateStatus();
        }

        private void btnRemove_Click(object sender, RoutedEventArgs e)
        {
            if (lstNames.SelectedIndex < 0)
            {
                MessageBox.Show("삭제할 항목을 먼저 선택하세요.");
                return;
            }
            lstNames.Items.RemoveAt(lstNames.SelectedIndex);
            UpdateStatus();
        }

        private void btnClear_Click(object sender, RoutedEventArgs e)
        {
            lstNames.Items.Clear();
            UpdateStatus();
        }

        private void lstNames_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateStatus();
        }

        private void UpdateStatus()
        {
            if (txtStatus == null) return;
            string selected = lstNames.SelectedItem?.ToString() ?? "없음";
            txtStatus.Text = $"전체 {lstNames.Items.Count}명 · 선택: {selected} (SelectedIndex = {lstNames.SelectedIndex})";
        }
    }
}`, desc: '이름을 입력하고 <kbd>Enter</kbd>(추가 버튼이 <code>IsDefault</code>)를 누르면 목록 끝에 추가되고 선택됩니다. 항목을 클릭해 <code>SelectedIndex</code> 가 바뀌는 것을 아래 상태 줄에서 확인하세요. 선택 없이 삭제를 누르면 안내 메시지를 띄워 <code>RemoveAt(-1)</code> 예외를 막습니다.' },

          { type: 'h', text: 'Items 와 ItemsSource — 데이터를 따로 두기' },
          { type: 'p', html: '지금까지는 컨트롤의 <code>Items</code> 에 항목을 직접 넣었습니다. 항목이 적고 고정된 목록이라면 이것으로 충분합니다. 하지만 같은 데이터를 여러 컨트롤이 함께 쓰거나, 데이터를 코드에서 계산 · 저장해야 한다면 <b>데이터 컬렉션을 따로 만들고</b> 컨트롤의 <b><code>ItemsSource</code></b> 에 연결하는 편이 좋습니다. 이때 컬렉션으로 <b><code>ObservableCollection&lt;T&gt;</code></b> 를 쓰면, 항목을 <code>Add</code> · <code>Remove</code> 할 때 컬렉션이 “바뀌었다”고 알려 주어 <b>화면이 자동으로 갱신</b>됩니다.' },
          { type: 'figure', html: SVG_ITEMS, caption: 'Items 는 컨트롤이 항목을 직접 보관, ItemsSource 는 바깥 데이터 컬렉션을 연결' },
          { type: 'table', head: ['', 'Items 에 직접', 'ItemsSource 로 연결'], rows: [
            ['항목이 있는 곳', '컨트롤 안 (<code>lst.Items</code>)', '코드의 컬렉션 (<code>subjects</code>)'],
            ['추가 · 삭제', '<code>lst.Items.Add(…)</code>', '<code>subjects.Add(…)</code> (Items.Add 는 <b>예외</b>)'],
            ['여러 컨트롤이 공유', '어려움', '같은 컬렉션을 여러 곳에 연결'],
            ['어울리는 경우', '고정된 짧은 목록, XAML 에 바로 적을 때', '데이터가 바뀌는 목록, 뒤에 배울 데이터 바인딩 · MVVM']
          ] },
          { type: 'p', html: '<code>SelectionMode="Multiple"</code> 로 하면 ListBox 에서 클릭할 때마다 항목이 선택/해제되어 <b>여러 개</b>를 고를 수 있고, 고른 항목들은 <b><code>SelectedItems</code></b>(목록)로 읽습니다. (<code>Extended</code> 는 <kbd>Ctrl</kbd>·<kbd>Shift</kbd> 를 누른 채 클릭해 여러 개 선택)' },
          { type: 'code', title: '예제 16-9. ItemsSource 와 여러 개 선택(SelectedItems)', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ItemsSource.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ItemsSource 와 여러 개 선택" Width="460" Height="340">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition Width="150"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <TextBlock Text="수강할 과목 (클릭해서 여러 개 선택)" FontWeight="Bold" Margin="0,0,0,5"/>
        <ListBox x:Name="lstSubjects" Grid.Row="1" SelectionMode="Multiple"/>
        <StackPanel Grid.Row="1" Grid.Column="1" Margin="10,0,0,0">
            <Button Content="선택 확인" Margin="0,0,0,6" Click="btnShow_Click"/>
            <Button Content="선택 과목 삭제" Margin="0,0,0,6" Click="btnRemove_Click"/>
            <Button Content="과목 추가" Click="btnAdd_Click"/>
            <TextBlock Text="대표 과목 (같은 데이터)" Margin="0,14,0,3"/>
            <ComboBox x:Name="cboMain"/>
        </StackPanel>
        <TextBlock x:Name="txtResult" Grid.Row="2" Grid.ColumnSpan="2" Margin="0,8,0,0" TextWrapping="Wrap"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;

namespace Ch16ItemsSource
{
    public partial class MainWindow : Window
    {
        // 데이터(컬렉션)를 따로 만들고, 컨트롤에는 ItemsSource 로 '연결'만 합니다
        private readonly ObservableCollection<string> subjects = new ObservableCollection<string>
        {
            "국어", "영어", "수학", "과학", "정보"
        };
        private int added = 0;

        public MainWindow()
        {
            InitializeComponent();
            lstSubjects.ItemsSource = subjects;
            cboMain.ItemsSource = subjects;      // 같은 컬렉션을 두 컨트롤이 함께 사용
            cboMain.SelectedIndex = 0;
            txtResult.Text = $"과목 {subjects.Count}개 — 여러 개를 클릭한 뒤 버튼을 눌러 보세요.";
        }

        private void btnShow_Click(object sender, RoutedEventArgs e)
        {
            var picked = lstSubjects.SelectedItems.Cast<string>().ToList();
            txtResult.Text = picked.Count == 0
                ? "선택한 과목이 없습니다."
                : $"선택 {picked.Count}개: {string.Join(", ", picked)}";
        }

        private void btnRemove_Click(object sender, RoutedEventArgs e)
        {
            // SelectedItems 를 그대로 돌면서 지우면 목록이 바뀌어 오류 → 먼저 복사본(ToList)을 만든다
            var picked = lstSubjects.SelectedItems.Cast<string>().ToList();
            foreach (string s in picked)
            {
                subjects.Remove(s);              // 컬렉션에서 지우면 ListBox · ComboBox 가 함께 바뀜
            }
            lstSubjects.UnselectAll();
            txtResult.Text = $"{picked.Count}개 삭제 → 남은 과목 {subjects.Count}개";
        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            added++;
            subjects.Add($"새 과목 {added}");    // lstSubjects.Items.Add(…) 는 예외! 컬렉션에 추가합니다
            txtResult.Text = $"추가 → 과목 {subjects.Count}개 (오른쪽 콤보 상자에도 생겼는지 확인)";
        }
    }
}`, desc: '과목을 여러 개 클릭한 뒤 <b>선택 확인</b> · <b>선택 과목 삭제</b>를 눌러 보세요. <b>과목 추가</b>를 누르면 ListBox 와 ComboBox 에 <b>동시에</b> 새 과목이 생깁니다. 코드는 컨트롤이 아니라 <code>subjects</code> 컬렉션만 고쳤다는 점이 핵심입니다. <code>Cast&lt;string&gt;()</code> 과 <code>ToList()</code> 는 LINQ(11장) 메서드입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — List<T> 를 연결하면?', html: '<code>ItemsSource</code> 에 평범한 <code>List&lt;string&gt;</code> 을 연결해도 처음 화면은 잘 나옵니다. 하지만 List 는 “바뀌었다”는 알림(<code>INotifyCollectionChanged</code>)을 보내지 않아서, 나중에 <code>Add</code> 해도 <b>화면이 바뀌지 않습니다</b>. 항목이 바뀌는 목록에는 <code>ObservableCollection&lt;T&gt;</code> 를 쓰세요. (<code>using System.Collections.ObjectModel;</code>)' },

          { type: 'h', text: '범위 컨트롤 — Slider 와 ProgressBar' },
          { type: 'p', html: '<b>Slider</b> 는 막대 위의 손잡이(thumb)를 끌어 <b>범위 안의 숫자</b>를 고르는 컨트롤이고, <b>ProgressBar</b> 는 작업이 얼마나 진행됐는지 막대로 <b>보여 주기만</b> 하는 컨트롤입니다. 둘 다 <code>RangeBase</code> 를 상속해 <code>Minimum</code> · <code>Maximum</code> · <code>Value</code>(모두 <code>double</code>)를 똑같이 씁니다.' },
          { type: 'figure', html: SVG_RANGE, caption: 'Minimum ~ Maximum 사이의 Value. Slider 는 사용자가, ProgressBar 는 코드가 값을 바꾼다' },
          { type: 'table', head: ['속성 · 이벤트', '의미'], rows: [
            ['<code>Minimum</code> / <code>Maximum</code>', '가장 작은 값 / 가장 큰 값 (Slider 기본 0 ~ 10, ProgressBar 기본 0 ~ 100)'],
            ['<code>Value</code>', '현재 값 (<code>double</code>)'],
            ['<code>TickFrequency</code> · <code>TickPlacement</code>', '눈금 간격 · 눈금 표시 위치 (<code>BottomRight</code> 등)'],
            ['<code>IsSnapToTickEnabled</code>', '<code>True</code> 면 눈금 위에만 멈춤 → <code>TickFrequency="1"</code> 과 함께 쓰면 <b>정수만</b>'],
            ['<code>ValueChanged</code>', '값이 바뀔 때 — <code>(object sender, RoutedPropertyChangedEventArgs&lt;double&gt; e)</code>, <code>e.OldValue</code> · <code>e.NewValue</code>'],
            ['<code>IsIndeterminate</code> (ProgressBar)', '<code>True</code> 면 진행률 대신 막대가 계속 흘러감 (얼마나 걸릴지 모를 때)']
          ] },
          { type: 'code', title: '예제 16-10. RGB 슬라이더 3개로 색 섞기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16ColorSlider.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="RGB 색 섞기" Width="480" Height="260">
    <Grid Margin="15">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="25"/>
            <ColumnDefinition/>
            <ColumnDefinition Width="40"/>
            <ColumnDefinition Width="140"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <TextBlock Text="R" Foreground="Red" FontWeight="Bold" VerticalAlignment="Center"/>
        <Slider x:Name="sldR" Grid.Column="1" Minimum="0" Maximum="255" Value="255" Margin="0,8"
                TickFrequency="1" IsSnapToTickEnabled="True" ValueChanged="Rgb_ValueChanged"/>
        <TextBlock x:Name="txtR" Grid.Column="2" VerticalAlignment="Center" TextAlignment="Right"/>
        <TextBlock Text="G" Grid.Row="1" Foreground="Green" FontWeight="Bold" VerticalAlignment="Center"/>
        <Slider x:Name="sldG" Grid.Row="1" Grid.Column="1" Minimum="0" Maximum="255" Value="160" Margin="0,8"
                TickFrequency="1" IsSnapToTickEnabled="True" ValueChanged="Rgb_ValueChanged"/>
        <TextBlock x:Name="txtG" Grid.Row="1" Grid.Column="2" VerticalAlignment="Center" TextAlignment="Right"/>
        <TextBlock Text="B" Grid.Row="2" Foreground="Blue" FontWeight="Bold" VerticalAlignment="Center"/>
        <Slider x:Name="sldB" Grid.Row="2" Grid.Column="1" Minimum="0" Maximum="255" Value="0" Margin="0,8"
                TickFrequency="1" IsSnapToTickEnabled="True" ValueChanged="Rgb_ValueChanged"/>
        <TextBlock x:Name="txtB" Grid.Row="2" Grid.Column="2" VerticalAlignment="Center" TextAlignment="Right"/>
        <TextBlock x:Name="txtHex" Grid.Row="3" Grid.ColumnSpan="3" FontSize="22" FontWeight="Bold"
                   VerticalAlignment="Center" HorizontalAlignment="Center"/>
        <!-- 가드에 쓰려고 Border 를 XAML 의 '마지막'에 둡니다 (위치는 Grid.Column 으로 정함) -->
        <Border x:Name="bdrColor" Grid.Column="3" Grid.RowSpan="4" Margin="12,0,0,0"
                CornerRadius="8" BorderBrush="Gray" BorderThickness="1"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch16ColorSlider
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            UpdateColor();          // 첫 화면부터 색이 보이게
        }

        // 슬라이더 3개가 이 처리기 하나를 함께 씁니다
        private void Rgb_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (bdrColor == null) return;   // InitializeComponent 도중(아직 Border 없음)에는 무시
            UpdateColor();
        }

        private void UpdateColor()
        {
            byte r = (byte)sldR.Value;      // double → byte (0~255)
            byte g = (byte)sldG.Value;
            byte b = (byte)sldB.Value;
            txtR.Text = r.ToString();
            txtG.Text = g.ToString();
            txtB.Text = b.ToString();
            bdrColor.Background = new SolidColorBrush(Color.FromRgb(r, g, b));
            txtHex.Text = $"#{r:X2}{g:X2}{b:X2}";   // X2 = 두 자리 16진수
        }
    }
}`, desc: '슬라이더를 끌면 오른쪽 상자의 색과 16진수 색 코드(<code>#FFA000</code>)가 함께 바뀝니다. <code>IsSnapToTickEnabled</code> + <code>TickFrequency="1"</code> 이라 값이 정수로만 움직입니다. 슬라이더에 포커스를 두고 방향키를 눌러도 1씩 움직입니다. 색은 <code>Color.FromRgb</code> 로 만들고 <code>SolidColorBrush</code> 에 담아 <code>Background</code> 에 넣습니다.' },

          { type: 'h', text: 'DatePicker 와 ProgressBar — 방학 진행률' },
          { type: 'p', html: '<b>DatePicker</b> 는 달력을 펼쳐 날짜를 고르는 컨트롤입니다. 고른 날짜는 <b><code>SelectedDate</code></b> 에 들어 있는데, 형식이 <code>DateTime?</code> 입니다(아직 안 골랐으면 <code>null</code>). 날짜가 바뀌면 <b>SelectedDateChanged</b> 이벤트가 발생합니다. 두 날짜를 빼면 <code>TimeSpan</code> 이 되고 <code>TotalDays</code> 로 날수를 얻을 수 있습니다.' },
          { type: 'code', title: '예제 16-11. DatePicker 로 기간을 고르고 ProgressBar 로 진행률 표시', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16DateProgress.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="방학 진행률" Width="420" Height="330">
    <StackPanel Margin="15">
        <Grid>
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="90"/>
                <ColumnDefinition/>
            </Grid.ColumnDefinitions>
            <Grid.RowDefinitions>
                <RowDefinition/>
                <RowDefinition/>
                <RowDefinition/>
            </Grid.RowDefinitions>
            <TextBlock Text="방학 시작" VerticalAlignment="Center"/>
            <DatePicker x:Name="dpStart" Grid.Column="1" Margin="0,3" SelectedDateChanged="Date_Changed"/>
            <TextBlock Text="방학 끝" Grid.Row="1" VerticalAlignment="Center"/>
            <DatePicker x:Name="dpEnd" Grid.Row="1" Grid.Column="1" Margin="0,3" SelectedDateChanged="Date_Changed"/>
            <TextBlock Text="오늘" Grid.Row="2" VerticalAlignment="Center"/>
            <DatePicker x:Name="dpToday" Grid.Row="2" Grid.Column="1" Margin="0,3" SelectedDateChanged="Date_Changed"/>
        </Grid>
        <ProgressBar x:Name="prgVacation" Height="22" Margin="0,15,0,5" Minimum="0" Maximum="100"/>
        <TextBlock x:Name="txtResult" FontSize="14" TextWrapping="Wrap"/>
        <CheckBox x:Name="chkBusy" Content="계산 중 표시 (IsIndeterminate)" Margin="0,15,0,0"
                  Checked="chkBusy_Changed" Unchecked="chkBusy_Changed"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace Ch16DateProgress
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            dpStart.SelectedDate = new DateTime(2025, 7, 21);
            dpEnd.SelectedDate = new DateTime(2025, 8, 17);
            dpToday.SelectedDate = new DateTime(2025, 8, 1);
        }

        private void Date_Changed(object sender, SelectionChangedEventArgs e)
        {
            if (txtResult == null) return;
            // SelectedDate 는 DateTime? — 하나라도 비어 있으면 계산하지 않음
            if (dpStart.SelectedDate == null || dpEnd.SelectedDate == null || dpToday.SelectedDate == null)
            {
                txtResult.Text = "날짜 세 개를 모두 고르세요.";
                return;
            }
            DateTime start = dpStart.SelectedDate.Value;
            DateTime end = dpEnd.SelectedDate.Value;
            DateTime today = dpToday.SelectedDate.Value;

            double total = (end - start).TotalDays;
            if (total <= 0)
            {
                txtResult.Text = "끝 날짜가 시작 날짜보다 뒤여야 합니다.";
                prgVacation.Value = 0;
                return;
            }
            double passed = Math.Clamp((today - start).TotalDays, 0, total);
            double percent = passed / total * 100;
            prgVacation.Value = percent;
            txtResult.Text = $"전체 {total}일 중 {passed}일 지남 → {percent:F1}% (남은 날: {total - passed}일)";
        }

        private void chkBusy_Changed(object sender, RoutedEventArgs e)
        {
            prgVacation.IsIndeterminate = chkBusy.IsChecked == true;
        }
    }
}`, desc: '첫 화면은 7월 21일 ~ 8월 17일 중 8월 1일이라 <b>27일 중 11일, 40.7%</b> 입니다. 날짜를 바꿔 막대가 움직이는 것을 확인하세요. “계산 중 표시”를 체크하면 <code>IsIndeterminate</code> 가 켜져 막대가 계속 흘러갑니다(파일 다운로드처럼 끝을 모를 때 쓰는 모양). <code>Math.Clamp(값, 최소, 최대)</code> 는 값을 범위 안으로 잘라 줍니다.' },
          { type: 'callout', kind: 'tip', title: 'DateTime? 다루기', html: '<code>SelectedDate</code> 처럼 <code>?</code> 가 붙은 형식은 <b>값이 없을 수 있다</b>는 뜻입니다. <code>== null</code> (또는 <code>.HasValue</code>)로 먼저 확인한 뒤 <code>.Value</code> 로 실제 <code>DateTime</code> 을 꺼냅니다. 확인 없이 <code>.Value</code> 를 쓰면 날짜가 비었을 때 <code>InvalidOperationException</code> 이 납니다.' },

          { type: 'h', text: '화면 묶기 — GroupBox · Expander · TabControl · ToolTip' },
          { type: 'p', html: '컨트롤이 많아지면 관련 있는 것끼리 <b>묶어서</b> 보여 줘야 화면이 읽기 쉬워집니다. WPF 는 이를 위한 컨트롤을 제공합니다. <b>GroupBox</b> 와 <b>Expander</b> 는 제목(<code>Header</code>)이 있는 콘텐츠 컨트롤이고, <b>TabControl</b> 은 <code>TabItem</code> 들을 항목으로 가지는 항목 컨트롤입니다.' },
          { type: 'table', head: ['컨트롤', '모양 · 동작', '핵심 속성'], rows: [
            ['<b>GroupBox</b>', '테두리 + 제목으로 영역을 묶음', '<code>Header</code>, <code>Content</code>'],
            ['<b>Expander</b>', '제목을 누르면 내용이 접히고 펼쳐짐 (고급 설정 숨기기)', '<code>Header</code>, <code>IsExpanded</code>, <code>Expanded</code>/<code>Collapsed</code> 이벤트'],
            ['<b>TabControl</b>', '탭 머리글을 눌러 페이지 전환', '<code>TabItem</code> 의 <code>Header</code>, <code>SelectedIndex</code>'],
            ['<b>ToolTip</b>', '마우스를 올리면 작은 설명 풍선', '모든 요소의 <code>ToolTip="설명"</code> 속성']
          ] },
          { type: 'code', title: '예제 16-12. 환경 설정 창 — GroupBox · Expander · TabControl · ToolTip', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Settings.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="환경 설정" Width="440" Height="400">
    <DockPanel Margin="10">
        <Button DockPanel.Dock="Bottom" Content="적용" Width="80" HorizontalAlignment="Right" Margin="0,8,0,0"
                IsDefault="True" ToolTip="현재 설정을 아래 줄에 요약합니다" Click="btnApply_Click"/>
        <TextBlock x:Name="txtSummary" DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="SteelBlue" TextWrapping="Wrap"/>
        <TabControl x:Name="tabMain">
            <TabItem Header="일반">
                <StackPanel Margin="10">
                    <GroupBox Header="시작 옵션" Padding="6">
                        <StackPanel>
                            <CheckBox x:Name="chkAutoStart" Content="윈도우 시작 시 실행" Margin="0,3"
                                      ToolTip="컴퓨터를 켜면 자동으로 실행됩니다"/>
                            <CheckBox x:Name="chkUpdate" Content="자동 업데이트 확인" Margin="0,3" IsChecked="True"/>
                        </StackPanel>
                    </GroupBox>
                    <GroupBox Header="언어" Padding="6" Margin="0,8,0,0">
                        <ComboBox x:Name="cboLang" ToolTip="화면에 표시할 언어">
                            <ComboBoxItem Content="한국어"/>
                            <ComboBoxItem Content="English"/>
                            <ComboBoxItem Content="日本語"/>
                        </ComboBox>
                    </GroupBox>
                </StackPanel>
            </TabItem>
            <TabItem Header="화면">
                <StackPanel Margin="10">
                    <TextBlock Text="글자 크기 (10 ~ 24)"/>
                    <Slider x:Name="sldFont" Minimum="10" Maximum="24" Value="14" TickFrequency="2"
                            TickPlacement="BottomRight" IsSnapToTickEnabled="True" ToolTip="2 단위로 움직입니다"/>
                    <Expander Header="고급 설정" Margin="0,12,0,0">
                        <StackPanel Margin="15,5">
                            <CheckBox x:Name="chkAnim" Content="애니메이션 효과 사용" Margin="0,3"/>
                            <CheckBox x:Name="chkHw" Content="하드웨어 가속" Margin="0,3" IsChecked="True"/>
                        </StackPanel>
                    </Expander>
                </StackPanel>
            </TabItem>
            <TabItem Header="정보">
                <TextBlock Margin="10" TextWrapping="Wrap"
                           Text="기본 컨트롤 예제 v1.0 — 탭 머리글을 눌러 페이지를 바꾸고, 컨트롤에 마우스를 올려 ToolTip 을 확인해 보세요."/>
            </TabItem>
        </TabControl>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch16Settings
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            cboLang.SelectedIndex = 0;
            ShowSummary();
        }

        private void btnApply_Click(object sender, RoutedEventArgs e)
        {
            ShowSummary();
        }

        private void ShowSummary()
        {
            var lang = (cboLang.SelectedItem as ComboBoxItem)?.Content;
            string auto = chkAutoStart.IsChecked == true ? "켬" : "끔";
            string anim = chkAnim.IsChecked == true ? "켬" : "끔";
            txtSummary.Text = $"[{tabMain.SelectedIndex + 1}번 탭] 언어 {lang} · 글자 {sldFont.Value} · 자동 실행 {auto} · 애니메이션 {anim}";
        }
    }
}`, desc: '탭을 바꾸고, “화면” 탭의 <b>고급 설정</b>을 눌러 펼쳐 보세요. 설정을 바꾼 뒤 <b>적용</b>(또는 <kbd>Enter</kbd>)을 누르면 아래 줄에 요약됩니다. 보이지 않는 탭의 컨트롤도 <code>InitializeComponent()</code> 때 모두 만들어지므로 코드에서 언제든 읽을 수 있습니다. 체크 상자 · 콤보 상자 · 버튼에 마우스를 올리면 ToolTip 이 나타납니다.' },
          { type: 'callout', kind: 'vs', title: '복잡한 화면을 편하게 다루기', html: '<ul><li><b>보기 → 다른 창 → 문서 개요</b>(Document Outline)를 열면 창 안의 요소가 트리로 보여, TabItem 안쪽 깊숙한 컨트롤도 쉽게 선택할 수 있습니다.</li><li>디자이너에서 TabControl 의 탭 머리글을 클릭하면 그 탭 페이지가 디자이너에 표시됩니다.</li><li>ToolTip 은 속성 창의 <b>공용</b> 범주에 있습니다. 긴 설명은 여러 줄로 쓰기보다 짧게 한 문장으로.</li></ul>' },
          { type: 'callout', kind: 'info', title: 'Image 컨트롤', html: '그림은 <code>&lt;Image Source="Images/logo.png" Width="64"/&gt;</code> 처럼 표시합니다. Visual Studio 에서는 그림 파일을 프로젝트에 추가하고 속성 창에서 <b>빌드 작업 = 리소스(Resource)</b> 로 지정해야 실행 파일 안에 포함됩니다. <code>Stretch</code>(<code>Uniform</code> · <code>Fill</code> · <code>UniformToFill</code>)로 크기 맞춤 방식을 정합니다. 그림 파일이 필요한 예제는 뒤의 WPF 프로젝트에서 다룹니다.' }
        ],
        practice: [
          {
            title: '실습 16-3. 만족도 설문',
            level: 1,
            desc: '<p>학년(ComboBox) · 만족도(Slider 1~5) · 수강 날짜(DatePicker)를 입력받는 설문 창을 완성하세요.</p><ul><li>슬라이더를 움직이면 옆에 <code>★★★☆☆ (3점)</code> 처럼 별로 표시합니다. (슬라이더는 정수로만 움직이게)</li><li><b>제출</b>을 누르면 날짜가 비어 있을 때 <code>날짜를 고르세요.</code>, 아니면 <code>2학년 · 4점 · 2025-03-02 수강 — 제출 완료!</code> 처럼 요약을 표시합니다.</li></ul>',
            hint: '별 문자열: <code>new string(\'★\', n) + new string(\'☆\', 5 - n)</code>. 날짜 서식: <code>dpDate.SelectedDate.Value.ToString("yyyy-MM-dd")</code>. 학년 글자는 <code>(cboGrade.SelectedItem as ComboBoxItem)?.Content</code>.',
            starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice3.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="만족도 설문" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="학년"/>
        <ComboBox x:Name="cboGrade" Margin="0,2,0,10">
            <ComboBoxItem Content="1학년"/>
            <ComboBoxItem Content="2학년"/>
            <ComboBoxItem Content="3학년"/>
        </ComboBox>
        <TextBlock Text="만족도"/>
        <DockPanel Margin="0,2,0,10">
            <TextBlock x:Name="txtStars" DockPanel.Dock="Right" Width="110" Margin="8,0,0,0" FontSize="14"/>
            <!-- TODO: Minimum 1, Maximum 5, 정수로만 움직이게 속성 추가 -->
            <Slider x:Name="sldScore" ValueChanged="sldScore_ValueChanged"/>
        </DockPanel>
        <TextBlock Text="수강 날짜"/>
        <DatePicker x:Name="dpDate" Margin="0,2,0,10"/>
        <Button Content="제출" Width="80" HorizontalAlignment="Left" Click="btnSubmit_Click"/>
        <TextBlock x:Name="txtResult" Margin="0,10" TextWrapping="Wrap" FontWeight="Bold"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch16Practice3
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            cboGrade.SelectedIndex = 0;
        }

        private void sldScore_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            // TODO: 별 표시
        }

        private void btnSubmit_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 날짜 확인 후 요약 표시
        }
    }
}
`,
            solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice3.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="만족도 설문" Width="400" Height="320">
    <StackPanel Margin="15">
        <TextBlock Text="학년"/>
        <ComboBox x:Name="cboGrade" Margin="0,2,0,10">
            <ComboBoxItem Content="1학년"/>
            <ComboBoxItem Content="2학년"/>
            <ComboBoxItem Content="3학년"/>
        </ComboBox>
        <TextBlock Text="만족도"/>
        <DockPanel Margin="0,2,0,10">
            <TextBlock x:Name="txtStars" DockPanel.Dock="Right" Width="110" Margin="8,0,0,0" FontSize="14"/>
            <Slider x:Name="sldScore" Minimum="1" Maximum="5" Value="3" TickFrequency="1"
                    IsSnapToTickEnabled="True" TickPlacement="BottomRight" ValueChanged="sldScore_ValueChanged"/>
        </DockPanel>
        <TextBlock Text="수강 날짜"/>
        <DatePicker x:Name="dpDate" Margin="0,2,0,10"/>
        <Button Content="제출" Width="80" HorizontalAlignment="Left" Click="btnSubmit_Click"/>
        <TextBlock x:Name="txtResult" Margin="0,10" TextWrapping="Wrap" FontWeight="Bold"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch16Practice3
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            cboGrade.SelectedIndex = 0;
            ShowStars();
        }

        private void sldScore_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (txtStars == null) return;   // 초기화 도중에는 무시
            ShowStars();
        }

        private void ShowStars()
        {
            int n = (int)sldScore.Value;
            txtStars.Text = new string('★', n) + new string('☆', 5 - n) + $" ({n}점)";
        }

        private void btnSubmit_Click(object sender, RoutedEventArgs e)
        {
            if (dpDate.SelectedDate == null)
            {
                txtResult.Text = "날짜를 고르세요.";
                return;
            }
            var grade = (cboGrade.SelectedItem as ComboBoxItem)?.Content;
            string date = dpDate.SelectedDate.Value.ToString("yyyy-MM-dd");
            txtResult.Text = $"{grade} · {(int)sldScore.Value}점 · {date} 수강 — 제출 완료!";
        }
    }
}
`
          },
          {
            title: '실습 16-4. 할 일 목록',
            level: 2,
            desc: '<p>할 일을 추가하고, 끝낸 일은 “완료” 목록으로 옮기며, 진행률을 ProgressBar 로 보여 주는 프로그램을 완성하세요.</p><ul><li><b>추가</b>(<kbd>Enter</kbd>): 입력 칸의 글자를 “할 일” 목록에 추가하고 입력 칸을 비웁니다. 빈 글자는 무시합니다.</li><li><b>완료 →</b>: “할 일”에서 선택한 항목을 “완료” 목록으로 옮깁니다.</li><li><b>삭제</b>: “할 일” 또는 “완료”에서 선택한 항목을 지웁니다.</li><li>무엇이 바뀌든 아래에 <code>완료 2 / 5</code> 와 ProgressBar 로 진행률을 표시합니다.</li></ul>',
            hint: '옮기기: <code>object item = lstTodo.SelectedItem;</code> → <code>lstTodo.Items.Remove(item);</code> → <code>lstDone.Items.Add(item);</code>. 진행률은 <code>prgDone.Maximum = 전체 개수</code>, <code>prgDone.Value = 완료 개수</code> (전체가 0 이면 Maximum 을 1 로).',
            starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice4.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="할 일 목록" Width="480" Height="380">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button Content="추가" DockPanel.Dock="Right" Width="60" Margin="6,0,0,0" IsDefault="True" Click="btnAdd_Click"/>
            <TextBox x:Name="txtTodo"/>
        </DockPanel>
        <StackPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <TextBlock x:Name="txtProgress"/>
            <ProgressBar x:Name="prgDone" Height="16" Margin="0,4,0,0"/>
        </StackPanel>
        <Grid>
            <Grid.ColumnDefinitions>
                <ColumnDefinition/>
                <ColumnDefinition Width="80"/>
                <ColumnDefinition/>
            </Grid.ColumnDefinitions>
            <GroupBox Header="할 일">
                <ListBox x:Name="lstTodo"/>
            </GroupBox>
            <StackPanel Grid.Column="1" VerticalAlignment="Center" Margin="6,0">
                <Button Content="완료 →" Margin="0,0,0,6" Click="btnDone_Click"/>
                <Button Content="삭제" Click="btnDelete_Click"/>
            </StackPanel>
            <GroupBox Header="완료" Grid.Column="2">
                <ListBox x:Name="lstDone" Foreground="Gray"/>
            </GroupBox>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch16Practice4
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstTodo.Items.Add("영어 단어 30개 외우기");
            lstTodo.Items.Add("WPF 예제 따라 하기");
            lstTodo.Items.Add("운동 30분");
            UpdateProgress();
        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 할 일 추가
        }

        private void btnDone_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 선택한 할 일을 완료 목록으로 옮기기
        }

        private void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 선택한 항목 삭제
        }

        private void UpdateProgress()
        {
            // TODO: "완료 n / 전체" 와 ProgressBar 갱신
        }
    }
}
`,
            solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16Practice4.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="할 일 목록" Width="480" Height="380">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button Content="추가" DockPanel.Dock="Right" Width="60" Margin="6,0,0,0" IsDefault="True" Click="btnAdd_Click"/>
            <TextBox x:Name="txtTodo"/>
        </DockPanel>
        <StackPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <TextBlock x:Name="txtProgress"/>
            <ProgressBar x:Name="prgDone" Height="16" Margin="0,4,0,0"/>
        </StackPanel>
        <Grid>
            <Grid.ColumnDefinitions>
                <ColumnDefinition/>
                <ColumnDefinition Width="80"/>
                <ColumnDefinition/>
            </Grid.ColumnDefinitions>
            <GroupBox Header="할 일">
                <ListBox x:Name="lstTodo"/>
            </GroupBox>
            <StackPanel Grid.Column="1" VerticalAlignment="Center" Margin="6,0">
                <Button Content="완료 →" Margin="0,0,0,6" Click="btnDone_Click"/>
                <Button Content="삭제" Click="btnDelete_Click"/>
            </StackPanel>
            <GroupBox Header="완료" Grid.Column="2">
                <ListBox x:Name="lstDone" Foreground="Gray"/>
            </GroupBox>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch16Practice4
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstTodo.Items.Add("영어 단어 30개 외우기");
            lstTodo.Items.Add("WPF 예제 따라 하기");
            lstTodo.Items.Add("운동 30분");
            lstDone.Items.Add("숙제 제출");
            UpdateProgress();
        }

        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            string text = txtTodo.Text.Trim();
            if (text == "") return;
            lstTodo.Items.Add(text);
            txtTodo.Clear();
            txtTodo.Focus();
            UpdateProgress();
        }

        private void btnDone_Click(object sender, RoutedEventArgs e)
        {
            object item = lstTodo.SelectedItem;
            if (item == null)
            {
                MessageBox.Show("완료할 일을 먼저 선택하세요.");
                return;
            }
            lstTodo.Items.Remove(item);   // 할 일에서 빼고
            lstDone.Items.Add(item);      // 완료에 넣기
            UpdateProgress();
        }

        private void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (lstTodo.SelectedItem != null) lstTodo.Items.Remove(lstTodo.SelectedItem);
            else if (lstDone.SelectedItem != null) lstDone.Items.Remove(lstDone.SelectedItem);
            UpdateProgress();
        }

        private void UpdateProgress()
        {
            int done = lstDone.Items.Count;
            int total = done + lstTodo.Items.Count;
            prgDone.Maximum = total == 0 ? 1 : total;   // 0 으로 나누는 모양 방지
            prgDone.Value = done;
            txtProgress.Text = $"완료 {done} / {total}";
        }
    }
}
`
          }
        ],
        quiz: [
          { q: 'ComboBox 에서 아무 항목도 선택하지 않았을 때 <code>SelectedIndex</code> 의 값은?', options: ['0', '-1', 'null', '항목 개수'], answer: 1, explain: '선택 번호는 0부터 시작하고, 선택이 없으면 <b>-1</b> 입니다. 이때 <code>SelectedItem</code> 은 <code>null</code> 입니다.' },
          { q: 'ListBox 에서 여러 항목을 고르게 하고, 고른 항목들을 모두 읽으려면?', options: ['<code>IsEditable="True"</code> 와 <code>Text</code>', '<code>SelectionMode="Single"</code> 과 <code>SelectedItem</code>', '<code>IsThreeState="True"</code> 와 <code>IsChecked</code>', '<code>SelectionMode="Multiple"</code> 과 <code>SelectedItems</code>'], answer: 3, explain: '<code>Multiple</code>(클릭마다 선택/해제) 또는 <code>Extended</code>(Ctrl/Shift) 로 하고, 선택된 항목 목록은 <code>SelectedItems</code> 로 읽습니다.' },
          { q: '<code>lst.ItemsSource = subjects;</code> (subjects 는 <code>ObservableCollection&lt;string&gt;</code>) 뒤에 <code>subjects.Add("정보");</code> 를 실행하면?', options: ['ListBox 화면에 "정보"가 자동으로 나타난다', '아무 변화 없다 — lst.Items.Add 를 따로 해야 한다', 'InvalidOperationException 이 발생한다', '컴파일 오류가 난다'], answer: 0, explain: 'ObservableCollection 은 바뀔 때 알림을 보내므로 화면이 자동 갱신됩니다. 거꾸로 ItemsSource 를 쓰는 중에 <code>lst.Items.Add</code> 를 하면 예외가 납니다.' },
          { q: 'Slider 가 1, 2, 3 … 처럼 <b>정수 값에만</b> 멈추게 하려면?', options: ['<code>Maximum="1"</code>', '<code>IsIndeterminate="True"</code>', '<code>TickFrequency="1"</code> 과 <code>IsSnapToTickEnabled="True"</code>', '<code>Value="1"</code>'], answer: 2, explain: '<code>IsSnapToTickEnabled</code> 는 눈금 위에만 멈추게 하고, 눈금 간격을 <code>TickFrequency="1"</code> 로 하면 정수만 됩니다. Value 자체는 여전히 double 입니다.' },
          { q: '“고급 설정”처럼 평소에는 접어 두었다가 제목을 누르면 펼쳐지는 영역을 만드는 컨트롤은?', options: ['GroupBox', 'Expander', 'ToolTip', 'ProgressBar'], answer: 1, explain: '<b>Expander</b> 는 <code>Header</code> 를 누르면 내용이 펼쳐지고(<code>IsExpanded</code>) 접힙니다. GroupBox 는 항상 펼쳐진 테두리 묶음입니다.' }
        ],
        slides: [
          { layout: 'title', title: '목록 · 범위 · 기타 컨트롤', subtitle: 'Chapter 16 · Section 02 — 기본 컨트롤 ②', badge: '16-2',
            notes: '<p><b>[도입 3분]</b> 복습 발문: “콘텐츠 컨트롤의 핵심 속성은?” → Content. “그럼 여러 개를 보여 주는 컨트롤은?” → 항목 컨트롤(Items).</p><p>오늘 목표: ComboBox · ListBox(Items vs ItemsSource), Slider · ProgressBar · DatePicker, GroupBox · Expander · TabControl · ToolTip.</p>' },
          { layout: 'table', title: '항목 컨트롤의 공통 도구 (Selector)', head: ['속성 · 이벤트', '의미'], rows: [['<code>Items</code>', 'Add · Remove · RemoveAt · Clear · Count'], ['<code>SelectedIndex</code>', '선택 번호 (없으면 -1)'], ['<code>SelectedItem</code>', '선택된 항목 객체'], ['<code>SelectionChanged</code>', '선택이 바뀔 때'], ['<code>ItemsSource</code>', '바깥 컬렉션 연결']], lead: 'ComboBox · ListBox · TabControl 모두 같은 속성을 쓴다',
            notes: '<p><b>[3분]</b> 이 표 하나로 ComboBox 와 ListBox 를 한꺼번에 배운다고 말합니다. 차이는 모양(펼침/접힘)과 여러 개 선택 가능 여부 정도.</p>' },
          { layout: 'code', title: 'ComboBox — SelectionChanged', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideCombo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ComboBox" Width="320" Height="200">
    <StackPanel Margin="12">
        <ComboBox x:Name="cboCity" SelectionChanged="cboCity_SelectionChanged">
            <ComboBoxItem Content="서울"/>
            <ComboBoxItem Content="부산"/>
            <ComboBoxItem Content="제주"/>
        </ComboBox>
        <TextBlock x:Name="txtCity" Margin="0,10"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
namespace Ch16SlideCombo
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); cboCity.SelectedIndex = 0; }
        private void cboCity_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (txtCity == null) return;
            var item = (ComboBoxItem)cboCity.SelectedItem;
            txtCity.Text = $"{cboCity.SelectedIndex}번: {item.Content}";
        }
    }
}`, points: ['XAML 항목 → SelectedItem 은 <b>ComboBoxItem</b>', '글자는 <code>item.Content</code>', '첫 선택은 생성자에서 <code>SelectedIndex = 0</code>', '<code>IsEditable="True"</code> 면 직접 입력 → <code>Text</code>'],
            notes: '<p><b>[6분]</b> 실행 후 항목을 바꿔 봅니다. <code>item.Content</code> 대신 <code>cboCity.SelectedItem.ToString()</code> 을 출력해 “ComboBoxItem: 서울”이 나오는 것을 보여 주면 이해가 빠릅니다.</p><p>예제 16-7 의 이메일 도메인(IsEditable)도 시연하세요.</p>' },
          { layout: 'code', title: 'ListBox — 추가 · 삭제', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideList.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ListBox" Width="340" Height="260">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,6">
            <TextBox x:Name="txtItem" Width="160"/>
            <Button Content="추가" IsDefault="True" Margin="6,0" Click="btnAdd_Click"/>
            <Button Content="삭제" Click="btnDel_Click"/>
        </StackPanel>
        <ListBox x:Name="lstItems"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch16SlideList
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); lstItems.Items.Add("우유"); }
        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            if (txtItem.Text.Trim() == "") return;
            lstItems.Items.Add(txtItem.Text); txtItem.Clear();
        }
        private void btnDel_Click(object sender, RoutedEventArgs e)
        { if (lstItems.SelectedIndex >= 0) lstItems.Items.RemoveAt(lstItems.SelectedIndex); }
    }
}`, points: ['<code>Items.Add</code> 로 추가', '<code>Items.RemoveAt(SelectedIndex)</code> 로 삭제', '선택 없음(-1) 검사 필수', '<code>IsDefault</code> → <kbd>Enter</kbd> 로 추가'],
            notes: '<p><b>[5분]</b> 선택 없이 삭제를 누르면? — 검사를 지우고 실행해 ArgumentOutOfRangeException 을 확인시킨 뒤 다시 넣습니다.</p><p>빈 글자 추가 방지(Trim)도 강조.</p>' },
          { layout: 'diagram', title: 'Items vs ItemsSource', html: SVG_ITEMS, caption: '고정된 짧은 목록은 Items, 바뀌는 데이터는 ObservableCollection + ItemsSource',
            notes: '<p><b>[6분]</b> 예제 16-9 를 실행해 “과목 추가”를 누르면 ListBox 와 ComboBox 에 동시에 생기는 것을 보여 줍니다.</p><p>핵심 문장: “ItemsSource 를 쓰면 컨트롤이 아니라 <b>데이터</b>를 고친다.” 이것이 18장 데이터 바인딩 · 20장 MVVM 의 출발점입니다.</p><p>SelectionMode="Multiple" + SelectedItems, 지우기 전에 ToList() 로 복사하는 이유도 짚어 주세요.</p>' },
          { layout: 'diagram', title: '범위 컨트롤 — Slider · ProgressBar', html: SVG_RANGE, caption: 'Minimum · Maximum · Value 는 둘 다 같다',
            notes: '<p><b>[3분]</b> Slider 기본 Maximum 은 10, ProgressBar 는 100 이라는 점 주의. Value 는 double 이므로 정수가 필요하면 형 변환하거나 IsSnapToTickEnabled 를 씁니다.</p>' },
          { layout: 'code', title: 'Slider — RGB 색 섞기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideRgb.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="RGB" Width="360" Height="260">
    <StackPanel Margin="12">
        <Slider x:Name="sldR" Maximum="255" Value="255" ValueChanged="Rgb_ValueChanged"/>
        <Slider x:Name="sldG" Maximum="255" Value="160" ValueChanged="Rgb_ValueChanged"/>
        <Slider x:Name="sldB" Maximum="255" Value="0" ValueChanged="Rgb_ValueChanged"/>
        <Border x:Name="bdrColor" Height="80" Margin="0,10" CornerRadius="8"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;
namespace Ch16SlideRgb
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); UpdateColor(); }
        private void Rgb_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        { if (bdrColor != null) UpdateColor(); }
        private void UpdateColor()
        {
            var c = Color.FromRgb((byte)sldR.Value, (byte)sldG.Value, (byte)sldB.Value);
            bdrColor.Background = new SolidColorBrush(c); Title = $"RGB = {c.R}, {c.G}, {c.B}";
        }
    }
}`, points: ['<code>ValueChanged</code> 의 e 형식: <code>RoutedPropertyChangedEventArgs&lt;double&gt;</code>', 'Value(double) → <code>(byte)</code> 변환', '<code>Color.FromRgb</code> → <code>SolidColorBrush</code>', 'Border 를 XAML 마지막에 두고 null 가드'],
            notes: '<p><b>[6분]</b> 가드를 빼면 어떻게 될까? — sldR 의 Value="255" 가 InitializeComponent 도중 ValueChanged 를 부르고, sldG · bdrColor 는 아직 null.</p><p>예제 16-10 의 전체 버전(숫자 · 16진수 표시)을 이어서 보여 주고, 실습으로 “밝기 슬라이더 추가” 같은 변형을 제안할 수 있습니다.</p>' },
          { layout: 'bullets', title: 'DatePicker · ProgressBar · 화면 묶기', lead: '입력 · 표시 · 정리 도구',
            bullets: ['<b>DatePicker</b>: <code>SelectedDate</code> 는 <code>DateTime?</code> → null 확인 후 <code>.Value</code>', '<b>ProgressBar</b>: 코드가 <code>Value</code> 를 바꿈 · <code>IsIndeterminate</code>', '<b>GroupBox</b>: 제목 + 테두리 묶음', '<b>Expander</b>: 접었다 펴기 (<code>IsExpanded</code>)', '<b>TabControl</b>: TabItem 으로 페이지 나누기', '<b>ToolTip</b>: <code>ToolTip="설명"</code> 마우스 풍선'],
            notes: '<p><b>[6분]</b> 예제 16-11(방학 진행률)과 16-12(환경 설정 창)를 차례로 실행해 보여 줍니다.</p><p>DatePicker 의 null 처리, 보이지 않는 탭의 컨트롤도 코드에서 읽을 수 있다는 점을 짚어 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>ItemsSource</code> 로 ObservableCollection 을 연결한 ListBox 에 항목을 추가하는 올바른 방법은?', options: ['<code>lst.Items.Add("새 항목");</code>', '<code>lst.ItemsSource.Add("새 항목");</code>', '<code>collection.Add("새 항목");</code>', '<code>lst.SelectedItem = "새 항목";</code>'], answer: 2, explain: '컬렉션(데이터)에 추가하면 화면이 자동으로 바뀝니다. ItemsSource 를 쓰는 중의 Items.Add 는 InvalidOperationException 입니다.',
            notes: '<p>1번을 고른 학생이 많다면 SVG 를 다시 보여 주며 “데이터를 고친다”를 한 번 더 강조합니다.</p>' },
          { layout: 'practice', title: '실습 16-4. 할 일 목록', desc: '<p>할 일 추가(Enter) · “완료 →”로 옮기기 · 삭제, 그리고 <code>완료 n / 전체</code> 와 ProgressBar 로 진행률 표시.</p>', starter: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideTodo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="할 일 목록" Width="420" Height="340">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button Content="추가" DockPanel.Dock="Right" Width="60" Margin="6,0,0,0" IsDefault="True" Click="btnAdd_Click"/>
            <TextBox x:Name="txtTodo"/>
        </DockPanel>
        <ProgressBar x:Name="prgDone" DockPanel.Dock="Bottom" Height="16" Margin="0,8,0,0"/>
        <Button Content="완료 →" DockPanel.Dock="Bottom" Margin="0,8,0,0" Click="btnDone_Click"/>
        <UniformGrid Columns="2">
            <ListBox x:Name="lstTodo" Margin="0,0,4,0"/>
            <ListBox x:Name="lstDone" Foreground="Gray"/>
        </UniformGrid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch16SlideTodo
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); lstTodo.Items.Add("운동 30분"); }
        private void btnAdd_Click(object sender, RoutedEventArgs e) { /* TODO */ }
        private void btnDone_Click(object sender, RoutedEventArgs e) { /* TODO */ }
    }
}`, solution: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch16SlideTodo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="할 일 목록" Width="420" Height="340">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button Content="추가" DockPanel.Dock="Right" Width="60" Margin="6,0,0,0" IsDefault="True" Click="btnAdd_Click"/>
            <TextBox x:Name="txtTodo"/>
        </DockPanel>
        <ProgressBar x:Name="prgDone" DockPanel.Dock="Bottom" Height="16" Margin="0,8,0,0"/>
        <Button Content="완료 →" DockPanel.Dock="Bottom" Margin="0,8,0,0" Click="btnDone_Click"/>
        <UniformGrid Columns="2">
            <ListBox x:Name="lstTodo" Margin="0,0,4,0"/>
            <ListBox x:Name="lstDone" Foreground="Gray"/>
        </UniformGrid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch16SlideTodo
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); lstTodo.Items.Add("운동 30분"); UpdateProgress(); }
        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            if (txtTodo.Text.Trim() == "") return;
            lstTodo.Items.Add(txtTodo.Text); txtTodo.Clear(); UpdateProgress();
        }
        private void btnDone_Click(object sender, RoutedEventArgs e)
        {
            object item = lstTodo.SelectedItem;
            if (item == null) return;
            lstTodo.Items.Remove(item); lstDone.Items.Add(item); UpdateProgress();
        }
        private void UpdateProgress()
        {
            int done = lstDone.Items.Count, total = done + lstTodo.Items.Count;
            prgDone.Maximum = total == 0 ? 1 : total;
            prgDone.Value = done;
        }
    }
}`,
            notes: '<p><b>[7분]</b> 슬라이드 버전은 삭제 버튼과 “완료 n / 전체” 글자를 뺀 축약형입니다. 본문 실습 16-4 는 GroupBox 로 두 목록에 제목을 붙이고 삭제 · 진행 글자까지 있습니다.</p><p>자주 하는 실수: 선택 없이 “완료 →” → SelectedItem 이 null. ProgressBar 의 Maximum 을 0 으로 두기.</p>' },
          { layout: 'summary', title: '정리', bullets: ['ComboBox · ListBox: Items · <b>SelectedIndex(-1)</b> · SelectedItem · SelectionChanged', 'Multiple 선택 → <code>SelectedItems</code> (지울 땐 ToList 복사)', '바뀌는 데이터 → <b>ObservableCollection + ItemsSource</b>', 'Slider · ProgressBar: Minimum · Maximum · <b>Value</b> · ValueChanged', 'DatePicker.SelectedDate 는 <code>DateTime?</code>', 'GroupBox · Expander · TabControl · ToolTip 으로 화면 정리'],
            notes: '<p>학습 목표를 다시 확인합니다. 다음 장(17장 이벤트 처리)에서는 오늘 쓴 Click · TextChanged · SelectionChanged 같은 이벤트가 어떻게 전달되는지(라우티드 이벤트)와 마우스 · 키보드 이벤트를 배웁니다.</p>' }
        ]
      }
    ]
  });
})();
