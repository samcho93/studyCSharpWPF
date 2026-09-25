/* Project 08. WPF 스톱워치 · 타이머 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;
  // 코드 상수는 String.raw 로 쓴다 — C# 의 @"mm\:ss" · "\n" 같은 역슬래시를 그대로 둘 수 있다

  /* ---------- 그림 1. 완성 화면 스케치 ---------- */
  const SVG_UI = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="스톱워치 탭: 큰 시간 표시, 상태, 시작 정지 랩 리셋 버튼, 최고 최저 랩이 강조된 랩 목록">
  <defs><marker id="ap8a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="20" width="620" height="520" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="62" y="54" style="font-size:20px;fill:var(--fg)">스톱워치 · 타이머</text>
  <text x="640" y="54" text-anchor="end" style="font-size:20px;fill:var(--muted)">—  ☐  ✕</text>
  <line x1="40" y1="70" x2="660" y2="70" stroke="var(--line)" stroke-width="2"/>
  <rect x="56" y="82" width="150" height="38" rx="4" fill="var(--accent)" opacity="0.18"/>
  <text x="70" y="108" style="font-size:20px;fill:var(--fg)">⏱ 스톱워치</text>
  <text x="228" y="108" style="font-size:20px;fill:var(--muted)">⏳ 타이머</text>
  <line x1="56" y1="120" x2="644" y2="120" stroke="var(--line)" stroke-width="2"/>
  <text x="350" y="196" text-anchor="middle" style="${MONO};font-size:64px;fill:var(--fg)">01:23.45</text>
  <text x="350" y="228" text-anchor="middle" style="font-size:19px;fill:var(--muted)">측정 중</text>
  <g style="font-size:19px;fill:var(--fg)" text-anchor="middle">
    <rect x="70" y="246" width="130" height="42" rx="6" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 5"/><text x="135" y="274" style="fill:var(--muted)">시작</text>
    <rect x="212" y="246" width="130" height="42" rx="6" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="277" y="274">정지</text>
    <rect x="354" y="246" width="130" height="42" rx="6" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="419" y="274">랩</text>
    <rect x="496" y="246" width="130" height="42" rx="6" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 5"/><text x="561" y="274" style="fill:var(--muted)">리셋</text>
  </g>
  <rect x="70" y="304" width="556" height="220" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
  <g style="${MONO};font-size:20px">
    <text x="86" y="338" style="fill:var(--muted)">번호   랩 시간    전체 시간</text>
    <text x="86" y="378" style="fill:var(--fg)">랩  4  00:21.07  01:20.11</text>
    <text x="86" y="416" style="fill:var(--danger);font-weight:700">랩  3  00:24.90  00:59.04  ▼</text>
    <text x="86" y="454" style="fill:var(--ok);font-weight:700">랩  2  00:15.72  00:34.14  ▲</text>
    <text x="86" y="492" style="fill:var(--fg)">랩  1  00:18.42  00:18.42</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="712" y1="100" x2="664" y2="100" marker-end="url(#ap8a)"/>
    <line x1="712" y1="178" x2="560" y2="178" marker-end="url(#ap8a)"/>
    <line x1="712" y1="268" x2="632" y2="268" marker-end="url(#ap8a)"/>
    <line x1="712" y1="416" x2="632" y2="416" marker-end="url(#ap8a)"/>
  </g>
  <text x="720" y="92" style="font-size:23px;font-weight:700;fill:var(--accent)">① TabControl</text>
  <text x="720" y="120" style="font-size:19px;fill:var(--muted)">스톱워치 / 타이머 두 화면을 탭으로</text>
  <text x="720" y="170" style="font-size:23px;font-weight:700;fill:var(--accent)">② 시간 표시 (TextBlock)</text>
  <text x="720" y="198" style="${MONO};font-size:19px;fill:var(--muted)">Stopwatch.Elapsed → "mm:ss.ff"</text>
  <text x="720" y="260" style="font-size:23px;font-weight:700;fill:var(--accent)">③ 버튼 4개 — IsEnabled</text>
  <text x="720" y="288" style="font-size:19px;fill:var(--muted)">지금 누를 수 없는 버튼은 꺼 둔다 (점선)</text>
  <text x="720" y="408" style="font-size:23px;font-weight:700;fill:var(--accent)">④ 랩 목록 (ListBox)</text>
  <text x="720" y="436" style="font-size:19px;fill:var(--muted)">최근 랩이 맨 위</text>
  <text x="720" y="466" style="font-size:19px;fill:var(--ok)">▲ 가장 빠른 랩 = 초록</text>
  <text x="720" y="494" style="font-size:19px;fill:var(--danger)">▼ 가장 느린 랩 = 빨강</text>
</svg>`;

  /* ---------- 그림 2. 상태 다이어그램 ---------- */
  const SVG_STATE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="스톱워치의 세 상태 준비, 측정 중, 일시 정지와 시작, 정지, 계속, 리셋, 랩 버튼에 따른 이동">
  <defs><marker id="ap8b" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="60" y="200" width="250" height="120" rx="60" fill="var(--card)" stroke="var(--muted)" stroke-width="4"/>
  <text x="185" y="252" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--fg)">준비</text>
  <text x="185" y="288" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">Elapsed = 0</text>
  <rect x="515" y="60" width="250" height="120" rx="60" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="640" y="112" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--ok)">측정 중</text>
  <text x="640" y="148" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">IsRunning = true</text>
  <rect x="515" y="360" width="250" height="120" rx="60" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="640" y="412" text-anchor="middle" style="font-size:28px;font-weight:700;fill:var(--warn)">일시 정지</text>
  <text x="640" y="448" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">멈춤 · Elapsed &gt; 0</text>
  <g stroke="var(--accent)" stroke-width="4" fill="none">
    <path d="M260,208 C330,120 420,110 505,118" marker-end="url(#ap8b)"/>
    <path d="M610,186 L610,352" marker-end="url(#ap8b)"/>
    <path d="M670,352 L670,186" marker-end="url(#ap8b)"/>
    <path d="M505,424 C420,430 330,410 262,316" marker-end="url(#ap8b)"/>
    <path d="M760,90 C850,40 860,160 772,140" marker-end="url(#ap8b)"/>
  </g>
  <text x="330" y="126" style="font-size:22px;font-weight:700;fill:var(--fg)">시작</text>
  <text x="596" y="276" text-anchor="end" style="font-size:22px;font-weight:700;fill:var(--fg)">정지</text>
  <text x="686" y="276" style="font-size:22px;font-weight:700;fill:var(--fg)">계속</text>
  <text x="330" y="440" style="font-size:22px;font-weight:700;fill:var(--fg)">리셋</text>
  <text x="850" y="96" style="font-size:22px;font-weight:700;fill:var(--fg)">랩 (상태 그대로 · 기록만 추가)</text>
  <rect x="880" y="220" width="370" height="250" rx="12" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="900" y="258" style="font-size:21px;font-weight:700;fill:var(--accent)">상태가 버튼을 정한다</text>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="900" y="298">준비: 시작 만</text>
    <text x="900" y="334">측정 중: 정지 · 랩</text>
    <text x="900" y="370">일시 정지: 계속 · 리셋</text>
    <text x="900" y="416" style="fill:var(--muted)">→ UpdateButtons() 한 곳에서</text>
    <text x="900" y="446" style="fill:var(--muted)">   IsEnabled 를 모두 결정</text>
  </g>
</svg>`;

  /* ---------- 그림 3. 틱과 실제 시간 ---------- */
  const SVG_TICK = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="DispatcherTimer 의 틱은 불규칙하게 늦게 오므로 틱을 세면 시간이 밀리고, Stopwatch 는 실제 시간을 정확히 잰다">
  <text x="40" y="50" style="font-size:24px;font-weight:700;fill:var(--accent)">DispatcherTimer — “대략 100 ms 마다” 불러 주는 알람</text>
  <line x1="60" y1="140" x2="1220" y2="140" stroke="var(--line)" stroke-width="3"/>
  <g style="font-size:18px;fill:var(--muted)" text-anchor="middle">
    <text x="100" y="180">0</text><text x="300" y="180">0.1초</text><text x="500" y="180">0.2초</text><text x="700" y="180">0.3초</text><text x="900" y="180">0.4초</text><text x="1100" y="180">0.5초</text>
  </g>
  <g stroke="var(--line)" stroke-width="2" stroke-dasharray="4 6">
    <line x1="300" y1="90" x2="300" y2="150"/><line x1="500" y1="90" x2="500" y2="150"/><line x1="700" y1="90" x2="700" y2="150"/><line x1="900" y1="90" x2="900" y2="150"/><line x1="1100" y1="90" x2="1100" y2="150"/>
  </g>
  <g fill="var(--warn)">
    <circle cx="318" cy="140" r="11"/><circle cx="540" cy="140" r="11"/><circle cx="752" cy="140" r="11"/><circle cx="981" cy="140" r="11"/><circle cx="1196" cy="140" r="11"/>
  </g>
  <g style="font-size:18px;fill:var(--warn)" text-anchor="middle">
    <text x="318" y="112">Tick</text><text x="540" y="112">Tick</text><text x="752" y="112">Tick</text><text x="981" y="112">Tick</text><text x="1196" y="112">Tick</text>
  </g>
  <text x="40" y="236" style="font-size:21px;fill:var(--fg)">틱이 올 때마다 조금씩 늦는다 (다른 일 처리 · 화면 그리기 · 창 이동 …)</text>
  <text x="40" y="270" style="font-size:21px;fill:var(--danger)">✗ 틱 5번 × 0.1초 = 0.5초 라고 세면 → 실제로는 0.55초. 오래 켤수록 오차가 쌓인다</text>
  <line x1="40" y1="300" x2="1240" y2="300" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="40" y="350" style="font-size:24px;font-weight:700;fill:var(--ok)">Stopwatch — 시작한 순간부터 흐른 시간을 정확히</text>
  <rect x="100" y="380" width="1096" height="30" rx="6" fill="var(--ok)" opacity="0.25"/>
  <text x="648" y="402" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">sw.Elapsed — 언제 물어도 “지금까지 흐른 실제 시간”</text>
  <text x="40" y="464" style="font-size:21px;fill:var(--fg)">✓ 역할 나누기: <tspan font-weight="700" fill="var(--warn)">Tick = “화면을 다시 그려라” 신호</tspan>,  <tspan font-weight="700" fill="var(--ok)">시간 값 = Stopwatch 에게 묻는다</tspan></text>
  <text x="40" y="500" style="font-size:19px;fill:var(--muted)">그래서 틱이 조금 늦거나 한두 번 빠져도 표시되는 시간은 항상 정확하다</text>
</svg>`;

  /* ---------- 그림 4. 카운트다운 계산 ---------- */
  const SVG_COUNT = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="남은 시간은 설정 시간에서 흐른 시간을 뺀 값, 진행률은 흐른 시간을 설정 시간으로 나눈 값">
  <text x="40" y="50" style="font-size:24px;font-weight:700;fill:var(--accent)">카운트다운 = 스톱워치 + 빼기</text>
  <rect x="100" y="100" width="1080" height="60" rx="8" fill="none" stroke="var(--line)" stroke-width="3"/>
  <rect x="100" y="100" width="700" height="60" rx="8" fill="var(--accent)" opacity="0.28"/>
  <text x="450" y="138" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">흐른 시간 cdWatch.Elapsed</text>
  <text x="990" y="138" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">남은 시간 remain</text>
  <line x1="100" y1="200" x2="1180" y2="200" stroke="var(--muted)" stroke-width="3"/>
  <line x1="100" y1="186" x2="100" y2="214" stroke="var(--muted)" stroke-width="3"/>
  <line x1="1180" y1="186" x2="1180" y2="214" stroke="var(--muted)" stroke-width="3"/>
  <text x="640" y="238" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--muted)">설정한 시간 duration (예: 3분)</text>
  <g style="${MONO};font-size:22px;fill:var(--fg)">
    <text x="100" y="310">remain   = duration − cdWatch.Elapsed</text>
    <text x="100" y="352">진행률 %  = cdWatch.Elapsed ÷ duration × 100   → ProgressBar.Value</text>
    <text x="100" y="394">remain ≤ 0 → 타이머 멈춤 · 100% · MessageBox “시간 종료”</text>
  </g>
  <text x="100" y="450" style="font-size:20px;fill:var(--muted)">일시 정지 = cdWatch.Stop() — 흐른 시간이 멈추므로 남은 시간도 저절로 멈춘다</text>
</svg>`;

  /* ---------- 그림 5. MVVM 으로 나누기 ---------- */
  const SVG_MVVM = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="View 는 바인딩과 명령으로 StopwatchViewModel 을 쓰고, ViewModel 이 Stopwatch 와 DispatcherTimer 를 가진다">
  <defs>
    <marker id="ap8c" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ap8d" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <rect x="40" y="40" width="400" height="420" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="240" y="90" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent)">View (XAML)</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="66" y="150">Text="{Binding Display}"</text>
    <text x="66" y="200">Command="{Binding StartCommand}"</text>
    <text x="66" y="250">Command="{Binding LapCommand}"</text>
    <text x="66" y="300">ItemsSource="{Binding Laps}"</text>
  </g>
  <text x="66" y="380" style="font-size:19px;fill:var(--muted)">코드 비하인드: DataContext 한 줄</text>
  <rect x="840" y="40" width="400" height="420" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1040" y="90" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--ok)">StopwatchViewModel</text>
  <g style="${MONO};font-size:18px;fill:var(--fg)">
    <text x="866" y="150">string Display</text>
    <text x="866" y="200">ICommand Start/Stop/Lap/Reset</text>
    <text x="866" y="250">ObservableCollection Laps</text>
    <text x="866" y="320" style="fill:var(--muted)">private Stopwatch sw</text>
    <text x="866" y="360" style="fill:var(--muted)">private DispatcherTimer timer</text>
  </g>
  <text x="866" y="420" style="font-size:19px;fill:var(--muted)">컨트롤 이름을 전혀 모른다</text>
  <line x1="450" y1="190" x2="830" y2="190" stroke="var(--accent)" stroke-width="4" marker-end="url(#ap8c)"/>
  <text x="640" y="176" text-anchor="middle" style="font-size:20px;fill:var(--fg)">명령 실행 (버튼 클릭)</text>
  <line x1="830" y1="300" x2="450" y2="300" stroke="var(--ok)" stroke-width="4" marker-end="url(#ap8d)"/>
  <text x="640" y="286" text-anchor="middle" style="font-size:20px;fill:var(--fg)">PropertyChanged (틱마다 Display)</text>
  <text x="640" y="336" text-anchor="middle" style="font-size:20px;fill:var(--fg)">CanExecute → 버튼 켜기 · 끄기</text>
</svg>`;

  /* ======================= p08-1 예제 코드 ======================= */
  const EX_TICK = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08Prep1.MainWindow"
        ${NS}
        Title="DispatcherTimer 와 Stopwatch" Width="440" Height="320">
    <StackPanel Margin="16">
        <TextBlock Text="① 틱 횟수 × 0.1초 (틱을 세어서 계산한 시간)" FontSize="14"/>
        <TextBlock x:Name="lblTicks" Text="0.0초" FontSize="30" FontFamily="Consolas" Margin="0,2,0,10"/>
        <TextBlock Text="② Stopwatch.Elapsed (실제로 흐른 시간)" FontSize="14"/>
        <TextBlock x:Name="lblWatch" Text="0.0초" FontSize="30" FontFamily="Consolas"
                   Foreground="SteelBlue" Margin="0,2,0,10"/>
        <TextBlock x:Name="lblDiff" Text="차이: 0.000초" FontSize="14" Foreground="Gray"/>
        <Button x:Name="btnToggle" Content="멈춤" Width="100" Height="30" Margin="0,14,0,0"
                HorizontalAlignment="Left" Click="BtnToggle_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;          // Stopwatch
using System.Windows;
using System.Windows.Threading;    // DispatcherTimer

namespace P08Prep1
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();   // 알람: 주기적으로 Tick 을 보낸다
        private readonly Stopwatch watch = new Stopwatch();               // 초시계: 흐른 시간을 잰다
        private int ticks = 0;                                            // Tick 이 온 횟수

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(100);   // 0.1초마다 (대략!)
            timer.Tick += Timer_Tick;                           // 때가 되면 부를 메서드 연결
            timer.Start();
            watch.Start();
        }

        // UI 스레드에서 불리므로 컨트롤을 바로 바꿔도 된다
        private void Timer_Tick(object? sender, EventArgs e)
        {
            ticks++;
            double byTicks = ticks * 0.1;                  // 틱을 세어서 계산한 시간
            double real = watch.Elapsed.TotalSeconds;      // 실제로 흐른 시간
            lblTicks.Text = $"{byTicks:F1}초";
            lblWatch.Text = $"{real:F1}초";
            lblDiff.Text = $"차이: {real - byTicks:F3}초  (틱 {ticks}번)";
        }

        private void BtnToggle_Click(object sender, RoutedEventArgs e)
        {
            if (timer.IsEnabled)          // 돌고 있으면 멈춘다
            {
                timer.Stop();
                watch.Stop();
                btnToggle.Content = "계속";
            }
            else
            {
                timer.Start();
                watch.Start();            // Stopwatch 는 멈춘 시간부터 이어서 잰다
                btnToggle.Content = "멈춤";
            }
        }
    }
}`;

  const EX_TIMESPAN = String.raw`using System;

class Program
{
    static void Main()
    {
        TimeSpan t = TimeSpan.FromMilliseconds(83456);        // 1분 23.456초

        Console.WriteLine(t);                                  // 기본 형식 (시:분:초.소수 7자리)
        Console.WriteLine($"{t.Minutes}분 {t.Seconds}초 {t.Milliseconds}밀리초");
        Console.WriteLine($"전체 초: {t.TotalSeconds}");
        Console.WriteLine(t.ToString(@"mm\:ss\.ff"));          // 스톱워치 형식 — ff 는 버림
        Console.WriteLine(t.ToString(@"m\:ss"));

        TimeSpan lap1 = TimeSpan.FromMilliseconds(12340);     // 12.34초
        TimeSpan lap2 = TimeSpan.FromMilliseconds(9870);      // 9.87초
        TimeSpan total = lap1 + lap2;                          // 더하기 · 빼기 · 비교가 된다
        Console.WriteLine("합계 " + total.ToString(@"mm\:ss\.ff") + ", 차이 " + (lap1 - lap2).ToString(@"mm\:ss\.ff"));
        Console.WriteLine(lap2 < lap1 ? "랩 2 가 더 빠르다" : "랩 1 이 더 빠르다");

        TimeSpan big = new TimeSpan(1, 5, 30);                 // 1시간 5분 30초
        Console.WriteLine(big.ToString(@"mm\:ss"));            // 시간(1)이 사라진다!
        Console.WriteLine($"{(int)big.TotalMinutes}:{big.Seconds:00}");   // 전체 분으로 쓰기
    }
}`;

  /* ======================= p08-1 실습 ======================= */
  const P1_STARTER = String.raw`using System;

class Program
{
    // 1시간 미만: "mm:ss.ff" (예: 05:43.21), 1시간 이상: "h:mm:ss.ff" (예: 1:02:03.45)
    static string Format(TimeSpan t)
    {
        // TODO 1: t.TotalHours 로 나누어 알맞은 서식으로 바꾸기
        return "";
    }

    // 카운트다운용: 초 단위로 "올림" 한 뒤 "mm:ss" (예: 2.3초 남음 → 00:03), 음수는 00:00
    static string FormatCountdown(TimeSpan remain)
    {
        // TODO 2: 음수면 TimeSpan.Zero 로
        // TODO 3: Math.Ceiling(remain.TotalSeconds) 로 올림한 뒤 서식 적용
        return "";
    }

    static void Main()
    {
        Console.WriteLine(Format(TimeSpan.FromMilliseconds(5678)));
        Console.WriteLine(Format(TimeSpan.FromMilliseconds(754321)));
        Console.WriteLine(Format(new TimeSpan(0, 1, 2, 3, 450)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(179.2)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(0.3)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(-1)));
    }
}`;

  const P1_SOLUTION = String.raw`using System;

class Program
{
    // 1시간 미만: "mm:ss.ff" (예: 05:43.21), 1시간 이상: "h:mm:ss.ff" (예: 1:02:03.45)
    static string Format(TimeSpan t)
    {
        if (t.TotalHours >= 1) return t.ToString(@"h\:mm\:ss\.ff");
        return t.ToString(@"mm\:ss\.ff");
    }

    // 카운트다운용: 초 단위로 "올림" 한 뒤 "mm:ss" (예: 2.3초 남음 → 00:03), 음수는 00:00
    static string FormatCountdown(TimeSpan remain)
    {
        if (remain < TimeSpan.Zero) remain = TimeSpan.Zero;
        TimeSpan up = TimeSpan.FromSeconds(Math.Ceiling(remain.TotalSeconds));
        return up.ToString(@"mm\:ss");
    }

    static void Main()
    {
        Console.WriteLine(Format(TimeSpan.FromMilliseconds(5678)));
        Console.WriteLine(Format(TimeSpan.FromMilliseconds(754321)));
        Console.WriteLine(Format(new TimeSpan(0, 1, 2, 3, 450)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(179.2)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(0.3)));
        Console.WriteLine(FormatCountdown(TimeSpan.FromSeconds(-1)));
    }
}`;

  const CLOCK_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08PracClock.MainWindow"
        ${NS}
        Title="디지털 시계" Width="380" Height="240">
    <StackPanel Margin="16" HorizontalAlignment="Center">
        <TextBlock x:Name="lblTime" Text="--:--:--" FontSize="48" FontFamily="Consolas"
                   HorizontalAlignment="Center"/>
        <TextBlock x:Name="lblDate" Text="" FontSize="16" Foreground="Gray"
                   HorizontalAlignment="Center" Margin="0,4,0,12"/>
        <CheckBox x:Name="chkSeconds" Content="초 표시" IsChecked="True"
                  HorizontalAlignment="Center" Click="ChkSeconds_Click"/>
    </StackPanel>
