/* Chapter 20. MVVM 패턴 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ---------- 공통 파일: ViewModelBase · RelayCommand ---------- */
  const VMBASE = (ns, file) => `// ===== File: ${file || 'ViewModelBase.cs'} =====
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ${ns}
{
    // 모든 ViewModel 이 물려받는 공통 부모: 속성 변경 알림 코드를 한곳에 모았다
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        // 이름을 적지 않으면 [CallerMemberName] 이 호출한 속성의 이름을 넣어 준다
        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // 값이 다를 때만 필드에 저장하고 알린다. 실제로 바뀌었으면 true 를 돌려준다
        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value)) return false;
            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
}`;

  const RELAY = (ns, file) => `// ===== File: ${file || 'RelayCommand.cs'} =====
using System;
using System.Windows.Input;

namespace ${ns}
{
    // 실행할 일(execute)과 실행 가능 여부(canExecute)를 대리자로 받아 두는 범용 명령
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> execute;
        private readonly Func<object?, bool>? canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            this.execute = execute;
            this.canExecute = canExecute;
        }

        // 버튼이 "지금 눌러도 돼?" 하고 물을 때 (false 면 버튼이 비활성)
        public bool CanExecute(object? parameter)
        {
            return canExecute == null || canExecute(parameter);
        }

        // 버튼을 눌렀을 때 (parameter = 버튼의 CommandParameter)
        public void Execute(object? parameter)
        {
            execute(parameter);
        }

        // "다시 물어봐" 신호: WPF 의 CommandManager 가 입력이 있을 때마다 보내는 신호에 연결한다
        public event EventHandler? CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}`;

  /* ---------- 그림 1. MVVM 의 세 역할 ---------- */
  const SVG_MVVM = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="View 는 바인딩과 명령으로 ViewModel 을 사용하고, ViewModel 은 Model 을 사용한다. 반대 방향은 알림으로만 전달된다">
  <defs>
    <marker id="ah20a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah20b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker>
  </defs>
  <g>
    <rect x="30" y="70" width="300" height="290" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="180" y="115" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent2)">View (뷰)</text>
    <text x="180" y="160" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">MainWindow.xaml</text>
    <text x="180" y="205" text-anchor="middle" style="font-size:20px;fill:var(--fg)">화면 · 컨트롤 배치</text>
    <text x="180" y="240" text-anchor="middle" style="font-size:20px;fill:var(--fg)">{Binding …} 로 연결</text>
    <text x="180" y="290" text-anchor="middle" style="font-size:18px;fill:var(--muted)">코드 비하인드는</text>
    <text x="180" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">거의 비어 있다</text>
  </g>
  <g>
    <rect x="490" y="70" width="300" height="290" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="640" y="115" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--accent)">ViewModel</text>
    <text x="640" y="160" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">MainViewModel.cs</text>
    <text x="640" y="205" text-anchor="middle" style="font-size:20px;fill:var(--fg)">화면에 보일 속성</text>
    <text x="640" y="240" text-anchor="middle" style="font-size:20px;fill:var(--fg)">명령 (ICommand)</text>
    <text x="640" y="275" text-anchor="middle" style="font-size:20px;fill:var(--fg)">입력 검사 · 계산</text>
    <text x="640" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">컨트롤을 모른다</text>
  </g>
  <g>
    <rect x="950" y="70" width="300" height="290" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1100" y="115" text-anchor="middle" style="font-size:27px;font-weight:700;fill:var(--ok)">Model (모델)</text>
    <text x="1100" y="160" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">TodoItem.cs</text>
    <text x="1100" y="205" text-anchor="middle" style="font-size:20px;fill:var(--fg)">데이터와 규칙</text>
    <text x="1100" y="240" text-anchor="middle" style="font-size:20px;fill:var(--fg)">파일 · DB 저장</text>
    <text x="1100" y="318" text-anchor="middle" style="font-size:18px;fill:var(--muted)">화면이 있는지도 모른다</text>
  </g>
  <g stroke-width="4">
    <line x1="334" y1="160" x2="484" y2="160" stroke="var(--accent)" marker-end="url(#ah20a)"/>
    <line x1="334" y1="230" x2="484" y2="230" stroke="var(--accent)" marker-end="url(#ah20a)"/>
    <line x1="486" y1="300" x2="336" y2="300" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah20b)"/>
    <line x1="794" y1="180" x2="944" y2="180" stroke="var(--accent)" marker-end="url(#ah20a)"/>
    <line x1="946" y1="270" x2="796" y2="270" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah20b)"/>
  </g>
  <text x="410" y="148" text-anchor="middle" style="font-size:19px;fill:var(--accent)">① 바인딩</text>
  <text x="410" y="218" text-anchor="middle" style="font-size:19px;fill:var(--accent)">② 명령</text>
  <text x="410" y="288" text-anchor="middle" style="font-size:19px;fill:var(--warn)">③ 알림</text>
  <text x="870" y="168" text-anchor="middle" style="font-size:19px;fill:var(--accent)">④ 사용</text>
  <text x="870" y="258" text-anchor="middle" style="font-size:19px;fill:var(--warn)">알림(선택)</text>
  <text x="640" y="415" text-anchor="middle" style="font-size:21px;fill:var(--fg)">① 속성을 읽고 쓰기 ({Binding})   ② 버튼이 일을 시키기 (Command)   ③ PropertyChanged 로 “바뀌었어요”</text>
  <text x="640" y="460" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--fg)">실선 화살표 = “안다(사용한다)” — View → ViewModel → Model 한 방향</text>
  <text x="640" y="505" text-anchor="middle" style="font-size:20px;fill:var(--muted)">ViewModel 은 View 를, Model 은 ViewModel 을 모른다 → 따로 고치고 따로 테스트할 수 있다</text>
</svg>`;

  /* ---------- 그림 2. ICommand 흐름 ---------- */
  const SVG_CMD = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="버튼은 명령의 Execute 와 CanExecute 를 부르고, RelayCommand 는 ViewModel 의 메서드를 대신 부른다. CommandManager 의 신호로 CanExecute 를 다시 묻는다">
  <defs>
    <marker id="ah20c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah20d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker>
  </defs>
  <g>
    <rect x="30" y="60" width="330" height="230" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="195" y="102" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent2)">Button (View)</text>
    <text x="55" y="150" style="${MONO};font-size:18px;fill:var(--fg)">Command=</text>
    <text x="55" y="178" style="${MONO};font-size:18px;fill:var(--fg)">  "{Binding AddCommand}"</text>
    <text x="55" y="218" style="${MONO};font-size:18px;fill:var(--fg)">CommandParameter="…"</text>
    <text x="195" y="265" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Click 처리기 없음</text>
  </g>
  <g>
    <rect x="475" y="60" width="330" height="230" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="640" y="102" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--accent)">RelayCommand</text>
    <text x="640" y="130" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">: ICommand</text>
    <text x="500" y="175" style="${MONO};font-size:19px;fill:var(--fg)">Execute(p)</text>
    <text x="500" y="215" style="${MONO};font-size:19px;fill:var(--fg)">CanExecute(p)</text>
    <text x="500" y="255" style="${MONO};font-size:19px;fill:var(--fg)">CanExecuteChanged</text>
  </g>
  <g>
    <rect x="920" y="60" width="330" height="230" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
    <text x="1085" y="102" text-anchor="middle" style="font-size:25px;font-weight:700;fill:var(--ok)">MainViewModel</text>
    <text x="945" y="175" style="${MONO};font-size:19px;fill:var(--fg)">AddTodo()</text>
    <text x="945" y="215" style="${MONO};font-size:19px;fill:var(--fg)">CanAddTodo()</text>
    <text x="1085" y="262" text-anchor="middle" style="font-size:18px;fill:var(--muted)">실제 할 일 · 조건</text>
  </g>
  <g>
    <rect x="475" y="380" width="330" height="100" rx="14" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="640" y="420" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--warn)">CommandManager</text>
    <text x="640" y="455" text-anchor="middle" style="font-size:18px;fill:var(--fg)">입력 · 클릭이 끝날 때마다 신호</text>
  </g>
  <g stroke-width="4">
    <line x1="364" y1="170" x2="469" y2="170" stroke="var(--accent)" marker-end="url(#ah20c)"/>
    <line x1="364" y1="210" x2="469" y2="210" stroke="var(--accent)" stroke-dasharray="10 7" marker-end="url(#ah20c)"/>
    <line x1="809" y1="170" x2="914" y2="170" stroke="var(--accent)" marker-end="url(#ah20c)"/>
    <line x1="809" y1="210" x2="914" y2="210" stroke="var(--accent)" stroke-dasharray="10 7" marker-end="url(#ah20c)"/>
    <line x1="640" y1="376" x2="640" y2="296" stroke="var(--warn)" marker-end="url(#ah20d)"/>
    <path d="M470,255 C400,255 400,330 300,330 L195,330 L195,296" fill="none" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ah20d)"/>
  </g>
  <text x="416" y="158" text-anchor="middle" style="font-size:17px;fill:var(--accent)">① 클릭</text>
  <text x="416" y="240" text-anchor="middle" style="font-size:17px;fill:var(--accent)">② 물어봄</text>
  <text x="861" y="158" text-anchor="middle" style="font-size:17px;fill:var(--accent)">대신 호출</text>
  <text x="660" y="340" style="font-size:18px;fill:var(--warn)">③ RequerySuggested</text>
  <text x="195" y="360" text-anchor="middle" style="font-size:18px;fill:var(--warn)">④ 다시 ② 를 물어봄</text>
  <text x="640" y="525" text-anchor="middle" style="font-size:21px;fill:var(--fg)">CanExecute 가 false → 버튼이 저절로 비활성(회색) · true → 다시 활성. IsEnabled 를 고치는 코드는 없다</text>
</svg>`;

  /* ---------- 그림 3. 할 일 앱: View 와 ViewModel 의 연결 ---------- */
  const SVG_TODO = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="할 일 앱 화면의 각 컨트롤이 MainViewModel 의 어떤 속성과 명령에 연결되는지 보여 준다">
  <defs>
    <marker id="ah20e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ah20f" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M12,0 L0,6 L12,12 z" fill="var(--accent)"/></marker>
  </defs>
  <g>
    <rect x="30" y="40" width="530" height="440" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
    <text x="50" y="70" style="font-size:20px;font-weight:700;fill:var(--accent2)">View — MainWindow.xaml</text>
    <rect x="50" y="85" width="370" height="44" rx="6" fill="none" stroke="var(--line)" stroke-width="2"/>
    <text x="65" y="115" style="font-size:19px;fill:var(--fg)">우유 사기|</text>
    <rect x="432" y="85" width="108" height="44" rx="6" fill="none" stroke="var(--accent2)" stroke-width="2"/>
    <text x="486" y="115" text-anchor="middle" style="font-size:19px;fill:var(--fg)">추가</text>
    <rect x="50" y="145" width="490" height="190" rx="6" fill="none" stroke="var(--line)" stroke-width="2"/>
    <rect x="68" y="163" width="20" height="20" fill="var(--ok)" stroke="var(--ok)"/>
    <text x="100" y="181" style="font-size:19px;fill:var(--muted)">MVVM 개념 정리하기</text>
    <rect x="56" y="205" width="478" height="40" fill="var(--accent)" fill-opacity="0.16"/>
    <rect x="68" y="213" width="20" height="20" fill="none" stroke="var(--fg)" stroke-width="2"/>
    <text x="100" y="231" style="font-size:19px;fill:var(--fg)">RelayCommand 만들어 보기</text>
    <rect x="68" y="263" width="20" height="20" fill="none" stroke="var(--fg)" stroke-width="2"/>
    <text x="100" y="281" style="font-size:19px;fill:var(--fg)">할 일 앱 완성하기</text>
    <text x="50" y="395" style="font-size:18px;fill:var(--accent2)">남은 일 2개 / 전체 3개</text>
    <rect x="270" y="420" width="70" height="36" rx="6" fill="none" stroke="var(--accent2)" stroke-width="2"/>
    <text x="305" y="444" text-anchor="middle" style="font-size:16px;fill:var(--fg)">삭제</text>
    <rect x="350" y="420" width="90" height="36" rx="6" fill="none" stroke="var(--accent2)" stroke-width="2"/>
    <text x="395" y="444" text-anchor="middle" style="font-size:16px;fill:var(--fg)">완료 지우기</text>
    <rect x="450" y="420" width="90" height="36" rx="6" fill="none" stroke="var(--accent2)" stroke-width="2"/>
    <text x="495" y="444" text-anchor="middle" style="font-size:16px;fill:var(--fg)">모두 지우기</text>
  </g>
  <g>
    <rect x="730" y="40" width="520" height="440" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
    <text x="750" y="70" style="font-size:20px;font-weight:700;fill:var(--accent)">MainViewModel</text>
    <text x="750" y="112" style="${MONO};font-size:19px;fill:var(--fg)">NewTitle          (string)</text>
    <text x="750" y="152" style="${MONO};font-size:19px;fill:var(--fg)">AddCommand        (ICommand)</text>
    <text x="750" y="200" style="${MONO};font-size:19px;fill:var(--fg)">Todos   (ObservableCollection)</text>
    <text x="750" y="240" style="${MONO};font-size:19px;fill:var(--fg)">SelectedTodo      (TodoItem)</text>
    <text x="750" y="280" style="${MONO};font-size:19px;fill:var(--ok)">  └ TodoItem.IsDone (bool)</text>
    <text x="750" y="395" style="${MONO};font-size:19px;fill:var(--fg)">Summary · RemainingCount</text>
    <text x="750" y="443" style="${MONO};font-size:17px;fill:var(--fg)">Delete · ClearCompleted · ClearAll</text>
  </g>
  <g stroke="var(--accent)" stroke-width="3">
    <line x1="566" y1="106" x2="724" y2="106" marker-start="url(#ah20f)" marker-end="url(#ah20e)"/>
    <line x1="546" y1="118" x2="724" y2="146" stroke-dasharray="8 6" marker-end="url(#ah20e)"/>
    <line x1="724" y1="195" x2="566" y2="195" marker-end="url(#ah20e)"/>
    <line x1="566" y1="228" x2="724" y2="234" marker-start="url(#ah20f)" marker-end="url(#ah20e)"/>
    <line x1="566" y1="275" x2="724" y2="275" stroke="var(--ok)" marker-start="url(#ah20f)" marker-end="url(#ah20e)"/>
    <line x1="724" y1="390" x2="566" y2="390" marker-end="url(#ah20e)"/>
    <line x1="546" y1="438" x2="724" y2="438" stroke-dasharray="8 6" marker-end="url(#ah20e)"/>
  </g>
  <text x="640" y="520" text-anchor="middle" style="font-size:20px;fill:var(--muted)">실선 = 속성 바인딩 · 점선 = 명령(Command) — 창에는 Click 처리기가 하나도 없다</text>
</svg>`;

  /* ======================= 20-1 예제 코드 ======================= */
  const EX_BEFORE = `// ===== File: MainWindow.xaml =====
<Window x:Class="BmiCodeBehind.MainWindow"
        ${NS}
        Title="BMI 계산기 — 코드 비하인드 방식" Width="380" Height="330">
    <StackPanel Margin="20">
        <TextBlock Text="키 (cm)"/>
        <TextBox x:Name="txtHeight" Text="170" FontSize="16" Margin="0,2,0,8"/>
        <TextBlock Text="몸무게 (kg)"/>
        <TextBox x:Name="txtWeight" Text="65" FontSize="16" Margin="0,2,0,12"/>
        <Button Content="계산" Height="32" Click="BtnCalc_Click"/>
        <TextBlock x:Name="txtBmi" FontSize="26" FontWeight="Bold" Margin="0,14,0,0"/>
        <TextBlock x:Name="txtCategory" FontSize="16"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Media;

