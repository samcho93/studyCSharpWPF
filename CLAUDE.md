# studyCSharpWPF — C# · WPF 웹 실습 강좌

GitHub Pages 정적 사이트: `https://samcho93.github.io/studyCSharpWPF/` (학생용 `student.html`, 교사용 `teacher.html`).
같은 콘텐츠를 학생용(문서 + 실습)과 교사용(PPT 슬라이드 + 판서 + 교사 노트)으로 보여 준다. 형식은 `../studyCPP` 와 같다.

## 구조

- `index.html` · `js/app.js` · `js/slides.js` · `css/` — 강좌 프레임워크 (studyCPP 에서 가져와 C# 용으로 수정)
- `js/course.js` — 커리큘럼(챕터 순서). `lessons/chNN.js`, `lessons/pNN.js` — 강좌 콘텐츠 (작성 규칙: `docs/LESSON_GUIDE.md`)
- `js/cs-engine.js` (메인) + `js/cs-worker.js` (웹 워커) — 브라우저 C# 실행 엔진. `runtime/cs/` 의 .NET WebAssembly 런타임 + Roslyn 을 워커에서 띄운다
- `js/wpf-render.js` + `css/wpf.css` — 워커의 WPF 호환 라이브러리가 보내는 UI 명령을 DOM 으로 그리는 렌더러
- `tools/wpfshim/` — WPF 호환 라이브러리(C#, `System.Windows.*` 네임스페이스 재구현) + 웹 콘솔용 `Console`
- `tools/runner/` — Blazor WebAssembly 프로젝트(CsRunner): Roslyn 컴파일 + 실행, JS 상호 운용(`Interop.cs`)
- `tools/build-runtime.ps1` — runner 를 publish 해 `runtime/cs/_framework/*.gz` 로 배치 (런타임을 바꾸면 다시 실행)
- `tools/validator/` + `tools/validate.mjs` — 콘텐츠 검증 (`node tools/validate.mjs ch01`)
- `tools/shots/` — Visual Studio(WPF) 실행 화면 캡처 자동화 (`assets/shots/*.png`)

## 규칙

- 콘텐츠 예제는 검증 도구를 통과해야 한다. WPF 예제는 `shot` 캡처를 붙인다.
- 런타임(C#) 을 고치면 `powershell -File tools/build-runtime.ps1` 로 다시 만들고 `runtime/cs/` 를 커밋한다.
- 커밋 · 푸시: `git push origin main`.
