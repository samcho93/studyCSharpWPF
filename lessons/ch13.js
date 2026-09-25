/* Chapter 13. WPF 소개와 첫 윈도우 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 그림 1. 콘솔 앱 vs GUI 앱 ---------- */
  const SVG_EVENT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="콘솔 앱은 순서대로, GUI 앱은 이벤트를 기다린다">
  <defs><marker id="ah13a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="300" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent2)">콘솔 앱 — 위에서 아래로 순서대로</text>
  <g style="font-size:22px">
    <rect x="150" y="75" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="300" y="111" text-anchor="middle" style="fill:var(--fg)">Main 시작</text>
    <rect x="150" y="160" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
    <text x="300" y="196" text-anchor="middle" style="fill:var(--fg)">입력 받기 (ReadLine)</text>
    <rect x="150" y="245" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
    <text x="300" y="281" text-anchor="middle" style="fill:var(--fg)">계산하기</text>
    <rect x="150" y="330" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
    <text x="300" y="366" text-anchor="middle" style="fill:var(--fg)">출력 (WriteLine)</text>
    <rect x="150" y="415" width="300" height="56" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="300" y="451" text-anchor="middle" style="fill:var(--fg)">Main 끝 → 프로그램 종료</text>
  </g>
  <g stroke="var(--accent)" stroke-width="3">
    <line x1="300" y1="131" x2="300" y2="156" marker-end="url(#ah13a)"/>
    <line x1="300" y1="216" x2="300" y2="241" marker-end="url(#ah13a)"/>
    <line x1="300" y1="301" x2="300" y2="326" marker-end="url(#ah13a)"/>
    <line x1="300" y1="386" x2="300" y2="411" marker-end="url(#ah13a)"/>
  </g>
  <text x="300" y="515" text-anchor="middle" style="font-size:20px;fill:var(--muted)">프로그램이 순서를 정하고, 사용자는 따라간다</text>
  <line x1="600" y1="30" x2="600" y2="530" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="945" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">GUI 앱 — 이벤트를 기다린다</text>
  <g style="font-size:22px">
    <rect x="630" y="100" width="170" height="60" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="715" y="138" text-anchor="middle" style="fill:var(--fg)">버튼 클릭</text>
    <rect x="630" y="240" width="170" height="60" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="715" y="278" text-anchor="middle" style="fill:var(--fg)">글자 입력</text>
    <rect x="630" y="380" width="170" height="60" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="715" y="418" text-anchor="middle" style="fill:var(--fg)">창 닫기</text>
    <rect x="850" y="200" width="190" height="140" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="945" y="258" text-anchor="middle" style="font-weight:700;fill:var(--ok)">메시지 루프</text>
    <text x="945" y="292" text-anchor="middle" style="font-size:19px;fill:var(--muted)">사용자 행동을</text>
    <text x="945" y="318" text-anchor="middle" style="font-size:19px;fill:var(--muted)">기다린다</text>
  </g>
  <g style="${MONO};font-size:19px">
    <rect x="1080" y="100" width="180" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1170" y="137" text-anchor="middle" style="fill:var(--fg)">Button_Click</text>
    <rect x="1080" y="240" width="180" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1170" y="277" text-anchor="middle" style="fill:var(--fg)">TextChanged</text>
    <rect x="1080" y="380" width="180" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1170" y="417" text-anchor="middle" style="fill:var(--fg)">Closing</text>
  </g>
  <g stroke="var(--accent)" stroke-width="3">
    <line x1="800" y1="130" x2="846" y2="226" marker-end="url(#ah13a)"/>
    <line x1="800" y1="270" x2="846" y2="270" marker-end="url(#ah13a)"/>
    <line x1="800" y1="410" x2="846" y2="314" marker-end="url(#ah13a)"/>
    <line x1="1040" y1="226" x2="1076" y2="134" marker-end="url(#ah13a)"/>
    <line x1="1040" y1="270" x2="1076" y2="270" marker-end="url(#ah13a)"/>
    <line x1="1040" y1="314" x2="1076" y2="406" marker-end="url(#ah13a)"/>
  </g>
  <text x="715" y="480" text-anchor="middle" style="font-size:20px;fill:var(--warn)">이벤트(사용자 행동)</text>
  <text x="1170" y="480" text-anchor="middle" style="font-size:20px;fill:var(--accent)">이벤트 처리기(메서드)</text>
  <text x="945" y="515" text-anchor="middle" style="font-size:20px;fill:var(--muted)">처리기가 끝나면 다시 기다린다 — 창을 닫을 때까지 반복</text>
</svg>`;

  /* ---------- 그림 2. WPF 프로그램 시작 흐름 ---------- */
  const SVG_START = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="WPF 프로그램이 시작되는 순서">
  <defs><marker id="ah13b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <g>
    <rect x="40" y="40" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="210" y="90" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent2)">① App 시작</text>
    <text x="210" y="132" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">App.xaml / App.xaml.cs</text>
    <text x="210" y="170" text-anchor="middle" style="font-size:19px;fill:var(--muted)">자동으로 만들어진 Main 이 실행</text>
  </g>
  <g>
    <rect x="470" y="40" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="640" y="90" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent2)">② StartupUri 확인</text>
    <text x="640" y="132" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">StartupUri="MainWindow.xaml"</text>
    <text x="640" y="170" text-anchor="middle" style="font-size:19px;fill:var(--muted)">처음 열 창을 정한다</text>
  </g>
  <g>
    <rect x="900" y="40" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1070" y="90" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent)">③ 생성자 호출</text>
    <text x="1070" y="132" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">new MainWindow()</text>
    <text x="1070" y="170" text-anchor="middle" style="font-size:19px;fill:var(--muted)">창 객체를 만든다</text>
  </g>
  <g>
    <rect x="900" y="300" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="1070" y="350" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent)">④ InitializeComponent()</text>
    <text x="1070" y="392" text-anchor="middle" style="font-size:20px;fill:var(--fg)">XAML 을 읽어 컨트롤 생성</text>
    <text x="1070" y="428" text-anchor="middle" style="font-size:19px;fill:var(--muted)">x:Name 필드 · 이벤트 연결</text>
  </g>
  <g>
    <rect x="470" y="300" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="640" y="350" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--ok)">⑤ 창 표시</text>
    <text x="640" y="392" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">Show()</text>
    <text x="640" y="428" text-anchor="middle" style="font-size:19px;fill:var(--muted)">화면에 창이 나타난다</text>
  </g>
  <g>
    <rect x="40" y="300" width="340" height="160" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="210" y="350" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--ok)">⑥ 메시지 루프</text>
    <text x="210" y="392" text-anchor="middle" style="font-size:20px;fill:var(--fg)">클릭 · 입력 이벤트를 기다림</text>
    <text x="210" y="428" text-anchor="middle" style="font-size:19px;fill:var(--muted)">이벤트가 오면 처리기 실행</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="382" y1="120" x2="464" y2="120" marker-end="url(#ah13b)"/>
    <line x1="812" y1="120" x2="894" y2="120" marker-end="url(#ah13b)"/>
    <line x1="1070" y1="202" x2="1070" y2="294" marker-end="url(#ah13b)"/>
    <line x1="898" y1="380" x2="816" y2="380" marker-end="url(#ah13b)"/>
    <line x1="468" y1="380" x2="386" y2="380" marker-end="url(#ah13b)"/>
  </g>
  <text x="640" y="515" text-anchor="middle" style="font-size:22px;fill:var(--fg)">마지막 창(MainWindow)을 닫으면 메시지 루프가 끝나고 프로그램이 종료된다</text>
</svg>`;

  /* ---------- 그림 3. partial class ---------- */
  const SVG_PARTIAL = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="XAML 과 코드 비하인드가 하나의 클래스로 합쳐진다">
  <defs><marker id="ah13c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <g>
    <rect x="30" y="40" width="390" height="190" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="225" y="80" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">MainWindow.xaml (내가 작성)</text>
    <text x="50" y="125" style="${MONO};font-size:19px;fill:var(--fg)">&lt;Button x:Name="btnOk"</text>
    <text x="50" y="155" style="${MONO};font-size:19px;fill:var(--fg)">        Click="BtnOk_Click"/&gt;</text>
    <text x="225" y="205" text-anchor="middle" style="font-size:19px;fill:var(--muted)">화면 모양 (무엇이 보이나)</text>
  </g>
  <g>
    <rect x="480" y="40" width="370" height="190" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
    <text x="665" y="80" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--muted)">MainWindow.g.cs (자동 생성)</text>
    <text x="500" y="122" style="${MONO};font-size:19px;fill:var(--fg)">partial class MainWindow</text>
    <text x="500" y="154" style="${MONO};font-size:19px;fill:var(--fg)">  Button btnOk;  // 필드</text>
    <text x="500" y="186" style="${MONO};font-size:19px;fill:var(--fg)">  InitializeComponent()</text>
    <text x="665" y="216" text-anchor="middle" style="font-size:18px;fill:var(--muted)">obj 폴더 · 직접 고치지 않는다</text>
  </g>
  <g>
    <rect x="480" y="300" width="370" height="210" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="665" y="340" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">MainWindow.xaml.cs (내가 작성)</text>
    <text x="500" y="382" style="${MONO};font-size:19px;fill:var(--fg)">partial class MainWindow</text>
    <text x="500" y="414" style="${MONO};font-size:19px;fill:var(--fg)">  MainWindow() { … }</text>
    <text x="500" y="446" style="${MONO};font-size:19px;fill:var(--fg)">  BtnOk_Click(…) { … }</text>
    <text x="665" y="490" text-anchor="middle" style="font-size:19px;fill:var(--muted)">동작 (눌리면 무엇을 하나)</text>
  </g>
  <g>
    <rect x="920" y="120" width="330" height="320" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1085" y="165" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--ok)">MainWindow 클래스</text>
    <text x="1085" y="197" text-anchor="middle" style="font-size:19px;fill:var(--muted)">컴파일하면 하나로 합쳐짐</text>
    <text x="945" y="250" style="${MONO};font-size:20px;fill:var(--fg)">• btnOk 필드</text>
    <text x="945" y="292" style="${MONO};font-size:20px;fill:var(--fg)">• InitializeComponent()</text>
    <text x="945" y="334" style="${MONO};font-size:20px;fill:var(--fg)">• MainWindow() 생성자</text>
    <text x="945" y="376" style="${MONO};font-size:20px;fill:var(--fg)">• BtnOk_Click(…)</text>
    <text x="1085" y="420" text-anchor="middle" style="font-size:19px;fill:var(--muted)">: Window 를 상속</text>
  </g>
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="422" y1="135" x2="474" y2="135" marker-end="url(#ah13c)"/>
    <line x1="852" y1="170" x2="914" y2="210" marker-end="url(#ah13c)"/>
    <line x1="852" y1="400" x2="914" y2="360" marker-end="url(#ah13c)"/>
  </g>
  <text x="448" y="115" text-anchor="middle" style="font-size:18px;fill:var(--accent)">빌드</text>
  <text x="225" y="330" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">partial = 한 클래스를</text>
  <text x="225" y="365" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">여러 파일에 나눠 쓴다</text>
  <text x="225" y="415" text-anchor="middle" style="font-size:19px;fill:var(--muted)">그래서 xaml.cs 에서</text>
  <text x="225" y="445" text-anchor="middle" style="font-size:19px;fill:var(--muted)">btnOk 를 바로 쓸 수 있다</text>
</svg>`;

  /* ======================= 예제 코드 ======================= */
  const EX_HELLO = `// ===== File: MainWindow.xaml =====
<Window x:Class="HelloWpf.MainWindow"
        ${NS}
        Title="첫 WPF 앱" Width="360" Height="220">
    <Grid>
        <TextBlock Text="안녕하세요, WPF!"
                   FontSize="28"
                   HorizontalAlignment="Center"
                   VerticalAlignment="Center"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace HelloWpf
{
    /// <summary>
    /// MainWindow.xaml 에 대한 상호 작용 논리
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();   // XAML 에 적은 화면을 만든다
        }
    }
}`;

  const EX_PROJECT = `// ===== File: App.xaml =====
<Application x:Class="FirstWpfApp.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:local="clr-namespace:FirstWpfApp"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <!-- 프로그램 전체에서 쓸 리소스(색 · 스타일)를 두는 곳 (19장) -->
    </Application.Resources>
</Application>
// ===== File: App.xaml.cs =====
using System.Windows;

