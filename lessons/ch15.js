/* Chapter 15. 레이아웃 패널 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /** 기본 코드 비하인드(생성자에서 InitializeComponent 만 호출) */
  const CB = (ns) => `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace ${ns}
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`;

  /* ------------------------------------------------------------------ SVG */
  const SVG_MEASURE = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="부모 패널이 자식을 측정하고 배치하는 과정">
  <defs><marker id="ah15a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  <marker id="ah15b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <rect x="40" y="110" width="330" height="270" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="205" y="165" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--accent)">부모 패널</text>
  <text x="205" y="210" text-anchor="middle" style="${MONO};font-size:24px;fill:var(--fg)">StackPanel</text>
  <text x="205" y="260" text-anchor="middle" style="font-size:21px;fill:var(--muted)">쓸 수 있는 공간 300 × 200</text>
  <text x="205" y="300" text-anchor="middle" style="font-size:21px;fill:var(--muted)">자식의 위치 · 크기를</text>
  <text x="205" y="330" text-anchor="middle" style="font-size:21px;fill:var(--muted)">최종 결정하는 쪽</text>
  <rect x="880" y="90" width="360" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1060" y="125" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">Button</text>
  <text x="1060" y="155" text-anchor="middle" style="font-size:19px;fill:var(--muted)">원하는 크기 80 × 25</text>
  <rect x="880" y="205" width="360" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1060" y="240" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">TextBlock</text>
  <text x="1060" y="270" text-anchor="middle" style="font-size:19px;fill:var(--muted)">원하는 크기 120 × 16</text>
  <rect x="880" y="320" width="360" height="80" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1060" y="355" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">ListBox</text>
  <text x="1060" y="385" text-anchor="middle" style="font-size:19px;fill:var(--muted)">원하는 크기 150 × 90</text>
  <line x1="375" y1="170" x2="865" y2="170" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah15a)"/>
  <text x="620" y="155" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">① 측정(Measure): “얼마나 필요하니?”</text>
  <line x1="865" y1="245" x2="375" y2="245" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah15b)"/>
  <text x="620" y="230" text-anchor="middle" style="font-size:22px;fill:var(--accent2)">원하는 크기(DesiredSize)를 알려 줌</text>
  <line x1="375" y1="330" x2="865" y2="330" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah15a)"/>
  <text x="620" y="315" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">② 배치(Arrange): “여기에 이 크기로!”</text>
  <text x="640" y="455" text-anchor="middle" style="font-size:24px;fill:var(--fg)">측정 → 배치 두 단계로 <tspan font-weight="700">부모 패널</tspan>이 자식의 최종 위치와 크기를 정한다</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:21px;fill:var(--muted)">패널마다 “나누어 주는 규칙”이 달라서 같은 버튼도 놓이는 모양이 달라진다</text>
</svg>`;

  const SVG_PANELS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="StackPanel, WrapPanel, DockPanel, Canvas 의 배치 모양">
  <g style="${MONO};font-size:24px;font-weight:700" text-anchor="middle">
    <text x="165" y="45" fill="var(--accent)">StackPanel</text>
    <text x="480" y="45" fill="var(--accent2)">WrapPanel</text>
    <text x="795" y="45" fill="var(--ok)">DockPanel</text>
    <text x="1110" y="45" fill="var(--warn)">Canvas</text>
  </g>
  <rect x="20" y="65" width="290" height="370" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="335" y="65" width="290" height="370" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="650" y="65" width="290" height="370" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="965" y="65" width="290" height="370" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <g fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="2">
    <rect x="35" y="80" width="260" height="55" rx="6"/><rect x="35" y="145" width="260" height="55" rx="6"/>
    <rect x="35" y="210" width="260" height="55" rx="6"/><rect x="35" y="275" width="260" height="55" rx="6"/>
  </g>
  <g style="font-size:22px;fill:var(--fg)" text-anchor="middle">
    <text x="165" y="115">1</text><text x="165" y="180">2</text><text x="165" y="245">3</text><text x="165" y="310">4</text>
  </g>
  <text x="165" y="400" text-anchor="middle" style="font-size:19px;fill:var(--muted)">(빈 공간은 그대로 남음)</text>
  <g fill="var(--accent2)" fill-opacity="0.25" stroke="var(--accent2)" stroke-width="2">
    <rect x="350" y="80" width="80" height="70" rx="6"/><rect x="440" y="80" width="80" height="70" rx="6"/><rect x="530" y="80" width="80" height="70" rx="6"/>
    <rect x="350" y="160" width="80" height="70" rx="6"/><rect x="440" y="160" width="80" height="70" rx="6"/><rect x="530" y="160" width="80" height="70" rx="6"/>
    <rect x="350" y="240" width="80" height="70" rx="6"/>
  </g>
  <g style="font-size:22px;fill:var(--fg)" text-anchor="middle">
    <text x="390" y="123">1</text><text x="480" y="123">2</text><text x="570" y="123">3</text>
    <text x="390" y="203">4</text><text x="480" y="203">5</text><text x="570" y="203">6</text><text x="390" y="283">7</text>
  </g>
  <text x="480" y="370" text-anchor="middle" style="font-size:19px;fill:var(--muted)">자리가 모자라면</text>
  <text x="480" y="398" text-anchor="middle" style="font-size:19px;fill:var(--muted)">다음 줄로 넘어감</text>
  <rect x="662" y="77" width="266" height="50" rx="6" fill="var(--ok)" fill-opacity="0.3" stroke="var(--ok)" stroke-width="2"/>
  <text x="795" y="110" text-anchor="middle" style="font-size:21px;fill:var(--fg)">Top (메뉴)</text>
  <rect x="662" y="373" width="266" height="50" rx="6" fill="var(--ok)" fill-opacity="0.3" stroke="var(--ok)" stroke-width="2"/>
  <text x="795" y="406" text-anchor="middle" style="font-size:21px;fill:var(--fg)">Bottom (상태)</text>
  <rect x="662" y="133" width="80" height="234" rx="6" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="2"/>
  <text x="702" y="255" text-anchor="middle" style="font-size:21px;fill:var(--fg)">Left</text>
  <rect x="748" y="133" width="180" height="234" rx="6" fill="var(--warn)" fill-opacity="0.2" stroke="var(--warn)" stroke-width="2"/>
  <text x="838" y="245" text-anchor="middle" style="font-size:21px;fill:var(--fg)">마지막 자식</text>
  <text x="838" y="275" text-anchor="middle" style="font-size:21px;fill:var(--fg)">= 채우기</text>
  <line x1="965" y1="170" x2="1045" y2="170" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>
  <line x1="1045" y1="65" x2="1045" y2="140" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="1000" y="162" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Left</text>
  <text x="1085" y="105" style="${MONO};font-size:17px;fill:var(--muted)">Top</text>
  <rect x="1045" y="140" width="120" height="75" rx="4" fill="var(--warn)" fill-opacity="0.3" stroke="var(--warn)" stroke-width="2"/>
  <ellipse cx="1180" cy="300" rx="50" ry="50" fill="var(--danger)" fill-opacity="0.25" stroke="var(--danger)" stroke-width="2"/>
  <rect x="1000" y="330" width="100" height="50" rx="4" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="2"/>
  <text x="1110" y="415" text-anchor="middle" style="font-size:19px;fill:var(--muted)">겹쳐도 상관없음</text>
  <g style="font-size:22px;font-weight:700;fill:var(--fg)" text-anchor="middle">
    <text x="165" y="480">한 방향으로 차례로</text>
    <text x="480" y="480">넘치면 줄 바꿈</text>
    <text x="795" y="480">가장자리에 붙이기</text>
    <text x="1110" y="480">좌표로 직접</text>
  </g>
  <g style="font-size:19px;fill:var(--muted)" text-anchor="middle">
    <text x="165" y="515">Orientation</text>
    <text x="480" y="515">ItemWidth · ItemHeight</text>
    <text x="795" y="515">DockPanel.Dock · LastChildFill</text>
    <text x="1110" y="515">Canvas.Left · Top · ZIndex</text>
  </g>
</svg>`;

  const SVG_BOX = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="Margin 과 Padding 의 위치">
  <rect x="40" y="30" width="760" height="420" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="60" y="62" style="font-size:20px;fill:var(--muted)">부모 패널의 공간</text>
  <rect x="100" y="85" width="640" height="320" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="8 6"/>
  <rect x="140" y="120" width="560" height="250" rx="6" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-width="6"/>
  <rect x="200" y="175" width="440" height="140" rx="4" fill="var(--ok)" fill-opacity="0.25" stroke="var(--ok)" stroke-width="2"/>
  <text x="420" y="255" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">내용 (Child · Content)</text>
  <text x="170" y="155" style="font-size:19px;fill:var(--accent2)">Padding (안쪽 여백)</text>
  <text x="112" y="112" style="font-size:19px;fill:var(--warn)">Margin (바깥 여백)</text>
  <g style="font-size:22px">
    <text x="850" y="110" style="fill:var(--warn);font-weight:700">Margin — 요소 바깥</text>
    <text x="850" y="140" style="fill:var(--muted)">다른 요소 · 부모 가장자리와의 거리</text>
    <text x="850" y="170" style="fill:var(--muted)">모든 요소에 있음</text>
    <text x="850" y="230" style="fill:var(--accent);font-weight:700">BorderThickness — 테두리</text>
    <text x="850" y="260" style="fill:var(--muted)">Border · Control 의 선 두께</text>
    <text x="850" y="320" style="fill:var(--accent2);font-weight:700">Padding — 요소 안쪽</text>
    <text x="850" y="350" style="fill:var(--muted)">테두리와 내용 사이의 거리</text>
    <text x="850" y="380" style="fill:var(--muted)">Border · Button · TextBox 등</text>
    <text x="850" y="435" style="${MONO};fill:var(--fg)">"왼,위,오른,아래"</text>
  </g>
</svg>`;

  const SVG_GRIDUNITS = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="Grid 열 너비 단위: 고정, Auto, 별표">
  <text x="640" y="45" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--fg)">너비 500 인 Grid 를 네 열로 나누기</text>
  <rect x="90" y="90" width="220" height="150" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="3"/>
  <rect x="310" y="90" width="154" height="150" fill="var(--warn)" fill-opacity="0.25" stroke="var(--warn)" stroke-width="3"/>
  <rect x="464" y="90" width="242" height="150" fill="var(--accent2)" fill-opacity="0.25" stroke="var(--accent2)" stroke-width="3"/>
  <rect x="706" y="90" width="484" height="150" fill="var(--ok)" fill-opacity="0.25" stroke="var(--ok)" stroke-width="3"/>
  <rect x="326" y="180" width="122" height="40" rx="5" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="387" y="207" text-anchor="middle" style="font-size:18px;fill:var(--fg)">[내용 버튼]</text>
  <g style="${MONO};font-size:30px;font-weight:700" text-anchor="middle">
    <text x="200" y="145" fill="var(--accent)">100</text>
    <text x="387" y="145" fill="var(--warn)">Auto</text>
    <text x="585" y="145" fill="var(--accent2)">*</text>
    <text x="948" y="145" fill="var(--ok)">2*</text>
  </g>
  <g style="font-size:20px;fill:var(--fg)" text-anchor="middle">
    <text x="200" y="275">고정 100</text>
    <text x="387" y="275">내용 크기 70</text>
    <text x="585" y="275">남은 공간 1몫 = 110</text>
    <text x="948" y="275">남은 공간 2몫 = 220</text>
  </g>
  <text x="640" y="345" text-anchor="middle" style="font-size:23px;fill:var(--fg)">남은 공간 = 500 − 100(고정) − 70(Auto) = 330   →   330 을 1 : 2 로 나눔</text>
  <text x="640" y="400" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--muted)">&lt;ColumnDefinition Width="100"/&gt; · "Auto" · "*" · "2*"</text>
  <text x="640" y="460" text-anchor="middle" style="font-size:21px;fill:var(--muted)">창 너비가 바뀌면 <tspan font-weight="700">* 열만</tspan> 늘었다 줄었다 한다 (고정 · Auto 열은 그대로)</text>
</svg>`;

  const SVG_NEST = `<svg viewBox="0 0 1280 540" width="100%" role="img" aria-label="중첩 레이아웃과 요소 트리">
  <rect x="40" y="40" width="580" height="460" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="40" y="40" width="580" height="60" fill="var(--accent)" fill-opacity="0.35" stroke="var(--accent)" stroke-width="2"/>
  <text x="330" y="78" text-anchor="middle" style="font-size:22px;fill:var(--fg)">Border (Top) — 머리글</text>
  <rect x="40" y="100" width="150" height="400" fill="var(--accent2)" fill-opacity="0.25" stroke="var(--accent2)" stroke-width="2"/>
  <text x="115" y="140" text-anchor="middle" style="font-size:19px;fill:var(--fg)">StackPanel</text>
  <text x="115" y="165" text-anchor="middle" style="font-size:19px;fill:var(--fg)">(Left)</text>
  <g fill="var(--card)" stroke="var(--accent2)" stroke-width="2">
    <rect x="60" y="190" width="110" height="36" rx="4"/><rect x="60" y="236" width="110" height="36" rx="4"/><rect x="60" y="282" width="110" height="36" rx="4"/>
  </g>
  <rect x="200" y="110" width="410" height="380" fill="none" stroke="var(--ok)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="405" y="135" text-anchor="middle" style="font-size:19px;fill:var(--ok)">Grid 2 × 2 (채우기)</text>
  <g fill="var(--ok)" fill-opacity="0.2" stroke="var(--ok)" stroke-width="2">
    <rect x="215" y="150" width="185" height="155" rx="14"/><rect x="410" y="150" width="185" height="155" rx="14"/>
    <rect x="215" y="320" width="185" height="155" rx="14"/><rect x="410" y="320" width="185" height="155" rx="14"/>
  </g>
  <g style="font-size:19px;fill:var(--fg)" text-anchor="middle">
    <text x="307" y="232">Border 카드</text><text x="502" y="232">Border 카드</text>
    <text x="307" y="402">Border 카드</text><text x="502" y="402">Border 카드</text>
  </g>
  <g style="${MONO};font-size:23px;fill:var(--fg)">
    <text x="690" y="80" font-weight="700">Window</text>
    <text x="690" y="125">└ <tspan fill="var(--muted)">DockPanel</tspan></text>
    <text x="740" y="170">├ <tspan fill="var(--accent)">Border</tspan> Dock=Top</text>
    <text x="790" y="210">└ TextBlock</text>
    <text x="740" y="255">├ <tspan fill="var(--accent2)">StackPanel</tspan> Dock=Left</text>
    <text x="790" y="295">└ Button × 4</text>
    <text x="740" y="340">└ <tspan fill="var(--ok)">Grid</tspan> (마지막 = 채우기)</text>
    <text x="790" y="380">└ Border × 4</text>
    <text x="840" y="420">└ StackPanel</text>
    <text x="890" y="460">└ TextBlock …</text>
  </g>
  <text x="960" y="515" text-anchor="middle" style="font-size:20px;fill:var(--muted)">Visual Studio 의 “문서 개요” 창에 보이는 요소 트리</text>
</svg>`;

  /* ------------------------------------------------------------------ 예제 코드 */
  const EX_STACK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Stack.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="StackPanel 연습" Width="360" Height="330">
    <StackPanel Margin="10" Background="#F3F4F6">
        <TextBlock Text="① 세로 StackPanel (기본)" FontWeight="Bold" Margin="4"/>
        <Button Content="Stretch (기본값): 가로로 꽉 참" Margin="4,2"/>
        <Button Content="Left" HorizontalAlignment="Left" Width="90" Margin="4,2"/>
        <Button Content="Center" HorizontalAlignment="Center" Width="90" Margin="4,2"/>
        <Button Content="Right" HorizontalAlignment="Right" Width="90" Margin="4,2"/>

        <TextBlock Text="② 가로 StackPanel" FontWeight="Bold" Margin="4,14,4,4"/>
        <StackPanel Orientation="Horizontal" Background="#DBEAFE" Margin="4,0">
            <Button Content="하나" Width="70" Margin="4"/>
            <Button Content="둘" Width="70" Margin="4"/>
            <Button Content="셋" Width="70" Margin="4"/>
        </StackPanel>
    </StackPanel>
