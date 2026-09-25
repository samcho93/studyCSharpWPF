/* Chapter 18. 데이터 바인딩 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 그림 1. 바인딩의 구성 요소 ---------- */
  const SVG_PARTS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="바인딩 대상, Binding 객체, 원본의 관계">
  <defs>
    <marker id="ah18a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah18b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker>
  </defs>
  <g>
    <rect x="40" y="70" width="340" height="250" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="210" y="115" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">대상 (Target)</text>
    <text x="210" y="170" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">TextBlock</text>
    <text x="210" y="210" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--fg)">.Text 속성</text>
    <text x="210" y="265" text-anchor="middle" style="font-size:19px;fill:var(--muted)">화면의 컨트롤</text>
    <text x="210" y="293" text-anchor="middle" style="font-size:19px;fill:var(--muted)">(대상 속성 = 의존 속성)</text>
  </g>
  <g>
    <rect x="480" y="50" width="320" height="290" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="640" y="95" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">Binding 객체</text>
    <text x="510" y="145" style="${MONO};font-size:21px;fill:var(--fg)">Path = Name</text>
    <text x="510" y="182" style="${MONO};font-size:21px;fill:var(--fg)">Mode = OneWay</text>
    <text x="510" y="219" style="${MONO};font-size:21px;fill:var(--fg)">StringFormat</text>
    <text x="510" y="256" style="${MONO};font-size:21px;fill:var(--fg)">Converter</text>
    <text x="640" y="310" text-anchor="middle" style="font-size:19px;fill:var(--muted)">둘을 잇는 “연결선” 설정</text>
  </g>
  <g>
    <rect x="900" y="70" width="340" height="250" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1070" y="115" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">원본 (Source)</text>
    <text x="1070" y="170" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">Person 객체</text>
    <text x="1070" y="210" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--fg)">.Name 속성</text>
    <text x="1070" y="265" text-anchor="middle" style="font-size:19px;fill:var(--muted)">데이터 (보통 DataContext)</text>
    <text x="1070" y="293" text-anchor="middle" style="font-size:19px;fill:var(--muted)">(원본 속성 = 일반 C# 속성)</text>
  </g>
  <g stroke-width="4">
    <line x1="896" y1="150" x2="806" y2="150" stroke="var(--accent)" marker-end="url(#ah18a)"/>
    <line x1="476" y1="150" x2="386" y2="150" stroke="var(--accent)" marker-end="url(#ah18a)"/>
    <line x1="386" y1="250" x2="476" y2="250" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah18b)"/>
    <line x1="806" y1="250" x2="896" y2="250" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah18b)"/>
  </g>
  <text x="851" y="135" text-anchor="middle" style="font-size:18px;fill:var(--accent)">① 값 읽기</text>
  <text x="431" y="135" text-anchor="middle" style="font-size:18px;fill:var(--accent)">② 표시</text>
  <text x="640" y="385" text-anchor="middle" style="font-size:20px;fill:var(--warn)">- - → TwoWay 일 때만: 사용자가 고친 값을 원본에 되돌려 쓴다</text>
  <text x="640" y="450" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">&lt;TextBlock Text="{Binding Name}"/&gt;</text>
  <text x="440" y="490" text-anchor="middle" style="font-size:19px;fill:var(--accent2)">↑ 대상 속성</text>
  <text x="800" y="490" text-anchor="middle" style="font-size:19px;fill:var(--ok)">↑ 원본 속성의 경로(Path)</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:20px;fill:var(--muted)">원본 객체는 따로 말하지 않으면 DataContext 에서 찾는다 (ElementName · Source 로 바꿀 수 있음)</text>
</svg>`;

  /* ---------- 그림 2. INotifyPropertyChanged 알림 흐름 ---------- */
  const SVG_INPC = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="속성 값이 바뀌면 PropertyChanged 이벤트로 바인딩에 알려 화면이 갱신된다">
  <defs><marker id="ah18c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">값이 바뀌면 “바뀌었어요!” 하고 알린다</text>
  <g>
    <rect x="25" y="90" width="210" height="150" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="130" y="128" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">① 코드</text>
    <text x="130" y="175" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">person.Age++;</text>
    <text x="130" y="212" text-anchor="middle" style="font-size:18px;fill:var(--muted)">버튼 클릭 등</text>
  </g>
  <g>
    <rect x="280" y="90" width="210" height="150" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="385" y="128" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">② set 접근자</text>
    <text x="385" y="175" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">OnPropertyChanged()</text>
    <text x="385" y="212" text-anchor="middle" style="font-size:18px;fill:var(--muted)">값 저장 후 호출</text>
  </g>
  <g>
    <rect x="535" y="90" width="210" height="150" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
    <text x="640" y="128" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">③ 이벤트 발생</text>
    <text x="640" y="175" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">PropertyChanged</text>
    <text x="640" y="212" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">("Age")</text>
  </g>
  <g>
    <rect x="790" y="90" width="210" height="150" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="895" y="128" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">④ Binding</text>
    <text x="895" y="175" text-anchor="middle" style="font-size:19px;fill:var(--fg)">구독하고 있다가</text>
    <text x="895" y="212" text-anchor="middle" style="font-size:19px;fill:var(--fg)">새 값을 다시 읽음</text>
  </g>
  <g>
    <rect x="1045" y="90" width="210" height="150" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1150" y="128" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">⑤ 화면 갱신</text>
    <text x="1150" y="175" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">TextBlock.Text</text>
    <text x="1150" y="212" text-anchor="middle" style="font-size:18px;fill:var(--muted)">"18살" 로 바뀜</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="237" y1="165" x2="274" y2="165" marker-end="url(#ah18c)"/>
    <line x1="492" y1="165" x2="529" y2="165" marker-end="url(#ah18c)"/>
    <line x1="747" y1="165" x2="784" y2="165" marker-end="url(#ah18c)"/>
    <line x1="1002" y1="165" x2="1039" y2="165" marker-end="url(#ah18c)"/>
  </g>
  <rect x="160" y="300" width="960" height="150" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3" stroke-dasharray="10 7"/>
  <text x="640" y="345" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--danger)">INotifyPropertyChanged 가 없으면?</text>
  <text x="640" y="388" text-anchor="middle" style="font-size:21px;fill:var(--fg)">③ 이 일어나지 않는다 → 바인딩은 값이 바뀐 줄 모른다</text>
  <text x="640" y="424" text-anchor="middle" style="font-size:21px;fill:var(--fg)">→ 객체 안의 값은 18 인데 화면에는 여전히 17 이 보인다</text>
  <text x="640" y="510" text-anchor="middle" style="font-size:21px;fill:var(--muted)">바인딩이 “자동으로” 화면을 바꾸는 비밀 = 원본 객체가 보내는 PropertyChanged 알림</text>
</svg>`;

  /* ---------- 그림 3. 컬렉션 바인딩과 데이터 템플릿 ---------- */
  const SVG_ITEMS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="ObservableCollection 을 ItemsSource 에 연결하면 항목마다 DataTemplate 이 적용된다">
  <defs>
    <marker id="ah18d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah18e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker>
  </defs>
  <g>
    <rect x="30" y="60" width="330" height="330" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="195" y="100" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">데이터 (원본)</text>
    <text x="195" y="132" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">ObservableCollection&lt;Contact&gt;</text>
    <rect x="60" y="160" width="270" height="56" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="80" y="196" style="${MONO};font-size:20px;fill:var(--fg)">[0] 김민수 · 010-…</text>
    <rect x="60" y="228" width="270" height="56" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="80" y="264" style="${MONO};font-size:20px;fill:var(--fg)">[1] 이서연 · 010-…</text>
    <rect x="60" y="296" width="270" height="56" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="80" y="332" style="${MONO};font-size:20px;fill:var(--fg)">[2] 박지훈 · 010-…</text>
  </g>
  <g>
    <rect x="470" y="130" width="300" height="190" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="620" y="175" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">ListBox</text>
    <text x="620" y="220" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">ItemsSource="{Binding …}"</text>
    <text x="620" y="258" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">ItemTemplate = DataTemplate</text>
    <text x="620" y="295" text-anchor="middle" style="font-size:18px;fill:var(--muted)">항목 수만큼 틀로 찍어 낸다</text>
  </g>
  <g>
    <rect x="880" y="60" width="370" height="100" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="100" style="font-size:22px;font-weight:700;fill:var(--fg)">김민수</text>
    <text x="905" y="138" style="${MONO};font-size:19px;fill:var(--accent2)">010-1234-5678</text>
    <rect x="880" y="175" width="370" height="100" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="215" style="font-size:22px;font-weight:700;fill:var(--fg)">이서연</text>
    <text x="905" y="253" style="${MONO};font-size:19px;fill:var(--accent2)">010-2222-3333</text>
    <rect x="880" y="290" width="370" height="100" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="330" style="font-size:22px;font-weight:700;fill:var(--fg)">박지훈</text>
    <text x="905" y="368" style="${MONO};font-size:19px;fill:var(--accent2)">010-4444-5555</text>
  </g>
  <g stroke-width="4">
    <line x1="362" y1="200" x2="464" y2="200" stroke="var(--accent)" marker-end="url(#ah18d)"/>
    <line x1="772" y1="225" x2="874" y2="110" stroke="var(--accent)" marker-end="url(#ah18d)"/>
    <line x1="772" y1="225" x2="874" y2="225" stroke="var(--accent)" marker-end="url(#ah18d)"/>
    <line x1="772" y1="225" x2="874" y2="340" stroke="var(--accent)" marker-end="url(#ah18d)"/>
    <path d="M195,392 C195,470 620,470 620,326" fill="none" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah18e)"/>
  </g>
  <text x="413" y="185" text-anchor="middle" style="font-size:17px;fill:var(--accent)">연결</text>
  <text x="400" y="500" text-anchor="middle" style="font-size:20px;fill:var(--warn)">Add · Remove → CollectionChanged 알림 → 목록 다시 그림</text>
  <text x="1065" y="440" text-anchor="middle" style="font-size:20px;fill:var(--muted)">카드 하나 = DataTemplate 하나</text>
  <text x="1065" y="470" text-anchor="middle" style="font-size:20px;fill:var(--muted)">(DataContext = 그 항목)</text>
  <text x="640" y="545" text-anchor="middle" style="font-size:20px;fill:var(--fg)">항목의 속성이 바뀔 때 카드도 바뀌게 하려면 → 항목 클래스(Contact)도 INotifyPropertyChanged</text>
</svg>`;

  /* ---------- 그림 4. 마스터-디테일 ---------- */
  const SVG_MD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="ListBox 의 SelectedItem 을 뷰모델의 SelectedBook 과 연결하고, 상세 화면은 SelectedBook 의 속성에 바인딩한다">
  <defs>
    <marker id="ah18f" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah18g" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M12,0 L0,6 L12,12 z" fill="var(--accent)"/></marker>
  </defs>
  <g>
    <rect x="30" y="70" width="330" height="360" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="195" y="110" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">마스터 (ListBox)</text>
    <rect x="55" y="135" width="280" height="54" rx="6" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="75" y="170" style="font-size:21px;fill:var(--fg)">어린 왕자</text>
    <rect x="55" y="199" width="280" height="54" rx="6" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="3"/>
    <text x="75" y="234" style="font-size:21px;font-weight:700;fill:var(--fg)">해리 포터 ◀ 선택</text>
    <rect x="55" y="263" width="280" height="54" rx="6" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="75" y="298" style="font-size:21px;fill:var(--fg)">데미안</text>
    <text x="195" y="365" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">SelectedItem=</text>
    <text x="195" y="395" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">"{Binding SelectedBook}"</text>
  </g>
  <g>
    <rect x="470" y="130" width="340" height="240" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="640" y="172" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">MainViewModel</text>
    <text x="640" y="202" text-anchor="middle" style="font-size:18px;fill:var(--muted)">(창의 DataContext)</text>
    <text x="500" y="250" style="${MONO};font-size:20px;fill:var(--fg)">Books</text>
    <text x="500" y="290" style="${MONO};font-size:20px;font-weight:700;fill:var(--fg)">SelectedBook</text>
    <text x="640" y="340" text-anchor="middle" style="font-size:18px;fill:var(--muted)">바뀌면 PropertyChanged</text>
  </g>
  <g>
    <rect x="920" y="70" width="330" height="360" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="1085" y="110" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">디테일 (상세)</text>
    <text x="945" y="165" style="font-size:22px;font-weight:700;fill:var(--fg)">해리 포터</text>
    <text x="945" y="200" style="font-size:20px;fill:var(--fg)">J.K. 롤링 · 12,000원</text>
    <text x="945" y="265" style="${MONO};font-size:16px;fill:var(--muted)">Text="{Binding</text>
    <text x="945" y="292" style="${MONO};font-size:16px;fill:var(--muted)">  SelectedBook.Title}"</text>
    <text x="945" y="345" style="${MONO};font-size:16px;fill:var(--muted)">Text="{Binding</text>
    <text x="945" y="372" style="${MONO};font-size:16px;fill:var(--muted)">  SelectedBook.Author}"</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="370" y1="226" x2="462" y2="280" marker-start="url(#ah18g)" marker-end="url(#ah18f)"/>
    <line x1="466" y1="245" x2="366" y2="160" stroke-dasharray="8 6" marker-end="url(#ah18f)"/>
    <line x1="812" y1="285" x2="914" y2="230" marker-end="url(#ah18f)"/>
  </g>
  <text x="418" y="310" text-anchor="middle" style="font-size:18px;fill:var(--accent)">TwoWay</text>
  <text x="408" y="178" text-anchor="middle" style="font-size:18px;fill:var(--accent)">ItemsSource</text>
  <text x="865" y="300" text-anchor="middle" style="font-size:18px;fill:var(--accent)">경로</text>
  <text x="640" y="485" text-anchor="middle" style="font-size:22px;fill:var(--fg)">① 목록에서 고른다 → ② SelectedBook 이 바뀐다 → ③ 상세 화면이 새 책을 보여 준다</text>
  <text x="640" y="525" text-anchor="middle" style="font-size:20px;fill:var(--muted)">이벤트 처리기(SelectionChanged) 없이 바인딩만으로 연결된다</text>
</svg>`;

  /* ---------- 그림 5. 컬렉션 뷰 ---------- */
  const SVG_VIEW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="원본 컬렉션 위에 컬렉션 뷰를 씌워 필터와 정렬을 한다">
  <defs><marker id="ah18h" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <g>
    <rect x="30" y="80" width="330" height="360" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="195" y="122" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">원본 컬렉션</text>
    <text x="195" y="152" text-anchor="middle" style="font-size:18px;fill:var(--muted)">(데이터는 그대로)</text>
    <text x="60" y="205" style="font-size:21px;fill:var(--fg)">사과 · 3,000원</text>
    <text x="60" y="250" style="font-size:21px;fill:var(--fg)">바나나 · 4,500원</text>
    <text x="60" y="295" style="font-size:21px;fill:var(--fg)">사과잼 · 6,000원</text>
    <text x="60" y="340" style="font-size:21px;fill:var(--fg)">딸기 · 9,000원</text>
    <text x="60" y="385" style="font-size:21px;fill:var(--fg)">풋사과 · 2,500원</text>
  </g>
  <g>
    <rect x="470" y="80" width="340" height="360" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="640" y="122" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">ICollectionView (보기)</text>
    <text x="640" y="152" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">CollectionViewSource.GetDefaultView(…)</text>
    <text x="495" y="210" style="font-size:20px;font-weight:700;fill:var(--fg)">Filter</text>
    <text x="495" y="242" style="${MONO};font-size:18px;fill:var(--fg)">이름에 "사과" 포함?</text>
    <text x="495" y="300" style="font-size:20px;font-weight:700;fill:var(--fg)">SortDescriptions</text>
    <text x="495" y="332" style="${MONO};font-size:18px;fill:var(--fg)">Price 오름차순</text>
    <text x="495" y="395" style="font-size:20px;font-weight:700;fill:var(--warn)">Refresh()</text>
    <text x="495" y="422" style="font-size:17px;fill:var(--muted)">조건이 바뀌면 다시 계산</text>
  </g>
  <g>
    <rect x="920" y="80" width="330" height="360" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="1085" y="122" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent2)">화면 (ListView)</text>
    <text x="1085" y="152" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">ItemsSource = view</text>
    <text x="950" y="205" style="font-size:21px;fill:var(--fg)">풋사과 · 2,500원</text>
    <text x="950" y="250" style="font-size:21px;fill:var(--fg)">사과 · 3,000원</text>
    <text x="950" y="295" style="font-size:21px;fill:var(--fg)">사과잼 · 6,000원</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="362" y1="260" x2="464" y2="260" marker-end="url(#ah18h)"/>
    <line x1="812" y1="260" x2="914" y2="260" marker-end="url(#ah18h)"/>
  </g>
  <text x="640" y="500" text-anchor="middle" style="font-size:22px;fill:var(--fg)">원본을 지우거나 순서를 바꾸지 않고, “보이는 방식”만 바꾼다</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:20px;fill:var(--muted)">검색어 입력 → Filter 조건 판단 → view.Refresh() → 화면 갱신</text>
</svg>`;

  /* ======================= 18-1 예제 코드 ======================= */
  const EX_MANUAL = `// ===== File: MainWindow.xaml =====
<Window x:Class="ManualUpdate.MainWindow"
        ${NS}
        Title="바인딩 없이 코드로 표시" Width="380" Height="250">
    <StackPanel Margin="20">
        <TextBlock x:Name="txtName" FontSize="22" FontWeight="Bold"/>
        <TextBlock x:Name="txtAge" FontSize="16" Margin="0,6,0,0"/>
        <TextBlock x:Name="txtCity" FontSize="16" Margin="0,4,0,16"/>
        <Button Content="나이 +1" Height="32" Click="BtnOlder_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ManualUpdate
{
    public partial class MainWindow : Window
    {
        private Person person = new Person { Name = "홍길동", Age = 17, City = "부산" };

        public MainWindow()
        {
            InitializeComponent();
            ShowPerson();   // 처음 한 번 화면에 옮겨 적기
        }

        // 데이터 → 화면: 컨트롤마다 한 줄씩 직접 옮겨 적는다
        private void ShowPerson()
        {
            txtName.Text = person.Name;
            txtAge.Text = "나이: " + person.Age + "살";
            txtCity.Text = "사는 곳: " + person.City;
        }

        private void BtnOlder_Click(object sender, RoutedEventArgs e)
        {
            person.Age++;
            ShowPerson();   // 이 줄을 잊으면 화면은 옛날 값 그대로!
        }
    }
}
// ===== File: Person.cs =====
namespace ManualUpdate
{
    public class Person
    {
        public string Name { get; set; } = "";
        public int Age { get; set; }
        public string City { get; set; } = "";
    }
}`;

  const EX_ELEMENT = `// ===== File: MainWindow.xaml =====
