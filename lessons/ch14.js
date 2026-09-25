/* Chapter 14. XAML 기초 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";

  /* ---------- WPF 예제 코드 조립 도우미 ---------- */
  // MainWindow.xaml 부분: 네임스페이스, Window 특성(제목 · 크기 등), 본문, 추가 xmlns
  const XAML = (ns, attrs, body, extraNs) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"${extraNs ? '\n        ' + extraNs : ''}
        ${attrs}>
${body}
</Window>
`;
  // 기본 코드 비하인드 (InitializeComponent 만 호출)
  const CB = (ns) => `// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ${ns}
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;
  // 슬라이드용 짧은 코드 비하인드
  const CBS = (ns) => `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace ${ns} { public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); } } }`;
  const SYS = 'xmlns:sys="clr-namespace:System;assembly=mscorlib"';

  /* ---------- 그림 ---------- */
  const SVG_XAML2OBJ = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="XAML 요소가 객체가 되는 과정">
  <defs><marker id="ah14a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="40" y="70" width="520" height="290" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="300" y="115" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">XAML (MainWindow.xaml)</text>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <text x="75" y="180"><tspan fill="var(--accent)">&lt;Button</tspan></text>
    <text x="115" y="228"><tspan fill="var(--accent2)">Content</tspan>="확인"</text>
    <text x="115" y="276"><tspan fill="var(--accent2)">Width</tspan>="100"</text>
    <text x="115" y="324"><tspan fill="var(--accent2)">Background</tspan>="Orange" <tspan fill="var(--accent)">/&gt;</tspan></text>
  </g>
  <line x1="570" y1="215" x2="705" y2="215" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah14a)"/>
  <text x="638" y="195" text-anchor="middle" style="font-size:21px;fill:var(--accent);font-weight:700">XAML 파서</text>
  <text x="638" y="250" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Initialize</text>
  <text x="638" y="272" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Component()</text>
  <rect x="720" y="70" width="520" height="290" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="980" y="115" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--ok)">같은 뜻의 C# 코드</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)">
    <text x="750" y="180">var b = <tspan fill="var(--accent)">new</tspan> Button();</text>
    <text x="750" y="228">b.<tspan fill="var(--accent2)">Content</tspan> = "확인";</text>
    <text x="750" y="276">b.<tspan fill="var(--accent2)">Width</tspan> = 100;</text>
    <text x="750" y="324">b.<tspan fill="var(--accent2)">Background</tspan> = Brushes.Orange;</text>
  </g>
  <text x="640" y="425" text-anchor="middle" style="font-size:24px;fill:var(--fg)"><tspan font-weight="700">요소(element)</tspan> → 객체 생성 (new)   ·   <tspan font-weight="700">특성(attribute)</tspan> → 속성에 값 대입</text>
  <text x="640" y="475" text-anchor="middle" style="font-size:21px;fill:var(--muted)">"확인" · "100" · "Orange" 같은 문자열은 형식 변환기(type converter)가 string · double · Brush 로 바꿔 준다</text>
</svg>`;

  const SVG_MARGIN = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Margin 과 Padding">
  <rect x="40" y="40" width="600" height="480" rx="10" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="60" y="75" style="font-size:21px;fill:var(--muted)">부모 영역 (StackPanel 등)</text>
  <rect x="130" y="130" width="420" height="300" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <rect x="210" y="200" width="260" height="160" rx="6" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="340" y="292" text-anchor="middle" style="font-size:30px;font-weight:700;fill:var(--fg)">확인</text>
  <text x="340" y="335" text-anchor="middle" style="font-size:18px;fill:var(--muted)">내용(Content)</text>
  <text x="340" y="112" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">Margin (바깥 여백)</text>
  <line x1="340" y1="42" x2="340" y2="90" stroke="var(--warn)" stroke-width="3"/>
  <line x1="42" y1="280" x2="128" y2="280" stroke="var(--warn)" stroke-width="3"/>
  <text x="340" y="185" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--accent2)">Padding (안쪽 여백)</text>
  <line x1="132" y1="280" x2="208" y2="280" stroke="var(--accent2)" stroke-width="3"/>
  <text x="340" y="470" text-anchor="middle" style="font-size:20px;fill:var(--accent)">테두리(Border) = BorderThickness</text>
  <text x="690" y="95" style="font-size:26px;font-weight:700;fill:var(--fg)">값의 개수에 따른 뜻 (Thickness)</text>
  <g style="font-size:22px">
    <text x="690" y="160" style="${MONO};fill:var(--accent)">Margin="10"</text>
    <text x="960" y="160" style="fill:var(--fg)">네 방향 모두 10</text>
    <text x="690" y="225" style="${MONO};fill:var(--accent)">Margin="10,5"</text>
    <text x="960" y="225" style="fill:var(--fg)">좌우 10 · 상하 5</text>
    <text x="690" y="290" style="${MONO};fill:var(--accent)">Margin="1,2,3,4"</text>
    <text x="960" y="290" style="fill:var(--fg)">왼 1 · 위 2 · 오 3 · 아래 4</text>
    <text x="690" y="355" style="${MONO};fill:var(--accent)">new Thickness(1,2,3,4)</text>
    <text x="1010" y="355" style="fill:var(--fg)">C# 코드로</text>
  </g>
  <rect x="690" y="400" width="540" height="90" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="2"/>
  <text x="960" y="438" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--warn)">순서 = 왼쪽부터 시계 방향</text>
  <text x="960" y="472" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">Left, Top, Right, Bottom</text>
</svg>`;

  const SVG_TREE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="XAML 논리 트리">
  <defs><marker id="ah14b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="40" width="520" height="480" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <g style="${MONO};font-size:24px;fill:var(--fg)">
    <text x="70" y="95"><tspan fill="var(--accent)">&lt;Window&gt;</tspan></text>
    <text x="105" y="145"><tspan fill="var(--accent2)">&lt;Grid&gt;</tspan></text>
    <text x="140" y="195"><tspan fill="var(--ok)">&lt;StackPanel&gt;</tspan></text>
    <text x="175" y="245">&lt;TextBlock/&gt;</text>
    <text x="175" y="295">&lt;Button/&gt;</text>
    <text x="175" y="345">&lt;Button/&gt;</text>
    <text x="140" y="395"><tspan fill="var(--ok)">&lt;/StackPanel&gt;</tspan></text>
    <text x="105" y="445"><tspan fill="var(--accent2)">&lt;/Grid&gt;</tspan></text>
    <text x="70" y="495"><tspan fill="var(--accent)">&lt;/Window&gt;</tspan></text>
  </g>
  <rect x="850" y="50" width="200" height="60" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="950" y="90" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">Window</text>
  <line x1="950" y1="112" x2="950" y2="160" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah14b)"/>
  <rect x="850" y="165" width="200" height="60" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="950" y="205" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">Grid</text>
  <line x1="950" y1="227" x2="950" y2="275" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah14b)"/>
  <rect x="850" y="280" width="200" height="60" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="950" y="320" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">StackPanel</text>
  <line x1="900" y1="342" x2="740" y2="405" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah14b)"/>
  <line x1="950" y1="342" x2="950" y2="405" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah14b)"/>
  <line x1="1000" y1="342" x2="1160" y2="405" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah14b)"/>
  <rect x="640" y="410" width="190" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="735" y="447" text-anchor="middle" style="font-size:22px;fill:var(--fg)">TextBlock</text>
  <rect x="855" y="410" width="190" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="950" y="447" text-anchor="middle" style="font-size:22px;fill:var(--fg)">Button</text>
  <rect x="1070" y="410" width="190" height="56" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1165" y="447" text-anchor="middle" style="font-size:22px;fill:var(--fg)">Button</text>
  <text x="950" y="515" text-anchor="middle" style="font-size:21px;fill:var(--muted)">태그 안에 태그 = 부모 안에 자식 (모든 요소의 부모는 하나)</text>
  <text x="620" y="290" text-anchor="middle" style="font-size:40px;fill:var(--accent)">⇒</text>
</svg>`;

  const SVG_EXT = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="마크업 확장의 구조와 리소스 찾기">
  <defs><marker id="ah14c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <g style="${MONO};font-size:32px">
    <text x="470" y="100" text-anchor="end" style="fill:var(--fg)">Background="</text>
    <text x="490" y="100" text-anchor="middle" style="fill:var(--warn);font-weight:700">{</text>
    <text x="515" y="100" style="fill:var(--accent);font-weight:700">StaticResource</text>
    <text x="800" y="100" style="fill:var(--accent2);font-weight:700">MainBrush</text>
    <text x="990" y="100" text-anchor="middle" style="fill:var(--warn);font-weight:700">}</text>
    <text x="1005" y="100" style="fill:var(--fg)">"</text>
  </g>
  <line x1="490" y1="115" x2="490" y2="150" stroke="var(--warn)" stroke-width="3"/>
  <line x1="990" y1="115" x2="990" y2="150" stroke="var(--warn)" stroke-width="3"/>
  <line x1="490" y1="150" x2="990" y2="150" stroke="var(--warn)" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="300" y="185" text-anchor="middle" style="font-size:21px;fill:var(--warn);font-weight:700">{ } = 마크업 확장</text>
  <text x="300" y="212" text-anchor="middle" style="font-size:19px;fill:var(--muted)">"글자 그대로가 아니다"</text>
  <text x="645" y="190" text-anchor="middle" style="font-size:22px;fill:var(--accent);font-weight:700">확장 이름</text>
  <text x="895" y="190" text-anchor="middle" style="font-size:22px;fill:var(--accent2);font-weight:700">인수 (리소스 키)</text>
  <text x="640" y="280" text-anchor="middle" style="font-size:24px;fill:var(--fg);font-weight:700">리소스는 요소에서 부모 쪽으로 올라가며 키를 찾는다</text>
  <rect x="50" y="330" width="220" height="90" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="160" y="385" text-anchor="middle" style="font-size:24px;fill:var(--fg)">Button</text>
  <line x1="275" y1="375" x2="335" y2="375" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah14c)"/>
  <rect x="345" y="330" width="220" height="90" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="455" y="370" text-anchor="middle" style="font-size:22px;fill:var(--fg)">StackPanel</text>
  <text x="455" y="400" text-anchor="middle" style="font-size:18px;fill:var(--muted)">.Resources 없음</text>
  <line x1="570" y1="375" x2="630" y2="375" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah14c)"/>
  <rect x="640" y="330" width="300" height="90" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="790" y="368" text-anchor="middle" style="font-size:22px;fill:var(--ok);font-weight:700">Window.Resources</text>
  <text x="790" y="400" text-anchor="middle" style="font-size:19px;fill:var(--ok)">MainBrush 발견 ✓</text>
  <line x1="945" y1="375" x2="1005" y2="375" stroke="var(--muted)" stroke-width="3" stroke-dasharray="6 6" marker-end="url(#ah14c)"/>
  <rect x="1015" y="330" width="220" height="90" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="1125" y="368" text-anchor="middle" style="font-size:21px;fill:var(--fg)">App.xaml</text>
  <text x="1125" y="398" text-anchor="middle" style="font-size:18px;fill:var(--muted)">(앱 전체 리소스)</text>
  <text x="640" y="490" text-anchor="middle" style="font-size:21px;fill:var(--muted)">끝까지 못 찾으면 실행할 때 XamlParseException — 키 오타 · 정의 순서를 확인</text>
</svg>`;

  const SVG_VIS = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Visibility 세 가지 값 비교">
  <g style="font-size:26px;font-weight:700">
    <text x="50" y="118" style="fill:var(--ok)">Visible</text>
    <text x="50" y="288" style="fill:var(--warn)">Hidden</text>
    <text x="50" y="458" style="fill:var(--danger)">Collapsed</text>
  </g>
  <g style="font-size:28px;font-weight:700" text-anchor="middle">
    <rect x="300" y="65" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="365" y="115" style="fill:var(--fg)">A</text>
    <rect x="450" y="65" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/><text x="515" y="115" style="fill:var(--warn)">B</text>
    <rect x="600" y="65" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="665" y="115" style="fill:var(--fg)">C</text>
    <rect x="300" y="235" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="365" y="285" style="fill:var(--fg)">A</text>
    <rect x="450" y="235" width="130" height="80" rx="10" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="8 6"/><text x="515" y="285" style="fill:var(--muted);font-weight:400;font-size:20px">(빈 자리)</text>
    <rect x="600" y="235" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="665" y="285" style="fill:var(--fg)">C</text>
    <rect x="300" y="405" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="365" y="455" style="fill:var(--fg)">A</text>
    <rect x="450" y="405" width="130" height="80" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="515" y="455" style="fill:var(--fg)">C</text>
  </g>
  <g style="font-size:22px">
    <text x="800" y="100" style="fill:var(--fg)">보인다 · 자리를 차지한다</text>
    <text x="800" y="130" style="fill:var(--muted)">(기본값)</text>
    <text x="800" y="270" style="fill:var(--fg)">안 보인다 · 자리는 그대로 차지</text>
    <text x="800" y="300" style="fill:var(--muted)">(투명 망토를 쓴 것처럼)</text>
    <text x="800" y="440" style="fill:var(--fg)">안 보인다 · 자리도 없어진다</text>
    <text x="800" y="470" style="fill:var(--muted)">(뒤 요소가 앞으로 당겨진다)</text>
  </g>
