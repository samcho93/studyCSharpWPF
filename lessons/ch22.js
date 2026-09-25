/* Chapter 22. 그래픽 · 애니메이션 · 타이머 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 그림 1. Canvas 좌표와 도형의 위치 · 크기 ---------- */
  const SVG_COORD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="Canvas 좌표계와 Rectangle, Ellipse, Line, Polygon 의 위치와 크기를 정하는 속성">
  <defs><marker id="ah22a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto-start-reverse" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <rect x="50" y="50" width="700" height="480" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="740" y="520" text-anchor="end" style="font-size:20px;fill:var(--muted)">Canvas</text>
  <circle cx="50" cy="50" r="7" fill="var(--danger)"/>
  <text x="62" y="40" style="${MONO};font-size:19px;fill:var(--danger)">(0, 0)</text>
  <g stroke="var(--accent2)" stroke-width="3">
    <line x1="50" y1="50" x2="250" y2="50" marker-end="url(#ah22a)"/>
    <line x1="50" y1="50" x2="50" y2="200" marker-end="url(#ah22a)"/>
  </g>
  <text x="258" y="58" style="font-size:22px;font-weight:700;fill:var(--accent2)">X →</text>
  <text x="62" y="222" style="font-size:22px;font-weight:700;fill:var(--accent2)">Y ↓</text>
  <g stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 6">
    <line x1="50" y1="130" x2="130" y2="130"/>
    <line x1="130" y1="50" x2="130" y2="130"/>
  </g>
  <text x="66" y="122" style="${MONO};font-size:17px;fill:var(--muted)">Left</text>
  <text x="138" y="100" style="${MONO};font-size:17px;fill:var(--muted)">Top</text>
  <rect x="130" y="130" width="220" height="120" fill="var(--accent)" opacity="0.22"/>
  <rect x="130" y="130" width="220" height="120" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="240" y="198" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">Rectangle</text>
  <g stroke="var(--accent2)" stroke-width="2">
    <line x1="134" y1="272" x2="346" y2="272" marker-start="url(#ah22a)" marker-end="url(#ah22a)"/>
    <line x1="374" y1="134" x2="374" y2="246" marker-start="url(#ah22a)" marker-end="url(#ah22a)"/>
  </g>
  <text x="240" y="298" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">Width</text>
  <text x="386" y="196" style="${MONO};font-size:18px;fill:var(--fg)">Height</text>
  <line x1="460" y1="100" x2="710" y2="230" stroke="var(--accent2)" stroke-width="5"/>
  <circle cx="460" cy="100" r="7" fill="var(--danger)"/>
  <circle cx="710" cy="230" r="7" fill="var(--danger)"/>
  <text x="470" y="86" style="${MONO};font-size:18px;fill:var(--fg)">(X1, Y1)</text>
  <text x="710" y="262" text-anchor="end" style="${MONO};font-size:18px;fill:var(--fg)">(X2, Y2)</text>
  <text x="600" y="150" style="font-size:20px;font-weight:700;fill:var(--accent2)">Line</text>
  <rect x="110" y="340" width="200" height="120" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>
  <ellipse cx="210" cy="400" rx="100" ry="60" fill="var(--warn)" opacity="0.3" stroke="var(--warn)" stroke-width="3"/>
  <text x="210" y="408" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">Ellipse</text>
  <text x="210" y="490" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Width × Height 상자에 꽉 차게</text>
  <polygon points="470,470 560,330 650,470" fill="var(--ok)" opacity="0.25" stroke="var(--ok)" stroke-width="3"/>
  <g fill="var(--ok)"><circle cx="470" cy="470" r="6"/><circle cx="560" cy="330" r="6"/><circle cx="650" cy="470" r="6"/></g>
  <text x="560" y="440" text-anchor="middle" style="font-size:21px;font-weight:700;fill:var(--fg)">Polygon</text>
  <text x="560" y="500" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Points = 꼭짓점 목록</text>
  <g style="font-size:20px">
    <text x="790" y="80" style="font-weight:700;fill:var(--accent)">① 좌표: 왼쪽 위가 (0, 0)</text>
    <text x="790" y="110" style="fill:var(--muted)">X 는 오른쪽으로, Y 는 아래로 커진다</text>
    <text x="790" y="170" style="font-weight:700;fill:var(--fg)">② Rectangle · Ellipse</text>
    <text x="790" y="200" style="${MONO};font-size:18px;fill:var(--fg)">Canvas.Left · Canvas.Top</text>
    <text x="790" y="228" style="font-size:18px;fill:var(--muted)">= 왼쪽 위 모서리, Width · Height = 크기</text>
    <text x="790" y="288" style="font-weight:700;fill:var(--fg)">③ Line</text>
    <text x="790" y="318" style="${MONO};font-size:18px;fill:var(--fg)">X1,Y1 → X2,Y2 (두 점을 잇는다)</text>
    <text x="790" y="378" style="font-weight:700;fill:var(--fg)">④ Polyline · Polygon</text>
    <text x="790" y="408" style="${MONO};font-size:18px;fill:var(--fg)">Points="x,y x,y …"</text>
    <text x="790" y="468" style="font-weight:700;fill:var(--fg)">⑤ Path</text>
    <text x="790" y="498" style="${MONO};font-size:18px;fill:var(--fg)">Data="M … L … C … A … Z"</text>
  </g>
</svg>`;

  /* ---------- 그림 2. RenderTransform 네 가지 ---------- */
  const SVG_TRANSFORM = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="RotateTransform, RenderTransformOrigin, ScaleTransform, TranslateTransform 의 효과 비교">
  <defs><marker id="ah22b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent2)"/></marker></defs>
  <g style="font-size:22px;font-weight:700" text-anchor="middle">
    <text x="170" y="56" style="fill:var(--accent)">① 회전 (기본 기준점)</text>
    <text x="485" y="56" style="fill:var(--accent)">② 회전 (가운데 기준)</text>
    <text x="800" y="56" style="fill:var(--ok)">③ 크기</text>
    <text x="1115" y="56" style="fill:var(--warn)">④ 이동</text>
  </g>
  <g style="${MONO};font-size:17px;fill:var(--fg)" text-anchor="middle">
    <text x="170" y="90">RotateTransform Angle="30"</text>
    <text x="485" y="90">RotateTransform Angle="30"</text>
    <text x="800" y="90">ScaleTransform 1.5 × 1.5</text>
    <text x="1115" y="90">TranslateTransform X=40 Y=30</text>
  </g>
  <g fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5">
    <rect x="120" y="190" width="100" height="70"/>
    <rect x="435" y="190" width="100" height="70"/>
    <rect x="750" y="190" width="100" height="70"/>
    <rect x="1045" y="170" width="100" height="70"/>
  </g>
  <rect x="120" y="190" width="100" height="70" fill="var(--accent)" opacity="0.4" stroke="var(--accent)" stroke-width="3" transform="rotate(30 120 190)"/>
  <circle cx="120" cy="190" r="7" fill="var(--danger)"/>
  <rect x="435" y="190" width="100" height="70" fill="var(--accent)" opacity="0.4" stroke="var(--accent)" stroke-width="3" transform="rotate(30 485 225)"/>
  <circle cx="485" cy="225" r="7" fill="var(--danger)"/>
  <rect x="725" y="172.5" width="150" height="105" fill="var(--ok)" opacity="0.35" stroke="var(--ok)" stroke-width="3"/>
  <circle cx="800" cy="225" r="7" fill="var(--danger)"/>
  <rect x="1085" y="200" width="100" height="70" fill="var(--warn)" opacity="0.4" stroke="var(--warn)" stroke-width="3"/>
  <line x1="1045" y1="170" x2="1079" y2="195" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ah22b)"/>
  <g style="font-size:18px;fill:var(--muted)" text-anchor="middle">
    <text x="170" y="360">빨간 점 = 기준점</text>
    <text x="170" y="386">기본값 (0,0) = 왼쪽 위 모서리</text>
    <text x="485" y="360" style="${MONO};font-size:16px">RenderTransformOrigin="0.5,0.5"</text>
    <text x="485" y="386">(0.5, 0.5) = 도형의 가운데</text>
    <text x="800" y="360">ScaleX · ScaleY = 배율</text>
    <text x="800" y="386">1 = 그대로, 2 = 두 배, -1 = 뒤집기</text>
    <text x="1115" y="360">X 만큼 오른쪽, Y 만큼 아래로</text>
    <text x="1115" y="386">원래 자리(점선)는 그대로</text>
  </g>
  <line x1="40" y1="420" x2="1240" y2="420" stroke="var(--line)" stroke-width="2"/>
  <text x="640" y="462" text-anchor="middle" style="font-size:21px;fill:var(--fg)">RenderTransform 은 <tspan font-weight="700">그릴 때만</tspan> 바꾼다 — Canvas.Left · Width 같은 속성 값과 자리는 그대로</text>
  <text x="640" y="500" text-anchor="middle" style="font-size:20px;fill:var(--muted)">여러 개를 함께: &lt;TransformGroup&gt; 안에 ScaleTransform · RotateTransform · TranslateTransform</text>
  <text x="640" y="536" text-anchor="middle" style="font-size:19px;fill:var(--muted)">각도 단위는 도(°) — 양수이면 시계 방향으로 돈다</text>
</svg>`;

  /* ---------- 그림 3. DispatcherTimer 의 동작 ---------- */
  const SVG_TIMER = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="DispatcherTimer 는 Start 후 Interval 마다 Tick 이벤트를 발생시키고 Stop 하면 멈춘다">
  <defs><marker id="ah22c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto-start-reverse" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <text x="40" y="50" style="font-size:25px;font-weight:700;fill:var(--accent)">DispatcherTimer — Interval 마다 Tick 이벤트가 온다</text>
  <line x1="80" y1="200" x2="1000" y2="200" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1000" y1="200" x2="1210" y2="200" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 8" marker-end="url(#ah22c)"/>
  <text x="1210" y="236" text-anchor="end" style="font-size:19px;fill:var(--muted)">시간 →</text>
  <rect x="60" y="100" width="130" height="46" rx="10" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="125" y="130" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">Start()</text>
  <line x1="125" y1="148" x2="125" y2="190" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah22c)"/>
  <rect x="935" y="100" width="130" height="46" rx="10" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="1000" y="130" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">Stop()</text>
  <line x1="1000" y1="148" x2="1000" y2="190" stroke="var(--muted)" stroke-width="3" marker-end="url(#ah22c)"/>
  <text x="1105" y="182" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Tick 없음</text>
  <g stroke="var(--accent)" stroke-width="5">
    <line x1="305" y1="182" x2="305" y2="218"/>
    <line x1="485" y1="182" x2="485" y2="218"/>
    <line x1="665" y1="182" x2="665" y2="218"/>
    <line x1="845" y1="182" x2="845" y2="218"/>
  </g>
  <g style="font-size:20px;font-weight:700;fill:var(--accent)" text-anchor="middle">
    <text x="305" y="172">Tick</text><text x="485" y="172">Tick</text><text x="665" y="172">Tick</text><text x="845" y="172">Tick</text>
  </g>
  <g fill="var(--card)" stroke="var(--accent)" stroke-width="2">
    <rect x="235" y="240" width="140" height="62" rx="8"/><rect x="415" y="240" width="140" height="62" rx="8"/>
    <rect x="595" y="240" width="140" height="62" rx="8"/><rect x="775" y="240" width="140" height="62" rx="8"/>
  </g>
  <g style="${MONO};font-size:16px;fill:var(--fg)" text-anchor="middle">
    <text x="305" y="266">Timer_Tick()</text><text x="485" y="266">Timer_Tick()</text><text x="665" y="266">Timer_Tick()</text><text x="845" y="266">Timer_Tick()</text>
  </g>
  <g style="font-size:16px;fill:var(--muted)" text-anchor="middle">
    <text x="305" y="290">화면 갱신</text><text x="485" y="290">화면 갱신</text><text x="665" y="290">화면 갱신</text><text x="845" y="290">화면 갱신</text>
  </g>
  <line x1="129" y1="338" x2="301" y2="338" stroke="var(--muted)" stroke-width="2" marker-start="url(#ah22c)" marker-end="url(#ah22c)"/>
  <line x1="309" y1="338" x2="481" y2="338" stroke="var(--muted)" stroke-width="2" marker-start="url(#ah22c)" marker-end="url(#ah22c)"/>
  <text x="215" y="366" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">Interval</text>
  <text x="395" y="366" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">Interval</text>
  <text x="560" y="366" style="font-size:18px;fill:var(--muted)">예: TimeSpan.FromSeconds(1) → 1초마다</text>
  <g style="font-size:20px">
    <text x="60" y="428" style="fill:var(--ok)">✓ Tick 처리기는 UI 스레드에서 실행된다 → 컨트롤(TextBlock · 도형)을 바로 바꿔도 된다</text>
    <text x="60" y="466" style="fill:var(--ok)">✓ 처리기는 짧게 — 오래 걸리면 그동안 클릭 · 키 입력 · 화면 그리기가 모두 멈춘다</text>
    <text x="60" y="504" style="fill:var(--danger)">✗ while (true) { …; Thread.Sleep(1000); } — UI 스레드를 붙잡아 창이 “응답 없음” 이 된다</text>
    <text x="60" y="542" style="fill:var(--muted)">창을 닫을 때는 timer.Stop() — Closed 이벤트에서 멈춰 두는 습관</text>
  </g>
</svg>`;

  /* ---------- 그림 4. 게임 루프와 튕기기 ---------- */
  const SVG_LOOP = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="입력, 갱신, 그리기를 Tick 마다 반복하는 게임 루프와 벽에서 속도의 부호를 바꾸는 튕기기">
  <defs><marker id="ah22d" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="60" width="290" height="92" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="185" y="96" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">① 입력</text>
  <text x="185" y="130" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">Keyboard.IsKeyDown(…)</text>
  <rect x="340" y="200" width="290" height="92" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="485" y="236" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">② 갱신</text>
  <text x="485" y="270" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">x += vx; 벽 · 충돌 검사</text>
  <rect x="40" y="340" width="290" height="92" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="185" y="376" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--warn)">③ 그리기</text>
  <text x="185" y="410" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">Canvas.SetLeft(ball, x);</text>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <path d="M 332,110 Q 450,120 480,194" marker-end="url(#ah22d)"/>
    <path d="M 480,296 Q 450,370 336,384" marker-end="url(#ah22d)"/>
    <path d="M 110,336 L 110,158" marker-end="url(#ah22d)"/>
  </g>
  <text x="235" y="240" text-anchor="middle" style="font-size:19px;font-weight:700;fill:var(--fg)">Tick 마다</text>
  <text x="235" y="266" text-anchor="middle" style="font-size:18px;fill:var(--muted)">(20 ms ≈ 1초에 50번)</text>
  <rect x="700" y="70" width="520" height="330" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <polyline points="760,330 900,72 1060,398 1218,140" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="9 7"/>
  <circle cx="760" cy="330" r="17" fill="var(--danger)"/>
  <line x1="772" y1="308" x2="820" y2="220" stroke="var(--accent2)" stroke-width="4" marker-end="url(#ah22d)"/>
  <text x="832" y="236" style="${MONO};font-size:18px;fill:var(--fg)">속도 (vx, vy)</text>
  <g fill="var(--warn)"><circle cx="900" cy="72" r="7"/><circle cx="1060" cy="398" r="7"/><circle cx="1218" cy="140" r="7"/></g>
  <text x="920" y="108" style="${MONO};font-size:18px;fill:var(--fg)">위 벽 → vy = -vy</text>
  <text x="1080" y="380" style="${MONO};font-size:18px;fill:var(--fg)">아래 벽 → vy = -vy</text>
  <text x="1205" y="180" text-anchor="end" style="${MONO};font-size:18px;fill:var(--fg)">오른쪽 벽 → vx = -vx</text>
  <text x="640" y="470" text-anchor="middle" style="font-size:21px;fill:var(--fg)">위치 = 위치 + 속도 — Tick 마다 조금씩 옮기면 눈에는 부드럽게 움직이는 것처럼 보인다</text>
  <text x="640" y="510" text-anchor="middle" style="font-size:20px;fill:var(--muted)">벽에 닿으면 그 방향 속도의 <tspan font-weight="700">부호만</tspan> 바꾼다 = 튕기기</text>
</svg>`;

  /* ======================= 22-1 예제 코드 ======================= */
  const EX_SHAPES = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Shapes.MainWindow"
        ${NS}
        Title="Canvas 좌표와 기본 도형" Width="500" Height="390">
    <!-- Canvas: 자식을 좌표(Canvas.Left · Canvas.Top)로 놓는 판. 왼쪽 위가 (0, 0) -->
    <Canvas Background="White">
        <TextBlock Canvas.Left="4" Canvas.Top="2" Text="(0, 0)" Foreground="Gray"/>

        <!-- ① 사각형: 왼쪽 위 모서리 (30, 30), 크기 140 × 90 -->
        <Rectangle Canvas.Left="30" Canvas.Top="30" Width="140" Height="90"
                   Fill="SkyBlue" Stroke="SteelBlue" StrokeThickness="3"/>
        <TextBlock Canvas.Left="30" Canvas.Top="126" Text="Rectangle (30, 30) 140×90"/>

        <!-- ② 둥근 사각형: RadiusX · RadiusY 로 모서리를 둥글게 -->
        <Rectangle Canvas.Left="200" Canvas.Top="30" Width="120" Height="90"
                   RadiusX="20" RadiusY="20" Fill="Khaki" Stroke="DarkGoldenrod" StrokeThickness="2"/>
        <TextBlock Canvas.Left="200" Canvas.Top="126" Text="RadiusX = RadiusY = 20"/>

        <!-- ③ 원: Width 와 Height 가 같은 Ellipse -->
        <Ellipse Canvas.Left="350" Canvas.Top="30" Width="90" Height="90" Fill="Tomato"/>
        <TextBlock Canvas.Left="350" Canvas.Top="126" Text="Ellipse 90×90 (원)"/>

        <!-- ④ 타원: 상자(Width × Height) 안에 꽉 차게 그려진다 -->
        <Ellipse Canvas.Left="30" Canvas.Top="170" Width="160" Height="90"
                 Fill="LightGreen" Stroke="SeaGreen" StrokeThickness="4"/>
        <TextBlock Canvas.Left="30" Canvas.Top="266" Text="Ellipse 160×90 (타원)"/>

        <!-- ⑤ 선: 시작점 (X1, Y1) → 끝점 (X2, Y2). 선은 Stroke 로만 보인다 -->
        <Line X1="220" Y1="170" X2="440" Y2="260" Stroke="Purple" StrokeThickness="4"/>
        <Line X1="220" Y1="260" X2="440" Y2="170" Stroke="DarkOrange" StrokeThickness="3"
              StrokeDashArray="3 2"/>
        <TextBlock Canvas.Left="220" Canvas.Top="266" Text="Line (220,170) → (440,260) · 점선"/>

        <TextBlock Canvas.Left="30" Canvas.Top="300" Foreground="Gray"
                   Text="나중에 적은 도형일수록 위에 그려집니다 (겹치면 뒤의 것이 가린다)"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch22Shapes
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const EX_POLY = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22PolyPath.MainWindow"
        ${NS}
        Title="Polyline · Polygon · Path" Width="500" Height="390">
    <Canvas Background="White">
        <!-- ① Polyline: 점들을 차례로 잇는 "열린" 선 -->
        <Polyline Points="20,70 60,20 100,70 140,20 180,70" Stroke="RoyalBlue" StrokeThickness="4"/>
        <TextBlock Canvas.Left="20" Canvas.Top="80" Text="Polyline (지그재그)"/>

        <!-- ② Polygon: 마지막 점이 첫 점과 이어지는 "닫힌" 도형 → 안을 채울 수 있다 -->
        <Polygon Points="290,10 302,44 338,44 309,65 320,99 290,78 260,99 271,65 242,44 278,44"
                 Fill="Gold" Stroke="DarkOrange" StrokeThickness="2"/>
        <TextBlock Canvas.Left="245" Canvas.Top="104" Text="Polygon (별, 점 10개)"/>

        <!-- ③ Path: 그리기 명령 문자열 — M 옮기기, C 곡선, Z 닫기 -->
        <Path Canvas.Left="370" Canvas.Top="10" Fill="Crimson"
              Data="M 50,90 C 10,60 0,25 25,15 C 38,10 48,20 50,32 C 52,20 62,10 75,15 C 100,25 90,60 50,90 Z"/>
        <TextBlock Canvas.Left="390" Canvas.Top="104" Text="Path (하트)"/>

        <!-- ④ Path: A 원호(arc) — 반지름 70 인 반원 -->
        <Path Data="M 20,220 A 70,70 0 0 1 160,220 Z"
              Fill="LightSkyBlue" Stroke="SteelBlue" StrokeThickness="2"/>
        <TextBlock Canvas.Left="45" Canvas.Top="226" Text="Path (A: 반원)"/>

        <!-- ⑤ Path: Q · T 2차 곡선 — 물결 -->
        <Path Data="M 200,200 Q 250,130 300,200 T 400,200 T 480,200"
              Stroke="SeaGreen" StrokeThickness="4"/>
        <TextBlock Canvas.Left="200" Canvas.Top="250" Text="Path (Q · T: 물결)"/>

        <!-- ⑥ 점은 코드에서 계산해 넣는다 (사인 곡선) -->
        <Polyline x:Name="wave" Stroke="MediumVioletRed" StrokeThickness="2"/>
        <TextBlock Canvas.Left="20" Canvas.Top="318" Foreground="Gray"
                   Text="⑥ 코드로 점을 계산한 Polyline — y = sin(x)"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Media;   // PointCollection

