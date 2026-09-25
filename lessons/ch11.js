/* Chapter 11. 델리게이트 · 이벤트 · 람다 · LINQ */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_DELEGATE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="델리게이트는 메서드를 가리키는 변수">
  <defs>
    <marker id="ah11a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah11b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker>
  </defs>
  <text x="640" y="48" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--fg)">delegate int Calc(int a, int b);</text>
  <text x="640" y="84" text-anchor="middle" style="font-size:22px;fill:var(--muted)">"int 두 개를 받아 int 를 돌려주는 메서드" 를 담을 수 있는 새 자료형 Calc 를 만든다</text>
  <rect x="70" y="150" width="380" height="230" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="260" y="140" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent)">Calc calc   (델리게이트 변수)</text>
  <text x="260" y="205" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">calc = Add;</text>
  <text x="260" y="245" text-anchor="middle" style="font-size:20px;fill:var(--muted)">상자 안에는 값이 아니라 메서드의 "주소"</text>
  <text x="260" y="305" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">calc(3, 4)  →  7</text>
  <text x="260" y="345" text-anchor="middle" style="font-size:20px;fill:var(--muted)">호출하면 지금 가리키는 메서드가 실행된다</text>
  <line x1="455" y1="205" x2="750" y2="180" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah11a)"/>
  <line x1="455" y1="215" x2="750" y2="300" stroke="var(--muted)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah11b)"/>
  <line x1="455" y1="225" x2="750" y2="420" stroke="var(--muted)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah11b)"/>
  <text x="600" y="340" text-anchor="middle" style="font-size:19px;fill:var(--muted)">calc = Mul; 로 바꾸면</text>
  <text x="600" y="366" text-anchor="middle" style="font-size:19px;fill:var(--muted)">같은 calc(3, 4) 가 12 를 돌려준다</text>
  <rect x="760" y="140" width="460" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="990" y="173" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--accent)">static int Add(int a, int b)</text>
  <text x="990" y="204" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">{ return a + b; }</text>
  <rect x="760" y="260" width="460" height="80" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="990" y="293" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--fg)">static int Mul(int a, int b)</text>
  <text x="990" y="324" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">{ return a * b; }</text>
  <rect x="760" y="380" width="460" height="80" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="990" y="413" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--fg)">static int Sub(int a, int b)</text>
  <text x="990" y="444" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">{ return a - b; }</text>
  <text x="640" y="505" text-anchor="middle" style="font-size:23px;fill:var(--fg)">리모컨 비유: 버튼(호출)은 하나인데, 어떤 TV(메서드)를 조종할지는 나중에 바꿀 수 있다</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:21px;fill:var(--warn)">시그니처(매개변수 · 반환형)가 같은 메서드만 담을 수 있다 — Calc 에 void Print(string) 은 ✗</text>