namespace BmiCodeBehind
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            ShowBmi();
        }

        private void BtnCalc_Click(object sender, RoutedEventArgs e)
        {
            ShowBmi();
        }

        // 화면 읽기 + 검사 + 계산 + 판정 + 화면 쓰기가 한 메서드에 뒤엉켜 있다
        private void ShowBmi()
        {
            // ① 화면에서 읽기 — 컨트롤 이름(txtHeight …)을 알아야 한다
            if (!double.TryParse(txtHeight.Text, out double heightCm) ||
                !double.TryParse(txtWeight.Text, out double weightKg) ||
                heightCm <= 0 || weightKg <= 0)
            {
                txtBmi.Text = "BMI -";
                txtCategory.Text = "키와 몸무게를 숫자로 입력하세요";
                txtCategory.Foreground = Brushes.Crimson;
                return;
            }

            // ② 계산 — 프로그램의 핵심 규칙인데 화면 코드 사이에 묻혀 있다
            double heightM = heightCm / 100;
            double bmi = weightKg / (heightM * heightM);

            // ③ 판정
            string category;
            if (bmi < 18.5) category = "저체중";
            else if (bmi < 23) category = "정상";
            else if (bmi < 25) category = "과체중";
            else category = "비만";

            // ④ 화면에 쓰기
            txtBmi.Text = $"BMI {bmi:F1}";
            txtCategory.Text = category;
            txtCategory.Foreground = Brushes.SteelBlue;
        }
    }
}`;

  const EX_COUNTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="CounterMvvm.MainWindow"
        ${NS}
        Title="첫 MVVM — 카운터" Width="360" Height="260">
    <StackPanel Margin="20">
        <!-- 화면은 ViewModel 의 속성 이름만 안다 -->
        <TextBlock Text="{Binding Count}" FontSize="48" FontWeight="Bold" HorizontalAlignment="Center"/>
        <TextBlock Text="{Binding Message}" FontSize="16" Foreground="SteelBlue" HorizontalAlignment="Center"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,16,0,0">
            <Button Content="− 1" Width="80" Height="32" Click="BtnDown_Click"/>
            <Button Content="+ 1" Width="80" Height="32" Margin="10,0" Click="BtnUp_Click"/>
            <Button Content="0 으로" Width="80" Height="32" Click="BtnReset_Click"/>
        </StackPanel>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace CounterMvvm
{
    public partial class MainWindow : Window
    {
        private readonly CounterViewModel vm = new CounterViewModel();

        public MainWindow()
        {
            InitializeComponent();
            DataContext = vm;   // View 와 ViewModel 을 잇는 한 줄
        }

        // 처리기는 ViewModel 에게 일을 "시키기만" 한다 (20-2 에서는 이것마저 명령으로 바꾼다)
        private void BtnUp_Click(object sender, RoutedEventArgs e) => vm.Increase();
        private void BtnDown_Click(object sender, RoutedEventArgs e) => vm.Decrease();
        private void BtnReset_Click(object sender, RoutedEventArgs e) => vm.Reset();
    }
}
// ===== File: CounterViewModel.cs =====
namespace CounterMvvm
{
    // 화면에 필요한 상태(Count)와 규칙(0 아래로 내려가지 않음)을 가진 ViewModel
    public class CounterViewModel : ViewModelBase
    {
        private int count = 3;

        public int Count
        {
            get { return count; }
            set
            {
                if (SetProperty(ref count, value))        // 값이 실제로 바뀌었을 때만 true
                    OnPropertyChanged(nameof(Message));    // Message 는 Count 로 계산되므로 함께 알림
            }
        }

        // 계산 속성: 값을 저장하지 않고 Count 로 만든다
        public string Message => Count % 2 == 0 ? "짝수입니다" : "홀수입니다";

        public void Increase() { Count++; }
        public void Decrease() { if (Count > 0) Count--; }
        public void Reset() { Count = 0; }
    }
}
${VMBASE('CounterMvvm')}`;

  const EX_BMI = `// ===== File: MainWindow.xaml =====
<Window x:Class="BmiMvvm.MainWindow"
        ${NS}
        Title="BMI 계산기 — MVVM" Width="380" Height="300">
    <StackPanel Margin="20">
        <TextBlock Text="키 (cm)"/>
        <TextBox Text="{Binding HeightText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="16" Margin="0,2,0,8"/>
        <TextBlock Text="몸무게 (kg)"/>
        <TextBox Text="{Binding WeightText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="16" Margin="0,2,0,14"/>
        <!-- 계산 버튼이 없다: 입력이 바뀌면 결과 속성도 "바뀌었다" 고 알린다 -->
        <TextBlock Text="{Binding BmiText}" FontSize="26" FontWeight="Bold"/>
        <TextBlock Text="{Binding Category}" FontSize="16" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace BmiMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();   // 코드 비하인드는 이것이 전부
        }
    }
}
// ===== File: MainViewModel.cs =====
namespace BmiMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private string heightText = "170";
        private string weightText = "65";

        // 입력 속성 (TextBox 와 TwoWay) — 문자열로 받아 ViewModel 이 직접 검사한다
        public string HeightText
        {
            get { return heightText; }
            set { if (SetProperty(ref heightText, value)) NotifyResults(); }
        }

        public string WeightText
        {
            get { return weightText; }
            set { if (SetProperty(ref weightText, value)) NotifyResults(); }
        }

        // 결과 속성 (읽기 전용 계산 속성) — 계산할 수 없으면 null
        public double? Bmi
        {
            get
            {
                if (double.TryParse(HeightText, out double h) && double.TryParse(WeightText, out double w)
                    && h > 0 && w > 0)
                {
                    double m = h / 100;
                    return w / (m * m);
                }
                return null;
            }
        }

        public string BmiText => Bmi.HasValue ? $"BMI {Bmi.Value:F1}" : "BMI -";

        public string Category
        {
            get
            {
                if (!Bmi.HasValue) return "키와 몸무게를 숫자로 입력하세요";
                double b = Bmi.Value;
                if (b < 18.5) return "저체중";
                if (b < 23) return "정상";
                if (b < 25) return "과체중";
                return "비만";
            }
        }

        // 입력이 바뀌면 그 입력으로 계산하는 결과 속성들도 모두 알린다
        private void NotifyResults()
        {
            OnPropertyChanged(nameof(Bmi));
            OnPropertyChanged(nameof(BmiText));
            OnPropertyChanged(nameof(Category));
        }
    }
}
${VMBASE('BmiMvvm')}`;

  const SCORE_ROW = (row, label, prop) => `        <TextBlock Grid.Row="${row}" Text="${label}" VerticalAlignment="Center" FontSize="15"/>
        <Slider Grid.Row="${row}" Grid.Column="1" Minimum="0" Maximum="100" TickFrequency="1"
                IsSnapToTickEnabled="True" VerticalAlignment="Center"
                Value="{Binding ${prop}, Mode=TwoWay}"/>
        <TextBlock Grid.Row="${row}" Grid.Column="2" Text="{Binding ${prop}}" FontSize="15"
                   VerticalAlignment="Center" HorizontalAlignment="Right"/>`;

  const EX_SCORE = `// ===== File: MainWindow.xaml =====
<Window x:Class="ScoreMvvm.MainWindow"
        ${NS}
        Title="성적 계산기 — 계산 속성과 알림" Width="420" Height="330">
    <Grid Margin="20">
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="50"/>
            <ColumnDefinition Width="*"/>
            <ColumnDefinition Width="45"/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition Height="36"/>
            <RowDefinition Height="36"/>
            <RowDefinition Height="36"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>
${SCORE_ROW(0, '국어', 'Korean')}
${SCORE_ROW(1, '영어', 'English')}
${SCORE_ROW(2, '과학', 'Science')}
        <!-- 결과 세 개는 모두 계산 속성 -->
        <StackPanel Grid.Row="3" Grid.ColumnSpan="3" Margin="0,14,0,0">
            <TextBlock Text="{Binding Total, StringFormat='총점 {0}점'}" FontSize="18"/>
            <TextBlock Text="{Binding Average, StringFormat='평균 {0:F1}점'}" FontSize="18"/>
            <TextBlock Text="{Binding Grade, StringFormat='등급 {0}'}" FontSize="30" FontWeight="Bold"
                       Foreground="SteelBlue"/>
        </StackPanel>
    </Grid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ScoreMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}
// ===== File: MainViewModel.cs =====
namespace ScoreMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private int korean = 85;
        private int english = 72;
        private int science = 90;

        // SetProperty 가 true(값이 바뀜)를 돌려줄 때만 결과를 다시 알린다
        public int Korean
        {
            get { return korean; }
            set { if (SetProperty(ref korean, value)) NotifyResults(); }
        }
        public int English
        {
            get { return english; }
            set { if (SetProperty(ref english, value)) NotifyResults(); }
        }
        public int Science
        {
            get { return science; }
            set { if (SetProperty(ref science, value)) NotifyResults(); }
        }

        // 계산 속성 세 개: Total → Average → Grade 로 이어진다
        public int Total => Korean + English + Science;
        public double Average => Total / 3.0;
        public string Grade
        {
            get
            {
                if (Average >= 90) return "A";
                if (Average >= 80) return "B";
                if (Average >= 70) return "C";
                if (Average >= 60) return "D";
                return "F";
            }
        }

        // 재료(점수)가 바뀌면 결과 세 개를 모두 알린다 — 하나라도 빠뜨리면 그 칸만 옛 값으로 남는다
        private void NotifyResults()
        {
            OnPropertyChanged(nameof(Total));
            OnPropertyChanged(nameof(Average));
            OnPropertyChanged(nameof(Grade));
        }
    }
}
${VMBASE('ScoreMvvm')}`;

  const EX_ORDER = `// ===== File: MainWindow.xaml =====
<Window x:Class="OrderForm.MainWindow"
        ${NS}
        xmlns:vm="clr-namespace:OrderForm.ViewModels"
        Title="주문서 — XAML 에서 DataContext 연결" Width="420" Height="400">
    <!-- 창을 만들 때 MainViewModel 객체도 함께 만들어 DataContext 에 넣는다 -->
    <Window.DataContext>
        <vm:MainViewModel/>
    </Window.DataContext>
    <StackPanel Margin="20">
        <TextBlock Text="상품"/>
        <ComboBox ItemsSource="{Binding Products}" DisplayMemberPath="Name"
                  SelectedItem="{Binding SelectedProduct, Mode=TwoWay}" Margin="0,2,0,2"/>
        <TextBlock Text="{Binding SelectedProduct.UnitPrice, StringFormat='단가 {0:N0}원'}"
                   Foreground="Gray" Margin="0,0,0,10"/>
        <TextBlock Text="{Binding Quantity, StringFormat='수량 {0}개'}"/>
        <Slider Minimum="1" Maximum="10" TickFrequency="1" IsSnapToTickEnabled="True"
                Value="{Binding Quantity, Mode=TwoWay}" Margin="0,2,0,10"/>
        <CheckBox Content="회원 할인 (10%)" IsChecked="{Binding IsMember, Mode=TwoWay}"/>
        <Border BorderBrush="SteelBlue" BorderThickness="1" Padding="12" Margin="0,14,0,0">
            <StackPanel>
                <TextBlock Text="{Binding Subtotal, StringFormat='상품 금액 {0:N0}원'}"/>
                <TextBlock Text="{Binding Discount, StringFormat='할인 -{0:N0}원'}"/>
                <TextBlock Text="{Binding Total, StringFormat='결제 금액 {0:N0}원'}"
                           FontSize="20" FontWeight="Bold"/>
            </StackPanel>
        </Border>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace OrderForm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();   // DataContext 는 XAML 이 만들었다 — 여기에는 아무것도 없다
        }
    }
}
// ===== File: Models/Product.cs =====
namespace OrderForm.Models
{
    // Model: 화면과 상관없는 순수한 데이터
    public class Product
    {
        public string Name { get; set; } = "";
        public int UnitPrice { get; set; }
    }
}
// ===== File: ViewModels/MainViewModel.cs =====
using System.Collections.Generic;
using OrderForm.Models;

namespace OrderForm.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private Product? selectedProduct;
        private int quantity = 2;
        private bool isMember = true;

        // Model 목록 (실제 프로그램에서는 파일 · DB 에서 읽어 온다)
        public List<Product> Products { get; } = new List<Product>
        {
            new Product { Name = "무선 마우스", UnitPrice = 25000 },
            new Product { Name = "기계식 키보드", UnitPrice = 89000 },
            new Product { Name = "USB 메모리 64GB", UnitPrice = 12000 }
        };

        // XAML 에서 <vm:MainViewModel/> 로 만들려면 매개변수 없는 public 생성자가 필요하다
        public MainViewModel()
        {
            selectedProduct = Products[0];
        }

        public Product? SelectedProduct
        {
            get { return selectedProduct; }
            set { if (SetProperty(ref selectedProduct, value)) NotifyAmounts(); }
        }
        public int Quantity
        {
            get { return quantity; }
            set { if (SetProperty(ref quantity, value)) NotifyAmounts(); }
        }
        public bool IsMember
        {
            get { return isMember; }
            set { if (SetProperty(ref isMember, value)) NotifyAmounts(); }
        }

        public int Subtotal => SelectedProduct == null ? 0 : SelectedProduct.UnitPrice * Quantity;
        public int Discount => IsMember ? Subtotal / 10 : 0;
        public int Total => Subtotal - Discount;

        private void NotifyAmounts()
        {
            OnPropertyChanged(nameof(Subtotal));
            OnPropertyChanged(nameof(Discount));
            OnPropertyChanged(nameof(Total));
        }
    }
}
${VMBASE('OrderForm.ViewModels', 'ViewModels/ViewModelBase.cs')}`;

  /* ======================= 20-1 실습 코드 ======================= */
  const P1_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="TempMvvm.MainWindow"
        ${NS}
        Title="온도 변환기 — ViewModel" Width="380" Height="280">
    <StackPanel Margin="20">
        <TextBlock Text="섭씨 (°C)"/>
        <TextBox Text="{Binding CelsiusText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="18" Margin="0,2,0,10"/>
        <TextBlock Text="화씨 (°F)"/>
        <TextBox Text="{Binding FahrenheitText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 FontSize="18" Margin="0,2,0,14"/>
        <TextBlock Text="{Binding Description}" FontSize="16" Foreground="SteelBlue"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace TempMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}`;

  const P1_STARTER = `${P1_XAML}
// ===== File: MainViewModel.cs =====
namespace TempMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private string celsiusText = "20";
        private string fahrenheitText = "68";

        // TODO 1: SetProperty 로 저장하고(바뀌지 않았으면 return),
        //         숫자이면 화씨(섭씨 × 9 / 5 + 32)를 계산해 fahrenheitText 필드에 넣은 뒤
        //         FahrenheitText 와 Description 이 바뀌었다고 알리기
        public string CelsiusText
        {
            get { return celsiusText; }
            set { celsiusText = value; }
        }

        // TODO 2: 반대 방향 — 화씨가 숫자이면 섭씨((화씨 - 32) × 5 / 9)를 계산해
        //         celsiusText 필드에 넣고 CelsiusText 와 Description 알리기
        public string FahrenheitText
        {
            get { return fahrenheitText; }
            set { fahrenheitText = value; }
        }

        // TODO 3: 섭씨가 숫자가 아니면 "숫자를 입력하세요",
        //         0 이하 "얼음이 어는 추위", 25 미만 "활동하기 좋은 날씨", 그 밖에는 "더운 날씨"
        public string Description => "";
    }
}
${VMBASE('TempMvvm')}`;

  const P1_SOLUTION = `${P1_XAML}
// ===== File: MainViewModel.cs =====
namespace TempMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private string celsiusText = "20";
        private string fahrenheitText = "68";

        public string CelsiusText
        {
            get { return celsiusText; }
            set
            {
                if (!SetProperty(ref celsiusText, value)) return;
                if (double.TryParse(value, out double c))
                {
                    // 필드에 직접 넣는다: FahrenheitText 속성(set)을 쓰면 다시 섭씨를 계산하게 된다
                    fahrenheitText = (c * 9 / 5 + 32).ToString("0.#");
                    OnPropertyChanged(nameof(FahrenheitText));
                }
                OnPropertyChanged(nameof(Description));
            }
        }

        public string FahrenheitText
        {
            get { return fahrenheitText; }
            set
            {
                if (!SetProperty(ref fahrenheitText, value)) return;
                if (double.TryParse(value, out double f))
                {
                    celsiusText = ((f - 32) * 5 / 9).ToString("0.#");
                    OnPropertyChanged(nameof(CelsiusText));
                }
                OnPropertyChanged(nameof(Description));
            }
        }

        public string Description
        {
            get
            {
                if (!double.TryParse(CelsiusText, out double c)) return "숫자를 입력하세요";
                if (c <= 0) return $"{c}°C : 얼음이 어는 추위";
                if (c < 25) return $"{c}°C : 활동하기 좋은 날씨";
                return $"{c}°C : 더운 날씨";
            }
        }
    }
}
${VMBASE('TempMvvm')}`;

  const CART_ROW = (label, prop) => `        <TextBlock Text="{Binding ${prop}, StringFormat='${label} × {0}개'}" FontSize="15"/>
        <Slider Minimum="0" Maximum="10" TickFrequency="1" IsSnapToTickEnabled="True"
                Value="{Binding ${prop}, Mode=TwoWay}" Margin="0,2,0,8"/>`;

  const P2_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="CartMvvm.MainWindow"
        ${NS}
        Title="장바구니 합계" Width="420" Height="400">
    <StackPanel Margin="20">
${CART_ROW('사과 (1200원)', 'AppleCount')}
${CART_ROW('우유 (2500원)', 'MilkCount')}
${CART_ROW('식빵 (3000원)', 'BreadCount')}
        <Border BorderBrush="SteelBlue" BorderThickness="1" Padding="12" Margin="0,6,0,0">
            <StackPanel>
                <TextBlock Text="{Binding Subtotal, StringFormat='상품 금액 {0:N0}원'}"/>
                <TextBlock Text="{Binding ShippingFee, StringFormat='배송비 {0:N0}원'}"/>
                <TextBlock Text="{Binding Total, StringFormat='합계 {0:N0}원'}" FontSize="20" FontWeight="Bold"/>
                <TextBlock Text="{Binding ShippingMessage}" Foreground="SeaGreen"/>
            </StackPanel>
        </Border>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace CartMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}`;

  const P2_STARTER = `${P2_XAML}
// ===== File: MainViewModel.cs =====
namespace CartMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private const int ApplePrice = 1200;
        private const int MilkPrice = 2500;
        private const int BreadPrice = 3000;
        private const int FreeShippingLimit = 20000;   // 이 금액 이상이면 배송비 0원
        private const int BasicShippingFee = 3000;

        private int appleCount = 3;
        private int milkCount = 2;
        private int breadCount = 1;

        // TODO 1: 세 속성을 SetProperty 로 바꾸고, 값이 바뀌면 NotifyTotals() 호출
        public int AppleCount { get { return appleCount; } set { appleCount = value; } }
        public int MilkCount { get { return milkCount; } set { milkCount = value; } }
        public int BreadCount { get { return breadCount; } set { breadCount = value; } }

        // TODO 2: 계산 속성 완성
        //   Subtotal: 개수 × 가격의 합
        //   ShippingFee: 상품 금액이 0 이거나 20,000원 이상이면 0, 아니면 3,000
        //   Total: Subtotal + ShippingFee
        //   ShippingMessage: "상품을 담아 주세요" / "무료 배송입니다!" / "8,400원 더 담으면 무료 배송"
        public int Subtotal => 0;
        public int ShippingFee => 0;
        public int Total => 0;
        public string ShippingMessage => "";

        // TODO 3: 계산 속성 네 개가 바뀌었다고 알리기
        private void NotifyTotals()
        {
        }
    }
}
${VMBASE('CartMvvm')}`;

  const P2_SOLUTION = `${P2_XAML}
// ===== File: MainViewModel.cs =====
namespace CartMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private const int ApplePrice = 1200;
        private const int MilkPrice = 2500;
        private const int BreadPrice = 3000;
        private const int FreeShippingLimit = 20000;   // 이 금액 이상이면 배송비 0원
        private const int BasicShippingFee = 3000;

        private int appleCount = 3;
        private int milkCount = 2;
        private int breadCount = 1;

        public int AppleCount
        {
            get { return appleCount; }
            set { if (SetProperty(ref appleCount, value)) NotifyTotals(); }
        }
        public int MilkCount
        {
            get { return milkCount; }
            set { if (SetProperty(ref milkCount, value)) NotifyTotals(); }
        }
        public int BreadCount
        {
            get { return breadCount; }
            set { if (SetProperty(ref breadCount, value)) NotifyTotals(); }
        }

        public int Subtotal => AppleCount * ApplePrice + MilkCount * MilkPrice + BreadCount * BreadPrice;

        public int ShippingFee => (Subtotal == 0 || Subtotal >= FreeShippingLimit) ? 0 : BasicShippingFee;

        public int Total => Subtotal + ShippingFee;

        public string ShippingMessage
        {
            get
            {
                if (Subtotal == 0) return "상품을 담아 주세요";
                if (Subtotal >= FreeShippingLimit) return "무료 배송입니다!";
                return $"{FreeShippingLimit - Subtotal:N0}원 더 담으면 무료 배송";
            }
        }

        private void NotifyTotals()
        {
            OnPropertyChanged(nameof(Subtotal));
            OnPropertyChanged(nameof(ShippingFee));
            OnPropertyChanged(nameof(Total));
            OnPropertyChanged(nameof(ShippingMessage));
        }
    }
}
${VMBASE('CartMvvm')}`;

  /* ======================= 20-1 슬라이드용 짧은 코드 ======================= */
  const SL_BASE = `using System; using System.Collections.Generic;
using System.ComponentModel; using System.Runtime.CompilerServices;
abstract class ViewModelBase : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;
    protected void OnPropertyChanged([CallerMemberName] string? name = null)
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? name = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return false;   // 같으면 알리지 않음
        field = value;
        OnPropertyChanged(name);
        return true;
    }
}
class CounterViewModel : ViewModelBase
{
    private int count;
    public int Count { get => count; set => SetProperty(ref count, value); }   // 한 줄!
}
class Program
{
    static void Main()
    {
        var vm = new CounterViewModel();
        vm.PropertyChanged += (s, e) => Console.WriteLine($"알림: {e.PropertyName} = {vm.Count}");
        vm.Count = 1; vm.Count = 1; vm.Count = 2;   // 두 번째 1 은 같은 값 → 알림 없음
    }
}`;

  const SL_COUNTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="CounterSlide.MainWindow"
        ${NS}
        Title="첫 MVVM" Width="300" Height="200">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Count}" FontSize="40" HorizontalAlignment="Center"/>
        <TextBlock Text="{Binding Message}" HorizontalAlignment="Center"/>
        <Button Content="+1" Height="30" Margin="0,10,0,0" Click="BtnUp_Click"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel; using System.Windows;