</Window>`;

  const P2_STARTER = String.raw`${CLOCK_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Threading;

namespace P08PracClock
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            // TODO 1: timer.Interval 을 0.2초로 정하고, Tick 에 Timer_Tick 을 연결한 뒤 시작
            // TODO 2: 처음 화면도 바로 채우도록 UpdateClock() 호출
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            // TODO 3: UpdateClock() 호출
        }

        private void ChkSeconds_Click(object sender, RoutedEventArgs e)
        {
            UpdateClock();   // 체크를 바꾸면 곧바로 반영
        }

        private void UpdateClock()
        {
            DateTime now = DateTime.Now;
            // TODO 4: 초 표시가 켜져 있으면 "HH:mm:ss", 꺼져 있으면 "HH:mm" 로 lblTime 에 표시
            // TODO 5: lblDate 에 "yyyy-MM-dd (ddd)" 형식으로 날짜 표시
        }
    }
}`;

  const P2_SOLUTION = String.raw`${CLOCK_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Threading;

namespace P08PracClock
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(200);   // 1초보다 짧게 → 초가 바뀌는 순간을 놓치지 않는다
            timer.Tick += Timer_Tick;
            timer.Start();
            UpdateClock();                                     // 첫 Tick 전에도 시각이 보이게
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            UpdateClock();
        }

        private void ChkSeconds_Click(object sender, RoutedEventArgs e)
        {
            UpdateClock();
        }

        private void UpdateClock()
        {
            DateTime now = DateTime.Now;
            lblTime.Text = chkSeconds.IsChecked == true ? now.ToString("HH:mm:ss") : now.ToString("HH:mm");
            lblDate.Text = now.ToString("yyyy-MM-dd (ddd)");
        }
    }
}`;

  /* ======================= p08-1 슬라이드용 짧은 코드 ======================= */
  const SL_TICK = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideTick.MainWindow"
        ${NS}
        Title="DispatcherTimer" Width="380" Height="200">
    <StackPanel Margin="16">
        <TextBlock x:Name="lblTicks" FontSize="22" Text="틱 0번"/>
        <TextBlock x:Name="lblWatch" FontSize="22" FontFamily="Consolas" Text="실제 0.00초"/></StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Diagnostics; using System.Windows; using System.Windows.Threading;
namespace P08SlideTick
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly Stopwatch watch = Stopwatch.StartNew();   // 만들면서 바로 시작
        private int ticks = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(100);
            timer.Tick += (s, e) => { ticks++; lblTicks.Text = $"틱 {ticks}번 → {ticks * 0.1:F1}초?";
                                      lblWatch.Text = $"실제 {watch.Elapsed.TotalSeconds:F2}초"; };
            timer.Start();
        }
    }
}`;

  const SL_TIMESPAN = String.raw`using System;
class Program
{
    static void Main()
    {
        TimeSpan t = TimeSpan.FromMilliseconds(83456);
        Console.WriteLine(t);                            // 00:01:23.4560000
        Console.WriteLine(t.ToString(@"mm\:ss\.ff"));    // 01:23.45
        Console.WriteLine(t.TotalSeconds);               // 83.456
        TimeSpan big = new TimeSpan(1, 5, 30);
        Console.WriteLine(big.ToString(@"mm\:ss"));      // 05:30 (시간이 사라짐)
        Console.WriteLine($"{(int)big.TotalMinutes}:{big.Seconds:00}");   // 65:30
    }
}`;

  /* ======================= p08-2 예제 코드 ======================= */
  const SW_XAML = (ns, title, lapClick) => String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="${title}" Width="440" Height="400">
    <DockPanel Margin="14">
        <!-- ① 큰 시간 표시 -->
        <TextBlock x:Name="lblTime" DockPanel.Dock="Top" Text="00:00.00" FontSize="56"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <TextBlock x:Name="lblState" DockPanel.Dock="Top" Text="준비" Foreground="Gray"
                   HorizontalAlignment="Center"/>
        <!-- ② 버튼 4개: UniformGrid 로 같은 너비 -->
        <UniformGrid DockPanel.Dock="Top" Columns="4" Margin="0,10,0,10">
            <Button x:Name="btnStart" Content="시작" Height="36" Margin="3" Click="BtnStart_Click"/>
            <Button x:Name="btnStop" Content="정지" Height="36" Margin="3" Click="BtnStop_Click"/>
            <Button x:Name="btnLap" Content="랩" Height="36" Margin="3"${lapClick ? ' Click="BtnLap_Click"' : ''}/>
            <Button x:Name="btnReset" Content="리셋" Height="36" Margin="3" Click="BtnReset_Click"/>
        </UniformGrid>
        <!-- ③ 랩 목록: 마지막 자식 = 남은 공간 전부 -->
        <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="15"/>
    </DockPanel>
</Window>`;

  const EX_STEP1 = String.raw`${SW_XAML('P08Step1', '스톱워치 — 단계 1', false)}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08Step1
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();                  // 시간 재기 담당
        private readonly DispatcherTimer timer = new DispatcherTimer();   // 화면 갱신 담당

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);   // 1초에 약 33번 화면을 새로 그림
            timer.Tick += Timer_Tick;
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            ShowTime();
        }

        private void ShowTime()
        {
            lblTime.Text = sw.Elapsed.ToString(@"mm\:ss\.ff");
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            sw.Start();        // 멈춘 곳부터 이어서 잰다
            timer.Start();     // 화면 갱신 시작
            lblState.Text = "측정 중";
        }

        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            sw.Stop();
            timer.Stop();
            ShowTime();        // 멈춘 순간의 시간을 정확히 한 번 더 표시
            lblState.Text = "일시 정지";
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();        // 멈추고 0 으로
            timer.Stop();
            ShowTime();
            lblState.Text = "준비";
        }
    }
}`;

  const EX_STEP2 = String.raw`${SW_XAML('P08Step2', '스톱워치 — 단계 2 (버튼 상태)', false)}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08Step2
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += Timer_Tick;
            UpdateButtons();                   // 처음 상태(준비)에 맞춰 버튼 켜고 끄기
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            lblTime.Text = Format(sw.Elapsed);
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            sw.Start();
            timer.Start();
            UpdateButtons();
        }

        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            sw.Stop();
            timer.Stop();
            lblTime.Text = Format(sw.Elapsed);
            UpdateButtons();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();
            lblTime.Text = Format(TimeSpan.Zero);
            UpdateButtons();
        }

        // 상태 → 버튼. 상태가 바뀔 때마다 이 메서드 "하나만" 부른다
        private void UpdateButtons()
        {
            bool running = sw.IsRunning;                   // 측정 중인가?
            bool hasTime = sw.Elapsed > TimeSpan.Zero;     // 잰 시간이 있는가?

            btnStart.IsEnabled = !running;
            btnStart.Content = hasTime ? "계속" : "시작";
            btnStop.IsEnabled = running;
            btnLap.IsEnabled = running;
            btnReset.IsEnabled = !running && hasTime;      // 멈춰 있고 잰 시간이 있을 때만
            lblState.Text = running ? "측정 중" : (hasTime ? "일시 정지" : "준비");
        }

        // 1시간 미만은 mm:ss.ff, 넘으면 h:mm:ss.ff
        private static string Format(TimeSpan t)
        {
            return t.TotalHours >= 1 ? t.ToString(@"h\:mm\:ss\.ff") : t.ToString(@"mm\:ss\.ff");
        }
    }
}`;

  const EX_STEP3 = String.raw`${SW_XAML('P08Step3', '스톱워치 — 단계 3 (랩)', true)}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08Step3
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private TimeSpan lastLapTotal = TimeSpan.Zero;   // 직전 랩을 눌렀을 때의 전체 시간
        private int lapNo = 0;                           // 랩 번호

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += Timer_Tick;
            UpdateButtons();
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            lblTime.Text = Format(sw.Elapsed);
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            sw.Start();
            timer.Start();
            UpdateButtons();
        }

        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            sw.Stop();
            timer.Stop();
            lblTime.Text = Format(sw.Elapsed);
            UpdateButtons();
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            TimeSpan total = sw.Elapsed;             // ① 지금까지의 전체 시간을 한 번만 읽는다
            TimeSpan lap = total - lastLapTotal;     // ② 이번 랩 = 전체 − 직전 랩 시점
            lastLapTotal = total;                    // ③ 다음 랩의 기준점
            lapNo++;
            // 최근 랩이 맨 위에 오도록 0 번 자리에 끼워 넣는다
            lstLaps.Items.Insert(0, $"랩 {lapNo,2}   {Format(lap)}   (전체 {Format(total)})");
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();
            lastLapTotal = TimeSpan.Zero;            // 랩 기록도 처음부터
            lapNo = 0;
            lstLaps.Items.Clear();
            lblTime.Text = Format(TimeSpan.Zero);
            UpdateButtons();
        }

        private void UpdateButtons()
        {
            bool running = sw.IsRunning;
            bool hasTime = sw.Elapsed > TimeSpan.Zero;
            btnStart.IsEnabled = !running;
            btnStart.Content = hasTime ? "계속" : "시작";
            btnStop.IsEnabled = running;
            btnLap.IsEnabled = running;
            btnReset.IsEnabled = !running && hasTime;
            lblState.Text = running ? "측정 중" : (hasTime ? "일시 정지" : "준비");
        }

        private static string Format(TimeSpan t)
        {
            return t.TotalHours >= 1 ? t.ToString(@"h\:mm\:ss\.ff") : t.ToString(@"mm\:ss\.ff");
        }
    }
}`;

  /* ======================= p08-2 실습 ======================= */
  const TOGGLE_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08PracToggle.MainWindow"
        ${NS}
        Title="버튼 하나로 시작 · 정지" Width="380" Height="260">
    <StackPanel Margin="16">
        <TextBlock x:Name="lblTime" Text="00:00.00" FontSize="52" FontFamily="Consolas"
                   HorizontalAlignment="Center"/>
        <UniformGrid Columns="2" Margin="0,12,0,0">
            <Button x:Name="btnStartStop" Content="시작" Height="40" Margin="4" Click="BtnStartStop_Click"/>
            <Button x:Name="btnReset" Content="리셋" Height="40" Margin="4" Click="BtnReset_Click"/>
        </UniformGrid>
    </StackPanel>
</Window>`;

  const P3_STARTER = String.raw`${TOGGLE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08PracToggle
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = sw.Elapsed.ToString(@"mm\:ss\.ff");
            UpdateButtons();
        }

        private void BtnStartStop_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: 측정 중(sw.IsRunning)이면 정지 + 마지막 시간 표시, 아니면 시작
            UpdateButtons();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 0 으로 되돌리고 화면에 00:00.00 표시
            UpdateButtons();
        }

        private void UpdateButtons()
        {
            // TODO 3: 버튼 글자 — 측정 중 "정지", 멈춤 + 잰 시간 있음 "계속", 그 밖 "시작"
            // TODO 4: 리셋은 멈춰 있고 잰 시간이 있을 때만 켜기
        }
    }
}`;

  const P3_SOLUTION = String.raw`${TOGGLE_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08PracToggle
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = sw.Elapsed.ToString(@"mm\:ss\.ff");
            UpdateButtons();
        }

        private void BtnStartStop_Click(object sender, RoutedEventArgs e)
        {
            if (sw.IsRunning)
            {
                sw.Stop();
                timer.Stop();
                lblTime.Text = sw.Elapsed.ToString(@"mm\:ss\.ff");   // 멈춘 순간의 정확한 값
            }
            else
            {
                sw.Start();
                timer.Start();
            }
            UpdateButtons();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();
            lblTime.Text = "00:00.00";
            UpdateButtons();
        }

        private void UpdateButtons()
        {
            bool running = sw.IsRunning;
            bool hasTime = sw.Elapsed > TimeSpan.Zero;
            if (running) btnStartStop.Content = "정지";
            else if (hasTime) btnStartStop.Content = "계속";
            else btnStartStop.Content = "시작";
            btnReset.IsEnabled = !running && hasTime;
        }
    }
}`;

  const STAT_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08PracStats.MainWindow"
        ${NS}
        Title="랩 통계" Width="420" Height="380">
    <DockPanel Margin="14">
        <TextBlock x:Name="lblTime" DockPanel.Dock="Top" Text="00:00.00" FontSize="48"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <UniformGrid DockPanel.Dock="Top" Columns="3" Margin="0,8,0,8">
            <Button x:Name="btnStart" Content="시작 / 정지" Height="34" Margin="3" Click="BtnStart_Click"/>
            <Button x:Name="btnLap" Content="랩" Height="34" Margin="3" Click="BtnLap_Click"/>
            <Button x:Name="btnReset" Content="리셋" Height="34" Margin="3" Click="BtnReset_Click"/>
        </UniformGrid>
        <TextBlock x:Name="lblStats" DockPanel.Dock="Bottom" Margin="0,8,0,0" FontSize="14"
                   Text="랩 0개"/>
        <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="14"/>
    </DockPanel>
</Window>`;

  const P4_STARTER = String.raw`${STAT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Windows;
using System.Windows.Threading;

namespace P08PracStats
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly List<TimeSpan> laps = new List<TimeSpan>();   // 랩 시간만 모아 둔다
        private TimeSpan lastLapTotal = TimeSpan.Zero;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = Format(sw.Elapsed);
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            if (sw.IsRunning) { sw.Stop(); timer.Stop(); lblTime.Text = Format(sw.Elapsed); }
            else { sw.Start(); timer.Start(); }
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            if (!sw.IsRunning) return;
            TimeSpan total = sw.Elapsed;
            TimeSpan lap = total - lastLapTotal;
            lastLapTotal = total;
            // TODO 1: laps 에 lap 을 추가하고, lstLaps 맨 위에 "랩 n   mm:ss.ff" 추가
            ShowStats();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset(); timer.Stop();
            lblTime.Text = Format(TimeSpan.Zero);
            // TODO 2: 랩 목록 · laps · lastLapTotal 도 처음으로
            ShowStats();
        }

        private void ShowStats()
        {
            // TODO 3: 랩이 없으면 "랩 0개",
            //         있으면 "랩 3개 · 평균 00:04.12 · 합계 00:12.36" 처럼 표시
            //         평균 = TimeSpan.FromTicks((long)laps.Average(t => t.Ticks))
        }

        private static string Format(TimeSpan t) => t.ToString(@"mm\:ss\.ff");
    }
}`;

  const P4_SOLUTION = String.raw`${STAT_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Windows;
using System.Windows.Threading;

namespace P08PracStats
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly List<TimeSpan> laps = new List<TimeSpan>();   // 랩 시간만 모아 둔다
        private TimeSpan lastLapTotal = TimeSpan.Zero;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = Format(sw.Elapsed);
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            if (sw.IsRunning) { sw.Stop(); timer.Stop(); lblTime.Text = Format(sw.Elapsed); }
            else { sw.Start(); timer.Start(); }
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            if (!sw.IsRunning) return;
            TimeSpan total = sw.Elapsed;
            TimeSpan lap = total - lastLapTotal;
            lastLapTotal = total;
            laps.Add(lap);
            lstLaps.Items.Insert(0, $"랩 {laps.Count,2}   {Format(lap)}");
            ShowStats();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset(); timer.Stop();
            lblTime.Text = Format(TimeSpan.Zero);
            laps.Clear();
            lstLaps.Items.Clear();
            lastLapTotal = TimeSpan.Zero;
            ShowStats();
        }

        private void ShowStats()
        {
            if (laps.Count == 0) { lblStats.Text = "랩 0개"; return; }
            TimeSpan avg = TimeSpan.FromTicks((long)laps.Average(t => t.Ticks));   // Ticks = 100 나노초 단위 정수
            TimeSpan sum = TimeSpan.FromTicks(laps.Sum(t => t.Ticks));
            lblStats.Text = $"랩 {laps.Count}개 · 평균 {Format(avg)} · 합계 {Format(sum)}";
        }

        private static string Format(TimeSpan t) => t.ToString(@"mm\:ss\.ff");
    }
}`;

  /* ======================= p08-2 슬라이드용 짧은 코드 ======================= */
  const SL_STATE = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideState.MainWindow" Title="버튼 상태" Width="400" Height="200"
        ${NS}>
    <StackPanel Margin="14">
        <TextBlock x:Name="lblTime" Text="00:00.00" FontSize="40" FontFamily="Consolas"/>
        <UniformGrid Columns="3"><Button x:Name="btnStart" Content="시작" Margin="3" Click="Start_Click"/>
            <Button x:Name="btnStop" Content="정지" Margin="3" Click="Stop_Click"/><Button x:Name="btnReset" Content="리셋" Margin="3" Click="Reset_Click"/></UniformGrid>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Diagnostics; using System.Windows; using System.Windows.Threading;
namespace P08SlideState
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch(); private readonly DispatcherTimer timer = new DispatcherTimer();
        public MainWindow() { InitializeComponent(); timer.Interval = TimeSpan.FromMilliseconds(30); timer.Tick += (s, e) => ShowTime(); UpdateButtons(); }
        private void Start_Click(object sender, RoutedEventArgs e) { sw.Start(); timer.Start(); UpdateButtons(); }
        private void Stop_Click(object sender, RoutedEventArgs e) { sw.Stop(); timer.Stop(); ShowTime(); UpdateButtons(); }
        private void Reset_Click(object sender, RoutedEventArgs e) { sw.Reset(); ShowTime(); UpdateButtons(); }
        private void ShowTime() { lblTime.Text = sw.Elapsed.ToString(@"mm\:ss\.ff"); }
        private void UpdateButtons()
        {
            bool running = sw.IsRunning, hasTime = sw.Elapsed > TimeSpan.Zero;
            btnStart.IsEnabled = !running; btnStart.Content = hasTime ? "계속" : "시작";
            btnStop.IsEnabled = running; btnReset.IsEnabled = !running && hasTime;
        }
    }
}`;

  const SL_LAP = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideLap.MainWindow"
        ${NS}
        Title="랩 기록" Width="400" Height="300">
    <DockPanel Margin="14">
        <Button DockPanel.Dock="Top" Content="랩" Height="32" Click="Lap_Click"/>
        <ListBox x:Name="lstLaps" Margin="0,8,0,0" FontFamily="Consolas" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Diagnostics; using System.Windows;
namespace P08SlideLap
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = Stopwatch.StartNew();   // 창이 뜨면 바로 측정
        private TimeSpan lastLapTotal = TimeSpan.Zero; private int lapNo = 0;
        public MainWindow() { InitializeComponent(); }
        private void Lap_Click(object sender, RoutedEventArgs e)
        {
            TimeSpan total = sw.Elapsed;             // 한 번만 읽기
            TimeSpan lap = total - lastLapTotal;     // 이번 랩
            lastLapTotal = total; lapNo++;           // 다음 기준점 · 번호
            lstLaps.Items.Insert(0, $"랩 {lapNo,2}  {F(lap)}  (전체 {F(total)})");   // 최근 랩이 맨 위
        }
        private static string F(TimeSpan t) => t.ToString(@"mm\:ss\.ff");
    }
}`;

  /* ======================= p08-3 예제 코드 ======================= */
  const EX_STEP4 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08Step4.MainWindow"
        ${NS}
        Title="스톱워치 — 단계 4 (최고 · 최저 랩)" Width="460" Height="420">
    <DockPanel Margin="14">
        <TextBlock x:Name="lblTime" DockPanel.Dock="Top" Text="00:00.00" FontSize="56"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <TextBlock x:Name="lblState" DockPanel.Dock="Top" Text="준비" Foreground="Gray"
                   HorizontalAlignment="Center"/>
        <UniformGrid DockPanel.Dock="Top" Columns="4" Margin="0,10,0,8">
            <Button x:Name="btnStart" Content="시작" Height="36" Margin="3" Click="BtnStart_Click"/>
            <Button x:Name="btnStop" Content="정지" Height="36" Margin="3" Click="BtnStop_Click"/>
            <Button x:Name="btnLap" Content="랩" Height="36" Margin="3" Click="BtnLap_Click"/>
            <Button x:Name="btnReset" Content="리셋" Height="36" Margin="3" Click="BtnReset_Click"/>
        </UniformGrid>
        <!-- 목록 머리글 -->
        <TextBlock DockPanel.Dock="Top" Text="번호    랩 시간    전체 시간" FontFamily="Consolas"
                   Foreground="Gray" Margin="6,0,0,2"/>
        <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: Lap.cs =====
using System;

namespace P08Step4
{
    // 랩 하나의 기록: 번호 · 이번 랩에 걸린 시간 · 시작부터 그때까지의 전체 시간
    public class Lap
    {
        public int No { get; }
        public TimeSpan Time { get; }
        public TimeSpan Total { get; }

        public Lap(int no, TimeSpan time, TimeSpan total)
        {
            No = no;
            Time = time;
            Total = total;
        }
    }
}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;                 // Min, Max
using System.Windows;
using System.Windows.Controls;     // ListBoxItem
using System.Windows.Media;        // Brushes
using System.Windows.Threading;

namespace P08Step4
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly List<Lap> laps = new List<Lap>();   // 데이터는 화면(ListBox)과 따로 보관
        private TimeSpan lastLapTotal = TimeSpan.Zero;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = Format(sw.Elapsed);
            UpdateButtons();
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            sw.Start();
            timer.Start();
            UpdateButtons();
        }

        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            sw.Stop();
            timer.Stop();
            lblTime.Text = Format(sw.Elapsed);
            UpdateButtons();
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            TimeSpan total = sw.Elapsed;
            laps.Add(new Lap(laps.Count + 1, total - lastLapTotal, total));
            lastLapTotal = total;
            RefreshLaps();                     // 데이터가 바뀌었으니 화면을 다시 그린다
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();
            laps.Clear();
            lastLapTotal = TimeSpan.Zero;
            lblTime.Text = Format(TimeSpan.Zero);
            RefreshLaps();
            UpdateButtons();
        }

        // 데이터(laps) → 화면(lstLaps): 목록 전체를 새로 만든다
        private void RefreshLaps()
        {
            lstLaps.Items.Clear();
            if (laps.Count == 0) return;

            TimeSpan best = laps.Min(l => l.Time);      // 가장 짧은 랩 = 가장 빠른 랩
            TimeSpan worst = laps.Max(l => l.Time);     // 가장 긴 랩 = 가장 느린 랩
            bool compare = laps.Count >= 2;             // 랩이 하나뿐이면 비교할 것이 없다

            for (int i = laps.Count - 1; i >= 0; i--)   // 최근 랩부터 (맨 위)
            {
                Lap lap = laps[i];
                ListBoxItem item = new ListBoxItem();   // 항목마다 글자색 · 굵기를 따로 줄 수 있다
                string mark = "";
                if (compare && lap.Time == best)
                {
                    item.Foreground = Brushes.ForestGreen;
                    item.FontWeight = FontWeights.Bold;
                    mark = "  ▲ 최고";
                }
                else if (compare && lap.Time == worst)
                {
                    item.Foreground = Brushes.Crimson;
                    item.FontWeight = FontWeights.Bold;
                    mark = "  ▼ 최저";
                }
                item.Content = $"랩 {lap.No,2}   {Format(lap.Time)}   {Format(lap.Total)}{mark}";
                lstLaps.Items.Add(item);
            }
        }

        private void UpdateButtons()
        {
            bool running = sw.IsRunning;
            bool hasTime = sw.Elapsed > TimeSpan.Zero;
            btnStart.IsEnabled = !running;
            btnStart.Content = hasTime ? "계속" : "시작";
            btnStop.IsEnabled = running;
            btnLap.IsEnabled = running;
            btnReset.IsEnabled = !running && hasTime;
            lblState.Text = running ? "측정 중" : (hasTime ? "일시 정지" : "준비");
        }

        private static string Format(TimeSpan t)
        {
            return t.TotalHours >= 1 ? t.ToString(@"h\:mm\:ss\.ff") : t.ToString(@"mm\:ss\.ff");
        }
    }
}`;

  const EX_STEP5 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08Step5.MainWindow"
        ${NS}
        Title="타이머 — 단계 5 (카운트다운)" Width="420" Height="350">
    <StackPanel Margin="16">
        <!-- ① 입력: 분 · 초 -->
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
            <TextBox x:Name="txtMin" Text="0" Width="56" FontSize="18" TextAlignment="Center"/>
            <TextBlock Text="분" FontSize="16" Margin="6,0,16,0" VerticalAlignment="Center"/>
            <TextBox x:Name="txtSec" Text="5" Width="56" FontSize="18" TextAlignment="Center"/>
            <TextBlock Text="초" FontSize="16" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <!-- ② 남은 시간 + 진행 막대 -->
        <TextBlock x:Name="lblRemain" Text="00:05" FontSize="56" FontFamily="Consolas"
                   HorizontalAlignment="Center" Margin="0,10,0,6"/>
        <ProgressBar x:Name="pbTime" Height="18" Minimum="0" Maximum="100" Value="0"/>
        <!-- ③ 버튼 -->
        <UniformGrid Columns="3" Margin="0,14,0,0">
            <Button x:Name="btnCdStart" Content="시작" Height="36" Margin="3" Click="BtnCdStart_Click"/>
            <Button x:Name="btnCdPause" Content="일시 정지" Height="36" Margin="3" Click="BtnCdPause_Click"/>
            <Button x:Name="btnCdReset" Content="리셋" Height="36" Margin="3" Click="BtnCdReset_Click"/>
        </UniformGrid>
        <TextBlock x:Name="lblCdInfo" Margin="0,10,0,0" Foreground="Gray" HorizontalAlignment="Center"
                   Text="분 · 초를 입력하고 시작을 누르세요."/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Threading;