</svg>`;

  const SVG_EVENT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="이벤트의 발행자와 구독자">
  <defs>
    <marker id="ah11c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
    <marker id="ah11d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker>
  </defs>
  <text x="640" y="44" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">이벤트(event) = "일이 생기면 알려 줘" — 발행자는 알리기만, 구독자는 각자 할 일을 한다</text>
  <rect x="60" y="120" width="440" height="270" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="280" y="110" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">발행자 (publisher) — MyButton</text>
  <text x="280" y="170" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">public event EventHandler Click;</text>
  <text x="280" y="205" text-anchor="middle" style="font-size:19px;fill:var(--muted)">구독자 명단(델리게이트)을 들고 있다</text>
  <line x1="90" y1="230" x2="470" y2="230" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="280" y="270" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">void Press()</text>
  <text x="280" y="305" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--accent2)">Click?.Invoke(this, EventArgs.Empty);</text>
  <text x="280" y="345" text-anchor="middle" style="font-size:19px;fill:var(--muted)">눌리면 명단의 메서드를 차례로 호출</text>
  <text x="280" y="372" text-anchor="middle" style="font-size:19px;fill:var(--muted)">?. 덕분에 구독자가 없어도 오류 없음</text>
  <rect x="800" y="120" width="420" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1010" y="150" text-anchor="middle" style="${MONO};font-size:21px;font-weight:700;fill:var(--ok)">OnSaveClick(sender, e)</text>
  <text x="1010" y="178" text-anchor="middle" style="font-size:19px;fill:var(--muted)">파일을 저장한다</text>
  <rect x="800" y="220" width="420" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1010" y="250" text-anchor="middle" style="${MONO};font-size:21px;font-weight:700;fill:var(--ok)">(s, e) =&gt; 로그 기록</text>
  <text x="1010" y="278" text-anchor="middle" style="font-size:19px;fill:var(--muted)">람다로 바로 구독</text>
  <rect x="800" y="320" width="420" height="70" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1010" y="350" text-anchor="middle" style="${MONO};font-size:21px;font-weight:700;fill:var(--ok)">(s, e) =&gt; 화면 갱신</text>
  <text x="1010" y="378" text-anchor="middle" style="font-size:19px;fill:var(--muted)">구독자는 몇 명이든 OK</text>
  <text x="1010" y="110" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">구독자 (subscriber)</text>
  <line x1="790" y1="165" x2="520" y2="185" stroke="var(--ok)" stroke-width="3" marker-end="url(#ah11c)"/>
  <line x1="790" y1="255" x2="520" y2="200" stroke="var(--ok)" stroke-width="3" marker-end="url(#ah11c)"/>
  <line x1="790" y1="345" x2="520" y2="215" stroke="var(--ok)" stroke-width="3" marker-end="url(#ah11c)"/>
  <text x="650" y="150" text-anchor="middle" style="${MONO};font-size:20px;font-weight:700;fill:var(--ok)">save.Click += …  (구독)</text>
  <line x1="510" y1="305" x2="790" y2="180" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 7" marker-end="url(#ah11d)"/>
  <line x1="510" y1="310" x2="790" y2="265" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 7" marker-end="url(#ah11d)"/>
  <line x1="510" y1="315" x2="790" y2="355" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 7" marker-end="url(#ah11d)"/>
  <text x="650" y="420" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--accent2)">Invoke → 등록된 순서대로 알림</text>
  <text x="640" y="480" text-anchor="middle" style="font-size:23px;fill:var(--fg)">WPF 도 같은 원리: <tspan style="${MONO}">&lt;Button Click="btnSave_Click"/&gt;</tspan> 는 <tspan style="${MONO}">btnSave.Click += btnSave_Click;</tspan> 과 같다</text>
  <text x="640" y="520" text-anchor="middle" style="font-size:21px;fill:var(--muted)">버튼은 "눌렸다" 고 알리기만 하고, 무엇을 할지는 구독자(우리 코드)가 정한다</text>
</svg>`;

  const SVG_LINQ = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="LINQ 메서드 체인은 컨베이어 벨트">
  <defs><marker id="ah11e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="46" text-anchor="middle" style="${MONO};font-size:25px;font-weight:700;fill:var(--fg)">nums.Where(n =&gt; n &gt;= 10).OrderBy(n =&gt; n).Select(n =&gt; n * 2).ToList()</text>
  <text x="640" y="82" text-anchor="middle" style="font-size:21px;fill:var(--muted)">데이터가 컨베이어 벨트를 타고 지나가며 단계마다 걸러지고 · 정렬되고 · 변환된다</text>
  <rect x="40" y="150" width="200" height="150" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="140" y="185" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">원본 nums</text>
  <text x="140" y="230" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">5 12 8 3</text>
  <text x="140" y="262" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">20 15 7</text>
  <line x1="245" y1="225" x2="295" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah11e)"/>
  <rect x="300" y="150" width="200" height="150" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="400" y="185" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--accent)">Where</text>
  <text x="400" y="212" text-anchor="middle" style="font-size:19px;fill:var(--muted)">조건에 맞는 것만 (필터)</text>
  <text x="400" y="262" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">12 20 15</text>
  <line x1="505" y1="225" x2="555" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah11e)"/>
  <rect x="560" y="150" width="200" height="150" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="660" y="185" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--accent)">OrderBy</text>
  <text x="660" y="212" text-anchor="middle" style="font-size:19px;fill:var(--muted)">기준으로 정렬</text>
  <text x="660" y="262" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">12 15 20</text>
  <line x1="765" y1="225" x2="815" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah11e)"/>
  <rect x="820" y="150" width="200" height="150" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="920" y="185" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--accent)">Select</text>
  <text x="920" y="212" text-anchor="middle" style="font-size:19px;fill:var(--muted)">각 요소를 변환</text>
  <text x="920" y="262" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">24 30 40</text>
  <line x1="1025" y1="225" x2="1075" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah11e)"/>
  <rect x="1080" y="150" width="160" height="150" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1160" y="185" text-anchor="middle" style="${MONO};font-size:22px;font-weight:700;fill:var(--ok)">ToList</text>
  <text x="1160" y="212" text-anchor="middle" style="font-size:19px;fill:var(--muted)">결과를 담기</text>
  <text x="1160" y="262" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">List&lt;int&gt;</text>
  <rect x="300" y="340" width="720" height="50" rx="10" fill="none" stroke="var(--warn)" stroke-width="3" stroke-dasharray="10 7"/>
  <text x="660" y="373" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--warn)">여기까지는 "계획"만 세운다 (지연 실행) — 실제로는 결과를 꺼낼 때(foreach · ToList · Count) 벨트가 돈다</text>
  <text x="640" y="450" text-anchor="middle" style="font-size:23px;fill:var(--fg)">각 단계는 <tspan font-weight="700">IEnumerable&lt;T&gt;</tspan> 를 받아 <tspan font-weight="700">IEnumerable&lt;T&gt;</tspan> 를 돌려주므로 점(.)으로 계속 이어 붙일 수 있다</text>
  <text x="640" y="490" text-anchor="middle" style="font-size:22px;fill:var(--muted)">괄호 안에 넣는 것은 모두 람다 — 11-1 교시의 Func / Predicate 가 그대로 쓰인다</text>
  <text x="640" y="530" text-anchor="middle" style="font-size:22px;fill:var(--muted)">배열 · List · Dictionary · 문자열 … IEnumerable&lt;T&gt; 라면 무엇이든 같은 메서드로 질의한다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch11',
    no: '11',
    title: '델리게이트 · 이벤트 · 람다 · LINQ',
    subtitle: 'Delegates, Events, Lambdas & LINQ',
    summary: '메서드를 값처럼 변수에 담아 전달하는 델리게이트와 람다 식, "일이 생기면 알려 주는" 이벤트를 배웁니다. 이어서 컬렉션을 한 줄로 걸러내고 · 정렬하고 · 집계하는 LINQ 를 익힙니다. WPF 의 이벤트 처리와 데이터 바인딩의 바탕이 되는 장입니다.',
    goals: [
      '델리게이트를 선언하고 메서드를 담아 호출하며, 멀티캐스트(+=)를 설명할 수 있다',
      'Action · Func · Predicate 와 람다 식으로 메서드를 매개변수로 전달할 수 있다',
      '이벤트를 선언 · 발생 · 구독하고 EventArgs 로 데이터를 전달할 수 있다',
      'LINQ 메서드 체인(Where · Select · OrderBy · GroupBy · 집계)으로 컬렉션을 질의할 수 있다',
      '지연 실행 · 익명 형식 · 확장 메서드의 개념을 설명할 수 있다'
    ],
    sections: [
      /* ===================== ch11-1 ===================== */
      {
        id: 'ch11-1',
        title: '델리게이트 · 람다 · 이벤트',
        minutes: 50,
        goals: [
          '델리게이트가 "메서드를 담는 변수" 임을 설명하고 선언 · 대입 · 호출할 수 있다',
          'Action · Func · Predicate 와 람다 식을 사용할 수 있다',
          '메서드를 매개변수로 넘겨 정렬 기준 · 검색 조건 · 콜백을 만들 수 있다',
          '이벤트를 선언 · 발생시키고 구독하며, EventArgs 로 데이터를 전달할 수 있다'
        ],
        flow: [['도입: 메서드를 값처럼', 5], ['델리게이트 · 멀티캐스트', 12], ['Action · Func · 람다 · 콜백', 13], ['이벤트 · EventArgs', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '델리게이트(delegate) — 메서드를 담는 변수' },
          { type: 'p', html: '지금까지 변수에는 숫자 · 문자열 · 객체를 담았습니다. C# 에서는 <b>메서드도 변수에 담을 수 있습니다</b>. 그 변수의 자료형이 <b>델리게이트(delegate, 대리자)</b> 입니다. 리모컨을 떠올려 보세요. 리모컨의 버튼(호출)은 하나지만, <b>어떤 TV(메서드)를 조종할지는 나중에 바꿀 수</b> 있습니다. 델리게이트 변수를 호출하면 그 순간 변수가 가리키는 메서드가 대신 실행됩니다.' },
          { type: 'figure', html: SVG_DELEGATE, caption: '델리게이트 변수에는 메서드가 들어간다 — 호출하면 지금 가리키는 메서드가 실행된다' },
          { type: 'code', title: '예제 11-1. 델리게이트 선언 · 대입 · 호출', code: `using System;

// "int 두 개를 받아 int 를 돌려주는 메서드" 를 담는 자료형 Calc
delegate int Calc(int a, int b);

class Program
{
    static int Add(int a, int b) { return a + b; }
    static int Mul(int a, int b) { return a * b; }

    static void Main()
    {
        Calc calc = Add;                       // 메서드 이름만 적으면 대입된다 (괄호 없음!)
        Console.WriteLine(calc(3, 4));         // 가리키는 Add 가 실행 → 7

        calc = Mul;                            // 다른 메서드로 바꾸기
        Console.WriteLine(calc(3, 4));         // 이번엔 Mul → 12
        Console.WriteLine(calc.Invoke(5, 6));  // calc(5, 6) 과 같은 뜻

        Calc[] ops = { Add, Mul };             // 델리게이트도 배열에 담을 수 있다
        foreach (Calc op in ops)
            Console.WriteLine(op(10, 2));
    }
}`, expect: `7
12
30
12
20`, desc: '<code>delegate int Calc(int a, int b);</code> 는 클래스 바깥(또는 안)에 쓰는 <b>자료형 선언</b>입니다. 반환형 · 매개변수가 같은 메서드만 담을 수 있습니다. 대입할 때는 <code>Add</code> 처럼 <b>괄호 없이 이름만</b> 씁니다(<code>Add()</code> 라고 쓰면 “호출한 결과 7” 을 넣으려는 것이라 오류). 호출은 보통 메서드처럼 <code>calc(3, 4)</code>.' },
          { type: 'table', head: ['단계', '코드', '뜻'], rows: [
            ['선언', '<code>delegate int Calc(int a, int b);</code>', '이런 모양의 메서드를 담는 자료형 <code>Calc</code> 를 만든다'],
            ['대입', '<code>Calc calc = Add;</code>', '변수 <code>calc</code> 가 메서드 <code>Add</code> 를 가리킨다'],
            ['호출', '<code>int r = calc(3, 4);</code>', '지금 가리키는 메서드가 실행되고 결과를 돌려준다'],
            ['추가 · 제거', '<code>calc += Mul; calc -= Add;</code>', '여러 메서드를 붙였다 뗐다 (멀티캐스트)']
          ], caption: '델리게이트 사용 4단계' },
          { type: 'h', text: '멀티캐스트 — 한 번 호출로 여러 메서드 실행' },
          { type: 'p', html: '델리게이트에는 <code>+=</code> 로 메서드를 <b>여러 개</b> 붙일 수 있습니다. 호출하면 <b>붙인 순서대로 모두</b> 실행됩니다. <code>-=</code> 로 떼어 냅니다. 이것이 잠시 뒤 배울 이벤트의 바탕입니다.' },
          { type: 'code', title: '예제 11-2. 멀티캐스트 델리게이트 — 알림을 여러 곳에', code: `using System;

delegate void Notify(string message);

class Program
{
    static void ToConsole(string m) { Console.WriteLine($"[콘솔] {m}"); }
    static void ToLog(string m)     { Console.WriteLine($"[로그] {m}"); }
    static void ToPopup(string m)   { Console.WriteLine($"[팝업] {m}"); }

    static void Main()
    {
        Notify notify = ToConsole;
        notify += ToLog;             // 두 번째 메서드 추가
        notify += ToPopup;           // 세 번째
        notify("저장 완료");          // 한 번 호출 → 셋 다 실행

        Console.WriteLine("--- 로그는 구독 해제 ---");
        notify -= ToLog;
        notify("삭제 완료");
        Console.WriteLine($"등록된 메서드 수: {notify.GetInvocationList().Length}");
    }
}`, expect: `[콘솔] 저장 완료
[로그] 저장 완료
[팝업] 저장 완료
--- 로그는 구독 해제 ---
[콘솔] 삭제 완료
[팝업] 삭제 완료
등록된 메서드 수: 2`, desc: '<code>GetInvocationList()</code> 는 현재 붙어 있는 메서드 목록을 돌려줍니다. 반환값이 있는 델리게이트를 멀티캐스트로 호출하면 <b>마지막 메서드의 반환값만</b> 남으므로, 멀티캐스트는 보통 <code>void</code> 델리게이트에 씁니다.' },
          { type: 'callout', kind: 'warn', title: '모든 메서드를 떼어 내면 null', html: '<code>notify -= ToConsole; notify -= ToPopup;</code> 까지 하면 <code>notify</code> 는 <b><code>null</code></b> 이 되고, <code>notify("…")</code> 를 호출하면 <code>NullReferenceException</code> 이 납니다. 안전하게 호출하려면 <code>notify?.Invoke("…")</code> 처럼 <b><code>?.</code> (null 조건 연산자)</b> 를 씁니다 — 이벤트에서 늘 보게 될 형태입니다.' },
          { type: 'h', text: '내장 델리게이트 — Action · Func · Predicate' },
          { type: 'p', html: '델리게이트를 매번 <code>delegate …</code> 로 선언하는 것은 번거롭습니다. .NET 에는 자주 쓰는 모양이 <b>제네릭 델리게이트</b>로 미리 준비되어 있습니다. 실무에서는 거의 이것만 씁니다.' },
          { type: 'table', head: ['델리게이트', '모양', '예', '뜻'], rows: [
            ['<code>Action</code>', '매개변수 없음, 반환 없음', '<code>Action hello = SayHello;</code>', '“그냥 실행해”'],
            ['<code>Action&lt;T&gt;</code>', '매개변수 T, 반환 없음', '<code>Action&lt;string&gt; print = Console.WriteLine;</code>', '값을 받아 처리만 (최대 16개)'],
            ['<code>Func&lt;T, TResult&gt;</code>', '매개변수 T, 반환 TResult', '<code>Func&lt;int, int, int&gt; add;</code>', '<b>마지막 형식이 반환형</b>'],
            ['<code>Predicate&lt;T&gt;</code>', '매개변수 T, 반환 <code>bool</code>', '<code>Predicate&lt;int&gt; isEven;</code>', '“조건에 맞나?” (= <code>Func&lt;T, bool&gt;</code>)']
          ], caption: 'Func 는 마지막 형식 인수가 반환형. Func<int, int, int> = int 두 개 받아 int 반환' },
          { type: 'h', text: '람다 식(lambda expression) — 이름 없는 메서드를 그 자리에서' },
          { type: 'p', html: '델리게이트에 넣을 메서드를 매번 따로 만드는 대신, <b>그 자리에서 짧게</b> 쓸 수 있습니다. <code>(매개변수) =&gt; 식</code> 형태이며 <code>=&gt;</code> 는 “<b>~를 받아서 ~를 만든다</b>” 로 읽습니다. 매개변수의 자료형은 컴파일러가 델리게이트 형식을 보고 알아냅니다.' },
          { type: 'table', head: ['형태', '예', '설명'], rows: [
            ['식 본문 (expression body)', '<code>(a, b) =&gt; a + b</code>', '식의 값이 곧 반환값. <code>return</code> 없음'],
            ['매개변수 하나', '<code>x =&gt; x * x</code>', '괄호 생략 가능'],
            ['매개변수 없음', '<code>() =&gt; Console.WriteLine("hi")</code>', '빈 괄호'],
            ['문장 본문 (statement body)', '<code>(a, b) =&gt; { if (a &gt; b) return a; return b; }</code>', '여러 문장이면 중괄호 + <code>return</code>'],
            ['자료형 명시', '<code>(int a, int b) =&gt; a + b</code>', '보통은 생략']
          ] },
          { type: 'code', title: '예제 11-3. Action · Func · Predicate 에 람다 담기', code: `using System;

class Program
{
    static void Main()
    {
        Func<int, int, int> add = (a, b) => a + b;        // int 둘 → int
        Func<double, double> square = x => x * x;          // 매개변수 하나는 괄호 생략
        Action<string> greet = name => Console.WriteLine($"안녕, {name}!");
        Action hello = () => Console.WriteLine("매개변수 없는 람다");
        Predicate<int> isEven = n => n % 2 == 0;           // bool 반환

        Console.WriteLine(add(3, 4));
        Console.WriteLine(square(2.5));
        greet("철수");
        hello();
        Console.WriteLine(isEven(10));
        Console.WriteLine(isEven(7));

        // 문장 본문: 중괄호와 return
        Func<int, int, int> max = (a, b) =>
        {
            if (a > b) return a;
            return b;
        };
        Console.WriteLine(max(8, 3));
    }
}`, expect: `7
6.25
안녕, 철수!
매개변수 없는 람다
True
False
8`, desc: '<code>add</code> 는 예제 11-1 의 <code>Calc</code> 델리게이트 + <code>Add</code> 메서드를 <b>한 줄</b>로 줄인 것입니다. 람다는 “메서드를 만들되 이름은 붙이지 않고, 쓰는 자리에 바로 적는다” 고 이해하세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 익명 메서드', html: '람다가 나오기 전(C# 2)에는 <code>delegate (int a, int b) { return a + b; }</code> 처럼 <b>익명 메서드(anonymous method)</b> 문법을 썼습니다. 오래된 코드에서 가끔 보이지만 지금은 람다가 완전히 대체했으니 “이런 것도 있다” 정도만 알아 두세요.' },
          { type: 'h', text: '메서드를 매개변수로 전달하기 — 콜백' },
          { type: 'p', html: '델리게이트 매개변수를 받는 메서드는 “<b>무엇을 할지는 네가 정해서 넘겨 줘</b>” 라고 말하는 셈입니다. 이렇게 넘겨진 메서드를 <b>콜백(callback)</b> 이라고 합니다. 7장에서 본 <code>List&lt;T&gt;</code> 의 <code>Sort</code> · <code>FindAll</code> · <code>Find</code> · <code>Exists</code> 도 모두 람다를 받는 메서드입니다.' },
          { type: 'code', title: '예제 11-4. 콜백 · 정렬 기준 · 검색 조건을 람다로', code: `using System;
using System.Collections.Generic;

class Program
{
    // "몇 번 반복할지" 와 "매번 무엇을 할지(action)" 를 함께 받는다
    static void Repeat(int times, Action<int> action)
    {
        for (int i = 1; i <= times; i++) action(i);
    }

    static void Main()
    {
        Repeat(3, i => Console.WriteLine($"{i}번째 실행"));

        List<int> scores = new List<int> { 72, 95, 88, 60, 100 };
        List<int> passed = scores.FindAll(s => s >= 80);          // 조건에 맞는 것 모두
        Console.WriteLine(string.Join(", ", passed));

        scores.Sort((a, b) => b.CompareTo(a));                    // 정렬 기준: 내림차순
        Console.WriteLine(string.Join(", ", scores));

        List<string> fruits = new List<string> { "바나나", "사과", "파인애플", "귤" };
        fruits.Sort((a, b) => a.Length.CompareTo(b.Length));      // 글자 수 순
        Console.WriteLine(string.Join(", ", fruits));
        Console.WriteLine(fruits.Exists(f => f.Length > 3));      // 하나라도 있나?
        Console.WriteLine(fruits.Find(f => f.StartsWith("사")));   // 첫 번째로 맞는 것
    }
}`, expect: `1번째 실행
2번째 실행
3번째 실행
95, 88, 100
100, 95, 88, 72, 60
귤, 사과, 바나나, 파인애플
True
사과`, desc: '<code>Sort</code> 에 넘기는 람다는 “a 가 b 보다 앞이면 음수, 뒤면 양수” 를 돌려주는 <b>비교 기준</b>입니다. <code>b.CompareTo(a)</code> 로 순서를 뒤집으면 내림차순이 됩니다. 다음 교시의 LINQ 는 이 방식을 모든 컬렉션으로 넓힌 것입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 클로저(closure): 람다는 바깥 변수를 기억한다', html: '람다 안에서 <b>바깥에 있는 지역 변수</b>를 쓸 수 있습니다. 이때 람다는 값의 복사본이 아니라 <b>변수 자체</b>를 붙잡습니다(capture). 그래서 변수를 나중에 바꾸면 람다의 결과도 바뀌고, 메서드가 끝난 뒤에도 람다가 살아 있으면 그 변수도 함께 살아남습니다. 이런 람다를 <b>클로저</b>라고 부릅니다.' },
          { type: 'code', title: '추가 예제. 클로저 — 바깥 변수를 붙잡는 람다', code: `using System;

class Program
{
    static Func<int> MakeCounter()
    {
        int count = 0;
        return () => ++count;      // 지역 변수 count 를 붙잡은 채 돌려준다
    }

    static void Main()
    {
        int factor = 3;
        Func<int, int> times = x => x * factor;   // 바깥 변수 factor 사용
        Console.WriteLine(times(5));
        factor = 10;                              // 변수를 바꾸면
        Console.WriteLine(times(5));              // 람다 결과도 바뀐다

        Func<int> counter = MakeCounter();
        Console.WriteLine(counter());
        Console.WriteLine(counter());
        Console.WriteLine(counter());             // count 가 계속 살아 있다
        Func<int> another = MakeCounter();        // 새 count
        Console.WriteLine(another());
    }
}`, expect: `15
50
1
2
3
1`, desc: '<code>MakeCounter</code> 는 끝났지만 람다가 <code>count</code> 를 붙잡고 있어 값이 유지됩니다. <code>another</code> 는 새로 호출해 만든 것이라 <code>count</code> 도 새것입니다.' },
          { type: 'h', text: '이벤트(event) — “일이 생기면 알려 줘”' },
          { type: 'p', html: '버튼이 눌리고, 파일 다운로드가 끝나고, 온도가 바뀌는 것처럼 <b>언제 일어날지 모르는 일</b>이 있습니다. 이런 일을 처리하는 방법이 <b>이벤트</b>입니다. 일이 생긴 쪽(<b>발행자, publisher</b>)은 “눌렸다!” 고 <b>알리기만</b> 하고, 관심 있는 쪽(<b>구독자, subscriber</b>)이 미리 자기 메서드를 <b>등록(<code>+=</code>)</b> 해 두면 그 메서드가 호출됩니다. 유튜브 채널 구독과 같습니다. 채널(발행자)은 새 영상을 올리기만 하고, 구독자들에게 알림이 갑니다.' },
          { type: 'figure', html: SVG_EVENT, caption: '발행자는 event 로 구독자 명단을 들고 있다가 Invoke 로 알린다 — 구독자는 += 로 등록' },
          { type: 'list', items: [
            '<b>선언</b>: 발행자 클래스 안에 <code>public event EventHandler Click;</code> — <code>event</code> 키워드 + 델리게이트 형식 + 이름',
            '<b><code>EventHandler</code></b>: .NET 이 정해 둔 표준 이벤트 델리게이트. 모양은 <code>void (object sender, EventArgs e)</code> — <b>누가(sender) 보냈고, 어떤 정보(e)인가</b>',
            '<b>발생</b>: 발행자 안에서 <code>Click?.Invoke(this, EventArgs.Empty);</code> — 구독자가 없으면(null) 그냥 넘어감',
            '<b>구독</b>: 바깥에서 <code>btn.Click += OnClick;</code> 또는 람다 <code>btn.Click += (s, e) =&gt; { … };</code>. 해제는 <code>-=</code>'
          ] },
          { type: 'code', title: '예제 11-5. 버튼 클릭 이벤트 흉내 내기 — 발행자와 구독자', code: `using System;

// 발행자: "눌렸다" 고 알리기만 한다
class MyButton
{
    public string Text { get; }
    public event EventHandler Click;           // 이벤트 선언 (구독자 명단)

    public MyButton(string text) { Text = text; }

    public void Press()                        // 사용자가 눌렀다고 가정
    {
        Console.WriteLine($"[{Text}] 버튼이 눌렸다");
        Click?.Invoke(this, EventArgs.Empty);  // 구독자 모두에게 알림
    }
}

class Program
{
    // 구독자 메서드: EventHandler 와 같은 모양 (object, EventArgs)
    static void OnSaveClick(object sender, EventArgs e)
    {
        MyButton btn = (MyButton)sender;       // 누가 보냈는지
        Console.WriteLine($"  → {btn.Text} 처리: 파일을 저장합니다");
    }

    static void Main()
    {
        MyButton save = new MyButton("저장");
        MyButton quit = new MyButton("종료");

        save.Click += OnSaveClick;                                        // 메서드로 구독
        save.Click += (s, e) => Console.WriteLine("  → 로그: 저장 버튼 클릭 기록");   // 람다로 구독
        quit.Click += (s, e) => Console.WriteLine("  → 프로그램을 끝냅니다");

        save.Press();
        quit.Press();

        MyButton help = new MyButton("도움말");
        help.Press();                          // 구독자가 없어도 ?. 덕분에 오류 없음
    }
}`, expect: `[저장] 버튼이 눌렸다
  → 저장 처리: 파일을 저장합니다
  → 로그: 저장 버튼 클릭 기록
[종료] 버튼이 눌렸다
  → 프로그램을 끝냅니다
[도움말] 버튼이 눌렸다`, desc: '<code>MyButton</code> 은 저장 · 종료 · 도움말 중 <b>무엇을 해야 하는지 전혀 모릅니다</b>. 그저 눌렸다고 알릴 뿐이고, 무엇을 할지는 구독한 쪽이 정합니다. 이 덕분에 버튼 클래스 하나를 어디에나 재사용할 수 있습니다. WPF 의 <code>Button</code> 도 정확히 이렇게 만들어져 있습니다.' },
          { type: 'callout', kind: 'warn', title: 'event 키워드가 하는 일', html: '<code>event</code> 없이 그냥 <code>public EventHandler Click;</code> 이라고 델리게이트 필드를 두어도 동작은 합니다. 하지만 그러면 바깥에서 <code>btn.Click = null;</code> 로 다른 사람의 구독을 <b>모두 지우거나</b>, <code>btn.Click(…)</code> 으로 <b>마음대로 발생</b>시킬 수 있습니다. <code>event</code> 를 붙이면 바깥에서는 <b><code>+=</code> 와 <code>-=</code> 만</b> 허용되고, 발생은 오직 발행자 클래스 안에서만 할 수 있습니다.' },
          { type: 'h', text: 'EventArgs 상속 — 이벤트와 함께 데이터 보내기' },
          { type: 'p', html: '“눌렸다” 만으로 부족할 때가 있습니다. “온도가 <b>몇 도로</b> 바뀌었나”, “가격이 <b>얼마에서 얼마로</b>” 처럼 데이터가 필요하면 <code>EventArgs</code> 를 <b>상속한 클래스</b>를 만들고, 델리게이트는 제네릭 <code>EventHandler&lt;TEventArgs&gt;</code> 를 씁니다.' },
          { type: 'code', title: '예제 11-6. EventHandler<T> 와 사용자 정의 EventArgs', code: `using System;

// 이벤트와 함께 보낼 데이터
class PriceChangedEventArgs : EventArgs
{
    public int OldPrice { get; }
    public int NewPrice { get; }
    public PriceChangedEventArgs(int oldPrice, int newPrice)
    {
        OldPrice = oldPrice;
        NewPrice = newPrice;
    }
}

class Product
{
    private int price;
    public string Name { get; }
    public event EventHandler<PriceChangedEventArgs> PriceChanged;   // 데이터를 담아 보내는 이벤트

    public Product(string name, int price) { Name = name; this.price = price; }

    public int Price
    {
        get { return price; }
        set
        {
            if (value == price) return;        // 같은 값이면 알릴 필요 없음
            int old = price;
            price = value;
            PriceChanged?.Invoke(this, new PriceChangedEventArgs(old, value));
        }
    }
}

class Program
{
    static void Main()
    {
        Product laptop = new Product("노트북", 1200000);
        laptop.PriceChanged += (sender, e) =>
        {
            Product p = (Product)sender;
            string dir = e.NewPrice > e.OldPrice ? "인상" : "인하";
            Console.WriteLine($"{p.Name} 가격 {dir}: {e.OldPrice:N0} → {e.NewPrice:N0}");
        };

        laptop.Price = 1100000;
        laptop.Price = 1100000;   // 같은 값: 이벤트 발생 안 함
        laptop.Price = 1250000;
    }
}`, expect: `노트북 가격 인하: 1,200,000 → 1,100,000
노트북 가격 인상: 1,100,000 → 1,250,000`, desc: '속성의 <code>set</code> 안에서 값이 <b>실제로 바뀔 때만</b> 이벤트를 발생시키는 패턴입니다. WPF 데이터 바인딩(18장)의 <code>INotifyPropertyChanged</code> · <code>PropertyChanged</code> 이벤트가 정확히 이 모양으로, 속성이 바뀌면 화면이 자동으로 갱신됩니다.' },
          { type: 'callout', kind: 'info', title: 'WPF 와의 연결', html: '<ul><li>WPF 에서 <code>&lt;Button Click="btnSave_Click"/&gt;</code> 라고 쓰면 코드 비하인드에 <code>private void btnSave_Click(object sender, RoutedEventArgs e)</code> 가 만들어집니다. 모양이 <code>EventHandler</code> 와 같고, <code>RoutedEventArgs</code> 는 <code>EventArgs</code> 의 자식입니다.</li><li><code>sender</code> 를 <code>(Button)sender</code> 로 캐스트하면 어느 버튼이 눌렸는지 알 수 있습니다 — 예제 11-5 와 같습니다.</li><li>데이터 바인딩은 <code>PropertyChanged</code> 이벤트로 “값이 바뀌었다” 를 화면에 알립니다 — 예제 11-6 과 같습니다.</li></ul>17장 · 18장에서 다시 만나게 되니, 지금은 <b>“이벤트 = 델리게이트 명단 + 알림”</b> 을 확실히 익혀 두세요.' }
        ],
        practice: [
          {
            title: '실습 11-1. 계산기 — 델리게이트 배열',
            level: 1,
            desc: '<p>두 정수를 입력받아 <b>사칙연산 네 가지</b>를 모두 출력하세요. 연산은 <code>Calc</code> 델리게이트 배열에 <b>람다 4개</b>를 담고, 기호 배열과 함께 <code>for</code> 문으로 돌립니다.</p><pre>첫 번째 수: 20\n두 번째 수: 4\n20 + 4 = 24\n20 - 4 = 16\n20 * 4 = 80\n20 / 4 = 5</pre>',
            hint: '<code>Calc[] ops = { (a, b) =&gt; a + b, (a, b) =&gt; a - b, … };</code> 그리고 <code>ops[i](x, y)</code>.',
            starter: `using System;

delegate int Calc(int a, int b);

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int x = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int y = int.Parse(Console.ReadLine());

        string[] symbols = { "+", "-", "*", "/" };
        // TODO: Calc 배열 ops 에 람다 4개 담기

        // TODO: for 문으로 "x 기호 y = 결과" 출력
    }
}
`,
            solution: `using System;

delegate int Calc(int a, int b);

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int x = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int y = int.Parse(Console.ReadLine());

        string[] symbols = { "+", "-", "*", "/" };
        Calc[] ops = { (a, b) => a + b, (a, b) => a - b, (a, b) => a * b, (a, b) => a / b };

        for (int i = 0; i < ops.Length; i++)
            Console.WriteLine($"{x} {symbols[i]} {y} = {ops[i](x, y)}");
    }
}
`,
            stdin: '20\n4\n',
            expect: `첫 번째 수: 두 번째 수: 20 + 4 = 24
20 - 4 = 16
20 * 4 = 80
20 / 4 = 5`
          },
          {
            title: '실습 11-2. 온도 센서 — TemperatureChanged 이벤트',
            level: 2,
            desc: '<p><code>Sensor</code> 클래스에 <code>EventHandler&lt;TemperatureEventArgs&gt;</code> 형식의 <b><code>TemperatureChanged</code> 이벤트</b>를 만드세요. <code>Measure(double t)</code> 는 측정값을 출력한 뒤 이벤트를 발생시킵니다. <code>Main</code> 에서는 이벤트를 구독해 <b>30도 이상이면 경고</b>를 출력합니다.</p><pre>측정: 24.5도\n측정: 28.0도\n측정: 31.2도\n  경고! 31.2도 — 임계값 초과\n측정: 29.9도\n측정: 35.0도\n  경고! 35.0도 — 임계값 초과</pre>',
            hint: '이벤트 발생: <code>TemperatureChanged?.Invoke(this, new TemperatureEventArgs(t));</code> 구독: <code>sensor.TemperatureChanged += (s, e) =&gt; { if (e.Temperature &gt;= 30) … };</code>',
            starter: `using System;

class TemperatureEventArgs : EventArgs
{
    public double Temperature { get; }
    public TemperatureEventArgs(double temperature) { Temperature = temperature; }
}

class Sensor
{
    // TODO: TemperatureChanged 이벤트 선언

    public void Measure(double t)
    {
        Console.WriteLine($"측정: {t:F1}도");
        // TODO: 이벤트 발생
    }
}

class Program
{
    static void Main()
    {
        Sensor sensor = new Sensor();
        // TODO: 이벤트 구독 — 30도 이상이면 "  경고! xx.x도 — 임계값 초과"

        double[] readings = { 24.5, 28.0, 31.2, 29.9, 35.0 };
        foreach (double t in readings) sensor.Measure(t);
    }
}
`,
            solution: `using System;

class TemperatureEventArgs : EventArgs
{
    public double Temperature { get; }
    public TemperatureEventArgs(double temperature) { Temperature = temperature; }
}

class Sensor
{
    public event EventHandler<TemperatureEventArgs> TemperatureChanged;

    public void Measure(double t)
    {
        Console.WriteLine($"측정: {t:F1}도");
        TemperatureChanged?.Invoke(this, new TemperatureEventArgs(t));
    }
}

class Program
{
    static void Main()
    {
        Sensor sensor = new Sensor();
        sensor.TemperatureChanged += (s, e) =>
        {
            if (e.Temperature >= 30)
                Console.WriteLine($"  경고! {e.Temperature:F1}도 — 임계값 초과");
        };

        double[] readings = { 24.5, 28.0, 31.2, 29.9, 35.0 };
        foreach (double t in readings) sensor.Measure(t);
    }
}
`,
            expect: `측정: 24.5도
측정: 28.0도
측정: 31.2도
  경고! 31.2도 — 임계값 초과
측정: 29.9도
측정: 35.0도
  경고! 35.0도 — 임계값 초과`
          }
        ],
        quiz: [
          { q: '델리게이트(delegate)를 가장 잘 설명한 것은?', options: ['클래스를 상속하는 방법', '메서드를 담아 두고 나중에 호출할 수 있는 변수의 자료형', '예외를 처리하는 블록', '컬렉션을 정렬하는 메서드'], answer: 1, explain: '델리게이트 변수에는 시그니처가 같은 메서드를 담을 수 있고, 변수를 호출하면 그 메서드가 실행됩니다.' },
          { q: '<code>Func&lt;int, string, bool&gt; f</code> 에 담을 수 있는 메서드의 모양은?', options: ['<code>int M(string a, bool b)</code>', '<code>bool M(int a, string b)</code>', '<code>void M(int a, string b, bool c)</code>', '<code>string M(int a, bool b)</code>'], answer: 1, explain: '<code>Func</code> 는 <b>마지막</b> 형식 인수가 반환형입니다. int, string 을 받아 bool 을 돌려주는 메서드.' },
          { q: '다음 코드의 출력은?<pre><code>Action&lt;int&gt; a = x =&gt; Console.Write(x);\na += x =&gt; Console.Write(x * 2);\na(3);</code></pre>', options: ['3', '6', '36', '33'], answer: 2, explain: '멀티캐스트 델리게이트는 붙인 순서대로 모두 실행됩니다. 3 을 출력한 뒤 6 을 출력 → 36.' },
          { q: '구독자가 하나도 없을 때 <code>NullReferenceException</code> 없이 이벤트를 발생시키는 코드는?', options: ['<code>Click(this, e);</code>', '<code>Click.Invoke(this, e);</code>', '<code>Click?.Invoke(this, e);</code>', '<code>Click += (this, e);</code>'], answer: 2, explain: '구독자가 없으면 이벤트(델리게이트)는 null 입니다. <code>?.</code> 는 null 이면 호출을 건너뜁니다.' },
          { q: '<code>event</code> 키워드를 붙인 이벤트에 대해 <b>클래스 바깥에서</b> 할 수 있는 일은?', options: ['<code>+=</code> / <code>-=</code> 로 구독 · 해제', '<code>= null</code> 로 모든 구독 제거', '직접 호출해 발생시키기', '위 세 가지 모두'], answer: 0, explain: '<code>event</code> 는 바깥에서 구독과 해제만 허용합니다. 발생과 초기화는 발행자 클래스 안에서만 가능합니다.' }
        ],
        slides: [
          { layout: 'title', title: '델리게이트 · 람다 · 이벤트', subtitle: 'Chapter 11 · Section 01 — 메서드를 값처럼 다루기', badge: '11-1',
            notes: '<p><b>[도입 3분]</b> “버튼이 눌리면 무슨 일을 할지, 버튼을 만든 사람이 미리 알 수 있을까요?” — 없다. 그래서 “나중에 알려 줄 메서드를 담아 둘 상자” 가 필요하다 → 델리게이트.</p><p>오늘 목표: 델리게이트 선언 · 대입 · 호출 · 멀티캐스트, Action/Func 와 람다, 이벤트 발행 · 구독. WPF 이벤트 처리의 바탕임을 예고.</p>' },
          { layout: 'diagram', title: '델리게이트 = 메서드를 담는 변수', html: SVG_DELEGATE, caption: 'delegate 로 자료형 선언 → 메서드 대입 → 호출하면 가리키는 메서드 실행',
            notes: '<p><b>[5분]</b> 리모컨 비유: 버튼은 하나, 조종할 TV 는 바꿀 수 있다. 상자 안에 값이 아니라 “메서드의 주소” 가 들어 있음을 강조.</p><p>발문: “Calc 에 void Print(string) 을 넣으면?” → 시그니처가 달라 컴파일 오류.</p>' },
          { layout: 'code', title: '예제 11-1. 선언 · 대입 · 호출', code: `using System;

delegate int Calc(int a, int b);

class Program
{
    static int Add(int a, int b) { return a + b; }
    static int Mul(int a, int b) { return a * b; }

    static void Main()
    {
        Calc calc = Add;                 // 괄호 없이 이름만
        Console.WriteLine(calc(3, 4));   // 7
        calc = Mul;
        Console.WriteLine(calc(3, 4));   // 12

        Calc[] ops = { Add, Mul };
        foreach (Calc op in ops)
            Console.WriteLine(op(10, 2));
    }
}`, points: ['<code>delegate</code> 로 <b>자료형</b>을 선언', '대입은 <code>Add</code> — 괄호 없이', '호출은 보통 메서드처럼 <code>calc(3, 4)</code>', '배열 · 매개변수 · 반환값으로도 사용 가능'],
            notes: '<p><b>[5분]</b> <code>Calc calc = Add();</code> 라고 써 보고 오류를 보여 주세요(호출 결과 int 를 넣으려는 것). 학생에게 Sub 메서드를 추가해 배열에 넣게 합니다.</p>' },
          { layout: 'code', title: '예제 11-2. 멀티캐스트 — += 로 여러 메서드', code: `using System;

delegate void Notify(string message);

class Program
{
    static void ToConsole(string m) { Console.WriteLine($"[콘솔] {m}"); }
    static void ToLog(string m)     { Console.WriteLine($"[로그] {m}"); }

    static void Main()
    {
        Notify notify = ToConsole;
        notify += ToLog;          // 추가
        notify("저장 완료");       // 둘 다 실행

        notify -= ToConsole;      // 제거
        notify("삭제 완료");
    }
}`, points: ['<code>+=</code> 추가, <code>-=</code> 제거', '호출 한 번 → 등록 순서대로 모두 실행', '모두 떼면 <b>null</b> → <code>?.Invoke</code> 로 안전하게', '이것이 이벤트의 바탕'],
            notes: '<p><b>[4분]</b> 실행 후 <code>notify -= ToLog;</code> 까지 추가하고 호출해 NullReferenceException 을 일부러 보여 주세요. 그리고 <code>notify?.Invoke("…")</code> 로 고칩니다.</p>' },
          { layout: 'table', title: '내장 델리게이트 — 직접 선언하지 않아도 된다', head: ['델리게이트', '모양', '예'], rows: [['<code>Action</code>', '매개변수 ✗, 반환 ✗', '<code>Action hello</code>'], ['<code>Action&lt;T&gt;</code>', 'T 받고 반환 ✗', '<code>Action&lt;string&gt; print</code>'], ['<code>Func&lt;T, TResult&gt;</code>', 'T 받고 TResult 반환', '<code>Func&lt;int, int, int&gt; add</code>'], ['<code>Predicate&lt;T&gt;</code>', 'T 받고 bool 반환', '<code>Predicate&lt;int&gt; isEven</code>']],
            lead: 'Func 는 마지막 형식이 반환형 · 실무에서는 거의 이것만 쓴다',
            notes: '<p><b>[4분]</b> 발문: “<code>Func&lt;string, int&gt;</code> 는 무엇을 받아 무엇을 돌려주나?” → string 받아 int. “<code>Func&lt;int&gt;</code> 는?” → 받는 것 없이 int 반환.</p>' },
          { layout: 'code', title: '람다 식과 콜백 — 메서드를 그 자리에서', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Repeat(int times, Action<int> action)
    {
        for (int i = 1; i <= times; i++) action(i);
    }

    static void Main()
    {
        Func<int, int, int> add = (a, b) => a + b;
        Predicate<int> isEven = n => n % 2 == 0;
        Console.WriteLine(add(3, 4));
        Console.WriteLine(isEven(7));

        Repeat(3, i => Console.WriteLine($"{i}번째"));

        List<int> scores = new List<int> { 72, 95, 88, 60 };
        Console.WriteLine(string.Join(", ", scores.FindAll(s => s >= 80)));
        scores.Sort((a, b) => b.CompareTo(a));
        Console.WriteLine(string.Join(", ", scores));
    }
}`, points: ['<code>(a, b) =&gt; a + b</code> — “받아서 → 만든다”', '매개변수 하나면 괄호 생략', '여러 문장은 <code>{ }</code> + <code>return</code>', '<code>Sort</code> · <code>FindAll</code> 은 람다를 받는 메서드'],
            notes: '<p><b>[8분]</b> 예제 11-1 의 Add 메서드가 <code>(a, b) =&gt; a + b</code> 한 줄로 줄어드는 것을 나란히 보여 주세요. <code>Repeat</code> 의 두 번째 인수를 바꿔 가며 실행. 시간이 있으면 클로저(추가 예제)도 시연.</p>' },
          { layout: 'diagram', title: '이벤트 — 발행자와 구독자', html: SVG_EVENT, caption: 'event 로 구독자 명단을 들고 있다가 Invoke 로 알린다. WPF Button.Click 도 같은 원리',
            notes: '<p><b>[5분]</b> 유튜브 구독 비유. 발행자는 “무엇을 할지” 를 모른다 — 그래서 재사용 가능. <code>EventHandler</code> 의 두 매개변수 sender(누가) · e(어떤 정보) 를 강조.</p><p>맨 아래 WPF 연결: 17장에서 <code>Click="btnSave_Click"</code> 을 쓸 때 이 그림을 다시 떠올리게.</p>' },
          { layout: 'code', title: '예제 11-5. 버튼 클릭 이벤트 흉내 내기', code: `using System;

class MyButton
{
    public string Text { get; }
    public event EventHandler Click;            // 구독자 명단
    public MyButton(string text) { Text = text; }
    public void Press()
    {
        Console.WriteLine($"[{Text}] 눌림");
        Click?.Invoke(this, EventArgs.Empty);   // 알림
    }
}

class Program
{
    static void OnSave(object sender, EventArgs e)
    {
        MyButton b = (MyButton)sender;
        Console.WriteLine($"  → {b.Text}: 파일 저장");
    }
    static void Main()
    {
        MyButton save = new MyButton("저장");
        save.Click += OnSave;                                    // 구독
        save.Click += (s, e) => Console.WriteLine("  → 로그 기록");
        save.Press();
    }
}`, points: ['<code>event EventHandler 이름;</code>', '발생: <code>?.Invoke(this, EventArgs.Empty)</code>', '구독: <code>+=</code> 메서드 또는 람다', '<code>event</code> 덕분에 바깥에서는 += / -= 만'],
            notes: '<p><b>[6분]</b> 구독을 하나도 하지 않고 Press() 해도 오류가 없음을 확인. <code>event</code> 를 지우고 <code>save.Click = null;</code> 이 되는 것을 보여 주며 event 키워드의 역할 설명.</p>' },
          { layout: 'code', title: '예제 11-6. EventArgs 로 데이터 전달', code: `using System;
class PriceArgs : EventArgs
{
    public int Old { get; }  public int New { get; }
    public PriceArgs(int o, int n) { Old = o; New = n; }
}

class Product
{
    private int price = 1000;
    public event EventHandler<PriceArgs> PriceChanged;
    public int Price
    {
        get { return price; }
        set { int old = price; price = value; PriceChanged?.Invoke(this, new PriceArgs(old, value)); }
    }
}

class Program
{
    static void Main()
    {
        Product p = new Product();
        p.PriceChanged += (s, e) => Console.WriteLine($"가격 변경: {e.Old} → {e.New}");
        p.Price = 900;
        p.Price = 1200;
    }
}`, points: ['<code>EventArgs</code> 를 상속해 데이터 담기', '<code>EventHandler&lt;PriceArgs&gt;</code>', '속성 <code>set</code> 에서 바뀔 때 발생', 'WPF 바인딩의 <code>PropertyChanged</code> 가 이 모양'],
            notes: '<p><b>[5분]</b> “속성이 바뀌면 화면이 자동으로 바뀌는” WPF 데이터 바인딩(18장)이 바로 이 패턴이라고 예고. 본문 예제 11-6 에는 같은 값이면 알리지 않는 <code>if</code> 가 있음을 언급.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>Action&lt;int&gt; a = x =&gt; Console.Write(x);\na += x =&gt; Console.Write(x * 2);\na(3);</code></pre>', options: ['3', '6', '36', '33'], answer: 2, explain: '멀티캐스트: 등록 순서대로 3, 6 출력 → 36.',
            notes: '<p>정답 공개 후 “<code>a -= …</code> 로 첫 번째를 떼면?” 등으로 확장. 람다는 같은 코드라도 다른 객체이므로 <code>-=</code> 로 떼려면 변수에 담아 두어야 한다는 점도 언급.</p>' },
          { layout: 'practice', title: '실습 11-2. 온도 센서 이벤트', desc: '<p><code>Sensor</code> 에 <code>TemperatureChanged</code> 이벤트를 만들고, <code>Measure</code> 에서 발생시키세요. <code>Main</code> 에서 구독해 <b>30도 이상이면 경고</b>를 출력합니다.</p>', starter: `using System;

class TemperatureEventArgs : EventArgs
{
    public double Temperature { get; }
    public TemperatureEventArgs(double t) { Temperature = t; }
}

class Sensor
{
    // TODO: 이벤트 선언
    public void Measure(double t)
    {
        Console.WriteLine($"측정: {t:F1}도");
        // TODO: 이벤트 발생
    }
}

class Program
{
    static void Main()
    {
        Sensor sensor = new Sensor();
        // TODO: 구독 — 30도 이상이면 경고
        double[] readings = { 24.5, 28.0, 31.2, 29.9, 35.0 };
        foreach (double t in readings) sensor.Measure(t);
    }
}`, solution: `using System;

class TemperatureEventArgs : EventArgs
{
    public double Temperature { get; }
    public TemperatureEventArgs(double t) { Temperature = t; }
}

class Sensor
{
    public event EventHandler<TemperatureEventArgs> TemperatureChanged;
    public void Measure(double t)
    {
        Console.WriteLine($"측정: {t:F1}도");
        TemperatureChanged?.Invoke(this, new TemperatureEventArgs(t));
    }
}

class Program
{
    static void Main()
    {
        Sensor sensor = new Sensor();
        sensor.TemperatureChanged += (s, e) =>
        {
            if (e.Temperature >= 30)
                Console.WriteLine($"  경고! {e.Temperature:F1}도 — 임계값 초과");
        };
        double[] readings = { 24.5, 28.0, 31.2, 29.9, 35.0 };
        foreach (double t in readings) sensor.Measure(t);
    }
}`,
            notes: '<p><b>[8분]</b> 3단계로 안내: ① 이벤트 선언 ② <code>?.Invoke</code> ③ 람다로 구독. 빨리 끝난 학생은 “정상 범위로 돌아옴” 구독자를 하나 더 추가하게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['델리게이트 = 메서드를 담는 변수. 선언 → 대입(이름만) → 호출', '<code>+=</code> 멀티캐스트, 모두 떼면 null → <code>?.Invoke</code>', '<code>Action</code> · <code>Func</code>(마지막이 반환형) · <code>Predicate</code>', '람다 <code>(a, b) =&gt; a + b</code> — 정렬 기준 · 조건 · 콜백', '이벤트: <code>event EventHandler</code> 선언 · <code>?.Invoke</code> 발생 · <code>+=</code> 구독 · <code>EventArgs</code> 상속으로 데이터'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 람다를 컬렉션 전체에 적용하는 LINQ.</p>' }
        ]
      },

      /* ===================== ch11-2 ===================== */
      {
        id: 'ch11-2',
        title: 'LINQ — 컬렉션에 질문하기',
        minutes: 50,
        goals: [
          'LINQ 가 필요한 이유와 메서드 체인의 원리를 설명할 수 있다',
          'Where · Select · OrderBy · Take · First · Any · Count · Sum · Average 등을 조합해 컬렉션을 질의할 수 있다',
          '지연 실행의 의미를 설명하고 ToList 로 즉시 실행할 수 있다',
          'GroupBy 와 익명 형식으로 그룹별 통계를 낼 수 있다',
          '쿼리 구문과 확장 메서드의 개념을 설명할 수 있다'
        ],
        flow: [['복습 · 도입: 반복문의 한계', 5], ['Where · Select · OrderBy · 집계', 15], ['지연 실행 · 쿼리 구문', 8], ['객체 목록 · GroupBy · 익명 형식', 12], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: 'LINQ — 컬렉션에 질문하기' },
          { type: 'p', html: '“80점 이상인 학생만”, “가격 순으로 정렬해서 상위 3개”, “반별 평균” — 데이터를 다루는 프로그램은 이런 <b>질문(query)</b> 을 끊임없이 합니다. 지금까지는 <code>foreach</code> + <code>if</code> + 임시 리스트로 풀었지만, 질문이 조금만 복잡해져도 코드가 길어집니다. <b>LINQ(링크, Language Integrated Query)</b> 는 이런 질문을 <b>한 줄의 메서드 체인</b>으로 쓰게 해 주는 기능입니다. 파일 맨 위에 <code>using System.Linq;</code> 를 추가하면 모든 배열 · 리스트에 새 메서드들이 생깁니다.' },
          { type: 'code', title: '예제 11-7. 반복문 vs LINQ — 같은 일을 두 가지로', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] nums = { 5, 12, 8, 3, 20, 15, 7 };

        // (1) 반복문: 10 이상인 수를 골라 오름차순 정렬
        List<int> result = new List<int>();
        foreach (int n in nums)
            if (n >= 10) result.Add(n);
        result.Sort();
        Console.WriteLine(string.Join(", ", result));

        // (2) LINQ: 같은 일을 한 줄로
        var big = nums.Where(n => n >= 10).OrderBy(n => n);
        Console.WriteLine(string.Join(", ", big));

        var squares = nums.Select(n => n * n);                 // 각 요소를 변환
        Console.WriteLine(string.Join(", ", squares));

        var top3 = nums.OrderByDescending(n => n).Take(3);     // 큰 순서로 3개
        Console.WriteLine(string.Join(", ", top3));

        var evenDoubled = nums.Where(n => n % 2 == 0).Select(n => n * 2).ToList();
        Console.WriteLine($"짝수 × 2: {string.Join(", ", evenDoubled)}  (개수 {evenDoubled.Count})");
    }
}`, expect: `12, 15, 20
12, 15, 20
25, 144, 64, 9, 400, 225, 49
20, 15, 12
짝수 × 2: 24, 16, 40  (개수 3)`, desc: '<code>Where</code> 는 <b>걸러내기</b>(조건에 맞는 것만), <code>Select</code> 는 <b>변환</b>(각 요소로 새 값을 만들기), <code>OrderBy</code> 는 <b>정렬</b>입니다. 괄호 안은 모두 지난 교시의 <b>람다</b>입니다. 결과는 <code>var</code> 로 받는 것이 편합니다(형식 이름이 길고 복잡하기 때문).' },
          { type: 'figure', html: SVG_LINQ, caption: 'LINQ 메서드 체인 = 컨베이어 벨트. 각 단계가 IEnumerable<T> 를 돌려주므로 계속 이어 붙인다' },
          { type: 'h', text: '자주 쓰는 LINQ 메서드' },
          { type: 'table', head: ['분류', '메서드', '뜻', '결과'], rows: [
            ['걸러내기', '<code>Where(n =&gt; 조건)</code>', '조건이 참인 요소만', '시퀀스'],
            ['변환', '<code>Select(n =&gt; 식)</code>', '각 요소를 식의 결과로 바꿈', '시퀀스'],
            ['정렬', '<code>OrderBy(n =&gt; 키)</code> / <code>OrderByDescending</code> / <code>ThenBy</code>', '키 기준 오름차순 / 내림차순 / 2차 기준', '시퀀스'],
            ['자르기', '<code>Take(n)</code> / <code>Skip(n)</code>', '앞에서 n개 / 앞의 n개 건너뛰기', '시퀀스'],
            ['중복', '<code>Distinct()</code>', '중복 제거', '시퀀스'],
            ['하나 꺼내기', '<code>First()</code> / <code>FirstOrDefault()</code> / <code>Last()</code>', '첫 요소(없으면 예외 / 기본값) / 마지막', '요소 하나'],
            ['검사', '<code>Any(조건)</code> / <code>All(조건)</code> / <code>Contains(값)</code>', '하나라도 / 모두 / 포함', '<code>bool</code>'],
            ['집계', '<code>Count()</code> / <code>Sum()</code> / <code>Average()</code> / <code>Max()</code> / <code>Min()</code>', '개수 / 합 / 평균 / 최대 / 최소', '숫자'],
            ['담기', '<code>ToList()</code> / <code>ToArray()</code>', '결과를 List / 배열로 <b>즉시 실행</b>', '컬렉션'],
            ['묶기', '<code>GroupBy(n =&gt; 키)</code>', '키가 같은 것끼리 그룹', '그룹 시퀀스']
          ], caption: '"시퀀스" = IEnumerable<T>. 시퀀스를 돌려주는 메서드는 계속 이어 붙일 수 있다' },
          { type: 'code', title: '예제 11-8. 집계 · 검사 · 하나 꺼내기', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] scores = { 88, 92, 75, 92, 60, 100, 75 };

        Console.WriteLine($"개수: {scores.Count()}, 80 이상: {scores.Count(s => s >= 80)}");
        Console.WriteLine($"합계: {scores.Sum()}, 평균: {scores.Average():F1}");
        Console.WriteLine($"최고: {scores.Max()}, 최저: {scores.Min()}");
        Console.WriteLine($"모두 60 이상? {scores.All(s => s >= 60)}");
        Console.WriteLine($"100점 있나? {scores.Any(s => s == 100)}");
        Console.WriteLine($"첫 번째 90 이상: {scores.First(s => s >= 90)}");
        Console.WriteLine($"첫 번째 100 초과: {scores.FirstOrDefault(s => s > 100)}");   // 없으면 0
        Console.WriteLine($"중복 제거: {string.Join(", ", scores.Distinct())}");
        Console.WriteLine($"2개 건너뛰고 3개: {string.Join(", ", scores.Skip(2).Take(3))}");

        List<int> sorted = scores.OrderBy(s => s).ToList();      // List 로 담기
        int[] low = scores.Where(s => s < 80).ToArray();          // 배열로 담기
        Console.WriteLine($"정렬: {string.Join(", ", sorted)} / 80 미만 {low.Length}개");
    }
}`, expect: `개수: 7, 80 이상: 4
합계: 582, 평균: 83.1
최고: 100, 최저: 60
모두 60 이상? True
100점 있나? True
첫 번째 90 이상: 92
첫 번째 100 초과: 0
중복 제거: 88, 92, 75, 60, 100
2개 건너뛰고 3개: 75, 92, 60
정렬: 60, 75, 75, 88, 92, 92, 100 / 80 미만 3개`, desc: '<code>Count</code> · <code>Any</code> · <code>First</code> 는 괄호 안에 조건 람다를 넣을 수 있습니다. <code>First</code> 는 맞는 것이 <b>없으면 예외</b>(InvalidOperationException)를 던지므로, 없을 수도 있으면 <code>FirstOrDefault</code>(int 는 0, 참조 형식은 null)를 쓰세요. <code>Average()</code> 는 <code>double</code> 을 돌려주므로 <code>:F1</code> 로 자릿수를 정리했습니다.' },
          { type: 'h', text: '지연 실행(deferred execution) — LINQ 는 “계획” 이다' },
          { type: 'p', html: '<code>var evens = nums.Where(…)</code> 라고 써도 그 순간에는 <b>아무것도 걸러지지 않습니다</b>. LINQ 는 “이렇게 걸러라” 는 <b>계획(질의)</b> 만 만들어 두고, <code>foreach</code> 로 꺼내거나 <code>ToList()</code> · <code>Count()</code> 처럼 <b>결과가 필요한 순간에 비로소 실행</b>됩니다. 그래서 같은 질의를 두 번 쓰면 두 번 실행되고, 그 사이 원본이 바뀌면 결과도 바뀝니다.' },
          { type: 'code', title: '예제 11-9. 지연 실행 확인하기', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        List<int> nums = new List<int> { 1, 2, 3 };
        var evens = nums.Where(n =>
        {
            Console.WriteLine($"  검사: {n}");     // 언제 실행되는지 보기 위한 출력
            return n % 2 == 0;
        });
        Console.WriteLine("질의를 만들었다 (아직 아무것도 실행 안 됨)");

        nums.Add(4);                                // 실행 전에 원본에 추가
        Console.WriteLine("foreach 시작");
        foreach (int n in evens)                    // 이제 실행된다
            Console.WriteLine($"짝수: {n}");

        Console.WriteLine("ToList 로 즉시 실행(스냅샷)");
        List<int> snapshot = evens.ToList();
        nums.Add(6);
        Console.WriteLine($"snapshot 개수: {snapshot.Count}");
        Console.WriteLine("evens 를 다시 세면 → 질의가 다시 실행된다");
        int count = evens.Count();
        Console.WriteLine($"evens 개수: {count}");
    }
}`, expect: `질의를 만들었다 (아직 아무것도 실행 안 됨)
foreach 시작
  검사: 1
  검사: 2
짝수: 2
  검사: 3
  검사: 4
짝수: 4
ToList 로 즉시 실행(스냅샷)
  검사: 1
  검사: 2
  검사: 3
  검사: 4
snapshot 개수: 2
evens 를 다시 세면 → 질의가 다시 실행된다
  검사: 1
  검사: 2
  검사: 3
  검사: 4
  검사: 6
evens 개수: 3`, desc: '“검사” 가 <code>Where</code> 를 쓴 줄이 아니라 <b><code>foreach</code> 에서</b> 처음 출력됩니다. 나중에 추가한 4 도 결과에 포함됩니다. <code>ToList()</code> 는 그 시점의 결과를 <b>복사해 두므로</b>(스냅샷) 이후 원본이 바뀌어도 <code>snapshot</code> 은 그대로입니다.' },
          { type: 'callout', kind: 'tip', title: '언제 ToList 를 붙일까', html: '결과를 <b>여러 번 쓰거나</b>, 원본이 바뀌기 전에 <b>고정</b>해 두고 싶거나, <code>Count</code> 속성 · 인덱스 <code>[i]</code> 가 필요하면 <code>ToList()</code> 로 담으세요. 한 번만 <code>foreach</code> 할 거라면 붙이지 않아도 됩니다. WPF 에서 <code>listBox.ItemsSource = list.Where(…).ToList();</code> 처럼 화면에 보여 줄 때는 보통 붙입니다.' },
          { type: 'h', text: '객체 목록에 LINQ — 학생 성적' },
          { type: 'p', html: 'LINQ 의 진짜 힘은 <b>객체 목록</b>에서 나옵니다. 람다 안에서 <code>s.Score</code>, <code>s.Name</code> 처럼 속성을 쓰면 “어떤 속성으로 거를지 · 정렬할지 · 뽑을지” 를 자유롭게 정할 수 있습니다.' },
          { type: 'code', title: '예제 11-10. 학생 목록 질의 — 거르기 · 정렬 · 뽑기 · 익명 형식 · 쿼리 구문', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name { get; set; }
    public string Class { get; set; }
    public int Score { get; set; }
    public Student(string name, string cls, int score) { Name = name; Class = cls; Score = score; }
}