namespace FirstWpfApp
{
    /// <summary>
    /// App.xaml 에 대한 상호 작용 논리
    /// </summary>
    public partial class App : Application
    {
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="FirstWpfApp.MainWindow"
        ${NS}
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:FirstWpfApp"
        mc:Ignorable="d"
        Title="MainWindow" Height="240" Width="420">
    <Grid>
        <StackPanel Margin="20">
            <TextBlock Text="FirstWpfApp" FontSize="24" FontWeight="Bold"/>
            <TextBlock Text="App.xaml 의 StartupUri 가 이 창을 열었습니다."
                       FontSize="15" Margin="0,10,0,0"/>
            <TextBlock Text="창을 닫으면 프로그램이 끝납니다."
                       FontSize="15" Foreground="Gray" Margin="0,6,0,0"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace FirstWpfApp
{
    /// <summary>
    /// MainWindow.xaml 에 대한 상호 작용 논리
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const EX_WINPROPS = `// ===== File: MainWindow.xaml =====
<Window x:Class="WindowProps.MainWindow"
        ${NS}
        Title="창 속성 연습"
        Width="420" Height="280"
        WindowStartupLocation="CenterScreen"
        ResizeMode="NoResize"
        Background="LightYellow">
    <StackPanel Margin="20">
        <TextBlock Text="Title : 제목 표시줄의 글자" FontSize="16" Margin="0,4"/>
        <TextBlock Text="Width · Height : 창의 너비와 높이" FontSize="16" Margin="0,4"/>
        <TextBlock Text="WindowStartupLocation : 처음 위치" FontSize="16" Margin="0,4"/>
        <TextBlock Text="ResizeMode : 크기 조절 허용 여부" FontSize="16" Margin="0,4"/>
        <TextBlock Text="Background : 창의 배경색" FontSize="16" Margin="0,4"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace WindowProps
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // 속성은 C# 코드에서도 읽고 바꿀 수 있다
            Title = Title + $" ({Width} x {Height})";
        }
    }
}`;

  const EX_BUTTON = `// ===== File: MainWindow.xaml =====
<Window x:Class="HelloButton.MainWindow"
        ${NS}
        Title="버튼과 메시지 상자" Width="340" Height="200"
        WindowStartupLocation="CenterScreen">
    <Button Content="눌러 보세요"
            Width="140" Height="40" FontSize="16"
            Click="Button_Click"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace HelloButton
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼을 클릭할 때마다 WPF 가 이 메서드를 불러 준다 (이벤트 처리기)
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("버튼을 눌렀습니다!", "알림");
        }
    }
}`;

  const EX_NAME = `// ===== File: MainWindow.xaml =====
<Window x:Class="NameDemo.MainWindow"
        ${NS}
        Title="x:Name 으로 컨트롤 다루기" Width="380" Height="220">
    <StackPanel Margin="20">
        <TextBlock x:Name="txtMessage" Text="XAML 에서 정한 글자"
                   FontSize="20" Margin="0,0,0,15"/>
        <Button x:Name="btnChange" Content="글자와 색 바꾸기"
                Height="34" Click="BtnChange_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace NameDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // InitializeComponent() 다음부터 x:Name 으로 이름 붙인 컨트롤을 쓸 수 있다
            txtMessage.Text = "생성자에서 바꾼 글자";
        }

        private void BtnChange_Click(object sender, RoutedEventArgs e)
        {
            txtMessage.Text = "버튼 클릭으로 바꾼 글자";
            txtMessage.Foreground = Brushes.Crimson;   // 글자색
            btnChange.IsEnabled = false;               // 버튼 비활성화
            btnChange.Content = "바꾸기 완료";
        }
    }
}`;

  const EX_CODEONLY = `// ===== File: MainWindow.xaml =====
<Window x:Class="CodeOnlyUi.MainWindow"
        ${NS}
        Title="C# 코드로 만든 화면" Width="380" Height="220">
    <!-- 내용은 비워 두고, 생성자에서 C# 코드로 채운다 -->
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace CodeOnlyUi
{
    public partial class MainWindow : Window
    {
        private TextBlock txtMessage;   // x:Name 대신 필드를 직접 만든다

        public MainWindow()
        {
            InitializeComponent();

            // <StackPanel Margin="20">
            StackPanel panel = new StackPanel();
            panel.Margin = new Thickness(20);

            // <TextBlock Text="…" FontSize="20" Margin="0,0,0,15"/>
            txtMessage = new TextBlock();
            txtMessage.Text = "코드에서 만든 글자";
            txtMessage.FontSize = 20;
            txtMessage.Margin = new Thickness(0, 0, 0, 15);

            // <Button Content="…" Height="34" Click="BtnChange_Click"/>
            Button btnChange = new Button();
            btnChange.Content = "글자와 색 바꾸기";
            btnChange.Height = 34;
            btnChange.Click += BtnChange_Click;   // 이벤트 연결 (11장의 += 과 같다)

            panel.Children.Add(txtMessage);   // 패널 안에 넣기
            panel.Children.Add(btnChange);
            Content = panel;                  // 창의 내용으로 설정
        }

        private void BtnChange_Click(object sender, RoutedEventArgs e)
        {
            txtMessage.Text = "버튼 클릭으로 바꾼 글자";
            txtMessage.Foreground = Brushes.Crimson;
            Button button = (Button)sender;   // 이벤트를 일으킨 버튼
            button.IsEnabled = false;
        }
    }
}`;

  const EX_GREET = `// ===== File: App.xaml =====
<Application x:Class="GreetingApp.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             StartupUri="MainWindow.xaml">
</Application>
// ===== File: App.xaml.cs =====
using System.Windows;

namespace GreetingApp
{
    public partial class App : Application
    {
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="GreetingApp.MainWindow"
        ${NS}
        Title="인사하기" Width="360" Height="250"
        WindowStartupLocation="CenterScreen">
    <StackPanel Margin="20">
        <TextBlock Text="이름을 입력하세요" FontSize="14"/>
        <TextBox x:Name="txtName" FontSize="16" Margin="0,6,0,10"/>
        <Button x:Name="btnGreet" Content="인사하기" Height="32"
                IsDefault="True" Click="BtnGreet_Click"/>
        <TextBlock x:Name="lblResult" FontSize="18" Foreground="SteelBlue"
                   Margin="0,15,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace GreetingApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtName.Focus();   // 시작하자마자 이름 칸에 커서
        }

        private void BtnGreet_Click(object sender, RoutedEventArgs e)
        {
            string name = txtName.Text.Trim();   // 앞뒤 공백 제거
            if (name == "")
            {
                MessageBox.Show("이름을 먼저 입력하세요.", "알림",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                txtName.Focus();
                return;
            }
            lblResult.Text = $"안녕하세요, {name}님! 반가워요.";
        }
    }
}`;

  const EX_COUNTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="CounterApp.MainWindow"
        ${NS}
        Title="카운터" Width="340" Height="230" ResizeMode="NoResize">
    <StackPanel Margin="20">
        <TextBlock x:Name="lblCount" Text="0" FontSize="48" FontWeight="Bold"
                   HorizontalAlignment="Center"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,15,0,0">
            <Button Content="-1" Width="70" Height="34" Margin="4" Click="CountButton_Click"/>
            <Button Content="초기화" Width="70" Height="34" Margin="4" Click="CountButton_Click"/>
            <Button Content="+1" Width="70" Height="34" Margin="4" Click="CountButton_Click"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace CounterApp
{
    public partial class MainWindow : Window
    {
        private int count = 0;   // 창이 살아 있는 동안 값을 기억하는 필드

        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼 세 개가 이 처리기 하나를 함께 쓴다
        private void CountButton_Click(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;          // 어떤 버튼이 눌렸나?
            string text = button.Content.ToString();

            if (text == "+1") count++;
            else if (text == "-1") count--;
            else count = 0;

            lblCount.Text = count.ToString();
            lblCount.Foreground = count < 0 ? Brushes.Crimson : Brushes.Black;
        }
    }
}`;

  const EX_MSGBOX = `// ===== File: MainWindow.xaml =====
<Window x:Class="MsgBoxDemo.MainWindow"
        ${NS}
        Title="메시지 상자 종류" Width="380" Height="310">
    <StackPanel Margin="20">
        <Button Content="정보 (Information)" Height="32" Margin="0,0,0,8" Click="BtnInfo_Click"/>
        <Button Content="경고 (Warning)" Height="32" Margin="0,0,0,8" Click="BtnWarn_Click"/>
        <Button Content="질문 (예 / 아니요)" Height="32" Margin="0,0,0,8" Click="BtnQuestion_Click"/>
        <Button Content="프로그램 끝내기" Height="32" Margin="0,0,0,8" Click="BtnExit_Click"/>
        <TextBlock x:Name="lblAnswer" Text="(대답이 여기에 표시됩니다)" FontSize="14"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace MsgBoxDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnInfo_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("저장이 완료되었습니다.", "정보",
                            MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void BtnWarn_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("입력값을 확인하세요.", "경고",
                            MessageBoxButton.OK, MessageBoxImage.Warning);
        }

        private void BtnQuestion_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("WPF 가 재미있나요?", "질문",
                                          MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
                lblAnswer.Text = "좋아요! 계속 가 봅시다.";
            else
                lblAnswer.Text = "곧 재미있어질 거예요.";
        }

        private void BtnExit_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("정말 끝낼까요?", "종료 확인",
                                          MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
            {
                Close();   // 창 닫기 → 마지막 창이므로 프로그램 종료
            }
        }
    }
}`;

  /* ======================= 실습 코드 ======================= */
  const P1_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="AboutMe.MainWindow"
        ${NS}
        Title="MainWindow" Width="300" Height="200">
    <!-- TODO 1: Title, Width, Height, WindowStartupLocation, Background 를 바꾸세요 -->
    <StackPanel Margin="20">
        <!-- TODO 2: TextBlock 세 개로 이름 · 좋아하는 것 · 목표를 쓰세요 -->
        <TextBlock Text="이름: "/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace AboutMe
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const P1_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="AboutMe.MainWindow"
        ${NS}
        Title="내 소개" Width="380" Height="240"
        WindowStartupLocation="CenterScreen"
        Background="AliceBlue">
    <StackPanel Margin="20">
        <TextBlock Text="이름: 홍길동" FontSize="20" FontWeight="Bold" Margin="0,0,0,10"/>
        <TextBlock Text="좋아하는 것: 게임 만들기" FontSize="16" Margin="0,0,0,6"/>
        <TextBlock Text="목표: WPF 로 나만의 프로그램 만들기" FontSize="16" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace AboutMe
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const P2_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="GreetButtons.MainWindow"
        ${NS}
        Title="인사 버튼" Width="340" Height="220"
        WindowStartupLocation="CenterScreen">
    <StackPanel Margin="20">
        <Button Content="아침 인사" Height="36" Margin="0,0,0,10" Click="BtnMorning_Click"/>
        <!-- TODO: "저녁 인사" 버튼을 추가하고 Click="BtnEvening_Click" 으로 연결 -->
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace GreetButtons
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnMorning_Click(object sender, RoutedEventArgs e)
        {
            // TODO: "좋은 아침입니다!" 메시지 상자 (제목: 아침)
        }

        // TODO: BtnEvening_Click 처리기 작성
    }
}`;

  const P2_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="GreetButtons.MainWindow"
        ${NS}
        Title="인사 버튼" Width="340" Height="220"
        WindowStartupLocation="CenterScreen">
    <StackPanel Margin="20">
        <Button Content="아침 인사" Height="36" Margin="0,0,0,10" Click="BtnMorning_Click"/>
        <Button Content="저녁 인사" Height="36" Click="BtnEvening_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace GreetButtons
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnMorning_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("좋은 아침입니다!", "아침");
        }

        private void BtnEvening_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("좋은 저녁입니다!", "저녁");
        }
    }
}`;

  const ADD_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="AddTwoNumbers.MainWindow"
        ${NS}
        Title="두 수 더하기" Width="320" Height="330"
        WindowStartupLocation="CenterScreen">
    <StackPanel Margin="20">
        <TextBlock Text="첫 번째 수"/>
        <TextBox x:Name="txtA" FontSize="16" Margin="0,4,0,10"/>
        <TextBlock Text="두 번째 수"/>
        <TextBox x:Name="txtB" FontSize="16" Margin="0,4,0,12"/>
        <Button x:Name="btnAdd" Content="더하기" Height="32" Click="BtnAdd_Click"/>
        <TextBlock x:Name="lblResult" FontSize="20" FontWeight="Bold" Margin="0,15,0,0"/>
    </StackPanel>
</Window>`;

  const P3_STARTER = `${ADD_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace AddTwoNumbers
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: int.TryParse 로 txtA.Text, txtB.Text 를 정수로 바꾸기
            // TODO 2: 하나라도 숫자가 아니면 경고 메시지 상자를 띄우고 return
            // TODO 3: lblResult.Text 에 "a + b = 합" 표시
        }
    }
}`;

  const P3_SOLUTION = `${ADD_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace AddTwoNumbers
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(txtA.Text, out int a) || !int.TryParse(txtB.Text, out int b))
            {
                MessageBox.Show("두 칸 모두 정수를 입력하세요.", "입력 오류",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }
            lblResult.Text = $"{a} + {b} = {a + b}";
        }
    }
}`;

  const COLOR_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="ColorPicker.MainWindow"
        ${NS}
        Title="배경색 바꾸기" Width="380" Height="220">
    <StackPanel Margin="20">
        <TextBlock x:Name="lblColor" Text="현재 색: 흰색" FontSize="18" Margin="0,0,0,15"/>
        <StackPanel Orientation="Horizontal">
            <Button Content="빨강" Width="70" Height="32" Margin="0,0,6,0" Click="ColorButton_Click"/>
            <Button Content="초록" Width="70" Height="32" Margin="0,0,6,0" Click="ColorButton_Click"/>
            <Button Content="파랑" Width="70" Height="32" Margin="0,0,6,0" Click="ColorButton_Click"/>
            <Button Content="처음으로" Width="80" Height="32" Click="BtnReset_Click"/>
        </StackPanel>
    </StackPanel>