namespace P08Step5
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch cdWatch = new Stopwatch();              // 흐른 시간
        private readonly DispatcherTimer cdTimer = new DispatcherTimer();  // 화면 갱신
        private TimeSpan duration = TimeSpan.Zero;                         // 설정한 시간 (Zero = 시작 전)

        public MainWindow()
        {
            InitializeComponent();
            cdTimer.Interval = TimeSpan.FromMilliseconds(100);
            cdTimer.Tick += CdTimer_Tick;
            UpdateCdButtons();
        }

        // 입력 검사: 올바르면 true 와 함께 시간을 돌려준다 (out 매개변수)
        private bool TryReadDuration(out TimeSpan result)
        {
            result = TimeSpan.Zero;
            if (!int.TryParse(txtMin.Text.Trim(), out int min) || !int.TryParse(txtSec.Text.Trim(), out int sec))
            {
                MessageBox.Show("분과 초에는 숫자만 입력하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            if (min < 0 || min > 99 || sec < 0 || sec > 59)
            {
                MessageBox.Show("분은 0~99, 초는 0~59 사이로 입력하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            result = new TimeSpan(0, min, sec);
            if (result == TimeSpan.Zero)
            {
                MessageBox.Show("1초 이상으로 설정하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            return true;
        }

        private void BtnCdStart_Click(object sender, RoutedEventArgs e)
        {
            if (duration == TimeSpan.Zero)               // 처음 시작할 때만 입력을 읽는다
            {
                if (!TryReadDuration(out TimeSpan d)) return;
                duration = d;
                cdWatch.Reset();
            }
            cdWatch.Start();                             // 일시 정지였다면 이어서
            cdTimer.Start();
            lblCdInfo.Text = $"{Format(duration)} 타이머 진행 중";
            UpdateCdButtons();
        }

        private void BtnCdPause_Click(object sender, RoutedEventArgs e)
        {
            cdWatch.Stop();                              // 흐른 시간이 멈춤 → 남은 시간도 멈춤
            cdTimer.Stop();
            lblCdInfo.Text = "일시 정지 — 계속을 누르면 이어서 진행합니다.";
            UpdateCdButtons();
        }

        private void BtnCdReset_Click(object sender, RoutedEventArgs e)
        {
            ResetCountdown();
            lblCdInfo.Text = "리셋했습니다.";
        }

        private void CdTimer_Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - cdWatch.Elapsed;
            if (remain <= TimeSpan.Zero)                 // 끝!
            {
                cdTimer.Stop();                          // ① 먼저 멈추고
                cdWatch.Stop();
                lblRemain.Text = "00:00";                // ② 화면을 끝 상태로
                pbTime.Value = 100;
                MessageBox.Show($"설정한 시간({Format(duration)})이 다 됐습니다!", "⏰ 시간 종료",
                    MessageBoxButton.OK, MessageBoxImage.Information);   // ③ 알림 (확인을 누를 때까지 기다림)
                ResetCountdown();
                lblCdInfo.Text = "완료! 다시 시작할 수 있습니다.";
                return;
            }
            lblRemain.Text = Format(remain);
            pbTime.Value = cdWatch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
        }

        private void ResetCountdown()
        {
            cdTimer.Stop();
            cdWatch.Reset();
            duration = TimeSpan.Zero;
            pbTime.Value = 0;
            if (int.TryParse(txtMin.Text, out int m) && int.TryParse(txtSec.Text, out int s) && m >= 0 && s >= 0)
                lblRemain.Text = Format(new TimeSpan(0, m, s));   // 입력해 둔 시간을 다시 보여 준다
            UpdateCdButtons();
        }

        private void UpdateCdButtons()
        {
            bool running = cdWatch.IsRunning;
            bool started = duration != TimeSpan.Zero;    // 시작했거나 일시 정지 중
            btnCdStart.IsEnabled = !running;
            btnCdStart.Content = started ? "계속" : "시작";
            btnCdPause.IsEnabled = running;
            btnCdReset.IsEnabled = started;
            txtMin.IsEnabled = !started;                 // 도는 동안에는 입력을 바꾸지 못하게
            txtSec.IsEnabled = !started;
        }

        // 남은 시간은 "올림" 해서 보여 준다: 2.3초 남음 → 00:03 (0 이 보이는 순간 = 끝)
        private static string Format(TimeSpan t)
        {
            TimeSpan up = TimeSpan.FromSeconds(Math.Ceiling(t.TotalSeconds));
            return $"{(int)up.TotalMinutes:00}:{up.Seconds:00}";   // 99분도 99 로 (mm 은 60분에서 다시 0)
        }
    }
}`;

  const EX_STEP6 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08Step6.MainWindow"
        ${NS}
        Title="TabControl — 두 화면, 두 타이머" Width="440" Height="320">
    <DockPanel Margin="8">
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="4,6,0,0" Foreground="Gray"
                   TextWrapping="Wrap" Text="두 탭에서 모두 시작한 뒤 탭을 바꿔 보세요."/>
        <!-- TabControl 안에 TabItem 을 넣는다. Header = 탭 글자, 내용 = 그 탭의 화면 -->
        <TabControl x:Name="tabs" SelectionChanged="Tabs_SelectionChanged">
            <TabItem Header="⏱ 스톱워치">
                <StackPanel Margin="12">
                    <TextBlock x:Name="lblSw" Text="00:00.00" FontSize="44" FontFamily="Consolas"
                               HorizontalAlignment="Center"/>
                    <Button Content="시작 / 정지" Width="140" Height="32" Margin="0,10,0,0" Click="SwToggle_Click"/>
                </StackPanel>
            </TabItem>
            <TabItem Header="⏳ 타이머">
                <StackPanel Margin="12">
                    <TextBlock x:Name="lblCd" Text="00:10" FontSize="44" FontFamily="Consolas"
                               HorizontalAlignment="Center"/>
                    <ProgressBar x:Name="pbCd" Height="16" Maximum="100" Margin="0,6,0,0"/>
                    <Button Content="10초 시작" Width="140" Height="32" Margin="0,10,0,0" Click="CdStart_Click"/>
                </StackPanel>
            </TabItem>
        </TabControl>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;

namespace P08Step6
{
    public partial class MainWindow : Window
    {
        // 탭마다 자기 Stopwatch 와 DispatcherTimer 를 가진다 (서로 독립)
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer swTimer = new DispatcherTimer();
        private readonly Stopwatch cdWatch = new Stopwatch();
        private readonly DispatcherTimer cdTimer = new DispatcherTimer();
        private readonly TimeSpan duration = TimeSpan.FromSeconds(10);

        public MainWindow()
        {
            InitializeComponent();
            swTimer.Interval = TimeSpan.FromMilliseconds(30);
            swTimer.Tick += (s, e) => lblSw.Text = sw.Elapsed.ToString(@"mm\:ss\.ff");
            cdTimer.Interval = TimeSpan.FromMilliseconds(100);
            cdTimer.Tick += CdTimer_Tick;
        }

        private void SwToggle_Click(object sender, RoutedEventArgs e)
        {
            if (sw.IsRunning) { sw.Stop(); swTimer.Stop(); }
            else { sw.Start(); swTimer.Start(); }
        }

        private void CdStart_Click(object sender, RoutedEventArgs e)
        {
            cdWatch.Restart();         // Restart = Reset + Start (0 부터 다시)
            cdTimer.Start();
        }

        private void CdTimer_Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - cdWatch.Elapsed;
            if (remain <= TimeSpan.Zero)
            {
                cdTimer.Stop();
                cdWatch.Stop();
                lblCd.Text = "00:00";
                pbCd.Value = 100;
                lblInfo.Text = "타이머 끝! — 다른 탭을 보고 있어도 타이머는 계속 돌았습니다.";
                return;
            }
            lblCd.Text = TimeSpan.FromSeconds(Math.Ceiling(remain.TotalSeconds)).ToString(@"mm\:ss");
            pbCd.Value = cdWatch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
        }

        // 탭을 바꾸면 SelectedIndex 가 바뀌고 SelectionChanged 가 온다
        private void Tabs_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (!ReferenceEquals(e.Source, tabs)) return;   // 탭 안의 ListBox · ComboBox 에서 버블링된 것은 무시
            if (tabs.SelectedItem is TabItem item)
                lblInfo.Text = $"{tabs.SelectedIndex}번 탭 [{item.Header}] — 숨겨진 탭의 컨트롤도 그대로 살아 있습니다.";
        }
    }
}`;

  /* ======================= p08-3 실습 ======================= */
  const PRESET_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08PracPreset.MainWindow"
        ${NS}
        Title="빠른 설정 버튼" Width="400" Height="300">
    <StackPanel Margin="16">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
            <TextBox x:Name="txtMin" Text="0" Width="56" FontSize="18" TextAlignment="Center"/>
            <TextBlock Text="분" FontSize="16" Margin="6,0,16,0" VerticalAlignment="Center"/>
            <TextBox x:Name="txtSec" Text="0" Width="56" FontSize="18" TextAlignment="Center"/>
            <TextBlock Text="초" FontSize="16" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <!-- Tag 에 "초" 를 적어 두고 처리기 하나로 처리한다 -->
        <UniformGrid Columns="4" Margin="0,10,0,0">
            <Button Content="30초" Tag="30" Margin="3" Click="Preset_Click"/>
            <Button Content="1분" Tag="60" Margin="3" Click="Preset_Click"/>
            <Button Content="3분" Tag="180" Margin="3" Click="Preset_Click"/>
            <Button Content="5분 30초" Tag="330" Margin="3" Click="Preset_Click"/>
        </UniformGrid>
        <TextBlock x:Name="lblRemain" Text="00:00" FontSize="52" FontFamily="Consolas"
                   HorizontalAlignment="Center" Margin="0,12,0,0"/>
        <TextBlock x:Name="lblInfo" Foreground="Gray" HorizontalAlignment="Center" Text="버튼을 눌러 보세요."/>
    </StackPanel>
</Window>`;

  const P5_STARTER = String.raw`${PRESET_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace P08PracPreset
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Preset_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: 누른 버튼((Button)sender)의 Tag 를 정수(초)로 바꾸기 — Convert.ToInt32
            // TODO 2: txtMin 에 "분", txtSec 에 "초" 넣기 (330 → 5 와 30)
            // TODO 3: lblRemain 에 "05:30" 형식, lblInfo 에 "[5분 30초] 버튼으로 설정" 표시
        }
    }
}`;

  const P5_SOLUTION = String.raw`${PRESET_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace P08PracPreset
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Preset_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            int total = Convert.ToInt32(b.Tag);          // Tag="330" → 330
            txtMin.Text = (total / 60).ToString();        // 몫 = 분
            txtSec.Text = (total % 60).ToString();        // 나머지 = 초
            lblRemain.Text = $"{total / 60:00}:{total % 60:00}";
            lblInfo.Text = $"[{b.Content}] 버튼으로 설정";
        }
    }
}`;

  const WARN_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08PracWarn.MainWindow"
        ${NS}
        Title="타이머" Width="380" Height="260">
    <StackPanel Margin="16">
        <TextBlock x:Name="lblRemain" Text="00:15" FontSize="56" FontFamily="Consolas"
                   HorizontalAlignment="Center"/>
        <ProgressBar x:Name="pbTime" Height="16" Maximum="100" Margin="0,6,0,0"/>
        <UniformGrid Columns="2" Margin="0,12,0,0">
            <Button Content="15초 시작" Height="34" Margin="3" Click="BtnStart_Click"/>
            <Button Content="리셋" Height="34" Margin="3" Click="BtnReset_Click"/>
        </UniformGrid>
    </StackPanel>
</Window>`;

  const P6_STARTER = String.raw`${WARN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;

namespace P08PracWarn
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch watch = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly TimeSpan duration = TimeSpan.FromSeconds(15);

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(100);
            timer.Tick += Timer_Tick;
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            watch.Restart();
            timer.Start();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            timer.Stop();
            watch.Reset();
            lblRemain.Text = "00:15";
            pbTime.Value = 0;
            // TODO 4: 글자색 · 창 제목을 처음 상태로
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - watch.Elapsed;
            if (remain <= TimeSpan.Zero)
            {
                timer.Stop();
                watch.Stop();
                lblRemain.Text = "00:00";
                pbTime.Value = 100;
                // TODO 3: 창 제목을 "⏰ 끝! - 타이머" 로
                return;
            }
            string text = TimeSpan.FromSeconds(Math.Ceiling(remain.TotalSeconds)).ToString(@"mm\:ss");
            lblRemain.Text = text;
            pbTime.Value = watch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
            // TODO 1: 남은 시간이 10초 이하이면 lblRemain 글자를 Crimson, 아니면 Black 으로
            // TODO 2: 창 제목(Title)을 "⏳ 00:12 - 타이머" 처럼 남은 시간으로
        }
    }
}`;

  const P6_SOLUTION = String.raw`${WARN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Media;
using System.Windows.Threading;

namespace P08PracWarn
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch watch = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly TimeSpan duration = TimeSpan.FromSeconds(15);

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(100);
            timer.Tick += Timer_Tick;
        }

        private void BtnStart_Click(object sender, RoutedEventArgs e)
        {
            watch.Restart();
            timer.Start();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            timer.Stop();
            watch.Reset();
            lblRemain.Text = "00:15";
            pbTime.Value = 0;
            lblRemain.Foreground = Brushes.Black;
            Title = "타이머";
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - watch.Elapsed;
            if (remain <= TimeSpan.Zero)
            {
                timer.Stop();
                watch.Stop();
                lblRemain.Text = "00:00";
                pbTime.Value = 100;
                Title = "⏰ 끝! - 타이머";
                return;
            }
            string text = TimeSpan.FromSeconds(Math.Ceiling(remain.TotalSeconds)).ToString(@"mm\:ss");
            lblRemain.Text = text;
            pbTime.Value = watch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
            lblRemain.Foreground = remain.TotalSeconds <= 10 ? Brushes.Crimson : Brushes.Black;
            Title = $"⏳ {text} - 타이머";   // 작업 표시줄에서도 남은 시간이 보인다
        }
    }
}`;

  /* ======================= p08-3 슬라이드용 짧은 코드 ======================= */
  const SL_BEST = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideBest.MainWindow"
        ${NS}
        Title="최고 · 최저 강조" Width="380" Height="260">
    <ListBox x:Name="lstLaps" Margin="12" FontFamily="Consolas" FontSize="16"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Linq; using System.Windows; using System.Windows.Controls; using System.Windows.Media;
namespace P08SlideBest
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            double[] laps = { 18.42, 15.72, 24.90, 21.07 };      // 예시 랩(초)
            double best = laps.Min(), worst = laps.Max();
            for (int i = laps.Length - 1; i >= 0; i--)
            {
                var item = new ListBoxItem { Content = $"랩 {i + 1}  {laps[i]:F2}초" };
                if (laps[i] == best) { item.Foreground = Brushes.ForestGreen; item.FontWeight = FontWeights.Bold; }
                else if (laps[i] == worst) { item.Foreground = Brushes.Crimson; item.FontWeight = FontWeights.Bold; }
                lstLaps.Items.Add(item);
            }
        }
    }
}`;

  const SL_COUNT = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideCount.MainWindow" Title="카운트다운" Width="360" Height="220"
        ${NS}>
    <StackPanel Margin="16">
        <TextBlock x:Name="lblRemain" Text="00:05" FontSize="48" FontFamily="Consolas" HorizontalAlignment="Center"/>
        <ProgressBar x:Name="pb" Height="16" Maximum="100"/><Button Content="5초 시작" Margin="0,10,0,0" Click="Start_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Diagnostics; using System.Windows; using System.Windows.Threading;
namespace P08SlideCount
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch watch = new Stopwatch(); private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly TimeSpan duration = TimeSpan.FromSeconds(5);
        public MainWindow() { InitializeComponent(); timer.Interval = TimeSpan.FromMilliseconds(100); timer.Tick += Tick; }
        private void Start_Click(object sender, RoutedEventArgs e) { watch.Restart(); timer.Start(); }
        private void Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - watch.Elapsed;
            if (remain <= TimeSpan.Zero)   // ① 멈춤 → ② 끝 화면 → ③ 알림
            {   timer.Stop(); lblRemain.Text = "00:00"; pb.Value = 100;
                MessageBox.Show("시간이 다 됐습니다!", "⏰ 타이머"); return; }
            lblRemain.Text = TimeSpan.FromSeconds(Math.Ceiling(remain.TotalSeconds)).ToString(@"mm\:ss");
            pb.Value = watch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
        }
    }
}`;

  const SL_TAB = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08SlideTab.MainWindow"
        ${NS}
        Title="TabControl" Width="380" Height="240">
    <TabControl x:Name="tabs" Margin="6" SelectionChanged="Tabs_SelectionChanged">
        <TabItem Header="⏱ 스톱워치">
            <TextBlock Text="스톱워치 화면" FontSize="20" Margin="16"/>
        </TabItem>
        <TabItem Header="⏳ 타이머">
            <TextBlock Text="타이머 화면" FontSize="20" Margin="16"/>
        </TabItem>
    </TabControl>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Controls;
