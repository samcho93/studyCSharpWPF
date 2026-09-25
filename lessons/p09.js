/* Project 09. WPF 메모장 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;
  // 코드 상수는 String.raw 로 쓴다 — C# 의 "\n" 같은 역슬래시를 그대로 둘 수 있다

  /* ---------- 그림 1. 완성 화면 스케치 ---------- */
  const SVG_UI = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="메모장 화면: 파일 편집 서식 보기 메뉴, 글 쓰는 영역, 줄 열 글자 수 크기가 표시되는 상태 표시줄, 찾기 대화상자">
  <defs><marker id="ap9a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="20" width="640" height="520" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="62" y="54" style="font-size:20px;fill:var(--fg)">*할 일.txt - 메모장</text>
  <text x="660" y="54" text-anchor="end" style="font-size:20px;fill:var(--muted)">—  ☐  ✕</text>
  <line x1="40" y1="70" x2="680" y2="70" stroke="var(--line)" stroke-width="2"/>
  <rect x="46" y="74" width="628" height="40" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="62" y="101">파일(<tspan text-decoration="underline">F</tspan>)</text>
    <text x="160" y="101">편집(<tspan text-decoration="underline">E</tspan>)</text>
    <text x="258" y="101">서식(<tspan text-decoration="underline">O</tspan>)</text>
    <text x="356" y="101">보기(<tspan text-decoration="underline">V</tspan>)</text>
  </g>
  <rect x="46" y="120" width="628" height="350" rx="4" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="64" y="156">오늘 할 일</text>
    <text x="64" y="192">- WPF 메모장 <tspan style="fill:var(--accent2)">완성</tspan>하기</text>
    <text x="64" y="228">- 찾기 창 만들기|</text>
  </g>
  <rect x="300" y="250" width="350" height="190" rx="8" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="318" y="282" style="font-size:19px;fill:var(--fg)">찾기</text>
  <line x1="300" y1="296" x2="650" y2="296" stroke="var(--line)" stroke-width="2"/>
  <text x="318" y="332" style="font-size:18px;fill:var(--fg)">찾을 내용:</text>
  <rect x="420" y="310" width="210" height="32" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="430" y="333" style="font-size:18px;fill:var(--fg)">완성</text>
  <text x="318" y="376" style="font-size:18px;fill:var(--fg)">☐ 대/소문자 구분</text>
  <rect x="452" y="394" width="92" height="32" rx="5" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="498" y="416" text-anchor="middle" style="font-size:17px;fill:var(--fg)">다음 찾기</text>
  <rect x="552" y="394" width="80" height="32" rx="5" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="592" y="416" text-anchor="middle" style="font-size:17px;fill:var(--fg)">취소</text>
  <rect x="46" y="476" width="628" height="54" rx="4" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="62" y="510">찾았습니다</text>
    <line x1="220" y1="486" x2="220" y2="520" stroke="var(--line)" stroke-width="2"/>
    <text x="236" y="510">줄 3, 열 11</text>
    <line x1="380" y1="486" x2="380" y2="520" stroke="var(--line)" stroke-width="2"/>
    <text x="396" y="510">32자</text>
    <line x1="480" y1="486" x2="480" y2="520" stroke="var(--line)" stroke-width="2"/>
    <text x="496" y="510">크기 15</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="730" y1="94" x2="684" y2="94" marker-end="url(#ap9a)"/>
    <line x1="730" y1="190" x2="684" y2="190" marker-end="url(#ap9a)"/>
    <line x1="730" y1="340" x2="656" y2="340" marker-end="url(#ap9a)"/>
    <line x1="730" y1="500" x2="684" y2="500" marker-end="url(#ap9a)"/>
    <line x1="730" y1="54" x2="300" y2="48" marker-end="url(#ap9a)"/>
  </g>
  <text x="740" y="46" style="font-size:22px;font-weight:700;fill:var(--danger)">⓪ 제목: *이름 = 저장 안 한 변경</text>
  <text x="740" y="100" style="font-size:22px;font-weight:700;fill:var(--accent)">① Menu — 파일 · 편집 · 서식 · 보기</text>
  <text x="740" y="128" style="font-size:18px;fill:var(--muted)">명령(Command) · 체크 항목 · 하위 메뉴</text>
  <text x="740" y="196" style="font-size:22px;font-weight:700;fill:var(--ok)">② TextBox — 글 쓰는 영역</text>
  <text x="740" y="224" style="${MONO};font-size:18px;fill:var(--muted)">AcceptsReturn · TextWrapping</text>
  <text x="740" y="346" style="font-size:22px;font-weight:700;fill:var(--warn)">③ 찾기 — 두 번째 창 (ShowDialog)</text>
  <text x="740" y="374" style="font-size:18px;fill:var(--muted)">DialogResult 로 결과를 돌려준다</text>
  <text x="740" y="506" style="font-size:22px;font-weight:700;fill:var(--warn)">④ StatusBar — 줄 · 열 · 글자 수 · 크기</text>
  <text x="740" y="534" style="${MONO};font-size:18px;fill:var(--muted)">CaretIndex 로 계산</text>
</svg>`;

  /* ---------- 그림 2. 저장 확인 흐름 ---------- */
  const SVG_DIRTY = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="새로 만들기, 열기, 닫기 전에 바뀐 내용이 있으면 저장할지 묻고, 예면 저장, 아니요면 그대로 진행, 취소면 멈춘다">
  <defs><marker id="ap9b" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="40" y="220" width="230" height="110" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="155" y="262" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">새로 만들기</text>
  <text x="155" y="292" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">열기 · 창 닫기</text>
  <text x="155" y="318" text-anchor="middle" style="font-size:17px;fill:var(--muted)">지금 글을 버리는 일</text>
  <polygon points="470,190 600,275 470,360 340,275" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="470" y="270" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">isDirty ?</text>
  <text x="470" y="298" text-anchor="middle" style="font-size:17px;fill:var(--muted)">바뀐 내용 있음?</text>
  <rect x="690" y="215" width="250" height="120" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <text x="815" y="255" text-anchor="middle" style="font-size:20px;fill:var(--fg)">“바뀐 내용을</text>
  <text x="815" y="283" text-anchor="middle" style="font-size:20px;fill:var(--fg)">저장할까요?”</text>
  <text x="815" y="315" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">YesNoCancel</text>
  <rect x="1020" y="60" width="220" height="80" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="1130" y="96" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--ok)">예 → 저장</text>
  <text x="1130" y="124" text-anchor="middle" style="font-size:16px;fill:var(--muted)">저장 성공하면 진행</text>
  <rect x="1020" y="235" width="220" height="80" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
  <text x="1130" y="271" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--accent2)">아니요 → 진행</text>
  <text x="1130" y="299" text-anchor="middle" style="font-size:16px;fill:var(--muted)">저장하지 않고 버림</text>
  <rect x="1020" y="410" width="220" height="80" rx="12" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="1130" y="446" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--danger)">취소 → 멈춤</text>
  <text x="1130" y="474" text-anchor="middle" style="font-size:16px;fill:var(--muted)">아무것도 하지 않음</text>
  <g stroke="var(--accent)" stroke-width="3" fill="none">
    <line x1="272" y1="275" x2="334" y2="275" marker-end="url(#ap9b)"/>
    <line x1="602" y1="275" x2="682" y2="275" marker-end="url(#ap9b)"/>
    <path d="M940,250 C980,200 980,110 1012,104" marker-end="url(#ap9b)"/>
    <line x1="942" y1="275" x2="1012" y2="275" marker-end="url(#ap9b)"/>
    <path d="M940,300 C980,350 980,440 1012,448" marker-end="url(#ap9b)"/>
    <path d="M470,362 L470,470 L660,470" marker-end="url(#ap9b)"/>
  </g>
  <text x="640" y="262" text-anchor="middle" style="font-size:19px;fill:var(--fg)">예</text>
  <text x="484" y="420" style="font-size:19px;fill:var(--fg)">아니요 → 묻지 않고 바로 진행</text>
  <text x="40" y="530" style="font-size:20px;fill:var(--muted)">ConfirmSave() 가 true 를 돌려주면 “계속해도 좋다”, false 면 “멈춰라” — 세 곳(새로 · 열기 · Closing)이 함께 쓴다</text>
  <text x="40" y="60" style="font-size:22px;font-weight:700;fill:var(--accent)">더티 플래그(dirty flag) — “저장한 뒤로 글이 바뀌었나?”</text>
  <text x="40" y="96" style="${MONO};font-size:19px;fill:var(--fg)">TextChanged → isDirty = true, 제목에 *</text>
  <text x="40" y="128" style="${MONO};font-size:19px;fill:var(--fg)">열기 · 저장 성공 → isDirty = false, * 지움</text>
</svg>`;

  /* ---------- 그림 3. 찾기 대화상자 ---------- */
  const SVG_FIND = `<svg viewBox="0 0 1280 480" width="100%" role="img" aria-label="주 창이 찾을 말을 생성자로 넘기고 ShowDialog 로 기다린 뒤, 찾기 창이 DialogResult true 로 닫히면 속성으로 찾을 말을 읽어 IndexOf 로 찾고 Select 로 표시한다">
  <defs><marker id="ap9c" markerWidth="14" markerHeight="14" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="40" y="40" width="360" height="400" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="220" y="88" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--accent)">MainWindow</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="60" y="140">var dlg = new FindWindow(</text>
    <text x="60" y="164">    findText, findMatchCase);</text>
    <text x="60" y="190">dlg.Owner = this;</text>
    <text x="60" y="236">if (dlg.ShowDialog() == true)</text>
    <text x="60" y="260">{</text>
    <text x="60" y="284">  findText = dlg.FindText;</text>
    <text x="60" y="308">  FindNext();</text>
    <text x="60" y="332">}</text>
    <text x="60" y="382" style="fill:var(--muted)">IndexOf → Select(i, 길이)</text>
  </g>
  <rect x="880" y="40" width="360" height="400" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="1060" y="88" text-anchor="middle" style="font-size:26px;font-weight:700;fill:var(--warn)">FindWindow</text>
  <g style="${MONO};font-size:17px;fill:var(--fg)">
    <text x="900" y="140">public string FindText</text>
    <text x="900" y="164">    =&gt; txtFind.Text;</text>
    <text x="900" y="190">public bool MatchCase …</text>
    <text x="900" y="250">[다음 찾기] IsDefault</text>
    <text x="900" y="274">  → DialogResult = true;</text>
    <text x="900" y="320">[취소] IsCancel</text>
    <text x="900" y="344">  → DialogResult = false</text>
  </g>
  <g stroke-width="4">
    <line x1="410" y1="150" x2="870" y2="150" stroke="var(--accent)" marker-end="url(#ap9c)"/>
    <line x1="870" y1="262" x2="410" y2="262" stroke="var(--accent)" marker-end="url(#ap9c)"/>
  </g>
  <text x="640" y="136" text-anchor="middle" style="font-size:20px;fill:var(--fg)">① 생성자로 처음 값 전달</text>
  <text x="640" y="236" text-anchor="middle" style="font-size:20px;fill:var(--fg)">② 닫히면 ShowDialog() 가 true</text>
  <text x="640" y="296" text-anchor="middle" style="font-size:20px;fill:var(--fg)">③ 주 창이 속성을 읽는다</text>
  <text x="640" y="400" text-anchor="middle" style="font-size:19px;fill:var(--muted)">찾기 창은 주 창의 TextBox 를 모른다 — 찾을 말만 돌려준다</text>
</svg>`;

  /* ======================= p09-1 예제 코드 ======================= */
  const EX_PREP_FILE = String.raw`using System;
using System.IO;

class Program
{
    // 커서 위치(caret, 0부터) → 줄 · 열 (1부터). 메모장 상태 표시줄의 계산과 같다
    static (int line, int col) GetLineColumn(string text, int caret)
    {
        caret = Math.Clamp(caret, 0, text.Length);
        string before = text.Substring(0, caret);          // 커서 앞의 글
        int line = before.Split('\n').Length;              // 앞의 줄 바꿈 개수 + 1
        int lineStart = before.LastIndexOf('\n') + 1;      // 커서가 있는 줄의 시작 위치
        int col = caret - lineStart + 1;
        return (line, col);
    }

    static void Main()
    {
        string memo = "첫째 줄\n둘째 줄입니다\n셋째";
        File.WriteAllText("연습.txt", memo);               // 파일 전체를 한 번에 쓰기
        string loaded = File.ReadAllText("연습.txt");      // 파일 전체를 한 번에 읽기
        Console.WriteLine($"읽은 글자 수: {loaded.Length}, 같은 내용? {loaded == memo}");
        Console.WriteLine($"줄 수: {loaded.Split('\n').Length}");
        foreach (int caret in new[] { 0, 3, 5, 12, loaded.Length })
        {
            var (line, col) = GetLineColumn(loaded, caret);
            Console.WriteLine($"커서 {caret,2} → 줄 {line}, 열 {col}");
        }
    }
}`;

  const EX_PREP_TEXTBOX = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Prep2.MainWindow"
        ${NS}
        Title="TextBox 실험실" Width="520" Height="380">
    <DockPanel Margin="10">
        <!-- 속성을 켜고 끄는 체크 상자들 -->
        <WrapPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <CheckBox x:Name="chkReturn" Content="AcceptsReturn" IsChecked="True" Margin="0,0,14,0" Click="Option_Click"/>
            <CheckBox x:Name="chkTab" Content="AcceptsTab" IsChecked="True" Margin="0,0,14,0" Click="Option_Click"/>
            <CheckBox x:Name="chkWrap" Content="TextWrapping=Wrap" IsChecked="True" Margin="0,0,14,0" Click="Option_Click"/>
            <CheckBox x:Name="chkReadOnly" Content="IsReadOnly" Click="Option_Click"/>
        </WrapPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray" TextWrapping="Wrap"/>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" AcceptsTab="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Auto"
                 Text="체크 상자를 하나씩 끄고 켜 보세요. AcceptsReturn 을 끄면 Enter 로 줄을 바꿀 수 없고, AcceptsTab 을 끄면 Tab 키가 다음 컨트롤로 포커스를 옮깁니다. TextWrapping 을 끄면 이렇게 긴 줄이 창 밖으로 이어지고 가로 스크롤 막대가 생깁니다."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P09Prep2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            ShowInfo();
        }

        private void Option_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.AcceptsReturn = chkReturn.IsChecked == true;     // Enter = 줄 바꿈
            txtMemo.AcceptsTab = chkTab.IsChecked == true;           // Tab = 탭 글자 넣기
            txtMemo.TextWrapping = chkWrap.IsChecked == true ? TextWrapping.Wrap : TextWrapping.NoWrap;
            txtMemo.IsReadOnly = chkReadOnly.IsChecked == true;      // 읽기 전용 (선택 · 복사만)
            ShowInfo();
            txtMemo.Focus();
        }

        private void ShowInfo()
        {
            lblInfo.Text = $"AcceptsReturn={txtMemo.AcceptsReturn}, AcceptsTab={txtMemo.AcceptsTab}, " +
                           $"TextWrapping={txtMemo.TextWrapping}, IsReadOnly={txtMemo.IsReadOnly}";
        }
    }
}`;

  /* ======================= p09-1 실습 ======================= */
  const P1_STARTER = String.raw`using System;
using System.Linq;

class Program
{
    // 공백(띄어쓰기 · 줄 바꿈 · 탭)을 뺀 글자 수
    static int CountLetters(string text)
    {
        // TODO 1: char.IsWhiteSpace 가 아닌 글자 세기
        return 0;
    }

    // 단어 수: 공백으로 나눈 조각 중 빈 것을 뺀 개수
    static int CountWords(string text)
    {
        // TODO 2: Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries)
        return 0;
    }

    // 줄 수: 빈 문서도 1줄
    static int CountLines(string text)
    {
        // TODO 3: '\n' 으로 나눈 조각 수
        return 0;
    }

    static void Main()
    {
        string memo = "오늘 할 일\n- WPF 메모장 만들기\n- 찾기 창  추가\n";
        Console.WriteLine($"글자 수(공백 포함): {memo.Length}");
        Console.WriteLine($"글자 수(공백 제외): {CountLetters(memo)}");
        Console.WriteLine($"단어 수: {CountWords(memo)}");
        Console.WriteLine($"줄 수: {CountLines(memo)}");
        Console.WriteLine($"빈 문서 → 단어 {CountWords("")}, 줄 {CountLines("")}");
    }
}`;

  const P1_SOLUTION = String.raw`using System;
using System.Linq;

class Program
{
    // 공백(띄어쓰기 · 줄 바꿈 · 탭)을 뺀 글자 수
    static int CountLetters(string text)
    {
        return text.Count(c => !char.IsWhiteSpace(c));
    }

    // 단어 수: 공백으로 나눈 조각 중 빈 것을 뺀 개수
    static int CountWords(string text)
    {
        return text.Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length;
    }

    // 줄 수: 빈 문서도 1줄
    static int CountLines(string text)
    {
        return text.Split('\n').Length;
    }

    static void Main()
    {
        string memo = "오늘 할 일\n- WPF 메모장 만들기\n- 찾기 창  추가\n";
        Console.WriteLine($"글자 수(공백 포함): {memo.Length}");
        Console.WriteLine($"글자 수(공백 제외): {CountLetters(memo)}");
        Console.WriteLine($"단어 수: {CountWords(memo)}");
        Console.WriteLine($"줄 수: {CountLines(memo)}");
        Console.WriteLine($"빈 문서 → 단어 {CountWords("")}, 줄 {CountLines("")}");
    }
}`;

  const GOTO_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09PracGoto.MainWindow"
        ${NS}
        Title="줄로 이동" Width="480" Height="380">
    <DockPanel Margin="10">
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <TextBlock Text="줄 번호:" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <Button DockPanel.Dock="Right" Content="이동" Width="70" Margin="6,0,0,0"
                    IsDefault="True" Click="BtnGo_Click"/>
            <TextBox x:Name="txtLine" Text="3" FontSize="14"/>
        </DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray"
                   Text="줄 번호를 넣고 이동을 누르세요."/>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" VerticalScrollBarVisibility="Auto"/>
    </DockPanel>
</Window>`;

  const P2_STARTER = String.raw`${GOTO_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace P09PracGoto
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            for (int i = 1; i <= 12; i++)
                txtMemo.AppendText($"{i}번째 줄입니다." + (i < 12 ? "\n" : ""));
        }

        private void BtnGo_Click(object sender, RoutedEventArgs e)
        {
            string[] lines = txtMemo.Text.Split('\n');
            // TODO 1: txtLine 을 int.TryParse — 숫자가 아니거나 1 ~ lines.Length 밖이면
            //         MessageBox 로 "1부터 n 사이의 줄 번호를 입력하세요." 후 끝
            // TODO 2: n 번째 줄이 시작하는 글자 위치 = 앞의 줄들의 (길이 + 1) 을 모두 더한 값
            // TODO 3: txtMemo.Focus() 후 txtMemo.Select(시작 위치, 그 줄의 길이) 로 줄 전체 선택
            // TODO 4: lblInfo 에 "n번째 줄로 이동했습니다." 표시
        }
    }
}`;

  const P2_SOLUTION = String.raw`${GOTO_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace P09PracGoto
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            for (int i = 1; i <= 12; i++)
                txtMemo.AppendText($"{i}번째 줄입니다." + (i < 12 ? "\n" : ""));
        }

        private void BtnGo_Click(object sender, RoutedEventArgs e)
        {
            string[] lines = txtMemo.Text.Split('\n');
            if (!int.TryParse(txtLine.Text.Trim(), out int n) || n < 1 || n > lines.Length)
            {
                MessageBox.Show($"1부터 {lines.Length} 사이의 줄 번호를 입력하세요.", "줄로 이동",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            int start = 0;
            for (int i = 0; i < n - 1; i++)
                start += lines[i].Length + 1;          // + 1 = 줄 바꿈 글자 '\n'

            txtMemo.Focus();
            txtMemo.Select(start, lines[n - 1].Length);  // 그 줄 전체를 선택해서 눈에 띄게
            lblInfo.Text = $"{n}번째 줄로 이동했습니다.";
        }
    }
}`;

  /* ======================= p09-1 슬라이드용 짧은 코드 ======================= */
  const SL_CARET = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09SlideCaret.MainWindow"
        ${NS}
        Title="줄 · 열 표시" Width="420" Height="260">
    <DockPanel>
        <StatusBar DockPanel.Dock="Bottom"><StatusBarItem><TextBlock x:Name="lblPos" Text="줄 1, 열 1"/></StatusBarItem></StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True"
                 TextChanged="TxtMemo_TextChanged" SelectionChanged="TxtMemo_SelectionChanged"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls;