</svg>`;

  /* ---------- 예제 코드 (본문) ---------- */
  const EX1 = XAML('Ch14Attr', 'Title="특성 구문과 속성 요소 구문" Width="420" Height="280"', `    <StackPanel Margin="20">
        <!-- ① 특성(attribute) 구문: 이름="값" -->
        <Button Content="특성 구문" Background="Orange" Height="40" Margin="0,0,0,10"/>

        <!-- ② 속성 요소(property element) 구문: <형식.속성> 안에 객체를 넣는다 -->
        <Button Height="40" Margin="0,0,0,10">
            <Button.Background>
                <SolidColorBrush Color="Orange"/>
            </Button.Background>
            <Button.Content>
                <TextBlock Text="속성 요소 구문" FontWeight="Bold"/>
            </Button.Content>
        </Button>

        <!-- ③ 한 줄 문자열로 표현할 수 없는 값은 속성 요소로 쓴다 -->
        <Button Content="그라데이션 배경" Height="40" Foreground="White">
            <Button.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0">
                    <LinearGradientBrush.GradientStops>
                        <GradientStop Color="Orange" Offset="0"/>
                        <GradientStop Color="Crimson" Offset="1"/>
                    </LinearGradientBrush.GradientStops>
                </LinearGradientBrush>
            </Button.Background>
        </Button>
    </StackPanel>`) + CB('Ch14Attr');

  const EX2 = XAML('Ch14Content', 'Title="내용 속성과 컬렉션 구문" Width="420" Height="320"', `    <StackPanel Margin="15">
        <!-- 세 버튼은 모두 같다: Content 에 "확인" 을 넣는다 -->
        <Button Content="확인" Margin="0,0,0,6"/>
        <Button Margin="0,0,0,6">확인</Button>
        <Button Margin="0,0,0,6">
            <Button.Content>확인</Button.Content>
        </Button>

        <!-- 내용에는 글자 대신 다른 요소(패널)도 넣을 수 있다 -->
        <Button Margin="0,0,0,12" Padding="6">
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="★" Foreground="Gold" FontSize="18"/>
                <TextBlock Text=" 즐겨찾기에 추가" VerticalAlignment="Center"/>
            </StackPanel>
        </Button>

        <!-- 컬렉션 구문: 자식 요소들이 Children 컬렉션에 차례로 추가된다 -->
        <StackPanel Orientation="Horizontal">
            <StackPanel.Children>   <!-- 보통은 생략한다 -->
                <Button Content="Tom &amp; Jerry" Margin="0,0,6,0"/>
                <Button Content="1 &lt; 2" Margin="0,0,6,0"/>
                <Button Content="&quot;따옴표&quot;"/>
            </StackPanel.Children>
        </StackPanel>
    </StackPanel>`) + CB('Ch14Content');

  const EX3 = XAML('Ch14Brush', 'Title="브러시로 색칠하기" Width="460" Height="400"', `    <StackPanel Margin="15">
        <!-- SolidColorBrush: 한 가지 색으로 칠한다 -->
        <TextBlock Text="SolidColorBrush — 단색" FontWeight="Bold" Margin="0,0,0,4"/>
        <StackPanel Orientation="Horizontal" Margin="0,0,0,14">
            <Border Width="95" Height="44" Margin="0,0,6,0" Background="Tomato">       <!-- 색 이름 -->
                <TextBlock Text="Tomato" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <Border Width="95" Height="44" Margin="0,0,6,0" Background="#FF3366">      <!-- #RRGGBB -->
                <TextBlock Text="#FF3366" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <Border Width="95" Height="44" Margin="0,0,6,0" Background="#80FF3366">    <!-- #AARRGGBB -->
                <TextBlock Text="#80FF3366" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <Border Width="95" Height="44">
                <Border.Background>
                    <SolidColorBrush Color="SteelBlue" Opacity="0.5"/>
                </Border.Background>
                <TextBlock Text="Opacity 0.5" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
        </StackPanel>

        <!-- LinearGradientBrush: StartPoint 에서 EndPoint 방향으로 색이 바뀐다 -->
        <TextBlock Text="LinearGradientBrush — 선형 그라데이션" FontWeight="Bold" Margin="0,0,0,4"/>
        <Border Height="44" Margin="0,0,0,8">                                        <!-- 가로 -->
            <Border.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0">
                    <LinearGradientBrush.GradientStops>
                        <GradientStop Color="Gold" Offset="0"/>
                        <GradientStop Color="OrangeRed" Offset="1"/>
                    </LinearGradientBrush.GradientStops>
                </LinearGradientBrush>
            </Border.Background>
        </Border>
        <Border Height="80">                                                          <!-- 세로 · 색 3개 -->
            <Border.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="0,1">
                    <LinearGradientBrush.GradientStops>
                        <GradientStop Color="SkyBlue" Offset="0"/>
                        <GradientStop Color="White" Offset="0.5"/>
                        <GradientStop Color="SeaGreen" Offset="1"/>
                    </LinearGradientBrush.GradientStops>
                </LinearGradientBrush>
            </Border.Background>
            <TextBlock Text="위 → 아래 (0,0 → 0,1)" HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
    </StackPanel>`) + CB('Ch14Brush');

  const EX4 = XAML('Ch14Margin', 'Title="Margin 과 Padding" Width="460" Height="420"', `    <StackPanel x:Name="panel" Background="LightGray">
        <!-- 1) 값 하나: 네 방향 모두 같은 값 -->
        <Button Content='Margin="20"' Margin="20"/>

        <!-- 2) 값 둘: 좌우, 상하 -->
        <Button Content='Margin="60,5"' Margin="60,5"/>

        <!-- 3) 값 넷: 왼쪽, 위, 오른쪽, 아래 (왼쪽부터 시계 방향) -->
        <Button Content='Margin="0,10,160,10"' Margin="0,10,160,10"/>

        <!-- Padding: 테두리와 내용 사이의 안쪽 여백 -->
        <Button Content='Padding="5"' Padding="5" Margin="20,5" HorizontalAlignment="Left"/>
        <Button Content='Padding="30,10"' Padding="30,10" Margin="20,5" HorizontalAlignment="Left"/>

        <Border Margin="20,10" Padding="15" Background="White"
                BorderBrush="SteelBlue" BorderThickness="2,2,2,6">
            <TextBlock Text="Border: Padding 15, BorderThickness 2,2,2,6"/>
        </Border>
        <!-- 4) 마지막 버튼은 C# 코드에서 new Thickness(…) 로 만든다 -->
    </StackPanel>`) + `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch14Margin
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // XAML 의 Margin="40,0,40,10" 과 같다 (왼, 위, 오, 아래)
            var button = new Button();
            button.Content = "C#: new Thickness(40, 0, 40, 10)";
            button.Margin = new Thickness(40, 0, 40, 10);
            button.Padding = new Thickness(8);          // 값 하나 = 네 방향 모두 8
            panel.Children.Add(button);
        }
    }
}`;

  const EX5 = XAML('Ch14Compare', 'Title="같은 화면, 두 가지 방법" Width="500" Height="240"', `    <StackPanel Orientation="Horizontal" Margin="10">
        <!-- 왼쪽: XAML 로 선언한 화면 -->
        <Border Width="220" Margin="5" Padding="10" CornerRadius="6"
                BorderBrush="SteelBlue" BorderThickness="2">
            <StackPanel>
                <TextBlock Text="XAML 로 만든 화면" FontSize="16" FontWeight="Bold" Foreground="SteelBlue"/>
                <TextBox Text="이름을 입력" Margin="0,10,0,0"/>
                <Button Content="확인" Margin="0,10,0,0" Padding="10,4" Background="LightSkyBlue"/>
            </StackPanel>
        </Border>

        <!-- 오른쪽: 빈 Border. 안의 내용은 C# 코드 비하인드가 채운다 -->
        <Border x:Name="rightBorder" Width="220" Margin="5" Padding="10" CornerRadius="6"
                BorderBrush="Tomato" BorderThickness="2"/>
    </StackPanel>`) + `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch14Compare
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // <StackPanel>
            var panel = new StackPanel();

            // <TextBlock Text="…" FontSize="16" FontWeight="Bold" Foreground="Tomato"/>
            var title = new TextBlock();
            title.Text = "C# 으로 만든 화면";
            title.FontSize = 16;
            title.FontWeight = FontWeights.Bold;
            title.Foreground = Brushes.Tomato;
            panel.Children.Add(title);                  // 자식 추가 = 태그 안에 태그

            // <TextBox Text="이름을 입력" Margin="0,10,0,0"/>
            var box = new TextBox { Text = "이름을 입력", Margin = new Thickness(0, 10, 0, 0) };
            panel.Children.Add(box);

            // <Button Content="확인" Margin="0,10,0,0" Padding="10,4" Background="LightSalmon"/>
            var button = new Button
            {
                Content = "확인",
                Margin = new Thickness(0, 10, 0, 0),
                Padding = new Thickness(10, 4, 10, 4),
                Background = Brushes.LightSalmon
            };
            panel.Children.Add(button);

            rightBorder.Child = panel;                  // Border 의 내용 속성은 Child
        }
    }
}`;

  /* ---------- 실습 (14-1 섹션) ---------- */
  const P1_STARTER = XAML('Ch14Practice1', 'Title="게임 시작 화면" Width="400" Height="300"', `    <StackPanel Margin="20">
        <!-- TODO 1: 제목 TextBlock — Text 는 "Tom & Jerry 게임" (& 는 어떻게 쓸까?)
                     FontSize 24, FontWeight Bold, HorizontalAlignment Center -->

        <!-- TODO 2: "시작하기" 버튼 — Margin 좌우 40 · 상하 10, Padding 10
                     Background 는 속성 요소 구문으로 LinearGradientBrush (Gold → OrangeRed, 가로) -->

        <!-- TODO 3: "종료" 버튼 — Margin 좌우 40, Background #607D8B, Foreground White -->
    </StackPanel>`) + CB('Ch14Practice1');

  const P1_SOLUTION = XAML('Ch14Practice1', 'Title="게임 시작 화면" Width="400" Height="300"', `    <StackPanel Margin="20">
        <!-- 1: & 는 &amp; 로 쓴다 -->
        <TextBlock Text="Tom &amp; Jerry 게임" FontSize="24" FontWeight="Bold"
                   HorizontalAlignment="Center" Margin="0,0,0,10"/>

        <!-- 2: 속성 요소 구문으로 그라데이션 배경 -->
        <Button Content="시작하기" Margin="40,10" Padding="10" FontSize="16">
            <Button.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0">
                    <LinearGradientBrush.GradientStops>
                        <GradientStop Color="Gold" Offset="0"/>
                        <GradientStop Color="OrangeRed" Offset="1"/>
                    </LinearGradientBrush.GradientStops>
                </LinearGradientBrush>
            </Button.Background>
        </Button>

        <!-- 3: 형식 변환기가 "#607D8B" 를 브러시로 바꿔 준다 -->
        <Button Content="종료" Margin="40,0" Padding="6" Background="#607D8B" Foreground="White"/>
    </StackPanel>`) + CB('Ch14Practice1');

  const P2_STARTER = XAML('Ch14Practice2', 'Title="오늘의 할 일" Width="360" Height="260"', `    <!-- 이 StackPanel 의 내용은 C# 코드 비하인드에서 채운다 -->
    <StackPanel x:Name="root" Margin="15"/>`) + `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch14Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // TODO 1: TextBlock "오늘의 할 일" (FontSize 18, Bold) 을 만들어 root 에 추가
            // TODO 2: CheckBox "C# 복습" (Margin 0,8,0,0) 추가
            // TODO 3: CheckBox "XAML 예제 따라 하기" (Margin 0,4,0,0, IsChecked true) 추가
            // TODO 4: Button "저장" (Margin 0,12,0,0, Background LightGreen) 추가
        }
    }
}`;

  const P2_SOLUTION = XAML('Ch14Practice2', 'Title="오늘의 할 일" Width="360" Height="260"', `    <!-- 이 StackPanel 의 내용은 C# 코드 비하인드에서 채운다 -->
    <StackPanel x:Name="root" Margin="15"/>`) + `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace Ch14Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // <TextBlock Text="오늘의 할 일" FontSize="18" FontWeight="Bold"/>
            var title = new TextBlock { Text = "오늘의 할 일", FontSize = 18, FontWeight = FontWeights.Bold };
            root.Children.Add(title);

            // <CheckBox Content="C# 복습" Margin="0,8,0,0"/>
            var check1 = new CheckBox { Content = "C# 복습", Margin = new Thickness(0, 8, 0, 0) };
            root.Children.Add(check1);

            // <CheckBox Content="XAML 예제 따라 하기" Margin="0,4,0,0" IsChecked="True"/>
            var check2 = new CheckBox { Content = "XAML 예제 따라 하기", Margin = new Thickness(0, 4, 0, 0), IsChecked = true };
            root.Children.Add(check2);

            // <Button Content="저장" Margin="0,12,0,0" Background="LightGreen"/>
            var save = new Button { Content = "저장", Margin = new Thickness(0, 12, 0, 0), Background = Brushes.LightGreen };
            root.Children.Add(save);
        }
    }
}`;

  /* ---------- 예제 코드 (14-2 섹션) ---------- */
  const EX6 = XAML('Ch14Resource', 'Title="리소스 · x:Static · x:Null" Width="440" Height="400"', `    <!-- 리소스: x:Key 로 이름을 붙여 등록해 두고 여러 곳에서 꺼내 쓴다 -->
    <Window.Resources>
        <SolidColorBrush x:Key="MainBrush" Color="#3F51B5"/>
        <SolidColorBrush x:Key="LightBrush" Color="#E8EAF6"/>
        <sys:Double x:Key="TitleSize">20</sys:Double>
    </Window.Resources>

    <StackPanel Margin="15" Background="{StaticResource LightBrush}">
        <TextBlock Text="회원 메뉴" Margin="10" FontWeight="Bold"
                   FontSize="{StaticResource TitleSize}" Foreground="{StaticResource MainBrush}"/>
        <Button Content="내 정보" Margin="10,3" Padding="4"
                Background="{StaticResource MainBrush}" Foreground="White"/>
        <Button Content="주문 내역" Margin="10,3" Padding="4"
                Background="{StaticResource MainBrush}" Foreground="White"/>
        <Button Content="로그아웃" Margin="10,3" Padding="4"
                Background="{StaticResource MainBrush}" Foreground="White"/>

        <!-- x:Static: 클래스의 static 속성 값 (Windows 의 선택 강조색) -->
        <Border Margin="10,12,10,3" Padding="8" Background="{x:Static SystemColors.HighlightBrush}">
            <TextBlock Text="SystemColors.HighlightBrush" Foreground="White"/>
        </Border>

        <!-- x:Null: '값 없음(null)' — 배경 브러시를 지운다 -->
        <Button Content="Background = {x:Null}" Margin="10,3,10,10" Padding="4" Background="{x:Null}"/>
    </StackPanel>`, SYS) + CB('Ch14Resource');

  const EX7 = XAML('Ch14Binding', 'Title="슬라이더로 글자 크기 바꾸기" Width="460" Height="300"', `    <StackPanel Margin="20">
        <!-- 1) 값을 제공하는 쪽: 이름(x:Name)을 붙인 슬라이더 -->
        <Slider x:Name="sizeSlider" Minimum="10" Maximum="48" Value="16"
                TickFrequency="2" IsSnapToTickEnabled="True"/>

        <!-- 2) 값을 받는 쪽: sizeSlider 의 Value 속성을 가져와 쓴다 -->
        <TextBlock Margin="0,6,0,0" Foreground="Gray"
                   Text="{Binding ElementName=sizeSlider, Path=Value, StringFormat='현재 크기: {0}'}"/>
        <TextBlock Text="안녕하세요, XAML!" Margin="0,10,0,0" TextWrapping="Wrap"
                   FontSize="{Binding ElementName=sizeSlider, Path=Value}"/>
    </StackPanel>`) + CB('Ch14Binding');

  const EX8 = XAML('Ch14Common', 'Title="자주 쓰는 공통 속성" Width="480" Height="400"', `    <StackPanel Margin="15">
        <!-- 크기와 정렬: Width 가 없으면 Stretch(가득 채움) -->
        <Button Content="Left" Width="120" HorizontalAlignment="Left"/>
        <Button Content="Center" Width="120" HorizontalAlignment="Center" Margin="0,4"/>
        <Button Content="Right" Width="120" HorizontalAlignment="Right"/>
        <Button Content="Stretch (Width 없음)" Margin="0,4,0,12"/>

        <!-- 투명도(0~1)와 사용 가능 여부 -->
        <StackPanel Orientation="Horizontal" Margin="0,0,0,12">
            <Button Content="Opacity 1" Width="110" Margin="0,0,6,0"/>
            <Button Content="Opacity 0.4" Width="110" Margin="0,0,6,0" Opacity="0.4"/>
            <Button Content="IsEnabled False" Width="110" IsEnabled="False"/>
        </StackPanel>

        <!-- 도움말 풍선과 마우스 커서 -->
        <Button Content="마우스를 올려 보세요" MinWidth="200" HorizontalAlignment="Left" Padding="6"
                ToolTip="ToolTip: 짧은 도움말이 나타납니다" Cursor="Hand" Margin="0,0,0,12"/>

        <!-- 글꼴 -->
        <TextBlock Text="맑은 고딕 · 18 · Bold" FontFamily="Malgun Gothic" FontSize="18"
                   FontWeight="Bold" Foreground="DarkSlateBlue"/>
        <TextBlock Text="Consolas · Italic · 배경색" FontFamily="Consolas" FontStyle="Italic"
                   Background="LightYellow" Margin="0,4,0,0"/>
    </StackPanel>`) + CB('Ch14Common');

  const EX9 = XAML('Ch14Visibility', 'Title="Visible · Hidden · Collapsed" Width="440" Height="380"', `    <StackPanel Margin="15">
        <TextBlock Text="Visible — 보인다 (기본값)" FontWeight="Bold"/>
        <StackPanel Orientation="Horizontal" Margin="0,4,0,14">
            <Button Content="A" Width="80"/>
            <Button Content="B" Width="80" Background="Gold" Visibility="Visible"/>
            <Button Content="C" Width="80"/>
        </StackPanel>

        <TextBlock Text="Hidden — 안 보이지만 자리는 차지한다" FontWeight="Bold"/>
        <StackPanel Orientation="Horizontal" Margin="0,4,0,14">
            <Button Content="A" Width="80"/>
            <Button Content="B" Width="80" Background="Gold" Visibility="Hidden"/>
            <Button Content="C" Width="80"/>
        </StackPanel>

        <TextBlock Text="Collapsed — 안 보이고 자리도 없어진다" FontWeight="Bold"/>
        <StackPanel Orientation="Horizontal" Margin="0,4,0,14">
            <Button Content="A" Width="80"/>
            <Button Content="B" Width="80" Background="Gold" Visibility="Collapsed"/>
            <Button Content="C" Width="80"/>
        </StackPanel>

        <!-- 직접 바꿔 보기 -->
        <StackPanel Orientation="Horizontal" Background="WhiteSmoke">
            <Button Content="X" Width="80"/>
            <Button x:Name="target" Content="B" Width="80" Background="Gold"/>
            <Button Content="Y" Width="80"/>
        </StackPanel>
        <Button Content="B 의 Visibility 바꾸기" Click="btnToggle_Click" Margin="0,8,0,0" Padding="4"/>
        <TextBlock x:Name="txtState" Text="현재: Visible" Margin="0,4,0,0" Foreground="Gray"/>
    </StackPanel>`) + `// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch14Visibility
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnToggle_Click(object sender, RoutedEventArgs e)
        {
            // Visible → Hidden → Collapsed → Visible … 순서로 바꾼다
            if (target.Visibility == Visibility.Visible)
                target.Visibility = Visibility.Hidden;
            else if (target.Visibility == Visibility.Hidden)
                target.Visibility = Visibility.Collapsed;
            else
                target.Visibility = Visibility.Visible;

            txtState.Text = "현재: " + target.Visibility;
        }
    }
}`;

  const EX10 = XAML('Ch14Inline', 'Title="TextBlock 인라인 서식" Width="460" Height="400"', `    <StackPanel Margin="15">
        <!-- 한 TextBlock 안에서 부분마다 다른 서식: Run · Bold · Italic · Underline · LineBreak -->
        <TextBlock FontSize="16">
            <Run Text="공지: "/><Bold><Run Text="XAML 기초" Foreground="Crimson"/></Bold><Run Text=" 수업은"/>
            <LineBreak/>
            <Italic><Run Text="실습 위주"/></Italic><Run Text="로 진행합니다."/>
            <LineBreak/>
            <Underline><Run Text="준비물: 노트북"/></Underline><Run Text=" (충전기 포함)" FontSize="12" Foreground="Gray"/>
        </TextBlock>

        <!-- TextWrapping: 긴 글을 너비에 맞춰 줄 바꿈할지 -->
        <TextBlock Margin="0,16,0,0" Background="LightYellow" TextWrapping="NoWrap"
                   Text="NoWrap(기본값): 긴 문장은 줄이 바뀌지 않고 오른쪽이 잘려서 끝까지 보이지 않습니다."/>
        <TextBlock Margin="0,6,0,0" Background="LightYellow" TextWrapping="Wrap"
                   Text="Wrap: 긴 문장은 너비에 맞춰 자동으로 줄이 바뀌어서 끝까지 잘 보입니다."/>

        <!-- TextAlignment: 글자를 TextBlock 안에서 어느 쪽에 맞출지 -->
        <TextBlock Margin="0,6,0,0" Background="Honeydew" TextWrapping="Wrap" TextAlignment="Center"
                   Text="TextAlignment=Center — 여러 줄 글자를 모두 가운데에 맞춥니다."/>
        <TextBlock Margin="0,6,0,0" Background="Honeydew" TextAlignment="Right"
                   Text="TextAlignment=Right — 오른쪽 정렬"/>
    </StackPanel>`) + CB('Ch14Inline');

  /* ---------- 실습 (14-2 섹션) ---------- */
  const P3_STARTER = XAML('Ch14Practice3', 'Title="나의 명함" Width="420" Height="300"', `    <Window.Resources>
        <SolidColorBrush x:Key="PointBrush" Color="#00796B"/>
        <!-- TODO 1: 카드 배경용 SolidColorBrush (x:Key="CardBrush", Color="#F1F8E9") 추가 -->
    </Window.Resources>

    <Grid Background="#ECEFF1">
        <!-- TODO 2: Border — Width 320, 가운데 정렬(가로·세로), CornerRadius 12, Padding 20,
                     Background 는 {StaticResource CardBrush}, BorderBrush 는 {StaticResource PointBrush}, BorderThickness 2 -->
        <!-- TODO 3: Border 안에 StackPanel, 그 안에
                     ① 이름(Bold, FontSize 22)과 직함(Italic, 회색)을 한 TextBlock 에 LineBreak 로 두 줄로
                     ② 연락처 TextBlock 두 개 (Margin 위 10), 각각 ToolTip 으로 설명 달기 -->
    </Grid>`) + CB('Ch14Practice3');

  const P3_SOLUTION = XAML('Ch14Practice3', 'Title="나의 명함" Width="420" Height="300"', `    <Window.Resources>
        <SolidColorBrush x:Key="PointBrush" Color="#00796B"/>
        <SolidColorBrush x:Key="CardBrush" Color="#F1F8E9"/>
    </Window.Resources>

    <Grid Background="#ECEFF1">
        <Border Width="320" HorizontalAlignment="Center" VerticalAlignment="Center"
                CornerRadius="12" Padding="20" BorderThickness="2"
                Background="{StaticResource CardBrush}" BorderBrush="{StaticResource PointBrush}">
            <StackPanel>
                <TextBlock>
                    <Bold><Run Text="홍길동" FontSize="22" Foreground="#00796B"/></Bold>
                    <LineBreak/>
                    <Italic><Run Text="WPF 개발자 · 교육팀" Foreground="Gray"/></Italic>
                </TextBlock>
                <TextBlock Text="✉ gildong@example.com" Margin="0,10,0,0" ToolTip="이메일" Cursor="Hand"/>
                <TextBlock Text="☎ 010-1234-5678" Margin="0,4,0,0" ToolTip="휴대전화"/>
            </StackPanel>
        </Border>
    </Grid>`) + CB('Ch14Practice3');

  const P4_STARTER = XAML('Ch14Practice4', 'Title="투명도 조절" Width="400" Height="300"', `    <StackPanel Margin="20">
        <!-- 0 ~ 1 사이 값을 고르는 슬라이더 -->
        <Slider x:Name="opacitySlider" Minimum="0" Maximum="1" Value="1"
                TickFrequency="0.1" IsSnapToTickEnabled="True"/>

        <!-- TODO 1: 슬라이더 값을 "투명도: 1.0" 처럼 보여 주기 (Binding + StringFormat='투명도: {0:F1}') -->
        <TextBlock Text="투명도: ?" Margin="0,6,0,10"/>

        <!-- TODO 2: 이 Border 의 Opacity 를 슬라이더 Value 에 바인딩 -->
        <Border Height="150" CornerRadius="10" Background="MediumPurple">
            <TextBlock Text="사라져라!" FontSize="28" Foreground="White"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
    </StackPanel>`) + CB('Ch14Practice4');

  const P4_SOLUTION = XAML('Ch14Practice4', 'Title="투명도 조절" Width="400" Height="300"', `    <StackPanel Margin="20">
        <Slider x:Name="opacitySlider" Minimum="0" Maximum="1" Value="1"
                TickFrequency="0.1" IsSnapToTickEnabled="True"/>

        <TextBlock Margin="0,6,0,10"
                   Text="{Binding ElementName=opacitySlider, Path=Value, StringFormat='투명도: {0:F1}'}"/>

        <Border Height="150" CornerRadius="10" Background="MediumPurple"
                Opacity="{Binding ElementName=opacitySlider, Path=Value}">
            <TextBlock Text="사라져라!" FontSize="28" Foreground="White"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Border>
    </StackPanel>`) + CB('Ch14Practice4');

  /* ---------- 슬라이드용 짧은 코드 ---------- */
  const S1 = XAML('Ch14S1', 'Title="특성 vs 속성 요소" Width="380" Height="200"', `    <StackPanel Margin="20">
        <Button Content="특성 구문" Background="Orange" Height="40"/>
        <Button Height="40" Margin="0,10,0,0">
            <Button.Background>
                <SolidColorBrush Color="Orange"/>
            </Button.Background>
            <Button.Content>
                <TextBlock Text="속성 요소 구문" FontWeight="Bold"/>
            </Button.Content>
        </Button>
    </StackPanel>`) + CBS('Ch14S1');

  const S2 = XAML('Ch14S2', 'Title="내용 속성" Width="380" Height="260"', `    <StackPanel Margin="15">
        <Button Content="확인" Margin="0,0,0,6"/>
        <Button Margin="0,0,0,6">확인</Button>
        <Button Margin="0,0,0,6" Padding="6">
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="★" Foreground="Gold" FontSize="18"/>
                <TextBlock Text=" 즐겨찾기" VerticalAlignment="Center"/>
            </StackPanel>
        </Button>
        <Button Content="Tom &amp; Jerry"/>
    </StackPanel>`) + CBS('Ch14S2');

  const S4 = XAML('Ch14S4', 'Title="Margin 과 Padding" Width="400" Height="300"', `    <StackPanel Background="LightGray">
        <Button Content='Margin="20"' Margin="20"/>
        <Button Content='Margin="60,5"' Margin="60,5"/>
        <Button Content='Margin="0,10,160,10"' Margin="0,10,160,10"/>
        <Button Content='Padding="30,10"' Padding="30,10" Margin="20,5"
                HorizontalAlignment="Left"/>
    </StackPanel>`) + CBS('Ch14S4');

  const S5 = XAML('Ch14S5', 'Title="리소스" Width="380" Height="260"', `    <Window.Resources>
        <SolidColorBrush x:Key="MainBrush" Color="#3F51B5"/>
        <sys:Double x:Key="TitleSize">20</sys:Double>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="회원 메뉴" FontSize="{StaticResource TitleSize}"
                   Foreground="{StaticResource MainBrush}"/>
        <Button Content="내 정보" Margin="0,6" Foreground="White"
                Background="{StaticResource MainBrush}"/>
        <Button Content="주문 내역" Foreground="White"
                Background="{StaticResource MainBrush}"/>
    </StackPanel>`, SYS) + CBS('Ch14S5');

  const S6 = XAML('Ch14S6', 'Title="Binding 맛보기" Width="420" Height="240"', `    <StackPanel Margin="20">
        <Slider x:Name="sizeSlider" Minimum="10" Maximum="48" Value="16"
                TickFrequency="2" IsSnapToTickEnabled="True"/>
        <TextBlock Foreground="Gray"
                   Text="{Binding ElementName=sizeSlider, Path=Value, StringFormat='현재 크기: {0}'}"/>
        <TextBlock Text="안녕하세요, XAML!" TextWrapping="Wrap"
                   FontSize="{Binding ElementName=sizeSlider, Path=Value}"/>
    </StackPanel>`) + CBS('Ch14S6');

  const S7 = XAML('Ch14S7', 'Title="x:Static · x:Null" Width="380" Height="200"', `    <StackPanel Margin="20">
        <Border Padding="8" Background="{x:Static SystemColors.HighlightBrush}">
            <TextBlock Text="SystemColors.HighlightBrush" Foreground="White"/>
        </Border>
        <Button Content="Background = {x:Null}" Margin="0,10,0,0"
                Padding="4" Background="{x:Null}"/>
    </StackPanel>`) + CBS('Ch14S7');

  const S9 = XAML('Ch14S9', 'Title="인라인 서식" Width="420" Height="240"', `    <StackPanel Margin="15">
        <TextBlock FontSize="16">
            <Run Text="공지: "/><Bold><Run Text="XAML 기초" Foreground="Crimson"/></Bold>
            <LineBreak/>
            <Italic><Run Text="실습 위주"/></Italic><Run Text="로 진행합니다."/>
            <LineBreak/>
            <Underline><Run Text="준비물: 노트북"/></Underline>
        </TextBlock>
        <TextBlock Margin="0,12,0,0" Background="LightYellow" TextWrapping="Wrap"
                   TextAlignment="Center"
                   Text="Wrap + Center: 긴 문장은 너비에 맞춰 줄이 바뀌고 가운데로 정렬됩니다."/>
    </StackPanel>`) + CBS('Ch14S9');

  CS_COURSE.addChapter({
    id: 'ch14',
    no: '14',
    title: 'XAML 기초',
    subtitle: 'XAML Basics',
    summary: 'WPF 화면을 선언하는 언어 XAML 의 문법(요소 · 특성 · 속성 요소 · 내용 속성 · 형식 변환기)을 익히고, 마크업 확장({StaticResource} · {Binding} · {x:Static} · {x:Null})과 모든 컨트롤이 공유하는 공통 속성(크기 · 여백 · 정렬 · Visibility · 글꼴 …), TextBlock 인라인 서식을 배웁니다.',
    goals: [
      'XAML 요소와 특성이 C# 객체 · 속성에 어떻게 대응하는지 설명할 수 있다',
      '특성 구문 · 속성 요소 구문 · 내용 속성 · 컬렉션 구문을 구분해 쓸 수 있다',
      '형식 변환기가 바꿔 주는 값(색 · Thickness · 글꼴 등)을 올바른 형식으로 적을 수 있다',
      '{StaticResource} · {Binding ElementName} · {x:Static} · {x:Null} 마크업 확장을 사용할 수 있다',
      '공통 속성(Width · Margin · Alignment · Visibility · Opacity · 글꼴 등)과 TextBlock 인라인으로 화면을 꾸밀 수 있다'
    ],
    sections: [
      /* ===================== ch14-1 ===================== */
      {
        id: 'ch14-1',
        title: 'XAML 문법',
        minutes: 50,
        goals: [
          'XAML 이 XML 기반의 선언형 언어이며 요소 하나가 객체 하나임을 설명할 수 있다',
          '루트 요소의 xmlns · xmlns:x · x:Class 가 하는 일을 말할 수 있다',
          '특성 구문, 속성 요소 구문, 내용 속성, 컬렉션 구문을 구분해 쓸 수 있다',
          '형식 변환기 문자열(색 · Thickness)과 XML 규칙(대소문자 · 닫는 태그 · 특수 문자)을 지킬 수 있다',
          '같은 화면을 XAML 과 C# 코드로 각각 만들고 논리 트리로 설명할 수 있다'
        ],
        flow: [['도입: 화면을 글로 그린다', 5], ['XAML 과 루트 요소 · xmlns', 8], ['특성 · 속성 요소 · 내용 · 컬렉션 구문', 15], ['형식 변환기 · 브러시 · Margin', 10], ['XML 규칙 · XAML ↔ C# · 논리 트리', 7], ['퀴즈 · 실습', 5]],
        content: [
          { type: 'h', text: 'XAML 이란?' },
          { type: 'p', html: '<b>XAML(재믈, eXtensible Application Markup Language)</b> 은 WPF 의 화면을 만드는 <b>XML 기반의 선언형(declarative) 언어</b>입니다. “버튼을 만들고, 크기를 정하고, 창에 붙여라” 처럼 <b>순서대로 명령</b>하는 C# 과 달리, XAML 은 “<b>이 창에는 이런 버튼이 있다</b>” 처럼 <b>결과 모습을 적어 두는</b> 방식입니다. 웹 페이지를 HTML 로 적는 것과 비슷합니다.' },
          { type: 'p', html: 'XAML 의 핵심 규칙은 딱 하나입니다. <mark><b>요소(element) 하나 = 객체 하나, 특성(attribute) 하나 = 속성 하나</b></mark>. <code>&lt;Button Content="확인"/&gt;</code> 이라고 쓰면 실행할 때 <code>new Button()</code> 으로 객체가 만들어지고 <code>Content</code> 속성에 <code>"확인"</code> 이 들어갑니다.' },
          { type: 'figure', html: SVG_XAML2OBJ, caption: 'XAML 요소는 객체가 되고, 특성은 그 객체의 속성 값이 된다' },
          { type: 'list', items: [
            '<b>화면(XAML)</b> 과 <b>동작(C#)</b> 을 나눠서, 디자이너와 개발자가 함께 일하기 쉽습니다.',
            '태그가 겹겹이 들어가는 구조가 <b>화면의 포함 관계</b>(창 안의 패널 안의 버튼)를 그대로 보여 줍니다.',
            'Visual Studio 디자이너, 속성 창, 핫 리로드 같은 도구가 XAML 을 읽고 고쳐 줍니다.',
            'XAML 로 할 수 있는 일은 모두 C# 으로도 할 수 있습니다. XAML 은 “객체를 만드는 더 읽기 쉬운 방법”일 뿐입니다.'
          ] },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 XAML 편집하기', html: '<ol><li><b>WPF 애플리케이션</b> 프로젝트를 만들면 <code>MainWindow.xaml</code> 이 <b>디자이너(위)</b> + <b>XAML 편집기(아래)</b> 로 나뉘어 열립니다. 창 사이의 ⇅ 단추로 위아래/좌우 배치를 바꿀 수 있습니다.</li><li>XAML 편집기에서 <code>&lt;Bu</code> 까지 치면 <b>IntelliSense</b> 가 <code>Button</code> 을 제안합니다. 특성 이름과 값(<code>Background="</code> 뒤의 색 목록)도 제안해 줍니다.</li><li>디자이너에서 요소를 선택하고 <b>속성 창</b>(<kbd>F4</kbd>)에서 값을 바꾸면 XAML 에 특성이 자동으로 추가됩니다. 반대로 XAML 을 고치면 디자이너가 바로 바뀝니다.</li><li>실행 중에 XAML 을 고치고 저장하면 <b>XAML 핫 리로드</b>로 실행 중인 창에 즉시 반영됩니다.</li></ol>' },

          { type: 'h', text: '루트 요소와 xmlns' },
          { type: 'p', html: 'XAML 파일에는 <b>루트(root) 요소가 딱 하나</b> 있습니다. 창을 만드는 <code>MainWindow.xaml</code> 의 루트는 <code>&lt;Window&gt;</code> 입니다. 루트 요소에는 항상 다음 특성이 붙습니다.' },
          { type: 'table', head: ['특성', '뜻', '없으면?'], rows: [
            ['<code>xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"</code>', '<b>기본 네임스페이스</b>. 접두사 없는 태그(<code>Window</code>, <code>Button</code>, <code>StackPanel</code> …)를 WPF 컨트롤로 해석', '<code>Button</code> 이 무엇인지 몰라 오류'],
            ['<code>xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"</code>', '<b>XAML 언어 자체의 기능</b>을 <code>x:</code> 접두사로 사용 (<code>x:Class</code>, <code>x:Name</code>, <code>x:Key</code>, <code>x:Null</code> …)', '<code>x:Name</code> 등을 쓸 수 없음'],
            ['<code>x:Class="MyApp.MainWindow"</code>', '이 XAML 과 짝이 되는 <b>코드 비하인드 클래스</b>(네임스페이스.클래스). <code>MainWindow.xaml.cs</code> 의 <code>partial class MainWindow</code> 와 이름이 같아야 함', '이벤트 처리기 · 이름 붙인 요소를 C# 에서 못 씀'],
            ['<code>Title</code> · <code>Width</code> · <code>Height</code>', 'Window 객체의 일반 속성', '기본값 사용']
          ], caption: 'MainWindow.xaml 루트 요소에 붙는 특성' },
          { type: 'p', html: 'xmlns 의 주소는 인터넷 주소처럼 생겼지만 실제로 접속하지는 않습니다. “이 이름표 묶음을 쓰겠다”는 <b>고유한 이름</b>일 뿐입니다. C# 의 <code>using System.Windows.Controls;</code> 와 같은 역할이라고 생각하면 됩니다.' },
          { type: 'callout', kind: 'info', title: 'Visual Studio 템플릿에 더 붙어 있는 것들', html: 'Visual Studio 가 만들어 주는 <code>MainWindow.xaml</code> 에는 <code>xmlns:d</code>, <code>xmlns:mc</code>, <code>mc:Ignorable="d"</code>, <code>xmlns:local="clr-namespace:MyApp"</code> 도 들어 있습니다. <code>d:</code> 는 <b>디자이너에서만 쓰는 값</b>(예: <code>d:DesignHeight</code>), <code>local:</code> 은 <b>내 프로젝트의 클래스</b>를 XAML 에서 쓰기 위한 접두사입니다. 지우지 말고 그대로 두면 됩니다. 이 강좌 예제에서는 짧게 보이려고 꼭 필요한 두 xmlns 만 적습니다.' },

          { type: 'h', text: '특성 구문과 속성 요소 구문' },
          { type: 'p', html: '속성 값을 주는 방법은 두 가지입니다. <b>특성 구문(attribute syntax)</b> 은 <code>이름="값"</code> 으로 <b>한 줄에</b> 적습니다. 값이 문자열 하나로 표현되지 않는 복잡한 객체(그라데이션, 패널 등)일 때는 <b>속성 요소 구문(property element syntax)</b> 으로 <code>&lt;형식이름.속성이름&gt;</code> 태그를 열고 그 안에 객체를 넣습니다.' },
          { type: 'code', title: '예제 14-1. 특성 구문 vs 속성 요소 구문', code: EX1, desc: '<code>①</code> 과 <code>②</code> 는 <b>똑같은 주황색 배경</b>입니다. 특성 구문의 <code>"Orange"</code> 를 XAML 이 <code>SolidColorBrush</code> 객체로 바꿔 주기 때문입니다. <code>②</code> 는 <code>Content</code> 에 문자열 대신 <b>굵은 TextBlock 객체</b>를 넣었습니다. <code>③</code> 의 그라데이션은 색이 여러 개라 한 줄 문자열로는 쓸 수 없으므로 속성 요소 구문만 가능합니다. 속성 요소 태그의 이름은 반드시 <code>Button.Background</code> 처럼 <b>형식 이름.속성 이름</b>입니다.' },
          { type: 'callout', kind: 'tip', title: '언제 어떤 구문을 쓸까?', html: '값이 <b>짧은 문자열로 표현되면 특성 구문</b>(<code>Width="100"</code>, <code>Background="Red"</code>)이 읽기 쉽습니다. 값이 <b>여러 개의 객체로 이루어져 있으면 속성 요소 구문</b>을 씁니다. 한 속성을 두 가지 방법으로 <b>동시에</b> 주면(<code>Background="Red"</code> + <code>&lt;Button.Background&gt;</code>) 오류입니다.' },

          { type: 'h', text: '내용 속성 (Content Property)' },
          { type: 'p', html: '대부분의 요소에는 <b>“태그 사이에 넣은 것은 이 속성으로 간다”</b>고 정해진 <b>내용 속성</b>이 하나 있습니다. <code>Button</code> 의 내용 속성은 <code>Content</code> 이므로 <code>&lt;Button&gt;확인&lt;/Button&gt;</code> 은 <code>&lt;Button Content="확인"/&gt;</code> 과 <b>완전히 같습니다</b>.' },
          { type: 'table', head: ['요소', '내용 속성', '넣을 수 있는 것'], rows: [
            ['<code>Window</code>, <code>Button</code>, <code>Label</code>, <code>CheckBox</code>', '<code>Content</code>', '<b>하나만</b> (문자열 또는 요소 하나)'],
            ['<code>StackPanel</code>, <code>Grid</code>, <code>WrapPanel</code> (패널)', '<code>Children</code>', '<b>여러 개</b> (차례로 추가)'],
            ['<code>Border</code>', '<code>Child</code>', '요소 하나'],
            ['<code>TextBlock</code>', '<code>Text</code> / <code>Inlines</code>', '글자, 또는 <code>Run</code> · <code>Bold</code> 같은 인라인(14-2)'],
            ['<code>ListBox</code>, <code>ComboBox</code>', '<code>Items</code>', '항목 여러 개']
          ] },
          { type: 'p', html: '패널처럼 여러 개를 담는 요소는 자식 태그를 나열하기만 하면 <b>컬렉션(Children)에 차례로 추가</b>됩니다. 이것을 <b>컬렉션 구문</b>이라고 합니다. <code>&lt;StackPanel.Children&gt;</code> 으로 감싸도 되지만 보통은 생략합니다.' },
          { type: 'code', title: '예제 14-2. 내용 속성과 컬렉션 구문', code: EX2, desc: '위의 세 버튼은 쓰는 방법만 다르고 결과는 같습니다. 네 번째 버튼은 <code>Content</code> 에 <b>StackPanel</b>(별 + 글자)을 넣었습니다. 마지막 줄의 <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;quot;</code> 는 XML 에서 특별한 뜻을 가진 문자 <code>&amp;</code> <code>&lt;</code> <code>"</code> 를 글자로 쓰는 방법입니다(아래 XML 규칙 참고).' },
          { type: 'callout', kind: 'warn', title: 'Content 는 하나만!', html: '<code>&lt;Button&gt;&lt;TextBlock/&gt;&lt;TextBlock/&gt;&lt;/Button&gt;</code> 처럼 <b>Content 에 요소를 두 개</b> 넣으면 Visual Studio 에서 “<i>Content 속성이 두 번 이상 설정되었습니다</i>” 오류가 납니다. 여러 개를 넣고 싶으면 예제처럼 <b>패널(StackPanel 등) 하나로 묶어서</b> 넣으세요. <code>Window</code> 도 마찬가지라서 창 바로 아래에는 보통 <code>Grid</code> 나 <code>StackPanel</code> 하나를 둡니다.' },

          { type: 'h', text: '형식 변환기 (Type Converter)' },
          { type: 'p', html: 'XAML 의 특성 값은 모두 <b>문자열</b>입니다. 그런데 <code>Width</code> 는 <code>double</code>, <code>Background</code> 는 <code>Brush</code>, <code>Margin</code> 은 <code>Thickness</code> 형식입니다. XAML 은 속성의 형식마다 준비된 <b>형식 변환기</b>로 문자열을 알맞은 객체로 바꿉니다. 그래서 <b>정해진 형식대로</b> 적어야 합니다.' },
          { type: 'table', head: ['XAML 문자열', '속성 형식', 'C# 으로 쓰면'], rows: [
            ['<code>Width="120"</code>, <code>Width="Auto"</code>', '<code>double</code>', '<code>120</code>, <code>double.NaN</code>'],
            ['<code>Background="Red"</code>', '<code>Brush</code>', '<code>Brushes.Red</code>'],
            ['<code>Background="#FF3366"</code>', '<code>Brush</code>', '<code>new SolidColorBrush(Color.FromRgb(0xFF, 0x33, 0x66))</code>'],
            ['<code>Background="#80FF3366"</code>', '<code>Brush</code> (반투명)', '<code>Color.FromArgb(0x80, 0xFF, 0x33, 0x66)</code> — 앞 두 자리 = 알파(불투명도)'],
            ['<code>Margin="10"</code>', '<code>Thickness</code>', '<code>new Thickness(10)</code>'],
            ['<code>Margin="10,5"</code>', '<code>Thickness</code>', '<code>new Thickness(10, 5, 10, 5)</code>'],
            ['<code>Margin="10,5,10,5"</code>', '<code>Thickness</code>', '<code>new Thickness(10, 5, 10, 5)</code> (왼, 위, 오, 아래)'],
            ['<code>FontWeight="Bold"</code>', '<code>FontWeight</code>', '<code>FontWeights.Bold</code>'],
            ['<code>HorizontalAlignment="Center"</code>', '열거형', '<code>HorizontalAlignment.Center</code>'],
            ['<code>Cursor="Hand"</code>', '<code>Cursor</code>', '<code>Cursors.Hand</code>']
          ], caption: '형식 변환기가 해 주는 일 — 문자열 → 객체' },
          { type: 'p', html: '색칠에 쓰는 객체를 <b>브러시(Brush)</b> 라고 합니다. 한 가지 색은 <code>SolidColorBrush</code>, 색이 점점 바뀌는 그라데이션은 <code>LinearGradientBrush</code> 입니다. 그라데이션은 <code>StartPoint</code> 에서 <code>EndPoint</code> 방향으로 색이 바뀌며, 좌표는 요소 크기를 1 로 보는 비율입니다(<code>0,0</code> = 왼쪽 위, <code>1,0</code> = 오른쪽 위, <code>0,1</code> = 왼쪽 아래). <code>GradientStop</code> 의 <code>Offset</code>(0~1)은 그 색이 놓이는 위치입니다.' },
          { type: 'code', title: '예제 14-3. SolidColorBrush 와 LinearGradientBrush', code: EX3, desc: '첫 줄은 모두 <code>SolidColorBrush</code> 입니다. <code>#80FF3366</code> 의 앞 두 자리 <code>80</code>(16진수, 약 50%)은 불투명도라서 뒤가 비쳐 보입니다. 넷째 칸처럼 브러시 자체의 <code>Opacity</code> 를 줄 수도 있습니다. 아래 두 줄은 가로(<code>1,0</code>) · 세로(<code>0,1</code>) 그라데이션이며, 세로 쪽은 <code>Offset</code> 0 · 0.5 · 1 에 색을 세 개 두었습니다.' },
          { type: 'callout', kind: 'tip', title: 'GradientStops 태그는 생략할 수도 있습니다', html: '<code>GradientStops</code> 는 <code>LinearGradientBrush</code> 의 내용 속성이라서 Visual Studio(실제 WPF)에서는 <code>&lt;LinearGradientBrush.GradientStops&gt;</code> 를 빼고 <code>&lt;GradientStop&gt;</code> 을 바로 넣어도 됩니다. 이 강좌의 예제는 구조가 잘 보이도록 (그리고 브라우저 실행기에서도 동작하도록) <b>속성 요소를 명시한 형태</b>로 씁니다.' },

          { type: 'h', text: 'Margin 과 Padding — Thickness 표기' },
          { type: 'p', html: '<b>Margin(마진)</b> 은 요소 <b>바깥</b>의 여백으로 다른 요소나 부모와의 거리입니다. <b>Padding(패딩)</b> 은 요소 <b>안쪽</b>의 여백으로 테두리와 내용 사이의 거리입니다. 둘 다 <code>Thickness</code> 형식이라 적는 방법이 같습니다.' },
          { type: 'figure', html: SVG_MARGIN, caption: 'Margin 은 바깥, Padding 은 안쪽 — 값이 넷이면 왼쪽부터 시계 방향' },
          { type: 'code', title: '예제 14-4. Margin · Padding 의 네 가지 표기', code: EX4, desc: '회색 StackPanel 위에서 버튼 주변의 빈 공간이 <b>Margin</b> 입니다. 값 하나(<code>"20"</code>), 둘(<code>"60,5"</code> = 좌우 60 · 상하 5), 넷(<code>"0,10,160,10"</code> = 왼 0 · 위 10 · 오 160 · 아래 10)을 비교하세요. Padding 이 큰 버튼은 글자 주변이 넓어져 버튼 자체가 커집니다. 마지막 버튼은 네 번째 표기인 <b>C# 코드</b> <code>new Thickness(40, 0, 40, 10)</code> 로 만들었습니다. <code>BorderThickness</code> 도 같은 <code>Thickness</code> 라서 <code>"2,2,2,6"</code> 처럼 아래 테두리만 두껍게 할 수 있습니다.' },
          { type: 'callout', kind: 'warn', title: '두 값의 순서에 주의', html: '<code>Margin="10,5"</code> 는 <b>(좌우, 상하)</b> 입니다. “위아래 10, 좌우 5” 가 아닙니다. 값을 <b>세 개</b>만 쓰면(<code>"10,5,10"</code>) 오류가 납니다. 값은 1개 · 2개 · 4개만 가능합니다.' },

          { type: 'h', text: 'x:Name 과 Name — C# 에서 요소 부르기' },
          { type: 'p', html: 'XAML 요소에 <code>x:Name="rightBorder"</code> 처럼 이름을 붙이면, 빌드할 때 코드 비하인드 클래스에 <b>같은 이름의 필드</b>가 만들어져 C# 에서 <code>rightBorder.Child = …</code> 처럼 쓸 수 있습니다. 컨트롤(FrameworkElement)에는 <code>Name</code> 속성도 있어서 <code>Name="rightBorder"</code> 라고 써도 같은 효과입니다.' },
          { type: 'list', items: [
            '<code>x:Name</code> — XAML 언어 기능. <b>모든 요소</b>에 쓸 수 있음 → 이 강좌는 <b>x:Name 을 기본</b>으로 씁니다.',
            '<code>Name</code> — 컨트롤의 일반 속성. 컨트롤에서는 x:Name 과 같은 뜻 (둘을 한 요소에 동시에 쓰면 오류)',
            '이름은 C# 변수 이름 규칙을 따릅니다: 숫자로 시작 금지, 공백 금지, <b>한 창 안에서 중복 금지</b>.',
            '관례: <code>btnSave</code>, <code>txtName</code>, <code>lstItems</code> 처럼 <b>종류 + 역할</b>로 짓습니다.'
          ] },
          { type: 'h', text: 'XAML 로 만든 화면 = C# 으로 만든 화면' },
          { type: 'p', html: '아래 예제는 <b>같은 모양</b>의 카드를 왼쪽은 XAML 로, 오른쪽은 C# 코드로 만듭니다. 오른쪽 <code>Border</code> 는 XAML 에서 비워 두고 <code>x:Name="rightBorder"</code> 로 이름만 붙였습니다. C# 코드의 주석에 대응하는 XAML 한 줄을 적어 두었으니 한 줄씩 비교해 보세요.' },
          { type: 'code', title: '예제 14-5. 같은 화면을 XAML 과 C# 으로', code: EX5, desc: 'XAML 의 <b>요소</b> = C# 의 <code>new</code>, <b>특성</b> = 속성 대입, <b>형식 변환기</b>가 해 주던 일(<code>"0,10,0,0"</code> → <code>Thickness</code>, <code>"Tomato"</code> → <code>Brush</code>)은 C# 에서 직접 <code>new Thickness(…)</code>, <code>Brushes.Tomato</code> 로 씁니다. <b>태그 안에 태그</b>는 <code>Children.Add</code>(패널) 또는 <code>Child</code>(Border) 대입이 됩니다. 결과는 같지만 XAML 쪽이 훨씬 짧고 모양이 한눈에 보이지요?' },
          { type: 'table', head: ['XAML', 'C#', '예'], rows: [
            ['요소 <code>&lt;Button/&gt;</code>', '객체 생성', '<code>var b = new Button();</code>'],
            ['특성 <code>Width="100"</code>', '속성 대입 (형식 변환)', '<code>b.Width = 100;</code>'],
            ['속성 요소 <code>&lt;Button.Background&gt;…</code>', '복잡한 객체를 만들어 대입', '<code>b.Background = new LinearGradientBrush(…);</code>'],
            ['내용 <code>&lt;Button&gt;확인&lt;/Button&gt;</code>', '내용 속성 대입', '<code>b.Content = "확인";</code>'],
            ['자식 요소 (컬렉션 구문)', '컬렉션에 추가', '<code>panel.Children.Add(b);</code>'],
            ['<code>x:Name="btnOk"</code>', '필드 선언', '<code>Button btnOk;</code> (자동 생성)'],
            ['<code>Click="btnOk_Click"</code>', '이벤트 처리기 연결', '<code>btnOk.Click += btnOk_Click;</code>']
          ], caption: 'XAML ↔ C# 대응 표' },

          { type: 'h', text: '주석과 XML 규칙' },
          { type: 'p', html: 'XAML 은 XML 이므로 XML 의 규칙을 정확히 지켜야 합니다. 하나라도 어기면 Visual Studio 의 오류 목록에 XAML 오류가 뜨고 빌드되지 않습니다.' },
          { type: 'list', items: [
            '<b>대소문자 구분</b>: <code>&lt;button&gt;</code>, <code>content="…"</code> 는 오류. 형식 · 속성 이름은 C# 과 똑같이 <code>Button</code>, <code>Content</code>.',
            '<b>모든 태그는 닫는다</b>: <code>&lt;Button&gt;…&lt;/Button&gt;</code> 또는 스스로 닫는 태그 <code>&lt;Button/&gt;</code>. 열고 닫는 순서가 엇갈리면 안 됨.',
            '<b>특성 값은 따옴표로</b>: <code>Width=100</code> 은 오류, <code>Width="100"</code> 또는 <code>Width=\'100\'</code>.',
            '<b>같은 특성 두 번 금지</b>, <b>루트 요소는 하나</b>.',
            '<b>특수 문자</b>: <code>&amp;</code> → <code>&amp;amp;</code>, <code>&lt;</code> → <code>&amp;lt;</code>, <code>&gt;</code> → <code>&amp;gt;</code>, <code>"</code> → <code>&amp;quot;</code> (또는 작은따옴표로 감싸기: <code>Content=\'Margin="20"\'</code>)',
            '<b>주석</b>: <code>&lt;!-- 설명 --&gt;</code>. 태그 <b>사이</b>에만 쓸 수 있고 태그 안(특성 사이)에는 못 씀. 주석 안에 <code>--</code> 를 쓰면 안 됨.'
          ] },
          { type: 'callout', kind: 'tip', title: '주석으로 잠시 끄기', html: 'Visual Studio XAML 편집기에서 줄을 선택하고 <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> 를 누르면 <code>&lt;!-- --&gt;</code> 로 감싸 주고, <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd> 로 풉니다. 이 강좌 편집기에서는 <kbd>Ctrl</kbd>+<kbd>/</kbd> 입니다.' },

          { type: 'h', text: '논리 트리 (Logical Tree)' },
          { type: 'p', html: 'XAML 의 태그 중첩은 그대로 객체의 <b>부모-자식 관계</b>가 됩니다. 창(Window) 을 뿌리로 하는 이 나무 구조를 <b>논리 트리</b>라고 합니다. 모든 요소의 부모는 <b>하나</b>이므로 같은 버튼 객체를 두 패널에 동시에 넣을 수 없습니다.' },
          { type: 'figure', html: SVG_TREE, caption: 'XAML 의 중첩 구조 = 논리 트리 (Window → Grid → StackPanel → TextBlock · Button)' },
          { type: 'callout', kind: 'vs', title: '문서 개요 창과 라이브 시각적 트리', html: '<ul><li><b>보기 → 다른 창 → 문서 개요</b>(Document Outline): 편집 중인 XAML 의 논리 트리를 보여 줍니다. 항목을 누르면 디자이너와 XAML 에서 그 요소가 선택됩니다.</li><li>디버그 실행(<kbd>F5</kbd>) 중에는 <b>디버그 → 창 → 라이브 시각적 트리</b>(Live Visual Tree)로 실행 중인 창의 트리를 보고, 요소를 골라 <b>라이브 속성 탐색기</b>에서 값을 바로 바꿔 볼 수 있습니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — InitializeComponent 와 BAML', html: '빌드하면 XAML 은 이진 형식 <b>BAML</b> 로 바뀌어 exe 안에 들어가고, <code>obj</code> 폴더에 <code>MainWindow.g.cs</code> 파일이 자동으로 만들어집니다. 이 파일에 <code>x:Name</code> 으로 붙인 <b>필드</b>와 <code>InitializeComponent()</code> 메서드가 들어 있습니다. 생성자에서 <code>InitializeComponent()</code> 를 호출하면 BAML 을 읽어 객체를 만들고 필드에 연결합니다. 그래서 <b>InitializeComponent() 호출 전에는 이름 붙인 요소가 null</b> 입니다. 또 컨트롤 하나는 내부적으로 테두리 · 글자 등 여러 조각으로 그려지는데, 그 조각까지 포함한 더 자세한 나무를 <b>시각적 트리(Visual Tree)</b> 라고 합니다.' }
        ],
        practice: [
          {
            title: '실습 14-1. 게임 시작 화면 꾸미기',
            level: 1,
            desc: '<p>시작 코드의 TODO 를 따라 게임 시작 화면을 완성하세요.</p><ol><li>제목 <code>TextBlock</code>: 글자는 <b>Tom &amp; Jerry 게임</b> (XAML 에서 <code>&amp;</code> 를 쓰는 방법은?), 크기 24, 굵게, 가운데 정렬</li><li>“시작하기” 버튼: Margin 좌우 40 · 상하 10, Padding 10, 배경은 <b>속성 요소 구문</b>으로 <code>LinearGradientBrush</code>(Gold → OrangeRed, 가로 방향)</li><li>“종료” 버튼: Margin 좌우 40, 배경 <code>#607D8B</code>, 글자색 흰색</li></ol>',
            hint: '<code>&amp;</code> 는 <code>&amp;amp;</code> 로 씁니다. 좌우 40 · 상하 10 은 <code>Margin="40,10"</code>. 그라데이션은 <code>&lt;Button.Background&gt;</code> 안에 <code>&lt;LinearGradientBrush StartPoint="0,0" EndPoint="1,0"&gt;</code> → <code>&lt;LinearGradientBrush.GradientStops&gt;</code> → <code>&lt;GradientStop …/&gt;</code> 두 개.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 14-2. XAML 을 C# 코드로 옮기기',
            level: 2,
            desc: '<p>아래 XAML 과 <b>똑같은 화면</b>을 XAML 대신 <b>C# 코드 비하인드</b>에서 만들어 보세요. XAML 에는 이름 붙인 빈 <code>StackPanel x:Name="root"</code> 만 있습니다.</p><pre>&lt;StackPanel Margin="15"&gt;\n    &lt;TextBlock Text="오늘의 할 일" FontSize="18" FontWeight="Bold"/&gt;\n    &lt;CheckBox Content="C# 복습" Margin="0,8,0,0"/&gt;\n    &lt;CheckBox Content="XAML 예제 따라 하기" Margin="0,4,0,0" IsChecked="True"/&gt;\n    &lt;Button Content="저장" Margin="0,12,0,0" Background="LightGreen"/&gt;\n&lt;/StackPanel&gt;</pre>',
            hint: '요소마다 <code>new</code> 로 만들고 속성을 대입한 뒤 <code>root.Children.Add(…)</code>. <code>"0,8,0,0"</code> → <code>new Thickness(0, 8, 0, 0)</code>, <code>"Bold"</code> → <code>FontWeights.Bold</code>, <code>"LightGreen"</code> → <code>Brushes.LightGreen</code>, <code>"True"</code> → <code>true</code>. 객체 이니셜라이저 <code>new CheckBox { Content = "…", … }</code> 를 쓰면 짧아집니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>&lt;Button&gt;확인&lt;/Button&gt;</code> 과 <b>같은 결과</b>를 내는 것은?', options: ['<code>&lt;Button Text="확인"/&gt;</code>', '<code>&lt;Button Content="확인"/&gt;</code>', '<code>&lt;Button Name="확인"/&gt;</code>', '<code>&lt;Button Title="확인"/&gt;</code>'], answer: 1, explain: 'Button 의 <b>내용 속성</b>은 <code>Content</code> 입니다. 태그 사이에 넣은 것은 내용 속성으로 들어갑니다.' },
          { q: '<code>Margin="10,20"</code> 의 뜻은?', options: ['왼쪽 10, 위 20 (나머지 0)', '위아래 10, 좌우 20', '좌우 10, 위아래 20', '가로 크기 10, 세로 크기 20'], answer: 2, explain: '값이 두 개면 <b>(좌우, 상하)</b> 입니다. 즉 <code>new Thickness(10, 20, 10, 20)</code>.' },
          { q: '버튼 배경을 그라데이션으로 하려고 합니다. 올바른 <b>속성 요소</b> 태그는?', options: ['<code>&lt;Button.Background&gt;</code>', '<code>&lt;Background&gt;</code>', '<code>&lt;Button Background&gt;</code>', '<code>&lt;Background.Button&gt;</code>'], answer: 0, explain: '속성 요소 태그 이름은 <b>형식이름.속성이름</b>입니다.' },
          { q: '버튼 글자를 <b>A &amp; B</b> 로 표시하려면?', options: ['<code>Content="A &amp; B"</code>', '<code>Content="A \\&amp; B"</code>', '<code>Content="A &lt;&gt; B"</code>', '<code>Content="A &amp;amp; B"</code>'], answer: 3, explain: 'XML 에서 <code>&amp;</code> 는 특별한 문자라서 <code>&amp;amp;</code> 로 써야 합니다. <code>&lt;</code> 는 <code>&amp;lt;</code>.' },
          { q: 'XAML 에서 <code>x:Name="txtName"</code> 을 붙이는 주된 이유는?', options: ['화면에 이름을 표시하려고', 'XAML 파일 이름을 정하려고', '코드 비하인드(C#)에서 그 요소를 필드로 사용하려고', '요소의 글꼴을 바꾸려고'], answer: 2, explain: 'x:Name 을 붙이면 빌드할 때 같은 이름의 필드가 만들어져 C# 에서 <code>txtName.Text = …</code> 처럼 쓸 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: 'XAML 문법', subtitle: 'Chapter 14 · Section 01 — 화면을 글로 그리는 언어', badge: '14-1',
            notes: '<p><b>[도입 3분]</b> 지난 시간 만든 첫 WPF 창의 <code>MainWindow.xaml</code> 을 다시 띄웁니다. “이 태그들이 실제로 무엇을 할까?” 를 오늘의 질문으로 던집니다.</p><p>오늘 목표: XAML 한 줄이 C# 객체 하나라는 감각, 속성을 주는 4가지 구문, 형식 변환기 · XML 규칙.</p>' },
          { layout: 'diagram', title: 'XAML 한 줄 = C# 몇 줄', html: SVG_XAML2OBJ, caption: '요소 → new, 특성 → 속성 대입, 문자열 → 형식 변환기',
            notes: '<p><b>[6분]</b> 먼저 한 문장으로 정의: “XAML 은 XML 기반의 <b>선언형</b> 언어 — 순서대로 명령하는 대신 <b>무엇이 있는지</b>를 적는다.” HTML 을 아는 학생에게는 “태그 이름이 곧 C# 클래스 이름인 HTML” 이라고 연결합니다.</p><p>왼쪽 XAML 을 한 줄씩 짚으며 오른쪽 C# 과 짝지어 읽습니다. 발문: “C# 으로도 되는데 왜 XAML 을 따로 쓸까?” → 짧고, 모양이 보이고, 디자이너 도구가 읽고 고칠 수 있다.</p><p><code>"Orange"</code> 가 어떻게 <code>Brushes.Orange</code> 가 되는지 질문 → 형식 변환기(뒤에서 자세히). <code>"Orange"</code> 가 어떻게 <code>Brushes.Orange</code> 가 되는지 질문 → 형식 변환기(뒤에서 자세히).</p><p>InitializeComponent 가 이 변환을 실행한다는 것만 짚고 넘어갑니다.</p>' },
          { layout: 'table', title: '루트 요소의 필수 특성', head: ['특성', '역할'], rows: [['<code>xmlns="…/presentation"</code>', 'Button · Grid 등 WPF 컨트롤 이름표'], ['<code>xmlns:x="…/xaml"</code>', 'x:Class · x:Name · x:Key 같은 XAML 기능'], ['<code>x:Class="MyApp.MainWindow"</code>', '짝이 되는 코드 비하인드 클래스'], ['<code>Title · Width · Height</code>', 'Window 의 일반 속성']], lead: '루트 요소는 파일에 하나 — MainWindow.xaml 은 &lt;Window&gt;',
            notes: '<p><b>[4분]</b> xmlns 는 C# 의 using 과 같다고 비유합니다. 주소처럼 생겼지만 인터넷에 접속하지 않는다는 점을 꼭 말해 주세요(자주 받는 질문).</p><p>x:Class 와 .xaml.cs 의 partial class 이름이 다르면 빌드 오류 — 프로젝트 이름을 바꿀 때 자주 겪습니다.</p>' },
          { layout: 'code', title: '예제 14-1. 특성 구문 vs 속성 요소 구문', code: S1, points: ['특성: <code>이름="값"</code> 한 줄', '속성 요소: <code>&lt;Button.Background&gt;</code> 안에 객체', '두 버튼의 배경은 <b>같은</b> 주황색', '같은 속성을 두 방법으로 동시에 주면 오류'],
            notes: '<p><b>[6분]</b> 실행해서 두 버튼이 같은 색임을 확인합니다. 두 번째 버튼의 <code>Button.Content</code> 에 문자열이 아니라 TextBlock 객체가 들어갔다는 점을 강조.</p><p>그 다음 본문 예제 14-1 의 그라데이션 버튼을 보여 주며 “이건 한 줄 문자열로 못 쓴다 → 속성 요소 구문이 필요한 이유”.</p>' },
          { layout: 'code', title: '예제 14-2. 내용 속성과 컬렉션 구문', code: S2, points: ['<code>&lt;Button&gt;확인&lt;/Button&gt;</code> = <code>Content="확인"</code>', 'Content 는 <b>하나</b> → 여러 개는 패널로 묶기', 'StackPanel 자식 = <code>Children.Add</code>', '<code>&amp;amp;</code> = &amp; 글자'],
            notes: '<p><b>[6분]</b> 첫 두 버튼이 같다는 것 확인 후, 세 번째 버튼(별 + 글자)을 보여 줍니다. “Content 에 TextBlock 두 개를 바로 넣으면?” 발문 → Visual Studio 오류 “Content 속성이 두 번 이상 설정됨”.</p><p>패널은 내용 속성이 Children(컬렉션)이라 여러 개가 가능하다는 대비를 보여 주세요.</p>' },
          { layout: 'table', title: '형식 변환기 — 문자열을 객체로', head: ['XAML', 'C#'], rows: [['<code>Background="Red"</code>', '<code>Brushes.Red</code>'], ['<code>Background="#80FF3366"</code>', '<code>Color.FromArgb(0x80, 0xFF, 0x33, 0x66)</code>'], ['<code>Margin="10,5"</code>', '<code>new Thickness(10, 5, 10, 5)</code>'], ['<code>FontWeight="Bold"</code>', '<code>FontWeights.Bold</code>'], ['<code>Width="Auto"</code>', '<code>double.NaN</code>']], lead: '특성 값은 모두 문자열 — 속성 형식에 맞게 자동 변환',
            notes: '<p><b>[4분]</b> #AARRGGBB 의 앞 두 자리가 불투명도라는 점을 짚습니다. 80 = 16진수 128 = 약 50%.</p><p>“형식이 틀리면?” → <code>Width="백"</code> 은 변환 실패로 XAML 오류. 정해진 표기를 지켜야 한다.</p><p>이어서 본문 예제 14-3(브러시)을 실행: SolidColorBrush 네 가지, 그라데이션의 StartPoint/EndPoint 를 <code>0,1</code> · <code>1,1</code> 로 바꿔 세로 · 대각선을 즉석에서 보여 줍니다. GradientStops 태그는 실제 WPF 에서 생략 가능하다는 것도 한마디.</p>' },
          { layout: 'code', title: '예제 14-4. Margin · Padding 표기', code: S4, points: ['<code>"20"</code> 네 방향', '<code>"60,5"</code> 좌우 60 · 상하 5', '<code>"0,10,160,10"</code> 왼·위·오·아래', 'Padding 이 크면 버튼이 커진다'],
            notes: '<p><b>[5분]</b> 본문의 Margin/Padding 그림을 먼저 보여 주며 “Margin 은 사람 사이의 거리, Padding 은 옷 안의 여유” 로 비유합니다. 값 두 개의 순서(좌우, 상하)를 가장 많이 헷갈리므로 판서해 두세요.</p><p>회색 배경 위에서 버튼 주변 빈 곳이 Margin 이라는 것을 손으로 가리킵니다. 학생에게 세 번째 버튼을 오른쪽에 붙이도록 값을 바꾸게 해 보세요(<code>160,10,0,10</code>).</p>' },
          { layout: 'two', title: '같은 화면 — XAML vs C#', left: { title: 'XAML', code: `<StackPanel>
    <TextBlock Text="제목" FontSize="16"/>
    <Button Content="확인"
            Margin="0,10,0,0"
            Background="LightSalmon"/>