class Program
{
    static void Main()
    {
        List<Student> students = new List<Student>
        {
            new Student("철수", "A", 85), new Student("영희", "B", 92),
            new Student("민수", "A", 78), new Student("지영", "B", 92),
            new Student("현우", "C", 64), new Student("수진", "A", 90)
        };

        // 80점 이상 → 점수 내림차순 → 같은 점수는 이름순
        var honor = students.Where(s => s.Score >= 80)
                            .OrderByDescending(s => s.Score)
                            .ThenBy(s => s.Name);
        foreach (Student s in honor)
            Console.WriteLine($"{s.Name}({s.Class}반) {s.Score}점");

        // 이름만 뽑기 (Student → string)
        var aNames = students.Where(s => s.Class == "A").Select(s => s.Name);
        Console.WriteLine("A반: " + string.Join(", ", aNames));

        // 익명 형식: 필요한 것만 담은 "이름 없는 클래스"
        var summary = students.Select(s => new { s.Name, Grade = s.Score >= 90 ? "우수" : "보통" });
        foreach (var item in summary)
            Console.WriteLine($"{item.Name}: {item.Grade}");
        Console.WriteLine(summary.First());

        // 쿼리 구문: SQL 처럼 읽히는 또 다른 표기
        var lowNames = from s in students
                       where s.Score < 80
                       orderby s.Score
                       select s.Name;
        Console.WriteLine("80점 미만: " + string.Join(", ", lowNames));

        Console.WriteLine($"최고 점수: {students.OrderByDescending(s => s.Score).First().Name}");
        Console.WriteLine($"전체 평균: {students.Average(s => s.Score):F1}");
    }
}`, expect: `영희(B반) 92점
지영(B반) 92점
수진(A반) 90점
철수(A반) 85점
A반: 철수, 민수, 수진
철수: 보통
영희: 우수
민수: 보통
지영: 우수
현우: 보통
수진: 우수
{ Name = 철수, Grade = 보통 }
80점 미만: 현우, 민수
최고 점수: 영희
전체 평균: 83.5`, desc: '<code>OrderByDescending(…).ThenBy(…)</code> 는 1차 · 2차 정렬 기준입니다. <code>Select</code> 로 <b>이름만</b> 뽑으면 <code>Student</code> 시퀀스가 <code>string</code> 시퀀스로 바뀝니다. <code>Average(s =&gt; s.Score)</code> 처럼 집계 메서드에도 “무엇을 더할지” 람다를 넣습니다.' },
          { type: 'h', text: '익명 형식과 var' },
          { type: 'p', html: '<code>new { s.Name, Grade = … }</code> 는 <b>익명 형식(anonymous type)</b> — 클래스를 따로 만들지 않고 “필요한 속성만 담은 임시 객체” 를 만드는 문법입니다. 이름이 없는 형식이므로 변수는 반드시 <b><code>var</code></b> 로 받아야 합니다(2장의 <code>var</code> 가 꼭 필요한 순간입니다). 속성 이름을 생략하면(<code>s.Name</code>) 원래 이름이 그대로 쓰입니다. <code>Console.WriteLine</code> 에 넘기면 <code>{ Name = 철수, Grade = 보통 }</code> 처럼 내용을 보여 줍니다.' },
          { type: 'callout', kind: 'info', title: '메서드 구문 vs 쿼리 구문', html: '<table><tr><th>메서드 구문 (method syntax)</th><th>쿼리 구문 (query syntax)</th></tr><tr><td><code>students.Where(s =&gt; s.Score &lt; 80).OrderBy(s =&gt; s.Score).Select(s =&gt; s.Name)</code></td><td><code>from s in students where s.Score &lt; 80 orderby s.Score select s.Name</code></td></tr></table><p>둘은 <b>완전히 같은 일</b>을 하며 컴파일러가 쿼리 구문을 메서드 구문으로 바꿉니다. 쿼리 구문은 SQL 을 아는 사람에게 익숙하지만 <code>Count</code> · <code>Take</code> · <code>First</code> 같은 메서드가 없어 결국 메서드 구문을 섞게 됩니다. <b>이 강좌는 메서드 구문을 기본</b>으로 씁니다. 읽을 줄만 알면 됩니다.</p>' },
          { type: 'h', text: 'GroupBy — 반별로 묶어 통계 내기' },
          { type: 'p', html: '<code>GroupBy(s =&gt; s.Class)</code> 는 키(반)가 같은 학생끼리 <b>그룹</b>으로 묶습니다. 각 그룹은 <code>Key</code>(반 이름)를 가진 <b>작은 시퀀스</b>라서, 그룹 안에서 다시 <code>Count()</code> · <code>Average()</code> 같은 LINQ 를 쓸 수 있습니다.' },
          { type: 'code', title: '예제 11-11. GroupBy 로 반별 인원과 평균', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name { get; set; }
    public string Class { get; set; }
    public int Score { get; set; }
    public Student(string name, string cls, int score) { Name = name; Class = cls; Score = score; }
}

class Program
{
    static void Main()
    {
        List<Student> students = new List<Student>
        {
            new Student("철수", "A", 85), new Student("영희", "B", 92),
            new Student("민수", "A", 78), new Student("지영", "B", 92),
            new Student("현우", "C", 64), new Student("수진", "A", 90)
        };

        // 그룹의 내용 직접 보기: g.Key 는 반 이름, g 자체는 그 반 학생들의 시퀀스
        foreach (var g in students.GroupBy(s => s.Class).OrderBy(g => g.Key))
            Console.WriteLine($"[{g.Key}반] " + string.Join(", ", g.Select(s => s.Name)));

        // 그룹마다 통계를 익명 형식으로 만들기
        var stats = students.GroupBy(s => s.Class)
                            .Select(g => new { Class = g.Key, Count = g.Count(), Avg = g.Average(s => s.Score) })
                            .OrderBy(x => x.Class);
        foreach (var x in stats)
            Console.WriteLine($"{x.Class}반: {x.Count}명, 평균 {x.Avg:F1}");

        var best = stats.OrderByDescending(x => x.Avg).First();
        Console.WriteLine($"평균이 가장 높은 반: {best.Class} ({best.Avg:F1})");
    }
}`, expect: `[A반] 철수, 민수, 수진
[B반] 영희, 지영
[C반] 현우
A반: 3명, 평균 84.3
B반: 2명, 평균 92.0
C반: 1명, 평균 64.0
평균이 가장 높은 반: B (92.0)`, desc: '<code>GroupBy</code> → <code>Select</code>(그룹마다 통계 객체) → <code>OrderBy</code> 는 “그룹별 집계” 의 정석 패턴입니다. 쿼리 구문으로는 <code>from s in students group s by s.Class into g select new { … }</code> 라고 씁니다.' },
          { type: 'h', text: '문자열에도 LINQ — 그리고 확장 메서드' },
          { type: 'p', html: '<code>string</code> 은 <code>char</code> 의 시퀀스(<code>IEnumerable&lt;char&gt;</code>)이므로 LINQ 를 그대로 쓸 수 있습니다. 그런데 이상하지 않나요? <code>string</code> 클래스에는 원래 <code>Count</code> · <code>Where</code> 메서드가 없는데, <code>using System.Linq;</code> 한 줄로 갑자기 생겼습니다. 이것이 <b>확장 메서드(extension method)</b> 의 마법입니다. <b>정적 클래스</b>의 <b>정적 메서드</b>인데, 첫 매개변수에 <code>this</code> 를 붙이면 <b>그 형식의 인스턴스 메서드처럼</b> 점(.)으로 호출할 수 있습니다. LINQ 메서드는 모두 <code>IEnumerable&lt;T&gt;</code> 의 확장 메서드입니다.' },
          { type: 'code', title: '예제 11-12. 문자열 LINQ 와 나만의 확장 메서드', code: `using System;
using System.Collections.Generic;
using System.Linq;

// 확장 메서드: static 클래스 + static 메서드 + 첫 매개변수에 this
static class MyExtensions
{
    public static bool IsEven(this int n) { return n % 2 == 0; }

    public static string Repeat(this string s, int times)
    {
        return string.Concat(Enumerable.Repeat(s, times));
    }

    public static string Bracket(this string s) { return "[" + s + "]"; }
}

class Program
{
    static void Main()
    {
        string word = "hello world";
        Console.WriteLine(word.Count(c => c == 'l'));                   // 'l' 의 개수
        Console.WriteLine(word.Where(c => c != ' ').Count());           // 공백 뺀 글자 수
        Console.WriteLine(string.Concat(word.Reverse()));               // 뒤집기
        Console.WriteLine(string.Concat(word.Distinct()));              // 중복 글자 제거
        Console.WriteLine(word.Any(c => char.IsDigit(c)));              // 숫자가 있나?
        Console.WriteLine(string.Join(",", "3,1,2".Split(',').Select(s => int.Parse(s)).OrderBy(n => n)));

        // 마치 int · string 에 원래 있던 메서드처럼 호출된다
        Console.WriteLine(10.IsEven());
        Console.WriteLine(7.IsEven());
        Console.WriteLine("=-".Repeat(5));
        Console.WriteLine("확장".Bracket().Bracket());
    }
}`, expect: `3
10
dlrow olleh
helo wrd
False
1,2,3
True
False
=-=-=-=-=-
[[확장]]`, desc: '<code>10.IsEven()</code> 은 사실 <code>MyExtensions.IsEven(10)</code> 을 컴파일러가 대신 불러 주는 것입니다. 남이 만든 클래스(<code>int</code>, <code>string</code>)를 고치지 않고도 메서드를 “붙인 것처럼” 쓸 수 있어, 자주 쓰는 도우미 메서드를 만들 때 유용합니다.' },
          { type: 'callout', kind: 'info', title: 'WPF 에서 LINQ 는 어디에 쓰이나', html: '<ul><li><b>목록 컨트롤에 결과 보여 주기</b>: <code>listView.ItemsSource = products.Where(p =&gt; p.Price &gt;= 10000).OrderBy(p =&gt; p.Name).ToList();</code> — 검색 상자에 글자를 입력할 때마다 걸러서 다시 보여 주는 패턴이 이것입니다.</li><li><b>통계 표시</b>: <code>txtTotal.Text = cart.Sum(i =&gt; i.Price).ToString("N0");</code></li><li><b>선택 항목 처리</b>: <code>listBox.SelectedItems.Cast&lt;Student&gt;().Select(s =&gt; s.Name)</code></li></ul>18장 데이터 바인딩과 응용 프로젝트에서 계속 만나게 됩니다.' }
        ],
        practice: [
          {
            title: '실습 11-3. 상품 목록 — 만원 이상만 가격 내림차순',
            level: 1,
            desc: '<p>상품 목록에서 <b>가격이 10,000원 이상</b>인 상품을 <b>가격 내림차순</b>으로 “이름 가격원” 형식으로 출력하고, 마지막 줄에 그 상품들의 <b>개수와 가격 합계</b>를 출력하세요. 가격은 천 단위 쉼표(<code>N0</code>)를 붙입니다.</p><pre>노트북 1,200,000원\n가방 45,000원\n마우스 25,000원\n책 15,000원\n만원 이상 상품 수: 4, 합계: 1,285,000원</pre>',
            hint: '<code>products.Where(p =&gt; p.Price &gt;= 10000).OrderByDescending(p =&gt; p.Price)</code> 를 변수에 담고 <code>foreach</code>. 합계는 <code>Sum(p =&gt; p.Price)</code>.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public Product(string name, int price) { Name = name; Price = price; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product("연필", 500), new Product("노트북", 1200000), new Product("가방", 45000),
            new Product("지우개", 300), new Product("마우스", 25000), new Product("책", 15000)
        };

        // TODO: 만원 이상 상품을 가격 내림차순으로 골라 변수에 담기

        // TODO: "이름 가격원" 출력

        // TODO: "만원 이상 상품 수: n, 합계: 금액원" 출력
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public Product(string name, int price) { Name = name; Price = price; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product("연필", 500), new Product("노트북", 1200000), new Product("가방", 45000),
            new Product("지우개", 300), new Product("마우스", 25000), new Product("책", 15000)
        };

        var expensive = products.Where(p => p.Price >= 10000)
                                .OrderByDescending(p => p.Price)
                                .ToList();

        foreach (Product p in expensive)
            Console.WriteLine($"{p.Name} {p.Price:N0}원");

        Console.WriteLine($"만원 이상 상품 수: {expensive.Count}, 합계: {expensive.Sum(p => p.Price):N0}원");
    }
}
`,
            expect: `노트북 1,200,000원