namespace P08SlideTab
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Tabs_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ReferenceEquals(e.Source, tabs) && tabs.SelectedItem is TabItem t)
                Title = $"TabControl — {t.Header}";
        }
    }
}`;

  /* ======================= p08-4 완성 프로그램 ======================= */
  const EX_FINAL = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08Final.MainWindow"
        ${NS}
        Title="스톱워치 · 타이머" Width="460" Height="450">
    <TabControl Margin="6">
        <!-- ================= 탭 1: 스톱워치 ================= -->
        <TabItem Header="⏱ 스톱워치">
            <DockPanel Margin="10">
                <TextBlock x:Name="lblTime" DockPanel.Dock="Top" Text="00:00.00" FontSize="56"
                           FontFamily="Consolas" HorizontalAlignment="Center"/>
                <TextBlock x:Name="lblState" DockPanel.Dock="Top" Text="준비" Foreground="Gray"
                           HorizontalAlignment="Center"/>
                <UniformGrid DockPanel.Dock="Top" Columns="4" Margin="0,8,0,8">
                    <Button x:Name="btnStart" Content="시작" Height="34" Margin="3" Click="BtnStart_Click"/>
                    <Button x:Name="btnStop" Content="정지" Height="34" Margin="3" Click="BtnStop_Click"/>
                    <Button x:Name="btnLap" Content="랩" Height="34" Margin="3" Click="BtnLap_Click"/>
                    <Button x:Name="btnReset" Content="리셋" Height="34" Margin="3" Click="BtnReset_Click"/>
                </UniformGrid>
                <TextBlock DockPanel.Dock="Top" Text="번호    랩 시간    전체 시간" FontFamily="Consolas"
                           Foreground="Gray" Margin="6,0,0,2"/>
                <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="14"/>
            </DockPanel>
        </TabItem>
        <!-- ================= 탭 2: 타이머 ================= -->
        <TabItem Header="⏳ 타이머">
            <StackPanel Margin="14">
                <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
                    <TextBox x:Name="txtMin" Text="0" Width="56" FontSize="18" TextAlignment="Center"/>
                    <TextBlock Text="분" FontSize="16" Margin="6,0,16,0" VerticalAlignment="Center"/>
                    <TextBox x:Name="txtSec" Text="30" Width="56" FontSize="18" TextAlignment="Center"/>
                    <TextBlock Text="초" FontSize="16" Margin="6,0,0,0" VerticalAlignment="Center"/>
                </StackPanel>
                <UniformGrid Columns="4" Margin="30,8,30,0">
                    <Button x:Name="btnP10" Content="10초" Tag="10" Margin="3" Click="Preset_Click"/>
                    <Button x:Name="btnP60" Content="1분" Tag="60" Margin="3" Click="Preset_Click"/>
                    <Button x:Name="btnP180" Content="3분" Tag="180" Margin="3" Click="Preset_Click"/>
                    <Button x:Name="btnP300" Content="5분" Tag="300" Margin="3" Click="Preset_Click"/>
                </UniformGrid>
                <TextBlock x:Name="lblRemain" Text="00:30" FontSize="56" FontFamily="Consolas"
                           HorizontalAlignment="Center" Margin="0,8,0,4"/>
                <ProgressBar x:Name="pbTime" Height="18" Minimum="0" Maximum="100" Value="0"/>
                <UniformGrid Columns="3" Margin="0,12,0,0">
                    <Button x:Name="btnCdStart" Content="시작" Height="34" Margin="3" Click="BtnCdStart_Click"/>
                    <Button x:Name="btnCdPause" Content="일시 정지" Height="34" Margin="3" Click="BtnCdPause_Click"/>
                    <Button x:Name="btnCdReset" Content="리셋" Height="34" Margin="3" Click="BtnCdReset_Click"/>
                </UniformGrid>
                <TextBlock x:Name="lblCdInfo" Margin="0,10,0,0" Foreground="Gray" HorizontalAlignment="Center"
                           Text="시간을 입력하거나 빠른 설정 버튼을 누르세요."/>
            </StackPanel>
        </TabItem>
    </TabControl>
</Window>
// ===== File: Lap.cs =====
using System;

namespace P08Final
{
    // 랩 하나의 기록: 번호 · 이번 랩 시간 · 그때까지의 전체 시간
    public class Lap
    {
        public int No { get; }
        public TimeSpan Time { get; }
        public TimeSpan Total { get; }

        public Lap(int no, TimeSpan time, TimeSpan total)
        {
            No = no;
            Time = time;
            Total = total;
        }
    }
}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Threading;

namespace P08Final
{
    public partial class MainWindow : Window
    {
        private const string AppTitle = "스톱워치 · 타이머";

        // ---------- 스톱워치 ----------
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer swTimer = new DispatcherTimer();
        private readonly List<Lap> laps = new List<Lap>();
        private TimeSpan lastLapTotal = TimeSpan.Zero;

        // ---------- 타이머 ----------
        private readonly Stopwatch cdWatch = new Stopwatch();
        private readonly DispatcherTimer cdTimer = new DispatcherTimer();
        private TimeSpan duration = TimeSpan.Zero;     // Zero = 시작 전

        public MainWindow()
        {
            InitializeComponent();
            swTimer.Interval = TimeSpan.FromMilliseconds(30);
            swTimer.Tick += (s, e) => lblTime.Text = Format(sw.Elapsed);
            cdTimer.Interval = TimeSpan.FromMilliseconds(100);
            cdTimer.Tick += CdTimer_Tick;
            UpdateButtons();
            UpdateCdButtons();

            // 시연용: 창이 뜨자마자 스톱워치를 시작한다 (원하지 않으면 이 줄을 지우세요)
            StartStopwatch();
        }

        // ============================ 스톱워치 ============================
        private void BtnStart_Click(object sender, RoutedEventArgs e) { StartStopwatch(); }

        private void StartStopwatch()
        {
            sw.Start();
            swTimer.Start();
            UpdateButtons();
        }

        private void BtnStop_Click(object sender, RoutedEventArgs e)
        {
            sw.Stop();
            swTimer.Stop();
            lblTime.Text = Format(sw.Elapsed);          // 멈춘 순간의 정확한 값
            UpdateButtons();
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            TimeSpan total = sw.Elapsed;                // 한 번만 읽는다
            laps.Add(new Lap(laps.Count + 1, total - lastLapTotal, total));
            lastLapTotal = total;
            RefreshLaps();
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset();
            laps.Clear();
            lastLapTotal = TimeSpan.Zero;
            lblTime.Text = Format(TimeSpan.Zero);
            RefreshLaps();
            UpdateButtons();
        }

        private void RefreshLaps()
        {
            lstLaps.Items.Clear();
            if (laps.Count == 0) return;
            TimeSpan best = laps.Min(l => l.Time);
            TimeSpan worst = laps.Max(l => l.Time);
            bool compare = laps.Count >= 2;
            for (int i = laps.Count - 1; i >= 0; i--)
            {
                Lap lap = laps[i];
                ListBoxItem item = new ListBoxItem();
                string mark = "";
                if (compare && lap.Time == best)
                {
                    item.Foreground = Brushes.ForestGreen;
                    item.FontWeight = FontWeights.Bold;
                    mark = "  ▲ 최고";
                }
                else if (compare && lap.Time == worst)
                {
                    item.Foreground = Brushes.Crimson;
                    item.FontWeight = FontWeights.Bold;
                    mark = "  ▼ 최저";
                }
                item.Content = $"랩 {lap.No,2}   {Format(lap.Time)}   {Format(lap.Total)}{mark}";
                lstLaps.Items.Add(item);
            }
        }

        private void UpdateButtons()
        {
            bool running = sw.IsRunning;
            bool hasTime = sw.Elapsed > TimeSpan.Zero;
            btnStart.IsEnabled = !running;
            btnStart.Content = hasTime ? "계속" : "시작";
            btnStop.IsEnabled = running;
            btnLap.IsEnabled = running;
            btnReset.IsEnabled = !running && hasTime;
            lblState.Text = running ? "측정 중" : (hasTime ? "일시 정지" : "준비");
        }

        private static string Format(TimeSpan t)
        {
            return t.TotalHours >= 1 ? t.ToString(@"h\:mm\:ss\.ff") : t.ToString(@"mm\:ss\.ff");
        }

        // ============================ 타이머 ============================
        private void Preset_Click(object sender, RoutedEventArgs e)
        {
            if (duration != TimeSpan.Zero) return;     // 도는 중에는 바꾸지 않는다
            int total = Convert.ToInt32(((Button)sender).Tag);
            txtMin.Text = (total / 60).ToString();
            txtSec.Text = (total % 60).ToString();
            lblRemain.Text = FormatRemain(TimeSpan.FromSeconds(total));
        }

        private bool TryReadDuration(out TimeSpan result)
        {
            result = TimeSpan.Zero;
            if (!int.TryParse(txtMin.Text.Trim(), out int min) || !int.TryParse(txtSec.Text.Trim(), out int sec))
            {
                MessageBox.Show("분과 초에는 숫자만 입력하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            if (min < 0 || min > 99 || sec < 0 || sec > 59)
            {
                MessageBox.Show("분은 0~99, 초는 0~59 사이로 입력하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            result = new TimeSpan(0, min, sec);
            if (result == TimeSpan.Zero)
            {
                MessageBox.Show("1초 이상으로 설정하세요.", "입력 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            return true;
        }

        private void BtnCdStart_Click(object sender, RoutedEventArgs e)
        {
            if (duration == TimeSpan.Zero)
            {
                if (!TryReadDuration(out TimeSpan d)) return;
                duration = d;
                cdWatch.Reset();
            }
            cdWatch.Start();
            cdTimer.Start();
            lblCdInfo.Text = $"{FormatRemain(duration)} 타이머 진행 중";
            UpdateCdButtons();
        }

        private void BtnCdPause_Click(object sender, RoutedEventArgs e)
        {
            cdWatch.Stop();
            cdTimer.Stop();
            lblCdInfo.Text = "일시 정지 — 계속을 누르면 이어서 진행합니다.";
            UpdateCdButtons();
        }

        private void BtnCdReset_Click(object sender, RoutedEventArgs e)
        {
            ResetCountdown();
            lblCdInfo.Text = "리셋했습니다.";
        }

        private void CdTimer_Tick(object? sender, EventArgs e)
        {
            TimeSpan remain = duration - cdWatch.Elapsed;
            if (remain <= TimeSpan.Zero)
            {
                cdTimer.Stop();
                cdWatch.Stop();
                lblRemain.Text = "00:00";
                pbTime.Value = 100;
                Title = "⏰ 끝! - " + AppTitle;
                MessageBox.Show($"설정한 시간({FormatRemain(duration)})이 다 됐습니다!", "⏰ 시간 종료",
                    MessageBoxButton.OK, MessageBoxImage.Information);
                ResetCountdown();
                lblCdInfo.Text = "완료! 다시 시작할 수 있습니다.";
                return;
            }
            string text = FormatRemain(remain);
            lblRemain.Text = text;
            lblRemain.Foreground = remain.TotalSeconds <= 10 ? Brushes.Crimson : Brushes.Black;   // 마지막 10초
            pbTime.Value = cdWatch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
            Title = $"⏳ {text} - {AppTitle}";
        }

        private void ResetCountdown()
        {
            cdTimer.Stop();
            cdWatch.Reset();
            duration = TimeSpan.Zero;
            pbTime.Value = 0;
            lblRemain.Foreground = Brushes.Black;
            Title = AppTitle;
            if (int.TryParse(txtMin.Text, out int m) && int.TryParse(txtSec.Text, out int s) && m >= 0 && s >= 0)
                lblRemain.Text = FormatRemain(new TimeSpan(0, m, s));
            UpdateCdButtons();
        }

        private void UpdateCdButtons()
        {
            bool running = cdWatch.IsRunning;
            bool started = duration != TimeSpan.Zero;
            btnCdStart.IsEnabled = !running;
            btnCdStart.Content = started ? "계속" : "시작";
            btnCdPause.IsEnabled = running;
            btnCdReset.IsEnabled = started;
            txtMin.IsEnabled = !started;
            txtSec.IsEnabled = !started;
            foreach (Button b in new[] { btnP10, btnP60, btnP180, btnP300 }) b.IsEnabled = !started;
        }

        private static string FormatRemain(TimeSpan t)
        {
            TimeSpan up = TimeSpan.FromSeconds(Math.Ceiling(t.TotalSeconds));
            return $"{(int)up.TotalMinutes:00}:{up.Seconds:00}";
        }
    }
}`;

  /* ======================= p08-4 MVVM 리팩터링 ======================= */
  const VMBASE = (ns) => String.raw`// ===== File: ViewModelBase.cs =====
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ${ns}
{
    // 20장의 공통 부모: 속성 변경 알림
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value)) return false;
            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
}
// ===== File: RelayCommand.cs =====
using System;
using System.Windows.Input;

namespace ${ns}
{
    // 20장의 범용 명령: 할 일(execute) + 할 수 있는지(canExecute)
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> execute;
        private readonly Func<object?, bool>? canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            this.execute = execute;
            this.canExecute = canExecute;
        }

        public bool CanExecute(object? parameter) => canExecute == null || canExecute(parameter);
        public void Execute(object? parameter) => execute(parameter);

        public event EventHandler? CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}`;

  const EX_MVVM = String.raw`${VMBASE('P08Mvvm')}
// ===== File: StopwatchViewModel.cs =====
using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Windows.Input;
using System.Windows.Threading;

namespace P08Mvvm
{
    // 화면에 무엇이 보여야 하는지만 안다 — 버튼 · TextBlock 이름은 모른다
    public class StopwatchViewModel : ViewModelBase
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private TimeSpan lastLapTotal = TimeSpan.Zero;
        private string display = "00:00.00";
        private string stateText = "준비";
        private string startText = "시작";

        public string Display { get => display; private set => SetProperty(ref display, value); }
        public string StateText { get => stateText; private set => SetProperty(ref stateText, value); }
        public string StartText { get => startText; private set => SetProperty(ref startText, value); }
        public ObservableCollection<string> Laps { get; } = new ObservableCollection<string>();

        public ICommand StartCommand { get; }
        public ICommand StopCommand { get; }
        public ICommand LapCommand { get; }
        public ICommand ResetCommand { get; }

        public StopwatchViewModel()
        {
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => Display = Format(sw.Elapsed);   // 속성만 바꾸면 바인딩이 화면을 고친다

            // UpdateButtons() 가 하던 일 = 명령마다 canExecute 한 줄
            StartCommand = new RelayCommand(_ => Start(), _ => !sw.IsRunning);
            StopCommand = new RelayCommand(_ => Stop(), _ => sw.IsRunning);
            LapCommand = new RelayCommand(_ => AddLap(), _ => sw.IsRunning);
            ResetCommand = new RelayCommand(_ => Reset(), _ => !sw.IsRunning && sw.Elapsed > TimeSpan.Zero);
        }

        private void Start()
        {
            sw.Start();
            timer.Start();
            UpdateState();
        }

        private void Stop()
        {
            sw.Stop();
            timer.Stop();
            Display = Format(sw.Elapsed);
            UpdateState();
        }

        private void AddLap()
        {
            TimeSpan total = sw.Elapsed;
            TimeSpan lap = total - lastLapTotal;
            lastLapTotal = total;
            Laps.Insert(0, $"랩 {Laps.Count + 1,2}   {Format(lap)}   {Format(total)}");
        }

        private void Reset()
        {
            sw.Reset();
            lastLapTotal = TimeSpan.Zero;
            Laps.Clear();
            Display = Format(TimeSpan.Zero);
            UpdateState();
        }

        private void UpdateState()
        {
            bool hasTime = sw.Elapsed > TimeSpan.Zero;
            StateText = sw.IsRunning ? "측정 중" : (hasTime ? "일시 정지" : "준비");
            StartText = hasTime ? "계속" : "시작";
            CommandManager.InvalidateRequerySuggested();   // "CanExecute 를 다시 물어봐" → 버튼 켜고 끄기
        }

        private static string Format(TimeSpan t)
        {
            return t.TotalHours >= 1 ? t.ToString(@"h\:mm\:ss\.ff") : t.ToString(@"mm\:ss\.ff");
        }
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="P08Mvvm.MainWindow"
        ${NS}
        Title="스톱워치 — MVVM" Width="440" Height="400">
    <DockPanel Margin="14">
        <TextBlock DockPanel.Dock="Top" Text="{Binding Display}" FontSize="56"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <TextBlock DockPanel.Dock="Top" Text="{Binding StateText}" Foreground="Gray"
                   HorizontalAlignment="Center"/>
        <UniformGrid DockPanel.Dock="Top" Columns="4" Margin="0,10,0,10">
            <!-- Click 대신 Command: 켜고 끄기(IsEnabled)도 명령의 CanExecute 가 정한다 -->
            <Button Content="{Binding StartText}" Command="{Binding StartCommand}" Height="36" Margin="3"/>
            <Button Content="정지" Command="{Binding StopCommand}" Height="36" Margin="3"/>
            <Button Content="랩" Command="{Binding LapCommand}" Height="36" Margin="3"/>
            <Button Content="리셋" Command="{Binding ResetCommand}" Height="36" Margin="3"/>
        </UniformGrid>
        <ListBox ItemsSource="{Binding Laps}" FontFamily="Consolas" FontSize="15"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P08Mvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new StopwatchViewModel();   // 코드 비하인드는 이 한 줄이 전부
        }
    }
}`;

  /* ======================= p08-4 확장 과제 ======================= */
  const SAVE_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08ExtSave.MainWindow"
        ${NS}
        Title="랩 기록 저장" Width="440" Height="400">
    <DockPanel Margin="14">
        <TextBlock x:Name="lblTime" DockPanel.Dock="Top" Text="00:00.00" FontSize="48"
                   FontFamily="Consolas" HorizontalAlignment="Center"/>
        <UniformGrid DockPanel.Dock="Top" Columns="4" Margin="0,8,0,8">
            <Button Content="시작/정지" Height="34" Margin="3" Click="BtnStartStop_Click"/>
            <Button Content="랩" Height="34" Margin="3" Click="BtnLap_Click"/>
            <Button Content="리셋" Height="34" Margin="3" Click="BtnReset_Click"/>
            <Button Content="💾 저장" Height="34" Margin="3" Click="BtnSave_Click"/>
        </UniformGrid>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,6,0,0" Foreground="Gray"
                   TextWrapping="Wrap" Text="랩을 몇 개 기록한 뒤 저장해 보세요."/>
        <ListBox x:Name="lstLaps" FontFamily="Consolas" FontSize="14"/>
    </DockPanel>
</Window>`;

  const SAVE_TOP = String.raw`// ===== File: MainWindow.xaml.cs =====
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Threading;
using Microsoft.Win32;

namespace P08ExtSave
{
    public class Lap
    {
        public int No { get; }
        public TimeSpan Time { get; }
        public TimeSpan Total { get; }
        public Lap(int no, TimeSpan time, TimeSpan total) { No = no; Time = time; Total = total; }
    }

    public partial class MainWindow : Window
    {
        private readonly Stopwatch sw = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private readonly List<Lap> laps = new List<Lap>();
        private TimeSpan lastLapTotal = TimeSpan.Zero;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(30);
            timer.Tick += (s, e) => lblTime.Text = Format(sw.Elapsed);
        }

        private void BtnStartStop_Click(object sender, RoutedEventArgs e)
        {
            if (sw.IsRunning) { sw.Stop(); timer.Stop(); lblTime.Text = Format(sw.Elapsed); }
            else { sw.Start(); timer.Start(); }
        }

        private void BtnLap_Click(object sender, RoutedEventArgs e)
        {
            if (!sw.IsRunning) return;
            TimeSpan total = sw.Elapsed;
            Lap lap = new Lap(laps.Count + 1, total - lastLapTotal, total);
            lastLapTotal = total;
            laps.Add(lap);
            lstLaps.Items.Insert(0, $"랩 {lap.No,2}   {Format(lap.Time)}   {Format(lap.Total)}");
        }

        private void BtnReset_Click(object sender, RoutedEventArgs e)
        {
            sw.Reset(); timer.Stop();
            laps.Clear(); lstLaps.Items.Clear();
            lastLapTotal = TimeSpan.Zero;
            lblTime.Text = Format(TimeSpan.Zero);
        }
`;

  const E1_STARTER = String.raw`${SAVE_XAML}
${SAVE_TOP}
        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: 랩이 없으면 "저장할 랩이 없습니다." 알림 후 끝
            // TODO 2: SaveFileDialog — Filter "CSV 파일 (*.csv)|*.csv|텍스트 파일 (*.txt)|*.txt",
            //         기본 이름 "랩기록_20250101_0930.csv" 처럼 현재 시각으로. 취소하면 끝
            // TODO 3: 첫 줄 "번호,랩 시간,전체 시간" + 랩마다 "1,00:18.42,00:18.42" 줄을 만들어
            //         File.WriteAllLines 로 저장 (IOException 은 오류 메시지로)
            // TODO 4: lblInfo 에 "저장했습니다: 파일이름 (n개)" 표시
        }

        private static string Format(TimeSpan t) => t.ToString(@"mm\:ss\.ff");
    }
}`;

  const E1_SOLUTION = String.raw`${SAVE_XAML}
