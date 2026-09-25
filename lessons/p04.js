/* Project 04. WPF 계산기 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* =====================================================================
   * 계산기 코드 만들기 — 단계별 예제가 같은 코드를 조금씩 키워 가므로 한곳에서 만든다
   *   stage: 1 화면 · 2 스타일 · 3 숫자 입력 · 4 지우기/부호 · 5 사칙연산 · 6 오류/% · 7 키보드 · 8 완성(기록)
   *   추가 기능(true = 완성, 'todo' = 실습 시작 코드): group(천 단위 쉼표) · autosize(글자 크기)
   *     repeatEq(= 반복) · disableOps(오류 때 연산자 끄기) · unary(1/x x² √x) · memory(MC MR M+ M−)
   * ===================================================================== */
  const Q = (cond, text) => (cond ? text : null);
  const L = (...xs) => xs.filter((x) => x !== null && x !== false && x !== undefined).join('\n');

  // [글자, 종류, 처리기 또는 Tag, 처리기가 붙는 단계]
  const PAD = [
    ['%', 'fn', 'Percent_Click', 6], ['CE', 'fn', 'ClearEntry_Click', 4], ['C', 'fn', 'Clear_Click', 4], ['⌫', 'fn', 'Back_Click', 4],
    ['7', 'd'], ['8', 'd'], ['9', 'd'], ['÷', 'op', '/'],
    ['4', 'd'], ['5', 'd'], ['6', 'd'], ['×', 'op', '*'],
    ['1', 'd'], ['2', 'd'], ['3', 'd'], ['−', 'op', '-'],
    ['±', 'fn', 'Negate_Click', 4], ['0', 'd'], ['.', 'pt'], ['+', 'op', '+']
  ];

  function padButton(b, st) {
    const [text, kind, x, need] = b;
    let a = `Content="${text}"`;
    if (kind === 'op' && st >= 5) a += ` Tag="${x}"`;
    if (st >= 2) a += ` Style="{StaticResource ${kind === 'd' || kind === 'pt' ? 'DigitButton' : kind === 'op' ? 'OpButton' : 'CalcButton'}}"`;
    else a += ' FontSize="18" Margin="2"';
    let click = null;
    if (kind === 'd' && st >= 3) click = 'Digit_Click';
    if (kind === 'pt' && st >= 3) click = 'Point_Click';
    if (kind === 'op' && st >= 5) click = 'Operator_Click';
    if (kind === 'fn' && st >= need) click = x;
    if (click) a += ` Click="${click}"`;
    return `            <Button ${a}/>`;
  }

  const STYLES = (keyboard) => `    <Window.Resources>
        <!-- 모든 계산기 버튼의 공통 모양 -->
        <Style x:Key="CalcButton" TargetType="Button">
            <Setter Property="FontSize" Value="18"/>
            <Setter Property="Margin" Value="2"/>
            <Setter Property="Background" Value="#F0F0F0"/>
            <Setter Property="BorderBrush" Value="#CCCCCC"/>${keyboard ? `
            <!-- 버튼이 키보드 포커스를 가져가지 않게: Enter 가 "마지막에 누른 버튼" 을 다시 누르지 않는다 -->
            <Setter Property="Focusable" Value="False"/>` : ''}
        </Style>
        <!-- 숫자 버튼 = 공통 모양 + 흰 바탕 · 굵은 글씨 -->
        <Style x:Key="DigitButton" TargetType="Button" BasedOn="{StaticResource CalcButton}">
            <Setter Property="Background" Value="White"/>
            <Setter Property="FontWeight" Value="Bold"/>
        </Style>
        <!-- 연산자 버튼 = 공통 모양 + 큰 파란 글씨 -->
        <Style x:Key="OpButton" TargetType="Button" BasedOn="{StaticResource CalcButton}">
            <Setter Property="FontSize" Value="22"/>
            <Setter Property="Foreground" Value="SteelBlue"/>
        </Style>
        <!-- = 버튼 = 공통 모양 + 파란 바탕 · 흰 글씨 -->
        <Style x:Key="EqualsButton" TargetType="Button" BasedOn="{StaticResource CalcButton}">
            <Setter Property="FontSize" Value="24"/>
            <Setter Property="Background" Value="SteelBlue"/>
            <Setter Property="Foreground" Value="White"/>
        </Style>
    </Window.Resources>`;

  function calcXaml(o) {
    const st = o.stage, extra = !!(o.unary || o.memory);
    const row = (n) => n + (extra && n > 0 ? 1 : 0);   // 추가 버튼 줄이 있으면 버튼판 · = 버튼이 한 줄씩 밀린다
    const eqAttr = st >= 2 ? 'Style="{StaticResource EqualsButton}"' : 'FontSize="18" Margin="2"';
    const exprBlock = `                <TextBlock x:Name="txtExpression" Foreground="#9FB3C8" FontSize="14" Height="20"
                           HorizontalAlignment="Right"/>
                <TextBlock x:Name="txtDisplay" Text="0" Foreground="White" FontSize="34" FontWeight="Bold"
                           Height="46" HorizontalAlignment="Right"/>`;
    const display = o.memory
      ? `        <!-- 표시 창: 위 = 식(왼쪽에 메모리 표시 M), 아래 = 지금 입력 중인 수 -->
        <Border Background="#1E2A38" CornerRadius="6" Padding="12,6" Margin="2,2,2,6">
            <Grid>
                <TextBlock x:Name="txtMemory" Text="M" Foreground="#FFD166" FontSize="14" FontWeight="Bold"
                           HorizontalAlignment="Left" VerticalAlignment="Top" Visibility="Hidden"/>
                <StackPanel>
${exprBlock.replace(/^/gm, '    ')}
                </StackPanel>
            </Grid>
        </Border>`
      : `        <!-- 표시 창: 위 = 식, 아래 = 지금 입력 중인 수 -->
        <Border Background="#1E2A38" CornerRadius="6" Padding="12,6" Margin="2,2,2,6">
            <StackPanel>
${exprBlock}
            </StackPanel>
        </Border>`;
    const extraRow = o.unary
      ? `        <!-- 추가 기능: 수 하나로 바로 계산하는 버튼 (Tag 로 종류 구분) -->
        <UniformGrid Grid.Row="1" Rows="1" Columns="3">
            <Button Content="1/x" Tag="inv" Style="{StaticResource CalcButton}" Click="Unary_Click"/>
            <Button Content="x²" Tag="sqr" Style="{StaticResource CalcButton}" Click="Unary_Click"/>
            <Button Content="√x" Tag="sqrt" Style="{StaticResource CalcButton}" Click="Unary_Click"/>
        </UniformGrid>`
      : o.memory
        ? `        <!-- 추가 기능: 메모리 버튼 (Tag 로 종류 구분) -->
        <UniformGrid Grid.Row="1" Rows="1" Columns="4">
            <Button Content="MC" Tag="MC" Style="{StaticResource CalcButton}" Click="Memory_Click"/>
            <Button Content="MR" Tag="MR" Style="{StaticResource CalcButton}" Click="Memory_Click"/>
            <Button Content="M+" Tag="M+" Style="{StaticResource CalcButton}" Click="Memory_Click"/>
            <Button Content="M−" Tag="M-" Style="{StaticResource CalcButton}" Click="Memory_Click"/>
        </UniformGrid>`
        : null;
    const history = st >= 8 ? `        <!-- 오른쪽 열: 계산 기록 -->
        <DockPanel Grid.Column="1" Grid.RowSpan="${extra ? 4 : 3}" Margin="8,2,0,2">
            <DockPanel DockPanel.Dock="Top" Margin="0,0,0,4">
                <Button DockPanel.Dock="Right" Content="지우기" Padding="8,2" Focusable="False"
                        Click="ClearHistory_Click"/>
                <TextBlock Text="기록" FontSize="15" FontWeight="Bold" VerticalAlignment="Center"/>
            </DockPanel>
            <ListBox x:Name="lstHistory" HorizontalContentAlignment="Stretch"
                     SelectionChanged="History_SelectionChanged">
                <ListBox.ItemTemplate>
                    <DataTemplate>
                        <StackPanel Margin="2,3">
                            <TextBlock Text="{Binding Expression}" Foreground="Gray" FontSize="12"
                                       TextWrapping="Wrap" HorizontalAlignment="Right"/>
                            <TextBlock Text="{Binding Result}" FontSize="17" FontWeight="Bold"
                                       HorizontalAlignment="Right"/>
                        </StackPanel>
                    </DataTemplate>
                </ListBox.ItemTemplate>
            </ListBox>
        </DockPanel>` : null;
    return L(
      '// ===== File: MainWindow.xaml =====',
      `<Window x:Class="${o.ns}.MainWindow"`,
      `        ${NS}`,
      `        Title="${o.title}" Width="${st >= 8 ? 520 : 340}" Height="460"${st >= 7 ? '\n        PreviewKeyDown="Window_PreviewKeyDown"' : ''}>`,
      Q(st >= 2, STYLES(st >= 7)),
      '    <Grid Margin="8">',
      Q(st >= 8, `        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*"/>
            <ColumnDefinition Width="170"/>
        </Grid.ColumnDefinitions>`),
      '        <Grid.RowDefinitions>',
      '            <RowDefinition Height="Auto"/>   <!-- 표시 창 -->',
      Q(extra, '            <RowDefinition Height="44"/>     <!-- 추가 기능 버튼 -->'),
      '            <RowDefinition Height="*"/>      <!-- 버튼판 -->',
      '            <RowDefinition Height="52"/>     <!-- = 버튼 -->',
      '        </Grid.RowDefinitions>',
      display,
      extraRow,
      '        <!-- 버튼판: UniformGrid 는 모든 칸을 같은 크기로 나눈다 (4열 × 5행 = 20칸, 순서대로 채움) -->',
      `        <UniformGrid x:Name="pad" Grid.Row="${row(1)}" Rows="5" Columns="4">`,
      PAD.map((b) => padButton(b, st)).join('\n'),
      '        </UniformGrid>',
      `        <Button${o.disableOps ? ' x:Name="btnEquals"' : ''} Grid.Row="${row(2)}" Content="=" ${eqAttr}${st >= 5 ? ' Click="Equals_Click"' : ''}/>`,
      history,
      '    </Grid>',
      '</Window>');
  }

  function calcCs(o) {
    const st = o.stage, f8 = st >= 8;
    const group = o.group || f8, autosize = o.autosize || f8;
    const e6 = st >= 6;
    const usings = L(
      Q(st >= 3, 'using System;'),
      Q(st >= 5 || group, 'using System.Globalization;'),
      'using System.Windows;',
      Q(st >= 3, 'using System.Windows.Controls;'),
      Q(st >= 7, 'using System.Windows.Input;'));

    const fields = st < 3 ? null : L(
      '        private const int MaxDigits = 16;      // 입력할 수 있는 최대 자릿수',
      '',
      '        // ── 계산기의 상태: 이 변수들의 값이 "지금 계산기가 어떤 상황인지" 를 모두 나타낸다 ──',
      '        private string entry = "0";        // 지금 입력 중인 수 (화면에 보이는 문자열)',
      '        private bool isNewEntry = true;    // true 면 다음 숫자 입력이 화면을 새로 시작한다',
      Q(st >= 5, '        private decimal storedValue;       // 연산자 앞의 수 (첫 번째 피연산자)'),
      Q(st >= 5, '        private string? pendingOp;         // 기다리는 연산자 "+" "-" "*" "/" (없으면 null)'),
      Q(e6, '        private bool hasError;             // 0 으로 나누기 · 넘침이 일어난 상태'),
      Q(e6, '        private string errorMessage = "";'),
      Q(o.repeatEq === true, '        private string? lastOp;            // = 반복용: 마지막으로 계산한 연산자와'),
      Q(o.repeatEq === true, '        private decimal lastOperand;       //            그때의 두 번째 피연산자'),
      Q(o.repeatEq === 'todo', '        // TODO 1: = 반복에 쓸 필드 두 개 — string? lastOp (마지막 연산자), decimal lastOperand (두 번째 피연산자)'),
      Q(o.memory === true, '        private decimal memory;            // 메모리에 저장한 수'),
      Q(o.memory === true, '        private bool hasMemory;            // 메모리에 수가 들어 있는가 (M 표시)'),
      Q(o.memory === 'todo', '        // TODO 1: 메모리 필드 두 개 — decimal memory (저장한 수), bool hasMemory (M 표시 여부)'));

    const ctor = st < 3
      ? `        public MainWindow()
        {
            InitializeComponent();   // ${st === 1 ? '단계 1 은 화면만 만든다: 버튼을 눌러도 아직 아무 일도 없다' : '단계 2 도 화면만: 버튼 모양을 스타일로 정리했다'}
        }`
      : `        public MainWindow()
        {
            InitializeComponent();
            UpdateDisplay();         // 처음 상태("0")를 화면에 그린다
        }`;

    /* ---------- 처리기: 버튼은 "무엇을 눌렀는지" 만 알려 주고 실제 동작은 아래 메서드가 한다 ---------- */
    const hDigit = `        // ── 버튼 처리기: 무엇을 눌렀는지만 알아내서 동작 메서드에 넘긴다 ──

        // 숫자 버튼 10개가 함께 쓰는 처리기: 누른 버튼(sender)의 Content 로 어떤 숫자인지 안다
        private void Digit_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Content is string digit)
                InputDigit(digit);
        }

        private void Point_Click(object sender, RoutedEventArgs e) { InputPoint(); }`;
    const hClear = `        private void Clear_Click(object sender, RoutedEventArgs e) { ClearAll(); }
        private void ClearEntry_Click(object sender, RoutedEventArgs e) { ClearEntry(); }
        private void Back_Click(object sender, RoutedEventArgs e) { Backspace(); }
        private void Negate_Click(object sender, RoutedEventArgs e) { Negate(); }`;
    const hOp = `        // 사칙연산 버튼 4개가 함께 쓰는 처리기: 화면 글자(÷ ×)가 아니라 Tag("/" "*")로 연산을 구분한다
        private void Operator_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Tag is string op)
                ApplyOperator(op);
        }

        private void Equals_Click(object sender, RoutedEventArgs e) { Calculate(); }`;
    const hPercent = '        private void Percent_Click(object sender, RoutedEventArgs e) { Percent(); }';

    const hKey = `        // ── 키보드 ──
        // PreviewKeyDown: 창 안의 어느 요소가 키를 받든 창이 "먼저" 본다 (터널링 이벤트)
        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            bool shift = (Keyboard.Modifiers & ModifierKeys.Shift) != 0;

            // 숫자: 위쪽 숫자 줄(D0~D9, Shift 없이) 또는 숫자 키패드(NumPad0~NumPad9)
            if (e.Key >= Key.D0 && e.Key <= Key.D9 && !shift)
            {
                InputDigit((e.Key - Key.D0).ToString());      // Key.D7 - Key.D0 = 7
                e.Handled = true;
                return;
            }
            if (e.Key >= Key.NumPad0 && e.Key <= Key.NumPad9)
            {
                InputDigit((e.Key - Key.NumPad0).ToString());
                e.Handled = true;
                return;
            }

            switch (e.Key)
            {
                case Key.Add:
                case Key.OemPlus when shift:          // Shift + = 는 +
                    ApplyOperator("+"); break;
                case Key.Subtract:
                case Key.OemMinus:
                    ApplyOperator("-"); break;
                case Key.Multiply:
                case Key.D8 when shift:               // Shift + 8 은 *
                    ApplyOperator("*"); break;
                case Key.Divide:
                case Key.OemQuestion:                 // / 키
                    ApplyOperator("/"); break;
                case Key.D5 when shift:               // Shift + 5 는 %
                    Percent(); break;
                case Key.Enter:
                case Key.OemPlus:                     // = 키
                    Calculate(); break;
                case Key.Decimal:
                case Key.OemPeriod:
                    InputPoint(); break;
                case Key.Back:
                    Backspace(); break;
                case Key.Delete:
                    ClearEntry(); break;
                case Key.Escape:
                    ClearAll(); break;
                default:
                    return;                           // 계산기와 관계없는 키는 그대로 둔다
            }
            e.Handled = true;                         // 처리한 키는 다른 요소에 전달하지 않는다
        }`;

    /* ---------- 동작 메서드 ---------- */
    const inputDigit = `        // ── 계산기 동작: 상태 변수를 바꾸고 마지막에 UpdateDisplay() ──

        // 숫자 하나 입력
        private void InputDigit(string digit)
        {
${Q(e6, '            if (hasError) ClearAll();                  // 오류 뒤에 숫자를 누르면 새로 시작\n') || ''}            if (isNewEntry)                            // 연산자 · = 뒤의 첫 숫자는 화면을 새로 시작한다
            {
                entry = "0";
                isNewEntry = false;
            }
            if (CountDigits(entry) >= MaxDigits) return;    // 자릿수 제한
            entry = entry == "0" ? digit : entry + digit;   // "0" 뒤에 5 → "5" (앞자리 0 없애기)
            UpdateDisplay();
        }

        // 소수점 입력: 한 수에 한 번만
        private void InputPoint()
        {
${Q(e6, '            if (hasError) ClearAll();\n') || ''}            if (isNewEntry)
            {
                entry = "0";
                isNewEntry = false;
            }
            if (!entry.Contains('.')) entry += ".";
            UpdateDisplay();
        }

        // 숫자 글자 수 (소수점 · 빼기 기호는 세지 않는다)
        private static int CountDigits(string text)
        {
            int count = 0;
            foreach (char c in text)
                if (char.IsDigit(c)) count++;
            return count;
        }`;

    const clearAll = `        // C: 모든 상태를 처음으로
        private void ClearAll()
        {
${L(
      '            entry = "0";',
      '            isNewEntry = true;',
      Q(st >= 5, '            pendingOp = null;'),
      Q(st >= 5, '            txtExpression.Text = "";'),
      Q(e6, '            hasError = false;'),
      Q(o.repeatEq === true, '            lastOp = null;'),
      Q(o.repeatEq === 'todo', '            // TODO 2: lastOp 도 null 로 (C 를 누르면 반복할 연산도 잊는다)'))}
            UpdateDisplay();
        }`;

    const clearRest = `        // CE: 지금 입력 중인 수만 0 으로 (연산자와 앞의 수는 그대로)
        private void ClearEntry()
        {
${Q(e6, '            if (hasError) { ClearAll(); return; }\n') || ''}            entry = "0";
            isNewEntry = false;
            UpdateDisplay();
        }

        // ⌫: 입력 중인 수의 마지막 글자 지우기 (계산 결과는 지우지 않는다)
        private void Backspace()
        {
${Q(e6, '            if (hasError) { ClearAll(); return; }\n') || ''}            if (isNewEntry) return;
            entry = entry.Substring(0, entry.Length - 1);
            if (entry == "" || entry == "-" || entry == "-0") entry = "0";
            UpdateDisplay();
        }

        // ±: 부호 바꾸기 (0 에는 부호를 붙이지 않는다)
        private void Negate()
        {
${Q(e6, '            if (hasError) return;\n') || ''}            if (entry == "0") return;
            entry = entry.StartsWith("-") ? entry.Substring(1) : "-" + entry;
            UpdateDisplay();
        }`;

    const chainCalc = e6
      ? `                if (!TryCompute(storedValue, pendingOp, CurrentValue, out decimal result)) return;
                storedValue = result;`
      : '                storedValue = Compute(storedValue, pendingOp, CurrentValue);';
    const applyOp = `        // 연산자(+ - * /)를 눌렀을 때
        private void ApplyOperator(string op)
        {
${Q(e6, '            if (hasError) return;\n') || ''}            if (pendingOp != null && !isNewEntry)
            {
                // 12 + 3 다음에 × 를 누르면: 먼저 12 + 3 = 15 를 계산해 둔다 (왼쪽부터 차례로)
${chainCalc}
                entry = FormatNumber(storedValue);
            }
            else if (pendingOp == null)
            {
                storedValue = CurrentValue;            // 첫 연산자: 지금 화면의 수가 첫 번째 피연산자
            }
            // (pendingOp != null && isNewEntry) 이면 연산자를 연달아 누른 것 → 연산자만 바꾼다 (12 + × → 12 ×)
            pendingOp = op;
            isNewEntry = true;
            txtExpression.Text = $"{FormatNumber(storedValue)} {Symbol(op)}";
            UpdateDisplay();
        }`;

    const computeLine = e6
      ? '            if (!TryCompute(storedValue, pendingOp, right, out decimal result)) return;'
      : '            decimal result = Compute(storedValue, pendingOp, right);';
    const calcNormal = `        // = 을 눌렀을 때: 기다리던 연산을 끝낸다
        private void Calculate()
        {
${L(
      Q(e6, '            if (hasError) return;'),
      Q(o.repeatEq === 'todo', `            // TODO 3: pendingOp 가 없고 lastOp 가 있으면 "지금 수 lastOp lastOperand" 를 계산 (5 + 3 = = = → 8 → 11 → 14)
            //         계산에 성공하면 lastOp · lastOperand 를 기억해 둔다`),
      '            if (pendingOp == null) return;             // 기다리는 연산이 없으면 할 일이 없다',
      '            decimal right = CurrentValue;',
      '            string expression = $"{FormatNumber(storedValue)} {Symbol(pendingOp)} {FormatNumber(right)} =";',
      '            txtExpression.Text = expression;',
      computeLine,
      Q(f8, '            AddHistory(expression, result);'),
      '            entry = FormatNumber(result);',
      '            pendingOp = null;',
      '            isNewEntry = true;',
      '            UpdateDisplay();')}
        }`;
    const calcRepeat = `        // = 을 눌렀을 때: 기다리던 연산을 끝낸다. 연산자 없이 또 누르면 마지막 연산을 되풀이한다
        private void Calculate()
        {
            if (hasError) return;
            string op;
            decimal left, right;
            if (pendingOp != null)
            {
                op = pendingOp;                        // 보통의 = : 앞의 수 (연산자) 지금 수
                left = storedValue;
                right = CurrentValue;
            }
            else if (lastOp != null)
            {
                op = lastOp;                           // = 반복: 지금 수 (마지막 연산자) 마지막 두 번째 수
                left = CurrentValue;
                right = lastOperand;
            }
            else return;

            string expression = $"{FormatNumber(left)} {Symbol(op)} {FormatNumber(right)} =";
            txtExpression.Text = expression;
            if (!TryCompute(left, op, right, out decimal result)) return;
            lastOp = op;                               // 다음 = 반복을 위해 기억
            lastOperand = right;
            entry = FormatNumber(result);
            pendingOp = null;
            isNewEntry = true;
            UpdateDisplay();
        }`;
    const calculate = o.repeatEq === true ? calcRepeat : calcNormal;

    const compute = `        // 두 수를 계산한다
        private static decimal Compute(decimal a, string op, decimal b)
        {
            switch (op)
            {
                case "+": return a + b;
                case "-": return a - b;
                case "*": return a * b;
                case "/": return a / b;${e6 ? '' : '     // b 가 0 이면 DivideByZeroException → 프로그램이 멈춘다! (단계 6 에서 해결)'}
                default: throw new ArgumentException("알 수 없는 연산자: " + op);
            }
        }`;

    const errorBlock = `        // 계산에 성공하면 true. 0 으로 나누기 · 넘침이면 오류 상태로 바꾸고 false
        private bool TryCompute(decimal a, string op, decimal b, out decimal result)
        {
            result = 0;
            if (op == "/" && b == 0)                   // 예외가 나기 전에 미리 검사
            {
                ShowError("0으로 나눌 수 없습니다");
                return false;
            }
            try
            {
                result = Compute(a, op, b);
                return true;
            }
            catch (OverflowException)                  // decimal 의 범위(약 ±7.9 × 10²⁸)를 넘으면
            {
                ShowError("수가 너무 큽니다");
                return false;
            }
        }

        // 오류 상태로: 화면에 메시지를 보이고 계산 상태는 비운다
        private void ShowError(string message)
        {
            hasError = true;
            errorMessage = message;
            entry = "0";
            pendingOp = null;
            isNewEntry = true;
            UpdateDisplay();
        }

        // %: 휴대용 계산기 방식 — 50 + 10 % → 55,  50 × 10 % → 5,  10 % → 0.1
        private void Percent()
        {
            if (hasError) return;
            decimal percent = CurrentValue / 100;
            if (pendingOp == null)
            {
                entry = FormatNumber(percent);         // 연산자 없이: 그냥 100 으로 나눈 값
                isNewEntry = true;
                UpdateDisplay();
                return;
            }
            if (pendingOp == "+" || pendingOp == "-")
            {
                // + − 에서는 "앞의 수의 몇 %": 50 + 10 % → 50 + (50 × 0.1)
                if (!TryCompute(storedValue, "*", percent, out percent)) return;
            }
            entry = FormatNumber(percent);
            Calculate();                               // 그리고 바로 = 까지
        }`;

    const unary = o.unary === true ? `        // 1/x · x² · √x 버튼이 함께 쓰는 처리기 (Tag = "inv" "sqr" "sqrt")
        private void Unary_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Tag is string kind)
                ApplyUnary(kind);
        }

        // 지금 화면의 수 하나로 바로 계산한다
        private void ApplyUnary(string kind)
        {
            if (hasError) return;
            decimal x = CurrentValue;
            decimal result;
            if (kind == "inv")
            {
                if (!TryCompute(1, "/", x, out result)) return;     // 0 이면 "0으로 나눌 수 없습니다"
            }
            else if (kind == "sqr")
            {
                if (!TryCompute(x, "*", x, out result)) return;     // 넘치면 "수가 너무 큽니다"
            }
            else
            {
                if (x < 0)
                {
                    ShowError("음수의 제곱근은 없습니다");
                    return;
                }
                result = (decimal)Math.Sqrt((double)x);             // decimal 에는 Sqrt 가 없어 double 로 계산
            }
            entry = FormatNumber(result);
            isNewEntry = false;        // 입력한 수처럼 다룬다: 12 + 9 √x = → 12 + 3 = 15
            UpdateDisplay();
        }` : o.unary === 'todo' ? `        // 1/x · x² · √x 버튼이 함께 쓰는 처리기 (Tag = "inv" "sqr" "sqrt")
        private void Unary_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Tag is string kind)
                ApplyUnary(kind);
        }

        // 지금 화면의 수 하나로 바로 계산한다
        private void ApplyUnary(string kind)
        {
            // TODO 1: 오류 상태면 아무것도 하지 않기
            // TODO 2: x = CurrentValue 로 읽고 kind 에 따라 계산
            //         "inv"  → 1 / x    (TryCompute(1, "/", x, out result) 로 0 나누기 처리)
            //         "sqr"  → x × x    (TryCompute 로 넘침 처리)
            //         "sqrt" → x 가 음수면 ShowError("음수의 제곱근은 없습니다"),
            //                  아니면 (decimal)Math.Sqrt((double)x)
            // TODO 3: entry = FormatNumber(result); isNewEntry = false; UpdateDisplay();
        }` : null;

    const memory = o.memory === true ? `        // MC · MR · M+ · M− 버튼이 함께 쓰는 처리기 (Tag = "MC" "MR" "M+" "M-")
        private void Memory_Click(object sender, RoutedEventArgs e)
        {
            if (hasError) return;
            if (sender is not Button button || button.Tag is not string kind) return;
            switch (kind)
            {
                case "MC":                             // 메모리 지우기
                    memory = 0;
                    hasMemory = false;
                    break;
                case "MR":                             // 메모리의 수를 불러오기
                    entry = FormatNumber(memory);
                    isNewEntry = false;                // 입력한 수처럼: 12 + MR = 이 계산된다
                    break;
                case "M+":
                case "M-":                             // 지금 수를 메모리에 더하기 · 빼기
                    if (!TryCompute(memory, kind == "M+" ? "+" : "-", CurrentValue, out decimal sum)) return;
                    memory = sum;
                    hasMemory = true;
                    isNewEntry = true;                 // 다음 숫자는 새로 입력
                    break;
            }
            UpdateDisplay();
        }` : o.memory === 'todo' ? `        // MC · MR · M+ · M− 버튼이 함께 쓰는 처리기 (Tag = "MC" "MR" "M+" "M-")
        private void Memory_Click(object sender, RoutedEventArgs e)
        {
            if (hasError) return;
            if (sender is not Button button || button.Tag is not string kind) return;
            // TODO 2: kind 에 따라
            //   "MC"        → memory = 0, hasMemory = false
            //   "MR"        → entry = FormatNumber(memory), isNewEntry = false
            //   "M+" / "M-" → TryCompute 로 memory ± CurrentValue (넘침 처리), hasMemory = true, isNewEntry = true
            // TODO 3: UpdateDisplay();
        }` : null;

    const history = f8 ? `        // ── 기록 ──

        // 계산이 끝날 때마다 기록 맨 위에 한 줄 추가 (최대 20개)
        private void AddHistory(string expression, decimal result)
        {
            lstHistory.SelectedItem = null;
            lstHistory.Items.Insert(0, new HistoryEntry(expression, FormatNumber(result)));
            if (lstHistory.Items.Count > 20)
                lstHistory.Items.RemoveAt(lstHistory.Items.Count - 1);
        }

        // 기록을 고르면 그 결과로 새로 시작한다
        private void History_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (lstHistory.SelectedItem is HistoryEntry item)
            {
                ClearAll();
                entry = item.Result;
                txtExpression.Text = item.Expression;
                UpdateDisplay();
            }
        }

        private void ClearHistory_Click(object sender, RoutedEventArgs e)
        {
            lstHistory.Items.Clear();
        }` : null;

    /* ---------- 화면 ---------- */
    const numText = group ? 'Group(entry)' : 'entry';
    const sizeExpr = autosize ? 'FontSizeFor(txtDisplay.Text)' : '34';
    const updateBody = e6
      ? `            if (hasError)
            {
                txtDisplay.Text = errorMessage;
                txtDisplay.FontSize = 20;
            }
            else
            {
                txtDisplay.Text = ${numText};
                txtDisplay.FontSize = ${sizeExpr};
            }`
      : L(`            txtDisplay.Text = ${numText};`, Q(autosize, `            txtDisplay.FontSize = ${sizeExpr};`));
    const update = `        // ── 화면 ──

        // 상태 → 화면: 상태를 바꾼 뒤에는 언제나 이 메서드 하나로 화면을 다시 그린다
        private void UpdateDisplay()
        {
${L(updateBody,
      Q(o.disableOps, '            UpdateButtons();'),
      Q(o.memory === true, '            txtMemory.Visibility = hasMemory ? Visibility.Visible : Visibility.Hidden;'),
      Q(o.memory === 'todo', '            // TODO 4: hasMemory 이면 txtMemory 를 보이게(Visible), 아니면 Hidden'))}
        }`;
    const groupM = group === 'todo' ? `        // "1234567.5" → "1,234,567.5": 정수 부분에만 천 단위 쉼표를 넣는다
        private static string Group(string number)
        {
            // TODO 1: 앞의 "-" 를 떼어 기억해 두기
            // TODO 2: 소수점('.') 위치로 정수 부분과 나머지(".5", "." 또는 "")를 나누기
            // TODO 3: 정수 부분만 decimal 로 바꿔 ToString("#,0", CultureInfo.InvariantCulture)
            // TODO 4: 부호 + 쉼표 넣은 정수 부분 + 나머지를 이어서 돌려주기
            return number;
        }` : group ? `        // "1234567.5" → "1,234,567.5": 정수 부분에만 천 단위 쉼표를 넣는다 (입력 중인 소수 부분은 그대로)
        private static string Group(string number)
        {
            bool negative = number.StartsWith("-");
            string digits = negative ? number.Substring(1) : number;
            int dot = digits.IndexOf('.');
            string intPart = dot >= 0 ? digits.Substring(0, dot) : digits;
            string rest = dot >= 0 ? digits.Substring(dot) : "";          // ".5" 또는 "." 또는 ""
            string grouped = decimal.Parse(intPart, CultureInfo.InvariantCulture)
                                    .ToString("#,0", CultureInfo.InvariantCulture);
            return (negative ? "-" : "") + grouped + rest;
        }` : null;
    const sizeM = autosize === 'todo' ? `        // 글자 수가 많으면 글자 크기를 줄여 표시 창에 들어가게 한다
        private static double FontSizeFor(string text)
        {
            // TODO: 11 글자 이하 34, 15 글자 이하 26, 그보다 길면 20 을 돌려주기
            return 34;
        }` : autosize ? `        // 글자 수가 많으면 글자 크기를 줄여 표시 창에 들어가게 한다
        private static double FontSizeFor(string text)
        {
            if (text.Length <= 11) return 34;
            if (text.Length <= 15) return 26;
            return 20;
        }` : null;
    const buttonsM = o.disableOps === true ? `        // 오류 상태에서는 연산자 버튼(Tag 가 있는 버튼)과 = 버튼을 끈다
        private void UpdateButtons()
        {
            foreach (UIElement child in pad.Children)
            {
                if (child is Button button && button.Tag != null)
                    button.IsEnabled = !hasError;
            }
            btnEquals.IsEnabled = !hasError;
        }` : o.disableOps === 'todo' ? `        // 오류 상태에서는 연산자 버튼(Tag 가 있는 버튼)과 = 버튼을 끈다
        private void UpdateButtons()
        {
            // TODO 1: foreach 로 pad.Children 을 돌면서, Tag 가 null 이 아닌 Button 의 IsEnabled 를 !hasError 로
            // TODO 2: btnEquals.IsEnabled 도 !hasError 로
        }` : null;
    const helpers = st >= 5 ? `        // 화면의 문자열 → 계산용 decimal ("12." 도 12 로 읽는다)
        private decimal CurrentValue => decimal.Parse(entry, CultureInfo.InvariantCulture);

        // 계산 결과 → 화면용 문자열: 소수 10자리에서 반올림하고 끝의 0 은 뗀다 (1 ÷ 3 → 0.3333333333)
        private static string FormatNumber(decimal value)
        {
            return Math.Round(value, 10).ToString("0.##########", CultureInfo.InvariantCulture);
        }

        // 계산용 기호 → 화면용 기호 ("*" → "×")
        private static string Symbol(string op)
        {
            switch (op)
            {
                case "-": return "−";
                case "*": return "×";
                case "/": return "÷";
                default: return op;
            }
        }` : null;

    const body = [
      fields, ctor,
      Q(st >= 3, hDigit), Q(st >= 4, hClear), Q(st >= 5, hOp), Q(e6, hPercent), unary, memory,
      Q(st >= 7, hKey),
      Q(st >= 3, inputDigit), Q(st >= 4, clearAll), Q(st >= 4, clearRest),
      Q(st >= 5, applyOp), Q(st >= 5, calculate), Q(st >= 5, compute), Q(e6, errorBlock),
      history,
      Q(st >= 3, update), groupM, sizeM, buttonsM, helpers
    ].filter((x) => x).join('\n\n');

    let cs = `// ===== File: MainWindow.xaml.cs =====