namespace CounterSlide
{
    public class CounterViewModel : INotifyPropertyChanged
    {
        private int count;
        public int Count { get => count; set { count = value; Notify(nameof(Count)); Notify(nameof(Message)); } }
        public string Message => Count % 2 == 0 ? "짝수" : "홀수";
        public event PropertyChangedEventHandler? PropertyChanged;
        private void Notify(string n) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
    }
    public partial class MainWindow : Window
    {
        private readonly CounterViewModel vm = new CounterViewModel();
        public MainWindow() { InitializeComponent(); DataContext = vm; }
        private void BtnUp_Click(object sender, RoutedEventArgs e) => vm.Count++;   // 일은 ViewModel 이
    }
}`;

  const SL_TOTAL = `// ===== File: MainWindow.xaml =====
<Window x:Class="TotalSlide.MainWindow"
        ${NS}
        Title="계산 속성" Width="320" Height="200">
    <StackPanel Margin="20">
        <Slider Minimum="1" Maximum="10" TickFrequency="1" IsSnapToTickEnabled="True"
                Value="{Binding Quantity, Mode=TwoWay}"/>
        <TextBlock Text="{Binding Quantity, StringFormat='수량 {0}개'}" FontSize="16"/>
        <TextBlock Text="{Binding Total, StringFormat='합계 {0:N0}원'}" FontSize="24"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel; using System.Windows;
namespace TotalSlide
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private int quantity = 2;
        // 입력 속성: Quantity 가 바뀌면 Total 도 바뀌었다고 알린다
        public int Quantity { get => quantity; set { quantity = value; Notify(nameof(Quantity)); Notify(nameof(Total)); } }
        public int Total => Quantity * 3500;   // 계산 속성 (set 없음)
        public event PropertyChangedEventHandler? PropertyChanged;
        private void Notify(string n) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
    }
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); DataContext = new MainViewModel(); }
    }
}`;

  const SL_XAMLDC = `// ===== File: MainWindow.xaml =====
<Window x:Class="XamlDcSlide.MainWindow"
        ${NS}
        xmlns:local="clr-namespace:XamlDcSlide"
        Title="XAML 에서 DataContext" Width="320" Height="180">
    <Window.DataContext>
        <local:MainViewModel/>
    </Window.DataContext>
    <StackPanel Margin="20">
        <TextBox Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
        <TextBlock Text="{Binding Greeting}" FontSize="18" Margin="0,10,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel; using System.Windows;
namespace XamlDcSlide
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private string name = "민준";
        public string Name { get => name; set { name = value; Notify(nameof(Name)); Notify(nameof(Greeting)); } }
        public string Greeting => $"안녕하세요, {Name}님!";
        public event PropertyChangedEventHandler? PropertyChanged;
        private void Notify(string n) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(n));
    }
    public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); } }   // DataContext 코드 없음
}`;

  /* ======================= 20-2 예제 코드 ======================= */
  const CMD_BTN = (text, param) => `            <Button Content="${text}" Width="60" Height="32" Margin="3,0"
                    CommandParameter="${param}" Command="{Binding ChangeCommand}"/>`;

  const EX_CMD_COUNTER = `// ===== File: MainWindow.xaml =====
<Window x:Class="CounterCommand.MainWindow"
        ${NS}
        Title="명령과 CommandParameter" Width="400" Height="290">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Count}" FontSize="48" FontWeight="Bold" HorizontalAlignment="Center"/>
        <TextBlock Text="0 ~ 100 사이에서만 바뀝니다" Foreground="Gray" HorizontalAlignment="Center"/>
        <!-- 버튼 네 개가 같은 명령(ChangeCommand)을 쓰고, CommandParameter 로 "얼마나" 를 넘긴다 -->
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,16,0,0">
${CMD_BTN('−10', '-10')}
${CMD_BTN('−1', '-1')}
${CMD_BTN('+1', '1')}
${CMD_BTN('+10', '10')}
        </StackPanel>
        <Button Content="0 으로" Width="120" Height="30" Margin="0,12,0,0"
                Command="{Binding ResetCommand}"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace CounterCommand
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();   // Click 처리기가 하나도 없다
        }
    }
}
// ===== File: MainViewModel.cs =====
using System.Windows.Input;

namespace CounterCommand
{
    public class MainViewModel : ViewModelBase
    {
        private int count = 5;

        public int Count
        {
            get { return count; }
            set { SetProperty(ref count, value); }
        }

        // 버튼이 바인딩할 명령 속성 (읽기 전용 — 생성자에서 한 번 만든다)
        public ICommand ChangeCommand { get; }
        public ICommand ResetCommand { get; }

        public MainViewModel()
        {
            ChangeCommand = new RelayCommand(Change, CanChange);
            ResetCommand = new RelayCommand(_ => Count = 0, _ => Count != 0);   // 람다로 짧게
        }

        // parameter = 버튼의 CommandParameter ("-10", "1" … 문자열)
        private void Change(object? parameter)
        {
            Count += ToStep(parameter);
        }

        // 범위를 벗어나게 만드는 버튼은 자동으로 비활성
        private bool CanChange(object? parameter)
        {
            int next = Count + ToStep(parameter);
            return next >= 0 && next <= 100;
        }

        private static int ToStep(object? parameter)
        {
            return int.TryParse(parameter as string, out int step) ? step : 0;
        }
    }
}
${VMBASE('CounterCommand')}
${RELAY('CounterCommand')}`;

  const TODO_INPUT_ROW = `        <!-- 입력 줄: TextBox ↔ NewTitle, 추가 버튼 → AddCommand -->
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <Button DockPanel.Dock="Right" Content="추가" Width="70" Margin="6,0,0,0"
                    Command="{Binding AddCommand}"/>
            <TextBox Text="{Binding NewTitle, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14"/>
        </DockPanel>`;

  const TODO_ITEM_SIMPLE = (ns) => `// ===== File: TodoItem.cs =====
namespace ${ns}
{
    public class TodoItem
    {
        public string Title { get; set; } = "";
    }
}`;

  const EX_TODO1 = `// ===== File: MainWindow.xaml =====
<Window x:Class="TodoStep1.MainWindow"
        ${NS}
        Title="할 일 목록 ① 추가" Width="400" Height="360">
    <DockPanel Margin="12">
${TODO_INPUT_ROW}
        <TextBlock DockPanel.Dock="Bottom" Margin="0,8,0,0" Foreground="Gray"
                   Text="{Binding Todos.Count, StringFormat='할 일 {0}개'}"/>
        <ListBox ItemsSource="{Binding Todos}" DisplayMemberPath="Title" FontSize="14"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace TodoStep1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}
// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace TodoStep1
{
    public class MainViewModel : ViewModelBase
    {
        private string newTitle = "";

        // 입력 칸과 TwoWay 로 연결된 속성
        public string NewTitle
        {
            get { return newTitle; }
            set { SetProperty(ref newTitle, value); }
        }

        // Add · Remove 하면 목록 화면이 저절로 바뀌는 컬렉션 (18장)
        public ObservableCollection<TodoItem> Todos { get; } = new ObservableCollection<TodoItem>
        {
            new TodoItem { Title = "20장 예제 따라 입력하기" },
            new TodoItem { Title = "RelayCommand 외워 보기" }
        };

        public ICommand AddCommand { get; }

        public MainViewModel()
        {
            AddCommand = new RelayCommand(_ => AddTodo(), _ => CanAddTodo());
        }

        // 입력 칸이 비어 있으면(공백뿐이어도) false → 추가 버튼이 꺼진다
        private bool CanAddTodo()
        {
            return !string.IsNullOrWhiteSpace(NewTitle);
        }

        private void AddTodo()
        {
            Todos.Add(new TodoItem { Title = NewTitle.Trim() });
            NewTitle = "";   // 속성만 비우면 TextBox 도 비워진다 (TwoWay + 알림)
        }
    }
}
${TODO_ITEM_SIMPLE('TodoStep1')}
${VMBASE('TodoStep1')}
${RELAY('TodoStep1')}`;

  const EX_TODO2 = `// ===== File: MainWindow.xaml =====
<Window x:Class="TodoStep2.MainWindow"
        ${NS}
        Title="할 일 목록 ② 선택과 삭제" Width="400" Height="360">
    <DockPanel Margin="12">
${TODO_INPUT_ROW}
        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <Button DockPanel.Dock="Right" Content="선택 삭제" Width="90"
                    Command="{Binding DeleteCommand}"/>
            <TextBlock Text="{Binding Todos.Count, StringFormat='할 일 {0}개'}"
                       VerticalAlignment="Center" Foreground="Gray"/>
        </DockPanel>
        <!-- 고른 항목이 ViewModel 의 SelectedTodo 에 들어간다 (TwoWay) -->
        <ListBox ItemsSource="{Binding Todos}" DisplayMemberPath="Title" FontSize="14"
                 SelectedItem="{Binding SelectedTodo, Mode=TwoWay}"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace TodoStep2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}
// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace TodoStep2
{
    public class MainViewModel : ViewModelBase
    {
        private string newTitle = "";
        private TodoItem? selectedTodo;

        public string NewTitle
        {
            get { return newTitle; }
            set { SetProperty(ref newTitle, value); }
        }

        // 목록에서 고른 항목 (아무것도 안 골랐으면 null)
        public TodoItem? SelectedTodo
        {
            get { return selectedTodo; }
            set { SetProperty(ref selectedTodo, value); }
        }

        public ObservableCollection<TodoItem> Todos { get; } = new ObservableCollection<TodoItem>
        {
            new TodoItem { Title = "20장 예제 따라 입력하기" },
            new TodoItem { Title = "RelayCommand 외워 보기" },
            new TodoItem { Title = "삭제 버튼 눌러 보기" }
        };

        public ICommand AddCommand { get; }
        public ICommand DeleteCommand { get; }

        public MainViewModel()
        {
            AddCommand = new RelayCommand(_ => AddTodo(), _ => !string.IsNullOrWhiteSpace(NewTitle));
            DeleteCommand = new RelayCommand(_ => DeleteTodo(), _ => SelectedTodo != null);   // 고른 게 있을 때만
        }

        private void AddTodo()
        {
            Todos.Add(new TodoItem { Title = NewTitle.Trim() });
            NewTitle = "";
        }

        private void DeleteTodo()
        {
            if (SelectedTodo == null) return;
            Todos.Remove(SelectedTodo);   // 컬렉션에서 지우면 목록 화면에서도 사라진다
            SelectedTodo = null;          // 선택 해제 → 삭제 버튼은 다시 꺼진다
        }
    }
}
${TODO_ITEM_SIMPLE('TodoStep2')}
${VMBASE('TodoStep2')}
${RELAY('TodoStep2')}`;

  const EX_TODO3 = `// ===== File: MainWindow.xaml =====
<Window x:Class="TodoApp.MainWindow"
        ${NS}
        Title="할 일 목록 — MVVM 완성" Width="460" Height="400">
    <DockPanel Margin="12">
${TODO_INPUT_ROW}
        <!-- 아래쪽: 남은 개수 + 명령 버튼 세 개 -->
        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <StackPanel DockPanel.Dock="Right" Orientation="Horizontal">
                <Button Content="삭제" Width="60" Command="{Binding DeleteCommand}"/>
                <Button Content="완료 지우기" Width="85" Margin="6,0,0,0"
                        Command="{Binding ClearCompletedCommand}"/>
                <Button Content="모두 지우기" Width="85" Margin="6,0,0,0"
                        Command="{Binding ClearAllCommand}"/>
            </StackPanel>
            <TextBlock Text="{Binding Summary}" VerticalAlignment="Center" Foreground="SteelBlue"/>
        </DockPanel>
        <!-- 목록: 항목마다 체크박스(IsDone) + 제목 -->
        <ListBox ItemsSource="{Binding Todos}" SelectedItem="{Binding SelectedTodo, Mode=TwoWay}"
                 HorizontalContentAlignment="Stretch">
            <ListBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel Orientation="Horizontal" Margin="2,3">
                        <CheckBox IsChecked="{Binding IsDone, Mode=TwoWay}" VerticalAlignment="Center"/>
                        <TextBlock Text="{Binding Title}" FontSize="14" Margin="8,0,0,0"/>
                    </StackPanel>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using TodoApp.ViewModels;

namespace TodoApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}
// ===== File: Models/TodoItem.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace TodoApp.Models
{
    // Model: 할 일 하나. 체크박스가 IsDone 을 바꾸면 "바뀌었다" 고 알려야 하므로 INotifyPropertyChanged
    public class TodoItem : INotifyPropertyChanged
    {
        private string title = "";
        private bool isDone;

        public string Title
        {
            get { return title; }
            set { title = value; OnPropertyChanged(); }
        }

        public bool IsDone
        {
            get { return isDone; }
            set
            {
                if (isDone == value) return;
                isDone = value;
                OnPropertyChanged();
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
// ===== File: ViewModels/MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using TodoApp.Models;

namespace TodoApp.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private string newTitle = "";
        private TodoItem? selectedTodo;

        public ObservableCollection<TodoItem> Todos { get; } = new ObservableCollection<TodoItem>();

        public string NewTitle
        {
            get { return newTitle; }
            set { SetProperty(ref newTitle, value); }
        }

        public TodoItem? SelectedTodo
        {
            get { return selectedTodo; }
            set { SetProperty(ref selectedTodo, value); }
        }

        // 계산 속성: 목록이 바뀌거나 항목의 IsDone 이 바뀔 때마다 다시 알린다
        public int RemainingCount => Todos.Count(t => !t.IsDone);
        public string Summary => $"남은 일 {RemainingCount}개 / 전체 {Todos.Count}개";

        public ICommand AddCommand { get; }
        public ICommand DeleteCommand { get; }
        public ICommand ClearCompletedCommand { get; }
        public ICommand ClearAllCommand { get; }

        public MainViewModel()
        {
            AddCommand = new RelayCommand(_ => AddTodo(), _ => !string.IsNullOrWhiteSpace(NewTitle));
            DeleteCommand = new RelayCommand(_ => DeleteTodo(), _ => SelectedTodo != null);
            ClearCompletedCommand = new RelayCommand(_ => ClearCompleted(), _ => Todos.Any(t => t.IsDone));
            ClearAllCommand = new RelayCommand(_ => Todos.Clear(), _ => Todos.Count > 0);

            // 목록이 바뀔 때(추가 · 삭제) 알림을 받는다 — 처음 항목을 넣기 전에 구독해야 한다
            Todos.CollectionChanged += Todos_CollectionChanged;

            Todos.Add(new TodoItem { Title = "MVVM 개념 정리하기", IsDone = true });
            Todos.Add(new TodoItem { Title = "RelayCommand 만들어 보기" });
            Todos.Add(new TodoItem { Title = "할 일 앱 완성하기" });
        }

        private void AddTodo()
        {
            Todos.Add(new TodoItem { Title = NewTitle.Trim() });
            NewTitle = "";
        }

        private void DeleteTodo()
        {
            if (SelectedTodo == null) return;
            Todos.Remove(SelectedTodo);
            SelectedTodo = null;
        }

        private void ClearCompleted()
        {
            // foreach 로 돌면서 같은 컬렉션을 지우면 오류 → 지울 항목을 먼저 복사(ToList)
            foreach (TodoItem item in Todos.Where(t => t.IsDone).ToList())
            {
                Todos.Remove(item);
            }
        }

        // ① 목록 알림: 새 항목은 구독하고, 빠진 항목은 구독을 끊는다
        private void Todos_CollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
                foreach (TodoItem item in e.NewItems) item.PropertyChanged += Todo_PropertyChanged;
            if (e.OldItems != null)
                foreach (TodoItem item in e.OldItems) item.PropertyChanged -= Todo_PropertyChanged;
            NotifyCounts();
        }

        // ② 항목 알림: 어떤 항목의 IsDone 이 바뀌면 남은 개수를 다시 알린다
        private void Todo_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(TodoItem.IsDone)) NotifyCounts();
        }

        private void NotifyCounts()
        {
            OnPropertyChanged(nameof(RemainingCount));
            OnPropertyChanged(nameof(Summary));
        }
    }
}
${VMBASE('TodoApp.ViewModels', 'ViewModels/ViewModelBase.cs')}
${RELAY('TodoApp.ViewModels', 'ViewModels/RelayCommand.cs')}`;

  const EX_TEST = `using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows.Input;   // ICommand 는 WPF 가 아니라 .NET 기본 라이브러리에 들어 있다