namespace Ch22PolyPath
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DrawWave();
        }

        // x 를 5 씩 늘리며 점을 계산해 PointCollection 에 모은 뒤, 한 번에 Points 에 넣는다
        private void DrawWave()
        {
            PointCollection points = new PointCollection();
            for (double x = 0; x <= 460; x += 5)
            {
                double y = 285 - 25 * Math.Sin(x / 30);   // 화면의 y 는 아래로 커지므로 빼 준다
                points.Add(new Point(20 + x, y));
            }
            wave.Points = points;
        }
    }
}`;

  const EX_BRUSH = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Brushes.MainWindow"
        ${NS}
        Title="브러시 — 무엇으로 칠할까" Width="500" Height="400">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="10,0,10,8" Foreground="Gray"
                   Text="⑥ 을 클릭하면 코드로 만든 무작위 색 브러시로 바뀝니다."/>
        <UniformGrid Rows="2" Columns="3" Margin="6">
            <!-- ① 색 이름 (Colors 에 정의된 140여 가지) -->
            <StackPanel Margin="6">
                <Rectangle Height="90" Fill="Tomato"/>
                <TextBlock Text="① 색 이름 Tomato" Margin="0,4,0,0"/>
            </StackPanel>

            <!-- ② #RRGGBB: 빨강 · 초록 · 파랑을 16진수 두 자리씩 -->
            <StackPanel Margin="6">
                <Rectangle Height="90" Fill="#3CB371" RadiusX="10" RadiusY="10"/>
                <TextBlock Text="② #3CB371 (16진수)" Margin="0,4,0,0"/>
            </StackPanel>

            <!-- ③ Opacity: 0(투명) ~ 1(불투명). 겹치면 섞여 보인다 -->
            <StackPanel Margin="6">
                <Canvas Height="90">
                    <Ellipse Canvas.Left="10" Canvas.Top="0" Width="60" Height="60" Fill="Red" Opacity="0.6"/>
                    <Ellipse Canvas.Left="50" Canvas.Top="0" Width="60" Height="60" Fill="Lime" Opacity="0.6"/>
                    <Ellipse Canvas.Left="30" Canvas.Top="30" Width="60" Height="60" Fill="Blue" Opacity="0.6"/>
                </Canvas>
                <TextBlock Text="③ Opacity 0.6 (반투명)" Margin="0,4,0,0"/>
            </StackPanel>

            <!-- ④ LinearGradientBrush: StartPoint → EndPoint 방향으로 색이 바뀐다 -->
            <StackPanel Margin="6">
                <Rectangle Height="90">
                    <Rectangle.Fill>
                        <!-- (0,0.5) → (1,0.5) = 왼쪽 가운데에서 오른쪽 가운데로 -->
                        <LinearGradientBrush StartPoint="0,0.5" EndPoint="1,0.5">
                            <GradientStop Color="Red" Offset="0"/>
                            <GradientStop Color="Orange" Offset="0.2"/>
                            <GradientStop Color="Yellow" Offset="0.4"/>
                            <GradientStop Color="Green" Offset="0.6"/>
                            <GradientStop Color="Blue" Offset="0.8"/>
                            <GradientStop Color="Purple" Offset="1"/>
                        </LinearGradientBrush>
                    </Rectangle.Fill>
                </Rectangle>
                <TextBlock Text="④ LinearGradientBrush" Margin="0,4,0,0"/>
            </StackPanel>

            <!-- ⑤ RadialGradientBrush: 가운데에서 바깥으로 퍼지는 그라데이션 -->
            <StackPanel Margin="6">
                <Ellipse Width="90" Height="90">
                    <Ellipse.Fill>
                        <RadialGradientBrush GradientOrigin="0.35,0.3" Center="0.35,0.3" RadiusX="0.7" RadiusY="0.7">
                            <GradientStop Color="White" Offset="0"/>
                            <GradientStop Color="DodgerBlue" Offset="0.5"/>
                            <GradientStop Color="Navy" Offset="1"/>
                        </RadialGradientBrush>
                    </Ellipse.Fill>
                </Ellipse>
                <TextBlock Text="⑤ RadialGradientBrush" Margin="0,4,0,0"/>
            </StackPanel>

            <!-- ⑥ 코드로 만드는 브러시 (클릭하면 바뀜) -->
            <StackPanel Margin="6">
                <Rectangle x:Name="rectCode" Height="90" Stroke="Gray" Cursor="Hand"
                           MouseLeftButtonDown="RectCode_MouseLeftButtonDown"/>
                <TextBlock Text="⑥ 코드로 만든 브러시" Margin="0,4,0,0"/>
            </StackPanel>
        </UniformGrid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;   // Color, Colors, SolidColorBrush, LinearGradientBrush

namespace Ch22Brushes
{
    public partial class MainWindow : Window
    {
        private readonly Random rand = new Random();

        public MainWindow()
        {
            InitializeComponent();
            // 코드로 만든 그라데이션: 노랑 → 빨강, 각도 90도 = 위에서 아래로
            rectCode.Fill = new LinearGradientBrush(Colors.Yellow, Colors.Red, 90);
        }

        private void RectCode_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            // Color.FromRgb(빨강, 초록, 파랑) — 각각 0 ~ 255
            Color c = Color.FromRgb((byte)rand.Next(256), (byte)rand.Next(256), (byte)rand.Next(256));
            rectCode.Fill = new SolidColorBrush(c);
            lblInfo.Text = $"새 색: #{c.R:X2}{c.G:X2}{c.B:X2}  (R={c.R}, G={c.G}, B={c.B})";
        }
    }
}`;

  const EX_CHART = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22BarChart.MainWindow"
        ${NS}
        Title="코드로 그린 막대그래프" Width="500" Height="390">
    <DockPanel>
        <TextBlock DockPanel.Dock="Top" Margin="12,8,12,0" FontSize="16" FontWeight="Bold"
                   Text="과목별 점수 — 도형을 코드로 만들어 Canvas 에 추가"/>
        <!-- 크기를 정해 둔 빈 Canvas: 막대는 모두 코드에서 만든다 -->
        <Canvas x:Name="chart" Width="460" Height="280" Background="WhiteSmoke" Margin="10"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Linq;               // Average()
using System.Windows;
using System.Windows.Controls;   // Canvas, TextBlock
using System.Windows.Media;      // Brush, Brushes, DoubleCollection
using System.Windows.Shapes;     // Rectangle, Line

namespace Ch22BarChart
{
    public partial class MainWindow : Window
    {
        private readonly string[] names = { "국어", "영어", "수학", "과학", "사회" };
        private readonly int[] scores = { 72, 85, 64, 93, 78 };
        private readonly Brush[] colors = { Brushes.Tomato, Brushes.Orange, Brushes.Gold, Brushes.MediumSeaGreen, Brushes.CornflowerBlue };

        private const double BaseY = 240;   // 막대의 바닥선 y 좌표
        private const double BarWidth = 50;
        private const double Gap = 30;
        private const double Scale = 2.0;   // 1점 = 2픽셀

        public MainWindow()
        {
            InitializeComponent();
            DrawChart();
        }

        private void DrawChart()
        {
            // 바닥선
            chart.Children.Add(new Line { X1 = 20, Y1 = BaseY, X2 = 440, Y2 = BaseY, Stroke = Brushes.Gray, StrokeThickness = 2 });

            for (int i = 0; i < scores.Length; i++)
            {
                double h = scores[i] * Scale;          // 막대 높이
                double x = 40 + i * (BarWidth + Gap);  // 막대 왼쪽 x

                // ① 도형 만들기 → ② 위치 정하기 → ③ Children 에 추가
                Rectangle bar = new Rectangle { Width = BarWidth, Height = h, Fill = colors[i] };
                Canvas.SetLeft(bar, x);
                Canvas.SetTop(bar, BaseY - h);         // 위쪽 모서리 = 바닥 - 높이
                chart.Children.Add(bar);

                AddLabel(scores[i].ToString(), x + 15, BaseY - h - 18, true);   // 막대 위 점수
                AddLabel(names[i], x + 12, BaseY + 6, false);                   // 바닥 아래 과목
            }

            // 평균선: 점선(StrokeDashArray)
            double avg = scores.Average();
            double avgY = BaseY - avg * Scale;
            chart.Children.Add(new Line
            {
                X1 = 20, Y1 = avgY, X2 = 440, Y2 = avgY,
                Stroke = Brushes.DimGray, StrokeThickness = 1.5,
                StrokeDashArray = new DoubleCollection { 4, 3 }
            });
            AddLabel($"평균 {avg:F1}", 380, avgY - 18, false);
        }

        // 글자도 요소이므로 똑같이 만들어서 위치를 정하고 추가한다
        private void AddLabel(string text, double x, double y, bool bold)
        {
            TextBlock t = new TextBlock { Text = text, FontWeight = bold ? FontWeights.Bold : FontWeights.Normal };
            Canvas.SetLeft(t, x);
            Canvas.SetTop(t, y);
            chart.Children.Add(t);
        }
    }
}`;

  const EX_STAMP = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Stamp.MainWindow"
        ${NS}
        Title="클릭해서 도형 찍기" Width="500" Height="390">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="10,8">
            <TextBlock Text="모양:" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <RadioButton x:Name="rdoCircle" Content="원" IsChecked="True" VerticalAlignment="Center" Margin="0,0,10,0"/>
            <RadioButton x:Name="rdoSquare" Content="사각형" VerticalAlignment="Center" Margin="0,0,10,0"/>
            <RadioButton x:Name="rdoTriangle" Content="삼각형" VerticalAlignment="Center" Margin="0,0,16,0"/>
            <Button Content="모두 지우기" Padding="10,2" Click="BtnClear_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="10,4,10,8" Foreground="Gray"
                   Text="판을 클릭하면 고른 모양이 무작위 색으로 찍힙니다."/>
        <!-- Background 가 있어야 빈 곳을 클릭해도 이벤트가 온다 -->
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;   // Shape, Ellipse, Rectangle, Polygon

namespace Ch22Stamp
{
    public partial class MainWindow : Window
    {
        private const double ShapeSize = 40;
        private readonly Random rand = new Random();

        public MainWindow()
        {
            InitializeComponent();
            // 처음 화면이 비어 있지 않게 몇 개를 미리 찍어 둔다
            AddShape(new Point(80, 70), "원");
            AddShape(new Point(200, 150), "사각형");
            AddShape(new Point(330, 90), "삼각형");
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);   // board 의 왼쪽 위 기준 좌표
            string kind = rdoSquare.IsChecked == true ? "사각형"
                        : rdoTriangle.IsChecked == true ? "삼각형" : "원";
            AddShape(p, kind);
        }

        private void AddShape(Point center, string kind)
        {
            // Shape = Ellipse · Rectangle · Polygon 의 공통 부모 → Fill · Stroke 를 한 번에 설정
            Shape shape;
            if (kind == "원")
                shape = new Ellipse { Width = ShapeSize, Height = ShapeSize };
            else if (kind == "사각형")
                shape = new Rectangle { Width = ShapeSize, Height = ShapeSize };
            else
                shape = new Polygon
                {
                    // 꼭짓점 좌표는 도형 자신의 왼쪽 위 기준
                    Points = new PointCollection { new Point(ShapeSize / 2, 0), new Point(ShapeSize, ShapeSize), new Point(0, ShapeSize) }
                };

            Color c = Color.FromRgb((byte)rand.Next(256), (byte)rand.Next(256), (byte)rand.Next(256));
            shape.Fill = new SolidColorBrush(c);
            shape.Stroke = Brushes.Black;
            shape.StrokeThickness = 1;
            shape.Opacity = 0.85;

            // 클릭한 곳이 도형의 가운데가 되도록 반만큼 뺀다 (17장)
            Canvas.SetLeft(shape, center.X - ShapeSize / 2);
            Canvas.SetTop(shape, center.Y - ShapeSize / 2);
            board.Children.Add(shape);

            lblInfo.Text = $"{kind} 추가 — ({center.X:F0}, {center.Y:F0}) · 모두 {board.Children.Count}개";
        }

        private void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            board.Children.Clear();
            lblInfo.Text = "모두 지웠습니다. 다시 클릭해 보세요.";
        }
    }
}`;

  const EX_TRANSFORM = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Transforms.MainWindow"
        ${NS}
        Title="RenderTransform — 회전 · 크기 · 이동" Width="510" Height="400">
    <!-- 회색 점선 = 변환하기 전의 원래 자리 -->
    <Canvas Background="White">
        <!-- ① 원본 -->
        <Rectangle Canvas.Left="20" Canvas.Top="40" Width="70" Height="44" Fill="SteelBlue"/>
        <TextBlock Canvas.Left="20" Canvas.Top="125" Width="110" TextWrapping="Wrap" Text="① 원본 70×44"/>

        <!-- ② 회전 30도 — 기준점 기본값 (0,0) = 왼쪽 위 모서리 -->
        <Rectangle Canvas.Left="150" Canvas.Top="40" Width="70" Height="44" Stroke="Gray" StrokeDashArray="3 2"/>
        <Rectangle Canvas.Left="150" Canvas.Top="40" Width="70" Height="44" Fill="Tomato" Opacity="0.85">
            <Rectangle.RenderTransform>
                <RotateTransform Angle="30"/>
            </Rectangle.RenderTransform>
        </Rectangle>
        <TextBlock Canvas.Left="135" Canvas.Top="125" Width="115" TextWrapping="Wrap" Text="② 회전 30° (왼쪽 위 기준)"/>

        <!-- ③ 회전 30도 — RenderTransformOrigin="0.5,0.5" = 가운데 기준 -->
        <Rectangle Canvas.Left="270" Canvas.Top="40" Width="70" Height="44" Stroke="Gray" StrokeDashArray="3 2"/>
        <Rectangle Canvas.Left="270" Canvas.Top="40" Width="70" Height="44" Fill="Tomato" Opacity="0.85"
                   RenderTransformOrigin="0.5,0.5">
            <Rectangle.RenderTransform>
                <RotateTransform Angle="30"/>
            </Rectangle.RenderTransform>
        </Rectangle>
        <TextBlock Canvas.Left="260" Canvas.Top="125" Width="115" TextWrapping="Wrap" Text="③ 회전 30° (가운데 기준)"/>

        <!-- ④ 크기 1.5배 (가운데 기준) -->
        <Rectangle Canvas.Left="400" Canvas.Top="40" Width="70" Height="44" Fill="MediumSeaGreen" Opacity="0.85"
                   RenderTransformOrigin="0.5,0.5">
            <Rectangle.RenderTransform>
                <ScaleTransform ScaleX="1.5" ScaleY="1.5"/>
            </Rectangle.RenderTransform>
        </Rectangle>
        <Rectangle Canvas.Left="400" Canvas.Top="40" Width="70" Height="44" Stroke="Gray" StrokeDashArray="3 2"/>
        <TextBlock Canvas.Left="385" Canvas.Top="125" Width="110" TextWrapping="Wrap" Text="④ 크기 1.5배"/>

        <!-- ⑤ 이동: 오른쪽 40, 아래 25 -->
        <Rectangle Canvas.Left="20" Canvas.Top="185" Width="70" Height="44" Stroke="Gray" StrokeDashArray="3 2"/>
        <Rectangle Canvas.Left="20" Canvas.Top="185" Width="70" Height="44" Fill="Orange" Opacity="0.85">
            <Rectangle.RenderTransform>
                <TranslateTransform X="40" Y="25"/>
            </Rectangle.RenderTransform>
        </Rectangle>
        <TextBlock Canvas.Left="20" Canvas.Top="275" Width="115" TextWrapping="Wrap" Text="⑤ 이동 X=40, Y=25"/>

        <!-- ⑥ ScaleX = -1 → 좌우 뒤집기 -->
        <Polygon Canvas.Left="160" Canvas.Top="185" Points="0,12 44,12 44,0 70,22 44,44 44,32 0,32"
                 Stroke="Gray" StrokeDashArray="3 2"/>
        <Polygon Canvas.Left="160" Canvas.Top="185" Points="0,12 44,12 44,0 70,22 44,44 44,32 0,32"
                 Fill="MediumPurple" Opacity="0.85" RenderTransformOrigin="0.5,0.5">
            <Polygon.RenderTransform>
                <ScaleTransform ScaleX="-1" ScaleY="1"/>
            </Polygon.RenderTransform>
        </Polygon>
        <TextBlock Canvas.Left="145" Canvas.Top="275" Width="115" TextWrapping="Wrap" Text="⑥ ScaleX=-1 좌우 뒤집기"/>

        <!-- ⑦ TransformGroup: 크기 1.2배 + 회전 45도 → 마름모 -->
        <Rectangle Canvas.Left="295" Canvas.Top="185" Width="50" Height="50" Fill="DeepSkyBlue" Opacity="0.85"
                   RenderTransformOrigin="0.5,0.5">
            <Rectangle.RenderTransform>
                <TransformGroup>
                    <ScaleTransform ScaleX="1.2" ScaleY="1.2"/>
                    <RotateTransform Angle="45"/>
                </TransformGroup>
            </Rectangle.RenderTransform>
        </Rectangle>
        <TextBlock Canvas.Left="270" Canvas.Top="275" Width="115" TextWrapping="Wrap" Text="⑦ TransformGroup 크기 + 회전"/>

        <!-- ⑧ 도형뿐 아니라 모든 요소(글자 · 버튼)에 쓸 수 있다 -->
        <TextBlock Canvas.Left="400" Canvas.Top="205" Text="글자도 회전!" FontSize="18" FontWeight="Bold"
                   Foreground="Crimson" RenderTransformOrigin="0.5,0.5">
            <TextBlock.RenderTransform>
                <RotateTransform Angle="-20"/>
            </TextBlock.RenderTransform>
        </TextBlock>
        <TextBlock Canvas.Left="395" Canvas.Top="275" Width="100" TextWrapping="Wrap" Text="⑧ TextBlock 회전 -20°"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace Ch22Transforms
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }
}`;

  const EX_TLAB = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22TransformLab.MainWindow"
        ${NS}
        Title="변환 실험실 — 슬라이더로 회전 · 크기 · 투명도" Width="500" Height="400">
    <DockPanel>
        <StackPanel DockPanel.Dock="Bottom" Margin="12,6,12,10">
            <DockPanel Margin="0,2">
                <TextBlock Text="회전" Width="50" VerticalAlignment="Center"/>
                <TextBlock x:Name="lblAngle" DockPanel.Dock="Right" Width="50" TextAlignment="Right" VerticalAlignment="Center"/>
                <Slider x:Name="sldAngle" Minimum="0" Maximum="360" Value="30"/>
            </DockPanel>
            <DockPanel Margin="0,2">
                <TextBlock Text="크기" Width="50" VerticalAlignment="Center"/>
                <TextBlock x:Name="lblScale" DockPanel.Dock="Right" Width="50" TextAlignment="Right" VerticalAlignment="Center"/>
                <Slider x:Name="sldScale" Minimum="0.5" Maximum="2" Value="1"/>
            </DockPanel>
            <DockPanel Margin="0,2">
                <TextBlock Text="투명도" Width="50" VerticalAlignment="Center"/>
                <TextBlock x:Name="lblOpacity" DockPanel.Dock="Right" Width="50" TextAlignment="Right" VerticalAlignment="Center"/>
                <Slider x:Name="sldOpacity" Minimum="0.1" Maximum="1" Value="1"/>
            </DockPanel>
        </StackPanel>
        <Canvas Background="AliceBlue" ClipToBounds="True">
            <!-- 카드 = 사각형 + 글자. Grid 째로 변환하면 안의 요소가 함께 돈다 -->
            <Grid x:Name="card" Canvas.Left="170" Canvas.Top="60" Width="140" Height="90"
                  RenderTransformOrigin="0.5,0.5">
                <Rectangle Fill="MediumPurple" RadiusX="12" RadiusY="12"/>
                <TextBlock Text="WPF 22" FontSize="26" FontWeight="Bold" Foreground="White"
                           HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Grid>
            <!-- 회전 · 크기의 기준점(카드의 가운데) 표시 -->
            <Ellipse Canvas.Left="236" Canvas.Top="101" Width="8" Height="8" Fill="Red"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;   // TransformGroup, ScaleTransform, RotateTransform

namespace Ch22TransformLab
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // 처리기는 InitializeComponent() 뒤에 연결 → XAML 을 읽는 도중(Value="30")에는 불리지 않는다
            sldAngle.ValueChanged += Slider_ValueChanged;
            sldScale.ValueChanged += Slider_ValueChanged;
            sldOpacity.ValueChanged += Slider_ValueChanged;
            ApplyTransform();
        }

        private void Slider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            ApplyTransform();
        }

        private void ApplyTransform()
        {
            double angle = sldAngle.Value;
            double scale = sldScale.Value;

            // 크기와 회전을 함께 → TransformGroup 에 차례로 넣는다
            TransformGroup group = new TransformGroup();
            group.Children.Add(new ScaleTransform(scale, scale));
            group.Children.Add(new RotateTransform(angle));
            card.RenderTransform = group;          // 새 변환을 통째로 대입

            card.Opacity = sldOpacity.Value;       // 투명도는 변환이 아니라 요소의 속성

            lblAngle.Text = $"{angle:F0}°";
            lblScale.Text = $"{scale:F2}배";
            lblOpacity.Text = $"{sldOpacity.Value:F2}";
        }
    }
}`;

  /* ======================= 22-1 실습 ======================= */
  const SIGNAL_XAML_HEAD = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22PracticeSignal.MainWindow"
        ${NS}
        Title="신호등" Width="360" Height="380">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Right" Width="110" Margin="10,20,0,0">
            <Button Content="빨강" Height="32" Click="BtnRed_Click"/>
            <Button Content="노랑" Height="32" Margin="0,8,0,0" Click="BtnYellow_Click"/>
            <Button Content="초록" Height="32" Margin="0,8,0,0" Click="BtnGreen_Click"/>
            <TextBlock x:Name="lblState" Margin="0,16,0,0" FontSize="15" TextWrapping="Wrap" Text="지금: -"/>
        </StackPanel>
        <Canvas Width="140" Height="300">
            <!-- 신호등 몸체 -->
            <Rectangle Canvas.Left="20" Canvas.Top="10" Width="100" Height="280"
                       RadiusX="20" RadiusY="20" Fill="#333333"/>
            <!-- 빨간 불 (꺼져 있을 때는 #555555) -->
            <Ellipse x:Name="redLight" Canvas.Left="35" Canvas.Top="25" Width="70" Height="70" Fill="#555555"/>`;

  const P1_STARTER = `${SIGNAL_XAML_HEAD}
            <!-- TODO 1: 노란 불 yellowLight (Top 115), 초록 불 greenLight (Top 205) 를
                         빨간 불과 같은 크기 · 같은 Left 로 추가하세요 -->
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Ch22PracticeSignal
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // TODO 4: 처음에는 빨간 불을 켠다
        }

        // TODO 2: TurnOn(Ellipse light, Brush color, string name) 메서드
        //   ① 세 불을 모두 꺼진 색(#555555)으로
        //   ② light 만 color 로 칠하기
        //   ③ lblState 에 "지금: 빨강" 처럼 표시

        // TODO 3: 버튼마다 TurnOn(redLight, Brushes.Red, "빨강") 처럼 부르기
        private void BtnRed_Click(object sender, RoutedEventArgs e)
        {
        }

        private void BtnYellow_Click(object sender, RoutedEventArgs e)
        {
        }

        private void BtnGreen_Click(object sender, RoutedEventArgs e)
        {
        }
    }
}`;

  const P1_SOLUTION = `${SIGNAL_XAML_HEAD}
            <Ellipse x:Name="yellowLight" Canvas.Left="35" Canvas.Top="115" Width="70" Height="70" Fill="#555555"/>
            <Ellipse x:Name="greenLight" Canvas.Left="35" Canvas.Top="205" Width="70" Height="70" Fill="#555555"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Ch22PracticeSignal
{
    public partial class MainWindow : Window
    {
        // 꺼진 불의 색: #555555
        private readonly Brush offBrush = new SolidColorBrush(Color.FromRgb(0x55, 0x55, 0x55));

        public MainWindow()
        {
            InitializeComponent();
            TurnOn(redLight, Brushes.Red, "빨강");
        }

        private void TurnOn(Ellipse light, Brush color, string name)
        {
            redLight.Fill = offBrush;     // ① 모두 끄고
            yellowLight.Fill = offBrush;
            greenLight.Fill = offBrush;
            light.Fill = color;           // ② 하나만 켠다
            lblState.Text = $"지금: {name}";
        }

        private void BtnRed_Click(object sender, RoutedEventArgs e) { TurnOn(redLight, Brushes.Red, "빨강"); }
        private void BtnYellow_Click(object sender, RoutedEventArgs e) { TurnOn(yellowLight, Brushes.Gold, "노랑"); }
        private void BtnGreen_Click(object sender, RoutedEventArgs e) { TurnOn(greenLight, Brushes.LimeGreen, "초록"); }
    }
}`;

  const TARGET_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22PracticeTarget.MainWindow"
        ${NS}
        Title="과녁 맞히기" Width="510" Height="390">
    <DockPanel Margin="10">
        <StackPanel DockPanel.Dock="Right" Width="150" Margin="10,0,0,0">
            <TextBlock Text="총점" FontSize="14"/>
            <TextBlock x:Name="lblTotal" Text="0" FontSize="36" FontWeight="Bold" Foreground="Crimson"/>
            <TextBlock x:Name="lblLast" Margin="0,8,0,0" TextWrapping="Wrap" Text="과녁을 클릭하세요."/>
            <Button Content="다시 하기" Height="30" Margin="0,16,0,0" Click="BtnReset_Click"/>
        </StackPanel>
        <Canvas x:Name="board" Width="300" Height="300" Background="White"
                MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
    </DockPanel>
</Window>`;

  const P2_STARTER = `${TARGET_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Ch22PracticeTarget
{
    public partial class MainWindow : Window
    {
        private const double CenterX = 150, CenterY = 150;   // 과녁의 가운데
        private const double RingWidth = 30;                  // 고리 하나의 두께

        // TODO 0: 총점을 기억할 필드 total (처음 0)

        public MainWindow()
        {
            InitializeComponent();
            DrawTarget();
        }

        private void DrawTarget()
        {
            board.Children.Clear();
            // TODO 1: for 문으로 원 5개를 "큰 것부터" 만들어 추가
            //   반지름 r = 150, 120, 90, 60, 30  (150 - i * RingWidth)
            //   Width = Height = r * 2, 색은 번갈아 Crimson / White, 테두리 Black
            //   위치: Canvas.SetLeft(원, CenterX - r), Canvas.SetTop(원, CenterY - r)
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            // TODO 2: 클릭 위치 p 와 가운데 사이의 거리 d = √(dx² + dy²)  (Math.Sqrt)
            // TODO 3: 점수 — d 가 30 이하 10점, 60 이하 8점, 90 이하 6점, 120 이하 4점, 150 이하 2점, 밖은 0점
            // TODO 4: 클릭한 곳에 지름 10 인 금색(Gold) 점 찍기 · total 에 더해 lblTotal 에 표시
            //         lblLast 에 "거리 57 → 8점" 처럼 표시
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            // TODO 5: total 을 0 으로, 글자를 처음처럼, DrawTarget() 으로 점 지우기
        }
    }
}`;

  const P2_SOLUTION = `${TARGET_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Ch22PracticeTarget
{
    public partial class MainWindow : Window
    {
        private const double CenterX = 150, CenterY = 150;   // 과녁의 가운데
        private const double RingWidth = 30;                  // 고리 하나의 두께
        private int total = 0;

        public MainWindow()
        {
            InitializeComponent();
            DrawTarget();
        }

        private void DrawTarget()
        {
            board.Children.Clear();
            for (int i = 0; i < 5; i++)
            {
                double r = 150 - i * RingWidth;       // 150, 120, 90, 60, 30
                Ellipse ring = new Ellipse
                {
                    Width = r * 2, Height = r * 2,
                    Fill = i % 2 == 0 ? Brushes.Crimson : Brushes.White,
                    Stroke = Brushes.Black, StrokeThickness = 1
                };
                Canvas.SetLeft(ring, CenterX - r);
                Canvas.SetTop(ring, CenterY - r);
                board.Children.Add(ring);             // 큰 원부터 → 작은 원이 위에 그려진다
            }
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);
            double dx = p.X - CenterX, dy = p.Y - CenterY;
            double d = Math.Sqrt(dx * dx + dy * dy);   // 가운데까지 거리

            int score;
            if (d <= 30) score = 10;
            else if (d <= 60) score = 8;
            else if (d <= 90) score = 6;
            else if (d <= 120) score = 4;
            else if (d <= 150) score = 2;
            else score = 0;
            total += score;

            Ellipse dot = new Ellipse { Width = 10, Height = 10, Fill = Brushes.Gold, Stroke = Brushes.Black };
            Canvas.SetLeft(dot, p.X - 5);
            Canvas.SetTop(dot, p.Y - 5);
            board.Children.Add(dot);

            lblTotal.Text = total.ToString();
            lblLast.Text = $"거리 {d:F0} → {score}점";
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            total = 0;
            lblTotal.Text = "0";
            lblLast.Text = "과녁을 클릭하세요.";
            DrawTarget();
        }
    }
}`;

  /* ======================= 22-1 슬라이드용 짧은 코드 ======================= */
  const SL_SHAPES = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22ShapesSlide.MainWindow"
        ${NS}
        Title="기본 도형" Width="420" Height="300">
    <Canvas Background="White">
        <Rectangle Canvas.Left="20" Canvas.Top="20" Width="120" Height="80"
                   Fill="SkyBlue" Stroke="SteelBlue" StrokeThickness="3"/>
        <Ellipse Canvas.Left="170" Canvas.Top="20" Width="80" Height="80" Fill="Tomato"/>
        <Polygon Points="320,20 360,100 280,100" Fill="Gold" Stroke="DarkOrange"/>
        <Line X1="20" Y1="130" X2="380" Y2="170" Stroke="Purple" StrokeThickness="4"/>
        <Path Data="M 20,230 C 100,160 200,300 380,210" Stroke="SeaGreen" StrokeThickness="3"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch22ShapesSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
    }
}`;

  const SL_BRUSH = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22BrushSlide.MainWindow"
        ${NS}
        Title="브러시" Width="440" Height="220">
    <StackPanel Orientation="Horizontal" Margin="16">
        <Rectangle Width="110" Height="110" Fill="#3CB371" Opacity="0.7"/>
        <Rectangle Width="110" Height="110" Margin="16,0">
            <Rectangle.Fill>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0">
                    <GradientStop Color="Yellow" Offset="0"/>
                    <GradientStop Color="Red" Offset="1"/>
                </LinearGradientBrush>
            </Rectangle.Fill>
        </Rectangle>
        <Ellipse Width="110" Height="110">
            <Ellipse.Fill>
                <RadialGradientBrush GradientOrigin="0.3,0.3" Center="0.3,0.3" RadiusX="0.7" RadiusY="0.7">
                    <GradientStop Color="White" Offset="0"/>
                    <GradientStop Color="RoyalBlue" Offset="1"/>
                </RadialGradientBrush>
            </Ellipse.Fill>
        </Ellipse>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace Ch22BrushSlide { public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); } } }`;

  const SL_CLICK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22ClickSlide.MainWindow"
        ${NS}
        Title="클릭한 곳에 네모" Width="420" Height="300">
    <Canvas x:Name="board" Background="White" MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls;
