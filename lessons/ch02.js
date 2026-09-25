/* Chapter 02. 변수와 자료형 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_VAR = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="변수는 이름 붙은 메모리 상자">
  <defs><marker id="ah2a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">int age = 20;   →   메모리에 int 크기(4바이트)의 상자를 만들고 age 라는 이름표를 붙인 뒤 20을 넣는다</text>
  <g>
    <rect x="120" y="150" width="220" height="120" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="230" y="140" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent)">age (int)</text>
    <text x="230" y="225" text-anchor="middle" style="${MONO};font-size:44px;fill:var(--fg)">20</text>
    <text x="230" y="305" text-anchor="middle" style="font-size:20px;fill:var(--muted)">4 바이트 · 정수만</text>
  </g>
  <g>
    <rect x="420" y="150" width="220" height="120" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="530" y="140" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent2)">height (double)</text>
    <text x="530" y="225" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">175.5</text>
    <text x="530" y="305" text-anchor="middle" style="font-size:20px;fill:var(--muted)">8 바이트 · 실수</text>
  </g>
  <g>
    <rect x="720" y="150" width="220" height="120" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="830" y="140" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--ok)">isStudent (bool)</text>
    <text x="830" y="225" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">true</text>
    <text x="830" y="305" text-anchor="middle" style="font-size:20px;fill:var(--muted)">1 바이트 · 참/거짓</text>
  </g>
  <g>
    <rect x="1020" y="150" width="220" height="120" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
    <text x="1130" y="140" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--warn)">name (string)</text>
    <text x="1130" y="225" text-anchor="middle" style="${MONO};font-size:36px;fill:var(--fg)">"홍길동"</text>
    <text x="1130" y="305" text-anchor="middle" style="font-size:20px;fill:var(--muted)">글자 수만큼 · 문자열</text>
  </g>
  <text x="640" y="400" text-anchor="middle" style="font-size:24px;fill:var(--fg)">상자마다 <tspan font-weight="700">자료형(type)</tspan>이 정해져 있어 다른 종류의 값은 넣을 수 없다 (정수 상자에 "홍길동" ✗)</text>
  <text x="640" y="450" text-anchor="middle" style="font-size:24px;fill:var(--fg)">값은 바꿀 수 있다: <tspan style="${MONO}">age = 21;</tspan>  →  상자 안의 20 이 21 로 바뀐다 (이름은 그대로)</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--muted)">C# 은 정적 타입 언어: 컴파일러가 자료형을 미리 검사해 실수를 잡아 준다</text>
</svg>`;

  const SVG_CONV = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="암시적 변환과 명시적 변환">
  <defs><marker id="ah2b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  <marker id="ah2c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker></defs>
  <text x="330" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">암시적 변환 (implicit) — 안전, 자동</text>
  <text x="950" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--danger)">명시적 변환 (explicit) — 손실 가능, (형) 캐스트</text>
  <rect x="80" y="100" width="200" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="180" y="140" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">int</text>
  <text x="180" y="172" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">100</text>
  <line x1="290" y1="145" x2="380" y2="145" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah2b)"/>
  <rect x="390" y="100" width="200" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="490" y="140" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">double</text>
  <text x="490" y="172" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">100.0</text>
  <text x="330" y="230" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">double d = 100;   // OK</text>
  <text x="330" y="270" text-anchor="middle" style="font-size:21px;fill:var(--muted)">작은 그릇 → 큰 그릇: 잃는 것이 없다</text>
  <text x="330" y="330" text-anchor="middle" style="font-size:21px;fill:var(--muted)">byte → short → int → long → float → double</text>
  <text x="330" y="365" text-anchor="middle" style="font-size:21px;fill:var(--muted)">char → int (문자 코드)</text>
  <rect x="700" y="100" width="200" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="800" y="140" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">double</text>
  <text x="800" y="172" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">3.99</text>
  <line x1="910" y1="145" x2="1000" y2="145" stroke="var(--danger)" stroke-width="4" marker-end="url(#ah2c)"/>
  <text x="955" y="125" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--danger)">(int)</text>
  <rect x="1010" y="100" width="200" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="1110" y="140" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">int</text>
  <text x="1110" y="172" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--muted)">3</text>
  <text x="950" y="230" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">int n = (int)3.99;   // 3 (소수점 버림)</text>
  <text x="950" y="270" text-anchor="middle" style="font-size:21px;fill:var(--muted)">큰 그릇 → 작은 그릇: 넘치는 부분은 버려진다</text>
  <text x="950" y="330" text-anchor="middle" style="font-size:21px;fill:var(--muted)">캐스트 없이 쓰면 컴파일 오류 CS0266</text>
  <text x="950" y="365" text-anchor="middle" style="font-size:21px;fill:var(--muted)">(int)300.7 → 300,  (byte)300 → 44 (넘침!)</text>
  <line x1="640" y1="80" x2="640" y2="400" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)">문자열 ↔ 숫자는 캐스트가 아니라 <tspan style="${MONO}" font-weight="700">int.Parse("12")</tspan> · <tspan style="${MONO}" font-weight="700">12.ToString()</tspan> · <tspan style="${MONO}" font-weight="700">Convert.ToInt32(…)</tspan></text>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--muted)">"12" 는 글자 두 개일 뿐 숫자가 아니다 — 변환 메서드가 글자를 읽어 값을 만든다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch02',
    no: '02',
    title: '변수와 자료형',
    subtitle: 'Variables & Data Types',
    summary: '값을 이름에 담아 두는 변수와, 정수 · 실수 · 문자 · 문자열 · 논리형 같은 C# 의 기본 자료형을 배웁니다. 상수, var, 형 변환(암시적 · 명시적 · Parse/TryParse)과 입력 처리까지 익힙니다.',
    goals: [
      '변수를 선언 · 초기화 · 대입하고 이름 규칙을 지킬 수 있다',
      'int · long · double · decimal · bool · char · string 의 용도와 범위를 설명할 수 있다',
      'const 상수와 var 암시적 형식을 알맞게 사용할 수 있다',
      '암시적 · 명시적 형 변환의 차이와 데이터 손실을 설명할 수 있다',
      'int.Parse · TryParse · Convert · ToString 으로 문자열과 숫자를 변환할 수 있다'
    ],
    sections: [
      /* ===================== ch02-1 ===================== */
      {
        id: 'ch02-1',
        title: '변수와 기본 자료형',
        minutes: 50,
        goals: [
          '변수 선언 · 초기화 · 대입의 의미를 설명할 수 있다',
          '정수형(int, long) · 실수형(double, float, decimal) · bool · char · string 을 구분해 쓸 수 있다',
          'const 상수와 var 를 사용할 수 있다',
          '변수 이름 규칙(카멜 표기법)을 지킬 수 있다'
        ],
        flow: [['도입: 값을 기억하는 상자', 5], ['변수 선언 · 대입', 10], ['기본 자료형 표 · 예제', 18], ['const · var · 이름 규칙', 10], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: '변수(variable) — 값을 담는 이름 붙은 상자' },
          { type: 'p', html: '프로그램은 계산 결과, 사용자 입력, 점수처럼 <b>값을 기억</b>해 두었다가 다시 써야 합니다. <b>변수</b>는 메모리에 마련한 <b>이름 붙은 저장 공간</b>이고, C# 에서는 변수를 만들 때 <b>어떤 종류의 값을 담을지(자료형, type)</b> 를 반드시 정합니다.' },
          { type: 'figure', html: SVG_VAR, caption: '변수 = 자료형이 정해진 메모리 상자 + 이름표. 값은 바꿀 수 있지만 자료형은 바꿀 수 없다' },
          { type: 'code', title: '예제 2-1. 변수 선언 · 초기화 · 대입', code: `using System;

class Program
{
    static void Main()
    {
        int age;              // 선언(declaration): int 상자 age 를 만든다
        age = 20;             // 대입(assignment): 값을 넣는다
        Console.WriteLine(age);

        int score = 95;       // 선언과 동시에 초기화(initialization)
        Console.WriteLine(score);

        score = score + 5;    // 오른쪽을 먼저 계산해 다시 넣는다 (= 는 "같다"가 아니라 "넣어라")
        Console.WriteLine(score);

        int a = 1, b = 2, c = 3;   // 같은 자료형은 한 줄에 여러 개 선언 가능
        Console.WriteLine(a + b + c);
    }
}`, expect: `20
95
100
6`, desc: '<code>=</code> 는 수학의 “같다”가 아니라 <b>오른쪽 값을 왼쪽 변수에 넣어라</b>는 뜻입니다. 그래서 <code>score = score + 5;</code> 가 말이 됩니다. 값을 넣지 않은 변수를 읽으면 컴파일 오류(CS0165)가 납니다 — C# 은 <b>초기화되지 않은 변수 사용을 금지</b>합니다.' },
          { type: 'h', text: '기본 자료형 (built-in types)' },
          { type: 'table', head: ['자료형', '종류', '크기', '범위 · 특징', '리터럴 예'], rows: [
            ['<code>int</code>', '정수', '4 바이트', '약 ±21억 (-2,147,483,648 ~ 2,147,483,647). <b>가장 많이 쓰는 정수</b>', '<code>100</code>, <code>-7</code>'],
            ['<code>long</code>', '정수', '8 바이트', '약 ±922경. 큰 정수(인구, 바이트 수)', '<code>10000000000L</code>'],
            ['<code>byte</code> / <code>short</code>', '정수', '1 / 2 바이트', '0~255 / ±32767. 메모리 절약 · 바이너리 처리', '<code>(byte)200</code>'],
            ['<code>double</code>', '실수', '8 바이트', '유효 숫자 약 15자리. <b>기본 실수형</b>', '<code>3.14</code>, <code>1.5e3</code>'],
            ['<code>float</code>', '실수', '4 바이트', '유효 숫자 약 7자리. 게임 · 그래픽', '<code>3.14f</code>'],
            ['<code>decimal</code>', '실수', '16 바이트', '유효 숫자 28자리, 오차 없는 십진 계산. <b>돈 계산</b>', '<code>19.99m</code>'],
            ['<code>bool</code>', '논리', '1 바이트', '<code>true</code> 또는 <code>false</code> 만', '<code>true</code>'],
            ['<code>char</code>', '문자', '2 바이트', '유니코드 문자 <b>한 글자</b>. 작은따옴표', "<code>'A'</code>, <code>'가'</code>"],
            ['<code>string</code>', '문자열', '가변', '문자들의 나열. 큰따옴표. (참조 형식)', '<code>"안녕"</code>, <code>""</code>']
          ], caption: 'C# 의 기본 자료형 — 정수는 int, 실수는 double, 돈은 decimal 이 기본 선택' },
          { type: 'code', title: '예제 2-2. 자료형별 변수 선언과 출력', code: `using System;

class Program
{
    static void Main()
    {
        int count = 42;
        long population = 8100000000L;      // int 범위를 넘으므로 L 접미사
        double pi = 3.141592;
        float ratio = 0.75f;                // f 접미사가 없으면 double 로 취급되어 오류
        decimal price = 19.99m;             // m 접미사
        bool isOpen = true;
        char grade = 'A';
        string name = "홍길동";

        Console.WriteLine($"count = {count}");
        Console.WriteLine($"population = {population:N0}");
        Console.WriteLine($"pi = {pi}");
        Console.WriteLine($"ratio = {ratio}");
        Console.WriteLine($"price = {price}");
        Console.WriteLine($"isOpen = {isOpen}");
        Console.WriteLine($"grade = {grade}");
        Console.WriteLine($"name = {name}");
        Console.WriteLine($"int 최댓값 = {int.MaxValue}, long 최댓값 = {long.MaxValue}");
    }
}`, expect: `count = 42
population = 8,100,000,000
pi = 3.141592
ratio = 0.75
price = 19.99
isOpen = True
grade = A
name = 홍길동
int 최댓값 = 2147483647, long 최댓값 = 9223372036854775807`, desc: '실수 리터럴은 기본이 <code>double</code> 이므로 <code>float</code> 에는 <code>f</code>, <code>decimal</code> 에는 <code>m</code>, 큰 정수에는 <code>L</code> 을 붙입니다. <code>bool</code> 값은 <code>True</code>/<code>False</code> 로 출력됩니다. <code>int.MaxValue</code> 처럼 자료형마다 최댓값 · 최솟값 상수가 있습니다.' },
          { type: 'callout', kind: 'warn', title: '실수(double)는 정확하지 않다', html: '<code>0.1 + 0.2</code> 는 <code>0.30000000000000004</code> 입니다. 컴퓨터는 실수를 2진수로 저장하므로 0.1 같은 값이 딱 떨어지지 않습니다. 소수점이 중요한 <b>돈 계산은 <code>decimal</code></b> 을 쓰고, 실수끼리 <code>==</code> 로 비교하지 마세요. 아래 예제로 확인해 보세요.' },
          { type: 'code', title: '예제 2-3. double 의 오차와 decimal', code: `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;
        decimal m = 0.1m + 0.2m;
        Console.WriteLine($"double : {d}");
        Console.WriteLine($"decimal: {m}");
        Console.WriteLine($"double 이 0.3 과 같은가? {d == 0.3}");
        Console.WriteLine($"decimal 이 0.3 과 같은가? {m == 0.3m}");

        int big = int.MaxValue;
        big = big + 1;                       // 범위를 넘으면 반대쪽 끝으로 넘어간다 (오버플로)
        Console.WriteLine($"int.MaxValue + 1 = {big}");
    }
}`, expect: `double : 0.30000000000000004
decimal: 0.3
double 이 0.3 과 같은가? False
decimal 이 0.3 과 같은가? True
int.MaxValue + 1 = -2147483648`, desc: '마지막 줄은 <b>오버플로(overflow)</b>입니다. int 의 최댓값에 1을 더하면 오류 없이 최솟값으로 넘어갑니다. 큰 수를 다룰 때는 <code>long</code> 을 쓰거나 <code>checked</code> 블록(10장)으로 감지합니다.' },
          { type: 'h', text: 'char 와 string' },
          { type: 'code', title: '예제 2-4. 문자와 문자열', code: `using System;

class Program
{
    static void Main()
    {
        char c = 'A';
        Console.WriteLine(c);
        Console.WriteLine((int)c);          // 문자의 유니코드 번호
        Console.WriteLine((char)(c + 1));   // 다음 문자
        Console.WriteLine('가' < '나');      // 문자도 크기 비교 가능

        string s = "Hello, C#";
        Console.WriteLine(s.Length);        // 글자 수
        Console.WriteLine(s[0]);            // 첫 글자 (char)
        Console.WriteLine(s.ToUpper());     // 대문자로
        Console.WriteLine(s + "!!!");       // 문자열 연결
        string empty = "";                  // 빈 문자열 (길이 0)
        Console.WriteLine(empty.Length);
    }
}`, expect: `A
65
B
True
9
H
HELLO, C#
Hello, C#!!!
0`, desc: '<code>char</code> 는 사실 숫자(유니코드 번호)이므로 계산이 됩니다. 문자열은 <code>[인덱스]</code> 로 한 글자를 꺼내고 <code>Length</code> 로 길이를 얻습니다(자세한 문자열 처리는 10장).' },
          { type: 'h', text: '상수(const)와 var' },
          { type: 'p', html: '<b><code>const</code></b> 를 붙이면 <b>바꿀 수 없는 값(상수)</b>이 됩니다. 원주율, 최대 인원처럼 프로그램 내내 고정인 값에 쓰며 이름은 보통 <code>PascalCase</code> 로 씁니다. <b><code>var</code></b> 는 자료형을 직접 쓰는 대신 <b>초기값을 보고 컴파일러가 자료형을 정하게</b> 하는 키워드입니다. 자료형이 없는 것이 아니라, 정해진 뒤에는 바꿀 수 없습니다.' },
          { type: 'code', title: '예제 2-5. const 와 var', code: `using System;

class Program
{
    const double Pi = 3.14159;          // 상수: 값을 바꿀 수 없다
    const int MaxStudents = 30;

    static void Main()
    {
        double r = 2.0;
        Console.WriteLine($"반지름 {r} 인 원의 넓이 = {Pi * r * r}");
        Console.WriteLine($"최대 인원 = {MaxStudents}");
        // Pi = 3.0;   // 오류 CS0131: 상수에는 대입할 수 없습니다

        var n = 10;          // int 로 결정
        var text = "안녕";    // string 으로 결정
        var half = 10 / 4.0; // double 로 결정 (2.5)
        Console.WriteLine($"{n} {text} {half}");
        // n = "열";          // 오류 CS0029: 이미 int 로 정해졌다
        Console.WriteLine(n.GetType().Name + " " + text.GetType().Name + " " + half.GetType().Name);
    }
}`, expect: `반지름 2 인 원의 넓이 = 12.56636
최대 인원 = 30
10 안녕 2.5
Int32 String Double`, desc: '<code>GetType().Name</code> 으로 실제 자료형을 확인할 수 있습니다. <code>int</code> 의 정식 이름은 <code>System.Int32</code>, <code>string</code> 은 <code>System.String</code> 입니다. <code>var</code> 는 <b>초기값이 있을 때만</b> 쓸 수 있고, 자료형이 한눈에 보이는 경우(<code>var list = new List&lt;int&gt;();</code>)에 주로 씁니다.' },
          { type: 'h', text: '변수 이름 규칙' },
          { type: 'list', items: [
            '영문자 · 숫자 · 밑줄(_)을 쓰고, <b>숫자로 시작할 수 없습니다</b>. 한글도 가능하지만 관례상 영문을 씁니다.',
            '키워드(<code>int</code>, <code>class</code>, <code>if</code> …)는 이름으로 쓸 수 없습니다. 꼭 써야 하면 <code>@int</code> 처럼 <code>@</code> 를 붙입니다.',
            '<b>대소문자를 구분</b>합니다: <code>score</code> 와 <code>Score</code> 는 다른 변수.',
            '관례: 지역 변수 · 매개변수는 <b>camelCase</b>(<code>totalScore</code>), 상수 · 메서드 · 클래스는 <b>PascalCase</b>(<code>MaxCount</code>), 이름은 <b>뜻이 드러나게</b>(<code>x</code> 보다 <code>width</code>).'
          ] },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 값 형식과 참조 형식, 기본값', html: '<code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code> 같은 기본형은 <b>값 형식(value type)</b>으로 변수 상자 안에 값이 직접 들어 있습니다. <code>string</code>, 배열, 클래스는 <b>참조 형식(reference type)</b>으로 상자에는 <b>실제 데이터가 있는 곳의 주소(참조)</b>가 들어 있습니다. 이 차이는 8장(클래스)에서 자세히 다룹니다. 클래스의 필드는 초기화하지 않으면 자료형별 기본값(<code>default</code>)을 가집니다: 숫자 0, bool false, char \'\\0\', 참조 형식 null.' }
        ],
        practice: [
          {
            title: '실습 2-1. 나의 정보 변수로 담기',
            level: 1,
            desc: '<p>이름(string), 나이(int), 키(double), 학생 여부(bool), 혈액형(char) 을 변수에 담고 아래처럼 출력하세요. 키는 소수점 1자리로 표시합니다.</p><pre>이름: 김코딩\n나이: 17세\n키: 168.3cm\n학생: True\n혈액형: O형</pre>',
            hint: '<code>$"키: {height:F1}cm"</code>',
            starter: `using System;

class Program
{
    static void Main()
    {
        // TODO: 변수 5개 선언 (string, int, double, bool, char)

        // TODO: 다섯 줄 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        string name = "김코딩";
        int age = 17;
        double height = 168.3;
        bool isStudent = true;
        char blood = 'O';

        Console.WriteLine($"이름: {name}");
        Console.WriteLine($"나이: {age}세");
        Console.WriteLine($"키: {height:F1}cm");
        Console.WriteLine($"학생: {isStudent}");
        Console.WriteLine($"혈액형: {blood}형");
    }
}
`,
            expect: `이름: 김코딩
나이: 17세
키: 168.3cm
학생: True
혈액형: O형`
          },
          {
            title: '실습 2-2. 값 바꿔 넣기(swap)',
            level: 2,
            desc: '<p>두 변수 <code>a = 3</code>, <code>b = 7</code> 의 값을 서로 바꾸어 <code>a = 7, b = 3</code> 이 되게 하세요. 임시 변수 <code>temp</code> 를 사용합니다.</p><pre>바꾸기 전: a = 3, b = 7\n바꾼 후: a = 7, b = 3</pre>',
            hint: '<code>int temp = a; a = b; b = temp;</code> — 물컵 두 개의 물을 바꾸려면 빈 컵이 하나 필요합니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        int a = 3, b = 7;
        Console.WriteLine($"바꾸기 전: a = {a}, b = {b}");
        // TODO: a 와 b 의 값을 서로 바꾸기

        Console.WriteLine($"바꾼 후: a = {a}, b = {b}");
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        int a = 3, b = 7;
        Console.WriteLine($"바꾸기 전: a = {a}, b = {b}");
        int temp = a;
        a = b;
        b = temp;
        Console.WriteLine($"바꾼 후: a = {a}, b = {b}");
    }
}
`,
            expect: `바꾸기 전: a = 3, b = 7
