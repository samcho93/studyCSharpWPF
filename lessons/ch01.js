/* Chapter 01. C# 과 .NET, 첫 프로그램 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_DOTNET = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="C# 소스 코드가 실행되기까지">
  <defs><marker id="ah1a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="40" y="150" width="300" height="220" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="190" y="200" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">소스 코드</text>
  <text x="190" y="240" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Program.cs</text>
  <text x="190" y="285" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">Console.WriteLine(</text>
  <text x="190" y="315" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">  "Hello");</text>
  <text x="190" y="350" text-anchor="middle" style="font-size:20px;fill:var(--muted)">사람이 읽는 글</text>
  <line x1="345" y1="260" x2="440" y2="260" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah1a)"/>
  <text x="392" y="240" text-anchor="middle" style="font-size:20px;fill:var(--accent)">컴파일</text>
  <rect x="450" y="150" width="300" height="220" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="600" y="200" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">중간 언어 (IL)</text>
  <text x="600" y="240" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">MyApp.dll</text>
  <text x="600" y="285" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">ldstr "Hello"</text>
  <text x="600" y="315" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">call WriteLine</text>
  <text x="600" y="350" text-anchor="middle" style="font-size:20px;fill:var(--muted)">CPU 와 무관한 코드</text>
  <line x1="755" y1="260" x2="850" y2="260" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah1a)"/>
  <text x="802" y="240" text-anchor="middle" style="font-size:20px;fill:var(--accent)">JIT 실행</text>
  <rect x="860" y="150" width="380" height="220" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1050" y="200" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">.NET 런타임 (CLR)</text>
  <text x="1050" y="245" text-anchor="middle" style="font-size:21px;fill:var(--fg)">IL → 기계어 번역 · 메모리 관리(GC)</text>
  <text x="1050" y="285" text-anchor="middle" style="font-size:21px;fill:var(--fg)">기본 클래스 라이브러리(BCL)</text>
  <text x="1050" y="330" text-anchor="middle" style="font-size:20px;fill:var(--muted)">Windows · macOS · Linux · 브라우저(WebAssembly)</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)">C# 컴파일러(Roslyn)가 소스 코드를 IL 로 바꾸고, .NET 런타임이 실행할 때 기계어로 번역한다</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:21px;fill:var(--muted)">이 강좌: 같은 Roslyn 과 .NET 런타임(WebAssembly) 이 브라우저 안에서 동작한다</text>
</svg>`;

  const SVG_STRUCT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="C# 프로그램의 구조">
  <rect x="40" y="30" width="800" height="500" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <g style="${MONO};font-size:26px;fill:var(--fg)">
    <text x="70" y="80"><tspan fill="var(--accent)">using</tspan> System;</text>
    <text x="70" y="140"><tspan fill="var(--accent)">namespace</tspan> HelloApp</text>
    <text x="70" y="180">{</text>
    <text x="110" y="230"><tspan fill="var(--accent)">class</tspan> Program</text>
    <text x="110" y="270">{</text>
    <text x="150" y="320"><tspan fill="var(--accent)">static void</tspan> Main()</text>
    <text x="150" y="360">{</text>
    <text x="190" y="410">Console.WriteLine(<tspan fill="var(--accent2)">"안녕하세요, C#!"</tspan>);</text>
    <text x="150" y="450">}</text>
    <text x="110" y="490">}</text>
    <text x="70" y="525">}</text>
  </g>
  <g style="font-size:22px">
    <text x="880" y="80" style="fill:var(--accent);font-weight:700">① using 지시문</text>
    <text x="880" y="108" style="fill:var(--muted)">Console 이 들어 있는 System 을 쓰겠다</text>
    <text x="880" y="160" style="fill:var(--accent);font-weight:700">② 네임스페이스</text>
    <text x="880" y="188" style="fill:var(--muted)">클래스들을 묶는 이름 공간(폴더 같은 것)</text>
    <text x="880" y="240" style="fill:var(--accent);font-weight:700">③ 클래스</text>
    <text x="880" y="268" style="fill:var(--muted)">코드는 반드시 클래스 안에 들어 있다</text>
    <text x="880" y="330" style="fill:var(--accent);font-weight:700">④ Main 메서드 = 시작점</text>
    <text x="880" y="358" style="fill:var(--muted)">프로그램은 여기서 시작해 여기서 끝난다</text>
    <text x="880" y="420" style="fill:var(--accent2);font-weight:700">⑤ 문장(statement)</text>
    <text x="880" y="448" style="fill:var(--muted)">한 가지 일을 하고 세미콜론 ; 으로 끝난다</text>
    <text x="880" y="500" style="fill:var(--warn);font-weight:700">{ } 중괄호 = 블록(범위)</text>
  </g>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch01',
    no: '01',
    title: 'C# 과 .NET, 첫 프로그램',
    subtitle: 'Getting Started',
    summary: 'C# 언어와 .NET 플랫폼이 무엇인지 알아보고, Visual Studio 로 첫 콘솔 프로그램을 만들어 실행합니다. 프로그램의 기본 구조(네임스페이스 · 클래스 · Main)와 Console 입출력을 익힙니다.',
    goals: [
      'C# 과 .NET 의 관계, 컴파일과 실행 과정을 설명할 수 있다',
      'Visual Studio 에서 콘솔 앱 프로젝트를 만들고 실행할 수 있다',
      'C# 프로그램의 기본 구조(using · namespace · class · Main)를 설명할 수 있다',
      'Console.WriteLine / Write / ReadLine 으로 출력과 입력을 처리할 수 있다',
      '문자열 보간($"…")과 이스케이프 문자를 사용할 수 있다'
    ],
    sections: [
      /* ===================== ch01-1 ===================== */
      {
        id: 'ch01-1',
        title: 'C# 과 .NET, 그리고 첫 프로그램',
        minutes: 50,
        goals: [
          'C# 이 어떤 언어이고 어디에 쓰이는지 말할 수 있다',
          '소스 코드 → 컴파일 → 실행의 흐름을 설명할 수 있다',
          'Visual Studio 로 콘솔 앱을 만들고 실행할 수 있다',
          'C# 프로그램의 구조(using · namespace · class · Main · 문장)를 구분할 수 있다'
        ],
        flow: [['도입: C# 은 어디에 쓰일까', 5], ['C# 과 .NET, 컴파일 과정', 10], ['Visual Studio 첫 프로젝트', 15], ['프로그램 구조 · 주석', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: 'C# 이란?' },
          { type: 'p', html: '<b>C#(씨샵, C Sharp)</b> 은 마이크로소프트가 2000년에 만든 <b>객체 지향 프로그래밍 언어</b>입니다. C/C++ 과 Java 의 장점을 가져와 문법이 깔끔하고, 메모리를 자동으로 관리해 주어 배우기 쉽습니다. 지금도 매년 새 버전이 나오며(이 강좌는 <b>C# 13 / .NET 9</b> 기준), 다음과 같은 곳에 널리 쓰입니다.' },
          { type: 'table', head: ['분야', '기술', '예'], rows: [
            ['<b>윈도우 데스크톱 앱</b>', 'WPF · WinForms · WinUI', '업무용 프로그램, 장비 제어 화면, 이 강좌의 Part 2'],
            ['웹 서버 · API', 'ASP.NET Core', '쇼핑몰 서버, 회사 인트라넷'],
            ['게임', 'Unity', '수많은 모바일 · PC 게임의 스크립트'],
            ['모바일 · 크로스 플랫폼', '.NET MAUI', 'Android · iOS 앱을 한 코드로'],
            ['클라우드 · 데이터', 'Azure Functions, ML.NET', '서버리스 함수, 머신러닝']
          ], caption: 'C# 이 쓰이는 대표적인 분야' },
          { type: 'h', text: 'C# 과 .NET 의 관계' },
          { type: 'p', html: '<b>C#</b> 은 <b>언어(문법)</b>이고, <b>.NET(닷넷)</b> 은 C# 프로그램을 <b>실행해 주는 플랫폼</b>입니다. .NET 에는 프로그램을 실행하는 <b>런타임(CLR, Common Language Runtime)</b> 과, 파일 · 네트워크 · 문자열 등을 다루는 방대한 <b>기본 클래스 라이브러리(BCL)</b> 가 들어 있습니다. 우리가 쓰는 <code>Console.WriteLine</code> 도 이 라이브러리에 있는 기능입니다.' },
          { type: 'figure', html: SVG_DOTNET, caption: '소스 코드(.cs) → 컴파일(IL, .dll) → .NET 런타임이 실행' },
          { type: 'list', items: [
            '<b>컴파일(compile)</b>: 사람이 쓴 소스 코드를 컴퓨터가 이해하는 형태로 번역하는 일. C# 컴파일러 이름은 <b>Roslyn(로슬린)</b> 입니다.',
            '<b>IL(Intermediate Language, 중간 언어)</b>: C# 컴파일러가 만드는 결과. 특정 CPU 에 묶이지 않아 Windows · Mac · Linux 어디서나 같은 파일로 실행됩니다.',
            '<b>JIT(Just-In-Time) 컴파일</b>: 프로그램을 실행하는 순간 런타임이 IL 을 그 컴퓨터의 기계어로 번역합니다.',
            '<b>가비지 컬렉션(GC)</b>: 더 이상 쓰지 않는 메모리를 런타임이 자동으로 정리합니다. C/C++ 처럼 직접 <code>free</code>/<code>delete</code> 하지 않습니다.'
          ] },
          { type: 'callout', kind: 'info', title: '이 강좌의 실행 환경', html: '이 강좌는 <b>브라우저 안에</b> .NET 런타임(WebAssembly 로 빌드된 mono)과 Roslyn 컴파일러를 내려받아 코드를 컴파일 · 실행합니다. 설치할 것이 없어 어디서나 실습할 수 있고, 결과는 Visual Studio 에서 실행한 것과 같습니다. 다만 <b>실제 개발은 Visual Studio 로</b> 하므로 아래 설치 방법을 꼭 따라 해 보세요.' },
          { type: 'h', text: 'Visual Studio 설치와 첫 프로젝트' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 2022 Community 설치', html: '<ol><li><a href="https://visualstudio.microsoft.com/ko/" target="_blank" rel="noopener">visualstudio.microsoft.com</a> 에서 <b>Visual Studio 2022 Community</b>(무료)를 내려받아 설치 프로그램을 실행합니다.</li><li>워크로드에서 <b>.NET 데스크톱 개발</b>을 선택합니다. (C# 콘솔 앱과 WPF 앱을 만드는 데 필요한 모든 것이 들어 있습니다.)</li><li>설치가 끝나면 Visual Studio 를 실행하고 Microsoft 계정으로 로그인(선택)합니다.</li></ol>' },
          { type: 'callout', kind: 'vs', title: '새 콘솔 프로젝트 만들기 · 실행', html: '<ol><li><b>새 프로젝트 만들기</b> → 템플릿 검색에 <code>콘솔</code> 입력 → <b>콘솔 앱</b>(C#) 선택 → 다음</li><li>프로젝트 이름 <code>HelloApp</code>, 위치 지정 → 다음 → 프레임워크 <b>.NET 8.0</b> 또는 <b>9.0</b> → 만들기<br>(“최상위 문을 사용하지 않음” 체크 상자를 켜면 아래와 같은 전통적인 <code>class Program</code> 구조로 만들어집니다)</li><li><code>Program.cs</code> 가 열립니다. 코드를 입력한 뒤 <b>▶ 시작</b>(F5) 또는 <b>Ctrl + F5</b>(디버그하지 않고 시작)를 누르면 검은 콘솔 창이 뜨고 결과가 출력됩니다.</li></ol><p><b>F5</b> 로 실행하면 창이 바로 닫히는 경우가 있어 결과를 보기 어렵습니다. 결과를 확인할 때는 <b>Ctrl + F5</b> 를 쓰거나, 마지막에 <code>Console.ReadLine();</code> 을 넣어 두세요.</p>' },
          { type: 'code', title: '예제 1-1. 첫 프로그램 — 화면에 인사말 출력', code: `using System;

namespace HelloApp
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("안녕하세요, C#!");
            Console.WriteLine("첫 프로그램입니다.");
        }
    }
}`, expect: `안녕하세요, C#!
첫 프로그램입니다.`, desc: '<code>Console.WriteLine(…)</code> 은 괄호 안의 내용을 출력하고 <b>줄을 바꿉니다</b>. 두 번 호출했으니 두 줄이 출력됩니다. ▶ 실행을 눌러 오른쪽 콘솔에서 확인하세요.' },
          { type: 'h', text: 'C# 프로그램의 구조' },
          { type: 'figure', html: SVG_STRUCT, caption: 'C# 프로그램의 기본 구조 — 코드는 클래스 안에, 실행은 Main 에서 시작' },
          { type: 'table', head: ['구성 요소', '역할', '규칙'], rows: [
            ['<code>using System;</code>', '<b>System</b> 네임스페이스의 클래스(<code>Console</code>, <code>Math</code> …)를 짧은 이름으로 쓰게 함', '파일 맨 위에 씀. 여러 개 가능'],
            ['<code>namespace HelloApp { }</code>', '관련 클래스를 묶는 <b>이름 공간</b>. 이름 충돌 방지', '생략해도 되지만 보통 프로젝트 이름으로 만듦'],
            ['<code>class Program { }</code>', '코드가 들어가는 <b>클래스</b>. C# 의 모든 코드는 클래스(또는 구조체) 안에 있음', '이름은 대문자로 시작(관례)'],
            ['<code>static void Main() { }</code>', '프로그램의 <b>시작점(entry point)</b>. 운영체제가 이 메서드를 호출', '정확히 하나. 대문자 <b>M</b>'],
            ['<code>Console.WriteLine("…");</code>', '<b>문장(statement)</b>. 한 가지 일을 함', '끝에 세미콜론 <code>;</code> 필수']
          ] },
          { type: 'callout', kind: 'warn', title: 'C# 은 대소문자를 구분합니다', html: '<code>Console</code> 과 <code>console</code>, <code>Main</code> 과 <code>main</code> 은 <b>서로 다른 이름</b>입니다. 입문자가 가장 많이 만나는 오류 <code>CS0103: \'console\' 이름이 현재 컨텍스트에 없습니다</code> 는 대부분 대소문자 실수입니다. 세미콜론을 빠뜨리면 <code>CS1002: ; 필요</code> 오류가 납니다.' },
          { type: 'code', title: '추가 예제. 일부러 틀려 보기 — 오류 메시지 읽기', code: `using System;

class Program
{
    static void Main()
    {
        console.WriteLine("소문자 c 로 시작하면?");   // CS0103 오류
        Console.WriteLine("세미콜론이 없으면?")      // CS1002 오류
    }
}`, expectCompileError: true, desc: '실행하면 오른쪽 콘솔에 <b>컴파일 오류</b> 두 개가 표시되고, 각 오류 아래에 한국어 도움말이 붙습니다. 오류 위치를 누르면 편집기의 해당 줄로 이동합니다. 고쳐서 다시 실행해 보세요.' },
          { type: 'h', text: '주석 (comment)' },
          { type: 'p', html: '<b>주석</b>은 컴파일러가 무시하는 <b>사람을 위한 메모</b>입니다. 코드의 의도를 설명하거나, 잠시 코드를 끄고 싶을 때 씁니다.' },
          { type: 'code', title: '예제 1-2. 주석의 세 가지 형태', code: `using System;

class Program
{
    static void Main()
    {
        // 한 줄 주석: 이 줄의 // 뒤는 모두 무시됩니다
        Console.WriteLine("주석 연습");   // 문장 뒤에도 쓸 수 있습니다

        /* 여러 줄 주석:
           이 사이의 내용은 모두 무시됩니다
           Console.WriteLine("이 줄은 실행되지 않습니다"); */

        /// <summary>XML 문서 주석: 메서드나 클래스 위에 붙여 설명서를 만듭니다</summary>
        Console.WriteLine("끝");
    }
}`, expect: `주석 연습
끝`, desc: '편집기에서 <kbd>Ctrl</kbd>+<kbd>/</kbd> 를 누르면 현재 줄을 주석으로 만들거나 풉니다(Visual Studio 도 같은 단축키가 <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd>).' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 최상위 문(top-level statements)', html: 'C# 9 부터는 <code>class Program</code> 과 <code>Main</code> 을 쓰지 않고 <b>문장만 바로</b> 적을 수 있습니다. Visual Studio 의 새 콘솔 앱 템플릿은 기본적으로 이 형태(<code>Console.WriteLine("Hello, World!");</code> 한 줄)로 만들어집니다. 컴파일러가 뒤에서 <code>Main</code> 을 만들어 주는 것뿐이므로 동작은 같습니다. 이 강좌는 프로그램 구조를 눈으로 익히기 위해 <b>전통적인 형태</b>를 기본으로 쓰되, 짧은 실험에는 최상위 문도 사용합니다.' },
          { type: 'code', title: '추가 예제. 최상위 문으로 쓴 첫 프로그램', code: `// class 와 Main 없이 문장만 씁니다 (C# 9+, using System 도 자동으로 포함)
Console.WriteLine("안녕하세요, C#!");
Console.WriteLine("최상위 문(top-level statements) 버전");`, expect: `안녕하세요, C#!
최상위 문(top-level statements) 버전`, desc: '결과는 예제 1-1 과 같습니다. 어느 쪽을 쓰든 <b>한 프로젝트에 시작점은 하나</b>여야 합니다.' }
        ],
        practice: [
          {
            title: '실습 1-1. 자기소개 출력하기',
            level: 1,
            desc: '<p><code>Console.WriteLine</code> 을 세 번 사용해 이름, 좋아하는 것, 목표를 세 줄로 출력하는 프로그램을 완성하세요. 출력 예:</p><pre>이름: 홍길동\n좋아하는 것: 게임 만들기\n목표: WPF 로 나만의 프로그램 만들기</pre>',
            hint: '문장마다 <code>Console.WriteLine("…");</code> 한 줄씩. 큰따옴표와 세미콜론을 잊지 마세요.',
            starter: `using System;

class Program
{
    static void Main()
    {
        // TODO: 세 줄 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("이름: 홍길동");
        Console.WriteLine("좋아하는 것: 게임 만들기");
        Console.WriteLine("목표: WPF 로 나만의 프로그램 만들기");
    }
}
`,
            expect: `이름: 홍길동
좋아하는 것: 게임 만들기
목표: WPF 로 나만의 프로그램 만들기`
          },
          {
            title: '실습 1-2. 오류 고치기',
            level: 1,
            starterHasErrors: true,
            desc: '<p>아래 프로그램에는 오류가 <b>세 군데</b> 있습니다. 실행해서 오류 메시지를 읽고 모두 고쳐 “오류를 모두 고쳤습니다!” 가 출력되게 하세요.</p>',
            hint: '대소문자(<code>Main</code>, <code>Console</code>), 세미콜론, 닫는 중괄호를 확인하세요.',
            starter: `using System;

class Program
{
    static void main()
    {
        Console.WriteLine("오류를 모두 고쳤습니다!")

}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("오류를 모두 고쳤습니다!");
    }
}
`,
            expect: `오류를 모두 고쳤습니다!`
          }
        ],
        quiz: [
          { q: 'C# 컴파일러가 소스 코드를 번역해 만드는 결과물은?', options: ['그 컴퓨터의 기계어', 'CPU 와 무관한 중간 언어(IL)', 'HTML', '자바스크립트'], answer: 1, explain: 'C# 컴파일러(Roslyn)는 IL 을 만들고, 실행할 때 .NET 런타임이 JIT 로 기계어로 번역합니다.' },
          { q: 'C# 프로그램이 실행을 시작하는 곳은?', options: ['파일의 첫 줄', '<code>namespace</code>', '<code>Main</code> 메서드', '<code>using System;</code>'], answer: 2, explain: '<code>static void Main()</code> 이 시작점(entry point)입니다. 대문자 M 에 주의하세요.' },
          { q: '다음 중 컴파일 오류가 <b>나지 않는</b> 문장은?', options: ['<code>console.WriteLine("a");</code>', '<code>Console.WriteLine("a")</code>', '<code>Console.WriteLine("a");</code>', '<code>Console.writeline("a");</code>'], answer: 2, explain: '클래스 이름 <code>Console</code>, 메서드 이름 <code>WriteLine</code> 의 대소문자가 정확하고 세미콜론으로 끝나야 합니다.' },
          { q: '<code>using System;</code> 의 역할은?', options: ['프로그램을 시작한다', 'System 네임스페이스의 클래스를 짧은 이름으로 쓰게 한다', '메모리를 정리한다', '변수를 선언한다'], answer: 1, explain: '<code>using</code> 이 없으면 <code>System.Console.WriteLine</code> 처럼 전체 이름을 써야 합니다.' },
          { q: '컴파일러가 무시하는, 사람을 위한 메모를 쓰는 방법은?', options: ['<code>// 메모</code>', '<code>"메모"</code>', '<code>&lt;메모&gt;</code>', '<code>#메모</code>'], answer: 0, explain: '<code>//</code> 한 줄 주석, <code>/* … */</code> 여러 줄 주석입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'C# 과 .NET, 그리고 첫 프로그램', subtitle: 'Chapter 01 · Section 01 — 시작하기', badge: '01-1',
            notes: '<p><b>[도입 3분]</b> “여러분이 쓰는 프로그램 중에 C# 으로 만든 것이 있을까요?” — Unity 게임, 업무용 윈도우 프로그램, 웹 서비스 이야기로 시작합니다.</p><p>오늘 목표: C# 과 .NET 의 관계, 첫 프로그램 실행, 프로그램 구조 4가지(using · namespace · class · Main).</p>' },
          { layout: 'bullets', title: 'C# 은 어떤 언어인가?', lead: '마이크로소프트가 만든 현대적 객체 지향 언어 (2000 ~ 현재 C# 13)',
            bullets: ['C/C++ · Java 의 장점을 모아 <b>배우기 쉬운 문법</b>', '메모리를 자동 관리(<b>가비지 컬렉션</b>)', '<b>윈도우 앱(WPF)</b> · 웹(ASP.NET) · 게임(Unity) · 모바일(MAUI)', ['이 강좌: C# 기초 → WPF 윈도우 프로그래밍']],
            notes: '<p><b>[4분]</b> 표를 보여 주며 각 분야를 한 줄씩. 학생들이 아는 Unity 게임을 물어보세요.</p><p>“문법은 Java 와 매우 비슷하고, 포인터 걱정 없이 C++ 같은 성능을 낸다”고 정리합니다.</p>' },
          { layout: 'diagram', title: 'C# 코드는 어떻게 실행되나?', html: SVG_DOTNET, caption: '소스(.cs) → Roslyn 컴파일 → IL(.dll) → .NET 런타임(CLR) 이 JIT 로 실행',
            notes: '<p><b>[6분]</b> 왼쪽부터 오른쪽으로 손으로 짚으며 설명. 핵심 용어 3개: <b>컴파일러(Roslyn)</b>, <b>IL</b>, <b>런타임(CLR)</b>.</p><p>발문: “왜 바로 기계어로 안 만들고 IL 을 거칠까?” → 한 번 컴파일해서 어디서나 실행(플랫폼 독립).</p><p>이 강좌의 브라우저 실행 환경도 같은 Roslyn + .NET 런타임임을 알려 주세요.</p>' },
          { layout: 'bullets', title: 'Visual Studio 로 첫 프로젝트 만들기', lead: 'Visual Studio 2022 Community · “.NET 데스크톱 개발” 워크로드',
            bullets: ['새 프로젝트 만들기 → <b>콘솔 앱</b> (C#) → 이름 <code>HelloApp</code>', '프레임워크 .NET 8/9 · “최상위 문을 사용하지 않음” 체크', '<code>Program.cs</code> 에 코드 입력', ['<kbd>Ctrl</kbd>+<kbd>F5</kbd> 디버그하지 않고 실행 → 콘솔 창에 결과'], ['<kbd>F5</kbd> 는 창이 바로 닫힐 수 있음']],
            notes: '<p><b>[8분]</b> 프로젝터로 Visual Studio 를 직접 열어 시연합니다. 학생들도 따라 하게 하고, 설치가 안 된 학생은 이 강좌 페이지의 편집기로 실습하게 합니다.</p><p>주의: 프로젝트 이름에 한글 · 공백을 넣지 않게, 저장 위치를 기억하게 하세요.</p>' },
          { layout: 'code', title: '예제 1-1. 첫 프로그램', code: `using System;

namespace HelloApp
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("안녕하세요, C#!");
            Console.WriteLine("첫 프로그램입니다.");
        }
    }
}`, points: ['<code>Console.WriteLine</code>: 출력하고 <b>줄 바꿈</b>', '문장 끝에는 <b>세미콜론 ;</b>', '<code>{ }</code> 로 블록을 묶는다'],
            notes: '<p><b>[4분]</b> ▶ 실행으로 결과를 보여 준 뒤, 문자열을 바꿔 다시 실행. WriteLine 을 한 줄 더 추가해 보게 합니다.</p><p>“이 9줄 중 실제로 <i>일을 하는</i> 줄은 몇 줄?” → 2줄. 나머지는 구조.</p>' },
          { layout: 'diagram', title: 'C# 프로그램의 구조', html: SVG_STRUCT, caption: 'using → namespace → class → Main → 문장',
            notes: '<p><b>[6분]</b> 바깥에서 안쪽으로: using(도구 상자 열기) → namespace(폴더) → class(코드 상자) → Main(시작점) → 문장(일).</p><p>비유: namespace 는 아파트 단지, class 는 동, Main 은 현관.</p>' },
          { layout: 'table', title: '구조 요소 정리', head: ['요소', '역할', '규칙'], rows: [['<code>using System;</code>', 'System 의 클래스를 짧게 사용', '맨 위'], ['<code>namespace</code>', '클래스를 묶는 이름 공간', '생략 가능'], ['<code>class Program</code>', '코드가 들어가는 상자', '모든 코드는 클래스 안'], ['<code>static void Main()</code>', '시작점', '하나만, 대문자 M'], ['문장 <code>…;</code>', '한 가지 일', '세미콜론 필수']],
            notes: '<p><b>[3분]</b> 표를 읽고 “대문자 M”, “세미콜론”을 크게 강조. 다음 슬라이드에서 일부러 틀려 봅니다.</p>' },
          { layout: 'code', title: '일부러 틀려 보기 — 오류 메시지 읽기', code: `using System;

class Program
{
    static void Main()
    {
        console.WriteLine("소문자 c?");   // CS0103
        Console.WriteLine("세미콜론?")   // CS1002
    }
}`, expectCompileError: true, points: ['<b>CS0103</b>: 이름을 찾을 수 없음 → 대소문자', '<b>CS1002</b>: ; 필요', '오류 줄을 누르면 편집기로 이동'],
            notes: '<p><b>[5분]</b> 실행해서 오류 두 개를 보여 주고, 오류 번호(CS0103, CS1002)와 한국어 도움말을 읽습니다. 학생에게 고치게 한 뒤 다시 실행.</p><p>“오류 메시지는 적이 아니라 힌트”라고 말해 주세요. 오류 읽는 습관이 이 과목의 절반입니다.</p>' },
          { layout: 'two', title: '주석 — 컴파일러가 무시하는 메모', left: { title: '한 줄 · 여러 줄', code: `// 한 줄 주석
Console.WriteLine("a"); // 뒤에도

/* 여러 줄
   주석 */`, run: false }, right: { title: '언제 쓰나', bullets: ['코드의 <b>의도</b> 설명', '잠시 코드 끄기(주석 처리)', 'XML 문서 주석 <code>///</code> 로 설명서', '<kbd>Ctrl</kbd>+<kbd>/</kbd> 로 토글'] },
            notes: '<p><b>[3분]</b> “무엇을 하는지”보다 “왜 하는지”를 주석에 쓰라고 안내. 너무 많은 주석은 오히려 방해.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'C# 프로그램이 실행을 시작하는 곳은?', options: ['파일의 첫 줄', '<code>namespace</code>', '<code>Main</code> 메서드', '<code>using System;</code>'], answer: 2, explain: '<code>static void Main()</code> 이 시작점입니다.',
            notes: '<p>손을 들어 답하게 한 뒤 정답 공개. “main” 소문자면 시작점으로 인식하지 않는다는 점도 다시 확인.</p>' },
          { layout: 'practice', title: '실습 1-1. 자기소개 출력', desc: '<p><code>Console.WriteLine</code> 세 번으로 이름 · 좋아하는 것 · 목표를 세 줄 출력하세요.</p><pre>이름: 홍길동\n좋아하는 것: 게임 만들기\n목표: WPF 로 나만의 프로그램 만들기</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        // TODO: 세 줄 출력
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("이름: 홍길동");
        Console.WriteLine("좋아하는 것: 게임 만들기");
        Console.WriteLine("목표: WPF 로 나만의 프로그램 만들기");
    }
}`,
            notes: '<p><b>[5분]</b> 5분 안에 완성. 빨리 끝난 학생은 줄을 더 추가하거나 실습 1-2(오류 고치기)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['C# = 언어, .NET = 런타임 + 라이브러리', '소스 → Roslyn 컴파일 → IL → CLR 이 JIT 실행', 'using · namespace · class · <b>Main(시작점)</b> · 문장(;)', '대소문자 구분 · 세미콜론 · 중괄호 짝', '오류 메시지는 힌트 — 번호와 줄을 읽자'],
            notes: '<p>학습 목표를 다시 읽고 한 문장씩 확인. 다음 시간: Console 입출력과 문자열 보간.</p>' }
        ]
      },

      /* ===================== ch01-2 ===================== */
      {
        id: 'ch01-2',
        title: 'Console 입출력과 문자열 보간',
        minutes: 50,
        goals: [
          'Console.Write 와 WriteLine 의 차이를 설명할 수 있다',
          '이스케이프 문자(\\n, \\t, \\", \\\\)를 사용할 수 있다',
          '문자열 보간 $"…{식}…" 과 형식 지정({값:F2})을 사용할 수 있다',
          'Console.ReadLine 으로 입력을 받아 처리할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['Write / WriteLine · 이스케이프', 10], ['문자열 보간 · 형식 지정', 15], ['ReadLine 입력', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: 'Console.Write 와 Console.WriteLine' },
          { type: 'p', html: '<code>Console</code> 클래스는 <b>콘솔(검은 창)</b>과 대화하는 도구입니다. <code>WriteLine</code> 은 출력 뒤에 <b>줄을 바꾸고</b>, <code>Write</code> 는 <b>줄을 바꾸지 않습니다</b>.' },
          { type: 'code', title: '예제 1-3. Write 와 WriteLine 의 차이', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("가");
        Console.Write("나");
        Console.Write("다");
        Console.WriteLine();          // 줄만 바꿈
        Console.WriteLine("라");
        Console.WriteLine("마");
        Console.WriteLine(2024);      // 숫자도 출력 가능
        Console.WriteLine(3 + 4);     // 식의 결과 7 을 출력
    }
}`, expect: `가나다
라
마
2024
7`, desc: '<code>Write</code> 세 번은 한 줄에 이어 붙고, <code>WriteLine()</code>(인수 없음)은 줄만 바꿉니다. 괄호 안에 <b>숫자나 계산식</b>을 넣으면 결과값이 출력됩니다.' },
          { type: 'h', text: '이스케이프 문자 (escape sequence)' },
          { type: 'p', html: '문자열 안에서 <b>백슬래시 <code>\\</code></b> 로 시작하는 특수 문자입니다. 줄 바꿈이나 큰따옴표처럼 그냥은 쓸 수 없는 글자를 표현합니다.' },
          { type: 'table', head: ['표기', '의미', '예'], rows: [
            ['<code>\\n</code>', '줄 바꿈 (new line)', '<code>"1행\\n2행"</code>'],
            ['<code>\\t</code>', '탭 (tab) — 열 맞추기', '<code>"이름\\t나이"</code>'],
            ['<code>\\"</code>', '큰따옴표 자체', '<code>"그는 \\"안녕\\" 이라고 했다"</code>'],
            ['<code>\\\\</code>', '백슬래시 자체', '<code>"C:\\\\Users\\\\me"</code>'],
            ['<code>\\\'</code>', '작은따옴표 (문자 리터럴에서)', '<code>\'\\\'\'</code>'],
            ['<code>@"…"</code>', '<b>축자(verbatim) 문자열</b>: 이스케이프를 해석하지 않음', '<code>@"C:\\Users\\me"</code>']
          ] },
          { type: 'code', title: '예제 1-4. 이스케이프 문자와 축자 문자열', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("첫째 줄\\n둘째 줄");
        Console.WriteLine("이름\\t나이\\t키");
        Console.WriteLine("홍길동\\t20\\t175");
        Console.WriteLine("그는 \\"안녕\\" 이라고 말했다.");
        Console.WriteLine("경로: C:\\\\Users\\\\me");
        Console.WriteLine(@"경로: C:\\Users\\me   (축자 문자열)");
    }
}`, expect: `첫째 줄
둘째 줄
이름	나이	키
홍길동	20	175
그는 "안녕" 이라고 말했다.
경로: C:\\Users\\me
경로: C:\\Users\\me   (축자 문자열)`, desc: '파일 경로처럼 백슬래시가 많을 때는 <code>@"…"</code> 축자 문자열이 편합니다. 축자 문자열 안에서 큰따옴표는 <code>""</code> 두 개로 씁니다.' },
          { type: 'h', text: '문자열 보간 — $"…{식}…"' },
          { type: 'p', html: '문자열 앞에 <b><code>$</code></b> 를 붙이면 문자열 안의 <b><code>{ }</code> 에 변수나 식</b>을 넣을 수 있습니다. 문자열을 <code>+</code> 로 이어 붙이는 것보다 훨씬 읽기 쉬워 <b>C# 에서 가장 많이 쓰는 출력 방법</b>입니다. (변수는 다음 장에서 자세히 배웁니다. 여기서는 “값에 이름을 붙인 것” 정도로 이해하세요.)' },
          { type: 'code', title: '예제 1-5. 문자열 보간과 형식 지정', code: `using System;

class Program
{
    static void Main()
    {
        string name = "홍길동";
        int age = 20;
        double height = 175.456;

        Console.WriteLine("이름: " + name + ", 나이: " + age);     // + 로 연결 (옛 방식)
        Console.WriteLine($"이름: {name}, 나이: {age}");            // 문자열 보간
        Console.WriteLine($"내년 나이: {age + 1}");                 // 식도 가능
        Console.WriteLine($"키: {height:F1} cm");                   // 소수점 1자리
        Console.WriteLine($"키: {height:F0} cm");                   // 반올림해서 정수로
        Console.WriteLine($"금액: {1234567:N0} 원");                // 천 단위 쉼표
        Console.WriteLine($"비율: {0.256:P1}");                     // 백분율
        Console.WriteLine($"[{name,8}] [{age,-5}]");               // 자리 맞춤: 오른쪽 8칸, 왼쪽 5칸
    }
}`, expect: `이름: 홍길동, 나이: 20
이름: 홍길동, 나이: 20
내년 나이: 21
키: 175.5 cm
키: 175 cm
금액: 1,234,567 원
비율: 25.6%
[     홍길동] [20   ]`, desc: '<code>{값:형식}</code> 으로 표시 방법을 정합니다. <code>F1</code> 소수점 1자리, <code>N0</code> 천 단위 쉼표, <code>P1</code> 백분율. <code>{값,8}</code> 은 8칸 안에 오른쪽 정렬, 음수(<code>-5</code>)는 왼쪽 정렬입니다.' },
          { type: 'callout', kind: 'tip', title: '보간 문자열 안에서 중괄호 자체를 쓰려면', html: '<code>$"{{"</code> 처럼 두 번 씁니다: <code>Console.WriteLine($"{{{age}}}")</code> → <code>{20}</code>.' },
          { type: 'h', text: 'Console.ReadLine — 키보드 입력' },
          { type: 'p', html: '<code>Console.ReadLine()</code> 은 사용자가 <b>Enter 를 누를 때까지 기다렸다가</b> 입력한 한 줄을 <b>문자열(string)</b>로 돌려줍니다. 숫자로 계산하려면 <code>int.Parse</code> 나 <code>double.Parse</code> 로 바꿔야 합니다(2장에서 자세히).' },
          { type: 'code', title: '예제 1-6. 이름을 입력받아 인사하기', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("이름을 입력하세요: ");
        string name = Console.ReadLine();

        Console.Write("나이를 입력하세요: ");
        int age = int.Parse(Console.ReadLine());   // 문자열 → 정수

        Console.WriteLine($"안녕하세요, {name}님! 내년에는 {age + 1}살이 되시네요.");
    }
}`, stdin: '홍길동\n20\n', expect: `이름을 입력하세요: 나이를 입력하세요: 안녕하세요, 홍길동님! 내년에는 21살이 되시네요.`, desc: '실행하면 콘솔 아래 <b>입력칸</b>이 깜빡입니다. 값을 입력하고 Enter 를 누르세요. 입력한 값은 출력 결과에 함께 나타나지 않으므로 “입력하세요:” 뒤에 바로 다음 출력이 이어집니다. <code>Console.Write</code> 를 쓴 이유는 <b>같은 줄에서 입력을 받기 위해서</b>입니다.' },
          { type: 'callout', kind: 'warn', title: '입력에 글자를 넣으면?', html: '<code>int.Parse("스물")</code> 처럼 숫자가 아닌 글자를 정수로 바꾸려 하면 <b>FormatException</b> 예외가 발생해 프로그램이 멈춥니다. 안전하게 처리하는 <code>int.TryParse</code> 는 2장, 예외 처리는 10장에서 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Console 의 다른 기능', html: '<ul><li><code>Console.ReadKey()</code>: 키 하나를 읽습니다. “아무 키나 누르세요” 에 사용. (이 강좌의 웹 콘솔에서는 한 줄을 입력받아 첫 글자를 돌려줍니다)</li><li><code>Console.ForegroundColor = ConsoleColor.Red;</code> 글자색, <code>Console.ResetColor();</code> 원래대로</li><li><code>Console.Clear();</code> 화면 지우기, <code>Console.Beep();</code> 소리</li><li><code>Console.Title = "제목";</code> 창 제목 (웹 콘솔에서는 무시)</li></ul>' },
          { type: 'code', title: '추가 예제. 글자색 바꾸기', code: `using System;

class Program
{
    static void Main()
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("초록색 글자");
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("빨간색 글자");
        Console.ResetColor();
        Console.WriteLine("원래 색");
    }
}`, expect: `초록색 글자
빨간색 글자
원래 색`, desc: 'Visual Studio 의 콘솔 창과 이 강좌의 웹 콘솔 모두 색이 바뀝니다.' }
        ],
        practice: [
          {
            title: '실습 1-3. 영수증 출력',
            level: 1,
            desc: '<p>아래처럼 탭(<code>\\t</code>)으로 열을 맞춘 영수증을 출력하세요. 합계는 <b>계산식</b>으로 구하고 천 단위 쉼표(<code>N0</code>)를 붙입니다.</p><pre>=== 영수증 ===\n품목\t수량\t금액\n커피\t2\t9,000\n케이크\t1\t6,500\n합계\t\t15,500</pre>',
            hint: '<code>$"합계\\t\\t{9000 + 6500:N0}"</code>',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== 영수증 ===");
        // TODO: 품목 줄들과 합계 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== 영수증 ===");
        Console.WriteLine("품목\\t수량\\t금액");
        Console.WriteLine($"커피\\t2\\t{9000:N0}");
        Console.WriteLine($"케이크\\t1\\t{6500:N0}");
        Console.WriteLine($"합계\\t\\t{9000 + 6500:N0}");
    }
}
`,
            expect: `=== 영수증 ===