</Window>
${CB('Ch15Stack')}`;

  const EX_WRAP = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Wrap.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WrapPanel 연습" Width="440" Height="300">
    <StackPanel>
        <TextBlock Text="창 너비를 바꾸면 버튼이 다음 줄로 넘어갑니다"
                   Margin="10,10,10,0" FontWeight="Bold"/>
        <WrapPanel ItemWidth="90" ItemHeight="50" Margin="10" Background="#FEF3C7">
            <Button Content="버튼 1" Margin="3"/>
            <Button Content="버튼 2" Margin="3"/>
            <Button Content="버튼 3" Margin="3"/>
            <Button Content="버튼 4" Margin="3"/>
            <Button Content="버튼 5" Margin="3"/>
            <Button Content="버튼 6" Margin="3"/>
            <Button Content="버튼 7" Margin="3"/>
            <Button Content="긴 글자가 든 버튼 8" Margin="3"/>
            <Button Content="버튼 9" Margin="3"/>
            <Button Content="버튼 10" Margin="3"/>
        </WrapPanel>
    </StackPanel>
</Window>
${CB('Ch15Wrap')}`;

  const EX_DOCK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15DockApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="DockPanel 로 만든 앱 틀" Width="480" Height="320">
    <DockPanel>
        <!-- ① 위: 메뉴 -->
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)"/>
            <MenuItem Header="편집(_E)"/>
            <MenuItem Header="도움말(_H)"/>
        </Menu>
        <!-- ② 아래: 상태 표시줄 -->
        <StatusBar DockPanel.Dock="Bottom" Background="#E5E7EB">
            <StatusBarItem Content="준비"/>
        </StatusBar>
        <!-- ③ 왼쪽: 목록 -->
        <ListBox DockPanel.Dock="Left" Width="120">
            <ListBoxItem Content="메모 1"/>
            <ListBoxItem Content="메모 2"/>
            <ListBoxItem Content="메모 3"/>
        </ListBox>
        <!-- ④ 마지막 자식: 남은 공간을 모두 채움 -->
        <TextBox Text="가운데 내용 영역 (마지막 자식)" AcceptsReturn="True" TextWrapping="Wrap"/>
    </DockPanel>
</Window>
${CB('Ch15DockApp')}`;

  const EX_DOCKORDER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15DockOrder.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="DockPanel 순서 비교" Width="500" Height="330">
    <StackPanel Orientation="Horizontal" Margin="10">
        <StackPanel Margin="5">
            <TextBlock Text="① Top 을 먼저" FontWeight="Bold" Margin="0,0,0,4"/>
            <DockPanel Width="210" Height="220" Background="#F3F4F6">
                <Border DockPanel.Dock="Top" Height="50" Background="#93C5FD">
                    <TextBlock Text="Top" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <Border DockPanel.Dock="Left" Width="70" Background="#FCA5A5">
                    <TextBlock Text="Left" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <Border Background="#BBF7D0">
                    <TextBlock Text="채우기" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
            </DockPanel>
        </StackPanel>
        <StackPanel Margin="5">
            <TextBlock Text="② Left 를 먼저" FontWeight="Bold" Margin="0,0,0,4"/>
            <DockPanel Width="210" Height="220" Background="#F3F4F6">
                <Border DockPanel.Dock="Left" Width="70" Background="#FCA5A5">
                    <TextBlock Text="Left" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <Border DockPanel.Dock="Top" Height="50" Background="#93C5FD">
                    <TextBlock Text="Top" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <Border Background="#BBF7D0">
                    <TextBlock Text="채우기" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
            </DockPanel>
        </StackPanel>
    </StackPanel>
</Window>
${CB('Ch15DockOrder')}`;

  const EX_CANVAS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Canvas.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Canvas 좌표 배치" Width="460" Height="340">
    <Canvas Background="White">
        <TextBlock Canvas.Left="10" Canvas.Top="10"
                   Text="(0, 0) 은 왼쪽 위 — 오른쪽으로 x, 아래로 y 가 커집니다"/>
        <Rectangle x:Name="rect" Canvas.Left="40" Canvas.Top="50" Width="140" Height="90"
                   Fill="#93C5FD" Stroke="#1D4ED8" StrokeThickness="2"/>
        <Ellipse x:Name="ball" Canvas.Left="140" Canvas.Top="100" Width="80" Height="80"
                 Fill="#FCA5A5" Stroke="#B91C1C" StrokeThickness="2" Panel.ZIndex="1"/>
        <TextBlock Canvas.Left="250" Canvas.Top="60" Text="사각형: Left=40, Top=50"/>
        <TextBlock Canvas.Left="250" Canvas.Top="85" Text="공: Left=140, Top=100, ZIndex=1"/>
        <Button Content="공을 오른쪽으로 →" Canvas.Left="40" Canvas.Top="220" Width="140" Height="30"
                Click="btnMove_Click"/>
        <Button Content="사각형 ZIndex 바꾸기" Canvas.Left="200" Canvas.Top="220" Width="150" Height="30"
                Click="btnFront_Click"/>
        <TextBlock x:Name="txtInfo" Canvas.Left="40" Canvas.Top="265" Text="버튼을 눌러 보세요"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch15Canvas
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnMove_Click(object sender, RoutedEventArgs e)
        {
            double left = Canvas.GetLeft(ball) + 20;   // 현재 x 좌표 + 20
            if (left > 360) left = 0;                  // 너무 가면 처음으로
            Canvas.SetLeft(ball, left);
            txtInfo.Text = "공의 Canvas.Left = " + left;
        }

        private void btnFront_Click(object sender, RoutedEventArgs e)
        {
            // ZIndex 가 큰 요소가 위에 그려진다 (공은 1)
            int z = Panel.GetZIndex(rect) == 0 ? 2 : 0;
            Panel.SetZIndex(rect, z);
            txtInfo.Text = "사각형 ZIndex = " + z + (z > 1 ? " → 사각형이 위" : " → 공이 위");
        }
    }
}`;

  const EX_MARGIN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Margin.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Margin 과 Padding" Width="400" Height="320">
    <StackPanel Background="#E5E7EB">
        <!-- Margin=20: Border 바깥 여백 / Padding=20: 테두리와 내용 사이 -->
        <Border Margin="20" Padding="20" Background="#93C5FD"
                BorderBrush="#1D4ED8" BorderThickness="3">
            <TextBlock Text="Border 의 내용 (흰 배경)" Background="White"/>
        </Border>
        <!-- 네 값: 왼쪽, 위, 오른쪽, 아래 -->
        <Button Content="Margin 60,0,20,0 · Padding 10" Margin="60,0,20,0" Padding="10"/>
        <Button Content="Padding 기본값" Margin="60,10,20,0"/>
        <!-- 두 값: 좌우, 위아래 -->
        <Border Margin="20,10" Height="40" Background="#FDE68A"/>
    </StackPanel>
</Window>
${CB('Ch15Margin')}`;

  const EX_GRIDUNITS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15GridUnits.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Grid 크기 단위" Width="500" Height="300">
    <Grid ShowGridLines="True" Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>   <!-- 0행: 내용 높이만큼 -->
            <RowDefinition Height="*"/>      <!-- 1행: 남은 높이 전부 -->
            <RowDefinition Height="40"/>     <!-- 2행: 고정 40 -->
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="100"/>  <!-- 0열: 고정 100 -->
            <ColumnDefinition Width="Auto"/> <!-- 1열: 내용 너비만큼 -->
            <ColumnDefinition Width="*"/>    <!-- 2열: 남은 너비 1몫 -->
            <ColumnDefinition Width="2*"/>   <!-- 3열: 남은 너비 2몫 -->
        </Grid.ColumnDefinitions>

        <TextBlock Grid.Row="0" Grid.Column="0" Text="100 (고정)" Margin="4"/>
        <TextBlock Grid.Row="0" Grid.Column="1" Text="Auto" Margin="4"/>
        <TextBlock Grid.Row="0" Grid.Column="2" Text="*" Margin="4"/>
        <TextBlock Grid.Row="0" Grid.Column="3" Text="2*" Margin="4"/>

        <Border Grid.Row="1" Grid.Column="0" Background="#93C5FD"/>
        <Button Grid.Row="1" Grid.Column="1" Content="내용 크기" Margin="4" VerticalAlignment="Center"/>
        <Border Grid.Row="1" Grid.Column="2" Background="#FDE68A"/>
        <Border Grid.Row="1" Grid.Column="3" Background="#BBF7D0"/>

        <TextBlock Grid.Row="2" Grid.Column="0" Grid.ColumnSpan="4" Margin="4"
                   VerticalAlignment="Center" Text="창 너비를 바꾸면 * 와 2* 열만 1 : 2 비율로 변합니다"/>
    </Grid>