가방 45,000원
마우스 25,000원
책 15,000원
만원 이상 상품 수: 4, 합계: 1,285,000원`
          },
          {
            title: '실습 11-4. 단어 목록 — 글자 수별로 묶기',
            level: 2,
            desc: '<p>단어 목록을 <b>글자 수(<code>Length</code>)별로 그룹</b>으로 묶어, 글자 수 오름차순으로 “n글자(개수): 단어들” 을 출력하세요. 각 그룹 안의 단어는 <b>알파벳순</b>으로 정렬합니다.</p><pre>3글자(1개): fig\n4글자(3개): kiwi, pear, plum\n5글자(2개): apple, grape\n6글자(2개): banana, cherry</pre>',
            hint: '<code>words.GroupBy(w =&gt; w.Length).OrderBy(g =&gt; g.Key)</code> 그리고 그룹 안에서 <code>g.OrderBy(w =&gt; w)</code>, <code>g.Count()</code>.',
            starter: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] words = { "apple", "kiwi", "banana", "fig", "grape", "plum", "cherry", "pear" };

        // TODO: 글자 수별 그룹 → 글자 수 오름차순 → "n글자(개수): 단어들(알파벳순)" 출력
    }
}
`,
            solution: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] words = { "apple", "kiwi", "banana", "fig", "grape", "plum", "cherry", "pear" };

        var groups = words.GroupBy(w => w.Length).OrderBy(g => g.Key);
        foreach (var g in groups)
        {
            string list = string.Join(", ", g.OrderBy(w => w));
            Console.WriteLine($"{g.Key}글자({g.Count()}개): {list}");
        }
    }
}
`,
            expect: `3글자(1개): fig