품목	수량	금액
커피	2	9,000
케이크	1	6,500
합계		15,500`
          },
          {
            title: '실습 1-4. 두 수 입력받아 더하기',
            level: 2,
            desc: '<p>두 정수를 차례로 입력받아 합을 출력하세요.</p><pre>첫 번째 수: 12\n두 번째 수: 30\n12 + 30 = 42</pre><p>(입력한 값은 콘솔 출력에는 나타나지 않습니다.)</p>',
            hint: '<code>int a = int.Parse(Console.ReadLine());</code> 를 두 번, 그리고 <code>$"{a} + {b} = {a + b}"</code>.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        // TODO: 입력받아 정수로 변환
        Console.Write("두 번째 수: ");
        // TODO
        // TODO: "a + b = 합" 출력
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
        Console.WriteLine($"{a} + {b} = {a + b}");
    }
}
`,
            stdin: '12\n30\n',
            expect: `첫 번째 수: 두 번째 수: 12 + 30 = 42`
          }
        ],
        quiz: [
          { q: '다음 코드의 출력 결과는?<pre><code>Console.Write("A");\nConsole.Write("B");\nConsole.WriteLine("C");\nConsole.WriteLine("D");</code></pre>', options: ['A\\nB\\nC\\nD', 'ABC\\nD', 'ABCD', 'AB\\nCD'], answer: 1, explain: '<code>Write</code> 는 줄을 바꾸지 않으므로 ABC 가 한 줄, 그 다음 D.' },
          { q: '<code>Console.WriteLine($"{3.14159:F2}");</code> 의 출력은?', options: ['3.14159', '3.14', '3.1', '3'], answer: 1, explain: '<code>F2</code> 는 소수점 아래 2자리로 반올림합니다.' },
          { q: '문자열 안에 큰따옴표를 넣으려면?', options: ['<code>"\\""</code>', '<code>"\'"</code>', '<code>"""</code>', '<code>"\\q"</code>'], answer: 0, explain: '백슬래시로 이스케이프: <code>\\"</code>. 축자 문자열에서는 <code>""</code>.' },
          { q: '<code>Console.ReadLine()</code> 이 돌려주는 값의 자료형은?', options: ['int', 'double', 'string', 'char'], answer: 2, explain: '항상 문자열입니다. 숫자가 필요하면 <code>int.Parse</code> 등으로 변환합니다.' },
          { q: '<code>Console.WriteLine($"[{"C#",5}]");</code> 의 출력은?', options: ['[C#   ]', '[   C#]', '[C#]', '[5C#]'], answer: 1, explain: '<code>,5</code> 는 5칸 안에 <b>오른쪽</b> 정렬. 왼쪽 정렬은 <code>,-5</code>.' }
        ],
        slides: [
          { layout: 'title', title: 'Console 입출력과 문자열 보간', subtitle: 'Chapter 01 · Section 02', badge: '01-2',
            notes: '<p><b>[도입 3분]</b> 지난 시간 복습: 프로그램 구조 4가지를 학생에게 묻기. 오늘은 “화면에 예쁘게 출력하고, 키보드로 입력받기”.</p>' },
          { layout: 'code', title: 'Write 와 WriteLine', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("가");
        Console.Write("나");
        Console.WriteLine("다");   // 여기서 줄 바꿈
        Console.WriteLine(3 + 4);  // 식의 결과 7
    }
}`, points: ['<code>Write</code>: 줄을 바꾸지 <b>않음</b>', '<code>WriteLine</code>: 출력 후 줄 바꿈', '숫자 · 계산식도 출력 가능'],
            notes: '<p><b>[5분]</p>실행 전 결과를 예측하게 합니다(“가나다” 한 줄 + 7). 그 다음 Write/WriteLine 을 바꿔 가며 실험.</p>' },
          { layout: 'table', title: '이스케이프 문자', head: ['표기', '의미', '예'], rows: [['<code>\\n</code>', '줄 바꿈', '<code>"1행\\n2행"</code>'], ['<code>\\t</code>', '탭 (열 맞추기)', '<code>"이름\\t나이"</code>'], ['<code>\\"</code>', '큰따옴표', '<code>"\\"안녕\\""</code>'], ['<code>\\\\</code>', '백슬래시', '<code>"C:\\\\Users"</code>'], ['<code>@"…"</code>', '축자 문자열(그대로)', '<code>@"C:\\Users"</code>']],
            lead: '백슬래시(\\)로 시작하는 특수 문자',
            notes: '<p><b>[5분]</b> 표를 읽고 예제 1-4 를 실행. 파일 경로에 백슬래시가 많을 때 축자 문자열이 편하다는 것을 강조.</p>' },
          { layout: 'code', title: '문자열 보간 $"…{식}…"', code: `using System;

