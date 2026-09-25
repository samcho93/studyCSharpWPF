/* Chapter 19. 스타일 · 리소스 · 템플릿 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- ch19-1 그림: 리소스를 찾는 순서 ---------- */
  const SVG_LOOKUP = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="리소스를 찾는 순서: 요소 자신, 부모 요소, Window, App, 시스템">
  <defs><marker id="ah19a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="640" y="46" text-anchor="middle" style="${MONO};font-size:25px;fill:var(--fg)">&lt;Button Background="{StaticResource PrimaryBrush}"/&gt;</text>
  <text x="640" y="88" text-anchor="middle" style="font-size:22px;fill:var(--muted)">키(PrimaryBrush)를 가까운 곳부터 차례로 찾고, 처음 찾은 것을 쓴 뒤 멈춘다</text>
  <rect x="20" y="125" width="220" height="200" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="130" y="170" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent)">① 요소 자신</text>
  <text x="130" y="215" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">Button.Resources</text>
  <text x="130" y="270" text-anchor="middle" style="font-size:19px;fill:var(--muted)">그 요소만</text>
  <line x1="242" y1="225" x2="270" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19a)"/>
  <rect x="275" y="125" width="220" height="200" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="385" y="170" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent)">② 부모 요소들</text>
  <text x="385" y="215" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">StackPanel · Grid</text>
  <text x="385" y="240" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">.Resources</text>
  <text x="385" y="285" text-anchor="middle" style="font-size:19px;fill:var(--muted)">한 칸씩 위로</text>
  <line x1="497" y1="225" x2="525" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19a)"/>
  <rect x="530" y="125" width="220" height="200" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="640" y="170" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent2)">③ 창</text>
  <text x="640" y="215" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">Window.Resources</text>
  <text x="640" y="270" text-anchor="middle" style="font-size:19px;fill:var(--muted)">이 창 전체</text>
  <line x1="752" y1="225" x2="780" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19a)"/>
  <rect x="785" y="125" width="220" height="200" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="895" y="170" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--ok)">④ 앱 전체</text>
  <text x="895" y="215" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">App.xaml</text>
  <text x="895" y="240" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--fg)">Application.Resources</text>
  <text x="895" y="285" text-anchor="middle" style="font-size:19px;fill:var(--muted)">모든 창</text>
  <line x1="1007" y1="225" x2="1035" y2="225" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19a)"/>
  <rect x="1040" y="125" width="220" height="200" rx="14" fill="var(--card)" stroke="var(--muted)" stroke-width="3"/>
  <text x="1150" y="170" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--muted)">⑤ 시스템</text>
  <text x="1150" y="215" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">SystemColors …</text>
  <text x="1150" y="270" text-anchor="middle" style="font-size:19px;fill:var(--muted)">Windows 기본값</text>
  <line x1="60" y1="380" x2="1220" y2="380" stroke="var(--line)" stroke-width="3"/>
  <text x="60" y="415" style="font-size:21px;fill:var(--fg)">← 좁은 범위 (가까움)</text>
  <text x="1220" y="415" text-anchor="end" style="font-size:21px;fill:var(--fg)">넓은 범위 (멂) →</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:22px;fill:var(--fg)">같은 키가 여러 곳에 있으면 <tspan font-weight="700">가까운 쪽이 이긴다</tspan> (StackPanel 의 PrimaryBrush 가 App 의 것을 가린다)</text>
  <text x="640" y="520" text-anchor="middle" style="font-size:22px;fill:var(--danger);font-weight:700">끝까지 못 찾으면 → 실행할 때 XAML 오류 “리소스를 찾을 수 없습니다”</text>
</svg>`;

  /* ---------- ch19-1 그림: BasedOn 상속 ---------- */
  const SVG_BASEDON = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="BaseButton 을 물려받는 PrimaryButton, DangerButton, BigDangerButton">
  <defs><marker id="ah19b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="430" y="15" width="420" height="150" rx="14" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="640" y="55" text-anchor="middle" style="${MONO};font-size:26px;font-weight:700;fill:var(--fg)">BaseButton</text>
  <text x="640" y="92" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">FontSize 14 · Padding 12,6</text>
  <text x="640" y="120" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">Margin 4 · Foreground White</text>
  <text x="640" y="148" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">Background Gray</text>
  <line x1="540" y1="168" x2="300" y2="228" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah19b)"/>
  <line x1="740" y1="168" x2="980" y2="228" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah19b)"/>
  <text x="330" y="190" text-anchor="middle" style="font-size:20px;fill:var(--muted)">BasedOn</text>
  <text x="950" y="190" text-anchor="middle" style="font-size:20px;fill:var(--muted)">BasedOn</text>
  <rect x="80" y="235" width="420" height="110" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="290" y="275" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--accent)">PrimaryButton</text>
  <text x="290" y="315" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">+ Background 파랑</text>
  <rect x="780" y="235" width="420" height="110" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="990" y="275" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--danger)">DangerButton</text>
  <text x="990" y="315" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">+ Background 빨강 · + FontWeight Bold</text>
  <line x1="990" y1="348" x2="990" y2="398" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah19b)"/>
  <rect x="780" y="405" width="420" height="110" rx="14" fill="var(--card)" stroke="var(--danger)" stroke-width="3" stroke-dasharray="8 5"/>
  <text x="990" y="445" text-anchor="middle" style="${MONO};font-size:24px;font-weight:700;fill:var(--danger)">BigDangerButton</text>
  <text x="990" y="485" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">+ FontSize 18 (덮어씀)</text>
  <text x="80" y="410" style="font-size:22px;font-weight:700;fill:var(--fg)">BigDangerButton 의 최종 값</text>
  <text x="80" y="448" style="${MONO};font-size:19px;fill:var(--fg)">FontSize 18       ← 자기 자신</text>
  <text x="80" y="478" style="${MONO};font-size:19px;fill:var(--fg)">Background 빨강 · Bold ← DangerButton</text>
  <text x="80" y="508" style="${MONO};font-size:19px;fill:var(--fg)">Padding · Margin · Foreground ← BaseButton</text>
  <text x="80" y="545" style="font-size:19px;fill:var(--muted)">같은 속성은 “자식” 스타일의 값이 이긴다</text>
</svg>`;

  /* ---------- ch19-2 그림: 스타일 · 컨트롤 템플릿 · 데이터 템플릿 ---------- */
  const SVG_THREE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Style, ControlTemplate, DataTemplate 비교">
  <defs><marker id="ah19c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="20" y="20" width="400" height="420" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="220" y="62" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent)">Style</text>
  <text x="220" y="98" text-anchor="middle" style="font-size:21px;fill:var(--muted)">속성 값 묶음</text>
  <rect x="90" y="140" width="260" height="56" rx="3" fill="#1976D2" stroke="#0D47A1" stroke-width="2"/>
  <text x="220" y="176" text-anchor="middle" style="font-size:22px;fill:#fff">저장</text>
  <rect x="90" y="220" width="260" height="56" rx="3" fill="#D32F2F" stroke="#8E0000" stroke-width="2"/>
  <text x="220" y="256" text-anchor="middle" style="font-size:22px;fill:#fff;font-weight:700">삭제</text>
  <text x="220" y="330" text-anchor="middle" style="font-size:20px;fill:var(--fg)">네모난 버튼 모양은 그대로,</text>
  <text x="220" y="360" text-anchor="middle" style="font-size:20px;fill:var(--fg)">색 · 크기 · 여백만 바꾼다</text>
  <text x="220" y="410" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">Setter Property="…"</text>
  <rect x="440" y="20" width="400" height="420" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="640" y="62" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--warn)">ControlTemplate</text>
  <text x="640" y="98" text-anchor="middle" style="font-size:21px;fill:var(--muted)">컨트롤의 생김새 전체</text>
  <rect x="510" y="140" width="260" height="56" rx="28" fill="#43A047"/>
  <text x="640" y="176" text-anchor="middle" style="font-size:22px;fill:#fff">둥근 버튼</text>
  <circle cx="640" cy="250" r="30" fill="#FB8C00"/>
  <text x="640" y="258" text-anchor="middle" style="font-size:24px;fill:#fff">＋</text>
  <text x="640" y="330" text-anchor="middle" style="font-size:20px;fill:var(--fg)">Click 같은 기능은 그대로,</text>
  <text x="640" y="360" text-anchor="middle" style="font-size:20px;fill:var(--fg)">모양을 처음부터 새로 그린다</text>
  <text x="640" y="410" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">Template 속성</text>
  <rect x="860" y="20" width="400" height="420" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1060" y="62" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--ok)">DataTemplate</text>
  <text x="1060" y="98" text-anchor="middle" style="font-size:21px;fill:var(--muted)">데이터 → 화면</text>
  <rect x="890" y="125" width="340" height="62" rx="6" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="1060" y="152" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">Student { Name = "김민준",</text>
  <text x="1060" y="176" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">Score = 95 }</text>
  <line x1="1060" y1="190" x2="1060" y2="218" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19c)"/>
  <rect x="910" y="225" width="300" height="70" rx="8" fill="none" stroke="var(--ok)" stroke-width="2"/>
  <circle cx="950" cy="260" r="22" fill="#26A69A"/>
  <text x="950" y="268" text-anchor="middle" style="font-size:20px;fill:#fff;font-weight:700">김</text>
  <text x="985" y="254" style="font-size:20px;font-weight:700;fill:var(--fg)">김민준</text>
  <text x="985" y="282" style="font-size:17px;fill:var(--muted)">점수 95점</text>
  <text x="1060" y="330" text-anchor="middle" style="font-size:20px;fill:var(--fg)">ListBox 항목 · Content 에 들어온</text>
  <text x="1060" y="360" text-anchor="middle" style="font-size:20px;fill:var(--fg)">데이터 객체를 어떻게 그릴지</text>
  <text x="1060" y="410" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--muted)">ItemTemplate · DataType</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:23px;fill:var(--fg)">셋 다 <tspan font-weight="700">Resources 에 두고 이름(x:Key)으로 다시 쓴다</tspan> — 앱 전체 디자인의 재료</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:21px;fill:var(--muted)">이 강좌의 브라우저 실행: Style ✔ · DataTemplate ✔ · ControlTemplate ✘ (Visual Studio 에서 확인)</text>
</svg>`;

  /* ---------- ch19-2 그림: 라이트 / 다크 전환 ---------- */
  const SVG_THEME = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="라이트, 다크 두 브러시 세트 중 하나를 골라 요소에 적용">
  <defs><marker id="ah19d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="30" y="30" width="420" height="220" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="240" y="68" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">☀ 라이트 세트</text>
  <rect x="60" y="92" width="36" height="36" rx="4" fill="#F5F5F5" stroke="#999"/><text x="108" y="118" style="${MONO};font-size:19px;fill:var(--fg)">LightBg</text>
  <rect x="250" y="92" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#999"/><text x="298" y="118" style="${MONO};font-size:19px;fill:var(--fg)">LightCard</text>
  <rect x="60" y="150" width="36" height="36" rx="4" fill="#212121" stroke="#999"/><text x="108" y="176" style="${MONO};font-size:19px;fill:var(--fg)">LightText</text>
  <rect x="250" y="150" width="36" height="36" rx="4" fill="#757575" stroke="#999"/><text x="298" y="176" style="${MONO};font-size:19px;fill:var(--fg)">LightSub</text>
  <text x="240" y="230" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Window.Resources 의 브러시 4개</text>
  <rect x="30" y="290" width="420" height="220" rx="14" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="240" y="328" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">🌙 다크 세트</text>
  <rect x="60" y="352" width="36" height="36" rx="4" fill="#121212" stroke="#999"/><text x="108" y="378" style="${MONO};font-size:19px;fill:var(--fg)">DarkBg</text>
  <rect x="250" y="352" width="36" height="36" rx="4" fill="#1E1E1E" stroke="#999"/><text x="298" y="378" style="${MONO};font-size:19px;fill:var(--fg)">DarkCard</text>
  <rect x="60" y="410" width="36" height="36" rx="4" fill="#EEEEEE" stroke="#999"/><text x="108" y="436" style="${MONO};font-size:19px;fill:var(--fg)">DarkText</text>
  <rect x="250" y="410" width="36" height="36" rx="4" fill="#9E9E9E" stroke="#999"/><text x="298" y="436" style="${MONO};font-size:19px;fill:var(--fg)">DarkSub</text>
  <text x="240" y="490" text-anchor="middle" style="font-size:18px;fill:var(--muted)">같은 이름 규칙: 접두어 + 역할</text>
  <line x1="452" y1="140" x2="520" y2="230" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19d)"/>
  <line x1="452" y1="400" x2="520" y2="310" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19d)"/>
  <rect x="525" y="200" width="300" height="140" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="675" y="238" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">ApplyTheme()</text>
  <text x="675" y="275" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">FindResource(</text>
  <text x="675" y="300" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">(isDark ? "Dark" : "Light") + "Bg")</text>
  <text x="675" y="327" text-anchor="middle" style="font-size:16px;fill:var(--muted)">→ 요소.Background = 브러시</text>
  <line x1="827" y1="270" x2="880" y2="270" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah19d)"/>
  <rect x="885" y="80" width="365" height="380" rx="10" fill="#121212" stroke="var(--muted)" stroke-width="2"/>
  <rect x="885" y="80" width="365" height="36" rx="10" fill="#2A2A2A"/>
  <text x="905" y="105" style="font-size:17px;fill:#BDBDBD">라이트 / 다크 모드</text>
  <text x="910" y="160" style="font-size:24px;font-weight:700;fill:#EEEEEE">오늘의 할 일</text>
  <rect x="1115" y="138" width="115" height="32" rx="4" fill="#333" stroke="#666"/>
  <text x="1172" y="160" text-anchor="middle" style="font-size:15px;fill:#EEEEEE">☀ 라이트</text>
  <rect x="905" y="190" width="325" height="80" rx="8" fill="#1E1E1E"/>
  <text x="925" y="225" style="font-size:19px;fill:#EEEEEE">WPF 스타일 복습하기</text>
  <text x="925" y="252" style="font-size:16px;fill:#9E9E9E">19장 · 오후 3시</text>
  <rect x="905" y="285" width="325" height="80" rx="8" fill="#1E1E1E"/>
  <text x="925" y="320" style="font-size:19px;fill:#EEEEEE">다크 모드 만들어 보기</text>
  <text x="925" y="347" style="font-size:16px;fill:#9E9E9E">실습 19-4 · 오후 5시</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:21px;fill:var(--muted)">버튼을 누를 때마다 사용할 세트를 바꾸고, 코드로 각 요소의 Background · Foreground 를 다시 넣는다</text>
</svg>`;

  /* ================= 실습 코드 ================= */
  const P1_HEAD = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice1.MainWindow"
        ${NS}
        Title="카드형 버튼 스타일 세트" Width="460" Height="300">
    <Window.Resources>
        <!-- 기본 카드 버튼 (완성됨) -->
        <Style x:Key="CardButton" TargetType="Button">
            <Setter Property="Background" Value="White"/>
            <Setter Property="Foreground" Value="#333333"/>
            <Setter Property="BorderBrush" Value="#CCCCCC"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="FontSize" Value="14"/>
            <Setter Property="Padding" Value="14,8"/>
            <Setter Property="Margin" Value="5"/>
        </Style>`;
  const P1_CS = `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19Practice1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var b = (Button)sender;
            txtInfo.Text = $"[{b.Content}] FontSize = {b.FontSize}, Padding = {b.Padding}\\n"
                         + "BasedOn 으로 만든 스타일은 CardButton 의 글자 크기 · 여백을 그대로 물려받습니다.";
        }
    }
}
`;
  const P1_STARTER = `${P1_HEAD}
        <!-- TODO 1: CardButton 을 BasedOn 으로 물려받는 AccentCardButton
                     (배경 #1976D2, 글자 White, 테두리 #1976D2) -->
        <!-- TODO 2: CardButton 을 BasedOn 으로 물려받는 DangerCardButton
                     (배경 #FFEBEE, 글자 · 테두리 #C62828, 굵게) -->
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="게시글 관리" FontSize="18" FontWeight="Bold" Margin="5,0,0,8"/>
        <WrapPanel>
            <!-- TODO 3: 저장 → AccentCardButton, 삭제 → DangerCardButton -->
            <Button Content="취소" Style="{StaticResource CardButton}" Click="Button_Click"/>
            <Button Content="임시 저장" Style="{StaticResource CardButton}" Click="Button_Click"/>
            <Button Content="저장" Style="{StaticResource CardButton}" Click="Button_Click"/>
            <Button Content="삭제" Style="{StaticResource CardButton}" Click="Button_Click"/>
        </WrapPanel>
        <TextBlock x:Name="txtInfo" Margin="5,12,0,0" TextWrapping="Wrap" Foreground="DimGray"
                   Text="버튼을 누르면 글자 크기와 여백을 보여 줍니다."/>
    </StackPanel>
</Window>
${P1_CS}`;
  const P1_SOLUTION = `${P1_HEAD}
        <!-- 강조: 기본 모양은 물려받고 색만 바꾼다 -->
        <Style x:Key="AccentCardButton" TargetType="Button" BasedOn="{StaticResource CardButton}">
            <Setter Property="Background" Value="#1976D2"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="BorderBrush" Value="#1976D2"/>
        </Style>
        <!-- 위험: 연한 빨강 배경 + 진한 빨강 글자 + 굵게 -->
        <Style x:Key="DangerCardButton" TargetType="Button" BasedOn="{StaticResource CardButton}">
            <Setter Property="Background" Value="#FFEBEE"/>
            <Setter Property="Foreground" Value="#C62828"/>
            <Setter Property="BorderBrush" Value="#C62828"/>
            <Setter Property="FontWeight" Value="Bold"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="게시글 관리" FontSize="18" FontWeight="Bold" Margin="5,0,0,8"/>
        <WrapPanel>
            <Button Content="취소" Style="{StaticResource CardButton}" Click="Button_Click"/>
            <Button Content="임시 저장" Style="{StaticResource CardButton}" Click="Button_Click"/>
            <Button Content="저장" Style="{StaticResource AccentCardButton}" Click="Button_Click"/>
            <Button Content="삭제" Style="{StaticResource DangerCardButton}" Click="Button_Click"/>
        </WrapPanel>
        <TextBlock x:Name="txtInfo" Margin="5,12,0,0" TextWrapping="Wrap" Foreground="DimGray"
                   Text="버튼을 누르면 글자 크기와 여백을 보여 줍니다."/>
    </StackPanel>
</Window>
${P1_CS}`;

  const P2_FORM = `        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <Label Content="이름"/>
        <TextBox x:Name="txtName" Grid.Column="1"/>
        <Label Content="이메일" Grid.Row="1"/>
        <TextBox x:Name="txtEmail" Grid.Row="1" Grid.Column="1"/>
        <Label Content="전화번호" Grid.Row="2"/>
        <TextBox x:Name="txtPhone" Grid.Row="2" Grid.Column="1"/>
        <Label Content="메모" Grid.Row="3"/>
        <TextBox x:Name="txtMemo" Grid.Row="3" Grid.Column="1"/>
        <Button Content="저장" Grid.Row="4" Grid.Column="1" HorizontalAlignment="Right"
                Padding="14,4" Margin="0,8,0,0" Click="btnSave_Click"/>
        <TextBlock x:Name="txtResult" Grid.Row="5" Grid.ColumnSpan="2" TextWrapping="Wrap"
                   Foreground="SteelBlue" Margin="0,8,0,0"/>
    </Grid>
</Window>`;
  const P2_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice2.MainWindow"
        ${NS}
        Title="회원 정보 입력" Width="420" Height="340">
    <Grid Margin="15">
        <!-- TODO 1: 여기(Grid 의 맨 앞)에 <Grid.Resources> 를 만들고 -->
        <!-- TODO 2: x:Key 없는 Label 스타일 (굵게, 글자색 #455A64, 세로 가운데 정렬) -->
        <!-- TODO 3: x:Key 없는 TextBox 스타일 (Margin 0,4 · Padding 4,2 · FontSize 14 · 테두리 SteelBlue) -->
${P2_FORM}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch19Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 이름 · 이메일 · 전화번호를 txtResult 에 보여 주기
        }
    }
}
`;
  const P2_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice2.MainWindow"
        ${NS}
        Title="회원 정보 입력" Width="420" Height="340">
    <Grid Margin="15">
        <Grid.Resources>
            <!-- x:Key 가 없으므로 이 Grid 안의 모든 Label · TextBox 에 자동 적용 -->
            <Style TargetType="Label">
                <Setter Property="FontWeight" Value="Bold"/>
                <Setter Property="Foreground" Value="#455A64"/>
                <Setter Property="VerticalAlignment" Value="Center"/>
            </Style>
            <Style TargetType="TextBox">
                <Setter Property="Margin" Value="0,4"/>
                <Setter Property="Padding" Value="4,2"/>
                <Setter Property="FontSize" Value="14"/>
                <Setter Property="BorderBrush" Value="SteelBlue"/>
            </Style>
        </Grid.Resources>
${P2_FORM}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19Practice2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtName.Text = "이서연";
            txtEmail.Text = "seoyeon@example.com";
        }

        private void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (txtName.Text.Trim() == "")
            {
                txtResult.Foreground = Brushes.Red;
                txtResult.Text = "이름을 입력하세요.";
                return;
            }
            txtResult.Foreground = Brushes.SteelBlue;
            txtResult.Text = $"저장됨: {txtName.Text} / {txtEmail.Text} / {txtPhone.Text}";
        }
    }
}
`;

  const P3_CS = `// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;

