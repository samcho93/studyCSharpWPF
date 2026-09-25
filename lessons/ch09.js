/* Chapter 09. 상속 · 다형성 · 인터페이스 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_INHERIT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="상속 계층: Animal 을 물려받는 Dog 와 Cat">
  <defs><marker id="ah9a" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" viewBox="0 0 16 16" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/></marker></defs>
  <rect x="440" y="30" width="400" height="220" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="68" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent)">Animal</text>
  <text x="640" y="94" text-anchor="middle" style="font-size:19px;fill:var(--muted)">부모(기반) 클래스 · base class</text>
  <line x1="440" y1="106" x2="840" y2="106" stroke="var(--line)" stroke-width="2"/>
  <text x="470" y="137" style="${MONO};font-size:22px;fill:var(--fg)">string Name;    int Age;</text>
  <line x1="440" y1="152" x2="840" y2="152" stroke="var(--line)" stroke-width="2"/>
  <text x="470" y="183" style="${MONO};font-size:22px;fill:var(--fg)">void Eat()    void Sleep()</text>
  <text x="470" y="217" style="${MONO};font-size:22px;fill:var(--accent2)">virtual void Speak()</text>
  <line x1="640" y1="320" x2="640" y2="254" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah9a)"/>
  <line x1="320" y1="320" x2="960" y2="320" stroke="var(--accent)" stroke-width="4"/>
  <line x1="320" y1="320" x2="320" y2="350" stroke="var(--accent)" stroke-width="4"/>
  <line x1="960" y1="320" x2="960" y2="350" stroke="var(--accent)" stroke-width="4"/>
  <text x="665" y="296" style="font-size:21px;fill:var(--muted)">is-a 관계: “Dog 는 Animal 이다” (모든 개는 동물)</text>
  <rect x="120" y="350" width="400" height="170" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="320" y="386" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--ok)">Dog : Animal</text>
  <text x="320" y="410" text-anchor="middle" style="font-size:19px;fill:var(--muted)">자식(파생) 클래스 · derived class</text>
  <line x1="120" y1="422" x2="520" y2="422" stroke="var(--line)" stroke-width="2"/>
  <text x="150" y="452" style="font-size:20px;fill:var(--muted)">Name · Age · Eat · Sleep → 물려받음</text>
  <text x="150" y="482" style="${MONO};font-size:22px;fill:var(--ok)">+ void Fetch()</text>
  <text x="150" y="510" style="${MONO};font-size:22px;fill:var(--accent2)">override void Speak()</text>
  <rect x="760" y="350" width="400" height="170" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="960" y="386" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--ok)">Cat : Animal</text>
  <text x="960" y="410" text-anchor="middle" style="font-size:19px;fill:var(--muted)">자식(파생) 클래스 · derived class</text>
  <line x1="760" y1="422" x2="1160" y2="422" stroke="var(--line)" stroke-width="2"/>
  <text x="790" y="452" style="font-size:20px;fill:var(--muted)">Name · Age · Eat · Sleep → 물려받음</text>
  <text x="790" y="482" style="${MONO};font-size:22px;fill:var(--ok)">+ void Scratch()</text>
  <text x="790" y="510" style="${MONO};font-size:22px;fill:var(--accent2)">override void Speak()</text>
  <text x="640" y="550" text-anchor="middle" style="font-size:22px;fill:var(--fg)">자식은 부모의 멤버를 모두 물려받고(<tspan font-weight="700">재사용</tspan>), 자기 멤버를 더하고(<tspan font-weight="700">확장</tspan>), 동작을 바꾼다(<tspan font-weight="700">재정의</tspan>)</text>
</svg>`;

  const SVG_POLY = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="다형성: Animal 배열의 각 칸이 다른 객체를 가리키고, Speak 는 실제 객체의 것이 실행된다">
  <defs><marker id="ah9b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <text x="640" y="42" text-anchor="middle" style="${MONO};font-size:23px;fill:var(--fg)">Animal[] zoo = { new Dog("바둑이"), new Cat("나비"), new Cow("얼룩이") };</text>
  <text x="640" y="80" text-anchor="middle" style="${MONO};font-size:23px;fill:var(--fg)">foreach (Animal a in zoo)   a.Speak();</text>
  <text x="190" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">zoo 배열 — 칸의 형식은 모두 Animal</text>
  <text x="590" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">실제 객체</text>
  <text x="1050" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">실행되는 Speak()</text>
  <g style="${MONO};font-size:22px">
    <rect x="80" y="165" width="220" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="105" y="204" style="fill:var(--fg)">zoo[0]</text>
    <text x="105" y="238" style="fill:var(--muted);font-size:19px">Animal 형식</text>
    <circle cx="275" cy="210" r="9" fill="var(--accent2)"/>
    <rect x="80" y="285" width="220" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="105" y="324" style="fill:var(--fg)">zoo[1]</text>
    <text x="105" y="358" style="fill:var(--muted);font-size:19px">Animal 형식</text>
    <circle cx="275" cy="330" r="9" fill="var(--accent2)"/>
    <rect x="80" y="405" width="220" height="90" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="105" y="444" style="fill:var(--fg)">zoo[2]</text>
    <text x="105" y="478" style="fill:var(--muted);font-size:19px">Animal 형식</text>
    <circle cx="275" cy="450" r="9" fill="var(--accent2)"/>
    <line x1="290" y1="210" x2="410" y2="210" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <line x1="290" y1="330" x2="410" y2="330" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <line x1="290" y1="450" x2="410" y2="450" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <rect x="420" y="165" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="445" y="204" style="fill:var(--ok);font-weight:700">Dog 객체</text>
    <text x="445" y="238" style="fill:var(--fg);font-size:20px">Name = "바둑이"</text>
    <rect x="420" y="285" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="445" y="324" style="fill:var(--ok);font-weight:700">Cat 객체</text>
    <text x="445" y="358" style="fill:var(--fg);font-size:20px">Name = "나비"</text>
    <rect x="420" y="405" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="445" y="444" style="fill:var(--ok);font-weight:700">Cow 객체</text>
    <text x="445" y="478" style="fill:var(--fg);font-size:20px">Name = "얼룩이"</text>
    <line x1="770" y1="210" x2="870" y2="210" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <line x1="770" y1="330" x2="870" y2="330" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <line x1="770" y1="450" x2="870" y2="450" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah9b)"/>
    <rect x="880" y="165" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="204" style="fill:var(--accent2)">Dog.Speak()</text>
    <text x="905" y="238" style="fill:var(--fg)">→ "바둑이: 멍멍!"</text>
    <rect x="880" y="285" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="324" style="fill:var(--accent2)">Cat.Speak()</text>
    <text x="905" y="358" style="fill:var(--fg)">→ "나비: 야옹~"</text>
    <rect x="880" y="405" width="340" height="90" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="905" y="444" style="fill:var(--accent2)">Cow.Speak()</text>
    <text x="905" y="478" style="fill:var(--fg)">→ "얼룩이: 음메~"</text>
  </g>
  <text x="640" y="540" text-anchor="middle" style="font-size:22px;fill:var(--fg)">변수의 형식은 Animal 이지만 호출되는 Speak() 는 <tspan font-weight="700">실제 객체의 것</tspan> — 실행 시점에 결정된다 (다형성, polymorphism)</text>
</svg>`;

  const SVG_IFACE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="인터페이스는 계약: 규격만 맞으면 어떤 클래스든 같은 자리에 꽂아 쓸 수 있다">
  <defs><marker id="ah9c" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto" viewBox="0 0 16 16" markerUnits="userSpaceOnUse"><path d="M0,0 L16,8 L0,16 z" fill="var(--card)" stroke="var(--accent2)" stroke-width="2"/></marker>
  <marker id="ah9d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  <rect x="80" y="40" width="380" height="180" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="4" stroke-dasharray="14 8"/>
  <text x="270" y="72" text-anchor="middle" style="font-size:20px;fill:var(--muted)">«interface»</text>
  <text x="270" y="106" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--accent2)">IPlayable</text>
  <line x1="80" y1="120" x2="460" y2="120" stroke="var(--line)" stroke-width="2"/>
  <text x="110" y="156" style="${MONO};font-size:22px;fill:var(--fg)">void Play();</text>
  <text x="110" y="192" style="${MONO};font-size:22px;fill:var(--fg)">void Stop();</text>
  <text x="270" y="252" text-anchor="middle" style="font-size:20px;fill:var(--muted)">계약(contract): 갖춰야 할 멤버 목록 · 본문 없음</text>
  <line x1="140" y1="340" x2="200" y2="226" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah9c)"/>
  <line x1="370" y1="340" x2="300" y2="226" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah9c)"/>
  <line x1="600" y1="340" x2="420" y2="226" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#ah9c)"/>
  <text x="470" y="300" style="font-size:19px;fill:var(--muted)">구현(implements)</text>
  <g style="${MONO};font-size:21px">
    <rect x="40" y="340" width="200" height="130" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="140" y="374" text-anchor="middle" style="fill:var(--ok);font-weight:700">Music</text>
    <text x="140" y="398" text-anchor="middle" style="font-size:18px;fill:var(--muted)">: IPlayable</text>
    <text x="140" y="430" text-anchor="middle" style="fill:var(--fg)">Play() Stop()</text>
    <text x="140" y="456" text-anchor="middle" style="font-size:18px;fill:var(--muted)">음악 재생 · 정지</text>
    <rect x="270" y="340" width="200" height="130" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="370" y="374" text-anchor="middle" style="fill:var(--ok);font-weight:700">Video</text>
    <text x="370" y="398" text-anchor="middle" style="font-size:18px;fill:var(--muted)">: IPlayable</text>
    <text x="370" y="430" text-anchor="middle" style="fill:var(--fg)">Play() Stop()</text>
    <text x="370" y="456" text-anchor="middle" style="font-size:18px;fill:var(--muted)">영상 재생 · 정지</text>
    <rect x="500" y="340" width="200" height="130" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="600" y="374" text-anchor="middle" style="fill:var(--ok);font-weight:700">Game</text>
    <text x="600" y="398" text-anchor="middle" style="font-size:18px;fill:var(--muted)">: IPlayable</text>
    <text x="600" y="430" text-anchor="middle" style="fill:var(--fg)">Play() Stop()</text>
    <text x="600" y="456" text-anchor="middle" style="font-size:18px;fill:var(--muted)">게임 실행 · 종료</text>
  </g>
  <rect x="800" y="60" width="440" height="210" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1020" y="98" text-anchor="middle" style="${MONO};font-size:23px;font-weight:700;fill:var(--ok)">static void Run(IPlayable p)</text>
  <text x="830" y="140" style="${MONO};font-size:22px;fill:var(--fg)">{</text>
  <text x="870" y="174" style="${MONO};font-size:22px;fill:var(--fg)">p.Play();</text>
  <text x="870" y="208" style="${MONO};font-size:22px;fill:var(--fg)">p.Stop();</text>
  <text x="830" y="242" style="${MONO};font-size:22px;fill:var(--fg)">}</text>
  <text x="1020" y="305" text-anchor="middle" style="font-size:20px;fill:var(--muted)">Run 은 IPlayable 만 안다 — Music 인지 Game 인지 몰라도 된다</text>
  <line x1="710" y1="400" x2="820" y2="290" stroke="var(--ok)" stroke-width="4" marker-end="url(#ah9d)"/>
  <text x="1020" y="400" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Run(new Music());  Run(new Game());</text>
  <text x="1020" y="440" text-anchor="middle" style="font-size:20px;fill:var(--muted)">규격(인터페이스)만 맞으면 어떤 클래스든 꽂힌다</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:22px;fill:var(--fg)">인터페이스 = <tspan font-weight="700">플러그 규격</tspan>. 서로 관계없는 클래스에 같은 능력을 약속하고, 한 클래스가 여러 규격을 동시에 만족할 수도 있다(다중 구현)</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch09',
    no: '09',
    title: '상속 · 다형성 · 인터페이스',
    subtitle: 'Inheritance · Polymorphism · Interfaces',
    summary: '기존 클래스를 물려받아 새 클래스를 만드는 상속, 부모 형식 변수로 여러 자식 객체를 한 번에 다루는 다형성, 그리고 “무엇을 할 수 있는가”를 약속하는 추상 클래스와 인터페이스를 배웁니다. 객체 지향의 핵심이자 WPF 파트에서 매일 만나는 개념입니다.',
    goals: [
      '상속(class Dog : Animal)으로 중복을 없애고 base 생성자 · protected 를 사용할 수 있다',
      'virtual · override · base 로 메서드를 재정의하고 다형성의 동작을 설명할 수 있다',
      'object · ToString · Equals 재정의, sealed 와 new 숨기기의 의미를 설명할 수 있다',
      'abstract 클래스와 인터페이스를 정의 · 구현하고 둘의 차이를 설명할 수 있다',
      'is · as · 패턴 매칭으로 형식을 검사하고, IComparable<T> 같은 인터페이스를 활용할 수 있다'
    ],
    sections: [
      /* ===================== ch09-1 ===================== */
      {
        id: 'ch09-1',
        title: '상속과 메서드 재정의',
        minutes: 50,
        goals: [
          '상속이 필요한 이유(중복 제거 · is-a 관계)를 설명할 수 있다',
          'class Dog : Animal 로 상속하고 base 생성자 · protected 멤버를 사용할 수 있다',
          'virtual · override · base.Method() 로 메서드를 재정의할 수 있다',
          '부모 형식 변수와 배열로 자식 객체를 다루는 다형성을 설명할 수 있다',
          'object · ToString · Equals 재정의, sealed · new 의 뜻을 안다'
        ],
        flow: [['도입: 똑같은 코드가 반복되는 클래스', 5], ['상속 · base 생성자 · protected', 12], ['virtual · override · 다형성', 15], ['object · sealed · new', 8], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '왜 상속이 필요할까?' },
          { type: 'p', html: '8장에서 만든 클래스로 동물 관리 프로그램을 만든다고 합시다. <code>Dog</code> 에도 <code>Cat</code> 에도 <code>Name</code>, <code>Age</code>, <code>Eat()</code>, <code>Sleep()</code> 이 필요합니다. 클래스마다 똑같이 복사해 넣으면 동물이 열 종류일 때 <b>같은 코드가 열 번</b> 들어가고, <code>Eat()</code> 을 한 번 고치려면 열 군데를 고쳐야 합니다.' },
          { type: 'p', html: '<b>상속(inheritance)</b>은 공통된 부분을 <b>부모 클래스</b>에 한 번만 쓰고, <b>자식 클래스</b>가 그것을 <b>물려받아</b> 자기만의 것을 더하는 방법입니다. “개는 동물이다”, “고양이는 동물이다”처럼 <b>“A 는 B 이다(is-a)”</b> 라고 말할 수 있을 때 A 가 B 를 상속합니다.' },
          { type: 'figure', html: SVG_INHERIT, caption: '상속 계층(UML 스타일): 화살표는 “~를 상속한다”. 자식은 부모의 멤버를 물려받고, 자기 멤버를 더하고, 동작을 바꾼다' },
          { type: 'table', head: ['용어', '다른 이름', '뜻'], rows: [
            ['<b>부모 클래스</b>', '기반(base) · 상위(super) 클래스', '물려주는 쪽. <code>Animal</code>'],
            ['<b>자식 클래스</b>', '파생(derived) · 하위(sub) 클래스', '물려받는 쪽. <code>Dog : Animal</code>'],
            ['<b>상속한다</b>', '확장한다(extends), 파생한다', '<code>class 자식 : 부모</code> — 콜론 뒤에 부모 이름 하나'],
            ['<b>is-a 관계</b>', '—', '“Dog 는 Animal 이다”가 자연스러우면 상속. 어색하면(“자동차는 엔진이다”✗) 상속하지 않음']
          ], caption: '상속 용어 — 교재마다 이름이 다르지만 모두 같은 뜻' },
          { type: 'code', title: '예제 9-1. 상속 — Animal 을 물려받는 Dog 와 Cat', code: `using System;

class Animal                             // 부모 클래스: 공통 멤버를 한 번만 쓴다
{
    public string Name { get; set; }
    public int Age { get; set; }

    public void Eat()
    {
        Console.WriteLine($"{Name}: 먹이를 먹습니다.");
    }

    public void Sleep()
    {
        Console.WriteLine($"{Name}: 잠을 잡니다.");
    }
}

class Dog : Animal                       // Dog 는 Animal 을 상속한다 (Dog is an Animal)
{
    public void Fetch()                  // Dog 만의 동작을 추가
    {
        Console.WriteLine($"{Name}: 공을 물어 옵니다.");
    }
}

class Cat : Animal
{
    public void Scratch()
    {
        Console.WriteLine($"{Name}: 발톱으로 긁습니다.");
    }
}

class Program
{
    static void Main()
    {
        Dog d = new Dog();
        d.Name = "바둑이";               // Animal 에서 물려받은 속성
        d.Age = 3;
        d.Eat();                         // 물려받은 메서드
        d.Fetch();                       // Dog 자신의 메서드

        Cat c = new Cat();
        c.Name = "나비";
        c.Sleep();
        c.Scratch();
        // c.Fetch();                    // 오류 CS1061: Cat 에는 Fetch 가 없다

        Console.WriteLine($"{d.Name} {d.Age}살, {c.Name}");
    }
}`, expect: `바둑이: 먹이를 먹습니다.
바둑이: 공을 물어 옵니다.
나비: 잠을 잡니다.
나비: 발톱으로 긁습니다.
바둑이 3살, 나비`, desc: '<code>class Dog : Animal</code> — 콜론 한 글자로 <code>Dog</code> 는 <code>Animal</code> 의 <code>Name</code> · <code>Age</code> · <code>Eat</code> · <code>Sleep</code> 을 <b>모두 갖게</b> 됩니다. <code>Dog</code> 클래스 안에는 <code>Fetch</code> 만 썼지만 <code>d.Eat()</code> 이 됩니다. 반대로 부모(<code>Animal</code>)나 형제(<code>Cat</code>)는 <code>Fetch</code> 를 모릅니다.' },
          { type: 'callout', kind: 'warn', title: 'C# 클래스는 부모가 하나뿐 (단일 상속)', html: '<code>class Dog : Animal, Pet</code> 처럼 <b>클래스 두 개를 동시에 상속할 수 없습니다</b>(CS1721). 대신 부모의 부모를 만들 수는 있습니다: <code>Animal → Mammal → Dog</code>. 여러 “능력”을 동시에 갖게 하려면 다음 교시의 <b>인터페이스</b>를 씁니다(인터페이스는 여러 개 구현 가능).' },
          { type: 'h', text: '생성자와 base — 부모부터 만든다' },
          { type: 'p', html: '자식 객체를 만들면 <b>부모 부분이 먼저 만들어지고</b>(부모 생성자 실행) 그 다음 자식 생성자가 실행됩니다. 부모 생성자에 매개변수가 있으면 자식 생성자 뒤에 <b><code>: base(인수…)</code></b> 를 붙여 어떤 값을 넘길지 알려 줍니다. 8장의 <code>: this(…)</code>(같은 클래스의 다른 생성자)와 모양이 같습니다.' },
          { type: 'p', html: '접근 제한자 <b><code>protected</code></b> 는 <code>private</code> 과 <code>public</code> 의 중간입니다. <b>클래스 밖에서는 못 보지만 자식 클래스는 볼 수 있습니다.</b> 자식이 직접 다뤄야 하는 필드에 씁니다.' },
          { type: 'table', head: ['접근 제한자', '같은 클래스', '자식 클래스', '클래스 밖(Main 등)'], rows: [
            ['<code>private</code> (기본값)', '○', '✗', '✗'],
            ['<code>protected</code>', '○', '<b>○</b>', '✗'],
            ['<code>public</code>', '○', '○', '○']
          ], caption: 'private 은 자식에게도 숨긴다 — 자식에게만 열어 주려면 protected' },
          { type: 'code', title: '예제 9-2. base 생성자 호출과 protected 멤버', code: `using System;

class Animal
{
    protected string name;               // protected: 자식 클래스까지 접근 가능
    protected int age;

    public Animal(string name, int age)
    {
        this.name = name;
        this.age = age;
        Console.WriteLine($"Animal 생성자: {name}");
    }

    public void Introduce()
    {
        Console.WriteLine($"저는 {name}, {age}살입니다.");
    }
}

class Dog : Animal
{
    private string breed;                // Dog 만의 필드

    public Dog(string name, int age, string breed) : base(name, age)   // 부모 생성자를 먼저 호출
    {
        this.breed = breed;
        Console.WriteLine($"Dog 생성자: {breed}");
    }

    public void ShowBreed()
    {
        Console.WriteLine($"{name}의 품종은 {breed}입니다.");   // protected 필드 name 을 자식이 사용
    }
}

class Program
{
    static void Main()
    {
        Dog d = new Dog("바둑이", 3, "진돗개");
        d.Introduce();
        d.ShowBreed();
        // Console.WriteLine(d.name);    // 오류 CS0122: protected 는 클래스 밖에서 접근 불가
    }
}`, expect: `Animal 생성자: 바둑이
Dog 생성자: 진돗개
저는 바둑이, 3살입니다.
바둑이의 품종은 진돗개입니다.`, desc: '출력 순서를 보세요. <code>new Dog(…)</code> 한 번에 <b>Animal 생성자 → Dog 생성자</b> 순으로 실행됩니다(<code>1행</code>, <code>2행</code>). <code>: base(name, age)</code> 가 이름과 나이를 부모에게 넘기고, <code>Dog</code> 생성자는 자기 필드 <code>breed</code> 만 챙깁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — base(…) 를 생략하면?', html: '<code>: base(…)</code> 를 쓰지 않으면 컴파일러가 <b>부모의 매개변수 없는 생성자</b> <code>base()</code> 를 자동으로 호출합니다. 예제 9-1 에서 아무 생성자도 쓰지 않았는데 잘 된 이유입니다. 그런데 부모에 <code>Animal(string, int)</code> 처럼 매개변수 있는 생성자<b>만</b> 있으면 매개변수 없는 생성자가 사라지므로, 자식은 반드시 <code>: base(…)</code> 로 어떤 값을 넘길지 적어야 합니다(안 적으면 CS7036 오류).' },
          { type: 'h', text: '메서드 재정의 — virtual 과 override' },
          { type: 'p', html: '물려받은 메서드가 자식에게 맞지 않을 때가 있습니다. 모든 동물이 <code>Speak()</code> 를 하지만 개는 “멍멍”, 고양이는 “야옹”입니다. 부모 메서드에 <b><code>virtual</code></b>(“바꿔 써도 된다”)을, 자식 메서드에 <b><code>override</code></b>(“새로 정의한다”)를 붙이면 자식이 <b>부모의 동작을 자기 것으로 바꿉니다</b>. 이를 <b>재정의(overriding)</b>라고 합니다. 재정의한 메서드 안에서 <b><code>base.Speak()</code></b> 를 부르면 부모의 원래 동작도 함께 실행할 수 있습니다.' },
          { type: 'code', title: '예제 9-3. virtual · override · base.Speak()', code: `using System;

class Animal
{
    public string Name { get; set; }

    public Animal(string name) { Name = name; }

    public virtual void Speak()          // virtual: 자식이 바꿔 쓸 수 있게 허용
    {
        Console.WriteLine($"{Name}: (동물 소리)");
    }
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }

    public override void Speak()         // override: 부모의 동작을 새로 정의
    {
        Console.WriteLine($"{Name}: 멍멍!");
    }
}

class Cat : Animal
{
    public Cat(string name) : base(name) { }

    public override void Speak()
    {
        base.Speak();                    // 부모의 원래 동작을 먼저 실행하고
        Console.WriteLine($"{Name}: 야옹~");   // 자기 동작을 덧붙인다
    }
}

class Fish : Animal                      // 재정의하지 않으면 부모 것을 그대로 쓴다
{
    public Fish(string name) : base(name) { }
}

class Program
{
    static void Main()
    {
        Animal a = new Animal("동물");
        Dog d = new Dog("바둑이");
        Cat c = new Cat("나비");
        Fish f = new Fish("금붕어");

        a.Speak();
        d.Speak();
        c.Speak();
        f.Speak();
    }
}`, expect: `동물: (동물 소리)
바둑이: 멍멍!
나비: (동물 소리)
나비: 야옹~
금붕어: (동물 소리)`, desc: '<code>Dog</code> 는 부모 동작을 완전히 바꿨고, <code>Cat</code> 은 <code>base.Speak()</code> 로 부모 동작을 실행한 뒤 덧붙였습니다. <code>Fish</code> 처럼 재정의하지 않으면 물려받은 그대로입니다. 8장의 <code>public override string ToString()</code> 이 바로 이 문법이었습니다 — <code>object</code> 가 <code>virtual</code> 로 준비해 둔 메서드를 우리가 <code>override</code> 한 것입니다.' },
          { type: 'callout', kind: 'warn', title: 'virtual 없는 메서드는 override 할 수 없다', html: '부모 메서드에 <code>virtual</code> 이 없는데 자식에서 <code>override</code> 를 쓰면 <b>CS0506</b> 오류입니다. 반대로 <code>override</code> 를 빼고 부모와 같은 이름의 메서드를 쓰면 컴파일은 되지만 <b>CS0108 경고</b>와 함께 부모 메서드를 “숨기는” 전혀 다른 동작이 됩니다(아래 <code>new</code> 숨기기 참고). 재정의할 때는 <b>부모에 virtual, 자식에 override</b> 를 짝으로 기억하세요.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 재정의할 메서드 고르기', html: '자식 클래스 안에서 <code>override</code> 를 입력하고 <b>스페이스</b>를 누르면 <b>재정의할 수 있는 부모 멤버 목록</b>(<code>Speak()</code>, <code>ToString()</code>, <code>Equals(object)</code> …)이 IntelliSense 로 나타납니다. 하나를 고르면 <code>base.…</code> 를 호출하는 뼈대까지 자동으로 만들어집니다. 클래스 이름에서 <b>F12</b>(정의로 이동)를 누르면 부모 클래스의 코드로 이동합니다.' },
          { type: 'h', text: '다형성 — 부모 형식 변수에 자식 객체 담기' },
          { type: 'p', html: '“개는 동물이다”가 참이므로 <b>Animal 형식 변수에 Dog 객체를 담을 수 있습니다</b>: <code>Animal pet = new Dog("바둑이");</code>. 이때 <code>pet.Speak()</code> 를 부르면 무엇이 실행될까요? 변수의 형식은 <code>Animal</code> 이지만 <b>실제 객체가 Dog 이므로 Dog 의 Speak</b> 가 실행됩니다. 같은 호출 <code>a.Speak()</code> 가 객체마다 다르게 동작하는 것 — 이것이 <b>다형성(polymorphism, “여러 모습”)</b>입니다.' },
          { type: 'figure', html: SVG_POLY, caption: 'Animal[] 배열의 칸은 모두 Animal 형식이지만 각 칸이 가리키는 실제 객체가 다르므로, 같은 a.Speak() 가 다른 결과를 낸다' },
          { type: 'code', title: '예제 9-4. 다형성 — Animal 배열 순회와 메서드 매개변수', code: `using System;
using System.Collections.Generic;

class Animal
{
    public string Name { get; set; }
    public Animal(string name) { Name = name; }
    public virtual void Speak() { Console.WriteLine($"{Name}: ..."); }
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public override void Speak() { Console.WriteLine($"{Name}: 멍멍!"); }
    public void Fetch() { Console.WriteLine($"{Name}: 공을 물어 왔어요"); }
}

class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public override void Speak() { Console.WriteLine($"{Name}: 야옹~"); }
}

class Cow : Animal
{
    public Cow(string name) : base(name) { }
    public override void Speak() { Console.WriteLine($"{Name}: 음메~"); }
}

class Program
{
    static void MakeSpeakTwice(Animal a)   // 어떤 Animal(의 자식)이든 받는다
    {
        a.Speak();
        a.Speak();
    }

    static void Main()
    {
        Animal pet = new Dog("바둑이");     // 부모 형식 변수에 자식 객체 (업캐스팅, 자동)
        pet.Speak();                       // 실제 객체(Dog)의 Speak 가 실행된다
        // pet.Fetch();                    // 오류 CS1061: Animal 형식으로 보면 Fetch 가 없다

        Animal[] zoo = { new Dog("바둑이"), new Cat("나비"), new Cow("얼룩이"), new Animal("???") };
        Console.WriteLine("--- 동물원 순회 ---");
        foreach (Animal a in zoo)
            a.Speak();                     // 같은 코드, 객체마다 다른 결과 = 다형성

        Console.WriteLine("--- 메서드에 전달 ---");
        MakeSpeakTwice(new Cat("야옹이"));

        List<Animal> list = new List<Animal> { new Cow("젖소"), new Dog("흰둥이") };
        Console.WriteLine($"목록 {list.Count}마리: {list[0].GetType().Name}, {list[1].GetType().Name}");
    }
}`, expect: `바둑이: 멍멍!
--- 동물원 순회 ---
바둑이: 멍멍!
나비: 야옹~
얼룩이: 음메~
???: ...
--- 메서드에 전달 ---
야옹이: 야옹~
야옹이: 야옹~
목록 2마리: Cow, Dog`, desc: '다형성의 힘은 <b>새 동물을 추가해도 순회 코드(<code>foreach … a.Speak()</code>)는 한 글자도 바꿀 필요가 없다</b>는 데 있습니다. 매개변수가 <code>Animal</code> 인 메서드는 모든 자식을 받습니다. 단, <code>Animal</code> 형식으로 보는 동안은 <b>Animal 에 있는 멤버만</b> 쓸 수 있습니다(<code>pet.Fetch()</code> 는 오류) — 자식 멤버를 쓰려면 다음 교시의 <code>is</code>/<code>as</code> 로 되돌려야 합니다. <code>GetType().Name</code> 은 실제 객체의 클래스 이름을 알려 줍니다.' },
          { type: 'callout', kind: 'tip', title: '상속(is-a)인가, 포함(has-a)인가?', html: '“자동차는 엔진이다”는 어색하고 “자동차는 엔진을 <b>가진다</b>”가 자연스럽습니다. 이런 관계는 상속이 아니라 <b>필드로 포함</b>합니다: <code>class Car { Engine engine = new Engine(); }</code>. 상속은 <b>is-a 가 자연스러울 때만</b> 쓰고, 그 밖에는 포함(composition)이 더 단순하고 안전합니다.' },
          { type: 'h', text: 'object — 모든 클래스의 부모' },
          { type: 'p', html: '부모를 쓰지 않은 클래스도 사실은 <b><code>object</code></b>(<code>System.Object</code>)를 상속합니다. 그래서 <b>모든 객체</b>가 <code>ToString()</code>, <code>Equals()</code>, <code>GetHashCode()</code>, <code>GetType()</code> 을 가지고 있고, <code>object</code> 형식 변수에는 무엇이든 담을 수 있습니다. <code>ToString</code> 과 <code>Equals</code> 는 <code>virtual</code> 이므로 우리가 <code>override</code> 할 수 있습니다.' },
          { type: 'code', title: '예제 9-5. object · ToString · Equals 재정의', code: `using System;

class Point
{
    public int X { get; }
    public int Y { get; }

    public Point(int x, int y) { X = x; Y = y; }

    public override string ToString()          // object.ToString() 재정의
    {
        return $"({X}, {Y})";
    }

    public override bool Equals(object obj)    // object.Equals() 재정의: 내용이 같으면 같다
    {
        if (obj is Point other)                // obj 가 Point 이면 other 에 담는다 (다음 교시)
            return X == other.X && Y == other.Y;
        return false;
    }

    public override int GetHashCode()          // Equals 를 재정의하면 함께 재정의한다 (규칙)
    {
        return X * 1000 + Y;
    }
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(3, 4);
        Point p2 = new Point(3, 4);
        Point p3 = p1;

        Console.WriteLine(p1);                 // ToString() 자동 호출
        Console.WriteLine(p1 == p2);           // False: == 는 참조(주소) 비교 (8장)
        Console.WriteLine(p1.Equals(p2));      // True : 재정의한 Equals 가 내용을 비교
        Console.WriteLine(p1 == p3);           // True : 같은 객체

        object o = p1;                         // 모든 클래스는 object 의 자식
        Console.WriteLine(o.ToString());
        Console.WriteLine(o.GetType().Name);   // 실제 형식은 Point
        Console.WriteLine(p1.GetHashCode() == p2.GetHashCode());

        object[] things = { 10, "문자열", 3.5, p2 };   // 무엇이든 object 에 담긴다
        foreach (object t in things)
            Console.WriteLine($"{t} ({t.GetType().Name})");
    }
}`, expect: `(3, 4)
False
True
True
(3, 4)
Point
True
10 (Int32)
문자열 (String)
3.5 (Double)
(3, 4) (Point)`, desc: '<code>==</code> 는 여전히 참조를 비교하지만, <code>Equals</code> 를 재정의하면 <code>List.Contains</code>, <code>IndexOf</code>, <code>Dictionary</code> 키 비교가 <b>내용 기준</b>으로 동작합니다. <code>Equals</code> 가 같다고 하는 두 객체는 <code>GetHashCode</code> 도 같아야 한다는 규칙이 있어 둘을 항상 함께 재정의합니다. <code>int</code> · <code>string</code> · <code>double</code> 까지 모두 <code>object</code> 의 자식이라 한 배열에 담을 수 있습니다.' },
          { type: 'h', text: 'sealed 와 new — 상속을 막거나, 숨기거나' },
          { type: 'list', items: [
            '<b><code>sealed class</code></b>: 이 클래스는 <b>더 이상 상속할 수 없다</b>. <code>string</code> 이 대표적인 sealed 클래스입니다.',
            '<b><code>sealed override</code></b>: 이 메서드는 여기까지만 재정의하고 <b>자식은 더 못 바꾼다</b>.',
            '<b><code>new</code> 한정자</b>: 부모 메서드를 재정의하는 것이 아니라 <b>가려서 숨긴다</b>. 변수의 형식에 따라 다른 메서드가 호출되므로 다형성이 깨집니다. 부모 코드를 못 고칠 때(virtual 이 없을 때) 드물게 씁니다.'
          ] },
          { type: 'code', title: '추가 예제. sealed 와 new 숨기기 — override 와 무엇이 다른가', code: `using System;

class Animal
{
    public virtual void Speak() { Console.WriteLine("동물 소리"); }
    public void Info() { Console.WriteLine("Animal.Info"); }
}

class Dog : Animal
{
    public sealed override void Speak() { Console.WriteLine("멍멍!"); }   // 더 이상 재정의 금지
    public new void Info() { Console.WriteLine("Dog.Info (숨기기)"); }     // 부모 메서드를 숨긴다
}

sealed class Puppy : Dog                 // sealed 클래스: 상속 금지
{
    // public override void Speak() { }  // 오류 CS0239: sealed 메서드는 재정의 불가
}

// class Baby : Puppy { }                // 오류 CS0509: sealed 클래스는 상속 불가

class Program
{
    static void Main()
    {
        Dog d = new Dog();
        Animal a = d;                    // 같은 객체를 Animal 형식으로 본다

        d.Speak();                       // override: 어느 형식으로 봐도 Dog 의 것
        a.Speak();

        d.Info();                        // new: 변수의 형식에 따라 달라진다
        a.Info();

        new Puppy().Speak();
    }
}`, expect: `멍멍!
멍멍!
Dog.Info (숨기기)
Animal.Info
멍멍!`, desc: '<code>d</code> 와 <code>a</code> 는 <b>같은 객체</b>입니다. <code>override</code> 한 <code>Speak</code> 는 어느 형식으로 보든 Dog 의 것이 실행되지만, <code>new</code> 로 숨긴 <code>Info</code> 는 <b>변수의 형식</b>이 Animal 이면 Animal 의 것이 실행됩니다. 이래서 “바꿔 쓰기”는 거의 항상 <code>override</code> 로 합니다.' },
          { type: 'table', head: ['키워드', '어디에', '뜻'], rows: [
            ['<code>: 부모</code>', '클래스 선언', '상속한다. 부모는 하나'],
            ['<code>base(…)</code> / <code>base.멤버</code>', '생성자 / 메서드 안', '부모 생성자 호출 / 부모 멤버 호출'],
            ['<code>protected</code>', '멤버', '자식 클래스까지만 공개'],
            ['<code>virtual</code>', '부모 메서드', '자식이 바꿔 써도 된다'],
            ['<code>override</code>', '자식 메서드', '부모의 virtual/abstract 메서드를 새로 정의'],
            ['<code>sealed</code>', '클래스 / override 메서드', '더 이상 상속 · 재정의 금지'],
            ['<code>new</code>', '자식 메서드', '부모 멤버를 숨김 (다형성 없음, 드물게 사용)']
          ], caption: '상속 관련 키워드 한눈에 보기' }
        ],
        practice: [
          {
            title: '실습 9-1. 도형 넓이 — Shape 를 상속하는 Circle 과 Rect',
            level: 1,
            desc: '<p>부모 <code>Shape</code> 의 <code>Area()</code> 는 0 을 돌려주는 <code>virtual</code> 메서드입니다. <code>Circle</code>(반지름 r)과 <code>Rect</code>(가로 w, 세로 h)에서 <code>Area()</code> 를 <b>재정의</b>하고, <code>Main</code> 에서 배열을 순회하며 각 도형의 이름과 넓이(소수점 2자리), 합계를 출력하세요.</p><pre>원: 넓이 12.57\n사각형: 넓이 12.00\n도형: 넓이 0.00\n합계: 24.57</pre>',
            hint: '<code>public override double Area() { return Math.PI * r * r; }</code>. 출력은 <code>$"{s.Name}: 넓이 {s.Area():F2}"</code>.',
            starter: `using System;

class Shape
{
    public string Name { get; set; }
    public Shape(string name) { Name = name; }
    public virtual double Area() { return 0; }      // 기본: 넓이 0
}

class Circle : Shape
{
    private double r;
    public Circle(double r) : base("원") { this.r = r; }
    // TODO: Area() 재정의 → Math.PI * r * r
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) : base("사각형") { this.w = w; this.h = h; }
    // TODO: Area() 재정의 → w * h
}

class Program
{
    static void Main()
    {
        Shape[] shapes = { new Circle(2), new Rect(3, 4), new Shape("도형") };
        // TODO: 각 도형의 "이름: 넓이 xx.xx" 출력, 마지막에 "합계: xx.xx" 출력
    }
}
`,
            solution: `using System;

class Shape
{
    public string Name { get; set; }
    public Shape(string name) { Name = name; }
    public virtual double Area() { return 0; }
}

class Circle : Shape
{
    private double r;
    public Circle(double r) : base("원") { this.r = r; }
    public override double Area() { return Math.PI * r * r; }
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) : base("사각형") { this.w = w; this.h = h; }
    public override double Area() { return w * h; }
}

class Program
{
    static void Main()
    {
        Shape[] shapes = { new Circle(2), new Rect(3, 4), new Shape("도형") };
        double total = 0;
        foreach (Shape s in shapes)
        {
            Console.WriteLine($"{s.Name}: 넓이 {s.Area():F2}");
            total += s.Area();
        }
        Console.WriteLine($"합계: {total:F2}");
    }
}
`,
            expect: `원: 넓이 12.57
사각형: 넓이 12.00
도형: 넓이 0.00
합계: 24.57`
          },
          {
            title: '실습 9-2. 급여 계산 — Employee 를 상속하는 Manager 와 Intern',
            level: 2,
            desc: '<p><code>Employee</code>(이름, 기본급)의 <code>GetPay()</code> 는 기본급을 돌려줍니다. 다음 두 자식 클래스를 만들고 목록을 순회하며 급여와 총액을 출력하세요.</p><ul><li><code>Manager</code>: <code>Bonus</code> 속성을 추가하고 <code>GetPay()</code> = <b>기본급 + 보너스</b> (<code>base.GetPay()</code> 활용)</li><li><code>Intern</code>: <code>GetPay()</code> = <b>기본급의 절반</b></li></ul><pre>김사원 (Employee): 3,000,000원\n박부장 (Manager): 6,000,000원\n이인턴 (Intern): 1,000,000원\n총 급여: 10,000,000원</pre>',
            hint: '<code>public Manager(string name, int baseSalary, int bonus) : base(name, baseSalary) { Bonus = bonus; }</code>, <code>public override int GetPay() { return base.GetPay() + Bonus; }</code>. <code>ToString</code> 은 부모 것을 그대로 물려받아 쓰면 됩니다.',
            starter: `using System;
using System.Collections.Generic;

class Employee
{
    public string Name { get; set; }
    public int BaseSalary { get; set; }

    public Employee(string name, int baseSalary)
    {
        Name = name;
        BaseSalary = baseSalary;
    }

    public virtual int GetPay() { return BaseSalary; }

    public override string ToString() { return $"{Name} ({GetType().Name}): {GetPay():N0}원"; }
}

class Manager : Employee
{
    // TODO: Bonus 속성
    public Manager(string name, int baseSalary, int bonus) : base(name, baseSalary)
    {
        // TODO: Bonus 저장
    }
    // TODO: GetPay() 재정의 → 기본급 + 보너스
}

// TODO: Intern 클래스 — GetPay() = 기본급 / 2

class Program
{
    static void Main()
    {
        List<Employee> staff = new List<Employee>
        {
            new Employee("김사원", 3000000),
            new Manager("박부장", 5000000, 1000000),
            // new Intern("이인턴", 2000000),   // TODO: Intern 을 만든 뒤 주석 해제
        };
        int total = 0;
        foreach (Employee e in staff)
        {
            Console.WriteLine(e);
            total += e.GetPay();
        }
        Console.WriteLine($"총 급여: {total:N0}원");
    }
}
`,
            solution: `using System;
using System.Collections.Generic;

class Employee
{
    public string Name { get; set; }
    public int BaseSalary { get; set; }

    public Employee(string name, int baseSalary)
    {
        Name = name;
        BaseSalary = baseSalary;
    }

    public virtual int GetPay() { return BaseSalary; }

    public override string ToString() { return $"{Name} ({GetType().Name}): {GetPay():N0}원"; }
}

class Manager : Employee
{
    public int Bonus { get; set; }

    public Manager(string name, int baseSalary, int bonus) : base(name, baseSalary)
    {
        Bonus = bonus;
    }

    public override int GetPay() { return base.GetPay() + Bonus; }
}

class Intern : Employee
{
    public Intern(string name, int baseSalary) : base(name, baseSalary) { }

    public override int GetPay() { return BaseSalary / 2; }
}

class Program
{
    static void Main()
    {
        List<Employee> staff = new List<Employee>
        {
            new Employee("김사원", 3000000),
            new Manager("박부장", 5000000, 1000000),
            new Intern("이인턴", 2000000),
        };
        int total = 0;
        foreach (Employee e in staff)
        {
            Console.WriteLine(e);
            total += e.GetPay();
        }
        Console.WriteLine($"총 급여: {total:N0}원");
    }
}
`,
            expect: `김사원 (Employee): 3,000,000원
박부장 (Manager): 6,000,000원
이인턴 (Intern): 1,000,000원
총 급여: 10,000,000원`
          }
        ],
        quiz: [
          { q: '<code>class Dog : Animal { }</code> 에서 <code>Animal</code> 을 부르는 이름은?', options: ['자식(파생) 클래스', '부모(기반) 클래스', '인터페이스', '구조체'], answer: 1, explain: '콜론 뒤의 클래스가 부모(기반, base) 클래스, 앞의 클래스가 자식(파생, derived) 클래스입니다.' },
          { q: '자식 클래스가 부모의 메서드를 재정의(override)할 수 있게 하려면 <b>부모</b> 메서드에 붙여야 하는 키워드는?', options: ['<code>static</code>', '<code>sealed</code>', '<code>virtual</code>', '<code>new</code>'], answer: 2, explain: '부모에 <code>virtual</code>, 자식에 <code>override</code> 를 짝으로 씁니다. virtual 이 없으면 CS0506 오류.' },
          { q: '다음 코드의 출력은?<pre><code>class Animal { public virtual void Speak() { Console.WriteLine("동물 소리"); } }\nclass Dog : Animal { public override void Speak() { Console.WriteLine("멍멍!"); } }\n\nAnimal a = new Dog();\na.Speak();</code></pre>', options: ['컴파일 오류', '실행 오류', '동물 소리', '멍멍!'], answer: 3, explain: '변수 형식은 Animal 이지만 실제 객체가 Dog 이므로 override 된 Dog.Speak 가 실행됩니다(다형성).' },
          { q: '자식 생성자에서 부모의 생성자에 값을 넘기는 문법은?', options: ['<code>: base(name, age)</code>', '<code>: this(name, age)</code>', '<code>super(name, age);</code>', '<code>Animal(name, age);</code>'], answer: 0, explain: '<code>: base(…)</code> 입니다. <code>: this(…)</code> 는 같은 클래스의 다른 생성자를 부를 때 씁니다.' },
          { q: '<code>protected</code> 멤버에 접근할 수 <b>있는</b> 곳은?', options: ['어디서나', '같은 클래스에서만', '같은 파일 안에서만', '같은 클래스와 그 자식 클래스'], answer: 3, explain: 'protected 는 private 에 “자식 클래스까지”를 더한 것입니다. Main 처럼 클래스 밖에서는 접근할 수 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '상속과 메서드 재정의', subtitle: 'Chapter 09 · Section 01 — 물려받고, 더하고, 바꾸기', badge: '09-1',
            notes: '<p><b>[도입 3분]</b> 지난 시간 Student 클래스를 떠올리게 한 뒤, “Dog 와 Cat 클래스를 만들면 Name · Age · Eat() 이 둘 다에 똑같이 들어간다. 동물이 열 종류면?” 이라고 묻습니다. 오늘 목표: 상속으로 중복 없애기, virtual/override 로 동작 바꾸기, 부모 형식 변수로 여러 자식을 한 번에 다루기(다형성).</p>' },
          { layout: 'bullets', title: '왜 상속인가?', lead: '공통 부분은 부모에 한 번만 — 자식은 물려받고 자기 것만 더한다',
            bullets: ['<code>Dog</code> · <code>Cat</code> 에 똑같은 <code>Name</code>, <code>Age</code>, <code>Eat()</code> → <b>중복</b>', '공통 멤버를 <code>Animal</code> 에 쓰고 <code>class Dog : Animal</code>', ['<b>is-a</b>: “개는 동물이다” 가 자연스러울 때만 상속', ['“자동차는 엔진이다”✗ → 필드로 포함(has-a)']], '부모 = 기반(base) 클래스, 자식 = 파생(derived) 클래스', 'C# 클래스는 <b>부모가 하나</b> (인터페이스는 여러 개 — 다음 교시)'],
            notes: '<p><b>[4분]</b> 발문: “학생 · 교사 · 직원 클래스의 공통 부모는?” → Person. “Person 에 들어갈 것은?” → 이름, 나이. is-a 판정 연습을 2~3개 시켜 보세요(사각형-도형 ○, 바퀴-자동차 ✗).</p>' },
          { layout: 'diagram', title: '상속 계층 (UML)', html: SVG_INHERIT, caption: '화살표 = “~를 상속한다”. 자식은 부모 멤버를 물려받고(재사용), 더하고(확장), 바꾼다(재정의)',
            notes: '<p><b>[4분]</b> 위에서 아래로 짚으며: Animal 의 멤버 4개는 Dog · Cat 에 “보이지 않지만 들어 있다”. Fetch 는 Dog 에만. Speak 옆의 virtual/override 는 잠시 뒤에 설명한다고 예고.</p>' },
          { layout: 'code', title: '예제 9-1. class Dog : Animal', code: `using System;

class Animal
{
    public string Name { get; set; }
    public void Eat() { Console.WriteLine($"{Name}: 먹이를 먹습니다."); }
}

class Dog : Animal                       // Dog 는 Animal 을 물려받는다
{
    public void Fetch() { Console.WriteLine($"{Name}: 공을 물어 옵니다."); }
}

class Cat : Animal
{
    public void Scratch() { Console.WriteLine($"{Name}: 발톱으로 긁습니다."); }
}

class Program
{
    static void Main()
    {
        Dog d = new Dog { Name = "바둑이" };
        d.Eat();          // 물려받은 것
        d.Fetch();        // 자기 것
        Cat c = new Cat { Name = "나비" };
        c.Eat();
        c.Scratch();
    }
}`, points: ['<code>: Animal</code> 한 마디로 Name · Eat 을 모두 가진다', '<code>Dog</code> 안에는 <b>추가분</b>만 쓴다', '<code>c.Fetch()</code> 는 오류 — 형제의 것은 없다'],
            notes: '<p><b>[5분]</b> 실행 후 학생에게 <code>c.Fetch()</code> 를 넣어 보게 해서 CS1061 을 확인. “Dog 클래스 코드 어디에 Name 이 있나?” → 없지만 물려받았다.</p>' },
          { layout: 'code', title: '예제 9-2. base 생성자 · protected', code: `using System;

class Animal
{
    protected string name;               // 자식까지 접근 가능
    public Animal(string name)
    {
        this.name = name;
        Console.WriteLine($"Animal 생성자: {name}");
    }
}

class Dog : Animal
{
    private string breed;
    public Dog(string name, string breed) : base(name)   // 부모 생성자 먼저
    {
        this.breed = breed;
        Console.WriteLine($"Dog 생성자: {breed}");
    }
    public void Show() { Console.WriteLine($"{name}은(는) {breed}"); }
}

class Program
{
    static void Main()
    {
        new Dog("바둑이", "진돗개").Show();
    }
}`, points: ['객체 생성 순서: <b>부모 생성자 → 자식 생성자</b>', '<code>: base(name)</code> 으로 부모에 값 전달', '<code>protected</code>: 밖에서는 ✗, 자식은 ○'],
            notes: '<p><b>[6분]</b> 출력 순서(Animal 먼저)를 예측하게 한 뒤 실행. <code>: base(name)</code> 을 지우면 CS7036 이 나는 것을 시연 — “부모에 매개변수 없는 생성자가 없으니 무엇을 넘길지 알려 줘야 한다”. 접근 제한자 표(private/protected/public)를 칠판에 3행으로.</p>' },
          { layout: 'code', title: '예제 9-3. virtual · override · base', code: `using System;

class Animal
{
    public virtual void Speak() { Console.WriteLine("(동물 소리)"); }
}

class Dog : Animal { public override void Speak() { Console.WriteLine("멍멍!"); } }

class Cat : Animal
{
    public override void Speak()
    {
        base.Speak();                    // 부모 것도 실행
        Console.WriteLine("야옹~");
    }
}

class Fish : Animal { }                  // 재정의 안 하면 부모 것 그대로

class Program
{
    static void Main()
    {
        new Dog().Speak();
        new Cat().Speak();
        new Fish().Speak();
    }
}`, points: ['부모: <code>virtual</code> “바꿔도 된다”', '자식: <code>override</code> “새로 정의한다”', '<code>base.Speak()</code> 로 부모 동작 재사용', '8장의 <code>override ToString()</code> 이 바로 이것'],
            notes: '<p><b>[6분]</b> 세 줄의 출력을 예측시킨 뒤 실행. virtual 을 지우면 CS0506, override 를 지우면 CS0108 경고 + 동작 변화 — 둘 다 시연하면 좋습니다. Visual Studio 에서 <code>override</code> + 스페이스로 목록이 뜨는 것도 보여 주세요.</p>' },
          { layout: 'diagram', title: '다형성 — 같은 호출, 다른 결과', html: SVG_POLY, caption: '칸(변수)의 형식은 Animal, 실행되는 Speak() 는 실제 객체의 것 (실행 시점에 결정)',
            notes: '<p><b>[4분]</b> 발문: “zoo[0] 의 형식은? 그 안의 실제 객체는?” 리모컨 비유: 리모컨(Animal 변수)의 버튼은 같지만 TV · 에어컨(실제 객체)마다 반응이 다르다.</p>' },
          { layout: 'code', title: '예제 9-4. Animal[] 배열 순회', code: `using System;

class Animal
{
    public string Name { get; set; }
    public virtual void Speak() { Console.WriteLine($"{Name}: ..."); }
}
class Dog : Animal { public override void Speak() { Console.WriteLine($"{Name}: 멍멍!"); } }
class Cat : Animal { public override void Speak() { Console.WriteLine($"{Name}: 야옹~"); } }
class Cow : Animal { public override void Speak() { Console.WriteLine($"{Name}: 음메~"); } }

class Program
{
    static void Main()
    {
        Animal pet = new Dog { Name = "바둑이" };   // 부모 형식 변수 ← 자식 객체
        pet.Speak();                                // Dog 의 Speak 실행

        Animal[] zoo = { new Dog { Name = "흰둥이" }, new Cat { Name = "나비" },
                         new Cow { Name = "얼룩이" }, new Animal { Name = "???" } };
        foreach (Animal a in zoo)
            a.Speak();                              // 같은 코드, 다른 결과
    }
}`, points: ['<code>Animal pet = new Dog()</code> — 업캐스팅(자동)', '배열 · List · 매개변수 모두 <code>Animal</code> 로', '새 동물을 추가해도 순회 코드는 그대로', 'Animal 로 보는 동안은 Animal 멤버만'],
            notes: '<p><b>[5분]</b> Pig 클래스를 즉석에서 추가해 배열에 넣어도 foreach 는 안 바뀐다는 것을 시연. <code>pet.Fetch()</code> 가 왜 오류인지 묻고 “다시 Dog 로 보는 법(is/as)은 다음 시간”이라고 예고.</p>' },
          { layout: 'table', title: '키워드 정리', head: ['키워드', '어디에', '뜻'], rows: [['<code>: 부모</code>', '클래스 선언', '상속 (부모는 하나)'], ['<code>base(…)</code> / <code>base.멤버</code>', '생성자 / 메서드', '부모 생성자 · 부모 멤버 호출'], ['<code>protected</code>', '멤버', '자식까지만 공개'], ['<code>virtual</code> / <code>override</code>', '부모 / 자식 메서드', '재정의 허용 / 재정의'], ['<code>sealed</code>', '클래스 · 메서드', '상속 · 재정의 금지'], ['<code>new</code>', '자식 메서드', '숨기기 (다형성 ✗)'], ['<code>object</code>', '모든 클래스의 부모', '<code>ToString</code> · <code>Equals</code> · <code>GetType</code>']],
            lead: '모든 클래스는 object 의 자식 — ToString · Equals 는 object 의 virtual 메서드',
            notes: '<p><b>[4분]</b> 표를 읽으며 sealed(string 이 sealed) 와 new(변수 형식에 따라 달라짐 — 추가 예제)를 짧게. object 행에서 “8장의 ToString 재정의 = object 의 virtual 을 override 한 것”으로 연결.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Animal a = new Dog(); a.Speak();</code> — Dog 가 Speak 를 override 했다면 실행되는 것은?', options: ['Animal 의 Speak', 'Dog 의 Speak', '컴파일 오류', '둘 다'], answer: 1, explain: '변수 형식이 아니라 실제 객체(Dog)의 override 된 메서드가 실행됩니다.',
            notes: '<p>정답 공개 후 “override 대신 new 였다면?” → Animal 의 것. “Speak 에 virtual 이 없었다면?” → 컴파일 오류(CS0506).</p>' },
          { layout: 'practice', title: '실습 9-1. 도형 넓이', desc: '<p><code>Circle</code>, <code>Rect</code> 에서 <code>Area()</code> 를 재정의하고 배열을 순회하며 <code>원: 넓이 12.57</code> 형식과 합계를 출력하세요.</p>', starter: `using System;

class Shape
{
    public string Name { get; set; }
    public Shape(string name) { Name = name; }
    public virtual double Area() { return 0; }
}

class Circle : Shape
{
    private double r;
    public Circle(double r) : base("원") { this.r = r; }
    // TODO: Area() 재정의
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) : base("사각형") { this.w = w; this.h = h; }
    // TODO: Area() 재정의
}

class Program
{
    static void Main()
    {
        Shape[] shapes = { new Circle(2), new Rect(3, 4), new Shape("도형") };
        // TODO: 이름: 넓이 xx.xx 출력, 합계
    }
}`, solution: `using System;

class Shape
{
    public string Name { get; set; }
    public Shape(string name) { Name = name; }
    public virtual double Area() { return 0; }
}

class Circle : Shape
{
    private double r;
    public Circle(double r) : base("원") { this.r = r; }
    public override double Area() { return Math.PI * r * r; }
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) : base("사각형") { this.w = w; this.h = h; }
    public override double Area() { return w * h; }
}

class Program
{
    static void Main()
    {
        Shape[] shapes = { new Circle(2), new Rect(3, 4), new Shape("도형") };
        double total = 0;
        foreach (Shape s in shapes)
        {
            Console.WriteLine($"{s.Name}: 넓이 {s.Area():F2}");
            total += s.Area();
        }
        Console.WriteLine($"합계: {total:F2}");
    }
}`,
            notes: '<p><b>[8분]</b> 흔한 실수: <code>override</code> 를 빼먹어 넓이가 0.00 으로 나옴 — 경고 CS0108 을 읽게 하세요. 빨리 끝난 학생은 <code>Triangle</code> 을 추가하거나 실습 9-2(급여)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>class 자식 : 부모</code> — 공통은 부모에, 자식은 추가분만 (is-a)', '객체 생성은 부모부터: <code>: base(…)</code>, 자식에게만 여는 <code>protected</code>', '<code>virtual</code>(부모) + <code>override</code>(자식) = 재정의, <code>base.Method()</code>', '다형성: <code>Animal a = new Dog()</code> — 실행되는 것은 <b>실제 객체</b>의 메서드', '<code>object</code> 는 모든 클래스의 부모 · <code>sealed</code> 금지 · <code>new</code> 숨기기'],
            notes: '<p>학습 목표를 하나씩 읽고 손을 들게 합니다. 다음 시간: “본문이 없는 메서드” — 추상 클래스와 인터페이스, 그리고 Animal 로 본 객체를 다시 Dog 로 되돌리는 is/as.</p>' }
        ]
      },

      /* ===================== ch09-2 ===================== */
      {
        id: 'ch09-2',
        title: '추상 클래스와 인터페이스',
        minutes: 50,
        goals: [
          'abstract 클래스와 추상 메서드로 자식에게 구현을 강제할 수 있다',
          '인터페이스를 정의하고 여러 클래스에서 구현(다중 구현)할 수 있다',
          '추상 클래스와 인터페이스의 차이를 설명하고 상황에 맞게 고를 수 있다',
          'is · as · 패턴 매칭으로 형식을 검사하고 안전하게 다운캐스팅할 수 있다',
          'IComparable<T> 를 구현해 정렬하고, 인터페이스 매개변수로 느슨하게 결합할 수 있다'
        ],
        flow: [['복습 · 도입: 넓이가 0 인 도형?', 5], ['abstract 클래스 · 추상 메서드', 10], ['인터페이스 · 다중 구현 · 비교', 13], ['is · as · IComparable · 느슨한 결합', 14], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '추상 클래스 — 미완성 설계도' },
          { type: 'p', html: '실습 9-1 의 부모 <code>Shape</code> 에는 이상한 점이 있습니다. “도형”이라는 것 자체는 넓이를 구할 수 없는데 <code>Area()</code> 가 0 을 돌려주고, <code>new Shape("도형")</code> 으로 정체불명의 도형 객체를 만들 수도 있습니다. 부모 클래스가 <b>“자식이 반드시 구현해야 하는 메서드”만 선언하고 본문은 비워 두고 싶을 때</b> <b>추상 클래스(abstract class)</b>를 씁니다.' },
          { type: 'list', items: [
            '<b><code>abstract class</code></b>: 미완성 설계도. <b><code>new</code> 로 객체를 만들 수 없고</b>(CS0144) 상속해서만 씁니다.',
            '<b><code>abstract</code> 메서드</b>: <b>본문이 없는</b> 메서드(<code>public abstract double Area();</code>). 자식은 <b>반드시 <code>override</code> 로 구현</b>해야 합니다(안 하면 CS0534). 추상 메서드는 자동으로 virtual 입니다.',
            '추상 클래스에도 <b>보통 필드 · 속성 · 생성자 · 본문 있는 메서드</b>를 넣을 수 있습니다. 공통 코드는 부모에, 자식마다 다른 부분만 abstract 로 비워 두는 것입니다.'
          ] },
          { type: 'code', title: '예제 9-6. abstract 클래스와 추상 메서드 — 구현 강제', code: `using System;

abstract class Shape                     // abstract: 직접 객체를 만들 수 없는 미완성 설계도
{
    public string Name { get; }

    protected Shape(string name) { Name = name; }

    public abstract double Area();       // 추상 메서드: 본문이 없다. 자식이 반드시 구현

    public void Print()                  // 보통 메서드: 추상 메서드를 이용해 공통 동작을 만든다
    {
        Console.WriteLine($"{Name}의 넓이 = {Area():F2}");
    }
}

class Circle : Shape
{
    private double r;
    public Circle(double r) : base("원") { this.r = r; }
    public override double Area() { return Math.PI * r * r; }    // 구현은 override 로
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) : base("직사각형") { this.w = w; this.h = h; }
    public override double Area() { return w * h; }
}

class Program
{
    static void Main()
    {
        // Shape s = new Shape("도형");   // 오류 CS0144: 추상 클래스의 인스턴스를 만들 수 없다
        Shape[] shapes = { new Circle(1), new Rect(2, 3.5) };
        foreach (Shape s in shapes)
            s.Print();
    }
}`, expect: `원의 넓이 = 3.14
직사각형의 넓이 = 7.00`, desc: '<code>Print()</code> 는 부모에 한 번만 있는데도 <code>Area()</code> 를 호출하는 순간 <b>자식의 구현</b>이 실행됩니다(다형성). 부모는 “넓이를 구하는 방법은 모르지만, 넓이가 있다는 것은 안다”는 셈입니다. <code>Circle</code> 에서 <code>Area</code> 를 빼 보세요 — <b>CS0534: 추상 멤버를 구현하지 않습니다</b> 오류가 컴파일 시점에 실수를 잡아 줍니다.' },
          { type: 'h', text: '인터페이스 — 할 수 있는 일의 약속(계약)' },
          { type: 'p', html: '“재생할 수 있다”는 능력은 음악 · 영상 · 게임처럼 <b>서로 부모-자식 관계가 아닌 클래스</b>들이 함께 가질 수 있습니다. <b>인터페이스(interface)</b>는 <b>“이 멤버들을 갖추겠다”는 약속(계약, contract)</b>만 적은 형식입니다. 본문도, 필드도 없이 메서드 · 속성의 <b>서명(이름 · 매개변수 · 반환형)</b>만 나열하고, 클래스가 <code>: IPlayable</code> 로 <b>구현(implement)</b>하면 그 멤버를 모두 채워야 합니다.' },
          { type: 'figure', html: SVG_IFACE, caption: '인터페이스는 플러그 규격 — 규격만 맞으면 어떤 클래스든 Run(IPlayable) 에 꽂아 쓸 수 있다' },
          { type: 'list', items: [
            '이름은 관례상 <b>대문자 <code>I</code> 로 시작</b>합니다: <code>IPlayable</code>, <code>IComparable</code>, <code>IDisposable</code>. “~할 수 있는(-able)” 형용사가 많습니다.',
            '인터페이스 멤버는 <b>자동으로 <code>public</code></b> 이므로 접근 제한자를 쓰지 않습니다. 구현하는 클래스 쪽에서는 <code>public</code> 을 꼭 붙입니다.',
            '클래스는 부모 하나에 더해 <b>인터페이스를 여러 개</b> 구현할 수 있습니다: <code>class Camera : Device, IPlayable, IRecordable</code> (부모 클래스는 맨 앞에).',
            '인터페이스도 <b>형식</b>입니다. <code>IPlayable p = new Music();</code> 처럼 변수 · 배열 · 매개변수의 형식으로 쓰면 다형성이 그대로 적용됩니다.'
          ] },
          { type: 'code', title: '예제 9-7. 인터페이스 정의 · 구현 · 다중 구현', code: `using System;

interface IPlayable                      // 인터페이스: "이 메서드들을 갖추겠다"는 약속(계약)
{
    void Play();                         // 본문 없음, public 생략 (자동으로 public)
    void Stop();
}

interface IRecordable
{
    void Record();
}

class Music : IPlayable
{
    public void Play() { Console.WriteLine("음악 재생 ♪"); }
    public void Stop() { Console.WriteLine("음악 정지"); }
}

class Camera : IPlayable, IRecordable    // 인터페이스는 여러 개 구현 가능
{
    public void Play() { Console.WriteLine("영상 재생 ▶"); }
    public void Stop() { Console.WriteLine("영상 정지"); }
    public void Record() { Console.WriteLine("녹화 시작 ●"); }
}

class Program
{
    static void Main()
    {
        IPlayable[] items = { new Music(), new Camera() };   // 인터페이스 형식 배열
        foreach (IPlayable p in items)
        {
            p.Play();
            p.Stop();
        }

        IRecordable r = new Camera();    // 같은 객체를 IRecordable 로 본다
        r.Record();
        // r.Play();                     // 오류 CS1061: IRecordable 에는 Play 가 없다
        // IPlayable x = new IPlayable();  // 오류 CS0144: 인터페이스는 객체를 만들 수 없다
    }
}`, expect: `음악 재생 ♪
음악 정지
영상 재생 ▶
영상 정지
녹화 시작 ●`, desc: '<code>Music</code> 과 <code>Camera</code> 는 부모가 다르지만(둘 다 object) <code>IPlayable</code> 배열에 함께 담겨 같은 코드로 재생됩니다. <code>Camera</code> 에서 <code>Record</code> 를 지우면 <b>CS0535: 인터페이스 멤버를 구현하지 않습니다</b> — 약속을 어기면 컴파일이 안 됩니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 빠른 작업으로 인터페이스 구현하기', html: '<code>class Music : IPlayable</code> 까지 입력하면 <code>IPlayable</code> 아래에 빨간 물결이 생깁니다. 그 위에서 <b>Ctrl + .</b>(또는 전구 아이콘) → <b>인터페이스 구현</b>을 고르면 필요한 메서드 뼈대(<code>throw new NotImplementedException();</code>)가 자동으로 만들어집니다. 추상 클래스도 같은 방법으로 <b>추상 클래스 구현</b>을 고르면 됩니다. 인터페이스 이름에서 <b>F12</b> 를 누르면 정의로 이동합니다.' },
          { type: 'h', text: '추상 클래스 vs 인터페이스' },
          { type: 'table', head: ['', '추상 클래스 (abstract class)', '인터페이스 (interface)'], rows: [
            ['의미', '<b>is-a</b>. “~이다” — 공통 뿌리', '<b>can-do</b>. “~할 수 있다” — 능력 · 계약'],
            ['개수', '부모는 <b>하나</b>만', '<b>여러 개</b> 구현 가능'],
            ['필드 · 생성자', '가질 수 있음 (공통 데이터)', '없음 (속성 · 메서드 서명만)'],
            ['본문 있는 메서드', '가능 (공통 동작 제공)', '기본 구현(C# 8) 외에는 없음'],
            ['본문 없는 멤버', '<code>abstract</code> 로 표시', '모두 본문 없음 (자동 abstract)'],
            ['구현 키워드', '<code>override</code>', '없음 (<code>public</code> 만)'],
            ['객체 생성', '<code>new</code> ✗', '<code>new</code> ✗'],
            ['예', '<code>Shape</code> → Circle · Rect', '<code>IComparable</code>, <code>IDisposable</code>, WPF 의 <code>ICommand</code>']
          ], caption: '공통 코드 · 데이터가 있는 가족 관계면 추상 클래스, 관계없는 클래스들에 같은 능력을 약속하면 인터페이스' },
          { type: 'callout', kind: 'tip', title: '어느 쪽을 고를까?', html: '<b>공통 필드나 공통 코드가 있고 “~이다”가 자연스러우면 추상 클래스</b>(<code>Account</code> → 적금 · 입출금), <b>서로 다른 클래스들이 같은 “능력”을 가져야 하면 인터페이스</b>(<code>IPlayable</code> → 음악 · 카메라). 둘을 함께 쓰는 경우도 흔합니다: <code>abstract class Shape : IComparable&lt;Shape&gt;</code>. 고민될 때는 <b>인터페이스가 더 유연</b>합니다(여러 개 가능, 나중에 추가하기 쉬움).' },
          { type: 'h', text: 'is · as · 패턴 매칭 — 형식 검사와 다운캐스팅' },
          { type: 'p', html: '<code>Animal a = new Dog()</code> 처럼 부모 형식으로 담아 두면 <code>Animal</code> 의 멤버만 보입니다. 다시 <code>Dog</code> 로 보려면(<b>다운캐스팅</b>) <code>(Dog)a</code> 처럼 캐스트하는데, 실제 객체가 Dog 가 아니면 <b>InvalidCastException</b> 이 발생합니다. 그래서 먼저 <b>검사</b>합니다.' },
          { type: 'table', head: ['문법', '뜻', '실패하면'], rows: [
            ['<code>a is Dog</code>', 'a 가 Dog (또는 그 자식)인가? → <code>bool</code>', '<code>false</code>'],
            ['<code>a is Dog d</code>', '<b>패턴 매칭</b>(C# 7): 검사에 성공하면 변수 <code>d</code> 에 Dog 로 담는다', '<code>false</code>, d 는 못 씀'],
            ['<code>a as Dog</code>', 'Dog 로 변환 시도. 참조 형식에만', '<b><code>null</code></b> (예외 없음)'],
            ['<code>(Dog)a</code>', '명시적 캐스트. 확실할 때만', '<b>InvalidCastException</b>'],
            ['<code>a switch { Dog =&gt; …, Cat =&gt; …, _ =&gt; … }</code>', 'switch 식의 <b>형식 패턴</b>: 형식별로 분기', '<code>_</code>(그 외)']
          ] },
          { type: 'code', title: '예제 9-8. is · as · 패턴 매칭으로 안전하게 되돌리기', code: `using System;

class Animal
{
    public string Name { get; set; }
    public Animal(string name) { Name = name; }
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public void Fetch() { Console.WriteLine($"{Name}: 공을 물어 옵니다"); }
}

class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public void Climb() { Console.WriteLine($"{Name}: 나무에 오릅니다"); }
}

class Program
{
    static void Main()
    {
        Animal[] zoo = { new Dog("바둑이"), new Cat("나비"), new Animal("거북이") };

        foreach (Animal a in zoo)
        {
            Console.WriteLine($"[{a.Name}] Dog? {a is Dog}, Cat? {a is Cat}");

            if (a is Dog d)              // 패턴 매칭: 검사와 변환을 한 번에
                d.Fetch();               // 이 안에서 d 는 Dog

            Cat c = a as Cat;            // as: 변환에 실패하면 예외 대신 null
            if (c != null)
                c.Climb();
        }

        Animal first = zoo[0];
        Dog dog = (Dog)first;            // 명시적 캐스트(다운캐스팅): 실제 Dog 일 때만 성공
        dog.Fetch();
        // Cat cat = (Cat)first;         // 실행 오류 InvalidCastException: 실제로는 Dog

        foreach (Animal a in zoo)
        {
            string kind = a switch       // switch 식 + 형식 패턴
            {
                Dog => "개",
                Cat => "고양이",
                _ => "기타 동물"
            };
            Console.WriteLine($"{a.Name} = {kind}");
        }
    }
}`, expect: `[바둑이] Dog? True, Cat? False
바둑이: 공을 물어 옵니다
[나비] Dog? False, Cat? True
나비: 나무에 오릅니다
[거북이] Dog? False, Cat? False
바둑이: 공을 물어 옵니다
바둑이 = 개
나비 = 고양이
거북이 = 기타 동물`, desc: '실무에서는 <b><code>if (a is Dog d)</code> 패턴 매칭</b>을 가장 많이 씁니다 — 검사와 변환이 한 줄이고 <code>null</code> 확인이 필요 없습니다. 다만 <code>is</code> 로 형식을 일일이 가르는 코드가 많아진다면, 그 동작을 <code>virtual</code> 메서드나 인터페이스로 옮겨 다형성에 맡기는 편이 좋습니다.' },
          { type: 'callout', kind: 'warn', title: 'is 는 자식도 참', html: '<code>new Dog() is Animal</code> 은 <code>true</code> 입니다(개는 동물이므로). 반대로 <code>new Animal() is Dog</code> 는 <code>false</code>. 정확히 그 클래스인지만 알고 싶다면 <code>a.GetType() == typeof(Dog)</code> 로 비교합니다.' },
          { type: 'h', text: 'IComparable<T> — “비교할 수 있다”를 구현하면 정렬이 된다' },
          { type: 'p', html: '7장에서 <code>List&lt;int&gt;</code> 를 <code>Sort()</code> 로 정렬했습니다. 그런데 <code>List&lt;Student&gt;</code> 를 정렬하려면 “학생 둘 중 누가 앞인가”를 .NET 이 알 수 없습니다. 이때 .NET 이 요구하는 계약이 <b><code>IComparable&lt;T&gt;</code></b> 인터페이스입니다. <code>CompareTo(other)</code> 하나만 구현하면 <code>List.Sort()</code>, <code>Array.Sort()</code>, <code>Max()</code> 같은 기능이 모두 우리 클래스에 대해 동작합니다. <b>인터페이스는 이렇게 “내 클래스를 .NET 의 기능에 끼워 넣는 규격”</b>으로 자주 쓰입니다.' },
          { type: 'code', title: '예제 9-9. IComparable<T> 구현으로 List.Sort() 하기', code: `using System;
using System.Collections.Generic;

class Student : IComparable<Student>     // "Student 끼리 비교할 수 있다"는 계약
{
    public string Name { get; set; }
    public int Score { get; set; }

    public Student(string name, int score) { Name = name; Score = score; }

    public int CompareTo(Student other)  // 음수: 내가 앞, 0: 같음, 양수: 내가 뒤
    {
        return Score.CompareTo(other.Score);       // int 의 CompareTo 에 맡긴다 (점수 오름차순)
    }

    public override string ToString() { return $"{Name}({Score})"; }
}

class Program
{
    static void Main()
    {
        List<Student> list = new List<Student>
        {
            new Student("홍길동", 85), new Student("김영희", 92), new Student("이철수", 77)
        };
        Console.WriteLine("정렬 전 : " + string.Join(", ", list));

        list.Sort();                               // CompareTo 를 이용해 정렬한다
        Console.WriteLine("정렬 후 : " + string.Join(", ", list));
        Console.WriteLine($"최저: {list[0]}, 최고: {list[list.Count - 1]}");

        list.Reverse();
        Console.WriteLine("내림차순: " + string.Join(", ", list));

        Student a = new Student("A", 70), b = new Student("B", 90);
        Console.WriteLine(a.CompareTo(b));         // 음수: a 가 앞
        // IComparable 을 구현하지 않은 클래스의 목록을 Sort() 하면 실행 오류 InvalidOperationException
    }
}`, expect: `정렬 전 : 홍길동(85), 김영희(92), 이철수(77)
정렬 후 : 이철수(77), 홍길동(85), 김영희(92)
최저: 이철수(77), 최고: 김영희(92)
내림차순: 김영희(92), 홍길동(85), 이철수(77)
-1`, desc: '이름순으로 정렬하고 싶다면 <code>return string.Compare(Name, other.Name);</code>, 점수 내림차순이면 <code>other.Score.CompareTo(Score)</code> 처럼 순서를 바꾸면 됩니다. 정렬 기준을 그때그때 다르게 주는 방법(람다 <code>list.Sort((x, y) =&gt; …)</code>)은 11장에서 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 자주 만나는 .NET 인터페이스', html: '<table><thead><tr><th>인터페이스</th><th>약속하는 것</th><th>쓰이는 곳</th></tr></thead><tbody><tr><td><code>IComparable&lt;T&gt;</code></td><td><code>CompareTo</code> — 순서 비교</td><td><code>Sort</code>, <code>Min/Max</code></td></tr><tr><td><code>IEquatable&lt;T&gt;</code></td><td><code>Equals(T)</code> — 같음 비교</td><td><code>Contains</code>, <code>Dictionary</code></td></tr><tr><td><code>IEnumerable&lt;T&gt;</code></td><td><code>GetEnumerator</code> — 하나씩 꺼내기</td><td><code>foreach</code>, LINQ(11장)</td></tr><tr><td><code>IDisposable</code></td><td><code>Dispose</code> — 자원 정리</td><td><code>using</code> 문, 파일 · DB(10장)</td></tr><tr><td><code>ICommand</code></td><td><code>Execute</code>, <code>CanExecute</code></td><td>WPF 버튼 명령(Part 2)</td></tr><tr><td><code>INotifyPropertyChanged</code></td><td><code>PropertyChanged</code> 이벤트</td><td>WPF 데이터 바인딩(Part 2)</td></tr></tbody></table><p>WPF 파트에서 화면과 데이터를 연결하는 핵심 장치가 모두 인터페이스입니다. 오늘 배운 “계약을 구현하면 프레임워크가 내 클래스를 알아서 써 준다”는 감각을 꼭 챙기세요.</p>' },
          { type: 'h', text: '인터페이스를 매개변수로 — 느슨한 결합' },
          { type: 'p', html: '주문 처리 클래스가 로그를 남긴다고 합시다. 안에서 <code>new ConsoleLogger()</code> 를 직접 만들면 나중에 파일이나 DB 에 로그를 남기고 싶을 때 <b>주문 처리 클래스를 뜯어고쳐야</b> 합니다(강한 결합, tight coupling). 대신 <b><code>ILogger</code> 인터페이스만 알고, 실제 로거는 밖에서 받아 오면</b> 주문 처리 코드는 그대로 두고 로거만 바꿔 끼울 수 있습니다(<b>느슨한 결합, loose coupling</b>). 테스트할 때 가짜 로거를 넣기도 쉽습니다.' },
          { type: 'code', title: '예제 9-10. 인터페이스 매개변수로 부품 바꿔 끼우기', code: `using System;
using System.Collections.Generic;

interface ILogger
{
    void Log(string message);
}

class ConsoleLogger : ILogger
{
    public void Log(string message) { Console.WriteLine($"[콘솔] {message}"); }
}

class MemoryLogger : ILogger             // 나중에 파일 · DB 로거로 바꿔도 OrderService 는 그대로
{
    public List<string> Lines { get; } = new List<string>();
    public void Log(string message) { Lines.Add(message); }
}

class OrderService
{
    private ILogger logger;              // 구체 클래스가 아니라 인터페이스에 의존한다

    public OrderService(ILogger logger) { this.logger = logger; }   // 밖에서 받아 온다

    public void Order(string item, int qty)
    {
        logger.Log($"주문 접수: {item} x {qty}");
        if (qty > 10)
            logger.Log("대량 주문 - 담당자 확인 필요");
        logger.Log("주문 완료");
    }
}

class Program
{
    static void Main()
    {
        OrderService s1 = new OrderService(new ConsoleLogger());
        s1.Order("연필", 3);

        MemoryLogger mem = new MemoryLogger();
        OrderService s2 = new OrderService(mem);   // 로거만 바꿔 끼운다
        s2.Order("노트", 20);
        Console.WriteLine($"메모리에 쌓인 로그 {mem.Lines.Count}줄:");
        foreach (string line in mem.Lines)
            Console.WriteLine("  " + line);
    }
}`, expect: `[콘솔] 주문 접수: 연필 x 3
[콘솔] 주문 완료
메모리에 쌓인 로그 3줄:
  주문 접수: 노트 x 20
  대량 주문 - 담당자 확인 필요
  주문 완료`, desc: '<code>OrderService</code> 코드 어디에도 <code>ConsoleLogger</code> · <code>MemoryLogger</code> 라는 이름이 없습니다. 내일 <code>FileLogger : ILogger</code> 를 만들어 넘겨도 <code>OrderService</code> 는 한 줄도 안 바뀝니다. 이렇게 <b>필요한 부품을 밖에서 넣어 주는 방식</b>을 <b>의존성 주입(dependency injection)</b>이라 부르며, WPF · ASP.NET 등 실무 프레임워크의 기본 구조입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 기본 인터페이스 메서드 (C# 8)', html: 'C# 8 부터는 인터페이스 메서드에도 <b>기본 구현(default implementation)</b>을 넣을 수 있습니다. 구현 클래스가 그 메서드를 만들지 않으면 기본 구현이 쓰이고, 만들면 자기 것이 쓰입니다. 이미 널리 쓰이는 인터페이스에 <b>기존 구현 클래스를 깨지 않고 멤버를 추가</b>하려고 만든 기능이라 일반 코드에서는 자주 쓰지 않습니다. 기본 구현은 <b>인터페이스 형식 변수</b>로만 호출할 수 있다는 점에 주의하세요.' },
          { type: 'code', title: '추가 예제. 기본 인터페이스 메서드와 인터페이스 속성', code: `using System;

interface IGreeter
{
    string Name { get; }                 // 인터페이스에는 속성도 넣을 수 있다 (구현 강제)

    void Greet()                         // 기본 구현이 있는 메서드 (C# 8): 구현하지 않아도 된다
    {
        Console.WriteLine($"안녕하세요, {Name}입니다.");
    }
}

class Student : IGreeter
{
    public string Name { get; set; }
    public Student(string name) { Name = name; }
    // Greet 는 구현하지 않음 → 기본 구현 사용
}

class Teacher : IGreeter
{
    public string Name { get; set; }
    public Teacher(string name) { Name = name; }
    public void Greet() { Console.WriteLine($"{Name} 선생님입니다. 반갑습니다."); }   // 직접 구현
}

class Program
{
    static void Main()
    {
        IGreeter g1 = new Student("홍길동");   // 기본 구현은 인터페이스 형식 변수로 호출
        IGreeter g2 = new Teacher("김선생");
        g1.Greet();
        g2.Greet();
        // new Student("x").Greet();        // 오류: 클래스 형식으로는 기본 구현이 보이지 않는다
    }
}`, expect: `안녕하세요, 홍길동입니다.
김선생 선생님입니다. 반갑습니다.`, desc: '<code>Student</code> 는 <code>Greet</code> 를 쓰지 않았는데도 CS0535 오류가 나지 않습니다 — 기본 구현이 있기 때문입니다. 인터페이스의 속성 <code>string Name { get; }</code> 은 “읽을 수 있는 Name 이 있어야 한다”는 약속이므로 <code>{ get; set; }</code> 으로 구현해도 됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — record: ToString · Equals 를 공짜로', html: '8장에서 예고한 <b><code>record</code></b>(C# 9)는 “데이터를 담는 클래스”를 한 줄로 만듭니다. <code>record Point(int X, int Y);</code> 라고 쓰면 속성 · 생성자 · <b>내용 비교 <code>Equals</code> · <code>GetHashCode</code> · <code>==</code></b> · 보기 좋은 <b><code>ToString</code></b> 이 자동으로 생깁니다(예제 9-5 에서 손으로 쓴 것 전부). 데이터 묶음(좌표, 주문 항목, 설정값)에 알맞고, 동작이 많은 클래스에는 여전히 <code>class</code> 를 씁니다.' },
          { type: 'code', title: '추가 예제. record 로 데이터 클래스 한 줄에 만들기', code: `using System;

record Point(int X, int Y);              // 위치 레코드: 속성 · 생성자 · ToString · Equals 를 자동 생성

class Program
{
    static void Main()
    {
        Point p1 = new Point(3, 4);
        Point p2 = new Point(3, 4);
        Console.WriteLine(p1);           // ToString 자동: Point { X = 3, Y = 4 }
        Console.WriteLine(p1 == p2);     // record 는 == 도 내용 비교: True
        Point p3 = p1 with { Y = 10 };   // 일부만 바꾼 복사본 (원본은 그대로)
        Console.WriteLine(p3);
        Console.WriteLine(p1);
    }
}`, expect: `Point { X = 3, Y = 4 }
True
Point { X = 3, Y = 10 }
Point { X = 3, Y = 4 }`, desc: '<code>with</code> 식은 원본을 바꾸지 않고 일부 값만 다른 <b>새 객체</b>를 만듭니다. record 의 속성은 기본적으로 <code>init</code>(생성 뒤 변경 불가)이라 안전하게 공유할 수 있습니다.' }
        ],
        practice: [
          {
            title: '실습 9-3. IPlayable 인터페이스를 구현하는 노래 · 영화 · 게임',
            level: 1,
            desc: '<p><code>IPlayable</code> 인터페이스(<code>Title</code> 속성, <code>Play()</code> 메서드)를 구현하는 <code>Movie</code>(제목, 상영 시간)와 <code>Game</code>(제목) 클래스를 만들고, 배열에 넣어 <code>PlayAll</code> 로 모두 재생하세요. <code>Song</code> 은 예시로 완성되어 있습니다.</p><pre>[노래] 봄날 을(를) 재생합니다 ♪\n[영화] 기생충 (132분) 상영을 시작합니다\n[게임] 테트리스 을(를) 실행합니다\n총 3개 재생 완료</pre>',
            hint: '<code>class Movie : IPlayable { public string Title { get; } public int Minutes { get; } … public void Play() { … } }</code>. 인터페이스 멤버 구현에는 <code>public</code> 을 꼭 붙입니다.',
            starter: `using System;

interface IPlayable
{
    string Title { get; }
    void Play();
}

class Song : IPlayable
{
    public string Title { get; }
    public Song(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[노래] {Title} 을(를) 재생합니다 ♪"); }
}

// TODO: Movie 클래스 — Title, Minutes, Play(): "[영화] 제목 (분) 상영을 시작합니다"

// TODO: Game 클래스 — Title, Play(): "[게임] 제목 을(를) 실행합니다"

class Program
{
    static void PlayAll(IPlayable[] items)
    {
        foreach (IPlayable p in items)
            p.Play();
        Console.WriteLine($"총 {items.Length}개 재생 완료");
    }

    static void Main()
    {
        IPlayable[] items = { new Song("봄날") /* TODO: new Movie("기생충", 132), new Game("테트리스") */ };
        PlayAll(items);
    }
}
`,
            solution: `using System;

interface IPlayable
{
    string Title { get; }
    void Play();
}

class Song : IPlayable
{
    public string Title { get; }
    public Song(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[노래] {Title} 을(를) 재생합니다 ♪"); }
}

class Movie : IPlayable
{
    public string Title { get; }
    public int Minutes { get; }
    public Movie(string title, int minutes) { Title = title; Minutes = minutes; }
    public void Play() { Console.WriteLine($"[영화] {Title} ({Minutes}분) 상영을 시작합니다"); }
}

class Game : IPlayable
{
    public string Title { get; }
    public Game(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[게임] {Title} 을(를) 실행합니다"); }
}

class Program
{
    static void PlayAll(IPlayable[] items)
    {
        foreach (IPlayable p in items)
            p.Play();
        Console.WriteLine($"총 {items.Length}개 재생 완료");
    }

    static void Main()
    {
        IPlayable[] items = { new Song("봄날"), new Movie("기생충", 132), new Game("테트리스") };
        PlayAll(items);
    }
}
`,
            expect: `[노래] 봄날 을(를) 재생합니다 ♪
[영화] 기생충 (132분) 상영을 시작합니다
[게임] 테트리스 을(를) 실행합니다
총 3개 재생 완료`
          },
          {
            title: '실습 9-4. 추상 클래스 Account 와 계좌 종류별 이자',
            level: 2,
            desc: '<p>추상 클래스 <code>Account</code> 에는 이자율 <code>InterestRate</code> 와 종류 이름 <code>Kind</code> 가 <b>추상 속성</b>으로 선언되어 있고, <code>AddInterest()</code> 가 그것을 이용해 이자를 더합니다. <code>SavingsAccount</code>(적금, 이자율 3%) 를 참고해 <code>CheckingAccount</code>(입출금, 이자율 0.2%) 를 만들고 아래처럼 출력되게 하세요.</p><pre>적금 홍길동: 이자 30,000원 → 잔액 1,030,000원\n입출금 김영희: 이자 1,000원 → 잔액 501,000원\n입출금 김영희: 이자 1,202원 → 잔액 602,202원</pre>',
            hint: '<code>public override decimal InterestRate =&gt; 0.002m;</code> — <code>=&gt;</code> 는 <code>{ get { return 0.002m; } }</code> 의 짧은 표기입니다. 두 번째 계좌에 <code>Deposit(100000m)</code> 한 뒤 다시 <code>AddInterest()</code> 를 호출하세요.',
            starter: `using System;

abstract class Account
{
    public string Owner { get; }
    public decimal Balance { get; protected set; }

    protected Account(string owner, decimal balance) { Owner = owner; Balance = balance; }

    public abstract decimal InterestRate { get; }      // 추상 속성: 계좌 종류마다 다르다
    public abstract string Kind { get; }

    public void Deposit(decimal amount) { Balance += amount; }

    public void AddInterest()                          // 공통 동작: 추상 속성을 이용한다
    {
        decimal interest = Balance * InterestRate;
        Balance += interest;
        Console.WriteLine($"{Kind} {Owner}: 이자 {interest:N0}원 → 잔액 {Balance:N0}원");
    }
}

class SavingsAccount : Account
{
    public SavingsAccount(string owner, decimal balance) : base(owner, balance) { }
    public override decimal InterestRate => 0.03m;     // 식 본문 속성: { get { return 0.03m; } }
    public override string Kind => "적금";
}

// TODO: CheckingAccount — 이자율 0.002m, Kind "입출금"

class Program
{
    static void Main()
    {
        Account[] accounts = { new SavingsAccount("홍길동", 1000000m) /* TODO: new CheckingAccount("김영희", 500000m) */ };
        foreach (Account a in accounts)
            a.AddInterest();
        // TODO: 두 번째 계좌에 100000m 입금 후 다시 AddInterest()
    }
}
`,
            solution: `using System;

abstract class Account
{
    public string Owner { get; }
    public decimal Balance { get; protected set; }

    protected Account(string owner, decimal balance) { Owner = owner; Balance = balance; }

    public abstract decimal InterestRate { get; }
    public abstract string Kind { get; }

    public void Deposit(decimal amount) { Balance += amount; }

    public void AddInterest()
    {
        decimal interest = Balance * InterestRate;
        Balance += interest;
        Console.WriteLine($"{Kind} {Owner}: 이자 {interest:N0}원 → 잔액 {Balance:N0}원");
    }
}

class SavingsAccount : Account
{
    public SavingsAccount(string owner, decimal balance) : base(owner, balance) { }
    public override decimal InterestRate => 0.03m;
    public override string Kind => "적금";
}

class CheckingAccount : Account
{
    public CheckingAccount(string owner, decimal balance) : base(owner, balance) { }
    public override decimal InterestRate => 0.002m;
    public override string Kind => "입출금";
}

class Program
{
    static void Main()
    {
        Account[] accounts = { new SavingsAccount("홍길동", 1000000m), new CheckingAccount("김영희", 500000m) };
        foreach (Account a in accounts)
            a.AddInterest();
        accounts[1].Deposit(100000m);
        accounts[1].AddInterest();
    }
}
`,
            expect: `적금 홍길동: 이자 30,000원 → 잔액 1,030,000원
입출금 김영희: 이자 1,000원 → 잔액 501,000원
입출금 김영희: 이자 1,202원 → 잔액 602,202원`
          }
        ],
        quiz: [
          { q: '추상 클래스(abstract class)에 대한 설명으로 <b>옳은</b> 것은?', options: ['<code>new</code> 로 바로 객체를 만들 수 있다', '필드를 가질 수 없다', '인터페이스를 구현할 수 없다', '추상 메서드는 본문이 없고 자식이 반드시 구현해야 한다'], answer: 3, explain: '추상 클래스는 new 불가, 필드 · 생성자 · 보통 메서드 모두 가능. 추상 메서드는 본문 없이 선언만 하고 자식이 override 로 구현합니다(안 하면 CS0534).' },
          { q: '인터페이스에 대한 설명으로 <b>틀린</b> 것은?', options: ['이름은 관례상 대문자 I 로 시작한다', '클래스는 여러 인터페이스를 동시에 구현할 수 있다', '인터페이스도 <code>new</code> 로 객체를 만들 수 있다', '멤버 선언에 <code>public</code> 을 쓰지 않아도 public 이다'], answer: 2, explain: '인터페이스는 계약일 뿐 실체가 없으므로 new 할 수 없습니다(CS0144). 구현 클래스의 객체를 인터페이스 형식 변수에 담아 씁니다.' },
          { q: '<code>Animal a = new Cat(); Dog d = a as Dog;</code> 실행 후 <code>d</code> 는?', options: ['Dog 객체', '<code>null</code>', 'InvalidCastException 발생', '컴파일 오류'], answer: 1, explain: '<code>as</code> 는 변환에 실패하면 예외 대신 null 을 돌려줍니다. <code>(Dog)a</code> 캐스트였다면 InvalidCastException.' },
          { q: '<code>List&lt;Student&gt;.Sort()</code> 가 학생끼리 순서를 비교하기 위해 <code>Student</code> 에 요구하는 인터페이스는?', options: ['<code>IComparable&lt;Student&gt;</code>', '<code>IEnumerable&lt;Student&gt;</code>', '<code>IDisposable</code>', '<code>IPlayable</code>'], answer: 0, explain: '<code>CompareTo(other)</code> 를 구현하면 Sort · Min · Max 가 동작합니다. 구현하지 않으면 실행 시 InvalidOperationException.' },
          { q: '<code>Animal a = new Cat();</code> 일 때 <code>Dog d = (Dog)a;</code> 의 결과는?', options: ['d 에 null 이 들어간다', '컴파일 오류', 'InvalidCastException 이 발생한다', 'Cat 이 Dog 로 바뀐다'], answer: 2, explain: '명시적 캐스트는 컴파일은 되지만 실제 객체가 Dog 가 아니므로 실행 중 예외가 납니다. 먼저 <code>is</code> 로 검사하거나 <code>as</code> 를 쓰세요.' }
        ],
        slides: [
          { layout: 'title', title: '추상 클래스와 인터페이스', subtitle: 'Chapter 09 · Section 02 — 본문 없는 메서드, 약속으로 연결하기', badge: '09-2',
            notes: '<p><b>[도입 3분]</b> 복습: “virtual 과 override 는 어디에?” “Animal a = new Dog(); a.Speak() 는 누구 것?” 그리고 실습 9-1 의 <code>new Shape("도형")</code> — “넓이 0 인 정체불명 도형이 만들어지는 게 이상하지 않나요?” 로 오늘 주제(abstract)를 엽니다.</p>' },
          { layout: 'bullets', title: '추상 클래스 — 미완성 설계도', lead: '“넓이가 있다는 건 알지만, 구하는 법은 자식이 정해라”',
            bullets: ['<code>abstract class Shape</code> → <b>new 불가</b> (CS0144), 상속해서만 사용', ['<code>public abstract double Area();</code> — <b>본문 없음</b>', ['자식은 반드시 <code>override</code> 로 구현 (안 하면 CS0534)']], '필드 · 생성자 · 본문 있는 메서드도 가질 수 있다', '공통 코드는 부모에, 자식마다 다른 것만 abstract 로', '추상 메서드는 자동으로 virtual'],
            notes: '<p><b>[4분]</b> 비유: 시험지 양식(제목 · 이름칸은 인쇄돼 있고 답은 비어 있음). “양식 자체를 제출할 수 있나?” → 안 됨(new 불가). “답을 안 채우면?” → 컴파일러가 잡아 줌.</p>' },
          { layout: 'code', title: '예제 9-6. abstract 클래스', code: `using System;

abstract class Shape                     // 미완성 설계도: new 불가
{
    public abstract double Area();       // 본문 없음: 자식이 반드시 구현
    public void Print() { Console.WriteLine($"{GetType().Name} 넓이 = {Area():F2}"); }
}

class Circle : Shape
{
    private double r;
    public Circle(double r) { this.r = r; }
    public override double Area() { return Math.PI * r * r; }
}

class Rect : Shape
{
    private double w, h;
    public Rect(double w, double h) { this.w = w; this.h = h; }
    public override double Area() { return w * h; }
}

class Program
{
    static void Main()
    {
        Shape[] shapes = { new Circle(1), new Rect(2, 3.5) };
        foreach (Shape s in shapes) s.Print();
    }
}`, points: ['<code>Print()</code> 는 부모에 한 번 — 안에서 부르는 <code>Area()</code> 는 자식 것', '<code>new Shape()</code> → CS0144', 'Circle 에서 <code>Area</code> 를 지우면 → CS0534'],
            notes: '<p><b>[5분]</b> 실행 후 학생에게 (1) <code>new Shape()</code> 를 넣어 보게, (2) Circle 의 Area 를 지워 보게 해서 두 오류를 직접 확인시킵니다. “오류가 컴파일 때 난다 = 실수를 미리 잡는다”를 강조.</p>' },
          { layout: 'diagram', title: '인터페이스 = 계약 · 플러그 규격', html: SVG_IFACE, caption: '규격(IPlayable)만 맞으면 Music · Video · Game 어느 것이든 Run(IPlayable) 에 꽂힌다',
            notes: '<p><b>[4분]</b> USB 규격 비유: 마우스 · 키보드 · 메모리는 서로 전혀 다른 물건이지만 같은 구멍에 꽂힌다. 컴퓨터(Run 메서드)는 “USB 규격” 만 알면 된다. 발문: “Music 과 Game 의 공통 부모가 필요한가?” → 아니요, 관계없는 클래스에 능력만 약속.</p>' },
          { layout: 'code', title: '예제 9-7. interface · 다중 구현', code: `using System;

interface IPlayable                      // 계약: 이 메서드들을 갖추겠다
{
    void Play();
    void Stop();
}
interface IRecordable { void Record(); }
class Music : IPlayable
{
    public void Play() { Console.WriteLine("음악 재생"); }
    public void Stop() { Console.WriteLine("음악 정지"); }
}

class Camera : IPlayable, IRecordable    // 여러 개 구현 가능
{
    public void Play() { Console.WriteLine("영상 재생"); }
    public void Stop() { Console.WriteLine("영상 정지"); }
    public void Record() { Console.WriteLine("녹화 시작"); }
}

class Program
{
    static void Main()
    {
        IPlayable[] items = { new Music(), new Camera() };
        foreach (IPlayable p in items) { p.Play(); p.Stop(); }
        ((IRecordable)items[1]).Record();
    }
}`, points: ['이름은 <b>I</b> 로 시작, 멤버는 자동 public', '구현 클래스에서는 <code>public</code> 필수', '클래스 하나가 <b>여러 인터페이스</b> 구현', '인터페이스 형식 배열 → 다형성'],
            notes: '<p><b>[6분]</b> Camera 의 Record 를 지워 CS0535 확인. Visual Studio 의 Ctrl+. → “인터페이스 구현” 을 시연하면 학생들이 좋아합니다. 마지막 줄의 캐스트는 “Camera 가 IRecordable 임을 알기에” 가능 — 다음 슬라이드의 is/as 로 연결.</p>' },
          { layout: 'table', title: '추상 클래스 vs 인터페이스', head: ['', '추상 클래스', '인터페이스'], rows: [['의미', '<b>is-a</b> “~이다” (공통 뿌리)', '<b>can-do</b> “~할 수 있다” (능력)'], ['개수', '부모 <b>하나</b>', '<b>여러 개</b>'], ['필드 · 생성자 · 공통 코드', '○', '✗ (서명만)'], ['본문 없는 멤버', '<code>abstract</code> 표시', '전부'], ['구현', '<code>override</code>', '<code>public</code> 만'], ['new', '✗', '✗']],
            lead: '공통 코드 · 데이터가 있는 가족이면 추상 클래스, 관계없는 클래스들의 같은 능력이면 인터페이스',
            notes: '<p><b>[4분]</b> 발문으로 판정 연습: “Account → 적금 · 입출금(공통 잔액 · 입금 코드)” → 추상 클래스. “저장할 수 있다(ISavable) — 문서 · 그림 · 설정” → 인터페이스. 둘 다 쓰는 경우도 흔하다고 덧붙입니다.</p>' },
          { layout: 'code', title: '예제 9-8. is · as · 패턴 매칭', code: `using System;

class Animal { public string Name { get; set; } }
class Dog : Animal { public void Fetch() { Console.WriteLine($"{Name}: 공 물어 오기"); } }
class Cat : Animal { public void Climb() { Console.WriteLine($"{Name}: 나무 오르기"); } }

class Program
{
    static void Main()
    {
        Animal[] zoo = { new Dog { Name = "바둑이" }, new Cat { Name = "나비" }, new Animal { Name = "거북이" } };
        foreach (Animal a in zoo)
        {
            Console.WriteLine($"{a.Name}: Dog? {a is Dog}");
            if (a is Dog d) d.Fetch();          // 검사 + 변환 한 번에
            Cat c = a as Cat;                    // 실패하면 null
            if (c != null) c.Climb();
            string kind = a switch { Dog => "개", Cat => "고양이", _ => "기타" };
            Console.WriteLine($"  → {kind}");
        }
        // Cat x = (Cat)zoo[0];                  // 실행 오류 InvalidCastException
    }
}`, points: ['<code>is</code>: 검사 → bool', '<code>is Dog d</code>: 검사 + 변수 (가장 많이 씀)', '<code>as</code>: 실패하면 null', '<code>(Dog)a</code>: 실패하면 예외'],
            notes: '<p><b>[6분]</b> 마지막 주석 줄을 풀어 InvalidCastException 을 직접 보여 줍니다. “Animal 로 담으면 Dog 멤버가 안 보인다 → 되돌리려면 검사 먼저”. is 로 형식을 가르는 코드가 많아지면 virtual/인터페이스로 옮기라는 조언도.</p>' },
          { layout: 'code', title: '예제 9-9. IComparable<T> 로 정렬', code: `using System;
using System.Collections.Generic;

class Student : IComparable<Student>     // "비교할 수 있다"는 계약
{
    public string Name { get; set; }
    public int Score { get; set; }
    public Student(string n, int s) { Name = n; Score = s; }

    public int CompareTo(Student other)  // 음수: 내가 앞, 양수: 내가 뒤
    {
        return Score.CompareTo(other.Score);
    }
    public override string ToString() { return $"{Name}({Score})"; }
}

class Program
{
    static void Main()
    {
        List<Student> list = new List<Student>
        {
            new Student("홍길동", 85), new Student("김영희", 92), new Student("이철수", 77)
        };
        list.Sort();                         // CompareTo 로 정렬
        Console.WriteLine(string.Join(", ", list));
        list.Reverse();
        Console.WriteLine(string.Join(", ", list));
    }
}`, points: ['.NET 이 요구하는 규격: <code>IComparable&lt;T&gt;</code>', '<code>CompareTo</code> 하나로 Sort · Min · Max 동작', '이름순: <code>string.Compare(Name, other.Name)</code>', '내림차순: 순서를 바꿔 <code>other.Score.CompareTo(Score)</code>'],
            notes: '<p><b>[5분]</b> <code>: IComparable&lt;Student&gt;</code> 를 지우고 Sort 하면 실행 오류(InvalidOperationException)가 나는 것을 시연. “내 클래스를 .NET 기능에 끼워 넣는 규격” 이라는 표현으로 정리. WPF 의 ICommand · INotifyPropertyChanged 도 같은 원리라고 예고.</p>' },
          { layout: 'two', title: '느슨한 결합 — 인터페이스를 매개변수로', left: { title: '강한 결합 (tight)', code: `class OrderService
{
    ConsoleLogger logger = new ConsoleLogger();
    // 파일 로거로 바꾸려면
    // 이 클래스를 고쳐야 한다
}`, run: false }, right: { title: '느슨한 결합 (loose)', code: `class OrderService
{
    ILogger logger;
    public OrderService(ILogger l) { logger = l; }
    // 어떤 ILogger 든 밖에서 넣어 준다
    // → 이 클래스는 안 바뀐다
}`, run: false },
            notes: '<p><b>[4분]</b> 예제 9-10 을 실행하며 OrderService 안에 ConsoleLogger 라는 이름이 한 번도 안 나온다는 점을 짚습니다. “테스트할 때 가짜 로거를 넣을 수 있다”, “의존성 주입(DI)” 용어만 소개. 시간이 남으면 기본 인터페이스 메서드 · record 추가 예제를 짧게.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Animal a = new Cat(); Dog d = a as Dog;</code> 실행 후 <code>d</code> 는?', options: ['Dog 객체', '<code>null</code>', 'InvalidCastException', '컴파일 오류'], answer: 1, explain: 'as 는 실패하면 null. (Dog)a 캐스트였다면 예외.',
            notes: '<p>이어서 “<code>a is Dog</code> 는?” → false, “<code>a is Animal</code> 은?” → true.</p>' },
          { layout: 'practice', title: '실습 9-3. IPlayable 구현', desc: '<p><code>IPlayable</code>(<code>Title</code>, <code>Play()</code>)을 구현하는 <code>Movie</code>(제목, 상영 시간)와 <code>Game</code>(제목)을 만들고 배열에 넣어 <code>PlayAll</code> 로 재생하세요.</p>', starter: `using System;

interface IPlayable
{
    string Title { get; }
    void Play();
}

class Song : IPlayable
{
    public string Title { get; }
    public Song(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[노래] {Title} 을(를) 재생합니다 ♪"); }
}

// TODO: Movie, Game 클래스

class Program
{
    static void PlayAll(IPlayable[] items)
    {
        foreach (IPlayable p in items) p.Play();
        Console.WriteLine($"총 {items.Length}개 재생 완료");
    }

    static void Main()
    {
        IPlayable[] items = { new Song("봄날") /* TODO: Movie, Game 추가 */ };
        PlayAll(items);
    }
}`, solution: `using System;

interface IPlayable
{
    string Title { get; }
    void Play();
}

class Song : IPlayable
{
    public string Title { get; }
    public Song(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[노래] {Title} 을(를) 재생합니다 ♪"); }
}

class Movie : IPlayable
{
    public string Title { get; }
    public int Minutes { get; }
    public Movie(string title, int minutes) { Title = title; Minutes = minutes; }
    public void Play() { Console.WriteLine($"[영화] {Title} ({Minutes}분) 상영을 시작합니다"); }
}

class Game : IPlayable
{
    public string Title { get; }
    public Game(string title) { Title = title; }
    public void Play() { Console.WriteLine($"[게임] {Title} 을(를) 실행합니다"); }
}

class Program
{
    static void PlayAll(IPlayable[] items)
    {
        foreach (IPlayable p in items) p.Play();
        Console.WriteLine($"총 {items.Length}개 재생 완료");
    }

    static void Main()
    {
        IPlayable[] items = { new Song("봄날"), new Movie("기생충", 132), new Game("테트리스") };
        PlayAll(items);
    }
}`,
            notes: '<p><b>[8분]</b> 흔한 오류: 구현 메서드에 <code>public</code> 을 빼먹어 CS0737. Ctrl+. 빠른 작업을 써도 좋다고 안내. 빨리 끝난 학생은 실습 9-4(추상 클래스 Account)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>abstract</code> 클래스: new ✗, 추상 메서드는 본문 없음 → 자식이 <code>override</code> 로 반드시 구현', '<code>interface</code>: 계약. 이름 I~, 멤버 자동 public, <b>여러 개 구현</b>, new ✗', '추상 클래스 = is-a + 공통 코드 / 인터페이스 = can-do', '<code>is</code> · <code>is T x</code> · <code>as</code>(null) · <code>(T)</code>(예외) · switch 형식 패턴', '<code>IComparable&lt;T&gt;</code> 구현 → <code>Sort()</code>; 인터페이스 매개변수 → 느슨한 결합'],
            notes: '<p>학습 목표 5개를 한 문장씩 확인. 다음 장(10장): 문자열 처리 · 예외 처리(try/catch — 오늘 본 InvalidCastException 을 잡는 법) · 파일 입출력.</p>' }
        ]
      }
    ]
  });
})();