바꾼 후: a = 7, b = 3`
          }
        ],
        quiz: [
          { q: '돈(금액)을 정확하게 계산해야 할 때 가장 알맞은 자료형은?', options: ['float', 'double', 'decimal', 'int'], answer: 2, explain: '<code>decimal</code> 은 십진 소수를 오차 없이 표현합니다. double 은 0.1 + 0.2 ≠ 0.3.' },
          { q: '다음 중 <b>컴파일 오류</b>가 나는 선언은?', options: ['<code>float f = 3.14f;</code>', '<code>double d = 3.14;</code>', '<code>float f = 3.14;</code>', '<code>decimal m = 3.14m;</code>'], answer: 2, explain: '<code>3.14</code> 는 double 리터럴이라 float 에 그냥 넣을 수 없습니다(CS0664). <code>f</code> 접미사가 필요합니다.' },
          { q: '<code>int x = int.MaxValue; x = x + 1;</code> 실행 후 x 의 값은?', options: ['2147483648', '오류로 프로그램 종료', '-2147483648', '0'], answer: 2, explain: '기본 설정에서는 오버플로가 감지되지 않고 최솟값으로 넘어갑니다.' },
          { q: '<code>var</code> 에 대한 설명으로 <b>옳은</b> 것은?', options: ['자료형이 없는 변수를 만든다', '나중에 다른 자료형의 값을 넣을 수 있다', '초기값을 보고 컴파일러가 자료형을 정한다', '초기값 없이 선언할 수 있다'], answer: 2, explain: '<code>var n = 10;</code> 은 <code>int n = 10;</code> 과 완전히 같습니다. 초기값이 필수입니다.' },
          { q: '변수 이름으로 <b>사용할 수 없는</b> 것은?', options: ['<code>totalScore</code>', '<code>_count</code>', '<code>2ndPlace</code>', '<code>score2</code>'], answer: 2, explain: '이름은 숫자로 시작할 수 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '변수와 기본 자료형', subtitle: 'Chapter 02 · Section 01', badge: '02-1',
            notes: '<p><b>[도입 3분]</b> “계산기에서 M+ 버튼을 눌러 값을 기억시켜 본 적 있나요?” 프로그램도 값을 기억하는 상자가 필요하다 — 그것이 변수.</p>' },
          { layout: 'diagram', title: '변수 = 이름 붙은 메모리 상자', html: SVG_VAR, caption: '자료형이 정해진 상자 + 이름표. 값은 바뀌어도 자료형은 못 바꾼다',
            notes: '<p><b>[5분]</b> 상자 4개를 가리키며 “각 상자에는 정해진 종류의 값만 들어간다”. 발문: “정수 상자 age 에 \"홍길동\" 을 넣으면?” → 컴파일 오류. C# 은 정적 타입 언어.</p>' },
          { layout: 'code', title: '선언 · 초기화 · 대입', code: `using System;

