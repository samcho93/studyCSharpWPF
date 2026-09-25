/* Chapter 03. 연산자와 식 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_INC = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="후위 증감과 전위 증감의 차이">
  <defs><marker id="ah3a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="330" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">후위 a++ : 먼저 쓰고, 나중에 1 증가</text>
  <text x="950" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">전위 ++c : 먼저 1 증가하고, 그 다음 쓴다</text>
  <text x="330" y="100" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">int a = 5;   int b = a++;</text>
  <text x="950" y="100" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">int c = 5;   int d = ++c;</text>
  <rect x="80" y="140" width="500" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="330" y="184" text-anchor="middle" style="font-size:23px;fill:var(--fg)"><tspan font-weight="700" fill="var(--accent)">①</tspan> a 의 현재 값 5 를 b 에 넣는다  →  b = 5</text>
  <line x1="330" y1="215" x2="330" y2="250" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah3a)"/>
  <rect x="80" y="260" width="500" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="330" y="304" text-anchor="middle" style="font-size:23px;fill:var(--fg)"><tspan font-weight="700" fill="var(--accent)">②</tspan> 그 다음 a 를 1 증가시킨다  →  a = 6</text>
  <rect x="700" y="140" width="500" height="70" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="950" y="184" text-anchor="middle" style="font-size:23px;fill:var(--fg)"><tspan font-weight="700" fill="var(--accent2)">①</tspan> 먼저 c 를 1 증가시킨다  →  c = 6</text>
  <line x1="950" y1="215" x2="950" y2="250" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah3a)"/>
  <rect x="700" y="260" width="500" height="70" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="950" y="304" text-anchor="middle" style="font-size:23px;fill:var(--fg)"><tspan font-weight="700" fill="var(--accent2)">②</tspan> 증가된 값 6 을 d 에 넣는다  →  d = 6</text>
  <g>
    <rect x="180" y="370" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="245" y="362" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">a</text>
    <text x="245" y="422" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">6</text>
    <rect x="350" y="370" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="415" y="362" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">b</text>
    <text x="415" y="422" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--accent)">5</text>
    <rect x="800" y="370" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="865" y="362" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">c</text>
    <text x="865" y="422" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">6</text>
    <rect x="970" y="370" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="1035" y="362" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">d</text>
    <text x="1035" y="422" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--accent2)">6</text>
  </g>
  <line x1="640" y1="80" x2="640" y2="460" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="640" y="500" text-anchor="middle" style="font-size:24px;fill:var(--fg)">a 와 c 는 둘 다 6 이 된다 — 차이는 <tspan font-weight="700">그 값을 다른 곳에 쓸 때</tspan> 옛 값(5)이냐 새 값(6)이냐</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:22px;fill:var(--muted)">한 줄에 혼자 쓰이면(i++;  ++i;) 결과는 완전히 같다</text>
</svg>`;

  const SVG_PREC = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="연산자 우선순위 사다리와 계산 순서 예">
  <defs><marker id="ah3b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker></defs>
  <text x="300" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">우선순위 사다리 (위가 먼저)</text>
  <line x1="40" y1="70" x2="40" y2="520" stroke="var(--warn)" stroke-width="4" marker-end="url(#ah3b)"/>
  <text x="60" y="88" style="font-size:19px;fill:var(--warn)">높음</text>
  <text x="60" y="518" style="font-size:19px;fill:var(--warn)">낮음</text>
  <g style="font-size:22px;fill:var(--fg)">
    <rect x="130" y="70" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>
    <text x="150" y="97"><tspan style="${MONO}" font-weight="700">( )   x++  x--</tspan>  괄호 · 후위 증감</text>
    <rect x="130" y="115" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>
    <text x="150" y="142"><tspan style="${MONO}" font-weight="700">++x  --x  !  -x  (형)</tspan>  단항</text>
    <rect x="130" y="160" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>
    <text x="150" y="187"><tspan style="${MONO}" font-weight="700">*  /  %</tspan>  곱셈 · 나눗셈 · 나머지</text>
    <rect x="130" y="205" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>
    <text x="150" y="232"><tspan style="${MONO}" font-weight="700">+  -</tspan>  덧셈 · 뺄셈 (문자열 연결)</text>
    <rect x="130" y="250" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/>
    <text x="150" y="277"><tspan style="${MONO}" font-weight="700">&lt;  &gt;  &lt;=  &gt;=</tspan>  크기 비교</text>
    <rect x="130" y="295" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/>
    <text x="150" y="322"><tspan style="${MONO}" font-weight="700">==  !=</tspan>  같다 · 다르다</text>
    <rect x="130" y="340" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/>
    <text x="150" y="367"><tspan style="${MONO}" font-weight="700">&amp;&amp;</tspan>  그리고</text>
    <rect x="130" y="385" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/>
    <text x="150" y="412"><tspan style="${MONO}" font-weight="700">||</tspan>  또는</text>
    <rect x="130" y="430" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="2"/>
    <text x="150" y="457"><tspan style="${MONO}" font-weight="700">? :</tspan>  삼항 (조건)</text>
    <rect x="130" y="475" width="440" height="38" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="2"/>
    <text x="150" y="502"><tspan style="${MONO}" font-weight="700">=  +=  -=  *=</tspan>  대입 (오른쪽부터)</text>
  </g>
  <line x1="640" y1="60" x2="640" y2="520" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="950" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">계산 순서 예:  x = 5, done = false</text>
  <text x="950" y="100" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">x + 1 &gt; 3 * 2 &amp;&amp; !done</text>
  <g style="font-size:23px;fill:var(--fg)">
    <text x="690" y="160"><tspan font-weight="700" fill="var(--accent)">①</tspan> <tspan style="${MONO}">3 * 2</tspan>  →  6          (곱셈이 먼저)</text>
    <text x="690" y="205"><tspan font-weight="700" fill="var(--accent)">②</tspan> <tspan style="${MONO}">x + 1</tspan>  →  6          (덧셈)</text>
    <text x="690" y="250"><tspan font-weight="700" fill="var(--accent)">③</tspan> <tspan style="${MONO}">!done</tspan>  →  true       (단항 ! 는 원래 가장 먼저)</text>
    <text x="690" y="295"><tspan font-weight="700" fill="var(--accent2)">④</tspan> <tspan style="${MONO}">6 &gt; 6</tspan>  →  false      (비교)</text>
    <text x="690" y="340"><tspan font-weight="700" fill="var(--ok)">⑤</tspan> <tspan style="${MONO}">false &amp;&amp; true</tspan>  →  <tspan font-weight="700">false</tspan>   (논리)</text>
  </g>
  <rect x="680" y="390" width="540" height="110" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="950" y="432" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--warn)">헷갈리면 괄호 ( ) 를 쓰자</text>
  <text x="950" y="472" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">((x + 1) &gt; (3 * 2)) &amp;&amp; (!done)</text>
</svg>`;

  const SVG_TERNARY = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="삼항 연산자의 동작">
  <defs><marker id="ah3c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  <marker id="ah3d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker></defs>
  <text x="640" y="50" text-anchor="middle" style="${MONO};font-size:30px;font-weight:700;fill:var(--fg)"><tspan fill="var(--accent)">조건</tspan> ? <tspan fill="var(--ok)">참일 때 값</tspan> : <tspan fill="var(--danger)">거짓일 때 값</tspan></text>
  <text x="640" y="95" text-anchor="middle" style="font-size:22px;fill:var(--muted)">"조건이 참이니? 그러면 이 값, 아니면 저 값" — 식 하나가 값 하나가 된다</text>
  <text x="640" y="150" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--fg)">string result = <tspan fill="var(--accent)">score &gt;= 60</tspan> ? <tspan fill="var(--ok)">"합격"</tspan> : <tspan fill="var(--danger)">"불합격"</tspan>;</text>
  <polygon points="640,200 800,270 640,340 480,270" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="262" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">score &gt;= 60 ?</text>
  <text x="640" y="296" text-anchor="middle" style="font-size:20px;fill:var(--muted)">score = 85</text>
  <line x1="800" y1="270" x2="940" y2="270" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah3c)"/>
  <text x="870" y="255" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">true</text>
  <rect x="950" y="230" width="240" height="80" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1070" y="280" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--ok)">"합격"</text>
  <line x1="480" y1="270" x2="340" y2="270" stroke="var(--danger)" stroke-width="4" marker-end="url(#ah3d)"/>
  <text x="410" y="255" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--danger)">false</text>
  <rect x="90" y="230" width="240" height="80" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="4"/>
  <text x="210" y="280" text-anchor="middle" style="${MONO};font-size:28px;fill:var(--danger)">"불합격"</text>
  <line x1="1070" y1="315" x2="1070" y2="380" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah3c)"/>
  <rect x="470" y="390" width="340" height="70" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="640" y="435" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">result = "합격"</text>
  <line x1="1070" y1="380" x2="1070" y2="425" stroke="var(--ok)" stroke-width="4"/>
  <line x1="1070" y1="425" x2="820" y2="425" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah3c)"/>
  <text x="640" y="510" text-anchor="middle" style="font-size:23px;fill:var(--fg)">참 · 거짓 두 값의 <tspan font-weight="700">자료형은 같아야</tspan> 한다 (둘 다 string, 둘 다 int …)</text>
  <text x="640" y="545" text-anchor="middle" style="font-size:21px;fill:var(--muted)">if 문(4장)을 한 줄로 줄인 것 — "값을 고를 때"만 쓰고, 여러 문장을 실행할 때는 if 를 쓴다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch03',
    no: '03',
    title: '연산자와 식',
    subtitle: 'Operators & Expressions',
    summary: '값을 계산하고 비교하고 판단하는 도구인 연산자를 배웁니다. 산술 · 대입 · 증감 · 비교 · 논리 연산자와 우선순위, Math 클래스, 문자열 연산, 삼항 연산자, 비트 연산까지 익혀 식(expression)을 자유롭게 쓸 수 있게 됩니다.',
    goals: [
      '산술 연산자(+ - * / %)와 정수 나눗셈 · 나머지의 규칙을 설명할 수 있다',
      '복합 대입(+=)과 증감 연산자(++ --)의 전위 · 후위 차이를 설명할 수 있다',
      '비교 · 논리 연산자로 bool 식을 만들고 단락 평가를 이해할 수 있다',
      '연산자 우선순위를 알고 괄호로 계산 순서를 정할 수 있다',
      'Math 클래스, 문자열 연산, 삼항 연산자, 비트 연산자를 상황에 맞게 사용할 수 있다'
    ],
    sections: [
      /* ===================== ch03-1 ===================== */
      {
        id: 'ch03-1',
        title: '산술 · 대입 · 증감 · 비교 · 논리 연산자',
        minutes: 50,
        goals: [
          '산술 연산자 5개와 정수 나눗셈 · 나머지 연산의 결과를 예측할 수 있다',
          '복합 대입 연산자(+=, -=, *=, /=, %=)를 사용할 수 있다',
          '증감 연산자의 전위(++a)와 후위(a++) 차이를 설명할 수 있다',
          '비교 · 논리 연산자로 bool 결과를 만들고 단락 평가를 설명할 수 있다',
          '연산자 우선순위를 알고 괄호로 순서를 분명히 할 수 있다'
        ],
        flow: [['복습 · 도입: 계산기와 식', 5], ['산술 · 나머지 연산', 10], ['복합 대입 · 증감 연산자', 12], ['비교 · 논리 · 단락 평가', 12], ['우선순위 · 퀴즈 · 실습', 11]],
        content: [
          { type: 'h', text: '연산자(operator)와 식(expression)' },
          { type: 'p', html: '<code>3 + 4</code> 에서 <code>+</code> 처럼 <b>값을 가지고 무언가를 계산하는 기호</b>를 <b>연산자(operator)</b>, 연산자 양쪽의 값(<code>3</code>, <code>4</code>)을 <b>피연산자(operand)</b>, 이들을 조합해 <b>하나의 값이 되는 것</b>을 <b>식(expression)</b>이라고 합니다. <code>a + b * 2</code> 도 식이고, <code>age &gt;= 19</code> 도 결과가 <code>true</code>/<code>false</code> 인 식입니다. 프로그램은 결국 식을 계산해 변수에 넣고, 그 값을 보고 판단하는 일의 연속입니다.' },
          { type: 'table', head: ['종류', '연산자', '예', '결과'], rows: [
            ['산술', '<code>+ - * / %</code>', '<code>7 / 2</code>, <code>7 % 2</code>', '<code>3</code>, <code>1</code>'],
            ['대입', '<code>= += -= *= /= %=</code>', '<code>x += 3</code>', 'x 에 3 을 더해 넣음'],
            ['증감', '<code>++ --</code>', '<code>i++</code>, <code>--i</code>', 'i 를 1 늘림 / 줄임'],
            ['비교', '<code>== != &lt; &gt; &lt;= &gt;=</code>', '<code>age &gt;= 19</code>', '<code>bool</code> (True/False)'],
            ['논리', '<code>&amp;&amp; || !</code>', '<code>a &gt; 0 &amp;&amp; b &gt; 0</code>', '<code>bool</code>'],
            ['삼항', '<code>? :</code>', '<code>n % 2 == 0 ? "짝" : "홀"</code>', '조건에 따라 둘 중 하나 (2교시)'],
            ['비트', '<code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>', '<code>1 &lt;&lt; 3</code>', '<code>8</code> (2교시)']
          ], caption: 'C# 연산자 한눈에 보기 — 이번 교시는 위 5줄, 다음 교시는 아래 2줄' },
          { type: 'h', text: '산술 연산자 — + - * / %' },
          { type: 'p', html: '더하기 · 빼기 · 곱하기는 수학과 같습니다. 주의할 것은 <b>나눗셈 <code>/</code></b> 과 <b>나머지 <code>%</code></b> 입니다. 2장에서 본 대로 <b>정수끼리 나누면 몫만 남고</b>, <code>%</code> 는 나누고 남은 <b>나머지</b>를 줍니다. <code>17 / 5 = 3</code>, <code>17 % 5 = 2</code> — 초등학교의 “17 ÷ 5 = 3 … 2” 와 같습니다.' },
          { type: 'code', title: '예제 3-1. 산술 연산자 다섯 가지', code: `using System;

class Program
{
    static void Main()
    {
        int a = 17, b = 5;
        Console.WriteLine($"{a} + {b} = {a + b}");
        Console.WriteLine($"{a} - {b} = {a - b}");
        Console.WriteLine($"{a} * {b} = {a * b}");
        Console.WriteLine($"{a} / {b} = {a / b}");     // 정수 나눗셈: 몫
        Console.WriteLine($"{a} % {b} = {a % b}");     // 나머지

        Console.WriteLine(a / (double)b);   // 3.4  하나를 double 로 바꾸면 실수 나눗셈
        Console.WriteLine(-a / b);          // -3   음수도 0 쪽으로 자른다
        Console.WriteLine(-a % b);          // -2   나머지의 부호는 왼쪽(피제수)을 따른다
        Console.WriteLine(7.5 % 2);         // 1.5  실수도 나머지를 구할 수 있다
        Console.WriteLine(3 + 4.5);         // 7.5  int + double → double
        Console.WriteLine(1 / 2 * 2.0);     // 0    왼쪽부터: 1 / 2 는 정수 0
    }
}`, expect: `17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3
17 % 5 = 2
3.4
-3
-2
1.5
7.5
0`, desc: '<code>int</code> 와 <code>double</code> 이 섞이면 <b>큰 쪽(double)으로 맞춘 뒤</b> 계산합니다. 마지막 줄 <code>1 / 2 * 2.0</code> 은 왼쪽부터 계산하므로 <code>1 / 2</code> 가 먼저 정수 <code>0</code> 이 되고, <code>0 * 2.0 = 0</code> 입니다. 실수 결과가 필요하면 <b>처음부터</b> 실수로 계산하세요.' },
          { type: 'callout', kind: 'tip', title: '% 는 생각보다 자주 쓴다', html: '<ul><li><b>홀짝</b>: <code>n % 2</code> 가 0 이면 짝수, 1 이면 홀수</li><li><b>배수 판정</b>: <code>n % 3 == 0</code> 이면 3의 배수</li><li><b>자릿수 분리</b>: <code>1234 % 10</code> = 4 (일의 자리), <code>1234 / 10 % 10</code> = 3 (십의 자리)</li><li><b>단위 변환</b>: 135분 = <code>135 / 60</code> 시간 <code>135 % 60</code> 분</li><li><b>돌고 도는 값</b>: 요일(0~6), 시계(0~23), 순환하는 인덱스는 <code>% 7</code>, <code>% 24</code></li></ul>' },
          { type: 'code', title: '추가 예제. 나머지 연산자 활용', code: `using System;

class Program
{
    static void Main()
    {
        int n = 1234;
        Console.WriteLine(n % 10);          // 일의 자리 4
        Console.WriteLine(n / 10 % 10);     // 십의 자리 3
        Console.WriteLine(n / 100 % 10);    // 백의 자리 2
        Console.WriteLine(n / 1000);        // 천의 자리 1

        int totalMin = 135;
        Console.WriteLine($"{totalMin / 60}시간 {totalMin % 60}분");

        Console.WriteLine(7 % 2);           // 1 → 홀수
        Console.WriteLine(8 % 2);           // 0 → 짝수
        Console.WriteLine(23 % 7);          // 월요일(0)에서 23일 뒤는 요일 번호 2 (수요일)
    }
}`, expect: `4
3
2
1
2시간 15분
1
0
2`, desc: '아직 <code>if</code> 문을 배우지 않았지만 <code>%</code> 만으로 홀짝 · 자릿수 · 단위를 계산할 수 있습니다. 4장에서 조건문을 배우면 이 값들로 “짝수입니다” 같은 판단을 하게 됩니다.' },
          { type: 'h', text: '복합 대입 연산자 — += -= *= /= %=' },
          { type: 'p', html: '<code>score = score + 5;</code> 처럼 <b>자기 자신에 계산해서 다시 넣는</b> 문장은 너무 자주 나와서 줄임 표기가 있습니다. <code>score += 5;</code> 는 <code>score = score + 5;</code> 와 같습니다. 나머지 산술 연산자도 모두 같은 방식으로 <code>-=</code> <code>*=</code> <code>/=</code> <code>%=</code> 가 있습니다.' },
          { type: 'code', title: '예제 3-2. 복합 대입 연산자', code: `using System;

class Program
{
    static void Main()
    {
        int score = 10;
        score += 5;   Console.WriteLine(score);   // score = score + 5 → 15
        score -= 3;   Console.WriteLine(score);   // 12
        score *= 2;   Console.WriteLine(score);   // 24
        score /= 5;   Console.WriteLine(score);   // 4 (정수 나눗셈)
        score %= 3;   Console.WriteLine(score);   // 1

        int x = 10;
        x += 2 * 3;                 // 오른쪽 전체를 먼저 계산: x = x + (2 * 3)
        Console.WriteLine(x);       // 16

        string s = "안녕";
        s += ", C#";                // 문자열도 += 로 이어 붙인다
        Console.WriteLine(s);

        byte b = 10;
        // b = b + 5;               // 오류 CS0266: b + 5 는 int 라서 byte 에 못 넣는다
        b += 5;                     // 복합 대입은 캐스트가 자동으로 들어간다
        Console.WriteLine(b);       // 15
    }
}`, expect: `15
12
24
4
1
16
안녕, C#
15`, desc: '<code>x += 2 * 3</code> 은 <code>x = x + 2 * 3</code> 이 아니라 <b><code>x = x + (2 * 3)</code></b> 입니다 — 오른쪽 식 전체를 먼저 계산합니다. <code>byte b; b = b + 5;</code> 가 오류인 이유는 <code>b + 5</code> 의 결과가 <code>int</code> 이기 때문인데, <code>b += 5;</code> 는 컴파일러가 <code>(byte)</code> 캐스트를 넣어 주어 오류가 없습니다.' },
          { type: 'h', text: '증감 연산자 — ++ 와 --' },
          { type: 'p', html: '<b>1 을 더하거나 빼는 일</b>은 그중에서도 가장 흔해서 더 짧은 기호가 있습니다. <code>i++</code>, <code>++i</code> 는 <code>i += 1</code>, <code>i--</code>, <code>--i</code> 는 <code>i -= 1</code> 입니다. 변수 <b>뒤에</b> 붙이면 <b>후위(postfix)</b>, <b>앞에</b> 붙이면 <b>전위(prefix)</b>라고 하는데, 혼자 쓰일 때는 똑같고 <b>그 값을 다른 곳에 쓸 때</b>만 차이가 납니다.' },
          { type: 'figure', html: SVG_INC, caption: '후위 a++ 는 “쓰고 나서 증가”, 전위 ++c 는 “증가하고 나서 쓴다”' },
          { type: 'code', title: '예제 3-3. 증감 연산자의 전위와 후위', code: `using System;

class Program
{
    static void Main()
    {
        int i = 5;
        i++;                       // i = i + 1
        Console.WriteLine(i);      // 6
        ++i;                       // 혼자 쓰이면 후위와 같다
        Console.WriteLine(i);      // 7
        i--;
        Console.WriteLine(i);      // 6

        int a = 5;
        int b = a++;               // 후위: b 에 5 를 준 뒤에 a 가 6
        Console.WriteLine($"a = {a}, b = {b}");
        int c = 5;
        int d = ++c;               // 전위: c 를 6 으로 만든 뒤에 d 에 6
        Console.WriteLine($"c = {c}, d = {d}");

        int n = 3;
        Console.WriteLine(n++);    // 3 출력, 그 뒤 n 은 4
        Console.WriteLine(n);      // 4
        Console.WriteLine(++n);    // 먼저 5 로 만들고 5 출력
        Console.WriteLine(n--);    // 5 출력, 그 뒤 n 은 4
        Console.WriteLine(n);      // 4
    }
}`, expect: `6
7
6
a = 6, b = 5
c = 6, d = 6
3
4
5
5
4`, desc: '<code>Console.WriteLine(n++)</code> 은 <b>옛 값</b>을 출력하고 나서 n 이 늘어납니다. 전위 · 후위를 헷갈리지 않는 가장 좋은 방법은 <b>증감 연산자를 한 줄에 혼자 쓰는 것</b>입니다(<code>i++;</code>). 5장 반복문 <code>for (int i = 0; i &lt; 10; i++)</code> 에서 매일 만나게 됩니다.' },
          { type: 'callout', kind: 'warn', title: '이런 코드는 쓰지 마세요', html: '<code>int r = a++ + ++a;</code> 처럼 한 식에서 같은 변수를 여러 번 증감하면 읽는 사람이 계산 순서를 따라가기 어렵습니다. C# 은 왼쪽부터 계산하므로 결과는 정해져 있지만(a = 5 이면 5 + 7 = 12), 이런 코드는 <b>퀴즈용</b>이지 실무용이 아닙니다. 증감 연산자는 <b>한 줄에 하나</b>만.' },
          { type: 'h', text: '비교 연산자 — 결과는 bool' },
          { type: 'p', html: '두 값을 비교하는 연산자입니다. 결과는 항상 <b><code>true</code> 또는 <code>false</code>(bool)</b> 이고, 이 값은 변수에 담거나 4장의 <code>if</code> 문에서 판단 재료로 씁니다. <b>“같다”는 <code>==</code> 두 개</b>, “다르다”는 <code>!=</code> 입니다. <code>=</code> 하나는 대입이므로 <code>if (a = 5)</code> 처럼 쓰면 안 됩니다.' },
          { type: 'table', head: ['연산자', '뜻', '예 (age = 20)', '결과'], rows: [
            ['<code>==</code>', '같다', '<code>age == 20</code>', '<code>True</code>'],
            ['<code>!=</code>', '같지 않다', '<code>age != 20</code>', '<code>False</code>'],
            ['<code>&gt;</code> <code>&lt;</code>', '크다 · 작다', '<code>age &gt; 20</code>', '<code>False</code>'],
            ['<code>&gt;=</code> <code>&lt;=</code>', '크거나 같다 · 작거나 같다', '<code>age &gt;= 20</code>', '<code>True</code>']
          ], caption: '비교 연산자 — 등호는 항상 오른쪽 (>=, <=, !=). =< 나 => 는 없다' },
          { type: 'h', text: '논리 연산자 — && || !' },
          { type: 'p', html: '<code>bool</code> 값 여러 개를 묶어 <b>더 복잡한 조건</b>을 만듭니다. <code>&amp;&amp;</code>(그리고, AND)는 <b>둘 다 참</b>일 때만 참, <code>||</code>(또는, OR)는 <b>하나라도 참</b>이면 참, <code>!</code>(아니다, NOT)는 참 · 거짓을 <b>뒤집습니다</b>. “13세 이상 <b>이고</b> 19세 이하” → <code>age &gt;= 13 &amp;&amp; age &lt;= 19</code>.' },
          { type: 'table', head: ['A', 'B', '<code>A &amp;&amp; B</code>', '<code>A || B</code>', '<code>!A</code>'], rows: [
            ['true', 'true', '<b>true</b>', '<b>true</b>', 'false'],
            ['true', 'false', 'false', '<b>true</b>', 'false'],
            ['false', 'true', 'false', '<b>true</b>', '<b>true</b>'],
            ['false', 'false', 'false', 'false', '<b>true</b>']
          ], caption: '진리표 — && 는 둘 다 참일 때만, || 는 하나라도 참이면' },
          { type: 'code', title: '예제 3-4. 비교 연산자와 논리 연산자', code: `using System;

class Program
{
    static void Main()
    {
        int age = 20;
        Console.WriteLine(age == 20);        // True
        Console.WriteLine(age != 20);        // False
        Console.WriteLine(age > 20);         // False
        Console.WriteLine(age >= 20);        // True
        bool isAdult = age >= 19;            // 비교 결과를 bool 변수에 담는다
        Console.WriteLine(isAdult);          // True
        Console.WriteLine('a' < 'b');        // True  (문자 코드 97 < 98)
        Console.WriteLine(3.0 == 3);         // True  (int 가 double 로 바뀌어 비교)

        bool hasTicket = true, hasId = false;
        Console.WriteLine(hasTicket && hasId);   // False  둘 다 참이어야
        Console.WriteLine(hasTicket || hasId);   // True   하나만 참이어도
        Console.WriteLine(!hasId);               // True   뒤집기

        Console.WriteLine(age >= 13 && age <= 19);   // False  청소년인가?
        Console.WriteLine(age < 13 || age >= 65);    // False  할인 대상인가?
        Console.WriteLine(!(age < 19));              // True   성인인가?
    }
}`, expect: `True
False
False
True
True
True
True
False
True
True
False
False
True`, desc: '<code>bool</code> 은 출력하면 <code>True</code>/<code>False</code>(대문자)로 나옵니다. “13세 이상 19세 이하”를 수학처럼 <code>13 &lt;= age &lt;= 19</code> 로 쓰면 <b>컴파일 오류</b>입니다 — 반드시 <code>age &gt;= 13 &amp;&amp; age &lt;= 19</code> 처럼 두 비교를 <code>&amp;&amp;</code> 로 묶으세요.' },
          { type: 'h', text: '단락 평가 (short-circuit)' },
          { type: 'p', html: '<code>&amp;&amp;</code> 는 왼쪽이 <code>false</code> 이면 오른쪽을 볼 필요 없이 결과가 <code>false</code> 로 정해집니다. <code>||</code> 는 왼쪽이 <code>true</code> 이면 결과가 <code>true</code> 입니다. 그래서 C# 은 이럴 때 <b>오른쪽 식을 아예 계산하지 않습니다</b>. 이를 <b>단락 평가(short-circuit evaluation)</b>라고 하며, “0 이 아닐 때만 나누기” 같은 <b>안전 검사</b>에 쓰입니다.' },
          { type: 'code', title: '예제 3-5. 단락 평가 확인하기', code: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        bool f = false, t = true;

        bool r1 = f && (++count > 0);     // 왼쪽이 false → 오른쪽은 계산하지 않음
        Console.WriteLine($"{r1}, count = {count}");
        bool r2 = t || (++count > 0);     // 왼쪽이 true → 오른쪽은 계산하지 않음
        Console.WriteLine($"{r2}, count = {count}");
        bool r3 = t && (++count > 0);     // 왼쪽이 true → 오른쪽을 봐야 결과를 안다
        Console.WriteLine($"{r3}, count = {count}");
        bool r4 = f & (++count > 0);      // & 하나는 단락 없이 항상 둘 다 계산
        Console.WriteLine($"{r4}, count = {count}");

        int divisor = 0;
        bool ok = divisor != 0 && 10 / divisor > 1;   // 왼쪽이 false → 0 으로 나누지 않는다
        Console.WriteLine(ok);
    }
}`, expect: `False, count = 0
True, count = 0
True, count = 1
False, count = 2
False`, desc: '<code>++count</code> 가 실행됐는지를 <code>count</code> 값으로 확인합니다. 마지막 예에서 <code>divisor != 0</code> 이 거짓이므로 <code>10 / divisor</code> 는 실행되지 않아 <b>0 으로 나누기 오류가 나지 않습니다</b>. 조건 순서를 바꿔 <code>10 / divisor &gt; 1 &amp;&amp; divisor != 0</code> 으로 쓰면 오류가 납니다.' },
          { type: 'h', text: '연산자 우선순위와 괄호' },
          { type: 'p', html: '<code>2 + 3 * 4</code> 는 14 입니다. 수학처럼 <b>곱셈 · 나눗셈이 덧셈 · 뺄셈보다 먼저</b>이고, 같은 순위는 <b>왼쪽부터</b> 계산합니다(대입은 예외로 오른쪽부터). 비교 연산자는 산술보다 늦고, 논리 연산자는 비교보다 늦어서 <code>x + 1 &gt; 3 * 2 &amp;&amp; !done</code> 같은 식도 괄호 없이 의도대로 계산됩니다. 하지만 <b>헷갈리면 괄호</b>를 쓰는 것이 가장 좋은 습관입니다.' },
          { type: 'figure', html: SVG_PREC, caption: '우선순위 사다리(위가 먼저) — 산술 → 비교 → 논리 → 삼항 → 대입 순서, 헷갈리면 괄호' },
          { type: 'code', title: '예제 3-6. 우선순위와 괄호', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(2 + 3 * 4);        // 14  곱셈 먼저
        Console.WriteLine((2 + 3) * 4);      // 20  괄호 먼저
        Console.WriteLine(10 - 4 - 3);       // 3   같은 순위는 왼쪽부터: (10 - 4) - 3
        Console.WriteLine(100 / 10 / 2);     // 5   (100 / 10) / 2
        Console.WriteLine(100 / (10 / 2));   // 20
        Console.WriteLine(-2 * -3);          // 6   단항 - 가 곱셈보다 먼저
        Console.WriteLine(1 + 2 + "3");      // 33  (1 + 2) 가 먼저 3, 그 다음 문자열 연결
        Console.WriteLine("1" + 2 + 3);      // 123 왼쪽부터 문자열 연결

        int x = 5;
        Console.WriteLine(x > 3 && x < 10);  // True   비교가 && 보다 먼저
        Console.WriteLine(x + 1 > 3 * 2);    // False  산술이 비교보다 먼저: 6 > 6
        Console.WriteLine(!(x > 3) || x == 5);   // True

        int y = 2;
        y = y * 3 + 4 % 3;                   // (2 * 3) + (4 % 3) = 6 + 1
        Console.WriteLine(y);                // 7
    }
}`, expect: `14
20
3
5
20
6
33
123
True
False
True
7`, desc: '<code>1 + 2 + "3"</code> 과 <code>"1" + 2 + 3</code> 의 차이에 주목하세요. <code>+</code> 는 왼쪽부터 계산되므로 <b>문자열을 만나는 순간부터</b> 연결이 됩니다. 숫자를 먼저 더하고 싶으면 <code>"합: " + (1 + 2)</code> 처럼 괄호를 쓰거나 보간 문자열 <code>$"합: {1 + 2}"</code> 을 쓰세요.' },
          { type: 'table', head: ['순위', '연산자', '설명', '결합 방향'], rows: [
            ['1', '<code>( )</code> <code>x++</code> <code>x--</code> <code>.</code> <code>[ ]</code>', '괄호, 후위 증감, 멤버 접근', '왼쪽 → 오른쪽'],
            ['2', '<code>++x</code> <code>--x</code> <code>!</code> <code>~</code> <code>-x</code> <code>(형)</code>', '단항 연산자, 캐스트', '오른쪽 → 왼쪽'],
            ['3', '<code>*</code> <code>/</code> <code>%</code>', '곱셈 · 나눗셈 · 나머지', '왼쪽 → 오른쪽'],
            ['4', '<code>+</code> <code>-</code>', '덧셈 · 뺄셈 · 문자열 연결', '왼쪽 → 오른쪽'],
            ['5', '<code>&lt;&lt;</code> <code>&gt;&gt;</code>', '비트 이동', '왼쪽 → 오른쪽'],
            ['6', '<code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>', '크기 비교', '왼쪽 → 오른쪽'],
            ['7', '<code>==</code> <code>!=</code>', '같다 · 다르다', '왼쪽 → 오른쪽'],
            ['8~10', '<code>&amp;</code> → <code>^</code> → <code>|</code>', '비트 AND · XOR · OR', '왼쪽 → 오른쪽'],
            ['11', '<code>&amp;&amp;</code>', '논리 AND', '왼쪽 → 오른쪽'],
            ['12', '<code>||</code>', '논리 OR', '왼쪽 → 오른쪽'],
            ['13', '<code>? :</code>', '삼항(조건) 연산자', '오른쪽 → 왼쪽'],
            ['14', '<code>=</code> <code>+=</code> <code>-=</code> …', '대입', '<b>오른쪽 → 왼쪽</b>']
          ], caption: 'C# 연산자 우선순위 (자주 쓰는 것만). 외우지 말고 “산술 > 비교 > 논리 > 대입” 만 기억하고 나머지는 괄호' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 대입도 식이다', html: '<code>a = b = c = 0;</code> 은 오른쪽부터 계산되어 세 변수 모두 0 이 됩니다. 대입 <code>=</code> 자체가 “넣은 값”을 결과로 갖는 <b>식</b>이기 때문입니다. 같은 이유로 <code>Console.WriteLine(x = 5);</code> 도 5 를 출력합니다. 다만 읽기 어려우니 <b>대입은 한 줄에 하나</b>가 좋은 습관입니다.' }
        ],
        practice: [
          {
            title: '실습 3-1. 거스름돈 동전 개수',
            level: 1,
            desc: '<p>금액(10원 단위)을 입력받아 500원 · 100원 · 10원 동전이 각각 몇 개 필요한지 계산하세요. 큰 동전부터 최대한 많이 씁니다. <code>/</code> 와 <code>%</code> 만으로 풀 수 있습니다(조건문 불필요).</p><pre>금액: 1370\n500원 2개, 100원 3개, 10원 7개</pre>',
            hint: '500원 개수 = <code>money / 500</code>, 남은 돈 = <code>money % 500</code>. 남은 돈으로 100원 개수를 구하고, 다시 나머지로 10원 개수를 구합니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("금액: ");
        int money = int.Parse(Console.ReadLine());
        // TODO: 500원, 100원, 10원 동전 개수 계산

        // TODO: "500원 n개, 100원 n개, 10원 n개" 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("금액: ");
        int money = int.Parse(Console.ReadLine());
        int c500 = money / 500;
        int rest = money % 500;
        int c100 = rest / 100;
        rest %= 100;
        int c10 = rest / 10;
        Console.WriteLine($"500원 {c500}개, 100원 {c100}개, 10원 {c10}개");
    }
}
`,
            stdin: '1370\n',
            expect: `금액: 500원 2개, 100원 3개, 10원 7개`
          },
          {
            title: '실습 3-2. 세 수의 합 · 평균 · 최대 · 최소',
            level: 2,
            desc: '<p>정수 세 개를 입력받아 합, 평균(소수점 1자리), 최댓값, 최솟값을 출력하세요. 최댓값 · 최솟값은 <code>Math.Max</code> · <code>Math.Min</code> 을 사용합니다(두 값만 받으므로 두 번 겹쳐 씁니다).</p><pre>첫 번째: 70\n두 번째: 95\n세 번째: 82\n합: 247, 평균: 82.3, 최대: 95, 최소: 70</pre>',
            hint: '<code>int max = Math.Max(Math.Max(a, b), c);</code> 평균은 <code>sum / 3.0</code> (정수 나눗셈 주의) 과 <code>{avg:F1}</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째: ");
        int c = int.Parse(Console.ReadLine());
        // TODO: 합, 평균, 최대, 최소 계산

        // TODO: 한 줄로 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째: ");
        int c = int.Parse(Console.ReadLine());
        int sum = a + b + c;
        double avg = sum / 3.0;
        int max = Math.Max(Math.Max(a, b), c);
        int min = Math.Min(Math.Min(a, b), c);
        Console.WriteLine($"합: {sum}, 평균: {avg:F1}, 최대: {max}, 최소: {min}");
    }
}
`,
            stdin: '70\n95\n82\n',
            expect: `첫 번째: 두 번째: 세 번째: 합: 247, 평균: 82.3, 최대: 95, 최소: 70`
          }
        ],
        quiz: [
          { q: '<code>Console.WriteLine(17 % 5 + 17 / 5);</code> 의 출력은?', options: ['3.4', '5', '6', '2'], answer: 1, explain: '<code>17 % 5</code> = 2, <code>17 / 5</code> = 3 (정수 나눗셈). 2 + 3 = 5.' },
          { q: '다음 코드의 출력은?<pre><code>int a = 5;\nint b = a++;\nConsole.WriteLine($"{a} {b}");</code></pre>', options: ['5 5', '6 6', '6 5', '5 6'], answer: 2, explain: '후위 <code>a++</code> 는 옛 값 5 를 b 에 준 뒤 a 를 6 으로 만듭니다.' },
          { q: '다음 코드의 출력은?<pre><code>int x = 10;\nx += 3;\nx *= 2;\nConsole.WriteLine(x);</code></pre>', options: ['16', '23', '20', '26'], answer: 3, explain: '<code>x += 3</code> → 13, <code>x *= 2</code> → 26.' },
          { q: '<code>Console.WriteLine(2 + 3 * 4 - 6 / 2);</code> 의 출력은?', options: ['11', '17', '7', '5'], answer: 0, explain: '곱셈 · 나눗셈 먼저: 2 + 12 - 3 = 11.' },
          { q: '다음 코드의 출력은?<pre><code>int n = 0;\nbool f = false;\nbool r = f &amp;&amp; (n++ &gt; 0);\nConsole.WriteLine(n);</code></pre>', options: ['1', 'True', 'False', '0'], answer: 3, explain: '<code>&amp;&amp;</code> 의 왼쪽이 false 이면 오른쪽 <code>n++</code> 는 실행되지 않습니다(단락 평가). n 은 그대로 0.' }
        ],
        slides: [
          { layout: 'title', title: '산술 · 대입 · 증감 · 비교 · 논리 연산자', subtitle: 'Chapter 03 · Section 01', badge: '03-1',
            notes: '<p><b>[도입 3분]</b> 복습: “10 / 4 는?” “10 / 4.0 은?” 오늘은 계산기의 버튼들(연산자)을 하나씩 익힌다. 목표: 식의 결과를 <b>실행하기 전에 예측</b>할 수 있게 되는 것.</p>' },
          { layout: 'table', title: '연산자 한눈에 보기', head: ['종류', '연산자', '예 → 결과'], rows: [['산술', '<code>+ - * / %</code>', '<code>7 / 2</code> → 3, <code>7 % 2</code> → 1'], ['대입', '<code>= += -= *= /= %=</code>', '<code>x += 3</code>'], ['증감', '<code>++ --</code>', '<code>i++</code>, <code>--i</code>'], ['비교', '<code>== != &lt; &gt; &lt;= &gt;=</code>', '<code>age &gt;= 19</code> → True/False'], ['논리', '<code>&amp;&amp; || !</code>', '<code>a &gt; 0 &amp;&amp; b &gt; 0</code>']],
            lead: '연산자(operator) + 피연산자(operand) = 식(expression) → 값 하나',
            notes: '<p><b>[3분]</b> 용어 3개(연산자 · 피연산자 · 식)만 짚고 넘어갑니다. “식은 결국 값 하나가 된다”를 강조 — 그래서 변수에 넣고, 출력하고, 비교할 수 있다.</p>' },
          { layout: 'code', title: '산술 연산자 — / 와 % 에 주의', code: `using System;

class Program
{
    static void Main()
    {
        int a = 17, b = 5;
        Console.WriteLine(a / b);           // 3   몫
        Console.WriteLine(a % b);           // 2   나머지
        Console.WriteLine(a / (double)b);   // 3.4
        Console.WriteLine(-a / b);          // -3
        Console.WriteLine(-a % b);          // -2
        Console.WriteLine(7.5 % 2);         // 1.5
        Console.WriteLine(1 / 2 * 2.0);     // 0 !
        Console.WriteLine(1234 % 10);       // 4 (일의 자리)
        Console.WriteLine(135 / 60 + "시간 " + 135 % 60 + "분");
    }
}`, points: ['정수 / 정수 = 몫, % 는 나머지', '“17 ÷ 5 = 3 … 2”', '<code>1 / 2 * 2.0</code> 은 왼쪽부터 → 0', '% 활용: 홀짝 · 자릿수 · 단위 변환'],
            notes: '<p><b>[8분]</b> 실행 전 각 줄의 결과를 학생에게 예측시키고 실행. 마지막 줄 <code>1 / 2 * 2.0</code> 에서 많이 틀립니다. “% 를 어디에 쓸까?” → 홀짝, 자릿수, 135분 → 2시간 15분, 요일 계산.</p>' },
          { layout: 'code', title: '복합 대입 연산자 += -= *= /= %=', code: `using System;

class Program
{
    static void Main()
    {
        int score = 10;
        score += 5;   Console.WriteLine(score);   // 15
        score -= 3;   Console.WriteLine(score);   // 12
        score *= 2;   Console.WriteLine(score);   // 24
        score /= 5;   Console.WriteLine(score);   // 4
        score %= 3;   Console.WriteLine(score);   // 1

        int x = 10;
        x += 2 * 3;   Console.WriteLine(x);       // 16 (x + (2*3))

        string s = "안녕";
        s += ", C#";  Console.WriteLine(s);
    }
}`, points: ['<code>x += 5</code> ≡ <code>x = x + 5</code>', '오른쪽 식 전체를 먼저 계산', '문자열도 <code>+=</code> 로 연결', '<code>byte b; b += 5;</code> 는 OK, <code>b = b + 5</code> 는 오류'],
            notes: '<p><b>[5분]</b> “score = score + 5 를 줄인 것”. <code>x += 2 * 3</code> 이 16 인지 36 인지 물어보세요(16). byte 이야기는 시간이 있으면.</p>' },
          { layout: 'diagram', title: '증감 연산자 — 전위 vs 후위', html: SVG_INC, caption: 'a++ 는 쓰고 나서 증가, ++c 는 증가하고 나서 쓴다 — 혼자 쓰이면 같다',
            notes: '<p><b>[5분]</b> 왼쪽 → 오른쪽 순서로 ①②를 손으로 짚어 설명. 발문: “a 와 c 는 결국 몇?” → 둘 다 6. “b 와 d 는?” → 5 와 6. 차이는 <b>값을 쓰는 순간</b>뿐.</p>' },
          { layout: 'code', title: '증감 연산자 실험', code: `using System;

class Program
{
    static void Main()
    {
        int i = 5;
        i++;  Console.WriteLine(i);   // 6
        ++i;  Console.WriteLine(i);   // 7

        int a = 5;
        int b = a++;                  // b = 5, a = 6
        Console.WriteLine($"a = {a}, b = {b}");
        int c = 5;
        int d = ++c;                  // d = 6, c = 6
        Console.WriteLine($"c = {c}, d = {d}");

        int n = 3;
        Console.WriteLine(n++);       // 3
        Console.WriteLine(++n);       // 5
    }
}`, points: ['<code>i++</code> ≡ <code>i += 1</code> ≡ <code>i = i + 1</code>', '후위: 옛 값을 쓰고 증가', '전위: 증가하고 새 값을 씀', '습관: 증감은 한 줄에 혼자'],
            notes: '<p><b>[5분]</b> <code>WriteLine(n++)</code> 에서 3 이 출력되는 걸 보여 준 뒤 “그럼 지금 n 은?” → 4. <code>a++ + ++a</code> 같은 퀴즈용 코드는 실무에서 쓰지 말 것.</p>' },
          { layout: 'code', title: '비교 · 논리 연산자 — 결과는 bool', code: `using System;

class Program
{
    static void Main()
    {
        int age = 20;
        Console.WriteLine(age == 20);      // True
        Console.WriteLine(age != 20);      // False
        Console.WriteLine(age >= 21);      // False
        bool isAdult = age >= 19;          // bool 변수에 담기
        Console.WriteLine(isAdult);        // True

        bool hasTicket = true, hasId = false;
        Console.WriteLine(hasTicket && hasId);       // False
        Console.WriteLine(hasTicket || hasId);       // True
        Console.WriteLine(!hasId);                   // True
        Console.WriteLine(age >= 13 && age <= 19);   // False 청소년?
        Console.WriteLine(age < 13 || age >= 65);    // False 할인?
    }
}`, points: ['같다는 <code>==</code> (두 개!), 다르다 <code>!=</code>', '<code>&amp;&amp;</code> 둘 다 참, <code>||</code> 하나라도 참, <code>!</code> 뒤집기', '<code>13 &lt;= age &lt;= 19</code> 는 오류 → <code>&amp;&amp;</code> 로 묶기'],
            notes: '<p><b>[7분]</b> 진리표를 칠판에 그리고 학생이 채우게. “청소년(13~19)”을 식으로 써 보게 하고 <code>13 &lt;= age &lt;= 19</code> 를 실제로 컴파일해 오류를 보여 줍니다.</p>' },
          { layout: 'code', title: '단락 평가 (short-circuit)', code: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        bool f = false, t = true;
        bool r1 = f && (++count > 0);   // 오른쪽 실행 안 됨
        Console.WriteLine($"{r1}, count = {count}");
        bool r2 = t || (++count > 0);   // 오른쪽 실행 안 됨
        Console.WriteLine($"{r2}, count = {count}");
        bool r3 = t && (++count > 0);   // 오른쪽 실행됨
        Console.WriteLine($"{r3}, count = {count}");

        int divisor = 0;
        bool ok = divisor != 0 && 10 / divisor > 1;   // 안전!
        Console.WriteLine(ok);
    }
}`, points: ['<code>false &amp;&amp; …</code> → 오른쪽을 보지 않음', '<code>true || …</code> → 오른쪽을 보지 않음', '“0 이 아닐 때만 나누기” 안전 검사에 활용', '<code>&amp;</code> 하나는 항상 둘 다 계산'],
            notes: '<p><b>[5분]</b> count 값으로 오른쪽이 실행됐는지 확인. 마지막 예의 조건 순서를 바꾸면(<code>10 / divisor &gt; 1 &amp;&amp; divisor != 0</code>) DivideByZeroException 이 나는 것을 시연하면 효과적.</p>' },
          { layout: 'diagram', title: '연산자 우선순위', html: SVG_PREC, caption: '산술 → 비교 → 논리 → 삼항 → 대입. 헷갈리면 괄호!',
            notes: '<p><b>[4분]</b> 사다리를 전부 외우게 하지 말고 “산술 &gt; 비교 &gt; 논리 &gt; 대입” 네 단계만. 오른쪽 예제를 ①~⑤ 순서로 따라가며 계산. 괄호는 공짜 — 의심되면 무조건 괄호.</p>' },
          { layout: 'code', title: '우선순위 실험', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(2 + 3 * 4);        // 14
        Console.WriteLine((2 + 3) * 4);      // 20
        Console.WriteLine(10 - 4 - 3);       // 3  왼쪽부터
        Console.WriteLine(100 / 10 / 2);     // 5
        Console.WriteLine(1 + 2 + "3");      // 33
        Console.WriteLine("1" + 2 + 3);      // 123

        int x = 5;
        Console.WriteLine(x > 3 && x < 10);  // True
        Console.WriteLine(x + 1 > 3 * 2);    // False (6 > 6)
        int y = 2;
        y = y * 3 + 4 % 3;                   // 6 + 1
        Console.WriteLine(y);                // 7
    }
}`, points: ['같은 순위는 왼쪽부터', '<code>1 + 2 + "3"</code> vs <code>"1" + 2 + 3</code>', '비교는 산술 뒤, 논리는 비교 뒤'],
            notes: '<p><b>[4분]</b> 실행 전 예측 → 실행. <code>"1" + 2 + 3</code> 이 123 인 이유(왼쪽부터 문자열 연결)를 학생이 설명하게.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>int a = 5;\nint b = a++;\nConsole.WriteLine($"{a} {b}");</code></pre>', options: ['5 5', '6 6', '6 5', '5 6'], answer: 2, explain: '후위 a++ 는 옛 값 5 를 b 에 준 뒤 a 를 6 으로 만듭니다.',
            notes: '<p>정답 공개 후 “<code>++a</code> 였다면?” → 6 6. 이어서 <code>17 % 5 + 17 / 5</code> 도 구두로.</p>' },
          { layout: 'practice', title: '실습 3-1. 거스름돈 동전 개수', desc: '<p>금액을 입력받아 500원 · 100원 · 10원 동전 개수를 출력하세요. <code>/</code> 와 <code>%</code> 만 사용합니다.</p><pre>금액: 1370\n500원 2개, 100원 3개, 10원 7개</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("금액: ");
        int money = int.Parse(Console.ReadLine());
        // TODO: 500원, 100원, 10원 개수
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("금액: ");
        int money = int.Parse(Console.ReadLine());
        int c500 = money / 500;
        int c100 = money % 500 / 100;
        int c10 = money % 100 / 10;
        Console.WriteLine($"500원 {c500}개, 100원 {c100}개, 10원 {c10}개");
    }
}`, stdin: '1370\n',
            notes: '<p><b>[7분]</b> 1370 으로 확인. 힌트: 큰 동전부터 “몫은 개수, 나머지는 다음 동전으로”. 빨리 끝난 학생은 50원 동전을 추가하거나 실습 3-2 로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['산술 <code>+ - * / %</code> — 정수 / 는 몫, % 는 나머지', '복합 대입 <code>x += 5</code> ≡ <code>x = x + 5</code>', '증감 <code>a++</code>(쓰고 증가) vs <code>++a</code>(증가하고 씀)', '비교 <code>== != &lt; &gt; &lt;= &gt;=</code> → bool, 논리 <code>&amp;&amp; || !</code> + 단락 평가', '우선순위: 산술 &gt; 비교 &gt; 논리 &gt; 대입 — 헷갈리면 괄호'],
            notes: '<p>학습 목표 5개를 다시 읽고 확인. 다음 시간: Math 클래스 · 문자열 연산 · 삼항 연산자 · 비트 연산.</p>' }
        ]
      },

      /* ===================== ch03-2 ===================== */
      {
        id: 'ch03-2',
        title: 'Math 클래스 · 문자열 연산 · 삼항 연산자 · 비트 연산',
        minutes: 50,
        goals: [
          'Math 클래스의 Abs · Pow · Sqrt · Max · Min · Round · Floor · Ceiling · PI 를 사용할 수 있다',
          '문자열 연결의 규칙과 == 문자열 비교를 설명할 수 있다',
          '삼항 연산자 ? : 로 조건에 따라 값을 고를 수 있다',
          '비트 연산자(& | ^ ~ << >>)의 기본 동작과 플래그 활용을 이해할 수 있다',
          'checked 로 오버플로를 감지할 수 있고, 형식 변환과 우선순위를 종합해 계산식을 쓸 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['Math 클래스', 12], ['문자열 연산 · 비교', 8], ['삼항 연산자', 10], ['비트 연산 · checked', 8], ['종합 예제 · 퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: 'Math 클래스 — 수학 계산 도구 상자' },
          { type: 'p', html: '제곱근, 절댓값, 반올림처럼 <b>연산자만으로는 힘든 계산</b>은 <code>System.Math</code> 클래스가 해 줍니다. <code>Math.Sqrt(16)</code> 처럼 <b><code>Math.이름(값)</code></b> 형태로 부르며(<code>using System;</code> 이 있으면 바로 사용), 대부분 <code>double</code> 을 돌려줍니다. 원주율 <code>Math.PI</code> 는 메서드가 아니라 <b>값(상수)</b>이므로 괄호를 붙이지 않습니다.' },
          { type: 'table', head: ['메서드 · 상수', '뜻', '예', '결과'], rows: [
            ['<code>Math.Abs(x)</code>', '절댓값', '<code>Math.Abs(-7)</code>', '<code>7</code>'],
            ['<code>Math.Pow(x, y)</code>', 'x 의 y 제곱 (double)', '<code>Math.Pow(2, 10)</code>', '<code>1024</code>'],
            ['<code>Math.Sqrt(x)</code>', '제곱근 (double)', '<code>Math.Sqrt(16)</code>', '<code>4</code>'],
            ['<code>Math.Max(a, b)</code> / <code>Min</code>', '두 값 중 큰 값 / 작은 값', '<code>Math.Max(3, 9)</code>', '<code>9</code>'],
            ['<code>Math.Round(x)</code>', '반올림 (<b>은행가 반올림</b>: .5 는 짝수 쪽으로)', '<code>Math.Round(2.5)</code>', '<code>2</code> (!)'],
            ['<code>Math.Round(x, n)</code>', '소수점 n 자리로 반올림', '<code>Math.Round(3.14159, 2)</code>', '<code>3.14</code>'],
            ['<code>Math.Floor(x)</code>', '내림 (작은 쪽 정수)', '<code>Math.Floor(-3.7)</code>', '<code>-4</code>'],
            ['<code>Math.Ceiling(x)</code>', '올림 (큰 쪽 정수)', '<code>Math.Ceiling(3.2)</code>', '<code>4</code>'],
            ['<code>Math.Truncate(x)</code>', '소수점 버림 (0 쪽으로)', '<code>Math.Truncate(-3.7)</code>', '<code>-3</code>'],
            ['<code>Math.PI</code> / <code>Math.E</code>', '원주율 / 자연상수 (상수, 괄호 없음)', '<code>Math.PI</code>', '<code>3.141592653589793</code>']
          ], caption: '자주 쓰는 Math 멤버 — 결과가 double 이면 int 변수에 넣을 때 (int) 캐스트 필요' },
          { type: 'code', title: '예제 3-7. Math 클래스 사용하기', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(Math.Abs(-7));            // 7
        Console.WriteLine(Math.Pow(2, 10));         // 1024
        Console.WriteLine(Math.Sqrt(16));           // 4
        Console.WriteLine(Math.Sqrt(2));            // 1.4142135623730951
        Console.WriteLine(Math.Max(3, 9));          // 9
        Console.WriteLine(Math.Min(3, 9));          // 3

        Console.WriteLine(Math.Round(3.14159, 2));  // 3.14
        Console.WriteLine(Math.Round(3.5));         // 4
        Console.WriteLine(Math.Round(2.5));         // 2  (!) 은행가 반올림: .5 는 짝수 쪽으로
        Console.WriteLine(Math.Round(2.5, MidpointRounding.AwayFromZero));   // 3  우리가 아는 반올림

        Console.WriteLine(Math.Floor(3.7));         // 3
        Console.WriteLine(Math.Ceiling(3.2));       // 4
        Console.WriteLine(Math.Floor(-3.7));        // -4  (작은 쪽으로)
        Console.WriteLine(Math.Truncate(-3.7));     // -3  (0 쪽으로 버림)
        Console.WriteLine(Math.PI);                 // 3.141592653589793
    }
}`, expect: `7
1024
4
1.4142135623730951
9
3
3.14
4
2
3
3
4
-4
-3
3.141592653589793`, desc: '<b><code>Math.Round(2.5)</code> 가 2 인 것</b>에 주의하세요. .NET 의 기본 반올림은 <b>은행가 반올림(banker\'s rounding)</b>으로, 딱 .5 일 때 <b>짝수 쪽</b>으로 갑니다(2.5 → 2, 3.5 → 4). 학교에서 배운 반올림이 필요하면 <code>MidpointRounding.AwayFromZero</code> 를 넣습니다. 음수에서 <code>Floor</code>(작은 쪽)와 <code>Truncate</code>(0 쪽)가 다르다는 것도 기억하세요.' },
          { type: 'callout', kind: 'tip', title: 'Pow 보다 곱셈', html: '<code>Math.Pow(r, 2)</code> 는 <code>r * r</code> 로 쓰는 것이 더 빠르고 읽기 쉽습니다. <code>Pow</code> 는 세제곱 이상이거나 지수가 변수일 때 씁니다. 또 <code>Math.Pow</code>, <code>Math.Sqrt</code> 의 결과는 <code>double</code> 이므로 <code>int n = (int)Math.Sqrt(16);</code> 처럼 캐스트해야 정수 변수에 넣을 수 있습니다.' },
          { type: 'h', text: '문자열 연산 — 연결과 비교' },
          { type: 'p', html: '문자열에 쓸 수 있는 연산자는 <b><code>+</code>(연결)</b>과 <b><code>==</code>, <code>!=</code>(내용 비교)</b>뿐입니다. <code>+</code> 의 한쪽이라도 문자열이면 다른 쪽을 문자열로 바꿔 <b>이어 붙이고</b>, 왼쪽부터 계산하므로 <code>"점수: " + 90 + 5</code> 는 <code>"점수: 905"</code> 가 됩니다. <code>==</code> 는 두 문자열의 <b>글자가 모두 같은지</b>(대소문자 구분) 비교합니다. 문자열은 <code>&lt;</code>, <code>&gt;</code> 로 크기 비교를 할 수 없고, <code>"10" == 10</code> 처럼 숫자와 직접 비교하면 컴파일 오류입니다.' },
          { type: 'code', title: '예제 3-8. 문자열 연결과 비교', code: `using System;

class Program
{
    static void Main()
    {
        string first = "홍", last = "길동";
        string full = first + last;
        Console.WriteLine(full);                        // 홍길동
        Console.WriteLine(full + "님, " + 20 + "살");   // 홍길동님, 20살
        Console.WriteLine("점수: " + 90 + 5);           // 점수: 905  왼쪽부터 연결!
        Console.WriteLine("점수: " + (90 + 5));         // 점수: 95   괄호로 먼저 더하기
        Console.WriteLine($"점수: {90 + 5}");           // 점수: 95   보간이 가장 안전

        Console.WriteLine(full == "홍길동");            // True  내용이 같은가
        Console.WriteLine(full != "홍길순");            // True
        Console.WriteLine("abc" == "ABC");              // False 대소문자 구분
        Console.WriteLine("abc".ToUpper() == "ABC");    // True  대문자로 맞춘 뒤 비교
        Console.WriteLine("10" == 10.ToString());       // True  둘 다 문자열
        // Console.WriteLine("10" == 10);               // 오류 CS0019: string 과 int 는 비교 불가
        Console.WriteLine(int.Parse("10") == 10);       // True  숫자로 바꾼 뒤 비교
        Console.WriteLine(full.Length * 2);             // 6     Length 는 int → 계산 가능
    }
}`, expect: `홍길동
홍길동님, 20살
점수: 905
점수: 95
점수: 95
True
True
False
True
True
True
6`, desc: '<code>"점수: " + 90 + 5</code> 가 905 가 되는 것은 <code>+</code> 가 <b>왼쪽부터</b> 계산되기 때문입니다. 숫자를 먼저 더하려면 괄호를 쓰거나, 처음부터 보간 문자열 <code>$"…{식}…"</code> 을 쓰세요. 문자열 비교에서 대소문자를 무시하려면 양쪽을 <code>ToUpper()</code>(또는 <code>ToLower()</code>)로 맞춘 뒤 비교합니다. 더 많은 문자열 메서드는 10장에서 다룹니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — string 의 == 는 특별하다', html: '<code>string</code> 은 참조 형식이지만 <code>==</code> 가 <b>내용</b>을 비교하도록 특별히 만들어져 있습니다(8장에서 배울 클래스는 기본적으로 <b>같은 객체인지</b>를 비교합니다). 문화권을 고려한 비교나 대소문자 무시 비교는 <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code>, 정렬 순서 비교는 <code>string.Compare(a, b)</code> 를 씁니다.' },
          { type: 'h', text: '삼항 연산자 — 조건 ? 값1 : 값2' },
          { type: 'p', html: '<b>조건에 따라 두 값 중 하나를 고르는</b> 연산자입니다. 피연산자가 셋이라 삼항(ternary) 또는 조건(conditional) 연산자라고 합니다. <code>score &gt;= 60 ? "합격" : "불합격"</code> 은 “score 가 60 이상이니? 그러면 "합격", 아니면 "불합격"” 입니다. 4장에서 배울 <code>if</code> 문을 <b>값 하나로 줄인 것</b>이라고 생각하면 됩니다.' },
          { type: 'figure', html: SVG_TERNARY, caption: '조건이 true 이면 ? 뒤의 값, false 이면 : 뒤의 값 — 식 전체가 값 하나가 된다' },
          { type: 'code', title: '예제 3-9. 삼항 연산자', code: `using System;

class Program
{
    static void Main()
    {
        int score = 85;
        string result = score >= 60 ? "합격" : "불합격";
        Console.WriteLine(result);                         // 합격

        int a = 7, b = 12;
        int max = a > b ? a : b;                           // 큰 값 고르기
        Console.WriteLine(max);                            // 12
        Console.WriteLine(a % 2 == 0 ? "짝수" : "홀수");   // 홀수
        Console.WriteLine($"{score}점은 {(score >= 90 ? "A" : "B 이하")}");   // 보간 안에서는 괄호로 감싼다

        int age = 15;
        int fee = age < 8 ? 0 : age < 19 ? 500 : 1000;    // 중첩: 8세 미만 0, 19세 미만 500, 나머지 1000
        Console.WriteLine(fee);                            // 500

        string grade = score >= 90 ? "A"
                     : score >= 80 ? "B"
                     : score >= 70 ? "C" : "F";           // 여러 단계는 줄을 나눠 쓰면 읽기 쉽다
        Console.WriteLine(grade);                          // B
    }
}`, expect: `합격
12
홀수
85점은 B 이하
500
B`, desc: '삼항 연산자는 <b>우선순위가 매우 낮아</b>(대입 바로 위) <code>a &gt; b ? a : b</code> 처럼 조건에 괄호를 안 써도 됩니다. 단, <b>보간 문자열 안</b>에서는 <code>:</code> 이 서식 지정자로 오해되므로 <code>{(조건 ? x : y)}</code> 처럼 괄호로 감싸야 합니다. 중첩은 오른쪽부터 묶이므로 등급 판정처럼 <b>단계별로 좁혀 가는</b> 조건에 잘 맞지만, 세 단계를 넘으면 <code>if</code> 문이 낫습니다.' },
          { type: 'callout', kind: 'warn', title: '두 값의 자료형이 달라도 되나?', html: '<code>bool ok = true; var x = ok ? 1 : "하나";</code> 는 <b>컴파일 오류</b>입니다(int 와 string 사이에 공통 자료형이 없음). <code>ok ? 1 : 2.5</code> 처럼 int → double 로 암시적 변환이 되는 조합은 허용되며 결과는 <code>double</code> 입니다.' },
          { type: 'h', text: '비트 연산자 — 2진수 자리 단위 계산' },
          { type: 'p', html: '정수는 컴퓨터 안에서 <b>2진수(0 과 1)</b>로 저장됩니다. 비트 연산자는 이 <b>0/1 자리 하나하나</b>에 대해 계산합니다. 일상 프로그램에서는 드물지만, 하드웨어 제어 · 파일 권한 · 옵션 플래그(여러 개의 on/off 를 정수 하나에 저장) 등에서 쓰입니다. 여기서는 “이런 것이 있다” 정도만 알아 둡니다.' },
          { type: 'table', head: ['연산자', '뜻', '예 (12 = 1100, 10 = 1010)', '결과'], rows: [
            ['<code>&amp;</code>', 'AND — 둘 다 1 이면 1', '<code>12 &amp; 10</code> → 1000', '<code>8</code>'],
            ['<code>|</code>', 'OR — 하나라도 1 이면 1', '<code>12 | 10</code> → 1110', '<code>14</code>'],
            ['<code>^</code>', 'XOR — 서로 다르면 1', '<code>12 ^ 10</code> → 0110', '<code>6</code>'],
            ['<code>~</code>', 'NOT — 모든 비트 뒤집기', '<code>~12</code>', '<code>-13</code>'],
            ['<code>&lt;&lt;</code>', '왼쪽 이동 — 한 칸에 ×2', '<code>1 &lt;&lt; 3</code>', '<code>8</code>'],
            ['<code>&gt;&gt;</code>', '오른쪽 이동 — 한 칸에 ÷2', '<code>40 &gt;&gt; 2</code>', '<code>10</code>']
          ], caption: '비트 연산자 — 0b1100 처럼 2진수 리터럴(0b 접두사)로 쓰면 눈으로 확인하기 쉽다' },
          { type: 'code', title: '예제 3-10. 비트 연산과 플래그', code: `using System;

class Program
{
    static void Main()
    {
        int a = 0b1100;   // 12  (0b = 2진수 리터럴)
        int b = 0b1010;   // 10
        Console.WriteLine(a & b);    // 8   1000
        Console.WriteLine(a | b);    // 14  1110
        Console.WriteLine(a ^ b);    // 6   0110
        Console.WriteLine(~a);       // -13 모든 비트 뒤집기
        Console.WriteLine(1 << 3);   // 8   1 을 왼쪽으로 3칸 = 1 × 2³
        Console.WriteLine(40 >> 2);  // 10  오른쪽으로 2칸 = 40 ÷ 4
        Console.WriteLine(Convert.ToString(a ^ b, 2));   // 110  (2진수 문자열로 보기)

        // 플래그: 권한 3개를 정수 하나에 저장한다
        const int Read = 1, Write = 2, Exec = 4;   // 001, 010, 100
        int perm = Read | Write;                    // 011 → 3  (읽기 + 쓰기)
        Console.WriteLine(perm);                    // 3
        Console.WriteLine((perm & Write) != 0);     // True   쓰기 권한이 있나?
        Console.WriteLine((perm & Exec) != 0);      // False  실행 권한이 있나?
        perm |= Exec;                               // 실행 권한 추가 → 111
        Console.WriteLine(perm);                    // 7
        perm &= ~Write;                             // 쓰기 권한 제거 → 101
        Console.WriteLine(perm);                    // 5
    }
}`, expect: `8
14
6
-13
8
10
110
3
True
False
7
5`, desc: '플래그(flag)는 <b>on/off 여러 개를 비트 하나씩에 담는</b> 기법입니다. <code>|</code> 로 켜고, <code>&amp; ~</code> 로 끄고, <code>&amp;</code> 로 켜져 있는지 확인합니다. WPF 에서 <code>Keyboard.Modifiers &amp; ModifierKeys.Control</code>(Ctrl 키가 눌렸나?) 같은 곳에서 다시 만나게 됩니다. 비교 <code>!=</code> 가 <code>&amp;</code> 보다 먼저 계산되므로 <code>(perm &amp; Write) != 0</code> 의 괄호는 필수입니다.' },
          { type: 'h', text: 'checked — 오버플로 감지' },
          { type: 'p', html: '2장에서 <code>int.MaxValue + 1</code> 이 조용히 음수가 되는 <b>오버플로</b>를 보았습니다. 기본 설정(<code>unchecked</code>)에서는 오류 없이 넘어가지만, <b><code>checked</code></b> 로 감싸면 범위를 넘는 순간 <code>OverflowException</code> 이 발생해 잘못된 값이 퍼지는 것을 막을 수 있습니다. 돈 계산처럼 “틀린 값보다 멈추는 것이 낫다” 싶을 때 씁니다.' },
          { type: 'code', title: '추가 예제. checked 로 오버플로 감지하기', code: `using System;

class Program
{
    static void Main()
    {
        int big = int.MaxValue;
        Console.WriteLine(big + 1);              // -2147483648  기본(unchecked): 조용히 넘어간다

        try
        {
            int r = checked(big + 1);            // 범위를 넘는 순간 OverflowException
            Console.WriteLine(r);                // 실행되지 않는다
        }
        catch (OverflowException)
        {
            Console.WriteLine("checked: 오버플로가 감지되었습니다!");
        }

        long safe = (long)big + 1;               // 더 큰 자료형을 쓰면 애초에 문제없다
        Console.WriteLine(safe);                 // 2147483648
    }
}`, expect: `-2147483648
checked: 오버플로가 감지되었습니다!
2147483648`, desc: '<code>try { … } catch { … }</code> 는 10장에서 배울 <b>예외 처리</b>입니다. 지금은 “try 안에서 오류가 나면 catch 블록으로 건너뛴다”만 알면 됩니다. <code>checked { … }</code> 블록 형태로 여러 문장을 한꺼번에 감쌀 수도 있고, 프로젝트 설정으로 전체를 checked 로 만들 수도 있습니다. 참고로 <code>int.MaxValue + 1</code> 처럼 <b>상수끼리</b>의 오버플로는 컴파일러가 미리 잡아 오류(CS0220)를 냅니다.' },
          { type: 'h', text: '종합 예제 — 형식 변환 · 우선순위 · Math · 삼항' },
          { type: 'code', title: '예제 3-11. BMI 계산기', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("키(cm): ");
        double heightCm = double.Parse(Console.ReadLine());
        Console.Write("몸무게(kg): ");
        double weight = double.Parse(Console.ReadLine());

        double m = heightCm / 100;                 // cm → m (double / int → double)
        double bmi = weight / (m * m);             // 괄호 필수: weight / m * m 은 weight 그대로!
        Console.WriteLine($"BMI = {bmi:F1}");
        Console.WriteLine($"반올림 = {Math.Round(bmi)}");

        string status = bmi < 18.5 ? "저체중"
                      : bmi < 23 ? "정상"
                      : bmi < 25 ? "과체중" : "비만";
        Console.WriteLine($"판정: {status}");

        double standard = 22 * m * m;              // 표준 체중 (BMI 22 기준)
        int diff = (int)Math.Abs(weight - standard);   // 차이의 절댓값을 정수로
        Console.WriteLine($"표준 체중과 차이: 약 {diff}kg");
    }
}`, stdin: '175\n70\n', expect: `키(cm): 몸무게(kg): BMI = 22.9
반올림 = 23
판정: 정상
표준 체중과 차이: 약 2kg`, desc: '이 장의 내용이 한 프로그램에 모여 있습니다. <code>weight / (m * m)</code> 의 괄호를 빼면 <code>weight / m * m</code> 이 왼쪽부터 계산되어 <code>weight</code> 가 그대로 나옵니다 — <b>우선순위 실수의 대표 사례</b>입니다. <code>(int)Math.Abs(…)</code> 는 캐스트가 <code>Math.Abs</code> 의 결과(double)에 적용됩니다(메서드 호출이 캐스트보다 먼저).' }
        ],
        practice: [
          {
            title: '실습 3-3. 원의 넓이와 둘레',
            level: 1,
            desc: '<p>반지름을 입력받아 원의 넓이(<code>πr²</code>)와 둘레(<code>2πr</code>)를 소수점 2자리로 출력하세요. <code>Math.PI</code> 를 사용합니다.</p><pre>반지름: 5\n넓이: 78.54\n둘레: 31.42</pre>',
            hint: '<code>double area = Math.PI * r * r;</code> 출력은 <code>{area:F2}</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("반지름: ");
        double r = double.Parse(Console.ReadLine());
        // TODO: 넓이, 둘레 계산

        // TODO: 소수점 2자리로 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("반지름: ");
        double r = double.Parse(Console.ReadLine());
        double area = Math.PI * r * r;
        double circumference = 2 * Math.PI * r;
        Console.WriteLine($"넓이: {area:F2}");
        Console.WriteLine($"둘레: {circumference:F2}");
    }
}
`,
            stdin: '5\n',
            expect: `반지름: 넓이: 78.54
둘레: 31.42`
          },
          {
            title: '실습 3-4. 세 수 중 최댓값 — 삼항 연산자로',
            level: 2,
            desc: '<p>정수 세 개를 입력받아 <b><code>Math.Max</code> 없이 삼항 연산자만으로</b> 최댓값과 최솟값을 구해 출력하세요.</p><pre>첫 번째 수: 12\n두 번째 수: 45\n세 번째 수: 7\n최댓값: 45, 최솟값: 7</pre>',
            hint: '먼저 a 와 b 중 큰 값을 고르고, 그 값과 c 를 다시 비교합니다: <code>int max = a &gt; b ? (a &gt; c ? a : c) : (b &gt; c ? b : c);</code> 또는 두 단계로 <code>int ab = a &gt; b ? a : b; int max = ab &gt; c ? ab : c;</code>',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째 수: ");
        int c = int.Parse(Console.ReadLine());
        // TODO: 삼항 연산자로 최댓값, 최솟값 구하기

        // TODO: "최댓값: n, 최솟값: n" 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째 수: ");
        int c = int.Parse(Console.ReadLine());
        int max = a > b ? (a > c ? a : c) : (b > c ? b : c);
        int min = a < b ? (a < c ? a : c) : (b < c ? b : c);
        Console.WriteLine($"최댓값: {max}, 최솟값: {min}");
    }
}
`,
            stdin: '12\n45\n7\n',
            expect: `첫 번째 수: 두 번째 수: 세 번째 수: 최댓값: 45, 최솟값: 7`
          }
        ],
        quiz: [
          { q: '<code>Console.WriteLine(Math.Round(2.5));</code> 의 출력은?', options: ['3', '2', '2.5', '오류'], answer: 1, explain: '.NET 의 기본 반올림은 은행가 반올림 — .5 는 짝수 쪽(2)으로 갑니다. 3 을 원하면 <code>MidpointRounding.AwayFromZero</code>.' },
          { q: '<code>Console.WriteLine(1 + 2 + "3");</code> 의 출력은?', options: ['6', '123', '33', '컴파일 오류'], answer: 2, explain: '왼쪽부터: <code>1 + 2</code> = 3, 그 다음 <code>3 + "3"</code> 은 문자열 연결 → "33".' },
          { q: '다음 코드의 출력은?<pre><code>int x = 7;\nConsole.WriteLine(x % 2 == 0 ? "짝" : "홀");</code></pre>', options: ['홀', '짝', 'True', 'False'], answer: 0, explain: '<code>7 % 2</code> = 1 이므로 조건 <code>1 == 0</code> 은 false → <code>:</code> 뒤의 "홀".' },
          { q: '<code>Console.WriteLine(6 | 3);</code> 의 출력은? (6 = 110, 3 = 011)', options: ['2', '5', '7', '9'], answer: 2, explain: 'OR 은 하나라도 1 이면 1: 110 | 011 = 111 = 7. (<code>6 &amp; 3</code> 은 010 = 2)' },
          { q: '<code>int r = checked(int.MaxValue + 1);</code> 대신 변수 <code>big = int.MaxValue</code> 로 <code>checked(big + 1)</code> 을 실행하면?', options: ['-2147483648 이 된다', '0 이 된다', '2147483648 이 된다', 'OverflowException 이 발생한다'], answer: 3, explain: '<code>checked</code> 안에서 범위를 넘으면 예외가 발생합니다. 기본(unchecked)에서는 -2147483648 로 조용히 넘어갑니다.' }
        ],
        slides: [
          { layout: 'title', title: 'Math 클래스 · 문자열 연산 · 삼항 연산자 · 비트 연산', subtitle: 'Chapter 03 · Section 02', badge: '03-2',
            notes: '<p><b>[도입 3분]</b> 복습 퀴즈: “<code>a++</code> 와 <code>++a</code> 의 차이는?” “<code>2 + 3 * 4</code> 는?” 오늘은 연산자만으로 부족한 계산(제곱근 · 반올림)과, 값을 고르는 연산자(삼항)를 배운다.</p>' },
          { layout: 'table', title: 'Math 클래스 — 수학 도구 상자', head: ['멤버', '뜻', '예 → 결과'], rows: [['<code>Abs</code>', '절댓값', '<code>Math.Abs(-7)</code> → 7'], ['<code>Pow</code> / <code>Sqrt</code>', '거듭제곱 / 제곱근', '<code>Math.Pow(2, 10)</code> → 1024, <code>Math.Sqrt(16)</code> → 4'], ['<code>Max</code> / <code>Min</code>', '큰 값 / 작은 값', '<code>Math.Max(3, 9)</code> → 9'], ['<code>Round</code>', '반올림 (은행가!)', '<code>Math.Round(2.5)</code> → <b>2</b>, <code>Round(3.5)</code> → 4'], ['<code>Floor</code> / <code>Ceiling</code>', '내림 / 올림', '<code>Floor(-3.7)</code> → -4, <code>Ceiling(3.2)</code> → 4'], ['<code>PI</code>', '원주율 (상수, 괄호 없음)', '3.141592653589793']],
            lead: 'Math.이름(값) 형태 — 결과는 대부분 double',
            notes: '<p><b>[5분]</b> <code>Math.PI</code> 에 괄호를 붙이는 실수가 많습니다. <code>Round(2.5) = 2</code> 에서 학생들이 놀라는데, 은행가 반올림(짝수 쪽) 이야기를 1분만.</p>' },
          { layout: 'code', title: 'Math 실험 — 반올림 · 내림 · 올림', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(Math.Sqrt(2));           // 1.4142135623730951
        Console.WriteLine(Math.Pow(2, 10));        // 1024
        Console.WriteLine(Math.Max(3, 9));         // 9

        Console.WriteLine(Math.Round(3.5));        // 4
        Console.WriteLine(Math.Round(2.5));        // 2 (!)
        Console.WriteLine(Math.Round(2.5, MidpointRounding.AwayFromZero)); // 3
        Console.WriteLine(Math.Round(3.14159, 2)); // 3.14

        Console.WriteLine(Math.Floor(-3.7));       // -4
        Console.WriteLine(Math.Ceiling(3.2));      // 4
        Console.WriteLine(Math.Truncate(-3.7));    // -3
        Console.WriteLine((int)Math.Sqrt(16));     // 4 (int 로)
    }
}`, points: ['<code>Round(2.5)</code> → 2, <code>Round(3.5)</code> → 4', '<code>AwayFromZero</code> 로 학교식 반올림', 'Floor 는 작은 쪽, Truncate 는 0 쪽', '결과가 double → int 에 넣을 땐 캐스트'],
            notes: '<p><b>[6분]</b> 값을 바꿔 가며 실행. 발문: “<code>Math.Round(-2.5)</code> 는?” → -2. “<code>(int)3.7</code> 과 <code>Math.Floor(3.7)</code> 은 같은가? <code>-3.7</code> 이면?” → 다르다(-3 vs -4).</p>' },
          { layout: 'code', title: '문자열 연결과 비교', code: `using System;

class Program
{
    static void Main()
    {
        string full = "홍" + "길동";
        Console.WriteLine(full + "님, " + 20 + "살");   // 홍길동님, 20살
        Console.WriteLine("점수: " + 90 + 5);           // 점수: 905 !
        Console.WriteLine("점수: " + (90 + 5));         // 점수: 95
        Console.WriteLine($"점수: {90 + 5}");           // 점수: 95

        Console.WriteLine(full == "홍길동");            // True
        Console.WriteLine("abc" == "ABC");              // False
        Console.WriteLine("abc".ToUpper() == "ABC");    // True
        Console.WriteLine("10" == 10.ToString());       // True
        // Console.WriteLine("10" == 10);               // 오류 CS0019
    }
}`, points: ['<code>+</code> 는 왼쪽부터 → 문자열을 만나면 연결', '<code>==</code> 는 내용 비교 (대소문자 구분)', '문자열 vs 숫자 비교는 오류 → 변환 먼저', '보간 문자열이 가장 안전'],
            notes: '<p><b>[5분]</b> <code>"점수: " + 90 + 5</code> 를 예측시키면 절반이 95 라고 답합니다. 실행으로 905 를 확인. “대소문자 무시하고 비교하려면?” → ToUpper 로 맞춘다.</p>' },
          { layout: 'diagram', title: '삼항 연산자 — 조건 ? 값1 : 값2', html: SVG_TERNARY, caption: '조건이 참이면 ? 뒤, 거짓이면 : 뒤 — 식 전체가 값 하나',
            notes: '<p><b>[4분]</b> “조건이 참이니? 그러면 이거, 아니면 저거”로 읽는 법을 가르칩니다. if 문을 아직 안 배웠으니 “값을 고르는 연산자”로만. 두 값의 자료형이 같아야 한다는 점.</p>' },
          { layout: 'code', title: '삼항 연산자 실험', code: `using System;

class Program
{
    static void Main()
    {
        int score = 85;
        string result = score >= 60 ? "합격" : "불합격";
        Console.WriteLine(result);                        // 합격

        int a = 7, b = 12;
        int max = a > b ? a : b;
        Console.WriteLine(max);                           // 12
        Console.WriteLine(a % 2 == 0 ? "짝수" : "홀수");  // 홀수
        Console.WriteLine($"{score}점 {(score >= 90 ? "A" : "B 이하")}");

        string grade = score >= 90 ? "A"
                     : score >= 80 ? "B"
                     : score >= 70 ? "C" : "F";           // 중첩
        Console.WriteLine(grade);                         // B
    }
}`, points: ['큰 값 고르기: <code>a &gt; b ? a : b</code>', '보간 안에서는 <code>{(…)}</code> 괄호 필수', '중첩은 오른쪽부터 — 단계별 판정에 적합', '3단계 넘으면 if 문이 낫다'],
            notes: '<p><b>[6분]</b> score 를 95, 72, 40 으로 바꿔 grade 가 어떻게 되는지 확인. 보간 안의 괄호를 빼고 컴파일해 오류를 보여 주면 기억에 남습니다.</p>' },
          { layout: 'table', title: '비트 연산자 (맛보기)', head: ['연산자', '뜻', '예 (12 = 1100, 10 = 1010)'], rows: [['<code>&amp;</code>', 'AND: 둘 다 1', '<code>12 &amp; 10</code> → 1000 = 8'], ['<code>|</code>', 'OR: 하나라도 1', '<code>12 | 10</code> → 1110 = 14'], ['<code>^</code>', 'XOR: 서로 다르면 1', '<code>12 ^ 10</code> → 0110 = 6'], ['<code>~</code>', 'NOT: 뒤집기', '<code>~12</code> → -13'], ['<code>&lt;&lt;</code> <code>&gt;&gt;</code>', '이동: ×2 / ÷2', '<code>1 &lt;&lt; 3</code> → 8, <code>40 &gt;&gt; 2</code> → 10']],
            lead: '2진수 자리 하나하나에 대한 계산 — 플래그 · 하드웨어 제어에 사용',
            notes: '<p><b>[3분]</b> 칠판에 1100 과 1010 을 위아래로 쓰고 &amp;, |, ^ 를 자리별로 계산. “일상 코드에서는 드물다, 있다는 것만 알자”.</p>' },
          { layout: 'code', title: '비트 플래그 — on/off 여러 개를 정수 하나에', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(0b1100 & 0b1010);   // 8
        Console.WriteLine(0b1100 | 0b1010);   // 14
        Console.WriteLine(1 << 3);            // 8

        const int Read = 1, Write = 2, Exec = 4;   // 001 010 100
        int perm = Read | Write;                    // 011 = 3
        Console.WriteLine(perm);
        Console.WriteLine((perm & Write) != 0);     // True  쓰기 권한?
        Console.WriteLine((perm & Exec) != 0);      // False 실행 권한?
        perm |= Exec;                               // 켜기 → 7
        perm &= ~Write;                             // 끄기 → 5
        Console.WriteLine(perm);
    }
}`, points: ['켜기 <code>|=</code>, 끄기 <code>&amp;= ~</code>, 확인 <code>&amp;</code>', '<code>(perm &amp; Write) != 0</code> 의 괄호 필수', 'WPF 의 Ctrl/Shift 키 확인에서 다시 만남'],
            notes: '<p><b>[4분]</b> 권한 예로 “읽기 + 쓰기 = 3” 이 되는 원리를 2진수로 설명. 괄호를 빼면 <code>Write != 0</code> 이 먼저 계산되는 문제를 언급.</p>' },
          { layout: 'code', title: 'checked — 오버플로 감지', code: `using System;