using System.Windows.Input; using System.Windows.Media; using System.Windows.Shapes;
namespace Ch22ClickSlide
{
    public partial class MainWindow : Window
    {
        private readonly Random rand = new Random();
        public MainWindow() { InitializeComponent(); for (int i = 0; i < 5; i++) AddBox(new Point(50 + i * 70, 60)); }
        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) { AddBox(e.GetPosition(board)); }
        private void AddBox(Point p)
        {
            Color c = Color.FromRgb((byte)rand.Next(256), (byte)rand.Next(256), (byte)rand.Next(256));
            Rectangle r = new Rectangle { Width = 40, Height = 40, Fill = new SolidColorBrush(c), Stroke = Brushes.Black };
            Canvas.SetLeft(r, p.X - 20);   // ① 위치
            Canvas.SetTop(r, p.Y - 20);
            board.Children.Add(r);         // ② 추가
        }
    }
}`;

  const SL_ROTATE = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22RotateSlide.MainWindow"
        ${NS}
        Title="슬라이더로 회전" Width="400" Height="320">
    <DockPanel Margin="10">
        <Slider x:Name="sldAngle" DockPanel.Dock="Bottom" Minimum="0" Maximum="360" Value="30"/>
        <Rectangle x:Name="box" Width="140" Height="80" Fill="MediumPurple" RenderTransformOrigin="0.5,0.5"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Media;
namespace Ch22RotateSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            sldAngle.ValueChanged += (s, e) => Rotate();
            Rotate();
        }
        private void Rotate()
        {
            box.RenderTransform = new RotateTransform(sldAngle.Value);   // 각도(도)
            Title = $"회전 {sldAngle.Value:F0}°";
        }
    }
}`;

  /* ======================= 22-2 예제 코드 ======================= */
  const EX_CLOCK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Clock.MainWindow"
        ${NS}
        Title="디지털 시계 — DispatcherTimer" Width="420" Height="300">
    <Grid Background="#1E1E2E">
        <StackPanel VerticalAlignment="Center">
            <TextBlock x:Name="lblDate" FontSize="18" Foreground="LightGray" HorizontalAlignment="Center"/>
            <TextBlock x:Name="lblTime" FontSize="56" FontWeight="Bold" FontFamily="Consolas"
                       Foreground="White" HorizontalAlignment="Center"/>
            <!-- 초(0~59)를 막대로 -->
            <ProgressBar x:Name="barSecond" Maximum="59" Width="300" Height="8" Margin="0,8,0,0"/>
            <TextBlock x:Name="lblTicks" FontSize="13" Foreground="Gray" HorizontalAlignment="Center" Margin="0,10,0,0"/>
            <Button x:Name="btnToggle" Content="멈춤" Width="90" Margin="0,10,0,0" Click="BtnToggle_Click"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Threading;   // DispatcherTimer

namespace Ch22Clock
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private int tickCount = 0;   // Tick 이 몇 번 왔나

        public MainWindow()
        {
            InitializeComponent();

            timer.Interval = TimeSpan.FromSeconds(1);   // ① 간격: 1초마다
            timer.Tick += Timer_Tick;                    // ② 할 일: Tick 이벤트 처리기
            timer.Start();                               // ③ 시작

            ShowTime();                                  // 첫 Tick(1초 뒤)을 기다리지 않고 바로 표시
            Closed += (s, e) => timer.Stop();            // 창이 닫히면 타이머도 멈춘다
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            tickCount++;
            ShowTime();
        }

        private void ShowTime()
        {
            DateTime now = DateTime.Now;
            lblDate.Text = now.ToString("yyyy년 M월 d일 dddd");
            lblTime.Text = now.ToString("HH:mm:ss");
            barSecond.Value = now.Second;
            lblTicks.Text = $"Tick {tickCount}번 · 타이머 {(timer.IsEnabled ? "동작 중" : "멈춤")}";
        }

        private void BtnToggle_Click(object sender, RoutedEventArgs e)
        {
            if (timer.IsEnabled)          // 돌고 있으면
            {
                timer.Stop();
                btnToggle.Content = "다시 시작";
            }
            else
            {
                timer.Start();
                btnToggle.Content = "멈춤";
            }
            ShowTime();
        }
    }
}`;

  const EX_STOPWATCH = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Stopwatch.MainWindow"
        ${NS}
        Title="스톱워치 — Stopwatch + DispatcherTimer" Width="420" Height="360">
    <DockPanel Margin="14">
        <TextBlock x:Name="lblElapsed" DockPanel.Dock="Top" Text="00:00.00" FontSize="52" FontWeight="Bold"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,8">
            <Button x:Name="btnStart" Content="시작" Width="80" Height="30" Click="BtnStart_Click"/>
            <Button Content="랩" Width="80" Margin="8,0" Click="BtnLap_Click"/>
            <Button Content="초기화" Width="80" Click="BtnReset_Click"/>
        </StackPanel>
        <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;         // Stopwatch: 정확한 시간 재기
using System.Windows;
using System.Windows.Threading;

namespace Ch22Stopwatch
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch watch = new Stopwatch();       // 시간을 "재는" 일
        private readonly DispatcherTimer timer = new DispatcherTimer();   // 화면을 "자주 고치는" 일

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);   // 1초에 약 33번 화면 갱신
            timer.Tick += (s, e) => ShowElapsed();
            Closed += (s, e) => timer.Stop();
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            if (watch.IsRunning)
            {
                watch.Stop();
                timer.Stop();
                btnStart.Content = "계속";
            }
            else
            {
                watch.Start();
                timer.Start();
                btnStart.Content = "멈춤";
            }
            ShowElapsed();
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            if (!watch.IsRunning) return;
            // 가장 최근 기록이 맨 위에 오도록 0번 자리에 끼워 넣는다
            lstLaps.Items.Insert(0, $"랩 {lstLaps.Items.Count + 1,2}   {Format(watch.Elapsed)}");
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            watch.Reset();   // 멈추고 0 으로
            timer.Stop();
            lstLaps.Items.Clear();
            btnStart.Content = "시작";
            ShowElapsed();
        }

        private void ShowElapsed()
        {
            lblElapsed.Text = Format(watch.Elapsed);
        }

        // TimeSpan → "분:초.백분의1초"
        private static string Format(TimeSpan t)
        {
            return $"{(int)t.TotalMinutes:00}:{t.Seconds:00}.{t.Milliseconds / 10:00}";
        }
    }
}`;

  const EX_BOUNCE = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Bounce.MainWindow"
        ${NS}
        Title="공 튀기기 — 타이머로 움직이기" Width="520" Height="390">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="10,8">
            <Button x:Name="btnPause" Content="멈춤" Width="70" Click="BtnPause_Click"/>
            <Button Content="빠르게" Width="70" Margin="6,0,0,0" Click="BtnFaster_Click"/>
            <Button Content="느리게" Width="70" Margin="6,0,0,0" Click="BtnSlower_Click"/>
            <TextBlock x:Name="lblInfo" VerticalAlignment="Center" Margin="12,0,0,0"/>
        </StackPanel>
        <Canvas x:Name="board" Width="480" Height="270" Background="#F0F8FF" ClipToBounds="True" Margin="0,0,0,10">
            <Ellipse x:Name="ball" Width="30" Height="30" Canvas.Left="40" Canvas.Top="40">
                <Ellipse.Fill>
                    <RadialGradientBrush GradientOrigin="0.35,0.35" Center="0.35,0.35" RadiusX="0.65" RadiusY="0.65">
                        <GradientStop Color="White" Offset="0"/>
                        <GradientStop Color="OrangeRed" Offset="0.5"/>
                        <GradientStop Color="DarkRed" Offset="1"/>
                    </RadialGradientBrush>
                </Ellipse.Fill>
            </Ellipse>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;

namespace Ch22Bounce
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private double x = 40, y = 40;   // 공의 위치 (왼쪽 위)
        private double vx = 4, vy = 3;   // 속도 = Tick 한 번에 움직이는 픽셀
        private int bounces = 0;         // 벽에 부딪힌 횟수

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(20);   // 1초에 약 50번
            timer.Tick += Timer_Tick;
            timer.Start();
            Closed += (s, e) => timer.Stop();
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            // ① 갱신: 위치 = 위치 + 속도
            x += vx;
            y += vy;

            // ② 벽 검사: 닿으면 벽 안으로 되돌리고, 그 방향 속도의 부호를 바꾼다
            double maxX = board.Width - ball.Width;
            double maxY = board.Height - ball.Height;
            if (x < 0)         { x = 0;    vx = -vx; bounces++; }
            else if (x > maxX) { x = maxX; vx = -vx; bounces++; }
            if (y < 0)         { y = 0;    vy = -vy; bounces++; }
            else if (y > maxY) { y = maxY; vy = -vy; bounces++; }

            // ③ 그리기
            Canvas.SetLeft(ball, x);
            Canvas.SetTop(ball, y);
            lblInfo.Text = $"속도 ({vx:F1}, {vy:F1}) · 튕긴 횟수 {bounces}";
        }

        private void BtnPause_Click(object sender, RoutedEventArgs e)
        {
            timer.IsEnabled = !timer.IsEnabled;   // Start() / Stop() 과 같다
            btnPause.Content = timer.IsEnabled ? "멈춤" : "계속";
        }

        private void BtnFaster_Click(object sender, RoutedEventArgs e) { vx *= 1.5; vy *= 1.5; }
        private void BtnSlower_Click(object sender, RoutedEventArgs e) { vx /= 1.5; vy /= 1.5; }
    }
}`;

  const EX_GAME = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22GameLoop.MainWindow"
        ${NS}
        Title="동전 줍기 — 게임 루프와 방향키" Width="520" Height="400"
        KeyDown="Window_KeyDown">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="10,8" FontSize="14"/>
        <Canvas x:Name="board" Width="480" Height="280" Background="#FFFDE7" ClipToBounds="True">
            <Ellipse x:Name="coin" Width="24" Height="24" Fill="Gold" Stroke="DarkGoldenrod" StrokeThickness="3"
                     Canvas.Left="360" Canvas.Top="120"/>
            <Rectangle x:Name="player" Width="36" Height="36" RadiusX="6" RadiusY="6" Fill="RoyalBlue"
                       Canvas.Left="60" Canvas.Top="120"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;       // Keyboard, Key, KeyEventArgs
using System.Windows.Threading;

namespace Ch22GameLoop
{
    public partial class MainWindow : Window
    {
        private const double Speed = 5;   // Tick 한 번에 움직이는 픽셀
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly Random rand = new Random();
        private double px = 60, py = 120;  // 플레이어 위치
        private int score = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(20);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            ShowInfo();
        }

        // 게임 루프: Tick 마다 ① 입력 → ② 갱신 → ③ 그리기
        private void GameLoop(object? sender, EventArgs e)
        {
            // ① 입력: "지금 눌려 있는" 키를 확인 → 누르고 있는 동안 계속 움직인다
            if (Keyboard.IsKeyDown(Key.Left))  px -= Speed;
            if (Keyboard.IsKeyDown(Key.Right)) px += Speed;
            if (Keyboard.IsKeyDown(Key.Up))    py -= Speed;
            if (Keyboard.IsKeyDown(Key.Down))  py += Speed;

            // ② 갱신: 판 밖으로 못 나가게 자르고, 동전과 겹치는지 검사
            px = Math.Clamp(px, 0, board.Width - player.Width);
            py = Math.Clamp(py, 0, board.Height - player.Height);

            Rect playerRect = new Rect(px, py, player.Width, player.Height);
            Rect coinRect = new Rect(Canvas.GetLeft(coin), Canvas.GetTop(coin), coin.Width, coin.Height);
            if (playerRect.IntersectsWith(coinRect))   // 두 사각형이 겹치면 = 부딪힘
            {
                score++;
                MoveCoin();
                ShowInfo();
            }

            // ③ 그리기
            Canvas.SetLeft(player, px);
            Canvas.SetTop(player, py);
        }

        // KeyDown 이벤트: 한 번 누를 때 한 번 — 일시 정지 · 다시 시작 같은 "명령" 에 알맞다
        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Space)
            {
                timer.IsEnabled = !timer.IsEnabled;
                ShowInfo();
            }
            else if (e.Key == Key.R)
            {
                score = 0;
                px = 60; py = 120;
                Canvas.SetLeft(player, px);
                Canvas.SetTop(player, py);
                MoveCoin();
                ShowInfo();
            }
        }

        private void MoveCoin()
        {
            Canvas.SetLeft(coin, rand.Next(0, (int)(board.Width - coin.Width)));
            Canvas.SetTop(coin, rand.Next(0, (int)(board.Height - coin.Height)));
        }

        private void ShowInfo()
        {
            lblInfo.Text = timer.IsEnabled
                ? $"방향키: 이동 · Space: 일시 정지 · R: 처음부터    점수 {score}"
                : $"일시 정지 — Space 를 누르면 계속합니다 (점수 {score})";
        }
    }
}`;

  const EX_ANIM = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Animation.MainWindow"
        ${NS}
        Title="DoubleAnimation — 속성 값을 부드럽게 바꾸기" Width="500" Height="380"
        Loaded="Window_Loaded">
    <StackPanel Margin="14">
        <TextBlock x:Name="lblBlink" Text="★ 반짝반짝 (Opacity)" FontSize="20" FontWeight="Bold" Foreground="DarkOrange"/>

        <Canvas Height="60" Margin="0,10,0,0" Background="#EEF5FF">
            <Ellipse x:Name="ball" Width="40" Height="40" Fill="MediumSeaGreen" Canvas.Left="10" Canvas.Top="10"/>
        </Canvas>
        <TextBlock Text="(Canvas.Left) 10 → 420 · AutoReverse · Forever" Foreground="Gray" Margin="0,2,0,12"/>

        <Rectangle x:Name="bar" Width="40" Height="30" Fill="SteelBlue" HorizontalAlignment="Left"/>
        <StackPanel Orientation="Horizontal" Margin="0,10,0,0">
            <Button Content="막대 늘리기" Width="100" Click="BtnGrow_Click"/>
            <Button Content="막대 줄이기" Width="100" Margin="8,0,0,0" Click="BtnShrink_Click"/>
            <Button Content="나타나기" Width="100" Margin="8,0,0,0" Click="BtnFadeIn_Click"/>
        </StackPanel>
        <TextBlock x:Name="lblInfo" Margin="0,10,0,0" Foreground="Gray" TextWrapping="Wrap"
                   Text="버튼을 눌러 막대(Width · Opacity) 애니메이션을 실행해 보세요."/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;          // Canvas.LeftProperty
using System.Windows.Media.Animation;   // DoubleAnimation, RepeatBehavior