4글자(3개): kiwi, pear, plum
5글자(2개): apple, grape
6글자(2개): banana, cherry`
          }
        ],
        quiz: [
          { q: '다음 코드의 출력은?<pre><code>int[] nums = { 1, 2, 3, 4, 5 };\nvar r = nums.Where(n =&gt; n &gt; 3).Select(n =&gt; n * 2);\nConsole.WriteLine(string.Join(",", r));</code></pre>', options: ['2,4,6,8,10', '4,5', '8,10', '6,8,10'], answer: 2, explain: '<code>Where</code> 로 4, 5 만 남기고 <code>Select</code> 로 2배 → 8, 10.' },
          { q: '<code>var q = list.Where(x =&gt; x &gt; 0);</code> 에서 실제로 걸러내는 작업이 <b>실행되는 시점</b>은?', options: ['이 줄이 실행될 때 즉시', '<code>foreach</code> · <code>ToList()</code> · <code>Count()</code> 등으로 결과를 꺼낼 때', '프로그램이 끝날 때', '<code>using System.Linq;</code> 를 쓴 순간'], answer: 1, explain: 'LINQ 는 지연 실행됩니다. 질의는 계획일 뿐이고 결과가 필요할 때 실행됩니다.' },
          { q: '조건에 맞는 요소가 <b>없을 수도 있을 때</b>, 예외 없이 기본값을 돌려받으려면?', options: ['<code>First()</code>', '<code>Single()</code>', '<code>FirstOrDefault()</code>', '<code>Take(1)</code>'], answer: 2, explain: '<code>First</code> 는 없으면 예외, <code>FirstOrDefault</code> 는 기본값(0 · null)을 돌려줍니다.' },
          { q: '<code>students.GroupBy(s =&gt; s.Class)</code> 의 각 그룹에서 <b>반 이름</b>을 얻는 속성은?', options: ['<code>g.Class</code>', '<code>g.Key</code>', '<code>g.Name</code>', '<code>g.First()</code>'], answer: 1, explain: '그룹은 <code>Key</code>(묶은 기준값)와 그 그룹의 요소들로 이루어집니다.' },
          { q: '확장 메서드를 만들 때 반드시 필요한 것은?', options: ['<code>static</code> 클래스의 <code>static</code> 메서드, 첫 매개변수에 <code>this</code>', '원래 클래스를 상속한 새 클래스', '<code>override</code> 키워드', '<code>event</code> 키워드'], answer: 0, explain: '<code>public static bool IsEven(this int n)</code> 처럼 정적 클래스 안의 정적 메서드에 <code>this</code> 를 붙입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'LINQ — 컬렉션에 질문하기', subtitle: 'Chapter 11 · Section 02', badge: '11-2',
            notes: '<p><b>[도입 3분]</b> 복습: 람다 <code>(a, b) =&gt; a + b</code> 를 읽어 보게. “80점 이상 학생을 점수순으로 상위 3명 뽑으려면 반복문으로 몇 줄?” → 오늘은 한 줄로.</p><p>LINQ = Language Integrated Query. <code>using System.Linq;</code> 를 꼭 쓰게 하세요.</p>' },
          { layout: 'diagram', title: 'LINQ 메서드 체인 = 컨베이어 벨트', html: SVG_LINQ, caption: 'Where(거르기) → OrderBy(정렬) → Select(변환) → ToList(담기). 각 단계가 시퀀스를 돌려준다',
            notes: '<p><b>[5분]</b> 벨트 위 숫자들이 단계마다 어떻게 변하는지 손으로 짚기. 발문: “Select 를 Where 앞에 두면 결과가 같을까?” → n*2 뒤에 &gt;= 10 을 검사하므로 달라진다. 순서가 중요.</p>' },
          { layout: 'code', title: '예제 11-7. 반복문 vs LINQ', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] nums = { 5, 12, 8, 3, 20, 15, 7 };

        List<int> result = new List<int>();        // 반복문
        foreach (int n in nums)
            if (n >= 10) result.Add(n);
        result.Sort();
        Console.WriteLine(string.Join(", ", result));

        var big = nums.Where(n => n >= 10).OrderBy(n => n);   // LINQ
        Console.WriteLine(string.Join(", ", big));

        Console.WriteLine(string.Join(", ", nums.Select(n => n * n)));
        Console.WriteLine(string.Join(", ", nums.OrderByDescending(n => n).Take(3)));
    }
}`, points: ['<code>Where</code> 걸러내기 · <code>Select</code> 변환 · <code>OrderBy</code> 정렬', '괄호 안은 모두 <b>람다</b>', '결과는 <code>var</code> 로 받는다', '<code>string.Join</code> 으로 한 줄 출력'],
            notes: '<p><b>[6분]</b> 두 방식이 같은 결과임을 실행으로 확인. 학생에게 “홀수만 골라 제곱” 을 LINQ 한 줄로 써 보게 합니다.</p>' },
          { layout: 'table', title: '자주 쓰는 LINQ 메서드', head: ['분류', '메서드', '결과'], rows: [['걸러내기 · 변환', '<code>Where</code> · <code>Select</code>', '시퀀스'], ['정렬', '<code>OrderBy</code> · <code>OrderByDescending</code> · <code>ThenBy</code>', '시퀀스'], ['자르기 · 중복', '<code>Take</code> · <code>Skip</code> · <code>Distinct</code>', '시퀀스'], ['하나 꺼내기', '<code>First</code> · <code>FirstOrDefault</code> · <code>Last</code>', '요소'], ['검사', '<code>Any</code> · <code>All</code> · <code>Contains</code>', 'bool'], ['집계', '<code>Count</code> · <code>Sum</code> · <code>Average</code> · <code>Max</code> · <code>Min</code>', '숫자'], ['담기 · 묶기', '<code>ToList</code> · <code>ToArray</code> · <code>GroupBy</code>', '컬렉션 · 그룹']],
            lead: '시퀀스를 돌려주는 메서드는 계속 이어 붙일 수 있다',
            notes: '<p><b>[4분]</b> 전부 외울 필요 없음. “거르기 · 변환 · 정렬 · 집계” 네 묶음으로 기억. 나머지는 인텔리센스에서 찾으면 된다.</p>' },
          { layout: 'code', title: '예제 11-8. 집계 · 검사 · 하나 꺼내기', code: `using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] scores = { 88, 92, 75, 92, 60, 100, 75 };

        Console.WriteLine($"개수 {scores.Count()}, 80 이상 {scores.Count(s => s >= 80)}");
        Console.WriteLine($"합 {scores.Sum()}, 평균 {scores.Average():F1}");
        Console.WriteLine($"최고 {scores.Max()}, 최저 {scores.Min()}");
        Console.WriteLine(scores.All(s => s >= 60));
        Console.WriteLine(scores.Any(s => s == 100));
        Console.WriteLine(scores.First(s => s >= 90));
        Console.WriteLine(scores.FirstOrDefault(s => s > 100));   // 없으면 0
        Console.WriteLine(string.Join(", ", scores.Distinct()));
        Console.WriteLine(string.Join(", ", scores.Skip(2).Take(3)));
    }
}`, points: ['<code>Count</code> · <code>Any</code> · <code>First</code> 에는 조건 람다 가능', '<code>First</code> 는 없으면 <b>예외</b> → <code>FirstOrDefault</code>', '<code>Average</code> 는 double → <code>:F1</code>', '<code>Skip</code> · <code>Take</code> 로 페이지 나누기'],
            notes: '<p><b>[5분]</b> <code>First(s =&gt; s &gt; 100)</code> 로 바꿔 실행해 InvalidOperationException 을 보여 주고 FirstOrDefault 와 비교.</p>' },
          { layout: 'code', title: '예제 11-9. 지연 실행 — LINQ 는 “계획” 이다', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        List<int> nums = new List<int> { 1, 2, 3 };
        var evens = nums.Where(n =>
        {
            Console.WriteLine($"  검사: {n}");
            return n % 2 == 0;
        });
        Console.WriteLine("질의를 만들었다");

        nums.Add(4);                       // 실행 전에 추가
        foreach (int n in evens)           // 여기서 비로소 실행
            Console.WriteLine($"짝수: {n}");

        List<int> snapshot = evens.ToList();   // 즉시 실행 + 복사
        nums.Add(6);
        Console.WriteLine($"snapshot: {snapshot.Count}, evens: {evens.Count()}");
    }
}`, points: ['질의를 만들 때는 아무것도 안 함', '<code>foreach</code> · <code>ToList</code> · <code>Count</code> 에서 실행', '실행 전 원본 변경이 결과에 반영', '<code>ToList()</code> = 그 시점의 스냅샷'],
            notes: '<p><b>[6분]</b> 실행 전에 “검사: 1 이 언제 찍힐까?” 를 예측하게 한 뒤 실행. 마지막 줄에서 evens.Count() 가 다시 검사를 돌리는 것도 확인(검사 출력이 한 번 더 나온다).</p>' },
          { layout: 'code', title: '예제 11-10. 객체 목록 — 학생 성적', code: `using System;
