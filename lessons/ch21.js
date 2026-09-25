/* Chapter 21. 메뉴 · 대화상자 · 다중 창 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 그림 1. 전형적인 윈도우 앱 화면 구성 ---------- */
  const SVG_LAYOUT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메뉴 막대, 도구 모음, 작업 영역, 상태 표시줄, 오른쪽 클릭 메뉴로 이루어진 윈도우 앱 화면">
  <defs><marker id="ah21a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="24" width="700" height="512" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="62" y="58" style="font-size:20px;fill:var(--fg)">*제목 없음 - 메모장</text>
  <text x="720" y="58" text-anchor="end" style="font-size:20px;fill:var(--muted)">—   ☐   ✕</text>
  <line x1="40" y1="74" x2="740" y2="74" stroke="var(--line)" stroke-width="2"/>
  <rect x="46" y="78" width="688" height="40" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="62" y="105">파일(<tspan text-decoration="underline">F</tspan>)</text>
    <text x="162" y="105">편집(<tspan text-decoration="underline">E</tspan>)</text>
    <text x="262" y="105">보기(<tspan text-decoration="underline">V</tspan>)</text>
    <text x="362" y="105">도움말(<tspan text-decoration="underline">H</tspan>)</text>
  </g>
  <rect x="46" y="124" width="688" height="44" rx="4" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <g style="font-size:18px;fill:var(--fg)">
    <rect x="58" y="131" width="76" height="30" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="96" y="152" text-anchor="middle">새로</text>
    <rect x="140" y="131" width="76" height="30" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="178" y="152" text-anchor="middle">열기</text>
    <rect x="222" y="131" width="76" height="30" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="260" y="152" text-anchor="middle">저장</text>
    <line x1="312" y1="132" x2="312" y2="160" stroke="var(--line)" stroke-width="2"/>
    <rect x="326" y="131" width="56" height="30" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="354" y="152" text-anchor="middle">가-</text>
    <rect x="388" y="131" width="56" height="30" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="416" y="152" text-anchor="middle">가+</text>
  </g>
  <rect x="46" y="174" width="688" height="300" rx="4" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="64" y="210">오늘 할 일</text>
    <text x="64" y="246">· WPF 21장 복습</text>
    <text x="64" y="282">· 메뉴와 대화상자 만들기|</text>
  </g>
  <rect x="420" y="300" width="200" height="140" rx="6" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="440" y="334">대문자로</text>
    <text x="440" y="368">시각 넣기</text>
    <line x1="432" y1="384" x2="608" y2="384" stroke="var(--line)" stroke-width="2"/>
    <text x="440" y="418">모두 지우기</text>
  </g>
  <rect x="46" y="480" width="688" height="50" rx="4" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="62" y="512">준비</text>
    <line x1="190" y1="488" x2="190" y2="522" stroke="var(--line)" stroke-width="2"/>
    <text x="210" y="512">54글자 · 3줄</text>
    <line x1="400" y1="488" x2="400" y2="522" stroke="var(--line)" stroke-width="2"/>
    <text x="420" y="512">크기 15</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="792" y1="80" x2="744" y2="98" marker-end="url(#ah21a)"/>
    <line x1="792" y1="162" x2="744" y2="148" marker-end="url(#ah21a)"/>
    <line x1="792" y1="262" x2="744" y2="262" marker-end="url(#ah21a)"/>
    <line x1="792" y1="372" x2="628" y2="372" marker-end="url(#ah21a)"/>
    <line x1="792" y1="492" x2="744" y2="505" marker-end="url(#ah21a)"/>
  </g>
  <text x="800" y="70" style="font-size:23px;font-weight:700;fill:var(--accent)">① Menu · MenuItem</text>
  <text x="800" y="98" style="${MONO};font-size:18px;fill:var(--muted)">Dock="Top" — 메뉴 막대</text>
  <text x="800" y="152" style="font-size:23px;font-weight:700;fill:var(--accent2)">② ToolBarTray · ToolBar</text>
  <text x="800" y="180" style="${MONO};font-size:18px;fill:var(--muted)">Dock="Top" — 도구 모음</text>
  <text x="800" y="254" style="font-size:23px;font-weight:700;fill:var(--ok)">④ TextBox — 작업 영역</text>
  <text x="800" y="282" style="font-size:18px;fill:var(--muted)">마지막 자식 = 남은 공간 전부</text>
  <text x="800" y="364" style="font-size:23px;font-weight:700;fill:var(--danger)">⑤ ContextMenu</text>
  <text x="800" y="392" style="font-size:18px;fill:var(--muted)">오른쪽 클릭 메뉴</text>
  <text x="800" y="484" style="font-size:23px;font-weight:700;fill:var(--warn)">③ StatusBar</text>
  <text x="800" y="512" style="${MONO};font-size:18px;fill:var(--muted)">Dock="Bottom" — 상태 표시줄</text>
</svg>`;

  /* ---------- 그림 2. 메뉴의 구조 ---------- */
  const SVG_MENU = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="펼친 메뉴의 구성: 액세스 키, 단축키 표시, 하위 메뉴, 체크 항목, 구분선, Click">
  <defs><marker id="ah21b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="40" width="560" height="44" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="48" y="46" width="104" height="32" rx="4" fill="var(--accent)" opacity="0.22"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="60" y="70">파일(<tspan text-decoration="underline">F</tspan>)</text>
    <text x="172" y="70">편집(<tspan text-decoration="underline">E</tspan>)</text>
    <text x="284" y="70">보기(<tspan text-decoration="underline">V</tspan>)</text>
  </g>
  <rect x="48" y="84" width="380" height="290" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="52" y="226" width="372" height="30" rx="3" fill="var(--accent2)" opacity="0.18"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="90" y="118">새로 만들기(<tspan text-decoration="underline">N</tspan>)</text>
    <text x="90" y="160">열기(<tspan text-decoration="underline">O</tspan>)...</text>
    <text x="90" y="202">저장(<tspan text-decoration="underline">S</tspan>)</text>
    <text x="90" y="248">최근 파일(<tspan text-decoration="underline">R</tspan>)</text>
    <text x="66" y="302" style="fill:var(--ok);font-weight:700">✓</text>
    <text x="90" y="302">상태 표시줄(<tspan text-decoration="underline">S</tspan>)</text>
    <text x="90" y="346">끝내기(<tspan text-decoration="underline">X</tspan>)</text>
  </g>
  <g style="${MONO};font-size:18px;fill:var(--muted)" text-anchor="end">
    <text x="412" y="118">Ctrl+N</text>
    <text x="412" y="160">Ctrl+O</text>
    <text x="412" y="202">Ctrl+S</text>
    <text x="412" y="248">▸</text>
  </g>
  <line x1="60" y1="270" x2="416" y2="270" stroke="var(--line)" stroke-width="2"/>
  <rect x="428" y="226" width="170" height="76" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="446" y="256">일기.txt</text>
    <text x="446" y="290">할 일.txt</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="652" y1="62" x2="608" y2="62" marker-end="url(#ah21b)"/>
    <line x1="652" y1="160" x2="434" y2="160" marker-end="url(#ah21b)"/>
    <line x1="652" y1="258" x2="606" y2="258" marker-end="url(#ah21b)"/>
    <line x1="652" y1="318" x2="434" y2="302" marker-end="url(#ah21b)"/>
    <line x1="652" y1="372" x2="424" y2="276" marker-end="url(#ah21b)"/>
    <line x1="652" y1="426" x2="434" y2="348" marker-end="url(#ah21b)"/>
  </g>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="660" y="68"><tspan font-weight="700" style="fill:var(--accent)">① 액세스 키</tspan>  Header="파일(_F)" → 밑줄 F</text>
    <text x="660" y="166"><tspan font-weight="700" style="fill:var(--accent)">② 단축키 표시</tspan>  InputGestureText · Command</text>
    <text x="660" y="264"><tspan font-weight="700" style="fill:var(--accent)">③ 하위 메뉴</tspan>  MenuItem 안에 MenuItem</text>
    <text x="660" y="324"><tspan font-weight="700" style="fill:var(--accent)">④ 체크 항목</tspan>  IsCheckable · IsChecked</text>
    <text x="660" y="378"><tspan font-weight="700" style="fill:var(--accent)">⑤ 구분선</tspan>  &lt;Separator/&gt;</text>
    <text x="660" y="432"><tspan font-weight="700" style="fill:var(--accent)">⑥ 고르면</tspan>  Click 이벤트 또는 Command 실행</text>
  </g>
  <text x="640" y="490" text-anchor="middle" style="font-size:21px;fill:var(--fg)">Menu ▸ MenuItem(맨 위) ▸ MenuItem(항목) ▸ MenuItem(하위 메뉴) …</text>
  <text x="640" y="528" text-anchor="middle" style="font-size:19px;fill:var(--muted)">태그를 중첩하는 만큼 메뉴가 깊어진다 — 맨 위 MenuItem 은 보통 Click 없이 “제목” 역할만</text>
</svg>`;

  /* ---------- 그림 3. 모달 vs 모덜리스 ---------- */
  const SVG_MODAL = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="ShowDialog 는 창이 닫힐 때까지 기다리고, Show 는 창을 띄우고 바로 돌아온다">
  <defs><marker id="ah21c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <text x="40" y="50" style="font-size:25px;font-weight:700;fill:var(--accent)">① 모달 (Modal) — ShowDialog()</text>
  <text x="40" y="114" style="font-size:20px;fill:var(--muted)">주 창 코드</text>
  <rect x="250" y="82" width="200" height="50" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="350" y="114" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">dlg.ShowDialog()</text>
  <rect x="470" y="82" width="420" height="50" rx="10" fill="none" stroke="var(--danger)" stroke-width="3" stroke-dasharray="10 7"/>
  <text x="680" y="114" text-anchor="middle" style="font-size:20px;fill:var(--danger)">⏸ 멈춰서 기다림 — 주 창 조작 불가</text>
  <rect x="910" y="82" width="330" height="50" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1075" y="114" text-anchor="middle" style="font-size:20px;fill:var(--fg)">다음 줄 실행 · 결과 사용</text>
  <text x="40" y="194" style="font-size:20px;fill:var(--muted)">대화상자</text>
  <rect x="470" y="162" width="420" height="50" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="680" y="194" text-anchor="middle" style="font-size:20px;fill:var(--fg)">열림 → 확인 · 취소를 누르면 닫힘</text>
  <text x="920" y="194" style="font-size:19px;fill:var(--ok)">↖ true / false 를 돌려받음</text>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="420" y1="134" x2="464" y2="168" marker-end="url(#ah21c)"/>
    <line x1="892" y1="168" x2="912" y2="138" marker-end="url(#ah21c)"/>
  </g>
  <line x1="40" y1="256" x2="1240" y2="256" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="40" y="302" style="font-size:25px;font-weight:700;fill:var(--accent2)">② 모덜리스 (Modeless) — Show()</text>
  <text x="40" y="364" style="font-size:20px;fill:var(--muted)">주 창 코드</text>
  <rect x="250" y="332" width="200" height="50" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="350" y="364" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">w.Show()</text>
  <rect x="470" y="332" width="770" height="50" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="855" y="364" text-anchor="middle" style="font-size:20px;fill:var(--fg)">바로 다음 줄 실행 — 주 창도 계속 사용할 수 있다</text>
  <text x="40" y="444" style="font-size:20px;fill:var(--muted)">새 창</text>
  <rect x="470" y="412" width="610" height="50" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="775" y="444" text-anchor="middle" style="font-size:20px;fill:var(--fg)">열림 — 두 창을 자유롭게 오가며 사용</text>
  <rect x="1096" y="412" width="144" height="50" rx="10" fill="none" stroke="var(--muted)" stroke-width="2"/>
  <text x="1168" y="444" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">Closed</text>
  <line x1="420" y1="384" x2="464" y2="418" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah21c)"/>
  <text x="40" y="512" style="font-size:20px;fill:var(--accent)">모달 = 대답을 들어야 다음으로 — 입력 받기 · 설정 · 저장 확인 · 파일 대화상자</text>
  <text x="40" y="546" style="font-size:20px;fill:var(--accent2)">모덜리스 = 옆에 띄워 두고 함께 — 찾기 창 · 도구 창 · 대화(채팅) 창</text>
</svg>`;

  /* ---------- 그림 4. 창 사이 데이터 전달 ---------- */
  const SVG_PASS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="주 창과 대화상자 사이에 생성자 매개변수, 속성, DialogResult, 이벤트로 데이터를 주고받는 방법">
  <defs>
    <marker id="ah21d" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah21e" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <rect x="40" y="40" width="290" height="480" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="185" y="96" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--accent)">주 창</text>
  <text x="185" y="130" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">MainWindow</text>
  <rect x="950" y="40" width="290" height="480" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="1095" y="96" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--warn)">대화상자 · 새 창</text>
  <text x="1095" y="130" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">InputDialog …</text>
  <g stroke-width="4">
    <line x1="340" y1="200" x2="940" y2="200" stroke="var(--accent)" marker-end="url(#ah21d)"/>
    <line x1="340" y1="300" x2="940" y2="300" stroke="var(--accent)" marker-end="url(#ah21d)"/>
    <line x1="940" y1="400" x2="340" y2="400" stroke="var(--ok)" marker-end="url(#ah21e)"/>
    <line x1="940" y1="486" x2="340" y2="486" stroke="var(--ok)" marker-end="url(#ah21e)"/>
  </g>
  <text x="640" y="186" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">① 생성자 매개변수 (열기 전)</text>
  <text x="640" y="230" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">new InputDialog("질문", "기본값")</text>
  <text x="640" y="286" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">② 속성에 넣기 (열기 전)</text>
  <text x="640" y="330" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">dlg.SelectedFontSize = 14;</text>
  <text x="640" y="386" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">③ DialogResult + 속성 읽기 (닫힌 뒤)</text>
  <text x="640" y="430" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">if (dlg.ShowDialog() == true) … dlg.Answer</text>
  <text x="640" y="472" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">④ 이벤트 (열려 있는 동안 언제든)</text>
  <text x="640" y="516" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">MessageSent?.Invoke(this, text);</text>
  <text x="185" y="300" text-anchor="middle" style="font-size:19px;fill:var(--muted)">보낼 값 준비</text>
  <text x="185" y="400" text-anchor="middle" style="font-size:19px;fill:var(--muted)">결과 받아 쓰기</text>
  <text x="1095" y="300" text-anchor="middle" style="font-size:19px;fill:var(--muted)">받은 값으로 화면 채우기</text>
  <text x="1095" y="400" text-anchor="middle" style="font-size:19px;fill:var(--muted)">입력을 속성에 담기</text>
</svg>`;

  /* ======================= 21-1 예제 코드 ======================= */
  const EX_MENU = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21MenuBasics.MainWindow"
        ${NS}
        Title="메뉴 기본" Width="460" Height="320">
    <DockPanel>
        <!-- ① 메뉴 막대: DockPanel 의 맨 위에 붙인다 -->
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" InputGestureText="Ctrl+N" Click="MenuItem_Click"/>
                <MenuItem Header="열기(_O)..." InputGestureText="Ctrl+O" Click="MenuItem_Click"/>
                <!-- ② 하위 메뉴: MenuItem 안에 MenuItem 을 또 넣는다 -->
                <MenuItem Header="최근 파일(_R)">
                    <MenuItem Header="일기.txt" Click="MenuItem_Click"/>
                    <MenuItem Header="할 일.txt" Click="MenuItem_Click"/>
                </MenuItem>
                <!-- ③ 구분선 -->
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
            <MenuItem Header="편집(_E)">
                <MenuItem Header="잘라내기(_T)" InputGestureText="Ctrl+X" Click="MenuItem_Click"/>
                <MenuItem Header="복사(_C)" InputGestureText="Ctrl+C" Click="MenuItem_Click"/>
                <!-- ④ IsEnabled="False": 회색으로 보이고 고를 수 없다 -->
                <MenuItem Header="붙여넣기(_P)" InputGestureText="Ctrl+V" IsEnabled="False"/>
            </MenuItem>
            <MenuItem Header="도움말(_H)">
                <MenuItem Header="정보(_A)..." Click="About_Click"/>
            </MenuItem>
        </Menu>
        <TextBlock x:Name="lblInfo" Margin="16" FontSize="16" TextWrapping="Wrap"
                   Text="메뉴를 눌러 항목을 골라 보세요."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;   // MenuItem

namespace Ch21MenuBasics
{
    public partial class MainWindow : Window
    {
        private int count = 0;   // 메뉴를 고른 횟수

        public MainWindow()
        {
            InitializeComponent();
        }

        // 여러 메뉴 항목이 처리기 하나를 함께 쓴다 → sender 로 어느 항목인지 구분
        private void MenuItem_Click(object sender, RoutedEventArgs e)
        {
            MenuItem item = (MenuItem)sender;
            string name = $"{item.Header}".Replace("_", "");   // "열기(_O)..." → "열기(O)..."
            count++;
            lblInfo.Text = $"{count}. [{name}] 메뉴를 골랐습니다.";
        }

        private void About_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("메뉴 기본 예제 1.0", "정보", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();   // 창 닫기 → 주 창이면 프로그램 끝
        }
    }
}`;

  const EX_CHECK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ViewOptions.MainWindow"
        ${NS}
        Title="보기 메뉴 — 켜고 끄기" Width="460" Height="340">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="보기(_V)">
                <!-- IsCheckable="True": 누를 때마다 ✓ 가 켜졌다 꺼졌다 한다 -->
                <MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)"
                          IsCheckable="True" IsChecked="True" Click="Wrap_Click"/>
                <MenuItem x:Name="mnuStatus" Header="상태 표시줄(_S)"
                          IsCheckable="True" IsChecked="True" Click="Status_Click"/>
                <Separator/>
                <MenuItem Header="글자 크기(_Z)">
                    <!-- 셋 중 하나만: Tag 에 크기를 적어 두고 처리기 하나로 -->
                    <MenuItem x:Name="mnuSmall" Header="작게" Tag="12" IsCheckable="True" Click="Size_Click"/>
                    <MenuItem x:Name="mnuNormal" Header="보통" Tag="16" IsCheckable="True" IsChecked="True" Click="Size_Click"/>
                    <MenuItem x:Name="mnuLarge" Header="크게" Tag="22" IsCheckable="True" Click="Size_Click"/>
                </MenuItem>
            </MenuItem>
        </Menu>
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom">
            <StatusBarItem>
                <TextBlock x:Name="lblStatus" Text="준비"/>
            </StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="16" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto"
                 Text="보기 메뉴에서 자동 줄 바꿈을 끄면 긴 줄이 창 밖으로 이어집니다. 상태 표시줄을 끄면 아래 막대가 사라지고, 글자 크기를 바꾸면 이 글이 커지거나 작아집니다."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace Ch21ViewOptions
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // IsCheckable 항목은 누르면 IsChecked 가 "먼저" 뒤집히고, 그다음 Click 이 온다
        private void Wrap_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.TextWrapping = mnuWrap.IsChecked ? TextWrapping.Wrap : TextWrapping.NoWrap;
            lblStatus.Text = mnuWrap.IsChecked ? "자동 줄 바꿈 켬" : "자동 줄 바꿈 끔";
        }

        private void Status_Click(object sender, RoutedEventArgs e)
        {
            // Collapsed: 자리까지 없앤다 → 작업 영역이 그만큼 늘어난다
            statusBar.Visibility = mnuStatus.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }

        private void Size_Click(object sender, RoutedEventArgs e)
        {
            MenuItem picked = (MenuItem)sender;

            // 라디오 버튼처럼 하나만 체크: 모두 끄고, 고른 것만 켠다
            mnuSmall.IsChecked = false;
            mnuNormal.IsChecked = false;
            mnuLarge.IsChecked = false;
            picked.IsChecked = true;

            txtMemo.FontSize = Convert.ToDouble(picked.Tag);   // Tag="12" → 12.0
            lblStatus.Text = $"글자 크기 {txtMemo.FontSize}";
        }
    }
}`;

  const EX_COMMAND = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21CommandMenu.MainWindow"
        ${NS}
        Title="명령 — 메뉴와 도구 모음이 함께" Width="480" Height="340">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <!-- Command 를 주면 오른쪽에 단축키(Ctrl+N …)가 저절로 표시된다 -->
                <MenuItem Header="새로 만들기(_N)" Command="{x:Static ApplicationCommands.New}"/>
                <MenuItem Header="열기(_O)..." Command="{x:Static ApplicationCommands.Open}"/>
                <MenuItem Header="저장(_S)" Command="{x:Static ApplicationCommands.Save}"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <!-- 도구 모음: 메뉴와 "같은 명령" 을 버튼으로 -->
        <ToolBarTray DockPanel.Dock="Top">
            <ToolBar>
                <Button Content="📄 새로" ToolTip="새로 만들기 (Ctrl+N)" Command="{x:Static ApplicationCommands.New}"/>
                <Button Content="📂 열기" ToolTip="열기 (Ctrl+O)" Command="{x:Static ApplicationCommands.Open}"/>
                <Button Content="💾 저장" ToolTip="저장 (Ctrl+S)" Command="{x:Static ApplicationCommands.Save}"/>
            </ToolBar>
        </ToolBarTray>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem>
                <TextBlock x:Name="lblStatus" Text="글이 비어 있으면 저장 메뉴 · 버튼이 꺼져 있습니다."/>
            </StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;   // ApplicationCommands, CommandBinding

