# 🪟 C# · WPF 프로그래밍 웹 실습 강좌

**설치할 것 없이 브라우저에서 C# 코드를 컴파일 · 실행**하고, **WPF 윈도우 프로그램까지 창을 띄워 조작**해 보며 배우는 웹 강좌입니다.
C# 언어의 기초(Part 1)부터 WPF 로 윈도우 프로그램을 만드는 방법(Part 2), 배운 것을 모아 만드는 응용 프로젝트(Part 3)까지 다룹니다.
같은 콘텐츠를 **학생용(문서 + 실습)** 과 **교사용(PPT 슬라이드 + 판서 + 교사 노트)** 두 화면으로 제공합니다.

| Part 1 · C# 기초 | 내용 | Part 2 · WPF | 내용 |
|---|---|---|---|
| 01 | C# 과 .NET, 첫 프로그램 | 13 | WPF 소개와 첫 윈도우 |
| 02 | 변수와 자료형 | 14 | XAML 기초 |
| 03 | 연산자와 식 | 15 | 레이아웃 패널 |
| 04 | 조건문 | 16 | 기본 컨트롤 |
| 05 | 반복문 | 17 | 이벤트 처리 |
| 06 | 메서드 | 18 | 데이터 바인딩 |
| 07 | 배열과 컬렉션 | 19 | 스타일 · 리소스 · 템플릿 |
| 08 | 클래스와 객체 | 20 | MVVM 패턴 |
| 09 | 상속 · 다형성 · 인터페이스 | 21 | 메뉴 · 대화상자 · 다중 창 |
| 10 | 문자열 · 예외 처리 · 파일 | 22 | 그래픽 · 애니메이션 · 타이머 |
| 11 | 델리게이트 · 이벤트 · 람다 · LINQ | | |
| 12 | 제네릭 · 구조체 · 열거형 · 비동기 | | |

| 프로젝트 | 내용 | 주요 문법 |
|---|---|---|
| P01 | 콘솔 성적 관리 프로그램 | 배열 · 메서드 · 반복문 |
| P02 | 은행 계좌 관리 (클래스) | 클래스 · 속성 · 캡슐화 · List |
| P03 | 콘솔 텍스트 게임 | 상속 · 다형성 · 난수 · 예외 |
| P04 | WPF 계산기 | Grid · Button · 이벤트 |
| P05 | WPF 할 일 관리 (MVVM) | 바인딩 · ObservableCollection · ICommand |
| P06 | WPF 주소록 (파일 저장) | ListView · 파일 입출력 · 대화상자 |
| P07 | WPF 그림판 | Canvas · 마우스 이벤트 · Shape |
| P08 | WPF 스톱워치 · 타이머 | DispatcherTimer · 스타일 |
| P09 | WPF 메모장 | 메뉴 · 파일 대화상자 · TextBox |
| P10 | WPF 벽돌 깨기 게임 | Canvas · 타이머 · 충돌 판정 |

## C# 코드는 어떻게 실행되나요?

