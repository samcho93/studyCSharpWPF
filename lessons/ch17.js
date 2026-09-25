/* Chapter 17. 이벤트 처리 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 그림 1. 입력 → 이벤트 → 처리기 ---------- */
  const SVG_INPUT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="사용자 입력이 이벤트가 되어 처리기로 전달되는 과정">
  <defs><marker id="ah17a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <g>
    <rect x="30" y="50" width="260" height="190" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="160" y="92" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--warn)">① 사용자 행동</text>
    <text x="160" y="140" text-anchor="middle" style="font-size:20px;fill:var(--fg)">마우스 클릭 · 이동 · 휠</text>
    <text x="160" y="178" text-anchor="middle" style="font-size:20px;fill:var(--fg)">키보드 누름 · 뗌</text>
    <text x="160" y="216" text-anchor="middle" style="font-size:18px;fill:var(--muted)">언제 올지 모른다</text>
  </g>
  <g>
    <rect x="350" y="50" width="260" height="190" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="480" y="92" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">② WPF 가 판단</text>
    <text x="480" y="140" text-anchor="middle" style="font-size:20px;fill:var(--fg)">마우스: 어느 요소 위?</text>
    <text x="480" y="178" text-anchor="middle" style="font-size:20px;fill:var(--fg)">키보드: 포커스는 어디?</text>
    <text x="480" y="216" text-anchor="middle" style="font-size:18px;fill:var(--muted)">→ 이벤트 받을 요소 결정</text>
  </g>
  <g>
    <rect x="670" y="50" width="260" height="190" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="800" y="92" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">③ 이벤트 발생</text>
    <text x="800" y="138" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">MouseDown</text>
    <text x="800" y="172" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">MouseMove</text>
    <text x="800" y="206" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">KeyDown …</text>
  </g>
  <g>
    <rect x="990" y="50" width="260" height="190" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1120" y="92" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">④ 처리기 실행</text>
    <text x="1120" y="138" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">Board_MouseDown(</text>
    <text x="1120" y="170" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">  object sender,</text>
    <text x="1120" y="202" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">  …EventArgs e)</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="292" y1="145" x2="344" y2="145" marker-end="url(#ah17a)"/>
    <line x1="612" y1="145" x2="664" y2="145" marker-end="url(#ah17a)"/>
    <line x1="932" y1="145" x2="984" y2="145" marker-end="url(#ah17a)"/>
    <line x1="1120" y1="242" x2="1120" y2="292" marker-end="url(#ah17a)"/>
  </g>
  <rect x="30" y="300" width="1220" height="230" rx="16" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="640" y="340" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">e 에 담겨 오는 정보 — “무슨 일이 어떻게 일어났나”</text>
  <g style="font-size:20px">
    <text x="60" y="390" style="font-weight:700;fill:var(--accent2)">마우스</text>
    <text x="200" y="390" style="${MONO};fill:var(--fg)">e.GetPosition(요소)</text>
    <text x="520" y="390" style="fill:var(--muted)">위치(X, Y)</text>
    <text x="700" y="390" style="${MONO};fill:var(--fg)">e.ChangedButton · e.ClickCount</text>
    <text x="60" y="440" style="font-weight:700;fill:var(--accent2)">휠</text>
    <text x="200" y="440" style="${MONO};fill:var(--fg)">e.Delta</text>
    <text x="520" y="440" style="fill:var(--muted)">위로 +120 / 아래로 −120</text>
    <text x="60" y="490" style="font-weight:700;fill:var(--accent2)">키보드</text>
    <text x="200" y="490" style="${MONO};fill:var(--fg)">e.Key</text>
    <text x="520" y="490" style="fill:var(--muted)">누른 키</text>
    <text x="700" y="490" style="${MONO};fill:var(--fg)">Keyboard.Modifiers</text>
    <text x="1010" y="490" style="fill:var(--muted)">Ctrl · Shift · Alt</text>
  </g>
</svg>`;

  /* ---------- 그림 2. Canvas 좌표와 원의 위치 ---------- */
  const SVG_COORD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Canvas 좌표계와 클릭한 곳을 중심으로 원을 놓는 방법">
  <defs><marker id="ah17b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <rect x="80" y="70" width="680" height="440" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="740" y="495" text-anchor="end" style="font-size:22px;fill:var(--muted)">Canvas (board)</text>
  <circle cx="80" cy="70" r="7" fill="var(--danger)"/>
  <text x="70" y="52" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--danger)">(0, 0)</text>
  <g stroke="var(--accent2)" stroke-width="3">
    <line x1="80" y1="70" x2="300" y2="70" marker-end="url(#ah17b)"/>
    <line x1="80" y1="70" x2="80" y2="250" marker-end="url(#ah17b)"/>
  </g>
  <text x="310" y="60" style="font-size:22px;font-weight:700;fill:var(--accent2)">X →</text>
  <text x="92" y="262" style="font-size:22px;font-weight:700;fill:var(--accent2)">Y ↓</text>
  <g stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 6">
    <line x1="80" y1="270" x2="430" y2="270"/>
    <line x1="430" y1="70" x2="430" y2="270"/>
  </g>
  <rect x="390" y="230" width="80" height="80" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="430" cy="270" r="40" fill="var(--accent)" opacity="0.35" stroke="var(--accent)" stroke-width="3"/>
  <circle cx="430" cy="270" r="7" fill="var(--danger)"/>
  <text x="450" y="350" style="${MONO};font-size:20px;fill:var(--danger)">클릭 p = (350, 200)</text>
  <circle cx="390" cy="230" r="7" fill="var(--warn)"/>
  <text x="380" y="215" text-anchor="end" style="${MONO};font-size:20px;fill:var(--warn)">(Left, Top) = (310, 160)</text>
  <g style="font-size:21px">
    <text x="800" y="110" style="font-weight:700;fill:var(--fg)">① 좌표 얻기</text>
    <text x="800" y="145" style="${MONO};fill:var(--fg)">Point p = e.GetPosition(board);</text>
    <text x="800" y="178" style="fill:var(--muted)">board 의 왼쪽 위가 (0, 0)</text>
    <text x="800" y="238" style="font-weight:700;fill:var(--fg)">② 원(지름 80)의 자리 정하기</text>
    <text x="800" y="273" style="fill:var(--muted)">Canvas.Left/Top 은 “왼쪽 위 모서리”</text>
    <text x="800" y="310" style="${MONO};fill:var(--fg)">Canvas.SetLeft(c, p.X - 40);</text>
    <text x="800" y="345" style="${MONO};fill:var(--fg)">Canvas.SetTop(c, p.Y - 40);</text>
    <text x="800" y="405" style="font-weight:700;fill:var(--ok)">③ 반지름만큼 빼면</text>
    <text x="800" y="440" style="font-weight:700;fill:var(--ok)">클릭한 곳이 원의 중심!</text>
  </g>
</svg>`;

  /* ---------- 그림 3. 라우트된 이벤트: 터널링 · 버블링 ---------- */
  const SVG_ROUTE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="PreviewMouseDown 은 위에서 아래로, MouseDown 은 아래에서 위로 전달된다">
  <defs>
    <marker id="ah17c" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
    <marker id="ah17d" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  <g style="${MONO};font-size:23px">
    <rect x="490" y="40" width="300" height="66" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="640" y="82" text-anchor="middle" style="fill:var(--fg)">Window</text>
    <rect x="490" y="160" width="300" height="66" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="640" y="202" text-anchor="middle" style="fill:var(--fg)">Grid</text>
    <rect x="490" y="280" width="300" height="66" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="640" y="322" text-anchor="middle" style="fill:var(--fg)">Border</text>
    <rect x="490" y="400" width="300" height="66" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
    <text x="640" y="442" text-anchor="middle" style="fill:var(--fg)">TextBlock  ← 클릭!</text>
  </g>
  <g stroke="var(--line)" stroke-width="3">
    <line x1="640" y1="106" x2="640" y2="160"/>
    <line x1="640" y1="226" x2="640" y2="280"/>
    <line x1="640" y1="346" x2="640" y2="400"/>
  </g>
  <line x1="420" y1="60" x2="420" y2="440" stroke="var(--danger)" stroke-width="6" marker-end="url(#ah17c)"/>
  <text x="390" y="150" text-anchor="end" style="font-size:26px;font-weight:700;fill:var(--danger)">① 터널링</text>
  <text x="390" y="186" text-anchor="end" style="font-size:20px;fill:var(--danger)">Tunneling · 위 → 아래</text>
  <text x="390" y="240" text-anchor="end" style="${MONO};font-size:21px;fill:var(--fg)">PreviewMouseDown</text>
  <text x="390" y="276" text-anchor="end" style="font-size:19px;fill:var(--muted)">이름이 Preview 로 시작</text>
  <text x="390" y="306" text-anchor="end" style="font-size:19px;fill:var(--muted)">먼저 발생 · 미리 검사용</text>
  <line x1="860" y1="440" x2="860" y2="60" stroke="var(--accent)" stroke-width="6" marker-end="url(#ah17d)"/>
  <text x="890" y="150" style="font-size:26px;font-weight:700;fill:var(--accent)">② 버블링</text>
  <text x="890" y="186" style="font-size:20px;fill:var(--accent)">Bubbling · 아래 → 위</text>
  <text x="890" y="240" style="${MONO};font-size:21px;fill:var(--fg)">MouseDown</text>
  <text x="890" y="276" style="font-size:19px;fill:var(--muted)">거품처럼 부모로 올라감</text>
  <text x="890" y="306" style="font-size:19px;fill:var(--muted)">대부분의 이벤트</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:21px;fill:var(--fg)">③ 직접(Direct): MouseEnter · MouseLeave 는 그 요소에서만 발생 — 전달되지 않는다</text>
  <text x="640" y="548" text-anchor="middle" style="font-size:19px;fill:var(--muted)">어느 단계에서든 e.Handled = true 로 하면 “처리 끝” — 그다음 처리기들은 불리지 않는다</text>
</svg>`;

  /* ---------- 그림 4. 명령(Command) ---------- */
  const SVG_CMD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메뉴 · 버튼 · 단축키가 같은 명령을 실행하고 CanExecute 가 활성 상태를 정한다">
  <defs><marker id="ah17e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="170" y="40" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">명령을 부르는 곳</text>
  <g style="font-size:21px">
    <rect x="30" y="65" width="280" height="80" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="170" y="100" text-anchor="middle" style="fill:var(--fg)">메뉴  파일 ▸ 저장</text>
    <text x="170" y="130" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">MenuItem Command=…</text>
    <rect x="30" y="185" width="280" height="80" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="170" y="220" text-anchor="middle" style="fill:var(--fg)">도구 버튼  [저장]</text>
    <text x="170" y="250" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Button Command=…</text>
    <rect x="30" y="305" width="280" height="80" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="170" y="340" text-anchor="middle" style="fill:var(--fg)">단축키  Ctrl+S</text>
    <text x="170" y="370" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">KeyBinding</text>
  </g>
  <rect x="400" y="170" width="330" height="110" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="565" y="212" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">명령 (ICommand)</text>
  <text x="565" y="252" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">ApplicationCommands.Save</text>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="312" y1="105" x2="396" y2="195" marker-end="url(#ah17e)"/>
    <line x1="312" y1="225" x2="396" y2="225" marker-end="url(#ah17e)"/>
    <line x1="312" y1="345" x2="396" y2="255" marker-end="url(#ah17e)"/>
    <line x1="732" y1="225" x2="806" y2="225" marker-end="url(#ah17e)"/>
  </g>
  <rect x="810" y="40" width="440" height="380" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1030" y="80" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">CommandBinding (창에 등록)</text>
  <rect x="840" y="105" width="380" height="130" rx="12" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="860" y="143" style="${MONO};font-size:21px;font-weight:700;fill:var(--fg)">Executed</text>
  <text x="860" y="180" style="font-size:20px;fill:var(--fg)">“실제로 할 일” — 저장하기</text>
  <text x="860" y="214" style="${MONO};font-size:18px;fill:var(--muted)">Save_Executed(sender, e)</text>
  <rect x="840" y="255" width="380" height="140" rx="12" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="860" y="293" style="${MONO};font-size:21px;font-weight:700;fill:var(--fg)">CanExecute</text>
  <text x="860" y="330" style="font-size:20px;fill:var(--fg)">“지금 할 수 있나?” → true/false</text>
  <text x="860" y="366" style="${MONO};font-size:18px;fill:var(--muted)">e.CanExecute = 글이 있으면;</text>
  <path d="M1030,425 C1030,500 170,510 170,392" fill="none" stroke="var(--danger)" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#ah17e)"/>
  <text x="640" y="492" text-anchor="middle" style="font-size:21px;fill:var(--danger)">false 이면 메뉴 · 버튼 · 단축키가 한꺼번에 자동 비활성</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:20px;fill:var(--muted)">“무엇을 할지” 는 한 곳(명령)에 — 부르는 곳이 여러 개여도 코드는 하나</text>
</svg>`;

  /* ======================= 17-1 예제 코드 ======================= */
  const EX_MOUSE = `// ===== File: MainWindow.xaml =====
<Window x:Class="MouseInfo.MainWindow"
        ${NS}
        Title="마우스 이벤트 살펴보기" Width="460" Height="340">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Margin="10,8">
            <TextBlock x:Name="lblPos" Text="위치: (아래 영역으로 마우스를 옮겨 보세요)" FontSize="15"/>
            <TextBlock x:Name="lblButton" Text="버튼: -" FontSize="15" Margin="0,4,0,0"/>
        </StackPanel>
        <!-- Background 가 있어야 빈 곳에서도 마우스 이벤트를 받는다 -->
        <Border x:Name="area" Margin="10" Background="WhiteSmoke"
                BorderBrush="Gray" BorderThickness="3"
                MouseEnter="Area_MouseEnter" MouseLeave="Area_MouseLeave"
                MouseMove="Area_MouseMove" MouseDown="Area_MouseDown">
            <TextBlock Text="이 영역에서 움직이고 · 눌러 보세요" Foreground="Gray"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;    // MouseEventArgs, MouseButtonEventArgs
using System.Windows.Media;

namespace MouseInfo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 마우스가 영역 안으로 들어올 때 (한 번)
        private void Area_MouseEnter(object sender, MouseEventArgs e)
        {
            area.BorderBrush = Brushes.DodgerBlue;
        }

        // 마우스가 영역 밖으로 나갈 때 (한 번)
        private void Area_MouseLeave(object sender, MouseEventArgs e)
        {
            area.BorderBrush = Brushes.Gray;
            lblPos.Text = "위치: (영역 밖)";
        }

        // 마우스가 움직이는 동안 계속
        private void Area_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(area);   // area 의 왼쪽 위가 (0, 0)
            lblPos.Text = $"위치: ({p.X:F0}, {p.Y:F0})";
        }

        // 아무 버튼이나 누를 때
        private void Area_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // ChangedButton: 어떤 버튼? (Left · Right · Middle)
            // ClickCount   : 연속 클릭 수 (더블클릭이면 2)
            lblButton.Text = $"버튼: {e.ChangedButton}, 클릭 수: {e.ClickCount}";
        }
    }
}`;

  const EX_CIRCLE = `// ===== File: MainWindow.xaml =====
<Window x:Class="ClickCircles.MainWindow"
        ${NS}
        Title="클릭한 곳에 원 그리기" Width="460" Height="360">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="10,8" FontSize="15"
                   Text="클릭: 원 그리기 · 더블클릭: 모두 지우기"/>
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;   // Ellipse

namespace ClickCircles
{
    public partial class MainWindow : Window
    {
        private const double Diameter = 40;   // 원의 지름
        private readonly Brush[] colors =
            { Brushes.Tomato, Brushes.Orange, Brushes.MediumSeaGreen, Brushes.DodgerBlue, Brushes.MediumPurple };

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2)            // 두 번째 연속 클릭 = 더블클릭
            {
                board.Children.Clear();
                lblInfo.Text = "모두 지웠습니다. 다시 클릭해 보세요.";
                return;
            }

            Point p = e.GetPosition(board);   // Canvas 기준 좌표

            Ellipse circle = new Ellipse();
            circle.Width = Diameter;
            circle.Height = Diameter;
            circle.Fill = colors[board.Children.Count % colors.Length];   // 색을 돌아가며

            // Canvas.Left/Top 은 왼쪽 위 모서리 → 반지름만큼 빼야 클릭한 곳이 중심
            Canvas.SetLeft(circle, p.X - Diameter / 2);
            Canvas.SetTop(circle, p.Y - Diameter / 2);
            board.Children.Add(circle);

            lblInfo.Text = $"({p.X:F0}, {p.Y:F0}) 에 원 추가 — 모두 {board.Children.Count}개";
        }
    }
}`;

  const EX_FOLLOW = `// ===== File: MainWindow.xaml =====
<Window x:Class="FollowMouse.MainWindow"
        ${NS}
        Title="마우스를 따라다니는 사각형" Width="460" Height="360">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="10,8" FontSize="14" TextWrapping="Wrap"
                   Text="움직이면 따라옵니다 · 휠: 크기 조절 · 왼쪽 버튼을 누른 채 움직이면 빨간색"/>
        <Canvas x:Name="board" Background="AliceBlue" ClipToBounds="True"
                MouseMove="Board_MouseMove" MouseWheel="Board_MouseWheel"
                MouseLeave="Board_MouseLeave">
            <!-- IsHitTestVisible="False": 사각형은 마우스를 가로채지 않는다 -->
            <Rectangle x:Name="box" Width="40" Height="40" Fill="Orange"
                       RadiusX="6" RadiusY="6" IsHitTestVisible="False"
                       Canvas.Left="200" Canvas.Top="120"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace FollowMouse
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(board);
            MoveBoxTo(p);
            box.Visibility = Visibility.Visible;

            // 움직이는 동안 버튼 상태도 알 수 있다 → 누른 채 움직이기(드래그)
            if (e.LeftButton == MouseButtonState.Pressed)
                box.Fill = Brushes.Crimson;
            else
                box.Fill = Brushes.Orange;
        }

        private void Board_MouseWheel(object sender, MouseWheelEventArgs e)
        {
            // Delta: 위로 굴리면 +120, 아래로 굴리면 -120
            double size = box.Width + (e.Delta > 0 ? 10 : -10);
            if (size < 20) size = 20;
            if (size > 120) size = 120;
            box.Width = size;
            box.Height = size;
            MoveBoxTo(e.GetPosition(board));   // 크기가 바뀌어도 가운데 유지
            lblInfo.Text = $"휠 Delta = {e.Delta}, 크기 = {size}";
        }

        private void Board_MouseLeave(object sender, MouseEventArgs e)
        {
            box.Visibility = Visibility.Hidden;   // 밖으로 나가면 숨기기
        }

        // 사각형의 중심을 p 에 맞추기
        private void MoveBoxTo(Point p)
        {
            Canvas.SetLeft(box, p.X - box.Width / 2);
            Canvas.SetTop(box, p.Y - box.Height / 2);
        }
    }
}`;

  const EX_ARROW = `// ===== File: MainWindow.xaml =====
<Window x:Class="ArrowMove.MainWindow"
        ${NS}
        Title="방향키로 공 움직이기" Width="460" Height="360"
        KeyDown="Window_KeyDown">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="10,8" FontSize="14" TextWrapping="Wrap"
                   Text="창을 한 번 클릭한 뒤 방향키를 누르세요 (Shift+방향키: 크게, Home: 처음 자리)"/>
        <Canvas x:Name="board" Background="Honeydew" ClipToBounds="True">
            <Ellipse x:Name="ball" Width="40" Height="40" Fill="Crimson"
                     Canvas.Left="200" Canvas.Top="110"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;   // KeyEventArgs, Key, Keyboard

namespace ArrowMove
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 창(Window)에 연결했으므로 어디에 포커스가 있든 키 입력이 여기로 온다
        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double step = 10;
            if (Keyboard.Modifiers == ModifierKeys.Shift)   // Shift 를 함께 누르고 있나?
                step = 40;

            double x = Canvas.GetLeft(ball);
            double y = Canvas.GetTop(ball);

            switch (e.Key)                  // 어떤 키인가?
            {
                case Key.Left:  x -= step; break;
                case Key.Right: x += step; break;
                case Key.Up:    y -= step; break;   // 화면 좌표는 위로 갈수록 작아진다
                case Key.Down:  y += step; break;
                case Key.Home:  x = 200; y = 110; break;
                default:
                    lblInfo.Text = $"누른 키: {e.Key} (방향키가 아닙니다)";
                    return;
            }

            Canvas.SetLeft(ball, x);
            Canvas.SetTop(ball, y);
            lblInfo.Text = $"누른 키: {e.Key}, 이동 {step} → 위치 ({x}, {y})";
        }
    }
}`;

  const EX_ENTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="EnterToList.MainWindow"
        ${NS}
        Title="Enter 로 목록에 추가" Width="420" Height="380"
        Loaded="Window_Loaded">
    <DockPanel Margin="12">
        <TextBlock DockPanel.Dock="Top" TextWrapping="Wrap" Margin="0,0,0,6"
                   Text="할 일을 입력하고 Enter · Ctrl+Enter: 중요(★) · Esc: 입력 지우기"/>
        <TextBox x:Name="txtItem" DockPanel.Dock="Top" FontSize="15"
                 KeyDown="TxtItem_KeyDown"/>
        <TextBlock x:Name="lblCount" DockPanel.Dock="Bottom" Margin="0,6,0,0"
                   Text="0개 · 항목을 더블클릭하면 삭제"/>
        <ListBox x:Name="lstItems" Margin="0,8,0,0" FontSize="15"
                 MouseDoubleClick="LstItems_MouseDoubleClick"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;

namespace EnterToList
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 창이 화면에 나타난 직후 → 입력 칸에 커서 두기 (Loaded 는 다음 교시에 자세히)
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            txtItem.Focus();
        }

        private void TxtItem_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                string text = txtItem.Text.Trim();
                if (text == "") return;

                if (Keyboard.Modifiers == ModifierKeys.Control)   // Ctrl+Enter
                    text = "★ " + text;

                lstItems.Items.Add(text);
                txtItem.Clear();
                UpdateCount();
            }
            else if (e.Key == Key.Escape)
            {
                txtItem.Clear();
            }
        }

        // MouseDoubleClick 은 컨트롤(ListBox · Button · Label …)에 있는 이벤트
        private void LstItems_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            object? item = lstItems.SelectedItem;
            if (item != null)
            {
                lstItems.Items.Remove(item);
                UpdateCount();
            }
        }

        private void UpdateCount()
        {
            lblCount.Text = $"{lstItems.Items.Count}개 · 항목을 더블클릭하면 삭제";
        }
    }
}`;

  const EX_FOCUS = `// ===== File: MainWindow.xaml =====