<Window x:Class="ElementBinding.MainWindow"
        ${NS}
        Title="요소 간 바인딩" Width="380" Height="240">
    <StackPanel Margin="20">
        <!-- 원본: 이름이 slider 인 Slider 의 Value 속성 -->
        <Slider x:Name="slider" Minimum="10" Maximum="40" Value="20"/>

        <!-- 대상 1: TextBlock.Text ← slider.Value -->
        <TextBlock Text="{Binding ElementName=slider, Path=Value, StringFormat='글자 크기: {0:F0}'}"
                   FontSize="16" Margin="0,10,0,0"/>

        <!-- 대상 2: TextBlock.FontSize ← slider.Value -->
        <TextBlock Text="바인딩" FontSize="{Binding ElementName=slider, Path=Value}"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ElementBinding
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();   // C# 코드는 한 줄도 추가하지 않았다
        }
    }
}`;

  const EX_DATACONTEXT = `// ===== File: MainWindow.xaml =====
<Window x:Class="DataContextDemo.MainWindow"
        ${NS}
        Title="DataContext 와 객체 바인딩" Width="400" Height="300">
    <!-- 창의 DataContext(Person 객체)를 안쪽 컨트롤이 모두 물려받는다 -->
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Name}" FontSize="24" FontWeight="Bold"/>
        <TextBlock Text="{Binding Path=Age}" FontSize="16"/>
        <TextBlock Text="{Binding Email}" FontSize="16" Foreground="SteelBlue"/>

        <Border BorderBrush="SteelBlue" BorderThickness="1" Padding="10" Margin="0,14,0,0">
            <!-- Border 안의 StackPanel 도 같은 DataContext 를 물려받는다 -->
            <StackPanel>
                <TextBlock Text="주소" Foreground="Gray"/>
                <!-- 점(.)으로 속성의 속성을 따라간다 -->
                <TextBlock Text="{Binding Address.City}" FontSize="16"/>
                <TextBlock Text="{Binding Address.Street}" FontSize="16"/>
            </StackPanel>
        </Border>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace DataContextDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // 창의 DataContext 에 데이터 객체를 넣는다 → XAML 의 {Binding …} 이 여기서 값을 찾는다
            DataContext = new Person
            {
                Name = "김하늘",
                Age = 17,
                Email = "sky@example.com",
                Address = new Address { City = "서울특별시", Street = "한강대로 100" }
            };
        }
    }
}
// ===== File: Person.cs =====
namespace DataContextDemo
{
    public class Address
    {
        public string City { get; set; } = "";
        public string Street { get; set; } = "";
    }

    public class Person
    {
        public string Name { get; set; } = "";
        public int Age { get; set; }
        public string Email { get; set; } = "";
        public Address Address { get; set; } = new Address();
    }
}`;

  const EX_INPC = `// ===== File: MainWindow.xaml =====
<Window x:Class="NotifyDemo.MainWindow"
        ${NS}
        Title="INotifyPropertyChanged" Width="380" Height="260">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Name}" FontSize="24" FontWeight="Bold"/>
        <TextBlock Text="{Binding Age}" FontSize="40" Foreground="SteelBlue"/>
        <StackPanel Orientation="Horizontal" Margin="0,12,0,0">
            <Button Content="나이 +1" Width="100" Height="32" Click="BtnOlder_Click"/>
            <Button Content="이름 바꾸기" Width="100" Height="32" Margin="8,0,0,0"
                    Click="BtnRename_Click"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace NotifyDemo
{
    public partial class MainWindow : Window
    {
        private Person person = new Person { Name = "홍길동", Age = 17 };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = person;
        }

        // 데이터만 바꾼다. 화면(TextBlock)은 한 줄도 건드리지 않는다!
        private void BtnOlder_Click(object sender, RoutedEventArgs e)
        {
            person.Age++;
        }

        private void BtnRename_Click(object sender, RoutedEventArgs e)
        {
            person.Name = person.Name == "홍길동" ? "성춘향" : "홍길동";
        }
    }
}
// ===== File: Person.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace NotifyDemo
{
    // INotifyPropertyChanged: "내 속성이 바뀌면 알려 줄게" 라는 약속(인터페이스)
    public class Person : INotifyPropertyChanged
    {
        private string name = "";
        private int age;

        public string Name
        {
            get { return name; }
            set
            {
                if (name == value) return;   // 같은 값이면 알릴 필요 없음
                name = value;
                OnPropertyChanged();         // = OnPropertyChanged("Name")
            }
        }

        public int Age
        {
            get { return age; }
            set
            {
                if (age == value) return;
                age = value;
                OnPropertyChanged();         // = OnPropertyChanged("Age")
            }
        }

        // 바인딩이 이 이벤트를 구독한다
        public event PropertyChangedEventHandler? PropertyChanged;

        // [CallerMemberName]: 호출한 속성의 이름을 컴파일러가 자동으로 넣어 준다
        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const EX_MODES = `// ===== File: MainWindow.xaml =====
<Window x:Class="BindingModes.MainWindow"
        ${NS}
        Title="바인딩 모드" Width="420" Height="400">
    <StackPanel Margin="20">
        <TextBlock Text="이름 — TwoWay (화면 ↔ 원본)"/>
        <TextBox Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="16" Margin="0,2,0,8"/>

        <TextBlock Text="나이 — TwoWay (숫자가 아니면 원본에 반영되지 않음)"/>
        <TextBox Text="{Binding Age, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="16" Margin="0,2,0,8"/>

        <TextBlock Text="이름 — OneWay (원본 → 화면만. 고쳐도 원본은 그대로)"/>
        <TextBox Text="{Binding Name, Mode=OneWay}" FontSize="16" Margin="0,2,0,8"
                 Background="WhiteSmoke"/>

        <TextBlock Text="{Binding Greeting}" FontSize="18" Foreground="SteelBlue"
                   Margin="0,6,0,0"/>
        <Button Content="원본 객체의 값 확인" Height="30" Margin="0,12,0,0"
                Click="BtnCheck_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace BindingModes
{
    public partial class MainWindow : Window
    {
        private Person person = new Person { Name = "홍길동", Age = 17 };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = person;
        }

        // 화면이 아니라 "원본 객체"에 실제로 들어 있는 값을 보여 준다
        private void BtnCheck_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show($"person.Name = {person.Name}\\nperson.Age = {person.Age}", "원본 값");
        }
    }
}
// ===== File: Person.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BindingModes
{
    public class Person : INotifyPropertyChanged
    {
        private string name = "";
        private int age;

        public string Name
        {
            get { return name; }
            set
            {
                name = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(Greeting));   // Greeting 도 Name 에 따라 바뀐다
            }
        }

        public int Age
        {
            get { return age; }
            set
            {
                age = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(Greeting));
            }
        }

        // 계산 속성(읽기 전용): 값을 저장하지 않고 Name · Age 로 만든다
        public string Greeting => $"{Name}님({Age}살), 반가워요!";

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const EX_FORMAT = `// ===== File: MainWindow.xaml =====
<Window x:Class="StringFormatDemo.MainWindow"
        ${NS}
        Title="StringFormat · TargetNullValue · FallbackValue" Width="420" Height="330">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Name}" FontSize="22" FontWeight="Bold"/>

        <!-- {} 로 시작: 뒤의 { } 는 마크업 확장이 아니라 서식 문자열 -->
        <TextBlock Text="{Binding Price, StringFormat={}{0:N0}원}" FontSize="18"/>

        <!-- 글자로 시작하는 서식은 작은따옴표로 감싼다 -->
        <TextBlock Text="{Binding DiscountRate, StringFormat='할인율 {0:P0}'}" FontSize="16"/>
        <TextBlock Text="{Binding ReleaseDate, StringFormat='출시일 {0:yyyy년 M월 d일}'}" FontSize="16"/>
        <TextBlock Text="{Binding Stock, StringFormat='재고 {0}개'}" FontSize="16"/>

        <!-- 값이 null 이면 TargetNullValue 를 보여 준다 -->
        <TextBlock Text="{Binding Memo, TargetNullValue='(메모 없음)'}" FontSize="16"
                   Foreground="Gray" Margin="0,10,0,0"/>

        <!-- 경로를 끝까지 따라갈 수 없으면(Maker 가 null) FallbackValue -->
        <TextBlock Text="{Binding Maker.Name, FallbackValue='(제조사 정보 없음)'}" FontSize="16"
                   Foreground="Gray"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace StringFormatDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new Product
            {
                Name = "무선 키보드",
                Price = 39000,
                DiscountRate = 0.15,
                ReleaseDate = new DateTime(2025, 3, 2),
                Stock = 12,
                Memo = null,     // 메모 없음
                Maker = null     // 제조사 정보 없음
            };
        }
    }
}
// ===== File: Product.cs =====
using System;

namespace StringFormatDemo
{
    public class Maker
    {
        public string Name { get; set; } = "";
    }

    public class Product
    {
        public string Name { get; set; } = "";
        public int Price { get; set; }
        public double DiscountRate { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int Stock { get; set; }
        public string? Memo { get; set; }
        public Maker? Maker { get; set; }
    }
}`;

  const EX_CONVERTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="ScoreConverterDemo.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:ScoreConverterDemo"
        Title="값 변환기 (IValueConverter)" Width="400" Height="300">
    <Window.Resources>
        <!-- 변환기 객체를 리소스로 만들어 두고 x:Key 로 이름을 붙인다 -->
        <local:ScoreToBrushConverter x:Key="ScoreToBrush"/>
        <local:BoolToVisibilityConverter x:Key="BoolToVisibility"/>
    </Window.Resources>
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Name}" FontSize="20" FontWeight="Bold"/>
        <Slider Minimum="0" Maximum="100" TickFrequency="1" IsSnapToTickEnabled="True"
                Value="{Binding Score, Mode=TwoWay}" Margin="0,10,0,6"/>

        <!-- 같은 Score 를 글자로도, 색으로도 보여 준다 -->
        <TextBlock Text="{Binding Score, StringFormat={}{0:F0}점}" FontSize="40" FontWeight="Bold"
                   Foreground="{Binding Score, Converter={StaticResource ScoreToBrush}}"/>

        <!-- bool(IsPassed) → Visibility : true 면 보이고 false 면 사라진다 -->
        <Border Background="SeaGreen" CornerRadius="6" Padding="12,4" HorizontalAlignment="Left"
                Visibility="{Binding IsPassed, Converter={StaticResource BoolToVisibility}}">
            <TextBlock Text="합격" FontSize="16" Foreground="White"/>
        </Border>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ScoreConverterDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new Student { Name = "이서연", Score = 72 };
        }
    }
}
// ===== File: Student.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ScoreConverterDemo
{
    public class Student : INotifyPropertyChanged
    {
        private double score;
        public string Name { get; set; } = "";

        public double Score
        {
            get { return score; }
            set
            {
                score = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(IsPassed));
            }
        }

        public bool IsPassed => Score >= 60;   // 60점 이상이면 합격

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
// ===== File: Converters.cs =====
using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;
using System.Windows.Media;

namespace ScoreConverterDemo
{
    // 원본(double 점수) → 대상(Brush 글자색)
    public class ScoreToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            double score = (double)value;
            if (score >= 80) return Brushes.SeaGreen;
            if (score >= 60) return Brushes.DarkOrange;
            return Brushes.Crimson;
        }

        // 대상 → 원본 방향. OneWay 로만 쓰므로 필요 없다
        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }

    // 원본(bool) → 대상(Visibility)
    public class BoolToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return (bool)value ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return (Visibility)value == Visibility.Visible;
        }
    }
}`;

  /* ======================= 18-1 실습 코드 ======================= */
  const P1_XAML_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="TempConverter.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:TempConverter"
        Title="온도 변환기" Width="380" Height="270">
    <Window.Resources>
        <local:CelsiusToFahrenheitConverter x:Key="CelsiusToFahrenheit"/>
    </Window.Resources>
    <StackPanel Margin="20">
        <TextBlock Text="슬라이더로 온도를 정하세요 (-20 ~ 40 °C)" FontSize="14"/>
        <Slider Minimum="-20" Maximum="40" TickFrequency="1" IsSnapToTickEnabled="True"
                Value="{Binding Celsius, Mode=TwoWay}" Margin="0,8,0,16"/>
        <TextBlock Text="{Binding Celsius, StringFormat='섭씨 {0:F0} °C'}"
                   FontSize="26" FontWeight="Bold"/>
        <TextBlock Text="{Binding Celsius, Converter={StaticResource CelsiusToFahrenheit}, StringFormat='화씨 {0:F1} °F'}"
                   FontSize="26" Foreground="SteelBlue"/>
    </StackPanel>
</Window>`;

  const P1_XAML_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="TempConverter.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:TempConverter"
        Title="온도 변환기" Width="380" Height="270">
    <Window.Resources>
        <local:CelsiusToFahrenheitConverter x:Key="CelsiusToFahrenheit"/>
    </Window.Resources>
    <StackPanel Margin="20">
        <TextBlock Text="슬라이더로 온도를 정하세요 (-20 ~ 40 °C)" FontSize="14"/>
        <!-- TODO 1: Value 를 Celsius 에 TwoWay 로 바인딩 -->
        <Slider Minimum="-20" Maximum="40" TickFrequency="1" IsSnapToTickEnabled="True"
                Margin="0,8,0,16"/>
        <!-- TODO 2: Celsius 를 "섭씨 20 °C" 형식으로 표시 (StringFormat) -->
        <TextBlock Text="섭씨 ? °C" FontSize="26" FontWeight="Bold"/>
        <!-- TODO 3: 변환기로 화씨를 계산해 "화씨 68.0 °F" 형식으로 표시 -->
        <TextBlock Text="화씨 ? °F" FontSize="26" Foreground="SteelBlue"/>
    </StackPanel>
</Window>`;

  const P1_CS_COMMON = `// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace TempConverter
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new Temperature { Celsius = 20 };
        }
    }
}
// ===== File: Temperature.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace TempConverter
{
    public class Temperature : INotifyPropertyChanged
    {
        private double celsius;

        public double Celsius
        {
            get { return celsius; }
            set { celsius = value; OnPropertyChanged(); }
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const P1_STARTER = `${P1_XAML_STARTER}
${P1_CS_COMMON}
// ===== File: CelsiusToFahrenheitConverter.cs =====
using System;
using System.Globalization;
using System.Windows.Data;

namespace TempConverter
{
    public class CelsiusToFahrenheitConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            // TODO 4: 섭씨(double) → 화씨 = 섭씨 × 9 / 5 + 32
            return value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}`;

  const P1_SOLUTION = `${P1_XAML_SOLUTION}
${P1_CS_COMMON}
// ===== File: CelsiusToFahrenheitConverter.cs =====
using System;
using System.Globalization;
using System.Windows.Data;

namespace TempConverter
{
    public class CelsiusToFahrenheitConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            double celsius = (double)value;
            return celsius * 9 / 5 + 32;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}`;

  const P2_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="MemberForm.MainWindow"
        ${NS}
        Title="회원 정보 편집" Width="500" Height="340">
    <Grid Margin="15">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <!-- 왼쪽: 편집 폼 (TwoWay) -->
        <StackPanel Margin="0,0,10,0">
            <TextBlock Text="이름"/>
            <TextBox Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
            <TextBlock Text="이메일"/>
            <TextBox Text="{Binding Email, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
            <TextBlock Text="나이"/>
            <TextBox Text="{Binding Age, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
            <CheckBox Content="소식지 받기" IsChecked="{Binding IsSubscribed, Mode=TwoWay}"/>
        </StackPanel>

        <!-- 오른쪽: 미리 보기 (OneWay) -->
        <Border Grid.Column="1" BorderBrush="SteelBlue" BorderThickness="1" Padding="12" Background="AliceBlue">
            <StackPanel>
                <TextBlock Text="미리 보기" Foreground="Gray"/>
                <TextBlock Text="{Binding Name}" FontSize="22" FontWeight="Bold"/>
                <TextBlock Text="{Binding Age, StringFormat={}{0}세}" FontSize="16"/>
                <TextBlock Text="{Binding Email}" FontSize="14" Foreground="SteelBlue"/>
                <TextBlock Text="{Binding Summary}" TextWrapping="Wrap" Margin="0,12,0,0"/>
            </StackPanel>
        </Border>

        <Button Grid.Row="1" Grid.ColumnSpan="2" Content="저장" Height="32" Margin="0,12,0,0"
                Click="BtnSave_Click"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace MemberForm
{
    public partial class MainWindow : Window
    {
        private Member member = new Member { Name = "김하늘", Email = "sky@example.com", Age = 20, IsSubscribed = true };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = member;
        }

        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            // 컨트롤을 하나도 읽지 않고, 원본 객체만 보면 된다
            MessageBox.Show($"이름: {member.Name}\\n이메일: {member.Email}\\n나이: {member.Age}\\n소식지: {member.IsSubscribed}",
                            "저장된 회원 정보");
        }
    }
}
// ===== File: Member.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace MemberForm
{
    public class Member : INotifyPropertyChanged
    {
        private string name = "";
        private string email = "";
        private int age;
        private bool isSubscribed;

        public string Name
        {
            get { return name; }
            set { name = value; OnPropertyChanged(); OnPropertyChanged(nameof(Summary)); }
        }
        public string Email
        {
            get { return email; }
            set { email = value; OnPropertyChanged(); OnPropertyChanged(nameof(Summary)); }
        }
        public int Age
        {
            get { return age; }
            set { age = value; OnPropertyChanged(); OnPropertyChanged(nameof(Summary)); }
        }
        public bool IsSubscribed
        {
            get { return isSubscribed; }
            set { isSubscribed = value; OnPropertyChanged(); OnPropertyChanged(nameof(Summary)); }
        }

        public string Summary => $"{Name}({Age}세) 님은 소식지를 {(IsSubscribed ? "받습니다" : "받지 않습니다")}.";

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const P2_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="MemberForm.MainWindow"
        ${NS}
        Title="회원 정보 편집" Width="500" Height="340">
    <Grid Margin="15">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <!-- TODO 1: 왼쪽 폼 — TwoWay + UpdateSourceTrigger=PropertyChanged 로 바인딩 -->
        <StackPanel Margin="0,0,10,0">
            <TextBlock Text="이름"/>
            <TextBox Margin="0,2,0,8"/>
            <TextBlock Text="이메일"/>
            <TextBox Margin="0,2,0,8"/>
            <TextBlock Text="나이"/>
            <TextBox Margin="0,2,0,8"/>
            <CheckBox Content="소식지 받기"/>
        </StackPanel>

        <!-- TODO 2: 오른쪽 미리 보기 — 이름 · 나이(○○세) · 이메일 · Summary 표시 -->
        <Border Grid.Column="1" BorderBrush="SteelBlue" BorderThickness="1" Padding="12" Background="AliceBlue">
            <StackPanel>
                <TextBlock Text="미리 보기" Foreground="Gray"/>
            </StackPanel>
        </Border>

        <Button Grid.Row="1" Grid.ColumnSpan="2" Content="저장" Height="32" Margin="0,12,0,0"
                Click="BtnSave_Click"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace MemberForm
{
    public partial class MainWindow : Window
    {
        private Member member = new Member { Name = "김하늘", Email = "sky@example.com", Age = 20, IsSubscribed = true };

        public MainWindow()
        {
            InitializeComponent();
            // TODO 3: DataContext 설정
        }

        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: member 의 네 속성 값을 메시지 상자로 보여 주기
        }
    }
}
// ===== File: Member.cs =====
namespace MemberForm
{
    // TODO 5: INotifyPropertyChanged 를 구현해 값이 바뀌면 알리게 하기
    //         (Summary 는 다른 속성이 바뀔 때 함께 알려야 한다)
    public class Member
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public int Age { get; set; }
        public bool IsSubscribed { get; set; }

        public string Summary => $"{Name}({Age}세) 님은 소식지를 {(IsSubscribed ? "받습니다" : "받지 않습니다")}.";
    }
}`;