</Window>
${CB('Ch15GridUnits')}`;

  const EX_SPAN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15GridSpan.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="RowSpan 과 ColumnSpan" Width="460" Height="320">
    <Grid Margin="6">
        <Grid.RowDefinitions>
            <RowDefinition Height="50"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="120"/>
            <ColumnDefinition Width="*"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <Border Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="3" Margin="3" Background="#93C5FD">
            <TextBlock Text="머리글 (ColumnSpan=3)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Border Grid.Row="1" Grid.Column="0" Grid.RowSpan="2" Margin="3" Background="#FCA5A5">
            <TextBlock Text="메뉴 (RowSpan=2)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Border Grid.Row="1" Grid.Column="1" Margin="3" Background="#FDE68A">
            <TextBlock Text="A (1행 1열)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Border Grid.Row="1" Grid.Column="2" Margin="3" Background="#FDE68A">
            <TextBlock Text="B (1행 2열)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Border Grid.Row="2" Grid.Column="1" Grid.ColumnSpan="2" Margin="3" Background="#BBF7D0">
            <TextBlock Text="C (2행 1열부터 ColumnSpan=2)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
    </Grid>
</Window>
${CB('Ch15GridSpan')}`;

  const EX_LOGIN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Login.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="로그인" Width="380" Height="260">
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>   <!-- 라벨: 가장 긴 글자만큼 -->
            <ColumnDefinition Width="*"/>      <!-- 입력칸: 나머지 전부 -->
        </Grid.ColumnDefinitions>

        <TextBlock Grid.Row="0" Grid.ColumnSpan="2" Text="회원 로그인"
                   FontSize="20" FontWeight="Bold" Margin="0,0,0,12"/>

        <Label Grid.Row="1" Grid.Column="0" Content="아이디" Margin="0,0,10,6"/>
        <TextBox x:Name="txtId" Grid.Row="1" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="2" Grid.Column="0" Content="비밀번호" Margin="0,0,10,6"/>
        <PasswordBox x:Name="pwdBox" Grid.Row="2" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <StackPanel Grid.Row="4" Grid.Column="1" Orientation="Horizontal" HorizontalAlignment="Right">
            <Button Content="로그인" Width="80" Margin="0,0,8,0" IsDefault="True" Click="btnLogin_Click"/>
            <Button Content="닫기" Width="80" Click="btnClose_Click"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch15Login
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            if (txtId.Text == "" || pwdBox.Password == "")
            {
                MessageBox.Show("아이디와 비밀번호를 모두 입력하세요.");
                return;
            }
            MessageBox.Show($"{txtId.Text} 님, 환영합니다!");
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`;

  const EX_CALC = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Calc.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="계산기 버튼판" Width="300" Height="400">
    <Grid Margin="8">
        <Grid.RowDefinitions>
            <RowDefinition Height="70"/>
            <RowDefinition/>
            <RowDefinition/>
            <RowDefinition/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>

        <!-- 0행: 표시창 (4칸을 합침) -->
        <Border Grid.Row="0" Grid.ColumnSpan="4" Margin="4" Padding="10"
                Background="#1F2937" CornerRadius="6">
            <TextBlock x:Name="display" Text="0" Foreground="White" FontSize="28"
                       HorizontalAlignment="Right" VerticalAlignment="Center"/>
        </Border>

        <Button Grid.Row="1" Grid.Column="0" Content="7" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="1" Grid.Column="1" Content="8" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="1" Grid.Column="2" Content="9" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="1" Grid.Column="3" Content="÷" Margin="4" FontSize="18" Click="Key_Click" Background="#FDE68A"/>
        <Button Grid.Row="2" Grid.Column="0" Content="4" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="2" Grid.Column="1" Content="5" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="2" Grid.Column="2" Content="6" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="2" Grid.Column="3" Content="×" Margin="4" FontSize="18" Click="Key_Click" Background="#FDE68A"/>
        <Button Grid.Row="3" Grid.Column="0" Content="1" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="3" Grid.Column="1" Content="2" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="3" Grid.Column="2" Content="3" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="3" Grid.Column="3" Content="−" Margin="4" FontSize="18" Click="Key_Click" Background="#FDE68A"/>
        <Button Grid.Row="4" Grid.Column="0" Content="C" Margin="4" FontSize="18" Click="Key_Click" Background="#FCA5A5"/>
        <Button Grid.Row="4" Grid.Column="1" Content="0" Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="4" Grid.Column="2" Content="." Margin="4" FontSize="18" Click="Key_Click"/>
        <Button Grid.Row="4" Grid.Column="3" Content="+" Margin="4" FontSize="18" Click="Key_Click" Background="#FDE68A"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch15Calc
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼 16개가 모두 이 처리기 하나를 공유한다
        private void Key_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button b && b.Content is string key)
            {
                if (key == "C") display.Text = "0";
                else if (display.Text == "0") display.Text = key;
                else display.Text += key;
            }
        }
    }
}`;

  const EX_UNIFORM = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Uniform.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="UniformGrid 틱택토" Width="340" Height="380">
    <DockPanel Margin="10">
        <TextBlock x:Name="txtTurn" DockPanel.Dock="Top" Text="X 차례입니다"
                   FontSize="16" FontWeight="Bold" Margin="0,0,0,8"/>
        <!-- 3 × 3 = 9칸을 똑같은 크기로 -->
        <UniformGrid Rows="3" Columns="3" Background="#E5E7EB">
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
            <Button Margin="3" FontSize="32" Click="Cell_Click"/>
        </UniformGrid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch15Uniform
{
    public partial class MainWindow : Window
    {
        private bool xTurn = true;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Cell_Click(object sender, RoutedEventArgs e)
        {
            // 비어 있는 칸만 표시한다
            if (sender is Button b && b.Content == null)
            {
                b.Content = xTurn ? "X" : "O";
                xTurn = !xTurn;
                txtTurn.Text = (xTurn ? "X" : "O") + " 차례입니다";
            }
        }
    }
}`;

  const EX_NESTED = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Nested.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="중첩 레이아웃 — 학습 대시보드" Width="500" Height="380">
    <DockPanel>
        <!-- 위: 머리글 -->
        <Border DockPanel.Dock="Top" Background="#1E3A8A" Padding="12,8">
            <TextBlock Text="학습 현황 대시보드" Foreground="White" FontSize="18" FontWeight="Bold"/>
        </Border>
        <!-- 왼쪽: 메뉴 -->
        <Border DockPanel.Dock="Left" Width="110" Background="#E0E7FF" Padding="8">
            <StackPanel>
                <Button Content="홈" Margin="0,0,0,6"/>
                <Button Content="강의" Margin="0,0,0,6"/>
                <Button Content="과제" Margin="0,0,0,6"/>
                <Button Content="설정"/>
            </StackPanel>
        </Border>
        <!-- 가운데: 2 × 2 카드 -->
        <Grid Margin="6">
            <Grid.RowDefinitions>
                <RowDefinition/>
                <RowDefinition/>
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition/>
                <ColumnDefinition/>
            </Grid.ColumnDefinitions>
            <Border Grid.Row="0" Grid.Column="0" Margin="6" Padding="12" CornerRadius="10"
                    Background="#DBEAFE" BorderBrush="#3B82F6" BorderThickness="2">
                <StackPanel>
                    <TextBlock Text="출석" FontWeight="Bold"/>
                    <TextBlock Text="18 / 20" FontSize="26"/>
                </StackPanel>
            </Border>
            <Border Grid.Row="0" Grid.Column="1" Margin="6" Padding="12" CornerRadius="10"
                    Background="#DCFCE7" BorderBrush="#22C55E" BorderThickness="2">
                <StackPanel>
                    <TextBlock Text="과제 제출" FontWeight="Bold"/>
                    <TextBlock Text="7 / 8" FontSize="26"/>
                </StackPanel>
            </Border>
            <Border Grid.Row="1" Grid.Column="0" Margin="6" Padding="12" CornerRadius="10"
                    Background="#FEF3C7" BorderBrush="#F59E0B" BorderThickness="2">
                <StackPanel>
                    <TextBlock Text="퀴즈 평균" FontWeight="Bold"/>
                    <TextBlock Text="86점" FontSize="26"/>
                </StackPanel>
            </Border>
            <Border Grid.Row="1" Grid.Column="1" Margin="6" Padding="12" CornerRadius="10"
                    Background="#FCE7F3" BorderBrush="#EC4899" BorderThickness="2">
                <StackPanel>
                    <TextBlock Text="진도율 75%" FontWeight="Bold"/>
                    <ProgressBar Value="75" Height="16" Margin="0,12,0,0"/>
                </StackPanel>
            </Border>
        </Grid>
    </DockPanel>
</Window>
${CB('Ch15Nested')}`;

  const EX_SCROLL = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Scroll.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ScrollViewer" Width="320" Height="320">
    <DockPanel Margin="10">
        <TextBlock DockPanel.Dock="Top" Text="항목 30개 — 마우스 휠로 스크롤해 보세요" Margin="0,0,0,6"/>
        <Border BorderBrush="#9CA3AF" BorderThickness="1">
            <ScrollViewer VerticalScrollBarVisibility="Auto">
                <StackPanel x:Name="list"/>
            </ScrollViewer>
        </Border>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch15Scroll
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // 코드로 자식 30개를 만들어 StackPanel.Children 에 넣는다
            for (int i = 1; i <= 30; i++)
            {
                var item = new Border
                {
                    Background = i % 2 == 0 ? Brushes.AliceBlue : Brushes.White,
                    Padding = new Thickness(8, 4, 8, 4),
                    Child = new TextBlock { Text = $"{i}번째 항목" }
                };
                list.Children.Add(item);
            }
        }
    }
}`;

  /* ------------------------------------------------------------------ 실습 코드 */
  const P1_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Memo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="나의 메모장" Width="500" Height="360">
    <DockPanel>
        <!-- TODO ① 위: Menu (파일 · 편집 · 보기) -->
        <!-- TODO ② 위: 버튼 3개가 든 가로 StackPanel (도구 모음) -->
        <!-- TODO ③ 아래: StatusBar (준비 · 메모 3개) -->
        <!-- TODO ④ 왼쪽: 메모 제목 ListBox (Width 130) -->
        <!-- TODO ⑤ 오른쪽: 속성 Border (Width 120, 배경색) -->

        <!-- 마지막 자식: 남은 공간을 채우는 메모 입력칸 -->
        <TextBox AcceptsReturn="True" TextWrapping="Wrap" Text="여기에 메모를 입력하세요."/>
    </DockPanel>
</Window>
${CB('Ch15Memo')}
`;

  const P1_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Memo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="나의 메모장" Width="500" Height="360">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)"/>
            <MenuItem Header="편집(_E)"/>
            <MenuItem Header="보기(_V)"/>
        </Menu>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Background="#E5E7EB">
            <Button Content="새로 만들기" Margin="4" Padding="8,2"/>
            <Button Content="저장" Margin="4" Padding="8,2"/>
            <Button Content="삭제" Margin="4" Padding="8,2"/>
        </StackPanel>
        <StatusBar DockPanel.Dock="Bottom" Background="#D1D5DB">
            <StatusBarItem Content="준비"/>
            <StatusBarItem Content="메모 3개"/>
        </StatusBar>
        <ListBox DockPanel.Dock="Left" Width="130">
            <ListBoxItem Content="장보기 목록"/>
            <ListBoxItem Content="C# 공부 계획"/>
            <ListBoxItem Content="여행 준비물"/>
        </ListBox>
        <Border DockPanel.Dock="Right" Width="120" Background="#FEF3C7" Padding="8">
            <StackPanel>
                <TextBlock Text="속성" FontWeight="Bold" Margin="0,0,0,6"/>
                <TextBlock Text="만든 날: 오늘"/>
                <TextBlock Text="글자 수: 13"/>
            </StackPanel>
        </Border>
        <TextBox AcceptsReturn="True" TextWrapping="Wrap" Text="여기에 메모를 입력하세요."/>
    </DockPanel>
</Window>
${CB('Ch15Memo')}
`;

  const P2_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Tiles.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="색상 타일" Width="480" Height="340">
    <!-- TODO: ItemWidth="100" ItemHeight="70" 을 지정하세요 -->
    <WrapPanel Margin="8" Background="#F3F4F6">
        <Border Margin="4" Background="#EF4444">
            <TextBlock Text="Red" Foreground="White" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <Border Margin="4" Background="#F97316">
            <TextBlock Text="Orange" Foreground="White" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
        <!-- TODO: 같은 모양의 타일을 10개 더 (모두 12개) -->
    </WrapPanel>
</Window>
${CB('Ch15Tiles')}
`;

  const TILE = (c, name, fg) => `        <Border Margin="4" Background="${c}">
            <TextBlock Text="${name}" Foreground="${fg || 'White'}" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>`;
  const P2_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Tiles.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="색상 타일" Width="480" Height="340">
    <WrapPanel Margin="8" Background="#F3F4F6" ItemWidth="100" ItemHeight="70">
${[['#EF4444', 'Red'], ['#F97316', 'Orange'], ['#EAB308', 'Yellow', 'Black'], ['#84CC16', 'Lime', 'Black'],
   ['#22C55E', 'Green'], ['#14B8A6', 'Teal'], ['#06B6D4', 'Cyan', 'Black'], ['#3B82F6', 'Blue'],
   ['#6366F1', 'Indigo'], ['#A855F7', 'Purple'], ['#EC4899', 'Pink'], ['#6B7280', 'Gray']].map((t) => TILE(t[0], t[1], t[2])).join('\n')}
    </WrapPanel>