</Window>`;

  const P4_STARTER = `${COLOR_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace ColorPicker
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 빨강 · 초록 · 파랑 버튼이 함께 쓰는 처리기
        private void ColorButton_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: sender 를 Button 으로 바꿔 Content(글자)를 알아내기
            // TODO 2: 글자에 따라 Background 를 Brushes.MistyRose / Honeydew / AliceBlue 로
            // TODO 3: lblColor.Text 에 "현재 색: 빨강" 처럼 표시
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 예/아니요로 물어보고 "예" 이면 흰색으로 되돌리기
        }
    }
}`;

  const P4_SOLUTION = `${COLOR_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace ColorPicker
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 빨강 · 초록 · 파랑 버튼이 함께 쓰는 처리기
        private void ColorButton_Click(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;
            string name = button.Content.ToString();

            if (name == "빨강") Background = Brushes.MistyRose;
            else if (name == "초록") Background = Brushes.Honeydew;
            else Background = Brushes.AliceBlue;

            lblColor.Text = $"현재 색: {name}";
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("처음 색으로 되돌릴까요?", "확인",
                                          MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
            {
                Background = Brushes.White;
                lblColor.Text = "현재 색: 흰색";
            }
        }
    }
}`;

  /* ======================= 슬라이드용 짧은 코드 ======================= */
  const SL_HELLO = `// ===== File: MainWindow.xaml =====
<Window x:Class="HelloWpfSlide.MainWindow"
        ${NS}
        Title="첫 WPF 앱" Width="360" Height="220">
    <Grid>
        <TextBlock Text="안녕하세요, WPF!" FontSize="28"
                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace HelloWpfSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const SL_WINPROPS = `// ===== File: MainWindow.xaml =====
<Window x:Class="WindowPropsSlide.MainWindow"
        ${NS}
        Title="창 속성 연습" Width="400" Height="200"
        WindowStartupLocation="CenterScreen"
        ResizeMode="NoResize"
        Background="LightYellow">
    <TextBlock Text="가운데에 뜨고, 크기를 바꿀 수 없는 창"
               FontSize="16" Margin="20"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace WindowPropsSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Title = Title + $" ({Width} x {Height})";   // 코드에서도 속성 변경
        }
    }
}`;

  const SL_BUTTON = `// ===== File: MainWindow.xaml =====
<Window x:Class="HelloButtonSlide.MainWindow"
        ${NS}
        Title="버튼과 메시지 상자" Width="340" Height="200">
    <Button Content="눌러 보세요" Width="140" Height="40"
            FontSize="16" Click="Button_Click"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace HelloButtonSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("버튼을 눌렀습니다!", "알림");
        }
    }
}`;

  const SL_NAME = `// ===== File: MainWindow.xaml =====
<Window x:Class="NameDemoSlide.MainWindow"
        ${NS}
        Title="x:Name" Width="360" Height="200">
    <StackPanel Margin="20">
        <TextBlock x:Name="txtMessage" Text="XAML 의 글자" FontSize="20"/>
        <Button x:Name="btnChange" Content="바꾸기" Margin="0,12,0,0"
                Click="BtnChange_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace NameDemoSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }

        private void BtnChange_Click(object sender, RoutedEventArgs e)
        {
            txtMessage.Text = "코드에서 바꾼 글자";
            txtMessage.Foreground = Brushes.Crimson;
            btnChange.IsEnabled = false;
        }
    }
}`;

  const SL_CODEONLY = `// ===== File: MainWindow.xaml =====
<Window x:Class="CodeOnlySlide.MainWindow"
        ${NS}
        Title="C# 코드로 만든 화면" Width="340" Height="200">
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace CodeOnlySlide
{
    public partial class MainWindow : Window
    {
        private TextBlock text = new TextBlock { Text = "코드로 만든 글자", FontSize = 20 };

        public MainWindow()
        {
            InitializeComponent();
            StackPanel panel = new StackPanel { Margin = new Thickness(20) };
            Button btn = new Button { Content = "눌러 보세요", Height = 34 };
            btn.Click += Btn_Click;          // XAML 의 Click="Btn_Click" 과 같다
            panel.Children.Add(text);
            panel.Children.Add(btn);
            Content = panel;
        }

        private void Btn_Click(object sender, RoutedEventArgs e) { text.Text = "클릭!"; }
    }
}`;

  const SL_GREET = `// ===== File: MainWindow.xaml =====
<Window x:Class="GreetingSlide.MainWindow"
        ${NS}
        Title="인사하기" Width="340" Height="210">
    <StackPanel Margin="20">
        <TextBox x:Name="txtName" FontSize="16"/>
        <Button Content="인사하기" Margin="0,8" Click="BtnGreet_Click"/>
        <TextBlock x:Name="lblResult" FontSize="18"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace GreetingSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }

        private void BtnGreet_Click(object sender, RoutedEventArgs e)
        {
            if (txtName.Text.Trim() == "") { MessageBox.Show("이름을 입력하세요."); return; }
            lblResult.Text = $"안녕하세요, {txtName.Text}님!";
        }
    }
}`;

  const SL_COUNTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="CounterSlide.MainWindow"
        ${NS}
        Title="카운터" Width="320" Height="200">
    <StackPanel Margin="20">
        <TextBlock x:Name="lblCount" Text="0" FontSize="40" HorizontalAlignment="Center"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
            <Button Content="-1" Width="60" Margin="4" Click="CountButton_Click"/>
            <Button Content="+1" Width="60" Margin="4" Click="CountButton_Click"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
namespace CounterSlide
{
    public partial class MainWindow : Window
    {
        private int count = 0;   // 필드 — 값이 유지된다
        public MainWindow() { InitializeComponent(); }
        private void CountButton_Click(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;   // 누른 버튼
            if (button.Content.ToString() == "+1") count++; else count--;
            lblCount.Text = count.ToString();
        }
    }
}`;

  const SL_MSGBOX = `// ===== File: MainWindow.xaml =====
<Window x:Class="MsgBoxSlide.MainWindow"
        ${NS}
        Title="종료 확인" Width="320" Height="180">
    <Button Content="프로그램 끝내기" Width="160" Height="36" Click="BtnExit_Click"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace MsgBoxSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }

        private void BtnExit_Click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("정말 끝낼까요?", "종료 확인",
                                          MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
            {
                Close();   // 창 닫기
            }
        }
    }
}`;

  const CSPROJ = `<pre><code>&lt;Project Sdk="Microsoft.NET.Sdk"&gt;
  &lt;PropertyGroup&gt;
    &lt;OutputType&gt;WinExe&lt;/OutputType&gt;                  &lt;!-- 콘솔 창 없는 윈도우 프로그램 --&gt;
    &lt;TargetFramework&gt;net9.0-windows&lt;/TargetFramework&gt;  &lt;!-- Windows 전용 .NET --&gt;
    &lt;Nullable&gt;enable&lt;/Nullable&gt;
    &lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;
    &lt;UseWPF&gt;true&lt;/UseWPF&gt;                            &lt;!-- WPF 라이브러리 사용 --&gt;
  &lt;/PropertyGroup&gt;
