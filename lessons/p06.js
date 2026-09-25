/* Project 06. WPF 주소록 (파일 저장) */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ======================================================================
   * 그림
   * ==================================================================== */

  /* ---------- 그림 1. 화면 설계 ---------- */
  const SVG_SCREEN = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="주소록 화면 설계: 위에 메뉴, 왼쪽에 검색 칸과 연락처 목록, 오른쪽에 상세 입력 폼과 버튼, 아래에 상태 표시줄">
  <defs><marker id="ap6a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="20" width="720" height="520" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="60" y="52" style="font-size:20px;fill:var(--fg)">*contacts.json - 주소록</text>
  <line x1="40" y1="66" x2="760" y2="66" stroke="var(--line)" stroke-width="2"/>
  <rect x="46" y="70" width="708" height="34" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="62" y="94" style="font-size:19px;fill:var(--fg)">파일(<tspan text-decoration="underline">F</tspan>)</text>
  <rect x="46" y="112" width="404" height="370" rx="4" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="60" y="142">검색</text>
    <rect x="104" y="122" width="170" height="30" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="114" y="143" style="fill:var(--muted)">김</text>
    <rect x="286" y="122" width="100" height="30" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="298" y="143">전체 ▾</text>
  </g>
  <rect x="58" y="164" width="380" height="306" fill="none" stroke="var(--line)" stroke-width="2"/>
  <g style="font-size:18px;fill:var(--fg)">
    <rect x="58" y="164" width="380" height="32" fill="var(--line)" opacity="0.35"/>
    <text x="70" y="186" font-weight="700">이름</text><text x="170" y="186" font-weight="700">전화</text><text x="340" y="186" font-weight="700">그룹</text>
    <rect x="60" y="200" width="376" height="30" fill="var(--accent)" opacity="0.22"/>
    <text x="70" y="221">김민준</text><text x="170" y="221">010-1234-5678</text><text x="340" y="221">친구</text>
    <text x="70" y="253">김하늘</text><text x="170" y="253">010-7777-8888</text><text x="340" y="253">가족</text>
    <text x="70" y="285">박지훈</text><text x="170" y="285">02-345-6789</text><text x="340" y="285">회사</text>
  </g>
  <rect x="462" y="112" width="292" height="370" rx="4" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="476" y="142" font-weight="700">연락처 수정</text>
    <text x="476" y="172">이름</text><rect x="476" y="180" width="264" height="28" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/><text x="486" y="200">김민준</text>
    <text x="476" y="232">전화</text><rect x="476" y="240" width="264" height="28" rx="4" fill="none" stroke="var(--danger)" stroke-width="2"/><text x="486" y="260">010-1234</text>
    <text x="476" y="292">이메일 · 그룹</text><rect x="476" y="300" width="264" height="28" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="476" y="354" style="fill:var(--danger)">전화번호 형식이 아닙니다</text>
    <rect x="476" y="372" width="126" height="32" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/><text x="539" y="394" text-anchor="middle">새로 입력</text>
    <rect x="614" y="372" width="126" height="32" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/><text x="677" y="394" text-anchor="middle">추가</text>
    <rect x="476" y="414" width="126" height="32" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/><text x="539" y="436" text-anchor="middle">수정</text>
    <rect x="614" y="414" width="126" height="32" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/><text x="677" y="436" text-anchor="middle">삭제</text>
  </g>
  <rect x="46" y="492" width="708" height="40" rx="4" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <text x="62" y="518" style="font-size:18px;fill:var(--fg)">'김민준' 을(를) 수정했습니다.   │   6명 표시 / 전체 6명</text>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="812" y1="86" x2="762" y2="86" marker-end="url(#ap6a)"/>
    <line x1="812" y1="196" x2="452" y2="196" marker-end="url(#ap6a)"/>
    <line x1="812" y1="300" x2="760" y2="300" marker-end="url(#ap6a)"/>
    <line x1="812" y1="512" x2="762" y2="512" marker-end="url(#ap6a)"/>
  </g>
  <text x="820" y="80" style="font-size:22px;font-weight:700;fill:var(--accent)">① Menu — 파일 열기 · 저장</text>
  <text x="820" y="108" style="font-size:18px;fill:var(--muted)">OpenFileDialog · SaveFileDialog</text>
  <text x="820" y="190" style="font-size:22px;font-weight:700;fill:var(--accent2)">② 검색 + ListView(GridView)</text>
  <text x="820" y="218" style="font-size:18px;fill:var(--muted)">ICollectionView 의 Filter · 정렬</text>
  <text x="820" y="294" style="font-size:22px;font-weight:700;fill:var(--ok)">③ 상세 폼 — 편집용 복사본</text>
  <text x="820" y="322" style="font-size:18px;fill:var(--muted)">바인딩 + 입력 검사(빨간 테두리)</text>
  <text x="820" y="506" style="font-size:22px;font-weight:700;fill:var(--warn)">④ StatusBar — 결과 · 개수</text>
  <text x="820" y="534" style="font-size:18px;fill:var(--muted)">제목의 * = 저장 안 한 변경</text>
</svg>`;

  /* ---------- 그림 2. 데이터 흐름 ---------- */
  const SVG_FLOW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="주소록의 데이터 흐름: 원본 컬렉션, 보기, 목록, 편집용 복사본, 폼, 입력 검사, JSON 파일">
  <defs>
    <marker id="ap6b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker>
    <marker id="ap6c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <rect x="40" y="200" width="250" height="120" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="165" y="244" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">contacts</text>
  <text x="165" y="276" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ObservableCollection</text>
  <text x="165" y="300" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">&lt;Contact&gt; — 원본</text>
  <rect x="390" y="40" width="250" height="110" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="515" y="82" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent2)">view</text>
  <text x="515" y="114" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ICollectionView</text>
  <text x="515" y="136" text-anchor="middle" style="font-size:16px;fill:var(--muted)">Filter · 이름순 정렬</text>
  <rect x="740" y="40" width="220" height="110" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="850" y="90" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">ListView</text>
  <text x="850" y="122" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">SelectedItem</text>
  <rect x="740" y="220" width="220" height="110" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="850" y="266" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">editing</text>
  <text x="850" y="298" text-anchor="middle" style="font-size:17px;fill:var(--muted)">편집용 복사본</text>
  <rect x="1040" y="220" width="200" height="110" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1140" y="266" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--fg)">폼</text>
  <text x="1140" y="298" text-anchor="middle" style="font-size:17px;fill:var(--muted)">TextBox 바인딩</text>
  <rect x="740" y="400" width="220" height="110" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="4"/>
  <text x="850" y="446" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--danger)">입력 검사</text>
  <text x="850" y="478" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ContactValidator</text>
  <rect x="40" y="420" width="250" height="100" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="165" y="462" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">contacts.json</text>
  <text x="165" y="494" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ContactStore</text>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <line x1="230" y1="196" x2="386" y2="112" marker-end="url(#ap6b)"/>
    <line x1="644" y1="95" x2="734" y2="95" marker-end="url(#ap6b)"/>
    <line x1="850" y1="154" x2="850" y2="214" marker-end="url(#ap6b)"/>
    <line x1="964" y1="264" x2="1034" y2="264" marker-end="url(#ap6b)"/>
    <line x1="1034" y1="290" x2="964" y2="290" marker-end="url(#ap6b)"/>
    <line x1="850" y1="334" x2="850" y2="394" marker-end="url(#ap6b)"/>
    <line x1="120" y1="324" x2="120" y2="414" marker-end="url(#ap6b)"/>
    <line x1="210" y1="414" x2="210" y2="324" marker-end="url(#ap6b)"/>
  </g>
  <path d="M736,470 C560,470 420,400 296,300" stroke="var(--ok)" stroke-width="4" fill="none" marker-end="url(#ap6c)"/>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="250" y="140">① 보기를 씌운다</text>
    <text x="866" y="190">② 고르면 Clone()</text>
    <text x="970" y="250">TwoWay</text>
    <text x="866" y="370">③ 추가 · 수정</text>
    <text x="440" y="420" style="fill:var(--ok)">④ 통과하면 원본에 반영</text>
    <text x="440" y="446" style="fill:var(--ok)">Add(Clone()) · CopyFrom()</text>
    <text x="30" y="372">불러오기</text>
    <text x="222" y="372">⑤ 저장</text>
  </g>
</svg>`;

  /* ---------- 그림 3. 직접 바인딩 vs 편집용 복사본 ---------- */
  const SVG_COPY = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="폼을 원본에 직접 바인딩하면 입력 즉시 원본이 바뀌고, 복사본에 바인딩하면 수정 버튼을 누를 때 검사한 뒤 원본에 반영된다">
  <defs>
    <marker id="ap6d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
    <marker id="ap6e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <text x="40" y="48" style="font-size:25px;font-weight:700;fill:var(--danger)">① 직접 바인딩 (단계 2)</text>
  <rect x="40" y="80" width="230" height="100" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="155" y="122" text-anchor="middle" style="font-size:22px;fill:var(--fg)">폼 TextBox</text>
  <text x="155" y="154" text-anchor="middle" style="font-size:18px;fill:var(--muted)">"김" ← 한 글자 입력</text>
  <line x1="276" y1="130" x2="440" y2="130" stroke="var(--danger)" stroke-width="4" marker-end="url(#ap6d)"/>
  <text x="358" y="116" text-anchor="middle" style="font-size:17px;fill:var(--danger)">즉시</text>
  <rect x="448" y="80" width="230" height="100" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="563" y="122" text-anchor="middle" style="font-size:22px;fill:var(--fg)">원본 Contact</text>
  <text x="563" y="154" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Name = "김"</text>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="720" y="104">✗ 빈 이름 · 잘못된 전화도 그대로 들어간다</text>
    <text x="720" y="138">✗ “취소” 할 방법이 없다</text>
    <text x="720" y="172">✗ 저장된 파일과 화면이 언제 달라졌는지 모른다</text>
  </g>
  <line x1="40" y1="222" x2="1240" y2="222" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="40" y="272" style="font-size:25px;font-weight:700;fill:var(--ok)">② 편집용 복사본 (단계 3 ~)</text>
  <rect x="40" y="300" width="230" height="100" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="155" y="342" text-anchor="middle" style="font-size:22px;fill:var(--fg)">폼 TextBox</text>
  <text x="155" y="374" text-anchor="middle" style="font-size:18px;fill:var(--muted)">자유롭게 입력</text>
  <line x1="276" y1="350" x2="340" y2="350" stroke="var(--ok)" stroke-width="4" marker-end="url(#ap6e)"/>
  <rect x="348" y="300" width="210" height="100" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="453" y="342" text-anchor="middle" style="font-size:22px;fill:var(--fg)">editing</text>
  <text x="453" y="374" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">원본.Clone()</text>
  <line x1="564" y1="350" x2="660" y2="350" stroke="var(--ok)" stroke-width="4" marker-end="url(#ap6e)"/>
  <text x="612" y="334" text-anchor="middle" style="font-size:17px;fill:var(--ok)">[수정]</text>
  <rect x="668" y="300" width="200" height="100" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="768" y="342" text-anchor="middle" style="font-size:21px;fill:var(--fg)">입력 검사</text>
  <text x="768" y="374" text-anchor="middle" style="font-size:17px;fill:var(--muted)">실패 → 멈춤</text>
  <line x1="874" y1="350" x2="960" y2="350" stroke="var(--ok)" stroke-width="4" marker-end="url(#ap6e)"/>
  <text x="917" y="334" text-anchor="middle" style="font-size:17px;fill:var(--ok)">통과</text>
  <rect x="968" y="300" width="270" height="100" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="1103" y="342" text-anchor="middle" style="font-size:22px;fill:var(--fg)">원본 Contact</text>
  <text x="1103" y="374" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">CopyFrom(editing)</text>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="40" y="450">✓ 원본은 [수정] 을 누르고 검사를 통과했을 때만 바뀐다</text>
    <text x="40" y="484">✓ 다른 연락처를 고르거나 [새로 입력] 을 누르면 복사본을 버리면 끝 (= 취소)</text>
  </g>
</svg>`;

  /* ---------- 그림 4. JSON 직렬화 ---------- */
  const SVG_JSON = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="객체 목록을 JsonSerializer.Serialize 로 JSON 글자로 바꾸어 파일에 쓰고, 읽을 때는 Deserialize 로 다시 객체로 되돌린다">
  <defs><marker id="ap6f" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="60" width="330" height="330" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="205" y="102" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">메모리 속 객체</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="64" y="150">List&lt;Contact&gt;</text>
    <text x="84" y="188">[0] Name = "김민준"</text>
    <text x="84" y="216">    Phone = "010-…"</text>
    <text x="84" y="254">[1] Name = "이서연"</text>
    <text x="84" y="282">    Phone = "010-…"</text>
    <text x="84" y="330" style="fill:var(--muted)">프로그램이 끝나면 사라짐</text>
  </g>
  <rect x="890" y="60" width="350" height="330" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="1065" y="102" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--warn)">contacts.json (글자)</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="914" y="150">[</text>
    <text x="930" y="178">{</text>
    <text x="950" y="206">"Name": "김민준",</text>
    <text x="950" y="234">"Phone": "010-…",</text>
    <text x="950" y="262">"Group": "친구"</text>
    <text x="930" y="290">},</text>
    <text x="930" y="318">{ … }</text>
    <text x="914" y="346">]</text>
  </g>
  <g stroke="var(--muted)" stroke-width="4">
    <line x1="380" y1="170" x2="880" y2="170" marker-end="url(#ap6f)"/>
    <line x1="880" y1="290" x2="380" y2="290" marker-end="url(#ap6f)"/>
  </g>
  <text x="630" y="150" text-anchor="middle" style="${MONO};font-size:20px;font-weight:700;fill:var(--accent)">JsonSerializer.Serialize(목록)</text>
  <text x="630" y="206" text-anchor="middle" style="font-size:18px;fill:var(--muted)">+ File.WriteAllText — 직렬화(serialize)</text>
  <text x="630" y="270" text-anchor="middle" style="${MONO};font-size:20px;font-weight:700;fill:var(--accent2)">Deserialize&lt;List&lt;Contact&gt;&gt;(글자)</text>
  <text x="630" y="326" text-anchor="middle" style="font-size:18px;fill:var(--muted)">File.ReadAllText + — 역직렬화(deserialize)</text>
  <text x="640" y="446" text-anchor="middle" style="font-size:20px;fill:var(--fg)">public 속성(get; set;) 이 “키: 값” 으로 저장된다 — 메서드 · 이벤트 · static 필드는 저장되지 않는다</text>
</svg>`;

  /* ---------- 그림 5. ICollectionView 필터 ---------- */
  const SVG_FILTER = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="원본 6명 중 필터를 통과한 사람만 보기에 남아 목록에 표시된다">
  <defs><marker id="ap6g" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="40" width="300" height="340" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="190" y="80" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">원본 contacts (6)</text>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="70" y="124">김민준 · 친구</text><text x="70" y="160">이서연 · 가족</text><text x="70" y="196">박지훈 · 회사</text>
    <text x="70" y="232">최수아 · 친구</text><text x="70" y="268">정우진 · 회사</text><text x="70" y="304">김하늘 · 가족</text>
  </g>
  <rect x="440" y="90" width="400" height="240" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="130" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent2)">view.Filter = FilterContact</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="462" y="172">bool FilterContact(object item)</text>
    <text x="462" y="202">  이름·전화에 "김" 이 있나?</text>
    <text x="462" y="232">  &amp;&amp; 그룹이 "전체" 이거나 같은가?</text>
    <text x="462" y="270" style="fill:var(--ok)">  true → 보임</text>
    <text x="462" y="298" style="fill:var(--danger)">  false → 숨김 (지우지 않음)</text>
  </g>
  <rect x="940" y="120" width="300" height="180" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1090" y="160" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">ListView (2)</text>
  <g style="font-size:19px;fill:var(--fg)"><text x="970" y="206">김민준 · 친구</text><text x="970" y="242">김하늘 · 가족</text></g>
  <g stroke="var(--muted)" stroke-width="4">
    <line x1="344" y1="210" x2="434" y2="210" marker-end="url(#ap6g)"/>
    <line x1="844" y1="210" x2="934" y2="210" marker-end="url(#ap6g)"/>
  </g>
  <text x="640" y="400" text-anchor="middle" style="font-size:20px;fill:var(--fg)">검색어 · 그룹이 바뀌면 view.Refresh() → 항목마다 FilterContact 가 다시 불린다</text>
</svg>`;

  /* ======================================================================
   * 공통 코드 조각
   * ==================================================================== */

  const CONTACT_CS = (ns, o = {}) => `// ===== File: Contact.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;
${o.usings || ''}
namespace ${ns}
{
    // 연락처 한 명 — 속성이 바뀌면 화면(바인딩)에 알린다
    public class Contact : INotifyPropertyChanged
    {
        private string name = "";
        private string phone = "";
        private string email = "";
        private string group = "친구";

        public string Name { get { return name; } set { name = value; OnPropertyChanged(); } }
        public string Phone { get { return phone; } set { phone = value; OnPropertyChanged(); } }
        public string Email { get { return email; } set { email = value; OnPropertyChanged(); } }
        public string Group { get { return group; } set { group = value; OnPropertyChanged(); } }
${o.props || ''}
        // 그룹 목록 (콤보 상자에 쓴다) — static 이라 JSON 에는 저장되지 않는다
        public static readonly string[] Groups = { "가족", "친구", "회사", "기타" };

        // 편집용 복사본 만들기
        public Contact Clone()
        {
            Contact copy = new Contact();
            copy.CopyFrom(this);
            return copy;
        }

        // 다른 연락처의 값을 모두 가져오기 (수정 확정)
        public void CopyFrom(Contact other)
        {
            Name = other.Name;
            Phone = other.Phone;
            Email = other.Email;
            Group = other.Group;
${o.copy || ''}        }

        public event PropertyChangedEventHandler? PropertyChanged;

        private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const VALIDATOR_CS = (ns) => `// ===== File: ContactValidator.cs =====
using System.Text.RegularExpressions;

namespace ${ns}
{
    // 입력 검사 규칙을 한곳에 모은 클래스 (화면과 상관없는 순수한 C#)
    public static class ContactValidator
    {
        // 0 으로 시작하는 2~3자리(010, 02, 031 …) - 3~4자리 - 4자리
        private static readonly Regex PhoneRule = new Regex(@"^0\\d{1,2}-\\d{3,4}-\\d{4}$");
        // 아주 간단한 이메일 규칙: 글자@글자.글자 (공백 · @ 중복 없음)
        private static readonly Regex EmailRule = new Regex(@"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

        public static bool IsValidName(string name) => name.Trim().Length > 0;
        public static bool IsValidPhone(string phone) => PhoneRule.IsMatch(phone.Trim());
        // 이메일은 비워 두어도 된다
        public static bool IsValidEmail(string email) => email.Trim() == "" || EmailRule.IsMatch(email.Trim());

        // 문제가 없으면 "", 있으면 첫 번째 문제를 알려 주는 문장
        public static string Check(Contact c)
        {
            if (!IsValidName(c.Name)) return "이름을 입력하세요.";
            if (!IsValidPhone(c.Phone)) return "전화번호는 010-1234-5678 처럼 - 를 넣어 입력하세요.";
            if (!IsValidEmail(c.Email)) return "이메일 형식이 올바르지 않습니다. (예: hong@example.com)";
            return "";
        }
    }
}`;

  const STORE_CS = (ns, extra = '') => `// ===== File: ContactStore.cs =====
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace ${ns}
{
    // 주소록 ⇄ JSON 파일 (파일 다루는 코드는 모두 여기에)
    public static class ContactStore
    {
        private static readonly JsonSerializerOptions Options = new JsonSerializerOptions { WriteIndented = true };

        public static void Save(string path, IEnumerable<Contact> contacts)
        {
            string json = JsonSerializer.Serialize(contacts, Options);   // 객체 → JSON 글자
            File.WriteAllText(path, json);
        }

        public static List<Contact> Load(string path)
        {
            string json = File.ReadAllText(path);
            // JSON 글자 → 객체. 내용이 "null" 이면 null 이 오므로 빈 목록으로 바꾼다
            return JsonSerializer.Deserialize<List<Contact>>(json) ?? new List<Contact>();
        }
${extra}    }
}`;

  // 예시 연락처 (MainWindow 안의 메서드)
  const SAMPLES = `        private void AddSamples()
        {
            contacts.Add(new Contact { Name = "김민준", Phone = "010-1234-5678", Email = "minjun@example.com", Group = "친구" });
            contacts.Add(new Contact { Name = "이서연", Phone = "010-2345-6789", Email = "seoyeon@example.com", Group = "가족" });
            contacts.Add(new Contact { Name = "박지훈", Phone = "02-345-6789", Email = "jihun@company.co.kr", Group = "회사" });
            contacts.Add(new Contact { Name = "최수아", Phone = "010-8765-4321", Group = "친구" });
            contacts.Add(new Contact { Name = "정우진", Phone = "031-987-6543", Email = "woojin@company.co.kr", Group = "회사" });
            contacts.Add(new Contact { Name = "김하늘", Phone = "010-7777-8888", Email = "sky@example.com", Group = "가족" });
        }`;

  // 목록 (GridView) — 여러 단계가 같이 쓴다
  const LIST_XAML = (extraCols = '') => `            <ListView x:Name="lvContacts" SelectionChanged="LvContacts_SelectionChanged">
                <ListView.View>
                    <GridView>
${extraCols}                        <GridViewColumn Header="이름" Width="70" DisplayMemberBinding="{Binding Name}"/>
                        <GridViewColumn Header="전화" Width="120" DisplayMemberBinding="{Binding Phone}"/>
                        <GridViewColumn Header="그룹" Width="60" DisplayMemberBinding="{Binding Group}"/>
                    </GridView>
                </ListView.View>
            </ListView>`;

  // 상세 폼의 입력 칸 (편집용 복사본에 바인딩)
  const FORM_FIELDS = (extra = '') => `            <TextBlock Text="이름"/>
            <TextBox x:Name="txtName" Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,6"/>
            <TextBlock Text="전화 (예: 010-1234-5678)"/>
            <TextBox x:Name="txtPhone" Text="{Binding Phone, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,6"/>
            <TextBlock Text="이메일"/>
            <TextBox x:Name="txtEmail" Text="{Binding Email, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,6"/>
            <TextBlock Text="그룹"/>
            <ComboBox x:Name="cboGroup" SelectedItem="{Binding Group, Mode=TwoWay}" Margin="0,2,0,6"/>
${extra}`;