<Window x:Class="FocusDemo.MainWindow"
        ${NS}
        Title="포커스 — 지금 입력받는 칸" Width="400" Height="400">
    <StackPanel Margin="16">
        <TextBlock Text="이름 (필수)"/>
        <TextBox x:Name="txtName" FontSize="15" Margin="0,4,0,10" Tag="이름을 입력하세요. 비워 둘 수 없습니다."
                 GotFocus="Box_GotFocus" LostFocus="Box_LostFocus"/>
        <TextBlock Text="전화번호"/>
        <TextBox x:Name="txtPhone" FontSize="15" Margin="0,4,0,10" Tag="예: 010-1234-5678"
                 GotFocus="Box_GotFocus" LostFocus="Box_LostFocus"/>
        <TextBlock Text="이메일"/>
        <TextBox x:Name="txtMail" FontSize="15" Margin="0,4,0,10" Tag="예: me@example.com"
                 GotFocus="Box_GotFocus" LostFocus="Box_LostFocus"/>
        <TextBlock x:Name="lblHelp" Foreground="SteelBlue" FontSize="14" Text="칸을 클릭하거나 Tab 키로 옮겨 다녀 보세요."/>
        <TextBlock x:Name="lblWarn" Foreground="Crimson" FontSize="14" Margin="0,4,0,10"/>
        <Button Content="이름 칸으로 이동 — Focus()" Height="32" Click="BtnFirst_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace FocusDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 세 칸이 처리기 하나를 함께 쓴다 → sender 로 어느 칸인지 구분
        private void Box_GotFocus(object sender, RoutedEventArgs e)
        {
            TextBox box = (TextBox)sender;
            box.Background = Brushes.LightYellow;   // 지금 입력받는 칸 강조
            lblHelp.Text = $"{box.Tag}";            // Tag 에 적어 둔 도움말
        }

        private void Box_LostFocus(object sender, RoutedEventArgs e)
        {
            TextBox box = (TextBox)sender;
            box.Background = Brushes.White;

            // 칸을 떠날 때 검사하기
            if (box == txtName)
                lblWarn.Text = txtName.Text.Trim() == "" ? "⚠ 이름이 비어 있습니다." : "";
        }

        private void BtnFirst_Click(object sender, RoutedEventArgs e)
        {
            txtName.Focus();   // 코드로 포커스 옮기기
        }
    }
}`;

  /* ======================= 17-1 실습 ======================= */
  const DOT_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="DotCounter.MainWindow"
        ${NS}
        Title="점 찍기" Width="460" Height="360">
    <DockPanel>
        <DockPanel DockPanel.Dock="Top" Margin="10,8">
            <Button x:Name="btnClear" DockPanel.Dock="Right" Content="모두 지우기" Width="100"
                    Click="BtnClear_Click"/>
            <TextBlock x:Name="lblCount" Text="점 개수: 0" FontSize="16" VerticalAlignment="Center"/>
        </DockPanel>
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
    </DockPanel>
</Window>`;

  const P1_STARTER = `${DOT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace DotCounter
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            // TODO 1: e.GetPosition(board) 로 클릭 위치 알아내기
            // TODO 2: 지름 10 인 검은 Ellipse 를 만들어, 클릭한 곳이 중심이 되게 놓기
            // TODO 3: board.Children.Add 로 추가하고 lblCount 에 "점 개수: n" 표시
        }

        private void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 점을 모두 지우고 개수를 0 으로 표시
        }
    }
}`;

  const P1_SOLUTION = `${DOT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace DotCounter
{
    public partial class MainWindow : Window
    {
        private const double Dot = 10;   // 점의 지름

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);

            Ellipse dot = new Ellipse();
            dot.Width = Dot;
            dot.Height = Dot;
            dot.Fill = Brushes.Black;
            Canvas.SetLeft(dot, p.X - Dot / 2);   // 클릭한 곳이 점의 중심
            Canvas.SetTop(dot, p.Y - Dot / 2);
            board.Children.Add(dot);

            lblCount.Text = $"점 개수: {board.Children.Count}";
        }

        private void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            board.Children.Clear();
            lblCount.Text = "점 개수: 0";
        }
    }
}`;

  const MOVE_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="CharacterMove.MainWindow"
        ${NS}
        Title="캐릭터 움직이기" Width="460" Height="370"
        KeyDown="Window_KeyDown">
    <StackPanel Margin="10">
        <TextBlock x:Name="lblInfo" FontSize="14" Margin="0,0,0,8"
                   Text="창을 클릭한 뒤 방향키로 움직이세요"/>
        <!-- 크기를 정해 둔 Canvas: 400 x 250 -->
        <Canvas x:Name="board" Width="400" Height="250" Background="Beige" ClipToBounds="True">
            <Rectangle x:Name="player" Width="30" Height="30" Fill="SteelBlue"
                       RadiusX="4" RadiusY="4" Canvas.Left="185" Canvas.Top="110"/>
        </Canvas>
    </StackPanel>
</Window>`;

  const P2_STARTER = `${MOVE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace CharacterMove
{
    public partial class MainWindow : Window
    {
        private const double Step = 15;   // 한 번에 움직이는 거리

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(player);
            double y = Canvas.GetTop(player);

            if (e.Key == Key.Left) x -= Step;
            // TODO 1: Right · Up · Down 도 처리하기

            // TODO 2: 경계 검사 — x 는 0 ~ (board.Width - player.Width),
            //         y 는 0 ~ (board.Height - player.Height) 를 벗어나지 않게
            //         (Math.Max, Math.Min 사용)
            // TODO 3: 벽에 닿았으면 lblInfo 에 "벽에 닿았습니다!" 표시

            Canvas.SetLeft(player, x);
            Canvas.SetTop(player, y);
            lblInfo.Text = $"위치 ({x}, {y})";
        }
    }
}`;

  const P2_SOLUTION = `${MOVE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace CharacterMove
{
    public partial class MainWindow : Window
    {
        private const double Step = 15;   // 한 번에 움직이는 거리

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(player);
            double y = Canvas.GetTop(player);

            if (e.Key == Key.Left) x -= Step;
            else if (e.Key == Key.Right) x += Step;
            else if (e.Key == Key.Up) y -= Step;
            else if (e.Key == Key.Down) y += Step;
            else return;   // 방향키가 아니면 아무것도 안 함

            // 경계 검사: 0 보다 작아지지 않고, (판 크기 - 캐릭터 크기) 보다 커지지 않게
            double maxX = board.Width - player.Width;     // 400 - 30 = 370
            double maxY = board.Height - player.Height;   // 250 - 30 = 220
            double newX = Math.Max(0, Math.Min(x, maxX));
            double newY = Math.Max(0, Math.Min(y, maxY));

            Canvas.SetLeft(player, newX);
            Canvas.SetTop(player, newY);

            if (newX != x || newY != y)
                lblInfo.Text = $"벽에 닿았습니다! 위치 ({newX}, {newY})";
            else
                lblInfo.Text = $"위치 ({newX}, {newY})";
        }
    }
}`;

  /* ======================= 17-1 슬라이드용 짧은 코드 ======================= */
  const SL_MOUSE = `// ===== File: MainWindow.xaml =====
<Window x:Class="MouseInfoSlide.MainWindow"
        ${NS}
        Title="마우스 이벤트" Width="400" Height="260">
    <Border x:Name="area" Margin="10" Background="WhiteSmoke"
            MouseMove="Area_MouseMove" MouseDown="Area_MouseDown">
        <TextBlock x:Name="lblInfo" Text="움직이고 눌러 보세요" FontSize="16"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
namespace MouseInfoSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Area_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(area);
            lblInfo.Text = $"위치 ({p.X:F0}, {p.Y:F0})";
        }
        private void Area_MouseDown(object sender, MouseButtonEventArgs e)
        {
            lblInfo.Text = $"{e.ChangedButton} 버튼, 클릭 수 {e.ClickCount}";
        }
    }
}`;

  const SL_CIRCLE = `// ===== File: MainWindow.xaml =====
<Window x:Class="ClickCirclesSlide.MainWindow"
        ${NS}
        Title="클릭한 곳에 원" Width="420" Height="300">
    <Canvas x:Name="board" Background="White"
            MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
namespace ClickCirclesSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2) { board.Children.Clear(); return; }   // 더블클릭
            Point p = e.GetPosition(board);
            Ellipse c = new Ellipse { Width = 40, Height = 40, Fill = Brushes.Tomato };
            Canvas.SetLeft(c, p.X - 20);   // 반지름만큼 빼서 중심 맞추기
            Canvas.SetTop(c, p.Y - 20);
            board.Children.Add(c);
        }
    }
}`;

  const SL_ARROW = `// ===== File: MainWindow.xaml =====
<Window x:Class="ArrowMoveSlide.MainWindow"
        ${NS}
        Title="방향키" Width="420" Height="300" KeyDown="Window_KeyDown">
    <Canvas Background="Honeydew">
        <Ellipse x:Name="ball" Width="40" Height="40" Fill="Crimson" Canvas.Left="180" Canvas.Top="110"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