namespace P09SlideCaret
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e) { UpdatePos(); }
        private void TxtMemo_SelectionChanged(object sender, RoutedEventArgs e) { UpdatePos(); }
        private void UpdatePos()
        {
            int caret = Math.Min(txtMemo.CaretIndex, txtMemo.Text.Length);
            string before = txtMemo.Text.Substring(0, caret);
            int line = before.Split('\n').Length;
            int col = caret - (before.LastIndexOf('\n') + 1) + 1;
            lblPos.Text = $"줄 {line}, 열 {col}";
        }
    }
}`;

  /* ======================= p09-2 예제 코드 ======================= */
  // 단계 1 ~ 3 이 함께 쓰는 상태 표시줄 + 글 영역 XAML
  const STATUS_AND_TEXT = String.raw`        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblPos" Text="줄 1, 열 1"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblChars" Text="0자"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" AcceptsTab="True"
                 TextWrapping="Wrap" VerticalScrollBarVisibility="Auto" BorderThickness="0"
                 TextChanged="TxtMemo_TextChanged" SelectionChanged="TxtMemo_SelectionChanged"/>`;

  // 단계 1 ~ 3 이 함께 쓰는 상태 표시줄 갱신 코드
  const UPDATE_STATUS = String.raw`        // 커서 위치 → "줄 n, 열 m" (앞의 '\n' 개수로 계산)
        private void UpdateStatus()
        {
            string text = txtMemo.Text;
            int caret = Math.Min(txtMemo.CaretIndex, text.Length);
            string before = text.Substring(0, caret);
            int line = before.Split('\n').Length;
            int col = caret - (before.LastIndexOf('\n') + 1) + 1;
            lblPos.Text = $"줄 {line}, 열 {col}";
            lblChars.Text = $"{text.Length}자";
        }`;

  const EX_STEP1 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Step1.MainWindow"
        ${NS}
        Title="제목 없음 - 메모장" Width="540" Height="420">
    <DockPanel>
        <!-- ① 메뉴 막대: 네 메뉴의 뼈대 (아직은 대부분 "다음 단계에서") -->
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" InputGestureText="Ctrl+N" Click="NotYet_Click"/>
                <MenuItem Header="열기(_O)..." InputGestureText="Ctrl+O" Click="NotYet_Click"/>
                <MenuItem Header="저장(_S)" InputGestureText="Ctrl+S" Click="NotYet_Click"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Click="NotYet_Click"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
            <MenuItem Header="편집(_E)">
                <MenuItem Header="찾기(_F)..." InputGestureText="Ctrl+F" Click="NotYet_Click"/>
                <MenuItem Header="다음 찾기(_N)" InputGestureText="F3" Click="NotYet_Click"/>
                <Separator/>
                <MenuItem Header="시간/날짜(_D)" InputGestureText="F5" Click="NotYet_Click"/>
            </MenuItem>
            <MenuItem Header="서식(_O)">
                <MenuItem Header="글꼴 크기(_S)" Click="NotYet_Click"/>
            </MenuItem>
            <MenuItem Header="보기(_V)">
                <MenuItem Header="자동 줄 바꿈(_W)" Click="NotYet_Click"/>
                <MenuItem Header="상태 표시줄(_S)" Click="NotYet_Click"/>
            </MenuItem>
        </Menu>
        <!-- ② 상태 표시줄 (작업 영역보다 먼저) · ③ 글 영역 (마지막 = 나머지 전부) -->
${STATUS_AND_TEXT}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace P09Step1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtMemo.Text = "WPF 메모장 — 단계 1\n메뉴와 상태 표시줄의 뼈대입니다.\n글을 쓰면 아래의 줄 · 열 · 글자 수가 바뀝니다.";
            UpdateStatus();
        }

        // 아직 만들지 않은 메뉴: 어떤 메뉴인지 상태 표시줄에 알려 주기만 한다
        private void NotYet_Click(object sender, RoutedEventArgs e)
        {
            string name = $"{((MenuItem)sender).Header}".Replace("_", "");
            lblStatus.Text = $"[{name}] — 다음 단계에서 만듭니다.";
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e) { UpdateStatus(); }
        private void TxtMemo_SelectionChanged(object sender, RoutedEventArgs e) { UpdateStatus(); }

${UPDATE_STATUS}
    }
}`;

  const FILE_MENU = String.raw`            <MenuItem Header="파일(_F)">
                <!-- Command 를 주면 단축키 글자(Ctrl+N …)가 저절로 표시된다 -->
                <MenuItem Header="새로 만들기(_N)" Command="ApplicationCommands.New"/>
                <MenuItem Header="열기(_O)..." Command="ApplicationCommands.Open"/>
                <MenuItem Header="저장(_S)" Command="ApplicationCommands.Save"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="ApplicationCommands.SaveAs"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>`;

  const FILE_BINDINGS = String.raw`    <!-- 명령 ↔ 처리기 연결을 XAML 에서 (코드의 CommandBindings.Add 와 같다) -->
    <Window.CommandBindings>
        <CommandBinding Command="ApplicationCommands.New" Executed="New_Executed"/>
        <CommandBinding Command="ApplicationCommands.Open" Executed="Open_Executed"/>
        <CommandBinding Command="ApplicationCommands.Save" Executed="Save_Executed"/>
        <CommandBinding Command="ApplicationCommands.SaveAs" Executed="SaveAs_Executed"/>
    </Window.CommandBindings>`;

  const EX_STEP2 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Step2.MainWindow"
        ${NS}
        Title="제목 없음 - 메모장" Width="540" Height="420">
${FILE_BINDINGS}
    <DockPanel>
        <Menu DockPanel.Dock="Top">
${FILE_MENU}
        </Menu>
${STATUS_AND_TEXT}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.IO;               // File, Path
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;    // ExecutedRoutedEventArgs
using Microsoft.Win32;         // OpenFileDialog, SaveFileDialog

namespace P09Step2
{
    public partial class MainWindow : Window
    {
        private const string TextFilter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";
        private string currentPath = "";   // 지금 문서의 파일 경로 ("" = 아직 저장한 적 없음)

        public MainWindow()
        {
            InitializeComponent();
            // 열기 연습용 파일 (작업 폴더)
            if (!File.Exists("예제 메모.txt"))
                File.WriteAllText("예제 메모.txt", "파일 ▸ 열기로 불러온 글입니다.\n고친 뒤 Ctrl+S 로 저장해 보세요.");
            txtMemo.Text = "파일 ▸ 열기 로 '예제 메모.txt' 를 열어 보세요.";
            UpdateTitle();
            UpdateStatus();
        }

        // ---------- 새로 만들기 ----------
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            txtMemo.Clear();
            currentPath = "";
            UpdateTitle();
            lblStatus.Text = "새 문서";
        }

        // ---------- 열기 ----------
        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "열기";
            dlg.Filter = TextFilter;
            if (dlg.ShowDialog() != true) return;          // 취소

            try
            {
                txtMemo.Text = File.ReadAllText(dlg.FileName);
                currentPath = dlg.FileName;
                UpdateTitle();
                lblStatus.Text = $"열었습니다: {Path.GetFileName(currentPath)}";
            }
            catch (Exception ex)                           // 파일이 없거나, 쓰는 중이거나, 권한이 없을 때
            {
                MessageBox.Show("파일을 열 수 없습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ---------- 저장 · 다른 이름으로 저장 ----------
        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemo(); }
        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemoAs(); }

        // 저장에 성공하면 true
        private bool SaveMemo()
        {
            if (currentPath == "") return SaveMemoAs();      // 처음 저장 → 이름부터 묻는다
            return WriteFile(currentPath);
        }

        private bool SaveMemoAs()
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Title = "다른 이름으로 저장";
            dlg.Filter = TextFilter;
            dlg.DefaultExt = ".txt";
            dlg.FileName = currentPath == "" ? "제목 없음.txt" : Path.GetFileName(currentPath);
            if (dlg.ShowDialog() != true) return false;
            return WriteFile(dlg.FileName);
        }

        private bool WriteFile(string path)
        {
            try
            {
                File.WriteAllText(path, txtMemo.Text);
            }
            catch (Exception ex)
            {
                MessageBox.Show("저장하지 못했습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
            currentPath = path;                              // 성공했을 때만 경로를 바꾼다
            UpdateTitle();
            lblStatus.Text = $"저장했습니다: {Path.GetFileName(path)} ({txtMemo.Text.Length}자)";
            return true;
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }

        private void UpdateTitle()
        {
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            Title = name + " - 메모장";
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e) { UpdateStatus(); }
        private void TxtMemo_SelectionChanged(object sender, RoutedEventArgs e) { UpdateStatus(); }

${UPDATE_STATUS}
    }
}`;

  // 단계 3 과 실습 P9-3 · P9-4 가 함께 쓰는 "파일 기능 + 더티 플래그" 코드 비하인드 본문
  const DIRTY_CORE = String.raw`        private const string TextFilter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";
        private string currentPath = "";
        private bool isDirty = false;       // 저장한 뒤로 글이 바뀌었나? (더티 플래그)

        public MainWindow()
        {
            InitializeComponent();
            if (!File.Exists("예제 메모.txt"))
                File.WriteAllText("예제 메모.txt", "파일 ▸ 열기로 불러온 글입니다.\n고친 뒤 Ctrl+S 로 저장해 보세요.");
            txtMemo.Text = "글을 고치면 제목에 * 가 붙습니다.\n창을 닫거나 새로 만들기를 하면 저장할지 묻습니다.";
            isDirty = false;                // Text 를 넣으며 TextChanged 가 true 로 만든 것을 되돌림
            UpdateTitle();
            UpdateStatus();
        }

        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (!isDirty)                   // 처음 바뀔 때만 제목을 고친다
            {
                isDirty = true;
                UpdateTitle();
            }
            UpdateStatus();
        }

        private void TxtMemo_SelectionChanged(object sender, RoutedEventArgs e) { UpdateStatus(); }

        // ---------- 새로 만들기 · 열기 ----------
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;     // 취소 → 아무것도 하지 않는다
            txtMemo.Clear();
            currentPath = "";
            SetClean("새 문서");
        }

        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "열기";
            dlg.Filter = TextFilter;
            if (dlg.ShowDialog() != true) return;
            try
            {
                txtMemo.Text = File.ReadAllText(dlg.FileName);
                currentPath = dlg.FileName;
                SetClean($"열었습니다: {Path.GetFileName(currentPath)}");
            }
            catch (Exception ex)
            {
                MessageBox.Show("파일을 열 수 없습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ---------- 저장 ----------
        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemo(); }
        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemoAs(); }

        private bool SaveMemo()
        {
            if (currentPath == "") return SaveMemoAs();
            return WriteFile(currentPath);
        }

        private bool SaveMemoAs()
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Title = "다른 이름으로 저장";
            dlg.Filter = TextFilter;
            dlg.DefaultExt = ".txt";
            dlg.FileName = currentPath == "" ? "제목 없음.txt" : Path.GetFileName(currentPath);
            if (dlg.ShowDialog() != true) return false;
            return WriteFile(dlg.FileName);
        }

        private bool WriteFile(string path)
        {
            try
            {
                File.WriteAllText(path, txtMemo.Text);
            }
            catch (Exception ex)
            {
                MessageBox.Show("저장하지 못했습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
            currentPath = path;
            SetClean($"저장했습니다: {Path.GetFileName(path)} ({txtMemo.Text.Length}자)");
            return true;
        }

        // ---------- 저장 확인: 계속해도 되면 true ----------
        private bool ConfirmSave()
        {
            if (!isDirty) return true;
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            MessageBoxResult r = MessageBox.Show($"'{name}' 의 바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Yes) return SaveMemo();   // 저장 대화상자에서 취소하면 false
            if (r == MessageBoxResult.No) return true;          // 버리고 진행
            return false;                                       // Cancel · ✕
        }

        // ---------- 닫기 ----------
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!ConfirmSave()) e.Cancel = true;   // 취소 → 창이 닫히지 않는다
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();                               // Close() 도 Closing 을 거친다
        }

        private void SetClean(string message)
        {
            isDirty = false;
            UpdateTitle();
            lblStatus.Text = message;
        }

        private void UpdateTitle()
        {
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            Title = (isDirty ? "*" : "") + name + " - 메모장";
        }

${UPDATE_STATUS}`;

  const DIRTY_USING = (ns) => String.raw`// ===== File: MainWindow.xaml.cs =====
using System;
using System.ComponentModel;   // CancelEventArgs
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using Microsoft.Win32;

namespace ${ns}
{
    public partial class MainWindow : Window
    {`;

  const DIRTY_XAML = (ns, extraMenu) => String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="제목 없음 - 메모장" Width="540" Height="420"
        Closing="Window_Closing">
${FILE_BINDINGS}
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" Command="ApplicationCommands.New"/>
                <MenuItem Header="열기(_O)..." Command="ApplicationCommands.Open"/>
                <MenuItem Header="저장(_S)" Command="ApplicationCommands.Save"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="ApplicationCommands.SaveAs"/>${extraMenu || ''}
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
${STATUS_AND_TEXT}
    </DockPanel>
</Window>`;

  const EX_STEP3 = String.raw`${DIRTY_XAML('P09Step3')}
${DIRTY_USING('P09Step3')}
${DIRTY_CORE}
    }
}`;

  /* ======================= p09-2 실습 ======================= */
  const REVERT_MENU = String.raw`
                <MenuItem Header="저장된 내용으로 되돌리기(_R)" Click="Revert_Click"/>`;
  const INFO_MENU = String.raw`
                <MenuItem Header="파일 정보(_I)..." Click="FileInfo_Click"/>`;

  const P3_STARTER = String.raw`${DIRTY_XAML('P09PracRevert', REVERT_MENU)}
${DIRTY_USING('P09PracRevert')}
${DIRTY_CORE}

        // ---------- 실습: 저장된 내용으로 되돌리기 ----------
        private void Revert_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: currentPath 가 "" 이면 "아직 저장한 적이 없는 문서입니다." 알림 후 끝
            // TODO 2: isDirty 가 false 면 lblStatus 에 "바뀐 내용이 없습니다." 후 끝
            // TODO 3: "마지막으로 저장한 내용으로 되돌릴까요?\n지금 고친 내용은 사라집니다." (YesNo, Warning)
            //         Yes 일 때만 File.ReadAllText 로 다시 읽고 SetClean("되돌렸습니다")
        }
    }
}`;

  const P3_SOLUTION = String.raw`${DIRTY_XAML('P09PracRevert', REVERT_MENU)}
${DIRTY_USING('P09PracRevert')}
${DIRTY_CORE}

        // ---------- 실습: 저장된 내용으로 되돌리기 ----------
        private void Revert_Click(object sender, RoutedEventArgs e)
        {
            if (currentPath == "")
            {
                MessageBox.Show("아직 저장한 적이 없는 문서입니다.", "되돌리기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            if (!isDirty)
            {
                lblStatus.Text = "바뀐 내용이 없습니다.";
                return;
            }
            MessageBoxResult r = MessageBox.Show("마지막으로 저장한 내용으로 되돌릴까요?\n지금 고친 내용은 사라집니다.",
                "되돌리기", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;
            try
            {
                txtMemo.Text = File.ReadAllText(currentPath);
                SetClean("되돌렸습니다");                  // Text 를 바꿔 true 가 된 isDirty 를 다시 false 로
            }
            catch (Exception ex)
            {
                MessageBox.Show("파일을 다시 읽지 못했습니다.\n" + ex.Message, "되돌리기", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}`;

  const P4_STARTER = String.raw`${DIRTY_XAML('P09PracInfo', INFO_MENU)}
${DIRTY_USING('P09PracInfo')}
${DIRTY_CORE}

        // ---------- 실습: 파일 정보 ----------
        private void FileInfo_Click(object sender, RoutedEventArgs e)
        {
            // TODO 1: currentPath 가 "" 이면 "아직 저장하지 않은 문서입니다. (지금 n자)" 알림 후 끝
            // TODO 2: FileInfo info = new FileInfo(currentPath); 로 이름 · 크기(바이트) · 수정한 시각 읽기
            // TODO 3: "이름: …\n크기: … 바이트\n수정한 시각: yyyy-MM-dd HH:mm\n저장 안 한 변경: 있음/없음" 을
            //         MessageBox(OK, Information) 로 보여 주기
        }
    }
}`;

  const P4_SOLUTION = String.raw`${DIRTY_XAML('P09PracInfo', INFO_MENU)}
${DIRTY_USING('P09PracInfo')}
${DIRTY_CORE}

        // ---------- 실습: 파일 정보 ----------
        private void FileInfo_Click(object sender, RoutedEventArgs e)
        {
            if (currentPath == "")
            {
                MessageBox.Show($"아직 저장하지 않은 문서입니다. (지금 {txtMemo.Text.Length}자)", "파일 정보",
                    MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            FileInfo info = new FileInfo(currentPath);     // 파일 자체의 정보 (디스크 기준)
            string message = $"이름: {info.Name}\n" +
                             $"크기: {info.Length:N0} 바이트\n" +
                             $"수정한 시각: {info.LastWriteTime:yyyy-MM-dd HH:mm}\n" +
                             $"저장 안 한 변경: {(isDirty ? "있음" : "없음")}";
            MessageBox.Show(message, "파일 정보", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }
}`;

  /* ======================= p09-2 슬라이드용 짧은 코드 ======================= */
  const SL_CMD = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09SlideCmd.MainWindow" Title="XAML 의 CommandBindings" Width="420" Height="240"
        ${NS}>
    <Window.CommandBindings>
        <CommandBinding Command="ApplicationCommands.New" Executed="New_Executed"/>
        <CommandBinding Command="ApplicationCommands.Save" Executed="Save_Executed"/>
    </Window.CommandBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" Command="ApplicationCommands.New"/>
                <MenuItem Header="저장(_S)" Command="ApplicationCommands.Save"/>
            </MenuItem>
        </Menu>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" FontSize="15" Text="Ctrl+S 를 눌러 보세요"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Input;
namespace P09SlideCmd
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void New_Executed(object sender, ExecutedRoutedEventArgs e) { txtMemo.Clear(); Title = "새 문서"; }
        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { Title = $"저장! ({txtMemo.Text.Length}자)"; }
    }
}`;

  /* ======================= p09-3 예제 코드 ======================= */
  // 찾기 창 — withDirection 이면 "위로 / 아래로" 라디오 버튼이 있는 판 (실습 P9-6)
  const FIND_XAML = (ns, withDirection) => String.raw`// ===== File: FindWindow.xaml =====
<Window x:Class="${ns}.FindWindow"
        ${NS}
        Title="찾기" Width="380" Height="${withDirection ? 200 : 170}"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False">
    <Grid Margin="12">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <TextBlock Text="찾을 내용:" VerticalAlignment="Center" Margin="0,0,8,0"/>
        <TextBox x:Name="txtFind" Grid.Column="1" FontSize="14"/>
        <StackPanel Grid.Row="1" Grid.Column="1" Margin="0,8,0,0">
            <CheckBox x:Name="chkCase" Content="대/소문자 구분"/>${withDirection ? `
            <StackPanel Orientation="Horizontal" Margin="0,6,0,0">
                <TextBlock Text="방향:" Margin="0,0,8,0"/>
                <RadioButton x:Name="rbUp" Content="위로" GroupName="dir" Margin="0,0,10,0"/>
                <RadioButton x:Name="rbDown" Content="아래로" GroupName="dir" IsChecked="True"/>
            </StackPanel>` : ''}
        </StackPanel>
        <!-- IsDefault = Enter 키, IsCancel = Esc 키 (IsCancel 은 DialogResult = false 로 닫아 준다) -->
        <StackPanel Grid.Row="2" Grid.ColumnSpan="2" Orientation="Horizontal"
                    HorizontalAlignment="Right" VerticalAlignment="Bottom">
            <Button Content="다음 찾기" Width="84" Height="28" IsDefault="True" Click="BtnFind_Click"/>
            <Button Content="취소" Width="70" Height="28" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
    </Grid>
</Window>`;

  const FIND_CS = (ns) => String.raw`// ===== File: FindWindow.xaml.cs =====
using System.Windows;

namespace ${ns}
{
    // 찾기 대화상자: 찾을 말과 옵션만 돌려준다 (주 창의 TextBox 는 모른다)
    public partial class FindWindow : Window
    {
        public string FindText => txtFind.Text;
        public bool MatchCase => chkCase.IsChecked == true;

        // 생성자 매개변수로 지난번에 찾은 말 · 옵션을 받아 채운다
        public FindWindow(string initialText, bool matchCase)
        {
            InitializeComponent();
            txtFind.Text = initialText;
            chkCase.IsChecked = matchCase;
            Loaded += (s, e) => { txtFind.Focus(); txtFind.SelectAll(); };   // 창이 뜨면 바로 입력
        }

        private void BtnFind_Click(object sender, RoutedEventArgs e)
        {
            if (txtFind.Text.Length == 0)
            {
                MessageBox.Show("찾을 내용을 입력하세요.", "찾기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            DialogResult = true;   // 창이 닫히고, 주 창의 ShowDialog() 가 true 를 돌려준다
        }
    }
}`;

  // 단계 4 · 단계 5 · 실습이 함께 쓰는 연습용 글
  const SAMPLE_FIND = 'txtMemo.Text = "사과 한 개, 배 두 개, 사과 세 개.\\n" +\n                           "Apple 과 apple 은 대/소문자만 다르다.\\n" +\n                           "편집 ▸ 찾기(Ctrl+F)로 \'사과\' 를 찾고, 다음 찾기를 눌러 보세요.";';

  const FIND_CORE = String.raw`        private string findText = "";          // 마지막으로 찾은 말 (다음 찾기용)
        private bool findMatchCase = false;

        // ---------- 찾기: 대화상자를 띄운다 ----------
        private void Find_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            // 글을 선택해 둔 상태라면 그 글로 찾기 창을 채운다 (메모장과 같다)
            string initial = txtMemo.SelectionLength > 0 ? txtMemo.SelectedText : findText;
            FindWindow dlg = new FindWindow(initial, findMatchCase);
            dlg.Owner = this;                     // 주 창 가운데에 · 주 창과 함께 최소화
            if (dlg.ShowDialog() == true)         // [다음 찾기] 로 닫혔을 때만
            {
                findText = dlg.FindText;          // 창이 닫힌 뒤에도 속성은 읽을 수 있다
                findMatchCase = dlg.MatchCase;
                FindNext();
            }
        }

        // ---------- 다음 찾기: 선택 영역 "뒤" 부터 ----------
        private void FindNext()
        {
            if (findText == "") { lblStatus.Text = "먼저 찾기(Ctrl+F)로 찾을 말을 정하세요."; return; }
            StringComparison cmp = findMatchCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            string text = txtMemo.Text;
            int start = Math.Min(txtMemo.SelectionStart + txtMemo.SelectionLength, text.Length);

            int index = text.IndexOf(findText, start, cmp);
            bool wrapped = false;
            if (index < 0 && start > 0)           // 끝까지 없으면 처음부터 다시
            {
                index = text.IndexOf(findText, 0, cmp);
                wrapped = true;
            }
            if (index < 0)
            {
                MessageBox.Show($"'{findText}' 을(를) 찾을 수 없습니다.", "메모장", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            txtMemo.Focus();                      // 선택 영역이 보이도록 포커스를 글 영역으로
            txtMemo.Select(index, findText.Length);
            lblStatus.Text = wrapped ? $"문서 끝까지 찾아서 처음부터 다시 찾았습니다: '{findText}'" : $"찾았습니다: '{findText}'";
        }`;

  const EX_STEP4 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Step4.MainWindow"
        ${NS}
        Title="찾기 대화상자 — 단계 4" Width="520" Height="360">
    <Window.CommandBindings>
        <!-- ApplicationCommands.Find 의 기본 단축키 = Ctrl+F -->
        <CommandBinding Command="ApplicationCommands.Find" Executed="Find_Executed"/>
    </Window.CommandBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="편집(_E)">
                <MenuItem Header="찾기(_F)..." Command="ApplicationCommands.Find"/>
                <MenuItem Header="다음 찾기(_N)" Click="FindNext_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="편집 ▸ 찾기 (창을 클릭한 뒤 Ctrl+F)"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" BorderThickness="0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;

namespace P09Step4
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            ${SAMPLE_FIND}
        }

${FIND_CORE}

        private void FindNext_Click(object sender, RoutedEventArgs e) { FindNext(); }
    }
}
${FIND_XAML('P09Step4', false)}
${FIND_CS('P09Step4')}`;

  const EX_STEP5 = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Step5.MainWindow"
        ${NS}
        Title="서식 · 보기 — 단계 5" Width="520" Height="380">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="서식(_O)">
                <!-- 하위 메뉴 네 개 중 "하나만" ✓ — 크기는 Tag 에 -->
                <MenuItem x:Name="mnuFontSize" Header="글꼴 크기(_S)">
                    <MenuItem Header="작게 (12)" Tag="12" IsCheckable="True" Click="FontSize_Click"/>
                    <MenuItem Header="보통 (15)" Tag="15" IsCheckable="True" IsChecked="True" Click="FontSize_Click"/>
                    <MenuItem Header="크게 (18)" Tag="18" IsCheckable="True" Click="FontSize_Click"/>
                    <MenuItem Header="아주 크게 (24)" Tag="24" IsCheckable="True" Click="FontSize_Click"/>
                </MenuItem>
                <Separator/>
                <MenuItem Header="글자 크게(_I)" Click="Bigger_Click"/>
                <MenuItem Header="글자 작게(_D)" Click="Smaller_Click"/>
            </MenuItem>
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)" IsCheckable="True" IsChecked="True" Click="Wrap_Click"/>
                <MenuItem x:Name="mnuStatusBar" Header="상태 표시줄(_S)" IsCheckable="True" IsChecked="True" Click="StatusBar_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="서식 · 보기 메뉴를 써 보세요"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblSize" Text="크기 15"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" BorderThickness="0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;

namespace P09Step5
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtMemo.Text = "이 줄은 아주 길어서 자동 줄 바꿈을 끄면 창의 오른쪽 끝을 넘어가고, 아래에 가로 스크롤 막대가 생깁니다. 켜면 창 너비에 맞춰 다음 줄로 넘어갑니다.\n" +
                           "서식 ▸ 글꼴 크기에서 크기를 고르면 ✓ 가 그 항목으로 옮겨 갑니다.";
        }

        // ---------- 서식 ----------
        private void FontSize_Click(object sender, RoutedEventArgs e)
        {
            SetFontSize(Convert.ToDouble(((MenuItem)sender).Tag));   // Tag="18" → 18.0
        }

        private void Bigger_Click(object sender, RoutedEventArgs e) { SetFontSize(txtMemo.FontSize + 2); }
        private void Smaller_Click(object sender, RoutedEventArgs e) { SetFontSize(txtMemo.FontSize - 2); }

        // 크기를 바꾸는 곳은 여기 한 곳 — ✓ 표시와 상태 표시줄도 함께 맞춘다
        private void SetFontSize(double size)
        {
            size = Math.Clamp(size, 8, 48);
            txtMemo.FontSize = size;
            foreach (object item in mnuFontSize.Items)
                if (item is MenuItem m)
                    m.IsChecked = Convert.ToDouble(m.Tag) == size;   // 크기가 같은 항목에만 ✓ (13 이면 아무것도)
            lblSize.Text = $"크기 {size}";
        }

        // ---------- 보기 ----------
        private void Wrap_Click(object sender, RoutedEventArgs e)
        {
            bool wrap = mnuWrap.IsChecked;                            // 누르면 IsChecked 가 먼저 뒤집혀 온다
            txtMemo.TextWrapping = wrap ? TextWrapping.Wrap : TextWrapping.NoWrap;
            txtMemo.HorizontalScrollBarVisibility = wrap ? ScrollBarVisibility.Disabled : ScrollBarVisibility.Auto;
            lblStatus.Text = wrap ? "자동 줄 바꿈 켬" : "자동 줄 바꿈 끔";
        }

        private void StatusBar_Click(object sender, RoutedEventArgs e)
        {
            statusBar.Visibility = mnuStatusBar.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }
    }
}`;

  const EX_STEP6 = String.raw`// ===== File: NoteCommands.cs =====