// ===== ViewModel 쪽 코드: WPF 컨트롤을 하나도 쓰지 않는다 =====
class TodoItem
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}

class RelayCommand : ICommand
{
    private readonly Action<object?> execute;
    private readonly Func<object?, bool> canExecute;

    public RelayCommand(Action<object?> execute, Func<object?, bool> canExecute)
    {
        this.execute = execute;
        this.canExecute = canExecute;
    }

    public bool CanExecute(object? parameter) => canExecute(parameter);
    public void Execute(object? parameter) { if (CanExecute(parameter)) execute(parameter); }

    // 콘솔에는 CommandManager 가 없으므로 필요할 때 직접 알린다
    public event EventHandler? CanExecuteChanged;
    public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
}

class TodoViewModel : INotifyPropertyChanged
{
    private string newTitle = "";

    public string NewTitle
    {
        get => newTitle;
        set { newTitle = value; OnPropertyChanged(); AddCommand.RaiseCanExecuteChanged(); }
    }

    public ObservableCollection<TodoItem> Todos { get; } = new ObservableCollection<TodoItem>();
    public int RemainingCount => Todos.Count(t => !t.IsDone);

    public RelayCommand AddCommand { get; }
    public RelayCommand CompleteCommand { get; }

    public TodoViewModel()
    {
        AddCommand = new RelayCommand(_ => AddTodo(), _ => !string.IsNullOrWhiteSpace(NewTitle));
        CompleteCommand = new RelayCommand(p => Complete((TodoItem)p!), p => p is TodoItem t && !t.IsDone);
    }

    private void AddTodo()
    {
        Todos.Add(new TodoItem { Title = NewTitle.Trim() });
        NewTitle = "";
        OnPropertyChanged(nameof(RemainingCount));
    }

    private void Complete(TodoItem item)
    {
        item.IsDone = true;
        OnPropertyChanged(nameof(RemainingCount));
    }

    public event PropertyChangedEventHandler? PropertyChanged;
    private void OnPropertyChanged([CallerMemberName] string? name = null)
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}

// ===== 테스트: 화면 대신 코드가 "사용자" 역할을 한다 =====
class Program
{
    static int passed = 0;
    static int total = 0;

    static void Check(string name, bool ok)
    {
        total++;
        if (ok) passed++;
        Console.WriteLine($"[{(ok ? "통과" : "실패")}] {name}");
    }

    static void Main()
    {
        var vm = new TodoViewModel();
        // 바인딩이 받을 알림을 대신 받아 출력한다
        vm.PropertyChanged += (s, e) => Console.WriteLine($"    (알림) {e.PropertyName}");

        Check("처음에는 입력이 비어 추가할 수 없다", !vm.AddCommand.CanExecute(null));

        vm.NewTitle = "우유 사기";                  // 사용자가 입력 칸에 쓴 것처럼
        Check("제목을 입력하면 추가할 수 있다", vm.AddCommand.CanExecute(null));

        vm.AddCommand.Execute(null);                // 추가 버튼을 누른 것처럼
        Check("추가하면 목록은 1개, 입력 칸은 빈칸", vm.Todos.Count == 1 && vm.NewTitle == "");
        Check("남은 일은 1개", vm.RemainingCount == 1);

        vm.CompleteCommand.Execute(vm.Todos[0]);    // 체크박스를 누른 것처럼
        Check("완료하면 남은 일은 0개", vm.RemainingCount == 0);
        Check("이미 완료한 일은 다시 완료할 수 없다", !vm.CompleteCommand.CanExecute(vm.Todos[0]));

        Console.WriteLine($"결과: {total}개 중 {passed}개 통과");
    }
}`;

  /* ======================= 20-2 실습 코드 ======================= */
  const P3_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="ContactMvvm.MainWindow"
        ${NS}
        Title="연락처 관리 — MVVM" Width="440" Height="400">
    <DockPanel Margin="12">
        <TextBlock DockPanel.Dock="Top" Text="이름과 전화번호를 입력하고 추가를 누르세요" Foreground="Gray"
                   Margin="0,0,0,4"/>
        <Grid DockPanel.Dock="Top" Margin="0,0,0,8">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="70"/>
            </Grid.ColumnDefinitions>
            <TextBox Text="{Binding NewName, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14" Margin="0,0,6,0"/>
            <TextBox Grid.Column="1" Text="{Binding NewPhone, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     FontSize="14" Margin="0,0,6,0"/>
            <Button Grid.Column="2" Content="추가" Command="{Binding AddCommand}"/>
        </Grid>
        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <Button DockPanel.Dock="Right" Content="선택 삭제" Width="90" Command="{Binding DeleteCommand}"/>
            <TextBlock Text="{Binding Contacts.Count, StringFormat='연락처 {0}명'}" VerticalAlignment="Center"
                       Foreground="Gray"/>
        </DockPanel>
        <ListBox ItemsSource="{Binding Contacts}" SelectedItem="{Binding SelectedContact, Mode=TwoWay}">
            <ListBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel Margin="2,3">
                        <TextBlock Text="{Binding Name}" FontSize="15" FontWeight="Bold"/>
                        <TextBlock Text="{Binding Phone}" Foreground="SteelBlue"/>
                    </StackPanel>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ContactMvvm
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}`;

  const P3_TAIL = `// ===== File: Contact.cs =====
namespace ContactMvvm
{
    public class Contact
    {
        public string Name { get; set; } = "";
        public string Phone { get; set; } = "";
    }
}
${VMBASE('ContactMvvm')}
${RELAY('ContactMvvm')}`;

  const P3_CONTACTS = `        public ObservableCollection<Contact> Contacts { get; } = new ObservableCollection<Contact>
        {
            new Contact { Name = "김민수", Phone = "010-1234-5678" },
            new Contact { Name = "이서연", Phone = "010-2222-3333" }
        };`;

  const P3_STARTER = `${P3_XAML}
// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace ContactMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private string newName = "";
        private string newPhone = "";
        private Contact? selectedContact;

${P3_CONTACTS}

        // TODO 1: 세 속성의 set 을 SetProperty 로 바꾸기
        public string NewName { get { return newName; } set { newName = value; } }
        public string NewPhone { get { return newPhone; } set { newPhone = value; } }
        public Contact? SelectedContact { get { return selectedContact; } set { selectedContact = value; } }

        public ICommand AddCommand { get; }
        public ICommand DeleteCommand { get; }

        public MainViewModel()
        {
            // TODO 2: AddCommand — 이름과 전화가 모두 입력되었을 때만 실행 가능.
            //         실행하면 Contacts 에 추가하고 두 입력 칸을 비운다
            AddCommand = new RelayCommand(_ => { });

            // TODO 3: DeleteCommand — 고른 연락처가 있을 때만 실행 가능. 실행하면 지우고 선택 해제
            DeleteCommand = new RelayCommand(_ => { });
        }
    }
}
${P3_TAIL}`;

  const P3_SOLUTION = `${P3_XAML}
// ===== File: MainViewModel.cs =====
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace ContactMvvm
{
    public class MainViewModel : ViewModelBase
    {
        private string newName = "";
        private string newPhone = "";
        private Contact? selectedContact;

${P3_CONTACTS}

        public string NewName
        {
            get { return newName; }
            set { SetProperty(ref newName, value); }
        }
        public string NewPhone
        {
            get { return newPhone; }
            set { SetProperty(ref newPhone, value); }
        }
        public Contact? SelectedContact
        {
            get { return selectedContact; }
            set { SetProperty(ref selectedContact, value); }
        }

        public ICommand AddCommand { get; }
        public ICommand DeleteCommand { get; }

        public MainViewModel()
        {
            AddCommand = new RelayCommand(_ => AddContact(), _ => CanAddContact());
            DeleteCommand = new RelayCommand(_ => DeleteContact(), _ => SelectedContact != null);
        }

        private bool CanAddContact()
        {
            return !string.IsNullOrWhiteSpace(NewName) && !string.IsNullOrWhiteSpace(NewPhone);
        }

        private void AddContact()
        {
            var contact = new Contact { Name = NewName.Trim(), Phone = NewPhone.Trim() };
            Contacts.Add(contact);
            SelectedContact = contact;   // 새로 넣은 연락처를 골라 둔다
            NewName = "";
            NewPhone = "";
        }

        private void DeleteContact()
        {
            if (SelectedContact == null) return;
            Contacts.Remove(SelectedContact);
            SelectedContact = null;
        }
    }
}
${P3_TAIL}`;

  const TEAM_PANEL = (col, name, color, prop, param) => `            <StackPanel${col ? ' Grid.Column="1"' : ''} Margin="6">
                <TextBlock Text="${name}" FontSize="18" Foreground="${color}" HorizontalAlignment="Center"/>
                <TextBlock Text="{Binding ${prop}}" FontSize="56" FontWeight="Bold" HorizontalAlignment="Center"/>
                <Button Content="+1 점" Height="32" CommandParameter="${param}"
                        Command="{Binding AddPointCommand}"/>
            </StackPanel>`;

  const P4_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="ScoreBoard.MainWindow"
        ${NS}
        Title="점수판 — 명령과 CommandParameter" Width="420" Height="360">
    <StackPanel Margin="16">
        <TextBlock Text="{Binding StatusText}" FontSize="20" FontWeight="Bold" HorizontalAlignment="Center"/>
        <TextBlock Text="먼저 5점을 얻는 팀이 이깁니다" Foreground="Gray" HorizontalAlignment="Center"
                   Margin="0,2,0,8"/>
        <Grid>
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
${TEAM_PANEL(0, '블루팀', 'SteelBlue', 'BlueScore', 'Blue')}
${TEAM_PANEL(1, '레드팀', 'Crimson', 'RedScore', 'Red')}
        </Grid>
        <Button Content="새 경기" Width="120" Height="30" Margin="0,12,0,0" Command="{Binding ResetCommand}"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace ScoreBoard
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }
    }
}`;

  const P4_TAIL = `${VMBASE('ScoreBoard')}
${RELAY('ScoreBoard')}`;

  const P4_STARTER = `${P4_XAML}
// ===== File: MainViewModel.cs =====
using System.Windows.Input;

namespace ScoreBoard
{
    public class MainViewModel : ViewModelBase
    {
        public const int WinningScore = 5;
        private int blueScore = 2;
        private int redScore = 1;

        // TODO 1: SetProperty 로 저장하고, 바뀌면 StatusText 도 알리기
        public int BlueScore { get { return blueScore; } set { blueScore = value; } }
        public int RedScore { get { return redScore; } set { redScore = value; } }

        public bool IsGameOver => BlueScore >= WinningScore || RedScore >= WinningScore;

        // TODO 2: "블루팀 승리!" · "레드팀 승리!" · "동점" · "블루팀 리드" · "레드팀 리드"
        public string StatusText => "";

        public ICommand AddPointCommand { get; }
        public ICommand ResetCommand { get; }

        public MainViewModel()
        {
            // TODO 3: AddPointCommand — parameter 가 "Blue" 면 BlueScore++, "Red" 면 RedScore++.
            //         경기가 끝나면(IsGameOver) 실행할 수 없음
            AddPointCommand = new RelayCommand(_ => { });

            // TODO 4: ResetCommand — 두 점수를 0 으로. 두 점수가 모두 0 이면 실행할 수 없음
            ResetCommand = new RelayCommand(_ => { });
        }
    }
}
${P4_TAIL}`;

  const P4_SOLUTION = `${P4_XAML}
// ===== File: MainViewModel.cs =====
using System.Windows.Input;

namespace ScoreBoard
{
    public class MainViewModel : ViewModelBase
    {
        public const int WinningScore = 5;
        private int blueScore = 2;
        private int redScore = 1;

        public int BlueScore
        {
            get { return blueScore; }
            set { if (SetProperty(ref blueScore, value)) OnPropertyChanged(nameof(StatusText)); }
        }
        public int RedScore
        {
            get { return redScore; }
            set { if (SetProperty(ref redScore, value)) OnPropertyChanged(nameof(StatusText)); }
        }

        public bool IsGameOver => BlueScore >= WinningScore || RedScore >= WinningScore;

        public string StatusText
        {
            get
            {
                if (BlueScore >= WinningScore) return "블루팀 승리!";
                if (RedScore >= WinningScore) return "레드팀 승리!";
                if (BlueScore == RedScore) return "동점";
                return BlueScore > RedScore ? "블루팀 리드" : "레드팀 리드";
            }
        }

        public ICommand AddPointCommand { get; }
        public ICommand ResetCommand { get; }

        public MainViewModel()
        {
            AddPointCommand = new RelayCommand(AddPoint, _ => !IsGameOver);
            ResetCommand = new RelayCommand(_ => Reset(), _ => BlueScore + RedScore > 0);
        }

        private void AddPoint(object? parameter)
        {
            string team = parameter as string ?? "";
            if (team == "Blue") BlueScore++;
            else if (team == "Red") RedScore++;
        }

        private void Reset()
        {
            BlueScore = 0;
            RedScore = 0;
        }
    }
}
${P4_TAIL}`;

  /* ======================= 20-2 슬라이드용 짧은 코드 ======================= */
  const SL_RELAY = `// ===== File: MainWindow.xaml =====
<Window x:Class="RelaySlide.MainWindow" Title="RelayCommand" Width="300" Height="180"
        ${NS}>
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Count}" FontSize="36" HorizontalAlignment="Center"/>
        <Button Content="+1 (5 까지)" Height="30" Command="{Binding AddCommand}"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.ComponentModel; using System.Windows; using System.Windows.Input;
namespace RelaySlide
{
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> execute; private readonly Func<object?, bool>? canExecute;
        public RelayCommand(Action<object?> e, Func<object?, bool>? c = null) { execute = e; canExecute = c; }
        public bool CanExecute(object? p) => canExecute == null || canExecute(p);
        public void Execute(object? p) => execute(p);
        public event EventHandler? CanExecuteChanged { add => CommandManager.RequerySuggested += value; remove => CommandManager.RequerySuggested -= value; }
    }
    public class MainViewModel : INotifyPropertyChanged
    {
        private int count; public event PropertyChangedEventHandler? PropertyChanged;
        public int Count { get => count; set { count = value; PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Count))); } }
        public ICommand AddCommand { get; }
        public MainViewModel() { AddCommand = new RelayCommand(_ => Count++, _ => Count < 5); }
    }
    public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); DataContext = new MainViewModel(); } }
}`;

  const SL_PARAM_XAML = `<!-- 같은 명령, 다른 CommandParameter -->
<Button Content="−10" CommandParameter="-10"
        Command="{Binding ChangeCommand}"/>
<Button Content="+1"  CommandParameter="1"
        Command="{Binding ChangeCommand}"/>
<Button Content="+10" CommandParameter="10"
        Command="{Binding ChangeCommand}"/>`;

  const SL_PARAM_CS = `ChangeCommand = new RelayCommand(Change, CanChange);

void Change(object? p)
{
    Count += ToStep(p);          // p = "10" (문자열)
}
bool CanChange(object? p)
{
    int next = Count + ToStep(p);
    return next >= 0 && next <= 100;
}
static int ToStep(object? p) =>
    int.TryParse(p as string, out int s) ? s : 0;`;

  const SL_TODO_VM = `public class MainViewModel : ViewModelBase
{
    private string newTitle = "";
    private TodoItem? selected;
    public ObservableCollection<TodoItem> Todos { get; } = new();
    public string NewTitle { get => newTitle; set => SetProperty(ref newTitle, value); }
    public TodoItem? SelectedTodo { get => selected; set => SetProperty(ref selected, value); }
    public int RemainingCount => Todos.Count(t => !t.IsDone);
    public ICommand AddCommand { get; }
    public ICommand DeleteCommand { get; }

    public MainViewModel()
    {
        AddCommand = new RelayCommand(_ => AddTodo(), _ => !string.IsNullOrWhiteSpace(NewTitle));
        DeleteCommand = new RelayCommand(_ => Todos.Remove(SelectedTodo!), _ => SelectedTodo != null);
        Todos.CollectionChanged += (s, e) =>                 // ① 목록 알림
        {
            if (e.NewItems != null)
                foreach (TodoItem t in e.NewItems)           // ② 항목 알림 구독
                    t.PropertyChanged += (s2, e2) => OnPropertyChanged(nameof(RemainingCount));
            OnPropertyChanged(nameof(RemainingCount));
        };
    }
    private void AddTodo()
    {
        Todos.Add(new TodoItem { Title = NewTitle.Trim() });
        NewTitle = "";
    }
}`;

  const SL_TEST = `using System; using System.Windows.Input;

class RelayCommand : ICommand
{
    private readonly Action execute; private readonly Func<bool> canExecute;
    public RelayCommand(Action e, Func<bool> c) { execute = e; canExecute = c; }
    public bool CanExecute(object? p) => canExecute();
    public void Execute(object? p) => execute();
    public event EventHandler? CanExecuteChanged { add { } remove { } }   // 콘솔에서는 쓰지 않음
}
class LoginViewModel
{
    public string UserName { get; set; } = "";
    public string Message { get; private set; } = "";
    public ICommand LoginCommand { get; }
    public LoginViewModel() =>
        LoginCommand = new RelayCommand(() => Message = $"{UserName}님 환영합니다", () => UserName.Length >= 2);
}
class Program
{
    static void Main()
    {
        var vm = new LoginViewModel();                       // 창 없이 ViewModel 만
        Console.WriteLine($"빈 이름 → 로그인 가능? {vm.LoginCommand.CanExecute(null)}");
        vm.UserName = "하늘";
        Console.WriteLine($"'하늘' → 로그인 가능? {vm.LoginCommand.CanExecute(null)}");
        vm.LoginCommand.Execute(null);
        Console.WriteLine(vm.Message);
    }
}`;

  const SNIP_BEFORE_AFTER = `<pre><code>// 18장 방식: 속성 하나에 5~6줄