namespace ArrowMoveSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double step = Keyboard.Modifiers == ModifierKeys.Shift ? 40 : 10;
            double x = Canvas.GetLeft(ball), y = Canvas.GetTop(ball);
            if (e.Key == Key.Left) x -= step;
            else if (e.Key == Key.Right) x += step;
            else if (e.Key == Key.Up) y -= step;
            else if (e.Key == Key.Down) y += step;
            Canvas.SetLeft(ball, x); Canvas.SetTop(ball, y);
        }
    }
}`;

  const SL_ENTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="EnterToListSlide.MainWindow"
        ${NS}
        Title="Enter 로 추가" Width="380" Height="300">
    <DockPanel Margin="10">
        <TextBox x:Name="txtItem" DockPanel.Dock="Top" FontSize="15"
                 KeyDown="TxtItem_KeyDown"/>
        <ListBox x:Name="lstItems" Margin="0,8,0,0" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
namespace EnterToListSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void TxtItem_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key != Key.Enter || txtItem.Text.Trim() == "") return;
            string text = txtItem.Text.Trim();
            if (Keyboard.Modifiers == ModifierKeys.Control) text = "★ " + text;
            lstItems.Items.Add(text);
            txtItem.Clear();
        }
    }
}`;

  /* ======================= 17-2 예제 코드 ======================= */
  const EX_PREVIEW = `// ===== File: MainWindow.xaml =====
<Window x:Class="PreviewHandled.MainWindow"
        ${NS}
        Title="Preview 이벤트와 e.Handled" Width="460" Height="400">
    <DockPanel Margin="12">
        <CheckBox x:Name="chkBlock" DockPanel.Dock="Top" Margin="0,0,0,8"
                  Content="PreviewMouseDown 에서 e.Handled = true 로 막기"/>
        <!-- 같은 요소에 Preview 이벤트와 일반 이벤트를 둘 다 연결 -->
        <Border DockPanel.Dock="Top" Height="80" Background="LightSkyBlue" CornerRadius="8"
                PreviewMouseDown="Target_PreviewMouseDown" MouseDown="Target_MouseDown">
            <TextBlock Text="여기를 클릭하세요" FontSize="16"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Button DockPanel.Dock="Bottom" Content="기록 지우기" Height="30" Margin="0,8,0,0"
                Click="BtnClear_Click"/>
        <ListBox x:Name="lstLog" Margin="0,8,0,0" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;

namespace PreviewHandled
{
    public partial class MainWindow : Window
    {
        private int no = 0;   // 클릭 번호

        public MainWindow()
        {
            InitializeComponent();
        }

        // ① 터널링 이벤트: 먼저 온다
        private void Target_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            no++;
            lstLog.Items.Add($"{no}. PreviewMouseDown  (먼저 · 터널링)");

            if (chkBlock.IsChecked == true)
            {
                e.Handled = true;   // "처리 끝!" → 뒤따르는 MouseDown 처리기는 불리지 않는다
                lstLog.Items.Add("    → e.Handled = true : 여기서 멈춤");
            }
        }

        // ② 버블링 이벤트: 나중에 온다
        private void Target_MouseDown(object sender, MouseButtonEventArgs e)
        {
            lstLog.Items.Add($"{no}. MouseDown  (나중 · 버블링)");
        }

        private void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            lstLog.Items.Clear();
            no = 0;
        }
    }
}`;

  const EX_BUBBLE = `// ===== File: MainWindow.xaml =====
<Window x:Class="BubbleDemo.MainWindow"
        ${NS}
        Title="버블링 확인 (Visual Studio 에서 실행)" Width="480" Height="400"
        MouseDown="Window_MouseDown">
    <DockPanel>
        <CheckBox x:Name="chkStop" DockPanel.Dock="Top" Margin="10,8"
                  Content="Border 에서 e.Handled = true (버블링 멈추기)"/>
        <ListBox x:Name="lstLog" DockPanel.Dock="Bottom" Height="150" Margin="10"/>
        <Grid x:Name="grid" Background="WhiteSmoke" MouseDown="Grid_MouseDown">
            <Border x:Name="border" Width="240" Height="100" Background="LightSkyBlue"
                    MouseDown="Border_MouseDown">
                <TextBlock x:Name="text" Text="글자 또는 파란 영역 클릭"
                           HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;

namespace BubbleDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Border_MouseDown(object sender, MouseButtonEventArgs e)
        {
            lstLog.Items.Clear();
            Log("① Border", sender, e);
            if (chkStop.IsChecked == true) e.Handled = true;   // 여기서 멈추면 ②③ 은 안 온다
        }

        private void Grid_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Log("② Grid", sender, e);
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Log("③ Window", sender, e);
        }

        // sender = 처리기가 연결된 요소, OriginalSource = 실제로 클릭된 요소
        private void Log(string where, object sender, RoutedEventArgs e)
        {
            lstLog.Items.Add($"{where}: sender={NameOf(sender)}, Source={NameOf(e.Source)}, OriginalSource={NameOf(e.OriginalSource)}");
        }

        private static string NameOf(object? o)
        {
            if (o is FrameworkElement fe && fe.Name != "") return fe.Name;
            return o == null ? "null" : o.GetType().Name;
        }
    }
}`;

  const EX_CALC = `// ===== File: MainWindow.xaml =====
<Window x:Class="CalcButtons.MainWindow"
        ${NS}
        Title="간단 계산기" Width="300" Height="400" ResizeMode="NoResize">
    <Window.Resources>
        <!-- 창 안의 모든 Button 에 같은 글꼴 크기 · 여백 (스타일은 19장) -->
        <Style TargetType="Button">
            <Setter Property="FontSize" Value="20"/>
            <Setter Property="Margin" Value="3"/>
        </Style>
    </Window.Resources>
    <DockPanel Margin="10">
        <TextBlock x:Name="lblExpr" DockPanel.Dock="Top" Height="22" FontSize="14"
                   Foreground="Gray" HorizontalAlignment="Right"/>
        <TextBlock x:Name="lblDisplay" DockPanel.Dock="Top" Text="0" FontSize="34"
                   FontWeight="Bold" HorizontalAlignment="Right" Margin="0,0,0,8"/>
        <!-- 숫자 버튼은 모두 Digit_Click, 연산 버튼은 모두 Op_Click (Tag 에 기호) -->
        <UniformGrid Rows="4" Columns="4">
            <Button Content="7" Click="Digit_Click"/>
            <Button Content="8" Click="Digit_Click"/>
            <Button Content="9" Click="Digit_Click"/>
            <Button Content="÷" Tag="/" Click="Op_Click"/>
            <Button Content="4" Click="Digit_Click"/>
            <Button Content="5" Click="Digit_Click"/>
            <Button Content="6" Click="Digit_Click"/>
            <Button Content="×" Tag="*" Click="Op_Click"/>
            <Button Content="1" Click="Digit_Click"/>
            <Button Content="2" Click="Digit_Click"/>
            <Button Content="3" Click="Digit_Click"/>
            <Button Content="−" Tag="-" Click="Op_Click"/>
            <Button Content="C" Tag="C" Click="Op_Click"/>
            <Button Content="0" Click="Digit_Click"/>
            <Button Content="=" Tag="=" Click="Op_Click"/>
            <Button Content="+" Tag="+" Click="Op_Click"/>
        </UniformGrid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace CalcButtons
{
    public partial class MainWindow : Window
    {
        private double acc = 0;          // 지금까지 계산한 값
        private string op = "";          // 기다리고 있는 연산자
        private bool newNumber = true;   // 다음 숫자를 새로 시작하나?

        public MainWindow()
        {
            InitializeComponent();
        }

        // 숫자 버튼 10개가 함께 쓰는 처리기
        private void Digit_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;             // 눌린 버튼
            string digit = b.Content.ToString();   // 버튼 글자 = 숫자

            if (newNumber || lblDisplay.Text == "0")
            {
                lblDisplay.Text = digit;
                newNumber = false;
            }
            else
            {
                lblDisplay.Text += digit;
            }
        }

        // 연산 버튼 6개가 함께 쓰는 처리기
        private void Op_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            string tag = (string)b.Tag;   // 화면 글자(×)와 다른 값(*)은 Tag 에

            if (tag == "C")
            {
                acc = 0; op = ""; newNumber = true;
                lblDisplay.Text = "0";
                lblExpr.Text = "";
                return;
            }

            double cur = double.Parse(lblDisplay.Text);
            if (op == "") acc = cur;                          // 첫 번째 수
            else if (!newNumber) acc = Calc(acc, op, cur);    // 앞의 연산 마무리
            lblDisplay.Text = acc.ToString();

            if (tag == "=") { op = ""; lblExpr.Text = ""; }
            else { op = tag; lblExpr.Text = $"{acc} {b.Content}"; }
            newNumber = true;
        }

        private static double Calc(double a, string op, double b)
        {
            switch (op)
            {
                case "+": return a + b;
                case "-": return a - b;
                case "*": return a * b;
                case "/": return b == 0 ? 0 : a / b;   // 0 으로 나누면 0 (간단히)
                default: return b;
            }
        }
    }
}`;

  const EX_WINEVENTS = `// ===== File: MainWindow.xaml =====
<Window x:Class="WindowEvents.MainWindow"
        ${NS}
        Title="창 이벤트" Width="440" Height="320"
        Loaded="Window_Loaded" Closing="Window_Closing" SizeChanged="Window_SizeChanged">
    <DockPanel Margin="12">
        <TextBlock x:Name="lblStatus" DockPanel.Dock="Top" FontSize="14" TextWrapping="Wrap"
                   Margin="0,0,0,6" Text="(Loaded 전)"/>
        <TextBlock x:Name="lblSize" DockPanel.Dock="Bottom" Foreground="Gray" Margin="0,6,0,0"
                   Text="창 크기를 바꿔 보세요"/>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" TextWrapping="Wrap" FontSize="14"
                 TextChanged="TxtMemo_TextChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;   // CancelEventArgs
using System.Windows;
using System.Windows.Controls;

namespace WindowEvents
{
    public partial class MainWindow : Window
    {
        private bool isDirty = false;   // 저장하지 않은 변경이 있나?

        public MainWindow()
        {
            InitializeComponent();
        }

        // 창이 화면에 나타난 직후 (한 번)
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            lblStatus.Text = "Loaded: 창이 열렸습니다. 글을 쓴 뒤 ✕ 로 창을 닫아 보세요.";
            txtMemo.Focus();
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            isDirty = true;
            Title = "창 이벤트 *";   // 바뀐 내용이 있다는 표시
        }

        // 창 크기가 바뀔 때마다
        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            lblSize.Text = $"SizeChanged: {e.NewSize.Width:F0} × {e.NewSize.Height:F0}";
        }

        // 창이 닫히기 "직전" — e.Cancel = true 로 닫기를 취소할 수 있다
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!isDirty) return;   // 바뀐 것이 없으면 그냥 닫는다

            MessageBoxResult r = MessageBox.Show("저장하지 않은 내용이 있습니다.\\n저장할까요?",
                "닫기 전에", MessageBoxButton.YesNoCancel, MessageBoxImage.Question);

            if (r == MessageBoxResult.Yes)
            {
                // 실제 프로그램이라면 여기서 파일에 저장 (10장 File.WriteAllText)
                MessageBox.Show("저장했습니다.", "저장");
            }
            else if (r == MessageBoxResult.Cancel)
            {
                e.Cancel = true;   // 닫기 취소 → 창이 그대로 남는다
                lblStatus.Text = "닫기를 취소했습니다.";
            }
            // No 이면 저장하지 않고 닫는다
        }
    }
}`;

  const EX_COMMAND = `// ===== File: MainWindow.xaml =====
<Window x:Class="CommandSave.MainWindow"
        ${NS}
        Title="명령(Command)으로 저장" Width="460" Height="340">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일">
                <!-- 메뉴도 버튼도 같은 명령을 가리킨다 -->
                <MenuItem Header="저장" InputGestureText="Ctrl+S"
                          Command="{x:Static ApplicationCommands.Save}"/>
            </MenuItem>
        </Menu>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="8">
            <Button Content="저장" Width="80" Height="28"
                    Command="{x:Static ApplicationCommands.Save}"/>
            <TextBlock Text="  메뉴 · 버튼 · Ctrl+S · F2 = 모두 같은 명령"
                       VerticalAlignment="Center" Foreground="Gray"/>
        </StackPanel>
        <TextBlock x:Name="lblStatus" DockPanel.Dock="Bottom" Margin="8"
                   Text="글이 비어 있으면 저장 버튼과 메뉴가 꺼져 있습니다."/>
        <TextBox x:Name="txtMemo" Margin="8,0" AcceptsReturn="True"
                 TextWrapping="Wrap" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;   // CommandBinding, KeyBinding, ApplicationCommands

namespace CommandSave
{
    public partial class MainWindow : Window
    {
        private int saveCount = 0;

        public MainWindow()
        {
            InitializeComponent();

            // ① 명령과 처리기 연결: 무엇을 할지(Executed) + 지금 할 수 있는지(CanExecute)
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed, Save_CanExecute));

            // ② 단축키 연결: 명령 하나에 여러 키를 연결할 수 있다
            InputBindings.Add(new KeyBinding(ApplicationCommands.Save, Key.S, ModifierKeys.Control));
            InputBindings.Add(new KeyBinding(ApplicationCommands.Save, Key.F2, ModifierKeys.None));
        }

        // 메뉴 · 버튼 · 단축키 어디서 불러도 이 메서드 하나가 실행된다
        private void Save_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            saveCount++;
            lblStatus.Text = $"저장했습니다 ({saveCount}번째 · {DateTime.Now:HH:mm:ss} · {txtMemo.Text.Length}글자)";
        }

        // WPF 가 수시로 물어본다: "지금 저장할 수 있나?"
        private void Save_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = txtMemo.Text.Length > 0;   // 비어 있으면 false → 버튼 · 메뉴 자동 비활성
        }
    }
}`;

  const EX_TODO = `// ===== File: MainWindow.xaml =====
<Window x:Class="TodoCommands.MainWindow"
        ${NS}
        Title="할 일 — 명령 두 개" Width="420" Height="360">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top">
            <Button DockPanel.Dock="Right" Content="추가" Width="70" Margin="6,0,0,0"
                    Command="{x:Static ApplicationCommands.New}"/>
            <TextBox x:Name="txtTodo" FontSize="14"/>
        </DockPanel>
        <Button DockPanel.Dock="Bottom" Content="선택한 항목 삭제" Height="30" Margin="0,8,0,0"
                Command="{x:Static ApplicationCommands.Delete}"/>
        <ListBox x:Name="lstTodo" Margin="0,8,0,0" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;

namespace TodoCommands
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.New, Add_Executed, Add_CanExecute));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Delete, Delete_Executed, Delete_CanExecute));
        }

        // 추가: 입력 칸이 비어 있지 않을 때만
        private void Add_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = txtTodo.Text.Trim() != "";
        }

        private void Add_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            lstTodo.Items.Add(txtTodo.Text.Trim());
            txtTodo.Clear();
            txtTodo.Focus();
        }

        // 삭제: 목록에서 무언가 선택했을 때만
        private void Delete_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = lstTodo.SelectedItem != null;
        }

        private void Delete_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            object? item = lstTodo.SelectedItem;
            if (item != null) lstTodo.Items.Remove(item);
        }
    }
}`;

  /* ======================= 17-2 실습 ======================= */
  const PAD_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="KeyPad.MainWindow"
        ${NS}
        Title="전화 키패드" Width="300" Height="420" ResizeMode="NoResize">
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="FontSize" Value="20"/>
            <Setter Property="Margin" Value="4"/>
        </Style>
    </Window.Resources>
    <DockPanel Margin="10">
        <TextBlock x:Name="lblNumber" DockPanel.Dock="Top" Text="" Height="44" FontSize="28"
                   FontWeight="Bold" HorizontalAlignment="Center"/>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Text="번호를 누르세요 (최대 11자리)"
                   Foreground="Gray" HorizontalAlignment="Center" Margin="0,0,0,8"/>
        <!-- 버튼 12개가 모두 같은 처리기 Key_Click 을 쓴다 -->
        <UniformGrid Rows="4" Columns="3">
            <Button Content="1" Tag="1" Click="Key_Click"/>
            <Button Content="2" Tag="2" Click="Key_Click"/>
            <Button Content="3" Tag="3" Click="Key_Click"/>
            <Button Content="4" Tag="4" Click="Key_Click"/>
            <Button Content="5" Tag="5" Click="Key_Click"/>
            <Button Content="6" Tag="6" Click="Key_Click"/>
            <Button Content="7" Tag="7" Click="Key_Click"/>
            <Button Content="8" Tag="8" Click="Key_Click"/>
            <Button Content="9" Tag="9" Click="Key_Click"/>
            <Button Content="지움" Tag="Back" Click="Key_Click"/>
            <Button Content="0" Tag="0" Click="Key_Click"/>
            <Button Content="C" Tag="Clear" Click="Key_Click"/>
        </UniformGrid>
    </DockPanel>
