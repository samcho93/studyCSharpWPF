/* Chapter 05. 반복문 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  const SVG_FOR = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="for 문의 실행 순서">
  <defs>
    <marker id="ah5a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah5b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
  </defs>
  <text x="640" y="52" text-anchor="middle" style="${MONO};font-size:28px;font-weight:700;fill:var(--fg)">for (<tspan fill="var(--accent)">int i = 1</tspan>; <tspan fill="var(--accent2)">i &lt;= 5</tspan>; <tspan fill="var(--ok)">i++</tspan>) { <tspan fill="var(--warn)">본문</tspan> }</text>
  <text x="640" y="86" text-anchor="middle" style="font-size:21px;fill:var(--muted)">세미콜론으로 나뉜 세 부분 + 중괄호 본문 — 실행 순서는 ① → ② → ③ → ④ → ② → ③ → ④ → …</text>
  <rect x="40" y="170" width="240" height="110" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="160" y="205" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">① 초기식</text>
  <text x="160" y="240" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">int i = 1;</text>
  <text x="160" y="268" text-anchor="middle" style="font-size:19px;fill:var(--muted)">처음 딱 한 번</text>
  <line x1="285" y1="225" x2="345" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5a)"/>
  <rect x="350" y="170" width="240" height="110" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="470" y="205" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">② 조건식</text>
  <text x="470" y="240" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">i &lt;= 5 ?</text>
  <text x="470" y="268" text-anchor="middle" style="font-size:19px;fill:var(--muted)">돌기 전에 매번 검사</text>
  <line x1="595" y1="225" x2="655" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5a)"/>
  <text x="625" y="210" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--ok)">참</text>
  <rect x="660" y="170" width="240" height="110" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="780" y="205" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--warn)">③ 본문</text>
  <text x="780" y="240" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">{ WriteLine(i); }</text>
  <text x="780" y="268" text-anchor="middle" style="font-size:19px;fill:var(--muted)">참일 때만 실행</text>
  <line x1="905" y1="225" x2="965" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5a)"/>
  <rect x="970" y="170" width="240" height="110" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1090" y="205" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">④ 증감식</text>
  <text x="1090" y="240" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">i++</text>
  <text x="1090" y="268" text-anchor="middle" style="font-size:19px;fill:var(--muted)">본문이 끝난 뒤</text>
  <path d="M1090,165 L1090,125 L470,125 L470,160" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5a)"/>
  <text x="780" y="117" text-anchor="middle" style="font-size:20px;fill:var(--accent)">다시 ② 조건식으로</text>
  <line x1="470" y1="285" x2="470" y2="345" stroke="var(--danger)" stroke-width="4" marker-end="url(#ah5b)"/>
  <text x="510" y="322" text-anchor="start" style="font-size:20px;font-weight:700;fill:var(--danger)">거짓</text>
  <rect x="350" y="350" width="240" height="60" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="470" y="388" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--danger)">반복 종료 → 다음 문장</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:24px;fill:var(--fg)">i 의 변화: 1 → 2 → 3 → 4 → 5 → <tspan font-weight="700">6</tspan>  (6 일 때 조건이 거짓 → 본문은 <tspan font-weight="700">5번</tspan> 실행)</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--muted)">조건식은 본문보다 한 번 더 검사된다 (본문 5번, 조건 검사 6번)</text>
</svg>`;

  const SVG_NESTED = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="중첩 반복의 실행 순서">
  <defs><marker id="ah5c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="48" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">중첩 반복: 바깥 반복이 한 칸 갈 때, 안쪽 반복은 한 바퀴를 다 돈다 (시침 한 칸 = 분침 한 바퀴)</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)">
    <text x="60" y="100"><tspan fill="var(--accent)">for</tspan> (int i = 1; i &lt;= 3; i++)          <tspan fill="var(--muted)">// 바깥(시침)</tspan></text>
    <text x="60" y="132">    <tspan fill="var(--accent2)">for</tspan> (int j = 1; j &lt;= 3; j++)      <tspan fill="var(--muted)">// 안쪽(분침)</tspan></text>
    <text x="60" y="164">        Console.Write($"({i},{j})");</text>
  </g>
  <g>
    <rect x="60" y="200" width="360" height="230" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="240" y="238" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">바깥 i = 1</text>
    <rect x="80" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="130" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=1</text>
    <text x="130" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">1번째</text>
    <rect x="190" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="240" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=2</text>
    <text x="240" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">2번째</text>
    <rect x="300" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="350" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=3</text>
    <text x="350" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">3번째</text>
    <text x="240" y="370" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">(1,1)(1,2)(1,3)</text>
    <text x="240" y="405" text-anchor="middle" style="font-size:18px;fill:var(--muted)">안쪽이 끝나야 i++</text>
  </g>
  <line x1="425" y1="315" x2="455" y2="315" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5c)"/>
  <g>
    <rect x="460" y="200" width="360" height="230" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="640" y="238" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">바깥 i = 2</text>
    <rect x="480" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="530" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=1</text>
    <text x="530" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">4번째</text>
    <rect x="590" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="640" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=2</text>
    <text x="640" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">5번째</text>
    <rect x="700" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="750" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=3</text>
    <text x="750" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">6번째</text>
    <text x="640" y="370" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">(2,1)(2,2)(2,3)</text>
    <text x="640" y="405" text-anchor="middle" style="font-size:18px;fill:var(--muted)">j 는 다시 1 부터</text>
  </g>
  <line x1="825" y1="315" x2="855" y2="315" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah5c)"/>
  <g>
    <rect x="860" y="200" width="360" height="230" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1040" y="238" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">바깥 i = 3</text>
    <rect x="880" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="930" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=1</text>
    <text x="930" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">7번째</text>
    <rect x="990" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1040" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=2</text>
    <text x="1040" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">8번째</text>
    <rect x="1100" y="260" width="100" height="70" rx="10" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1150" y="290" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">j=3</text>
    <text x="1150" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">9번째</text>
    <text x="1040" y="370" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">(3,1)(3,2)(3,3)</text>
    <text x="1040" y="405" text-anchor="middle" style="font-size:18px;fill:var(--muted)">i = 4 → 조건 거짓 → 끝</text>
  </g>
  <text x="640" y="480" text-anchor="middle" style="font-size:24px;fill:var(--fg)">본문은 <tspan font-weight="700">3 × 3 = 9번</tspan> 실행된다 — 바깥 횟수 × 안쪽 횟수</text>
  <text x="640" y="520" text-anchor="middle" style="font-size:22px;fill:var(--muted)">구구단: 바깥 = 단(2~9), 안쪽 = 곱하는 수(1~9) → 8 × 9 = 72 줄</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'ch05',
    no: '05',
    title: '반복문',
    subtitle: 'Loops',
    summary: '같은 일을 여러 번 되풀이하는 반복문 for · while · do-while 을 배우고, 중첩 반복과 break · continue 로 흐름을 조절합니다. 누적 · 카운트 · 최댓값 같은 기본 패턴과 소수 판정 · 숫자 뒤집기 같은 간단한 알고리즘, 메뉴 반복 구조까지 익힙니다.',
    goals: [
      'for 문의 초기식 · 조건식 · 증감식과 실행 순서를 설명할 수 있다',
      'while 과 do-while 의 차이를 알고 알맞게 사용할 수 있다',
      '누적(sum) · 카운트 · 최댓값 패턴으로 데이터를 집계할 수 있다',
      '중첩 반복으로 구구단 · 별 찍기 같은 2차원 출력을 만들 수 있다',
      'break · continue 로 반복의 흐름을 제어하고 foreach 로 문자열을 순회할 수 있다'
    ],
    sections: [
      /* ===================== ch05-1 ===================== */
      {
        id: 'ch05-1',
        title: 'for · while · do-while',
        minutes: 50,
        goals: [
          '반복문이 필요한 이유를 예로 설명할 수 있다',
          'for 문의 세 부분과 실행 순서를 말할 수 있다',
          'while 과 do-while 의 차이(최소 실행 횟수)를 설명할 수 있다',
          '누적 · 카운트 · 최댓값 패턴을 코드로 쓸 수 있다'
        ],
        flow: [['도입: 100번 출력하려면?', 5], ['for 문의 구조와 실행 순서', 13], ['while · do-while', 12], ['종료 조건 · 누적 패턴', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '반복이 필요한 이유' },
          { type: 'p', html: '“안녕하세요!” 를 100번 출력하려면 <code>Console.WriteLine</code> 을 100줄 쓰면 됩니다. 그런데 1,000번이라면? 횟수를 사용자가 정한다면? <b>반복문(loop)</b>은 <b>같은 일을 정해진 횟수만큼, 또는 조건이 만족되는 동안 되풀이</b>하는 문장입니다. 컴퓨터가 사람보다 잘하는 일이 바로 이 <b>지치지 않는 반복</b>입니다.' },
          { type: 'table', head: ['반복문', '언제 쓰나', '형태'], rows: [
            ['<code>for</code>', '<b>횟수가 정해져 있을 때</b> (1~10, 0~n-1)', '<code>for (초기식; 조건식; 증감식) { … }</code>'],
            ['<code>while</code>', '<b>조건이 참인 동안</b> 계속 (횟수를 모를 때)', '<code>while (조건) { … }</code>'],
            ['<code>do-while</code>', '<b>최소 한 번</b>은 실행하고 조건 검사 (입력 검증)', '<code>do { … } while (조건);</code>'],
            ['<code>foreach</code>', '문자열 · 배열 · 컬렉션의 <b>모든 요소를 하나씩</b>', '<code>foreach (var x in 모음) { … }</code> (다음 절)']
          ], caption: 'C# 의 네 가지 반복문 — 어느 것을 써도 같은 일을 할 수 있지만, 상황에 맞는 것이 읽기 쉽다' },
          { type: 'h', text: 'for 문 — 횟수가 정해진 반복' },
          { type: 'figure', html: SVG_FOR, caption: 'for 문의 실행 순서: 초기식(한 번) → 조건식 → 본문 → 증감식 → 조건식 → … → 조건이 거짓이면 종료' },
          { type: 'list', items: [
            '<b>초기식</b> <code>int i = 1</code>: 반복을 세는 <b>반복 변수(loop variable)</b> 를 만들고 시작값을 넣습니다. <b>처음 한 번만</b> 실행됩니다.',
            '<b>조건식</b> <code>i &lt;= 5</code>: 본문을 실행하기 <b>전에 매번</b> 검사합니다. 참이면 본문, 거짓이면 반복을 끝냅니다.',
            '<b>본문</b> <code>{ … }</code>: 되풀이할 문장들. 한 문장이면 중괄호를 생략할 수 있지만, 실수를 막기 위해 <b>항상 쓰는 습관</b>을 권합니다.',
            '<b>증감식</b> <code>i++</code>: 본문이 끝난 뒤 실행됩니다. <code>i += 2</code>, <code>i--</code> 처럼 자유롭게 쓸 수 있습니다.'
          ] },
          { type: 'code', title: '예제 5-1. 반복 없이 vs for 문으로', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== 반복 없이 ===");
        Console.WriteLine("안녕하세요!");
        Console.WriteLine("안녕하세요!");
        Console.WriteLine("안녕하세요!");

        Console.WriteLine("=== for 문으로 ===");
        for (int i = 1; i <= 5; i++)      // i 가 1 부터 5 까지: 본문 5번
        {
            Console.WriteLine($"{i}번째 안녕하세요!");
        }
        Console.WriteLine("반복 끝");
    }
}`, expect: `=== 반복 없이 ===
안녕하세요!
안녕하세요!
안녕하세요!
=== for 문으로 ===
1번째 안녕하세요!
2번째 안녕하세요!
3번째 안녕하세요!
4번째 안녕하세요!
5번째 안녕하세요!
반복 끝`, desc: '<code>12행</code>의 <code>5</code> 를 <code>100</code> 으로 바꿔 실행해 보세요. 코드는 한 글자만 바뀌지만 출력은 100줄이 됩니다. 반복 변수 <code>i</code> 는 본문 안에서 <b>지금 몇 번째인지</b>를 알려 주는 값으로 쓸 수 있습니다.' },
          { type: 'code', title: '추가 예제. 여러 가지 for — 2씩, 거꾸로, 문자로', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("2씩 증가:");
        for (int i = 0; i <= 10; i += 2)
            Console.Write($" {i}");
        Console.WriteLine();

        Console.Write("거꾸로:");
        for (int i = 5; i >= 1; i--)
            Console.Write($" {i}");
        Console.WriteLine();

        Console.Write("문자:");
        for (char c = 'A'; c <= 'E'; c++)    // char 도 ++ 가 된다
            Console.Write($" {c}");
        Console.WriteLine();
    }
}`, expect: `2씩 증가: 0 2 4 6 8 10
거꾸로: 5 4 3 2 1
문자: A B C D E`, desc: '증감식은 <code>i++</code> 만 가능한 것이 아닙니다. 시작값 · 조건 · 증감을 바꾸면 <b>어떤 규칙의 수열</b>이든 만들 수 있습니다. 본문이 한 문장이라 중괄호를 생략했지만, 두 문장 이상이면 반드시 중괄호로 묶어야 합니다.' },
          { type: 'h', text: '누적 — 반복하며 값을 쌓기' },
          { type: 'p', html: '반복문에서 가장 많이 쓰는 패턴은 <b>누적(accumulate)</b>입니다. 반복 <b>바깥</b>에 합계 변수를 <code>0</code> 으로 만들어 두고, 반복 <b>안</b>에서 매번 더합니다. 저금통에 동전을 하나씩 넣는 것과 같습니다 — 저금통(<code>sum</code>)은 반복 전에 준비해야 합니다.' },
          { type: 'code', title: '예제 5-2. 1 부터 10 까지의 합', code: `using System;

class Program
{
    static void Main()
    {
        int sum = 0;                          // 저금통: 반복 바깥에서 0 으로 시작
        for (int i = 1; i <= 10; i++)
        {
            sum += i;                         // sum = sum + i
            Console.WriteLine($"i = {i,2}, sum = {sum,2}");
        }
        Console.WriteLine($"1부터 10까지 합 = {sum}");
    }
}`, expect: `i =  1, sum =  1
i =  2, sum =  3
i =  3, sum =  6
i =  4, sum = 10
i =  5, sum = 15
i =  6, sum = 21
i =  7, sum = 28
i =  8, sum = 36
i =  9, sum = 45
i = 10, sum = 55
1부터 10까지 합 = 55`, desc: '반복 안의 <code>WriteLine</code> 은 <b>추적(trace)</b>용입니다. 매 회차에 <code>i</code> 와 <code>sum</code> 이 어떻게 변하는지 눈으로 확인하세요. <code>int sum = 0;</code> 을 반복 안으로 옮기면 매번 0 으로 되돌아가 합이 쌓이지 않습니다.' },
          { type: 'code', title: '예제 5-3. 입력받은 단의 구구단', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("단을 입력: ");
        int dan = int.Parse(Console.ReadLine());

        for (int i = 1; i <= 9; i++)
        {
            Console.WriteLine($"{dan} x {i} = {dan * i}");
        }
    }
}`, stdin: '7\n', expect: `단을 입력: 7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63`, desc: '입력값 <code>7</code> 은 출력에 나타나지 않으므로 “단을 입력: ” 뒤에 첫 줄이 바로 붙습니다. 반복 변수 <code>i</code> 가 곱하는 수 역할을 합니다. 전체 구구단(2~9단)은 다음 절의 <b>중첩 반복</b>으로 만듭니다.' },
          { type: 'h', text: 'while 문 — 조건이 참인 동안' },
          { type: 'p', html: '<code>while</code> 은 <b>조건만</b> 씁니다. 몇 번 돌지 미리 모르고, <b>“~할 때까지”</b> 반복할 때 씁니다. 초기식과 증감식은 프로그래머가 알아서 바깥과 안에 써야 합니다 — 증감을 빠뜨리면 조건이 영원히 참이 되어 <b>무한 루프</b>에 빠집니다.' },
          { type: 'code', title: '예제 5-4. while — 카운트다운과 “1000 을 넘을 때까지”', code: `using System;

