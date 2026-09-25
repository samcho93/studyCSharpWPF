/* Chapter 07. 배열과 컬렉션 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_ARRAY = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="배열은 같은 자료형의 칸이 나란히 붙은 상자">
  <defs><marker id="ah7a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)"><tspan style="${MONO}">int[] scores = new int[5];</tspan>   →   int 칸 5개가 나란히 붙은 상자, 이름표는 scores 하나</text>
  <text x="130" y="245" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent)">scores</text>
  <line x1="185" y1="235" x2="255" y2="235" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7a)"/>
  <g>
    <text x="345" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">[0]</text>
    <rect x="270" y="170" width="150" height="120" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="345" y="248" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--fg)">90</text>
    <text x="505" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">[1]</text>
    <rect x="430" y="170" width="150" height="120" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="505" y="248" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--fg)">85</text>
    <text x="665" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">[2]</text>
    <rect x="590" y="170" width="150" height="120" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="665" y="248" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--fg)">77</text>
    <text x="825" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">[3]</text>
    <rect x="750" y="170" width="150" height="120" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="825" y="248" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--muted)">0</text>
    <text x="985" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">[4]</text>
    <rect x="910" y="170" width="150" height="120" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="985" y="248" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--muted)">0</text>
    <rect x="1070" y="170" width="150" height="120" rx="10" fill="none" stroke="var(--danger)" stroke-width="3" stroke-dasharray="10 8"/>
    <text x="1145" y="150" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--danger)">[5] ?</text>
    <text x="1145" y="248" text-anchor="middle" style="font-size:40px;fill:var(--danger)">✗</text>
  </g>
  <text x="640" y="330" text-anchor="middle" style="font-size:21px;fill:var(--muted)">값을 넣지 않은 칸은 자료형의 기본값(int 는 0, string 은 null)</text>
  <text x="640" y="400" text-anchor="middle" style="font-size:24px;fill:var(--fg)">인덱스(index)는 <tspan font-weight="700">0 부터</tspan> 시작 — 첫 칸 <tspan style="${MONO}">scores[0]</tspan>, 마지막 칸 <tspan style="${MONO}">scores[4]</tspan> = <tspan style="${MONO}">scores[scores.Length - 1]</tspan></text>
  <text x="640" y="450" text-anchor="middle" style="font-size:24px;fill:var(--fg)"><tspan style="${MONO}" font-weight="700">scores.Length</tspan> = 5 (칸 수). 만들 때 정한 크기는 나중에 바꿀 수 없다</text>
  <text x="640" y="510" text-anchor="middle" style="font-size:22px;fill:var(--danger)">없는 칸 scores[5] 를 읽거나 쓰면 실행 중 IndexOutOfRangeException 으로 프로그램이 멈춘다</text>
</svg>`;

  const SVG_REF = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="값 형식은 값이 복사되고, 배열(참조 형식)은 주소가 복사된다">
  <defs><marker id="ah7b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="320" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">값 형식(int) — 값이 복사된다</text>
  <text x="320" y="95" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">int x = 10;  int y = x;  y = 20;</text>
  <rect x="120" y="150" width="170" height="110" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="205" y="140" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">x</text>
  <text x="205" y="222" text-anchor="middle" style="${MONO};font-size:42px;fill:var(--fg)">10</text>
  <rect x="350" y="150" width="170" height="110" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="435" y="140" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">y</text>
  <text x="435" y="222" text-anchor="middle" style="${MONO};font-size:42px;fill:var(--fg)">20</text>
  <text x="320" y="320" text-anchor="middle" style="font-size:22px;fill:var(--muted)">상자가 두 개 — y 를 바꿔도 x 는 그대로 10</text>
  <line x1="640" y1="30" x2="640" y2="420" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="960" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">참조 형식(배열) — 주소가 복사된다</text>
  <text x="960" y="95" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">int[] a = { 1, 2, 3 };  int[] b = a;  b[0] = 99;</text>
  <rect x="700" y="130" width="130" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="765" y="120" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">a</text>
  <text x="765" y="181" text-anchor="middle" style="font-size:22px;fill:var(--muted)">주소 ●</text>
  <rect x="700" y="250" width="130" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="765" y="240" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">b</text>
  <text x="765" y="301" text-anchor="middle" style="font-size:22px;fill:var(--muted)">주소 ●</text>
  <line x1="835" y1="170" x2="940" y2="215" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7b)"/>
  <line x1="835" y1="290" x2="940" y2="245" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7b)"/>
  <rect x="950" y="185" width="90" height="90" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="995" y="245" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--danger)">99</text>
  <rect x="1040" y="185" width="90" height="90" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="1085" y="245" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">2</text>
  <rect x="1130" y="185" width="90" height="90" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="1175" y="245" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">3</text>
  <text x="1085" y="170" text-anchor="middle" style="font-size:20px;fill:var(--accent2)">힙(heap)에 있는 실제 배열 하나</text>
  <text x="960" y="320" text-anchor="middle" style="font-size:22px;fill:var(--muted)">배열은 하나 — b[0] 을 바꾸면 a[0] 도 99 (같은 배열을 두 이름으로 부른다)</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)">별도의 복사본이 필요하면 <tspan style="${MONO}" font-weight="700">Array.Copy(a, c, a.Length)</tspan> 또는 <tspan style="${MONO}" font-weight="700">(int[])a.Clone()</tspan></text>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--muted)">메서드에 배열을 넘길 때도 주소가 전달되므로, 메서드 안에서 바꾸면 원본이 바뀐다</text>
</svg>`;

  const SVG_LIST = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="크기가 고정된 배열과 늘어나는 List">
  <defs><marker id="ah7c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  <text x="80" y="60" style="font-size:26px;font-weight:700;fill:var(--warn)">배열 — 크기 고정</text>
  <text x="80" y="100" style="${MONO};font-size:22px;fill:var(--fg)">int[] a = new int[3];</text>
  <rect x="80" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="135" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">1</text>
  <rect x="200" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="255" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">2</text>
  <rect x="320" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="375" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">3</text>
  <rect x="440" y="130" width="110" height="90" rx="8" fill="none" stroke="var(--danger)" stroke-width="3" stroke-dasharray="10 8"/>
  <text x="495" y="192" text-anchor="middle" style="font-size:36px;fill:var(--danger)">✗</text>
  <text x="80" y="265" style="font-size:21px;fill:var(--muted)">a[3] = 4;  → 4번째 칸이 없다 (IndexOutOfRangeException)</text>
  <text x="80" y="300" style="font-size:21px;fill:var(--muted)">칸 수는 a.Length · 중간에 끼워 넣기 · 지우기가 번거롭다</text>
  <text x="700" y="60" style="font-size:26px;font-weight:700;fill:var(--ok)">List&lt;T&gt; — 필요하면 늘어난다</text>
  <text x="700" y="100" style="${MONO};font-size:22px;fill:var(--fg)">List&lt;int&gt; list = new List&lt;int&gt; { 1, 2, 3 };</text>
  <rect x="700" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="755" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">1</text>
  <rect x="820" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="875" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">2</text>
  <rect x="940" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="995" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">3</text>
  <rect x="1060" y="130" width="110" height="90" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1115" y="190" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--ok)">4</text>
  <line x1="1115" y1="60" x2="1115" y2="118" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah7c)"/>
  <text x="1190" y="70" style="${MONO};font-size:22px;fill:var(--ok)">Add(4)</text>
  <text x="700" y="265" style="font-size:21px;fill:var(--muted)">list.Add(4);  → 뒤에 칸이 하나 생긴다.  개수는 list.Count (= 4)</text>
  <text x="700" y="300" style="font-size:21px;fill:var(--muted)">Insert(위치, 값) · Remove(값) · RemoveAt(위치) · Contains · Sort …</text>
  <line x1="640" y1="30" x2="640" y2="330" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="640" y="400" text-anchor="middle" style="font-size:24px;fill:var(--fg)">List 의 속은 배열이다 — 꽉 차면 <tspan font-weight="700">두 배 크기의 새 배열</tspan>을 만들어 옮겨 담는다 (우리는 신경 쓸 필요 없음)</text>
  <text x="640" y="450" text-anchor="middle" style="font-size:24px;fill:var(--fg)">&lt;T&gt; 는 <tspan font-weight="700">제네릭(generic)</tspan>: T 자리에 담을 자료형을 쓴다 — List&lt;int&gt;, List&lt;string&gt;, List&lt;double&gt;</text>
  <text x="640" y="510" text-anchor="middle" style="font-size:22px;fill:var(--muted)">개수를 미리 알면 배열, 실행 중에 늘고 줄면 List — 실무에서는 List 를 훨씬 많이 쓴다</text>
</svg>`;

  const SVG_COLL = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Queue, Stack, HashSet 의 동작">
  <defs><marker id="ah7d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="230" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">Queue&lt;T&gt; — 줄 서기</text>
  <text x="230" y="85" text-anchor="middle" style="font-size:21px;fill:var(--muted)">먼저 넣은 것이 먼저 나온다 (FIFO)</text>
  <text x="80" y="200" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--accent)">Dequeue</text>
  <line x1="160" y1="230" x2="60" y2="230" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7d)"/>
  <rect x="170" y="190" width="70" height="80" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="205" y="245" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">1</text>
  <rect x="250" y="190" width="70" height="80" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="285" y="245" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">2</text>
  <rect x="330" y="190" width="70" height="80" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="365" y="245" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">3</text>
  <line x1="500" y1="230" x2="410" y2="230" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7d)"/>
  <text x="460" y="200" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--accent)">Enqueue</text>
  <text x="230" y="330" text-anchor="middle" style="font-size:20px;fill:var(--muted)">은행 번호표 · 프린터 인쇄 대기 · 메시지 처리</text>
  <text x="230" y="365" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">Enqueue · Dequeue · Peek · Count</text>
  <line x1="450" y1="30" x2="450" y2="400" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="640" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">Stack&lt;T&gt; — 접시 쌓기</text>
  <text x="640" y="85" text-anchor="middle" style="font-size:21px;fill:var(--muted)">마지막에 넣은 것이 먼저 나온다 (LIFO)</text>
  <rect x="590" y="290" width="100" height="60" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="332" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">1</text>
  <rect x="590" y="220" width="100" height="60" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="262" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">2</text>
  <rect x="590" y="150" width="100" height="60" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="192" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">3</text>
  <line x1="560" y1="100" x2="560" y2="140" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7d)"/>
  <text x="525" y="125" text-anchor="end" style="${MONO};font-size:20px;fill:var(--accent)">Push</text>
  <line x1="720" y1="140" x2="720" y2="100" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah7d)"/>
  <text x="755" y="125" text-anchor="start" style="${MONO};font-size:20px;fill:var(--accent)">Pop</text>
  <text x="640" y="395" text-anchor="middle" style="font-size:20px;fill:var(--muted)">뒤로 가기 · 실행 취소(Undo) · 괄호 짝 검사</text>
  <line x1="830" y1="30" x2="830" y2="400" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="1055" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">HashSet&lt;T&gt; — 중복 없는 집합</text>
  <text x="1055" y="85" text-anchor="middle" style="font-size:21px;fill:var(--muted)">같은 값은 한 번만 들어간다</text>
  <rect x="900" y="150" width="310" height="150" rx="75" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1055" y="240" text-anchor="middle" style="${MONO};font-size:34px;fill:var(--fg)">3   1   5   9</text>
  <text x="1055" y="345" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--danger)">Add(3) → false (이미 있음)</text>
  <text x="1055" y="380" text-anchor="middle" style="font-size:20px;fill:var(--muted)">중복 제거 · “있나?” 빠른 검사 (Contains)</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)">모두 <tspan style="${MONO}" font-weight="700">System.Collections.Generic</tspan> 에 들어 있다 — 상황에 맞는 그릇을 고르는 것이 핵심</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--muted)">순서 있는 목록 List · 키로 찾기 Dictionary · 줄 서기 Queue · 쌓기 Stack · 중복 없음 HashSet</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch07',
    no: '07',
    title: '배열과 컬렉션',
    subtitle: 'Arrays & Collections',
    summary: '같은 자료형의 값 여러 개를 한 이름으로 묶어 다루는 배열과, 크기가 자유롭게 늘어나는 컬렉션(List · Dictionary · Queue · Stack · HashSet)을 배웁니다. 인덱스와 반복문으로 데이터를 순회 · 검색 · 정렬하고, 상황에 맞는 그릇을 고르는 법을 익힙니다.',
    goals: [
      '배열을 선언 · 생성 · 초기화하고 인덱스와 Length 로 요소에 접근할 수 있다',
      'for · foreach 로 배열을 순회해 합 · 평균 · 최댓값 · 검색을 구현할 수 있다',
      '배열이 참조 형식임을 이해하고 Array 클래스의 메서드와 2차원 배열을 사용할 수 있다',
      'List<T> 로 항목을 추가 · 삭제 · 검색 · 정렬할 수 있다',
      'Dictionary · Queue · Stack · HashSet 의 용도를 구분해 사용할 수 있다'
    ],
    sections: [
      /* ===================== ch07-1 ===================== */
      {
        id: 'ch07-1',
        title: '배열',
        minutes: 50,
        goals: [
          '배열이 필요한 이유와 배열의 구조(인덱스 · Length)를 설명할 수 있다',
          '배열을 선언 · 생성 · 초기화하고 for · foreach 로 순회할 수 있다',
          '배열이 참조 형식임을 이해하고 Array.Sort · Reverse · IndexOf · Copy 를 사용할 수 있다',
          '2차원 배열을 만들고 행 · 열로 순회할 수 있다'
        ],
        flow: [['도입: 변수 30개?', 5], ['배열 선언 · 인덱스 · Length', 12], ['for · foreach 순회, 합 · 평균 · 최댓값', 12], ['참조 형식 · Array 메서드 · 2차원 배열', 13], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '배열이 필요한 이유' },
          { type: 'p', html: '학생 30명의 점수를 저장하려면 변수가 30개 필요할까요? <code>score1, score2, … score30</code> 을 선언하고 평균을 내려면 30개를 일일이 더해야 합니다. 학생이 31명이 되면 코드를 고쳐야 하고요. <b>배열(array)</b>은 <b>같은 자료형의 값 여러 개를 한 이름으로 묶어</b> 두고, <b>번호(인덱스, index)</b>로 하나씩 꺼내 쓰는 구조입니다. 번호가 있으니 반복문과 짝을 이루어 “30개든 300개든 같은 코드”로 처리할 수 있습니다.' },
          { type: 'figure', html: SVG_ARRAY, caption: '배열 = 같은 자료형의 칸이 나란히 붙은 상자. 인덱스는 0 부터, 칸 수는 Length' },
          { type: 'h', text: '배열 선언 · 생성 · 초기화' },
          { type: 'table', head: ['형태', '예', '설명'], rows: [
            ['<code>자료형[] 이름 = new 자료형[크기];</code>', '<code>int[] scores = new int[5];</code>', '크기만 정해 만든다. 모든 칸은 <b>기본값</b>(int 0, bool false, string null)'],
            ['<code>자료형[] 이름 = { 값, 값, … };</code>', '<code>int[] a = { 1, 2, 3 };</code>', '값을 나열하면 <b>크기는 자동</b>(3). 가장 간단한 형태'],
            ['<code>… = new 자료형[] { 값, … };</code>', '<code>double[] t = new double[] { 21.5, 23.0 };</code>', '위와 같지만 선언과 대입을 따로 할 때도 쓸 수 있다'],
            ['<code>이름[인덱스]</code>', '<code>scores[0] = 90;</code> <code>int x = scores[2];</code>', '읽기 · 쓰기 모두 <code>[ ]</code>. 인덱스는 <b>0 부터 Length − 1</b> 까지'],
            ['<code>이름.Length</code>', '<code>scores.Length</code> → 5', '칸 수(요소 개수). 읽기 전용']
          ], caption: '배열을 만드는 세 가지 표기와 요소 접근' },
          { type: 'code', title: '예제 7-1. 배열 선언 · 생성 · 초기화와 인덱스', code: `using System;

class Program
{
    static void Main()
    {
        int[] scores = new int[5];        // int 칸 5개짜리 배열 (모두 0)
        scores[0] = 90;                   // 첫 번째 칸
        scores[1] = 85;
        scores[2] = 77;
        Console.WriteLine(scores[0]);
        Console.WriteLine(scores[3]);     // 값을 넣지 않은 칸은 기본값 0
        Console.WriteLine(scores.Length); // 칸 수

        string[] names = { "홍길동", "김철수", "이영희" };   // 값을 나열해 초기화 (크기 3)
        Console.WriteLine(names[1]);
        Console.WriteLine(names.Length);
        Console.WriteLine(names[names.Length - 1]);        // 마지막 요소

        double[] temps = new double[] { 21.5, 23.0, 19.8 };
        Console.WriteLine(temps[2]);
    }
}`, expect: `90
0
5
김철수
3
이영희
19.8`, desc: '<code>new int[5]</code> 는 “int 칸 5개를 만들어라”이고, <code>{ … }</code> 는 “이 값들로 채워라”입니다. <b>마지막 요소의 인덱스는 <code>Length - 1</code></b> 입니다 — 칸이 5개면 인덱스는 0, 1, 2, 3, 4.' },
          { type: 'callout', kind: 'warn', title: '인덱스는 0 부터! 범위를 벗어나면 IndexOutOfRangeException', html: '칸이 3개인 배열의 인덱스는 <b>0, 1, 2</b> 입니다. <code>arr[3]</code> 은 “4번째 칸”이라 존재하지 않고, 컴파일은 되지만 <b>실행 중에 <code>IndexOutOfRangeException</code></b> 이 발생해 프로그램이 멈춥니다. 반복문 조건을 <code>i &lt;= arr.Length</code> 로 쓰는 것이 이 오류의 단골 원인입니다 — 항상 <code>i &lt; arr.Length</code> 로 쓰세요.' },
          { type: 'code', title: '추가 예제. 일부러 범위를 벗어나 보기', code: `using System;

class Program
{
    static void Main()
    {
        int[] arr = { 10, 20, 30 };
        Console.WriteLine(arr[2]);     // 마지막 요소 (인덱스 2)
        Console.WriteLine(arr[3]);     // 4번째 칸은 없다! → 예외
        Console.WriteLine("이 줄은 실행되지 않습니다");
    }
}`, expectError: true, expect: `30`, desc: '<code>30</code> 이 출력된 뒤 <b>처리되지 않은 예외</b> 메시지가 나오고 프로그램이 멈춥니다. 예외 메시지에서 <b>예외 이름</b>과 <b>발생한 줄</b>을 읽는 연습을 하세요. 예외를 잡아 처리하는 방법은 10장에서 배웁니다.' },
          { type: 'h', text: 'for 와 foreach 로 순회하기' },
          { type: 'p', html: '배열의 힘은 <b>반복문</b>과 만날 때 나옵니다. <code>for</code> 는 <b>인덱스 <code>i</code> 를 0 부터 <code>Length - 1</code> 까지</b> 돌리며 <code>arr[i]</code> 로 접근하고, <code>foreach</code> 는 인덱스 없이 <b>“요소를 하나씩 꺼내 달라”</b>고만 합니다. 인덱스(몇 번째인지)가 필요하면 <code>for</code>, 값만 필요하면 <code>foreach</code> 가 간단합니다.' },
          { type: 'code', title: '예제 7-2. for · foreach 로 합계 · 평균 · 최댓값 구하기', code: `using System;

class Program
{
    static void Main()
    {
        int[] scores = { 90, 85, 77, 92, 68 };

        // for: 인덱스로 순회 — "몇 번째"가 필요할 때
        for (int i = 0; i < scores.Length; i++)
        {
            Console.WriteLine($"scores[{i}] = {scores[i]}");
        }

        // foreach: 값만 차례로 꺼내기 — 합계
        int sum = 0;
        foreach (int s in scores)
        {
            sum += s;
        }
        double avg = (double)sum / scores.Length;
        Console.WriteLine($"합계 = {sum}, 평균 = {avg:F1}");

        // 최댓값 찾기: 첫 요소를 후보로 두고 더 큰 값이 나오면 바꾼다
        int max = scores[0];
        foreach (int s in scores)
        {
            if (s > max) max = s;
        }
        Console.WriteLine($"최고점 = {max}");

        // 검색: 77 은 몇 번째에 있나?
        int found = -1;
        for (int i = 0; i < scores.Length; i++)
        {
            if (scores[i] == 77) { found = i; break; }
        }
        Console.WriteLine($"77 의 위치 = {found}");
    }
}`, expect: `scores[0] = 90
scores[1] = 85
scores[2] = 77
scores[3] = 92
scores[4] = 68
합계 = 412, 평균 = 82.4
최고점 = 92
77 의 위치 = 2`, desc: '합계 · 최댓값 · 검색은 배열 문제의 <b>기본 3종</b>입니다. 최댓값은 <code>scores[0]</code> 을 후보로 시작해야 하고(0 으로 시작하면 모두 음수일 때 틀립니다), 검색은 찾으면 <code>break</code> 로 빠져나오고 못 찾으면 <code>-1</code> 을 남깁니다. 평균은 <code>(double)sum</code> 으로 <b>실수 나눗셈</b>을 만든 점에 주의하세요.' },
          { type: 'callout', kind: 'tip', title: 'foreach 변수는 읽기 전용', html: '<code>foreach (int s in scores) { s = 0; }</code> 처럼 반복 변수에 대입하면 컴파일 오류(CS1656)입니다. 배열의 <b>값을 바꾸려면 <code>for</code> 와 인덱스</b>를 쓰세요: <code>for (int i = 0; i &lt; scores.Length; i++) scores[i] += 5;</code>' },
          { type: 'h', text: '배열은 참조 형식이다' },
          { type: 'p', html: '<code>int x = 10; int y = x;</code> 는 값 10 이 <b>복사</b>되어 상자가 두 개 생깁니다. 하지만 배열은 <b>참조 형식(reference type)</b>이라 변수에는 배열의 <b>주소</b>만 들어 있습니다. <code>int[] b = a;</code> 는 배열을 복사하는 것이 아니라 <b>같은 배열을 가리키는 이름표를 하나 더 붙이는 것</b>입니다. 그래서 <code>b</code> 를 통해 바꾸면 <code>a</code> 로 봐도 바뀌어 있습니다.' },
          { type: 'figure', html: SVG_REF, caption: '값 형식은 상자가 복사되고, 배열은 주소가 복사되어 하나의 배열을 두 이름이 가리킨다' },
          { type: 'code', title: '예제 7-3. 대입하면 같은 배열을 가리킨다 — Copy 와 Clone', code: `using System;

class Program
{
    static void Main()
    {
        int[] a = { 1, 2, 3 };
        int[] b = a;                  // 복사가 아니라 "같은 배열"을 가리킨다
        b[0] = 99;
        Console.WriteLine($"a[0] = {a[0]}, b[0] = {b[0]}");

        int[] c = new int[a.Length];
        Array.Copy(a, c, a.Length);   // 진짜 복사: 새 배열 c 에 값을 옮겨 담는다
        c[0] = 1;
        Console.WriteLine($"a[0] = {a[0]}, c[0] = {c[0]}");

        int[] d = (int[])a.Clone();   // Clone() 도 새 배열을 만든다 (object 를 돌려주므로 캐스트)
        d[1] = 50;
        Console.WriteLine($"a[1] = {a[1]}, d[1] = {d[1]}");

        int x = 10;
        int y = x;                    // 값 형식은 값이 복사된다
        y = 20;
        Console.WriteLine($"x = {x}, y = {y}");
    }
}`, expect: `a[0] = 99, b[0] = 99
a[0] = 99, c[0] = 1
a[1] = 2, d[1] = 50
x = 10, y = 20`, desc: '<code>b[0] = 99</code> 를 했을 뿐인데 <code>a[0]</code> 도 99 입니다. 별도의 복사본이 필요하면 <code>Array.Copy</code> 나 <code>Clone()</code> 을 쓰세요. <code>string</code> 도 참조 형식이지만 값을 바꿀 수 없게(불변) 만들어져 있어 이런 현상이 보이지 않습니다.' },
          { type: 'h', text: 'Array 클래스의 도우미 메서드' },
          { type: 'p', html: '정렬 · 검색 · 복사처럼 자주 하는 일은 직접 반복문을 쓰지 않아도 <code>Array</code> 클래스가 해 줍니다. 문자열로 한 줄에 보기 좋게 출력할 때는 <code>string.Join(", ", 배열)</code> 이 편리합니다.' },
          { type: 'table', head: ['메서드', '하는 일', '예'], rows: [
            ['<code>Array.Sort(arr)</code>', '오름차순 정렬 (<b>원본이 바뀜</b>)', '<code>{5,3,8}</code> → <code>{3,5,8}</code>'],
            ['<code>Array.Reverse(arr)</code>', '순서 뒤집기 (원본이 바뀜). Sort 뒤에 쓰면 내림차순', '<code>{3,5,8}</code> → <code>{8,5,3}</code>'],
            ['<code>Array.IndexOf(arr, 값)</code>', '값이 처음 나오는 인덱스, 없으면 <b>-1</b>', '<code>Array.IndexOf(arr, 8)</code>'],
            ['<code>Array.Copy(원본, 대상, 개수)</code>', '요소 복사', '<code>Array.Copy(a, c, a.Length)</code>'],
            ['<code>arr.Clone()</code>', '같은 내용의 새 배열 (object 반환 → 캐스트)', '<code>(int[])a.Clone()</code>'],
            ['<code>Array.Fill(arr, 값)</code>', '모든 칸을 같은 값으로', '<code>Array.Fill(arr, -1)</code>'],
            ['<code>string.Join(구분자, arr)</code>', '요소를 구분자로 이어 한 문자열로', '<code>string.Join(", ", arr)</code> → <code>"1, 2, 3"</code>']
          ] },
          { type: 'code', title: '예제 7-4. Array.Sort · Reverse · IndexOf · string.Join', code: `using System;

class Program
{
    static void Main()
    {
        int[] nums = { 5, 3, 8, 1, 9, 2 };
        Console.WriteLine("원본: " + string.Join(", ", nums));

        Array.Sort(nums);                          // 오름차순
        Console.WriteLine("정렬: " + string.Join(", ", nums));

        Array.Reverse(nums);                       // 뒤집기 → 내림차순
        Console.WriteLine("역순: " + string.Join(", ", nums));

        Console.WriteLine($"8 의 위치: {Array.IndexOf(nums, 8)}");
        Console.WriteLine($"7 의 위치: {Array.IndexOf(nums, 7)}");   // 없으면 -1

        string[] fruits = { "포도", "사과", "바나나" };
        Array.Sort(fruits);                        // 문자열은 가나다순
        Console.WriteLine(string.Join(" / ", fruits));

        int[] filled = new int[4];
        Array.Fill(filled, 7);
        Console.WriteLine(string.Join(" ", filled));
    }
}`, expect: `원본: 5, 3, 8, 1, 9, 2
정렬: 1, 2, 3, 5, 8, 9
역순: 9, 8, 5, 3, 2, 1
8 의 위치: 1
7 의 위치: -1
바나나 / 사과 / 포도
7 7 7 7`, desc: '<code>Array.Sort</code> 는 새 배열을 돌려주는 것이 아니라 <b>원본 배열을 직접 정렬</b>합니다(반환값 없음). 원본을 남기고 싶으면 먼저 <code>Clone()</code> 으로 복사해 두세요.' },
          { type: 'h', text: '배열을 메서드에 전달하기' },
          { type: 'p', html: '배열도 <code>int[] arr</code> 처럼 매개변수로 받고, <code>int[]</code> 를 반환형으로 돌려줄 수 있습니다. 배열은 참조 형식이므로 메서드에 넘길 때 <b>주소가 전달</b>됩니다 — 메서드 안에서 <code>arr[i]</code> 를 바꾸면 <b>호출한 쪽의 원본 배열이 바뀝니다</b>. 큰 배열도 통째로 복사하지 않아 빠르지만, 의도치 않게 원본을 건드리지 않도록 주의해야 합니다.' },
          { type: 'code', title: '예제 7-5. 배열을 받는 메서드 · 배열을 돌려주는 메서드', code: `using System;

class Program
{
    // 배열을 받아 합계를 돌려준다
    static int Sum(int[] arr)
    {
        int total = 0;
        foreach (int n in arr) total += n;
        return total;
    }

    // 배열은 참조로 전달된다 → 메서드 안에서 바꾸면 원본이 바뀐다
    static void DoubleAll(int[] arr)
    {
        for (int i = 0; i < arr.Length; i++) arr[i] *= 2;
    }

    // 새 배열을 만들어 돌려준다
    static int[] MakeSquares(int count)
    {
        int[] result = new int[count];
        for (int i = 0; i < count; i++) result[i] = (i + 1) * (i + 1);
        return result;
    }

    static void Main()
    {
        int[] data = { 1, 2, 3, 4 };
        Console.WriteLine($"합계: {Sum(data)}");

        DoubleAll(data);
        Console.WriteLine("두 배: " + string.Join(", ", data));   // 원본이 바뀌어 있다

        int[] sq = MakeSquares(5);
        Console.WriteLine("제곱: " + string.Join(", ", sq));
    }
}`, expect: `합계: 10
두 배: 2, 4, 6, 8
제곱: 1, 4, 9, 16, 25`, desc: '<code>DoubleAll(data)</code> 는 아무것도 반환하지 않지만 <code>data</code> 의 내용이 바뀌었습니다. 이것이 참조 전달의 효과입니다. 반면 <code>MakeSquares</code> 처럼 <b>새 배열을 만들어 반환</b>하는 방식은 원본을 건드리지 않습니다.' },
          { type: 'callout', kind: 'vs', title: '디버거로 배열 내용 들여다보기', html: '<code>Console.WriteLine(scores[0]);</code> 줄의 왼쪽 여백을 클릭해 <b>중단점</b>(빨간 점)을 찍고 <b>F5</b> 로 실행하면 그 줄에서 멈춥니다. 변수 <code>scores</code> 위에 마우스를 올리면 <b>▶ 를 펼쳐 모든 요소</b>를 볼 수 있고, 아래 <b>지역</b>(로컬) 창에도 <code>[0]</code>, <code>[1]</code> … 이 나열됩니다. <b>F10</b> 으로 한 줄씩 진행하며 값이 바뀌는 모습을 관찰해 보세요. 반복문이 왜 이상하게 도는지 찾을 때 가장 좋은 방법입니다.' },
          { type: 'h', text: '2차원 배열 — 행과 열' },
          { type: 'p', html: '성적표(학생 × 과목), 바둑판, 좌석표처럼 <b>표 모양</b>의 데이터는 <b>2차원 배열</b> <code>int[,]</code> 로 담습니다. <code>new int[2, 3]</code> 은 <b>2행 3열</b>(가로 줄 2개, 각 줄에 칸 3개)이고, 요소는 <code>grid[행, 열]</code> 로 접근합니다. 행 수는 <code>GetLength(0)</code>, 열 수는 <code>GetLength(1)</code>, 전체 칸 수는 <code>Length</code> 입니다. 순회는 <b>행 반복문 안에 열 반복문</b>을 넣는 이중 for 가 기본입니다.' },
          { type: 'code', title: '예제 7-6. 2차원 배열 만들기와 이중 for 순회', code: `using System;

class Program
{
    static void Main()
    {
        int[,] grid = new int[2, 3];          // 2행 3열
        grid[0, 0] = 1; grid[0, 1] = 2; grid[0, 2] = 3;
        grid[1, 0] = 4; grid[1, 1] = 5; grid[1, 2] = 6;
        Console.WriteLine($"행 수: {grid.GetLength(0)}, 열 수: {grid.GetLength(1)}, 전체 칸: {grid.Length}");
        Console.WriteLine($"grid[1, 2] = {grid[1, 2]}");

        int[,] scores =                        // 값을 나열해 초기화: 학생 3명 × 과목 3개
        {
            { 90, 80, 70 },   // 0행: 첫 번째 학생
            { 60, 75, 95 },   // 1행
            { 88, 92, 79 }    // 2행
        };

        for (int r = 0; r < scores.GetLength(0); r++)       // 행
        {
            for (int c = 0; c < scores.GetLength(1); c++)   // 열
            {
                Console.Write($"{scores[r, c],4}");         // 4칸 오른쪽 정렬
            }
            Console.WriteLine();                            // 한 행 끝 → 줄 바꿈
        }

        int sum = 0;
        foreach (int v in scores) sum += v;   // foreach 는 모든 칸을 한 줄로 훑는다
        Console.WriteLine($"전체 합: {sum}");
    }
}`, expect: `행 수: 2, 열 수: 3, 전체 칸: 6
grid[1, 2] = 6
  90  80  70
  60  75  95
  88  92  79
전체 합: 729`, desc: '바깥 <code>for</code> 가 한 바퀴 돌 때 안쪽 <code>for</code> 는 한 행 전체를 출력합니다. <code>Console.Write</code> 로 줄을 바꾸지 않고 이어 쓰다가, 한 행이 끝나면 <code>WriteLine()</code> 으로 줄을 바꾸는 패턴을 기억하세요. <code>{값,4}</code> 는 4칸 안에 오른쪽 정렬입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 가변 배열(jagged array) int[][]', html: '<code>int[,]</code> 는 모든 행의 길이가 같은 <b>직사각형</b>입니다. 행마다 길이가 달라도 되는 <b>“배열의 배열”</b>은 <code>int[][]</code> 로 쓰며, 각 행을 따로 <code>new</code> 해야 합니다. 접근은 <code>jagged[행][열]</code> 처럼 대괄호를 두 번 씁니다. 행마다 길이가 다른 데이터(학급별 학생 명단 등)에 알맞고, 각 행이 보통의 1차원 배열이라 <code>jagged[i].Length</code> 도 됩니다.' },
          { type: 'code', title: '추가 예제. 가변 배열 — 행마다 길이가 다르다', code: `using System;

class Program
{
    static void Main()
    {
        int[][] jagged = new int[3][];       // 행 3개, 각 행의 길이는 따로 정한다
        jagged[0] = new int[] { 1 };
        jagged[1] = new int[] { 2, 3 };
        jagged[2] = new int[] { 4, 5, 6 };

        for (int i = 0; i < jagged.Length; i++)
        {
            Console.WriteLine($"{i}행 (길이 {jagged[i].Length}): {string.Join(" ", jagged[i])}");
        }
        Console.WriteLine($"jagged[2][1] = {jagged[2][1]}");
    }
}`, expect: `0행 (길이 1): 1
1행 (길이 2): 2 3
2행 (길이 3): 4 5 6
jagged[2][1] = 5`, desc: '<code>jagged.Length</code> 는 행의 개수(3), <code>jagged[i].Length</code> 는 그 행의 칸 수입니다. 2차원 배열 <code>[r, c]</code> 와 가변 배열 <code>[r][c]</code> 의 표기 차이를 눈여겨보세요.' }
        ],
        practice: [
          {
            title: '실습 7-1. 점수 배열의 평균과 최고점 학생 찾기',
            level: 1,
            desc: '<p>이름 배열과 점수 배열이 같은 순서로 주어집니다. <b>평균</b>(소수점 1자리)과 <b>최고점</b>, 그리고 최고점을 받은 <b>학생 이름과 인덱스</b>를 출력하세요.</p><pre>평균: 79.5\n최고점: 92 (김철수, 인덱스 1)</pre>',
            hint: '합계는 <code>foreach</code>, 최고점은 <code>for</code> 로 돌면서 <code>scores[i] &gt; max</code> 일 때 <code>max</code> 와 <code>maxIndex</code> 를 함께 갱신합니다. 이름은 <code>names[maxIndex]</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        string[] names = { "홍길동", "김철수", "이영희", "박민수" };
        int[] scores = { 78, 92, 85, 63 };

        // TODO: 합계를 구해 평균(소수점 1자리) 출력

        // TODO: 최고점과 그 인덱스를 찾아 "최고점: 92 (김철수, 인덱스 1)" 형식으로 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        string[] names = { "홍길동", "김철수", "이영희", "박민수" };
        int[] scores = { 78, 92, 85, 63 };

        int sum = 0;
        foreach (int s in scores) sum += s;
        double avg = (double)sum / scores.Length;
        Console.WriteLine($"평균: {avg:F1}");

        int max = scores[0];
        int maxIndex = 0;
        for (int i = 1; i < scores.Length; i++)
        {
            if (scores[i] > max)
            {
                max = scores[i];
                maxIndex = i;
            }
        }
        Console.WriteLine($"최고점: {max} ({names[maxIndex]}, 인덱스 {maxIndex})");
    }
}
`,
            expect: `평균: 79.5