</Window>
${CB('Ch15Tiles')}
`;

  const P3_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SignUp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="회원가입" Width="420" Height="400">
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <!-- TODO: 행을 더 추가하세요 (아이디 · 비밀번호 · 비밀번호 확인 · 이메일 · 성별 · 빈 공간 · 버튼) -->
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <TextBlock Grid.Row="0" Grid.ColumnSpan="2" Text="회원가입" FontSize="20" FontWeight="Bold" Margin="0,0,0,12"/>

        <Label Grid.Row="1" Grid.Column="0" Content="이름" Margin="0,0,10,6"/>
        <TextBox x:Name="txtName" Grid.Row="1" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <!-- TODO: 아이디(TextBox) · 비밀번호(PasswordBox pwd1) · 비밀번호 확인(PasswordBox pwd2) · 이메일 -->
        <!-- TODO: 성별 — 가로 StackPanel 안에 RadioButton 2개 -->
        <!-- TODO: 마지막 행 오른쪽에 가입 버튼 (Click="btnJoin_Click") -->
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch15SignUp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnJoin_Click(object sender, RoutedEventArgs e)
        {
            // TODO: 두 비밀번호가 다르면 알림, 같으면 환영 메시지
        }
    }
}
`;

  const P3_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SignUp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="회원가입" Width="420" Height="400">
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <TextBlock Grid.Row="0" Grid.ColumnSpan="2" Text="회원가입" FontSize="20" FontWeight="Bold" Margin="0,0,0,12"/>

        <Label Grid.Row="1" Grid.Column="0" Content="이름" Margin="0,0,10,6"/>
        <TextBox x:Name="txtName" Grid.Row="1" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="2" Grid.Column="0" Content="아이디" Margin="0,0,10,6"/>
        <TextBox x:Name="txtId" Grid.Row="2" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="3" Grid.Column="0" Content="비밀번호" Margin="0,0,10,6"/>
        <PasswordBox x:Name="pwd1" Grid.Row="3" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="4" Grid.Column="0" Content="비밀번호 확인" Margin="0,0,10,6"/>
        <PasswordBox x:Name="pwd2" Grid.Row="4" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="5" Grid.Column="0" Content="이메일" Margin="0,0,10,6"/>
        <TextBox x:Name="txtEmail" Grid.Row="5" Grid.Column="1" Height="26" Margin="0,0,0,6"/>

        <Label Grid.Row="6" Grid.Column="0" Content="성별" Margin="0,0,10,6"/>
        <StackPanel Grid.Row="6" Grid.Column="1" Orientation="Horizontal" VerticalAlignment="Center">
            <RadioButton Content="남" GroupName="gender" Margin="0,0,16,0" IsChecked="True"/>
            <RadioButton Content="여" GroupName="gender"/>
        </StackPanel>

        <Button Grid.Row="8" Grid.Column="1" Content="가입하기" Width="100" Height="30"
                HorizontalAlignment="Right" Click="btnJoin_Click"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch15SignUp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnJoin_Click(object sender, RoutedEventArgs e)
        {
            if (pwd1.Password != pwd2.Password)
            {
                MessageBox.Show("비밀번호가 서로 다릅니다.");
                return;
            }
            MessageBox.Show($"{txtName.Text} 님, 가입을 환영합니다!");
        }
    }
}
`;

  const P4_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Album.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="나의 사진첩" Width="480" Height="380">
    <DockPanel Margin="10">
        <TextBlock DockPanel.Dock="Top" Text="나의 사진첩" FontSize="18" FontWeight="Bold" Margin="0,0,0,8"/>
        <!-- TODO: Rows="2" Columns="3" 을 지정하세요 -->
        <UniformGrid>
            <!-- 사진 카드 하나: 바깥 Border(흰 액자) 안에 DockPanel (아래 제목 + 색 영역) -->
            <Border Margin="6" Padding="4" Background="White" BorderBrush="#9CA3AF" BorderThickness="1" CornerRadius="4">
                <DockPanel>
                    <TextBlock DockPanel.Dock="Bottom" Text="바다" HorizontalAlignment="Center" Margin="0,4,0,0"/>
                    <Border Background="#60A5FA"/>
                </DockPanel>
            </Border>
            <!-- TODO: 같은 모양의 카드를 5개 더 (산 · 숲 · 노을 · 사막 · 밤하늘) -->
        </UniformGrid>
    </DockPanel>
</Window>
${CB('Ch15Album')}
`;

  const CARD = (name, c) => `            <Border Margin="6" Padding="4" Background="White" BorderBrush="#9CA3AF" BorderThickness="1" CornerRadius="4">
                <DockPanel>
                    <TextBlock DockPanel.Dock="Bottom" Text="${name}" HorizontalAlignment="Center" Margin="0,4,0,0"/>
                    <Border Background="${c}"/>
                </DockPanel>
            </Border>`;
  const P4_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15Album.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="나의 사진첩" Width="480" Height="380">
    <DockPanel Margin="10">
        <TextBlock DockPanel.Dock="Top" Text="나의 사진첩" FontSize="18" FontWeight="Bold" Margin="0,0,0,8"/>
        <UniformGrid Rows="2" Columns="3" Background="#F3F4F6">
${[['바다', '#60A5FA'], ['산', '#16A34A'], ['숲', '#4D7C0F'], ['노을', '#F97316'], ['사막', '#EAB308'], ['밤하늘', '#1E1B4B']].map((t) => CARD(t[0], t[1])).join('\n')}
        </UniformGrid>
    </DockPanel>
</Window>
${CB('Ch15Album')}
`;

  /* ------------------------------------------------------------------ 슬라이드용 짧은 코드 */
  const SL_STACK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideStack.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="StackPanel" Width="320" Height="260">
    <StackPanel Margin="10" Background="#F3F4F6">
        <Button Content="Stretch (기본)" Margin="2"/>
        <Button Content="Left" HorizontalAlignment="Left" Margin="2"/>
        <Button Content="Center" HorizontalAlignment="Center" Margin="2"/>
        <Button Content="Right" HorizontalAlignment="Right" Margin="2"/>
        <StackPanel Orientation="Horizontal" Background="#DBEAFE" Margin="2">
            <Button Content="가로 1" Width="70" Margin="2"/>
            <Button Content="가로 2" Width="70" Margin="2"/>
        </StackPanel>
    </StackPanel>
</Window>
${CB('Ch15SlideStack')}`;

  const SL_WRAP = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideWrap.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WrapPanel" Width="340" Height="240">
    <WrapPanel ItemWidth="90" ItemHeight="45" Margin="10" Background="#FEF3C7">
        <Button Content="1" Margin="3"/>
        <Button Content="2" Margin="3"/>
        <Button Content="3" Margin="3"/>
        <Button Content="4" Margin="3"/>
        <Button Content="5" Margin="3"/>
        <Button Content="6" Margin="3"/>
        <Button Content="7" Margin="3"/>
        <Button Content="8" Margin="3"/>
    </WrapPanel>
</Window>
${CB('Ch15SlideWrap')}`;

  const SL_DOCK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideDock.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="DockPanel" Width="420" Height="280">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일"/>
            <MenuItem Header="편집"/>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem Content="준비"/>
        </StatusBar>
        <ListBox DockPanel.Dock="Left" Width="110">
            <ListBoxItem Content="메모 1"/>
            <ListBoxItem Content="메모 2"/>
        </ListBox>
        <TextBox Text="마지막 자식 = 남은 공간 채우기"/>
    </DockPanel>
</Window>
${CB('Ch15SlideDock')}`;

  const SL_CANVAS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideCanvas.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Canvas" Width="400" Height="280">
    <Canvas Background="White">
        <Rectangle Canvas.Left="30" Canvas.Top="30" Width="140" Height="90" Fill="#93C5FD"/>
        <Ellipse Canvas.Left="120" Canvas.Top="80" Width="80" Height="80"
                 Fill="#FCA5A5" Panel.ZIndex="1"/>
        <TextBlock Canvas.Left="220" Canvas.Top="40" Text="Left=30, Top=30"/>
        <Button Canvas.Right="20" Canvas.Bottom="20" Content="오른쪽 아래 기준"/>
    </Canvas>
</Window>
${CB('Ch15SlideCanvas')}`;

  const SL_GRID = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideGrid.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Grid" Width="420" Height="240">
    <Grid ShowGridLines="True" Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/><RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="100"/><ColumnDefinition Width="*"/><ColumnDefinition Width="2*"/>
        </Grid.ColumnDefinitions>
        <TextBlock Text="100" Margin="4"/>
        <TextBlock Grid.Column="1" Text="*" Margin="4"/>
        <TextBlock Grid.Column="2" Text="2*" Margin="4"/>
        <Border Grid.Row="1" Background="#93C5FD"/>
        <Border Grid.Row="1" Grid.Column="1" Background="#FDE68A"/>
        <Border Grid.Row="1" Grid.Column="2" Background="#BBF7D0"/>
    </Grid>
</Window>
${CB('Ch15SlideGrid')}`;

  const SL_SPAN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideSpan.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Span" Width="420" Height="280">
    <Grid Margin="6">
        <Grid.RowDefinitions>
            <RowDefinition Height="50"/><RowDefinition/><RowDefinition/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="110"/><ColumnDefinition/><ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Border Grid.ColumnSpan="3" Margin="3" Background="#93C5FD"/>
        <Border Grid.Row="1" Grid.RowSpan="2" Margin="3" Background="#FCA5A5"/>
        <Border Grid.Row="1" Grid.Column="1" Margin="3" Background="#FDE68A"/>
        <Border Grid.Row="1" Grid.Column="2" Margin="3" Background="#FDE68A"/>
        <Border Grid.Row="2" Grid.Column="1" Grid.ColumnSpan="2" Margin="3" Background="#BBF7D0"/>
    </Grid>
</Window>
${CB('Ch15SlideSpan')}`;

  const SL_LOGIN = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideLogin.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="로그인" Width="360" Height="200">
    <Grid Margin="20">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/><RowDefinition Height="Auto"/><RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/><ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Label Content="아이디" Margin="0,0,10,6"/>
        <TextBox Grid.Column="1" Height="26" Margin="0,0,0,6"/>
        <Label Grid.Row="1" Content="비밀번호" Margin="0,0,10,6"/>
        <PasswordBox Grid.Row="1" Grid.Column="1" Height="26" Margin="0,0,0,6"/>
        <Button Grid.Row="2" Grid.Column="1" Content="로그인" Width="90" HorizontalAlignment="Right"/>
    </Grid>
</Window>
${CB('Ch15SlideLogin')}`;

  const SL_UNIFORM = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch15SlideUniform.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="UniformGrid" Width="300" Height="300">
    <UniformGrid Rows="3" Columns="3" Margin="10">
        <Button Content="1" FontSize="20" Margin="3"/>
        <Button Content="2" FontSize="20" Margin="3"/>
        <Button Content="3" FontSize="20" Margin="3"/>
        <Button Content="4" FontSize="20" Margin="3"/>
        <Button Content="5" FontSize="20" Margin="3"/>
        <Button Content="6" FontSize="20" Margin="3"/>
        <Button Content="7" FontSize="20" Margin="3"/>
        <Button Content="8" FontSize="20" Margin="3"/>
        <Button Content="9" FontSize="20" Margin="3"/>
    </UniformGrid>