class Program
{
    static void Main()
    {
        int n = 5;                    // 초기식 역할 (바깥)
        while (n > 0)                 // 조건이 참인 동안
        {
            Console.Write($"{n} ");
            n--;                      // 증감식 역할 (안) — 빠뜨리면 무한 루프!
        }
        Console.WriteLine("발사!");

        int power = 1, count = 0;
        while (power < 1000)          // 몇 번 돌지 미리 모른다
        {
            power *= 2;
            count++;
        }
        Console.WriteLine($"2를 {count}번 곱하면 1000을 넘는다: {power}");
    }
}`, expect: `5 4 3 2 1 발사!
2를 10번 곱하면 1000을 넘는다: 1024`, desc: '두 번째 반복은 “2 를 몇 번 곱해야 1000 을 넘는가?” 처럼 <b>횟수를 모르는</b> 문제입니다. 이런 문제는 <code>for</code> 보다 <code>while</code> 이 자연스럽습니다. <code>for (;;)</code> 처럼 세 부분을 비우면 <code>while (true)</code> 와 같습니다.' },
          { type: 'h', text: 'do-while 문 — 일단 한 번 하고 검사' },
          { type: 'p', html: '<code>while</code> 은 조건을 <b>먼저</b> 검사하므로 처음부터 거짓이면 본문이 한 번도 실행되지 않습니다. <code>do-while</code> 은 본문을 <b>먼저 실행한 뒤</b> 조건을 검사하므로 <b>최소 한 번은 실행</b>됩니다. 대표적인 쓰임이 <b>입력 검증</b>입니다 — 일단 입력을 받아 봐야 맞는지 틀린지 알 수 있으니까요. 끝의 세미콜론 <code>while (…);</code> 을 잊지 마세요.' },
          { type: 'code', title: '추가 예제. while 과 do-while 의 차이 — 조건이 처음부터 거짓이면?', code: `using System;

class Program
{
    static void Main()
    {
        int i = 100;

        while (i < 10)                       // 처음부터 거짓 → 한 번도 실행 안 됨
        {
            Console.WriteLine("while: 실행됨");
        }

        do
        {
            Console.WriteLine("do-while: 조건이 거짓이어도 한 번은 실행됨");
        } while (i < 10);                    // 본문을 한 번 실행한 뒤 검사

        Console.WriteLine("끝");
    }
}`, expect: `do-while: 조건이 거짓이어도 한 번은 실행됨
끝`, desc: '같은 조건 <code>i &lt; 10</code> 인데 <code>while</code> 본문은 0번, <code>do-while</code> 본문은 1번 실행되었습니다. “검사 → 실행” 인지 “실행 → 검사” 인지의 차이입니다.' },
          { type: 'code', title: '예제 5-5. do-while 로 입력 검증 — 범위 안의 수가 들어올 때까지', code: `using System;