namespace Ch21CommandMenu
{
    public partial class MainWindow : Window
    {
        private int saveCount = 0;

        public MainWindow()
        {
            InitializeComponent();

            // 명령마다 "할 일" 을 연결한다.
            // 단축키는 ApplicationCommands 에 이미 정해져 있다: New = Ctrl+N, Open = Ctrl+O, Save = Ctrl+S
            CommandBindings.Add(new CommandBinding(ApplicationCommands.New, New_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Open, Open_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed, Save_CanExecute));
        }

        // 메뉴 · 도구 버튼 · Ctrl+N 어디서 불러도 이 메서드 하나
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            txtMemo.Clear();
            lblStatus.Text = "새 문서를 시작합니다.";
        }

        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            lblStatus.Text = "열기 — 진짜 파일 열기는 다음 교시(OpenFileDialog)에서!";
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            saveCount++;
            lblStatus.Text = $"저장했습니다 ({saveCount}번째 · {txtMemo.Text.Length}글자)";
        }

        // 글이 있어야 저장할 수 있다 → false 이면 메뉴 · 버튼 · Ctrl+S 가 한꺼번에 꺼진다
        private void Save_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = txtMemo.Text.Length > 0;
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`;

  const EX_CONTEXT = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ContextMenu.MainWindow"
        ${NS}
        Title="오른쪽 클릭 메뉴 (ContextMenu)" Width="480" Height="340">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>

        <!-- 왼쪽: TextBox 의 오른쪽 클릭 메뉴 -->
        <DockPanel Margin="0,0,5,0">
            <TextBlock DockPanel.Dock="Top" Text="메모 (오른쪽 클릭)" Margin="0,0,0,4"/>
            <TextBox x:Name="txtMemo" FontSize="14" AcceptsReturn="True" TextWrapping="Wrap"
                     Text="Hello WPF">
                <TextBox.ContextMenu>
                    <ContextMenu>
                        <MenuItem Header="대문자로(_U)" Click="Upper_Click"/>
                        <MenuItem Header="소문자로(_L)" Click="Lower_Click"/>
                        <MenuItem Header="지금 시각 넣기(_T)" Click="Time_Click"/>
                        <Separator/>
                        <MenuItem Header="모두 지우기(_C)" Click="ClearMemo_Click"/>
                    </ContextMenu>
                </TextBox.ContextMenu>
            </TextBox>
        </DockPanel>

        <!-- 오른쪽: ListBox 의 오른쪽 클릭 메뉴 -->
        <DockPanel Grid.Column="1" Margin="5,0,0,0">
            <TextBlock DockPanel.Dock="Top" Text="과일 목록 (고른 뒤 오른쪽 클릭)" Margin="0,0,0,4"/>
            <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,4,0,0"
                       Foreground="Gray" TextWrapping="Wrap"/>
            <ListBox x:Name="lstFruits" FontSize="14">
                <ListBox.ContextMenu>
                    <ContextMenu>
                        <MenuItem Header="위로 이동(_U)" Click="MoveUp_Click"/>
                        <MenuItem Header="삭제(_D)" Click="Delete_Click"/>
                        <Separator/>
                        <MenuItem Header="모두 지우기(_C)" Click="ClearList_Click"/>
                    </ContextMenu>
                </ListBox.ContextMenu>
            </ListBox>
        </DockPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace Ch21ContextMenu
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            foreach (string f in new[] { "사과", "바나나", "체리", "딸기", "귤" })
                lstFruits.Items.Add(f);
        }

        // ---------- TextBox 메뉴 ----------
        private void Upper_Click(object sender, RoutedEventArgs e) { txtMemo.Text = txtMemo.Text.ToUpper(); }
        private void Lower_Click(object sender, RoutedEventArgs e) { txtMemo.Text = txtMemo.Text.ToLower(); }

        private void Time_Click(object sender, RoutedEventArgs e)
        {
            // SelectedText 에 넣으면 커서 자리(선택한 부분)에 끼워 넣어진다
            txtMemo.SelectedText = DateTime.Now.ToString("HH:mm");
        }

        private void ClearMemo_Click(object sender, RoutedEventArgs e) { txtMemo.Clear(); }

        // ---------- ListBox 메뉴 ----------
        private void MoveUp_Click(object sender, RoutedEventArgs e)
        {
            int i = lstFruits.SelectedIndex;
            if (i <= 0) { lblInfo.Text = "맨 위이거나 고른 항목이 없습니다."; return; }

            object item = lstFruits.Items[i];
            lstFruits.Items.RemoveAt(i);          // 빼서
            lstFruits.Items.Insert(i - 1, item);  // 한 칸 위에 다시 넣기
            lstFruits.SelectedIndex = i - 1;
            lblInfo.Text = $"'{item}' 을(를) 위로 옮겼습니다.";
        }

        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            object? item = lstFruits.SelectedItem;
            if (item == null) { lblInfo.Text = "먼저 항목을 고르세요."; return; }
            lstFruits.Items.Remove(item);
            lblInfo.Text = $"'{item}' 삭제 — 남은 {lstFruits.Items.Count}개";
        }

        private void ClearList_Click(object sender, RoutedEventArgs e)
        {
            lstFruits.Items.Clear();
            lblInfo.Text = "목록을 비웠습니다.";
        }
    }
}`;

  const EX_NOTEPAD = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21NotepadFrame.MainWindow"
        ${NS}
        Title="제목 없음 - 메모장" Width="500" Height="400">
    <DockPanel>
        <!-- ① 메뉴 막대 -->
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" Command="{x:Static ApplicationCommands.New}"/>
                <MenuItem Header="열기(_O)..." Command="{x:Static ApplicationCommands.Open}"/>
                <MenuItem Header="저장(_S)" Command="{x:Static ApplicationCommands.Save}"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
            <MenuItem Header="편집(_E)">
                <MenuItem Header="시각 넣기(_T)" Click="InsertTime_Click"/>
                <MenuItem Header="모두 지우기(_C)" Click="ClearAll_Click"/>
            </MenuItem>
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)" IsCheckable="True" IsChecked="True" Click="Wrap_Click"/>
                <MenuItem x:Name="mnuStatus" Header="상태 표시줄(_S)" IsCheckable="True" IsChecked="True" Click="Status_Click"/>
            </MenuItem>
            <MenuItem Header="도움말(_H)">
                <MenuItem Header="메모장 정보(_A)..." Click="About_Click"/>
            </MenuItem>
        </Menu>

        <!-- ② 도구 모음: 띠(ToolBarTray) 안에 ToolBar 두 개 -->
        <ToolBarTray DockPanel.Dock="Top">
            <ToolBar>
                <Button Content="📄 새로" ToolTip="새로 만들기 (Ctrl+N)" Command="{x:Static ApplicationCommands.New}"/>
                <Button Content="📂 열기" ToolTip="열기 (Ctrl+O)" Command="{x:Static ApplicationCommands.Open}"/>
                <Button Content="💾 저장" ToolTip="저장 (Ctrl+S)" Command="{x:Static ApplicationCommands.Save}"/>
            </ToolBar>
            <ToolBar>
                <Button Content="가-" ToolTip="글자 작게" Click="Smaller_Click"/>
                <Button Content="가+" ToolTip="글자 크게" Click="Bigger_Click"/>
            </ToolBar>
        </ToolBarTray>

        <!-- ③ 상태 표시줄: 작업 영역보다 "먼저" 적어야 아래에 붙는다 -->
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom">
            <StatusBarItem>
                <TextBlock x:Name="lblStatus" Text="준비"/>
            </StatusBarItem>
            <Separator/>
            <StatusBarItem>
                <TextBlock x:Name="lblCount" Text="0글자 · 1줄"/>
            </StatusBarItem>
            <Separator/>
            <StatusBarItem>
                <TextBlock x:Name="lblSize" Text="크기 15"/>
            </StatusBarItem>
        </StatusBar>

        <!-- ④ 작업 영역: 마지막 자식이 남은 공간을 모두 차지한다 -->
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" BorderThickness="0"
                 TextChanged="TxtMemo_TextChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace Ch21NotepadFrame
{
    public partial class MainWindow : Window
    {
        private string savedText = "";   // 파일 대신 잠시 보관 (다음 교시에 진짜 파일로)
        private bool isDirty = false;    // 저장하지 않은 변경이 있나?

        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.New, New_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Open, Open_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed, Save_CanExecute));
        }

        // ---------- 파일: 메뉴 · 도구 모음 · 단축키가 같은 명령 ----------
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            txtMemo.Clear();
            SetClean("새 문서");
        }

        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            txtMemo.Text = savedText;          // 다음 교시: OpenFileDialog + File.ReadAllText
            SetClean("저장해 둔 내용을 불러왔습니다");
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            savedText = txtMemo.Text;          // 다음 교시: SaveFileDialog + File.WriteAllText
            SetClean($"저장했습니다 ({savedText.Length}글자)");
        }

        // 바뀐 것이 없으면 저장 메뉴 · 버튼이 꺼진다
        private void Save_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = isDirty;
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }

        // ---------- 편집 ----------
        private void InsertTime_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.SelectedText = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
        }

        private void ClearAll_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.Clear();
            lblStatus.Text = "모두 지웠습니다";
        }

        // ---------- 보기 ----------
        private void Wrap_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.TextWrapping = mnuWrap.IsChecked ? TextWrapping.Wrap : TextWrapping.NoWrap;
        }

        private void Status_Click(object sender, RoutedEventArgs e)
        {
            statusBar.Visibility = mnuStatus.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }

        // ---------- 글자 크기 도구 ----------
        private void Smaller_Click(object sender, RoutedEventArgs e) { ChangeSize(-2); }
        private void Bigger_Click(object sender, RoutedEventArgs e) { ChangeSize(+2); }

        private void ChangeSize(double delta)
        {
            txtMemo.FontSize = Math.Clamp(txtMemo.FontSize + delta, 9, 40);   // 9 ~ 40 사이로
            lblSize.Text = $"크기 {txtMemo.FontSize}";
        }

        private void About_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("21장 메모장 틀\\n메뉴 · 도구 모음 · 상태 표시줄", "메모장 정보",
                MessageBoxButton.OK, MessageBoxImage.Information);
        }

        // ---------- 상태 표시줄 갱신 ----------
        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            isDirty = true;
            Title = "*제목 없음 - 메모장";            // * = 저장하지 않은 변경 있음
            int lines = txtMemo.Text.Split('\\n').Length;
            lblCount.Text = $"{txtMemo.Text.Length}글자 · {lines}줄";
        }

        private void SetClean(string message)
        {
            isDirty = false;
            Title = "제목 없음 - 메모장";
            lblStatus.Text = message;
        }
    }
}`;

  /* ======================= 21-1 실습 ======================= */
  const VIEW_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21PracticeView.MainWindow"
        ${NS}
        Title="보기 메뉴 실습" Width="440" Height="320">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuStatus" Header="상태 표시줄(_S)"
                          IsCheckable="True" IsChecked="True" Click="Status_Click"/>
                <MenuItem x:Name="mnuBig" Header="큰 글자(_B)"
                          IsCheckable="True" Click="Big_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom">
            <StatusBarItem>
                <TextBlock x:Name="lblCount" Text="글자 수: 0"/>
            </StatusBarItem>
            <Separator/>
            <StatusBarItem>
                <TextBlock x:Name="lblSize" Text="보통 글자 (14)"/>
            </StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="14" AcceptsReturn="True" TextWrapping="Wrap"
                 TextChanged="TxtMemo_TextChanged"/>
    </DockPanel>
</Window>`;

  const P1_STARTER = `${VIEW_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch21PracticeView
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Status_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: mnuStatus.IsChecked 가 true 면 statusBar 를 보이고(Visible),
            //         false 면 자리까지 없애기(Collapsed)
        }

        private void Big_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: mnuBig.IsChecked 가 true 면 글자 크기 24, 아니면 14
            // TODO 3: lblSize 에 "큰 글자 (24)" 또는 "보통 글자 (14)" 표시
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            // TODO 4: lblCount 에 "글자 수: n" 표시
        }
    }
}`;

  const P1_SOLUTION = `${VIEW_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch21PracticeView
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Status_Click(object sender, RoutedEventArgs e)
        {
            // 누르는 순간 IsChecked 가 이미 뒤집혀 있다
            statusBar.Visibility = mnuStatus.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }

        private void Big_Click(object sender, RoutedEventArgs e)
        {
            if (mnuBig.IsChecked)
            {
                txtMemo.FontSize = 24;
                lblSize.Text = "큰 글자 (24)";
            }
            else
            {
                txtMemo.FontSize = 14;
                lblSize.Text = "보통 글자 (14)";
            }
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            lblCount.Text = $"글자 수: {txtMemo.Text.Length}";
        }
    }
}`;

  const SHOP_XAML_TOP = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21PracticeContext.MainWindow"
        ${NS}
        Title="장보기 목록" Width="400" Height="360">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top">
            <Button DockPanel.Dock="Right" Content="추가" Width="70" Margin="6,0,0,0"
                    IsDefault="True" Click="BtnAdd_Click"/>
            <TextBox x:Name="txtItem" FontSize="14"/>
        </DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"
                   TextWrapping="Wrap" Text="항목을 고른 뒤 오른쪽 클릭해 보세요."/>`;

  const SHOP_STARTER_XAML = `${SHOP_XAML_TOP}
        <ListBox x:Name="lstItems" Margin="0,8,0,0" FontSize="14">
            <!-- TODO 1: ListBox.ContextMenu 를 만들고
                 '삭제(_D)' → Delete_Click, 구분선, '모두 지우기(_C)' → ClearAll_Click 연결 -->
        </ListBox>
    </DockPanel>
</Window>`;

  const SHOP_SOLUTION_XAML = `${SHOP_XAML_TOP}
        <ListBox x:Name="lstItems" Margin="0,8,0,0" FontSize="14">
            <ListBox.ContextMenu>
                <ContextMenu>
                    <MenuItem Header="삭제(_D)" Click="Delete_Click"/>
                    <Separator/>
                    <MenuItem Header="모두 지우기(_C)" Click="ClearAll_Click"/>
                </ContextMenu>
            </ListBox.ContextMenu>
        </ListBox>
    </DockPanel>
</Window>`;

  const P2_STARTER = `${SHOP_STARTER_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContext
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstItems.Items.Add("우유");
            lstItems.Items.Add("달걀");
            lstItems.Items.Add("식빵");
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            string text = txtItem.Text.Trim();
            if (text == "") return;
            lstItems.Items.Add(text);
            txtItem.Clear();
            txtItem.Focus();
        }

        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 고른 항목(SelectedItem)이 없으면 lblInfo 에 "먼저 항목을 고르세요." 표시
            //         있으면 목록에서 지우고 "'항목' 삭제 — 남은 n개" 표시
        }

        private void ClearAll_Click(object sender, RoutedEventArgs e)
        {
            // TODO 3: 목록이 비어 있으면 아무것도 하지 않기
            // TODO 4: MessageBox(YesNo, Warning)로 "정말 모두 지울까요?" 물어보고 Yes 일 때만 지우기
        }
    }
}`;

  const P2_SOLUTION = `${SHOP_SOLUTION_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContext
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstItems.Items.Add("우유");
            lstItems.Items.Add("달걀");
            lstItems.Items.Add("식빵");
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            string text = txtItem.Text.Trim();
            if (text == "") return;
            lstItems.Items.Add(text);
            txtItem.Clear();
            txtItem.Focus();
        }

        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            object? item = lstItems.SelectedItem;
            if (item == null)
            {
                lblInfo.Text = "먼저 항목을 고르세요.";
                return;
            }
            lstItems.Items.Remove(item);
            lblInfo.Text = $"'{item}' 삭제 — 남은 {lstItems.Items.Count}개";
        }

        private void ClearAll_Click(object sender, RoutedEventArgs e)
        {
            if (lstItems.Items.Count == 0) return;

            MessageBoxResult r = MessageBox.Show("정말 모두 지울까요?", "모두 지우기",
                MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r == MessageBoxResult.Yes)
            {
                lstItems.Items.Clear();
                lblInfo.Text = "목록을 비웠습니다.";
            }
        }
    }
}`;

  /* ======================= 21-1 슬라이드용 짧은 코드 ======================= */
  const SL_MENU = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21MenuSlide.MainWindow"
        ${NS}
        Title="메뉴" Width="400" Height="240">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" InputGestureText="Ctrl+N" Click="Item_Click"/>
                <MenuItem Header="최근 파일(_R)">
                    <MenuItem Header="일기.txt" Click="Item_Click"/>
                </MenuItem>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <TextBlock x:Name="lblInfo" Margin="16" FontSize="16" Text="메뉴를 골라 보세요"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Controls;
namespace Ch21MenuSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Item_Click(object sender, RoutedEventArgs e) { lblInfo.Text = $"{((MenuItem)sender).Header} 선택"; }
        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }
    }
}`;

  const SL_CHECK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21CheckSlide.MainWindow"
        ${NS}
        Title="보기 메뉴" Width="400" Height="260">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuStatus" Header="상태 표시줄(_S)"
                          IsCheckable="True" IsChecked="True" Click="Status_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom"><StatusBarItem Content="준비"/></StatusBar>
        <TextBox Margin="4" AcceptsReturn="True" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch21CheckSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Status_Click(object sender, RoutedEventArgs e)
        {   // 누르면 IsChecked 가 먼저 뒤집히고 Click 이 온다
            statusBar.Visibility = mnuStatus.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }
    }
}`;

  const SL_COMMAND = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21CommandSlide.MainWindow"
        ${NS}
        Title="명령 공유" Width="420" Height="260">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)"><MenuItem Header="저장(_S)" Command="{x:Static ApplicationCommands.Save}"/></MenuItem>
        </Menu>
        <ToolBar DockPanel.Dock="Top">
            <Button Content="💾 저장" Command="{x:Static ApplicationCommands.Save}"/>
        </ToolBar>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Input;
namespace Ch21CommandSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save,
                (s, e) => Title = $"저장! {txtMemo.Text.Length}글자",          // Executed
                (s, e) => e.CanExecute = txtMemo.Text.Length > 0));          // CanExecute
        }
    }
}`;

  const SL_CONTEXT = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ContextSlide.MainWindow"
        ${NS}
        Title="오른쪽 클릭 메뉴" Width="380" Height="280">
    <ListBox x:Name="lstFruits" Margin="10" FontSize="15">
        <ListBox.ContextMenu>
            <ContextMenu>
                <MenuItem Header="삭제(_D)" Click="Delete_Click"/>
                <MenuItem Header="모두 지우기(_C)" Click="Clear_Click"/>
            </ContextMenu>
        </ListBox.ContextMenu>
    </ListBox>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch21ContextSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); foreach (string f in new[] { "사과", "바나나", "체리" }) lstFruits.Items.Add(f); }
        private void Delete_Click(object sender, RoutedEventArgs e)
        {   // 고른 항목이 없으면(null) 아무것도 안 함
            object? item = lstFruits.SelectedItem; if (item != null) lstFruits.Items.Remove(item);
        }
        private void Clear_Click(object sender, RoutedEventArgs e) { lstFruits.Items.Clear(); }
    }
}`;

  /* ======================= 21-2 예제 코드 ======================= */
  const EX_MSGBOX = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21MessageBox.MainWindow"
        ${NS}
        Title="MessageBox 복습" Width="420" Height="370">
    <StackPanel Margin="14">
        <TextBlock Text="버튼 종류와 아이콘을 바꿔 가며 띄워 봅니다." Margin="0,0,0,8"/>
        <Button Content="① OK + Information — 알림" Height="32" Click="BtnInfo_Click"/>
        <Button Content="② OKCancel + Warning — 계속할까요?" Height="32" Margin="0,6,0,0" Click="BtnWarn_Click"/>
        <Button Content="③ YesNo + Question — 예 / 아니요" Height="32" Margin="0,6,0,0" Click="BtnYesNo_Click"/>
        <Button Content="④ YesNoCancel + Question — 저장할까요?" Height="32" Margin="0,6,0,0" Click="BtnSave_Click"/>
        <Button Content="⑤ OK + Error — 오류" Height="32" Margin="0,6,0,0" Click="BtnError_Click"/>
        <TextBlock x:Name="lblResult" Margin="0,12,0,0" FontSize="15" TextWrapping="Wrap"
                   Text="결과가 여기에 나옵니다."/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21MessageBox
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnInfo_Click(object sender, RoutedEventArgs e)
        {
            // 알리기만 할 때는 결과를 볼 필요가 없다
            MessageBox.Show("저장했습니다.", "알림", MessageBoxButton.OK, MessageBoxImage.Information);
            lblResult.Text = "① 확인만 있는 알림 — 결과를 쓰지 않습니다.";
        }

        private void BtnWarn_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult r = MessageBox.Show("목록을 모두 지웁니다.\\n계속할까요?", "경고",
                MessageBoxButton.OKCancel, MessageBoxImage.Warning);
            lblResult.Text = r == MessageBoxResult.OK ? "② 확인 → 지우기 진행" : "② 취소 → 아무것도 하지 않음";
        }

        private void BtnYesNo_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult r = MessageBox.Show("프로그램을 처음 쓰시나요?", "질문",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (r == MessageBoxResult.Yes)
                lblResult.Text = "③ 예 → 도움말을 먼저 보여 줍니다.";
            else
                lblResult.Text = "③ 아니요 → 바로 시작합니다.";
        }

        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            switch (r)   // 결과가 셋이면 switch 가 읽기 쉽다
            {
                case MessageBoxResult.Yes: lblResult.Text = "④ 예 → 저장하고 닫기"; break;
                case MessageBoxResult.No: lblResult.Text = "④ 아니요 → 저장하지 않고 닫기"; break;
                default: lblResult.Text = "④ 취소(또는 ✕) → 닫지 않고 계속 편집"; break;
            }
        }

        private void BtnError_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("파일을 찾을 수 없습니다.", "오류", MessageBoxButton.OK, MessageBoxImage.Error);
            lblResult.Text = "⑤ 오류 아이콘 — 문제가 생겼음을 알립니다.";
        }
    }
}`;

  const EX_MEMOFILE = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21MemoFile.MainWindow"
        ${NS}
        Title="제목 없음 - 메모장" Width="500" Height="380"
        Closing="Window_Closing">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" Command="{x:Static ApplicationCommands.New}"/>
                <MenuItem Header="열기(_O)..." Command="{x:Static ApplicationCommands.Open}"/>
                <MenuItem Header="저장(_S)" Command="{x:Static ApplicationCommands.Save}"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="{x:Static ApplicationCommands.SaveAs}"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem>
                <TextBlock x:Name="lblStatus" Text="파일 ▸ 열기 로 '연습.txt' 를 열어 보세요."/>
            </StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" TextChanged="TxtMemo_TextChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;   // CancelEventArgs