public int Age
{
    get { return age; }
    set
    {
        if (age == value) return;
        age = value;
        OnPropertyChanged();
    }
}

// ViewModelBase 를 물려받으면: 한 줄
public int Age { get =&gt; age; set =&gt; SetProperty(ref age, value); }</code></pre>`;

  CS_COURSE.addChapter({
    id: 'ch20',
    no: '20',
    title: 'MVVM 패턴',
    subtitle: 'Model · View · ViewModel',
    summary: '화면(View)과 로직을 떼어 놓는 WPF 의 대표 설계 방식인 MVVM 을 배웁니다. 코드 비하인드에 모든 것을 넣을 때의 문제를 확인하고, Model · View · ViewModel 의 역할과 “아는 방향”, 알림 코드를 모은 ViewModelBase(OnPropertyChanged · SetProperty), 입력 속성과 계산 속성, DataContext 연결 방법과 폴더 구조를 익힙니다. 이어서 ICommand 를 직접 구현한 RelayCommand 로 Click 처리기를 없애고, CanExecute · CommandParameter · ObservableCollection · 항목 알림을 이용해 추가 · 삭제 · 완료 표시 · 남은 개수가 되는 할 일 목록 앱을 단계별로 완성한 뒤, ViewModel 을 화면 없이 콘솔에서 테스트해 봅니다.',
    goals: [
      'MVVM 의 세 역할(Model · View · ViewModel)과 서로 “아는” 방향을 설명할 수 있다',
      'ViewModelBase(OnPropertyChanged · SetProperty)를 만들어 속성 알림 코드를 줄일 수 있다',
      '입력 속성과 계산 속성으로 ViewModel 을 설계하고 DataContext 로 View 와 연결할 수 있다',
      'ICommand 를 구현한 RelayCommand 를 만들어 버튼을 ViewModel 의 명령에 바인딩할 수 있다',
      'CanExecute 와 CommandParameter 로 버튼의 활성 상태와 동작을 제어할 수 있다',
      'ObservableCollection 과 항목 알림으로 할 일 목록 앱을 MVVM 으로 완성할 수 있다',
      'ViewModel 이 화면과 독립적이어서 콘솔에서 테스트할 수 있음을 설명할 수 있다'
    ],
    sections: [
      /* ===================== ch20-1 ===================== */
      {
        id: 'ch20-1',
        title: 'MVVM 의 구조와 ViewModel',
        minutes: 50,
        goals: [
          '코드 비하인드에 모든 것을 넣을 때의 문제를 설명할 수 있다',
          'Model · View · ViewModel 의 역할과 연결 방법(바인딩 · 명령 · 알림)을 설명할 수 있다',
          'ViewModelBase 에 OnPropertyChanged 와 SetProperty&lt;T&gt; 를 만들어 쓸 수 있다',
          '입력 속성이 바뀔 때 관련 계산 속성도 함께 알릴 수 있다',
          '코드 비하인드와 XAML 두 가지 방법으로 DataContext 에 ViewModel 을 연결할 수 있다'
        ],
        flow: [['도입: 코드 비하인드 BMI 계산기의 문제', 7], ['MVVM 세 역할 · 아는 방향', 10], ['ViewModelBase · SetProperty · 카운터', 10], ['계산 속성 · BMI · 성적 계산기', 10], ['View 연결 · 폴더 구조', 6], ['퀴즈 · 실습 안내', 7]],
        content: [
          { type: 'h', text: '코드 비하인드에 모든 것을 넣으면' },
          { type: 'p', html: '지금까지 만든 WPF 프로그램은 대부분 <code>MainWindow.xaml.cs</code>(코드 비하인드)에 모든 코드가 들어 있었습니다. 버튼 처리기 안에서 <b>TextBox 를 읽고 → 검사하고 → 계산하고 → TextBlock 에 쓰는</b> 방식입니다. 작은 프로그램은 이렇게 해도 빨리 만들 수 있습니다. 먼저 이 방식으로 만든 BMI(체질량 지수) 계산기를 보겠습니다.' },
          { type: 'code', title: '예제 20-1. 코드 비하인드에 모두 넣은 BMI 계산기 (비교용)', code: EX_BEFORE, desc: '<code>ShowBmi()</code> 한 메서드 안에 ① 컨트롤에서 읽기, ② 계산, ③ 판정, ④ 컨트롤에 쓰기가 모두 섞여 있습니다. 잘 동작하지만, “키 170 · 몸무게 65 이면 정상이 나오는가?” 를 확인하려면 <b>창을 띄우고 직접 입력해 봐야</b> 합니다. 계산 규칙(②③)만 따로 떼어 부를 방법이 없기 때문입니다.' },
          { type: 'list', items: [
            '<b>테스트하기 어렵다</b>: 계산이 맞는지 보려면 매번 창을 띄워 손으로 입력해야 합니다. 경우의 수가 20가지면 20번 입력해야 합니다.',
            '<b>화면과 로직이 뒤엉킨다</b>: 키 입력을 TextBox 에서 Slider 로 바꾸면 <code>txtHeight.Text</code> 를 쓰는 계산 코드도 함께 고쳐야 합니다.',
            '<b>다시 쓰기 어렵다</b>: 같은 계산을 다른 창에서도 쓰려면 코드를 복사해야 합니다.',
            '<b>함께 일하기 어렵다</b>: 화면을 꾸미는 사람과 로직을 짜는 사람이 같은 파일을 동시에 고치게 됩니다.'
          ] },
          { type: 'h', text: 'MVVM — 세 역할로 나누기' },
          { type: 'p', html: '<b>MVVM</b> 은 <b>Model–View–ViewModel</b> 의 줄임말로, WPF 프로그램을 세 역할로 나누는 설계 방식(디자인 패턴, design pattern)입니다. 18장에서 배운 <b>데이터 바인딩</b>과 <b>INotifyPropertyChanged</b> 가 바로 MVVM 의 재료이고, 18장 마스터-디테일 예제의 <code>MainViewModel</code> 이 ViewModel 의 맛보기였습니다. 이번 장에서는 이것을 제대로 정리합니다.' },
          { type: 'figure', html: SVG_MVVM, caption: 'View 는 바인딩과 명령으로 ViewModel 을 쓰고, ViewModel 은 Model 을 쓴다. 반대 방향은 알림(PropertyChanged)으로만 전달된다' },
          { type: 'table', head: ['역할', '하는 일', '이 장의 예', '알면 안 되는 것'], rows: [
            ['<b>View</b> (뷰)', '화면 모양. 컨트롤 배치 · 색 · 글꼴. <code>{Binding}</code> 으로 ViewModel 과 연결', '<code>MainWindow.xaml</code> (+ 거의 빈 코드 비하인드)', '계산 규칙 · 데이터 저장 방법'],
            ['<b>ViewModel</b> (뷰모델)', '화면에 보여 줄 <b>속성</b>과 화면이 시킬 <b>명령</b>을 제공. 입력 검사 · 계산 · 상태 관리', '<code>MainViewModel.cs</code>', 'View 의 컨트롤 (<code>txtName</code>, <code>Button</code> …)'],
            ['<b>Model</b> (모델)', '프로그램이 다루는 <b>데이터</b>와 업무 규칙, 파일 · DB 저장', '<code>Product.cs</code>, <code>TodoItem.cs</code>', 'ViewModel · View 가 있다는 사실']
          ], caption: 'MVVM 의 세 역할 — 오른쪽 열이 “지켜야 할 경계”' },
          { type: 'callout', kind: 'info', title: 'MVVM 의 가장 중요한 규칙: ViewModel 은 View 를 모른다', html: '<ul><li>ViewModel 파일에는 <code>using System.Windows.Controls;</code> 가 <b>없어야</b> 합니다. <code>txtHeight.Text</code> 처럼 컨트롤 이름을 쓰지 않습니다.</li><li>ViewModel 은 “값이 바뀌었다” 고 <b>알리기만</b> 하고(<code>PropertyChanged</code>), 그 값을 어느 컨트롤이 어떻게 보여 줄지는 View 의 바인딩이 정합니다.</li><li>그래서 View 를 통째로 바꿔도(TextBox → Slider) ViewModel 은 그대로이고, ViewModel 은 창 없이도 만들어 시험해 볼 수 있습니다(20-2 의 콘솔 테스트).</li><li>메시지 상자를 띄우는 일도 원칙적으로 View 쪽 일입니다. 처음에는 너무 엄격하게 지키려 하지 말고, <b>계산 · 검사 · 상태는 ViewModel 에</b> 라는 것부터 지켜 보세요.</li></ul>' },
          { type: 'h', text: 'ViewModelBase — 알림 코드를 한곳에' },
          { type: 'p', html: '18장에서는 클래스마다 <code>PropertyChanged</code> 이벤트와 <code>OnPropertyChanged()</code> 메서드를 매번 새로 썼습니다. ViewModel 이 여러 개가 되면 같은 코드가 반복됩니다. 그래서 이 코드를 <b>추상 부모 클래스</b> <code>ViewModelBase</code> 에 한 번만 쓰고, 모든 ViewModel 이 물려받게 합니다.' },
          { type: 'list', items: [
            '<code>OnPropertyChanged([CallerMemberName] string? propertyName = null)</code>: 18장과 같습니다. 속성 안에서 부르면 이름이 자동으로 들어갑니다.',
            '<code>SetProperty&lt;T&gt;(ref T field, T value)</code>: ① 새 값이 기존 값과 <b>같으면</b> 아무것도 안 하고 <code>false</code>, ② 다르면 필드에 저장하고 알린 뒤 <code>true</code> 를 돌려줍니다.',
            '<code>ref T field</code>: 필드의 <b>값</b>이 아니라 필드 <b>자체</b>를 넘겨서 메서드 안에서 그 필드를 바꿀 수 있게 합니다. <code>T</code> 는 제네릭 형식 매개변수라 <code>int</code> · <code>string</code> · <code>bool</code> 등 어떤 형식의 속성에도 쓸 수 있습니다.',
            '<code>EqualityComparer&lt;T&gt;.Default.Equals(a, b)</code>: 형식 <code>T</code> 에 맞는 방법으로 두 값이 같은지 비교합니다(<code>==</code> 는 제네릭 <code>T</code> 에 쓸 수 없음).'
          ] },
          { type: 'p', html: '속성 코드가 이렇게 짧아집니다.' + SNIP_BEFORE_AFTER },
          { type: 'code', title: '예제 20-2. ViewModelBase 와 첫 MVVM — 카운터', code: EX_COUNTER, desc: '파일이 세 개로 나뉘었습니다. <code>ViewModelBase.cs</code> 는 알림 도구, <code>CounterViewModel.cs</code> 는 화면의 상태(<code>Count</code>)와 규칙(“0 아래로 내려가지 않음”), XAML 은 모양만 담당합니다. <code>Count</code> 의 set 에서 <code>SetProperty</code> 가 <code>true</code> 를 돌려줄 때만 <code>Message</code> 도 바뀌었다고 알립니다. 아직 코드 비하인드에 Click 처리기 세 개가 남아 있지만, 처리기는 <code>vm.Increase()</code> 처럼 <b>ViewModel 에 일을 시키기만</b> 합니다. 이 처리기들도 20-2 교시에 <b>명령(Command)</b> 으로 없앱니다.' },
          { type: 'h', text: '계산 속성 — 재료가 바뀌면 결과도 알린다' },
          { type: 'p', html: 'ViewModel 의 속성은 보통 두 종류입니다. 사용자가 고치는 <b>입력 속성</b>(set 있음, TextBox 와 TwoWay)과, 입력으로 계산하는 <b>결과 속성</b>(get 만 있는 계산 속성)입니다. 결과 속성은 set 이 없으므로 스스로 알릴 수 없습니다. 그래서 <b>입력 속성의 set 에서 결과 속성도 함께 알려야</b> 합니다. 예제 20-1 의 BMI 계산기를 MVVM 으로 다시 만들어 봅시다.' },
          { type: 'code', title: '예제 20-3. BMI 계산기 — MVVM 으로 다시 만들기', code: EX_BMI, desc: '코드 비하인드는 <code>DataContext = new MainViewModel();</code> 한 줄뿐이고, <code>x:Name</code> 도 “계산” 버튼도 없습니다. 입력 칸에 한 글자를 칠 때마다 ① <code>HeightText</code> 의 set 이 불리고, ② <code>SetProperty</code> 가 값을 저장하고, ③ <code>NotifyResults()</code> 가 <code>Bmi</code> · <code>BmiText</code> · <code>Category</code> 가 바뀌었다고 알리면, ④ 바인딩이 새 값을 읽어 화면을 고칩니다. 키 칸을 지워 보면 “숫자로 입력하세요” 가 나옵니다. 판정 규칙이 모두 ViewModel 속성이므로, 창 없이 <code>new MainViewModel { HeightText = "170", WeightText = "65" }.Category</code> 만으로 결과를 확인할 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '입력을 string 속성으로 받는 이유', html: 'TextBox 를 <code>double</code> 속성에 바로 바인딩하면, 빈칸이나 <code>abc</code> 처럼 숫자로 바꿀 수 없는 글자는 원본에 <b>전달되지 않습니다</b>(18장). 그러면 ViewModel 은 사용자가 잘못 입력했다는 사실조차 모릅니다. 입력을 <code>string</code> 으로 받고 ViewModel 에서 <code>double.TryParse</code> 로 검사하면, “숫자로 입력하세요” 같은 <b>안내 문구도 ViewModel 이 정할 수 있고</b>, 그 규칙도 테스트할 수 있습니다. 숫자만 고르는 입력은 Slider(예제 20-4)처럼 처음부터 숫자인 컨트롤을 쓰면 됩니다.' },
          { type: 'p', html: '계산 속성이 여러 단계로 이어질 때도 원리는 같습니다. 점수 → 총점 → 평균 → 등급처럼 연결되어 있으면, 재료가 바뀔 때 <b>이어진 결과 모두</b>를 알려야 합니다. <code>SetProperty</code> 가 돌려주는 <code>bool</code> 을 쓰면 “값이 실제로 바뀌었을 때만” 알릴 수 있습니다.' },
          { type: 'code', title: '예제 20-4. 성적 계산기 — 이어진 계산 속성 알리기', code: EX_SCORE, desc: '슬라이더 세 개가 <code>Korean</code> · <code>English</code> · <code>Science</code> 에 TwoWay 로 연결되어 있습니다(Slider 의 double 값은 int 속성으로 자동 변환). 점수가 바뀌면 <code>NotifyResults()</code> 가 <code>Total</code> · <code>Average</code> · <code>Grade</code> 를 모두 알립니다. <code>OnPropertyChanged(nameof(Grade));</code> 한 줄을 지우고 실행해 보세요. 총점과 평균은 바뀌는데 등급만 <b>처음 값에 멈춰</b> 있습니다. 계산 속성의 알림을 빠뜨렸을 때 흔히 보는 증상입니다.' },
          { type: 'callout', kind: 'warn', title: '계산 속성에서 자주 하는 실수', html: '<ul><li>계산 속성(<code>public int Total =&gt; …;</code>)에는 set 이 없으므로 <code>SetProperty</code> 를 쓸 수 없습니다. <b>재료 속성의 set 에서</b> <code>OnPropertyChanged(nameof(Total))</code> 을 부릅니다.</li><li>알림 이름은 문자열 <code>"Total"</code> 보다 <code>nameof(Total)</code> 로 쓰세요. 속성 이름을 바꿀 때 컴파일러가 함께 찾아 줍니다.</li><li>재료가 여러 개면 알림 코드를 <code>NotifyResults()</code> 같은 메서드 하나로 모아 두어야 빠뜨리지 않습니다.</li></ul>' },
          { type: 'h', text: 'View 와 ViewModel 연결하기' },
          { type: 'p', html: 'View 가 어떤 ViewModel 을 쓸지는 <b>DataContext</b> 로 정합니다. 방법은 두 가지입니다.' },
          { type: 'table', head: ['방법', '코드', '특징'], rows: [
            ['<b>코드 비하인드</b>에서', '<code>InitializeComponent();</code><br><code>DataContext = new MainViewModel();</code>', '가장 흔함. 생성자에 값을 넘기거나(<code>new MainViewModel(파일경로)</code>) 코드에서 ViewModel 을 다시 쓸 때 편하다'],
            ['<b>XAML</b> 에서', '<code>&lt;Window.DataContext&gt;</code><br><code>&nbsp;&nbsp;&lt;vm:MainViewModel/&gt;</code><br><code>&lt;/Window.DataContext&gt;</code>', '코드 비하인드가 완전히 빈다. XAML 편집기가 ViewModel 형식을 알게 되어 <code>{Binding </code> 입력 시 속성 이름이 자동 완성된다. 단, ViewModel 에 <b>매개변수 없는 public 생성자</b>가 있어야 한다']
          ], caption: 'DataContext 에 ViewModel 을 넣는 두 가지 방법' },
          { type: 'p', html: 'XAML 에서 내 클래스를 쓰려면 18장의 변환기처럼 <code>xmlns:접두사="clr-namespace:네임스페이스"</code> 를 선언합니다. 다음 예제는 파일을 <b>Models</b> · <b>ViewModels</b> 폴더로 나누고, 폴더마다 네임스페이스(<code>OrderForm.Models</code>, <code>OrderForm.ViewModels</code>)를 따로 둔 실제 프로젝트 구조입니다.' },
          { type: 'code', title: '예제 20-5. 주문서 — XAML 에서 DataContext 연결 + 폴더 구조', code: EX_ORDER, desc: '<code>xmlns:vm="clr-namespace:OrderForm.ViewModels"</code> 로 접두사 <code>vm</code> 을 만들고, <code>&lt;Window.DataContext&gt;&lt;vm:MainViewModel/&gt;&lt;/Window.DataContext&gt;</code> 로 창이 만들어질 때 ViewModel 도 만들어지게 했습니다. 그래서 코드 비하인드에는 <code>InitializeComponent();</code> 만 남았습니다. <code>Product</code>(Model)는 이름과 단가만 가진 순수한 데이터이고, <code>MainViewModel</code> 이 “선택한 상품 · 수량 · 회원 여부” 라는 <b>화면의 상태</b>와 금액 계산을 맡습니다. <code>{Binding SelectedProduct.UnitPrice}</code> 처럼 ViewModel 을 거쳐 Model 의 속성을 보여 줄 수도 있습니다. 상품 · 수량 · 회원 할인을 바꿔 보세요.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 MVVM 폴더 구조 만들기', html: '<ul><li><b>솔루션 탐색기</b>에서 프로젝트 이름을 오른쪽 클릭 → <b>추가</b> → <b>새 폴더</b> 로 <code>Models</code>, <code>ViewModels</code> 폴더를 만듭니다(필요하면 <code>Views</code> 도).</li><li>폴더를 오른쪽 클릭 → <b>추가</b> → <b>클래스</b>(<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>)로 파일을 만들면, 네임스페이스가 <code>OrderForm.ViewModels</code> 처럼 <b>폴더 이름을 따라</b> 자동으로 붙습니다.</li><li>XAML 에 <code>xmlns:vm="</code> 까지 입력하면 IntelliSense 가 네임스페이스 목록을 보여 줍니다. 새로 만든 클래스가 목록에 없으면 먼저 <b>빌드</b>(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)하세요.</li><li><code>MainWindow.xaml</code> 을 <code>Views</code> 폴더로 옮긴다면 ① <code>x:Class</code> 와 코드 비하인드의 네임스페이스, ② <code>App.xaml</code> 의 <code>StartupUri="Views/MainWindow.xaml"</code> 를 함께 고쳐야 합니다. 이 강좌의 예제는 간단하게 <code>MainWindow</code> 를 프로젝트 맨 위에 둡니다.</li><li>코드 비하인드 방식을 쓰면서도 자동 완성을 받고 싶다면 창에 <code>d:DataContext="{d:DesignInstance vm:MainViewModel}"</code> 를 적습니다(디자이너 전용).</li></ul>' },
          { type: 'h', text: '코드 비하인드 vs MVVM — 한눈에 비교' },
          { type: 'table', head: ['항목', '예제 20-1 (코드 비하인드)', '예제 20-3 (MVVM)'], rows: [
            ['계산 규칙이 있는 곳', '<code>MainWindow.xaml.cs</code> 의 처리기 안', '<code>MainViewModel</code> 의 속성'],
            ['화면 읽기 · 쓰기', '<code>txtHeight.Text</code>, <code>txtBmi.Text = …</code> 직접', '바인딩이 자동으로 (<code>x:Name</code> 없음)'],
            ['계산 시점', '“계산” 버튼을 누를 때', '입력이 바뀔 때마다 (알림)'],
            ['TextBox → Slider 로 바꾸면', '계산 코드도 수정', 'XAML 만 수정'],
            ['규칙 테스트', '창을 띄워 손으로 입력', '<code>new MainViewModel()</code> 만으로 코드에서 확인'],
            ['처음 만들 때', '빠르고 간단', '파일이 늘고 준비 코드(ViewModelBase)가 필요']
          ], caption: '작은 창 하나면 코드 비하인드도 괜찮지만, 화면이 많아지고 오래 고쳐 나갈 프로그램일수록 MVVM 이 유리하다' }
        ],
        practice: [
          {
            title: '실습 20-1. 양방향 온도 변환기 ViewModel',
            level: 2,
            desc: '<p><b>섭씨 칸</b>을 고치면 화씨가, <b>화씨 칸</b>을 고치면 섭씨가 바뀌는 온도 변환기의 ViewModel 을 완성하세요. XAML 과 코드 비하인드는 완성되어 있습니다.</p><ul><li><code>CelsiusText</code> · <code>FahrenheitText</code>: string 입력 속성 (TextBox 와 TwoWay)</li><li>섭씨가 숫자면 화씨 = 섭씨 × 9 / 5 + 32, 화씨가 숫자면 섭씨 = (화씨 − 32) × 5 / 9 (소수 한 자리까지, <code>ToString("0.#")</code>)</li><li><code>Description</code>: “20°C : 활동하기 좋은 날씨” 처럼 온도와 설명 (0 이하 · 25 미만 · 그 이상 / 숫자가 아니면 “숫자를 입력하세요”)</li></ul>',
            hint: '반대쪽 값을 바꿀 때 <b>속성(set)이 아니라 필드</b>(<code>fahrenheitText = …</code>)에 넣고 <code>OnPropertyChanged(nameof(FahrenheitText))</code> 로 직접 알리세요. 속성을 쓰면 화씨의 set 이 다시 섭씨를 계산하는 “핑퐁” 이 일어납니다. set 맨 앞의 <code>if (!SetProperty(ref celsiusText, value)) return;</code> 은 같은 값이 들어올 때 아무것도 하지 않게 막아 줍니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION
          },
          {
            title: '실습 20-2. 장바구니 합계 ViewModel',
            level: 2,
            desc: '<p>사과 · 우유 · 식빵의 개수를 슬라이더로 고르면 상품 금액 · 배송비 · 합계 · 무료 배송 안내가 바로 바뀌는 장바구니를 완성하세요. XAML 은 완성되어 있습니다.</p><ul><li>입력 속성: <code>AppleCount</code> · <code>MilkCount</code> · <code>BreadCount</code> (값이 바뀌면 <code>NotifyTotals()</code>)</li><li>계산 속성: <code>Subtotal</code>(개수 × 가격의 합), <code>ShippingFee</code>(0원이거나 20,000원 이상이면 0, 아니면 3,000), <code>Total</code>, <code>ShippingMessage</code></li><li>처음 화면(3 · 2 · 1개): 상품 11,600원 · 배송비 3,000원 · 합계 14,600원 · “8,400원 더 담으면 무료 배송”</li></ul>',
            hint: '<code>set { if (SetProperty(ref appleCount, value)) NotifyTotals(); }</code>. 계산 속성은 서로를 이용해도 됩니다: <code>Total =&gt; Subtotal + ShippingFee</code>. 금액 서식은 <code>$"{FreeShippingLimit - Subtotal:N0}원 더 담으면 무료 배송"</code>. 알림 네 개 중 하나를 빼고 실행해 어느 칸이 멈추는지 확인해 보세요.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: 'MVVM 에서 <b>ViewModel 이 하면 안 되는 일</b>은?', options: ['속성이 바뀌었다고 PropertyChanged 로 알리기', '입력값이 숫자인지 검사하기', '<code>txtName.Text</code> 처럼 View 의 컨트롤에 직접 접근하기', '입력으로 결과를 계산하는 계산 속성 제공하기'], answer: 2, explain: 'ViewModel 은 View 를 모릅니다. 컨트롤을 직접 만지지 않고 속성과 알림만 제공하며, 화면에 어떻게 보일지는 View 의 바인딩이 정합니다.' },
          { q: '<code>SetProperty(ref count, value)</code> 가 <code>false</code> 를 돌려주는 경우는?', options: ['항상 false 를 돌려준다', '새 값이 기존 필드 값과 같을 때', '속성 이름이 틀렸을 때', '구독한 바인딩이 없을 때'], answer: 1, explain: '값이 같으면 저장도 알림도 하지 않고 false, 달라서 저장하고 알렸으면 true 를 돌려줍니다. 이 반환값으로 “바뀌었을 때만 계산 속성 알림” 을 할 수 있습니다.' },
          { q: '다음 ViewModel 에서 슬라이더로 <code>Quantity</code> 를 바꾸면 화면은?<pre><code>public int Quantity\n{\n    get =&gt; quantity;\n    set =&gt; SetProperty(ref quantity, value);\n}\npublic int Total =&gt; Quantity * 3500;</code></pre>', options: ['수량과 합계가 모두 바뀐다', '컴파일 오류가 난다', '예외가 발생한다', '수량은 바뀌지만 합계는 처음 값 그대로다'], answer: 3, explain: 'SetProperty 는 Quantity 만 알립니다. 계산 속성 Total 은 set 이 없으므로 Quantity 의 set 에서 <code>OnPropertyChanged(nameof(Total))</code> 을 함께 불러야 합니다.' },
          { q: 'XAML 에서 <code>&lt;Window.DataContext&gt;&lt;vm:MainViewModel/&gt;&lt;/Window.DataContext&gt;</code> 로 연결하려면 꼭 필요한 것은?', options: ['MainViewModel 에 매개변수 없는 public 생성자가 있어야 한다', 'MainViewModel 이 Window 를 상속해야 한다', 'MainViewModel 에 x:Name 을 붙여야 한다', '코드 비하인드에서 DataContext 를 한 번 더 넣어야 한다'], answer: 0, explain: 'XAML 은 <code>new MainViewModel()</code> 처럼 인수 없이 객체를 만듭니다. 그리고 <code>xmlns:vm="clr-namespace:…"</code> 선언도 필요합니다.' },
          { q: '다음 중 코드 비하인드에 모든 코드를 넣는 방식의 <b>단점이 아닌</b> 것은?', options: ['계산 규칙만 따로 떼어 테스트하기 어렵다', '작은 프로그램을 빠르게 만들 수 있다', '컨트롤을 바꾸면 계산 코드도 고쳐야 한다', '같은 로직을 다른 창에서 다시 쓰기 어렵다'], answer: 1, explain: '빠르고 간단한 것은 코드 비하인드 방식의 장점입니다. 창 하나짜리 작은 도구라면 그렇게 만들어도 괜찮습니다.' }
        ],
        slides: [
          { layout: 'title', title: 'MVVM 의 구조와 ViewModel', subtitle: 'Chapter 20 · Section 01 — 화면과 로직을 떼어 놓기', badge: '20-1',
            notes: '<p><b>[도입 2분]</b> “지금까지 만든 프로그램에서 계산이 맞는지 확인하려면 어떻게 했나요?” → 창을 띄우고 직접 입력. “입력 경우가 100가지라면?” 으로 문제의식을 만듭니다.</p><p>오늘 목표: MVVM 세 역할, ViewModelBase, 계산 속성, DataContext 연결. 18장의 바인딩 · INotifyPropertyChanged 를 전제로 하므로 기억나지 않는 학생은 18장 예제 18-4 를 다시 보게 합니다.</p>' },
          { layout: 'two', title: '코드 비하인드 vs MVVM', left: { title: '코드 비하인드에 모두 (예제 20-1)', bullets: ['처리기 안에서 읽기 · 계산 · 쓰기', '<code>txtHeight.Text</code> 등 컨트롤 이름에 의존', '테스트 = 창 띄우고 손으로 입력', '작은 도구는 빠르고 간단'] }, right: { title: 'MVVM (예제 20-3)', bullets: ['계산 · 검사는 ViewModel 속성', 'XAML 은 <code>{Binding}</code> 으로 연결만', '코드 비하인드 = DataContext 한 줄', '<code>new MainViewModel()</code> 로 코드 테스트'] },
            notes: '<p><b>[5분]</b> 예제 20-1 을 실행해 보여 준 뒤, <code>ShowBmi()</code> 의 ①~④ 주석을 짚으며 “이 중 프로그램의 진짜 규칙은 어디인가?” 를 묻습니다(②③). 그 규칙이 컨트롤 코드 사이에 끼어 있다는 점이 핵심입니다.</p><p>“코드 비하인드 = 나쁜 것” 이 아니라 “커지면 불편해진다” 로 균형 있게 설명하세요.</p>' },
          { layout: 'diagram', title: 'MVVM — 세 역할과 아는 방향', html: SVG_MVVM, caption: 'View → ViewModel → Model 한 방향으로만 “안다”. 거꾸로는 알림(PropertyChanged)으로만',
            notes: '<p><b>[6분]</b> 식당 비유: View = 홀(손님이 보는 곳), ViewModel = 주문받는 직원(주문을 정리해 주방에 전달하고 음식이 나오면 알림), Model = 주방 · 창고(재료와 조리 규칙). 주방은 홀 인테리어를 몰라도 요리할 수 있다.</p><p>화살표 방향을 꼭 짚습니다. ① 바인딩, ② 명령(다음 교시), ③ 알림. “ViewModel 이 txtName 을 부르면 안 되는 이유?” 를 발문합니다.</p>' },
          { layout: 'table', title: '세 역할 정리', head: ['역할', '하는 일', '예'], rows: [['View', '화면 모양 · <code>{Binding}</code> 연결', '<code>MainWindow.xaml</code>'], ['ViewModel', '화면용 속성 · 명령 · 검사 · 계산', '<code>MainViewModel.cs</code>'], ['Model', '데이터 · 업무 규칙 · 저장', '<code>Product.cs</code>, <code>TodoItem.cs</code>']],
            lead: 'ViewModel 은 View 를 모르고, Model 은 ViewModel 을 모른다',
            notes: '<p><b>[3분]</b> 본문 표의 “알면 안 되는 것” 열을 함께 읽습니다. ViewModel 파일에 <code>using System.Windows.Controls;</code> 가 보이면 경계를 넘었다는 신호라고 알려 줍니다.</p>' },
          { layout: 'code', title: 'ViewModelBase — SetProperty 로 한 줄 속성', code: SL_BASE, points: ['알림 코드를 <b>추상 부모</b>에 한 번만', '<code>SetProperty(ref 필드, 값)</code>: 다를 때만 저장 + 알림', '같은 값이면 알림 없음 → <code>false</code>', '콘솔에서도 동작 = 화면과 무관'],
            notes: '<p><b>[6분]</b> 콘솔로 실행하면 “알림: Count = 1”, “알림: Count = 2” 두 줄만 나옵니다. 가운데 <code>vm.Count = 1;</code> 은 같은 값이라 알림이 없다는 점을 확인합니다.</p><p><code>ref</code> 는 “필드 자체를 빌려준다”, <code>T</code> 는 “어떤 형식이든” 으로 짧게 설명합니다. 제네릭이 어려운 학생에게는 “int 버전을 모든 형식용으로 한 번에 만든 것” 이라고 말해 주세요.</p>' },
          { layout: 'code', title: '예제 20-2. 첫 MVVM — 카운터', code: SL_COUNTER, points: ['<code>DataContext = vm;</code> 으로 연결', '처리기는 <code>vm.Count++</code> — 일은 ViewModel 이', '<code>Message</code> 는 계산 속성 → 함께 알림', '처리기도 다음 교시에 명령으로'],
            notes: '<p><b>[5분]</b> 슬라이드 코드는 한 파일에 줄였습니다. 본문 예제 20-2 는 <code>ViewModelBase.cs</code> · <code>CounterViewModel.cs</code> 로 나뉜 구조이니 함께 보여 주세요.</p><p>발문: “0 아래로 내려가지 않게 하는 규칙은 어디에 둬야 할까?” → ViewModel (<code>Decrease()</code>).</p>' },
          { layout: 'code', title: '계산 속성 — 재료가 바뀌면 결과도 알린다', code: SL_TOTAL, points: ['입력 속성 <code>Quantity</code> (Slider 와 TwoWay)', '계산 속성 <code>Total</code> 은 set 이 없다', '→ Quantity 의 set 에서 <code>Notify(nameof(Total))</code>', '이 줄을 지우면 합계가 멈춘다'],
            notes: '<p><b>[6분]</b> 실행 후 <code>Notify(nameof(Total));</code> 를 지우고 다시 실행 → 수량은 바뀌는데 합계가 멈추는 것을 보여 줍니다. 가장 흔한 MVVM 버그입니다.</p><p>이어서 본문 예제 20-3(BMI MVVM)과 20-4(성적 계산기)를 시연합니다. BMI 는 입력을 string 으로 받아 ViewModel 에서 검사하는 이유를, 성적은 NotifyResults() 로 알림을 모으는 방법을 강조합니다.</p>' },
          { layout: 'code', title: 'XAML 에서 DataContext 연결하기', code: SL_XAMLDC, points: ['<code>xmlns:local="clr-namespace:…"</code>', '<code>&lt;Window.DataContext&gt;</code> 안에 ViewModel 객체', '매개변수 없는 생성자 필요', '코드 비하인드 = <code>InitializeComponent()</code> 뿐'],
            notes: '<p><b>[4분]</b> 코드 비하인드 방식(<code>DataContext = new …</code>)과 결과가 같다는 것을 확인합니다. XAML 방식은 VS 가 형식을 알아 <code>{Binding </code> 입력 시 자동 완성이 된다는 장점이 있습니다.</p><p>본문 예제 20-5(주문서)는 Models · ViewModels 폴더와 네임스페이스까지 나눈 실제 구조입니다.</p>' },
          { layout: 'bullets', title: 'Visual Studio 프로젝트 구조', lead: '역할별로 폴더를 나누면 파일이 많아져도 찾기 쉽다', bullets: ['<code>Models/</code> — <code>Product.cs</code>, <code>TodoItem.cs</code> (데이터)', '<code>ViewModels/</code> — <code>ViewModelBase.cs</code>, <code>MainViewModel.cs</code>', '<code>MainWindow.xaml</code> (View) — 필요하면 <code>Views/</code>', '폴더에서 클래스 추가 → 네임스페이스 <code>앱이름.ViewModels</code> 자동', 'XAML: <code>xmlns:vm="clr-namespace:앱이름.ViewModels"</code>'],
            notes: '<p><b>[3분]</b> VS 에서 폴더 만들기 → 클래스 추가를 직접 시연합니다. 새 클래스를 XAML 에서 쓰기 전에 빌드해야 한다는 점, MainWindow 를 Views 로 옮기면 App.xaml 의 StartupUri 도 바꿔야 한다는 점을 알려 줍니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Quantity</code> 의 set 에서 <code>SetProperty</code> 만 부르고, <code>Total =&gt; Quantity * 3500</code> 이다. 수량을 바꾸면?', options: ['수량과 합계가 모두 바뀐다', '컴파일 오류', '예외 발생', '수량만 바뀌고 합계는 그대로'], answer: 3, explain: '계산 속성은 스스로 알릴 수 없으므로 재료 속성의 set 에서 <code>OnPropertyChanged(nameof(Total))</code> 을 함께 불러야 합니다.',
            notes: '<p>답 확인 후 “그럼 재료가 세 개면?” → 세 set 모두에서 알림, 또는 NotifyResults() 로 모으기.</p>' },
          { layout: 'practice', title: '실습 20-1. 양방향 온도 변환기', desc: '<p>섭씨 칸을 고치면 화씨가, 화씨 칸을 고치면 섭씨가 바뀌게 <code>MainViewModel</code> 을 완성하세요. <code>Description</code> 은 “20°C : 활동하기 좋은 날씨” 형식입니다.</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[실습]</b> 반대쪽 값은 <b>필드</b>에 넣고 직접 알려야 “핑퐁” 이 생기지 않는다는 점이 핵심입니다. 막히는 학생에게는 먼저 한쪽(섭씨 → 화씨)만 완성하게 하세요.</p><p>빨리 끝난 학생은 실습 20-2(장바구니 합계)로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['MVVM = View(화면) · ViewModel(화면용 속성 · 규칙) · Model(데이터)', 'View → ViewModel → Model 한 방향으로만 안다. 거꾸로는 알림', '<code>ViewModelBase</code>: <code>OnPropertyChanged</code> + <code>SetProperty&lt;T&gt;</code>', '계산 속성은 재료 속성의 set 에서 함께 알린다', 'DataContext 연결: 코드 비하인드 한 줄 또는 <code>&lt;Window.DataContext&gt;</code>'],
            notes: '<p>학습 목표를 다시 확인합니다. 다음 시간: 코드 비하인드에 남은 Click 처리기까지 없애는 <b>명령(ICommand)</b> 과 RelayCommand, 그리고 할 일 목록 앱 완성.</p>' }
        ]
      },

      /* ===================== ch20-2 ===================== */
      {
        id: 'ch20-2',
        title: '명령(ICommand) 과 컬렉션 — 할 일 목록 앱',
        minutes: 50,
        goals: [
          'ICommand 의 세 멤버(Execute · CanExecute · CanExecuteChanged)를 설명할 수 있다',
          'RelayCommand 를 직접 구현하고 버튼의 Command 에 바인딩할 수 있다',
          'CommandParameter 로 명령에 값을 넘기고, CanExecute 로 버튼을 자동으로 켜고 끌 수 있다',
          'ObservableCollection · SelectedItem · 항목의 INotifyPropertyChanged 로 할 일 앱을 완성할 수 있다',
          'ViewModel 을 콘솔 프로그램에서 테스트할 수 있다'
        ],
        flow: [['도입: 남은 Click 처리기 없애기', 3], ['ICommand · RelayCommand', 12], ['CommandParameter · CanExecute', 7], ['할 일 앱 단계별 완성', 16], ['ViewModel 테스트', 6], ['퀴즈 · 실습 안내', 6]],
        content: [
          { type: 'h', text: '이벤트 처리기 대신 명령' },
          { type: 'p', html: '예제 20-2 의 카운터에는 아직 <code>BtnUp_Click</code> 같은 Click 처리기가 코드 비하인드에 남아 있었습니다. 처리기가 하는 일은 <code>vm.Increase()</code> 한 줄뿐인데도, View 가 ViewModel 의 메서드 이름을 알아야 합니다. 17장에서는 <code>ApplicationCommands.Save</code> 같은 <b>명령(Command)</b> 을 버튼의 <code>Command</code> 속성에 연결하고 <code>CommandBinding</code> 으로 처리기를 등록했습니다. 그런데 <code>CommandBinding</code> 도 결국 창(코드 비하인드)에 등록합니다.' },
          { type: 'p', html: 'MVVM 에서는 <b>명령 객체 자체를 ViewModel 의 속성</b>으로 만듭니다. 그러면 버튼은 <code>Command="{Binding AddCommand}"</code> 처럼 다른 속성과 똑같이 <b>바인딩</b>으로 명령을 찾아갑니다. 코드 비하인드에는 처리기가 하나도 필요 없습니다.' },
          { type: 'h', text: 'ICommand 인터페이스' },
          { type: 'p', html: '버튼의 <code>Command</code> 속성에 넣을 수 있는 것은 <code>ICommand</code> 인터페이스(<code>System.Windows.Input</code> 네임스페이스)를 구현한 객체입니다. 멤버는 세 개뿐입니다.' },
          { type: 'table', head: ['멤버', '누가 · 언제 부르나', '하는 일'], rows: [
            ['<code>void Execute(object? parameter)</code>', '버튼을 <b>클릭</b>했을 때 버튼이', '실제로 할 일. <code>parameter</code> 는 버튼의 <code>CommandParameter</code> 값'],
            ['<code>bool CanExecute(object? parameter)</code>', '버튼이 “지금 눌러도 돼?” 하고 <b>수시로</b>', '<code>false</code> 를 돌려주면 버튼이 저절로 <b>비활성(회색)</b>'],
            ['<code>event EventHandler? CanExecuteChanged</code>', '명령 쪽에서 발생시킴', '“CanExecute 결과가 바뀌었을 수 있으니 <b>다시 물어봐</b>” 신호']
          ], caption: 'ICommand 의 세 멤버' },
          { type: 'figure', html: SVG_CMD, caption: '① 클릭하면 Execute, ② 버튼은 CanExecute 로 활성 여부를 묻고, ③ CommandManager 의 신호가 오면 ④ 다시 묻는다' },
          { type: 'h', text: 'RelayCommand 직접 만들기' },
          { type: 'p', html: '명령마다 <code>ICommand</code> 를 구현한 클래스를 따로 만들면 너무 많아집니다. 그래서 “실행할 메서드” 와 “실행 가능 여부 메서드” 를 <b>대리자(delegate)</b> 로 받아 두었다가 대신 불러 주는 범용 클래스 하나를 만듭니다. 이 클래스를 흔히 <b>RelayCommand</b>(전달 명령) 또는 DelegateCommand 라고 부릅니다.' },
          { type: 'list', items: [
            '<code>Action&lt;object?&gt; execute</code>: 매개변수 하나를 받고 반환값이 없는 메서드 → <code>Execute</code> 가 대신 부른다.',
            '<code>Func&lt;object?, bool&gt;? canExecute</code>: 매개변수 하나를 받아 <code>bool</code> 을 돌려주는 메서드 → <code>CanExecute</code> 가 대신 부른다. 생략하면(null) 항상 실행 가능.',
            '<code>CanExecuteChanged</code> 는 WPF 의 <code>CommandManager.RequerySuggested</code> 이벤트에 그대로 연결합니다. WPF 는 키 입력 · 클릭 같은 <b>입력이 있을 때마다</b> 이 이벤트를 발생시키므로, 버튼들이 알아서 <code>CanExecute</code> 를 다시 묻습니다(17장의 CanExecute 와 같은 원리).',
            'ViewModel 에서는 <code>public ICommand AddCommand { get; }</code> 로 속성을 만들고, 생성자에서 <code>AddCommand = new RelayCommand(실행, 가능여부);</code> 로 한 번 만들어 둡니다.'
          ] },
          { type: 'code', title: '예제 20-6. RelayCommand 와 CommandParameter — Click 처리기 없는 카운터', code: EX_CMD_COUNTER, desc: '코드 비하인드에 Click 처리기가 <b>하나도 없습니다</b>. 버튼 네 개가 모두 같은 <code>ChangeCommand</code> 를 쓰고, <code>CommandParameter</code> 로 <code>"-10"</code> · <code>"-1"</code> · <code>"1"</code> · <code>"10"</code> 을 넘깁니다. 이 값은 <code>Change(object? parameter)</code> 와 <code>CanChange(object? parameter)</code> 의 매개변수로 들어옵니다. 처음 값이 5 라서 <b>−10 버튼은 꺼져 있고</b>, +1 을 다섯 번 누르면 켜집니다. 100 가까이 올리면 +10 · +1 이 차례로 꺼집니다. <code>IsEnabled</code> 를 고치는 코드는 어디에도 없습니다. “0 으로” 버튼의 명령은 람다식 <code>_ =&gt; Count = 0</code> 으로 짧게 썼습니다(<code>_</code> 는 “매개변수를 쓰지 않음” 표시).' },
          { type: 'callout', kind: 'tip', title: 'CommandParameter 는 문자열로 들어온다', html: '<code>CommandParameter="10"</code> 처럼 XAML 에 직접 쓴 값은 숫자가 아니라 <b>문자열 <code>"10"</code></b> 입니다. 그래서 <code>int.TryParse(parameter as string, out int step)</code> 로 바꿔 씁니다. <code>CommandParameter="{Binding}"</code> 처럼 바인딩을 쓰면 객체(예: 목록의 항목)를 그대로 넘길 수도 있습니다. XAML 에서는 <code>CommandParameter</code> 를 <code>Command</code> 보다 먼저 적어 두면, 버튼이 처음 <code>CanExecute</code> 를 물을 때부터 매개변수가 들어 있어 안전합니다.' },
          { type: 'callout', kind: 'info', title: 'CanExecute 를 WPF 가 “알아서” 다시 묻는 원리', html: '<code>RelayCommand</code> 의 <code>CanExecuteChanged</code> 를 <code>CommandManager.RequerySuggested</code> 에 연결했기 때문입니다. WPF 는 입력(키 · 마우스 · 포커스 이동)이 끝날 때마다 이 신호를 보내고, 버튼은 신호를 받으면 <code>CanExecute</code> 를 다시 부릅니다. 반대로 <b>입력 없이</b> 상태가 바뀌는 경우(타이머 · 비동기 작업이 끝났을 때)에는 버튼이 모르고 지나갈 수 있으므로 <code>CommandManager.InvalidateRequerySuggested();</code> 를 불러 직접 신호를 보냅니다. <code>CommandManager</code> 는 WPF 에만 있는 기능이라, 다른 UI 프레임워크나 콘솔에서는 예제 20-10 처럼 <code>CanExecuteChanged</code> 를 직접 발생시키는 방식을 씁니다.' },
          { type: 'h', text: '할 일 목록 앱 — 단계별로 완성하기' },
          { type: 'p', html: '이제 명령과 18장의 <code>ObservableCollection</code> 을 함께 써서 할 일 목록 앱을 만듭니다. 17장 예제 17-12 에서 라우트된 명령으로 만든 “할 일 추가 · 삭제” 를, 이번에는 모든 상태와 규칙을 ViewModel 에 넣어 MVVM 으로 만듭니다. 완성된 앱에서 화면의 각 부분이 ViewModel 의 무엇과 연결되는지 먼저 봅시다.' },
          { type: 'figure', html: SVG_TODO, caption: '완성된 할 일 앱: 컨트롤마다 ViewModel 의 속성(실선) 또는 명령(점선)과 연결된다' },
          { type: 'h', text: '1단계 — 추가하기 (입력이 비면 버튼 꺼짐)' },
          { type: 'code', title: '예제 20-7. 할 일 앱 ① — ObservableCollection 과 AddCommand', code: EX_TODO1, desc: '처음에는 입력 칸이 비어 있어 <b>추가 버튼이 꺼져</b> 있습니다. 한 글자를 입력하면 ① TwoWay 바인딩이 <code>NewTitle</code> 을 바꾸고, ② 입력이 끝나 WPF 가 “다시 물어봐” 신호를 보내면, ③ 버튼이 <code>CanAddTodo()</code> 를 다시 불러 <code>true</code> 를 받고 켜집니다. 추가 버튼을 누르면 <code>AddTodo()</code> 가 <code>Todos.Add(…)</code> 로 목록에 넣고(<code>ObservableCollection</code> 이라 목록 화면과 “할 일 N개” 가 바로 바뀜), <code>NewTitle = "";</code> 로 입력 칸을 비웁니다. 입력 칸을 비우는 코드가 <code>txtTitle.Text = ""</code> 가 아니라 <b>속성 대입</b>이라는 점에 주목하세요. 스페이스만 입력하면 버튼이 켜지지 않습니다(<code>IsNullOrWhiteSpace</code>).' },
          { type: 'h', text: '2단계 — 선택하고 삭제하기' },
          { type: 'p', html: 'ListBox 의 <code>SelectedItem</code> 을 ViewModel 의 <code>SelectedTodo</code> 에 <b>TwoWay</b> 로 바인딩하면(18장 마스터-디테일), 사용자가 고른 항목이 ViewModel 에 들어옵니다. 삭제 명령은 “고른 항목이 있을 때만” 실행할 수 있게 합니다.' },
          { type: 'code', title: '예제 20-8. 할 일 앱 ② — SelectedItem 바인딩과 DeleteCommand', code: EX_TODO2, desc: '처음에는 아무것도 고르지 않아 <b>“선택 삭제” 가 꺼져</b> 있습니다. 항목을 클릭하면 <code>SelectedTodo</code> 가 그 항목이 되고 버튼이 켜집니다. 삭제하면 <code>Todos.Remove(SelectedTodo)</code> 로 컬렉션에서 지우고 <code>SelectedTodo = null</code> 로 선택을 풀어 버튼이 다시 꺼집니다. ViewModel 은 ListBox 가 있다는 것도, 몇 번째 줄을 클릭했는지도 모릅니다. <b>“지금 고른 할 일” 이라는 상태만</b> 압니다.' },
          { type: 'h', text: '3단계 — 완료 표시 · 남은 개수 · 지우기 명령' },
          { type: 'p', html: '이제 항목마다 체크박스를 달고, <b>남은 일 개수</b>를 보여 줍니다. 여기서 알림이 <b>두 종류</b> 필요합니다.' },
          { type: 'list', ordered: true, items: [
            '<b>목록 알림</b> — 항목이 추가 · 삭제되면 <code>ObservableCollection</code> 이 <code>CollectionChanged</code> 이벤트를 보냅니다. 목록 화면은 이것으로 바뀌지만, 개수를 세는 계산 속성(<code>RemainingCount</code>)은 ViewModel 이 이 이벤트를 받아 <b>직접 다시 알려야</b> 합니다.',
            '<b>항목 알림</b> — 체크박스를 누르면 항목 하나의 <code>IsDone</code> 만 바뀝니다. 컬렉션 자체는 그대로이므로 <code>CollectionChanged</code> 는 오지 않습니다. 그래서 <code>TodoItem</code> 도 <code>INotifyPropertyChanged</code> 를 구현하고, ViewModel 이 <b>각 항목의 PropertyChanged 를 구독</b>해서 <code>IsDone</code> 이 바뀌면 남은 개수를 다시 알립니다.'
          ] },
          { type: 'code', title: '예제 20-9. 할 일 앱 ③ 완성 — 완료 표시 · 남은 개수 · 모두 지우기', code: EX_TODO3, desc: '체크박스를 누르면 <code>TodoItem.IsDone</code> 이 바뀌고(TwoWay) → <code>TodoItem</code> 의 알림을 구독하던 <code>Todo_PropertyChanged</code> 가 → <code>NotifyCounts()</code> 로 “남은 일 N개” 를 고칩니다. 동시에 “완료 지우기” 버튼도 켜집니다(<code>Todos.Any(t =&gt; t.IsDone)</code>). 항목을 추가하면 <code>Todos_CollectionChanged</code> 가 새 항목의 알림을 구독하므로, 새로 넣은 할 일의 체크박스도 개수에 반영됩니다. 생성자에서 <b>구독을 먼저 하고 나서</b> 처음 항목을 넣었다는 순서에 주의하세요. 파일은 <code>Models/</code> · <code>ViewModels/</code> 폴더와 네임스페이스로 나누었습니다. 이 앱은 P05 프로젝트(WPF 할 일 관리)의 뼈대가 됩니다.' },
          { type: 'callout', kind: 'warn', title: 'foreach 로 돌면서 같은 컬렉션을 지우면 예외', html: '<code>foreach (var t in Todos) if (t.IsDone) Todos.Remove(t);</code> 는 실행 중에 <code>InvalidOperationException</code>(컬렉션이 수정되었습니다)이 납니다. 지울 항목을 <code>Todos.Where(t =&gt; t.IsDone).ToList()</code> 로 <b>먼저 복사</b>한 뒤, 그 복사본을 돌며 지우세요. 참고로 <code>Todos.Clear()</code> 는 한 번에 모두 지우는데, 이때 오는 알림(Reset)에는 <code>OldItems</code> 가 없어서 개별 구독 해제는 되지 않습니다. 지운 항목은 더 이상 쓰지 않으므로 이 예제에서는 문제가 되지 않습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — CommunityToolkit.Mvvm', html: '실무에서는 <code>ViewModelBase</code> · <code>RelayCommand</code> 를 직접 만들지 않고 Microsoft 가 만든 NuGet 패키지 <b>CommunityToolkit.Mvvm</b> 을 많이 씁니다. <code>ObservableObject</code>(= 우리의 ViewModelBase), <code>RelayCommand</code> 가 들어 있고, 소스 생성기로 코드를 더 줄여 줍니다.<pre><code>public partial class MainViewModel : ObservableObject\n{\n    [ObservableProperty] private string newTitle = "";   // NewTitle 속성 자동 생성\n\n    [RelayCommand]                                        // AddTodoCommand 자동 생성\n    private void AddTodo() { … }\n}</code></pre>도구가 무엇을 대신 만들어 주는지 알려면 오늘처럼 직접 만들어 본 경험이 꼭 필요합니다. 이 강좌의 예제는 패키지 없이 동작하도록 직접 만든 클래스를 씁니다.' },
          { type: 'h', text: 'ViewModel 은 화면 없이 테스트할 수 있다' },
          { type: 'p', html: 'MVVM 의 가장 큰 장점은 ViewModel 이 <b>View 를 모른다</b>는 것입니다. 그래서 창을 띄우지 않고도 ViewModel 객체를 만들어 “사용자가 입력하고 버튼을 누른 것처럼” 속성을 바꾸고 명령을 실행한 뒤, 결과가 맞는지 코드로 확인할 수 있습니다. 이렇게 작은 단위의 코드가 맞게 동작하는지 자동으로 확인하는 것을 <b>단위 테스트(unit test)</b> 라고 합니다. 다음은 할 일 ViewModel 을 <b>콘솔 프로그램</b>에서 시험하는 예입니다.' },
          { type: 'code', title: '예제 20-10. 콘솔에서 ViewModel 테스트하기', code: EX_TEST, expect: '[통과] 처음에는 입력이 비어 추가할 수 없다\n    (알림) NewTitle\n[통과] 제목을 입력하면 추가할 수 있다\n    (알림) NewTitle\n    (알림) RemainingCount\n[통과] 추가하면 목록은 1개, 입력 칸은 빈칸\n[통과] 남은 일은 1개\n    (알림) RemainingCount\n[통과] 완료하면 남은 일은 0개\n[통과] 이미 완료한 일은 다시 완료할 수 없다\n결과: 6개 중 6개 통과\n', desc: 'WPF 창도, 컨트롤도 없는 평범한 콘솔 프로그램입니다. <code>ICommand</code> · <code>INotifyPropertyChanged</code> · <code>ObservableCollection</code> 은 WPF 가 아니라 .NET 기본 라이브러리에 들어 있어서 콘솔에서도 쓸 수 있습니다. <code>Main</code> 이 <b>사용자 역할</b>을 합니다. <code>vm.NewTitle = "우유 사기";</code> 는 입력 칸에 쓴 것, <code>vm.AddCommand.Execute(null);</code> 은 추가 버튼을 누른 것과 같습니다. <code>PropertyChanged</code> 를 구독해 출력한 “(알림)” 줄은 WPF 였다면 바인딩이 받았을 알림입니다. 콘솔에는 <code>CommandManager</code> 가 없으므로 이 <code>RelayCommand</code> 는 <code>RaiseCanExecuteChanged()</code> 로 직접 신호를 보냅니다. 규칙을 일부러 틀리게 바꿔(예: <code>CanExecute</code> 조건 삭제) 실행하면 <code>[실패]</code> 가 나옵니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 진짜 단위 테스트 프로젝트 만들기', html: '<ol><li><b>솔루션 탐색기</b>에서 솔루션을 오른쪽 클릭 → <b>추가</b> → <b>새 프로젝트</b> → <b>MSTest 테스트 프로젝트</b>(또는 xUnit)를 고릅니다. 프레임워크는 WPF 프로젝트와 같은 .NET 버전으로 합니다.</li><li>테스트 프로젝트의 <code>.csproj</code> 에서 <code>&lt;TargetFramework&gt;</code> 를 <code>net9.0-windows</code> 로 바꿉니다(WPF 프로젝트를 참조하려면 필요).</li><li>테스트 프로젝트의 <b>종속성</b>을 오른쪽 클릭 → <b>프로젝트 참조 추가</b> → WPF 앱 프로젝트를 체크합니다.</li><li><code>[TestMethod]</code> 메서드 안에서 <code>var vm = new MainViewModel(); vm.NewTitle = "우유"; vm.AddCommand.Execute(null); Assert.AreEqual(1, vm.Todos.Count);</code> 처럼 씁니다.</li><li><b>테스트</b> → <b>테스트 탐색기</b>(<kbd>Ctrl</kbd>+<kbd>E</kbd>, <kbd>T</kbd>)에서 <b>모두 실행</b>하면 통과는 초록, 실패는 빨강으로 표시됩니다.</li></ol>' },
          { type: 'table', head: ['', 'Click 처리기 (코드 비하인드)', '명령 (MVVM)'], rows: [
            ['연결', '<code>Click="BtnAdd_Click"</code>', '<code>Command="{Binding AddCommand}"</code>'],
            ['할 일이 있는 곳', '창 클래스의 메서드', 'ViewModel 의 메서드 (RelayCommand 가 대신 호출)'],
            ['버튼 켜고 끄기', '<code>btnAdd.IsEnabled = …</code> 를 곳곳에서', '<code>CanExecute</code> 한 곳 — WPF 가 수시로 물어봄'],
            ['값 넘기기', '<code>sender</code> · <code>Tag</code> 로 꺼내기', '<code>CommandParameter</code>'],
            ['테스트', '창을 띄워 클릭', '<code>vm.AddCommand.Execute(null)</code>']
          ], caption: 'Click 처리기와 명령 비교' }
        ],
        practice: [
          {
            title: '실습 20-3. 연락처 관리 MVVM',
            level: 2,
            desc: '<p>이름과 전화번호를 입력해 연락처를 추가하고, 목록에서 골라 삭제하는 창의 <code>MainViewModel</code> 을 완성하세요. XAML · <code>Contact</code> · <code>ViewModelBase</code> · <code>RelayCommand</code> 는 완성되어 있습니다.</p><ul><li><code>NewName</code> · <code>NewPhone</code> · <code>SelectedContact</code> 를 <code>SetProperty</code> 로</li><li><code>AddCommand</code>: 이름과 전화가 <b>모두</b> 입력되었을 때만 켜짐. 누르면 추가하고, 새 연락처를 선택하고, 입력 칸 두 개를 비움</li><li><code>DeleteCommand</code>: 고른 연락처가 있을 때만 켜짐. 누르면 삭제하고 선택 해제</li><li>코드 비하인드에 Click 처리기를 만들지 말 것</li></ul>',
            hint: '<code>AddCommand = new RelayCommand(_ =&gt; AddContact(), _ =&gt; !string.IsNullOrWhiteSpace(NewName) &amp;&amp; !string.IsNullOrWhiteSpace(NewPhone));</code>. 입력 칸을 비울 때는 <code>NewName = "";</code> 처럼 <b>속성</b>에 대입해야 알림이 가서 TextBox 도 비워집니다(필드 <code>newName = ""</code> 로 하면 화면은 그대로). 도전: 전화번호가 숫자와 <code>-</code> 로만 되어 있을 때만 추가되게 해 보세요.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 20-4. 점수판 — CommandParameter 와 CanExecute',
            level: 2,
            desc: '<p>두 팀의 점수판을 만드세요. 두 “+1 점” 버튼은 <b>같은 명령</b>(<code>AddPointCommand</code>)을 쓰고 <code>CommandParameter</code> 로 <code>"Blue"</code> · <code>"Red"</code> 를 넘깁니다(XAML 완성).</p><ul><li><code>StatusText</code>: “블루팀 승리!” · “레드팀 승리!” · “동점” · “블루팀 리드” · “레드팀 리드” (점수가 바뀌면 함께 알림)</li><li>한 팀이 5점이 되면 경기 끝 → 두 “+1 점” 버튼이 <b>모두 꺼짐</b></li><li>“새 경기”: 두 점수를 0 으로. 두 점수가 모두 0 이면 꺼짐</li></ul>',
            hint: '<code>AddPointCommand = new RelayCommand(AddPoint, _ =&gt; !IsGameOver);</code>, <code>private void AddPoint(object? parameter) { string team = parameter as string ?? ""; if (team == "Blue") BlueScore++; … }</code>. 점수 속성의 set: <code>if (SetProperty(ref blueScore, value)) OnPropertyChanged(nameof(StatusText));</code>',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '다음 중 <code>ICommand</code> 인터페이스의 멤버가 <b>아닌</b> 것은?', options: ['<code>Execute</code>', '<code>CanExecute</code>', '<code>CanExecuteChanged</code>', '<code>Click</code>'], answer: 3, explain: 'ICommand 의 멤버는 Execute · CanExecute · CanExecuteChanged 세 개입니다. Click 은 버튼의 이벤트입니다.' },
          { q: '<code>&lt;Button CommandParameter="10" Command="{Binding ChangeCommand}"/&gt;</code> 을 누르면 <code>Execute(object? parameter)</code> 의 <code>parameter</code> 에는 무엇이 들어오나?', options: ['int 값 10', '문자열 "10"', 'null', 'double 값 10.0'], answer: 1, explain: 'XAML 에 직접 쓴 CommandParameter 는 문자열입니다. 숫자로 쓰려면 int.TryParse 등으로 바꿔야 합니다.' },
          { q: '명령의 <code>CanExecute</code> 가 <code>false</code> 를 돌려주면 그 명령에 바인딩된 버튼은?', options: ['자동으로 비활성(회색)이 되어 누를 수 없다', '보통처럼 보이지만 눌러도 아무 일이 없다', '화면에서 사라진다', 'InvalidOperationException 이 발생한다'], answer: 0, explain: '버튼은 CanExecute 결과로 자기 IsEnabled 를 정합니다. 그래서 IsEnabled 를 직접 바꾸는 코드가 필요 없습니다.' },
          { q: '할 일 앱에서 체크박스로 <code>IsDone</code> 을 바꿨는데 “남은 일 N개” 가 그대로다. 가장 알맞은 원인은?', options: ['ObservableCollection 대신 List 를 써서', 'RelayCommand 에 canExecute 를 넘기지 않아서', 'ViewModel 이 각 항목의 PropertyChanged 를 구독해 RemainingCount 를 다시 알리지 않아서', 'DataContext 를 XAML 에서 설정해서'], answer: 2, explain: '항목 하나의 속성이 바뀌어도 컬렉션의 CollectionChanged 는 오지 않습니다. 항목(TodoItem)이 알림을 보내고, ViewModel 이 그것을 구독해 계산 속성을 다시 알려야 합니다.' },
          { q: 'ViewModel 을 창 없이 콘솔 프로그램에서 테스트할 수 있는 가장 중요한 이유는?', options: ['콘솔 프로그램도 WPF 창을 띄울 수 있어서', 'ViewModel 이 View(컨트롤)를 참조하지 않아서', 'ICommand 는 콘솔 전용 인터페이스라서', 'INotifyPropertyChanged 가 화면을 자동으로 만들어 줘서'], answer: 1, explain: 'ViewModel 은 속성 · 명령 · 알림만 가지고 컨트롤을 모르기 때문에, 코드가 사용자 대신 속성을 바꾸고 명령을 실행해 결과를 확인할 수 있습니다.' }
        ],
        slides: [
          { layout: 'title', title: '명령(ICommand) 과 컬렉션', subtitle: 'Chapter 20 · Section 02 — 할 일 목록 앱을 MVVM 으로', badge: '20-2',
            notes: '<p><b>[도입 3분]</b> 예제 20-2 의 코드 비하인드를 다시 보여 주며 “처리기 세 개가 남았다. 이것도 없앨 수 있을까?” 로 시작합니다.</p><p>17장의 <code>ApplicationCommands.Save</code> + <code>CommandBinding</code> 을 떠올리게 하고, 오늘은 명령 객체를 ViewModel 속성으로 만든다고 예고합니다. 오늘의 결과물: 할 일 목록 앱.</p>' },
          { layout: 'table', title: 'ICommand — 멤버 세 개', head: ['멤버', '역할'], rows: [['<code>Execute(p)</code>', '클릭했을 때 할 일 (p = CommandParameter)'], ['<code>CanExecute(p)</code>', '지금 실행해도 되나? false → 버튼 비활성'], ['<code>CanExecuteChanged</code>', '“다시 물어봐” 신호 (이벤트)']],
            lead: '버튼의 Command 속성에는 ICommand 객체를 넣는다',
            notes: '<p><b>[4분]</b> 버튼 입장에서 설명합니다: “누르면 Execute 를 부르고, 수시로 CanExecute 를 물어 내가 켜질지 꺼질지 정한다. 언제 다시 물어볼지는 CanExecuteChanged 가 알려 준다.”</p>' },
          { layout: 'diagram', title: '명령이 동작하는 흐름', html: SVG_CMD, caption: '클릭 → Execute → ViewModel 메서드 / CommandManager 신호 → CanExecute 다시 물어봄',
            notes: '<p><b>[4분]</b> ①~④ 번호를 따라 설명합니다. RelayCommand 는 “심부름꾼”: 버튼의 요청을 ViewModel 의 메서드로 전달(relay)할 뿐 스스로 판단하지 않는다.</p><p>CommandManager 는 입력이 끝날 때마다 신호를 보낸다 → 그래서 글자를 칠 때마다 추가 버튼이 켜지고 꺼진다.</p>' },
          { layout: 'code', title: 'RelayCommand 직접 만들기', code: SL_RELAY, points: ['<code>Action&lt;object?&gt;</code> = 실행할 일', '<code>Func&lt;object?, bool&gt;</code> = 실행 가능 여부', '<code>CanExecuteChanged</code> → <code>CommandManager.RequerySuggested</code>', '<code>Command="{Binding AddCommand}"</code>'],
            notes: '<p><b>[6분]</b> 5 까지 누르면 버튼이 저절로 꺼지는 것을 확인합니다. <code>_ =&gt; Count &lt; 5</code> 의 <code>_</code> 는 매개변수를 쓰지 않는다는 표시입니다.</p><p>RelayCommand 는 앞으로 계속 복사해서 쓸 클래스입니다. 본문 예제 20-6 은 주석과 함께 여러 줄로 풀어 쓴 버전이니 학생들은 그것을 보고 입력하게 하세요.</p>' },
          { layout: 'two', title: 'CommandParameter — 같은 명령, 다른 값', left: { title: 'XAML', code: SL_PARAM_XAML, run: false }, right: { title: 'ViewModel', code: SL_PARAM_CS, run: false },
            notes: '<p><b>[5분]</b> 본문 예제 20-6 을 실행해 −10 버튼이 처음에 꺼져 있는 것, 100 근처에서 +10 이 꺼지는 것을 보여 줍니다.</p><p>“CommandParameter 로 들어오는 값의 형식은?” → 문자열. <code>(int)parameter</code> 로 바로 바꾸면 InvalidCastException 이 난다는 흔한 실수를 짚습니다.</p>' },
          { layout: 'diagram', title: '할 일 앱 — 화면과 ViewModel 의 연결', html: SVG_TODO, caption: '실선 = 속성 바인딩 · 점선 = 명령. 창에는 Click 처리기가 없다',
            notes: '<p><b>[3분]</b> 만들 앱의 완성 모습을 먼저 보여 주고 단계를 안내합니다: ① 추가(예제 20-7) → ② 선택 · 삭제(20-8) → ③ 완료 표시 · 남은 개수 · 지우기(20-9).</p>' },
          { layout: 'code', title: '할 일 ViewModel 의 핵심', code: SL_TODO_VM, run: false, points: ['<code>NewTitle</code> ↔ 입력 칸 · <code>SelectedTodo</code> ↔ 선택', 'CanExecute: 입력이 비면 · 선택이 없으면 꺼짐', '① 목록 알림 CollectionChanged', '② 항목 알림 PropertyChanged 구독'],
            notes: '<p><b>[10분]</b> 본문 예제 20-7 → 20-8 → 20-9 를 차례로 실행하며 이 코드가 어떻게 자라는지 보여 줍니다. 슬라이드 코드는 핵심만 모은 조각입니다.</p><p>시연 포인트: 빈 입력 → 추가 버튼 꺼짐 / 항목 선택 전 → 삭제 버튼 꺼짐 / 체크 → 남은 개수 감소 + 완료 지우기 켜짐.</p>' },
          { layout: 'bullets', title: '알림이 두 종류 필요하다', lead: '“남은 일 N개” 를 맞추려면', bullets: [['<b>목록 알림</b> — <code>CollectionChanged</code>', ['추가 · 삭제 때 ObservableCollection 이 보냄', '새 항목의 알림을 여기서 구독']], ['<b>항목 알림</b> — <code>TodoItem.PropertyChanged</code>', ['체크박스로 IsDone 이 바뀔 때', '컬렉션은 그대로라 CollectionChanged 는 안 옴']], '둘 다 받으면 <code>OnPropertyChanged(nameof(RemainingCount))</code>', '지울 때는 <code>.ToList()</code> 로 복사 후 삭제'],
            notes: '<p><b>[3분]</b> 발문: “체크박스를 눌렀을 때 ObservableCollection 이 알려 줄까?” → 아니다. 목록의 “구성” 이 바뀐 게 아니라 항목 하나의 “내용” 이 바뀐 것.</p><p>TodoItem 의 INotifyPropertyChanged 를 지우고 실행해 개수가 안 바뀌는 것을 보여 주면 확실히 이해합니다.</p>' },
          { layout: 'code', title: 'ViewModel 테스트 — 창 없이 콘솔에서', code: SL_TEST, points: ['ViewModel 은 컨트롤을 모른다 → 콘솔에서 생성', '<code>vm.UserName = …</code> = 입력한 것처럼', '<code>Execute(null)</code> = 버튼을 누른 것처럼', 'ICommand 는 .NET 기본 라이브러리'],
            notes: '<p><b>[5분]</b> 실행 결과: False → True → “하늘님 환영합니다”. 본문 예제 20-10 은 통과/실패를 세는 작은 테스트 프로그램입니다.</p><p>VS 의 MSTest 테스트 프로젝트와 테스트 탐색기를 짧게 보여 주면 “이게 실무에서 하는 방식” 이라는 동기 부여가 됩니다(vs 상자 참고).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '체크박스로 <code>IsDone</code> 을 바꿨는데 “남은 일 N개” 가 그대로다. 원인은?', options: ['List 를 써서', 'canExecute 를 안 넘겨서', '항목의 PropertyChanged 를 구독해 RemainingCount 를 알리지 않아서', 'DataContext 를 XAML 에서 설정해서'], answer: 2, explain: '항목의 속성 변화는 CollectionChanged 로 오지 않습니다. 항목 알림을 구독해 계산 속성을 다시 알려야 합니다.',
            notes: '<p>답 확인 후 “새로 추가한 항목도 구독되려면 어디서 구독해야 할까?” → CollectionChanged 의 NewItems.</p>' },
          { layout: 'practice', title: '실습 20-3. 연락처 관리 MVVM', desc: '<p>이름 · 전화 입력 → <code>AddCommand</code>(둘 다 입력했을 때만), 목록에서 선택 → <code>DeleteCommand</code>(선택했을 때만). Click 처리기 없이 <code>MainViewModel</code> 만 완성하세요.</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[실습]</b> 가장 흔한 실수: 입력 칸을 비울 때 필드(<code>newName = ""</code>)에 대입해 화면이 안 비워짐 → 속성에 대입해야 알림이 간다.</p><p>빨리 끝난 학생은 실습 20-4(점수판)와, 전화번호 형식 검사 도전 과제로.</p>' },
          { layout: 'summary', title: '정리', bullets: ['<code>ICommand</code> = Execute · CanExecute · CanExecuteChanged', '<code>RelayCommand</code>: 대리자로 ViewModel 메서드를 대신 호출', '<code>Command="{Binding …}"</code> + <code>CommandParameter</code> → Click 처리기 없음', 'CanExecute false → 버튼 자동 비활성 (CommandManager 가 다시 물어봄)', '목록 알림 + 항목 알림 → 남은 개수 갱신', 'ViewModel 은 View 를 모른다 → 콘솔 · 단위 테스트 가능'],
            notes: '<p>학습 목표를 확인합니다. 다음 장(21장): 메뉴 · 대화상자 · 다중 창. 오늘 만든 할 일 앱은 P05 프로젝트(WPF 할 일 관리)에서 파일 저장 · 필터 등을 더해 완성합니다.</p>' }
        ]
      }
    ]
  });
})();