using System.Windows.Input;

namespace P09Step6
{
    // 메모장만의 명령: 이름 · 메뉴에 보일 글자 · 기본 단축키를 한 곳에
    public static class NoteCommands
    {
        // ① 단축키를 명령 안에 (InputGestures) → 메뉴에 "Ctrl+D" 가 저절로 표시된다
        public static readonly RoutedUICommand DuplicateLine = new RoutedUICommand(
            "줄 복제(_L)", "DuplicateLine", typeof(NoteCommands),
            new InputGestureCollection { new KeyGesture(Key.D, ModifierKeys.Control) });

        // ② 단축키 없이 만들고, XAML 의 KeyBinding 으로 F5 를 연결한다
        public static readonly RoutedUICommand InsertDateTime = new RoutedUICommand(
            "시간/날짜(_D)", "InsertDateTime", typeof(NoteCommands));
    }
}
// ===== File: MainWindow.xaml =====
<Window x:Class="P09Step6.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:P09Step6"
        Title="나만의 명령과 단축키 — 단계 6" Width="520" Height="360">
    <Window.CommandBindings>
        <CommandBinding Command="{x:Static local:NoteCommands.DuplicateLine}" Executed="DuplicateLine_Executed"/>
        <CommandBinding Command="{x:Static local:NoteCommands.InsertDateTime}" Executed="InsertDateTime_Executed"/>
        <CommandBinding Command="ApplicationCommands.SaveAs" Executed="SaveAs_Executed"/>
    </Window.CommandBindings>
    <Window.InputBindings>
        <!-- 키 ↔ 명령. Command 에는 {Binding} 이 아니라 {x:Static} 으로 명령 개체를 직접 준다 -->
        <KeyBinding Key="F5" Command="{x:Static local:NoteCommands.InsertDateTime}"/>
    </Window.InputBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <!-- SaveAs 에는 기본 단축키가 없다 → 글자는 직접, 키는 코드의 KeyBinding 으로 -->
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="ApplicationCommands.SaveAs"
                          InputGestureText="Ctrl+Shift+S"/>
            </MenuItem>
            <MenuItem Header="편집(_E)">
                <!-- Header 를 비우면 명령의 Text 와 단축키가 저절로 들어간다 -->
                <MenuItem Command="{x:Static local:NoteCommands.DuplicateLine}"/>
                <MenuItem Command="{x:Static local:NoteCommands.InsertDateTime}" InputGestureText="F5"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="글 영역을 클릭한 뒤 F5 · Ctrl+D · Ctrl+Shift+S 를 눌러 보세요"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 VerticalScrollBarVisibility="Auto" BorderThickness="0"
                 Text="이 줄에 커서를 두고 Ctrl+D 를 누르면 줄이 복제됩니다.&#10;F5 는 커서 자리에 지금 시각을 넣습니다."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;

namespace P09Step6
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            // ③ 코드로 KeyBinding 추가: Ctrl+Shift+S → 다른 이름으로 저장
            InputBindings.Add(new KeyBinding(ApplicationCommands.SaveAs, Key.S, ModifierKeys.Control | ModifierKeys.Shift));
        }

        // 커서가 있는 줄을 한 번 더 복사해 바로 아래에 넣는다
        private void DuplicateLine_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            string text = txtMemo.Text;
            int caret = Math.Min(txtMemo.CaretIndex, text.Length);
            int start = text.Substring(0, caret).LastIndexOf('\n') + 1;   // 줄의 시작
            int end = text.IndexOf('\n', caret);                         // 줄의 끝 (줄 바꿈 위치)
            if (end < 0) end = text.Length;                               // 마지막 줄
            string line = text.Substring(start, end - start);
            txtMemo.Text = text.Insert(end, "\n" + line);
            txtMemo.CaretIndex = end + 1 + (caret - start);               // 복제한 줄의 같은 열로
            txtMemo.Focus();
            lblStatus.Text = "줄을 복제했습니다 (Ctrl+D)";
        }

        // 커서 자리에 시각 넣기 — Windows 메모장의 F5 와 같다
        private void InsertDateTime_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            string stamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            int pos = txtMemo.SelectionStart;
            txtMemo.SelectedText = stamp;                 // 선택 영역(없으면 커서 자리)을 바꿔 넣는다
            txtMemo.CaretIndex = pos + stamp.Length;      // 커서는 넣은 글 뒤로
            txtMemo.Focus();
            lblStatus.Text = "시각을 넣었습니다 (F5)";
        }

        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            lblStatus.Text = "다른 이름으로 저장 (Ctrl+Shift+S) — 완성 프로그램에서 진짜 저장";
        }
    }
}`;

  /* ======================= p09-3 실습 ======================= */
  const FONT_XAML = (withMenu) => String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09PracFont.MainWindow"
        ${NS}
        Title="글꼴 고르기" Width="480" Height="320">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="서식(_O)">
                <MenuItem x:Name="mnuFont" Header="글꼴(_F)">${withMenu ? `
                    <MenuItem Header="맑은 고딕" Tag="Malgun Gothic" IsCheckable="True" IsChecked="True" Click="Font_Click"/>
                    <MenuItem Header="굴림체" Tag="GulimChe" IsCheckable="True" Click="Font_Click"/>
                    <MenuItem Header="Consolas" Tag="Consolas" IsCheckable="True" Click="Font_Click"/>` : `
                    <!-- TODO 1: 맑은 고딕(Tag="Malgun Gothic") · 굴림체(Tag="GulimChe") · Consolas(Tag="Consolas")
                         세 항목을 IsCheckable 로 만들고 모두 Click="Font_Click" 에 연결 (맑은 고딕이 처음 ✓) -->`}
                </MenuItem>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblFont" Text="글꼴: 맑은 고딕"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="16" FontFamily="Malgun Gothic" AcceptsReturn="True"
                 TextWrapping="Wrap" Text="가나다라 ABC abc 0123 — 서식 ▸ 글꼴에서 글꼴을 바꿔 보세요."/>
    </DockPanel>
</Window>`;

  const P5_STARTER = String.raw`${FONT_XAML(false)}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;   // FontFamily

namespace P09PracFont
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Font_Click(object sender, RoutedEventArgs e)
        {
            MenuItem picked = (MenuItem)sender;
            // TODO 2: txtMemo.FontFamily 를 new FontFamily((string)picked.Tag) 로
            // TODO 3: mnuFont.Items 의 모든 MenuItem 의 ✓ 를 끄고 picked 만 켜기
            // TODO 4: lblFont 에 "글꼴: 굴림체" 처럼 표시 (Header 사용)
        }
    }
}`;

  const P5_SOLUTION = String.raw`${FONT_XAML(true)}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;   // FontFamily

namespace P09PracFont
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Font_Click(object sender, RoutedEventArgs e)
        {
            MenuItem picked = (MenuItem)sender;
            txtMemo.FontFamily = new FontFamily((string)picked.Tag);
            foreach (object item in mnuFont.Items)
                if (item is MenuItem m) m.IsChecked = false;   // 모두 끄고
            picked.IsChecked = true;                           // 고른 것만 켠다
            lblFont.Text = $"글꼴: {picked.Header}";
        }
    }
}`;

  const UP_MAIN_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09PracFindUp.MainWindow"
        ${NS}
        Title="위로 · 아래로 찾기" Width="520" Height="360">
    <Window.CommandBindings>
        <CommandBinding Command="ApplicationCommands.Find" Executed="Find_Executed"/>
    </Window.CommandBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="편집(_E)">
                <MenuItem Header="찾기(_F)..." Command="ApplicationCommands.Find"/>
                <MenuItem Header="다음 찾기(_N)" Click="FindNext_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="찾기 창에서 방향을 '위로' 로 바꿔 보세요"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap" BorderThickness="0"/>
    </DockPanel>
</Window>`;

  const UP_FIND_CS = (solved) => String.raw`// ===== File: FindWindow.xaml.cs =====
using System.Windows;

namespace P09PracFindUp
{
    public partial class FindWindow : Window
    {
        public string FindText => txtFind.Text;
        public bool MatchCase => chkCase.IsChecked == true;
        ${solved ? 'public bool SearchUp => rbUp.IsChecked == true;        // 위로 찾기?' : '// TODO 1: SearchUp 속성 — rbUp 이 체크되어 있으면 true\n        public bool SearchUp => false;'}

        public FindWindow(string initialText, bool matchCase, bool searchUp)
        {
            InitializeComponent();
            txtFind.Text = initialText;
            chkCase.IsChecked = matchCase;
            ${solved ? 'rbUp.IsChecked = searchUp;\n            rbDown.IsChecked = !searchUp;' : '// TODO 2: searchUp 에 맞춰 rbUp / rbDown 체크'}
            Loaded += (s, e) => { txtFind.Focus(); txtFind.SelectAll(); };
        }

        private void BtnFind_Click(object sender, RoutedEventArgs e)
        {
            if (txtFind.Text.Length == 0) return;
            DialogResult = true;
        }
    }
}`;

  const UP_MAIN_TOP = String.raw`// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;

namespace P09PracFindUp
{
    public partial class MainWindow : Window
    {
        private string findText = "";
        private bool findMatchCase = false;
        private bool findUp = false;

        public MainWindow()
        {
            InitializeComponent();
            txtMemo.Text = "하나 둘 셋\n둘 셋 넷\n셋 넷 다섯\n'셋' 을 아래로, 위로 찾아 보세요.";
            txtMemo.CaretIndex = txtMemo.Text.Length;     // 커서를 맨 끝에
        }

        private void Find_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            FindWindow dlg = new FindWindow(findText, findMatchCase, findUp);
            dlg.Owner = this;
            if (dlg.ShowDialog() == true)
            {
                findText = dlg.FindText;
                findMatchCase = dlg.MatchCase;
                findUp = dlg.SearchUp;
                FindNext();
            }
        }

        private void FindNext_Click(object sender, RoutedEventArgs e) { FindNext(); }
`;

  const P6_STARTER = String.raw`${UP_MAIN_XAML}
${UP_MAIN_TOP}
        private void FindNext()
        {
            if (findText == "") return;
            StringComparison cmp = findMatchCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            string text = txtMemo.Text;
            int index;
            if (findUp)
            {
                // TODO 3: 선택 영역 "앞" 에서 거꾸로 찾기 — text.LastIndexOf(findText, 시작 위치, cmp)
                //         시작 위치 = txtMemo.SelectionStart - 1 (0 보다 작으면 못 찾은 것으로)
                index = -1;
            }
            else
            {
                int start = Math.Min(txtMemo.SelectionStart + txtMemo.SelectionLength, text.Length);
                index = text.IndexOf(findText, start, cmp);
            }
            if (index < 0)
            {
                MessageBox.Show($"'{findText}' 을(를) 더 찾을 수 없습니다.", "찾기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            txtMemo.Focus();
            txtMemo.Select(index, findText.Length);
            lblStatus.Text = $"{(findUp ? "위로" : "아래로")} 찾았습니다: {index}번째 글자";
        }
    }
}
${FIND_XAML('P09PracFindUp', true)}
${UP_FIND_CS(false)}`;

  const P6_SOLUTION = String.raw`${UP_MAIN_XAML}
${UP_MAIN_TOP}
        private void FindNext()
        {
            if (findText == "") return;
            StringComparison cmp = findMatchCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            string text = txtMemo.Text;
            int index;
            if (findUp)
            {
                int from = txtMemo.SelectionStart - 1;     // 선택 영역 바로 앞 글자부터 거꾸로
                index = from < 0 ? -1 : text.LastIndexOf(findText, from, cmp);
            }
            else
            {
                int start = Math.Min(txtMemo.SelectionStart + txtMemo.SelectionLength, text.Length);
                index = text.IndexOf(findText, start, cmp);
            }
            if (index < 0)
            {
                MessageBox.Show($"'{findText}' 을(를) 더 찾을 수 없습니다.", "찾기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            txtMemo.Focus();
            txtMemo.Select(index, findText.Length);
            lblStatus.Text = $"{(findUp ? "위로" : "아래로")} 찾았습니다: {index}번째 글자";
        }
    }
}
${FIND_XAML('P09PracFindUp', true)}
${UP_FIND_CS(true)}`;

  /* ======================= p09-3 슬라이드용 짧은 코드 ======================= */
  const SL_FONT = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09SlideFont.MainWindow" Title="서식 · 보기" Width="440" Height="260"
        ${NS}>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="서식(_O)"><MenuItem x:Name="mnuSize" Header="글꼴 크기(_S)">
                <MenuItem Header="12" Tag="12" IsCheckable="True" Click="Size_Click"/>
                <MenuItem Header="15" Tag="15" IsCheckable="True" IsChecked="True" Click="Size_Click"/>
                <MenuItem Header="24" Tag="24" IsCheckable="True" Click="Size_Click"/></MenuItem></MenuItem>
            <MenuItem Header="보기(_V)"><MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)"
                IsCheckable="True" IsChecked="True" Click="Wrap_Click"/></MenuItem>
        </Menu>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap"
                 Text="아주 긴 줄을 써 두고 자동 줄 바꿈을 껐다 켜 보세요. 글꼴 크기는 셋 중 하나만 체크됩니다."/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls;
namespace P09SlideFont
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Size_Click(object sender, RoutedEventArgs e)
        {   var picked = (MenuItem)sender; txtMemo.FontSize = Convert.ToDouble(picked.Tag);
            foreach (object o in mnuSize.Items) if (o is MenuItem m) m.IsChecked = m == picked; }
        private void Wrap_Click(object sender, RoutedEventArgs e) => txtMemo.TextWrapping = mnuWrap.IsChecked ? TextWrapping.Wrap : TextWrapping.NoWrap;
    }
}`;