namespace Ch22Animation
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // 창이 화면에 나타난 뒤(Loaded) 계속 도는 애니메이션을 시작한다
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // ① 글자 투명도: 1 → 0.2 (0.8초), 되돌아오기, 영원히
            DoubleAnimation blink = new DoubleAnimation(1.0, 0.2, TimeSpan.FromSeconds(0.8));
            blink.AutoReverse = true;                        // 끝까지 가면 거꾸로 되돌아온다
            blink.RepeatBehavior = RepeatBehavior.Forever;   // 끝없이 반복
            lblBlink.BeginAnimation(UIElement.OpacityProperty, blink);

            // ② 공: Canvas.Left 10 → 420 (2초) 왕복 — 객체 초기화 문법으로
            DoubleAnimation move = new DoubleAnimation
            {
                From = 10,
                To = 420,
                Duration = TimeSpan.FromSeconds(2),
                AutoReverse = true,
                RepeatBehavior = RepeatBehavior.Forever
            };
            ball.BeginAnimation(Canvas.LeftProperty, move);   // 부착 속성도 애니메이션 가능
        }

        private void BtnGrow_Click(object sender, RoutedEventArgs e)
        {
            // From 을 생략하면 "지금 값" 에서 출발한다
            DoubleAnimation grow = new DoubleAnimation { To = 420, Duration = TimeSpan.FromSeconds(1) };
            grow.Completed += (s, args) => lblInfo.Text = "늘리기 끝! (Completed 이벤트)";   // 시작 전에 연결
            lblInfo.Text = "Width: 지금 값 → 420 (1초)";
            bar.BeginAnimation(FrameworkElement.WidthProperty, grow);
        }

        private void BtnShrink_Click(object sender, RoutedEventArgs e)
        {
            DoubleAnimation shrink = new DoubleAnimation { To = 40, Duration = TimeSpan.FromSeconds(0.5) };
            lblInfo.Text = "Width: 지금 값 → 40 (0.5초)";
            bar.BeginAnimation(FrameworkElement.WidthProperty, shrink);
        }

        private void BtnFadeIn_Click(object sender, RoutedEventArgs e)
        {
            DoubleAnimation fade = new DoubleAnimation(0, 1, TimeSpan.FromSeconds(1.5));   // From 0 → To 1
            lblInfo.Text = "Opacity: 0 → 1 (1.5초)";
            bar.BeginAnimation(UIElement.OpacityProperty, fade);
        }
    }
}`;

  const EX_STORY = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Storyboard.MainWindow"
        ${NS}
        Title="Storyboard — 창이 열릴 때 애니메이션" Width="460" Height="340">
    <Window.Resources>
        <!-- Storyboard: 애니메이션 여러 개를 한 묶음으로. 이름(x:Key)을 붙여 두면 다시 쓸 수 있다 -->
        <Storyboard x:Key="introStory">
            <DoubleAnimation Storyboard.TargetName="lblTitle" Storyboard.TargetProperty="Opacity"
                             From="0" To="1" Duration="0:0:1"/>
            <DoubleAnimation Storyboard.TargetName="logo" Storyboard.TargetProperty="(Canvas.Left)"
                             From="-100" To="172" Duration="0:0:1.2"/>
            <DoubleAnimation Storyboard.TargetName="bar" Storyboard.TargetProperty="Width"
                             From="0" To="300" Duration="0:0:1.2"/>
        </Storyboard>
    </Window.Resources>
    <!-- 창이 Loaded 되면 Storyboard 시작 — 코드 한 줄 없이 XAML 만으로 -->
    <Window.Triggers>
        <EventTrigger RoutedEvent="Window.Loaded">
            <BeginStoryboard Storyboard="{StaticResource introStory}"/>
        </EventTrigger>
    </Window.Triggers>

    <Canvas Background="White">
        <TextBlock x:Name="lblTitle" Canvas.Left="0" Canvas.Top="24" Width="444" TextAlignment="Center"
                   Text="WPF 22장에 오신 것을 환영합니다" FontSize="22" FontWeight="Bold"/>
        <Ellipse x:Name="logo" Canvas.Left="172" Canvas.Top="76" Width="100" Height="100">
            <Ellipse.Fill>
                <RadialGradientBrush GradientOrigin="0.35,0.3" Center="0.35,0.3" RadiusX="0.7" RadiusY="0.7">
                    <GradientStop Color="White" Offset="0"/>
                    <GradientStop Color="MediumPurple" Offset="0.5"/>
                    <GradientStop Color="Indigo" Offset="1"/>
                </RadialGradientBrush>
            </Ellipse.Fill>
        </Ellipse>
        <Rectangle Canvas.Left="72" Canvas.Top="200" Width="300" Height="14" Fill="#E0E0E0"/>
        <Rectangle x:Name="bar" Canvas.Left="72" Canvas.Top="200" Width="300" Height="14" Fill="MediumSeaGreen"/>
        <Button Canvas.Left="172" Canvas.Top="232" Width="100" Content="다시 보기" Click="BtnReplay_Click"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media.Animation;   // Storyboard

namespace Ch22Storyboard
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnReplay_Click(object sender, RoutedEventArgs e)
        {
            // 리소스에서 꺼내 다시 시작. Begin(this): TargetName 을 이 창 안에서 찾는다
            Storyboard story = (Storyboard)FindResource("introStory");
            story.Begin(this);
        }
    }
}`;

  const EX_REACTION = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22Reaction.MainWindow"
        ${NS}
        Title="반응 속도 게임" Width="480" Height="390">
    <DockPanel Margin="14">
        <TextBlock x:Name="lblGuide" DockPanel.Dock="Top" FontSize="15" TextWrapping="Wrap"
                   Text="[시작] 을 누르고, 원이 초록색으로 바뀌면 최대한 빨리 원을 클릭하세요!"/>
        <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" Margin="0,10,0,0">
            <Button x:Name="btnStart" Content="시작" Width="90" Height="30" Click="BtnStart_Click"/>
            <TextBlock x:Name="lblBest" VerticalAlignment="Center" Margin="14,0,0,0" FontSize="14" Text="최고 기록: -"/>
        </StackPanel>
        <DockPanel DockPanel.Dock="Right" Width="130" Margin="10,10,0,0">
            <TextBlock DockPanel.Dock="Top" Text="기록" FontWeight="Bold" Margin="0,0,0,4"/>
            <ListBox x:Name="lstRecords" FontSize="14"/>
        </DockPanel>
        <Grid Margin="0,10,0,0">
            <Ellipse x:Name="light" Width="170" Height="170" Fill="LightGray" Stroke="Gray" StrokeThickness="4"
                     MouseLeftButtonDown="Light_MouseLeftButtonDown"/>
            <!-- 글자가 클릭을 가로채지 않게 IsHitTestVisible="False" -->
            <TextBlock x:Name="lblLight" Text="대기" FontSize="22" FontWeight="Bold" IsHitTestVisible="False"
                       HorizontalAlignment="Center" VerticalAlignment="Center"/>
        </Grid>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;         // Stopwatch
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;

namespace Ch22Reaction
{
    public partial class MainWindow : Window
    {
        private enum GameState { Ready, Waiting, Go }   // 대기 · 기다리는 중 · 지금 눌러!

        private GameState state = GameState.Ready;
        private readonly DispatcherTimer delayTimer = new DispatcherTimer();   // "언제 초록이 될까" 를 정하는 타이머
        private readonly Stopwatch watch = new Stopwatch();                    // 반응 시간 재기
        private readonly Random rand = new Random();
        private long best = long.MaxValue;                                     // 최고(가장 짧은) 기록

        public MainWindow()
        {
            InitializeComponent();
            delayTimer.Tick += DelayTimer_Tick;
            Closed += (s, e) => delayTimer.Stop();
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            state = GameState.Waiting;
            light.Fill = Brushes.IndianRed;
            lblLight.Text = "기다려...";
            lblGuide.Text = "초록색이 되는 순간 클릭! (미리 누르면 실패)";
            btnStart.IsEnabled = false;

            // 1.5 ~ 4초 사이 무작위 → 언제 바뀔지 예측할 수 없게
            delayTimer.Interval = TimeSpan.FromMilliseconds(rand.Next(1500, 4000));
            delayTimer.Start();
        }

        // 한 번만 쓰는 타이머: Tick 이 오면 바로 Stop()
        private void DelayTimer_Tick(object? sender, EventArgs e)
        {
            delayTimer.Stop();
            state = GameState.Go;
            light.Fill = Brushes.LimeGreen;
            lblLight.Text = "지금!";
            watch.Restart();          // 0 부터 다시 재기 시작
        }

        private void Light_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (state == GameState.Waiting)          // 초록이 되기 전에 눌렀다
            {
                delayTimer.Stop();
                light.Fill = Brushes.Orange;
                lblLight.Text = "너무 빨라요!";
                lblGuide.Text = "초록색이 되기 전에 눌렀습니다. [시작] 으로 다시 해 보세요.";
            }
            else if (state == GameState.Go)          // 제대로 눌렀다
            {
                watch.Stop();
                long ms = watch.ElapsedMilliseconds;
                if (ms < best) best = ms;

                lstRecords.Items.Insert(0, $"{ms} ms");
                lblBest.Text = $"최고 기록: {best} ms";
                light.Fill = Brushes.SkyBlue;
                lblLight.Text = $"{ms} ms";
                lblGuide.Text = Comment(ms) + "  [시작] 으로 한 번 더!";
            }
            else
            {
                return;                              // 대기 중에는 무시
            }
            state = GameState.Ready;
            btnStart.IsEnabled = true;
        }

        private static string Comment(long ms)
        {
            if (ms < 250) return "번개 같아요! ⚡";
            if (ms < 400) return "좋아요!";
            return "조금 더 빨리!";
        }
    }
}`;

  /* ======================= 22-2 실습 ======================= */
  const COUNT_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22PracticeCountdown.MainWindow"
        ${NS}
        Title="카운트다운" Width="360" Height="300">
    <Border x:Name="panel" Background="White">
        <StackPanel VerticalAlignment="Center" HorizontalAlignment="Center">
            <TextBlock x:Name="lblCount" Text="10" FontSize="72" FontWeight="Bold" HorizontalAlignment="Center"/>
            <ProgressBar x:Name="bar" Maximum="10" Value="10" Width="240" Height="10"/>
            <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,16,0,0">
                <Button x:Name="btnStart" Content="시작" Width="80" Click="BtnStart_Click"/>
                <Button Content="처음으로" Width="80" Margin="8,0,0,0" Click="BtnReset_Click"/>
            </StackPanel>
        </StackPanel>
    </Border>
</Window>`;

  const P3_STARTER = `${COUNT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;

namespace Ch22PracticeCountdown
{
    public partial class MainWindow : Window
    {
        // TODO 0: 필드 두 개 — DispatcherTimer timer, 남은 초 int remaining = 10

        public MainWindow()
        {
            InitializeComponent();
            // TODO 1: Interval 1초, Tick 처리기 연결, 창이 닫히면 Stop
        }

        // TODO 2: Tick 처리기 — remaining 을 1 줄이고 lblCount · bar 에 표시
        //         0 이 되면 타이머를 멈추고 "끝!" 표시, panel 배경을 LightCoral 로

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            // TODO 3: 돌고 있으면 멈추고(버튼 "계속"), 멈춰 있으면 시작(버튼 "멈춤")
            //         이미 0 이면 10 으로 되돌린 뒤 시작
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: 타이머 멈춤, remaining = 10, 배경 흰색, 버튼 "시작", 화면 갱신
        }
    }
}`;

  const P3_SOLUTION = `${COUNT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;

namespace Ch22PracticeCountdown
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private int remaining = 10;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromSeconds(1);
            timer.Tick += Timer_Tick;
            Closed += (s, e) => timer.Stop();
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            remaining--;
            ShowCount();
            if (remaining == 0)
            {
                timer.Stop();
                lblCount.Text = "끝!";
                panel.Background = Brushes.LightCoral;
                btnStart.Content = "시작";
            }
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            if (timer.IsEnabled)
            {
                timer.Stop();
                btnStart.Content = "계속";
            }
            else
            {
                if (remaining == 0) Reset();
                timer.Start();
                btnStart.Content = "멈춤";
            }
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            timer.Stop();
            Reset();
            btnStart.Content = "시작";
        }

        private void Reset()
        {
            remaining = 10;
            panel.Background = Brushes.White;
            ShowCount();
        }

        private void ShowCount()
        {
            lblCount.Text = remaining.ToString();
            bar.Value = remaining;
        }
    }
}`;

  const PADDLE_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22PracticePaddle.MainWindow"
        ${NS}
        Title="공 받기" Width="520" Height="400"
        KeyDown="Window_KeyDown">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="10,8" FontSize="14"
                   Text="←→: 막대 이동 · Space: 다시 시작"/>
        <Canvas x:Name="board" Width="480" Height="290" Background="#10131A" ClipToBounds="True">
            <Ellipse x:Name="ball" Width="20" Height="20" Fill="Orange" Canvas.Left="100" Canvas.Top="40"/>
            <Rectangle x:Name="paddle" Width="90" Height="12" RadiusX="6" RadiusY="6" Fill="DeepSkyBlue"
                       Canvas.Left="195" Canvas.Top="265"/>
        </Canvas>
    </DockPanel>
</Window>`;

  const P4_STARTER = `${PADDLE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

namespace Ch22PracticePaddle
{
    public partial class MainWindow : Window
    {
        private const double PaddleSpeed = 7;
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private double x, y, vx, vy;   // 공 위치 · 속도
        private double paddleX;        // 막대의 왼쪽 x
        // TODO 0: 점수 필드 int score

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(20);
            timer.Tick += GameLoop;
            Closed += (s, e) => timer.Stop();
            NewGame();
        }

        private void NewGame()
        {
            x = 100; y = 40; vx = 4; vy = 4;
            paddleX = 195;
            lblInfo.Text = "←→: 막대 이동";
            Draw();
            timer.Start();
        }

        private void GameLoop(object? sender, EventArgs e)
        {
            // TODO 1: ← → 키가 눌려 있으면 paddleX 를 PaddleSpeed 만큼 옮기고,
            //         Math.Clamp 로 판(board.Width - paddle.Width) 밖으로 못 나가게

            x += vx;
            y += vy;
            if (x < 0 || x > board.Width - ball.Width) { vx = -vx; x = Math.Clamp(x, 0, board.Width - ball.Width); }
            if (y < 0) { y = 0; vy = -vy; }

            // TODO 2: 공이 내려오는 중(vy > 0)이고 막대와 겹치면 (Rect.IntersectsWith)
            //         위로 튕기고(vy = -vy), 공을 막대 위에 올려놓고, 점수 +1 표시

            // TODO 3: 지금은 바닥에서도 튕긴다 → 바닥 아래로 떨어지면(y > board.Height)
            //         timer.Stop() 하고 "게임 끝! 점수 n — Space: 다시 시작" 표시로 바꾸기
            if (y > board.Height - ball.Height) { y = board.Height - ball.Height; vy = -vy; }

            Draw();
        }

        private void Draw()
        {
            Canvas.SetLeft(ball, x);
            Canvas.SetTop(ball, y);
            Canvas.SetLeft(paddle, paddleX);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Space && !timer.IsEnabled) NewGame();   // 게임이 끝났을 때만 다시 시작
        }
    }
}`;

  const P4_SOLUTION = `${PADDLE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

namespace Ch22PracticePaddle
{
    public partial class MainWindow : Window
    {
        private const double PaddleSpeed = 7;
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private double x, y, vx, vy;   // 공 위치 · 속도
        private double paddleX;        // 막대의 왼쪽 x
        private int score;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(20);
            timer.Tick += GameLoop;
            Closed += (s, e) => timer.Stop();
            NewGame();
        }

        private void NewGame()
        {
            x = 100; y = 40; vx = 4; vy = 4;
            paddleX = 195;
            score = 0;
            lblInfo.Text = "←→: 막대 이동 · 점수 0";
            Draw();
            timer.Start();
        }

        private void GameLoop(object? sender, EventArgs e)
        {
            // ① 입력: 막대
            if (Keyboard.IsKeyDown(Key.Left)) paddleX -= PaddleSpeed;
            if (Keyboard.IsKeyDown(Key.Right)) paddleX += PaddleSpeed;
            paddleX = Math.Clamp(paddleX, 0, board.Width - paddle.Width);

            // ② 갱신: 공 + 왼쪽 · 오른쪽 · 위 벽
            x += vx;
            y += vy;
            if (x < 0 || x > board.Width - ball.Width) { vx = -vx; x = Math.Clamp(x, 0, board.Width - ball.Width); }
            if (y < 0) { y = 0; vy = -vy; }

            // 막대에 닿았나? (내려오는 중일 때만 — 올라가는 공이 다시 튕기지 않게)
            double paddleY = Canvas.GetTop(paddle);
            Rect ballRect = new Rect(x, y, ball.Width, ball.Height);
            Rect paddleRect = new Rect(paddleX, paddleY, paddle.Width, paddle.Height);
            if (vy > 0 && ballRect.IntersectsWith(paddleRect))
            {
                vy = -vy;
                y = paddleY - ball.Height;   // 막대 위에 올려놓기
                vx *= 1.05; vy *= 1.05;      // 받을 때마다 조금씩 빨라진다
                score++;
                lblInfo.Text = $"←→: 막대 이동 · 점수 {score}";
            }

            // 바닥 아래로 떨어지면 끝
            if (y > board.Height)
            {
                timer.Stop();
                lblInfo.Text = $"게임 끝! 점수 {score} — Space: 다시 시작";
            }

            // ③ 그리기
            Draw();
        }

        private void Draw()
        {
            Canvas.SetLeft(ball, x);
            Canvas.SetTop(ball, y);
            Canvas.SetLeft(paddle, paddleX);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Space && !timer.IsEnabled) NewGame();
        }
    }
}`;

  /* ======================= 22-2 슬라이드용 짧은 코드 ======================= */
  const SL_CLOCK = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22ClockSlide.MainWindow"
        ${NS}
        Title="디지털 시계" Width="360" Height="200">
    <TextBlock x:Name="lblTime" FontSize="48" FontWeight="Bold"
               HorizontalAlignment="Center" VerticalAlignment="Center"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Threading;
namespace Ch22ClockSlide
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromSeconds(1);   // ① 간격
            timer.Tick += Timer_Tick;                    // ② 할 일
            timer.Start();                               // ③ 시작
            Timer_Tick(null, EventArgs.Empty);           // 바로 한 번 표시
            Closed += (s, e) => timer.Stop();
        }
        private void Timer_Tick(object? sender, EventArgs e)
        {
            lblTime.Text = DateTime.Now.ToString("HH:mm:ss");
        }
    }
}`;

  const SL_BOUNCE = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22BounceSlide.MainWindow" Title="공 튀기기" Width="440" Height="320"
        ${NS}>
    <Canvas x:Name="board" Width="400" Height="250" Background="AliceBlue" ClipToBounds="True">
        <Ellipse x:Name="ball" Width="30" Height="30" Fill="OrangeRed"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls; using System.Windows.Threading;