${SAVE_TOP}
        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            if (laps.Count == 0)
            {
                MessageBox.Show("저장할 랩이 없습니다.", "랩 저장", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Title = "랩 기록 저장";
            dlg.Filter = "CSV 파일 (*.csv)|*.csv|텍스트 파일 (*.txt)|*.txt";
            dlg.DefaultExt = ".csv";
            dlg.FileName = $"랩기록_{DateTime.Now:yyyyMMdd_HHmm}.csv";
            if (dlg.ShowDialog() != true) return;          // 취소

            List<string> lines = new List<string> { "번호,랩 시간,전체 시간" };
            foreach (Lap lap in laps)                        // 저장은 1번 랩부터 순서대로
                lines.Add($"{lap.No},{Format(lap.Time)},{Format(lap.Total)}");

            try
            {
                File.WriteAllLines(dlg.FileName, lines);
                lblInfo.Text = $"저장했습니다: {Path.GetFileName(dlg.FileName)} ({laps.Count}개)";
            }
            catch (IOException ex)
            {
                MessageBox.Show("저장하지 못했습니다.\n" + ex.Message, "오류", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private static string Format(TimeSpan t) => t.ToString(@"mm\:ss\.ff");
    }
}`;

  const TVM_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P08ExtMvvm.MainWindow"
        ${NS}
        Title="타이머 — MVVM" Width="400" Height="320">
    <StackPanel Margin="16">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
            <TextBox Text="{Binding SecondsText, UpdateSourceTrigger=PropertyChanged}" Width="70"
                     FontSize="18" TextAlignment="Center"/>
            <TextBlock Text="초" FontSize="16" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <TextBlock Text="{Binding RemainText}" FontSize="52" FontFamily="Consolas"
                   HorizontalAlignment="Center" Margin="0,8,0,4"/>
        <ProgressBar Value="{Binding Progress}" Maximum="100" Height="16"/>
        <UniformGrid Columns="2" Margin="0,12,0,0">
            <Button Content="시작" Command="{Binding StartCommand}" Height="34" Margin="3"/>
            <Button Content="리셋" Command="{Binding ResetCommand}" Height="34" Margin="3"/>
        </UniformGrid>
        <TextBlock Text="{Binding Message}" Foreground="Gray" HorizontalAlignment="Center" Margin="0,8,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P08ExtMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new TimerViewModel();
        }
    }
}`;

  const E2_STARTER = String.raw`${VMBASE('P08ExtMvvm')}
// ===== File: TimerViewModel.cs =====
using System;
using System.Diagnostics;
using System.Windows.Input;
using System.Windows.Threading;

namespace P08ExtMvvm
{
    public class TimerViewModel : ViewModelBase
    {
        private readonly Stopwatch watch = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private TimeSpan duration = TimeSpan.Zero;
        private string secondsText = "10";
        private string remainText = "00:10";
        private double progress = 0;
        private string message = "초를 입력하고 시작을 누르세요.";

        public string SecondsText { get => secondsText; set => SetProperty(ref secondsText, value); }
        public string RemainText { get => remainText; private set => SetProperty(ref remainText, value); }
        public double Progress { get => progress; private set => SetProperty(ref progress, value); }
        public string Message { get => message; private set => SetProperty(ref message, value); }

        public ICommand StartCommand { get; }
        public ICommand ResetCommand { get; }

        public TimerViewModel()
        {
            timer.Interval = TimeSpan.FromMilliseconds(100);
            timer.Tick += (s, e) => OnTick();
            // TODO 1: StartCommand — 할 일 Start(), 도는 중이 아닐 때만
            // TODO 2: ResetCommand — 할 일 Reset(), 시작한 적이 있을 때만 (duration != Zero)
            StartCommand = new RelayCommand(_ => { });
            ResetCommand = new RelayCommand(_ => { });
        }

        private void Start()
        {
            // TODO 3: SecondsText 를 int 로 (1 ~ 3600 이 아니면 Message 에 안내하고 끝)
            // TODO 4: duration 설정 → watch.Restart() → timer.Start() → Message 갱신
            CommandManager.InvalidateRequerySuggested();
        }

        private void OnTick()
        {
            // TODO 5: remain = duration − 흐른 시간. 0 이하면 멈추고 RemainText "00:00", Progress 100,
            //         Message "⏰ 시간 종료!" (그리고 InvalidateRequerySuggested)
            // TODO 6: 아니면 RemainText · Progress 갱신
        }

        private void Reset()
        {
            // TODO 7: 멈추고 처음 상태로 (duration = Zero, Progress 0, RemainText 는 입력값으로)
            CommandManager.InvalidateRequerySuggested();
        }

        private static string Format(TimeSpan t)
        {
            TimeSpan up = TimeSpan.FromSeconds(Math.Ceiling(t.TotalSeconds));
            return $"{(int)up.TotalMinutes:00}:{up.Seconds:00}";
        }
    }
}
${TVM_XAML}`;

  const E2_SOLUTION = String.raw`${VMBASE('P08ExtMvvm')}
// ===== File: TimerViewModel.cs =====
using System;
using System.Diagnostics;
using System.Windows.Input;
using System.Windows.Threading;

namespace P08ExtMvvm
{
    public class TimerViewModel : ViewModelBase
    {
        private readonly Stopwatch watch = new Stopwatch();
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private TimeSpan duration = TimeSpan.Zero;
        private string secondsText = "10";
        private string remainText = "00:10";
        private double progress = 0;
        private string message = "초를 입력하고 시작을 누르세요.";

        public string SecondsText { get => secondsText; set => SetProperty(ref secondsText, value); }
        public string RemainText { get => remainText; private set => SetProperty(ref remainText, value); }
        public double Progress { get => progress; private set => SetProperty(ref progress, value); }
        public string Message { get => message; private set => SetProperty(ref message, value); }

        public ICommand StartCommand { get; }
        public ICommand ResetCommand { get; }

        public TimerViewModel()
        {
            timer.Interval = TimeSpan.FromMilliseconds(100);
            timer.Tick += (s, e) => OnTick();
            StartCommand = new RelayCommand(_ => Start(), _ => !watch.IsRunning);
            ResetCommand = new RelayCommand(_ => Reset(), _ => duration != TimeSpan.Zero);
        }

        private void Start()
        {
            if (!int.TryParse(SecondsText, out int sec) || sec < 1 || sec > 3600)
            {
                Message = "1 ~ 3600 사이의 초를 입력하세요.";
                return;
            }
            duration = TimeSpan.FromSeconds(sec);
            watch.Restart();
            timer.Start();
            Message = $"{sec}초 타이머 진행 중";
            CommandManager.InvalidateRequerySuggested();
        }

        private void OnTick()
        {
            TimeSpan remain = duration - watch.Elapsed;
            if (remain <= TimeSpan.Zero)
            {
                timer.Stop();
                watch.Stop();
                RemainText = "00:00";
                Progress = 100;
                Message = "⏰ 시간 종료!";
                CommandManager.InvalidateRequerySuggested();   // 입력 없이 상태가 바뀌었으니 직접 알린다
                return;
            }
            RemainText = Format(remain);
            Progress = watch.Elapsed.TotalMilliseconds / duration.TotalMilliseconds * 100;
        }

        private void Reset()
        {
            timer.Stop();
            watch.Reset();
            duration = TimeSpan.Zero;
            Progress = 0;
            RemainText = int.TryParse(SecondsText, out int sec) && sec > 0 ? Format(TimeSpan.FromSeconds(sec)) : "00:00";
            Message = "리셋했습니다.";
            CommandManager.InvalidateRequerySuggested();
        }

        private static string Format(TimeSpan t)
        {
            TimeSpan up = TimeSpan.FromSeconds(Math.Ceiling(t.TotalSeconds));
            return $"{(int)up.TotalMinutes:00}:{up.Seconds:00}";
        }
    }
}
${TVM_XAML}`;

  CS_COURSE.addChapter({
    id: 'p08',
    no: 'P08',
    title: 'WPF 스톱워치 · 타이머',
    subtitle: 'Stopwatch · DispatcherTimer · TimeSpan · TabControl',
    summary: '1/100초까지 재는 스톱워치와 분 · 초를 입력해 거꾸로 세는 타이머를 탭 두 개로 된 WPF 프로그램으로 만듭니다. 화면 갱신은 DispatcherTimer 가, 정확한 시간 측정은 Stopwatch 가 맡도록 역할을 나누고, 시작 · 정지 · 리셋 · 랩 버튼을 “상태” 에 따라 켜고 끄며, 랩 목록에서 가장 빠른 · 느린 랩을 색으로 강조합니다. 타이머는 입력을 검사하고 ProgressBar 로 진행률을 보여 주다가 끝나면 MessageBox 로 알립니다. 마지막에는 같은 스톱워치를 MVVM(ViewModel + 명령 + 바인딩)으로 다시 만들어 봅니다.',
    goals: [
      'DispatcherTimer(화면 갱신)와 Stopwatch(시간 측정)의 역할을 나누어 정확한 경과 시간을 표시할 수 있다',
      'TimeSpan 의 속성 · 연산과 사용자 지정 서식(mm\\:ss\\.ff)으로 시간을 원하는 모양으로 나타낼 수 있다',
      '프로그램의 상태(준비 · 측정 중 · 일시 정지)를 설계하고 한 메서드에서 버튼의 IsEnabled 를 결정할 수 있다',
      '랩 기록을 List 에 보관하고 LINQ(Min · Max)와 ListBoxItem 으로 최고 · 최저 랩을 강조할 수 있다',
      '카운트다운 타이머의 입력을 검사하고 ProgressBar · MessageBox 로 진행과 종료를 알릴 수 있다',
      'TabControl 로 두 기능을 한 창에 합치고, 같은 기능을 MVVM 구조로 리팩터링할 수 있다'
    ],
    requires: ['ch12', 'ch16', 'ch17', 'ch22'],
    preview: 'assets/shots/p08-final.png',
    previewCode: EX_FINAL,
    sections: [
      /* ===================== p08-1 ===================== */
      {
        id: 'p08-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '스톱워치 · 타이머의 기능을 요구사항 표로 정리하고 화면을 스케치할 수 있다',
          '준비 · 측정 중 · 일시 정지 세 상태와 버튼의 관계를 상태 다이어그램으로 설계할 수 있다',
          'DispatcherTimer 의 Interval · Tick · Start · Stop 을 쓰고, 틱을 세는 방식이 왜 부정확한지 설명할 수 있다',
          'Stopwatch 와 TimeSpan 으로 경과 시간을 재고 “mm:ss.ff” 형식으로 나타낼 수 있다'
        ],
        flow: [['도입 · 완성 프로그램 시연', 5], ['요구사항 · 화면 스케치', 8], ['상태 설계', 8], ['DispatcherTimer vs Stopwatch', 14], ['TimeSpan 서식', 8], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '이번 프로젝트는 휴대폰 “시계” 앱에 들어 있는 <b>스톱워치(stopwatch)</b>와 <b>타이머(timer)</b>를 WPF 로 만드는 것입니다. 스톱워치는 0 부터 시간이 <b>올라가며</b> 1/100초까지 보여 주고, 달리기 한 바퀴처럼 구간 기록인 <b>랩(lap)</b>을 남길 수 있습니다. 타이머는 3분처럼 정한 시간에서 <b>거꾸로</b> 세다가 0 이 되면 알려 줍니다. 두 기능은 탭(TabControl)으로 한 창에 넣습니다.' },
          { type: 'p', html: '겉보기에는 단순하지만, 이 프로젝트에는 윈도우 프로그램의 중요한 기술이 여럿 들어 있습니다. ① 일정한 간격으로 화면을 다시 그리는 <b>타이머</b>, ② 실제로 흐른 시간을 정확히 재는 <b>측정</b>, ③ 지금 누를 수 있는 버튼만 켜 두는 <b>상태 관리</b>, ④ 사용자의 입력을 믿지 않는 <b>입력 검사</b>입니다.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '설명'], rows: [
            ['F1', '스톱워치 표시', '경과 시간을 <code>mm:ss.ff</code>(분:초.1/100초)로 크게 표시, 1시간이 넘으면 <code>h:mm:ss.ff</code>'],
            ['F2', '시작 · 정지 · 계속', '정지하면 그 순간의 시간이 그대로 남고, 다시 누르면 <b>이어서</b> 잰다'],
            ['F3', '리셋', '멈춰 있을 때만 0 으로 되돌리고 랩 기록도 지운다'],
            ['F4', '랩', '측정 중에만 누를 수 있고, 이번 랩 시간과 전체 시간을 목록 맨 위에 추가'],
            ['F5', '최고 · 최저 랩', '랩이 2개 이상이면 가장 빠른 랩은 초록, 가장 느린 랩은 빨강으로 강조'],
            ['F6', '타이머 입력', '분(0~99) · 초(0~59)를 입력. 숫자가 아니거나 범위를 벗어나면 경고'],
            ['F7', '타이머 진행', '남은 시간과 진행 막대(ProgressBar) 표시, 일시 정지 · 계속 · 리셋'],
            ['F8', '타이머 종료', '0 이 되면 진행 막대 100% + 메시지 상자로 알림, 마지막 10초는 빨간 글씨'],
            ['F9', '두 화면', 'TabControl 의 탭으로 스톱워치 / 타이머 전환 (둘 다 동시에 돌 수 있음)']
          ], caption: '기능 요구사항' },
          { type: 'figure', html: SVG_UI, caption: '완성 화면 스케치 — 점선 버튼은 지금 누를 수 없는(IsEnabled="False") 버튼' },
          { type: 'h', text: '3. 상태 설계 — 버튼은 상태가 정한다' },
          { type: 'p', html: '스톱워치에는 세 가지 <b>상태(state)</b>가 있습니다. 아무것도 재지 않은 <b>준비</b>, 시간이 흐르는 <b>측정 중</b>, 멈췄지만 잰 시간이 남아 있는 <b>일시 정지</b>입니다. 버튼을 누를 때마다 상태가 바뀌고, 상태마다 누를 수 있는 버튼이 다릅니다. 측정 중에 “리셋” 이 눌리거나, 준비 상태에서 “랩” 이 눌리면 이상한 기록이 생기므로 <b>그 상태에서 의미 없는 버튼은 꺼 두는 것</b>이 좋은 설계입니다.' },
          { type: 'figure', html: SVG_STATE, caption: '스톱워치 상태 다이어그램 — 화살표 = 버튼, 동그라미 = 상태' },
          { type: 'table', head: ['상태', '판단 방법', '시작', '정지', '랩', '리셋'], rows: [
            ['준비', '<code>!IsRunning</code> 이고 <code>Elapsed == 0</code>', '✔ “시작”', '—', '—', '—'],
            ['측정 중', '<code>IsRunning</code>', '—', '✔', '✔', '—'],
            ['일시 정지', '<code>!IsRunning</code> 이고 <code>Elapsed &gt; 0</code>', '✔ “계속”', '—', '—', '✔']
          ], caption: '상태별 버튼 표 — 이 표가 그대로 UpdateButtons() 메서드가 된다' },
          { type: 'callout', kind: 'tip', title: '상태를 따로 변수로 두지 않아도 된다', html: '상태를 <code>enum State { Ready, Running, Paused }</code> 변수로 두는 방법도 있지만, 이 프로젝트에서는 <code>Stopwatch</code> 가 이미 <code>IsRunning</code>(도는 중?)과 <code>Elapsed</code>(잰 시간)를 알고 있으므로 두 값에서 상태를 <b>계산</b>합니다. 같은 정보를 두 곳에 두면 한쪽만 바꾸는 실수가 생기기 쉽습니다(“진실은 한 곳에”).' },
          { type: 'h', text: '4. 시간을 다루는 두 도구 — DispatcherTimer 와 Stopwatch' },
          { type: 'p', html: '<code>System.Windows.Threading.DispatcherTimer</code> 는 <b>정해진 간격마다 이벤트를 보내 주는 알람</b>입니다. <code>Interval</code> 에 간격을 정하고 <code>Tick</code> 이벤트에 처리기를 연결한 뒤 <code>Start()</code> 하면, 간격마다 <code>Tick</code> 처리기가 불립니다. <code>Stop()</code> 으로 멈추고, <code>IsEnabled</code> 로 도는 중인지 알 수 있습니다. 가장 중요한 특징은 <code>Tick</code> 이 <b>UI 스레드</b>(화면을 담당하는 스레드)에서 불린다는 점입니다. 그래서 처리기 안에서 <code>lblTime.Text = …</code> 처럼 컨트롤을 <b>바로</b> 바꿀 수 있습니다.' },
          { type: 'table', head: ['멤버', '뜻', '예'], rows: [
            ['<code>Interval</code>', 'Tick 사이의 간격 (<code>TimeSpan</code>)', '<code>timer.Interval = TimeSpan.FromMilliseconds(100);</code>'],
            ['<code>Tick</code>', '간격마다 발생하는 이벤트 (<code>EventHandler</code>)', '<code>timer.Tick += Timer_Tick;</code>'],
            ['<code>Start()</code> · <code>Stop()</code>', '돌리기 · 멈추기', '버튼 처리기에서'],
            ['<code>IsEnabled</code>', '도는 중이면 <code>true</code>', '<code>if (timer.IsEnabled) …</code>']
          ], caption: 'DispatcherTimer — using System.Windows.Threading' },
          { type: 'p', html: '그런데 DispatcherTimer 는 “정확히 100ms 마다” 가 아니라 “<b>100ms 가 지난 뒤 UI 스레드가 한가해지면</b>” 부릅니다. 화면을 그리거나, 다른 이벤트를 처리하거나, 창을 끌고 있으면 틱이 조금씩 늦게 옵니다. 그래서 “틱이 10번 왔으니 1초” 처럼 <b>틱을 세어 시간을 계산하면 오차가 계속 쌓입니다</b>. 시간 값은 <code>System.Diagnostics.Stopwatch</code> 에게 물어야 합니다. Stopwatch 는 컴퓨터의 고해상도 시계로 <code>Start()</code> 이후 흐른 실제 시간을 <code>Elapsed</code>(<code>TimeSpan</code>)로 알려 줍니다.' },
          { type: 'figure', html: SVG_TICK, caption: '틱은 “다시 그려라” 신호일 뿐 — 시간 값은 Stopwatch.Elapsed 에서 읽는다' },
          { type: 'code', title: '준비 예제 1. 틱을 세는 시간 vs Stopwatch 로 잰 시간', code: EX_TICK, desc: '0.1초 간격 타이머의 틱 횟수로 계산한 시간(①)과 <code>Stopwatch.Elapsed</code>(②)를 나란히 보여 줍니다. 잠시 켜 두면 ① 이 ② 보다 점점 <b>뒤처지는</b> 것을 볼 수 있습니다(차이 값이 커짐). 창 제목 막대를 잡고 끌어 보거나 다른 프로그램을 쓰면 차이가 더 벌어집니다. <code>Timer_Tick</code> 의 매개변수는 <code>object? sender, EventArgs e</code> — <code>Tick</code> 이 일반 <code>EventHandler</code> 이기 때문입니다(버튼의 <code>RoutedEventArgs</code> 와 다름). <code>멈춤</code> 을 누르면 둘 다 멈추고, <code>계속</code> 을 누르면 Stopwatch 는 멈췄던 시간부터 <b>이어서</b> 잽니다.' },
          { type: 'table', head: ['Stopwatch 멤버', '뜻'], rows: [
            ['<code>Start()</code>', '재기 시작 (멈춰 있었다면 이어서)'],
            ['<code>Stop()</code>', '멈춤 — <code>Elapsed</code> 는 그대로 남는다'],
            ['<code>Reset()</code>', '멈추고 <code>Elapsed</code> 를 0 으로'],
            ['<code>Restart()</code>', '<code>Reset()</code> + <code>Start()</code> — 0 부터 다시'],
            ['<code>Stopwatch.StartNew()</code>', '만들면서 바로 시작하는 정적 메서드'],
            ['<code>IsRunning</code> · <code>Elapsed</code>', '재는 중인가? · 지금까지 잰 시간(<code>TimeSpan</code>)']
          ], caption: 'Stopwatch — using System.Diagnostics' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 타이머가 여러 종류인 이유', html: '<ul><li>.NET 에는 <code>System.Timers.Timer</code>, <code>System.Threading.Timer</code> 도 있습니다. 이 둘은 Tick(Elapsed) 을 <b>다른 스레드</b>에서 부르므로, 처리기에서 컨트롤을 바로 만지면 “다른 스레드가 이 개체를 소유하고 있어…” 예외가 납니다(<code>Dispatcher.Invoke</code> 가 필요). WPF 화면을 갱신하는 용도라면 <b><code>DispatcherTimer</code></b> 가 정답입니다.</li><li>애니메이션처럼 “화면을 그릴 때마다” 불리는 <code>CompositionTarget.Rendering</code> 이벤트도 있습니다(22장). 스톱워치에는 30ms 정도의 DispatcherTimer 면 충분합니다.</li></ul>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 프로젝트 준비', html: '<ul><li><b>새 프로젝트 ▸ WPF 애플리케이션</b>(.NET 8 이상)을 고르고 이름을 <code>StopwatchApp</code> 처럼 정합니다. 예제의 <code>P08Prep1</code> 같은 네임스페이스는 여러분의 프로젝트 이름으로 바꾸세요(XAML 의 <code>x:Class</code> 와 코드의 <code>namespace</code> 를 <b>함께</b>).</li><li><code>Stopwatch</code> 에 빨간 물결선이 생기면 커서를 두고 <kbd>Ctrl</kbd>+<kbd>.</kbd> → <b>using System.Diagnostics;</b> 를 고르면 됩니다. <code>DispatcherTimer</code> 는 <code>System.Windows.Threading</code> 입니다.</li><li><code>timer.Tick += </code> 까지 입력하고 <kbd>Tab</kbd> 을 누르면 Visual Studio 가 처리기 메서드를 자동으로 만들어 줍니다.</li></ul>' },
          { type: 'h', text: '5. TimeSpan — 시간의 길이' },
          { type: 'p', html: '<code>Stopwatch.Elapsed</code> 는 <code>TimeSpan</code>(시간 간격) 구조체입니다. <code>Minutes</code> · <code>Seconds</code> · <code>Milliseconds</code> 는 “시계 바늘” 처럼 각 자리의 값이고, <code>TotalMinutes</code> · <code>TotalSeconds</code> 는 전체를 그 단위로 나타낸 실수입니다. <code>+</code> · <code>-</code> · <code>&lt;</code> 같은 연산도 됩니다. 화면에 보이는 모양은 <code>ToString("서식")</code> 으로 정합니다. TimeSpan 의 사용자 지정 서식에서 <code>:</code> 와 <code>.</code> 는 <b>역슬래시로 이스케이프</b>해야 하므로 보통 verbatim 문자열 <code>@"mm\\:ss\\.ff"</code> 로 씁니다.' },
          { type: 'code', title: '준비 예제 2. TimeSpan 의 속성 · 연산 · 서식', code: EX_TIMESPAN, expect: '00:01:23.4560000\n1분 23초 456밀리초\n전체 초: 83.456\n01:23.45\n1:23\n합계 00:22.21, 차이 00:02.47\n랩 2 가 더 빠르다\n05:30\n65:30', desc: '<code>ff</code> 는 1/100초 자리로, 반올림이 아니라 <b>버림</b>입니다(83.456초 → <code>.45</code>). 두 랩의 합과 차를 <code>+</code> · <code>-</code> 로 구하고, <code>&lt;</code> 로 어느 랩이 빠른지 비교했습니다. 마지막 두 줄이 중요합니다. 1시간 5분 30초를 <code>mm\\:ss</code> 로 쓰면 <code>mm</code> 은 “분 자리(0~59)” 만 보여 주므로 1시간이 사라져 <code>05:30</code> 이 됩니다. 60분이 넘는 시간을 분으로 모두 보여 주려면 <code>(int)TotalMinutes</code> 를 직접 씁니다.' },
          { type: 'table', head: ['서식 문자', '뜻', '83.456초일 때'], rows: [
            ['<code>h</code> · <code>hh</code>', '시 자리 (0~23)', '<code>0</code> · <code>00</code>'],
            ['<code>m</code> · <code>mm</code>', '분 자리 (0~59)', '<code>1</code> · <code>01</code>'],
            ['<code>s</code> · <code>ss</code>', '초 자리 (0~59)', '<code>23</code>'],
            ['<code>f</code> · <code>ff</code> · <code>fff</code>', '1/10 · 1/100 · 1/1000 초 (버림)', '<code>4</code> · <code>45</code> · <code>456</code>'],
            ['<code>\\:</code> · <code>\\.</code>', '글자 <code>:</code> · <code>.</code> 그대로 (이스케이프)', '—']
          ], caption: 'TimeSpan 사용자 지정 서식 — DateTime 의 서식과 비슷하지만 : . 를 반드시 이스케이프' },
          { type: 'callout', kind: 'warn', title: '"mm:ss" 로 쓰면 FormatException', html: 'DateTime 에서는 <code>ToString("HH:mm:ss")</code> 가 되지만, TimeSpan 에서 <code>ToString("mm:ss")</code> 를 쓰면 실행 중에 <code>FormatException</code> 이 납니다. TimeSpan 서식에서는 <code>:</code> 가 특별한 의미가 없는 “모르는 글자” 라서 반드시 <code>\\:</code> 로 써야 합니다. 일반 문자열이면 <code>"mm\\\\:ss"</code>(역슬래시 두 개), verbatim 문자열이면 <code>@"mm\\:ss"</code> 입니다.' },
          { type: 'h', text: '6. 구현 계획' },
          { type: 'table', head: ['교시', '단계', '결과물'], rows: [
            ['2교시', '단계 1 화면 + 시작 · 정지 · 리셋', 'Stopwatch + DispatcherTimer 로 도는 스톱워치'],
            ['2교시', '단계 2 버튼 상태', 'UpdateButtons() — 상태에 맞게 IsEnabled · “계속”'],
            ['2교시', '단계 3 랩', '랩 시간 = 전체 − 직전 랩 시점, 목록 맨 위에 추가'],
            ['3교시', '단계 4 최고 · 최저 랩', 'Lap 클래스 + List + LINQ Min/Max + ListBoxItem 색'],
            ['3교시', '단계 5 카운트다운 타이머', '입력 검사 · ProgressBar · 끝나면 MessageBox'],
            ['3교시', '단계 6 TabControl', '두 화면을 탭으로, 두 타이머가 동시에'],
            ['4교시', '완성 · MVVM · 확장', '완성 프로그램, ViewModel 로 리팩터링, 랩 저장 등']
          ], caption: '구현 계획' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창의 타이머', html: '이 강좌의 브라우저 실행 창에서도 <code>DispatcherTimer</code> 와 <code>Stopwatch</code> 가 그대로 동작합니다. 다만 브라우저는 <b>탭이 뒤로 가거나 창이 최소화되면</b> 타이머를 느리게 돌립니다. 이때도 Stopwatch 로 잰 시간은 정확하므로, 다시 돌아오면 올바른 시간이 보입니다 — 이것이 바로 “틱을 세지 말고 Stopwatch 에게 묻는” 이유입니다.' }
        ],
        practice: [
          {
            title: '실습 P8-1. 시간 서식 메서드 만들기',
            level: 1,
            desc: '<p>스톱워치와 타이머에서 쓸 두 서식 메서드를 콘솔 프로그램으로 먼저 완성하세요.</p><ul><li><code>Format(TimeSpan t)</code>: 1시간 미만이면 <code>mm:ss.ff</code>(예: <code>12:34.32</code>), 1시간 이상이면 <code>h:mm:ss.ff</code>(예: <code>1:02:03.45</code>)</li><li><code>FormatCountdown(TimeSpan remain)</code>: 초 단위로 <b>올림</b>한 뒤 <code>mm:ss</code>. 179.2초 → <code>03:00</code>, 0.3초 → <code>00:01</code>, 음수 → <code>00:00</code></li></ul>',
            hint: '서식 문자열은 <code>@"h\\:mm\\:ss\\.ff"</code> 처럼 verbatim 문자열로 쓰면 편합니다. 올림은 <code>Math.Ceiling(remain.TotalSeconds)</code> 로 구한 초를 <code>TimeSpan.FromSeconds</code> 로 다시 TimeSpan 으로 만듭니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION,
            expect: '00:05.67\n12:34.32\n1:02:03.45\n03:00\n00:01\n00:00'
          },
          {
            title: '실습 P8-2. DispatcherTimer 로 디지털 시계',
            level: 1,
            desc: '<p><code>DispatcherTimer</code> 로 현재 시각을 보여 주는 시계를 만드세요.</p><ul><li>생성자에서 <code>Interval</code> 을 0.2초로 정하고 <code>Tick</code> 을 연결해 시작합니다. 첫 Tick 전에도 시각이 보이도록 바로 한 번 갱신합니다.</li><li><b>초 표시</b> 체크 상자가 켜져 있으면 <code>HH:mm:ss</code>, 꺼져 있으면 <code>HH:mm</code> 으로 표시합니다.</li><li>아래 줄에 <code>2025-03-14 (금)</code> 처럼 날짜와 요일을 표시합니다.</li></ul>',
            hint: '시각은 <code>DateTime.Now.ToString("HH:mm:ss")</code>. 요일은 서식 <code>ddd</code>. 체크 상자 상태는 <code>chkSeconds.IsChecked == true</code>(bool? 이므로 == true). 간격을 1초로 하면 초가 바뀌는 순간을 최대 1초까지 놓칠 수 있으므로 더 짧게 잡습니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: 'DispatcherTimer 의 Tick 처리기에서 <code>lblTime.Text</code> 를 바로 바꿔도 되는 이유는?', options: ['Tick 이 정확히 Interval 마다 오기 때문에', 'Tick 이 UI 스레드에서 불리기 때문에', 'TextBlock 은 어느 스레드에서나 바꿀 수 있기 때문에', 'Stopwatch 가 함께 돌기 때문에'], answer: 1, explain: 'DispatcherTimer 는 UI 스레드의 Dispatcher 를 통해 Tick 을 보내므로 컨트롤을 직접 만져도 됩니다. System.Timers.Timer 처럼 다른 스레드에서 불리는 타이머는 Dispatcher.Invoke 가 필요합니다.' },
          { q: '0.1초 간격 DispatcherTimer 의 Tick 이 600번 왔다. 실제로 흐른 시간에 대한 설명으로 옳은 것은?', options: ['정확히 60초다', '60초보다 짧다', '대개 60초보다 조금 길다 — 틱이 늦게 오는 만큼 쌓이므로', '알 수 없다 — Tick 은 무작위로 온다'], answer: 2, explain: '틱은 “간격이 지난 뒤 UI 스레드가 한가해지면” 오므로 조금씩 늦습니다. 그 지연이 쌓여 실제 시간은 60초보다 길어집니다. 시간은 Stopwatch.Elapsed 로 읽어야 합니다.' },
          { q: '<code>TimeSpan t = TimeSpan.FromSeconds(83.456);</code> 일 때 <code>t.ToString(@"mm\\:ss\\.ff")</code> 의 결과는?', options: ['01:23.45', '01:23.46', '83:45.60', '1:23.456'], answer: 0, explain: '<code>mm</code> = 분 자리(01), <code>ss</code> = 초 자리(23), <code>ff</code> = 1/100초 자리이며 반올림이 아니라 버림이므로 45 입니다.' },
          { q: '스톱워치가 <b>일시 정지</b> 상태라는 것을 Stopwatch 로 판단하는 식은?', options: ['<code>sw.IsRunning</code>', '<code>sw.Elapsed == TimeSpan.Zero</code>', '<code>sw.IsRunning &amp;&amp; sw.Elapsed &gt; TimeSpan.Zero</code>', '<code>!sw.IsRunning &amp;&amp; sw.Elapsed &gt; TimeSpan.Zero</code>'], answer: 3, explain: '멈춰 있고(<code>!IsRunning</code>) 잰 시간이 남아 있으면(<code>Elapsed &gt; 0</code>) 일시 정지입니다. 멈춰 있고 0 이면 준비 상태입니다.' },
          { q: '1시간 5분 30초를 <code>"65:30"</code> 처럼 전체 분으로 보여 주는 코드는?', options: ['<code>t.ToString(@"mm\\:ss")</code>', '<code>$"{(int)t.TotalMinutes}:{t.Seconds:00}"</code>', '<code>$"{t.Minutes}:{t.Seconds}"</code>', '<code>t.ToString("HH:mm")</code>'], answer: 1, explain: '<code>mm</code> 과 <code>Minutes</code> 는 “분 자리(0~59)” 라서 5 가 됩니다. 전체 분은 <code>TotalMinutes</code>(65.5)를 정수로 바꿔 씁니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: '스톱워치 · 타이머 — 상태 설계 · DispatcherTimer · Stopwatch · TimeSpan', badge: 'Project 08 · 1교시',
            notes: '<p><b>[도입 3분]</b> 완성 프로그램(4교시 완성 예제)을 먼저 실행해 보여 줍니다. 스톱워치 시작 → 랩 몇 번 → 최고/최저 랩 색 → 타이머 탭에서 10초 설정 → 끝나면 메시지 상자.</p><p>발문: “스톱워치를 만들려면 1/100초마다 무언가가 일어나야 할 텐데, 그걸 누가 해 줄까?”</p>' },
          { layout: 'table', title: '무엇을 만들까? — 요구사항', head: ['번호', '기능'], rows: [
            ['F1 · F2', '스톱워치 표시(mm:ss.ff) · 시작/정지/계속'],
            ['F3 · F4', '리셋 · 랩(이번 랩 + 전체 시간)'],
            ['F5', '최고 랩 초록 · 최저 랩 빨강'],
            ['F6 · F7 · F8', '타이머 입력 검사 · 진행 막대 · 끝나면 알림'],
            ['F9', 'TabControl 로 두 화면']
          ],
            notes: '<p><b>[4분]</b> 본문의 요구사항 표를 줄여 보여 줍니다. 학생들에게 “휴대폰 시계 앱의 스톱워치에서 빠진 기능은?” 을 물어 한두 개를 확장 과제 후보로 칠판에 적어 둡니다(예: 랩 저장, 알림 소리).</p>' },
          { layout: 'diagram', title: '화면 스케치', html: SVG_UI, caption: '점선 버튼 = 지금 누를 수 없음 (IsEnabled="False")',
            notes: '<p><b>[3분]</b> 레이아웃: DockPanel — 시간(Top) · 상태(Top) · 버튼 4개 UniformGrid(Top) · 랩 ListBox(마지막 = 나머지). 15장 복습.</p><p>시간 표시는 고정폭 글꼴(Consolas)을 써야 숫자가 바뀔 때 글자가 좌우로 흔들리지 않는다는 점을 짚어 주세요.</p>' },
          { layout: 'diagram', title: '상태 다이어그램', html: SVG_STATE, caption: '준비 → 측정 중 ⇄ 일시 정지 → 준비',
            notes: '<p><b>[5분]</b> 화살표 하나하나를 “어떤 버튼을 누르면 어디로 가는가” 로 읽어 봅니다. 랩은 상태를 바꾸지 않고 기록만 추가합니다.</p><p>발문: “측정 중에 리셋을 누를 수 있게 하면 어떤 문제가 생길까?” → 시간이 도는 중에 0 이 되고 랩 기록이 엉킴. 그래서 끈다.</p>' },
          { layout: 'table', title: '상태별 버튼 = UpdateButtons()', head: ['상태', '판단', '켜지는 버튼'], rows: [
            ['준비', '!IsRunning, Elapsed == 0', '시작'],
            ['측정 중', 'IsRunning', '정지 · 랩'],
            ['일시 정지', '!IsRunning, Elapsed &gt; 0', '계속 · 리셋']
          ],
            notes: '<p><b>[3분]</b> 상태 변수를 따로 두지 않고 Stopwatch 의 두 값으로 “계산” 한다는 점을 강조합니다. 이 표가 다음 시간의 UpdateButtons() 메서드와 1:1 로 대응합니다.</p>' },
          { layout: 'bullets', title: 'DispatcherTimer — UI 스레드의 알람', bullets: ['<code>Interval</code> — 간격 (<code>TimeSpan.FromMilliseconds(100)</code>)', '<code>Tick</code> — 간격마다 오는 이벤트 (<code>EventHandler</code>)', '<code>Start()</code> · <code>Stop()</code> · <code>IsEnabled</code>', 'Tick 은 <b>UI 스레드</b>에서 → 컨트롤을 바로 바꿔도 된다', ['단, “정확히” 가 아니라 “지난 뒤 한가할 때”']],
            notes: '<p><b>[4분]</b> 22장에서 배운 타이머를 복습합니다(아직 22장을 안 했다면 여기서 처음 소개). 핵심 두 가지: UI 스레드라서 안전하다, 정확한 시계는 아니다.</p>' },
          { layout: 'code', title: '준비 예제 1. 틱을 세면 밀린다', code: SL_TICK, points: ['틱 횟수 × 0.1 = “계산한” 시간', '<code>Stopwatch.StartNew()</code> = 만들며 시작', '켜 둘수록 두 값의 차이가 벌어진다', '창을 끌면 더 벌어진다'],
            notes: '<p><b>[5분]</b> 실행해서 30초 정도 둡니다. 차이가 조금씩 벌어지는 것을 확인하고, 창을 끌어서 더 벌어지는 것도 보여 주세요.</p><p>결론을 학생 입으로 말하게 합니다: “Tick 은 다시 그리라는 신호, 시간은 Stopwatch 에게 묻는다.”</p>' },
          { layout: 'diagram', title: '역할 나누기', html: SVG_TICK, caption: 'Tick = 다시 그리기 신호, 시간 값 = Stopwatch.Elapsed',
            notes: '<p><b>[2분]</b> 그림으로 정리. 브라우저 탭을 뒤로 보내면 타이머가 느려지지만 돌아오면 시간이 정확하다는 것도 이 원리 덕분입니다.</p>' },
          { layout: 'code', title: '준비 예제 2. TimeSpan 서식', code: SL_TIMESPAN, points: ['<code>@"mm\\:ss\\.ff"</code> — <code>:</code> <code>.</code> 는 이스케이프', '<code>ff</code> 는 버림 (반올림 아님)', '<code>mm</code> 은 분 “자리” — 60분이 넘으면 <code>TotalMinutes</code>'],
            notes: '<p><b>[5분]</b> 실행 후 한 줄씩 결과를 확인합니다. 학생 한 명에게 <code>"mm:ss"</code>(이스케이프 없이)로 바꿔 실행하게 해 FormatException 을 직접 보게 하면 기억에 오래 남습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '0.1초 간격 DispatcherTimer 의 Tick 이 600번 왔다. 실제로 흐른 시간은?', options: ['정확히 60초', '60초보다 짧다', '대개 60초보다 조금 길다', '알 수 없다'], answer: 2, explain: '틱은 조금씩 늦게 오고 그 지연이 쌓입니다. 그래서 시간은 Stopwatch 로 잽니다.',
            notes: '<p>정답 후 “그럼 Interval 을 1ms 로 하면 정확해질까?” 라고 되물어 보세요 — 아니다, 늦게 오는 성질은 같고 부담만 커진다.</p>' },
          { layout: 'practice', title: '실습 P8-1 · P8-2', desc: '<p>P8-1: <code>Format</code>(mm:ss.ff / h:mm:ss.ff) · <code>FormatCountdown</code>(올림, mm:ss) 콘솔로 완성. P8-2: DispatcherTimer 디지털 시계(초 표시 체크 상자, 날짜 · 요일).</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[7분]</b> P8-1 은 다음 시간 코드에 그대로 쓰입니다. 음수 처리를 빠뜨리는 학생이 많습니다. 빨리 끝난 학생은 P8-2 로.</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: ['요구사항 F1~F9 · 화면 스케치', '상태 3개(준비 · 측정 중 · 일시 정지) → 버튼 IsEnabled 표', 'DispatcherTimer = UI 스레드 알람, 시간 값은 <b>Stopwatch.Elapsed</b>', 'TimeSpan 서식 <code>@"mm\\:ss\\.ff"</code> · <code>TotalMinutes</code>'],
            notes: '<p>다음 시간: 화면을 만들고 스톱워치를 실제로 돌립니다 — 시작 · 정지 · 리셋, 버튼 상태, 랩.</p>' }
        ]
      },
      /* ===================== p08-2 ===================== */
      {
        id: 'p08-2',
        title: '단계별 구현 ① — 스톱워치와 랩',
        minutes: 50,
        goals: [
          'DockPanel · UniformGrid 로 스톱워치 화면을 만들고 Stopwatch 와 DispatcherTimer 를 연결할 수 있다',
          'Start · Stop · Reset 의 차이를 알고, 정지한 순간의 시간을 정확히 표시할 수 있다',
          '상태에 따라 버튼의 IsEnabled · Content 를 한 메서드(UpdateButtons)에서 정할 수 있다',
          '“전체 − 직전 랩 시점” 으로 랩 시간을 구해 ListBox 맨 위에 추가할 수 있다'
        ],
        flow: [['도입 · 복습', 3], ['단계 1 화면 + 시작 · 정지 · 리셋', 14], ['단계 2 버튼 상태', 12], ['단계 3 랩', 11], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '단계 1. 화면 만들기 + 시작 · 정지 · 리셋' },
          { type: 'p', html: '먼저 1교시 스케치대로 화면을 만듭니다. 바깥은 <code>DockPanel</code> 로, 위에서부터 시간 표시(<code>TextBlock</code>) → 상태 글자 → 버튼 네 개를 차례로 <code>Top</code> 에 붙이고, 마지막 자식인 <code>ListBox</code> 가 남은 공간을 모두 차지하게 합니다. 버튼 네 개는 <code>UniformGrid Columns="4"</code> 에 넣어 <b>같은 너비</b>로 나란히 둡니다.' },
          { type: 'p', html: '코드에는 두 부품을 필드로 둡니다. <b>시간은 <code>Stopwatch sw</code> 가 재고</b>, <b>화면은 <code>DispatcherTimer timer</code> 가 30ms 마다 다시 그립니다</b>. 시작 버튼은 둘 다 <code>Start()</code>, 정지 버튼은 둘 다 <code>Stop()</code> 합니다. 정지할 때 <code>ShowTime()</code> 을 한 번 더 부르는 이유는, 마지막 틱과 정지 버튼 사이의 몇 ms 를 화면에 반영하기 위해서입니다.' },
          { type: 'code', title: '단계 1. 스톱워치 화면과 시작 · 정지 · 리셋', code: EX_STEP1, desc: '<code>timer.Interval</code> 을 30ms 로 잡아 1초에 약 33번 화면을 새로 그립니다. 1/100초(<code>ff</code>)를 보여 주지만 모든 1/100초를 다 그릴 필요는 없습니다 — 사람 눈에는 충분히 부드럽고, 멈춘 순간의 값은 <code>BtnStop_Click</code> 에서 정확히 다시 그립니다. <code>sw.Start()</code> 는 멈춰 있던 시간부터 <b>이어서</b> 재므로 “계속” 기능이 저절로 생깁니다. <code>sw.Reset()</code> 은 멈추고 0 으로 되돌립니다. 아직 <code>랩</code> 버튼에는 처리기가 없습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 이벤트 처리기와 디자이너', html: '<ul><li>XAML 에서 <code>Click="</code> 을 입력하면 <b>&lt;새 이벤트 처리기&gt;</b> 가 뜹니다. 그 전에 <code>x:Name="btnStart"</code> 를 먼저 붙여 두면 처리기 이름이 <code>btnStart_Click</code> 으로 만들어집니다. 이 강좌의 <code>BtnStart_Click</code> 처럼 이름을 바꾸려면 XAML 과 코드 두 곳을 함께 고치세요.</li><li>디자이너에서 <code>TextBlock</code> 의 <b>FontFamily</b> 를 <code>Consolas</code> 로 바꾸면 숫자 폭이 모두 같아져, 시간이 바뀔 때 글자가 흔들리지 않습니다.</li><li>실행 중에 XAML 을 고치면 <b>XAML 핫 다시 로드</b>로 바로 반영됩니다(글꼴 크기 · 여백 조정에 편리).</li></ul>' },
          { type: 'p', html: '단계 1 을 실행해 보면 동작은 하지만 <b>허점</b>이 보입니다. 시작을 두 번 눌러도 아무 표시가 없고, 측정 중에 리셋을 누르면 시간이 멈추며 0 이 됩니다. 상태 글자도 버튼을 누른 쪽만 알고 있습니다. 1교시에 설계한 상태 표를 코드로 옮길 차례입니다.' },
          { type: 'h', text: '단계 2. 상태에 따라 버튼 켜고 끄기' },
          { type: 'p', html: '버튼 처리기마다 “이 버튼은 끄고 저 버튼은 켜고” 를 따로 쓰면, 버튼이 늘어날수록 빠뜨리는 곳이 생깁니다. 대신 <b>상태 → 버튼</b>을 정하는 메서드 <code>UpdateButtons()</code> 를 하나 만들고, 상태가 바뀔 수 있는 모든 곳(생성자, 시작, 정지, 리셋)의 마지막에서 부릅니다. 메서드 안은 1교시의 상태 표를 그대로 옮긴 것입니다.' },
          { type: 'code', title: '단계 2. UpdateButtons() — 상태 → 버튼', code: EX_STEP2, desc: '<code>running</code> 과 <code>hasTime</code> 두 bool 로 세 상태를 구분합니다. 시작 버튼은 멈춰 있을 때만 켜지고, 잰 시간이 있으면 글자가 <code>계속</code> 으로 바뀝니다. 리셋은 <code>!running &amp;&amp; hasTime</code> — 측정 중에는 누를 수 없습니다. 상태 글자(<code>lblState</code>)도 같은 곳에서 정하므로 버튼과 어긋날 일이 없습니다. <code>Format</code> 메서드는 실습 P8-1 의 것으로, 1시간이 넘으면 시 자리를 붙입니다.' },
          { type: 'table', head: ['버튼', 'IsEnabled 식', '처음(준비)', '측정 중', '일시 정지'], rows: [
            ['시작 / 계속', '<code>!running</code>', '켜짐 “시작”', '꺼짐', '켜짐 “계속”'],
            ['정지', '<code>running</code>', '꺼짐', '켜짐', '꺼짐'],
            ['랩', '<code>running</code>', '꺼짐', '켜짐', '꺼짐'],
            ['리셋', '<code>!running &amp;&amp; hasTime</code>', '꺼짐', '꺼짐', '켜짐']
          ], caption: '단계 2 의 UpdateButtons() 결과' },
          { type: 'callout', kind: 'warn', title: 'Reset 과 Restart 를 헷갈리지 말 것', html: '<code>sw.Reset()</code> 은 “멈추고 0” 이고, <code>sw.Restart()</code> 는 “0 으로 만들고 <b>바로 다시 시작</b>” 입니다. 리셋 버튼에 <code>Restart()</code> 를 쓰면 0 이 되자마자 다시 흘러가서, 화면은 멈춰 있는데(타이머는 꺼짐) 내부 시간은 흐르는 이상한 상태가 됩니다. 다음에 시작을 누르면 0 이 아닌 곳에서 시작합니다.' },
          { type: 'h', text: '단계 3. 랩 기록' },
          { type: 'p', html: '랩 버튼을 누르면 두 가지 시간을 기록합니다. <b>전체 시간</b>은 그 순간의 <code>sw.Elapsed</code> 이고, <b>이번 랩 시간</b>은 전체 시간에서 <b>직전 랩을 눌렀을 때의 전체 시간</b>을 뺀 값입니다. 그래서 “직전 랩 시점” 을 필드 <code>lastLapTotal</code> 에 기억해 둡니다. 첫 랩의 기준점은 0 입니다.' },
          { type: 'code', title: '단계 3. 랩 — 전체 − 직전 랩 시점', code: EX_STEP3, desc: '<code>BtnLap_Click</code> 에서 <code>sw.Elapsed</code> 를 <b>한 번만</b> 읽어 <code>total</code> 에 담은 뒤 계산합니다. <code>sw.Elapsed</code> 는 읽을 때마다 값이 달라지므로, 두 번 읽으면 랩 시간과 전체 시간이 서로 맞지 않게 됩니다. <code>Items.Insert(0, …)</code> 로 0 번 자리에 끼워 넣어 최근 랩이 맨 위에 옵니다. <code>{lapNo,2}</code> 는 두 칸 너비로 오른쪽 정렬하는 서식이라, 고정폭 글꼴에서 번호가 가지런해집니다. 리셋할 때는 <code>lastLapTotal</code> · <code>lapNo</code> · 목록을 <b>모두</b> 처음으로 돌려야 합니다.' },
          { type: 'callout', kind: 'tip', title: '같은 값을 두 번 읽지 않기', html: '<code>TimeSpan lap = sw.Elapsed - lastLapTotal; lastLapTotal = sw.Elapsed;</code> 처럼 쓰면 두 번째 <code>sw.Elapsed</code> 는 첫 번째보다 조금 뒤의 값입니다. 그 차이(수 마이크로초)가 다음 랩에서 빠져 버려, 랩들을 더한 값이 전체 시간과 미세하게 달라집니다. “계속 변하는 값” 은 지역 변수에 한 번 담아 쓰는 습관을 들이세요. <code>DateTime.Now</code> 도 마찬가지입니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서 확인하기', html: '버튼이 꺼지면(<code>IsEnabled="False"</code>) 회색으로 보이고 눌리지 않습니다. 브라우저 실행 창에서는 창 전체를 끌어 옮기는 동안에도 Stopwatch 는 정확히 재지만, 화면 갱신(틱)은 잠시 멈출 수 있습니다. 놓으면 곧바로 올바른 시간으로 돌아옵니다.' }
        ],
        practice: [
          {
            title: '실습 P8-3. 버튼 하나로 시작 · 정지',
            level: 2,
            desc: '<p>휴대폰 스톱워치처럼 <b>버튼 하나</b>가 시작과 정지를 번갈아 하도록 만드세요.</p><ul><li>측정 중에 누르면 정지하고 멈춘 순간의 시간을 표시, 아니면 시작(또는 이어서).</li><li>버튼 글자: 측정 중 <code>정지</code>, 멈춤 + 잰 시간 있음 <code>계속</code>, 처음 <code>시작</code>.</li><li>리셋 버튼은 멈춰 있고 잰 시간이 있을 때만 켜집니다.</li></ul>',
            hint: '<code>sw.IsRunning</code> 으로 분기합니다. 버튼 글자와 리셋의 <code>IsEnabled</code> 는 <code>UpdateButtons()</code> 한 곳에서 정하고, 두 처리기의 마지막에서 부르세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 P8-4. 랩 통계 — 개수 · 평균 · 합계',
            level: 2,
            desc: '<p>랩을 기록할 때마다 아래 줄에 <code>랩 3개 · 평균 00:04.12 · 합계 00:12.36</code> 처럼 통계를 보여 주세요.</p><ul><li>랩 시간은 <code>List&lt;TimeSpan&gt; laps</code> 에 모읍니다(화면 목록과 별도로).</li><li>리셋하면 목록 · <code>laps</code> · <code>lastLapTotal</code> 이 모두 처음으로 돌아가고 <code>랩 0개</code> 가 표시됩니다.</li></ul>',
            hint: 'TimeSpan 에는 <code>Average</code> 가 바로 되지 않으므로 <code>Ticks</code>(100나노초 단위 long)로 계산합니다: <code>TimeSpan.FromTicks((long)laps.Average(t =&gt; t.Ticks))</code>. 합계는 <code>laps.Sum(t =&gt; t.Ticks)</code>. <code>using System.Linq;</code> 가 필요합니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '스톱워치를 정지(<code>sw.Stop()</code>)한 뒤 시작(<code>sw.Start()</code>)을 다시 누르면?', options: ['0 부터 다시 잰다', '멈췄던 시간부터 이어서 잰다', '예외가 발생한다', '아무 일도 일어나지 않는다'], answer: 1, explain: 'Stopwatch.Start() 는 누적 시간에 이어서 잽니다. 0 부터 다시 재려면 Reset() 후 Start() 또는 Restart() 를 씁니다.' },
          { q: '아래 코드의 문제점은?<pre><code>TimeSpan lap = sw.Elapsed - lastLapTotal;\nlastLapTotal = sw.Elapsed;</code></pre>', options: ['컴파일 오류가 난다', 'TimeSpan 은 뺄 수 없다', 'Elapsed 를 두 번 읽어 값이 달라지므로 랩들의 합이 전체 시간과 어긋난다', '문제없다'], answer: 2, explain: 'Elapsed 는 읽을 때마다 커집니다. 한 번만 읽어 지역 변수에 담고, 그 값으로 랩 계산과 기준점 갱신을 모두 해야 합니다.' },
          { q: '일시 정지 상태(멈춤, 잰 시간 있음)에서 단계 2 의 UpdateButtons() 가 켜 두는 버튼은?', options: ['정지 · 랩', '계속 · 리셋', '시작 · 정지 · 리셋', '랩 · 리셋'], answer: 1, explain: '<code>!running</code> 이므로 시작(글자 “계속”)이 켜지고, <code>!running &amp;&amp; hasTime</code> 이므로 리셋도 켜집니다. 정지 · 랩은 <code>running</code> 일 때만 켜집니다.' },
          { q: '최근 랩이 ListBox 의 <b>맨 위</b>에 오게 하는 코드는?', options: ['<code>lstLaps.Items.Add(text);</code>', '<code>lstLaps.Items.Insert(0, text);</code>', '<code>lstLaps.Items.Insert(lstLaps.Items.Count, text);</code>', '<code>lstLaps.SelectedIndex = 0;</code>'], answer: 1, explain: '<code>Insert(0, …)</code> 는 0 번(맨 앞) 자리에 끼워 넣고 나머지를 한 칸씩 뒤로 밉니다. <code>Add</code> 는 맨 뒤에 붙입니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ①', subtitle: '단계 1 화면 · 시작/정지/리셋 → 단계 2 버튼 상태 → 단계 3 랩', badge: 'Project 08 · 2교시',
            notes: '<p><b>[복습 3분]</b> “Tick 은 무엇이고 시간은 누구에게 묻나?” — Tick 은 다시 그리기 신호, 시간은 Stopwatch.Elapsed. 상태 다이어그램을 다시 띄워 두고 시작합니다.</p>' },
          { layout: 'bullets', title: '단계 1. 화면 구성', lead: 'DockPanel — 위에서부터 차례로, 마지막이 나머지', bullets: ['시간 <code>TextBlock</code> — FontSize 56, <b>Consolas</b>', '상태 <code>TextBlock</code> — 준비 / 측정 중 / 일시 정지', '버튼 4개 — <code>UniformGrid Columns="4"</code> = 같은 너비', '랩 <code>ListBox</code> — 마지막 자식 = 남은 공간'],
            notes: '<p><b>[3분]</b> XAML 을 함께 입력합니다. 고정폭 글꼴이 아니면 “1” 과 “8” 의 폭이 달라 숫자가 흔들린다는 것을 비례 글꼴로 바꿔 시연하면 좋습니다.</p>' },
          { layout: 'two', title: '두 부품의 역할', left: { title: 'Stopwatch sw — 시간 재기', code: 'sw.Start();   // 이어서 재기\nsw.Stop();    // 멈춤 (값 유지)\nsw.Reset();   // 멈춤 + 0\nTimeSpan t = sw.Elapsed;', run: false }, right: { title: 'DispatcherTimer timer — 화면 갱신', code: 'timer.Interval = TimeSpan.FromMilliseconds(30);\ntimer.Tick += (s, e) =>\n    lblTime.Text = sw.Elapsed.ToString(@"mm\\:ss\\.ff");\ntimer.Start();  /  timer.Stop();', run: false },
            notes: '<p><b>[4분]</b> 시작 = 둘 다 Start, 정지 = 둘 다 Stop. 정지할 때 한 번 더 그리는 이유(마지막 틱 이후의 몇 ms)를 설명합니다.</p><p>30ms 인 이유: 1초에 33번이면 눈에 충분히 부드럽고, 1ms 로 해도 더 정확해지지 않는다(1교시 결론).</p>' },
          { layout: 'bullets', title: '단계 1 의 허점', bullets: ['시작을 두 번 눌러도 아무 표시 없음', '측정 중 리셋 → 시간이 0 이 되며 멈춤', '준비 상태에서도 정지 · 리셋이 눌림', '→ 1교시의 상태 표를 코드로!'],
            notes: '<p><b>[2분]</b> 학생들에게 직접 단계 1 을 실행하며 “이상한 동작” 을 찾게 합니다. 찾은 것을 칠판에 적고 단계 2 로 해결합니다.</p>' },
          { layout: 'code', title: '단계 2. UpdateButtons()', code: SL_STATE, points: ['상태가 바뀌는 곳 <b>마지막</b>에서 호출', '<code>running</code> · <code>hasTime</code> 두 bool', '<code>Content</code> 도 상태로: 시작 / 계속', '리셋 = <code>!running &amp;&amp; hasTime</code>'],
            notes: '<p><b>[6분]</b> 실행 → 처음엔 시작만 켜짐 → 시작 → 정지만 → 정지 → 계속 · 리셋 → 리셋 → 시작만.</p><p>발문: “버튼을 하나 더 만들면(예: 랩) 어디를 고쳐야 할까?” → UpdateButtons() 한 곳. 이것이 “한 곳에서 결정” 의 장점.</p>' },
          { layout: 'table', title: '상태 → 버튼 결과', head: ['버튼', '준비', '측정 중', '일시 정지'], rows: [
            ['시작/계속', '켜짐 “시작”', '꺼짐', '켜짐 “계속”'],
            ['정지 · 랩', '꺼짐', '켜짐', '꺼짐'],
            ['리셋', '꺼짐', '꺼짐', '켜짐']
          ],
            notes: '<p><b>[2분]</b> 1교시의 표와 같은지 비교합니다. Reset 과 Restart 의 차이(리셋에 Restart 를 쓰면 안 되는 이유)도 여기서 짚습니다.</p>' },
          { layout: 'bullets', title: '단계 3. 랩 시간 계산', lead: '이번 랩 = 전체 − 직전 랩 시점', bullets: ['<code>TimeSpan total = sw.Elapsed;</code> — <b>한 번만</b> 읽기', '<code>lap = total - lastLapTotal;</code>', '<code>lastLapTotal = total;</code> — 다음 기준점', '<code>Items.Insert(0, …)</code> — 최근 랩이 맨 위', '리셋: <code>lastLapTotal</code> · 번호 · 목록 모두 처음으로'],
            notes: '<p><b>[4분]</b> 칠판에 시간선을 그리고 랩 1(0→18.4), 랩 2(18.4→34.1) … 를 표시하며 “전체 − 직전 시점” 을 설명합니다.</p><p>Elapsed 를 두 번 읽으면 생기는 문제(퀴즈 2번)를 미리 언급합니다.</p>' },
          { layout: 'code', title: '단계 3 핵심만', code: SL_LAP, points: ['<code>Stopwatch.StartNew()</code> — 창이 뜨면 바로', '<code>{lapNo,2}</code> — 두 칸 오른쪽 정렬', '서식 도우미 <code>F()</code> 로 중복 제거'],
            notes: '<p><b>[4분]</b> 짧은 버전으로 랩 계산만 확인합니다. 몇 번 눌러 보고 랩 시간을 더하면 전체 시간과 같은지(첫 랩부터 합) 학생들과 확인해 봅니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>lap = sw.Elapsed - last; last = sw.Elapsed;</code> 의 문제점은?', options: ['컴파일 오류', 'TimeSpan 은 뺄 수 없다', 'Elapsed 를 두 번 읽어 랩의 합이 전체와 어긋난다', '문제없다'], answer: 2, explain: '계속 변하는 값은 한 번만 읽어 지역 변수에 담아 씁니다.',
            notes: '<p>DateTime.Now 도 같은 함정이 있다는 것을 덧붙입니다.</p>' },
          { layout: 'practice', title: '실습 P8-3 · P8-4', desc: '<p>P8-3: 버튼 하나로 시작 · 정지(글자 시작/정지/계속). P8-4: 랩 통계(개수 · 평균 · 합계, Ticks 로 평균).</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[10분]</b> P8-3 은 UpdateButtons 를 그대로 응용하면 됩니다. P8-4 에서 <code>laps.Average(t =&gt; t)</code> 처럼 TimeSpan 을 바로 평균 내려다 막히는 학생이 많습니다 — Ticks 힌트를 주세요.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: ['시간 = Stopwatch, 화면 = DispatcherTimer(30ms)', '정지할 때 한 번 더 그려 정확한 값 표시', '<code>UpdateButtons()</code> — 상태 → IsEnabled · Content, 한 곳에서', '랩 = 전체 − 직전 랩 시점, Elapsed 는 한 번만 읽기', 'Reset(멈춤 + 0) ≠ Restart(0 + 시작)'],
            notes: '<p>다음 시간: 랩을 데이터(List&lt;Lap&gt;)로 보관해 최고 · 최저 랩을 강조하고, 카운트다운 타이머를 만들어 TabControl 로 합칩니다.</p>' }
        ]
      },
      /* ===================== p08-3 ===================== */
      {
        id: 'p08-3',
        title: '단계별 구현 ② — 랩 강조 · 타이머 · 탭',
        minutes: 50,
        goals: [
          '랩 기록을 Lap 클래스와 List 로 보관하고, 데이터가 바뀔 때 목록을 다시 그릴 수 있다',
          'LINQ Min · Max 와 ListBoxItem 의 Foreground · FontWeight 로 최고 · 최저 랩을 강조할 수 있다',
          'int.TryParse 와 범위 검사로 타이머 입력을 검사하고 잘못된 입력을 MessageBox 로 알릴 수 있다',
          '남은 시간 · 진행률을 계산해 ProgressBar 로 보여 주고, 끝나면 타이머를 멈춘 뒤 알릴 수 있다',
          'TabControl · TabItem 으로 두 화면을 합치고 SelectionChanged 를 처리할 수 있다'
        ],
        flow: [['도입 · 복습', 3], ['단계 4 최고 · 최저 랩', 12], ['단계 5 카운트다운 타이머', 17], ['단계 6 TabControl', 8], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '단계 4. 데이터로 보관하고 최고 · 최저 랩 강조' },
          { type: 'p', html: '단계 3 에서는 랩을 <b>문자열</b>로 만들어 ListBox 에 바로 넣었습니다. 그런데 “가장 빠른 랩” 을 찾으려면 문자열 <code>"랩  2   00:15.72 …"</code> 에서 시간을 다시 뽑아내야 합니다. 이런 일을 피하려면 <b>데이터와 화면을 나눠야</b> 합니다. 랩 하나를 <code>Lap</code> 클래스(번호 · 랩 시간 · 전체 시간)로 만들고 <code>List&lt;Lap&gt;</code> 에 보관한 뒤, 목록이 바뀔 때마다 <code>RefreshLaps()</code> 가 List 를 보고 화면을 <b>새로</b> 그립니다.' },
          { type: 'p', html: '가장 빠른 랩은 랩 시간이 가장 <b>짧은</b> 랩입니다. LINQ(11장)의 <code>laps.Min(l =&gt; l.Time)</code> · <code>laps.Max(l =&gt; l.Time)</code> 으로 최솟값 · 최댓값을 구하고, 항목마다 <code>ListBoxItem</code> 을 직접 만들어 <code>Foreground</code>(글자색) · <code>FontWeight</code>(굵기)를 정합니다. <code>ListBox.Items</code> 에 문자열 대신 <code>ListBoxItem</code> 을 넣으면 항목마다 모양을 따로 줄 수 있습니다.' },
          { type: 'code', title: '단계 4. Lap 클래스 · List · 최고/최저 랩 강조', code: EX_STEP4, desc: '<code>Lap.cs</code> 파일에 읽기 전용 속성 세 개를 가진 클래스를 만들었습니다(Visual Studio 에서는 프로젝트 ▸ 클래스 추가). <code>BtnLap_Click</code> 은 이제 화면을 만지지 않고 <b>데이터에 추가한 뒤 <code>RefreshLaps()</code> 를 부르기만</b> 합니다. <code>RefreshLaps</code> 는 목록을 비우고, 최근 랩부터 거꾸로 돌며 <code>ListBoxItem</code> 을 만듭니다. 랩이 하나뿐이면 최고이자 최저이므로 <code>compare</code> 가 <code>false</code> 일 때는 강조하지 않습니다. 최고와 최저가 같은 값(모든 랩이 같음)이면 <code>else if</code> 덕분에 최고만 표시됩니다. 색만으로 구분하면 색을 구별하기 어려운 사람이 알아볼 수 없으므로 <code>▲ 최고</code> · <code>▼ 최저</code> 글자도 함께 붙였습니다.' },
          { type: 'callout', kind: 'tip', title: '“데이터 → 화면” 한 방향으로', html: '랩이 추가될 때 “새 항목만 넣고, 예전 최고 항목의 색을 찾아서 지우고 …” 처럼 화면을 조금씩 고치면 코드가 금방 복잡해집니다. 이 프로젝트처럼 <b>데이터(List)를 고친 뒤 화면 전체를 데이터로부터 다시 그리는</b> 방식은 단순하고 틀리기 어렵습니다. 랩이 수백 개 정도라면 속도도 문제없습니다. 이 생각을 끝까지 밀고 가면 데이터 바인딩(18장)과 MVVM(20장)이 됩니다 — 4교시에 해 봅니다.' },
          { type: 'h', text: '단계 5. 카운트다운 타이머' },
          { type: 'p', html: '타이머는 스톱워치를 거꾸로 보여 주는 것입니다. 흐른 시간은 여전히 <code>Stopwatch</code> 가 재고, <b>남은 시간 = 설정한 시간 − 흐른 시간</b>으로 계산합니다. 진행률은 흐른 시간 ÷ 설정한 시간 × 100 이고, 이 값을 <code>ProgressBar.Value</code>(0~100)에 넣으면 막대가 차오릅니다. 일시 정지는 <code>Stopwatch.Stop()</code> 하나로 됩니다 — 흐른 시간이 멈추면 남은 시간도 저절로 멈추니까요.' },
          { type: 'figure', html: SVG_COUNT, caption: '남은 시간과 진행률 — Stopwatch 하나로 모두 계산한다' },
          { type: 'p', html: '사용자가 입력하는 분 · 초는 <b>믿으면 안 됩니다</b>. 비워 두거나, <code>abc</code> 를 쓰거나, <code>-3</code> · <code>75</code> 를 쓸 수 있습니다. <code>int.TryParse</code> 로 숫자인지, <code>if</code> 로 범위(분 0~99, 초 0~59)를 확인하고, 0분 0초도 막습니다. 검사는 <code>TryReadDuration(out TimeSpan result)</code> 메서드로 묶어 “성공하면 true + 결과” 를 돌려주게 했습니다 — <code>int.TryParse</code> 와 같은 모양(12장의 <code>out</code> 매개변수)입니다.' },
          { type: 'code', title: '단계 5. 카운트다운 타이머 — 입력 검사 · ProgressBar · 종료 알림', code: EX_STEP5, desc: '<code>duration</code> 이 <code>Zero</code> 이면 “아직 시작 전” 이라는 뜻으로 씁니다. 시작 버튼은 처음일 때만 입력을 읽고, 일시 정지 후에는 그냥 이어서 돌립니다(글자도 <code>계속</code>). <code>CdTimer_Tick</code> 에서 남은 시간이 0 이하가 되면 <b>① 타이머를 먼저 멈추고 ② 화면을 끝 상태(00:00, 100%)로 만든 뒤 ③ MessageBox 로 알립니다</b>. 도는 동안에는 입력 칸을 꺼서(<code>IsEnabled = false</code>) 중간에 시간을 바꾸지 못하게 했습니다. 남은 시간은 <b>올림</b>해서 보여 주므로 “00:00” 이 보이는 순간이 곧 끝입니다. 분은 <code>(int)up.TotalMinutes</code> 로 써서 99분도 제대로 나옵니다.' },
          { type: 'callout', kind: 'warn', title: 'MessageBox 보다 타이머 Stop() 이 먼저', html: '<code>MessageBox.Show</code> 는 사용자가 확인을 누를 때까지 돌아오지 않지만, 그동안에도 WPF 는 메시지를 처리하므로 <b>DispatcherTimer 의 Tick 은 계속 옵니다</b>. <code>Stop()</code> 을 MessageBox <b>뒤에</b> 쓰면, 첫 메시지 상자가 떠 있는 동안 다음 Tick 이 또 “시간 종료” 를 판단해 메시지 상자가 <b>여러 개</b> 뜰 수 있습니다. 끝 처리는 항상 “멈추고 → 화면 정리 → 알림” 순서로 쓰세요.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 입력 칸을 숫자 전용으로', html: '실제 WPF 에서는 <code>PreviewTextInput</code> 이벤트에서 <code>e.Handled = !char.IsDigit(e.Text[0]);</code> 로 숫자가 아닌 글자를 아예 막을 수 있습니다(17장의 터널링 이벤트). 하지만 붙여넣기(<kbd>Ctrl</kbd>+<kbd>V</kbd>)로 들어오는 글자는 막지 못하므로, <b>시작할 때 <code>TryParse</code> 로 검사하는 것은 여전히 필요합니다</b>. 입력 제한은 편의 기능, 최종 검사는 필수 기능입니다.' },
          { type: 'h', text: '단계 6. TabControl 로 두 화면 합치기' },
          { type: 'p', html: '<code>TabControl</code> 은 여러 화면을 탭으로 나누어 보여 주는 컨트롤입니다. 안에 <code>TabItem</code> 을 넣고, <code>Header</code> 에 탭 글자를, 내용에 그 탭의 화면(패널 하나)을 넣습니다. 지금 보이는 탭은 <code>SelectedIndex</code> · <code>SelectedItem</code> 으로 알 수 있고, 탭을 바꾸면 <code>SelectionChanged</code> 이벤트가 옵니다. 중요한 점: <b>보이지 않는 탭의 컨트롤도 사라지지 않습니다</b>. 스톱워치 탭을 보고 있는 동안에도 타이머 탭의 타이머는 계속 돌고, 레이블도 계속 갱신됩니다.' },
          { type: 'code', title: '단계 6. TabControl — 두 화면, 두 타이머', code: EX_STEP6, desc: '두 탭이 각자의 <code>Stopwatch</code> 와 <code>DispatcherTimer</code> 를 가집니다. 스톱워치를 시작하고, 타이머 탭에서 10초 타이머를 시작한 뒤 다시 스톱워치 탭으로 돌아와 보세요. 둘 다 계속 돌고, 10초 뒤 아래 안내 글이 바뀝니다. <code>Tabs_SelectionChanged</code> 에서 <code>e.Source</code> 를 확인하는 이유: <code>SelectionChanged</code> 는 버블링되는 라우트된 이벤트라서(17장), 탭 안에 <code>ListBox</code> · <code>ComboBox</code> 가 있으면 <b>그 컨트롤의 선택 변경도 TabControl 까지 올라옵니다</b>. <code>cdWatch.Restart()</code> 는 <code>Reset()</code> + <code>Start()</code> 입니다.' },
          { type: 'table', head: ['멤버', '뜻'], rows: [
            ['<code>TabItem.Header</code>', '탭에 보이는 글자 (그림 · 패널도 가능)'],
            ['<code>TabControl.SelectedIndex</code> · <code>SelectedItem</code>', '지금 탭의 번호(0부터) · TabItem 개체'],
            ['<code>SelectionChanged</code>', '탭이 바뀔 때 — <code>e.Source</code> 로 TabControl 인지 확인'],
            ['<code>TabStripPlacement</code>', '탭 위치 (<code>Top</code> · <code>Bottom</code> · <code>Left</code> · <code>Right</code>)']
          ], caption: 'TabControl 의 주요 멤버' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 탭 편집과 클래스 추가', html: '<ul><li>디자이너에서 <code>TabControl</code> 을 고른 뒤 탭 머리글을 클릭하면 그 탭의 내용이 디자이너에 보여 편집할 수 있습니다. 탭 추가는 속성 창의 <b>Items (컬렉션)</b> 또는 XAML 에 <code>&lt;TabItem&gt;</code> 을 직접 쓰는 편이 빠릅니다.</li><li><code>Lap</code> 클래스는 <b>솔루션 탐색기 ▸ 프로젝트 오른쪽 클릭 ▸ 추가 ▸ 클래스</b>로 <code>Lap.cs</code> 를 만들고, 파일 맨 위의 <code>namespace</code> 가 MainWindow 와 같은지 확인합니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P8-5. 타이머 빠른 설정 버튼',
            level: 1,
            desc: '<p>타이머 입력 칸 아래의 <b>30초 · 1분 · 3분 · 5분 30초</b> 버튼을 누르면 분 · 초 칸이 채워지게 하세요.</p><ul><li>네 버튼은 처리기 <code>Preset_Click</code> 하나를 함께 쓰고, 설정할 시간(초)은 XAML 의 <code>Tag</code> 에 적혀 있습니다.</li><li>분 · 초 칸을 채우고, 큰 글자에 <code>05:30</code> 형식, 아래에 <code>[5분 30초] 버튼으로 설정</code> 을 표시합니다.</li></ul>',
            hint: '<code>Button b = (Button)sender;</code> → <code>int total = Convert.ToInt32(b.Tag);</code>. 분 = <code>total / 60</code>, 초 = <code>total % 60</code>. 두 자리 서식은 <code>{값:00}</code>.',
            starter: P5_STARTER,
            solution: P5_SOLUTION
          },
          {
            title: '실습 P8-6. 마지막 10초 경고 · 창 제목에 남은 시간',
            level: 2,
            desc: '<p>15초 타이머에 두 가지 알림을 더하세요.</p><ul><li>남은 시간이 <b>10초 이하</b>이면 큰 글자를 빨간색(<code>Crimson</code>)으로, 아니면 검은색으로.</li><li>창 제목(<code>Title</code>)을 <code>⏳ 00:12 - 타이머</code> 처럼 남은 시간으로 바꾸고, 끝나면 <code>⏰ 끝! - 타이머</code>.</li><li>리셋하면 글자색과 제목이 처음으로 돌아갑니다.</li></ul>',
            hint: '<code>lblRemain.Foreground = 조건 ? Brushes.Crimson : Brushes.Black;</code> (<code>using System.Windows.Media;</code>). 창 제목은 코드 비하인드에서 <code>Title = …;</code> 로 바로 바꿀 수 있습니다. 창 제목은 작업 표시줄에도 보이므로 다른 창을 쓰는 동안에도 남은 시간을 알 수 있습니다.',
            starter: P6_STARTER,
            solution: P6_SOLUTION
          }
        ],
        quiz: [
          { q: '랩 시간이 [18.4초, 15.7초, 24.9초, 21.1초] 일 때 “최고 랩(가장 빠른 랩)” 을 구하는 식과 결과는?', options: ['<code>laps.Max(l =&gt; l.Time)</code> → 24.9초', '<code>laps.Min(l =&gt; l.Time)</code> → 15.7초', '<code>laps.Min(l =&gt; l.Total)</code> → 18.4초', '<code>laps.Last()</code> → 21.1초'], answer: 1, explain: '빠른 랩 = 걸린 시간이 짧은 랩입니다. 랩 시간(Time)의 최솟값을 구합니다. Total(전체 시간)의 최솟값은 항상 첫 랩입니다.' },
          { q: '<code>int.TryParse(txtSec.Text, out int sec)</code> 에서 사용자가 <code>abc</code> 를 입력했다면?', options: ['FormatException 이 발생한다', 'false 를 돌려주고 sec 는 0 이 된다', 'true 를 돌려주고 sec 는 0 이 된다', '컴파일 오류가 난다'], answer: 1, explain: 'TryParse 는 예외를 던지지 않고 실패를 false 로 알려 줍니다. 그래서 입력 검사에 알맞습니다. int.Parse 였다면 FormatException 이 납니다.' },
          { q: '카운트다운이 끝났을 때 올바른 처리 순서는?', options: ['MessageBox → 타이머 Stop → 화면 정리', '화면 정리 → MessageBox → 타이머 Stop', '타이머 Stop → 화면 정리(00:00, 100%) → MessageBox', 'MessageBox 만 띄우면 타이머는 저절로 멈춘다'], answer: 2, explain: 'MessageBox 가 떠 있는 동안에도 Tick 이 계속 오므로 먼저 멈춰야 메시지 상자가 여러 번 뜨지 않습니다. 화면을 끝 상태로 만든 뒤 알리면 사용자가 100% 막대를 보면서 확인을 누르게 됩니다.' },
          { q: '스톱워치 탭을 보고 있는 동안, 숨겨진 타이머 탭의 DispatcherTimer 는?', options: ['자동으로 멈춘다', '계속 돌고, 타이머 탭의 컨트롤도 계속 갱신된다', '예외가 발생한다', '탭이 보일 때까지 Tick 이 쌓였다가 한꺼번에 온다'], answer: 1, explain: 'TabControl 은 보이지 않는 탭의 내용을 없애지 않습니다. 타이머도, 컨트롤도 그대로 살아 있어 두 기능을 동시에 쓸 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ②', subtitle: '단계 4 최고 · 최저 랩 → 단계 5 카운트다운 타이머 → 단계 6 TabControl', badge: 'Project 08 · 3교시',
            notes: '<p><b>[복습 3분]</b> “랩 시간은 어떻게 구했나?” — 전체 − 직전 랩 시점, Elapsed 는 한 번만. 오늘은 랩 강조 → 타이머 → 탭으로 합치기.</p>' },
          { layout: 'two', title: '데이터와 화면을 나누기', left: { title: '단계 3 — 문자열을 바로 화면에', code: 'lstLaps.Items.Insert(0,\n    $"랩 {lapNo,2}   {Format(lap)}");\n// 최고 랩을 찾으려면?\n// → 문자열에서 시간을 다시 뽑아야…', run: false }, right: { title: '단계 4 — 데이터(List) → 화면', code: 'laps.Add(new Lap(no, lap, total));\nRefreshLaps();   // List 를 보고 새로 그림\n\nTimeSpan best = laps.Min(l => l.Time);', run: false },
            notes: '<p><b>[4분]</b> 발문: “ListBox 에 들어 있는 문자열에서 가장 빠른 랩을 찾으려면?” → 불편하다. 그래서 데이터를 따로 보관한다. Lap 클래스는 8장 복습(읽기 전용 속성 + 생성자).</p>' },
          { layout: 'code', title: '단계 4. ListBoxItem 으로 색 입히기', code: SL_BEST, points: ['LINQ <code>Min()</code> · <code>Max()</code>', '문자열 대신 <code>ListBoxItem</code> 을 Items 에', '<code>Foreground</code> · <code>FontWeight</code> 를 항목마다', '색 + 글자(▲ ▼) 함께 — 접근성'],
            notes: '<p><b>[5분]</b> 예시 데이터로 결과를 먼저 보여 준 뒤, 본문 예제 단계 4 를 실행해 실제 랩으로 확인합니다. 랩이 하나일 때 강조하지 않는 이유(compare)를 물어봅니다.</p>' },
          { layout: 'diagram', title: '단계 5. 카운트다운 계산', html: SVG_COUNT, caption: 'remain = duration − Elapsed, 진행률 = Elapsed ÷ duration',
            notes: '<p><b>[3분]</b> 타이머도 결국 Stopwatch 로 흐른 시간을 잰다. 일시 정지는 Stopwatch.Stop() 하나면 된다 — 남은 시간이 저절로 멈춘다.</p>' },
          { layout: 'bullets', title: '입력은 믿지 않는다 — TryReadDuration', bullets: ['<code>int.TryParse</code> — 숫자가 아니면 false (예외 없음)', '범위: 분 0~99, 초 0~59', '0분 0초도 거절', '실패하면 MessageBox(Warning) 후 <code>return false</code>', '<code>out TimeSpan result</code> — TryParse 와 같은 모양'],
            notes: '<p><b>[4분]</b> 학생들에게 “타이머 입력 칸에 넣을 수 있는 이상한 값” 을 말하게 해 칠판에 적습니다: 빈칸, abc, -3, 75, 1.5, 공백 … 그 목록이 곧 테스트 목록입니다.</p>' },
          { layout: 'code', title: '단계 5 핵심 — Tick 과 종료', code: SL_COUNT, points: ['남은 시간 ≤ 0 → <b>먼저 Stop</b>', '화면 끝 상태(00:00, 100%) → 알림', '남은 시간은 <b>올림</b>해서 표시', '<code>watch.Restart()</code> = 0 부터 다시'],
            notes: '<p><b>[6분]</b> 짧은 버전을 실행해 5초 뒤 메시지 상자를 봅니다. 그다음 Stop() 을 MessageBox 뒤로 옮겨 보면 무슨 일이 생길지 예측하게 합니다(메시지 상자가 여러 번 뜰 수 있음).</p><p>본문 단계 5 는 입력 검사 · 일시 정지 · 입력 칸 잠그기까지 들어 있습니다. 함께 실행하며 잘못된 값을 넣어 봅니다.</p>' },
          { layout: 'code', title: '단계 6. TabControl', code: SL_TAB, points: ['<code>TabItem Header</code> = 탭 글자', '<code>SelectedIndex</code> · <code>SelectedItem</code>', '<code>SelectionChanged</code> 는 버블링 → <code>e.Source</code> 확인', '숨은 탭도 살아 있다'],
            notes: '<p><b>[5분]</b> 본문 단계 6 을 실행해 두 탭에서 모두 시작한 뒤 탭을 오가 봅니다. 타이머가 숨은 탭에서 끝나도 안내 글이 바뀌는 것을 확인.</p><p>e.Source 확인은 4교시 완성본처럼 탭 안에 ListBox 가 있을 때 꼭 필요합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '카운트다운이 끝났을 때 올바른 처리 순서는?', options: ['MessageBox → Stop → 화면 정리', '화면 정리 → MessageBox → Stop', 'Stop → 화면 정리 → MessageBox', 'MessageBox 만 띄우면 된다'], answer: 2, explain: 'MessageBox 가 떠 있는 동안에도 Tick 이 오므로 먼저 멈춥니다.',
            notes: '<p>정답 후 “MessageBox 가 떠 있는 동안 스톱워치 탭의 시간은 흐를까?” 도 물어보세요 — 흐른다(다른 DispatcherTimer 는 계속 Tick).</p>' },
          { layout: 'practice', title: '실습 P8-5 · P8-6', desc: '<p>P8-5: Tag 를 쓰는 빠른 설정 버튼(30초 · 1분 · 3분 · 5분 30초). P8-6: 마지막 10초 빨간 글씨 + 창 제목에 남은 시간.</p>', starter: P6_STARTER, solution: P6_SOLUTION,
            notes: '<p><b>[10분]</b> P8-5 는 21장의 Tag 패턴 복습입니다. P8-6 에서 리셋할 때 색 · 제목을 되돌리는 것을 잊는 학생이 많습니다. 두 실습의 결과는 4교시 완성 프로그램에 그대로 들어갑니다.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: ['데이터(List&lt;Lap&gt;) → 화면(RefreshLaps) 한 방향', 'Min · Max + ListBoxItem 색 · 굵기 (+ ▲▼ 글자)', '타이머 = duration − Stopwatch.Elapsed, ProgressBar', '입력 검사: TryParse + 범위 + 0 거절', '종료: Stop → 화면 → MessageBox', 'TabControl: 숨은 탭도 살아 있다, SelectionChanged 는 e.Source 확인'],
            notes: '<p>다음 시간: 모든 단계를 합친 완성 프로그램을 점검하고, 스톱워치를 MVVM 으로 다시 만들어 봅니다.</p>' }
        ]
      },
      /* ===================== p08-4 ===================== */
      {
        id: 'p08-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '단계 1~6 과 실습 결과를 합친 완성 프로그램을 요구사항 표로 점검할 수 있다',
          '코드 비하인드의 스톱워치를 ViewModel · RelayCommand · 바인딩으로 리팩터링할 수 있다',
          'UpdateButtons() 가 하던 일을 명령의 CanExecute 로 옮기고 InvalidateRequerySuggested 의 역할을 설명할 수 있다',
          '랩 기록 저장 · MVVM 타이머 같은 확장 기능을 스스로 설계해 추가할 수 있다'
        ],
        flow: [['완성 프로그램 실행 · 점검', 12], ['MVVM 리팩터링', 18], ['확장 과제', 15], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '1. 완성 프로그램' },
          { type: 'p', html: '지금까지 만든 단계를 모두 합칩니다. 탭 1 은 단계 4 의 스톱워치(버튼 상태 · 랩 · 최고/최저 강조), 탭 2 는 단계 5 의 타이머에 실습 P8-5(빠른 설정 버튼)와 P8-6(마지막 10초 빨간 글씨 · 창 제목)을 더했습니다. 시연하기 좋도록 창이 뜨면 스톱워치가 바로 시작되게 했습니다(생성자의 <code>StartStopwatch();</code> 한 줄 — 원하지 않으면 지우세요).' },
          { type: 'code', title: '완성 프로그램. 스톱워치 · 타이머', code: EX_FINAL, desc: '코드가 길어졌으므로 <b>주석 줄로 두 영역(스톱워치 · 타이머)을 나눴습니다</b>. 두 기능은 필드 이름도 <code>sw</code>/<code>swTimer</code> 와 <code>cdWatch</code>/<code>cdTimer</code> 로 구분됩니다. 스톱워치의 상태는 <code>UpdateButtons()</code>, 타이머의 상태는 <code>UpdateCdButtons()</code> 한 곳에서 정합니다. 빠른 설정 버튼 네 개에 이름을 붙여 두고 타이머가 도는 동안 <code>foreach</code> 로 한꺼번에 끕니다. 창 제목은 타이머가 도는 동안 남은 시간을, 끝나면 <code>⏰ 끝!</code> 을 보여 주고 리셋하면 원래대로 돌아갑니다.' },
          { type: 'table', head: ['요구사항', '구현', '확인 방법'], rows: [
            ['F1 · F2 표시 · 시작/정지/계속', '<code>Stopwatch</code> + 30ms <code>DispatcherTimer</code>', '정지 후 계속 → 이어서 흐르는가'],
            ['F3 리셋', '<code>sw.Reset()</code> + 랩 · 기준점 초기화', '측정 중에는 리셋이 꺼져 있는가'],
            ['F4 · F5 랩 · 강조', '<code>List&lt;Lap&gt;</code> + <code>RefreshLaps()</code>', '랩 1개일 때 강조 없음, 2개부터 ▲▼'],
            ['F6 입력 검사', '<code>TryReadDuration</code>', '빈칸 · abc · -1 · 75초 · 0분 0초'],
            ['F7 · F8 진행 · 종료', 'ProgressBar · 10초 빨강 · 제목 · MessageBox 1번', '10초로 끝까지 — 메시지 상자가 한 번만'],
            ['F9 두 화면', 'TabControl, 두 타이머 독립', '둘 다 돌리고 탭 오가기']
          ], caption: '완성 프로그램 점검표 — 모두 직접 눌러 확인해 보세요' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 실행 파일 만들기', html: '<ul><li>완성되면 도구 모음의 구성을 <b>Release</b> 로 바꾸고 <b>빌드 ▸ 솔루션 빌드</b>(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)를 합니다. <code>bin\\Release\\net8.0-windows\\</code> 폴더의 <code>.exe</code> 를 더블 클릭하면 Visual Studio 없이 실행됩니다.</li><li>친구 PC 에 .NET 이 없다면 <b>프로젝트 오른쪽 클릭 ▸ 게시</b>에서 “자체 포함(self-contained)” 으로 게시하면 필요한 런타임까지 함께 묶입니다.</li><li>창 아이콘은 프로젝트 속성 ▸ 애플리케이션 ▸ <b>아이콘</b>에서 <code>.ico</code> 파일을 고르면 됩니다.</li></ul>' },
          { type: 'h', text: '2. MVVM 으로 리팩터링 (선택)' },
          { type: 'p', html: '완성 프로그램의 코드 비하인드는 컨트롤 이름(<code>lblTime</code>, <code>btnStart</code> …)을 직접 만집니다. 20장에서 배운 <b>MVVM</b> 으로 바꾸면 스톱워치의 “두뇌” 를 <code>StopwatchViewModel</code> 클래스로 옮기고, 화면(XAML)은 <b>바인딩</b>으로 값을 보여 주고 <b>명령</b>으로 버튼을 연결하기만 합니다. ViewModel 은 컨트롤을 전혀 모르므로 화면 모양을 바꿔도(버튼을 아이콘으로, 목록을 다른 컨트롤로) 코드를 고칠 필요가 없습니다.' },
          { type: 'figure', html: SVG_MVVM, caption: 'View 는 바인딩 · 명령으로 ViewModel 을 쓰고, ViewModel 은 Stopwatch · DispatcherTimer 를 가진다' },
          { type: 'table', head: ['코드 비하인드 버전', 'MVVM 버전'], rows: [
            ['<code>lblTime.Text = Format(sw.Elapsed);</code>', '<code>Display = Format(sw.Elapsed);</code> + <code>Text="{Binding Display}"</code>'],
            ['<code>Click="BtnStart_Click"</code>', '<code>Command="{Binding StartCommand}"</code>'],
            ['<code>UpdateButtons()</code> 의 <code>IsEnabled = …</code>', '명령마다 <code>canExecute</code> 람다 한 줄'],
            ['<code>lstLaps.Items.Insert(0, …)</code>', '<code>Laps.Insert(0, …)</code> (<code>ObservableCollection</code>) + <code>ItemsSource="{Binding Laps}"</code>'],
            ['<code>btnStart.Content = "계속"</code>', '<code>StartText = "계속"</code> + <code>Content="{Binding StartText}"</code>']
          ], caption: '같은 일을 하는 두 가지 방법' },
          { type: 'code', title: 'MVVM 스톱워치. StopwatchViewModel + RelayCommand + 바인딩', code: EX_MVVM, desc: '<code>ViewModelBase</code> · <code>RelayCommand</code> 는 20장의 것과 같습니다. <code>StopwatchViewModel</code> 의 생성자에서 네 명령을 만들며 <b>할 일</b>과 <b>할 수 있는 조건</b>을 함께 줍니다 — 단계 2 의 <code>UpdateButtons()</code> 표가 네 줄의 <code>canExecute</code> 로 바뀌었습니다. 틱마다 <code>Display</code> 속성만 바꾸면 <code>PropertyChanged</code> 알림을 받은 바인딩이 TextBlock 을 고칩니다. 상태가 바뀐 뒤 <code>CommandManager.InvalidateRequerySuggested()</code> 를 불러 버튼들이 <code>CanExecute</code> 를 다시 물어보게 합니다. 코드 비하인드에는 <code>DataContext</code> 한 줄만 남았습니다. 이 버전은 스톱워치만 옮겼고, 최고/최저 랩 색은 뺐습니다(색까지 옮기려면 Lap 에 Brush 속성을 두고 DataTemplate 으로 바인딩합니다).' },
          { type: 'callout', kind: 'warn', title: 'InvalidateRequerySuggested 가 필요한 때', html: 'WPF 는 키보드 · 마우스 <b>입력이 있을 때</b> 명령들에게 <code>CanExecute</code> 를 다시 묻습니다(<code>RequerySuggested</code>). 버튼을 눌러 상태가 바뀌는 스톱워치는 그것만으로도 대개 맞게 동작하지만, 타이머가 <b>저절로</b> 끝나는 경우처럼 입력 없이 상태가 바뀌면 버튼이 옛 상태로 남습니다. 그래서 상태가 바뀌는 곳에서 <code>CommandManager.InvalidateRequerySuggested()</code> 로 “다시 물어봐” 를 직접 알리는 것이 안전합니다(확장 과제 2).' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서의 차이', html: '브라우저 실행 창의 WPF 는 실제 WPF 를 흉내 낸 구현이라, 명령의 켜고 끄기를 다시 묻는 시점이 조금 다릅니다(DispatcherTimer 의 Tick 뒤에도 다시 묻습니다). 그래서 <code>InvalidateRequerySuggested()</code> 를 빼먹어도 브라우저에서는 맞게 보일 수 있지만, Visual Studio 로 실행하면 버튼이 제때 켜지지 않을 수 있습니다. 두 환경 모두에서 맞게 동작하도록 <b>항상 직접 알리는 습관</b>을 들이세요.' },
          { type: 'h', text: '3. 확장 아이디어' },
          { type: 'table', head: ['주제', '방향'], rows: [
            ['랩 기록 저장', '<code>SaveFileDialog</code> + <code>File.WriteAllLines</code> 로 CSV 저장 (확장 과제 1)'],
            ['MVVM 타이머', '타이머 탭도 ViewModel 로 — 저절로 끝나는 상태 처리 (확장 과제 2)'],
            ['단축키', '<code>KeyBinding</code> 으로 <kbd>Space</kbd> = 시작/정지, <kbd>L</kbd> = 랩 (17장)'],
            ['설정 기억', '마지막 타이머 시간을 파일에 저장했다가 다음 실행 때 채우기 (10장)'],
            ['알림 반복', '끝나면 창 배경을 0.3초마다 깜빡이기 — DispatcherTimer 하나 더'],
            ['여러 타이머', '타이머 여러 개를 목록으로 — <code>ObservableCollection&lt;TimerViewModel&gt;</code> + DataTemplate']
          ], caption: '더 해 볼 만한 기능' }
        ],
        practice: [
          {
            title: '확장 과제 1. 랩 기록을 CSV 파일로 저장',
            level: 2,
            desc: '<p><b>💾 저장</b> 버튼을 누르면 랩 기록을 CSV 파일로 저장하세요.</p><ul><li>랩이 없으면 <code>저장할 랩이 없습니다.</code> 를 알리고 끝냅니다.</li><li><code>SaveFileDialog</code> — 필터는 CSV · 텍스트 파일, 기본 이름은 <code>랩기록_20250314_0930.csv</code> 처럼 현재 시각으로. 취소하면 아무것도 하지 않습니다.</li><li>첫 줄 <code>번호,랩 시간,전체 시간</code>, 이어서 랩마다 <code>1,00:18.42,00:18.42</code> 처럼 <b>1번 랩부터</b> 한 줄씩.</li><li>저장에 성공하면 아래에 <code>저장했습니다: 파일 이름 (n개)</code>, 실패(<code>IOException</code>)하면 오류 메시지 상자.</li></ul>',
            hint: '<code>dlg.FileName = $"랩기록_{DateTime.Now:yyyyMMdd_HHmm}.csv";</code>. <code>List&lt;string&gt; lines</code> 에 줄을 모은 뒤 <code>File.WriteAllLines(dlg.FileName, lines)</code>. 파일 이름만 보여 줄 때는 <code>Path.GetFileName</code>. 저장한 CSV 는 엑셀에서 열 수 있습니다.',
            starter: E1_STARTER,
            solution: E1_SOLUTION
          },
          {
            title: '확장 과제 2. 타이머를 MVVM 으로 (도전)',
            level: 3,
            desc: '<p>초를 입력해 거꾸로 세는 타이머를 <b>MVVM</b> 으로 만드세요. XAML 과 <code>ViewModelBase</code> · <code>RelayCommand</code> 는 완성되어 있고, <code>TimerViewModel</code> 의 TODO 를 채우면 됩니다.</p><ul><li><b>시작</b>: 도는 중이 아닐 때만. 입력이 1~3600 이 아니면 <code>Message</code> 에 안내만 합니다.</li><li><b>Tick</b>: 남은 시간 · 진행률 갱신, 0 이 되면 멈추고 <code>00:00</code> · 100% · <code>⏰ 시간 종료!</code>.</li><li><b>리셋</b>: 시작한 적이 있을 때만. 멈추고 처음 상태로.</li><li>저절로 끝날 때 버튼이 제대로 켜지도록 <code>CommandManager.InvalidateRequerySuggested()</code> 를 부르세요.</li></ul>',
            hint: '명령: <code>new RelayCommand(_ =&gt; Start(), _ =&gt; !watch.IsRunning)</code>. 입력 칸은 <code>UpdateSourceTrigger=PropertyChanged</code> 로 바인딩되어 있어 글자를 칠 때마다 <code>SecondsText</code> 가 바뀝니다. ViewModel 안에서는 MessageBox 대신 <code>Message</code> 속성으로 알립니다(ViewModel 은 화면을 모르게).',
            starter: E2_STARTER,
            solution: E2_SOLUTION
          }
        ],
        quiz: [
          { q: 'MVVM 버전에서 단계 2 의 <code>UpdateButtons()</code> 가 하던 “버튼 켜고 끄기” 를 맡는 것은?', options: ['XAML 의 IsEnabled 속성', '각 RelayCommand 의 canExecute', 'DispatcherTimer 의 Tick', 'ObservableCollection'], answer: 1, explain: 'Command 로 연결된 버튼은 명령의 CanExecute 결과로 IsEnabled 가 정해집니다. 그래서 명령을 만들 때 준 조건 람다가 곧 버튼 상태 표입니다.' },
          { q: 'ViewModel 에서 <code>Display = Format(sw.Elapsed);</code> 만 했는데 화면의 시간이 바뀌는 이유는?', options: ['ViewModel 이 lblTime 을 찾아서 바꾸기 때문에', 'SetProperty 가 PropertyChanged 를 알리고, Text="{Binding Display}" 가 그 알림을 받아 화면을 고치기 때문에', 'DispatcherTimer 가 화면을 직접 그리기 때문에', 'DataContext 가 매번 새로 만들어지기 때문에'], answer: 1, explain: 'INotifyPropertyChanged 알림 → 바인딩이 새 값을 읽어 컨트롤에 반영. ViewModel 은 컨트롤 이름을 모릅니다.' },
          { q: 'MVVM 타이머가 입력 없이 저절로 끝났는데 “시작” 버튼이 계속 꺼져 있다. 가장 알맞은 해결책은?', options: ['XAML 에서 IsEnabled="True" 로 고정한다', '끝나는 곳에서 CommandManager.InvalidateRequerySuggested() 를 부른다', 'Tick 간격을 줄인다', 'RelayCommand 를 매번 새로 만든다'], answer: 1, explain: 'WPF 는 입력이 있을 때 CanExecute 를 다시 묻습니다. 입력 없이 상태가 바뀌면 직접 “다시 물어봐” 를 알려야 합니다.' },
          { q: '랩 기록을 저장할 때 <code>dlg.ShowDialog() != true</code> 이면 바로 return 하는 이유는?', options: ['저장 대화상자가 오류를 냈기 때문에', '사용자가 취소(또는 ✕)를 눌렀기 때문에 — bool? 이 false 또는 null', 'ShowDialog 는 항상 false 를 돌려주므로', 'CSV 파일은 저장할 수 없으므로'], answer: 1, explain: 'ShowDialog() 는 bool? 을 돌려주며 [저장] 을 눌렀을 때만 true 입니다. 취소면 아무것도 하지 않고 끝냅니다(21장).' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: '완성 프로그램 점검 · MVVM 리팩터링 · 확장 과제', badge: 'Project 08 · 4교시',
            notes: '<p><b>[도입 2분]</b> 오늘은 새 기능보다 “합치고, 점검하고, 구조를 바꿔 보는” 시간입니다.</p>' },
          { layout: 'bullets', title: '완성 프로그램 = 단계 + 실습', bullets: ['탭 1: 단계 4 스톱워치 (상태 · 랩 · 강조)', '탭 2: 단계 5 타이머 + P8-5 빠른 설정 + P8-6 10초 경고 · 제목', '영역별 주석 · 필드 이름으로 두 기능 구분', '상태 → 버튼: <code>UpdateButtons()</code> · <code>UpdateCdButtons()</code>', '시연용 자동 시작 한 줄'],
            notes: '<p><b>[5분]</b> 완성 예제를 실행해 전체 기능을 훑습니다. 학생들 코드와 비교해 빠진 부분이 있으면 지금 채우게 합니다.</p>' },
          { layout: 'table', title: '점검표', head: ['요구사항', '확인 방법'], rows: [
            ['F2 계속', '정지 → 계속 → 이어서 흐르나'],
            ['F3 리셋', '측정 중 리셋이 꺼져 있나'],
            ['F5 강조', '랩 1개면 강조 없음, 2개부터 ▲▼'],
            ['F6 입력', '빈칸 · abc · -1 · 75초 · 0분 0초'],
            ['F8 종료', '메시지 상자가 한 번만 뜨나'],
            ['F9 탭', '둘 다 돌리고 탭 오가기']
          ],
            notes: '<p><b>[5분]</b> 짝끼리 서로의 프로그램을 점검표로 테스트하게 합니다(“남의 프로그램을 망가뜨려 보기”). 찾은 버그를 한두 개 발표.</p>' },
          { layout: 'diagram', title: 'MVVM 으로 나누기', html: SVG_MVVM, caption: 'View ↔ 바인딩 · 명령 ↔ StopwatchViewModel',
            notes: '<p><b>[4분]</b> 20장 복습: View 는 무엇을 보여 줄지 모른 채 바인딩만, ViewModel 은 컨트롤을 모른 채 속성 · 명령만.</p><p>발문: “버튼을 아이콘 모양으로 바꾸면 ViewModel 을 고쳐야 할까?” → 아니다.</p>' },
          { layout: 'table', title: '코드 비하인드 → MVVM', head: ['전', '후'], rows: [
            ['<code>lblTime.Text = …</code>', '<code>Display = …</code> + Binding'],
            ['<code>Click="…"</code>', '<code>Command="{Binding …}"</code>'],
            ['<code>UpdateButtons()</code>', '명령마다 <code>canExecute</code>'],
            ['<code>lstLaps.Items.Insert</code>', '<code>ObservableCollection.Insert</code>']
          ],
            notes: '<p><b>[3분]</b> 한 줄씩 대응시켜 봅니다. 특히 UpdateButtons 표가 canExecute 네 줄로 바뀌는 것이 핵심.</p>' },
          { layout: 'two', title: 'StopwatchViewModel 의 핵심', left: { title: '명령 = 할 일 + 조건', code: 'StartCommand = new RelayCommand(\n    _ => Start(), _ => !sw.IsRunning);\nStopCommand = new RelayCommand(\n    _ => Stop(), _ => sw.IsRunning);\nResetCommand = new RelayCommand(\n    _ => Reset(),\n    _ => !sw.IsRunning && sw.Elapsed > TimeSpan.Zero);', run: false }, right: { title: '틱 = 속성만 바꾸기', code: 'timer.Tick += (s, e) =>\n    Display = Format(sw.Elapsed);\n\nprivate void UpdateState()\n{\n    StartText = hasTime ? "계속" : "시작";\n    CommandManager.InvalidateRequerySuggested();\n}', run: false },
            notes: '<p><b>[6분]</b> 본문의 MVVM 예제를 실행합니다. 코드 비하인드가 DataContext 한 줄뿐인 것을 보여 주세요.</p><p>InvalidateRequerySuggested: 입력 없이 상태가 바뀔 때 필요 — 확장 과제 2 에서 직접 겪게 됩니다. 브라우저 실행 창은 Tick 뒤에도 다시 묻기 때문에 빼먹어도 티가 안 날 수 있다는 점도 알려 줍니다.</p>' },
          { layout: 'table', title: '확장 아이디어', head: ['주제', '방향'], rows: [
            ['랩 저장', 'SaveFileDialog + WriteAllLines (과제 1)'],
            ['MVVM 타이머', 'InvalidateRequerySuggested (과제 2)'],
            ['단축키', 'KeyBinding: Space · L'],
            ['설정 기억', '마지막 타이머 시간 파일 저장'],
            ['여러 타이머', 'ObservableCollection&lt;TimerViewModel&gt;']
          ],
            notes: '<p><b>[2분]</b> 과제 1(★★)은 모두, 과제 2(★★★)는 빨리 끝난 학생이 도전합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'MVVM 타이머가 저절로 끝났는데 “시작” 버튼이 계속 꺼져 있다. 해결책은?', options: ['IsEnabled="True" 로 고정', '끝나는 곳에서 InvalidateRequerySuggested()', 'Tick 간격을 줄인다', 'RelayCommand 를 매번 새로'], answer: 1, explain: '입력 없이 상태가 바뀌면 CanExecute 를 다시 물어보라고 직접 알려야 합니다.',
            notes: '<p>정답 후 “왜 스톱워치에서는 괜찮았나?” → 버튼 클릭(입력)으로만 상태가 바뀌었기 때문.</p>' },
          { layout: 'practice', title: '확장 과제 1. 랩 기록 CSV 저장', desc: '<p>SaveFileDialog(필터 · 시각이 들어간 기본 이름) → 머리글 + 랩마다 한 줄 → File.WriteAllLines, 취소 · 랩 없음 · IOException 처리.</p>', starter: E1_STARTER, solution: E1_SOLUTION,
            notes: '<p><b>[15분]</b> 21장의 SaveFileDialog 복습. 저장은 1번 랩부터(화면은 최근 랩이 위)라는 점을 짚습니다. 브라우저에서는 작업 폴더에 저장되고, Visual Studio 에서는 진짜 파일로 저장되어 엑셀로 열어 볼 수 있습니다.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['시간 = Stopwatch, 화면 갱신 = DispatcherTimer', 'TimeSpan 서식 <code>@"mm\\:ss\\.ff"</code>, 60분 넘으면 TotalMinutes', '상태 → 버튼을 한 곳에서 (UpdateButtons / canExecute)', '데이터(List) → 화면, Min · Max 로 강조', '입력 검사 · 종료는 Stop → 화면 → 알림', 'TabControl 로 합치고, MVVM 으로 나누기'],
            notes: '<p>다음 프로젝트(P09 메모장)에서는 메뉴 · 파일 대화상자 · 여러 창을 모두 써서 “진짜 윈도우 프로그램” 을 만듭니다.</p>' }
        ]
      }
    ]
  });
})();