using System.Collections.Generic;
using System.Linq;
class Student
{
    public string Name; public string Class; public int Score;
    public Student(string n, string c, int s) { Name = n; Class = c; Score = s; }
}

class Program
{
    static void Main()
    {
        var students = new List<Student> {
            new Student("철수", "A", 85), new Student("영희", "B", 92),
            new Student("민수", "A", 78), new Student("지영", "B", 92),
            new Student("현우", "C", 64), new Student("수진", "A", 90) };
        var honor = students.Where(s => s.Score >= 80)
                            .OrderByDescending(s => s.Score)
                            .ThenBy(s => s.Name);
        foreach (var s in honor) Console.WriteLine($"{s.Name} {s.Score}");
        var names = students.Where(s => s.Class == "A").Select(s => s.Name);
        Console.WriteLine(string.Join(", ", names));

        var summary = students.Select(s => new { s.Name, Top = s.Score >= 90 });
        Console.WriteLine(summary.First());
        Console.WriteLine($"평균 {students.Average(s => s.Score):F1}");
    }
}`, points: ['람다 안에서 속성 <code>s.Score</code> 사용', '<code>OrderByDescending</code> + <code>ThenBy</code> 2차 정렬', '<code>Select</code> 로 이름만 · 익명 형식 <code>new { }</code>', '익명 형식은 반드시 <code>var</code>'],
            notes: '<p><b>[6분]</b> 익명 형식 출력 <code>{ Name = 철수, Top = False }</code> 를 보여 주고 “클래스 없이 임시 객체” 설명. 쿼리 구문(<code>from … select</code>)은 본문 예제로 읽기만 하게 합니다.</p>' },
          { layout: 'code', title: '예제 11-11. GroupBy — 반별 평균', code: `using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public string Name; public string Class; public int Score;
    public Student(string n, string c, int s) { Name = n; Class = c; Score = s; }
}