</Window>`;

  const P3_STARTER = `${PAD_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace KeyPad
{
    public partial class MainWindow : Window
    {
        private const int MaxLength = 11;

        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼 12개가 함께 쓰는 처리기
        private void Key_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: sender 를 Button 으로 바꾸고, Tag 를 문자열로 꺼내기
            // TODO 2: Tag 가 "Clear" 이면 번호를 모두 지우기
            // TODO 3: Tag 가 "Back" 이면 마지막 글자 하나 지우기 (비어 있으면 그대로)
            // TODO 4: 그 밖(숫자)이면 길이가 MaxLength 보다 짧을 때만 뒤에 붙이기
            // TODO 5: lblInfo 에 "n자리" 표시 (11자리가 되면 "입력 완료!")
        }
    }
}`;

  const P3_SOLUTION = `${PAD_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace KeyPad
{
    public partial class MainWindow : Window
    {
        private const int MaxLength = 11;

        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼 12개가 함께 쓰는 처리기
        private void Key_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            string tag = (string)b.Tag;
            string number = lblNumber.Text;

            if (tag == "Clear")
            {
                number = "";
            }
            else if (tag == "Back")
            {
                if (number.Length > 0)
                    number = number.Substring(0, number.Length - 1);
            }
            else if (number.Length < MaxLength)
            {
                number += tag;   // 숫자 버튼은 Tag 가 곧 숫자
            }

            lblNumber.Text = number;
            lblInfo.Text = number.Length == MaxLength ? "입력 완료!" : $"{number.Length}자리";
        }
    }
}`;

  const MEMO_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="MemoCommands.MainWindow"
        ${NS}
        Title="메모" Width="480" Height="360"
        Closing="Window_Closing">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일">
                <MenuItem Header="새로 만들기" InputGestureText="Ctrl+N"
                          Command="{x:Static ApplicationCommands.New}"/>
                <MenuItem Header="저장" InputGestureText="Ctrl+S"
                          Command="{x:Static ApplicationCommands.Save}"/>
            </MenuItem>
        </Menu>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="6">
            <Button Content="새로 만들기" Width="90" Height="28" Margin="0,0,6,0"
                    Command="{x:Static ApplicationCommands.New}"/>
            <Button Content="저장" Width="70" Height="28"
                    Command="{x:Static ApplicationCommands.Save}"/>
        </StackPanel>
        <TextBlock x:Name="lblStatus" DockPanel.Dock="Bottom" Margin="6" Text="새 메모"/>
        <TextBox x:Name="txtMemo" Margin="6,0" AcceptsReturn="True" TextWrapping="Wrap"
                 FontSize="14" TextChanged="TxtMemo_TextChanged"/>
    </DockPanel>
</Window>`;

  const P4_STARTER = `${MEMO_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MemoCommands
{
    public partial class MainWindow : Window
    {
        private bool isDirty = false;     // 저장하지 않은 변경이 있나?
        // TODO 0: 마지막으로 저장한 내용을 보관할 string 필드 savedText 추가 (파일 대신)

        public MainWindow()
        {
            InitializeComponent();
            // TODO 1: New · Save 명령의 CommandBinding 추가 (Executed · CanExecute 연결)
            // TODO 2: Ctrl+N → New, Ctrl+S → Save KeyBinding 추가
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            // TODO 3: isDirty = true, 제목을 "메모 *" 로
        }

        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            // TODO 4: 바뀐 내용이 있으면 "저장할까요?" (예/아니요/취소)
            //         예 → 저장 후 새로, 아니요 → 그냥 새로, 취소 → 아무것도 안 함
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            // TODO 5: savedText 에 저장, isDirty = false, 제목 "메모", 상태 표시
        }

        private void Save_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            // TODO 6: 바뀐 내용이 있을 때만 저장 가능
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!isDirty) return;   // 바뀐 것이 없으면 그냥 닫는다
            // 도전: 바뀐 내용이 있으면 닫기 전에 물어보기 (취소하면 e.Cancel = true)
        }
    }
}`;

  const P4_SOLUTION = `${MEMO_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MemoCommands
{
    public partial class MainWindow : Window
    {
        private bool isDirty = false;     // 저장하지 않은 변경이 있나?
        private string savedText = "";    // 마지막으로 저장한 내용 (파일 대신)

        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.New, New_Executed));
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save, Save_Executed, Save_CanExecute));
            InputBindings.Add(new KeyBinding(ApplicationCommands.New, Key.N, ModifierKeys.Control));
            InputBindings.Add(new KeyBinding(ApplicationCommands.Save, Key.S, ModifierKeys.Control));
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            isDirty = true;
            Title = "메모 *";
        }

        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!AskSave()) return;   // 취소하면 아무것도 안 함
            txtMemo.Clear();          // TextChanged 가 isDirty 를 true 로 만들므로
            isDirty = false;          // 지운 "다음에" false 로 되돌린다
            Title = "메모";
            lblStatus.Text = "새 메모";
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            SaveMemo();
        }

        private void Save_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = isDirty;   // 바뀐 게 없으면 저장 버튼 · 메뉴가 꺼진다
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!AskSave()) e.Cancel = true;
        }

        private void SaveMemo()
        {
            savedText = txtMemo.Text;   // 실제로는 File.WriteAllText (10장)
            isDirty = false;
            Title = "메모";
            lblStatus.Text = $"저장했습니다 ({savedText.Length}글자)";
        }

        // 바뀐 내용이 있으면 물어본다. 계속 진행해도 되면 true, 취소면 false
        private bool AskSave()
        {
            if (!isDirty) return true;
            MessageBoxResult r = MessageBox.Show("바뀐 내용을 저장할까요?", "메모",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Cancel) return false;
            if (r == MessageBoxResult.Yes) SaveMemo();
            return true;
        }
    }
}`;

  /* ======================= 17-2 슬라이드용 짧은 코드 ======================= */
  const SL_PREVIEW = `// ===== File: MainWindow.xaml =====
<Window x:Class="PreviewSlide.MainWindow"
        ${NS}
        Title="Preview 와 Handled" Width="400" Height="300">
    <DockPanel Margin="10">
        <CheckBox x:Name="chkBlock" DockPanel.Dock="Top" Content="Preview 에서 막기"/>
        <Border DockPanel.Dock="Top" Height="60" Margin="0,8" Background="LightSkyBlue"
                PreviewMouseDown="B_PreviewMouseDown" MouseDown="B_MouseDown"/>
        <ListBox x:Name="lstLog"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
namespace PreviewSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void B_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            lstLog.Items.Add("PreviewMouseDown");
            if (chkBlock.IsChecked == true) e.Handled = true;   // 여기서 멈춤
        }
        private void B_MouseDown(object sender, MouseButtonEventArgs e) { lstLog.Items.Add("   MouseDown"); }
    }
}`;

  const SL_CALC = `// ===== File: MainWindow.xaml =====
<Window x:Class="SharedHandlerSlide.MainWindow"
        ${NS}
        Title="처리기 하나로" Width="360" Height="200">
    <StackPanel Margin="12">
        <TextBlock x:Name="lblShow" Text="0" FontSize="28"/>
        <StackPanel Orientation="Horizontal">
            <Button Content="1" Width="50" Margin="3" Click="Digit_Click"/> <Button Content="2" Width="50" Margin="3" Click="Digit_Click"/>
            <Button Content="3" Width="50" Margin="3" Click="Digit_Click"/> <Button Content="지움" Tag="Clear" Width="60" Margin="3" Click="Digit_Click"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
namespace SharedHandlerSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Digit_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;                          // 누가 눌렸나?
            if ((string)b.Tag == "Clear") { lblShow.Text = "0"; return; }
            string d = b.Content.ToString();
            lblShow.Text = lblShow.Text == "0" ? d : lblShow.Text + d;
        }
    }
}`;

  const SL_CLOSING = `// ===== File: MainWindow.xaml =====
<Window x:Class="ClosingSlide.MainWindow"
        ${NS}
        Title="닫기 전에 확인" Width="380" Height="240"
        Loaded="Window_Loaded" Closing="Window_Closing">
    <TextBox x:Name="txtMemo" Margin="10" AcceptsReturn="True"
             TextChanged="TxtMemo_TextChanged"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
namespace ClosingSlide
{
    public partial class MainWindow : Window
    {
        private bool isDirty = false;
        public MainWindow() { InitializeComponent(); }
        private void Window_Loaded(object sender, RoutedEventArgs e) { txtMemo.Focus(); }
        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e) { isDirty = true; }
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!isDirty) return;
            var r = MessageBox.Show("저장하지 않고 닫을까요?", "확인", MessageBoxButton.YesNo);
            if (r == MessageBoxResult.No) e.Cancel = true;   // 닫기 취소
        }
    }
}`;

  const SL_COMMAND = `// ===== File: MainWindow.xaml =====
<Window x:Class="CommandSlide.MainWindow"
        ${NS}
        Title="명령" Width="400" Height="260">
    <DockPanel Margin="8">
        <Button DockPanel.Dock="Top" Content="저장 (Ctrl+S)" Height="28"
                Command="{x:Static ApplicationCommands.Save}"/>
        <TextBlock x:Name="lblStatus" DockPanel.Dock="Bottom" Text="글을 쓰면 켜집니다"/>
        <TextBox x:Name="txtMemo" Margin="0,8" AcceptsReturn="True"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
namespace CommandSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Save,
                (s, e) => lblStatus.Text = $"저장: {txtMemo.Text.Length}글자",   // Executed
                (s, e) => e.CanExecute = txtMemo.Text.Length > 0));            // CanExecute
            InputBindings.Add(new KeyBinding(ApplicationCommands.Save, Key.S, ModifierKeys.Control));
        }
    }
}`;

  const XAML_BINDINGS = `<pre><code>&lt;Window.CommandBindings&gt;
    &lt;CommandBinding Command="{x:Static ApplicationCommands.Save}"
                    Executed="Save_Executed" CanExecute="Save_CanExecute"/&gt;
&lt;/Window.CommandBindings&gt;
&lt;Window.InputBindings&gt;
    &lt;KeyBinding Gesture="Ctrl+S" Command="{x:Static ApplicationCommands.Save}"/&gt;
&lt;/Window.InputBindings&gt;</code></pre>`;

  const XAML_ATTACHED = `<pre><code>&lt;!-- 부모 한 곳에 "안쪽 버튼들의 Click" 을 한 번에 연결 (연결된 이벤트) --&gt;
&lt;UniformGrid Button.Click="AnyButton_Click"&gt; … 버튼 16개 … &lt;/UniformGrid&gt;

private void AnyButton_Click(object sender, RoutedEventArgs e)
{
    // sender 는 UniformGrid! 실제로 눌린 버튼은 e.OriginalSource
    Button b = (Button)e.OriginalSource;
}</code></pre>`;

  CS_COURSE.addChapter({
    id: 'ch17',
    no: '17',
    title: '이벤트 처리',
    subtitle: 'Mouse · Keyboard · Routed Events · Commands',
    summary: '마우스(MouseDown · MouseMove · MouseWheel …)와 키보드(KeyDown · e.Key · Keyboard.Modifiers) 이벤트로 사용자의 입력에 반응하는 프로그램을 만들고, 포커스를 다룹니다. WPF 이벤트가 요소 트리를 따라 전달되는 라우트된 이벤트(터널링 · 버블링)와 e.Handled, 여러 버튼을 처리기 하나로 처리하는 방법, 창 이벤트(Loaded · Closing · SizeChanged), 그리고 메뉴 · 버튼 · 단축키를 하나로 묶는 명령(Command)을 배웁니다.',
    goals: [
      '마우스 이벤트의 종류를 구분하고 e.GetPosition 으로 좌표를 얻어 활용할 수 있다',
      'KeyDown 과 e.Key, Keyboard.Modifiers 로 키 입력과 Ctrl · Shift 조합을 처리할 수 있다',
      '포커스의 의미를 설명하고 Focus() · GotFocus · LostFocus 를 사용할 수 있다',
      '라우트된 이벤트의 터널링 · 버블링 · 직접 전략과 Preview 이벤트, e.Handled 를 설명할 수 있다',
      'sender 와 Tag 로 여러 컨트롤의 이벤트를 처리기 하나로 처리할 수 있다',
      'Loaded · Closing · SizeChanged 같은 창 이벤트를 쓰고 Closing 에서 닫기를 취소할 수 있다',
      'CommandBinding · KeyBinding 으로 명령을 만들고 CanExecute 로 버튼 · 메뉴를 자동으로 켜고 끌 수 있다'
    ],
    sections: [
      /* ===================== ch17-1 ===================== */
      {
        id: 'ch17-1',
        title: '마우스 · 키보드 이벤트',
        minutes: 50,
        goals: [
          '이벤트 기반 프로그래밍과 처리기 연결 두 방법을 다시 설명할 수 있다',
          '마우스 이벤트(MouseDown · MouseMove · MouseEnter/Leave · MouseWheel 등)를 구분해 쓸 수 있다',
          'e.GetPosition · e.ChangedButton · e.ClickCount 로 마우스 정보를 얻을 수 있다',
          'KeyDown 에서 e.Key 와 Keyboard.Modifiers 로 키와 Ctrl · Shift 조합을 처리할 수 있다',
          'Focus() 와 GotFocus · LostFocus 로 포커스를 다룰 수 있다'
        ],
        flow: [['도입: 이벤트 기반 복습 · 처리기 연결', 5], ['마우스 이벤트 · 좌표 · 원 그리기', 17], ['키보드 이벤트 · 방향키 · Enter', 15], ['포커스', 5], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '이벤트 기반 프로그래밍 다시 보기' },
          { type: 'p', html: '13장에서 GUI 앱은 <b>이벤트 기반(event-driven)</b> 이라고 배웠습니다. 창을 띄워 놓고 기다리다가, 사용자가 무언가 하면 그에 맞는 <b>이벤트 처리기(event handler)</b> 가 실행됩니다. 지금까지는 버튼의 <code>Click</code>, 글상자의 <code>TextChanged</code> 정도만 썼지만, WPF 요소는 훨씬 많은 이벤트를 가지고 있습니다. 마우스가 움직이거나, 휠을 굴리거나, 키를 누르는 <b>순간순간</b>을 모두 알려 줍니다.' },
          { type: 'p', html: '11장에서 배운 이벤트의 원리 그대로입니다. 요소(발행자)가 “이런 일이 일어났다” 고 알리면, 구독한 메서드(처리기)가 호출됩니다. 처리기는 항상 <code>(object sender, XxxEventArgs e)</code> 모양이고, <code>sender</code> 는 <b>누가</b>, <code>e</code> 는 <b>무슨 일이 어떻게</b> 일어났는지를 알려 줍니다. 마우스 이벤트의 <code>e</code> 에는 위치와 버튼이, 키보드 이벤트의 <code>e</code> 에는 누른 키가 들어 있습니다.' },
          { type: 'figure', html: SVG_INPUT, caption: '사용자 행동 → WPF 가 대상 요소를 정함 → 그 요소의 이벤트 발생 → 처리기 실행. e 에 위치 · 버튼 · 키 정보가 담겨 온다' },
          { type: 'table', head: ['연결 방법', '코드', '언제'], rows: [
            ['XAML 특성', '<code>&lt;Canvas MouseDown="Board_MouseDown"/&gt;</code>', '대부분 — 화면과 함께 보이므로 읽기 쉽다'],
            ['C# <code>+=</code>', '<code>board.MouseDown += Board_MouseDown;</code>', '코드로 만든 컨트롤, 실행 중에 연결 · 해제(<code>-=</code>)할 때']
          ], caption: '이벤트 처리기 연결 두 방법 (13장 복습) — 결과는 같다' },
          { type: 'callout', kind: 'vs', title: 'XAML 에서 처리기를 빨리 만드는 법', html: '<ul><li>XAML 편집기에서 <code>MouseDown="</code> 까지 입력하면 IntelliSense 목록에 <b>&lt;새 이벤트 처리기&gt;</b> 가 나타납니다. 고르면 <code>Board_MouseDown</code> 같은 이름이 들어가고, 코드 비하인드에 <b>매개변수 형식까지 맞춘 빈 메서드</b>가 만들어집니다.</li><li>처리기 이름 위에서 <kbd>F12</kbd>(정의로 이동)를 누르면 코드 비하인드의 그 메서드로 바로 이동합니다.</li><li>마우스 이벤트는 <code>MouseButtonEventArgs</code>, <code>MouseEventArgs</code>, <code>MouseWheelEventArgs</code> 처럼 이벤트마다 <code>e</code> 의 형식이 다릅니다. 직접 쓰기보다 자동 생성을 쓰면 틀릴 일이 없습니다.</li></ul>' },
          { type: 'h', text: '마우스 이벤트' },
          { type: 'p', html: '마우스 이벤트는 <code>System.Windows.Input</code> 네임스페이스의 형식을 쓰므로 코드 비하인드 위에 <code>using System.Windows.Input;</code> 이 필요합니다(Visual Studio 템플릿에는 이미 들어 있습니다).' },
          { type: 'table', head: ['이벤트', '언제 발생', '<code>e</code> 의 형식'], rows: [
            ['<code>MouseDown</code> · <code>MouseUp</code>', '아무 버튼이나 누를 때 · 뗄 때', '<code>MouseButtonEventArgs</code>'],
            ['<code>MouseLeftButtonDown</code> · <code>MouseLeftButtonUp</code>', '<b>왼쪽</b> 버튼만 (오른쪽은 <code>MouseRightButtonDown</code>)', '<code>MouseButtonEventArgs</code>'],
            ['<code>MouseMove</code>', '요소 위에서 마우스가 <b>움직이는 동안 계속</b>', '<code>MouseEventArgs</code>'],
            ['<code>MouseEnter</code> · <code>MouseLeave</code>', '요소 안으로 들어올 때 · 밖으로 나갈 때 (한 번씩)', '<code>MouseEventArgs</code>'],
            ['<code>MouseWheel</code>', '휠을 굴릴 때', '<code>MouseWheelEventArgs</code> (<code>e.Delta</code>)'],
            ['<code>MouseDoubleClick</code>', '더블클릭 — <b>컨트롤</b>(Button · ListBox · Label …)에만 있음', '<code>MouseButtonEventArgs</code>']
          ], caption: '자주 쓰는 마우스 이벤트' },
          { type: 'table', head: ['<code>e</code> 의 멤버', '뜻', '예'], rows: [
            ['<code>e.GetPosition(요소)</code>', '그 요소의 왼쪽 위를 (0, 0) 으로 한 마우스 좌표(<code>Point</code>)', '<code>Point p = e.GetPosition(board);</code>'],
            ['<code>e.ChangedButton</code>', '누르거나 뗀 버튼: <code>MouseButton.Left</code> · <code>Right</code> · <code>Middle</code>', '<code>if (e.ChangedButton == MouseButton.Right)</code>'],
            ['<code>e.ClickCount</code>', '연속 클릭 수 (빠르게 두 번 → 2)', '<code>if (e.ClickCount == 2)</code> → 더블클릭'],
            ['<code>e.LeftButton</code>', '지금 왼쪽 버튼이 눌려 있나 (<code>MouseButtonState.Pressed</code>)', 'MouseMove 에서 드래그 판별'],
            ['<code>e.Delta</code>', '휠 굴린 양: 위로 <code>+120</code>, 아래로 <code>-120</code>', '<code>if (e.Delta &gt; 0)</code> → 확대']
          ] },
          { type: 'code', title: '예제 17-1. 마우스 이벤트 살펴보기 — 좌표와 버튼', code: EX_MOUSE, desc: '아래 영역에서 마우스를 움직이면 <code>MouseMove</code> 가 계속 발생해 좌표가 바뀝니다. <code>e.GetPosition(area)</code> 는 <b>area 의 왼쪽 위</b>를 (0, 0) 으로 한 좌표를 돌려주고, <code>{p.X:F0}</code> 은 소수점 없이 표시하는 서식입니다. 영역에 들어오고 나갈 때는 <code>MouseEnter</code> · <code>MouseLeave</code> 가 <b>한 번씩</b> 발생해 테두리 색을 바꿉니다. 왼쪽 · 오른쪽 · 가운데 버튼을 눌러 보고, 빠르게 두 번 눌러 <code>클릭 수: 2</code> 도 확인하세요. (브라우저 실행 창에서는 오른쪽 클릭 때 브라우저 메뉴가 함께 뜰 수 있습니다.)' },
          { type: 'callout', kind: 'warn', title: 'Background 가 없으면 빈 곳을 클릭해도 이벤트가 오지 않는다', html: 'WPF 는 <b>무언가 그려진 곳</b>에서만 마우스를 감지합니다(히트 테스트, hit test). <code>Canvas</code> · <code>Grid</code> · <code>Border</code> 에 <code>Background</code> 가 없으면 배경은 “투명한 빈 공간” 이라 클릭이 그냥 통과합니다. 색을 보이고 싶지 않다면 <code>Background="Transparent"</code> 를 주세요. 투명색도 “칠해진 것” 이라 이벤트를 받습니다. 반대로 <code>IsHitTestVisible="False"</code> 를 주면 그 요소는 마우스를 무시합니다(예제 17-3).' },
          { type: 'h', text: 'Canvas 좌표 — 클릭한 곳에 원 그리기' },
          { type: 'p', html: '15장에서 배운 <code>Canvas</code> 는 자식의 위치를 <code>Canvas.Left</code> · <code>Canvas.Top</code> 좌표로 정합니다. 코드에서는 <code>Canvas.SetLeft(요소, x)</code> · <code>Canvas.SetTop(요소, y)</code> 로 바꿉니다. 마우스 좌표와 Canvas 좌표를 함께 쓰면 그림판 같은 프로그램을 만들 수 있습니다. 화면 좌표는 수학과 달리 <b>Y 가 아래로 갈수록 커집니다</b>.' },
          { type: 'figure', html: SVG_COORD, caption: 'Canvas 의 왼쪽 위가 (0, 0). Left/Top 은 도형의 왼쪽 위 모서리이므로, 반지름만큼 빼야 클릭한 곳이 원의 중심이 된다' },
          { type: 'code', title: '예제 17-2. 클릭한 곳에 원 그리기', code: EX_CIRCLE, desc: '<code>MouseLeftButtonDown</code> 이 올 때마다 <code>new Ellipse()</code> 로 원을 <b>코드에서 만들어</b> <code>board.Children.Add</code> 로 Canvas 에 넣습니다. <code>p.X - Diameter / 2</code> 가 “중심 맞추기” 입니다(그림 참고). 색은 지금까지 그린 개수를 5로 나눈 나머지로 돌아가며 고릅니다. <code>Canvas</code> 에는 <code>MouseDoubleClick</code> 이 없으므로 <b><code>e.ClickCount == 2</code></b> 로 더블클릭을 알아냅니다. 두 번째 클릭에서 <code>ClickCount</code> 가 2 가 됩니다. 이미 그린 원 위를 클릭해도 원을 그립니다. 원에서 일어난 클릭이 부모인 Canvas 로 <b>전달</b>되기 때문인데, 이 원리(버블링)는 다음 교시에 배웁니다.' },
          { type: 'code', title: '예제 17-3. 마우스를 따라다니는 사각형 — MouseMove · MouseWheel', code: EX_FOLLOW, desc: '<code>MouseMove</code> 에서 사각형의 중심을 마우스 위치로 옮깁니다. 이때 사각형이 마우스 바로 아래에 있으므로 <code>IsHitTestVisible="False"</code> 로 사각형이 마우스를 가로채지 않게 했습니다. <code>e.LeftButton == MouseButtonState.Pressed</code> 이면 “누른 채 움직이는 중(드래그)” 이라 빨간색이 됩니다. 휠을 굴리면 <code>MouseWheel</code> 의 <code>e.Delta</code>(±120)에 따라 크기를 10 씩 바꾸고, 20 ~ 120 사이로 제한합니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 드래그로 도형 옮기기', html: '드래그는 이벤트 세 개의 조합입니다. ① 도형의 <code>MouseLeftButtonDown</code> 에서 “잡았다” 를 기억하고 <code>shape.CaptureMouse()</code> 를 부릅니다(마우스가 도형 밖으로 빨리 나가도 이벤트를 계속 받게 “붙잡기”). ② <code>MouseMove</code> 에서 잡은 상태라면 위치를 옮깁니다. ③ <code>MouseLeftButtonUp</code> 에서 <code>ReleaseMouseCapture()</code> 로 놓아 줍니다. 22장(그래픽)과 프로젝트 P07(그림판)에서 직접 만들어 봅니다.' },
          { type: 'h', text: '키보드 이벤트' },
          { type: 'p', html: '키보드 이벤트는 <b>포커스(focus)를 가진 요소</b>에서 발생합니다. 포커스란 “지금 키보드 입력을 받는 요소” 입니다. 글상자를 클릭하면 커서가 깜빡이는데, 그 글상자가 포커스를 가진 것입니다. 포커스를 가진 요소에서 시작된 키 이벤트는 부모를 거쳐 <b>창(Window)</b> 까지 전달되므로, 창 전체의 단축키는 <code>Window</code> 에 <code>KeyDown</code> 을 연결해 처리합니다.' },
          { type: 'table', head: ['이벤트 · 멤버', '뜻'], rows: [
            ['<code>KeyDown</code> · <code>KeyUp</code>', '키를 누를 때 · 뗄 때. 계속 누르고 있으면 <code>KeyDown</code> 이 반복해서 온다'],
            ['<code>PreviewKeyDown</code>', '<code>KeyDown</code> 보다 <b>먼저</b> 오는 이벤트 (다음 교시)'],
            ['<code>e.Key</code>', '누른 키 (<code>Key</code> 열거형): <code>Key.Enter</code>, <code>Key.Escape</code>, <code>Key.Space</code>, <code>Key.Left</code> · <code>Right</code> · <code>Up</code> · <code>Down</code>, <code>Key.A</code> ~ <code>Key.Z</code>, <code>Key.D0</code> ~ <code>Key.D9</code>(숫자), <code>Key.F1</code> …'],
            ['<code>Keyboard.Modifiers</code>', '지금 함께 눌린 조합 키: <code>ModifierKeys.Control</code> · <code>Shift</code> · <code>Alt</code> (없으면 <code>None</code>)'],
            ['<code>e.IsRepeat</code>', '키를 꾹 누르고 있어서 반복으로 온 것인지']
          ], caption: '키보드 이벤트와 e 의 멤버 — using System.Windows.Input 필요' },
          { type: 'table', head: ['하고 싶은 것', '조건식'], rows: [
            ['Enter 를 눌렀나?', '<code>e.Key == Key.Enter</code>'],
            ['Ctrl+Enter 인가? (Ctrl 만)', '<code>e.Key == Key.Enter &amp;&amp; Keyboard.Modifiers == ModifierKeys.Control</code>'],
            ['Ctrl 이 함께 눌렸나? (Shift 가 같이 눌려도 OK)', '<code>(Keyboard.Modifiers &amp; ModifierKeys.Control) != 0</code>'],
            ['Ctrl+Shift 둘 다?', '<code>Keyboard.Modifiers == (ModifierKeys.Control | ModifierKeys.Shift)</code>']
          ], caption: '조합 키 판별 — ModifierKeys 는 여러 값을 | 로 합칠 수 있는 플래그 열거형(12장)' },
          { type: 'code', title: '예제 17-4. 방향키로 공 움직이기 — Window 의 KeyDown', code: EX_ARROW, desc: '<code>&lt;Window … KeyDown="Window_KeyDown"&gt;</code> 처럼 <b>창에 연결</b>했습니다. <code>switch (e.Key)</code> 로 방향키마다 좌표를 바꾸고, <code>Canvas.GetLeft</code> · <code>SetLeft</code> 로 읽고 씁니다. <code>Keyboard.Modifiers == ModifierKeys.Shift</code> 이면 한 번에 40 씩 움직입니다. 방향키가 아닌 키를 누르면 <code>e.Key</code> 의 이름(<code>A</code>, <code>Space</code>, <code>LeftShift</code> …)을 보여 줍니다. 키를 꾹 누르고 있으면 <code>KeyDown</code> 이 반복해서 와서 공이 계속 움직입니다. 아직 경계 검사가 없어서 공이 밖으로 나갈 수 있습니다 — 실습 17-2 에서 해결합니다.' },
          { type: 'callout', kind: 'warn', title: '방향키가 안 먹을 때 — 포커스와 PreviewKeyDown', html: '<ul><li>키 이벤트는 <b>창에 포커스가 있을 때만</b> 옵니다. 실행한 뒤 창을 한 번 클릭하세요(브라우저 실행 창도 같습니다).</li><li>창에 <b>버튼 · 목록 같은 컨트롤</b>이 있으면, WPF 는 방향키 · Tab 을 “포커스 이동” 에 먼저 써 버려서 창의 <code>KeyDown</code> 이 오지 않을 수 있습니다. 이럴 때는 먼저 오는 <code>PreviewKeyDown</code> 을 창에 연결하세요. 게임처럼 방향키를 쓰는 창은 컨트롤을 적게 두는 것이 좋습니다.</li></ul>' },
          { type: 'code', title: '예제 17-5. TextBox 에서 Enter 로 목록에 추가하기', code: EX_ENTER, desc: '이번에는 창이 아니라 <b>TextBox 에</b> <code>KeyDown</code> 을 연결했습니다. <code>e.Key == Key.Enter</code> 이면 목록에 추가하고 입력 칸을 비웁니다. 버튼을 누르러 마우스로 손을 옮길 필요가 없어 입력이 빨라집니다. <code>Keyboard.Modifiers == ModifierKeys.Control</code> 로 <b>Ctrl+Enter</b> 를 구분해 ★ 을 붙이고, <kbd>Esc</kbd> 는 입력을 지웁니다. 목록 항목을 더블클릭하면 <code>ListBox</code> 의 <code>MouseDoubleClick</code> 으로 삭제합니다. 창의 <code>Loaded</code> 이벤트(창이 화면에 나타난 직후)에서 <code>txtItem.Focus()</code> 로 커서를 입력 칸에 두었습니다.' },
          { type: 'h', text: '포커스(Focus)' },
          { type: 'p', html: '한 창에 글상자가 여러 개 있어도 키보드 입력은 <b>한 번에 한 곳</b>으로만 갑니다. 그 한 곳이 포커스를 가진 요소입니다. 포커스는 클릭 · <kbd>Tab</kbd> 키(다음 칸) · <kbd>Shift</kbd>+<kbd>Tab</kbd>(이전 칸)으로 옮겨지고, 코드에서는 <code>요소.Focus()</code> 로 옮깁니다.' },
          { type: 'table', head: ['멤버', '뜻'], rows: [
            ['<code>txtName.Focus()</code>', '이 요소로 포커스 옮기기 (커서가 그 칸으로)'],
            ['<code>GotFocus</code> · <code>LostFocus</code>', '포커스를 얻을 때 · 잃을 때 발생하는 이벤트'],
            ['<code>IsFocused</code>', '지금 포커스를 가지고 있나 (<code>bool</code>)'],
            ['<code>Focusable="False"</code>', '포커스를 받지 않게 하기 (Tab 으로도 가지 않음)'],
            ['<code>TabIndex</code>', 'Tab 키로 이동하는 순서 (작은 수부터)']
          ] },
          { type: 'code', title: '예제 17-6. 포커스 받은 칸 강조하고, 떠날 때 검사하기', code: EX_FOCUS, desc: '세 TextBox 가 <code>Box_GotFocus</code> · <code>Box_LostFocus</code> 처리기를 <b>함께</b> 씁니다. 어느 칸인지는 <code>(TextBox)sender</code> 로 알아냅니다. 포커스를 얻으면 배경을 노랗게 하고, 각 칸의 <code>Tag</code>(자유롭게 값을 넣어 두는 속성)에 적어 둔 도움말을 보여 줍니다. 이름 칸을 비운 채 떠나면 <code>LostFocus</code> 에서 경고합니다. 칸을 클릭하거나 <kbd>Tab</kbd> 으로 이동해 보고, 버튼을 눌러 <code>txtName.Focus()</code> 로 이름 칸에 커서가 돌아오는 것을 확인하세요.' },
          { type: 'callout', kind: 'tip', title: '생성자에서 Focus() 대신 Loaded 에서', html: '생성자가 실행될 때는 창이 아직 화면에 없어서 <code>Focus()</code> 가 무시될 수 있습니다. 처음 포커스를 줄 때는 예제 17-5 처럼 창의 <code>Loaded</code> 이벤트에서 하는 것이 안전합니다. 로그인 창의 아이디 칸, 검색 창의 입력 칸처럼 “바로 입력할 곳” 에 포커스를 주면 사용하기 편한 프로그램이 됩니다.' }
        ],
        practice: [
          {
            title: '실습 17-1. 클릭으로 점 찍기 · 개수 세기',
            level: 1,
            desc: '<p>흰 Canvas 를 클릭하면 그 자리에 <b>지름 10 인 검은 점</b>(Ellipse)이 찍히고, 위쪽에 <b>점 개수: n</b> 이 표시되게 하세요. <b>모두 지우기</b> 버튼을 누르면 점을 모두 지우고 개수를 0 으로 되돌립니다.</p><ul><li>클릭한 곳이 점의 <b>중심</b>이 되어야 합니다.</li><li>개수는 따로 변수를 두지 않고 <code>board.Children.Count</code> 로 셀 수 있습니다.</li></ul>',
            hint: '<code>Point p = e.GetPosition(board);</code> → <code>new Ellipse { … }</code> 대신 속성을 한 줄씩 설정해도 됩니다. 중심 맞추기: <code>Canvas.SetLeft(dot, p.X - 5)</code>. 지우기: <code>board.Children.Clear()</code>.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 17-2. 방향키로 캐릭터 이동 + 경계 검사',
            level: 2,
            desc: '<p>400 × 250 크기의 판(Canvas) 위에서 30 × 30 캐릭터(파란 사각형)를 <b>방향키</b>로 15 씩 움직이세요.</p><ul><li>캐릭터가 판 <b>밖으로 나가지 않게</b> 하세요. x 는 0 ~ 370, y 는 0 ~ 220 사이여야 합니다.</li><li>위치를 <code>위치 (x, y)</code> 로 표시하고, 벽에 막혔으면 <b>벽에 닿았습니다!</b> 를 함께 표시하세요.</li><li>방향키가 아닌 키는 무시합니다.</li></ul>',
            hint: '범위 안으로 자르기(clamp): <code>Math.Max(0, Math.Min(x, maxX))</code> — 먼저 최댓값으로 누르고, 그다음 0 보다 작지 않게. 최댓값은 숫자를 직접 쓰지 말고 <code>board.Width - player.Width</code> 로 계산하면 판 크기를 바꿔도 그대로 동작합니다. 잘라 낸 값이 원래 값과 다르면 벽에 닿은 것입니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: 'Canvas <code>board</code> 의 왼쪽 위를 (0, 0) 으로 한 마우스 좌표를 얻는 코드는?', options: ['<code>e.X</code>', '<code>Mouse.Position</code>', '<code>e.GetPosition(board)</code>', '<code>board.GetPosition()</code>'], answer: 2, explain: '<code>e.GetPosition(요소)</code> 는 <b>지정한 요소</b>를 기준으로 한 좌표(<code>Point</code>)를 돌려줍니다. 기준 요소를 바꾸면 같은 위치라도 값이 달라집니다.' },
          { q: '<code>Canvas</code> 의 <code>MouseLeftButtonDown</code> 처리기 안에서 더블클릭인지 알아내는 방법은?', options: ['<code>e.ClickCount == 2</code>', '<code>e.ChangedButton == MouseButton.Double</code>', '<code>e.IsDoubleClick</code>', 'Canvas 에서는 알 수 없다'], answer: 0, explain: '빠르게 두 번 누르면 두 번째 누름의 <code>ClickCount</code> 가 2 가 됩니다. <code>MouseDoubleClick</code> 이벤트는 <b>컨트롤</b>(Button · ListBox …)에만 있어서 Canvas 에서는 이 방법을 씁니다.' },
          { q: 'TextBox 의 <code>KeyDown</code> 에서 <b>Ctrl+Enter</b> 만 골라내는 조건은?', options: ['<code>e.Key == Key.Control + Key.Enter</code>', '<code>e.Key == Key.Enter || Keyboard.Modifiers == ModifierKeys.Control</code>', '<code>e.Key == "Ctrl+Enter"</code>', '<code>e.Key == Key.Enter &amp;&amp; Keyboard.Modifiers == ModifierKeys.Control</code>'], answer: 3, explain: '누른 키는 <code>e.Key</code>, 함께 눌린 조합 키는 <code>Keyboard.Modifiers</code> 로 봅니다. 두 조건이 <b>모두</b> 참이어야 하므로 <code>&amp;&amp;</code> 입니다.' },
          { q: '<code>&lt;Canvas MouseDown="Board_MouseDown"/&gt;</code> 에 <code>Background</code> 를 주지 않았더니, 빈 곳을 클릭해도 처리기가 실행되지 않았다. 이유는?', options: ['Canvas 는 MouseDown 이벤트가 없어서', '배경이 없는 곳은 “그려진 것이 없어” 마우스를 감지하지 않아서', 'Canvas 는 포커스를 받을 수 없어서', '처리기 이름이 틀려서'], answer: 1, explain: 'WPF 는 무언가 칠해진 곳에서만 마우스를 감지합니다(히트 테스트). 색을 보이지 않게 하려면 <code>Background="Transparent"</code> 를 줍니다.' },
          { q: '예제 17-4 에서 공의 <code>Canvas.Left</code> 가 50 일 때, Shift 없이 <b>→</b> 키를 3번 누르면 <code>Canvas.Left</code> 는?<pre><code>double step = 10;\nif (Keyboard.Modifiers == ModifierKeys.Shift) step = 40;\n...\ncase Key.Right: x += step; break;</code></pre>', options: ['53', '80', '60', '170'], answer: 1, explain: '한 번에 10 씩 세 번 → 50 + 30 = 80 입니다. Shift 를 누른 채였다면 50 + 120 = 170 이 됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '마우스 · 키보드 이벤트', subtitle: 'Chapter 17 · Section 01 — 사용자의 손끝에 반응하기', badge: '17-1',
            notes: '<p><b>[도입 2분]</b> “지금까지 버튼 Click 만 썼죠. 그림판은 어떻게 마우스를 따라 선을 그릴까요? 게임은 어떻게 방향키로 캐릭터를 움직일까요?” 오늘은 그 답인 마우스 · 키보드 이벤트를 배웁니다.</p><p>목표: 마우스 좌표로 그리기, 방향키로 움직이기, Enter 로 입력, 포커스.</p>' },
          { layout: 'diagram', title: '입력 → 이벤트 → 처리기', html: SVG_INPUT, caption: 'e 에 위치 · 버튼 · 키 정보가 담겨 온다',
            notes: '<p><b>[3분]</b> 13장 · 11장 복습. 처리기 모양 <code>(object sender, XxxEventArgs e)</code> — sender 는 “누가”, e 는 “무슨 일이 어떻게”.</p><p>발문: “마우스 클릭 처리기에 가장 필요한 정보는?” → 위치, 어떤 버튼. 그 정보가 e 에 들어 있다고 연결합니다. 연결 방법 두 가지(XAML 특성 / += )도 짧게 복습.</p>' },
          { layout: 'table', title: '자주 쓰는 마우스 이벤트', head: ['이벤트', '언제', 'e'], rows: [
            ['<code>MouseDown</code> / <code>Up</code>', '누를 때 / 뗄 때', '<code>MouseButtonEventArgs</code>'],
            ['<code>MouseLeftButtonDown</code>', '왼쪽 버튼만', '<code>MouseButtonEventArgs</code>'],
            ['<code>MouseMove</code>', '움직이는 동안 계속', '<code>MouseEventArgs</code>'],
            ['<code>MouseEnter</code> / <code>Leave</code>', '들어올 때 / 나갈 때', '<code>MouseEventArgs</code>'],
            ['<code>MouseWheel</code>', '휠 (<code>e.Delta</code> ±120)', '<code>MouseWheelEventArgs</code>'],
            ['<code>MouseDoubleClick</code>', '컨트롤에만 — 그 외는 <code>ClickCount</code>', '<code>MouseButtonEventArgs</code>']],
            lead: '이벤트마다 e 의 형식이 다르다 → VS 자동 생성 활용',
            notes: '<p><b>[4분]</b> 표를 훑고 핵심 멤버 세 개를 칠판에: <code>e.GetPosition(요소)</code>, <code>e.ChangedButton</code>, <code>e.ClickCount</code>.</p><p>VS 에서 <code>MouseDown="</code> 입력 → &lt;새 이벤트 처리기&gt; 를 시연하면 형식 걱정이 줄어듭니다.</p>' },
          { layout: 'code', title: '예제 17-1. 좌표와 버튼', code: SL_MOUSE, points: ['<code>e.GetPosition(area)</code> — area 기준 좌표', '<code>{p.X:F0}</code> 소수점 없이', '<code>e.ChangedButton</code> Left · Right · Middle', '<code>e.ClickCount</code> 빠른 두 번 → 2'],
            notes: '<p><b>[4분]</b> 실행 후 영역을 움직여 좌표 변화를 보여 줍니다. 왼쪽 위 모서리가 (0,0) 인지 함께 확인.</p><p>Background 를 지우고 다시 실행해 빈 곳에서 이벤트가 안 오는 것을 시연하면 “히트 테스트” 가 오래 기억됩니다. (글자 위에서는 여전히 온다!)</p>' },
          { layout: 'diagram', title: 'Canvas 좌표와 원의 중심', html: SVG_COORD, caption: 'Left/Top = 왼쪽 위 모서리 → 반지름만큼 빼기',
            notes: '<p><b>[3분]</b> Y 가 아래로 커진다는 점을 강조(수학 좌표와 반대). 발문: “클릭한 곳에 원의 Left/Top 을 그대로 두면 원이 어디에 생길까?” → 오른쪽 아래로 치우친다.</p>' },
          { layout: 'code', title: '예제 17-2. 클릭한 곳에 원 그리기', code: SL_CIRCLE, points: ['코드로 <code>new Ellipse</code> → <code>Children.Add</code>', '<code>Canvas.SetLeft(c, p.X - 20)</code> 중심 맞추기', 'Canvas 는 <code>ClickCount == 2</code> 로 더블클릭', '원 위를 눌러도 Canvas 로 전달(다음 교시)'],
            notes: '<p><b>[5분]</b> 20 을 빼는 부분을 지우고 실행 → 원이 치우치는 것 확인 → 다시 복구. 색을 바꾸거나 크기를 랜덤으로 바꾸게 해 봐도 좋습니다.</p><p>본문 예제 17-3(따라다니는 사각형 · 휠)은 시간이 되면 시연하고, 아니면 과제로.</p>' },
          { layout: 'table', title: '키보드 이벤트와 조합 키', head: ['하고 싶은 것', '코드'], rows: [
            ['키를 눌렀을 때', '<code>KeyDown</code> 이벤트 (계속 누르면 반복)'],
            ['어떤 키?', '<code>e.Key == Key.Enter</code> · <code>Key.Left</code> · <code>Key.A</code> · <code>Key.D1</code>'],
            ['Ctrl 과 함께?', '<code>Keyboard.Modifiers == ModifierKeys.Control</code>'],
            ['Ctrl 포함(다른 키도 OK)', '<code>(Keyboard.Modifiers &amp; ModifierKeys.Control) != 0</code>'],
            ['창 전체의 키', '<code>&lt;Window KeyDown="…"&gt;</code>']],
            lead: '키보드 이벤트는 포커스를 가진 요소에서 시작된다',
            notes: '<p><b>[4분]</b> 포커스 개념을 먼저: “커서가 깜빡이는 곳”. 키 이벤트는 거기서 시작해 창까지 올라간다 → 창 전체 단축키는 Window 에.</p><p>숫자 키는 <code>Key.D1</code>(D = Digit), 숫자 패드는 <code>Key.NumPad1</code> 로 다르다는 점도 짚어 주세요.</p>' },
          { layout: 'code', title: '예제 17-4. 방향키로 공 움직이기', code: SL_ARROW, points: ['<code>Window</code> 에 <code>KeyDown</code> 연결', '<code>e.Key</code> 로 방향 구분', 'Shift 면 40, 아니면 10', '<code>GetLeft</code> 로 읽고 <code>SetLeft</code> 로 쓰기'],
            notes: '<p><b>[5분]</b> 실행 후 창을 한 번 클릭해야 키가 먹는다는 점(포커스)을 보여 줍니다. 키를 꾹 누르면 반복되는 것도 확인.</p><p>발문: “계속 오른쪽을 누르면?” → 밖으로 나간다 → 실습 17-2 에서 경계 검사. 버튼이 있는 창에서는 방향키가 포커스 이동에 쓰여 PreviewKeyDown 이 필요할 수 있다고 예고.</p>' },
          { layout: 'code', title: '예제 17-5. Enter 로 목록에 추가', code: SL_ENTER, points: ['TextBox 에 <code>KeyDown</code>', '<code>e.Key != Key.Enter</code> 면 바로 return', 'Ctrl+Enter → ★ 중요 표시', '<code>txtItem.Clear()</code> 로 비우기'],
            notes: '<p><b>[4분]</b> 채팅 프로그램처럼 Enter 로 보내는 UX. 본문 예제에는 Esc 로 지우기, 더블클릭 삭제, Loaded 에서 Focus 가 더 있습니다.</p><p>가드 절(조건이 아니면 바로 return) 패턴을 칭찬해 주세요 — 중첩 if 를 줄여 줍니다.</p>' },
          { layout: 'bullets', title: '포커스(Focus) — 지금 입력받는 곳', lead: '키보드 입력은 한 번에 한 요소로만 간다',
            bullets: ['클릭 · <kbd>Tab</kbd> · <kbd>Shift</kbd>+<kbd>Tab</kbd> 으로 이동', '코드: <code>txtName.Focus()</code>', '이벤트: <code>GotFocus</code> · <code>LostFocus</code> (sender 로 어느 칸인지)', ['LostFocus 에서 입력 검사하기'], '처음 포커스는 생성자보다 <code>Loaded</code> 에서', '<code>Focusable="False"</code> · <code>TabIndex</code>'],
            notes: '<p><b>[5분]</b> 예제 17-6 을 실행해 Tab 으로 칸을 옮기며 노란 강조와 도움말을 보여 줍니다. 세 칸이 처리기 하나를 쓰는 점 — 다음 교시 “여러 버튼을 처리기 하나로” 의 예고.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Canvas 의 <code>MouseLeftButtonDown</code> 처리기에서 더블클릭을 알아내는 방법은?', options: ['<code>e.ClickCount == 2</code>', '<code>e.ChangedButton == MouseButton.Double</code>', '<code>e.IsDoubleClick</code>', 'Canvas 에서는 알 수 없다'], answer: 0, explain: '두 번째 누름에서 <code>ClickCount</code> 가 2 가 됩니다. <code>MouseDoubleClick</code> 은 컨트롤에만 있습니다.',
            notes: '<p>정답 후 “ListBox 라면?” 이라고 되물어 <code>MouseDoubleClick</code> 도 쓸 수 있다는 점을 확인합니다.</p>' },
          { layout: 'practice', title: '실습 17-2. 방향키 캐릭터 + 경계 검사', desc: '<p>400 × 250 판 위 30 × 30 캐릭터를 방향키로 15 씩 이동. 판 밖으로 나가지 않게 <code>Math.Max</code> · <code>Math.Min</code> 으로 자르고, 막히면 “벽에 닿았습니다!” 표시.</p>', starter: P2_STARTER, solution: P2_SOLUTION,
            notes: '<p><b>[8분]</b> 먼저 실습 17-1(점 찍기)을 5분 안에 끝낸 학생은 17-2 로. 경계값 370 = 400 − 30 을 그림으로 설명하면 이해가 빠릅니다.</p><p>흔한 실수: Max/Min 순서를 헷갈림 → 값 몇 개(−15, 100, 385)를 넣어 손으로 계산해 보게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['마우스: <code>MouseDown</code> · <code>MouseMove</code> · <code>MouseEnter/Leave</code> · <code>MouseWheel</code>', '<code>e.GetPosition(요소)</code> · <code>e.ChangedButton</code> · <code>e.ClickCount</code> · <code>e.Delta</code>', 'Background 가 있어야 빈 곳도 클릭된다', '키보드: <code>KeyDown</code> + <code>e.Key</code> + <code>Keyboard.Modifiers</code>', '포커스: <code>Focus()</code> · <code>GotFocus/LostFocus</code> · Loaded 에서 첫 포커스'],
            notes: '<p>다음 시간: 원 위를 클릭했는데 왜 Canvas 처리기가 불렸을까? — 이벤트가 트리를 따라 전달되는 라우트된 이벤트와, 메뉴 · 버튼 · 단축키를 하나로 묶는 명령(Command).</p>' }
        ]
      },
      /* ===================== ch17-2 ===================== */
      {
        id: 'ch17-2',
        title: '라우트된 이벤트와 명령(Command)',
        minutes: 50,
        goals: [
          '라우트된 이벤트의 세 가지 전략(터널링 · 버블링 · 직접)을 그림으로 설명할 수 있다',
          'Preview 이벤트와 e.Handled 의 관계를 설명하고 사용할 수 있다',
          'sender · e.Source · e.OriginalSource 를 구분하고, Tag 로 여러 버튼을 처리기 하나로 처리할 수 있다',
          'Loaded · Closing · SizeChanged 창 이벤트를 쓰고 Closing 에서 e.Cancel 로 닫기를 취소할 수 있다',
          'CommandBinding(Executed · CanExecute) · KeyBinding 으로 메뉴 · 버튼 · 단축키가 같은 명령을 쓰게 할 수 있다'
        ],
        flow: [['도입: 원 위 클릭이 왜 Canvas 로?', 3], ['라우트된 이벤트 · Preview · Handled', 12], ['sender · Tag — 처리기 하나로', 8], ['창 이벤트 · Closing', 7], ['명령(Command) · CanExecute', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '라우트된 이벤트(Routed Event)란?' },
          { type: 'p', html: '지난 시간 예제 17-2 에서 이미 그린 원 위를 클릭했는데도 Canvas 의 처리기가 실행되었습니다. 클릭은 <b>원</b>에서 일어났는데 어떻게 <b>Canvas</b> 가 알았을까요? WPF 의 이벤트는 한 요소에서 끝나지 않고 <b>요소 트리(14장)를 따라 이동</b>하기 때문입니다. 이렇게 경로(route)를 따라 전달되는 이벤트를 <b>라우트된 이벤트(routed event)</b> 라고 합니다. 처리기의 두 번째 매개변수 이름이 <code>RoutedEventArgs</code> 인 이유입니다.' },
          { type: 'p', html: '비유하면 학교의 연락 체계입니다. 교장 선생님의 공지는 <b>위에서 아래로</b>(교장 → 담임 → 반장 → 학생) 내려오고, 학생의 건의는 <b>아래에서 위로</b>(학생 → 반장 → 담임 → 교장) 올라갑니다. 중간에서 누군가 “이건 내가 처리했어요” 하면 더 전달되지 않습니다.' },
          { type: 'figure', html: SVG_ROUTE, caption: 'TextBlock 을 클릭하면 PreviewMouseDown 이 Window 부터 내려오고(터널링), 이어서 MouseDown 이 TextBlock 부터 올라간다(버블링)' },
          { type: 'table', head: ['전략', '방향', '이름 · 예', '주로 쓰는 곳'], rows: [
            ['<b>터널링</b> (Tunneling)', '위 → 아래 (창 → … → 대상)', '<code>Preview</code> 로 시작: <code>PreviewMouseDown</code>, <code>PreviewKeyDown</code>', '대상보다 <b>먼저</b> 검사 · 막기'],
            ['<b>버블링</b> (Bubbling)', '아래 → 위 (대상 → … → 창)', '<code>MouseDown</code>, <code>KeyDown</code>, <code>Click</code> 등 대부분', '부모 한 곳에서 자식들의 이벤트 처리'],
            ['<b>직접</b> (Direct)', '전달 없음', '<code>MouseEnter</code>, <code>MouseLeave</code>', '그 요소에서만 의미 있는 일']
          ], caption: '라우트된 이벤트의 세 가지 전략' },
          { type: 'p', html: '마우스를 한 번 누르면 <b>한 쌍</b>의 이벤트가 발생합니다. 먼저 <code>PreviewMouseDown</code> 이 창에서 클릭한 요소까지 내려오고, 이어서 <code>MouseDown</code> 이 클릭한 요소에서 창까지 올라갑니다. 경로 위의 어느 처리기든 <code>e.Handled = true</code> 로 “처리 끝” 표시를 하면, 그 뒤의 처리기들은 더 이상 불리지 않습니다. <b>Preview 에서 Handled 를 하면 짝인 MouseDown 도 오지 않습니다.</b>' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서 라우팅은 일부만 동작합니다', html: '이 강좌의 브라우저 실행 창은 <b>같은 요소</b>에 연결한 Preview → 일반 이벤트 순서와 <code>e.Handled</code> 는 WPF 와 같게 동작하지만, 부모 요소들로 전달되는 과정과 <code>e.Source</code> · <code>e.OriginalSource</code> 값은 실제 WPF 와 다를 수 있습니다. 그래서 예제 17-8(버블링 확인)은 <b>Visual Studio 에서 실행</b>해 보세요. 나머지 예제는 입력을 받는 요소에 처리기를 연결해 두 환경에서 똑같이 동작합니다.' },
          { type: 'code', title: '예제 17-7. Preview 이벤트와 e.Handled', code: EX_PREVIEW, desc: '파란 영역(Border) <b>하나에</b> <code>PreviewMouseDown</code> 과 <code>MouseDown</code> 을 모두 연결했습니다. 클릭하면 기록에 항상 <b>Preview 가 먼저</b>, MouseDown 이 나중에 찍힙니다. 체크 상자를 켜고 클릭하면 Preview 처리기가 <code>e.Handled = true</code> 로 표시하므로 <code>MouseDown</code> 처리기는 <b>불리지 않습니다</b>. 이 원리로 “특정 조건에서 입력 막기”(예: 잠금 모드에서 클릭 무시, 글상자에 숫자만 받기)를 만듭니다.' },
          { type: 'h', text: 'sender 와 e.Source · e.OriginalSource' },
          { type: 'p', html: '이벤트가 트리를 따라 이동하므로 처리기 안에서 “누구” 를 가리키는 값이 세 가지가 됩니다.' },
          { type: 'table', head: ['값', '뜻', 'TextBlock 을 클릭했을 때 Grid 의 처리기에서'], rows: [
            ['<code>sender</code>', '<b>이 처리기가 연결된</b> 요소 (지금 이벤트가 지나는 곳)', 'Grid'],
            ['<code>e.Source</code>', '이벤트를 <b>일으킨</b> 요소 (논리 트리 기준)', 'TextBlock'],
            ['<code>e.OriginalSource</code>', '<b>실제로</b> 마우스 아래 있던 가장 안쪽 요소', 'TextBlock (버튼이라면 버튼 속 글자 요소일 수도 있음)']
          ], caption: '버블링 도중에는 sender 와 Source 가 다르다' },
          { type: 'code', title: '예제 17-8. 버블링 확인 — Visual Studio 에서 실행', run: false, code: EX_BUBBLE, desc: 'Visual Studio 에서 실행해 파란 영역 안의 <b>글자</b>를 클릭하면 기록이 세 줄 생깁니다. <code>① Border: sender=border, Source=text, OriginalSource=text</code> → <code>② Grid: sender=grid, …</code> → <code>③ Window: sender=MainWindow, …</code>. 이벤트가 <b>안쪽에서 바깥쪽으로</b> 올라가는 동안 <code>sender</code> 는 바뀌지만 <code>Source</code> 는 계속 text 입니다. 글자 바깥의 파란 부분을 누르면 Source 가 border 가 됩니다. 체크 상자를 켜면 Border 에서 <code>e.Handled = true</code> 를 하므로 ② ③ 이 사라집니다. <code>NameOf</code> 는 요소에 <code>x:Name</code> 이 있으면 그 이름, 없으면 형식 이름을 돌려주는 도우미 메서드입니다. (브라우저 실행 창에서는 라우팅이 일부만 흉내 내어져 결과가 다를 수 있어 ▶ 실행을 막아 두었습니다.)' },
          { type: 'h', text: '여러 버튼을 처리기 하나로' },
          { type: 'p', html: '계산기의 숫자 버튼 10개에 처리기를 10개 만들 필요는 없습니다. 모든 버튼에 <b>같은 처리기</b>를 연결하고, 처리기 안에서 <code>sender</code> 로 눌린 버튼을 알아내면 됩니다(13장 카운터 예제에서도 썼습니다). 버튼마다 다른 값이 필요하면 두 가지 중 고릅니다.' },
          { type: 'list', items: [
            '<b>Content</b>(버튼 글자)를 그대로 쓰기 — 숫자 버튼처럼 글자가 곧 값일 때: <code>b.Content.ToString()</code>',
            '<b>Tag</b> 에 값을 따로 넣어 두기 — 화면 글자(<code>×</code>, <code>÷</code>, <code>지움</code>)와 코드에서 쓸 값(<code>*</code>, <code>/</code>, <code>Back</code>)이 다를 때: <code>(string)b.Tag</code>. <code>Tag</code> 는 모든 요소에 있는 “자유롭게 쓰는 메모 칸” 입니다.'
          ] },
          { type: 'code', title: '예제 17-9. 계산기 — 숫자 버튼 10개와 연산 버튼 6개, 처리기 두 개', code: EX_CALC, desc: '숫자 버튼 10개는 모두 <code>Digit_Click</code>, 연산 버튼 6개는 모두 <code>Op_Click</code> 을 씁니다. <code>Digit_Click</code> 은 <code>b.Content</code> 로 숫자를 얻고, <code>Op_Click</code> 은 <code>b.Tag</code> 로 기호를 얻습니다. 화면에는 보기 좋은 <code>×</code> · <code>−</code> 를 보여 주고, 코드는 <code>*</code> · <code>-</code> 로 계산합니다. <code>acc</code>(누적 값) · <code>op</code>(대기 중인 연산자) · <code>newNumber</code>(새 숫자 시작 여부) 세 필드로 “5 + 3 = 8” 흐름을 처리합니다. <code>Window.Resources</code> 의 <code>Style</code> 은 모든 버튼에 같은 글꼴 크기와 여백을 주는 방법으로, 19장에서 자세히 배웁니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 부모 한 곳에 연결하기 (연결된 이벤트)', html: '버블링을 이용하면 버튼 16개에 일일이 <code>Click</code> 을 쓰지 않고 <b>부모 패널 한 곳</b>에 연결할 수도 있습니다. 이렇게 자기에게 없는 이벤트를 <code>형식.이벤트</code> 로 연결하는 것을 <b>연결된 이벤트(attached event)</b> 라고 합니다. 이때 <code>sender</code> 는 패널이므로 눌린 버튼은 <code>e.OriginalSource</code>(또는 <code>e.Source</code>)로 얻습니다.' + XAML_ATTACHED + '<p>이 방식은 브라우저 실행 창에서는 지원되지 않으므로 Visual Studio 에서 해 보세요.</p>' },
          { type: 'h', text: '창(Window) 이벤트' },
          { type: 'p', html: '창 자신도 이벤트를 가지고 있습니다. <code>&lt;Window&gt;</code> 요소에 특성으로 연결합니다.' },
          { type: 'table', head: ['이벤트', '언제', '주로 하는 일'], rows: [
            ['<code>Loaded</code>', '창이 만들어져 <b>화면에 나타난 직후</b> (한 번)', '첫 포커스 주기, 파일 · 설정 불러오기'],
            ['<code>Closing</code>', '창이 닫히기 <b>직전</b> — <code>e.Cancel = true</code> 로 <b>취소 가능</b>', '“저장할까요?” 확인'],
            ['<code>Closed</code>', '창이 닫힌 <b>후</b> (취소 불가)', '정리 작업'],
            ['<code>SizeChanged</code>', '창(요소)의 크기가 바뀔 때', '크기에 맞춰 배치 · 글자 크기 조절'],
            ['<code>Activated</code> · <code>Deactivated</code>', '창이 활성(맨 앞) · 비활성이 될 때', '타이머 멈춤 · 다시 시작']
          ], caption: '자주 쓰는 창 이벤트' },
          { type: 'code', title: '예제 17-10. 창 이벤트 — Loaded · SizeChanged · Closing 에서 닫기 취소', code: EX_WINEVENTS, desc: '<code>Loaded</code> 에서 안내 문구를 바꾸고 메모 칸에 포커스를 줍니다. 창 크기를 바꾸면 <code>SizeChanged</code> 가 새 크기(<code>e.NewSize</code>)를 알려 줍니다. 메모에 글을 쓰면 <code>isDirty</code> 가 <code>true</code> 가 되고 제목에 <code>*</code> 가 붙습니다. 이제 창의 ✕ 를 누르면 <code>Closing</code> 이 먼저 불려 <b>예 / 아니요 / 취소</b> 를 묻고, <b>취소</b>를 고르면 <code>e.Cancel = true</code> 로 창이 닫히지 않습니다. <code>Closing</code> 의 <code>e</code> 는 <code>CancelEventArgs</code> 이므로 <code>using System.ComponentModel;</code> 이 필요합니다. 메모장 · 워드가 닫을 때 저장 여부를 묻는 바로 그 기능입니다.' },
          { type: 'h', text: '명령(Command) — 메뉴 · 버튼 · 단축키를 하나로' },
          { type: 'p', html: '메모장의 “저장” 은 <b>세 곳</b>에서 부를 수 있습니다: 메뉴(파일 ▸ 저장), 도구 버튼, 단축키 <kbd>Ctrl</kbd>+<kbd>S</kbd>. 처리기를 세 번 연결할 수도 있지만, “저장할 수 없는 상태” 일 때 세 곳을 모두 꺼야 하는 것까지 생각하면 번거롭습니다. WPF 는 이를 위해 <b>명령(Command)</b> 을 제공합니다. “무엇을 할지” 를 명령 하나로 만들고, 메뉴 · 버튼 · 단축키는 그 명령을 <b>가리키기만</b> 합니다.' },
          { type: 'figure', html: SVG_CMD, caption: '세 곳이 같은 명령(ApplicationCommands.Save)을 가리키고, 창의 CommandBinding 이 실제 할 일(Executed)과 가능 여부(CanExecute)를 정한다' },
          { type: 'table', head: ['구성 요소', '역할', '코드'], rows: [
            ['<b>명령</b> (<code>ICommand</code>)', '“저장” 같은 동작의 <b>이름표</b>. WPF 가 자주 쓰는 명령을 미리 만들어 둠', '<code>ApplicationCommands.New</code> · <code>Open</code> · <code>Save</code> · <code>Copy</code> · <code>Paste</code> · <code>Delete</code> …'],
            ['<b>명령 사용처</b>', '버튼 · 메뉴 항목의 <code>Command</code> 속성', '<code>Command="{x:Static ApplicationCommands.Save}"</code>'],
            ['<b>CommandBinding</b>', '명령 ↔ 처리기 연결. <code>Executed</code>(실행) · <code>CanExecute</code>(가능 여부)', '<code>CommandBindings.Add(new CommandBinding(명령, 실행, 가능여부));</code>'],
            ['<b>KeyBinding</b>', '단축키 ↔ 명령 연결', '<code>InputBindings.Add(new KeyBinding(명령, Key.S, ModifierKeys.Control));</code>']
          ], caption: '명령을 이루는 네 가지' },
          { type: 'code', title: '예제 17-11. 명령으로 저장하기 — 메뉴 · 버튼 · Ctrl+S · F2', code: EX_COMMAND, desc: '메뉴 항목과 버튼의 <code>Command</code> 가 모두 <code>ApplicationCommands.Save</code> 를 가리킵니다(<code>{x:Static …}</code> 은 C# 의 정적 속성 값을 XAML 에서 쓰는 방법). 생성자에서 ① <code>CommandBinding</code> 으로 이 명령의 <code>Executed</code> · <code>CanExecute</code> 처리기를 등록하고, ② <code>KeyBinding</code> 으로 <kbd>Ctrl</kbd>+<kbd>S</kbd> 와 <kbd>F2</kbd> 를 연결했습니다. 처음에는 글이 비어 있어 <code>CanExecute</code> 가 <code>false</code> → 버튼과 메뉴가 <b>저절로 흐리게(비활성)</b> 됩니다. 글자를 하나 쓰면 WPF 가 <code>CanExecute</code> 를 다시 물어보고 둘 다 켜집니다. <code>IsEnabled</code> 를 직접 바꾸는 코드는 한 줄도 없다는 점에 주목하세요.' },
          { type: 'callout', kind: 'tip', title: 'CanExecute 는 WPF 가 알아서 수시로 부른다', html: '키를 누르거나 클릭하는 등 입력이 있을 때마다 WPF 는 연결된 명령들의 <code>CanExecute</code> 를 다시 불러 버튼 · 메뉴의 활성 상태를 맞춥니다. 그래서 <code>CanExecute</code> 안에는 <b>빨리 끝나는 간단한 검사</b>만 두세요(파일 읽기 같은 무거운 일 금지). 입력 없이 상태가 바뀌었을 때(예: 타이머)는 <code>CommandManager.InvalidateRequerySuggested();</code> 로 다시 물어보게 할 수 있습니다.' },
          { type: 'callout', kind: 'warn', title: '브라우저 실행 창에서 Ctrl+S · Ctrl+N 은 브라우저가 먼저 가로챌 수 있습니다', html: '브라우저에서 <kbd>Ctrl</kbd>+<kbd>S</kbd> 는 “페이지 저장”, <kbd>Ctrl</kbd>+<kbd>N</kbd> 은 “새 창” 입니다. 강좌 실행 창에서는 명령이 실행되더라도 브라우저 창이 함께 뜨거나 키가 전달되지 않을 수 있으니, 메뉴 · 버튼 · <kbd>F2</kbd> 로 확인하세요. Visual Studio 로 만든 진짜 WPF 앱에서는 모두 정상 동작합니다. 참고로 <code>ApplicationCommands.Save</code> · <code>New</code> 에는 <kbd>Ctrl</kbd>+<kbd>S</kbd> · <kbd>Ctrl</kbd>+<kbd>N</kbd> 이 <b>기본으로 들어 있어</b> 실제 WPF 에서는 KeyBinding 없이도 동작하지만, 다른 키(<kbd>F2</kbd>)나 직접 만든 명령에는 KeyBinding 이 필요합니다.' },
          { type: 'code', title: '예제 17-12. 명령 두 개와 CanExecute — 할 일 추가 · 삭제', code: EX_TODO, desc: '<code>ApplicationCommands.New</code> 를 “추가” 로, <code>ApplicationCommands.Delete</code> 를 “삭제” 로 썼습니다. <b>추가</b> 버튼은 입력 칸이 비어 있지 않을 때만, <b>삭제</b> 버튼은 목록에서 항목을 <b>선택했을 때만</b> 켜집니다. 조건은 각자의 <code>CanExecute</code> 한 줄로 끝납니다. 이처럼 <code>CanExecute</code> 의 조건은 글자 · 선택 · 로그인 여부 등 무엇이든 될 수 있습니다. (실제 WPF 에서는 New 의 기본 단축키 <kbd>Ctrl</kbd>+<kbd>N</kbd>, 목록에 포커스가 있을 때 Delete 의 <kbd>Del</kbd> 키도 동작합니다.)' },
          { type: 'p', html: '<code>CommandBindings</code> 와 <code>InputBindings</code> 는 C# 대신 XAML 로도 쓸 수 있습니다. 결과는 같습니다.' + XAML_BINDINGS },
          { type: 'callout', kind: 'vs', title: '속성 창의 이벤트 목록 (⚡) 활용하기', html: '<ol><li>디자이너나 XAML 에서 컨트롤(또는 <code>Window</code> 자체)을 선택하고 <kbd>F4</kbd> 로 <b>속성 창</b>을 엽니다.</li><li>속성 창 오른쪽 위의 <b>번개 아이콘 ⚡(이벤트 처리기)</b> 를 누르면 그 요소의 <b>모든 이벤트</b>가 이름순으로 나옵니다. <code>Click</code>, <code>MouseDown</code>, <code>PreviewKeyDown</code>, <code>GotFocus</code> … — 오늘 배운 이벤트를 모두 찾아보세요.</li><li>이벤트 이름 옆 빈 칸을 <b>더블클릭</b>하면 <code>요소이름_이벤트</code> 처리기가 코드 비하인드에 자동으로 만들어지고 XAML 에도 연결됩니다. 이미 있는 메서드 이름을 입력해 연결할 수도 있습니다.</li><li><code>Window</code> 를 선택하면 <code>Loaded</code>, <code>Closing</code>, <code>SizeChanged</code>, <code>KeyDown</code> 같은 창 이벤트가 보입니다.</li><li>이벤트 이름에 마우스를 올리면 “언제 발생하는지” 설명이 나옵니다. 모르는 이벤트를 발견하면 읽어 보는 습관을 들이세요.</li></ol>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 나만의 명령 만들기', html: '<code>ApplicationCommands</code> 에 없는 동작은 직접 만듭니다. <code>public static readonly RoutedUICommand ClearAll = new RoutedUICommand("모두 지우기", "ClearAll", typeof(MainWindow));</code> 처럼 정적 필드로 만들고, XAML 에서는 <code>xmlns:local="clr-namespace:MyApp"</code> 를 선언한 뒤 <code>Command="{x:Static local:MainWindow.ClearAll}"</code> 로 씁니다. 20장 MVVM 에서는 <code>ICommand</code> 를 직접 구현한 <b>RelayCommand</b> 로 코드 비하인드 없이 명령을 연결하는 방법을 배웁니다.' }
        ],
        practice: [
          {
            title: '실습 17-3. 전화 키패드 — 버튼 12개를 처리기 하나로',
            level: 2,
            desc: '<p>버튼 12개(1~9, 지움, 0, C)가 모두 같은 처리기 <code>Key_Click</code> 을 씁니다. 각 버튼의 <code>Tag</code> 에는 <code>"1"</code> ~ <code>"9"</code>, <code>"0"</code>, <code>"Back"</code>, <code>"Clear"</code> 가 들어 있습니다. <code>Key_Click</code> 을 완성하세요.</p><ul><li>숫자 버튼: 번호 뒤에 붙이기 (최대 <b>11자리</b>)</li><li><b>지움</b>: 마지막 한 글자 지우기 · <b>C</b>: 모두 지우기</li><li>아래 안내에 <code>n자리</code>, 11자리가 되면 <b>입력 완료!</b> 표시</li></ul>',
            hint: '<code>Button b = (Button)sender; string tag = (string)b.Tag;</code> 로 시작합니다. 마지막 글자 지우기는 <code>number.Substring(0, number.Length - 1)</code> — 빈 문자열이면 하지 않도록 길이를 먼저 검사하세요. 조건식이 세 갈래이므로 <code>if</code> / <code>else if</code> / <code>else if</code> 가 알맞습니다.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 17-4. Ctrl+N · Ctrl+S 명령이 있는 메모 창',
            level: 3,
            desc: '<p>메뉴와 버튼의 <code>Command</code> 는 이미 <code>ApplicationCommands.New</code> · <code>Save</code> 로 연결되어 있습니다. 코드 비하인드를 완성하세요.</p><ul><li>생성자: New · Save 의 <code>CommandBinding</code>, <kbd>Ctrl</kbd>+<kbd>N</kbd> · <kbd>Ctrl</kbd>+<kbd>S</kbd> 의 <code>KeyBinding</code></li><li>글을 고치면 제목이 <b>메모 *</b> 가 되고, <b>저장</b>은 바뀐 내용이 있을 때만 켜집니다(<code>CanExecute</code>).</li><li><b>저장</b>: <code>savedText</code> 에 보관, 제목 <b>메모</b>, 상태 표시줄에 <b>저장했습니다 (n글자)</b></li><li><b>새로 만들기</b>: 바뀐 내용이 있으면 “저장할까요?”(예/아니요/취소)를 물은 뒤 비우기 — 취소면 아무것도 하지 않음</li><li>도전: 창을 닫을 때도 같은 질문을 하고, 취소하면 닫지 않기(<code>Closing</code>)</li></ul>',
            hint: '묻는 부분을 <code>bool AskSave()</code> 메서드(계속해도 되면 true, 취소면 false)로 만들면 New 와 Closing 에서 함께 쓸 수 있습니다. <code>txtMemo.Clear()</code> 도 <code>TextChanged</code> 를 일으켜 <code>isDirty</code> 가 true 가 되므로, 지운 <b>다음에</b> <code>isDirty = false;</code> 로 되돌리세요. 브라우저 실행 창에서는 단축키 대신 메뉴 · 버튼으로 확인하세요.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '이름이 <code>Preview</code> 로 시작하는 이벤트(<code>PreviewMouseDown</code> 등)의 전달 방식은?', options: ['버블링 — 클릭한 요소에서 창 쪽으로 올라간다', '터널링 — 창에서 클릭한 요소 쪽으로 내려간다', '직접 — 클릭한 요소에서만 발생한다', '무작위 순서로 전달된다'], answer: 1, explain: 'Preview 이벤트는 <b>터널링</b>으로 위(창)에서 아래(대상)로 내려오며, 짝인 일반 이벤트(버블링)보다 <b>먼저</b> 발생합니다.' },
          { q: '같은 Border 에 <code>PreviewMouseDown</code> 과 <code>MouseDown</code> 처리기가 있다. Preview 처리기에서 <code>e.Handled = true;</code> 를 하면?', options: ['두 처리기 모두 실행되지 않는다', 'MouseDown 이 먼저 실행된다', '아무 변화가 없다', 'Preview 처리기만 실행되고 MouseDown 처리기는 불리지 않는다'], answer: 3, explain: '<code>Handled</code> 는 “처리 끝” 표시입니다. Preview 단계에서 표시하면 이어지는 MouseDown(버블링) 처리기들은 불리지 않습니다.' },
          { q: '버튼 세 개가 <code>Color_Click</code> 처리기 하나를 함께 쓴다. 처리기 안에서 <b>눌린 버튼</b>을 얻는 가장 알맞은 코드는?', options: ['<code>Button b = (Button)sender;</code>', '<code>Button b = this;</code>', '<code>Button b = new Button();</code>', '<code>Button b = (Button)e.Handled;</code>'], answer: 0, explain: '<code>sender</code> 는 처리기가 연결된 요소, 즉 눌린 버튼입니다. 버튼마다 다른 값이 필요하면 <code>b.Content</code> 나 <code>b.Tag</code> 를 읽습니다.' },
          { q: '창의 <code>Closing</code> 처리기에서 사용자가 “취소” 를 골랐을 때 <b>창이 닫히지 않게</b> 하려면?', options: ['<code>Close();</code> 를 한 번 더 부른다', '<code>e.Handled = true;</code>', '<code>e.Cancel = true;</code>', '<code>return false;</code>'], answer: 2, explain: '<code>Closing</code> 의 <code>e</code> 는 <code>CancelEventArgs</code> 이고, <code>e.Cancel = true</code> 로 닫기를 취소합니다. <code>Closed</code> 는 이미 닫힌 뒤라 취소할 수 없습니다.' },
          { q: '<code>CommandBinding</code> 의 <code>CanExecute</code> 처리기에서 <code>e.CanExecute = false;</code> 가 되면?', options: ['명령이 즉시 한 번 실행된다', '그 명령을 가리키는 버튼 · 메뉴가 자동으로 비활성(흐리게)이 된다', '프로그램이 종료된다', 'KeyBinding 만 꺼지고 버튼은 그대로다'], answer: 1, explain: 'WPF 가 <code>CanExecute</code> 결과에 따라 그 명령을 쓰는 버튼 · 메뉴 · 단축키를 <b>한꺼번에</b> 켜고 끕니다. <code>IsEnabled</code> 를 직접 바꿀 필요가 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '라우트된 이벤트와 명령(Command)', subtitle: 'Chapter 17 · Section 02 — 이벤트는 트리를 따라 흐른다', badge: '17-2',
            notes: '<p><b>[도입 3분]</b> 지난 시간 예제 17-2 를 다시 실행해 이미 그린 원 위를 클릭합니다. “Canvas 에 연결했는데 원 위를 눌러도 원이 그려지네요? 왜일까요?” — 오늘의 첫 질문.</p><p>목표: 터널링 · 버블링 · Handled, 처리기 하나로 여러 버튼, 창 이벤트, 명령.</p>' },
          { layout: 'diagram', title: '라우트된 이벤트 — 터널링과 버블링', html: SVG_ROUTE, caption: 'Preview 는 위 → 아래(먼저), 일반 이벤트는 아래 → 위(나중)',
            notes: '<p><b>[5분]</b> 학교 연락 체계 비유: 공지는 위에서 아래로, 건의는 아래에서 위로. 거품(bubble)이 물 위로 올라가는 모습, 터널을 파고 내려가는 모습.</p><p>발문: “Window 에 MouseDown 을 연결하면 버튼 안 글자를 눌러도 올까?” → 버블링으로 온다(단, Button 은 Click 을 위해 MouseDown 을 Handled 처리한다는 점은 심화).</p>' },
          { layout: 'table', title: '세 가지 전략', head: ['전략', '방향', '예'], rows: [
            ['터널링', '창 → 대상', '<code>PreviewMouseDown</code> · <code>PreviewKeyDown</code>'],
            ['버블링', '대상 → 창', '<code>MouseDown</code> · <code>KeyDown</code> · <code>Click</code>'],
            ['직접', '전달 없음', '<code>MouseEnter</code> · <code>MouseLeave</code>']],
            lead: '한 번 누르면 Preview(터널링) → 일반(버블링) 한 쌍이 발생',
            notes: '<p><b>[3분]</b> <code>e.Handled = true</code> = “처리 끝” 도장. 도장이 찍히면 그다음 처리기는 불리지 않는다. Preview 에서 찍으면 짝인 일반 이벤트도 오지 않는다.</p><p>브라우저 실행 창은 부모로의 전달을 일부만 흉내 낸다는 점을 미리 알려 주세요(본문 안내 상자).</p>' },
          { layout: 'code', title: '예제 17-7. Preview 와 e.Handled', code: SL_PREVIEW, points: ['같은 요소에 Preview · 일반 둘 다 연결', '항상 Preview 가 먼저', '<code>e.Handled = true</code> → MouseDown 안 옴', '입력 막기(잠금 · 숫자만)에 활용'],
            notes: '<p><b>[4분]</b> 체크 끔 → 두 줄씩 찍힘. 체크 켬 → Preview 만. Visual Studio 가 있으면 본문 예제 17-8(버블링 확인)을 실행해 sender 와 Source 가 달라지는 것도 보여 주세요.</p>' },
          { layout: 'two', title: 'sender · e.Source · e.OriginalSource', left: { title: '누구인가?', bullets: ['<code>sender</code>: 처리기가 <b>연결된</b> 요소', '<code>e.Source</code>: 이벤트를 <b>일으킨</b> 요소', '<code>e.OriginalSource</code>: 실제 마우스 아래 가장 안쪽 요소'] }, right: { title: 'TextBlock 클릭 → Grid 처리기에서', bullets: ['sender = Grid', 'Source = TextBlock', 'OriginalSource = TextBlock', '대부분은 <b>sender</b> 만으로 충분'] },
            notes: '<p><b>[3분]</b> 버블링 도중에는 sender 가 계속 바뀌고 Source 는 그대로. 초보 단계에서는 “자기 요소에 연결하고 sender 쓰기” 가 가장 안전하다고 정리합니다.</p>' },
          { layout: 'code', title: '여러 버튼을 처리기 하나로 — sender 와 Tag', code: SL_CALC, points: ['모든 버튼 <code>Click="Digit_Click"</code>', '<code>(Button)sender</code> 로 눌린 버튼', '글자가 곧 값 → <code>Content</code>', '글자와 값이 다름 → <code>Tag</code>'],
            notes: '<p><b>[5분]</b> 본문 예제 17-9(계산기)를 함께 실행해 보여 주세요. ×·÷ 는 화면용, * · / 는 코드용 → Tag 의 필요성.</p><p>발문: “버튼 16개에 처리기 16개를 만들면 무엇이 불편할까?” → 수정할 때 16곳, 실수 가능성.</p>' },
          { layout: 'table', title: '창(Window) 이벤트', head: ['이벤트', '언제', '용도'], rows: [
            ['<code>Loaded</code>', '화면에 나타난 직후', '첫 포커스 · 불러오기'],
            ['<code>Closing</code>', '닫히기 직전 (<code>e.Cancel</code>)', '“저장할까요?”'],
            ['<code>Closed</code>', '닫힌 후', '정리'],
            ['<code>SizeChanged</code>', '크기 변경', '배치 조절 (<code>e.NewSize</code>)']],
            lead: '<code>&lt;Window Loaded="…" Closing="…"&gt;</code> 처럼 연결',
            notes: '<p><b>[3분]</b> Closing 과 Closed 의 차이: 취소할 수 있느냐. Closing 의 e 는 <code>CancelEventArgs</code> → <code>using System.ComponentModel;</code> 필요.</p>' },
          { layout: 'code', title: '예제 17-10. Closing 에서 닫기 취소', code: SL_CLOSING, points: ['글을 쓰면 <code>isDirty = true</code>', '✕ 누르면 <code>Closing</code> 먼저', '<code>e.Cancel = true</code> → 창 유지', '<code>Loaded</code> 에서 첫 포커스'],
            notes: '<p><b>[4분]</b> 글 없이 닫기 → 바로 닫힘. 글 쓰고 닫기 → 질문 → 아니요 → 창 유지. 메모장 · 워드와 같은 동작임을 연결합니다.</p><p>실행 창을 닫은 뒤에는 ▶ 로 다시 실행하세요.</p>' },
          { layout: 'diagram', title: '명령(Command) — 한 곳에서 정의, 여러 곳에서 사용', html: SVG_CMD, caption: 'Executed = 할 일, CanExecute = 지금 가능한가',
            notes: '<p><b>[4분]</b> 발문: “저장할 게 없을 때 메뉴 · 버튼 · 단축키를 모두 막으려면 처리기 방식으로는 몇 곳을 고쳐야 할까?” → 세 곳. 명령은 CanExecute 한 곳.</p><p>ApplicationCommands 에 New · Open · Save · Copy · Paste · Delete 등이 준비되어 있다고 소개.</p>' },
          { layout: 'code', title: '예제 17-11. 명령 + CanExecute + KeyBinding', code: SL_COMMAND, points: ['<code>Command="{x:Static ApplicationCommands.Save}"</code>', '<code>CommandBinding(명령, Executed, CanExecute)</code>', '<code>KeyBinding(명령, Key.S, ModifierKeys.Control)</code>', '글이 없으면 버튼 자동 비활성'],
            notes: '<p><b>[5분]</b> 처리기 자리에 람다(11장)를 썼습니다 — 본문 예제 17-11 은 메서드로 쓴 버전(메뉴 · F2 포함). 실행하면 버튼이 흐리다가 글자를 쓰면 켜지는 것을 보여 줍니다.</p><p>주의: 브라우저에서는 Ctrl+S 를 브라우저가 가로챌 수 있어 버튼 · F2 로 시연. Visual Studio 에서는 정상.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '같은 Border 의 PreviewMouseDown 처리기에서 <code>e.Handled = true;</code> 를 하면?', options: ['두 처리기 모두 실행되지 않는다', 'MouseDown 이 먼저 실행된다', '아무 변화가 없다', 'Preview 처리기만 실행되고 MouseDown 처리기는 불리지 않는다'], answer: 3, explain: 'Preview 단계에서 “처리 끝” 표시를 하면 이어지는 MouseDown 처리기는 불리지 않습니다.',
            notes: '<p>정답 후 “그럼 MouseDown 에서 Handled 를 하면 부모의 MouseDown 은?” 이라고 물어 버블링이 멈춘다는 것까지 확인합니다.</p>' },
          { layout: 'practice', title: '실습 17-4. Ctrl+N · Ctrl+S 메모 창', desc: '<p>New · Save 의 CommandBinding 과 KeyBinding 을 등록하고, 저장은 바뀐 내용이 있을 때만(CanExecute), 새로 만들기 전에는 “저장할까요?”(예/아니요/취소)를 물으세요. 도전: Closing 에서도 확인.</p>', starter: P4_STARTER, solution: P4_SOLUTION,
            notes: '<p><b>[8분]</b> 시간이 부족하면 실습 17-3(키패드, 처리기 하나로)을 먼저 하고 17-4 는 과제로. AskSave() 를 메서드로 빼는 설계를 칭찬해 주세요 — New 와 Closing 에서 재사용.</p><p>흔한 실수: Clear() 뒤에 isDirty 를 false 로 되돌리지 않아 새 메모인데도 * 가 붙음.</p>' },
          { layout: 'summary', title: '정리', bullets: ['라우트된 이벤트: <b>터널링</b>(Preview, 위→아래) · <b>버블링</b>(아래→위) · 직접', '<code>e.Handled = true</code> = 처리 끝 → 뒤의 처리기 안 불림', '처리기 하나로 여러 버튼: <code>(Button)sender</code> + <code>Content</code> / <code>Tag</code>', '창 이벤트: <code>Loaded</code> · <code>Closing</code>(<code>e.Cancel</code>) · <code>SizeChanged</code>', '명령: <code>CommandBinding</code>(Executed · CanExecute) + <code>KeyBinding</code>'],
            notes: '<p>학습 목표 확인. 다음 장(18장 데이터 바인딩)에서는 TextChanged 로 일일이 옮겨 적던 값을 “연결” 만으로 자동 동기화하는 방법을 배웁니다. 오늘 배운 명령은 20장 MVVM 에서 다시 만납니다.</p>' }
        ]
      }
    ]
  });
})();