${usings}

namespace ${o.ns}
{
    public partial class MainWindow : Window
    {
${body}
    }
}`;
    if (f8) cs += `
// ===== File: HistoryEntry.cs =====
namespace ${o.ns}
{
    // 기록 한 줄: 식("12 + 3 =")과 결과("15") — ListBox 의 DataTemplate 이 두 속성을 바인딩해 보여 준다
    public class HistoryEntry
    {
        public string Expression { get; }
        public string Result { get; }

        public HistoryEntry(string expression, string result)
        {
            Expression = expression;
            Result = result;
        }
    }
}`;
    return cs;
  }

  const CALC = (o) => calcXaml(o) + '\n' + calcCs(o);

  /* ---------- 단계별 예제 · 완성 코드 ---------- */
  const STEP1 = CALC({ ns: 'P04Step1', stage: 1, title: '계산기 — 단계 1 화면 배치' });
  const STEP2 = CALC({ ns: 'P04Step2', stage: 2, title: '계산기 — 단계 2 스타일' });
  const STEP3 = CALC({ ns: 'P04Step3', stage: 3, title: '계산기 — 단계 3 숫자 입력' });
  const STEP4 = CALC({ ns: 'P04Step4', stage: 4, title: '계산기 — 단계 4 지우기와 부호' });
  const STEP5 = CALC({ ns: 'P04Step5', stage: 5, title: '계산기 — 단계 5 사칙연산' });
  const STEP6 = CALC({ ns: 'P04Step6', stage: 6, title: '계산기 — 단계 6 오류 처리와 %' });
  const STEP7 = CALC({ ns: 'P04Step7', stage: 7, title: '계산기 — 단계 7 키보드' });
  const FINAL = CALC({ ns: 'P04Final', stage: 8, title: 'WPF 계산기' });

  /* ---------- 실습 코드 ---------- */
  const PR3_S = CALC({ ns: 'P04Group', stage: 4, group: 'todo', title: '실습 P4-3 — 천 단위 쉼표' });
  const PR3_A = CALC({ ns: 'P04Group', stage: 4, group: true, title: '실습 P4-3 — 천 단위 쉼표' });
  const PR4_S = CALC({ ns: 'P04Size', stage: 4, autosize: 'todo', title: '실습 P4-4 — 글자 크기 자동 조절' });
  const PR4_A = CALC({ ns: 'P04Size', stage: 4, autosize: true, title: '실습 P4-4 — 글자 크기 자동 조절' });
  const PR5_S = CALC({ ns: 'P04Repeat', stage: 7, repeatEq: 'todo', title: '실습 P4-5 — = 반복' });
  const PR5_A = CALC({ ns: 'P04Repeat', stage: 7, repeatEq: true, title: '실습 P4-5 — = 반복' });
  const PR6_S = CALC({ ns: 'P04Disable', stage: 7, disableOps: 'todo', title: '실습 P4-6 — 오류 때 연산자 끄기' });
  const PR6_A = CALC({ ns: 'P04Disable', stage: 7, disableOps: true, title: '실습 P4-6 — 오류 때 연산자 끄기' });
  const EX1_S = CALC({ ns: 'P04Unary', stage: 8, unary: 'todo', title: '계산기 — 1/x · x² · √x' });
  const EX1_A = CALC({ ns: 'P04Unary', stage: 8, unary: true, title: '계산기 — 1/x · x² · √x' });
  const EX2_S = CALC({ ns: 'P04Memory', stage: 8, memory: 'todo', title: '계산기 — 메모리' });
  const EX2_A = CALC({ ns: 'P04Memory', stage: 8, memory: true, title: '계산기 — 메모리' });

  /* ---------- 준비 예제 ---------- */
  const PREP_DECIMAL = `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;          // 2진 소수: 0.1 을 정확히 나타낼 수 없다
        decimal m = 0.1m + 0.2m;       // 10진 소수: 0.1 을 정확히 나타낸다 (m 접미사)

        Console.WriteLine($"double : 0.1 + 0.2 = {d}");
        Console.WriteLine($"decimal: 0.1 + 0.2 = {m}");
        Console.WriteLine($"double  은 0.3 과 같은가? {d == 0.3}");
        Console.WriteLine($"decimal 은 0.3 과 같은가? {m == 0.3m}");
        Console.WriteLine();
        Console.WriteLine($"double : 1 - 0.9 = {1 - 0.9}");
        Console.WriteLine($"decimal: 1 - 0.9 = {1m - 0.9m}");
        Console.WriteLine($"decimal: 1 ÷ 3   = {1m / 3m}");
        Console.WriteLine($"decimal 최댓값   = {decimal.MaxValue:N0}");
    }
}`;

  const PREP_SHARED = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Prep.MainWindow"
        ${NS}
        Title="공용 Click 처리기 — Content 와 Tag" Width="380" Height="260">
    <StackPanel Margin="16">
        <TextBlock x:Name="txtInfo" Text="버튼을 눌러 보세요" FontSize="16"/>
        <TextBlock x:Name="txtCount" Foreground="Gray" Margin="0,4,0,12"/>
        <!-- 버튼 6개의 Click 이 모두 같은 처리기(Any_Click)를 가리킨다 -->
        <UniformGrid Rows="2" Columns="3" Height="110">
            <Button Content="7" FontSize="20" Margin="3" Click="Any_Click"/>
            <Button Content="8" FontSize="20" Margin="3" Click="Any_Click"/>
            <Button Content="9" FontSize="20" Margin="3" Click="Any_Click"/>
            <Button Content="÷" Tag="/" FontSize="20" Margin="3" Click="Any_Click"/>
            <Button Content="×" Tag="*" FontSize="20" Margin="3" Click="Any_Click"/>
            <Button Content="−" Tag="-" FontSize="20" Margin="3" Click="Any_Click"/>
        </UniformGrid>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace P04Prep
{
    public partial class MainWindow : Window
    {
        private int clicks = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        // 버튼 6개가 이 처리기 하나를 함께 쓴다. sender = 방금 눌린 그 버튼
        private void Any_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button)
            {
                clicks++;
                // Content = 화면에 보이는 글자, Tag = 프로그램이 쓰려고 붙여 둔 값 (없으면 null)
                txtInfo.Text = $"Content = {button.Content},  Tag = {button.Tag ?? "(없음)"}";
                txtCount.Text = $"지금까지 {clicks}번 눌렀습니다";
            }
        }
    }
}`;

  const PREP_MODEL = `using System;
using System.Globalization;

// 계산기의 "상태" 만 떼어 낸 모형: 버튼 대신 글자 하나씩 누른다
class CalcModel
{
    public string Entry = "0";       // 화면의 수
    public decimal Stored;           // 연산자 앞의 수
    public string? Op;               // 기다리는 연산자 (없으면 null)
    public bool IsNewEntry = true;   // 다음 숫자가 화면을 새로 시작하는가

    private decimal Value => decimal.Parse(Entry, CultureInfo.InvariantCulture);

    public void Press(char key)
    {
        if (char.IsDigit(key))                       // 숫자
        {
            if (IsNewEntry) { Entry = "0"; IsNewEntry = false; }
            Entry = Entry == "0" ? key.ToString() : Entry + key;
        }
        else if (key == '=')                         // =
        {
            if (Op == null) return;
            Entry = Compute(Stored, Op, Value).ToString(CultureInfo.InvariantCulture);
            Op = null;
            IsNewEntry = true;
        }
        else                                         // + - * /
        {
            if (Op != null && !IsNewEntry)           // 앞 연산이 있으면 먼저 계산
            {
                Stored = Compute(Stored, Op, Value);
                Entry = Stored.ToString(CultureInfo.InvariantCulture);
            }
            else if (Op == null)
            {
                Stored = Value;
            }
            Op = key.ToString();
            IsNewEntry = true;
        }
    }

    private static decimal Compute(decimal a, string op, decimal b)
    {
        if (op == "+") return a + b;
        if (op == "-") return a - b;
        if (op == "*") return a * b;
        return a / b;
    }
}

class Program
{
    static void Run(string keys)
    {
        var calc = new CalcModel();
        Console.WriteLine($"=== {keys} ===");
        Console.WriteLine("키 | 화면 | 앞의 수 | 연산자 | 새 입력?");
        foreach (char key in keys)
        {
            calc.Press(key);
            Console.WriteLine($" {key} | {calc.Entry,4} | {calc.Stored,7} | {calc.Op ?? "-",6} | {calc.IsNewEntry}");
        }
        Console.WriteLine();
    }

    static void Main()
    {
        Run("12+3*4=");     // 왼쪽부터 차례로: (12 + 3) × 4
        Run("7+*2=");       // 연산자를 연달아 누르면 뒤의 것으로 바뀐다
    }
}`;

  /* ---------- 실습 P4-1 · P4-2 ---------- */
  const PR1_MAIN = `    static void Test(decimal a, string op, decimal b)
    {
        if (TryCompute(a, op, b, out decimal result))
            Console.WriteLine($"{a} {op} {b} = {result}");
        else
            Console.WriteLine($"{a} {op} {b} → 계산할 수 없습니다");
    }

    static void Main()
    {
        Test(12, "+", 3);
        Test(7, "/", 2);
        Test(1, "/", 3);
        Test(0.1m, "+", 0.2m);
        Test(5, "/", 0);
        Test(2, "^", 3);
        Test(decimal.MaxValue, "*", 2);
    }
}`;
  const PR1_S = `using System;

class Program
{
    // TODO: op 가 "+" "-" "*" "/" 이면 계산해 result 에 넣고 true 를 돌려준다
    //       0 으로 나누기, 모르는 연산자, 넘침(OverflowException)이면 false
    static bool TryCompute(decimal a, string op, decimal b, out decimal result)
    {
        result = 0;
        return false;
    }

${PR1_MAIN}`;
  const PR1_A = `using System;

class Program
{
    static bool TryCompute(decimal a, string op, decimal b, out decimal result)
    {
        result = 0;
        if (op == "/" && b == 0) return false;       // 0 으로 나누기는 예외가 나기 전에 막는다
        try
        {
            switch (op)
            {
                case "+": result = a + b; return true;
                case "-": result = a - b; return true;
                case "*": result = a * b; return true;
                case "/": result = a / b; return true;
                default: return false;                // 모르는 연산자
            }
        }
        catch (OverflowException)                    // decimal 범위를 넘음
        {
            return false;
        }
    }

${PR1_MAIN}`;
  const PR1_EXPECT = `12 + 3 = 15
7 / 2 = 3.5
1 / 3 = 0.3333333333333333333333333333
0.1 + 0.2 = 0.3
5 / 0 → 계산할 수 없습니다
2 ^ 3 → 계산할 수 없습니다
79228162514264337593543950335 * 2 → 계산할 수 없습니다`;

  const PR2_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Pad.MainWindow"
        ${NS}
        Title="전화 키패드" Width="300" Height="420">
    <DockPanel Margin="12">
        <TextBlock x:Name="txtNumber" DockPanel.Dock="Top" Text="" FontSize="28" FontWeight="Bold"
                   Height="44" HorizontalAlignment="Center"/>
        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <Button Content="지우기" Width="80" Height="34" DockPanel.Dock="Right" Click="Clear_Click"/>
            <Button Content="⌫" Width="60" Height="34" DockPanel.Dock="Right" Margin="0,0,6,0" Click="Back_Click"/>
            <TextBlock x:Name="txtLength" Foreground="Gray" VerticalAlignment="Center"/>
        </DockPanel>
        <!-- 버튼 12개가 공용 처리기 Key_Click 하나를 쓴다 -->
        <UniformGrid Rows="4" Columns="3">
            <Button Content="1" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="2" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="3" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="4" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="5" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="6" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="7" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="8" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="9" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="*" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="0" FontSize="22" Margin="3" Click="Key_Click"/>
            <Button Content="#" FontSize="22" Margin="3" Click="Key_Click"/>
        </UniformGrid>
    </DockPanel>