</StackPanel>`, run: false }, right: { title: 'C#', code: `var panel = new StackPanel();
var title = new TextBlock { Text = "제목", FontSize = 16 };
panel.Children.Add(title);
var button = new Button
{
    Content = "확인",
    Margin = new Thickness(0, 10, 0, 0),
    Background = Brushes.LightSalmon
};
panel.Children.Add(button);`, run: false },
            notes: '<p><b>[4분]</b> 본문 예제 14-5 를 실행해 좌우 카드가 똑같음을 보여 준 뒤 이 슬라이드로 대응 관계를 정리합니다. 태그 안에 태그 = Children.Add, 형식 변환기 = new Thickness / Brushes.</p><p>x:Name 으로 이름 붙인 요소만 C# 에서 부를 수 있다는 점도 이때 설명합니다.</p>' },
          { layout: 'diagram', title: '논리 트리', html: SVG_TREE, caption: '태그 중첩 = 부모-자식 관계, 부모는 하나',
            notes: '<p><b>[3분]</b> XML 규칙(대소문자 · 닫는 태그 · &amp;amp; · 주석)을 먼저 빠르게 짚고, 태그를 제대로 닫아야 이런 나무가 만들어진다고 연결합니다.</p><p>Visual Studio 의 “문서 개요” 창을 열어 실제 트리를 보여 주면 좋습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Margin="10,20"</code> 의 뜻은?', options: ['왼쪽 10, 위 20', '위아래 10, 좌우 20', '좌우 10, 위아래 20', '가로 10, 세로 20'], answer: 2, explain: '값 두 개 = (좌우, 상하). <code>new Thickness(10, 20, 10, 20)</code>.',
            notes: '<p>손을 들어 답하게 한 뒤 공개. 이어서 <code>"1,2,3,4"</code> 의 순서도 물어봅니다(왼 · 위 · 오 · 아래).</p>' },
          { layout: 'practice', title: '실습 14-1. 게임 시작 화면 꾸미기', desc: '<p>제목 <b>Tom &amp; Jerry 게임</b>, 그라데이션 “시작하기” 버튼(속성 요소 구문), <code>#607D8B</code> “종료” 버튼을 만드세요.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[5분]</b> &amp; 를 그대로 쓰면 XAML 오류가 나는 것을 직접 겪게 두세요. 오류 메시지를 읽고 스스로 &amp;amp; 로 고치는 것이 목표입니다. 빨리 끝난 학생은 실습 14-2(XAML → C#)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['XAML = XML 기반 선언형, <b>요소 = 객체 · 특성 = 속성</b>', '루트 요소 + <code>xmlns</code> · <code>xmlns:x</code> · <code>x:Class</code>', '특성 구문 · <b>속성 요소</b> <code>&lt;형식.속성&gt;</code> · 내용 속성 · 컬렉션 구문', '형식 변환기: <code>"#FF3366"</code> <code>"10,5"</code> → Brush · Thickness', 'XML 규칙: 대소문자 · 닫는 태그 · <code>&amp;amp;</code> · <code>&lt;!-- --&gt;</code>', 'x:Name 으로 C# 에서 사용 · 태그 중첩 = 논리 트리'],
            notes: '<p>학습 목표를 다시 읽고 확인. 다음 시간: <code>{ }</code> 로 쓰는 마크업 확장과 모든 컨트롤이 공유하는 공통 속성.</p>' }
        ]
      },

      /* ===================== ch14-2 ===================== */
      {
        id: 'ch14-2',
        title: '마크업 확장과 공통 속성',
        minutes: 50,
        goals: [
          '마크업 확장 { } 이 일반 문자열 값과 어떻게 다른지 설명할 수 있다',
          'Window.Resources 에 리소스를 등록하고 {StaticResource} 로 재사용할 수 있다',
          '{Binding ElementName=…, Path=…} 로 두 컨트롤의 값을 연결할 수 있다',
          '{x:Null} · {x:Static} 의 뜻을 말할 수 있다',
          '크기 · 여백 · 정렬 · Visibility · Opacity · 글꼴 등 공통 속성과 TextBlock 인라인 서식을 사용할 수 있다'
        ],
        flow: [['복습 · 도입', 4], ['마크업 확장 · StaticResource', 12], ['Binding 맛보기 · x:Null · x:Static', 9], ['공통 속성 · Visibility', 12], ['TextBlock 인라인 · 줄 바꿈', 7], ['퀴즈 · 실습', 6]],
        content: [
          { type: 'h', text: '마크업 확장 (Markup Extension)' },
          { type: 'p', html: '지금까지 특성 값은 형식 변환기가 바꿔 주는 <b>글자 그대로의 값</b>이었습니다. 그런데 “미리 정해 둔 색을 가져와라”, “저 슬라이더의 값을 따라가라” 처럼 <b>값을 어디선가 구해 와야</b> 할 때가 있습니다. 이때 특성 값을 <b>중괄호 <code>{ }</code></b> 로 감싸는 <b>마크업 확장</b>을 씁니다. 중괄호를 보면 XAML 은 “글자가 아니라 <b>특별한 방법으로 값을 계산하라</b>”는 뜻으로 받아들입니다.' },
          { type: 'figure', html: SVG_EXT, caption: '{확장이름 인수} 의 구조 — StaticResource 는 부모 쪽으로 올라가며 키를 찾는다' },
          { type: 'table', head: ['마크업 확장', '하는 일', '예', '배우는 곳'], rows: [
            ['<code>{StaticResource 키}</code>', '리소스에 등록한 객체를 키로 찾아 넣는다', '<code>Background="{StaticResource MainBrush}"</code>', '이번 절 · 19장'],
            ['<code>{Binding …}</code>', '다른 객체의 속성 값과 <b>연결</b>(값이 바뀌면 따라 바뀜)', '<code>FontSize="{Binding ElementName=slider, Path=Value}"</code>', '맛보기 · 20장'],
            ['<code>{x:Null}</code>', '<code>null</code> (값 없음)', '<code>Background="{x:Null}"</code>', '이번 절'],
            ['<code>{x:Static 형식.멤버}</code>', '클래스의 <b>static</b> 속성 · 필드 · 상수 값', '<code>{x:Static SystemColors.HighlightBrush}</code>', '이번 절'],
            ['<code>{x:Type 형식}</code>', '형식 정보(<code>typeof</code>)', '<code>TargetType="{x:Type Button}"</code>', '19장 스타일'],
            ['<code>{DynamicResource 키}</code>', '실행 중에 리소스가 바뀌면 따라 바뀜', '테마 전환', '19장']
          ], caption: '자주 쓰는 마크업 확장' },
          { type: 'callout', kind: 'info', title: '인수 적는 법', html: '<code>{확장이름 값}</code> 처럼 이름 뒤에 값을 바로 쓰거나(위치 인수), <code>{Binding ElementName=slider, Path=Value}</code> 처럼 <b><code>이름=값</code> 을 쉼표로 구분</b>해 씁니다(이름 붙은 인수). 인수 값 안에 쉼표 · 중괄호가 들어가야 하면 <b>작은따옴표</b>로 감쌉니다: <code>StringFormat=\'크기: {0}\'</code>. 글자 그대로 <code>{</code> 로 시작하는 문자열을 쓰고 싶다면 앞에 <code>{}</code> 를 붙입니다: <code>Text="{}{안녕}"</code>.' },

          { type: 'h', text: '{StaticResource} — 리소스로 값 재사용하기' },
          { type: 'p', html: '버튼 열 개에 같은 색 <code>#3F51B5</code> 를 적어 두었다가 색을 바꾸려면 열 군데를 고쳐야 합니다. 대신 색을 <b>리소스(resource)</b> 로 한 번 등록해 두고 이름으로 꺼내 쓰면, <b>한 곳만 고치면 전체가 바뀝니다</b>. C# 에서 자주 쓰는 값을 상수로 만드는 것과 같은 생각입니다.' },
          { type: 'list', ordered: true, items: [
            '<code>&lt;Window.Resources&gt;</code> 속성 요소 안에 객체를 넣고 <code>x:Key="이름"</code> 을 붙여 <b>등록</b>합니다.',
            '쓰는 곳에서 <code>{StaticResource 이름}</code> 으로 <b>꺼내</b> 씁니다.',
            '브러시뿐 아니라 숫자(<code>sys:Double</code>), 문자열, 스타일(19장), 템플릿(21장) 등 무엇이든 리소스가 될 수 있습니다.'
          ] },
          { type: 'code', title: '예제 14-6. 리소스 · x:Static · x:Null', code: EX6, desc: '<code>MainBrush</code> 한 곳의 <code>Color</code> 를 <code>#E91E63</code> 으로 바꿔 실행해 보세요. 제목과 버튼 세 개가 한꺼번에 바뀝니다. <code>sys:Double</code> 처럼 .NET 의 기본 형식을 리소스로 쓰려면 루트에 <code>xmlns:sys="clr-namespace:System;assembly=mscorlib"</code> 를 추가합니다. 아래쪽 <code>Border</code> 는 <code>{x:Static}</code> 으로 Windows 시스템 강조색을, 마지막 버튼은 <code>{x:Null}</code> 로 배경 브러시를 지웠습니다.' },
          { type: 'callout', kind: 'warn', title: 'StaticResource 오류가 날 때', html: '<ul><li><b>정의가 사용보다 먼저</b> 있어야 합니다. <code>Window.Resources</code> 는 보통 창 맨 위에 둡니다.</li><li>키 이름은 대소문자까지 정확히: <code>mainBrush</code> ≠ <code>MainBrush</code>. 틀리면 실행할 때 <b>XamlParseException</b>(“리소스를 찾을 수 없습니다”)이 납니다.</li><li>리소스에는 반드시 <code>x:Key</code> 가 있어야 합니다.</li></ul>' },
          { type: 'callout', kind: 'vs', title: '속성 창에서 리소스 고르기', html: '디자이너에서 버튼을 선택하고 속성 창의 <b>Background</b> 오른쪽 작은 네모(속성 표식)를 누르면 <b>리소스 → 로컬</b> 메뉴에 이 창의 리소스 목록이 나옵니다. 고르면 XAML 에 <code>{StaticResource …}</code> 가 자동으로 들어갑니다. 반대로 <b>리소스로 변환…</b> 을 누르면 지금 값을 새 리소스로 만들어 줍니다.' },

          { type: 'h', text: '{Binding} 맛보기 — 컨트롤끼리 연결하기' },
          { type: 'p', html: '<b>데이터 바인딩(data binding)</b> 은 한 속성의 값을 다른 속성에 <b>연결</b>해, 한쪽이 바뀌면 다른 쪽도 자동으로 바뀌게 하는 기능입니다. 자세한 내용은 20장에서 배우고, 여기서는 가장 쉬운 형태인 <b>다른 요소의 속성에 연결</b>하기만 맛봅니다.' },
          { type: 'list', items: [
            '<code>ElementName=sizeSlider</code> — 값을 가져올 <b>요소의 이름</b>(x:Name)',
            '<code>Path=Value</code> — 그 요소의 <b>어떤 속성</b>을 가져올지',
            '<code>StringFormat=\'현재 크기: {0}\'</code> — 글자로 보여 줄 때의 <b>형식</b>(C# 의 <code>string.Format</code> 과 같음)'
          ] },
          { type: 'code', title: '예제 14-7. 슬라이더로 글자 크기 바꾸기 — {Binding ElementName}', code: EX7, desc: '슬라이더를 움직이면 두 TextBlock 이 따라 바뀝니다. <b>C# 코드는 한 줄도 쓰지 않았습니다.</b> 이벤트 처리기로 같은 일을 하려면 <code>ValueChanged</code> 이벤트에서 <code>txt.FontSize = slider.Value;</code> 를 매번 써야 합니다. <code>IsSnapToTickEnabled="True"</code> 와 <code>TickFrequency="2"</code> 로 값이 2 단위로 딱딱 끊기게 했습니다.' },

          { type: 'h', text: '{x:Null} 과 {x:Static}' },
          { type: 'list', items: [
            '<code>{x:Null}</code> — 속성에 <b>null</b> 을 넣습니다. 예: <code>Background="{x:Null}"</code> 은 배경 브러시를 <b>없앱니다</b>. 투명(<code>Transparent</code>)과 비슷해 보이지만, 배경이 null 인 영역은 <b>마우스 클릭을 받지 않는다</b>는 차이가 있습니다.',
            '<code>{x:Static 형식.멤버}</code> — C# 클래스의 <b>static 속성 · 필드 · 상수</b> 값을 가져옵니다. <code>SystemColors.HighlightBrush</code>(선택 강조색), <code>SystemColors.ControlBrush</code>(기본 컨트롤 배경) 처럼 <b>Windows 설정을 따르는 색</b>에 자주 씁니다. 내가 만든 클래스의 상수도 <code>{x:Static local:Config.AppName}</code> 처럼 가져올 수 있습니다.'
          ] },

          { type: 'h', text: '모든 요소가 공유하는 공통 속성' },
          { type: 'p', html: 'Button, TextBlock, Border, StackPanel … 모든 화면 요소는 <code>FrameworkElement</code> 라는 부모 클래스를 물려받기 때문에 <b>같은 이름의 속성</b>을 공통으로 가지고 있습니다. 한 번 익혀 두면 어떤 컨트롤에서든 똑같이 쓸 수 있습니다.' },
          { type: 'table', head: ['속성', '뜻', '값 예'], rows: [
            ['<code>Width</code> · <code>Height</code>', '크기 (단위: 1/96 인치 = 장치 독립 픽셀)', '<code>120</code>, <code>Auto</code>(내용에 맞춤)'],
            ['<code>MinWidth</code> · <code>MaxWidth</code> · <code>MinHeight</code> · <code>MaxHeight</code>', '최소 · 최대 크기 (창 크기가 바뀔 때 유용)', '<code>MinWidth="200"</code>'],
            ['<code>Margin</code>', '바깥 여백', '<code>"10"</code>, <code>"10,5"</code>, <code>"0,10,0,0"</code>'],
            ['<code>Padding</code>', '안쪽 여백 (Control · Border · TextBlock)', '<code>"8,4"</code>'],
            ['<code>HorizontalAlignment</code>', '부모 안에서의 가로 정렬', '<code>Left</code> · <code>Center</code> · <code>Right</code> · <code>Stretch</code>(기본)'],
            ['<code>VerticalAlignment</code>', '부모 안에서의 세로 정렬', '<code>Top</code> · <code>Center</code> · <code>Bottom</code> · <code>Stretch</code>(기본)'],
            ['<code>Visibility</code>', '보이기 여부', '<code>Visible</code> · <code>Hidden</code> · <code>Collapsed</code>'],
            ['<code>IsEnabled</code>', '사용 가능 여부 (False 면 회색 · 클릭 불가)', '<code>True</code> / <code>False</code>'],
            ['<code>Opacity</code>', '불투명도 (0 = 투명 ~ 1 = 불투명)', '<code>0.5</code>'],
            ['<code>FontSize</code> · <code>FontWeight</code> · <code>FontFamily</code> · <code>FontStyle</code>', '글꼴 크기 · 굵기 · 글꼴 이름 · 기울임', '<code>16</code>, <code>Bold</code>, <code>"Malgun Gothic"</code>, <code>Italic</code>'],
            ['<code>Foreground</code> · <code>Background</code>', '글자색 · 배경 브러시', '<code>"Navy"</code>, <code>"#FFF3E0"</code>'],
            ['<code>ToolTip</code>', '마우스를 올리면 뜨는 도움말', '<code>"저장합니다 (Ctrl+S)"</code>'],
            ['<code>Cursor</code>', '마우스를 올렸을 때 커서 모양', '<code>Hand</code> · <code>Wait</code> · <code>IBeam</code> · <code>No</code>']
          ], caption: '공통 속성 한눈에 보기 (글꼴 · 색 · Padding 은 Control · TextBlock 계열이 가짐)' },
          { type: 'code', title: '예제 14-8. 크기 · 정렬 · Opacity · IsEnabled · ToolTip · Cursor · 글꼴', code: EX8, desc: '<code>Width</code> 를 준 버튼은 <code>HorizontalAlignment</code> 에 따라 왼쪽 · 가운데 · 오른쪽에 놓이고, Width 가 없는 버튼은 기본값 <code>Stretch</code> 로 가로를 가득 채웁니다. <code>Opacity="0.4"</code> 는 흐리게 보이지만 <b>클릭은 됩니다</b>. <code>IsEnabled="False"</code> 는 회색이 되고 클릭이 안 됩니다. 가운데 버튼에 마우스를 올려 손가락 커서와 도움말 풍선을 확인하세요.' },
          { type: 'callout', kind: 'tip', title: 'Width 를 꼭 줘야 할까?', html: 'WPF 는 창 크기가 바뀌어도 화면이 자연스럽게 늘어나도록 <b>크기를 비워 두고 부모 패널에 맡기는 것</b>을 권장합니다. 크기를 고정하면(<code>Width="300"</code>) 창을 줄였을 때 잘립니다. 꼭 필요할 때만 <code>Width</code>, 대신 <code>MinWidth</code> · <code>MaxWidth</code> 와 <code>Margin</code> 을 적극적으로 쓰세요. 레이아웃은 15장에서 자세히 배웁니다.' },

          { type: 'h', text: 'Visibility — Visible · Hidden · Collapsed' },
          { type: 'p', html: '요소를 숨기는 방법은 두 가지입니다. <code>Hidden</code> 은 <b>보이지 않지만 자리는 그대로</b> 차지하고, <code>Collapsed</code> 는 <b>자리까지 없애서</b> 뒤의 요소가 앞으로 당겨집니다. 대부분의 경우 “없는 것처럼” 만드는 <code>Collapsed</code> 를 씁니다.' },
          { type: 'figure', html: SVG_VIS, caption: 'Hidden 은 빈자리를 남기고, Collapsed 는 자리까지 없앤다' },
          { type: 'code', title: '예제 14-9. Visibility 세 가지 비교', code: EX9, desc: '위 세 줄은 가운데 B 버튼만 <code>Visibility</code> 가 다릅니다. Hidden 줄은 A 와 C 사이에 빈칸이 있고, Collapsed 줄은 C 가 A 옆으로 붙습니다. 아래 버튼을 누르면 C# 에서 <code>target.Visibility</code> 를 <code>Visibility.Hidden</code> → <code>Collapsed</code> → <code>Visible</code> 순서로 바꿉니다. XAML 의 <code>"Hidden"</code> 문자열이 C# 에서는 열거형 값 <code>Visibility.Hidden</code> 이라는 점도 비교해 보세요.' },
          { type: 'callout', kind: 'info', title: 'Opacity="0" 과 Visibility 의 차이', html: '<code>Opacity="0"</code> 은 완전히 투명할 뿐 요소는 그대로 있어 <b>자리도 차지하고 클릭도 됩니다</b>(보이지 않는 버튼!). 숨길 목적이라면 <code>Visibility</code> 를 쓰고, 서서히 사라지는 효과(애니메이션)에는 <code>Opacity</code> 를 씁니다.' },

          { type: 'h', text: 'TextBlock 인라인 서식 — Run · Bold · Italic · LineBreak' },
          { type: 'p', html: '<code>TextBlock</code> 은 <code>Text</code> 속성 하나로 글자를 보여 줄 수도 있지만, 태그 안에 <b>인라인(inline) 요소</b>를 넣으면 <b>한 문장 안에서 부분마다 다른 서식</b>을 줄 수 있습니다. 웹의 <code>&lt;b&gt;</code>, <code>&lt;i&gt;</code>, <code>&lt;br&gt;</code> 과 비슷합니다.' },
          { type: 'table', head: ['인라인', '뜻', '예'], rows: [
            ['<code>Run</code>', '서식을 줄 수 있는 글자 조각 (가장 기본)', '<code>&lt;Run Text="빨강" Foreground="Red"/&gt;</code>'],
            ['<code>Bold</code> · <code>Italic</code> · <code>Underline</code>', '굵게 · 기울임 · 밑줄 (안에 Run 을 넣음)', '<code>&lt;Bold&gt;&lt;Run Text="중요"/&gt;&lt;/Bold&gt;</code>'],
            ['<code>LineBreak</code>', '줄 바꿈', '<code>&lt;LineBreak/&gt;</code>'],
            ['<code>Span</code>', '여러 인라인을 묶어 한꺼번에 서식', '<code>&lt;Span Foreground="Blue"&gt;…&lt;/Span&gt;</code>']
          ] },
          { type: 'p', html: '긴 글은 <code>TextWrapping="Wrap"</code> 으로 너비에 맞춰 <b>자동 줄 바꿈</b>하고(기본값 <code>NoWrap</code> 은 잘림), <code>TextAlignment</code>(<code>Left</code> · <code>Center</code> · <code>Right</code> · <code>Justify</code>)로 TextBlock <b>안에서</b> 글자를 정렬합니다. <code>HorizontalAlignment</code> 가 TextBlock <b>자체</b>의 위치라면 <code>TextAlignment</code> 는 <b>그 안의 글자</b> 위치입니다.' },
          { type: 'code', title: '예제 14-10. TextBlock 인라인 서식과 줄 바꿈 · 정렬', code: EX10, desc: '첫 TextBlock 하나에 <b>굵게 · 빨강 · 기울임 · 밑줄 · 작은 회색 글씨</b>가 섞여 있고, <code>&lt;LineBreak/&gt;</code> 에서 줄이 바뀝니다. 아래는 같은 긴 문장을 <code>NoWrap</code> 과 <code>Wrap</code> 으로 비교한 것입니다. 창 크기를 줄여 보면 차이가 더 분명합니다.' },
          { type: 'callout', kind: 'warn', title: '인라인 사이의 공백 규칙', html: '<ul><li>XAML 에서는 인라인 태그 사이의 <b>줄 바꿈 · 들여쓰기 공백이 공백 한 칸</b>으로 바뀝니다. 그래서 붙어 있어야 할 조각은 <b>한 줄에 붙여</b> 쓰고, 필요한 공백은 <code>Text=" 수업은"</code> 처럼 <b>Text 안에</b> 넣습니다. (<code>LineBreak</code> 앞뒤의 공백은 무시되므로 LineBreak 는 따로 줄에 써도 됩니다.)</li><li>Visual Studio(실제 WPF)에서는 <code>&lt;Bold&gt;중요&lt;/Bold&gt;</code> 처럼 글자를 바로 넣어도 되지만, 이 강좌의 브라우저 실행기는 <code>&lt;Bold&gt;&lt;Run Text="중요"/&gt;&lt;/Bold&gt;</code> 처럼 <b>글자를 Run 으로 감싼 형태</b>만 정확히 표시합니다. 두 곳에서 똑같이 보이도록 예제는 모두 Run 을 씁니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — C# 에서 인라인 만들기', html: '<code>TextBlock</code> 의 <code>Inlines</code> 컬렉션에 직접 추가할 수도 있습니다 (<code>using System.Windows.Documents;</code> 필요).<pre>txtInfo.Inlines.Clear();\ntxtInfo.Inlines.Add(new Run("합계: "));\ntxtInfo.Inlines.Add(new Bold(new Run("15,500원")));\ntxtInfo.Inlines.Add(new LineBreak());</pre>계산 결과처럼 <b>일부만 강조</b>해야 하는 메시지를 만들 때 유용합니다.' }
        ],
        practice: [
          {
            title: '실습 14-3. 명함 카드 만들기',
            level: 2,
            desc: '<p>리소스 · Border · 인라인 서식을 모두 써서 명함 카드를 만드세요.</p><ol><li><code>Window.Resources</code> 에 카드 배경 브러시 <code>CardBrush</code>(<code>#F1F8E9</code>) 추가 (<code>PointBrush</code> 는 이미 있음)</li><li>가운데에 놓인 <code>Border</code>: Width 320, CornerRadius 12, Padding 20, 배경 <code>{StaticResource CardBrush}</code>, 테두리 <code>{StaticResource PointBrush}</code> 2 두께</li><li>안에 <code>StackPanel</code> → 이름(굵게 · 22)과 직함(기울임 · 회색)을 <b>한 TextBlock</b> 에 <code>LineBreak</code> 로 두 줄, 그 아래 이메일 · 전화 TextBlock (<code>ToolTip</code> 으로 설명)</li></ol>',
            hint: 'Border 를 가운데에 두려면 <code>HorizontalAlignment="Center" VerticalAlignment="Center"</code>. 인라인은 <code>&lt;Bold&gt;&lt;Run Text="홍길동" FontSize="22"/&gt;&lt;/Bold&gt;</code> → <code>&lt;LineBreak/&gt;</code> → <code>&lt;Italic&gt;&lt;Run Text="…" Foreground="Gray"/&gt;&lt;/Italic&gt;</code>.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 14-4. 슬라이더로 투명도 조절하기',
            level: 1,
            desc: '<p>슬라이더(0 ~ 1)를 움직이면 보라색 상자의 <code>Opacity</code> 가 바뀌고, 위의 TextBlock 에 <b>투명도: 0.6</b> 처럼 현재 값이 표시되게 하세요. C# 코드는 쓰지 않습니다.</p>',
            hint: '<code>Opacity="{Binding ElementName=opacitySlider, Path=Value}"</code>. 글자로 보여 줄 때는 <code>Text="{Binding ElementName=opacitySlider, Path=Value, StringFormat=\'투명도: {0:F1}\'}"</code>.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: 'XAML 특성 값에서 <b>마크업 확장</b>을 나타내는 기호는?', options: ['<code>[ ]</code>', '<code>( )</code>', '<code>{ }</code>', '<code>&lt; &gt;</code>'], answer: 2, explain: '<code>{StaticResource …}</code>, <code>{Binding …}</code>, <code>{x:Null}</code> 처럼 중괄호로 감쌉니다.' },
          { q: '버튼을 숨기되 <b>그 자리는 비워 둔 채 유지</b>하려면 Visibility 값은?', options: ['<code>Visible</code>', '<code>Hidden</code>', '<code>Collapsed</code>', '<code>None</code>'], answer: 1, explain: '<code>Hidden</code> 은 안 보이지만 자리를 차지하고, <code>Collapsed</code> 는 자리까지 없앱니다. <code>None</code> 은 없는 값입니다.' },
          { q: '<code>{StaticResource MainBrush}</code> 로 쓰려면 리소스를 등록할 때 무엇을 붙여야 하나요?', options: ['<code>x:Key="MainBrush"</code>', '<code>x:Name="MainBrush"</code>', '<code>Name="MainBrush"</code>', '<code>x:Class="MainBrush"</code>'], answer: 0, explain: '리소스는 <code>x:Key</code> 로 이름을 붙입니다. <code>x:Name</code> 은 C# 에서 요소를 부르기 위한 이름입니다.' },
          { q: '<code>FontSize="{Binding ElementName=slider, Path=Value}"</code> 의 뜻은?', options: ['slider 라는 이름의 리소스 글꼴을 가져온다', 'FontSize 를 slider 로 고정한다', '글자 크기를 Value 라는 문자열로 한다', 'slider 요소의 Value 속성 값을 따라 글자 크기가 바뀐다'], answer: 3, explain: 'ElementName 은 값을 가져올 요소의 이름, Path 는 그 요소의 속성입니다. 슬라이더를 움직이면 글자 크기가 따라 바뀝니다.' },
          { q: '다음 중 <b>클릭이 여전히 되는</b> 버튼은?', options: ['<code>IsEnabled="False"</code>', '<code>Visibility="Collapsed"</code>', '<code>Opacity="0.3"</code>', '<code>Visibility="Hidden"</code>'], answer: 2, explain: 'Opacity 는 보이는 정도만 바꿉니다. 흐려도(심지어 0 이어도) 요소는 그대로 있어서 클릭됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '마크업 확장과 공통 속성', subtitle: 'Chapter 14 · Section 02', badge: '14-2',
            notes: '<p><b>[도입 3분]</b> 복습 발문: “<code>&lt;Button&gt;확인&lt;/Button&gt;</code> 에서 확인은 어느 속성으로?”, “<code>Margin="10,5"</code> 의 뜻은?”</p><p>오늘: 중괄호 { } 로 값을 “구해 오는” 방법, 모든 컨트롤이 공유하는 공통 속성, 글자 꾸미기.</p>' },
          { layout: 'bullets', title: '마크업 확장 { }', lead: '“글자 그대로가 아니라, 특별한 방법으로 값을 구해 와라”',
            bullets: ['<code>{StaticResource 키}</code> — 등록해 둔 리소스', '<code>{Binding …}</code> — 다른 속성과 연결', '<code>{x:Null}</code> — null', '<code>{x:Static 형식.멤버}</code> — static 값', ['<code>{x:Type}</code> · <code>{DynamicResource}</code> 는 19장']],
            notes: '<p><b>[4분]</b> 특성 값이 <code>{</code> 로 시작하면 XAML 이 다르게 해석한다는 것만 확실히 잡습니다. 인수는 위치 인수(<code>{StaticResource MainBrush}</code>)와 이름=값(<code>ElementName=…, Path=…</code>) 두 가지.</p>' },
          { layout: 'diagram', title: '마크업 확장의 구조 · 리소스 찾기', html: SVG_EXT, caption: '요소 → 부모 → Window.Resources → App.xaml 순서로 키를 찾는다',
            notes: '<p><b>[4분]</b> 리소스는 가까운 곳부터 찾는다 — 변수의 범위(scope)와 비슷하다고 연결하세요. 못 찾으면 실행할 때 예외가 난다는 점, 키 대소문자 주의.</p>' },
          { layout: 'code', title: '예제 14-6. {StaticResource} 로 재사용', code: S5, points: ['<code>Window.Resources</code> 에 <code>x:Key</code> 로 등록', '<code>{StaticResource MainBrush}</code> 로 사용', '색 한 곳만 바꾸면 전체 변경', '<code>sys:Double</code> 은 <code>xmlns:sys</code> 필요'],
            notes: '<p><b>[6분]</b> 실행 후 MainBrush 의 Color 를 바꿔 다시 실행 → 세 곳이 한꺼번에 바뀌는 것을 보여 줍니다. 일부러 키를 <code>mainBrush</code> 로 틀려서 오류 메시지를 읽게 하세요.</p><p>Style 로 속성 묶음을 재사용하는 것은 19장이라고 예고.</p>' },
          { layout: 'code', title: '예제 14-7. {Binding} 맛보기', code: S6, points: ['<code>ElementName</code> = 값을 줄 요소 이름', '<code>Path</code> = 그 요소의 속성', '<code>StringFormat</code> 으로 글자 형식', 'C# 코드 0줄!'],
            notes: '<p><b>[5분]</b> 슬라이더를 움직이며 “C# 코드가 한 줄도 없다”를 강조합니다. 이벤트로 같은 일을 하려면 ValueChanged 처리기가 필요하다는 비교. 바인딩의 전체 개념은 20장.</p>' },
          { layout: 'code', title: '{x:Static} · {x:Null}', code: S7, points: ['<code>{x:Static SystemColors.HighlightBrush}</code> Windows 강조색', '<code>{x:Null}</code> = 값 없음(null)', 'null 배경은 클릭을 받지 않는다'],
            notes: '<p><b>[3분]</b> x:Static 은 C# 의 <code>SystemColors.HighlightBrush</code> 를 그대로 가져오는 것. Windows 테마를 따르는 색이 필요할 때 씁니다. x:Null 과 Transparent 의 차이(클릭 여부)는 가볍게 언급.</p>' },
          { layout: 'table', title: '공통 속성', head: ['속성', '값 예'], rows: [['<code>Width</code> · <code>Height</code> · <code>MinWidth</code>', '<code>120</code>, <code>Auto</code>'], ['<code>Margin</code> · <code>Padding</code>', '<code>"10,5"</code>'], ['<code>Horizontal/VerticalAlignment</code>', '<code>Left</code> · <code>Center</code> · <code>Stretch</code>'], ['<code>Visibility</code> · <code>IsEnabled</code> · <code>Opacity</code>', '<code>Collapsed</code>, <code>False</code>, <code>0.5</code>'], ['<code>FontSize</code> · <code>FontWeight</code> · <code>FontFamily</code>', '<code>16</code>, <code>Bold</code>, <code>Consolas</code>'], ['<code>Foreground</code> · <code>Background</code> · <code>ToolTip</code> · <code>Cursor</code>', '<code>Navy</code>, <code>"도움말"</code>, <code>Hand</code>']], lead: 'FrameworkElement 를 물려받은 모든 요소가 공유',
            notes: '<p><b>[5분]</b> 본문 예제 14-8 을 실행해 정렬 · Opacity · IsEnabled · ToolTip · Cursor 를 하나씩 확인합니다. “Opacity 0.4 버튼은 클릭이 될까?” 발문 → 된다!</p><p>Width 를 고정하기보다 부모에 맡기는 것이 WPF 스타일이라는 팁도 전달.</p>' },
          { layout: 'diagram', title: 'Visibility 세 가지', html: SVG_VIS, caption: 'Hidden = 빈자리 유지, Collapsed = 자리도 없음',
            notes: '<p><b>[3분]</b> 비유: Hidden 은 투명 망토(자리는 있음), Collapsed 는 교실에서 나간 것(자리도 치움). 시험에 자주 나오는 차이입니다.</p><p><b>[3분]</b> 본문 예제 14-9 를 실행해 세 줄을 비교하고, 아래 “Visibility 바꾸기” 버튼으로 한 버튼의 상태를 순환시켜 보여 줍니다. XAML 의 <code>"Collapsed"</code> 가 C# 에서는 <code>Visibility.Collapsed</code> 라는 점도 짚으세요. 자주 쓰는 패턴: 조건에 따라 경고 문구를 Collapsed ↔ Visible.</p>' },
          { layout: 'code', title: '예제 14-10. TextBlock 인라인 서식', code: S9, points: ['<code>Run</code> 글자 조각 · <code>Bold</code> · <code>Italic</code> · <code>Underline</code>', '<code>LineBreak</code> 줄 바꿈', '<code>TextWrapping="Wrap"</code> 자동 줄 바꿈', '<code>TextAlignment</code> 는 글자 정렬'],
            notes: '<p><b>[5분]</b> 인라인 태그 사이 줄 바꿈이 공백 한 칸이 되는 규칙을 꼭 설명합니다(붙일 조각은 한 줄에). HorizontalAlignment(요소 위치) 와 TextAlignment(글자 위치) 차이를 질문해 보세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '버튼을 숨기되 <b>자리는 유지</b>하려면?', options: ['<code>Visible</code>', '<code>Hidden</code>', '<code>Collapsed</code>', '<code>Opacity="1"</code>'], answer: 1, explain: 'Hidden = 안 보이지만 자리 차지. Collapsed = 자리도 없음.',
            notes: '<p>이어서 “Opacity 0 과 Hidden 의 차이는?” 을 물어봅니다 → Opacity 0 은 클릭이 된다.</p>' },
          { layout: 'practice', title: '실습 14-3. 명함 카드', desc: '<p>리소스(CardBrush · PointBrush) + 가운데 Border(CornerRadius 12, Padding 20) + 인라인 서식(이름 굵게 · 직함 기울임 · LineBreak) + ToolTip 으로 명함을 만드세요.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[6분]</b> 자기 이름으로 만들게 하면 몰입도가 높습니다. 빨리 끝난 학생은 실습 14-4(투명도 슬라이더)를 하고, 명함에 슬라이더를 붙여 카드 투명도를 조절해 보게 하세요.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>{ }</code> 마크업 확장 = 값을 구해 오는 특별한 방법', '<code>Window.Resources</code> + <code>x:Key</code> → <code>{StaticResource 키}</code>', '<code>{Binding ElementName=…, Path=…}</code> 로 컨트롤 연결', '<code>{x:Null}</code> · <code>{x:Static 형식.멤버}</code>', '공통 속성: 크기 · 여백 · 정렬 · <b>Visibility(Hidden/Collapsed)</b> · Opacity · 글꼴', 'TextBlock 인라인 <code>Run</code> · <code>Bold</code> · <code>LineBreak</code> · <code>TextWrapping</code>'],
            notes: '<p>다음 장(15장): 레이아웃 패널 — Grid · StackPanel · DockPanel 로 화면을 나누고 창 크기에 맞춰 늘어나는 화면 만들기.</p>' }
        ]
      }
    ]
  });
})();