class Program
{
    static void Main()
    {
        var students = new List<Student> {
            new Student("철수", "A", 85), new Student("영희", "B", 92),
            new Student("민수", "A", 78), new Student("지영", "B", 92),
            new Student("현우", "C", 64), new Student("수진", "A", 90) };

        foreach (var g in students.GroupBy(s => s.Class).OrderBy(g => g.Key))
            Console.WriteLine($"[{g.Key}반] " + string.Join(", ", g.Select(s => s.Name)));

        var stats = students.GroupBy(s => s.Class)
                            .Select(g => new { Class = g.Key, Count = g.Count(), Avg = g.Average(s => s.Score) })
                            .OrderBy(x => x.Class);
        foreach (var x in stats)
            Console.WriteLine($"{x.Class}반: {x.Count}명, 평균 {x.Avg:F1}");
    }
}`, points: ['<code>GroupBy(키)</code> → 그룹의 시퀀스', '그룹: <code>g.Key</code> + 요소들', '그룹 안에서 다시 LINQ (<code>Count</code>, <code>Average</code>)', 'GroupBy → Select → OrderBy 정석 패턴'],
            notes: '<p><b>[5분]</b> “그룹 = Key 를 가진 작은 리스트” 를 그림으로 칠판에. 발문: “점수대(90 이상 / 80대 / 그 외)로 묶으려면 키를 어떻게?” → <code>s.Score / 10</code>.</p>' },
          { layout: 'code', title: '예제 11-12. 문자열 LINQ · 확장 메서드', code: `using System;
