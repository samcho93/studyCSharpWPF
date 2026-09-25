# 강좌 콘텐츠 작성 가이드 (C# · WPF)

각 챕터/프로젝트는 `lessons/<id>.js` 파일 하나로 작성합니다. (id: `ch01` … `ch22`, 프로젝트 `p01` … `p10`)
파일은 **평범한 브라우저 스크립트**이며 `CS_COURSE.addChapter({...})` 를 한 번 호출합니다.
(모듈 문법 `import/export` 금지, 전역 변수 추가 금지 — 파일 전체를 `(function () { ... })();` 로 감쌉니다)

같은 데이터로 두 화면이 만들어집니다.

- **학생용**: 섹션(교시) 단위 문서 — 학습 목표 → 본문(`content`) → 실습 과제(`practice`) → 퀴즈(`quiz`)
- **교사용**: 섹션별 PPT 형태 슬라이드(`slides`) + 교사 노트(`notes`) + 수업 흐름(`flow`) + 정답

## 1. 챕터 구조

```js
CS_COURSE.addChapter({
  id: 'ch06',
  no: '06',
  title: '메서드',
  subtitle: 'Methods',
  summary: '반복되는 코드를 이름 붙인 코드 묶음(메서드)으로 만들고, 매개변수와 반환값으로 데이터를 주고받는 방법을 배웁니다.',
  goals: ['메서드의 구조(반환형·이름·매개변수·본문)를 설명할 수 있다', '...'],
  sections: [ /* 섹션(교시) 목록 */ ]
});
```

**프로젝트(p01~p10)** 는 챕터와 같은 구조에 다음 필드를 더합니다.

```js
  requires: ['ch07', 'ch08'],                       // 선수 챕터 id
  preview: '=== 성적 처리 프로그램 ===\n1. 학생 추가\n...'   // 완성 화면 예시(텍스트) 또는 'assets/shots/p04-final.png' (캡처)
```

## 2. 섹션(교시) 구조

```js
{
  id: 'ch06-1',                       // 챕터id-번호 (전체에서 유일)
  title: '메서드의 정의와 호출',
  minutes: 50,
  goals: ['메서드가 필요한 이유를 설명할 수 있다', '...'],
  flow: [['도입', 5], ['개념 설명', 15], ['예제 실습', 20], ['정리 · 퀴즈', 10]],   // 교사용 수업 흐름 [이름, 분]
  content: [ /* 본문 블록 */ ],
  practice: [ /* 실습 과제 */ ],
  quiz: [ /* 퀴즈 */ ],
  slides: [ /* 교사용 슬라이드 */ ]
}
```

## 3. 본문 블록 (`content`)