**설치할 것이 없습니다.** [.NET 런타임](https://dotnet.microsoft.com)을 WebAssembly 로 빌드한 것과 C# 컴파일러 [Roslyn](https://github.com/dotnet/roslyn) 이
브라우저 안에서 코드를 컴파일하고 실행합니다. 서버가 필요 없어 **GitHub Pages 에서 그대로 동작**합니다.

| 항목 | 지원 |
|---|---|
| 컴파일러 · 런타임 | Roslyn (C# 13) · .NET 9 (mono WebAssembly) |
| 첫 준비 | 실행 환경 약 15MB 내려받기 (20초 ~ 1분, 이후 브라우저 캐시) |
| 컴파일 | 프로그램 하나 약 0.2~2초 |
| `Console.ReadLine()` 입력 | ✔ 실행 중 콘솔 입력칸 (교차 출처 격리 필요 — `coi-sw.js` 서비스 워커가 자동으로 켬) |
| 콘솔 색 · `Clear` · `ReadKey` | ✔ (ReadKey 는 한 줄을 입력받아 첫 글자를 사용) |
| 파일 입출력 `File`, `StreamWriter` | ✔ 브라우저 메모리 안의 작업 폴더 (📁 작업 폴더에서 확인, 새로고침하면 비워짐) |
| 예외 처리 · LINQ · async/await | ✔ |
| 무한 반복 | ✔ ■ 중지 버튼으로 즉시 중지 |
| 여러 파일 | ✔ `// ===== File: MainWindow.xaml =====` 파일 구분 주석으로 XAML · 클래스 파일 나누기 |

### WPF 는 브라우저에서 어떻게 보이나요?

이 강좌에는 **WPF 호환 라이브러리(WpfShim)** 가 들어 있습니다. `System.Windows.*` 의 창 · 레이아웃 · 컨트롤을 다시 구현해,
**Visual Studio 에서 쓰는 것과 똑같은 XAML 과 코드 비하인드**를 브라우저 화면(DOM)에 그립니다. 오른쪽 패널에 창이 열리고 버튼 클릭 · 입력 · 메뉴 · 대화상자가 실제로 동작합니다.

- 지원: Window · Grid/StackPanel/DockPanel/WrapPanel/Canvas/UniformGrid · Border · ScrollViewer · TextBlock/Label/TextBox/PasswordBox/Button/CheckBox/RadioButton/
  ComboBox/ListBox/ListView(GridView)/DataGrid/Slider/ProgressBar/Image/Menu/ContextMenu/TabControl/GroupBox/Expander/TreeView/DatePicker/StatusBar/ToolBar ·
  Shape(Rectangle · Ellipse · Line · Polygon · Path) · Style/Setter/Trigger · Resources/StaticResource · DataTemplate · Binding · ICommand · DispatcherTimer ·
  MessageBox · OpenFileDialog/SaveFileDialog · 애니메이션(기본)
- 미지원: ControlTemplate, VisualStateManager, 3D, MediaElement 등 고급 기능
- 실제 WPF 와 모양이 조금 다를 수 있어, **예제마다 Visual Studio 에서 실행한 실제 화면 캡처**를 함께 싣습니다.

## 사용 방법

### GitHub Pages 로 공개하기 (권장)

저장소 **Settings → Pages → Branch: `main` / root** 로 설정하면 `https://<사용자>.github.io/studyCSharpWPF/` 에서 바로 사용할 수 있습니다.

- 학생용: `https://<사용자>.github.io/studyCSharpWPF/student.html`
- 교사용: `https://<사용자>.github.io/studyCSharpWPF/teacher.html`

### 내 컴퓨터에서 열기

`index.html` 을 더블클릭해 파일로 열면(`file://`) 브라우저 보안 정책 때문에 실행 환경을 불러올 수 없습니다. 작은 웹 서버로 엽니다.

1. `start.bat` 더블클릭 (macOS / Linux: `./start.sh`) — 파이썬 3 필요
   또는 이 폴더에서 `python server/serve.py`
2. 브라우저에서 http://localhost:8080/student.html (교사용: `/teacher.html`)

교사 PC 에서 `start-lan.bat` (또는 `./start.sh --lan`) 으로 켜면 같은 네트워크의 학생 PC 가 표시된 주소로 접속할 수 있습니다.
(C# 은 각 학생의 브라우저에서 실행되므로 교사 PC 에 부담이 없습니다.)

## 화면 구성

- **왼쪽** — 챕터/프로젝트/교시 목차, 학습 진도(브라우저에 저장), 검색, 학생용/교사용 전환, 실행 환경 상태
- **가운데** — 📄 문서 보기(학습 목표 → 개념 → 예제 → 실행 화면 → 실습 과제 → 퀴즈) + 하단 코드 편집기
  또는 🖼️ 슬라이드 보기(16:9 PPT)
- **오른쪽** — 🪟 WPF 창(WPF 예제를 실행할 때 열림) + 콘솔: 표준 출력/오류, 실행 중 키보드 입력, 컴파일 오류 위치 이동 + 한국어 도움말, 📁 작업 폴더

## 학생용 · 교사용

| 페이지 | 기본 보기 | 기능 |
|---|---|---|
| `student.html` 🎓 | 문서형 강좌 | 예제 ▶ 실행 · 편집 · 콘솔 입력, WPF 창 조작, 실습 과제(시작 코드 · 힌트 · 기대 출력), 퀴즈 즉시 채점, 진도 저장, 슬라이드 보기 |
| `teacher.html` 🧑‍🏫 | PPT 슬라이드 | 슬라이드에서 코드 **직접 수정 · 실행**, ⛶ 전체 화면(결과 패널 함께 표시), 교사 노트 · 수업 흐름, 퀴즈 정답 공개, 실습 정답 코드 표시 · 실행, 수업 타이머, 🖥 발표자 창, ✏️ 판서 |

### 교사용 슬라이드 화면

상단 메뉴는 두 줄입니다. (둘째 줄 판서 도구는 교사용에서만 표시)

- **첫째 줄 — 이동과 보기**: `⏮ 처음` · `◀` · `6 / 25` · `▶` · 페이지 슬라이더 · 현재 슬라이드 제목 ·
  (오른쪽) `⏱ 00:00` 수업 타이머 · `↺` 초기화 · `🗒 발표자 창` · `▦ 목록` · `📄 문서` · `⛶ 전체 화면`, 맨 아래 진행 막대
- **둘째 줄 — ✏️ 판서**: `🖊 펜` · `🖍 형광펜` · `🧽 지우개` · `👆 지시봉` | 색 6가지 | 굵기 3단계 |
  `↶ 되돌리기`(Ctrl+Z, 50단계) · `🗑 이 장 지우기` · `🗑 모두`
- **슬라이드 위**: 좌우 가장자리를 클릭하면 이전/다음 쪽, 가운데에서 끌면 판서. 판서는 슬라이드마다 따로 보관되고 새로 고치면 지워집니다.
- **전체 화면**: 상단 메뉴가 숨겨지고, 마우스를 화면 위쪽에 올리면 나타납니다. 실행 결과 창은 코드를 실행하면 열립니다.

**슬라이드 단축키:** `←` `→` `Space` 이동 · `Home` 처음 · `End` 마지막 · `F` 전체 화면 · `R` 결과(콘솔) 패널 · `G` 슬라이드 목록 ·
`N` 교사 노트 · `B` 화면 가리기 · `T` 타이머 · `Ctrl+Z` 판서 되돌리기 · `Esc` 닫기 / 전체 화면 종료 · 코드 편집기에서 `Ctrl+Enter` 실행

**교사용 비밀번호:** 기본값 `csharp2026` (`js/app.js` 의 `TEACHER_PASSWORD`). 한 번 확인하면 그 브라우저에서는 다시 묻지 않습니다.

**발표자 창(`presenter.html`):** 프로젝터에는 강좌 창을 전체 화면으로, 교사 모니터에는 발표자 창(노트 · 다음 슬라이드 · 타이머)을 띄우면 함께 넘어갑니다.

**딥 링크:** `teacher.html#ch15-1@3` → 15장 1교시의 3번째 슬라이드

## 폴더 구조

```
index.html               강좌 메인 페이지 (?role=student|teacher)
student.html             학생용 진입 페이지
teacher.html             교사용 진입 페이지 (슬라이드)
presenter.html           발표자 창
coi-sw.js                교차 출처 격리 서비스 워커 (GitHub Pages 에서 실행 중 입력 지원)
css/style.css            레이아웃 · 문서 · 콘솔 스타일 (라이트/다크)
css/slides.css           16:9 슬라이드 스타일
css/wpf.css              브라우저 WPF 창 · 컨트롤 스타일
js/course.js             커리큘럼 (챕터 · 프로젝트 목록)
js/app.js                네비게이션 · 문서 렌더링 · 편집기 · 진도
js/slides.js             슬라이드 엔진 · 판서 · 전체 화면 · 발표자 창 · 타이머
js/runner.js             콘솔 · 오류 도움말
js/highlight.js          C#/XAML 코드 강조 · 편집기 · 파일 나누기
js/cs-engine.js          브라우저 C# 엔진 (워커 관리 · 입력 · 작업 폴더)
js/cs-worker.js          실행 워커 (.NET 런타임 + Roslyn)
js/wpf-render.js         WPF 창 · 컨트롤 렌더러 (UI 명령 → DOM, DOM 이벤트 → C#)
lessons/chNN.js          챕터별 강좌 콘텐츠 (문서 + 실습 + 퀴즈 + 슬라이드)
lessons/pNN.js           응용 프로젝트
runtime/cs/_framework/   브라우저용 .NET 런타임 + Roslyn (gzip)
assets/shots/            Visual Studio 실행 화면 캡처
tools/wpfshim/           WPF 호환 라이브러리 (System.Windows.* 재구현)
tools/runner/            브라우저 실행 엔진 (Blazor WebAssembly + Roslyn 컴파일)
tools/build-runtime.ps1  runtime/cs 다시 만들기
tools/validator/         콘텐츠 검증기 (데스크톱 .NET 에서 같은 방식으로 컴파일 · 실행)
tools/validate.mjs       콘텐츠 검증 (모든 예제 컴파일 · 실행 + 출력 비교)
tools/shots/             WPF 예제를 실제 WPF 앱으로 빌드 · 실행해 창을 캡처
tools/shots.mjs          캡처 실행 (assets/shots/*.png 생성)
server/serve.py          로컬 · 교실용 정적 웹 서버 (COOP/COEP 헤더)
docs/LESSON_GUIDE.md     콘텐츠 작성 가이드
```

## 콘텐츠 수정 · 검증

`docs/LESSON_GUIDE.md` 형식에 따라 `lessons/*.js` 를 수정한 뒤 검증합니다. (브라우저와 같은 컴파일 방식을 데스크톱 .NET 에서 사용)

```bash
node tools/validate.mjs all            # 모든 챕터 · 프로젝트
node tools/validate.mjs ch06           # 한 챕터
node tools/validate.mjs ch06 --print   # 실제 출력 확인 (expect 작성용)
```

## Visual Studio 실행 화면 캡처 (Windows)

WPF 예제를 **실제 WPF 앱으로 빌드 · 실행해 창을 PNG 로 캡처**합니다. 캡처가 있으면 강좌 화면에 자동으로 함께 표시됩니다.

```bash
node tools/shots.mjs all               # 캡처가 없는 예제만
node tools/shots.mjs ch15 --force      # 다시 캡처
```

## 실행 환경 다시 만들기 (runtime/cs)

`tools/wpfshim` 또는 `tools/runner` 를 고쳤다면 다시 만들어야 합니다. (.NET 9 SDK 필요)

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-runtime.ps1
```

## 참고 · 라이선스

- 런타임 · 컴파일러: [.NET](https://github.com/dotnet/runtime) · [Roslyn](https://github.com/dotnet/roslyn) (MIT)
- 코드 편집기: [CodeMirror 5](https://codemirror.net/5/), 글꼴: Pretendard, JetBrains Mono
- WPF 호환 라이브러리(`tools/wpfshim`)는 이 강좌를 위해 새로 작성한 것으로, 마이크로소프트의 WPF 구현과는 무관합니다.
