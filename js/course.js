/* C# · WPF 강좌 커리큘럼
 * 각 챕터/프로젝트의 상세 내용은 lessons/<id>.js 에서 CS_COURSE.addChapter({...}) 로 등록한다.
 */
window.CS_COURSE = {
  title: 'C# · WPF 프로그래밍',
  subtitle: '브라우저에서 실행하며 배우는 C# 기초와 WPF 윈도우 프로그래밍',
  groups: { basic: '📘 Part 1 · C# 기초', wpf: '🪟 Part 2 · WPF 윈도우 프로그래밍', project: '🚀 응용 프로젝트' },
  order: [
    { id: 'ch01', no: '01', title: 'C# 과 .NET, 첫 프로그램', icon: '🚀', group: 'basic' },
    { id: 'ch02', no: '02', title: '변수와 자료형', icon: '📦', group: 'basic' },
    { id: 'ch03', no: '03', title: '연산자와 식', icon: '➗', group: 'basic' },
    { id: 'ch04', no: '04', title: '조건문', icon: '🔀', group: 'basic' },
    { id: 'ch05', no: '05', title: '반복문', icon: '🔁', group: 'basic' },
    { id: 'ch06', no: '06', title: '메서드', icon: '🔧', group: 'basic' },
    { id: 'ch07', no: '07', title: '배열과 컬렉션', icon: '🧮', group: 'basic' },
    { id: 'ch08', no: '08', title: '클래스와 객체', icon: '🧱', group: 'basic' },
    { id: 'ch09', no: '09', title: '상속 · 다형성 · 인터페이스', icon: '🧬', group: 'basic' },
    { id: 'ch10', no: '10', title: '문자열 · 예외 처리 · 파일', icon: '🔤', group: 'basic' },
    { id: 'ch11', no: '11', title: '델리게이트 · 이벤트 · 람다 · LINQ', icon: '⚡', group: 'basic' },
    { id: 'ch12', no: '12', title: '제네릭 · 구조체 · 열거형 · 비동기', icon: '🧩', group: 'basic' },

    { id: 'ch13', no: '13', title: 'WPF 소개와 첫 윈도우', icon: '🪟', group: 'wpf' },
    { id: 'ch14', no: '14', title: 'XAML 기초', icon: '📝', group: 'wpf' },
    { id: 'ch15', no: '15', title: '레이아웃 패널', icon: '📐', group: 'wpf' },
    { id: 'ch16', no: '16', title: '기본 컨트롤', icon: '🎛️', group: 'wpf' },
    { id: 'ch17', no: '17', title: '이벤트 처리', icon: '🖱️', group: 'wpf' },
    { id: 'ch18', no: '18', title: '데이터 바인딩', icon: '🔗', group: 'wpf' },
    { id: 'ch19', no: '19', title: '스타일 · 리소스 · 템플릿', icon: '🎨', group: 'wpf' },
    { id: 'ch20', no: '20', title: 'MVVM 패턴', icon: '🏗️', group: 'wpf' },
    { id: 'ch21', no: '21', title: '메뉴 · 대화상자 · 다중 창', icon: '🗂️', group: 'wpf' },
    { id: 'ch22', no: '22', title: '그래픽 · 애니메이션 · 타이머', icon: '✨', group: 'wpf' },

    { id: 'p01', no: 'P01', title: '콘솔 성적 관리 프로그램', icon: '📊', group: 'project' },
    { id: 'p02', no: 'P02', title: '은행 계좌 관리 (클래스)', icon: '🏦', group: 'project' },
    { id: 'p03', no: 'P03', title: '콘솔 텍스트 게임', icon: '🎮', group: 'project' },
    { id: 'p04', no: 'P04', title: 'WPF 계산기', icon: '🧮', group: 'project' },
    { id: 'p05', no: 'P05', title: 'WPF 할 일 관리 (MVVM)', icon: '✅', group: 'project' },
    { id: 'p06', no: 'P06', title: 'WPF 주소록 (파일 저장)', icon: '📒', group: 'project' },
    { id: 'p07', no: 'P07', title: 'WPF 그림판', icon: '🖌️', group: 'project' },
    { id: 'p08', no: 'P08', title: 'WPF 스톱워치 · 타이머', icon: '⏱️', group: 'project' },
    { id: 'p09', no: 'P09', title: 'WPF 메모장', icon: '📝', group: 'project' },
    { id: 'p10', no: 'P10', title: 'WPF 벽돌 깨기 게임', icon: '🧱', group: 'project' }
  ],
  chapters: {},
  addChapter: function (ch) { this.chapters[ch.id] = ch; }
};