  const SL_KEY = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09SlideKey.MainWindow" Title="나만의 명령 + KeyBinding" Width="440" Height="240"
        ${NS}
        xmlns:local="clr-namespace:P09SlideKey">
    <Window.CommandBindings>
        <CommandBinding Command="{x:Static local:MainWindow.Stamp}" Executed="Stamp_Executed"/>
    </Window.CommandBindings>
    <Window.InputBindings>
        <KeyBinding Key="F5" Command="{x:Static local:MainWindow.Stamp}"/>
    </Window.InputBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top"><MenuItem Header="편집(_E)">
            <MenuItem Command="{x:Static local:MainWindow.Stamp}" InputGestureText="F5"/></MenuItem></Menu>
        <TextBox x:Name="txtMemo" AcceptsReturn="True" FontSize="15" Text="글 영역을 클릭하고 F5!"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Input;
namespace P09SlideKey
{
    public partial class MainWindow : Window
    {
        public static readonly RoutedUICommand Stamp = new RoutedUICommand("시간/날짜(_D)", "Stamp", typeof(MainWindow));
        public MainWindow() { InitializeComponent(); }
        private void Stamp_Executed(object sender, ExecutedRoutedEventArgs e)
        {   int pos = txtMemo.SelectionStart; string s = DateTime.Now.ToString("HH:mm");
            txtMemo.SelectedText = s; txtMemo.CaretIndex = pos + s.Length; }
    }
}`;

  /* ======================= p09-4 완성 프로그램 ======================= */
  const EX_FINAL = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09Final.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:P09Final"
        Title="제목 없음 - 메모장" Width="560" Height="440"
        Closing="Window_Closing">
    <Window.CommandBindings>
        <CommandBinding Command="ApplicationCommands.New" Executed="New_Executed"/>
        <CommandBinding Command="ApplicationCommands.Open" Executed="Open_Executed"/>
        <CommandBinding Command="ApplicationCommands.Save" Executed="Save_Executed"/>
        <CommandBinding Command="ApplicationCommands.SaveAs" Executed="SaveAs_Executed"/>
        <CommandBinding Command="ApplicationCommands.Find" Executed="Find_Executed"/>
        <CommandBinding Command="{x:Static local:NoteCommands.FindNext}" Executed="FindNext_Executed"/>
        <CommandBinding Command="{x:Static local:NoteCommands.InsertDateTime}" Executed="InsertDateTime_Executed"/>
    </Window.CommandBindings>
    <Window.InputBindings>
        <KeyBinding Key="F5" Command="{x:Static local:NoteCommands.InsertDateTime}"/>
    </Window.InputBindings>
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="새로 만들기(_N)" Command="ApplicationCommands.New"/>
                <MenuItem Header="열기(_O)..." Command="ApplicationCommands.Open"/>
                <MenuItem Header="저장(_S)" Command="ApplicationCommands.Save"/>
                <MenuItem Header="다른 이름으로 저장(_A)..." Command="ApplicationCommands.SaveAs"
                          InputGestureText="Ctrl+Shift+S"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
            <MenuItem Header="편집(_E)">
                <MenuItem Header="찾기(_F)..." Command="ApplicationCommands.Find"/>
                <MenuItem Header="다음 찾기(_N)" Command="{x:Static local:NoteCommands.FindNext}"/>
                <Separator/>
                <MenuItem Header="시간/날짜(_D)" Command="{x:Static local:NoteCommands.InsertDateTime}"
                          InputGestureText="F5"/>
                <MenuItem Header="모두 선택(_A)" Click="SelectAll_Click"/>
            </MenuItem>
            <MenuItem Header="서식(_O)">
                <MenuItem x:Name="mnuFontSize" Header="글꼴 크기(_S)">
                    <MenuItem Header="작게 (12)" Tag="12" IsCheckable="True" Click="FontSize_Click"/>
                    <MenuItem Header="보통 (15)" Tag="15" IsCheckable="True" IsChecked="True" Click="FontSize_Click"/>
                    <MenuItem Header="크게 (18)" Tag="18" IsCheckable="True" Click="FontSize_Click"/>
                    <MenuItem Header="아주 크게 (24)" Tag="24" IsCheckable="True" Click="FontSize_Click"/>
                </MenuItem>
                <Separator/>
                <MenuItem Header="글자 크게(_I)" Click="Bigger_Click"/>
                <MenuItem Header="글자 작게(_D)" Click="Smaller_Click"/>
            </MenuItem>
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)" IsCheckable="True" IsChecked="True" Click="Wrap_Click"/>
                <MenuItem x:Name="mnuStatusBar" Header="상태 표시줄(_S)" IsCheckable="True" IsChecked="True" Click="StatusBar_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar x:Name="statusBar" DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblPos" Text="줄 1, 열 1"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblChars" Text="0자"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblSize" Text="크기 15"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" AcceptsTab="True"
                 TextWrapping="Wrap" VerticalScrollBarVisibility="Auto" BorderThickness="0"
                 TextChanged="TxtMemo_TextChanged" SelectionChanged="TxtMemo_SelectionChanged"/>
    </DockPanel>
</Window>
// ===== File: NoteCommands.cs =====
using System.Windows.Input;

namespace P09Final
{
    // 메모장만의 명령
    public static class NoteCommands
    {
        // 다음 찾기: 기본 단축키 F3 을 명령 안에 → 메뉴에 "F3" 이 저절로 표시
        public static readonly RoutedUICommand FindNext = new RoutedUICommand(
            "다음 찾기(_N)", "FindNext", typeof(NoteCommands),
            new InputGestureCollection { new KeyGesture(Key.F3) });

        // 시간/날짜: 단축키는 XAML 의 KeyBinding(F5)으로
        public static readonly RoutedUICommand InsertDateTime = new RoutedUICommand(
            "시간/날짜(_D)", "InsertDateTime", typeof(NoteCommands));
    }
}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.ComponentModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using Microsoft.Win32;

namespace P09Final
{
    public partial class MainWindow : Window
    {
        private const string TextFilter = "텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";
        private string currentPath = "";        // 지금 문서의 파일 ("" = 제목 없음)
        private bool isDirty = false;           // 저장한 뒤로 바뀌었나?
        private string findText = "";           // 마지막으로 찾은 말
        private bool findMatchCase = false;

        public MainWindow()
        {
            InitializeComponent();
            // Ctrl+Shift+S → 다른 이름으로 저장 (SaveAs 에는 기본 단축키가 없다)
            InputBindings.Add(new KeyBinding(ApplicationCommands.SaveAs, Key.S, ModifierKeys.Control | ModifierKeys.Shift));

            if (!File.Exists("예제 메모.txt"))
                File.WriteAllText("예제 메모.txt", "파일 ▸ 열기로 불러온 글입니다.\n고친 뒤 Ctrl+S 로 저장해 보세요.");

            txtMemo.Text = "WPF 메모장에 오신 것을 환영합니다!\n\n" +
                           "■ 파일: 새로 만들기 · 열기(Ctrl+O) · 저장(Ctrl+S)\n" +
                           "■ 편집: 찾기(Ctrl+F) · 다음 찾기(F3) · 시간/날짜(F5)\n" +
                           "■ 서식: 글꼴 크기 · 보기: 자동 줄 바꿈 · 상태 표시줄\n\n" +
                           "글을 고치면 제목에 * 가 붙고, 닫을 때 저장할지 묻습니다.";
            txtMemo.CaretIndex = txtMemo.Text.Length;   // 커서를 글 끝에
            isDirty = false;
            UpdateTitle();
            UpdateStatus();
        }

        // ============================ 글 영역 ============================
        private void TxtMemo_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (!isDirty) { isDirty = true; UpdateTitle(); }
            UpdateStatus();
        }

        private void TxtMemo_SelectionChanged(object sender, RoutedEventArgs e) { UpdateStatus(); }

        private void UpdateStatus()
        {
            string text = txtMemo.Text;
            int caret = Math.Min(txtMemo.CaretIndex, text.Length);
            string before = text.Substring(0, caret);
            int line = before.Split('\n').Length;
            int col = caret - (before.LastIndexOf('\n') + 1) + 1;
            lblPos.Text = $"줄 {line}, 열 {col}";
            lblChars.Text = $"{text.Length}자";
        }

        // ============================ 파일 ============================
        private void New_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;
            txtMemo.Clear();
            currentPath = "";
            SetClean("새 문서");
        }

        private void Open_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (!ConfirmSave()) return;
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "열기";
            dlg.Filter = TextFilter;
            if (dlg.ShowDialog() != true) return;
            try
            {
                txtMemo.Text = File.ReadAllText(dlg.FileName);
                currentPath = dlg.FileName;
                SetClean($"열었습니다: {Path.GetFileName(currentPath)}");
            }
            catch (Exception ex)
            {
                MessageBox.Show("파일을 열 수 없습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Save_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemo(); }
        private void SaveAs_Executed(object sender, ExecutedRoutedEventArgs e) { SaveMemoAs(); }

        private bool SaveMemo()
        {
            if (currentPath == "") return SaveMemoAs();
            return WriteFile(currentPath);
        }

        private bool SaveMemoAs()
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Title = "다른 이름으로 저장";
            dlg.Filter = TextFilter;
            dlg.DefaultExt = ".txt";
            dlg.FileName = currentPath == "" ? "제목 없음.txt" : Path.GetFileName(currentPath);
            if (dlg.ShowDialog() != true) return false;
            return WriteFile(dlg.FileName);
        }

        private bool WriteFile(string path)
        {
            try
            {
                File.WriteAllText(path, txtMemo.Text);
            }
            catch (Exception ex)
            {
                MessageBox.Show("저장하지 못했습니다.\n" + ex.Message, "메모장", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
            currentPath = path;
            SetClean($"저장했습니다: {Path.GetFileName(path)} ({txtMemo.Text.Length}자)");
            return true;
        }

        private bool ConfirmSave()
        {
            if (!isDirty) return true;
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            MessageBoxResult r = MessageBox.Show($"'{name}' 의 바뀐 내용을 저장할까요?", "메모장",
                MessageBoxButton.YesNoCancel, MessageBoxImage.Question);
            if (r == MessageBoxResult.Yes) return SaveMemo();
            if (r == MessageBoxResult.No) return true;
            return false;
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            if (!ConfirmSave()) e.Cancel = true;
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }

        private void SetClean(string message)
        {
            isDirty = false;
            UpdateTitle();
            lblStatus.Text = message;
        }

        private void UpdateTitle()
        {
            string name = currentPath == "" ? "제목 없음" : Path.GetFileName(currentPath);
            Title = (isDirty ? "*" : "") + name + " - 메모장";
        }

        // ============================ 편집 ============================
        private void Find_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            string initial = txtMemo.SelectionLength > 0 ? txtMemo.SelectedText : findText;
            FindWindow dlg = new FindWindow(initial, findMatchCase);
            dlg.Owner = this;
            if (dlg.ShowDialog() == true)
            {
                findText = dlg.FindText;
                findMatchCase = dlg.MatchCase;
                FindNext();
            }
        }

        // F3: 찾을 말이 아직 없으면 찾기 창부터
        private void FindNext_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (findText == "") Find_Executed(sender, e);
            else FindNext();
        }

        private void FindNext()
        {
            StringComparison cmp = findMatchCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            string text = txtMemo.Text;
            int start = Math.Min(txtMemo.SelectionStart + txtMemo.SelectionLength, text.Length);
            int index = text.IndexOf(findText, start, cmp);
            bool wrapped = false;
            if (index < 0 && start > 0)
            {
                index = text.IndexOf(findText, 0, cmp);
                wrapped = true;
            }
            if (index < 0)
            {
                MessageBox.Show($"'{findText}' 을(를) 찾을 수 없습니다.", "메모장", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            txtMemo.Focus();
            txtMemo.Select(index, findText.Length);
            lblStatus.Text = wrapped ? $"처음부터 다시 찾았습니다: '{findText}'" : $"찾았습니다: '{findText}'";
        }

        private void InsertDateTime_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            string stamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            int pos = txtMemo.SelectionStart;
            txtMemo.SelectedText = stamp;
            txtMemo.CaretIndex = pos + stamp.Length;
            txtMemo.Focus();
        }

        private void SelectAll_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.Focus();
            txtMemo.SelectAll();
        }

        // ============================ 서식 ============================
        private void FontSize_Click(object sender, RoutedEventArgs e)
        {
            SetFontSize(Convert.ToDouble(((MenuItem)sender).Tag));
        }

        private void Bigger_Click(object sender, RoutedEventArgs e) { SetFontSize(txtMemo.FontSize + 2); }
        private void Smaller_Click(object sender, RoutedEventArgs e) { SetFontSize(txtMemo.FontSize - 2); }

        private void SetFontSize(double size)
        {
            size = Math.Clamp(size, 8, 48);
            txtMemo.FontSize = size;
            foreach (object item in mnuFontSize.Items)
                if (item is MenuItem m)
                    m.IsChecked = Convert.ToDouble(m.Tag) == size;
            lblSize.Text = $"크기 {size}";
        }

        // ============================ 보기 ============================
        private void Wrap_Click(object sender, RoutedEventArgs e)
        {
            bool wrap = mnuWrap.IsChecked;
            txtMemo.TextWrapping = wrap ? TextWrapping.Wrap : TextWrapping.NoWrap;
            txtMemo.HorizontalScrollBarVisibility = wrap ? ScrollBarVisibility.Disabled : ScrollBarVisibility.Auto;
        }

        private void StatusBar_Click(object sender, RoutedEventArgs e)
        {
            statusBar.Visibility = mnuStatusBar.IsChecked ? Visibility.Visible : Visibility.Collapsed;
        }
    }
}
${FIND_XAML('P09Final', false)}
${FIND_CS('P09Final')}`;

  /* ======================= p09-4 확장 과제 ======================= */
  const REPLACE_WIN_XAML = String.raw`// ===== File: ReplaceWindow.xaml =====
<Window x:Class="P09ExtReplace.ReplaceWindow"
        ${NS}
        Title="바꾸기" Width="380" Height="200"
        WindowStartupLocation="CenterOwner" ResizeMode="NoResize" ShowInTaskbar="False">
    <Grid Margin="12">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <TextBlock Text="찾을 내용:" VerticalAlignment="Center" Margin="0,0,8,0"/>
        <TextBox x:Name="txtFind" Grid.Column="1" FontSize="14"/>
        <TextBlock Grid.Row="1" Text="바꿀 내용:" VerticalAlignment="Center" Margin="0,6,8,0"/>
        <TextBox x:Name="txtReplace" Grid.Row="1" Grid.Column="1" FontSize="14" Margin="0,6,0,0"/>
        <CheckBox x:Name="chkCase" Grid.Row="2" Grid.Column="1" Content="대/소문자 구분" Margin="0,8,0,0"/>
        <StackPanel Grid.Row="3" Grid.ColumnSpan="2" Orientation="Horizontal"
                    HorizontalAlignment="Right" VerticalAlignment="Bottom">
            <Button Content="모두 바꾸기" Width="90" Height="28" IsDefault="True" Click="BtnReplace_Click"/>
            <Button Content="취소" Width="70" Height="28" Margin="8,0,0,0" IsCancel="True"/>
        </StackPanel>
    </Grid>
</Window>`;

  const REPLACE_MAIN_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09ExtReplace.MainWindow"
        ${NS}
        Title="바꾸기 — 확장 과제 1" Width="520" Height="360">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="편집(_E)">
                <MenuItem Header="바꾸기(_R)..." InputGestureText="Ctrl+H" Click="Replace_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="편집 ▸ 바꾸기 로 '사과' 를 '포도' 로 바꿔 보세요"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap" BorderThickness="0"
                 Text="사과 한 개, 배 두 개, 사과 세 개.&#10;Apple 과 apple 과 APPLE."/>
    </DockPanel>
</Window>`;

  const E1_STARTER = String.raw`${REPLACE_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace P09ExtReplace
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Replace_Click(object sender, RoutedEventArgs e)
        {
            // TODO 4: ReplaceWindow 를 Owner = this 로 모달로 열고, true 일 때만 진행
            // TODO 5: CountOf 로 몇 곳인지 세고, 0 이면 "'x' 을(를) 찾을 수 없습니다." 알림
            // TODO 6: string.Replace(찾을 말, 바꿀 말, StringComparison) 으로 모두 바꾸고
            //         lblStatus 에 "n곳을 바꿨습니다." 표시
        }

        // text 안에 word 가 몇 번 나오는지 (겹치지 않게)
        private static int CountOf(string text, string word, StringComparison cmp)
        {
            // TODO 7: IndexOf(word, i, cmp) 로 찾을 때마다 count++ 하고 i 를 word.Length 만큼 앞으로
            return 0;
        }
    }
}
${REPLACE_WIN_XAML}
// ===== File: ReplaceWindow.xaml.cs =====
using System.Windows;

namespace P09ExtReplace
{
    public partial class ReplaceWindow : Window
    {
        // TODO 1: txtFind · txtReplace 의 글, chkCase 의 체크 여부를 돌려주는 속성
        public string FindText => "";
        public string ReplaceText => "";
        public bool MatchCase => false;

        public ReplaceWindow()
        {
            InitializeComponent();
            Loaded += (s, e) => txtFind.Focus();
        }

        private void BtnReplace_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 찾을 내용이 비어 있으면 알리고 끝
            // TODO 3: DialogResult = true 로 닫기
        }
    }
}`;

  const E1_SOLUTION = String.raw`${REPLACE_MAIN_XAML}
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;

namespace P09ExtReplace
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Replace_Click(object sender, RoutedEventArgs e)
        {
            ReplaceWindow dlg = new ReplaceWindow();
            dlg.Owner = this;
            if (dlg.ShowDialog() != true) return;

            StringComparison cmp = dlg.MatchCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            int count = CountOf(txtMemo.Text, dlg.FindText, cmp);
            if (count == 0)
            {
                MessageBox.Show($"'{dlg.FindText}' 을(를) 찾을 수 없습니다.", "바꾸기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            txtMemo.Text = txtMemo.Text.Replace(dlg.FindText, dlg.ReplaceText, cmp);
            lblStatus.Text = $"{count}곳을 바꿨습니다.";
        }

        // text 안에 word 가 몇 번 나오는지 (겹치지 않게)
        private static int CountOf(string text, string word, StringComparison cmp)
        {
            int count = 0;
            int i = 0;
            while ((i = text.IndexOf(word, i, cmp)) >= 0)
            {
                count++;
                i += word.Length;      // 찾은 말 뒤부터 다시
            }
            return count;
        }
    }
}
${REPLACE_WIN_XAML}
// ===== File: ReplaceWindow.xaml.cs =====
using System.Windows;

namespace P09ExtReplace
{
    public partial class ReplaceWindow : Window
    {
        public string FindText => txtFind.Text;
        public string ReplaceText => txtReplace.Text;
        public bool MatchCase => chkCase.IsChecked == true;

        public ReplaceWindow()
        {
            InitializeComponent();
            Loaded += (s, e) => txtFind.Focus();
        }

        private void BtnReplace_Click(object sender, RoutedEventArgs e)
        {
            if (txtFind.Text.Length == 0)
            {
                MessageBox.Show("찾을 내용을 입력하세요.", "바꾸기", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            DialogResult = true;
        }
    }
}`;

  const SET_XAML = String.raw`// ===== File: MainWindow.xaml =====
<Window x:Class="P09ExtSettings.MainWindow"
        ${NS}
        Title="설정 기억 — 확장 과제 2" Width="520" Height="360" Closing="Window_Closing">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="서식(_O)">
                <MenuItem Header="글자 크게(_I)" Click="Bigger_Click"/>
                <MenuItem Header="글자 작게(_D)" Click="Smaller_Click"/>
            </MenuItem>
            <MenuItem Header="보기(_V)">
                <MenuItem x:Name="mnuWrap" Header="자동 줄 바꿈(_W)" IsCheckable="True" IsChecked="True" Click="Wrap_Click"/>
            </MenuItem>
        </Menu>
        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblStatus" Text="준비"/></StatusBarItem>
        </StatusBar>
        <TextBox x:Name="txtMemo" FontSize="15" AcceptsReturn="True" TextWrapping="Wrap" BorderThickness="0"
                 Text="글자 크기와 자동 줄 바꿈을 바꾸고 창을 닫았다가 다시 실행해 보세요. 설정이 그대로 남아 있어야 합니다."/>
    </DockPanel>
</Window>`;

  const SET_TOP = String.raw`// ===== File: MainWindow.xaml.cs =====
using System;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Windows;

namespace P09ExtSettings
{
    public partial class MainWindow : Window
    {
        private const string SettingsFile = "memo-settings.txt";   // 실행 파일 옆(작업 폴더)에 만든다

        public MainWindow()
        {
            InitializeComponent();
            LoadSettings();
        }

        private void Bigger_Click(object sender, RoutedEventArgs e) { txtMemo.FontSize = Math.Min(txtMemo.FontSize + 2, 48); ShowState(); }
        private void Smaller_Click(object sender, RoutedEventArgs e) { txtMemo.FontSize = Math.Max(txtMemo.FontSize - 2, 8); ShowState(); }

        private void Wrap_Click(object sender, RoutedEventArgs e)
        {
            txtMemo.TextWrapping = mnuWrap.IsChecked ? TextWrapping.Wrap : TextWrapping.NoWrap;
            ShowState();
        }

        private void ShowState()
        {
            lblStatus.Text = $"크기 {txtMemo.FontSize} · 줄 바꿈 {(mnuWrap.IsChecked ? "켬" : "끔")}";
        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            SaveSettings();          // 닫을 때 저장
        }
`;

  const E2_STARTER = String.raw`${SET_XAML}
${SET_TOP}
        // 파일 형식 (한 줄에 하나):  FontSize=18
        //                           Wrap=False
        private void SaveSettings()
        {
            // TODO 1: 두 줄을 만들어 File.WriteAllLines(SettingsFile, …) — 실패하면 조용히 넘어가기(try/catch)
            //         숫자는 txtMemo.FontSize.ToString(CultureInfo.InvariantCulture) 로 (소수점 문제 방지)
        }

        private void LoadSettings()
        {
            // TODO 2: 파일이 없으면 ShowState() 만 하고 끝
            // TODO 3: File.ReadAllLines 로 줄마다 '=' 로 나누어 이름 · 값을 얻고
            //         FontSize → double.TryParse(값, NumberStyles.Float, CultureInfo.InvariantCulture, out double size)
            //         Wrap → bool.TryParse(값, out bool wrap) 로 mnuWrap.IsChecked 와 TextWrapping 에 반영
            // TODO 4: 잘못된 줄은 무시하고, 마지막에 ShowState() 와 lblStatus 에 "설정을 불러왔습니다" 표시
            ShowState();
        }
    }
}`;

  const E2_SOLUTION = String.raw`${SET_XAML}
${SET_TOP}
        // 파일 형식 (한 줄에 하나):  FontSize=18
        //                           Wrap=False
        private void SaveSettings()
        {
            string[] lines =
            {
                "FontSize=" + txtMemo.FontSize.ToString(CultureInfo.InvariantCulture),
                "Wrap=" + mnuWrap.IsChecked
            };
            try
            {
                File.WriteAllLines(SettingsFile, lines);
            }
            catch (Exception)
            {
                // 설정을 못 저장해도 프로그램은 닫혀야 한다 — 조용히 넘어간다
            }
        }

        private void LoadSettings()
        {
            if (!File.Exists(SettingsFile)) { ShowState(); return; }
            foreach (string line in File.ReadAllLines(SettingsFile))
            {
                string[] parts = line.Split('=');
                if (parts.Length != 2) continue;                 // 모양이 이상한 줄은 무시
                string name = parts[0].Trim();
                string value = parts[1].Trim();
                if (name == "FontSize" && double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out double size))
                    txtMemo.FontSize = Math.Clamp(size, 8, 48);
                else if (name == "Wrap" && bool.TryParse(value, out bool wrap))
                {
                    mnuWrap.IsChecked = wrap;
                    txtMemo.TextWrapping = wrap ? TextWrapping.Wrap : TextWrapping.NoWrap;
                }
            }
            ShowState();
            lblStatus.Text += "  (설정을 불러왔습니다)";
        }
    }
}`;

  /* ======================= p09-4 슬라이드용 짧은 코드 ======================= */
  const SL_COUNT = String.raw`using System;

class Program
{
    // word 가 text 안에 몇 번 나오는지 (겹치지 않게)
    static int CountOf(string text, string word, StringComparison cmp)
    {
        int count = 0, i = 0;
        while ((i = text.IndexOf(word, i, cmp)) >= 0)
        {
            count++;
            i += word.Length;
        }
        return count;
    }