namespace Ch22BounceSlide
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(20) };
        private double x = 10, y = 10, vx = 4, vy = 3;   // 위치 · 속도
        public MainWindow()
        {
            InitializeComponent();
            timer.Tick += (s, e) =>
            {
                x += vx; y += vy;                                        // 갱신
                if (x < 0 || x > board.Width - ball.Width) vx = -vx;     // 좌우 벽
                if (y < 0 || y > board.Height - ball.Height) vy = -vy;   // 위아래 벽
                Canvas.SetLeft(ball, x); Canvas.SetTop(ball, y);         // 그리기
            };
            timer.Start(); Closed += (s, e) => timer.Stop();
        }
    }
}`;

  const SL_KEYS = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22KeysSlide.MainWindow" Title="방향키 — Keyboard.IsKeyDown" Width="440" Height="320"
        ${NS}>
    <Canvas x:Name="board" Width="400" Height="250" Background="Honeydew">
        <Rectangle x:Name="player" Width="30" Height="30" Fill="RoyalBlue" Canvas.Left="185" Canvas.Top="110"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls; using System.Windows.Input; using System.Windows.Threading;
namespace Ch22KeysSlide
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(20) };
        public MainWindow()
        {
            InitializeComponent();
            timer.Tick += (s, e) =>
            {
                double x = Canvas.GetLeft(player), y = Canvas.GetTop(player);
                if (Keyboard.IsKeyDown(Key.Left)) x -= 5;  if (Keyboard.IsKeyDown(Key.Right)) x += 5;   // 누르고 "있는" 동안
                if (Keyboard.IsKeyDown(Key.Up)) y -= 5;    if (Keyboard.IsKeyDown(Key.Down)) y += 5;    // Tick 마다 계속
                Canvas.SetLeft(player, Math.Clamp(x, 0, board.Width - player.Width));
                Canvas.SetTop(player, Math.Clamp(y, 0, board.Height - player.Height));
            };
            timer.Start(); Closed += (s, e) => timer.Stop();
        }
    }
}`;

  const SL_ANIM = `// ===== File: MainWindow.xaml =====
<Window x:Class="Ch22AnimSlide.MainWindow" Title="DoubleAnimation" Width="440" Height="260"
        ${NS} Loaded="Window_Loaded">
    <StackPanel Margin="14">
        <TextBlock x:Name="lblStar" Text="★ 반짝반짝" FontSize="24" Foreground="DarkOrange"/>
        <Rectangle x:Name="bar" Width="40" Height="30" Fill="SteelBlue" HorizontalAlignment="Left" Margin="0,14"/>
        <Button Content="막대 늘리기" Width="120" HorizontalAlignment="Left" Click="BtnGrow_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Media.Animation;
namespace Ch22AnimSlide
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            DoubleAnimation blink = new DoubleAnimation(1.0, 0.2, TimeSpan.FromSeconds(0.8));
            blink.AutoReverse = true;                        // 되돌아오기
            blink.RepeatBehavior = RepeatBehavior.Forever;   // 영원히
            lblStar.BeginAnimation(UIElement.OpacityProperty, blink);
        }
        private void BtnGrow_Click(object sender, RoutedEventArgs e)
        {
            bar.BeginAnimation(FrameworkElement.WidthProperty, new DoubleAnimation(40, 360, TimeSpan.FromSeconds(1)));
        }
    }
}`;

  CS_COURSE.addChapter({
    id: 'ch22',
    no: '22',
    title: '그래픽 · 애니메이션 · 타이머',
    subtitle: 'Graphics, Animation & Timers',
    summary: 'Canvas 좌표 위에 사각형 · 원 · 선 · 다각형 · Path 같은 도형(Shape)을 놓고, 단색 · 그라데이션 브러시와 투명도로 칠하고, 코드와 마우스 클릭으로 도형을 만들어 추가하는 방법을 배웁니다. RenderTransform 으로 회전 · 크기 · 이동을 적용한 뒤, DispatcherTimer 로 시계와 스톱워치, 벽에 튕기는 공, 방향키로 움직이는 게임 루프를 만들고, DoubleAnimation · Storyboard 로 속성 값을 부드럽게 바꾸는 애니메이션까지 다룹니다. 마지막으로 반응 속도 게임을 완성하며 WPF 파트를 마무리합니다.',
    goals: [
      'Canvas 좌표계를 이해하고 Rectangle · Ellipse · Line · Polyline · Polygon · Path 를 원하는 위치에 그릴 수 있다',
      'Fill · Stroke · StrokeThickness 와 SolidColorBrush · LinearGradientBrush · RadialGradientBrush · Opacity 로 도형을 칠할 수 있다',
      '코드에서 도형을 만들어 Canvas.SetLeft · SetTop · Children.Add 로 추가하고, 마우스 클릭으로 도형을 찍을 수 있다',
      'RotateTransform · ScaleTransform · TranslateTransform 과 RenderTransformOrigin 의 효과를 설명하고 적용할 수 있다',
      'DispatcherTimer 의 Interval · Tick · Start · Stop 으로 시계 · 스톱워치 · 움직이는 공을 만들 수 있다',
      '입력 → 갱신 → 그리기의 게임 루프와 Keyboard.IsKeyDown 으로 방향키 조작 · 충돌 검사를 구현할 수 있다',
      'DoubleAnimation 의 From · To · Duration · AutoReverse · RepeatBehavior 와 XAML Storyboard 로 애니메이션을 만들 수 있다'
    ],
    sections: [
      /* ===================== ch22-1 ===================== */
      {
        id: 'ch22-1',
        title: '도형과 브러시 · 변환',
        minutes: 50,
        goals: [
          'Canvas 좌표(왼쪽 위 (0, 0), 아래로 갈수록 Y 증가)로 도형의 위치를 정할 수 있다',
          'Rectangle · Ellipse · Line · Polyline · Polygon · Path 의 차이와 주요 속성을 말할 수 있다',
          '색 이름 · #RRGGBB · Opacity · 그라데이션 브러시로 도형을 칠할 수 있다',
          '코드에서 도형을 만들어 Canvas 에 추가하고, 클릭한 곳에 도형을 찍을 수 있다',
          'RenderTransform 과 RenderTransformOrigin 으로 도형을 회전 · 확대 · 이동할 수 있다'
        ],
        flow: [['도입: WPF 의 그림 그리기', 5], ['Canvas 좌표 · 기본 도형', 9], ['Polyline · Polygon · Path', 6], ['브러시 · 투명도', 7], ['코드로 도형 만들기 · 클릭', 8], ['변환 RenderTransform', 7], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: 'WPF 에서 그림 그리기 — 도형(Shape)' },
          { type: 'p', html: '그림판은 화면의 점(픽셀)에 색을 칠합니다. WPF 는 방식이 다릅니다. <b>사각형 · 원 · 선 같은 도형 객체</b>를 만들어 화면에 올려놓으면, WPF 가 알아서 그려 줍니다. 이 도형들을 <b>Shape</b> 라고 하며 <code>System.Windows.Shapes</code> 네임스페이스에 있습니다. 도형도 <code>Button</code> 이나 <code>TextBlock</code> 과 똑같은 <b>요소(element)</b>라서, XAML 로 쓰고, <code>x:Name</code> 을 붙이고, 코드에서 속성을 바꾸고, 마우스 이벤트도 받을 수 있습니다.' },
          { type: 'p', html: '도형은 점이 아니라 “모양의 정보(좌표 · 크기)” 로 기억되는 <b>벡터 그래픽(vector graphics)</b>이라, 크게 확대해도 계단처럼 깨지지 않습니다. 도형을 원하는 자리에 놓을 때는 15장에서 배운 <code>Canvas</code> 를 씁니다. <code>Canvas</code> 는 자식을 <b>좌표</b>로 배치하는 패널이며, <b>왼쪽 위가 (0, 0)</b> 이고 <b>X 는 오른쪽, Y 는 아래로</b> 커집니다. 수학 시간의 좌표와 Y 방향이 반대라는 점에 주의하세요.' },
          { type: 'figure', html: SVG_COORD, caption: 'Canvas 좌표와 도형의 위치 · 크기를 정하는 속성' },
          { type: 'table', head: ['도형', '모양', '위치 · 모양을 정하는 속성'], rows: [
            ['<code>Rectangle</code>', '사각형 (둥근 모서리 가능)', '<code>Canvas.Left</code> · <code>Canvas.Top</code> · <code>Width</code> · <code>Height</code> · <code>RadiusX</code> · <code>RadiusY</code>'],
            ['<code>Ellipse</code>', '원 · 타원 (상자 안에 꽉 차게)', '<code>Canvas.Left</code> · <code>Canvas.Top</code> · <code>Width</code> · <code>Height</code> (같으면 원)'],
            ['<code>Line</code>', '두 점을 잇는 선', '<code>X1</code> · <code>Y1</code> · <code>X2</code> · <code>Y2</code>'],
            ['<code>Polyline</code>', '여러 점을 잇는 <b>열린</b> 선', '<code>Points="x,y x,y …"</code>'],
            ['<code>Polygon</code>', '여러 점을 잇는 <b>닫힌</b> 도형 (채우기 가능)', '<code>Points="x,y x,y …"</code> — 마지막 점과 첫 점이 자동으로 이어짐'],
            ['<code>Path</code>', '곡선 · 원호를 포함한 자유 모양', '<code>Data="M … L … C … Z"</code> (그리기 명령)']
          ], caption: 'WPF 의 여섯 가지 기본 도형 — 모두 Shape 를 상속한다' },
          { type: 'table', head: ['공통 속성', '뜻', '예'], rows: [
            ['<code>Fill</code>', '안쪽을 칠하는 브러시', '<code>Fill="SkyBlue"</code>'],
            ['<code>Stroke</code>', '테두리 · 선의 브러시', '<code>Stroke="SteelBlue"</code>'],
            ['<code>StrokeThickness</code>', '테두리 · 선의 두께 (기본 1)', '<code>StrokeThickness="3"</code>'],
            ['<code>StrokeDashArray</code>', '점선 모양 (선 길이 · 빈칸 길이, 두께의 배수)', '<code>StrokeDashArray="3 2"</code>'],
            ['<code>Opacity</code>', '불투명도 0(투명) ~ 1(불투명)', '<code>Opacity="0.5"</code>']
          ] },
          { type: 'code', title: '예제 22-1. Canvas 좌표와 기본 도형 — Rectangle · Ellipse · Line', code: EX_SHAPES, desc: '모든 도형이 <code>Canvas</code> 의 자식입니다. 사각형과 원은 <code>Canvas.Left</code> · <code>Canvas.Top</code> 으로 <b>왼쪽 위 모서리</b>를 정하고 <code>Width</code> · <code>Height</code> 로 크기를 정합니다. <code>Ellipse</code> 는 그 상자 안에 꽉 차게 그려지므로, 가로 · 세로가 같으면 원이고 다르면 타원입니다. <code>Line</code> 은 <code>Canvas.Left</code> 없이 <code>X1</code> · <code>Y1</code> · <code>X2</code> · <code>Y2</code> 두 점으로 위치가 정해지고, 안을 채울 수 없으므로 <code>Stroke</code> 를 꼭 줘야 보입니다. 두 번째 선은 <code>StrokeDashArray="3 2"</code> 로 “선 3 · 빈칸 2”(두께의 배수)를 반복하는 점선입니다. 도형은 <b>나중에 적은 것이 위에</b> 그려집니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 도형 그리기', html: '<ul><li><b>도구 상자</b>의 “모든 WPF 컨트롤” 에 <b>Rectangle</b> · <b>Ellipse</b> 가 있습니다. Canvas 위로 끌어다 놓으면 <code>Canvas.Left</code> · <code>Canvas.Top</code> · <code>Width</code> · <code>Height</code> 가 자동으로 적힙니다. <code>Line</code> · <code>Polygon</code> · <code>Path</code> 는 XAML 로 직접 쓰는 편이 정확합니다.</li><li>도형을 고른 뒤 <b>속성 창 ▸ 브러시</b>에서 <code>Fill</code> · <code>Stroke</code> 를 누르면 <b>브러시 편집기</b>가 열립니다. 위쪽 단추로 <b>단색 · 그라데이션 · 이미지</b>를 고르고, 색상표에서 색을 찍거나 <code>#RRGGBB</code> 를 입력합니다. 그라데이션은 막대 위를 클릭해 정지점(GradientStop)을 더할 수 있습니다.</li><li>디자이너에서 도형을 마우스로 옮기면 XAML 의 좌표 숫자가 함께 바뀝니다 — 좌표를 눈으로 익히기 좋습니다.</li></ul>' },

          { type: 'h', text: '여러 점으로 된 도형 — Polyline · Polygon · Path' },
          { type: 'p', html: '<code>Polyline</code> 과 <code>Polygon</code> 은 <code>Points</code> 에 <code>"x,y x,y x,y"</code> 처럼 점을 차례로 적습니다. 차이는 딱 하나, <code>Polygon</code> 은 마지막 점과 첫 점을 자동으로 이어 <b>닫힌 도형</b>이 된다는 것입니다. 그래서 별 · 삼각형 · 화살표처럼 안을 칠할 모양은 <code>Polygon</code>, 꺾은선 그래프처럼 선만 필요한 것은 <code>Polyline</code> 을 씁니다.' },
          { type: 'p', html: '<code>Path</code> 는 가장 자유로운 도형입니다. <code>Data</code> 에 <b>그리기 명령</b>을 문자열로 적는데, 펜을 들고 종이에 그리는 순서를 글로 적는다고 생각하면 됩니다. 명령 글자 뒤에 좌표를 적고, <b>대문자는 절대 좌표</b>, 소문자는 바로 앞 점 기준(상대 좌표)입니다.' },
          { type: 'table', head: ['명령', '뜻', '예'], rows: [
            ['<code>M x,y</code>', '펜을 들어 (x, y) 로 옮기기 (Move)', '<code>M 20,80</code>'],
            ['<code>L x,y</code>', '지금 점에서 (x, y) 까지 직선 (Line)', '<code>L 100,20</code>'],
            ['<code>H x</code> · <code>V y</code>', '가로 · 세로 직선', '<code>H 200</code>'],
            ['<code>C x1,y1 x2,y2 x,y</code>', '조절점 두 개를 쓰는 곡선 (베지어)', '하트 · 부드러운 곡선'],
            ['<code>Q x1,y1 x,y</code> · <code>T x,y</code>', '조절점 하나 곡선 · 이어지는 곡선', '물결'],
            ['<code>A rx,ry 각도 큰호 방향 x,y</code>', '원호 (원의 일부)', '<code>A 70,70 0 0 1 160,220</code>'],
            ['<code>Z</code>', '처음 점으로 돌아가 닫기', '채우기가 가능해짐']
          ], caption: 'Path 의 그리기 명령 (Path 미니 언어)' },
          { type: 'code', title: '예제 22-2. Polyline · Polygon · Path — 지그재그 · 별 · 하트 · 반원 · 물결', code: EX_POLY, desc: '지그재그는 <code>Polyline</code>, 별은 꼭짓점 10개(바깥 점과 안쪽 점을 번갈아)짜리 <code>Polygon</code> 입니다. 하트는 <code>C</code>(곡선) 네 개를 이은 <code>Path</code> 이며, <code>Path</code> 에도 <code>Canvas.Left</code> · <code>Canvas.Top</code> 을 주면 <code>Data</code> 의 좌표 전체가 그만큼 옮겨집니다. 반원은 <code>A</code>(원호) 명령으로, 물결은 <code>Q</code> 뒤에 <code>T</code> 를 이어 붙여 만들었습니다. 맨 아래 곡선은 XAML 에 점이 하나도 없는 <code>Polyline</code> 에, 코드에서 <code>Math.Sin</code> 으로 계산한 점 93개를 <code>PointCollection</code> 에 모아 <code>wave.Points</code> 에 한 번에 넣은 것입니다.' },
          { type: 'callout', kind: 'warn', title: 'Points 는 “모아서 한 번에” 넣는다', html: '실제 WPF 에서는 <code>wave.Points.Add(new Point(…))</code> 처럼 기존 컬렉션에 점을 하나씩 더해도 화면이 갱신됩니다. 하지만 <b>이 강좌의 브라우저 실행 창</b>에서는 <code>Points.Add</code> 로 더한 점이 화면에 반영되지 않습니다. 예제처럼 <code>new PointCollection()</code> 에 점을 모은 뒤 <code>Points = points;</code> 로 <b>통째로 대입</b>하세요. 이 방법은 실제 WPF 에서도 똑같이 동작하고, 점을 많이 넣을 때 더 빠릅니다.' },

          { type: 'h', text: '브러시 — 무엇으로 칠할까' },
          { type: 'p', html: '<code>Fill</code> · <code>Stroke</code> · <code>Background</code> · <code>Foreground</code> 에 넣는 값은 모두 <b>브러시(Brush)</b>입니다. XAML 에 <code>Fill="Tomato"</code> 라고 쓰면 WPF 가 그 글자를 <code>SolidColorBrush</code>(단색 브러시)로 바꿔 줍니다. 한 가지 색이 아니라 점점 변하는 색으로 칠하려면 <b>그라데이션 브러시</b>를 <b>속성 요소</b> 문법(<code>&lt;Rectangle.Fill&gt;</code>)으로 넣습니다.' },
          { type: 'table', head: ['방법', '쓰는 법', '설명'], rows: [
            ['색 이름', '<code>Fill="Tomato"</code> · 코드 <code>Brushes.Tomato</code>', '<code>Red</code>, <code>SkyBlue</code>, <code>Gold</code> … 140여 가지'],
            ['<code>#RRGGBB</code>', '<code>Fill="#3CB371"</code>', '빨강 · 초록 · 파랑을 16진수 두 자리(00~FF)씩'],
            ['<code>#AARRGGBB</code>', '<code>Fill="#800000FF"</code>', '맨 앞 AA = 알파(불투명도). 80 ≈ 50% → 반투명 파랑'],
            ['코드로 색 만들기', '<code>new SolidColorBrush(Color.FromRgb(60, 179, 113))</code>', '<code>Color.FromArgb(a, r, g, b)</code> 로 투명도까지'],
            ['<code>LinearGradientBrush</code>', '<code>StartPoint</code> · <code>EndPoint</code> + <code>GradientStop</code>', '한 방향으로 색이 바뀜. 좌표는 도형 크기 기준 0~1'],
            ['<code>RadialGradientBrush</code>', '<code>GradientOrigin</code> · <code>Center</code> · <code>RadiusX/Y</code> + <code>GradientStop</code>', '한 점에서 바깥으로 퍼짐 — 입체적인 공'],
            ['<code>Opacity</code>', '<code>Opacity="0.6"</code>', '요소 전체(채우기 + 테두리)의 불투명도']
          ], caption: '브러시와 색 지정 방법' },
          { type: 'code', title: '예제 22-3. 브러시 — 색 이름 · 16진수 · 투명도 · 그라데이션', code: EX_BRUSH, desc: '<code>UniformGrid</code>(2행 3열) 칸마다 브러시를 하나씩 보여 줍니다. ③ 은 빨강 · 초록 · 파랑 원에 <code>Opacity="0.6"</code> 을 줘서 겹친 부분이 섞여 보입니다. ④ 의 <code>GradientStop</code> 은 “어느 위치(<code>Offset</code> 0~1)에 어떤 색” 을 뜻하며, <code>StartPoint="0,0.5"</code> → <code>EndPoint="1,0.5"</code> 는 도형의 왼쪽 가운데에서 오른쪽 가운데 방향입니다(좌표는 픽셀이 아니라 도형 크기에 대한 비율). ⑤ 는 빛이 시작되는 점(<code>GradientOrigin</code>)을 왼쪽 위로 옮겨 입체적인 공처럼 보이게 했습니다. ⑥ 은 생성자에서 <code>new LinearGradientBrush(시작색, 끝색, 각도)</code> 로 만들었고(각도 90 = 위에서 아래로), 클릭하면 <code>Color.FromRgb</code> 로 무작위 색을 만들어 <code>{c.R:X2}</code>(16진수 두 자리) 형식으로 보여 줍니다.' },
          { type: 'callout', kind: 'tip', title: 'Brushes.Red 는 “고정된” 브러시', html: '<code>Brushes.Red</code> 같은 미리 만들어진 브러시는 여러 곳에서 함께 쓰도록 <b>고정(Frozen)</b>되어 있어서, <code>((SolidColorBrush)rect.Fill).Color = …</code> 처럼 속성을 고치면 실제 WPF 에서는 예외가 납니다. 색을 바꿀 때는 예제처럼 <code>rect.Fill = new SolidColorBrush(새 색);</code> 으로 <b>새 브러시를 대입</b>하세요. 이 방법은 브라우저 실행 창과 실제 WPF 모두에서 확실히 동작합니다.' },

          { type: 'h', text: '코드로 도형 만들기' },
          { type: 'p', html: '17장에서 클릭한 곳에 원을 그릴 때 이미 해 본 방법입니다. 도형도 클래스이므로 <code>new</code> 로 만들고, 위치를 정하고, 패널에 넣으면 됩니다. 세 단계를 기억하세요.' },
          { type: 'list', ordered: true, items: [
            '<b>만들기</b> — <code>Rectangle bar = new Rectangle { Width = 50, Height = h, Fill = Brushes.Gold };</code>',
            '<b>위치 정하기</b> — <code>Canvas.SetLeft(bar, x);</code> <code>Canvas.SetTop(bar, y);</code> (XAML 의 <code>Canvas.Left="…"</code> 과 같다)',
            '<b>추가하기</b> — <code>chart.Children.Add(bar);</code> 를 해야 비로소 화면에 나타난다'
          ] },
          { type: 'p', html: '반복문과 배열을 함께 쓰면 데이터에 따라 그림이 바뀌는 <b>그래프</b>를 그릴 수 있습니다. 화면의 Y 는 아래로 커지므로, 막대를 바닥선에서 위로 세우려면 <b>위쪽 모서리 = 바닥 − 높이</b>로 계산해야 합니다.' },
          { type: 'code', title: '예제 22-4. 코드로 그린 막대그래프 — 배열 + 반복문 + Children.Add', code: EX_CHART, desc: 'XAML 에는 빈 <code>Canvas</code> 하나뿐이고, 막대 · 글자 · 바닥선 · 평균선은 모두 코드에서 만들었습니다. 점수 1점을 2픽셀로 바꿔(<code>Scale</code>) 높이를 구하고, <code>Canvas.SetTop(bar, BaseY - h)</code> 로 막대가 바닥선에서 위로 서게 합니다. 글자(<code>TextBlock</code>)도 요소이므로 같은 세 단계로 추가하며, 반복되는 부분은 <code>AddLabel</code> 메서드로 묶었습니다. 평균은 LINQ(<code>scores.Average()</code>, 14장)로 구하고 <code>StrokeDashArray = new DoubleCollection { 4, 3 }</code> 로 점선을 그었습니다. 배열의 점수를 바꿔 실행하면 그래프가 저절로 바뀝니다.' },
          { type: 'p', html: '마우스 이벤트와 합치면 “클릭한 곳에 도형 찍기” 가 됩니다. 원 · 사각형 · 삼각형은 모두 <code>Shape</code> 를 상속하므로, 만들 때만 종류별로 나누고 색 · 테두리 · 위치를 정하는 코드는 <code>Shape</code> 형식 변수 하나로 함께 쓸 수 있습니다(9장 다형성).' },
          { type: 'code', title: '예제 22-5. 클릭해서 도형 찍기 — 모양 선택 · 무작위 색', code: EX_STAMP, desc: '라디오 버튼으로 고른 모양을 클릭한 곳에 찍습니다. <code>Shape shape;</code> 변수에 <code>Ellipse</code> · <code>Rectangle</code> · <code>Polygon</code> 중 하나를 넣은 뒤, <code>Fill</code> · <code>Stroke</code> · <code>Opacity</code> 는 한 번에 설정합니다. 삼각형 <code>Polygon</code> 의 <code>Points</code> 는 도형 <b>자신의 왼쪽 위</b>를 (0, 0) 으로 한 좌표이고, 도형 전체의 위치는 다른 도형처럼 <code>Canvas.SetLeft</code> · <code>SetTop</code> 으로 정합니다. 클릭한 점이 도형의 가운데가 되도록 크기의 절반을 뺐습니다. 처음 화면이 비지 않도록 생성자에서 세 개를 미리 찍어 두었고, <b>모두 지우기</b>는 <code>board.Children.Clear()</code> 한 줄입니다.' },
          { type: 'callout', kind: 'info', title: 'Canvas 에 Background 를 꼭 주자', html: '<code>Canvas</code> 는 <code>Background</code> 가 없으면(기본값 <code>null</code>) 도형이 없는 빈 곳을 클릭해도 <b>마우스 이벤트가 오지 않습니다</b>. 아무 색도 보이지 않게 하고 싶다면 <code>Background="Transparent"</code> 를 주세요 — 투명하지만 클릭은 받습니다. 예제처럼 도형 위를 클릭해도 이벤트가 부모 <code>Canvas</code> 로 올라오므로(17장 버블링) 그 자리에 또 찍힙니다.' },

          { type: 'h', text: '변환 — 회전 · 크기 · 이동 (RenderTransform)' },
          { type: 'p', html: '도형을 비스듬히 기울이거나, 크게 만들거나, 뒤집고 싶을 때 좌표를 다시 계산할 필요가 없습니다. 모든 요소에는 <code>RenderTransform</code> 속성이 있어서, 여기에 <b>변환(transform)</b> 객체를 넣으면 WPF 가 <b>그릴 때만</b> 모양을 바꿔 줍니다. 원래의 <code>Canvas.Left</code> · <code>Width</code> 값과 레이아웃 속 자리는 그대로입니다.' },
          { type: 'figure', html: SVG_TRANSFORM, caption: 'RenderTransform 네 가지 — 기준점(빨간 점)에 따라 회전 결과가 달라진다' },
          { type: 'table', head: ['변환', '속성', '뜻'], rows: [
            ['<code>RotateTransform</code>', '<code>Angle</code>', '회전 각도(도). 양수 = 시계 방향'],
            ['<code>ScaleTransform</code>', '<code>ScaleX</code> · <code>ScaleY</code>', '배율. 1 = 그대로, 2 = 두 배, 0.5 = 절반, <b>-1 = 뒤집기</b>'],
            ['<code>TranslateTransform</code>', '<code>X</code> · <code>Y</code>', '그만큼 옮겨서 그리기'],
            ['<code>TransformGroup</code>', '<code>Children</code>', '여러 변환을 차례로 함께 적용'],
            ['(요소의 속성) <code>RenderTransformOrigin</code>', '<code>"0.5,0.5"</code>', '회전 · 크기의 <b>기준점</b>. 요소 크기의 비율, 기본 <code>"0,0"</code> = 왼쪽 위']
          ], caption: '자주 쓰는 변환' },
          { type: 'code', title: '예제 22-6. RenderTransform — 회전 · 기준점 · 크기 · 이동 · 뒤집기 · 묶음', code: EX_TRANSFORM, desc: '회색 점선은 변환하기 전의 원래 자리입니다. ② 와 ③ 은 똑같이 30도 회전했지만, ② 는 기준점이 기본값인 <b>왼쪽 위 모서리</b>라서 도형이 아래로 휘둘리듯 돌고, ③ 은 <code>RenderTransformOrigin="0.5,0.5"</code> 로 <b>가운데</b>를 기준으로 제자리에서 돕니다. ④ 도 가운데 기준이라 사방으로 커집니다. ⑤ 는 <code>TranslateTransform</code> 으로 옮겨 그렸지만 <code>Canvas.Left</code> 값은 여전히 20 입니다. ⑥ 은 <code>ScaleX="-1"</code> 로 오른쪽 화살표를 왼쪽으로 뒤집었고, ⑦ 은 <code>TransformGroup</code> 으로 1.2배 + 45도 회전을 함께 적용해 정사각형을 마름모로 만들었습니다. ⑧ 처럼 변환은 도형뿐 아니라 <code>TextBlock</code> · <code>Button</code> 같은 모든 요소에 쓸 수 있습니다.' },
          { type: 'p', html: '변환의 값을 코드에서 바꾸면 도형이 실시간으로 돌아가고 커집니다. 슬라이더(16장)와 연결해 직접 실험해 봅시다.' },
          { type: 'code', title: '예제 22-7. 변환 실험실 — 슬라이더로 회전 · 크기 · 투명도', code: EX_TLAB, desc: '세 슬라이더 모두 <code>Slider_ValueChanged</code> 하나를 함께 씁니다. 처리기를 XAML 이 아니라 생성자에서 <code>InitializeComponent()</code> <b>뒤에</b> 연결했는데, XAML 을 읽는 도중 <code>Value="30"</code> 이 설정되며 <code>ValueChanged</code> 가 발생할 때 아직 만들어지지 않은 <code>card</code> 를 건드리는 오류를 피하기 위해서입니다. <code>ApplyTransform</code> 은 값이 바뀔 때마다 <code>TransformGroup</code> 에 <code>ScaleTransform</code> 과 <code>RotateTransform</code> 을 새로 담아 <code>card.RenderTransform</code> 에 대입합니다. <code>Grid</code> 에 변환을 걸었으므로 안의 사각형과 글자가 함께 돕니다. 빨간 점은 기준점(카드의 가운데)입니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창과 실제 WPF 의 차이 — 변환', html: '<ul><li>실제 WPF 는 <code>RotateTransform rot = new RotateTransform(); box.RenderTransform = rot;</code> 로 한 번 넣어 두고 나중에 <code>rot.Angle = 45;</code> 만 바꿔도 화면이 따라 바뀝니다. 브라우저 실행 창에서는 변환 객체의 속성을 바꿔도 다시 그려지지 않으므로, 예제처럼 <b>새 변환 객체를 만들어 <code>RenderTransform</code> 에 대입</b>하세요(두 환경 모두 동작).</li><li><code>RotateTransform</code> · <code>ScaleTransform</code> 의 <code>CenterX</code> · <code>CenterY</code>(기준점을 픽셀로 지정)는 브라우저에서 무시됩니다. 기준점은 <code>RenderTransformOrigin</code> 으로 정하세요.</li><li><code>TransformGroup</code> 에서 <b>이동(Translate)과 회전을 섞으면</b> 브라우저에서는 적용 순서가 달라 결과가 다를 수 있습니다. 예제처럼 “같은 기준점의 크기 + 회전” 조합은 같게 보입니다. 이동이 섞인 묶음은 Visual Studio 에서 확인해 보세요.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — LayoutTransform', html: '<code>RenderTransform</code> 은 “그릴 때만” 바꾸므로 회전한 버튼이 옆 요소와 겹칠 수 있습니다. 실제 WPF 에는 <b>배치를 계산하기 전에</b> 변환하는 <code>LayoutTransform</code> 도 있어서, <code>StackPanel</code> 안의 버튼을 90도 돌리면 옆 요소들이 돌아간 크기에 맞춰 자리를 비켜 줍니다(세로로 쓴 탭 제목 등). 이 강좌의 브라우저 실행 창은 <code>LayoutTransform</code> 을 지원하지 않으니 Visual Studio 에서 <code>&lt;Button.LayoutTransform&gt;&lt;RotateTransform Angle="90"/&gt;&lt;/Button.LayoutTransform&gt;</code> 으로 비교해 보세요.' }
        ],
        practice: [
          {
            title: '실습 22-1. 신호등 만들기',
            level: 1,
            desc: '<p>어두운 둥근 사각형 몸체 위에 불 세 개가 있는 신호등을 완성하세요.</p><ul><li>XAML: 빨간 불과 같은 크기(70 × 70) · 같은 <code>Canvas.Left</code>(35)로 <b>노란 불</b> <code>yellowLight</code>(Top 115)와 <b>초록 불</b> <code>greenLight</code>(Top 205)를 추가합니다. 꺼진 불의 색은 <code>#555555</code>.</li><li><code>TurnOn(Ellipse light, Brush color, string name)</code> 메서드: 세 불을 모두 끈 뒤 <code>light</code> 만 <code>color</code> 로 칠하고, 오른쪽에 <code>지금: 빨강</code> 처럼 표시합니다.</li><li>버튼 세 개가 각각 빨강(<code>Red</code>) · 노랑(<code>Gold</code>) · 초록(<code>LimeGreen</code>)을 켜고, 처음에는 빨간 불이 켜져 있어야 합니다.</li></ul>',
            hint: '꺼진 색 브러시는 필드로 한 번 만들어 두고 함께 씁니다: <code>new SolidColorBrush(Color.FromRgb(0x55, 0x55, 0x55))</code>. 매개변수 형식이 <code>Ellipse</code> 이므로 <code>using System.Windows.Shapes;</code> 가 필요합니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 22-2. 과녁 맞히기 — 코드로 그리고 거리로 점수 매기기',
            level: 2,
            desc: '<p>300 × 300 <code>Canvas</code> 에 과녁을 <b>코드로</b> 그리고, 클릭한 곳의 점수를 매기세요.</p><ul><li><code>DrawTarget()</code>: <code>for</code> 문으로 반지름 150 · 120 · 90 · 60 · 30 인 원 5개를 <b>큰 것부터</b> 추가합니다. 색은 <code>Crimson</code> 과 <code>White</code> 를 번갈아, 테두리는 검정. 가운데는 (150, 150).</li><li>클릭하면 가운데까지의 거리 <code>d</code> 를 구해 30 이하 10점, 60 이하 8점, 90 이하 6점, 120 이하 4점, 150 이하 2점, 그 밖은 0점.</li><li>클릭한 곳에 지름 10 인 금색 점을 찍고, 총점과 <code>거리 57 → 8점</code> 을 표시합니다. <b>다시 하기</b>는 총점을 0 으로 하고 점을 지웁니다.</li></ul>',
            hint: '원의 왼쪽 위 = (가운데 − 반지름). 거리: <code>Math.Sqrt(dx * dx + dy * dy)</code>. 큰 원부터 추가해야 작은 원이 그 위에 보입니다. 점을 지우는 가장 쉬운 방법은 <code>DrawTarget()</code> 안에서 <code>Children.Clear()</code> 후 다시 그리는 것입니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>Canvas.Left="50" Canvas.Top="30" Width="100" Height="60"</code> 인 사각형의 <b>오른쪽 아래 모서리</b> 좌표는?', options: ['(100, 60)', '(150, 90)', '(50, 30)', '(150, 60)'], answer: 1, explain: '왼쪽 위가 (50, 30) 이고 오른쪽으로 100, 아래로 60 만큼이므로 (50 + 100, 30 + 60) = (150, 90) 입니다. Canvas 의 Y 는 아래로 커집니다.' },
          { q: '도형의 <b>테두리 선</b> 색을 정하는 속성은?', options: ['Fill', 'Background', 'Foreground', 'Stroke'], answer: 3, explain: '<code>Fill</code> 은 안쪽, <code>Stroke</code> 는 테두리 · 선입니다. 선의 두께는 <code>StrokeThickness</code>. <code>Line</code> 은 채울 안쪽이 없으므로 <code>Stroke</code> 가 없으면 보이지 않습니다.' },
          { q: '아래 코드를 실행했는데 원이 화면에 보이지 않는다. 빠진 것은?<pre><code>Ellipse c = new Ellipse { Width = 40, Height = 40, Fill = Brushes.Red };\nCanvas.SetLeft(c, 100);\nCanvas.SetTop(c, 50);</code></pre>', options: ['board.Children.Add(c); — Canvas 의 자식으로 넣기', 'c.Show();', 'InitializeComponent();', 'c.Visibility = true;'], answer: 0, explain: '도형은 만들고 위치를 정한 뒤 <b>패널의 <code>Children</code> 에 추가</b>해야 화면에 나타납니다. 만들기 → 위치 → 추가, 세 단계를 기억하세요.' },
          { q: '<code>Fill="#80FF0000"</code> 의 뜻은?', options: ['진한 빨강', '반투명 초록', '반투명 빨강 — 맨 앞 80 이 불투명도(약 50%)', '파랑'], answer: 2, explain: '<code>#AARRGGBB</code> 형식입니다. AA = 80(16진수, 약 50%), RR = FF(빨강 최대), GG = 00, BB = 00 → 반쯤 비치는 빨강.' },
          { q: '<code>RenderTransformOrigin="0.5,0.5"</code> 인 사각형에 <code>&lt;RotateTransform Angle="90"/&gt;</code> 을 주면?', options: ['왼쪽 위 모서리를 중심으로 돈다', '도형의 가운데를 중심으로 제자리에서 돈다', '창의 가운데를 중심으로 돈다', '회전하지 않고 옆으로 90 픽셀 이동한다'], answer: 1, explain: '<code>RenderTransformOrigin</code> 은 요소 크기에 대한 비율이며, (0.5, 0.5) 는 가운데입니다. 지정하지 않으면 기본값 (0, 0) = 왼쪽 위 모서리를 중심으로 돕니다.' }
        ],
        slides: [
          { layout: 'title', title: '도형과 브러시 · 변환', subtitle: 'Chapter 22 · Section 01 — WPF 로 그림 그리기', badge: '22-1',
            notes: '<p><b>[도입 2분]</b> 지난 시간 메모장까지 “컨트롤로 화면 만들기” 를 했다면, 오늘부터는 “그림 그리기” 입니다. 발문: “게임 화면이나 그래프는 버튼으로 만들 수 있을까?” → 도형(Shape)이 필요합니다.</p><p>이번 장의 끝(다음 시간)에는 움직이는 공과 반응 속도 게임까지 만든다고 예고하면 집중도가 올라갑니다.</p>' },
          { layout: 'diagram', title: 'Canvas 좌표와 도형', html: SVG_COORD, caption: '왼쪽 위 (0, 0), Y 는 아래로 — Left · Top = 왼쪽 위 모서리',
            notes: '<p><b>[4분]</b> 가장 많이 틀리는 두 가지를 먼저 짚습니다. ① Y 가 아래로 커진다(수학 좌표와 반대). ② <code>Canvas.Left/Top</code> 은 도형의 <b>가운데가 아니라 왼쪽 위 모서리</b>.</p><p>칠판에 사각형 하나를 그리고 “Left=50, Top=30, 100×60 이면 오른쪽 아래는?” 을 물어 퀴즈 1번을 미리 풀어 봅니다. Line 만 X1~Y2 로 위치를 정한다는 점도 강조.</p>' },
          { layout: 'table', title: '여섯 가지 기본 도형', head: ['도형', '위치 · 모양'], rows: [
            ['<code>Rectangle</code> · <code>Ellipse</code>', '<code>Canvas.Left/Top</code> + <code>Width/Height</code>'],
            ['<code>Line</code>', '<code>X1,Y1</code> → <code>X2,Y2</code>'],
            ['<code>Polyline</code>', '<code>Points</code> — 열린 선'],
            ['<code>Polygon</code>', '<code>Points</code> — 닫힌 도형(채우기)'],
            ['<code>Path</code>', '<code>Data="M L C A Z"</code> — 곡선 · 원호'],
            ['공통', '<code>Fill</code> · <code>Stroke</code> · <code>StrokeThickness</code> · <code>Opacity</code>']],
            lead: '모두 Shape 를 상속한 “요소” — 이름 · 이벤트 · 속성 변경 가능',
            notes: '<p><b>[3분]</b> Polyline vs Polygon 은 “닫히느냐” 하나만 다릅니다. Path 의 명령은 외우게 하지 말고 M(이동) · L(직선) · Z(닫기) 세 개만 확실히 — 곡선(C · Q · A)은 예제 22-2 로 보여 주기만 합니다.</p>' },
          { layout: 'code', title: '예제 22-1 · 22-2. 기본 도형 한눈에', code: SL_SHAPES, points: ['사각형 · 원: 왼쪽 위 + 크기', '<code>Polygon</code>: 꼭짓점 3개 → 삼각형', '<code>Line</code>: 두 점, <code>Stroke</code> 필수', '<code>Path</code>: <code>M</code> 에서 <code>C</code> 곡선'],
            notes: '<p><b>[5분]</b> 실행 후 숫자를 하나씩 바꿔 보게 합니다: 원의 Width 만 바꾸면 타원, 삼각형 점 하나 옮기기, Path 의 곡선 조절점 바꾸기.</p><p>본문 예제 22-1(둥근 사각형 · 점선)과 22-2(별 · 하트 · 반원 · 사인 곡선)도 실행해 보여 주세요. 사인 곡선은 Points 를 “모아서 한 번에” 넣는다는 점(브라우저 실행 창 제한)을 짚습니다.</p>' },
          { layout: 'bullets', title: '브러시 — 무엇으로 칠할까', lead: 'Fill · Stroke · Background 에 들어가는 값 = 브러시',
            bullets: ['색 이름 <code>Tomato</code> · <code>#RRGGBB</code> · <code>#AARRGGBB</code>(AA = 불투명도)', '코드: <code>new SolidColorBrush(Color.FromRgb(r, g, b))</code>', ['<code>Brushes.Red</code> 는 고정 → 바꿀 땐 새 브러시 대입'], '<code>LinearGradientBrush</code>: StartPoint → EndPoint (0~1 비율)', '<code>RadialGradientBrush</code>: 가운데서 바깥으로 — 입체 공', '<code>Opacity</code>: 요소 전체의 투명도 0 ~ 1'],
            notes: '<p><b>[3분]</b> 16진수 색은 “빨강 · 초록 · 파랑 두 자리씩” 이라고만 설명하고, 브라우저의 색 선택기나 VS 브러시 편집기로 값을 얻는 법을 보여 줍니다.</p><p>그라데이션의 좌표가 픽셀이 아니라 비율(0~1)이라는 것이 핵심 — 도형 크기가 바뀌어도 같은 모양으로 칠해집니다.</p>' },
          { layout: 'code', title: '예제 22-3. 단색 · 선형 · 원형 그라데이션', code: SL_BRUSH, points: ['<code>#3CB371</code> + <code>Opacity="0.7"</code>', '속성 요소 <code>&lt;Rectangle.Fill&gt;</code>', '<code>GradientStop</code> = 위치(Offset) · 색', '<code>GradientOrigin</code> 을 옮겨 입체감'],
            notes: '<p><b>[4분]</b> EndPoint 를 "1,0" → "0,1" → "1,1" 로 바꿔 방향이 가로 · 세로 · 대각선으로 바뀌는 것을 시연. GradientStop 을 하나 더 넣어 세 가지 색도 해 봅니다.</p><p>본문 예제 22-3 에서는 ⑥ 을 클릭하며 코드로 브러시를 만드는 장면을 보여 주세요(무작위 색 + 16진수 표시).</p>' },
          { layout: 'code', title: '예제 22-4 · 22-5. 코드로 도형 만들기', code: SL_CLICK, points: ['① <code>new Rectangle { … }</code>', '② <code>Canvas.SetLeft</code> · <code>SetTop</code>', '③ <code>board.Children.Add(r)</code>', '반복문으로 여러 개 · 클릭으로 하나씩'],
            notes: '<p><b>[6분]</b> 17장의 “클릭한 곳에 원” 복습입니다. 세 단계를 칠판에 적어 두세요. Children.Add 를 주석 처리하고 실행해 “아무것도 안 보인다” 를 직접 겪게 하면 퀴즈 3번이 쉬워집니다.</p><p>본문 예제 22-4(막대그래프)는 “위쪽 = 바닥 − 높이” 계산이 포인트, 22-5 는 Shape 공통 부모로 코드를 한 번에 쓰는 다형성(9장) 복습입니다.</p>' },
          { layout: 'diagram', title: '변환 — RenderTransform', html: SVG_TRANSFORM, caption: '회전 · 크기 · 이동 — 기준점은 RenderTransformOrigin',
            notes: '<p><b>[3분]</b> ① 과 ② 의 차이가 오늘 가장 중요한 그림입니다. 기준점을 안 주면 왼쪽 위 모서리를 축으로 “휘둘려” 돕니다. 대부분은 <code>RenderTransformOrigin="0.5,0.5"</code> 를 함께 씁니다.</p><p>RenderTransform 은 그릴 때만 바뀌므로 Canvas.Left 값은 그대로라는 점 — 게임에서 위치 계산은 Canvas.Left 로 해야 한다는 다음 시간 내용과도 연결됩니다.</p>' },
          { layout: 'code', title: '예제 22-7. 슬라이더로 회전', code: SL_ROTATE, points: ['<code>RenderTransformOrigin="0.5,0.5"</code>', '값이 바뀌면 <code>new RotateTransform(각도)</code>', '새 변환을 <b>통째로 대입</b>', '본문: 크기 · 투명도 · TransformGroup'],
            notes: '<p><b>[4분]</b> 슬라이더를 끌며 실시간으로 도는 것을 보여 주고, RenderTransformOrigin 을 지워 다시 실행해 차이를 비교합니다.</p><p>실제 WPF 는 변환 객체의 Angle 만 바꿔도 되지만, 브라우저 실행 창에서는 새로 만들어 대입해야 한다는 점을 안내(두 환경 모두 동작하는 방법). 본문 예제 22-6 에서 뒤집기(ScaleX=-1)와 TransformGroup 도 보여 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Left=50, Top=30, Width=100, Height=60 인 사각형의 오른쪽 아래 모서리는?', options: ['(100, 60)', '(150, 90)', '(50, 30)', '(150, 60)'], answer: 1, explain: '(50 + 100, 30 + 60) = (150, 90). Left · Top 은 왼쪽 위 모서리, Y 는 아래로 커집니다.',
            notes: '<p>정답 후 “이 사각형의 가운데는?” → (100, 60) 을 되물어, 클릭한 곳을 가운데로 만들 때 반만큼 빼는 이유와 연결합니다.</p>' },
          { layout: 'practice', title: '실습 22-1. 신호등 만들기', desc: '<p>노란 불 · 초록 불을 XAML 로 추가하고, <code>TurnOn(light, color, name)</code> 으로 “모두 끄고 하나만 켜기” 를 만드세요. 처음에는 빨간 불. 빨리 끝나면 실습 22-2(코드로 과녁 그리고 거리로 점수 매기기)로.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[8분]</b> 22-1 은 좌표 계산(Top 25 → 115 → 205, 90 간격)과 “모두 끄고 하나 켜기” 패턴이 핵심입니다. 21장 체크 메뉴의 “셋 중 하나만” 과 같은 패턴이라고 연결해 주세요.</p><p>22-2 흔한 실수: ① 작은 원부터 추가해 큰 원이 덮어 버림, ② 원 위치를 가운데 좌표로 줘서 과녁이 오른쪽 아래로 밀림(왼쪽 위 = 가운데 − 반지름).</p>' },
          { layout: 'summary', title: '정리', bullets: ['Canvas: 왼쪽 위 (0, 0), Y 는 아래로 · Left/Top = 왼쪽 위 모서리', '도형: Rectangle · Ellipse · Line · Polyline · Polygon · Path', '브러시: 색 이름 · <code>#AARRGGBB</code> · Linear/Radial 그라데이션 · <code>Opacity</code>', '코드로: <code>new</code> → <code>Canvas.SetLeft/SetTop</code> → <code>Children.Add</code>', '변환: Rotate · Scale · Translate + <code>RenderTransformOrigin</code>'],
            notes: '<p>다음 시간: 이 도형들을 <b>움직입니다</b> — 타이머로 시계 · 튕기는 공 · 방향키 게임, 그리고 애니메이션.</p>' }
        ]
      },
      /* ===================== ch22-2 ===================== */
      {
        id: 'ch22-2',
        title: '타이머와 애니메이션',
        minutes: 50,
        goals: [
          'DispatcherTimer 의 Interval · Tick · Start · Stop · IsEnabled 를 써서 시계와 스톱워치를 만들 수 있다',
          'while 반복과 Thread.Sleep 으로 화면을 움직이면 안 되는 이유를 설명할 수 있다',
          '위치 += 속도, 벽에서 속도 부호 바꾸기로 튕기는 공을 만들 수 있다',
          '입력 → 갱신 → 그리기 게임 루프에서 Keyboard.IsKeyDown 과 Rect.IntersectsWith 로 조작 · 충돌을 처리할 수 있다',
          'DoubleAnimation(From · To · Duration · AutoReverse · RepeatBehavior)과 XAML Storyboard 로 애니메이션을 만들 수 있다'
        ],
        flow: [['도입: 시간에 따라 바뀌는 화면', 3], ['DispatcherTimer · 시계 · 스톱워치', 10], ['공 튀기기 · 게임 루프', 12], ['DoubleAnimation · Storyboard', 10], ['미니 앱: 반응 속도 게임', 7], ['퀴즈 · 실습', 8]],
        content: [
          { type: 'h', text: '시간에 따라 스스로 바뀌는 화면 — 타이머' },
          { type: 'p', html: '지금까지 만든 프로그램은 사용자가 무언가를 해야(클릭 · 키 입력) 반응했습니다. 그런데 시계, 게임, 로딩 표시처럼 <b>아무것도 하지 않아도 시간이 지나면 저절로</b> 화면이 바뀌어야 하는 프로그램도 많습니다. 이때 쓰는 것이 <code>DispatcherTimer</code>(<code>System.Windows.Threading</code>)입니다. 정해 둔 간격(<code>Interval</code>)마다 <code>Tick</code> 이벤트를 보내 주는 “알람 시계” 라고 생각하면 됩니다.' },
          { type: 'p', html: '“1초마다 시각을 바꾸려면 <code>while (true)</code> 안에서 <code>Thread.Sleep(1000)</code> 하면 되지 않을까?” 콘솔에서는 되지만 WPF 에서는 <b>절대 안 됩니다</b>. WPF 는 <b>UI 스레드</b> 하나가 클릭 처리 · 화면 그리기 · 이벤트 처리를 모두 맡는데, 이 스레드가 반복문에 붙잡혀 있으면 화면을 다시 그리지도, 클릭을 받지도 못해 창이 “응답 없음” 으로 얼어붙습니다. <code>DispatcherTimer</code> 는 기다리는 동안 UI 스레드를 놓아 주고, 때가 되면 <code>Tick</code> 처리기를 <b>UI 스레드에서</b> 실행해 줍니다. 그래서 처리기 안에서 컨트롤을 바로 바꿔도 안전합니다.' },
          { type: 'figure', html: SVG_TIMER, caption: 'DispatcherTimer — Start() 뒤 Interval 마다 Tick, Stop() 하면 멈춤' },
          { type: 'table', head: ['멤버', '뜻', '예'], rows: [
            ['<code>Interval</code>', 'Tick 사이의 간격 (<code>TimeSpan</code>)', '<code>TimeSpan.FromSeconds(1)</code> · <code>TimeSpan.FromMilliseconds(20)</code>'],
            ['<code>Tick</code>', '간격마다 발생하는 이벤트 — 할 일을 여기에', '<code>timer.Tick += Timer_Tick;</code>'],
            ['<code>Start()</code> · <code>Stop()</code>', '시작 · 멈춤', '버튼으로 켜고 끄기'],
            ['<code>IsEnabled</code>', '지금 돌고 있는가 (<code>true</code> 로 바꾸면 시작)', '<code>timer.IsEnabled = !timer.IsEnabled;</code>'],
            ['Tick 처리기 모양', '<code>void 이름(object? sender, EventArgs e)</code>', 'EventHandler 형식 (11장)']
          ], caption: 'DispatcherTimer 의 주요 멤버 — using System.Windows.Threading;' },
          { type: 'code', title: '예제 22-8. 디지털 시계 — Interval · Tick · Start · Stop', code: EX_CLOCK, desc: '생성자에서 ① 간격 1초 ② <code>Tick</code> 처리기 연결 ③ <code>Start()</code> 세 줄로 타이머를 준비했습니다. 첫 <code>Tick</code> 은 1초 <b>뒤에</b> 오므로, 창이 뜨자마자 빈 화면이 보이지 않게 <code>ShowTime()</code> 을 한 번 직접 불렀습니다. <code>"yyyy년 M월 d일 dddd"</code> 는 날짜 서식(<code>dddd</code> = 요일 이름)이고, <code>ProgressBar</code> 에는 초(0~59)를 넣어 1분이 흘러가는 것을 보여 줍니다. <b>멈춤</b>을 누르면 <code>Stop()</code> 으로 Tick 이 더 이상 오지 않아 시각이 멈추고, <b>다시 시작</b>하면 이어서 갱신됩니다. <code>Closed += (s, e) =&gt; timer.Stop();</code> 은 창을 닫을 때 타이머도 멈추는 좋은 습관입니다(타이머는 창과 따로 살아 있을 수 있습니다).' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 타이머 만들기', html: '<ul><li><code>DispatcherTimer</code> 를 쓰고 빨간 물결선이 생기면 <kbd>Ctrl</kbd>+<kbd>.</kbd> → <b>using System.Windows.Threading;</b> 을 고르면 자동으로 추가됩니다.</li><li><code>timer.Tick +=</code> 까지 입력하고 <kbd>Tab</kbd> 을 누르면 <code>Timer_Tick</code> 처리기가 알맞은 모양(<code>object? sender, EventArgs e</code>)으로 만들어집니다.</li><li>Tick 처리기에 <b>중단점</b>(<kbd>F9</kbd>)을 걸면 Tick 마다 멈춥니다. 멈춰 있는 동안에는 시간이 흘러도 화면이 갱신되지 않으니, 확인이 끝나면 중단점을 지우고 <kbd>F5</kbd> 로 계속하세요.</li><li>WinForms 의 <code>Timer</code>, <code>System.Timers.Timer</code>, <code>System.Threading.Timer</code> 와 헷갈리지 마세요. 이들은 다른 스레드에서 이벤트를 보내므로 컨트롤을 바로 만지면 예외가 납니다. <b>WPF 화면에는 <code>DispatcherTimer</code></b> 입니다.</li></ul>' },
          { type: 'p', html: '타이머는 “화면을 자주 고치는” 일에는 좋지만, <b>시간을 정확히 재는</b> 일에는 맞지 않습니다. <code>Interval</code> 을 10 ms 로 해도 컴퓨터가 바쁘면 Tick 이 늦게 오기 때문에, Tick 횟수를 세어 시간을 계산하면 점점 틀려집니다. 시간 재기는 <code>System.Diagnostics.Stopwatch</code> 에 맡기고, 타이머는 그 값을 <b>보여 주기만</b> 하는 것이 정석입니다.' },
          { type: 'code', title: '예제 22-9. 스톱워치 — Stopwatch 로 재고, 타이머로 보여 주기', code: EX_STOPWATCH, desc: '<code>Stopwatch</code> 는 <code>Start()</code> · <code>Stop()</code> · <code>Reset()</code> · <code>Restart()</code> 와 흐른 시간 <code>Elapsed</code>(<code>TimeSpan</code>)를 가진 “진짜 초시계” 입니다. 30 ms 마다 오는 Tick 은 그 <code>Elapsed</code> 를 <code>분:초.백분의1초</code> 로 바꿔 보여 주기만 합니다. <b>시작 / 멈춤</b>은 한 버튼으로 번갈아 동작하고(<code>watch.IsRunning</code> 으로 판단), <b>랩</b>은 지금 기록을 목록 맨 위(<code>Insert(0, …)</code>)에 넣습니다. <code>{…,2}</code> 는 두 칸 오른쪽 정렬 서식입니다. 멈춘 동안에는 타이머도 멈춰 쓸데없는 화면 갱신을 하지 않습니다.' },
          { type: 'callout', kind: 'tip', title: 'Interval 은 얼마로?', html: '<ul><li><b>시계 · 카운트다운</b>: 1초 (<code>TimeSpan.FromSeconds(1)</code>)</li><li><b>숫자가 빨리 바뀌는 표시</b>(스톱워치): 30 ~ 50 ms</li><li><b>움직이는 그림</b>(게임 · 공): 16 ~ 20 ms — 1초에 50 ~ 60번이면 눈에 부드럽게 보입니다.</li><li>1 ms 처럼 너무 짧게 해도 더 부드러워지지 않고 컴퓨터만 바빠집니다.</li></ul>' },

          { type: 'h', text: '움직이는 공 — 게임 루프' },
          { type: 'p', html: '만화 영화는 조금씩 다른 그림을 빠르게 넘겨서 움직이는 것처럼 보이게 합니다. 화면의 공도 같습니다. Tick 이 올 때마다 공의 위치를 <b>속도만큼</b> 조금 옮겨 그리면(<code>x += vx;</code>) 부드럽게 움직이는 것처럼 보입니다. 여기서 속도 <code>vx</code> · <code>vy</code> 는 “Tick 한 번에 움직이는 픽셀 수” 이고, <b>부호</b>가 방향입니다(<code>vx</code> 가 음수면 왼쪽으로). 그래서 공이 벽에 닿았을 때 <b>그 방향 속도의 부호만 바꾸면</b> 튕겨 나옵니다.' },
          { type: 'p', html: '게임은 모두 이 구조를 반복합니다. Tick 마다 <b>① 입력</b>(키 · 마우스 상태 읽기) → <b>② 갱신</b>(위치 계산, 벽 · 충돌 검사, 점수) → <b>③ 그리기</b>(도형을 새 위치로). 이것을 <b>게임 루프(game loop)</b>라고 합니다.' },
          { type: 'figure', html: SVG_LOOP, caption: '게임 루프 — Tick 마다 입력 · 갱신 · 그리기, 벽에서는 속도의 부호를 바꾼다' },
          { type: 'code', title: '예제 22-10. 공 튀기기 — 위치 += 속도, 벽에서 부호 바꾸기', code: EX_BOUNCE, desc: '20 ms 마다 <code>Timer_Tick</code> 이 실행되어 공을 (4, 3) 만큼 옮깁니다. 공의 위치는 왼쪽 위 모서리이므로, 오른쪽 벽에 닿는 조건은 <code>x &gt; 판 너비 − 공 너비</code> 입니다. 벽을 넘었으면 먼저 공을 벽 안쪽(<code>0</code> 또는 <code>maxX</code>)으로 되돌린 뒤 속도의 부호를 바꿉니다 — 되돌리지 않으면 빠른 공이 벽 밖에서 부호만 계속 바뀌며 “벽에 붙는” 버그가 생깁니다. 위치를 <code>Canvas.GetLeft</code> 로 매번 읽지 않고 필드 <code>x</code> · <code>y</code> 에 들고 있는 것도 게임 코드의 기본입니다. <b>빠르게 · 느리게</b>는 속도에 1.5 를 곱하고 나누며, <b>멈춤</b>은 <code>IsEnabled</code> 를 뒤집습니다.' },
          { type: 'p', html: '17장에서는 <code>KeyDown</code> 이벤트로 방향키를 누를 때마다 공을 10 픽셀씩 옮겼습니다. 그런데 키를 <b>꾹 누르고 있으면</b> 처음에 한 번 움직이고, 잠깐 멈췄다가, 다시 드르륵 움직입니다(키 반복 지연). 게임에서는 누르고 있는 동안 <b>매 Tick 부드럽게</b> 움직여야 하므로, 게임 루프 안에서 <code>Keyboard.IsKeyDown(Key.Left)</code> 로 “지금 이 키가 눌려 있는가” 를 직접 확인합니다.' },
          { type: 'table', head: ['', '<code>KeyDown</code> 이벤트 (17장)', '<code>Keyboard.IsKeyDown(키)</code> (게임 루프)'], rows: [
            ['언제', '키를 <b>누른 순간</b> 한 번 (꾹 누르면 잠시 뒤 반복)', 'Tick 마다 — 지금 <b>눌려 있는 동안</b> 계속 true'],
            ['알맞은 곳', '일시 정지 · 다시 시작 · 메뉴 같은 <b>명령</b>', '이동 · 가속 같은 <b>연속 동작</b>'],
            ['여러 키 동시에', '한 번에 한 키씩 옴', '<code>←</code> + <code>↑</code> 를 함께 확인 → 대각선 이동'],
            ['쓰는 곳', 'XAML <code>KeyDown="Window_KeyDown"</code>', 'Tick 처리기 안의 <code>if</code>']
          ], caption: '키 입력 두 가지 — 게임은 보통 둘 다 쓴다' },
          { type: 'code', title: '예제 22-11. 동전 줍기 — 게임 루프 · Keyboard.IsKeyDown · 충돌 검사', code: EX_GAME, desc: '<code>GameLoop</code> 가 20 ms 마다 ① 네 방향키의 상태를 확인해 위치를 바꾸고(두 키를 함께 누르면 대각선), ② <code>Math.Clamp</code> 로 판 밖에 못 나가게 자른 뒤, 플레이어와 동전의 영역을 <code>Rect</code>(위치 + 크기)로 만들어 <code>IntersectsWith</code> 로 <b>겹치는지</b>(= 부딪혔는지) 검사합니다. 부딪히면 점수를 올리고 동전을 무작위 위치로 옮깁니다. ③ 마지막에 도형을 새 위치로 옮깁니다. 한 번씩만 일어나야 하는 <b>일시 정지(Space)</b>와 <b>처음부터(R)</b>는 창의 <code>KeyDown</code> 이벤트로 처리했습니다 — 두 가지 키 입력 방식을 알맞게 나눠 쓴 예입니다.' },
          { type: 'callout', kind: 'info', title: '키 입력이 안 먹을 때', html: '<ul><li><b>브라우저 실행 창</b>: 키 입력은 포커스가 있는 창으로 갑니다. 실행한 창을 <b>한 번 클릭</b>한 뒤 방향키를 누르세요. 창 밖(강의 페이지)에 포커스가 있으면 방향키가 페이지를 스크롤합니다.</li><li><b>실제 WPF</b>: 창에 버튼 · 목록 같은 컨트롤이 있고 그쪽에 포커스가 있으면, 방향키 · <kbd>Space</kbd> 가 “포커스 이동 · 버튼 누르기” 에 먼저 쓰여 창의 <code>KeyDown</code> 이 오지 않을 수 있습니다. 게임 화면에는 버튼을 두지 않거나, 창에 <code>PreviewKeyDown</code>(17장 터널링 — 컨트롤보다 먼저 받음)을 쓰세요. 예제 22-11 에 버튼이 없는 이유입니다.</li></ul>' },

          { type: 'h', text: '애니메이션 — DoubleAnimation' },
          { type: 'p', html: '타이머로 매번 값을 조금씩 바꾸는 일을, 목표가 정해져 있다면 WPF 에게 통째로 맡길 수 있습니다. “이 요소의 <code>Opacity</code> 를 <b>1 에서 0 까지 2초 동안</b> 바꿔 줘” 처럼 말하는 것이 <b>애니메이션(animation)</b>입니다. <code>double</code> 형식 속성(<code>Opacity</code>, <code>Width</code>, <code>Height</code>, <code>Canvas.Left</code>, <code>FontSize</code> …)은 <code>DoubleAnimation</code> 으로 움직이며, <code>요소.BeginAnimation(속성, 애니메이션)</code> 으로 시작합니다. 여기서 “속성” 은 속성의 이름표인 <b>의존 속성 식별자</b>(<code>UIElement.OpacityProperty</code>, <code>Canvas.LeftProperty</code> …)를 씁니다.' },
          { type: 'table', head: ['속성', '뜻', '예'], rows: [
            ['<code>From</code>', '시작 값 (생략하면 <b>지금 값</b>에서 출발)', '<code>From = 0</code>'],
            ['<code>To</code>', '끝 값', '<code>To = 420</code>'],
            ['<code>By</code>', '지금 값에서 얼마만큼 (To 대신)', '<code>By = 50</code>'],
            ['<code>Duration</code>', '걸리는 시간 (XAML <code>"0:0:2"</code> = 2초)', '<code>TimeSpan.FromSeconds(2)</code>'],
            ['<code>AutoReverse</code>', '끝까지 가면 거꾸로 되돌아오기 (시간은 두 배)', '<code>true</code>'],
            ['<code>RepeatBehavior</code>', '반복 — <code>RepeatBehavior.Forever</code> 영원히, <code>new RepeatBehavior(3)</code> 세 번', '<code>RepeatBehavior.Forever</code>'],
            ['<code>Completed</code> 이벤트', '애니메이션이 끝났을 때', '<code>anim.Completed += …;</code>']
          ], caption: 'DoubleAnimation 의 주요 멤버 — using System.Windows.Media.Animation;' },
          { type: 'code', title: '예제 22-12. DoubleAnimation — 반짝이는 글자 · 왕복하는 공 · 늘어나는 막대', code: EX_ANIM, desc: '계속 도는 애니메이션은 창이 화면에 나타난 뒤(<code>Loaded</code>) 시작했습니다. 글자는 <code>Opacity</code> 를 1 → 0.2 로 0.8초 동안 바꾸고 <code>AutoReverse</code> 로 되돌아오기를 <code>Forever</code> 반복해 반짝입니다. 공은 부착 속성 <code>Canvas.LeftProperty</code> 를 10 → 420 으로 왕복시킵니다 — 타이머 없이 한 줄로 움직임이 만들어집니다. 버튼의 애니메이션은 <code>From</code> 을 생략해 <b>지금 너비</b>에서 출발하므로, 늘리는 도중에 <b>줄이기</b>를 눌러도 튀지 않고 그 자리에서 방향을 바꿉니다. <code>Completed</code> 이벤트는 <code>BeginAnimation</code> <b>전에</b> 연결해야 합니다.' },
          { type: 'h', text: 'XAML 로 애니메이션 — Storyboard' },
          { type: 'p', html: '애니메이션 여러 개를 한 묶음으로 만든 것이 <b>Storyboard</b>(스토리보드, 영화의 장면 계획표)입니다. 각 애니메이션에 <code>Storyboard.TargetName</code>(어느 요소를)과 <code>Storyboard.TargetProperty</code>(어느 속성을)를 적고, <code>EventTrigger</code> 로 “창이 <code>Loaded</code> 되면 시작” 을 걸면 <b>코드 한 줄 없이</b> 시작 화면 효과를 만들 수 있습니다. 부착 속성은 <code>"(Canvas.Left)"</code> 처럼 괄호로 감쌉니다.' },
          { type: 'code', title: '예제 22-13. Storyboard — 창이 열릴 때 나타나는 시작 화면', code: EX_STORY, desc: 'Storyboard 를 <code>Window.Resources</code> 에 <code>x:Key="introStory"</code> 로 넣어 두고, <code>Window.Triggers</code> 의 <code>EventTrigger RoutedEvent="Window.Loaded"</code> 가 <code>BeginStoryboard</code> 로 시작합니다. 창이 뜨면 1초 동안 제목이 서서히 나타나고(<code>Opacity</code> 0 → 1), 공이 왼쪽 밖(-100)에서 가운데로 미끄러져 들어오고(<code>(Canvas.Left)</code>), 초록 막대가 0 에서 300 까지 차오릅니다. 세 애니메이션은 <b>동시에</b> 시작합니다. <b>다시 보기</b>는 <code>FindResource</code> 로 같은 Storyboard 를 꺼내 <code>Begin(this)</code> 로 다시 실행합니다(<code>this</code> = TargetName 을 찾을 범위).' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서 되는 애니메이션 · 안 되는 애니메이션', html: '<ul><li><b>됨</b>: <code>DoubleAnimation</code> 으로 <code>Opacity</code> · <code>Width</code> · <code>Height</code> · <code>Canvas.Left</code> · <code>Canvas.Top</code> · <code>FontSize</code> 바꾸기, <code>From</code> · <code>To</code> · <code>By</code> · <code>Duration</code> · <code>Completed</code>, 코드의 <code>AutoReverse = true</code> + <code>RepeatBehavior.Forever</code>, XAML Storyboard + <code>Loaded</code> 트리거.</li><li><b>다르게 동작</b>: 움직임이 항상 “천천히 시작해 천천히 멈추는” 곡선으로 보입니다(실제 WPF 기본은 일정한 속도). <code>AutoReverse</code> 를 <code>Forever</code> 없이 쓰거나 <code>new RepeatBehavior(3)</code> 처럼 횟수를 주면 브라우저에서는 한 번만 갑니다.</li><li><b>안 됨</b>: XAML 속성 <code>RepeatBehavior="Forever"</code> · <code>"3x"</code>(→ 코드에서 설정), <code>BeginTime</code>(늦게 시작), <code>EasingFunction</code>, 애니메이션 멈추기(<code>BeginAnimation(속성, null)</code> · <code>Storyboard.Stop</code>), <code>Loaded</code> 가 아닌 <code>EventTrigger</code>(예: <code>Button.Click</code>), 변환 · 색 애니메이션.</li><li>목표가 정해진 한 번짜리 효과는 애니메이션, 규칙에 따라 계속 바뀌는 움직임(게임 · 충돌)은 타이머 — 이렇게 나눠 쓰면 두 환경 모두에서 잘 동작합니다.</li></ul>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 해 보기 — 회전 · 색 · 튕기는 애니메이션', html: '<p>아래 기능은 실제 WPF 에서만 동작합니다. 새 WPF 프로젝트에 <code>Rectangle x:Name="box"</code> 하나를 놓고 <code>Loaded</code> 처리기에 붙여 넣어 실행해 보세요(<code>using System.Windows.Media;</code> · <code>using System.Windows.Media.Animation;</code> 필요).</p><pre><code>// ① 변환 애니메이션: 변환 객체의 의존 속성(AngleProperty)을 움직인다\nRotateTransform rot = new RotateTransform();\nbox.RenderTransform = rot;\nbox.RenderTransformOrigin = new Point(0.5, 0.5);\nrot.BeginAnimation(RotateTransform.AngleProperty,\n    new DoubleAnimation(0, 360, TimeSpan.FromSeconds(2)) { RepeatBehavior = RepeatBehavior.Forever });\n\n// ② 색 애니메이션: 새 SolidColorBrush 를 넣고 그 Color 를 움직인다\nSolidColorBrush brush = new SolidColorBrush(Colors.Tomato);\nbox.Fill = brush;\nbrush.BeginAnimation(SolidColorBrush.ColorProperty,\n    new ColorAnimation(Colors.RoyalBlue, TimeSpan.FromSeconds(1)) { AutoReverse = true, RepeatBehavior = RepeatBehavior.Forever });\n\n// ③ 가속 곡선: 떨어져서 통통 튀는 느낌\nDoubleAnimation drop = new DoubleAnimation(0, 200, TimeSpan.FromSeconds(1.5));\ndrop.EasingFunction = new BounceEase { Bounces = 3, EasingMode = EasingMode.EaseOut };\nbox.BeginAnimation(Canvas.TopProperty, drop);   // box 가 Canvas 안에 있을 때</code></pre><p>Visual Studio 와 함께 설치할 수 있는 <b>Blend for Visual Studio</b> 에는 Storyboard 를 타임라인에서 끌어서 만드는 편집기가 있습니다.</p>' },

          { type: 'h', text: '미니 앱 — 반응 속도 게임' },
          { type: 'p', html: 'WPF 파트의 마지막 예제로, 오늘 배운 도형 · 브러시 · 타이머를 모아 <b>반응 속도 게임</b>을 만듭니다. [시작]을 누르면 원이 빨갛게 “기다려…” 가 되고, <b>1.5 ~ 4초 뒤 무작위 순간</b>에 초록으로 바뀝니다. 그 순간부터 원을 클릭할 때까지 걸린 시간을 밀리초(ms)로 잽니다. 초록이 되기 전에 누르면 실패입니다.' },
          { type: 'list', items: [
            '<b>상태</b>: <code>enum GameState { Ready, Waiting, Go }</code> — 같은 클릭이라도 상태에 따라 뜻이 다르다(10장 enum · switch 사고방식)',
            '<b>한 번만 쓰는 타이머</b>: <code>Interval</code> 을 무작위로 정해 <code>Start()</code>, <code>Tick</code> 이 오면 바로 <code>Stop()</code> — “n초 뒤에 한 번” 을 만드는 방법',
            '<b>시간 재기</b>: 초록이 되는 순간 <code>Stopwatch.Restart()</code>, 클릭하는 순간 <code>ElapsedMilliseconds</code>',
            '<b>기록</b>: 목록 맨 위에 넣고, 가장 짧은 기록을 최고 기록으로'
          ] },
          { type: 'code', title: '예제 22-14. 미니 앱 — 반응 속도 게임', code: EX_REACTION, desc: '<code>BtnStart_Click</code> 은 상태를 <code>Waiting</code> 으로 바꾸고, <code>rand.Next(1500, 4000)</code> ms 뒤에 한 번 울릴 타이머를 켭니다. <code>DelayTimer_Tick</code> 은 첫 줄에서 곧바로 <code>Stop()</code> 해 한 번만 실행되게 하고, 원을 초록으로 바꾸며 초시계를 시작합니다. 원을 클릭하면 상태에 따라 “너무 빨라요!”(타이머 취소) 또는 기록 저장으로 갈라집니다. 원 위의 글자는 <code>IsHitTestVisible="False"</code> 라서 글자 위를 눌러도 클릭이 원으로 갑니다. 게임 중에는 [시작] 버튼을 꺼 두어(<code>IsEnabled = false</code>) 타이머가 겹쳐 켜지는 것을 막았습니다.' },
          { type: 'callout', kind: 'tip', title: '더 해 보기', html: '<ul><li>기록 5번의 <b>평균</b>을 표시해 보세요 (<code>List&lt;long&gt;</code> + <code>Average()</code>).</li><li>초록이 될 때 <code>DoubleAnimation</code> 으로 원의 <code>Opacity</code> 를 0.3 → 1 로 번쩍이게 해 보세요.</li><li>원 대신 판 위의 <b>무작위 위치</b>에 작은 원이 나타나게 하면 “순발력 + 조준” 게임이 됩니다(예제 22-11 의 <code>MoveCoin</code> 참고).</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 화면을 그릴 때마다: CompositionTarget.Rendering', html: '실제 WPF 에는 화면을 다시 그리기 직전마다(보통 1초에 60번) 발생하는 <code>CompositionTarget.Rendering</code> 이벤트가 있어서, 본격적인 게임은 <code>DispatcherTimer</code> 대신 이 이벤트로 게임 루프를 돌리기도 합니다. 이때는 Tick 간격이 일정하지 않으므로 <code>Stopwatch</code> 로 “지난 프레임부터 흐른 시간(dt)” 을 재서 <code>x += 속도 × dt</code> 로 움직입니다. 브라우저 실행 창은 이 이벤트를 지원하지 않으니 Visual Studio 에서 시험해 보세요.' }
        ],
        practice: [
          {
            title: '실습 22-3. 카운트다운 타이머',
            level: 1,
            desc: '<p>10초 카운트다운을 만드세요.</p><ul><li><code>DispatcherTimer</code> 필드와 남은 초 <code>remaining</code>(처음 10) 필드를 만들고, 생성자에서 간격 1초 · Tick 처리기 연결 · 창이 닫히면 멈추기.</li><li>Tick 마다 1 씩 줄여 큰 숫자와 <code>ProgressBar</code> 에 표시하고, 0 이 되면 타이머를 멈추고 <code>끝!</code> 표시 · 배경(<code>panel</code>)을 <code>LightCoral</code> 로.</li><li><b>시작</b> 버튼: 돌고 있으면 멈추고(글자 <code>계속</code>), 멈춰 있으면 시작(글자 <code>멈춤</code>). 이미 0 이면 10 으로 되돌린 뒤 시작.</li><li><b>처음으로</b>: 타이머를 멈추고 10 · 흰 배경 · 글자 <code>시작</code> 으로.</li></ul>',
            hint: '돌고 있는지는 <code>timer.IsEnabled</code>. 화면 갱신(<code>lblCount.Text</code> · <code>bar.Value</code>)과 되돌리기(10 · 흰 배경)는 메서드로 묶으면 여러 곳에서 다시 쓸 수 있습니다.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 22-4. 공 받기 게임',
            level: 3,
            desc: '<p>튕기는 공을 아래쪽 막대로 받아 내는 게임을 완성하세요. 뼈대에는 공이 네 벽에서 튕기는 코드가 이미 있습니다.</p><ul><li><b>TODO 1 — 입력</b>: 게임 루프에서 <kbd>←</kbd> <kbd>→</kbd> 가 눌려 있으면 막대를 <code>PaddleSpeed</code> 만큼 옮기고 판 밖으로 못 나가게 합니다.</li><li><b>TODO 2 — 충돌</b>: 공이 <b>내려오는 중</b>(<code>vy &gt; 0</code>)이고 막대와 겹치면 위로 튕기고, 공을 막대 위에 올려놓고, 점수를 1 올려 표시합니다. (도전: 받을 때마다 속도 5% 증가)</li><li><b>TODO 3 — 게임 끝</b>: 바닥에서 튕기는 코드를 지우고, 공이 바닥 아래로 떨어지면 타이머를 멈추고 <code>게임 끝! 점수 n — Space: 다시 시작</code> 을 표시합니다. (<kbd>Space</kbd> 로 다시 시작은 이미 있습니다.)</li></ul>',
            hint: '<code>Rect ballRect = new Rect(x, y, ball.Width, ball.Height);</code> · 막대는 <code>new Rect(paddleX, Canvas.GetTop(paddle), paddle.Width, paddle.Height)</code>, 겹침은 <code>ballRect.IntersectsWith(paddleRect)</code>. <code>vy &gt; 0</code> 조건이 없으면 막대에 닿은 채로 부호가 계속 바뀌어 공이 막대에 “붙어” 버립니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>timer.Interval = TimeSpan.FromMilliseconds(50);</code> 이면 Tick 은 1초에 약 몇 번 오는가?', options: ['5번', '20번', '50번', '1000번'], answer: 1, explain: '1초 = 1000 ms, 1000 ÷ 50 = 20번입니다. 컴퓨터가 바쁘면 조금 늦게 올 수 있으므로 “약” 20번입니다.' },
          { q: '버튼 Click 처리기에 아래 코드를 넣고 실행하면?<pre><code>while (true)\n{\n    lblTime.Text = DateTime.Now.ToString("HH:mm:ss");\n    Thread.Sleep(1000);\n}</code></pre>', options: ['창이 얼어붙어 “응답 없음” 이 된다', '1초마다 시각이 잘 바뀐다', '컴파일 오류가 난다', '타이머보다 정확한 시계가 된다'], answer: 0, explain: 'UI 스레드가 반복문에 붙잡혀 화면을 다시 그리지도, 클릭을 받지도 못합니다. 화면을 주기적으로 바꿀 때는 <code>DispatcherTimer</code> 를 씁니다.' },
          { q: '공 튀기기에서 공이 <b>오른쪽 벽</b>을 넘었을 때 해야 할 일로 알맞은 것은?', options: ['vy = -vy', 'x = 0; vx = 0;', '공을 벽 안쪽(x = maxX)으로 되돌리고 vx = -vx', 'timer.Interval 을 늘린다'], answer: 2, explain: '가로 방향 벽이므로 <b>가로 속도</b> <code>vx</code> 의 부호를 바꿉니다. 벽 안쪽으로 먼저 되돌려야 공이 벽에 붙어 떨리는 버그가 생기지 않습니다.' },
          { q: '방향키를 <b>누르고 있는 동안</b> 캐릭터가 끊김 없이 부드럽게 움직이게 하려면?', options: ['KeyDown 처리기에서 Thread.Sleep 을 쓴다', 'KeyUp 이벤트만 쓴다', '버튼의 Click 이벤트를 쓴다', '타이머 Tick 에서 Keyboard.IsKeyDown(Key.Left) 로 확인한다'], answer: 3, explain: '<code>KeyDown</code> 은 누른 순간 한 번(그 뒤 잠시 쉬었다 반복) 오므로 끊겨 보입니다. 게임 루프(Tick)에서 키 <b>상태</b>를 매번 확인하면 누르는 동안 매 Tick 움직이고, 여러 키도 함께 확인할 수 있습니다.' },
          { q: '<code>new DoubleAnimation { From = 0, To = 1, Duration = TimeSpan.FromSeconds(2), AutoReverse = true }</code> 로 <code>Opacity</code> 를 애니메이션하면 (실제 WPF 기준)?', options: ['2초 뒤 1 에서 끝난다', '4초 동안 0 → 1 → 0 으로 갔다가 되돌아온 뒤 끝난다', '1초 뒤 끝난다', '영원히 반복한다'], answer: 1, explain: '<code>AutoReverse</code> 는 끝까지 간 뒤 같은 시간 동안 되돌아옵니다(2초 + 2초). 영원히 반복하려면 <code>RepeatBehavior = RepeatBehavior.Forever</code> 를 더합니다.' }
        ],
        slides: [
          { layout: 'title', title: '타이머와 애니메이션', subtitle: 'Chapter 22 · Section 02 — 시간에 따라 움직이는 화면', badge: '22-2',
            notes: '<p><b>[도입 3분]</b> 발문: “지난 시간 만든 도형을 1초마다 옮기려면 어떻게 할까요?” 학생들이 while + Sleep 을 말하면 바로 실행해 창이 얼어붙는 것을 보여 줍니다(브라우저 실행 창은 탭을 새로 고쳐야 할 수 있으니 VS 에서 시연 권장).</p><p>오늘의 목표: 시계 → 튕기는 공 → 방향키 게임 → 애니메이션 → 반응 속도 게임. WPF 파트의 마지막 시간입니다.</p>' },
          { layout: 'diagram', title: 'DispatcherTimer 의 동작', html: SVG_TIMER, caption: 'Start() → Interval 마다 Tick → Stop()',
            notes: '<p><b>[3분]</b> “알람 시계” 비유: Interval = 알람 간격, Tick = 알람이 울리면 할 일. 기다리는 동안 UI 스레드는 자유롭기 때문에 창이 얼지 않습니다.</p><p>Tick 처리기는 UI 스레드에서 실행되므로 컨트롤을 바로 바꿔도 된다 — 다른 Timer 들(System.Timers 등)과의 차이를 짧게 언급.</p>' },
          { layout: 'code', title: '예제 22-8. 디지털 시계', code: SL_CLOCK, points: ['① <code>Interval</code> = 1초', '② <code>Tick +=</code> 처리기', '③ <code>Start()</code>', '처음 한 번 직접 호출 · 닫힐 때 <code>Stop()</code>'],
            notes: '<p><b>[4분]</b> <code>Timer_Tick(null, EventArgs.Empty)</code> 줄을 지우고 실행하면 1초 동안 빈 화면 → 왜 필요한지 체감. 본문 예제 22-8 은 날짜 · 초 막대 · 멈춤 버튼까지 있는 버전입니다.</p><p>이어서 예제 22-9(스톱워치): Tick 횟수로 시간을 세면 틀린다 → Stopwatch 로 재고 타이머는 보여 주기만. 실습 22-3(카운트다운)의 기초입니다.</p>' },
          { layout: 'bullets', title: '타이머 사용 규칙', lead: '화면을 주기적으로 바꿀 때는 DispatcherTimer',
            bullets: ['<code>while</code> + <code>Thread.Sleep</code> 은 창을 얼린다 ✗', 'Interval: 시계 1초 · 숫자 표시 30~50 ms · 움직임 16~20 ms', 'Tick 처리기는 <b>짧게</b> — 오래 걸리면 화면이 멈춘다', '시간 재기는 <code>Stopwatch</code>, 타이머는 보여 주기', '창을 닫으면 <code>timer.Stop()</code> (Closed 이벤트)'],
            notes: '<p><b>[3분]</b> 규칙을 칠판 한쪽에 적어 두고 실습 때 확인합니다. 1 ms 로 해도 더 부드러워지지 않는다는 점, 모니터가 1초에 60번 그리는 것과 연결해 설명하면 이해가 빠릅니다.</p>' },
          { layout: 'diagram', title: '게임 루프와 튕기기', html: SVG_LOOP, caption: 'Tick 마다 입력 → 갱신 → 그리기 · 벽에서는 속도 부호 반전',
            notes: '<p><b>[3분]</b> 만화 영화(플립북) 비유. 속도 = Tick 한 번에 움직이는 픽셀, 부호 = 방향. 벽이 “가로 벽인지 세로 벽인지” 에 따라 바꿀 속도가 다르다는 것을 그림으로 짚습니다(퀴즈 3번).</p>' },
          { layout: 'code', title: '예제 22-10. 공 튀기기', code: SL_BOUNCE, points: ['위치를 필드 <code>x</code> · <code>y</code> 로', '<code>x += vx;</code> — 갱신', '벽이면 <code>vx = -vx</code> / <code>vy = -vy</code>', '<code>Canvas.SetLeft</code> — 그리기'],
            notes: '<p><b>[5분]</b> 속도 값을 바꿔 보게 합니다(4,3 → 10,1). 너무 빠르게 하면 공이 벽에 붙어 떨리는 버그가 보일 수 있는데, 본문 예제 22-10 은 “벽 안으로 되돌린 뒤 부호 반전” 으로 해결한 버전이라고 비교해 줍니다.</p><p>발문: “오른쪽 벽 조건이 왜 board.Width 가 아니라 board.Width - ball.Width 일까?” → 위치가 왼쪽 위 모서리이므로.</p>' },
          { layout: 'code', title: '예제 22-11. 방향키 — Keyboard.IsKeyDown', code: SL_KEYS, points: ['Tick 마다 <b>지금 눌린</b> 키 확인', '두 키 함께 → 대각선 이동', '<code>Math.Clamp</code> 로 판 안에', '본문: 동전 · <code>IntersectsWith</code> · Space 일시 정지'],
            notes: '<p><b>[5분]</b> 17장의 KeyDown 버전과 나란히 실행해 꾹 눌렀을 때의 차이(끊김 vs 부드러움)를 비교시킵니다. 브라우저에서는 창을 한 번 클릭해야 키가 들어갑니다!</p><p>본문 예제 22-11 은 충돌 검사(Rect.IntersectsWith)와 “명령은 KeyDown, 이동은 IsKeyDown” 역할 분담을 보여 줍니다. 실습 22-4(공 받기)에 그대로 쓰입니다.</p>' },
          { layout: 'table', title: 'DoubleAnimation', head: ['속성', '뜻'], rows: [
            ['<code>From</code> · <code>To</code> · <code>By</code>', '시작 값 · 끝 값 · 변화량 (From 생략 = 지금 값)'],
            ['<code>Duration</code>', '걸리는 시간 (XAML <code>"0:0:2"</code>)'],
            ['<code>AutoReverse</code>', '되돌아오기 (시간 두 배)'],
            ['<code>RepeatBehavior</code>', '<code>Forever</code> · <code>new RepeatBehavior(3)</code>'],
            ['시작', '<code>요소.BeginAnimation(XxxProperty, 애니메이션)</code>']],
            lead: '“A 에서 B 까지 N초 동안” 은 WPF 에게 맡긴다',
            notes: '<p><b>[3분]</b> 타이머와 애니메이션의 역할 구분: 목표가 정해진 효과(페이드 · 슬라이드)는 애니메이션, 규칙에 따라 계속 바뀌는 움직임(게임)은 타이머.</p><p>OpacityProperty 같은 “의존 속성 식별자” 는 속성의 이름표라고만 설명합니다(18장 바인딩에서도 잠깐 봤음).</p>' },
          { layout: 'code', title: '예제 22-12. DoubleAnimation', code: SL_ANIM, points: ['<code>Loaded</code> 에서 시작', '<code>AutoReverse</code> + <code>Forever</code> = 반짝반짝', '<code>BeginAnimation(속성, 애니메이션)</code>', '버튼: 40 → 360 한 번'],
            notes: '<p><b>[4분]</b> Duration 을 0.8 → 0.2 로 바꿔 빠르게 깜빡이게 해 보고, 본문 예제 22-12 에서 “From 생략 = 지금 값에서 출발” 을 늘리기 도중 줄이기를 눌러 확인합니다.</p><p>브라우저 실행 창은 가속 곡선이 항상 부드럽게(ease-in-out) 보이고, 횟수 반복 · 멈추기 · 회전 애니메이션은 안 된다는 점을 안내 — VS 에서 해 볼 코드는 본문 callout 에 있습니다.</p>' },
          { layout: 'two', title: 'XAML Storyboard vs 코드 BeginAnimation', left: { title: 'XAML — 창이 열릴 때 자동으로', code: '<Window.Triggers>\n  <EventTrigger RoutedEvent="Window.Loaded">\n    <BeginStoryboard>\n      <Storyboard>\n        <DoubleAnimation\n            Storyboard.TargetName="lblTitle"\n            Storyboard.TargetProperty="Opacity"\n            From="0" To="1" Duration="0:0:1"/>\n      </Storyboard>\n    </BeginStoryboard>\n  </EventTrigger>\n</Window.Triggers>', run: false }, right: { title: '코드 — 원하는 순간에', code: 'DoubleAnimation a = new DoubleAnimation\n{\n    From = 0, To = 1,\n    Duration = TimeSpan.FromSeconds(1)\n};\nlblTitle.BeginAnimation(\n    UIElement.OpacityProperty, a);\n\n// 부착 속성: (Canvas.Left) ↔ Canvas.LeftProperty\nball.BeginAnimation(Canvas.LeftProperty,\n    new DoubleAnimation(0, 300, TimeSpan.FromSeconds(2)));', run: false },
            notes: '<p><b>[3분]</b> 같은 효과를 두 방식으로. XAML 은 “디자이너가 만들고 코드 없이”, 코드는 “조건 · 계산에 따라”. 본문 예제 22-13 은 Storyboard 를 리소스에 넣어 두고 [다시 보기]로 재사용하는 버전입니다.</p><p>XAML 에서 부착 속성은 괄호 <code>(Canvas.Left)</code> 로 쓴다는 점을 강조. 브라우저 실행 창에서는 XAML 의 <code>RepeatBehavior="Forever"</code> 가 안 되므로 반복은 코드로.</p>' },
          { layout: 'bullets', title: '미니 앱 — 반응 속도 게임 (예제 22-14)', lead: '도형 + 브러시 + 타이머 + Stopwatch',
            bullets: ['상태: <code>Ready</code> → <code>Waiting</code>(빨강) → <code>Go</code>(초록)', '한 번만 쓰는 타이머: 무작위 <code>Interval</code> → Tick 에서 바로 <code>Stop()</code>', '초록이 되는 순간 <code>watch.Restart()</code>', '클릭: Waiting 이면 “너무 빨라요!”, Go 면 <code>ElapsedMilliseconds</code>', '게임 중에는 [시작] 버튼 끄기 — 타이머 겹침 방지'],
            notes: '<p><b>[7분]</b> 먼저 몇 명에게 게임을 해 보게 하고(분위기 전환), 최고 기록을 칠판에 적습니다. 그다음 코드를 상태별로 따라갑니다.</p><p>발문: “Tick 에서 Stop() 을 안 하면?” → 2~3초마다 계속 초록으로 바뀌며 초시계가 다시 시작됨. “[시작]을 끄지 않으면?” → 타이머 Interval 이 도중에 바뀌어 예측 가능해짐.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '방향키를 누르고 있는 동안 캐릭터가 끊김 없이 움직이게 하려면?', options: ['KeyDown 에서 Thread.Sleep', 'KeyUp 이벤트만 쓴다', '버튼 Click 이벤트', 'Tick 에서 Keyboard.IsKeyDown(Key.Left) 확인'], answer: 3, explain: '게임 루프에서 키의 “상태” 를 매번 확인하면 누르는 동안 매 Tick 움직이고, 여러 키를 함께 확인할 수도 있습니다.',
            notes: '<p>정답 후 “그럼 Space 로 일시 정지는 어디서?” → KeyDown(한 번만 일어나야 하는 명령). 두 방식을 나눠 쓰는 것을 다시 확인합니다.</p>' },
          { layout: 'practice', title: '실습 22-3. 카운트다운 타이머', desc: '<p>10초 카운트다운: 간격 1초 타이머, Tick 마다 1 씩 줄여 숫자 · 막대 표시, 0 이면 멈추고 “끝!” + 빨간 배경. 시작/멈춤 한 버튼, 처음으로 버튼. 빨리 끝나면 실습 22-4(공 받기 게임)로.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[8분]</b> 22-3 흔한 실수: ① Tick 처리기를 연결만 하고 Start() 를 안 함, ② 0 에서 Stop() 을 빠뜨려 -1, -2 … 로 내려감, ③ 0 인 상태에서 시작을 누르면 바로 음수가 됨(→ Reset 후 시작).</p><p>22-4 는 도전 과제입니다. vy &gt; 0 조건을 빼면 공이 막대에 붙는 버그를 직접 보게 하고 이유를 설명하게 하면 좋습니다. 남은 학생은 과제로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>DispatcherTimer</code>: <code>Interval</code> · <code>Tick</code> · <code>Start/Stop</code> — while + Sleep 금지', '시간 재기는 <code>Stopwatch</code>, 타이머는 보여 주기 · 닫을 때 <code>Stop()</code>', '게임 루프: 입력(<code>Keyboard.IsKeyDown</code>) → 갱신(위치 += 속도, 충돌) → 그리기', '벽에서 튕기기 = 속도 부호 반전 · 겹침 = <code>Rect.IntersectsWith</code>', '<code>DoubleAnimation</code>: From · To · Duration · AutoReverse · RepeatBehavior, XAML Storyboard'],
            notes: '<p>WPF 파트를 마칩니다! 13장(첫 창)부터 22장(게임)까지 배운 것 — XAML · 레이아웃 · 컨트롤 · 이벤트 · 바인딩 · 스타일 · MVVM · 메뉴와 대화상자 · 그래픽 — 을 한 장에 정리해 보게 하세요. 다음부터는 이것들을 모아 프로젝트로 완성합니다.</p>' }
        ]
      }
    ]
  });
})();