namespace Ch19Practice3
{
    public class Contact
    {
        public string Name { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Group { get; set; } = "";
        public string Initial => Name.Substring(0, 1);   // 이름의 첫 글자
        public override string ToString() => Name;       // 템플릿이 없을 때 보이는 글자
    }

    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstContacts.ItemsSource = new List<Contact>
            {
                new Contact { Name = "김민준", Phone = "010-1234-5678", Group = "가족" },
                new Contact { Name = "이서연", Phone = "010-2345-6789", Group = "친구" },
                new Contact { Name = "박지호", Phone = "010-3456-7890", Group = "학교" },
                new Contact { Name = "최하은", Phone = "010-4567-8901", Group = "친구" }
            };
        }

        private void lstContacts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lstContacts.SelectedItem is Contact c)
                txtSelected.Text = $"선택: {c.Name} ({c.Phone})";
        }
    }
}
`;
  const P3_STARTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice3.MainWindow"
        ${NS}
        Title="연락처 카드" Width="420" Height="380">
    <Window.Resources>
        <!-- TODO 1: x:Key="ContactCard" 인 DataTemplate 만들기
             - 왼쪽: 동그라미(Border, CornerRadius = 크기의 절반) 안에 {Binding Initial}
             - 가운데: Name(굵게) 과 Phone(회색) 을 위아래로
             - 오른쪽: Group (작은 글씨) -->
    </Window.Resources>
    <DockPanel Margin="10">
        <TextBlock DockPanel.Dock="Top" Text="연락처" FontSize="18" FontWeight="Bold" Margin="0,0,0,6"/>
        <TextBlock x:Name="txtSelected" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="SteelBlue"/>
        <!-- TODO 2: ItemTemplate="{StaticResource ContactCard}" 연결 -->
        <ListBox x:Name="lstContacts" SelectionChanged="lstContacts_SelectionChanged"/>
    </DockPanel>
</Window>
${P3_CS}`;
  const P3_SOLUTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice3.MainWindow"
        ${NS}
        Title="연락처 카드" Width="420" Height="380">
    <Window.Resources>
        <DataTemplate x:Key="ContactCard">
            <Border BorderBrush="#E0E0E0" BorderThickness="0,0,0,1" Padding="4,6">
                <StackPanel Orientation="Horizontal">
                    <Border Width="40" Height="40" CornerRadius="20" Background="#7E57C2">
                        <TextBlock Text="{Binding Initial}" Foreground="White" FontSize="16" FontWeight="Bold"
                                   HorizontalAlignment="Center" VerticalAlignment="Center"/>
                    </Border>
                    <StackPanel Margin="10,0,0,0" VerticalAlignment="Center" Width="150">
                        <TextBlock Text="{Binding Name}" FontWeight="Bold" FontSize="14"/>
                        <TextBlock Text="{Binding Phone}" Foreground="Gray"/>
                    </StackPanel>
                    <TextBlock Text="{Binding Group}" FontSize="11" Foreground="#7E57C2" VerticalAlignment="Center"/>
                </StackPanel>
            </Border>
        </DataTemplate>
    </Window.Resources>
    <DockPanel Margin="10">
        <TextBlock DockPanel.Dock="Top" Text="연락처" FontSize="18" FontWeight="Bold" Margin="0,0,0,6"/>
        <TextBlock x:Name="txtSelected" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="SteelBlue"/>
        <ListBox x:Name="lstContacts" ItemTemplate="{StaticResource ContactCard}"
                 SelectionChanged="lstContacts_SelectionChanged"/>
    </DockPanel>