  const BUTTONS_XAML = `                <UniformGrid Columns="2">
                    <Button Content="새로 입력" Height="28" Margin="0,0,4,4" Click="BtnNew_Click"/>
                    <Button Content="추가" Height="28" Margin="4,0,0,4" Click="BtnAdd_Click"/>
                    <Button Content="수정" Height="28" Margin="0,4,4,0" Click="BtnUpdate_Click"/>
                    <Button Content="삭제" Height="28" Margin="4,4,0,0" Click="BtnDelete_Click"/>
                </UniformGrid>`;

  /* ======================================================================
   * p06-1 준비 예제
   * ==================================================================== */

  const EX_JSON = `using System;
using System.Collections.Generic;
using System.Text.Json;   // JsonSerializer

class Contact
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Group { get; set; } = "친구";
}

class Program
{
    static void Main()
    {
        List<Contact> list = new List<Contact>
        {
            new Contact { Name = "김민준", Phone = "010-1234-5678", Email = "minjun@example.com" },
            new Contact { Name = "Lee", Phone = "02-345-6789", Group = "회사" }
        };

        // ① 객체 → JSON 글자 (들여쓰기해서 보기 좋게)
        var options = new JsonSerializerOptions { WriteIndented = true };
        string json = JsonSerializer.Serialize(list, options);
        Console.WriteLine(json);

        // ② JSON 글자 → 객체 (어떤 형식으로 되돌릴지 <List<Contact>> 로 알려 준다)
        List<Contact>? back = JsonSerializer.Deserialize<List<Contact>>(json);
        if (back == null) return;
        Console.WriteLine($"되돌린 연락처 {back.Count}명");
        foreach (Contact c in back)
            Console.WriteLine($"- {c.Name} / {c.Phone} / {c.Group}");
    }
}`;

  const EX_REGEX = `using System;
using System.Text.RegularExpressions;   // Regex

class Program
{
    // ^ 처음  0  \\d{1,2} 숫자 1~2개  -  \\d{3,4} 숫자 3~4개  -  \\d{4} 숫자 4개  $ 끝
    static readonly Regex PhoneRule = new Regex(@"^0\\d{1,2}-\\d{3,4}-\\d{4}$");
    static readonly Regex EmailRule = new Regex(@"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    static void Main()
    {
        string[] phones = { "010-1234-5678", "02-345-6789", "031-987-6543", "01012345678", "010-12-5678", "010-1234-56789" };
        foreach (string p in phones)
            Console.WriteLine($"[{p}] 전화 → {(PhoneRule.IsMatch(p) ? "올바름" : "형식 오류")}");

        string[] emails = { "hong@example.com", "hong@example", "hong example@a.com", "@example.com" };
        foreach (string m in emails)
            Console.WriteLine($"[{m}] 이메일 → {(EmailRule.IsMatch(m) ? "올바름" : "형식 오류")}");

        string name = "   ";
        Console.WriteLine($"이름 '{name}' → {(name.Trim().Length > 0 ? "올바름" : "비어 있음")}");
    }
}`;

  const EX_STEP1 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step1.MainWindow"
        ${NS}
        Title="주소록 — 단계 1. 화면 틀" Width="560" Height="440">
    <Grid Margin="8">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="300"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <!-- 왼쪽: 검색 + 목록 -->
        <DockPanel>
            <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,6">
                <TextBlock Text="검색" VerticalAlignment="Center" Margin="0,0,6,0"/>
                <TextBox x:Name="txtSearch" Width="120"/>
                <ComboBox x:Name="cboFilter" Width="80" Margin="6,0,0,0"/>
            </StackPanel>
${LIST_XAML().replace(' SelectionChanged="LvContacts_SelectionChanged"', '')}
        </DockPanel>

        <!-- 오른쪽: 상세 폼 -->
        <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
            <TextBlock Text="연락처 수정" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
            <TextBlock Text="이름"/>
            <TextBox Margin="0,2,0,6"/>
            <TextBlock Text="전화 (예: 010-1234-5678)"/>
            <TextBox Margin="0,2,0,6"/>
            <TextBlock Text="이메일"/>
            <TextBox Margin="0,2,0,6"/>
            <TextBlock Text="그룹"/>
            <ComboBox x:Name="cboGroup" Margin="0,2,0,6"/>
            <TextBlock Text="(검사 결과가 여기에 빨간 글씨로)" Foreground="Crimson" Margin="0,2,0,6"/>
            <UniformGrid Columns="2">
                <Button Content="새로 입력" Height="28" Margin="0,0,4,4"/>
                <Button Content="추가" Height="28" Margin="4,0,0,4"/>
                <Button Content="수정" Height="28" Margin="0,4,4,0"/>
                <Button Content="삭제" Height="28" Margin="4,4,0,0"/>
            </UniformGrid>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace P06Step1
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;          // 목록에 연결 (열은 GridView 가 정한다)
            cboGroup.ItemsSource = Contact.Groups;
            cboFilter.ItemsSource = new string[] { "전체", "가족", "친구", "회사", "기타" };
            cboFilter.SelectedIndex = 0;
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Step1')}`;

  /* ---------- p06-1 실습 ---------- */
  const P1_STARTER = `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

class Friend
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
}

class Program
{
    static void Main()
    {
        List<Friend> friends = new List<Friend>
        {
            new Friend { Name = "미나", Phone = "010-1111-2222" },
            new Friend { Name = "준호", Phone = "010-3333-4444" }
        };

        // TODO 1: friends 를 들여쓰기(WriteIndented)한 JSON 글자로 바꾸어 friends.json 에 저장하고
        //         "저장했습니다: friends.json" 출력

        // TODO 2: friends.json 을 다시 읽어 List<Friend> 로 되돌리기 (null 이면 빈 목록)

        // TODO 3: "읽은 친구 수: 2" 와 각 친구를 "- 미나 (010-1111-2222)" 형식으로 출력
    }
}`;

  const P1_SOLUTION = `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

class Friend
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
}

class Program
{
    static void Main()
    {
        List<Friend> friends = new List<Friend>
        {
            new Friend { Name = "미나", Phone = "010-1111-2222" },
            new Friend { Name = "준호", Phone = "010-3333-4444" }
        };

        // 1) 저장: 객체 → JSON 글자 → 파일
        var options = new JsonSerializerOptions { WriteIndented = true };
        string json = JsonSerializer.Serialize(friends, options);
        File.WriteAllText("friends.json", json);
        Console.WriteLine("저장했습니다: friends.json");

        // 2) 읽기: 파일 → JSON 글자 → 객체
        string text = File.ReadAllText("friends.json");
        List<Friend> loaded = JsonSerializer.Deserialize<List<Friend>>(text) ?? new List<Friend>();

        // 3) 출력
        Console.WriteLine($"읽은 친구 수: {loaded.Count}");
        foreach (Friend f in loaded)
            Console.WriteLine($"- {f.Name} ({f.Phone})");
    }
}`;

  const P2_STARTER = `using System;
using System.Text.RegularExpressions;

class Program
{
    // TODO 1: 전화번호 규칙 — 0 으로 시작 2~3자리 - 3~4자리 - 4자리 (예: 010-1234-5678, 02-345-6789)
    static bool IsValidPhone(string phone)
    {
        return false;
    }

    // TODO 2: 하이픈 없이 쓴 휴대폰 번호 11자리(01012345678)를 010-1234-5678 로 바꾸기
    //         숫자 11자리가 아니면 받은 글자를 그대로 돌려준다
    static string NormalizePhone(string phone)
    {
        return phone;
    }

    static void Main()
    {
        string[] inputs = { "010-1234-5678", "01098765432", "02-345-6789", "010-12-3456", "0101234" };
        foreach (string s in inputs)
        {
            string fixedPhone = NormalizePhone(s.Trim());
            Console.WriteLine($"{s} → {fixedPhone} : {(IsValidPhone(fixedPhone) ? "통과" : "형식 오류")}");
        }
    }
}`;

  const P2_SOLUTION = `using System;
using System.Text.RegularExpressions;

class Program
{
    static readonly Regex PhoneRule = new Regex(@"^0\\d{1,2}-\\d{3,4}-\\d{4}$");
    static readonly Regex ElevenDigits = new Regex(@"^\\d{11}$");

    static bool IsValidPhone(string phone)
    {
        return PhoneRule.IsMatch(phone);
    }

    static string NormalizePhone(string phone)
    {
        if (!ElevenDigits.IsMatch(phone)) return phone;          // 숫자 11자리가 아니면 그대로
        // 010 1234 5678 → 앞 3 · 가운데 4 · 뒤 4
        return $"{phone.Substring(0, 3)}-{phone.Substring(3, 4)}-{phone.Substring(7, 4)}";
    }

    static void Main()
    {
        string[] inputs = { "010-1234-5678", "01098765432", "02-345-6789", "010-12-3456", "0101234" };
        foreach (string s in inputs)
        {
            string fixedPhone = NormalizePhone(s.Trim());
            Console.WriteLine($"{s} → {fixedPhone} : {(IsValidPhone(fixedPhone) ? "통과" : "형식 오류")}");
        }
    }
}`;

  /* ---------- p06-1 슬라이드 코드 ---------- */
  const SL_JSON = `using System;
using System.Collections.Generic;
using System.Text.Json;

class Contact
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
}

class Program
{
    static void Main()
    {
        var list = new List<Contact> { new Contact { Name = "Kim", Phone = "010-1234-5678" } };
        string json = JsonSerializer.Serialize(list);          // 객체 → 글자
        Console.WriteLine(json);
        var back = JsonSerializer.Deserialize<List<Contact>>(json);   // 글자 → 객체
        Console.WriteLine($"{back![0].Name} / {back[0].Phone}");
    }
}`;

  const SL_REGEX = `using System;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        Regex phone = new Regex(@"^0\\d{1,2}-\\d{3,4}-\\d{4}$");
        foreach (string s in new[] { "010-1234-5678", "02-345-6789", "01012345678" })
            Console.WriteLine($"{s} : {phone.IsMatch(s)}");
    }
}`;

  /* ======================================================================
   * p06-2 단계 2 ~ 4
   * ==================================================================== */

  const EX_STEP2 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step2.MainWindow"
        ${NS}
        Title="주소록 — 단계 2. 목록과 상세 폼" Width="560" Height="440">
    <Grid Margin="8">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="300"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <DockPanel>
            <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray" TextWrapping="Wrap"/>
${LIST_XAML()}
        </DockPanel>

        <!-- 폼의 DataContext = 목록에서 고른 항목(SelectedItem) — 원본에 "직접" 연결 -->
        <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0"
                    DataContext="{Binding ElementName=lvContacts, Path=SelectedItem}">
            <TextBlock Text="연락처 수정" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
${FORM_FIELDS()}            <TextBlock Text="※ 입력하는 즉시 왼쪽 목록이 바뀝니다" Foreground="Gray" TextWrapping="Wrap"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;

namespace P06Step2
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;
            cboGroup.ItemsSource = Contact.Groups;
            lvContacts.SelectedIndex = 0;       // 첫 연락처를 골라 둔다 → 폼에 바로 나타남
        }

        private void LvContacts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lvContacts.SelectedItem is Contact c)
                lblInfo.Text = $"{lvContacts.SelectedIndex + 1}번째 · {c.Name} 을(를) 골랐습니다.";
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Step2')}`;

  const EX_STEP3 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step3.MainWindow"
        ${NS}
        Title="주소록 — 단계 3. 추가 · 수정 · 삭제" Width="560" Height="440">
    <Grid Margin="8">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="300"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <DockPanel>
            <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray" TextWrapping="Wrap"/>
${LIST_XAML()}
        </DockPanel>

        <!-- 폼의 DataContext 는 코드에서 "편집용 복사본" 으로 정한다 -->
        <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
            <TextBlock x:Name="lblFormTitle" Text="새 연락처" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
${FORM_FIELDS()}${BUTTONS_XAML.replace(/^ {4}/gm, '')}
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;

namespace P06Step3
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private Contact? source;                    // 폼에서 고치고 있는 원본 (null = 새 연락처)
        private Contact editing = new Contact();    // 폼에 연결된 편집용 복사본

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;
            cboGroup.ItemsSource = Contact.Groups;
            StartEdit(null);
            lvContacts.SelectedIndex = 0;
        }

        // 다른 연락처를 고르면 그 연락처의 "복사본" 을 폼에 연결한다
        private void LvContacts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lvContacts.SelectedItem is Contact picked && picked != source)
                StartEdit(picked);
        }

        private void StartEdit(Contact? original)
        {
            source = original;
            editing = original == null ? new Contact() : original.Clone();
            form.DataContext = editing;             // 폼 ↔ 복사본 (원본은 그대로)
            lblFormTitle.Text = original == null ? "새 연락처" : "연락처 수정";
        }

        private void BtnNew_Click(object sender, RoutedEventArgs e)
        {
            lvContacts.SelectedItem = null;
            StartEdit(null);
            txtName.Focus();
            lblInfo.Text = "새 연락처를 입력하고 [추가] 를 누르세요.";
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            Contact added = editing.Clone();        // 복사본을 한 번 더 복사해서 목록에 넣는다
            contacts.Add(added);
            StartEdit(added);
            lvContacts.SelectedItem = added;
            lblInfo.Text = $"'{added.Name}' 을(를) 추가했습니다. (모두 {contacts.Count}명)";
        }

        private void BtnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblInfo.Text = "목록에서 고칠 연락처를 먼저 고르세요."; return; }
            source.CopyFrom(editing);               // 이때 비로소 원본이 바뀐다 → 목록도 바뀜
            lblInfo.Text = $"'{source.Name}' 을(를) 수정했습니다.";
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblInfo.Text = "삭제할 연락처를 목록에서 고르세요."; return; }

            // 지우기 전에 꼭 물어본다 — [예] 일 때만 삭제
            MessageBoxResult r = MessageBox.Show($"'{source.Name}' 연락처를 삭제할까요?", "삭제 확인",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            string name = source.Name;
            contacts.Remove(source);
            lvContacts.SelectedItem = null;
            StartEdit(null);
            lblInfo.Text = $"'{name}' 을(를) 삭제했습니다. (남은 {contacts.Count}명)";
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Step3')}`;

  const STEP4_CS_CORE = `        private static readonly Brush OkBorder = new SolidColorBrush(Color.FromRgb(0xAB, 0xAD, 0xB3));   // TextBox 기본 테두리 색

        // 폼의 값을 검사 — 틀린 칸은 빨간 테두리, 첫 번째 문제는 빨간 글씨로
        private bool ValidateForm()
        {
            txtName.BorderBrush = ContactValidator.IsValidName(editing.Name) ? OkBorder : Brushes.Crimson;
            txtPhone.BorderBrush = ContactValidator.IsValidPhone(editing.Phone) ? OkBorder : Brushes.Crimson;
            txtEmail.BorderBrush = ContactValidator.IsValidEmail(editing.Email) ? OkBorder : Brushes.Crimson;

            string message = ContactValidator.Check(editing);
            lblError.Text = message;
            return message == "";                   // "" = 문제 없음
        }

        private void ClearErrors()
        {
            lblError.Text = "";
            txtName.BorderBrush = OkBorder;
            txtPhone.BorderBrush = OkBorder;
            txtEmail.BorderBrush = OkBorder;
        }`;

  const EX_STEP4 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step4.MainWindow"
        ${NS}
        Title="주소록 — 단계 4. 입력 검사" Width="560" Height="440">
    <Grid Margin="8">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="300"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <DockPanel>
            <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray" TextWrapping="Wrap"/>
${LIST_XAML()}
        </DockPanel>

        <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
            <TextBlock x:Name="lblFormTitle" Text="새 연락처" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
${FORM_FIELDS()}            <!-- 검사 결과 (문제가 없으면 빈 글자) -->
            <TextBlock x:Name="lblError" Foreground="Crimson" TextWrapping="Wrap" Margin="0,2,0,6"/>
${BUTTONS_XAML.replace(/^ {4}/gm, '')}
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;   // Brush, Brushes, Color

namespace P06Step4
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private Contact? source;
        private Contact editing = new Contact();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;
            cboGroup.ItemsSource = Contact.Groups;
            StartEdit(null);
            lvContacts.SelectedIndex = 0;
        }

        private void LvContacts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lvContacts.SelectedItem is Contact picked && picked != source)
                StartEdit(picked);
        }

        private void StartEdit(Contact? original)
        {
            source = original;
            editing = original == null ? new Contact() : original.Clone();
            form.DataContext = editing;
            lblFormTitle.Text = original == null ? "새 연락처" : "연락처 수정";
            ClearErrors();
        }

        private void BtnNew_Click(object sender, RoutedEventArgs e)
        {
            lvContacts.SelectedItem = null;
            StartEdit(null);
            txtName.Focus();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            if (!ValidateForm()) return;            // 검사에 걸리면 여기서 멈춘다
            Contact added = editing.Clone();
            contacts.Add(added);
            StartEdit(added);
            lvContacts.SelectedItem = added;
            lblInfo.Text = $"'{added.Name}' 을(를) 추가했습니다. (모두 {contacts.Count}명)";
        }

        private void BtnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblError.Text = "목록에서 고칠 연락처를 먼저 고르세요. (새 연락처는 [추가])"; return; }
            if (!ValidateForm()) return;
            source.CopyFrom(editing);
            lblInfo.Text = $"'{source.Name}' 을(를) 수정했습니다.";
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblError.Text = "삭제할 연락처를 목록에서 고르세요."; return; }
            MessageBoxResult r = MessageBox.Show($"'{source.Name}' 연락처를 삭제할까요?", "삭제 확인",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            string name = source.Name;
            contacts.Remove(source);
            lvContacts.SelectedItem = null;
            StartEdit(null);
            lblInfo.Text = $"'{name}' 을(를) 삭제했습니다. (남은 {contacts.Count}명)";
        }

${STEP4_CS_CORE}

${SAMPLES}
    }
}
${CONTACT_CS('P06Step4')}
${VALIDATOR_CS('P06Step4')}`;

  /* ---------- p06-2 실습 ---------- */
  const P3_XAML = (ns) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="편집용 복사본 — 적용과 되돌리기" Width="420" Height="330">
    <StackPanel Margin="14">
        <TextBlock Text="원본 (목록에 있다고 생각하세요)" Foreground="Gray"/>
        <TextBlock x:Name="lblOriginal" FontSize="16" FontWeight="Bold" Margin="0,2,0,12"/>

        <!-- DataContext = 편집용 복사본 -->
        <StackPanel x:Name="form">
            <TextBlock Text="이름"/>
            <TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,6"/>
            <TextBlock Text="전화"/>
            <TextBox Text="{Binding Phone, UpdateSourceTrigger=PropertyChanged}" Margin="0,2,0,6"/>
        </StackPanel>

        <StackPanel Orientation="Horizontal" Margin="0,8,0,0">
            <Button Content="적용" Width="90" Height="28" Click="BtnApply_Click"/>
            <Button Content="되돌리기" Width="90" Height="28" Margin="8,0,0,0" Click="BtnRevert_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblInfo" Margin="0,10,0,0" Foreground="Gray" TextWrapping="Wrap"/>
    </StackPanel>
</Window>`;

  const P3_STARTER = `${P3_XAML('P06Practice3')}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P06Practice3
{
    public partial class MainWindow : Window
    {
        private readonly Contact original = new Contact { Name = "김민준", Phone = "010-1234-5678" };
        private Contact editing = new Contact();

        public MainWindow()
        {
            InitializeComponent();
            form.DataContext = editing;      // TODO 1: 빈 Contact 대신 원본의 복사본(Clone)을 연결하기
            ShowOriginal();
        }

        private void BtnApply_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 이름이 비어 있으면 lblInfo 에 "이름이 비어 있어 적용하지 않았습니다." 만 표시
            //         아니면 원본에 복사본의 값을 가져오고(CopyFrom) "적용했습니다." 표시
        }

        private void BtnRevert_Click(object sender, RoutedEventArgs e)
        {
            // TODO 3: 복사본을 버리고 원본의 새 복사본을 폼에 다시 연결 → "되돌렸습니다." 표시
        }

        private void ShowOriginal()
        {
            lblOriginal.Text = $"{original.Name} · {original.Phone}";
        }
    }
}
${CONTACT_CS('P06Practice3')}`;

  const P3_SOLUTION = `${P3_XAML('P06Practice3')}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P06Practice3
{
    public partial class MainWindow : Window
    {
        private readonly Contact original = new Contact { Name = "김민준", Phone = "010-1234-5678" };
        private Contact editing = new Contact();

        public MainWindow()
        {
            InitializeComponent();
            editing = original.Clone();
            form.DataContext = editing;
            ShowOriginal();
        }

        private void BtnApply_Click(object sender, RoutedEventArgs e)
        {
            if (editing.Name.Trim() == "")
            {
                lblInfo.Text = "이름이 비어 있어 적용하지 않았습니다.";
                return;
            }
            original.CopyFrom(editing);      // 이때 원본이 바뀐다
            ShowOriginal();
            lblInfo.Text = "적용했습니다.";
        }

        private void BtnRevert_Click(object sender, RoutedEventArgs e)
        {
            editing = original.Clone();      // 고치던 복사본은 버리고 새 복사본
            form.DataContext = editing;      // 폼이 원본 값으로 돌아간다
            lblInfo.Text = "되돌렸습니다.";
        }

        private void ShowOriginal()
        {
            lblOriginal.Text = $"{original.Name} · {original.Phone}";
        }
    }
}
${CONTACT_CS('P06Practice3')}`;

  const P4_XAML = (ns) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="삭제 확인과 다음 항목 고르기" Width="440" Height="360">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" Margin="0,8,0,0">
            <Button Content="삭제" Width="90" Height="28" Click="BtnDelete_Click"/>
            <Button Content="모두 삭제" Width="90" Height="28" Margin="8,0,0,0" Click="BtnDeleteAll_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray" TextWrapping="Wrap"/>
        <ListView x:Name="lvContacts">
            <ListView.View>
                <GridView>
                    <GridViewColumn Header="이름" Width="90" DisplayMemberBinding="{Binding Name}"/>
                    <GridViewColumn Header="전화" Width="130" DisplayMemberBinding="{Binding Phone}"/>
                    <GridViewColumn Header="그룹" Width="70" DisplayMemberBinding="{Binding Group}"/>
                </GridView>
            </ListView.View>
        </ListView>
    </DockPanel>