class Program
{
    static void Main()
    {
        int big = int.MaxValue;
        Console.WriteLine(big + 1);       // -2147483648 (조용히)

        try
        {
            int r = checked(big + 1);     // OverflowException!
            Console.WriteLine(r);
        }
        catch (OverflowException)
        {
            Console.WriteLine("오버플로 감지!");
        }

        long safe = (long)big + 1;        // 큰 자료형이면 OK
        Console.WriteLine(safe);          // 2147483648
    }
}`, points: ['기본은 unchecked: 조용히 넘어감', '<code>checked(식)</code> / <code>checked { … }</code>', 'try/catch 는 10장 — “오류 나면 catch 로”', '큰 수는 처음부터 long'],
            notes: '<p><b>[3분]</b> “틀린 값이 조용히 퍼지는 것 vs 멈추는 것, 어느 쪽이 나은가?” — 돈 계산이라면 멈추는 쪽. try/catch 는 지금은 형태만.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Console.WriteLine(Math.Round(2.5));</code> 의 출력은?', options: ['3', '2', '2.5', '오류'], answer: 1, explain: '은행가 반올림: .5 는 짝수 쪽으로.',
            notes: '<p>이어서 “<code>Math.Round(3.5)</code> 는?” → 4. “<code>1 + 2 + "3"</code> 은?” → 33.</p>' },
          { layout: 'practice', title: '실습 3-4. 세 수 중 최댓값 — 삼항 연산자로', desc: '<p>정수 세 개를 입력받아 <code>Math.Max</code> 없이 <b>삼항 연산자만으로</b> 최댓값과 최솟값을 출력하세요.</p><pre>최댓값: 45, 최솟값: 7</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째 수: ");
        int c = int.Parse(Console.ReadLine());
        // TODO: 삼항 연산자로 최댓값, 최솟값
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());
        Console.Write("세 번째 수: ");
        int c = int.Parse(Console.ReadLine());
        int max = a > b ? (a > c ? a : c) : (b > c ? b : c);
        int min = a < b ? (a < c ? a : c) : (b < c ? b : c);
        Console.WriteLine($"최댓값: {max}, 최솟값: {min}");
    }
}`, stdin: '12\n45\n7\n',
            notes: '<p><b>[7분]</b> 12, 45, 7 로 확인. 힌트: “먼저 a 와 b 중 큰 것을 고르고, 그것과 c 를 비교”. 두 단계로 나눠 쓰는 풀이(<code>int ab = a &gt; b ? a : b;</code>)도 정답. 빨리 끝나면 실습 3-3(원의 넓이)도.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Math.Abs · Pow · Sqrt · Max · Min · Round · Floor · Ceiling · PI</code>', '<code>Round(2.5)</code> = 2 (은행가 반올림) — 학교식은 <code>AwayFromZero</code>', '문자열 <code>+</code> 는 왼쪽부터 연결, <code>==</code> 는 내용 비교', '삼항 <code>조건 ? 값1 : 값2</code> — 값을 고를 때, 보간 안에서는 괄호', '비트 <code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code> 와 플래그, <code>checked</code> 로 오버플로 감지'],
            notes: '<p>학습 목표 확인. 다음 장: 조건문(if · switch) — 오늘 만든 bool 식과 삼항 연산자가 그대로 쓰인다.</p>' }
        ]
      }
    ]
  });
})();