using System.IO;               // File, Path
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using Microsoft.Win32;         // OpenFileDialog, SaveFileDialog

namespace Ch21MemoFile
{
    public partial class MainWindow : Window
    {
        private const string TextFilter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";
        private string currentPath = "";   // 지금 열린 파일 ("" = 아직 한 번도 저장 안 함)
        private bool isDirty = false;      // 저장하지 않은 변경이 있나?

        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.New, New_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Open, Open_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.SaveAs, SaveAs_Executed));

            // 열기 연습용 파일을 하나 만들어 둔다 (작업 폴더)
            if (!File.Exists("연습.txt"))
                File.WriteAllText("연습.txt", "파일 ▸ 열기 로 불러온 글입니다.\\n고친 뒤 Ctrl+S 로 저장해 보세요.");
            UpdateTitle();
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            isDirty = true;
            UpdateTitle();
        }

        // ---------- 새로 만들기 ----------
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;    // "취소" 면 아무것도 하지 않는다
            txtMemo.Clear();
            currentPath = "";
            isDirty = false;
            UpdateTitle();
            lblStatus.Text = "새 문서";
        }

        // ---------- 열기: OpenFileDialog ----------
        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;

            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "메모 열기";
            dlg.Filter = TextFilter;
            if (dlg.ShowDialog() == true)                 // [열기] 를 눌렀을 때만 true
            {
                txtMemo.Text = File.ReadAllText(dlg.FileName);
                currentPath = dlg.FileName;
                isDirty = false;                          // Text 를 바꾸며 true 가 된 것을 되돌림
                UpdateTitle();
                lblStatus.Text = $"열었습니다: {Path.GetFileName(currentPath)}";
            }
        }

        // ---------- 저장 · 다른 이름으로 저장: SaveFileDialog ----------
        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemo(); }
        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemoAs(); }

        // 저장에 성공하면 true, 취소하면 false
        private bool SaveMemo()
        {
            if (currentPath == "") return SaveMemoAs();   // 처음 저장 → 이름부터 묻기

            File.WriteAllText(currentPath, txtMemo.Text);
            isDirty = false;
            UpdateTitle();
            lblStatus.Text = $"저장했습니다: {Path.GetFileName(currentPath)} ({txtMemo.Text.Length}글자)";
            return true;
        }

        private bool SaveMemoAs()
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = TextFilter;
            dlg.DefaultExt = ".txt";                      // 확장자를 안 쓰면 .txt 를 붙여 준다
            dlg.FileName = currentPath == "" ? "제목 없음.txt" : Path.GetFileName(currentPath);
            if (dlg.ShowDialog() != true) return false;  // 취소

            currentPath = dlg.FileName;
            return SaveMemo();
        }

        // 바뀐 내용이 있으면 물어본다. 계속 진행해도 되면 true
        private bool ConfirmSave()
        {
            if (!isDirty) return true;
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Cancel) return false;
            if (r == MessageBoxResult.Yes) return SaveMemo();   // 저장 대화상자에서 취소하면 false
            return true;                                        // No: 저장하지 않고 진행
        }

        // ---------- 닫기 전에 확인 ----------
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!ConfirmSave()) e.Cancel = true;   // 닫기 취소 → 창이 그대로 남는다
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();   // Close() 도 Closing 을 거친다
        }

        private void UpdateTitle()
        {
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            Title = (isDirty ? "*" : "") + name + " - 메모장";
        }
    }
}`;

  const EX_MODAL = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ModalModeless.MainWindow"
        ${NS}
        Title="모달 vs 모덜리스" Width="460" Height="340">
    <StackPanel Margin="14">
        <Button Content="모달로 열기 — ShowDialog()" Height="34" Click="BtnModal_Click"/>
        <Button Content="모덜리스로 열기 — Show()" Height="34" Margin="0,8,0,0" Click="BtnModeless_Click"/>
        <TextBlock Text="실행 기록" FontWeight="Bold" Margin="0,12,0,4"/>
        <ListBox x:Name="lstLog" Height="170"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace Ch21ModalModeless
{
    public partial class MainWindow : Window
    {
        private int no = 0;   // 연 창 번호

        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnModal_Click(object sender, RoutedEventArgs e)
        {
            no++;
            ChildWindow w = new ChildWindow($"모달 창 #{no}", "이 창을 닫기 전에는 주 창을 쓸 수 없습니다.");
            w.Owner = this;                         // 주인 창 = 나
            Log($"#{no} ShowDialog() 호출 — 여기서 멈춤");
            w.ShowDialog();                         // 창이 닫힐 때까지 다음 줄로 가지 않는다
            Log($"#{no} 창이 닫힌 뒤에야 이 줄이 실행됨");
        }

        private void BtnModeless_Click(object sender, RoutedEventArgs e)
        {
            no++;
            int myNo = no;                          // 람다가 기억할 번호
            ChildWindow w = new ChildWindow($"모덜리스 창 #{no}", "주 창과 이 창을 오가며 쓸 수 있습니다.");
            w.Owner = this;
            w.Closed += (s, args) => Log($"#{myNo} 모덜리스 창이 닫힘 (Closed 이벤트)");
            w.Show();                               // 창을 띄우고 바로 돌아온다
            Log($"#{no} Show() 는 바로 돌아옴 — 주 창도 계속 사용 가능");
        }

        private void Log(string message)
        {
            lstLog.Items.Add($"{DateTime.Now:HH:mm:ss}  {message}");
        }
    }
}
// ===== File: ChildWindow.xaml =====
<Window x:Class="Ch21ModalModeless.ChildWindow"
        ${NS}
        Title="자식 창" Width="300" Height="180"
        WindowStartupLocation="CenterOwner">
    <StackPanel Margin="14">
        <TextBlock x:Name="lblMessage" TextWrapping="Wrap" FontSize="14"/>
        <Button Content="닫기" Width="80" Margin="0,16,0,0" HorizontalAlignment="Right"
                Click="BtnClose_Click"/>
    </StackPanel>
</Window>
// ===== File: ChildWindow.xaml.cs =====
using System.Windows;

namespace Ch21ModalModeless
{
    public partial class ChildWindow : Window
    {
        // 생성자 매개변수로 제목과 안내 글을 받는다
        public ChildWindow(string title, string message)
        {
            InitializeComponent();
            Title = title;
            lblMessage.Text = message;
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`;

  const EX_INPUT = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21InputDialog.MainWindow"
        ${NS}
        Title="할 일 목록 — 입력 대화상자" Width="420" Height="340">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Right" Width="100" Margin="8,0,0,0">
            <Button Content="추가(_A)..." Height="30" Click="BtnAdd_Click"/>
            <Button Content="고치기(_E)..." Height="30" Margin="0,6,0,0" Click="BtnEdit_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"
                   TextWrapping="Wrap" Text="추가 · 고치기를 누르면 입력 대화상자가 열립니다."/>
        <ListBox x:Name="lstTodo" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21InputDialog
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstTodo.Items.Add("WPF 21장 복습");
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            InputDialog dlg = new InputDialog("새 할 일을 입력하세요.", "");   // ① 생성자로 질문 전달
            dlg.Owner = this;                                                   // ② 주인 창 = 나

            if (dlg.ShowDialog() == true)                                       // ③ 닫힐 때까지 기다림
            {
                lstTodo.Items.Add(dlg.Answer);                                  // ④ 속성으로 답 받기
                lblInfo.Text = $"'{dlg.Answer}' 을(를) 추가했습니다.";
            }
            else
            {
                lblInfo.Text = "추가를 취소했습니다.";
            }
        }

        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            int i = lstTodo.SelectedIndex;
            if (i < 0)
            {
                MessageBox.Show("고칠 항목을 먼저 고르세요.", "고치기");
                return;
            }

            // 지금 값을 "기본값" 으로 넘겨 준다
            InputDialog dlg = new InputDialog("할 일을 고치세요.", $"{lstTodo.Items[i]}");
            dlg.Owner = this;
            if (dlg.ShowDialog() == true)
            {
                lstTodo.Items.RemoveAt(i);
                lstTodo.Items.Insert(i, dlg.Answer);
                lblInfo.Text = "고쳤습니다.";
            }
        }
    }
}
// ===== File: InputDialog.xaml =====
<Window x:Class="Ch21InputDialog.InputDialog"
        ${NS}
        Title="입력" Width="340" Height="180"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False"
        Loaded="Window_Loaded">
    <StackPanel Margin="14">
        <TextBlock x:Name="lblQuestion" Text="질문" Margin="0,0,0,6"/>
        <TextBox x:Name="txtAnswer" FontSize="14"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,14,0,0">
            <!-- IsDefault: Enter 키 = 이 버튼 / IsCancel: Esc 키 = 이 버튼 (DialogResult = false 로 닫힘) -->
            <Button Content="확인" Width="80" IsDefault="True" Click="BtnOk_Click"/>
            <Button Content="취소" Width="80" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: InputDialog.xaml.cs =====
using System.Windows;

namespace Ch21InputDialog
{
    public partial class InputDialog : Window
    {
        // 결과를 돌려주는 속성 — 밖에서는 읽기만
        public string Answer { get; private set; } = "";

        public InputDialog(string question, string defaultAnswer)
        {
            InitializeComponent();
            lblQuestion.Text = question;
            txtAnswer.Text = defaultAnswer;
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            txtAnswer.Focus();       // 바로 입력할 수 있게
            txtAnswer.SelectAll();   // 기본값은 선택해 두면 덮어쓰기 쉽다
        }

        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            if (txtAnswer.Text.Trim() == "")
            {
                MessageBox.Show("내용을 입력하세요.", "입력");
                txtAnswer.Focus();
                return;                  // DialogResult 를 정하지 않았으므로 창은 그대로
            }
            Answer = txtAnswer.Text.Trim();
            DialogResult = true;         // 모달 창은 DialogResult 를 정하면 저절로 닫힌다
        }
    }
}`;

  const EX_PASS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21PassData.MainWindow"
        ${NS}
        Title="창 사이 데이터 전달" Width="440" Height="360">
    <DockPanel Margin="12">
        <DockPanel DockPanel.Dock="Top">
            <Button DockPanel.Dock="Right" Content="대화 창 열기" Width="110" Margin="8,0,0,0"
                    Click="BtnOpen_Click"/>
            <TextBlock Text="이름:" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <TextBox x:Name="txtName" Text="민수" FontSize="14"/>
        </DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Foreground="Gray" Margin="0,6,0,0"
                   TextWrapping="Wrap" Text="이름을 바꿔 가며 대화 창을 여러 개 열어 보세요."/>
        <TextBlock DockPanel.Dock="Top" Text="받은 메시지" FontWeight="Bold" Margin="0,10,0,4"/>
        <ListBox x:Name="lstMessages" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PassData
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnOpen_Click(object sender, RoutedEventArgs e)
        {
            string name = txtName.Text.Trim();
            if (name == "") name = "손님";

            ChatWindow w = new ChatWindow(name);          // ① 생성자 매개변수: 주 창 → 새 창
            w.Owner = this;
            w.MessageSent += ChatWindow_MessageSent;       // ② 이벤트 구독: 새 창 → 주 창 (열려 있는 동안)
            w.Closed += (s, args) =>                       // ③ 닫힌 뒤 속성 읽기: 새 창 → 주 창
                lblInfo.Text = $"{w.UserName} 님의 창이 닫혔습니다. 보낸 메시지 {w.SentCount}개";
            w.Show();                                      // 모덜리스: 여러 개를 함께 띄울 수 있다
            lblInfo.Text = $"{name} 님의 대화 창을 열었습니다.";
        }

        // 새 창이 MessageSent 이벤트를 일으키면 여기가 실행된다
        private void ChatWindow_MessageSent(object? sender, string text)
        {
            lstMessages.Items.Add(text);
        }
    }
}
// ===== File: ChatWindow.xaml =====
<Window x:Class="Ch21PassData.ChatWindow"
        ${NS}
        Title="대화" Width="320" Height="190"
        WindowStartupLocation="CenterOwner">
    <StackPanel Margin="12">
        <TextBlock x:Name="lblHello" FontSize="14" Margin="0,0,0,6"/>
        <DockPanel>
            <Button DockPanel.Dock="Right" Content="보내기" Width="70" Margin="6,0,0,0"
                    IsDefault="True" Click="BtnSend_Click"/>
            <TextBox x:Name="txtMessage" FontSize="14"/>
        </DockPanel>
        <Button Content="닫기" Width="70" HorizontalAlignment="Right" Margin="0,12,0,0"
                Click="BtnClose_Click"/>
    </StackPanel>
</Window>
// ===== File: ChatWindow.xaml.cs =====
using System;
using System.Windows;

namespace Ch21PassData
{
    public partial class ChatWindow : Window
    {
        public event EventHandler<string>? MessageSent;    // 주 창에 알릴 이벤트 (11장)
        public string UserName { get; }                     // 생성자에서 받은 이름
        public int SentCount { get; private set; } = 0;     // 보낸 개수 — 밖에서는 읽기만

        public ChatWindow(string userName)
        {
            InitializeComponent();
            UserName = userName;
            Title = $"{userName} 님의 대화 창";
            lblHello.Text = $"{userName} 님, 메시지를 쓰고 Enter!";
        }

        private void BtnSend_Click(object sender, RoutedEventArgs e)
        {
            string text = txtMessage.Text.Trim();
            if (text == "") return;

            SentCount++;
            MessageSent?.Invoke(this, $"{UserName}: {text}");   // 이벤트 발생 → 주 창의 처리기 실행
            txtMessage.Clear();
            txtMessage.Focus();
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`;

  const EX_SETTINGS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21Settings.MainWindow"
        ${NS}
        Title="설정 창" Width="440" Height="320">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="도구(_T)">
                <MenuItem Header="글꼴 설정(_F)..." Click="Settings_Click"/>
            </MenuItem>
        </Menu>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="8,4" Foreground="Gray"
                   TextWrapping="Wrap" Text="도구 ▸ 글꼴 설정... 을 눌러 보세요."/>
        <TextBox x:Name="txtMemo" Margin="8,4" FontSize="14" AcceptsReturn="True" TextWrapping="Wrap"
                 Text="설정 창에서 글자 크기 · 굵게 · 자동 줄 바꿈을 바꾸면 이 글에 적용됩니다. 취소를 누르면 아무것도 바뀌지 않습니다."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21Settings
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Settings_Click(object sender, RoutedEventArgs e)
        {
            SettingsWindow dlg = new SettingsWindow();
            dlg.Owner = this;

            // ① 지금 설정을 속성으로 넘겨 준다 (주 창 → 설정 창)
            dlg.SelectedFontSize = txtMemo.FontSize;
            dlg.IsBold = txtMemo.FontWeight == FontWeights.Bold;
            dlg.WrapText = txtMemo.TextWrapping == TextWrapping.Wrap;

            if (dlg.ShowDialog() == true)
            {
                // ② 확인을 눌렀을 때만 새 설정을 읽어 적용한다 (설정 창 → 주 창)
                txtMemo.FontSize = dlg.SelectedFontSize;
                txtMemo.FontWeight = dlg.IsBold ? FontWeights.Bold : FontWeights.Normal;
                txtMemo.TextWrapping = dlg.WrapText ? TextWrapping.Wrap : TextWrapping.NoWrap;
                lblInfo.Text = $"적용: 크기 {dlg.SelectedFontSize}, 굵게 {dlg.IsBold}, 줄 바꿈 {dlg.WrapText}";
            }
            else
            {
                lblInfo.Text = "취소 — 설정을 바꾸지 않았습니다.";
            }
        }
    }
}
// ===== File: SettingsWindow.xaml =====
<Window x:Class="Ch21Settings.SettingsWindow"
        ${NS}
        Title="글꼴 설정" Width="300" Height="260"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False"
        Loaded="Window_Loaded">
    <StackPanel Margin="14">
        <TextBlock Text="글자 크기"/>
        <ComboBox x:Name="cboSize" Margin="0,4,0,12"/>
        <CheckBox x:Name="chkBold" Content="굵게(_B)"/>
        <CheckBox x:Name="chkWrap" Content="자동 줄 바꿈(_W)" Margin="0,8,0,0"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,20,0,0">
            <Button Content="확인" Width="75" IsDefault="True" Click="BtnOk_Click"/>
            <Button Content="취소" Width="75" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: SettingsWindow.xaml.cs =====