</Window>`;

  const P4_STARTER = `${P4_XAML('P06Practice4')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace P06Practice4
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;
            lvContacts.SelectedIndex = 0;
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: 고른 연락처가 없으면 "삭제할 연락처를 고르세요." 표시
            // TODO 2: MessageBox(예/아니요, 경고 아이콘)로 "'이름' 연락처를 삭제할까요?" 확인 → 예일 때만
            // TODO 3: 지운 자리의 다음 항목(마지막이었다면 새 마지막 항목)을 골라 두기
            //         "'이름' 삭제 — 남은 n명" 표시
        }

        private void BtnDeleteAll_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 비어 있으면 아무것도 하지 않기
            //         "연락처 n명을 모두 삭제할까요?" 를 물어 예일 때만 모두 지우고 "모두 삭제했습니다." 표시
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice4')}`;

  const P4_SOLUTION = `${P4_XAML('P06Practice4')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;

namespace P06Practice4
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            lvContacts.ItemsSource = contacts;
            lvContacts.SelectedIndex = 0;
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (lvContacts.SelectedItem is not Contact c)
            {
                lblInfo.Text = "삭제할 연락처를 고르세요.";
                return;
            }
            MessageBoxResult r = MessageBox.Show($"'{c.Name}' 연락처를 삭제할까요?", "삭제 확인",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            int index = contacts.IndexOf(c);        // 지우기 "전에" 자리를 기억
            contacts.Remove(c);
            if (contacts.Count > 0)
                lvContacts.SelectedItem = contacts[System.Math.Min(index, contacts.Count - 1)];   // 다음 항목 (없으면 마지막)
            lblInfo.Text = $"'{c.Name}' 삭제 — 남은 {contacts.Count}명";
        }

        private void BtnDeleteAll_Click(object sender, RoutedEventArgs e)
        {
            if (contacts.Count == 0) return;
            MessageBoxResult r = MessageBox.Show($"연락처 {contacts.Count}명을 모두 삭제할까요?", "모두 삭제",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;
            contacts.Clear();
            lblInfo.Text = "모두 삭제했습니다.";
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice4')}`;

  /* ---------- p06-2 슬라이드 코드 ---------- */
  const SL_DETAIL = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06SlideDetail.MainWindow"
        ${NS}
        Title="목록 + 상세 (직접 바인딩)" Width="420" Height="220">
    <Grid Margin="8">
        <Grid.ColumnDefinitions><ColumnDefinition/><ColumnDefinition/></Grid.ColumnDefinitions>
        <ListBox x:Name="lstPeople" DisplayMemberPath="Name"/>
        <StackPanel Grid.Column="1" Margin="8,0,0,0" DataContext="{Binding ElementName=lstPeople, Path=SelectedItem}">
            <TextBlock Text="이름"/>
            <TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}"/>
            <TextBlock Text="전화" Margin="0,6,0,0"/>
            <TextBox Text="{Binding Phone, UpdateSourceTrigger=PropertyChanged}"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace P06SlideDetail
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstPeople.ItemsSource = new[] { new Person { Name = "김민준", Phone = "010-1234-5678" }, new Person { Name = "이서연", Phone = "010-2345-6789" } };
        }
    }
    public class Person { public string Name { get; set; } = ""; public string Phone { get; set; } = ""; }
}`;

  /* ======================================================================
   * p06-3 단계 5 ~ 6
   * ==================================================================== */

  const SEARCH_XAML = (extra = '') => `                <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,6">
                    <TextBlock Text="검색" VerticalAlignment="Center" Margin="0,0,6,0"/>
                    <TextBox x:Name="txtSearch" Width="120" TextChanged="TxtSearch_TextChanged"/>
                    <ComboBox x:Name="cboFilter" Width="80" Margin="6,0,0,0" SelectionChanged="CboFilter_SelectionChanged"/>
${extra}                </StackPanel>`;

  // 단계 5 이후 공통: 선택 · 편집 · 추가 · 수정 · 삭제 (onChange = 원본이 바뀐 뒤 할 일)
  const EDIT_CS = (onChange) => `        // ---------- 목록 ↔ 폼 ----------
        private void LvContacts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // 다른 연락처를 골랐을 때만 폼을 바꾼다 (목록을 다시 거를 때 편집 중인 내용을 지키려고)
            if (lvContacts.SelectedItem is Contact picked && picked != source)
                StartEdit(picked);
        }

        private void StartEdit(Contact? original)
        {
            source = original;
            editing = original == null ? new Contact() : original.Clone();
            form.DataContext = editing;
            lblFormTitle.Text = original == null ? "새 연락처" : "연락처 수정";
            ClearErrors();
        }

        private void BtnNew_Click(object sender, RoutedEventArgs e)
        {
            lvContacts.SelectedItem = null;
            StartEdit(null);
            txtName.Focus();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            if (!ValidateForm()) return;
            Contact added = editing.Clone();
            contacts.Add(added);
            StartEdit(added);
            RefreshList();                          // 이름순 자리에 들어가고 그 항목을 골라 둔다
            ${onChange('added', 'added.Name', '추가')}
        }

        private void BtnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblError.Text = "목록에서 고칠 연락처를 먼저 고르세요. (새 연락처는 [추가])"; return; }
            if (!ValidateForm()) return;
            source.CopyFrom(editing);
            RefreshList();                          // 이름이 바뀌면 정렬 · 검색 결과도 달라진다
            ${onChange('source', 'source.Name', '수정')}
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (source == null) { lblError.Text = "삭제할 연락처를 목록에서 고르세요."; return; }
            MessageBoxResult r = MessageBox.Show($"'{source.Name}' 연락처를 삭제할까요?", "삭제 확인",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            string name = source.Name;
            contacts.Remove(source);
            lvContacts.SelectedItem = null;
            StartEdit(null);
            UpdateCount();
            ${onChange('null', 'name', '삭제')}
        }`;

  const FILTER_CS = (extra = '') => `        // ---------- 검색 (ICollectionView) ----------
        // 항목마다 불린다: true = 보이기, false = 숨기기 (원본에서 지우는 것이 아니다)
        private bool FilterContact(object item)
        {
            Contact c = (Contact)item;
            string keyword = txtSearch.Text.Trim();
            string group = cboFilter.SelectedItem as string ?? "전체";

            bool textOk = keyword == "" || c.Name.Contains(keyword) || c.Phone.Contains(keyword);
            bool groupOk = group == "전체" || c.Group == group;
${extra}            return textOk && groupOk;
        }

        private void TxtSearch_TextChanged(object sender, TextChangedEventArgs e) { RefreshList(); }
        private void CboFilter_SelectionChanged(object sender, SelectionChangedEventArgs e) { RefreshList(); }

        // 다시 거르고 · 정렬하고, 고치던 연락처를 다시 골라 둔다 (걸러져 안 보이면 선택 없음)
        private void RefreshList()
        {
            view.Refresh();
            lvContacts.SelectedItem = source;
            UpdateCount();
        }

        private void UpdateCount()
        {
            int shown = view.Cast<object>().Count();      // 보기에 남은 항목 수
            lblCount.Text = $"{shown}명 표시 / 전체 {contacts.Count}명";
        }`;

  const VIEW_SETUP = `            view = CollectionViewSource.GetDefaultView(contacts);                        // 원본 위에 "보기" 를 씌운다
            view.SortDescriptions.Add(new SortDescription("Name", ListSortDirection.Ascending));   // 이름순
            view.Filter = FilterContact;                                                  // 검색 조건
            lvContacts.ItemsSource = view;                                                // 원본 대신 보기를 연결

            cboGroup.ItemsSource = Contact.Groups;
            List<string> filters = new List<string> { "전체" };
            filters.AddRange(Contact.Groups);
            cboFilter.ItemsSource = filters;
            cboFilter.SelectedIndex = 0;             // → SelectionChanged → RefreshList (view 가 먼저 준비돼 있어야 한다)`;

  const SHOW_FIRST = `        // 폼을 비우고 목록의 첫 연락처를 골라 폼에 보여 준다
        private void ShowFirst()
        {
            StartEdit(null);
            lvContacts.SelectedItem = null;
            lvContacts.SelectedIndex = 0;            // 연락처가 없으면 아무것도 고르지 않는다
        }`;

  const EX_STEP5 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step5.MainWindow"
        ${NS}
        Title="주소록 — 단계 5. 검색과 정렬" Width="560" Height="440">
    <DockPanel>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblCount"/></StatusBarItem>
        </StatusBar>
        <Grid Margin="8">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="300"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>

            <DockPanel>
${SEARCH_XAML()}
    ${LIST_XAML().replace(/\n/g, '\n    ')}
            </DockPanel>

            <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
                <TextBlock x:Name="lblFormTitle" Text="새 연락처" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
    ${FORM_FIELDS().trimEnd().replace(/\n/g, '\n    ')}
                <TextBlock x:Name="lblError" Foreground="Crimson" TextWrapping="Wrap" Margin="0,2,0,6"/>
${BUTTONS_XAML}
            </StackPanel>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;       // ICollectionView (실제 WPF), SortDescription
using System.Linq;                 // Cast, Count
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;         // CollectionViewSource
using System.Windows.Media;

namespace P06Step5
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private readonly ICollectionView view;      // 검색 · 정렬을 맡는 "보기"
        private Contact? source;
        private Contact editing = new Contact();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
${VIEW_SETUP}
            ShowFirst();
        }

${SHOW_FIRST}

${EDIT_CS((item, name, verb) => `lblStatus.Text = $"'{${name}}' 을(를) ${verb}했습니다.";`)}

${FILTER_CS()}

${STEP4_CS_CORE}

${SAMPLES}
    }
}
${CONTACT_CS('P06Step5')}
${VALIDATOR_CS('P06Step5')}`;

  const EX_STEP6 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06Step6.MainWindow"
        ${NS}
        Title="주소록 — 단계 6. 파일 저장 · 불러오기" Width="560" Height="460">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="열기(_O)..." Click="Open_Click"/>
                <MenuItem Header="저장(_S)" Click="Save_Click"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Click="SaveAs_Click"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblCount"/></StatusBarItem>
        </StatusBar>
        <Grid Margin="8">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="300"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>

            <DockPanel>
${SEARCH_XAML()}
    ${LIST_XAML().replace(/\n/g, '\n    ')}
            </DockPanel>

            <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
                <TextBlock x:Name="lblFormTitle" Text="새 연락처" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
    ${FORM_FIELDS().trimEnd().replace(/\n/g, '\n    ')}
                <TextBlock x:Name="lblError" Foreground="Crimson" TextWrapping="Wrap" Margin="0,2,0,6"/>
${BUTTONS_XAML}
            </StackPanel>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;                   // File, Path
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using Microsoft.Win32;             // OpenFileDialog, SaveFileDialog

namespace P06Step6
{
    public partial class MainWindow : Window
    {
        private const string DefaultFile = "contacts.json";   // 작업 폴더(실행 파일이 있는 폴더)의 기본 파일
        private const string JsonFilter = "주소록 파일 (*.json)|*.json|모든 파일 (*.*)|*.*";

        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private readonly ICollectionView view;
        private Contact? source;
        private Contact editing = new Contact();
        private string currentPath = DefaultFile;             // 지금 연 파일 → [저장] 은 여기에

        public MainWindow()
        {
            InitializeComponent();

            // 저장해 둔 주소록이 있으면 읽고, 없으면(처음 실행) 예시 데이터로 시작
            if (File.Exists(DefaultFile)) LoadFrom(DefaultFile);
            else AddSamples();

${VIEW_SETUP}
            ShowFirst();
            Title = $"{Path.GetFileName(currentPath)} - 주소록";
        }

${SHOW_FIRST}

        // ---------- 파일 ----------
        private void LoadFrom(string path)
        {
            try
            {
                List<Contact> loaded = ContactStore.Load(path);
                contacts.Clear();                    // 원본을 바꾸면 보기 · 목록은 저절로 따라온다
                foreach (Contact c in loaded) contacts.Add(c);
                currentPath = path;
                lblStatus.Text = $"{Path.GetFileName(path)} 에서 {contacts.Count}명을 불러왔습니다.";
            }
            catch (Exception ex)                      // 읽을 수 없는 파일 · JSON 이 아닌 파일
            {
                MessageBox.Show($"파일을 읽지 못했습니다.\\n{ex.Message}", "열기 오류",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void SaveTo(string path)
        {
            try
            {
                ContactStore.Save(path, contacts);
                currentPath = path;
                Title = $"{Path.GetFileName(currentPath)} - 주소록";
                lblStatus.Text = $"{Path.GetFileName(path)} 에 {contacts.Count}명을 저장했습니다.";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"저장하지 못했습니다.\\n{ex.Message}", "저장 오류",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Open_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "주소록 열기";
            dlg.Filter = JsonFilter;
            if (dlg.ShowDialog() != true) return;    // 취소
            LoadFrom(dlg.FileName);
            ShowFirst();
            UpdateCount();
            Title = $"{Path.GetFileName(currentPath)} - 주소록";
        }

        private void Save_Click(object sender, RoutedEventArgs e) { SaveTo(currentPath); }

        private void SaveAs_Click(object sender, RoutedEventArgs e)
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = JsonFilter;
            dlg.DefaultExt = ".json";                 // 확장자를 안 쓰면 .json 을 붙여 준다
            dlg.FileName = Path.GetFileName(currentPath);
            if (dlg.ShowDialog() == true) SaveTo(dlg.FileName);
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }

${EDIT_CS((item, name, verb) => `lblStatus.Text = $"'{${name}}' 을(를) ${verb}했습니다. — 파일 ▸ 저장 을 잊지 마세요";`)}

${FILTER_CS()}

${STEP4_CS_CORE}

${SAMPLES}
    }
}
${CONTACT_CS('P06Step6')}
${VALIDATOR_CS('P06Step6')}
${STORE_CS('P06Step6')}`;

  /* ---------- p06-3 실습 ---------- */
  const P5_XAML = (ns) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="정렬 기준 바꾸기와 그룹별 인원" Width="460" Height="380">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,8">
            <Button Content="이름순" Width="80" Height="26" Click="BtnSortName_Click"/>
            <Button Content="그룹순" Width="80" Height="26" Margin="6,0,0,0" Click="BtnSortGroup_Click"/>
            <Button Content="최근 추가순" Width="90" Height="26" Margin="6,0,0,0" Click="BtnSortNone_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblGroups" DockPanel.Dock="Bottom" Margin="0,8,0,0" TextWrapping="Wrap"/>
        <ListView x:Name="lvContacts">
            <ListView.View>
                <GridView>
                    <GridViewColumn Header="이름" Width="90" DisplayMemberBinding="{Binding Name}"/>
                    <GridViewColumn Header="전화" Width="130" DisplayMemberBinding="{Binding Phone}"/>
                    <GridViewColumn Header="그룹" Width="70" DisplayMemberBinding="{Binding Group}"/>
                </GridView>
            </ListView.View>
        </ListView>
    </DockPanel>
</Window>`;

  const P5_STARTER = `${P5_XAML('P06Practice5')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Data;

namespace P06Practice5
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private readonly ICollectionView view;

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            view = CollectionViewSource.GetDefaultView(contacts);
            lvContacts.ItemsSource = view;
            // TODO 4: 처음에는 이름순 + 그룹별 인원 표시
        }

        // TODO 1: 이름순 — SortDescriptions 를 비우고 Name 오름차순 하나
        private void BtnSortName_Click(object sender, RoutedEventArgs e) { }

        // TODO 2: 그룹순 — Group 오름차순, 같은 그룹 안에서는 Name 오름차순 (정렬 기준 2개)
        private void BtnSortGroup_Click(object sender, RoutedEventArgs e) { }

        // TODO 3: 최근 추가순 — 정렬 기준을 모두 지우면 원본(추가한) 순서
        private void BtnSortNone_Click(object sender, RoutedEventArgs e) { }

        // TODO 5: lblGroups 에 "가족 2명 · 친구 2명 · 회사 2명" 처럼 그룹별 인원 (LINQ GroupBy)
        private void ShowGroupCounts() { }

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice5')}`;

  const P5_SOLUTION = `${P5_XAML('P06Practice5')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Data;

namespace P06Practice5
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();
        private readonly ICollectionView view;

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            view = CollectionViewSource.GetDefaultView(contacts);
            lvContacts.ItemsSource = view;
            SortBy("Name");
            ShowGroupCounts();
        }

        // 정렬 기준을 모두 바꾼다 (이름을 여러 개 주면 앞의 것부터 차례로)
        private void SortBy(params string[] properties)
        {
            view.SortDescriptions.Clear();
            foreach (string p in properties)
                view.SortDescriptions.Add(new SortDescription(p, ListSortDirection.Ascending));
        }

        private void BtnSortName_Click(object sender, RoutedEventArgs e) { SortBy("Name"); }
        private void BtnSortGroup_Click(object sender, RoutedEventArgs e) { SortBy("Group", "Name"); }
        private void BtnSortNone_Click(object sender, RoutedEventArgs e) { SortBy(); }   // 기준 없음 = 원본 순서

        private void ShowGroupCounts()
        {
            var parts = contacts.GroupBy(c => c.Group)             // 그룹 이름으로 묶기
                                .OrderBy(g => g.Key)
                                .Select(g => $"{g.Key} {g.Count()}명");
            lblGroups.Text = string.Join(" · ", parts);
        }

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice5')}`;

  const P6_XAML = (ns) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="CSV 로 내보내기" Width="480" Height="400">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="0,0,0,8">
            <Button Content="CSV 로 내보내기..." Width="140" Height="28" Click="BtnExport_Click"/>
            <TextBlock x:Name="lblInfo" VerticalAlignment="Center" Margin="10,0,0,0" Foreground="Gray"/>
        </StackPanel>
        <TextBlock DockPanel.Dock="Top" Text="저장한 파일 내용:"/>
        <TextBox x:Name="txtPreview" DockPanel.Dock="Bottom" Height="130" Margin="0,4,0,0" IsReadOnly="True"
                 FontFamily="Consolas" VerticalScrollBarVisibility="Auto"/>
        <ListView x:Name="lvContacts" Margin="0,4,0,0">
            <ListView.View>
                <GridView>
                    <GridViewColumn Header="이름" Width="80" DisplayMemberBinding="{Binding Name}"/>
                    <GridViewColumn Header="전화" Width="120" DisplayMemberBinding="{Binding Phone}"/>
                    <GridViewColumn Header="이메일" Width="170" DisplayMemberBinding="{Binding Email}"/>
                </GridView>
            </ListView.View>
        </ListView>
    </DockPanel>
</Window>`;

  const P6_STARTER = `${P6_XAML('P06Practice6')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Windows;
using Microsoft.Win32;

namespace P06Practice6
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            contacts.Add(new Contact { Name = "홍길동", Phone = "010-1000-2000", Email = "", Group = "기타" });
            lvContacts.ItemsSource = contacts;
        }

        private void BtnExport_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: SaveFileDialog (Filter "CSV 파일 (*.csv)|*.csv", DefaultExt ".csv", 기본 이름 contacts.csv)
            // TODO 2: 첫 줄 "이름,전화,이메일,그룹" + 연락처마다 한 줄 (값 안의 쉼표는 공백으로 바꾸기: Clean)
            //         → File.WriteAllLines
            // TODO 3: 저장한 파일을 다시 읽어 txtPreview 에 보여 주고, lblInfo 에 "n명을 저장했습니다"
        }

        // 값 안의 쉼표(,)가 칸 구분과 헷갈리지 않게 공백으로 바꾼다
        private static string Clean(string value) => value.Replace(',', ' ');

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice6')}`;

  const P6_SOLUTION = `${P6_XAML('P06Practice6')}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Windows;
using Microsoft.Win32;

namespace P06Practice6
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();

        public MainWindow()
        {
            InitializeComponent();
            AddSamples();
            contacts.Add(new Contact { Name = "홍길동", Phone = "010-1000-2000", Email = "", Group = "기타" });
            lvContacts.ItemsSource = contacts;
        }

        private void BtnExport_Click(object sender, RoutedEventArgs e)
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = "CSV 파일 (*.csv)|*.csv";
            dlg.DefaultExt = ".csv";
            dlg.FileName = "contacts.csv";
            if (dlg.ShowDialog() != true) return;

            List<string> lines = new List<string> { "이름,전화,이메일,그룹" };   // 머리글 줄
            foreach (Contact c in contacts)
                lines.Add($"{Clean(c.Name)},{Clean(c.Phone)},{Clean(c.Email)},{Clean(c.Group)}");
            File.WriteAllLines(dlg.FileName, lines);

            txtPreview.Text = File.ReadAllText(dlg.FileName);   // 정말 그렇게 저장됐는지 확인
            lblInfo.Text = $"{contacts.Count}명을 저장했습니다";
        }

        private static string Clean(string value) => value.Replace(',', ' ');

${SAMPLES}
    }
}
${CONTACT_CS('P06Practice6')}`;

  /* ---------- p06-3 슬라이드 코드 ---------- */
  const SL_FILTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="P06SlideFilter.MainWindow"
        ${NS}
        Title="ICollectionView 필터" Width="360" Height="260">
    <DockPanel Margin="8">
        <TextBox x:Name="txtSearch" DockPanel.Dock="Top" TextChanged="TxtSearch_TextChanged"/>
        <ListBox x:Name="lstNames" Margin="0,6,0,0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic; using System.ComponentModel;