</Window>`;
  const PR2_S = `${PR2_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace P04Pad
{
    public partial class MainWindow : Window
    {
        private const int MaxLength = 13;
        private string number = "";

        public MainWindow()
        {
            InitializeComponent();
            UpdateDisplay();
        }

        // TODO 1: 누른 버튼의 Content 를 number 뒤에 붙이기 (MaxLength 글자까지만)
        private void Key_Click(object sender, RoutedEventArgs e)
        {
        }

        // TODO 2: number 의 마지막 글자 지우기 (비어 있으면 아무것도 안 함)
        private void Back_Click(object sender, RoutedEventArgs e)
        {
        }

        // TODO 3: number 를 비우기
        private void Clear_Click(object sender, RoutedEventArgs e)
        {
        }

        private void UpdateDisplay()
        {
            txtNumber.Text = number;
            txtLength.Text = $"{number.Length} / {MaxLength} 자리";
        }
    }
}`;
  const PR2_A = `${PR2_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;

namespace P04Pad
{
    public partial class MainWindow : Window
    {
        private const int MaxLength = 13;
        private string number = "";

        public MainWindow()
        {
            InitializeComponent();
            UpdateDisplay();
        }

        // 버튼 12개의 공용 처리기: sender 의 Content 가 곧 누른 글자
        private void Key_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Content is string key && number.Length < MaxLength)
            {
                number += key;
                UpdateDisplay();
            }
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            if (number.Length == 0) return;
            number = number.Substring(0, number.Length - 1);
            UpdateDisplay();
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            number = "";
            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            txtNumber.Text = number;
            txtLength.Text = $"{number.Length} / {MaxLength} 자리";
        }
    }
}`;

  /* ---------- 추가 예제: decimal 의 예외 ---------- */
  const EX_EXCEPT = `using System;

class Program
{
    static void Try(string title, Func<decimal> calc)
    {
        try
        {
            Console.WriteLine($"{title} = {calc()}");
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine($"{title} → DivideByZeroException (0 으로 나누기)");
        }
        catch (OverflowException)
        {
            Console.WriteLine($"{title} → OverflowException (범위를 넘음)");
        }
    }

    static void Main()
    {
        decimal zero = 0;
        decimal max = decimal.MaxValue;      // 79,228,162,514,264,337,593,543,950,335
        Try("8 ÷ 2", () => 8m / 2);
        Try("8 ÷ 0", () => 8m / zero);
        Try("최댓값 × 2", () => max * 2);
        Try("최댓값 + 1", () => max + 1);
        Try("최댓값 + 0.1", () => max + 0.1m);

        double dz = 0;
        Console.WriteLine($"(비교) double 8 ÷ 0 = {8.0 / dz}");   // double 은 예외 없이 ∞
    }
}`;

  /* ---------- 확장 과제 3: 계산 엔진 분리 (콘솔) ---------- */
  const ENGINE_TESTS = `// ===== File: Program.cs =====
using System;

class Program
{
    // 글자 하나 = 버튼 하나. 창 없이 엔진만 눌러 본다
    static void Run(string keys, string expected)
    {
        var engine = new CalculatorEngine();
        foreach (char key in keys)
        {
            if (char.IsDigit(key)) engine.InputDigit(key.ToString());
            else if (key == '.') engine.InputPoint();
            else if (key == '=') engine.Calculate();
            else if (key == 'C') engine.ClearAll();
            else engine.ApplyOperator(key.ToString());
        }
        string actual = engine.Display;
        Console.WriteLine($"[{(actual == expected ? "통과" : "실패")}] {keys,-12} → {actual}");
    }

    static void Main()
    {
        Run("12+3=", "15");
        Run("12+3*4=", "60");
        Run("7+*2=", "14");
        Run("0.1+0.2=", "0.3");
        Run("1/3=", "0.3333333333");
        Run("8/0=", "0으로 나눌 수 없습니다");
        Run("8/0=5", "5");
        Run("99C4+4=", "8");
    }
}`;
  const ENGINE_A = `// ===== File: CalculatorEngine.cs =====
using System;
using System.Globalization;

// 계산기의 상태와 규칙만 가진 클래스 — WPF 를 전혀 모른다 (Button · TextBlock 이 없다)
public class CalculatorEngine
{
    private string entry = "0";
    private bool isNewEntry = true;
    private decimal storedValue;
    private string? pendingOp;
    private bool hasError;
    private string errorMessage = "";

    // 화면이 보여 줄 글자 — 창은 이 속성만 읽어 txtDisplay.Text 에 넣으면 된다
    public string Display => hasError ? errorMessage : entry;
    public string Expression { get; private set; } = "";

    public void InputDigit(string digit)
    {
        if (hasError) ClearAll();
        if (isNewEntry) { entry = "0"; isNewEntry = false; }
        entry = entry == "0" ? digit : entry + digit;
    }

    public void InputPoint()
    {
        if (hasError) ClearAll();
        if (isNewEntry) { entry = "0"; isNewEntry = false; }
        if (!entry.Contains('.')) entry += ".";
    }

    public void ClearAll()
    {
        entry = "0";
        isNewEntry = true;
        pendingOp = null;
        hasError = false;
        Expression = "";
    }

    public void ApplyOperator(string op)
    {
        if (hasError) return;
        if (pendingOp != null && !isNewEntry)
        {
            if (!TryCompute(storedValue, pendingOp, CurrentValue, out decimal result)) return;
            storedValue = result;
            entry = FormatNumber(result);
        }
        else if (pendingOp == null)
        {
            storedValue = CurrentValue;
        }
        pendingOp = op;
        isNewEntry = true;
        Expression = $"{FormatNumber(storedValue)} {op}";
    }

    public void Calculate()
    {
        if (hasError || pendingOp == null) return;
        decimal right = CurrentValue;
        Expression = $"{FormatNumber(storedValue)} {pendingOp} {FormatNumber(right)} =";
        if (!TryCompute(storedValue, pendingOp, right, out decimal result)) return;
        entry = FormatNumber(result);
        pendingOp = null;
        isNewEntry = true;
    }

    private bool TryCompute(decimal a, string op, decimal b, out decimal result)
    {
        result = 0;
        if (op == "/" && b == 0) { SetError("0으로 나눌 수 없습니다"); return false; }
        try
        {
            result = op == "+" ? a + b : op == "-" ? a - b : op == "*" ? a * b : a / b;
            return true;
        }
        catch (OverflowException)
        {
            SetError("수가 너무 큽니다");
            return false;
        }
    }

    private void SetError(string message)
    {
        hasError = true;
        errorMessage = message;
        entry = "0";
        pendingOp = null;
        isNewEntry = true;
    }

    private decimal CurrentValue => decimal.Parse(entry, CultureInfo.InvariantCulture);

    private static string FormatNumber(decimal value) =>
        Math.Round(value, 10).ToString("0.##########", CultureInfo.InvariantCulture);
}
${ENGINE_TESTS}`;
  const ENGINE_S = `// ===== File: CalculatorEngine.cs =====
using System;
using System.Globalization;

// 계산기의 상태와 규칙만 가진 클래스 — WPF 를 전혀 모른다 (Button · TextBlock 이 없다)
// MainWindow.xaml.cs 의 계산 코드를 이 클래스로 옮기세요.
public class CalculatorEngine
{
    // TODO 0: 상태 필드 옮기기 — entry("0"), isNewEntry(true), storedValue, pendingOp, hasError, errorMessage("")

    // 화면이 보여 줄 글자 — TODO: 오류면 errorMessage, 아니면 entry 를 돌려주게 바꾸기
    public string Display => "0";
    public string Expression { get; private set; } = "";

    // TODO 1: InputDigit · InputPoint · ClearAll — MainWindow 의 코드에서 UpdateDisplay() 호출만 빼고 옮기기
    public void InputDigit(string digit) { }
    public void InputPoint() { }
    public void ClearAll() { }

    // TODO 2: ApplyOperator · Calculate — txtExpression.Text 대신 Expression 속성에 식을 넣기
    public void ApplyOperator(string op) { }
    public void Calculate() { }

    // TODO 3: TryCompute · SetError(= ShowError) · CurrentValue · FormatNumber 옮기기
}
${ENGINE_TESTS}`;
  const ENGINE_EXPECT = `[통과] 12+3=        → 15
[통과] 12+3*4=      → 60
[통과] 7+*2=        → 14
[통과] 0.1+0.2=     → 0.3
[통과] 1/3=         → 0.3333333333
[통과] 8/0=         → 0으로 나눌 수 없습니다
[통과] 8/0=5        → 5
[통과] 99C4+4=      → 8`;

  /* ---------- 슬라이드용 짧은 코드 ---------- */
  const SL_DECIMAL = `using System;

class Program
{
    static void Main()
    {
        double d = 0.1 + 0.2;
        decimal m = 0.1m + 0.2m;       // m 접미사 = decimal 리터럴
        Console.WriteLine($"double : {d}   0.3 과 같다? {d == 0.3}");
        Console.WriteLine($"decimal: {m}   0.3 과 같다? {m == 0.3m}");
        Console.WriteLine($"decimal 1 ÷ 3 = {1m / 3m}");
    }
}`;
  const SL_SHARED = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Slide1.MainWindow"
        ${NS}
        Title="공용 처리기" Width="320" Height="190">
    <StackPanel Margin="12">
        <TextBlock x:Name="txtInfo" Text="버튼을 누르세요" FontSize="16"/>
        <UniformGrid Columns="3" Height="56" Margin="0,12,0,0">
            <Button Content="7" FontSize="20" Click="Any_Click"/>
            <Button Content="÷" Tag="/" FontSize="20" Click="Any_Click"/>
            <Button Content="×" Tag="*" FontSize="20" Click="Any_Click"/>
        </UniformGrid>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
namespace P04Slide1
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Any_Click(object sender, RoutedEventArgs e)   // 버튼 3개가 함께 쓴다
        {
            if (sender is Button b)
                txtInfo.Text = $"Content = {b.Content},  Tag = {b.Tag ?? "없음"}";
        }
    }
}`;
  const SL_MODEL = `using System;
class Program
{
    static string entry = "0"; static decimal stored; static string? op; static bool isNew = true;
    static decimal Value => decimal.Parse(entry);
    static decimal Compute(decimal a, string o, decimal b) => o == "+" ? a + b : o == "-" ? a - b : o == "*" ? a * b : a / b;
    static void Press(char k)
    {
        if (char.IsDigit(k)) { if (isNew) { entry = "0"; isNew = false; } entry = entry == "0" ? k.ToString() : entry + k; }
        else if (k == '=') { if (op == null) return; entry = Compute(stored, op, Value).ToString(); op = null; isNew = true; }
        else
        {
            if (op != null && !isNew) { stored = Compute(stored, op, Value); entry = stored.ToString(); }
            else if (op == null) stored = Value;
            op = k.ToString(); isNew = true;
        }
    }
    static void Main()
    {
        foreach (char k in "12+3*4=")
        {
            Press(k);
            Console.WriteLine($"{k} → 화면 {entry,-3} 앞의 수 {stored,-3} 연산자 {op ?? "-"}  새 입력 {isNew}");
        }
    }
}`;
  const SL_STYLE = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Slide2.MainWindow"
        ${NS}
        Title="Style 과 BasedOn" Width="320" Height="170">
    <Window.Resources>
        <Style x:Key="CalcButton" TargetType="Button">
            <Setter Property="FontSize" Value="18"/>
            <Setter Property="Margin" Value="2"/>
        </Style>
        <Style x:Key="OpButton" TargetType="Button" BasedOn="{StaticResource CalcButton}">
            <Setter Property="Foreground" Value="SteelBlue"/>
        </Style>
    </Window.Resources>
    <UniformGrid Rows="2" Columns="4" Margin="8">
        <Button Content="7" Style="{StaticResource CalcButton}"/>
        <Button Content="8" Style="{StaticResource CalcButton}"/>
        <Button Content="9" Style="{StaticResource CalcButton}"/>
        <Button Content="÷" Style="{StaticResource OpButton}"/>
        <Button Content="4" Style="{StaticResource CalcButton}"/>
        <Button Content="5" Style="{StaticResource CalcButton}"/>
        <Button Content="6" Style="{StaticResource CalcButton}"/>
        <Button Content="×" Style="{StaticResource OpButton}"/>
    </UniformGrid>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace P04Slide2 { public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); } } }`;
  const SL_DIGIT = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Slide3.MainWindow" Title="숫자 입력 규칙" Width="300" Height="190"
        ${NS}>
    <StackPanel Margin="12">
        <TextBlock x:Name="txtDisplay" Text="0" FontSize="32" HorizontalAlignment="Right"/>
        <UniformGrid Columns="4" Height="44">
            <Button Content="0" Click="Key_Click"/> <Button Content="1" Click="Key_Click"/>
            <Button Content="2" Click="Key_Click"/> <Button Content="." Click="Key_Click"/>
        </UniformGrid>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Controls;
namespace P04Slide3
{
    public partial class MainWindow : Window
    {
        private string entry = "0";
        public MainWindow() { InitializeComponent(); }
        private void Key_Click(object sender, RoutedEventArgs e)
        {
            if (sender is not Button b || b.Content is not string key) return;
            if (key == ".") { if (!entry.Contains('.')) entry += "."; }   // 소수점은 한 번만
            else entry = entry == "0" ? key : entry + key;               // 앞자리 0 없애기
            txtDisplay.Text = entry;
        }
    }
}`;
  const SL_TRY = `using System;
class Program
{
    static bool TryCompute(decimal a, string op, decimal b, out decimal result)
    {
        result = 0;
        if (op == "/" && b == 0) { Console.WriteLine("  → 0으로 나눌 수 없습니다"); return false; }
        try
        {
            result = op == "+" ? a + b : op == "-" ? a - b : op == "*" ? a * b : a / b;
            return true;
        }
        catch (OverflowException) { Console.WriteLine("  → 수가 너무 큽니다"); return false; }
    }
    static void Main()
    {
        if (TryCompute(8, "/", 2, out decimal r)) Console.WriteLine($"8 ÷ 2 = {r}");
        Console.WriteLine("8 ÷ 0");
        TryCompute(8, "/", 0, out _);
        Console.WriteLine("최댓값 × 2");
        TryCompute(decimal.MaxValue, "*", 2, out _);
    }
}`;
  const SL_KEY = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Slide4.MainWindow"
        ${NS}
        Title="키보드 입력" Width="340" Height="170" PreviewKeyDown="Window_PreviewKeyDown">
    <StackPanel Margin="16">
        <TextBlock Text="숫자 · + · Enter · Esc 를 눌러 보세요" Foreground="Gray"/>
        <TextBlock x:Name="txtLog" FontSize="28" Margin="0,8,0,0"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Input;
namespace P04Slide4
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            bool shift = (Keyboard.Modifiers & ModifierKeys.Shift) != 0;
            if (e.Key >= Key.D0 && e.Key <= Key.D9 && !shift) txtLog.Text += (e.Key - Key.D0).ToString();
            else if (e.Key >= Key.NumPad0 && e.Key <= Key.NumPad9) txtLog.Text += (e.Key - Key.NumPad0).ToString();
            else if (e.Key == Key.Add || (e.Key == Key.OemPlus && shift)) txtLog.Text += " + ";
            else if (e.Key == Key.Enter) txtLog.Text += " =";
            else if (e.Key == Key.Escape) txtLog.Text = "";
            else return;                   // 모르는 키는 그대로
            e.Handled = true;              // 처리한 키
        }
    }
}`;
  const SL_HISTORY = `// ===== File: MainWindow.xaml =====
<Window x:Class="P04Slide5.MainWindow" Title="계산 기록" Width="320" Height="280"
        ${NS}>
    <ListBox x:Name="lstHistory" Margin="10">
        <ListBox.ItemTemplate>
            <DataTemplate>
                <StackPanel>
                    <TextBlock Text="{Binding Expression}" Foreground="Gray"/>
                    <TextBlock Text="{Binding Result}" FontWeight="Bold" FontSize="16"/>
                </StackPanel>
            </DataTemplate>
        </ListBox.ItemTemplate>
    </ListBox>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