</Window>
${P3_CS}`;

  const P4_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Practice4.MainWindow"
        ${NS}
        Title="메모장 — 라이트 / 다크" Width="420" Height="340">
    <Window.Resources>
        <SolidColorBrush x:Key="LightBg" Color="#FAFAFA"/>
        <SolidColorBrush x:Key="LightBox" Color="White"/>
        <SolidColorBrush x:Key="LightText" Color="#212121"/>
        <SolidColorBrush x:Key="DarkBg" Color="#181A1B"/>
        <SolidColorBrush x:Key="DarkBox" Color="#2B2E30"/>
        <SolidColorBrush x:Key="DarkText" Color="#E8E6E3"/>
    </Window.Resources>
    <Border x:Name="root" Background="{StaticResource LightBg}" Padding="12">
        <DockPanel>
            <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
                <Button x:Name="btnTheme" Content="🌙 다크 모드" DockPanel.Dock="Right" Padding="10,4"
                        Click="btnTheme_Click"/>
                <TextBlock x:Name="txtTitle" Text="내 메모" FontSize="20" FontWeight="Bold"
                           Foreground="{StaticResource LightText}" VerticalAlignment="Center"/>
            </DockPanel>
            <TextBlock x:Name="txtStatus" DockPanel.Dock="Bottom" Margin="0,6,0,0"
                       Foreground="{StaticResource LightText}" Text="지금은 라이트 테마"/>
            <TextBox x:Name="txtMemo" AcceptsReturn="True" TextWrapping="Wrap" FontSize="14" Padding="6"
                     Background="{StaticResource LightBox}" Foreground="{StaticResource LightText}"
                     Text="밤에는 다크 모드가 눈이 편해요."/>
        </DockPanel>
    </Border>
</Window>
`;
  const P4_STARTER = `${P4_XAML}// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19Practice4
{
    public partial class MainWindow : Window
    {
        // TODO 0: 지금 다크 테마인지 기억할 bool 필드 isDark 만들기

        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnTheme_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: isDark 를 반대로 바꾸기
            // TODO 2: 접두어("Light" / "Dark") + 역할("Bg" · "Box" · "Text") 로 FindResource 해서
            //         root.Background, txtMemo.Background / Foreground, txtTitle · txtStatus.Foreground 에 넣기
            // TODO 3: 버튼 글자("☀ 라이트 모드" / "🌙 다크 모드") 와 txtStatus 글자 바꾸기
        }
    }
}
`;
  const P4_SOLUTION = `${P4_XAML}// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19Practice4
{
    public partial class MainWindow : Window
    {
        private bool isDark = false;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnTheme_Click(object sender, RoutedEventArgs e)
        {
            isDark = !isDark;
            ApplyTheme();
        }

        // "Bg" → "LightBg" 또는 "DarkBg" 리소스를 찾아 돌려준다
        private Brush Theme(string role) => (Brush)FindResource((isDark ? "Dark" : "Light") + role);

        private void ApplyTheme()
        {
            root.Background = Theme("Bg");
            txtMemo.Background = Theme("Box");
            txtMemo.Foreground = Theme("Text");
            txtTitle.Foreground = Theme("Text");
            txtStatus.Foreground = Theme("Text");
            btnTheme.Content = isDark ? "☀ 라이트 모드" : "🌙 다크 모드";
            txtStatus.Text = isDark ? "지금은 다크 테마" : "지금은 라이트 테마";
        }
    }
}
`;

  CS_COURSE.addChapter({
    id: 'ch19',
    no: '19',
    title: '스타일 · 리소스 · 템플릿',
    subtitle: 'Styles, Resources & Templates',
    summary: '같은 색 · 글꼴 · 여백을 버튼마다 반복해 적는 문제를 리소스와 스타일로 해결합니다. StaticResource 로 브러시를 재사용하고, 명시적 · 암시적 스타일과 BasedOn 상속, App.xaml 전역 스타일, 리소스 사전 파일(MergedDictionaries)로 테마 색상표를 만듭니다. 이어서 마우스 올림 트리거, 리소스로 공유하는 DataTemplate 과 DataType 자동 적용, ControlTemplate 의 개념, 라이트/다크 모드 전환으로 앱 전체의 일관된 디자인을 완성합니다.',
    goals: [
      '리소스(x:Key)를 정의하고 StaticResource 로 재사용하며, 리소스를 찾는 순서를 설명할 수 있다',
      'Style · Setter 로 명시적 스타일과 암시적 스타일을 만들고 BasedOn 으로 확장할 수 있다',
      'App.xaml 과 별도 리소스 사전 파일(MergedDictionaries)에 전역 스타일과 색상표를 둘 수 있다',
      '스타일 트리거(IsMouseOver 등)와 DataTrigger 의 역할을 설명하고, 코드로 스타일을 바꿀 수 있다',
      'DataTemplate 을 리소스로 공유하거나 DataType 으로 자동 적용하고, ControlTemplate 이 무엇을 바꾸는지 설명할 수 있다',
      '두 브러시 세트로 라이트/다크 모드 전환을 구현할 수 있다'
    ],
    sections: [
      /* ===================== ch19-1 ===================== */
      {
        id: 'ch19-1',
        title: '리소스와 스타일',
        minutes: 50,
        goals: [
          '같은 속성을 반복해 적을 때의 문제를 설명할 수 있다',
          'Window.Resources 에 브러시 · 숫자 · 문자열 리소스를 만들고 StaticResource 로 사용할 수 있다',
          '리소스를 찾는 순서(요소 → 부모 → Window → App → 시스템)를 설명할 수 있다',
          'x:Key 가 있는 명시적 스타일과 x:Key 가 없는 암시적 스타일을 만들 수 있다',
          'BasedOn 으로 스타일을 상속하고, 지역 속성이 스타일보다 우선함을 설명할 수 있다',
          'App.xaml 과 Styles.xaml(MergedDictionaries)에 테마 색상표와 스타일을 둘 수 있다'
        ],
        flow: [['도입: 반복되는 속성', 5], ['리소스 · StaticResource · 찾는 순서', 10], ['스타일 · 암시적 · BasedOn', 15], ['App.xaml · 리소스 사전 · 색상표', 10], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '버튼 10개에 같은 색을 칠하려면?' },
          { type: 'p', html: '지금까지는 버튼마다 <code>Background="SteelBlue" Foreground="White" FontSize="15" …</code> 처럼 속성을 하나하나 적었습니다. 버튼이 서너 개일 때는 괜찮지만, 앱이 커져 같은 모양의 버튼이 10개, 20개가 되면 문제가 생깁니다. <b>디자인을 바꾸라는 요청</b>이 오면(“파란색 말고 초록색으로!”) 모든 버튼을 찾아다니며 고쳐야 하고, 하나라도 빠뜨리면 그 버튼만 색이 다릅니다.' },
          { type: 'code', title: '예제 19-1. 문제 상황 — 같은 속성을 버튼마다 반복', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Repeat.MainWindow"
        ${NS}
        Title="반복되는 속성" Width="420" Height="340">
    <StackPanel Margin="15">
        <TextBlock Text="카페 메뉴" FontSize="18" FontWeight="Bold" Margin="0,0,0,8"/>
        <Button Content="아메리카노" Background="SteelBlue" Foreground="White" FontSize="15" Padding="8,4" Margin="0,3" Click="Menu_Click"/>
        <Button Content="카페라테" Background="SteelBlue" Foreground="White" FontSize="15" Padding="8,4" Margin="0,3" Click="Menu_Click"/>
        <Button Content="바닐라라테" Background="SteelBlue" Foreground="White" FontSize="15" Padding="8,4" Margin="0,3" Click="Menu_Click"/>
        <Button Content="녹차라테" Background="SteelBlue" Foreground="White" FontSize="15" Padding="8,4" Margin="0,3" Click="Menu_Click"/>
        <Button Content="레몬에이드" Background="SteelBlue" Foreground="White" FontSize="15" Padding="8,4" Margin="0,3" Click="Menu_Click"/>
        <TextBlock x:Name="txtInfo" Margin="0,10,0,0" TextWrapping="Wrap" Foreground="DimGray"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19Repeat
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = "버튼 5개 × 같은 속성 5개 = 25번을 똑같이 적었습니다.";
        }

        private void Menu_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            txtInfo.Text = $"{btn.Content} 주문! 그런데 버튼 색을 초록으로 바꾸려면 5곳을 모두 고쳐야 합니다.";
        }
    }
}`, desc: '화면은 멀쩡하지만 XAML 을 보면 <b>같은 속성 5개가 5번</b> 반복됩니다. 이번 교시에서는 이 반복을 두 단계로 없앱니다. ① 값 하나(색 · 크기)에 이름을 붙여 재사용하는 <b>리소스(resource)</b>, ② 여러 속성을 한 묶음으로 만드는 <b>스타일(style)</b>입니다. 웹의 CSS 를 알고 있다면 “WPF 판 CSS”라고 생각해도 좋습니다.' },

          { type: 'h', text: '리소스 — 값에 이름(x:Key)을 붙여 재사용하기' },
          { type: 'p', html: '<b>리소스(resource)</b>는 여러 곳에서 함께 쓰려고 <b>이름을 붙여 보관해 둔 객체</b>입니다. 모든 요소에는 <code>Resources</code> 라는 사전(dictionary)이 있어서, <code>&lt;Window.Resources&gt;</code> 안에 객체를 만들고 <code>x:Key="이름"</code> 을 붙이면 됩니다. 쓰는 쪽에서는 속성 값 자리에 <code>{StaticResource 이름}</code> 이라고 적습니다. 중괄호 <code>{ }</code> 는 “이건 글자가 아니라 <b>마크업 확장</b>이다”라는 표시로, 18장의 <code>{Binding}</code> 과 같은 문법입니다.' },
          { type: 'table', head: ['리소스로 둘 수 있는 것', 'XAML 예', '쓰는 곳'], rows: [
            ['<b>브러시</b> (색)', '<code>&lt;SolidColorBrush x:Key="PrimaryBrush" Color="#2E7D32"/&gt;</code>', 'Background, Foreground, BorderBrush'],
            ['<b>숫자</b> (double)', '<code>&lt;sys:Double x:Key="TitleSize"&gt;22&lt;/sys:Double&gt;</code>', 'FontSize, Width, Height'],
            ['<b>문자열</b>', '<code>&lt;sys:String x:Key="ShopName"&gt;초록 가게&lt;/sys:String&gt;</code>', 'Text, Content, Title'],
            ['<b>여백</b> (Thickness)', '<code>&lt;Thickness x:Key="CardPadding"&gt;12&lt;/Thickness&gt;</code>', 'Margin, Padding (※ 브라우저 실행기는 미지원 — Visual Studio 에서 확인)'],
            ['<b>스타일 · 템플릿</b>', '<code>&lt;Style x:Key="…"&gt;</code>, <code>&lt;DataTemplate x:Key="…"&gt;</code>', 'Style, ItemTemplate (이번 장의 주인공)']
          ], caption: '<code>sys:</code> 접두사는 <code>xmlns:sys="clr-namespace:System;assembly=System.Runtime"</code> 을 Window 태그에 추가해야 쓸 수 있습니다' },
          { type: 'code', title: '예제 19-2. Window.Resources 와 StaticResource', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19Resources.MainWindow"
        ${NS}
        xmlns:sys="clr-namespace:System;assembly=System.Runtime"
        Title="리소스 사용하기" Width="420" Height="340">
    <Window.Resources>
        <SolidColorBrush x:Key="PrimaryBrush" Color="#2E7D32"/>
        <SolidColorBrush x:Key="LightBrush" Color="#E8F5E9"/>
        <sys:Double x:Key="TitleSize">22</sys:Double>
        <sys:String x:Key="ShopName">초록 채소 가게</sys:String>
    </Window.Resources>
    <Border Background="{StaticResource LightBrush}" Padding="15">
        <StackPanel>
            <TextBlock Text="{StaticResource ShopName}" FontSize="{StaticResource TitleSize}"
                       Foreground="{StaticResource PrimaryBrush}" FontWeight="Bold"/>
            <TextBlock Text="같은 색을 여러 곳에서 이름(x:Key)으로 불러 씁니다." Margin="0,4,0,10"/>
            <Button Content="주문하기" Background="{StaticResource PrimaryBrush}" Foreground="White"
                    Padding="8,4" Margin="0,3"/>
            <Button Content="장바구니" Background="{StaticResource PrimaryBrush}" Foreground="White"
                    Padding="8,4" Margin="0,3"/>
            <Button Content="코드에서 리소스 꺼내 보기" Padding="8,4" Margin="0,10,0,3" Click="btnFind_Click"/>
            <TextBlock x:Name="txtInfo" TextWrapping="Wrap" Margin="0,6,0,0"/>
        </StackPanel>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19Resources
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = $"Window.Resources 에 리소스 {Resources.Count}개가 있습니다.";
        }

        private void btnFind_Click(object sender, RoutedEventArgs e)
        {
            // FindResource: 키로 리소스를 찾아 돌려준다 (못 찾으면 예외) → 알맞은 형식으로 변환해서 사용
            var brush = (SolidColorBrush)FindResource("PrimaryBrush");
            double size = (double)FindResource("TitleSize");
            txtInfo.Foreground = brush;
            txtInfo.Text = $"PrimaryBrush 의 색 = {brush.Color}, TitleSize = {size}";
        }
    }
}`, desc: '초록색은 <code>PrimaryBrush</code> 한 곳에만 적혀 있습니다. <code>Color="#2E7D32"</code> 를 다른 색으로 바꾸고 실행하면 제목 · 두 버튼의 색이 <b>한꺼번에</b> 바뀝니다. 코드 비하인드에서는 <code>FindResource("키")</code> 로 같은 리소스를 꺼낼 수 있고, 결과가 <code>object</code> 이므로 <code>(SolidColorBrush)</code> 처럼 변환해서 씁니다. (찾지 못해도 예외를 내지 않는 <code>TryFindResource</code> 도 있습니다 — 못 찾으면 <code>null</code>.)' },
          { type: 'callout', kind: 'warn', title: 'StaticResource 는 “위에서 먼저” 정의해야 해요', html: '<code>StaticResource</code> 는 XAML 을 읽는 순간 <b>한 번</b> 리소스를 찾아 값을 넣습니다. 그래서 리소스 정의가 사용하는 곳보다 <b>앞(위)</b>에 있어야 합니다. <code>&lt;Window.Resources&gt;</code> 를 창의 맨 위에 두는 이유입니다. 키 이름을 잘못 적으면(대소문자도 구별!) 실행할 때 <b>“리소스를 찾을 수 없습니다”</b> XAML 오류로 창이 뜨지 않습니다.' },
          { type: 'h', text: '리소스를 찾는 순서' },
          { type: 'p', html: '<code>{StaticResource PrimaryBrush}</code> 를 만나면 WPF 는 그 요소 자신의 <code>Resources</code> 부터 시작해 <b>부모 → 그 부모 → … → Window → App → 시스템</b> 순서로 올라가며 찾습니다. 처음 찾은 것을 쓰고 멈추므로, 같은 키가 여러 곳에 있으면 <b>가까운 쪽이 이깁니다</b>. 창 하나에서만 쓸 리소스는 <code>Window.Resources</code>, 앱 전체에서 쓸 리소스는 <code>App.xaml</code> 에 둡니다.' },
          { type: 'figure', html: SVG_LOOKUP, caption: '리소스는 가까운 곳(좁은 범위)부터 먼 곳(넓은 범위)으로 찾아 올라간다' },

          { type: 'h', text: '스타일 — 속성 묶음에 이름 붙이기' },
          { type: 'p', html: '리소스로 “색 하나”는 재사용할 수 있지만, 버튼마다 <code>Background · Foreground · FontSize · Padding · Margin</code> 다섯 속성을 적는 일은 그대로입니다. <b>스타일(Style)</b>은 이런 <b>속성 설정 여러 개를 한 묶음</b>으로 만든 것입니다. <code>&lt;Style TargetType="Button"&gt;</code> 안에 <code>&lt;Setter Property="속성 이름" Value="값"/&gt;</code> 을 필요한 만큼 넣고, 버튼에서는 <code>Style="{StaticResource 이름}"</code> 한 줄만 적습니다.' },
          { type: 'list', items: [
            '<code>TargetType</code> — 이 스타일을 적용할 요소의 형식 (Button, TextBlock, Border …). Setter 에는 그 형식이 가진 속성만 쓸 수 있습니다.',
            '<code>Setter</code> — <code>Property</code>(속성 이름)와 <code>Value</code>(값) 한 쌍. XAML 속성에 적던 값을 그대로 적습니다. <code>Value="{StaticResource PrimaryBrush}"</code> 처럼 리소스를 넣어도 됩니다.',
            '<code>x:Key</code> — 스타일의 이름. 이름이 있으면 <b>명시적 스타일</b>(골라서 적용), 없으면 <b>암시적 스타일</b>(자동 적용)이 됩니다.'
          ] },
          { type: 'code', title: '예제 19-3. 명시적 스타일(x:Key)과 지역 속성', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19ExplicitStyle.MainWindow"
        ${NS}
        Title="명시적 스타일 (x:Key)" Width="420" Height="360">
    <Window.Resources>
        <Style x:Key="MenuButton" TargetType="Button">
            <Setter Property="Background" Value="SteelBlue"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="FontSize" Value="15"/>
            <Setter Property="Padding" Value="8,4"/>
            <Setter Property="Margin" Value="0,3"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="카페 메뉴" FontSize="18" FontWeight="Bold" Margin="0,0,0,8"/>
        <Button Content="아메리카노" Style="{StaticResource MenuButton}" Click="Menu_Click"/>
        <Button Content="카페라테" Style="{StaticResource MenuButton}" Click="Menu_Click"/>
        <Button Content="바닐라라테" Style="{StaticResource MenuButton}" Click="Menu_Click"/>
        <!-- 지역 속성(Background="Tomato")이 스타일의 Background 보다 우선 -->
        <Button Content="★ 오늘의 추천: 녹차라테" Style="{StaticResource MenuButton}" Background="Tomato" Click="Menu_Click"/>
        <Button Content="스타일을 지정하지 않은 버튼" Margin="0,3" Click="Menu_Click"/>
        <TextBlock x:Name="txtInfo" Margin="0,10,0,0" TextWrapping="Wrap" Foreground="DimGray"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19ExplicitStyle
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = "색을 바꾸고 싶으면 MenuButton 스타일의 Setter 한 줄만 고치면 됩니다.";
        }

        private void Menu_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            string styleName = btn.Style == null ? "없음 (기본 모양)" : "MenuButton";
            txtInfo.Text = $"{btn.Content} — Style: {styleName}, FontSize: {btn.FontSize}";
        }
    }
}`, desc: '예제 19-1 과 화면은 같지만, 버튼마다 적던 속성 5개가 <code>Style="{StaticResource MenuButton}"</code> 한 줄로 줄었습니다. 네 번째 버튼은 스타일을 쓰면서도 <code>Background="Tomato"</code> 를 직접 적었는데, <b>요소에 직접 적은 지역(local) 값이 스타일보다 우선</b>하므로 이 버튼만 주황색입니다. 스타일은 “기본값 묶음”이고, 필요한 곳에서는 언제든 덮어쓸 수 있습니다.' },
          { type: 'table', head: ['우선순위', '값을 정하는 곳', '예'], rows: [
            ['1 (가장 높음)', '<b>지역 값</b> — 요소에 직접 적거나 코드로 넣은 값', '<code>&lt;Button Background="Tomato"/&gt;</code>, <code>btn.Background = …;</code>'],
            ['2', '<b>스타일 트리거</b> — 조건이 맞는 동안만 (2교시)', '<code>&lt;Trigger Property="IsMouseOver" …&gt;</code>'],
            ['3', '<b>스타일 Setter</b>', '<code>&lt;Setter Property="Background" …/&gt;</code>'],
            ['4 (가장 낮음)', '<b>기본값</b> · 부모에게서 물려받은 값', 'FontSize 12, 검은 글자 …']
          ], caption: '속성 값의 우선순위 (간단히 정리한 버전). 스타일은 지역 값을 이길 수 없다' },

          { type: 'h', text: '암시적 스타일 — x:Key 없이 자동으로 적용' },
          { type: 'p', html: '<code>x:Key</code> 를 빼고 <code>TargetType</code> 만 적으면 <b>암시적 스타일(implicit style)</b>이 됩니다. 이 스타일은 리소스가 있는 범위 안의 <b>그 형식의 모든 요소에 자동으로</b> 적용되므로, 버튼마다 <code>Style=…</code> 을 적을 필요조차 없습니다. 특정 요소만 스타일에서 빼고 싶으면 <code>Style="{x:Null}"</code> 이라고 적습니다.' },
          { type: 'code', title: '예제 19-4. 암시적 스타일 — 범위 안의 모든 Button · CheckBox 에 자동 적용', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19ImplicitStyle.MainWindow"
        ${NS}
        Title="암시적 스타일 (x:Key 없음)" Width="420" Height="360">
    <StackPanel Margin="15">
        <StackPanel.Resources>
            <!-- x:Key 가 없으면: 이 StackPanel 안의 모든 Button 에 자동 적용 -->
            <Style TargetType="Button">
                <Setter Property="Background" Value="#6A1B9A"/>
                <Setter Property="Foreground" Value="White"/>
                <Setter Property="FontSize" Value="15"/>
                <Setter Property="Padding" Value="8,4"/>
                <Setter Property="Margin" Value="0,3"/>
            </Style>
            <Style TargetType="CheckBox">
                <Setter Property="Foreground" Value="#6A1B9A"/>
                <Setter Property="FontSize" Value="14"/>
                <Setter Property="Margin" Value="0,4"/>
            </Style>
        </StackPanel.Resources>
        <TextBlock Text="설정" FontSize="18" FontWeight="Bold" Margin="0,0,0,6"/>
        <CheckBox Content="알림 받기" IsChecked="True"/>
        <CheckBox Content="자동 저장"/>
        <Button x:Name="btnSave" Content="저장 (스타일 자동 적용)" Click="Button_Click"/>
        <Button x:Name="btnSmall" Content="초기화 (FontSize 만 지역 값 12)" FontSize="12" Click="Button_Click"/>
        <Button x:Name="btnPlain" Content="기본 모양 (스타일 끄기)" Style="{x:Null}" Margin="0,3" Click="Button_Click"/>
        <TextBlock x:Name="txtInfo" Margin="0,10,0,0" TextWrapping="Wrap" Foreground="DimGray"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19ImplicitStyle
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = $"btnSave.FontSize = {btnSave.FontSize} (스타일),  btnSmall.FontSize = {btnSmall.FontSize} (지역 값)";
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            txtInfo.Text = $"[{btn.Content}] FontSize = {btn.FontSize}";
        }
    }
}`, desc: '버튼과 체크 상자 어디에도 <code>Style</code> 을 적지 않았는데 보라색 스타일이 입혀졌습니다. <code>StackPanel.Resources</code> 에 둔 암시적 스타일의 범위는 <b>그 StackPanel 안</b>입니다. 두 번째 버튼은 FontSize 만 지역 값(12)이 이기고 나머지는 스타일을 따르며, 세 번째 버튼은 <code>Style="{x:Null}"</code> 로 스타일을 꺼서 기본 모양입니다.' },
          { type: 'callout', kind: 'info', title: '이 강좌의 브라우저 실행기에서 암시적 스타일을 쓸 때', html: '실제 WPF 에서는 <code>Window.Resources</code> 에 둔 암시적 스타일이 창 안의 <b>모든</b> 버튼에 적용됩니다. 브라우저 실행기는 WPF 의 일부만 흉내 내므로, 암시적 스타일을 <b>① App.xaml</b> 에 두거나 <b>② 요소들을 바로 담고 있는 패널</b>(예제 19-4 의 StackPanel)의 <code>Resources</code> 에 두어야 정확히 보입니다. 이 장의 예제는 모두 이 방식으로 작성되어 있어 Visual Studio 에서도 똑같이 동작합니다.' },

          { type: 'h', text: 'BasedOn — 스타일 물려받기' },
          { type: 'p', html: '앱에는 보통 “기본 버튼 · 강조 버튼 · 위험(삭제) 버튼”처럼 <b>비슷하지만 조금씩 다른</b> 스타일이 필요합니다. 크기 · 여백 · 글자색은 같고 배경색만 다르다면, 공통 부분을 <b>기본 스타일</b>에 한 번만 적고 나머지 스타일은 <code>BasedOn="{StaticResource 기본스타일}"</code> 으로 <b>물려받은 뒤 다른 부분만</b> 추가합니다. 클래스 상속(10장)과 같은 생각입니다.' },
          { type: 'figure', html: SVG_BASEDON, caption: 'BasedOn 은 부모 스타일의 Setter 를 모두 가져오고, 같은 속성은 자식 스타일의 값으로 덮어쓴다' },
          { type: 'code', title: '예제 19-5. BasedOn — 기본 · 강조 · 위험 버튼', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19BasedOn.MainWindow"
        ${NS}
        Title="BasedOn — 스타일 상속" Width="470" Height="300">
    <Window.Resources>
        <Style x:Key="BaseButton" TargetType="Button">
            <Setter Property="FontSize" Value="14"/>
            <Setter Property="Padding" Value="12,6"/>
            <Setter Property="Margin" Value="4"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="Background" Value="Gray"/>
            <Setter Property="BorderThickness" Value="0"/>
        </Style>
        <Style x:Key="PrimaryButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
            <Setter Property="Background" Value="#1976D2"/>
        </Style>
        <Style x:Key="DangerButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
            <Setter Property="Background" Value="#D32F2F"/>
            <Setter Property="FontWeight" Value="Bold"/>
        </Style>
        <Style x:Key="BigDangerButton" TargetType="Button" BasedOn="{StaticResource DangerButton}">
            <Setter Property="FontSize" Value="18"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="공통 부분은 BaseButton 에 한 번만 적었습니다" FontWeight="Bold" Margin="4,0,0,8"/>
        <WrapPanel>
            <Button Content="취소" Tag="BaseButton" Style="{StaticResource BaseButton}" Click="Button_Click"/>
            <Button Content="저장" Tag="PrimaryButton" Style="{StaticResource PrimaryButton}" Click="Button_Click"/>
            <Button Content="삭제" Tag="DangerButton" Style="{StaticResource DangerButton}" Click="Button_Click"/>
            <Button Content="전체 삭제" Tag="BigDangerButton" Style="{StaticResource BigDangerButton}" Click="Button_Click"/>
        </WrapPanel>
        <TextBlock x:Name="txtInfo" Margin="4,12,0,0" TextWrapping="Wrap" Text="버튼을 눌러 값이 어디서 왔는지 확인하세요."/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19BasedOn
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            // Tag 에 적어 둔 스타일 이름과 실제 속성 값을 함께 보여 준다
            txtInfo.Text = $"[{btn.Content}] Style = {btn.Tag}\\n"
                         + $"FontSize = {btn.FontSize}, FontWeight = {btn.FontWeight}, Padding = {btn.Padding}";
        }
    }
}`, desc: '“전체 삭제”는 <code>BigDangerButton → DangerButton → BaseButton</code> 으로 두 단계를 물려받아, 빨간 배경 · 굵은 글씨(DangerButton)에 여백(BaseButton)을 갖고 글자 크기만 18 입니다. 버튼 모양을 전체적으로 바꾸고 싶으면 <code>BaseButton</code> 하나만 고치면 네 스타일이 모두 바뀝니다. <code>Tag</code> 는 아무 값이나 붙여 둘 수 있는 “메모용” 속성입니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 암시적 스타일을 물려받기', html: '실제 WPF 에서는 x:Key 없는 암시적 스타일도 물려받을 수 있습니다. 암시적 스타일의 키는 형식 자체이므로 <code>BasedOn="{StaticResource {x:Type Button}}"</code> 이라고 적습니다. “앱 전체의 기본 버튼(암시적) + 그걸 물려받은 강조 버튼(명시적)” 구조를 만들 때 많이 씁니다. 이 강좌의 브라우저 실행기는 이 형태를 지원하지 않으므로, 예제에서는 이름 있는 기본 스타일(<code>BaseButton</code>)을 물려받습니다.' },

          { type: 'h', text: 'App.xaml — 앱 전체에 적용하는 전역 스타일' },
          { type: 'p', html: '창이 여러 개인 앱에서 창마다 같은 스타일을 복사해 넣으면 다시 반복 문제가 생깁니다. 13장에서 본 <b>App.xaml</b> 의 <code>&lt;Application.Resources&gt;</code> 는 <b>앱의 모든 창</b>이 함께 쓰는 리소스 자리입니다(찾는 순서의 ④번). 여기에 암시적 Button 스타일을 두면 모든 창의 모든 버튼이 같은 모양이 됩니다.' },
          { type: 'code', title: '예제 19-6. App.xaml 전역 스타일 — 두 창이 같은 모양', code: `// ===== File: App.xaml =====