using System.Windows; using System.Windows.Controls; using System.Windows.Data;
namespace P06SlideFilter
{
    public partial class MainWindow : Window
    {
        private readonly List<string> names = new List<string> { "김민준", "이서연", "김하늘", "박지훈" };
        private readonly ICollectionView view;
        public MainWindow()
        {
            InitializeComponent();
            view = CollectionViewSource.GetDefaultView(names);
            view.Filter = item => ((string)item).Contains(txtSearch.Text.Trim());   // true 만 보인다
            lstNames.ItemsSource = view;
        }
        private void TxtSearch_TextChanged(object sender, TextChangedEventArgs e) { view.Refresh(); }
    }
}`;

  /* ======================================================================
   * p06-4 완성 프로그램 (옵션으로 확장 과제의 뼈대 · 정답도 만든다)
   * ==================================================================== */
  const FINAL = (ns, o = {}) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="주소록" Width="560" Height="460" Closing="Window_Closing">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <!-- 명령: 메뉴 오른쪽에 Ctrl+O · Ctrl+S 가 저절로 표시되고 단축키도 동작 -->
                <MenuItem Header="열기(_O)..." Command="{x:Static ApplicationCommands.Open}"/>
                <MenuItem Header="저장(_S)" Command="{x:Static ApplicationCommands.Save}"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="{x:Static ApplicationCommands.SaveAs}"/>
${o.menu || ''}                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblCount"/></StatusBarItem>
        </StatusBar>
        <Grid Margin="8">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="300"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>

            <!-- 왼쪽: 검색 + 목록 -->
            <DockPanel>
${SEARCH_XAML(o.search || '')}
    ${LIST_XAML(o.columns || '').replace(/\n/g, '\n    ')}
            </DockPanel>

            <!-- 오른쪽: 상세 폼 (DataContext = 편집용 복사본) -->
            <StackPanel x:Name="form" Grid.Column="1" Margin="12,0,0,0">
                <TextBlock x:Name="lblFormTitle" Text="새 연락처" FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
    ${FORM_FIELDS(o.form || '').trimEnd().replace(/\n/g, '\n    ')}
                <TextBlock x:Name="lblError" Foreground="Crimson" TextWrapping="Wrap" Margin="0,2,0,6"/>
${BUTTONS_XAML}
            </StackPanel>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;       // ICollectionView (실제 WPF), SortDescription, CancelEventArgs
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;         // CollectionViewSource
using System.Windows.Input;        // ApplicationCommands, CommandBinding
using System.Windows.Media;
using Microsoft.Win32;

namespace ${ns}
{
    public partial class MainWindow : Window
    {
${o.todo || ''}        private const string DefaultFile = "contacts.json";   // 작업 폴더에 저장되는 기본 파일
        private const string JsonFilter = "주소록 파일 (*.json)|*.json|모든 파일 (*.*)|*.*";

        private readonly ObservableCollection<Contact> contacts = new ObservableCollection<Contact>();   // 원본
        private readonly ICollectionView view;      // 검색 · 정렬을 맡는 "보기"
        private Contact? source;                    // 폼에서 고치고 있는 원본 (null = 새 연락처)
        private Contact editing = new Contact();    // 폼에 연결된 편집용 복사본
        private string currentPath = DefaultFile;   // [저장] 할 파일
        private bool isDirty = false;               // 저장하지 않은 변경이 있나?

        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Open, Open_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.SaveAs, SaveAs_Executed));

            // 저장해 둔 주소록이 있으면 읽고, 없으면(처음 실행) 예시 데이터로 시작
            if (File.Exists(DefaultFile)) LoadFrom(DefaultFile);
            else AddSamples();

${VIEW_SETUP}
            ShowFirst();
            UpdateTitle();
        }

${SHOW_FIRST}

${EDIT_CS((item, name, verb) => `MarkDirty($"'{${name}}' 을(를) ${verb}했습니다.");`)}

${FILTER_CS(o.filter || '')}

${STEP4_CS_CORE}

        // ---------- 파일 ----------
        private void LoadFrom(string path)
        {
            try
            {
                List<Contact> loaded = ContactStore.Load(path);
                contacts.Clear();
                foreach (Contact c in loaded) contacts.Add(c);
                currentPath = path;
                isDirty = false;
                lblStatus.Text = $"{Path.GetFileName(path)} 에서 {contacts.Count}명을 불러왔습니다.";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"파일을 읽지 못했습니다.\\n{ex.Message}", "열기 오류",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // 저장에 성공하면 true
        private bool SaveTo(string path)
        {
            try
            {
                ContactStore.Save(path, contacts);
                currentPath = path;
                isDirty = false;
                UpdateTitle();
                lblStatus.Text = $"{Path.GetFileName(path)} 에 {contacts.Count}명을 저장했습니다.";
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"저장하지 못했습니다.\\n{ex.Message}", "저장 오류",
                    MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }

        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "주소록 열기";
            dlg.Filter = JsonFilter;
            if (dlg.ShowDialog() != true) return;
            LoadFrom(dlg.FileName);
            ShowFirst();
            UpdateCount();
            UpdateTitle();
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { SaveTo(currentPath); }

        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e) { SaveAs(); }

        private bool SaveAs()
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = JsonFilter;
            dlg.DefaultExt = ".json";
            dlg.FileName = Path.GetFileName(currentPath);
            return dlg.ShowDialog() == true && SaveTo(dlg.FileName);
        }

        // 저장하지 않은 변경이 있으면 물어본다. 계속 진행해도 되면 true
        private bool ConfirmSave()
        {
            if (!isDirty) return true;
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "주소록",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Cancel) return false;
            if (r == MessageBoxResult.Yes) return SaveTo(currentPath);
            return true;
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!ConfirmSave()) e.Cancel = true;     // 취소 → 창이 닫히지 않는다
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }

        private void MarkDirty(string message)
        {
            isDirty = true;
            UpdateTitle();
            lblStatus.Text = message;
        }

        private void UpdateTitle()
        {
            Title = $"{(isDirty ? "*" : "")}{Path.GetFileName(currentPath)} - 주소록";
        }
${o.methods || ''}
${SAMPLES}
    }
}
${CONTACT_CS(ns, { usings: o.contactUsings, props: o.contactProps, copy: o.contactCopy })}
${VALIDATOR_CS(ns)}
${STORE_CS(ns, o.store || '')}`;

  const EX_FINAL = FINAL('P06Final');

  /* ---------- 확장 과제 1. CSV 내보내기 · 가져오기 ---------- */
  const X1_MENU = `                <Separator/>
                <MenuItem Header="CSV 로 내보내기(_E)..." Click="ExportCsv_Click"/>
                <MenuItem Header="CSV 가져오기(_I)..." Click="ImportCsv_Click"/>
`;
  const X1_STARTER = FINAL('P06Ext1', {
    menu: X1_MENU,
    todo: `        // 확장 과제 1 — CSV 내보내기 · 가져오기
        //  TODO 1: ContactStore 에 SaveCsv(path, contacts) · LoadCsv(path, out skipped) 추가
        //  TODO 2: ExportCsv_Click — SaveFileDialog(*.csv) → SaveCsv
        //  TODO 3: ImportCsv_Click — OpenFileDialog(*.csv) → LoadCsv → 검사를 통과한 연락처만 추가

`,
    methods: `
        private void ExportCsv_Click(object sender, RoutedEventArgs e)
        {
            lblStatus.Text = "CSV 내보내기는 아직 만들지 않았습니다.";
        }

        private void ImportCsv_Click(object sender, RoutedEventArgs e)
        {
            lblStatus.Text = "CSV 가져오기는 아직 만들지 않았습니다.";
        }
`
  });
  const X1_SOLUTION = FINAL('P06Ext1', {
    menu: X1_MENU,
    methods: `
        // ---------- 확장 1: CSV ----------
        private const string CsvFilter = "CSV 파일 (*.csv)|*.csv|모든 파일 (*.*)|*.*";

        private void ExportCsv_Click(object sender, RoutedEventArgs e)
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = CsvFilter;
            dlg.DefaultExt = ".csv";
            dlg.FileName = "contacts.csv";
            if (dlg.ShowDialog() != true) return;
            ContactStore.SaveCsv(dlg.FileName, contacts);
            lblStatus.Text = $"{Path.GetFileName(dlg.FileName)} 로 {contacts.Count}명을 내보냈습니다.";
        }

        private void ImportCsv_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = CsvFilter;
            if (dlg.ShowDialog() != true) return;

            List<Contact> read = ContactStore.LoadCsv(dlg.FileName, out int skipped);
            int added = 0;
            foreach (Contact c in read)
            {
                // 형식이 틀렸거나 같은 전화번호가 이미 있으면 건너뛴다
                if (ContactValidator.Check(c) != "" || contacts.Any(x => x.Phone == c.Phone)) { skipped++; continue; }
                contacts.Add(c);
                added++;
            }
            RefreshList();
            MarkDirty($"CSV 에서 {added}명을 가져왔습니다. (건너뜀 {skipped}줄)");
        }
`,
    store: `
        // ---------- CSV: 이름,전화,이메일,그룹 ----------
        public static void SaveCsv(string path, IEnumerable<Contact> contacts)
        {
            List<string> lines = new List<string> { "이름,전화,이메일,그룹" };
            foreach (Contact c in contacts)
                lines.Add(string.Join(",", Clean(c.Name), Clean(c.Phone), Clean(c.Email), Clean(c.Group)));
            File.WriteAllLines(path, lines);
        }

        // 읽을 수 있는 줄만 연락처로 만든다. 칸 수가 맞지 않는 줄은 skipped 로 센다
        public static List<Contact> LoadCsv(string path, out int skipped)
        {
            List<Contact> result = new List<Contact>();
            skipped = 0;
            string[] lines = File.ReadAllLines(path);
            for (int i = 1; i < lines.Length; i++)            // 0번 줄 = 머리글
            {
                if (lines[i].Trim() == "") continue;
                string[] cells = lines[i].Split(',');
                if (cells.Length != 4) { skipped++; continue; }
                result.Add(new Contact { Name = cells[0].Trim(), Phone = cells[1].Trim(), Email = cells[2].Trim(), Group = cells[3].Trim() });
            }
            return result;
        }

        private static string Clean(string value) => value.Replace(',', ' ');
`
  });

  /* ---------- 확장 과제 2. 즐겨찾기 ---------- */
  const X2_OPTS = {
    contactUsings: 'using System.Text.Json.Serialization;   // JsonIgnore\n',
    contactProps: `
        private bool isFavorite;
        public bool IsFavorite
        {
            get { return isFavorite; }
            set { isFavorite = value; OnPropertyChanged(); OnPropertyChanged(nameof(Star)); }   // ★ 열도 함께 바뀌게
        }

        // 목록의 ★ 열에 보여 줄 글자 — 계산 속성이라 파일에는 저장하지 않는다
        [JsonIgnore]
        public string Star => IsFavorite ? "★" : "";
`,
    contactCopy: '            IsFavorite = other.IsFavorite;\n',
    columns: '                        <GridViewColumn Header="★" Width="28" DisplayMemberBinding="{Binding Star}"/>\n',
    form: '            <CheckBox Content="즐겨찾기 ★" IsChecked="{Binding IsFavorite}" Margin="0,2,0,6"/>\n',
    search: '                    <CheckBox x:Name="chkFavOnly" Content="★만" VerticalAlignment="Center" Margin="6,0,0,0" Click="ChkFavOnly_Click"/>\n',
    filter: '            if (chkFavOnly.IsChecked == true && !c.IsFavorite) return false;   // 즐겨찾기만 보기\n',
    methods: `
        private void ChkFavOnly_Click(object sender, RoutedEventArgs e) { RefreshList(); }
`
  };
  const X2_STARTER = FINAL('P06Ext2', {
    todo: `        // 확장 과제 2 — 즐겨찾기(★)
        //  TODO 1: Contact 에 bool IsFavorite 속성 (CopyFrom 에도 추가!) + 목록용 Star 속성 ("★" 또는 "")
        //  TODO 2: 목록 맨 앞에 ★ 열, 폼에 "즐겨찾기 ★" CheckBox (IsChecked 바인딩)
        //  TODO 3: 검색 줄에 "★만" CheckBox — 체크하면 즐겨찾기만 보이게 FilterContact 에 조건 추가

`
  });
  const X2_SOLUTION = FINAL('P06Ext2', X2_OPTS);

  /* ---------- p06-4 슬라이드용 조각 ---------- */
  const SL_CONFIRM = `private bool ConfirmSave()
{
    if (!isDirty) return true;                 // 바뀐 게 없으면 통과
    var r = MessageBox.Show("바뀐 내용을 저장할까요?", "주소록",
        MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
    if (r == MessageBoxResult.Cancel) return false;
    if (r == MessageBoxResult.Yes) return SaveTo(currentPath);
    return true;                               // 아니요: 버리고 진행
}

private void Window_Closing(object sender, CancelEventArgs e)
{
    if (!ConfirmSave()) e.Cancel = true;
}`;

  const SL_STORE = `public static class ContactStore
{
    static readonly JsonSerializerOptions Options =
        new JsonSerializerOptions { WriteIndented = true };

    public static void Save(string path, IEnumerable<Contact> contacts)
    {
        File.WriteAllText(path, JsonSerializer.Serialize(contacts, Options));
    }

    public static List<Contact> Load(string path)
    {
        string json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<Contact>>(json) ?? new List<Contact>();
    }
}`;

  /* ======================================================================
   * 챕터 등록
   * ==================================================================== */
  CS_COURSE.addChapter({
    id: 'p06',
    no: 'P06',
    title: 'WPF 주소록 (파일 저장)',
    subtitle: 'Contact Book — ListView · Validation · ICollectionView · JSON',
    summary: '이름 · 전화 · 이메일 · 그룹을 가진 연락처를 ListView(GridView)에 보여 주고, 오른쪽 상세 폼에서 추가 · 수정 · 삭제하는 주소록을 만듭니다. 폼은 원본 대신 “편집용 복사본”에 바인딩해 입력 검사(빈 이름 · 전화 형식)를 통과할 때만 원본을 바꾸고, ICollectionView 의 Filter 로 검색 · 그룹 필터를, JsonSerializer 와 파일 대화상자로 저장 · 불러오기를 완성합니다.',
    goals: [
      '주소록의 요구사항을 기능 목록 · 데이터(Contact) · 화면 설계로 정리할 수 있다',
      'ListView(GridView) 와 상세 폼으로 마스터-디테일 화면을 만들 수 있다',
      '편집용 복사본(Clone · CopyFrom)으로 확정 전까지 원본을 지키는 편집 흐름을 구현할 수 있다',
      '정규식(Regex)으로 입력을 검사하고, 틀린 칸을 화면에 표시할 수 있다',
      'ICollectionView 의 Filter · SortDescriptions · Refresh 로 검색과 정렬을 구현할 수 있다',
      'System.Text.Json 으로 목록을 JSON 파일에 저장하고 불러올 수 있다',
      'OpenFileDialog · SaveFileDialog · MessageBox 로 파일 선택 · 삭제 확인 · 저장 확인을 할 수 있다'
    ],
    requires: ['ch10', 'ch16', 'ch18', 'ch21'],
    preview: 'assets/shots/p06-final.png',
    previewCode: EX_FINAL,
    sections: [
      /* ===================== p06-1 ===================== */
      {
        id: 'p06-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '주소록의 기능 요구사항과 입력 규칙을 표로 정리할 수 있다',
          'Contact 클래스와 파일 형식(JSON)을 설계할 수 있다',
          '화면을 메뉴 · 검색 · 목록 · 상세 폼 · 상태 표시줄로 나누어 설계할 수 있다',
          'JsonSerializer 와 Regex 를 콘솔에서 먼저 시험해 볼 수 있다'
        ],
        flow: [['도입 · 완성 프로그램 시연', 5], ['요구사항 · 입력 규칙', 10], ['데이터 · 화면 · 흐름 설계', 15], ['준비 예제 (JSON · 정규식 · 화면 틀)', 13], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '이번 프로젝트는 휴대폰의 연락처 앱 같은 <b>주소록(contact book)</b>입니다. 왼쪽 목록에서 사람을 고르면 오른쪽 폼에 자세한 정보가 나타나고, 그 자리에서 고치거나 새 사람을 추가 · 삭제할 수 있습니다. 검색 칸에 “김” 을 쓰면 김씨만 남고, 프로그램을 껐다 켜도 연락처가 그대로 남아 있도록 <b>파일에 저장</b>합니다.' },
          { type: 'p', html: '지금까지 배운 것을 거의 모두 씁니다. 10장의 <b>파일 입출력</b>, 16장의 <b>입력 컨트롤</b>, 18장의 <b>데이터 바인딩 · ListView · ICollectionView</b>, 21장의 <b>메뉴 · MessageBox · 파일 대화상자</b>가 한 프로그램 안에서 만납니다. 새로 배우는 것은 두 가지뿐입니다: 객체를 JSON 글자로 바꾸는 <code>System.Text.Json</code>, 글자의 모양을 검사하는 <b>정규식(Regex)</b>.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '설명'], rows: [
            ['F1', '목록 보기', '연락처를 이름 · 전화 · 그룹 열로 보여 준다 (이름순 정렬)'],
            ['F2', '상세 보기', '목록에서 고르면 오른쪽 폼에 이름 · 전화 · 이메일 · 그룹이 나타난다'],
            ['F3', '추가', '[새로 입력] → 폼에 쓰고 → [추가]'],
            ['F4', '수정', '폼에서 고친 뒤 [수정] 을 눌러야 목록에 반영 (그 전에는 원본이 바뀌지 않음)'],
            ['F5', '삭제', '[삭제] → “정말 삭제할까요?” 확인 → [예] 일 때만'],
            ['F6', '입력 검사', '빈 이름 · 전화 형식 · 이메일 형식이 틀리면 추가 · 수정하지 않고 알려 준다'],
            ['F7', '검색', '이름 · 전화에 검색어가 들어 있는 사람 + 그룹 필터(전체 · 가족 · 친구 · 회사 · 기타)'],
            ['F8', '저장 · 불러오기', 'JSON 파일로 저장, 시작할 때 자동으로 읽기, 다른 파일 열기 · 다른 이름으로 저장'],
            ['F9', '안전장치', '저장하지 않고 닫으려 하면 저장할지 묻는다 (제목에 * 표시)']
          ], caption: '기능 요구사항' },
          { type: 'h', text: '3. 데이터 설계 — Contact 와 입력 규칙' },
          { type: 'table', head: ['속성', '형식', '규칙', '예'], rows: [
            ['<code>Name</code>', '<code>string</code>', '<b>필수</b> — 공백만 있어도 안 됨', '김민준'],
            ['<code>Phone</code>', '<code>string</code>', '<b>필수</b> — <code>0</code> 으로 시작 2~3자리 - 3~4자리 - 4자리', '010-1234-5678, 02-345-6789'],
            ['<code>Email</code>', '<code>string</code>', '선택 — 쓰면 <code>글자@글자.글자</code>', 'minjun@example.com'],
            ['<code>Group</code>', '<code>string</code>', '가족 · 친구 · 회사 · 기타 중 하나 (기본 친구)', '친구']
          ], caption: 'Contact 한 명의 데이터' },
          { type: 'p', html: '<code>Contact</code> 는 18장처럼 <code>INotifyPropertyChanged</code> 를 구현해 값이 바뀌면 목록이 저절로 다시 그려지게 합니다. 여기에 두 메서드를 더합니다. <code>Clone()</code> 은 똑같은 값을 가진 <b>새 객체</b>(복사본)를 만들고, <code>CopyFrom(other)</code> 는 다른 객체의 값을 <b>나에게</b> 가져옵니다. 이 둘이 “편집용 복사본” 설계(2교시)의 핵심입니다.' },
          { type: 'p', html: '파일 형식은 <b>JSON</b>(JavaScript Object Notation)입니다. 사람이 읽을 수 있는 글자 파일이면서 <code>{ "키": 값 }</code> 모양으로 객체를 그대로 담을 수 있어, 요즘 프로그램의 설정 · 데이터 파일로 가장 많이 쓰입니다. C# 에는 <code>System.Text.Json</code> 이 기본으로 들어 있어 한 줄로 객체 ⇄ JSON 변환을 할 수 있습니다.' },
          { type: 'figure', html: SVG_JSON, caption: '직렬화(Serialize): 객체 → JSON 글자 · 역직렬화(Deserialize): JSON 글자 → 객체' },
          { type: 'h', text: '4. 화면 설계' },
          { type: 'figure', html: SVG_SCREEN, caption: '주소록 화면 — 21장의 DockPanel 뼈대(메뉴 · 상태 표시줄) 안에 Grid 두 칸' },
          { type: 'h', text: '5. 클래스와 데이터 흐름' },
          { type: 'table', head: ['파일', '역할'], rows: [
            ['<code>Contact.cs</code>', '연락처 한 명 (INotifyPropertyChanged · Clone · CopyFrom)'],
            ['<code>ContactValidator.cs</code>', '입력 검사 규칙 (정규식) — 화면과 상관없는 순수 C#'],
            ['<code>ContactStore.cs</code>', 'JSON 파일 저장 · 불러오기 — 파일 다루는 코드는 모두 여기'],
            ['<code>MainWindow.xaml(.cs)</code>', '화면과 이벤트 처리 — 위 세 클래스를 조립']
          ], caption: '역할마다 파일을 나눈다 — 검사 규칙 · 파일 형식이 바뀌어도 화면 코드는 그대로' },
          { type: 'figure', html: SVG_FLOW, caption: '원본(contacts) → 보기(view) → 목록 → 복사본(editing) ⇄ 폼 → 검사 → 원본 → 파일' },
          { type: 'table', head: ['교시', '단계', '결과물'], rows: [
            ['1교시', '단계 1. 화면 틀', '예시 데이터가 보이는 목록 + 빈 폼'],
            ['2교시', '단계 2. 목록과 상세 폼', 'SelectedItem 에 폼을 직접 바인딩 (문제점 확인)'],
            ['2교시', '단계 3. 추가 · 수정 · 삭제', '편집용 복사본 + 삭제 확인'],
            ['2교시', '단계 4. 입력 검사', 'ContactValidator + 빨간 테두리'],
            ['3교시', '단계 5. 검색과 정렬', 'ICollectionView Filter · 그룹 필터 · 개수'],
            ['3교시', '단계 6. 파일 저장 · 불러오기', 'JSON + 파일 대화상자 + 시작할 때 자동 읽기'],
            ['4교시', '완성 · 확장', '저장 확인 · 명령 · CSV · 즐겨찾기']
          ], caption: '구현 계획' },
          { type: 'h', text: '6. 준비 운동 — JSON 과 정규식' },
          { type: 'p', html: '화면을 만들기 전에, 새로 쓰는 두 기능을 <b>콘솔</b>에서 먼저 확인합니다. 화면이 없으니 결과를 눈으로 정확히 볼 수 있고, 나중에 WPF 에서 문제가 생겼을 때 “JSON 쪽 문제인지 화면 쪽 문제인지” 를 나눌 수 있습니다.' },
          { type: 'code', title: '준비 예제 1. JsonSerializer — 객체 목록 ⇄ JSON 글자', code: EX_JSON, expect: '[\n  {\n    "Name": "\\uAE40\\uBBFC\\uC900",\n    "Phone": "010-1234-5678",\n    "Email": "minjun@example.com",\n    "Group": "\\uCE5C\\uAD6C"\n  },\n  {\n    "Name": "Lee",\n    "Phone": "02-345-6789",\n    "Email": "",\n    "Group": "\\uD68C\\uC0AC"\n  }\n]\n되돌린 연락처 2명\n- 김민준 / 010-1234-5678 / 친구\n- Lee / 02-345-6789 / 회사',
            desc: '<code>Serialize</code> 는 <b>public 속성</b>(get · set)을 <code>"속성 이름": 값</code> 으로 적습니다. <code>WriteIndented = true</code> 를 빼면 한 줄로 붙어 나옵니다. 한글이 <code>\\uAE40</code> 같은 모양으로 나오는 것은 <b>유니코드 이스케이프</b>(escape) 표기입니다 — 깨진 것이 아니라 “가(U+AC00) 계열의 AE40 번 글자” 를 안전한 영문자로 적은 것이고, <code>Deserialize</code> 로 읽으면 마지막 두 줄처럼 원래 한글로 돌아옵니다. <code>Deserialize&lt;List&lt;Contact&gt;&gt;</code> 의 꺾쇠 안에 “어떤 형식으로 되돌릴지” 를 알려 주어야 합니다. 결과가 <code>null</code> 일 수도 있어(파일 내용이 <code>null</code>) 형식이 <code>List&lt;Contact&gt;?</code> 입니다.' },
          { type: 'callout', kind: 'more', title: '📘 JSON 파일에 한글을 그대로 쓰고 싶다면', html: '<p>기본 설정은 웹 페이지에 넣어도 안전하도록 영문 이외의 글자를 모두 <code>\\uXXXX</code> 로 바꿉니다. Visual Studio 의 WPF 프로젝트에서는 옵션에 <code>Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)</code> 을 주면(<code>using System.Text.Encodings.Web; using System.Text.Unicode;</code>) 파일을 메모장으로 열었을 때 한글이 그대로 보입니다. 어느 쪽이든 <b>다시 읽으면 똑같은 한글</b>이므로 프로그램 동작에는 차이가 없습니다. (브라우저 실행 환경에는 이 인코더가 없어 이 강좌의 예제는 기본 설정을 씁니다.)</p>' },
          { type: 'p', html: '다음은 입력 검사입니다. “전화번호 모양인가?” 를 <code>if</code> 와 <code>Substring</code> 으로 검사하면 코드가 길어집니다. <b>정규식(regular expression)</b>은 글자의 모양을 짧은 패턴으로 적는 방법입니다. <code>System.Text.RegularExpressions</code> 의 <code>Regex</code> 에 패턴을 주고 <code>IsMatch(글자)</code> 로 맞는지 확인합니다.' },
          { type: 'table', head: ['패턴 조각', '뜻', '전화 패턴에서'], rows: [
            ['<code>^</code> · <code>$</code>', '글자의 처음 · 끝 (앞뒤에 다른 글자가 붙으면 안 됨)', '<code>^0…\\d{4}$</code>'],
            ['<code>\\d</code>', '숫자 한 개 (0~9)', '<code>\\d{1,2}</code> = 숫자 1~2개'],
            ['<code>{n}</code> · <code>{n,m}</code>', '앞의 것을 n번 · n~m번', '<code>\\d{3,4}</code> = 숫자 3~4개'],
            ['<code>-</code> · <code>0</code>', '그 글자 그대로', '하이픈 · 첫 글자 0'],
            ['<code>[^@\\s]+</code>', '@ 와 공백이 아닌 글자 1개 이상', '이메일의 각 부분'],
            ['<code>\\.</code>', '점(.) 그대로 (그냥 <code>.</code> 은 “아무 글자”)', '<code>example<b>.</b>com</code>']
          ], caption: '이번 프로젝트에 쓰는 정규식 — @"…" (축자 문자열)로 쓰면 \\ 를 한 번만 쓴다' },
          { type: 'code', title: '준비 예제 2. 정규식으로 전화 · 이메일 형식 검사', code: EX_REGEX, expect: '[010-1234-5678] 전화 → 올바름\n[02-345-6789] 전화 → 올바름\n[031-987-6543] 전화 → 올바름\n[01012345678] 전화 → 형식 오류\n[010-12-5678] 전화 → 형식 오류\n[010-1234-56789] 전화 → 형식 오류\n[hong@example.com] 이메일 → 올바름\n[hong@example] 이메일 → 형식 오류\n[hong example@a.com] 이메일 → 형식 오류\n[@example.com] 이메일 → 형식 오류\n이름 \'   \' → 비어 있음',
            desc: '하이픈이 없는 <code>01012345678</code>, 가운데가 두 자리인 <code>010-12-5678</code>, 끝이 다섯 자리인 <code>010-1234-56789</code>(끝의 <code>$</code> 덕분에 걸림)가 모두 형식 오류입니다. 이메일은 <code>.</code> 이 없거나(<code>hong@example</code>), 공백이 있거나, @ 앞이 비면 오류입니다. 이메일 규칙은 일부러 <b>느슨하게</b> 만들었습니다 — 완벽한 이메일 정규식은 매우 길고, 진짜 주소인지는 메일을 보내 봐야 알 수 있기 때문입니다. 이름은 정규식 없이 <code>Trim()</code> 한 길이로 “공백만 있는” 경우까지 잡습니다.' },
          { type: 'callout', kind: 'warn', title: '정규식은 @"…" 로 쓰세요', html: '<p>C# 의 보통 문자열에서 <code>\\</code> 는 <code>\\n</code>(줄 바꿈) 같은 특수 문자의 시작입니다. <code>"\\d"</code> 라고 쓰면 “알 수 없는 이스케이프” 컴파일 오류가 납니다. 앞에 <code>@</code> 를 붙인 <b>축자 문자열(verbatim string)</b> <code>@"^0\\d{1,2}…"</code> 은 <code>\\</code> 를 글자 그대로 두므로 정규식을 적을 때 편합니다(10장의 파일 경로와 같은 이유).</p>' },
          { type: 'h', text: '7. 단계 1 — 화면 틀' },
          { type: 'p', html: '이제 WPF 프로젝트를 만들고 화면만 먼저 배치합니다. 버튼은 아직 아무 일도 하지 않지만, 목록에는 예시 연락처 6명이 보이도록 <code>ItemsSource</code> 만 연결합니다. 열(column)은 18장의 <code>ListView</code> + <code>GridView</code> 로, 각 열이 연락처의 어느 속성을 보여 줄지 <code>DisplayMemberBinding="{Binding Name}"</code> 으로 정합니다.' },
          { type: 'code', title: '단계 1. 화면 틀 — 목록 · 검색 줄 · 상세 폼 배치', code: EX_STEP1, desc: '바깥 <code>Grid</code> 를 300 픽셀 · 나머지(<code>*</code>) 두 칸으로 나누고, 왼쪽 칸은 <code>DockPanel</code> 로 검색 줄(위) + 목록(나머지)을, 오른쪽 칸은 <code>StackPanel</code> 로 입력 칸을 위에서부터 쌓았습니다. 버튼 네 개는 <code>UniformGrid Columns="2"</code> 로 2×2 칸에 같은 크기로 넣었습니다. 콤보 상자의 항목은 <code>Contact.Groups</code> 배열을 <code>ItemsSource</code> 로 연결했습니다 — 그룹 목록을 한곳(Contact)에만 적어 두면 나중에 그룹을 추가할 때 한 줄만 고치면 됩니다. <code>Contact.cs</code> 는 이 프로젝트 끝까지 거의 그대로 씁니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 프로젝트 준비하기', html: '<ul><li><b>새 프로젝트 ▸ WPF 애플리케이션</b>(.NET 9) 을 고르고 이름을 <code>ContactBook</code> 으로 만듭니다. 예제의 네임스페이스 <code>P06Step1</code> 은 프로젝트 이름으로 바꿔 쓰세요.</li><li>솔루션 탐색기에서 프로젝트를 오른쪽 클릭 ▸ <b>추가 ▸ 클래스</b> 로 <code>Contact.cs</code> 를 만들고, 예제의 <code>// ===== File: Contact.cs =====</code> 아래 내용을 붙여 넣습니다. 이후 단계의 <code>ContactValidator.cs</code> · <code>ContactStore.cs</code> 도 같은 방법으로 추가합니다.</li><li><code>System.Text.Json</code> 과 <code>System.Text.RegularExpressions</code> 는 .NET 에 기본으로 들어 있어 NuGet 설치가 필요 없습니다.</li><li>디자이너에서 <code>ListView</code> 의 열 너비를 마우스로 조절해 보고, XAML 의 <code>Width</code> 값이 바뀌는 것을 확인하세요.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P6-1. 친구 목록을 JSON 파일로 저장하고 다시 읽기',
            level: 1,
            desc: '<p>친구 두 명의 목록을 JSON 파일로 저장한 뒤, 그 파일을 다시 읽어 출력하세요.</p><ul><li>들여쓰기(<code>WriteIndented</code>)한 JSON 을 <code>friends.json</code> 에 저장하고 <code>저장했습니다: friends.json</code> 출력</li><li>파일을 다시 읽어 <code>List&lt;Friend&gt;</code> 로 되돌리기 (결과가 <code>null</code> 이면 빈 목록)</li><li><code>읽은 친구 수: 2</code> 와 친구마다 <code>- 미나 (010-1111-2222)</code> 출력</li></ul>',
            hint: '저장: <code>JsonSerializer.Serialize(friends, options)</code> → <code>File.WriteAllText</code>. 읽기: <code>File.ReadAllText</code> → <code>JsonSerializer.Deserialize&lt;List&lt;Friend&gt;&gt;(text) ?? new List&lt;Friend&gt;()</code>. <code>??</code> 는 왼쪽이 <code>null</code> 일 때 오른쪽 값을 씁니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION,
            expect: '저장했습니다: friends.json\n읽은 친구 수: 2\n- 미나 (010-1111-2222)\n- 준호 (010-3333-4444)'
          },
          {
            title: '실습 P6-2. 전화번호 검사와 자동 하이픈',
            level: 2,
            desc: '<p>전화번호 검사 메서드 두 개를 완성하세요.</p><ul><li><code>IsValidPhone</code>: <code>0</code> 으로 시작하는 2~3자리 - 3~4자리 - 4자리이면 <code>true</code> (정규식)</li><li><code>NormalizePhone</code>: 하이픈 없이 쓴 <b>숫자 11자리</b>(예: <code>01098765432</code>)는 <code>010-9876-5432</code> 로 바꾸고, 그 밖의 글자는 그대로 돌려줍니다.</li></ul><p>출력 예: <code>01098765432 → 010-9876-5432 : 통과</code></p>',
            hint: '숫자 11자리 검사: <code>new Regex(@"^\\d{11}$")</code>. 자르기: <code>phone.Substring(0, 3)</code> · <code>Substring(3, 4)</code> · <code>Substring(7, 4)</code> 를 보간 문자열로 이어 붙입니다. <code>0101234</code> 는 7자리라 바뀌지 않고 형식 오류입니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION,
            expect: '010-1234-5678 → 010-1234-5678 : 통과\n01098765432 → 010-9876-5432 : 통과\n02-345-6789 → 02-345-6789 : 통과\n010-12-3456 → 010-12-3456 : 형식 오류\n0101234 → 0101234 : 형식 오류'
          }
        ],
        quiz: [
          { q: '<code>JsonSerializer.Serialize(list)</code> 를 했을 때 JSON 에 <b>저장되지 않는</b> 것은?', options: ['public string Name { get; set; }', 'public string Phone { get; set; }', 'public static readonly string[] Groups', 'public string Group { get; set; }'], answer: 2, explain: 'System.Text.Json 은 객체의 <b>public 인스턴스 속성</b>을 저장합니다. static 필드 · 메서드 · 이벤트는 저장되지 않습니다. 그래서 그룹 목록 <code>Groups</code> 를 Contact 안에 static 으로 두어도 파일에는 섞이지 않습니다.' },
          { q: '정규식 <code>^0\\d{1,2}-\\d{3,4}-\\d{4}$</code> 에 <b>맞는</b> 것은?', options: ['01012345678', '031-987-6543', '010-12-5678', '10-1234-5678'], answer: 1, explain: '0 + 숫자 1~2개(31) - 숫자 3~4개(987) - 숫자 4개(6543) 입니다. 하이픈이 없거나, 가운데가 2자리이거나, 0 으로 시작하지 않으면 맞지 않습니다.' },
          { q: 'JSON 파일에 한글 이름이 <code>"\\uAE40\\uBBFC\\uC900"</code> 처럼 저장되었다. 올바른 설명은?', options: ['파일이 깨졌으므로 다시 저장해야 한다', 'Deserialize 로 읽으면 원래 한글 “김민준” 으로 돌아온다', 'Contact 에 한글 속성이 있으면 안 된다', 'WriteIndented 를 true 로 하면 한글로 바뀐다'], answer: 1, explain: '기본 인코더가 영문 이외 글자를 <code>\\uXXXX</code> 로 적은 것일 뿐, 내용은 같습니다. 읽으면 그대로 한글입니다. 파일에서도 한글로 보이게 하려면 <code>JavaScriptEncoder.Create(UnicodeRanges.All)</code> 을 씁니다.' },
          { q: '검사 규칙(ContactValidator) · 파일 저장(ContactStore)을 MainWindow 와 <b>다른 클래스</b>로 나누는 가장 큰 이유는?', options: ['실행 속도가 빨라지기 때문에', 'XAML 에서 static 클래스를 쓸 수 없기 때문에', 'WPF 는 한 파일에 클래스를 하나만 둘 수 있기 때문에', '규칙이나 파일 형식이 바뀌어도 화면 코드를 고치지 않고, 따로 시험(콘솔)해 볼 수 있기 때문에'], answer: 3, explain: '역할을 나누면(관심사의 분리) 한 부분의 변화가 다른 부분에 번지지 않습니다. 준비 예제처럼 화면 없이 규칙만 콘솔에서 시험할 수도 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'Project 06 · Section 01 — WPF 주소록 (파일 저장)', badge: 'P06-1',
            notes: '<p><b>[도입 5분]</b> 4교시에 완성할 주소록(<code>previewCode</code>)을 먼저 실행해 보여 줍니다: 목록에서 고르기 → 전화번호를 010-1234 로 바꾸고 [수정] → 빨간 테두리 · 오류 문장 → 검색 칸에 “김” → 파일 ▸ 저장 → 창을 닫았다 다시 실행하면 그대로.</p><p>발문: “휴대폰 연락처 앱에서 꼭 있어야 하는 기능은?” — 학생 답을 칠판에 적고 다음 슬라이드의 요구사항 표와 비교합니다.</p>' },
          { layout: 'bullets', title: '무엇을 만들까?', lead: '목록에서 고르고 → 폼에서 고치고 → 파일로 저장',
            bullets: ['왼쪽: 검색 칸 + <b>ListView(GridView)</b> 목록', '오른쪽: 이름 · 전화 · 이메일 · 그룹 <b>상세 폼</b>', '추가 · 수정 · 삭제 (삭제는 <b>확인</b> 후)', '입력 검사: 빈 이름 · 전화 형식 · 이메일 형식', ['새로 배우는 것: <code>System.Text.Json</code>, <code>Regex</code>'], '프로그램을 껐다 켜도 남도록 <b>JSON 파일</b>에 저장'],
            notes: '<p><b>[2분]</b> 10 · 16 · 18 · 21장의 내용이 모두 모인다는 점을 강조합니다. “새로 배우는 것은 둘뿐, 나머지는 조립” — 프로젝트의 목적은 조립 연습입니다.</p>' },
          { layout: 'table', title: '요구사항 (F1 ~ F9)', head: ['번호', '기능', '핵심'], rows: [
            ['F1 · F2', '목록 · 상세', '이름순 목록, 고르면 폼에 표시'],
            ['F3 · F4 · F5', '추가 · 수정 · 삭제', '[수정] 을 눌러야 원본이 바뀜, 삭제는 확인'],
            ['F6', '입력 검사', '빈 이름 · 전화 · 이메일 형식'],
            ['F7', '검색', '이름 · 전화 + 그룹 필터'],
            ['F8 · F9', '파일', 'JSON 저장 · 자동 읽기 · 닫기 전 확인']
          ], notes: '<p><b>[4분]</b> F4 의 “[수정] 을 눌러야 원본이 바뀐다” 가 이번 프로젝트의 설계 포인트임을 예고합니다. 18장 실습에서는 입력하는 즉시 목록이 바뀌었는데, 왜 그렇게 하지 않을까? — 2교시에 직접 문제를 겪어 봅니다.</p>' },
          { layout: 'diagram', title: '화면 설계', html: SVG_SCREEN, caption: 'DockPanel(메뉴 · 상태 표시줄) + Grid 두 칸(목록 | 폼)',
            notes: '<p><b>[4분]</b> 21장의 DockPanel 뼈대를 복습합니다: Menu(Top) → StatusBar(Bottom) → 나머지(Grid). Grid 는 왼쪽 300 픽셀 고정, 오른쪽은 <code>*</code>.</p><p>전화 칸의 빨간 테두리와 아래 빨간 문장이 “입력 검사” 의 모습입니다. 제목의 * 는 21장 메모장과 같은 “저장 안 한 변경” 표시.</p>' },
          { layout: 'diagram', title: '데이터 흐름', html: SVG_FLOW, caption: '원본 → 보기 → 목록 → 복사본 ⇄ 폼 → 검사 → 원본 → 파일',
            notes: '<p><b>[5분]</b> 번호 순서대로 짚습니다. ① 원본 컬렉션 위에 보기(ICollectionView)를 씌워 검색 · 정렬, ② 고르면 복사본을 만들어 폼에, ③④ [추가] · [수정] 때 검사를 통과해야 원본에 반영, ⑤ 원본을 파일로.</p><p>발문: “폼이 원본이 아니라 복사본에 연결되어 있으면 좋은 점은?” — 답을 듣고 2교시에 확인하자고 넘깁니다.</p>' },
          { layout: 'code', title: '준비 예제 1. JSON — 객체 ⇄ 글자', code: SL_JSON, points: ['<code>Serialize(목록)</code> → JSON 글자', '<code>Deserialize&lt;형식&gt;(글자)</code> → 객체', 'public 속성이 <code>"키": 값</code> 으로', '한글은 <code>\\uXXXX</code> 로 적힘 (읽으면 복원)'],
            notes: '<p><b>[4분]</b> 슬라이드는 영문 이름으로 짧게. 본문 예제는 한글 이름이라 <code>\\uAE40</code> 이 나옵니다 — 직접 실행해 보여 주고 “깨진 게 아니다” 를 확인시킵니다.</p><p><code>back!</code> 의 느낌표는 “null 이 아님을 내가 보장” (12장). 본문 예제는 if 로 확인하는 방식입니다.</p>' },
          { layout: 'code', title: '준비 예제 2. 정규식 — 모양 검사', code: SL_REGEX, points: ['<code>^</code> 처음 · <code>$</code> 끝', '<code>\\d{3,4}</code> = 숫자 3~4개', '<code>@"…"</code> 축자 문자열로 쓴다', '<code>IsMatch</code> → true / false'],
            notes: '<p><b>[4분]</b> 패턴을 칠판에 조각내어 씁니다: ^ | 0 | \\d{1,2} | - | \\d{3,4} | - | \\d{4} | $. 학생에게 “02-345-6789 는 맞을까?” 를 먼저 예측시키고 실행.</p><p>$ 를 빼면 010-1234-56789 도 통과한다는 것을 시연하면 앵커의 의미가 분명해집니다.</p>' },
          { layout: 'table', title: '구현 계획', head: ['교시', '단계', '결과물'], rows: [
            ['1', '단계 1 화면 틀', '목록 + 빈 폼'],
            ['2', '단계 2 · 3 · 4', '상세 폼 · 추가/수정/삭제 · 입력 검사'],
            ['3', '단계 5 · 6', '검색 · 정렬 · JSON 파일'],
            ['4', '완성 · 확장', '저장 확인 · CSV · 즐겨찾기']
          ], notes: '<p><b>[2분]</b> 단계마다 “실행되는 프로그램” 이 나온다는 점 — 한 번에 다 만들지 않고 작게 만들어 확인하며 키워 갑니다(점진적 개발). 단계 1 화면 틀을 실행해 보여 주고 끝.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '정규식 <code>^0\\d{1,2}-\\d{3,4}-\\d{4}$</code> 에 맞는 것은?', options: ['01012345678', '031-987-6543', '010-12-5678', '10-1234-5678'], answer: 1, explain: '0 + 31 + - + 987 + - + 6543. 나머지는 하이픈 없음 · 가운데 2자리 · 0 으로 시작하지 않음.',
            notes: '<p>틀린 보기마다 “어느 조각에서 걸렸나?” 를 물어봅니다.</p>' },
          { layout: 'practice', title: '실습 P6-1. JSON 저장 · 읽기', desc: '<p>친구 두 명을 <code>friends.json</code> 에 저장하고 다시 읽어 <code>- 미나 (010-1111-2222)</code> 형식으로 출력. 빨리 끝나면 실습 P6-2(전화번호 자동 하이픈).</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[실습]</b> 흔한 실수: <code>Deserialize&lt;Friend&gt;</code> (목록이 아니라 한 명) → 실행 시 JsonException. 파일의 맨 앞이 <code>[</code> 이면 목록이라는 것을 보여 주세요.</p><p>P6-2 는 Substring 의 두 번째 인수가 “길이” 라는 점에서 자주 틀립니다(끝 위치가 아님).</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구사항 → 데이터(Contact) → 화면 → 흐름 순서로 설계', 'JSON: <code>Serialize</code> / <code>Deserialize&lt;T&gt;</code> — public 속성이 저장', '정규식: <code>^ $ \\d {n,m}</code>, <code>@"…"</code> 로 쓴다', '역할마다 파일: Contact · Validator · Store · MainWindow', '다음 시간: 목록과 상세 폼, 편집용 복사본'],
            notes: '<p>다음 시간에는 단계 1 화면에 생명을 불어넣습니다. Contact.cs 를 잘 저장해 두라고 안내하세요.</p>' }
        ]
      },

      /* ===================== p06-2 ===================== */
      {
        id: 'p06-2',
        title: '단계별 구현 ① — 목록 · 상세 폼 · 입력 검사',
        minutes: 50,
        goals: [
          'ElementName · SelectedItem 바인딩으로 목록과 상세 폼을 연결할 수 있다',
          '원본에 직접 바인딩할 때의 문제를 설명하고, Clone · CopyFrom 으로 편집용 복사본을 쓸 수 있다',
          '추가 · 수정 · 삭제를 구현하고 삭제 전에 MessageBox 로 확인할 수 있다',
          'ContactValidator 로 입력을 검사하고 틀린 칸을 빨간 테두리로 표시할 수 있다'
        ],
        flow: [['단계 1 복습', 3], ['단계 2 목록 + 상세 폼', 10], ['단계 3 복사본 · 추가 · 수정 · 삭제', 17], ['단계 4 입력 검사', 12], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '단계 2 — 목록에서 고르면 폼에 나타나게' },
          { type: 'p', html: '가장 간단한 방법부터 해 봅니다. 폼(<code>StackPanel</code>)의 <code>DataContext</code> 를 <b>목록에서 고른 항목</b>에 바인딩하면, 폼 안의 <code>{Binding Name}</code> 들은 모두 “고른 연락처의 Name” 을 가리킵니다. 다른 요소의 속성은 <code>{Binding ElementName=요소이름, Path=속성}</code> 으로 가져옵니다(14 · 18장).' },
          { type: 'code', title: '단계 2. 목록과 상세 폼 — SelectedItem 에 직접 바인딩', code: EX_STEP2, desc: '<code>DataContext="{Binding ElementName=lvContacts, Path=SelectedItem}"</code> 한 줄로 목록과 폼이 이어졌습니다. 다른 사람을 고르면 폼이 바로 바뀌고, 폼의 이름 칸에 글자를 쓰면 <b>쓰는 즉시</b> 왼쪽 목록의 이름도 바뀝니다 — <code>UpdateSourceTrigger=PropertyChanged</code> 로 한 글자마다 원본에 쓰고, Contact 의 <code>INotifyPropertyChanged</code> 가 목록에 알리기 때문입니다. 그룹 콤보 상자는 <code>SelectedItem="{Binding Group, Mode=TwoWay}"</code> 로 문자열 <code>Group</code> 과 연결했습니다(항목이 문자열 배열이라 고른 항목 = 그룹 이름). 시작할 때 <code>SelectedIndex = 0</code> 으로 첫 사람을 골라 두어 폼이 비어 있지 않게 했습니다.' },
          { type: 'p', html: '편리해 보이지만 실행해서 <b>이름 칸을 모두 지워</b> 보세요. 목록의 이름이 빈칸이 됩니다. 전화 칸에 아무 글자나 써도 그대로 들어갑니다. 주소록에 “빈 이름” 이 생겨 버렸고, 되돌릴 방법도 없습니다. 입력하는 도중의 값(아직 다 쓰지 않은 값)까지 <b>원본에 바로 들어가는 것</b>이 문제입니다.' },
          { type: 'figure', html: SVG_COPY, caption: '직접 바인딩은 입력 즉시 원본이 바뀐다 → 복사본에 바인딩하고, [수정] 때 검사를 통과하면 원본에 반영' },
          { type: 'h', text: '단계 3 — 편집용 복사본과 추가 · 수정 · 삭제' },
          { type: 'p', html: '해결책은 문서 편집기의 “저장 전까지는 원본 파일이 그대로” 와 같습니다. 목록에서 고르면 그 연락처의 <b>복사본</b>(<code>Clone()</code>)을 만들어 폼에 연결합니다. 사용자는 복사본을 마음껏 고치고, <b>[수정]</b> 을 눌렀을 때만 <code>source.CopyFrom(editing)</code> 으로 원본에 값을 가져옵니다. 다른 사람을 고르면 복사본을 버리면 되므로, 그것이 곧 “취소” 입니다.' },
          { type: 'table', head: ['필드', '뜻', '값'], rows: [
            ['<code>source</code>', '폼에서 고치고 있는 <b>원본</b>', '목록의 Contact, 새 연락처를 쓰는 중이면 <code>null</code>'],
            ['<code>editing</code>', '폼에 연결된 <b>복사본</b>', '<code>source.Clone()</code> 또는 <code>new Contact()</code>']
          ], caption: '두 필드로 편집 상태를 나타낸다' },
          { type: 'table', head: ['버튼', '하는 일'], rows: [
            ['새로 입력', '선택을 풀고 <code>StartEdit(null)</code> — 빈 복사본을 폼에'],
            ['추가', '복사본을 <b>한 번 더</b> 복사해(<code>editing.Clone()</code>) 목록에 넣고 그것을 고른다'],
            ['수정', '<code>source</code> 가 있어야 함 → <code>source.CopyFrom(editing)</code>'],
            ['삭제', '<code>source</code> 가 있어야 함 → MessageBox 확인 → <code>contacts.Remove(source)</code>']
          ] },
          { type: 'code', title: '단계 3. 편집용 복사본 + 추가 · 수정 · 삭제', code: EX_STEP3, desc: '<code>StartEdit</code> 가 편집을 시작하는 유일한 곳입니다. 목록에서 고르거나(<code>SelectionChanged</code>), [새로 입력] · [추가] · [삭제] 뒤에 모두 이 메서드를 부릅니다. <code>SelectionChanged</code> 에서 <code>picked != source</code> 를 확인하는 것은 “이미 편집 중인 그 사람” 을 다시 고른 경우 복사본을 새로 만들어 고치던 내용을 날리지 않기 위해서입니다. [추가] 에서 <code>editing</code> 을 그대로 넣지 않고 <code>Clone()</code> 한 것을 넣는 이유는, 그대로 넣으면 폼이 계속 원본에 직접 연결되어 단계 2 의 문제가 다시 생기기 때문입니다. [삭제] 는 21장처럼 <code>MessageBoxButton.YesNo</code> 로 물어 <code>MessageBoxResult.Yes</code> 일 때만 지웁니다.' },
          { type: 'callout', kind: 'tip', title: 'Clone 과 CopyFrom — 방향을 기억하자', html: '<ul><li><code>a.Clone()</code> — a 와 값이 같은 <b>새 객체</b>를 만들어 돌려준다. a 는 그대로. (원본 → 복사본)</li><li><code>a.CopyFrom(b)</code> — b 의 값을 <b>a 에</b> 써 넣는다. 객체는 새로 생기지 않는다. (복사본 → 원본)</li><li>목록에 있는 원본 객체를 <b>바꿔 끼우지 않고</b> 값만 바꾸므로(CopyFrom), 목록 · 선택 · 다른 참조가 모두 그대로 유지되고 INotifyPropertyChanged 로 화면만 새로 그려집니다.</li></ul>' },
          { type: 'h', text: '단계 4 — 입력 검사' },
          { type: 'p', html: '복사본 덕분에 원본을 바꾸기 <b>직전</b>이라는 “검사할 자리” 가 생겼습니다. 1교시에 설계한 규칙을 <code>ContactValidator</code> 클래스로 옮기고, [추가] · [수정] 의 맨 앞에서 <code>if (!ValidateForm()) return;</code> 으로 검사합니다. 틀린 칸은 테두리를 빨갛게(<code>BorderBrush</code>), 첫 번째 문제는 폼 아래 빨간 글씨로 알려 줍니다.' },
          { type: 'code', title: '단계 4. 입력 검사 — ContactValidator + 빨간 테두리', code: EX_STEP4, desc: '<code>ContactValidator</code> 는 화면을 전혀 모르는 <b>static 클래스</b>입니다. 칸마다 <code>IsValidName</code> · <code>IsValidPhone</code> · <code>IsValidEmail</code> 로 참 · 거짓을 알려 주고, <code>Check</code> 는 첫 번째 문제를 문장으로 돌려줍니다(문제가 없으면 <code>""</code>). 화면 쪽 <code>ValidateForm</code> 은 그 결과로 테두리 색과 <code>lblError</code> 를 정합니다. 정상 테두리 색 <code>#ABADB3</code> 은 WPF TextBox 의 기본 테두리 색입니다. 새로 편집을 시작할 때(<code>StartEdit</code>)는 <code>ClearErrors</code> 로 이전 표시를 지웁니다. 이름을 비우고 [수정] 을 눌러 보세요 — 목록의 원본은 그대로입니다.' },
          { type: 'callout', kind: 'info', title: '검사는 “원본에 넣기 직전” 에 한 번', html: '<p>글자를 칠 때마다(<code>TextChanged</code>) 검사하면 “010-” 까지만 쳤는데 벌써 빨간 테두리가 뜨는 불편함이 있습니다. 이 프로젝트는 <b>버튼을 누를 때</b> 검사합니다. 실제 WPF 에는 바인딩에 검사를 붙이는 <code>IDataErrorInfo</code> · <code>INotifyDataErrorInfo</code> · <code>ValidationRule</code> 도 있는데(빨간 테두리를 WPF 가 자동으로 그려 줌), 템플릿(ControlTemplate)과 함께 써야 해서 이 강좌 범위 밖으로 남겨 둡니다.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 확인해 보기', html: '<ul><li>단계 4 의 <code>ContactValidator.cs</code> 를 <b>추가 ▸ 클래스</b> 로 만들고 붙여 넣습니다. <code>Regex</code> 를 쓰려면 파일 맨 위에 <code>using System.Text.RegularExpressions;</code> 가 필요합니다 — 빠뜨리면 <code>Regex</code> 아래 빨간 물결이 생기고, 전구(<kbd>Ctrl</kbd>+<kbd>.</kbd>)가 using 추가를 제안합니다.</li><li><code>BtnAdd_Click</code> 의 첫 줄에 중단점(<kbd>F9</kbd>)을 걸고 [추가] 를 누른 뒤 <b>조사식</b> 창에 <code>editing.Name</code>, <code>source</code> 를 넣어 보세요. 새로 입력 중이면 <code>source</code> 가 <code>null</code> 인 것이 보입니다.</li><li>실행 중 XAML 을 고치면 <b>XAML 핫 다시 로드</b>로 바로 반영됩니다(테두리 두께 · 여백 조절에 편리).</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P6-3. 편집용 복사본 — 적용과 되돌리기',
            level: 1,
            desc: '<p>연락처 한 명(<code>original</code>)을 편집하는 작은 창입니다. 폼은 <b>복사본</b>에 연결되어야 합니다.</p><ul><li>시작할 때 원본의 복사본을 만들어 <code>form.DataContext</code> 로 정합니다.</li><li><b>적용</b>: 이름이 비어 있으면 <code>이름이 비어 있어 적용하지 않았습니다.</code> 만 표시, 아니면 원본에 복사본의 값을 가져오고 <code>적용했습니다.</code> (위의 원본 표시도 바뀌어야 함)</li><li><b>되돌리기</b>: 고치던 복사본을 버리고 원본의 새 복사본을 폼에 연결 → <code>되돌렸습니다.</code></li></ul>',
            hint: '<code>editing = original.Clone(); form.DataContext = editing;</code> — 되돌리기도 똑같은 두 줄입니다. 적용은 <code>original.CopyFrom(editing); ShowOriginal();</code>. 입력하는 동안 위의 원본 표시가 바뀌지 않는 것을 꼭 확인하세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 P6-4. 삭제 확인과 다음 항목 고르기',
            level: 2,
            desc: '<p>연락처 목록에 삭제 기능을 완성하세요.</p><ul><li><b>삭제</b>: 고른 항목이 없으면 <code>삭제할 연락처를 고르세요.</code>. 있으면 MessageBox(예/아니요, 경고 아이콘)로 <code>\'김민준\' 연락처를 삭제할까요?</code> 를 묻고 [예] 일 때만 지웁니다. 지운 뒤에는 <b>지운 자리의 다음 항목</b>(마지막 항목을 지웠다면 새 마지막 항목)을 골라 두고 <code>\'김민준\' 삭제 — 남은 5명</code> 을 표시합니다.</li><li><b>모두 삭제</b>: 비어 있으면 아무것도 하지 않고, 아니면 <code>연락처 6명을 모두 삭제할까요?</code> 를 물어 [예] 일 때만 모두 지웁니다.</li></ul>',
            hint: '<code>if (lvContacts.SelectedItem is not Contact c)</code> 로 “고른 것이 없음” 을 먼저 거릅니다. 지우기 <b>전에</b> <code>int index = contacts.IndexOf(c);</code> 로 자리를 기억하고, 지운 뒤 <code>contacts[Math.Min(index, contacts.Count - 1)]</code> 을 고릅니다(남은 것이 있을 때만).',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '폼에 <code>DataContext="{Binding ElementName=lvContacts, Path=SelectedItem}"</code> 을 주고 이름 TextBox 를 <code>{Binding Name, UpdateSourceTrigger=PropertyChanged}</code> 로 연결했다. 이름 칸을 모두 지우면?', options: ['목록의 원본 이름도 즉시 빈칸이 된다', '[수정] 을 누를 때까지 원본은 그대로다', '빈 글자는 바인딩이 무시한다', '컴파일 오류가 난다'], answer: 0, explain: '폼이 원본에 <b>직접</b> 연결되어 있으므로 한 글자 바꿀 때마다 원본이 바뀝니다. 그래서 단계 3 에서 편집용 복사본으로 바꿉니다.' },
          { q: '<code>Contact b = a.Clone(); b.Name = "새이름";</code> 을 실행한 뒤 <code>a.Name</code> 은?', options: ['"새이름"', '빈 문자열', 'a 의 원래 이름 그대로', 'null'], answer: 2, explain: '<code>Clone()</code> 은 값이 같은 <b>새 객체</b>를 만듭니다. b 를 고쳐도 a 는 바뀌지 않습니다. <code>Contact b = a;</code> 였다면 같은 객체라 a 도 바뀝니다.' },
          { q: '[추가] 에서 <code>contacts.Add(editing);</code> 대신 <code>contacts.Add(editing.Clone());</code> 으로 쓰는 이유는?', options: ['Add 는 복사본만 받을 수 있어서', 'editing 을 그대로 넣으면 폼이 목록의 원본에 직접 연결된 상태가 되어, 이후 입력이 검사 없이 원본을 바꾸기 때문에', '속도가 더 빨라서', 'Clone 을 해야 이름순으로 정렬되기 때문에'], answer: 1, explain: '폼은 여전히 editing 에 연결되어 있습니다. editing 자체가 목록에 들어가면 단계 2 의 “직접 바인딩” 과 같아집니다.' },
          { q: '<code>MessageBox.Show("삭제할까요?", "확인", MessageBoxButton.YesNo)</code> 의 결과로 “예” 를 확인하는 조건은?', options: ['<code>r == true</code>', '<code>r == MessageBoxButton.Yes</code>', '<code>r == "예"</code>', '<code>r == MessageBoxResult.Yes</code>'], answer: 3, explain: 'MessageBox.Show 는 <code>MessageBoxResult</code> 를 돌려줍니다. <code>MessageBoxButton</code> 은 “어떤 버튼을 보여 줄지” 입니다.' },
          { q: '<code>ContactValidator.Check(c)</code> 가 <code>""</code> 를 돌려주었다. 뜻은?', options: ['모든 검사를 통과했다', '이름이 비어 있다', '전화번호가 틀렸다', '검사를 하지 못했다'], answer: 0, explain: '문제가 있으면 첫 번째 문제의 문장을, 없으면 빈 문자열을 돌려주도록 설계했습니다. 그래서 <code>return message == "";</code> 로 통과 여부를 알 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ① — 목록 · 상세 폼 · 입력 검사', subtitle: 'Project 06 · Section 02 — 단계 2 · 3 · 4', badge: 'P06-2',
            notes: '<p><b>[3분]</b> 단계 1 화면 틀을 다시 실행하고, 오늘 목표를 말합니다: “고르면 폼에, 고치면 목록에 — 단, 검사를 통과했을 때만.”</p>' },
          { layout: 'code', title: '단계 2. SelectedItem 에 폼을 바인딩', code: SL_DETAIL, points: ['<code>ElementName=lstPeople</code> — 다른 요소', '<code>Path=SelectedItem</code> — 고른 항목', '폼 안의 <code>{Binding Name}</code> = 고른 사람의 이름', '입력하면 원본이 <b>즉시</b> 바뀐다'],
            notes: '<p><b>[5분]</b> 슬라이드 예제는 INotifyPropertyChanged 가 없는 Person 이라 목록 글자는 안 바뀌지만, 다른 사람을 골랐다가 돌아오면 바뀌어 있습니다(원본이 바뀌었으니까). 본문 단계 2 는 Contact 라 즉시 바뀝니다.</p><p>시연: 이름 칸을 모두 지우기 → “빈 이름이 주소록에 들어갔다!” 가 이번 교시의 문제 제기입니다.</p>' },
          { layout: 'diagram', title: '직접 바인딩 vs 편집용 복사본', html: SVG_COPY, caption: '복사본을 고치고, [수정] 때 검사 → CopyFrom',
            notes: '<p><b>[4분]</b> 워드 프로세서 비유: 문서를 고쳐도 [저장] 을 누르기 전까지 파일은 그대로. 복사본 방식의 두 가지 이득 — ① 검사할 자리가 생긴다, ② 취소가 공짜(복사본을 버리면 끝).</p>' },
          { layout: 'two', title: 'Clone 과 CopyFrom', left: { title: '원본 → 복사본 (편집 시작)', code: 'source = picked;\nediting = picked.Clone();   // 새 객체\nform.DataContext = editing;', run: false }, right: { title: '복사본 → 원본 (수정 확정)', code: 'if (!ValidateForm()) return;\nsource.CopyFrom(editing);   // 값만 가져오기\n// 목록은 INotifyPropertyChanged 로 갱신', run: false },
            notes: '<p><b>[3분]</b> 방향을 헷갈리지 않게 화살표를 칠판에. CopyFrom 은 원본 객체를 바꿔 끼우지 않으므로 목록의 위치 · 선택이 그대로 유지된다는 점이 중요합니다.</p><p>발문: “수정할 때 <code>contacts[i] = editing.Clone()</code> 으로 바꿔 끼우면 어떤 문제가?” — 선택이 풀리고, source 가 가리키는 객체가 목록에 없게 됩니다.</p>' },
          { layout: 'table', title: '단계 3. 버튼 네 개', head: ['버튼', '조건', '동작'], rows: [
            ['새로 입력', '—', '선택 해제 · <code>StartEdit(null)</code>'],
            ['추가', '(단계 4: 검사 통과)', '<code>contacts.Add(editing.Clone())</code> · 그 항목 선택'],
            ['수정', '<code>source != null</code>', '<code>source.CopyFrom(editing)</code>'],
            ['삭제', '<code>source != null</code> · [예]', '<code>contacts.Remove(source)</code> · 폼 비우기']
          ], notes: '<p><b>[6분]</b> 본문 단계 3 을 실행해 네 버튼을 모두 눌러 봅니다. 특히 [추가] 뒤에 목록에서 새 사람이 선택되는 것, [삭제] 에서 [아니요] 를 누르면 그대로인 것.</p><p>StartEdit 이 “편집을 시작하는 유일한 곳” 이라 모든 흐름이 여기로 모인다는 점을 강조합니다.</p>' },
          { layout: 'two', title: '삭제 전에 확인하기', left: { title: '물어보기', code: 'MessageBoxResult r = MessageBox.Show(\n    $"\'{source.Name}\' 연락처를 삭제할까요?",\n    "삭제 확인",\n    MessageBoxButton.YesNo,\n    MessageBoxImage.Warning);\nif (r != MessageBoxResult.Yes) return;', run: false }, right: { title: '지우고 정리하기', code: 'string name = source.Name;   // 지우기 전에 기억\ncontacts.Remove(source);\nlvContacts.SelectedItem = null;\nStartEdit(null);\nlblInfo.Text = $"\'{name}\' 을(를) 삭제했습니다.";', run: false },
            notes: '<p><b>[3분]</b> 되돌릴 수 없는 동작(삭제 · 덮어쓰기 · 닫기)은 항상 확인 — 21장 복습. 아이콘은 Warning, 기본 버튼은 “예/아니요”.</p><p>지운 뒤 source.Name 을 쓰면 안 되는 것은 아니지만(객체는 남아 있음), StartEdit(null) 뒤에는 source 가 null 이 되므로 이름을 미리 변수에 담습니다.</p>' },
          { layout: 'bullets', title: '단계 4. 입력 검사', lead: '원본에 넣기 “직전” 에 한 번 검사한다',
            bullets: ['<code>ContactValidator</code> — 화면을 모르는 static 클래스', ['<code>IsValidName</code> · <code>IsValidPhone</code> · <code>IsValidEmail</code> → bool', '<code>Check(c)</code> → 첫 번째 문제 문장 또는 <code>""</code>'], '<code>ValidateForm()</code> — 틀린 칸 <code>BorderBrush = Crimson</code>', '[추가] · [수정] 맨 앞: <code>if (!ValidateForm()) return;</code>', '편집을 새로 시작하면 <code>ClearErrors()</code>'],
            notes: '<p><b>[6분]</b> 본문 단계 4 를 실행: 전화 칸에 010-1234 → [수정] → 빨간 테두리 + 문장, 목록은 그대로. 고치고 다시 [수정] → 통과.</p><p>검사 규칙을 화면과 분리했기 때문에 1교시의 콘솔 준비 예제 코드를 거의 그대로 옮겼다는 점을 짚어 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Contact b = a.Clone(); b.Name = "새이름";</code> 뒤의 <code>a.Name</code> 은?', options: ['"새이름"', '빈 문자열', 'a 의 원래 이름 그대로', 'null'], answer: 2, explain: 'Clone 은 새 객체. <code>Contact b = a;</code> 였다면 같은 객체라 a 도 바뀝니다.',
            notes: '<p>정답 후 “Contact b = a; 였다면?” 을 되물어 참조 형식(8장)을 복습합니다.</p>' },
          { layout: 'practice', title: '실습 P6-3. 적용과 되돌리기', desc: '<p>폼을 원본의 <b>복사본</b>에 연결하고, [적용](이름이 비면 거부) · [되돌리기] 를 완성하세요. 빨리 끝나면 실습 P6-4(삭제 확인 + 다음 항목 고르기).</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[실습]</b> 확인 포인트: 입력하는 동안 위의 “원본” 표시가 바뀌지 않아야 합니다. 바뀐다면 복사본이 아니라 원본을 DataContext 로 준 것입니다.</p><p>P6-4 는 IndexOf 를 지우기 “후” 에 부르는 실수(-1)가 흔합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>{Binding ElementName=…, Path=SelectedItem}</code> — 직접 바인딩의 한계', '편집용 복사본: <code>source</code> · <code>editing</code>, <code>Clone()</code> · <code>CopyFrom()</code>', '<code>StartEdit</code> 한곳에서 편집 시작', '삭제는 <code>MessageBoxResult.Yes</code> 일 때만', '검사는 ContactValidator, 표시는 BorderBrush · lblError'],
            notes: '<p>다음 시간: 검색 칸과 그룹 필터(ICollectionView), 그리고 JSON 파일 저장 · 불러오기.</p>' }
        ]
      },

      /* ===================== p06-3 ===================== */
      {
        id: 'p06-3',
        title: '단계별 구현 ② — 검색 · 정렬과 파일 저장',
        minutes: 50,
        goals: [
          'ICollectionView 의 Filter 로 검색어 · 그룹 조건을 함께 적용할 수 있다',
          'SortDescriptions 로 목록을 이름순으로 정렬하고 Refresh 로 다시 거를 수 있다',
          'ContactStore 로 목록을 JSON 파일에 저장하고, 시작할 때 자동으로 읽을 수 있다',
          'OpenFileDialog · SaveFileDialog 로 다른 파일을 열고 다른 이름으로 저장할 수 있다'
        ],
        flow: [['단계 4 복습', 3], ['단계 5 검색 · 그룹 필터 · 정렬', 17], ['단계 6 JSON 파일 · 대화상자', 20], ['정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 5 — 검색과 정렬' },
          { type: 'p', html: '18장에서 배운 <code>ICollectionView</code>(보기)를 씁니다. 원본 <code>contacts</code> 는 그대로 두고, 그 위에 <b>보기</b>를 씌워 “무엇을 보여 줄지(Filter)” 와 “어떤 순서로(SortDescriptions)” 를 정합니다. 목록(<code>ListView</code>)에는 원본 대신 보기를 연결합니다. 검색 칸이나 그룹 콤보 상자가 바뀌면 <code>view.Refresh()</code> 로 다시 거릅니다.' },
          { type: 'figure', html: SVG_FILTER, caption: '필터는 “숨기기” 일 뿐 — 원본 6명은 그대로 있다' },
          { type: 'code', title: '단계 5. 검색 칸 · 그룹 필터 · 이름순 정렬 · 개수 표시', code: EX_STEP5, desc: '<code>FilterContact</code> 는 항목마다 불려 <code>true</code>(보이기) / <code>false</code>(숨기기)를 돌려줍니다. 검색어 조건(<code>textOk</code>)과 그룹 조건(<code>groupOk</code>)을 따로 계산해 <code>&amp;&amp;</code> 로 묶었습니다 — 조건이 늘어도 한 줄씩 더하면 됩니다. 정렬은 <code>SortDescription("Name", …)</code> 한 줄로, 새로 추가하거나 이름을 고친 사람도 <code>Refresh</code> 때 제자리를 찾아갑니다. <code>RefreshList</code> 는 다시 거른 뒤 <code>lvContacts.SelectedItem = source</code> 로 고치던 사람을 다시 골라 둡니다(걸러져 안 보이면 선택 없음). 개수는 LINQ 의 <code>view.Cast&lt;object&gt;().Count()</code> 로 셉니다. 21장처럼 <code>StatusBar</code> 를 붙여 결과 메시지와 개수를 아래에 모았습니다.' },
          { type: 'callout', kind: 'warn', title: '순서 주의 — view 를 만든 “다음에” 콤보 상자를 고른다', html: '<p><code>cboFilter.SelectedIndex = 0</code> 을 실행하면 그 즉시 <code>SelectionChanged</code> → <code>RefreshList</code> → <code>view.Refresh()</code> 가 불립니다. 이 줄이 <code>view = CollectionViewSource.GetDefaultView(…)</code> 보다 <b>앞에</b> 있으면 <code>view</code> 가 아직 <code>null</code> 이라 <code>NullReferenceException</code> 이 납니다. 이벤트는 “코드에서 값을 바꿔도” 발생한다는 것을 기억하세요 — 그래서 준비(view) → 연결(ItemsSource) → 값 정하기(SelectedIndex) 순서로 씁니다.</p>' },
          { type: 'callout', kind: 'info', title: 'ICollectionView 는 어느 네임스페이스?', html: '<p>실제 WPF 에서 <code>ICollectionView</code> · <code>SortDescription</code> 은 <code>System.ComponentModel</code>, <code>CollectionViewSource</code> 는 <code>System.Windows.Data</code> 에 있습니다. 그래서 두 using 을 함께 씁니다. 필터 조건은 <code>Contains</code> 라 대소문자를 구분합니다 — 영문 이름도 쓴다면 <code>c.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)</code> 를 쓰세요.</p>' },
          { type: 'h', text: '단계 6 — JSON 파일로 저장 · 불러오기' },
          { type: 'p', html: '마지막 필수 기능은 저장입니다. 1교시 준비 예제의 두 줄을 <code>ContactStore</code> 클래스로 옮깁니다. <code>Save(path, contacts)</code> 는 목록을 JSON 글자로 바꾸어 파일에 쓰고, <code>Load(path)</code> 는 파일을 읽어 <code>List&lt;Contact&gt;</code> 로 되돌립니다. 화면 쪽은 21장 메모장과 같은 모양입니다: [저장] 은 지금 파일(<code>currentPath</code>)에 바로, [다른 이름으로 저장] 은 <code>SaveFileDialog</code> 로 이름을 물어서, [열기] 는 <code>OpenFileDialog</code> 로 고른 파일을 읽습니다.' },
          { type: 'table', head: ['상황', '동작'], rows: [
            ['프로그램 시작', '작업 폴더에 <code>contacts.json</code> 이 있으면 <code>LoadFrom</code>, 없으면 예시 데이터'],
            ['파일 ▸ 저장', '<code>SaveTo(currentPath)</code> — 대화상자 없이 바로'],
            ['파일 ▸ 다른 이름으로 저장', '<code>SaveFileDialog</code> (<code>DefaultExt=".json"</code>) → <code>SaveTo(dlg.FileName)</code>'],
            ['파일 ▸ 열기', '<code>OpenFileDialog</code> → <code>LoadFrom(dlg.FileName)</code> → 첫 사람 선택'],
            ['읽기 · 쓰기 실패', '<code>try</code> / <code>catch</code> → 오류 MessageBox (프로그램은 계속)']
          ], caption: '파일 기능 정리' },
          { type: 'code', title: '단계 6. JSON 파일 저장 · 불러오기 + 파일 대화상자', code: EX_STEP6, desc: '생성자에서 <code>File.Exists(DefaultFile)</code> 로 저장해 둔 파일을 찾습니다. 경로를 <code>"contacts.json"</code> 처럼 이름만 쓰면 <b>작업 폴더</b>(현재 디렉터리)에 만들어집니다. <code>LoadFrom</code> 은 원본 <code>contacts</code> 를 <code>Clear</code> 한 뒤 읽은 사람을 하나씩 <code>Add</code> 합니다 — 컬렉션 객체를 새로 만들어 바꿔 끼우면 보기(view)와 목록의 연결이 끊어지기 때문에 “같은 컬렉션의 내용만 바꾸는” 방법을 씁니다. 읽기 · 쓰기는 파일이 잠겨 있거나, 내용이 JSON 이 아니면(<code>JsonException</code>) 실패할 수 있으므로 <code>try</code> / <code>catch</code> 로 감싸 오류 창만 띄우고 프로그램은 계속 동작하게 했습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 작업 폴더와 저장 파일 확인하기', html: '<ul><li>Visual Studio 에서 <kbd>F5</kbd> 로 실행하면 작업 폴더는 보통 <code>프로젝트\\bin\\Debug\\net9.0-windows</code> 입니다. 저장한 뒤 솔루션 탐색기 위의 <b>모든 파일 표시</b> 단추를 누르면 <code>bin</code> 폴더 안의 <code>contacts.json</code> 이 보이고, 더블클릭하면 편집기에서 JSON 을 볼 수 있습니다.</li><li>진짜 프로그램에서는 사용자별 폴더에 저장하는 것이 좋습니다: <code>Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "ContactBook", "contacts.json")</code> (폴더는 <code>Directory.CreateDirectory</code> 로 먼저 만들기).</li><li>저장한 JSON 파일을 메모장으로 열어 일부러 괄호를 하나 지운 뒤 [열기] 로 읽어 보세요 — catch 로 잡힌 오류 창이 뜨는 것을 확인할 수 있습니다.</li></ul>' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창의 파일', html: '<p>브라우저에서 실행하면 파일은 브라우저 메모리 안의 작업 폴더(<code>/work</code>)에 만들어지고, 파일 대화상자도 그 폴더를 보여 줍니다. 같은 페이지에서 예제를 다시 실행하면 저장해 둔 <code>contacts.json</code> 을 읽어 오는 것을 확인할 수 있지만, 페이지를 새로 고치면 사라집니다.</p>' }
        ],
        practice: [
          {
            title: '실습 P6-5. 정렬 기준 바꾸기와 그룹별 인원',
            level: 2,
            desc: '<p>연락처 목록 위의 버튼 세 개로 정렬 기준을 바꾸고, 아래에 그룹별 인원을 표시하세요.</p><ul><li><b>이름순</b>: 이름 오름차순</li><li><b>그룹순</b>: 그룹 오름차순, 같은 그룹 안에서는 이름 오름차순 (정렬 기준 <b>2개</b>)</li><li><b>최근 추가순</b>: 정렬 기준을 모두 지워 원본(추가한) 순서로</li><li>시작할 때 이름순으로 정렬하고, <code>lblGroups</code> 에 <code>가족 2명 · 친구 2명 · 회사 2명</code> 처럼 표시</li></ul>',
            hint: '정렬 기준은 <code>view.SortDescriptions.Clear()</code> 후 <code>Add(new SortDescription("Group", ListSortDirection.Ascending))</code> 를 차례로. 매개변수 <code>params string[] properties</code> 를 받는 메서드 하나로 세 버튼을 처리하면 깔끔합니다. 그룹별 인원: <code>contacts.GroupBy(c =&gt; c.Group).OrderBy(g =&gt; g.Key).Select(g =&gt; $"{g.Key} {g.Count()}명")</code> 를 <code>string.Join(" · ", …)</code>.',
            starter: P5_STARTER,
            solution: P5_SOLUTION
          },
          {
            title: '실습 P6-6. CSV 로 내보내기',
            level: 2,
            desc: '<p>엑셀에서 열 수 있도록 연락처를 <b>CSV</b>(쉼표로 칸을 나눈 글자 파일)로 내보내세요.</p><ul><li><code>SaveFileDialog</code>: 필터 <code>CSV 파일 (*.csv)|*.csv</code>, 기본 확장자 <code>.csv</code>, 기본 이름 <code>contacts.csv</code></li><li>첫 줄은 머리글 <code>이름,전화,이메일,그룹</code>, 그다음 연락처마다 한 줄. 값 안의 쉼표는 <code>Clean</code> 으로 공백으로 바꿉니다.</li><li>저장한 파일을 다시 읽어 아래 <code>txtPreview</code> 에 보여 주고, <code>7명을 저장했습니다</code> 를 표시</li></ul>',
            hint: '<code>List&lt;string&gt; lines = new List&lt;string&gt; { "이름,전화,이메일,그룹" };</code> 에 <code>$"{Clean(c.Name)},{Clean(c.Phone)},…"</code> 을 더하고 <code>File.WriteAllLines(dlg.FileName, lines)</code>. 확인은 <code>File.ReadAllText</code>. 이메일이 빈 사람은 <code>홍길동,010-1000-2000,,기타</code> 처럼 쉼표가 두 개 붙습니다.',
            starter: P6_STARTER,
            solution: P6_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>view.Filter</code> 가 어떤 항목에 대해 <code>false</code> 를 돌려주면?', options: ['그 항목이 원본 컬렉션에서 삭제된다', '그 항목이 목록에서 숨겨질 뿐 원본에는 그대로 있다', '예외가 발생한다', '목록의 맨 뒤로 옮겨진다'], answer: 1, explain: '필터는 “보기” 에서만 숨깁니다. 검색어를 지우고 Refresh 하면 다시 보입니다. <code>contacts.Count</code> 는 필터와 상관없이 전체 수입니다.' },
          { q: '검색어를 바꾼 뒤 목록이 다시 걸러지게 하려면 TextChanged 에서 무엇을 불러야 하는가?', options: ['<code>view.Refresh()</code>', '<code>contacts.Clear()</code>', '<code>lvContacts.Items.Clear()</code>', '<code>InitializeComponent()</code>'], answer: 0, explain: '필터 메서드가 읽는 값(검색어)이 바뀐 것을 보기는 스스로 알 수 없습니다. <code>Refresh()</code> 가 항목마다 필터를 다시 부릅니다.' },
          { q: '파일에서 읽은 목록으로 바꿀 때 <code>contacts.Clear()</code> 후 하나씩 <code>Add</code> 하는 이유는?', options: ['JsonSerializer 가 ObservableCollection 을 만들 수 없어서', 'Add 가 더 빨라서', '<code>contacts = new ObservableCollection…</code> 으로 바꿔 끼우면 이미 만들어 둔 보기(view) · 목록이 옛 컬렉션을 계속 가리키기 때문에', 'readonly 필드는 Clear 만 할 수 있어서'], answer: 2, explain: '보기와 ListView 는 “처음 연결한 그 컬렉션 객체” 를 봅니다. 새 객체로 바꾸면 화면은 옛 객체를 보여 줍니다. 그래서 같은 객체의 내용만 바꿉니다(필드를 readonly 로 둔 것도 실수를 막기 위해서).' },
          { q: '<code>SaveFileDialog</code> 에서 사용자가 [취소] 를 눌렀을 때 <code>dlg.ShowDialog()</code> 의 값은?', options: ['<code>true</code>', '<code>null</code> 만 가능', '빈 문자열', '<code>false</code> — 그래서 <code>== true</code> 일 때만 저장한다'], answer: 3, explain: '<code>ShowDialog()</code> 는 <code>bool?</code> 를 돌려줍니다. [저장] = true, [취소] = false. <code>if (dlg.ShowDialog() == true)</code> 로 비교합니다(21장).' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ② — 검색 · 정렬과 파일 저장', subtitle: 'Project 06 · Section 03 — 단계 5 · 6', badge: 'P06-3',
            notes: '<p><b>[3분]</b> 단계 4 를 실행해 복습. “연락처가 수백 명이면?” → 검색이 필요. “창을 닫으면?” → 모두 사라짐 → 저장이 필요. 오늘의 두 목표입니다.</p>' },
          { layout: 'diagram', title: '보기(ICollectionView)로 걸러 보기', html: SVG_FILTER, caption: 'Filter = 숨기기, 원본은 그대로',
            notes: '<p><b>[3분]</b> 18장 복습. 원본 · 보기 · 화면의 세 층. 필터가 false 인 항목은 “지우는 것” 이 아니라 “안 보여 주는 것” 임을 강조합니다.</p>' },
          { layout: 'code', title: '필터의 최소 예', code: SL_FILTER, points: ['<code>GetDefaultView(원본)</code> → 보기', '<code>view.Filter = item =&gt; …</code>', 'ItemsSource 에는 <b>보기</b>를 연결', '검색어가 바뀌면 <code>Refresh()</code>'],
            notes: '<p><b>[4분]</b> 슬라이드 예제는 람다로 필터를 썼습니다. 본문 단계 5 는 조건이 둘이라 이름 있는 메서드 FilterContact 로. “김” 을 쳐서 김민준 · 김하늘만 남는 것을 확인.</p>' },
          { layout: 'two', title: '단계 5. 조건 두 개 + 정렬', left: { title: 'FilterContact', code: 'string keyword = txtSearch.Text.Trim();\nstring group = cboFilter.SelectedItem as string ?? "전체";\nbool textOk = keyword == ""\n    || c.Name.Contains(keyword) || c.Phone.Contains(keyword);\nbool groupOk = group == "전체" || c.Group == group;\nreturn textOk && groupOk;', run: false }, right: { title: '보기 준비 (순서 중요)', code: 'view = CollectionViewSource.GetDefaultView(contacts);\nview.SortDescriptions.Add(\n    new SortDescription("Name", ListSortDirection.Ascending));\nview.Filter = FilterContact;\nlvContacts.ItemsSource = view;\ncboFilter.ItemsSource = filters;\ncboFilter.SelectedIndex = 0;   // 맨 마지막!', run: false },
            notes: '<p><b>[6분]</b> 왼쪽: 조건마다 bool 변수로 나누면 읽기 쉽고 조건을 더하기 쉽습니다(4교시 즐겨찾기 과제). <code>as string ?? "전체"</code> — 아직 아무것도 안 골랐으면 전체로.</p><p>오른쪽: SelectedIndex 를 view 준비보다 먼저 쓰면 NullReferenceException. 일부러 순서를 바꿔 실행해 보여 주면 기억에 남습니다.</p>' },
          { layout: 'bullets', title: 'Refresh 뒤에 선택 다시 잡기', lead: 'RefreshList = 다시 거르기 + 고치던 사람 다시 고르기 + 개수',
            bullets: ['<code>view.Refresh()</code> — 필터 · 정렬 다시 적용', '<code>lvContacts.SelectedItem = source</code> — 걸러졌으면 선택 없음', '<code>SelectionChanged</code> 는 <code>picked != source</code> 일 때만 폼을 바꿈', ['→ 검색하는 동안 폼에 쓰던 내용이 지워지지 않는다'], '개수: <code>view.Cast&lt;object&gt;().Count()</code> / <code>contacts.Count</code>'],
            notes: '<p><b>[3분]</b> 폼에 이름을 고치다가 검색 칸에 글자를 쳐도 폼의 내용이 유지되는 것을 시연합니다. 이것이 단계 3 의 <code>picked != source</code> 조건의 진짜 이유입니다.</p>' },
          { layout: 'diagram', title: '단계 6. JSON 파일', html: SVG_JSON, caption: 'ContactStore.Save / Load — 파일 코드는 한곳에',
            notes: '<p><b>[3분]</b> 1교시 준비 예제와 연결. 파일 형식을 나중에 CSV 나 데이터베이스로 바꾸더라도 ContactStore 만 고치면 됩니다.</p>' },
          { layout: 'code', title: 'ContactStore — 저장과 불러오기', code: SL_STORE, run: false, points: ['<code>Serialize</code> + <code>File.WriteAllText</code>', '<code>File.ReadAllText</code> + <code>Deserialize</code>', '<code>?? new List…</code> — null 대비', '실패하면 예외 → 화면 쪽에서 try/catch'],
            notes: '<p><b>[4분]</b> 본문 단계 6 에서 ContactStore.cs 전체를 보여 줍니다(using 포함). 옵션 객체를 static readonly 로 한 번만 만들어 재사용하는 것은 성능 · 가독성 모두에 좋은 습관입니다.</p>' },
          { layout: 'table', title: '파일 메뉴의 동작', head: ['메뉴', '대화상자', '코드'], rows: [
            ['시작할 때', '—', '<code>File.Exists</code> → <code>LoadFrom</code> / 예시'],
            ['저장', '없음', '<code>SaveTo(currentPath)</code>'],
            ['다른 이름으로 저장', 'SaveFileDialog', '<code>DefaultExt=".json"</code> → <code>SaveTo</code>'],
            ['열기', 'OpenFileDialog', '<code>LoadFrom</code> → <code>ShowFirst</code>']
          ], notes: '<p><b>[5분]</b> 본문 단계 6 을 실행: 한 명 추가 → 파일 ▸ 저장 → 예제를 다시 실행하면 그 사람이 남아 있음(브라우저는 같은 페이지 안에서만). 다른 이름으로 저장 → 열기로 파일을 오가 봅니다.</p><p>LoadFrom 이 contacts 를 Clear 후 Add 하는 이유(퀴즈 3번)를 질문으로 던지세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '파일에서 읽은 목록으로 바꿀 때 <code>contacts = new ObservableCollection&lt;Contact&gt;(loaded)</code> 로 바꿔 끼우면?', options: ['잘 동작한다', '보기 · 목록이 옛 컬렉션을 계속 보여 준다', '컴파일 오류 (readonly)', 'JSON 오류'], answer: 2, explain: '필드가 readonly 라 생성자 밖에서 대입하면 컴파일 오류입니다. readonly 가 아니었다면 화면은 옛 컬렉션을 보여 줬을 것입니다 — 그래서 Clear + Add.',
            notes: '<p>본문 퀴즈 3번과 같은 주제를 다른 각도로. readonly 가 실수를 컴파일 단계에서 막아 준다는 점을 짚어 줍니다.</p>' },
          { layout: 'practice', title: '실습 P6-5 · P6-6', desc: '<p><b>P6-5</b> 이름순 · 그룹순(기준 2개) · 최근 추가순 정렬 버튼 + 그룹별 인원(GroupBy). <b>P6-6</b> SaveFileDialog 로 CSV 내보내기 + 파일 내용 미리 보기.</p>', starter: P5_STARTER, solution: P5_SOLUTION,
            notes: '<p><b>[실습]</b> P6-5 가 끝나면 P6-6. P6-6 에서 엑셀이 한글을 깨뜨려 보이는 경우가 있는데, 이는 인코딩(BOM) 문제로 <code>File.WriteAllLines(path, lines, new UTF8Encoding(true))</code> 로 해결할 수 있다는 것을 빨리 끝난 학생에게 알려 주세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['보기: <code>Filter</code> · <code>SortDescriptions</code> · <code>Refresh()</code>', '조건은 bool 변수로 나누어 <code>&amp;&amp;</code>', 'view 준비 → ItemsSource → SelectedIndex 순서', 'ContactStore: JSON 저장 · 불러오기, try/catch', '시작할 때 자동 읽기 · 파일 대화상자'],
            notes: '<p>다음 시간: 저장 안 한 변경(*) · 닫기 전 확인 · 명령(Ctrl+S)으로 완성하고 확장 과제에 도전합니다.</p>' }
        ]
      },

      /* ===================== p06-4 ===================== */
      {
        id: 'p06-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '저장하지 않은 변경을 추적(isDirty)하고, 열기 · 닫기 전에 저장 여부를 물을 수 있다',
          'ApplicationCommands 로 메뉴와 단축키(Ctrl+O · Ctrl+S)를 연결할 수 있다',
          '완성 프로그램의 파일 구성과 데이터 흐름을 설명할 수 있다',
          'CSV 가져오기 · 즐겨찾기 중 하나 이상을 기존 구조를 살려 추가할 수 있다'
        ],
        flow: [['완성 프로그램 구조', 10], ['실행 · 점검', 8], ['개선 아이디어', 7], ['확장 과제', 20], ['발표 · 정리', 5]],
        content: [
          { type: 'h', text: '1. 완성 프로그램' },
          { type: 'p', html: '단계 6 에 세 가지를 더해 완성합니다. ① 추가 · 수정 · 삭제 때 <code>isDirty = true</code> 로 “저장 안 한 변경” 을 기억하고 제목에 <code>*</code> 를 붙입니다. ② 다른 파일을 열거나 창을 닫기 전에 <code>ConfirmSave()</code> 로 저장할지 묻습니다(<code>Closing</code> 이벤트에서 <code>e.Cancel = true</code> 면 닫히지 않음). ③ 파일 메뉴를 <b>명령</b>(<code>ApplicationCommands.Open · Save · SaveAs</code>)으로 바꿔 <kbd>Ctrl</kbd>+<kbd>O</kbd> · <kbd>Ctrl</kbd>+<kbd>S</kbd> 단축키가 동작하게 합니다. 모두 21장 메모장에서 배운 방법 그대로입니다.' },
          { type: 'table', head: ['파일', '내용', '줄 수(대략)'], rows: [
            ['<code>MainWindow.xaml</code>', '메뉴 · 상태 표시줄 · 검색 줄 · 목록 · 상세 폼', '60'],
            ['<code>MainWindow.xaml.cs</code>', '편집 흐름 · 검색 · 검사 표시 · 파일 메뉴', '250'],
            ['<code>Contact.cs</code>', '데이터 + INotifyPropertyChanged + Clone · CopyFrom', '50'],
            ['<code>ContactValidator.cs</code>', '정규식 규칙', '30'],
            ['<code>ContactStore.cs</code>', 'JSON 저장 · 불러오기', '30']
          ], caption: '완성 프로그램의 파일 구성' },
          { type: 'code', title: '완성 프로그램. WPF 주소록', code: EX_FINAL, desc: '메서드를 역할별로 모았습니다: <b>목록 ↔ 폼</b>(SelectionChanged · StartEdit · 네 버튼), <b>검색</b>(FilterContact · RefreshList · UpdateCount), <b>검사 표시</b>(ValidateForm · ClearErrors), <b>파일</b>(LoadFrom · SaveTo · 명령 처리기 · ConfirmSave · Closing). 추가 · 수정 · 삭제는 끝에서 모두 <code>MarkDirty(메시지)</code> 를 불러 “변경 있음 · 제목 갱신 · 상태 메시지” 를 한 번에 처리합니다. <code>SaveAs()</code> 의 <code>dlg.ShowDialog() == true &amp;&amp; SaveTo(…)</code> 는 대화상자에서 [저장] 을 누르고 <b>그리고</b> 저장에도 성공했을 때만 <code>true</code> 입니다(<code>&amp;&amp;</code> 는 왼쪽이 거짓이면 오른쪽을 실행하지 않음).' },
          { type: 'callout', kind: 'tip', title: '최종 점검 체크리스트', html: '<ul><li>☐ F2 목록에서 고르면 폼에 나타나고, 고치는 동안 목록은 그대로</li><li>☐ F4 [수정] 을 눌러야 목록에 반영, 이름이 바뀌면 이름순 자리로 이동</li><li>☐ F5 삭제는 [예] 일 때만, 삭제 뒤 폼이 비워짐</li><li>☐ F6 빈 이름 · <code>010-1234</code> · <code>hong@</code> → 빨간 테두리 + 문장, 원본은 그대로</li><li>☐ F7 “김” + 그룹 “가족” → 김하늘 한 명, 개수 표시 <code>1명 표시 / 전체 6명</code></li><li>☐ F8 저장 → 다시 실행하면 그대로, 망가진 JSON 을 열면 오류 창(프로그램은 계속)</li><li>☐ F9 고친 뒤 창을 닫으면 “저장할까요?” — [취소] 면 창이 남는다</li></ul>' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서', html: '<p>단축키는 실행 창을 한 번 클릭해 포커스를 준 뒤 누르세요. <kbd>Ctrl</kbd>+<kbd>N</kbd> · <kbd>Ctrl</kbd>+<kbd>W</kbd> 처럼 브라우저가 먼저 가져가는 키는 쓰지 않았습니다. 창의 ✕ 를 눌러 닫을 때도 <code>Closing</code> 이 불려 저장 확인 창이 뜹니다.</p>' },
          { type: 'h', text: '2. 더 좋게 만들려면?' },
          { type: 'callout', kind: 'more', title: '📘 MVVM 으로 바꾸기', html: '<p>지금은 모든 동작이 코드 비하인드(MainWindow.xaml.cs)에 있습니다. P05 에서 배운 MVVM 으로 바꾸면 <code>ContactsViewModel</code> 이 <code>Contacts</code> · <code>SelectedContact</code> · <code>Editing</code> · <code>SearchText</code> 속성과 <code>AddCommand</code> · <code>SaveCommand</code> 같은 <code>ICommand</code> 를 가지고, XAML 은 모두 바인딩으로 연결됩니다. 편집용 복사본 · 검사 · 저장 로직은 그대로 뷰모델로 옮기면 되므로, 이번에 역할별로 나눠 둔 것이 그대로 도움이 됩니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 바인딩에 검사 붙이기 — INotifyDataErrorInfo', html: '<p>실제 WPF 에서는 Contact 가 <code>INotifyDataErrorInfo</code> 를 구현하면(속성마다 오류 목록을 알려 줌) 바인딩된 TextBox 에 WPF 가 자동으로 빨간 테두리를 그립니다. 오류 문장을 툴팁으로 보여 주려면 <code>Validation.ErrorTemplate</code>(ControlTemplate)을 씁니다. 여러 화면에서 같은 모델을 쓸 때 편리한 방법입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 자동 저장과 백업', html: '<p>변경할 때마다 <code>SaveTo</code> 를 부르면 “저장” 메뉴 없이도 항상 파일이 최신입니다(휴대폰 앱 방식). 대신 실수로 모두 지우면 파일도 곧바로 비므로, 저장 전에 <code>File.Copy(path, path + ".bak", true)</code> 로 이전 파일을 백업해 두는 것이 안전합니다.</p>' },
          { type: 'h', text: '3. 확장 과제' },
          { type: 'list', items: [
            '<b>과제 1 (응용)</b> CSV 내보내기 · 가져오기 — 파일 메뉴에 두 항목, 가져올 때는 검사를 통과하고 전화번호가 겹치지 않는 사람만 추가',
            '<b>과제 2 (응용 · 도전)</b> 즐겨찾기 — Contact 에 <code>IsFavorite</code>, 목록에 ★ 열, 폼에 체크 상자, 검색 줄에 “★만” 필터'
          ] },
          { type: 'p', html: '두 과제 모두 기존 구조의 <b>정해진 자리</b>에 코드를 더하면 됩니다. CSV 는 파일 형식이므로 <code>ContactStore</code> 에, 메뉴 처리는 MainWindow 에. 즐겨찾기는 데이터이므로 <code>Contact</code>(속성 + <code>CopyFrom</code> 한 줄)에, 화면은 XAML 의 열 · 폼 · 검색 줄에, 조건은 <code>FilterContact</code> 에 한 줄. 어디에 무엇을 더해야 할지 바로 떠오른다면 설계가 잘 된 것입니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 배포하기', html: '<ul><li>솔루션 탐색기에서 프로젝트 오른쪽 클릭 ▸ <b>게시</b> ▸ <b>폴더</b> 를 고르면 친구에게 줄 수 있는 실행 파일 폴더가 만들어집니다. <b>배포 모드</b>를 “자체 포함(Self-contained)” 으로 하면 .NET 이 설치되지 않은 PC 에서도 실행됩니다.</li><li>게시한 프로그램의 작업 폴더는 실행 파일이 있는 폴더이므로 <code>contacts.json</code> 도 그 옆에 생깁니다. 바탕 화면 바로 가기로 실행하면 작업 폴더가 달라질 수 있으니 실제 배포용으로는 <code>AppData</code> 폴더(3교시 vs 상자)를 쓰세요.</li><li>프로젝트 속성 ▸ <b>애플리케이션 ▸ 아이콘</b> 에서 .ico 파일을 지정하면 창과 작업 표시줄에 내 아이콘이 나옵니다.</li></ul>' }
        ],
        practice: [
          {
            title: '확장 과제 1. CSV 내보내기 · 가져오기',
            level: 2,
            desc: '<p>완성 프로그램의 파일 메뉴에 <b>CSV 로 내보내기</b> · <b>CSV 가져오기</b> 를 완성하세요. (메뉴 항목과 빈 처리기는 뼈대에 있습니다.)</p><ul><li><code>ContactStore</code> 에 <code>SaveCsv(path, contacts)</code>: 머리글 <code>이름,전화,이메일,그룹</code> + 한 사람에 한 줄 (값 안의 쉼표는 공백으로)</li><li><code>ContactStore</code> 에 <code>LoadCsv(path, out int skipped)</code>: 머리글을 건너뛰고, 칸이 4개인 줄만 Contact 로 만들기 (아닌 줄은 skipped 에 세기)</li><li>가져오기: 검사(<code>ContactValidator.Check</code>)를 통과하고 <b>같은 전화번호가 없는</b> 사람만 추가 → <code>CSV 에서 2명을 가져왔습니다. (건너뜀 1줄)</code> 표시, 변경 있음(*)</li></ul>',
            hint: '<code>string.Join(",", Clean(c.Name), …)</code>, <code>File.WriteAllLines</code> / <code>File.ReadAllLines</code>. 읽기는 <code>for (int i = 1; i &lt; lines.Length; i++)</code> 로 0번(머리글)을 건너뜁니다. 중복: <code>contacts.Any(x =&gt; x.Phone == c.Phone)</code>. 시험용 CSV 는 먼저 내보내기로 만들고, 메모장 대신 실습 P6-6 처럼 코드로 한 줄 망가뜨린 파일을 만들어 볼 수도 있습니다.',
            starter: X1_STARTER,
            solution: X1_SOLUTION
          },
          {
            title: '확장 과제 2. 즐겨찾기(★)',
            level: 3,
            desc: '<p>자주 연락하는 사람을 즐겨찾기로 표시하세요.</p><ul><li><code>Contact</code> 에 <code>bool IsFavorite</code> 속성(변경 알림) — <b><code>CopyFrom</code> 에도 한 줄 추가</b>해야 복사본 · 수정이 제대로 동작합니다.</li><li>목록 맨 앞에 ★ 열: Contact 에 계산 속성 <code>Star</code>(<code>IsFavorite ? "★" : ""</code>)를 두고 <code>DisplayMemberBinding</code>. <code>IsFavorite</code> 가 바뀔 때 <code>Star</code> 의 변경도 알려야 합니다. <code>Star</code> 는 <code>[JsonIgnore]</code> 로 파일에 저장하지 않습니다.</li><li>폼에 <code>즐겨찾기 ★</code> CheckBox(<code>IsChecked="{Binding IsFavorite}"</code>)</li><li>검색 줄에 <code>★만</code> CheckBox — 체크하면 즐겨찾기만 보이게 <code>FilterContact</code> 에 조건 한 줄, <code>Click</code> 에서 <code>RefreshList()</code></li></ul>',
            hint: '<code>set { isFavorite = value; OnPropertyChanged(); OnPropertyChanged(nameof(Star)); }</code>. <code>[JsonIgnore]</code> 는 <code>using System.Text.Json.Serialization;</code>. 필터: <code>if (chkFavOnly.IsChecked == true &amp;&amp; !c.IsFavorite) return false;</code>. 검색 칸 너비(120)에 맞춰 체크 상자 글자를 짧게 하세요. 저장한 JSON 에 <code>"IsFavorite": true</code> 가 생기는지 확인!',
            starter: X2_STARTER,
            solution: X2_SOLUTION
          }
        ],
        quiz: [
          { q: '창의 <code>Closing</code> 이벤트에서 <code>e.Cancel = true;</code> 를 하면?', options: ['창이 강제로 닫힌다', '프로그램이 종료된다', '창이 닫히지 않고 그대로 남는다', '저장 대화상자가 자동으로 뜬다'], answer: 2, explain: '<code>Closing</code> 은 “닫히기 직전” 에 불리며, <code>Cancel</code> 을 true 로 하면 닫기를 취소합니다. ConfirmSave 에서 [취소] 를 고른 경우입니다.' },
          { q: '확장 과제 2 에서 <code>IsFavorite</code> 속성을 추가하고 <code>CopyFrom</code> 에 한 줄을 빠뜨리면?', options: ['컴파일 오류가 난다', '폼에서 ★ 를 체크하고 [수정] 해도 원본(목록)에는 반영되지 않는다', 'JSON 저장이 실패한다', '아무 문제 없다'], answer: 1, explain: 'Clone 과 [수정] 이 모두 CopyFrom 으로 값을 옮기므로, 여기서 빠진 속성은 복사본 ⇄ 원본 사이를 오가지 못합니다. 속성을 추가할 때 함께 고쳐야 할 곳을 기억하세요.' },
          { q: 'MainWindow 의 코드를 거의 고치지 않고 파일 형식을 JSON 에서 XML 로 바꾸려면 주로 어디를 고치는가?', options: ['ContactStore 의 Save · Load', 'ContactValidator', 'Contact 의 INotifyPropertyChanged', 'MainWindow.xaml 의 ListView'], answer: 0, explain: '파일을 다루는 코드를 ContactStore 한곳에 모아 두었기 때문입니다. 화면은 <code>ContactStore.Save</code> / <code>Load</code> 가 “어떻게” 저장하는지 모릅니다.' },
          { q: '<code>return dlg.ShowDialog() == true &amp;&amp; SaveTo(dlg.FileName);</code> 에서 사용자가 [취소] 를 누르면?', options: ['SaveTo 가 빈 이름으로 불린다', '예외가 발생한다', 'SaveTo 가 먼저 불린 뒤 false 가 된다', 'SaveTo 는 불리지 않고 false 를 돌려준다'], answer: 3, explain: '<code>&amp;&amp;</code> 는 왼쪽이 false 이면 오른쪽을 계산하지 않습니다(단락 평가, 3장). 그래서 취소하면 저장하지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: 'Project 06 · Section 04 — 저장 확인 · 명령 · 확장 과제', badge: 'P06-4',
            notes: '<p><b>[도입]</b> 단계 6 을 실행하고 한 명을 고친 뒤 창을 닫아 봅니다 — 아무것도 묻지 않고 닫혀 변경이 사라집니다. “이걸 막으려면?” — 21장 메모장의 isDirty · Closing 을 떠올리게 합니다.</p>' },
          { layout: 'table', title: '완성 프로그램의 구성', head: ['파일', '역할'], rows: [
            ['MainWindow.xaml', '메뉴 · 검색 줄 · 목록 · 폼 · 상태 표시줄'],
            ['MainWindow.xaml.cs', '편집 흐름 · 검색 · 검사 표시 · 파일 메뉴'],
            ['Contact.cs', '데이터 · 변경 알림 · Clone · CopyFrom'],
            ['ContactValidator.cs', '정규식 규칙'],
            ['ContactStore.cs', 'JSON 저장 · 불러오기']
          ], notes: '<p><b>[4분]</b> 완성 프로그램을 실행하며 파일마다 “이 기능은 어디에 있나?” 를 학생에게 묻습니다. 예: 전화번호 규칙을 바꾸려면? → ContactValidator.</p>' },
          { layout: 'bullets', title: '단계 6 에 더한 세 가지', lead: '모두 21장 메모장에서 배운 방법',
            bullets: ['<code>isDirty</code> + 제목의 <code>*</code> — <code>MarkDirty(메시지)</code> 한곳에서', '<code>ConfirmSave()</code> — 열기 전 · 닫기 전 (예 · 아니요 · 취소)', '<code>Closing</code> 에서 <code>e.Cancel = true</code> 면 안 닫힘', '<code>ApplicationCommands.Open · Save · SaveAs</code> + <code>CommandBinding</code>', ['메뉴에 Ctrl+O · Ctrl+S 가 저절로 표시 · 동작']],
            notes: '<p><b>[4분]</b> 한 명 고치기 → 제목에 * → Ctrl+S → * 사라짐 → 다시 고치고 ✕ → 저장할까요? [취소] → 창이 남음.</p>' },
          { layout: 'code', title: '저장 확인 — ConfirmSave · Closing', code: SL_CONFIRM, run: false, points: ['바뀐 게 없으면 바로 통과', '예 → 저장 (실패하면 false)', '취소 → false → 진행하지 않음', 'Closing: false 면 <code>e.Cancel = true</code>'],
            notes: '<p><b>[3분]</b> 세 갈래(예 · 아니요 · 취소)를 칠판에 순서도로. “저장하다 실패하면?” — SaveTo 가 false 를 돌려주므로 닫히지 않습니다. 사용자의 데이터를 지키는 방향으로 설계합니다.</p>' },
          { layout: 'bullets', title: '실행 · 점검', lead: '체크리스트로 요구사항 F1 ~ F9 를 하나씩',
            bullets: ['F6: 빈 이름 · <code>010-1234</code> · <code>hong@</code> → 원본은 그대로', 'F7: “김” + 가족 → <code>1명 표시 / 전체 6명</code>', 'F8: 저장 → 다시 실행 → 그대로 / 망가진 JSON → 오류 창', 'F9: 고친 뒤 닫기 → 저장할까요? [취소] → 창 유지', '짝과 바꿔서 서로의 프로그램을 “망가뜨려” 보기'],
            notes: '<p><b>[8분]</b> 짝 점검이 효과적입니다. 남의 프로그램에 이상한 입력을 넣어 보라고 하면 학생들이 즐거워하고, 자기가 생각하지 못한 경우를 발견합니다.</p>' },
          { layout: 'bullets', title: '더 좋게 만들려면', bullets: ['MVVM (P05) — 뷰모델 + ICommand + 바인딩', '<code>INotifyDataErrorInfo</code> — WPF 가 그리는 빨간 테두리', '자동 저장 + <code>.bak</code> 백업', 'AppData 폴더에 저장 · 게시(배포)'],
            notes: '<p><b>[3분]</b> 본문의 “더 알아보기” 상자를 간단히 소개만 합니다. 관심 있는 학생에게 과제 대신 MVVM 전환을 권해도 좋습니다.</p>' },
          { layout: 'table', title: '확장 과제', head: ['과제', '고칠 곳'], rows: [
            ['1. CSV 내보내기 · 가져오기', 'ContactStore(SaveCsv · LoadCsv) + 메뉴 처리기 두 개'],
            ['2. 즐겨찾기 ★', 'Contact(속성 · CopyFrom · Star) + XAML 세 곳 + FilterContact 한 줄']
          ], notes: '<p><b>[20분]</b> 과제 1 은 10장 파일 입출력 복습, 과제 2 는 “속성 하나를 추가할 때 고칠 곳” 을 찾는 연습입니다. 과제 2 에서 CopyFrom 을 빠뜨려 ★ 가 저장되지 않는 실수가 가장 흔합니다 — 일부러 겪게 두었다가 퀴즈 2번으로 정리하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '즐겨찾기 과제에서 CopyFrom 에 <code>IsFavorite = other.IsFavorite;</code> 를 빠뜨리면?', options: ['컴파일 오류', '★ 를 체크하고 [수정] 해도 목록에 반영되지 않는다', 'JSON 저장 실패', '문제없다'], answer: 1, explain: 'Clone 과 수정이 모두 CopyFrom 으로 값을 옮깁니다.',
            notes: '<p>“속성을 추가할 때 함께 고칠 곳 목록” 을 학생들과 함께 만들어 보세요: 필드 · 속성 · CopyFrom · 화면 · (필요하면) 검사 · 필터.</p>' },
          { layout: 'practice', title: '확장 과제 1. CSV', desc: '<p>파일 메뉴의 CSV 내보내기 · 가져오기를 완성 (가져올 때 검사 · 중복 전화번호 건너뛰기). 끝나면 확장 과제 2(즐겨찾기).</p>', starter: X1_STARTER, solution: X1_SOLUTION,
            notes: '<p><b>[과제]</b> 가져오기를 시험하려면 먼저 내보내기로 CSV 를 만든 뒤, 새 사람을 몇 명 지우고 가져오기 → 지운 사람만 다시 들어오는지(중복 건너뛰기) 확인하게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구사항 → 설계 → 단계별 구현 → 점검 → 확장', '편집용 복사본 = 검사할 자리 + 공짜 취소', '보기(ICollectionView)로 검색 · 정렬, 원본은 그대로', 'JSON 저장 · 불러오기는 ContactStore 한곳에', '저장 안 한 변경은 반드시 확인'],
            notes: '<p><b>[발표 5분]</b> 확장 과제를 한 학생에게 시연시키고, “어느 파일의 어디를 고쳤는지” 를 설명하게 합니다. 다음 프로젝트 P07 은 그림판 — 마우스와 도형입니다.</p>' }
        ]
      }
    ]
  });
})();