</Window>
${CB('Ch15SlideUniform')}`;

  CS_COURSE.addChapter({
    id: 'ch15',
    no: '15',
    title: '레이아웃 패널',
    subtitle: 'Layout Panels',
    summary: 'WPF 는 좌표 대신 패널(Panel)에게 자식의 위치와 크기를 맡깁니다. StackPanel · WrapPanel · DockPanel · Canvas 의 배치 규칙을 비교하고, 가장 많이 쓰는 Grid 로 폼과 버튼판을 만든 뒤 여러 패널을 겹쳐 실제 앱 화면을 구성합니다.',
    goals: [
      '부모 패널이 자식의 위치 · 크기를 정하는 원리(측정 → 배치)를 설명할 수 있다',
      'StackPanel · WrapPanel · DockPanel · Canvas 의 차이를 알고 알맞은 패널을 고를 수 있다',
      'Margin · Padding · HorizontalAlignment / VerticalAlignment 로 간격과 정렬을 조절할 수 있다',
      'Grid 의 행 · 열을 고정 · Auto · * 단위로 나누고 Row/Column/Span 으로 배치할 수 있다',
      'UniformGrid · Border · ScrollViewer 와 중첩 레이아웃으로 실제 앱 화면을 만들 수 있다'
    ],
    sections: [
      /* ===================== ch15-1 ===================== */
      {
        id: 'ch15-1',
        title: 'StackPanel · WrapPanel · DockPanel · Canvas',
        minutes: 50,
        goals: [
          '레이아웃이 “부모 패널이 자식을 측정하고 배치하는 일”임을 설명할 수 있다',
          'StackPanel 의 Orientation 과 자식의 HorizontalAlignment 효과를 설명할 수 있다',
          'WrapPanel 의 줄 바꿈과 ItemWidth / ItemHeight 를 사용할 수 있다',
          'DockPanel.Dock 과 LastChildFill 로 메뉴 · 상태 표시줄 · 목록 · 내용이 있는 앱 틀을 만들 수 있다',
          'Canvas.Left / Canvas.Top / Panel.ZIndex 로 좌표 배치를 할 수 있다'
        ],
        flow: [['도입: 왜 좌표 대신 패널인가', 5], ['레이아웃 개념 · 패널 비교', 8], ['StackPanel · WrapPanel', 10], ['DockPanel · 순서의 중요성', 12], ['Canvas · Margin/Padding 복습', 8], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: '레이아웃(layout)이란?' },
          { type: 'p', html: 'Windows Forms 같은 옛 방식은 버튼마다 <b>좌표(x, y)와 크기</b>를 직접 적었습니다. 그러면 창 크기가 바뀌거나 글자가 길어질 때 화면이 쉽게 깨집니다. WPF 는 방법이 다릅니다. 컨트롤을 <b>패널(Panel)</b> 안에 넣으면, <b>부모 패널이 자기 규칙에 따라 자식의 위치와 크기를 정해 줍니다</b>. 창이 커지면 패널이 다시 계산해서 자식을 알맞게 늘리거나 옮깁니다.' },
          { type: 'p', html: '패널은 자식을 두 단계로 다룹니다. ① <b>측정(Measure)</b>: 각 자식에게 “너는 얼마나 필요하니?” 하고 물어 원하는 크기(<code>DesiredSize</code>)를 받습니다. ② <b>배치(Arrange)</b>: 자기 규칙대로 공간을 나누어 “너는 여기, 이 크기로” 하고 최종 위치를 정합니다. 우리가 이 과정을 직접 코딩할 일은 거의 없지만, <b>“크기를 최종 결정하는 쪽은 부모”</b> 라는 점을 알면 레이아웃이 왜 그렇게 나오는지 이해하기 쉽습니다.' },
          { type: 'figure', html: SVG_MEASURE, caption: '부모 패널은 자식을 측정(Measure)한 뒤 배치(Arrange)한다' },
          { type: 'h', text: '네 가지 패널 한눈에 보기' },
          { type: 'figure', html: SVG_PANELS, caption: 'StackPanel · WrapPanel · DockPanel · Canvas 의 배치 모양' },
          { type: 'table', head: ['패널', '배치 규칙', '자식이 받는 크기', '주로 쓰는 곳'], rows: [
            ['<code>StackPanel</code>', '한 방향(세로/가로)으로 <b>차례로 쌓기</b>', '쌓는 방향은 필요한 만큼, 반대 방향은 꽉 채움', '버튼 묶음, 폼의 한 줄, 짧은 목록'],
            ['<code>WrapPanel</code>', '한 줄에 놓다가 <b>넘치면 다음 줄</b>', '필요한 만큼 (또는 <code>ItemWidth</code>/<code>ItemHeight</code>)', '태그, 썸네일, 색상 견본'],
            ['<code>DockPanel</code>', '<b>가장자리(위·아래·왼쪽·오른쪽)에 붙이고</b> 마지막은 채움', '붙은 방향의 두께만 필요한 만큼, 나머지는 꽉', '앱 전체 틀(메뉴 · 도구 · 상태 표시줄)'],
            ['<code>Canvas</code>', '<b>좌표(Left, Top)</b>에 그대로 놓기', '자식이 원하는 크기 그대로 (늘려 주지 않음)', '그림판, 도형, 간단한 게임'],
            ['<code>Grid</code> (다음 교시)', '<b>행 · 열 표</b>의 칸에 놓기', '칸의 크기', '대부분의 화면 — 가장 많이 씀']
          ], caption: '패널마다 자식에게 공간을 나누어 주는 규칙이 다르다' },
          { type: 'callout', kind: 'info', title: '창(Window)에는 자식이 하나뿐', html: '<code>Window</code> 는 <b>내용(Content)을 하나만</b> 가질 수 있습니다. 그래서 보통 창 바로 안에 패널 하나를 두고, 그 패널 안에 여러 컨트롤을 넣습니다. Visual Studio 의 새 WPF 프로젝트가 <code>MainWindow.xaml</code> 에 처음부터 <code>&lt;Grid&gt;</code> 를 넣어 두는 이유입니다.' },

          { type: 'h', text: 'StackPanel — 차곡차곡 쌓기' },
          { type: 'p', html: '<code>StackPanel</code> 은 자식을 <b>세로로(기본값) 또는 가로로</b> 하나씩 이어 놓습니다. 방향은 <code>Orientation="Vertical"</code>(기본) / <code>"Horizontal"</code> 로 정합니다. 세로 StackPanel 은 자식에게 <b>가로 폭 전체</b>를 주므로, 자식의 <code>HorizontalAlignment</code> 로 그 폭 안에서 어디에 놓을지 고를 수 있습니다.' },
          { type: 'code', title: '예제 15-1. StackPanel 과 HorizontalAlignment', code: EX_STACK, desc: '세로 StackPanel 안의 버튼은 기본값 <code>Stretch</code> 라서 가로로 꽉 찹니다. <code>Left</code> · <code>Center</code> · <code>Right</code> 를 주면 버튼이 자기 크기만큼만 차지하고 그 자리에 붙습니다. <code>Orientation="Horizontal"</code> 인 안쪽 StackPanel 은 버튼을 옆으로 나란히 놓습니다. 패널에도 <code>Background</code> 를 주면 패널이 차지한 영역이 눈에 보입니다.' },
          { type: 'table', head: ['값', 'HorizontalAlignment (가로)', 'VerticalAlignment (세로)'], rows: [
            ['<code>Stretch</code> (기본)', '받은 폭을 꽉 채움', '받은 높이를 꽉 채움'],
            ['<code>Left</code> / <code>Top</code>', '왼쪽에 붙음', '위쪽에 붙음'],
            ['<code>Center</code>', '가운데', '가운데'],
            ['<code>Right</code> / <code>Bottom</code>', '오른쪽에 붙음', '아래쪽에 붙음']
          ], caption: '정렬 속성은 “부모가 준 공간 안에서” 어디에 놓일지를 정한다' },
          { type: 'callout', kind: 'warn', title: 'StackPanel 의 두 가지 함정', html: '<ul><li>세로 StackPanel 은 자식에게 높이를 <b>필요한 만큼만</b> 주기 때문에, 자식의 <code>VerticalAlignment</code> 는 효과가 없습니다. (가로 StackPanel 에서는 반대로 <code>HorizontalAlignment</code> 가 효과 없음)</li><li>StackPanel 은 공간이 모자라도 <b>줄이거나 스크롤하지 않고 잘라 버립니다</b>. 항목이 많아질 수 있다면 <code>ScrollViewer</code> 로 감싸거나(다음 교시) <code>ListBox</code> 를 쓰세요.</li></ul>' },

          { type: 'h', text: 'WrapPanel — 넘치면 다음 줄로' },
          { type: 'p', html: '<code>WrapPanel</code> 은 글자가 줄 끝에서 다음 줄로 넘어가듯, 자식을 가로로 놓다가 <b>자리가 모자라면 다음 줄</b>에 이어 놓습니다. <code>ItemWidth</code> · <code>ItemHeight</code> 를 지정하면 모든 자식이 <b>같은 크기의 칸</b>을 받아 타일처럼 가지런해집니다. (<code>Orientation="Vertical"</code> 로 하면 위에서 아래로 놓다가 다음 열로 넘어갑니다.)' },
          { type: 'code', title: '예제 15-2. WrapPanel 과 ItemWidth · ItemHeight', code: EX_WRAP, desc: '버튼마다 <code>90 × 50</code> 칸이 주어지고, 한 줄에 네 개가 들어가면 다섯 번째부터 다음 줄로 넘어갑니다. 8번 버튼은 글자가 길어도 칸 크기가 고정이라 글자가 잘립니다. Visual Studio 에서 실행한 뒤 창 너비를 마우스로 줄였다 늘려 보면 한 줄의 개수가 바뀌는 것을 볼 수 있습니다.' },

          { type: 'h', text: 'DockPanel — 가장자리에 붙이기' },
          { type: 'p', html: '<code>DockPanel</code> 은 자식을 <b>위 · 아래 · 왼쪽 · 오른쪽 가장자리에 붙이는(dock)</b> 패널입니다. 자식에 <b>부착 속성(attached property)</b> <code>DockPanel.Dock="Top"</code> 처럼 방향을 적습니다. 그리고 <b>마지막 자식은 남은 공간을 모두 채웁니다</b>(<code>LastChildFill="True"</code> 가 기본값). 메뉴는 위, 상태 표시줄은 아래, 목록은 왼쪽, 내용은 가운데 — 대부분의 데스크톱 앱 틀이 이 모양입니다.' },
          { type: 'code', title: '예제 15-3. DockPanel 로 만든 앱 틀', code: EX_DOCK, desc: '<code>Menu</code>(위) → <code>StatusBar</code>(아래) → <code>ListBox</code>(왼쪽) 순서로 붙인 뒤, 마지막 자식 <code>TextBox</code> 가 가운데의 남은 공간을 모두 차지합니다. XAML 주석 <code>&lt;!-- … --&gt;</code> 로 영역을 표시해 두면 나중에 읽기 쉽습니다.' },
          { type: 'p', html: 'DockPanel 에서는 <b>자식의 순서가 결과를 바꿉니다</b>. 먼저 붙은 자식이 가장자리 전체를 차지하고, 다음 자식은 <b>남은 공간</b>의 가장자리에 붙기 때문입니다.' },
          { type: 'code', title: '예제 15-4. DockPanel 은 순서가 중요하다', code: EX_DOCKORDER, desc: '① 은 <code>Top</code> 을 먼저 붙였으므로 파란 영역이 <b>가로 전체</b>를 차지하고, 빨간 <code>Left</code> 는 그 아래 남은 부분에만 붙습니다. ② 는 <code>Left</code> 를 먼저 붙였으므로 빨간 영역이 <b>세로 전체</b>를 차지합니다. 같은 자식 셋, 순서만 다른데 모양이 달라집니다.' },
          { type: 'callout', kind: 'tip', title: 'LastChildFill="False"', html: '마지막 자식까지 가장자리에 붙이고 가운데를 비워 두고 싶으면 <code>&lt;DockPanel LastChildFill="False"&gt;</code> 로 씁니다. 예를 들어 도구 모음에서 버튼 몇 개는 왼쪽, 몇 개는 오른쪽(<code>DockPanel.Dock="Right"</code>)에 붙일 때 유용합니다. <code>DockPanel.Dock</code> 을 적지 않은 자식은 <code>Left</code> 로 취급됩니다.' },

          { type: 'h', text: 'Canvas — 좌표로 직접 놓기' },
          { type: 'p', html: '<code>Canvas</code> 는 자동 배치를 하지 않는 유일한 패널입니다. 자식마다 <code>Canvas.Left</code> · <code>Canvas.Top</code>(또는 <code>Canvas.Right</code> · <code>Canvas.Bottom</code>)으로 <b>왼쪽 위 모서리의 좌표</b>를 적습니다. 기준점 (0, 0) 은 Canvas 의 왼쪽 위이고, 오른쪽으로 갈수록 x, 아래로 갈수록 y 가 커집니다. 자식끼리 겹칠 수 있으며, 겹칠 때 무엇이 위에 보일지는 <code>Panel.ZIndex</code> 로 정합니다(값이 클수록 위, 같으면 나중에 쓴 요소가 위).' },
          { type: 'code', title: '예제 15-5. Canvas 좌표와 ZIndex — 코드로 옮기기', code: EX_CANVAS, desc: '부착 속성은 코드에서 <code>Canvas.GetLeft(요소)</code> / <code>Canvas.SetLeft(요소, 값)</code> 처럼 <b>클래스 이름으로 부르는 정적 메서드</b>로 읽고 씁니다. “공을 오른쪽으로” 를 누를 때마다 <code>Canvas.Left</code> 가 20씩 커지고, “ZIndex 바꾸기” 를 누르면 사각형의 <code>Panel.ZIndex</code> 가 0 ↔ 2 로 바뀌어 겹친 부분에서 위아래가 뒤바뀝니다.' },
          { type: 'callout', kind: 'warn', title: 'Canvas 는 꼭 필요할 때만', html: 'Canvas 의 자식은 창 크기가 바뀌어도 <b>제자리에 그대로</b> 있고, 크기도 늘어나지 않습니다. 버튼 · 입력칸이 있는 일반 화면을 Canvas 로 만들면 옛 좌표 방식의 단점이 그대로 돌아옵니다. 그림 그리기, 도형 애니메이션, 게임처럼 <b>좌표 자체가 의미 있는 곳</b>에만 쓰세요.' },

          { type: 'h', text: 'Margin · Padding · 정렬 복습' },
          { type: 'p', html: '패널이 자리를 정해 준 뒤, 요소 사이의 간격은 <b>Margin(바깥 여백)</b> 과 <b>Padding(안쪽 여백)</b> 으로 조절합니다.' },
          { type: 'figure', html: SVG_BOX, caption: 'Margin 은 테두리 바깥, Padding 은 테두리와 내용 사이' },
          { type: 'table', head: ['쓰는 법', '뜻', '예'], rows: [
            ['<code>Margin="10"</code>', '네 방향 모두 10', '사방으로 똑같이 띄우기'],
            ['<code>Margin="10,5"</code>', '좌우 10, 위아래 5', '가로 · 세로 따로'],
            ['<code>Margin="1,2,3,4"</code>', '<b>왼쪽, 위, 오른쪽, 아래</b> 순서 (시계 방향 아님!)', '<code>"0,0,0,8"</code> = 아래만 8'],
            ['<code>Padding="10"</code>', '테두리와 내용 사이 10', '<code>Border</code>, <code>Button</code>, <code>TextBox</code> 등 (컨트롤 · Border 에만 있음)']
          ] },
          { type: 'code', title: '추가 예제. Margin 과 Padding 비교', code: EX_MARGIN, desc: '파란 <code>Border</code> 는 회색 StackPanel 에서 20 만큼 떨어져 있고(Margin), 안쪽 흰 글자 영역은 테두리에서 20 만큼 들어가 있습니다(Padding). 첫 번째 버튼은 Padding 10 때문에 두 번째 버튼보다 키가 큽니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 레이아웃 잡기', html: '<ol><li><b>도구 상자</b>(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd>)의 <b>모든 WPF 컨트롤</b>에서 <code>StackPanel</code> · <code>DockPanel</code> 등을 디자이너나 XAML 편집기로 끌어다 놓을 수 있습니다.</li><li>요소를 선택하고 <b>속성 창</b>(<kbd>F4</kbd>)의 <b>레이아웃</b> 범주를 보면 <code>Width</code>/<code>Height</code>, <code>HorizontalAlignment</code>/<code>VerticalAlignment</code> 단추, <code>Margin</code> 네 칸 입력이 있습니다. 부착 속성(<code>DockPanel.Dock</code>, <code>Canvas.Left</code> …)도 여기에 나타납니다.</li><li>디자이너에서 요소를 끌어 옮기면 Visual Studio 가 <code>Margin</code> 을 이상한 값(예: <code>Margin="37,52,0,0"</code>)으로 적어 넣는 경우가 많습니다. 레이아웃은 가능하면 <b>XAML 에 직접</b> 패널과 정렬로 적는 습관을 들이세요.</li></ol>' }
        ],
        practice: [
          {
            title: '실습 15-1. DockPanel 로 메모장 앱 틀 만들기',
            level: 1,
            desc: '<p>뼈대 코드의 <code>DockPanel</code> 에 다음 영역을 <b>순서대로</b> 추가해 메모장 앱의 틀을 완성하세요.</p><ol><li>위: <code>Menu</code> (파일 · 편집 · 보기)</li><li>위: 버튼 3개(새로 만들기 · 저장 · 삭제)가 든 가로 <code>StackPanel</code> — 회색 배경</li><li>아래: <code>StatusBar</code> (준비 · 메모 3개)</li><li>왼쪽: 메모 제목 3개가 든 <code>ListBox</code> (<code>Width="130"</code>)</li><li>오른쪽: “속성” 정보가 든 <code>Border</code> (<code>Width="120"</code>, 연노랑 배경)</li></ol><p>마지막 자식인 <code>TextBox</code> 는 그대로 두어 가운데를 채우게 합니다.</p>',
            hint: '<code>DockPanel.Dock="Top"</code> 인 요소를 두 개 넣으면 먼저 쓴 것이 더 위에 놓입니다. 채우기 영역(<code>TextBox</code>)은 <b>반드시 맨 마지막</b>에 있어야 합니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 15-2. WrapPanel 색상 타일 12개',
            level: 1,
            desc: '<p><code>WrapPanel</code> 에 <code>ItemWidth="100"</code> · <code>ItemHeight="70"</code> 을 지정하고, 색 이름이 가운데 적힌 <code>Border</code> 타일을 <b>모두 12개</b> 만들어 한 줄에 4개씩 3줄이 되게 하세요. 색은 자유롭게 고릅니다(예: <code>#EF4444</code> 빨강, <code>#3B82F6</code> 파랑).</p>',
            hint: '타일 하나 = <code>&lt;Border Margin="4" Background="…"&gt;&lt;TextBlock Text="…" HorizontalAlignment="Center" VerticalAlignment="Center"/&gt;&lt;/Border&gt;</code>. 복사해서 색과 글자만 바꾸세요. 밝은 색에는 <code>Foreground="Black"</code> 이 잘 보입니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>StackPanel</code> 의 <code>Orientation</code> 기본값은?', options: ['Horizontal', 'Vertical', 'Wrap', 'None'], answer: 1, explain: '기본은 세로(<code>Vertical</code>)로 쌓습니다. 가로로 쌓으려면 <code>Orientation="Horizontal"</code>.' },
          { q: '다음 DockPanel 에서 창의 <b>높이 전체</b>를 차지하는 요소는?<pre><code>&lt;DockPanel&gt;\n  &lt;Border DockPanel.Dock="Left" Width="80" Background="Red"/&gt;\n  &lt;Border DockPanel.Dock="Top" Height="40" Background="Blue"/&gt;\n  &lt;Border Background="Green"/&gt;\n&lt;/DockPanel&gt;</code></pre>', options: ['파란 Top Border', '초록 Border', '셋 다 같은 높이', '빨간 Left Border'], answer: 3, explain: '먼저 붙은 <code>Left</code> 가 세로 전체를 차지하고, <code>Top</code> 은 남은 오른쪽 부분의 위에만 붙습니다. DockPanel 은 순서가 중요합니다.' },
          { q: 'Canvas 안에서 요소의 위치를 정하는 속성은?', options: ['<code>Margin</code> 만 사용', '<code>Grid.Row</code> · <code>Grid.Column</code>', '<code>Canvas.Left</code> · <code>Canvas.Top</code>', '<code>DockPanel.Dock</code>'], answer: 2, explain: 'Canvas 의 부착 속성 <code>Canvas.Left</code> · <code>Canvas.Top</code>(또는 Right · Bottom)으로 좌표를 지정합니다.' },
          { q: '너비가 350 인 <code>WrapPanel</code> 에 <code>ItemWidth="100"</code> 을 주고 버튼 10개를 넣었습니다. 첫 줄에는 버튼이 몇 개 놓일까요?', options: ['3개', '2개', '4개', '10개'], answer: 0, explain: '100 짜리 칸이 350 안에 3개(300)까지 들어가고, 4번째(400)는 넘치므로 다음 줄로 갑니다.' },
          { q: '<code>Margin="5,10,15,20"</code> 에서 <b>위쪽</b> 여백은?', options: ['5', '10', '15', '20'], answer: 1, explain: '네 값의 순서는 <b>왼쪽, 위, 오른쪽, 아래</b>입니다. 위쪽은 두 번째 값 10.' }
        ],
        slides: [
          { layout: 'title', title: 'StackPanel · WrapPanel · DockPanel · Canvas', subtitle: 'Chapter 15 · Section 01 — 레이아웃 패널', badge: '15-1',
            notes: '<p><b>[도입 3분]</b> 지난 장에서 XAML 로 컨트롤을 올려 보았습니다. “버튼 10개를 창에 예쁘게 놓으려면 좌표를 하나하나 계산해야 할까?” 하고 묻습니다.</p><p>오늘 목표: 부모 패널이 자식의 자리를 정한다는 원리 + 패널 4종(Stack · Wrap · Dock · Canvas)의 차이.</p>' },
          { layout: 'diagram', title: '레이아웃 = 부모 패널이 자리를 정하는 일', html: SVG_MEASURE, caption: '① 측정(Measure): 얼마나 필요하니? → ② 배치(Arrange): 여기에 이 크기로!',
            notes: '<p><b>[4분]</b> 비유: 부모 패널은 “자리 배치 담당 선생님”. 학생(자식)에게 필요한 책상 크기를 물어보고(측정), 교실 규칙(패널 종류)에 따라 자리를 정해 줍니다(배치).</p><p>핵심 문장: <b>크기를 최종 결정하는 쪽은 부모</b>. Width 를 줘도 부모가 공간을 안 주면 잘린다는 것도 살짝 언급.</p>' },
          { layout: 'diagram', title: '네 가지 패널의 배치 모양', html: SVG_PANELS, caption: '차례로 · 줄 바꿈 · 가장자리 · 좌표',
            notes: '<p><b>[4분]</b> 그림 네 칸을 왼쪽부터 짚으며 한 줄씩. 발문: “메신저 앱의 이모티콘 목록은 어떤 패널일까?” (WrapPanel), “그림판은?” (Canvas).</p>' },
          { layout: 'table', title: '패널 비교', head: ['패널', '규칙', '주로 쓰는 곳'], rows: [
            ['<code>StackPanel</code>', '한 방향으로 쌓기', '버튼 묶음 · 폼 한 줄'],
            ['<code>WrapPanel</code>', '넘치면 다음 줄', '태그 · 썸네일'],
            ['<code>DockPanel</code>', '가장자리 + 마지막 채움', '앱 전체 틀'],
            ['<code>Canvas</code>', '좌표(Left, Top)', '그림 · 게임'],
            ['<code>Grid</code>', '행 · 열 표', '대부분 (다음 교시)']
          ], lead: 'Window 에는 자식이 하나 → 보통 패널 하나를 먼저 둔다',
            notes: '<p><b>[2분]</b> 표로 정리. Window 는 Content 가 하나뿐이라 패널이 필요하다는 점, 새 프로젝트에 Grid 가 기본으로 들어 있는 이유를 연결합니다.</p>' },
          { layout: 'code', title: '예제 15-1. StackPanel', code: SL_STACK, points: ['기본 <code>Vertical</code>, <code>Orientation="Horizontal"</code> 로 가로', '세로 Stack 의 자식: <code>HorizontalAlignment</code> 로 좌 · 중 · 우', '패널에 <code>Background</code> → 영역이 보인다'],
            notes: '<p><b>[5분]</b> 실행 후 Left/Center/Right 버튼 위치를 확인. 발문: “세로 StackPanel 에서 VerticalAlignment=Bottom 을 주면?” → 변화 없음(높이는 필요한 만큼만 받으니까).</p><p>공간이 모자라면 잘린다는 점도 짧게.</p>' },
          { layout: 'code', title: '예제 15-2. WrapPanel', code: SL_WRAP, points: ['자리가 모자라면 <b>다음 줄</b>로', '<code>ItemWidth</code> · <code>ItemHeight</code> = 모든 칸을 같은 크기로', '창 너비를 바꾸면 한 줄의 개수가 변함'],
            notes: '<p><b>[4분]</b> Visual Studio 에서 실행해 창 너비를 줄였다 늘려 시연하면 효과가 큽니다. ItemWidth 를 지우면 버튼이 제각각 크기가 된다는 것도 보여 주세요.</p>' },
          { layout: 'code', title: '예제 15-3. DockPanel 앱 틀', code: SL_DOCK, points: ['<code>DockPanel.Dock</code> = Top · Bottom · Left · Right', '<b>마지막 자식은 남은 공간 채우기</b> (<code>LastChildFill</code>)', '먼저 붙은 요소가 가장자리 전체를 차지 → <b>순서 중요</b>'],
            notes: '<p><b>[8분]</b> 실행 후 TextBox 를 Menu 앞으로 옮겨 보게 합니다 → 마지막 자식이 바뀌어 모양이 깨짐. 예제 15-4(Top 먼저 vs Left 먼저)를 본문에서 함께 실행.</p><p>부착 속성(attached property): “DockPanel 이 자식에게 붙여 주는 이름표”.</p>' },
          { layout: 'code', title: '예제 15-5. Canvas', code: SL_CANVAS, points: ['<code>Canvas.Left</code> · <code>Top</code> (또는 Right · Bottom)', '겹침 순서: <code>Panel.ZIndex</code> 큰 값이 위', '코드: <code>Canvas.SetLeft(ball, 100)</code>'],
            notes: '<p><b>[5분]</b> 본문 예제 15-5 로 버튼을 눌러 공을 옮기고 ZIndex 를 바꿔 보게 합니다. 부착 속성은 코드에서 정적 메서드 Get/Set 으로 다룬다는 점 강조.</p><p>주의: 일반 폼 화면을 Canvas 로 만들지 말 것!</p>' },
          { layout: 'two', title: 'Margin 과 Padding', left: { title: 'Margin — 바깥 여백', code: `<Button Content="확인"
        Margin="10,5,10,5"/>
