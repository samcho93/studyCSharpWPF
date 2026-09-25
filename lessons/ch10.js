/* Chapter 10. 문자열 · 예외 처리 · 파일 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_IMMUT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="문자열은 불변 — 메서드는 새 문자열을 돌려준다">
  <defs><marker id="ah10a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  <marker id="ah10b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  <text x="640" y="48" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">string 은 불변(immutable) — 메서드는 원본을 고치지 않고 <tspan fill="var(--ok)">새 문자열</tspan>을 돌려준다</text>
  <rect x="60" y="150" width="150" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="135" y="140" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">s (string)</text>
  <text x="135" y="200" text-anchor="middle" style="font-size:22px;fill:var(--muted)">참조(주소)</text>
  <line x1="215" y1="190" x2="330" y2="190" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah10a)"/>
  <rect x="340" y="140" width="260" height="100" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="470" y="200" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">"hello"</text>
  <text x="470" y="270" text-anchor="middle" style="font-size:20px;fill:var(--muted)">원본 — 절대 바뀌지 않는다</text>
  <line x1="470" y1="290" x2="470" y2="370" stroke="var(--ok)" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#ah10b)"/>
  <text x="600" y="335" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">.ToUpper()</text>
  <rect x="340" y="380" width="260" height="100" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="470" y="440" text-anchor="middle" style="${MONO};font-size:40px;fill:var(--fg)">"HELLO"</text>
  <text x="470" y="515" text-anchor="middle" style="font-size:20px;fill:var(--muted)">새로 만들어진 문자열 (반환값)</text>
  <g style="font-size:22px;fill:var(--fg)">
    <text x="680" y="150"><tspan style="${MONO}" fill="var(--accent)">s.ToUpper();</tspan></text>
    <text x="680" y="180" style="fill:var(--muted)">→ "HELLO" 가 만들어지지만 아무도 받지 않아 버려진다</text>
    <text x="680" y="240"><tspan style="${MONO}" fill="var(--accent)">string u = s.ToUpper();</tspan></text>
    <text x="680" y="270" style="fill:var(--muted)">→ u 가 "HELLO" 를 가리킨다. s 는 여전히 "hello"</text>
    <text x="680" y="330"><tspan style="${MONO}" fill="var(--accent)">s = s.ToUpper();</tspan></text>
    <text x="680" y="360" style="fill:var(--muted)">→ s 의 화살표를 "HELLO" 로 옮긴다 ("바뀐 것처럼" 보임)</text>
    <text x="680" y="420"><tspan style="${MONO}" fill="var(--danger)">s[0] = 'H';</tspan> <tspan fill="var(--danger)">✗ 컴파일 오류</tspan></text>
    <text x="680" y="450" style="fill:var(--muted)">→ 글자 하나도 못 바꾼다. 바꾸려면 char[] 나 StringBuilder</text>
    <text x="680" y="510" style="fill:var(--warn)">반복문에서 += 로 계속 이어 붙이면 매번 새 문자열 → StringBuilder</text>
  </g>
</svg>`;

  const SVG_TRY = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="try catch finally 의 실행 흐름">
  <defs><marker id="ah10c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker>
  <marker id="ah10d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
  <marker id="ah10e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  <rect x="60" y="120" width="300" height="200" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="210" y="160" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent)">try { … }</text>
  <text x="210" y="205" text-anchor="middle" style="font-size:21px;fill:var(--fg)">위험할 수 있는 코드</text>
  <text x="210" y="240" text-anchor="middle" style="font-size:20px;fill:var(--muted)">int.Parse, 나눗셈,</text>
  <text x="210" y="270" text-anchor="middle" style="font-size:20px;fill:var(--muted)">배열 접근, 파일 읽기 …</text>
  <text x="210" y="300" text-anchor="middle" style="font-size:20px;fill:var(--danger)">예외가 나면 그 줄에서 멈추고 탈출</text>
  <line x1="365" y1="180" x2="470" y2="130" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah10e)"/>
  <text x="430" y="130" text-anchor="middle" style="font-size:20px;fill:var(--ok)">정상</text>
  <line x1="365" y1="260" x2="470" y2="330" stroke="var(--danger)" stroke-width="4" marker-end="url(#ah10d)"/>
  <text x="440" y="320" text-anchor="middle" style="font-size:20px;fill:var(--danger)">예외 발생!</text>
  <rect x="480" y="280" width="320" height="180" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="640" y="320" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--danger)">catch (XxxException ex)</text>
  <text x="640" y="360" text-anchor="middle" style="font-size:21px;fill:var(--fg)">형식이 맞는 catch 하나만 실행</text>
  <text x="640" y="392" text-anchor="middle" style="font-size:20px;fill:var(--muted)">위에서 아래로 검사 → 첫 번째로 맞는 것</text>
  <text x="640" y="424" text-anchor="middle" style="font-size:20px;fill:var(--muted)">ex.Message 로 원인 확인</text>
  <text x="640" y="452" text-anchor="middle" style="font-size:20px;fill:var(--muted)">맞는 catch 가 없으면 → 프로그램 중단</text>
  <line x1="640" y1="275" x2="640" y2="215" stroke="var(--muted)" stroke-width="4" marker-end="url(#ah10c)"/>
  <line x1="470" y1="120" x2="640" y2="120" stroke="var(--ok)" stroke-width="4"/>
  <line x1="640" y1="120" x2="640" y2="140" stroke="var(--ok)" stroke-width="4"/>
  <line x1="640" y1="140" x2="810" y2="140" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah10e)"/>
  <rect x="820" y="80" width="400" height="130" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="1020" y="125" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--warn)">finally { … }</text>
  <text x="1020" y="165" text-anchor="middle" style="font-size:21px;fill:var(--fg)">예외가 나든 안 나든 항상 실행</text>
  <text x="1020" y="195" text-anchor="middle" style="font-size:20px;fill:var(--muted)">파일 닫기 · 뒷정리 (생략 가능)</text>
  <line x1="810" y1="370" x2="1020" y2="370" stroke="var(--muted)" stroke-width="4"/>
  <line x1="1020" y1="370" x2="1020" y2="225" stroke="var(--muted)" stroke-width="4" marker-end="url(#ah10c)"/>
  <line x1="1020" y1="220" x2="1020" y2="220" stroke="var(--muted)"/>
  <text x="920" y="360" text-anchor="middle" style="font-size:20px;fill:var(--muted)">처리 후 →</text>
  <rect x="820" y="420" width="400" height="90" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1020" y="475" text-anchor="middle" style="font-size:24px;fill:var(--fg)">다음 문장 계속 실행 (프로그램 안 죽음)</text>
  <line x1="1160" y1="215" x2="1160" y2="410" stroke="var(--muted)" stroke-width="4" marker-end="url(#ah10c)"/>
  <text x="200" y="420" style="font-size:22px;fill:var(--fg);font-weight:700">순서</text>
  <text x="200" y="455" style="font-size:21px;fill:var(--muted)">정상: try 끝까지 → finally → 다음 문장</text>
  <text x="200" y="490" style="font-size:21px;fill:var(--muted)">예외: try 중간에 멈춤 → catch → finally → 다음 문장</text>
</svg>`;

  const SVG_EXC = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="자주 만나는 예외 클래스의 계층">
  <rect x="490" y="30" width="300" height="80" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="80" text-anchor="middle" style="${MONO};font-size:30px;font-weight:700;fill:var(--accent)">Exception</text>
  <text x="640" y="135" text-anchor="middle" style="font-size:20px;fill:var(--muted)">모든 예외의 조상 — Message · StackTrace 속성. catch (Exception) 은 무엇이든 잡는다</text>
  <g stroke="var(--line)" stroke-width="3">
    <line x1="640" y1="110" x2="640" y2="150"/>
    <line x1="110" y1="150" x2="1170" y2="150"/>
    <line x1="110" y1="150" x2="110" y2="190"/><line x1="322" y1="150" x2="322" y2="190"/><line x1="534" y1="150" x2="534" y2="190"/>
    <line x1="746" y1="150" x2="746" y2="190"/><line x1="958" y1="150" x2="958" y2="190"/><line x1="1170" y1="150" x2="1170" y2="190"/>
    <line x1="322" y1="290" x2="322" y2="330"/><line x1="958" y1="290" x2="958" y2="330"/><line x1="1170" y1="290" x2="1170" y2="330"/>
    <line x1="230" y1="330" x2="414" y2="330"/><line x1="230" y1="330" x2="230" y2="350"/><line x1="414" y1="330" x2="414" y2="350"/>
  </g>
  <g style="${MONO};font-size:19px;fill:var(--fg)">
    <rect x="10" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="110" y="232" text-anchor="middle" font-weight="700">Format</text><text x="110" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="222" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="322" y="232" text-anchor="middle" font-weight="700">Arithmetic</text><text x="322" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="434" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="534" y="232" text-anchor="middle" font-weight="700">IndexOutOfRange</text><text x="534" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="646" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="746" y="232" text-anchor="middle" font-weight="700">NullReference</text><text x="746" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="858" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="958" y="232" text-anchor="middle" font-weight="700">Argument</text><text x="958" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="1070" y="190" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1170" y="232" text-anchor="middle" font-weight="700">IO</text><text x="1170" y="262" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="130" y="350" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="230" y="392" text-anchor="middle" font-weight="700">DivideByZero</text><text x="230" y="422" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="334" y="350" width="180" height="100" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="424" y="392" text-anchor="middle" font-weight="700">Overflow</text><text x="424" y="422" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="858" y="350" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="958" y="392" text-anchor="middle" font-weight="700">ArgumentNull</text><text x="958" y="422" text-anchor="middle" style="fill:var(--muted)">Exception</text>
    <rect x="1070" y="350" width="200" height="100" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1170" y="392" text-anchor="middle" font-weight="700">FileNotFound</text><text x="1170" y="422" text-anchor="middle" style="fill:var(--muted)">Exception</text>
  </g>
  <g style="font-size:18px;fill:var(--muted)">
    <text x="110" y="318" text-anchor="middle">int.Parse("abc")</text>
    <text x="534" y="318" text-anchor="middle">arr[10] (길이 3)</text>
    <text x="746" y="318" text-anchor="middle">null 인 참조 사용</text>
    <text x="958" y="318" text-anchor="middle">잘못된 인수 (직접 throw)</text>
    <text x="230" y="478" text-anchor="middle">10 / 0</text>
    <text x="424" y="478" text-anchor="middle">checked 범위 초과</text>
    <text x="1170" y="478" text-anchor="middle">없는 파일 읽기</text>
  </g>
  <text x="640" y="535" text-anchor="middle" style="font-size:23px;fill:var(--fg)">catch 는 <tspan font-weight="700" fill="var(--danger)">구체적인(자식) 예외를 먼저</tspan>, <tspan font-weight="700" fill="var(--accent)">Exception 을 맨 마지막</tspan>에 — 반대로 쓰면 컴파일 오류 CS0160</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch10',
    no: '10',
    title: '문자열 · 예외 처리 · 파일',
    subtitle: 'Strings, Exceptions & Files',
    summary: '문자열을 찾고 · 자르고 · 바꾸고 · 나누는 string 메서드와 형식 지정, StringBuilder 를 익힙니다. 실행 중 오류(예외)를 try/catch/finally 로 안전하게 처리하고 직접 던지는 방법, 그리고 File · StreamWriter/StreamReader 로 텍스트 파일을 읽고 쓰는 방법을 배웁니다.',
    goals: [
      '문자열이 불변임을 이해하고 Length · 인덱서 · Substring · IndexOf · Replace · Split · Join 등을 사용할 수 있다',
      'PadLeft/PadRight 와 형식 지정({값,폭:형식})으로 출력을 표처럼 정렬할 수 있다',
      '문자열 비교 방법의 차이를 알고 StringBuilder 와 char 메서드를 활용할 수 있다',
      'try · catch · finally 로 예외를 처리하고, 예외 클래스 계층에 맞게 catch 순서를 정할 수 있다',
      'throw 로 예외를 던지고 간단한 사용자 정의 예외를 만들 수 있다',
      'File 클래스와 StreamWriter/StreamReader(using 문)로 텍스트 파일을 쓰고 읽을 수 있다'
    ],
    sections: [
      /* ===================== ch10-1 ===================== */
      {
        id: 'ch10-1',
        title: '문자열 다루기',
        minutes: 50,
        goals: [
          '문자열이 불변(immutable)이라는 것과 그 의미를 설명할 수 있다',
          'IndexOf · Substring · Contains · Replace · Trim · Split · Join 으로 문자열을 가공할 수 있다',
          'PadLeft/PadRight 와 형식 지정자로 표 형태의 출력을 만들 수 있다',
          '문자열 비교 · StringBuilder · char 메서드 · 문자 배열을 활용할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['불변성 · 길이 · 인덱서', 8], ['찾기 · 바꾸기 · 나누기', 15], ['형식 · 비교 · StringBuilder · char', 12], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '문자열(string)은 바꿀 수 없다 — 불변(immutable)' },
          { type: 'p', html: '2장에서 <code>string</code> 은 글자들의 나열이고 <code>Length</code> 와 <code>[인덱스]</code> 로 글자를 꺼낼 수 있다고 배웠습니다. 문자열에는 중요한 규칙이 하나 있습니다. <b>한 번 만들어진 문자열은 절대 바뀌지 않습니다.</b> <code>ToUpper()</code>, <code>Replace()</code> 같은 메서드는 원본을 고치는 것이 아니라 <b>결과를 담은 새 문자열을 돌려줍니다</b>. 그래서 결과를 변수에 받지 않으면 아무 일도 일어나지 않은 것처럼 보입니다.' },
          { type: 'figure', html: SVG_IMMUT, caption: '문자열 메서드는 원본을 두고 새 문자열을 만든다 — 결과를 변수에 받아야 한다' },
          { type: 'code', title: '예제 10-1. 불변성 확인 · Length · 인덱서', code: `using System;

class Program
{
    static void Main()
    {
        string s = "hello";
        s.ToUpper();                          // 새 문자열이 만들어지지만 받지 않아 버려진다
        Console.WriteLine(s);                 // hello (그대로)

        string upper = s.ToUpper();           // 결과를 다른 변수에 받는다
        Console.WriteLine(upper);             // HELLO
        Console.WriteLine(s);                 // 원본은 여전히 hello

        s = s.ToUpper();                      // 같은 변수에 다시 넣으면 "바뀐 것처럼" 보인다
        Console.WriteLine(s);                 // HELLO

        string name = "C# Programming";
        Console.WriteLine(name.Length);       // 글자 수 (공백 포함)
        Console.WriteLine(name[0]);           // 첫 글자 (char)
        Console.WriteLine(name[name.Length - 1]);   // 마지막 글자
        // name[0] = 'c';   // 오류 CS0200: 문자열의 글자는 바꿀 수 없다

        foreach (char c in "abc")             // 문자열은 char 의 나열 — foreach 가능
            Console.Write(c + "-");
        Console.WriteLine();
    }
}`, expect: `hello
HELLO
hello
HELLO
14
C
g
a-b-c-`, desc: '<code>7행</code> 처럼 반환값을 버리면 원본은 그대로입니다. 문자열을 “바꾸는” 코드는 언제나 <code>s = s.메서드();</code> 형태입니다. 인덱스는 0부터 시작하고 마지막 글자는 <code>Length - 1</code> 입니다. 범위를 넘는 인덱스는 <b>IndexOutOfRangeException</b>(다음 교시)을 일으킵니다.' },
          { type: 'h', text: '찾기와 자르기 — IndexOf · Contains · Substring' },
          { type: 'table', head: ['메서드', '의미', '예 (<code>s = "student@school.ac.kr"</code>)'], rows: [
            ['<code>s.IndexOf("x")</code>', '처음 나오는 위치(인덱스). 없으면 <b>-1</b>', '<code>s.IndexOf(\'@\')</code> → 7'],
            ['<code>s.LastIndexOf("x")</code>', '마지막으로 나오는 위치', '<code>s.LastIndexOf(\'.\')</code> → 17'],
            ['<code>s.Contains("x")</code>', '포함하는가? (bool)', '<code>s.Contains("school")</code> → True'],
            ['<code>s.StartsWith("x")</code> / <code>EndsWith</code>', '~로 시작 / 끝나는가?', '<code>s.EndsWith(".kr")</code> → True'],
            ['<code>s.Substring(시작)</code>', '시작 인덱스부터 끝까지 잘라 새 문자열', '<code>s.Substring(8)</code> → school.ac.kr'],
            ['<code>s.Substring(시작, 길이)</code>', '시작 인덱스부터 <b>길이</b>만큼', '<code>s.Substring(0, 7)</code> → student'],
            ['<code>s.Length</code>', '글자 수 (속성 — 괄호 없음)', '20']
          ], caption: '두 번째 인수는 “끝 인덱스”가 아니라 “길이”입니다' },
          { type: 'code', title: '예제 10-2. 이메일 주소에서 아이디와 도메인 뽑아내기', code: `using System;

class Program
{
    static void Main()
    {
        string email = "student@school.ac.kr";

        int at = email.IndexOf('@');                   // 7
        Console.WriteLine($"@ 위치: {at}");
        Console.WriteLine($"아이디: {email.Substring(0, at)}");     // 0부터 at 글자
        Console.WriteLine($"도메인: {email.Substring(at + 1)}");    // at+1 부터 끝까지

        int dot = email.LastIndexOf('.');              // 마지막 점
        Console.WriteLine($"최상위 도메인: {email.Substring(dot + 1)}");

        Console.WriteLine(email.Contains("school"));   // True
        Console.WriteLine(email.StartsWith("student")); // True
        Console.WriteLine(email.EndsWith(".com"));      // False
        Console.WriteLine(email.IndexOf("xyz"));        // 없으면 -1

        string keyword = "ac";
        int pos = email.IndexOf(keyword);
        if (pos >= 0)
            Console.WriteLine($"'{keyword}' 는 {pos}번 인덱스에 있습니다");
        else
            Console.WriteLine($"'{keyword}' 없음");
    }
}`, expect: `@ 위치: 7
아이디: student
도메인: school.ac.kr
최상위 도메인: kr
True
True
False
-1
'ac' 는 15번 인덱스에 있습니다`, desc: '<b>“찾은 위치를 기준으로 자른다”</b>가 문자열 처리의 기본 패턴입니다. <code>IndexOf</code> 결과가 -1 인지 먼저 확인하는 습관을 들이세요. <code>Substring(0, at)</code> 은 인덱스 0부터 <b>at 개</b>의 글자 — 즉 <code>@</code> 바로 앞까지입니다.' },
          { type: 'h', text: '바꾸기 — ToUpper · ToLower · Trim · Replace' },
          { type: 'code', title: '예제 10-3. 공백 제거 · 대소문자 · 치환', code: `using System;

class Program
{
    static void Main()
    {
        string input = "  Hello, World!  ";       // 앞뒤에 공백이 있는 입력
        Console.WriteLine($"[{input}]");
        Console.WriteLine($"[{input.Trim()}]");        // 양쪽 공백 제거
        Console.WriteLine($"[{input.TrimStart()}]");   // 앞쪽만
        Console.WriteLine($"[{input.TrimEnd()}]");     // 뒤쪽만

        string s = input.Trim();
        Console.WriteLine(s.ToUpper());
        Console.WriteLine(s.ToLower());
        Console.WriteLine(s.Replace("World", "C#"));   // 부분 문자열 치환
        Console.WriteLine(s.Replace('l', 'L'));        // 문자 치환 (모두)

        string phone = "010-1234-5678";
        string digits = phone.Replace("-", "");        // 하이픈 제거 = 빈 문자열로 치환
        Console.WriteLine($"{digits} ({digits.Length}자리)");

        // 메서드 체이닝: 반환값이 문자열이므로 계속 이어 쓸 수 있다
        Console.WriteLine("  C# is FUN  ".Trim().ToLower().Replace(" ", "_"));

        Console.WriteLine(string.IsNullOrEmpty(""));          // 비었나?
        Console.WriteLine(string.IsNullOrWhiteSpace("   "));  // 공백뿐인가?
    }
}`, expect: `[  Hello, World!  ]
[Hello, World!]
[Hello, World!  ]
[  Hello, World!]
HELLO, WORLD!
hello, world!
Hello, C#!
HeLLo, WorLd!
01012345678 (11자리)
c#_is_fun
True
True`, desc: '사용자 입력은 앞뒤에 공백이 섞이기 쉬우므로 <code>Trim()</code> 을 습관처럼 붙입니다. <code>Replace(찾을것, "")</code> 은 “지우기”로 쓰입니다. 메서드가 문자열을 돌려주므로 <code>.Trim().ToLower().Replace(…)</code> 처럼 <b>체이닝</b>할 수 있습니다. <code>string.IsNullOrWhiteSpace</code> 는 입력이 비었는지 검사할 때 가장 안전한 방법입니다.' },
          { type: 'h', text: '나누기와 합치기 — Split · string.Join' },
          { type: 'p', html: '<code>Split(구분자)</code> 는 문자열을 구분자로 잘라 <b>문자열 배열</b>로 돌려주고, <code>string.Join(구분자, 배열)</code> 은 반대로 배열을 구분자로 이어 <b>하나의 문자열</b>로 만듭니다. CSV 파일, 공백으로 구분된 입력, 로그 한 줄 처리 등에 항상 등장하는 짝입니다.' },
          { type: 'code', title: '예제 10-4. 쉼표 · 공백으로 나누고 다시 합치기', code: `using System;

class Program
{
    static void Main()
    {
        string csv = "사과,바나나,포도,딸기";
        string[] fruits = csv.Split(',');
        Console.WriteLine($"항목 수: {fruits.Length}");
        foreach (string f in fruits)
            Console.WriteLine($"- {f}");
        Console.WriteLine(string.Join(" | ", fruits));      // 배열 → 문자열

        string sentence = "the quick  brown fox";            // quick 뒤에 공백 2개
        string[] w1 = sentence.Split(' ');
        Console.WriteLine(w1.Length);                        // 5 — 빈 문자열이 하나 낀다
        string[] w2 = sentence.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        Console.WriteLine(w2.Length);                        // 4 — 빈 항목 제거

        string record = "홍길동 90 85 77";                   // 이름 뒤에 점수들
        string[] parts = record.Split(' ');
        int sum = 0;
        for (int i = 1; i < parts.Length; i++)               // 0번은 이름이므로 1번부터
            sum += int.Parse(parts[i]);
        Console.WriteLine($"{parts[0]} 합계 {sum}, 평균 {(double)sum / (parts.Length - 1):F1}");

        int[] nums = { 1, 2, 3 };
        Console.WriteLine(string.Join(", ", nums));          // 숫자 배열도 가능
    }
}`, expect: `항목 수: 4
- 사과
- 바나나
- 포도
- 딸기
사과 | 바나나 | 포도 | 딸기
5
4
홍길동 합계 252, 평균 84.0
1, 2, 3`, desc: '<code>Split</code> 결과는 모두 <b>문자열</b>이므로 숫자로 쓰려면 <code>int.Parse</code> 가 필요합니다. 구분자가 연달아 있으면 빈 문자열 항목이 생기는데, <code>StringSplitOptions.RemoveEmptyEntries</code> 로 없앨 수 있습니다. 7장의 <code>string.Join</code> 은 배열을 한 줄로 출력할 때 가장 편한 방법이었죠.' },
          { type: 'h', text: '형식 맞추기 — PadLeft · PadRight · 형식 지정자' },
          { type: 'p', html: '콘솔에 표를 예쁘게 출력하려면 <b>칸 수(폭)</b>를 맞춰야 합니다. <code>PadLeft(폭)</code> 는 왼쪽을 공백으로 채워 <b>오른쪽 정렬</b>, <code>PadRight(폭)</code> 는 오른쪽을 채워 <b>왼쪽 정렬</b>합니다. 보간 문자열의 <code>{값,폭:형식}</code> 과 <code>string.Format</code> 도 같은 일을 합니다. 1장에서 본 형식 지정자를 정리해 봅시다.' },
          { type: 'table', head: ['형식', '의미', '예', '결과'], rows: [
            ['<code>{값,10}</code>', '10칸에 <b>오른쪽</b> 정렬', '<code>$"[{"abc",6}]"</code>', '<code>[   abc]</code>'],
            ['<code>{값,-10}</code>', '10칸에 <b>왼쪽</b> 정렬', '<code>$"[{"abc",-6}]"</code>', '<code>[abc   ]</code>'],
            ['<code>:N0</code> <code>:N2</code>', '천 단위 쉼표 (소수 자리 수)', '<code>$"{1234567:N0}"</code>', '<code>1,234,567</code>'],
            ['<code>:F2</code>', '소수점 아래 2자리 (반올림)', '<code>$"{3.14159:F2}"</code>', '<code>3.14</code>'],
            ['<code>:D3</code>', '정수를 최소 3자리로, 앞을 0으로 채움', '<code>$"{7:D3}"</code>', '<code>007</code>'],
            ['<code>:P1</code>', '백분율 (×100, % 붙임)', '<code>$"{0.756:P1}"</code>', '<code>75.6%</code>'],
            ['<code>:X</code>', '16진수', '<code>$"{255:X}"</code>', '<code>FF</code>'],
            ['<code>{값,8:N0}</code>', '폭과 형식을 함께', '<code>$"{16700,8:N0}"</code>', '<code>  16,700</code>'],
            ['<code>s.PadLeft(5, \'0\')</code>', '채울 문자 지정', '<code>"42".PadLeft(5, \'0\')</code>', '<code>00042</code>']
          ], caption: '쉼표 뒤는 폭(음수면 왼쪽 정렬), 콜론 뒤는 형식 — ToString("N0") 처럼 ToString 의 인수로도 쓸 수 있다' },
          { type: 'code', title: '예제 10-5. 상품 목록을 표처럼 정렬해 출력하기', code: `using System;

class Program
{
    static void Main()
    {
        string[] items = { "Apple", "Banana", "Kiwi" };
        int[] prices = { 1200, 3500, 800 };
        int[] qty = { 3, 1, 12 };

        // ① PadRight(왼쪽 정렬) · PadLeft(오른쪽 정렬) 로 열 맞추기
        Console.WriteLine("Item".PadRight(8) + "Price".PadLeft(8) + "Qty".PadLeft(5));
        Console.WriteLine(new string('-', 21));           // 같은 문자 21개
        int total = 0;
        for (int i = 0; i < items.Length; i++)
        {
            total += prices[i] * qty[i];
            Console.WriteLine(items[i].PadRight(8)
                + prices[i].ToString("N0").PadLeft(8)
                + qty[i].ToString().PadLeft(5));
        }

        // ② 보간 문자열의 {값,폭:형식} — 같은 결과를 더 짧게
        Console.WriteLine($"{"Total",-8}{total,8:N0}");

        // ③ string.Format — {번호,폭:형식}. 보간 문자열이 나오기 전의 방식
        Console.WriteLine(string.Format("{0,-8}{1,8:N0}", "Total", total));

        // ④ 여러 가지 형식 지정자
        Console.WriteLine($"{7:D3} | {5:D2}:{3:D2} | {0.756:P1} | {255:X} | {3.14159:F2}");
        Console.WriteLine("42".PadLeft(5, '0'));
    }
}`, expect: `Item       Price  Qty
---------------------
Apple      1,200    3
Banana     3,500    1
Kiwi         800   12
Total     16,700
Total     16,700
007 | 05:03 | 75.6% | FF | 3.14
00042`, desc: '<code>new string(\'-\', 21)</code> 은 같은 문자를 반복한 문자열을 만듭니다. <code>string.Format("{0} {1}", a, b)</code> 의 <code>{0}</code> <code>{1}</code> 은 뒤에 오는 인수의 <b>번호</b>이며, 형식 규칙은 보간 문자열과 똑같습니다. 옛 코드와 <code>Console.WriteLine("{0}", x)</code> 형태에서 자주 만납니다.' },
          { type: 'callout', kind: 'tip', title: '한글은 두 칸을 차지합니다', html: '<code>PadRight</code> 는 <b>글자 수</b>로 채우지만, 콘솔에서 한글 한 글자는 영문 두 글자 폭으로 그려집니다. 그래서 <code>"사과".PadRight(6)</code> 과 <code>"Apple".PadRight(6)</code> 은 화면에서 줄이 맞지 않습니다. 한글 표는 탭(<code>\\t</code>)을 쓰거나 폭을 넉넉히 잡고 감안해야 합니다. (WPF 에서는 표 컨트롤이 정렬을 대신해 주므로 이 고민이 사라집니다.)' },
          { type: 'h', text: '문자열 비교' },
          { type: 'p', html: '문자열은 <code>==</code> 로 <b>내용</b>을 비교합니다(참조 형식이지만 예외적으로 내용 비교). 다만 <b>대소문자를 구분</b>하므로 <code>"apple" == "Apple"</code> 은 <code>false</code> 입니다. 대소문자를 무시하려면 <code>Equals(…, StringComparison.OrdinalIgnoreCase)</code> 를 쓰고, 정렬 순서를 알려면 <code>string.Compare</code> 를 씁니다.' },
          { type: 'code', title: '예제 10-6. == · Equals · Compare · 대소문자 무시', code: `using System;

class Program
{
    static void Main()
    {
        string a = "apple", b = "Apple";
        Console.WriteLine(a == b);                                          // False (대소문자 구분)
        Console.WriteLine(a.Equals(b));                                     // False
        Console.WriteLine(a.Equals(b, StringComparison.OrdinalIgnoreCase)); // True (대소문자 무시)
        Console.WriteLine(a.ToLower() == b.ToLower());                      // True (같은 효과)

        // Compare: 앞이 작으면 음수, 같으면 0, 뒤가 작으면 양수 (사전 순)
        Console.WriteLine(string.Compare("abc", "abd"));    // -1
        Console.WriteLine(string.Compare("banana", "apple"));   // 1
        Console.WriteLine(string.Compare("same", "same"));  // 0
        Console.WriteLine("apple".CompareTo("banana") < 0 ? "apple 이 앞" : "banana 가 앞");

        // 사용자 입력 검사의 전형적인 형태
        string answer = "  YES ";
        if (answer.Trim().Equals("yes", StringComparison.OrdinalIgnoreCase))
            Console.WriteLine("긍정 답변으로 인식");

        string s1 = "hi";
        string s2 = "h" + "i";
        Console.WriteLine(s1 == s2);                       // True — 내용이 같으면 같다
        Console.WriteLine(object.ReferenceEquals(s1, s2)); // 같은 객체인가? (관심 없어도 됨)
    }
}`, expect: `False
False
True
True
-1
1
0
apple 이 앞
긍정 답변으로 인식
True
True`, desc: '입력값 비교는 <code>Trim()</code> 으로 공백을 없애고 <code>OrdinalIgnoreCase</code> 로 대소문자를 무시하는 것이 기본 패턴입니다. <code>string.Compare</code> 는 정렬(사전 순)에 쓰이며 <code>Array.Sort</code> · <code>List.Sort</code> 가 내부에서 사용하는 방식입니다. 마지막 줄은 컴파일러가 <code>"h" + "i"</code> 를 미리 <code>"hi"</code> 로 합쳐 같은 객체를 쓰기 때문에 True 이지만, 문자열은 <b>항상 <code>==</code> 로 내용을 비교</b>하면 됩니다.' },
          { type: 'h', text: 'StringBuilder — 문자열을 많이 이어 붙일 때' },
          { type: 'p', html: '문자열은 불변이므로 <code>s += "x"</code> 를 할 때마다 <b>새 문자열이 통째로 복사</b>됩니다. 반복문에서 수천 번 이어 붙이면 느려지고 메모리도 낭비됩니다. <code>System.Text.StringBuilder</code> 는 <b>안에서 글자를 직접 늘리고 고칠 수 있는 버퍼</b>로, 다 만든 뒤 <code>ToString()</code> 으로 문자열을 꺼냅니다.' },
          { type: 'code', title: '추가 예제. StringBuilder 로 문자열 조립하기', code: `using System;
using System.Text;

class Program
{
    static void Main()
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++)
        {
            sb.Append(i);            // 숫자도 그대로 추가
            sb.Append(", ");
        }
        Console.WriteLine(sb.Length);          // 15 글자 (아직 문자열 아님)
        sb.Length -= 2;                        // 마지막 ", " 잘라 내기 (길이를 줄이면 뒤가 사라짐)
        Console.WriteLine(sb.ToString());      // 1, 2, 3, 4, 5

        sb.Insert(0, "[");                     // 앞에 끼워 넣기
        sb.Append("]");                        // 뒤에 붙이기
        Console.WriteLine(sb);                 // Console.WriteLine 이 ToString 을 호출
        sb.Replace(", ", "-");                 // 안에서 직접 치환 (새 객체 안 만듦)
        Console.WriteLine(sb);
        sb.Clear();                            // 비우기
        Console.WriteLine(sb.Length);

        // 여러 줄 텍스트 만들기: AppendLine
        StringBuilder report = new StringBuilder();
        report.AppendLine("=== 보고서 ===");
        report.Append("점수: ").Append(95).AppendLine("점");   // 체이닝 가능
        report.AppendLine("끝");
        Console.Write(report.ToString());
    }
}`, expect: `15
1, 2, 3, 4, 5
[1, 2, 3, 4, 5]
[1-2-3-4-5]
0
=== 보고서 ===
점수: 95점
끝`, desc: '<code>Append</code> 는 <code>StringBuilder</code> 자신을 돌려주므로 <code>.Append(…).AppendLine(…)</code> 처럼 이어 쓸 수 있습니다. 서너 번 이어 붙이는 정도는 <code>+</code> 나 보간 문자열이 더 읽기 쉽습니다. <b>반복문 안에서 누적</b>할 때 StringBuilder 를 떠올리세요.' },
          { type: 'h', text: 'char 메서드와 문자 배열' },
          { type: 'p', html: '문자열의 글자 하나하나는 <code>char</code> 입니다. <code>char.IsDigit</code> · <code>IsLetter</code> · <code>IsWhiteSpace</code> · <code>IsUpper</code> · <code>ToUpper</code> 같은 <b>정적 메서드</b>로 글자의 종류를 검사하거나 바꿉니다. 글자를 정말로 바꾸고 싶으면 <code>ToCharArray()</code> 로 <b>문자 배열</b>을 만들어 고친 뒤 <code>new string(배열)</code> 로 다시 문자열을 만듭니다.' },
          { type: 'code', title: '추가 예제. 글자 종류 세기 · 뒤집기 · 첫 글자 대문자', code: `using System;

class Program
{
    static void Main()
    {
        string text = "Hello World 2024!";
        int letters = 0, digits = 0, spaces = 0, others = 0;
        foreach (char c in text)
        {
            if (char.IsLetter(c)) letters++;
            else if (char.IsDigit(c)) digits++;
            else if (char.IsWhiteSpace(c)) spaces++;
            else others++;
        }
        Console.WriteLine($"글자 {letters}, 숫자 {digits}, 공백 {spaces}, 기타 {others}");

        Console.WriteLine(char.ToUpper('a'));     // A
        Console.WriteLine(char.IsUpper('A'));     // True
        Console.WriteLine((int)'0');              // 48 — 문자 '0' 의 코드
        Console.WriteLine('7' - '0');             // 7  — 숫자 문자 → 숫자 값

        // 문자열 → 문자 배열 → 고치기 → 문자열
        char[] chars = "abcde".ToCharArray();
        Array.Reverse(chars);                     // 배열을 뒤집는다 (7장)
        Console.WriteLine(new string(chars));     // edcba
        chars[0] = 'X';                           // 배열은 바꿀 수 있다
        Console.WriteLine(new string(chars));     // Xdcba

        string word = "korea";
        string capital = char.ToUpper(word[0]) + word.Substring(1);   // 첫 글자만 대문자
        Console.WriteLine(capital);
    }
}`, expect: `글자 10, 숫자 4, 공백 2, 기타 1
A
True
48
7
edcba
Xdcba
Korea`, desc: '<code>\'7\' - \'0\'</code> 은 문자 코드의 차이(55 - 48)로 숫자 7 을 얻는 고전적인 방법입니다. <code>char.ToUpper(word[0]) + word.Substring(1)</code> 에서 <b>char + string</b> 은 문자열이 됩니다. 문자열 뒤집기(<code>ToCharArray</code> → <code>Array.Reverse</code> → <code>new string</code>)는 실습 10-1 회문 판별의 핵심입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 그 밖의 유용한 문자열 기능', html: '<ul><li><code>s.Insert(2, "-")</code> 2번 인덱스에 끼워 넣기, <code>s.Remove(2, 3)</code> 2번부터 3글자 지우기</li><li><code>string.Concat(a, b, c)</code> 여러 개 연결, <code>string.IsNullOrEmpty(s)</code> 빈 문자열 검사</li><li><code>s[^1]</code> 끝에서 첫 글자, <code>s[1..4]</code> 범위(인덱스 1~3) — C# 8 의 인덱스 · 범위 문법</li><li><code>@"C:\\temp"</code> 축자 문자열, <code>"""…"""</code> 원시(raw) 문자열 리터럴(C# 11) — 여러 줄과 따옴표를 그대로 씀</li><li>문자열 메서드들은 대부분 <code>StringComparison</code> 을 받는 오버로드가 있어 대소문자 · 문화권 규칙을 지정할 수 있습니다</li></ul>' }
        ],
        practice: [
          {
            title: '실습 10-1. 회문(palindrome) 판별',
            level: 1,
            desc: '<p>단어를 입력받아 앞에서 읽어도 뒤에서 읽어도 같은 <b>회문</b>인지 판별하세요. 대소문자는 무시합니다(<code>Level</code> 도 회문).</p><pre>단어 입력: Level\n\'Level\' 은(는) 회문입니다.</pre><p>회문이 아니면 <code>\'hello\' 은(는) 회문이 아닙니다.</code> 를 출력합니다.</p>',
            hint: '<code>ToLower()</code> 로 통일 → <code>ToCharArray()</code> → <code>Array.Reverse</code> → <code>new string(…)</code> 으로 뒤집은 문자열과 <code>==</code> 비교.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string word = Console.ReadLine();
        // TODO: 소문자로 통일한 문자열과 그것을 뒤집은 문자열을 만든다

        // TODO: 두 문자열이 같으면 회문
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string word = Console.ReadLine();
        string lower = word.ToLower();

        char[] chars = lower.ToCharArray();
        Array.Reverse(chars);
        string reversed = new string(chars);

        if (lower == reversed)
            Console.WriteLine($"'{word}' 은(는) 회문입니다.");
        else
            Console.WriteLine($"'{word}' 은(는) 회문이 아닙니다.");
    }
}
`,
            stdin: 'Level\n',
            expect: `단어 입력: 'Level' 은(는) 회문입니다.`
          },
          {
            title: '실습 10-2. 문장의 단어 수와 가장 긴 단어',
            level: 2,
            desc: '<p>문장을 한 줄 입력받아 <b>단어 수</b>와 <b>가장 긴 단어</b>(길이가 같으면 먼저 나온 것)를 출력하세요. 단어는 공백으로 구분되며, 공백이 여러 개 이어질 수 있습니다.</p><pre>문장 입력: the quick brown fox jumps over the lazy dog\n단어 수: 9\n가장 긴 단어: quick (5글자)</pre>',
            hint: '<code>Split(\' \', StringSplitOptions.RemoveEmptyEntries)</code> 로 나눈 뒤, <code>foreach</code> 로 돌며 <code>Length</code> 가 지금까지의 최댓값보다 <b>클 때만</b> 갱신합니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("문장 입력: ");
        string sentence = Console.ReadLine();
        // TODO: 공백으로 나누기 (빈 항목 제거)

        // TODO: 단어 수 출력, 가장 긴 단어 찾아 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("문장 입력: ");
        string sentence = Console.ReadLine();
        string[] words = sentence.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        Console.WriteLine($"단어 수: {words.Length}");

        string longest = "";
        foreach (string w in words)
        {
            if (w.Length > longest.Length)
                longest = w;
        }
        Console.WriteLine($"가장 긴 단어: {longest} ({longest.Length}글자)");
    }
}
`,
            stdin: 'the quick brown fox jumps over the lazy dog\n',
            expect: `문장 입력: 단어 수: 9
가장 긴 단어: quick (5글자)`
          }
        ],
        quiz: [
          { q: '다음 코드의 출력 결과는?<pre><code>string s = "abc";\ns.ToUpper();\nConsole.WriteLine(s);</code></pre>', options: ['ABC', 'abc', 'Abc', '컴파일 오류'], answer: 1, explain: '문자열은 불변입니다. <code>ToUpper()</code> 는 새 문자열을 돌려줄 뿐 <code>s</code> 를 바꾸지 않습니다. <code>s = s.ToUpper();</code> 로 받아야 합니다.' },
          { q: '<code>"Hello".Substring(1, 3)</code> 의 결과는?', options: ['ell', 'Hel', 'ello', 'el'], answer: 0, explain: '인덱스 1(e)부터 <b>3글자</b>: e, l, l. 두 번째 인수는 끝 인덱스가 아니라 길이입니다.' },
          { q: '<code>"a,b,,c".Split(\',\').Length</code> 의 값은?', options: ['3', '4', '2', '오류'], answer: 1, explain: '쉼표 3개로 나누면 항목 4개: "a", "b", "" (빈 문자열), "c". 빈 항목을 빼려면 <code>StringSplitOptions.RemoveEmptyEntries</code>.' },
          { q: '<code>a</code> 와 <code>b</code> 를 <b>대소문자를 무시</b>하고 같은지 비교하는 방법은?', options: ['<code>a == b</code>', '<code>a.Equals(b)</code>', '<code>a.Equals(b, StringComparison.OrdinalIgnoreCase)</code>', '<code>a.Length == b.Length</code>'], answer: 2, explain: '<code>==</code> 와 <code>Equals(b)</code> 는 대소문자를 구분합니다. <code>ToLower()</code> 로 통일해 비교해도 됩니다.' },
          { q: '반복문 안에서 문자열을 수천 번 이어 붙일 때 가장 알맞은 도구는?', options: ['<code>string +=</code>', '<code>string.Concat</code>', '<code>Substring</code>', '<code>StringBuilder</code>'], answer: 3, explain: '문자열은 불변이라 <code>+=</code> 마다 새 문자열이 복사됩니다. <code>StringBuilder.Append</code> 는 버퍼 안에서 늘려 효율적입니다.' }
        ],
        slides: [
          { layout: 'title', title: '문자열 다루기', subtitle: 'Chapter 10 · Section 01 — string 메서드 · 형식 · StringBuilder', badge: '10-1',
            notes: '<p><b>[도입 3분]</b> “회원 가입 화면에서 이메일이 올바른지 어떻게 검사할까?” “주소에서 도시 이름만 뽑으려면?” — 실무 코드의 절반은 문자열 처리라는 점으로 시작합니다.</p><p>오늘 목표: 불변성, 찾기 · 자르기 · 바꾸기 · 나누기, 표 정렬, 비교, StringBuilder, char.</p>' },
          { layout: 'diagram', title: '문자열은 불변(immutable)', html: SVG_IMMUT, caption: '메서드는 원본을 두고 새 문자열을 돌려준다 → 결과를 변수에 받아야 한다',
            notes: '<p><b>[5분]</b> 그림 왼쪽부터: s 는 "hello" 를 가리킨다. ToUpper() 는 새 "HELLO" 를 만든다. 발문: “<code>s.ToUpper();</code> 만 쓰고 s 를 출력하면?” → hello. 대부분 학생이 틀리는 지점이므로 실행으로 확인.</p><p>“문자열을 바꾸는 코드는 항상 <code>s = s.메서드()</code>” 를 칠판에 크게.</p>' },
          { layout: 'code', title: '예제 10-1. 불변성 · Length · 인덱서', code: `using System;

class Program
{
    static void Main()
    {
        string s = "hello";
        s.ToUpper();                     // 결과를 버림
        Console.WriteLine(s);            // hello
        s = s.ToUpper();                 // 다시 넣어야 바뀐다
        Console.WriteLine(s);            // HELLO
        Console.WriteLine(s.Length);     // 5
        Console.WriteLine(s[0]);         // H
        Console.WriteLine(s[s.Length - 1]);   // O
        // s[0] = 'h';   // 오류 CS0200
    }
}`, points: ['반환값을 안 받으면 아무 일도 없다', '<code>Length</code> 는 속성(괄호 ✗), 인덱스는 0부터', '마지막 글자 = <code>[Length - 1]</code>', '글자 하나도 못 바꾼다 (CS0200)'],
            notes: '<p><b>[4분]</b> 실행 전에 첫 출력을 예측하게 합니다. 주석 처리된 <code>s[0] = \'h\'</code> 의 주석을 풀어 CS0200 을 보여 주세요. <code>s[5]</code> 를 시도하면 IndexOutOfRangeException — 다음 교시 예고.</p>' },
          { layout: 'code', title: '예제 10-2. 찾기와 자르기 — IndexOf · Substring', code: `using System;

class Program
{
    static void Main()
    {
        string email = "student@school.ac.kr";
        int at = email.IndexOf('@');                 // 7
        Console.WriteLine(email.Substring(0, at));   // student
        Console.WriteLine(email.Substring(at + 1));  // school.ac.kr
        int dot = email.LastIndexOf('.');
        Console.WriteLine(email.Substring(dot + 1)); // kr
        Console.WriteLine(email.Contains("school")); // True
        Console.WriteLine(email.EndsWith(".com"));   // False
        Console.WriteLine(email.IndexOf("xyz"));     // -1
    }
}`, points: ['<code>IndexOf</code>: 위치, 없으면 <b>-1</b>', '<code>Substring(시작, 길이)</code> — 끝 인덱스 아님', '<code>LastIndexOf</code> 로 마지막 점 찾기', '<code>Contains</code> · <code>StartsWith</code> · <code>EndsWith</code> → bool'],
            notes: '<p><b>[6분]</b> 칠판에 email 의 각 글자 위에 인덱스를 적어 가며 7, 17 을 확인. “찾은 위치를 기준으로 자른다” 패턴을 강조. 발문: “Substring(0, 7) 의 7 은 인덱스일까 길이일까?”</p>' },
          { layout: 'code', title: '예제 10-3 · 10-4. 바꾸기 · 나누기 · 합치기', code: `using System;

class Program
{
    static void Main()
    {
        string input = "  Hello, World!  ";
        string s = input.Trim();                       // 앞뒤 공백 제거
        Console.WriteLine(s.ToUpper());
        Console.WriteLine(s.Replace("World", "C#"));
        Console.WriteLine("010-1234-5678".Replace("-", ""));

        string[] fruits = "사과,바나나,포도".Split(',');
        Console.WriteLine(fruits.Length);              // 3
        Console.WriteLine(string.Join(" | ", fruits));

        string[] parts = "홍길동 90 85 77".Split(' ');
        int sum = 0;
        for (int i = 1; i < parts.Length; i++)
            sum += int.Parse(parts[i]);
        Console.WriteLine($"{parts[0]} 합계 {sum}");
    }
}`, points: ['<code>Trim</code> · <code>ToUpper</code> · <code>Replace</code> — 체이닝 가능', '<code>Replace(x, "")</code> = 지우기', '<code>Split</code> → 문자열 배열, <code>Join</code> → 문자열', 'Split 결과는 문자열 → <code>int.Parse</code>'],
            notes: '<p><b>[6분]</b> Split/Join 을 “가위와 풀”로 비유. 본문 예제 10-4 의 연속 공백(<code>RemoveEmptyEntries</code>)도 실행해 보여 주세요. CSV 파일 한 줄이 곧 이 형태라는 점을 다음 교시 파일 입출력과 연결.</p>' },
          { layout: 'table', title: '형식 지정자 정리', head: ['형식', '의미', '예 → 결과'], rows: [['<code>{값,10}</code> / <code>{값,-10}</code>', '10칸 오른쪽 / 왼쪽 정렬', '<code>{"abc",6}</code> → <code>[   abc]</code>'], ['<code>:N0</code>', '천 단위 쉼표', '<code>{1234567:N0}</code> → 1,234,567'], ['<code>:F2</code>', '소수 2자리', '<code>{3.14159:F2}</code> → 3.14'], ['<code>:D3</code>', '최소 3자리, 0 채움', '<code>{7:D3}</code> → 007'], ['<code>:P1</code>', '백분율', '<code>{0.756:P1}</code> → 75.6%'], ['<code>PadLeft(n)</code> / <code>PadRight(n)</code>', 'n 칸 오른쪽 / 왼쪽 정렬', '<code>"42".PadLeft(5, \'0\')</code> → 00042']],
            lead: '쉼표 뒤는 폭(음수 = 왼쪽 정렬), 콜론 뒤는 형식',
            notes: '<p><b>[4분]</b> 1장에서 본 것의 정리. 시계 표시 <code>{5:D2}:{3:D2}</code> → 05:03 같은 활용 예를 물어보세요. <code>ToString("N0")</code> 도 같은 형식 문자열임을 언급.</p>' },
          { layout: 'code', title: '예제 10-5. 표처럼 정렬하기', code: `using System;

class Program
{
    static void Main()
    {
        string[] items = { "Apple", "Banana", "Kiwi" };
        int[] prices = { 1200, 3500, 800 };
        int[] qty = { 3, 1, 12 };
        Console.WriteLine("Item".PadRight(8) + "Price".PadLeft(8) + "Qty".PadLeft(5));
        Console.WriteLine(new string('-', 21));
        int total = 0;
        for (int i = 0; i < items.Length; i++)
        {
            total += prices[i] * qty[i];
            Console.WriteLine($"{items[i],-8}{prices[i],8:N0}{qty[i],5}");
        }
        Console.WriteLine($"{"Total",-8}{total,8:N0}");
        Console.WriteLine(string.Format("{0,-8}{1,8:N0}", "Total", total));
    }
}`, points: ['<code>PadRight</code> 왼쪽 정렬 · <code>PadLeft</code> 오른쪽 정렬', '보간 <code>{값,-8}</code> <code>{값,8:N0}</code> 도 같은 결과', '<code>string.Format("{0} {1}")</code>: 번호 = 인수 순서', '<code>new string(\'-\', 21)</code> 반복 문자열'],
            notes: '<p><b>[5분]</b> 세 가지 방법(Pad, 보간, Format)이 같은 줄을 만든다는 것을 보여 줍니다. 한글 상품명으로 바꿔 실행해 줄이 어긋나는 것을 보여 주고 “한글은 두 칸” 을 설명.</p>' },
          { layout: 'two', title: '비교 · StringBuilder', left: { title: '비교 — 대소문자 주의', code: `string a = "apple", b = "Apple";
a == b                       // False
a.Equals(b, StringComparison
          .OrdinalIgnoreCase) // True
string.Compare("abc", "abd") // -1
answer.Trim().Equals("yes",
   StringComparison.OrdinalIgnoreCase)`, run: false }, right: { title: 'StringBuilder — 반복 누적', code: `var sb = new StringBuilder();
for (int i = 1; i <= 5; i++)
    sb.Append(i).Append(", ");
sb.Length -= 2;     // 끝의 ", " 제거
sb.Insert(0, "[").Append("]");
sb.Replace(", ", "-");
string result = sb.ToString();`, run: false },
            notes: '<p><b>[5분]</b> 왼쪽: 입력 검사는 Trim + OrdinalIgnoreCase 가 기본 패턴. 오른쪽: “<code>s += x</code> 를 만 번 하면 문자열 만 개가 만들어진다” → StringBuilder. <code>using System.Text;</code> 필요. 본문 추가 예제를 실행해 보여 주세요.</p>' },
          { layout: 'code', title: 'char 메서드 · 문자 배열 · 뒤집기', code: `using System;

class Program
{
    static void Main()
    {
        string text = "Hello 2024!";
        int letters = 0, digits = 0;
        foreach (char c in text)
        {
            if (char.IsLetter(c)) letters++;
            else if (char.IsDigit(c)) digits++;
        }
        Console.WriteLine($"글자 {letters}, 숫자 {digits}");
        Console.WriteLine('7' - '0');              // 7

        char[] chars = "abcde".ToCharArray();
        Array.Reverse(chars);
        Console.WriteLine(new string(chars));      // edcba
        string word = "korea";
        Console.WriteLine(char.ToUpper(word[0]) + word.Substring(1));
    }
}`, points: ['<code>char.IsLetter</code> · <code>IsDigit</code> · <code>IsWhiteSpace</code> · <code>ToUpper</code>', "<code>'7' - '0'</code> = 7 (문자 코드 차이)", '문자열 → <code>ToCharArray()</code> → 고치기 → <code>new string()</code>', '뒤집기 = 회문 실습의 핵심'],
            notes: '<p><b>[4분]</b> ToCharArray → Array.Reverse → new string 세 단계를 손으로 짚어 줍니다. 곧 실습 10-1 에서 그대로 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력 결과는?<pre><code>string s = "abc";\ns.ToUpper();\nConsole.WriteLine(s);</code></pre>', options: ['ABC', 'abc', 'Abc', '컴파일 오류'], answer: 1, explain: '문자열은 불변 — ToUpper() 는 새 문자열을 돌려줄 뿐입니다.',
            notes: '<p>이어서 “<code>"Hello".Substring(1, 3)</code> 은?” “<code>"a,b,,c".Split(\',\').Length</code> 는?” 을 구두로.</p>' },
          { layout: 'practice', title: '실습 10-1. 회문(palindrome) 판별', desc: '<p>단어를 입력받아 앞뒤로 읽어도 같은 회문인지 판별하세요. 대소문자는 무시합니다.</p><pre>단어 입력: Level\n\'Level\' 은(는) 회문입니다.</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string word = Console.ReadLine();
        // TODO: 소문자로 통일 → 뒤집기 → 비교
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("단어 입력: ");
        string word = Console.ReadLine();
        string lower = word.ToLower();
        char[] chars = lower.ToCharArray();
        Array.Reverse(chars);
        string reversed = new string(chars);
        if (lower == reversed)
            Console.WriteLine($"'{word}' 은(는) 회문입니다.");
        else
            Console.WriteLine($"'{word}' 은(는) 회문이 아닙니다.");
    }
}`, stdin: 'Level\n',
            notes: '<p><b>[8분]</b> Level, racecar, hello 로 확인. 빨리 끝난 학생은 공백을 무시하는 버전(<code>Replace(" ", "")</code>: “A man a plan a canal Panama”)이나 실습 10-2(단어 수 · 가장 긴 단어)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['string 은 <b>불변</b> — 메서드는 새 문자열을 돌려준다: <code>s = s.Trim();</code>', '<code>IndexOf</code>(없으면 -1) · <code>Substring(시작, 길이)</code> · <code>Contains</code> · <code>Replace</code> · <code>Trim</code>', '<code>Split</code> → 배열, <code>string.Join</code> → 문자열', '<code>{값,폭:형식}</code> · <code>PadLeft/PadRight</code> · <code>string.Format</code>', '비교는 <code>==</code>, 대소문자 무시는 <code>OrdinalIgnoreCase</code>', '반복 누적은 <code>StringBuilder</code>, 글자 검사는 <code>char.IsDigit</code> 등'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 프로그램이 멈추는 순간 — 예외 처리와 파일 입출력.</p>' }
        ]
      },

      /* ===================== ch10-2 ===================== */
      {
        id: 'ch10-2',
        title: '예외 처리와 파일 입출력',
        minutes: 50,
        goals: [
          '예외가 무엇이고 처리하지 않으면 어떻게 되는지 설명할 수 있다',
          'try · catch · finally 의 실행 순서를 설명하고 여러 catch 를 알맞은 순서로 쓸 수 있다',
          'throw 로 예외를 던지고 간단한 사용자 정의 예외 클래스를 만들 수 있다',
          'File 클래스와 StreamWriter · StreamReader(using 문)로 텍스트 파일을 쓰고 읽을 수 있다'
        ],
        flow: [['도입: 프로그램이 멈추는 순간', 5], ['try · catch · finally', 12], ['예외 계층 · throw · 사용자 정의 예외', 10], ['파일 쓰기 · 읽기', 15], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '예외(exception)란?' },
          { type: 'p', html: '컴파일은 잘 되었는데 <b>실행 중에</b> 문제가 생길 수 있습니다. 사용자가 숫자 대신 글자를 입력하거나, 0 으로 나누거나, 없는 파일을 열려고 하는 경우입니다. 이런 <b>실행 중 오류</b>를 .NET 은 <b>예외(exception)</b> 라는 객체로 만들어 던집니다(throw). 아무도 받지(catch) 않으면 프로그램은 그 자리에서 <b>오류 메시지를 내고 멈춥니다</b>.' },
          { type: 'code', title: '예제 10-7. 처리하지 않은 예외 — 프로그램이 멈춘다', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("프로그램 시작");
        string input = "abc";
        int n = int.Parse(input);          // 숫자가 아니므로 FormatException 발생!
        Console.WriteLine($"제곱: {n * n}");   // 이 줄은 실행되지 않는다
        Console.WriteLine("프로그램 끝");       // 이 줄도
    }
}`, expectError: true, nondeterministic: true, desc: '실행하면 “프로그램 시작” 뒤에 <code>처리되지 않은 예외(Unhandled exception). System.FormatException: The input string \'abc\' was not in a correct format.</code> 와 <b>스택 추적(stack trace)</b>(어느 메서드 몇 행에서 났는지)이 출력되고 프로그램이 종료됩니다. “프로그램 끝”은 나오지 않습니다. 예외 메시지는 .NET 이 영어로 만들어 줍니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 예외가 나면', html: 'F5(디버그) 로 실행 중 예외가 나면 그 줄에서 멈추고 <b>예외 도우미(Exception Helper)</b> 창이 예외 종류와 메시지를 보여 줍니다. 마우스를 변수 위에 올려 값을 확인하고, ■ 중지 후 코드를 고치세요. 출력 창의 <b>스택 추적</b>에서 <code>Program.Main() 줄 9</code> 처럼 위치를 읽는 연습을 해 두면 오류를 빨리 찾습니다.' },
          { type: 'h', text: 'try · catch · finally' },
          { type: 'p', html: '위험할 수 있는 코드를 <code>try</code> 블록에 넣고, 예외가 나면 실행할 코드를 <code>catch</code> 블록에 씁니다. <code>finally</code> 블록은 예외가 나든 안 나든 <b>항상</b> 실행되며 파일 닫기 같은 뒷정리에 씁니다(생략 가능). 예외가 나면 try 블록의 <b>나머지 줄은 건너뛰고</b> 곧바로 catch 로 갑니다.' },
          { type: 'figure', html: SVG_TRY, caption: '정상이면 try → finally, 예외가 나면 try 중간에서 catch → finally. 어느 쪽이든 프로그램은 계속된다' },
          { type: 'code', title: '예제 10-8. try / catch / finally 로 안전하게 입력받기', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("숫자 입력: ");
        string input = Console.ReadLine();

        try
        {
            int n = int.Parse(input);                   // 여기서 예외가 날 수 있다
            Console.WriteLine($"입력한 수의 제곱: {n * n}");   // 예외가 나면 건너뜀
        }
        catch (FormatException ex)                       // FormatException 이 나면 이 블록 실행
        {
            Console.WriteLine("숫자가 아닙니다!");
            Console.WriteLine($"메시지: {ex.Message}");   // 예외 객체가 들고 있는 설명
        }
        finally                                          // 예외가 나든 안 나든 실행
        {
            Console.WriteLine("finally: 항상 실행됩니다");
        }

        Console.WriteLine("프로그램은 계속됩니다");        // 멈추지 않는다
    }
}`, stdin: 'abc\n', expect: `숫자 입력: 숫자가 아닙니다!
메시지: The input string 'abc' was not in a correct format.
finally: 항상 실행됩니다
프로그램은 계속됩니다`, desc: '<code>catch (FormatException ex)</code> 의 <code>ex</code> 는 던져진 <b>예외 객체</b>이고, <code>ex.Message</code> 에 원인 설명이 들어 있습니다. 예시 입력을 <code>12</code> 로 바꿔 실행하면 “제곱: 144” 와 finally 줄이 출력되고 catch 는 건너뜁니다. 2장의 <code>int.TryParse</code> 는 이 상황을 예외 없이 처리하는 더 가벼운 방법이었습니다 — <b>예측 가능한 입력 오류는 TryParse, 그 밖의 예외는 try/catch</b> 가 좋은 습관입니다.' },
          { type: 'h', text: '예외 클래스의 계층과 여러 catch' },
          { type: 'p', html: '예외는 종류마다 클래스가 있고 모두 <code>Exception</code> 클래스를 <b>상속</b>합니다(9장). 그래서 <code>catch (Exception ex)</code> 는 <b>어떤 예외든</b> 잡습니다. catch 를 여러 개 쓰면 <b>위에서부터 처음 맞는 하나만</b> 실행되므로, <b>구체적인(자식) 예외를 먼저</b> 쓰고 <code>Exception</code> 은 맨 마지막에 둡니다. 순서를 거꾸로 쓰면 컴파일 오류(CS0160)가 납니다.' },
          { type: 'figure', html: SVG_EXC, caption: '자주 만나는 예외 클래스 — 모두 Exception 의 자손' },
          { type: 'table', head: ['예외', '언제', 'Message 예'], rows: [
            ['<code>FormatException</code>', '<code>int.Parse("abc")</code> — 형식이 맞지 않는 문자열 변환', 'The input string \'abc\' was not in a correct format.'],
            ['<code>DivideByZeroException</code>', '정수를 0 으로 나눔', 'Attempted to divide by zero.'],
            ['<code>IndexOutOfRangeException</code>', '배열 · 문자열의 범위 밖 인덱스', 'Index was outside the bounds of the array.'],
            ['<code>NullReferenceException</code>', '<code>null</code> 인 변수의 멤버 사용', 'Object reference not set to an instance of an object.'],
            ['<code>ArgumentException</code>', '메서드에 잘못된 인수 (주로 직접 throw)', '(직접 쓴 메시지)'],
            ['<code>OverflowException</code>', '<code>checked</code> 계산의 범위 초과', 'Arithmetic operation resulted in an overflow.'],
            ['<code>FileNotFoundException</code>', '없는 파일 읽기', 'Could not find file \'…\'.'],
            ['<code>Exception</code>', '위 모든 것의 부모 — 무엇이든 잡음', '—']
          ], caption: '실무에서는 catch (Exception) 으로 뭉뚱그리기보다 예상되는 예외를 구체적으로 잡는 것이 좋습니다' },
          { type: 'code', title: '예제 10-9. 여러 catch — 구체적인 것부터', code: `using System;