<Application x:Class="Ch19AppStyle.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <!-- 앱 전체(모든 창)에서 쓰는 리소스 -->
        <SolidColorBrush x:Key="AppPrimary" Color="#00897B"/>
        <!-- 암시적 스타일: 모든 창의 모든 Button -->
        <Style TargetType="Button">
            <Setter Property="Background" Value="{StaticResource AppPrimary}"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="FontSize" Value="14"/>
            <Setter Property="Padding" Value="10,5"/>
            <Setter Property="Margin" Value="0,4"/>
        </Style>
        <!-- 명시적 스타일: 제목 글자 -->
        <Style x:Key="TitleText" TargetType="TextBlock">
            <Setter Property="FontSize" Value="20"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="Foreground" Value="{StaticResource AppPrimary}"/>
            <Setter Property="Margin" Value="0,0,0,10"/>
        </Style>
    </Application.Resources>
</Application>
// ===== File: App.xaml.cs =====
using System.Windows;

namespace Ch19AppStyle
{
    public partial class App : Application
    {
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19AppStyle.MainWindow"
        ${NS}
        Title="메인 창" Width="380" Height="300">
    <StackPanel Margin="15">
        <TextBlock Text="메인 창" Style="{StaticResource TitleText}"/>
        <TextBlock Text="이 창에는 Resources 가 하나도 없습니다. 버튼 모양과 제목 스타일은 App.xaml 에서 옵니다."
                   TextWrapping="Wrap" Margin="0,0,0,8"/>
        <Button Content="새 창 열기" Click="btnOpen_Click"/>
        <Button Content="인사하기" Click="btnHello_Click"/>
        <TextBlock x:Name="txtInfo" Margin="0,8,0,0" Foreground="DimGray"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch19AppStyle
{
    public partial class MainWindow : Window
    {
        private int opened = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnOpen_Click(object sender, RoutedEventArgs e)
        {
            var sub = new SubWindow();
            sub.Owner = this;
            sub.Show();
            opened++;
            txtInfo.Text = $"새 창을 {opened}번 열었습니다. 버튼 모양이 같은지 보세요.";
        }

        private void btnHello_Click(object sender, RoutedEventArgs e)
        {
            txtInfo.Text = "안녕하세요! 이 버튼도 App.xaml 의 스타일을 씁니다.";
        }
    }
}
// ===== File: SubWindow.xaml =====
<Window x:Class="Ch19AppStyle.SubWindow"
        ${NS}
        Title="두 번째 창" Width="320" Height="220">
    <StackPanel Margin="15">
        <TextBlock Text="두 번째 창" Style="{StaticResource TitleText}"/>
        <TextBlock Text="여기 버튼도 같은 모양입니다." Margin="0,0,0,8"/>
        <Button Content="닫기" Click="btnClose_Click"/>
    </StackPanel>
</Window>
// ===== File: SubWindow.xaml.cs =====
using System.Windows;

namespace Ch19AppStyle
{
    public partial class SubWindow : Window
    {
        public SubWindow()
        {
            InitializeComponent();
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}`, desc: 'MainWindow 와 SubWindow 어디에도 <code>Resources</code> 가 없지만, 두 창의 버튼이 모두 청록색이고 제목도 같은 모양입니다. <code>{StaticResource TitleText}</code> 는 창에서 찾지 못하면 App 의 리소스까지 올라가 찾기 때문입니다. 앱의 “기본 디자인”은 이렇게 App.xaml 에 둡니다.' },
          { type: 'callout', kind: 'warn', title: 'App.xaml 에 암시적 TextBlock 스타일은 조심', html: 'App.xaml 에 <code>&lt;Style TargetType="TextBlock"&gt;</code> 을 두면, 내가 적은 TextBlock 뿐 아니라 <b>버튼 · 콤보 상자 안에서 글자를 그리는 TextBlock</b> 까지 영향을 받아 예상 밖의 화면이 나오기 쉽습니다. 글자 스타일은 <code>TitleText</code> 처럼 <b>x:Key 를 붙인 명시적 스타일</b>로 만드는 편이 안전합니다.' },

          { type: 'h', text: '리소스 사전 파일 — Styles.xaml 과 MergedDictionaries' },
          { type: 'p', html: '스타일이 많아지면 App.xaml 이 너무 길어집니다. 그래서 리소스만 모은 <b>리소스 사전(ResourceDictionary) 파일</b>을 따로 만들고, 필요한 곳에서 <code>MergedDictionaries</code>(합쳐진 사전들)로 불러옵니다. 파일의 루트 태그가 <code>&lt;Window&gt;</code> 가 아니라 <code>&lt;ResourceDictionary&gt;</code> 이고, <code>x:Class</code> 와 코드 비하인드가 없다는 점이 다릅니다.' },
          { type: 'p', html: '이때 가장 먼저 만들 것은 <b>테마 색상표</b>입니다. <code>PrimaryBrush</code>(주 색), <code>SecondaryBrush</code>(보조 색), <code>BackgroundBrush</code>(배경), <code>TextBrush</code>(글자) 처럼 <b>“색의 역할”로 이름</b>을 붙이고, 스타일은 색을 직접 적지 않고 이 브러시만 가져다 씁니다. 그러면 색상표만 바꿔도 앱 전체의 분위기가 바뀝니다.' },
          { type: 'code', title: '예제 19-7. Theme.xaml — 테마 색상표와 스타일을 파일로 분리', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19ThemeFile.MainWindow"
        ${NS}
        Title="테마 색상표 (Theme.xaml)" Width="440" Height="380">
    <Window.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <!-- 다른 파일(Theme.xaml)의 리소스를 이 창의 리소스로 합쳐 온다 -->
                <ResourceDictionary Source="Theme.xaml"/>
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Window.Resources>
    <Border Background="{StaticResource BackgroundBrush}" Padding="15">
        <StackPanel>
            <TextBlock Text="회원 정보" Style="{StaticResource HeaderText}"/>
            <Border Style="{StaticResource Card}">
                <StackPanel>
                    <TextBlock Text="김민준" FontSize="16" FontWeight="Bold" Foreground="{StaticResource TextBrush}"/>
                    <TextBlock Text="minjun@example.com" Foreground="{StaticResource SubTextBrush}"/>
                </StackPanel>
            </Border>
            <StackPanel Orientation="Horizontal" Margin="0,10,0,0">
                <Button Content="수정" Style="{StaticResource PrimaryButton}" Click="btnPalette_Click"/>
                <Button Content="색상표 보기" Style="{StaticResource SecondaryButton}" Click="btnPalette_Click"/>
            </StackPanel>
            <TextBlock x:Name="txtInfo" Margin="0,10,0,0" TextWrapping="Wrap" Foreground="{StaticResource SubTextBrush}"/>
        </StackPanel>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Text;
using System.Windows;
using System.Windows.Media;

namespace Ch19ThemeFile
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = "버튼을 누르면 Theme.xaml 의 색상표를 보여 줍니다.";
        }

        private void btnPalette_Click(object sender, RoutedEventArgs e)
        {
            string[] keys = { "PrimaryBrush", "SecondaryBrush", "BackgroundBrush", "TextBrush", "SubTextBrush" };
            var sb = new StringBuilder("Theme.xaml 색상표\\n");
            foreach (string key in keys)
            {
                var brush = (SolidColorBrush)FindResource(key);
                sb.Append($"  {key} = {brush.Color}\\n");
            }
            txtInfo.Text = sb.ToString();
        }
    }
}
// ===== File: Theme.xaml =====
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <!-- ① 색상표: 색은 여기에서만 정한다 (역할로 이름 붙이기) -->
    <SolidColorBrush x:Key="PrimaryBrush" Color="#3949AB"/>
    <SolidColorBrush x:Key="SecondaryBrush" Color="#FFB300"/>
    <SolidColorBrush x:Key="BackgroundBrush" Color="#F5F6FA"/>
    <SolidColorBrush x:Key="TextBrush" Color="#212121"/>
    <SolidColorBrush x:Key="SubTextBrush" Color="#757575"/>

    <!-- ② 스타일: 색을 직접 적지 않고 위의 색상표를 가져다 쓴다 -->
    <Style x:Key="HeaderText" TargetType="TextBlock">
        <Setter Property="FontSize" Value="20"/>
        <Setter Property="FontWeight" Value="Bold"/>
        <Setter Property="Foreground" Value="{StaticResource PrimaryBrush}"/>
        <Setter Property="Margin" Value="0,0,0,10"/>
    </Style>
    <Style x:Key="Card" TargetType="Border">
        <Setter Property="Background" Value="White"/>
        <Setter Property="BorderBrush" Value="#DDDDDD"/>
        <Setter Property="BorderThickness" Value="1"/>
        <Setter Property="CornerRadius" Value="8"/>
        <Setter Property="Padding" Value="12"/>
    </Style>
    <Style x:Key="PrimaryButton" TargetType="Button">
        <Setter Property="Background" Value="{StaticResource PrimaryBrush}"/>
        <Setter Property="Foreground" Value="White"/>
        <Setter Property="Padding" Value="12,5"/>
        <Setter Property="Margin" Value="0,0,8,0"/>
        <Setter Property="BorderThickness" Value="0"/>
    </Style>
    <Style x:Key="SecondaryButton" TargetType="Button" BasedOn="{StaticResource PrimaryButton}">
        <Setter Property="Background" Value="{StaticResource SecondaryBrush}"/>
        <Setter Property="Foreground" Value="{StaticResource TextBrush}"/>
    </Style>
</ResourceDictionary>`, desc: 'Theme.xaml 은 <b>색상표(①)</b>와 그 색을 쓰는 <b>스타일(②)</b>만 담은 파일입니다. 창에서는 <code>&lt;ResourceDictionary Source="Theme.xaml"/&gt;</code> 로 합쳐 오기만 하면 모든 키를 제 것처럼 씁니다. <code>PrimaryBrush</code> 를 <code>#00897B</code>(청록)로 바꿔 실행해 보세요. 제목과 “수정” 버튼의 색이 같이 바뀝니다. 앱 전체에 쓰려면 같은 <code>MergedDictionaries</code> 를 App.xaml 의 <code>&lt;Application.Resources&gt;</code> 안에 넣습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 리소스 사전 파일 추가하기', html: '<ol><li><b>솔루션 탐색기</b>에서 프로젝트 이름을 오른쪽 클릭 → <b>추가 → 리소스 사전(WPF)…</b> 을 고릅니다. (목록에 없으면 <b>추가 → 새 항목</b> 에서 “리소스 사전” 검색)</li><li>이름을 <code>Theme.xaml</code> 로 정하면 <code>&lt;ResourceDictionary&gt;</code> 만 있는 빈 파일이 만들어집니다. 폴더를 만들어 <code>Themes/Theme.xaml</code> 처럼 두면 <code>Source="Themes/Theme.xaml"</code> 로 적습니다.</li><li>App.xaml 의 <code>&lt;Application.Resources&gt;</code> 안에 <code>&lt;ResourceDictionary&gt;&lt;ResourceDictionary.MergedDictionaries&gt;…</code> 를 적으면 모든 창에서 쓸 수 있습니다. 파일의 <b>빌드 작업</b>은 자동으로 <b>Page</b> 로 설정됩니다(속성 창 <kbd>F4</kbd> 에서 확인).</li></ol>' },
          { type: 'table', head: ['어디에 둘까?', '범위', '이럴 때'], rows: [
            ['요소 · 패널의 <code>Resources</code>', '그 요소와 그 안쪽', '한 영역(폼 하나, 목록 하나)에서만 쓰는 스타일'],
            ['<code>Window.Resources</code>', '그 창 전체', '한 창에서만 쓰는 색 · 스타일'],
            ['<code>App.xaml</code> 의 <code>Application.Resources</code>', '앱의 모든 창', '앱 전체의 기본 버튼 · 제목 스타일'],
            ['리소스 사전 파일 (<code>Theme.xaml</code>) + <code>MergedDictionaries</code>', '합쳐 온 곳의 범위', '색상표 · 스타일이 많을 때 파일로 나눠 관리']
          ] }
        ],
        practice: [
          {
            title: '실습 19-1. 카드형 버튼 스타일 세트 (BasedOn)',
            level: 1,
            desc: '<p>흰 바탕 · 회색 테두리의 기본 카드 버튼 스타일 <code>CardButton</code> 이 주어져 있습니다. 이것을 <b>BasedOn 으로 물려받아</b> 두 스타일을 더 만드세요.</p><ul><li><code>AccentCardButton</code> — 배경 <code>#1976D2</code>, 글자 흰색, 테두리 <code>#1976D2</code></li><li><code>DangerCardButton</code> — 배경 <code>#FFEBEE</code>, 글자 · 테두리 <code>#C62828</code>, 굵게</li><li><b>저장</b> 버튼에는 강조, <b>삭제</b> 버튼에는 위험 스타일을 적용합니다.</li></ul><p>버튼을 눌러 FontSize · Padding 이 모두 같은지(물려받았는지) 확인하세요.</p>',
            hint: '<code>&lt;Style x:Key="AccentCardButton" TargetType="Button" BasedOn="{StaticResource CardButton}"&gt;</code> 안에 <b>바뀌는 속성만</b> Setter 로 적습니다. 새 스타일은 <code>CardButton</code> 정의보다 <b>아래</b>에 있어야 합니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 19-2. 폼 전체에 암시적 Label · TextBox 스타일',
            level: 2,
            desc: '<p>이름 · 이메일 · 전화번호 · 메모를 입력받는 폼이 있습니다. Label 과 TextBox 에 속성을 하나도 반복해 적지 말고, <b>Grid 의 <code>Resources</code> 에 x:Key 없는 암시적 스타일</b> 두 개를 넣어 폼 전체의 모양을 맞추세요.</p><ul><li>Label: 굵게, 글자색 <code>#455A64</code>, 세로 가운데 정렬</li><li>TextBox: <code>Margin 0,4</code> · <code>Padding 4,2</code> · FontSize 14 · 테두리 <code>SteelBlue</code></li><li>저장 버튼을 누르면 <code>저장됨: 이름 / 이메일 / 전화번호</code> 를 표시합니다. 이름이 비어 있으면 빨간 글씨로 <code>이름을 입력하세요.</code></li></ul>',
            hint: '<code>&lt;Grid.Resources&gt;</code> 는 Grid 의 <b>맨 앞</b>(ColumnDefinitions 보다 위)에 둡니다. <code>&lt;Style TargetType="Label"&gt;</code> 처럼 x:Key 를 빼면 자동 적용됩니다. 빨간 글씨는 <code>txtResult.Foreground = Brushes.Red;</code> (<code>using System.Windows.Media;</code>).',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>&lt;Style TargetType="Button"&gt;</code> 처럼 <b>x:Key 없이</b> 만든 스타일은 어떻게 동작하나요?', options: ['오류가 난다 — 스타일에는 반드시 x:Key 가 필요하다', '<code>Style="{StaticResource Button}"</code> 이라고 적어야 적용된다', '리소스 범위 안의 모든 Button 에 자동으로 적용된다 (암시적 스타일)', '창에서 첫 번째 Button 에만 적용된다'], answer: 2, explain: 'x:Key 가 없으면 형식(TargetType) 자체가 키가 되어, 그 범위의 모든 같은 형식 요소에 자동 적용됩니다. 빼고 싶은 요소는 <code>Style="{x:Null}"</code>.' },
          { q: '다음 버튼의 글자 크기는?<pre><code>&lt;Style x:Key="Big" TargetType="Button"&gt;\n    &lt;Setter Property="FontSize" Value="20"/&gt;\n&lt;/Style&gt;\n…\n&lt;Button Content="확인" Style="{StaticResource Big}" FontSize="12"/&gt;</code></pre>', options: ['20 — 스타일이 우선한다', '12 — 요소에 직접 적은 지역 값이 우선한다', '32 — 두 값이 더해진다', '오류 — 같은 속성을 두 번 정할 수 없다'], answer: 1, explain: '지역 값이 스타일 Setter 보다 우선순위가 높습니다. 스타일은 “기본값 묶음”이라 언제든 덮어쓸 수 있습니다.' },
          { q: '같은 키 <code>PrimaryBrush</code> 가 <b>App.xaml</b>(파랑), <b>Window.Resources</b>(초록), 버튼을 담은 <b>StackPanel.Resources</b>(빨강)에 모두 있습니다. 그 StackPanel 안의 버튼에서 <code>{StaticResource PrimaryBrush}</code> 는 무슨 색?', options: ['파랑 — App 이 가장 우선', '초록 — Window 가 우선', '오류 — 키가 중복되었다', '빨강 — 가장 가까운 StackPanel 에서 먼저 찾는다'], answer: 3, explain: '리소스는 요소 → 부모 → … → Window → App → 시스템 순서로 찾고, 처음 찾은 것을 씁니다. 가까운 쪽이 이깁니다.' },
          { q: '<code>BasedOn="{StaticResource BaseButton}"</code> 의 의미로 옳은 것은?', options: ['BaseButton 의 Setter 를 모두 물려받고, 새로 적은 Setter 로 추가 · 덮어쓴다', 'BaseButton 스타일을 삭제한다', 'BaseButton 이 적용된 버튼에만 이 스타일을 쓸 수 있다', 'BaseButton 과 이 스타일 중 하나를 무작위로 고른다'], answer: 0, explain: 'BasedOn 은 스타일 상속입니다. 공통 속성은 기본 스타일에 한 번만 적고, 달라지는 속성만 새 스타일에 적습니다.' },
          { q: '별도 파일 <code>Styles.xaml</code> 의 리소스를 창에서 쓰려면 <code>Window.Resources</code> 에 무엇을 적나요?', options: ['<code>&lt;Import File="Styles.xaml"/&gt;</code>', '<code>&lt;Style Source="Styles.xaml"/&gt;</code>', '<code>&lt;ResourceDictionary&gt;&lt;ResourceDictionary.MergedDictionaries&gt;&lt;ResourceDictionary Source="Styles.xaml"/&gt;…</code>', '<code>using Styles.xaml;</code>'], answer: 2, explain: '리소스 사전 파일은 <code>MergedDictionaries</code> 안에 <code>&lt;ResourceDictionary Source="파일"/&gt;</code> 로 합쳐 옵니다. App.xaml 에 넣으면 앱 전체에서 쓸 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '리소스와 스타일', subtitle: 'Chapter 19 · Section 01 — 스타일 · 리소스 · 템플릿 ①', badge: '19-1',
            notes: '<p><b>[도입 2분]</b> 웹 사이트나 앱에서 버튼이 모두 같은 색 · 같은 둥글기인 것을 보여 주며 “이 버튼 100개를 하나하나 칠했을까?” 하고 묻습니다.</p><p>오늘 목표: 리소스(값 재사용) → 스타일(속성 묶음) → App.xaml · 리소스 사전 파일로 앱 전체 디자인 관리.</p>' },
          { layout: 'bullets', title: '반복되는 속성의 문제', lead: '버튼 5개 × 속성 5개 = 25번 같은 글자',
            bullets: ['디자인 변경 요청 → <b>모든 곳</b>을 찾아 고쳐야 함', '하나라도 빠뜨리면 그 버튼만 색이 다름', '해결 ① <b>리소스</b> — 값 하나에 이름(<code>x:Key</code>) 붙여 재사용', '해결 ② <b>스타일</b> — 속성 여러 개를 한 묶음으로', ['웹의 CSS 와 비슷한 역할']],
            notes: '<p><b>[3분]</b> 예제 19-1 을 실행해 보여 주고 XAML 을 스크롤하며 반복을 눈으로 확인시킵니다.</p><p>발문: “색을 초록으로 바꾸려면 몇 군데를 고쳐야 할까요?” → 5곳. “버튼이 50개라면?”</p>' },
          { layout: 'code', title: '리소스 — x:Key 와 StaticResource', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideRes.MainWindow"
        ${NS}
        Title="리소스" Width="340" Height="220">
    <Window.Resources>
        <SolidColorBrush x:Key="PrimaryBrush" Color="#2E7D32"/>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="초록 가게" FontSize="20" Foreground="{StaticResource PrimaryBrush}"/>
        <Button Content="주문" Background="{StaticResource PrimaryBrush}" Foreground="White" Margin="0,5"/>
        <Button Content="장바구니" Background="{StaticResource PrimaryBrush}" Foreground="White"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideRes
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`, points: ['<code>Window.Resources</code> 에 객체 + <code>x:Key</code>', '쓰는 곳: <code>{StaticResource 키}</code>', '색은 <b>한 곳</b>에만 — 바꾸면 전부 바뀜', '코드에서는 <code>FindResource("키")</code>'],
            notes: '<p><b>[5분]</b> 실행 후 <code>Color</code> 를 <code>Crimson</code> 으로 바꿔 다시 실행 → 세 곳이 한꺼번에 바뀌는 것을 보여 줍니다.</p><p>주의: 키 오타(대소문자 포함) → 실행 시 “리소스를 찾을 수 없습니다”. 일부러 오타를 내어 오류 메시지를 읽혀 보세요.</p>' },
          { layout: 'diagram', title: '리소스를 찾는 순서', html: SVG_LOOKUP, caption: '요소 → 부모 → Window → App → 시스템, 가까운 쪽이 이긴다',
            notes: '<p><b>[3분]</b> “변수의 범위(scope)”와 비슷하다고 설명합니다 — 지역 변수가 같은 이름의 바깥 변수를 가리듯, 가까운 리소스가 먼 리소스를 가립니다.</p><p>StaticResource 는 위에서 먼저 정의해야 한다는 점도 함께 짚습니다.</p>' },
          { layout: 'code', title: '스타일 — Setter 묶음 + 지역 값 우선', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideStyle.MainWindow"
        ${NS}
        Title="스타일" Width="340" Height="230">
    <Window.Resources>
        <Style x:Key="MenuButton" TargetType="Button">
            <Setter Property="Background" Value="SteelBlue"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="FontSize" Value="15"/>
            <Setter Property="Margin" Value="0,3"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="15">
        <Button Content="아메리카노" Style="{StaticResource MenuButton}"/>
        <Button Content="카페라테" Style="{StaticResource MenuButton}"/>
        <Button Content="추천 메뉴" Style="{StaticResource MenuButton}" Background="Tomato"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideStyle
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`, points: ['<code>TargetType</code> + <code>Setter Property/Value</code>', '버튼마다 <code>Style=</code> 한 줄', '<b>지역 값</b>(<code>Background="Tomato"</code>)이 스타일보다 우선'],
            notes: '<p><b>[5분]</b> 예제 19-1 과 같은 화면을 스타일로 줄인 것임을 강조. 스타일 = “기본값 묶음”, 필요하면 덮어쓴다.</p><p>발문: “세 번째 버튼만 FontSize 를 20 으로 하려면?” → 그 버튼에 <code>FontSize="20"</code>.</p>' },
          { layout: 'two', title: '명시적 스타일 vs 암시적 스타일',
            left: { title: '명시적 (x:Key 있음)', bullets: ['<code>&lt;Style x:Key="MenuButton" TargetType="Button"&gt;</code>', '<code>Style="{StaticResource MenuButton}"</code> 으로 <b>골라서</b> 적용', '종류가 여러 개일 때 (강조 · 위험 …)'] },
            right: { title: '암시적 (x:Key 없음)', bullets: ['<code>&lt;Style TargetType="Button"&gt;</code>', '범위 안의 모든 Button 에 <b>자동</b> 적용', '빼고 싶으면 <code>Style="{x:Null}"</code>', '앱 전체 “기본 모양”에 적합'] },
            notes: '<p><b>[4분]</b> 예제 19-4 를 실행해 Style 을 하나도 적지 않았는데 스타일이 입혀진 것을 보여 줍니다.</p><p>브라우저 실행기에서는 암시적 스타일을 App.xaml 또는 “요소를 바로 담은 패널”의 Resources 에 둬야 한다는 점을 안내합니다 (Visual Studio 는 Window.Resources 도 OK).</p>' },
          { layout: 'code', title: 'BasedOn — 스타일 상속', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideBasedOn.MainWindow"
        ${NS}
        Title="BasedOn" Width="340" Height="200">
    <StackPanel Margin="15">
        <StackPanel.Resources>
            <Style x:Key="Base" TargetType="Button">
                <Setter Property="FontSize" Value="15"/>
                <Setter Property="Margin" Value="0,3"/>
            </Style>
            <Style x:Key="Danger" TargetType="Button" BasedOn="{StaticResource Base}">
                <Setter Property="Background" Value="Crimson"/>
                <Setter Property="Foreground" Value="White"/>
            </Style>
        </StackPanel.Resources>
        <Button Content="저장" Style="{StaticResource Base}"/>
        <Button Content="삭제" Style="{StaticResource Danger}"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideBasedOn
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`, points: ['<code>BasedOn="{StaticResource Base}"</code>', 'Base 의 Setter 를 모두 물려받음', '<b>달라지는 속성만</b> 추가 · 덮어쓰기', 'Base 만 고치면 전부 바뀜'],
            notes: '<p><b>[4분]</b> 10장 클래스 상속과 연결: “부모 스타일 = 부모 클래스”. Danger 에 FontSize 를 적지 않았지만 15 인 것을 확인합니다.</p>' },
          { layout: 'diagram', title: 'BasedOn 사슬', html: SVG_BASEDON, caption: 'BigDangerButton → DangerButton → BaseButton',
            notes: '<p><b>[2분]</b> 예제 19-5 를 실행하고 “전체 삭제” 버튼을 눌러 각 값이 어디서 왔는지 그림과 맞춰 봅니다.</p>' },
          { layout: 'two', title: 'App.xaml 과 리소스 사전 파일',
            left: { title: 'App.xaml — 모든 창', code: `<Application.Resources>
    <SolidColorBrush x:Key="AppPrimary" Color="#00897B"/>
    <Style TargetType="Button">
        <Setter Property="Background"
                Value="{StaticResource AppPrimary}"/>
    </Style>
</Application.Resources>`, run: false },
            right: { title: 'Theme.xaml 합쳐 오기', code: `<Window.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Theme.xaml"/>
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Window.Resources>`, run: false },
            notes: '<p><b>[5분]</b> 예제 19-6(두 창이 같은 모양)과 19-7(Theme.xaml)을 차례로 실행합니다.</p><p>색상표는 “역할”로 이름 짓기: PrimaryBrush · SecondaryBrush · BackgroundBrush · TextBrush. 색 이름(BlueBrush)으로 지으면 색을 바꿀 때 이름이 거짓말이 됩니다.</p><p>Visual Studio: 프로젝트 오른쪽 클릭 → 추가 → 리소스 사전(WPF).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>&lt;Button Style="{StaticResource Big}" FontSize="12"/&gt;</code> — 스타일 Big 의 FontSize 가 20 이라면 이 버튼의 글자 크기는?', options: ['20', '32', '12', '오류'], answer: 2, explain: '요소에 직접 적은 <b>지역 값</b>이 스타일 Setter 보다 우선합니다.',
            notes: '<p><b>[2분]</b> 손을 들어 답하게 한 뒤 정답 공개. 우선순위 표(지역 값 &gt; 트리거 &gt; Setter &gt; 기본값)를 다시 보여 줍니다.</p>' },
          { layout: 'practice', title: '실습 19-1. 카드형 버튼 스타일 세트', desc: '<p><code>CardButton</code> 을 BasedOn 으로 물려받아 <code>AccentCardButton</code>(파랑) · <code>DangerCardButton</code>(연빨강 + 굵게)을 만들고, 저장 · 삭제 버튼에 적용하세요.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[7분]</b> 먼저 Accent 하나만 만들어 실행해 보게 합니다. 자주 하는 실수: 새 스타일을 CardButton 보다 위에 적어 “리소스를 찾을 수 없습니다” 오류. 빠른 학생은 실습 19-2(암시적 폼 스타일)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['리소스: <code>x:Key</code> 로 이름 붙이고 <code>{StaticResource 키}</code> 로 사용', '찾는 순서: 요소 → 부모 → Window → App → 시스템 (가까운 쪽 우선)', '스타일 = <code>Setter</code> 묶음 · <b>지역 값이 스타일보다 우선</b>', 'x:Key 있음 = 명시적 · 없음 = 암시적(자동 적용)', '<code>BasedOn</code> 으로 공통 부분은 한 번만', 'App.xaml = 앱 전체 · Theme.xaml + MergedDictionaries = 파일로 관리'],
            notes: '<p><b>[1분]</b> 다음 시간 예고: 마우스를 올리면 바뀌는 트리거, 목록 항목을 꾸미는 DataTemplate, 버튼 모양을 통째로 바꾸는 ControlTemplate, 다크 모드.</p>' }
        ]
      },

      /* ===================== ch19-2 ===================== */
      {
        id: 'ch19-2',
        title: '트리거와 템플릿',
        minutes: 50,
        goals: [
          'Style.Triggers 의 Trigger(IsMouseOver)로 마우스 올림 효과를 만들 수 있다',
          'IsEnabled · IsChecked 트리거와 DataTrigger 가 언제 쓰이는지 설명할 수 있다',
          '코드에서 Style 을 바꿔 선택 상태를 표시할 수 있다',
          'DataTemplate 을 x:Key 리소스로 공유하고, DataType 으로 자동 적용할 수 있다',
          'ControlTemplate 이 스타일과 무엇이 다른지 설명할 수 있다',
          '두 브러시 세트로 라이트/다크 모드 전환을 만들 수 있다'
        ],
        flow: [['스타일 트리거 (IsMouseOver)', 10], ['다른 트리거 · 코드로 스타일 바꾸기', 7], ['DataTemplate 공유 · DataType', 10], ['ControlTemplate 소개', 8], ['라이트/다크 · 디자인 정리', 8], ['퀴즈 · 실습', 7]],
        content: [
          { type: 'h', text: '스타일 트리거 — “이럴 때만” 바뀌는 속성' },
          { type: 'p', html: '지금까지의 Setter 는 항상 적용되는 값이었습니다. <b>트리거(trigger)</b>는 “<b>어떤 조건일 때만</b>” 적용되는 Setter 묶음입니다. 스타일 안의 <code>&lt;Style.Triggers&gt;</code> 에 <code>&lt;Trigger Property="IsMouseOver" Value="True"&gt;</code> 를 넣으면, 마우스가 요소 위에 있는 동안만 안쪽 Setter 가 적용되고, 마우스가 벗어나면 <b>자동으로 원래 값으로 돌아갑니다</b>. 이벤트 처리기(MouseEnter/MouseLeave)를 짤 필요가 없습니다.' },
          { type: 'code', title: '예제 19-8. IsMouseOver 트리거 — 마우스를 올리면 강조되는 메뉴 카드', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19HoverTrigger.MainWindow"
        ${NS}
        Title="마우스 올림 트리거" Width="460" Height="380">
    <Window.Resources>
        <Style x:Key="MenuCard" TargetType="Border">
            <Setter Property="Background" Value="White"/>
            <Setter Property="BorderBrush" Value="#DDDDDD"/>
            <Setter Property="BorderThickness" Value="2"/>
            <Setter Property="CornerRadius" Value="8"/>
            <Setter Property="Padding" Value="8"/>
            <Setter Property="Margin" Value="5"/>
            <Style.Triggers>
                <!-- 마우스가 올라와 있는 동안만 적용 → 벗어나면 위의 원래 값으로 -->
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Background" Value="#FFF3E0"/>
                    <Setter Property="BorderBrush" Value="DarkOrange"/>
                </Trigger>
            </Style.Triggers>
        </Style>
        <Style x:Key="LinkButton" TargetType="Button">
            <Setter Property="Foreground" Value="SteelBlue"/>
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="Padding" Value="6,2"/>
            <Style.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Foreground" Value="DarkOrange"/>
                    <Setter Property="FontWeight" Value="Bold"/>
                </Trigger>
            </Style.Triggers>
        </Style>
    </Window.Resources>
    <StackPanel Margin="10">
        <TextBlock Text="카드 위에 마우스를 올려 보세요" FontWeight="Bold" Margin="5"/>
        <UniformGrid Columns="3">
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="☕" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="아메리카노" HorizontalAlignment="Center"/>
                    <TextBlock Text="3,000원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="🍵" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="녹차라테" HorizontalAlignment="Center"/>
                    <TextBlock Text="4,500원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="🧃" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="오렌지주스" HorizontalAlignment="Center"/>
                    <TextBlock Text="4,000원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="🍰" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="치즈케이크" HorizontalAlignment="Center"/>
                    <TextBlock Text="5,500원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="🍪" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="쿠키" HorizontalAlignment="Center"/>
                    <TextBlock Text="2,000원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
            <Border Style="{StaticResource MenuCard}">
                <StackPanel>
                    <TextBlock Text="🥪" FontSize="26" HorizontalAlignment="Center"/>
                    <TextBlock Text="샌드위치" HorizontalAlignment="Center"/>
                    <TextBlock Text="6,000원" Foreground="Gray" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
        </UniformGrid>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,6,0,0">
            <Button Content="메뉴 전체 보기" Style="{StaticResource LinkButton}" Click="Link_Click"/>
            <Button Content="매장 안내" Style="{StaticResource LinkButton}" Click="Link_Click"/>
        </StackPanel>
        <TextBlock x:Name="txtInfo" HorizontalAlignment="Center" Foreground="Gray" Margin="0,4,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19HoverTrigger
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtInfo.Text = "아래 글자 버튼에도 마우스를 올려 보세요.";
        }

        private void Link_Click(object sender, RoutedEventArgs e)
        {
            txtInfo.Text = $"'{((Button)sender).Content}' 를 눌렀습니다. (코드 없이 트리거만으로 강조했어요)";
        }
    }
}`, desc: '카드 6개는 모두 <code>MenuCard</code> 스타일 하나를 씁니다. 마우스를 올리면 배경이 연한 주황, 테두리가 진한 주황으로 바뀌고, 벗어나면 흰색 · 회색으로 돌아옵니다. 코드 비하인드에는 마우스 관련 코드가 한 줄도 없습니다. 아래 글자 버튼(<code>LinkButton</code>)은 마우스를 올리면 글자색과 굵기가 바뀝니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행기의 트리거 지원 범위', html: '이 강좌의 브라우저 실행기는 스타일 트리거 중 <b><code>IsMouseOver</code> 의 마우스 올림 효과만 흉내 냅니다</b>. <code>IsEnabled</code> · <code>IsChecked</code> · <code>IsFocused</code> 트리거, <code>DataTrigger</code>, <code>MultiTrigger</code> 는 오류 없이 무시되므로, 아래의 개념 예제는 <b>Visual Studio 에서 실행</b>해 확인하세요.' },
          { type: 'callout', kind: 'warn', title: 'Button 의 Background 는 마우스를 올리면 안 바뀌어요 (실제 WPF)', html: '실제 WPF 에서 Button 스타일에 <code>&lt;Trigger Property="IsMouseOver"&gt;&lt;Setter Property="Background" …/&gt;</code> 를 넣어도 배경이 바뀌지 않는 것처럼 보입니다. Button 의 <b>기본 모양(컨트롤 템플릿)</b>이 마우스를 올렸을 때 자기만의 연한 파란색을 칠하기 때문입니다. 그래서 예제 19-8 은 Button 에는 <b>Foreground · FontWeight</b> 만 바꾸고, 배경 효과는 <b>Border</b> 에 주었습니다. 버튼 배경까지 바꾸려면 뒤에서 배울 <b>ControlTemplate</b> 이 필요합니다.' },

          { type: 'h', text: '다른 속성 트리거와 DataTrigger' },
          { type: 'p', html: '<code>Trigger</code> 의 <code>Property</code> 에는 <code>IsMouseOver</code> 말고도 <b>true/false 로 바뀌는 상태 속성</b>을 자주 씁니다. 버튼이 꺼졌을 때(<code>IsEnabled=False</code>) 흐리게, 체크 상자가 체크되었을 때(<code>IsChecked=True</code>) 초록 글씨, 입력 칸에 커서가 있을 때(<code>IsKeyboardFocused=True</code>) 노란 배경 같은 효과를 코드 없이 만들 수 있습니다.' },
          { type: 'table', head: ['트리거 종류', '조건', '예', '브라우저'], rows: [
            ['<code>Trigger</code>', '<b>요소 자신의 속성</b> 값', '<code>IsMouseOver</code>, <code>IsEnabled</code>, <code>IsChecked</code>, <code>IsPressed</code>', 'IsMouseOver 만'],
            ['<code>MultiTrigger</code>', '요소 속성 <b>여러 개가 모두</b> 맞을 때', '체크됨 <b>그리고</b> 마우스 올림', '✘'],
            ['<code>DataTrigger</code>', '<b>바인딩한 데이터</b>의 값', '<code>{Binding Score}</code> 가 0 이면 빨강', '✘'],
            ['<code>EventTrigger</code>', '이벤트가 일어날 때 애니메이션 시작', '<code>Loaded</code> 때 서서히 나타나기', '기본만 (22장)']
          ] },
          { type: 'code', title: '개념 예제. IsEnabled · IsChecked · IsKeyboardFocused 트리거 (Visual Studio 에서 실행)', run: false, code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19MoreTriggers.MainWindow"
        ${NS}
        Title="여러 가지 속성 트리거" Width="400" Height="260">
    <Window.Resources>
        <Style x:Key="InputBox" TargetType="TextBox">
            <Setter Property="Padding" Value="4,2"/>
            <Style.Triggers>
                <!-- 입력 칸에 커서가 있는 동안 노란 배경 -->
                <Trigger Property="IsKeyboardFocused" Value="True">
                    <Setter Property="Background" Value="LightYellow"/>
                </Trigger>
            </Style.Triggers>
        </Style>
        <Style x:Key="AgreeCheck" TargetType="CheckBox">
            <Setter Property="Foreground" Value="Gray"/>
            <Style.Triggers>
                <!-- 체크되면 초록 + 굵게 -->
                <Trigger Property="IsChecked" Value="True">
                    <Setter Property="Foreground" Value="Green"/>
                    <Setter Property="FontWeight" Value="Bold"/>
                </Trigger>
            </Style.Triggers>
        </Style>
        <Style x:Key="SubmitButton" TargetType="Button">
            <Setter Property="Padding" Value="12,5"/>
            <Style.Triggers>
                <!-- 꺼진 버튼은 흐리게 -->
                <Trigger Property="IsEnabled" Value="False">
                    <Setter Property="Opacity" Value="0.4"/>
                </Trigger>
            </Style.Triggers>
        </Style>
    </Window.Resources>
    <StackPanel Margin="20">
        <TextBox Style="{StaticResource InputBox}" Text="이름을 입력하세요"/>
        <CheckBox x:Name="chkAgree" Content="약관에 동의합니다" Style="{StaticResource AgreeCheck}" Margin="0,10"
                  Checked="chkAgree_Changed" Unchecked="chkAgree_Changed"/>
        <Button x:Name="btnSubmit" Content="가입하기" Style="{StaticResource SubmitButton}"
                IsEnabled="False" HorizontalAlignment="Left"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch19MoreTriggers
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void chkAgree_Changed(object sender, RoutedEventArgs e)
        {
            // 코드는 IsEnabled 만 바꾼다 — 흐려지는 모양은 트리거가 알아서
            btnSubmit.IsEnabled = chkAgree.IsChecked == true;
        }
    }
}`, desc: '코드 비하인드는 “버튼을 켜고 끄기”만 하고, <b>켜지고 꺼질 때의 모양</b>은 모두 스타일 트리거가 맡습니다. 동작(코드)과 모양(스타일)을 나누는 것이 WPF 다운 방법입니다.' },
          { type: 'code', title: '개념 예제. DataTrigger — 데이터 값에 따라 모양 바꾸기 (Visual Studio 에서 실행)', run: false, code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19DataTriggerDemo.MainWindow"
        ${NS}
        Title="DataTrigger" Width="360" Height="260">
    <ListBox x:Name="lstScores" Margin="10">
        <ListBox.ItemTemplate>
            <DataTemplate>
                <TextBlock Text="{Binding Name}" FontSize="14">
                    <TextBlock.Style>
                        <Style TargetType="TextBlock">
                            <Setter Property="Foreground" Value="Black"/>
                            <Style.Triggers>
                                <!-- 바인딩한 데이터(Passed)가 False 이면 빨강 -->
                                <DataTrigger Binding="{Binding Passed}" Value="False">
                                    <Setter Property="Foreground" Value="Red"/>
                                    <Setter Property="FontWeight" Value="Bold"/>
                                </DataTrigger>
                            </Style.Triggers>
                        </Style>
                    </TextBlock.Style>
                </TextBlock>
            </DataTemplate>
        </ListBox.ItemTemplate>
    </ListBox>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;

namespace Ch19DataTriggerDemo
{
    public class Result
    {
        public string Name { get; set; } = "";
        public int Score { get; set; }
        public bool Passed => Score >= 60;
    }

    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstScores.ItemsSource = new List<Result>
            {
                new Result { Name = "김민준 (85점)", Score = 85 },
                new Result { Name = "이서연 (52점)", Score = 52 },
                new Result { Name = "박지호 (71점)", Score = 71 }
            };
        }
    }
}`, desc: '<code>Trigger</code> 가 “요소 자신의 속성”을 본다면, <code>DataTrigger</code> 는 <b>바인딩한 데이터의 값</b>을 봅니다. 60점 미만인 학생(Passed = False)만 빨간 굵은 글씨로 표시됩니다. 18장의 값 변환기(Converter)로도 할 수 있지만, “값이 이것일 때 이 모양”처럼 단순한 경우는 DataTrigger 가 더 읽기 쉽습니다.' },