  /* ======================= 18-1 슬라이드용 짧은 코드 ======================= */
  const SL_DC = `// ===== File: MainWindow.xaml =====
<Window x:Class="DataContextSlide.MainWindow"
        ${NS}
        Title="DataContext" Width="340" Height="200">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Name}" FontSize="24" FontWeight="Bold"/>
        <TextBlock Text="{Binding Age}" FontSize="18"/>
        <TextBlock Text="{Binding Address.City}" FontSize="18"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace DataContextSlide
{
    public class Address { public string City { get; set; } = ""; }
    public class Person
    {
        public string Name { get; set; } = "";  public int Age { get; set; }
        public Address Address { get; set; } = new Address();
    }
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new Person { Name = "김하늘", Age = 17, Address = new Address { City = "서울" } };
        }
    }
}`;

  const SL_INPC = `// ===== File: MainWindow.xaml =====
<Window x:Class="InpcSlide.MainWindow"
        ${NS}
        Title="INotifyPropertyChanged" Width="340" Height="200">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Age, StringFormat={}{0}살}" FontSize="36"/>
        <Button Content="나이 +1" Height="30" Click="BtnOlder_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
namespace InpcSlide
{
    public class Person : INotifyPropertyChanged
    {
        private int age = 17;
        public int Age { get => age; set { age = value; OnPropertyChanged(); } }
        public event PropertyChangedEventHandler? PropertyChanged;
        void OnPropertyChanged([CallerMemberName] string? n = null) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
    }
    public partial class MainWindow : Window
    {
        private Person person = new Person();
        public MainWindow() { InitializeComponent(); DataContext = person; }
        private void BtnOlder_Click(object sender, RoutedEventArgs e) { person.Age++; }
    }
}`;

  const SL_MODES = `// ===== File: MainWindow.xaml =====
<Window x:Class="TwoWaySlide.MainWindow"
        ${NS}
        Title="TwoWay 바인딩" Width="340" Height="200">
    <StackPanel Margin="20">
        <TextBox Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="16"/>
        <TextBlock Text="{Binding Name, StringFormat='안녕하세요, {0}님!'}"
                   FontSize="18" Margin="0,12,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
namespace TwoWaySlide
{
    public class Person : INotifyPropertyChanged
    {
        private string name = "홍길동";
        public string Name { get => name; set { name = value; OnPropertyChanged(); } }
        public event PropertyChangedEventHandler? PropertyChanged;
        void OnPropertyChanged([CallerMemberName] string? n = null) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
    }
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); DataContext = new Person(); }
    }
}`;

  const SL_CONVERTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="ConverterSlide.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:ConverterSlide"
        Title="값 변환기" Width="320" Height="180">
    <Window.Resources>
        <local:ScoreToBrushConverter x:Key="ScoreToBrush"/>
    </Window.Resources>
    <TextBlock Text="{Binding StringFormat={}{0}점}" FontSize="48" Margin="20"
               Foreground="{Binding Converter={StaticResource ScoreToBrush}}"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;
using System.Windows.Media;
namespace ConverterSlide
{
    public class ScoreToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type t, object p, CultureInfo c) => (int)value >= 60 ? Brushes.SeaGreen : Brushes.Crimson;
        public object ConvertBack(object value, Type t, object p, CultureInfo c) => throw new NotSupportedException();
    }
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); DataContext = 85; }   // 점수 하나
    }
}`;

  /* ======================= 18-2 예제 코드 ======================= */
  const EX_OBS = `// ===== File: MainWindow.xaml =====
<Window x:Class="ObservableDemo.MainWindow"
        ${NS}
        Title="ObservableCollection 과 ItemsSource" Width="400" Height="360">
    <DockPanel Margin="12">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,8">
            <TextBox x:Name="txtName" Width="150" FontSize="14"/>
            <Button Content="추가" Width="60" Margin="6,0,0,0" Click="BtnAdd_Click"/>
            <Button Content="선택 삭제" Width="80" Margin="6,0,0,0" Click="BtnRemove_Click"/>
        </StackPanel>
        <!-- Students.Count 도 바인딩: 추가 · 삭제하면 숫자가 따라 바뀐다 -->
        <TextBlock DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray"
                   Text="{Binding Students.Count, StringFormat='학생 {0}명'}"/>
        <!-- ItemsSource: 목록 전체 / DisplayMemberPath: 항목의 어느 속성을 보여 줄지 -->
        <ListBox x:Name="lstStudents" ItemsSource="{Binding Students}"
                 DisplayMemberPath="Name" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace ObservableDemo
{
    public partial class MainWindow : Window
    {
        // List<Student> 로 바꾸면? → 추가 · 삭제해도 화면이 바뀌지 않는다
        public ObservableCollection<Student> Students { get; } = new ObservableCollection<Student>
        {
            new Student { Name = "김민수", Grade = 2 },
            new Student { Name = "이서연", Grade = 1 },
            new Student { Name = "박지훈", Grade = 3 }
        };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;   // 창 자신의 속성(Students)에 바인딩
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            string name = txtName.Text.Trim();
            if (name == "") return;
            Students.Add(new Student { Name = name, Grade = 1 });   // 목록에만 추가 → 화면 자동 반영
            txtName.Text = "";
        }

        private void BtnRemove_Click(object sender, RoutedEventArgs e)
        {
            if (lstStudents.SelectedItem is Student selected)
            {
                Students.Remove(selected);
            }
        }
    }
}
// ===== File: Student.cs =====
namespace ObservableDemo
{
    public class Student
    {
        public string Name { get; set; } = "";
        public int Grade { get; set; }
    }
}`;

  const EX_TEMPLATE = `// ===== File: MainWindow.xaml =====