using System;
using System.Windows;

namespace Ch21Settings
{
    public partial class SettingsWindow : Window
    {
        private static readonly double[] Sizes = { 12, 14, 16, 20, 24 };

        // 주고받을 설정 값들 — 주 창이 넣고, 주 창이 읽는다
        public double SelectedFontSize { get; set; } = 14;
        public bool IsBold { get; set; }
        public bool WrapText { get; set; }

        public SettingsWindow()
        {
            InitializeComponent();
            foreach (double s in Sizes) cboSize.Items.Add(s);
        }

        // 창이 나타날 때: 주 창이 넣어 준 속성 값을 화면에 반영
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            int index = Array.IndexOf(Sizes, SelectedFontSize);
            cboSize.SelectedIndex = index >= 0 ? index : 1;
            chkBold.IsChecked = IsBold;
            chkWrap.IsChecked = WrapText;
        }

        // 확인: 화면의 값을 속성에 담고 DialogResult = true
        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            SelectedFontSize = Sizes[cboSize.SelectedIndex];
            IsBold = chkBold.IsChecked == true;
            WrapText = chkWrap.IsChecked == true;
            DialogResult = true;
        }
    }
}`;

  /* ======================= 21-2 실습 ======================= */
  const CONTACT_MAIN_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21PracticeContact.MainWindow"
        ${NS}
        Title="연락처" Width="400" Height="340">
    <DockPanel Margin="10">
        <Button DockPanel.Dock="Top" Content="연락처 추가(_A)..." Height="32" Click="BtnAdd_Click"/>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"
                   Text="연락처 0명"/>
        <ListBox x:Name="lstContacts" Margin="0,8,0,0" FontSize="14"/>
    </DockPanel>
</Window>`;

  const CONTACT_DLG_XAML = `// ===== File: ContactDialog.xaml =====
<Window x:Class="Ch21PracticeContact.ContactDialog"
        ${NS}
        Title="연락처 추가" Width="320" Height="240"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False">
    <StackPanel Margin="14">
        <TextBlock Text="이름"/>
        <TextBox x:Name="txtName" FontSize="14" Margin="0,4,0,8"/>
        <TextBlock Text="전화번호"/>
        <TextBox x:Name="txtPhone" FontSize="14" Margin="0,4,0,0"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,14,0,0">
            <Button Content="확인" Width="75" IsDefault="True" Click="BtnOk_Click"/>
            <Button Content="취소" Width="75" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
    </StackPanel>
</Window>`;

  const P3_STARTER = `${CONTACT_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContact
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: ContactDialog 를 만들고 Owner = this
            // TODO 5: ShowDialog() == true 이면 "이름 (전화번호)" 를 목록에 추가하고
            //         lblInfo 에 "연락처 n명" 표시
        }
    }
}
${CONTACT_DLG_XAML}
// ===== File: ContactDialog.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContact
{
    public partial class ContactDialog : Window
    {
        // TODO 1: 결과를 돌려줄 속성 두 개 — ContactName, Phone (밖에서는 읽기만, 기본값 "")

        public ContactDialog()
        {
            InitializeComponent();
        }

        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 이름이 비어 있으면 MessageBox 로 알리고 창을 닫지 않기 (return)
            // TODO 3: 속성에 값을 담고 DialogResult = true
        }
    }
}`;

  const P3_SOLUTION = `${CONTACT_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContact
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            ContactDialog dlg = new ContactDialog();
            dlg.Owner = this;
            if (dlg.ShowDialog() == true)
            {
                string phone = dlg.Phone == "" ? "번호 없음" : dlg.Phone;
                lstContacts.Items.Add($"{dlg.ContactName} ({phone})");
                lblInfo.Text = $"연락처 {lstContacts.Items.Count}명";
            }
        }
    }
}
${CONTACT_DLG_XAML}
// ===== File: ContactDialog.xaml.cs =====
using System.Windows;

namespace Ch21PracticeContact
{
    public partial class ContactDialog : Window
    {
        public string ContactName { get; private set; } = "";
        public string Phone { get; private set; } = "";

        public ContactDialog()
        {
            InitializeComponent();
        }

        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            if (txtName.Text.Trim() == "")
            {
                MessageBox.Show("이름을 입력하세요.", "연락처 추가", MessageBoxButton.OK, MessageBoxImage.Warning);
                txtName.Focus();
                return;                 // 창을 닫지 않는다
            }
            ContactName = txtName.Text.Trim();
            Phone = txtPhone.Text.Trim();
            DialogResult = true;        // 닫히면서 ShowDialog() 가 true 를 돌려준다
        }
    }
}`;

  const COLOR_MAIN_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21PracticeColor.MainWindow"
        ${NS}
        Title="배경색 바꾸기" Width="400" Height="300">
    <StackPanel Margin="16">
        <TextBlock x:Name="lblInfo" FontSize="16" Text="현재 배경: 흰색" Margin="0,0,0,12"/>
        <Button Content="배경색 설정(_C)..." Width="160" Height="32" HorizontalAlignment="Left"
                Click="BtnColor_Click"/>
    </StackPanel>
</Window>`;

  const COLOR_DLG_XAML = `// ===== File: ColorWindow.xaml =====
<Window x:Class="Ch21PracticeColor.ColorWindow"
        ${NS}
        Title="배경색 고르기" Width="300" Height="300"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False">
    <DockPanel Margin="12">
        <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,10,0,0">
            <Button Content="확인" Width="75" IsDefault="True" Click="BtnOk_Click"/>
            <Button Content="취소" Width="75" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
        <!-- 미리 보기 -->
        <Border x:Name="preview" DockPanel.Dock="Right" Width="80" Margin="10,0,0,0"
                BorderBrush="Gray" BorderThickness="1" Background="White"/>
        <ListBox x:Name="lstColors" FontSize="14" SelectionChanged="LstColors_SelectionChanged"/>
    </DockPanel>
</Window>`;

  const P4_STARTER = `${COLOR_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeColor
{
    public partial class MainWindow : Window
    {
        // TODO 0: 지금 배경색 번호를 기억할 필드 colorIndex (처음 0 = 흰색)

        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnColor_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: new ColorWindow(colorIndex) 로 만들고 Owner = this
            // TODO 5: ShowDialog() == true 이면
            //         Background = dlg.SelectedBrush; colorIndex 기억; lblInfo 에 "현재 배경: 색 이름"
        }
    }
}
${COLOR_DLG_XAML}
// ===== File: ColorWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch21PracticeColor
{
    public partial class ColorWindow : Window
    {
        private readonly string[] names = { "흰색", "연노랑", "하늘색", "연두색", "분홍색" };
        private readonly Brush[] brushes = { Brushes.White, Brushes.LightYellow, Brushes.LightSkyBlue, Brushes.LightGreen, Brushes.Pink };

        // TODO 1: 결과 속성 세 개 (읽기 전용 식 본문 속성 =>)
        //   SelectedIndex → lstColors.SelectedIndex
        //   SelectedName  → names[SelectedIndex]
        //   SelectedBrush → brushes[SelectedIndex]

        public ColorWindow(int currentIndex)
        {
            InitializeComponent();
            foreach (string n in names) lstColors.Items.Add(n);
            lstColors.SelectedIndex = currentIndex;   // 지금 색을 미리 골라 둔다
        }

        private void LstColors_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // TODO 2: 고른 색으로 preview.Background 바꾸기 (고른 것이 없으면 그냥 return)
        }

        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            // TODO 3: DialogResult = true
        }
    }
}`;

  const P4_SOLUTION = `${COLOR_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch21PracticeColor
{
    public partial class MainWindow : Window
    {
        private int colorIndex = 0;   // 지금 배경색 번호 (0 = 흰색)

        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnColor_Click(object sender, RoutedEventArgs e)
        {
            ColorWindow dlg = new ColorWindow(colorIndex);   // 지금 색을 넘겨 준다
            dlg.Owner = this;
            if (dlg.ShowDialog() == true)
            {
                Background = dlg.SelectedBrush;              // 주 창(this)의 배경
                colorIndex = dlg.SelectedIndex;              // 다음에 열 때를 위해 기억
                lblInfo.Text = $"현재 배경: {dlg.SelectedName}";
            }
        }
    }
}
${COLOR_DLG_XAML}
// ===== File: ColorWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch21PracticeColor
{
    public partial class ColorWindow : Window
    {
        private readonly string[] names = { "흰색", "연노랑", "하늘색", "연두색", "분홍색" };
        private readonly Brush[] brushes = { Brushes.White, Brushes.LightYellow, Brushes.LightSkyBlue, Brushes.LightGreen, Brushes.Pink };

        // 결과 속성: 목록에서 고른 번호로 계산해 돌려준다
        public int SelectedIndex => lstColors.SelectedIndex;
        public string SelectedName => names[SelectedIndex];
        public Brush SelectedBrush => brushes[SelectedIndex];

        public ColorWindow(int currentIndex)
        {
            InitializeComponent();
            foreach (string n in names) lstColors.Items.Add(n);
            lstColors.SelectedIndex = currentIndex;   // 지금 색을 미리 골라 둔다
        }

        private void LstColors_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lstColors.SelectedIndex < 0) return;
            preview.Background = brushes[lstColors.SelectedIndex];   // 미리 보기
        }

        private void BtnOk_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }
    }
}`;

  /* ======================= 21-2 슬라이드용 짧은 코드 ======================= */
  const SL_MSGBOX = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21MsgSlide.MainWindow"
        ${NS}
        Title="MessageBox" Width="360" Height="200">
    <StackPanel Margin="14">
        <Button Content="닫기..." Height="32" Click="BtnClose_Click"/>
        <TextBlock x:Name="lblResult" Margin="0,12,0,0" FontSize="15" Text="결과:"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch21MsgSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Yes) lblResult.Text = "결과: 예 → 저장하고 닫기";
            else if (r == MessageBoxResult.No) lblResult.Text = "결과: 아니요 → 그냥 닫기";
            else lblResult.Text = "결과: 취소 → 계속 편집";
        }
    }
}`;

  const SL_OPEN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21OpenSlide.MainWindow"
        ${NS}
        Title="파일 열기" Width="420" Height="280">
    <DockPanel Margin="8">
        <Button DockPanel.Dock="Top" Content="열기..." Height="30" Click="BtnOpen_Click"/>
        <TextBox x:Name="txtMemo" Margin="0,8,0,0" AcceptsReturn="True" TextWrapping="Wrap"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.IO; using System.Windows;
using Microsoft.Win32;
namespace Ch21OpenSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            File.WriteAllText("인사.txt", "안녕하세요! 파일에서 읽은 글입니다.");   // 연습용 파일
        }
        private void BtnOpen_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";
            if (dlg.ShowDialog() == true) txtMemo.Text = File.ReadAllText(dlg.FileName);
        }
    }
}`;

  const SL_MODAL = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ModalSlide.MainWindow"
        ${NS}
        Title="모달 vs 모덜리스" Width="400" Height="280">
    <StackPanel Margin="12">
        <Button Content="ShowDialog() — 모달" Height="30" Click="BtnModal_Click"/>
        <Button Content="Show() — 모덜리스" Height="30" Margin="0,6,0,0" Click="BtnModeless_Click"/>
        <ListBox x:Name="lstLog" Height="140" Margin="0,8,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch21ModalSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void BtnModal_Click(object sender, RoutedEventArgs e) { Open(true); }
        private void BtnModeless_Click(object sender, RoutedEventArgs e) { Open(false); }
        private void Open(bool modal)
        {
            var w = new Window { Title = modal ? "모달" : "모덜리스", Width = 260, Height = 150, Owner = this };
            if (modal) w.ShowDialog();   // 닫을 때까지 여기서 멈춤
            else w.Show();               // 띄우고 바로 돌아옴
            lstLog.Items.Add(modal ? "모달: 창을 닫은 뒤 실행" : "모덜리스: 바로 실행");
        }
    }
}`;

  const SL_CLOSING = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch21ClosingSlide.MainWindow"
        ${NS}
        Title="닫기 전에 확인" Width="380" Height="240" Closing="Window_Closing">
    <TextBox x:Name="txtMemo" Margin="10" AcceptsReturn="True" TextChanged="TxtMemo_TextChanged"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;