<!-- 왼, 위, 오른, 아래 -->`, run: false }, right: { title: 'Padding — 안쪽 여백', code: `<Border Padding="20"
        BorderBrush="Blue"
        BorderThickness="2">
    <TextBlock Text="내용"/>
</Border>`, run: false },
            notes: '<p><b>[3분]</b> 그림(본문의 Margin/Padding 그림)을 보여 주며 “Margin 은 이웃과의 거리, Padding 은 내 몸 안의 쿠션”.</p><p>네 값 순서 <b>왼 · 위 · 오른 · 아래</b> 를 꼭 외우게 합니다(CSS 의 위 · 오른 · 아래 · 왼과 다름).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'DockPanel 에 <code>Left</code> Border → <code>Top</code> Border → 일반 Border 순서로 넣었습니다. 창의 <b>높이 전체</b>를 차지하는 것은?', options: ['Top Border', '마지막 Border', '셋 다 같다', 'Left Border'], answer: 3, explain: '먼저 붙은 Left 가 세로 전체를 차지합니다. DockPanel 은 순서가 중요합니다.',
            notes: '<p>답을 고른 뒤 예제 15-4 의 두 그림을 다시 보여 주며 확인합니다.</p>' },
          { layout: 'practice', title: '실습 15-1. 메모장 앱 틀', desc: '<p>DockPanel 에 Menu(위) · 도구 버튼 StackPanel(위) · StatusBar(아래) · ListBox(왼쪽) · 속성 Border(오른쪽)를 차례로 넣고, TextBox 가 가운데를 채우게 하세요.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[7분]</b> 순서를 바꿔 보는 실험을 권합니다(StatusBar 를 ListBox 뒤로 옮기면?). 빨리 끝난 학생은 실습 15-2(WrapPanel 타일)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['부모 패널이 자식을 <b>측정 → 배치</b>해 자리를 정한다', 'StackPanel: 한 방향 · 정렬은 반대 방향만 효과', 'WrapPanel: 넘치면 줄 바꿈 · ItemWidth/ItemHeight', 'DockPanel: 가장자리 + <b>마지막 채움</b> · 순서 중요', 'Canvas: 좌표 · ZIndex — 꼭 필요할 때만', 'Margin(바깥) · Padding(안쪽) — 왼, 위, 오른, 아래'],
            notes: '<p>다음 시간: 가장 많이 쓰는 <b>Grid</b> — 행과 열로 폼과 계산기 버튼판 만들기.</p>' }
        ]
      },

      /* ===================== ch15-2 ===================== */
      {
        id: 'ch15-2',
        title: 'Grid 와 중첩 레이아웃',
        minutes: 50,
        goals: [
          'RowDefinitions · ColumnDefinitions 로 Grid 의 행과 열을 정의할 수 있다',
          '고정 · Auto · * · 2* 크기 단위의 차이를 설명하고 계산할 수 있다',
          'Grid.Row · Grid.Column · RowSpan · ColumnSpan 으로 요소를 배치할 수 있다',
          'Grid 로 로그인 폼과 계산기 버튼판을, UniformGrid 로 같은 크기 칸을 만들 수 있다',
          'Border · ScrollViewer 와 패널 중첩으로 실제 앱 화면을 구성할 수 있다'
        ],
        flow: [['복습 · 도입', 3], ['Grid 행 · 열과 크기 단위', 12], ['Span · 로그인 폼 · 계산기', 13], ['UniformGrid · 중첩 · Border · ScrollViewer', 12], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: 'Grid — 행과 열로 나누는 표' },
          { type: 'p', html: '<code>Grid</code> 는 공간을 <b>행(row)과 열(column)의 표</b>로 나누고, 자식을 원하는 칸에 넣는 패널입니다. 폼 · 대시보드 · 버튼판 등 거의 모든 화면에 쓰여 <b>WPF 에서 가장 많이 쓰는 패널</b>입니다. 먼저 <code>Grid.RowDefinitions</code> · <code>Grid.ColumnDefinitions</code> 안에 행과 열을 정의하고, 자식에는 <code>Grid.Row</code> · <code>Grid.Column</code> 부착 속성으로 칸 번호를 적습니다. 번호는 <b>0 부터</b> 시작하고, 적지 않으면 0 입니다.' },
          { type: 'h', text: '크기 단위: 고정 · Auto · *' },
          { type: 'table', head: ['쓰는 법', '이름', '뜻', '언제 쓰나'], rows: [
            ['<code>Width="100"</code>', '고정(픽셀)', '항상 100 (정확히는 1/96 인치 단위)', '크기가 정해진 사이드바, 버튼 열'],
            ['<code>Width="Auto"</code>', '자동', '안에 든 <b>내용(자식) 중 가장 큰 것</b>에 맞춤', '라벨 열, 제목 행, 버튼 행'],
            ['<code>Width="*"</code>', '별표(비율)', '고정 · Auto 를 뺀 <b>남은 공간</b>을 나눔', '내용 영역, 입력칸'],
            ['<code>Width="2*"</code>', '별표 배수', '남은 공간을 <code>*</code> 의 2배만큼', '비율 레이아웃(1 : 2 …)'],
            ['생략', '—', '<code>*</code> 와 같음 (기본값)', '<code>&lt;RowDefinition/&gt;</code> 만 쓰면 같은 크기로 나눔']
          ], caption: 'RowDefinition 은 Height, ColumnDefinition 은 Width 에 같은 단위를 쓴다' },
          { type: 'figure', html: SVG_GRIDUNITS, caption: '고정과 Auto 를 먼저 빼고, 남은 공간을 * 비율대로 나눈다' },
          { type: 'code', title: '예제 15-6. Grid 의 크기 단위와 ShowGridLines', code: EX_GRIDUNITS, desc: '<code>ShowGridLines="True"</code> 는 행 · 열 경계를 점선으로 보여 주는 <b>연습용 옵션</b>입니다(완성된 앱에서는 끔). 1열(<code>Auto</code>)은 “내용 크기” 버튼 너비만큼, 2열과 3열은 남은 너비를 1 : 2 로 나눕니다. 마지막 줄의 <code>Grid.ColumnSpan="4"</code> 는 바로 아래에서 배웁니다. (XAML 주석은 속성 안이 아니라 요소 사이에 써야 합니다.)' },
          { type: 'h', text: 'RowSpan · ColumnSpan — 여러 칸 합치기' },
          { type: 'p', html: '표에서 셀을 병합하듯, <code>Grid.ColumnSpan="3"</code> 은 시작 칸부터 <b>오른쪽으로 3열</b>을, <code>Grid.RowSpan="2"</code> 는 <b>아래로 2행</b>을 차지하게 합니다. 시작 위치는 여전히 <code>Grid.Row</code> · <code>Grid.Column</code> 입니다.' },
          { type: 'code', title: '예제 15-7. RowSpan 과 ColumnSpan', code: EX_SPAN, desc: '머리글은 0행 0열에서 시작해 3열을 합치고, 메뉴는 1행 0열에서 시작해 2행을 합칩니다. C 는 2행 1열에서 시작해 2열을 합칩니다. 각 <code>Border</code> 에 <code>Margin="3"</code> 을 주어 칸 사이에 틈이 보이게 했습니다.' },
          { type: 'h', text: 'Grid 로 로그인 폼 만들기' },
          { type: 'p', html: '입력 폼은 Grid 의 대표적인 쓰임새입니다. <b>왼쪽 열은 <code>Auto</code></b>(가장 긴 라벨 너비), <b>오른쪽 열은 <code>*</code></b>(입력칸이 나머지 전부)로 두면 라벨 길이가 달라도 입력칸이 가지런히 맞춰집니다. 라벨에는 <code>Label</code>, 글자 입력에는 <code>TextBox</code>, 비밀번호에는 입력이 ●로 가려지는 <code>PasswordBox</code> 를 씁니다(값은 <code>Text</code> 가 아니라 <code>Password</code> 속성).' },
          { type: 'code', title: '예제 15-8. Grid 로그인 폼', code: EX_LOGIN, desc: '행은 모두 <code>Auto</code> 로 내용 높이만큼 쓰고, 3행만 <code>*</code> 로 두어 남은 세로 공간을 흡수하게 했습니다. 그래서 버튼 줄(4행)은 항상 창의 <b>맨 아래</b>에 붙습니다. <code>IsDefault="True"</code> 인 버튼은 <kbd>Enter</kbd> 키로도 눌립니다. 비밀번호는 <code>pwdBox.Password</code> 로 읽습니다.' },
          { type: 'h', text: '계산기 버튼판 — 4 × 5 Grid' },
          { type: 'p', html: '같은 크기의 칸을 여러 개 만들 때는 <code>&lt;RowDefinition/&gt;</code> · <code>&lt;ColumnDefinition/&gt;</code> 를 크기 없이(= <code>*</code>) 나열하면 됩니다. 아래 계산기는 표시창 행 하나(고정 70) + 버튼 4행, 4열입니다.' },
          { type: 'code', title: '예제 15-9. 계산기 버튼판', code: EX_CALC, desc: '표시창 <code>Border</code> 는 <code>Grid.ColumnSpan="4"</code> 로 첫 행 전체를 차지하고, <code>CornerRadius="6"</code> 으로 모서리가 둥급니다. 버튼 16개는 모두 <code>Click="Key_Click"</code> 처리기 하나를 공유합니다. <code>sender is Button b &amp;&amp; b.Content is string key</code> 는 “눌린 것이 버튼이고 그 글자가 문자열이면 <code>b</code>, <code>key</code> 라는 이름으로 쓰겠다”는 <b>패턴 매칭</b>입니다. (실제 계산 기능은 뒤의 프로젝트에서 완성합니다.)' },
          { type: 'h', text: 'UniformGrid — 모든 칸이 같은 크기' },
          { type: 'p', html: '<code>UniformGrid</code> 는 <code>Rows</code> · <code>Columns</code> 만 정하면 <b>모든 칸을 같은 크기로</b> 나누고, 자식을 <b>순서대로</b> 왼쪽 위부터 채웁니다. <code>Grid.Row</code>/<code>Grid.Column</code> 을 적을 필요가 없어 버튼판 · 달력 · 바둑판처럼 칸이 균일한 화면을 아주 짧게 만들 수 있습니다. 한쪽만 정하면(예: <code>Columns="3"</code>) 다른 쪽은 자식 수에 맞춰 자동으로 정해집니다.' },
          { type: 'code', title: '예제 15-10. UniformGrid 틱택토', code: EX_UNIFORM, desc: '9개의 버튼이 3 × 3 칸에 순서대로 들어갑니다. 빈 칸(<code>Content == null</code>)을 누르면 X 와 O 가 번갈아 표시됩니다. 같은 모양을 Grid 로 만들면 RowDefinition · ColumnDefinition 6줄과 버튼마다 <code>Grid.Row</code> · <code>Grid.Column</code> 이 필요합니다.' },
          { type: 'table', head: ['', 'Grid', 'UniformGrid'], rows: [
            ['칸 크기', '행 · 열마다 따로 (고정 · Auto · *)', '모두 같음'],
            ['자식 위치', '<code>Grid.Row</code> · <code>Grid.Column</code> 로 지정', '넣은 순서대로 자동'],
            ['칸 합치기', 'RowSpan · ColumnSpan', '불가'],
            ['어울리는 곳', '폼, 대시보드, 대부분의 화면', '버튼판, 달력, 사진 목록']
          ] },
          { type: 'h', text: '중첩 레이아웃과 Border' },
          { type: 'p', html: '실제 앱 화면은 패널 하나로 만들지 않습니다. <b>패널 안에 패널을 넣어(중첩)</b> 큰 틀은 DockPanel 이나 Grid 로, 작은 묶음은 StackPanel 로 만듭니다. <code>Border</code> 는 자식 <b>하나</b>를 감싸 <b>배경(<code>Background</code>) · 테두리(<code>BorderBrush</code>, <code>BorderThickness</code>) · 둥근 모서리(<code>CornerRadius</code>) · 안쪽 여백(<code>Padding</code>)</b>을 주는 요소로, 카드 · 머리글 · 구역 표시에 자주 씁니다. (<code>Grid</code> · <code>StackPanel</code> 에는 테두리와 Padding 이 없어서 Border 로 감쌉니다.)' },
          { type: 'figure', html: SVG_NEST, caption: 'DockPanel(틀) 안에 Border · StackPanel · Grid, Grid 안에 다시 Border 카드' },
          { type: 'code', title: '예제 15-11. 중첩 레이아웃 — 학습 대시보드', code: EX_NESTED, desc: '큰 틀은 <code>DockPanel</code>: 위 머리글 <code>Border</code>, 왼쪽 메뉴 <code>Border</code>(안에 StackPanel), 마지막 자식 <code>Grid</code> 가 가운데를 채웁니다. Grid 의 네 칸에는 둥근 모서리 카드(<code>Border CornerRadius="10"</code>)가 들어 있고, 카드 안은 다시 StackPanel 입니다. 요소를 이렇게 몇 단계로 겹쳐도 각 패널은 자기 영역 안의 배치만 책임집니다.' },
          { type: 'h', text: 'ScrollViewer — 넘치면 스크롤' },
          { type: 'p', html: '내용이 영역보다 클 때 <code>ScrollViewer</code> 로 감싸면 스크롤 막대가 생깁니다. <code>VerticalScrollBarVisibility</code> 를 <code>Auto</code> 로 하면 넘칠 때만 막대가 나타납니다(<code>Visible</code> 항상, <code>Hidden</code>/<code>Disabled</code> 숨김). 가로 스크롤은 <code>HorizontalScrollBarVisibility</code> 로 켭니다(기본은 <code>Disabled</code>). ScrollViewer 도 Border 처럼 <b>자식이 하나</b>이므로 보통 StackPanel 을 넣습니다.' },
          { type: 'code', title: '추가 예제. ScrollViewer 로 긴 목록 스크롤', code: EX_SCROLL, desc: 'XAML 에는 빈 <code>StackPanel x:Name="list"</code> 만 두고, 생성자에서 <code>for</code> 문으로 <code>Border</code> 30개를 만들어 <code>list.Children.Add(…)</code> 로 넣었습니다. 패널의 자식은 이렇게 <b>코드로도</b> 추가할 수 있습니다. 짝수 줄은 연한 파랑 배경으로 구분됩니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — Viewbox', html: '<code>Viewbox</code> 는 자식 하나를 받아 <b>자기 크기에 맞게 통째로 확대 · 축소</b>합니다. 글자 · 도형까지 함께 커지므로 시계 숫자, 아이콘, 점수판처럼 “창이 커지면 내용도 커져야 하는” 곳에 씁니다. <code>Stretch</code> 속성으로 비율 유지(<code>Uniform</code>, 기본) · 꽉 채우기(<code>Fill</code>) 등을 고릅니다.<pre><code>&lt;Viewbox&gt;\n    &lt;TextBlock Text="12:30"/&gt;\n&lt;/Viewbox&gt;</code></pre>이 강좌의 브라우저 실행 창은 Viewbox 의 확대 · 축소를 흉내 내지 못하므로, Viewbox 는 <b>Visual Studio 에서 실행</b>해 창 크기를 바꿔 가며 확인하세요.' },
          { type: 'callout', kind: 'vs', title: '디자이너에서 Grid 행 · 열 나누기', html: '<ol><li><code>MainWindow.xaml</code> 디자이너에서 <code>Grid</code> 를 선택하면 위쪽과 왼쪽 가장자리에 얇은 <b>눈금 막대(grid rail)</b>가 나타납니다. 막대 위를 클릭하면 그 위치에 <b>열(위쪽 막대) · 행(왼쪽 막대) 경계선</b>이 추가됩니다.</li><li>경계선 위에 표시된 크기에 마우스를 올리면 <b>픽셀(고정) · 별표(*) · 자동(Auto)</b> 중 하나를 고를 수 있습니다. 경계선을 끌면 크기가 바뀝니다.</li><li>속성 창의 <code>RowDefinitions</code> / <code>ColumnDefinitions</code> 옆 <b>[…]</b> 단추를 누르면 컬렉션 편집기에서 행 · 열을 추가 · 삭제하고 크기를 입력할 수 있습니다.</li><li>디자이너로 만든 결과는 모두 XAML 의 <code>&lt;Grid.RowDefinitions&gt;</code> 로 적힙니다. 편집 후 XAML 을 꼭 읽어 보고 불필요한 <code>Margin</code> 이 생기지 않았는지 확인하세요.</li></ol>' },
          { type: 'callout', kind: 'vs', title: '문서 개요 창으로 중첩 구조 보기', html: '<ul><li><b>보기 → 다른 창 → 문서 개요</b>(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>)를 열면 XAML 의 요소 트리(Window → DockPanel → Border …)가 보입니다. 위 그림 오른쪽의 트리와 같은 모양입니다.</li><li>트리에서 항목을 클릭하면 디자이너와 XAML 편집기에서 그 요소가 선택됩니다. 패널이 여러 겹으로 겹쳐 디자이너에서 클릭하기 어려울 때 특히 편합니다.</li><li>디자이너에서 요소 여러 개를 선택하고 오른쪽 클릭 → <b>그룹화</b>를 고르면 선택한 요소를 새 <code>Grid</code> · <code>StackPanel</code> 등으로 한 번에 감쌀 수 있습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 15-3. Grid 로 회원가입 폼 만들기',
            level: 2,
            desc: '<p>2열(<code>Auto</code> · <code>*</code>) Grid 로 회원가입 폼을 완성하세요.</p><ul><li>행: 제목 · 이름 · 아이디 · 비밀번호 · 비밀번호 확인 · 이메일 · 성별 · (빈 공간 <code>*</code>) · 버튼</li><li>비밀번호 두 칸은 <code>PasswordBox</code>(<code>x:Name="pwd1"</code>, <code>"pwd2"</code>)</li><li>성별은 가로 <code>StackPanel</code> 안에 <code>RadioButton</code> 2개(<code>GroupName</code> 같게)</li><li>가입 버튼은 마지막 행 오른쪽 아래. 누르면 두 비밀번호가 다를 때 “비밀번호가 서로 다릅니다.”, 같으면 “(이름) 님, 가입을 환영합니다!” 를 <code>MessageBox</code> 로 표시</li></ul>',
            hint: '행을 추가할 때마다 <code>&lt;RowDefinition Height="Auto"/&gt;</code> 를 하나씩 늘리고, 요소의 <code>Grid.Row</code> 번호를 1씩 올립니다. 비밀번호 비교는 <code>pwd1.Password != pwd2.Password</code>.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 15-4. UniformGrid 사진첩',
            level: 2,
            desc: '<p><code>UniformGrid</code>(<code>Rows="2"</code> · <code>Columns="3"</code>)에 사진 카드 6개를 넣어 사진첩 화면을 만드세요. 사진 대신 색을 칠한 <code>Border</code> 를 씁니다. 카드 하나는 <b>흰 액자 Border → DockPanel → (아래) 제목 TextBlock + (채우기) 색 Border</b> 의 중첩 구조입니다. 제목: 바다 · 산 · 숲 · 노을 · 사막 · 밤하늘.</p>',
            hint: '뼈대에 있는 카드 하나를 통째로 복사해 제목과 <code>Background</code> 색만 바꾸세요. UniformGrid 는 넣은 순서대로 왼쪽 위부터 채웁니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '너비 400 인 Grid 의 열이 <code>Width="100"</code>, <code>"*"</code>, <code>"2*"</code> 입니다. <code>*</code> 열의 너비는?', options: ['100', '150', '200', '300'], answer: 0, explain: '남은 공간 400 − 100 = 300 을 1 : 2 로 나누므로 <code>*</code> = 100, <code>2*</code> = 200.' },
          { q: 'Grid 안의 요소에 <code>Grid.Row</code> 와 <code>Grid.Column</code> 을 적지 않으면 어디에 놓일까요?', options: ['마지막 행 · 마지막 열', '0행 0열 (첫 칸)', '놓이지 않는다', '컴파일 오류'], answer: 1, explain: '기본값이 0 이므로 첫 칸(왼쪽 위)에 놓입니다. 여러 요소가 모두 생략하면 첫 칸에 겹칩니다.' },
          { q: '어떤 요소가 시작 칸부터 <b>오른쪽으로 3열</b>을 차지하게 하려면?', options: ['<code>Grid.Column="3"</code>', '<code>Grid.Span="3"</code>', '<code>Width="3*"</code>', '<code>Grid.ColumnSpan="3"</code>'], answer: 3, explain: '<code>Grid.ColumnSpan</code> 은 열 합치기, <code>Grid.RowSpan</code> 은 행 합치기입니다.' },
          { q: '<code>&lt;UniformGrid Columns="3"&gt;</code> 에 버튼 7개를 넣으면 몇 행이 될까요?', options: ['2행', '1행', '3행', '7행'], answer: 2, explain: '한 행에 3개씩: 3 + 3 + 1 → 3행. 마지막 행에는 1개만 있고 나머지 칸은 빈 채로 남습니다.' },
          { q: '<code>&lt;RowDefinition Height="Auto"/&gt;</code> 의 뜻은?', options: ['남은 공간을 모두 차지한다', '안에 든 내용(자식)의 크기만큼만 차지한다', '항상 100 픽셀', '창 높이의 절반'], answer: 1, explain: '<code>Auto</code> 는 그 행에 든 가장 큰 자식의 높이에 맞춥니다. 남은 공간을 차지하는 것은 <code>*</code>.' }
        ],
        slides: [
          { layout: 'title', title: 'Grid 와 중첩 레이아웃', subtitle: 'Chapter 15 · Section 02 — 레이아웃 패널', badge: '15-2',
            notes: '<p><b>[도입 3분]</b> 복습: DockPanel 에서 순서가 왜 중요했는지 한 학생에게 묻기. 오늘은 WPF 에서 가장 많이 쓰는 Grid — “엑셀 표처럼 칸을 나누고 칸에 넣는다”.</p>' },
          { layout: 'table', title: 'Grid 크기 단위', head: ['쓰는 법', '뜻'], rows: [
            ['<code>"100"</code>', '고정 100 (픽셀)'],
            ['<code>"Auto"</code>', '내용(자식) 크기만큼'],
            ['<code>"*"</code>', '남은 공간 1몫'],
            ['<code>"2*"</code>', '남은 공간 2몫'],
            ['생략', '<code>*</code> 와 같음']
          ], lead: '행은 Height, 열은 Width — 번호는 0 부터',
            notes: '<p><b>[4분]</b> 표를 읽으며 각 단위를 언제 쓰는지 예: 라벨 열 = Auto, 입력칸 = *, 사이드바 = 고정.</p>' },
          { layout: 'diagram', title: '남은 공간을 * 비율로 나누기', html: SVG_GRIDUNITS, caption: '500 − 100 − 70 = 330 → * = 110, 2* = 220',
            notes: '<p><b>[4분]</b> 계산 순서: ① 고정 빼기 ② Auto(내용 크기) 빼기 ③ 남은 것을 별표 비율로. 발문: “창 너비가 800 이 되면 2* 열은?” → (800−170)×2/3 = 420.</p>' },
          { layout: 'code', title: '예제 15-6. 행 · 열 정의', code: SL_GRID, points: ['<code>Grid.RowDefinitions</code> · <code>ColumnDefinitions</code>', '자식: <code>Grid.Row</code> · <code>Grid.Column</code> (생략 = 0)', '<code>ShowGridLines</code> = 연습용 경계선'],
            notes: '<p><b>[5분]</b> 실행 후 2* 를 3* 로 바꿔 보게 합니다. Grid.Column 을 지우면 요소가 첫 칸에 겹친다는 것도 보여 주세요.</p>' },
          { layout: 'code', title: '예제 15-7. RowSpan · ColumnSpan', code: SL_SPAN, points: ['<code>Grid.ColumnSpan="3"</code>: 오른쪽으로 3열', '<code>Grid.RowSpan="2"</code>: 아래로 2행', '시작 칸은 여전히 Row · Column'],
            notes: '<p><b>[4분]</b> 엑셀의 “셀 병합” 비유. 본문 예제 15-7 은 칸마다 글자가 있어 더 이해하기 쉽습니다.</p>' },
          { layout: 'code', title: '예제 15-8. 로그인 폼', code: SL_LOGIN, points: ['라벨 열 <code>Auto</code> + 입력 열 <code>*</code>', '<code>PasswordBox</code> 값은 <code>.Password</code>', '버튼: <code>HorizontalAlignment="Right"</code>'],
            notes: '<p><b>[5분]</b> 라벨 “비밀번호” 가 “아이디” 보다 길어도 입력칸이 가지런한 이유 = Auto 열. 본문 예제는 클릭 처리기까지 있으니 실행해 보게 합니다. 이어서 계산기 버튼판(예제 15-9)을 본문에서 함께 실행 — 버튼 16개가 처리기 하나를 공유.</p>' },
          { layout: 'code', title: '예제 15-10. UniformGrid', code: SL_UNIFORM, points: ['<code>Rows</code> · <code>Columns</code> 만 정하면 <b>같은 크기 칸</b>', '자식은 <b>순서대로</b> 채움 (Row/Column 불필요)', '버튼판 · 달력 · 사진 목록'],
            notes: '<p><b>[4분]</b> Grid 로 같은 걸 만들 때 필요한 코드 양과 비교. 본문의 틱택토 예제를 실행해 X/O 를 번갈아 놓아 봅니다.</p>' },
          { layout: 'diagram', title: '중첩 레이아웃', html: SVG_NEST, caption: 'DockPanel 틀 → Border · StackPanel · Grid → Border 카드',
            notes: '<p><b>[4분]</b> 예제 15-11 을 실행하고 그림의 트리와 맞춰 봅니다. “큰 틀은 Dock/Grid, 작은 묶음은 Stack, 꾸밈은 Border” 공식.</p><p>Visual Studio 의 문서 개요 창(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>)을 시연하면 좋습니다.</p>' },
          { layout: 'bullets', title: 'Border · ScrollViewer · Viewbox', bullets: ['<code>Border</code>: 자식 하나 + 배경 · 테두리 · <code>CornerRadius</code> · Padding', '<code>ScrollViewer</code>: 넘치면 스크롤 (<code>VerticalScrollBarVisibility="Auto"</code>)', '<code>Viewbox</code>: 자식을 통째로 확대 · 축소 (Visual Studio 에서 확인)', ['셋 다 <b>자식이 하나</b> → 여러 개면 패널로 감싸기'], '디자이너: Grid 눈금 막대 클릭 → 행 · 열 추가'],
            notes: '<p><b>[3분]</b> 본문의 ScrollViewer 추가 예제(코드로 30개 추가)를 실행. Viewbox 는 브라우저 창에서 확대가 흉내 나지 않으니 Visual Studio 로 시연하세요.</p><p>디자이너에서 Grid 행/열 나누기를 짧게 시연(눈금 막대 클릭 → 크기 종류 선택).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '너비 400 Grid, 열 <code>"100"</code> · <code>"*"</code> · <code>"2*"</code>. <code>*</code> 열의 너비는?', options: ['100', '150', '200', '300'], answer: 0, explain: '(400 − 100) = 300 을 1 : 2 → * = 100, 2* = 200.',
            notes: '<p>정답 후 “창이 700 이 되면?” 으로 확장 → (700−100)/3 = 200.</p>' },
          { layout: 'practice', title: '실습 15-3. 회원가입 폼', desc: '<p>2열(Auto · *) Grid 에 이름 · 아이디 · 비밀번호 · 비밀번호 확인 · 이메일 · 성별(RadioButton) · 가입 버튼을 배치하고, 두 비밀번호가 같은지 확인하는 처리기를 작성하세요.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[10분]</b> 행 번호를 하나씩 늘리는 반복 작업이라 실수가 잦습니다(같은 Row 번호 → 겹침). 빨리 끝난 학생은 실습 15-4(UniformGrid 사진첩)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['Grid: RowDefinitions · ColumnDefinitions, 번호는 0 부터', '크기: 고정 · <b>Auto</b>(내용) · <b>*</b>(남은 공간 비율)', 'Grid.Row · Column · <b>RowSpan · ColumnSpan</b>', 'UniformGrid: 같은 크기 칸, 순서대로 채움', '중첩: 큰 틀(Dock/Grid) + 묶음(Stack) + 꾸밈(Border)', 'ScrollViewer 로 스크롤, Viewbox 로 확대 · 축소'],
            notes: '<p>다음 장: 기본 컨트롤 — 오늘 만든 레이아웃 안에 TextBox · CheckBox · ComboBox 등을 채워 넣습니다.</p>' }
        ]
      }
    ]
  });
})();
