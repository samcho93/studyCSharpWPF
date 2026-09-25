/* Chapter 06. 메서드 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_METHOD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메서드의 구조">
  <rect x="40" y="30" width="720" height="500" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <g style="${MONO};font-size:30px;fill:var(--fg)">
    <text x="70" y="100"><tspan fill="var(--accent)" font-weight="700">static</tspan> <tspan fill="var(--accent2)" font-weight="700">int</tspan> <tspan fill="var(--ok)" font-weight="700">Add</tspan><tspan fill="var(--warn)" font-weight="700">(int a, int b)</tspan></text>
    <text x="70" y="160">{</text>
    <text x="130" y="220">int sum = a + b;</text>
    <text x="130" y="280"><tspan fill="var(--danger)" font-weight="700">return</tspan> sum;</text>
    <text x="70" y="340">}</text>
    <line x1="70" y1="390" x2="730" y2="390" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
    <text x="70" y="450"><tspan fill="var(--accent2)">int</tspan> r = <tspan fill="var(--ok)" font-weight="700">Add</tspan><tspan fill="var(--warn)">(3, 4)</tspan>;</text>
    <text x="70" y="500" style="font-size:22px;fill:var(--muted)">// 호출(call): 인수 3, 4 가 a, b 에 복사되고 r 에 7 이 들어온다</text>
  </g>
  <g style="font-size:22px">
    <text x="800" y="85" style="fill:var(--accent);font-weight:700;font-size:24px">① static (정적)</text>
    <text x="800" y="113" style="fill:var(--muted)">Main 처럼 static 이면 객체 없이 바로 호출 (8장)</text>
    <text x="800" y="160" style="fill:var(--accent2);font-weight:700;font-size:24px">② 반환형 (return type)</text>
    <text x="800" y="188" style="fill:var(--muted)">돌려주는 값의 자료형. 돌려줄 게 없으면 void</text>
    <text x="800" y="235" style="fill:var(--ok);font-weight:700;font-size:24px">③ 이름</text>
    <text x="800" y="263" style="fill:var(--muted)">동사로 시작, PascalCase (Add, PrintLine, GetMax)</text>
    <text x="800" y="310" style="fill:var(--warn);font-weight:700;font-size:24px">④ 매개변수 (parameter)</text>
    <text x="800" y="338" style="fill:var(--muted)">받을 값의 자료형 + 이름. 없으면 ( ) 만 쓴다</text>
    <text x="800" y="385" style="fill:var(--fg);font-weight:700;font-size:24px">⑤ 본문 (body)</text>
    <text x="800" y="413" style="fill:var(--muted)">{ } 안에서 실제 일을 한다</text>
    <text x="800" y="460" style="fill:var(--danger);font-weight:700;font-size:24px">⑥ return</text>
    <text x="800" y="488" style="fill:var(--muted)">값을 돌려주고 메서드를 끝낸다</text>
  </g>
</svg>`;

  const SVG_CALL = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메서드 호출의 흐름: 호출, 실행, 복귀">
  <defs>
    <marker id="ah6a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah6b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <rect x="40" y="40" width="560" height="360" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="70" y="85" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent)">static void Main()</text>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <text x="70" y="130">{</text>
    <text x="110" y="180">Console.WriteLine("시작");</text>
    <text x="110" y="240">int a = <tspan fill="var(--accent)" font-weight="700">Square(3)</tspan>;</text>
    <text x="110" y="300">Console.WriteLine(a);</text>
    <text x="70" y="360">}</text>
  </g>
  <rect x="700" y="40" width="540" height="360" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="730" y="85" style="${MONO};font-size:26px;font-weight:700;fill:var(--ok)">static int Square(int n)</text>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <text x="730" y="130">{</text>
    <text x="770" y="180">int result = n * n;</text>
    <text x="770" y="240"><tspan fill="var(--ok)" font-weight="700">return</tspan> result;</text>
    <text x="730" y="300">}</text>
    <text x="770" y="350" style="font-size:20px;fill:var(--muted)">// n 에는 3 이 복사되어 들어온다</text>
  </g>
  <path d="M600,232 C650,232 650,100 692,100" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah6a)"/>
  <text x="650" y="150" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">①</text>
  <path d="M700,250 C660,250 660,292 608,292" fill="none" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah6b)"/>
  <text x="650" y="290" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">③</text>
  <g style="font-size:23px">
    <text x="60" y="450" style="fill:var(--accent);font-weight:700">① 호출(call)</text>
    <text x="240" y="450" style="fill:var(--fg)">Square(3) — 인수 3 이 매개변수 n 에 복사된다. Main 은 여기서 멈추고 기다린다</text>
    <text x="60" y="490" style="fill:var(--fg);font-weight:700">② 실행</text>
    <text x="240" y="490" style="fill:var(--fg)">Square 의 본문이 위에서 아래로 실행된다 (result = 9)</text>
    <text x="60" y="530" style="fill:var(--ok);font-weight:700">③ 복귀(return)</text>
    <text x="240" y="530" style="fill:var(--fg)">9 를 들고 호출한 자리로 돌아온다. Square(3) 자리가 9 가 되어 a 에 들어가고, 다음 문장으로</text>
  </g>
</svg>`;

  const SVG_STACK = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="재귀 호출 스택: Factorial(4)">
  <defs>
    <marker id="ah6c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah6d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <text x="640" y="42" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--fg)">Factorial(4) 의 호출 스택 — 기저 조건까지 쌓였다가, 위에서부터 값을 돌려주며 풀린다</text>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <rect x="440" y="80" width="400" height="60" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="640" y="119" text-anchor="middle" font-weight="700">Factorial(1) → return 1</text>
    <rect x="440" y="160" width="400" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="640" y="199" text-anchor="middle">Factorial(2) = 2 * Factorial(1)</text>
    <rect x="440" y="240" width="400" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="640" y="279" text-anchor="middle">Factorial(3) = 3 * Factorial(2)</text>
    <rect x="440" y="320" width="400" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="640" y="359" text-anchor="middle">Factorial(4) = 4 * Factorial(3)</text>
    <rect x="440" y="400" width="400" height="60" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="640" y="439" text-anchor="middle">Main: Factorial(4) 호출</text>
  </g>
  <g style="font-size:21px;fill:var(--fg)" text-anchor="end">
    <text x="420" y="119" style="fill:var(--ok);font-weight:700">④ 기저 조건! 더 부르지 않고 1 반환</text>
    <text x="420" y="199">③ n=2, Factorial(1) 의 답을 기다림</text>
    <text x="420" y="279">② n=3, Factorial(2) 의 답을 기다림</text>
    <text x="420" y="359">① n=4, Factorial(3) 의 답을 기다림</text>
  </g>
  <g style="font-size:21px;fill:var(--fg)">
    <text x="860" y="119" style="fill:var(--ok);font-weight:700">1 을 돌려줌</text>
    <text x="860" y="199">2 × 1 = 2 를 돌려줌</text>
    <text x="860" y="279">3 × 2 = 6 을 돌려줌</text>
    <text x="860" y="359">4 × 6 = 24 를 돌려줌</text>
    <text x="860" y="439">Main 이 24 를 받아 출력</text>
  </g>
  <line x1="70" y1="450" x2="70" y2="100" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah6c)"/>
  <text x="70" y="490" text-anchor="middle" style="font-size:21px;fill:var(--accent);font-weight:700">호출이 쌓인다</text>
  <line x1="1210" y1="90" x2="1210" y2="440" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah6d)"/>
  <text x="1210" y="490" text-anchor="middle" style="font-size:21px;fill:var(--ok);font-weight:700">반환하며 풀린다</text>
  <text x="640" y="530" text-anchor="middle" style="font-size:22px;fill:var(--muted)">기저 조건(base case)이 없으면 끝없이 쌓여 StackOverflowException 으로 프로그램이 멈춘다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch06',
    no: '06',
    title: '메서드',
    subtitle: 'Methods',
    summary: '반복되는 코드를 이름 붙인 코드 묶음(메서드)으로 만들고, 매개변수와 반환값으로 데이터를 주고받는 방법을 배웁니다. 오버로딩 · ref/out · params · 재귀 호출까지 익혀 프로그램을 작은 단위로 나누어 구조화합니다.',
    goals: [
      '메서드의 구조(static · 반환형 · 이름 · 매개변수 · 본문)를 설명하고 정의 · 호출할 수 있다',
      'void 와 return, 매개변수(parameter)와 인수(argument)를 구분해 쓸 수 있다',
      '값 전달(call by value)의 의미와 지역 변수의 범위를 설명할 수 있다',
      '오버로딩 · 기본값 매개변수 · ref/out · params 를 알맞게 사용할 수 있다',
      '재귀 호출의 원리(기저 조건 · 호출 스택)를 설명하고 간단한 재귀 메서드를 만들 수 있다',
      '프로그램을 입력 · 처리 · 출력 메서드로 나누어 구조화할 수 있다'
    ],
    sections: [
      /* ===================== ch06-1 ===================== */
      {
        id: 'ch06-1',
        title: '메서드의 정의와 호출',
        minutes: 50,
        goals: [
          '메서드가 필요한 이유(중복 제거 · 분할 · 재사용)를 설명할 수 있다',
          '메서드를 정의하고 호출하며, 매개변수와 반환값을 주고받을 수 있다',
          'void · return, 매개변수 · 인수, 4가지 메서드 패턴을 구분할 수 있다',
          '값 전달과 지역 변수의 범위를 이해하고 식 본문 메서드(=&gt;)를 쓸 수 있다'
        ],
        flow: [['도입: 같은 코드를 세 번 쓰면?', 5], ['메서드의 구조 · 정의와 호출', 12], ['매개변수 · 반환값 · 4가지 패턴', 13], ['호출 흐름 · 값 전달 · 범위', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '메서드(method)가 필요한 이유' },
          { type: 'p', html: '지금까지 우리는 모든 코드를 <code>Main</code> 안에 썼습니다. 프로그램이 커지면 <b>같은 코드가 여러 번 반복</b>되고, <code>Main</code> 이 수백 줄로 길어져 읽기 어려워집니다. <b>메서드</b>는 <b>이름을 붙인 코드 묶음</b>입니다. 한 번 만들어 두면 이름만 불러서 몇 번이든 다시 쓸 수 있습니다. 요리로 비유하면 “김치찌개 끓이는 법”을 레시피 카드 한 장으로 적어 두고, 필요할 때마다 그 카드를 꺼내 보는 것과 같습니다.' },
          { type: 'list', items: [
            '<b>중복 제거</b>: 같은 코드를 복사해 붙이지 않고 한 곳에만 둔다. 고칠 때도 한 곳만 고치면 된다.',
            '<b>분할</b>: 큰 문제를 “입력받기 · 계산하기 · 출력하기” 같은 작은 조각으로 나눈다. 조각마다 이름이 있어 읽기 쉽다.',
            '<b>재사용</b>: 잘 만든 메서드는 다른 프로그램에서도 그대로 쓸 수 있다. <code>Console.WriteLine</code>, <code>int.Parse</code>, <code>Math.Sqrt</code> 도 누군가 만들어 둔 메서드다.'
          ] },
          { type: 'code', title: '예제 6-1. 반복되는 코드를 메서드로', code: `using System;

class Program
{
    // 메서드 정의(definition): 구분선을 출력하는 일을 PrintLine 이라는 이름으로 묶는다
    static void PrintLine()
    {
        Console.WriteLine("==============================");
    }

    static void Main()
    {
        PrintLine();                      // 메서드 호출(call): 이름 + ( )
        Console.WriteLine("성적표");
        PrintLine();
        Console.WriteLine("국어 90, 수학 85");
        PrintLine();
    }
}`, expect: `==============================
성적표
==============================
국어 90, 수학 85
==============================`, desc: '<code>PrintLine</code> 을 <b>정의</b>한 것은 한 번이지만, <code>Main</code> 에서 <b>호출</b>은 세 번입니다. 구분선을 <code>------</code> 로 바꾸고 싶다면 <code>8행</code> 한 곳만 고치면 세 곳이 모두 바뀝니다. 메서드는 <code>Main</code> 과 같은 <b>클래스 안</b>에, <code>Main</code> 과 <b>나란히</b> 씁니다(메서드 안에 메서드를 정의하는 것은 “로컬 함수”라는 특별한 형태로 다음 시간에 봅니다).' },
          { type: 'callout', kind: 'info', title: '함수? 메서드?', html: '다른 언어에서 <b>함수(function)</b>라 부르는 것을 C# 에서는 <b>메서드</b>라고 합니다. C# 의 코드는 모두 클래스 안에 있으므로, “클래스에 속한 함수”라는 뜻에서 메서드라고 부릅니다. <code>Main</code> 도 메서드입니다 — 운영체제가 호출해 주는 특별한 메서드일 뿐입니다.' },
          { type: 'h', text: '메서드의 구조' },
          { type: 'figure', html: SVG_METHOD, caption: '메서드의 구조 — static · 반환형 · 이름 · 매개변수 · 본문 · return' },
          { type: 'table', head: ['구성 요소', '뜻', '예'], rows: [
            ['접근 제한자 · <code>static</code>', '누가 쓸 수 있는지(<code>public</code>/<code>private</code>, 8장)와 객체 없이 호출 가능한지(<code>static</code>). 지금은 <b>모두 <code>static</code></b> 으로 씁니다', '<code>static</code>'],
            ['<b>반환형</b>(return type)', '메서드가 <b>돌려주는 값의 자료형</b>. 돌려줄 값이 없으면 <code>void</code>(비어 있음)', '<code>int</code>, <code>double</code>, <code>string</code>, <code>bool</code>, <code>void</code>'],
            ['<b>이름</b>', '동사로 시작하는 PascalCase. 무슨 일을 하는지 드러나게', '<code>Add</code>, <code>PrintLine</code>, <code>GetMax</code>, <code>IsEven</code>'],
            ['<b>매개변수</b>(parameter) 목록', '메서드가 <b>받을 값</b>의 자료형과 이름. 여러 개는 쉼표로. 없으면 빈 괄호 <code>( )</code>', '<code>(int a, int b)</code>, <code>(string name)</code>, <code>()</code>'],
            ['<b>본문</b>(body)', '<code>{ }</code> 안의 문장들. 실제로 하는 일', '<code>{ return a + b; }</code>'],
            ['<code>return</code>', '값을 돌려주고 <b>메서드를 즉시 끝낸다</b>. 반환형이 <code>void</code> 가 아니면 <b>반드시</b> 있어야 한다', '<code>return sum;</code>']
          ], caption: '메서드 머리(signature) = static + 반환형 + 이름 + 매개변수 목록' },
          { type: 'h', text: '매개변수와 반환값' },
          { type: 'p', html: '메서드에 값을 <b>넣어 주는 통로</b>가 <b>매개변수(parameter)</b>이고, 메서드가 결과를 <b>돌려주는 통로</b>가 <b>반환값(return value)</b>입니다. 자판기를 떠올려 보세요. 동전(매개변수)을 넣으면 음료(반환값)가 나옵니다. 호출할 때 괄호 안에 실제로 넣는 값은 <b>인수(argument)</b>라고 부릅니다.' },
          { type: 'code', title: '예제 6-2. 매개변수로 값 넣기, return 으로 값 돌려받기', code: `using System;

class Program
{
    // 매개변수 두 개(name, age)를 받아 출력만 한다 — 반환값 없음(void)
    static void Greet(string name, int age)
    {
        Console.WriteLine(\$"안녕하세요, {name}님! {age}살이시군요.");
    }

    // 매개변수 두 개를 받아 합을 돌려준다 — 반환형 int
    static int Add(int a, int b)
    {
        int sum = a + b;
        return sum;            // 결과를 호출한 곳으로 돌려준다
    }

    static void Main()
    {
        Greet("홍길동", 20);                 // 인수 "홍길동" → name, 20 → age
        Greet("김코딩", 17);

        int result = Add(3, 4);              // Add(3, 4) 자리가 7 로 바뀌어 result 에 저장
        Console.WriteLine(\$"3 + 4 = {result}");
        Console.WriteLine(\$"10 + 20 = {Add(10, 20)}");   // 반환값을 바로 출력
        Console.WriteLine(Add(Add(1, 2), 3));            // 반환값을 다시 인수로: Add(3, 3)
    }
}`, expect: `안녕하세요, 홍길동님! 20살이시군요.
안녕하세요, 김코딩님! 17살이시군요.
3 + 4 = 7
10 + 20 = 30
6`, desc: '인수는 <b>순서대로</b> 매개변수에 들어갑니다(<code>"홍길동"</code> → <code>name</code>, <code>20</code> → <code>age</code>). 개수와 자료형이 맞지 않으면 컴파일 오류(CS1501, CS1503)입니다. 반환값이 있는 메서드 호출 <code>Add(3, 4)</code> 는 <b>그 자체가 값 7</b> 이므로, 변수에 넣거나 출력하거나 다른 메서드의 인수로 쓸 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '매개변수(parameter) 와 인수(argument)', html: '<b>매개변수</b>는 메서드를 <b>정의할 때</b> 괄호 안에 쓰는 <b>변수</b>(<code>int a, int b</code>), <b>인수</b>는 <b>호출할 때</b> 괄호 안에 넣는 <b>실제 값</b>(<code>3, 4</code>)입니다. “매개변수는 빈칸, 인수는 빈칸에 써 넣는 값”으로 기억하세요.' },
          { type: 'h', text: 'void 와 return — 4가지 패턴' },
          { type: 'p', html: '메서드는 <b>매개변수가 있는지</b>, <b>반환값이 있는지</b>에 따라 네 가지 모양이 됩니다. 반환값이 없으면 반환형 자리에 <code>void</code> 를 쓰고 <code>return</code> 을 생략할 수 있습니다.' },
          { type: 'table', head: ['', '매개변수 없음', '매개변수 있음'], rows: [
            ['<b>반환값 없음 (void)</b>', '<code>static void SayHello()</code><br>“그냥 해라”', '<code>static void PrintSquare(int n)</code><br>“이 값으로 해라”'],
            ['<b>반환값 있음</b>', '<code>static string GetTitle()</code><br>“값을 하나 줘”', '<code>static double Average(int a, int b, int c)</code><br>“이 값들로 계산해서 줘”']
          ] },
          { type: 'code', title: '예제 6-3. 매개변수 · 반환값 유무에 따른 4가지 패턴', code: `using System;

class Program
{
    static void SayHello()                        // ① 매개변수 X, 반환값 X
    {
        Console.WriteLine("안녕하세요!");
    }

    static void PrintSquare(int n)                // ② 매개변수 O, 반환값 X
    {
        Console.WriteLine(\$"{n}의 제곱은 {n * n}");
    }

    static string GetTitle()                      // ③ 매개변수 X, 반환값 O
    {
        return "=== 계산기 ===";
    }

    static double Average(int a, int b, int c)    // ④ 매개변수 O, 반환값 O
    {
        return (a + b + c) / 3.0;
    }

    static void Main()
    {
        SayHello();
        PrintSquare(7);
        string title = GetTitle();
        Console.WriteLine(title);
        double avg = Average(90, 85, 92);
        Console.WriteLine(\$"평균: {avg:F2}");
    }
}`, expect: `안녕하세요!
7의 제곱은 49
=== 계산기 ===
평균: 89.00`, desc: '①② 처럼 <code>void</code> 메서드는 호출문 한 줄(<code>SayHello();</code>)로 쓰고, ③④ 처럼 반환값이 있는 메서드는 <b>값이 오는 자리</b>(대입 · 출력 · 식)에 씁니다. <code>void</code> 메서드의 결과를 변수에 넣으려 하면(<code>int x = SayHello();</code>) 오류 CS0029 가 납니다.' },
          { type: 'code', title: '추가 예제. bool 반환과 return 으로 바로 끝내기', code: `using System;

class Program
{
    static bool IsEven(int n)
    {
        return n % 2 == 0;        // 비교식의 결과(true/false)를 그대로 돌려준다
    }

    static void PrintGrade(int score)
    {
        if (score < 0 || score > 100)
        {
            Console.WriteLine(\$"{score}: 잘못된 점수입니다.");
            return;               // void 메서드도 return 으로 여기서 끝낼 수 있다 (아래는 실행 안 됨)
        }
        string grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
        Console.WriteLine(\$"{score}: {grade}");
    }

    static void Main()
    {
        Console.WriteLine(IsEven(4));
        Console.WriteLine(IsEven(7));
        if (IsEven(10)) Console.WriteLine("10은 짝수");   // bool 메서드는 조건식 자리에 딱 맞다
        PrintGrade(95);
        PrintGrade(82);
        PrintGrade(120);
    }
}`, expect: `True
False
10은 짝수
95: A
82: B
120: 잘못된 점수입니다.`, desc: '<code>Is…</code>, <code>Has…</code>, <code>Can…</code> 으로 시작하는 <code>bool</code> 메서드는 <code>if</code> 조건에 바로 넣을 수 있어 코드가 문장처럼 읽힙니다. <code>return;</code>(값 없음)은 <code>void</code> 메서드를 <b>중간에 끝내는</b> 데 씁니다. 잘못된 입력을 먼저 걸러 내고 빠져나가는 이런 패턴을 “가드(guard)”라고 합니다.' },
          { type: 'h', text: '메서드 호출의 흐름 — 호출 → 실행 → 복귀' },
          { type: 'p', html: '메서드를 호출하면 프로그램의 흐름이 <b>메서드 안으로 점프</b>했다가, 메서드가 끝나면 <b>호출한 자리로 돌아와</b> 그 다음 문장을 이어서 실행합니다. 호출한 쪽은 그동안 <b>기다립니다</b>. 전화를 걸어(호출) 상대가 답을 찾는 동안 기다렸다가(실행) 답을 듣고(복귀) 하던 일을 계속하는 것과 같습니다.' },
          { type: 'figure', html: SVG_CALL, caption: '① 인수가 매개변수에 복사되며 메서드로 점프 → ② 본문 실행 → ③ 반환값을 들고 호출한 자리로 복귀' },
          { type: 'code', title: '예제 6-4. 호출 흐름을 출력으로 따라가기', code: `using System;

class Program
{
    static int Square(int n)
    {
        Console.WriteLine(\$"  Square 시작 (n = {n})");
        int result = n * n;
        Console.WriteLine(\$"  Square 끝, {result} 반환");
        return result;
    }

    static void Main()
    {
        Console.WriteLine("Main 시작");
        int a = Square(3);                 // ① 여기서 Square 로 점프 → 끝나면 ② 로 복귀
        Console.WriteLine(\$"Main: a = {a}");   // ②
        int b = Square(5);
        Console.WriteLine(\$"Main: b = {b}");
        Console.WriteLine("Main 끝");
    }
}`, expect: `Main 시작
  Square 시작 (n = 3)
  Square 끝, 9 반환
Main: a = 9
  Square 시작 (n = 5)
  Square 끝, 25 반환
Main: b = 25
Main 끝`, desc: '출력 순서를 코드와 맞춰 보세요. <code>Main</code> 의 문장 사이에 <code>Square</code> 의 출력이 끼어들었다가 다시 <code>Main</code> 으로 돌아옵니다. 같은 메서드를 두 번 호출하면 <b>매번 처음부터 다시</b> 실행되고, 매개변수 <code>n</code> 은 호출할 때마다 새로 만들어집니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 메서드 다루기', html: '<ul><li>호출 코드 위에서 <b>F12</b>(정의로 이동)를 누르면 메서드 정의로 점프하고, 정의 위에서 <b>Shift + F12</b> 는 이 메서드를 호출하는 곳을 모두 찾아 줍니다.</li><li><code>Main</code> 안의 코드 몇 줄을 드래그해 선택한 뒤 <b>Ctrl + .</b>(빠른 작업) → <b>메서드 추출</b>을 고르면 선택한 코드가 자동으로 새 메서드가 됩니다.</li><li>디버그 실행(F5) 중 <b>F11</b>(한 단계씩 코드 실행)을 누르면 호출 → 실행 → 복귀 흐름을 한 줄씩 눈으로 따라갈 수 있습니다.</li></ul>' },
          { type: 'h', text: '값 전달 (call by value)' },
          { type: 'p', html: '인수를 넘기면 매개변수에는 값의 <b>복사본</b>이 들어갑니다. 그래서 메서드 안에서 매개변수를 아무리 바꿔도 <b>호출한 쪽의 원본 변수는 그대로</b>입니다. 이를 <b>값 전달(call by value)</b>이라고 합니다. 친구에게 문서를 <b>복사해서</b> 주면, 친구가 복사본에 낙서해도 내 원본은 깨끗한 것과 같습니다.' },
          { type: 'code', title: '예제 6-5. 메서드 안에서 바꿔도 원본은 그대로', code: `using System;

class Program
{
    static void AddTen(int x)          // x 는 num 의 복사본
    {
        x = x + 10;
        Console.WriteLine(\$"  메서드 안: x = {x}");
    }

    static int PlusTen(int x)          // 바꾼 값을 쓰려면 반환해서 돌려준다
    {
        return x + 10;
    }

    static void Main()
    {
        int num = 5;
        Console.WriteLine(\$"호출 전: num = {num}");
        AddTen(num);
        Console.WriteLine(\$"호출 후: num = {num}");       // 여전히 5

        num = PlusTen(num);                               // 반환값을 다시 num 에 넣는다
        Console.WriteLine(\$"반환값 대입 후: num = {num}");
    }
}`, expect: `호출 전: num = 5
  메서드 안: x = 15
호출 후: num = 5
반환값 대입 후: num = 15`, desc: '<code>AddTen(num)</code> 은 <code>x</code> 만 15 로 만들 뿐 <code>num</code> 은 5 그대로입니다. 메서드가 계산한 결과를 쓰고 싶다면 <b><code>return</code> 으로 돌려받아 대입</b>하세요. 원본을 직접 바꾸고 싶을 때 쓰는 <code>ref</code> 는 다음 시간에 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 배열 · 객체를 넘기면?', html: '<code>int</code>, <code>double</code>, <code>bool</code> 같은 <b>값 형식</b>은 값 자체가 복사됩니다. 반면 배열(7장)이나 클래스 객체(8장) 같은 <b>참조 형식</b>은 “데이터가 있는 곳의 주소”가 복사되므로, 메서드 안에서 <code>arr[0] = 99;</code> 처럼 내용을 바꾸면 원본 배열도 바뀝니다. 복사되는 것은 여전히 “값(주소)”이지만, 같은 곳을 가리키기 때문입니다. 7장에서 실험해 봅니다.' },
          { type: 'h', text: '변수의 범위 (scope) — 지역 변수' },
          { type: 'p', html: '메서드 안에서 선언한 변수(매개변수 포함)는 <b>그 메서드 안에서만</b> 존재합니다. 이런 변수를 <b>지역 변수(local variable)</b>라고 합니다. 메서드가 끝나면 사라지고, 다른 메서드에서는 보이지 않습니다. 그래서 서로 다른 메서드에서 <b>같은 이름</b>의 변수를 써도 전혀 다른 변수입니다.' },
          { type: 'code', title: '추가 예제. 다른 메서드의 지역 변수는 보이지 않는다', code: `using System;

class Program
{
    static void ShowTotal()
    {
        int total = 100;               // ShowTotal 안에서만 존재
        Console.WriteLine(total);
    }

    static void Main()
    {
        int count = 3;                 // Main 안에서만 존재
        ShowTotal();
        Console.WriteLine(total);      // CS0103: 'total' 이름이 현재 컨텍스트에 없습니다
    }
}`, expectCompileError: true, desc: '<code>Main</code> 에서 <code>ShowTotal</code> 의 <code>total</code> 을 쓰려 하면 컴파일 오류가 납니다. 값을 주고받는 <b>정식 통로는 매개변수와 반환값</b>입니다. <code>Console.WriteLine(total);</code> 을 지우거나 <code>ShowTotal</code> 이 값을 반환하도록 고쳐 보세요. (여러 메서드가 함께 쓰는 변수는 클래스의 <b>필드</b>로 만드는데, 8장에서 배웁니다.)' },
          { type: 'h', text: '식 본문 메서드 (expression-bodied method)' },
          { type: 'p', html: '본문이 <b><code>return 식;</code> 한 줄</b>이거나 문장 하나뿐이면, 중괄호와 <code>return</code> 대신 <b><code>=&gt;</code></b> 로 짧게 쓸 수 있습니다. 동작은 완전히 같고 읽기만 쉬워집니다.' },
          { type: 'code', title: '추가 예제. => 로 짧게 쓰는 메서드', code: `using System;

class Program
{
    static int Square(int n) => n * n;                              // return n * n; 과 같다
    static double CircleArea(double r) => Math.PI * r * r;
    static bool IsAdult(int age) => age >= 19;
    static void PrintStars(int n) => Console.WriteLine(new string('*', n));   // void 도 가능

    static void Main()
    {
        Console.WriteLine(Square(9));
        Console.WriteLine(\$"{CircleArea(2):F2}");
        Console.WriteLine(IsAdult(20));
        PrintStars(5);
    }
}`, expect: `81
12.57
True
*****`, desc: '<code>=&gt;</code> 오른쪽에는 <b>식(expression) 하나</b>만 올 수 있습니다. <code>if</code> 문이나 반복문처럼 여러 문장이 필요하면 원래대로 <code>{ }</code> 를 씁니다. <code>new string(\'*\', 5)</code> 는 같은 문자를 5개 이어 붙인 문자열을 만듭니다.' }
        ],
        practice: [
          {
            title: '실습 6-1. 최댓값 메서드 만들기',
            level: 1,
            desc: '<p>두 정수 중 큰 값을 반환하는 <code>Max2(int a, int b)</code> 와, 세 정수 중 가장 큰 값을 반환하는 <code>Max3(int a, int b, int c)</code> 를 작성하세요. <code>Max3</code> 은 <b><code>Max2</code> 를 두 번 이용</b>해 만듭니다.</p><pre>Max2(3, 7) = 7\nMax3(5, 12, 9) = 12</pre>',
            hint: '<code>return a &gt; b ? a : b;</code> 그리고 <code>return Max2(Max2(a, b), c);</code>',
            starter: `using System;

class Program
{
    // TODO: Max2 메서드 작성 (두 정수 중 큰 값 반환)

    // TODO: Max3 메서드 작성 (Max2 를 두 번 사용)

    static void Main()
    {
        // TODO: 아래 두 줄의 주석을 풀어 실행
        // Console.WriteLine($"Max2(3, 7) = {Max2(3, 7)}");
        // Console.WriteLine($"Max3(5, 12, 9) = {Max3(5, 12, 9)}");
    }
}
`,
            solution: `using System;

class Program
{
    static int Max2(int a, int b)
    {
        return a > b ? a : b;
    }

    static int Max3(int a, int b, int c)
    {
        return Max2(Max2(a, b), c);
    }

    static void Main()
    {
        Console.WriteLine(\$"Max2(3, 7) = {Max2(3, 7)}");
        Console.WriteLine(\$"Max3(5, 12, 9) = {Max3(5, 12, 9)}");
    }
}
`,
            expect: `Max2(3, 7) = 7
Max3(5, 12, 9) = 12`
          },
          {
            title: '실습 6-2. 구구단 메서드와 합계 메서드',
            level: 2,
            desc: '<p>단을 입력받아 <code>PrintDan(int dan)</code> 메서드로 구구단 한 단을 출력하고, <code>SumTo(int n)</code> 메서드로 1 부터 n 까지의 합을 반환받아 출력하세요.</p><pre>단을 입력: 7\n7 x 1 = 7\n7 x 2 = 14\n…\n7 x 9 = 63\n1부터 7까지의 합: 28</pre><p>(입력한 값은 콘솔 출력에는 나타나지 않습니다.)</p>',
            hint: '<code>PrintDan</code> 은 <code>void</code> 에 <code>for (int i = 1; i &lt;= 9; i++)</code>, <code>SumTo</code> 는 <code>int</code> 를 반환하며 반복문으로 더한 뒤 <code>return sum;</code>.',
            starter: `using System;

class Program
{
    // TODO: PrintDan(int dan) — dan x 1 ~ dan x 9 출력

    // TODO: SumTo(int n) — 1 + 2 + … + n 을 반환

    static void Main()
    {
        Console.Write("단을 입력: ");
        int dan = int.Parse(Console.ReadLine());
        // TODO: PrintDan 호출
        // TODO: SumTo 결과 출력 "1부터 {dan}까지의 합: {합}"
    }
}
`,
            solution: `using System;

class Program
{
    static void PrintDan(int dan)
    {
        for (int i = 1; i <= 9; i++)
        {
            Console.WriteLine(\$"{dan} x {i} = {dan * i}");
        }
    }

    static int SumTo(int n)
    {
        int sum = 0;
        for (int i = 1; i <= n; i++)
        {
            sum += i;
        }
        return sum;
    }

    static void Main()
    {
        Console.Write("단을 입력: ");
        int dan = int.Parse(Console.ReadLine());
        PrintDan(dan);
        Console.WriteLine(\$"1부터 {dan}까지의 합: {SumTo(dan)}");
    }
}
`,
            stdin: '7\n',
            expect: `단을 입력: 7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
1부터 7까지의 합: 28`
          }
        ],
        quiz: [
          { q: '메서드가 값을 돌려줄 때 사용하는 키워드는?', options: ['<code>void</code>', '<code>break</code>', '<code>return</code>', '<code>continue</code>'], answer: 2, explain: '<code>return 값;</code> 은 값을 돌려주고 메서드를 즉시 끝냅니다.' },
          { q: '메서드의 반환형 자리에 쓰는 <code>void</code> 의 뜻은?', options: ['매개변수가 없다', '돌려주는 값이 없다', '아무 일도 하지 않는다', '컴파일하지 않는다'], answer: 1, explain: '<code>void</code> 는 “비어 있음”. 값을 돌려주지 않는 메서드에 씁니다. 매개변수는 있을 수도 있습니다.' },
          { q: '다음 코드의 출력 결과는?<pre><code>static void Change(int x)\n{\n    x = 100;\n}\nstatic void Main()\n{\n    int a = 1;\n    Change(a);\n    Console.WriteLine(a);\n}</code></pre>', options: ['1', '100', '101', '컴파일 오류'], answer: 0, explain: '값 전달: <code>x</code> 는 <code>a</code> 의 복사본이므로 <code>a</code> 는 그대로 1 입니다.' },
          { q: '메서드를 <b>호출할 때</b> 괄호 안에 실제로 넘기는 값을 무엇이라고 하나요?', options: ['매개변수(parameter)', '반환값', '지역 변수', '인수(argument)'], answer: 3, explain: '정의할 때의 빈칸이 매개변수, 호출할 때 넣는 실제 값이 인수입니다.' },
          { q: '다음 코드의 출력 결과는?<pre><code>static int Twice(int n) =&gt; n * 2;\n\nstatic void Main()\n{\n    Console.WriteLine(Twice(Twice(3)));\n}</code></pre>', options: ['6', '12', '9', '36'], answer: 1, explain: '안쪽 <code>Twice(3)</code> 이 6, 바깥 <code>Twice(6)</code> 이 12.' }
        ],
        slides: [
          { layout: 'title', title: '메서드의 정의와 호출', subtitle: 'Chapter 06 · Section 01 — 이름 붙인 코드 묶음', badge: '06-1',
            notes: '<p><b>[도입 3분]</b> “구분선 출력 코드를 프로그램 열 곳에 복사해 붙였는데, 모양을 바꾸라고 하면?” — 열 곳을 다 고쳐야 한다. 한 곳에 적어 두고 이름으로 부르자 → 메서드.</p><p>오늘 목표: 메서드의 구조, 정의 vs 호출, 매개변수 · 반환값, 값 전달.</p>' },
          { layout: 'bullets', title: '메서드가 필요한 이유', lead: '메서드 = 이름을 붙인 코드 묶음 (레시피 카드)',
            bullets: ['<b>중복 제거</b>: 같은 코드는 한 곳에만 — 고칠 때도 한 곳만', '<b>분할</b>: 입력 · 계산 · 출력처럼 작은 조각으로 나눈다', '<b>재사용</b>: <code>Console.WriteLine</code>, <code>int.Parse</code> 도 남이 만든 메서드', ['C# 에서는 함수(function)를 <b>메서드</b>라고 부른다 (클래스 안에 있으니까)']],
            notes: '<p><b>[4분]</b> 레시피 카드 비유. “Main 도 메서드다 — 운영체제가 호출해 주는 특별한 메서드”라고 짚어 주세요.</p><p>발문: “지금까지 쓴 것 중 메서드는?” → WriteLine, ReadLine, Parse, Math.Round…</p>' },
          { layout: 'diagram', title: '메서드의 구조', html: SVG_METHOD, caption: 'static · 반환형 · 이름 · (매개변수) · { 본문 } · return',
            notes: '<p><b>[6분]</b> 여섯 부분을 색깔로 짚습니다. 반환형이 <code>void</code> 면 return 생략. 매개변수가 없어도 괄호는 필수.</p><p>“호출” 줄을 가리키며 3, 4 가 a, b 에 복사되고 7 이 r 로 온다고 설명. 이름 규칙: 동사 + PascalCase.</p>' },
          { layout: 'code', title: '예제 6-1. 반복 코드를 메서드로', code: `using System;

class Program
{
    static void PrintLine()          // 정의는 한 번
    {
        Console.WriteLine("==============================");
    }

    static void Main()
    {
        PrintLine();                 // 호출은 여러 번
        Console.WriteLine("성적표");
        PrintLine();
        Console.WriteLine("국어 90, 수학 85");
        PrintLine();
    }
}`, points: ['<b>정의</b>는 Main 과 나란히, 클래스 안에', '<b>호출</b>은 이름 + <code>( )</code> + <code>;</code>', '구분선을 바꾸려면 한 곳만 수정'],
            notes: '<p><b>[5분]</b> 실행 후 구분선 문자열을 <code>------</code> 로 바꿔 다시 실행 — 세 곳이 한꺼번에 바뀌는 것을 보여 줍니다.</p><p>흔한 실수: Main 안에 메서드를 정의하려고 함. “메서드는 Main 의 형제”라고 정리.</p>' },
          { layout: 'code', title: '예제 6-2. 매개변수와 반환값', code: `using System;

class Program
{
    static void Greet(string name, int age)
    {
        Console.WriteLine($"안녕하세요, {name}님! {age}살이시군요.");
    }

    static int Add(int a, int b)
    {
        return a + b;               // 값을 돌려주고 끝
    }

    static void Main()
    {
        Greet("홍길동", 20);          // 인수 → 매개변수 (순서대로)
        int result = Add(3, 4);      // Add(3, 4) 자리가 7 이 된다
        Console.WriteLine(result);
        Console.WriteLine(Add(Add(1, 2), 3));
    }
}`, points: ['<b>매개변수</b> = 정의의 빈칸, <b>인수</b> = 호출 때 넣는 값', '반환값 있는 호출은 <b>그 자체가 값</b>', '개수 · 자료형이 안 맞으면 CS1501 / CS1503'],
            notes: '<p><b>[6분]</b> 자판기 비유(동전 → 음료). <code>Add(Add(1, 2), 3)</code> 을 안쪽부터 손으로 풀어 줍니다.</p><p>인수 순서를 바꿔(<code>Greet(20, "홍길동")</code>) 오류 CS1503 을 보여 주세요.</p>' },
          { layout: 'table', title: '4가지 패턴 — 매개변수 · 반환값 유무', head: ['', '매개변수 없음', '매개변수 있음'], rows: [['<b>반환값 없음</b> (void)', '<code>static void SayHello()</code>', '<code>static void PrintSquare(int n)</code>'], ['<b>반환값 있음</b>', '<code>static string GetTitle()</code>', '<code>static double Average(int a, int b, int c)</code>']],
            lead: 'void 는 “돌려줄 게 없다”, return 은 “돌려주고 끝”',
            notes: '<p><b>[4분]</b> 예제 6-3 을 실행하며 표의 네 칸과 짝지어 봅니다. “void 메서드 결과를 변수에 넣으면?” → CS0029.</p><p><code>bool</code> 반환 메서드(<code>IsEven</code>)는 if 조건에 바로 넣을 수 있다는 점과 <code>return;</code> 으로 void 를 중간에 끝내는 가드 패턴도 소개.</p>' },
          { layout: 'diagram', title: '호출 → 실행 → 복귀', html: SVG_CALL, caption: '호출한 쪽은 기다리고, 메서드가 끝나면 그 다음 문장부터 이어서 실행',
            notes: '<p><b>[5분]</b> 전화 비유: 걸고(호출) 기다리고(실행) 답 듣고(복귀). 예제 6-4 를 실행해 출력 순서를 코드와 맞춰 보게 합니다.</p><p>Visual Studio 라면 F11 로 한 줄씩 따라가기를 시연하면 가장 효과적입니다.</p>' },
          { layout: 'code', title: '예제 6-5. 값 전달 — 원본은 그대로', code: `using System;

class Program
{
    static void AddTen(int x)      // x 는 복사본
    {
        x = x + 10;
        Console.WriteLine($"  메서드 안: x = {x}");
    }

    static int PlusTen(int x) => x + 10;

    static void Main()
    {
        int num = 5;
        AddTen(num);
        Console.WriteLine($"호출 후: num = {num}");   // 5
        num = PlusTen(num);                            // 반환값 대입
        Console.WriteLine($"대입 후: num = {num}");   // 15
    }
}`, points: ['인수는 <b>복사</b>되어 매개변수에 들어간다', '메서드 안에서 바꿔도 원본 불변', '결과가 필요하면 <b>return 으로 돌려받아 대입</b>'],
            notes: '<p><b>[6분]</b> 실행 전 “호출 후 num 은?” 을 예측하게 합니다(많은 학생이 15 라고 답함). 복사본 비유(복사한 문서에 낙서).</p><p>배열 · 객체는 다르다는 것은 7 · 8장 예고만. 원본을 바꾸는 <code>ref</code> 는 다음 시간.</p>' },
          { layout: 'two', title: '지역 변수의 범위 · 식 본문 메서드', left: { title: '지역 변수 — 메서드 안에서만', code: `static void ShowTotal()
{
    int total = 100;   // 여기서만 존재
}
static void Main()
{
    ShowTotal();
    Console.WriteLine(total); // CS0103
}`, run: false }, right: { title: '=> 로 한 줄 메서드', code: `static int Square(int n) => n * n;
static bool IsAdult(int age) => age >= 19;
static void Hi() => Console.WriteLine("Hi");

// { return n * n; } 과 완전히 같다
// 식 하나만 가능 (if · 반복문은 { })`, run: false },
            notes: '<p><b>[4분]</b> 왼쪽: 값을 주고받는 정식 통로는 매개변수 · 반환값. 다른 메서드의 변수는 보이지 않고, 같은 이름을 써도 다른 변수.</p><p>오른쪽: <code>=&gt;</code> 는 짧은 메서드에만. 뒤에 배울 람다식과 같은 화살표.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력 결과는?<pre><code>static void Change(int x) { x = 100; }\nstatic void Main()\n{\n    int a = 1;\n    Change(a);\n    Console.WriteLine(a);\n}</code></pre>', options: ['1', '100', '101', '컴파일 오류'], answer: 0, explain: '값 전달 — x 는 a 의 복사본이므로 a 는 1 그대로.',
            notes: '<p>정답 공개 후 “a 를 100 으로 만들려면?” → <code>a = Change(a);</code> 처럼 반환값 대입(반환형을 int 로 바꿔서). ref 는 다음 시간.</p>' },
          { layout: 'practice', title: '실습 6-1. 최댓값 메서드', desc: '<p><code>Max2(int a, int b)</code> 와 <code>Max3(int a, int b, int c)</code> 를 작성하세요. <code>Max3</code> 은 <code>Max2</code> 를 두 번 이용합니다.</p><pre>Max2(3, 7) = 7\nMax3(5, 12, 9) = 12</pre>', starter: `using System;

class Program
{
    // TODO: Max2, Max3 작성

    static void Main()
    {
        // Console.WriteLine($"Max2(3, 7) = {Max2(3, 7)}");
        // Console.WriteLine($"Max3(5, 12, 9) = {Max3(5, 12, 9)}");
    }
}`, solution: `using System;

class Program
{
    static int Max2(int a, int b) => a > b ? a : b;

    static int Max3(int a, int b, int c) => Max2(Max2(a, b), c);

    static void Main()
    {
        Console.WriteLine($"Max2(3, 7) = {Max2(3, 7)}");
        Console.WriteLine($"Max3(5, 12, 9) = {Max3(5, 12, 9)}");
    }
}`,
            notes: '<p><b>[7분]</b> 삼항 연산자 또는 if 로. 핵심은 <code>Max3</code> 에서 <b>메서드가 메서드를 부르는</b> 경험. 빨리 끝난 학생은 실습 6-2(구구단 · 합계)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['메서드 = 이름 붙인 코드 묶음: 중복 제거 · 분할 · 재사용', '<code>static 반환형 이름(매개변수) { 본문 }</code>, 값이 없으면 <code>void</code>', '<b>정의</b>는 한 번, <b>호출</b>은 여러 번 — 호출 → 실행 → 복귀', '매개변수(빈칸) vs 인수(실제 값), <code>return</code> 은 돌려주고 끝', '값 전달: 복사본이라 원본 불변 · 지역 변수는 메서드 안에서만', '<code>=&gt;</code> 식 본문 메서드'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 오버로딩 · ref/out · params · 재귀.</p>' }
        ]
      },

      /* ===================== ch06-2 ===================== */
      {
        id: 'ch06-2',
        title: '오버로딩 · ref/out · params · 재귀',
        minutes: 50,
        goals: [
          '같은 이름의 메서드를 매개변수만 다르게 여러 개 만들(오버로딩) 수 있다',
          '기본값 매개변수와 명명된 인수를 사용할 수 있다',
          'ref 와 out 의 차이를 설명하고 여러 값을 돌려받을 수 있다',
          'params 로 개수가 정해지지 않은 인수를 받을 수 있다',
          '기저 조건이 있는 재귀 메서드를 작성하고 호출 스택을 설명할 수 있다',
          '프로그램을 입력 · 처리 · 출력 메서드로 나누어 구조화할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['오버로딩 · 기본값 · 명명된 인수', 10], ['ref · out · params', 12], ['재귀 · 로컬 함수', 12], ['프로그램 구조화 · 퀴즈 · 실습', 11]],
        content: [
          { type: 'h', text: '메서드 오버로딩 (overloading) — 같은 이름, 다른 매개변수' },
          { type: 'p', html: '<code>Console.WriteLine</code> 은 정수를 넣어도, 실수를 넣어도, 문자열을 넣어도 동작합니다. 같은 이름의 메서드가 <b>매개변수의 개수나 자료형만 다르게</b> 여러 개 정의되어 있기 때문입니다. 이것을 <b>오버로딩(overloading, 중복 정의)</b>이라고 합니다. 컴파일러가 <b>인수를 보고</b> 어느 것을 부를지 자동으로 고릅니다. “문 열어” 한마디로 현관문도, 차 문도, 냉장고 문도 여는 것과 같습니다.' },
          { type: 'code', title: '예제 6-6. 메서드 오버로딩', code: `using System;

class Program
{
    static void Show(int n)        { Console.WriteLine(\$"정수: {n}"); }
    static void Show(double d)     { Console.WriteLine(\$"실수: {d}"); }
    static void Show(string s)     { Console.WriteLine(\$"문자열: {s}"); }

    static double Area(double r) => Math.PI * r * r;       // 원의 넓이 (매개변수 1개)
    static double Area(double w, double h) => w * h;       // 직사각형 넓이 (매개변수 2개)

    static void Main()
    {
        Show(10);          // int 버전
        Show(3.5);         // double 버전
        Show("안녕");      // string 버전
        Console.WriteLine(\$"원 넓이: {Area(1.0):F2}");
        Console.WriteLine(\$"직사각형 넓이: {Area(3, 4)}");
    }
}`, expect: `정수: 10
실수: 3.5
문자열: 안녕
원 넓이: 3.14
직사각형 넓이: 12`, desc: '이름은 모두 <code>Show</code> 지만 인수의 자료형에 따라 다른 메서드가 실행됩니다. <code>Area(3, 4)</code> 는 <code>int</code> 인수지만 <code>double</code> 로 자동 변환(암시적 변환)되어 두 매개변수 버전이 선택됩니다. 하는 일이 같은데 자료형이나 개수만 다를 때 오버로딩을 쓰면 이름을 여러 개 외울 필요가 없습니다.' },
          { type: 'callout', kind: 'warn', title: '반환형만 다르면 오버로딩이 안 됩니다', html: '<code>static int Get()</code> 과 <code>static double Get()</code> 처럼 <b>매개변수는 같고 반환형만 다른</b> 메서드는 함께 정의할 수 없습니다(오류 CS0111). 호출문 <code>Get()</code> 만 보고는 어느 것인지 구분할 수 없기 때문입니다. 오버로딩의 기준은 <b>매개변수 목록(개수 · 자료형 · 순서)</b>뿐입니다.' },
          { type: 'h', text: '기본값 매개변수와 명명된 인수' },
          { type: 'p', html: '매개변수에 <b><code>= 기본값</code></b> 을 붙이면 호출할 때 그 인수를 <b>생략</b>할 수 있습니다(<b>선택적 매개변수</b>). 기본값이 있는 매개변수는 목록의 <b>뒤쪽</b>에 있어야 합니다. 또 호출할 때 <b><code>이름: 값</code></b> 형식으로 <b>이름을 지정</b>하면(<b>명명된 인수</b>) 순서와 상관없이 원하는 매개변수에만 값을 넣을 수 있습니다.' },
          { type: 'code', title: '예제 6-7. 기본값 매개변수와 명명된 인수', code: `using System;

class Program
{
    // count 와 takeout 은 생략 가능 (기본값 1, false)
    static void Order(string menu, int count = 1, bool takeout = false)
    {
        string where = takeout ? "포장" : "매장";
        Console.WriteLine(\$"{menu} {count}잔 ({where})");
    }

    static void Main()
    {
        Order("아메리카노");                 // count = 1, takeout = false
        Order("라떼", 2);                    // takeout = false
        Order("모카", 3, true);
        Order("녹차", takeout: true);        // count 는 건너뛰고 takeout 만 지정
        Order(count: 5, menu: "콜드브루");   // 이름을 쓰면 순서도 자유
    }
}`, expect: `아메리카노 1잔 (매장)
라떼 2잔 (매장)
모카 3잔 (포장)
녹차 1잔 (포장)
콜드브루 5잔 (매장)`, desc: '<code>Order("녹차", takeout: true)</code> 처럼 중간 매개변수를 건너뛰려면 명명된 인수가 필요합니다. 기본값이 있으면 오버로딩을 여러 개 만들지 않아도 됩니다. <code>Console.WriteLine</code> 처럼 <b>“대부분은 기본값, 가끔만 바꾸는”</b> 옵션에 잘 어울립니다.' },
          { type: 'h', text: 'ref 와 out — 원본을 바꾸고, 여러 값을 돌려받기' },
          { type: 'p', html: '지난 시간에 본 것처럼 인수는 <b>복사</b>되어 넘어가므로 메서드 안에서 원본을 바꿀 수 없었습니다. 원본 변수 <b>자체</b>를 넘기려면 <b><code>ref</code></b> 를 붙입니다(참조 전달). 복사본이 아니라 <b>원본이 있는 자리</b>를 알려 주는 것이어서, 메서드 안에서 바꾸면 원본이 바뀝니다. <b><code>out</code></b> 은 “메서드가 <b>값을 내보내는</b> 전용 통로”입니다. <code>return</code> 은 값을 하나만 돌려줄 수 있지만 <code>out</code> 매개변수를 쓰면 <b>여러 값</b>을 돌려받을 수 있습니다.' },
          { type: 'table', head: ['', '<code>ref</code>', '<code>out</code>'], rows: [
            ['목적', '원본 변수를 <b>읽고 바꾼다</b>', '메서드가 <b>값을 내보낸다</b> (여러 값 반환)'],
            ['호출 전 초기화', '<b>필수</b> (읽을 수 있어야 하므로)', '필요 없음 (<code>out int q</code> 처럼 그 자리에서 선언 가능)'],
            ['메서드 안에서 대입', '해도 되고 안 해도 됨', '<b>반드시</b> 해야 함 (안 하면 CS0177)'],
            ['호출문', '<code>Swap(ref a, ref b)</code>', '<code>Divide(17, 5, out int q, out int r)</code>'],
            ['대표 예', '두 값 교환 <code>Swap</code>', '<code>int.TryParse(s, out int n)</code>']
          ], caption: '정의할 때와 호출할 때 모두 ref / out 을 써야 한다' },
          { type: 'code', title: '예제 6-8. ref 로 원본 바꾸기, out 으로 두 값 돌려받기', code: `using System;

class Program
{
    static void AddTen(ref int x)          // x 는 복사본이 아니라 원본 그 자체
    {
        x += 10;
    }

    static void Divide(int a, int b, out int quotient, out int remainder)
    {
        quotient = a / b;                  // out 매개변수는 반드시 값을 넣어야 한다
        remainder = a % b;
    }

    static void Main()
    {
        int num = 5;
        AddTen(ref num);                   // 호출할 때도 ref
        Console.WriteLine(\$"num = {num}");

        Divide(17, 5, out int q, out int r);   // 값을 두 개 돌려받는다
        Console.WriteLine(\$"17 ÷ 5 = 몫 {q}, 나머지 {r}");

        // int.TryParse 가 바로 이 방식: 성공 여부는 return, 변환된 값은 out
        if (int.TryParse("123", out int value))
            Console.WriteLine(\$"변환 성공: {value + 1}");
    }
}`, expect: `num = 15
17 ÷ 5 = 몫 3, 나머지 2
변환 성공: 124`, desc: '예제 6-5 의 <code>AddTen(int x)</code> 는 원본을 못 바꿨지만, <code>ref int x</code> 는 <code>num</code> 이 15 가 됩니다. 2장에서 쓴 <code>int.TryParse</code> 의 <code>out int n</code> 이 바로 이것입니다 — “변환이 됐는지”는 <code>bool</code> 로 반환하고, “변환된 값”은 <code>out</code> 으로 내보냅니다.' },
          { type: 'callout', kind: 'tip', title: 'ref / out 은 꼭 필요할 때만', html: '결과가 하나면 <code>return</code>, 원본을 바꾸는 것이 목적일 때만 <code>ref</code>, 여러 값을 돌려줄 때 <code>out</code> 을 쓰세요. 값이 여러 개일 때는 <b>튜플</b> <code>(int q, int r) Divide(int a, int b) => (a / b, a % b);</code> 로 돌려주는 방법도 있습니다(7장). 호출하는 쪽에서 <code>ref</code>/<code>out</code> 을 반드시 함께 써야 하므로, 읽는 사람이 “아, 이 변수가 바뀌는구나” 를 바로 알 수 있습니다.' },
          { type: 'h', text: 'params — 개수가 정해지지 않은 인수' },
          { type: 'p', html: '합계를 구하는 메서드에 값을 2개 넣을 수도, 5개 넣을 수도 있게 하려면? 마지막 매개변수에 <b><code>params 자료형[]</code></b> 을 붙이면 <b>인수를 0개부터 몇 개든</b> 쉼표로 나열해 넘길 수 있습니다. 메서드 안에서는 그 값들이 <b>배열</b>(7장)로 묶여 들어오며, <code>foreach</code> 로 하나씩 꺼내 쓸 수 있습니다.' },
          { type: 'code', title: '예제 6-9. params 가변 인수', code: `using System;

class Program
{
    static int Sum(params int[] numbers)       // 0개 이상의 int 를 받는다
    {
        int total = 0;
        foreach (int n in numbers)             // numbers 는 배열: 하나씩 꺼내 더한다
            total += n;
        return total;
    }

    static void PrintAll(string title, params string[] items)   // params 는 마지막에만
    {
        Console.WriteLine(\$"{title}({items.Length}개): {string.Join(", ", items)}");
    }

    static void Main()
    {
        Console.WriteLine(Sum());
        Console.WriteLine(Sum(1, 2, 3));
        Console.WriteLine(Sum(10, 20, 30, 40, 50));
        PrintAll("과일", "사과", "배", "포도");
        PrintAll("채소", "당근");
    }
}`, expect: `0
6
150
과일(3개): 사과, 배, 포도
채소(1개): 당근`, desc: '<code>params</code> 는 매개변수 목록의 <b>맨 마지막</b>에 하나만 쓸 수 있습니다. <code>items.Length</code> 는 넘어온 개수, <code>string.Join(", ", items)</code> 는 요소들을 쉼표로 이어 붙입니다. <code>Console.WriteLine("{0} {1}", a, b)</code> 의 뒷부분도 <code>params object[]</code> 입니다. 배열은 7장에서 본격적으로 배웁니다.' },
          { type: 'h', text: '재귀 (recursion) — 자기 자신을 호출하는 메서드' },
          { type: 'p', html: '메서드는 <b>자기 자신을 호출</b>할 수도 있습니다. 이를 <b>재귀 호출</b>이라고 합니다. 팩토리얼 <code>5! = 5 × 4 × 3 × 2 × 1</code> 은 <code>5 × 4!</code> 로, <code>4!</code> 은 다시 <code>4 × 3!</code> 로… 같은 모양의 <b>더 작은 문제</b>로 줄어듭니다. 재귀 메서드는 반드시 두 부분으로 이루어집니다.' },
          { type: 'list', items: [
            '<b>기저 조건(base case)</b>: 더 이상 자신을 부르지 않고 <b>바로 답을 돌려주는</b> 경우. <code>1! = 1</code>. <b>없으면 끝없이 호출</b>되어 프로그램이 죽습니다.',
            '<b>재귀 단계(recursive step)</b>: 문제를 <b>조금 작게</b> 만들어 자신을 부르고, 그 결과로 답을 만드는 경우. <code>n! = n × (n-1)!</code>'
          ] },
          { type: 'figure', html: SVG_STACK, caption: 'Factorial(4) — 호출이 쌓였다가(①~④) 기저 조건에서 값이 돌아오며 차례로 풀린다' },
          { type: 'code', title: '예제 6-10. 팩토리얼과 피보나치 수열', code: `using System;

class Program
{
    static long Factorial(int n)
    {
        if (n <= 1) return 1;                  // 기저 조건: 1! = 0! = 1
        return n * Factorial(n - 1);           // 재귀 단계: n × (n-1)!
    }

    static int Fibonacci(int n)                // 0, 1, 1, 2, 3, 5, 8 … (앞 두 항의 합)
    {
        if (n <= 1) return n;                  // 기저 조건: F(0) = 0, F(1) = 1
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }

    static void Main()
    {
        Console.WriteLine(\$"5! = {Factorial(5)}");
        Console.WriteLine(\$"10! = {Factorial(10)}");
        Console.WriteLine(\$"20! = {Factorial(20)}");   // int 범위를 넘어 long 을 썼다

        Console.Write("피보나치:");
        for (int i = 0; i < 10; i++)
            Console.Write(" " + Fibonacci(i));
        Console.WriteLine();
    }
}`, expect: `5! = 120
10! = 3628800
20! = 2432902008176640000
피보나치: 0 1 1 2 3 5 8 13 21 34`, desc: '<code>Factorial(5)</code> 는 <code>5 × Factorial(4)</code> 를 계산하려고 <code>Factorial(4)</code> 를 부르고, 그것은 다시 <code>Factorial(3)</code> 을… <code>Factorial(1)</code> 이 1 을 돌려주는 순간부터 위 그림처럼 차례로 곱해지며 돌아옵니다. 재귀는 반복문으로도 쓸 수 있지만, 트리 탐색 · 폴더 검색 · 분할 정복처럼 <b>문제가 같은 모양의 작은 문제로 나뉠 때</b> 재귀가 훨씬 자연스럽습니다.' },
          { type: 'callout', kind: 'warn', title: '기저 조건이 없으면 StackOverflowException', html: '메서드를 호출할 때마다 매개변수와 지역 변수가 <b>호출 스택(call stack)</b>이라는 메모리에 쌓입니다. 기저 조건이 없거나 문제가 작아지지 않으면 스택이 넘쳐 <code>StackOverflowException</code> 으로 프로그램이 강제 종료됩니다(이 예외는 <code>try/catch</code> 로도 잡을 수 없습니다). 재귀를 쓸 때는 “<b>언제 멈추는가</b>” 를 먼저 쓰세요. 또 <code>Fibonacci(40)</code> 처럼 같은 계산을 수없이 반복하는 재귀는 매우 느립니다 — 이런 경우는 반복문이 낫습니다.' },
          { type: 'h', text: '로컬 함수 (local function)' },
          { type: 'p', html: 'C# 7 부터는 <b>메서드 안에 메서드</b>를 정의할 수 있습니다. 이를 <b>로컬 함수</b>라고 하며, 그 메서드 안에서만 쓰는 작은 도우미를 만들 때 씁니다. 바깥 클래스에 이름을 늘어놓지 않아 깔끔하고, 로컬 함수는 자신을 감싼 메서드의 지역 변수를 <b>그대로 읽을 수</b> 있습니다.' },
          { type: 'code', title: '추가 예제. Main 안에서만 쓰는 로컬 함수', code: `using System;

class Program
{
    static void Main()
    {
        int passLine = 70;                         // 로컬 함수가 이 변수를 읽는다

        Console.WriteLine(ToGrade(95));
        Console.WriteLine(ToGrade(72));
        Console.WriteLine(ToGrade(40));

        // 로컬 함수: Main 안에서 정의 (static 은 필요 없다). 정의 위치는 호출보다 뒤여도 된다
        string ToGrade(int score)
        {
            if (score < passLine) return "F";
            if (score >= 90) return "A";
            if (score >= 80) return "B";
            return "C";
        }
    }
}`, expect: `A
C
F`, desc: '<code>ToGrade</code> 는 <code>Main</code> 밖에서는 보이지 않습니다. 다른 메서드에서도 써야 하는 기능이라면 지금까지처럼 클래스에 <code>static</code> 메서드로 만드세요.' },
          { type: 'h', text: '정적 메서드와 Main 의 관계' },
          { type: 'p', html: '이 장의 메서드에는 모두 <code>static</code> 이 붙어 있습니다. <code>static</code>(정적) 메서드는 <b>객체를 만들지 않아도</b> “<code>클래스이름.메서드</code>” 로 호출할 수 있는 메서드입니다. <code>Math.Sqrt(16)</code>, <code>int.Parse("3")</code>, <code>Console.WriteLine(…)</code> 이 모두 그렇습니다. 프로그램이 시작될 때는 아직 어떤 객체도 없으므로 <b><code>Main</code> 은 반드시 <code>static</code></b> 이고, <code>static</code> 인 <code>Main</code> 에서 같은 클래스의 메서드를 바로 부르려면 그 메서드도 <code>static</code> 이어야 합니다(같은 클래스 안에서는 <code>Program.Add(1, 2)</code> 대신 <code>Add(1, 2)</code> 로 줄여 씁니다). <code>static</code> 이 없는 <b>인스턴스 메서드</b>는 객체를 만든 뒤 호출하는데, 8장에서 배웁니다.' },
          { type: 'h', text: '메서드로 프로그램 구조화 — 입력 · 처리 · 출력' },
          { type: 'p', html: '실제 프로그램은 <b>입력받기 → 계산하기 → 출력하기</b> 의 반복입니다. 이 세 가지를 각각 메서드로 나누면 <code>Main</code> 은 “줄거리”만 남아 한눈에 읽히고, 계산 부분은 입력 방식과 상관없이 따로 시험하거나 다른 곳에 재사용할 수 있습니다.' },
          { type: 'code', title: '추가 예제. BMI 계산기 — 입력 · 처리 · 출력 메서드로 나누기', code: `using System;

class Program
{
    // [입력] 안내문을 보여 주고 정수를 읽는다
    static int ReadInt(string prompt)
    {
        Console.Write(prompt);
        return int.Parse(Console.ReadLine());
    }

    // [처리] 계산만 한다 — 입출력과 무관하므로 어디서나 재사용 가능
    static double CalcBmi(double weightKg, double heightCm)
    {
        double m = heightCm / 100;
        return weightKg / (m * m);
    }

    static string Judge(double bmi)
    {
        if (bmi < 18.5) return "저체중";
        if (bmi < 23) return "정상";
        if (bmi < 25) return "과체중";
        return "비만";
    }

    // [출력]
    static void PrintResult(double bmi, string judge)
    {
        Console.WriteLine(\$"BMI: {bmi:F1} ({judge})");
    }

    static void Main()                              // 줄거리만 남는다
    {
        int weight = ReadInt("몸무게(kg): ");
        int height = ReadInt("키(cm): ");
        double bmi = CalcBmi(weight, height);
        PrintResult(bmi, Judge(bmi));
    }
}`, stdin: '70\n175\n', expect: `몸무게(kg): 키(cm): BMI: 22.9 (정상)`, desc: '<code>Main</code> 네 줄만 읽어도 프로그램이 무엇을 하는지 알 수 있습니다. <code>ReadInt</code> 는 안내문만 바꿔 두 번 재사용했고, <code>CalcBmi</code> · <code>Judge</code> 는 콘솔과 무관하므로 나중에 WPF 화면(Part 2)에서도 그대로 쓸 수 있습니다. <b>메서드 하나는 한 가지 일</b>만 하게 만드는 것이 좋은 설계의 출발점입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 메서드 이름 짓기와 크기', html: '<ul><li>이름은 <b>동사 + 목적어</b>: <code>ReadInt</code>, <code>CalcBmi</code>, <code>PrintResult</code>. <code>bool</code> 을 돌려주면 <code>Is…</code>/<code>Has…</code>.</li><li>한 메서드가 화면 한 페이지(20~30줄)를 넘으면 나눌 곳을 찾아보세요.</li><li>“이 메서드는 ~하고 ~한다” 처럼 설명에 <b>‘그리고’</b> 가 들어가면 두 개로 나눌 신호입니다.</li><li>매개변수가 5개를 넘으면 관련 값을 묶은 클래스(8장)를 넘기는 편이 낫습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 6-3. 두 값 교환 Swap(ref, ref)',
            level: 2,
            desc: '<p>두 정수 변수의 값을 서로 바꾸는 <code>Swap(ref int a, ref int b)</code> 메서드를 작성하고, <code>Main</code> 에서 호출해 확인하세요. (2장 실습에서 <code>Main</code> 안에 직접 썼던 교환 코드를 메서드로 옮기는 것입니다.)</p><pre>바꾸기 전: a = 3, b = 7\n바꾼 후: a = 7, b = 3</pre>',
            hint: '<code>int temp = a; a = b; b = temp;</code> — 호출할 때도 <code>Swap(ref x, ref y);</code> 처럼 <code>ref</code> 를 붙입니다. <code>ref</code> 를 빼면 복사본만 바뀌어 원본은 그대로입니다.',
            starter: `using System;

class Program
{
    // TODO: Swap(ref int a, ref int b) 작성

    static void Main()
    {
        int x = 3, y = 7;
        Console.WriteLine($"바꾸기 전: a = {x}, b = {y}");
        // TODO: Swap 호출 (ref 를 붙여서)
        Console.WriteLine($"바꾼 후: a = {x}, b = {y}");
    }
}
`,
            solution: `using System;

class Program
{
    static void Swap(ref int a, ref int b)
    {
        int temp = a;
        a = b;
        b = temp;
    }

    static void Main()
    {
        int x = 3, y = 7;
        Console.WriteLine(\$"바꾸기 전: a = {x}, b = {y}");
        Swap(ref x, ref y);
        Console.WriteLine(\$"바꾼 후: a = {x}, b = {y}");
    }
}
`,
            expect: `바꾸기 전: a = 3, b = 7
바꾼 후: a = 7, b = 3`
          },
          {
            title: '실습 6-4. 최대공약수 재귀 메서드',
            level: 3,
            desc: '<p>두 양의 정수를 입력받아 <b>재귀</b>로 최대공약수를 구하는 <code>Gcd(int a, int b)</code> 를 작성하세요. 유클리드 호제법: <code>b</code> 가 0 이면 답은 <code>a</code>, 아니면 <code>Gcd(b, a % b)</code>. 최소공배수는 <code>a × b / 최대공약수</code> 로 구해 함께 출력합니다.</p><pre>첫 번째 수: 48\n두 번째 수: 18\n최대공약수: 6\n최소공배수: 144</pre><p>(입력한 값은 콘솔 출력에는 나타나지 않습니다.)</p>',
            hint: '기저 조건 <code>if (b == 0) return a;</code> 를 먼저 쓰고, 재귀 단계 <code>return Gcd(b, a % b);</code>. 예: Gcd(48, 18) → Gcd(18, 12) → Gcd(12, 6) → Gcd(6, 0) → 6',
            starter: `using System;

class Program
{
    // TODO: Gcd(int a, int b) — 재귀로 최대공약수

    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        // TODO: 최대공약수 · 최소공배수 출력
    }
}
`,
            solution: `using System;

class Program
{
    static int Gcd(int a, int b)
    {
        if (b == 0) return a;          // 기저 조건
        return Gcd(b, a % b);          // 재귀 단계
    }

    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        int g = Gcd(a, b);
        Console.WriteLine(\$"최대공약수: {g}");
        Console.WriteLine(\$"최소공배수: {a * b / g}");
    }
}
`,
            stdin: '48\n18\n',
            expect: `첫 번째 수: 두 번째 수: 최대공약수: 6
최소공배수: 144`
          }
        ],
        quiz: [
          { q: '메서드 오버로딩이 성립하려면 같은 이름의 메서드끼리 무엇이 달라야 하나요?', options: ['반환형', '매개변수의 개수나 자료형', '메서드 이름', '<code>static</code> 여부'], answer: 1, explain: '오버로딩의 기준은 매개변수 목록뿐입니다. 반환형만 다르면 오류(CS0111).' },
          { q: '다음 코드의 출력 결과는?<pre><code>static void Twice(ref int x)\n{\n    x *= 2;\n}\nstatic void Main()\n{\n    int n = 4;\n    Twice(ref n);\n    Console.WriteLine(n);\n}</code></pre>', options: ['4', '컴파일 오류', '0', '8'], answer: 3, explain: '<code>ref</code> 는 원본 자체를 넘기므로 <code>n</code> 이 8 로 바뀝니다. <code>ref</code> 가 없었다면 4.' },
          { q: '<code>out</code> 매개변수에 대한 설명으로 <b>옳은</b> 것은?', options: ['메서드 안에서 반드시 값을 넣어야 하고, 호출 쪽은 초기화하지 않아도 된다', '호출하기 전에 반드시 값을 넣어 두어야 한다', '값의 복사본이 전달된다', '메서드당 하나만 쓸 수 있다'], answer: 0, explain: '<code>out</code> 은 값을 내보내는 통로입니다. 메서드가 값을 안 넣으면 CS0177, 호출 쪽은 <code>out int q</code> 로 그 자리에서 선언해도 됩니다.' },
          { q: '다음 코드의 출력 결과는?<pre><code>static int Count(params int[] a) =&gt; a.Length;\n\nstatic void Main()\n{\n    Console.WriteLine(Count(1, 2, 3) + Count());\n}</code></pre>', options: ['컴파일 오류', '4', '3', '6'], answer: 2, explain: '<code>params</code> 는 0개도 받을 수 있습니다. 3 + 0 = 3.' },
          { q: '재귀 메서드에 기저 조건(base case)이 없으면 어떻게 되나요?', options: ['0 을 반환하고 끝난다', '호출이 끝없이 쌓여 StackOverflowException 으로 멈춘다', '컴파일 오류가 난다', '한 번만 실행되고 끝난다'], answer: 1, explain: '컴파일러는 막아 주지 않습니다. 실행 중 호출 스택이 넘쳐 프로그램이 강제 종료됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '오버로딩 · ref/out · params · 재귀', subtitle: 'Chapter 06 · Section 02 — 메서드를 더 유연하게', badge: '06-2',
            notes: '<p><b>[도입 3분]</b> 복습 발문: “값 전달에서 메서드 안에서 바꾼 값은 원본에 영향을 주나?” → 아니오. “그럼 원본을 바꾸고 싶으면?” → 오늘 배울 ref.</p><p>“Console.WriteLine 은 int 도 string 도 받는데 어떻게?” → 오버로딩.</p>' },
          { layout: 'code', title: '예제 6-6. 오버로딩 — 같은 이름, 다른 매개변수', code: `using System;

class Program
{
    static void Show(int n)    { Console.WriteLine($"정수: {n}"); }
    static void Show(double d) { Console.WriteLine($"실수: {d}"); }
    static void Show(string s) { Console.WriteLine($"문자열: {s}"); }

    static double Area(double r) => Math.PI * r * r;    // 원
    static double Area(double w, double h) => w * h;    // 직사각형

    static void Main()
    {
        Show(10);
        Show(3.5);
        Show("안녕");
        Console.WriteLine($"{Area(1.0):F2}  {Area(3, 4)}");
    }
}`, points: ['컴파일러가 <b>인수를 보고</b> 골라 준다', '기준은 <b>매개변수 목록</b>(개수 · 자료형 · 순서)', '반환형만 다르면 ✗ (CS0111)'],
            notes: '<p><b>[6분]</b> “문 열어” 비유. 실행 후 <code>Show(true)</code> 를 추가해 맞는 버전이 없을 때의 오류(CS1503)를 보여 주세요.</p><p>발문: “Area(3, 4) 는 int 인데 왜 double 버전이 불릴까?” → 암시적 변환.</p>' },
          { layout: 'code', title: '예제 6-7. 기본값 매개변수 · 명명된 인수', code: `using System;

class Program
{
    static void Order(string menu, int count = 1, bool takeout = false)
    {
        string where = takeout ? "포장" : "매장";
        Console.WriteLine($"{menu} {count}잔 ({where})");
    }

    static void Main()
    {
        Order("아메리카노");               // 기본값 사용
        Order("라떼", 2);
        Order("모카", 3, true);
        Order("녹차", takeout: true);      // 중간 건너뛰기
        Order(count: 5, menu: "콜드브루"); // 순서 자유
    }
}`, points: ['<code>= 기본값</code> 이 있으면 생략 가능', '기본값 매개변수는 <b>뒤쪽</b>에', '<code>이름: 값</code> 으로 원하는 것만 지정'],
            notes: '<p><b>[5분]</b> 커피 주문 비유 — 대부분 1잔 매장, 가끔만 다르게. 기본값 매개변수를 앞에 두면 오류(CS1737)가 나는 것도 시연.</p>' },
          { layout: 'table', title: 'ref 와 out', head: ['', '<code>ref</code>', '<code>out</code>'], rows: [['목적', '원본을 <b>읽고 바꾼다</b>', '값을 <b>내보낸다</b> (여러 값 반환)'], ['호출 전 초기화', '필수', '필요 없음'], ['메서드 안 대입', '선택', '<b>필수</b>'], ['호출문', '<code>Swap(ref a, ref b)</code>', '<code>Divide(17, 5, out int q, out int r)</code>'], ['대표 예', '두 값 교환', '<code>int.TryParse(s, out int n)</code>']],
            lead: '정의할 때와 호출할 때 모두 ref / out 을 쓴다',
            notes: '<p><b>[4분]</b> 값 전달(복사본)과 대비. “ref 는 원본이 있는 자리를 알려 주는 것”. 2장의 TryParse 가 out 이었음을 상기.</p>' },
          { layout: 'code', title: '예제 6-8. ref 로 원본 바꾸기, out 으로 두 값 받기', code: `using System;

class Program
{
    static void AddTen(ref int x) { x += 10; }     // 원본이 바뀐다

    static void Divide(int a, int b, out int q, out int r)
    {
        q = a / b;                                 // out 은 반드시 대입
        r = a % b;
    }

    static void Main()
    {
        int num = 5;
        AddTen(ref num);
        Console.WriteLine(num);                    // 15

        Divide(17, 5, out int q, out int r);
        Console.WriteLine($"몫 {q}, 나머지 {r}");

        if (int.TryParse("123", out int v))
            Console.WriteLine(v + 1);
    }
}`, points: ['<code>ref</code> 를 빼면? → 5 (복사본)', '<code>out</code> 으로 return 하나 + 값 여러 개', '<code>TryParse</code> = bool 반환 + out 값'],
            notes: '<p><b>[6분]</b> <code>ref</code> 를 지우고 실행해 5 가 나오는 것과 비교. <code>Divide</code> 에서 r 대입을 지워 CS0177 도 보여 주세요.</p>' },
          { layout: 'code', title: '예제 6-9. params 가변 인수', code: `using System;

class Program
{
    static int Sum(params int[] numbers)     // 0개 이상
    {
        int total = 0;
        foreach (int n in numbers) total += n;
        return total;
    }

    static void Main()
    {
        Console.WriteLine(Sum());
        Console.WriteLine(Sum(1, 2, 3));
        Console.WriteLine(Sum(10, 20, 30, 40, 50));
    }
}`, points: ['인수를 <b>몇 개든</b> 쉼표로', '안에서는 <b>배열</b>로 받는다 (7장)', '매개변수 목록의 <b>맨 마지막</b>에 하나만'],
            notes: '<p><b>[4분]</b> <code>Console.WriteLine("{0} {1}", a, b)</code> 도 params 임을 언급. 배열은 다음 장에서 자세히 — 여기서는 foreach 로 하나씩 꺼내는 정도만.</p>' },
          { layout: 'diagram', title: '재귀 — 호출 스택', html: SVG_STACK, caption: '기저 조건까지 쌓였다가 위에서부터 값을 돌려주며 풀린다',
            notes: '<p><b>[6분]</b> 아래(Main)에서 위로 호출이 쌓이고, 위(기저 조건)에서 아래로 값이 돌아오는 것을 손으로 따라가며 설명. 발문: “기저 조건이 없으면?” → 스택이 넘친다.</p><p>비유: 러시아 인형(마트료시카) — 가장 작은 인형까지 열었다가 다시 닫는다.</p>' },
          { layout: 'code', title: '예제 6-10. 팩토리얼 · 피보나치', code: `using System;

class Program
{
    static long Factorial(int n)
    {
        if (n <= 1) return 1;                // 기저 조건
        return n * Factorial(n - 1);         // 재귀 단계
    }

    static int Fibonacci(int n)
    {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }

    static void Main()
    {
        Console.WriteLine(Factorial(5));     // 120
        Console.WriteLine(Factorial(20));    // long 필요
        Console.Write("피보나치:");
        for (int i = 0; i < 10; i++)
            Console.Write(" " + Fibonacci(i));
        Console.WriteLine();
    }
}`, points: ['<b>기저 조건</b>을 먼저 쓴다', '문제를 <b>조금 작게</b> 만들어 자신을 부른다', '기저 조건 없음 → StackOverflowException'],
            notes: '<p><b>[6분]</b> Factorial(5) 를 칠판에 풀어 씁니다. 기저 조건 줄을 주석 처리하고 실행해 StackOverflow 를 보여 주면 강렬합니다(브라우저 콘솔에서는 오류 메시지가 다를 수 있음). Fibonacci(40) 이 느린 이유는 같은 계산의 반복 — 반복문 예고.</p>' },
          { layout: 'code', title: '메서드로 프로그램 구조화 — 입력 · 처리 · 출력', code: `using System;

class Program
{
    static int ReadInt(string prompt)                       // [입력]
    {
        Console.Write(prompt);
        return int.Parse(Console.ReadLine());
    }
    static double CalcBmi(double kg, double cm)             // [처리]
        => kg / (cm / 100 * (cm / 100));
    static string Judge(double bmi)
        => bmi < 18.5 ? "저체중" : bmi < 23 ? "정상" : bmi < 25 ? "과체중" : "비만";
    static void PrintResult(double bmi)                     // [출력]
        => Console.WriteLine($"BMI: {bmi:F1} ({Judge(bmi)})");

    static void Main()                                      // 줄거리만
    {
        int weight = ReadInt("몸무게(kg): ");
        int height = ReadInt("키(cm): ");
        PrintResult(CalcBmi(weight, height));
    }
}`, stdin: '70\n175\n', points: ['<code>Main</code> 은 줄거리, 세부는 메서드로', '계산 메서드는 콘솔과 무관 → WPF 에서도 재사용', '메서드 하나 = 한 가지 일, 이름은 동사+목적어', '모두 <code>static</code>: <code>Main</code> 이 static 이므로'],
            notes: '<p><b>[5분]</b> Main 만 읽어도 프로그램이 보인다는 점을 강조. “Main 은 왜 static 인가?” → 시작 시점엔 객체가 없다(8장 예고). 로컬 함수(메서드 안의 메서드)도 한 줄로 소개.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력 결과는?<pre><code>static void Twice(ref int x) { x *= 2; }\nstatic void Main()\n{\n    int n = 4;\n    Twice(ref n);\n    Console.WriteLine(n);\n}</code></pre>', options: ['4', '컴파일 오류', '0', '8'], answer: 3, explain: 'ref 는 원본 자체를 넘기므로 n 이 8 이 됩니다.',
            notes: '<p>정답 공개 후 “ref 를 빼면?” → 4. “호출문에서만 ref 를 빼면?” → 컴파일 오류 CS1620.</p>' },
          { layout: 'practice', title: '실습 6-3. Swap(ref, ref)', desc: '<p>두 정수 변수의 값을 서로 바꾸는 <code>Swap(ref int a, ref int b)</code> 를 작성하고 호출해 <code>a = 7, b = 3</code> 을 만드세요.</p>', starter: `using System;

class Program
{
    // TODO: Swap(ref int a, ref int b)

    static void Main()
    {
        int x = 3, y = 7;
        // TODO: Swap 호출
        Console.WriteLine($"a = {x}, b = {y}");
    }
}`, solution: `using System;

class Program
{
    static void Swap(ref int a, ref int b)
    {
        int temp = a;
        a = b;
        b = temp;
    }

    static void Main()
    {
        int x = 3, y = 7;
        Swap(ref x, ref y);
        Console.WriteLine($"a = {x}, b = {y}");
    }
}`,
            notes: '<p><b>[7분]</b> 2장 실습(swap)을 메서드로 옮기는 것. 흔한 실수: 정의에만 ref 를 쓰고 호출에 빠뜨림(CS1620). 빨리 끝난 학생은 실습 6-4(최대공약수 재귀)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<b>오버로딩</b>: 같은 이름, 다른 매개변수 목록 (반환형만 다르면 ✗)', '<b>기본값</b> <code>int count = 1</code> · <b>명명된 인수</b> <code>takeout: true</code>', '<b>ref</b> 원본 변경 · <b>out</b> 여러 값 반환 (<code>TryParse</code>) — 호출에도 붙인다', '<b>params</b> 로 인수 개수 자유 (마지막에 하나만)', '<b>재귀</b> = 기저 조건 + 작아지는 재귀 단계, 호출 스택', '입력 · 처리 · 출력으로 나누면 <code>Main</code> 은 줄거리만'],
            notes: '<p>다음 시간: 배열과 컬렉션 — 값 여러 개를 한 이름으로. params 에서 잠깐 본 배열을 본격적으로.</p>' }
        ]
      }
    ]
  });
})();