class Program
{
    static void Try(int which)
    {
        int[] arr = { 1, 2, 3 };
        string[] names = new string[2];        // 값을 안 넣었으므로 요소는 null
        try
        {
            if (which == 1) Console.WriteLine(int.Parse("12a"));
            if (which == 2) Console.WriteLine(10 / (which - 2));
            if (which == 3) Console.WriteLine(arr[5]);
            if (which == 4) Console.WriteLine(names[0].Length);
            Console.WriteLine("정상 종료");
        }
        catch (FormatException ex)             // ① 형식
        {
            Console.WriteLine($"① 형식 오류: {ex.Message}");
        }
        catch (DivideByZeroException ex)       // ② 0 나눗셈
        {
            Console.WriteLine($"② 나눗셈 오류: {ex.Message}");
        }
        catch (IndexOutOfRangeException ex)    // ③ 인덱스
        {
            Console.WriteLine($"③ 인덱스 오류: {ex.Message}");
        }
        catch (Exception ex)                   // ④ 나머지 전부 — 반드시 마지막에
        {
            Console.WriteLine($"④ 기타 ({ex.GetType().Name}): {ex.Message}");
        }
    }

    static void Main()
    {
        for (int i = 0; i <= 4; i++)
        {
            Console.Write($"case {i}: ");
            Try(i);
        }
        Console.WriteLine("모든 경우를 처리하고 정상 종료");
    }
}`, expect: `case 0: 정상 종료
case 1: ① 형식 오류: The input string '12a' was not in a correct format.
case 2: ② 나눗셈 오류: Attempted to divide by zero.
case 3: ③ 인덱스 오류: Index was outside the bounds of the array.
case 4: ④ 기타 (NullReferenceException): Object reference not set to an instance of an object.
모든 경우를 처리하고 정상 종료`, desc: '한 try 에 catch 를 여러 개 두면 예외 종류에 따라 <b>하나만</b> 골라 실행됩니다. <code>ex.GetType().Name</code> 으로 예외 클래스 이름을 알 수 있습니다. <code>catch (Exception ex)</code> 를 맨 위로 옮겨 보세요 — 컴파일 오류 CS0160 “이전 catch 절이 이미 이 형식이나 상위 형식의 모든 예외를 catch 합니다” 가 납니다.' },
          { type: 'h', text: 'throw — 직접 예외 던지기 · 사용자 정의 예외' },
          { type: 'p', html: '내가 만든 메서드도 <b>잘못된 값이 들어오면</b> 예외를 던질 수 있습니다. <code>throw new ArgumentException("설명");</code> 처럼 예외 객체를 만들어 <code>throw</code> 하면, 그 메서드를 호출한 쪽의 catch 로 전달됩니다. 상황에 딱 맞는 예외가 없으면 <code>Exception</code> 을 상속한 <b>나만의 예외 클래스</b>를 만들 수 있습니다 — 생성자에서 메시지를 <code>base(message)</code> 로 넘겨 주기만 하면 됩니다.' },
          { type: 'code', title: '예제 10-10. ArgumentException 던지기와 사용자 정의 예외', code: `using System;