using System.Linq;

static class MyExtensions
{
    public static bool IsEven(this int n) { return n % 2 == 0; }
    public static string Bracket(this string s) { return "[" + s + "]"; }
}

class Program
{
    static void Main()
    {
        string word = "hello world";
        Console.WriteLine(word.Count(c => c == 'l'));         // 3
        Console.WriteLine(string.Concat(word.Reverse()));
        Console.WriteLine(string.Concat(word.Distinct()));

        Console.WriteLine(10.IsEven());                       // True
        Console.WriteLine("확장".Bracket().Bracket());          // [[확장]]
    }
}`, points: ['string 은 char 의 시퀀스', '확장 메서드: <code>static</code> 클래스 + <code>this</code> 매개변수', '<code>10.IsEven()</code> = <code>MyExtensions.IsEven(10)</code>', 'LINQ 메서드 전부가 확장 메서드'],
            notes: '<p><b>[4분]</b> <code>using System.Linq;</code> 를 지우고 빨간 줄이 생기는 것을 보여 주면 “확장 메서드는 using 으로 켜진다” 가 와닿습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>int[] nums = { 1, 2, 3, 4, 5 };\nvar r = nums.Where(n =&gt; n &gt; 3).Select(n =&gt; n * 2);\nConsole.WriteLine(string.Join(",", r));</code></pre>', options: ['2,4,6,8,10', '4,5', '8,10', '6,8,10'], answer: 2, explain: 'Where 로 4, 5 → Select 로 8, 10.',
            notes: '<p>정답 후 “Select 와 Where 순서를 바꾸면?” → n*2 &gt; 3 이므로 4,6,8,10. 순서의 중요성 재확인.</p>' },
          { layout: 'practice', title: '실습 11-3. 만원 이상 상품, 가격 내림차순', desc: '<p>가격 10,000원 이상인 상품을 가격 내림차순으로 “이름 가격원” 출력, 마지막에 개수와 합계를 출력하세요.</p>', starter: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public Product(string name, int price) { Name = name; Price = price; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product("연필", 500), new Product("노트북", 1200000), new Product("가방", 45000),
            new Product("지우개", 300), new Product("마우스", 25000), new Product("책", 15000)
        };
        // TODO: Where → OrderByDescending → 출력 → 개수 · 합계
    }
}`, solution: `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public Product(string name, int price) { Name = name; Price = price; }
}

class Program
{
    static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product("연필", 500), new Product("노트북", 1200000), new Product("가방", 45000),
            new Product("지우개", 300), new Product("마우스", 25000), new Product("책", 15000)
        };
        var expensive = products.Where(p => p.Price >= 10000).OrderByDescending(p => p.Price).ToList();
        foreach (Product p in expensive)
            Console.WriteLine($"{p.Name} {p.Price:N0}원");
        Console.WriteLine($"만원 이상 상품 수: {expensive.Count}, 합계: {expensive.Sum(p => p.Price):N0}원");
    }
}`,
            notes: '<p><b>[8분]</b> Where → OrderByDescending → ToList 순서로 한 단계씩 완성하게. 빨리 끝난 학생은 실습 11-4(글자 수별 그룹)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>using System.Linq;</code> — 컬렉션에 질문하는 메서드 체인', '<code>Where</code> 거르기 · <code>Select</code> 변환 · <code>OrderBy</code>/<code>ThenBy</code> 정렬 · <code>Take</code>/<code>Skip</code>', '<code>Count</code> · <code>Sum</code> · <code>Average</code> · <code>Any</code> · <code>All</code> · <code>First</code>/<code>FirstOrDefault</code>', '지연 실행 — 결과를 꺼낼 때 실행, <code>ToList()</code> 로 스냅샷', '<code>GroupBy</code> + 익명 형식 <code>new { }</code> + <code>var</code>, 확장 메서드 <code>this</code>'],
            notes: '<p>다음 장: 제네릭 · 구조체 · 열거형 · 비동기. LINQ 는 WPF 18장 데이터 바인딩과 프로젝트에서 계속 씁니다.</p>' }
        ]
      }
    ]
  });
})();