최고점: 92 (김철수, 인덱스 1)`
          },
          {
            title: '실습 7-2. 2차원 배열의 행별 합계와 평균',
            level: 2,
            desc: '<p>학생 3명 × 과목 3개의 점수가 2차원 배열에 있습니다. <b>학생(행)마다</b> 합계와 평균(소수점 1자리)을 출력하세요.</p><pre>학생 1: 합계 240, 평균 80.0\n학생 2: 합계 230, 평균 76.7\n학생 3: 합계 259, 평균 86.3</pre>',
            hint: '바깥 <code>for</code>(행) 안에서 <code>int rowSum = 0;</code> 으로 시작해 안쪽 <code>for</code>(열)로 더하고, 안쪽이 끝난 뒤 출력합니다. 열 수는 <code>scores.GetLength(1)</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        int[,] scores =
        {
            { 90, 80, 70 },
            { 60, 75, 95 },
            { 88, 92, 79 }
        };

        // TODO: 행마다 합계와 평균을 구해 "학생 1: 합계 240, 평균 80.0" 형식으로 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        int[,] scores =
        {
            { 90, 80, 70 },
            { 60, 75, 95 },
            { 88, 92, 79 }
        };

        for (int r = 0; r < scores.GetLength(0); r++)
        {
            int rowSum = 0;
            for (int c = 0; c < scores.GetLength(1); c++)
            {
                rowSum += scores[r, c];
            }
            double avg = (double)rowSum / scores.GetLength(1);
            Console.WriteLine($"학생 {r + 1}: 합계 {rowSum}, 평균 {avg:F1}");
        }
    }
}
`,
            expect: `학생 1: 합계 240, 평균 80.0
학생 2: 합계 230, 평균 76.7
학생 3: 합계 259, 평균 86.3`
          }
        ],
        quiz: [
          { q: '<code>int[] a = new int[4];</code> 에서 <code>a.Length</code> 와 <b>마지막 요소의 인덱스</b>는?', options: ['4 와 4', '4 와 3', '3 와 3', '5 와 4'], answer: 1, explain: '칸은 4개(Length 4), 인덱스는 0 · 1 · 2 · 3 이므로 마지막은 3 = Length − 1.' },
          { q: '칸이 3개인 배열에서 <code>arr[3]</code> 을 읽으면?', options: ['컴파일 오류가 난다', '0 이 반환된다', '실행 중 <code>IndexOutOfRangeException</code> 이 발생한다', '마지막 요소가 반환된다'], answer: 2, explain: '컴파일러는 인덱스 값을 미리 알 수 없어 통과시키고, 실행 중에 예외가 발생합니다.' },
          { q: '다음 코드의 출력은?<pre><code>int[] a = { 1, 2, 3 };\nint[] b = a;\nb[1] = 10;\nConsole.WriteLine(a[1]);</code></pre>', options: ['2', '10', '오류', '0'], answer: 1, explain: '배열은 참조 형식이라 <code>b = a</code> 는 같은 배열을 가리킵니다. b 로 바꾸면 a 로 봐도 바뀝니다.' },
          { q: '<code>int[,] m = new int[3, 4];</code> 에서 <code>m.GetLength(1)</code> 의 값은?', options: ['4', '3', '12', '1'], answer: 0, explain: '<code>GetLength(0)</code> 은 행 수 3, <code>GetLength(1)</code> 은 열 수 4, <code>Length</code> 는 전체 12.' },
          { q: '<code>Array.IndexOf(arr, 값)</code> 에서 값이 배열에 <b>없을 때</b> 돌려주는 값은?', options: ['0', 'null', '예외 발생', '-1'], answer: 3, explain: '없으면 −1 을 돌려줍니다. 검색 결과를 쓸 때는 항상 −1 인지 먼저 확인하세요.' }
        ],
        slides: [
          { layout: 'title', title: '배열', subtitle: 'Chapter 07 · Section 01 — Arrays', badge: '07-1',
            notes: '<p><b>[도입 3분]</b> “학생 30명의 점수를 저장하려면 변수가 몇 개 필요할까요?” → 30개. “31명이 되면?” → 코드를 고쳐야 한다. 오늘은 값 여러 개를 <b>한 이름</b>으로 묶는 배열.</p><p>오늘 목표: 선언 · 인덱스 · Length, for/foreach 순회, 참조 형식, Array 메서드, 2차원 배열.</p>' },
          { layout: 'bullets', title: '배열이 필요한 이유', lead: '같은 자료형의 값 여러 개를 한 이름 + 번호로',
            bullets: ['<code>score1, score2, … score30</code> — 변수 30개는 무리', '<b>배열(array)</b>: 같은 자료형의 칸을 나란히 붙인 상자', '칸마다 <b>번호(인덱스)</b>가 있어 반복문과 짝이 맞는다', ['30개든 300개든 <b>같은 코드</b>로 처리']],
            notes: '<p><b>[3분]</b> 아파트 우편함 비유: 같은 크기의 칸이 나란히, 호수(번호)로 찾는다. 반복문을 이미 배웠으니 “번호를 돌리면 전부 처리”가 된다는 점을 연결합니다.</p>' },
          { layout: 'diagram', title: '배열의 구조 — 인덱스와 Length', html: SVG_ARRAY, caption: 'int[] scores = new int[5]; — 인덱스 0~4, Length 5, 없는 칸은 예외',
            notes: '<p><b>[6분]</b> 그림에서 <b>인덱스는 0 부터</b>를 세 번 강조. 발문: “칸이 5개면 마지막 인덱스는?” → 4 = Length − 1. “[5] 를 읽으면?” → IndexOutOfRangeException.</p><p>기본값(0, null)도 짚기.</p>' },
          { layout: 'code', title: '예제 7-1. 선언 · 생성 · 초기화', code: `using System;

class Program
{
    static void Main()
    {
        int[] scores = new int[5];       // 크기만 정함 (모두 0)
        scores[0] = 90;
        scores[1] = 85;
        Console.WriteLine(scores[3]);    // 0
        Console.WriteLine(scores.Length); // 5

        string[] names = { "홍길동", "김철수", "이영희" };
        Console.WriteLine(names[1]);
        Console.WriteLine(names[names.Length - 1]);
    }
}`, points: ['<code>new int[5]</code>: 칸 5개, 기본값 0', '<code>{ … }</code>: 값 나열, 크기 자동', '마지막 요소 <code>[Length - 1]</code>'],
            notes: '<p><b>[5분]</b> 실행 후 <code>names[3]</code> 을 추가해 예외를 직접 보여 줍니다. 예외 메시지에서 예외 이름을 읽게 하세요.</p>' },
          { layout: 'code', title: '예제 7-2. for · foreach — 합 · 평균 · 최댓값', code: `using System;

class Program
{
    static void Main()
    {
        int[] scores = { 90, 85, 77, 92, 68 };
        int sum = 0;
        foreach (int s in scores) sum += s;
        Console.WriteLine($"합계 {sum}, 평균 {(double)sum / scores.Length:F1}");

        int max = scores[0], maxIndex = 0;
        for (int i = 1; i < scores.Length; i++)
        {
            if (scores[i] > max) { max = scores[i]; maxIndex = i; }
        }
        Console.WriteLine($"최고점 {max} (인덱스 {maxIndex})");
    }
}`, points: ['<code>for</code>: 인덱스가 필요할 때', '<code>foreach</code>: 값만 꺼낼 때 (읽기 전용)', '최댓값은 <code>scores[0]</code> 에서 시작', '조건은 <code>i &lt; Length</code> (≤ 아님!)'],
            notes: '<p><b>[7분]</b> 발문: “max 를 0 으로 시작하면 어떤 경우에 틀릴까?” → 모두 음수일 때. “<code>i &lt;= scores.Length</code> 로 쓰면?” → 마지막 바퀴에서 예외. 두 가지를 직접 바꿔 실행해 보이세요.</p>' },
          { layout: 'diagram', title: '배열은 참조 형식', html: SVG_REF, caption: 'int[] b = a; 는 복사가 아니라 같은 배열에 이름표 하나 더',
            notes: '<p><b>[6분]</b> 왼쪽(값 형식)과 오른쪽(참조 형식)을 대비. 발문: “b[0] = 99 뒤에 a[0] 은?” → 99. 학생들이 가장 헷갈리는 부분이므로 예제 7-3 을 실행해 확인.</p><p>진짜 복사는 Array.Copy / Clone. 메서드에 넘길 때도 같은 원리(예제 7-5).</p>' },
          { layout: 'table', title: 'Array 클래스의 도우미 메서드', head: ['메서드', '하는 일', '메모'], rows: [['<code>Array.Sort(arr)</code>', '오름차순 정렬', '원본이 바뀜'], ['<code>Array.Reverse(arr)</code>', '뒤집기', 'Sort 뒤 → 내림차순'], ['<code>Array.IndexOf(arr, v)</code>', '위치 찾기', '없으면 -1'], ['<code>Array.Copy(a, c, n)</code> / <code>Clone()</code>', '복사', '새 배열'], ['<code>string.Join(", ", arr)</code>', '한 줄 문자열로', '출력용']],
            lead: '자주 하는 일은 직접 반복문을 쓰지 않아도 된다',
            notes: '<p><b>[4분]</b> 예제 7-4 를 실행하며 표를 확인. “Sort 는 새 배열을 돌려주지 않는다(void)” 를 강조 — <code>int[] s = Array.Sort(a);</code> 는 오류.</p>' },
          { layout: 'code', title: '예제 7-6. 2차원 배열 — 행과 열', code: `using System;

class Program
{
    static void Main()
    {
        int[,] scores =
        {
            { 90, 80, 70 },
            { 60, 75, 95 },
            { 88, 92, 79 }
        };
        for (int r = 0; r < scores.GetLength(0); r++)
        {
            for (int c = 0; c < scores.GetLength(1); c++)
                Console.Write($"{scores[r, c],4}");
            Console.WriteLine();
        }
    }
}`, points: ['<code>int[,]</code> 행, 열 — <code>[r, c]</code>', '<code>GetLength(0)</code> 행 수, <code>GetLength(1)</code> 열 수', '바깥 for = 행, 안쪽 for = 열', '<code>Write</code> 로 잇다가 행 끝에 <code>WriteLine()</code>'],
            notes: '<p><b>[6분]</b> 손으로 표를 그리며 r, c 가 어떻게 움직이는지 추적(0,0 → 0,1 → 0,2 → 1,0 …). 발문: “WriteLine() 을 빼면 어떻게 될까?” → 한 줄로 이어짐. 가변 배열 <code>int[][]</code> 은 “행마다 길이가 다른 배열의 배열”로 한 줄만 소개.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>int[] a = { 1, 2, 3 };\nint[] b = a;\nb[1] = 10;\nConsole.WriteLine(a[1]);</code></pre>', options: ['2', '10', '오류', '0'], answer: 1, explain: '배열은 참조 형식 — b 와 a 는 같은 배열을 가리킵니다.',
            notes: '<p>손을 들어 답하게 한 뒤 공개. 틀린 학생에게는 SVG 그림을 다시 보여 주세요. 이어서 “Array.IndexOf 로 없는 값을 찾으면?” → -1.</p>' },
          { layout: 'practice', title: '실습 7-1. 평균과 최고점 학생 찾기', desc: '<p>이름 배열과 점수 배열에서 평균(소수점 1자리)과 최고점, 그 학생의 이름 · 인덱스를 출력하세요.</p><pre>평균: 79.5\n최고점: 92 (김철수, 인덱스 1)</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        string[] names = { "홍길동", "김철수", "이영희", "박민수" };
        int[] scores = { 78, 92, 85, 63 };
        // TODO: 평균 출력
        // TODO: 최고점과 인덱스 찾아 출력
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        string[] names = { "홍길동", "김철수", "이영희", "박민수" };
        int[] scores = { 78, 92, 85, 63 };
        int sum = 0;
        foreach (int s in scores) sum += s;
        Console.WriteLine($"평균: {(double)sum / scores.Length:F1}");
        int max = scores[0], maxIndex = 0;
        for (int i = 1; i < scores.Length; i++)
        {
            if (scores[i] > max) { max = scores[i]; maxIndex = i; }
        }
        Console.WriteLine($"최고점: {max} ({names[maxIndex]}, 인덱스 {maxIndex})");
    }
}`,
            notes: '<p><b>[8분]</b> 흔한 실수: 평균을 <code>sum / scores.Length</code> 로 정수 나눗셈 → 79. 최고점 인덱스를 따로 저장하지 않고 이름을 못 찾는 경우. 빨리 끝난 학생은 실습 7-2(2차원 배열 행별 합)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['배열 = 같은 자료형의 칸 묶음, <code>new int[5]</code> 또는 <code>{ 1, 2, 3 }</code>', '인덱스는 <b>0 ~ Length − 1</b>, 벗어나면 IndexOutOfRangeException', '<code>for</code>(인덱스) · <code>foreach</code>(값만) — 합 · 평균 · 최댓값 · 검색', '배열은 <b>참조 형식</b>: 대입 · 메서드 전달은 같은 배열, 복사는 Copy/Clone', '<code>Array.Sort · Reverse · IndexOf</code>, 2차원 <code>int[,]</code> 는 <code>[r, c]</code> + 이중 for'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 크기가 고정된 배열의 한계를 넘는 컬렉션 — List · Dictionary.</p>' }
        ]
      },

      /* ===================== ch07-2 ===================== */
      {
        id: 'ch07-2',
        title: '컬렉션 — List · Dictionary · 기타',
        minutes: 50,
        goals: [
          '배열의 한계와 컬렉션이 필요한 이유, 제네릭 표기 <T> 를 설명할 수 있다',
          'List<T> 로 항목을 추가 · 삽입 · 삭제 · 검색 · 정렬하고 순회할 수 있다',
          'Dictionary<TKey, TValue> 로 키 → 값 데이터를 저장하고 안전하게 조회할 수 있다',
          'Queue · Stack · HashSet 의 동작 원리와 쓰임새를 구분할 수 있다'
        ],
        flow: [['복습 · 배열의 한계', 5], ['List<T> 기본 · 메서드', 15], ['Dictionary<TKey, TValue>', 13], ['Queue · Stack · HashSet', 9], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '배열의 한계와 컬렉션' },
          { type: 'p', html: '배열은 <b>만들 때 크기를 정하면 바꿀 수 없습니다</b>. “할 일 목록”처럼 실행 중에 항목이 늘고 줄어드는 데이터에는 불편하고, 중간에 끼워 넣거나 지우려면 뒤의 요소를 직접 옮겨야 합니다. 그래서 .NET 은 <b>컬렉션(collection)</b> — 필요에 따라 늘어나고 줄어드는 <b>자료 보관함 클래스</b>들을 제공합니다. 모두 <code>System.Collections.Generic</code> 네임스페이스에 있으므로 파일 맨 위에 <b><code>using System.Collections.Generic;</code></b> 을 씁니다.' },
          { type: 'callout', kind: 'info', title: '제네릭 표기 &lt;T&gt; — “무슨 자료형을 담을지”', html: '<code>List&lt;T&gt;</code> 의 <b><code>&lt;T&gt;</code></b> 는 <b>제네릭(generic)</b> 표기로, <code>T</code> 자리에 담을 자료형을 써서 <code>List&lt;int&gt;</code>(정수 목록), <code>List&lt;string&gt;</code>(문자열 목록)처럼 씁니다. 배열이 <code>int[]</code>, <code>string[]</code> 로 자료형을 정하는 것과 같은 역할입니다. 자료형을 정해 두면 <code>List&lt;int&gt;</code> 에 문자열을 넣는 실수를 컴파일러가 잡아 주고, 꺼낼 때 변환도 필요 없습니다. <code>Dictionary&lt;string, int&gt;</code> 처럼 자료형을 두 개 받는 것도 있습니다.' },
          { type: 'figure', html: SVG_LIST, caption: '배열은 크기 고정, List&lt;T&gt; 는 Add 하면 늘어난다 — 속은 배열이지만 관리는 List 가 알아서' },
          { type: 'h', text: 'List<T> — 크기가 늘어나는 배열' },
          { type: 'p', html: '<b><code>List&lt;T&gt;</code></b> 는 가장 많이 쓰는 컬렉션입니다. 배열처럼 <b>순서</b>가 있고 <code>[i]</code> 로 접근하지만, <code>Add</code> 로 끝에 붙이고 <code>Remove</code> 로 빼면 <b>크기가 자동으로 바뀝니다</b>. 요소 개수는 <code>Length</code> 가 아니라 <b><code>Count</code></b> 입니다.' },
          { type: 'code', title: '예제 7-7. List 만들기 · Add · 인덱서 · Insert · Remove · Contains', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todo = new List<string>();     // 빈 목록 (크기 제한 없음)
        todo.Add("숙제하기");
        todo.Add("운동하기");
        todo.Add("책 읽기");
        Console.WriteLine($"할 일 {todo.Count}개");
        Console.WriteLine(todo[0]);                  // 인덱서: 배열처럼 [i]

        todo.Insert(1, "장보기");                    // 1번 자리에 끼워 넣기 (뒤는 밀린다)
        todo.Remove("숙제하기");                     // 값으로 찾아 삭제
        todo.RemoveAt(todo.Count - 1);              // 마지막 항목을 인덱스로 삭제

        foreach (string item in todo)
        {
            Console.WriteLine("- " + item);
        }
        Console.WriteLine($"운동하기 있나? {todo.Contains("운동하기")}");
        Console.WriteLine($"장보기 위치: {todo.IndexOf("장보기")}");
        Console.WriteLine($"산책 위치: {todo.IndexOf("산책")}");     // 없으면 -1
    }
}`, expect: `할 일 3개
숙제하기
- 장보기
- 운동하기
운동하기 있나? True
장보기 위치: 0
산책 위치: -1`, desc: '<code>Insert(1, …)</code> 뒤의 항목들은 한 칸씩 뒤로 밀리고, <code>Remove</code> 뒤의 항목들은 앞으로 당겨집니다 — 배열이라면 직접 옮겨야 할 일을 List 가 대신합니다. 코드를 따라가며 목록이 어떻게 변하는지 손으로 적어 보세요: <code>[숙제, 운동, 책]</code> → <code>[숙제, 장보기, 운동, 책]</code> → <code>[장보기, 운동, 책]</code> → <code>[장보기, 운동]</code>.' },
          { type: 'table', head: ['멤버', '하는 일', '예'], rows: [
            ['<code>Add(값)</code>', '끝에 추가', '<code>list.Add(5);</code>'],
            ['<code>Insert(i, 값)</code>', 'i 번 자리에 끼워 넣기', '<code>list.Insert(0, 5);</code>'],
            ['<code>Remove(값)</code>', '값으로 찾아 첫 하나 삭제 (성공 여부 bool 반환)', '<code>list.Remove(5);</code>'],
            ['<code>RemoveAt(i)</code>', 'i 번 항목 삭제', '<code>list.RemoveAt(0);</code>'],
            ['<code>Count</code>', '항목 개수 (배열의 Length)', '<code>list.Count</code>'],
            ['<code>list[i]</code>', '인덱서로 읽기 · 쓰기', '<code>list[0] = 9;</code>'],
            ['<code>Contains(값)</code> / <code>IndexOf(값)</code>', '있는지 검사 / 위치 (없으면 -1)', '<code>list.Contains(5)</code>'],
            ['<code>Sort()</code> / <code>Reverse()</code>', '정렬 / 뒤집기 (원본이 바뀜)', '<code>list.Sort();</code>'],
            ['<code>Clear()</code>', '모두 삭제', '<code>list.Clear();</code>'],
            ['<code>ToArray()</code> / <code>new List&lt;int&gt;(배열)</code>', 'List → 배열 / 배열 → List', '<code>int[] a = list.ToArray();</code>']
          ], caption: 'List&lt;T&gt; 의 주요 멤버' },
          { type: 'code', title: '예제 7-8. 컬렉션 초기화자 · Sort · 조건에 맞는 항목 고르기', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<int> nums = new List<int> { 5, 3, 8, 1, 9 };   // 컬렉션 초기화자: 만들면서 채우기
        Console.WriteLine("처음: " + string.Join(", ", nums));

        nums.Add(7);
        nums.Sort();
        Console.WriteLine("정렬: " + string.Join(", ", nums));
        nums.Reverse();
        Console.WriteLine("역순: " + string.Join(", ", nums));

        int sum = 0;
        foreach (int n in nums) sum += n;
        Console.WriteLine($"개수 {nums.Count}, 합 {sum}, 최대 {nums[0]}, 최소 {nums[nums.Count - 1]}");

        // 짝수만 골라 새 목록 만들기
        List<int> evens = new List<int>();
        foreach (int n in nums)
        {
            if (n % 2 == 0) evens.Add(n);
        }
        Console.WriteLine("짝수: " + string.Join(", ", evens));

        nums.RemoveAll(n => n > 5);           // 조건에 맞는 항목 모두 삭제 (람다식: 뒤에서 배움)
        Console.WriteLine("5 초과 삭제: " + string.Join(", ", nums));

        nums.Clear();
        Console.WriteLine($"Clear 후 개수: {nums.Count}");
    }
}`, expect: `처음: 5, 3, 8, 1, 9
정렬: 1, 3, 5, 7, 8, 9
역순: 9, 8, 7, 5, 3, 1
개수 6, 합 33, 최대 9, 최소 1
짝수: 8
5 초과 삭제: 5, 3, 1
Clear 후 개수: 0`, desc: '<code>new List&lt;int&gt; { 5, 3, 8 }</code> 처럼 <b>컬렉션 초기화자</b>로 만들면서 채울 수 있습니다. “조건에 맞는 것만 골라 새 List 에 담기”는 실무에서 매우 자주 쓰는 패턴입니다. <code>RemoveAll(n =&gt; n &gt; 5)</code> 의 <code>=&gt;</code> 는 <b>람다식</b>으로 “n 이 5 보다 크면”이라는 조건을 넘긴 것입니다(뒤 장에서 자세히).' },
          { type: 'callout', kind: 'warn', title: 'foreach 도중에 Add · Remove 하지 마세요', html: '<code>foreach (int n in nums) { if (n &gt; 5) nums.Remove(n); }</code> 는 실행 중 <b><code>InvalidOperationException</code>(컬렉션이 수정되었습니다)</b> 이 발생합니다. 순회하는 동안 목록이 바뀌면 “다음 항목”이 무엇인지 알 수 없기 때문입니다. 조건 삭제는 <code>RemoveAll</code> 을 쓰거나, <code>for (int i = nums.Count - 1; i &gt;= 0; i--)</code> 처럼 <b>뒤에서부터</b> 인덱스로 지우세요.' },
          { type: 'h', text: 'Dictionary<TKey, TValue> — 키로 값을 찾는 사전' },
          { type: 'p', html: '“홍길동의 점수는?” 처럼 <b>이름으로 값을 찾고</b> 싶을 때 List 에서는 처음부터 하나씩 비교해야 합니다. <b><code>Dictionary&lt;TKey, TValue&gt;</code></b> 는 국어사전처럼 <b>키(key) → 값(value)</b> 쌍을 저장하고, 키를 주면 값을 <b>바로</b> 찾아 줍니다(항목이 수만 개여도 거의 즉시). <b>키는 중복될 수 없고</b>, 같은 키에 다시 대입하면 값이 바뀝니다. 학번 → 학생, 상품 코드 → 가격, 단어 → 횟수처럼 “무엇으로 무엇을 찾는가”가 분명한 데이터에 씁니다.' },
          { type: 'code', title: '예제 7-9. Dictionary 추가 · 조회 · ContainsKey · TryGetValue · 순회', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> ages = new Dictionary<string, int>();
        ages["홍길동"] = 20;              // 키로 추가 (인덱서)
        ages["김철수"] = 25;
        ages.Add("이영희", 22);           // Add 로도 추가 (같은 키가 이미 있으면 예외)
        ages["홍길동"] = 21;              // 같은 키에 대입 → 값이 바뀐다 (항목이 늘지 않음)

        Console.WriteLine($"홍길동의 나이: {ages["홍길동"]}");
        Console.WriteLine($"항목 수: {ages.Count}");

        Console.WriteLine($"김철수 있나? {ages.ContainsKey("김철수")}");
        Console.WriteLine($"박민수 있나? {ages.ContainsKey("박민수")}");

        if (ages.TryGetValue("박민수", out int age))    // 있으면 true + 값, 없으면 false
            Console.WriteLine($"박민수: {age}");
        else
            Console.WriteLine("박민수는 없습니다.");

        ages.Remove("김철수");

        foreach (KeyValuePair<string, int> pair in ages)   // 키 · 값 쌍으로 순회
        {
            Console.WriteLine($"{pair.Key} → {pair.Value}");
        }
        Console.WriteLine("키 목록: " + string.Join(", ", ages.Keys));
    }
}`, expect: `홍길동의 나이: 21
항목 수: 3
김철수 있나? True
박민수 있나? False
박민수는 없습니다.
홍길동 → 21
이영희 → 22
키 목록: 홍길동, 이영희`, desc: '<code>ages["홍길동"] = 21</code> 은 새 항목을 만드는 것이 아니라 <b>기존 값을 덮어씁니다</b>(항목 수 3 그대로). 순회할 때 각 항목은 <code>KeyValuePair&lt;string, int&gt;</code> 이고 <code>.Key</code> 와 <code>.Value</code> 로 꺼냅니다. <code>ages.Keys</code>, <code>ages.Values</code> 로 키만 · 값만 모을 수도 있습니다.' },
          { type: 'callout', kind: 'warn', title: '없는 키를 [ ] 로 읽으면 KeyNotFoundException', html: '<code>ages["박민수"]</code> 처럼 없는 키를 읽으면 실행 중 <b><code>KeyNotFoundException</code></b> 이 발생합니다. 키가 있는지 확실하지 않으면 <b><code>ContainsKey</code> 로 먼저 확인</b>하거나, 확인과 꺼내기를 한 번에 하는 <b><code>TryGetValue</code></b> 를 쓰세요(2장의 <code>int.TryParse</code> 와 같은 패턴입니다). 참고로 <b>대입</b>(<code>ages["박민수"] = 30;</code>)은 없는 키라도 새 항목을 만들므로 예외가 나지 않습니다.' },
          { type: 'code', title: '추가 예제. 없는 키를 읽어 보기', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> stock = new Dictionary<string, int>();
        stock["사과"] = 10;
        Console.WriteLine(stock["사과"]);
        Console.WriteLine(stock["배"]);      // 없는 키 → KeyNotFoundException
        Console.WriteLine("이 줄은 실행되지 않습니다");
    }
}`, expectError: true, expect: `10`, desc: '<code>10</code> 뒤에 <b>처리되지 않은 예외</b>가 출력됩니다. 예외 메시지에 <b>어떤 키</b>가 없었는지도 적혀 있으니 읽어 보세요. <code>stock["배"]</code> 를 <code>stock.TryGetValue("배", out int n)</code> 으로 바꿔 안전하게 만들어 보세요.' },
          { type: 'code', title: '예제 7-10. 단어 세기 — Dictionary 의 대표 활용', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string text = "사과 바나나 사과 포도 바나나 사과";
        string[] words = text.Split(' ');           // 공백으로 잘라 배열로

        Dictionary<string, int> count = new Dictionary<string, int>();
        foreach (string w in words)
        {
            if (count.ContainsKey(w))
                count[w]++;          // 이미 있는 단어: 횟수 1 증가
            else
                count[w] = 1;        // 처음 보는 단어: 1 로 시작
        }

        foreach (KeyValuePair<string, int> p in count)
        {
            Console.WriteLine($"{p.Key}: {p.Value}번");
        }
        Console.WriteLine($"서로 다른 단어: {count.Count}개");
    }
}`, expect: `사과: 3번
바나나: 2번
포도: 1번
서로 다른 단어: 3개`, desc: '“있으면 증가, 없으면 1 로 시작”은 <b>세기(counting)</b> 문제의 기본 패턴입니다. 투표 집계, 방문 횟수, 글자 빈도 등 무엇이든 같은 코드입니다. <code>Dictionary</code> 는 항목을 <b>넣은 순서</b>로 순회되지만 이것은 보장된 규칙이 아니므로, 순서가 중요하면 키를 따로 정렬해서 쓰세요.' },
          { type: 'h', text: 'Queue<T> 와 Stack<T> — 줄 서기와 접시 쌓기' },
          { type: 'p', html: '<b><code>Queue&lt;T&gt;</code>(큐)</b> 는 은행 번호표처럼 <b>먼저 넣은 것이 먼저 나오는(FIFO, First-In First-Out)</b> 구조입니다. <code>Enqueue</code> 로 뒤에 넣고 <code>Dequeue</code> 로 앞에서 꺼냅니다. <b><code>Stack&lt;T&gt;</code>(스택)</b> 은 접시 쌓기처럼 <b>마지막에 넣은 것이 먼저 나오는(LIFO, Last-In First-Out)</b> 구조입니다. <code>Push</code> 로 위에 올리고 <code>Pop</code> 으로 맨 위를 꺼냅니다. 둘 다 <code>Peek</code> 은 꺼내지 않고 다음 차례만 봅니다.' },
          { type: 'figure', html: SVG_COLL, caption: 'Queue 는 앞에서 꺼내고 뒤로 넣는다, Stack 은 위에서 넣고 위에서 꺼낸다, HashSet 은 같은 값을 한 번만' },
          { type: 'code', title: '예제 7-11. Queue 로 대기 줄, Stack 으로 뒤로 가기', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Queue<string> line = new Queue<string>();    // 줄 서기: 먼저 온 사람이 먼저
        line.Enqueue("손님1");
        line.Enqueue("손님2");
        line.Enqueue("손님3");
        Console.WriteLine($"대기 {line.Count}명, 다음 차례: {line.Peek()}");
        Console.WriteLine($"처리: {line.Dequeue()}");
        Console.WriteLine($"처리: {line.Dequeue()}");
        Console.WriteLine($"남은 사람: {line.Count}명");

        Stack<string> pages = new Stack<string>();   // 브라우저 방문 기록: 마지막 페이지가 먼저
        pages.Push("홈");
        pages.Push("목록");
        pages.Push("상세");
        Console.WriteLine($"현재 페이지: {pages.Peek()}");
        Console.WriteLine($"뒤로: {pages.Pop()}");
        Console.WriteLine($"뒤로: {pages.Pop()}");
        Console.WriteLine($"현재 페이지: {pages.Peek()}, 남은 기록 {pages.Count}개");
    }
}`, expect: `대기 3명, 다음 차례: 손님1
처리: 손님1
처리: 손님2
남은 사람: 1명
현재 페이지: 상세
뒤로: 상세
뒤로: 목록
현재 페이지: 홈, 남은 기록 1개`, desc: '같은 순서로 넣었는데 Queue 는 <b>손님1</b> 부터, Stack 은 <b>상세</b> 부터 나옵니다. 빈 Queue/Stack 에서 <code>Dequeue</code>/<code>Pop</code> 하면 <code>InvalidOperationException</code> 이 나므로 <code>Count &gt; 0</code> 을 먼저 확인하세요. 스택은 “실행 취소(Undo)”, 큐는 “작업 대기열”에 그대로 쓰입니다.' },
          { type: 'h', text: 'HashSet<T> — 중복 없는 집합' },
          { type: 'p', html: '<b><code>HashSet&lt;T&gt;</code></b> 는 <b>같은 값을 한 번만</b> 담는 집합(set)입니다. <code>Add</code> 는 새 값이면 <code>true</code>, 이미 있으면 <code>false</code> 를 돌려주고 넣지 않습니다. “지금까지 나온 적 있는 값인가?” 검사(<code>Contains</code>)가 매우 빠르고, 중복 제거에 딱입니다. 순서는 보장하지 않으므로 순서가 필요하면 List 로 옮겨 정렬합니다.' },
          { type: 'code', title: '예제 7-12. HashSet 으로 중복 제거하기', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int[] nums = { 3, 1, 3, 5, 1, 9, 5 };
        HashSet<int> set = new HashSet<int>();
        foreach (int n in nums)
        {
            bool added = set.Add(n);      // 이미 있으면 false 를 돌려주고 넣지 않는다
            Console.WriteLine($"{n} 추가 → {added}");
        }
        Console.WriteLine($"서로 다른 값 {set.Count}개");

        List<int> list = new List<int>(set);   // 집합 → 목록으로 옮겨 정렬
        list.Sort();
        Console.WriteLine(string.Join(", ", list));
        Console.WriteLine($"9 있나? {set.Contains(9)}, 7 있나? {set.Contains(7)}");
    }
}`, expect: `3 추가 → True
1 추가 → True
3 추가 → False
5 추가 → True
1 추가 → False
9 추가 → True
5 추가 → False
서로 다른 값 4개
1, 3, 5, 9
9 있나? True, 7 있나? False`, desc: '<code>new List&lt;int&gt;(set)</code> 처럼 컬렉션을 다른 컬렉션의 생성자에 넘기면 내용이 복사됩니다(배열도 됩니다). 반대로 <code>new HashSet&lt;int&gt;(배열)</code> 한 줄이면 중복이 제거된 집합이 바로 만들어집니다.' },
          { type: 'table', head: ['컬렉션', '특징', '이럴 때'], rows: [
            ['<code>T[]</code> 배열', '크기 고정, 인덱스, 가장 빠르고 단순', '개수가 정해진 데이터, 2차원 표'],
            ['<code>List&lt;T&gt;</code>', '순서 있음, 인덱스, 자유롭게 추가 · 삭제', '<b>대부분의 목록</b> — 잘 모르겠으면 List'],
            ['<code>Dictionary&lt;K, V&gt;</code>', '키 → 값, 키 중복 불가, 키로 즉시 찾기', '이름 → 점수, 코드 → 상품, 단어 → 횟수'],
            ['<code>Queue&lt;T&gt;</code>', '먼저 넣은 것이 먼저 (FIFO)', '대기 줄, 작업 순서, 메시지 처리'],
            ['<code>Stack&lt;T&gt;</code>', '마지막에 넣은 것이 먼저 (LIFO)', '뒤로 가기, 실행 취소, 괄호 검사'],
            ['<code>HashSet&lt;T&gt;</code>', '중복 없음, 순서 없음, 빠른 Contains', '중복 제거, “본 적 있나?” 검사']
          ], caption: '어떤 그릇을 쓸까 — 상황별 컬렉션 선택' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — LINQ 맛보기', html: '컬렉션과 배열에는 <code>using System.Linq;</code> 를 추가하면 쓸 수 있는 <b>LINQ</b> 메서드가 있습니다. <code>nums.Sum()</code>, <code>nums.Max()</code>, <code>nums.Average()</code>, <code>nums.Where(n =&gt; n % 2 == 0)</code>(조건에 맞는 것만), <code>names.OrderBy(n =&gt; n)</code>(정렬) 처럼 <b>반복문 없이 한 줄</b>로 합계 · 최댓값 · 필터 · 정렬을 처리합니다. 이번 장에서 반복문으로 직접 만들어 본 것들이 그대로 메서드로 준비되어 있는 셈입니다. 람다식과 LINQ 는 뒤 장에서 자세히 배웁니다.' }
        ],
        practice: [
          {
            title: '실습 7-3. 입력한 단어의 중복 제거와 정렬',
            level: 1,
            desc: '<p>공백으로 구분된 단어들을 한 줄로 입력받아, <b>중복을 제거</b>한 뒤 <b>가나다순으로 정렬</b>해 출력하세요. 입력 단어 수와 서로 다른 단어 수도 함께 출력합니다.</p><pre>단어 입력: 사과 배 사과 감 배 귤\n입력 6개 → 서로 다른 단어 4개\n감, 귤, 배, 사과</pre><p>(입력한 값은 콘솔 출력에는 나타나지 않습니다.)</p>',
            hint: '<code>string[] words = Console.ReadLine().Split(\' \');</code> → <code>new HashSet&lt;string&gt;(words)</code> 로 중복 제거 → <code>new List&lt;string&gt;(set)</code> 으로 옮겨 <code>Sort()</code> → <code>string.Join(", ", list)</code>.',
            starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string[] words = Console.ReadLine().Split(' ');

        // TODO: HashSet 으로 중복 제거

        // TODO: List 로 옮겨 정렬

        // TODO: "입력 6개 → 서로 다른 단어 4개" 와 정렬된 단어 목록 출력
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string[] words = Console.ReadLine().Split(' ');

        HashSet<string> set = new HashSet<string>(words);

        List<string> sorted = new List<string>(set);
        sorted.Sort();

        Console.WriteLine($"입력 {words.Length}개 → 서로 다른 단어 {set.Count}개");
        Console.WriteLine(string.Join(", ", sorted));
    }
}
`,
            stdin: '사과 배 사과 감 배 귤\n',
            expect: `단어 입력: 입력 6개 → 서로 다른 단어 4개