class Program
{
    static void Main()
    {
        int age;            // 선언
        age = 20;           // 대입
        int score = 95;     // 선언 + 초기화
        score = score + 5;  // 오른쪽 먼저 계산
        Console.WriteLine($"{age} {score}");
    }
}`, points: ['<code>=</code> 는 “넣어라” (같다 ✗)', '선언과 초기화를 한 줄에', '초기화 없이 읽으면 오류 CS0165'],
            notes: '<p><b>[6분]</b> <code>score = score + 5</code> 를 수학식으로 읽으면 이상하다는 점을 짚고 “오른쪽 계산 → 왼쪽에 넣기”로 설명. 실행 후 <code>age</code> 를 초기화하지 않고 출력해 보며 CS0165 를 보여 주세요.</p>' },
          { layout: 'table', title: '기본 자료형', head: ['자료형', '용도', '리터럴'], rows: [['<code>int</code> / <code>long</code>', '정수 (±21억 / ±922경)', '<code>100</code> / <code>10000000000L</code>'], ['<code>double</code> / <code>float</code>', '실수 (15자리 / 7자리)', '<code>3.14</code> / <code>3.14f</code>'], ['<code>decimal</code>', '돈 계산 (오차 없음)', '<code>19.99m</code>'], ['<code>bool</code>', '참/거짓', '<code>true</code> <code>false</code>'], ['<code>char</code>', '문자 한 글자', "<code>'A'</code>"], ['<code>string</code>', '문자열', '<code>"안녕"</code>']],
            lead: '정수는 int, 실수는 double, 돈은 decimal 이 기본 선택',
            notes: '<p><b>[6분]</b> 접미사 L · f · m 을 강조. “왜 float 에 3.14 를 그냥 못 넣나?” → 리터럴 3.14 는 double. 예제 2-2 실행.</p>' },
          { layout: 'code', title: 'double 의 오차 · 오버플로', code: `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;
        decimal m = 0.1m + 0.2m;
        Console.WriteLine($"{d}  {m}");
        Console.WriteLine(d == 0.3);

        int big = int.MaxValue;
        big = big + 1;
        Console.WriteLine(big);
    }
}`, points: ['0.1 + 0.2 = 0.30000000000000004', '돈은 <code>decimal</code>', 'int 최댓값 + 1 → 최솟값 (오버플로)'],
            notes: '<p><b>[6분]</b> 실행 결과에 학생들이 놀라는 지점. 2진 소수 이야기를 1분만. “은행 프로그램을 double 로 만들면?” → decimal.</p>' },
          { layout: 'code', title: 'char 와 string', code: `using System;