&lt;/Project&gt;</code></pre>`;

  CS_COURSE.addChapter({
    id: 'ch13',
    no: '13',
    title: 'WPF 소개와 첫 윈도우',
    subtitle: 'Hello, WPF',
    summary: '콘솔 앱과 GUI 앱의 차이(이벤트 기반)를 이해하고, Visual Studio 로 첫 WPF 애플리케이션을 만들어 실행합니다. 프로젝트 구조(App.xaml · MainWindow.xaml · 코드 비하인드), 프로그램 시작 흐름, XAML 과 코드 비하인드가 하나의 클래스가 되는 원리, 버튼 이벤트 처리와 MessageBox 를 익힙니다.',
    goals: [
      '콘솔 앱과 GUI 앱(이벤트 기반)의 차이를 설명할 수 있다',
      'WinForms · WPF · WinUI 를 비교하고 WPF 의 특징을 말할 수 있다',
      'Visual Studio 에서 WPF 애플리케이션 프로젝트를 만들고 실행할 수 있다',
      'App.xaml → MainWindow → InitializeComponent 로 이어지는 시작 흐름을 설명할 수 있다',
      'x:Name 과 이벤트 처리기로 XAML 화면과 C# 코드를 연결할 수 있다',
      'MessageBox 로 알림을 띄우고 사용자의 선택(예/아니요)에 따라 분기할 수 있다'
    ],
    sections: [
      /* ===================== ch13-1 ===================== */
      {
        id: 'ch13-1',
        title: 'WPF 란? Visual Studio 로 첫 WPF 앱 만들기',
        minutes: 50,
        goals: [
          '콘솔 앱과 GUI 앱의 실행 방식 차이(이벤트 기반)를 설명할 수 있다',
          'WinForms · WPF · WinUI 의 차이와 WPF 의 특징을 말할 수 있다',
          'Visual Studio 로 WPF 애플리케이션을 만들고 F5 로 실행할 수 있다',
          '프로젝트 파일(App.xaml · MainWindow.xaml · .xaml.cs · .csproj)의 역할을 구분할 수 있다',
          'Window 의 주요 속성을 바꾸고, 버튼 클릭으로 MessageBox 를 띄울 수 있다'
        ],
        flow: [['도입: 콘솔 앱과 GUI 앱', 7], ['WinForms · WPF · WinUI, WPF 의 특징', 10], ['Visual Studio 로 WPF 프로젝트 만들기', 13], ['프로젝트 구조 · 시작 흐름 · Window 속성', 12], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '콘솔 앱에서 GUI 앱으로' },
          { type: 'p', html: 'Part 1 에서 만든 프로그램은 모두 <b>콘솔 앱</b>이었습니다. 콘솔 앱은 <code>Main</code> 의 첫 줄부터 마지막 줄까지 <b>정해진 순서대로</b> 실행됩니다. 입력이 필요하면 <code>Console.ReadLine()</code> 에서 멈춰 기다리고, <code>Main</code> 이 끝나면 프로그램도 끝납니다.' },
          { type: 'p', html: '이제 만들 <b>GUI 앱(Graphical User Interface, 그래픽 사용자 인터페이스)</b> 은 다릅니다. 창을 띄워 놓고 <b>사용자가 무언가 하기를 기다립니다</b>. 사용자가 버튼을 누르거나 글자를 입력하면, 그 일(<b>이벤트, event</b>)에 맞는 메서드(<b>이벤트 처리기, event handler</b>)가 실행됩니다. 이런 방식을 <b>이벤트 기반(event-driven)</b> 프로그래밍이라고 합니다.' },
          { type: 'p', html: '비유하면 콘솔 앱은 <b>설문지</b>입니다. 1번, 2번, 3번 질문을 순서대로 묻습니다. GUI 앱은 <b>식당 종업원</b>입니다. 손님이 호출 벨을 누를 때까지 기다리다가, 벨이 울린 테이블로 가서 필요한 일을 합니다. 어떤 테이블이 먼저 부를지는 손님 마음입니다.' },
          { type: 'figure', html: SVG_EVENT, caption: '콘솔 앱은 순서대로 실행되고, GUI 앱은 메시지 루프에서 이벤트를 기다렸다가 처리기를 실행한다' },
          { type: 'table', head: ['', '콘솔 앱', 'GUI 앱 (WPF)'], rows: [
            ['실행 흐름', '위에서 아래로 <b>순서대로</b>', '이벤트가 올 때마다 <b>처리기 실행</b>'],
            ['입력', '<code>Console.ReadLine()</code> — 한 줄씩', '마우스 클릭 · 키보드 · 터치 — 언제든지'],
            ['출력', '<code>Console.WriteLine()</code> — 글자', '창 · 버튼 · 글상자 · 그림'],
            ['끝나는 때', '<code>Main</code> 의 마지막 줄', '사용자가 <b>창을 닫을 때</b>'],
            ['누가 순서를 정하나', '프로그램', '<b>사용자</b>']
          ], caption: '콘솔 앱과 GUI 앱 비교' },
          { type: 'h', text: 'Windows 데스크톱 UI 기술 — WinForms · WPF · WinUI' },
          { type: 'p', html: 'C# 으로 Windows 창 프로그램을 만드는 기술은 여러 가지입니다. 마이크로소프트가 시대에 따라 새로 만들어 왔고, 지금도 셋 다 쓰입니다.' },
          { type: 'table', head: ['', 'WinForms', '<b>WPF</b>', 'WinUI 3'], rows: [
            ['등장', '2002년 (.NET 1.0)', '2006년 (.NET 3.0)', '2021년 (Windows App SDK)'],
            ['화면 정의', '디자이너 + C# 코드', '<b>XAML</b> (선언형) + C#', 'XAML + C#'],
            ['그리기 방식', 'GDI+ (픽셀 기반)', '<b>DirectX · 벡터</b> (해상도 독립)', 'DirectX · 벡터'],
            ['데이터 바인딩 · 스타일', '기본적인 수준', '<b>강력함</b> (바인딩 · 스타일 · 템플릿)', '강력함'],
            ['장점', '배우기 쉽고 빠르게 만듦', '자료 · 예제가 많고 업무용으로 검증됨', '최신 Windows 11 디자인'],
            ['주 사용처', '간단한 사내 도구', '<b>업무용 프로그램 · 장비 제어 화면</b>', '새 Windows 앱']
          ], caption: 'Windows 데스크톱 UI 기술 비교 — 이 강좌는 WPF 를 배웁니다' },
          { type: 'p', html: 'WPF 에서 배운 <b>XAML · 데이터 바인딩 · MVVM</b> 은 WinUI, .NET MAUI(모바일), Avalonia(크로스 플랫폼) 에서도 거의 그대로 쓰입니다. WPF 를 제대로 익혀 두면 다른 XAML 기술로 넘어가기가 아주 쉽습니다.' },
          { type: 'h', text: 'WPF 의 특징' },
          { type: 'list', items: [
            '<b>XAML 로 화면을 선언</b>: 화면 모양은 XAML(재믈, eXtensible Application Markup Language) 이라는 XML 형식 언어로 “무엇이 어디에 있는지” 적고, 동작은 C# 으로 씁니다. 디자이너와 개발자가 나눠서 일하기 좋습니다.',
            '<b>벡터 · 해상도 독립</b>: 화면을 점(픽셀)이 아니라 선과 도형(벡터)으로 그립니다. 크기 단위도 1/96 인치 단위(DIP)라서 고해상도 모니터에서도 글자와 버튼이 흐려지지 않습니다.',
            '<b>데이터 바인딩(data binding)</b>: 컨트롤과 데이터를 “연결”해 두면 값이 바뀔 때 화면이 자동으로 따라 바뀝니다. (18장)',
            '<b>스타일 · 템플릿</b>: 웹의 CSS 처럼 모양을 한곳에 모아 여러 컨트롤에 적용합니다. (19장)',
            '<b>레이아웃 패널</b>: Grid · StackPanel 같은 패널이 창 크기에 맞춰 컨트롤을 자동으로 배치합니다. (15장)'
          ] },
          { type: 'callout', kind: 'info', title: '이 강좌에서 WPF 예제가 실행되는 방식', html: 'WPF 예제를 ▶ 실행하면 오른쪽 패널에 <b>실제로 클릭할 수 있는 창</b>이 열립니다. 브라우저 안에서 WPF 와 호환되는 라이브러리(WPF 의 부분집합)로 동작하며, 같은 코드를 Visual Studio 에 붙여 넣으면 진짜 Windows 창으로 실행됩니다. 코드 위의 <code>// ===== File: MainWindow.xaml =====</code> 같은 줄은 <b>파일 구분 표시</b>입니다. Visual Studio 에서는 표시된 이름의 파일에 각각 나눠 넣으세요.' },
          { type: 'h', text: 'Visual Studio 로 첫 WPF 앱 만들기' },
          { type: 'callout', kind: 'vs', title: '새 WPF 애플리케이션 프로젝트 만들기', html: '<ol><li>Visual Studio 2022 를 실행하고 <b>새 프로젝트 만들기</b>를 누릅니다.</li><li>템플릿 검색 칸에 <code>WPF</code> 를 입력하고, 언어가 <b>C#</b> 인 <b>WPF 애플리케이션</b>(설명: “.NET WPF 애플리케이션을 만들기 위한 프로젝트”)을 선택 → <b>다음</b>.<br>⚠️ 이름이 비슷한 <b>WPF 앱(.NET Framework)</b> 은 옛 버전용이니 고르지 마세요.</li><li>프로젝트 이름에 <code>HelloWpf</code> 를 입력하고 저장 위치를 정한 뒤 → <b>다음</b>. (이름에 한글 · 공백은 피하세요. 이 이름이 네임스페이스가 됩니다.)</li><li>프레임워크에서 <b>.NET 8.0 (장기 지원)</b> 또는 <b>.NET 9.0</b> 을 고르고 → <b>만들기</b>.</li><li>잠시 뒤 <code>MainWindow.xaml</code> 이 <b>디자이너</b>(위: 미리 보기, 아래: XAML 편집기)로 열립니다.</li></ol><p>“.NET 데스크톱 개발” 워크로드가 설치되어 있어야 WPF 템플릿이 보입니다. 보이지 않으면 <b>도구 → 도구 및 기능 가져오기</b>에서 설치하세요.</p>' },
          { type: 'p', html: '만들어진 <code>MainWindow.xaml</code> 의 <code>&lt;Grid&gt;&lt;/Grid&gt;</code> 사이에 <code>TextBlock</code>(글자를 보여 주는 컨트롤) 하나를 넣어 봅시다. 아래 예제를 ▶ 실행하면 오른쪽에 창이 뜹니다.' },
          { type: 'code', title: '예제 13-1. 첫 WPF 앱 — 창에 인사말 표시', code: EX_HELLO, desc: '<code>MainWindow.xaml</code> 은 <b>화면</b>, <code>MainWindow.xaml.cs</code> 는 <b>코드</b>입니다. <code>&lt;TextBlock&gt;</code> 요소 하나가 글자 하나를 화면에 놓고, <code>FontSize</code> · <code>HorizontalAlignment</code> · <code>VerticalAlignment</code> 특성으로 크기와 위치(가운데)를 정했습니다. C# 코드는 템플릿 그대로이며, 생성자의 <code>InitializeComponent()</code> 가 XAML 을 읽어 화면을 만듭니다. 창의 크기를 조절해 보세요. 글자가 항상 가운데에 있습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 화면 구성과 실행', html: '<ul><li><b>디자이너(Designer)</b>: XAML 이 어떻게 보이는지 미리 보여 줍니다. XAML 을 고치면 바로 반영됩니다.</li><li><b>XAML 편집기</b>: 디자이너 아래 창. 자동 완성(IntelliSense)이 요소 · 특성 이름을 제안합니다.</li><li><b>도구 상자(Toolbox)</b> — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd>: Button · TextBox 같은 컨트롤을 디자이너로 끌어다 놓을 수 있습니다.</li><li><b>속성 창(Properties)</b> — <kbd>F4</kbd>: 선택한 컨트롤의 속성(글자, 색, 크기 …)을 표로 보고 바꿉니다. 바꾸면 XAML 에 그대로 적힙니다.</li><li><b>솔루션 탐색기</b> — <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd>: 프로젝트의 파일 목록. <code>MainWindow.xaml</code> 옆 ▶ 를 펼치면 <code>MainWindow.xaml.cs</code> 가 보입니다. (<kbd>F7</kbd> 코드 보기, <kbd>Shift</kbd>+<kbd>F7</kbd> 디자이너 보기)</li><li><b>실행</b>: <kbd>F5</kbd>(디버깅 시작) 또는 ▶ 단추. 콘솔 앱과 달리 창이 뜨고, <b>창을 닫아야</b> 프로그램이 끝납니다. 실행 중에 멈추려면 <kbd>Shift</kbd>+<kbd>F5</kbd>.</li><li>실행 중에 XAML 을 고치고 저장하면 <b>XAML 핫 다시 로드(Hot Reload)</b> 로 실행 중인 창에 곧바로 반영됩니다.</li></ul>' },
          { type: 'h', text: '프로젝트에 만들어지는 파일' },
          { type: 'table', head: ['파일', '역할', '비유'], rows: [
            ['<code>App.xaml</code>', '프로그램 전체 설정. <code>StartupUri</code> 로 <b>처음 열 창</b>을 정하고, 공용 리소스를 둔다', '건물의 정문 안내판'],
            ['<code>App.xaml.cs</code>', '<code>App</code> 클래스(<code>Application</code> 상속)의 C# 코드. 시작 · 종료 이벤트 처리', '안내 데스크 직원'],
            ['<code>MainWindow.xaml</code>', '메인 창의 <b>화면 모양</b>(XAML)', '방의 인테리어 도면'],
            ['<code>MainWindow.xaml.cs</code>', '메인 창의 <b>동작</b>(C#) — “코드 비하인드(code-behind)” 라고 부름', '방에서 일하는 사람'],
            ['<code>HelloWpf.csproj</code>', '프로젝트 설정 파일. <code>&lt;UseWPF&gt;true&lt;/UseWPF&gt;</code> 가 WPF 를 켠다', '공사 설계서'],
            ['<code>AssemblyInfo.cs</code>', '어셈블리 정보(테마 리소스 위치 등). 보통 건드리지 않음', '건물 등기부']
          ], caption: 'WPF 애플리케이션 템플릿이 만드는 파일' },
          { type: 'p', html: '솔루션 탐색기에서 프로젝트 이름을 더블클릭하면 <code>.csproj</code> 가 열립니다. 콘솔 앱과 다른 곳은 세 군데입니다.' + CSPROJ },
          { type: 'code', title: '예제 13-2. 프로젝트 전체 구조 — App.xaml 과 MainWindow', code: EX_PROJECT, desc: 'Visual Studio 템플릿이 만드는 네 파일을 그대로 옮긴 것입니다(창 크기만 줄임). <code>App.xaml</code> 의 <code>StartupUri="MainWindow.xaml"</code> 가 “시작하면 이 창을 열어라” 라는 뜻입니다. <code>x:Class="FirstWpfApp.App"</code> 은 이 XAML 이 <code>FirstWpfApp</code> 네임스페이스의 <code>App</code> 클래스와 짝이라는 표시입니다. <code>MainWindow.xaml</code> 의 <code>xmlns:d</code> · <code>xmlns:mc</code> · <code>mc:Ignorable="d"</code> 는 디자이너 전용 정보를 위한 선언이라 실행에는 영향이 없습니다.' },
          { type: 'h', text: '프로그램은 어떻게 시작될까?' },
          { type: 'p', html: '콘솔 앱에는 <code>static void Main()</code> 이 있었습니다. 그런데 WPF 프로젝트에는 <code>Main</code> 이 보이지 않습니다. <code>Main</code> 은 <b>빌드할 때 자동으로 만들어져</b> 숨어 있습니다. 시작 순서는 다음과 같습니다.' },
          { type: 'figure', html: SVG_START, caption: 'WPF 시작 흐름: App → StartupUri → MainWindow 생성자 → InitializeComponent → 창 표시 → 메시지 루프' },
          { type: 'list', ordered: true, items: [
            '자동으로 만들어진 <code>Main</code> 이 <code>App</code> 객체를 만들고 <code>Run()</code> 을 호출합니다.',
            '<code>App.xaml</code> 의 <code>StartupUri</code> 를 보고 <code>MainWindow.xaml</code> 을 열기로 합니다.',
            '<code>new MainWindow()</code> — <code>MainWindow</code> 의 <b>생성자</b>가 실행됩니다.',
            '생성자 안의 <code>InitializeComponent()</code> 가 XAML 을 읽어 Button · TextBlock 같은 <b>객체를 실제로 만들고</b>, <code>x:Name</code> 필드와 이벤트 처리기를 연결합니다.',
            '창이 화면에 나타납니다(<code>Show()</code>).',
            '<b>메시지 루프</b>가 돌면서 클릭 · 키 입력 같은 이벤트를 기다리고, 이벤트가 오면 처리기를 호출합니다. 마지막 창을 닫으면 루프가 끝나고 프로그램이 종료됩니다.'
          ] },
          { type: 'callout', kind: 'warn', title: 'InitializeComponent() 를 지우면?', html: '<code>InitializeComponent()</code> 는 “XAML 도면대로 화면을 조립하라” 는 명령입니다. 이 줄을 지우면 창은 뜨지만 <b>안이 텅 빕니다</b>. 또 이 줄보다 <b>앞에서</b> XAML 컨트롤(<code>x:Name</code>)을 쓰면 아직 만들어지지 않아 <code>null</code> 이므로 <code>NullReferenceException</code> 이 납니다. 생성자에서 컨트롤을 다루는 코드는 항상 <code>InitializeComponent();</code> <b>다음 줄</b>에 쓰세요.' },
          { type: 'h', text: 'Window 의 주요 속성' },
          { type: 'p', html: '<code>&lt;Window&gt;</code> 요소의 특성(attribute)으로 창의 모양과 동작을 정합니다. 속성 창(<kbd>F4</kbd>)에서 바꿔도 같은 XAML 이 만들어집니다.' },
          { type: 'table', head: ['속성', '뜻', '예'], rows: [
            ['<code>Title</code>', '제목 표시줄의 글자', '<code>Title="창 속성 연습"</code>'],
            ['<code>Width</code> · <code>Height</code>', '창의 너비 · 높이 (단위: DIP, 1/96 인치)', '<code>Width="420" Height="280"</code>'],
            ['<code>WindowStartupLocation</code>', '처음 뜨는 위치: <code>Manual</code>(기본) · <code>CenterScreen</code>(화면 가운데) · <code>CenterOwner</code>', '<code>WindowStartupLocation="CenterScreen"</code>'],
            ['<code>ResizeMode</code>', '크기 조절: <code>CanResize</code>(기본) · <code>CanMinimize</code> · <code>NoResize</code>', '<code>ResizeMode="NoResize"</code>'],
            ['<code>Background</code>', '배경색 (색 이름 또는 <code>#RRGGBB</code>)', '<code>Background="LightYellow"</code>'],
            ['<code>WindowState</code>', '<code>Normal</code> · <code>Maximized</code>(최대화) · <code>Minimized</code>', '<code>WindowState="Maximized"</code>'],
            ['<code>Topmost</code>', '<code>True</code> 면 항상 다른 창 위에', '<code>Topmost="True"</code>']
          ] },
          { type: 'code', title: '예제 13-3. Window 속성 바꾸기', code: EX_WINPROPS, desc: '<code>ResizeMode="NoResize"</code> 라서 창 테두리를 끌어도 크기가 바뀌지 않고, 최대화 단추도 없습니다. 생성자에서는 <code>Title = Title + …</code> 로 <b>C# 코드에서도 속성을 읽고 바꿀 수 있음</b>을 보였습니다. 제목이 “창 속성 연습 (420 x 280)” 이 됩니다. XAML 의 <code>Width="420"</code> 은 C# 의 <code>Width = 420;</code> 과 같은 일을 합니다.' },
          { type: 'h', text: '버튼을 눌러 메시지 상자 띄우기' },
          { type: 'p', html: '이제 GUI 앱답게 <b>이벤트</b>를 처리해 봅시다. XAML 의 <code>&lt;Button&gt;</code> 에 <code>Click="Button_Click"</code> 을 적으면, 버튼을 누를 때마다 코드 비하인드의 <code>Button_Click</code> 메서드가 호출됩니다. <code>MessageBox.Show(내용, 제목)</code> 은 작은 알림 창(메시지 상자)을 띄웁니다.' },
          { type: 'code', title: '예제 13-4. 버튼 클릭 → MessageBox', code: EX_BUTTON, desc: '버튼을 눌러 보세요. “알림” 이라는 제목의 메시지 상자가 뜹니다. 처리기의 모양 <code>private void 이름(object sender, RoutedEventArgs e)</code> 는 <b>정해진 형식</b>입니다(11장의 이벤트 처리기와 같은 모양). 두 매개변수의 뜻은 다음 교시에 배웁니다. <code>Window</code> 의 내용으로 버튼 하나만 넣었고, <code>Width</code> · <code>Height</code> 를 주었기 때문에 버튼이 창 가운데에 놓입니다.' },
          { type: 'callout', kind: 'tip', title: 'MessageBox 는 “모달” 창입니다', html: '<code>MessageBox.Show</code> 는 사용자가 <b>확인을 누를 때까지 다음 줄로 넘어가지 않습니다</b>. 그동안 뒤의 창도 클릭할 수 없습니다. 이런 창을 <b>모달(modal)</b> 창이라고 합니다. 콘솔의 <code>Console.ReadLine()</code> 처럼 “기다리는” 문장이라고 생각하면 됩니다. 값 확인용으로 <code>MessageBox.Show($"count = {count}");</code> 처럼 디버깅에 쓰기도 좋습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 숨어 있는 Main 찾기', html: '프로젝트를 한 번 빌드한 뒤 솔루션 탐색기 위쪽의 <b>모든 파일 표시</b> 단추를 누르고 <code>obj\\Debug\\net9.0-windows</code> 폴더를 열어 보세요. <code>App.g.cs</code> 안에 <code>[STAThread] public static void Main()</code> 이 들어 있습니다. 내용은 대략 <code>var app = new App(); app.InitializeComponent(); app.Run();</code> 입니다. <code>MainWindow.g.cs</code> 에는 <code>InitializeComponent()</code> 의 실제 코드가 있습니다. <b>.g.cs</b> 의 g 는 generated(생성됨)의 약자로, 빌드할 때마다 다시 만들어지므로 직접 고치면 안 됩니다.' }
        ],
        practice: [
          {
            title: '실습 13-1. 자기소개 창 만들기',
            level: 1,
            desc: '<p>뼈대의 <code>MainWindow.xaml</code> 을 고쳐 다음 조건의 창을 만드세요.</p><ul><li>제목 “내 소개”, 크기 380 × 240, <b>화면 가운데</b>에서 시작, 배경색 <code>AliceBlue</code></li><li><code>StackPanel</code> 안에 <code>TextBlock</code> 세 개: 이름(굵게, 20), 좋아하는 것(16), 목표(16, 파란 계열 글자색)</li></ul>',
            hint: '<code>WindowStartupLocation="CenterScreen"</code>, <code>Background="AliceBlue"</code>, <code>FontWeight="Bold"</code>, <code>Foreground="SteelBlue"</code>. TextBlock 사이 간격은 <code>Margin="0,0,0,6"</code>(왼쪽, 위, 오른쪽, 아래).',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 13-2. 인사 버튼 두 개',
            level: 2,
            desc: '<p>“아침 인사” 버튼을 누르면 제목이 “아침” 인 메시지 상자에 <b>좋은 아침입니다!</b>, “저녁 인사” 버튼을 누르면 제목이 “저녁” 인 메시지 상자에 <b>좋은 저녁입니다!</b> 가 뜨게 하세요. 저녁 인사 버튼과 그 처리기는 직접 추가합니다.</p>',
            hint: 'XAML 에 <code>&lt;Button Content="저녁 인사" Height="36" Click="BtnEvening_Click"/&gt;</code>, C# 에 <code>private void BtnEvening_Click(object sender, RoutedEventArgs e) { … }</code>. XAML 의 <code>Click</code> 이름과 메서드 이름이 <b>정확히 같아야</b> 합니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: 'GUI 프로그램(WPF)의 실행 방식을 가장 잘 설명한 것은?', options: ['Main 의 첫 줄부터 마지막 줄까지 순서대로 실행하고 끝난다', 'ReadLine 으로 한 줄씩 입력을 받는다', '창을 띄워 두고 이벤트를 기다렸다가, 이벤트가 오면 처리기를 실행한다', '처리기는 프로그램 시작 때 한 번만 실행된다'], answer: 2, explain: 'GUI 앱은 <b>이벤트 기반</b>입니다. 메시지 루프가 사용자 행동(이벤트)을 기다렸다가 알맞은 처리기를 호출하고, 창을 닫으면 끝납니다.' },
          { q: 'WPF 에서 화면(UI)의 모양을 선언하는 XML 형식 언어는?', options: ['XAML', 'HTML', 'JSON', 'SQL'], answer: 0, explain: 'XAML(eXtensible Application Markup Language)로 화면 모양을, C# 코드 비하인드로 동작을 작성합니다.' },
          { q: 'WPF 프로그램을 실행했을 때 <b>처음 열릴 창</b>을 정하는 곳은?', options: ['<code>MainWindow.xaml.cs</code> 의 생성자', '<code>.csproj</code> 의 <code>&lt;UseWPF&gt;</code>', '<code>Program.cs</code> 의 Main', '<code>App.xaml</code> 의 <code>StartupUri</code>'], answer: 3, explain: '<code>StartupUri="MainWindow.xaml"</code> 이 시작 창을 정합니다. <code>&lt;UseWPF&gt;true&lt;/UseWPF&gt;</code> 는 WPF 라이브러리를 쓰겠다는 설정입니다.' },
          { q: '생성자의 <code>InitializeComponent()</code> 가 하는 일은?', options: ['프로그램을 종료한다', 'XAML 을 읽어 컨트롤 객체를 만들고 x:Name 필드 · 이벤트를 연결한다', '메시지 상자를 띄운다', '창의 크기를 기본값으로 되돌린다'], answer: 1, explain: 'XAML 도면대로 화면을 조립하는 메서드입니다. 이 줄 다음부터 <code>x:Name</code> 으로 이름 붙인 컨트롤을 쓸 수 있습니다.' },
          { q: '창이 <b>화면 가운데</b>에서 시작하고 <b>크기를 바꿀 수 없게</b> 하려면?', options: ['<code>Topmost="True" WindowState="Normal"</code>', '<code>HorizontalAlignment="Center" ResizeMode="CanResize"</code>', '<code>WindowStartupLocation="CenterScreen" ResizeMode="NoResize"</code>', '<code>WindowState="Maximized" ResizeMode="CanMinimize"</code>'], answer: 2, explain: '시작 위치는 <code>WindowStartupLocation</code>, 크기 조절 허용 여부는 <code>ResizeMode</code> 입니다.' }
        ],
        slides: [
          { layout: 'title', title: 'WPF 란? Visual Studio 로 첫 WPF 앱 만들기', subtitle: 'Chapter 13 · Section 01 — Part 2 WPF 윈도우 프로그래밍 시작', badge: '13-1',
            notes: '<p><b>[도입 3분]</b> “지금까지 만든 프로그램은 검은 창에 글자만 나왔죠. 오늘부터는 버튼과 창이 있는 진짜 윈도우 프로그램을 만듭니다.”</p><p>계산기, 메모장, 카카오톡 PC 버전처럼 학생들이 매일 쓰는 프로그램을 예로 듭니다. 오늘 목표: 이벤트 기반 개념, WPF 프로젝트 만들기, 시작 흐름, 첫 버튼.</p>' },
          { layout: 'diagram', title: '콘솔 앱 vs GUI 앱 — 이벤트 기반', html: SVG_EVENT, caption: '콘솔: 프로그램이 순서를 정함 · GUI: 사용자가 순서를 정함(이벤트)',
            notes: '<p><b>[5분]</b> 왼쪽(순서대로)과 오른쪽(기다리기)을 비교합니다. 비유: 설문지 vs 식당 종업원(호출 벨).</p><p>발문: “계산기 프로그램에서 사용자가 먼저 누를 버튼을 프로그램이 알 수 있을까?” → 모른다. 그래서 기다렸다가 반응한다.</p><p>용어 3개를 칠판에: <b>이벤트</b>(일어난 일), <b>이벤트 처리기</b>(그때 실행할 메서드), <b>메시지 루프</b>(기다리는 반복).</p>' },
          { layout: 'two', title: 'WinForms · WPF · WinUI 와 WPF 의 특징', left: { title: 'Windows UI 기술', bullets: ['<b>WinForms</b> (2002): 쉽고 빠름, 픽셀 기반', '<b>WPF</b> (2006): XAML · 벡터 · 바인딩 — 업무용 표준', '<b>WinUI 3</b> (2021): 최신 Windows 11 디자인', 'XAML 기술은 서로 닮음 → WPF 가 좋은 출발점'] }, right: { title: 'WPF 의 특징', bullets: ['<b>XAML</b> 로 화면 선언 + C# 으로 동작', '<b>벡터 · 해상도 독립</b> (DIP = 1/96 인치)', '<b>데이터 바인딩</b> (18장)', '<b>스타일 · 템플릿</b> (19장)', '<b>레이아웃 패널</b> (15장)'] },
            notes: '<p><b>[8분]</b> 세 기술 중 왜 WPF 인지: 자료가 가장 많고, 공장 · 병원 · 은행 같은 업무용 프로그램에서 오래 검증됨, XAML 지식이 WinUI · MAUI 로 이어짐.</p><p>특징은 “앞으로 배울 목차” 라고 소개하고 장 번호를 짚어 주세요. 지금 다 이해할 필요는 없다고 안심시킵니다.</p>' },
          { layout: 'bullets', title: 'Visual Studio 로 WPF 프로젝트 만들기', lead: '새 프로젝트 → WPF 애플리케이션 → 이름 → .NET 8/9 → 만들기',
            bullets: ['템플릿 검색 <code>WPF</code> → <b>WPF 애플리케이션</b> (C#)', ['“WPF 앱(.NET Framework)” 은 옛 버전 — 선택 금지'], '이름 <code>HelloWpf</code> (한글 · 공백 X) → 네임스페이스가 됨', '디자이너 · XAML 편집기 · 도구 상자 · 속성 창(F4)', '<kbd>F5</kbd> 실행 → 창을 닫아야 끝남'],
            notes: '<p><b>[8분]</b> 프로젝터로 직접 시연하고 학생들도 따라 만들게 합니다. 가장 흔한 실수: .NET Framework 템플릿 선택, 프로젝트 이름에 한글.</p><p>도구 상자에서 Button 을 끌어다 놓아 보고, 속성 창에서 Content 를 바꾸면 XAML 이 바뀌는 것을 보여 주세요. “디자이너는 XAML 을 대신 써 주는 도구” 라는 점을 강조.</p>' },
          { layout: 'code', title: '예제 13-1. 첫 WPF 앱', code: SL_HELLO, points: ['<code>.xaml</code> = 화면, <code>.xaml.cs</code> = 코드', '<code>&lt;TextBlock&gt;</code> = 글자 표시 컨트롤', '<code>InitializeComponent()</code> 가 XAML 로 화면 조립', '<code>File:</code> 주석 = 파일 구분 표시'],
            notes: '<p><b>[5분]</b> ▶ 실행하면 오른쪽에 창이 뜹니다. 글자 · FontSize 를 바꿔 다시 실행. 창 크기를 늘려 가운데 정렬이 유지되는 것을 확인.</p><p>Visual Studio 에서는 두 파일에 나눠 넣는다는 점을 설명합니다. XAML 은 대소문자를 구분하고 태그를 꼭 닫아야 한다(<code>/&gt;</code>)고 짚어 주세요.</p>' },
          { layout: 'table', title: '프로젝트 파일 구조', head: ['파일', '역할'], rows: [['<code>App.xaml</code>', '프로그램 설정 · <code>StartupUri</code>(시작 창)'], ['<code>App.xaml.cs</code>', '<code>App : Application</code> 코드'], ['<code>MainWindow.xaml</code>', '메인 창의 화면(XAML)'], ['<code>MainWindow.xaml.cs</code>', '메인 창의 동작 — 코드 비하인드'], ['<code>.csproj</code>', '<code>&lt;UseWPF&gt;true&lt;/UseWPF&gt;</code> · <code>WinExe</code> · <code>net9.0-windows</code>']],
            lead: '화면(XAML)과 동작(C#)이 짝을 이룬다',
            notes: '<p><b>[5분]</b> 솔루션 탐색기를 열어 파일을 하나씩 더블클릭하며 설명. MainWindow.xaml 옆 ▶ 를 펼치면 .xaml.cs 가 “붙어” 있는 모습을 보여 줍니다.</p><p>.csproj 를 열어 콘솔 앱과 다른 세 줄(WinExe, net9.0-windows, UseWPF)을 확인합니다.</p>' },
          { layout: 'diagram', title: 'WPF 프로그램의 시작 흐름', html: SVG_START, caption: 'App → StartupUri → new MainWindow() → InitializeComponent() → Show() → 메시지 루프',
            notes: '<p><b>[6분]</b> ①~⑥ 을 손으로 짚으며 설명. “Main 은 어디 갔을까?” → 빌드할 때 자동 생성(obj\\…\\App.g.cs). 시간이 되면 모든 파일 표시로 실제 파일을 보여 주세요.</p><p>InitializeComponent 를 주석 처리하고 실행해 창이 비는 것을 시연하면 효과적입니다.</p>' },
          { layout: 'code', title: '예제 13-3. Window 속성', code: SL_WINPROPS, points: ['<code>WindowStartupLocation="CenterScreen"</code>', '<code>ResizeMode="NoResize"</code> 크기 고정', '<code>Background</code> 색 이름 · <code>#RRGGBB</code>', 'XAML 특성 = C# 속성 (<code>Title = …</code>)'],
            notes: '<p><b>[4분]</b> 실행 후 창 테두리를 끌어 크기가 안 바뀌는 것 확인. Background 를 <code>#FFE4E1</code> 등으로 바꿔 보게 합니다.</p><p>생성자에서 Title 을 바꾼 줄을 가리키며 “XAML 로 할 수 있는 일은 C# 으로도 할 수 있다” 는 점을 예고합니다(다음 교시).</p>' },
          { layout: 'code', title: '예제 13-4. 버튼 클릭 → MessageBox', code: SL_BUTTON, points: ['XAML <code>Click="Button_Click"</code> 으로 연결', '처리기 형식 <code>(object sender, RoutedEventArgs e)</code>', '<code>MessageBox.Show(내용, 제목)</code>', '메시지 상자는 <b>모달</b> — 닫을 때까지 대기'],
            notes: '<p><b>[5분]</b> 버튼을 여러 번 눌러 매번 처리기가 실행되는 것을 확인. “버튼을 안 누르면 이 메서드는 실행될까?” → 안 된다. 이것이 이벤트 기반.</p><p>Click 이름과 메서드 이름을 일부러 다르게 바꿔 오류를 보여 주면 좋습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'WPF 프로그램을 실행했을 때 처음 열릴 창을 정하는 곳은?', options: ['<code>MainWindow.xaml.cs</code> 의 생성자', '<code>.csproj</code> 의 <code>&lt;UseWPF&gt;</code>', '<code>Program.cs</code> 의 Main', '<code>App.xaml</code> 의 <code>StartupUri</code>'], answer: 3, explain: '<code>StartupUri="MainWindow.xaml"</code> 이 시작 창을 정합니다.',
            notes: '<p>답을 고른 뒤, 다른 창(예: SecondWindow.xaml)으로 시작하려면 무엇을 바꾸면 되는지 되물어 봅니다.</p>' },
          { layout: 'practice', title: '실습 13-1. 자기소개 창', desc: '<p>제목 “내 소개”, 380 × 240, 화면 가운데, 배경 <code>AliceBlue</code>. <code>StackPanel</code> 안에 TextBlock 세 개(이름 · 좋아하는 것 · 목표)를 넣으세요.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[6분]</b> 속성 창(F4)을 써서 바꿔도 되고 XAML 을 직접 써도 됩니다. 빨리 끝난 학생은 실습 13-2(인사 버튼 두 개)로.</p><p>XAML 오류가 나면 오류 목록의 줄 번호를 보고 따옴표 · 닫는 태그를 확인하게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['GUI 앱 = <b>이벤트 기반</b> (메시지 루프가 기다림)', 'WPF = XAML(화면) + C#(동작), 벡터 · 바인딩 · 스타일', 'VS: 새 프로젝트 → <b>WPF 애플리케이션</b> → .NET 8/9', 'App.xaml(StartupUri) → 생성자 → <code>InitializeComponent()</code>', '<code>Click="…"</code> 처리기 · <code>MessageBox.Show</code>'],
            notes: '<p>학습 목표를 다시 읽으며 확인. 다음 시간: XAML 과 코드 비하인드가 어떻게 하나로 합쳐지는지, x:Name 과 이벤트 처리를 더 깊게.</p>' }
        ]
      },

      /* ===================== ch13-2 ===================== */
      {
        id: 'ch13-2',
        title: 'XAML 과 코드 비하인드, 이벤트 첫걸음',
        minutes: 50,
        goals: [
          'XAML 요소가 C# 객체이고 특성이 속성임을 설명할 수 있다',
          'x:Name 으로 이름 붙인 컨트롤을 코드 비하인드에서 사용할 수 있다',
          'partial class 로 XAML 과 코드 비하인드가 하나의 클래스가 되는 원리를 설명할 수 있다',
          '이벤트 처리기를 XAML 과 C# 코드(+=) 두 방법으로 연결하고 sender 를 활용할 수 있다',
          'MessageBoxButton · MessageBoxImage · MessageBoxResult 로 사용자에게 묻고 분기할 수 있다'
        ],
        flow: [['복습 · 도입', 5], ['XAML = C# 객체, x:Name, partial class', 12], ['C# 코드로 화면 만들기 · 이벤트 연결', 12], ['인사하기 · 카운터(sender) · MessageBox', 13], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: 'XAML 요소 = C# 객체' },
          { type: 'p', html: 'XAML 은 특별한 마법이 아닙니다. <b>“객체를 만들고 속성을 정하는 C# 코드”를 XML 모양으로 쓴 것</b>입니다. XAML 에 <code>&lt;Button Content="확인" Width="80"/&gt;</code> 이라고 쓰면, WPF 는 실행할 때 <code>new Button()</code> 으로 객체를 만들고 <code>Content = "확인"</code>, <code>Width = 80</code> 을 설정합니다. 8장에서 배운 <b>클래스 · 객체 · 속성</b> 그대로입니다.' },
          { type: 'table', head: ['XAML', '같은 뜻의 C# 코드', '규칙'], rows: [
            ['<code>&lt;Button/&gt;</code>', '<code>new Button()</code>', '<b>요소</b> = 객체 생성 (요소 이름 = 클래스 이름)'],
            ['<code>Content="확인"</code>', '<code>button.Content = "확인";</code>', '<b>특성(attribute)</b> = 속성 설정'],
            ['<code>Width="80"</code>', '<code>button.Width = 80;</code>', '글자 <code>"80"</code> 이 자동으로 <code>double</code> 로 변환됨'],
            ['<code>Background="Yellow"</code>', '<code>button.Background = Brushes.Yellow;</code>', '색 이름도 알맞은 객체로 변환'],
            ['<code>&lt;StackPanel&gt;&lt;Button/&gt;&lt;/StackPanel&gt;</code>', '<code>panel.Children.Add(button);</code>', '요소 안에 넣기 = 자식으로 추가'],
            ['<code>x:Name="btnOk"</code>', '<code>Button btnOk;</code> (필드)', '코드에서 부를 <b>이름</b>'],
            ['<code>Click="BtnOk_Click"</code>', '<code>btnOk.Click += BtnOk_Click;</code>', '<b>이벤트</b>에 처리기 연결']
          ], caption: 'XAML 과 C# 의 대응 — XAML 은 객체를 만드는 코드의 다른 표기법' },
          { type: 'h', text: 'x:Name — 코드에서 컨트롤 부르기' },
          { type: 'p', html: '코드 비하인드에서 XAML 의 컨트롤을 다루려면 <b>이름</b>이 필요합니다. 요소에 <code>x:Name="txtMessage"</code> 를 붙이면, 같은 이름의 <b>필드</b>가 자동으로 만들어져 C# 에서 <code>txtMessage.Text = "…";</code> 처럼 바로 쓸 수 있습니다. 이름 앞에 종류를 붙이는 관례(<code>btn</code>Button, <code>txt</code>TextBox/TextBlock, <code>lbl</code>결과 표시)를 쓰면 코드가 읽기 쉬워집니다.' },
          { type: 'code', title: '예제 13-5. x:Name 으로 글자 · 색 바꾸기', code: EX_NAME, desc: '<code>x:Name</code> 을 붙인 <code>txtMessage</code> 와 <code>btnChange</code> 를 C# 에서 바로 사용합니다. 창이 뜰 때는 생성자가 이미 글자를 “생성자에서 바꾼 글자” 로 바꿔 놓았습니다. 버튼을 누르면 글자 · 글자색(<code>Foreground</code>)이 바뀌고, <code>IsEnabled = false</code> 로 버튼이 회색으로 비활성화됩니다. 색은 <code>System.Windows.Media</code> 의 <code>Brushes</code> 클래스에서 가져옵니다.' },
          { type: 'callout', kind: 'tip', title: 'x:Name 이 없는 요소는?', html: '이름이 없어도 화면에는 잘 보입니다. 다만 코드에서 부를 방법이 없을 뿐입니다. 그러니 <b>코드에서 읽거나 바꿀 컨트롤에만</b> <code>x:Name</code> 을 붙이면 됩니다. 이름은 C# 변수 이름 규칙을 따르고, 한 창 안에서 겹치면 안 됩니다.' },
          { type: 'h', text: 'partial class — 두 파일이 하나의 클래스' },
          { type: 'p', html: '<code>MainWindow.xaml.cs</code> 에는 <code>txtMessage</code> 필드를 선언한 적이 없는데 어떻게 쓸 수 있었을까요? 비밀은 <code>public <b>partial</b> class MainWindow</code> 의 <b>partial(부분)</b> 키워드입니다. partial 은 <b>한 클래스를 여러 파일에 나눠 쓸 수 있게</b> 해 줍니다.' },
          { type: 'figure', html: SVG_PARTIAL, caption: '빌드하면 XAML 에서 MainWindow.g.cs(필드 · InitializeComponent)가 만들어지고, 내가 쓴 MainWindow.xaml.cs 와 합쳐져 하나의 MainWindow 클래스가 된다' },
          { type: 'list', items: [
            '빌드할 때 Visual Studio 가 XAML 을 읽어 <code>MainWindow.g.cs</code> 를 <b>자동으로</b> 만듭니다. 여기에 <code>x:Name</code> 마다 필드 하나, 그리고 <code>InitializeComponent()</code> 메서드가 들어 있습니다.',
            '우리가 쓰는 <code>MainWindow.xaml.cs</code> 에는 생성자와 이벤트 처리기가 있습니다.',
            '두 파일 모두 <code>partial class MainWindow</code> 이므로 컴파일러가 <b>하나의 클래스로 합칩니다</b>. 그래서 서로의 필드 · 메서드를 자유롭게 씁니다.',
            'XAML 의 <code>x:Class="NameDemo.MainWindow"</code> 와 C# 의 <code>namespace NameDemo { … class MainWindow</code> 가 <b>정확히 같아야</b> 짝이 맞습니다. 네임스페이스나 클래스 이름을 바꿀 때는 두 곳을 함께 바꾸세요.'
          ] },
          { type: 'h', text: '같은 화면을 C# 코드만으로 만들기' },
          { type: 'p', html: 'XAML 이 “객체를 만드는 코드” 라면, XAML 없이 C# 만으로도 같은 화면을 만들 수 있어야 합니다. 예제 13-5 의 화면을 C# 으로 다시 만들어 봅시다. XAML 에는 창 껍데기만 남기고, 내용은 생성자에서 만듭니다.' },
          { type: 'code', title: '예제 13-6. XAML 없이 C# 코드로 같은 화면 만들기', code: EX_CODEONLY, desc: '주석으로 적어 둔 XAML 과 C# 한 줄 한 줄을 비교해 보세요. <code>new StackPanel()</code> 이 <code>&lt;StackPanel&gt;</code>, <code>panel.Children.Add(…)</code> 가 “요소 안에 넣기”, <code>btnChange.Click += BtnChange_Click;</code> 이 XAML 의 <code>Click="BtnChange_Click"</code> 입니다. 마지막 <code>Content = panel;</code> 은 창(Window)의 내용을 패널로 정합니다. 처리기에서는 <code>sender</code> 를 <code>Button</code> 으로 바꿔 “눌린 버튼” 을 비활성화했습니다.' },
          { type: 'table', head: ['', 'XAML 로 만들기', 'C# 코드로 만들기'], rows: [
            ['코드 길이', '짧다 (10줄 안팎)', '길다 (같은 화면에 20줄 이상)'],
            ['한눈에 보기', '화면 구조가 <b>들여쓰기로 보인다</b>', '구조를 머릿속으로 그려야 한다'],
            ['디자이너 미리 보기', '<b>된다</b>', '안 된다 (실행해야 보임)'],
            ['언제 쓰나', '<b>거의 모든 화면</b>', '개수가 실행 중에 정해질 때 (예: 버튼 N 개 만들기)']
          ], caption: '화면은 XAML 로, 동작은 C# 으로 — WPF 의 기본 역할 분담' },
          { type: 'h', text: '이벤트 처리기 연결하기' },
          { type: 'p', html: '<b>이벤트(event)</b> 는 “이런 일이 일어났다” 는 알림이고, <b>이벤트 처리기(event handler)</b> 는 그때 실행할 메서드입니다. 11장에서 <code>+=</code> 로 이벤트를 구독했던 것과 똑같습니다. WPF 에서는 두 가지 방법으로 연결합니다.' },
          { type: 'table', head: ['방법', '쓰는 곳', '예'], rows: [
            ['① XAML 특성', '<code>MainWindow.xaml</code>', '<code>&lt;Button Click="BtnOk_Click"/&gt;</code>'],
            ['② C# 코드', '생성자 등 (<code>InitializeComponent()</code> 다음)', '<code>btnOk.Click += BtnOk_Click;</code>'],
            ['처리기 (공통)', '<code>MainWindow.xaml.cs</code>', '<code>private void BtnOk_Click(object sender, RoutedEventArgs e) { … }</code>']
          ] },
          { type: 'callout', kind: 'vs', title: '처리기를 자동으로 만드는 세 가지 방법', html: '<ol><li><b>디자이너에서 더블클릭</b>: 디자이너의 버튼을 더블클릭하면 그 컨트롤의 <b>기본 이벤트</b>(Button 은 <code>Click</code>) 처리기가 만들어지고 코드 편집기로 이동합니다. XAML 에는 <code>Click="Button_Click"</code> 이 자동으로 들어갑니다. (먼저 <code>x:Name</code> 을 붙여 두면 <code>btnOk_Click</code> 처럼 이름을 딴 처리기가 됩니다)</li><li><b>속성 창의 번개 아이콘 ⚡</b>: 컨트롤을 선택하고 <kbd>F4</kbd> → 속성 창 오른쪽 위의 <b>번개 모양(이벤트 처리기)</b> 단추를 누르면 이벤트 목록이 나옵니다. 원하는 이벤트(예: <code>MouseEnter</code>) 칸을 더블클릭하면 처리기가 만들어집니다. 🔧 모양 단추를 누르면 다시 속성 목록으로 돌아갑니다.</li><li><b>XAML 편집기에서</b>: <code>Click="</code> 까지 입력하면 IntelliSense 가 <b>&lt;새 이벤트 처리기&gt;</b> 를 제안합니다. <kbd>Enter</kbd> 를 누르면 이름이 채워지고, 처리기 이름에서 <kbd>F12</kbd> 를 누르면 C# 코드로 이동합니다.</li></ol>' },
          { type: 'callout', kind: 'warn', title: '처리기 이름은 XAML 과 C# 에서 똑같이', html: 'XAML 에 <code>Click="BtnOk_Click"</code> 이 남아 있는데 C# 에서 메서드를 지우거나 이름을 바꾸면 빌드 오류 <b>CS1061</b>(“MainWindow 에 BtnOk_Click 에 대한 정의가 없습니다”)가 납니다. 처리기를 지울 때는 XAML 의 <code>Click="…"</code> 도 함께 지우세요. 반대로 디자이너를 실수로 더블클릭해 빈 처리기가 생기면, C# 메서드와 XAML 특성을 <b>둘 다</b> 지워야 합니다.' },
          { type: 'h', text: 'TextBox 입력 받아 인사하기' },
          { type: 'p', html: '<code>TextBox</code> 는 사용자가 글자를 입력하는 칸입니다. 입력한 내용은 <code>Text</code> 속성(항상 <code>string</code>)으로 읽습니다. 콘솔의 <code>Console.ReadLine()</code> 이 <b>기다렸다가</b> 읽었다면, GUI 에서는 사용자가 <b>버튼을 누른 순간</b> 처리기에서 <code>txtName.Text</code> 를 읽습니다. 이 예제는 <code>App.xaml</code> 까지 넣은 완전한 프로젝트 모양입니다.' },
          { type: 'code', title: '예제 13-7. 이름을 입력받아 인사하기', code: EX_GREET, desc: '이름을 입력하고 <b>인사하기</b>를 누르세요(<code>IsDefault="True"</code> 라서 <kbd>Enter</kbd> 로도 눌립니다). 빈 칸이면 경고 아이콘(<code>MessageBoxImage.Warning</code>)이 붙은 메시지 상자를 띄우고 <code>return</code> 으로 처리기를 끝냅니다. <code>Trim()</code> 은 공백만 입력한 경우도 빈 칸으로 보기 위해서입니다. <code>txtName.Focus()</code> 는 입력 커서를 이름 칸으로 옮깁니다.' },
          { type: 'h', text: 'sender — 어떤 버튼이 눌렸나? (카운터 앱)' },
          { type: 'p', html: '처리기의 두 매개변수는 다음과 같습니다.' },
          { type: 'list', items: [
            '<code>object sender</code>: 이벤트를 <b>보낸(일으킨) 객체</b>. 버튼의 Click 이면 눌린 그 버튼입니다. 형식이 <code>object</code> 이므로 <code>(Button)sender</code> 처럼 <b>형 변환</b>(9장)해서 씁니다.',
            '<code>RoutedEventArgs e</code>: 이벤트에 대한 <b>추가 정보</b>. <code>e.Source</code>(이벤트가 시작된 요소), <code>e.Handled</code>(처리 완료 표시) 등이 있습니다. WPF 의 이벤트는 요소 트리를 따라 부모로 전달(<b>라우팅</b>)되기 때문에 이름이 RoutedEventArgs 입니다. (17장)'
          ] },
          { type: 'p', html: '<code>sender</code> 덕분에 <b>여러 버튼이 처리기 하나를 함께 쓸 수</b> 있습니다. 아래 카운터 앱은 버튼 세 개가 모두 <code>CountButton_Click</code> 하나에 연결되어 있고, 눌린 버튼의 글자(<code>Content</code>)를 보고 할 일을 정합니다.' },
          { type: 'code', title: '예제 13-8. 카운터 앱 — 처리기 하나를 버튼 세 개가 공유', code: EX_COUNTER, desc: '<code>count</code> 는 <b>필드</b>라서 처리기가 끝나도 값이 남아 있습니다. 처리기 안의 지역 변수로 만들면 누를 때마다 0 부터 다시 시작하겠지요. <code>button.Content.ToString()</code> 으로 버튼 글자를 얻어 <code>+1</code> · <code>-1</code> · 초기화를 구분합니다. 값이 음수가 되면 글자가 빨간색이 됩니다. 버튼을 하나 더 추가해 <code>+10</code> 기능을 만들어 보세요.' },
          { type: 'h', text: 'MessageBox 더 알아보기 — 묻고 대답 받기' },
          { type: 'p', html: '<code>MessageBox.Show</code> 는 인수를 더 주면 <b>단추 종류</b>와 <b>아이콘</b>을 정할 수 있고, 사용자가 누른 단추를 <b>반환값</b>(<code>MessageBoxResult</code>)으로 알려 줍니다.' },
          { type: 'p', html: `<pre><code>// MessageBox.Show(내용, 제목, 단추 종류, 아이콘) → 누른 단추를 돌려준다