감, 귤, 배, 사과`
          },
          {
            title: '실습 7-4. 학생 이름으로 점수 조회하기',
            level: 2,
            desc: '<p>이름 → 점수 <code>Dictionary</code> 에 학생 3명을 넣고 전체 목록을 출력한 뒤, 이름을 입력받아 점수를 찾아 출력하세요. 없는 이름이면 “없는 학생입니다.” 를 출력합니다.</p><pre>홍길동: 90\n김철수: 85\n이영희: 77\n이름: 이영희\n이영희 학생의 점수는 77점입니다.</pre>',
            hint: '<code>foreach (KeyValuePair&lt;string, int&gt; p in scores)</code> 로 목록 출력, 조회는 <code>if (scores.TryGetValue(name, out int score))</code>.',
            starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> scores = new Dictionary<string, int>();
        scores["홍길동"] = 90;
        scores["김철수"] = 85;
        scores["이영희"] = 77;

        // TODO: 전체 목록을 "이름: 점수" 로 출력

        Console.Write("이름: ");
        string name = Console.ReadLine();

        // TODO: TryGetValue 로 찾아 "OOO 학생의 점수는 NN점입니다." 또는 "없는 학생입니다." 출력
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> scores = new Dictionary<string, int>();
        scores["홍길동"] = 90;
        scores["김철수"] = 85;
        scores["이영희"] = 77;

        foreach (KeyValuePair<string, int> p in scores)
        {
            Console.WriteLine($"{p.Key}: {p.Value}");
        }

        Console.Write("이름: ");
        string name = Console.ReadLine();

        if (scores.TryGetValue(name, out int score))
            Console.WriteLine($"{name} 학생의 점수는 {score}점입니다.");
        else
            Console.WriteLine("없는 학생입니다.");
    }
}
`,
            stdin: '이영희\n',
            expect: `홍길동: 90
김철수: 85
이영희: 77
이름: 이영희 학생의 점수는 77점입니다.`
          }
        ],
        quiz: [
          { q: '<code>List&lt;int&gt;</code> 의 <b>맨 끝에</b> 항목을 추가하는 메서드는?', options: ['<code>Insert</code>', '<code>Add</code>', '<code>Push</code>', '<code>Enqueue</code>'], answer: 1, explain: '<code>Add</code> 는 끝에 추가, <code>Insert(i, 값)</code> 은 원하는 자리에 끼워 넣기. Push · Enqueue 는 Stack · Queue 의 메서드입니다.' },
          { q: '다음 코드의 출력은?<pre><code>List&lt;int&gt; a = new List&lt;int&gt; { 1, 2, 3 };\na.RemoveAt(0);\na.Add(4);\nConsole.WriteLine(a[0] + " " + a.Count);</code></pre>', options: ['2 3', '1 3', '2 4', '오류'], answer: 0, explain: '<code>RemoveAt(0)</code> 으로 1 이 빠지고 <code>{2, 3}</code>, <code>Add(4)</code> 로 <code>{2, 3, 4}</code>. 첫 항목 2, 개수 3.' },
          { q: '<code>Dictionary</code> 에서 <b>없는 키</b>를 <code>dict["키"]</code> 로 읽으면?', options: ['null 을 돌려준다', '0 을 돌려준다', '<code>KeyNotFoundException</code> 이 발생한다', '-1 을 돌려준다'], answer: 2, explain: '읽기는 예외, 대입은 새 항목 생성. 안전한 조회는 <code>TryGetValue</code> 또는 <code>ContainsKey</code>.' },
          { q: '<b>먼저 넣은 것이 먼저 나오는</b>(FIFO) 컬렉션은?', options: ['<code>Stack&lt;T&gt;</code>', '<code>HashSet&lt;T&gt;</code>', '<code>Dictionary&lt;K, V&gt;</code>', '<code>Queue&lt;T&gt;</code>'], answer: 3, explain: 'Queue 는 Enqueue(뒤에 넣기) · Dequeue(앞에서 꺼내기). Stack 은 반대로 LIFO 입니다.' },
          { q: '<code>HashSet&lt;int&gt; s = new HashSet&lt;int&gt; { 1, 2, 2, 3, 3, 3 };</code> 의 <code>s.Count</code> 는?', options: ['6', '3', '1', '컴파일 오류'], answer: 1, explain: 'HashSet 은 같은 값을 한 번만 담으므로 {1, 2, 3} → 3 개.' }
        ],
        slides: [
          { layout: 'title', title: '컬렉션 — List · Dictionary · 기타', subtitle: 'Chapter 07 · Section 02 — Collections', badge: '07-2',
            notes: '<p><b>[도입 3분]</b> 복습: “배열의 크기는 나중에 바꿀 수 있나요?” → 없다. “할 일 목록 앱에서 할 일이 계속 늘어나면?” 오늘은 크기가 자유로운 그릇, 컬렉션.</p><p>오늘 목표: List 의 Add/Remove/Sort, Dictionary 의 키 → 값, Queue/Stack/HashSet 의 용도 구분.</p>' },
          { layout: 'bullets', title: '배열의 한계와 컬렉션', lead: 'using System.Collections.Generic;',
            bullets: ['배열: 크기 <b>고정</b>, 중간 삽입 · 삭제는 직접 옮겨야', '<b>컬렉션(collection)</b>: 늘고 줄어드는 자료 보관함 클래스', ['<code>List&lt;T&gt;</code> 순서 있는 목록', ['<code>Dictionary&lt;K, V&gt;</code> 키 → 값', '<code>Queue</code> · <code>Stack</code> · <code>HashSet</code>']], '<code>&lt;T&gt;</code> = <b>제네릭</b>: 담을 자료형을 지정 (<code>List&lt;int&gt;</code>, <code>List&lt;string&gt;</code>)'],
            notes: '<p><b>[4분]</b> 그릇 비유: 배열은 칸 수가 정해진 계란판, List 는 늘어나는 장바구니. <code>&lt;T&gt;</code> 는 “무엇을 담는 장바구니인지” 라벨. using 을 빠뜨리면 List 를 못 찾는다는 오류(CS0246)가 난다는 것을 미리 알려 주세요.</p>' },
          { layout: 'diagram', title: 'List<T> — 늘어나는 배열', html: SVG_LIST, caption: '배열은 크기 고정, List 는 Add 하면 뒤에 칸이 생긴다 · 개수는 Count',
            notes: '<p><b>[4분]</b> 왼쪽 배열의 ✗ 와 오른쪽 List 의 Add(4) 를 대비. “속은 배열인데 꽉 차면 두 배짜리 새 배열로 옮긴다”는 한 문장으로 원리를 설명하면 “왜 List 가 편한가”가 이해됩니다. Length 가 아니라 <b>Count</b>.</p>' },
          { layout: 'code', title: '예제 7-7. List 기본 — Add · Insert · Remove · Contains', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todo = new List<string>();
        todo.Add("숙제하기");
        todo.Add("운동하기");
        todo.Add("책 읽기");
        Console.WriteLine($"{todo.Count}개, 첫 번째: {todo[0]}");

        todo.Insert(1, "장보기");        // 1번 자리에 끼워 넣기
        todo.Remove("숙제하기");         // 값으로 삭제
        todo.RemoveAt(todo.Count - 1);  // 마지막 삭제
        foreach (string item in todo) Console.WriteLine("- " + item);
        Console.WriteLine(todo.Contains("운동하기"));
        Console.WriteLine(todo.IndexOf("산책"));   // -1
    }
}`, points: ['<code>Add</code> 끝에, <code>Insert(i, v)</code> 중간에', '<code>Remove(값)</code> · <code>RemoveAt(인덱스)</code>', '<code>Count</code> · <code>[i]</code> · <code>Contains</code> · <code>IndexOf</code>', '<code>foreach</code> 로 순회'],
            notes: '<p><b>[7분]</b> 한 줄씩 실행하며 칠판에 목록 상태를 적습니다: [숙제, 운동, 책] → Insert → [숙제, 장보기, 운동, 책] → Remove → [장보기, 운동, 책] → RemoveAt → [장보기, 운동]. 발문: “Insert 하면 뒤의 항목은 어떻게 되나?” → 한 칸씩 밀린다.</p>' },
          { layout: 'table', title: 'List<T> 주요 멤버', head: ['멤버', '하는 일', '메모'], rows: [['<code>Add(v)</code> / <code>Insert(i, v)</code>', '추가 / 끼워 넣기', ''], ['<code>Remove(v)</code> / <code>RemoveAt(i)</code>', '값으로 / 인덱스로 삭제', 'Remove 는 bool 반환'], ['<code>Count</code> / <code>list[i]</code>', '개수 / 인덱서', '배열의 Length 와 [i]'], ['<code>Contains(v)</code> / <code>IndexOf(v)</code>', '있나? / 위치', '없으면 -1'], ['<code>Sort()</code> / <code>Reverse()</code> / <code>Clear()</code>', '정렬 / 뒤집기 / 비우기', '원본이 바뀜'], ['<code>new List&lt;int&gt; { 1, 2 }</code>', '컬렉션 초기화자', '만들면서 채우기']],
            lead: '배열에서 쓰던 것 + 늘리고 줄이는 것',
            notes: '<p><b>[4분]</b> 예제 7-8 을 실행하며 Sort · Reverse · 짝수 고르기 패턴을 보여 줍니다. <b>주의</b>: foreach 도중 Remove 하면 InvalidOperationException — 직접 시연해 보여 주면 오래 기억합니다. 조건 삭제는 RemoveAll.</p>' },
          { layout: 'code', title: '예제 7-9. Dictionary — 키로 값을 찾는 사전', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> ages = new Dictionary<string, int>();
        ages["홍길동"] = 20;
        ages["김철수"] = 25;
        ages["홍길동"] = 21;               // 같은 키 → 값 덮어쓰기
        Console.WriteLine($"{ages["홍길동"]} / 항목 {ages.Count}개");

        Console.WriteLine(ages.ContainsKey("박민수"));   // False
        if (ages.TryGetValue("박민수", out int age))
            Console.WriteLine(age);
        else
            Console.WriteLine("박민수는 없습니다.");

        foreach (KeyValuePair<string, int> p in ages)
            Console.WriteLine($"{p.Key} → {p.Value}");
    }
}`, points: ['<code>dict[키] = 값</code> 추가 · 덮어쓰기', '<code>dict[키]</code> 읽기 — 없으면 <b>예외</b>', '<code>ContainsKey</code> · <code>TryGetValue</code> 로 안전하게', '<code>KeyValuePair</code> 의 <code>.Key</code> <code>.Value</code>'],
            notes: '<p><b>[7분]</b> 국어사전 비유: 단어(키)로 뜻(값)을 바로 찾는다. 발문: “ages["박민수"] 를 그냥 읽으면?” → KeyNotFoundException (추가 예제로 시연). 2장의 TryParse 와 같은 Try 패턴임을 연결.</p>' },
          { layout: 'code', title: '예제 7-10. 단어 세기', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string[] words = "사과 바나나 사과 포도 바나나 사과".Split(' ');
        Dictionary<string, int> count = new Dictionary<string, int>();
        foreach (string w in words)
        {
            if (count.ContainsKey(w))
                count[w]++;        // 있으면 1 증가
            else
                count[w] = 1;      // 없으면 1 로 시작
        }
        foreach (KeyValuePair<string, int> p in count)
            Console.WriteLine($"{p.Key}: {p.Value}번");
    }
}`, points: ['“있으면 +1, 없으면 1” — 세기의 기본 패턴', '투표 집계 · 글자 빈도 · 방문 횟수 모두 같은 코드', '키가 곧 “무엇을 세는가”'],
            notes: '<p><b>[4분]</b> 학생들에게 문장을 바꿔 실행해 보게 합니다. 발문: “List 로 같은 일을 하려면?” → 단어마다 목록을 처음부터 뒤져야 한다. Dictionary 가 필요한 이유가 드러납니다.</p>' },
          { layout: 'diagram', title: 'Queue · Stack · HashSet', html: SVG_COLL, caption: 'Queue = 줄 서기(FIFO), Stack = 접시 쌓기(LIFO), HashSet = 중복 없는 집합',
            notes: '<p><b>[4분]</b> 실물 비유로 충분합니다: 은행 번호표(큐), 쌓아 둔 접시(스택), 출석부의 이름 집합(중복 없음). 발문: “브라우저의 뒤로 가기는 어느 쪽?” → 스택. “프린터 인쇄 대기는?” → 큐.</p>' },
          { layout: 'code', title: '예제 7-11 · 7-12. Queue · Stack · HashSet', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Queue<string> q = new Queue<string>();
        q.Enqueue("손님1"); q.Enqueue("손님2"); q.Enqueue("손님3");
        Console.WriteLine($"큐: {q.Dequeue()} 먼저, 남은 {q.Count}명");

        Stack<string> s = new Stack<string>();
        s.Push("홈"); s.Push("목록"); s.Push("상세");
        Console.WriteLine($"스택: {s.Pop()} 먼저, 현재 {s.Peek()}");

        HashSet<int> set = new HashSet<int> { 3, 1, 3, 5, 1 };
        Console.WriteLine($"집합: {set.Count}개, 3 추가 → {set.Add(3)}");
        List<int> list = new List<int>(set);
        list.Sort();
        Console.WriteLine(string.Join(", ", list));
    }
}`, points: ['Queue: <code>Enqueue</code> / <code>Dequeue</code> / <code>Peek</code>', 'Stack: <code>Push</code> / <code>Pop</code> / <code>Peek</code>', 'HashSet: <code>Add</code> 는 중복이면 false', '빈 큐 · 스택에서 꺼내면 예외 → <code>Count</code> 확인'],
            notes: '<p><b>[5분]</b> 실행 전 각 줄의 출력을 예측하게 합니다(손님1 / 상세 / 3개, False). HashSet 은 순서를 보장하지 않으므로 출력할 때는 List 로 옮겨 정렬하는 습관을 안내.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>List&lt;int&gt; a = new List&lt;int&gt; { 1, 2, 3 };\na.RemoveAt(0);\na.Add(4);\nConsole.WriteLine(a[0] + " " + a.Count);</code></pre>', options: ['2 3', '1 3', '2 4', '오류'], answer: 0, explain: 'RemoveAt(0) 뒤 {2, 3}, Add(4) 뒤 {2, 3, 4} → 첫 항목 2, 개수 3.',
            notes: '<p>정답 공개 후 이어서: “없는 키를 dict[키] 로 읽으면?” → KeyNotFoundException. “FIFO 는 Queue 와 Stack 중?” → Queue.</p>' },
          { layout: 'practice', title: '실습 7-3. 단어 중복 제거와 정렬', desc: '<p>공백으로 구분된 단어를 한 줄 입력받아 중복을 제거하고 가나다순으로 출력하세요.</p><pre>단어 입력: 사과 배 사과 감 배 귤\n입력 6개 → 서로 다른 단어 4개\n감, 귤, 배, 사과</pre>', starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string[] words = Console.ReadLine().Split(' ');
        // TODO: HashSet 으로 중복 제거 → List 로 옮겨 Sort → 출력
    }
}`, solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string[] words = Console.ReadLine().Split(' ');
        HashSet<string> set = new HashSet<string>(words);
        List<string> sorted = new List<string>(set);
        sorted.Sort();
        Console.WriteLine($"입력 {words.Length}개 → 서로 다른 단어 {set.Count}개");
        Console.WriteLine(string.Join(", ", sorted));
    }
}`, stdin: '사과 배 사과 감 배 귤\n',
            notes: '<p><b>[8분]</b> 정답 실행 시 예시 입력이 자동으로 들어갑니다. 힌트: 배열을 HashSet 생성자에 넘기면 한 줄로 중복 제거. 빨리 끝난 학생은 실습 7-4(Dictionary 조회)로, 또는 Dictionary 로 단어별 횟수까지 출력해 보게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['컬렉션 = 늘고 줄어드는 그릇, <code>using System.Collections.Generic;</code>, <code>&lt;T&gt;</code> 로 자료형 지정', '<code>List&lt;T&gt;</code>: <code>Add · Insert · Remove · RemoveAt · Count · [i] · Contains · Sort</code>', '<code>Dictionary&lt;K, V&gt;</code>: 키 → 값, <code>ContainsKey · TryGetValue</code>, <code>KeyValuePair</code> 순회', '<code>Queue</code> FIFO · <code>Stack</code> LIFO · <code>HashSet</code> 중복 없음', '잘 모르겠으면 List, 이름으로 찾으면 Dictionary'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 장: 클래스와 객체 — 이 컬렉션들에 담을 “나만의 자료형”을 만드는 법.</p>' }
        ]
      }
    ]
  });
})();