class Program
{
    static void Main()
    {
        char c = 'A';
        Console.WriteLine((int)c);         // 65
        Console.WriteLine((char)(c + 1));  // B
        string s = "Hello, C#";
        Console.WriteLine(s.Length);       // 9
        Console.WriteLine(s[0]);           // H
        Console.WriteLine(s.ToUpper());
    }
}`, points: ['char 는 유니코드 번호(숫자)', 'string: <code>Length</code>, <code>[i]</code>, 메서드', "작은따옴표 'A' vs 큰따옴표 \"A\""],
            notes: '<p><b>[5분]</b> \'A\' 와 "A" 의 차이를 꼭 짚기. <code>(char)(c + 1)</code> 로 알파벳 순회 가능함을 보여 주면 반복문 예고가 됩니다.</p>' },
          { layout: 'two', title: 'const 와 var', left: { title: 'const — 못 바꾸는 값', code: `const double Pi = 3.14159;
const int MaxStudents = 30;
// Pi = 3.0;  // 오류 CS0131`, run: false }, right: { title: 'var — 자료형 추론', code: `var n = 10;        // int
var text = "안녕";  // string
var half = 10 / 4.0; // double
// n = "열";  // 오류 CS0029`, run: false },
            notes: '<p><b>[4분]</b> var 는 “자료형이 없다”가 아니라 “컴파일러가 대신 적어 준다”. 초기값 없는 <code>var x;</code> 는 오류.</p>' },
          { layout: 'bullets', title: '변수 이름 규칙', lead: '읽는 사람을 위한 이름',
            bullets: ['영문 · 숫자 · <code>_</code>, <b>숫자로 시작 ✗</b>', '키워드 ✗ (<code>int</code>, <code>class</code> …)', '대소문자 구분: <code>score</code> ≠ <code>Score</code>', ['지역 변수 <b>camelCase</b>: <code>totalScore</code>', ['상수 · 메서드 · 클래스 <b>PascalCase</b>: <code>MaxCount</code>']], '뜻이 드러나게: <code>x</code> ✗ → <code>width</code> ✓'],
            notes: '<p><b>[3분]</b> 칠판에 이름 5개를 쓰고 O/X 퀴즈: <code>2nd</code>, <code>my-name</code>, <code>_tmp</code>, <code>class</code>, <code>총점</code>.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '돈(금액)을 정확하게 계산해야 할 때 가장 알맞은 자료형은?', options: ['float', 'double', 'decimal', 'int'], answer: 2, explain: 'decimal 은 십진 소수를 오차 없이 표현합니다.',
            notes: '<p>정답 공개 후 “그럼 게임의 좌표는?” → double/float.</p>' },
          { layout: 'practice', title: '실습 2-2. 값 바꿔 넣기(swap)', desc: '<p><code>a = 3</code>, <code>b = 7</code> 을 서로 바꾸어 <code>a = 7, b = 3</code> 으로 만드세요. 임시 변수를 사용합니다.</p>', starter: `using System;

class Program
{
    static void Main()
    {
        int a = 3, b = 7;
        // TODO: 값 바꾸기
        Console.WriteLine($"a = {a}, b = {b}");
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        int a = 3, b = 7;
        int temp = a;
        a = b;
        b = temp;
        Console.WriteLine($"a = {a}, b = {b}");
    }
}`,
            notes: '<p><b>[6분]</b> 흔한 오답: <code>a = b; b = a;</code> → 둘 다 7. 물컵 비유로 설명. C# 7 의 <code>(a, b) = (b, a);</code> 도 보너스로 소개.</p>' },
          { layout: 'summary', title: '정리', bullets: ['변수 = 자료형이 정해진 이름 붙은 상자, <code>=</code> 는 대입', 'int · long · double · float · decimal · bool · char · string', '접미사 L · f · m, double 의 오차, 오버플로', '<code>const</code> 상수, <code>var</code> 자료형 추론', '이름: camelCase, 숫자로 시작 ✗, 대소문자 구분'],
            notes: '<p>다음 시간: 형 변환과 입력 처리(Parse / TryParse).</p>' }
        ]
      },

      /* ===================== ch02-2 ===================== */
      {
        id: 'ch02-2',
        title: '형 변환과 입력 처리',
        minutes: 50,
        goals: [
          '암시적 변환과 명시적 변환(캐스트)의 차이를 설명할 수 있다',
          '정수 나눗셈과 실수 나눗셈의 차이를 이해하고 캐스트로 해결할 수 있다',
          'Parse · TryParse · Convert · ToString 으로 문자열과 숫자를 변환할 수 있다',
          '입력값을 검사해 안전하게 처리할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['암시적 · 명시적 변환', 12], ['정수 나눗셈 함정', 8], ['Parse · TryParse · Convert', 15], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '암시적 변환과 명시적 변환' },
          { type: 'p', html: '자료형이 다른 값을 넣으려면 <b>변환(conversion)</b>이 필요합니다. <b>작은 그릇 → 큰 그릇</b>(int → double)은 잃는 것이 없어 컴파일러가 <b>자동(암시적, implicit)</b>으로 해 주고, <b>큰 그릇 → 작은 그릇</b>(double → int)은 값이 잘릴 수 있어 프로그래머가 <b>(자료형)</b> 을 앞에 붙여 <b>명시적(explicit)으로 캐스트</b>해야 합니다.' },
          { type: 'figure', html: SVG_CONV, caption: '암시적 변환은 자동, 명시적 변환은 (형) 캐스트 — 문자열 ↔ 숫자는 변환 메서드 사용' },
          { type: 'code', title: '예제 2-6. 암시적 변환과 명시적 캐스트', code: `using System;

class Program
{
    static void Main()
    {
        int i = 100;
        double d = i;               // 암시적: int → double (100.0)
        long l = i;                 // 암시적: int → long
        Console.WriteLine($"{d} {l}");

        double price = 3.99;
        int won = (int)price;       // 명시적: 소수점 아래를 버린다
        Console.WriteLine(won);
        Console.WriteLine((int)-3.99);      // -3 (0 쪽으로 자름)
        Console.WriteLine((int)Math.Round(3.99));   // 4 (반올림하려면 Math.Round)

        int big = 300;
        byte b = (byte)big;         // 범위(0~255)를 넘어 값이 깨진다: 300 - 256 = 44
        Console.WriteLine(b);

        char c = (char)65;          // 숫자 → 문자
        int code = 'B';             // 문자 → 숫자 (암시적)
        Console.WriteLine($"{c} {code}");
    }
}`, expect: `100 100
3
-3
4
44
A 66`, desc: '<code>(int)3.99</code> 는 반올림이 아니라 <b>소수점 아래를 버립니다</b>. 반올림은 <code>Math.Round</code>, 올림 <code>Math.Ceiling</code>, 내림 <code>Math.Floor</code>. 범위를 넘는 캐스트(<code>(byte)300</code>)는 조용히 잘못된 값이 되니 주의하세요.' },
          { type: 'h', text: '정수 나눗셈의 함정' },
          { type: 'code', title: '예제 2-7. 정수 / 정수 = 정수', code: `using System;

class Program
{
    static void Main()
    {
        int total = 7, count = 2;
        Console.WriteLine(total / count);            // 3  (소수점 버림!)
        Console.WriteLine(total % count);            // 1  (나머지)
        Console.WriteLine((double)total / count);    // 3.5 (하나만 double 이면 실수 나눗셈)
        Console.WriteLine(total / (double)count);    // 3.5
        Console.WriteLine((double)(total / count));  // 3  (이미 정수로 나눈 뒤 변환 — 늦었다)
        Console.WriteLine(7 / 2.0);                  // 3.5

        int score1 = 90, score2 = 85, score3 = 92;
        double avg = (score1 + score2 + score3) / 3.0;
        Console.WriteLine($"평균 = {avg:F2}");
    }
}`, expect: `3
1
3.5
3.5
3
3.5
평균 = 89.00`, desc: '<b>정수끼리 나누면 결과도 정수</b>입니다(몫). 평균처럼 소수가 필요하면 피연산자 중 하나를 <code>double</code> 로 만드세요. <code>(double)(total / count)</code> 는 정수로 나눈 <b>뒤에</b> 변환하므로 소용없습니다.' },
          { type: 'h', text: '문자열 ↔ 숫자 변환' },
          { type: 'p', html: '<code>Console.ReadLine()</code> 은 항상 <b>문자열</b>을 돌려주므로, 숫자로 계산하려면 변환해야 합니다. 문자열 <code>"12"</code> 는 글자 \'1\' 과 \'2\' 일 뿐이므로 캐스트 <code>(int)"12"</code> 는 <b>불가능</b>하고, 글자를 읽어 숫자를 만드는 <b>메서드</b>를 씁니다.' },
          { type: 'table', head: ['방법', '예', '잘못된 입력일 때'], rows: [
            ['<code>int.Parse(s)</code>', '<code>int n = int.Parse("12");</code>', '<b>FormatException</b> 발생 (프로그램 중단)'],
            ['<code>double.Parse(s)</code>', '<code>double d = double.Parse("3.5");</code>', 'FormatException'],
            ['<code>int.TryParse(s, out n)</code>', '<code>bool ok = int.TryParse(s, out int n);</code>', '<b>false 를 돌려주고</b> n = 0 (안전)'],
            ['<code>Convert.ToInt32(s)</code>', '<code>int n = Convert.ToInt32("12");</code>', 'FormatException. <code>null</code> 은 0 으로'],
            ['<code>Convert.ToInt32(3.7)</code>', '실수 → 정수 (반올림: 4)', '—'],
            ['<code>n.ToString()</code>', '<code>string s = 12.ToString();</code>', '숫자 → 문자열. <code>ToString("N0")</code> 형식 지정 가능']
          ] },
          { type: 'code', title: '예제 2-8. Parse 와 ToString', code: `using System;

class Program
{
    static void Main()
    {
        string input = "25";
        int age = int.Parse(input);
        Console.WriteLine(age + 1);                 // 26 (숫자 덧셈)
        Console.WriteLine(input + 1);               // "251" (문자열 연결!)

        double d = double.Parse("3.5");
        Console.WriteLine(d * 2);

        int n = 1234567;
        string s = n.ToString();
        Console.WriteLine(s.Length);                // 7 글자
        Console.WriteLine(n.ToString("N0"));        // 1,234,567
        Console.WriteLine(3.14159.ToString("F2")); // 3.14

        Console.WriteLine(Convert.ToInt32(3.7));    // 4 (반올림)
        Console.WriteLine(Convert.ToInt32("42") + Convert.ToInt32(true));  // 42 + 1
    }
}`, expect: `26
251
7
7
1,234,567
3.14
4
43`, desc: '<code>input + 1</code> 처럼 <b>문자열에 숫자를 더하면 연결</b>됩니다 — 입문자가 자주 하는 실수입니다. 계산 전에 반드시 숫자로 바꾸세요.' },
          { type: 'code', title: '예제 2-9. TryParse 로 안전하게 입력받기', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("나이를 입력하세요: ");
        string input = Console.ReadLine();

        if (int.TryParse(input, out int age))
        {
            Console.WriteLine($"내년에는 {age + 1}살입니다.");
        }
        else
        {
            Console.WriteLine($"'{input}' 은(는) 숫자가 아닙니다. 다시 실행해 주세요.");
        }
    }
}`, stdin: '스물\n', expect: `나이를 입력하세요: '스물' 은(는) 숫자가 아닙니다. 다시 실행해 주세요.`, desc: '<code>TryParse</code> 는 변환에 성공하면 <code>true</code> 를 돌려주며 <code>out</code> 변수에 값을 넣고, 실패하면 <code>false</code> 를 돌려줍니다. <code>if</code> 문은 4장에서 배우지만, “참이면 앞 블록, 거짓이면 else 블록”만 알면 됩니다. 예시 입력 대신 <code>20</code> 을 넣어 다시 실행해 보세요.' },
          { type: 'callout', kind: 'tip', title: 'Parse 냐 TryParse 냐', html: '값이 반드시 숫자라고 확신할 때(내부 데이터)는 <code>Parse</code>, <b>사용자 입력</b>처럼 무엇이 들어올지 모를 때는 <code>TryParse</code> 를 쓰세요. 실무 코드의 입력 처리는 거의 TryParse 입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 실수를 문자열로 바꿀 때의 문화권', html: '<code>double.Parse("3.5")</code> 는 실행되는 컴퓨터의 <b>문화권(culture)</b> 설정을 따릅니다. 한국 · 미국은 소수점이 <code>.</code> 이지만 독일은 <code>,</code> 입니다. 파일이나 네트워크로 주고받는 숫자는 <code>double.Parse(s, CultureInfo.InvariantCulture)</code> 처럼 <b>문화권 무관(Invariant)</b>으로 처리하는 것이 안전합니다. 이 강좌의 실행 환경은 ko-KR 입니다.' }
        ],
        practice: [
          {
            title: '실습 2-3. 섭씨 → 화씨 변환기',
            level: 1,
            desc: '<p>섭씨 온도를 입력받아 화씨로 바꾸어 소수점 1자리로 출력하세요. 공식: <code>F = C × 9 / 5 + 32</code>.</p><pre>섭씨 온도: 36.5\n화씨 97.7도</pre>',
            hint: '<code>double c = double.Parse(Console.ReadLine());</code> 그리고 <code>{f:F1}</code>. <code>9 / 5</code> 는 정수 나눗셈이므로 <code>9.0 / 5</code> 로 쓰세요.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("섭씨 온도: ");
        // TODO: 입력을 double 로 변환
        // TODO: 화씨 계산 후 소수점 1자리로 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("섭씨 온도: ");
        double c = double.Parse(Console.ReadLine());
        double f = c * 9.0 / 5 + 32;
        Console.WriteLine($"화씨 {f:F1}도");
    }
}
`,
            stdin: '36.5\n',
            expect: `섭씨 온도: 화씨 97.7도`
          },
          {
            title: '실습 2-4. 초를 시:분:초로',
            level: 2,
            desc: '<p>초 단위 정수를 입력받아 <code>시간 분 초</code> 로 나누어 출력하세요. 나눗셈 <code>/</code> 과 나머지 <code>%</code> 를 사용합니다.</p><pre>초를 입력: 3725\n1시간 2분 5초</pre>',
            hint: '시 = 초 / 3600, 분 = (초 % 3600) / 60, 초 = 초 % 60',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("초를 입력: ");
        int total = int.Parse(Console.ReadLine());
        // TODO: 시, 분, 초 계산
        // TODO: 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("초를 입력: ");
        int total = int.Parse(Console.ReadLine());
        int hours = total / 3600;
        int minutes = (total % 3600) / 60;
        int seconds = total % 60;
        Console.WriteLine($"{hours}시간 {minutes}분 {seconds}초");
    }
}
`,
            stdin: '3725\n',
            expect: `초를 입력: 1시간 2분 5초`
          }
        ],
        quiz: [
          { q: '<code>int n = (int)7.9;</code> 실행 후 n 은?', options: ['8', '7', '7.9', '컴파일 오류'], answer: 1, explain: '캐스트는 소수점 아래를 버립니다. 반올림은 <code>Math.Round</code>.' },
          { q: '<code>Console.WriteLine(10 / 4);</code> 의 출력은?', options: ['2.5', '2', '3', '오류'], answer: 1, explain: '정수 / 정수 = 정수(몫). 2.5 를 얻으려면 <code>10 / 4.0</code>.' },
          { q: '<code>"5" + 3</code> 의 결과는?', options: ['8', '"53"', '오류', '"8"'], answer: 1, explain: '문자열 + 숫자 → 숫자가 문자열로 바뀌어 연결됩니다.' },
          { q: '사용자 입력을 숫자로 바꿀 때 잘못된 입력에도 프로그램이 멈추지 않게 하려면?', options: ['<code>int.Parse</code>', '<code>(int)</code> 캐스트', '<code>int.TryParse</code>', '<code>Convert.ToInt32</code>'], answer: 2, explain: 'TryParse 는 예외 대신 false 를 돌려줍니다.' },
          { q: '다음 중 <b>암시적 변환이 되는</b> 것은?', options: ['double → int', 'int → double', 'string → int', 'long → int'], answer: 1, explain: '작은 그릇에서 큰 그릇(int → double, int → long)만 자동 변환됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '형 변환과 입력 처리', subtitle: 'Chapter 02 · Section 02', badge: '02-2',
            notes: '<p><b>[도입 3분]</b> 복습 퀴즈: “돈 계산 자료형은?” “3.14f 의 f 는?” 오늘은 자료형 사이를 오가는 법.</p>' },
          { layout: 'diagram', title: '암시적 vs 명시적 변환', html: SVG_CONV, caption: '작은 → 큰: 자동 / 큰 → 작은: (형) 캐스트, 손실 주의',
            notes: '<p><b>[6분]</b> 그릇 비유: 작은 컵의 물을 큰 컵에 붓는 건 안전, 반대는 넘친다. 발문: “(int)3.99 는 4일까 3일까?”</p>' },
          { layout: 'code', title: '캐스트 실험', code: `using System;