          { type: 'h', text: '코드로 스타일 바꾸기 — 선택 상태 표시' },
          { type: 'p', html: '“선택된 탭”, “켜진 버튼”처럼 상태에 따라 모양을 바꾸는 일은 트리거 대신 <b>코드에서 <code>Style</code> 속성을 통째로 바꿔서</b>도 할 수 있습니다. 스타일 두 개(보통 · 선택)를 리소스로 만들어 두고, <code>btn.Style = (Style)FindResource("TabSelected");</code> 처럼 갈아 끼웁니다. 이 방법은 브라우저 실행기와 Visual Studio 에서 똑같이 동작합니다.' },
          { type: 'code', title: '예제 19-9. 스타일 교체로 탭 메뉴 만들기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19StyleSwap.MainWindow"
        ${NS}
        Title="코드로 스타일 바꾸기" Width="440" Height="300">
    <Window.Resources>
        <Style x:Key="TabNormal" TargetType="Button">
            <Setter Property="Background" Value="#ECEFF1"/>
            <Setter Property="Foreground" Value="#546E7A"/>
            <Setter Property="FontWeight" Value="Normal"/>
            <Setter Property="BorderThickness" Value="0"/>
            <Setter Property="Padding" Value="16,6"/>
            <Setter Property="Margin" Value="0,0,4,0"/>
        </Style>
        <Style x:Key="TabSelected" TargetType="Button" BasedOn="{StaticResource TabNormal}">
            <Setter Property="Background" Value="#1E88E5"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="FontWeight" Value="Bold"/>
        </Style>
    </Window.Resources>
    <DockPanel Margin="15">
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
            <Button x:Name="tabHome" Content="홈" Style="{StaticResource TabNormal}" Click="Tab_Click"/>
            <Button x:Name="tabNews" Content="소식" Style="{StaticResource TabNormal}" Click="Tab_Click"/>
            <Button x:Name="tabSettings" Content="설정" Style="{StaticResource TabNormal}" Click="Tab_Click"/>
        </StackPanel>
        <Border BorderBrush="#1E88E5" BorderThickness="0,3,0,0" Padding="12" Background="White">
            <TextBlock x:Name="txtPage" FontSize="15" TextWrapping="Wrap"/>
        </Border>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19StyleSwap
{
    public partial class MainWindow : Window
    {
        private Button[] tabs;

        public MainWindow()
        {
            InitializeComponent();
            tabs = new[] { tabHome, tabNews, tabSettings };
            Select(tabHome);
        }

        private void Tab_Click(object sender, RoutedEventArgs e)
        {
            Select((Button)sender);
        }

        private void Select(Button selected)
        {
            var normal = (Style)FindResource("TabNormal");
            var chosen = (Style)FindResource("TabSelected");
            foreach (Button tab in tabs)
                tab.Style = (tab == selected) ? chosen : normal;   // 선택된 탭만 다른 스타일
            txtPage.Text = $"[{selected.Content}] 화면입니다.\\n\\n선택한 탭은 TabSelected, 나머지는 TabNormal 스타일로 바꿨습니다.";
        }
    }
}`, desc: '탭을 누르면 그 탭만 파란 <code>TabSelected</code>, 나머지는 회색 <code>TabNormal</code> 이 됩니다. <code>TabNormal</code> 에 굳이 <code>FontWeight="Normal"</code> 을 적어 둔 이유는, 선택 스타일에서 보통 스타일로 <b>돌아올 때 굵기를 되돌리기</b> 위해서입니다. 스타일을 갈아 끼울 때는 두 스타일이 <b>같은 속성들</b>을 정하게 만들어 두면 안전합니다.' },

          { type: 'h', text: '데이터 템플릿 복습 — 리소스로 공유하기' },
          { type: 'p', html: '18장에서 <code>&lt;ListBox.ItemTemplate&gt;&lt;DataTemplate&gt;…</code> 으로 목록 항목을 꾸몄습니다. 이렇게 컨트롤 안에 직접 적은 템플릿은 그 ListBox 만 씁니다. 같은 모양을 여러 목록에서 쓰려면 DataTemplate 을 <b>리소스로 옮기고 <code>x:Key</code> 를 붙인 뒤</b> <code>ItemTemplate="{StaticResource 키}"</code> 로 연결합니다. 스타일과 똑같은 재사용 방식입니다.' },
          { type: 'code', title: '예제 19-10. 두 목록이 함께 쓰는 DataTemplate (x:Key)', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SharedTemplate.MainWindow"
        ${NS}
        Title="리소스로 공유하는 DataTemplate" Width="500" Height="360">
    <Window.Resources>
        <!-- Book 한 권을 어떻게 그릴지: 두 ListBox 가 함께 쓴다 -->
        <DataTemplate x:Key="BookTemplate">
            <Border BorderBrush="#C5CAE9" BorderThickness="0,0,0,1" Padding="4,6">
                <StackPanel>
                    <TextBlock Text="{Binding Title}" FontWeight="Bold" FontSize="14"/>
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Text="{Binding Author}" Foreground="Gray"/>
                        <TextBlock Text=" · " Foreground="Gray"/>
                        <TextBlock Text="{Binding Pages, StringFormat={}{0}쪽}" Foreground="Gray"/>
                    </StackPanel>
                </StackPanel>
            </Border>
        </DataTemplate>
    </Window.Resources>
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
        <TextBlock Text="📚 읽을 책" FontWeight="Bold" Margin="0,0,0,4"/>
        <TextBlock Text="✅ 다 읽은 책" FontWeight="Bold" Grid.Column="2" Margin="0,0,0,4"/>
        <ListBox x:Name="lstToRead" Grid.Row="1" ItemTemplate="{StaticResource BookTemplate}"/>
        <StackPanel Grid.Row="1" Grid.Column="1" VerticalAlignment="Center" Margin="6,0">
            <Button Content="→" Width="36" Margin="0,4" Click="btnDone_Click"/>
            <Button Content="←" Width="36" Margin="0,4" Click="btnBack_Click"/>
        </StackPanel>
        <ListBox x:Name="lstDone" Grid.Row="1" Grid.Column="2" ItemTemplate="{StaticResource BookTemplate}"/>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;

namespace Ch19SharedTemplate
{
    public class Book
    {
        public string Title { get; set; } = "";
        public string Author { get; set; } = "";
        public int Pages { get; set; }
    }

    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<Book> toRead = new ObservableCollection<Book>();
        private readonly ObservableCollection<Book> done = new ObservableCollection<Book>();

        public MainWindow()
        {
            InitializeComponent();
            toRead.Add(new Book { Title = "어린 왕자", Author = "생텍쥐페리", Pages = 136 });
            toRead.Add(new Book { Title = "모모", Author = "미하엘 엔데", Pages = 352 });
            toRead.Add(new Book { Title = "데미안", Author = "헤르만 헤세", Pages = 248 });
            done.Add(new Book { Title = "갈매기의 꿈", Author = "리처드 바크", Pages = 160 });
            lstToRead.ItemsSource = toRead;
            lstDone.ItemsSource = done;
        }

        private void btnDone_Click(object sender, RoutedEventArgs e) => Move(lstToRead, toRead, done);
        private void btnBack_Click(object sender, RoutedEventArgs e) => Move(lstDone, done, toRead);

        // 선택한 책을 한 목록에서 다른 목록으로 옮긴다
        private void Move(ListBox from, ObservableCollection<Book> source, ObservableCollection<Book> target)
        {
            if (from.SelectedItem is Book book)
            {
                source.Remove(book);
                target.Add(book);
            }
        }
    }
}`, desc: '왼쪽에서 책을 고르고 <b>→</b> 를 누르면 오른쪽으로 옮겨집니다. 두 목록은 서로 다른 ListBox 지만 <code>BookTemplate</code> 하나를 함께 쓰므로 모양이 똑같습니다. 제목을 더 크게 하고 싶으면 템플릿 한 곳만 고치면 됩니다. <code>StringFormat={}{0}쪽</code> 의 <code>{}</code> 는 “뒤의 중괄호는 마크업 확장이 아니다”라는 표시입니다(18장).' },
          { type: 'callout', kind: 'tip', title: '브라우저 실행기에서 DataTemplate 을 쓸 때', html: 'DataTemplate 안의 요소에서 <code>{StaticResource …}</code> 로 <b>Window.Resources</b> 의 브러시를 참조하면 브라우저 실행기에서는 찾지 못할 수 있습니다. 템플릿 안에서는 예제처럼 색을 직접 적거나, 템플릿이 쓰는 리소스를 <b>App.xaml</b> 에 두세요. (Visual Studio 에서는 둘 다 동작합니다.)' },
          { type: 'h', text: 'DataType — 형식만 맞으면 자동으로 적용' },
          { type: 'p', html: 'DataTemplate 에 <code>x:Key</code> 대신 <code>DataType="{x:Type local:Student}"</code> 을 적으면, <b>그 형식의 객체를 화면에 보여 줄 때마다 자동으로</b> 이 템플릿이 쓰입니다. 암시적 스타일의 데이터 버전이라고 생각하면 됩니다. ListBox 의 항목이든, ContentControl 의 <code>Content</code> 든, Button 의 <code>Content</code> 든 Student 객체가 들어가면 같은 모양입니다. <code>local:</code> 접두사는 Window/Application 태그에 <code>xmlns:local="clr-namespace:내네임스페이스"</code> 로 선언합니다.' },
          { type: 'code', title: '예제 19-11. DataType 으로 자동 적용 — App.xaml 의 Student 템플릿', code: `// ===== File: App.xaml =====
<Application x:Class="Ch19DataTypeTemplate.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:local="clr-namespace:Ch19DataTypeTemplate"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <!-- x:Key 대신 DataType: Student 객체는 앱 어디서든 이 모양으로 -->
        <DataTemplate DataType="{x:Type local:Student}">
            <StackPanel Orientation="Horizontal" Margin="2">
                <Border Width="34" Height="34" CornerRadius="17" Background="#26A69A">
                    <TextBlock Text="{Binding Initial}" Foreground="White" FontWeight="Bold"
                               HorizontalAlignment="Center" VerticalAlignment="Center"/>
                </Border>
                <StackPanel Margin="8,0,0,0" VerticalAlignment="Center">
                    <TextBlock Text="{Binding Name}" FontWeight="Bold"/>
                    <TextBlock Text="{Binding ScoreText}" Foreground="Gray"/>
                </StackPanel>
            </StackPanel>
        </DataTemplate>
    </Application.Resources>
</Application>
// ===== File: App.xaml.cs =====
using System.Windows;

namespace Ch19DataTypeTemplate
{
    public partial class App : Application
    {
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19DataTypeTemplate.MainWindow"
        ${NS}
        Title="DataType 으로 자동 적용" Width="470" Height="340">
    <Grid Margin="10">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="200"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <ListBox x:Name="lstStudents" SelectionChanged="lstStudents_SelectionChanged"/>
        <StackPanel Grid.Column="1" Margin="12,0,0,0">
            <TextBlock Text="선택한 학생" FontWeight="Bold" Margin="0,0,0,6"/>
            <Border BorderBrush="#26A69A" BorderThickness="2" CornerRadius="6" Padding="8">
                <ContentControl x:Name="ccSelected"/>
            </Border>
            <TextBlock TextWrapping="Wrap" Foreground="Gray" Margin="0,10,0,0"
                       Text="ListBox 와 ContentControl 어디에도 템플릿을 지정하지 않았습니다. Student 객체이므로 App.xaml 의 DataTemplate 이 자동으로 쓰입니다."/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;

namespace Ch19DataTypeTemplate
{
    public class Student
    {
        public string Name { get; set; } = "";
        public int Score { get; set; }
        public string Initial => Name.Substring(0, 1);
        public string ScoreText => $"점수 {Score}점";
    }

    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstStudents.ItemsSource = new List<Student>
            {
                new Student { Name = "김민준", Score = 95 },
                new Student { Name = "이서연", Score = 88 },
                new Student { Name = "박지호", Score = 72 },
                new Student { Name = "최하은", Score = 64 }
            };
            lstStudents.SelectedIndex = 0;
        }

        private void lstStudents_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ccSelected.Content = lstStudents.SelectedItem;   // Student 객체를 그대로 넣으면 템플릿이 그려 준다
        }
    }
}`, desc: 'ListBox 에는 <code>ItemTemplate</code> 이 없고, 오른쪽 <code>ContentControl</code> 에는 Student 객체를 <b>그대로</b> 넣었을 뿐인데 두 곳 모두 초록 동그라미 카드로 그려집니다. <code>x:Type</code> 은 “형식 자체”를 가리키는 마크업 확장입니다. 템플릿을 App.xaml 에 두었으므로 앱의 어느 창에서 Student 를 보여 주든 같은 모양이 됩니다.' },