namespace P04Slide5
{
    public record HistoryEntry(string Expression, string Result);   // 속성 두 개짜리 레코드
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            for (int n = 1; n <= 3; n++)      // 1 + 4, 2 + 4, 3 + 4 를 차례로 맨 위(0 번)에 끼워 넣는다
                lstHistory.Items.Insert(0, new HistoryEntry($"{n} + 4 =", $"{n + 4}"));
        }
    }
}`;

  /* ---------- 그림 1. 화면 설계 ---------- */
  const padSvg = (() => {
    const labels = ['%', 'CE', 'C', '⌫', '7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '±', '0', '.', '+'];
    let s = '';
    labels.forEach((t, i) => {
      const r = Math.floor(i / 4), c = i % 4;
      const x = 578 + c * 96, y = 160 + r * 56;
      const op = c === 3 && r > 0, digit = /[0-9.]/.test(t);
      s += `<rect x="${x}" y="${y}" width="92" height="52" rx="4" fill="${digit ? 'var(--card)' : 'none'}" stroke="var(--line)" stroke-width="2"/>`;
      s += `<text x="${x + 46}" y="${y + 34}" text-anchor="middle" style="font-size:22px;${digit ? 'font-weight:700;' : ''}fill:${op ? 'var(--accent)' : 'var(--fg)'}">${t}</text>`;
    });
    return s;
  })();
  const SVG_SCREEN = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="계산기 창의 화면 설계. Grid 의 세 행(표시 창, 버튼판, = 버튼)과 오른쪽 기록 열">
  <defs>
    <marker id="ap4a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  <rect x="560" y="20" width="680" height="500" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <rect x="560" y="20" width="680" height="36" rx="10" fill="var(--line)" opacity="0.6"/>
  <text x="580" y="45" style="font-size:18px;fill:var(--fg)">WPF 계산기</text>
  <rect x="576" y="66" width="384" height="84" rx="6" fill="#1E2A38"/>
  <text x="946" y="92" text-anchor="end" style="font-size:16px;fill:#9FB3C8">12 +</text>
  <text x="946" y="138" text-anchor="end" style="font-size:36px;font-weight:700;fill:#ffffff">3</text>
  ${padSvg}
  <rect x="578" y="446" width="380" height="56" rx="4" fill="var(--accent)"/>
  <text x="768" y="484" text-anchor="middle" style="font-size:26px;fill:#ffffff">=</text>
  <rect x="976" y="66" width="248" height="438" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="990" y="92" style="font-size:18px;font-weight:700;fill:var(--fg)">기록</text>
  <rect x="1150" y="72" width="64" height="26" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="1182" y="91" text-anchor="middle" style="font-size:14px;fill:var(--fg)">지우기</text>
  <text x="1212" y="130" text-anchor="end" style="font-size:15px;fill:var(--muted)">15 × 4 =</text>
  <text x="1212" y="156" text-anchor="end" style="font-size:20px;font-weight:700;fill:var(--fg)">60</text>
  <line x1="986" y1="170" x2="1214" y2="170" stroke="var(--line)" stroke-width="1.5"/>
  <text x="1212" y="194" text-anchor="end" style="font-size:15px;fill:var(--muted)">12 + 3 =</text>
  <text x="1212" y="220" text-anchor="end" style="font-size:20px;font-weight:700;fill:var(--fg)">15</text>
  <text x="530" y="100" text-anchor="end" style="font-size:22px;font-weight:700;fill:var(--fg)">Grid.Row 0 · 표시 창</text>
  <text x="530" y="128" text-anchor="end" style="font-size:18px;fill:var(--muted)">Height="Auto" — 내용만큼 · 식 + 지금 수</text>
  <line x1="538" y1="108" x2="570" y2="108" stroke="var(--accent)" stroke-width="3" marker-end="url(#ap4a)"/>
  <text x="530" y="290" text-anchor="end" style="font-size:22px;font-weight:700;fill:var(--fg)">Grid.Row 1 · 버튼판</text>
  <text x="530" y="318" text-anchor="end" style="font-size:18px;fill:var(--muted)">UniformGrid 4열 × 5행 · Height="*" (나머지 전부)</text>
  <line x1="538" y1="298" x2="570" y2="298" stroke="var(--accent)" stroke-width="3" marker-end="url(#ap4a)"/>
  <text x="530" y="466" text-anchor="end" style="font-size:22px;font-weight:700;fill:var(--fg)">Grid.Row 2 · = 버튼</text>
  <text x="530" y="494" text-anchor="end" style="font-size:18px;fill:var(--muted)">Height="52" — 넓고 누르기 쉽게</text>
  <line x1="538" y1="474" x2="570" y2="474" stroke="var(--accent)" stroke-width="3" marker-end="url(#ap4a)"/>
  <text x="768" y="548" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Grid.Column 0 (Width="*")</text>
  <text x="1100" y="548" text-anchor="middle" style="font-size:18px;fill:var(--muted)">Grid.Column 1 · 기록 (Width="170", 4교시)</text>
</svg>`;

  /* ---------- 그림 2. 상태 다이어그램 ---------- */
  const box = (x, y, w, h, color, title, sub1, sub2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="var(--card)" stroke="${color}" stroke-width="4"/>
  <text x="${x + w / 2}" y="${y + 40}" text-anchor="middle" style="font-size:25px;font-weight:700;fill:${color}">${title}</text>
  <text x="${x + w / 2}" y="${y + 74}" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">${sub1}</text>
  <text x="${x + w / 2}" y="${y + 102}" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">${sub2}</text>`;
  const SVG_STATE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="계산기의 네 가지 상태(결과 표시, 숫자 입력 중, 연산자 대기, 오류)와 키를 누를 때 상태가 바뀌는 방향">
  <defs>
    <marker id="ap4b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ap4c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
  </defs>
  ${box(80, 60, 330, 124, 'var(--accent2)', '숫자 입력 중', 'isNewEntry = false', '화면 = 치고 있는 수')}
  ${box(870, 60, 330, 124, 'var(--accent)', '연산자 대기', 'pendingOp = "+" …', 'isNewEntry = true')}
  ${box(80, 336, 330, 124, 'var(--ok)', '결과 표시 (시작)', 'pendingOp = null', 'isNewEntry = true')}
  ${box(870, 336, 330, 124, 'var(--danger)', '오류', 'hasError = true', '"0으로 나눌 수 없습니다"')}
  <g stroke-width="4" fill="none">
    <line x1="414" y1="100" x2="864" y2="100" stroke="var(--accent)" marker-end="url(#ap4b)"/>
    <line x1="866" y1="150" x2="416" y2="150" stroke="var(--accent)" marker-end="url(#ap4b)"/>
    <path d="M985,56 C985,10 1090,10 1090,52" stroke="var(--accent)" marker-end="url(#ap4b)"/>
    <line x1="200" y1="332" x2="200" y2="190" stroke="var(--accent)" marker-end="url(#ap4b)"/>
    <line x1="300" y1="188" x2="300" y2="330" stroke="var(--accent)" marker-end="url(#ap4b)"/>
    <line x1="1035" y1="188" x2="1035" y2="330" stroke="var(--danger)" stroke-dasharray="10 7" marker-end="url(#ap4c)"/>
    <line x1="866" y1="398" x2="416" y2="398" stroke="var(--danger)" stroke-dasharray="10 7" marker-end="url(#ap4c)"/>
    <line x1="30" y1="398" x2="74" y2="398" stroke="var(--ok)" marker-end="url(#ap4b)"/>
  </g>
  <text x="640" y="88" text-anchor="middle" style="font-size:19px;fill:var(--accent)">연산자 (앞 연산이 있으면 먼저 계산)</text>
  <text x="640" y="176" text-anchor="middle" style="font-size:19px;fill:var(--accent)">숫자 (화면을 새로 시작)</text>
  <text x="1210" y="24" text-anchor="end" style="font-size:18px;fill:var(--accent)">연산자 또 누름 → 연산자만 바꿈</text>
  <text x="190" y="268" text-anchor="end" style="font-size:19px;fill:var(--accent)">숫자</text>
  <text x="312" y="268" style="font-size:19px;fill:var(--accent)">= (계산 끝)</text>
  <text x="1048" y="268" style="font-size:19px;fill:var(--danger)">÷ 0 · 넘침</text>
  <text x="640" y="386" text-anchor="middle" style="font-size:19px;fill:var(--danger)">C · 숫자 → 새로 시작</text>
  <text x="640" y="515" text-anchor="middle" style="font-size:21px;fill:var(--fg)">상태 = 변수 값의 조합. 버튼(이벤트)이 상태를 바꾸고, UpdateDisplay() 가 상태를 화면에 그린다</text>
</svg>`;

  /* ---------- 그림 3. 스타일 상속 ---------- */
  const styleBox = (x, y, title, l1, l2, color) => `<rect x="${x}" y="${y}" width="300" height="118" rx="14" fill="var(--card)" stroke="${color}" stroke-width="4"/>
  <text x="${x + 150}" y="${y + 38}" text-anchor="middle" style="${MONO};font-size:23px;font-weight:700;fill:${color}">${title}</text>
  <text x="${x + 150}" y="${y + 72}" text-anchor="middle" style="font-size:18px;fill:var(--fg)">${l1}</text>
  <text x="${x + 150}" y="${y + 100}" text-anchor="middle" style="font-size:18px;fill:var(--fg)">${l2}</text>`;
  const sampleBtns = (x, labels, fill, color, bold) => labels.map((t, i) => `<rect x="${x + i * 76}" y="440" width="70" height="52" rx="4" fill="${fill}" stroke="var(--line)" stroke-width="2"/>
  <text x="${x + i * 76 + 35}" y="475" text-anchor="middle" style="font-size:22px;${bold ? 'font-weight:700;' : ''}fill:${color}">${t}</text>`).join('\n  ');
  const SVG_STYLE = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="CalcButton 스타일을 DigitButton, OpButton, EqualsButton 이 BasedOn 으로 물려받는 구조">
  <defs>
    <marker id="ap4d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  ${styleBox(490, 30, 'CalcButton', 'FontSize 18 · Margin 2', 'Background #F0F0F0', 'var(--accent)')}
  <text x="810" y="80" style="font-size:18px;fill:var(--muted)">직접 쓰는 버튼: % CE C ⌫ ±</text>
  ${styleBox(60, 250, 'DigitButton', '+ Background White', '+ FontWeight Bold', 'var(--accent2)')}
  ${styleBox(490, 250, 'OpButton', '+ FontSize 22 (덮어씀)', '+ Foreground SteelBlue', 'var(--accent2)')}
  ${styleBox(920, 250, 'EqualsButton', '+ FontSize 24 (덮어씀)', '+ 파란 바탕 · 흰 글씨', 'var(--accent2)')}
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="210" y1="246" x2="560" y2="154" marker-end="url(#ap4d)"/>
    <line x1="640" y1="246" x2="640" y2="154" marker-end="url(#ap4d)"/>
    <line x1="1070" y1="246" x2="720" y2="154" marker-end="url(#ap4d)"/>
  </g>
  <text x="360" y="190" text-anchor="middle" style="font-size:19px;fill:var(--accent)">BasedOn</text>
  <text x="652" y="206" style="font-size:19px;fill:var(--accent)">BasedOn</text>
  <text x="930" y="190" text-anchor="middle" style="font-size:19px;fill:var(--accent)">BasedOn</text>
  ${sampleBtns(96, ['7', '8', '9'], 'var(--card)', 'var(--fg)', true)}
  ${sampleBtns(564, ['÷', '×'], 'none', 'var(--accent)', false)}
  <rect x="960" y="440" width="220" height="52" rx="4" fill="var(--accent)"/>
  <text x="1070" y="476" text-anchor="middle" style="font-size:26px;fill:#ffffff">=</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:21px;fill:var(--fg)">공통 모양은 한 번만 쓰고, 다른 점만 덧붙인다 — 공통 글꼴을 바꾸면 버튼 21개가 한꺼번에 바뀐다</text>
</svg>`;

  /* ---------- 그림 4. 입력이 모이는 곳 ---------- */
  const srcBox = (y, t1, t2, color) => `<rect x="30" y="${y}" width="340" height="74" rx="12" fill="var(--card)" stroke="${color}" stroke-width="3"/>
  <text x="200" y="${y + 32}" text-anchor="middle" style="font-size:20px;font-weight:700;fill:${color}">${t1}</text>
  <text x="200" y="${y + 60}" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">${t2}</text>`;
  const SVG_FUNNEL = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="버튼 클릭과 키보드 입력이 같은 동작 메서드로 모이고, 동작 메서드가 상태를 바꾼 뒤 UpdateDisplay 가 화면을 그린다">
  <defs>
    <marker id="ap4e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  ${srcBox(40, '숫자 버튼 7 클릭', 'Digit_Click', 'var(--accent2)')}
  ${srcBox(134, '키보드 7 · 숫자 키패드 7', 'Window_PreviewKeyDown', 'var(--warn)')}
  ${srcBox(274, '× 버튼 클릭 (Tag="*")', 'Operator_Click', 'var(--accent2)')}
  ${srcBox(368, '키보드 * · Shift+8', 'Window_PreviewKeyDown', 'var(--warn)')}
  <rect x="480" y="96" width="310" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="635" y="146" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">InputDigit("7")</text>
  <rect x="480" y="330" width="310" height="80" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="635" y="380" text-anchor="middle" style="${MONO};font-size:22px;fill:var(--fg)">ApplyOperator("*")</text>
  <rect x="900" y="130" width="350" height="190" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1075" y="170" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">상태 변수</text>
  <text x="930" y="210" style="${MONO};font-size:18px;fill:var(--fg)">entry · isNewEntry</text>
  <text x="930" y="244" style="${MONO};font-size:18px;fill:var(--fg)">storedValue · pendingOp</text>
  <text x="930" y="278" style="${MONO};font-size:18px;fill:var(--fg)">hasError</text>
  <rect x="900" y="390" width="350" height="80" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="1075" y="422" text-anchor="middle" style="${MONO};font-size:21px;fill:var(--fg)">UpdateDisplay()</text>
  <text x="1075" y="452" text-anchor="middle" style="font-size:17px;fill:var(--muted)">상태 → txtDisplay · 글자 크기</text>
  <g stroke="var(--accent)" stroke-width="3" fill="none">
    <line x1="374" y1="77" x2="474" y2="122" marker-end="url(#ap4e)"/>
    <line x1="374" y1="171" x2="474" y2="152" marker-end="url(#ap4e)"/>
    <line x1="374" y1="311" x2="474" y2="356" marker-end="url(#ap4e)"/>
    <line x1="374" y1="405" x2="474" y2="386" marker-end="url(#ap4e)"/>
    <line x1="794" y1="136" x2="894" y2="190" marker-end="url(#ap4e)"/>
    <line x1="794" y1="370" x2="894" y2="270" marker-end="url(#ap4e)"/>
    <line x1="1075" y1="324" x2="1075" y2="384" marker-end="url(#ap4e)"/>
  </g>
  <text x="640" y="525" text-anchor="middle" style="font-size:21px;fill:var(--fg)">입력 방법이 몇 개든 동작 메서드는 하나 — 버튼과 키보드가 같은 코드를 쓰므로 결과도 언제나 같다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'p04',
    no: 'P04',
    title: 'WPF 계산기',
    subtitle: 'Calculator with Grid · Styles · Events',
    summary: 'Windows 계산기처럼 동작하는 사칙연산 계산기를 WPF 로 만듭니다. Grid 와 UniformGrid 로 버튼판을 배치하고, Style 과 BasedOn 으로 버튼 21개의 모양을 한곳에서 관리하며, 버튼 여러 개가 공용 Click 처리기 하나를 쓰도록 Content 와 Tag 를 활용합니다. “지금 입력 중인 수 · 기다리는 연산자 · 새 입력 여부” 라는 상태 변수로 계산기의 동작을 설계하고, decimal 로 정확한 10진 계산, 0 나누기와 넘침 처리, C · CE · ⌫ · ± · %, 키보드 입력(PreviewKeyDown), 계산 기록 ListBox 까지 단계별로 완성합니다.',
    goals: [
      '계산기의 기능을 요구사항 표로 정리하고 Grid · UniformGrid 로 화면을 설계할 수 있다',
      'Style 과 BasedOn 으로 여러 버튼의 공통 모양과 차이를 한곳에서 관리할 수 있다',
      '공용 Click 처리기에서 sender 의 Content · Tag 로 누른 버튼을 구분할 수 있다',
      '상태 변수(현재 입력 · 앞의 수 · 연산자 · 새 입력 여부)로 계산기의 동작을 구현할 수 있다',
      'decimal 로 정확한 소수 계산을 하고 0 나누기 · 넘침을 오류 상태로 처리할 수 있다',
      'PreviewKeyDown 으로 버튼과 키보드가 같은 동작 메서드를 쓰게 만들 수 있다',
      '계산 기록을 ListBox 와 DataTemplate 으로 보여 주고 기능을 확장할 수 있다'
    ],
    requires: ['ch15', 'ch16', 'ch17', 'ch19'],
    preview: 'assets/shots/p04-final.png',
    previewCode: FINAL,
    sections: [
      /* ===================================================================== p04-1 */
      {
        id: 'p04-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '계산기의 기능을 요구사항 표(기능 · 규칙)로 정리할 수 있다',
          'Grid 의 행 · 열과 UniformGrid 로 계산기 화면을 설계할 수 있다',
          '계산기의 동작을 상태 변수와 상태 변화로 설명할 수 있다',
          'double 대신 decimal 을 쓰는 이유를 설명할 수 있다',
          '버튼 여러 개가 공용 Click 처리기 하나를 쓰게 만들고 Content · Tag 로 구분할 수 있다'
        ],
        flow: [['도입 · 완성 계산기 시연', 5], ['요구사항 · 기능 목록', 8], ['화면 설계 (Grid · UniformGrid)', 8], ['상태 설계 · 상태 모형 실행', 14], ['준비 예제 (decimal · 공용 처리기)', 8], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '이번 프로젝트는 Windows 에 들어 있는 계산기의 <b>표준 모드</b>와 비슷한 <b>사칙연산 계산기</b>입니다. 숫자 버튼과 <code>+ − × ÷</code> 로 계산하고, 입력을 고치는 <code>C</code> · <code>CE</code> · <code>⌫</code> · <code>±</code>, 백분율 <code>%</code>, 키보드 입력, 오른쪽의 <b>계산 기록</b>까지 갖춘 프로그램을 4교시에 걸쳐 완성합니다.' },
          { type: 'p', html: '계산기는 작아 보이지만 WPF 로 만들 때 필요한 것이 거의 모두 들어 있습니다. <b>레이아웃</b>(15장 Grid · UniformGrid), <b>컨트롤</b>(16장 Button · TextBlock · ListBox), <b>이벤트</b>(17장 Click · KeyDown), <b>스타일</b>(19장 Style · BasedOn)을 한 프로그램에서 함께 써 보는 것이 이번 프로젝트의 목표입니다. 그리고 무엇보다 “버튼을 누를 때마다 무엇을 기억하고 있어야 하는가” 라는 <b>상태(state) 설계</b>를 연습합니다.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'p', html: '코드를 쓰기 전에 “무엇이 되어야 완성인가” 를 표로 적어 둡니다. 이 표가 나중에 <b>테스트 목록</b>이 됩니다.' },
          { type: 'table', head: ['번호', '기능', '규칙 · 예'], rows: [
            ['F1', '숫자 · 소수점 입력', '앞자리 0 없애기(<code>0 → 7</code> 은 “7”), 소수점은 한 번만, 최대 16자리'],
            ['F2', '사칙연산과 =', '<b>왼쪽부터 차례로</b> 계산: <code>12 + 3 × 4 =</code> → 60 (Windows 표준 계산기와 같음)'],
            ['F3', '연산자 연달아 누르기', '<code>12 + ×</code> → 계산 없이 연산자만 바뀜 (12 ×)'],
            ['F4', '0 나누기 · 넘침', '프로그램이 멈추지 않고 “0으로 나눌 수 없습니다” 표시. 다음 숫자나 C 로 다시 시작'],
            ['F5', 'C · CE · ⌫ · ±', 'C 전부 지우기, CE 지금 수만 0, ⌫ 한 글자 지우기, ± 부호 바꾸기'],
            ['F6', '%', '<code>50 + 10 %</code> → 55, <code>50 × 10 %</code> → 5 (휴대용 계산기 방식)'],
            ['F7', '키보드', '숫자 · <code>+ - * /</code> · Enter · Backspace · Esc · Delete 로도 조작'],
            ['F8', '표시', '위쪽에 식(<code>12 +</code>), 아래에 큰 숫자. 천 단위 쉼표, 길면 글자 크기 줄이기'],
            ['F9', '계산 기록', '오른쪽 목록에 “식 = 결과” 가 쌓이고, 고르면 그 결과를 다시 불러옴']
          ], caption: '계산기 요구사항 — 1~3교시에 F1~F8, 4교시에 F9 를 만든다' },
          { type: 'callout', kind: 'info', title: '왜 “왼쪽부터 차례로” 일까?', html: '수학에서는 곱셈을 먼저 하므로 <code>12 + 3 × 4</code> 는 24 입니다. 하지만 Windows 계산기의 표준 모드 · 대부분의 휴대용 계산기는 연산자를 누르는 순간 앞의 계산을 끝내는 <b>즉시 계산 방식</b>이라 60 이 나옵니다. 즉시 계산 방식은 “지금까지의 결과 하나 + 기다리는 연산자 하나” 만 기억하면 되므로 상태가 단순합니다. 곱셈을 먼저 하는 <b>공학용 계산기</b>는 식 전체를 기억했다가 계산해야 하므로(스택 · 구문 분석) 이번 프로젝트의 범위를 넘습니다.' },
          { type: 'h', text: '3. 화면 설계 — Grid 와 UniformGrid' },
          { type: 'p', html: '화면은 바깥 <b>Grid</b> 하나로 나눕니다. 행(Row)은 위에서부터 <b>표시 창 · 버튼판 · = 버튼</b>, 4교시에는 오른쪽에 <b>기록</b> 열(Column)을 더합니다. 버튼판은 20개의 버튼이 모두 같은 크기이므로 <b>UniformGrid</b> 가 딱 맞습니다. <code>Rows="5" Columns="4"</code> 만 정하면 자식을 순서대로 왼쪽 → 오른쪽, 위 → 아래로 채워 줍니다. Grid 처럼 버튼마다 <code>Grid.Row</code> · <code>Grid.Column</code> 을 쓸 필요가 없습니다.' },
          { type: 'figure', html: SVG_SCREEN, caption: '계산기 화면 설계 — 바깥은 Grid(3행 · 4교시에 2열), 버튼판은 UniformGrid(4열 × 5행)' },
          { type: 'table', head: ['영역', '컨트롤', '이름(x:Name)', '비고'], rows: [
            ['표시 창 — 식', 'TextBlock', '<code>txtExpression</code>', '작은 회색 글씨, 오른쪽 정렬 (<code>12 +</code>)'],
            ['표시 창 — 지금 수', 'TextBlock', '<code>txtDisplay</code>', '크고 굵게, 오른쪽 정렬. 길면 글자 크기를 줄인다'],
            ['버튼판', 'UniformGrid + Button 20개', '<code>pad</code>', '숫자 · 연산자 · 기능 버튼. 모양은 Style 로'],
            ['= 버튼', 'Button', '', '버튼판 아래 한 줄 전체'],
            ['기록', 'ListBox', '<code>lstHistory</code>', '4교시. 항목 = 식 + 결과 (DataTemplate)']
          ], caption: '컨트롤 목록 — 코드에서 읽고 쓸 컨트롤에만 이름을 붙인다' },
          { type: 'h', text: '4. 상태 설계 — 계산기는 무엇을 기억해야 할까?' },
          { type: 'p', html: '<code>12 + 3 =</code> 을 누르는 동안 계산기 안에서 일어나는 일을 생각해 봅시다. <code>+</code> 를 누른 순간 화면에는 여전히 12 가 보이지만, 계산기는 ① 앞의 수 12 와 ② 기다리는 연산자 + 를 <b>기억</b>해야 하고, ③ 다음에 <code>3</code> 을 누르면 화면의 12 뒤에 붙여 “123” 을 만드는 것이 아니라 <b>화면을 새로 시작</b>해야 한다는 것도 알아야 합니다. 이렇게 “지금 어떤 상황인가” 를 나타내는 변수들을 <b>상태(state)</b>라고 합니다.' },
          { type: 'table', head: ['상태 변수', '형식', '뜻', '<code>12 +</code> 를 누른 직후'], rows: [
            ['<code>entry</code>', 'string', '지금 입력 중인(화면에 보이는) 수. 문자열이라 “12.” 처럼 입력 중인 모양을 그대로 가진다', '"12"'],
            ['<code>storedValue</code>', 'decimal', '연산자 앞의 수 (첫 번째 피연산자)', '12'],
            ['<code>pendingOp</code>', 'string?', '기다리는 연산자 <code>"+" "-" "*" "/"</code>. 없으면 null', '"+"'],
            ['<code>isNewEntry</code>', 'bool', 'true 면 다음 숫자가 화면을 새로 시작 (연산자 · = 직후)', 'true'],
            ['<code>hasError</code>', 'bool', '0 나누기 · 넘침으로 오류 메시지를 보이는 중인가 (3교시)', 'false']
          ], caption: '계산기의 상태 변수 — 모든 버튼은 결국 이 값들을 바꾸는 일을 한다' },
          { type: 'figure', html: SVG_STATE, caption: '상태 다이어그램 — 네모 = 상태, 화살표 = 키를 눌렀을 때 바뀌는 방향' },
          { type: 'p', html: '상태 설계를 코드로 먼저 확인해 봅시다. 다음 콘솔 프로그램은 창 없이 <b>상태 변수와 규칙만</b> 떼어 낸 모형입니다. 문자열의 글자 하나를 버튼 하나로 보고 차례로 “누르면서” 상태 변수가 어떻게 바뀌는지 출력합니다.' },
          { type: 'code', title: '준비 예제 1. 계산기 상태 모형 — 콘솔에서 키를 눌러 보기', code: PREP_MODEL, expect: `=== 12+3*4= ===
키 | 화면 | 앞의 수 | 연산자 | 새 입력?
 1 |    1 |       0 |      - | False
 2 |   12 |       0 |      - | False
 + |   12 |      12 |      + | True
 3 |    3 |      12 |      + | False
 * |   15 |      15 |      * | True
 4 |    4 |      15 |      * | False
 = |   60 |      15 |      - | True

=== 7+*2= ===
키 | 화면 | 앞의 수 | 연산자 | 새 입력?
 7 |    7 |       0 |      - | False
 + |    7 |       7 |      + | True
 * |    7 |       7 |      * | True
 2 |    2 |       7 |      * | False
 = |   14 |       7 |      - | True
`, desc: '<code>*</code> 를 누른 줄을 보세요. 기다리던 <code>+</code> 가 있고 새 수(3)를 입력한 상태이므로 먼저 12 + 3 = 15 를 계산해 “앞의 수” 로 삼습니다. 두 번째 실행의 <code>+*</code> 는 새 수를 입력하지 않았으므로(<code>새 입력? True</code>) 계산 없이 연산자만 <code>*</code> 로 바뀝니다. 이 두 규칙이 요구사항 F2 · F3 입니다. 2교시부터 이 모형을 WPF 창 안으로 옮깁니다.' },
          { type: 'h', text: '5. 준비 운동 ① — double 이 아니라 decimal' },
          { type: 'p', html: '계산기에 <code>0.1 + 0.2</code> 를 넣었는데 <code>0.30000000000000004</code> 가 나오면 곤란합니다. <code>double</code> 은 수를 <b>2진 소수</b>로 저장하기 때문에 0.1 같은 10진 소수를 정확히 나타내지 못합니다(3장). C# 의 <code>decimal</code> 은 수를 <b>10진수</b>로 저장하므로 사람이 쓰는 소수를 그대로 계산합니다. 대신 범위(약 ±7.9 × 10²⁸)가 double 보다 좁고 조금 느리지만, 계산기 · 돈 계산에는 decimal 이 정답입니다.' },
          { type: 'code', title: '준비 예제 2. double 과 decimal 의 차이', code: PREP_DECIMAL, expect: `double : 0.1 + 0.2 = 0.30000000000000004
decimal: 0.1 + 0.2 = 0.3
double  은 0.3 과 같은가? False
decimal 은 0.3 과 같은가? True

double : 1 - 0.9 = 0.09999999999999998
decimal: 1 - 0.9 = 0.1
decimal: 1 ÷ 3   = 0.3333333333333333333333333333
decimal 최댓값   = 79,228,162,514,264,337,593,543,950,335`, desc: 'decimal 리터럴에는 <code>m</code> 접미사를 붙입니다(<code>0.1m</code>). <code>1m / 3m</code> 처럼 끝나지 않는 소수는 28자리 정도에서 잘리므로, 화면에 보일 때는 소수 10자리에서 반올림합니다(2교시 <code>FormatNumber</code>). decimal 도 범위를 넘으면 예외가 나는데, 이것은 3교시에 처리합니다.' },
          { type: 'h', text: '6. 준비 운동 ② — 공용 Click 처리기' },
          { type: 'p', html: '계산기에는 버튼이 21개 있습니다. 숫자 버튼마다 <code>Btn7_Click</code>, <code>Btn8_Click</code> … 처리기를 따로 만들면 거의 같은 메서드가 10개나 생깁니다. 대신 <b>여러 버튼의 Click 을 처리기 하나에 연결</b>하고, 처리기 안에서 <code>sender</code>(이벤트를 일으킨 버튼)를 보고 어떤 버튼인지 알아냅니다(17장).' },
          { type: 'list', items: [
            '<code>Content</code>: 버튼에 <b>보이는</b> 글자. 숫자 버튼은 Content 가 곧 입력할 숫자(<code>"7"</code>)라서 그대로 쓰면 됩니다.',
            '<code>Tag</code>: 모든 컨트롤에 있는 “메모 칸”(object). 화면에 보이지 않고, 프로그램이 쓰려고 아무 값이나 붙여 둘 수 있습니다. 연산자 버튼은 화면에 <code>÷ ×</code> 를 보이지만, 코드에서는 <code>Tag="/"</code> · <code>Tag="*"</code> 로 구분하면 화면 글자를 바꿔도 코드가 흔들리지 않습니다.',
            '<code>sender is Button button</code>: sender 는 object 형식이므로 <b>패턴 검사</b>(<code>is</code>)로 Button 인지 확인하면서 변수에 담습니다. <code>button.Content is string digit</code> 도 같은 방법입니다.'
          ] },
          { type: 'code', title: '준비 예제 3. 버튼 6개가 처리기 하나를 함께 쓰기', code: PREP_SHARED, desc: '6개 버튼 모두 <code>Click="Any_Click"</code> 입니다. 숫자 버튼을 누르면 <code>Tag = (없음)</code>, 연산자 버튼을 누르면 <code>Content = ÷,  Tag = /</code> 처럼 나옵니다. <code>button.Tag ?? "(없음)"</code> 은 Tag 가 null 이면 “(없음)” 을 쓰는 null 병합 연산자입니다. 계산기에서도 숫자 버튼 10개는 <code>Digit_Click</code> 하나를, 연산자 버튼 4개는 <code>Operator_Click</code> 하나를 씁니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 계산기 프로젝트 만들기', html: '<ul><li><b>새 프로젝트 만들기</b> → 검색 창에 “WPF” → <b>WPF 애플리케이션</b>(설명에 “.NET” 이 있는 것, <b>.NET Framework 가 아님</b>) → 프로젝트 이름 <code>Calculator</code> → 프레임워크 <b>.NET 9</b>.</li><li>만들어진 <code>MainWindow.xaml</code> 의 <code>&lt;Window&gt;</code> 에서 <code>Title</code>, <code>Width="340"</code>, <code>Height="460"</code> 을 먼저 정합니다. 디자이너 창이 바로 그 크기로 바뀝니다.</li><li>이 강좌의 예제는 네임스페이스가 <code>P04Step1</code> 처럼 되어 있습니다. VS 프로젝트에 붙여 넣을 때는 <code>x:Class="Calculator.MainWindow"</code> 와 코드 비하인드의 <code>namespace Calculator</code> 를 <b>프로젝트 이름에 맞게</b> 고치세요. 둘이 다르면 <code>InitializeComponent</code> 를 찾을 수 없다는 오류가 납니다.</li><li>4교시의 <code>HistoryEntry.cs</code> 는 솔루션 탐색기에서 프로젝트를 오른쪽 클릭 → <b>추가</b> → <b>클래스</b>(<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>)로 만듭니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P4-1. 안전한 계산 함수 TryCompute',
            level: 1,
            desc: '<p>계산기의 심장이 될 함수를 콘솔에서 먼저 만들어 봅니다. <code>TryCompute(decimal a, string op, decimal b, out decimal result)</code> 를 완성하세요.</p><ul><li><code>op</code> 가 <code>"+" "-" "*" "/"</code> 이면 계산해 <code>result</code> 에 넣고 <code>true</code></li><li>0 으로 나누기, 모르는 연산자(<code>"^"</code>), 범위를 넘는 계산(<code>OverflowException</code>)이면 <code>false</code></li><li><code>Main</code> 의 테스트 7줄이 아래처럼 나오면 성공입니다.</li></ul><pre><code>12 + 3 = 15\n7 / 2 = 3.5\n1 / 3 = 0.3333333333333333333333333333\n0.1 + 0.2 = 0.3\n5 / 0 → 계산할 수 없습니다\n2 ^ 3 → 계산할 수 없습니다\n79228162514264337593543950335 * 2 → 계산할 수 없습니다</code></pre>',
            hint: '0 나누기는 <code>if (op == "/" &amp;&amp; b == 0) return false;</code> 로 <b>예외가 나기 전에</b> 막는 것이 좋습니다. 넘침은 미리 알기 어려우므로 <code>try { … } catch (OverflowException) { return false; }</code> 로 잡습니다. <code>switch</code> 의 <code>default</code> 에서 모르는 연산자를 처리하세요. <code>out</code> 매개변수는 모든 경로에서 값을 넣어야 하므로 맨 앞에 <code>result = 0;</code> 을 둡니다.',
            starter: PR1_S,
            solution: PR1_A,
            expect: PR1_EXPECT
          },
          {
            title: '실습 P4-2. 전화 키패드 — 공용 처리기',
            level: 1,
            desc: '<p>UniformGrid 에 <code>1~9 · * · 0 · #</code> 버튼 12개가 있는 전화 키패드입니다. XAML 은 완성되어 있고, 버튼 12개가 모두 <code>Key_Click</code> 처리기 하나를 씁니다.</p><ul><li><code>Key_Click</code>: 누른 버튼의 Content 를 <code>number</code> 뒤에 붙인다 (최대 13자리)</li><li><code>Back_Click</code>(⌫): 마지막 글자 지우기, <code>Clear_Click</code>(지우기): 모두 지우기</li><li>바꾼 뒤에는 <code>UpdateDisplay()</code> 를 불러 번호와 “5 / 13 자리” 를 다시 그린다</li></ul>',
            hint: '<code>if (sender is Button button &amp;&amp; button.Content is string key &amp;&amp; number.Length &lt; MaxLength)</code> 한 줄로 “버튼인가 · 글자가 있는가 · 자리가 남았는가” 를 한 번에 검사할 수 있습니다. 마지막 글자 지우기는 <code>number.Substring(0, number.Length - 1)</code>. 상태(<code>number</code>)를 바꾸고 → <code>UpdateDisplay()</code> 로 화면을 그리는 순서가 계산기와 같습니다.',
            starter: PR2_S,
            solution: PR2_A
          }
        ],
        quiz: [
          { q: '다음 코드의 출력은?<pre><code>double d = 0.1 + 0.2;\nConsole.WriteLine(d == 0.3);</code></pre>', options: ['True', 'False', '컴파일 오류', '0.3'], answer: 1, explain: 'double 은 0.1 · 0.2 를 정확히 나타내지 못해 합이 0.30000000000000004 가 되므로 0.3 과 같지 않습니다. decimal(<code>0.1m + 0.2m == 0.3m</code>)은 True 입니다.' },
          { q: '이 프로젝트의 계산기(즉시 계산 방식)에서 <code>2 + 3 × 4 =</code> 을 차례로 누르면?', options: ['14', '24', '20', '9'], answer: 2, explain: '× 를 누르는 순간 앞의 2 + 3 = 5 를 계산하고, 이어서 5 × 4 = 20 입니다. 곱셈을 먼저 하면 14 지만 즉시 계산 방식은 왼쪽부터 차례로 계산합니다.' },
          { q: '버튼 여러 개가 같은 Click 처리기를 쓸 때, 처리기 안에서 <b>어느 버튼을 눌렀는지</b> 알려 주는 것은?', options: ['<code>e.Handled</code>', '<code>this</code>', '<code>sender</code>', '<code>InitializeComponent()</code>'], answer: 2, explain: '<code>sender</code> 는 이벤트를 일으킨 객체(누른 버튼)입니다. <code>sender is Button button</code> 으로 Button 으로 바꾼 뒤 Content · Tag 를 읽습니다. <code>this</code> 는 창(MainWindow)입니다.' },
          { q: '<code>isNewEntry</code> 가 <b>false</b> 인 때는?', options: ['프로그램을 막 시작했을 때', '<code>+</code> 를 누른 직후', '<code>=</code> 을 누른 직후', '숫자 <code>5</code> 를 누른 직후'], answer: 3, explain: '숫자를 누르면 “입력 중” 이 되어 다음 숫자가 뒤에 이어 붙습니다(false). 시작 · 연산자 · = 직후에는 다음 숫자가 화면을 새로 시작해야 하므로 true 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'WPF 계산기 — 기능 목록 · 화면 설계 · 상태 설계', badge: 'Project 04 · 1교시',
            notes: '<p><b>[도입 3분]</b> 완성된 계산기(4교시 완성 프로그램)를 먼저 실행해 보여 줍니다. <code>12 + 3 × 4 =</code>, <code>8 ÷ 0</code>, 키보드 입력, 기록 클릭까지 시연하고 “이 프로그램에 필요한 WPF 기능을 우리는 이미 다 배웠다” 고 말해 줍니다.</p><p>4교시 구성: 1 설계 → 2 화면 · 숫자 입력 → 3 계산 · 오류 · 키보드 → 4 기록 · 완성 · 확장.</p>' },
          { layout: 'bullets', title: '무엇을 만들까?', lead: 'Windows 계산기 “표준 모드” 와 비슷한 사칙연산 계산기', bullets: ['숫자 · 소수점 · <code>+ − × ÷</code> · <code>=</code>', '입력 고치기: <code>C</code> · <code>CE</code> · <code>⌫</code> · <code>±</code> · <code>%</code>', '0 나누기 · 넘침에도 멈추지 않기', '키보드로도 조작 (숫자 · Enter · Esc …)', '오른쪽에 계산 기록 (4교시)'],
            notes: '<p><b>[3분]</b> 학생에게 “계산기에서 우리가 당연하게 여기는 동작” 을 말해 보게 합니다(0 뒤에 숫자, 소수점 두 번, 연산자 두 번 …). 나온 의견을 다음 슬라이드의 요구사항 표와 연결합니다.</p>' },
          { layout: 'table', title: '요구사항 = 나중의 테스트 목록', head: ['번호', '기능', '예'], rows: [['F1', '숫자 · 소수점', '0 → 7 은 “7”, 소수점 한 번'], ['F2', '사칙연산 · =', '12 + 3 × 4 = → 60'], ['F3', '연산자 연달아', '12 + × → 12 ×'], ['F4', '0 나누기 · 넘침', '멈추지 않고 메시지'], ['F5~F6', 'C · CE · ⌫ · ± · %', '50 + 10 % → 55'], ['F7~F9', '키보드 · 표시 · 기록', '쉼표, 글자 크기, 기록 목록']],
            notes: '<p><b>[5분]</b> F2 에서 “왜 24 가 아니라 60 인가?” 를 꼭 짚습니다. Windows 계산기를 직접 열어 확인시키면 효과적입니다. 즉시 계산 방식은 “결과 하나 + 연산자 하나” 만 기억하면 된다는 점이 상태 설계를 단순하게 만든다는 것을 강조하세요.</p>' },
          { layout: 'diagram', title: '화면 설계 — Grid + UniformGrid', html: SVG_SCREEN, caption: '바깥 Grid 3행(Auto · * · 52), 버튼판 UniformGrid 4 × 5',
            notes: '<p><b>[6분]</b> 행 높이 세 가지를 짚습니다: <code>Auto</code>(내용만큼), <code>*</code>(남은 공간 전부), <code>52</code>(고정). 창 크기를 바꾸면 버튼판만 늘어난다는 것을 예측하게 합니다.</p><p>발문: “버튼 20개를 Grid 로 배치하면 무엇을 20번 써야 할까?” → Grid.Row · Grid.Column. UniformGrid 는 순서대로 채우므로 필요 없다.</p>' },
          { layout: 'table', title: '상태 변수 — 계산기가 기억하는 것', head: ['변수', '뜻', '12 + 직후'], rows: [['<code>entry</code>', '지금 입력 중인 수 (문자열)', '"12"'], ['<code>storedValue</code>', '연산자 앞의 수', '12'], ['<code>pendingOp</code>', '기다리는 연산자', '"+"'], ['<code>isNewEntry</code>', '다음 숫자가 새로 시작?', 'true'], ['<code>hasError</code>', '오류 표시 중? (3교시)', 'false']],
            lead: '모든 버튼은 결국 이 값들을 바꾼다',
            notes: '<p><b>[5분]</b> entry 가 왜 문자열인지 묻습니다 → “12.” 이나 “0.50” 처럼 입력 중인 모양을 decimal 로는 나타낼 수 없기 때문. 계산할 때만 decimal 로 바꿉니다.</p>' },
          { layout: 'diagram', title: '상태 다이어그램', html: SVG_STATE, caption: '버튼(이벤트) → 상태 변화 → UpdateDisplay() → 화면',
            notes: '<p><b>[4분]</b> 화살표를 하나씩 따라가며 “12 + 3 =” 을 손으로 짚어 봅니다: 결과 표시 → (1) 숫자 입력 중 → (+) 연산자 대기 → (3) 숫자 입력 중 → (=) 결과 표시.</p><p>연산자 대기 위의 둥근 화살표(연산자 또 누름)가 F3 입니다.</p>' },
          { layout: 'code', title: '상태 모형 — 콘솔에서 키를 눌러 보기', code: SL_MODEL, points: ['글자 하나 = 버튼 하나', '<code>*</code> 를 누르면 12 + 3 을 먼저 계산', '<code>isNew</code> 로 “화면 새로 시작” 판단', '2교시부터 이 규칙을 창 안으로'],
            notes: '<p><b>[5분]</b> 실행 결과를 한 줄씩 읽으며 다이어그램과 맞춰 봅니다. 문자열 <code>"12+3*4="</code> 를 <code>"7+*2="</code> 로 바꿔 F3 을 확인하게 하세요(결과 14).</p><p>본문 준비 예제 1 은 같은 내용을 클래스(<code>CalcModel</code>)로 정리한 버전입니다.</p>' },
          { layout: 'code', title: 'double 대신 decimal', code: SL_DECIMAL, points: ['double = 2진 소수 → 0.1 이 정확하지 않다', 'decimal = 10진 소수 → 계산기 · 돈에 적합', '리터럴 접미사 <code>m</code>', '범위 약 ±7.9 × 10²⁸ (넘으면 예외)'],
            notes: '<p><b>[4분]</b> “은행이 double 로 이자를 계산한다면?” 으로 동기를 줍니다. <code>1m / 3m</code> 의 긴 결과를 보여 주고, 화면에는 소수 10자리에서 반올림해 보여 줄 것이라고 예고합니다.</p>' },
          { layout: 'code', title: '공용 Click 처리기 — Content 와 Tag', code: SL_SHARED, points: ['버튼 3개 → 처리기 1개', '<code>sender</code> = 누른 버튼', 'Content = 보이는 글자', 'Tag = 코드용 메모 (<code>÷</code> 버튼의 Tag 는 <code>/</code>)'],
            notes: '<p><b>[4분]</b> 실행해서 세 버튼을 눌러 봅니다. “연산자 버튼의 Content 를 ÷ 대신 / 로 바꾸면 코드는?” → Tag 로 구분했으므로 코드는 그대로. 화면용 값과 코드용 값을 분리하는 습관을 강조하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '즉시 계산 방식에서 <code>2 + 3 × 4 =</code> 의 결과는?', options: ['14', '24', '20', '9'], answer: 2, explain: '× 를 누르는 순간 2 + 3 = 5 를 계산하고 5 × 4 = 20.',
            notes: '<p>답 확인 후 Windows 계산기의 표준 모드와 공학용 모드에서 각각 눌러 보게 하면 차이를 직접 확인할 수 있습니다.</p>' },
          { layout: 'practice', title: '실습 P4-1 · P4-2', desc: '<p>P4-1: 콘솔에서 <code>TryCompute</code> 완성 — 0 나누기 · 모르는 연산자 · 넘침은 false. P4-2: 전화 키패드 — 버튼 12개의 공용 처리기 <code>Key_Click</code>.</p>', starter: PR1_S, solution: PR1_A,
            notes: '<p><b>[실습]</b> P4-1 은 3교시에 그대로 쓸 부품입니다. <code>out</code> 매개변수에 익숙하지 않은 학생에게는 <code>int.TryParse</code> 와 같은 모양이라고 알려 주세요. 빨리 끝난 학생은 P4-2 로.</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: ['요구사항 표 F1~F9 = 나중의 테스트 목록', '화면: 바깥 Grid(Auto · * · 52) + UniformGrid 4 × 5', '상태: entry · storedValue · pendingOp · isNewEntry (+ hasError)', '즉시 계산 방식: 연산자를 누르면 앞 계산을 끝낸다', 'decimal 로 정확한 10진 계산', '공용 처리기 + sender 의 Content · Tag'],
            notes: '<p>다음 교시 예고: 화면을 XAML 로 배치하고 스타일로 다듬은 뒤, 숫자 입력과 지우기 기능까지 만듭니다.</p>' }
        ]
      },
      /* ===================================================================== p04-2 */
      {
        id: 'p04-2',
        title: '단계별 구현 ① — 화면 · 스타일 · 숫자 입력',
        minutes: 50,
        goals: [
          'Grid 와 UniformGrid 로 계산기 화면을 XAML 로 배치할 수 있다',
          'Window.Resources 의 Style 과 BasedOn 으로 버튼 모양을 한곳에서 관리할 수 있다',
          '공용 처리기와 상태 변수로 숫자 · 소수점 입력 규칙을 구현할 수 있다',
          'C · CE · ⌫ · ± 의 차이를 상태 변수로 설명하고 구현할 수 있다',
          '“상태를 바꾸고 → UpdateDisplay()” 순서로 화면을 갱신할 수 있다'
        ],
        flow: [['설계 복습', 3], ['단계 1 화면 배치', 9], ['단계 2 스타일', 10], ['단계 3 숫자 입력', 12], ['단계 4 지우기 · 부호', 9], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '단계 1. 화면 배치 — Grid 와 UniformGrid' },
          { type: 'p', html: '1교시에 설계한 대로 XAML 을 씁니다. 바깥 <code>Grid</code> 의 세 행에 <b>표시 창</b>(Border 안에 TextBlock 두 개), <b>버튼판</b>(UniformGrid), <b>= 버튼</b>을 둡니다. 이 단계는 화면만 만들므로 코드 비하인드에는 <code>InitializeComponent()</code> 만 있습니다.' },
          { type: 'code', title: '단계 1. 계산기 화면 배치 (아직 동작 없음)', code: STEP1, desc: 'UniformGrid 의 자식 20개가 <code>Rows="5" Columns="4"</code> 칸을 <b>순서대로</b> 채웁니다. 첫 줄이 <code>% CE C ⌫</code>, 둘째 줄이 <code>7 8 9 ÷</code> 가 되도록 XAML 의 순서 = 화면의 순서라는 점을 확인하세요. 표시 창의 두 TextBlock 에는 <code>Height</code> 를 정해 두어 나중에 글자 크기가 바뀌어도 버튼판이 들썩이지 않게 했습니다. 그런데 모든 버튼에 <code>FontSize="18" Margin="2"</code> 가 21번 반복됩니다. 글자 크기를 20 으로 바꾸려면 21곳을 고쳐야 합니다 — 단계 2 에서 해결합니다.' },
          { type: 'callout', kind: 'tip', title: '체크포인트', html: '<ul><li>창 크기를 늘려 보세요. 버튼판(<code>Height="*"</code>)만 커지고 표시 창(<code>Auto</code>)과 = 버튼(<code>52</code>)은 그대로인가요?</li><li>UniformGrid 의 <code>Columns="4"</code> 를 <code>5</code> 로 바꾸면 버튼 배치가 어떻게 밀리는지 보고 다시 4 로 돌려 두세요.</li><li><code>⌫</code> · <code>÷</code> · <code>×</code> · <code>−</code> 는 일반 키보드 기호가 아니라 유니코드 문자입니다. 복사해서 쓰거나 Windows 의 <kbd>Win</kbd>+<kbd>.</kbd>(이모지 · 기호 창)로 입력합니다.</li></ul>' },
          { type: 'h', text: '단계 2. 스타일로 버튼 모양 통일하기' },
          { type: 'p', html: '반복되는 속성은 <code>Window.Resources</code> 의 <b>Style</b> 로 모읍니다(19장). 계산기 버튼은 모두 같은 “공통 모양” 이 있고, 종류별로 조금씩 다릅니다. 이럴 때 <b>BasedOn</b> 으로 스타일을 상속합니다. <code>BasedOn="{StaticResource CalcButton}"</code> 은 “CalcButton 의 Setter 를 모두 가져온 뒤 내 Setter 를 덧붙인다(같은 속성이면 덮어쓴다)” 는 뜻입니다.' },
          { type: 'figure', html: SVG_STYLE, caption: '스타일 상속 — 공통 모양 CalcButton 을 세 스타일이 BasedOn 으로 물려받는다' },
          { type: 'code', title: '단계 2. Style 과 BasedOn 으로 정리한 화면', code: STEP2, desc: '버튼마다 <code>Style="{StaticResource DigitButton}"</code> 처럼 스타일 이름 하나만 붙습니다. 이제 <code>CalcButton</code> 의 <code>FontSize</code> 한 줄을 바꾸면 21개 버튼이 한꺼번에 바뀝니다(OpButton · EqualsButton 은 FontSize 를 덮어썼으므로 그대로). <code>StaticResource</code> 는 XAML 을 읽을 때 위에서 찾으므로 <b>BasedOn 으로 쓸 스타일이 먼저</b> 정의되어 있어야 합니다.' },
          { type: 'callout', kind: 'warn', title: '마우스를 올렸을 때 색 바꾸기는?', html: '<code>&lt;Style.Triggers&gt;&lt;Trigger Property="IsMouseOver" Value="True"&gt;</code> 로 Background 를 바꾸려 해도 실제 WPF 의 기본 버튼은 <b>자기 템플릿이 정한 마우스오버 색</b>을 먼저 칠하므로 바뀌지 않습니다. 버튼의 겉모양을 통째로 바꾸려면 19장의 <b>ControlTemplate</b> 이 필요합니다(이 웹 실습 환경은 ControlTemplate 을 그리지 않으므로 이 프로젝트에서는 쓰지 않습니다). 이번에는 기본 버튼 모양 위에 색 · 글꼴만 바꿉니다.' },
          { type: 'h', text: '단계 3. 숫자와 소수점 입력' },
          { type: 'p', html: '이제 동작을 붙입니다. 1교시의 상태 변수 중 <code>entry</code>(지금 입력 중인 수)와 <code>isNewEntry</code>(다음 숫자가 새로 시작?) 두 개로 시작합니다. 코드는 세 층으로 나눕니다.' },
          { type: 'list', ordered: true, items: [
            '<b>처리기</b>(<code>Digit_Click</code>, <code>Point_Click</code>): 무엇을 눌렀는지만 알아내서 동작 메서드에 넘깁니다.',
            '<b>동작 메서드</b>(<code>InputDigit</code>, <code>InputPoint</code>): 규칙에 따라 <b>상태 변수만</b> 바꿉니다. 컨트롤은 건드리지 않습니다.',
            '<b>화면 메서드</b>(<code>UpdateDisplay</code>): 상태를 화면에 그립니다. 상태를 바꾼 뒤에는 언제나 이 메서드 하나를 부릅니다.'
          ] },
          { type: 'p', html: '이렇게 나누면 3교시에 키보드 입력을 붙일 때 처리기만 하나 더 만들면 되고, 동작 메서드는 그대로 다시 씁니다. 숫자 입력 규칙은 다음과 같습니다.' },
          { type: 'table', head: ['상황', 'entry 전', '누른 키', 'entry 후', '규칙'], rows: [
            ['처음', '"0"', '7', '"7"', '"0" 이면 바꿔 쓴다 (앞자리 0 없애기)'],
            ['입력 중', '"7"', '5', '"75"', '뒤에 붙인다'],
            ['입력 중', '"75"', '.', '"75."', '소수점은 없을 때만 붙인다'],
            ['입력 중', '"75."', '.', '"75."', '두 번째 소수점은 무시'],
            ['처음', '"0"', '.', '"0."', '"0" 은 그대로 두고 점만 붙인다'],
            ['16자리', '"1234567890123456"', '7', '그대로', '<code>MaxDigits</code> 넘으면 무시']
          ], caption: '숫자 · 소수점 입력 규칙 — isNewEntry 가 true 면 먼저 entry 를 "0" 으로 되돌린다' },
          { type: 'code', title: '단계 3. 숫자 · 소수점 입력 — 공용 처리기와 상태 변수', code: STEP3, desc: '숫자 버튼 10개는 모두 <code>Click="Digit_Click"</code> 이고, 처리기는 <code>button.Content is string digit</code> 로 누른 숫자를 꺼냅니다. <code>InputDigit</code> 은 ① 새 입력이면 <code>entry</code> 를 "0" 으로 되돌리고 ② 자릿수를 검사한 뒤 ③ 앞자리 0 을 없애며 붙이고 ④ <code>UpdateDisplay()</code> 를 부릅니다. 아직 연산자가 없으므로 <code>isNewEntry</code> 는 처음 한 번만 true 입니다. 숫자를 17개 넘게 눌러 보고, 소수점을 두 번 눌러 보세요.' },
          { type: 'callout', kind: 'info', title: '왜 컨트롤(txtDisplay.Text)을 바로 고치지 않을까?', html: '<code>txtDisplay.Text += digit;</code> 처럼 처리기 안에서 화면 글자를 바로 고칠 수도 있습니다. 하지만 그러면 “지금 수” 가 <b>화면 글자 안에만</b> 있게 되어, 3교시에 천 단위 쉼표(<code>1,234</code>)를 넣는 순간 화면 글자를 다시 숫자로 읽기가 어려워집니다. <b>상태(entry)는 변수에</b>, <b>화면은 상태를 그린 결과</b>로 나누어 두면 화면 모양을 마음대로 바꿔도 계산은 흔들리지 않습니다. 20장 MVVM 의 “ViewModel 이 상태를 갖고 View 는 그린다” 와 같은 생각입니다.' },
          { type: 'h', text: '단계 4. 지우기와 부호 — C · CE · ⌫ · ±' },
          { type: 'p', html: '지우는 버튼 세 개는 비슷해 보이지만 <b>지우는 범위</b>가 다릅니다. 상태 변수로 차이를 적어 보면 분명해집니다.' },
          { type: 'table', head: ['버튼', '뜻', '바꾸는 상태', '예: <code>12 + 34</code> 입력 중'], rows: [
            ['<code>C</code>', 'Clear — 모두 지우기', 'entry = "0", isNewEntry = true, (연산자 · 앞의 수 · 식 · 오류도 모두)', '화면 0, 식 없음 — 처음부터'],
            ['<code>CE</code>', 'Clear Entry — 지금 수만', 'entry = "0" (연산자 · 앞의 수는 그대로)', '화면 0, 식 “12 +” 유지 → 5 = 이면 17'],
            ['<code>⌫</code>', 'Backspace — 한 글자', 'entry 의 마지막 글자 삭제. 결과(isNewEntry)는 지우지 않음', '화면 3'],
            ['<code>±</code>', '부호 바꾸기', 'entry 앞의 "-" 붙이기 · 떼기. "0" 은 그대로', '화면 -34']
          ], caption: '지우기 · 부호 버튼 — 연산자 관련 부분(식 · 앞의 수)은 단계 5 에서 채운다' },
          { type: 'code', title: '단계 4. C · CE · ⌫ · ± 버튼', code: STEP4, desc: '처리기 네 개는 모두 한 줄이고, 실제 일은 <code>ClearAll</code> · <code>ClearEntry</code> · <code>Backspace</code> · <code>Negate</code> 가 합니다. <code>Backspace</code> 에서 <code>"-5"</code> 의 마지막 글자를 지우면 <code>"-"</code> 만 남으므로, <code>""</code> · <code>"-"</code> · <code>"-0"</code> 이 되면 <code>"0"</code> 으로 되돌립니다. 이런 <b>경계 상황</b>을 표로 먼저 적어 보면 버그를 미리 찾을 수 있습니다. 아직 연산자가 없어 C 와 CE 의 차이가 보이지 않지만, 단계 5 에서 C 가 연산자까지 지우도록 한 줄씩 더합니다.' },
          { type: 'callout', kind: 'warn', title: '흔한 버그 모음', html: '<ul><li><b>0 을 여러 번 눌렀더니 “000”</b>: 앞자리 0 없애기(<code>entry == "0" ? digit : entry + digit</code>)를 빠뜨렸습니다.</li><li><b>“.5” 처럼 0 없이 시작</b>: 소수점 입력에서 새 입력일 때 <code>entry = "0"</code> 을 먼저 하지 않았습니다.</li><li><b>“-” 만 남았는데 계산하니 예외</b>: <code>decimal.Parse("-")</code> 는 FormatException 입니다. ⌫ 뒤의 경계 상황을 처리하세요.</li><li><b>숫자를 눌러도 화면이 그대로</b>: 상태만 바꾸고 <code>UpdateDisplay()</code> 를 부르지 않았습니다.</li></ul>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 스타일 · 리소스 다루기', html: '<ul><li>XAML 편집기에서 <code>Style="{StaticResource </code> 까지 입력하면 IntelliSense 가 <b>지금 쓸 수 있는 리소스 이름</b>을 보여 줍니다. 이름을 잘못 쓰면 파란 물결선과 함께 “리소스를 확인할 수 없습니다” 경고가 뜹니다.</li><li>디자이너에서 버튼을 고르고 <b>속성 창</b>의 FontSize 옆 작은 네모(속성 표식)를 누르면 <b>리소스로 변환</b>(Convert to New Resource)이 있습니다. 반복되는 값을 리소스로 뽑아내는 빠른 방법입니다.</li><li><b>문서 개요</b> 창(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>)을 열면 Grid → UniformGrid → Button 20개의 구조가 나무 모양으로 보입니다. 순서를 확인할 때 편리합니다.</li><li>디자이너가 “잘못된 태그” 등으로 멈추면 XAML 을 저장하고 <b>빌드</b>(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)한 뒤 디자이너 위쪽의 <b>다시 로드</b>를 누르세요.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P4-3. 천 단위 쉼표 표시',
            level: 2,
            desc: '<p>단계 4 의 계산기에서 화면에 <b>천 단위 쉼표</b>가 보이게 하세요. <code>UpdateDisplay</code> 는 이미 <code>txtDisplay.Text = Group(entry);</code> 로 바뀌어 있으니 <code>Group</code> 메서드만 완성하면 됩니다.</p><ul><li><code>"1234567"</code> → <code>"1,234,567"</code>, <code>"-1234.5"</code> → <code>"-1,234.5"</code></li><li>입력 중인 모양은 그대로: <code>"1234."</code> → <code>"1,234."</code>, <code>"0.50"</code> → <code>"0.50"</code></li><li>상태 변수 <code>entry</code> 에는 쉼표를 넣지 않습니다(화면에만)</li></ul>',
            hint: '<code>decimal.Parse(intPart, CultureInfo.InvariantCulture).ToString("#,0", CultureInfo.InvariantCulture)</code> 이 정수 부분에 쉼표를 넣어 줍니다. 소수 부분까지 decimal 로 바꾸면 <code>"0.50"</code> 의 끝 0 이나 <code>"1234."</code> 의 점이 사라지므로 <b>정수 부분만</b> 바꾸고 나머지(<code>digits.Substring(dot)</code>)는 문자열 그대로 붙입니다. <code>"-0.5"</code> 는 정수 부분이 <code>"-0"</code> → 0 이 되어 부호가 사라지므로 부호를 먼저 떼어 둡니다.',
            starter: PR3_S,
            solution: PR3_A
          },
          {
            title: '실습 P4-4. 긴 숫자는 글자 크기 줄이기',
            level: 1,
            desc: '<p>16자리를 입력하면 숫자가 표시 창 밖으로 잘립니다. 글자 수에 따라 글자 크기를 바꾸는 <code>FontSizeFor(string text)</code> 를 완성하세요. <code>UpdateDisplay</code> 는 이미 <code>txtDisplay.FontSize = FontSizeFor(txtDisplay.Text);</code> 를 부릅니다.</p><ul><li>11 글자 이하 → 34, 15 글자 이하 → 26, 그보다 길면 → 20</li><li>1234567890123456 을 입력하며 글자가 두 번 작아지는지 확인</li></ul>',
            hint: '<code>if (text.Length &lt;= 11) return 34;</code> 처럼 작은 경우부터 차례로 검사하면 됩니다. 글자 크기가 바뀌어도 표시 창 높이가 변하지 않는 것은 XAML 에서 TextBlock 에 <code>Height="46"</code> 을 정해 두었기 때문입니다. <code>Height</code> 를 지우고 실행해 버튼판이 움직이는 것도 확인해 보세요.',
            starter: PR4_S,
            solution: PR4_A
          }
        ],
        quiz: [
          { q: '<code>&lt;UniformGrid Columns="4"&gt;</code> 안에 버튼 20개를 넣으면 몇 행이 될까?', options: ['4행', '5행', '20행', '1행'], answer: 1, explain: 'UniformGrid 는 Rows 를 정하지 않으면 자식 수와 열 수로 행을 계산합니다. 20 ÷ 4 = 5행이고, 모든 칸의 크기가 같습니다.' },
          { q: '<code>&lt;Style x:Key="OpButton" BasedOn="{StaticResource CalcButton}"&gt;</code> 에서 CalcButton 의 FontSize 가 18, OpButton 의 FontSize 가 22 이면 OpButton 스타일을 쓴 버튼의 글자 크기는?', options: ['18', '22', '40', '오류: 같은 속성을 두 번 정할 수 없다'], answer: 1, explain: 'BasedOn 은 부모 스타일의 Setter 를 먼저 적용하고 자기 Setter 를 덧붙입니다. 같은 속성은 자식 스타일의 값(22)이 이깁니다.' },
          { q: '단계 3 의 계산기에서 처음 상태(<code>entry = "0"</code>)에 <code>0</code> <code>0</code> <code>7</code> <code>.</code> <code>.</code> <code>5</code> 를 차례로 누르면 화면은?', options: ['<code>007..5</code>', '<code>7.5</code>', '<code>0.75</code>', '<code>7..5</code>'], answer: 1, explain: '"0" 은 바꿔 쓰므로 0, 0 을 눌러도 "0", 7 → "7", 첫 소수점 → "7.", 두 번째 소수점은 무시, 5 → "7.5".' },
          { q: '<code>12 + 34</code> 를 입력하던 중 <b>CE</b> 를 누르고 <code>5 =</code> 을 누르면? (완성된 계산기 기준)', options: ['5', '17', '46', '0'], answer: 1, explain: 'CE 는 지금 수(34)만 0 으로 만들고 앞의 수 12 와 연산자 + 는 남겨 둡니다. 따라서 12 + 5 = 17. C 를 눌렀다면 모두 지워져 5 가 됩니다.' },
          { q: 'entry 가 <code>"-5"</code> 일 때 ⌫ 를 누르면 단계 4 코드의 결과는?', options: ['<code>"-"</code>', '<code>"-0"</code>', '<code>"0"</code>', '<code>"5"</code>'], answer: 2, explain: '마지막 글자를 지우면 "-" 가 남는데, 코드가 "" · "-" · "-0" 을 "0" 으로 되돌립니다. 그렇지 않으면 나중에 decimal.Parse("-") 에서 예외가 납니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ①', subtitle: '단계 1 화면 배치 → 단계 2 스타일 → 단계 3 숫자 입력 → 단계 4 지우기 · 부호', badge: 'Project 04 · 2교시',
            notes: '<p><b>[복습 3분]</b> 1교시의 화면 설계 그림과 상태 변수 표를 다시 띄우고 “오늘은 entry 와 isNewEntry 두 개만 쓴다” 고 범위를 알려 줍니다.</p>' },
          { layout: 'diagram', title: '단계 1. 화면 배치', html: SVG_SCREEN, caption: 'XAML 의 순서 = UniformGrid 의 칸 순서',
            notes: '<p><b>[9분]</b> 본문 단계 1 예제를 실행합니다. 창 크기를 늘려 <code>*</code> 행만 커지는 것을 확인하고, <code>Columns</code> 를 5 로 바꿔 배치가 밀리는 것을 보여 줍니다.</p><p>“FontSize 를 20 으로 바꾸려면 몇 군데를 고쳐야 할까?” → 21군데. 다음 슬라이드로.</p>' },
          { layout: 'diagram', title: '단계 2. 스타일 상속 — BasedOn', html: SVG_STYLE, caption: '공통 모양은 한 번, 다른 점만 덧붙인다',
            notes: '<p><b>[4분]</b> CSS 를 아는 학생에게는 “클래스 상속과 비슷하다” 고 말해 줘도 좋습니다. 같은 속성은 자식이 이긴다(OpButton 의 FontSize 22).</p>' },
          { layout: 'code', title: 'Style 과 BasedOn', code: SL_STYLE, points: ['<code>x:Key</code> 로 이름 붙인 스타일', '<code>BasedOn="{StaticResource …}"</code>', '같은 속성 → 자식 스타일이 이김', 'BasedOn 대상이 <b>먼저</b> 정의되어야'],
            notes: '<p><b>[6분]</b> CalcButton 의 FontSize 를 24 로 바꿔 실행 → 8개 버튼이 모두 바뀌는 것을 확인. 두 스타일의 순서를 바꿔 “리소스를 찾을 수 없다” 오류도 일부러 보여 주세요.</p>' },
          { layout: 'bullets', title: '단계 3. 코드를 세 층으로', lead: '처리기 → 동작 메서드 → 화면 메서드', bullets: ['처리기 <code>Digit_Click</code>: 무엇을 눌렀나 (Content)', '동작 <code>InputDigit</code>: 규칙대로 상태 변수만 바꾼다', '화면 <code>UpdateDisplay</code>: 상태를 그린다', '키보드(3교시)는 처리기만 하나 더', '상태는 변수에, 화면은 그 결과'],
            notes: '<p><b>[4분]</b> “txtDisplay.Text += digit 으로 하면 안 되나?” 를 먼저 물어보고, 쉼표 표시(실습 P4-3) 때 문제가 된다는 것을 설명합니다.</p>' },
          { layout: 'code', title: '숫자 입력 규칙', code: SL_DIGIT, points: ['<code>entry == "0" ? key : entry + key</code>', '소수점은 <code>Contains(\'.\')</code> 로 한 번만', '상태(entry) → 화면(txtDisplay)', '본문 단계 3: 처리기를 나누고 + isNewEntry · 16자리'],
            notes: '<p><b>[8분]</b> 0 0 7 . . 5 를 눌러 “7.5” 가 되는지 확인합니다. 이어서 본문 단계 3 예제로 넘어가 isNewEntry 와 MaxDigits 를 설명합니다.</p>' },
          { layout: 'table', title: '단계 4. 지우는 범위가 다르다', head: ['버튼', '지우는 것', '<code>12 + 34</code> 에서'], rows: [['C', '모든 상태', '처음부터'], ['CE', '지금 수만 (entry)', '“12 +” 는 유지'], ['⌫', 'entry 의 마지막 글자', '3'], ['±', '(부호만 바꿈)', '-34']],
            notes: '<p><b>[5분]</b> Windows 계산기에서 CE 와 C 를 직접 비교해 보게 합니다. 단계 4 코드에는 아직 연산자가 없으므로 C 와 CE 의 차이가 단계 5 에서 드러난다고 알려 주세요.</p>' },
          { layout: 'bullets', title: '경계 상황 · 흔한 버그', bullets: ['0 을 여러 번 → “000” (앞자리 0 없애기 누락)', '“.5” 로 시작 (소수점 앞 “0” 누락)', '“-5” 에서 ⌫ → “-” 만 남음 → Parse 예외', '상태만 바꾸고 UpdateDisplay() 누락', '17번째 숫자 → MaxDigits 로 무시'],
            notes: '<p><b>[4분]</b> 학생들에게 각 버그를 일부러 만들어 보게 하면(한 줄 지우기) 규칙 한 줄 한 줄의 의미가 잘 남습니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>entry = "0"</code> 에서 <code>0 0 7 . . 5</code> 를 누르면?', options: ['007..5', '7.5', '0.75', '7..5'], answer: 1, explain: '"0" 은 바꿔 쓰고, 두 번째 소수점은 무시 → "7.5".',
            notes: '<p>이어서 “처음 상태에서 . 을 누르면?” 을 추가로 물어보세요 → “0.”</p>' },
          { layout: 'practice', title: '실습 P4-3 · P4-4', desc: '<p>P4-3: <code>Group</code> 으로 화면에만 천 단위 쉼표(<code>1,234.5</code>). P4-4: <code>FontSizeFor</code> 로 긴 숫자는 글자를 작게.</p>', starter: PR3_S, solution: PR3_A,
            notes: '<p><b>[실습]</b> P4-3 의 핵심은 “상태에는 쉼표를 넣지 않는다” 입니다. entry 에 쉼표를 넣으면 decimal.Parse 가 실패한다는 것을 막히는 학생에게 보여 주세요. 두 실습의 결과는 4교시 완성 프로그램에 그대로 들어갑니다.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: ['Grid 3행 + UniformGrid 4 × 5 로 배치', 'Style + BasedOn: 공통 모양 한 번, 차이만 덧붙이기', '처리기 → 동작 메서드 → UpdateDisplay()', 'entry(문자열) + isNewEntry 로 숫자 입력', 'C 모두 · CE 지금 수 · ⌫ 한 글자 · ± 부호'],
            notes: '<p>다음 교시 예고: storedValue · pendingOp 로 사칙연산을 붙이고, 0 나누기 · 넘침 · % · 키보드까지.</p>' }
        ]
      },
      /* ===================================================================== p04-3 */
      {
        id: 'p04-3',
        title: '단계별 구현 ② — 계산 · 오류 처리 · 키보드',
        minutes: 50,
        goals: [
          'storedValue · pendingOp · isNewEntry 로 즉시 계산 방식의 사칙연산을 구현할 수 있다',
          'Tag 로 연산자를 구분하는 공용 처리기를 만들 수 있다',
          '0 나누기 · 넘침을 예외 없이 오류 상태로 처리하고 오류에서 다시 시작하게 할 수 있다',
          '% 버튼의 규칙을 구현할 수 있다',
          'PreviewKeyDown 과 Focusable 로 키보드 입력을 버튼과 같은 동작 메서드에 연결할 수 있다'
        ],
        flow: [['단계 4 복습', 3], ['단계 5 사칙연산 · =', 14], ['단계 6 0 나누기 · 넘침 · %', 12], ['단계 7 키보드', 12], ['정리 · 퀴즈', 9]],
        content: [
          { type: 'h', text: '단계 5. 사칙연산과 =' },
          { type: 'p', html: '상태 변수 <code>storedValue</code>(앞의 수)와 <code>pendingOp</code>(기다리는 연산자)를 더합니다. 연산자 버튼 4개는 <code>Tag</code> 에 계산용 기호(<code>+ - * /</code>)를 붙이고 공용 처리기 <code>Operator_Click</code> 하나를 씁니다. 연산자를 눌렀을 때 할 일은 상황에 따라 세 가지입니다.' },
          { type: 'table', head: ['상황', '조건', '할 일', '예'], rows: [
            ['첫 연산자', '<code>pendingOp == null</code>', '화면의 수를 앞의 수로 기억', '<code>12 +</code> → 앞의 수 12'],
            ['앞 연산이 있고 새 수를 입력함', '<code>pendingOp != null &amp;&amp; !isNewEntry</code>', '앞 연산을 <b>먼저 계산</b>해 결과를 앞의 수로', '<code>12 + 3 ×</code> → 15 ×'],
            ['연산자를 연달아 누름', '<code>pendingOp != null &amp;&amp; isNewEntry</code>', '계산하지 않고 <b>연산자만 바꿈</b>', '<code>12 + ×</code> → 12 ×']
          ], caption: '연산자 버튼의 세 가지 경우 — 어느 경우든 끝에는 pendingOp = op, isNewEntry = true' },
          { type: 'p', html: '<code>=</code> 은 기다리던 연산을 끝냅니다. 식(<code>12 + 3 =</code>)을 <code>txtExpression</code> 에 보이고, 결과를 <code>entry</code> 에 넣은 뒤 <code>pendingOp = null</code>, <code>isNewEntry = true</code> 로 “결과 표시” 상태가 됩니다. 결과를 화면 문자열로 바꿀 때는 <code>FormatNumber</code> 가 소수 10자리에서 반올림하고 끝의 0 을 뗍니다(<code>1 ÷ 3</code> → <code>0.3333333333</code>).' },
          { type: 'code', title: '단계 5. 사칙연산과 = (0 나누기는 아직 처리하지 않음)', code: STEP5, desc: '<code>12 + 3 × 4 =</code> 을 눌러 60 이 나오는지, <code>7 + × 2 =</code> 이 14 인지 확인하세요. 식 줄에 <code>15 ×</code> 처럼 기다리는 연산이 보입니다. 화면용 기호는 <code>Symbol("*")</code> → <code>"×"</code> 로 바꿉니다. 이제 C 는 연산자와 식까지 지우고, CE 는 지금 수만 지웁니다. 마지막으로 <code>8 ÷ 0 =</code> 을 눌러 보세요. decimal 을 0 으로 나누면 <b>DivideByZeroException</b> 이 나고, 처리하지 않은 예외는 WPF 프로그램 전체를 끝내 버립니다(Visual Studio 에서는 디버거가 그 줄에서 멈춥니다). 단계 6 에서 해결합니다.' },
          { type: 'callout', kind: 'info', title: 'CultureInfo.InvariantCulture 를 붙이는 이유', html: '<code>decimal.Parse("1.5")</code> 는 <b>컴퓨터의 지역 설정</b>을 따릅니다. 한국 · 미국 설정에서는 소수점이 <code>.</code> 이지만, 독일 · 프랑스 설정에서는 <code>,</code> 가 소수점이라 <code>"1.5"</code> 를 15 로 읽거나 예외를 냅니다. 계산기는 화면 문자열을 언제나 <code>.</code> 로 만들므로, 읽고 쓸 때 “지역과 무관한 문화권” <code>CultureInfo.InvariantCulture</code> 를 지정해 어느 나라 Windows 에서도 같은 결과가 나오게 합니다.' },
          { type: 'h', text: '단계 6. 0 나누기 · 넘침 · %' },
          { type: 'p', html: 'decimal 계산에서 날 수 있는 예외는 두 가지입니다. 실습 P4-1 에서 만든 <code>TryCompute</code> 를 계산기 안으로 가져와, 예외 대신 <b>오류 상태</b>(<code>hasError = true</code>)로 바꿉니다.' },
          { type: 'code', title: '추가 예제. decimal 계산에서 나는 예외', code: EX_EXCEPT, expect: `8 ÷ 2 = 4
8 ÷ 0 → DivideByZeroException (0 으로 나누기)
최댓값 × 2 → OverflowException (범위를 넘음)
최댓값 + 1 → OverflowException (범위를 넘음)
최댓값 + 0.1 = 79228162514264337593543950335
(비교) double 8 ÷ 0 = ∞`, desc: '최댓값에 <b>1</b> 을 더하면 범위를 넘어 <b>OverflowException</b> 이지만, <b>0.1</b> 을 더하면 예외 없이 최댓값 그대로입니다. decimal 은 유효 숫자가 28~29자리라서 표현할 수 없는 작은 자리(0.1)는 반올림해 버리기 때문입니다. 식에 상수만 쓰면(<code>decimal.MaxValue * 2</code>) 컴파일러가 미리 계산하다가 “상수 식 계산 실패” 오류를 내므로, 예제는 변수 <code>max</code> 에 담아 실행 중에 계산했습니다. double 은 0 으로 나눠도 예외 없이 무한대(∞)가 되는데, 계산기에 “∞” 가 보이는 것도 곤란하므로 decimal 을 쓰고 직접 검사하는 편이 낫습니다.' },
          { type: 'list', items: [
            '<b>0 으로 나누기</b>는 <b>미리 검사</b>합니다: <code>if (op == "/" &amp;&amp; b == 0)</code>. 예측할 수 있는 오류는 예외를 기다리지 말고 먼저 막는 것이 좋습니다.',
            '<b>넘침</b>은 미리 알기 어려우므로 <code>try { … } catch (OverflowException) { … }</code> 로 잡습니다.',
            '오류가 나면 <code>ShowError</code> 가 <code>hasError = true</code> 와 메시지를 저장하고, 계산 상태(entry · pendingOp)를 비웁니다. <code>UpdateDisplay</code> 는 오류 상태면 메시지를 작은 글씨로 보입니다.',
            '오류 상태에서 <b>숫자 · 소수점 · C · CE · ⌫</b> 는 새로 시작(<code>ClearAll</code>), <b>연산자 · = · ± · %</b> 는 무시합니다.'
          ] },
          { type: 'p', html: '<b>%</b> 는 계산기마다 규칙이 조금씩 다릅니다. 이 프로젝트는 <b>휴대용 계산기 방식</b>을 씁니다: 연산자가 없으면 100 으로 나누고(<code>10 %</code> → 0.1), <code>+ −</code> 가 기다리고 있으면 “앞의 수의 몇 %” 로 바꾼 뒤 바로 계산합니다(<code>50 + 10 %</code> → 50 + 5 = 55, 할인 · 부가세 계산에 편리), <code>× ÷</code> 이면 100 으로 나눈 값으로 계산합니다(<code>50 × 10 %</code> → 5).' },
          { type: 'code', title: '단계 6. 오류 상태와 % — 이제 0 으로 나눠도 멈추지 않는다', code: STEP6, desc: '<code>8 ÷ 0 =</code> 을 누르면 “0으로 나눌 수 없습니다” 가 보이고, 이어서 숫자를 누르면 새로 시작합니다. <code>9999999999999999 × 9999999999999999 × 9999999999999999 =</code> 을 눌러 “수가 너무 큽니다” 도 확인하세요. <code>ApplyOperator</code> · <code>Calculate</code> 에서 <code>Compute</code> 를 부르던 곳이 모두 <code>if (!TryCompute(…, out decimal result)) return;</code> 로 바뀌었습니다. 계산이 실패하면 <b>상태를 더 바꾸지 않고</b> 바로 돌아가는 것이 핵심입니다. <code>50 + 10 %</code>, <code>50 × 10 %</code>, <code>10 %</code> 도 눌러 보세요.' },
          { type: 'h', text: '단계 7. 키보드 입력' },
          { type: 'p', html: '계산기를 쓸 때는 마우스보다 숫자 키패드가 빠릅니다. 창의 <code>PreviewKeyDown</code> 이벤트에서 눌린 키(<code>e.Key</code>)를 보고 버튼과 <b>같은 동작 메서드</b>(<code>InputDigit</code>, <code>ApplyOperator</code> …)를 부릅니다. 단계 3 에서 코드를 세 층으로 나눠 둔 덕분에, 처리기 하나만 더하면 됩니다.' },
          { type: 'figure', html: SVG_FUNNEL, caption: '버튼 클릭과 키보드 입력이 같은 동작 메서드로 모인다' },
          { type: 'table', head: ['키', '<code>e.Key</code>', '동작'], rows: [
            ['0~9 (위쪽 숫자 줄)', '<code>Key.D0</code> ~ <code>Key.D9</code> (Shift 없이)', '<code>InputDigit</code> — <code>e.Key - Key.D0</code> 이 곧 숫자'],
            ['숫자 키패드 0~9', '<code>Key.NumPad0</code> ~ <code>Key.NumPad9</code>', '<code>InputDigit</code>'],
            ['+ − * /', '<code>Add</code> · <code>Subtract</code> · <code>Multiply</code> · <code>Divide</code> (키패드), <code>Shift</code>+<code>OemPlus</code> · <code>OemMinus</code> · <code>Shift</code>+<code>D8</code> · <code>OemQuestion</code>', '<code>ApplyOperator</code>'],
            ['Enter · =', '<code>Enter</code> · <code>OemPlus</code>(Shift 없이)', '<code>Calculate</code>'],
            ['. · %', '<code>Decimal</code> · <code>OemPeriod</code> / <code>Shift</code>+<code>D5</code>', '<code>InputPoint</code> / <code>Percent</code>'],
            ['Backspace · Delete · Esc', '<code>Back</code> · <code>Delete</code> · <code>Escape</code>', '<code>Backspace</code> · <code>ClearEntry</code> · <code>ClearAll</code>']
          ], caption: '키 → 동작 메서드. 같은 글자라도 키보드의 어느 키인지에 따라 e.Key 가 다르다' },
          { type: 'p', html: '<b>왜 KeyDown 이 아니라 PreviewKeyDown 일까?</b> 키 이벤트는 키보드 포커스를 가진 요소에서 시작합니다. <code>Preview…</code> 이벤트는 창 → … → 그 요소 순서로 <b>내려가는</b>(터널링) 이벤트라서 창이 가장 먼저 받습니다. 반면 <code>KeyDown</code> 은 그 요소 → 창으로 <b>올라오는</b>(버블링) 이벤트라서, 도중에 버튼이 Enter 를 먼저 처리하고 <code>Handled = true</code> 로 만들어 버리면 창까지 오지 않습니다. 처리한 키는 <code>e.Handled = true</code> 로 표시해 다른 요소가 또 처리하지 않게 합니다.' },
          { type: 'code', title: '단계 7. 키보드로 계산하기 — PreviewKeyDown', code: STEP7, desc: 'XAML 의 <code>&lt;Window … PreviewKeyDown="Window_PreviewKeyDown"&gt;</code> 로 창 전체의 키를 받습니다. 숫자는 <code>e.Key - Key.D0</code> 처럼 <b>열거형 값끼리 빼서</b> 0~9 를 얻습니다(Key.D0 ~ Key.D9 가 연속된 값이기 때문). <code>switch</code> 의 <code>case Key.OemPlus when shift:</code> 는 “= 키를 Shift 와 함께 누른 경우(+)” 이고, 그 아래의 <code>case Key.OemPlus:</code> 는 Shift 없이 누른 = 입니다. 스타일 <code>CalcButton</code> 에 <code>Focusable = False</code> 를 더해 버튼이 포커스를 가져가지 않게 했습니다. 이 줄이 없으면 7 버튼을 마우스로 누른 뒤 Enter 를 칠 때 포커스를 가진 <b>7 버튼이 한 번 더 눌리는</b> 일이 생깁니다.' },
          { type: 'callout', kind: 'warn', title: '웹 실습 화면에서 키보드를 시험할 때', html: '<ul><li>키 입력은 <b>포커스가 있는 창</b>으로 갑니다. 실행 창을 한 번 클릭한 뒤 키를 누르세요. 버튼 스타일의 <code>Focusable="False"</code> 덕분에 버튼을 마우스로 누른 뒤에도 포커스가 버튼으로 옮겨 가지 않아, <b>Enter</b> · <b>Space</b> 가 버튼을 한 번 더 누르지 않습니다(브라우저 실행 창 · 실제 WPF 모두).</li><li>한글 입력 상태(한/영)에서는 숫자 키가 다르게 들어올 수 있습니다. 영문 상태로 바꿔서 시험하세요.</li></ul>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 디버거로 상태 변수 지켜보기', html: '<ul><li><code>ApplyOperator</code> 의 첫 줄 왼쪽 여백을 클릭(또는 <kbd>F9</kbd>)해 <b>중단점</b>을 둡니다. <kbd>F5</kbd> 로 실행하고 <code>12 + 3 ×</code> 를 누르면 × 에서 멈춥니다.</li><li>메뉴 <b>디버그 → 창 → 조사식</b>(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>W</kbd>, <kbd>1</kbd>)에 <code>entry</code>, <code>storedValue</code>, <code>pendingOp</code>, <code>isNewEntry</code> 를 적어 두면 <kbd>F10</kbd>(한 줄씩 실행)을 누를 때마다 값이 바뀌는 것이 빨간색으로 보입니다. 1교시의 상태 표와 비교해 보세요.</li><li>중단점을 오른쪽 클릭 → <b>조건</b>에 <code>pendingOp == "/"</code> 를 적으면 나눗셈일 때만 멈춥니다.</li><li>단계 5 에서 <code>8 ÷ 0 =</code> 을 누르면 디버거가 <code>a / b</code> 줄에서 <b>예외 발생</b> 창을 띄웁니다. 처리하지 않은 예외가 어디서 났는지 바로 알 수 있습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P4-5. = 을 반복해서 누르기',
            level: 3,
            desc: '<p>Windows 계산기에서 <code>5 + 3 =</code> 뒤에 <code>=</code> 을 계속 누르면 8 → 11 → 14 처럼 <b>마지막 연산(+ 3)을 되풀이</b>합니다. 단계 7 의 계산기에 이 기능을 더하세요.</p><ul><li>필드 <code>lastOp</code>(마지막 연산자), <code>lastOperand</code>(그때의 두 번째 수)를 추가</li><li><code>Calculate</code>: <code>pendingOp</code> 가 있으면 지금처럼 계산하고 <code>lastOp</code> · <code>lastOperand</code> 를 기억. <code>pendingOp</code> 가 없고 <code>lastOp</code> 가 있으면 “지금 수 lastOp lastOperand” 를 계산</li><li><code>ClearAll</code>(C) 에서는 <code>lastOp = null</code></li><li>시험: <code>5 + 3 = = =</code> → 14, <code>10 − 1 = =</code> → 8, <code>2 × =</code> → 4 (2 × 2)</li></ul>',
            hint: '<code>Calculate</code> 첫 부분에서 <code>string op; decimal left, right;</code> 를 선언하고 두 경우에 따라 값을 채운 뒤, 아래의 계산 · 식 표시 코드는 하나로 함께 씁니다. 연산자를 새로 누르면 <code>pendingOp</code> 가 생기므로 자연스럽게 “새 연산” 이 됩니다. <code>2 × =</code> 는 isNewEntry 상태에서 CurrentValue(2)가 두 번째 수가 되어 2 × 2 입니다.',
            starter: PR5_S,
            solution: PR5_A
          },
          {
            title: '실습 P4-6. 오류 상태에서는 연산자 버튼 끄기',
            level: 2,
            desc: '<p>오류 메시지가 보이는 동안 연산자를 눌러도 아무 일이 없으므로, 아예 <b>버튼을 비활성(회색)</b>으로 만들어 사용자에게 알려 줍시다. <code>UpdateDisplay</code> 끝에서 부르는 <code>UpdateButtons()</code> 를 완성하세요.</p><ul><li>버튼판(<code>pad</code>)의 자식 중 <b>Tag 가 있는 버튼</b>(= 연산자 4개)의 <code>IsEnabled</code> 를 <code>!hasError</code> 로</li><li><code>=</code> 버튼(<code>x:Name="btnEquals"</code>)도 같이</li><li>시험: <code>8 ÷ 0 =</code> → 연산자 · = 가 회색 → 숫자를 누르면 다시 켜짐</li></ul>',
            hint: '<code>foreach (UIElement child in pad.Children)</code> 로 UniformGrid 의 자식을 돌고, <code>if (child is Button button &amp;&amp; button.Tag != null)</code> 로 연산자 버튼만 고릅니다. 2교시부터 연산자에 붙여 둔 Tag 가 여기서 “이 버튼은 연산자다” 라는 표시로도 쓰입니다. 상태가 바뀔 때마다 <code>UpdateDisplay</code> 가 불리므로 버튼 상태도 항상 최신입니다.',
            starter: PR6_S,
            solution: PR6_A
          }
        ],
        quiz: [
          { q: 'decimal 변수 <code>b</code> 가 0 일 때 <code>decimal r = 8m / b;</code> 를 실행하면?', options: ['r 은 무한대(∞)', 'r 은 0', 'DivideByZeroException 발생', 'OverflowException 발생'], answer: 2, explain: '정수와 decimal 은 0 으로 나누면 DivideByZeroException 이 납니다. double 만 예외 없이 ∞ 가 됩니다. 그래서 계산기는 나누기 전에 b == 0 을 먼저 검사합니다.' },
          { q: '완성된 계산기에서 <code>12 + ×</code> 를 누른 뒤 <code>2 =</code> 을 누르면?', options: ['24', '26', '14', '48'], answer: 0, explain: '연산자를 연달아 누르면(isNewEntry 가 true 인 상태) 계산 없이 연산자만 바뀝니다. 12 × 2 = 24.' },
          { q: '창에 <code>KeyDown</code> 대신 <code>PreviewKeyDown</code> 을 쓰는 이유로 가장 알맞은 것은?', options: ['Preview 이벤트가 더 빠르게 실행되는 코드라서', '터널링 이벤트라 포커스를 가진 요소보다 창이 먼저 받기 때문에', 'KeyDown 은 숫자 키를 받지 못해서', 'Preview 이벤트만 e.Handled 를 쓸 수 있어서'], answer: 1, explain: 'Preview 이벤트는 창 → 자식 방향으로 내려갑니다. 버튼 등이 키를 먼저 처리해 Handled 로 만들기 전에 창이 가로챌 수 있습니다.' },
          { q: '이 프로젝트의 % 규칙으로 <code>200 − 10 %</code> 를 누르면 화면은?', options: ['180', '199.9', '20', '190'], answer: 0, explain: '− 가 기다리고 있으므로 “앞의 수 200 의 10%” = 20 을 두 번째 수로 삼고 바로 계산합니다: 200 − 20 = 180 (10% 할인).' },
          { q: '계산기 버튼 스타일에 <code>&lt;Setter Property="Focusable" Value="False"/&gt;</code> 를 넣지 않으면 생기는 문제는?', options: ['버튼을 마우스로 누를 수 없다', '마우스로 7 을 누른 뒤 Enter 를 치면 7 버튼이 한 번 더 눌릴 수 있다', 'PreviewKeyDown 이 전혀 오지 않는다', '버튼 글자가 보이지 않는다'], answer: 1, explain: '버튼이 포커스를 가지면 Enter · Space 로 그 버튼이 눌립니다. Focusable 을 끄면 포커스가 창에 남아 키는 모두 PreviewKeyDown 에서 처리됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ②', subtitle: '단계 5 사칙연산 → 단계 6 0 나누기 · 넘침 · % → 단계 7 키보드', badge: 'Project 04 · 3교시',
            notes: '<p><b>[복습 3분]</b> 단계 4 예제를 실행해 C · CE 가 아직 똑같이 동작한다는 점을 보여 주고, “오늘 storedValue · pendingOp 가 들어오면 달라진다” 고 예고합니다.</p>' },
          { layout: 'table', title: '단계 5. 연산자를 누르면 — 세 가지 경우', head: ['상황', '조건', '할 일'], rows: [['첫 연산자', '<code>pendingOp == null</code>', '화면 수 → 앞의 수'], ['앞 연산 + 새 수', '<code>pendingOp != null &amp;&amp; !isNewEntry</code>', '먼저 계산 (12 + 3 × → 15 ×)'], ['연달아 누름', '<code>pendingOp != null &amp;&amp; isNewEntry</code>', '연산자만 바꿈']],
            lead: '끝에는 언제나 pendingOp = op, isNewEntry = true',
            notes: '<p><b>[6분]</b> 1교시 상태 모형(콘솔)의 <code>else</code> 부분과 똑같다는 것을 보여 주세요. 본문 단계 5 예제를 실행해 <code>12 + 3 × 4 =</code>, <code>7 + × 2 =</code> 을 확인합니다.</p>' },
          { layout: 'bullets', title: '= 과 결과 표시', bullets: ['식 줄: <code>12 + 3 =</code> (<code>Symbol</code> 로 × ÷)', '결과 → <code>entry = FormatNumber(result)</code>', '소수 10자리 반올림 · 끝의 0 떼기', '<code>pendingOp = null</code>, <code>isNewEntry = true</code>', '읽기 · 쓰기에 <code>CultureInfo.InvariantCulture</code>'],
            notes: '<p><b>[4분]</b> 마지막에 <code>8 ÷ 0 =</code> 을 눌러 프로그램이 멈추는 것을 일부러 보여 줍니다(웹에서는 처리되지 않은 예외 메시지). “사용자가 0 으로 나눴다고 프로그램이 꺼지면?” 으로 단계 6 을 연결하세요.</p>' },
          { layout: 'code', title: '단계 6. 예외 대신 오류 상태 — TryCompute', code: SL_TRY, points: ['예측할 수 있는 오류(÷ 0)는 <b>미리 검사</b>', '넘침은 <code>catch (OverflowException)</code>', '실패하면 false → 호출한 쪽은 바로 return', '계산기에서는 ShowError 로 hasError = true'],
            notes: '<p><b>[6분]</b> 실습 P4-1 에서 만든 함수와 같습니다. 본문 추가 예제로 decimal 의 두 예외와 double 의 ∞ 를 비교하세요. MaxValue + 1 이 예외가 아닌 이유(유효 숫자 반올림)는 흥미로운 발문 거리입니다.</p>' },
          { layout: 'bullets', title: '오류 상태에서의 규칙 · % 규칙', bullets: ['오류 중 숫자 · . · C · CE · ⌫ → 새로 시작', '오류 중 연산자 · = · ± · % → 무시', '% 연산자 없음: 10 % → 0.1', '+ − 뒤: 50 + 10 % → 50 + 5 = 55', '× ÷ 뒤: 50 × 10 % → 5'],
            notes: '<p><b>[6분]</b> 본문 단계 6 예제로 <code>8 ÷ 0</code>, 아주 큰 수 곱하기, % 세 가지를 시연합니다. % 는 계산기마다 다르므로 “요구사항 표에 규칙을 적어 두는 것” 이 중요하다는 점을 다시 강조하세요.</p>' },
          { layout: 'diagram', title: '단계 7. 입력이 모이는 곳', html: SVG_FUNNEL, caption: '버튼 처리기 · 키보드 처리기 → 같은 동작 메서드',
            notes: '<p><b>[3분]</b> 2교시에 코드를 세 층으로 나눈 이유가 여기서 드러납니다. “키보드 처리기 안에 InputDigit 코드를 복사했다면?” → 규칙을 고칠 때 두 곳을 고쳐야 하고 버튼과 키보드의 동작이 달라질 수 있다.</p>' },
          { layout: 'code', title: 'PreviewKeyDown 으로 키 받기', code: SL_KEY, points: ['<code>e.Key - Key.D0</code> = 숫자', 'Shift 는 <code>Keyboard.Modifiers</code> 로', '처리한 키는 <code>e.Handled = true</code>', '모르는 키는 그대로 (<code>return</code>)'],
            notes: '<p><b>[5분]</b> 위쪽 숫자 줄과 숫자 키패드가 다른 Key 값이라는 것을 직접 눌러 확인합니다. 웹 실습에서는 창 안을 한 번 클릭해 포커스를 준 뒤 키를 눌러야 합니다.</p>' },
          { layout: 'two', title: 'KeyDown vs PreviewKeyDown', left: { title: 'KeyDown (버블링)', bullets: ['포커스 요소 → … → 창', '버튼이 Enter 를 먼저 처리하면', '→ Handled 라서 창까지 안 옴', '입력 칸의 글자 입력 뒤에 반응할 때'] }, right: { title: 'PreviewKeyDown (터널링)', bullets: ['창 → … → 포커스 요소', '창이 <b>가장 먼저</b> 받는다', '처리하면 <code>e.Handled = true</code>', '+ 버튼은 <code>Focusable = False</code>'] },
            notes: '<p><b>[4분]</b> 17장의 라우팅 이벤트 그림을 떠올리게 합니다. Focusable 설명: 포커스를 가진 버튼은 Enter · Space 로 눌리므로, 계산기 버튼은 포커스를 받지 않게 스타일에서 한 번에 끕니다. 웹 실행 환경의 한계(본문 warn 상자)도 알려 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>200 − 10 %</code> 를 누르면?', options: ['180', '199.9', '20', '190'], answer: 0, explain: '− 뒤의 % 는 “앞의 수의 몇 %” → 200 − 20 = 180.',
            notes: '<p>이어서 <code>200 × 10 %</code> 는? → 20. 규칙이 연산자에 따라 다르다는 점을 확인합니다.</p>' },
          { layout: 'practice', title: '실습 P4-5 · P4-6', desc: '<p>P4-5(도전): <code>5 + 3 = = =</code> → 14 가 되도록 마지막 연산 되풀이. P4-6: 오류 상태에서 Tag 가 있는 버튼(연산자)과 = 버튼을 비활성으로.</p>', starter: PR6_S, solution: PR6_A,
            notes: '<p><b>[실습]</b> P4-6 이 더 쉬우므로 먼저 하게 하고, 빨리 끝난 학생에게 P4-5 를 권합니다. P4-5 는 상태 변수를 하나 더하면 상태 다이어그램이 어떻게 바뀌는지 그려 보게 하면 좋습니다.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: ['연산자 세 경우: 첫 연산자 · 먼저 계산 · 연산자만 바꿈', '= → 식 표시, 결과 → entry, 결과 표시 상태', '÷ 0 은 미리 검사, 넘침은 catch → hasError', '% 는 휴대용 계산기 방식', 'PreviewKeyDown + e.Handled + Focusable=False', '버튼과 키보드가 같은 동작 메서드를 쓴다'],
            notes: '<p>다음 교시 예고: 오른쪽에 계산 기록을 붙여 완성하고, 확장 과제(1/x · 메모리 · 엔진 분리)에 도전합니다.</p>' }
        ]
      },
      /* ===================================================================== p04-4 */
      {
        id: 'p04-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          'ListBox 의 Items 와 DataTemplate 으로 계산 기록을 보여 줄 수 있다',
          '완성 프로그램의 구조(상태 · 처리기 · 동작 · 화면)를 설명할 수 있다',
          '요구사항 표로 완성 프로그램을 점검할 수 있다',
          '공용 처리기와 상태 변수를 이용해 새 버튼 기능(1/x · 메모리)을 추가할 수 있다',
          '계산 규칙을 화면과 분리한 클래스로 옮겨 콘솔에서 테스트할 수 있다'
        ],
        flow: [['기록 기능 · 완성 코드 구조', 10], ['실행 · 점검', 8], ['개선 아이디어', 5], ['확장 과제', 22], ['발표 · 정리', 5]],
        content: [
          { type: 'h', text: '1. 마지막 단계 — 계산 기록' },
          { type: 'p', html: '창의 너비를 520 으로 넓히고 바깥 Grid 에 열(Column)을 하나 더해 오른쪽에 <b>기록</b>을 둡니다. 기록 한 줄은 “식” 과 “결과” 두 값을 가지므로 작은 클래스 <code>HistoryEntry</code> 로 만들고, ListBox 의 <b>DataTemplate</b>(18장)으로 식은 작은 회색, 결과는 굵게 보여 줍니다.' },
          { type: 'list', items: [
            '<b>추가</b>: <code>=</code> 로 계산이 끝날 때마다 <code>lstHistory.Items.Insert(0, new HistoryEntry(식, 결과))</code> — 0 번 자리에 넣으면 최근 기록이 맨 위에 옵니다. 20개가 넘으면 맨 아래(가장 오래된 것)를 지웁니다.',
            '<b>불러오기</b>: 기록을 고르면(<code>SelectionChanged</code>) <code>ClearAll()</code> 뒤에 그 결과를 <code>entry</code> 에 넣어 “방금 계산한 것처럼” 새로 시작합니다.',
            '<b>지우기</b>: 기록 위의 “지우기” 버튼은 <code>lstHistory.Items.Clear()</code>. 이 버튼도 <code>Focusable="False"</code> 입니다.',
            '실습 P4-3(천 단위 쉼표) · P4-4(글자 크기)의 결과도 완성 프로그램에 넣었습니다.'
          ] },
          { type: 'code', title: '추가 예제. ListBox 에 기록 쌓기 — Items.Insert 와 DataTemplate', code: SL_HISTORY, desc: '<code>record HistoryEntry(string Expression, string Result)</code> 는 속성 두 개짜리 클래스를 한 줄로 만드는 <b>레코드</b>입니다. ListBox 는 항목마다 DataTemplate 을 복사해 만들고, 그 안의 <code>{Binding Expression}</code> 은 항목 객체의 속성을 읽습니다. ItemTemplate 이 없으면 ListBox 는 항목의 <code>ToString()</code> 을 보여 주는데, 레코드의 ToString 은 <code>HistoryEntry { Expression = …, Result = … }</code> 처럼 나옵니다. 완성 프로그램에서는 초보자도 읽기 쉽도록 보통의 클래스로 만들었습니다.' },
          { type: 'h', text: '2. 완성 프로그램' },
          { type: 'table', head: ['부분', '멤버', '하는 일'], rows: [
            ['상태', '<code>entry</code> · <code>isNewEntry</code> · <code>storedValue</code> · <code>pendingOp</code> · <code>hasError</code> · <code>errorMessage</code>', '계산기가 기억하는 모든 것'],
            ['버튼 처리기', '<code>Digit_Click</code> · <code>Operator_Click</code> · <code>Clear_Click</code> …', '무엇을 눌렀는지(Content · Tag)만 알아낸다'],
            ['키보드 처리기', '<code>Window_PreviewKeyDown</code>', '키 → 같은 동작 메서드'],
            ['동작 메서드', '<code>InputDigit</code> · <code>ApplyOperator</code> · <code>Calculate</code> · <code>Percent</code> · <code>TryCompute</code> · <code>ShowError</code> …', '규칙대로 상태를 바꾼다'],
            ['기록', '<code>AddHistory</code> · <code>History_SelectionChanged</code> · <code>ClearHistory_Click</code>', 'ListBox 에 쌓고 · 불러오고 · 지운다'],
            ['화면', '<code>UpdateDisplay</code> · <code>Group</code> · <code>FontSizeFor</code> · <code>FormatNumber</code> · <code>Symbol</code>', '상태 → 글자 · 글자 크기'],
            ['<code>HistoryEntry.cs</code>', '<code>Expression</code> · <code>Result</code>', '기록 한 줄의 데이터']
          ], caption: '완성 프로그램의 구조 — 새 기능은 대부분 “처리기 하나 + 동작 메서드 하나” 로 들어간다' },
          { type: 'code', title: '완성 프로그램. WPF 계산기 (기록 · 쉼표 · 글자 크기 포함)', code: FINAL, desc: '<code>12 + 3 × 4 =</code>, <code>0.1 + 0.2 =</code>, <code>1 ÷ 3 =</code>, <code>8 ÷ 0 =</code>, <code>50 + 10 %</code>, 키보드 입력, 기록 클릭을 차례로 시험해 보세요. 모든 동작은 상태 변수를 바꾸고 <code>UpdateDisplay()</code> 로 끝나므로, 무엇이 이상하면 “그 순간 상태 변수가 무엇이었나” 를 디버거로 보면 원인을 찾을 수 있습니다.' },
          { type: 'callout', kind: 'tip', title: '최종 점검 체크리스트 (1교시 요구사항 표)', html: '<ul><li>☐ F1 <code>0 0 7 . . 5</code> → 7.5, 17번째 숫자는 무시</li><li>☐ F2 <code>12 + 3 × 4 =</code> → 60, <code>0.1 + 0.2 =</code> → 0.3</li><li>☐ F3 <code>7 + × 2 =</code> → 14</li><li>☐ F4 <code>8 ÷ 0 =</code> → 메시지, 이어서 숫자 → 새로 시작 / 아주 큰 수 곱하기 → “수가 너무 큽니다”</li><li>☐ F5 <code>12 + 34</code> 에서 CE → <code>5 =</code> → 17, C → 처음부터, ⌫ · ± 동작</li><li>☐ F6 <code>50 + 10 %</code> → 55, <code>50 × 10 %</code> → 5</li><li>☐ F7 키보드 숫자 · 키패드 · Enter · Esc · Backspace · Delete</li><li>☐ F8 <code>1234567</code> → 1,234,567, 16자리 입력 시 글자가 작아짐</li><li>☐ F9 기록이 맨 위에 쌓이고, 고르면 결과를 불러옴, 지우기</li></ul>' },
          { type: 'h', text: '3. 더 좋게 만들려면?' },
          { type: 'callout', kind: 'more', title: '📘 계산 규칙을 창에서 떼어 내기 — CalculatorEngine', html: '<p>지금은 상태와 규칙이 모두 <code>MainWindow</code> 안에 있어서 “<code>12 + 3 × 4 =</code> 이 60 인가?” 를 확인하려면 창을 띄우고 손으로 눌러야 합니다. 상태 변수와 동작 메서드를 <b>WPF 를 모르는 클래스</b> <code>CalculatorEngine</code> 으로 옮기고, 창은 버튼을 엔진에 전달하고 <code>engine.Display</code> 를 보여 주기만 하면, 계산 규칙을 <b>콘솔에서 자동으로 테스트</b>할 수 있습니다(확장 과제 3). 한 걸음 더 나아가 엔진에 <code>INotifyPropertyChanged</code> 와 명령(ICommand)을 붙이면 20장의 <b>MVVM</b> 구조가 되고, 다음 프로젝트 P05 가 바로 그 방식입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 반올림 오차와 “결과를 그대로 기억하기”', html: '<p><code>1 ÷ 3 =</code> 뒤에 <code>× 3 =</code> 을 누르면 0.9999999999 가 나옵니다. 결과를 화면 문자열(<code>0.3333333333</code>, 10자리 반올림)로 바꾼 뒤 그 문자열을 다시 읽어 계산하기 때문입니다. Windows 계산기처럼 1 이 나오게 하려면 마지막 결과를 decimal 그대로 따로 기억해 두었다가(<code>decimal? lastResult</code>), 사용자가 새 숫자를 치지 않았으면 문자열 대신 그 값을 쓰면 됩니다. “화면에 보이는 값” 과 “계산에 쓰는 값” 을 나누는 설계입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 공학용 계산기 — 연산자 우선순위', html: '<p><code>2 + 3 × 4</code> 를 14 로 계산하려면 식 전체를 기억해야 합니다. 숫자와 연산자를 목록에 모았다가 = 에서 ① × ÷ 를 먼저 계산하고 ② + − 를 계산하는 방법이 가장 간단하고, 괄호까지 다루려면 <b>두 개의 스택</b>(수 · 연산자)을 쓰는 “셔팅 야드(shunting-yard)” 알고리즘을 씁니다. 12장의 <code>Stack&lt;T&gt;</code> 로 도전해 볼 만한 주제입니다.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 exe 파일로 배포하기', html: '<ul><li>솔루션 탐색기에서 프로젝트를 오른쪽 클릭 → <b>게시</b> → 대상 <b>폴더</b> → 위치를 정하고 <b>마침</b>.</li><li>게시 프로필의 <b>모든 설정 표시</b>에서 배포 모드를 <b>자체 포함</b>(Self-contained), 대상 런타임을 <b>win-x64</b>, 파일 게시 옵션에서 <b>단일 파일 생성</b>을 고르면 .NET 이 설치되지 않은 PC 에서도 exe 하나로 실행됩니다(대신 파일이 커집니다).</li><li>프로그램 아이콘은 프로젝트 속성(<kbd>Alt</kbd>+<kbd>Enter</kbd>) → <b>애플리케이션</b> → <b>Win32 리소스</b>의 아이콘에 .ico 파일을 지정합니다. 창 제목 표시줄의 아이콘은 <code>&lt;Window Icon="calc.ico"&gt;</code> 로 따로 정합니다.</li><li>빌드 구성을 <b>Debug</b> 에서 <b>Release</b> 로 바꿔 게시하세요. 더 작고 빠른 exe 가 만들어집니다.</li></ul>' },
          { type: 'h', text: '4. 확장 과제' },
          { type: 'list', items: [
            '<b>과제 1 (응용)</b> 1/x · x² · √x — 수 하나로 바로 계산하는 버튼 3개 (0 나누기 · 넘침 · 음수 제곱근 처리)',
            '<b>과제 2 (응용)</b> 메모리 — MC · MR · M+ · M− 버튼과 표시 창의 “M” 표시',
            '<b>과제 3 (도전)</b> 계산 엔진 분리 — 상태와 규칙을 <code>CalculatorEngine</code> 클래스로 옮기고 콘솔에서 자동 테스트'
          ] },
          { type: 'p', html: '과제 1 · 2 는 XAML 에 버튼 줄 하나(Tag 로 종류 구분)와 공용 처리기 하나를 더하는 것으로 끝납니다. 기존 동작 메서드(<code>TryCompute</code>, <code>ShowError</code>, <code>UpdateDisplay</code>)를 그대로 다시 쓰는지 확인하세요. 과제 3 은 코드를 옮기는 연습(리팩터링)이며, 테스트가 모두 “통과” 하면 창 없이도 계산 규칙이 맞다는 것을 증명한 셈입니다.' }
        ],
        practice: [
          {
            title: '확장 과제 1. 1/x · x² · √x 버튼',
            level: 2,
            desc: '<p>완성 프로그램에 수 하나로 바로 계산하는 버튼 줄을 더했습니다(XAML 완성, <code>Tag="inv" "sqr" "sqrt"</code>, 공용 처리기 <code>Unary_Click</code>). <code>ApplyUnary(string kind)</code> 를 완성하세요.</p><ul><li><code>inv</code>: 1 ÷ x (0 이면 “0으로 나눌 수 없습니다”)</li><li><code>sqr</code>: x × x (넘치면 “수가 너무 큽니다”)</li><li><code>sqrt</code>: √x (음수면 “음수의 제곱근은 없습니다”)</li><li>결과는 입력한 수처럼 다룬다: <code>12 + 9 √x =</code> → 15</li></ul>',
            hint: '<code>TryCompute(1, "/", x, out result)</code> 처럼 이미 만든 메서드에 맡기면 0 나누기 · 넘침 처리를 다시 쓸 필요가 없습니다. decimal 에는 제곱근 함수가 없으므로 <code>(decimal)Math.Sqrt((double)x)</code> 로 double 에서 계산해 되돌립니다. 결과 뒤에 <code>isNewEntry = false</code> 로 두면 이어서 누른 연산자가 이 값으로 계산됩니다(대신 숫자를 이어 누르면 뒤에 붙습니다 — 이 차이까지 없애려면 상태 변수가 하나 더 필요합니다. 어떤 변수일지 생각해 보세요).',
            starter: EX1_S,
            solution: EX1_A
          },
          {
            title: '확장 과제 2. 메모리 MC · MR · M+ · M−',
            level: 2,
            desc: '<p>메모리 버튼 줄(Tag <code>"MC" "MR" "M+" "M-"</code>, 공용 처리기 <code>Memory_Click</code>)과 표시 창 왼쪽 위의 노란 <b>M</b>(<code>txtMemory</code>, 처음엔 Hidden)이 준비되어 있습니다.</p><ul><li>필드 <code>decimal memory</code>, <code>bool hasMemory</code> 추가</li><li>MC 지우기 · MR 불러오기 · M+ 더하기 · M− 빼기</li><li>메모리에 수가 있으면 M 표시 (<code>UpdateDisplay</code>)</li><li>시험: <code>100 M+</code> → <code>30 M−</code> → <code>C</code> → <code>MR</code> → 70, <code>5 + MR =</code> → 75</li></ul>',
            hint: '<code>switch (kind)</code> 로 네 경우를 나눕니다. M+ 와 M− 는 <code>TryCompute(memory, kind == "M+" ? "+" : "-", CurrentValue, out decimal sum)</code> 한 줄로 함께 처리할 수 있습니다. 메모리는 C 로 지우지 않습니다(MC 로만). 표시: <code>txtMemory.Visibility = hasMemory ? Visibility.Visible : Visibility.Hidden;</code> — Hidden 은 자리는 차지하고 안 보이게, Collapsed 는 자리도 없애는 값입니다.',
            starter: EX2_S,
            solution: EX2_A
          },
          {
            title: '확장 과제 3. 계산 엔진 분리와 자동 테스트',
            level: 3,
            desc: '<p>계산기의 상태와 규칙을 WPF 를 모르는 클래스 <code>CalculatorEngine</code> 으로 옮기고, 콘솔에서 자동 테스트합니다. <code>Program.cs</code> 의 테스트는 완성되어 있습니다. 글자 하나가 버튼 하나이고(<code>C</code> = C 버튼), 끝난 뒤의 <code>engine.Display</code> 를 기대값과 비교합니다.</p><ul><li><code>MainWindow</code> 의 동작 메서드에서 <b>컨트롤을 쓰는 줄</b>(<code>UpdateDisplay()</code>, <code>txtExpression.Text</code>)만 바꾸거나 빼고 옮긴다</li><li>식은 <code>Expression</code> 속성에, 오류는 <code>Display</code> 가 메시지를 돌려주게</li><li>테스트 8개가 모두 <b>[통과]</b> 하면 성공</li></ul>',
            hint: '옮기는 순서: 필드 → <code>CurrentValue</code> · <code>FormatNumber</code> → <code>InputDigit</code> · <code>InputPoint</code> · <code>ClearAll</code> → <code>TryCompute</code> · <code>SetError</code> → <code>ApplyOperator</code> · <code>Calculate</code>. 한 단계 옮길 때마다 실행해 통과 개수가 늘어나는지 보세요. 완성하면 MainWindow 는 <code>engine.InputDigit(digit); txtDisplay.Text = engine.Display;</code> 처럼 아주 얇아집니다.',
            starter: ENGINE_S,
            solution: ENGINE_A,
            expect: ENGINE_EXPECT
          }
        ],
        quiz: [
          { q: 'ListBox 에 <code>lstHistory.Items.Insert(0, item)</code> 을 하면 새 항목은 어디에 보일까?', options: ['맨 아래', '맨 위', '지금 선택한 항목 다음', '보이지 않는다 (Add 만 보인다)'], answer: 1, explain: '0 번 자리(첫 번째)에 끼워 넣으므로 맨 위에 보이고, 기존 항목은 한 칸씩 아래로 밀립니다. <code>Items.Add</code> 는 맨 아래에 붙입니다.' },
          { q: 'ListBox 에 <code>ItemTemplate</code> 없이 <code>HistoryEntry</code> 객체를 넣으면 각 줄에는 무엇이 보일까?', options: ['아무것도 보이지 않는다', '첫 번째 속성의 값', '객체의 <code>ToString()</code> 결과', '컴파일 오류가 난다'], answer: 2, explain: '템플릿이 없으면 ListBox 는 항목의 ToString() 을 글자로 보여 줍니다. 보통 클래스는 형식 이름(<code>P04Final.HistoryEntry</code>)이 나오므로 DataTemplate 을 쓰거나 ToString 을 재정의합니다.' },
          { q: '계산 규칙을 <code>CalculatorEngine</code> 클래스로 떼어 냈을 때 얻는 가장 큰 이점은?', options: ['프로그램 실행 속도가 빨라진다', '창을 띄우지 않고 코드로 계산 규칙을 자동 테스트할 수 있다', 'XAML 을 쓰지 않아도 된다', 'decimal 대신 double 을 쓸 수 있다'], answer: 1, explain: '엔진이 WPF 를 모르면 콘솔 · 테스트 프로그램에서 바로 만들어 버튼 누르기를 흉내 낼 수 있습니다. 규칙을 고칠 때마다 수십 가지 경우를 몇 초 만에 다시 확인할 수 있습니다.' },
          { q: '완성 프로그램에서 기록을 고르면 <code>ClearAll()</code> 을 먼저 부르고 결과를 <code>entry</code> 에 넣는다. 먼저 ClearAll 을 부르는 이유는?', options: ['기록 목록을 지우려고', '기다리던 연산자 · 오류 상태를 비워 “방금 계산한 결과” 처럼 새로 시작하려고', 'ListBox 의 선택을 풀려고', 'UpdateDisplay 를 부르지 않으려고'], answer: 1, explain: '예를 들어 <code>12 +</code> 상태에서 기록을 고르면 pendingOp 가 남아 뜻밖의 계산이 될 수 있습니다. 상태를 비우고 결과만 가져오면 동작이 예측 가능해집니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: '계산 기록 · 완성 프로그램 점검 · 확장 과제', badge: 'Project 04 · 4교시',
            notes: '<p><b>[도입 2분]</b> 3교시까지 만든 계산기를 실행하고 “무엇이 빠졌나?” 를 요구사항 표에서 찾게 합니다 → F9 기록. 오늘은 기록을 붙여 완성하고 남은 시간은 확장 과제입니다.</p>' },
          { layout: 'bullets', title: '계산 기록 — 설계', lead: '바깥 Grid 에 열을 하나 더: Width="170"', bullets: ['기록 한 줄 = <code>HistoryEntry</code> (Expression · Result)', '= 때마다 <code>Items.Insert(0, …)</code> — 최근이 맨 위', '20개 넘으면 <code>RemoveAt</code> 로 가장 오래된 것 삭제', '고르면 <code>ClearAll()</code> → 그 결과로 새로 시작', '지우기 버튼 → <code>Items.Clear()</code>'],
            notes: '<p><b>[4분]</b> 창 너비를 340 → 520 으로 넓히고 <code>Grid.RowSpan="3"</code> 으로 기록 열이 세 행을 모두 차지하게 한다는 점을 짚습니다.</p>' },
          { layout: 'code', title: 'Items.Insert 와 DataTemplate', code: SL_HISTORY, points: ['레코드 = 속성 두 개짜리 클래스 한 줄', '<code>Insert(0, …)</code> → 맨 위', 'DataTemplate 안의 <code>{Binding}</code> = 항목의 속성', '템플릿이 없으면 <code>ToString()</code>'],
            notes: '<p><b>[4분]</b> 1 + 4 를 먼저 넣었는데 화면 맨 위에는 3 + 4 가 보인다는 것을 확인합니다(항상 0 번에 끼워 넣으므로 최근 것이 위). ItemTemplate 부분을 지우고 실행해 ToString 결과도 보여 주세요.</p>' },
          { layout: 'table', title: '완성 프로그램 지도', head: ['부분', '예'], rows: [['상태', 'entry · isNewEntry · storedValue · pendingOp · hasError'], ['처리기', 'Digit_Click · Operator_Click · PreviewKeyDown'], ['동작', 'InputDigit · ApplyOperator · Calculate · Percent · TryCompute'], ['기록', 'AddHistory · History_SelectionChanged'], ['화면', 'UpdateDisplay · Group · FontSizeFor · FormatNumber']],
            notes: '<p><b>[4분]</b> 본문의 완성 프로그램을 실행해 체크리스트를 함께 점검합니다(짝과 서로 시험해 보기). 문제가 있으면 “어느 부분의 책임인가?” 로 찾게 하세요.</p>' },
          { layout: 'bullets', title: '최종 점검 (요구사항 F1~F9)', bullets: ['<code>0 0 7 . . 5</code> → 7.5 · <code>12 + 3 × 4 =</code> → 60', '<code>7 + × 2 =</code> → 14 · <code>0.1 + 0.2 =</code> → 0.3', '<code>8 ÷ 0</code> → 메시지 → 숫자로 새로 시작', 'CE / C / ⌫ / ± / % 규칙', '키보드 · 쉼표 · 글자 크기 · 기록'],
            notes: '<p><b>[4분]</b> 1교시에 만든 요구사항 표가 그대로 테스트 목록이 된다는 점을 다시 강조합니다. 하나라도 틀리면 그 기능의 상태 변화를 디버거 조사식으로 확인하게 하세요.</p>' },
          { layout: 'table', title: '개선 아이디어', head: ['주제', '방향'], rows: [['계산 규칙 테스트', 'CalculatorEngine 으로 분리 → 콘솔 자동 테스트'], ['MVVM', '엔진 + INotifyPropertyChanged + ICommand (P05)'], ['반올림 오차', '마지막 결과를 decimal 그대로 기억'], ['연산자 우선순위', '식 전체 기억 + 스택 (공학용)'], ['배포', 'VS 게시 → 단일 exe']],
            notes: '<p><b>[5분]</b> 확장 과제 3 이 첫 줄이고, 두 번째 줄이 다음 프로젝트(P05)와 이어진다는 것을 알려 줍니다.</p>' },
          { layout: 'bullets', title: '확장 과제 — 하나 이상 선택', bullets: ['과제 1 (★★) 1/x · x² · √x — TryCompute 재사용', '과제 2 (★★) 메모리 MC · MR · M+ · M− · “M” 표시', '과제 3 (★★★) CalculatorEngine 분리 + 콘솔 테스트 8개', '공통: 버튼 줄 하나 + Tag + 공용 처리기 하나', '기존 동작 메서드를 고치지 않고 다시 쓰기'],
            notes: '<p><b>[안내 2분 + 실습 20분]</b> 과제 1 · 2 는 XAML 이 준비되어 있어 C# 만 쓰면 됩니다. 과제 3 은 콘솔 프로그램이므로 VS 에서는 <b>콘솔 앱</b> 프로젝트를 새로 만들어 시험합니다.</p>' },
          { layout: 'two', title: '과제 3 — 창 안의 규칙 vs 엔진', left: { title: '지금 (MainWindow 안)', code: 'private void InputDigit(string digit)\n{\n    ...\n    entry = entry == "0" ? digit : entry + digit;\n    UpdateDisplay();          // 컨트롤을 안다\n}', run: false }, right: { title: '분리 후', code: '// CalculatorEngine (WPF 모름)\npublic void InputDigit(string digit) { ... }\npublic string Display => ...;\n\n// MainWindow (얇아짐)\nengine.InputDigit(digit);\ntxtDisplay.Text = engine.Display;', run: false },
            notes: '<p><b>[3분]</b> “엔진에는 using System.Windows 가 없어야 한다” 가 규칙입니다. 20장 MVVM 의 “ViewModel 은 View 를 모른다” 와 같은 원리라는 것을 연결해 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>lstHistory.Items.Insert(0, item)</code> 의 새 항목 위치는?', options: ['맨 아래', '맨 위', '선택한 항목 다음', '보이지 않는다'], answer: 1, explain: '0 번 자리에 끼워 넣으므로 맨 위. Add 는 맨 아래.',
            notes: '<p>이어서 “20개가 넘을 때 지울 항목의 번호는?” → <code>Items.Count - 1</code> (맨 아래 = 가장 오래된 것).</p>' },
          { layout: 'practice', title: '확장 과제 1. 1/x · x² · √x', desc: '<p><code>ApplyUnary(kind)</code> 완성 — inv: 1 ÷ x, sqr: x × x, sqrt: √x. 0 나누기 · 넘침은 TryCompute, 음수 제곱근은 ShowError.</p>', starter: EX1_S, solution: EX1_A,
            notes: '<p><b>[실습]</b> TryCompute 를 다시 쓰는 것이 핵심입니다. 막히는 학생에게는 “0 나누기 처리를 또 쓰고 있다면 이미 있는 메서드를 찾아보라” 고 힌트를 주세요.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['설계: 요구사항 표 → 화면(Grid · UniformGrid) → 상태 변수', '모양: Style + BasedOn, Focusable=False', '입력: 공용 처리기(Content · Tag) + PreviewKeyDown', '동작: 상태를 바꾸고 → UpdateDisplay()', '안전: decimal, ÷ 0 미리 검사, 넘침 catch → 오류 상태', '확장: 버튼 줄 + 처리기 하나, 엔진 분리 → 테스트'],
            notes: '<p><b>[발표 · 정리 5분]</b> 확장 과제를 한 학생 두세 명이 시연하게 합니다. 다음 프로젝트 P05 에서는 같은 “상태 + 규칙” 을 MVVM(ViewModel · 명령 · 바인딩)으로 만든다고 예고합니다.</p>' }
        ]
      }
    ]
  });
})();