class Program
{
    static void Main()
    {
        int num;
        do
        {
            Console.Write("1~10 사이의 수: ");
            num = int.Parse(Console.ReadLine());
            if (num < 1 || num > 10)
                Console.WriteLine("범위를 벗어났습니다.");
        } while (num < 1 || num > 10);       // 잘못된 값이면 다시

        Console.WriteLine($"입력한 수: {num}");
    }
}`, stdin: '15\n0\n7\n', expect: `1~10 사이의 수: 범위를 벗어났습니다.
1~10 사이의 수: 범위를 벗어났습니다.
1~10 사이의 수: 입력한 수: 7`, desc: '예시 입력은 <code>15</code>, <code>0</code>, <code>7</code> 입니다. 앞의 두 값은 범위를 벗어나 다시 묻고, <code>7</code> 이 들어오자 반복이 끝납니다. <code>num</code> 을 <code>do</code> <b>바깥</b>에 선언한 이유는 <code>while (…)</code> 조건과 반복 뒤에서도 써야 하기 때문입니다.' },
          { type: 'h', text: '무한 루프와 종료 조건' },
          { type: 'p', html: '조건이 영원히 참이면 프로그램이 멈추지 않는 <b>무한 루프(infinite loop)</b>가 됩니다. 대부분은 실수(증감 누락, 조건 방향 반대)이지만, 게임 · 메뉴처럼 <b>일부러</b> 계속 돌게 만들고 <b>안에서 종료 조건</b>을 두는 경우도 많습니다. 반복문을 쓸 때는 항상 <b>“이 반복은 어떻게 끝나는가?”</b> 를 먼저 생각하세요.' },
          { type: 'callout', kind: 'warn', title: '무한 루프에 빠지는 흔한 실수', html: '<ul><li><code>while (n &gt; 0) { Console.WriteLine(n); }</code> — <code>n--</code> 를 빠뜨림</li><li><code>for (int i = 0; i &lt; 5; i--)</code> — 증감 방향이 반대라 조건이 영원히 참</li><li><code>for (int i = 0; i &lt; 5; i++);</code> — 끝에 세미콜론을 붙이면 <b>빈 문장</b>을 5번 반복하고, 아래 블록은 한 번만 실행 (무한 루프는 아니지만 자주 헷갈리는 실수)</li></ul><p>이 강좌의 웹 콘솔에서 무한 루프에 빠지면 <b>■ 중지</b> 버튼으로 멈출 수 있습니다. Visual Studio 에서는 <b>디버그 → 디버깅 중지</b>(<kbd>Shift</kbd>+<kbd>F5</kbd>).</p>' },
          { type: 'code', title: '추가 예제. 0 을 입력할 때까지 — 종료 조건이 있는 반복', code: `using System;

class Program
{
    static void Main()
    {
        int sum = 0, count = 0;
        bool running = true;

        while (running)                          // 플래그가 true 인 동안
        {
            Console.Write("수 입력(0 이면 종료): ");
            int n = int.Parse(Console.ReadLine());
            if (n == 0)
                running = false;                 // 종료 조건: 플래그를 끈다
            else
            {
                sum += n;
                count++;
            }
        }
        Console.WriteLine($"{count}개 입력, 합계 = {sum}");
    }
}`, stdin: '10\n20\n30\n0\n', expect: `수 입력(0 이면 종료): 수 입력(0 이면 종료): 수 입력(0 이면 종료): 수 입력(0 이면 종료): 3개 입력, 합계 = 60`, desc: '<code>bool running</code> 같은 <b>플래그(flag) 변수</b>로 반복을 끝내는 방식입니다. 몇 개를 입력할지 모르므로 <code>for</code> 로는 쓸 수 없습니다. 다음 절에서 배우는 <code>break</code> 를 쓰면 플래그 없이 더 짧게 쓸 수 있습니다.' },
          { type: 'h', text: '누적 · 카운트 · 최댓값 패턴' },
          { type: 'p', html: '데이터를 하나씩 살펴보며 <b>집계</b>하는 세 가지 기본 패턴입니다. 세 패턴 모두 <b>반복 바깥에서 변수를 준비</b>하고, <b>반복 안에서 갱신</b>합니다.' },
          { type: 'table', head: ['패턴', '준비 (반복 바깥)', '갱신 (반복 안)', '뜻'], rows: [
            ['<b>누적(sum)</b>', '<code>int sum = 0;</code>', '<code>sum += n;</code>', '값을 모두 더한다'],
            ['<b>카운트(count)</b>', '<code>int count = 0;</code>', '<code>if (조건) count++;</code>', '조건에 맞는 것의 개수를 센다'],
            ['<b>최댓값(max)</b>', '<code>int max = int.MinValue;</code>', '<code>if (n &gt; max) max = n;</code>', '지금까지 본 것 중 가장 큰 값을 기억'],
            ['<b>최솟값(min)</b>', '<code>int min = int.MaxValue;</code>', '<code>if (n &lt; min) min = n;</code>', '가장 작은 값을 기억']
          ] },
          { type: 'code', title: '예제 5-6. 다섯 수의 합 · 평균 · 짝수 개수 · 최댓값 · 최솟값', code: `using System;

class Program
{
    static void Main()
    {
        int sum = 0, evenCount = 0;
        int max = int.MinValue, min = int.MaxValue;   // 어떤 값이 와도 갱신되도록

        for (int i = 1; i <= 5; i++)
        {
            Console.Write($"{i}번째 수: ");
            int n = int.Parse(Console.ReadLine());

            sum += n;                         // 누적
            if (n % 2 == 0) evenCount++;      // 카운트
            if (n > max) max = n;             // 최댓값
            if (n < min) min = n;             // 최솟값
        }

        Console.WriteLine($"합계: {sum}, 평균: {sum / 5.0:F1}");
        Console.WriteLine($"짝수 개수: {evenCount}");
        Console.WriteLine($"최댓값: {max}, 최솟값: {min}");
    }
}`, stdin: '12\n7\n25\n3\n18\n', expect: `1번째 수: 2번째 수: 3번째 수: 4번째 수: 5번째 수: 합계: 65, 평균: 13.0
짝수 개수: 2
최댓값: 25, 최솟값: 3`, desc: '예시 입력은 <code>12 7 25 3 18</code> 입니다. <code>max</code> 의 시작값을 <code>0</code> 으로 두면 모든 입력이 음수일 때 틀린 답(0)이 나오므로 <code>int.MinValue</code> 로 시작합니다. 평균은 <code>sum / 5.0</code> 처럼 <b>실수 나눗셈</b>으로 구해야 소수점이 살아남습니다(2장).' },
          { type: 'h', text: '반복 변수의 범위(scope)' },
          { type: 'p', html: '<code>for (int i = …)</code> 로 만든 <code>i</code> 는 <b>그 for 문 안에서만</b> 살아 있습니다. 반복이 끝나면 사라지므로 바깥에서 쓸 수 없고, 그래서 여러 for 문이 각자 <code>i</code> 를 다시 선언해도 충돌하지 않습니다. 반복이 끝난 뒤에도 값이 필요하면 변수를 <b>for 바깥에</b> 선언하세요.' },
          { type: 'code', title: '추가 예제. 반복 변수를 바깥에서 쓰면? — 오류 읽기', code: `using System;

