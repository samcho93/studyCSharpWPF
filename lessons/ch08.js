/* Chapter 08. 클래스와 객체 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_CLASS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="클래스는 설계도, 객체는 설계도로 만든 실체">
  <defs><marker id="ah8a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="260" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">클래스 (class) = 설계도</text>
  <rect x="60" y="80" width="400" height="400" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4" stroke-dasharray="14 8"/>
  <text x="260" y="125" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--fg)">class Student</text>
  <line x1="90" y1="145" x2="430" y2="145" stroke="var(--line)" stroke-width="2"/>
  <text x="90" y="185" style="font-size:22px;font-weight:700;fill:var(--accent2)">필드 (데이터)</text>
  <text x="110" y="220" style="${MONO};font-size:22px;fill:var(--fg)">string Name;</text>
  <text x="110" y="252" style="${MONO};font-size:22px;fill:var(--fg)">int Korean;</text>
  <text x="110" y="284" style="${MONO};font-size:22px;fill:var(--fg)">int English;</text>
  <text x="90" y="335" style="font-size:22px;font-weight:700;fill:var(--ok)">메서드 (동작)</text>
  <text x="110" y="370" style="${MONO};font-size:22px;fill:var(--fg)">double Average()</text>
  <text x="110" y="402" style="${MONO};font-size:22px;fill:var(--fg)">void Print()</text>
  <text x="260" y="455" text-anchor="middle" style="font-size:20px;fill:var(--muted)">메모리를 차지하지 않는다 · 값이 없다</text>
  <line x1="470" y1="200" x2="700" y2="160" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8a)"/>
  <line x1="470" y1="360" x2="700" y2="400" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8a)"/>
  <text x="585" y="255" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">new Student()</text>
  <text x="585" y="290" text-anchor="middle" style="font-size:20px;fill:var(--muted)">설계도대로 찍어 낸다</text>
  <text x="960" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">객체 (object) = 실체 · 인스턴스</text>
  <rect x="720" y="80" width="480" height="180" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="750" y="120" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">s1</text>
  <text x="750" y="160" style="${MONO};font-size:22px;fill:var(--fg)">Name = "홍길동"</text>
  <text x="750" y="195" style="${MONO};font-size:22px;fill:var(--fg)">Korean = 90    English = 80</text>
  <text x="750" y="235" style="${MONO};font-size:22px;fill:var(--muted)">s1.Average() → 85.0</text>
  <rect x="720" y="300" width="480" height="180" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="750" y="340" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">s2</text>
  <text x="750" y="380" style="${MONO};font-size:22px;fill:var(--fg)">Name = "김영희"</text>
  <text x="750" y="415" style="${MONO};font-size:22px;fill:var(--fg)">Korean = 100   English = 95</text>
  <text x="750" y="455" style="${MONO};font-size:22px;fill:var(--muted)">s2.Average() → 97.5</text>
  <text x="640" y="530" text-anchor="middle" style="font-size:23px;fill:var(--fg)">설계도(클래스)는 하나, 그 설계도로 만든 객체는 <tspan font-weight="700">필요한 만큼</tspan> — 객체마다 자기만의 값을 가진다</text>
</svg>`;

  const SVG_REF = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="참조 형식 변수는 객체의 주소를 담는다">
  <defs><marker id="ah8b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <text x="250" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">변수 (이름표)</text>
  <text x="900" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">객체 (메모리 어딘가에 있는 실체)</text>
  <g style="${MONO};font-size:24px">
    <rect x="120" y="90" width="260" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="150" y="135" style="fill:var(--fg)">Player a</text>
    <circle cx="340" cy="125" r="10" fill="var(--accent2)"/>
    <rect x="120" y="180" width="260" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="150" y="225" style="fill:var(--fg)">Player b</text>
    <circle cx="340" cy="215" r="10" fill="var(--accent2)"/>
    <rect x="120" y="270" width="260" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="150" y="315" style="fill:var(--fg)">Player c</text>
    <circle cx="340" cy="305" r="10" fill="var(--accent2)"/>
    <rect x="120" y="360" width="260" height="70" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="150" y="405" style="fill:var(--fg)">Player d</text>
    <text x="300" y="405" style="fill:var(--danger);font-weight:700">null</text>
    <rect x="120" y="450" width="260" height="70" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="150" y="495" style="fill:var(--fg)">int x</text>
    <text x="300" y="495" style="fill:var(--warn);font-weight:700">5</text>
  </g>
  <line x1="350" y1="125" x2="640" y2="150" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah8b)"/>
  <line x1="350" y1="215" x2="640" y2="165" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah8b)"/>
  <line x1="350" y1="305" x2="640" y2="345" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah8b)"/>
  <rect x="650" y="100" width="500" height="120" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="680" y="140" style="${MONO};font-size:22px;font-weight:700;fill:var(--ok)">Player 객체 ①</text>
  <text x="680" y="185" style="${MONO};font-size:22px;fill:var(--fg)">Name = "용사"   Hp = 50</text>
  <rect x="650" y="300" width="500" height="120" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="680" y="340" style="${MONO};font-size:22px;font-weight:700;fill:var(--ok)">Player 객체 ②</text>
  <text x="680" y="385" style="${MONO};font-size:22px;fill:var(--fg)">Name = "용사"   Hp = 50</text>
  <text x="900" y="250" text-anchor="middle" style="font-size:21px;fill:var(--muted)">Player b = a;  → b 는 ① 을 가리키는 두 번째 이름표 (a == b 는 true)</text>
  <text x="900" y="455" text-anchor="middle" style="font-size:21px;fill:var(--muted)">c 는 내용이 같아도 다른 객체 (a == c 는 false)</text>
  <text x="640" y="545" text-anchor="middle" style="font-size:22px;fill:var(--fg)">참조 형식: 상자에 <tspan font-weight="700">주소</tspan>가 들어 있다 · 값 형식(int): 상자에 <tspan font-weight="700">값 자체</tspan>가 들어 있다 · null = 아무것도 가리키지 않음</text>
</svg>`;

  const SVG_PROP = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="속성은 private 필드를 지키는 문지기">
  <defs><marker id="ah8c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="230" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">클래스 밖 (Main)</text>
  <rect x="40" y="80" width="380" height="400" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="70" y="140" style="${MONO};font-size:23px;fill:var(--fg)">p.Age = 20;</text>
  <text x="70" y="175" style="font-size:20px;fill:var(--muted)">→ set 호출, value = 20</text>
  <text x="70" y="250" style="${MONO};font-size:23px;fill:var(--danger)">p.Age = 200;</text>
  <text x="70" y="285" style="font-size:20px;fill:var(--muted)">→ set 호출, 검사에 걸려 거부</text>
  <text x="70" y="360" style="${MONO};font-size:23px;fill:var(--fg)">int n = p.Age;</text>
  <text x="70" y="395" style="font-size:20px;fill:var(--muted)">→ get 호출, 20 을 돌려줌</text>
  <text x="70" y="455" style="${MONO};font-size:21px;fill:var(--danger)">p.age = 200;  ✗ CS0122</text>
  <line x1="430" y1="150" x2="520" y2="150" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8c)"/>
  <line x1="430" y1="260" x2="520" y2="260" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8c)"/>
  <line x1="520" y1="370" x2="430" y2="370" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8c)"/>
  <text x="730" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">속성 Age — 문지기</text>
  <rect x="530" y="80" width="400" height="400" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="730" y="125" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--fg)">public int Age</text>
  <rect x="560" y="150" width="340" height="150" rx="10" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <text x="580" y="185" style="${MONO};font-size:22px;font-weight:700;fill:var(--warn)">set</text>
  <text x="580" y="220" style="font-size:20px;fill:var(--fg)">value 가 0~150 인가?</text>
  <text x="580" y="250" style="font-size:20px;fill:var(--ok)">예 → age = value</text>
  <text x="580" y="280" style="font-size:20px;fill:var(--danger)">아니오 → 거부(무시)</text>
  <rect x="560" y="330" width="340" height="90" rx="10" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <text x="580" y="365" style="${MONO};font-size:22px;font-weight:700;fill:var(--ok)">get</text>
  <text x="580" y="400" style="font-size:20px;fill:var(--fg)">return age;</text>
  <text x="730" y="455" text-anchor="middle" style="font-size:20px;fill:var(--muted)">읽고 쓰는 유일한 통로</text>
  <line x1="940" y1="225" x2="1030" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8c)"/>
  <line x1="1030" y1="375" x2="940" y2="375" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah8c)"/>
  <text x="1140" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">금고</text>
  <rect x="1040" y="80" width="200" height="400" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1140" y="250" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">private</text>
  <text x="1140" y="285" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">int age</text>
  <text x="1140" y="340" text-anchor="middle" style="${MONO};font-size:34px;font-weight:700;fill:var(--ok)">20</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:22px;fill:var(--fg)">캡슐화: 데이터(필드)는 숨기고, 검사가 붙은 통로(속성 · 메서드)로만 드나들게 한다 → 잘못된 값이 들어올 수 없다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch08',
    no: '08',
    title: '클래스와 객체',
    subtitle: 'Classes & Objects',
    summary: '관련 있는 데이터와 동작을 하나로 묶는 클래스를 정의하고, 그 설계도로 객체를 만들어 사용하는 방법을 배웁니다. 생성자 · this · 참조 형식의 성질, 그리고 속성 · 캡슐화 · static · ToString 재정의까지 객체 지향의 기초를 익힙니다.',
    goals: [
      '클래스(설계도)와 객체(실체)의 관계를 설명하고 필드 · 메서드를 정의할 수 있다',
      'new 로 객체를 만들고 생성자(기본 · 매개변수 · 오버로딩 · 체인)를 작성할 수 있다',
      '참조 형식의 성질(같은 객체 공유, null, == 는 참조 비교)을 설명할 수 있다',
      'private 필드와 속성(get/set · 검증 · 읽기 전용 · 자동 구현 · init)으로 캡슐화할 수 있다',
      'static 멤버 · const 와 static readonly · ToString() 재정의를 사용할 수 있다'
    ],
    sections: [
      /* ===================== ch08-1 ===================== */
      {
        id: 'ch08-1',
        title: '클래스 정의와 객체 생성',
        minutes: 50,
        goals: [
          '데이터와 동작을 클래스로 묶어야 하는 이유를 설명할 수 있다',
          '클래스를 정의하고 new 로 객체를 만들어 필드와 메서드를 사용할 수 있다',
          'this 와 생성자(기본 · 매개변수 · 오버로딩 · 체인)를 작성할 수 있다',
          '참조 형식의 성질(같은 객체 가리키기 · null · == 비교)을 설명할 수 있다'
        ],
        flow: [['도입: 흩어진 변수의 문제', 5], ['클래스 · 객체 · 필드 · 메서드', 12], ['this · 생성자', 12], ['참조 형식 · 객체 전달 · 여러 파일', 12], ['퀴즈 · 실습', 9]],
        content: [
          { type: 'h', text: '왜 클래스가 필요할까?' },
          { type: 'p', html: '학생 한 명의 정보를 담으려면 이름 · 국어 · 영어 점수, 변수가 세 개 필요합니다. 학생이 30명이면 변수가 90개, 게다가 평균을 구하는 메서드에는 매번 세 값을 따로 넘겨야 합니다. 변수들이 <b>서로 관련이 있는데도 흩어져 있는 것</b>이 문제입니다.' },
          { type: 'table', head: ['', '변수만 사용', '클래스 사용'], rows: [
            ['학생 1명', '<code>string name1; int kor1; int eng1;</code>', '<code>Student s1 = new Student();</code>'],
            ['학생 30명', '변수 90개 (또는 배열 3개를 짝 맞춰 관리)', '<code>Student</code> 객체 30개'],
            ['평균 구하기', '<code>Average(kor1, eng1)</code> — 값을 일일이 넘김', '<code>s1.Average()</code> — 객체가 스스로 계산'],
            ['새 항목(수학) 추가', '변수 30개 추가, 메서드 시그니처 수정', '클래스에 필드 하나 추가']
          ], caption: '관련 있는 데이터와 동작을 하나로 묶으면 프로그램이 단순해진다' },
          { type: 'p', html: '<b>객체 지향 프로그래밍(OOP, Object-Oriented Programming)</b> 은 이렇게 <b>관련 있는 데이터(필드)와 동작(메서드)을 하나의 덩어리(객체)로 묶어</b> 프로그램을 만드는 방식입니다. 현실 세계를 흉내 내는 셈입니다. “학생”이라는 것은 이름과 점수를 <b>가지고</b>(데이터), 평균을 <b>계산할 수 있습니다</b>(동작).' },
          { type: 'h', text: '클래스 = 설계도, 객체 = 실체' },
          { type: 'p', html: '<b>클래스(class)</b> 는 “학생이란 어떤 데이터와 동작을 가지는가”를 적어 둔 <b>설계도</b>입니다. 설계도만으로는 아무 일도 못 합니다. 설계도대로 실제로 만들어 낸 것이 <b>객체(object)</b>이고, 다른 말로 <b>인스턴스(instance)</b>라고도 부릅니다. 붕어빵 틀(클래스)과 붕어빵(객체), 건축 도면과 실제 집을 떠올리세요.' },
          { type: 'figure', html: SVG_CLASS, caption: '클래스 하나로 객체를 여러 개 만든다 — 객체마다 자기만의 필드 값을 가진다' },
          { type: 'list', items: [
            '<b>필드(field)</b>: 객체가 기억하는 데이터. 클래스 안에 선언한 변수입니다. (<code>Name</code>, <code>Korean</code>)',
            '<b>메서드(method)</b>: 객체가 할 수 있는 동작. 6장의 메서드와 같지만 <b><code>static</code> 을 붙이지 않습니다</b> — 객체가 있어야 호출할 수 있습니다.',
            '<b><code>new 클래스이름()</code></b>: 설계도대로 객체를 만들어 메모리에 올립니다. 만들어진 객체는 변수에 담아 두고 <b><code>변수.멤버</code></b> 로 씁니다.'
          ] },
          { type: 'code', title: '예제 8-1. 첫 클래스 — Student 정의하고 객체 두 개 만들기', code: `using System;

class Student                  // 설계도: 학생은 이름과 두 과목 점수를 가지고, 평균을 계산할 수 있다
{
    // 필드(field): 객체가 기억하는 데이터
    public string Name;
    public int Korean;
    public int English;

    // 메서드(method): 객체가 할 수 있는 동작 (static 이 없다!)
    public double Average()
    {
        return (Korean + English) / 2.0;      // 자기 자신의 필드를 그대로 쓴다
    }

    public void Print()
    {
        Console.WriteLine($"{Name}: 국어 {Korean}, 영어 {English}, 평균 {Average():F1}");
    }
}

class Program
{
    static void Main()
    {
        Student s1 = new Student();           // 설계도(클래스)로 객체를 만든다
        s1.Name = "홍길동";                   // 변수.필드 = 값
        s1.Korean = 90;
        s1.English = 80;

        Student s2 = new Student();           // 같은 설계도로 두 번째 객체
        s2.Name = "김영희";
        s2.Korean = 100;
        s2.English = 95;

        s1.Print();                           // 변수.메서드()
        s2.Print();
        Console.WriteLine($"두 학생의 평균 차이: {s2.Average() - s1.Average():F1}");
    }
}`, expect: `홍길동: 국어 90, 영어 80, 평균 85.0
김영희: 국어 100, 영어 95, 평균 97.5
두 학생의 평균 차이: 12.5`, desc: '<code>s1</code> 과 <code>s2</code> 는 <b>같은 설계도로 만든 서로 다른 객체</b>입니다. <code>s1.Print()</code> 안에서 쓰는 <code>Name</code> 은 s1 의 이름, <code>s2.Print()</code> 안에서는 s2 의 이름입니다. 메서드에 <code>static</code> 이 없다는 점을 눈여겨보세요 — <b>어느 객체의</b> 데이터로 일할지 정해져야 하므로 반드시 객체를 통해 호출합니다. <code>public</code> 은 “클래스 밖에서도 쓸 수 있다”는 뜻으로, 다음 교시에서 자세히 배웁니다.' },
          { type: 'callout', kind: 'tip', title: '클래스와 객체, 용어 정리', html: '<ul><li><b>클래스</b>를 <b>정의</b>한다(define) — 설계도를 그린다. 코드에 한 번.</li><li><b>객체</b>를 <b>생성</b>한다(create, instantiate) — <code>new</code> 로 찍어 낸다. 필요한 만큼 몇 번이든.</li><li>클래스 안의 필드와 메서드를 통틀어 <b>멤버(member)</b>라고 부릅니다.</li><li><code>Program</code> 도 클래스이고 <code>string</code>, <code>Console</code>, <code>List&lt;int&gt;</code> 도 모두 누군가 만들어 둔 클래스입니다. 지금까지 우리는 남이 만든 클래스를 써 왔고, 이제 직접 만듭니다.</li></ul>' },
          { type: 'h', text: 'this — 객체 자기 자신' },
          { type: 'p', html: '메서드 안에서 <b><code>this</code></b> 는 <b>“지금 이 메서드를 호출한 그 객체”</b>를 가리킵니다. <code>s1.Print()</code> 안에서 <code>this</code> 는 s1 입니다. 보통은 생략해도 되지만, <b>매개변수 이름이 필드 이름과 같을 때</b>는 <code>this.x</code> 로 필드임을 분명히 해야 합니다.' },
          { type: 'code', title: '예제 8-2. this 로 필드와 매개변수 구분하기', code: `using System;

class Point
{
    public int x;
    public int y;

    public void Set(int x, int y)
    {
        this.x = x;          // this.x 는 필드, x 는 매개변수
        this.y = y;          // this. 를 빼면 x = x; 가 되어 매개변수에 자기 값을 넣을 뿐 (필드는 그대로)
    }

    public void Move(int dx, int dy)
    {
        x += dx;             // 이름이 겹치지 않으면 this. 를 생략해도 된다 (this.x += dx; 와 같다)
        y += dy;
    }

    public void Print()
    {
        Console.WriteLine($"({x}, {y})");
    }
}

class Program
{
    static void Main()
    {
        Point p = new Point();
        p.Set(3, 4);
        p.Print();
        p.Move(1, -2);
        p.Print();

        Point q = new Point();    // 값을 넣지 않은 필드는 기본값 (int 는 0)
        q.Print();
    }
}`, expect: `(3, 4)
(4, 2)
(0, 0)`, desc: '필드는 지역 변수와 달리 <b>초기화하지 않아도 자료형의 기본값</b>(숫자 0, bool false, 참조 형식 null)을 가집니다. 그래서 <code>q.Print()</code> 가 <code>(0, 0)</code> 을 출력합니다. <code>Set</code> 에서 <code>this.</code> 를 지우면 컴파일러가 “같은 변수에 대입했습니다(CS1717)” 경고를 내고 필드는 바뀌지 않습니다 — 직접 지워서 실험해 보세요.' },
          { type: 'h', text: '생성자 (constructor)' },
          { type: 'p', html: '예제 8-1 에서는 객체를 만든 뒤 필드를 하나씩 채웠습니다. 빠뜨리기 쉽고 번거롭습니다. <b>생성자</b>는 <b><code>new</code> 로 객체를 만드는 순간 자동으로 실행되는 특별한 메서드</b>로, 필드의 초기값을 한 번에 넣는 데 씁니다. 규칙은 두 가지: <b>이름이 클래스 이름과 같고</b>, <b>반환형을 쓰지 않습니다</b>(void 도 안 씀).' },
          { type: 'list', items: [
            '<b>기본 생성자</b>: 매개변수가 없는 생성자. 생성자를 하나도 안 만들면 컴파일러가 빈 기본 생성자를 몰래 만들어 줍니다(그래서 예제 8-1 의 <code>new Student()</code> 가 됐습니다). <b>다른 생성자를 하나라도 만들면 이 자동 생성은 사라집니다.</b>',
            '<b>매개변수가 있는 생성자</b>: <code>new Book("제목", "저자", 25000)</code> 처럼 값을 넘겨 받아 필드에 넣습니다.',
            '<b>오버로딩(overloading)</b>: 매개변수 개수나 자료형이 다르면 같은 이름의 생성자를 여러 개 둘 수 있습니다(6장 메서드 오버로딩과 같음).',
            '<b>생성자 체인 <code>: this(...)</code></b>: 한 생성자가 다른 생성자를 먼저 호출해 코드 중복을 없앱니다.'
          ] },
          { type: 'code', title: '예제 8-3. 생성자 — 기본 · 매개변수 · 오버로딩 · 체인', code: `using System;

class Book
{
    public string Title;
    public string Author;
    public int Price;

    // ① 기본 생성자 (매개변수 없음): 클래스 이름과 같고 반환형이 없다
    public Book()
    {
        Title = "제목 없음";
        Author = "미상";
        Price = 0;
    }

    // ② 매개변수 3개 — 같은 이름의 생성자가 여러 개: 오버로딩
    public Book(string title, string author, int price)
    {
        Title = title;
        Author = author;
        Price = price;
    }

    // ③ 매개변수 2개 — : this(...) 로 ② 를 먼저 호출 (생성자 체인), 가격은 기본 10000
    public Book(string title, string author) : this(title, author, 10000)
    {
        Console.WriteLine($"[{title}] 가격을 지정하지 않아 기본값을 씁니다");
    }

    public void Print()
    {
        Console.WriteLine($"《{Title}》 {Author} 지음, {Price:N0}원");
    }
}

class Program
{
    static void Main()
    {
        Book b1 = new Book();                              // ① 호출
        Book b2 = new Book("C# 입문", "홍길동", 25000);    // ② 호출
        Book b3 = new Book("WPF 첫걸음", "김영희");        // ③ 호출 → 안에서 ② 먼저 실행
        b1.Print();
        b2.Print();
        b3.Print();
    }
}`, expect: `[WPF 첫걸음] 가격을 지정하지 않아 기본값을 씁니다
《제목 없음》 미상 지음, 0원
《C# 입문》 홍길동 지음, 25,000원
《WPF 첫걸음》 김영희 지음, 10,000원`, desc: '<code>new</code> 뒤의 <b>인수 개수와 자료형</b>을 보고 컴파일러가 어느 생성자를 부를지 고릅니다. ③ 은 <code>: this(title, author, 10000)</code> 덕분에 ② 의 본문이 <b>먼저</b> 실행되고 그 다음 ③ 의 본문(안내 메시지)이 실행됩니다. 첫 줄의 안내 메시지가 <code>Print()</code> 보다 먼저 나온 이유는 객체를 만드는 시점(<code>new</code>)에 생성자가 실행되기 때문입니다.' },
          { type: 'callout', kind: 'warn', title: '생성자를 만들었더니 new Book() 이 오류?', html: '매개변수가 있는 생성자를 하나라도 만들면 컴파일러는 더 이상 빈 기본 생성자를 만들어 주지 않습니다. 그래서 <code>new Book()</code> 을 계속 쓰려면 <b>기본 생성자를 직접 써 주어야</b> 합니다. 오류 메시지는 <code>CS1729: \'Book\'에는 인수 0개를 사용하는 생성자가 포함되어 있지 않습니다</code>.' },
          { type: 'h', text: '참조 형식 — 변수에는 객체의 주소가 들어 있다' },
          { type: 'p', html: '<code>int x = 5;</code> 라고 하면 변수 상자 안에 <b>값 5 자체</b>가 들어 있습니다(값 형식, value type). 하지만 <code>Player a = new Player(...)</code> 에서 변수 <code>a</code> 안에는 객체가 통째로 들어 있는 것이 아니라, <b>메모리 어딘가에 만들어진 객체의 주소(참조, reference)</b>가 들어 있습니다. 클래스는 모두 <b>참조 형식(reference type)</b>입니다. 이 차이 때문에 다음 세 가지 현상이 생깁니다.' },
          { type: 'figure', html: SVG_REF, caption: '변수는 이름표, 객체는 실체 — 이름표를 복사하면 같은 객체에 이름표가 두 개 붙는다' },
          { type: 'list', items: [
            '<b><code>Player b = a;</code></b> 는 객체를 복사하지 않고 <b>주소만 복사</b>합니다. 이제 a 와 b 는 <b>같은 객체</b>를 가리키므로 <code>b.Hp = 50</code> 하면 <code>a.Hp</code> 도 50 입니다.',
            '<b><code>==</code> 는 “같은 객체인가”(주소 비교)</b>를 묻습니다. 내용이 똑같아도 따로 <code>new</code> 한 객체끼리는 <code>false</code> 입니다. (<code>string</code> 만 예외적으로 내용을 비교하도록 만들어져 있습니다.)',
            '<b><code>null</code></b> 은 “아무 객체도 가리키지 않음”입니다. null 인 변수로 필드나 메서드를 쓰면 <b>NullReferenceException</b> 이 발생합니다 — C# 에서 가장 흔한 실행 오류입니다.',
            '<b>메서드에 객체를 넘기면</b> 주소가 복사되어 넘어가므로, 메서드 안에서 필드를 바꾸면 <b>원본 객체가 바뀝니다</b>. 값 형식(int)을 넘기면 복사본이 바뀔 뿐입니다.'
          ] },
          { type: 'code', title: '예제 8-4. 참조 형식의 성질 — 같은 객체 · == · null · 메서드에 전달', code: `using System;

class Player
{
    public string Name;
    public int Hp;

    public Player(string name, int hp)
    {
        Name = name;
        Hp = hp;
    }
}

class Program
{
    static void Heal(Player p, int amount)
    {
        p.Hp += amount;          // p 는 원본 객체의 주소 → 원본이 바뀐다
    }

    static void AddTen(int n)
    {
        n += 10;                 // n 은 값의 복사본 → 원본은 그대로
    }

    static void Main()
    {
        Player a = new Player("용사", 100);
        Player b = a;            // 객체가 복사되는 것이 아니라 같은 객체를 가리키는 이름표가 하나 더
        b.Hp = 50;
        Console.WriteLine($"a.Hp = {a.Hp}, b.Hp = {b.Hp}");
        Console.WriteLine($"a == b ? {a == b}");

        Player c = new Player("용사", 50);
        Console.WriteLine($"a == c ? {a == c}");     // 내용이 같아도 다른 객체

        Heal(a, 30);
        Console.WriteLine($"치료 후 a.Hp = {a.Hp}");

        int x = 5;
        AddTen(x);
        Console.WriteLine($"x = {x}");

        Player d = null;         // 아무 객체도 가리키지 않음
        Console.WriteLine($"d == null ? {d == null}");
        // Console.WriteLine(d.Name);   // NullReferenceException! (주석을 풀고 실행해 보세요)
    }
}`, expect: `a.Hp = 50, b.Hp = 50
a == b ? True
a == c ? False
치료 후 a.Hp = 80
x = 5
d == null ? True`, desc: '<code>b.Hp = 50</code> 했는데 <code>a.Hp</code> 가 바뀐 것, <code>Heal(a, 30)</code> 뒤에 원본 a 가 바뀐 것이 참조 형식의 핵심입니다. 반면 <code>AddTen(x)</code> 는 x 에 아무 영향이 없습니다. 마지막 주석을 풀면 <code>NullReferenceException: Object reference not set to an instance of an object</code> 가 납니다 — “객체를 가리키지 않는 변수로 무언가를 하려 했다”는 뜻입니다.' },
          { type: 'callout', kind: 'tip', title: 'NullReferenceException 을 만나면', html: '예외가 난 줄에서 <b>점(.) 앞에 있는 변수</b>가 null 입니다. 그 변수에 <code>new</code> 를 한 적이 있는지, 메서드가 null 을 돌려주지 않았는지 확인하세요. 필드는 초기화하지 않으면 참조 형식이 null 이므로, 클래스 안의 <code>List&lt;T&gt;</code> 필드 등은 <b>생성자에서 <code>new</code></b> 해 두는 습관을 들이세요.' },
          { type: 'h', text: '클래스를 별도 파일로 나누기' },
          { type: 'p', html: '실제 프로젝트에서는 <b>클래스 하나를 파일 하나</b>(<code>Student.cs</code>)에 두는 것이 관례입니다. 같은 프로젝트 안의 파일들은 자동으로 함께 컴파일되므로 <code>using</code> 이나 특별한 연결 없이 다른 파일의 클래스를 그대로 쓸 수 있습니다. 이 강좌의 편집기에서는 <code>// ===== File: 파일이름.cs =====</code> 주석으로 파일을 나눕니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 클래스 파일 추가하기', html: '<ol><li><b>솔루션 탐색기</b>에서 프로젝트 이름을 오른쪽 클릭 → <b>추가</b> → <b>클래스…</b></li><li>이름에 <code>Student.cs</code> 를 입력하고 <b>추가</b>. 파일 이름과 같은 <code>class Student</code> 가 만들어집니다(<code>internal</code> 이 붙어 있으면 그대로 두어도 되고 <code>public</code> 으로 바꾸어도 됩니다).</li><li>필드 · 생성자 · 메서드를 작성하면 <code>Program.cs</code> 의 <code>Main</code> 에서 바로 <code>new Student(...)</code> 를 쓸 수 있습니다.</li><li>편집기에서 <code>prop</code> 을 입력하고 <kbd>Tab</kbd> 두 번, <code>ctor</code> + <kbd>Tab</kbd> 두 번을 누르면 속성 · 생성자 뼈대가 자동으로 만들어집니다(코드 조각).</li></ol>' },
          { type: 'code', title: '예제 8-5. 파일 나누기 — Student.cs 와 Program.cs', code: `// ===== File: Student.cs =====
using System;

class Student
{
    public string Name;
    public int Score;

    public Student(string name, int score)
    {
        Name = name;
        Score = score;
    }

    public string Grade()
    {
        if (Score >= 90) return "A";
        if (Score >= 80) return "B";
        return "C";
    }
}
// ===== File: Program.cs =====
using System;

class Program
{
    static void Main()
    {
        Student[] students =              // 객체를 배열에 담을 수도 있다 (7장)
        {
            new Student("홍길동", 95),
            new Student("김영희", 82),
            new Student("이철수", 70)
        };

        foreach (Student s in students)
        {
            Console.WriteLine($"{s.Name}: {s.Score}점 → {s.Grade()}");
        }
    }
}`, expect: `홍길동: 95점 → A
김영희: 82점 → B
이철수: 70점 → C`, desc: '<code>Program.cs</code> 는 <code>Student</code> 가 어느 파일에 있는지 신경 쓰지 않습니다. 같은 프로젝트(같은 네임스페이스)에 있으면 그냥 보입니다. 7장의 배열 · <code>foreach</code> 와 결합하면 “학생 목록”을 자연스럽게 다룰 수 있습니다 — 다음 교시에는 <code>List&lt;Student&gt;</code> 로 확장합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 값 형식과 참조 형식은 어디에 저장될까', html: '값 형식(int, double, bool, char, 구조체)은 <b>스택(stack)</b>이라는 빠른 메모리에 값 자체가 놓이고, 참조 형식(클래스, 배열, string)의 객체는 <b>힙(heap)</b>에 만들어지며 변수에는 그 주소만 놓입니다. 더 이상 아무 변수도 가리키지 않는 객체는 <b>가비지 컬렉터(GC)</b> 가 알아서 치웁니다(1장). C# 에는 클래스처럼 생겼지만 값 형식으로 동작하는 <code>struct</code>(구조체)와, 값을 바꿀 수 없는 데이터 묶음에 편리한 <code>record</code> 도 있습니다 — 9장에서 소개합니다.' }
        ],
        practice: [
          {
            title: '실습 8-1. Rectangle 클래스 — 넓이와 둘레',
            level: 1,
            desc: '<p>가로(<code>Width</code>)와 세로(<code>Height</code>) 필드를 가진 <code>Rectangle</code> 클래스에 넓이를 돌려주는 <code>Area()</code> 와 둘레를 돌려주는 <code>Perimeter()</code> 메서드를 완성하세요.</p><pre>r1: 넓이 20, 둘레 18\nr2: 넓이 7.5, 둘레 11</pre>',
            hint: '넓이 = <code>Width * Height</code>, 둘레 = <code>2 * (Width + Height)</code>. 메서드 안에서는 필드를 그냥 이름으로 씁니다.',
            starter: `using System;

class Rectangle
{
    public double Width;
    public double Height;

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    public double Area()
    {
        // TODO: 넓이 반환
        return 0;
    }

    public double Perimeter()
    {
        // TODO: 둘레 반환
        return 0;
    }
}

class Program
{
    static void Main()
    {
        Rectangle r1 = new Rectangle(4, 5);
        Rectangle r2 = new Rectangle(2.5, 3);
        Console.WriteLine($"r1: 넓이 {r1.Area()}, 둘레 {r1.Perimeter()}");
        Console.WriteLine($"r2: 넓이 {r2.Area()}, 둘레 {r2.Perimeter()}");
    }
}
`,
            solution: `using System;

class Rectangle
{
    public double Width;
    public double Height;

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    public double Area()
    {
        return Width * Height;
    }

    public double Perimeter()
    {
        return 2 * (Width + Height);
    }
}

class Program
{
    static void Main()
    {
        Rectangle r1 = new Rectangle(4, 5);
        Rectangle r2 = new Rectangle(2.5, 3);
        Console.WriteLine($"r1: 넓이 {r1.Area()}, 둘레 {r1.Perimeter()}");
        Console.WriteLine($"r2: 넓이 {r2.Area()}, 둘레 {r2.Perimeter()}");
    }
}
`,
            expect: `r1: 넓이 20, 둘레 18
r2: 넓이 7.5, 둘레 11`
          },
          {
            title: '실습 8-2. BankAccount — 입금과 출금',
            level: 2,
            desc: '<p>예금주(<code>Owner</code>)와 잔액(<code>Balance</code>)을 가진 <code>BankAccount</code> 클래스를 완성하세요. 생성자는 이미 있으니 두 메서드를 채웁니다.</p><ul><li><code>Deposit(int amount)</code>: 잔액을 늘리고 <code>5,000원 입금 → 잔액 15,000원</code> 출력</li><li><code>Withdraw(int amount)</code>: 잔액보다 많으면 <code>잔액 부족! (잔액 12,000원, 요청 20,000원)</code> 을 출력하고 그만두기, 아니면 잔액을 줄이고 <code>3,000원 출금 → 잔액 12,000원</code> 출력</li></ul><pre>5,000원 입금 → 잔액 15,000원\n3,000원 출금 → 잔액 12,000원\n잔액 부족! (잔액 12,000원, 요청 20,000원)\n홍길동님의 최종 잔액: 12,000원</pre>',
            hint: '천 단위 쉼표는 <code>{amount:N0}</code>. 잔액 부족일 때는 메시지를 출력한 뒤 <code>return;</code> 으로 메서드를 끝냅니다.',
            starter: `using System;

class BankAccount
{
    public string Owner;
    public int Balance;

    public BankAccount(string owner, int balance)
    {
        Owner = owner;
        Balance = balance;
    }

    public void Deposit(int amount)
    {
        // TODO: 잔액 증가 + 출력
    }

    public void Withdraw(int amount)
    {
        // TODO: 잔액 부족 검사, 잔액 감소 + 출력
    }
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount("홍길동", 10000);
        acc.Deposit(5000);
        acc.Withdraw(3000);
        acc.Withdraw(20000);
        Console.WriteLine($"{acc.Owner}님의 최종 잔액: {acc.Balance:N0}원");
    }
}
`,
            solution: `using System;

class BankAccount
{
    public string Owner;
    public int Balance;

    public BankAccount(string owner, int balance)
    {
        Owner = owner;
        Balance = balance;
    }

    public void Deposit(int amount)
    {
        Balance += amount;
        Console.WriteLine($"{amount:N0}원 입금 → 잔액 {Balance:N0}원");
    }

    public void Withdraw(int amount)
    {
        if (amount > Balance)
        {
            Console.WriteLine($"잔액 부족! (잔액 {Balance:N0}원, 요청 {amount:N0}원)");
            return;
        }
        Balance -= amount;
        Console.WriteLine($"{amount:N0}원 출금 → 잔액 {Balance:N0}원");
    }
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount("홍길동", 10000);
        acc.Deposit(5000);
        acc.Withdraw(3000);
        acc.Withdraw(20000);
        Console.WriteLine($"{acc.Owner}님의 최종 잔액: {acc.Balance:N0}원");
    }
}
`,
            expect: `5,000원 입금 → 잔액 15,000원
3,000원 출금 → 잔액 12,000원
잔액 부족! (잔액 12,000원, 요청 20,000원)
홍길동님의 최종 잔액: 12,000원`
          }
        ],
        quiz: [
          { q: '클래스와 객체의 관계를 가장 잘 나타낸 비유는?', options: ['변수와 값', '메서드와 호출', '파일과 폴더', '설계도와 그 설계도로 지은 집'], answer: 3, explain: '클래스는 설계도, 객체(인스턴스)는 설계도대로 실제로 만든 것입니다. 설계도 하나로 집을 여러 채 지을 수 있습니다.' },
          { q: '클래스로 객체를 만들 때 쓰는 키워드는?', options: ['<code>new</code>', '<code>class</code>', '<code>this</code>', '<code>static</code>'], answer: 0, explain: '<code>Student s = new Student();</code> — <code>new</code> 가 메모리에 객체를 만들고 생성자를 실행합니다.' },
          { q: '다음 코드의 출력은?<pre><code>class Point { public int x; }\n...\nPoint p = new Point();\np.x = 1;\nPoint q = p;\nq.x = 9;\nConsole.WriteLine(p.x);</code></pre>', options: ['1', '9', '0', '컴파일 오류'], answer: 1, explain: '<code>q = p</code> 는 주소 복사이므로 p 와 q 는 같은 객체입니다. q 로 바꾸면 p 로 봐도 바뀌어 있습니다.' },
          { q: '생성자에 대한 설명으로 <b>옳은</b> 것은?', options: ['반환형을 <code>void</code> 로 쓴다', '한 클래스에 하나만 만들 수 있다', '<code>new</code> 없이 직접 호출한다', '이름이 클래스 이름과 같고 반환형이 없다'], answer: 3, explain: '생성자는 클래스 이름과 같고 반환형을 쓰지 않으며, 매개변수를 다르게 해 여러 개(오버로딩) 만들 수 있고 <code>new</code> 할 때 자동으로 실행됩니다.' },
          { q: '<code>Student s = null; Console.WriteLine(s.Name);</code> 을 실행하면?', options: ['빈 줄이 출력된다', '"null" 이 출력된다', 'NullReferenceException 이 발생한다', '컴파일 오류가 난다'], answer: 2, explain: 'null 은 아무 객체도 가리키지 않으므로 <code>s.Name</code> 처럼 멤버에 접근하는 순간 실행 오류가 납니다.' }
        ],
        slides: [
          { layout: 'title', title: '클래스 정의와 객체 생성', subtitle: 'Chapter 08 · Section 01 — 설계도와 실체', badge: '08-1',
            notes: '<p><b>[도입 3분]</b> “학생 30명의 이름과 두 과목 점수를 변수로 담으려면 몇 개가 필요할까?” → 90개. 그 변수들을 짝 맞춰 다루는 괴로움을 상상하게 한 뒤, 오늘은 <b>관련 있는 것끼리 묶는 법</b>을 배운다고 안내합니다.</p><p>오늘 목표: 클래스 정의 · new · 필드/메서드 · this · 생성자 · 참조 형식.</p>' },
          { layout: 'bullets', title: '왜 클래스가 필요할까?', lead: '관련 있는 데이터와 동작이 흩어져 있으면 관리가 안 된다',
            bullets: ['학생 1명 = 이름 + 국어 + 영어 → 변수 3개, 30명이면 90개', '평균 메서드에 값을 일일이 넘겨야 함: <code>Average(kor1, eng1)</code>', ['<b>객체 지향</b>: 데이터(필드) + 동작(메서드)을 한 덩어리로', ['<code>Student s1</code> 이 이름 · 점수를 <b>가지고</b>, 평균을 <b>계산한다</b>']], '현실의 “학생”을 코드로 옮긴 것'],
            notes: '<p><b>[4분]</b> 표(변수만 vs 클래스)를 칠판에 그려도 좋습니다. 발문: “수학 과목이 추가되면 변수 방식에서는 무엇을 고쳐야 하나?” → 변수 30개 + 메서드 시그니처. 클래스 방식은 필드 한 줄.</p>' },
          { layout: 'diagram', title: '클래스 = 설계도, 객체 = 실체', html: SVG_CLASS, caption: '설계도는 하나, 객체는 필요한 만큼 — 객체마다 자기만의 값',
            notes: '<p><b>[5분]</b> 붕어빵 틀과 붕어빵. 왼쪽 점선 상자(클래스)는 값이 없고 메모리도 차지하지 않는다는 점, <code>new</code> 화살표를 따라 오른쪽에 실체가 생긴다는 점을 강조. 용어: 객체 = 인스턴스, 필드 + 메서드 = 멤버.</p>' },
          { layout: 'code', title: '예제 8-1. 첫 클래스 Student', code: `using System;

class Student
{
    public string Name;      // 필드: 데이터
    public int Korean, English;

    public double Average()  // 메서드: 동작 (static 없음)
    {
        return (Korean + English) / 2.0;
    }
}

class Program
{
    static void Main()
    {
        Student s1 = new Student();   // 설계도 → 객체
        s1.Name = "홍길동";
        s1.Korean = 90; s1.English = 80;

        Student s2 = new Student();
        s2.Name = "김영희";
        s2.Korean = 100; s2.English = 95;

        Console.WriteLine($"{s1.Name} 평균 {s1.Average()}");
        Console.WriteLine($"{s2.Name} 평균 {s2.Average()}");
    }
}`, points: ['<code>class</code> 안에 필드와 메서드', '<code>new Student()</code> 로 객체 생성', '<code>변수.필드</code>, <code>변수.메서드()</code>', '메서드에 <b>static 이 없다</b> — 객체가 있어야 호출'],
            notes: '<p><b>[7분]</b> 실행 후 “s1.Average() 안의 Korean 은 누구의 Korean?” → s1 의 것. 학생 s3 를 추가해 보게 하세요. 6장 메서드와의 차이(static 유무)를 꼭 짚습니다: static 메서드는 “클래스의 것”, 일반 메서드는 “객체의 것”.</p>' },
          { layout: 'code', title: 'this — 객체 자기 자신', code: `using System;

class Point
{
    public int x, y;

    public void Set(int x, int y)
    {
        this.x = x;   // this.x 필드 ← x 매개변수
        this.y = y;
    }

    public void Move(int dx, int dy)
    {
        x += dx; y += dy;   // 이름이 안 겹치면 this. 생략
    }
}

class Program
{
    static void Main()
    {
        Point p = new Point();
        p.Set(3, 4);
        p.Move(1, -2);
        Console.WriteLine($"({p.x}, {p.y})");   // (4, 2)
    }
}`, points: ['<code>this</code> = 이 메서드를 호출한 그 객체', '필드와 매개변수 이름이 같을 때 <code>this.x</code>', '<code>this.</code> 를 빼면 <code>x = x;</code> (경고 CS1717)', '필드는 기본값(0)으로 시작'],
            notes: '<p><b>[5분]</b> <code>this.</code> 를 지우고 실행해 경고와 (0, 0) 결과를 보여 주면 확실히 기억합니다. “p.Set(3, 4) 안에서 this 는 누구?” → p.</p>' },
          { layout: 'code', title: '생성자 — 만들면서 초기화', code: `using System;

class Book
{
    public string Title, Author;
    public int Price;

    public Book()                                   // ① 기본 생성자
    {
        Title = "제목 없음"; Author = "미상"; Price = 0;
    }
    public Book(string title, string author, int price)   // ② 오버로딩
    {
        Title = title; Author = author; Price = price;
    }
    public Book(string title, string author)        // ③ 생성자 체인
        : this(title, author, 10000) { }

    public void Print() => Console.WriteLine($"《{Title}》 {Author}, {Price:N0}원");
}

class Program
{
    static void Main()
    {
        new Book().Print();
        new Book("C# 입문", "홍길동", 25000).Print();
        new Book("WPF 첫걸음", "김영희").Print();
    }
}`, points: ['이름 = 클래스 이름, <b>반환형 없음</b>', '<code>new</code> 할 때 자동 실행', '매개변수가 다르면 여러 개(오버로딩)', '<code>: this(...)</code> 로 다른 생성자 먼저 호출'],
            notes: '<p><b>[7분]</b> ①을 지우고 <code>new Book()</code> 을 실행해 CS1729 오류를 보여 주세요 — “생성자를 하나라도 만들면 자동 기본 생성자는 사라진다”. ③의 <code>: this(...)</code> 는 “② 를 먼저 부르고 나서 내 본문” 순서임을 강조.</p>' },
          { layout: 'diagram', title: '참조 형식 — 변수에는 주소가 들어 있다', html: SVG_REF, caption: '이름표를 복사하면 같은 객체에 이름표가 두 개',
            notes: '<p><b>[5분]</b> 값 형식(int x = 5)은 상자에 값이, 참조 형식은 상자에 주소가. 발문: “b = a 한 뒤 b.Hp 를 바꾸면 a.Hp 는?” 손들기 투표 후 다음 슬라이드에서 실행으로 확인.</p><p>string 이 == 로 내용 비교되는 것은 특별히 그렇게 만들어진 예외라고 한 줄만.</p>' },
          { layout: 'code', title: '예제 8-4. 같은 객체 · == · null · 메서드 전달', code: `using System;

class Player
{
    public string Name;
    public int Hp;
    public Player(string name, int hp) { Name = name; Hp = hp; }
}

class Program
{
    static void Heal(Player p, int amount) { p.Hp += amount; }
    static void AddTen(int n) { n += 10; }

    static void Main()
    {
        Player a = new Player("용사", 100);
        Player b = a;                 // 같은 객체를 가리킨다
        b.Hp = 50;
        Console.WriteLine($"a.Hp = {a.Hp}");       // 50
        Console.WriteLine(a == new Player("용사", 50));   // False

        Heal(a, 30);
        int x = 5; AddTen(x);
        Console.WriteLine($"a.Hp = {a.Hp}, x = {x}");   // 80, 5

        Player d = null;
        Console.WriteLine(d == null);              // True
    }
}`, points: ['<code>b = a</code>: 주소 복사 → 같은 객체', '<code>==</code> 는 같은 객체인지(주소) 비교', '객체를 넘기면 원본이 바뀐다, int 는 복사본', '<code>null</code>: 가리키는 것이 없음 → <code>d.Name</code> 은 예외'],
            notes: '<p><b>[6분]</b> 실행 결과를 앞 슬라이드 투표와 비교. 마지막에 <code>d.Name</code> 을 출력하는 줄을 추가해 NullReferenceException 을 일부러 보여 주고, “점 앞의 변수가 null” 이라는 읽는 법을 알려 주세요.</p>' },
          { layout: 'two', title: '클래스는 파일 하나에 하나', left: { title: 'Student.cs', code: `class Student
{
    public string Name;
    public int Score;

    public Student(string name, int score)
    {
        Name = name;
        Score = score;
    }
}`, run: false }, right: { title: 'Program.cs', code: `class Program
{
    static void Main()
    {
        Student s = new Student("홍길동", 95);
        Console.WriteLine(s.Name);
    }
}
// 같은 프로젝트 → 그냥 보인다`, run: false },
            notes: '<p><b>[4분]</b> Visual Studio 시연: 솔루션 탐색기 → 추가 → 클래스 → Student.cs. 같은 프로젝트 안의 파일은 연결 작업 없이 서로 보인다는 점. 코드 조각 <code>ctor</code> + Tab Tab, <code>prop</code> + Tab Tab 도 보여 주면 좋아합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>Point p = new Point();  // class Point { public int x; }\np.x = 1;\nPoint q = p;\nq.x = 9;\nConsole.WriteLine(p.x);</code></pre>', options: ['1', '9', '0', '컴파일 오류'], answer: 1, explain: 'q = p 는 주소 복사. p 와 q 는 같은 객체이므로 9.',
            notes: '<p>정답 공개 후 “객체를 진짜로 복사하려면?” → 새로 new 해서 필드를 옮겨야 한다(복사 생성자)고 한 줄 예고.</p>' },
          { layout: 'practice', title: '실습 8-2. BankAccount — 입금과 출금', desc: '<p><code>Deposit</code> 과 <code>Withdraw</code>(잔액 부족 검사)를 완성하세요.</p><pre>5,000원 입금 → 잔액 15,000원\n3,000원 출금 → 잔액 12,000원\n잔액 부족! (잔액 12,000원, 요청 20,000원)\n홍길동님의 최종 잔액: 12,000원</pre>', starter: `using System;

class BankAccount
{
    public string Owner;
    public int Balance;

    public BankAccount(string owner, int balance)
    {
        Owner = owner;
        Balance = balance;
    }

    public void Deposit(int amount)
    {
        // TODO: 잔액 증가 + 출력
    }

    public void Withdraw(int amount)
    {
        // TODO: 잔액 부족 검사, 잔액 감소 + 출력
    }
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount("홍길동", 10000);
        acc.Deposit(5000);
        acc.Withdraw(3000);
        acc.Withdraw(20000);
        Console.WriteLine($"{acc.Owner}님의 최종 잔액: {acc.Balance:N0}원");
    }
}`, solution: `using System;

class BankAccount
{
    public string Owner;
    public int Balance;

    public BankAccount(string owner, int balance)
    {
        Owner = owner;
        Balance = balance;
    }

    public void Deposit(int amount)
    {
        Balance += amount;
        Console.WriteLine($"{amount:N0}원 입금 → 잔액 {Balance:N0}원");
    }

    public void Withdraw(int amount)
    {
        if (amount > Balance)
        {
            Console.WriteLine($"잔액 부족! (잔액 {Balance:N0}원, 요청 {amount:N0}원)");
            return;
        }
        Balance -= amount;
        Console.WriteLine($"{amount:N0}원 출금 → 잔액 {Balance:N0}원");
    }
}

class Program
{
    static void Main()
    {
        BankAccount acc = new BankAccount("홍길동", 10000);
        acc.Deposit(5000);
        acc.Withdraw(3000);
        acc.Withdraw(20000);
        Console.WriteLine($"{acc.Owner}님의 최종 잔액: {acc.Balance:N0}원");
    }
}`,
            notes: '<p><b>[8분]</b> 빨리 끝난 학생은 실습 8-1(Rectangle)도. 다음 교시 예고: “acc.Balance = -100 을 막을 방법이 있을까?” → private 과 속성.</p>' },
          { layout: 'summary', title: '정리', bullets: ['클래스 = 설계도(필드 + 메서드), 객체 = <code>new</code> 로 만든 실체', '객체 메서드에는 <code>static</code> 이 없다 — <code>변수.메서드()</code>', '<code>this</code> = 자기 자신, 필드 · 매개변수 이름이 겹칠 때', '생성자: 클래스 이름 · 반환형 없음 · 오버로딩 · <code>: this(...)</code>', '참조 형식: 주소 복사 · <code>==</code> 는 주소 비교 · <code>null</code> 주의'],
            notes: '<p>학습 목표 4개를 학생에게 한 문장씩 말하게 합니다. 다음 시간: 필드를 숨기고 속성으로 지키기(캡슐화), static, ToString.</p>' }
        ]
      },

      /* ===================== ch08-2 ===================== */
      {
        id: 'ch08-2',
        title: '속성 · 캡슐화 · static · ToString',
        minutes: 50,
        goals: [
          'public / private 접근 제한자와 캡슐화가 필요한 이유를 설명할 수 있다',
          '검증 로직이 있는 속성, 읽기 전용 속성, 자동 구현 속성과 init 을 작성할 수 있다',
          '객체 초기화자와 static 필드 · 메서드 · 생성자, const 와 static readonly 를 사용할 수 있다',
          'ToString() 을 재정의하고 List&lt;T&gt; 에 객체를 담아 처리할 수 있다'
        ],
        flow: [['복습 · 도입: 잘못된 값', 5], ['접근 제한자 · 캡슐화', 8], ['속성 get/set · 자동 구현 · 초기화자', 15], ['static · const', 10], ['ToString · List', 6], ['퀴즈 · 실습', 6]],
        content: [
          { type: 'h', text: '접근 제한자 — public 과 private' },
          { type: 'p', html: '지난 교시의 <code>BankAccount</code> 는 <code>acc.Balance = -100;</code> 처럼 <b>밖에서 아무 값이나 넣을 수 있었습니다</b>. 잔액이 음수인 통장, 나이가 200살인 사람… 클래스가 이런 <b>잘못된 상태</b>가 되는 것을 막아야 합니다. 그 첫걸음이 <b>접근 제한자(access modifier)</b>입니다.' },
          { type: 'table', head: ['제한자', '어디서 쓸 수 있나', '주로 붙이는 곳'], rows: [
            ['<code>public</code>', '어디서든 (클래스 밖에서도)', '밖에 공개할 메서드 · 속성 · 생성자'],
            ['<code>private</code>', '<b>그 클래스 안에서만</b>. 밖에서 쓰면 컴파일 오류 CS0122', '필드, 내부용 도우미 메서드'],
            ['(생략)', '클래스 멤버는 생략하면 <b>private</b>, 클래스 자체는 <code>internal</code>(같은 프로젝트)', '—'],
            ['<code>protected</code>', '그 클래스와 자식 클래스에서', '9장 상속에서']
          ], caption: '접근 제한자 — 필드는 private 로 숨기고, 필요한 통로만 public 으로 연다' },
          { type: 'p', html: '<b>캡슐화(encapsulation)</b> 는 데이터(필드)를 <code>private</code> 로 숨기고, <b>검사가 붙은 public 통로</b>로만 읽고 쓰게 하는 것입니다. 알약(캡슐)이 약 성분을 감싸듯 객체가 자기 데이터를 감싸 보호합니다. 통로에서 잘못된 값을 걸러 내면 객체는 <b>언제나 올바른 상태</b>를 유지합니다.' },
          { type: 'code', title: '예제 8-6. private 필드와 getter · setter 메서드', code: `using System;

class Person
{
    public string Name;
    private int age;                     // private: 클래스 밖에서는 보이지 않는다

    public void SetAge(int value)        // setter 메서드: 검사한 뒤 넣는다
    {
        if (value < 0 || value > 150)
        {
            Console.WriteLine($"잘못된 나이: {value} (무시)");
            return;
        }
        age = value;
    }

    public int GetAge()                  // getter 메서드: 값을 돌려준다
    {
        return age;
    }
}

class Program
{
    static void Main()
    {
        Person p = new Person();
        p.Name = "홍길동";
        p.SetAge(20);
        Console.WriteLine($"{p.Name}, {p.GetAge()}세");

        p.SetAge(-5);                    // 검사에 걸려 거부된다
        Console.WriteLine($"{p.Name}, {p.GetAge()}세");

        // p.age = -5;   // 컴파일 오류 CS0122: 'Person.age'은(는) 보호 수준 때문에 액세스할 수 없습니다
    }
}`, expect: `홍길동, 20세
잘못된 나이: -5 (무시)
홍길동, 20세`, desc: '<code>age</code> 는 <code>private</code> 이므로 <code>Main</code> 에서 <code>p.age</code> 라고 쓰면 <b>컴파일 오류</b>입니다(주석을 풀어 확인해 보세요). 밖에서는 <code>SetAge</code>/<code>GetAge</code> 라는 <b>문</b>을 통해서만 드나들 수 있고, 문지기가 -5 같은 값을 돌려보냅니다. 관례상 private 필드 이름은 <b>소문자(camelCase)</b> 로, public 멤버는 <b>PascalCase</b> 로 씁니다.' },
          { type: 'h', text: '속성 (property) — 필드처럼 쓰는 getter · setter' },
          { type: 'p', html: '<code>GetAge()</code> · <code>SetAge()</code> 는 잘 동작하지만 <code>p.SetAge(p.GetAge() + 1)</code> 처럼 쓰기가 불편합니다. C# 의 <b>속성(property)</b>은 <b>겉으로는 필드처럼 <code>p.Age = 20</code>, <code>p.Age + 1</code> 로 쓰지만 속으로는 <code>get</code>/<code>set</code> 블록이 실행되는</b> 멤버입니다. 필드의 편리함과 메서드의 검사 기능을 합친 것입니다.' },
          { type: 'figure', html: SVG_PROP, caption: '속성 = private 필드를 지키는 문지기. 대입하면 set(검사), 읽으면 get 이 실행된다' },
          { type: 'code', title: '예제 8-7. 속성 — get / set · 검증 · 읽기 전용', code: `using System;

class Person
{
    private string name;                 // 속성이 감싸는 private 필드 (backing field)
    private int age;

    public string Name                   // 속성(property): 이름은 PascalCase
    {
        get { return name; }             // p.Name 을 읽을 때 실행
        set { name = value; }            // p.Name = ... 일 때 실행, value = 대입되는 값
    }

    public int Age
    {
        get { return age; }
        set
        {
            if (value < 0 || value > 150)
            {
                Console.WriteLine($"잘못된 나이: {value} (무시)");
                return;
            }
            age = value;
        }
    }

    public bool IsAdult                  // get 만 있는 읽기 전용 속성 (저장하지 않고 계산)
    {
        get { return age >= 19; }
    }

    public string Info => $"{name} ({age}세)";   // 식 본문(=>) 으로 짧게 쓴 읽기 전용 속성
}

class Program
{
    static void Main()
    {
        Person p = new Person();
        p.Name = "홍길동";          // set 실행 (value = "홍길동")
        p.Age = 20;                 // set 실행 — 필드처럼 보이지만 검사가 돌아간다
        Console.WriteLine(p.Name + ", " + p.Age);   // get 실행
        Console.WriteLine($"성인? {p.IsAdult}");

        p.Age = 200;                // set 안의 검사에 걸린다
        p.Age += 1;                 // get 으로 20 을 읽고 +1 한 21 을 set
        Console.WriteLine(p.Info);
        // p.IsAdult = false;       // 오류 CS0200: 읽기 전용 속성에는 대입할 수 없습니다
    }
}`, expect: `홍길동, 20
성인? True
잘못된 나이: 200 (무시)
홍길동 (21세)`, desc: '<code>set</code> 블록 안의 <b><code>value</code></b> 는 “대입되는 값”을 뜻하는 예약어입니다. <code>p.Age += 1</code> 은 <code>p.Age = p.Age + 1</code> 이므로 get 이 먼저, set 이 나중에 실행됩니다. <code>get</code> 만 두면 <b>읽기 전용</b>이 되고, <code>IsAdult</code> 처럼 필드 없이 <b>계산해서 돌려주는</b> 속성도 흔합니다. WPF 의 데이터 바인딩(Part 2)은 바로 이 속성을 화면과 연결합니다.' },
          { type: 'h', text: '자동 구현 속성 · init · 객체 초기화자' },
          { type: 'p', html: '검사할 것이 없는 속성까지 필드 + get + set 을 다 쓰면 코드가 길어집니다. <b>자동 구현 속성(auto-implemented property)</b> <code>public string Name { get; set; }</code> 한 줄이면 컴파일러가 숨은 필드를 대신 만들어 줍니다. <b>실무 클래스의 속성 대부분이 이 형태</b>입니다.' },
          { type: 'table', head: ['형태', '의미'], rows: [
            ['<code>public int Grade { get; set; }</code>', '읽기 · 쓰기 모두 가능한 자동 구현 속성'],
            ['<code>public int Grade { get; set; } = 1;</code>', '초기값 지정'],
            ['<code>public string Id { get; init; }</code>', '<b>객체를 만들 때만</b>(생성자 · 초기화자) 넣을 수 있고 그 뒤로는 못 바꿈 (C# 9)'],
            ['<code>public int Score { get; private set; }</code>', '밖에서는 읽기만, <b>클래스 안에서만</b> 쓰기'],
            ['<code>public int Score { get; }</code>', '읽기 전용 — 생성자에서만 넣을 수 있음'],
            ['<code>new Student { Name = "홍길동", Grade = 2 }</code>', '<b>객체 초기화자</b>: 만들면서 속성에 값을 넣음 (set 또는 init 필요)']
          ] },
          { type: 'code', title: '예제 8-8. 자동 구현 속성과 객체 초기화자', code: `using System;

class Student
{
    public string Name { get; set; }           // 자동 구현 속성: 숨은 필드를 컴파일러가 만든다
    public int Grade { get; set; } = 1;        // 초기값 1
    public string Id { get; init; }            // init: 만들 때만 넣을 수 있다
    public int Score { get; private set; }     // 밖에서는 읽기만, 안에서는 쓰기 가능

    public void AddScore(int n)
    {
        Score += n;                            // 클래스 안이므로 private set 사용 가능
    }
}

class Program
{
    static void Main()
    {
        // 객체 초기화자: new 뒤 { } 안에서 속성에 값을 넣는다
        Student s1 = new Student { Name = "홍길동", Grade = 2, Id = "2024001" };
        Student s2 = new Student { Name = "김영희", Id = "2024002" };   // Grade 는 초기값 1

        s1.AddScore(90);
        s2.AddScore(85);
        s2.AddScore(10);

        Console.WriteLine($"{s1.Id} {s1.Name} {s1.Grade}학년 {s1.Score}점");
        Console.WriteLine($"{s2.Id} {s2.Name} {s2.Grade}학년 {s2.Score}점");

        s1.Grade = 3;                 // set 이 있으니 언제든 바꿀 수 있다
        // s1.Id = "X";               // 오류 CS8852: init 속성은 만든 뒤에 바꿀 수 없다
        // s1.Score = 100;            // 오류 CS0272: set 이 private 이라 밖에서 못 쓴다
        Console.WriteLine($"{s1.Name} → {s1.Grade}학년");
    }
}`, expect: `2024001 홍길동 2학년 90점
2024002 김영희 1학년 95점
홍길동 → 3학년`, desc: '객체 초기화자 <code>new Student { … }</code> 는 기본 생성자를 부른 뒤 중괄호 안의 속성을 차례로 <b>set(또는 init)</b> 합니다. 어떤 값을 넣는지 이름이 보여서 읽기 쉽고, 생성자를 여러 개 만들 필요가 줄어듭니다. <code>Id</code> 처럼 한 번 정해지면 바뀌면 안 되는 값은 <code>init</code>, <code>Score</code> 처럼 클래스가 스스로 관리하는 값은 <code>private set</code> 이 알맞습니다.' },
          { type: 'callout', kind: 'tip', title: '필드는 언제, 속성은 언제?', html: '<b>클래스 밖에 공개하는 데이터는 속성</b>으로, 클래스 안에서만 쓰는 데이터는 <b>private 필드</b>로 만드는 것이 C# 의 관례입니다. 처음엔 <code>{ get; set; }</code> 자동 구현으로 시작하고, 나중에 검사가 필요해지면 그때 필드 + get/set 형태로 바꾸어도 <b>쓰는 쪽 코드는 그대로</b>(<code>p.Age = 20</code>)라는 것이 속성의 큰 장점입니다.' },
          { type: 'h', text: 'static — 객체가 아니라 클래스에 속하는 멤버' },
          { type: 'p', html: '지금까지의 필드는 <b>객체마다 하나씩</b> 있었습니다(s1 의 Name, s2 의 Name). 그런데 “지금까지 만든 학생 수” 같은 값은 특정 객체의 것이 아니라 <b>클래스 전체에 하나</b>만 있어야 합니다. 이런 멤버에 <b><code>static</code></b> 을 붙입니다. static 멤버는 객체 없이 <b><code>클래스이름.멤버</code></b> 로 씁니다 — <code>Math.Max</code>, <code>Console.WriteLine</code>, <code>int.Parse</code> 가 모두 그랬습니다.' },
          { type: 'table', head: ['', '인스턴스 멤버 (static 없음)', 'static 멤버'], rows: [
            ['소속', '객체 하나하나', '클래스 (모든 객체가 공유)'],
            ['개수', '객체 수만큼', '딱 하나'],
            ['접근', '<code>s1.Name</code>', '<code>Student.Count</code>'],
            ['메서드 안에서', '필드 · this · static 멤버 모두 사용 가능', '<b>인스턴스 필드 · this 사용 불가</b> (어느 객체인지 모르므로) CS0120'],
            ['예', '<code>s1.Average()</code>', '<code>Math.Max(a, b)</code>, <code>Console.WriteLine()</code>, <code>Main()</code>']
          ] },
          { type: 'code', title: '예제 8-9. static 필드 · 메서드 · 생성자로 객체 수 세기, const 와 static readonly', code: `using System;

class Student
{
    public static int Count;                   // static 필드: 클래스에 하나, 모든 객체가 공유
    public static readonly string School;      // static readonly: 실행 중 한 번(정적 생성자에서) 정해진다
    public const int MaxScore = 100;           // const: 컴파일할 때 값이 정해지는 상수 (자동으로 static)

    public string Name;                        // 인스턴스 필드: 객체마다 하나
    public int No;                             // 몇 번째로 만들어졌는지

    static Student()                           // 정적 생성자: 클래스를 처음 쓸 때 딱 한 번 실행
    {
        School = "코딩고등학교";
        Console.WriteLine("정적 생성자 실행");
    }

    public Student(string name)
    {
        Name = name;
        Count++;                               // 객체가 만들어질 때마다 1 증가
        No = Count;
    }

    public static void PrintCount()            // static 메서드: 객체 없이 클래스 이름으로 호출
    {
        Console.WriteLine($"{School} 학생 수: {Count}명");
        // Console.WriteLine(Name);            // 오류 CS0120: 어느 객체의 Name 인지 알 수 없다
    }
}

class Program
{
    static void Main()
    {
        Student a = new Student("홍길동");     // 처음 쓰는 순간 정적 생성자가 먼저 실행된다
        Student b = new Student("김영희");
        Student c = new Student("이철수");
        Console.WriteLine($"{a.Name}: {a.No}번, {b.Name}: {b.No}번, {c.Name}: {c.No}번");
        Student.PrintCount();                  // 클래스 이름으로 호출
        Console.WriteLine($"만점: {Student.MaxScore}");
        Console.WriteLine(Math.Max(3, 7));     // Math 의 메서드도 모두 static
    }
}`, expect: `정적 생성자 실행
홍길동: 1번, 김영희: 2번, 이철수: 3번
코딩고등학교 학생 수: 3명
만점: 100
7`, desc: '<code>Count</code> 는 셋이 공유하므로 생성자가 실행될 때마다 1, 2, 3 으로 늘어나고, 각 객체는 그 순간의 값을 자기 <code>No</code> 에 기억합니다. <code>Main</code> 이 <code>static</code> 인 이유도 이제 설명됩니다 — 프로그램이 시작될 때는 <b>아직 아무 객체도 없으므로</b> 객체 없이 부를 수 있어야 합니다.' },
          { type: 'table', head: ['', '<code>const</code>', '<code>static readonly</code>', '<code>readonly</code> (인스턴스)'], rows: [
            ['값이 정해지는 때', '<b>컴파일할 때</b>', '실행 중 한 번 (선언 시 또는 정적 생성자)', '객체마다 생성자에서 한 번'],
            ['넣을 수 있는 값', '숫자 · 문자열 · bool 리터럴만', '어떤 식이든 (<code>new</code>, 메서드 호출 가능)', '어떤 식이든'],
            ['예', '<code>const double Pi = 3.14159;</code>', '<code>static readonly DateTime Start = DateTime.Now;</code>', '<code>readonly string id;</code>'],
            ['고를 때', '진짜 상수(원주율, 최대 개수)', '실행 시점에 계산되는 고정값, 객체 상수', '객체가 만들어진 뒤 안 바뀌는 값']
          ], caption: 'const 와 readonly — 둘 다 “바뀌지 않는 값”이지만 정해지는 시점이 다르다' },
          { type: 'h', text: 'ToString() 재정의 — 객체를 출력하는 방법 정하기' },
          { type: 'p', html: '<code>Console.WriteLine(s)</code> 처럼 객체를 바로 출력하면 C# 은 그 객체의 <b><code>ToString()</code></b> 메서드를 호출합니다. 모든 클래스는 이 메서드를 물려받는데(9장 상속), 기본 동작은 <b>클래스 이름만</b> 돌려주는 것이라 별로 쓸모가 없습니다. <b><code>public override string ToString()</code></b> 으로 <b>재정의(override)</b>하면 원하는 모양으로 출력됩니다. 문자열 보간 <code>$"{s}"</code>, <code>string.Join</code>, 디버거의 값 표시에도 모두 쓰입니다.' },
          { type: 'code', title: '예제 8-10. ToString 재정의와 List<Student>', code: `using System;
using System.Collections.Generic;

class Dog { }                                  // ToString 을 재정의하지 않은 클래스

class Student
{
    public string Name { get; set; }
    public int Score { get; set; }

    public Student(string name, int score)
    {
        Name = name;
        Score = score;
    }

    public override string ToString()          // 객체를 문자열로 표현하는 방법을 정한다
    {
        return $"{Name}({Score}점)";
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Dog());          // 재정의가 없으면 클래스 이름만 나온다

        Student s = new Student("홍길동", 90);
        Console.WriteLine(s);                  // ToString() 이 자동으로 호출된다
        Console.WriteLine($"학생: {s}");       // 보간 문자열 안에서도

        List<Student> list = new List<Student>();   // 객체를 담는 목록 (7장)
        list.Add(s);
        list.Add(new Student("김영희", 85));
        list.Add(new Student("이철수", 77));

        Console.WriteLine($"학생 수: {list.Count}");
        foreach (Student st in list)
            Console.WriteLine(st);

        int sum = 0;
        foreach (Student st in list) sum += st.Score;
        Console.WriteLine($"평균: {(double)sum / list.Count:F1}");

        list[1].Score = 100;                   // 목록 안의 객체를 찾아 바꾼다
        Console.WriteLine(list[1]);
        Console.WriteLine(string.Join(", ", list));   // 각 요소의 ToString 을 이어 붙인다
    }
}`, expect: `Dog
홍길동(90점)
학생: 홍길동(90점)
학생 수: 3
홍길동(90점)
김영희(85점)
이철수(77점)
평균: 84.0
김영희(100점)
홍길동(90점), 김영희(100점), 이철수(77점)`, desc: '<code>List&lt;Student&gt;</code> 는 <code>List&lt;int&gt;</code> 와 똑같이 쓰되 요소가 객체일 뿐입니다. <code>list[1].Score = 100</code> 처럼 <b>목록에서 꺼낸 참조로 객체를 바로 고칠 수 있습니다</b>(참조 형식이므로 복사본이 아닙니다). “학생 추가 · 목록 출력 · 평균 계산”은 다음 프로젝트에서 만들 성적 처리 프로그램의 뼈대입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Equals 와 GetHashCode', html: '<code>==</code> 가 주소를 비교한다고 배웠습니다. “학번이 같으면 같은 학생”처럼 <b>내용으로 같음을 판단</b>하고 싶다면 <code>Equals(object)</code> 와 <code>GetHashCode()</code> 를 함께 재정의합니다(<code>List.Contains</code>, <code>Dictionary</code> 키 비교가 이를 사용). 데이터 묶음이라면 C# 9 의 <code>record</code> 가 이 둘과 <code>ToString</code> 을 자동으로 만들어 줍니다 — 9장에서 소개합니다.' }
        ],
        practice: [
          {
            title: '실습 8-3. 온도 속성에 범위 검증 넣기',
            level: 1,
            desc: '<p>실내 온도 조절기 <code>Thermostat</code> 클래스를 완성하세요.</p><ul><li><code>Temperature</code> 속성: 10 ~ 30 사이 값만 받고, 벗어나면 <code>35도는 설정할 수 없습니다 (10~30)</code> 을 출력하고 무시</li><li><code>Fahrenheit</code> 읽기 전용 속성: <code>온도 × 9 / 5 + 32</code></li></ul><pre>현재 20도 = 화씨 68도\n현재 25도 = 화씨 77도\n35도는 설정할 수 없습니다 (10~30)\n5도는 설정할 수 없습니다 (10~30)\n현재 25도 = 화씨 77도</pre>',
            hint: '<code>set { if (value &lt; 10 || value &gt; 30) { …출력…; return; } temperature = value; }</code>. 읽기 전용은 <code>public double Fahrenheit =&gt; temperature * 9 / 5 + 32;</code>',
            starter: `using System;

class Thermostat
{
    private double temperature = 20;

    public double Temperature
    {
        get { return temperature; }
        set
        {
            // TODO: 10~30 범위 검사 (벗어나면 메시지 출력 후 무시)
            temperature = value;
        }
    }

    // TODO: 읽기 전용 속성 Fahrenheit (온도 * 9 / 5 + 32)
    public double Fahrenheit => 0;
}

class Program
{
    static void Main()
    {
        Thermostat t = new Thermostat();
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 25;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 35;
        t.Temperature = 5;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
    }
}
`,
            solution: `using System;

class Thermostat
{
    private double temperature = 20;

    public double Temperature
    {
        get { return temperature; }
        set
        {
            if (value < 10 || value > 30)
            {
                Console.WriteLine($"{value}도는 설정할 수 없습니다 (10~30)");
                return;
            }
            temperature = value;
        }
    }

    public double Fahrenheit => temperature * 9 / 5 + 32;
}

class Program
{
    static void Main()
    {
        Thermostat t = new Thermostat();
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 25;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 35;
        t.Temperature = 5;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
    }
}
`,
            expect: `현재 20도 = 화씨 68도
현재 25도 = 화씨 77도
35도는 설정할 수 없습니다 (10~30)
5도는 설정할 수 없습니다 (10~30)
현재 25도 = 화씨 77도`
          },
          {
            title: '실습 8-4. Ticket — static 으로 발급 번호 매기기',
            level: 2,
            desc: '<p>영화표 <code>Ticket</code> 클래스를 완성하세요.</p><ul><li><code>static int Issued</code>: 지금까지 발급된 표의 수</li><li>생성자에서 <code>Issued</code> 를 1 늘리고, 그 값을 이 표의 <code>Number</code> 로 저장</li><li><code>ToString()</code> 재정의: <code>[1번] 인터스텔라</code> 형태</li></ul><pre>[1번] 인터스텔라\n[2번] 인터스텔라\n[3번] 기생충\n발급된 표: 3장</pre>',
            hint: '<code>Issued++; Number = Issued;</code> — static 필드는 모든 객체가 공유하므로 새 표를 만들 때마다 이어서 늘어납니다. ToString 은 <code>public override string ToString()</code>.',
            starter: `using System;

class Ticket
{
    public static int Issued;      // 발급된 총 개수 (모든 표가 공유)
    public int Number;             // 이 표의 번호
    public string Movie;

    public Ticket(string movie)
    {
        Movie = movie;
        // TODO: Issued 를 1 늘리고 Number 에 저장
    }

    // TODO: ToString() 재정의 → "[1번] 인터스텔라"
}

class Program
{
    static void Main()
    {
        Ticket t1 = new Ticket("인터스텔라");
        Ticket t2 = new Ticket("인터스텔라");
        Ticket t3 = new Ticket("기생충");
        Console.WriteLine(t1);
        Console.WriteLine(t2);
        Console.WriteLine(t3);
        Console.WriteLine($"발급된 표: {Ticket.Issued}장");
    }
}
`,
            solution: `using System;

class Ticket
{
    public static int Issued;      // 발급된 총 개수 (모든 표가 공유)
    public int Number;             // 이 표의 번호
    public string Movie;

    public Ticket(string movie)
    {
        Movie = movie;
        Issued++;
        Number = Issued;
    }

    public override string ToString()
    {
        return $"[{Number}번] {Movie}";
    }
}

class Program
{
    static void Main()
    {
        Ticket t1 = new Ticket("인터스텔라");
        Ticket t2 = new Ticket("인터스텔라");
        Ticket t3 = new Ticket("기생충");
        Console.WriteLine(t1);
        Console.WriteLine(t2);
        Console.WriteLine(t3);
        Console.WriteLine($"발급된 표: {Ticket.Issued}장");
    }
}
`,
            expect: `[1번] 인터스텔라
[2번] 인터스텔라
[3번] 기생충
발급된 표: 3장`
          }
        ],
        quiz: [
          { q: '<code>class Person { private int age; }</code> 일 때, 다른 클래스에서 <code>p.age = 5;</code> 를 쓰면?', options: ['정상적으로 대입된다', '실행 중 예외가 발생한다', '컴파일 오류(CS0122)가 난다', '경고만 나오고 실행된다'], answer: 2, explain: '<code>private</code> 멤버는 그 클래스 안에서만 쓸 수 있습니다. 밖에서 쓰면 컴파일 단계에서 막힙니다.' },
          { q: '속성의 <code>set</code> 블록 안에서 “대입되는 값”을 나타내는 예약어는?', options: ['<code>this</code>', '<code>input</code>', '<code>set</code>', '<code>value</code>'], answer: 3, explain: '<code>p.Age = 20;</code> 이면 set 안에서 <code>value</code> 가 20 입니다.' },
          { q: '다음 코드의 출력은?<pre><code>class C { public static int N; public C() { N++; } }\n...\nnew C(); new C(); new C();\nConsole.WriteLine(C.N);</code></pre>', options: ['3', '1', '0', '컴파일 오류'], answer: 0, explain: '<code>N</code> 은 static 이라 모든 객체가 공유합니다. 생성자가 세 번 실행되어 3.' },
          { q: '<code>Console.WriteLine(obj);</code> 처럼 객체를 출력할 때 자동으로 호출되는 메서드는?', options: ['<code>Print()</code>', '<code>ToString()</code>', '<code>GetType()</code>', '<code>Equals()</code>'], answer: 1, explain: '재정의하지 않으면 클래스 이름이 출력되고, <code>override</code> 하면 원하는 문자열이 출력됩니다.' },
          { q: '<code>public string Id { get; init; }</code> 의 의미는?', options: ['읽기만 가능하고 값을 넣을 방법이 없다', '언제든 값을 바꿀 수 있다', '객체를 만들 때(생성자 · 초기화자)만 값을 넣을 수 있다', 'static 속성이 된다'], answer: 2, explain: '<code>init</code> 은 <code>new Student { Id = "…" }</code> 처럼 만드는 시점에만 허용하고, 그 뒤 <code>s.Id = …</code> 는 컴파일 오류(CS8852)입니다.' }
        ],
        slides: [
          { layout: 'title', title: '속성 · 캡슐화 · static · ToString', subtitle: 'Chapter 08 · Section 02 — 객체를 지키고, 예쁘게 보여 주기', badge: '08-2',
            notes: '<p><b>[도입 3분]</b> 지난 실습 BankAccount 를 띄우고 <code>acc.Balance = -100;</code> 을 추가해 실행. “통장 잔액이 음수가 됐습니다. 누가 막아야 할까요?” → 클래스 스스로 막아야 한다 = 오늘의 캡슐화.</p>' },
          { layout: 'bullets', title: '접근 제한자와 캡슐화', lead: '데이터는 숨기고, 검사가 붙은 통로만 연다',
            bullets: ['<code>public</code>: 어디서든 · <code>private</code>: <b>그 클래스 안에서만</b> (생략 시 private)', '밖에서 private 멤버를 쓰면 컴파일 오류 <b>CS0122</b>', ['<b>캡슐화</b>: private 필드 + public 통로(메서드 · 속성)', ['통로에서 잘못된 값을 걸러 → 객체는 항상 올바른 상태']], '관례: private 필드 camelCase, public 멤버 PascalCase'],
            notes: '<p><b>[5분]</b> 알약(캡슐) 비유. 예제 8-6 을 실행하고 <code>p.age = -5</code> 주석을 풀어 CS0122 를 보여 주세요. “컴파일 오류가 나는 것이 좋은 일” — 실행 전에 실수를 잡아 준다.</p>' },
          { layout: 'code', title: '예제 8-6. private 필드 + getter / setter', code: `using System;

class Person
{
    private int age;                 // 밖에서 안 보임

    public void SetAge(int value)    // 검사 후 저장
    {
        if (value < 0 || value > 150)
        {
            Console.WriteLine($"잘못된 나이: {value}");
            return;
        }
        age = value;
    }
    public int GetAge() { return age; }
}

class Program
{
    static void Main()
    {
        Person p = new Person();
        p.SetAge(20);
        p.SetAge(-5);                // 거부
        Console.WriteLine(p.GetAge());   // 20
        // p.age = -5;   // CS0122 접근 불가
    }
}`, points: ['<code>private</code> 필드는 클래스 안에서만', 'setter 가 문지기: 검사 후 저장', 'getter 로 읽기만 허용', '불편: <code>SetAge(GetAge() + 1)</code>'],
            notes: '<p><b>[5분]</b> 마지막 point 의 불편함을 강조해 다음 슬라이드(속성)로 넘어갑니다. “필드처럼 쓰면서 검사도 하고 싶다.”</p>' },
          { layout: 'diagram', title: '속성 = 필드를 지키는 문지기', html: SVG_PROP, caption: '대입하면 set(검사), 읽으면 get — 겉은 필드, 속은 메서드',
            notes: '<p><b>[4분]</b> 왼쪽 세 문장이 각각 어느 화살표를 타는지 손으로 따라가며. <code>p.Age = 200</code> 이 set 에서 튕겨 나오는 장면을 강조. 금고(private 필드)에는 오직 이 문으로만.</p>' },
          { layout: 'code', title: '예제 8-7. 속성 get / set 과 검증', code: `using System;

class Person
{
    private int age;

    public int Age                       // 속성
    {
        get { return age; }
        set
        {
            if (value < 0 || value > 150) return;   // value = 넣는 값
            age = value;
        }
    }
    public bool IsAdult => age >= 19;    // 읽기 전용(계산)
}

class Program
{
    static void Main()
    {
        Person p = new Person();
        p.Age = 20;          // set
        p.Age = 200;         // 검사에 걸려 무시
        p.Age += 1;          // get → 21 → set
        Console.WriteLine($"{p.Age}세, 성인? {p.IsAdult}");
    }
}`, points: ['<code>p.Age = 20</code> → <b>set</b> 실행, <code>value</code> = 20', '<code>p.Age</code> 읽기 → <b>get</b> 실행', 'get 만 있으면 읽기 전용, <code>=&gt;</code> 로 짧게', 'WPF 바인딩은 속성에 연결된다'],
            notes: '<p><b>[7분]</b> <code>p.Age += 1</code> 이 get 과 set 을 모두 거친다는 것을 순서대로. 발문: “IsAdult 에 false 를 대입하면?” → CS0200. Part 2 예고: 화면의 TextBox 가 속성과 자동으로 연결된다.</p>' },
          { layout: 'code', title: '예제 8-8. 자동 구현 속성 · init · 객체 초기화자', code: `using System;

class Student
{
    public string Name { get; set; }          // 자동 구현 속성
    public int Grade { get; set; } = 1;       // 초기값
    public string Id { get; init; }           // 만들 때만
    public int Score { get; private set; }    // 밖에서는 읽기만

    public void AddScore(int n) { Score += n; }
}

class Program
{
    static void Main()
    {
        Student s = new Student { Name = "홍길동", Id = "2024001" };  // 객체 초기화자
        s.AddScore(90);
        s.Grade = 2;
        // s.Id = "X";      // CS8852 init
        // s.Score = 100;   // CS0272 private set
        Console.WriteLine($"{s.Id} {s.Name} {s.Grade}학년 {s.Score}점");
    }
}`, points: ['<code>{ get; set; }</code> 한 줄 — 숨은 필드는 컴파일러가', '<code>init</code>: 만들 때만, <code>private set</code>: 안에서만', '<code>new X { 속성 = 값, … }</code> 객체 초기화자', '실무 클래스의 속성 대부분이 이 형태'],
            notes: '<p><b>[6분]</b> 주석 두 줄을 풀어 각각의 오류를 확인. 팁: 공개 데이터는 속성, 내부 데이터는 private 필드. 검사가 필요해지면 나중에 get/set 을 풀어 써도 쓰는 쪽은 안 바뀐다.</p>' },
          { layout: 'code', title: '예제 8-9. static — 클래스에 하나', code: `using System;

class Student
{
    public static int Count;              // 클래스에 하나 (공유)
    public const int MaxScore = 100;      // 상수
    public string Name;                   // 객체마다 하나

    public Student(string name)
    {
        Name = name;
        Count++;                          // 만들 때마다 +1
    }

    public static void PrintCount()       // 객체 없이 호출
    {
        Console.WriteLine($"학생 수: {Count}명");
    }
}

class Program
{
    static void Main()
    {
        new Student("홍길동");
        new Student("김영희");
        Student.PrintCount();             // 클래스 이름으로
        Console.WriteLine(Student.MaxScore);
    }
}`, points: ['static 필드: 모든 객체가 공유, 딱 하나', 'static 메서드: <code>클래스이름.메서드()</code>', 'static 안에서는 인스턴스 필드 · this 사용 불가(CS0120)', '<code>Main</code> 이 static 인 이유: 아직 객체가 없다'],
            notes: '<p><b>[6분]</b> “Count 를 static 없이 만들면?” → 객체마다 1. 실행으로 비교. <code>PrintCount</code> 안에 <code>Name</code> 을 출력하는 줄을 넣어 CS0120 도 보여 주세요. Math.Max, Console.WriteLine 이 모두 static 이었다는 것을 연결.</p>' },
          { layout: 'table', title: 'const vs static readonly vs readonly', head: ['', '<code>const</code>', '<code>static readonly</code>', '<code>readonly</code>'], rows: [['정해지는 때', '컴파일할 때', '실행 중 한 번(정적 생성자)', '객체마다 생성자에서'], ['값', '리터럴만', '어떤 식이든', '어떤 식이든'], ['예', '<code>const double Pi</code>', '<code>static readonly DateTime Start</code>', '<code>readonly string id</code>'], ['용도', '진짜 상수', '실행 시 계산되는 고정값', '객체별 고정값']],
            lead: '셋 다 “안 바뀌는 값” — 정해지는 시점이 다르다',
            notes: '<p><b>[3분]</b> 정적 생성자 <code>static Student() { … }</code> 는 클래스를 처음 쓸 때 한 번 실행된다는 것만 짚고 넘어갑니다(예제 8-9 본문 참고).</p>' },
          { layout: 'code', title: '예제 8-10. ToString 재정의 + List<Student>', code: `using System;
using System.Collections.Generic;

class Student
{
    public string Name { get; set; }
    public int Score { get; set; }
    public Student(string name, int score) { Name = name; Score = score; }

    public override string ToString()     // 출력 모양을 정한다
    {
        return $"{Name}({Score}점)";
    }
}

class Program
{
    static void Main()
    {
        List<Student> list = new List<Student>();
        list.Add(new Student("홍길동", 90));
        list.Add(new Student("김영희", 85));
        list[1].Score = 100;                  // 목록 안의 객체를 고친다

        foreach (Student s in list)
            Console.WriteLine(s);             // ToString 자동 호출
        Console.WriteLine(string.Join(", ", list));
    }
}`, points: ['<code>WriteLine(obj)</code> → <code>obj.ToString()</code>', '기본은 클래스 이름만 → <code>override</code> 로 재정의', '<code>List&lt;Student&gt;</code>: 객체 목록', '<code>list[1].Score = 100</code> — 참조라 바로 고쳐진다'],
            notes: '<p><b>[5분]</b> override 줄을 지우고 실행해 “Student” 만 나오는 것을 먼저 보여 주면 효과적. 다음 프로젝트(성적 처리)의 뼈대가 이 코드임을 알려 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>class C { public static int N; public C() { N++; } }\n...\nnew C(); new C(); new C();\nConsole.WriteLine(C.N);</code></pre>', options: ['3', '1', '0', '컴파일 오류'], answer: 0, explain: 'static 필드 N 은 모든 객체가 공유하므로 생성자가 세 번 실행되어 3.',
            notes: '<p>정답 후 “static 을 빼면?” → 컴파일 오류(C.N 은 인스턴스 멤버). 인스턴스 필드는 객체 이름으로만 접근.</p>' },
          { layout: 'practice', title: '실습 8-3. 온도 속성에 범위 검증', desc: '<p><code>Temperature</code> 속성은 10~30 만 허용(벗어나면 <code>35도는 설정할 수 없습니다 (10~30)</code> 출력 후 무시), <code>Fahrenheit</code> 는 읽기 전용(온도 × 9 / 5 + 32).</p><pre>현재 20도 = 화씨 68도\n현재 25도 = 화씨 77도\n35도는 설정할 수 없습니다 (10~30)\n5도는 설정할 수 없습니다 (10~30)\n현재 25도 = 화씨 77도</pre>', starter: `using System;

class Thermostat
{
    private double temperature = 20;

    public double Temperature
    {
        get { return temperature; }
        set
        {
            // TODO: 10~30 범위 검사
            temperature = value;
        }
    }

    public double Fahrenheit => 0;   // TODO
}

class Program
{
    static void Main()
    {
        Thermostat t = new Thermostat();
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 25;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 35;
        t.Temperature = 5;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
    }
}`, solution: `using System;

class Thermostat
{
    private double temperature = 20;

    public double Temperature
    {
        get { return temperature; }
        set
        {
            if (value < 10 || value > 30)
            {
                Console.WriteLine($"{value}도는 설정할 수 없습니다 (10~30)");
                return;
            }
            temperature = value;
        }
    }

    public double Fahrenheit => temperature * 9 / 5 + 32;
}

class Program
{
    static void Main()
    {
        Thermostat t = new Thermostat();
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 25;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
        t.Temperature = 35;
        t.Temperature = 5;
        Console.WriteLine($"현재 {t.Temperature}도 = 화씨 {t.Fahrenheit}도");
    }
}`,
            notes: '<p><b>[7분]</b> 빨리 끝난 학생은 실습 8-4(Ticket, static + ToString)로. 흔한 실수: 검사 뒤 <code>return</code> 을 빼먹어 잘못된 값이 그대로 들어가는 것.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>private</code> 필드 + <code>public</code> 통로 = 캡슐화 (잘못된 값 차단)', '속성 <code>get</code>/<code>set</code>/<code>value</code>, 읽기 전용, <code>{ get; set; }</code> 자동 구현, <code>init</code>', '객체 초기화자 <code>new X { A = 1, B = 2 }</code>', '<code>static</code>: 클래스에 하나, <code>클래스.멤버</code> · <code>const</code> vs <code>static readonly</code>', '<code>override ToString()</code> 으로 출력 모양 결정 · <code>List&lt;T&gt;</code> 에 객체 담기'],
            notes: '<p>다음 시간(9장): 클래스를 물려받는 상속, 같은 이름으로 다르게 동작하는 다형성, 인터페이스. ToString 의 override 가 그 첫 예였습니다.</p>' }
        ]
      }
    ]
  });
})();