<Window x:Class="TemplateDemo.MainWindow"
        ${NS}
        Title="DataTemplate 으로 항목 꾸미기" Width="400" Height="400">
    <DockPanel Margin="12">
        <Button DockPanel.Dock="Bottom" Content="연락처 추가" Height="30" Margin="0,8,0,0"
                Click="BtnAdd_Click"/>
        <ListBox ItemsSource="{Binding Contacts}" HorizontalContentAlignment="Stretch">
            <ListBox.ItemTemplate>
                <!-- 항목 하나를 어떻게 그릴지 정하는 "틀". 안의 DataContext = 그 항목(Contact) -->
                <DataTemplate>
                    <Border BorderBrush="LightGray" BorderThickness="0,0,0,1" Padding="6">
                        <StackPanel Orientation="Horizontal">
                            <Border Width="38" Height="38" CornerRadius="19" Background="SteelBlue">
                                <TextBlock Text="{Binding Initial}" Foreground="White" FontSize="18"
                                           HorizontalAlignment="Center" VerticalAlignment="Center"/>
                            </Border>
                            <StackPanel Margin="10,0,0,0">
                                <StackPanel Orientation="Horizontal">
                                    <TextBlock Text="{Binding Name}" FontSize="16" FontWeight="Bold"/>
                                    <TextBlock Text="{Binding Group, StringFormat=' · {0}'}" FontSize="14"
                                               Foreground="Gray"/>
                                </StackPanel>
                                <TextBlock Text="{Binding Phone}" Foreground="SteelBlue"/>
                            </StackPanel>
                        </StackPanel>
                    </Border>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace TemplateDemo
{
    public partial class MainWindow : Window
    {
        public ObservableCollection<Contact> Contacts { get; } = new ObservableCollection<Contact>
        {
            new Contact { Name = "김민수", Phone = "010-1234-5678", Group = "친구" },
            new Contact { Name = "이서연", Phone = "010-2222-3333", Group = "가족" },
            new Contact { Name = "박지훈", Phone = "010-4444-5555", Group = "동아리" }
        };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            int n = Contacts.Count + 1;
            // 새 항목도 같은 DataTemplate 으로 그려진다
            Contacts.Add(new Contact { Name = "최새봄" + n, Phone = "010-9000-000" + n, Group = "새 친구" });
        }
    }
}
// ===== File: Contact.cs =====
namespace TemplateDemo
{
    public class Contact
    {
        public string Name { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Group { get; set; } = "";

        // 이름의 첫 글자 (동그라미 안에 표시)
        public string Initial => Name.Length > 0 ? Name.Substring(0, 1) : "?";
    }
}`;

  const EX_MASTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="MasterDetail.MainWindow"
        ${NS}
        Title="도서 목록 — 마스터-디테일" Width="520" Height="360">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="190"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <!-- 마스터: 목록. 고른 항목이 뷰모델의 SelectedBook 에 들어간다 -->
        <ListBox ItemsSource="{Binding Books}"
                 SelectedItem="{Binding SelectedBook, Mode=TwoWay}">
            <ListBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel Margin="2,4">
                        <TextBlock Text="{Binding Title}" FontSize="14" FontWeight="Bold"/>
                        <TextBlock Text="{Binding Author}" Foreground="Gray"/>
                    </StackPanel>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>

        <!-- 디테일: SelectedBook 의 속성을 보여 주고 고친다 -->
        <StackPanel Grid.Column="1" Margin="15,0,0,0">
            <TextBlock Text="{Binding SelectedBook.Title, FallbackValue='(선택한 책 없음)'}"
                       FontSize="20" FontWeight="Bold" TextWrapping="Wrap"/>
            <TextBlock Text="{Binding SelectedBook.Price, StringFormat={}{0:N0}원}"
                       FontSize="16" Foreground="SteelBlue" Margin="0,2,0,12"/>
            <TextBlock Text="제목"/>
            <TextBox Text="{Binding SelectedBook.Title, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14" Margin="0,2,0,8"/>
            <TextBlock Text="지은이"/>
            <TextBox Text="{Binding SelectedBook.Author, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14" Margin="0,2,0,8"/>
            <TextBlock Text="가격"/>
            <TextBox Text="{Binding SelectedBook.Price, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14" Margin="0,2,0,8"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace MasterDetail
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();   // 화면에 필요한 데이터를 한 객체에 모았다
        }
    }
}
// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace MasterDetail
{
    public class MainViewModel : INotifyPropertyChanged
    {
        public ObservableCollection<Book> Books { get; } = new ObservableCollection<Book>
        {
            new Book { Title = "어린 왕자", Author = "생텍쥐페리", Price = 9800 },
            new Book { Title = "해리 포터", Author = "J.K. 롤링", Price = 12000 },
            new Book { Title = "데미안", Author = "헤르만 헤세", Price = 8500 }
        };

        private Book? selectedBook;
        public Book? SelectedBook
        {
            get { return selectedBook; }
            set { selectedBook = value; OnPropertyChanged(); }   // 상세 화면에 "바뀌었다" 알림
        }

        public MainViewModel()
        {
            SelectedBook = Books[0];   // 처음에는 첫 번째 책을 골라 둔다
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
// ===== File: Book.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace MasterDetail
{
    // 항목 클래스도 INotifyPropertyChanged → 상세에서 고치면 왼쪽 목록도 바로 바뀐다
    public class Book : INotifyPropertyChanged
    {
        private string title = "";
        private string author = "";
        private int price;

        public string Title { get { return title; } set { title = value; OnPropertyChanged(); } }
        public string Author { get { return author; } set { author = value; OnPropertyChanged(); } }
        public int Price { get { return price; } set { price = value; OnPropertyChanged(); } }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const EX_GRIDVIEW = `// ===== File: MainWindow.xaml =====
<Window x:Class="GridViewDemo.MainWindow"
        ${NS}
        Title="ListView + GridView" Width="420" Height="320">
    <DockPanel Margin="12">
        <Button DockPanel.Dock="Bottom" Content="모두 영어 +5점 (최대 100)" Height="30"
                Margin="0,8,0,0" Click="BtnBonus_Click"/>
        <ListView ItemsSource="{Binding Students}">
            <ListView.View>
                <GridView>
                    <!-- 열마다 DisplayMemberBinding 으로 보여 줄 속성을 정한다 -->
                    <GridViewColumn Header="이름" Width="100" DisplayMemberBinding="{Binding Name}"/>
                    <GridViewColumn Header="국어" Width="70" DisplayMemberBinding="{Binding Korean}"/>
                    <GridViewColumn Header="영어" Width="70" DisplayMemberBinding="{Binding English}"/>
                    <GridViewColumn Header="평균" Width="80"
                                    DisplayMemberBinding="{Binding Average, StringFormat=F1}"/>
                </GridView>
            </ListView.View>
        </ListView>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.ObjectModel;
using System.Windows;

namespace GridViewDemo
{
    public partial class MainWindow : Window
    {
        public ObservableCollection<Student> Students { get; } = new ObservableCollection<Student>
        {
            new Student { Name = "김민수", Korean = 85, English = 78 },
            new Student { Name = "이서연", Korean = 92, English = 97 },
            new Student { Name = "박지훈", Korean = 70, English = 64 },
            new Student { Name = "최유나", Korean = 88, English = 91 }
        };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void BtnBonus_Click(object sender, RoutedEventArgs e)
        {
            // 항목의 속성만 바꾼다 → Student 가 알림을 보내므로 표가 바로 갱신된다
            foreach (Student s in Students)
            {
                s.English = Math.Min(100, s.English + 5);
            }
        }
    }
}
// ===== File: Student.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace GridViewDemo
{
    public class Student : INotifyPropertyChanged
    {
        private int english;
        public string Name { get; set; } = "";
        public int Korean { get; set; }

        public int English
        {
            get { return english; }
            set
            {
                english = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(Average));   // 평균도 달라진다
            }
        }

        public double Average => (Korean + English) / 2.0;

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const EX_DATAGRID = `// ===== File: MainWindow.xaml =====
<Window x:Class="DataGridDemo.MainWindow"
        ${NS}
        Title="DataGrid — 자동 열 vs 직접 정의한 열" Width="500" Height="420">
    <Grid Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>

        <TextBlock Text="① AutoGenerateColumns=True — 속성 이름이 그대로 열 제목" FontWeight="Bold"/>
        <DataGrid Grid.Row="1" ItemsSource="{Binding Products}" AutoGenerateColumns="True"
                  IsReadOnly="True" CanUserAddRows="False" Margin="0,4,0,10"/>

        <TextBlock Grid.Row="2" Text="② AutoGenerateColumns=False — 열을 직접 정의" FontWeight="Bold"/>
        <DataGrid Grid.Row="3" ItemsSource="{Binding Products}" AutoGenerateColumns="False"
                  IsReadOnly="True" CanUserAddRows="False" Margin="0,4,0,0">
            <DataGrid.Columns>
                <DataGridTextColumn Header="상품명" Binding="{Binding Name}" Width="*"/>
                <DataGridTextColumn Header="분류" Binding="{Binding Category}" Width="80"/>
                <DataGridTextColumn Header="가격" Binding="{Binding Price, StringFormat={}{0:N0}원}" Width="100"/>
                <DataGridTextColumn Header="재고" Binding="{Binding Stock, StringFormat='{}{0}개'}" Width="70"/>
            </DataGrid.Columns>
        </DataGrid>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace DataGridDemo
{
    public partial class MainWindow : Window
    {
        public ObservableCollection<Product> Products { get; } = new ObservableCollection<Product>
        {
            new Product { Name = "무선 마우스", Category = "주변기기", Price = 25000, Stock = 14 },
            new Product { Name = "기계식 키보드", Category = "주변기기", Price = 89000, Stock = 5 },
            new Product { Name = "27인치 모니터", Category = "모니터", Price = 239000, Stock = 3 },
            new Product { Name = "USB 메모리 64GB", Category = "저장장치", Price = 12000, Stock = 40 }
        };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }
    }
}
// ===== File: Product.cs =====
namespace DataGridDemo
{
    public class Product
    {
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public int Price { get; set; }
        public int Stock { get; set; }
    }
}`;

  const EX_VIEW = `// ===== File: MainWindow.xaml =====
<Window x:Class="CollectionViewDemo.MainWindow"
        ${NS}
        Title="검색(필터)과 정렬 — ICollectionView" Width="500" Height="380">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,8">
            <TextBlock Text="검색:" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <TextBox x:Name="txtSearch" Width="130" FontSize="14"
                     TextChanged="TxtSearch_TextChanged"/>
            <Button Content="이름순" Margin="10,0,0,0" Padding="8,2" Click="BtnSortName_Click"/>
            <Button Content="가격 낮은순" Margin="4,0,0,0" Padding="8,2" Click="BtnSortPriceAsc_Click"/>
            <Button Content="가격 높은순" Margin="4,0,0,0" Padding="8,2" Click="BtnSortPriceDesc_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblCount" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"/>
        <ListView x:Name="lvProducts">
            <ListView.View>
                <GridView>
                    <GridViewColumn Header="상품" Width="170" DisplayMemberBinding="{Binding Name}"/>
                    <GridViewColumn Header="분류" Width="100" DisplayMemberBinding="{Binding Category}"/>
                    <GridViewColumn Header="가격" Width="110"
                                    DisplayMemberBinding="{Binding Price, StringFormat={}{0:N0}원}"/>
                </GridView>
            </ListView.View>
        </ListView>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace CollectionViewDemo
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Product> products = new ObservableCollection<Product>
        {
            new Product { Name = "사과", Category = "과일", Price = 3000 },
            new Product { Name = "바나나", Category = "과일", Price = 4500 },
            new Product { Name = "사과잼", Category = "가공식품", Price = 6000 },
            new Product { Name = "딸기", Category = "과일", Price = 9000 },
            new Product { Name = "풋사과", Category = "과일", Price = 2500 },
            new Product { Name = "딸기우유", Category = "음료", Price = 1800 }
        };

        private readonly ICollectionView view;   // 원본 위에 씌운 "보기"

        public MainWindow()
        {
            InitializeComponent();
            view = CollectionViewSource.GetDefaultView(products);
            view.Filter = FilterProduct;          // 보여 줄지 말지 판단하는 메서드
            lvProducts.ItemsSource = view;        // 원본 대신 보기를 연결
            UpdateCount();
        }

        // 항목마다 불린다: true 면 보이고 false 면 숨긴다
        private bool FilterProduct(object item)
        {
            Product p = (Product)item;
            string keyword = txtSearch.Text.Trim();
            return keyword == "" || p.Name.Contains(keyword);
        }

        private void TxtSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            view.Refresh();   // 조건(검색어)이 바뀌었으니 다시 거른다
            UpdateCount();
        }

        private void SortBy(string propertyName, ListSortDirection direction)
        {
            view.SortDescriptions.Clear();
            view.SortDescriptions.Add(new SortDescription(propertyName, direction));
            view.Refresh();
        }

        private void BtnSortName_Click(object sender, RoutedEventArgs e) { SortBy("Name", ListSortDirection.Ascending); }
        private void BtnSortPriceAsc_Click(object sender, RoutedEventArgs e) { SortBy("Price", ListSortDirection.Ascending); }
        private void BtnSortPriceDesc_Click(object sender, RoutedEventArgs e) { SortBy("Price", ListSortDirection.Descending); }

        private void UpdateCount()
        {
            int shown = view.Cast<object>().Count();   // 보기에 남은 항목 수
            lblCount.Text = $"{shown}개 표시 / 전체 {products.Count}개";
        }
    }
}
// ===== File: Product.cs =====
namespace CollectionViewDemo
{
    public class Product
    {
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public int Price { get; set; }
    }
}`;

  /* ======================= 18-2 실습 코드 ======================= */
  const P3_MODELS = `// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ContactBook
{
    public class MainViewModel : INotifyPropertyChanged
    {
        public ObservableCollection<Contact> Contacts { get; } = new ObservableCollection<Contact>
        {
            new Contact { Name = "김민수", Phone = "010-1234-5678", Email = "minsu@example.com" },
            new Contact { Name = "이서연", Phone = "010-2222-3333", Email = "seoyeon@example.com" },
            new Contact { Name = "박지훈", Phone = "010-4444-5555", Email = "jihoon@example.com" }
        };

        private Contact? selectedContact;
        public Contact? SelectedContact
        {
            get { return selectedContact; }
            set { selectedContact = value; OnPropertyChanged(); }
        }

        public MainViewModel()
        {
            SelectedContact = Contacts[0];
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
// ===== File: Contact.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ContactBook
{
    public class Contact : INotifyPropertyChanged
    {
        private string name = "";
        private string phone = "";
        private string email = "";

        public string Name { get { return name; } set { name = value; OnPropertyChanged(); } }
        public string Phone { get { return phone; } set { phone = value; OnPropertyChanged(); } }
        public string Email { get { return email; } set { email = value; OnPropertyChanged(); } }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const P3_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="ContactBook.MainWindow"
        ${NS}
        Title="연락처" Width="520" Height="340">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="200"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <DockPanel>
            <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" Margin="0,8,0,0">
                <Button Content="추가" Width="95" Height="28" Click="BtnAdd_Click"/>
                <Button Content="삭제" Width="95" Height="28" Margin="10,0,0,0" Click="BtnDelete_Click"/>
            </StackPanel>
            <ListBox ItemsSource="{Binding Contacts}"
                     SelectedItem="{Binding SelectedContact, Mode=TwoWay}">
                <ListBox.ItemTemplate>
                    <DataTemplate>
                        <StackPanel Margin="2,3">
                            <TextBlock Text="{Binding Name}" FontWeight="Bold" FontSize="14"/>
                            <TextBlock Text="{Binding Phone}" Foreground="SteelBlue"/>
                        </StackPanel>
                    </DataTemplate>
                </ListBox.ItemTemplate>
            </ListBox>
        </DockPanel>

        <StackPanel Grid.Column="1" Margin="15,0,0,0">
            <TextBlock Text="{Binding SelectedContact.Name, FallbackValue='(선택 없음)'}"
                       FontSize="20" FontWeight="Bold" Margin="0,0,0,10"/>
            <TextBlock Text="이름"/>
            <TextBox Text="{Binding SelectedContact.Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
            <TextBlock Text="전화"/>
            <TextBox Text="{Binding SelectedContact.Phone, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
            <TextBlock Text="이메일"/>
            <TextBox Text="{Binding SelectedContact.Email, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,8"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ContactBook
{
    public partial class MainWindow : Window
    {
        private MainViewModel vm = new MainViewModel();

        public MainWindow()
        {
            InitializeComponent();
            DataContext = vm;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            Contact c = new Contact { Name = "새 연락처", Phone = "010-", Email = "" };
            vm.Contacts.Add(c);
            vm.SelectedContact = c;   // 새 항목을 골라 두면 바로 오른쪽에서 고칠 수 있다
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (vm.SelectedContact == null) return;
            vm.Contacts.Remove(vm.SelectedContact);
            vm.SelectedContact = vm.Contacts.Count > 0 ? vm.Contacts[0] : null;
        }
    }
}
${P3_MODELS}`;

  const P3_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="ContactBook.MainWindow"
        ${NS}
        Title="연락처" Width="520" Height="340">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="200"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <DockPanel>
            <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" Margin="0,8,0,0">
                <Button Content="추가" Width="95" Height="28" Click="BtnAdd_Click"/>
                <Button Content="삭제" Width="95" Height="28" Margin="10,0,0,0" Click="BtnDelete_Click"/>
            </StackPanel>
            <!-- TODO 1: ItemsSource ← Contacts, SelectedItem ↔ SelectedContact (TwoWay) -->
            <!-- TODO 2: ItemTemplate — 이름(굵게)과 전화번호 두 줄로 표시 -->
            <ListBox/>
        </DockPanel>

        <!-- TODO 3: SelectedContact 의 Name · Phone · Email 을 TwoWay 로 바인딩 -->
        <StackPanel Grid.Column="1" Margin="15,0,0,0">
            <TextBlock Text="이름"/>
            <TextBox Margin="0,2,0,8"/>
            <TextBlock Text="전화"/>
            <TextBox Margin="0,2,0,8"/>
            <TextBlock Text="이메일"/>
            <TextBox Margin="0,2,0,8"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ContactBook
{
    public partial class MainWindow : Window
    {
        private MainViewModel vm = new MainViewModel();

        public MainWindow()
        {
            InitializeComponent();
            DataContext = vm;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 새 Contact 를 만들어 vm.Contacts 에 넣고 SelectedContact 로 고르기
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            // TODO 5: 고른 연락처를 지우고, 남은 첫 항목(없으면 null)을 고르기
        }
    }
}
${P3_MODELS}`;

  const P4_PRODUCT = `// ===== File: Product.cs =====
namespace ProductSearch
{
    public class Product
    {
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public int Price { get; set; }
        public int Stock { get; set; }
    }
}`;

  const P4_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="ProductSearch.MainWindow"
        ${NS}
        Title="상품 검색" Width="500" Height="360">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,8">
            <TextBlock Text="상품명:" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <TextBox x:Name="txtSearch" Width="150" TextChanged="TxtSearch_TextChanged"/>
            <CheckBox x:Name="chkInStock" Content="재고 있는 것만" Margin="14,0,0,0"
                      VerticalAlignment="Center" Click="ChkInStock_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblCount" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"/>
        <DataGrid x:Name="dgProducts" AutoGenerateColumns="False" IsReadOnly="True" CanUserAddRows="False">
            <DataGrid.Columns>
                <DataGridTextColumn Header="상품명" Binding="{Binding Name}" Width="*"/>
                <DataGridTextColumn Header="분류" Binding="{Binding Category}" Width="90"/>
                <DataGridTextColumn Header="가격" Binding="{Binding Price, StringFormat={}{0:N0}원}" Width="100"/>
                <DataGridTextColumn Header="재고" Binding="{Binding Stock}" Width="60"/>
            </DataGrid.Columns>
        </DataGrid>
    </DockPanel>
</Window>`;

  const P4_LIST = `        private readonly ObservableCollection<Product> products = new ObservableCollection<Product>
        {
            new Product { Name = "무선 마우스", Category = "주변기기", Price = 25000, Stock = 14 },
            new Product { Name = "유선 마우스", Category = "주변기기", Price = 9000, Stock = 0 },
            new Product { Name = "기계식 키보드", Category = "주변기기", Price = 89000, Stock = 5 },
            new Product { Name = "무선 키보드", Category = "주변기기", Price = 39000, Stock = 0 },
            new Product { Name = "27인치 모니터", Category = "모니터", Price = 239000, Stock = 3 },
            new Product { Name = "USB 메모리 64GB", Category = "저장장치", Price = 12000, Stock = 40 }
        };`;

  const P4_STARTER = `${P4_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace ProductSearch
{
    public partial class MainWindow : Window
    {
${P4_LIST}

        // TODO 1: ICollectionView 필드 view 선언

        public MainWindow()
        {
            InitializeComponent();
            dgProducts.ItemsSource = products;   // TODO 2: products 대신 view 를 연결하고 Filter 지정
        }

        // TODO 3: 필터 메서드 — 이름에 검색어가 들어 있고, (체크했다면) 재고가 1개 이상

        private void TxtSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            // TODO 4: view.Refresh() 후 개수 표시
        }

        private void ChkInStock_Click(object sender, RoutedEventArgs e)
        {
            // TODO 5: view.Refresh() 후 개수 표시
        }
    }
}
${P4_PRODUCT}`;

  const P4_SOLUTION = `${P4_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace ProductSearch
{
    public partial class MainWindow : Window
    {
${P4_LIST}

        private readonly ICollectionView view;

        public MainWindow()
        {
            InitializeComponent();
            view = CollectionViewSource.GetDefaultView(products);
            view.Filter = FilterProduct;
            dgProducts.ItemsSource = view;
            UpdateCount();
        }

        private bool FilterProduct(object item)
        {
            Product p = (Product)item;
            bool nameOk = p.Name.Contains(txtSearch.Text.Trim());   // 빈 문자열은 항상 포함
            bool stockOk = chkInStock.IsChecked != true || p.Stock > 0;
            return nameOk && stockOk;
        }

        private void TxtSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            view.Refresh();
            UpdateCount();
        }

        private void ChkInStock_Click(object sender, RoutedEventArgs e)
        {
            view.Refresh();
            UpdateCount();
        }

        private void UpdateCount()
        {
            lblCount.Text = $"{view.Cast<object>().Count()}개 표시 / 전체 {products.Count}개";
        }
    }
}
${P4_PRODUCT}`;

  /* ======================= 18-2 슬라이드용 짧은 코드 ======================= */
  const SL_OBS = `// ===== File: MainWindow.xaml =====
<Window x:Class="ObsSlide.MainWindow"
        ${NS}
        Title="ObservableCollection" Width="320" Height="260">
    <DockPanel Margin="10">
        <Button DockPanel.Dock="Top" Content="항목 추가" Click="BtnAdd_Click"/>
        <ListBox ItemsSource="{Binding}" Margin="0,8,0,0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;
namespace ObsSlide
{
    public partial class MainWindow : Window
    {
        private ObservableCollection<string> fruits = new ObservableCollection<string> { "사과", "바나나" };
        public MainWindow()
        {
            InitializeComponent();
            DataContext = fruits;   // 목록 자체를 DataContext 로
        }
        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            fruits.Add("과일 " + (fruits.Count + 1));   // 화면에 바로 나타난다
        }
    }
}`;

  const SL_TEMPLATE = `// ===== File: MainWindow.xaml =====
<Window x:Class="TemplateSlide.MainWindow" Title="DataTemplate" Width="320" Height="240"
        ${NS}>
    <ListBox ItemsSource="{Binding}" Margin="10">
        <ListBox.ItemTemplate>
            <DataTemplate>
                <StackPanel Margin="4">
                    <TextBlock Text="{Binding Name}" FontSize="15" FontWeight="Bold"/>
                    <TextBlock Text="{Binding Phone}" Foreground="SteelBlue"/>
                </StackPanel>
            </DataTemplate>
        </ListBox.ItemTemplate>
    </ListBox>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace TemplateSlide
{
    public class Contact { public string Name { get; set; } = ""; public string Phone { get; set; } = ""; }
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new[] { new Contact { Name = "김민수", Phone = "010-1234-5678" },
                                  new Contact { Name = "이서연", Phone = "010-2222-3333" } };
        }
    }
}`;

  const SL_GRID = `// ===== File: MainWindow.xaml =====
<Window x:Class="DataGridSlide.MainWindow"
        ${NS}
        Title="DataGrid 열 정의" Width="360" Height="220">
    <DataGrid ItemsSource="{Binding}" AutoGenerateColumns="False"
              IsReadOnly="True" CanUserAddRows="False" Margin="10">
        <DataGrid.Columns>
            <DataGridTextColumn Header="상품" Binding="{Binding Name}" Width="*"/>
            <DataGridTextColumn Header="가격" Binding="{Binding Price, StringFormat={}{0:N0}원}" Width="120"/>
        </DataGrid.Columns>
    </DataGrid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
namespace DataGridSlide
{
    public class Product { public string Name { get; set; } = ""; public int Price { get; set; } }
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new List<Product> { new Product { Name = "무선 마우스", Price = 25000 },
                                              new Product { Name = "27인치 모니터", Price = 239000 } };
        }
    }
}`;

  const SL_FILTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="FilterSlide.MainWindow"
        ${NS}
        Title="검색 필터" Width="320" Height="280">
    <DockPanel Margin="10">
        <TextBox x:Name="txtSearch" DockPanel.Dock="Top" FontSize="14"/>
        <ListBox x:Name="lstFruits" Margin="0,8,0,0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Data;
namespace FilterSlide
{
    public partial class MainWindow : Window
    {
        private string[] fruits = { "사과", "바나나", "파인애플", "사과잼", "딸기" };
        public MainWindow()
        {
            InitializeComponent();
            var view = CollectionViewSource.GetDefaultView(fruits);   // 목록 위의 "보기"
            view.Filter = item => ((string)item).Contains(txtSearch.Text);
            lstFruits.ItemsSource = view;
            txtSearch.TextChanged += (s, e) => view.Refresh();       // 입력할 때마다 다시 거르기
        }
    }
}`;

  const INPC_SNIPPET = `<pre><code>public class Person : INotifyPropertyChanged       // ① 인터페이스 구현 선언
{
    private string name = "";
    public string Name
    {
        get { return name; }
        set
        {
            name = value;
            // ② 값이 바뀌었다고 알린다 — 속성 이름을 문자열로 전달
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Name)));
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;   // ③ 인터페이스가 요구하는 이벤트
}</code></pre>`;

  CS_COURSE.addChapter({
    id: 'ch18',
    no: '18',
    title: '데이터 바인딩',
    subtitle: 'Data Binding',
    summary: '화면(컨트롤)과 데이터(객체)를 코드 없이 “연결”하는 데이터 바인딩을 배웁니다. 바인딩의 구성(대상 · Binding · 원본), DataContext 와 상속, 바인딩 모드와 UpdateSourceTrigger, INotifyPropertyChanged 로 화면 자동 갱신, StringFormat 과 값 변환기(IValueConverter)를 익히고, ObservableCollection · DataTemplate · 마스터-디테일 · ListView/GridView · DataGrid · 컬렉션 뷰(필터 · 정렬)로 목록 데이터를 다룹니다.',
    goals: [
      '바인딩의 대상 · 원본 · 경로를 구분하고 {Binding} 식을 읽고 쓸 수 있다',
      'DataContext 를 설정하고 자식 요소가 물려받는 원리를 설명할 수 있다',
      'OneWay · TwoWay · OneTime · OneWayToSource 와 UpdateSourceTrigger 를 구분해 쓸 수 있다',
      'INotifyPropertyChanged 를 구현해 코드에서 바꾼 값이 화면에 자동으로 반영되게 할 수 있다',
      'StringFormat · IValueConverter · FallbackValue 로 표시 형식을 바꿀 수 있다',
      'ObservableCollection 과 DataTemplate 으로 목록을 표시하고 마스터-디테일 화면을 만들 수 있다',
      'ListView(GridView) · DataGrid 와 ICollectionView 필터 · 정렬을 사용할 수 있다'
    ],
    sections: [
      /* ===================== ch18-1 ===================== */
      {
        id: 'ch18-1',
        title: '바인딩의 기초와 INotifyPropertyChanged',
        minutes: 50,
        goals: [
          '코드로 값을 옮겨 적는 방식과 바인딩 방식의 차이를 설명할 수 있다',
          '바인딩의 대상(Target) · 원본(Source) · 경로(Path)를 구분할 수 있다',
          'ElementName 바인딩과 DataContext 바인딩을 쓸 수 있다',
          '바인딩 모드와 UpdateSourceTrigger 를 상황에 맞게 고를 수 있다',
          'INotifyPropertyChanged 를 구현해 값 변경을 화면에 알릴 수 있다',
          'StringFormat 과 IValueConverter 로 표시 형식을 바꿀 수 있다'
        ],
        flow: [['도입: 코드로 옮겨 적기의 불편함', 5], ['바인딩 구성 · ElementName · DataContext', 12], ['INotifyPropertyChanged', 12], ['바인딩 모드 · UpdateSourceTrigger', 8], ['StringFormat · 값 변환기', 8], ['퀴즈 · 실습 안내', 5]],
        content: [
          { type: 'h', text: '바인딩이 필요한 이유' },
          { type: 'p', html: '지금까지는 데이터를 화면에 보여 주려면 <code>txtName.Text = person.Name;</code> 처럼 <b>컨트롤마다 한 줄씩 직접 옮겨 적었습니다</b>. 데이터가 바뀌면 다시 옮겨 적어야 하고, 사용자가 TextBox 에 입력한 값은 반대로 <code>person.Name = txtName.Text;</code> 로 다시 가져와야 합니다. 속성이 10개, 화면이 5개라면 이런 “옮겨 적기” 코드가 수십 줄이 되고, 한 줄만 빠뜨려도 화면과 데이터가 어긋납니다.' },
          { type: 'code', title: '예제 18-1. 바인딩 없이 코드로 화면 맞추기 (비교용)', code: EX_MANUAL, desc: '<code>ShowPerson()</code> 메서드가 데이터를 컨트롤 세 개에 옮겨 적습니다. “나이 +1” 을 누르면 <code>person.Age++</code> 로 데이터를 바꾼 뒤 <b>반드시</b> <code>ShowPerson()</code> 을 다시 불러야 화면이 바뀝니다. <code>BtnOlder_Click</code> 의 <code>ShowPerson();</code> 줄을 지우고 실행해 보세요. 버튼을 눌러도 화면의 나이가 그대로입니다. 이 장에서는 이 “옮겨 적기” 코드를 모두 없애 봅니다.' },
          { type: 'p', html: '<b>데이터 바인딩(data binding)</b> 은 컨트롤의 속성과 데이터 객체의 속성을 <b>선으로 이어 두는 것</b>입니다. 한 번 이어 두면 WPF 가 알아서 값을 옮겨 줍니다. 비유하면 옮겨 적기는 <b>메모지에 베껴 쓰기</b>, 바인딩은 <b>원본을 비추는 거울</b>입니다. 원본이 바뀌면 거울 속 모습도 저절로 바뀝니다.' },
          { type: 'h', text: '바인딩의 구성 요소' },
          { type: 'figure', html: SVG_PARTS, caption: '바인딩 = 대상(Target) 속성 ← Binding 객체 → 원본(Source) 속성' },
          { type: 'table', head: ['구성 요소', '뜻', '예'], rows: [
            ['<b>대상 (Target)</b>', '값을 <b>받아서 보여 주는</b> 컨트롤과 그 속성. 반드시 <b>의존 속성(dependency property)</b> 이어야 한다(Text · Foreground · Visibility 등 대부분의 컨트롤 속성)', '<code>TextBlock</code> 의 <code>Text</code>'],
            ['<b>원본 (Source)</b>', '값을 <b>가진</b> 객체. 평범한 C# 클래스의 속성이면 된다', '<code>Person</code> 객체의 <code>Name</code>'],
            ['<b>경로 (Path)</b>', '원본 객체에서 어떤 속성을 가져올지. 점(<code>.</code>)으로 더 깊이 들어갈 수 있다', '<code>Name</code>, <code>Address.City</code>'],
            ['<b>Binding 객체</b>', '둘을 잇는 설정: 방향(Mode), 서식(StringFormat), 변환기(Converter) …', '<code>{Binding Name, Mode=TwoWay}</code>']
          ], caption: '바인딩의 네 가지 구성 요소' },
          { type: 'p', html: 'XAML 에서는 <code>{Binding …}</code> 마크업 확장으로 바인딩을 만듭니다. <code>{Binding Name}</code> 은 <code>{Binding Path=Name}</code> 을 줄인 것입니다. 원본 객체를 따로 적지 않으면 WPF 는 그 컨트롤의 <b>DataContext</b> 에서 원본을 찾습니다.' },
          { type: 'h', text: '요소 간 바인딩 — ElementName' },
          { type: 'p', html: '원본이 <b>다른 컨트롤</b>이면 <code>ElementName</code> 으로 그 컨트롤의 <code>x:Name</code> 을 적습니다. 14장에서 맛보기로 본 “슬라이더를 움직이면 글자 크기가 바뀌는” 예제가 바로 이것입니다. C# 코드는 한 줄도 필요 없습니다.' },
          { type: 'code', title: '예제 18-2. 요소 간 바인딩 — {Binding ElementName=slider, Path=Value}', code: EX_ELEMENT, run: false, desc: '원본은 <code>slider</code> 의 <code>Value</code>, 대상은 TextBlock 의 <code>Text</code> 와 <code>FontSize</code> 입니다. 슬라이더를 끌면 두 TextBlock 이 함께 바뀝니다. <code>StringFormat=\'글자 크기: {0:F0}\'</code> 는 숫자를 소수점 없이(<code>F0</code>) 문장 안에 넣는 서식입니다(뒤에서 자세히 배웁니다).' },
          { type: 'callout', kind: 'warn', title: '이 예제는 Visual Studio 에서 실행하세요', html: '이 강좌의 브라우저 실행 환경(WPF 호환 라이브러리)은 요소 간 바인딩에서 <b>처음 값만</b> 보여 주고, 슬라이더를 움직여도 따라 바뀌지 않습니다. 그래서 예제 18-2 는 실행 단추 없이 코드만 보여 주며, 이 장의 나머지 예제는 모두 실제 프로그램에서 더 많이 쓰는 <b>DataContext 바인딩</b>으로 만듭니다. 코드를 Visual Studio 에 붙여 넣으면 슬라이더를 따라 글자가 바뀌는 것을 볼 수 있습니다.' },
          { type: 'h', text: 'DataContext 와 상속' },
          { type: 'p', html: '실제 프로그램에서는 컨트롤끼리보다 <b>데이터 객체와 화면</b>을 잇는 일이 훨씬 많습니다. 이때 쓰는 것이 <code>DataContext</code> 속성입니다. <code>DataContext</code> 는 “이 컨트롤이 바인딩할 때 기본으로 쓸 원본 객체” 입니다.' },
          { type: 'list', items: [
            '보통 창의 생성자에서 <code>InitializeComponent();</code> <b>다음에</b> <code>DataContext = 데이터객체;</code> 로 한 번 넣습니다.',
            '<b>상속(inheritance)</b>: 부모 요소에 넣은 <code>DataContext</code> 를 자식 · 손자 요소가 <b>모두 물려받습니다</b>. 창에 한 번만 넣으면 창 안의 모든 컨트롤이 같은 원본을 씁니다.',
            '자식에서 <code>DataContext</code> 를 따로 넣으면 그 아래부터는 새 값이 적용됩니다(가까운 쪽이 이김).',
            '<code>{Binding Address.City}</code> 처럼 점으로 <b>속성의 속성</b>을 따라갈 수 있습니다.'
          ] },
          { type: 'code', title: '예제 18-3. DataContext 와 객체 속성 바인딩', code: EX_DATACONTEXT, desc: '생성자의 <code>DataContext = new Person { … };</code> 한 줄로 창 전체에 원본을 알려 줍니다. <code>StackPanel</code> 안의 TextBlock 들, 그리고 <code>Border</code> 안쪽 <code>StackPanel</code> 의 TextBlock 들도 <b>같은 Person</b> 을 물려받아 씁니다. <code>{Binding Path=Age}</code> 와 <code>{Binding Age}</code> 는 같은 뜻입니다. <code>Address.City</code> 는 Person 의 <code>Address</code> 속성(Address 객체) 안의 <code>City</code> 입니다. 예제 18-1 과 달리 <code>x:Name</code> 도, 옮겨 적는 코드도 없습니다.' },
          { type: 'callout', kind: 'tip', title: '바인딩 경로를 잘못 쓰면?', html: '<code>{Binding Nmae}</code> 처럼 속성 이름을 틀려도 <b>컴파일 오류도, 예외도 나지 않습니다</b>. 화면에 아무것도 안 나올 뿐입니다. 바인딩이 안 될 때는 가장 먼저 ① 속성 이름의 철자 · 대소문자, ② <code>DataContext</code> 를 넣었는지, ③ 속성이 <code>public</code> 이고 <b>필드가 아니라 속성</b>(<code>{ get; set; }</code>)인지 확인하세요.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 바인딩 오류 찾기', html: '<ul><li>디버깅(<kbd>F5</kbd>) 중 <b>출력</b> 창(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>O</kbd>)에 <code>System.Windows.Data Error: 40 : BindingExpression path error: \'Nmae\' property not found on \'object\' \'\'Person\'</code> 같은 줄이 나오면 경로가 틀린 것입니다.</li><li>Visual Studio 2022 는 <b>디버그 → 창 → XAML 바인딩 실패</b> 창에서 실패한 바인딩을 표로 모아 보여 줍니다.</li><li>XAML 편집기에서 <code>d:DataContext="{d:DesignInstance local:Person}"</code> 을 창에 적어 두면 <code>{Binding </code> 을 입력할 때 속성 이름이 <b>자동 완성</b>됩니다(디자이너 전용 · 실행에는 영향 없음).</li></ul>' },
          { type: 'h', text: 'INotifyPropertyChanged — 값이 바뀌었다고 알리기' },
          { type: 'p', html: '예제 18-3 의 Person 에 “나이 +1” 버튼을 달고 <code>person.Age++</code> 를 하면 어떻게 될까요? 객체 안의 값은 18 이 되지만 <b>화면은 17 그대로</b>입니다. 바인딩은 값을 처음 한 번 읽었을 뿐, 그 뒤에 값이 바뀌었는지 알 방법이 없기 때문입니다.' },
          { type: 'p', html: '해결책은 원본 객체가 <b>“내 속성이 바뀌었어요!” 라고 알리는 것</b>입니다. .NET 에는 이를 위한 약속인 <code>INotifyPropertyChanged</code> 인터페이스(<code>System.ComponentModel</code> 네임스페이스)가 있습니다. 이 인터페이스에는 <code>PropertyChanged</code> 이벤트 하나만 있습니다. 바인딩은 원본이 이 인터페이스를 구현했으면 이벤트를 <b>구독</b>해 두었다가, 이벤트가 오면 값을 다시 읽어 화면을 고칩니다(11장의 이벤트 구독과 같은 원리).' },
          { type: 'figure', html: SVG_INPC, caption: 'set 접근자 → PropertyChanged 이벤트 → 바인딩이 새 값을 읽음 → 화면 갱신' },
          { type: 'p', html: '가장 기본 모양은 다음과 같습니다. set 접근자에서 값을 저장한 뒤 <code>PropertyChanged?.Invoke(…)</code> 로 이벤트를 일으키고, <b>바뀐 속성의 이름</b>을 <code>PropertyChangedEventArgs</code> 에 담아 보냅니다. 이름을 문자열 <code>"Name"</code> 으로 쓰면 오타가 나기 쉬우므로 <code>nameof(Name)</code> 을 씁니다.' + INPC_SNIPPET },
          { type: 'p', html: '속성이 많아지면 매번 <code>PropertyChanged?.Invoke(…)</code> 를 쓰기 번거롭습니다. 그래서 보통 <code>OnPropertyChanged()</code> 라는 <b>도우미 메서드</b>를 만들고, 매개변수에 <code>[CallerMemberName]</code> 특성(<code>System.Runtime.CompilerServices</code>)을 붙입니다. 그러면 <code>Name</code> 의 set 안에서 <code>OnPropertyChanged()</code> 라고만 써도 컴파일러가 <code>"Name"</code> 을 자동으로 넣어 줍니다.' },
          { type: 'code', title: '예제 18-4. INotifyPropertyChanged 구현 — 코드에서 바꾸면 화면이 따라온다', code: EX_INPC, desc: '버튼 처리기는 <code>person.Age++;</code> <b>한 줄뿐</b>이고 TextBlock 은 전혀 건드리지 않습니다. 그런데도 화면의 나이가 바뀝니다. <code>Age</code> 의 set 접근자가 <code>OnPropertyChanged()</code> 를 불러 <code>PropertyChanged</code> 이벤트(이름 <code>"Age"</code>)를 일으키고, 이를 구독하던 바인딩이 새 값을 읽기 때문입니다. <code>if (age == value) return;</code> 은 값이 같으면 쓸데없는 알림을 보내지 않게 하는 관례입니다. <code>Person</code> 의 <code>: INotifyPropertyChanged</code> 를 지우고(이벤트 호출 코드도 함께) 실행해 보면 버튼을 눌러도 화면이 바뀌지 않습니다.' },
          { type: 'callout', kind: 'warn', title: 'PropertyChanged 를 빼먹기 쉬운 곳', html: '<ul><li><b>자동 속성</b> <code>public int Age { get; set; }</code> 은 알림을 보내지 않습니다. 알림이 필요한 속성은 필드(<code>age</code>) + 전체 속성으로 써야 합니다.</li><li><b>계산 속성</b> <code>public string Greeting =&gt; $"{Name}님";</code> 은 set 이 없으므로, 재료가 되는 <code>Name</code> 의 set 에서 <code>OnPropertyChanged(nameof(Greeting));</code> 도 함께 불러 줘야 합니다(예제 18-5).</li><li>이름을 잘못 보내면(<code>"age"</code> 처럼 대소문자 틀림) 바인딩은 자기와 상관없는 알림으로 여겨 무시합니다.</li></ul>' },
          { type: 'h', text: '바인딩 모드와 UpdateSourceTrigger' },
          { type: 'p', html: '<b>바인딩 모드(Mode)</b> 는 값이 <b>어느 방향으로</b> 흐를지 정합니다.' },
          { type: 'table', head: ['Mode', '방향', '언제 쓰나', '기본값인 속성'], rows: [
            ['<code>OneWay</code>', '원본 → 대상', '보여 주기만 할 때 (읽기 전용 표시)', '<code>TextBlock.Text</code> 등 대부분'],
            ['<code>TwoWay</code>', '원본 ⇄ 대상', '사용자가 고친 값을 데이터에 되돌려 쓸 때 (입력 폼)', '<code>TextBox.Text</code>, <code>CheckBox.IsChecked</code>, <code>Slider.Value</code>, <code>ListBox.SelectedItem</code>'],
            ['<code>OneTime</code>', '원본 → 대상 (처음 <b>한 번만</b>)', '절대 바뀌지 않는 값 (알림을 구독하지 않아 가볍다)', '—'],
            ['<code>OneWayToSource</code>', '대상 → 원본', '화면 값을 데이터로 보내기만 할 때 (드묾)', '—']
          ], caption: '바인딩 모드 — 적지 않으면 대상 속성의 기본 모드가 쓰인다' },
          { type: 'p', html: 'TwoWay 에서 화면의 값이 <b>언제</b> 원본으로 넘어갈지는 <b>UpdateSourceTrigger</b> 가 정합니다.' },
          { type: 'table', head: ['UpdateSourceTrigger', '원본에 반영되는 때'], rows: [
            ['<code>PropertyChanged</code>', '값이 바뀔 <b>때마다</b> (TextBox 라면 한 글자 칠 때마다)'],
            ['<code>LostFocus</code>', '컨트롤이 <b>포커스를 잃을 때</b> (Tab 키 · 다른 곳 클릭) — <code>TextBox.Text</code> 의 기본값'],
            ['<code>Explicit</code>', '코드에서 <code>GetBindingExpression(…).UpdateSource()</code> 를 부를 때만'],
            ['<code>Default</code>', '대상 속성의 기본값을 따름 (적지 않은 것과 같음)']
          ] },
          { type: 'callout', kind: 'info', title: 'TextBox 는 기본이 LostFocus — 이 강좌에서는 항상 PropertyChanged 를 적습니다', html: '실제 WPF 에서 <code>TextBox.Text</code> 의 TwoWay 바인딩은 기본으로 <b>포커스를 잃을 때</b> 원본을 고칩니다. 입력하는 동안 미리 보기가 따라 바뀌게 하려면 <code>UpdateSourceTrigger=PropertyChanged</code> 를 적어야 합니다. 브라우저 실행 환경은 입력할 때마다 원본을 고치므로, <b>두 환경이 똑같이 동작하도록</b> 이 강좌의 예제는 실시간 반영이 필요한 곳에 <code>UpdateSourceTrigger=PropertyChanged</code> 를 항상 써 둡니다.' },
          { type: 'code', title: '예제 18-5. TwoWay 와 OneWay 비교, UpdateSourceTrigger', code: EX_MODES, desc: '첫 번째 TextBox(TwoWay)에 글자를 입력하면 입력하는 즉시 <code>person.Name</code> 이 바뀌고, 알림을 받은 아래쪽 인사말과 세 번째 TextBox 도 따라 바뀝니다. 세 번째 TextBox(OneWay)는 원본 → 화면으로만 흐르므로 여기서 고친 글자는 원본에 들어가지 않습니다. “원본 객체의 값 확인” 버튼으로 실제 값을 확인해 보세요. 나이 칸에 <code>abc</code> 처럼 숫자가 아닌 글자를 넣으면 <code>int</code> 로 바꿀 수 없어 원본은 그대로입니다(Visual Studio 에서는 TextBox 에 빨간 테두리가 생깁니다). <code>Greeting</code> 은 계산 속성이라 <code>Name</code> · <code>Age</code> 의 set 에서 <code>OnPropertyChanged(nameof(Greeting))</code> 을 함께 불렀습니다.' },
          { type: 'h', text: 'StringFormat — 표시 형식 바꾸기' },
          { type: 'p', html: '원본 값은 그대로 두고 <b>보여 주는 모양</b>만 바꾸려면 <code>StringFormat</code> 을 씁니다. 5장에서 배운 <code>string.Format</code> · 서식 지정자(<code>N0</code>, <code>F1</code>, <code>P0</code>, <code>yyyy-MM-dd</code> …)가 그대로 쓰입니다.' },
          { type: 'table', head: ['쓰는 법', '결과 (39000, 0.15)', '설명'], rows: [
            ['<code>StringFormat={}{0:N0}원</code>', '39,000원', '서식이 <code>{</code> 로 시작하면 앞에 <code>{}</code> 를 붙인다 (마크업 확장과 구분)'],
            ['<code>StringFormat=\'할인율 {0:P0}\'</code>', '할인율 15%', '글자로 시작하거나 공백 · 쉼표가 있으면 작은따옴표로 감싼다'],
            ['<code>StringFormat=N0</code>', '39,000', '서식 지정자만 쓰면 <code>{0:N0}</code> 과 같다'],
            ['<code>TargetNullValue=\'(없음)\'</code>', '(없음)', '원본 값이 <code>null</code> 일 때 대신 보여 줄 값'],
            ['<code>FallbackValue=\'(정보 없음)\'</code>', '(정보 없음)', '바인딩이 값을 <b>가져오지 못할 때</b>(원본이 없음, 경로 중간이 null …) 보여 줄 값']
          ] },
          { type: 'code', title: '예제 18-6. StringFormat · TargetNullValue · FallbackValue', code: EX_FORMAT, desc: '<code>Price</code> 는 int 39000 이지만 화면에는 “39,000원” 으로, <code>DiscountRate</code> 0.15 는 “할인율 15%” 로 보입니다. 날짜는 <code>{0:yyyy년 M월 d일}</code> 로 “2025년 3월 2일” 이 됩니다. <code>Memo</code> 는 <code>null</code> 이라 <code>TargetNullValue</code> 가, <code>Maker</code> 가 <code>null</code> 이라 <code>Maker.Name</code> 경로를 끝까지 따라갈 수 없으므로 <code>FallbackValue</code> 가 보입니다. <code>StringFormat</code> 은 대상이 <b>문자열 속성</b>(<code>TextBlock.Text</code> 등)일 때만 적용됩니다. <code>Button.Content</code> · <code>Label.Content</code> 에는 <code>ContentStringFormat</code> 을 씁니다.' },
          { type: 'h', text: '값 변환기 — IValueConverter' },
          { type: 'p', html: '서식으로는 부족할 때가 있습니다. 예를 들어 <b>점수(숫자)를 색(Brush)으로</b>, <b>true/false 를 보임/숨김(Visibility)으로</b> 바꾸는 것은 StringFormat 으로 할 수 없습니다. 이럴 때 <b>값 변환기(value converter)</b> 를 만듭니다. <code>System.Windows.Data</code> 의 <code>IValueConverter</code> 인터페이스를 구현한 클래스입니다.' },
          { type: 'list', items: [
            '<code>Convert(value, targetType, parameter, culture)</code>: <b>원본 → 대상</b> 방향. <code>value</code> 가 원본 값, 반환값이 화면에 들어갈 값입니다.',
            '<code>ConvertBack(…)</code>: <b>대상 → 원본</b> 방향(TwoWay 일 때만 쓰임). 필요 없으면 <code>throw new NotSupportedException();</code>',
            'XAML 의 <code>Window.Resources</code> 에 <code>&lt;local:ScoreToBrushConverter x:Key="ScoreToBrush"/&gt;</code> 로 객체를 만들고, <code>Converter={StaticResource ScoreToBrush}</code> 로 씁니다. <code>local:</code> 은 <code>xmlns:local="clr-namespace:프로젝트네임스페이스"</code> 로 선언합니다.'
          ] },
          { type: 'code', title: '예제 18-7. 값 변환기 — 점수 → 색, bool → Visibility', code: EX_CONVERTER, desc: '슬라이더(<code>Score</code> 에 TwoWay)를 움직이면 같은 <code>Score</code> 가 세 곳에 쓰입니다. ① <code>StringFormat</code> 으로 “72점”, ② <code>ScoreToBrushConverter</code> 로 글자색(80 이상 초록, 60 이상 주황, 나머지 빨강), ③ <code>IsPassed</code>(60 이상이면 true)를 <code>BoolToVisibilityConverter</code> 로 바꿔 “합격” 배지를 보이거나 숨깁니다. <code>Visibility.Collapsed</code> 는 자리까지 없애고, <code>Hidden</code> 은 자리는 남긴 채 숨깁니다. 60점 아래로 내려 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 기본 제공 변환기 · ConverterParameter · MultiBinding', html: '<ul><li>bool → Visibility 변환기는 WPF 에 <code>BooleanToVisibilityConverter</code> 로 <b>이미 들어 있습니다</b>. <code>&lt;BooleanToVisibilityConverter x:Key="b2v"/&gt;</code> 처럼 <code>local:</code> 없이 바로 쓸 수 있습니다. 예제에서는 원리를 보이려고 직접 만들었습니다.</li><li><code>ConverterParameter=80</code> 을 적으면 <code>Convert</code> 의 <code>parameter</code> 로 문자열 <code>"80"</code> 이 들어옵니다. 기준 점수처럼 변환기에 줄 추가 정보에 씁니다.</li><li>여러 원본 값을 하나로 합치려면 <code>MultiBinding</code> + <code>IMultiValueConverter</code> 를 씁니다(예: 성 + 이름 → 전체 이름).</li></ul>' }
        ],
        practice: [
          {
            title: '실습 18-1. 온도 변환기 (슬라이더 + 값 변환기)',
            level: 2,
            desc: '<p>슬라이더로 섭씨 온도(-20 ~ 40)를 고르면 아래에 <b>섭씨</b>와 <b>화씨</b>가 함께 바뀌는 창을 만드세요.</p><ul><li><code>Temperature</code> 클래스(<code>Celsius</code> 속성, INotifyPropertyChanged 구현 완료)가 DataContext 입니다.</li><li>슬라이더 <code>Value</code> ↔ <code>Celsius</code> (TwoWay)</li><li>“섭씨 20 °C” — <code>StringFormat</code></li><li>“화씨 68.0 °F” — <code>CelsiusToFahrenheitConverter</code> (화씨 = 섭씨 × 9 / 5 + 32) + <code>StringFormat</code></li></ul>',
            hint: '<code>Value="{Binding Celsius, Mode=TwoWay}"</code>, <code>Text="{Binding Celsius, StringFormat=\'섭씨 {0:F0} °C\'}"</code>, <code>Text="{Binding Celsius, Converter={StaticResource CelsiusToFahrenheit}, StringFormat=\'화씨 {0:F1} °F\'}"</code>. 변환기는 <code>(double)value</code> 로 꺼내 계산한 double 을 돌려주면, StringFormat 이 그 결과에 적용됩니다. 도전: 30 °C 이상이면 빨강, 0 °C 이하면 파랑이 되는 두 번째 변환기를 만들어 글자색에 연결해 보세요.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 18-2. 회원 정보 편집 폼 (TwoWay)',
            level: 2,
            desc: '<p>왼쪽 폼에서 회원 정보를 고치면 오른쪽 <b>미리 보기</b>가 입력하는 즉시 바뀌고, “저장” 을 누르면 <b>원본 객체(member)</b> 의 값이 메시지 상자에 나오게 하세요.</p><ul><li><code>Member</code> 에 INotifyPropertyChanged 구현 (<code>Summary</code> 는 계산 속성 — 다른 속성이 바뀔 때 함께 알림)</li><li>TextBox 세 개(이름 · 이메일 · 나이)와 CheckBox(소식지 받기)를 TwoWay 로</li><li>미리 보기: 이름(크게) · “20세” · 이메일 · Summary</li><li>저장 처리기는 컨트롤이 아니라 <code>member</code> 만 읽을 것</li></ul>',
            hint: 'TextBox 는 <code>Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"</code>, CheckBox 는 <code>IsChecked="{Binding IsSubscribed, Mode=TwoWay}"</code>. 나이 표시는 <code>StringFormat={}{0}세</code>. 각 set 에서 <code>OnPropertyChanged(); OnPropertyChanged(nameof(Summary));</code>. 메시지 상자의 줄바꿈은 <code>\\n</code>.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>&lt;TextBlock Text="{Binding Name}"/&gt;</code> 에서 <b>바인딩 대상(Target) 속성</b>은?', options: ['<code>Name</code>', '<code>DataContext</code>', '<code>TextBlock</code> 의 <code>Text</code>', '<code>Binding</code>'], answer: 2, explain: '값을 받아서 보여 주는 쪽(TextBlock.Text)이 대상, 값을 가진 쪽(DataContext 객체의 Name)이 원본입니다.' },
          { q: '창의 생성자에서 <code>DataContext = person;</code> 을 했다. 창 안의 <code>StackPanel</code> → <code>Border</code> → <code>TextBlock</code> 에 있는 <code>{Binding Name}</code> 은 무엇의 Name 을 보여 주나?', options: ['person 의 Name — DataContext 는 자식에게 상속된다', '아무것도 보여 주지 않는다 — TextBlock 에도 DataContext 를 넣어야 한다', 'Border 의 Name 속성', '컴파일 오류가 난다'], answer: 0, explain: '부모에 넣은 DataContext 는 자식 · 손자 요소가 모두 물려받습니다. 그래서 보통 창에 한 번만 넣습니다.' },
          { q: 'Person 클래스가 INotifyPropertyChanged 를 구현하지 않았다. 버튼 처리기에서 <code>person.Age++;</code> 를 하면?', options: ['화면의 나이가 1 늘어난다', '객체의 Age 는 늘지만 화면은 그대로다', '예외가 발생한다', '객체의 Age 도 늘지 않는다'], answer: 1, explain: '값은 바뀌지만 바인딩이 그 사실을 알 수 없어 화면을 다시 그리지 않습니다. PropertyChanged 알림이 필요합니다.' },
          { q: 'TextBox 에 입력하는 <b>한 글자마다</b> 원본 속성이 바뀌게 하려면?', options: ['<code>Mode=OneWay</code>', '<code>Mode=OneTime</code>', '<code>UpdateSourceTrigger=LostFocus</code>', '<code>Mode=TwoWay, UpdateSourceTrigger=PropertyChanged</code>'], answer: 3, explain: '화면 → 원본 방향이 필요하므로 TwoWay, 그리고 TextBox.Text 의 기본 트리거(LostFocus) 대신 PropertyChanged 를 적습니다.' },
          { q: '<code>Price</code> 가 int 12000 일 때 <code>{Binding Price, StringFormat={}{0:N0}원}</code> 이 보여 주는 글자는?', options: ['<code>12000원</code>', '<code>12,000원</code>', '<code>{0:N0}원</code>', '<code>12,000.00원</code>'], answer: 1, explain: '<code>N0</code> 은 천 단위 쉼표 + 소수 0자리입니다. 앞의 <code>{}</code> 는 뒤의 중괄호가 마크업 확장이 아니라는 표시입니다.' }
        ],
        slides: [
          { layout: 'title', title: '바인딩의 기초와 INotifyPropertyChanged', subtitle: 'Chapter 18 · Section 01 — 화면과 데이터를 선으로 잇기', badge: '18-1',
            notes: '<p><b>[도입 2분]</b> “지난 시간까지 TextBox 값을 읽고 TextBlock 에 쓰는 코드를 정말 많이 썼죠? 오늘은 그 코드를 거의 다 지웁니다.”</p><p>오늘 목표: 바인딩의 구성, DataContext, INotifyPropertyChanged, 모드, 서식과 변환기. 이 장은 20장 MVVM 의 기초이므로 특히 INotifyPropertyChanged 를 확실히 잡고 넘어가야 한다고 예고합니다.</p>' },
          { layout: 'two', title: '옮겨 적기 vs 바인딩', left: { title: '코드로 옮겨 적기 (지금까지)', bullets: ['<code>txtName.Text = person.Name;</code>', '데이터가 바뀔 때마다 <b>다시</b> 옮겨 적기', '입력값은 반대로 <code>person.Name = txtName.Text;</code>', '한 줄만 빠져도 화면 ≠ 데이터'] }, right: { title: '데이터 바인딩', bullets: ['<code>Text="{Binding Name}"</code> 한 번 연결', 'WPF 가 값을 <b>자동으로</b> 옮김', 'TwoWay 면 입력값도 자동으로 원본에', '비유: 베껴 쓰기 → <b>거울</b>'] },
            notes: '<p><b>[5분]</b> 예제 18-1 을 실행해 “나이 +1” 이 동작하는 것을 보여 주고, <code>ShowPerson();</code> 줄을 지워서 화면이 안 바뀌는 것을 시연합니다.</p><p>발문: “속성이 20개인 회원 정보 화면이라면 이런 코드가 몇 줄일까?” → 읽기 20줄 + 쓰기 20줄. 바인딩은 이것을 XAML 한 줄씩으로 줄인다.</p>' },
          { layout: 'diagram', title: '바인딩의 구성 — 대상 ← Binding → 원본', html: SVG_PARTS, caption: '대상 = 컨트롤의 의존 속성 · 원본 = 데이터 객체의 속성 · 경로(Path)로 지정',
            notes: '<p><b>[5분]</b> 세 상자를 가리키며 용어를 칠판에 적습니다: <b>대상(Target)</b>, <b>원본(Source)</b>, <b>경로(Path)</b>, <b>모드(Mode)</b>.</p><p>“원본은 어디서 찾을까?” → 따로 안 적으면 DataContext. 다른 컨트롤이 원본이면 ElementName(14장 슬라이더 예제). 브라우저 실행기는 요소 간 바인딩이 처음 값만 보이므로 18-2 는 VS 에서 시연하세요.</p>' },
          { layout: 'code', title: '예제 18-3. DataContext 와 객체 바인딩', code: SL_DC, points: ['생성자에서 <code>DataContext = 객체;</code>', '자식 요소가 DataContext 를 <b>상속</b>', '<code>{Binding Address.City}</code> — 점으로 따라가기', '<code>x:Name</code> · 옮겨 적는 코드 없음'],
            notes: '<p><b>[6분]</b> 실행 후 Person 의 값을 바꿔 다시 실행. <code>{Binding Nmae}</code> 로 일부러 철자를 틀려 보여 주고 “오류도 안 난다, 그냥 빈칸” 이라는 점을 강조합니다.</p><p>VS 에서는 출력 창의 “BindingExpression path error” 와 XAML 바인딩 실패 창을 보여 주세요.</p>' },
          { layout: 'diagram', title: 'INotifyPropertyChanged — “바뀌었어요!” 알림', html: SVG_INPC, caption: 'set 접근자 → OnPropertyChanged() → PropertyChanged 이벤트 → 바인딩이 다시 읽음',
            notes: '<p><b>[5분]</b> 먼저 질문: “DataContext 예제에 나이 +1 버튼을 달면 화면이 바뀔까?” 대부분 바뀐다고 답합니다. 실제로 해 보면 안 바뀝니다.</p><p>이유: 바인딩은 값이 바뀐 것을 “볼” 수 없다 → 원본이 알려 줘야 한다. 11장 이벤트(구독 · 발생)와 연결 지어 설명합니다.</p>' },
          { layout: 'code', title: '예제 18-4. INotifyPropertyChanged 구현', code: SL_INPC, points: ['<code>: INotifyPropertyChanged</code> + <code>PropertyChanged</code> 이벤트', 'set 에서 <code>OnPropertyChanged()</code> 호출', '<code>[CallerMemberName]</code> → 속성 이름 자동', '버튼 처리기는 <code>person.Age++;</code> 뿐'],
            notes: '<p><b>[7분]</b> 이 모양은 앞으로 계속 쓰므로 학생들이 직접 타이핑하게 합니다. <code>nameof(Age)</code> 로 쓰는 방법과 <code>[CallerMemberName]</code> 방법을 비교합니다.</p><p>인터페이스 선언을 지우고 실행 → 화면이 안 바뀜을 확인. “자동 속성 { get; set; } 은 알림을 못 보낸다” 를 꼭 짚어 주세요.</p>' },
          { layout: 'table', title: '바인딩 모드와 UpdateSourceTrigger', head: ['설정', '의미'], rows: [['<code>OneWay</code>', '원본 → 대상 (표시용 · TextBlock 기본)'], ['<code>TwoWay</code>', '원본 ⇄ 대상 (입력 폼 · TextBox 기본)'], ['<code>OneTime</code>', '처음 한 번만 원본 → 대상'], ['<code>OneWayToSource</code>', '대상 → 원본만'], ['<code>UpdateSourceTrigger</code>', 'TwoWay 에서 원본에 쓰는 때: <code>PropertyChanged</code> · <code>LostFocus</code>(TextBox 기본) · <code>Explicit</code>']],
            lead: '값이 흐르는 방향과 시점을 정한다',
            notes: '<p><b>[4분]</b> 화살표를 칠판에 그려 방향을 설명합니다. TextBox 의 기본은 TwoWay + LostFocus 라서 “입력하는 동안에는 원본이 안 바뀐다” 는 점이 자주 헷갈립니다.</p><p>이 강좌 예제는 두 환경이 같게 동작하도록 <code>UpdateSourceTrigger=PropertyChanged</code> 를 항상 적는다고 안내합니다.</p>' },
          { layout: 'code', title: '예제 18-5. TwoWay 바인딩', code: SL_MODES, points: ['TextBox → 원본 → TextBlock', '<code>UpdateSourceTrigger=PropertyChanged</code> 로 실시간', '<code>Mode=OneWay</code> 로 바꿔 비교', '<code>StringFormat=\'안녕하세요, {0}님!\'</code>'],
            notes: '<p><b>[5분]</b> 입력하면 인사말이 즉시 바뀌는 것을 확인. <code>Mode=OneWay</code> 로 바꿔 실행 → 입력해도 인사말이 안 바뀜.</p><p>VS 에서 <code>UpdateSourceTrigger</code> 를 지우고 실행하면 Tab 을 눌러야 바뀌는 것을 보여 주면 확실히 이해합니다. 본문 예제 18-5(OneWay TextBox · 원본 값 확인 버튼)도 함께 보여 주세요.</p>' },
          { layout: 'code', title: '예제 18-7. 값 변환기 (IValueConverter)', code: SL_CONVERTER, points: ['<code>Convert</code>: 원본 → 대상 (점수 → Brush)', '<code>Window.Resources</code> 에 <code>x:Key</code> 로 등록', '<code>Converter={StaticResource …}</code>', '서식은 <code>StringFormat={}{0}점</code>'],
            notes: '<p><b>[6분]</b> DataContext 를 85 → 40 으로 바꿔 실행해 색이 바뀌는 것을 확인합니다. Path 없는 <code>{Binding}</code> 은 DataContext 자체를 뜻한다는 점도 짚습니다.</p><p>본문 예제 18-6(StringFormat · TargetNullValue · FallbackValue)과 18-7(슬라이더 + 합격 배지)을 실행해 보여 주세요. <code>{}</code> 이스케이프와 작은따옴표 규칙이 가장 많이 틀리는 부분입니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Person 이 INotifyPropertyChanged 를 구현하지 않았을 때 <code>person.Age++;</code> 를 하면?', options: ['화면의 나이가 1 늘어난다', '객체의 Age 는 늘지만 화면은 그대로다', '예외가 발생한다', '객체의 Age 도 늘지 않는다'], answer: 1, explain: '바인딩은 알림(PropertyChanged)이 있어야 값을 다시 읽습니다.',
            notes: '<p>답 확인 후 “그럼 Greeting 같은 계산 속성은 어떻게 알릴까?” 를 되물어 <code>OnPropertyChanged(nameof(Greeting))</code> 을 끌어냅니다.</p>' },
          { layout: 'practice', title: '실습 18-1. 온도 변환기', desc: '<p>슬라이더(-20 ~ 40) ↔ <code>Celsius</code> (TwoWay). “섭씨 20 °C” 는 StringFormat, “화씨 68.0 °F” 는 <code>CelsiusToFahrenheitConverter</code> + StringFormat 으로 표시하세요.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[실습]</b> 변환기의 <code>Convert</code> 만 채우면 되는 구조입니다. 빨리 끝난 학생은 온도 → 색 변환기(도전)와 실습 18-2(회원 정보 편집 폼)로.</p><p>흔한 실수: <code>(int)value</code> 로 꺼내 InvalidCastException — Slider 의 값은 double 입니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['바인딩 = 대상(컨트롤 속성) ← Binding → 원본(데이터 속성)', '<code>DataContext</code> 는 자식에게 상속 · 경로는 <code>A.B</code>', '<b>INotifyPropertyChanged</b>: set 에서 <code>OnPropertyChanged()</code>', 'Mode: OneWay · TwoWay · OneTime · OneWayToSource / <code>UpdateSourceTrigger</code>', '<code>StringFormat</code> · <code>IValueConverter</code> · <code>FallbackValue</code>'],
            notes: '<p>학습 목표를 다시 확인합니다. 다음 시간: 한 개가 아닌 <b>목록</b>(컬렉션)을 바인딩 — ObservableCollection, DataTemplate, 마스터-디테일, DataGrid, 검색 필터.</p>' }
        ]
      },

      /* ===================== ch18-2 ===================== */
      {
        id: 'ch18-2',
        title: '컬렉션 바인딩과 데이터 템플릿',
        minutes: 50,
        goals: [
          'ItemsSource 에 List 와 ObservableCollection 을 연결했을 때의 차이를 설명할 수 있다',
          'DisplayMemberPath 와 DataTemplate 으로 항목의 모양을 정할 수 있다',
          'SelectedItem 바인딩으로 마스터-디테일 화면을 만들 수 있다',
          'ListView(GridView) 와 DataGrid 의 열을 바인딩으로 정의할 수 있다',
          'ICollectionView 의 Filter · SortDescriptions 로 검색과 정렬을 구현할 수 있다'
        ],
        flow: [['도입: 목록도 바인딩으로', 4], ['ItemsSource · ObservableCollection', 9], ['DisplayMemberPath · DataTemplate', 9], ['마스터-디테일 · 항목 알림', 10], ['ListView · DataGrid', 8], ['컬렉션 뷰(필터 · 정렬) · 퀴즈', 10]],
        content: [
          { type: 'h', text: '목록을 바인딩하기 — ItemsSource' },
          { type: 'p', html: '앞 교시에서는 객체 <b>하나</b>를 화면에 연결했습니다. 실제 프로그램은 학생 목록, 상품 목록, 연락처 목록처럼 <b>여러 개</b>를 보여 주는 일이 많습니다. 16장에서 <code>ListBox.Items.Add(…)</code> 로 항목을 하나씩 넣었다면, 이제는 <b>목록(컬렉션) 자체를 연결</b>합니다.' },
          { type: 'p', html: 'ListBox · ComboBox · ListView · DataGrid 처럼 여러 항목을 보여 주는 컨트롤은 모두 <code>ItemsControl</code> 을 상속하며, <code>ItemsSource</code> 속성을 가지고 있습니다. 여기에 컬렉션을 넣으면 항목마다 화면 요소가 만들어집니다.' },
          { type: 'figure', html: SVG_ITEMS, caption: 'ItemsSource 에 컬렉션을 연결하면 항목마다 DataTemplate 으로 화면을 만든다' },
          { type: 'h', text: 'List&lt;T&gt; 와 ObservableCollection&lt;T&gt;' },
          { type: 'p', html: '<code>ItemsSource</code> 에는 <code>List&lt;T&gt;</code> 도, 배열도 넣을 수 있습니다. 처음 화면에는 똑같이 보입니다. 차이는 <b>나중에 항목을 추가 · 삭제할 때</b> 나타납니다.' },
          { type: 'table', head: ['', '<code>List&lt;T&gt;</code>', '<code>ObservableCollection&lt;T&gt;</code>'], rows: [
            ['네임스페이스', '<code>System.Collections.Generic</code>', '<code>System.Collections.ObjectModel</code>'],
            ['처음 표시', '된다', '된다'],
            ['<code>Add</code> · <code>Remove</code> 후 화면', '<b>그대로</b> (변경을 알리지 않음)', '<b>자동 반영</b>'],
            ['알리는 방법', '없음', '<code>INotifyCollectionChanged</code> 의 <code>CollectionChanged</code> 이벤트'],
            ['쓰는 곳', '한 번 보여 주고 바뀌지 않는 목록', '추가 · 삭제가 있는 목록 (대부분)']
          ], caption: '객체 하나에는 INotifyPropertyChanged, 목록에는 ObservableCollection' },
          { type: 'p', html: 'List 로 만든 목록에 <code>Add</code> 를 하면 목록 안에는 항목이 늘었지만 ListBox 는 그 사실을 모릅니다(INotifyPropertyChanged 가 없는 객체와 같은 문제). <code>ObservableCollection&lt;T&gt;</code> 은 항목이 추가 · 삭제될 때마다 <code>CollectionChanged</code> 이벤트를 보내므로 바인딩된 컨트롤이 바로 다시 그립니다. 사용법(<code>Add</code>, <code>Remove</code>, <code>Count</code>, 인덱서, <code>foreach</code>)은 List 와 거의 같습니다.' },
          { type: 'code', title: '예제 18-8. ObservableCollection + ItemsSource + DisplayMemberPath', code: EX_OBS, desc: '<code>Students</code> 는 창의 속성이고 <code>DataContext = this;</code> 로 창 자신을 원본으로 삼았습니다. <code>ItemsSource="{Binding Students}"</code> 로 목록을 연결하고, 항목이 <code>Student</code> 객체이므로 <code>DisplayMemberPath="Name"</code> 으로 “이름만 보여 줘” 라고 알려 줍니다(없으면 <code>ObservableDemo.Student</code> 처럼 클래스 이름이 보입니다). 추가 · 삭제 처리기는 <b>컬렉션만</b> 고치고 ListBox 는 건드리지 않습니다. 아래쪽 “학생 3명” 도 <code>Students.Count</code> 에 바인딩되어 있어 자동으로 바뀝니다.' },
          { type: 'callout', kind: 'warn', title: 'ItemsSource 와 Items 는 함께 쓸 수 없다', html: '<code>ItemsSource</code> 를 설정한 컨트롤에 <code>lst.Items.Add(…)</code> 를 하면 <code>InvalidOperationException</code>(ItemsSource 를 사용하는 동안에는 작업이 잘못되었습니다)이 발생합니다. 바인딩을 쓰면 항목 추가 · 삭제는 항상 <b>원본 컬렉션</b>에 하세요.' },
          { type: 'h', text: 'DataTemplate — 항목의 모양 꾸미기' },
          { type: 'p', html: '<code>DisplayMemberPath</code> 는 속성 <b>하나</b>만 글자로 보여 줍니다. 이름 · 전화번호 · 그룹을 함께, 색과 크기를 달리해 보여 주고 싶다면 <b>데이터 템플릿(DataTemplate)</b> 을 씁니다. DataTemplate 은 “항목 하나를 이렇게 그려라” 라는 <b>틀(도장)</b> 입니다. 컨트롤은 항목마다 이 틀로 화면 요소를 찍어 내고, 찍어 낸 요소의 <code>DataContext</code> 에 <b>그 항목</b>을 넣습니다. 그래서 템플릿 안에서는 <code>{Binding Name}</code> 이 “이 항목의 Name” 이 됩니다.' },
          { type: 'code', title: '예제 18-9. DataTemplate 으로 연락처 카드 만들기', code: EX_TEMPLATE, desc: '<code>&lt;ListBox.ItemTemplate&gt;</code> 안의 <code>&lt;DataTemplate&gt;</code> 이 항목 하나의 모양입니다. 동그라미(<code>CornerRadius</code> 를 크기의 절반으로 준 Border) 안에 이름 첫 글자(<code>Initial</code> 계산 속성), 오른쪽에 굵은 이름 · 회색 그룹 · 파란 전화번호를 놓았습니다. <code>HorizontalContentAlignment="Stretch"</code> 는 항목이 ListBox 너비를 가득 채우게 해서 아래쪽 구분선이 끝까지 이어지게 합니다. “연락처 추가” 로 넣은 새 항목도 같은 틀로 그려집니다. <code>DisplayMemberPath</code> 와 <code>ItemTemplate</code> 은 둘 중 하나만 씁니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 데이터 템플릿 다루기', html: '<ul><li>XAML 편집기에서 <code>&lt;ListBox.ItemTemplate&gt;</code> 을 입력하면 닫는 태그가 자동으로 생깁니다. 템플릿 안의 <code>{Binding </code> 뒤에서 <kbd>Ctrl</kbd>+<kbd>Space</kbd> 를 누르면, 창에 <code>d:DataContext</code> 를 지정해 둔 경우 항목 클래스의 속성 목록이 나옵니다.</li><li>실행 중에는 <b>라이브 시각적 트리</b>(디버그 → 창 → 라이브 시각적 트리)에서 ListBoxItem 안에 템플릿으로 만든 Border · StackPanel · TextBlock 이 항목마다 생긴 것을 볼 수 있습니다.</li><li>같은 템플릿을 여러 곳에서 쓰려면 <code>Window.Resources</code> 에 <code>&lt;DataTemplate x:Key="ContactTemplate"&gt;</code> 로 두고 <code>ItemTemplate="{StaticResource ContactTemplate}"</code> 로 씁니다(19장 리소스).</li></ul>' },
          { type: 'h', text: 'SelectedItem 바인딩 — 마스터-디테일' },
          { type: 'p', html: '<b>마스터-디테일(master-detail)</b> 은 왼쪽 목록(마스터)에서 항목을 고르면 오른쪽(디테일)에 그 항목의 자세한 정보가 나오는 화면입니다. 메일 프로그램, 파일 탐색기, 설정 화면이 모두 이 모양입니다. 16장에서는 <code>SelectionChanged</code> 이벤트에서 직접 옮겨 적었지만, 바인딩으로는 이벤트 처리기 없이 만들 수 있습니다.' },
          { type: 'list', ordered: true, items: [
            '화면에 필요한 데이터를 한 클래스(<code>MainViewModel</code>)에 모읍니다: 목록 <code>Books</code> 와 “지금 고른 책” <code>SelectedBook</code>.',
            'ListBox 의 <code>SelectedItem</code> 을 <code>SelectedBook</code> 에 <b>TwoWay</b> 로 바인딩합니다. 사용자가 고르면 SelectedBook 이 바뀝니다.',
            'SelectedBook 의 set 에서 <code>OnPropertyChanged()</code> 로 알립니다.',
            '디테일 쪽은 <code>{Binding SelectedBook.Title}</code> 처럼 <b>SelectedBook 을 거쳐 가는 경로</b>로 바인딩합니다. SelectedBook 이 바뀌면 전부 새 책의 값으로 바뀝니다.'
          ] },
          { type: 'figure', html: SVG_MD, caption: 'ListBox.SelectedItem ⇄ SelectedBook → 디테일의 {Binding SelectedBook.속성}' },
          { type: 'code', title: '예제 18-10. 마스터-디테일 — 도서 목록', code: EX_MASTER, desc: '왼쪽에서 책을 고르면 오른쪽의 제목 · 가격 · 입력 칸이 모두 그 책으로 바뀝니다. 오른쪽 “제목” 칸에서 글자를 고치면 <b>왼쪽 목록의 제목도 입력하는 즉시</b> 바뀝니다. <code>Book</code> 도 INotifyPropertyChanged 를 구현했기 때문입니다. 즉 두 가지 알림이 함께 일합니다. ① <code>MainViewModel.SelectedBook</code> 이 바뀌었다는 알림 → 디테일 전체 갱신, ② <code>Book.Title</code> 이 바뀌었다는 알림 → 목록의 그 항목 템플릿과 위쪽 큰 제목 갱신. 가격 칸을 고치면 “9,800원” 표시도 따라 바뀝니다.' },
          { type: 'callout', kind: 'tip', title: '항목 클래스에도 INotifyPropertyChanged', html: '<code>ObservableCollection</code> 은 <b>항목이 들어오고 나가는 것</b>만 알립니다. 이미 들어 있는 항목의 <b>속성</b>(Title, Price …)이 바뀌는 것은 알리지 않습니다. 항목의 속성을 고칠 수 있는 화면이라면 <b>항목 클래스(Book)도</b> INotifyPropertyChanged 를 구현해야 목록 · 템플릿 · 표가 따라 바뀝니다. “목록 = ObservableCollection, 항목 = INotifyPropertyChanged” 를 짝으로 기억하세요.' },
          { type: 'h', text: 'ListView + GridView — 열이 있는 목록' },
          { type: 'p', html: '<code>ListView</code> 는 ListBox 를 상속한 컨트롤로, <code>View</code> 속성에 <code>GridView</code> 를 넣으면 <b>머리글이 있는 표</b> 모양이 됩니다. 열(<code>GridViewColumn</code>)마다 <code>Header</code>(머리글)와 <code>DisplayMemberBinding</code>(보여 줄 속성의 바인딩)을 적습니다. 바인딩이므로 <code>StringFormat</code> 도 쓸 수 있습니다.' },
          { type: 'code', title: '예제 18-11. ListView + GridView — 성적표', code: EX_GRIDVIEW, desc: '네 열이 각각 <code>Name</code> · <code>Korean</code> · <code>English</code> · <code>Average</code> 에 바인딩되어 있고, 평균은 <code>StringFormat=F1</code> 로 소수 첫째 자리까지 보여 줍니다. 버튼은 학생들의 <code>English</code> 속성만 바꾸는데, <code>Student</code> 가 <code>English</code> 와 <code>Average</code> 의 변경을 알리므로 표의 영어 · 평균 열이 즉시 바뀝니다. 머리글 경계선을 끌어 열 너비를 바꿀 수도 있습니다(Visual Studio 실행 시).' },
          { type: 'h', text: 'DataGrid — 표 전용 컨트롤' },
          { type: 'p', html: '<code>DataGrid</code> 는 엑셀처럼 행과 열로 데이터를 보여 주고 편집 · 정렬까지 지원하는 표 전용 컨트롤입니다. 열을 만드는 방법이 두 가지입니다.' },
          { type: 'table', head: ['방법', '설정', '특징'], rows: [
            ['자동 열 생성', '<code>AutoGenerateColumns="True"</code> (기본값)', '항목 클래스의 <b>public 속성마다</b> 열이 자동으로 생김. 머리글 = 속성 이름(Name, Price …). 빠르게 확인할 때'],
            ['직접 열 정의', '<code>AutoGenerateColumns="False"</code> + <code>&lt;DataGrid.Columns&gt;</code>', '<code>DataGridTextColumn Header="가격" Binding="{Binding Price, StringFormat=…}"</code> 로 <b>머리글 · 순서 · 너비 · 서식</b>을 원하는 대로. 실제 프로그램은 대부분 이 방법'],
          ] },
          { type: 'code', title: '예제 18-12. DataGrid — 자동 열 생성과 직접 정의한 열', code: EX_DATAGRID, desc: '같은 <code>Products</code> 를 두 DataGrid 에 연결했습니다. 위쪽은 속성 이름(Name, Category, Price, Stock)이 그대로 머리글이 되고 숫자도 서식 없이 보입니다. 아래쪽은 열을 직접 정의해 한글 머리글, <code>Width="*"</code>(남는 너비 모두), <code>StringFormat</code>(“25,000원”, “14개”)을 적용했습니다. <code>IsReadOnly="True"</code> 는 편집을 막고, <code>CanUserAddRows="False"</code> 는 맨 아래의 “새 행 추가용 빈 행” 을 없앱니다. Visual Studio 에서 실행하면 머리글을 클릭해 정렬할 수 있습니다.' },
          { type: 'callout', kind: 'info', title: 'DataGrid 의 편집', html: '<code>IsReadOnly</code> 를 빼면 셀을 더블클릭해 값을 고칠 수 있고, 고친 값은 바인딩을 통해 <b>원본 항목의 속성</b>에 들어갑니다(DataGridTextColumn 의 바인딩은 기본이 TwoWay). <code>CanUserAddRows="True"</code> 면 마지막 빈 행에 입력해 <b>새 항목을 추가</b>할 수도 있는데, 이때 항목 클래스에 매개변수 없는 생성자가 있어야 합니다. 이 교시의 예제는 보기 전용으로 만들었습니다.' },
          { type: 'h', text: '컬렉션 뷰 — 검색(필터)과 정렬' },
          { type: 'p', html: '검색어에 맞는 항목만 보여 주거나 가격순으로 정렬하려면 어떻게 할까요? 원본 컬렉션에서 항목을 지웠다가 다시 넣는 것은 위험합니다(검색어를 지우면 되살려야 하니까요). WPF 는 컬렉션 위에 <b>보기(view)</b> 를 한 겹 씌워서, <b>원본은 그대로 두고 “보이는 방식”만</b> 바꿉니다.' },
          { type: 'figure', html: SVG_VIEW, caption: '원본 컬렉션 → ICollectionView(Filter · SortDescriptions) → 화면' },
          { type: 'list', items: [
            '<code>ICollectionView view = CollectionViewSource.GetDefaultView(products);</code> — 컬렉션의 기본 보기를 얻습니다(<code>System.Windows.Data</code>, 인터페이스는 <code>System.ComponentModel</code>). 보기는 <b>필드에 한 번 저장</b>해 두고 계속 씁니다.',
            '<code>view.Filter = 메서드;</code> — <code>bool 메서드(object item)</code>. 항목마다 불려서 <code>true</code> 면 보이고 <code>false</code> 면 숨겨집니다.',
            '<code>view.Refresh();</code> — 검색어처럼 <b>필터 조건이 바뀌면</b> 다시 거르라고 알려 줍니다.',
            '<code>view.SortDescriptions.Add(new SortDescription("Price", ListSortDirection.Ascending));</code> — 속성 이름과 방향으로 정렬합니다. 바꾸기 전에 <code>Clear()</code>.',
            '컨트롤에는 원본 대신 보기를 연결합니다: <code>lvProducts.ItemsSource = view;</code>'
          ] },
          { type: 'code', title: '예제 18-13. ICollectionView — 이름 검색과 정렬', code: EX_VIEW, desc: '검색 칸에 “사과” 를 입력하면 <code>TextChanged</code> → <code>view.Refresh()</code> → 항목마다 <code>FilterProduct</code> 가 불려 이름에 “사과” 가 들어 있는 3개만 남습니다. 정렬 버튼은 <code>SortDescriptions</code> 를 바꿉니다. 필터와 정렬은 함께 적용됩니다(검색한 채로 가격순 정렬). 원본 <code>products</code> 는 한 번도 바뀌지 않으므로 검색어를 지우면 6개가 모두 돌아옵니다. 보기에 남은 개수는 <code>view.Cast&lt;object&gt;().Count()</code>(LINQ)로 셉니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 여러 기준 정렬과 그룹', html: '<ul><li><code>SortDescriptions</code> 에 여러 개를 넣으면 앞의 것이 1순위, 다음이 2순위입니다. 예: 분류(Category) 오름차순 → 같은 분류 안에서 가격(Price) 내림차순.</li><li><code>view.GroupDescriptions.Add(new PropertyGroupDescription("Category"));</code> 로 분류별 그룹을 만들 수도 있습니다(그룹 머리글은 <code>GroupStyle</code> 로 꾸밈).</li><li>XAML 에서 <code>&lt;CollectionViewSource x:Key="cvs" Source="{Binding Products}"/&gt;</code> 를 리소스로 두고 <code>ItemsSource="{Binding Source={StaticResource cvs}}"</code> 로 쓰는 방법도 있습니다.</li><li>20장 MVVM 에서는 검색어를 TextBox 이벤트 대신 뷰모델의 속성(<code>SearchText</code>)에 바인딩하고, 그 set 에서 <code>Refresh()</code> 를 부릅니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 18-3. 연락처 목록 — 마스터-디테일 + 추가/삭제',
            level: 2,
            desc: '<p>왼쪽 목록에서 연락처를 고르면 오른쪽에서 이름 · 전화 · 이메일을 고칠 수 있는 연락처 창을 완성하세요. <code>Contact</code> · <code>MainViewModel</code> 은 완성되어 있습니다.</p><ul><li>ListBox: <code>ItemsSource</code> ← <code>Contacts</code>, <code>SelectedItem</code> ↔ <code>SelectedContact</code> (TwoWay)</li><li>ItemTemplate: 이름(굵게) + 전화번호(파랑) 두 줄</li><li>오른쪽 TextBox 세 개: <code>SelectedContact.Name</code> 등에 TwoWay (입력 즉시 왼쪽 목록도 바뀌어야 함)</li><li>“추가”: 새 연락처를 넣고 그것을 선택 / “삭제”: 고른 연락처를 지우고 남은 첫 항목(없으면 null) 선택</li></ul>',
            hint: '추가: <code>Contact c = new Contact { Name = "새 연락처" }; vm.Contacts.Add(c); vm.SelectedContact = c;</code>. 삭제: <code>if (vm.SelectedContact == null) return;</code> 다음 <code>vm.Contacts.Remove(vm.SelectedContact);</code> 후 <code>vm.SelectedContact = vm.Contacts.Count &gt; 0 ? vm.Contacts[0] : null;</code>. 도전: 오른쪽 위에 <code>{Binding SelectedContact.Name, FallbackValue=\'(선택 없음)\'}</code> 제목을 추가해 보세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 18-4. 상품 DataGrid + 이름 검색 필터',
            level: 2,
            desc: '<p>상품 목록을 DataGrid 로 보여 주고, 위쪽 검색 칸에 입력한 글자가 <b>상품명에 들어 있는</b> 상품만 보이게 하세요. “재고 있는 것만” 을 체크하면 재고가 0 인 상품도 숨깁니다. 아래쪽에는 “3개 표시 / 전체 6개” 처럼 개수를 표시합니다.</p>',
            hint: '<code>view = CollectionViewSource.GetDefaultView(products); view.Filter = FilterProduct; dgProducts.ItemsSource = view;</code>. 필터: <code>p.Name.Contains(txtSearch.Text.Trim())</code> 와 <code>chkInStock.IsChecked != true || p.Stock &gt; 0</code> 을 <code>&amp;&amp;</code> 로. 조건이 바뀌는 두 처리기에서 <code>view.Refresh();</code>. 개수는 <code>view.Cast&lt;object&gt;().Count()</code>. 도전: “가격순” 버튼으로 <code>SortDescriptions</code> 를 추가해 보세요.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>List&lt;Student&gt;</code> 를 ListBox 의 <code>ItemsSource</code> 에 연결한 뒤 버튼에서 <code>students.Add(…)</code> 를 했다. 화면은?', options: ['새 학생이 목록 끝에 나타난다', '예외가 발생한다', '화면은 그대로다 — List 는 변경을 알리지 않는다', '목록이 비워진다'], answer: 2, explain: 'List 는 CollectionChanged 알림이 없습니다. 추가 · 삭제를 화면에 반영하려면 <code>ObservableCollection&lt;T&gt;</code> 을 씁니다.' },
          { q: 'DataTemplate 안의 <code>{Binding Name}</code> 은 무엇의 Name 인가?', options: ['창의 DataContext 의 Name', '템플릿으로 그리는 <b>그 항목</b>의 Name', 'ListBox 의 Name 속성', 'DataTemplate 의 x:Key'], answer: 1, explain: '컨트롤은 항목마다 템플릿으로 요소를 만들고, 그 요소의 DataContext 에 항목을 넣습니다.' },
          { q: '마스터-디테일에서 목록에서 고른 항목을 뷰모델에 전달하는 바인딩으로 알맞은 것은?', options: ['<code>ItemsSource="{Binding SelectedBook}"</code>', '<code>DisplayMemberPath="SelectedBook"</code>', '<code>SelectedItem="{Binding Books}"</code>', '<code>SelectedItem="{Binding SelectedBook, Mode=TwoWay}"</code>'], answer: 3, explain: 'SelectedItem ⇄ SelectedBook 을 TwoWay 로 잇고, 디테일은 <code>{Binding SelectedBook.Title}</code> 처럼 바인딩합니다.' },
          { q: 'ObservableCollection 에 들어 있는 Book 의 <code>Title</code> 을 코드에서 바꿨는데 목록의 글자가 안 바뀐다. 원인은?', options: ['Book 클래스가 INotifyPropertyChanged 를 구현하지 않았다', 'ObservableCollection 대신 List 를 써야 한다', 'DisplayMemberPath 를 지정하지 않았다', 'ItemsSource 를 Mode=TwoWay 로 해야 한다'], answer: 0, explain: 'ObservableCollection 은 항목의 추가 · 삭제만 알립니다. 항목 속성의 변경은 항목 클래스가 PropertyChanged 로 알려야 합니다.' },
          { q: '검색어가 바뀐 뒤 <code>ICollectionView</code> 의 필터를 다시 적용하려면?', options: ['<code>view.Filter = null;</code>', '<code>view.Refresh();</code>', '<code>products.Clear();</code>', '<code>view.SortDescriptions.Clear();</code>'], answer: 1, explain: '필터 메서드는 그대로 두고 <code>Refresh()</code> 로 “조건이 바뀌었으니 다시 걸러라” 라고 알립니다. 원본 컬렉션은 건드리지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '컬렉션 바인딩과 데이터 템플릿', subtitle: 'Chapter 18 · Section 02 — 목록을 바인딩하고 꾸미기', badge: '18-2',
            notes: '<p><b>[도입 2분]</b> “객체 하나는 바인딩했으니, 이제 목록 전체를 바인딩해 봅시다.” 카카오톡 친구 목록, 쇼핑몰 상품 목록, 메일함을 예로 듭니다.</p><p>오늘 목표: ObservableCollection, DataTemplate, 마스터-디테일, ListView/DataGrid, 검색 필터.</p>' },
          { layout: 'bullets', title: 'ItemsSource 와 ObservableCollection', lead: '목록도 “선으로 잇는다” — 추가 · 삭제는 원본 컬렉션에',
            bullets: ['<code>ItemsSource="{Binding Students}"</code> — 목록 전체 연결', ['ListBox · ComboBox · ListView · DataGrid 공통 (ItemsControl)'], '<code>List&lt;T&gt;</code>: 처음엔 보이지만 <b>추가 · 삭제가 반영 안 됨</b>', '<code>ObservableCollection&lt;T&gt;</code>: CollectionChanged 알림 → <b>자동 반영</b>', '<code>DisplayMemberPath="Name"</code> — 항목의 어떤 속성을 보일지', 'ItemsSource 를 쓰면 <code>Items.Add</code> 금지'],
            notes: '<p><b>[5분]</b> “객체 하나 = INotifyPropertyChanged, 목록 = ObservableCollection” 짝을 칠판에 적습니다.</p><p>예제 18-8 을 실행해 추가 · 삭제 · 학생 수가 바뀌는 것을 보여 주고, VS 에서 ObservableCollection 을 List 로 바꿔 실행해 추가가 안 보이는 것을 시연하면 확실합니다.</p>' },
          { layout: 'code', title: 'ObservableCollection — 추가가 바로 보인다', code: SL_OBS, points: ['<code>ItemsSource="{Binding}"</code> — DataContext 자체', '처리기는 <code>fruits.Add(…)</code> 뿐', 'ListBox 를 건드리지 않는다', '<code>List&lt;string&gt;</code> 로 바꾸면?'],
            notes: '<p><b>[4분]</b> Path 없는 <code>{Binding}</code> 은 DataContext 자체라는 점을 다시 짚습니다. 버튼을 여러 번 눌러 항목이 늘어나는 것을 확인합니다.</p>' },
          { layout: 'diagram', title: '항목마다 DataTemplate 을 찍어 낸다', html: SVG_ITEMS, caption: '컬렉션 → ItemsSource → 항목마다 DataTemplate (DataContext = 그 항목)',
            notes: '<p><b>[4분]</b> DataTemplate = 도장. 항목 수만큼 도장을 찍고, 찍힌 카드의 DataContext 가 그 항목이라서 템플릿 안의 <code>{Binding Name}</code> 이 각자의 이름이 됩니다.</p><p>아래쪽 문장(항목 클래스도 INotifyPropertyChanged)은 마스터-디테일에서 다시 나온다고 예고합니다.</p>' },
          { layout: 'code', title: '예제 18-9. DataTemplate', code: SL_TEMPLATE, points: ['<code>&lt;ListBox.ItemTemplate&gt;</code> 안에 <code>&lt;DataTemplate&gt;</code>', '템플릿 안 <code>{Binding}</code> = 그 항목', '여러 속성을 원하는 모양으로', 'DisplayMemberPath 와 둘 중 하나만'],
            notes: '<p><b>[5분]</b> TextBlock 하나를 더 넣어(예: 그룹) 모양이 바뀌는 것을 실습합니다. 본문 예제 18-9(동그라미 첫 글자 카드)를 실행해 보여 주면 학생들이 좋아합니다.</p>' },
          { layout: 'diagram', title: '마스터-디테일 — SelectedItem 바인딩', html: SVG_MD, caption: 'SelectedItem ⇄ SelectedBook (TwoWay) → {Binding SelectedBook.Title}',
            notes: '<p><b>[5분]</b> 16장에서 SelectionChanged 처리기로 옮겨 적던 방식과 비교합니다. 이제는 처리기 없이 경로 바인딩만으로 연결됩니다.</p><p>뷰모델(MainViewModel) = “화면에 필요한 데이터를 모은 클래스” 라고만 소개하고, 자세한 것은 20장 MVVM 에서 배운다고 예고합니다.</p><p><b>[+6분]</b> 본문 예제 18-10(도서 마스터-디테일)을 실행해 오른쪽에서 제목을 고치면 왼쪽 목록도 즉시 바뀌는 것을 보여 줍니다. 두 알림이 함께 일한다: SelectedBook 알림 → 디테일 전체, Book.Title 알림 → 그 항목의 템플릿. 이어서 예제 18-11(ListView + GridView, “영어 +5점”)로 항목 속성만 바꿔도 표가 갱신되는 것을 확인합니다.</p><p>발문: “ObservableCollection 이면 항목 속성 변경도 알려 주지 않나?” → 아니다, 추가 · 삭제만. <b>목록 = ObservableCollection, 항목 = INotifyPropertyChanged</b>.</p>' },
          { layout: 'code', title: '예제 18-12. DataGrid 열 직접 정의', code: SL_GRID, points: ['<code>AutoGenerateColumns="False"</code>', '<code>DataGridTextColumn Header · Binding · Width</code>', '<code>Width="*"</code> 남는 너비 모두', '<code>IsReadOnly</code> · <code>CanUserAddRows="False"</code>'],
            notes: '<p><b>[5분]</b> <code>AutoGenerateColumns="True"</code> 로 바꿔 실행하면 머리글이 영어 속성 이름이 되는 것을 비교합니다(본문 예제 18-12 는 둘을 위아래로 보여 줌).</p><p>VS 에서는 머리글 클릭 정렬, 셀 편집(IsReadOnly 제거)도 시연합니다.</p>' },
          { layout: 'diagram', title: '컬렉션 뷰 — 원본은 그대로, 보기만 바꾼다', html: SVG_VIEW, caption: 'GetDefaultView → Filter · SortDescriptions → Refresh()',
            notes: '<p><b>[3분]</b> 검색할 때 원본에서 지웠다가 다시 넣으면 어떤 문제가 생길지 물어봅니다(검색어를 지우면 복구해야 함, 순서가 뒤섞임). 보기 = 안경 · 필터 렌즈 비유.</p>' },
          { layout: 'code', title: '예제 18-13. 검색 필터 (ICollectionView)', code: SL_FILTER, points: ['<code>CollectionViewSource.GetDefaultView(목록)</code>', '<code>view.Filter = item =&gt; 조건;</code>', '조건이 바뀌면 <code>view.Refresh()</code>', '<code>ItemsSource = view</code> — 원본 대신 보기'],
            notes: '<p><b>[5분]</b> “사과” 를 입력해 거르는 것을 확인. 본문 예제 18-13 으로 정렬(SortDescriptions)과 개수 표시까지 보여 줍니다.</p><p>람다식 <code>item =&gt; …</code> 이 낯선 학생에게는 <code>bool FilterProduct(object item)</code> 메서드로 쓴 본문 예제를 보여 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'ObservableCollection 에 들어 있는 Book 의 Title 을 코드에서 바꿨는데 목록 글자가 안 바뀐다. 원인은?', options: ['Book 이 INotifyPropertyChanged 를 구현하지 않았다', 'List 를 써야 한다', 'DisplayMemberPath 가 없다', 'ItemsSource 를 TwoWay 로 해야 한다'], answer: 0, explain: 'ObservableCollection 은 추가 · 삭제만 알립니다. 항목 속성의 변경은 항목 클래스가 알려야 합니다.',
            notes: '<p>답 확인 후 “그럼 항목을 새로 추가했는데 안 보인다면?” → List 를 썼는지 확인. 두 경우를 짝으로 정리합니다.</p>' },
          { layout: 'practice', title: '실습 18-3. 연락처 마스터-디테일', desc: '<p>ListBox(<code>ItemsSource</code> · <code>SelectedItem</code> TwoWay · ItemTemplate) + 오른쪽 TextBox 세 개(<code>SelectedContact.Name</code> …) + 추가/삭제 버튼을 완성하세요.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[실습]</b> 뷰모델과 Contact 는 완성되어 있으므로 XAML 바인딩과 버튼 두 개에 집중합니다. 빨리 끝난 학생은 실습 18-4(상품 DataGrid 검색)로.</p><p>흔한 실수: SelectedItem 을 ItemsSource 보다 먼저 적거나 Mode 누락, 삭제 후 SelectedContact 를 다시 정하지 않아 오른쪽에 지운 연락처가 남음.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>ItemsSource</code> + <b>ObservableCollection</b> (추가 · 삭제 자동 반영)', '<code>DisplayMemberPath</code> 또는 <b>DataTemplate</b> (DataContext = 항목)', '마스터-디테일: <code>SelectedItem</code> ⇄ <code>SelectedX</code>, <code>{Binding SelectedX.속성}</code>', 'ListView+GridView <code>DisplayMemberBinding</code> · DataGrid 열 정의', '<code>ICollectionView</code>: <code>Filter</code> · <code>SortDescriptions</code> · <code>Refresh()</code>'],
            notes: '<p>학습 목표를 확인합니다. 다음 장(19장): 스타일 · 리소스 · 트리거로 화면을 꾸미기. 20장 MVVM 에서 오늘 만든 MainViewModel 이 본격적으로 쓰입니다.</p>' }
        ]
      }
    ]
  });
})();