class Program
{
    static void Main()
    {
        int i = 100;
        double d = i;              // 암시적
        int won = (int)3.99;       // 3
        int r = (int)Math.Round(3.99);   // 4
        int big = 300;
        byte b = (byte)big;        // 44 (깨짐)
        char c = (char)65;         // A
        Console.WriteLine($"{d} {won} {r} {b} {c}");
    }
}`, points: ['캐스트는 <b>버림</b>, 반올림은 Math.Round', '범위 초과 캐스트는 값이 깨진다', '숫자 ↔ char 변환'],
            notes: '<p><b>[6분]</b> 값을 바꿔 가며 실행. <code>(byte)300</code> 이 44가 되는 이유(300-256)를 간단히.</p>' },
          { layout: 'code', title: '정수 나눗셈의 함정', code: `using System;

class Program
{
    static void Main()
    {
        int total = 7, count = 2;
        Console.WriteLine(total / count);          // 3
        Console.WriteLine(total % count);          // 1
        Console.WriteLine((double)total / count);  // 3.5
        Console.WriteLine((double)(total / count)); // 3 !
        double avg = (90 + 85 + 92) / 3.0;
        Console.WriteLine($"평균 {avg:F2}");
    }
}`, points: ['정수 / 정수 = 정수(몫)', '하나만 double 이면 실수 나눗셈', '나눈 뒤 캐스트하면 늦다'],
            notes: '<p><b>[6분]</b> 평균 계산에서 가장 많이 하는 실수. “(double)(a/b) 가 왜 3 인가?” 를 학생이 설명하게 하세요.</p>' },
          { layout: 'table', title: '문자열 ↔ 숫자', head: ['방법', '예', '잘못된 입력'], rows: [['<code>int.Parse(s)</code>', '<code>int.Parse("12")</code>', '예외(중단)'], ['<code>int.TryParse(s, out n)</code>', '<code>if (int.TryParse(s, out int n))</code>', 'false 반환 (안전)'], ['<code>Convert.ToInt32(x)</code>', '문자열 · 실수(반올림) · bool', '예외'], ['<code>n.ToString("N0")</code>', '숫자 → 문자열', '—']],
            lead: '"12" 는 글자일 뿐 — 캐스트가 아니라 메서드로 변환',
            notes: '<p><b>[6분]</b> <code>"5" + 3</code> 이 "53" 이 되는 것을 실행으로 보여 주면 기억에 남습니다.</p>' },
          { layout: 'code', title: 'TryParse 로 안전하게', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("나이: ");
        string input = Console.ReadLine();
        if (int.TryParse(input, out int age))
            Console.WriteLine($"내년 {age + 1}살");
        else
            Console.WriteLine($"'{input}' 은 숫자가 아닙니다");
    }
}`, stdin: '스물\n', points: ['성공 → true, out 변수에 값', '실패 → false (프로그램은 계속)', '사용자 입력은 TryParse'],
            notes: '<p><b>[6분]</b> “스물” 과 “20” 을 각각 입력해 두 경로를 보여 줍니다. if/else 는 4장에서 자세히.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Console.WriteLine(10 / 4);</code> 의 출력은?', options: ['2.5', '2', '3', '오류'], answer: 1, explain: '정수 나눗셈은 몫만 남습니다.',
            notes: '<p>이어서 “10 / 4.0 은?” “10 % 4 는?”</p>' },
          { layout: 'practice', title: '실습 2-4. 초를 시:분:초로', desc: '<p>초를 입력받아 <code>1시간 2분 5초</code> 형식으로 출력하세요. <code>/</code> 와 <code>%</code> 를 사용합니다.</p>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("초를 입력: ");
        int total = int.Parse(Console.ReadLine());
        // TODO
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("초를 입력: ");
        int total = int.Parse(Console.ReadLine());
        int hours = total / 3600;
        int minutes = (total % 3600) / 60;
        int seconds = total % 60;
        Console.WriteLine($"{hours}시간 {minutes}분 {seconds}초");
    }
}`, stdin: '3725\n',
            notes: '<p><b>[8분]</b> 3725 로 확인. 힌트: 3600 으로 나눈 몫이 시간, 나머지를 60으로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['작은 → 큰 자동, 큰 → 작은 <code>(형)</code> 캐스트(버림)', '정수 / 정수 = 정수 → 하나를 double 로', '<code>Parse</code> 예외 · <code>TryParse</code> 안전 · <code>Convert</code> · <code>ToString()</code>', '<code>"5" + 3</code> 은 "53" — 계산 전에 변환'],
            notes: '<p>다음 시간: 연산자와 식.</p>' }
        ]
      }
    ]
  });
})();