MessageBoxResult result = MessageBox.Show("저장할까요?", "확인",
                              MessageBoxButton.YesNoCancel, MessageBoxImage.Question);</code></pre>` },
          { type: 'table', head: ['열거형', '값', '뜻'], rows: [
            ['<code>MessageBoxButton</code>', '<code>OK</code> · <code>OKCancel</code> · <code>YesNo</code> · <code>YesNoCancel</code>', '표시할 단추'],
            ['<code>MessageBoxImage</code>', '<code>None</code> · <code>Information</code> ⓘ · <code>Warning</code> ⚠ · <code>Error</code> ⛔ · <code>Question</code> ?', '표시할 아이콘'],
            ['<code>MessageBoxResult</code>', '<code>OK</code> · <code>Cancel</code> · <code>Yes</code> · <code>No</code> · <code>None</code>', '사용자가 누른 단추 (반환값)']
          ], caption: 'MessageBox 에 쓰는 열거형(12장) — 모두 System.Windows 네임스페이스' },
          { type: 'code', title: '예제 13-9. MessageBox 종류와 결과 분기, Close()', code: EX_MSGBOX, desc: '네 버튼을 차례로 눌러 보세요. <b>질문</b>은 <code>YesNo</code> 단추를 띄우고 반환값을 <code>MessageBoxResult.Yes</code> 와 비교해 다른 글자를 보여 줍니다. <b>프로그램 끝내기</b>는 “예” 를 누를 때만 <code>Close()</code> 로 창을 닫습니다. 이 창이 마지막 창이므로 프로그램도 종료됩니다(브라우저에서는 창이 사라집니다).' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 창의 X 단추를 눌렀을 때도 물어보려면', html: '제목 표시줄의 <b>X</b> 를 누르면 <code>Close()</code> 와 같은 일이 일어나고, 닫히기 직전에 <code>Closing</code> 이벤트가 발생합니다. <code>&lt;Window … Closing="Window_Closing"&gt;</code> 로 연결하고 처리기 <code>private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)</code> 에서 “아니요” 일 때 <code>e.Cancel = true;</code> 로 하면 닫기가 취소됩니다. 저장하지 않은 내용이 있을 때 자주 쓰는 방법입니다. (21장)' }
        ],
        practice: [
          {
            title: '실습 13-3. 두 수 더하기 창',
            level: 2,
            desc: '<p>두 <code>TextBox</code>(<code>txtA</code>, <code>txtB</code>)에 정수를 입력하고 <b>더하기</b>를 누르면 <code>lblResult</code> 에 <code>12 + 30 = 42</code> 처럼 표시하세요. 한 칸이라도 정수가 아니면(빈 칸 포함) 제목 “입력 오류”, 경고 아이콘의 메시지 상자를 띄우고 계산하지 않습니다.</p>',
            hint: '<code>if (!int.TryParse(txtA.Text, out int a) || !int.TryParse(txtB.Text, out int b)) { MessageBox.Show(…, MessageBoxImage.Warning); return; }</code> — <code>TryParse</code> 는 변환에 실패하면 <code>false</code> 를 돌려줍니다(2장).',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 13-4. 배경색 바꾸기 (sender 활용)',
            level: 3,
            desc: '<p><b>빨강 · 초록 · 파랑</b> 버튼 세 개는 처리기 <code>ColorButton_Click</code> 하나를 함께 씁니다. 눌린 버튼의 글자에 따라 창의 <code>Background</code> 를 <code>Brushes.MistyRose</code> · <code>Brushes.Honeydew</code> · <code>Brushes.AliceBlue</code> 로 바꾸고, <code>lblColor</code> 에 “현재 색: 빨강” 처럼 표시하세요. <b>처음으로</b> 버튼은 예/아니요로 물어본 뒤 “예” 일 때만 흰색(<code>Brushes.White</code>)으로 되돌립니다.</p>',
            hint: '<code>Button button = (Button)sender; string name = button.Content.ToString();</code> — 창의 배경은 코드 비하인드에서 그냥 <code>Background = …;</code> (<code>this.Background</code>) 로 바꿉니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: 'XAML 에 <code>&lt;Button x:Name="btnOk" Content="확인"/&gt;</code> 가 있습니다. 코드 비하인드에서 버튼 글자를 “저장” 으로 바꾸는 코드는?', options: ['<code>Button.Content = "저장";</code>', '<code>btnOk.Content = "저장";</code>', '<code>x:Name.btnOk = "저장";</code>', '<code>"btnOk".Content = "저장";</code>'], answer: 1, explain: '<code>x:Name</code> 으로 붙인 이름이 그대로 필드 이름이 됩니다. <code>Content</code> 특성은 C# 의 <code>Content</code> 속성입니다.' },
          { q: '<code>public partial class MainWindow : Window</code> 에서 <code>partial</code> 의 뜻은?', options: ['클래스의 일부 기능만 공개한다', 'Window 의 일부만 상속한다', '창을 부분적으로만 표시한다', '한 클래스를 여러 파일에 나눠 정의할 수 있다'], answer: 3, explain: 'XAML 에서 자동 생성되는 <code>MainWindow.g.cs</code> 와 내가 쓴 <code>MainWindow.xaml.cs</code> 가 합쳐져 하나의 클래스가 됩니다.' },
          { q: '버튼 <code>Click</code> 이벤트 처리기의 올바른 모양은?', options: ['<code>private void BtnOk_Click(object sender, RoutedEventArgs e)</code>', '<code>private int BtnOk_Click()</code>', '<code>static void BtnOk_Click(string text)</code>', '<code>private void BtnOk_Click(Button b)</code>'], answer: 0, explain: '반환형 <code>void</code>, 매개변수 <code>(object sender, RoutedEventArgs e)</code> 가 정해진 형식입니다. 이 모양이 다르면 XAML 과 연결되지 않습니다.' },
          { q: '버튼 세 개가 처리기 하나를 함께 쓸 때, <b>어느 버튼이 눌렸는지</b> 알 수 있는 매개변수는?', options: ['<code>e.Handled</code>', '<code>this</code>', '<code>sender</code>', '<code>Content</code>'], answer: 2, explain: '<code>sender</code> 는 이벤트를 일으킨 객체입니다. <code>(Button)sender</code> 로 형 변환해 <code>Content</code> 등을 읽습니다.' },
          { q: '다음 처리기에서 사용자가 메시지 상자의 <b>아니요</b>를 누르면?<pre><code>var r = MessageBox.Show("끝낼까요?", "확인", MessageBoxButton.YesNo);\nif (r == MessageBoxResult.Yes) Close();</code></pre>', options: ['창이 닫힌다', '아무 일도 없이 창이 그대로 남는다', '오류가 발생한다', '메시지 상자가 다시 뜬다'], answer: 1, explain: '반환값이 <code>MessageBoxResult.No</code> 이므로 <code>if</code> 조건이 거짓이 되어 <code>Close()</code> 가 실행되지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: 'XAML 과 코드 비하인드, 이벤트 첫걸음', subtitle: 'Chapter 13 · Section 02', badge: '13-2',
            notes: '<p><b>[도입 3분]</b> 복습: “WPF 프로그램이 시작되면 어떤 순서로 창이 뜨나요?” (App → StartupUri → 생성자 → InitializeComponent). 오늘은 XAML 과 C# 이 어떻게 이어지는지, 그리고 버튼 · 입력칸으로 진짜 “반응하는” 프로그램을 만듭니다.</p>' },
          { layout: 'table', title: 'XAML 요소 = C# 객체', head: ['XAML', 'C#'], rows: [['<code>&lt;Button/&gt;</code>', '<code>new Button()</code>'], ['<code>Content="확인"</code>', '<code>button.Content = "확인";</code>'], ['<code>Width="80"</code>', '<code>button.Width = 80;</code>'], ['요소 안에 넣기', '<code>panel.Children.Add(button);</code>'], ['<code>x:Name="btnOk"</code>', '<code>Button btnOk;</code> 필드'], ['<code>Click="BtnOk_Click"</code>', '<code>btnOk.Click += BtnOk_Click;</code>']],
            lead: '요소 = 객체 생성, 특성 = 속성 설정',
            notes: '<p><b>[6분]</b> 8장의 “클래스 → 객체 → 속성” 을 떠올리게 합니다. XAML 은 객체를 만드는 코드를 XML 로 쓴 것일 뿐이라는 점이 오늘의 핵심.</p><p>발문: “<code>Width=\"80\"</code> 은 글자인데 어떻게 double 이 될까?” → XAML 이 알아서 변환(형식 변환기).</p>' },
          { layout: 'code', title: '예제 13-5. x:Name 으로 컨트롤 다루기', code: SL_NAME, points: ['<code>x:Name</code> = 코드에서 부를 이름(필드)', '<code>txtMessage.Text</code> · <code>Foreground</code>', '<code>IsEnabled = false</code> 비활성화', '이름 관례: btn · txt · lbl'],
            notes: '<p><b>[5분]</b> 실행 → 버튼 클릭. x:Name 을 지우고 실행하면 어떤 오류가 나는지(CS0103 이름 없음) 보여 주세요.</p><p>InitializeComponent 앞에서 txtMessage 를 쓰면 null 이라는 점도 다시 강조합니다.</p>' },
          { layout: 'diagram', title: 'partial class — 두 파일이 하나의 클래스', html: SVG_PARTIAL, caption: 'XAML → MainWindow.g.cs(자동) + MainWindow.xaml.cs(내 코드) = MainWindow 클래스',
            notes: '<p><b>[6분]</b> “xaml.cs 에 txtMessage 를 선언한 적이 없는데 왜 쓸 수 있을까?” 로 시작. 빌드 → g.cs 자동 생성 → partial 로 합쳐짐.</p><p>x:Class 와 namespace/class 이름이 같아야 한다는 점, g.cs 는 고치지 않는다는 점을 짚습니다. 가능하면 obj 폴더의 MainWindow.g.cs 를 실제로 열어 보여 주세요.</p>' },
          { layout: 'code', title: '예제 13-6. C# 코드만으로 같은 화면', code: SL_CODEONLY, points: ['<code>new StackPanel { … }</code> = <code>&lt;StackPanel&gt;</code>', '<code>Children.Add</code> = 요소 안에 넣기', '<code>btn.Click += …</code> = <code>Click="…"</code>', '<code>Content = panel;</code> 창의 내용'],
            notes: '<p><b>[6분]</b> 예제 13-5 와 나란히 띄워 비교합니다. “어느 쪽이 화면 구조를 알아보기 쉬운가?” → XAML.</p><p>결론: 화면은 XAML, 동작은 C#. 다만 버튼 개수가 실행 중에 정해지는 경우(예: 달력의 날짜 버튼)에는 코드로 만든다.</p>' },
          { layout: 'bullets', title: '이벤트 처리기 연결 — 세 가지 방법', lead: '처리기 형식: private void 이름(object sender, RoutedEventArgs e)',
            bullets: ['XAML: <code>&lt;Button Click="BtnOk_Click"/&gt;</code>', 'C#: <code>btnOk.Click += BtnOk_Click;</code> (11장의 +=)', 'VS 디자이너에서 버튼 <b>더블클릭</b> → 처리기 자동 생성', 'VS 속성 창 <b>번개 아이콘 ⚡</b> → 이벤트 목록에서 더블클릭', '처리기를 지울 땐 XAML 의 <code>Click="…"</code> 도 함께 (CS1061)'],
            notes: '<p><b>[6분]</b> Visual Studio 에서 버튼 더블클릭과 번개 아이콘을 직접 시연합니다. 번개 아이콘에서 MouseEnter 같은 다른 이벤트도 보여 주면 17장 예고가 됩니다.</p><p>주의: 실수로 더블클릭해서 생긴 빈 처리기를 C# 에서만 지우면 빌드 오류. 두 곳 모두 지우게 하세요.</p>' },
          { layout: 'code', title: '예제 13-7. TextBox 입력 → 인사하기', code: SL_GREET, points: ['<code>txtName.Text</code> 는 항상 string', '버튼을 누른 순간 처리기에서 읽는다', '빈 칸이면 MessageBox 후 <code>return</code>', '결과는 TextBlock 의 <code>Text</code> 로'],
            notes: '<p><b>[5분]</b> 콘솔의 ReadLine 과 비교: 콘솔은 “기다렸다가 읽고”, GUI 는 “버튼이 눌리면 읽는다”.</p><p>빈 칸으로 눌러 경고가 뜨는 것도 확인. 본문 예제 13-7 에는 App.xaml · IsDefault · Focus 가 더 들어 있다고 안내합니다.</p>' },
          { layout: 'code', title: '예제 13-8. 카운터 — sender 로 버튼 구분', code: SL_COUNTER, points: ['버튼 여러 개 → 처리기 <b>하나</b>', '<code>(Button)sender</code> = 눌린 버튼', '<code>count</code> 는 <b>필드</b> — 값이 유지됨', '<code>RoutedEventArgs e</code>: Source · Handled'],
            notes: '<p><b>[6분]</b> 발문: “count 를 처리기 안의 지역 변수로 옮기면?” → 매번 0 에서 시작. 직접 옮겨서 실행해 보게 하면 필드의 의미가 확실해집니다.</p><p>sender 가 object 형식이라 형 변환이 필요하다는 점(9장)을 짚습니다.</p>' },
          { layout: 'code', title: '예제 13-9. 예/아니요로 묻고 Close()', code: SL_MSGBOX, points: ['<code>MessageBoxButton.YesNo</code> 단추', '<code>MessageBoxImage.Question</code> 아이콘', '반환값 <code>MessageBoxResult.Yes</code> 비교', '<code>Close()</code> — 마지막 창이면 프로그램 종료'],
            notes: '<p><b>[5분]</b> 예 / 아니요를 각각 눌러 결과를 확인. Information · Warning · Error 아이콘도 바꿔 보게 합니다(본문 예제 13-9 에 네 가지 모두 있음).</p><p>X 단추로 닫을 때 묻는 Closing 이벤트는 21장에서 다룬다고 예고.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '버튼 세 개가 처리기 하나를 함께 쓸 때, 어느 버튼이 눌렸는지 알 수 있는 것은?', options: ['<code>e.Handled</code>', '<code>this</code>', '<code>sender</code>', '<code>Content</code>'], answer: 2, explain: '<code>sender</code> 는 이벤트를 일으킨 객체입니다. <code>(Button)sender</code> 로 형 변환해 씁니다.',
            notes: '<p>답을 확인한 뒤 “this 는 무엇을 가리킬까?” → 창(MainWindow) 자신. sender 와 this 의 차이를 한 번 더 정리합니다.</p>' },
          { layout: 'practice', title: '실습 13-3. 두 수 더하기 창', desc: '<p>두 TextBox 의 정수를 더해 <code>12 + 30 = 42</code> 처럼 표시하세요. 정수가 아니면 “입력 오류” 경고 메시지 상자를 띄우고 계산하지 않습니다.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[8분]</b> 힌트: int.TryParse(2장). 정답 실행 후 글자 · 빈 칸 · 음수를 넣어 테스트하게 합니다.</p><p>빨리 끝난 학생은 빼기 · 곱하기 버튼을 추가하거나(sender 로 한 처리기 공유), 실습 13-4(배경색 바꾸기)에 도전.</p>' },
          { layout: 'summary', title: '정리', bullets: ['XAML 요소 = 객체, 특성 = 속성 (C# 으로도 같은 화면 가능)', '<code>x:Name</code> → 코드 비하인드의 필드', '<b>partial class</b>: g.cs(자동) + xaml.cs(내 코드) = 한 클래스', '처리기 연결: <code>Click="…"</code> 또는 <code>+=</code>, VS 더블클릭 · ⚡', '<code>sender</code> 로 버튼 구분 · <code>MessageBoxResult</code> 로 분기 · <code>Close()</code>'],
            notes: '<p>학습 목표 확인. 다음 장(14장 XAML 기초)에서 XAML 문법(속성 요소, 마크업 확장, 네임스페이스)을 자세히 배웁니다.</p>' }
        ]
      }
    ]
  });
})();