모든 `html` 필드는 HTML 문자열입니다. 인라인 코드는 `<code>…</code>`, 강조는 `<b>`, `<mark>` 사용.
**HTML 안에서 `<`, `>`, `&` 는 반드시 `&lt;` `&gt;` `&amp;` 로 씁니다.** (예: `<code>List&lt;int&gt;</code>`, `<code>&lt;Button&gt;</code>`)
`code` 필드(C#/XAML 소스)는 HTML 이 아니므로 그대로 씁니다.
템플릿 문자열(백틱)을 쓸 때는 코드 안의 `${` 와 백틱에 주의하세요 (`\${`, `` \` `` 로 이스케이프). C# 보간 문자열 `$"{x}"` 는 백틱 안에서 `\${x}` 로 씁니다. 코드 안의 `\n` 문자열은 `\\n` 으로 써야 합니다.

| type | 필드 | 설명 |
|---|---|---|
| `h` | `text` | 소제목 |
| `p` | `html` | 문단 |
| `list` | `items: [html]`, `ordered?` | 목록 |
| `table` | `head: [..]`, `rows: [[..]]`, `caption?` | 표 (셀은 html) |
| `code` | `title`, `code`, `stdin?`, `expect?`, `desc?`, `run?`, `expectError?`, `nondeterministic?`, `shot?`, `shotCaption?` | C#/WPF 코드 (기본: 실행 가능). `shot` = Visual Studio 실행 화면 캡처 경로 |
| `callout` | `kind: 'tip'\|'warn'\|'info'\|'more'\|'vs'`, `title?`, `html` | 강조 상자. `more` = 📘 더 알아보기, **`vs` = 🖥️ Visual Studio 에서 하는 방법** |
| `figure` | `html`, `caption?` | 그림 (인라인 SVG 또는 HTML, CSS 변수 사용 가능) |
| `shot` | `src`, `caption?` | 실행 화면 캡처 단독 표시 (`assets/shots/…png`) |

### `code` 블록 규칙 (중요)

- **완전한 프로그램**이어야 합니다. C# 기초 파트는 `using System;` + `class Program { static void Main() { … } }` 형태를 기본으로 하고,
  최상위 문(top-level statements)은 ch01 에서 소개한 뒤 보조로만 씁니다.
- `title`: `'예제 6-1. 메서드 정의하고 호출하기'` 처럼 챕터-번호를 붙입니다. 보충 예제는 `'추가 예제. …'`.
- `desc`: 코드 아래 짧은 해설(html). 줄 번호로 설명할 때는 `<code>3행</code>` 형식.
- `stdin`: `Console.ReadLine()` 으로 입력을 받는 예제는 검증용 입력을 넣습니다. 예: `stdin: '10\n20\n'` (한 줄에 하나)
- `expect`: **실제 실행 결과**(표준 출력 + 표준 오류)를 그대로 넣습니다. 검증 도구가 비교합니다.
  - `Console.ReadLine()` 입력값은 출력에 들어가지 않습니다 (`Console.Write("이름: ");` 뒤에 바로 다음 출력이 붙음).
  - 시간 · 난수(`Random` 시드 없음) · 해시코드 등 실행마다 달라지는 결과는 `nondeterministic: true` 로 하고 `expect` 를 생략합니다.
    난수는 가능하면 `new Random(42)` 처럼 **고정 시드**를 써서 결과를 고정하세요.
- 예외를 일부러 처리하지 않는 예제는 `expectError: true` (종료 코드 ≠ 0 허용).
- 문법 조각(실행 불가)은 `run: false` — 꼭 필요한 경우에만.
- **일부러 컴파일 오류를 내는 예제**(오류 메시지 읽기 연습)는 `expectCompileError: true` (검증기가 컴파일 실패를 정상으로 봄). 실습 시작 코드에 일부러 오류를 넣었으면 practice 에 `starterHasErrors: true`.
- **WPF 예제**는 한 코드 안에서 파일 구분 주석으로 XAML 과 코드 비하인드를 나눕니다 (Visual Studio 프로젝트와 같은 구조):

```
// ===== File: MainWindow.xaml =====
<Window x:Class="MyApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="첫 창" Width="300" Height="200">
    <Button x:Name="btnHello" Content="눌러 보세요" Click="btnHello_Click" Margin="20"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace MyApp
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void btnHello_Click(object sender, RoutedEventArgs e) { MessageBox.Show("안녕하세요!"); }
    }
}
```

  - `App.xaml` 이 없으면 첫 번째 `Window` 가 자동으로 열립니다. `App.xaml`(`StartupUri`) 을 포함하면 그대로 동작합니다.
  - WPF 예제는 `expect` 대신 **`shot`(Visual Studio 실행 화면 캡처)** 를 넣습니다. 캡처는 `assets/shots/<챕터>-<이름>.png`.
  - 브라우저 WPF 는 실제 WPF 의 부분집합입니다. 지원: Window · Grid/StackPanel/DockPanel/WrapPanel/Canvas/UniformGrid · Border · ScrollViewer ·
    TextBlock/Label/TextBox/PasswordBox/Button/CheckBox/RadioButton/ComboBox/ListBox/ListView(GridView)/DataGrid(기본)/Slider/ProgressBar/Image/
    Menu/MenuItem/ContextMenu/TabControl/GroupBox/Expander/TreeView/DatePicker/StatusBar/ToolBar · Shapes · Style/Setter/Trigger(IsMouseOver) ·
    Resources/StaticResource · DataTemplate · Binding(Path/Mode/ElementName/StringFormat/Converter) · ICommand · DispatcherTimer · DoubleAnimation(기본) ·
    MessageBox · OpenFileDialog/SaveFileDialog. **미지원**: ControlTemplate, VisualStateManager, 3D, MediaElement, Popup, 복잡한 애니메이션.
- 파일 입출력 예제: 브라우저 메모리 안의 작업 폴더(`/work`)에 파일을 만듭니다. **각 예제는 스스로 완결**되어야 합니다 (읽기 예제라면 먼저 파일을 만든 뒤 읽기). 절대 경로(C:\\…) 금지.
- 네트워크 · 스레드 무한 대기 · `Environment.Exit` 금지. 실행 시간은 수 초 이내. `Thread.Sleep` 은 1초 이내로.

### 실행 환경 (브라우저 · 검증 도구 공통)

- .NET 9 (mono WebAssembly) + Roslyn (C# 13), `System.*` 기본 라이브러리 + `WpfShim`(WPF 호환 라이브러리)
- `Console` 은 웹 콘솔용 대체 클래스로 바뀌어 실행됩니다 (`ReadKey` 는 한 줄을 입력받아 첫 글자를 돌려줌, 색상 지원, `Clear` 지원)
- 처리하지 않은 예외: `처리되지 않은 예외(Unhandled exception). System.XxxException: 메시지` + 스택 추적 출력 후 종료 코드 134
- 정수 0 나누기는 `DivideByZeroException` → `expectError: true`
- `Console.WriteLine(3.5)` 등 숫자 서식은 ko-KR 문화권 (소수점 `.`, 천 단위 `,`)

## 4. 실습 과제 (`practice`)

```js
{
  title: '실습 6-1. 최댓값 메서드 만들기',
  level: 1,                         // 1 기초, 2 응용, 3 도전
  desc: '<p>두 정수를 받아 큰 값을 반환하는 <code>Max2</code> 메서드를 …</p>',
  hint: '<code>if</code> 문 또는 삼항 연산자를 사용합니다.',
  starter: 'using System;\n\nclass Program\n{\n    // TODO: Max2 메서드 작성\n\n    static void Main()\n    {\n    }\n}\n',
  solution: '… 완전한 정답 코드 …',
  stdin: '3\n7\n',                  // 선택
  expect: '...',                    // 정답 코드의 실행 결과 (nondeterministic 이면 생략)
  shot: 'assets/shots/ch16-practice-1.png'   // WPF 실습이면 완성 화면 캡처
}
```

- `starter` 는 **컴파일이 되는** 뼈대 코드로 작성합니다 (TODO 주석).
- `solution` 은 교사용 화면에서만 보입니다. 반드시 실행 가능해야 합니다.
- 섹션마다 1~3개.

## 5. 퀴즈 (`quiz`)

```js
{ q: '메서드가 값을 돌려줄 때 사용하는 키워드는?', options: ['break', 'return', 'void', 'continue'], answer: 1,
  explain: '<code>return</code> 은 값을 반환하고 메서드를 끝냅니다.' }