namespace Ch21ClosingSlide
{
    public partial class MainWindow : Window
    {
        private bool isDirty = false;
        public MainWindow() { InitializeComponent(); }
        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e) { isDirty = true; }
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!isDirty) return;
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Cancel) e.Cancel = true;          // 닫기 취소
            else if (r == MessageBoxResult.Yes) File.WriteAllText("메모.txt", txtMemo.Text);
        }
    }
}`;

  CS_COURSE.addChapter({
    id: 'ch21',
    no: '21',
    title: '메뉴 · 대화상자 · 다중 창',
    subtitle: 'Menu · ToolBar · StatusBar · ContextMenu · Dialogs · Multiple Windows',
    summary: '메뉴 막대(Menu · MenuItem), 도구 모음(ToolBar), 상태 표시줄(StatusBar), 오른쪽 클릭 메뉴(ContextMenu)로 전형적인 윈도우 앱 화면을 만들고, 명령(Command)으로 메뉴 · 버튼 · 단축키를 하나로 묶습니다. 이어서 MessageBox, 파일 열기 · 저장 대화상자(OpenFileDialog · SaveFileDialog)로 메모장을 완성하고, 직접 만든 대화상자 창과 여러 창을 모달(ShowDialog) · 모덜리스(Show)로 띄워 창 사이에 데이터를 주고받는 방법을 배웁니다.',
    goals: [
      'Menu · MenuItem 으로 액세스 키 · 하위 메뉴 · 구분선 · 체크 항목이 있는 메뉴를 만들 수 있다',
      'ApplicationCommands 와 CommandBinding 으로 메뉴 · 도구 모음 버튼 · 단축키가 같은 명령을 쓰게 할 수 있다',
      'ToolBarTray · ToolBar · StatusBar · ContextMenu 로 윈도우 앱의 화면을 구성할 수 있다',
      'MessageBox 의 버튼 · 아이콘 · 결과를 골라 쓰고, OpenFileDialog · SaveFileDialog 로 파일을 열고 저장할 수 있다',
      '확인 · 취소 버튼(IsDefault · IsCancel)과 DialogResult 로 사용자 정의 대화상자를 만들 수 있다',
      '모달(ShowDialog)과 모덜리스(Show)의 차이를 설명하고 Owner · CenterOwner 를 설정할 수 있다',
      '생성자 매개변수 · 속성 · 이벤트로 창 사이에 데이터를 주고받고, Closing 에서 저장 여부를 확인할 수 있다'
    ],
    sections: [
      /* ===================== ch21-1 ===================== */
      {
        id: 'ch21-1',
        title: '메뉴 · 도구 모음 · 상태 표시줄 · 컨텍스트 메뉴',
        minutes: 50,
        goals: [
          '메뉴 막대 · 도구 모음 · 작업 영역 · 상태 표시줄로 이루어진 화면을 DockPanel 로 배치할 수 있다',
          'MenuItem 의 Header(액세스 키) · 하위 메뉴 · Separator · Click · InputGestureText 를 쓸 수 있다',
          'IsCheckable · IsChecked 로 보기 옵션을 켜고 끌 수 있다',
          'Command 로 메뉴 항목과 도구 모음 버튼이 같은 명령을 공유하게 할 수 있다',
          'StatusBar 에 상태를 표시하고, ContextMenu 로 오른쪽 클릭 메뉴를 만들 수 있다'
        ],
        flow: [['도입: 윈도우 앱의 화면 구성', 5], ['Menu · MenuItem · 체크 메뉴', 15], ['명령 · 도구 모음 · 상태 표시줄', 12], ['ContextMenu · 메모장 틀', 8], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '윈도우 앱의 전형적인 화면' },
          { type: 'p', html: '메모장, 그림판, Visual Studio 처럼 우리가 매일 쓰는 윈도우 프로그램은 거의 같은 뼈대를 가지고 있습니다. 맨 위에 <b>메뉴 막대(menu bar)</b>, 그 아래 자주 쓰는 기능을 버튼으로 모은 <b>도구 모음(toolbar)</b>, 가운데 넓은 <b>작업 영역</b>, 맨 아래 지금 상태를 알려 주는 <b>상태 표시줄(status bar)</b>이 있습니다. 작업 영역에서 마우스 오른쪽 버튼을 누르면 그 자리에 맞는 <b>컨텍스트 메뉴(context menu, 오른쪽 클릭 메뉴)</b>가 뜹니다.' },
          { type: 'p', html: 'WPF 에는 이 부품들이 모두 컨트롤로 준비되어 있습니다. 배치는 15장에서 배운 <code>DockPanel</code> 이 딱 맞습니다. 위에 붙일 것(<code>Top</code>)과 아래에 붙일 것(<code>Bottom</code>)을 먼저 적고, <b>마지막 자식</b>이 남은 공간을 모두 차지하게 하면 됩니다.' },
          { type: 'figure', html: SVG_LAYOUT, caption: '윈도우 앱의 화면 구성 — XAML 에는 ① Menu → ② ToolBarTray → ③ StatusBar → ④ TextBox 순서로 적는다 (마지막이 남은 공간)' },
          { type: 'table', head: ['부품', 'WPF 컨트롤', 'DockPanel 에서'], rows: [
            ['메뉴 막대', '<code>Menu</code> + <code>MenuItem</code>', '<code>DockPanel.Dock="Top"</code> — 맨 먼저'],
            ['도구 모음', '<code>ToolBarTray</code> + <code>ToolBar</code>', '<code>DockPanel.Dock="Top"</code> — 메뉴 다음'],
            ['상태 표시줄', '<code>StatusBar</code> + <code>StatusBarItem</code>', '<code>DockPanel.Dock="Bottom"</code> — 작업 영역보다 <b>먼저</b>'],
            ['작업 영역', '<code>TextBox</code>, <code>Canvas</code>, <code>ListBox</code> …', 'Dock 없음 — <b>마지막 자식</b>'],
            ['오른쪽 클릭 메뉴', '<code>ContextMenu</code> + <code>MenuItem</code>', '배치하지 않음 — 컨트롤의 <code>ContextMenu</code> 속성에 넣는다']
          ], caption: '윈도우 앱 화면 = DockPanel 하나로 만든다' },

          { type: 'h', text: 'Menu 와 MenuItem' },
          { type: 'p', html: '<code>Menu</code> 는 메뉴 막대 그 자체이고, 그 안의 항목 하나하나가 <code>MenuItem</code> 입니다. 맨 위 <code>MenuItem</code>(파일, 편집 …)을 누르면 안에 넣어 둔 <code>MenuItem</code> 들이 아래로 펼쳐집니다. <code>MenuItem</code> 안에 <code>MenuItem</code> 을 또 넣으면 옆으로 펼쳐지는 <b>하위 메뉴(submenu)</b>가 됩니다. 즉 <b>태그를 중첩한 모양이 곧 메뉴 구조</b>입니다. 항목 사이의 가로줄은 <code>&lt;Separator/&gt;</code> 입니다.' },
          { type: 'figure', html: SVG_MENU, caption: '펼친 메뉴의 구성 요소 — 모두 MenuItem 의 속성 또는 중첩으로 만든다' },
          { type: 'table', head: ['속성 · 이벤트', '뜻', '예'], rows: [
            ['<code>Header</code>', '메뉴에 보이는 글자. <code>_</code> 바로 뒤 글자에 밑줄이 생기고 <b>액세스 키(access key)</b>가 된다', '<code>Header="파일(_F)"</code> → <kbd>Alt</kbd>+<kbd>F</kbd> 로 열림'],
            ['<code>Click</code>', '항목을 고르면 발생하는 이벤트 (<code>RoutedEventArgs</code>)', '<code>Click="Open_Click"</code>'],
            ['<code>InputGestureText</code>', '오른쪽에 단축키 <b>글자만</b> 표시 (동작은 따로 연결해야 함)', '<code>InputGestureText="Ctrl+O"</code>'],
            ['<code>IsEnabled</code>', '<code>False</code> 면 회색 · 고를 수 없음', '붙여넣을 것이 없을 때'],
            ['<code>IsCheckable</code> · <code>IsChecked</code>', '누를 때마다 ✓ 가 켜졌다 꺼졌다 하는 항목', '보기 ▸ 상태 표시줄'],
            ['<code>Command</code>', '명령 연결 — 단축키 표시 · 실행 · 켜고 끄기가 자동', '<code>Command="{x:Static ApplicationCommands.Save}"</code>']
          ], caption: 'MenuItem 의 주요 멤버' },
          { type: 'code', title: '예제 21-1. 메뉴 기본 — 액세스 키 · 하위 메뉴 · 구분선', code: EX_MENU, desc: '<code>파일</code> · <code>편집</code> · <code>도움말</code> 세 메뉴를 만들었습니다. <code>최근 파일</code> 처럼 <code>MenuItem</code> 안에 <code>MenuItem</code> 을 넣으면 ▸ 표시와 함께 하위 메뉴가 생깁니다. 여러 항목이 <code>MenuItem_Click</code> 처리기 하나를 함께 쓰고, <code>(MenuItem)sender</code> 로 어느 항목인지 알아냅니다(17장의 “처리기 하나로 여러 컨트롤”). <code>$"{item.Header}"</code> 로 <code>Header</code>(<code>object</code>)를 문자열로 바꾼 뒤 <code>Replace("_", "")</code> 로 밑줄 표시용 <code>_</code> 를 뺐습니다. <code>붙여넣기</code> 는 <code>IsEnabled="False"</code> 라 회색으로 보이고 고를 수 없습니다. 오른쪽의 <code>Ctrl+X</code> 같은 글자는 <code>InputGestureText</code> 로 <b>보여 주기만</b> 한 것이라, 실제로 <kbd>Ctrl</kbd>+<kbd>X</kbd> 를 눌러도 이 메뉴가 실행되지는 않습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 메뉴 만들기', html: '<ul><li>도구 상자에서 <b>Menu</b> 를 끌어다 놓을 수도 있지만, 메뉴는 중첩 구조라 <b>XAML 을 직접 쓰는 것</b>이 훨씬 빠르고 정확합니다. <code>&lt;MenuItem</code> 을 입력하면 IntelliSense 가 속성을 보여 줍니다.</li><li>속성 창에서 Menu 를 고른 뒤 <b>Items</b> 옆의 <b>…</b> 단추를 누르면 컬렉션 편집기로 항목을 추가 · 순서 변경할 수도 있습니다.</li><li><code>Click="</code> 까지 쓰고 <b>&lt;새 이벤트 처리기&gt;</b> 를 고르면 코드 비하인드에 빈 처리기가 만들어집니다(17장).</li><li>디자이너에서는 메뉴가 펼쳐지지 않습니다. <kbd>F5</kbd> 로 실행해서 확인하세요.</li></ul>' },

          { type: 'h', text: '켜고 끄는 메뉴 — IsCheckable' },
          { type: 'p', html: '“보기 ▸ 상태 표시줄” 처럼 <b>켜짐 / 꺼짐</b> 두 상태가 있는 메뉴는 <code>IsCheckable="True"</code> 로 만듭니다. 누를 때마다 WPF 가 <code>IsChecked</code> 를 <b>먼저</b> 뒤집어 ✓ 를 붙였다 떼고, 그다음에 <code>Click</code> 이벤트를 보냅니다. 그래서 <code>Click</code> 처리기에서는 <code>IsChecked</code> 를 읽기만 하면 <b>새 상태</b>를 알 수 있습니다. 처음 상태는 <code>IsChecked="True"</code> 로 정합니다.' },
          { type: 'code', title: '예제 21-2. 보기 메뉴 — 자동 줄 바꿈 · 상태 표시줄 · 글자 크기', code: EX_CHECK, desc: '<code>자동 줄 바꿈</code> · <code>상태 표시줄</code> 은 서로 관계없이 켜고 끄는 체크 항목입니다. <code>Visibility.Collapsed</code> 는 요소를 숨기면서 <b>자리까지</b> 없애서 작업 영역이 아래로 늘어납니다(<code>Hidden</code> 은 자리는 남김). <code>글자 크기</code> 하위 메뉴의 세 항목은 <b>셋 중 하나만</b> 체크되어야 하므로, <code>Size_Click</code> 에서 셋을 모두 끈 뒤 고른 항목만 켭니다. 크기 값은 각 항목의 <code>Tag</code> 에 적어 두고 <code>Convert.ToDouble(picked.Tag)</code> 로 숫자로 바꿨습니다. 처리기 하나로 세 항목을 처리하는 것도 <code>sender</code> 덕분입니다.' },
          { type: 'callout', kind: 'tip', title: 'Checked · Unchecked 이벤트도 있다', html: '<code>MenuItem</code> 에는 <code>Checked</code>(켜질 때) · <code>Unchecked</code>(꺼질 때) 이벤트도 있습니다. 켤 때와 끌 때 할 일이 완전히 다르면 두 이벤트로 나누고, 예제처럼 “상태에 맞춰 화면을 맞추는” 일이라면 <code>Click</code> 하나에서 <code>IsChecked</code> 를 읽는 편이 간단합니다.' },

          { type: 'h', text: '명령과 연결 — 메뉴와 도구 모음이 같은 일을' },
          { type: 'p', html: '저장 기능은 보통 <b>세 곳</b>에서 부릅니다. 파일 ▸ 저장 메뉴, 도구 모음의 저장 버튼, 그리고 <kbd>Ctrl</kbd>+<kbd>S</kbd>. 셋에 <code>Click</code> 을 따로 연결하면 코드가 흩어지고, “저장할 것이 없을 때 끄기” 도 세 번 해야 합니다. 17장에서 배운 <b>명령(Command)</b>이 바로 이 문제를 풉니다. 메뉴 항목과 버튼에 <code>Command="{x:Static ApplicationCommands.Save}"</code> 를 주고, 창에 <code>CommandBinding</code> 하나만 등록하면 됩니다.' },
          { type: 'p', html: '<code>ApplicationCommands</code> 의 명령에는 <b>기본 단축키가 이미 들어 있어서</b> <code>KeyBinding</code> 을 따로 만들지 않아도 <kbd>Ctrl</kbd>+<kbd>S</kbd> 가 동작하고, <code>MenuItem</code> 에 <code>Command</code> 를 주면 오른쪽에 <b>단축키 글자가 저절로 표시</b>됩니다. <code>CanExecute</code> 가 <code>false</code> 를 돌려주면 메뉴 항목 · 버튼 · 단축키가 <b>한꺼번에</b> 꺼집니다.' },
          { type: 'table', head: ['명령', '뜻', '기본 단축키'], rows: [
            ['<code>ApplicationCommands.New</code>', '새로 만들기', '<kbd>Ctrl</kbd>+<kbd>N</kbd>'],
            ['<code>ApplicationCommands.Open</code>', '열기', '<kbd>Ctrl</kbd>+<kbd>O</kbd>'],
            ['<code>ApplicationCommands.Save</code>', '저장', '<kbd>Ctrl</kbd>+<kbd>S</kbd>'],
            ['<code>ApplicationCommands.SaveAs</code>', '다른 이름으로 저장', '없음'],
            ['<code>ApplicationCommands.Print</code> · <code>Find</code>', '인쇄 · 찾기', '<kbd>Ctrl</kbd>+<kbd>P</kbd> · <kbd>Ctrl</kbd>+<kbd>F</kbd>'],
            ['<code>ApplicationCommands.Help</code>', '도움말', '<kbd>F1</kbd>']
          ], caption: '자주 쓰는 ApplicationCommands — using System.Windows.Input' },
          { type: 'code', title: '예제 21-3. 명령 — 메뉴와 도구 모음 버튼이 같은 명령을 공유', code: EX_COMMAND, desc: '파일 메뉴의 세 항목과 도구 모음의 세 버튼이 <b>같은 명령</b>을 가리킵니다. 메뉴를 펼쳐 보면 <code>InputGestureText</code> 를 쓰지 않았는데도 <code>Ctrl+N</code> · <code>Ctrl+O</code> · <code>Ctrl+S</code> 가 표시됩니다. 생성자에서 <code>CommandBinding</code> 세 개로 “할 일(Executed)” 을 연결했고, 저장에는 <code>Save_CanExecute</code> 를 더해 <b>글이 비어 있으면</b> 저장 메뉴와 💾 버튼이 함께 꺼지게 했습니다. 글을 한 글자 써 보면 둘이 동시에 켜집니다. 도구 모음의 버튼은 <code>ToolTip</code> 으로 마우스를 올렸을 때 설명을 보여 줍니다.' },
          { type: 'callout', kind: 'warn', title: 'InputGestureText 는 “글자” 일 뿐', html: '<code>InputGestureText="Ctrl+S"</code> 는 메뉴 오른쪽에 글자를 <b>보여 주기만</b> 합니다. <kbd>Ctrl</kbd>+<kbd>S</kbd> 를 눌러도 아무 일도 일어나지 않습니다. 단축키가 실제로 동작하려면 ① <code>ApplicationCommands</code> 처럼 기본 단축키가 있는 명령을 <code>Command</code> 로 연결하거나, ② 17장의 <code>KeyBinding</code> 으로 키와 명령을 연결해야 합니다. 명령을 쓰면 글자 표시까지 자동이므로 <code>InputGestureText</code> 는 거의 필요 없습니다.' },

          { type: 'h', text: '도구 모음(ToolBar)과 상태 표시줄(StatusBar)' },
          { type: 'p', html: '<code>ToolBar</code> 는 버튼 · 체크 상자 · 구분선(<code>Separator</code>) 같은 작은 컨트롤을 한 줄로 늘어놓는 막대입니다. 여러 개의 <code>ToolBar</code> 를 <code>ToolBarTray</code>(도구 모음 띠) 안에 넣으면 나란히 배치되고, 실제 WPF 에서는 마우스로 끌어서 순서를 바꿀 수도 있습니다. <code>StatusBar</code> 는 창 아래쪽 막대로, <code>StatusBarItem</code> 칸마다 글자 수 · 줄 수 · 상태 메시지 같은 정보를 보여 줍니다. 칸 사이에는 <code>&lt;Separator/&gt;</code> 로 세로 구분선을 넣습니다.' },
          { type: 'table', head: ['컨트롤', '들어가는 것', '팁'], rows: [
            ['<code>ToolBarTray</code>', '<code>ToolBar</code> 여러 개', '<code>DockPanel.Dock="Top"</code> 으로 메뉴 아래에'],
            ['<code>ToolBar</code>', '<code>Button</code> · <code>CheckBox</code> · <code>ComboBox</code> · <code>Separator</code>', '버튼마다 <code>ToolTip</code> 으로 설명 · 단축키 알려 주기'],
            ['<code>StatusBar</code>', '<code>StatusBarItem</code> · <code>Separator</code>', '<code>DockPanel.Dock="Bottom"</code>, 작업 영역보다 먼저 적기'],
            ['<code>StatusBarItem</code>', '<code>TextBlock</code>, <code>ProgressBar</code> 등 하나', '안의 <code>TextBlock</code> 에 이름을 붙여 코드에서 글자 바꾸기']
          ] },

          { type: 'h', text: '오른쪽 클릭 메뉴 — ContextMenu' },
          { type: 'p', html: '<code>ContextMenu</code> 는 화면에 미리 놓아두지 않고, 컨트롤의 <code>ContextMenu</code> 속성에 넣어 둡니다. 그 컨트롤 위에서 마우스 오른쪽 버튼을 누르면 그 자리에 뜹니다. 안에 넣는 것은 <code>Menu</code> 와 똑같이 <code>MenuItem</code> · <code>Separator</code> 이고, <code>Click</code> 처리기도 같은 방식으로 씁니다. XAML 에서는 <b>속성 요소</b> 문법 <code>&lt;ListBox.ContextMenu&gt;</code> 를 씁니다.' },
          { type: 'code', title: '예제 21-4. TextBox 와 ListBox 의 오른쪽 클릭 메뉴', code: EX_CONTEXT, desc: '왼쪽 메모 칸에서 오른쪽 클릭하면 대문자 · 소문자 · 시각 넣기 · 모두 지우기 메뉴가 뜹니다. <code>txtMemo.SelectedText = …</code> 는 커서 자리(또는 선택한 부분)에 글자를 끼워 넣습니다. 오른쪽 과일 목록은 항목을 고른 뒤 오른쪽 클릭해 <b>위로 이동</b> · <b>삭제</b> · <b>모두 지우기</b> 를 합니다. 위로 이동은 항목을 <code>RemoveAt</code> 으로 빼서 <code>Insert(i - 1, item)</code> 으로 한 칸 위에 다시 넣는 방식입니다. 고른 항목이 없으면(<code>SelectedIndex</code> 가 <code>-1</code>, <code>SelectedItem</code> 이 <code>null</code>) 안내만 합니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서 주의할 점', html: '<ul><li><b>단축키는 창 안에서만</b> 동작합니다. 실행한 창을 한 번 클릭해 포커스를 준 뒤 <kbd>Ctrl</kbd>+<kbd>S</kbd> 를 눌러 보세요. 창 밖(강의 페이지)에 포커스가 있으면 브라우저의 “페이지 저장” 이 뜹니다.</li><li><kbd>Ctrl</kbd>+<kbd>N</kbd> · <kbd>Ctrl</kbd>+<kbd>T</kbd> · <kbd>Ctrl</kbd>+<kbd>W</kbd> 처럼 브라우저가 먼저 가져가는 키는 창 안에서도 동작하지 않을 수 있습니다. 그때는 메뉴나 도구 모음 버튼을 쓰세요. Visual Studio 로 실행한 진짜 WPF 앱에서는 모두 동작합니다.</li><li>액세스 키(<code>_F</code>)는 밑줄로 표시되지만, 브라우저에서는 <kbd>Alt</kbd>+<kbd>F</kbd> 로 메뉴가 열리지 않습니다.</li><li>실제 WPF 는 목록 항목을 오른쪽 클릭하면 그 항목이 선택되지만, 브라우저 실행 창에서는 <b>먼저 왼쪽 클릭으로 고른 뒤</b> 오른쪽 클릭하세요.</li></ul>' },
          { type: 'callout', kind: 'warn', title: 'TextBox 의 기본 오른쪽 클릭 메뉴가 사라진다', html: '실제 WPF 의 <code>TextBox</code> 에는 잘라내기 · 복사 · 붙여넣기 오른쪽 클릭 메뉴가 기본으로 들어 있습니다. <code>&lt;TextBox.ContextMenu&gt;</code> 로 내 메뉴를 넣으면 그 기본 메뉴를 <b>대신</b>합니다. 기본 기능도 남기고 싶다면 내 메뉴에 <code>&lt;MenuItem Command="{x:Static ApplicationCommands.Copy}"/&gt;</code> 처럼 편집 명령 항목을 함께 넣으면 됩니다(TextBox 가 이 명령들을 스스로 처리합니다).' },

          { type: 'h', text: '모두 합치기 — 메모장 틀' },
          { type: 'p', html: '지금까지의 부품을 모두 모아 <b>메모장의 틀</b>을 만듭니다. 파일 메뉴와 도구 모음은 명령으로 묶고, 보기 메뉴는 체크 항목으로, 상태 표시줄은 글을 쓸 때마다(<code>TextChanged</code>) 글자 수와 줄 수를 갱신합니다. 제목의 <code>*</code> 는 “저장하지 않은 변경이 있음” 표시입니다. 아직 진짜 파일 대신 변수 <code>savedText</code> 에 저장하지만, 다음 교시에 <b>파일 대화상자</b>를 붙여 진짜 메모장으로 완성합니다.' },
          { type: 'code', title: '예제 21-5. 메모장 틀 — 메뉴 · 도구 모음 · 상태 표시줄', code: EX_NOTEPAD, desc: 'XAML 순서가 곧 배치입니다: <code>Menu</code>(위) → <code>ToolBarTray</code>(위) → <code>StatusBar</code>(아래) → <code>TextBox</code>(나머지). <code>ToolBarTray</code> 안에는 파일 도구와 글자 크기 도구, 두 개의 <code>ToolBar</code> 가 나란히 있습니다. 저장은 <code>Save_CanExecute</code> 에서 <code>isDirty</code> 일 때만 켜지므로, 글을 고치기 전이나 저장한 직후에는 저장 메뉴 · 💾 버튼이 꺼져 있습니다. <code>Math.Clamp(값, 9, 40)</code> 은 값을 9 ~ 40 사이로 잘라 줍니다(17장의 <code>Math.Max(Math.Min(…))</code> 를 한 번에). 줄 수는 <code>Text.Split(\'\\n\')</code> 로 나눈 조각 수입니다. <code>New_Executed</code> 에서 <code>Clear()</code> 가 <code>TextChanged</code> 를 일으켜 <code>isDirty</code> 가 <code>true</code> 가 되므로, 그 <b>다음에</b> <code>SetClean</code> 으로 되돌리는 순서에 주의하세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — MenuItem.Click 을 한 곳에서 받기 · 아이콘 넣기', html: '<ul><li><code>MenuItem.Click</code> 은 라우트된 이벤트(17장)라 부모로 버블링됩니다. <code>&lt;Menu MenuItem.Click="AnyMenu_Click"&gt;</code> 처럼 <code>Menu</code> 에 한 번만 연결하고, 처리기에서 <code>e.OriginalSource</code> 로 어느 항목인지 구분할 수도 있습니다.</li><li>실제 WPF 에서는 <code>&lt;MenuItem.Icon&gt;&lt;Image Source="save.png"/&gt;&lt;/MenuItem.Icon&gt;</code> 로 메뉴 항목 왼쪽에 작은 그림을 넣을 수 있습니다(브라우저 실행 창에서는 표시되지 않습니다).</li></ul>' }
        ],
        practice: [
          {
            title: '실습 21-1. 보기 메뉴로 상태 표시줄 · 큰 글자 켜고 끄기',
            level: 1,
            desc: '<p>메모 창에 <b>보기</b> 메뉴가 있습니다. 두 체크 항목이 동작하게 처리기를 완성하세요.</p><ul><li><b>상태 표시줄</b>: 체크하면 아래 상태 표시줄이 보이고, 체크를 풀면 <b>자리까지</b> 사라집니다.</li><li><b>큰 글자</b>: 체크하면 메모 글자 크기가 24, 풀면 14 가 되고, 상태 표시줄 오른쪽 칸에 <code>큰 글자 (24)</code> / <code>보통 글자 (14)</code> 를 표시합니다.</li><li>글을 쓸 때마다 상태 표시줄 왼쪽 칸에 <code>글자 수: n</code> 을 표시합니다.</li></ul>',
            hint: '<code>IsCheckable</code> 항목은 <code>Click</code> 이 올 때 이미 <code>IsChecked</code> 가 새 값으로 바뀌어 있습니다. 숨기기는 <code>Visibility.Collapsed</code>, 보이기는 <code>Visibility.Visible</code>. 조건 연산자 <code>조건 ? 참일 때 : 거짓일 때</code> 를 쓰면 한 줄로 쓸 수 있습니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 21-2. 목록 오른쪽 클릭 삭제 메뉴',
            level: 2,
            desc: '<p>장보기 목록에 <b>오른쪽 클릭 메뉴</b>를 붙이세요.</p><ul><li>XAML 에서 <code>ListBox.ContextMenu</code> 에 <b>삭제(_D)</b>, 구분선, <b>모두 지우기(_C)</b> 를 넣고 각각 <code>Delete_Click</code> · <code>ClearAll_Click</code> 과 연결합니다.</li><li><b>삭제</b>: 고른 항목이 없으면 <code>먼저 항목을 고르세요.</code>, 있으면 지우고 <code>\'달걀\' 삭제 — 남은 2개</code> 처럼 표시합니다.</li><li><b>모두 지우기</b>: 목록이 비어 있으면 아무것도 하지 않고, 아니면 <code>MessageBox</code>(예/아니요, 경고 아이콘)로 “정말 모두 지울까요?” 를 물어 <b>예</b>일 때만 지웁니다.</li></ul>',
            hint: '<code>&lt;ListBox.ContextMenu&gt;&lt;ContextMenu&gt; … &lt;/ContextMenu&gt;&lt;/ListBox.ContextMenu&gt;</code> 안에 <code>MenuItem</code> 과 <code>Separator</code> 를 넣습니다. 고른 항목은 <code>object? item = lstItems.SelectedItem;</code> 으로 받고 <code>null</code> 인지 먼저 확인하세요. 결과 비교: <code>r == MessageBoxResult.Yes</code>.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>&lt;MenuItem Header="저장(_S)"/&gt;</code> 에서 <code>_</code> 의 역할은?', options: ['글자 사이를 띄어 쓴다', '메뉴를 회색(비활성)으로 표시한다', 'S 에 밑줄을 긋고, Alt 와 함께 눌러 고르는 액세스 키로 만든다', '단축키 Ctrl+S 를 자동으로 연결한다'], answer: 2, explain: '<code>_</code> 바로 뒤 글자가 <b>액세스 키</b>가 됩니다. 메뉴가 열린 상태에서 그 글자를 누르거나, 맨 위 메뉴라면 <kbd>Alt</kbd>+글자로 고릅니다. <kbd>Ctrl</kbd>+<kbd>S</kbd> 같은 단축키와는 다릅니다.' },
          { q: 'Command 도 KeyBinding 도 없이 <code>&lt;MenuItem Header="저장" InputGestureText="Ctrl+S" Click="Save_Click"/&gt;</code> 만 있을 때, 창에서 Ctrl+S 를 누르면?', options: ['아무 일도 일어나지 않는다 — 글자만 표시될 뿐이다', 'Save_Click 이 실행된다', 'ApplicationCommands.Save 가 자동 실행된다', '컴파일 오류가 난다'], answer: 0, explain: '<code>InputGestureText</code> 는 메뉴 오른쪽에 <b>글자를 보여 주기만</b> 합니다. 키가 동작하려면 명령(<code>Command</code>)이나 <code>KeyBinding</code> 을 연결해야 합니다.' },
          { q: '아래 메뉴 항목을 처음 한 번 클릭하면 <code>lbl.Text</code> 는?<pre><code>&lt;MenuItem x:Name="mnuWrap" IsCheckable="True" IsChecked="True"\n          Click="Wrap_Click"/&gt;\n\nprivate void Wrap_Click(object sender, RoutedEventArgs e)\n{\n    lbl.Text = mnuWrap.IsChecked ? "켬" : "끔";\n}</code></pre>', options: ['켬', '끔', '아무것도 표시되지 않는다', '예외가 발생한다'], answer: 1, explain: '체크 항목은 누르면 <code>IsChecked</code> 가 <b>먼저</b> 뒤집힌 뒤 <code>Click</code> 이 옵니다. 처음 <code>True</code> → 클릭 → <code>False</code> 이므로 “끔” 입니다.' },
          { q: '파일 ▸ 저장 메뉴 · 도구 모음 저장 버튼 · Ctrl+S 가 같은 동작을 하고, 저장할 내용이 없으면 셋 다 <b>자동으로</b> 꺼지게 하려면?', options: ['세 곳에 같은 Click 처리기를 연결한다', '메뉴에 InputGestureText="Ctrl+S" 를 준다', 'IsCheckable 을 True 로 한다', '셋 모두 ApplicationCommands.Save 를 가리키게 하고 CommandBinding 의 CanExecute 로 판단한다'], answer: 3, explain: '명령을 쓰면 할 일(<code>Executed</code>)과 가능 여부(<code>CanExecute</code>)를 <b>한 곳</b>에 두고, 부르는 곳은 몇 개든 함께 켜지고 꺼집니다. <code>ApplicationCommands.Save</code> 에는 <kbd>Ctrl</kbd>+<kbd>S</kbd> 가 기본으로 들어 있습니다.' },
          { q: '<code>DockPanel</code> 안에 <code>Menu</code>(Top) → <code>TextBox</code> → <code>StatusBar</code>(Bottom) 순서로 적었더니 상태 표시줄이 제대로 붙지 않았다. 올바른 해결책은?', options: ['StatusBar 에 Height 를 준다', 'StatusBar 를 TextBox 보다 앞에 적는다 — DockPanel 은 마지막 자식이 남은 공간을 채우므로', 'TextBox 에 DockPanel.Dock="Top" 을 준다', 'Menu 를 맨 뒤로 옮긴다'], answer: 1, explain: '<code>DockPanel</code> 은 적은 순서대로 가장자리에 붙이고, <b>마지막 자식</b>이 남은 공간을 모두 차지합니다. 작업 영역(TextBox)을 맨 마지막에 두어야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '메뉴 · 도구 모음 · 상태 표시줄 · 컨텍스트 메뉴', subtitle: 'Chapter 21 · Section 01 — 윈도우 앱다운 화면 만들기', badge: '21-1',
            notes: '<p><b>[도입 2분]</b> 메모장이나 그림판을 띄워 보여 주고 발문: “이 프로그램들의 화면에 공통으로 있는 것은?” → 메뉴, 도구 모음, 상태 표시줄, 오른쪽 클릭 메뉴.</p><p>오늘 목표: 이 부품들로 “메모장 틀” 을 만들고, 다음 시간에 파일 열기 · 저장을 붙여 완성합니다.</p>' },
          { layout: 'diagram', title: '윈도우 앱의 화면 구성', html: SVG_LAYOUT, caption: 'Menu → ToolBarTray → StatusBar → TextBox 순서로 DockPanel 에',
            notes: '<p><b>[3분]</b> 15장의 DockPanel 복습: 적은 순서대로 가장자리에 붙고 마지막 자식이 나머지를 채운다.</p><p>발문: “상태 표시줄은 화면 맨 아래인데 왜 XAML 에서는 TextBox 보다 먼저 적을까?” — 퀴즈 5번과 연결됩니다. ContextMenu 는 배치하지 않고 컨트롤 속성에 넣는다는 점도 짚어 둡니다.</p>' },
          { layout: 'diagram', title: '펼친 메뉴의 구성', html: SVG_MENU, caption: '중첩 = 메뉴 구조, _ = 액세스 키, ✓ = IsCheckable',
            notes: '<p><b>[3분]</b> 그림의 ①~⑥ 을 차례로 짚습니다. 액세스 키(Alt+F)와 단축키(Ctrl+S)를 학생들이 자주 헷갈립니다 — “액세스 키는 메뉴 안에서 고르는 글자, 단축키는 메뉴를 열지 않고 바로 실행”.</p><p>맨 위 MenuItem(파일)은 보통 Click 없이 제목 역할만 한다는 점도 말해 주세요.</p>' },
          { layout: 'code', title: '예제 21-1. 메뉴 기본', code: SL_MENU, points: ['<code>Menu</code> 안에 <code>MenuItem</code> 중첩', '<code>Header="파일(_F)"</code> → 밑줄 · 액세스 키', '<code>&lt;Separator/&gt;</code> 구분선', '<code>(MenuItem)sender</code> 로 어느 항목인지'],
            notes: '<p><b>[5분]</b> 실행 후 파일 ▸ 최근 파일 ▸ 일기.txt 까지 펼쳐 보이고, 표시되는 Header 에 _ 가 남는 것을 보여 줍니다(본문 예제는 Replace 로 제거).</p><p>InputGestureText 는 글자만 — Ctrl+N 을 눌러 아무 일도 없는 것을 직접 확인시키면 다음 “명령” 의 필요성이 생깁니다.</p>' },
          { layout: 'code', title: '예제 21-2. 켜고 끄는 메뉴 — IsCheckable', code: SL_CHECK, points: ['<code>IsCheckable="True"</code> · 처음 상태 <code>IsChecked</code>', '누르면 IsChecked 가 <b>먼저</b> 바뀐 뒤 Click', '<code>Collapsed</code> = 자리까지 없앰', '“하나만 고르기” 는 직접 끄고 켜기(본문)'],
            notes: '<p><b>[4분]</b> 상태 표시줄을 끄면 TextBox 가 아래로 늘어나는 것을 보여 주고, Collapsed 를 Hidden 으로 바꿔 차이를 시연합니다.</p><p>본문 예제 21-2 의 글자 크기 하위 메뉴(셋 중 하나만)는 “라디오 버튼처럼” 쓰는 패턴 — Tag 에 값을 넣고 처리기 하나로 처리합니다.</p>' },
          { layout: 'code', title: '예제 21-3. 명령 — 메뉴와 도구 버튼이 함께', code: SL_COMMAND, points: ['메뉴 · 버튼이 같은 <code>ApplicationCommands.Save</code>', '메뉴에 <b>Ctrl+S 가 저절로</b> 표시', 'Ctrl+S 도 KeyBinding 없이 동작', '<code>CanExecute</code> false → 둘 다 꺼짐'],
            notes: '<p><b>[5분]</b> 17장 명령 복습. 실행 직후 저장 메뉴 · 버튼이 모두 꺼져 있는 것 → 한 글자 입력하면 둘 다 켜짐 → 창을 클릭하고 Ctrl+S.</p><p>브라우저에서는 창 안에 포커스가 있어야 Ctrl+S 가 창으로 갑니다(아니면 브라우저의 페이지 저장). Ctrl+N 은 브라우저가 가져갈 수 있다는 점도 미리 알려 주세요.</p>' },
          { layout: 'two', title: '도구 모음과 상태 표시줄', left: { title: 'ToolBarTray · ToolBar', code: '<ToolBarTray DockPanel.Dock="Top">\n    <ToolBar>\n        <Button Content="💾 저장" ToolTip="저장 (Ctrl+S)"\n                Command="{x:Static ApplicationCommands.Save}"/>\n        <Separator/>\n        <Button Content="가+" Click="Bigger_Click"/>\n    </ToolBar>\n</ToolBarTray>', run: false }, right: { title: 'StatusBar · StatusBarItem', code: '<StatusBar DockPanel.Dock="Bottom">\n    <StatusBarItem>\n        <TextBlock x:Name="lblStatus" Text="준비"/>\n    </StatusBarItem>\n    <Separator/>\n    <StatusBarItem>\n        <TextBlock x:Name="lblCount" Text="0글자"/>\n    </StatusBarItem>\n</StatusBar>', run: false },
            notes: '<p><b>[3분]</b> 도구 모음: 자주 쓰는 명령을 버튼으로. 여러 ToolBar 를 ToolBarTray 에 넣으면 나란히. 버튼마다 ToolTip 으로 이름과 단축키를 알려 주는 것이 좋은 습관.</p><p>상태 표시줄: StatusBarItem 안의 TextBlock 에 이름을 붙여 코드에서 갱신. TextChanged 에서 글자 수를 세는 코드는 예제 21-5 · 실습 21-1 에서.</p>' },
          { layout: 'code', title: '예제 21-4. 오른쪽 클릭 메뉴 — ContextMenu', code: SL_CONTEXT, points: ['컨트롤의 <code>ContextMenu</code> 속성에 넣는다', '<code>&lt;ListBox.ContextMenu&gt;</code> 속성 요소 문법', '안의 내용은 Menu 와 같다 (MenuItem · Separator)', '고른 항목이 없을 때(<code>null</code>)를 먼저 확인'],
            notes: '<p><b>[4분]</b> 브라우저 실행 창에서는 항목을 먼저 왼쪽 클릭으로 고른 뒤 오른쪽 클릭해야 합니다(실제 WPF 는 오른쪽 클릭이 선택도 함).</p><p>본문 예제에는 TextBox 의 오른쪽 클릭 메뉴(대문자 · 시각 넣기)와 “위로 이동” 도 있습니다. TextBox 에 내 메뉴를 넣으면 기본 잘라내기/복사/붙여넣기 메뉴가 사라진다는 점도 언급.</p>' },
          { layout: 'bullets', title: '모두 합치기 — 메모장 틀 (예제 21-5)', lead: '다음 시간에 파일 대화상자를 붙여 완성한다',
            bullets: ['파일 메뉴 + 도구 모음 = <b>같은 명령</b> (New · Open · Save)', '보기 메뉴 = 체크 항목 (줄 바꿈 · 상태 표시줄)', '상태 표시줄 = <code>TextChanged</code> 에서 글자 수 · 줄 수', ['제목의 <code>*</code> = 저장하지 않은 변경 (<code>isDirty</code>)'], '저장은 <code>CanExecute = isDirty</code> — 바뀐 게 없으면 꺼짐', '브라우저: 창을 클릭한 뒤 단축키, Ctrl+N 은 메뉴로'],
            notes: '<p><b>[4분]</b> 예제 21-5 를 실행해 전체를 한 번 훑습니다. 글을 쓰면 제목에 * 와 저장 버튼 켜짐 → 저장하면 * 사라지고 버튼 꺼짐.</p><p>Clear() 가 TextChanged 를 일으키므로 SetClean 을 그 “뒤에” 부르는 순서가 중요하다는 점을 짚어 주세요(17장 실습 17-4 와 같은 함정).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '메뉴 · 도구 버튼 · Ctrl+S 가 같은 저장 동작을 하고, 저장할 내용이 없으면 셋 다 자동으로 꺼지게 하려면?', options: ['세 곳에 같은 Click 처리기를 연결한다', 'InputGestureText="Ctrl+S" 를 준다', 'IsCheckable 을 True 로 한다', 'ApplicationCommands.Save + CommandBinding 의 CanExecute'], answer: 3, explain: '명령을 쓰면 할 일과 가능 여부를 한 곳에 두고, 부르는 곳은 모두 함께 켜지고 꺼집니다.',
            notes: '<p>정답 후 “InputGestureText 만 쓰면?” 이라고 되물어 “글자만 표시” 를 다시 확인합니다.</p>' },
          { layout: 'practice', title: '실습 21-1. 보기 메뉴로 켜고 끄기', desc: '<p>보기 ▸ 상태 표시줄(체크하면 보이고, 풀면 자리까지 사라짐), 보기 ▸ 큰 글자(24 / 14, 상태 표시줄에 표시), 글을 쓸 때마다 <code>글자 수: n</code>. 빨리 끝나면 실습 21-2(오른쪽 클릭 삭제 메뉴)로.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[10분]</b> 실습 21-1 은 5분 안에 끝나는 학생이 많습니다. 끝난 학생은 21-2 로. 21-2 는 XAML 에 ContextMenu 를 직접 쓰는 것이 핵심 — 속성 요소 문법을 칠판에 적어 두세요.</p><p>흔한 실수: Status_Click 에서 IsChecked 를 직접 뒤집음(!mnuStatus.IsChecked) → 두 번 뒤집혀 반대로 동작. “이미 뒤집혀서 온다” 를 강조.</p>' },
          { layout: 'summary', title: '정리', bullets: ['화면 = DockPanel: Menu · ToolBarTray(Top) → StatusBar(Bottom) → 작업 영역(마지막)', '<code>MenuItem</code>: <code>Header="파일(_F)"</code> · 중첩 = 하위 메뉴 · <code>Separator</code> · <code>Click</code>', '<code>IsCheckable</code> — IsChecked 가 먼저 바뀐 뒤 Click', '<code>Command</code> = 메뉴 · 버튼 · 단축키 공유, 단축키 글자 자동 표시', '<code>ContextMenu</code> 는 컨트롤의 속성에 넣는다'],
            notes: '<p>다음 시간: 메모장 틀에 진짜 “열기 · 저장” 을 붙입니다 — 파일 대화상자, 그리고 내가 만든 대화상자 창과 여러 창 다루기.</p>' }
        ]
      },
      /* ===================== ch21-2 ===================== */
      {
        id: 'ch21-2',
        title: '대화상자와 여러 창',
        minutes: 50,
        goals: [
          'MessageBox 의 버튼 종류 · 아이콘을 고르고 결과(MessageBoxResult)로 분기할 수 있다',
          'OpenFileDialog · SaveFileDialog 의 Filter · FileName 과 ShowDialog() == true 로 파일을 열고 저장할 수 있다',
          '모달(ShowDialog)과 모덜리스(Show)의 차이를 설명하고 Owner · CenterOwner 를 설정할 수 있다',
          'IsDefault · IsCancel · DialogResult 와 속성으로 값을 돌려주는 사용자 정의 대화상자를 만들 수 있다',
          '생성자 매개변수 · 속성 · 이벤트로 창 사이에 데이터를 전달하고, Closing 에서 저장 여부를 확인할 수 있다'
        ],
        flow: [['도입: 대화상자 · MessageBox 복습', 5], ['파일 대화상자 · 메모장 완성', 13], ['모달 · 모덜리스 · 사용자 정의 대화상자', 15], ['창 사이 데이터 전달 · 설정 창', 8], ['퀴즈 · 실습', 9]],
        content: [
          { type: 'h', text: '대화상자(Dialog)란?' },
          { type: 'p', html: '프로그램이 사용자에게 <b>무언가를 묻고 대답을 받는</b> 작은 창을 <b>대화상자(dialog box)</b>라고 합니다. “저장할까요?” 를 묻는 메시지 상자, 파일을 고르는 <b>열기 · 저장 대화상자</b>, 글꼴 · 색을 고르는 <b>설정 창</b>이 모두 대화상자입니다. 대화상자의 공통점은 <b>대답을 들을 때까지 주 창을 쓸 수 없다</b>는 것입니다. 이런 창을 <b>모달(modal)</b> 창이라고 합니다.' },
          { type: 'h', text: 'MessageBox 복습 — 버튼 · 아이콘 · 결과' },
          { type: 'p', html: '13장부터 써 온 <code>MessageBox.Show</code> 는 가장 간단한 대화상자입니다. 매개변수로 <b>버튼 종류</b>(<code>MessageBoxButton</code>)와 <b>아이콘</b>(<code>MessageBoxImage</code>)을 고를 수 있고, 사용자가 누른 버튼이 <code>MessageBoxResult</code> 로 돌아옵니다. <code>MessageBox.Show</code> 도 모달이라, 사용자가 버튼을 누를 때까지 <b>다음 줄로 넘어가지 않습니다</b>.' },
          { type: 'table', head: ['매개변수 · 결과', '값', '언제'], rows: [
            ['<code>MessageBoxButton</code>', '<code>OK</code> · <code>OKCancel</code> · <code>YesNo</code> · <code>YesNoCancel</code>', '알림만 · 계속할지 · 예/아니요 · 저장 확인(예/아니요/취소)'],
            ['<code>MessageBoxImage</code>', '<code>Information</code> · <code>Warning</code> · <code>Error</code> · <code>Question</code> · <code>None</code>', 'ⓘ 알림 · ⚠ 경고 · ⛔ 오류 · ? 질문'],
            ['<code>MessageBoxResult</code> (돌려받는 값)', '<code>OK</code> · <code>Cancel</code> · <code>Yes</code> · <code>No</code>', '<code>if (r == MessageBoxResult.Yes)</code> 로 분기']
          ], caption: 'MessageBox.Show(내용, 제목, 버튼, 아이콘) — 결과는 MessageBoxResult' },
          { type: 'code', title: '예제 21-6. MessageBox — 버튼 종류 · 아이콘 · 결과 분기', code: EX_MSGBOX, desc: '다섯 버튼이 서로 다른 조합의 메시지 상자를 띄웁니다. ①⑤ 처럼 <b>알리기만</b> 할 때는 결과를 받지 않고, ②③④ 처럼 <b>물어볼 때</b>는 <code>MessageBoxResult r</code> 로 받아 분기합니다. 결과가 셋인 ④(예 · 아니요 · 취소)는 <code>switch</code> 가 읽기 쉽습니다. <code>YesNoCancel</code> 에서 창의 ✕ 를 누르면 <code>Cancel</code> 이 돌아옵니다(<code>YesNo</code> 는 ✕ 가 꺼져 있어 반드시 예 · 아니요 중 하나를 골라야 합니다). 메시지 안의 <code>\\n</code> 은 줄 바꿈입니다.' },
          { type: 'callout', kind: 'tip', title: '버튼 이름은 “동사” 가 되도록 묻기', html: '“정말 삭제할까요?” 에 <b>예 / 아니요</b>, “바뀐 내용을 저장할까요?” 에 <b>예 / 아니요 / 취소</b> 처럼, 질문을 <b>예 · 아니요로 대답할 수 있게</b> 쓰세요. “취소하시겠습니까?” 에 <b>확인 / 취소</b> 를 붙이면 사용자는 “취소” 가 무엇을 취소하는지 헷갈립니다. 되돌릴 수 없는 일(삭제 · 덮어쓰기)에는 <code>Warning</code> 아이콘을 씁니다.' },

          { type: 'h', text: '공통 대화상자 — OpenFileDialog · SaveFileDialog' },
          { type: 'p', html: '파일을 고르는 창은 모든 프로그램이 똑같이 쓰므로 Windows 가 <b>공통 대화상자(common dialog)</b>로 제공합니다. WPF 에서는 <code>Microsoft.Win32</code> 네임스페이스의 <code>OpenFileDialog</code>(열기)와 <code>SaveFileDialog</code>(저장)를 씁니다. 사용법은 세 단계입니다. ① 객체를 만들고 속성(<code>Filter</code> 등)을 정한다 → ② <code>ShowDialog()</code> 로 띄운다 → ③ 결과가 <code>true</code> 이면 <code>FileName</code> 으로 고른 파일 경로를 얻는다. 대화상자는 파일을 <b>고르기만</b> 하고, 실제로 읽고 쓰는 것은 10장의 <code>File.ReadAllText</code> · <code>File.WriteAllText</code> 입니다.' },
          { type: 'table', head: ['멤버', '뜻', '예'], rows: [
            ['<code>Filter</code>', '파일 종류 목록. <code>표시 이름|패턴</code> 쌍을 <code>|</code> 로 이어 붙임', '<code>"텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*"</code>'],
            ['<code>FileName</code>', '고른 파일의 <b>전체 경로</b> (저장 대화상자에서는 처음 보여 줄 이름으로도 씀)', '<code>dlg.FileName = "제목 없음.txt";</code>'],
            ['<code>DefaultExt</code>', '확장자 없이 이름만 쓰면 붙여 줄 확장자 (저장)', '<code>dlg.DefaultExt = ".txt";</code>'],
            ['<code>Title</code>', '대화상자 제목', '<code>dlg.Title = "메모 열기";</code>'],
            ['<code>ShowDialog()</code>', '띄우고 기다린다. 반환형은 <b><code>bool?</code></b> — 열기/저장 = <code>true</code>, 취소 = <code>false</code>', '<code>if (dlg.ShowDialog() == true)</code>']
          ], caption: 'using Microsoft.Win32; — OpenFileDialog 와 SaveFileDialog 의 공통 멤버' },
          { type: 'p', html: '<code>Filter</code> 문자열은 처음엔 낯설어 보이지만 규칙은 단순합니다. <code>|</code> 로 나눈 조각을 <b>두 개씩</b> 묶어 읽습니다: 앞은 목록에 <b>보이는 이름</b>, 뒤는 실제로 거를 <b>패턴</b>입니다. 한 종류에 패턴이 여럿이면 세미콜론으로 잇습니다: <code>"그림 파일 (*.png;*.jpg)|*.png;*.jpg"</code>.' },
          { type: 'callout', kind: 'warn', title: 'ShowDialog() 의 반환형은 bool? — 반드시 == true', html: '<code>OpenFileDialog.ShowDialog()</code> 와 <code>Window.ShowDialog()</code> 는 <code>bool</code> 이 아니라 <b><code>bool?</code></b>(널 허용 bool, 12장)을 돌려줍니다. 그래서 <code>if (dlg.ShowDialog())</code> 는 <b>컴파일 오류</b>입니다. 항상 <code>if (dlg.ShowDialog() == true)</code> 로 비교하세요. 취소는 <code>false</code> 이므로 “취소면 그만두기” 는 <code>if (dlg.ShowDialog() != true) return;</code> 입니다.' },
          { type: 'code', title: '예제 21-7. 메모장 완성 — 열기 · 저장 · 다른 이름으로 저장 · 닫기 전 확인', code: EX_MEMOFILE, desc: '지난 교시 메모장 틀에 진짜 파일 입출력을 붙였습니다. <b>열기</b>는 <code>OpenFileDialog</code> 로 파일을 고르게 한 뒤 <code>File.ReadAllText(dlg.FileName)</code> 로 읽습니다. <b>저장</b>은 지금 파일 경로(<code>currentPath</code>)가 있으면 바로 <code>File.WriteAllText</code>, 한 번도 저장하지 않았으면 <b>다른 이름으로 저장</b>(<code>SaveFileDialog</code>)으로 넘어갑니다. <code>SaveMemo</code> · <code>SaveMemoAs</code> 가 성공 여부를 <code>bool</code> 로 돌려주는 덕분에 <code>ConfirmSave</code> 는 “저장 대화상자에서 취소” 까지 정확히 처리합니다. 새로 만들기 · 열기 · 창 닫기 전에는 <code>ConfirmSave</code> 가 “바뀐 내용을 저장할까요?” 를 묻고, <b>취소</b>면 그 일을 그만둡니다. 창 닫기는 <code>Closing</code> 이벤트에서 <code>e.Cancel = true</code> 로 취소합니다(17장). 제목은 <code>*연습.txt - 메모장</code> 처럼 파일 이름과 변경 여부를 보여 줍니다. 생성자에서 <code>연습.txt</code> 를 미리 만들어 두었으니 파일 ▸ 열기로 열어 고쳐 보고, 닫기(✕)도 눌러 보세요.' },
          { type: 'callout', kind: 'info', title: '브라우저에서는 “작업 폴더” 가 대상', html: '브라우저 실행 창의 열기 · 저장 대화상자는 여러분 PC 의 디스크가 아니라 <b>브라우저 메모리 안의 작업 폴더</b>를 보여 줍니다. 예제가 만든 <code>연습.txt</code> 와 여러분이 저장한 파일이 거기에 있고, 이름을 입력하거나 목록에서 골라 씁니다. Visual Studio 로 실행하면 진짜 Windows 파일 대화상자가 뜨고, 상대 경로 파일(<code>연습.txt</code>)은 실행 파일이 있는 폴더(<code>bin\\Debug\\…</code>)에 만들어집니다.' },
          { type: 'p', html: '<b>닫기 전에 저장 확인</b>의 흐름을 정리하면 다음과 같습니다. 이 패턴은 거의 모든 문서 편집 프로그램에 들어 있습니다.' },
          { type: 'list', ordered: true, items: [
            '글을 고치면 <code>TextChanged</code> 에서 <code>isDirty = true</code>, 저장하거나 새로 열면 <code>false</code>',
            '창을 닫으려 하면(✕ · <code>Close()</code>) <b>닫히기 직전</b>에 <code>Closing</code> 이벤트가 온다',
            '<code>isDirty</code> 이면 “저장할까요?” (예 / 아니요 / 취소)',
            '<b>예</b> → 저장 (저장 대화상자에서 취소하면 닫기도 취소) · <b>아니요</b> → 그냥 닫힘 · <b>취소</b> → <code>e.Cancel = true</code> 로 창이 그대로 남음'
          ] },

          { type: 'h', text: '모달과 모덜리스 — ShowDialog() vs Show()' },
          { type: 'p', html: '내가 만든 창(<code>Window</code>)을 띄우는 방법은 두 가지입니다. <code>ShowDialog()</code> 로 띄운 창은 <b>모달(modal)</b>입니다. 창이 닫힐 때까지 <b>그 줄에서 코드가 멈춰 기다리고</b>, 그동안 주 창은 클릭해도 반응하지 않습니다. <code>Show()</code> 로 띄운 창은 <b>모덜리스(modeless)</b>입니다. 창을 띄우자마자 <b>바로 다음 줄로</b> 넘어가고, 사용자는 두 창을 자유롭게 오가며 씁니다.' },
          { type: 'figure', html: SVG_MODAL, caption: 'ShowDialog() 는 닫힐 때까지 기다렸다가 결과(true/false)를 돌려받고, Show() 는 띄우고 바로 돌아온다' },
          { type: 'table', head: ['', '모달 — <code>ShowDialog()</code>', '모덜리스 — <code>Show()</code>'], rows: [
            ['다음 줄은 언제?', '창이 <b>닫힌 뒤</b>', '<b>바로</b>'],
            ['주 창 사용', '불가 (클릭해도 반응 없음)', '가능 — 두 창을 오가며'],
            ['반환값', '<code>bool?</code> — <code>DialogResult</code>', '없음 (<code>void</code>)'],
            ['결과 받기', '닫힌 뒤 <code>ShowDialog()</code> 다음 줄에서 속성 읽기', '이벤트(<code>Closed</code>, 내가 만든 이벤트)로'],
            ['동시에 여러 개', '보통 하나', '여러 개 가능'],
            ['예', '입력 · 설정 · 저장 확인 · 파일 대화상자 · MessageBox', '찾기 · 도구 창 · 미리 보기 · 대화(채팅) 창']
          ], caption: '모달 vs 모덜리스' },
          { type: 'code', title: '예제 21-8. 모달과 모덜리스 비교 — 기록으로 순서 확인', code: EX_MODAL, desc: '이 예제에는 창이 <b>두 종류</b> 있습니다: 주 창 <code>MainWindow</code> 와 자식 창 <code>ChildWindow</code>(각각 .xaml + .xaml.cs). <b>모달로 열기</b>를 누르면 기록에 “호출 — 여기서 멈춤” 이 찍히고, 자식 창을 <b>닫아야</b> “창이 닫힌 뒤에야…” 가 찍힙니다. 그동안 주 창은 눌리지 않습니다. <b>모덜리스로 열기</b>는 두 줄이 <b>곧바로</b> 찍히고, 주 창의 버튼을 또 눌러 창을 여러 개 띄울 수 있습니다. 모덜리스 창은 언제 닫힐지 모르므로 <code>w.Closed += …</code> 로 “닫혔다” 는 알림을 받습니다. 람다가 번호를 기억하도록 <code>int myNo = no;</code> 로 복사해 둔 점도 보세요(11장 람다의 변수 캡처). <code>ChildWindow</code> 는 생성자 매개변수로 제목과 안내 글을 받습니다.' },
          { type: 'callout', kind: 'tip', title: 'Owner 와 WindowStartupLocation="CenterOwner"', html: '<code>w.Owner = this;</code> 로 <b>주인 창(owner)</b>을 정해 두면 좋은 점이 많습니다. <ul><li>자식 창이 항상 주인 창 <b>위에</b> 보입니다(뒤로 숨지 않음).</li><li>주인 창을 최소화하면 함께 최소화되고, 주인 창이 닫히면 <b>함께 닫힙니다</b>.</li><li>자식 창 XAML 에 <code>WindowStartupLocation="CenterOwner"</code> 를 주면 주인 창 <b>한가운데</b>에 뜹니다(<code>Owner</code> 가 있어야 동작).</li><li>대화상자에는 <code>ResizeMode="NoResize"</code>(크기 고정), <code>ShowInTaskbar="False"</code>(작업 표시줄에 따로 안 뜸)도 자주 함께 씁니다.</li></ul>' },

          { type: 'h', text: '사용자 정의 대화상자 — 입력 창 만들기' },
          { type: 'p', html: 'MessageBox 로는 글자를 입력받을 수 없습니다. 이름이나 할 일을 입력받는 창은 <b>직접 만듭니다</b>. 새 창 하나를 추가해 <code>TextBox</code> 와 <b>확인 · 취소</b> 버튼을 두고, 주 창에서 <code>ShowDialog()</code> 로 띄우면 됩니다. 대화상자다운 동작은 다음 네 가지로 만듭니다.' },
          { type: 'table', head: ['구성', '코드', '하는 일'], rows: [
            ['확인 버튼', '<code>IsDefault="True"</code>', '<kbd>Enter</kbd> 를 누르면 이 버튼이 눌린 것으로 친다 (닫기는 Click 에서 직접)'],
            ['취소 버튼', '<code>IsCancel="True"</code>', '<kbd>Esc</kbd> 또는 클릭 → <b>처리기 없이도</b> <code>DialogResult = false</code> 로 닫힘'],
            ['결과 알리기', '<code>DialogResult = true;</code>', '모달 창이 <b>저절로 닫히고</b>, <code>ShowDialog()</code> 가 <code>true</code> 를 돌려줌'],
            ['값 돌려주기', '<code>public string Answer { get; private set; }</code>', '주 창이 <code>ShowDialog()</code> 다음 줄에서 <code>dlg.Answer</code> 로 읽음']
          ], caption: '사용자 정의 대화상자의 네 가지 요소' },
          { type: 'code', title: '예제 21-9. 입력 대화상자 — InputDialog 로 할 일 추가 · 고치기', code: EX_INPUT, desc: '<code>InputDialog</code> 는 생성자로 <b>질문</b>과 <b>기본값</b>을 받고, 확인을 누르면 입력한 글을 <code>Answer</code> 속성에 담은 뒤 <code>DialogResult = true</code> 로 닫힙니다. 입력이 비어 있으면 <code>DialogResult</code> 를 정하지 않고 <code>return</code> 하므로 창이 <b>닫히지 않습니다</b>. 취소 버튼은 <code>IsCancel="True"</code> 만으로 동작하므로 처리기가 없습니다. 주 창의 <code>BtnAdd_Click</code> 은 ① 만들기 ② <code>Owner</code> ③ <code>ShowDialog() == true</code> 확인 ④ <code>dlg.Answer</code> 읽기의 네 줄 패턴입니다. <b>고치기</b>는 같은 대화상자를 지금 값을 기본값으로 넣어 다시 씁니다 — 대화상자를 한 번 만들어 두면 여러 곳에서 재사용할 수 있습니다. <code>Loaded</code> 에서 <code>Focus()</code> · <code>SelectAll()</code> 로 바로 입력할 수 있게 했고, 입력 후 <kbd>Enter</kbd> 는 <code>IsDefault</code> 버튼(확인)을 누릅니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 새 창(대화상자) 추가하기', html: '<ol><li>솔루션 탐색기에서 <b>프로젝트</b>를 오른쪽 클릭 → <b>추가</b> → <b>창(WPF)...</b></li><li>이름에 <code>InputDialog.xaml</code> 을 입력하고 <b>추가</b> → <code>InputDialog.xaml</code> 과 <code>InputDialog.xaml.cs</code> 두 파일이 함께 만들어집니다.</li><li>만들어진 생성자에는 <code>InitializeComponent();</code> 가 들어 있습니다. 매개변수가 있는 생성자로 바꿀 때도 이 줄은 <b>반드시</b> 첫 줄에 남겨 두세요 — 이 줄이 XAML 의 컨트롤들을 만듭니다.</li><li>주 창 코드에서 <code>new InputDialog(…)</code> 로 만들어 띄웁니다. 첫 번째 창은 <code>App.xaml</code> 의 <code>StartupUri="MainWindow.xaml"</code> 이 정합니다.</li></ol>' },
          { type: 'callout', kind: 'warn', title: 'DialogResult 는 ShowDialog() 로 연 창에서만', html: '<code>DialogResult</code> 를 정하면 창이 닫히는 것은 <b>모달</b>로 열었을 때의 이야기입니다. <code>Show()</code> 로 연 창에서 <code>DialogResult = true;</code> 를 실행하면 실제 WPF 는 <code>InvalidOperationException</code> 예외를 냅니다. 모덜리스 창은 그냥 <code>Close()</code> 로 닫고, 결과는 이벤트나 속성으로 전달하세요.' },

          { type: 'h', text: '창 사이 데이터 전달 — 생성자 · 속성 · 이벤트' },
          { type: 'p', html: '창도 결국 <b>클래스</b>입니다(8장). 그래서 창 사이에 데이터를 주고받는 방법도 클래스끼리 주고받는 방법과 같습니다. <b>열기 전에</b> 넘길 값은 생성자 매개변수나 속성으로, <b>닫힌 뒤</b> 돌려받을 값은 속성으로, <b>열려 있는 동안</b> 수시로 알릴 일은 이벤트(11장)로 전달합니다.' },
          { type: 'figure', html: SVG_PASS, caption: '창 사이 데이터 전달 네 가지 — 주 창 → 새 창: 생성자 · 속성 / 새 창 → 주 창: DialogResult + 속성 · 이벤트' },
          { type: 'table', head: ['방법', '방향 · 시점', '이 장의 예'], rows: [
            ['생성자 매개변수', '주 창 → 새 창, 만들 때 (꼭 필요한 값)', '<code>new InputDialog("질문", "기본값")</code>, <code>new ChatWindow(name)</code>'],
            ['속성 (쓰기)', '주 창 → 새 창, <code>ShowDialog()</code> 전 (선택적인 값)', '<code>dlg.SelectedFontSize = txtMemo.FontSize;</code>'],
            ['속성 (읽기)', '새 창 → 주 창, 닫힌 뒤', '<code>dlg.Answer</code>, <code>w.SentCount</code>'],
            ['이벤트', '새 창 → 주 창, 열려 있는 동안 언제든 (모덜리스에 알맞음)', '<code>w.MessageSent += …</code>, <code>w.Closed += …</code>']
          ] },
          { type: 'code', title: '예제 21-10. 대화 창 — 생성자 · 이벤트 · 속성으로 주고받기', code: EX_PASS, desc: '주 창에 이름을 적고 <b>대화 창 열기</b>를 누르면, 이름이 <b>생성자 매개변수</b>로 <code>ChatWindow</code> 에 전달되어 제목과 인사말이 됩니다. 대화 창은 모덜리스라 이름을 바꿔 여러 개를 띄울 수 있습니다. 대화 창에서 <b>보내기</b>를 누르면 <code>MessageSent</code> <b>이벤트</b>가 발생하고, 구독해 둔 주 창의 <code>ChatWindow_MessageSent</code> 가 목록에 메시지를 추가합니다 — 새 창은 주 창의 <code>lstMessages</code> 를 전혀 몰라도 됩니다. 대화 창을 닫으면 <code>Closed</code> 이벤트에서 <code>w.UserName</code> · <code>w.SentCount</code> <b>속성</b>을 읽어 “보낸 메시지 n개” 를 보여 줍니다. <code>EventHandler&lt;string&gt;</code> 은 “string 하나를 실어 보내는 이벤트” 이고, 처리기의 모양은 <code>(object? sender, string text)</code> 입니다.' },
          { type: 'callout', kind: 'tip', title: '새 창이 주 창의 컨트롤을 직접 만지지 않게', html: '새 창 코드에서 <code>((MainWindow)Owner).lstMessages.Items.Add(…)</code> 처럼 주 창의 컨트롤을 직접 건드릴 수도 있지만 좋지 않습니다. 새 창이 주 창의 속사정(컨트롤 이름 · 구조)에 <b>묶여 버려서</b>, 주 창을 고치면 새 창도 고쳐야 하고 다른 창에서 재사용할 수도 없습니다. 예제처럼 새 창은 <b>이벤트로 “이런 일이 있었다” 고 알리기만</b> 하고, 무엇을 할지는 주 창이 정하게 하세요. 20장의 MVVM 도 같은 생각입니다.' },
          { type: 'h', text: '설정 창 — 속성으로 주고받는 모달 대화상자' },
          { type: 'p', html: '“도구 ▸ 옵션” 같은 설정 창은 사용자 정의 대화상자의 대표 예입니다. 흐름은 항상 같습니다: ① 지금 설정을 대화상자의 <b>속성에 넣고</b> → ② <code>ShowDialog()</code> → ③ <code>true</code> 이면 대화상자의 속성을 <b>읽어 적용</b>, <code>false</code>(취소)면 아무것도 바꾸지 않습니다. 대화상자 안에서는 <code>Loaded</code> 때 속성 값을 컨트롤에 채우고, 확인 때 컨트롤 값을 속성에 담습니다.' },
          { type: 'code', title: '예제 21-11. 글꼴 설정 창 — 크기 · 굵게 · 줄 바꿈', code: EX_SETTINGS, desc: '주 창의 <b>도구 ▸ 글꼴 설정...</b> 을 누르면 <code>SettingsWindow</code> 가 모달로 뜹니다. 주 창은 먼저 지금 글자 크기 · 굵기 · 줄 바꿈을 <code>dlg.SelectedFontSize</code> 등 <b>속성에 넣고</b>, 설정 창은 <code>Window_Loaded</code> 에서 그 값을 콤보 상자 · 체크 상자에 채웁니다. 확인을 누르면 <code>BtnOk_Click</code> 이 화면 값을 다시 속성에 담고 <code>DialogResult = true</code> 로 닫히며, 주 창은 <code>ShowDialog() == true</code> 일 때만 새 값을 적용합니다. 취소하면 설정 창 안에서 무엇을 바꿨든 주 창은 그대로입니다 — 이것이 “확인 / 취소” 대화상자의 약속입니다. 크기 목록은 배열 <code>Sizes</code> 로 채우고, <code>Array.IndexOf</code> 로 지금 크기의 위치를 찾습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Application.Current.MainWindow 와 종료 시점', html: '<ul><li>어디서든 <code>Application.Current.MainWindow</code> 로 <b>주 창</b>(처음 뜬 창)을 얻을 수 있습니다. <code>Application.Current.Windows</code> 는 지금 열린 모든 창의 목록입니다.</li><li>WPF 앱은 기본적으로 <b>마지막 창이 닫힐 때</b> 끝납니다(<code>ShutdownMode="OnLastWindowClose"</code>). <code>Owner</code> 를 정하지 않은 모덜리스 창이 남아 있으면 주 창을 닫아도 프로그램이 계속 실행됩니다. <code>App.xaml</code> 에 <code>ShutdownMode="OnMainWindowClose"</code> 를 주면 주 창이 닫힐 때 끝납니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 21-3. 연락처 추가 대화상자',
            level: 2,
            desc: '<p><b>연락처 추가...</b> 버튼을 누르면 이름과 전화번호를 입력받는 <code>ContactDialog</code> 가 모달로 뜨게 하세요. 화면(XAML)은 두 창 모두 만들어져 있습니다.</p><ul><li><code>ContactDialog</code> 에 결과 속성 <code>ContactName</code> · <code>Phone</code>(밖에서는 읽기만)을 만듭니다.</li><li>확인을 눌렀을 때 <b>이름이 비어 있으면</b> 메시지 상자로 알리고 창을 <b>닫지 않습니다</b>. 아니면 속성에 값을 담고 <code>DialogResult = true</code>.</li><li>취소 버튼은 <code>IsCancel="True"</code> 라 처리기가 필요 없습니다.</li><li>주 창은 확인일 때만 <code>홍길동 (010-1234-5678)</code> 형식으로 목록에 추가하고 <code>연락처 n명</code> 을 표시합니다. 전화번호가 비어 있으면 <code>(번호 없음)</code>.</li></ul>',
            hint: '속성: <code>public string ContactName { get; private set; } = "";</code>. 주 창: <code>ContactDialog dlg = new ContactDialog(); dlg.Owner = this; if (dlg.ShowDialog() == true) { … }</code>. <code>DialogResult</code> 를 정하지 않고 <code>return</code> 하면 창은 그대로 남습니다.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 21-4. 색상 설정 창 — 고른 색을 주 창 배경에',
            level: 3,
            desc: '<p><b>배경색 설정...</b> 을 누르면 색 목록이 있는 <code>ColorWindow</code> 가 뜨고, 확인을 누르면 고른 색이 <b>주 창의 배경</b>이 되게 하세요.</p><ul><li><code>ColorWindow</code> 는 생성자로 <b>지금 색 번호</b>를 받아 목록에서 미리 골라 둡니다(이미 작성됨).</li><li>목록에서 색을 고를 때마다 오른쪽 <b>미리 보기</b> 칸(<code>preview</code>)의 배경이 바뀝니다.</li><li>결과 속성 <code>SelectedIndex</code> · <code>SelectedName</code> · <code>SelectedBrush</code> 를 만듭니다.</li><li>주 창은 확인일 때만 <code>Background</code> 를 바꾸고, 색 번호를 기억해 두었다가 다음에 열 때 넘겨 주며, <code>현재 배경: 하늘색</code> 처럼 표시합니다. 취소하면 아무것도 바뀌지 않아야 합니다.</li></ul>',
            hint: '읽기 전용 식 본문 속성: <code>public Brush SelectedBrush =&gt; brushes[SelectedIndex];</code>. 미리 보기: <code>preview.Background = brushes[lstColors.SelectedIndex];</code>(<code>SelectedIndex &lt; 0</code> 이면 return). 주 창의 배경은 <code>this.Background</code>, 즉 그냥 <code>Background = …</code> 입니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '아래 코드에서 설정 창이 <b>떠 있는 동안</b> <code>lblLog</code> 에 보이는 글자는?<pre><code>lblLog.Text = "A";\nSettingsWindow dlg = new SettingsWindow();\ndlg.Owner = this;\ndlg.ShowDialog();\nlblLog.Text += "B";</code></pre>', options: ['AB', 'A', 'B', '빈 칸'], answer: 1, explain: '<code>ShowDialog()</code> 는 창이 <b>닫힐 때까지</b> 그 줄에서 기다립니다. 창이 떠 있는 동안은 "A", 닫은 뒤에야 "AB" 가 됩니다. <code>Show()</code> 였다면 곧바로 "AB" 입니다.' },
          { q: '열기 대화상자에서 사용자가 파일을 골랐는지(열기를 눌렀는지) 확인하는 올바른 코드는?', options: ['<code>if (dlg.ShowDialog())</code>', '<code>if (dlg.ShowDialog() == "OK")</code>', '<code>if (dlg.ShowDialog() == true)</code>', '<code>if (dlg.FileName != null)</code>'], answer: 2, explain: '<code>ShowDialog()</code> 의 반환형은 <code>bool?</code> 이라 <code>if</code> 에 바로 넣으면 컴파일 오류입니다. <code>== true</code> 로 비교합니다.' },
          { q: '모달로 연 사용자 정의 대화상자의 확인 버튼 처리기에서 <code>DialogResult = true;</code> 를 실행하면?', options: ['창이 닫히고, 이 창을 연 ShowDialog() 가 true 를 돌려준다', '아무 일도 없다 — Close() 를 따로 불러야 닫힌다', '주 창이 닫힌다', '창은 그대로이고 확인 버튼만 비활성이 된다'], answer: 0, explain: '모달 창은 <code>DialogResult</code> 를 정하는 순간 저절로 닫히고, 그 값이 <code>ShowDialog()</code> 의 반환값이 됩니다.' },
          { q: '<code>dlg.Filter = "그림 파일 (*.png;*.jpg)|*.png;*.jpg|모든 파일 (*.*)|*.*";</code> 일 때, 대화상자의 파일 종류 목록에는 선택지가 몇 개 보일까?', options: ['1개', '2개', '3개', '4개'], answer: 1, explain: '<code>|</code> 로 나눈 조각을 <b>두 개씩</b>(보이는 이름 | 패턴) 묶어 읽습니다. 조각 4개 → 선택지 2개: “그림 파일 (*.png;*.jpg)” 과 “모든 파일 (*.*)”.' },
          { q: '창의 <code>Closing</code> 이벤트 처리기에서 <code>e.Cancel = true;</code> 를 하면?', options: ['창이 곧바로 닫힌다', '프로그램이 강제 종료된다', '창 닫기가 취소되어 창이 그대로 남는다', 'Closed 이벤트가 두 번 발생한다'], answer: 2, explain: '<code>Closing</code> 은 닫히기 <b>직전</b>에 오며, <code>e.Cancel = true</code> 로 닫기를 취소할 수 있습니다. “저장할까요?” 에서 <b>취소</b>를 누른 경우에 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '대화상자와 여러 창', subtitle: 'Chapter 21 · Section 02 — 묻고, 고르고, 주고받기', badge: '21-2',
            notes: '<p><b>[도입 2분]</b> 메모장에서 “다른 이름으로 저장” 을 누르면 무엇이 뜨나요? → 파일 저장 창. 그 창이 떠 있는 동안 메모장 본문을 클릭할 수 있나요? → 없다. 오늘은 이런 “대화상자” 와 여러 창을 다룹니다.</p><p>목표: 메모장 열기 · 저장 완성, 직접 만든 입력 창, 창 사이 데이터 전달.</p>' },
          { layout: 'table', title: 'MessageBox 복습', head: ['', '값'], rows: [
            ['버튼 <code>MessageBoxButton</code>', '<code>OK</code> · <code>OKCancel</code> · <code>YesNo</code> · <code>YesNoCancel</code>'],
            ['아이콘 <code>MessageBoxImage</code>', '<code>Information</code> · <code>Warning</code> · <code>Error</code> · <code>Question</code>'],
            ['결과 <code>MessageBoxResult</code>', '<code>OK</code> · <code>Cancel</code> · <code>Yes</code> · <code>No</code>'],
            ['모양', '<code>MessageBox.Show(내용, 제목, 버튼, 아이콘)</code>']],
            lead: '알리기만 하면 결과를 버리고, 물어보면 결과로 분기',
            notes: '<p><b>[3분]</b> 13장부터 써 온 MessageBox 를 정리합니다. MessageBox 도 “모달” — 누를 때까지 다음 줄로 안 간다는 점을 여기서 처음 이름 붙여 줍니다.</p><p>YesNoCancel 에서 ✕ 는 Cancel, YesNo 에서는 ✕ 가 꺼진다는 점도 언급.</p>' },
          { layout: 'code', title: '예제 21-6. 결과로 분기하기', code: SL_MSGBOX, points: ['<code>YesNoCancel</code> + <code>Question</code>', '결과를 <code>MessageBoxResult r</code> 로 받기', '예 · 아니요 · 취소 세 갈래', '본문 예제: 다섯 가지 조합'],
            notes: '<p><b>[3분]</b> 세 버튼을 각각 눌러 결과를 확인. 발문: “이 질문은 어디서 본 적 있죠?” → 메모장 닫을 때. 오늘 그걸 직접 만듭니다.</p>' },
          { layout: 'bullets', title: '파일 대화상자 — OpenFileDialog · SaveFileDialog', lead: '대화상자는 “고르기만”, 읽고 쓰기는 File 클래스',
            bullets: ['<code>using Microsoft.Win32;</code>', '<code>Filter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*"</code>', ['<code>|</code> 로 나눈 조각을 두 개씩: 보이는 이름 | 패턴'], '<code>if (dlg.ShowDialog() == true)</code> — 반환형 <code>bool?</code>', '<code>dlg.FileName</code> = 고른 파일의 전체 경로', '<code>File.ReadAllText</code> · <code>File.WriteAllText</code> (10장)'],
            notes: '<p><b>[4분]</b> Filter 문자열을 칠판에 적고 | 로 잘라 두 개씩 묶어 보게 합니다(퀴즈 4번과 연결).</p><p><code>if (dlg.ShowDialog())</code> 가 왜 컴파일 오류인지 — bool? (12장 널 허용 형식) 복습.</p><p>브라우저에서는 PC 디스크가 아니라 브라우저 메모리 안의 작업 폴더라는 점 안내.</p>' },
          { layout: 'code', title: '파일 열기 — 최소 코드', code: SL_OPEN, points: ['연습용 파일을 먼저 만든다', '<code>Filter</code> 로 종류 거르기', '<code>== true</code> 일 때만 읽기', '본문 예제 21-7: 저장 · 닫기 전 확인까지 완성'],
            notes: '<p><b>[5분]</b> 실행 → 열기 → 인사.txt 선택 → 내용 표시. 취소도 눌러 아무 일 없는 것 확인.</p><p>이어서 본문 예제 21-7(메모장 완성)을 실행해 열기 · 고치기 · Ctrl+S · 새 이름 저장 · ✕ 로 닫기(저장 확인)까지 시연합니다. SaveMemo 가 bool 을 돌려주는 이유(저장 대화상자 취소 처리)를 짚어 주세요.</p>' },
          { layout: 'diagram', title: '모달 vs 모덜리스', html: SVG_MODAL, caption: 'ShowDialog() = 닫힐 때까지 기다림 / Show() = 바로 돌아옴',
            notes: '<p><b>[3분]</b> 발문: “찾기 창은 모달일까 모덜리스일까?” → 찾으면서 본문도 봐야 하니 모덜리스. “저장할까요?” 는? → 대답을 들어야 다음으로 가니 모달.</p>' },
          { layout: 'code', title: '예제 21-8. ShowDialog() vs Show()', code: SL_MODAL, points: ['코드로 만든 <code>Window</code> 도 창', '모달: 닫은 <b>뒤에</b> 기록이 찍힘', '모덜리스: <b>바로</b> 찍히고 여러 개 가능', '<code>Owner = this</code> — 주인 창 위에'],
            notes: '<p><b>[5분]</b> 모달 버튼 → 기록이 안 찍힘 → 주 창 클릭해도 반응 없음 → 창 닫기 → 기록. 모덜리스 버튼을 여러 번 눌러 창이 여러 개 뜨는 것 확인.</p><p>본문 예제 21-8 은 ChildWindow.xaml 을 따로 만든 버전이고 Closed 이벤트까지 보여 줍니다. Owner 의 효과(주인 창 닫으면 같이 닫힘)도 시연해 보세요.</p>' },
          { layout: 'two', title: '사용자 정의 대화상자 — InputDialog', left: { title: 'InputDialog.xaml (버튼 부분)', code: '<Window ... WindowStartupLocation="CenterOwner"\n        ResizeMode="NoResize">\n  ...\n  <TextBox x:Name="txtAnswer"/>\n  <!-- Enter = 확인 -->\n  <Button Content="확인" IsDefault="True"\n          Click="BtnOk_Click"/>\n  <!-- Esc = 취소, 처리기 없이 닫힘 -->\n  <Button Content="취소" IsCancel="True"/>', run: false }, right: { title: 'InputDialog.xaml.cs · 주 창', code: 'public string Answer { get; private set; } = "";\n\nprivate void BtnOk_Click(object s, RoutedEventArgs e)\n{\n    if (txtAnswer.Text.Trim() == "") return; // 닫지 않음\n    Answer = txtAnswer.Text.Trim();\n    DialogResult = true;          // 닫히며 true 반환\n}\n\n// 주 창\nvar dlg = new InputDialog("할 일?", "");\ndlg.Owner = this;\nif (dlg.ShowDialog() == true) lst.Items.Add(dlg.Answer);', run: false },
            notes: '<p><b>[6분]</b> 본문 예제 21-9 를 실행하며 네 요소(IsDefault · IsCancel · DialogResult · 속성)를 하나씩 짚습니다. 빈 칸으로 확인 → 창이 안 닫힘, Esc → 취소.</p><p>VS 에서 새 창 추가: 프로젝트 오른쪽 클릭 → 추가 → 창(WPF). 매개변수 생성자로 바꿔도 InitializeComponent() 는 첫 줄에 남긴다!</p><p>주의: DialogResult 는 ShowDialog 로 연 창에서만(Show 로 연 창이면 예외).</p>' },
          { layout: 'diagram', title: '창 사이 데이터 전달', html: SVG_PASS, caption: '열기 전: 생성자 · 속성 / 닫힌 뒤: DialogResult + 속성 / 열린 동안: 이벤트',
            notes: '<p><b>[5분]</b> “창도 클래스다(8장)” 가 핵심. 클래스끼리 값을 주고받는 방법 그대로.</p><p>예제 21-10(대화 창)을 실행: 이름을 바꿔 두 창을 열고 번갈아 보내기 → 주 창 목록에 쌓임(이벤트) → 닫으면 보낸 개수(속성). 예제 21-11(설정 창)은 “속성에 넣고 → ShowDialog → true 면 읽기” 패턴. 새 창이 주 창 컨트롤을 직접 만지지 않게 하라는 팁도.</p>' },
          { layout: 'code', title: '창 닫기 전에 저장 확인 — Closing', code: SL_CLOSING, points: ['<code>Closing</code> = 닫히기 <b>직전</b>', '바뀐 게 있을 때만 묻기 (<code>isDirty</code>)', '취소 → <code>e.Cancel = true</code>', '예 → 저장하고 닫힘, 아니요 → 그냥 닫힘'],
            notes: '<p><b>[3분]</b> 17장에서 본 Closing 을 파일 저장과 연결합니다. 글을 쓰고 ✕ → 취소 → 창이 남는 것 확인.</p><p>예제 21-7 에서는 “예” 를 눌렀는데 저장 대화상자에서 취소하면 닫기도 취소됩니다 — ConfirmSave 가 SaveMemo 의 bool 결과를 그대로 돌려주는 덕분.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '대화상자의 취소 버튼에 <code>IsCancel="True"</code> 를 주면?', options: ['Esc 를 누르거나 클릭하면 DialogResult = false 로 창이 닫힌다', 'Enter 키와 연결된다', '버튼이 숨겨진다', '처리기에서 Close() 를 불러야만 닫힌다'], answer: 0, explain: '<code>IsCancel</code> 버튼은 처리기가 없어도 <code>DialogResult = false</code> 로 모달 창을 닫습니다. Enter 는 <code>IsDefault</code> 입니다.',
            notes: '<p>정답 후 “IsDefault 버튼은 누르면 저절로 닫힐까?” → 아니요, Enter 와 연결될 뿐 닫기는 Click 에서 DialogResult = true.</p>' },
          { layout: 'practice', title: '실습 21-3. 연락처 추가 대화상자', desc: '<p><code>ContactDialog</code> 에 <code>ContactName</code> · <code>Phone</code> 속성을 만들고, 확인 때 이름이 비어 있으면 알리고 창 유지, 아니면 <code>DialogResult = true</code>. 주 창은 확인일 때만 <code>이름 (전화번호)</code> 를 목록에 추가. 도전: 실습 21-4(색상 설정 창).</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[9분]</b> 흔한 실수: ① 주 창에서 <code>if (dlg.ShowDialog())</code> → 컴파일 오류(bool?). ② Owner 를 안 줘서 CenterOwner 가 동작 안 함. ③ 이름이 비었을 때 return 을 빠뜨려 DialogResult 까지 실행.</p><p>빨리 끝난 학생은 실습 21-4 — 미리 보기(SelectionChanged)와 “지금 색을 넘겨 주고 다시 받기” 가 핵심입니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>MessageBox</code>: 버튼 · 아이콘 · <code>MessageBoxResult</code> 로 분기', '<code>OpenFileDialog</code> · <code>SaveFileDialog</code>: <code>Filter</code> · <code>FileName</code> · <code>ShowDialog() == true</code>', '모달 <code>ShowDialog()</code> = 기다림 / 모덜리스 <code>Show()</code> = 바로 돌아옴', '대화상자: <code>IsDefault</code> · <code>IsCancel</code> · <code>DialogResult = true</code> · 결과 속성', '창 사이: 생성자 · 속성 · 이벤트, <code>Owner</code> + <code>CenterOwner</code>, <code>Closing</code> 에서 저장 확인'],
            notes: '<p>다음 장: 22장 그래픽 — 도형 · 브러시 · 변환 · 애니메이션. 오늘 만든 메모장과 대화상자 패턴은 프로젝트(P08 등)에서 계속 씁니다.</p>' }
        ]
      }
    ]
  });
})();