          { type: 'h', text: '컨트롤 템플릿 — 컨트롤의 생김새를 통째로 바꾸기' },
          { type: 'p', html: '스타일은 Background · FontSize 처럼 <b>컨트롤이 이미 가진 속성의 값</b>만 바꿉니다. 그런데 “네모난 버튼을 <b>알약 모양</b>으로”, “체크 상자를 <b>스위치 모양</b>으로”처럼 <b>생김새 자체</b>를 바꾸고 싶을 때가 있습니다. WPF 의 모든 컨트롤은 자기 모양을 <b>ControlTemplate(컨트롤 템플릿)</b>으로 그리고, 이것을 <code>Template</code> 속성으로 갈아 끼울 수 있습니다. <b>기능(Click, IsPressed …)은 그대로 두고 모양만 새로</b> 그리는 것입니다.' },
          { type: 'figure', html: SVG_THREE, caption: 'Style 은 값을, ControlTemplate 은 컨트롤의 생김새를, DataTemplate 은 데이터의 모양을 정한다' },
          { type: 'list', items: [
            '<code>&lt;ControlTemplate TargetType="Button"&gt;</code> — 안에 Border · Grid · Ellipse 등으로 새 모양을 그립니다.',
            '<code>{TemplateBinding Background}</code> — 버튼에 적은 Background 값을 템플릿 안의 요소로 “연결”합니다. 이게 없으면 버튼의 Background 를 바꿔도 모양에 반영되지 않습니다.',
            '<code>&lt;ContentPresenter/&gt;</code> — 버튼의 <code>Content</code>(글자 · 아이콘)가 그려질 자리입니다. 빠뜨리면 버튼 글자가 사라집니다.',
            '<code>&lt;ControlTemplate.Triggers&gt;</code> — 마우스 올림 · 눌림 모양도 이제 직접 정합니다(<code>TargetName</code> 으로 템플릿 안 요소를 지정).'
          ] },
          { type: 'code', title: '개념 예제. ControlTemplate 으로 알약 모양 버튼 만들기 (Visual Studio 에서 실행)', run: false, code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19ControlTemplate.MainWindow"
        ${NS}
        Title="ControlTemplate — 버튼 모양 바꾸기" Width="400" Height="260">
    <Window.Resources>
        <Style x:Key="PillButton" TargetType="Button">
            <Setter Property="Background" Value="#43A047"/>
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="Padding" Value="22,8"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <!-- 새 모양: 둥근 Border + 가운데 Content -->
                        <Border x:Name="border" Background="{TemplateBinding Background}"
                                CornerRadius="18" Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="border" Property="Opacity" Value="0.85"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="border" Property="Opacity" Value="0.6"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Window.Resources>
    <StackPanel Margin="20" VerticalAlignment="Center">
        <Button Content="둥근 버튼" Style="{StaticResource PillButton}" HorizontalAlignment="Center" Click="Button_Click"/>
        <Button Content="같은 템플릿, 다른 색" Style="{StaticResource PillButton}" Background="#FB8C00"
                HorizontalAlignment="Center" Margin="0,10,0,0" Click="Button_Click"/>
        <TextBlock x:Name="txtInfo" HorizontalAlignment="Center" Margin="0,12,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace Ch19ControlTemplate
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            // 모양은 바뀌었지만 Button 의 기능(Click)은 그대로
            txtInfo.Text = $"'{((Button)sender).Content}' 클릭!";
        }
    }
}`, desc: '두 버튼은 같은 템플릿을 쓰지만 두 번째 버튼은 <code>Background="#FB8C00"</code> 을 적었더니 주황 알약이 됩니다. <code>TemplateBinding</code> 덕분입니다. 마우스를 올리거나 누르면 조금씩 투명해지는데, 이 효과도 템플릿의 트리거가 정합니다. 기본 버튼의 파란 마우스 올림 효과는 이제 사라집니다 — 모양 전체를 우리가 책임지기 때문입니다.' },
          { type: 'callout', kind: 'vs', title: 'ControlTemplate 은 Visual Studio 에서 실행해 보세요', html: '이 강좌의 브라우저 실행기는 ControlTemplate 을 <b>그리지 않습니다</b>(버튼이 기본 모양으로 보입니다). 위 코드를 Visual Studio 의 WPF 프로젝트에 붙여 넣고 <kbd>F5</kbd> 로 실행해 확인하세요.<ol><li>기본 템플릿을 출발점으로 삼고 싶으면: XAML 디자이너에서 버튼을 <b>오른쪽 클릭 → 템플릿 편집 → 복사본 편집…</b> 을 고릅니다. 기본 Button 템플릿 전체가 스타일 리소스로 복사되어, 필요한 부분만 고칠 수 있습니다.</li><li>복사된 템플릿은 길고 복잡하므로, 처음에는 위 예제처럼 <b>Border + ContentPresenter</b> 로 직접 짧게 쓰는 편이 이해하기 쉽습니다.</li></ol>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 템플릿은 언제 만들까?', html: '색 · 글꼴 · 여백만 바꾸면 되는 경우가 대부분이고, 이때는 <b>스타일로 충분</b>합니다. ControlTemplate 은 기본 모양으로는 도저히 원하는 디자인이 안 나올 때(둥근 버튼, 스위치형 토글, 아이콘 버튼 …) 쓰는 “최후의 수단”입니다. 템플릿을 만들면 키보드 포커스 표시 · 꺼진 상태(IsEnabled) 모양 등도 직접 챙겨야 하기 때문입니다. 실무에서는 MaterialDesign · MahApps 같은 <b>테마 라이브러리</b>(NuGet 패키지)를 써서 잘 만들어진 템플릿을 한꺼번에 가져오기도 합니다.' },

          { type: 'h', text: '라이트 / 다크 모드 전환' },
          { type: 'p', html: '요즘 앱들은 대부분 밝은 테마(라이트)와 어두운 테마(다크)를 고를 수 있습니다. 이번 장에서 배운 것을 모으면 간단한 테마 전환을 만들 수 있습니다. ① 역할별 브러시를 <b>두 세트</b>(<code>LightBg · LightText …</code> / <code>DarkBg · DarkText …</code>)로 리소스에 만들고, ② 버튼을 누르면 사용할 세트의 접두어를 바꾼 뒤, ③ 코드에서 <code>FindResource</code> 로 브러시를 찾아 각 요소의 Background · Foreground 에 다시 넣습니다.' },
          { type: 'figure', html: SVG_THEME, caption: '두 브러시 세트 중 하나를 골라 코드로 요소에 넣는다' },
          { type: 'code', title: '예제 19-12. 라이트 / 다크 모드 전환 버튼', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19DarkMode.MainWindow"
        ${NS}
        Title="라이트 / 다크 모드" Width="420" Height="340">
    <Window.Resources>
        <!-- 라이트 테마 -->
        <SolidColorBrush x:Key="LightBg" Color="#F5F5F5"/>
        <SolidColorBrush x:Key="LightCard" Color="White"/>
        <SolidColorBrush x:Key="LightText" Color="#212121"/>
        <SolidColorBrush x:Key="LightSub" Color="#757575"/>
        <!-- 다크 테마: 이름 규칙이 같다 (접두어 + 역할) -->
        <SolidColorBrush x:Key="DarkBg" Color="#121212"/>
        <SolidColorBrush x:Key="DarkCard" Color="#1E1E1E"/>
        <SolidColorBrush x:Key="DarkText" Color="#EEEEEE"/>
        <SolidColorBrush x:Key="DarkSub" Color="#9E9E9E"/>
    </Window.Resources>
    <Border x:Name="root" Padding="15">
        <StackPanel>
            <DockPanel Margin="0,0,0,10">
                <Button x:Name="btnTheme" DockPanel.Dock="Right" Padding="10,4" Click="btnTheme_Click"/>
                <TextBlock x:Name="txtTitle" Text="오늘의 할 일" FontSize="20" FontWeight="Bold" VerticalAlignment="Center"/>
            </DockPanel>
            <Border x:Name="card1" CornerRadius="8" Padding="12" Margin="0,4">
                <StackPanel>
                    <TextBlock x:Name="txtTask1" Text="WPF 스타일 복습하기" FontSize="15"/>
                    <TextBlock x:Name="txtSub1" Text="19장 · 오후 3시"/>
                </StackPanel>
            </Border>
            <Border x:Name="card2" CornerRadius="8" Padding="12" Margin="0,4">
                <StackPanel>
                    <TextBlock x:Name="txtTask2" Text="다크 모드 만들어 보기" FontSize="15"/>
                    <TextBlock x:Name="txtSub2" Text="실습 19-4 · 오후 5시"/>
                </StackPanel>
            </Border>
            <TextBlock x:Name="txtStatus" Margin="0,10,0,0"/>
        </StackPanel>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19DarkMode
{
    public partial class MainWindow : Window
    {
        private bool isDark = false;

        public MainWindow()
        {
            InitializeComponent();
            ApplyTheme();
        }

        private void btnTheme_Click(object sender, RoutedEventArgs e)
        {
            isDark = !isDark;
            ApplyTheme();
        }

        // 역할 이름("Bg", "Text" …)에 지금 테마의 접두어를 붙여 브러시를 찾는다
        private Brush Theme(string role) => (Brush)FindResource((isDark ? "Dark" : "Light") + role);

        private void ApplyTheme()
        {
            root.Background = Theme("Bg");
            card1.Background = Theme("Card");
            card2.Background = Theme("Card");
            txtTitle.Foreground = Theme("Text");
            txtTask1.Foreground = Theme("Text");
            txtTask2.Foreground = Theme("Text");
            txtSub1.Foreground = Theme("Sub");
            txtSub2.Foreground = Theme("Sub");
            txtStatus.Foreground = Theme("Sub");
            btnTheme.Content = isDark ? "☀ 라이트 모드" : "🌙 다크 모드";
            txtStatus.Text = isDark ? "지금은 다크 테마 (Dark… 브러시)" : "지금은 라이트 테마 (Light… 브러시)";
        }
    }
}`, desc: '오른쪽 위 버튼을 누를 때마다 배경 · 카드 · 글자색이 한꺼번에 바뀝니다. 핵심은 <code>Theme("Bg")</code> 한 줄입니다. 두 세트의 이름 규칙을 <b>“접두어 + 역할”</b>로 똑같이 맞춰 두었기 때문에, 접두어만 바꾸면 같은 코드로 어느 세트든 꺼낼 수 있습니다. 색을 바꾸고 싶으면 Resources 의 브러시만 고치면 됩니다.' },
          { type: 'callout', kind: 'vs', title: '실제 WPF 에서는 DynamicResource 로 더 간단하게', html: '실제 WPF 에는 <b><code>DynamicResource</code></b> 가 있습니다. <code>StaticResource</code> 는 처음에 한 번만 값을 찾지만, <code>DynamicResource</code> 는 리소스가 <b>바뀔 때마다 다시 찾아</b> 화면을 고칩니다. 그래서 요소마다 코드를 적지 않고 <b>리소스만 바꿔 넣으면</b> 됩니다. 이 강좌의 브라우저 실행기는 DynamicResource 도 한 번만 찾으므로(다시 계산하지 않음), 아래 코드는 Visual Studio 에서 실행해 보세요.' },
          { type: 'code', title: '개념 예제. DynamicResource 로 테마 바꾸기 (Visual Studio 에서 실행)', run: false, code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19DynamicTheme.MainWindow"
        ${NS}
        Title="DynamicResource" Width="360" Height="220">
    <Window.Resources>
        <SolidColorBrush x:Key="BgBrush" Color="#F5F5F5"/>
        <SolidColorBrush x:Key="TextBrush" Color="#212121"/>
    </Window.Resources>
    <Border Background="{DynamicResource BgBrush}">
        <StackPanel Margin="20">
            <TextBlock Text="DynamicResource 로 연결한 글자" FontSize="18" Foreground="{DynamicResource TextBrush}"/>
            <Button Content="다크 모드" Margin="0,12,0,0" HorizontalAlignment="Left" Padding="10,4" Click="btnDark_Click"/>
        </StackPanel>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace Ch19DynamicTheme
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void btnDark_Click(object sender, RoutedEventArgs e)
        {
            // 리소스 자체를 새 브러시로 바꿔 넣으면 DynamicResource 로 연결한 곳이 모두 따라 바뀐다
            Resources["BgBrush"] = new SolidColorBrush(Color.FromRgb(0x12, 0x12, 0x12));
            Resources["TextBrush"] = new SolidColorBrush(Color.FromRgb(0xEE, 0xEE, 0xEE));
        }
    }
}`, desc: '앱 전체 테마를 바꿀 때는 App.xaml 의 <code>MergedDictionaries</code> 에서 <code>LightTheme.xaml</code> 을 <code>DarkTheme.xaml</code> 로 통째로 바꾸는 방법도 많이 씁니다(<code>Application.Current.Resources.MergedDictionaries</code>). 두 파일의 키 이름을 똑같이 맞춰 두는 것이 핵심입니다.' },

          { type: 'h', text: '앱 전체의 일관된 디자인 만들기 — 정리' },
          { type: 'list', ordered: true, items: [
            '<b>색상표부터</b> — <code>PrimaryBrush · SecondaryBrush · BackgroundBrush · TextBrush</code> 처럼 역할로 이름 붙인 브러시를 <code>Theme.xaml</code> 에 모읍니다.',
            '<b>기본 모양은 암시적 스타일</b> — 앱의 모든 Button · TextBox 가 따를 기본 스타일을 App.xaml(또는 합쳐 온 사전)에 둡니다.',
            '<b>변형은 명시적 스타일 + BasedOn</b> — 강조 · 위험 · 링크 버튼, 제목 글자 등은 x:Key 를 붙이고 기본을 물려받습니다.',
            '<b>상태 표현은 트리거</b> — 마우스 올림 · 꺼짐 · 체크됨 모양은 코드 대신 스타일 트리거로(브라우저에서는 IsMouseOver 만).',
            '<b>데이터 모양은 DataTemplate</b> — 여러 목록에서 쓰면 x:Key 리소스로, 형식마다 같은 모양이면 DataType 으로.',
            '<b>ControlTemplate 은 꼭 필요할 때만</b> — 기본 모양으로 안 될 때 Visual Studio 에서 “복사본 편집”으로 시작합니다.',
            '<b>XAML 에 색을 직접 적지 않기</b> — <code>Background="#1976D2"</code> 가 보이면 “리소스로 옮길까?”를 먼저 생각합니다.'
          ] }
        ],
        practice: [
          {
            title: '실습 19-3. 연락처 목록 카드 디자인 (DataTemplate 리소스)',
            level: 2,
            desc: '<p>연락처 목록이 지금은 이름만 글자로 보입니다(ToString). <code>Window.Resources</code> 에 <code>x:Key="ContactCard"</code> 인 DataTemplate 을 만들어 항목을 카드 모양으로 바꾸세요.</p><ul><li>왼쪽: 지름 40 의 보라색(<code>#7E57C2</code>) 동그라미 안에 이름 첫 글자(<code>Initial</code>)</li><li>가운데: 이름(굵게, 14) 과 전화번호(회색)를 위아래로</li><li>오른쪽: 그룹(가족 · 친구 · 학교)을 작은 보라색 글씨로</li><li>ListBox 에 <code>ItemTemplate="{StaticResource ContactCard}"</code> 를 연결합니다. 항목을 고르면 아래에 <code>선택: 이름 (전화번호)</code> 가 표시되는지 확인하세요.</li></ul>',
            hint: '동그라미는 <code>&lt;Border Width="40" Height="40" CornerRadius="20" Background="#7E57C2"&gt;</code> 안에 TextBlock 을 가운데 정렬로 넣습니다. 가로 배치는 <code>StackPanel Orientation="Horizontal"</code>. 템플릿 안의 색은 리소스 대신 직접 적으세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 19-4. 메모장 라이트 / 다크 전환',
            level: 2,
            desc: '<p>메모장 화면에 라이트(<code>LightBg · LightBox · LightText</code>)와 다크(<code>DarkBg · DarkBox · DarkText</code>) 브러시가 준비되어 있습니다. 버튼을 누를 때마다 테마가 바뀌도록 완성하세요.</p><ul><li>배경(<code>root</code>), 메모 칸(<code>txtMemo</code>)의 배경과 글자, 제목 · 상태 글자의 색을 바꿉니다.</li><li>버튼 글자는 다크일 때 <code>☀ 라이트 모드</code>, 라이트일 때 <code>🌙 다크 모드</code>.</li><li>상태 줄에 <code>지금은 다크 테마</code> / <code>지금은 라이트 테마</code> 를 표시합니다.</li></ul>',
            hint: '<code>private Brush Theme(string role) =&gt; (Brush)FindResource((isDark ? "Dark" : "Light") + role);</code> 같은 도우미 메서드를 만들면 <code>root.Background = Theme("Bg");</code> 처럼 짧게 쓸 수 있습니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '스타일에 <code>&lt;Trigger Property="IsMouseOver" Value="True"&gt;</code> 로 BorderBrush 를 주황으로 바꿨습니다. 마우스가 요소에서 <b>벗어나면</b>?', options: ['주황색이 그대로 남는다', 'MouseLeave 처리기에서 원래 색으로 되돌려야 한다', '자동으로 스타일 Setter 의 원래 값으로 돌아간다', '프로그램이 오류로 멈춘다'], answer: 2, explain: '트리거는 조건이 맞는 동안만 적용됩니다. 조건이 끝나면 원래 값으로 자동 복귀하므로 되돌리는 코드가 필요 없습니다.' },
          { q: 'Window.Resources 에 <code>&lt;DataTemplate x:Key="BookTemplate"&gt;</code> 를 만들었습니다. ListBox 에 연결하는 올바른 방법은?', options: ['<code>ItemTemplate="{StaticResource BookTemplate}"</code>', '<code>Style="{StaticResource BookTemplate}"</code>', '<code>Template="BookTemplate"</code>', '<code>ItemsSource="{StaticResource BookTemplate}"</code>'], answer: 0, explain: '항목 모양은 <code>ItemTemplate</code> 속성입니다. <code>ItemsSource</code> 는 데이터, <code>Style</code> 은 스타일, <code>Template</code> 은 컨트롤 템플릿 자리입니다.' },
          { q: '<code>&lt;DataTemplate DataType="{x:Type local:Student}"&gt;</code> (x:Key 없음)을 App.xaml 에 두면 어떻게 되나요?', options: ['x:Key 가 없어서 오류가 난다', 'Student 객체를 보여 주는 ListBox 항목 · ContentControl 등에 자동으로 적용된다', 'Student 클래스의 ToString 이 바뀐다', 'ItemTemplate 을 적은 ListBox 에만 적용된다'], answer: 1, explain: 'DataType 템플릿은 형식이 키가 되어 그 형식의 데이터를 표시할 때 자동으로 쓰입니다. 암시적 스타일의 데이터 버전입니다.' },
          { q: '네모난 기본 버튼을 <b>알약 모양</b>으로 바꾸고, 마우스 올림 모양도 직접 정하고 싶습니다. 무엇을 써야 하나요?', options: ['Setter 로 CornerRadius 를 준다', 'DataTemplate', 'BasedOn', '<code>Template</code> 속성에 ControlTemplate 을 넣는다'], answer: 3, explain: 'Button 에는 CornerRadius 속성이 없습니다. 생김새 자체는 ControlTemplate 으로 새로 그리고, <code>TemplateBinding</code> 과 <code>ContentPresenter</code> 로 버튼의 값 · 내용을 연결합니다.' },
          { q: '<code>&lt;Border Background="{StaticResource BgBrush}"/&gt;</code> 로 창을 만든 뒤, 코드에서 <code>Resources["BgBrush"] = Brushes.Black;</code> 을 실행하면?', options: ['이미 그려진 Border 의 배경은 바뀌지 않는다 — StaticResource 는 처음에 한 번만 찾는다', 'Border 배경이 즉시 검정으로 바뀐다', '오류가 난다 — 리소스는 코드에서 바꿀 수 없다', '창이 새로 만들어진다'], answer: 0, explain: 'StaticResource 는 XAML 을 읽을 때 한 번 값을 넣고 끝입니다. 리소스 교체를 따라가게 하려면 실제 WPF 의 <code>DynamicResource</code> 를 쓰거나, 이 장의 예제처럼 코드에서 요소의 속성을 직접 다시 넣습니다.' }
        ],
        slides: [
          { layout: 'title', title: '트리거와 템플릿', subtitle: 'Chapter 19 · Section 02 — 스타일 · 리소스 · 템플릿 ②', badge: '19-2',
            notes: '<p><b>[도입 2분]</b> 지난 시간 복습: 리소스 · 스타일 · BasedOn · App.xaml. “마우스를 올리면 색이 바뀌는 카드는 어떻게 만들까?”로 시작합니다.</p><p>오늘 목표: 트리거 → 코드로 스타일 바꾸기 → DataTemplate 공유 · DataType → ControlTemplate 개념 → 다크 모드.</p>' },
          { layout: 'code', title: 'IsMouseOver 트리거', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideHover.MainWindow"
        ${NS}
        Title="IsMouseOver" Width="340" Height="200">
    <Window.Resources>
        <Style x:Key="Card" TargetType="Border">
            <Setter Property="Background" Value="White"/>
            <Setter Property="BorderBrush" Value="#DDDDDD"/>
            <Style.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Background" Value="#FFF3E0"/>
                    <Setter Property="BorderBrush" Value="DarkOrange"/>
                </Trigger>
            </Style.Triggers>
        </Style>
    </Window.Resources>
    <Border Style="{StaticResource Card}" BorderThickness="2" Padding="12" Margin="20">
        <TextBlock Text="마우스를 올려 보세요" FontSize="16"/>
    </Border>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideHover
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`, points: ['<code>Style.Triggers</code> 안에 <code>Trigger</code>', '조건이 맞는 <b>동안만</b> Setter 적용', '벗어나면 <b>자동으로</b> 원래 값', '브라우저: IsMouseOver 만 흉내'],
            notes: '<p><b>[6분]</b> 실행해 마우스를 올렸다 내렸다 합니다. “MouseEnter/MouseLeave 이벤트로 만들면 몇 줄일까?” 비교 발문.</p><p>주의: 실제 WPF 에서 <b>Button 의 Background</b> 는 기본 템플릿 때문에 hover 트리거가 안 먹힘 → Border 로 시연하는 이유. 뒤의 ControlTemplate 과 연결.</p>' },
          { layout: 'table', title: '트리거의 종류', head: ['종류', '조건', '예'], rows: [['Trigger', '요소 자신의 속성', 'IsMouseOver · IsEnabled · IsChecked'], ['MultiTrigger', '여러 속성이 모두', '체크됨 + 마우스 올림'], ['DataTrigger', '바인딩한 데이터 값', 'Score &lt; 60 → 빨강 (Passed=False)'], ['EventTrigger', '이벤트 → 애니메이션', 'Loaded 때 나타나기 (22장)']], lead: '동작은 코드, 모양은 스타일 트리거',
            notes: '<p><b>[4분]</b> 개념 예제(IsEnabled · IsChecked · DataTrigger)는 Visual Studio 에서 시연합니다. 브라우저 실행기는 IsMouseOver 만 흉내 내고 나머지는 무시한다고 안내합니다.</p>' },
          { layout: 'code', title: '코드로 스타일 갈아 끼우기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideSwap.MainWindow"
        ${NS}
        Title="스타일 교체" Width="340" Height="160">
    <Window.Resources>
        <Style x:Key="Off" TargetType="Button">
            <Setter Property="Background" Value="#ECEFF1"/>
        </Style>
        <Style x:Key="On" TargetType="Button">
            <Setter Property="Background" Value="#FFCDD2"/>
        </Style>
    </Window.Resources>
    <Button x:Name="btnLike" Content="♥ 좋아요" Style="{StaticResource Off}" Margin="30" Click="btnLike_Click"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideSwap
{
    public partial class MainWindow : Window
    {
        private bool on;
        public MainWindow() { InitializeComponent(); }
        private void btnLike_Click(object sender, RoutedEventArgs e)
        {
            on = !on;
            btnLike.Style = (Style)FindResource(on ? "On" : "Off");
        }
    }
}`, points: ['스타일 두 개를 리소스로', '<code>btn.Style = (Style)FindResource("On");</code>', '두 스타일이 <b>같은 속성</b>을 정하게', '예제 19-9: 탭 메뉴'],
            notes: '<p><b>[3분]</b> 트리거로 못 하는(또는 브라우저에서 안 되는) 상태 표시는 코드로 스타일 교체. 예제 19-9 의 탭 메뉴도 함께 실행해 보여 줍니다.</p>' },
          { layout: 'code', title: 'DataTemplate 을 리소스로 공유', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideTemplate.MainWindow"
        ${NS}
        Title="DataTemplate 리소스" Width="340" Height="220">
    <Window.Resources>
        <DataTemplate x:Key="BookTemplate">
            <StackPanel Margin="2">
                <TextBlock Text="{Binding Title}" FontWeight="Bold"/>
                <TextBlock Text="{Binding Author}" Foreground="Gray"/>
            </StackPanel>
        </DataTemplate>
    </Window.Resources>
    <ListBox x:Name="lstBooks" ItemTemplate="{StaticResource BookTemplate}" Margin="10"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch19SlideTemplate
{
    public class Book { public string Title { get; set; } = ""; public string Author { get; set; } = ""; }
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lstBooks.ItemsSource = new[] { new Book { Title = "어린 왕자", Author = "생텍쥐페리" },
                                           new Book { Title = "모모", Author = "미하엘 엔데" } };
        }
    }
}`, points: ['DataTemplate + <code>x:Key</code> → 리소스', '<code>ItemTemplate="{StaticResource …}"</code>', '여러 목록이 같은 모양', 'x:Key 대신 <code>DataType</code> → 자동 적용'],
            notes: '<p><b>[5분]</b> 18장의 ItemTemplate 을 리소스로 “옮기기만” 한 것임을 강조. 예제 19-10(두 목록), 19-11(DataType, App.xaml)을 이어서 실행합니다.</p><p>DataType = “암시적 스타일의 데이터 버전”.</p>' },
          { layout: 'diagram', title: 'Style · ControlTemplate · DataTemplate', html: SVG_THREE, caption: '값 · 생김새 · 데이터 모양',
            notes: '<p><b>[3분]</b> 세 가지를 헷갈리지 않게 한 문장씩: Style = 속성 값 묶음, ControlTemplate = 컨트롤의 생김새, DataTemplate = 데이터를 그리는 방법.</p>' },
          { layout: 'two', title: 'ControlTemplate — 버튼 모양 바꾸기',
            left: { title: '핵심 요소', bullets: ['<code>Template</code> 속성에 <code>ControlTemplate</code>', '<code>{TemplateBinding Background}</code> — 버튼 값 연결', '<code>&lt;ContentPresenter/&gt;</code> — Content 자리', '기능(Click)은 그대로, 모양만 새로', '브라우저 ✘ → <b>Visual Studio 에서 실행</b>'] },
            right: { title: 'XAML 조각', code: `<Setter Property="Template">
  <Setter.Value>
    <ControlTemplate TargetType="Button">
      <Border Background="{TemplateBinding Background}"
              CornerRadius="18" Padding="20,8">
        <ContentPresenter HorizontalAlignment="Center"/>
      </Border>
    </ControlTemplate>
  </Setter.Value>
</Setter>`, run: false },
            notes: '<p><b>[6분]</b> Visual Studio 에서 개념 예제(알약 버튼)를 실행해 보여 줍니다. ContentPresenter 를 지우면 글자가 사라지는 것, TemplateBinding 을 고정 색으로 바꾸면 Background 속성이 무시되는 것을 시연하면 이해가 빠릅니다.</p><p>디자이너: 버튼 오른쪽 클릭 → 템플릿 편집 → 복사본 편집.</p>' },
          { layout: 'diagram', title: '라이트 / 다크 전환', html: SVG_THEME, caption: '같은 이름 규칙(접두어 + 역할)의 브러시 두 세트',
            notes: '<p><b>[2분]</b> 이름 규칙이 핵심: LightBg ↔ DarkBg. 규칙이 같으니 접두어만 바꾸면 된다.</p>' },
          { layout: 'code', title: '다크 모드 — 코드로 브러시 넣기', code: `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch19SlideDark.MainWindow"
        ${NS}
        Title="다크 모드" Width="340" Height="200">
    <Window.Resources>
        <SolidColorBrush x:Key="LightBg" Color="#F5F5F5"/>
        <SolidColorBrush x:Key="DarkBg" Color="#121212"/>
    </Window.Resources>
    <StackPanel x:Name="root" Background="{StaticResource LightBg}">
        <TextBlock Text="다크 모드 연습" FontSize="20" Foreground="Gray" Margin="20,20,20,0"/>
        <Button Content="테마 바꾸기" Margin="20,10" Click="btnTheme_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;
namespace Ch19SlideDark
{
    public partial class MainWindow : Window
    {
        private bool dark;
        public MainWindow() { InitializeComponent(); }
        private void btnTheme_Click(object sender, RoutedEventArgs e)
        {
            dark = !dark;
            root.Background = (Brush)FindResource(dark ? "DarkBg" : "LightBg");
        }
    }
}`, points: ['브러시 두 세트를 리소스로', '<code>FindResource(dark ? "DarkBg" : "LightBg")</code>', 'StaticResource 는 한 번만 찾음 → 코드로 다시 넣기', '실제 WPF: <code>DynamicResource</code> 도 가능'],
            notes: '<p><b>[4분]</b> 예제 19-12 로 전체 버전을 보여 줍니다. “Resources[\"LightBg\"] 를 바꾸면 왜 안 바뀔까?” → StaticResource 는 한 번만 찾기 때문. Visual Studio 에서는 DynamicResource 개념 예제로 차이를 시연합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Window.Resources 의 <code>&lt;DataTemplate x:Key="BookTemplate"&gt;</code> 를 ListBox 에 연결하는 방법은?', options: ['<code>Style="{StaticResource BookTemplate}"</code>', '<code>ItemsSource="{StaticResource BookTemplate}"</code>', '<code>ItemTemplate="{StaticResource BookTemplate}"</code>', '<code>Template="{StaticResource BookTemplate}"</code>'], answer: 2, explain: '항목의 모양은 <code>ItemTemplate</code> 입니다. <code>Template</code> 은 ControlTemplate(컨트롤 자체의 생김새) 자리입니다.',
            notes: '<p><b>[2분]</b> 오답 보기(Style · ItemsSource · Template)가 각각 무엇인지 한 번씩 짚어 줍니다.</p>' },
          { layout: 'practice', title: '실습 19-3. 연락처 카드 DataTemplate', desc: '<p><code>x:Key="ContactCard"</code> DataTemplate — 보라 동그라미 안 첫 글자 + 이름 · 전화번호 + 그룹. ListBox 의 <code>ItemTemplate</code> 에 연결.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[5분]</b> 먼저 이름만 보이는 템플릿을 연결해 동작을 확인하고 → 동그라미 → 전화번호 순서로 늘려 가게 합니다. 빠른 학생은 실습 19-4(다크 모드).</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>Style.Triggers</code> — 조건이 맞는 동안만, 끝나면 자동 복귀', 'IsEnabled · IsChecked · DataTrigger 는 Visual Studio 에서 확인', '상태 표시는 <code>btn.Style = (Style)FindResource(…)</code> 로도', 'DataTemplate: x:Key → <code>ItemTemplate</code>, <code>DataType</code> → 자동', 'ControlTemplate = 생김새 교체 (TemplateBinding · ContentPresenter)', '다크 모드 = 브러시 두 세트 + 코드로 다시 넣기'],
            notes: '<p><b>[1분]</b> 다음 장(20장 MVVM 패턴) 예고: 화면(XAML)과 로직을 더 깔끔하게 나누는 구조. 오늘 만든 Theme.xaml 은 이후 프로젝트에서도 재사용하도록 권합니다.</p>' }
        ]
      }
    ]
  });
})();