    static void Main()
    {
        string memo = "Apple 과 apple 과 APPLE, 사과 사과";
        Console.WriteLine(CountOf(memo, "apple", StringComparison.Ordinal));
        Console.WriteLine(CountOf(memo, "apple", StringComparison.OrdinalIgnoreCase));
        Console.WriteLine(memo.Replace("apple", "포도", StringComparison.OrdinalIgnoreCase));
        Console.WriteLine(CountOf("aaaa", "aa", StringComparison.Ordinal));
    }
}`;

  CS_COURSE.addChapter({
    id: 'p09',
    no: 'P09',
    title: 'WPF 메모장',
    subtitle: 'Menu · Commands · File Dialogs · Dirty Flag · Find Dialog · StatusBar',
    summary: 'Windows 메모장처럼 동작하는 텍스트 편집기를 만듭니다. 파일 · 편집 · 서식 · 보기 메뉴를 명령(ApplicationCommands · CommandBinding · KeyBinding)으로 연결하고, OpenFileDialog · SaveFileDialog 와 File.ReadAllText · WriteAllText 로 새로 만들기 · 열기 · 저장 · 다른 이름으로 저장을 구현합니다. 저장하지 않은 변경은 “더티 플래그” 로 추적해 제목에 * 를 붙이고, 새로 만들기 · 열기 · 창 닫기 전에 저장할지 묻습니다. 두 번째 창으로 찾기 대화상자를 만들어 ShowDialog 와 DialogResult 로 결과를 주고받고, 상태 표시줄에 커서의 줄 · 열을 보여 줍니다.',
    goals: [
      '메모장의 기능을 요구사항과 메뉴 구조로 정리하고 DockPanel 로 메뉴 · 글 영역 · 상태 표시줄을 배치할 수 있다',
      'XAML 의 CommandBindings 와 ApplicationCommands 로 메뉴 · 단축키가 같은 명령을 쓰게 할 수 있다',
      'OpenFileDialog · SaveFileDialog 와 File 클래스로 문서를 열고 저장하며, 오류를 try/catch 로 처리할 수 있다',
      '더티 플래그로 저장하지 않은 변경을 추적하고, 새로 만들기 · 열기 · Closing 에서 저장 여부를 확인할 수 있다',
      '두 번째 창으로 찾기 대화상자를 만들어 생성자 · 속성 · DialogResult 로 데이터를 주고받을 수 있다',
      'CaretIndex 로 줄 · 열을 계산하고, 나만의 RoutedUICommand 와 KeyBinding 으로 단축키를 추가할 수 있다'
    ],
    requires: ['ch10', 'ch17', 'ch21'],
    preview: 'assets/shots/p09-final.png',
    previewCode: EX_FINAL,
    sections: [
      /* ===================== p09-1 ===================== */
      {
        id: 'p09-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '메모장의 기능을 요구사항 표와 메뉴 구조표로 정리할 수 있다',
          '더티 플래그와 “저장할까요?” 확인 흐름을 설계할 수 있다',
          'File.ReadAllText · WriteAllText 로 파일 전체를 읽고 쓸 수 있다',
          '커서 위치(CaretIndex)에서 줄 · 열을 계산하고, TextBox 의 AcceptsReturn · AcceptsTab · TextWrapping 을 설명할 수 있다'
        ],
        flow: [['도입 · 메모장 살펴보기', 5], ['요구사항 · 메뉴 설계', 10], ['더티 플래그 · 저장 확인 흐름', 10], ['준비 예제 (파일 · 줄/열 · TextBox)', 17], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: 'Windows 에 들어 있는 <b>메모장(Notepad)</b>을 WPF 로 다시 만들어 봅니다. 메모장은 단순해 보이지만 윈도우 프로그램의 기본기가 모두 들어 있습니다. 메뉴와 단축키, 파일 열기 · 저장 대화상자, “저장하지 않은 변경” 을 기억했다가 닫기 전에 묻는 기능, 찾기 대화상자, 커서 위치를 알려 주는 상태 표시줄입니다. 21장에서 만든 메모장 틀을 출발점으로, 기능을 하나씩 <b>완성도 있게</b> 채워 갑니다.' },
          { type: 'figure', html: SVG_UI, caption: '완성 화면 스케치 — 메뉴 · 글 영역 · 상태 표시줄, 그리고 두 번째 창인 찾기 대화상자' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '설명'], rows: [
            ['F1', '글 쓰기', '여러 줄(Enter) · 탭(Tab) 입력, 세로 스크롤, 자동 줄 바꿈'],
            ['F2', '새로 만들기', '글을 비우고 “제목 없음” 문서로'],
            ['F3', '열기', '파일 대화상자로 .txt 파일을 골라 내용 전체를 읽는다'],
            ['F4', '저장 · 다른 이름으로 저장', '처음 저장이면 이름을 묻고, 그다음부터는 같은 파일에 덮어쓴다'],
            ['F5', '변경 표시 · 확인', '고치면 제목에 <code>*</code>. 새로 만들기 · 열기 · 창 닫기 전에 “저장할까요?”(예/아니요/취소)'],
            ['F6', '찾기 · 다음 찾기', '찾기 대화상자(대/소문자 구분), 찾은 글을 선택해 보여 주고 끝에 닿으면 처음부터'],
            ['F7', '시간/날짜', '커서 자리에 현재 시각을 넣는다 (F5)'],
            ['F8', '서식', '글꼴 크기 고르기(하나만 ✓) · 크게 · 작게'],
            ['F9', '보기', '자동 줄 바꿈 · 상태 표시줄 켜고 끄기'],
            ['F10', '상태 표시줄', '안내 글 · <b>줄 · 열</b> · 글자 수 · 글꼴 크기']
          ], caption: '기능 요구사항' },
          { type: 'h', text: '3. 메뉴 설계 — 명령과 단축키' },
          { type: 'p', html: '메뉴 항목마다 <b>무엇으로 연결할지</b>를 먼저 정합니다. 여러 곳(메뉴 · 단축키 · 도구 모음)에서 부르는 기능은 <b>명령(Command)</b>으로, 메뉴에서만 쓰는 기능은 <code>Click</code> 으로 연결합니다. WPF 에 이미 있는 <code>ApplicationCommands</code> 는 기본 단축키까지 들어 있어 편리하고, 없는 것(다음 찾기 · 시간/날짜)은 <b>나만의 명령</b>(<code>RoutedUICommand</code>)을 만듭니다.' },
          { type: 'table', head: ['메뉴', '항목', '연결', '단축키'], rows: [
            ['파일', '새로 만들기 · 열기 · 저장', '<code>ApplicationCommands.New</code> · <code>Open</code> · <code>Save</code>', '<kbd>Ctrl</kbd>+<kbd>N</kbd> · <kbd>Ctrl</kbd>+<kbd>O</kbd> · <kbd>Ctrl</kbd>+<kbd>S</kbd> (기본)'],
            ['파일', '다른 이름으로 저장', '<code>ApplicationCommands.SaveAs</code>', '<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> (KeyBinding 추가)'],
            ['파일', '끝내기', '<code>Click</code> → <code>Close()</code>', '—'],
            ['편집', '찾기', '<code>ApplicationCommands.Find</code> → 찾기 창', '<kbd>Ctrl</kbd>+<kbd>F</kbd> (기본)'],
            ['편집', '다음 찾기 · 시간/날짜', '나만의 명령 <code>NoteCommands.FindNext</code> · <code>InsertDateTime</code>', '<kbd>F3</kbd> · <kbd>F5</kbd>'],
            ['서식', '글꼴 크기 ▸ 12/15/18/24', '<code>Click</code> + <code>Tag</code> + <code>IsCheckable</code>', '—'],
            ['보기', '자동 줄 바꿈 · 상태 표시줄', '<code>IsCheckable</code> + <code>Click</code>', '—']
          ], caption: '메뉴 구조표 — 이 표가 곧 XAML 의 Menu 와 CommandBindings 가 된다' },
          { type: 'h', text: '4. 더티 플래그와 저장 확인' },
          { type: 'p', html: '“저장한 뒤로 글이 바뀌었는가?” 를 기억하는 <code>bool</code> 변수를 <b>더티 플래그(dirty flag)</b>라고 합니다(dirty = 더러워진, 즉 저장본과 달라진). <code>TextChanged</code> 이벤트에서 <code>true</code> 로, 열기 · 저장에 <b>성공</b>하면 <code>false</code> 로 바꿉니다. 제목의 <code>*</code> 는 이 값을 그대로 보여 주는 것입니다.' },
          { type: 'p', html: '글을 <b>버리게 되는</b> 세 가지 순간 — 새로 만들기, 다른 파일 열기, 창 닫기 — 에는 먼저 물어봐야 합니다. 세 곳이 같은 질문을 하므로 <code>ConfirmSave()</code> 메서드 하나로 만들고, “계속해도 되면 <code>true</code>” 를 돌려주게 설계합니다. 예를 골랐는데 저장 대화상자에서 다시 취소하면 <code>false</code> 여야 한다는 점이 중요합니다.' },
          { type: 'figure', html: SVG_DIRTY, caption: '저장 확인 흐름 — ConfirmSave() 하나를 새로 만들기 · 열기 · Closing 이 함께 쓴다' },
          { type: 'callout', kind: 'warn', title: '코드로 Text 를 바꿔도 TextChanged 가 온다', html: '<code>txtMemo.Text = File.ReadAllText(…)</code> 처럼 <b>코드로</b> 글을 넣어도 <code>TextChanged</code> 가 발생해 더티 플래그가 <code>true</code> 가 됩니다. 방금 연 파일인데 제목에 <code>*</code> 가 붙는 흔한 버그입니다. 그래서 글을 넣은 <b>다음 줄</b>에서 <code>isDirty = false</code> 로 되돌립니다(21장 예제의 <code>SetClean</code>). 순서가 바뀌면 소용없습니다.' },
          { type: 'h', text: '5. 준비 운동 ① — 파일 읽고 쓰기와 줄 · 열 계산' },
          { type: 'p', html: '메모장은 파일을 <b>통째로</b> 읽고 씁니다. 10장에서 배운 <code>File.ReadAllText(경로)</code> 는 파일 내용 전체를 문자열 하나로, <code>File.WriteAllText(경로, 글)</code> 은 문자열 전체를 파일로 씁니다(기본 인코딩 UTF-8, 파일이 있으면 덮어씀). 상태 표시줄의 <b>줄 · 열</b>은 커서 위치(<code>CaretIndex</code> — 커서 앞에 있는 글자 수)만 있으면 계산할 수 있습니다. 커서 <b>앞</b>의 글에서 줄 바꿈(<code>\\n</code>)을 세면 줄 번호, 마지막 줄 바꿈 뒤부터 센 글자 수가 열 번호입니다.' },
          { type: 'code', title: '준비 예제 1. 파일 전체 읽고 쓰기 · 커서 위치 → 줄 · 열', code: EX_PREP_FILE, expect: '읽은 글자 수: 15, 같은 내용? True\n줄 수: 3\n커서  0 → 줄 1, 열 1\n커서  3 → 줄 1, 열 4\n커서  5 → 줄 2, 열 1\n커서 12 → 줄 2, 열 8\n커서 15 → 줄 3, 열 3', desc: '<code>GetLineColumn</code> 은 튜플 <code>(int line, int col)</code> 을 돌려주고, 받는 쪽은 <code>var (line, col) = …</code> 로 두 값을 한 번에 꺼냅니다. 커서 5 는 첫 줄의 줄 바꿈(4번 글자) <b>바로 뒤</b>이므로 2번째 줄의 1열입니다. <code>Split(\'\\n\').Length</code> 는 “줄 바꿈 개수 + 1” 이라서 빈 글에서도 1 이 나옵니다(빈 문서도 1줄). <code>Math.Clamp</code> 로 커서 값이 글 길이를 넘지 않게 막았습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — GetLineIndexFromCharacterIndex 를 쓰지 않는 이유', html: '<p>WPF <code>TextBox</code> 에는 <code>GetLineIndexFromCharacterIndex(글자 위치)</code> 라는 메서드가 있어 줄 번호를 바로 알려 줍니다. 그런데 이 메서드는 <b>화면에 보이는 줄</b>을 셉니다 — 자동 줄 바꿈으로 한 줄이 두 줄로 접혀 보이면 두 줄로 셉니다. 또 창이 아직 화면에 그려지기 전에는 <code>-1</code> 을 돌려주기도 합니다. Windows 메모장의 “줄 3, 열 11” 은 줄 바꿈 문자 기준의 <b>논리적인 줄</b>이므로, 이 프로젝트는 직접 계산합니다. 열 계산에 필요한 <code>GetCharacterIndexFromLineIndex</code> 는 브라우저 실행 창에서 지원하지 않는다는 이유도 있습니다.</p>' },
          { type: 'callout', kind: 'info', title: '실제 WPF 의 줄 바꿈은 "\\r\\n"', html: 'Visual Studio 로 실행한 WPF TextBox 에서 <kbd>Enter</kbd> 를 누르면 <code>\\r\\n</code>(두 글자)가 들어갑니다. <code>\\n</code> 을 세는 줄 계산은 그대로 맞고, 커서는 <code>\\r</code> 과 <code>\\n</code> 사이에 올 수 없으므로 열 계산도 맞습니다. 다만 글자 수(<code>Text.Length</code>)에는 줄마다 <code>\\r</code> 이 하나씩 더 들어갑니다. 브라우저 실행 창은 <code>\\n</code> 한 글자만 씁니다.' },
          { type: 'h', text: '6. 준비 운동 ② — TextBox 를 편집기로' },
          { type: 'p', html: '<code>TextBox</code> 는 기본값이 “한 줄 입력 칸” 이라서, 편집기로 쓰려면 몇 가지 속성을 켜야 합니다. <code>AcceptsReturn</code> 은 <kbd>Enter</kbd> 로 줄 바꿈, <code>AcceptsTab</code> 은 <kbd>Tab</kbd> 으로 탭 글자 넣기(끄면 Tab 이 다음 컨트롤로 포커스를 옮김), <code>TextWrapping="Wrap"</code> 은 창 너비에서 자동 줄 바꿈, <code>VerticalScrollBarVisibility="Auto"</code> 는 글이 넘치면 스크롤 막대를 보여 줍니다.' },
          { type: 'code', title: '준비 예제 2. TextBox 실험실 — 편집기에 필요한 속성', code: EX_PREP_TEXTBOX, desc: '체크 상자를 끄고 켜며 속성의 효과를 직접 확인합니다. 네 체크 상자가 처리기 <code>Option_Click</code> 하나를 함께 쓰고, 처리기는 체크 상자 네 개의 상태를 모두 읽어 <b>한꺼번에</b> 반영합니다(어느 상자를 눌렀는지 몰라도 됨). <code>IsChecked</code> 는 <code>bool?</code> 이라 <code>== true</code> 로 비교했습니다. <code>IsReadOnly</code> 를 켜면 글을 고칠 수 없지만 선택 · 복사는 됩니다 — 뷰어 모드에 씁니다. 마지막에 <code>txtMemo.Focus()</code> 로 포커스를 글 영역에 돌려줘 바로 입력해 볼 수 있게 했습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 프로젝트 준비', html: '<ul><li><b>새 프로젝트 ▸ WPF 애플리케이션</b>, 이름은 <code>MyNotepad</code> 처럼 정합니다. 예제의 네임스페이스(<code>P09Step1</code> 등)는 여러분 프로젝트 이름으로 바꾸세요 — XAML 의 <code>x:Class</code> 와 코드의 <code>namespace</code> 둘 다.</li><li>21장의 메모장 예제 프로젝트가 있다면 그것을 복사해 시작해도 좋습니다(솔루션 탐색기에서 파일 복사 후 네임스페이스 이름 바꾸기).</li><li>디자이너에서 TextBox 를 고르고 속성 창 검색 칸에 <code>Accepts</code> 를 입력하면 <b>AcceptsReturn</b> · <b>AcceptsTab</b> 이 한꺼번에 보입니다.</li></ul>' },
          { type: 'h', text: '7. 구현 계획' },
          { type: 'table', head: ['교시', '단계', '결과물'], rows: [
            ['2교시', '단계 1 화면 뼈대', '네 메뉴 · 상태 표시줄(줄 · 열 · 글자 수) · 글 영역'],
            ['2교시', '단계 2 파일 명령', 'XAML CommandBindings · 열기 · 저장 · 다른 이름으로 저장 · 오류 처리'],
            ['2교시', '단계 3 더티 플래그', '제목의 * · ConfirmSave · Closing 확인'],
            ['3교시', '단계 4 찾기 대화상자', '두 번째 창 · ShowDialog · DialogResult · 다음 찾기'],
            ['3교시', '단계 5 서식 · 보기', '글꼴 크기(하나만 ✓) · 자동 줄 바꿈 · 상태 표시줄'],
            ['3교시', '단계 6 나만의 명령', 'RoutedUICommand · KeyBinding (F3 · F5 · Ctrl+Shift+S)'],
            ['4교시', '완성 · 확장', '완성 프로그램, 바꾸기 대화상자, 설정 기억']
          ], caption: '구현 계획' }
        ],
        practice: [
          {
            title: '실습 P9-1. 글 통계 — 글자 · 단어 · 줄',
            level: 1,
            desc: '<p>상태 표시줄에 쓸 통계 메서드 세 개를 콘솔 프로그램으로 먼저 만드세요.</p><ul><li><code>CountLetters</code>: 공백(띄어쓰기 · 줄 바꿈 · 탭)을 뺀 글자 수</li><li><code>CountWords</code>: 공백으로 나눈 조각 중 <b>빈 조각을 뺀</b> 개수 (띄어쓰기가 두 번 있어도 단어는 늘지 않게)</li><li><code>CountLines</code>: 줄 수 — 빈 문서도 1줄, 마지막이 줄 바꿈이면 그 뒤의 빈 줄도 1줄</li></ul>',
            hint: '<code>text.Count(c =&gt; !char.IsWhiteSpace(c))</code>(LINQ). 단어는 <code>Split(구분자 배열, StringSplitOptions.RemoveEmptyEntries)</code>. 줄은 <code>Split(\'\\n\').Length</code>.',
            starter: P1_STARTER,
            solution: P1_SOLUTION,
            expect: '글자 수(공백 포함): 32\n글자 수(공백 제외): 20\n단어 수: 11\n줄 수: 4\n빈 문서 → 단어 0, 줄 1'
          },
          {
            title: '실습 P9-2. 줄로 이동',
            level: 2,
            desc: '<p>줄 번호를 입력하고 <b>이동</b>을 누르면 그 줄 전체를 선택해 보여 주세요(메모장의 “이동” 기능).</p><ul><li>숫자가 아니거나 1 ~ 줄 수 밖이면 <code>1부터 12 사이의 줄 번호를 입력하세요.</code> 경고.</li><li>n 번째 줄의 시작 위치 = 앞의 줄들의 (길이 + 1) 을 모두 더한 값 (+1 은 줄 바꿈 글자).</li><li>글 영역에 포커스를 준 뒤 <code>Select(시작, 줄 길이)</code> 로 선택하고, 아래에 <code>n번째 줄로 이동했습니다.</code></li></ul>',
            hint: '<code>string[] lines = txtMemo.Text.Split(\'\\n\');</code> 이면 n 번째 줄은 <code>lines[n - 1]</code>. <code>for (int i = 0; i &lt; n - 1; i++) start += lines[i].Length + 1;</code>. 선택 영역은 포커스가 있어야 눈에 보이므로 <code>Focus()</code> 를 먼저.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '파일을 연 직후 제목에 <code>*</code> 가 붙는 버그의 원인은?<pre><code>isDirty = false;\ntxtMemo.Text = File.ReadAllText(path);</code></pre>', options: ['ReadAllText 가 파일을 바꾸기 때문에', 'Text 를 넣을 때 TextChanged 가 발생해 isDirty 가 다시 true 가 되기 때문에 — 순서를 바꿔야 한다', 'isDirty 는 bool 이 아니라서', 'File 클래스는 WPF 에서 쓸 수 없어서'], answer: 1, explain: '코드로 Text 를 바꿔도 TextChanged 가 옵니다. 글을 넣은 <b>뒤에</b> isDirty = false 로 되돌려야 합니다.' },
          { q: '<code>"ab\\ncd"</code> 에서 커서가 3(글자 c 바로 앞)에 있을 때 줄 · 열은?', options: ['줄 1, 열 4', '줄 2, 열 1', '줄 2, 열 2', '줄 1, 열 3'], answer: 1, explain: '커서 앞의 글 "ab\\n" 에 줄 바꿈이 1개 → 줄 2. 마지막 줄 바꿈은 2번 글자이므로 줄 시작은 3, 열 = 3 − 3 + 1 = 1.' },
          { q: 'TextBox 에서 <kbd>Enter</kbd> 로 줄을 바꿀 수 있게 하는 속성은?', options: ['TextWrapping="Wrap"', 'AcceptsTab="True"', 'AcceptsReturn="True"', 'IsReadOnly="False"'], answer: 2, explain: 'AcceptsReturn 이 False(기본값)면 Enter 는 줄을 바꾸지 않고, 창의 기본 버튼(IsDefault)을 누르는 데 쓰입니다. TextWrapping 은 긴 줄을 화면에서 접어 보여 주는 것입니다.' },
          { q: '“새로 만들기 · 열기 · 창 닫기” 가 모두 부르는 ConfirmSave() 가 <code>false</code> 를 돌려줘야 하는 경우는?', options: ['바뀐 내용이 없을 때', '“아니요” 를 눌렀을 때', '“취소” 를 눌렀거나, “예” 를 눌렀지만 저장 대화상자에서 취소했을 때', '저장에 성공했을 때'], answer: 2, explain: 'false = “멈춰라”. 사용자가 작업을 그만두고 싶을 때(취소)와 저장하려다 실패 · 취소했을 때입니다. 아니요는 “버리고 진행” 이므로 true 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'WPF 메모장 — 메뉴 설계 · 더티 플래그 · 파일 · 줄/열', badge: 'Project 09 · 1교시',
            notes: '<p><b>[도입 3분]</b> Windows 메모장을 실제로 띄워 보여 줍니다. 글을 고치면 제목에 * 가 붙고, 닫으려 하면 저장할지 묻고, Ctrl+F 로 찾기 창이 뜨고, 아래에 줄 · 열이 보입니다.</p><p>발문: “메모장이 하는 일을 모두 적어 보자.” — 학생들이 말한 것을 칠판에 적고 요구사항 표와 비교합니다.</p>' },
          { layout: 'diagram', title: '완성 화면', html: SVG_UI, caption: '메뉴 · 글 영역 · 상태 표시줄 + 찾기 대화상자(두 번째 창)',
            notes: '<p><b>[3분]</b> 21장의 메모장 틀과 무엇이 다른지 비교: 진짜 파일, 저장 확인, 찾기 창, 줄 · 열. 레이아웃은 21장과 같은 DockPanel(Menu Top → StatusBar Bottom → TextBox 마지막).</p>' },
          { layout: 'table', title: '요구사항 (요약)', head: ['번호', '기능'], rows: [
            ['F1', '글 쓰기 — 여러 줄 · 탭 · 스크롤 · 줄 바꿈'],
            ['F2~F4', '새로 만들기 · 열기 · 저장 · 다른 이름으로'],
            ['F5', '제목 * · 저장할까요? (새로 · 열기 · 닫기)'],
            ['F6 · F7', '찾기 · 다음 찾기 · 시간/날짜'],
            ['F8~F10', '서식 · 보기 · 상태 표시줄(줄 · 열)']
          ],
            notes: '<p><b>[3분]</b> 본문의 전체 표를 함께 읽습니다. “바꾸기 · 인쇄 · 확대/축소” 처럼 빠진 기능은 확장 과제 후보로 남겨 둡니다.</p>' },
          { layout: 'table', title: '메뉴 → 명령 · 단축키', head: ['항목', '연결', '키'], rows: [
            ['새로 · 열기 · 저장', 'ApplicationCommands', 'Ctrl+N · O · S (기본)'],
            ['다른 이름으로 저장', 'SaveAs + KeyBinding', 'Ctrl+Shift+S'],
            ['찾기', 'ApplicationCommands.Find', 'Ctrl+F (기본)'],
            ['다음 찾기 · 시간/날짜', '나만의 RoutedUICommand', 'F3 · F5'],
            ['글꼴 크기 · 보기', 'Click + IsCheckable', '—']
          ],
            notes: '<p><b>[4분]</b> 기준: 여러 곳에서 부르면 명령, 메뉴에서만이면 Click. ApplicationCommands 에 기본 단축키가 “이미” 들어 있다는 것(21장)을 복습합니다.</p><p>브라우저 실행 창에서는 Ctrl+N 을 브라우저가 가져갈 수 있어 메뉴로 확인하라고 미리 알려 주세요.</p>' },
          { layout: 'diagram', title: '더티 플래그와 저장 확인', html: SVG_DIRTY, caption: 'ConfirmSave() — true = 계속, false = 멈춤',
            notes: '<p><b>[6분]</b> 세 갈래(예 · 아니요 · 취소)를 하나씩 따라갑니다. 핵심 질문: “예를 눌렀는데 저장 대화상자에서 취소하면?” → false(멈춤). 그래서 <code>return SaveMemo();</code> 처럼 저장 결과를 그대로 돌려준다.</p>' },
          { layout: 'bullets', title: '더티 플래그 규칙', bullets: ['<code>TextChanged</code> → <code>isDirty = true</code>, 제목에 <code>*</code>', '열기 · 저장 <b>성공</b> → <code>isDirty = false</code>', '코드로 Text 를 넣어도 TextChanged 가 온다!', ['→ 글을 넣은 <b>뒤에</b> false 로 되돌리기'], '새로 · 열기 · 닫기 전에 <code>ConfirmSave()</code>'],
            notes: '<p><b>[3분]</b> “방금 열었는데 * 가 붙는” 버그를 미리 예고합니다. 퀴즈 1번과 연결.</p>' },
          { layout: 'code', title: '준비 예제 1. 파일 · 줄/열 계산', code: EX_PREP_FILE, points: ['<code>File.WriteAllText</code> · <code>ReadAllText</code> — 통째로', '줄 = 커서 앞 글의 <code>\\n</code> 개수 + 1', '열 = 커서 − 줄 시작 + 1', '튜플로 두 값 돌려주기'],
            notes: '<p><b>[6분]</b> 실행 결과를 한 줄씩 손으로 확인합니다. 칠판에 “첫째 줄⏎둘째 줄입니다⏎셋째” 를 글자 칸으로 그리고 번호(0부터)를 매기면 커서 5 가 왜 줄 2, 열 1 인지 바로 보입니다.</p>' },
          { layout: 'code', title: '상태 표시줄의 줄 · 열', code: SL_CARET, points: ['<code>TextChanged</code> + <code>SelectionChanged</code> 둘 다에서', '<code>CaretIndex</code> = 커서 앞 글자 수', '<code>Math.Min</code> 으로 범위 보호'],
            notes: '<p><b>[4분]</b> 실행해서 글을 쓰며 줄 · 열이 바뀌는 것을 봅니다.</p><p>주의: 브라우저 실행 창에서는 <b>글자를 입력할 때만</b> 갱신됩니다(방향키 · 마우스로 커서만 옮기면 SelectionChanged 가 오지 않음). Visual Studio 로 실행하면 커서를 옮길 때마다 바뀝니다.</p>' },
          { layout: 'bullets', title: '준비 예제 2. TextBox 를 편집기로', bullets: ['<code>AcceptsReturn</code> — Enter = 줄 바꿈', '<code>AcceptsTab</code> — Tab = 탭 글자 (끄면 포커스 이동)', '<code>TextWrapping="Wrap"</code> — 창 너비에서 접기', '<code>VerticalScrollBarVisibility="Auto"</code>', '<code>IsReadOnly</code> — 보기 전용'],
            notes: '<p><b>[4분]</b> 본문 예제 “TextBox 실험실” 을 실행해 체크 상자를 하나씩 끄고 켭니다. AcceptsReturn 을 끄고 Enter 를 누르면 아무 일도 없는 것을 보여 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"ab\\ncd"</code> 에서 커서가 3 에 있을 때 줄 · 열은?', options: ['줄 1, 열 4', '줄 2, 열 1', '줄 2, 열 2', '줄 1, 열 3'], answer: 1, explain: '커서 앞 "ab\\n" 에 줄 바꿈 1개 → 줄 2, 줄 시작 3 → 열 1.',
            notes: '<p>칠판의 글자 칸 그림으로 확인합니다.</p>' },
          { layout: 'practice', title: '실습 P9-1 · P9-2', desc: '<p>P9-1: 글자(공백 제외) · 단어 · 줄 통계 메서드. P9-2: 줄 번호로 이동 — 그 줄 전체를 Select.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[8분]</b> P9-1 의 단어 수에서 RemoveEmptyEntries 를 빠뜨리면 띄어쓰기 두 번이 단어로 세어집니다(예제 글에 일부러 “창  추가” 로 두 칸). 빨리 끝난 학생은 P9-2.</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: ['요구사항 F1~F10 · 메뉴 구조표 (명령 vs Click)', '더티 플래그 + ConfirmSave() — 새로 · 열기 · 닫기', 'File.ReadAllText · WriteAllText — 통째로', '줄 · 열 = CaretIndex 앞 글의 <code>\\n</code> 로 계산', 'TextBox: AcceptsReturn · AcceptsTab · TextWrapping'],
            notes: '<p>다음 시간: 메뉴 · 상태 표시줄 뼈대 → 파일 명령 → 더티 플래그와 닫기 확인.</p>' }
        ]
      },
      /* ===================== p09-2 ===================== */
      {
        id: 'p09-2',
        title: '단계별 구현 ① — 파일 열기 · 저장과 변경 추적',
        minutes: 50,
        goals: [
          '파일 · 편집 · 서식 · 보기 메뉴와 상태 표시줄로 메모장의 뼈대를 만들 수 있다',
          'XAML 의 Window.CommandBindings 로 ApplicationCommands 와 처리기를 연결할 수 있다',
          'OpenFileDialog · SaveFileDialog 와 File 클래스로 열기 · 저장 · 다른 이름으로 저장을 만들고 오류를 처리할 수 있다',
          '더티 플래그 · 제목의 * · ConfirmSave · Closing 으로 저장하지 않은 변경을 지킬 수 있다'
        ],
        flow: [['도입 · 복습', 3], ['단계 1 화면 뼈대', 10], ['단계 2 파일 명령', 15], ['단계 3 더티 플래그 · 닫기 확인', 12], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '단계 1. 화면 뼈대 — 메뉴 · 상태 표시줄 · 글 영역' },
          { type: 'p', html: '1교시의 메뉴 구조표대로 네 메뉴를 만들고, 아직 기능이 없는 항목은 처리기 <code>NotYet_Click</code> 하나에 연결해 “다음 단계에서” 라고만 알려 줍니다. 이렇게 <b>뼈대부터 세우면</b> 전체 모양을 먼저 확인하고, 기능을 하나씩 채워 가며 매번 실행해 볼 수 있습니다. 상태 표시줄에는 안내 · 줄 · 열 · 글자 수 칸을 두고, 글 영역의 <code>TextChanged</code> 와 <code>SelectionChanged</code> 에서 <code>UpdateStatus()</code> 를 부릅니다.' },
          { type: 'code', title: '단계 1. 메모장 뼈대 — 네 메뉴 · 상태 표시줄(줄 · 열 · 글자 수)', code: EX_STEP1, desc: 'XAML 순서가 곧 배치입니다: <code>Menu</code>(위) → <code>StatusBar</code>(아래) → <code>TextBox</code>(나머지). 단축키 글자는 아직 <code>InputGestureText</code> 로 <b>보여 주기만</b> 합니다(21장 — 눌러도 동작하지 않음). <code>NotYet_Click</code> 은 <code>(MenuItem)sender</code> 의 <code>Header</code> 에서 밑줄 표시용 <code>_</code> 를 빼고 이름을 보여 줍니다. <code>UpdateStatus()</code> 는 1교시 준비 예제의 줄 · 열 계산을 그대로 옮긴 것입니다. <code>SelectionChanged</code> 는 커서가 움직이거나 선택 영역이 바뀔 때 옵니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창의 줄 · 열 갱신', html: '브라우저 실행 창의 TextBox 는 <b>글자를 입력할 때</b> 커서 위치를 알려 주고, 방향키나 마우스로 커서만 옮길 때는 <code>SelectionChanged</code> 가 오지 않습니다. 그래서 브라우저에서는 줄 · 열이 “다음 글자를 입력할 때” 갱신됩니다. Visual Studio 로 실행한 진짜 WPF 에서는 커서를 옮길 때마다 바로 바뀝니다. 코드는 두 환경 모두 같습니다.' },
          { type: 'h', text: '단계 2. 파일 명령 — CommandBindings 를 XAML 에' },
          { type: 'p', html: '21장에서는 생성자에서 <code>CommandBindings.Add(new CommandBinding(…))</code> 로 명령을 연결했습니다. 같은 일을 <b>XAML</b> 에서도 할 수 있습니다. <code>&lt;Window.CommandBindings&gt;</code> 안에 <code>&lt;CommandBinding Command="ApplicationCommands.Save" Executed="Save_Executed"/&gt;</code> 를 적으면, 메뉴의 어느 항목이 어떤 처리기로 가는지 XAML 한 곳에서 한눈에 보입니다. 메뉴 항목은 <code>Command="ApplicationCommands.Save"</code> 만 주면 단축키 글자가 저절로 붙습니다.' },
          { type: 'p', html: '저장에는 두 경우가 있습니다. <b>처음 저장</b>(<code>currentPath == ""</code>)이면 이름을 물어야 하므로 “다른 이름으로 저장” 과 같고, 한 번 저장한 뒤에는 묻지 않고 같은 파일에 덮어씁니다. 그래서 <code>SaveMemo()</code> 가 <code>SaveMemoAs()</code> 를 부르고, 둘 다 실제 쓰기는 <code>WriteFile()</code> 한 곳에서 합니다. 세 메서드 모두 <b>성공하면 true</b> 를 돌려주게 해 두면 다음 단계의 저장 확인에서 그대로 쓸 수 있습니다.' },
          { type: 'code', title: '단계 2. 새로 만들기 · 열기 · 저장 · 다른 이름으로 저장', code: EX_STEP2, desc: '<code>Window.CommandBindings</code> 의 네 줄이 명령과 처리기를 잇습니다. 처리기의 매개변수는 <code>ExecutedRoutedEventArgs</code>(<code>using System.Windows.Input;</code>)입니다. 파일 대화상자는 <code>ShowDialog() != true</code> 이면(취소 · ✕) 바로 돌아갑니다 — 반환형이 <code>bool?</code> 이기 때문입니다(21장). 파일 읽기 · 쓰기는 <b>실패할 수 있는 일</b>(파일이 없음, 다른 프로그램이 쓰는 중, 권한 없음)이라 10장의 <code>try/catch</code> 로 감싸 메시지 상자로 알립니다. <code>WriteFile</code> 은 쓰기에 <b>성공했을 때만</b> <code>currentPath</code> 를 바꿉니다. 제목은 <code>Path.GetFileName</code> 으로 경로에서 파일 이름만 뽑아 보여 줍니다.' },
          { type: 'table', head: ['메서드', '하는 일', '돌려주는 값'], rows: [
            ['<code>SaveMemo()</code>', '경로가 없으면 <code>SaveMemoAs()</code>, 있으면 <code>WriteFile(currentPath)</code>', '성공 true'],
            ['<code>SaveMemoAs()</code>', 'SaveFileDialog 로 이름 묻기 → <code>WriteFile(새 경로)</code>', '취소 · 실패 false'],
            ['<code>WriteFile(path)</code>', '<code>File.WriteAllText</code> (try/catch) → 성공하면 경로 · 제목 갱신', '성공 true']
          ], caption: '저장 기능의 세 메서드 — 중복 없이 한 곳에서 쓰기' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 실제 파일은 어디에?', html: '<ul><li>진짜 WPF 에서는 Windows 의 파일 열기 · 저장 대화상자가 뜹니다. 대화상자에서 고른 경로는 <code>C:\\Users\\…\\문서\\할 일.txt</code> 같은 <b>전체 경로</b>이고, 제목에는 <code>Path.GetFileName</code> 으로 이름만 보여 줍니다.</li><li>예제가 생성자에서 만드는 <code>예제 메모.txt</code> 는 상대 경로라서 실행 파일이 있는 <code>bin\\Debug\\net8.0-windows\\</code> 폴더에 생깁니다. 솔루션 탐색기에서 <b>모든 파일 표시</b>를 켜면 보입니다.</li><li><code>dlg.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);</code> 를 넣으면 대화상자가 “문서” 폴더에서 열립니다.</li></ul>' },
          { type: 'callout', kind: 'info', title: '브라우저에서는 “작업 폴더”', html: '브라우저 실행 창의 열기 · 저장 대화상자는 PC 의 디스크가 아니라 <b>브라우저 메모리 안의 작업 폴더</b>를 보여 줍니다. 예제가 만든 <code>예제 메모.txt</code> 와 여러분이 저장한 파일이 거기에 있습니다. 창을 닫았다가 다시 실행해도 같은 페이지 안에서는 남아 있지만, 페이지를 새로 고치면 사라집니다.' },
          { type: 'h', text: '단계 3. 더티 플래그 · 제목의 * · 닫기 전에 확인' },
          { type: 'p', html: '이제 “저장하지 않은 글을 잃지 않게” 지킵니다. 1교시의 설계대로 <code>isDirty</code> 를 두고, <code>TextChanged</code> 에서 <code>true</code>, 열기 · 저장 · 새로 만들기가 끝나면 <code>SetClean()</code> 으로 <code>false</code> 로 만듭니다. <code>ConfirmSave()</code> 는 새로 만들기 · 열기의 <b>맨 앞</b>과 창의 <code>Closing</code> 이벤트에서 부릅니다. <code>Closing</code> 에서 <code>e.Cancel = true</code> 로 하면 창이 닫히지 않습니다(17장). 파일 ▸ 끝내기의 <code>Close()</code> 도 <code>Closing</code> 을 거치므로 따로 확인할 필요가 없습니다.' },
          { type: 'code', title: '단계 3. 더티 플래그 · ConfirmSave · Closing', code: EX_STEP3, desc: '<code>TxtMemo_TextChanged</code> 는 <b>처음 바뀔 때만</b> 제목을 고칩니다(글자마다 제목을 다시 만들 필요 없음). 생성자에서 안내 글을 넣은 직후 <code>isDirty = false</code> 로 되돌리는 것을 잊지 마세요. <code>ConfirmSave()</code> 의 세 갈래: <b>예</b> → <code>return SaveMemo();</code>(저장 대화상자에서 취소하면 false), <b>아니요</b> → true, <b>취소 · ✕</b> → false. 질문에 파일 이름을 넣어 “무엇을” 저장할지 분명히 했습니다. 창의 ✕ · 파일 ▸ 끝내기 · <kbd>Alt</kbd>+<kbd>F4</kbd> 모두 <code>Window_Closing</code> 을 지나갑니다.' },
          { type: 'callout', kind: 'warn', title: 'Closing 에서 절대 하지 말 것', html: '<ul><li><code>Window_Closing</code> 안에서 <code>Close()</code> 를 다시 부르면 Closing 이 또 불려 끝없이 반복될 수 있습니다. 닫기를 막을 때는 <code>e.Cancel = true</code>, 닫게 둘 때는 <b>아무것도 하지 않으면</b> 됩니다.</li><li>생성자에서 MessageBox 를 띄우지 마세요. 창이 화면에 나오기 전이라 이상하게 동작할 수 있습니다. 처음에 물어볼 것이 있으면 <code>Loaded</code> 이벤트에서 합니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P9-3. 저장된 내용으로 되돌리기',
            level: 2,
            desc: '<p>파일 메뉴의 <b>저장된 내용으로 되돌리기</b>를 완성하세요. 실수로 글을 망쳤을 때 마지막 저장본으로 돌아가는 기능입니다.</p><ul><li>한 번도 저장하지 않은 문서(<code>currentPath == ""</code>)면 <code>아직 저장한 적이 없는 문서입니다.</code> 알림.</li><li>바뀐 내용이 없으면 상태 표시줄에 <code>바뀐 내용이 없습니다.</code></li><li>“마지막으로 저장한 내용으로 되돌릴까요? 지금 고친 내용은 사라집니다.”(예/아니요, 경고)에서 <b>예</b>일 때만 파일을 다시 읽고, 제목의 <code>*</code> 를 없앱니다.</li></ul>',
            hint: '되돌린 뒤에는 <code>SetClean("되돌렸습니다")</code> — Text 를 바꾸며 TextChanged 가 isDirty 를 true 로 만든 것을 다시 false 로. 파일 읽기는 try/catch 로 감싸세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 P9-4. 파일 정보 보기',
            level: 1,
            desc: '<p>파일 메뉴의 <b>파일 정보</b>를 누르면 지금 문서의 파일 정보를 메시지 상자로 보여 주세요.</p><ul><li>저장한 적이 없으면 <code>아직 저장하지 않은 문서입니다. (지금 n자)</code></li><li>파일이 있으면 이름 · 크기(바이트, 천 단위 쉼표) · 수정한 시각(<code>yyyy-MM-dd HH:mm</code>) · 저장 안 한 변경(있음/없음)을 네 줄로.</li></ul>',
            hint: '<code>FileInfo info = new FileInfo(currentPath);</code> → <code>info.Name</code> · <code>info.Length</code>(long) · <code>info.LastWriteTime</code>(DateTime). 서식 <code>{info.Length:N0}</code> 은 1,234 처럼 쉼표를 넣습니다. 크기는 <b>디스크의 파일</b> 크기라서 저장하지 않은 변경은 반영되지 않습니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: 'XAML 에서 <code>&lt;CommandBinding Command="ApplicationCommands.Save" Executed="Save_Executed"/&gt;</code> 를 쓸 때 처리기의 올바른 모양은?', options: ['<code>void Save_Executed(object sender, RoutedEventArgs e)</code>', '<code>void Save_Executed(object sender, ExecutedRoutedEventArgs e)</code>', '<code>void Save_Executed()</code>', '<code>bool Save_Executed(object sender, EventArgs e)</code>'], answer: 1, explain: 'CommandBinding.Executed 는 ExecutedRoutedEventHandler 이므로 두 번째 매개변수가 ExecutedRoutedEventArgs 입니다(System.Windows.Input).' },
          { q: '처음 저장하는 문서(<code>currentPath == ""</code>)에서 Ctrl+S 를 누르면 올바른 동작은?', options: ['"제목 없음.txt" 에 바로 저장한다', '아무것도 하지 않는다', '다른 이름으로 저장처럼 저장 대화상자로 이름을 묻는다', '열기 대화상자를 띄운다'], answer: 2, explain: '아직 파일 이름이 없으므로 이름부터 물어야 합니다. 그래서 SaveMemo() 가 SaveMemoAs() 를 부릅니다.' },
          { q: 'ConfirmSave() 에서 “예” 를 골랐을 때 <code>return true;</code> 가 아니라 <code>return SaveMemo();</code> 로 써야 하는 이유는?', options: ['코드가 짧아서', '저장 대화상자에서 취소하거나 저장에 실패하면 false 를 돌려줘 “멈춤” 이 되게 하려고', 'SaveMemo 는 항상 true 라서', 'Closing 에서는 return 을 쓸 수 없어서'], answer: 1, explain: '예 → 저장하려 했지만 이름을 묻는 창에서 취소했다면 글이 저장되지 않았습니다. 그대로 진행하면 글을 잃으므로 false 로 멈춰야 합니다.' },
          { q: '창의 ✕ 를 눌렀을 때 창이 닫히지 않게 하는 코드는?', options: ['<code>Close();</code>', '<code>e.Handled = true;</code>', '<code>e.Cancel = true;</code> (Closing 처리기에서)', '<code>DialogResult = false;</code>'], answer: 2, explain: 'Closing 이벤트의 CancelEventArgs.Cancel 을 true 로 하면 닫기가 취소됩니다. Closed 이벤트는 이미 닫힌 뒤라 취소할 수 없습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ①', subtitle: '단계 1 뼈대 → 단계 2 파일 명령 → 단계 3 더티 플래그 · 닫기 확인', badge: 'Project 09 · 2교시',
            notes: '<p><b>[복습 3분]</b> “ConfirmSave 가 false 를 돌려주는 두 경우는?” — 취소, 예 → 저장 창에서 취소. 오늘은 이 설계를 코드로 옮깁니다.</p>' },
          { layout: 'bullets', title: '단계 1. 뼈대부터', lead: '모양을 먼저 세우고 기능은 하나씩', bullets: ['네 메뉴 — 아직은 <code>NotYet_Click</code> 하나로', 'StatusBar: 안내 · 줄/열 · 글자 수', 'Menu(Top) → StatusBar(Bottom) → TextBox(마지막)', '<code>TextChanged</code> + <code>SelectionChanged</code> → <code>UpdateStatus()</code>'],
            notes: '<p><b>[5분]</b> 단계 1 예제를 실행해 메뉴를 하나씩 눌러 봅니다. “뼈대 먼저” 는 큰 프로그램을 만들 때 좋은 습관 — 언제든 실행 가능한 상태를 유지.</p>' },
          { layout: 'code', title: '단계 2. XAML 의 CommandBindings', code: SL_CMD, points: ['<code>&lt;Window.CommandBindings&gt;</code> — 명령 ↔ 처리기', '메뉴에는 <code>Command="…"</code> 만', '단축키 글자는 저절로', '처리기: <code>ExecutedRoutedEventArgs</code>'],
            notes: '<p><b>[4분]</b> 21장의 CommandBindings.Add 코드와 나란히 놓고 “같은 일” 임을 보여 줍니다. XAML 쪽이 메뉴와 가까워 읽기 쉽다는 장점.</p><p>창을 클릭한 뒤 Ctrl+S — 제목이 바뀝니다. Ctrl+N 은 브라우저가 가져갈 수 있으니 메뉴로.</p>' },
          { layout: 'two', title: '열기와 저장', left: { title: '열기', code: 'OpenFileDialog dlg = new OpenFileDialog();\ndlg.Filter = TextFilter;\nif (dlg.ShowDialog() != true) return;   // 취소\ntry\n{\n    txtMemo.Text = File.ReadAllText(dlg.FileName);\n    currentPath = dlg.FileName;\n}\ncatch (Exception ex) { /* 오류 알림 */ }', run: false }, right: { title: '저장 = 세 메서드', code: 'bool SaveMemo()\n{\n    if (currentPath == "") return SaveMemoAs();\n    return WriteFile(currentPath);\n}\n// SaveMemoAs: SaveFileDialog → WriteFile\n// WriteFile: try { WriteAllText } → 성공 true', run: false },
            notes: '<p><b>[6분]</b> 단계 2 예제를 실행: 열기로 예제 메모.txt → 고치기 → 저장 → 다른 이름으로 저장. 제목의 파일 이름이 바뀌는 것 확인.</p><p>try/catch 가 필요한 이유를 물어봅니다: 파일이 없거나, 다른 프로그램이 잠그고 있거나, 권한이 없을 때.</p>' },
          { layout: 'table', title: '저장의 세 메서드', head: ['메서드', '돌려주는 값'], rows: [
            ['SaveMemo()', '경로 없으면 SaveMemoAs, 있으면 WriteFile'],
            ['SaveMemoAs()', '대화상자 취소 → false'],
            ['WriteFile(path)', '예외 → false, 성공 → true (경로 · 제목 갱신)']
          ],
            notes: '<p><b>[2분]</b> “성공하면 true” 로 통일해 두면 ConfirmSave 가 그대로 쓸 수 있다 — 다음 단계의 복선.</p>' },
          { layout: 'bullets', title: '단계 3. 더티 플래그', bullets: ['TextChanged → <code>isDirty = true</code> (처음 한 번만 제목 갱신)', '<code>SetClean(message)</code> — false + 제목 + 상태 글', '새로 만들기 · 열기의 <b>맨 앞</b>: <code>if (!ConfirmSave()) return;</code>', '<code>Window_Closing</code>: <code>if (!ConfirmSave()) e.Cancel = true;</code>', '끝내기 = <code>Close()</code> → Closing 을 거친다'],
            notes: '<p><b>[4분]</b> 단계 3 예제 실행: 글 고치기 → 제목 * → ✕ → 저장할까요? 세 버튼을 모두 눌러 봅니다(취소 → 창 유지, 아니요 → 닫힘, 예 → 저장 대화상자).</p>' },
          { layout: 'two', title: 'ConfirmSave() — 세 갈래', left: { title: '코드', code: 'if (!isDirty) return true;\nMessageBoxResult r = MessageBox.Show(\n    "바뀐 내용을 저장할까요?", "메모장",\n    MessageBoxButton.YesNoCancel,\n    MessageBoxImage.Question);\nif (r == MessageBoxResult.Yes) return SaveMemo();\nif (r == MessageBoxResult.No) return true;\nreturn false;   // Cancel · ✕', run: false }, right: { title: '부르는 곳', bullets: ['New_Executed 맨 앞', 'Open_Executed 맨 앞', 'Window_Closing — false 면 e.Cancel = true', '(실습) 되돌리기는 별도 질문'] },
            notes: '<p><b>[4분]</b> 퀴즈 3번 미리보기: 예 → return SaveMemo() 인 이유.</p><p>Closing 안에서 Close() 를 다시 부르지 말 것, 생성자에서 MessageBox 금지(Loaded 사용) — 본문 경고 상자.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '“예” 를 골랐을 때 <code>return SaveMemo();</code> 로 쓰는 이유는?', options: ['코드가 짧아서', '저장 창에서 취소 · 실패하면 false 로 멈추려고', 'SaveMemo 는 항상 true', 'Closing 에서는 return 불가'], answer: 1, explain: '저장되지 않았는데 진행하면 글을 잃습니다.',
            notes: '<p>실제로 예 → 저장 창 취소를 눌러 창이 닫히지 않는 것을 시연하면 확실합니다.</p>' },
          { layout: 'practice', title: '실습 P9-3 · P9-4', desc: '<p>P9-3: 저장된 내용으로 되돌리기(저장 이력 · 변경 확인 · 경고 질문 · SetClean). P9-4: FileInfo 로 파일 정보 보기.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[10분]</b> P9-3 에서 되돌린 뒤 SetClean 을 빼먹으면 제목에 * 가 남습니다 — 1교시 경고의 복습. P9-4 는 빨리 끝나는 학생용.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: ['뼈대 먼저: 메뉴 · 상태 표시줄 · 글 영역', '<code>&lt;Window.CommandBindings&gt;</code> — XAML 에서 명령 연결', '저장 = SaveMemo / SaveMemoAs / WriteFile, 성공하면 true', 'try/catch 로 파일 오류 처리', '더티 플래그 + ConfirmSave + Closing(e.Cancel)'],
            notes: '<p>다음 시간: 두 번째 창으로 찾기 대화상자, 서식 · 보기 메뉴, 나만의 명령과 단축키(F3 · F5).</p>' }
        ]
      },
      /* ===================== p09-3 ===================== */
      {
        id: 'p09-3',
        title: '단계별 구현 ② — 찾기 대화상자 · 서식 · 단축키',
        minutes: 50,
        goals: [
          '두 번째 창(FindWindow)을 만들어 ShowDialog 로 띄우고 DialogResult 와 속성으로 결과를 받을 수 있다',
          'IndexOf 와 StringComparison 으로 대/소문자 구분 여부를 고르며 찾고, Select 로 찾은 글을 보여 줄 수 있다',
          '글꼴 크기 하위 메뉴(하나만 ✓) · 자동 줄 바꿈 · 상태 표시줄 켜고 끄기를 만들 수 있다',
          'RoutedUICommand 로 나만의 명령을 만들고 InputGestures · KeyBinding 으로 단축키를 연결할 수 있다'
        ],
        flow: [['도입 · 복습', 3], ['단계 4 찾기 대화상자', 17], ['단계 5 서식 · 보기', 10], ['단계 6 나만의 명령 · KeyBinding', 10], ['퀴즈 · 실습', 10]],
        content: [
          { type: 'h', text: '단계 4. 찾기 대화상자 — 두 번째 창' },
          { type: 'p', html: '찾기 기능은 <b>별도의 창</b>으로 만듭니다. Visual Studio 에서 <b>프로젝트 ▸ 창(WPF) 추가</b>로 <code>FindWindow.xaml</code> 을 만들면 XAML 과 코드 비하인드 한 쌍이 생깁니다. 21장에서 배운 대로 주 창은 <b>생성자 매개변수</b>로 처음 값(지난번에 찾은 말)을 넘기고, <code>ShowDialog()</code> 로 띄워 닫힐 때까지 기다린 뒤, <code>true</code> 가 돌아오면 찾기 창의 <b>속성</b>(<code>FindText</code> · <code>MatchCase</code>)을 읽습니다. 찾기 창은 주 창의 TextBox 를 전혀 모릅니다 — “무엇을 찾을지” 만 돌려줍니다.' },
          { type: 'figure', html: SVG_FIND, caption: '찾기 창과 주 창의 데이터 주고받기 — 생성자 → ShowDialog → DialogResult → 속성' },
          { type: 'p', html: '실제로 찾는 일은 주 창의 <code>FindNext()</code> 가 합니다. <code>string.IndexOf(찾을 말, 시작 위치, StringComparison)</code> 은 시작 위치부터 찾아 처음 나온 위치를(없으면 -1) 돌려줍니다. 시작 위치를 <b>지금 선택 영역의 끝</b>(<code>SelectionStart + SelectionLength</code>)으로 하면 누를 때마다 다음 것을 찾고, 끝까지 없으면 처음부터 한 번 더 찾습니다. 찾으면 <code>Select(위치, 길이)</code> 로 선택해 보여 줍니다. 대/소문자 구분은 <code>StringComparison.Ordinal</code>(구분) · <code>OrdinalIgnoreCase</code>(무시)로 고릅니다.' },
          { type: 'code', title: '단계 4. 찾기 대화상자 — FindWindow · ShowDialog · IndexOf · Select', code: EX_STEP4, desc: '파일이 네 개입니다: 주 창의 XAML · 코드, 찾기 창의 XAML · 코드. 찾기 창의 <code>[다음 찾기]</code> 는 <code>IsDefault="True"</code> 라 <kbd>Enter</kbd> 로 눌리고, 처리기에서 <code>DialogResult = true;</code> 를 하면 창이 닫히며 주 창의 <code>ShowDialog()</code> 가 <code>true</code> 를 돌려줍니다. <code>[취소]</code> 는 <code>IsCancel="True"</code> 라 처리기 없이도 <kbd>Esc</kbd> · 클릭으로 <code>false</code> 를 돌려주며 닫힙니다. <code>WindowStartupLocation="CenterOwner"</code> 는 <code>dlg.Owner = this;</code> 가 있어야 주 창 가운데에 뜹니다. 글을 선택해 둔 채 찾기를 열면 그 글이 찾을 말로 채워집니다(메모장과 같음). <code>Loaded</code> 에서 입력 칸에 포커스를 주고 전체 선택해 바로 새 말을 칠 수 있게 했습니다.' },
          { type: 'table', head: ['StringComparison', '뜻', '"Apple" 에서 "apple" 찾기'], rows: [
            ['<code>Ordinal</code>', '글자 코드를 그대로 비교 — 대/소문자 <b>구분</b>', '-1 (못 찾음)'],
            ['<code>OrdinalIgnoreCase</code>', '대/소문자를 <b>무시</b>하고 비교', '0'],
            ['<code>CurrentCulture</code>', '현재 문화권(ko-KR)의 규칙으로 비교', '-1 · 언어마다 결과가 다를 수 있음']
          ], caption: '찾기에는 Ordinal 계열이 빠르고 예측하기 쉽다' },
          { type: 'callout', kind: 'tip', title: '찾기 창은 모달? 모덜리스?', html: '실제 Windows 메모장의 찾기 창은 <b>모덜리스</b>(<code>Show()</code>)라 띄워 둔 채 글을 고칠 수 있습니다. 이 프로젝트는 구조를 단순하게 하려고 <b>모달</b>(<code>ShowDialog()</code>)로 만들고, 창을 닫은 뒤 <kbd>F3</kbd>(다음 찾기)로 계속 찾게 했습니다. 모덜리스로 바꾸려면 찾기 창이 “찾아 줘” <b>이벤트</b>를 내고 주 창이 그 이벤트를 받아 찾게 하면 됩니다(21장의 채팅 창 예제와 같은 방식).' },
          { type: 'h', text: '단계 5. 서식 · 보기 메뉴' },
          { type: 'p', html: '서식 ▸ 글꼴 크기 하위 메뉴는 네 항목 중 <b>하나만</b> ✓ 가 있어야 합니다. 크기 값은 각 항목의 <code>Tag</code> 에 적어 두고 처리기 하나로 처리합니다(21장). 이번에는 크기를 바꾸는 곳이 세 군데(하위 메뉴 · 크게 · 작게)이므로, ✓ 표시와 상태 표시줄까지 맞추는 <code>SetFontSize(size)</code> 메서드 <b>한 곳</b>에서 모두 처리합니다. 크게 · 작게로 13 같은 크기가 되면 네 항목 모두 ✓ 가 꺼집니다. 보기 메뉴의 두 항목은 <code>IsCheckable</code> 이라 누르면 <code>IsChecked</code> 가 먼저 뒤집힌 뒤 <code>Click</code> 이 옵니다.' },
          { type: 'code', title: '단계 5. 글꼴 크기(하나만 ✓) · 자동 줄 바꿈 · 상태 표시줄', code: EX_STEP5, desc: '<code>SetFontSize</code> 는 크기를 8 ~ 48 로 제한한 뒤, <code>mnuFontSize.Items</code> 를 돌며 <b>Tag 의 크기가 같은 항목에만</b> ✓ 를 켭니다. <code>Items</code> 에는 <code>MenuItem</code> 이 아닌 것(예: <code>Separator</code>)도 들어갈 수 있으므로 <code>item is MenuItem m</code> 으로 확인했습니다. 자동 줄 바꿈을 끄면 가로 스크롤 막대를 <code>Auto</code> 로, 켜면 <code>Disabled</code> 로 바꿉니다(줄 바꿈 중에는 가로로 넘칠 일이 없음). 상태 표시줄은 <code>Collapsed</code> 로 자리까지 없앱니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 글꼴 대화상자와 확대 · 축소', html: '<ul><li>WPF 에는 글꼴 선택 대화상자가 없습니다(WinForms 의 <code>FontDialog</code> 를 빌려 쓸 수는 있음). 보통은 실습 P9-5 처럼 메뉴 · ComboBox 로 <code>FontFamily</code> 를 고르게 합니다. 설치된 글꼴 목록은 <code>Fonts.SystemFontFamilies</code> 로 얻습니다.</li><li>Windows 메모장의 “확대/축소(Ctrl+더하기)” 는 글꼴 크기를 바꾸는 대신 화면 배율을 바꿉니다. WPF 에서는 TextBox 의 <code>LayoutTransform</code> 에 <code>ScaleTransform</code> 을 주면 비슷하게 할 수 있습니다(22장).</li></ul>' },
          { type: 'h', text: '단계 6. 나만의 명령과 KeyBinding' },
          { type: 'p', html: '“다음 찾기(F3)” · “시간/날짜(F5)” 는 <code>ApplicationCommands</code> 에 없습니다. 이럴 때는 <code>RoutedUICommand</code> 로 <b>나만의 명령</b>을 만듭니다. 명령은 보통 <code>static class</code> 의 <code>public static readonly</code> 필드로 두고, XAML 에서는 <code>{x:Static local:NoteCommands.FindNext}</code> 로 가리킵니다(<code>xmlns:local="clr-namespace:프로젝트이름"</code> 필요). 단축키를 붙이는 방법은 세 가지입니다.' },
          { type: 'table', head: ['방법', '예', '메뉴에 단축키 글자'], rows: [
            ['① 명령을 만들 때 <code>InputGestureCollection</code>', '<code>new KeyGesture(Key.D, ModifierKeys.Control)</code>', '저절로 표시'],
            ['② XAML 의 <code>&lt;Window.InputBindings&gt;</code>', '<code>&lt;KeyBinding Key="F5" Command="{x:Static …}"/&gt;</code>', '<code>InputGestureText</code> 로 직접'],
            ['③ 코드의 <code>InputBindings.Add</code>', '<code>new KeyBinding(ApplicationCommands.SaveAs, Key.S, Ctrl | Shift)</code>', '<code>InputGestureText</code> 로 직접']
          ], caption: '단축키를 연결하는 세 가지 방법' },
          { type: 'code', title: '단계 6. RoutedUICommand · InputGestures · KeyBinding', code: EX_STEP6, desc: '<code>NoteCommands</code> 에 명령 두 개를 만들었습니다. <code>DuplicateLine</code> 은 만들 때 <kbd>Ctrl</kbd>+<kbd>D</kbd> 를 넣어 두어, 메뉴 항목에 <code>Command</code> 만 주면(<code>Header</code> 도 비움) 이름 “줄 복제” 와 “Ctrl+D” 가 <b>저절로</b> 표시됩니다. <code>InsertDateTime</code> 은 단축키 없이 만들고 XAML 의 <code>KeyBinding</code> 으로 <kbd>F5</kbd> 를 연결했습니다 — 이 경우 메뉴의 글자는 <code>InputGestureText="F5"</code> 로 직접 적어야 합니다. <code>SaveAs</code> 에는 기본 단축키가 없어 생성자에서 코드로 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> 를 붙였습니다. 줄 복제는 커서가 있는 줄의 시작(앞쪽 마지막 <code>\\n</code> 다음)과 끝(뒤쪽 첫 <code>\\n</code>)을 찾아 그 사이를 복사해 끼워 넣습니다.' },
          { type: 'callout', kind: 'warn', title: 'KeyBinding 의 Command 에는 {x:Static}', html: '<code>KeyBinding.Command</code> 에는 명령 <b>개체</b>를 직접 주는 <code>{x:Static local:NoteCommands.InsertDateTime}</code> 나 <code>ApplicationCommands.Save</code> 같은 이름을 씁니다. MVVM 에서 <code>Command="{Binding SaveCommand}"</code> 처럼 바인딩을 쓰는 방법도 있지만, 브라우저 실행 창에서는 <code>KeyBinding</code> 의 바인딩을 지원하지 않습니다. 이 프로젝트처럼 라우트된 명령 + <code>CommandBinding</code> 으로 만들면 두 환경에서 모두 동작합니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창의 단축키', html: '<ul><li>단축키는 실행한 창 <b>안</b>을 한 번 클릭해 포커스를 준 뒤 눌러야 합니다.</li><li>창 안에서는 <kbd>Ctrl</kbd>+<kbd>S</kbd> · <kbd>Ctrl</kbd>+<kbd>O</kbd> · <kbd>Ctrl</kbd>+<kbd>F</kbd> · <kbd>Ctrl</kbd>+<kbd>D</kbd> · <kbd>F3</kbd> · <kbd>F5</kbd> 를 브라우저 대신 프로그램이 받습니다(F5 를 눌러도 페이지가 새로 고쳐지지 않음).</li><li><kbd>Ctrl</kbd>+<kbd>N</kbd> · <kbd>Ctrl</kbd>+<kbd>W</kbd> · <kbd>Ctrl</kbd>+<kbd>T</kbd> 는 브라우저가 먼저 가져갈 수 있으니 메뉴를 쓰세요. 메뉴의 <code>_</code> 액세스 키(<kbd>Alt</kbd>+<kbd>F</kbd>)도 브라우저에서는 동작하지 않습니다.</li></ul>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 창 추가와 xmlns:local', html: '<ul><li><b>솔루션 탐색기 ▸ 프로젝트 오른쪽 클릭 ▸ 추가 ▸ 창(WPF)</b> 에서 이름을 <code>FindWindow.xaml</code> 로 하면 XAML 과 <code>.xaml.cs</code> 가 함께 생깁니다.</li><li><code>NoteCommands</code> 는 <b>추가 ▸ 클래스</b>로 만들고 <code>public static class</code> 로 바꿉니다.</li><li>XAML 에 <code>xmlns:local="</code> 까지 입력하면 IntelliSense 가 프로젝트의 네임스페이스 목록을 보여 줍니다. 새로 만든 클래스가 <code>{x:Static local:…}</code> 에서 안 보이면 한 번 <b>빌드</b>(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)하세요.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P9-5. 서식 ▸ 글꼴 고르기',
            level: 1,
            desc: '<p>서식 ▸ 글꼴 하위 메뉴에서 <b>맑은 고딕 · 굴림체 · Consolas</b> 중 하나를 고르게 하세요.</p><ul><li>XAML 에 세 항목을 만들고(<code>Tag</code> 에 글꼴 이름: <code>Malgun Gothic</code> · <code>GulimChe</code> · <code>Consolas</code>), 모두 <code>Font_Click</code> 에 연결합니다. 처음에는 맑은 고딕에 ✓.</li><li>고르면 글 영역의 글꼴이 바뀌고, 고른 항목에만 ✓, 상태 표시줄에 <code>글꼴: 굴림체</code>.</li></ul>',
            hint: '<code>txtMemo.FontFamily = new FontFamily((string)picked.Tag);</code> (<code>using System.Windows.Media;</code>). ✓ 는 <code>foreach (object item in mnuFont.Items) if (item is MenuItem m) m.IsChecked = false;</code> 로 모두 끈 뒤 <code>picked.IsChecked = true;</code>.',
            starter: P5_STARTER,
            solution: P5_SOLUTION
          },
          {
            title: '실습 P9-6. 찾기 창에 “위로 찾기” 더하기',
            level: 3,
            desc: '<p>찾기 창에 <b>방향: 위로 / 아래로</b> 라디오 버튼이 추가되어 있습니다. 위로 찾기를 완성하세요.</p><ul><li><code>FindWindow</code> 에 <code>SearchUp</code> 속성을 만들고, 생성자에서 지난번 방향으로 라디오 버튼을 체크합니다.</li><li>주 창의 <code>FindNext()</code>: 위로면 <b>선택 영역 앞</b>에서 거꾸로 찾습니다. 더 없으면 “더 찾을 수 없습니다”.</li><li>커서가 글 끝에 있는 상태로 시작하므로, <code>셋</code> 을 위로 찾으면 아래쪽 줄부터 차례로 올라가며 찾아야 합니다.</li></ul>',
            hint: '<code>text.LastIndexOf(찾을 말, 시작 위치, cmp)</code> 는 시작 위치에서 <b>앞쪽으로</b> 찾습니다. 시작 위치는 <code>SelectionStart - 1</code> — 지금 선택된 말 바로 앞 글자부터. 0 보다 작으면 이미 맨 앞이므로 못 찾은 것(-1)으로 처리합니다.',
            starter: P6_STARTER,
            solution: P6_SOLUTION
          }
        ],
        quiz: [
          { q: '찾기 창에서 <code>DialogResult = true;</code> 를 실행하면 일어나는 일은?', options: ['아무 일도 없다 — Close() 를 따로 불러야 한다', '찾기 창이 닫히고, 주 창의 ShowDialog() 가 true 를 돌려준다', '주 창이 닫힌다', '찾기 창이 모덜리스로 바뀐다'], answer: 1, explain: 'ShowDialog() 로 연 창에서 DialogResult 를 정하면 창이 닫히고 그 값이 ShowDialog() 의 반환값이 됩니다(21장).' },
          { q: '<code>"Apple apple".IndexOf("apple", 0, StringComparison.OrdinalIgnoreCase)</code> 의 결과는?', options: ['-1', '0', '6', '1'], answer: 1, explain: '대/소문자를 무시하므로 0번 위치의 "Apple" 과 같다고 봅니다. Ordinal(구분)이었다면 6 입니다.' },
          { q: '<code>RoutedUICommand</code> 를 만들 때 <code>InputGestureCollection</code> 에 <code>KeyGesture(Key.F3)</code> 를 넣었다. <code>&lt;MenuItem Command="{x:Static local:NoteCommands.FindNext}"/&gt;</code> 에 대한 설명으로 옳은 것은?', options: ['F3 이 동작하지 않는다 — KeyBinding 이 꼭 필요하다', '메뉴 오른쪽에 “F3” 이 저절로 표시되고, CommandBinding 이 있으면 F3 도 동작한다', 'InputGestureText 를 꼭 적어야 한다', 'Header 가 없어서 컴파일 오류가 난다'], answer: 1, explain: '명령에 들어 있는 기본 제스처는 메뉴에 자동 표시되고 키도 동작합니다. Header 를 비우면 명령의 Text 가 들어갑니다.' },
          { q: '글꼴 크기 하위 메뉴에서 “하나만 ✓” 를 유지하는 가장 좋은 방법은?', options: ['항목마다 처리기를 따로 만든다', 'IsCheckable 을 모두 False 로 한다', '크기를 바꾸는 한 메서드(SetFontSize)에서 모든 항목을 돌며 Tag 가 같은 항목만 IsChecked = true', 'RadioButton 을 메뉴 안에 넣는다'], answer: 2, explain: '크기를 바꾸는 길이 여러 개(하위 메뉴 · 크게 · 작게)여도 한 메서드에서 ✓ 와 상태 표시줄을 함께 맞추면 어긋나지 않습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ②', subtitle: '단계 4 찾기 대화상자 → 단계 5 서식 · 보기 → 단계 6 나만의 명령 · KeyBinding', badge: 'Project 09 · 3교시',
            notes: '<p><b>[복습 3분]</b> “Closing 에서 닫기를 막는 코드는?” — e.Cancel = true. 오늘은 두 번째 창과 단축키.</p>' },
          { layout: 'diagram', title: '찾기 창과 주 창', html: SVG_FIND, caption: '생성자로 주고, 속성으로 받는다',
            notes: '<p><b>[4분]</b> 21장의 “창 사이 데이터 전달” 네 가지 중 ①생성자 ③DialogResult + 속성을 쓴다는 것을 확인합니다. 찾기 창이 주 창의 TextBox 를 직접 만지지 않는 이유(재사용 · 결합도).</p>' },
          { layout: 'two', title: '두 창의 코드', left: { title: 'MainWindow — 띄우고 받기', code: 'var dlg = new FindWindow(findText, findMatchCase);\ndlg.Owner = this;\nif (dlg.ShowDialog() == true)\n{\n    findText = dlg.FindText;\n    findMatchCase = dlg.MatchCase;\n    FindNext();\n}', run: false }, right: { title: 'FindWindow — 돌려주기', code: 'public string FindText => txtFind.Text;\npublic bool MatchCase => chkCase.IsChecked == true;\n\nprivate void BtnFind_Click(object s, RoutedEventArgs e)\n{\n    if (txtFind.Text.Length == 0) return;\n    DialogResult = true;   // 닫히며 true\n}\n// [취소] IsCancel="True" → false', run: false },
            notes: '<p><b>[5분]</b> 단계 4 예제를 실행: Ctrl+F → “사과” → Enter → 선택됨 → 다음 찾기 → 두 번째 사과 → 다시 → 처음부터. 대/소문자 구분을 켜고 “apple” 을 찾아 차이를 봅니다.</p>' },
          { layout: 'bullets', title: 'FindNext() — IndexOf 와 Select', bullets: ['시작 = <code>SelectionStart + SelectionLength</code> (선택 영역 뒤)', '<code>IndexOf(말, 시작, cmp)</code> — 없으면 -1', '끝까지 없으면 0 부터 한 번 더 (처음부터 다시)', '찾으면 <code>Focus()</code> → <code>Select(위치, 길이)</code>', '<code>Ordinal</code> = 구분 · <code>OrdinalIgnoreCase</code> = 무시'],
            notes: '<p><b>[4분]</b> 선택 영역 “뒤” 부터 찾아야 같은 말을 계속 다시 찾지 않는다는 점을 강조. Focus 를 빼면 선택이 눈에 안 보이는 것도 시연.</p>' },
          { layout: 'code', title: '단계 5. 서식 · 보기', code: SL_FONT, points: ['Tag 에 크기, 처리기 하나', '<code>m.IsChecked = m == picked</code> — 하나만 ✓', '보기: IsCheckable → Click 에서 읽기', '<code>Items</code> 에는 Separator 도 → <code>is MenuItem</code>'],
            notes: '<p><b>[5분]</b> 본문 단계 5 는 크게 · 작게까지 있어 SetFontSize 한 곳에서 ✓ 를 맞춥니다. 크게를 눌러 13 이 되면 ✓ 가 모두 사라지는 것 확인.</p>' },
          { layout: 'table', title: '단축키를 붙이는 세 가지', head: ['방법', '메뉴 글자'], rows: [
            ['명령 안에 InputGestureCollection', '저절로'],
            ['XAML &lt;Window.InputBindings&gt; KeyBinding', 'InputGestureText 로'],
            ['코드 InputBindings.Add(new KeyBinding(…))', 'InputGestureText 로']
          ],
            notes: '<p><b>[3분]</b> 어느 것을 쓸까? 명령의 “기본” 단축키면 ①, 이 창에서만 쓰는 추가 단축키면 ②③.</p>' },
          { layout: 'code', title: '단계 6. 나만의 명령 + KeyBinding', code: SL_KEY, points: ['<code>public static readonly RoutedUICommand</code>', '<code>{x:Static local:MainWindow.Stamp}</code>', '<code>&lt;KeyBinding Key="F5" …/&gt;</code>', '시각 넣기: <code>SelectedText</code> → 커서를 뒤로'],
            notes: '<p><b>[5분]</b> 창을 클릭한 뒤 F5 — 브라우저 실행 창에서도 새로 고침 대신 시각이 들어갑니다. 본문 단계 6 은 Ctrl+D(명령 안 제스처)와 Ctrl+Shift+S(코드 KeyBinding)까지.</p><p>KeyBinding.Command 에 {Binding} 은 브라우저에서 지원하지 않는다는 점 — 라우트된 명령으로 만든 이유.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>"Apple apple".IndexOf("apple", 0, StringComparison.OrdinalIgnoreCase)</code> 의 결과는?', options: ['-1', '0', '6', '1'], answer: 1, explain: '대/소문자를 무시하므로 0 번의 "Apple" 이 먼저 찾아집니다.',
            notes: '<p>Ordinal 이면? → 6. 두 결과를 칠판에 나란히.</p>' },
          { layout: 'practice', title: '실습 P9-5 · P9-6', desc: '<p>P9-5: 서식 ▸ 글꼴 (FontFamily, 하나만 ✓). P9-6(도전): 찾기 창에 위로/아래로 — LastIndexOf.</p>', starter: P5_STARTER, solution: P5_SOLUTION,
            notes: '<p><b>[10분]</b> P9-5 는 XAML 에 메뉴 항목을 직접 쓰는 것이 핵심. P9-6 은 LastIndexOf 의 “시작 위치에서 앞쪽으로” 를 헷갈리는 학생이 많습니다 — 칠판에 화살표로.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: ['두 번째 창: 생성자로 주고 → ShowDialog → DialogResult → 속성으로 받기', 'IndexOf + StringComparison, 선택 영역 뒤부터, 끝나면 처음부터', 'Select 전에 Focus', '하나만 ✓ = 한 메서드에서 모든 항목 맞추기', 'RoutedUICommand + InputGestures / KeyBinding'],
            notes: '<p>다음 시간: 모든 단계를 합친 완성 메모장, 그리고 바꾸기 대화상자 · 설정 기억 확장.</p>' }
        ]
      },
      /* ===================== p09-4 ===================== */
      {
        id: 'p09-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '단계 1~6 을 합친 완성 메모장을 요구사항 점검표로 테스트할 수 있다',
          '큰 코드 비하인드를 영역별로 정리하고, 명령 · 이벤트 연결을 XAML 한 곳에서 파악할 수 있다',
          '바꾸기 대화상자 · 설정 기억 같은 기능을 기존 구조에 맞춰 추가할 수 있다'
        ],
        flow: [['완성 프로그램 실행 · 구조 살펴보기', 12], ['점검표로 테스트', 8], ['확장 과제', 25], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '1. 완성 프로그램' },
          { type: 'p', html: '지금까지의 단계를 모두 합친 메모장입니다. 파일이 네 개 — 주 창(<code>MainWindow.xaml</code> · <code>.cs</code>), 명령(<code>NoteCommands.cs</code>), 찾기 창(<code>FindWindow.xaml</code> · <code>.cs</code>) — 입니다. 창이 뜨면 사용법 안내 글이 들어 있고, 커서는 글 끝에 있습니다(안내 글은 저장할 필요가 없으므로 <code>isDirty = false</code>).' },
          { type: 'code', title: '완성 프로그램. WPF 메모장', code: EX_FINAL, desc: 'XAML 맨 위의 <code>Window.CommandBindings</code> 일곱 줄과 <code>Window.InputBindings</code> 를 보면 <b>어떤 명령이 어떤 처리기로 가는지</b> 한눈에 보입니다. 코드 비하인드는 주석 줄로 글 영역 · 파일 · 편집 · 서식 · 보기 다섯 영역으로 나눴습니다. <code>FindNext_Executed</code> 는 찾을 말이 아직 없으면 찾기 창부터 엽니다(<kbd>F3</kbd> 을 먼저 눌러도 자연스럽게). 모두 선택은 <code>ApplicationCommands.SelectAll</code> 대신 <code>Click</code> 에서 <code>txtMemo.SelectAll()</code> 을 불렀는데, 메뉴를 누르는 순간 포커스가 메뉴로 가 있어도 확실히 글 영역을 선택하게 하기 위해서입니다.' },
          { type: 'table', head: ['요구사항', '확인 방법'], rows: [
            ['F2 · F5 새로 만들기', '글을 고친 뒤 새로 만들기 → 예 / 아니요 / 취소 각각'],
            ['F3 열기', '예제 메모.txt 열기 → 제목에 * 가 <b>없어야</b> 함'],
            ['F4 저장', '제목 없음 → Ctrl+S → 이름 묻기, 두 번째 Ctrl+S 는 묻지 않기'],
            ['F5 닫기 확인', '고친 뒤 ✕ → 취소 → 창 유지 / 예 → 저장 창에서 취소 → 창 유지'],
            ['F6 찾기', '대/소문자 구분 켜고 끄기, 끝까지 찾으면 처음부터, 없는 말'],
            ['F7 시간/날짜', '글 중간에서 F5 → 커서가 넣은 글 뒤로'],
            ['F8 · F9 서식 · 보기', '크게 두 번 → ✓ 가 사라지나, 줄 바꿈 끄면 가로 스크롤'],
            ['F10 상태 표시줄', '여러 줄을 쓰며 줄 · 열 · 글자 수 확인']
          ], caption: '완성 메모장 점검표' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 게시와 .txt 연결', html: '<ul><li><b>프로젝트 오른쪽 클릭 ▸ 게시 ▸ 폴더</b>로 실행 파일을 만들 수 있습니다. “단일 파일로 생성” 을 켜면 <code>.exe</code> 하나로 묶입니다.</li><li>탐색기에서 .txt 파일을 이 메모장으로 열게 하려면 명령줄 인수를 받아야 합니다. <code>App.xaml</code> 의 <code>Startup</code> 이벤트에서 <code>e.Args[0]</code>(파일 경로)을 읽어 주 창에 넘기면 됩니다 — 좋은 확장 과제입니다.</li><li>디버깅 중 저장 · 닫기 흐름을 따라가려면 <code>ConfirmSave</code> 의 첫 줄에 중단점(<kbd>F9</kbd>)을 걸고 <kbd>F10</kbd> 으로 한 줄씩 실행해 보세요.</li></ul>' },
          { type: 'h', text: '2. 확장 아이디어' },
          { type: 'table', head: ['주제', '방향'], rows: [
            ['바꾸기', '바꾸기 대화상자 + <code>string.Replace(…, StringComparison)</code> (확장 과제 1)'],
            ['설정 기억', '글꼴 크기 · 줄 바꿈을 파일에 저장했다가 다음 실행 때 복원 (확장 과제 2)'],
            ['최근 파일', '파일 ▸ 최근 파일 하위 메뉴를 코드로 만들기 — <code>new MenuItem { Header = … }</code>'],
            ['도구 모음', '21장의 <code>ToolBar</code> 에 같은 명령을 버튼으로 (명령이라 한 줄씩이면 끝)'],
            ['인코딩', '<code>File.ReadAllText(path, Encoding.GetEncoding(949))</code> — 옛 한글(ANSI) 파일 열기'],
            ['찾기 창 모덜리스', '<code>Show()</code> + “찾아 줘” 이벤트로 띄워 둔 채 찾기']
          ], caption: '더 해 볼 만한 기능' },
          { type: 'p', html: '바꾸기의 핵심은 “몇 곳이 있는지 세기” 와 “모두 바꾸기” 입니다. .NET 의 <code>string.Replace(찾을 말, 바꿀 말, StringComparison)</code> 는 대/소문자를 무시하고도 바꿀 수 있습니다. 세는 것은 <code>IndexOf</code> 를 반복하면서, 찾을 때마다 <b>찾은 말의 길이만큼</b> 앞으로 가면 됩니다.' },
          { type: 'code', title: '추가 예제. 몇 곳인지 세고 모두 바꾸기', code: SL_COUNT, expect: '1\n3\n포도 과 포도 과 포도, 사과 사과\n2', desc: '<code>while ((i = text.IndexOf(word, i, cmp)) &gt;= 0)</code> 는 “찾은 위치를 i 에 넣고, 찾았으면 반복” 입니다. 찾은 뒤 <code>i += word.Length</code> 로 건너뛰므로 <code>"aaaa"</code> 에서 <code>"aa"</code> 는 겹치지 않게 2번으로 셉니다(<code>i++</code> 로 하면 3번). <code>Replace</code> 는 원래 문자열을 바꾸지 않고 <b>새 문자열</b>을 돌려준다는 점도 기억하세요(문자열은 바꿀 수 없음, 10장).' }
        ],
        practice: [
          {
            title: '확장 과제 1. 바꾸기 대화상자',
            level: 2,
            desc: '<p>편집 ▸ 바꾸기로 <b>바꾸기 대화상자</b>(찾을 내용 · 바꿀 내용 · 대/소문자 구분)를 띄워 모두 바꾸세요.</p><ul><li><code>ReplaceWindow</code>: 세 속성(<code>FindText</code> · <code>ReplaceText</code> · <code>MatchCase</code>)을 만들고, 찾을 내용이 비어 있으면 알린 뒤 닫지 않습니다.</li><li>주 창: 몇 곳인지 세어 0 이면 “찾을 수 없습니다”, 아니면 모두 바꾸고 상태 표시줄에 <code>3곳을 바꿨습니다.</code></li><li>대/소문자 구분을 끄면 <code>Apple</code> · <code>apple</code> · <code>APPLE</code> 이 모두 바뀌어야 합니다.</li></ul>',
            hint: '찾기 대화상자와 같은 구조입니다: <code>new ReplaceWindow()</code> → <code>Owner = this</code> → <code>ShowDialog() == true</code> → 속성 읽기. 세기는 추가 예제의 <code>CountOf</code>, 바꾸기는 <code>txtMemo.Text.Replace(찾을 말, 바꿀 말, cmp)</code>.',
            starter: E1_STARTER,
            solution: E1_SOLUTION
          },
          {
            title: '확장 과제 2. 설정 기억하기',
            level: 2,
            desc: '<p>글자 크기와 자동 줄 바꿈 설정을 <b>닫을 때 파일로 저장</b>했다가, <b>다음 실행 때 복원</b>하세요.</p><ul><li>파일 <code>memo-settings.txt</code> 에 한 줄에 하나씩 <code>FontSize=18</code> · <code>Wrap=False</code> 형식으로 씁니다(창의 <code>Closing</code> 에서).</li><li>생성자에서 파일이 있으면 읽어 적용합니다. 모양이 이상한 줄이나 숫자가 아닌 값은 <b>무시</b>합니다(누가 파일을 손으로 고쳤을 수도 있음).</li><li>불러오면 상태 표시줄 끝에 <code>(설정을 불러왔습니다)</code>.</li></ul>',
            hint: '저장: <code>File.WriteAllLines(SettingsFile, new[] { "FontSize=" + …, "Wrap=" + mnuWrap.IsChecked })</code>. 읽기: <code>line.Split(\'=\')</code> 로 두 조각인지 확인, <code>double.TryParse(값, NumberStyles.Float, CultureInfo.InvariantCulture, out double size)</code>, <code>bool.TryParse</code>. 숫자를 파일에 쓸 때 <code>InvariantCulture</code> 를 쓰면 소수점이 쉼표인 나라에서도 같은 파일을 읽을 수 있습니다. 브라우저에서는 창을 닫았다가 같은 페이지에서 다시 실행하면 확인할 수 있습니다.',
            starter: E2_STARTER,
            solution: E2_SOLUTION
          }
        ],
        quiz: [
          { q: '완성 메모장에서 <code>예제 메모.txt</code> 를 연 직후 제목은?', options: ['*예제 메모.txt - 메모장', '예제 메모.txt - 메모장', '제목 없음 - 메모장', '*제목 없음 - 메모장'], answer: 1, explain: '열기에 성공하면 SetClean 으로 isDirty 를 false 로 되돌리므로 * 가 없습니다. Text 를 넣어 생긴 TextChanged 의 true 를 지우는 것이 핵심입니다.' },
          { q: '<code>CountOf("aaaa", "aa", StringComparison.Ordinal)</code> 에서 찾은 뒤 <code>i += word.Length</code> 대신 <code>i++</code> 를 쓰면 결과는?', options: ['2', '3', '4', '무한 반복'], answer: 1, explain: 'i++ 는 한 글자씩만 앞으로 가므로 0 · 1 · 2 위치의 "aa" 를 모두 세어 3 이 됩니다(겹쳐 셈). word.Length 만큼 가면 겹치지 않게 2 입니다.' },
          { q: '<code>string s = "사과"; s.Replace("사과", "포도");</code> 뒤의 s 는?', options: ['포도', '사과 — Replace 는 새 문자열을 돌려줄 뿐 s 를 바꾸지 않는다', '빈 문자열', '컴파일 오류'], answer: 1, explain: '문자열은 불변(immutable)이라 Replace 는 바뀐 새 문자열을 돌려줍니다. s = s.Replace(…) 처럼 다시 넣어야 합니다.' },
          { q: '설정 파일에 <code>FontSize=abc</code> 라는 줄이 있을 때 확장 과제 2 의 LoadSettings 가 해야 할 일은?', options: ['FormatException 으로 프로그램을 끝낸다', '그 줄을 무시하고 기본 크기를 유지한다 — double.TryParse 가 false', '글자 크기를 0 으로 만든다', '설정 파일을 지운다'], answer: 1, explain: '파일은 사용자가 손으로 고칠 수도 있으므로 믿지 않습니다. TryParse 로 실패를 조용히 걸러 냅니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: '완성 메모장 · 점검표 · 바꾸기 대화상자 · 설정 기억', badge: 'Project 09 · 4교시',
            notes: '<p><b>[도입 2분]</b> 오늘은 합치고, 테스트하고, 기능을 더합니다.</p>' },
          { layout: 'bullets', title: '완성 프로그램의 구조', bullets: ['<code>MainWindow.xaml</code> — CommandBindings 7개 · InputBindings · 네 메뉴', '<code>NoteCommands.cs</code> — FindNext(F3) · InsertDateTime', '<code>FindWindow.xaml</code> · <code>.cs</code> — 찾기 대화상자', '코드 비하인드: 글 영역 · 파일 · 편집 · 서식 · 보기'],
            notes: '<p><b>[6분]</b> 완성 예제를 실행해 전체 기능을 훑고, XAML 맨 위의 CommandBindings 를 “목차” 처럼 읽어 봅니다. 새 기능을 찾을 때 어디부터 보면 되는지 알게 하는 것이 목표.</p>' },
          { layout: 'table', title: '점검표', head: ['기능', '확인'], rows: [
            ['열기', '열자마자 * 가 없나'],
            ['저장', '두 번째 Ctrl+S 는 묻지 않나'],
            ['닫기', '예 → 저장 창 취소 → 창이 남나'],
            ['찾기', '끝까지 → 처음부터, 없는 말'],
            ['F5', '커서가 넣은 글 뒤로'],
            ['서식', '크게 두 번 → ✓ 사라짐']
          ],
            notes: '<p><b>[8분]</b> 짝 테스트: 서로의 메모장을 점검표로 확인하고 버그를 하나씩 찾아 줍니다. 가장 많이 나오는 버그: 열자마자 *, 예 → 저장 취소인데 닫힘.</p>' },
          { layout: 'code', title: '바꾸기의 핵심 — 세고 바꾸기', code: SL_COUNT, points: ['<code>while ((i = IndexOf(…)) &gt;= 0)</code>', '<code>i += word.Length</code> — 겹치지 않게', '<code>Replace(찾을, 바꿀, cmp)</code> — 대/소문자 무시 가능', 'Replace 는 <b>새</b> 문자열을 돌려준다'],
            notes: '<p><b>[5분]</b> 실행 결과 네 줄을 예측한 뒤 확인. i++ 로 바꾸면 aaaa 에서 몇 번? (3) — 퀴즈 2번.</p>' },
          { layout: 'table', title: '확장 아이디어', head: ['주제', '방향'], rows: [
            ['바꾸기', 'ReplaceWindow + Replace (과제 1)'],
            ['설정 기억', 'Closing 에서 저장, 생성자에서 복원 (과제 2)'],
            ['최근 파일', 'MenuItem 을 코드로 만들기'],
            ['도구 모음', '같은 명령을 ToolBar 버튼으로'],
            ['찾기 모덜리스', 'Show() + 이벤트']
          ],
            notes: '<p><b>[2분]</b> 과제 1 은 모두, 과제 2 는 빨리 끝난 학생. 도구 모음은 명령 덕분에 XAML 몇 줄이면 끝난다는 것을 보여 주면 명령의 장점이 확실해집니다.</p>' },
          { layout: 'two', title: '확장 과제 2 — 설정 파일', left: { title: '저장 (Closing)', code: 'string[] lines =\n{\n    "FontSize=" + txtMemo.FontSize\n        .ToString(CultureInfo.InvariantCulture),\n    "Wrap=" + mnuWrap.IsChecked\n};\nFile.WriteAllLines(SettingsFile, lines);', run: false }, right: { title: '읽기 (생성자)', code: 'foreach (string line in File.ReadAllLines(SettingsFile))\n{\n    string[] parts = line.Split(\'=\');\n    if (parts.Length != 2) continue;   // 이상한 줄 무시\n    if (parts[0] == "FontSize" &&\n        double.TryParse(parts[1], NumberStyles.Float,\n            CultureInfo.InvariantCulture, out double size))\n        txtMemo.FontSize = size;\n}', run: false },
            notes: '<p><b>[4분]</b> “이름=값” 한 줄 형식은 가장 단순한 설정 파일입니다. 더 복잡해지면 JSON(System.Text.Json)을 씁니다. 파일을 믿지 않는 습관(TryParse, 줄 모양 검사) 강조.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>s.Replace("사과", "포도");</code> 뒤의 s 는? (s = "사과")', options: ['포도', '사과 — 새 문자열을 돌려줄 뿐', '빈 문자열', '컴파일 오류'], answer: 1, explain: '문자열은 불변이라 s = s.Replace(…) 로 다시 넣어야 합니다.',
            notes: '<p>과제 1 에서 txtMemo.Text = txtMemo.Text.Replace(…) 로 “다시 넣는” 이유와 연결.</p>' },
          { layout: 'practice', title: '확장 과제 1. 바꾸기 대화상자', desc: '<p>ReplaceWindow(찾을 · 바꿀 · 대/소문자) → ShowDialog → CountOf 로 세기 → Replace → “n곳을 바꿨습니다.”</p>', starter: E1_STARTER, solution: E1_SOLUTION,
            notes: '<p><b>[20분]</b> 찾기 대화상자를 거의 그대로 따라 하면 됩니다. 대/소문자 구분 끄고 apple 을 포도로 → 세 곳이 바뀌는지 확인.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['메뉴 = 명령(ApplicationCommands · 나만의 명령) + Click', 'XAML CommandBindings · InputBindings = 연결의 목차', '파일: 대화상자 + File.ReadAllText/WriteAllText + try/catch', '더티 플래그 + ConfirmSave + Closing', '두 번째 창: 생성자 → ShowDialog → DialogResult → 속성', '줄 · 열: CaretIndex 앞 글의 <code>\\n</code>'],
            notes: '<p>다음 프로젝트(P10 벽돌 깨기)에서는 22장의 그래픽 · 타이머로 움직이는 게임을 만듭니다.</p>' }
        ]
      }
    ]
  });
})();
