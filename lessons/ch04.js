/* Chapter 04. 조건문 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_IF = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="if-else 문의 흐름도">
  <defs><marker id="ah4a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="540" y="16" width="200" height="54" rx="27" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="640" y="51" text-anchor="middle" style="font-size:24px;fill:var(--fg)">시작</text>
  <line x1="640" y1="70" x2="640" y2="112" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah4a)"/>
  <polygon points="640,120 860,210 640,300 420,210" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="200" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">조건식</text>
  <text x="640" y="238" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">age &gt;= 19</text>
  <text x="640" y="272" text-anchor="middle" style="font-size:20px;fill:var(--muted)">결과는 true 아니면 false</text>
  <line x1="860" y1="210" x2="992" y2="210" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah4a)"/>
  <text x="926" y="196" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">참 (true)</text>
  <rect x="1000" y="170" width="240" height="80" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1120" y="204" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">if 블록</text>
  <text x="1120" y="234" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">"성인입니다"</text>
  <line x1="420" y1="210" x2="288" y2="210" stroke="var(--danger)" stroke-width="4" marker-end="url(#ah4a)"/>
  <text x="354" y="196" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--danger)">거짓 (false)</text>
  <rect x="40" y="170" width="240" height="80" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="160" y="204" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--danger)">else 블록</text>
  <text x="160" y="234" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">"미성년자입니다"</text>
  <polyline points="160,250 160,460 512,460" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah4a)"/>
  <polyline points="1120,250 1120,460 768,460" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah4a)"/>
  <line x1="640" y1="300" x2="640" y2="422" stroke="var(--muted)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah4a)"/>
  <text x="640" y="345" text-anchor="middle" style="font-size:19px;fill:var(--muted)">else 가 없으면</text>
  <text x="640" y="372" text-anchor="middle" style="font-size:19px;fill:var(--muted)">거짓일 때 바로 다음 문장으로</text>
  <rect x="520" y="430" width="240" height="60" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="640" y="468" text-anchor="middle" style="font-size:22px;fill:var(--fg)">다음 문장</text>
  <text x="640" y="535" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)"><tspan fill="var(--accent)">if</tspan> (조건식) { 참일 때 } <tspan fill="var(--accent)">else</tspan> { 거짓일 때 }   — 두 갈래 중 <tspan font-weight="700">딱 하나</tspan>만 실행된다</text>
</svg>`;

  const SVG_SWITCH = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="switch 문의 동작">
  <defs><marker id="ah4b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  <marker id="ah4c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="200" width="280" height="120" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="180" y="245" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--accent)">switch (month)</text>
  <text x="180" y="290" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">month = 7</text>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <polyline points="320,260 400,260 400,80 468,80" marker-end="url(#ah4c)"/>
    <polyline points="320,260 400,260 400,440 468,440" marker-end="url(#ah4c)"/>
    <polyline points="400,260 400,320 468,320" marker-end="url(#ah4c)"/>
  </g>
  <polyline points="320,260 400,260 400,200 468,200" fill="none" stroke="var(--accent)" stroke-width="5" marker-end="url(#ah4b)"/>
  <rect x="480" y="40" width="440" height="80" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="500" y="74" style="${MONO};font-size:22px;fill:var(--muted)">case 3: case 4: case 5:</text>
  <text x="500" y="104" style="${MONO};font-size:22px;fill:var(--muted)">    "봄";  break;</text>
  <rect x="480" y="160" width="440" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="500" y="194" style="${MONO};font-size:22px;font-weight:700;fill:var(--accent)">case 6: case 7: case 8:</text>
  <text x="500" y="224" style="${MONO};font-size:22px;font-weight:700;fill:var(--fg)">    "여름";  break;</text>
  <rect x="480" y="280" width="440" height="80" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="500" y="314" style="${MONO};font-size:22px;fill:var(--muted)">case 9: case 10: case 11:</text>
  <text x="500" y="344" style="${MONO};font-size:22px;fill:var(--muted)">    "가을";  break;</text>
  <rect x="480" y="400" width="440" height="80" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="500" y="434" style="${MONO};font-size:22px;fill:var(--muted)">default:</text>
  <text x="500" y="464" style="${MONO};font-size:22px;fill:var(--muted)">    "잘못된 월";  break;</text>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <polyline points="920,80 1000,80 1000,260 1068,260" marker-end="url(#ah4c)"/>
    <polyline points="920,320 1000,320 1000,260" />
    <polyline points="920,440 1000,440 1000,260" />
  </g>
  <polyline points="920,200 1000,200 1000,260 1068,260" fill="none" stroke="var(--accent)" stroke-width="5" marker-end="url(#ah4b)"/>
  <text x="960" y="186" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--accent)">break</text>
  <rect x="1080" y="220" width="170" height="80" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1165" y="253" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">switch 끝</text>
  <text x="1165" y="283" text-anchor="middle" style="font-size:20px;fill:var(--muted)">다음 문장</text>
  <text x="640" y="530" text-anchor="middle" style="font-size:24px;fill:var(--fg)">값과 <tspan font-weight="700">같은 case</tspan> 로 바로 점프해 실행하고, <tspan style="${MONO}" fill="var(--accent)">break</tspan> 를 만나면 switch 를 빠져나온다. 맞는 case 가 없으면 <tspan style="${MONO}">default</tspan></text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch04',
    no: '04',
    title: '조건문',
    subtitle: 'Conditionals',
    summary: '조건에 따라 서로 다른 코드를 실행하는 if · else if · else 문과, 값 하나로 여러 갈래를 나누는 switch 문을 배웁니다. C# 8 의 switch 식과 관계 패턴 · when 조건 · is 패턴까지 익혀 프로그램이 스스로 판단하게 만듭니다.',
    goals: [
      '조건식의 결과가 bool 이라는 것을 이해하고 비교 · 논리 연산자로 조건을 만들 수 있다',
      'if · if-else · else if 사다리 · 중첩 if 로 여러 갈래의 흐름을 만들 수 있다',
      '중괄호 블록의 범위와 = / == , 세미콜론 같은 흔한 실수를 피할 수 있다',
      'switch 문(case · break · default · 여러 case 묶기)으로 값에 따라 분기할 수 있다',
      'switch 식 · 관계 패턴 · when · is 패턴을 읽고 쓸 수 있다'
    ],
    sections: [
      /* ===================== ch04-1 ===================== */
      {
        id: 'ch04-1',
        title: 'if 문',
        minutes: 50,
        goals: [
          '조건식의 값이 bool(true/false) 임을 설명할 수 있다',
          'if · if-else · else if 사다리를 알맞게 쓸 수 있다',
          '&& · || · ! 로 조건을 조합하고 중첩 if 를 쓸 수 있다',
          '중괄호 블록, = 과 ==, if 뒤 세미콜론 같은 실수를 찾아 고칠 수 있다'
        ],
        flow: [['도입: 갈림길에서 선택하기', 5], ['조건식과 bool · if 문', 12], ['if-else · else if 사다리', 13], ['논리 연산자 · 중첩 if · 흔한 실수', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '조건문 — 프로그램의 갈림길' },
          { type: 'p', html: '지금까지 만든 프로그램은 위에서 아래로 <b>한 줄씩 차례대로</b> 실행됐습니다. 그런데 “나이가 19살 이상이면 입장, 아니면 거절”처럼 <b>상황에 따라 다른 일</b>을 해야 할 때가 훨씬 많습니다. <b>조건문(conditional statement)</b>은 조건이 참인지 거짓인지 보고 <b>어느 길로 갈지 고르는 갈림길</b>입니다. 신호등이 초록이면 건너고 빨강이면 멈추는 것과 같습니다.' },
          { type: 'figure', html: SVG_IF, caption: 'if-else 흐름도 — 조건식이 참이면 if 블록, 거짓이면 else 블록. 둘 중 하나만 실행되고 다시 합류한다' },
          { type: 'h', text: '조건식의 값은 bool' },
          { type: 'p', html: '<code>if</code> 의 괄호 안에는 <b>결과가 <code>true</code> 또는 <code>false</code> 인 식(조건식)</b>이 들어갑니다. 3장에서 배운 <b>비교 연산자</b>(<code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>)가 만드는 값이 바로 <code>bool</code> 입니다. 조건식은 변수에 담을 수도 있습니다.' },
          { type: 'code', title: '예제 4-1. 조건식의 값 확인하기', code: `using System;

class Program
{
    static void Main()
    {
        int age = 20;
        Console.WriteLine(age >= 19);          // True
        Console.WriteLine(age == 18);          // False
        Console.WriteLine(age != 18);          // True

        bool isAdult = age >= 19;              // 조건식의 결과를 bool 변수에 담기
        Console.WriteLine($"성인인가? {isAdult}");

        string name = "홍길동";
        Console.WriteLine(name == "홍길동");    // 문자열도 == 로 내용 비교
        Console.WriteLine('a' < 'b');          // 문자는 유니코드 번호로 비교
    }
}`, expect: `True
False
True
성인인가? True
True
True`, desc: '비교의 결과는 항상 <code>True</code> 아니면 <code>False</code> 입니다. <code>==</code> 는 등호 <b>두 개</b>라는 점을 꼭 기억하세요. 등호 하나 <code>=</code> 는 “넣어라”(대입)입니다.' },
          { type: 'h', text: 'if 문' },
          { type: 'p', html: '<code>if (조건식) { … }</code> — 조건식이 <b>참일 때만</b> 중괄호 안의 문장들을 실행합니다. 거짓이면 중괄호 블록을 <b>통째로 건너뛰고</b> 그다음 문장으로 갑니다.' },
          { type: 'code', title: '예제 4-2. if 문 — 성인 판정', stdin: '20\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("나이를 입력하세요: ");
        int age = int.Parse(Console.ReadLine());

        if (age >= 19)
        {
            Console.WriteLine("성인입니다.");
            Console.WriteLine("입장할 수 있습니다.");
        }

        Console.WriteLine("검사를 마쳤습니다.");   // if 와 상관없이 항상 실행
    }
}`, expect: `나이를 입력하세요: 성인입니다.
입장할 수 있습니다.
검사를 마쳤습니다.`, desc: '입력이 20 이면 <code>age &gt;= 19</code> 가 참이므로 블록 안 두 줄이 실행됩니다. 예시 입력을 <code>15</code> 로 바꿔 실행해 보세요 — “검사를 마쳤습니다.” 만 출력됩니다. 블록 안 문장은 <b>들여쓰기(Tab)</b>로 안쪽에 있음을 표시합니다.' },
          { type: 'callout', kind: 'tip', title: '중괄호 { } 는 언제 생략할 수 있나?', html: 'if 에 속한 문장이 <b>딱 한 줄</b>이면 중괄호를 생략할 수 있습니다: <code>if (age &gt;= 19) Console.WriteLine("성인");</code>. 하지만 두 줄 이상이면 반드시 중괄호로 묶어야 합니다. 초보 때는 <b>항상 중괄호를 쓰는 습관</b>이 안전합니다(아래 “흔한 실수” 참고).' },
          { type: 'h', text: 'if-else 문 — 참이면 이것, 아니면 저것' },
          { type: 'p', html: '<code>else</code> 를 붙이면 조건이 <b>거짓일 때 실행할 블록</b>을 따로 둘 수 있습니다. 두 블록 중 <b>반드시 하나만</b> 실행됩니다.' },
          { type: 'code', title: '예제 4-3. if-else — 짝수 · 홀수 판정', stdin: '7\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("정수를 입력하세요: ");
        int n = int.Parse(Console.ReadLine());

        if (n % 2 == 0)
        {
            Console.WriteLine($"{n} 은(는) 짝수입니다.");
        }
        else
        {
            Console.WriteLine($"{n} 은(는) 홀수입니다.");
        }
    }
}`, expect: `정수를 입력하세요: 7 은(는) 홀수입니다.`, desc: '<code>n % 2</code> 는 2로 나눈 <b>나머지</b>입니다. 나머지가 0이면 짝수, 아니면 홀수입니다. <code>else</code> 에는 조건을 쓰지 않습니다 — “나머지 모든 경우”라는 뜻입니다.' },
          { type: 'h', text: 'else if 사다리 — 세 갈래 이상' },
          { type: 'p', html: '갈래가 셋 이상이면 <code>else if</code> 를 이어 붙입니다. <b>위에서부터 차례로</b> 조건을 검사해 <b>처음 참이 되는 블록 하나만</b> 실행하고 나머지는 모두 건너뜁니다. 마지막 <code>else</code> 는 “어느 것도 아닐 때”이며 생략할 수 있습니다.' },
          { type: 'code', title: '예제 4-4. else if — 성적 등급', stdin: '85\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("점수(0~100): ");
        int score = int.Parse(Console.ReadLine());
        string grade;

        if (score >= 90)
        {
            grade = "A";
        }
        else if (score >= 80)      // 90 미만이면서 80 이상
        {
            grade = "B";
        }
        else if (score >= 70)      // 80 미만이면서 70 이상
        {
            grade = "C";
        }
        else if (score >= 60)
        {
            grade = "D";
        }
        else                       // 60 미만
        {
            grade = "F";
        }

        Console.WriteLine($"{score}점은 {grade} 등급입니다.");
    }
}`, expect: `점수(0~100): 85점은 B 등급입니다.`, desc: '85 는 첫 조건 <code>&gt;= 90</code> 에서 거짓, 두 번째 <code>&gt;= 80</code> 에서 참 → B. 두 번째 조건에 “90 미만”을 쓰지 않아도 되는 이유는, <b>첫 조건이 거짓이어야만 두 번째로 내려오기</b> 때문입니다.' },
          { type: 'callout', kind: 'warn', title: '조건의 순서가 중요합니다', html: '위 예제에서 <code>if (score &gt;= 60)</code> 을 <b>맨 위에</b> 두면 95점도 D 등급이 됩니다. 처음 참이 되는 가지에서 끝나므로, 범위가 <b>좁은(엄격한) 조건부터</b> 위에 씁니다.' },
          { type: 'h', text: '조건 조합 — 논리 연산자 &&, ||, !' },
          { type: 'p', html: '조건이 두 개 이상 필요할 때는 <b>논리 연산자</b>로 묶습니다. “아이디도 맞<b>고</b> 비밀번호도 맞으면”, “토요일<b>이거나</b> 일요일이면”, “회원이 <b>아니면</b>”처럼 우리말 <b>그리고 · 또는 · 아니다</b>에 해당합니다.' },
          { type: 'table', head: ['연산자', '이름', '뜻', '예'], rows: [
            ['<code>a &amp;&amp; b</code>', 'AND (그리고)', '<b>둘 다</b> 참일 때만 참', '<code>age &gt;= 19 &amp;&amp; hasTicket</code>'],
            ['<code>a || b</code>', 'OR (또는)', '<b>하나라도</b> 참이면 참', '<code>day == 6 || day == 7</code>'],
            ['<code>!a</code>', 'NOT (아니다)', '참 ↔ 거짓 뒤집기', '<code>!isMember</code>']
          ], caption: '&& 는 || 보다 먼저 계산됩니다. 헷갈리면 괄호로 묶으세요' },
          { type: 'code', title: '예제 4-5. 논리 연산자 — 로그인 검사', stdin: 'admin\n1234\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("아이디: ");
        string id = Console.ReadLine();
        Console.Write("비밀번호: ");
        string pw = Console.ReadLine();

        bool idOk = id == "admin";
        bool pwOk = pw == "1234";

        if (id == "" || pw == "")            // 하나라도 비어 있으면
        {
            Console.WriteLine("아이디와 비밀번호를 모두 입력하세요.");
        }
        else if (idOk && pwOk)               // 둘 다 맞으면
        {
            Console.WriteLine("로그인 성공! 환영합니다.");
        }
        else if (!idOk)                      // 아이디가 틀리면
        {
            Console.WriteLine("존재하지 않는 아이디입니다.");
        }
        else                                 // 아이디는 맞고 비밀번호만 틀림
        {
            Console.WriteLine("비밀번호가 틀렸습니다.");
        }
    }
}`, expect: `아이디: 비밀번호: 로그인 성공! 환영합니다.`, desc: '조건식을 <code>idOk</code>, <code>pwOk</code> 같은 <b>bool 변수</b>에 먼저 담아 두면 if 문이 읽기 쉬워집니다. 예시 입력을 <code>admin</code> / <code>0000</code>, <code>guest</code> / <code>1234</code> 로 바꿔 각 가지를 확인해 보세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 단락 평가(short-circuit)', html: '<code>a &amp;&amp; b</code> 에서 <code>a</code> 가 거짓이면 결과는 볼 것도 없이 거짓이므로 <b><code>b</code> 는 계산하지 않습니다</b>. <code>a || b</code> 도 <code>a</code> 가 참이면 <code>b</code> 를 건너뜁니다. 그래서 <code>if (name != null &amp;&amp; name.Length &gt; 0)</code> 처럼 “먼저 안전한지 확인하고 → 사용”하는 조건을 한 줄로 쓸 수 있습니다.' },
          { type: 'h', text: '중첩 if — if 안의 if' },
          { type: 'p', html: 'if 블록 안에 또 if 를 쓸 수 있습니다. “키가 되면 → 그다음 나이를 검사”처럼 <b>단계적으로</b> 검사할 때 씁니다. 들여쓰기를 한 단계 더 넣어 안쪽임을 표시합니다.' },
          { type: 'code', title: '예제 4-6. 중첩 if — 놀이기구 탑승 검사', stdin: '150\n10\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("키(cm): ");
        int height = int.Parse(Console.ReadLine());
        Console.Write("나이: ");
        int age = int.Parse(Console.ReadLine());

        if (height >= 140)
        {
            if (age >= 12)
            {
                Console.WriteLine("탑승할 수 있습니다.");
            }
            else
            {
                Console.WriteLine("키는 충분하지만 12세 이상만 탈 수 있습니다.");
            }
        }
        else
        {
            Console.WriteLine("키 140cm 이상만 탈 수 있습니다.");
        }
    }
}`, expect: `키(cm): 나이: 키는 충분하지만 12세 이상만 탈 수 있습니다.`, desc: '<code>height &gt;= 140 &amp;&amp; age &gt;= 12</code> 로 한 줄에 쓸 수도 있지만, 그러면 “<b>왜</b> 못 타는지”를 나누어 알려 줄 수 없습니다. 안내 메시지를 다르게 하고 싶을 때 중첩 if 가 유용합니다. 단, 3단계 이상 겹치면 읽기 어려우니 조건을 합치거나 다음 절의 switch 를 고려하세요.' },
          { type: 'code', title: '추가 예제. 윤년 판정 — 조건 조합 연습', stdin: '2024\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("연도: ");
        int year = int.Parse(Console.ReadLine());

        // 윤년: 4로 나누어떨어지고 100으로는 안 떨어지거나, 400으로 나누어떨어지는 해
        bool isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

        if (isLeap)
        {
            Console.WriteLine($"{year}년은 윤년입니다. (2월이 29일까지)");
        }
        else
        {
            Console.WriteLine($"{year}년은 평년입니다.");
        }
    }
}`, expect: `연도: 2024년은 윤년입니다. (2월이 29일까지)`, desc: '<code>&amp;&amp;</code> 가 <code>||</code> 보다 먼저 계산되므로 괄호가 없어도 결과는 같지만, <b>괄호를 넣으면 의도가 분명</b>해집니다. <code>1900</code>(평년), <code>2000</code>(윤년), <code>2023</code>(평년)으로도 실행해 보세요.' },
          { type: 'h', text: '흔한 실수 세 가지' },
          { type: 'callout', kind: 'warn', title: '① = 과 == 을 혼동', html: '<code>if (x = 5)</code> 는 “x 에 5를 넣어라”이므로 조건이 아닙니다. 다행히 C# 은 <code>int</code> 를 <code>bool</code> 로 바꿀 수 없어 <b>컴파일 오류 CS0029</b> 로 잡아 줍니다. 하지만 <code>bool ok = false; if (ok = true)</code> 는 컴파일이 되고 <b>항상 참</b>이 되니 주의하세요. 비교는 언제나 <code>==</code>.' },
          { type: 'callout', kind: 'warn', title: '② if (조건); — 뒤에 세미콜론', html: '<code>if (x &gt; 0);</code> 처럼 괄호 뒤에 세미콜론을 찍으면 “조건이 참이면 <b>아무것도 하지 마라</b>”는 뜻의 <b>빈 문장</b>이 되어 if 가 거기서 끝납니다. 그다음 줄은 조건과 상관없이 <b>항상</b> 실행됩니다. 컴파일러가 경고(CS0642)를 내 주니 경고 목록도 꼭 읽으세요.' },
          { type: 'callout', kind: 'warn', title: '③ 중괄호 없이 두 줄', html: '중괄호가 없으면 if 에 속하는 문장은 <b>바로 다음 한 문장뿐</b>입니다. 들여쓰기를 맞춰 놓아도 컴파일러는 들여쓰기를 보지 않습니다. 아래 예제로 확인하세요.' },
          { type: 'code', title: '추가 예제. 세미콜론과 중괄호 실수 — 결과를 예측해 보세요', code: `using System;

class Program
{
    static void Main()
    {
        int x = -5;

        if (x > 0);                                     // 세미콜론! if 는 여기서 끝난다
            Console.WriteLine("① 양수입니다 (세미콜론 실수)");

        if (x > 0)
            Console.WriteLine("② 양수입니다");            // if 에 속한 문장은 이 한 줄뿐
            Console.WriteLine("③ 이 줄은 항상 실행됩니다"); // 들여쓰기는 컴파일러에게 의미 없다

        if (x > 0)
        {
            Console.WriteLine("④ 양수입니다");
            Console.WriteLine("⑤ 중괄호로 묶으면 둘 다 건너뛴다");
        }
        Console.WriteLine("끝");
    }
}`, expect: `① 양수입니다 (세미콜론 실수)
③ 이 줄은 항상 실행됩니다
끝`, desc: 'x 는 음수인데도 ①과 ③이 출력됩니다. ① 은 세미콜론 때문에, ③ 은 중괄호가 없어서 if 와 무관한 문장이 되었기 때문입니다. ④⑤ 는 중괄호로 묶여 있어 정상적으로 건너뜁니다. Visual Studio 는 이런 코드에 <b>경고</b>를 표시합니다.' }
        ],
        practice: [
          {
            title: '실습 4-1. 양수 · 음수 · 0 판정',
            level: 1,
            desc: '<p>정수를 입력받아 <b>양수 · 음수 · 0</b> 중 무엇인지 출력하세요. <code>if – else if – else</code> 를 사용합니다.</p><pre>정수: -3\n음수입니다.</pre>',
            hint: '<code>if (n &gt; 0)</code> … <code>else if (n &lt; 0)</code> … <code>else</code> …',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("정수: ");
        int n = int.Parse(Console.ReadLine());
        // TODO: 양수 / 음수 / 0 판정해서 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("정수: ");
        int n = int.Parse(Console.ReadLine());
        if (n > 0)
        {
            Console.WriteLine("양수입니다.");
        }
        else if (n < 0)
        {
            Console.WriteLine("음수입니다.");
        }
        else
        {
            Console.WriteLine("0입니다.");
        }
    }
}
`,
            stdin: '-3\n',
            expect: `정수: 음수입니다.`
          },
          {
            title: '실습 4-2. 세 수 중 가장 큰 수',
            level: 2,
            desc: '<p>정수 세 개를 입력받아 가장 큰 수를 출력하세요. 변수 <code>max</code> 에 첫 번째 수를 넣어 두고, 나머지 수가 더 크면 <code>max</code> 를 바꾸는 방식으로 풀어 보세요.</p><pre>첫 번째 수: 7\n두 번째 수: 12\n세 번째 수: 9\n가장 큰 수: 12</pre>',
            hint: '<code>int max = a; if (b &gt; max) max = b; if (c &gt; max) max = c;</code>',
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

        int max = a;
        // TODO: b, c 와 비교해 max 갱신

        Console.WriteLine($"가장 큰 수: {max}");
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

        int max = a;
        if (b > max)
        {
            max = b;
        }
        if (c > max)
        {
            max = c;
        }

        Console.WriteLine($"가장 큰 수: {max}");
    }
}
`,
            stdin: '7\n12\n9\n',
            expect: `첫 번째 수: 두 번째 수: 세 번째 수: 가장 큰 수: 12`
          }
        ],
        quiz: [
          { q: '다음 코드의 출력은?<pre><code>int x = 7;\nif (x % 2 == 0)\n    Console.WriteLine("짝수");\nelse\n    Console.WriteLine("홀수");</code></pre>', options: ['짝수', '홀수', '7', '컴파일 오류'], answer: 1, explain: '7 % 2 는 1 이므로 조건이 거짓 → else 블록이 실행됩니다.' },
          { q: '다음 코드에서 <code>score = 85</code> 일 때 출력은?<pre><code>if (score &gt;= 90) Console.WriteLine("A");\nelse if (score &gt;= 80) Console.WriteLine("B");\nelse if (score &gt;= 70) Console.WriteLine("C");\nelse Console.WriteLine("F");</code></pre>', options: ['C', 'A', 'F', 'B'], answer: 3, explain: '위에서부터 검사해 처음 참이 되는 <code>score &gt;= 80</code> 에서 B 를 출력하고 나머지는 건너뜁니다.' },
          { q: '다음 코드의 출력은?<pre><code>int x = -1;\nif (x &gt; 0);\n    Console.WriteLine("양수");</code></pre>', options: ['컴파일 오류', '아무것도 출력되지 않는다', '양수', '실행 중 오류'], answer: 2, explain: '<code>if (x &gt; 0);</code> 의 세미콜론이 빈 문장이 되어 if 가 끝나고, 다음 줄은 조건과 무관하게 항상 실행됩니다.' },
          { q: '<code>bool a = true, b = false;</code> 일 때 <code>Console.WriteLine(a &amp;&amp; b || !b);</code> 의 출력은?', options: ['True', 'False', '오류', '1'], answer: 0, explain: '<code>a &amp;&amp; b</code> 는 false, <code>!b</code> 는 true. <code>false || true</code> 는 True 입니다.' },
          { q: '<code>int x = 5; if (x = 5) Console.WriteLine("다섯");</code> 의 결과는?', options: ['다섯', '아무것도 출력되지 않는다', '컴파일 오류', '5'], answer: 2, explain: '<code>x = 5</code> 는 대입이며 값이 int 라 bool 로 바꿀 수 없어 CS0029 오류. 비교는 <code>==</code>.' }
        ],
        slides: [
          { layout: 'title', title: 'if 문', subtitle: 'Chapter 04 · Section 01 — 조건문', badge: '04-1',
            notes: '<p><b>[도입 3분]</b> “놀이공원 입구에서 직원이 하는 일은?” — 키 · 나이를 보고 통과/거절. 프로그램도 똑같이 <b>조건을 보고 갈림길을 고른다</b>. 지금까지의 프로그램은 위에서 아래로 한 줄씩만 실행됐다는 점을 짚고 시작.</p><p>오늘 목표: bool 조건식, if / if-else / else if, 논리 연산자 조합, 흔한 실수 3가지.</p>' },
          { layout: 'bullets', title: '조건문이란?', lead: '조건이 참인지 거짓인지 보고 어느 길로 갈지 고르는 갈림길',
            bullets: ['지금까지: 위에서 아래로 <b>차례대로</b> 실행', '조건문: 상황에 따라 <b>다른 문장</b>을 실행', ['비유: 신호등(초록 → 건넌다, 빨강 → 멈춘다)'], '조건식의 값은 <b>bool</b> — <code>true</code> / <code>false</code>', '비교 연산자 <code>== != &lt; &gt; &lt;= &gt;=</code> 가 bool 을 만든다'],
            notes: '<p><b>[4분]</b> “<code>age &gt;= 19</code> 의 값은 무엇일까?” → 숫자가 아니라 True/False. 예제 4-1 을 실행해 True/False 가 찍히는 것을 보여 주고, <code>=</code> 하나와 <code>==</code> 둘의 차이를 미리 강조.</p>' },
          { layout: 'diagram', title: 'if-else 흐름도', html: SVG_IF, caption: '조건식 → 참이면 if 블록, 거짓이면 else 블록 → 다시 합류. 둘 중 하나만 실행된다',
            notes: '<p><b>[5분]</b> 마름모(조건) → 두 갈래 → 합류를 손으로 따라가며 설명. 발문: “else 가 없으면 거짓일 때는 어디로?” → 점선을 따라 바로 다음 문장.</p><p>“두 블록이 <b>동시에</b> 실행되는 경우가 있을까?” → 없다. 딱 하나.</p>' },
          { layout: 'code', title: '예제 4-2. if 문', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("나이를 입력하세요: ");
        int age = int.Parse(Console.ReadLine());

        if (age >= 19)
        {
            Console.WriteLine("성인입니다.");
            Console.WriteLine("입장할 수 있습니다.");
        }

        Console.WriteLine("검사를 마쳤습니다.");   // 항상 실행
    }
}`, stdin: '20\n', points: ['<code>if (조건식) { … }</code>', '참이면 블록 실행, 거짓이면 <b>통째로 건너뜀</b>', '블록 밖 문장은 항상 실행', '블록 안은 들여쓰기'],
            notes: '<p><b>[5분]</b> 20 으로 실행 → 세 줄. 15 로 바꿔 실행 → 한 줄. “15 일 때 블록 안 두 줄은 어디로 갔나?” → 건너뛰었다.</p><p>중괄호 생략은 한 문장일 때만 가능하다고 언급하되, 초보 때는 항상 쓰라고 권장.</p>' },
          { layout: 'code', title: '예제 4-3. if-else', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("정수를 입력하세요: ");
        int n = int.Parse(Console.ReadLine());

        if (n % 2 == 0)
        {
            Console.WriteLine($"{n} 은(는) 짝수입니다.");
        }
        else
        {
            Console.WriteLine($"{n} 은(는) 홀수입니다.");
        }
    }
}`, stdin: '7\n', points: ['<code>else</code> = “그 밖의 모든 경우”', '<code>else</code> 에는 조건을 쓰지 않는다', '<code>n % 2 == 0</code> → 나머지가 0 이면 짝수'],
            notes: '<p><b>[4분]</b> 실행 전 예측: “7 을 넣으면?” 그다음 0 을 넣으면 짝수로 나오는 이유(0 % 2 == 0)도 물어보기. <code>else (n % 2 == 1)</code> 처럼 else 에 조건을 쓰는 실수를 미리 보여 줘도 좋습니다(컴파일 오류).</p>' },
          { layout: 'code', title: '예제 4-4. else if 사다리', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("점수(0~100): ");
        int score = int.Parse(Console.ReadLine());
        string grade;

        if (score >= 90)      grade = "A";
        else if (score >= 80) grade = "B";   // 90 미만 && 80 이상
        else if (score >= 70) grade = "C";
        else if (score >= 60) grade = "D";
        else                  grade = "F";

        Console.WriteLine($"{score}점은 {grade} 등급입니다.");
    }
}`, stdin: '85\n', points: ['위에서부터 검사, <b>처음 참인 가지 하나만</b>', '아래 조건은 “위가 거짓”을 전제로 함', '<b>좁은 조건부터</b> 위에 (순서 중요!)'],
            notes: '<p><b>[6분]</b> 85 → B 를 손으로 추적. 발문: “<code>&gt;= 60</code> 을 맨 위로 올리면 95점은?” → D. 순서의 중요성을 실행으로 확인.</p><p>한 줄 if 에서 중괄호를 생략한 형태를 보여 주되, 본문 예제는 중괄호 버전임을 안내.</p>' },
          { layout: 'table', title: '조건 조합 — 논리 연산자', head: ['연산자', '이름', '참이 되는 조건', '예'], rows: [['<code>a &amp;&amp; b</code>', 'AND 그리고', '<b>둘 다</b> 참', '<code>age &gt;= 19 &amp;&amp; hasTicket</code>'], ['<code>a || b</code>', 'OR 또는', '<b>하나라도</b> 참', '<code>day == 6 || day == 7</code>'], ['<code>!a</code>', 'NOT 아니다', '참 ↔ 거짓 뒤집기', '<code>!isMember</code>']],
            lead: '우리말 그리고 · 또는 · 아니다 — && 가 || 보다 먼저 계산된다',
            notes: '<p><b>[4분]</b> 칠판 O/X 퀴즈: <code>true &amp;&amp; false</code>, <code>true || false</code>, <code>!false</code>, <code>false || true &amp;&amp; false</code>(→ false, &amp;&amp; 먼저). 괄호를 쓰면 안전하다고 안내.</p>' },
          { layout: 'code', title: '예제 4-5. 로그인 검사', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("아이디: ");
        string id = Console.ReadLine();
        Console.Write("비밀번호: ");
        string pw = Console.ReadLine();

        bool idOk = id == "admin";
        bool pwOk = pw == "1234";

        if (id == "" || pw == "")
            Console.WriteLine("모두 입력하세요.");
        else if (idOk && pwOk)
            Console.WriteLine("로그인 성공! 환영합니다.");
        else if (!idOk)
            Console.WriteLine("존재하지 않는 아이디입니다.");
        else
            Console.WriteLine("비밀번호가 틀렸습니다.");
    }
}`, stdin: 'admin\n1234\n', points: ['<code>||</code> 하나라도 비어 있으면', '<code>&amp;&amp;</code> 둘 다 맞으면', '<code>!idOk</code> 아이디가 틀리면', '조건을 bool 변수에 담으면 읽기 쉽다'],
            notes: '<p><b>[6분]</b> admin/1234 → 성공. admin/0000, guest/1234, 빈 값 순서로 바꿔 네 가지 가지를 모두 보여 줍니다. “마지막 else 에 도착했다는 건 무엇이 확실한 상태인가?” → 아이디는 맞다.</p><p>중첩 if(예제 4-6)와 윤년 예제는 시간이 남으면 본문에서 실행.</p>' },
          { layout: 'bullets', title: '흔한 실수 세 가지', lead: '컴파일러는 들여쓰기를 보지 않는다',
            bullets: ['① <code>if (x = 5)</code> — 대입! 비교는 <code>==</code>', ['int → bool 변환 불가라 컴파일 오류(CS0029)로 잡힘', '<code>if (ok = true)</code> 는 컴파일되고 항상 참'], '② <code>if (x &gt; 0);</code> — 세미콜론이 빈 문장, if 끝', ['다음 줄은 조건과 상관없이 항상 실행'], '③ 중괄호 없이 두 줄 — if 에 속한 건 <b>한 문장뿐</b>', '해결: <b>항상 중괄호</b>, 경고 목록 읽기'],
            notes: '<p><b>[5분]</b> 본문 “추가 예제. 세미콜론과 중괄호 실수”를 실행해 x = -5 인데도 ①③ 이 출력되는 것을 보여 줍니다. 결과를 먼저 예측시킨 뒤 실행하면 효과가 큽니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>int x = -1;\nif (x &gt; 0);\n    Console.WriteLine("양수");</code></pre>', options: ['컴파일 오류', '아무것도 출력되지 않는다', '양수', '실행 중 오류'], answer: 2, explain: '세미콜론이 빈 문장이 되어 if 가 끝나고, 다음 줄은 항상 실행됩니다.',
            notes: '<p>손들기로 답하게 한 뒤 공개. 이어서 “세미콜론을 지우면?” → 아무것도 출력되지 않음.</p>' },
          { layout: 'practice', title: '실습 4-2. 세 수 중 가장 큰 수', desc: '<p>정수 세 개를 입력받아 가장 큰 수를 출력하세요. <code>max</code> 에 첫 수를 넣고, 더 큰 수가 있으면 바꿉니다.</p>', starter: `using System;

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

        int max = a;
        // TODO: b, c 와 비교해 max 갱신

        Console.WriteLine($"가장 큰 수: {max}");
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

        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;

        Console.WriteLine($"가장 큰 수: {max}");
    }
}`, stdin: '7\n12\n9\n',
            notes: '<p><b>[8분]</b> 정답 실행 시 7, 12, 9 가 자동 입력됩니다. 흔한 오답: <code>if (a &gt; b &amp;&amp; a &gt; c)</code> 식으로 세 수를 모두 비교하는 긴 코드 — 틀리진 않지만 <code>max</code> 갱신 방식이 수가 늘어나도 통한다는 점을 설명. 빨리 끝난 학생은 실습 4-1 과 가장 작은 수까지.</p>' },
          { layout: 'summary', title: '정리', bullets: ['조건식의 값은 <b>bool</b> — 비교는 <code>==</code> (대입 <code>=</code> 아님)', '<code>if</code> 참일 때만 · <code>if-else</code> 둘 중 하나 · <code>else if</code> 처음 참인 가지 하나', '좁은 조건부터 위에 — 순서가 결과를 바꾼다', '<code>&amp;&amp;</code> 그리고 · <code>||</code> 또는 · <code>!</code> 아니다, 중첩 if 는 단계 검사', '<code>if (…);</code> 세미콜론 ✗, 두 줄 이상은 <b>중괄호</b>'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 값 하나로 여러 갈래를 나누는 switch 문과 switch 식.</p>' }
        ]
      },

      /* ===================== ch04-2 ===================== */
      {
        id: 'ch04-2',
        title: 'switch 문 · switch 식 · 패턴 매칭',
        minutes: 50,
        goals: [
          'switch 문의 case · break · default 구조를 설명하고 여러 case 를 묶어 쓸 수 있다',
          '정수와 문자열로 분기하는 switch 문을 작성할 수 있다',
          'switch 식(=&gt;, _)과 관계 패턴 · when 조건을 읽고 쓸 수 있다',
          'is 패턴으로 형식과 범위를 검사하고, if · 삼항 · switch 중 알맞은 것을 고를 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['switch 문 (case · break · default)', 13], ['switch 식 · 관계 패턴 · when', 15], ['is 패턴 · 삼항 비교 · 메뉴 프로그램', 9], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: 'switch 문 — 값 하나로 여러 갈래' },
          { type: 'p', html: '“월이 3이면 봄, 4면 봄, … 12면 겨울”처럼 <b>하나의 값</b>을 여러 경우와 비교할 때 <code>else if</code> 를 열 개씩 늘어놓으면 읽기 힘듭니다. <b><code>switch</code> 문</b>은 값을 한 번만 보고 <b>일치하는 <code>case</code> 로 바로 점프</b>합니다. 엘리베이터에서 층 버튼을 누르면 그 층으로 바로 가는 것과 같습니다.' },
          { type: 'figure', html: SVG_SWITCH, caption: 'switch (값) → 같은 case 로 점프 → break 에서 빠져나옴. 없으면 default' },
          { type: 'list', items: [
            '<code>switch (식)</code> — 괄호 안 값(정수 · 문자 · 문자열 · 열거형 …)을 검사합니다.',
            '<code>case 값:</code> — 값이 같을 때 실행할 문장들. 값은 <b>상수(리터럴)</b>여야 합니다.',
            '<code>break;</code> — switch 를 <b>빠져나옵니다</b>. C# 은 각 case 끝에 반드시 <code>break</code>(또는 <code>return</code> 등)가 있어야 합니다. 없으면 <b>컴파일 오류 CS0163</b>.',
            '<code>case 6: case 7: case 8:</code> — 라벨을 연달아 쓰면 <b>여러 값을 한 묶음</b>으로 처리합니다.',
            '<code>default:</code> — 어느 case 에도 해당하지 않을 때. 생략할 수 있습니다.'
          ] },
          { type: 'code', title: '예제 4-7. switch 문 — 월을 계절로', stdin: '7\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("월(1~12): ");
        int month = int.Parse(Console.ReadLine());

        switch (month)
        {
            case 3:
            case 4:
            case 5:
                Console.WriteLine($"{month}월은 봄입니다.");
                break;
            case 6: case 7: case 8:                 // 한 줄에 써도 된다
                Console.WriteLine($"{month}월은 여름입니다.");
                break;
            case 9: case 10: case 11:
                Console.WriteLine($"{month}월은 가을입니다.");
                break;
            case 12: case 1: case 2:
                Console.WriteLine($"{month}월은 겨울입니다.");
                break;
            default:
                Console.WriteLine("1~12 사이의 숫자를 입력하세요.");
                break;
        }
    }
}`, expect: `월(1~12): 7월은 여름입니다.`, desc: '<code>7</code> 은 <code>case 7:</code> 라벨로 점프해 “여름”을 출력하고 <code>break</code> 로 빠져나옵니다. 같은 것을 <code>else if</code> 로 쓰면 <code>month == 3 || month == 4 || …</code> 가 네 번 반복됩니다. 예시 입력을 <code>13</code> 으로 바꾸면 <code>default</code> 가 실행됩니다.' },
          { type: 'callout', kind: 'warn', title: 'break 를 빠뜨리면?', html: 'C 나 Java 에서는 <code>break</code> 가 없으면 다음 case 로 <b>흘러내려(fall-through)</b> 실수가 잦았습니다. C# 은 이를 막기 위해 <b>문장이 있는 case 의 끝에는 반드시 <code>break</code></b>(또는 <code>return</code>, <code>goto case</code>, <code>throw</code>)를 요구하며, 없으면 <b>CS0163: 제어를 한 case 레이블에서 다른 case 레이블로 이동할 수 없습니다</b> 오류가 납니다. 위 예제처럼 <b>문장 없이 라벨만</b> 겹치는 것은 허용됩니다.' },
          { type: 'code', title: '예제 4-8. 문자열 switch — 명령어 처리', stdin: 'stop\n', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("명령어(start/stop/help): ");
        string cmd = Console.ReadLine();

        switch (cmd)
        {
            case "start":
                Console.WriteLine("프로그램을 시작합니다.");
                break;
            case "stop":
            case "quit":
                Console.WriteLine("프로그램을 종료합니다.");
                break;
            case "help":
                Console.WriteLine("사용법: start | stop | help");
                break;
            default:
                Console.WriteLine($"'{cmd}' 은(는) 알 수 없는 명령어입니다.");
                break;
        }
    }
}`, expect: `명령어(start/stop/help): 프로그램을 종료합니다.`, desc: '문자열은 <b>내용이 완전히 같을 때</b>만 일치합니다. <code>Stop</code>, <code>STOP</code> 은 다른 문자열이므로 대소문자를 무시하려면 <code>switch (cmd.ToLower())</code> 처럼 소문자로 바꿔서 검사합니다.' },
          { type: 'h', text: 'switch 식 (switch expression) — C# 8' },
          { type: 'p', html: 'switch 문의 case 대부분이 “<b>값 하나를 골라 변수에 넣는</b>” 일이라면, C# 8 부터 생긴 <b>switch 식</b>이 훨씬 짧습니다. <code>값 switch { 패턴 =&gt; 결과, … }</code> 형태로 <b>결과값을 돌려주는 식(expression)</b>이라 바로 대입하거나 출력할 수 있습니다. <code>case</code> · <code>break</code> 가 없고, <code>default</code> 대신 <b>버림 패턴 <code>_</code></b>(나머지 전부)을 씁니다.' },
          { type: 'table', head: ['패턴', '예', '뜻'], rows: [
            ['상수 패턴', '<code>1 =&gt; "월"</code>', '값이 1 이면'],
            ['관계 패턴 (C# 9)', '<code>&gt;= 90 =&gt; "A"</code>', '90 이상이면 — 비교 연산자를 바로 쓴다'],
            ['패턴 결합 <code>and</code> · <code>or</code> · <code>not</code>', '<code>&gt;= 10 and &lt; 25 =&gt; "쾌적"</code>, <code>6 or 7 =&gt; "주말"</code>', '범위 · 여러 값'],
            ['<code>when</code> 조건', '<code>var v when v % 2 == 0 =&gt; "짝수"</code>', '패턴에 추가 조건식을 붙인다'],
            ['버림 패턴 <code>_</code>', '<code>_ =&gt; "F"</code>', '나머지 모든 값 (default). 보통 마지막에']
          ], caption: 'switch 식의 패턴 — 위에서부터 처음 맞는 가지의 결과가 값이 된다' },
          { type: 'code', title: '예제 4-9. switch 식 — 관계 패턴 · and/or · when', code: `using System;

class Program
{
    static void Main()
    {
        int score = 85;
        string grade = score switch          // 관계 패턴: 위에서부터 처음 맞는 것
        {
            >= 90 => "A",
            >= 80 => "B",
            >= 70 => "C",
            >= 60 => "D",
            _ => "F"                         // 나머지 전부
        };
        Console.WriteLine($"{score}점 → {grade}");

        int temp = 23;
        string feel = temp switch            // and 로 범위 지정
        {
            < 0 => "영하",
            >= 0 and < 10 => "춥다",
            >= 10 and < 25 => "쾌적",
            _ => "덥다"
        };
        Console.WriteLine($"{temp}도 → {feel}");

        int day = 6;
        string kind = day switch             // or 로 여러 값 묶기
        {
            1 or 2 or 3 or 4 or 5 => "평일",
            6 or 7 => "주말",
            _ => "잘못된 요일"
        };
        Console.WriteLine($"{day} → {kind}");

        int n = 8;
        string parity = n switch             // when: 패턴에 조건식 추가
        {
            < 0 => "음수",
            0 => "영",
            var v when v % 2 == 0 => "양의 짝수",
            _ => "양의 홀수"
        };
        Console.WriteLine($"{n} → {parity}");
    }
}`, expect: `85점 → B
23도 → 쾌적
6 → 주말
8 → 양의 짝수`, desc: '예제 4-4 의 등급 사다리가 다섯 줄로 줄었습니다. 가지 사이는 <b>쉼표</b>, 끝은 <b>세미콜론</b>입니다. <code>var v when …</code> 은 값을 <code>v</code> 에 담고 <code>when</code> 뒤 조건이 참일 때만 선택됩니다. 모든 경우를 덮지 못하면(예: <code>_</code> 없이) 컴파일러가 경고를 내고, 맞는 가지가 없으면 실행 중 <code>SwitchExpressionException</code> 이 납니다.' },
          { type: 'callout', kind: 'tip', title: 'switch 문 vs switch 식 — 언제 무엇을?', html: '각 가지에서 <b>값 하나를 고르는</b> 일이면 <b>switch 식</b>(짧고 안전), 각 가지에서 <b>여러 문장을 실행</b>(출력 · 입력 · 계산)해야 하면 <b>switch 문</b>을 씁니다. 메뉴 프로그램처럼 “번호에 따라 동작”은 switch 문, 등급 · 요일 이름 · 계절처럼 “값 → 값”은 switch 식이 어울립니다.' },
          { type: 'h', text: 'is 패턴 — 형식과 범위 검사' },
          { type: 'p', html: '<code>is</code> 는 “이 값이 <b>이런 모양인가?</b>”를 묻는 연산자입니다. <code>obj is int n</code> 은 <b>정수인지 확인하면서 동시에 정수 변수 <code>n</code> 에 담아</b> 줍니다(형식 패턴). 또 <code>score is &gt;= 90 and &lt;= 100</code> 처럼 <b>범위 검사</b>에도 쓸 수 있어 <code>score &gt;= 90 &amp;&amp; score &lt;= 100</code> 보다 읽기 쉽습니다.' },
          { type: 'code', title: '예제 4-10. is 패턴 — 형식 검사 · 범위 · null', code: `using System;

class Program
{
    static void Main()
    {
        object value = 42;          // object: 어떤 종류의 값이든 담을 수 있는 자료형 (8장)

        if (value is int n)         // 정수인가? 맞으면 n 에 담는다
        {
            Console.WriteLine($"정수 {n}, 두 배는 {n * 2}");
        }

        value = "안녕하세요";
        if (value is int)
        {
            Console.WriteLine("정수입니다");
        }
        else if (value is string s)
        {
            Console.WriteLine($"문자열, 길이 {s.Length}");
        }

        int score = 95;
        if (score is >= 90 and <= 100)      // 범위: score >= 90 && score <= 100
        {
            Console.WriteLine("A 등급 범위");
        }
        if (score is not 100)
        {
            Console.WriteLine("만점은 아님");
        }

        string input = null;
        if (input is null)                  // null 검사 (== null 과 같지만 더 안전)
        {
            Console.WriteLine("입력이 없습니다");
        }
    }
}`, expect: `정수 42, 두 배는 84
문자열, 길이 5
A 등급 범위
만점은 아님
입력이 없습니다`, desc: '<code>value is int n</code> 이 참이면 그 블록 안에서 <code>n</code> 을 정수로 바로 쓸 수 있습니다. 2장의 <code>int.TryParse(s, out int n)</code> 과 비슷한 “검사 + 변수 만들기” 방식입니다. 형식 패턴은 8장(클래스)과 9장(상속)에서 “어떤 클래스의 객체인가”를 가릴 때 다시 만납니다.' },
          { type: 'h', text: 'if-else · 삼항 연산자 · switch 식 비교' },
          { type: 'p', html: '“짝수면 A, 아니면 B”처럼 <b>두 갈래 중 값 하나</b>를 고르는 일은 3장의 <b>삼항 연산자 <code>조건 ? 참값 : 거짓값</code></b> 이 가장 짧습니다. 갈래가 셋 이상이면 삼항을 겹치지 말고 <code>else if</code> 나 <b>switch 식</b>을 쓰세요.' },
          { type: 'code', title: '예제 4-11. 같은 판정을 세 가지 방법으로', code: `using System;

class Program
{
    static void Main()
    {
        int n = 7;

        // 1) if-else 문 — 문장. 변수를 먼저 선언해야 한다
        string r1;
        if (n % 2 == 0) r1 = "짝수";
        else r1 = "홀수";

        // 2) 삼항 연산자 — 식. 두 갈래일 때 가장 짧다
        string r2 = n % 2 == 0 ? "짝수" : "홀수";

        // 3) switch 식 — 식. 갈래가 많아져도 읽기 쉽다
        string r3 = (n % 2) switch { 0 => "짝수", _ => "홀수" };   // 괄호 필요: switch 가 % 보다 먼저 묶인다

        Console.WriteLine($"{r1} {r2} {r3}");

        // 갈래가 넷: 삼항을 겹치면 읽기 어렵다 → switch 식
        int t = 15;
        string feel1 = t < 0 ? "영하" : t < 10 ? "춥다" : t < 25 ? "쾌적" : "덥다";
        string feel2 = t switch { < 0 => "영하", < 10 => "춥다", < 25 => "쾌적", _ => "덥다" };
        Console.WriteLine($"{feel1} {feel2}");
    }
}`, expect: `홀수 홀수 홀수
쾌적 쾌적`, desc: '세 방법의 결과는 같습니다. <b>문장(statement)</b>인 if 는 값을 돌려주지 않으므로 변수를 따로 선언해야 하지만, <b>식(expression)</b>인 삼항 연산자와 switch 식은 <b>그 자리에서 값</b>이 되어 바로 대입 · 출력할 수 있습니다.' },
          { type: 'h', text: '메뉴 프로그램 — 번호를 입력받아 동작하기' },
          { type: 'p', html: '콘솔 프로그램의 단골 구조입니다. 메뉴를 보여 주고 <b>번호를 입력받아 switch 문으로 동작</b>을 나눕니다. 각 case 안에서 다시 입력을 받거나 if 로 검사하는 등 <b>여러 문장</b>을 실행하므로 switch 식이 아니라 switch 문이 어울립니다.' },
          { type: 'code', title: '예제 4-12. 간단 은행 메뉴', stdin: '2\n5000\n', code: `using System;

class Program
{
    static void Main()
    {
        int balance = 10000;

        Console.WriteLine("=== 간단 은행 ===");
        Console.WriteLine("1. 잔액 조회  2. 입금  3. 출금  0. 종료");
        Console.Write("선택: ");
        int menu = int.Parse(Console.ReadLine());

        switch (menu)
        {
            case 1:
                Console.WriteLine($"잔액: {balance:N0}원");
                break;
            case 2:
                Console.Write("입금액: ");
                int deposit = int.Parse(Console.ReadLine());
                balance += deposit;
                Console.WriteLine($"입금 완료. 잔액: {balance:N0}원");
                break;
            case 3:
                Console.Write("출금액: ");
                int withdraw = int.Parse(Console.ReadLine());
                if (withdraw > balance)
                {
                    Console.WriteLine("잔액이 부족합니다.");
                }
                else
                {
                    balance -= withdraw;
                    Console.WriteLine($"출금 완료. 잔액: {balance:N0}원");
                }
                break;
            case 0:
                Console.WriteLine("이용해 주셔서 감사합니다.");
                break;
            default:
                Console.WriteLine("잘못된 메뉴입니다. 0~3 을 입력하세요.");
                break;
        }
    }
}`, expect: `=== 간단 은행 ===
1. 잔액 조회  2. 입금  3. 출금  0. 종료
선택: 입금액: 입금 완료. 잔액: 15,000원`, desc: '<code>case 3</code> 안에 <code>if-else</code> 가 들어 있듯 조건문은 자유롭게 겹칠 수 있습니다. 예시 입력을 <code>3</code> / <code>20000</code> 으로 바꾸면 “잔액이 부족합니다.”, <code>9</code> 로 바꾸면 default 가 실행됩니다. 지금은 한 번 고르면 끝나지만, 5장에서 <b>반복문</b>으로 감싸면 0 을 누를 때까지 계속 도는 진짜 메뉴 프로그램이 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — goto case 와 튜플 패턴', html: '<ul><li>switch 문에서 한 case 를 처리한 뒤 다른 case 로 일부러 넘어가려면 <code>goto case 2;</code> 를 씁니다(거의 쓰지 않습니다).</li><li>값 두 개를 한꺼번에 검사하려면 <b>튜플 패턴</b>: <code>(x, y) switch { (0, 0) =&gt; "원점", (_, 0) =&gt; "x축 위", (0, _) =&gt; "y축 위", _ =&gt; "그 밖" }</code>. 튜플은 6장에서 배웁니다.</li><li>패턴 매칭은 C# 7 부터 매 버전 강력해지고 있습니다. 8장 이후 클래스 · 레코드와 함께 <b>속성 패턴</b> <code>p is { Age: &gt;= 19 }</code> 도 만납니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 4-3. 요일 번호 → 요일 이름',
            level: 1,
            desc: '<p>1~7 사이의 번호를 입력받아 <b>switch 문</b>으로 요일 이름(월요일 ~ 일요일)을 출력하세요. 그 밖의 번호는 “잘못된 번호입니다.” 를 출력합니다.</p><pre>요일 번호(1~7): 3\n수요일</pre>',
            hint: '<code>case 1: Console.WriteLine("월요일"); break;</code> 를 7개, 그리고 <code>default</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("요일 번호(1~7): ");
        int day = int.Parse(Console.ReadLine());

        switch (day)
        {
            case 1:
                Console.WriteLine("월요일");
                break;
            // TODO: case 2 ~ 7, default
        }
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("요일 번호(1~7): ");
        int day = int.Parse(Console.ReadLine());

        switch (day)
        {
            case 1:
                Console.WriteLine("월요일");
                break;
            case 2:
                Console.WriteLine("화요일");
                break;
            case 3:
                Console.WriteLine("수요일");
                break;
            case 4:
                Console.WriteLine("목요일");
                break;
            case 5:
                Console.WriteLine("금요일");
                break;
            case 6:
                Console.WriteLine("토요일");
                break;
            case 7:
                Console.WriteLine("일요일");
                break;
            default:
                Console.WriteLine("잘못된 번호입니다.");
                break;
        }
    }
}
`,
            stdin: '3\n',
            expect: `요일 번호(1~7): 수요일`
          },
          {
            title: '실습 4-4. 계산기 — switch 로 연산자 고르기',
            level: 2,
            desc: '<p>정수 두 개와 연산자(<code>+ - * /</code>)를 입력받아 계산 결과를 출력하세요. 연산자는 문자열로 받아 <b>switch 문</b>으로 나눕니다. 나눗셈은 <code>b</code> 가 0 이면 “0 으로 나눌 수 없습니다.” 를 출력하고, 아니면 실수 나눗셈 결과를 출력합니다. 모르는 연산자는 “알 수 없는 연산자입니다.”</p><pre>첫 번째 수: 15\n연산자(+ - * /): *\n두 번째 수: 4\n15 * 4 = 60</pre>',
            hint: '<code>case "+": Console.WriteLine($"{a} + {b} = {a + b}"); break;</code> … 나눗셈은 case 안에서 <code>if (b == 0)</code> 검사 후 <code>(double)a / b</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("연산자(+ - * /): ");
        string op = Console.ReadLine();
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());

        switch (op)
        {
            case "+":
                Console.WriteLine($"{a} + {b} = {a + b}");
                break;
            // TODO: "-", "*", "/" (0 검사), default
        }
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
        Console.Write("연산자(+ - * /): ");
        string op = Console.ReadLine();
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());

        switch (op)
        {
            case "+":
                Console.WriteLine($"{a} + {b} = {a + b}");
                break;
            case "-":
                Console.WriteLine($"{a} - {b} = {a - b}");
                break;
            case "*":
                Console.WriteLine($"{a} * {b} = {a * b}");
                break;
            case "/":
                if (b == 0)
                {
                    Console.WriteLine("0 으로 나눌 수 없습니다.");
                }
                else
                {
                    Console.WriteLine($"{a} / {b} = {(double)a / b}");
                }
                break;
            default:
                Console.WriteLine("알 수 없는 연산자입니다.");
                break;
        }
    }
}
`,
            stdin: '15\n*\n4\n',
            expect: `첫 번째 수: 연산자(+ - * /): 두 번째 수: 15 * 4 = 60`
          }
        ],
        quiz: [
          { q: 'C# 의 switch 문에서 문장이 있는 case 끝에 <code>break</code> 를 쓰지 않으면?', options: ['다음 case 로 이어서 실행된다', '컴파일 오류가 난다', '자동으로 default 로 간다', '그 case 만 건너뛴다'], answer: 1, explain: 'C# 은 fall-through 를 허용하지 않습니다. CS0163 오류. 라벨만 겹치는 <code>case 1: case 2:</code> 는 허용됩니다.' },
          { q: '다음 코드에서 <code>s</code> 의 값은?<pre><code>int m = 4;\nstring s = m switch\n{\n    1 or 2 or 12 =&gt; "겨울",\n    &gt;= 3 and &lt;= 5 =&gt; "봄",\n    _ =&gt; "기타"\n};</code></pre>', options: ['기타', '오류', '봄', '겨울'], answer: 2, explain: '4 는 첫 가지(1, 2, 12)에 없고, 둘째 가지 <code>&gt;= 3 and &lt;= 5</code> 에 맞아 “봄”.' },
          { q: 'switch 식에서 <code>_ =&gt; "F"</code> 의 <code>_</code> 는 무슨 뜻인가?', options: ['null 인 경우', '0 인 경우', '변수 이름', '나머지 모든 값 (default)'], answer: 3, explain: '버림(discard) 패턴 <code>_</code> 는 어떤 값이든 맞으므로 마지막에 두어 default 역할을 합니다.' },
          { q: '다음 코드의 출력은?<pre><code>object o = 3.5;\nif (o is int n) Console.WriteLine("정수");\nelse if (o is double d) Console.WriteLine("실수");\nelse Console.WriteLine("기타");</code></pre>', options: ['정수', '실수', '기타', '컴파일 오류'], answer: 1, explain: '3.5 는 double 이므로 <code>o is int</code> 는 거짓, <code>o is double d</code> 가 참입니다.' },
          { q: '다음 코드에서 <code>d = 7</code> 일 때 출력은?<pre><code>switch (d)\n{\n    case 6:\n    case 7:\n        Console.WriteLine("주말");\n        break;\n    default:\n        Console.WriteLine("평일");\n        break;\n}</code></pre>', options: ['주말', '평일', '주말 평일', '아무것도 출력되지 않는다'], answer: 0, explain: '<code>case 6:</code> 과 <code>case 7:</code> 은 라벨을 묶은 것이므로 7 이면 “주말”을 출력하고 break.' }
        ],
        slides: [
          { layout: 'title', title: 'switch 문 · switch 식 · 패턴 매칭', subtitle: 'Chapter 04 · Section 02', badge: '04-2',
            notes: '<p><b>[도입 3분]</b> 복습 퀴즈: “<code>if (x = 5)</code> 는 왜 오류?” “else if 사다리에서 조건 순서가 왜 중요?” 이어서 “월 1~12 를 계절로 바꾸는 코드를 else if 로 쓰면 몇 줄?” → 지루하다 → switch.</p>' },
          { layout: 'bullets', title: 'switch 문 — 값 하나로 여러 갈래', lead: '엘리베이터 층 버튼: 누른 층으로 바로 간다',
            bullets: ['<code>switch (값) { case 상수: … break; … default: … break; }</code>', '값이 같은 <b>case 로 바로 점프</b>', '<code>break</code> 로 빠져나온다 — <b>없으면 컴파일 오류</b> (CS0163)', '<code>case 6: case 7: case 8:</code> 라벨을 겹쳐 <b>여러 값 묶기</b>', '<code>default</code>: 아무것도 아닐 때 (생략 가능)', '정수 · 문자 · <b>문자열</b> 모두 가능'],
            notes: '<p><b>[4분]</b> 구조를 읽고 다음 슬라이드의 그림으로 넘어갑니다. C/Java 경험자가 있으면 “C# 은 fall-through 금지”를 강조.</p>' },
          { layout: 'diagram', title: 'switch 문의 동작', html: SVG_SWITCH, caption: 'month = 7 → case 7 로 점프 → “여름” → break → switch 끝',
            notes: '<p><b>[4분]</b> 굵은 선을 따라 7 의 경로를 설명. 발문: “13 을 넣으면 어느 상자?” → default. “break 가 없으면?” → C# 은 컴파일 오류.</p>' },
          { layout: 'code', title: '예제 4-7. 월 → 계절', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("월(1~12): ");
        int month = int.Parse(Console.ReadLine());

        switch (month)
        {
            case 3: case 4: case 5:
                Console.WriteLine($"{month}월은 봄입니다.");
                break;
            case 6: case 7: case 8:
                Console.WriteLine($"{month}월은 여름입니다.");
                break;
            case 9: case 10: case 11:
                Console.WriteLine($"{month}월은 가을입니다.");
                break;
            case 12: case 1: case 2:
                Console.WriteLine($"{month}월은 겨울입니다.");
                break;
            default:
                Console.WriteLine("1~12 사이의 숫자를 입력하세요.");
                break;
        }
    }
}`, stdin: '7\n', points: ['라벨 여러 개 = 여러 값 한 묶음', '각 묶음 끝에 <code>break</code>', '<code>default</code> 는 범위 밖 입력 처리'],
            notes: '<p><b>[6분]</b> 7 → 여름, 13 → default. break 하나를 지우고 실행해 CS0163 오류 메시지를 함께 읽습니다. “같은 코드를 else if 로 쓰면?” 을 학생에게 말로 시켜 보면 switch 의 장점이 드러납니다.</p>' },
          { layout: 'code', title: '예제 4-8. 문자열 switch', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("명령어(start/stop/help): ");
        string cmd = Console.ReadLine();

        switch (cmd)
        {
            case "start":
                Console.WriteLine("프로그램을 시작합니다.");
                break;
            case "stop":
            case "quit":
                Console.WriteLine("프로그램을 종료합니다.");
                break;
            case "help":
                Console.WriteLine("사용법: start | stop | help");
                break;
            default:
                Console.WriteLine($"'{cmd}' 은(는) 알 수 없는 명령어입니다.");
                break;
        }
    }
}`, stdin: 'stop\n', points: ['문자열도 case 로 비교', '<b>내용이 완전히 같아야</b> 일치 (대소문자 구분)', '대소문자 무시: <code>switch (cmd.ToLower())</code>'],
            notes: '<p><b>[4분]</b> stop, quit, STOP(→ default) 순으로 실행. <code>cmd.ToLower()</code> 를 넣어 다시 실행해 STOP 도 통하는 것을 보여 줍니다.</p>' },
          { layout: 'two', title: 'switch 문 vs switch 식 (C# 8)', left: { title: 'switch 문 — 문장을 실행', code: `switch (score / 10)
{
    case 10: case 9:
        grade = "A"; break;
    case 8:
        grade = "B"; break;
    default:
        grade = "F"; break;
}`, run: false }, right: { title: 'switch 식 — 값을 돌려줌', code: `string grade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    _     => "F"
};
// case · break 없음
// _ = 나머지 전부 (default)` , run: false },
            notes: '<p><b>[5분]</b> 같은 일을 두 방식으로 비교. 오른쪽은 <b>값이 되는 식</b>이라 바로 대입한다는 점, 가지 구분은 쉼표, 끝은 세미콜론임을 강조. “가지마다 여러 문장을 실행해야 하면?” → switch 문.</p>' },
          { layout: 'code', title: '예제 4-9. switch 식 — 관계 패턴 · and/or · when', code: `using System;

class Program
{
    static void Main()
    {
        int temp = 23;
        string feel = temp switch
        {
            < 0 => "영하",
            >= 0 and < 10 => "춥다",      // and 로 범위
            >= 10 and < 25 => "쾌적",
            _ => "덥다"
        };
        Console.WriteLine($"{temp}도 → {feel}");

        int n = 8;
        string parity = n switch
        {
            < 0 => "음수",
            0 => "영",
            var v when v % 2 == 0 => "짝수",   // when: 추가 조건
            _ => "홀수"
        };
        Console.WriteLine($"{n} → {parity}");
    }
}`, points: ['관계 패턴 <code>&lt; 0</code>, <code>&gt;= 90</code>', '<code>and</code> · <code>or</code> · <code>not</code> 으로 결합 (<code>6 or 7 =&gt; "주말"</code>)', '<code>var v when 조건</code>', '<code>_</code> 는 마지막에'],
            notes: '<p><b>[7분]</b> temp, n 값을 바꿔 가며 실행. <code>or</code> 로 여러 값을 묶는 요일 예(<code>6 or 7 =&gt; "주말"</code>)는 본문 예제 4-9 에서 보여 줍니다. <code>_</code> 가지를 지우면 경고가 나고, 맞는 가지가 없을 때 SwitchExpressionException 이 나는 것을 보여 주면 “왜 _ 가 필요한가”가 이해됩니다.</p>' },
          { layout: 'code', title: '예제 4-10. is 패턴', code: `using System;

class Program
{
    static void Main()
    {
        object value = 42;              // 무엇이든 담는 자료형 (8장)
        if (value is int n)             // 정수인가? 맞으면 n 에 담기
            Console.WriteLine($"정수 {n}, 두 배는 {n * 2}");

        value = "안녕하세요";
        if (value is string s)
            Console.WriteLine($"문자열, 길이 {s.Length}");

        int score = 95;
        if (score is >= 90 and <= 100)  // 범위 검사
            Console.WriteLine("A 등급 범위");
        if (score is not 100)
            Console.WriteLine("만점은 아님");

        string input = null;
        if (input is null)              // null 검사
            Console.WriteLine("입력이 없습니다");
    }
}`, points: ['<code>x is int n</code>: 검사 + 변수 만들기', '<code>is &gt;= 90 and &lt;= 100</code>: 범위', '<code>is null</code> / <code>is not null</code>', '클래스 · 상속(8~9장)에서 다시 만남'],
            notes: '<p><b>[5분]</b> TryParse 의 <code>out int n</code> 과 비교하면 “검사하면서 변수도 만든다”는 감각이 빨리 옵니다. 지금은 형식 패턴을 맛만 보고, 범위 패턴이 &amp;&amp; 보다 읽기 쉽다는 데 초점.</p>' },
          { layout: 'code', title: '예제 4-12. 메뉴 프로그램', code: `using System;

class Program
{
    static void Main()
    {
        int balance = 10000;
        Console.WriteLine("1. 잔액 조회  2. 입금  3. 출금  0. 종료");
        Console.Write("선택: ");
        int menu = int.Parse(Console.ReadLine());

        switch (menu)
        {
            case 1:
                Console.WriteLine($"잔액: {balance:N0}원");
                break;
            case 2:
                Console.Write("입금액: ");
                balance += int.Parse(Console.ReadLine());
                Console.WriteLine($"입금 완료. 잔액: {balance:N0}원");
                break;
            case 0:
                Console.WriteLine("종료합니다.");
                break;
            default:
                Console.WriteLine("잘못된 메뉴입니다.");
                break;
        }
    }
}`, stdin: '2\n5000\n', points: ['번호 → 동작: switch 문', 'case 안에서 입력 · 계산 · if 모두 가능', '5장 반복문으로 감싸면 진짜 메뉴'],
            notes: '<p><b>[4분]</b> 2 → 5000 입금. 본문 예제 4-12 에는 출금(잔액 부족 검사)까지 있으니 시간이 되면 그것을 실행. “0 을 누를 때까지 계속 돌게 하려면?” → 다음 장 예고.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드에서 <code>s</code> 의 값은?<pre><code>int m = 4;\nstring s = m switch\n{\n    1 or 2 or 12 =&gt; "겨울",\n    &gt;= 3 and &lt;= 5 =&gt; "봄",\n    _ =&gt; "기타"\n};</code></pre>', options: ['기타', '오류', '봄', '겨울'], answer: 2, explain: '4 는 둘째 가지 <code>&gt;= 3 and &lt;= 5</code> 에 맞습니다.',
            notes: '<p>이어서 “m = 12 면?” → 겨울, “m = 8 이면?” → 기타. “_ 가지를 지우고 8 을 넣으면?” → 실행 오류.</p>' },
          { layout: 'practice', title: '실습 4-4. 계산기 — switch 로 연산자 고르기', desc: '<p>정수 두 개와 연산자(<code>+ - * /</code>)를 입력받아 <b>switch 문</b>으로 계산하세요. 나눗셈은 0 검사 후 실수 나눗셈, 모르는 연산자는 안내 메시지.</p>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("연산자(+ - * /): ");
        string op = Console.ReadLine();
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());

        switch (op)
        {
            case "+":
                Console.WriteLine($"{a} + {b} = {a + b}");
                break;
            // TODO: "-", "*", "/" (0 검사), default
        }
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        int a = int.Parse(Console.ReadLine());
        Console.Write("연산자(+ - * /): ");
        string op = Console.ReadLine();
        Console.Write("두 번째 수: ");
        int b = int.Parse(Console.ReadLine());

        switch (op)
        {
            case "+": Console.WriteLine($"{a} + {b} = {a + b}"); break;
            case "-": Console.WriteLine($"{a} - {b} = {a - b}"); break;
            case "*": Console.WriteLine($"{a} * {b} = {a * b}"); break;
            case "/":
                if (b == 0) Console.WriteLine("0 으로 나눌 수 없습니다.");
                else Console.WriteLine($"{a} / {b} = {(double)a / b}");
                break;
            default: Console.WriteLine("알 수 없는 연산자입니다."); break;
        }
    }
}`, stdin: '15\n*\n4\n',
            notes: '<p><b>[8분]</b> 정답 실행 시 15, *, 4 가 자동 입력됩니다. 흔한 실수: 나눗셈에서 <code>a / b</code> 정수 나눗셈(2장 복습), break 누락. 빨리 끝난 학생은 실습 4-3(요일)이나 <code>%</code> 연산자 추가.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>switch (값) { case 상수: … break; default: … }</code> — 같은 case 로 점프', '문장 있는 case 끝엔 <b>break 필수</b>, 라벨 겹치기로 여러 값 묶기', 'switch 식: <code>값 switch { 패턴 =&gt; 결과, _ =&gt; 기본 }</code> — 값을 돌려주는 식', '관계 패턴 <code>&gt;= 90</code>, <code>and</code>/<code>or</code>/<code>not</code>, <code>when</code> 조건', '<code>x is int n</code> 형식 검사, <code>is &gt;= 90 and &lt;= 100</code> 범위', '두 갈래 값 → 삼항, 값 여러 갈래 → switch 식, 동작 여러 갈래 → switch 문'],
            notes: '<p>학습 목표 확인. 다음 시간: 반복문(for · while) — 메뉴 프로그램을 계속 돌게 만들기.</p>' }
        ]
      }
    ]
  });
})();