class Program
{
    static void Main()
    {
        string name = "홍길동";
        int age = 20;
        double height = 175.456;
        Console.WriteLine("이름: " + name + ", 나이: " + age);
        Console.WriteLine($"이름: {name}, 나이: {age}");
        Console.WriteLine($"내년 나이: {age + 1}");
        Console.WriteLine($"키: {height:F1} cm");
        Console.WriteLine($"금액: {1234567:N0} 원");
        Console.WriteLine($"[{name,8}] [{age,-5}]");
    }
}`, points: ['<code>$"…"</code> 안의 <code>{ }</code> 에 변수 · 식', '<code>{값:F1}</code> 소수 1자리, <code>N0</code> 천 단위', '<code>{값,8}</code> 8칸 오른쪽 정렬'],
            notes: '<p><b>[8분]</b> + 연결 방식과 보간 방식을 비교. “어느 쪽이 읽기 쉬운가?” 형식 지정자 F, N, P 를 바꿔 가며 실행. 변수는 다음 장에서 자세히.</p>' },
          { layout: 'code', title: 'Console.ReadLine — 입력받기', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("이름을 입력하세요: ");
        string name = Console.ReadLine();
        Console.Write("나이를 입력하세요: ");
        int age = int.Parse(Console.ReadLine());
        Console.WriteLine($"안녕하세요, {name}님! 내년에는 {age + 1}살!");
    }
}`, stdin: '홍길동\n20\n', points: ['Enter 까지 한 줄을 <b>문자열</b>로 받음', '숫자로 쓰려면 <code>int.Parse</code>', '<code>Write</code> 로 같은 줄에서 입력'],
            notes: '<p><b>[8분]</b> 실행하면 콘솔 입력칸이 깜빡입니다. 학생 이름을 넣어 보게 하세요. 나이에 글자를 넣으면 어떻게 될지 시연(FormatException) → 10장 예고.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Console.WriteLine($"{3.14159:F2}");</code> 의 출력은?', options: ['3.14159', '3.14', '3.1', '3'], answer: 1, explain: 'F2 = 소수점 아래 2자리 반올림.',
            notes: '<p>F0, F3 도 물어보며 확장.</p>' },
          { layout: 'practice', title: '실습 1-4. 두 수 입력받아 더하기', desc: '<p>두 정수를 입력받아 <code>12 + 30 = 42</code> 형식으로 출력하세요.</p>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        // TODO
        Console.Write("두 번째 수: ");
        // TODO
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
        Console.WriteLine($"{a} + {b} = {a + b}");
    }
}`, stdin: '12\n30\n',
            notes: '<p><b>[8분]</b> 정답 실행 시 예시 입력(12, 30)이 자동으로 들어갑니다. 빨리 끝난 학생은 곱셈 · 평균까지 확장.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Write</code> 줄 안 바꿈 · <code>WriteLine</code> 줄 바꿈', '<code>\\n \\t \\" \\\\</code> 이스케이프, <code>@"…"</code> 축자', '<code>$"{식}"</code> 보간, <code>{값:F2}</code> <code>{값:N0}</code> <code>{값,8}</code>', '<code>ReadLine()</code> 은 문자열 → <code>int.Parse</code> 로 숫자'],
            notes: '<p>다음 시간: 변수와 자료형 — 값을 이름에 담아 두는 법.</p>' }
        ]
      }
    ]
  });
})();