// Exception 을 상속한 나만의 예외 — 생성자에서 메시지를 부모에게 넘긴다
class AgeException : Exception
{
    public AgeException(string message) : base(message) { }
}

class Program
{
    static string Grade(int score)
    {
        if (score < 0 || score > 100)
            throw new ArgumentException($"점수는 0~100 사이여야 합니다: {score}");
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        return "C";
    }

    static void CheckAge(int age)
    {
        if (age < 0 || age > 150)
            throw new AgeException($"나이가 이상합니다: {age}");
        Console.WriteLine($"나이 {age} 확인");
    }

    static void Main()
    {
        int[] scores = { 95, 150, 82 };
        foreach (int s in scores)
        {
            try
            {
                Console.WriteLine($"{s}점 → {Grade(s)}");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"오류: {ex.Message}");
            }
        }

        try
        {
            CheckAge(20);
            CheckAge(-5);          // 여기서 예외 → 아래 CheckAge(30) 은 실행되지 않음
            CheckAge(30);
        }
        catch (AgeException ex)
        {
            Console.WriteLine($"AgeException: {ex.Message}");
        }
    }
}`, expect: `95점 → A
오류: 점수는 0~100 사이여야 합니다: 150
82점 → B
나이 20 확인
AgeException: 나이가 이상합니다: -5`, desc: '예외는 메서드 호출을 <b>거슬러 올라가며</b> 자기를 받아 줄 catch 를 찾습니다(<code>Grade</code> 안에서 던진 예외를 <code>Main</code> 의 catch 가 받음). <code>CheckAge(-5)</code> 에서 예외가 나면 같은 try 안의 <code>CheckAge(30)</code> 은 건너뜁니다. 잘못된 값을 조용히 넘기지 말고 <b>일찍, 분명하게</b> 예외를 던지는 것이 버그를 줄이는 길입니다.' },
          { type: 'code', title: '추가 예제. checked 로 오버플로 잡기', code: `using System;