class Program
{
    static void Main()
    {
        for (int i = 0; i < 3; i++)
        {
            Console.WriteLine(i);
        }
        Console.WriteLine(i);      // CS0103: i 는 for 문 안에서만 존재한다
    }
}`, expectCompileError: true, desc: '<code>CS0103: \'i\' 이름이 현재 컨텍스트에 없습니다</code> 오류가 납니다. 고치려면 <code>int i;</code> 를 <code>for</code> 앞에 선언하고 <code>for (i = 0; …)</code> 로 쓰세요. 그러면 반복이 끝난 뒤 <code>i</code> 는 <code>3</code> 입니다.' },
          { type: 'callout', kind: 'tip', title: '어떤 반복문을 고를까?', html: '<ul><li>“<b>n 번</b>” · “<b>1 부터 10 까지</b>” 처럼 횟수가 보이면 → <code>for</code></li><li>“<b>~할 때까지</b>” · “<b>~인 동안</b>” 처럼 조건만 보이면 → <code>while</code></li><li>“<b>일단 한 번 해 보고</b> 다시” (입력 검증, 메뉴) → <code>do-while</code></li></ul>세 문장은 서로 바꿔 쓸 수 있습니다. 읽는 사람에게 <b>의도가 가장 잘 보이는 것</b>을 고르세요.' }
        ],
        practice: [
          {
            title: '실습 5-1. 1 부터 N 까지 짝수의 합',
            level: 1,
            desc: '<p>양의 정수 N 을 입력받아 <b>1 부터 N 까지의 짝수</b>를 모두 더한 값을 출력하세요. (N = 10 이면 2 + 4 + 6 + 8 + 10 = 30)</p><pre>N 입력: 10\n1부터 10까지 짝수의 합 = 30</pre>',
            hint: '<code>i</code> 를 2 부터 시작해 <code>i += 2</code> 로 증가시키거나, 1 부터 돌면서 <code>if (i % 2 == 0)</code> 일 때만 더합니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("N 입력: ");
        int n = int.Parse(Console.ReadLine());
        int sum = 0;
        // TODO: for 문으로 짝수만 누적

        Console.WriteLine($"1부터 {n}까지 짝수의 합 = {sum}");
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("N 입력: ");
        int n = int.Parse(Console.ReadLine());
        int sum = 0;
        for (int i = 2; i <= n; i += 2)
        {
            sum += i;
        }
        Console.WriteLine($"1부터 {n}까지 짝수의 합 = {sum}");
    }
}
`,
            stdin: '10\n',
            expect: `N 입력: 1부터 10까지 짝수의 합 = 30`
          },
          {
            title: '실습 5-2. 자릿수의 합',
            level: 2,
            desc: '<p>양의 정수를 입력받아 <b>각 자릿수를 모두 더한 값</b>을 출력하세요. (1234 → 1 + 2 + 3 + 4 = 10)</p><pre>수 입력: 1234\n1234 의 자릿수 합 = 10</pre><p>힌트: <code>n % 10</code> 은 마지막 자릿수, <code>n / 10</code> 은 마지막 자릿수를 떼어 낸 수입니다. <code>n</code> 이 0 이 될 때까지 <code>while</code> 로 반복하세요. 원래 수는 출력에 필요하니 다른 변수에 복사해 두세요.</p>',
            hint: '<code>while (n &gt; 0) { sum += n % 10; n /= 10; }</code>',
            starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("수 입력: ");
        int n = int.Parse(Console.ReadLine());
        int original = n;      // 출력용으로 보관
        int sum = 0;
        // TODO: while 문으로 자릿수 누적

        Console.WriteLine($"{original} 의 자릿수 합 = {sum}");
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("수 입력: ");
        int n = int.Parse(Console.ReadLine());
        int original = n;
        int sum = 0;
        while (n > 0)
        {
            sum += n % 10;     // 마지막 자릿수를 더하고
            n /= 10;           // 마지막 자릿수를 떼어 낸다
        }
        Console.WriteLine($"{original} 의 자릿수 합 = {sum}");
    }
}
`,
            stdin: '1234\n',
            expect: `수 입력: 1234 의 자릿수 합 = 10`
          }
        ],
        quiz: [
          { q: '다음 코드가 끝난 뒤 <code>count</code> 의 값은?<pre><code>int count = 0;\nfor (int i = 0; i &lt; 10; i += 3)\n{\n    count++;\n}</code></pre>', options: ['3', '4', '10', '무한 반복'], answer: 1, explain: '<code>i</code> 는 0, 3, 6, 9 로 네 번 조건을 통과하고 12 에서 거짓이 됩니다. 본문은 4번 실행.' },
          { q: '다음 코드의 출력은?<pre><code>int i = 1;\nwhile (i &lt; 5)\n{\n    i *= 2;\n}\nConsole.WriteLine(i);</code></pre>', options: ['4', '5', '8', '16'], answer: 2, explain: '1 → 2 → 4 (4 &lt; 5 참이므로 한 번 더) → 8. 8 은 조건이 거짓이라 종료.' },
          { q: '조건이 처음부터 거짓일 때 <code>do { … } while (조건);</code> 의 본문은 몇 번 실행되나?', options: ['1번', '0번', '무한히', '컴파일 오류'], answer: 0, explain: 'do-while 은 본문을 먼저 실행하고 조건을 검사하므로 최소 1번은 실행됩니다.' },
          { q: '다음 코드의 출력은?<pre><code>for (int i = 5; i &gt; 0; i -= 2)\n    Console.Write(i);</code></pre>', options: ['54321', '42', '5310', '531'], answer: 3, explain: '5 → 3 → 1 순서로 출력되고, -1 에서 조건이 거짓이 됩니다.' },
          { q: '다음 중 <b>무한 루프</b>가 되는 것은? (x 는 처음에 3)', options: ['<code>for (int i = 0; i &lt; 5; i++) { }</code>', '<code>while (x &gt; 0) { x--; }</code>', '<code>for (int i = 0; i &lt; 5; i--) { }</code>', '<code>do { x--; } while (x &gt; 0);</code>'], answer: 2, explain: '<code>i--</code> 로 감소하면 <code>i &lt; 5</code> 가 영원히 참입니다. 증감 방향을 확인하세요.' }
        ],
        slides: [
          { layout: 'title', title: 'for · while · do-while', subtitle: 'Chapter 05 · Section 01 — 반복문', badge: '05-1',
            notes: '<p><b>[도입 3분]</b> 칠판에 “안녕하세요! 를 100번 출력하는 프로그램” 을 어떻게 만들지 묻습니다. WriteLine 100줄? 1,000번이면? 사용자가 횟수를 정한다면? → 반복문이 필요한 순간.</p><p>오늘 목표: for 의 세 부분과 실행 순서, while / do-while 의 차이, 누적 · 카운트 · 최댓값 패턴.</p>' },
          { layout: 'bullets', title: '반복문 — 같은 일을 되풀이하기', lead: '컴퓨터가 사람보다 잘하는 일: 지치지 않는 반복',
            bullets: ['<code>for</code>: <b>횟수가 정해진</b> 반복 (1~10, n 번)', '<code>while</code>: <b>조건이 참인 동안</b> (횟수를 모를 때)', '<code>do-while</code>: <b>일단 한 번</b> 하고 검사 (입력 검증)', '<code>foreach</code>: 모음의 요소를 하나씩 (다음 절)', ['어느 것을 써도 되지만 <b>의도가 보이는 것</b>을 고른다']],
            notes: '<p><b>[4분]</b> 네 가지를 한 줄씩. “횟수가 보이면 for, 조건만 보이면 while, 일단 해 보고는 do-while” 로 요약. foreach 는 다음 절에서.</p>' },
          { layout: 'diagram', title: 'for 문의 실행 순서', html: SVG_FOR, caption: '초기식(한 번) → 조건식 → 본문 → 증감식 → 조건식 → … → 거짓이면 종료',
            notes: '<p><b>[8분]</b> 화살표를 따라 손으로 짚으며 ① → ② → ③ → ④ → ② … 를 소리 내어 읽습니다. 발문: “초기식은 몇 번 실행되나?” (1번) “본문이 5번이면 조건 검사는 몇 번?” (6번) “반복이 끝났을 때 i 는?” (6).</p><p>중괄호 생략 가능하지만 항상 쓰라고 권합니다.</p>' },
          { layout: 'code', title: '예제 5-1. 반복 없이 vs for 문으로', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("안녕하세요!");
        Console.WriteLine("안녕하세요!");
        Console.WriteLine("안녕하세요!");

        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine($"{i}번째 안녕하세요!");
        }
        Console.WriteLine("반복 끝");
    }
}`, points: ['<code>int i = 1</code> 초기식 — 처음 한 번', '<code>i &lt;= 5</code> 조건식 — 매번 검사', '<code>i++</code> 증감식 — 본문 뒤', '<code>i</code> 로 “몇 번째” 를 알 수 있다'],
            notes: '<p><b>[5분]</b> 실행 후 5 를 100 으로, 시작을 0 으로, <code>i += 2</code> 로 바꿔 가며 실행. “거꾸로 5 4 3 2 1 은 어떻게?” 를 학생이 답하게 합니다.</p>' },
          { layout: 'code', title: '누적 패턴 — 1~10 의 합과 구구단', code: `using System;

class Program
{
    static void Main()
    {
        int sum = 0;                  // 저금통은 반복 바깥에
        for (int i = 1; i <= 10; i++)
        {
            sum += i;                 // 매번 더한다
        }
        Console.WriteLine($"1~10 합 = {sum}");

        Console.Write("단: ");
        int dan = int.Parse(Console.ReadLine());
        for (int i = 1; i <= 9; i++)
        {
            Console.WriteLine($"{dan} x {i} = {dan * i}");
        }
    }
}`, stdin: '7\n', points: ['<code>int sum = 0</code> 은 <b>반복 바깥</b>에', '<code>sum += i</code> 로 쌓는다', '구구단: 반복 변수가 곱하는 수', '두 for 문의 <code>i</code> 는 서로 다른 변수'],
            notes: '<p><b>[6분]</b> 발문: “<code>int sum = 0;</code> 을 for 안으로 옮기면?” → 매번 0 으로 초기화되어 합이 10. 직접 옮겨서 실행해 보여 줍니다. 구구단은 단을 바꿔 가며 실행.</p>' },
          { layout: 'two', title: 'while 과 do-while', left: { title: 'while — 검사 후 실행', code: `int n = 5;
while (n > 0)      // 먼저 검사
{
    Console.Write($"{n} ");
    n--;           // 빠뜨리면 무한 루프
}`, run: false }, right: { title: 'do-while — 실행 후 검사', code: `int num;
do
{
    Console.Write("1~10: ");
    num = int.Parse(Console.ReadLine());
} while (num < 1 || num > 10);
// 최소 1번 실행, 끝에 ; 필수`, run: false },
            notes: '<p><b>[6분]</b> 왼쪽: 초기식 · 증감식이 for 처럼 정해진 자리가 없어 프로그래머가 바깥과 안에 직접 쓴다. 오른쪽: 입력은 일단 받아 봐야 검사할 수 있으므로 do-while 이 자연스럽다. 발문: “조건이 처음부터 거짓이면 각각 몇 번 실행?” (0번 / 1번).</p>' },
          { layout: 'code', title: '예제 5-5. do-while 로 입력 검증', code: `using System;

class Program
{
    static void Main()
    {
        int num;
        do
        {
            Console.Write("1~10 사이의 수: ");
            num = int.Parse(Console.ReadLine());
            if (num < 1 || num > 10)
                Console.WriteLine("범위를 벗어났습니다.");
        } while (num < 1 || num > 10);

        Console.WriteLine($"입력한 수: {num}");
    }
}`, stdin: '15\n0\n7\n', points: ['본문 먼저, 조건은 나중에', '잘못된 값이면 <b>다시</b> 묻는다', '<code>num</code> 은 do 바깥에 선언', '<code>while (…);</code> 세미콜론'],
            notes: '<p><b>[5분]</b> 예시 입력 15, 0, 7 로 실행. 학생에게 다른 값을 넣어 보게 합니다. “왜 num 을 do 안에 선언하면 안 되나?” → while 조건에서 보이지 않음(범위).</p>' },
          { layout: 'bullets', title: '무한 루프와 종료 조건', lead: '반복문을 쓸 때 첫 질문: “이 반복은 어떻게 끝나는가?”',
            bullets: ['증감 누락: <code>while (n &gt; 0) { WriteLine(n); }</code>', '방향 반대: <code>for (int i = 0; i &lt; 5; i--)</code>', '끝의 세미콜론: <code>for (…);</code> → 빈 문장 반복', ['일부러 계속 돌리기: <code>while (running)</code> + 플래그', ['게임 · 메뉴 · “0 을 입력할 때까지”']], '멈추기: 웹 콘솔 ■ 중지 / VS <kbd>Shift</kbd>+<kbd>F5</kbd>'],
            notes: '<p><b>[4분]</b> 일부러 <code>n--</code> 를 지우고 실행해 무한 루프를 보여 준 뒤 ■ 중지로 멈춥니다. 플래그 변수 방식(“0 을 입력할 때까지” 예제)을 소개하고, 다음 절의 break 를 예고.</p>' },
          { layout: 'code', title: '예제 5-6. 합 · 평균 · 짝수 개수 · 최댓값', code: `using System;

class Program
{
    static void Main()
    {
        int sum = 0, evenCount = 0;
        int max = int.MinValue;
        for (int i = 1; i <= 5; i++)
        {
            Console.Write($"{i}번째 수: ");
            int n = int.Parse(Console.ReadLine());
            sum += n;                       // 누적
            if (n % 2 == 0) evenCount++;    // 카운트
            if (n > max) max = n;           // 최댓값
        }
        Console.WriteLine($"합계 {sum}, 평균 {sum / 5.0:F1}");
        Console.WriteLine($"짝수 {evenCount}개, 최댓값 {max}");
    }
}`, stdin: '12\n7\n25\n3\n18\n', points: ['준비는 <b>바깥</b>, 갱신은 <b>안</b>', '누적 <code>sum += n</code>', '카운트 <code>if (조건) count++</code>', '최댓값 <code>if (n &gt; max) max = n</code>'],
            notes: '<p><b>[6분]</b> 세 패턴을 한 줄씩 짚습니다. 발문: “max 를 0 에서 시작하면 어떤 문제?” → 모두 음수일 때 틀림. “최솟값은 어떻게?” → int.MaxValue 에서 시작해 &lt; 로 비교. 평균의 5.0 은 2장 정수 나눗셈 복습.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>int i = 1;\nwhile (i &lt; 5)\n{\n    i *= 2;\n}\nConsole.WriteLine(i);</code></pre>', options: ['4', '5', '8', '16'], answer: 2, explain: '1 → 2 → 4 → 8. 4 는 아직 5 보다 작으므로 한 번 더 곱해집니다.',
            notes: '<p>표를 그려 i 의 변화를 추적하게 합니다(1, 2, 4, 8). “조건 검사는 몇 번?” (4번).</p>' },
          { layout: 'practice', title: '실습 5-2. 자릿수의 합', desc: '<p>양의 정수를 입력받아 각 자릿수의 합을 출력하세요. (1234 → 10)</p><p><code>n % 10</code> 은 마지막 자릿수, <code>n / 10</code> 은 마지막 자릿수를 떼어 낸 수. <code>n</code> 이 0 이 될 때까지 반복합니다.</p>', starter: `using System;

class Program
{
    static void Main()
    {
        Console.Write("수 입력: ");
        int n = int.Parse(Console.ReadLine());
        int original = n;
        int sum = 0;
        // TODO: while 로 자릿수 누적
        Console.WriteLine($"{original} 의 자릿수 합 = {sum}");
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        Console.Write("수 입력: ");
        int n = int.Parse(Console.ReadLine());
        int original = n;
        int sum = 0;
        while (n > 0)
        {
            sum += n % 10;
            n /= 10;
        }
        Console.WriteLine($"{original} 의 자릿수 합 = {sum}");
    }
}`, stdin: '1234\n',
            notes: '<p><b>[8분]</b> 1234 로 추적표: n=1234 sum=4 → n=123 sum=7 → n=12 sum=9 → n=1 sum=10 → n=0 종료. 빨리 끝난 학생은 실습 5-1(짝수 합)이나 “자릿수 개수 세기” 로 확장.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>for (초기식; 조건식; 증감식)</code> — ① → ② → ③ → ④ → ② …', '<code>while (조건)</code> 검사 후 실행 · <code>do { } while (조건);</code> 실행 후 검사', '반복은 <b>어떻게 끝나는가</b>를 먼저 — 증감 · 조건 방향 · 플래그', '누적 <code>sum += n</code> · 카운트 <code>count++</code> · 최댓값 <code>if (n &gt; max)</code>', '반복 변수는 for 안에서만 산다(범위)'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: 중첩 반복(구구단 전체 · 별 찍기), break · continue, foreach.</p>' }
        ]
      },

      /* ===================== ch05-2 ===================== */
      {
        id: 'ch05-2',
        title: '중첩 반복 · break/continue · foreach',
        minutes: 50,
        goals: [
          '중첩 반복의 실행 순서를 설명하고 구구단 · 별 찍기를 만들 수 있다',
          'break 와 continue 의 차이와 중첩 반복에서 break 의 범위를 설명할 수 있다',
          'foreach 로 문자열의 글자를 순회할 수 있다',
          '반복문으로 약수 · 소수 판정 · 숫자 뒤집기 · 메뉴 반복을 구현할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['중첩 반복: 구구단 · 별 찍기', 13], ['break · continue · 범위', 10], ['foreach · 간단한 알고리즘', 12], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '중첩 반복 (nested loop)' },
          { type: 'p', html: '반복문 안에 또 반복문을 넣을 수 있습니다. <b>바깥 반복이 한 번 돌 때 안쪽 반복은 처음부터 끝까지 다 돕니다.</b> 시계의 시침이 한 칸 움직이는 동안 분침이 한 바퀴를 도는 것과 같습니다. 표(행 × 열)처럼 <b>2차원</b>으로 반복할 일에 씁니다 — 구구단, 별 찍기, 달력, 게임 판.' },
          { type: 'figure', html: SVG_NESTED, caption: '바깥 i 한 번마다 안쪽 j 는 1~3 을 모두 돈다 → 본문 실행 횟수 = 바깥 × 안쪽' },
          { type: 'code', title: '예제 5-7. 중첩 반복의 순서와 구구단 전체', code: `using System;

class Program
{
    static void Main()
    {
        // 실행 순서 확인: 바깥 i 한 번에 안쪽 j 가 1~3
        for (int i = 1; i <= 3; i++)
        {
            Console.Write($"i={i}:");
            for (int j = 1; j <= 3; j++)
            {
                Console.Write($" ({i},{j})");
            }
            Console.WriteLine();              // 안쪽이 끝나면 줄 바꿈
        }

        // 구구단 2~9단: 바깥 = 단, 안쪽 = 곱하는 수
        for (int dan = 2; dan <= 9; dan++)
        {
            Console.Write($"{dan}단:");
            for (int i = 1; i <= 9; i++)
            {
                Console.Write($" {dan}x{i}={dan * i,2}");
            }
            Console.WriteLine();
        }
    }
}`, expect: `i=1: (1,1) (1,2) (1,3)
i=2: (2,1) (2,2) (2,3)
i=3: (3,1) (3,2) (3,3)
2단: 2x1= 2 2x2= 4 2x3= 6 2x4= 8 2x5=10 2x6=12 2x7=14 2x8=16 2x9=18
3단: 3x1= 3 3x2= 6 3x3= 9 3x4=12 3x5=15 3x6=18 3x7=21 3x8=24 3x9=27
4단: 4x1= 4 4x2= 8 4x3=12 4x4=16 4x5=20 4x6=24 4x7=28 4x8=32 4x9=36
5단: 5x1= 5 5x2=10 5x3=15 5x4=20 5x5=25 5x6=30 5x7=35 5x8=40 5x9=45
6단: 6x1= 6 6x2=12 6x3=18 6x4=24 6x5=30 6x6=36 6x7=42 6x8=48 6x9=54
7단: 7x1= 7 7x2=14 7x3=21 7x4=28 7x5=35 7x6=42 7x7=49 7x8=56 7x9=63
8단: 8x1= 8 8x2=16 8x3=24 8x4=32 8x5=40 8x6=48 8x7=56 8x8=64 8x9=72
9단: 9x1= 9 9x2=18 9x3=27 9x4=36 9x5=45 9x6=54 9x7=63 9x8=72 9x9=81`, desc: '안쪽 반복이 <b>한 줄(행)</b>을 만들고, 바깥 반복이 <b>줄을 바꿔 가며</b> 여러 행을 만듭니다. <code>Console.WriteLine()</code> 의 위치가 중요합니다 — 안쪽 반복 <b>바깥</b>, 바깥 반복 <b>안</b>입니다. <code>{dan * i,2}</code> 는 2칸 오른쪽 정렬(1장)로 열을 맞춥니다.' },
          { type: 'callout', kind: 'tip', title: '중첩 반복 변수 이름', html: '관례상 바깥은 <code>i</code>, 안쪽은 <code>j</code>, 그 안은 <code>k</code> 를 씁니다. 하지만 구구단의 <code>dan</code> 처럼 <b>뜻이 있는 이름</b>이 더 읽기 쉽습니다. 안쪽 반복에서 바깥과 같은 이름(<code>int i</code>)을 다시 선언하면 <b>컴파일 오류 CS0136</b> 이 납니다.' },
          { type: 'code', title: '예제 5-8. 별 찍기 — 직각삼각형과 피라미드', code: `using System;

class Program
{
    static void Main()
    {
        int n = 5;
        Console.WriteLine("[직각삼각형]");
        for (int i = 1; i <= n; i++)          // i 번째 줄에
        {
            for (int j = 1; j <= i; j++)      // 별 i 개
                Console.Write("*");
            Console.WriteLine();
        }

        Console.WriteLine("[피라미드]");
        for (int i = 1; i <= 4; i++)
        {
            for (int j = 1; j <= 4 - i; j++)      // 공백 (4 - i) 개
                Console.Write(" ");
            for (int j = 1; j <= 2 * i - 1; j++)  // 별 (2i - 1) 개
                Console.Write("*");
            Console.WriteLine();
        }
    }
}`, expect: `[직각삼각형]
*
**
***
****
*****
[피라미드]
   *
  ***
 *****
*******`, desc: '별 찍기의 핵심은 <b>“i 번째 줄에 무엇이 몇 개인가”</b> 를 식으로 적는 것입니다. 직각삼각형은 별 <code>i</code> 개, 피라미드는 공백 <code>4 - i</code> 개 + 별 <code>2i - 1</code> 개. 표를 그려 줄 번호와 개수를 먼저 정리하면 식이 보입니다. 같은 <code>j</code> 를 두 안쪽 반복에서 각각 선언해도 서로 다른 범위이므로 괜찮습니다.' },
          { type: 'h', text: 'break 와 continue' },
          { type: 'p', html: '반복 중간에 흐름을 바꾸는 두 키워드입니다. <b><code>break</code></b> 는 반복을 <b>즉시 끝내고</b> 반복문 다음 문장으로 나갑니다(비상구). <b><code>continue</code></b> 는 <b>이번 회차의 나머지를 건너뛰고</b> 다음 회차로 넘어갑니다(건너뛰기). 보통 <code>if</code> 와 함께 씁니다.' },
          { type: 'table', head: ['키워드', '하는 일', '비유', '주로 쓰는 곳'], rows: [
            ['<code>break</code>', '반복문을 <b>완전히 종료</b>', '비상구로 나가기', '찾으면 그만(검색), <code>while (true)</code> 의 종료'],
            ['<code>continue</code>', '이번 회차만 건너뛰고 <b>다음 회차로</b>', '이번 것은 패스', '조건에 맞지 않는 값 건너뛰기']
          ] },
          { type: 'code', title: '예제 5-9. break 와 continue', code: `using System;

class Program
{
    static void Main()
    {
        Console.Write("continue(3의 배수 건너뛰기):");
        for (int i = 1; i <= 10; i++)
        {
            if (i % 3 == 0) continue;     // 3, 6, 9 는 아래를 건너뛴다
            Console.Write($" {i}");
        }
        Console.WriteLine();

        Console.Write("break(7 을 만나면 중단):");
        for (int i = 1; i <= 10; i++)
        {
            if (i == 7) break;            // 여기서 반복문을 빠져나간다
            Console.Write($" {i}");
        }
        Console.WriteLine();

        int n = 1;
        while (true)                      // 일부러 무한 루프
        {
            if (n * n > 50) break;        // 종료 조건은 안에서
            n++;
        }
        Console.WriteLine($"제곱이 50을 넘는 가장 작은 수: {n}");
    }
}`, expect: `continue(3의 배수 건너뛰기): 1 2 4 5 7 8 10
break(7 을 만나면 중단): 1 2 3 4 5 6
제곱이 50을 넘는 가장 작은 수: 8`, desc: '<code>continue</code> 는 <code>for</code> 문에서 <b>증감식은 실행</b>하고 다음 회차로 갑니다(그래서 무한 루프가 되지 않음). <code>while (true)</code> + <code>break</code> 는 “일단 계속 돌리고 안에서 끝낸다” 는 흔한 관용구로, 앞 절의 플래그 변수 방식보다 짧습니다.' },
          { type: 'callout', kind: 'warn', title: 'while 안의 continue 는 증감을 건너뛴다', html: '<code>while (i &lt; 10) { if (i % 2 == 0) continue; …; i++; }</code> 처럼 쓰면 <code>continue</code> 가 <b><code>i++</code> 까지 건너뛰어</b> 무한 루프가 됩니다. <code>while</code> 에서 <code>continue</code> 를 쓸 때는 증감을 <code>continue</code> <b>앞</b>에 두거나 <code>for</code> 로 바꾸세요.' },
          { type: 'h', text: '중첩 반복에서 break 의 범위' },
          { type: 'p', html: '<code>break</code> 는 <b>자기가 들어 있는 가장 안쪽 반복문 하나만</b> 끝냅니다. 안쪽 반복에서 <code>break</code> 해도 바깥 반복은 계속 돕니다. 바깥까지 한 번에 끝내려면 <b>플래그 변수</b>를 쓰거나, 반복문을 메서드로 빼서 <code>return</code>(6장) 합니다.' },
          { type: 'code', title: '예제 5-10. 안쪽 break 와 플래그로 바깥까지 종료', code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("[안쪽 break — 바깥은 계속]");
        for (int i = 1; i <= 3; i++)
        {
            for (int j = 1; j <= 3; j++)
            {
                if (j == 2) break;            // 안쪽 for 만 종료
                Console.WriteLine($"i={i}, j={j}");
            }
        }

        Console.WriteLine("[플래그로 바깥까지 종료]");
        bool found = false;
        for (int i = 1; i <= 5 && !found; i++)   // 찾았으면 바깥도 멈춤
        {
            for (int j = 1; j <= 5; j++)
            {
                if (i * j == 6)
                {
                    Console.WriteLine($"찾았다: {i} x {j} = 6");
                    found = true;
                    break;                    // 안쪽 종료
                }
            }
        }
    }
}`, expect: `[안쪽 break — 바깥은 계속]
i=1, j=1
i=2, j=1
i=3, j=1
[플래그로 바깥까지 종료]
찾았다: 2 x 3 = 6`, desc: '첫 부분: <code>j == 2</code> 에서 안쪽만 끝나므로 바깥 <code>i</code> 는 1, 2, 3 을 모두 돌아 세 줄이 나옵니다. 둘째 부분: 곱이 6 인 첫 쌍을 찾자 <code>found = true</code> 로 바깥 조건 <code>!found</code> 가 거짓이 되어 <code>i = 3</code> 이후는 검사하지 않습니다.' },
          { type: 'h', text: 'foreach 미리보기 — 문자열의 글자 순회' },
          { type: 'p', html: '<code>foreach</code> 는 <b>모음(컬렉션)의 요소를 처음부터 끝까지 하나씩</b> 꺼내 줍니다. 인덱스 변수도, 조건도, 증감도 쓰지 않아 실수할 곳이 없습니다. 문자열은 <code>char</code> 의 모음이므로 <code>foreach (char c in 문자열)</code> 로 글자를 하나씩 얻습니다. 배열 · 리스트에서의 활용은 7장에서 자세히 다룹니다.' },
          { type: 'code', title: '예제 5-11. foreach 로 글자 세기', code: `using System;

class Program
{
    static void Main()
    {
        string word = "programming";
        int vowels = 0;

        foreach (char c in word)              // 글자를 하나씩 c 에
        {
            Console.Write($"[{c}]");
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
                vowels++;
        }
        Console.WriteLine();
        Console.WriteLine($"글자 수: {word.Length}, 모음 개수: {vowels}");

        // 위치(인덱스)가 필요하면 for 를 쓴다
        for (int i = 0; i < word.Length; i++)
        {
            if (word[i] == 'm')
                Console.WriteLine($"'m' 은 {i}번째 위치");
        }
    }
}`, expect: `[p][r][o][g][r][a][m][m][i][n][g]
글자 수: 11, 모음 개수: 3
'm' 은 6번째 위치
'm' 은 7번째 위치`, desc: '<code>foreach</code> 의 반복 변수 <code>c</code> 는 <b>읽기 전용</b>입니다(<code>c = \'x\'</code> 대입은 컴파일 오류). “몇 번째인지” 가 필요하면 <code>for</code> 와 인덱스 <code>word[i]</code> 를 씁니다. 인덱스는 <b>0 부터</b> 시작하므로 마지막은 <code>Length - 1</code> 입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 반복문과 함께 쓰는 유용한 도구', html: '<ul><li><code>new string(\'*\', 5)</code> → <code>"*****"</code>: 같은 문자를 n 개 붙인 문자열. 별 찍기를 한 줄로 쓸 수 있습니다.</li><li><code>Math.Sqrt(n)</code>: 제곱근. 소수 판정에서 <code>i * i &lt;= n</code> 대신 <code>i &lt;= Math.Sqrt(n)</code> 으로 쓰기도 합니다.</li><li><code>Enumerable.Range(1, 10)</code>(<code>using System.Linq;</code>): 1~10 을 만들어 <code>foreach</code> 로 돌릴 수 있습니다(11장 LINQ).</li><li><code>goto</code> 로 중첩 반복을 한 번에 빠져나갈 수도 있지만, 흐름이 뒤엉켜 읽기 어려우므로 <b>쓰지 않는 것</b>이 관례입니다.</li></ul>' },
          { type: 'h', text: '반복문으로 푸는 간단한 알고리즘' },
          { type: 'p', html: '반복문 하나로 풀 수 있는 고전 문제 세 가지입니다. 각각 <b>카운트 · 플래그 + break · 누적</b> 패턴의 응용입니다.' },
          { type: 'code', title: '추가 예제. 약수 출력 · 소수 판정 · 숫자 뒤집기', code: `using System;

class Program
{
    static void Main()
    {
        // 1) 약수: 1 ~ n 중 n 을 나누어떨어지게 하는 수
        int n = 36, divCount = 0;
        Console.Write($"{n}의 약수:");
        for (int i = 1; i <= n; i++)
        {
            if (n % i == 0)
            {
                Console.Write($" {i}");
                divCount++;
            }
        }
        Console.WriteLine();
        Console.WriteLine($"약수 개수: {divCount}");

        // 2) 소수 판정: 2 ~ √p 사이에 나누어떨어지는 수가 없으면 소수
        int p = 97;
        bool isPrime = p >= 2;
        for (int i = 2; i * i <= p; i++)
        {
            if (p % i == 0)
            {
                isPrime = false;
                break;                    // 하나라도 찾으면 더 볼 필요 없다
            }
        }
        Console.WriteLine(isPrime ? $"{p}은(는) 소수입니다." : $"{p}은(는) 소수가 아닙니다.");

        // 3) 숫자 뒤집기: 마지막 자릿수를 떼어 앞에 붙이기
        int num = 12345, reversed = 0;
        while (num > 0)
        {
            reversed = reversed * 10 + num % 10;
            num /= 10;
        }
        Console.WriteLine($"12345 를 뒤집으면 {reversed}");
    }
}`, expect: `36의 약수: 1 2 3 4 6 9 12 18 36
약수 개수: 9
97은(는) 소수입니다.
12345 를 뒤집으면 54321`, desc: '소수 판정에서 <code>i * i &lt;= p</code> 까지만 검사해도 충분합니다(약수는 짝을 이루므로 제곱근까지만). 숫자 뒤집기는 실습 5-2(자릿수 합)와 같은 <code>% 10</code> · <code>/ 10</code> 기법에 <code>reversed * 10 +</code> 를 더한 것입니다: 0 → 5 → 54 → 543 → 5432 → 54321.' },
          { type: 'h', text: '메뉴 반복 — while (true) + 종료 입력' },
          { type: 'p', html: '콘솔 프로그램의 기본 뼈대입니다. <b>메뉴를 보여 주고 → 선택을 받고 → 처리하고 → 다시 메뉴</b>, 종료를 고르면 <code>break</code>. 응용 프로젝트(P01 성적 관리)도 이 구조로 만듭니다.' },
          { type: 'code', title: '추가 예제. 메뉴 반복 — 카운터 프로그램', code: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        while (true)
        {
            Console.WriteLine("=== 메뉴 === 1.증가 2.감소 3.보기 0.종료");
            Console.Write("선택: ");
            string choice = Console.ReadLine();

            if (choice == "0") break;                  // 종료
            if (choice == "1") count++;
            else if (choice == "2") count--;
            else if (choice == "3") Console.WriteLine($"현재 값: {count}");
            else Console.WriteLine("잘못된 선택");
        }
        Console.WriteLine("프로그램 종료");
    }
}`, stdin: '1\n1\n3\n5\n0\n', expect: `=== 메뉴 === 1.증가 2.감소 3.보기 0.종료
선택: === 메뉴 === 1.증가 2.감소 3.보기 0.종료
선택: === 메뉴 === 1.증가 2.감소 3.보기 0.종료
선택: 현재 값: 2
=== 메뉴 === 1.증가 2.감소 3.보기 0.종료
선택: 잘못된 선택
=== 메뉴 === 1.증가 2.감소 3.보기 0.종료
선택: 프로그램 종료`, desc: '예시 입력은 <code>1, 1, 3, 5, 0</code> 입니다. 입력값은 출력에 보이지 않으므로 “선택: ” 뒤에 다음 메뉴가 바로 이어집니다. 선택을 <code>string</code> 으로 받으면 글자를 입력해도 예외가 나지 않습니다.' },
          { type: 'callout', kind: 'warn', title: 'switch 안의 break 는 반복문을 끝내지 않는다', html: '메뉴를 <code>switch (choice)</code> 로 쓰면 <code>case "0": break;</code> 의 <code>break</code> 는 <b>switch 를 빠져나갈 뿐</b> <code>while</code> 은 계속 돕니다. 이때는 <code>case "0": return;</code>(Main 종료) 이나 플래그 변수(<code>running = false</code>)를 쓰세요. 입문자가 “왜 종료가 안 되지?” 하고 가장 자주 헤매는 지점입니다.' }
        ],
        practice: [
          {
            title: '실습 5-3. 별 찍기 — 역삼각형',
            level: 1,
            desc: '<p>중첩 반복으로 아래와 같은 <b>역삼각형</b>을 출력하세요. 첫 줄에 별 5개, 한 줄마다 하나씩 줄어듭니다.</p><pre>*****\n****\n***\n**\n*</pre>',
            hint: '<code>i</code> 번째 줄의 별 개수는 <code>n - i + 1</code> 개. 또는 바깥 반복을 <code>for (int i = n; i &gt;= 1; i--)</code> 로 거꾸로 돌리세요.',
            starter: `using System;

class Program
{
    static void Main()
    {
        int n = 5;
        for (int i = n; i >= 1; i--)      // 바깥: 줄 (별 i 개)
        {
            // TODO: 안쪽 for 로 별 i 개 출력 후 줄 바꿈
        }
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        int n = 5;
        for (int i = n; i >= 1; i--)          // 줄마다 별 i 개
        {
            for (int j = 1; j <= i; j++)
                Console.Write("*");
            Console.WriteLine();
        }
    }
}
`,
            expect: `*****
****
***
**
*`
          },
          {
            title: '실습 5-4. 3 의 배수이면서 5 의 배수가 아닌 수',
            level: 2,
            desc: '<p>1 부터 100 까지 중 <b>3 의 배수이면서 5 의 배수가 아닌 수</b>를 한 줄에 공백으로 구분해 출력하고, 마지막에 개수를 출력하세요. <code>continue</code> 를 사용해 보세요.</p><pre>결과: 3 6 9 12 18 21 24 27 33 36 39 42 48 51 54 57 63 66 69 72 78 81 84 87 93 96 99\n개수: 27</pre>',
            hint: '<code>if (i % 3 != 0 || i % 5 == 0) continue;</code> 뒤에 출력과 <code>count++</code>. 각 수 앞에 공백을 붙여 <code>Console.Write($" {i}")</code> 로 출력하면 줄 끝에 공백이 남지 않습니다.',
            starter: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        Console.Write("결과:");
        for (int i = 1; i <= 100; i++)
        {
            // TODO: 조건에 맞지 않으면 continue, 맞으면 출력하고 count++
        }
        Console.WriteLine();
        Console.WriteLine($"개수: {count}");
    }
}
`,
            solution: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        Console.Write("결과:");
        for (int i = 1; i <= 100; i++)
        {
            if (i % 3 != 0 || i % 5 == 0) continue;   // 3의 배수가 아니거나 5의 배수면 건너뜀
            Console.Write($" {i}");
            count++;
        }
        Console.WriteLine();
        Console.WriteLine($"개수: {count}");
    }
}
`,
            expect: `결과: 3 6 9 12 18 21 24 27 33 36 39 42 48 51 54 57 63 66 69 72 78 81 84 87 93 96 99
개수: 27`
          }
        ],
        quiz: [
          { q: '다음 중첩 반복에서 <code>Console.Write("*")</code> 는 몇 번 실행되나?<pre><code>for (int i = 0; i &lt; 3; i++)\n    for (int j = 0; j &lt; 4; j++)\n        Console.Write("*");</code></pre>', options: ['7', '12', '3', '4'], answer: 1, explain: '바깥 3번 × 안쪽 4번 = 12번. 중첩 반복의 본문 실행 횟수는 곱셈입니다.' },
          { q: '다음 코드의 출력은?<pre><code>for (int i = 1; i &lt;= 5; i++)\n{\n    if (i == 3) continue;\n    Console.Write(i);\n}</code></pre>', options: ['12', '12345', '1245', '45'], answer: 2, explain: '<code>continue</code> 는 그 회차만 건너뜁니다. 3 만 빠지고 나머지는 출력됩니다. <code>break</code> 였다면 12.' },
          { q: '중첩 반복의 <b>안쪽</b> 반복문에서 <code>break</code> 를 실행하면?', options: ['안쪽 반복만 종료되고 바깥 반복은 계속된다', '바깥 반복까지 모두 종료된다', '프로그램이 종료된다', '이번 회차만 건너뛴다'], answer: 0, explain: '<code>break</code> 는 자기가 들어 있는 가장 안쪽 반복문 하나만 끝냅니다. 바깥까지 끝내려면 플래그나 return.' },
          { q: '<code>foreach (char c in "abc") { c = \'x\'; }</code> 를 컴파일하면?', options: ['정상 동작, 글자가 모두 x 로 바뀐다', '실행 중 예외가 발생한다', '경고만 나오고 실행된다', '컴파일 오류 — foreach 변수는 읽기 전용'], answer: 3, explain: 'foreach 의 반복 변수에는 값을 대입할 수 없습니다(CS1656). 요소를 바꾸려면 for 와 인덱스를 씁니다(문자열은 아예 불변).' },
          { q: '다음 코드의 출력은?<pre><code>int n = 120, r = 0;\nwhile (n &gt; 0)\n{\n    r = r * 10 + n % 10;\n    n /= 10;\n}\nConsole.WriteLine(r);</code></pre>', options: ['021', '21', '12', '120'], answer: 1, explain: 'r: 0 → 0×10+0 = 0 → 0×10+2 = 2 → 2×10+1 = 21. 앞의 0 은 숫자에서 사라집니다.' }
        ],
        slides: [
          { layout: 'title', title: '중첩 반복 · break/continue · foreach', subtitle: 'Chapter 05 · Section 02', badge: '05-2',
            notes: '<p><b>[도입 3분]</b> 복습 발문: “for 의 세 부분은?” “do-while 이 while 과 다른 점은?” 오늘은 반복 안의 반복(구구단 전체 · 별 찍기), 반복을 끊고 건너뛰는 break · continue, 그리고 foreach.</p>' },
          { layout: 'diagram', title: '중첩 반복 — 시침과 분침', html: SVG_NESTED, caption: '바깥 i 한 칸마다 안쪽 j 는 한 바퀴 → 본문 = 바깥 × 안쪽 번',
            notes: '<p><b>[6분]</b> 시계 비유: 시침(바깥)이 한 칸 갈 때 분침(안쪽)은 한 바퀴. 발문: “i=2 일 때 j 는 어디서 시작?” → 다시 1 부터. “본문은 총 몇 번?” → 9번. 구구단은 8 × 9 = 72 줄.</p>' },
          { layout: 'code', title: '예제 5-7. 구구단 전체 (2~9단)', code: `using System;

class Program
{
    static void Main()
    {
        for (int dan = 2; dan <= 9; dan++)       // 바깥: 단
        {
            Console.Write($"{dan}단:");
            for (int i = 1; i <= 9; i++)         // 안쪽: 곱하는 수
            {
                Console.Write($" {dan}x{i}={dan * i,2}");
            }
            Console.WriteLine();                 // 한 단이 끝나면 줄 바꿈
        }
    }
}`, points: ['바깥 = 단(행), 안쪽 = 곱하는 수(열)', '<code>WriteLine()</code> 위치: 안쪽 <b>바깥</b>, 바깥 <b>안</b>', '<code>{값,2}</code> 로 열 맞춤', '반복 변수 이름은 뜻이 보이게'],
            notes: '<p><b>[6분]</b> 실행 후 <code>WriteLine()</code> 을 안쪽 반복 안으로 옮겨 실행해 차이를 보여 줍니다(72 줄). 발문: “단을 세로로, 곱하는 수를 가로로 바꾸려면?” → 두 반복의 역할을 바꾼다.</p>' },
          { layout: 'code', title: '예제 5-8. 별 찍기', code: `using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 5; i++)          // i 번째 줄
        {
            for (int j = 1; j <= i; j++)      // 별 i 개
                Console.Write("*");
            Console.WriteLine();
        }
        for (int i = 1; i <= 4; i++)          // 피라미드
        {
            for (int j = 1; j <= 4 - i; j++)      Console.Write(" ");
            for (int j = 1; j <= 2 * i - 1; j++)  Console.Write("*");
            Console.WriteLine();
        }
    }
}`, points: ['“i 번째 줄에 몇 개?” 를 식으로', '직각삼각형: 별 <code>i</code> 개', '피라미드: 공백 <code>4 - i</code> + 별 <code>2i - 1</code>', '표를 먼저 그리면 식이 보인다'],
            notes: '<p><b>[6분]</b> 칠판에 표: 줄 1 2 3 4 / 공백 3 2 1 0 / 별 1 3 5 7 → 식을 학생이 찾게 합니다. 역삼각형(실습 5-3)을 예고.</p>' },
          { layout: 'two', title: 'break 와 continue', left: { title: 'break — 비상구', code: `for (int i = 1; i <= 10; i++)
{
    if (i == 7) break;   // 반복 종료
    Console.Write($" {i}");
}
// 출력: 1 2 3 4 5 6`, run: false }, right: { title: 'continue — 이번 것은 패스', code: `for (int i = 1; i <= 10; i++)
{
    if (i % 3 == 0) continue;  // 다음 회차로
    Console.Write($" {i}");
}
// 출력: 1 2 4 5 7 8 10`, run: false },
            notes: '<p><b>[5분]</b> break 는 “그만”, continue 는 “다음!”. 발문: “continue 뒤에 for 의 증감식은 실행될까?” → 예(그래서 무한 루프 안 됨). “while 에서 continue 가 i++ 를 건너뛰면?” → 무한 루프 주의.</p>' },
          { layout: 'code', title: '예제 5-10. 중첩 반복에서 break 의 범위', code: `using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 3; i++)
        {
            for (int j = 1; j <= 3; j++)
            {
                if (j == 2) break;        // 안쪽만 종료
                Console.WriteLine($"i={i}, j={j}");
            }
        }
        bool found = false;
        for (int i = 1; i <= 5 && !found; i++)
            for (int j = 1; j <= 5; j++)
                if (i * j == 6)
                {
                    Console.WriteLine($"찾았다: {i} x {j}");
                    found = true;
                    break;
                }
    }
}`, points: ['<code>break</code> 는 <b>가장 안쪽 하나</b>만 끝낸다', '바깥까지 끝내려면 플래그 변수', '바깥 조건에 <code>&amp;&amp; !found</code>', '또는 메서드로 빼서 <code>return</code> (6장)'],
            notes: '<p><b>[5분]</b> 첫 반복의 출력을 예측하게 한 뒤 실행(세 줄). 둘째는 “찾으면 그만” 패턴. goto 는 있지만 쓰지 않는 관례라고만 언급.</p>' },
          { layout: 'code', title: '예제 5-11. foreach — 글자 하나씩', code: `using System;

class Program
{
    static void Main()
    {
        string word = "programming";
        int vowels = 0;
        foreach (char c in word)          // 인덱스 없이 하나씩
        {
            Console.Write($"[{c}]");
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
                vowels++;
        }
        Console.WriteLine();
        Console.WriteLine($"모음 {vowels}개");

        for (int i = 0; i < word.Length; i++)   // 위치가 필요하면 for
            if (word[i] == 'm')
                Console.WriteLine($"'m' 위치: {i}");
    }
}`, points: ['<code>foreach (char c in 문자열)</code>', '조건 · 증감 · 인덱스가 없어 실수가 없다', '반복 변수 <code>c</code> 는 읽기 전용', '“몇 번째” 가 필요하면 <code>for</code> + <code>[i]</code>'],
            notes: '<p><b>[5분]</b> for 버전과 나란히 비교. 발문: “c = \'x\' 라고 대입하면?” → 컴파일 오류. 배열 · List 의 foreach 는 7장에서.</p>' },
          { layout: 'code', title: '알고리즘 맛보기 — 약수 · 소수 · 뒤집기', code: `using System;

class Program
{
    static void Main()
    {
        int n = 36;
        Console.Write($"{n}의 약수:");
        for (int i = 1; i <= n; i++)
            if (n % i == 0) Console.Write($" {i}");
        Console.WriteLine();

        int p = 97; bool isPrime = p >= 2;
        for (int i = 2; i * i <= p; i++)
            if (p % i == 0) { isPrime = false; break; }
        Console.WriteLine($"{p} 소수? {isPrime}");

        int num = 12345, rev = 0;
        while (num > 0)
        {
            rev = rev * 10 + num % 10;
            num /= 10;
        }
        Console.WriteLine($"뒤집기: {rev}");
    }
}`, points: ['약수: 카운트 패턴 (<code>% i == 0</code>)', '소수: 플래그 + <code>break</code>, √p 까지만', '뒤집기: <code>rev * 10 + 마지막 자릿수</code>', '모두 앞 절의 패턴 응용'],
            notes: '<p><b>[6분]</b> 뒤집기 추적표: rev 0 → 5 → 54 → 543 → 5432 → 54321. 발문: “120 을 뒤집으면?” → 21 (앞의 0 이 사라짐, 퀴즈로 연결). 소수 판정에서 왜 √p 까지만 보면 되는지 36 = 6 × 6 으로 설명.</p>' },
          { layout: 'code', title: '메뉴 반복 — while (true) + 종료', code: `using System;

class Program
{
    static void Main()
    {
        int count = 0;
        while (true)
        {
            Console.WriteLine("1.증가 2.감소 3.보기 0.종료");
            Console.Write("선택: ");
            string choice = Console.ReadLine();
            if (choice == "0") break;
            if (choice == "1") count++;
            else if (choice == "2") count--;
            else if (choice == "3") Console.WriteLine($"현재 값: {count}");
            else Console.WriteLine("잘못된 선택");
        }
        Console.WriteLine("종료");
    }
}`, stdin: '1\n1\n3\n0\n', points: ['메뉴 → 입력 → 처리 → 다시 메뉴', '종료는 <code>break</code>', '선택은 <code>string</code> 으로 받으면 안전', '<b>switch 의 break 는 반복을 못 끝낸다</b>'],
            notes: '<p><b>[5분]</b> 콘솔 프로그램의 기본 뼈대. 프로젝트 P01 이 이 구조. switch 로 바꿔 쓰면 case 의 break 가 while 을 끝내지 못한다는 함정을 꼭 짚습니다(return 또는 플래그).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다음 코드의 출력은?<pre><code>for (int i = 1; i &lt;= 5; i++)\n{\n    if (i == 3) continue;\n    Console.Write(i);\n}</code></pre>', options: ['12', '12345', '1245', '45'], answer: 2, explain: 'continue 는 3 인 회차만 건너뜁니다. break 였다면 12.',
            notes: '<p>정답 공개 후 “continue 를 break 로 바꾸면?” “i == 3 대신 i % 2 == 0 이면?” 으로 확장.</p>' },
          { layout: 'practice', title: '실습 5-3. 별 찍기 — 역삼각형', desc: '<p>중첩 반복으로 첫 줄 별 5개부터 한 줄에 하나씩 줄어드는 역삼각형을 출력하세요.</p><pre>*****\n****\n***\n**\n*</pre>', starter: `using System;

class Program
{
    static void Main()
    {
        int n = 5;
        // TODO: 바깥 for (줄) + 안쪽 for (별)
    }
}`, solution: `using System;

class Program
{
    static void Main()
    {
        int n = 5;
        for (int i = n; i >= 1; i--)
        {
            for (int j = 1; j <= i; j++)
                Console.Write("*");
            Console.WriteLine();
        }
    }
}`,
            notes: '<p><b>[8분]</b> 두 가지 풀이: 바깥을 거꾸로(<code>i = n; i &gt;= 1; i--</code>) 또는 별 개수를 <code>n - i + 1</code>. 빨리 끝난 학생은 실습 5-4(3 의 배수이면서 5 의 배수가 아닌 수) 또는 역피라미드.</p>' },
          { layout: 'summary', title: '정리', bullets: ['중첩 반복: 바깥 한 번에 안쪽 한 바퀴 → 본문 = 바깥 × 안쪽', '구구단 · 별 찍기: “i 번째 줄에 몇 개” 를 식으로', '<code>break</code> 반복 종료 · <code>continue</code> 이번 회차 건너뛰기', '안쪽 <code>break</code> 는 안쪽만 — 바깥까지는 플래그 / return', '<code>foreach (char c in s)</code> 로 요소를 하나씩 (읽기 전용)', '<code>while (true)</code> + 종료 입력 = 메뉴 프로그램의 뼈대'],
            notes: '<p>학습 목표 확인. 다음 장: 메서드 — 반복되는 코드를 이름 붙여 재사용하기. 오늘 만든 별 찍기 · 소수 판정을 메서드로 바꿔 볼 것이라고 예고.</p>' }
        ]
      }
    ]
  });
})();