```

- 섹션마다 3~5문항, 4지선다(`answer` 는 0부터 시작하는 인덱스). 코드 결과 예측형 문제 권장
  (`q` 안에 `<pre><code>…</code></pre>` 사용 가능 — 이때도 `<` `>` 는 `&lt;` `&gt;`).
- 정답 위치가 한쪽으로 몰리지 않게 섞습니다.

## 6. 교사용 슬라이드 (`slides`)

16:9 PPT 한 장 = 객체 하나. **한 장에 너무 많이 넣지 마세요** (불릿 3~6개, 한 줄 40자 안팎, 코드 18줄 이내 · 최대 30줄).
모든 슬라이드에 `notes`(교사 노트: 말할 내용, 학생에게 던질 발문, 주의점, 시간)를 html 로 작성합니다.

| layout | 필드 |
|---|---|
| `title` | `title`, `subtitle?`, `badge?` — 섹션 첫 장 |
| `bullets` | `title`, `bullets: [html \| [html, [하위 html…]]]`, `lead?` (상단 한 줄 요약) |
| `code` | `title`, `code`, `stdin?`, `points?: [html]` (코드 옆 설명 2~4개), `shot?` (코드 옆 실행 화면 캡처), `run?` — 교사 화면에서 편집·실행 가능 |
| `two` | `title`, `left: {title, bullets? \| html? \| code?}`, `right: {…}` — 비교 |
| `table` | `title`, `head`, `rows`, `lead?` |
| `diagram` | `title`, `html` (인라인 SVG/HTML), `caption?` |
| `shot` | `title`, `src`, `caption?` — 실행 화면 캡처 한 장 |
| `quiz` | `title`, `q`, `options`, `answer`, `explain` — 클릭하면 정답 공개 |
| `practice` | `title`, `desc`, `starter`, `solution`, `stdin?` — 교사가 정답 실행 가능 |
| `summary` | `title`, `bullets` — 섹션 마지막 장 |

섹션 한 개당 슬라이드 8~14장 권장: `title` → 개념(bullets/diagram/table) → 예제(code) … → quiz → practice → summary.
`code` 슬라이드의 코드는 본문 예제와 같거나 더 짧게 줄인 버전이며, 역시 **실행 가능한 완전한 프로그램**이어야 합니다. `two` 의 `code` 가 조각이면 `run: false`.

### 다이어그램(figure / diagram) 스타일

- 인라인 `<svg viewBox="0 0 1280 560" width="100%">` 권장. 색은 CSS 변수를 사용: `var(--fg)`, `var(--muted)`, `var(--accent)`,
  `var(--accent2)`, `var(--ok)`, `var(--warn)`, `var(--danger)`, `var(--card)`, `var(--line)`.
- 글꼴 크기는 viewBox 1280 기준 20~28 로 크게. `<marker id>` 등 SVG id 는 챕터마다 고유하게(`ah6a` 처럼 챕터 번호 포함).
- **SVG 안에서는 HTML 태그(`<b>`, `<code>`, `<br>`, `<span>` 등)를 쓰지 마세요.** 굵게는 `<tspan font-weight="700">`, 고정폭은 `<tspan style="font-family:Consolas,monospace">`.
- 화살표 머리(`<marker>`)는 `markerUnits="userSpaceOnUse"` 와 `viewBox` 를 지정해 선 굵기와 무관한 작은 크기(약 12~14)로 만듭니다.

## 7. 내용 작성 원칙

1. C# 기초 파트는 Visual Studio 콘솔 앱 기준으로, WPF 파트는 Visual Studio 의 **WPF 애플리케이션(.NET)** 프로젝트 기준으로 설명합니다.
   Visual Studio 에서 하는 조작(새 프로젝트, 디자이너, 속성 창, 이벤트 연결)은 `callout kind:'vs'` 로 적습니다.
2. 개념 → 예제 → 실행 화면(캡처) → 실습 순서. WPF 예제마다 Visual Studio 실행 캡처(`shot`)를 넣습니다.
3. 초보자 눈높이: 짧은 문장, 비유, 단계별 설명. 용어는 처음 나올 때 영어 병기.
4. 모든 예제는 검증 도구로 실행해 확인합니다.

## 8. 검증

```bash
node tools/validate.mjs ch06                 # 스키마 + 모든 코드 컴파일/실행 + expect 비교
node tools/validate.mjs ch06 --print         # 실제 출력 보기 (expect 작성용)
node tools/validate.mjs ch06 --only "예제 6-3" # 일부만
node tools/validate.mjs all
```

검증 도구는 브라우저와 같은 컴파일 로직(Roslyn + WpfShim)을 데스크톱 .NET 9 에서 실행합니다 (`tools/validator`, .NET 9 SDK 필요).
WPF 예제는 창을 띄우는 데까지(XAML 해석 · 이벤트 연결 · 초기 코드) 검증하고, 출력 비교 대신 창 개수를 확인합니다.