class Program
{
    static void Main()
    {
        int big = int.MaxValue;
        Console.WriteLine(big + 1);            // 기본: 조용히 넘쳐 음수가 된다 (2장)

        try
        {
            int r = checked(big + 1);          // checked: 범위를 넘으면 예외
            Console.WriteLine(r);
        }
        catch (OverflowException ex)
        {
            Console.WriteLine($"OverflowException: {ex.Message}");
        }

        checked                                // 블록 전체에 적용할 수도 있다
        {
            long safe = (long)big + 1;         // long 으로 계산하면 넘치지 않는다
            Console.WriteLine(safe);
        }
    }
}`, expect: `-2147483648
OverflowException: Arithmetic operation resulted in an overflow.
2147483648`, desc: '2장에서 본 오버플로는 기본 설정에서 감지되지 않습니다. 돈 계산처럼 값이 깨지면 안 되는 곳은 <code>checked</code> 로 감싸 <code>OverflowException</code> 을 받거나, 처음부터 <code>long</code> · <code>decimal</code> 을 쓰세요.' },
          { type: 'h', text: '파일 쓰기와 읽기 — File 클래스' },
          { type: 'p', html: '프로그램이 끝나면 변수의 값은 모두 사라집니다. 데이터를 남기려면 <b>파일</b>에 써야 합니다. <code>System.IO</code> 네임스페이스의 <code>File</code> 클래스는 텍스트 파일을 <b>한 줄의 코드</b>로 읽고 쓰는 정적 메서드를 제공합니다. 파일 이름만 쓰면(<code>"memo.txt"</code>) <b>프로그램이 실행되는 폴더</b>에 만들어집니다.' },
          { type: 'table', head: ['메서드', '하는 일'], rows: [
            ['<code>File.WriteAllText(경로, 문자열)</code>', '문자열을 파일에 씀 (있으면 <b>덮어씀</b>)'],
            ['<code>File.ReadAllText(경로)</code>', '파일 전체를 <b>문자열 하나</b>로 읽음'],
            ['<code>File.WriteAllLines(경로, 문자열 배열/리스트)</code>', '항목마다 한 줄씩 씀'],
            ['<code>File.ReadAllLines(경로)</code>', '파일을 <b>줄 단위 문자열 배열</b>로 읽음'],
            ['<code>File.AppendAllText(경로, 문자열)</code>', '파일 <b>끝에 덧붙임</b> (없으면 새로 만듦) — 로그에 적합'],
            ['<code>File.Exists(경로)</code>', '파일이 있는가? (bool) — 읽기 전에 확인'],
            ['<code>File.Delete(경로)</code>', '파일 삭제 (없어도 오류 없음)'],
            ['<code>Directory.CreateDirectory(경로)</code>', '폴더 만들기 (<code>Directory.Exists</code>, <code>GetFiles</code> 도 있음)']
          ], caption: 'using System.IO; 가 필요합니다' },
          { type: 'code', title: '예제 10-11. 메모 파일 쓰기 · 읽기 · 덧붙이기', code: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        // ① 쓰기: 문자열 하나를 통째로 (\\n 으로 줄 구분)
        File.WriteAllText("memo.txt", "첫 번째 메모\\n두 번째 메모\\n");
        Console.WriteLine($"memo.txt 존재? {File.Exists("memo.txt")}");

        // ② 읽기: 파일 전체를 문자열 하나로
        string content = File.ReadAllText("memo.txt");
        Console.Write(content);                       // 이미 줄 바꿈이 들어 있으므로 Write

        // ③ 덧붙이기: 기존 내용 뒤에 추가
        File.AppendAllText("memo.txt", "세 번째 메모(추가)\\n");

        // ④ 줄 단위로 읽기: string[]
        string[] lines = File.ReadAllLines("memo.txt");
        Console.WriteLine($"줄 수: {lines.Length}");
        for (int i = 0; i < lines.Length; i++)
            Console.WriteLine($"{i + 1}: {lines[i]}");

        // ⑤ 배열을 한 줄씩 쓰기 · 다시 읽기
        string[] fruits = { "사과", "바나나", "포도" };
        File.WriteAllLines("fruits.txt", fruits);
        Console.WriteLine(string.Join(", ", File.ReadAllLines("fruits.txt")));

        File.Delete("fruits.txt");
        Console.WriteLine($"삭제 후 존재? {File.Exists("fruits.txt")}");
        Console.WriteLine($"없는 파일 존재? {File.Exists("nothing.txt")}");
    }
}`, expect: `memo.txt 존재? True
첫 번째 메모
두 번째 메모
줄 수: 3
1: 첫 번째 메모
2: 두 번째 메모
3: 세 번째 메모(추가)
사과, 바나나, 포도
삭제 후 존재? False
없는 파일 존재? False`, desc: '<code>WriteAllText</code> 는 <b>덮어쓰기</b>, <code>AppendAllText</code> 는 <b>덧붙이기</b>입니다. 줄 단위 데이터(할 일 목록, 점수표)는 <code>WriteAllLines</code> / <code>ReadAllLines</code> 짝이 편리하며, <code>List&lt;string&gt;</code> 도 그대로 넘길 수 있습니다. 이 강좌의 웹 환경에서는 브라우저 메모리 안의 작업 폴더에 파일이 만들어집니다.' },
          { type: 'callout', kind: 'vs', title: '파일은 어디에 만들어지나?', html: 'Visual Studio 에서 실행하면 <b>실행 파일이 있는 폴더</b>(<code>프로젝트\\bin\\Debug\\net9.0\\</code>)에 <code>memo.txt</code> 가 생깁니다. 솔루션 탐색기의 <b>모든 파일 표시</b> 버튼을 누르거나 탐색기로 그 폴더를 열어 확인하세요. 특정 폴더에 쓰려면 <code>Path.Combine(폴더, "memo.txt")</code> 로 경로를 만들고, 바탕 화면 · 문서 폴더는 <code>Environment.GetFolderPath(Environment.SpecialFolder.Desktop)</code> 로 얻습니다.' },
          { type: 'h', text: 'StreamWriter · StreamReader 와 using 문' },
          { type: 'p', html: '<code>File.WriteAllText</code> 는 내용을 한 번에 씁니다. 반복문을 돌며 <b>한 줄씩 차례로</b> 쓰거나 큰 파일을 <b>한 줄씩 읽으며 처리</b>하려면 <code>StreamWriter</code> · <code>StreamReader</code> 를 씁니다. 이들은 운영체제의 파일을 <b>열어 두는</b> 객체라서 다 쓰면 반드시 <b>닫아야</b> 합니다. <code>using (…) { }</code> 문은 블록이 끝나면(예외가 나도) 자동으로 <code>Dispose()</code>(닫기)를 호출해 줍니다.' },
          { type: 'code', title: '예제 10-12. StreamWriter 로 한 줄씩 쓰고 StreamReader 로 한 줄씩 읽기', code: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        // 쓰기: using 블록이 끝나면 자동으로 닫힌다(저장 완료)
        using (StreamWriter writer = new StreamWriter("diary.txt"))
        {
            writer.WriteLine("03-01 날씨 맑음, 산책");
            writer.WriteLine("03-02 C# 문자열 공부");
            for (int day = 3; day <= 5; day++)
                writer.WriteLine($"03-0{day} 예외 처리 연습 {day - 2}일째");
        }

        // 읽기: 끝(null)이 나올 때까지 한 줄씩
        using (StreamReader reader = new StreamReader("diary.txt"))
        {
            string line;
            int no = 1;
            while ((line = reader.ReadLine()) != null)
                Console.WriteLine($"{no++}. {line}");
        }

        // 없는 파일을 열면 FileNotFoundException — try/catch 로 대비
        try
        {
            string text = File.ReadAllText("없는파일.txt");
            Console.WriteLine(text);
        }
        catch (FileNotFoundException)
        {
            Console.WriteLine("없는파일.txt 를 찾을 수 없습니다. 먼저 저장했는지 확인하세요.");
        }
    }
}`, expect: `1. 03-01 날씨 맑음, 산책
2. 03-02 C# 문자열 공부
3. 03-03 예외 처리 연습 1일째
4. 03-04 예외 처리 연습 2일째
5. 03-05 예외 처리 연습 3일째
없는파일.txt 를 찾을 수 없습니다. 먼저 저장했는지 확인하세요.`, desc: '<code>reader.ReadLine()</code> 은 파일 끝에서 <code>null</code> 을 돌려주므로 <code>while ((line = reader.ReadLine()) != null)</code> 이 “끝까지 한 줄씩” 의 관용구입니다. <code>using</code> 을 빼먹고 닫지 않으면 내용이 저장되지 않거나 다른 프로그램이 파일을 열 수 없습니다. 파일 · 네트워크 · DB 연결처럼 <b>운영체제 자원을 쓰는 객체는 항상 using</b> 으로 감싸세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — using 선언과 IDisposable', html: 'C# 8 부터는 중괄호 없이 <code>using var writer = new StreamWriter("a.txt");</code> 처럼 쓰면 <b>현재 블록이 끝날 때</b> 자동으로 닫힙니다(<b>using 선언</b>). <code>using</code> 문에 쓸 수 있는 클래스는 <code>IDisposable</code> 인터페이스(9장)를 구현한 것으로, <code>Dispose()</code> 메서드에 자원 해제 코드가 들어 있습니다. 파일 맨 위의 <code>using System.IO;</code>(네임스페이스 가져오기)와는 이름만 같을 뿐 다른 문법입니다.' },
          { type: 'code', title: '예제 10-13. 종합 — 점수 파일 저장하고 불러와 평균 내기', code: `using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // ① 저장: "이름,점수" 형식으로 한 줄씩 (일부러 잘못된 줄 하나 포함)
        List<string> records = new List<string> { "홍길동,90", "김철수,85", "이영희,abc", "박민수,77" };
        File.WriteAllLines("scores.txt", records);
        Console.WriteLine($"scores.txt 에 {records.Count}줄 저장");

        // ② 불러오기: 줄마다 Split → Parse. 잘못된 줄은 건너뛴다
        int total = 0, count = 0;
        foreach (string line in File.ReadAllLines("scores.txt"))
        {
            string[] parts = line.Split(',');
            try
            {
                int score = int.Parse(parts[1].Trim());
                total += score;
                count++;
                Console.WriteLine($"{parts[0]} {score,3}점");
            }
            catch (FormatException)
            {
                Console.WriteLine($"{parts[0]}: 점수 '{parts[1]}' 을(를) 읽을 수 없어 건너뜁니다");
            }
        }
        double average = (double)total / count;
        Console.WriteLine($"유효 {count}명, 평균 {average:F1}점");

        // ③ 결과를 다른 파일에 기록하고 확인
        File.WriteAllText("result.txt", $"유효 {count}명, 평균 {average:F1}점");
        Console.WriteLine("result.txt: " + File.ReadAllText("result.txt"));
    }
}`, expect: `scores.txt 에 4줄 저장
홍길동  90점
김철수  85점
이영희: 점수 'abc' 을(를) 읽을 수 없어 건너뜁니다
박민수  77점
유효 3명, 평균 84.0점
result.txt: 유효 3명, 평균 84.0점`, desc: '이 장에서 배운 것이 모두 모였습니다: <code>WriteAllLines</code> 로 저장 → <code>ReadAllLines</code> 로 읽기 → <code>Split</code> 으로 나누기 → <code>int.Parse</code> 를 <b>try/catch 로 감싸</b> 잘못된 줄이 있어도 전체가 멈추지 않게 하기. 실제 데이터 파일에는 언제나 이상한 줄이 섞여 있으므로 이 패턴을 기억해 두세요. 프로젝트 파트의 “성적 처리 프로그램”이 이 구조 위에 만들어집니다.' }
        ],
        practice: [
          {
            title: '실습 10-3. 안전한 나눗셈 계산기',
            level: 1,
            desc: '<p>두 정수를 입력받아 <code>a / b</code> 의 몫과 나머지를 출력하는 계산기를 만드세요. 숫자가 아닌 입력에는 “숫자만 입력할 수 있습니다.”, 0 으로 나누면 “0 으로 나눌 수 없습니다.” 를 출력하고, 어떤 경우든 마지막에 “계산기를 종료합니다.” 를 출력합니다.</p><pre>첫 번째 수: 10\n두 번째 수: 0\n0 으로 나눌 수 없습니다.\n계산기를 종료합니다.</pre><p>정상 입력(10, 3)이면 <code>10 / 3 = 3 (나머지 1)</code> 을 출력합니다.</p>',
            hint: '<code>try</code> 안에서 두 번 <code>int.Parse</code> 하고 나눕니다. <code>catch (FormatException)</code> 과 <code>catch (DivideByZeroException)</code> 을 따로, 마지막 줄은 <code>finally</code> 에.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        string a = Console.ReadLine();
        Console.Write("두 번째 수: ");
        string b = Console.ReadLine();

        // TODO: try - 정수로 변환하고 몫과 나머지 출력
        // TODO: catch FormatException / DivideByZeroException
        // TODO: finally - "계산기를 종료합니다."
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("첫 번째 수: ");
        string a = Console.ReadLine();
        Console.Write("두 번째 수: ");
        string b = Console.ReadLine();

        try
        {
            int x = int.Parse(a);
            int y = int.Parse(b);
            Console.WriteLine($"{x} / {y} = {x / y} (나머지 {x % y})");
        }
        catch (FormatException)
        {
            Console.WriteLine("숫자만 입력할 수 있습니다.");
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("0 으로 나눌 수 없습니다.");
        }
        finally
        {
            Console.WriteLine("계산기를 종료합니다.");
        }
    }
}
`,
            stdin: '10\n0\n',
            expect: `첫 번째 수: 두 번째 수: 0 으로 나눌 수 없습니다.
계산기를 종료합니다.`
          },
          {
            title: '실습 10-4. 할 일 목록 파일에 저장하고 불러오기',
            level: 2,
            desc: '<p>할 일 세 개를 <code>todo.txt</code> 에 한 줄씩 저장한 뒤, <code>AppendAllText</code> 로 “일기 쓰기” 를 덧붙이세요. 그런 다음 파일을 다시 읽어 <b>번호를 붙여</b> 출력합니다.</p><pre>todo.txt 에 3개 저장\n=== 할 일 4개 ===\n1. C# 복습하기\n2. 실습 문제 풀기\n3. 운동 30분\n4. 일기 쓰기</pre>',
            hint: '<code>File.WriteAllLines("todo.txt", todos)</code> → <code>File.AppendAllText("todo.txt", "일기 쓰기\\n")</code> → <code>File.ReadAllLines</code> 로 읽어 <code>for</code> 로 번호 출력.',
            starter: `using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string> { "C# 복습하기", "실습 문제 풀기", "운동 30분" };
        // TODO: todo.txt 에 한 줄씩 저장하고 "todo.txt 에 3개 저장" 출력

        // TODO: "일기 쓰기" 한 줄 덧붙이기

        // TODO: 다시 읽어 "=== 할 일 N개 ===" 와 번호 붙인 목록 출력
    }
}
`,
            solution: `using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string> { "C# 복습하기", "실습 문제 풀기", "운동 30분" };
        File.WriteAllLines("todo.txt", todos);
        Console.WriteLine($"todo.txt 에 {todos.Count}개 저장");

        File.AppendAllText("todo.txt", "일기 쓰기\\n");

        string[] lines = File.ReadAllLines("todo.txt");
        Console.WriteLine($"=== 할 일 {lines.Length}개 ===");
        for (int i = 0; i < lines.Length; i++)
            Console.WriteLine($"{i + 1}. {lines[i]}");
    }
}
`,
            expect: `todo.txt 에 3개 저장
=== 할 일 4개 ===
1. C# 복습하기
2. 실습 문제 풀기
3. 운동 30분
4. 일기 쓰기`
          }
        ],
        quiz: [
          { q: '<code>int.Parse("abc")</code> 를 실행하면 발생하는 예외는?', options: ['DivideByZeroException', 'FormatException', 'NullReferenceException', 'IndexOutOfRangeException'], answer: 1, explain: '형식에 맞지 않는 문자열을 숫자로 바꾸려 하면 <code>FormatException</code> 입니다. 예외 없이 처리하려면 <code>int.TryParse</code>.' },
          { q: '다음 코드의 출력 결과는?<pre><code>try { Console.Write("A"); int n = int.Parse("x"); Console.Write("B"); }\ncatch (FormatException) { Console.Write("C"); }\nfinally { Console.Write("D"); }</code></pre>', options: ['ABD', 'AC', 'ACD', 'ABCD'], answer: 2, explain: 'A 출력 → Parse 에서 예외 → B 건너뜀 → catch 의 C → finally 의 D. 예외가 나도 finally 는 실행됩니다.' },
          { q: 'catch 블록을 여러 개 쓸 때 올바른 순서는?', options: ['구체적인 예외를 먼저, <code>Exception</code> 은 마지막', '<code>Exception</code> 을 먼저 써서 모두 잡은 뒤 구체적인 것', '순서는 상관없다', 'catch 는 하나만 쓸 수 있다'], answer: 0, explain: '위에서부터 처음 맞는 catch 하나만 실행됩니다. <code>Exception</code> 을 먼저 쓰면 뒤의 catch 에 닿을 수 없어 컴파일 오류 CS0160 이 납니다.' },
          { q: '없는 파일 이름으로 <code>File.ReadAllText</code> 를 호출하면?', options: ['빈 문자열을 돌려준다', '<code>null</code> 을 돌려준다', '<code>FileNotFoundException</code> 이 발생한다', '빈 파일을 새로 만든다'], answer: 2, explain: '읽기 전에 <code>File.Exists</code> 로 확인하거나 try/catch 로 대비합니다. 새로 만드는 것은 <code>WriteAllText</code> · <code>AppendAllText</code> 입니다.' },
          { q: '<code>StreamWriter</code> 를 <code>using (…) { }</code> 문으로 감싸는 이유는?', options: ['파일을 더 빨리 쓴다', '예외를 자동으로 잡아 준다', '<code>System.IO</code> 네임스페이스를 가져온다', '블록이 끝나면 자동으로 닫아(Dispose) 준다'], answer: 3, explain: '파일을 열어 둔 객체는 반드시 닫아야 합니다. <code>using</code> 문은 예외가 나도 <code>Dispose()</code> 를 호출해 파일을 닫습니다.' }
        ],
        slides: [
          { layout: 'title', title: '예외 처리와 파일 입출력', subtitle: 'Chapter 10 · Section 02 — try · catch · finally · File', badge: '10-2',
            notes: '<p><b>[도입 3분]</b> 1장의 “나이에 글자를 넣으면?” 시연을 떠올리게 합니다. “프로그램이 멈추는 대신 ‘숫자를 입력하세요’ 라고 말해 주려면?” 이 오늘의 주제. 후반은 “프로그램을 꺼도 데이터가 남게” — 파일.</p>' },
          { layout: 'bullets', title: '예외(exception)란?', lead: '컴파일은 됐지만 실행 중에 생기는 오류',
            bullets: ['숫자 대신 글자 입력 → <code>FormatException</code>', '0 으로 나눔 → <code>DivideByZeroException</code>', '배열 범위 밖 → <code>IndexOutOfRangeException</code>', '없는 파일 읽기 → <code>FileNotFoundException</code>', ['.NET 이 예외 <b>객체</b>를 만들어 던진다(throw)', ['아무도 받지(catch) 않으면 → 메시지 + 스택 추적 출력 후 <b>프로그램 종료</b>']]],
            notes: '<p><b>[5분]</b> 예제 10-7 을 실행해 “처리되지 않은 예외” 메시지와 스택 추적을 함께 읽습니다. “프로그램 끝”이 출력되지 않는 것을 확인. 발문: “은행 앱이 이렇게 죽으면?”</p>' },
          { layout: 'diagram', title: 'try · catch · finally 의 흐름', html: SVG_TRY, caption: '정상: try → finally / 예외: try 중간에 멈춤 → catch → finally. 어느 쪽이든 다음 문장으로',
            notes: '<p><b>[5분]</b> 화살표를 손으로 따라가며 두 경로를 설명. finally 는 “예외가 나든 안 나든” 이 핵심. 비유: try = 시도, catch = 받아 내기, finally = 뒷정리(가게 문 닫기).</p>' },
          { layout: 'code', title: '예제 10-8. try / catch / finally', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("숫자 입력: ");
        string input = Console.ReadLine();
        try
        {
            int n = int.Parse(input);           // 예외 가능 지점
            Console.WriteLine($"제곱: {n * n}");  // 예외 시 건너뜀
        }
        catch (FormatException ex)
        {
            Console.WriteLine($"숫자가 아닙니다: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("finally: 항상 실행");
        }
        Console.WriteLine("프로그램은 계속됩니다");
    }
}`, stdin: 'abc\n', points: ['<code>try</code>: 위험한 코드', '<code>catch (형식 ex)</code>: 그 예외가 나면 실행, <code>ex.Message</code>', '<code>finally</code>: 항상 실행 (생략 가능)', '프로그램이 죽지 않고 계속된다'],
            notes: '<p><b>[6분]</b> abc 와 12 를 각각 입력해 두 경로를 확인. “TryParse 로도 되는데 왜 try/catch?” → 예측 가능한 입력 오류는 TryParse, 파일 · 네트워크 등 다양한 예외는 try/catch.</p>' },
          { layout: 'diagram', title: '예외 클래스의 계층', html: SVG_EXC, caption: '모두 Exception 의 자손 — 구체적인 것을 먼저, Exception 은 마지막에',
            notes: '<p><b>[4분]</b> 9장 상속과 연결: “FileNotFoundException 은 IOException 이고, IOException 은 Exception 이다.” 그래서 <code>catch (Exception)</code> 이 모두 잡는다. 발문: “Exception 을 첫 catch 에 쓰면 뒤의 catch 는?” → 닿을 수 없음 → CS0160.</p>' },
          { layout: 'code', title: '예제 10-9. 여러 catch — 구체적인 것부터', code: `using System;

class Program
{
    static void Try(int which)
    {
        int[] arr = { 1, 2, 3 };
        try
        {
            if (which == 1) int.Parse("12a");
            if (which == 2) Console.WriteLine(10 / (which - 2));
            if (which == 3) Console.WriteLine(arr[5]);
            Console.WriteLine("정상");
        }
        catch (FormatException ex) { Console.WriteLine($"형식: {ex.Message}"); }
        catch (DivideByZeroException ex) { Console.WriteLine($"나눗셈: {ex.Message}"); }
        catch (Exception ex) { Console.WriteLine($"기타 {ex.GetType().Name}: {ex.Message}"); }
    }

    static void Main()
    {
        for (int i = 0; i <= 3; i++) { Console.Write($"case {i}: "); Try(i); }
    }
}`, points: ['위에서부터 <b>처음 맞는 catch 하나만</b> 실행', '<code>catch (Exception)</code> 은 맨 마지막', '<code>ex.GetType().Name</code>: 예외 클래스 이름', 'Message 는 영어 — 읽는 연습'],
            notes: '<p><b>[5분]</b> 실행 후 <code>catch (Exception ex)</code> 를 맨 위로 옮겨 CS0160 을 보여 주세요. case 3 이 “기타 IndexOutOfRangeException” 으로 잡히는 이유를 계층 그림으로 설명.</p>' },
          { layout: 'code', title: '예제 10-10. throw · 사용자 정의 예외', code: `using System;

class AgeException : Exception
{
    public AgeException(string message) : base(message) { }
}

class Program
{
    static string Grade(int score)
    {
        if (score < 0 || score > 100)
            throw new ArgumentException($"점수 범위 오류: {score}");
        return score >= 90 ? "A" : score >= 80 ? "B" : "C";
    }
    static void CheckAge(int age)
    {
        if (age < 0) throw new AgeException($"나이가 이상합니다: {age}");
        Console.WriteLine($"나이 {age} 확인");
    }
    static void Main()
    {
        try { Console.WriteLine(Grade(95)); Console.WriteLine(Grade(150)); }
        catch (ArgumentException ex) { Console.WriteLine($"오류: {ex.Message}"); }
        try { CheckAge(20); CheckAge(-5); CheckAge(30); }
        catch (AgeException ex) { Console.WriteLine(ex.Message); }
    }
}`, points: ['<code>throw new XxxException("설명")</code>', '예외는 호출한 쪽으로 <b>거슬러 올라간다</b>', '사용자 정의: <code>: Exception</code> + <code>base(message)</code>', '잘못된 값은 일찍 · 분명하게 던지기'],
            notes: '<p><b>[5분]</b> Grade(150) 이 던진 예외를 Main 의 catch 가 받는 흐름을 화살표로. CheckAge(30) 이 실행되지 않는 이유를 학생이 설명하게. 시간이 남으면 checked 추가 예제(오버플로) 시연.</p>' },
          { layout: 'table', title: 'File 클래스 — 한 줄로 읽고 쓰기', head: ['메서드', '하는 일'], rows: [['<code>File.WriteAllText(경로, 문자열)</code>', '통째로 쓰기 (덮어씀)'], ['<code>File.ReadAllText(경로)</code>', '통째로 읽기 → string'], ['<code>File.WriteAllLines(경로, 배열)</code>', '한 줄씩 쓰기'], ['<code>File.ReadAllLines(경로)</code>', '한 줄씩 읽기 → string[]'], ['<code>File.AppendAllText(경로, 문자열)</code>', '끝에 덧붙이기 (로그)'], ['<code>File.Exists(경로)</code> / <code>Delete</code>', '있는지 확인 / 삭제'], ['<code>StreamWriter</code> / <code>StreamReader</code>', '한 줄씩 차례로 쓰기 / 읽기 — <b>using 으로 닫기</b>']],
            lead: 'using System.IO; — 이름만 쓰면 실행 폴더(bin\\Debug\\…)에 만들어진다',
            notes: '<p><b>[4분]</b> “프로그램을 끄면 변수는 사라진다 → 파일에 남긴다.” WriteAllText(덮어쓰기) 와 AppendAllText(덧붙이기) 의 차이를 강조. Visual Studio 에서 bin\\Debug 폴더를 열어 실제 파일을 보여 주세요.</p>' },
          { layout: 'code', title: '예제 10-11. 메모 파일 쓰기 · 읽기 · 덧붙이기', code: `using System;
using System.IO;

class Program
{
    static void Main()
    {
        File.WriteAllText("memo.txt", "첫 번째 메모\\n두 번째 메모\\n");
        Console.WriteLine(File.Exists("memo.txt"));        // True
        Console.Write(File.ReadAllText("memo.txt"));       // 통째로

        File.AppendAllText("memo.txt", "세 번째 메모\\n");  // 덧붙이기
        string[] lines = File.ReadAllLines("memo.txt");    // 줄 단위
        for (int i = 0; i < lines.Length; i++)
            Console.WriteLine($"{i + 1}: {lines[i]}");

        using (StreamWriter w = new StreamWriter("diary.txt"))
        {
            w.WriteLine("03-01 맑음");
            w.WriteLine("03-02 C# 공부");
        }
        using (StreamReader r = new StreamReader("diary.txt"))
        {
            string line;
            while ((line = r.ReadLine()) != null)
                Console.WriteLine("> " + line);
        }
    }
}`, points: ['쓰고 → 있는지 확인 → 읽기', '<code>AppendAllText</code>: 기존 내용 뒤에', '<code>ReadAllLines</code> → <code>string[]</code> 로 번호 붙이기', '<code>StreamReader.ReadLine()</code> 은 끝에서 <code>null</code>'],
            notes: '<p><b>[6분]</b> 실행 후 프로그램을 한 번 더 실행하면 memo.txt 가 덮어써져 결과가 같다는 점, AppendAllText 만 반복하면 계속 늘어난다는 점을 실험. using 을 빼면 어떻게 되는지(닫히지 않아 내용이 안 써질 수 있음) 이야기.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력 결과는?<pre><code>try { Console.Write("A"); int n = int.Parse("x"); Console.Write("B"); }\ncatch (FormatException) { Console.Write("C"); }\nfinally { Console.Write("D"); }</code></pre>', options: ['ABD', 'AC', 'ACD', 'ABCD'], answer: 2, explain: 'A → 예외 → (B 건너뜀) → C → finally 의 D.',
            notes: '<p>이어서 “Parse("5") 였다면?” → ABD. finally 가 두 경우 모두 실행됨을 재확인.</p>' },
          { layout: 'practice', title: '실습 10-4. 할 일 목록 저장 · 불러오기', desc: '<p>할 일 3개를 <code>todo.txt</code> 에 저장하고 “일기 쓰기” 를 덧붙인 뒤, 다시 읽어 번호를 붙여 출력하세요.</p><pre>todo.txt 에 3개 저장\n=== 할 일 4개 ===\n1. C# 복습하기\n2. 실습 문제 풀기\n3. 운동 30분\n4. 일기 쓰기</pre>', starter: `using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string> { "C# 복습하기", "실습 문제 풀기", "운동 30분" };
        // TODO: 저장 → 덧붙이기 → 읽어서 번호 붙여 출력
    }
}`, solution: `using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> todos = new List<string> { "C# 복습하기", "실습 문제 풀기", "운동 30분" };
        File.WriteAllLines("todo.txt", todos);
        Console.WriteLine($"todo.txt 에 {todos.Count}개 저장");
        File.AppendAllText("todo.txt", "일기 쓰기\\n");
        string[] lines = File.ReadAllLines("todo.txt");
        Console.WriteLine($"=== 할 일 {lines.Length}개 ===");
        for (int i = 0; i < lines.Length; i++)
            Console.WriteLine($"{i + 1}. {lines[i]}");
    }
}`,
            notes: '<p><b>[8분]</b> WriteAllLines → AppendAllText → ReadAllLines 세 단계. 흔한 실수: AppendAllText 에 <code>\\n</code> 을 빼먹어 줄이 붙는 것. 빨리 끝난 학생은 실습 10-3(안전한 나눗셈 계산기)이나, 사용자에게 할 일을 입력받아 추가하는 버전으로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['예외 = 실행 중 오류 객체. 안 잡으면 프로그램 종료', '<code>try</code> 위험 코드 · <code>catch (형식 ex)</code> 처리 · <code>finally</code> 항상', '구체적 예외 먼저, <code>Exception</code> 은 마지막 · <code>ex.Message</code>', '<code>throw new ArgumentException("…")</code> · <code>class MyEx : Exception</code>', '<code>File.WriteAllText / ReadAllText / WriteAllLines / ReadAllLines / AppendAllText / Exists</code>', '<code>StreamWriter</code> · <code>StreamReader</code> 는 <code>using</code> 으로 자동 닫기'],
            notes: '<p>학습 목표 확인. 다음 장: 델리게이트 · 이벤트 · 람다 · LINQ — WPF 의 버튼 클릭이 바로 이벤트입니다.</p>' }
        ]
      }
    ]
  });
})();
