/* Chapter 12. 제네릭 · 구조체 · 열거형 · 비동기 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_GENERIC = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="제네릭 Box&lt;T&gt; 는 설계도, Box&lt;int&gt; 와 Box&lt;string&gt; 은 그 설계도로 찍어 낸 형식">
  <defs><marker id="ah12a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="60" y="150" width="360" height="250" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4" stroke-dasharray="14 8"/>
  <text x="240" y="130" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">설계도 (제네릭 클래스)</text>
  <g style="${MONO};font-size:26px;fill:var(--fg)">
    <text x="90" y="200"><tspan fill="var(--accent)">class</tspan> Box&lt;<tspan fill="var(--warn)" font-weight="700">T</tspan>&gt;</text>
    <text x="90" y="245">{</text>
    <text x="120" y="290"><tspan fill="var(--warn)" font-weight="700">T</tspan> value;</text>
    <text x="120" y="335"><tspan fill="var(--warn)" font-weight="700">T</tspan> Get() { … }</text>
    <text x="90" y="380">}</text>
  </g>
  <text x="240" y="440" text-anchor="middle" style="font-size:22px;fill:var(--muted)">T = 나중에 정해질 자료형의 자리표시자</text>
  <line x1="430" y1="230" x2="600" y2="120" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12a)"/>
  <line x1="430" y1="275" x2="600" y2="275" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12a)"/>
  <line x1="430" y1="320" x2="600" y2="430" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12a)"/>
  <text x="515" y="150" text-anchor="middle" style="font-size:20px;fill:var(--accent)">T = int</text>
  <text x="515" y="262" text-anchor="middle" style="font-size:20px;fill:var(--accent)">T = string</text>
  <text x="515" y="410" text-anchor="middle" style="font-size:20px;fill:var(--accent)">T = Point</text>
  <g>
    <rect x="610" y="60" width="300" height="120" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="760" y="100" text-anchor="middle" style="${MONO};font-size:25px;font-weight:700;fill:var(--accent2)">Box&lt;int&gt;</text>
    <text x="760" y="150" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">42</text>
    <text x="940" y="125" style="font-size:22px;fill:var(--muted)">int 만 들어간다</text>
  </g>
  <g>
    <rect x="610" y="215" width="300" height="120" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="760" y="255" text-anchor="middle" style="${MONO};font-size:25px;font-weight:700;fill:var(--ok)">Box&lt;string&gt;</text>
    <text x="760" y="305" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">"안녕"</text>
    <text x="940" y="280" style="font-size:22px;fill:var(--muted)">string 만 들어간다</text>
  </g>
  <g>
    <rect x="610" y="370" width="300" height="120" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="760" y="410" text-anchor="middle" style="${MONO};font-size:25px;font-weight:700;fill:var(--warn)">Box&lt;Point&gt;</text>
    <text x="760" y="460" text-anchor="middle" style="${MONO};font-size:30px;fill:var(--fg)">(3, 4)</text>
    <text x="940" y="435" style="font-size:22px;fill:var(--muted)">우리가 만든 형식도 OK</text>
  </g>
  <text x="640" y="535" text-anchor="middle" style="font-size:23px;fill:var(--fg)">설계도는 하나, 찍어 낸 형식은 여럿 — 컴파일러가 자료형을 검사하므로 <tspan font-weight="700">캐스트도, 실행 중 형식 오류도 없다</tspan></text>
</svg>`;

  const SVG_VALREF = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="struct 는 복사하면 별개의 상자, class 는 복사하면 같은 객체를 가리킨다">
  <defs><marker id="ah12b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="330" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">struct (값 형식) — 복사하면 별개의 상자</text>
  <text x="140" y="100" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">p1</text>
  <rect x="50" y="110" width="180" height="120" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="140" y="160" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">X = 1</text>
  <text x="140" y="205" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">Y = 2</text>
  <line x1="240" y1="170" x2="390" y2="170" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12b)"/>
  <text x="318" y="155" text-anchor="middle" style="font-size:20px;fill:var(--accent)">값을 통째로 복사</text>
  <text x="490" y="100" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--ok)">p2</text>
  <rect x="400" y="110" width="180" height="120" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="490" y="160" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">X = <tspan fill="var(--danger)" font-weight="700">100</tspan></text>
  <text x="490" y="205" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">Y = 2</text>
  <text x="315" y="290" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Point p2 = p1;   p2.X = 100;</text>
  <text x="315" y="330" text-anchor="middle" style="font-size:22px;fill:var(--muted)">p1.X 는 여전히 1 — 서로 영향을 주지 않는다</text>
  <line x1="640" y1="30" x2="640" y2="420" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="960" y="50" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">class (참조 형식) — 복사하면 같은 객체를 가리킴</text>
  <text x="760" y="100" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">c1</text>
  <rect x="690" y="110" width="140" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="760" y="155" text-anchor="middle" style="font-size:22px;fill:var(--muted)">참조(주소)</text>
  <text x="760" y="230" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">c2</text>
  <rect x="690" y="240" width="140" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="760" y="285" text-anchor="middle" style="font-size:22px;fill:var(--muted)">참조(주소)</text>
  <line x1="835" y1="145" x2="985" y2="190" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12b)"/>
  <line x1="835" y1="275" x2="985" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah12b)"/>
  <rect x="1000" y="140" width="220" height="130" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="1110" y="130" text-anchor="middle" style="font-size:20px;fill:var(--warn)">힙(heap)에 있는 객체 하나</text>
  <text x="1110" y="190" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">X = <tspan fill="var(--danger)" font-weight="700">100</tspan></text>
  <text x="1110" y="240" text-anchor="middle" style="${MONO};font-size:26px;fill:var(--fg)">Y = 2</text>
  <text x="960" y="345" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">PointClass c2 = c1;   c2.X = 100;</text>
  <text x="960" y="385" text-anchor="middle" style="font-size:22px;fill:var(--muted)">c1.X 도 100 — 둘은 같은 객체를 가리키므로</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)"><tspan font-weight="700">struct</tspan> 는 작고 단순한 데이터(좌표 · 색 · 날짜)에, <tspan font-weight="700">class</tspan> 는 그 밖의 대부분에</text>
  <text x="640" y="520" text-anchor="middle" style="font-size:21px;fill:var(--muted)">int · double · bool · DateTime · 튜플은 값 형식(struct), string · 배열 · List · 우리가 만든 class 는 참조 형식</text>
</svg>`;

  const SVG_CAFE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="카페 직원 한 명이 동기 방식과 비동기 방식으로 주문을 처리하는 시간표">
  <defs><marker id="ah12c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <text x="640" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">카페 직원 한 명 = 스레드 하나 (같은 손님 3명, 커피 한 잔 내리는 데 3분)</text>
  <text x="40" y="128" style="font-size:24px;font-weight:700;fill:var(--danger)">동기(sync)</text>
  <text x="40" y="156" style="font-size:19px;fill:var(--muted)">기다리며 멈춤</text>
  <rect x="200" y="95" width="80" height="60" rx="8" fill="var(--danger)" opacity="0.85"/>
  <text x="240" y="132" text-anchor="middle" style="font-size:19px;fill:#fff">주문 1</text>
  <rect x="280" y="95" width="240" height="60" rx="8" fill="var(--card)" stroke="var(--danger)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="400" y="132" text-anchor="middle" style="font-size:19px;fill:var(--danger)">커피 1 … 멍하니 기다림</text>
  <rect x="520" y="95" width="80" height="60" rx="8" fill="var(--danger)" opacity="0.85"/>
  <text x="560" y="132" text-anchor="middle" style="font-size:19px;fill:#fff">주문 2</text>
  <rect x="600" y="95" width="240" height="60" rx="8" fill="var(--card)" stroke="var(--danger)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="720" y="132" text-anchor="middle" style="font-size:19px;fill:var(--danger)">커피 2 … 기다림</text>
  <rect x="840" y="95" width="80" height="60" rx="8" fill="var(--danger)" opacity="0.85"/>
  <text x="880" y="132" text-anchor="middle" style="font-size:19px;fill:#fff">주문 3</text>
  <rect x="920" y="95" width="240" height="60" rx="8" fill="var(--card)" stroke="var(--danger)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="1040" y="132" text-anchor="middle" style="font-size:19px;fill:var(--danger)">커피 3 … 기다림</text>
  <text x="1175" y="132" style="font-size:20px;font-weight:700;fill:var(--danger)">≈ 12분</text>
  <text x="40" y="258" style="font-size:24px;font-weight:700;fill:var(--ok)">비동기(async)</text>
  <text x="40" y="286" style="font-size:19px;fill:var(--muted)">맡기고 다음 일</text>
  <rect x="200" y="225" width="80" height="60" rx="8" fill="var(--ok)" opacity="0.9"/>
  <text x="240" y="262" text-anchor="middle" style="font-size:19px;fill:#fff">주문 1</text>
  <rect x="280" y="225" width="80" height="60" rx="8" fill="var(--ok)" opacity="0.9"/>
  <text x="320" y="262" text-anchor="middle" style="font-size:19px;fill:#fff">주문 2</text>
  <rect x="360" y="225" width="80" height="60" rx="8" fill="var(--ok)" opacity="0.9"/>
  <text x="400" y="262" text-anchor="middle" style="font-size:19px;fill:#fff">주문 3</text>
  <rect x="440" y="225" width="80" height="60" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/>
  <text x="480" y="262" text-anchor="middle" style="font-size:18px;fill:var(--ok)">다른 일</text>
  <rect x="520" y="225" width="80" height="60" rx="8" fill="var(--accent)" opacity="0.9"/>
  <text x="560" y="262" text-anchor="middle" style="font-size:18px;fill:#fff">전달 1</text>
  <rect x="600" y="225" width="80" height="60" rx="8" fill="var(--accent)" opacity="0.9"/>
  <text x="640" y="262" text-anchor="middle" style="font-size:18px;fill:#fff">전달 2</text>
  <rect x="680" y="225" width="80" height="60" rx="8" fill="var(--accent)" opacity="0.9"/>
  <text x="720" y="262" text-anchor="middle" style="font-size:18px;fill:#fff">전달 3</text>
  <text x="780" y="262" style="font-size:20px;font-weight:700;fill:var(--ok)">≈ 6분</text>
  <text x="40" y="335" style="font-size:19px;fill:var(--muted)">커피 기계(await)</text>
  <rect x="280" y="315" width="240" height="26" rx="6" fill="var(--warn)" opacity="0.6"/>
  <text x="400" y="334" text-anchor="middle" style="font-size:17px;fill:var(--fg)">기계 1: 커피 1 내리는 중</text>
  <rect x="360" y="350" width="240" height="26" rx="6" fill="var(--warn)" opacity="0.6"/>
  <text x="480" y="369" text-anchor="middle" style="font-size:17px;fill:var(--fg)">기계 2: 커피 2 내리는 중</text>
  <rect x="440" y="385" width="240" height="26" rx="6" fill="var(--warn)" opacity="0.6"/>
  <text x="560" y="404" text-anchor="middle" style="font-size:17px;fill:var(--fg)">기계 3: 커피 3 내리는 중</text>
  <line x1="200" y1="440" x2="1180" y2="440" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah12c)"/>
  <text x="1200" y="447" style="font-size:20px;fill:var(--muted)">시간</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:24px;fill:var(--fg)"><tspan style="${MONO}" font-weight="700">await</tspan> = “기계에 맡기고 다음 손님을 받는다” — 기다리는 동안 스레드가 다른 일을 한다</text>
  <text x="640" y="538" text-anchor="middle" style="font-size:21px;fill:var(--muted)">UI 프로그램(WPF)에서 스레드가 멍하니 기다리면(블로킹) 화면이 멈춘다 → “응답 없음”</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch12',
    no: '12',
    title: '제네릭 · 구조체 · 열거형 · 비동기',
    subtitle: 'Generics, Structs, Enums & Async',
    summary: 'C# 기초 파트의 마지막 장입니다. 자료형을 나중에 정하는 제네릭, 값 형식인 구조체, 이름 붙은 상수 열거형, 여러 값을 묶는 튜플과 record, null 을 안전하게 다루는 법을 배우고, 날짜 · 난수 · 비동기 프로그래밍(async/await)으로 WPF 파트를 준비합니다.',
    goals: [
      '제네릭 클래스와 제네릭 메서드를 만들고 제약(where)을 사용할 수 있다',
      'struct(값 형식)와 class(참조 형식)의 복사 동작 차이를 설명할 수 있다',
      'enum · 튜플 · record 를 알맞은 자리에 사용할 수 있다',
      'nullable(?) · ?? · ?. 로 NullReferenceException 을 예방할 수 있다',
      'DateTime · TimeSpan · Random · Stopwatch 를 사용할 수 있다',
      'async · await · Task 로 화면이 멈추지 않는 비동기 코드를 작성할 수 있다'
    ],
    sections: [
      /* ===================== ch12-1 ===================== */
      {
        id: 'ch12-1',
        title: '제네릭 · 구조체 · 열거형 · 튜플 · record · null',
        minutes: 50,
        goals: [
          '제네릭이 필요한 이유(형식 안전 + 재사용)를 설명하고 Box<T> 같은 제네릭 클래스 · 메서드를 만들 수 있다',
          'struct 와 class 의 복사 동작 차이를 그림으로 설명할 수 있다',
          'enum 으로 이름 붙은 상수를 만들고 switch · 정수 변환 · Enum.Parse 를 쓸 수 있다',
          '튜플과 record 로 여러 값을 묶어 돌려주고 비교할 수 있다',
          'int? · ?? · ?. 로 null 을 안전하게 처리할 수 있다'
        ],
        flow: [['도입: 상자 하나로 모든 자료형을?', 5], ['제네릭 클래스 · 메서드 · 제약', 12], ['struct vs class · enum', 12], ['튜플 · record · null', 13], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '제네릭(generic) — 자료형을 나중에 정하는 설계도' },
          { type: 'p', html: '7장에서 쓴 <code>List&lt;int&gt;</code>, <code>Dictionary&lt;string, int&gt;</code> 의 꺾쇠괄호 <code>&lt; &gt;</code> 가 바로 <b>제네릭</b>입니다. <code>List</code> 는 “무엇이든 담는 목록”의 <b>설계도</b>이고, <code>&lt;int&gt;</code> 로 <b>무엇을 담을지</b>를 정하는 것이지요. 이번에는 이런 설계도를 <b>직접 만들어</b> 봅니다.' },
          { type: 'p', html: '왜 필요할까요? “값 하나를 담는 상자” 클래스를 만든다고 합시다. <code>int</code> 용 <code>IntBox</code>, <code>string</code> 용 <code>StringBox</code> … 자료형마다 같은 코드를 복사해야 합니다. 그렇다고 아무거나 담는 <code>object</code> 상자를 만들면, 꺼낼 때마다 캐스트가 필요하고 <b>잘못 꺼내면 실행 중에야 터집니다</b>.' },
          { type: 'code', title: '추가 예제. object 상자의 문제 — 컴파일은 되지만 실행 중 오류', code: `using System;

class ObjectBox
{
    public object Value;          // 무엇이든 담을 수 있다 (int, string, …)
}

class Program
{
    static void Main()
    {
        ObjectBox box = new ObjectBox();
        box.Value = "안녕";                // string 을 넣고
        Console.WriteLine("상자에 넣기 성공");
        int n = (int)box.Value;            // int 로 꺼낸다? 컴파일은 통과… 실행 시 InvalidCastException
        Console.WriteLine(n);
    }
}`, expectError: true, expect: `상자에 넣기 성공`, desc: '<code>object</code> 는 모든 형식의 조상이라 무엇이든 담기지만, 꺼낼 때 <b>캐스트</b>가 필요하고 형식이 맞는지 <b>컴파일러가 검사해 주지 못합니다</b>. 오류는 프로그램을 실행해 봐야 나타납니다. 제네릭은 이 두 문제(복사 · 안전)를 한 번에 해결합니다.' },
          { type: 'figure', html: SVG_GENERIC, caption: '제네릭 클래스 = 자료형 자리에 T 를 써 둔 설계도. Box<int>, Box<string> 은 컴파일러가 만들어 주는 별개의 형식' },
          { type: 'code', title: '예제 12-1. 제네릭 클래스 Box<T> 와 Pair<TKey, TValue>', code: `using System;

class Box<T>                              // T: 형식 매개변수(type parameter)
{
    private T value;
    public Box(T value) { this.value = value; }
    public T Get() { return value; }
    public void Set(T v) { value = v; }
    public void Show() { Console.WriteLine($"[{value}] ({typeof(T).Name})"); }
}

class Pair<TKey, TValue>                  // 형식 매개변수는 여러 개도 가능
{
    public TKey Key { get; }
    public TValue Value { get; }
    public Pair(TKey key, TValue value) { Key = key; Value = value; }
    public override string ToString() => $"{Key} → {Value}";
}

class Program
{
    static void Main()
    {
        Box<int> b1 = new Box<int>(42);           // T = int
        Box<string> b2 = new Box<string>("안녕");  // T = string
        b1.Show();
        b2.Show();
        int n = b1.Get() + 8;                     // 캐스트 없이 바로 int
        Console.WriteLine(n);
        // b1.Set("문자열");                       // 오류 CS1503: Box<int> 에는 int 만!

        Pair<string, int> p = new Pair<string, int>("사과", 1500);
        Console.WriteLine(p);
        Console.WriteLine(p.Key.Length);          // Key 는 string 이므로 Length 사용 가능
        var q = new Pair<int, bool>(7, true);
        Console.WriteLine(q);
    }
}`, expect: `[42] (Int32)
[안녕] (String)
50
사과 → 1500
2
7 → True`, desc: '<code>class Box&lt;T&gt;</code> 의 <b>T</b> 는 “나중에 정해질 자료형”의 자리표시자입니다. <code>new Box&lt;int&gt;(42)</code> 처럼 쓰는 순간 T 가 int 로 채워진 클래스가 만들어집니다. 주석 처리된 <code>b1.Set("문자열")</code> 을 풀어 보세요 — <b>실행 전에</b> 컴파일 오류로 잡아 줍니다. 이름은 관례상 <code>T</code>, 여러 개면 <code>TKey</code>, <code>TValue</code> 처럼 T 로 시작합니다.' },
          { type: 'h', text: '제네릭 메서드와 제약(where)' },
          { type: 'p', html: '클래스 전체가 아니라 <b>메서드 하나만</b> 제네릭으로 만들 수도 있습니다. 메서드 이름 뒤에 <code>&lt;T&gt;</code> 를 붙이고, 호출할 때는 인수를 보고 컴파일러가 T 를 <b>추론</b>하므로 보통 꺾쇠를 생략합니다. 그런데 T 가 무엇인지 모르니 <code>a &gt; b</code> 같은 비교는 할 수 없습니다. 이때 <b><code>where T : IComparable&lt;T&gt;</code></b> 처럼 <b>제약(constraint)</b>을 걸면 “비교할 수 있는 형식만 받는다”고 약속하고 <code>CompareTo</code> 를 쓸 수 있습니다.' },
          { type: 'code', title: '예제 12-2. 제네릭 메서드 Swap<T> · PrintAll<T> · 제약이 있는 Max<T>', code: `using System;
using System.Collections.Generic;

class Program
{
    static void Swap<T>(ref T a, ref T b)          // 어떤 자료형이든 두 값을 바꾼다
    {
        T temp = a;
        a = b;
        b = temp;
    }

    static T Max<T>(T a, T b) where T : IComparable<T>   // 비교 가능한 T 만
    {
        return a.CompareTo(b) >= 0 ? a : b;         // 제약 덕분에 CompareTo 사용 가능
    }

    static void PrintAll<T>(List<T> list)
    {
        foreach (T item in list) Console.Write($"{item} ");
        Console.WriteLine();
    }

    static void Main()
    {
        int x = 1, y = 2;
        Swap(ref x, ref y);                         // T 는 int 로 추론
        Console.WriteLine($"x = {x}, y = {y}");

        string s1 = "왼쪽", s2 = "오른쪽";
        Swap<string>(ref s1, ref s2);               // 직접 지정해도 된다
        Console.WriteLine($"{s1} {s2}");

        Console.WriteLine(Max(3, 7));
        Console.WriteLine(Max(2.5, 1.5));
        Console.WriteLine(Max("apple", "banana"));
        Console.WriteLine(Max('a', 'z'));

        PrintAll(new List<int> { 1, 2, 3 });
        PrintAll(new List<string> { "가", "나" });
    }
}`, expect: `x = 2, y = 1
오른쪽 왼쪽
7
2.5
banana
z
1 2 3
가 나`, desc: '<code>Swap</code> 은 2장 실습에서 int 로 만들었던 것을 <b>모든 자료형용</b>으로 바꾼 것입니다. <code>Max</code> 의 <code>where</code> 를 지우고 실행해 보세요 — <code>CompareTo</code> 를 찾을 수 없다는 컴파일 오류(CS1061)가 납니다. int · double · string · char 는 모두 <code>IComparable&lt;T&gt;</code> 를 구현하고 있어 Max 에 넣을 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 제약의 종류', html: '<ul><li><code>where T : IComparable&lt;T&gt;</code> — 특정 인터페이스를 구현한 형식만</li><li><code>where T : Animal</code> — 특정 클래스(또는 그 자식)만</li><li><code>where T : class</code> / <code>where T : struct</code> — 참조 형식만 / 값 형식만</li><li><code>where T : new()</code> — 매개변수 없는 생성자가 있는 형식만 (<code>new T()</code> 가능)</li></ul>제약은 쉼표로 여러 개를 걸 수 있습니다: <code>where T : class, IComparable&lt;T&gt;, new()</code>. 여러분이 이미 쓰는 <code>List&lt;T&gt;</code> · <code>Dictionary&lt;TKey, TValue&gt;</code> · <code>Func&lt;T, TResult&gt;</code>(11장)도 모두 이렇게 만들어진 제네릭입니다.' },
          { type: 'h', text: '구조체(struct) — 값 형식' },
          { type: 'p', html: '<b>struct(구조체)</b>는 클래스와 거의 똑같이 필드 · 속성 · 메서드 · 생성자를 가질 수 있지만, 결정적인 차이가 하나 있습니다. 클래스는 <b>참조 형식</b>이고 구조체는 <b>값 형식</b>입니다. <code>int</code>, <code>double</code>, <code>bool</code> 처럼 <b>변수 상자 안에 값이 직접</b> 들어 있어서, 다른 변수에 넣으면 <b>값이 통째로 복사</b>됩니다. 실제로 <code>int</code> 의 정체(<code>System.Int32</code>)도 struct 입니다.' },
          { type: 'figure', html: SVG_VALREF, caption: 'struct 를 대입하면 상자가 하나 더 생기고(복사), class 를 대입하면 같은 객체를 가리키는 화살표가 하나 더 생긴다' },
          { type: 'code', title: '예제 12-3. struct Point 와 class 의 복사 동작 비교', code: `using System;

struct Point                                  // 값 형식
{
    public int X;
    public int Y;
    public Point(int x, int y) { X = x; Y = y; }
    public double DistanceTo(Point other)
    {
        int dx = X - other.X, dy = Y - other.Y;
        return Math.Sqrt(dx * dx + dy * dy);
    }
    public override string ToString() => $"({X}, {Y})";
}

class PointClass                              // 참조 형식 (비교용)
{
    public int X;
    public int Y;
    public PointClass(int x, int y) { X = x; Y = y; }
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(1, 2);
        Point p2 = p1;                        // 값 복사: 상자가 하나 더 생긴다
        p2.X = 100;
        Console.WriteLine($"struct: p1 = {p1}, p2 = {p2}");

        PointClass c1 = new PointClass(1, 2);
        PointClass c2 = c1;                   // 참조 복사: 같은 객체를 가리킨다
        c2.X = 100;
        Console.WriteLine($"class : c1.X = {c1.X}, c2.X = {c2.X}");

        Point origin = new Point(0, 0);
        Point target = new Point(3, 4);
        Console.WriteLine($"{origin} 에서 {target} 까지 거리 = {origin.DistanceTo(target)}");

        Point d = default;                    // struct 는 null 이 될 수 없다 → 필드가 모두 0
        Console.WriteLine($"default = {d}");
    }
}`, expect: `struct: p1 = (1, 2), p2 = (100, 2)
class : c1.X = 100, c2.X = 100
(0, 0) 에서 (3, 4) 까지 거리 = 5
default = (0, 0)`, desc: '<code>p2.X = 100</code> 은 복사본만 바꾸므로 <code>p1</code> 은 그대로입니다. 반면 <code>c2.X = 100</code> 은 <code>c1</code> 과 <b>같은 객체</b>를 바꿉니다. 메서드에 struct 를 넘길 때도 복사되므로, 메서드 안에서 바꾼 값은 밖에 반영되지 않습니다(값을 바꾸려면 <code>ref</code>). struct 는 <code>new</code> 없이도 <code>default</code> 로 만들 수 있고 <b>null 이 될 수 없습니다</b>.' },
          { type: 'callout', kind: 'tip', title: '언제 struct, 언제 class?', html: '<b>작고(필드 몇 개), 값처럼 취급되는 데이터</b>(좌표 <code>Point</code>, 색 <code>Color</code>, 날짜 <code>DateTime</code>, 크기 <code>Size</code>)는 struct 가 어울립니다. 복사가 잦은 큰 데이터, 상속이 필요한 것, 여러 곳에서 <b>같은 객체를 공유</b>해야 하는 것은 class 로 만드세요. 헷갈리면 <b>class</b> 가 기본입니다. struct 는 상속할 수 없지만 인터페이스는 구현할 수 있습니다. WPF 에서 만나는 <code>Point</code>, <code>Thickness</code>, <code>Color</code> 가 모두 struct 입니다.' },
          { type: 'h', text: '열거형(enum) — 이름 붙은 상수의 집합' },
          { type: 'p', html: '요일을 0~6 숫자로 저장하면 “3이 목요일이었나?” 하고 헷갈립니다. <b>enum(열거형)</b>은 <b>정해진 값들에 이름을 붙인 자료형</b>입니다. 안에는 정수(기본 <code>int</code>)가 들어 있고 첫 번째 이름은 0, 그다음은 1 … 로 자동 번호가 매겨지지만, 코드에서는 <b>이름으로</b> 읽고 씁니다. 상태(대기 · 진행 · 완료), 등급, 방향처럼 <b>선택지가 정해진 값</b>에 씁니다.' },
          { type: 'code', title: '예제 12-4. enum 선언 · 정수 변환 · switch · Enum.Parse', code: `using System;

enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }   // 0, 1, 2, … 자동 번호
enum Level { Low = 1, Middle = 5, High = 10 }     // 값을 직접 지정할 수도 있다

class Program
{
    static string Describe(Day d)
    {
        switch (d)                                // enum 은 switch 와 찰떡
        {
            case Day.Sat:
            case Day.Sun: return "주말";
            case Day.Fri: return "불금";
            default: return "평일";
        }
    }

    static void Main()
    {
        Day today = Day.Wed;
        Console.WriteLine(today);                 // 이름으로 출력된다
        Console.WriteLine((int)today);            // 안에 든 정수값
        Console.WriteLine(today.ToString().ToUpper());
        Console.WriteLine(Describe(today));
        Console.WriteLine(Describe(Day.Sun));

        Day d = (Day)5;                           // 정수 → enum
        Console.WriteLine(d);
        Day parsed = Enum.Parse<Day>("Fri");      // 문자열 → enum (없는 이름이면 예외)
        Console.WriteLine(parsed == Day.Fri);
        Console.WriteLine(today < Day.Fri);       // 순서(정수값) 비교

        foreach (Day x in Enum.GetValues<Day>())  // 모든 값 순회
            Console.Write($"{x}={(int)x} ");
        Console.WriteLine();

        Level lv = Level.High;
        Console.WriteLine($"{lv} = {(int)lv}");
    }
}`, expect: `Wed
2
WED
평일
주말
Sat
True
True
Mon=0 Tue=1 Wed=2 Thu=3 Fri=4 Sat=5 Sun=6
High = 10`, desc: '<code>Day.Wed</code> 처럼 <b>형식 이름을 앞에</b> 붙여 씁니다. 출력하면 이름이, <code>(int)</code> 로 캐스트하면 정수가 나옵니다. 사용자 입력이나 파일에서 읽은 문자열은 <code>Enum.Parse&lt;Day&gt;("Fri")</code>(없는 이름이면 예외) 또는 안전한 <code>Enum.TryParse</code> 로 바꿉니다. <code>DateTime.DayOfWeek</code>, <code>ConsoleColor</code> 도 enum 입니다 — 1장에서 쓴 <code>ConsoleColor.Red</code> 를 떠올려 보세요.' },
          { type: 'code', title: '추가 예제. [Flags] — 여러 값을 한 변수에 담는 enum', code: `using System;

[Flags]                                             // 값을 비트로 겹쳐 담겠다는 표시
enum Permission { None = 0, Read = 1, Write = 2, Execute = 4 }   // 1, 2, 4, 8 … (2의 거듭제곱)

class Program
{
    static void Main()
    {
        Permission p = Permission.Read | Permission.Write;   // | 로 합치기
        Console.WriteLine(p);
        Console.WriteLine((int)p);                           // 1 + 2
        Console.WriteLine(p.HasFlag(Permission.Write));
        Console.WriteLine(p.HasFlag(Permission.Execute));
        p |= Permission.Execute;                             // 추가
        Console.WriteLine(p);
        p &= ~Permission.Read;                               // 제거
        Console.WriteLine($"{p} = {(int)p}");
    }
}`, expect: `Read, Write
3
True
False
Read, Write, Execute
Write, Execute = 6`, desc: '값을 <b>1, 2, 4, 8 …</b> 로 정하면 각 값이 2진수의 한 자리(비트)를 차지해 겹치지 않게 합칠 수 있습니다. <code>[Flags]</code> 를 붙이면 <code>ToString</code> 이 <code>Read, Write</code> 처럼 예쁘게 나옵니다. 파일 권한, 폰트 스타일(굵게 + 기울임)처럼 <b>여러 개를 동시에 켤 수 있는 옵션</b>에 씁니다. 지금은 “이런 것도 있다” 정도만 알아 두세요.' },
          { type: 'h', text: '튜플(tuple) — 여러 값을 한 번에' },
          { type: 'p', html: '메서드는 값을 <b>하나만</b> 돌려줄 수 있습니다. 최솟값과 최댓값을 둘 다 돌려주고 싶다면? 클래스를 만들거나 <code>out</code> 매개변수를 써야 했지만, C# 7 부터는 <b>튜플</b> <code>(int, int)</code> 로 여러 값을 <b>괄호로 묶어</b> 한 번에 돌려줄 수 있습니다. 각 항목에 <b>이름</b>을 붙일 수 있고, 받는 쪽에서는 <code>var (a, b) = …</code> 로 <b>분해(deconstruction)</b>해 바로 변수에 담습니다.' },
          { type: 'code', title: '예제 12-5. 튜플로 여러 값 반환하기와 분해', code: `using System;

class Program
{
    static (int min, int max) MinMax(int[] arr)   // 반환형이 튜플 (이름 붙임)
    {
        int min = arr[0], max = arr[0];
        foreach (int n in arr)
        {
            if (n < min) min = n;
            if (n > max) max = n;
        }
        return (min, max);                        // 괄호로 묶어 반환
    }

    static (string name, int age) GetPerson() => ("홍길동", 20);

    static void Main()
    {
        (int, string) t = (1, "사과");             // 이름 없는 튜플
        Console.WriteLine(t);
        Console.WriteLine(t.Item1 + " " + t.Item2); // Item1, Item2 …

        var r = MinMax(new[] { 5, 2, 9, 1 });
        Console.WriteLine($"최솟값 {r.min}, 최댓값 {r.max}");   // 이름으로 접근

        var (lo, hi) = MinMax(new[] { 30, 10, 20 });   // 분해: 변수 두 개에 나눠 담기
        Console.WriteLine($"{lo} ~ {hi}");

        (string name, int age) = GetPerson();     // 자료형을 적어도 된다
        Console.WriteLine($"{name}({age})");

        int a = 1, b = 2;
        (a, b) = (b, a);                          // 튜플로 swap — 임시 변수가 필요 없다!
        Console.WriteLine($"a = {a}, b = {b}");
    }
}`, expect: `(1, 사과)
1 사과
최솟값 1, 최댓값 9
10 ~ 30
홍길동(20)
a = 2, b = 1`, desc: '튜플은 <b>값 형식(struct)</b>이라 가볍습니다. 항목 이름을 안 붙이면 <code>Item1</code>, <code>Item2</code> 로 접근하지만, <b>이름을 붙이는 편</b>이 훨씬 읽기 쉽습니다. <code>(a, b) = (b, a)</code> 는 2장의 swap 실습을 한 줄로 끝내는 C# 의 유명한 관용구입니다. 다만 항목이 3~4개를 넘거나 여러 곳에서 쓰이는 데이터라면 튜플보다 아래의 <b>record</b> 가 어울립니다.' },
          { type: 'h', text: 'record — 데이터를 담는 불변 클래스' },
          { type: 'p', html: '“이름과 나이를 가진 사람” 같은 <b>데이터 묶음</b>을 클래스로 만들면 생성자 · 속성 · <code>ToString</code> · <code>Equals</code> 를 일일이 써야 합니다. C# 9 의 <b><code>record</code></b> 는 <b>한 줄</b>로 이것을 다 만들어 줍니다. 만든 뒤에는 값을 <b>바꿀 수 없고(불변, immutable)</b>, 두 record 는 <b>참조가 아니라 값(내용)이 같으면 같다</b>고 판단하며, <code>with</code> 로 “일부만 바꾼 복사본”을 만듭니다.' },
          { type: 'code', title: '예제 12-6. record — 값 기반 비교 · with · ToString 자동', code: `using System;

record Person(string Name, int Age);     // 생성자 · 속성 · ToString · Equals 자동 생성

class PersonClass                        // 비교용 보통 클래스
{
    public string Name;
    public int Age;
    public PersonClass(string name, int age) { Name = name; Age = age; }
}

class Program
{
    static void Main()
    {
        Person p1 = new Person("홍길동", 20);
        Person p2 = new Person("홍길동", 20);
        Console.WriteLine(p1);                 // ToString 이 알아서 예쁘게
        Console.WriteLine(p1.Name);
        Console.WriteLine(p1 == p2);           // 내용이 같으면 같다 (값 기반 비교)
        Console.WriteLine(p1.Equals(p2));

        Person p3 = p1 with { Age = 21 };      // Age 만 바꾼 새 객체
        Console.WriteLine(p3);
        Console.WriteLine(p1);                 // 원본은 그대로
        // p1.Age = 30;                        // 오류 CS8852: 만든 뒤에는 바꿀 수 없다

        PersonClass c1 = new PersonClass("홍길동", 20);
        PersonClass c2 = new PersonClass("홍길동", 20);
        Console.WriteLine(c1 == c2);           // class 는 참조 비교 → 다른 객체이므로 False

        var (n, a) = p3;                       // record 는 튜플처럼 분해도 된다
        Console.WriteLine($"{n}, {a}");
    }
}`, expect: `Person { Name = 홍길동, Age = 20 }
홍길동
True
True
Person { Name = 홍길동, Age = 21 }
Person { Name = 홍길동, Age = 20 }
False
홍길동, 21`, desc: '<code>record Person(string Name, int Age);</code> 한 줄이 클래스 20줄 몫을 합니다. 클래스와 달리 <code>==</code> 가 <b>내용을 비교</b>한다는 점(<code>True</code> vs <code>False</code>)이 핵심입니다. 값을 바꾸고 싶으면 <code>with</code> 로 <b>새 객체</b>를 만드세요 — 원본이 바뀌지 않으니 어디서 값이 바뀌었는지 추적할 걱정이 없습니다. 좌표 · 설정값 · 조회 결과처럼 <b>“데이터 그 자체”</b>를 나타낼 때 record 를 쓰세요. (<code>record struct</code> 로 값 형식 record 도 만들 수 있습니다.)' },
          { type: 'h', text: 'null 다루기 — NullReferenceException 예방' },
          { type: 'p', html: '<b><code>null</code></b> 은 “아무것도 가리키지 않음”입니다. 참조 형식 변수(string, 클래스, 배열)는 null 이 될 수 있고, null 인 변수의 멤버(<code>name.Length</code>)를 건드리면 C# 에서 가장 유명한 예외 <b><code>NullReferenceException</code></b> 이 터집니다. 값 형식(int 등)은 원래 null 이 될 수 없지만 <b><code>int?</code></b> 처럼 <code>?</code> 를 붙이면 “값이 없음”을 표현할 수 있습니다(예: 아직 입력하지 않은 나이). C# 은 null 을 짧고 안전하게 다루는 연산자를 여럿 제공합니다.' },
          { type: 'table', head: ['표기', '이름', '뜻'], rows: [
            ['<code>int? n</code>', 'nullable 값 형식', 'null 도 담을 수 있는 int. <code>n.HasValue</code>, <code>n.Value</code>'],
            ['<code>a ?? b</code>', 'null 병합 연산자', 'a 가 null 이 아니면 a, null 이면 b'],
            ['<code>a ??= b</code>', 'null 병합 대입', 'a 가 null 일 때만 b 를 넣는다'],
            ['<code>a?.Length</code>', 'null 조건 연산자', 'a 가 null 이면 <b>건너뛰고 null</b>, 아니면 a.Length'],
            ['<code>a is null</code> / <code>a != null</code>', 'null 검사', 'if 문으로 직접 확인'],
            ['<code>string? s</code>', 'nullable 참조 형식(C# 8)', '“이 변수는 null 일 수 있다”는 표시 → 컴파일러가 경고로 도와줌']
          ], caption: 'null 을 다루는 도구 모음' },
          { type: 'code', title: '추가 예제. NullReferenceException 을 직접 보기', code: `using System;

class Program
{
    static void Main()
    {
        string name = null;                    // 아무것도 가리키지 않는다
        Console.WriteLine("이름의 길이를 구합니다");
        Console.WriteLine(name.Length);        // null 의 멤버에 접근 → NullReferenceException
        Console.WriteLine("이 줄은 실행되지 않습니다");
    }
}`, expectError: true, expect: `이름의 길이를 구합니다`, desc: '“개체 참조가 개체의 인스턴스로 설정되지 않았습니다(Object reference not set to an instance of an object)” — 앞으로 수없이 만날 메시지입니다. 뜻은 단순합니다: <b>null 인 변수의 점(.) 뒤를 호출했다</b>. 어느 변수가 null 이었는지 줄 번호로 찾으세요.' },
          { type: 'code', title: '예제 12-7. int? · ?? · ?. · ??= 로 안전하게', code: `#nullable enable
using System;

class Program
{
    static void Main()
    {
        int? age = null;                       // null 을 담을 수 있는 int
        Console.WriteLine(age.HasValue);
        Console.WriteLine(age ?? -1);          // null 이면 -1 을 대신 사용
        age = 20;
        Console.WriteLine(age.Value + 1);

        string? name = null;                   // null 이 될 수 있는 문자열이라고 표시
        Console.WriteLine($"길이: {name?.Length}");        // null 이면 건너뛴다 (결과도 null)
        Console.WriteLine($"길이: {name?.Length ?? 0}");   // 건너뛴 값 대신 0
        name ??= "이름 없음";                  // null 일 때만 대입
        Console.WriteLine(name);
        Console.WriteLine(name.ToUpper());     // 이제 null 이 아니므로 안전

        string? nick = null;
        if (nick is null) Console.WriteLine("별명이 없습니다");
    }
}`, expect: `False
-1
21
길이:
길이: 0
이름 없음
이름 없음
별명이 없습니다`, desc: '첫 줄 <code>#nullable enable</code> 은 “null 검사를 도와 달라”는 스위치입니다. 켜면 <code>string?</code> 처럼 null 이 될 수 있는 참조에 <code>?</code> 를 붙여야 하고, <code>?</code> 없는 변수에 null 을 넣거나 <code>?</code> 변수를 검사 없이 쓰면 <b>초록 물결줄 경고</b>가 뜹니다. <code>?.</code> 와 <code>??</code> 를 조합한 <code>name?.Length ?? 0</code> 은 “있으면 길이, 없으면 0” — 실무에서 매우 자주 보는 모양입니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 의 새 프로젝트는 nullable 이 켜져 있습니다', html: '.NET 6 이후 템플릿으로 만든 프로젝트는 <code>.csproj</code> 에 <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> 이 들어 있어 파일마다 <code>#nullable enable</code> 을 쓰지 않아도 됩니다. 그래서 <code>string name = null;</code> 을 쓰면 편집기에 <b>CS8600 경고(초록 물결줄)</b>가 표시됩니다. 오류가 아니라 경고이므로 실행은 되지만, <b>경고가 가리키는 곳이 곧 NullReferenceException 후보</b>이니 <code>string?</code> 로 바꾸거나 null 검사를 넣어 경고를 없애는 습관을 들이세요. 편집기에서 <kbd>Ctrl</kbd>+<kbd>.</kbd> 를 누르면 고치는 방법을 제안해 줍니다.' },
          { type: 'callout', kind: 'warn', title: '? 를 붙였다고 예외가 사라지지는 않습니다', html: '<code>string? s</code> 는 컴파일러에게 “null 일 수 있으니 검사를 도와 줘”라고 알리는 <b>표시</b>일 뿐, 실행 시 동작은 <code>string</code> 과 같습니다. 반면 <code>int?</code> 는 실제로 다른 형식(<code>Nullable&lt;int&gt;</code>)이라 <code>.Value</code> 로 꺼내야 하고, null 인데 <code>.Value</code> 를 읽으면 <code>InvalidOperationException</code> 이 납니다. 값 형식이든 참조 형식이든, <b>쓰기 전에 <code>??</code> 나 <code>?.</code> 나 if 로 확인</b>하는 것이 원칙입니다.' }
        ],
        practice: [
          {
            title: '실습 12-1. 제네릭 스택 MyStack<T> 만들기',
            level: 2,
            desc: '<p>어떤 자료형이든 담을 수 있는 <b>스택(stack)</b> 클래스 <code>MyStack&lt;T&gt;</code> 를 완성하세요. 스택은 <b>나중에 넣은 것이 먼저 나오는</b>(LIFO) 자료구조입니다. 안에 <code>List&lt;T&gt;</code> 를 두고 세 메서드를 구현합니다.</p><ul><li><code>Push(T item)</code>: 맨 위(목록의 끝)에 넣는다</li><li><code>Pop()</code>: 맨 위 요소를 <b>꺼내 제거하고</b> 돌려준다</li><li><code>Peek()</code>: 맨 위 요소를 <b>제거하지 않고</b> 돌려준다</li></ul><pre>개수: 3, 맨 위: 3\n3\n2\n개수: 1\n다나가</pre>',
            hint: '맨 위 요소의 인덱스는 <code>items.Count - 1</code> 입니다. <code>Pop</code> 은 그 값을 변수에 담고 <code>items.RemoveAt(...)</code> 한 뒤 반환하세요.',
            starter: `using System;
using System.Collections.Generic;

class MyStack<T>
{
    private List<T> items = new List<T>();
    public int Count => items.Count;

    public void Push(T item)
    {
        // TODO: 맨 뒤에 추가
    }

    public T Pop()
    {
        // TODO: 맨 뒤 요소를 꺼내 제거하고 반환
        return default;
    }

    public T Peek()
    {
        // TODO: 맨 뒤 요소를 반환 (제거하지 않음)
        return default;
    }
}

class Program
{
    static void Main()
    {
        MyStack<int> s = new MyStack<int>();
        s.Push(1); s.Push(2); s.Push(3);
        Console.WriteLine($"개수: {s.Count}, 맨 위: {s.Peek()}");
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
        Console.WriteLine($"개수: {s.Count}");

        MyStack<string> w = new MyStack<string>();
        w.Push("가"); w.Push("나"); w.Push("다");
        while (w.Count > 0) Console.Write(w.Pop());
        Console.WriteLine();
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

class MyStack<T>
{
    private List<T> items = new List<T>();
    public int Count => items.Count;

    public void Push(T item)
    {
        items.Add(item);
    }

    public T Pop()
    {
        T top = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return top;
    }

    public T Peek()
    {
        return items[items.Count - 1];
    }
}

class Program
{
    static void Main()
    {
        MyStack<int> s = new MyStack<int>();
        s.Push(1); s.Push(2); s.Push(3);
        Console.WriteLine($"개수: {s.Count}, 맨 위: {s.Peek()}");
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
        Console.WriteLine($"개수: {s.Count}");

        MyStack<string> w = new MyStack<string>();
        w.Push("가"); w.Push("나"); w.Push("다");
        while (w.Count > 0) Console.Write(w.Pop());
        Console.WriteLine();
    }
}
`,
            expect: `개수: 3, 맨 위: 3
3
2
개수: 1
다나가`
          },
          {
            title: '실습 12-2. enum Day 와 struct Schedule 로 주간 일정표',
            level: 2,
            desc: '<p>요일 열거형 <code>Day</code> 와 일정 구조체 <code>Schedule</code>(요일 · 시각 · 제목)을 완성하세요.</p><ul><li><code>IsWeekend</code> 속성: 요일이 <code>Sat</code> 또는 <code>Sun</code> 이면 true</li><li><code>ToString()</code>: <code>Wed 14:00 C# 수업</code> 형식(시각은 두 자리 <code>{Hour:D2}</code>), 주말이면 뒤에 <code> (주말)</code> 을 붙인다</li><li>Main 에서 일정을 모두 출력하고 주말 일정 개수를 센다</li></ul><pre>Mon 09:00 팀 회의\nWed 14:00 C# 수업\nSat 10:00 등산 (주말)\n주말 일정: 1개</pre>',
            hint: '<code>public bool IsWeekend =&gt; Day == Day.Sat || Day == Day.Sun;</code> 그리고 <code>ToString</code> 에서 <code>(IsWeekend ? " (주말)" : "")</code> 를 이어 붙이세요.',
            starter: `using System;

enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }

struct Schedule
{
    public Day Day;          // 요일 (필드 이름과 형식 이름이 같아도 된다)
    public int Hour;
    public string Title;

    public Schedule(Day day, int hour, string title)
    {
        Day = day; Hour = hour; Title = title;
    }

    // TODO: IsWeekend 속성 (Sat 또는 Sun 이면 true)
    public bool IsWeekend => false;

    // TODO: "Wed 14:00 C# 수업" 형식, 주말이면 " (주말)" 추가
    public override string ToString() => "";
}

class Program
{
    static void Main()
    {
        Schedule[] list =
        {
            new Schedule(Day.Mon, 9, "팀 회의"),
            new Schedule(Day.Wed, 14, "C# 수업"),
            new Schedule(Day.Sat, 10, "등산"),
        };

        // TODO: 모든 일정 출력

        // TODO: 주말 일정 개수 세어 출력
    }
}
`,
            solution: `using System;

enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }

struct Schedule
{
    public Day Day;
    public int Hour;
    public string Title;

    public Schedule(Day day, int hour, string title)
    {
        Day = day; Hour = hour; Title = title;
    }

    public bool IsWeekend => Day == Day.Sat || Day == Day.Sun;

    public override string ToString()
        => $"{Day} {Hour:D2}:00 {Title}" + (IsWeekend ? " (주말)" : "");
}

class Program
{
    static void Main()
    {
        Schedule[] list =
        {
            new Schedule(Day.Mon, 9, "팀 회의"),
            new Schedule(Day.Wed, 14, "C# 수업"),
            new Schedule(Day.Sat, 10, "등산"),
        };

        int weekend = 0;
        foreach (Schedule s in list)
        {
            Console.WriteLine(s);
            if (s.IsWeekend) weekend++;
        }
        Console.WriteLine($"주말 일정: {weekend}개");
    }
}
`,
            expect: `Mon 09:00 팀 회의
Wed 14:00 C# 수업
Sat 10:00 등산 (주말)
주말 일정: 1개`
          }
        ],
        quiz: [
          { q: '<code>class Box&lt;T&gt;</code> 에서 <code>T</code> 의 역할은?', options: ['항상 int 를 뜻하는 별칭', '사용할 때 정해질 자료형의 자리표시자', 'Box 의 부모 클래스', '변수 이름'], answer: 1, explain: 'T 는 형식 매개변수입니다. <code>Box&lt;int&gt;</code>, <code>Box&lt;string&gt;</code> 처럼 쓰는 순간 채워집니다.' },
          { q: '다음 코드 실행 후 <code>p1.X</code> 의 값은?<pre><code>struct Point { public int X; }\nPoint p1 = new Point { X = 1 };\nPoint p2 = p1;\np2.X = 100;</code></pre>', options: ['1', '100', '0', '컴파일 오류'], answer: 0, explain: 'struct 는 값 형식이라 <code>p2 = p1</code> 에서 값이 복사됩니다. p2 를 바꿔도 p1 은 그대로입니다. class 였다면 100.' },
          { q: '<code>enum Day { Mon, Tue, Wed }</code> 일 때 <code>(int)Day.Wed</code> 는?', options: ['0', '1', '2', '3'], answer: 2, explain: '첫 이름이 0 부터 시작해 하나씩 늘어납니다. Mon=0, Tue=1, Wed=2.' },
          { q: '<code>record Person(string Name, int Age);</code> 로 만든 <code>p1</code>, <code>p2</code> 의 Name 과 Age 가 모두 같을 때 <code>p1 == p2</code> 는?', options: ['False — 서로 다른 객체이므로', '컴파일 오류 — record 는 == 를 지원하지 않음', 'null', 'True — record 는 내용(값)으로 비교하므로'], answer: 3, explain: 'record 는 값 기반 비교를 자동 구현합니다. 보통 class 라면 참조 비교라 False 입니다.' },
          { q: '<code>int? n = null; Console.WriteLine(n ?? 5);</code> 의 출력은?', options: ['0', '5', '(빈 줄)', 'NullReferenceException'], answer: 1, explain: '<code>??</code> 는 왼쪽이 null 이면 오른쪽 값을 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '제네릭 · 구조체 · 열거형 · 튜플 · record · null', subtitle: 'Chapter 12 · Section 01 — C# 기초 마지막 퍼즐 조각', badge: '12-1',
            notes: '<p><b>[도입 3분]</b> “7장에서 쓴 <code>List&lt;int&gt;</code> 의 꺾쇠괄호는 무슨 뜻이었을까요?” 로 시작. 오늘은 그 설계도를 직접 만들고, 그동안 미뤄 둔 작은 문법들(struct · enum · 튜플 · record · null)을 한꺼번에 정리합니다. WPF 파트에서 매일 쓰는 것들이라고 동기 부여.</p>' },
          { layout: 'bullets', title: '왜 제네릭인가?', lead: '“값 하나를 담는 상자”를 만든다면',
            bullets: ['자료형마다 <code>IntBox</code>, <code>StringBox</code> … <b>복사 붙여넣기</b>', '<code>object</code> 상자: 아무거나 담기지만 <b>꺼낼 때 캐스트</b>', ['잘못 꺼내면 <b>실행 중에야</b> InvalidCastException'], '제네릭 <code>Box&lt;T&gt;</code>: 설계도 하나 + <b>컴파일 시 형식 검사</b>', '이미 쓰고 있다: <code>List&lt;T&gt;</code> · <code>Dictionary&lt;K,V&gt;</code> · <code>Func&lt;T&gt;</code>'],
            notes: '<p><b>[4분]</b> object 상자 추가 예제를 실행해 실행 중 예외를 보여 주세요. “컴파일러가 잡아 주는 오류와 실행해야 나오는 오류, 어느 쪽이 좋은가?” 발문.</p>' },
          { layout: 'diagram', title: '제네릭 = 자료형 자리에 T 를 둔 설계도', html: SVG_GENERIC, caption: 'Box<T> 는 설계도, Box<int> · Box<string> 은 찍어 낸 별개의 형식',
            notes: '<p><b>[4분]</b> 왼쪽 설계도의 T 를 손으로 가리키며 “여기에 int 를 넣으면 오른쪽 위, string 을 넣으면 가운데”. 비유: 붕어빵 틀(설계도)과 팥 · 슈크림 붕어빵. Box&lt;int&gt; 에 string 을 넣으려 하면 컴파일 오류.</p>' },
          { layout: 'code', title: '예제 12-1. 제네릭 클래스 Box<T>', code: `using System;

class Box<T>
{
    private T value;
    public Box(T value) { this.value = value; }
    public T Get() { return value; }
    public void Show() { Console.WriteLine($"[{value}] ({typeof(T).Name})"); }
}

class Program
{
    static void Main()
    {
        Box<int> b1 = new Box<int>(42);
        Box<string> b2 = new Box<string>("안녕");
        b1.Show();
        b2.Show();
        int n = b1.Get() + 8;      // 캐스트 없이 int
        Console.WriteLine(n);
        // b1 = new Box<int>("문자열");  // 컴파일 오류!
    }
}`, points: ['<code>class Box&lt;T&gt;</code>: T 는 형식 매개변수', '<code>new Box&lt;int&gt;(42)</code> 에서 T = int', '꺼낼 때 캐스트 불필요, 잘못된 값은 <b>컴파일 오류</b>'],
            notes: '<p><b>[5분]</b> 주석 줄을 풀어 컴파일 오류를 보여 준 뒤, <code>Box&lt;double&gt;</code>, <code>Box&lt;bool&gt;</code> 을 학생이 추가하게. 본문 예제의 <code>Pair&lt;TKey, TValue&gt;</code> 로 형식 매개변수가 여러 개일 수 있음을 언급.</p>' },
          { layout: 'code', title: '예제 12-2. 제네릭 메서드와 제약 where', code: `using System;

class Program
{
    static void Swap<T>(ref T a, ref T b)
    {
        T temp = a; a = b; b = temp;
    }

    static T Max<T>(T a, T b) where T : IComparable<T>
    {
        return a.CompareTo(b) >= 0 ? a : b;
    }

    static void Main()
    {
        int x = 1, y = 2;
        Swap(ref x, ref y);                 // T 추론
        Console.WriteLine($"{x} {y}");
        Console.WriteLine(Max(3, 7));
        Console.WriteLine(Max("apple", "banana"));
        Console.WriteLine(Max(2.5, 1.5));
    }
}`, points: ['메서드 이름 뒤 <code>&lt;T&gt;</code>, 호출 시 T 는 <b>추론</b>', '<code>where T : IComparable&lt;T&gt;</code> — 비교 가능한 형식만', '제약이 있어야 <code>CompareTo</code> 를 쓸 수 있다'],
            notes: '<p><b>[5분]</b> <code>where</code> 절을 지우고 실행 → CS1061. “T 가 뭔지 모르는데 어떻게 비교하나?” → 제약은 T 에 대한 약속. 다른 제약(class, struct, new())은 본문 더 알아보기 참고.</p>' },
          { layout: 'diagram', title: 'struct(값 형식) vs class(참조 형식)', html: SVG_VALREF, caption: '대입하면 struct 는 상자 복사, class 는 화살표 복사',
            notes: '<p><b>[5분]</b> 왼쪽: p2 = p1 은 상자를 하나 더 만든다. 오른쪽: c2 = c1 은 같은 객체를 가리키는 화살표 하나 더. 발문: “int 는 struct 일까 class 일까?” → struct(System.Int32). 언제 struct 를 쓰나: 작고 값처럼 취급되는 데이터(좌표 · 색 · 날짜).</p>' },
          { layout: 'code', title: '예제 12-3. struct Point', code: `using System;

struct Point
{
    public int X, Y;
    public Point(int x, int y) { X = x; Y = y; }
    public override string ToString() => $"({X}, {Y})";
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(1, 2);
        Point p2 = p1;          // 값 복사
        p2.X = 100;
        Console.WriteLine($"p1 = {p1}, p2 = {p2}");

        Point d = default;      // null 불가 → (0, 0)
        Console.WriteLine(d);
    }
}`, points: ['문법은 class 와 거의 같다', '대입 · 매개변수 전달 시 <b>복사</b>', 'null 이 될 수 없다 · 상속 불가'],
            notes: '<p><b>[4분]</b> <code>struct</code> 를 <code>class</code> 로 바꿔 실행하면 p1 도 100 이 됨을 보여 주면 확실히 이해합니다. WPF 의 Point · Thickness · Color 가 struct 라는 것을 예고.</p>' },
          { layout: 'code', title: '예제 12-4. enum — 이름 붙은 상수', code: `using System;

enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }

class Program
{
    static void Main()
    {
        Day today = Day.Wed;
        Console.WriteLine(today);              // Wed
        Console.WriteLine((int)today);         // 2
        Day d = (Day)5;                        // Sat
        Day p = Enum.Parse<Day>("Fri");        // 문자열 → enum
        Console.WriteLine($"{d} {p}");

        switch (today)
        {
            case Day.Sat: case Day.Sun:
                Console.WriteLine("주말"); break;
            default:
                Console.WriteLine("평일"); break;
        }
    }
}`, points: ['안에는 정수(0, 1, 2 …), 코드에서는 <b>이름</b>', '<code>(int)</code> · <code>(Day)</code> · <code>Enum.Parse</code> 로 변환', 'switch 와 함께 쓰면 읽기 좋다'],
            notes: '<p><b>[5분]</b> “요일을 숫자 3으로 저장하면 무슨 문제?” → 뜻을 알 수 없다. 1장의 <code>ConsoleColor.Red</code> 가 enum 이었음을 상기. 시간이 되면 [Flags] 추가 예제를 간단히.</p>' },
          { layout: 'code', title: '예제 12-5 · 12-6. 튜플과 record', code: `using System;

record Person(string Name, int Age);

class Program
{
    static (int min, int max) MinMax(int[] a)
    {
        int lo = a[0], hi = a[0];
        foreach (int n in a) { if (n < lo) lo = n; if (n > hi) hi = n; }
        return (lo, hi);
    }

    static void Main()
    {
        var (lo, hi) = MinMax(new[] { 5, 2, 9 });   // 분해
        Console.WriteLine($"{lo} ~ {hi}");
        int x = 1, y = 2;
        (x, y) = (y, x);                           // swap
        Console.WriteLine($"{x} {y}");

        Person p1 = new Person("홍길동", 20);
        Person p2 = p1 with { Age = 21 };
        Console.WriteLine(p2);
        Console.WriteLine(p1 == new Person("홍길동", 20));
    }
}`, points: ['튜플 <code>(int, int)</code>: 여러 값을 <b>한 번에 반환</b>, <code>var (a, b)</code> 로 분해', '<code>record</code> 한 줄 = 생성자 + 속성 + ToString + Equals', 'record 는 <b>값으로 비교</b>, <code>with</code> 로 일부만 바꾼 복사본'],
            notes: '<p><b>[6분]</b> 튜플 swap 한 줄에 학생들이 좋아합니다(2장 실습 회상). record 의 <code>==</code> 결과 True 를 보여 주고 “class 였다면?” → False. 데이터 그 자체를 나타낼 때 record.</p>' },
          { layout: 'two', title: 'null 을 안전하게', left: { title: '위험한 코드', code: `string name = null;
Console.WriteLine(name.Length);
// NullReferenceException!

int? age = null;
Console.WriteLine(age.Value);
// InvalidOperationException!`, run: false }, right: { title: '안전한 코드', code: `string? name = null;
Console.WriteLine(name?.Length ?? 0);  // 0
name ??= "이름 없음";                  // null 일 때만

int? age = null;
Console.WriteLine(age ?? -1);          // -1
if (age.HasValue) Console.WriteLine(age.Value);`, run: false },
            notes: '<p><b>[5분]</b> 추가 예제로 NullReferenceException 메시지를 실제로 보여 준 뒤 오른쪽 코드로 고칩니다. <code>?.</code> = “null 이면 건너뛰기”, <code>??</code> = “null 이면 대신 이 값”. Visual Studio 의 초록 물결줄(CS8600)이 곧 예외 후보라는 점을 강조.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드 실행 후 <code>p1.X</code> 의 값은?<pre><code>struct Point { public int X; }\nPoint p1 = new Point { X = 1 };\nPoint p2 = p1;\np2.X = 100;</code></pre>', options: ['1', '100', '0', '컴파일 오류'], answer: 0, explain: 'struct 는 값 형식 — 대입하면 복사됩니다. class 였다면 100.',
            notes: '<p>정답 공개 후 “struct 를 class 로 바꾸면?” 을 이어서 묻습니다.</p>' },
          { layout: 'practice', title: '실습 12-1. 제네릭 스택 MyStack<T>', desc: '<p><code>List&lt;T&gt;</code> 를 안에 두고 <code>Push</code> · <code>Pop</code> · <code>Peek</code> 을 구현하세요. 나중에 넣은 것이 먼저 나옵니다(LIFO).</p><pre>개수: 3, 맨 위: 3\n3\n2\n개수: 1\n다나가</pre>', starter: `using System;
using System.Collections.Generic;

class MyStack<T>
{
    private List<T> items = new List<T>();
    public int Count => items.Count;
    public void Push(T item) { /* TODO */ }
    public T Pop() { /* TODO */ return default; }
    public T Peek() { /* TODO */ return default; }
}

class Program
{
    static void Main()
    {
        MyStack<int> s = new MyStack<int>();
        s.Push(1); s.Push(2); s.Push(3);
        Console.WriteLine($"개수: {s.Count}, 맨 위: {s.Peek()}");
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
        Console.WriteLine($"개수: {s.Count}");
    }
}`, solution: `using System;
using System.Collections.Generic;

class MyStack<T>
{
    private List<T> items = new List<T>();
    public int Count => items.Count;
    public void Push(T item) { items.Add(item); }
    public T Pop()
    {
        T top = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return top;
    }
    public T Peek() { return items[items.Count - 1]; }
}

class Program
{
    static void Main()
    {
        MyStack<int> s = new MyStack<int>();
        s.Push(1); s.Push(2); s.Push(3);
        Console.WriteLine($"개수: {s.Count}, 맨 위: {s.Peek()}");
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
        Console.WriteLine($"개수: {s.Count}");
    }
}`,
            notes: '<p><b>[8분]</b> 맨 위 = <code>items[items.Count - 1]</code>. 빨리 끝난 학생은 빈 스택에서 Pop 할 때 예외를 던지게(10장) 하거나 <code>MyStack&lt;string&gt;</code> 으로 문자열 뒤집기. .NET 에 <code>Stack&lt;T&gt;</code>, <code>Queue&lt;T&gt;</code> 가 이미 있음을 알려 주세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['제네릭 <code>Box&lt;T&gt;</code> · <code>Swap&lt;T&gt;</code>: 설계도 하나로 모든 자료형, 컴파일 시 검사', '<code>where T : IComparable&lt;T&gt;</code> 제약으로 T 에 약속 걸기', 'struct 는 값 복사 · null 불가, class 는 참조 공유', 'enum 이름 붙은 상수, 튜플 <code>(a, b)</code> 여러 값 반환, record 값 비교 · with', '<code>int?</code> · <code>??</code> · <code>?.</code> · <code>??=</code> 로 NullReferenceException 예방'],
            notes: '<p>다음 시간: 날짜 · 난수 · 그리고 WPF 로 가는 다리, 비동기 프로그래밍(async/await).</p>' }
        ]
      },

      /* ===================== ch12-2 ===================== */
      {
        id: 'ch12-2',
        title: '날짜 · 난수 · 비동기 프로그래밍(async/await)',
        minutes: 50,
        goals: [
          'DateTime 으로 날짜를 만들고 형식을 지정해 출력하며 AddDays · TimeSpan 으로 계산할 수 있다',
          'Random 으로 난수를 만들고 시드의 의미를 설명할 수 있다',
          '동기와 비동기의 차이를 카페 비유로 설명할 수 있다',
          'async · await · Task · Task<T> · Task.Delay · Task.WhenAll 을 사용할 수 있다',
          'UI 프로그램에서 비동기가 왜 필요한지(화면 멈춤 방지) 설명할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['DateTime · TimeSpan · Random · Stopwatch', 15], ['동기 vs 비동기, async/await', 15], ['WhenAll · 진행률 · WPF 예고', 8], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: 'DateTime — 날짜와 시간' },
          { type: 'p', html: '<b><code>DateTime</code></b> 은 “2026년 1월 1일 9시 30분” 같은 <b>특정 시점</b>을 나타내는 struct 입니다. <code>DateTime.Now</code> 로 현재 시각을 얻거나 <code>new DateTime(년, 월, 일)</code> 로 원하는 날짜를 만들고, <code>ToString("yyyy-MM-dd")</code> 처럼 <b>형식 문자열</b>로 원하는 모양으로 출력합니다. 두 날짜의 <b>차이</b>는 <b><code>TimeSpan</code></b>(기간)이 됩니다.' },
          { type: 'table', head: ['형식 문자', '뜻', '예 (2026-01-01 09:05:07)'], rows: [
            ['<code>yyyy</code> / <code>yy</code>', '연도 4자리 / 2자리', '2026 / 26'],
            ['<code>MM</code> / <code>M</code>', '월 (두 자리 / 한 자리)', '01 / 1'],
            ['<code>dd</code> / <code>d</code>', '일', '01 / 1'],
            ['<code>HH</code> / <code>hh</code>', '시 (24시간 / 12시간)', '09 / 09'],
            ['<code>mm</code>, <code>ss</code>', '분, 초', '05, 07'],
            ['<code>tt</code>', '오전/오후', '오전'],
            ['<code>dddd</code> / <code>ddd</code>', '요일 (긴 / 짧은 이름)', '목요일 / 목']
          ], caption: '자주 쓰는 날짜 · 시간 형식 문자 — 대문자 M 은 월, 소문자 m 은 분! HH 는 24시간제' },
          { type: 'code', title: '예제 12-8. 고정 날짜로 DateTime 다루기', code: `using System;

class Program
{
    static void Main()
    {
        DateTime d = new DateTime(2026, 1, 1);          // 2026년 1월 1일 0시
        Console.WriteLine(d.ToString("yyyy-MM-dd"));
        Console.WriteLine($"{d.Year}년 {d.Month}월 {d.Day}일");
        Console.WriteLine(d.DayOfWeek);                 // 요일 — DayOfWeek 는 enum!
        Console.WriteLine(d.ToString("yyyy년 M월 d일 dddd"));

        DateTime later = d.AddDays(100);                // 100일 뒤 (월 · 연도 넘김은 알아서)
        Console.WriteLine(later.ToString("yyyy-MM-dd"));
        Console.WriteLine(d.AddMonths(1).AddDays(-1).ToString("M월 d일"));   // 1월의 마지막 날

        DateTime exam = new DateTime(2026, 3, 1);
        TimeSpan diff = exam - d;                       // 날짜 - 날짜 = TimeSpan(기간)
        Console.WriteLine($"시험까지 {diff.Days}일 ({diff.TotalHours}시간)");

        DateTime t = new DateTime(2026, 1, 1, 9, 30, 0); // 시 · 분 · 초까지
        Console.WriteLine(t.ToString("HH:mm"));
        Console.WriteLine(t.AddHours(2.5).ToString("tt h:mm"));

        DateTime parsed = DateTime.Parse("2026-12-25"); // 문자열 → DateTime
        Console.WriteLine((parsed - d).Days);
    }
}`, expect: `2026-01-01
2026년 1월 1일
Thursday
2026년 1월 1일 목요일
2026-04-11
1월 31일
시험까지 59일 (1416시간)
09:30
오후 12:00
358`, desc: '<code>AddDays(100)</code> 은 월말 · 윤년을 <b>알아서</b> 계산합니다 — 직접 날짜 계산을 하지 마세요. <code>DayOfWeek</code> 는 enum 이라 <code>Thursday</code> 로 출력되고, <code>dddd</code> 형식은 실행 환경의 문화권(ko-KR)에 따라 <code>목요일</code> 로 나옵니다. <code>TimeSpan</code> 의 <code>Days</code> 는 정수 일수, <code>TotalHours</code> · <code>TotalMinutes</code> 는 전체를 그 단위로 환산한 값입니다. <code>DateTime</code> 은 struct(값 형식)이며 <b>불변</b>이라 <code>AddDays</code> 는 원본을 바꾸지 않고 새 값을 돌려줍니다.' },
          { type: 'code', title: '추가 예제. DateTime.Now — 지금 이 순간', code: `using System;

class Program
{
    static void Main()
    {
        DateTime now = DateTime.Now;                    // 실행할 때마다 다르다
        Console.WriteLine(now);                         // 기본 형식 (문화권에 따라 다름)
        Console.WriteLine(now.ToString("yyyy-MM-dd HH:mm:ss"));
        Console.WriteLine($"오늘은 {now:yyyy년 M월 d일 dddd}");   // 보간 문자열 안에서도 형식 지정

        DateTime newYear = new DateTime(now.Year + 1, 1, 1);
        Console.WriteLine($"새해까지 {(newYear - now).Days}일 남았습니다");
        Console.WriteLine($"오늘 자정: {DateTime.Today:yyyy-MM-dd HH:mm}");
        Console.WriteLine($"세계 표준시(UTC): {DateTime.UtcNow:HH:mm}");
    }
}`, nondeterministic: true, desc: '<code>DateTime.Now</code> 는 컴퓨터의 현재 시각(로컬), <code>DateTime.UtcNow</code> 는 세계 표준시입니다. 실행할 때마다 값이 달라지므로 결과는 여러분의 화면에서 확인하세요. 로그 파일 이름(<code>log_20260101.txt</code>), 저장 시각 기록, 남은 날짜 계산 등에 늘 쓰입니다.' },
          { type: 'h', text: 'Random — 난수' },
          { type: 'p', html: '<b><code>Random</code></b> 은 주사위 · 카드 섞기 · 퀴즈 출제 순서처럼 <b>예측할 수 없는 값</b>이 필요할 때 씁니다. 사실 컴퓨터의 난수는 <b>시드(seed)</b>라는 시작 숫자에서 정해진 계산으로 만들어 내는 “가짜 난수”입니다. 그래서 <code>new Random(42)</code> 처럼 <b>시드를 고정하면 항상 같은 순서</b>가 나옵니다 — 테스트할 때 유용합니다. <code>new Random()</code> 처럼 시드를 생략하면 실행마다 다른 시드를 써서 매번 다른 값이 나옵니다.' },
          { type: 'code', title: '예제 12-9. Random(42) — 시드를 고정한 난수', code: `using System;

class Program
{
    static void Main()
    {
        Random rnd = new Random(42);                 // 시드 고정: 언제 실행해도 같은 순서

        for (int i = 0; i < 5; i++)
            Console.Write(rnd.Next(1, 7) + " ");     // 1 이상 7 미만 → 주사위 1~6
        Console.WriteLine();

        Console.WriteLine(rnd.Next(100));            // 0 ~ 99
        Console.WriteLine(rnd.Next(10, 20));         // 10 ~ 19
        Console.WriteLine(rnd.NextDouble().ToString("F3"));   // 0.0 이상 1.0 미만 실수

        string[] menu = { "김밥", "라면", "돈까스", "비빔밥" };
        Console.WriteLine($"오늘 점심: {menu[rnd.Next(menu.Length)]}");   // 배열에서 하나 뽑기

        Console.WriteLine($"로또 번호 하나: {rnd.Next(1, 46)}");
    }
}`, expect: `5 1 1 4 2
26
17
0.513
오늘 점심: 김밥
로또 번호 하나: 35`, desc: '<code>Next(a, b)</code> 는 <b>a 이상 b 미만</b>입니다 — 주사위는 <code>Next(1, 7)</code>, 배열 인덱스는 <code>Next(배열.Length)</code>. 시드를 <code>42</code> 에서 다른 수로 바꾸거나 <code>new Random()</code> 으로 바꿔 다시 실행해 보세요. <code>Random</code> 객체는 <b>프로그램에 하나만</b> 만들어 계속 쓰는 것이 좋습니다 — 반복문 안에서 매번 <code>new Random()</code> 하면 같은 시드가 되어 같은 값이 반복될 수 있습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Stopwatch 로 시간 재기', html: '<code>System.Diagnostics.Stopwatch</code> 는 “코드가 얼마나 걸리나”를 잴 때 씁니다. <code>Stopwatch sw = Stopwatch.StartNew();</code> … <code>sw.ElapsedMilliseconds</code>(밀리초). 잰 값은 컴퓨터마다, 실행마다 다르므로 검증용 예제에는 넣지 않고, 아래 동기 · 비동기 비교 예제에서 사용해 봅니다.' },
          { type: 'h', text: '동기(sync) vs 비동기(async) — 카페 주문' },
          { type: 'p', html: '지금까지 쓴 코드는 모두 <b>동기</b>였습니다. 한 줄이 끝나야 다음 줄로 갑니다. 파일 내려받기, 서버 응답 기다리기, 3초 걸리는 계산처럼 <b>오래 걸리는 일</b>도 마찬가지로 끝날 때까지 <b>멈춰 서서 기다립니다(블로킹, blocking)</b>. 콘솔에서는 좀 답답할 뿐이지만, <b>WPF 같은 UI 프로그램에서는 그 동안 화면이 얼어붙습니다</b> — 버튼도 안 눌리고 창도 안 움직이는 “응답 없음” 상태입니다.' },
          { type: 'figure', html: SVG_CAFE, caption: '동기: 커피가 나올 때까지 손님 앞에서 기다린다. 비동기: 기계에 맡기고 다음 주문을 받는다 — 직원(스레드)은 한 명 그대로' },
          { type: 'p', html: '카페 직원이 커피 한 잔을 다 내릴 때까지 다음 손님을 안 받는다면 줄이 길어집니다. 유능한 직원은 <b>기계에 맡겨 두고</b> 다음 주문을 받다가, 완성 소리가 나면 그때 전달합니다. 이것이 <b>비동기</b>입니다. C# 에서는 <b><code>async</code></b> 와 <b><code>await</code></b> 두 키워드로 이 흐름을 “동기 코드처럼 쉽게” 씁니다.' },
          { type: 'table', head: ['키워드 · 형식', '뜻'], rows: [
            ['<code>Task</code>', '“진행 중인 일” 을 나타내는 객체. 결과 없이 끝나는 작업 (<code>void</code> 에 해당)'],
            ['<code>Task&lt;int&gt;</code>', '끝나면 <code>int</code> 결과를 주는 작업 (<code>int</code> 반환 메서드에 해당)'],
            ['<code>async</code>', '메서드 선언에 붙임: “이 안에서 await 를 쓰겠다”. 반환형은 <code>Task</code> / <code>Task&lt;T&gt;</code>'],
            ['<code>await 작업</code>', '작업이 끝날 때까지 <b>기다리되 스레드를 붙잡지 않는다</b>. 끝나면 결과를 꺼내 다음 줄 실행'],
            ['<code>Task.Delay(ms)</code>', 'ms 밀리초 동안 기다리는 작업 (비동기판 <code>Thread.Sleep</code>)'],
            ['<code>Task.WhenAll(a, b)</code>', '여러 작업을 <b>동시에</b> 진행시키고 모두 끝날 때까지 기다림'],
            ['<code>async Task Main()</code>', 'Main 도 async 가 될 수 있다 (C# 7.1+) — 콘솔에서 await 사용']
          ], caption: '비동기 프로그래밍의 핵심 도구' },
          { type: 'code', title: '예제 12-10. 첫 비동기 메서드 — async · await · Task<string>', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<string> MakeCoffeeAsync(string name, int ms)   // 끝나면 string 을 준다
    {
        Console.WriteLine($"  {name} 내리는 중… ({ms}ms)");
        await Task.Delay(ms);            // 기계에 맡기고 기다린다 — 스레드는 자유
        return $"  {name} 완성!";         // Task<string> 이지만 return 은 그냥 string
    }

    static async Task Main()             // Main 도 async 가 될 수 있다
    {
        Console.WriteLine("주문 시작");
        string result = await MakeCoffeeAsync("아메리카노", 300);   // await 로 결과를 꺼낸다
        Console.WriteLine(result);
        Console.WriteLine("주문 끝");
    }
}`, expect: `주문 시작
  아메리카노 내리는 중… (300ms)
  아메리카노 완성!
주문 끝`, desc: '비동기 메서드의 세 가지 규칙: ① <code>async</code> 를 붙이고 ② 반환형은 <code>Task</code>(결과 없음) 또는 <code>Task&lt;T&gt;</code>(결과 T) ③ 안에서 오래 걸리는 작업을 <code>await</code> 합니다. 이름 끝에 <b>Async</b> 를 붙이는 것이 관례입니다. <code>await</code> 는 <code>Task&lt;string&gt;</code> 에서 <code>string</code> 을 “까서” 꺼내 줍니다. 결과만 보면 동기 코드와 똑같아 보이지만, <code>await Task.Delay(300)</code> 동안 스레드는 다른 일을 할 수 있습니다.' },
          { type: 'code', title: '예제 12-11. 순서대로 vs 동시에 — Task.WhenAll', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> DownloadAsync(string file, int ms)
    {
        Console.WriteLine($"{file} 내려받기 시작");
        await Task.Delay(ms);            // 네트워크를 기다린다고 치자
        return ms / 10;                  // 내려받은 크기(KB)라고 치자
    }

    static async Task Main()
    {
        // ① 순서대로: 앞 작업이 끝나야 다음 시작 → 300 + 200 = 약 500ms
        int a = await DownloadAsync("A.txt", 300);
        int b = await DownloadAsync("B.txt", 200);
        Console.WriteLine($"순서대로 받은 합계: {a + b} KB");

        // ② 동시에: 두 작업을 먼저 시작해 두고, 둘 다 끝나기를 기다린다 → 약 300ms
        Task<int> t1 = DownloadAsync("C.txt", 300);   // await 없이 호출 = 시작만
        Task<int> t2 = DownloadAsync("D.txt", 200);
        int[] sizes = await Task.WhenAll(t1, t2);      // 모두 끝나면 결과 배열
        Console.WriteLine($"동시에 받은 합계: {sizes[0] + sizes[1]} KB");
        Console.WriteLine($"t1 결과: {t1.Result}, 완료 여부: {t1.IsCompleted}");
    }
}`, expect: `A.txt 내려받기 시작
B.txt 내려받기 시작
순서대로 받은 합계: 50 KB
C.txt 내려받기 시작
D.txt 내려받기 시작
동시에 받은 합계: 50 KB
t1 결과: 30, 완료 여부: True`, desc: '<code>await</code> 없이 비동기 메서드를 호출하면 첫 <code>await</code> 까지 실행된 뒤 <b>바로 <code>Task</code> 를 돌려주고</b> 호출한 쪽이 계속 진행됩니다. 그래서 C, D 가 <b>함께</b> 시작되고, <code>Task.WhenAll</code> 이 둘 다 끝나기를 기다립니다. 결과 순서는 넣은 순서(<code>sizes[0]</code> = t1)입니다. 완료된 Task 의 <code>.Result</code> 는 읽어도 되지만, <b>끝나지 않은 Task 의 <code>.Result</code> 나 <code>.Wait()</code> 는 절대 쓰지 마세요</b> — 스레드를 붙잡아 UI 가 멈추거나 교착(deadlock)에 빠집니다. 항상 <code>await</code>.' },
          { type: 'code', title: '예제 12-12. 동기 vs 비동기 — 걸린 시간 재기', code: `using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void BrewSync(string name)
    {
        Thread.Sleep(300);               // 300ms 동안 스레드가 멈춘다 (블로킹)
        Console.WriteLine($"{name} 완성");
    }

    static async Task BrewAsync(string name, int ms)
    {
        await Task.Delay(ms);            // 기다리는 동안 스레드는 자유
        Console.WriteLine($"{name} 완성");
    }

    static async Task Main()
    {
        Stopwatch sw = Stopwatch.StartNew();
        BrewSync("커피 1");
        BrewSync("커피 2");
        Console.WriteLine($"동기: 약 {sw.ElapsedMilliseconds}ms");
        Console.WriteLine();

        sw.Restart();
        await Task.WhenAll(BrewAsync("커피 3", 300), BrewAsync("커피 4", 200));
        Console.WriteLine($"비동기: 약 {sw.ElapsedMilliseconds}ms");
    }
}`, nondeterministic: true, desc: '동기 부분은 300 + 300 = <b>약 600ms</b>, 비동기 부분은 두 잔이 동시에 내려지므로 긴 쪽인 <b>약 300ms</b> 가 나옵니다(정확한 숫자는 실행마다 조금씩 다릅니다). 비동기 쪽은 <b>먼저 끝나는 커피 4 가 먼저</b> 출력되는 점도 보세요. <code>Thread.Sleep</code> 은 “직원이 멍하니 서 있기”, <code>await Task.Delay</code> 는 “타이머 맞춰 두고 다른 일 하기”입니다.' },
          { type: 'code', title: '예제 12-13. 진행률 표시 — 반복문 안의 await', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> ProcessAsync(int total)
    {
        int done = 0;
        for (int i = 1; i <= total; i++)
        {
            await Task.Delay(100);                       // 한 건 처리에 100ms 걸린다고 치자
            done++;
            int percent = done * 100 / total;
            Console.WriteLine($"[{new string('#', done)}{new string('.', total - done)}] {percent,3}%");
        }
        return done;
    }

    static async Task Main()
    {
        Console.WriteLine("처리 시작");
        int n = await ProcessAsync(5);
        Console.WriteLine($"처리 완료: {n}건");
    }
}`, expect: `처리 시작
[#....]  20%
[##...]  40%
[###..]  60%
[####.]  80%
[#####] 100%
처리 완료: 5건`, desc: '반복문 안에서 <code>await</code> 를 써도 됩니다. 매 반복마다 100ms 를 기다리는 동안 스레드가 풀려나므로, WPF 라면 <b>진행 막대(ProgressBar)가 부드럽게 올라가고</b> 그 동안 취소 버튼도 눌립니다. 동기 코드로 같은 일을 하면 500ms 가 지난 뒤 결과가 한꺼번에 나타나고 그 사이 화면은 굳어 있습니다.' },
          { type: 'h', text: 'WPF 에서 비동기가 중요한 이유 — 다음 파트 예고' },
          { type: 'p', html: 'WPF 프로그램에는 <b>UI 스레드</b>가 딱 하나 있고, 이 스레드가 화면 그리기 · 마우스 · 키보드를 <b>전부</b> 처리합니다. 버튼 클릭 핸들러에서 3초 걸리는 일을 동기로 하면 그 3초 동안 UI 스레드가 묶여 <b>창이 하얗게 굳고 “응답 없음”</b>이 뜹니다. 클릭 핸들러를 <code>async</code> 로 만들고 오래 걸리는 일을 <code>await</code> 하면, 기다리는 동안 UI 스레드가 화면을 계속 그려 줍니다. 13장부터 만드는 모든 WPF 앱에서 이 패턴을 씁니다.' },
          { type: 'callout', kind: 'vs', title: 'WPF 버튼 클릭 핸들러의 비동기 패턴 (미리 보기)', html: '<pre><code>private async void btnLoad_Click(object sender, RoutedEventArgs e)\n{\n    btnLoad.IsEnabled = false;          // 두 번 눌리지 않게\n    txtStatus.Text = "불러오는 중…";\n    string data = await LoadDataAsync();   // 기다리는 동안 화면은 살아 있다\n    txtStatus.Text = data;\n    btnLoad.IsEnabled = true;\n}</code></pre><p>이벤트 핸들러는 반환형을 바꿀 수 없어 예외적으로 <code>async void</code> 를 씁니다. <b>그 밖의 모든 비동기 메서드는 <code>Task</code> / <code>Task&lt;T&gt;</code> 를 돌려주게</b> 만드세요 — <code>async void</code> 는 호출한 쪽이 끝나기를 기다릴 수도, 예외를 잡을 수도 없습니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — CPU 를 많이 쓰는 계산은 Task.Run', html: '<code>Task.Delay</code> · 파일 · 네트워크처럼 “기다리는” 일은 <code>await</code> 만으로 UI 가 멈추지 않습니다. 하지만 <b>1억 번 반복하는 계산</b>처럼 CPU 를 계속 쓰는 일은 기다리는 게 아니라 일하는 것이라, <code>await Task.Run(() =&gt; 무거운계산())</code> 으로 <b>다른 스레드에 맡겨야</b> UI 스레드가 자유로워집니다. 여러 스레드가 같은 변수를 건드리면 문제가 생길 수 있으니(경쟁 상태), Task.Run 안에서는 UI 컨트롤을 직접 만지지 말고 결과만 돌려받으세요. 자세한 것은 WPF 파트에서 실제 화면과 함께 다룹니다.' }
        ],
        practice: [
          {
            title: '실습 12-3. 주사위 100번 던져 눈별 횟수 세기',
            level: 1,
            desc: '<p><code>new Random(42)</code> 로 주사위를 100번 던져 1~6 각 눈이 몇 번 나왔는지 세고, 횟수만큼 <code>*</code> 를 찍어 막대그래프처럼 출력하세요. 시드를 42 로 고정했으므로 결과는 항상 같습니다.</p><pre>1: ***************** (17회)\n(… 6까지)</pre>',
            hint: '크기 7 인 <code>int[] count</code> 를 만들고 <code>count[rnd.Next(1, 7)]++</code>. 별은 <code>new string(\'*\', count[face])</code> 로 만듭니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Random rnd = new Random(42);
        int[] count = new int[7];       // 인덱스 1~6 사용 (0 은 비워 둠)

        // TODO: 100번 던져 count[눈]++

        // TODO: 1~6 각 눈의 막대와 횟수 출력
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Random rnd = new Random(42);
        int[] count = new int[7];       // 인덱스 1~6 사용 (0 은 비워 둠)

        for (int i = 0; i < 100; i++)
        {
            int face = rnd.Next(1, 7);
            count[face]++;
        }

        for (int face = 1; face <= 6; face++)
            Console.WriteLine($"{face}: {new string('*', count[face])} ({count[face]}회)");
    }
}
`,
            expect: `1: **************************** (28회)
2: *************** (15회)
3: ************* (13회)
4: ******************* (19회)
5: ******************* (19회)
6: ****** (6회)`
          },
          {
            title: '실습 12-4. 두 비동기 작업을 동시에 실행하고 합계 구하기',
            level: 2,
            desc: '<p><code>SumAsync(from, to)</code> 는 200ms 기다린 뒤 <code>from</code> 부터 <code>to</code> 까지의 합을 돌려주는 비동기 메서드입니다. Main 에서 <code>SumAsync(1, 50)</code> 과 <code>SumAsync(51, 100)</code> 을 <b>동시에</b> 시작해 <code>Task.WhenAll</code> 로 기다린 뒤, 각 결과와 전체 합계(5050)를 출력하세요. (출력은 두 작업이 모두 끝난 <b>뒤에</b> 하세요.)</p><pre>1~50 합계 = 1275\n51~100 합계 = 3775\n전체 합계 = 5050</pre>',
            hint: '<code>Task&lt;int&gt; t1 = SumAsync(1, 50);</code> 처럼 await 없이 두 개를 시작하고 <code>int[] r = await Task.WhenAll(t1, t2);</code>.',
            starter: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> SumAsync(int from, int to)
    {
        await Task.Delay(200);
        // TODO: from ~ to 의 합을 구해 반환
        return 0;
    }

    static async Task Main()
    {
        // TODO: 두 작업을 동시에 시작하고 Task.WhenAll 로 기다린 뒤 출력
    }
}
`,
            solution: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> SumAsync(int from, int to)
    {
        await Task.Delay(200);
        int sum = 0;
        for (int i = from; i <= to; i++) sum += i;
        return sum;
    }

    static async Task Main()
    {
        Task<int> t1 = SumAsync(1, 50);
        Task<int> t2 = SumAsync(51, 100);
        int[] r = await Task.WhenAll(t1, t2);
        Console.WriteLine($"1~50 합계 = {r[0]}");
        Console.WriteLine($"51~100 합계 = {r[1]}");
        Console.WriteLine($"전체 합계 = {r[0] + r[1]}");
    }
}
`,
            expect: `1~50 합계 = 1275
51~100 합계 = 3775
전체 합계 = 5050`
          }
        ],
        quiz: [
          { q: '<code>new DateTime(2026, 1, 1).AddDays(31).ToString("MM-dd")</code> 의 결과는?', options: ['01-31', '02-01', '02-02', '01-32'], answer: 1, explain: '1월 1일에서 31일 뒤는 2월 1일입니다. AddDays 는 월말을 알아서 넘깁니다.' },
          { q: '<code>new Random(42)</code> 처럼 시드를 고정하면?', options: ['더 무작위한 값이 나온다', '42 만 계속 나온다', '실행할 때마다 같은 순서의 값이 나온다', '1~42 사이 값만 나온다'], answer: 2, explain: '난수는 시드에서 정해진 계산으로 만들어지므로 시드가 같으면 순서도 같습니다. 테스트에 유용합니다.' },
          { q: '<code>rnd.Next(1, 7)</code> 이 돌려줄 수 있는 값의 범위는?', options: ['1 ~ 6', '1 ~ 7', '0 ~ 6', '0 ~ 7'], answer: 0, explain: '<code>Next(a, b)</code> 는 a 이상 <b>b 미만</b>입니다.' },
          { q: '<code>await</code> 에 대한 설명으로 <b>옳은</b> 것은?', options: ['새 스레드를 만들어 작업을 실행한다', '작업을 취소한다', '작업이 끝날 때까지 스레드를 멈춰 세운다(블로킹)', '작업이 끝나기를 기다리되, 그 동안 스레드는 다른 일을 할 수 있다'], answer: 3, explain: 'await 는 블로킹하지 않고 기다립니다. 그래서 UI 가 멈추지 않습니다. 스레드를 멈춰 세우는 것은 <code>Thread.Sleep</code> · <code>.Wait()</code> · <code>.Result</code>.' },
          { q: '비동기 메서드가 <code>int</code> 결과를 돌려줄 때 반환형은?', options: ['<code>int</code>', '<code>async int</code>', '<code>Task&lt;int&gt;</code>', '<code>Task</code>'], answer: 2, explain: '결과가 있으면 <code>Task&lt;T&gt;</code>, 없으면 <code>Task</code>. 메서드 안의 <code>return</code> 은 그냥 int 값을 돌려주면 됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '날짜 · 난수 · 비동기 프로그래밍', subtitle: 'Chapter 12 · Section 02 — WPF 로 가는 다리', badge: '12-2',
            notes: '<p><b>[도입 3분]</b> “프로그램에서 버튼을 눌렀는데 창이 하얗게 굳어 본 적 있나요?” → 오늘 배울 비동기가 그것을 막는 방법. 그 전에 실용 도구 두 개(DateTime, Random)를 빠르게.</p>' },
          { layout: 'code', title: '예제 12-8. DateTime', code: `using System;

class Program
{
    static void Main()
    {
        DateTime d = new DateTime(2026, 1, 1);
        Console.WriteLine(d.ToString("yyyy-MM-dd"));
        Console.WriteLine(d.DayOfWeek);                    // Thursday
        Console.WriteLine(d.ToString("yyyy년 M월 d일 dddd"));
        Console.WriteLine(d.AddDays(100).ToString("yyyy-MM-dd"));

        DateTime exam = new DateTime(2026, 3, 1);
        TimeSpan diff = exam - d;                          // 기간
        Console.WriteLine($"시험까지 {diff.Days}일");

        Console.WriteLine(DateTime.Now.ToString("HH:mm:ss"));   // 지금
    }
}`, points: ['<code>new DateTime(년, 월, 일)</code> · <code>DateTime.Now</code>', '형식 문자열: <code>yyyy MM dd HH mm ss dddd</code>', '<code>AddDays</code> 는 월말 · 윤년을 알아서', '날짜 − 날짜 = <code>TimeSpan</code>'],
            notes: '<p><b>[6분]</b> “대문자 M 은 월, 소문자 m 은 분” 을 크게 강조. 마지막 줄만 실행마다 다름을 확인. 학생 생일로 “태어난 지 며칠?” 을 계산해 보게 하면 재미있습니다.</p>' },
          { layout: 'code', title: '예제 12-9. Random — 시드 고정', code: `using System;

class Program
{
    static void Main()
    {
        Random rnd = new Random(42);            // 시드 고정: 항상 같은 순서
        for (int i = 0; i < 5; i++)
            Console.Write(rnd.Next(1, 7) + " "); // 주사위 1~6
        Console.WriteLine();
        Console.WriteLine(rnd.Next(100));       // 0~99
        Console.WriteLine(rnd.NextDouble().ToString("F3"));

        string[] menu = { "김밥", "라면", "돈까스" };
        Console.WriteLine(menu[rnd.Next(menu.Length)]);
    }
}`, points: ['<code>Next(a, b)</code>: a 이상 <b>b 미만</b>', '시드가 같으면 결과도 같다 (테스트용)', '<code>new Random()</code> 은 실행마다 다름', 'Random 객체는 하나만 만들어 재사용'],
            notes: '<p><b>[4분]</b> 두 번 실행해 같은 값이 나옴을 보인 뒤 시드를 지우고 다시. “왜 컴퓨터는 진짜 난수를 못 만드나?” 한 마디. 반복문 안 <code>new Random()</code> 함정 언급.</p>' },
          { layout: 'diagram', title: '동기 vs 비동기 — 카페 주문', html: SVG_CAFE, caption: '직원(스레드)은 한 명. 기다리는 동안 다음 손님을 받느냐가 차이',
            notes: '<p><b>[6분]</b> 위 줄: 커피 기계 앞에서 멍하니 기다리는 직원 = 동기(블로킹). 아래 줄: 기계에 맡기고 다음 주문 = 비동기. “직원이 한 명 더 생긴 게 아니다”를 강조 — 스레드를 늘리는 게 아니라 기다리는 시간을 활용하는 것. WPF 에서 UI 스레드가 기다리면 화면이 굳는다.</p>' },
          { layout: 'table', title: 'async / await 도구 상자', head: ['키워드 · 형식', '뜻'], rows: [['<code>Task</code> / <code>Task&lt;int&gt;</code>', '진행 중인 일 (결과 없음 / int 결과)'], ['<code>async</code>', '메서드에 붙임: “안에서 await 쓴다”. 반환형은 Task'], ['<code>await 작업</code>', '끝날 때까지 기다리되 <b>스레드는 자유</b>, 결과를 꺼냄'], ['<code>Task.Delay(ms)</code>', '비동기로 ms 기다리기 (Thread.Sleep 의 비동기판)'], ['<code>Task.WhenAll(a, b)</code>', '여러 작업 동시 진행, 모두 끝나면 계속'], ['<code>async Task Main()</code>', '콘솔에서도 await 사용 가능']],
            lead: '세 가지 규칙: async 붙이기 · Task 반환 · 오래 걸리는 일은 await',
            notes: '<p><b>[4분]</b> 표를 한 줄씩. “Task&lt;int&gt; 는 나중에 int 를 주겠다는 영수증” 비유. await 는 영수증을 실제 값으로 바꾸는 일.</p>' },
          { layout: 'code', title: '예제 12-10. 첫 비동기 메서드', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<string> MakeCoffeeAsync(string name, int ms)
    {
        Console.WriteLine($"  {name} 내리는 중…");
        await Task.Delay(ms);          // 기계에 맡기고 기다림
        return $"  {name} 완성!";
    }

    static async Task Main()
    {
        Console.WriteLine("주문 시작");
        string r = await MakeCoffeeAsync("아메리카노", 300);
        Console.WriteLine(r);
        Console.WriteLine("주문 끝");
    }
}`, points: ['① <code>async</code> ② 반환형 <code>Task&lt;string&gt;</code> ③ 안에서 <code>await</code>', '<code>return</code> 은 그냥 string', '이름 끝에 <b>Async</b> (관례)', '<code>await</code> 가 Task&lt;string&gt; 에서 string 을 꺼낸다'],
            notes: '<p><b>[5분]</b> 실행 결과는 동기 코드와 똑같아 보인다는 점을 인정하고, “차이는 기다리는 300ms 동안 스레드가 뭘 하느냐”. ms 를 1000 으로 바꿔 실행하며 출력이 멈추는 순간을 보여 주세요.</p>' },
          { layout: 'code', title: '예제 12-11. 동시에 — Task.WhenAll', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> DownloadAsync(string file, int ms)
    {
        Console.WriteLine($"{file} 시작");
        await Task.Delay(ms);
        return ms / 10;                       // 크기(KB)
    }

    static async Task Main()
    {
        Task<int> t1 = DownloadAsync("A.txt", 300);   // 시작만
        Task<int> t2 = DownloadAsync("B.txt", 200);
        int[] sizes = await Task.WhenAll(t1, t2);      // 둘 다 끝나면
        Console.WriteLine($"합계 {sizes[0] + sizes[1]} KB");
    }
}`, points: ['await 없이 호출 = <b>시작만</b> 하고 Task 를 받는다', '<code>WhenAll</code>: 모두 끝나면 결과 배열', '순서대로 await 하면 500ms, 동시에 하면 300ms', '끝나지 않은 Task 의 <code>.Result</code> · <code>.Wait()</code> 금지'],
            notes: '<p><b>[5분]</b> “A 시작, B 시작” 이 연달아 찍히는 이유: 첫 await 에서 호출자에게 돌아오기 때문. 본문 예제 12-12 의 Stopwatch 로 실제 시간 차이(600 vs 300ms)를 시연하세요.</p>' },
          { layout: 'code', title: '예제 12-13. 진행률 — 반복문 안의 await', code: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        int total = 5;
        for (int done = 1; done <= total; done++)
        {
            await Task.Delay(100);
            string bar = new string('#', done) + new string('.', total - done);
            Console.WriteLine($"[{bar}] {done * 100 / total,3}%");
        }
        Console.WriteLine("처리 완료");
    }
}`, points: ['반복마다 await → 스레드가 풀려난다', 'WPF 라면 ProgressBar 가 부드럽게 올라간다', '동기라면 500ms 뒤 한꺼번에 + 화면 굳음'],
            notes: '<p><b>[3분]</b> 실행하며 한 줄씩 나타나는 것을 보여 줍니다. “이 사이에 취소 버튼을 누를 수 있다”가 핵심.</p>' },
          { layout: 'bullets', title: 'WPF 에서 비동기가 중요한 이유', lead: 'UI 스레드는 하나 — 화면 그리기 · 마우스 · 키보드 전부 담당',
            bullets: ['클릭 핸들러에서 3초 동기 작업 → 창이 굳고 <b>“응답 없음”</b>', '<code>private async void Button_Click(…)</code> + <code>await</code> → 기다리는 동안 화면은 살아 있음', ['이벤트 핸들러만 예외적으로 <code>async void</code>', ['그 밖의 비동기 메서드는 항상 <code>Task</code> / <code>Task&lt;T&gt;</code>']], 'CPU 를 많이 쓰는 계산은 <code>await Task.Run(() =&gt; …)</code>', '13장부터 실제 화면으로 확인합니다'],
            notes: '<p><b>[4분]</b> 본문의 vs 콜아웃 코드(btnLoad_Click)를 보여 주며 “다음 파트에서 이 코드를 직접 만든다”. async void 의 위험(예외를 못 잡음)은 한 문장만.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>await</code> 에 대한 설명으로 <b>옳은</b> 것은?', options: ['새 스레드를 만들어 작업을 실행한다', '작업을 취소한다', '작업이 끝날 때까지 스레드를 멈춰 세운다', '작업이 끝나기를 기다리되, 그 동안 스레드는 다른 일을 할 수 있다'], answer: 3, explain: 'await 는 블로킹하지 않고 기다립니다. 스레드를 멈추는 것은 Thread.Sleep · .Wait() · .Result.',
            notes: '<p>오답 ①(새 스레드)이 많이 나옵니다. 카페 그림으로 돌아가 “직원은 한 명”을 다시 확인.</p>' },
          { layout: 'practice', title: '실습 12-4. 두 비동기 작업 동시 실행', desc: '<p><code>SumAsync(1, 50)</code> 과 <code>SumAsync(51, 100)</code> 을 동시에 시작해 <code>Task.WhenAll</code> 로 기다린 뒤 각 합계와 전체 합계(5050)를 출력하세요.</p>', starter: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> SumAsync(int from, int to)
    {
        await Task.Delay(200);
        // TODO: from ~ to 의 합 반환
        return 0;
    }

    static async Task Main()
    {
        // TODO: 동시에 시작 → WhenAll → 출력
    }
}`, solution: `using System;
using System.Threading.Tasks;

class Program
{
    static async Task<int> SumAsync(int from, int to)
    {
        await Task.Delay(200);
        int sum = 0;
        for (int i = from; i <= to; i++) sum += i;
        return sum;
    }

    static async Task Main()
    {
        Task<int> t1 = SumAsync(1, 50);
        Task<int> t2 = SumAsync(51, 100);
        int[] r = await Task.WhenAll(t1, t2);
        Console.WriteLine($"1~50 합계 = {r[0]}");
        Console.WriteLine($"51~100 합계 = {r[1]}");
        Console.WriteLine($"전체 합계 = {r[0] + r[1]}");
    }
}`,
            notes: '<p><b>[7분]</b> 흔한 실수: <code>int a = await SumAsync(1, 50); int b = await SumAsync(51, 100);</code> — 결과는 같지만 순서대로 실행(400ms). “동시에” 하려면 Task 를 먼저 받아 두기. 빨리 끝난 학생은 Stopwatch 로 두 방식의 시간을 비교.</p>' },
          { layout: 'summary', title: '정리 — C# 기초 파트 끝!', bullets: ['<code>DateTime</code> · 형식 문자열 · <code>AddDays</code> · <code>TimeSpan</code>, <code>Random(시드)</code> · <code>Next(a, b)</code>', '동기 = 기다리며 멈춤(블로킹), 비동기 = 맡기고 다른 일', '<code>async Task&lt;T&gt;</code> 메서드 + <code>await</code>, <code>Task.Delay</code> · <code>Task.WhenAll</code>', 'UI 스레드는 하나 → 오래 걸리는 일은 반드시 await (화면 멈춤 방지)', '다음 시간부터 WPF: 창 · 버튼 · XAML 로 진짜 프로그램 만들기'],
            notes: '<p>12장으로 C# 기초가 끝났습니다. 1장부터 배운 것을 한 줄씩 훑으며(변수 → 제어문 → 메서드 → 클래스 → 컬렉션 → LINQ → 비동기) 성취감을 주세요. 다음 시간: WPF 소개와 첫 윈도우.</p>' }
        ]
      }
    ]
  });
})();
