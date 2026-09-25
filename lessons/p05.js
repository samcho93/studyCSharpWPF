/* Project 05. WPF 할 일 관리 (MVVM) */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  const Q = (cond, text) => (cond ? text : null);
  const L = (...xs) => xs.filter((x) => x !== null && x !== false && x !== undefined).join('\n');

  /* =====================================================================
   * 할 일 앱 코드 만들기 — 단계별 예제가 같은 파일들을 조금씩 키워 간다
   *   stage: 1 View·Model·ViewModel · 2 RelayCommand·추가 · 3 삭제·완료·남은 개수 · 4 필터(ICollectionView) · 5 JSON 저장
   *   추가 기능(true = 완성, 'todo' = 실습 시작 코드): counts(필터 개수) · toggleAll(모두 전환) · edit(제목 고치기)
   *     search(검색) · dirty(변경 표시 · 닫을 때 자동 저장) · important(중요 표시 · 정렬)
   * ===================================================================== */

  const VMBASE = (ns) => `// ===== File: ViewModels/ViewModelBase.cs =====
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ${ns}.ViewModels
{
    // 모든 ViewModel 의 부모: 속성 변경 알림 코드를 한곳에 모았다 (20장)
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // 값이 다를 때만 저장하고 알린다. 실제로 바뀌었으면 true
        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value)) return false;
            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }
}`;

  const RELAY = (ns) => `// ===== File: ViewModels/RelayCommand.cs =====
using System;
using System.Windows.Input;

namespace ${ns}.ViewModels
{
    // 실행할 일(execute)과 실행 가능 여부(canExecute)를 대리자로 받는 범용 명령 (20장)
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> execute;
        private readonly Func<object?, bool>? canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            this.execute = execute;
            this.canExecute = canExecute;
        }

        public bool CanExecute(object? parameter)
        {
            return canExecute == null || canExecute(parameter);
        }

        public void Execute(object? parameter)
        {
            execute(parameter);
        }

        // WPF 의 CommandManager 가 입력이 있을 때마다 "다시 물어봐" 신호를 보낸다
        public event EventHandler? CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}`;

  const TODO_ITEM = (ns, important) => `// ===== File: Models/TodoItem.cs =====
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace ${ns}.Models
{
    // Model: 할 일 하나. 체크박스로 IsDone 이 바뀌면 화면과 ViewModel 이 알아야 하므로 INotifyPropertyChanged
    public class TodoItem : INotifyPropertyChanged
    {
        private string title = "";
        private bool isDone;${important === true ? '\n        private bool isImportant;' : ''}

        public string Title
        {
            get { return title; }
            set { if (title == value) return; title = value; OnPropertyChanged(); }
        }

        public bool IsDone
        {
            get { return isDone; }
            set { if (isDone == value) return; isDone = value; OnPropertyChanged(); }
        }
${important === true ? `
        // 중요 표시(★): 중요한 일은 목록 위쪽에 정렬된다
        public bool IsImportant
        {
            get { return isImportant; }
            set { if (isImportant == value) return; isImportant = value; OnPropertyChanged(); }
        }
` : important === 'todo' ? `
        // TODO 1: IsDone 과 같은 모양으로 bool IsImportant 속성 만들기 (필드 isImportant 도)
` : ''}
        public event PropertyChangedEventHandler? PropertyChanged;

        private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}`;

  const CONVERTER = (ns) => `// ===== File: Converters/DoneToDecorationsConverter.cs =====
using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace ${ns}.Converters
{
    // IsDone(bool) → 글자 장식: 완료한 일은 가운데에 줄(취소선)을 긋는다 (18장 변환기)
    public class DoneToDecorationsConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return value is true ? TextDecorations.Strikethrough : new TextDecorationCollection();
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();    // 한 방향(원본 → 화면)만 쓴다
        }
    }
}`;

  const STORAGE = (ns) => `// ===== File: Services/TodoStorage.cs =====
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using ${ns}.Models;

namespace ${ns}.Services
{
    // 할 일 목록을 JSON 파일로 저장하고 불러온다 — 화면도 ViewModel 도 모르는 "창고" 역할
    public class TodoStorage
    {
        // 옵션은 한 번만 만들어 계속 쓴다 (만들 때마다 System.Text.Json 이 준비 작업을 다시 한다)
        private static readonly JsonSerializerOptions Options = new JsonSerializerOptions
        {
            WriteIndented = true,                                   // 줄바꿈 · 들여쓰기 (사람이 읽기 좋게)
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase       // Title → "title"
        };

        public string FilePath { get; }

        public TodoStorage(string filePath)
        {
            FilePath = filePath;
        }

        public bool Exists => File.Exists(FilePath);

        public void Save(IEnumerable<TodoItem> items)
        {
            string json = JsonSerializer.Serialize(items, Options);
            File.WriteAllText(FilePath, json);
        }

        // 파일이 깨졌으면 JsonException, 읽을 수 없으면 IOException 이 부른 쪽으로 전달된다
        public List<TodoItem> Load()
        {
            string json = File.ReadAllText(FilePath);
            return JsonSerializer.Deserialize<List<TodoItem>>(json, Options) ?? new List<TodoItem>();
        }
    }
}`;

  /* ---------- XAML ---------- */
  function todoXaml(o) {
    const st = o.stage, counts = o.counts;
    const radio = (label, prop, param, first) => `                <RadioButton Content="${counts ? `{Binding ${prop}}` : label}"${first ? ' IsChecked="True"' : ''} Margin="0,0,12,0"
                             Command="{Binding FilterCommand}" CommandParameter="${param}"/>`;
    const header = L(
      '// ===== File: MainWindow.xaml =====',
      `<Window x:Class="${o.ns}.MainWindow"`,
      `        ${NS}`,
      Q(st >= 3, `        xmlns:conv="clr-namespace:${o.ns}.Converters"`),
      `        Title="${o.dirty ? '{Binding WindowTitle}' : o.title}" Width="480" Height="460"${o.dirty ? ' Closing="Window_Closing"' : ''}>`);
    return L(
      header,
      Q(st >= 3, `    <Window.Resources>
        <!-- 변환기 객체를 리소스로 하나 만들어 두고 {StaticResource} 로 쓴다 -->
        <conv:DoneToDecorationsConverter x:Key="DoneToDecorations"/>
    </Window.Resources>`),
      '    <DockPanel Margin="12">',
      Q(st >= 2, `        <!-- 위: 새 할 일 입력. IsDefault="True" 라서 입력 칸에서 Enter 를 누르면 추가 버튼이 눌린다 -->
        <Grid DockPanel.Dock="Top" Margin="0,0,0,8">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="70"/>
            </Grid.ColumnDefinitions>
            <TextBox Text="{Binding NewTitle, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" FontSize="15"
                     Margin="0,0,6,0"/>
            <Button Grid.Column="1" Content="추가" IsDefault="True" Command="{Binding AddCommand}"/>
        </Grid>`),
      Q(st >= 4, L(
        '        <!-- 필터: 라디오 버튼 세 개가 같은 명령(FilterCommand)에 서로 다른 CommandParameter 를 넘긴다 -->',
        '        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">',
        Q(st >= 5, `            <Button DockPanel.Dock="Right" Content="불러오기" Width="70" Margin="6,0,0,0" Command="{Binding LoadCommand}"/>
            <Button DockPanel.Dock="Right" Content="저장" Width="56" Command="{Binding SaveCommand}"/>`),
        '            <StackPanel Orientation="Horizontal" VerticalAlignment="Center">',
        '                <TextBlock Text="보기:" Margin="0,0,8,0"/>',
        radio('전체', 'AllLabel', 'All', true),
        radio('진행 중', 'ActiveLabel', 'Active', false),
        radio('완료', 'DoneLabel', 'Done', false),
        '            </StackPanel>',
        '        </DockPanel>')),
      Q(o.search, `        <!-- 검색: 한 글자 칠 때마다 SearchText 가 바뀌고 뷰를 다시 거른다 -->
        <DockPanel DockPanel.Dock="Top" Margin="0,0,0,8">
            <TextBlock Text="검색:" VerticalAlignment="Center" Margin="0,0,8,0"/>
            <TextBox Text="{Binding SearchText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
        </DockPanel>`),
      Q(st >= 5, `        <!-- 맨 아래: 저장 · 불러오기 결과 -->
        <TextBlock DockPanel.Dock="Bottom" Text="{Binding StatusMessage}" Foreground="Gray" FontSize="12"
                   Margin="0,6,0,0"/>`),
      Q(o.edit, `        <!-- 고른 할 일의 제목 고치기: SelectedTodo.Title 에 TwoWay (마스터-디테일) -->
        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">
            <TextBlock Text="제목 고치기:" VerticalAlignment="Center" Margin="0,0,8,0"/>
            <TextBox Text="{Binding SelectedTodo.Title, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                     IsEnabled="{Binding HasSelection}"/>
        </DockPanel>`),
      L('        <!-- 아래: 남은 개수 + 명령 버튼 -->',
        '        <DockPanel DockPanel.Dock="Bottom" Margin="0,8,0,0">',
        Q(st >= 3, L(
          '            <StackPanel DockPanel.Dock="Right" Orientation="Horizontal">',
          Q(o.toggleAll, '                <Button Content="모두 전환" Width="72" Margin="0,0,6,0" Command="{Binding ToggleAllCommand}"/>'),
          '                <Button Content="완료 전환" Width="72" Command="{Binding ToggleCommand}"/>',
          '                <Button Content="완료 지우기" Width="84" Margin="6,0,0,0" Command="{Binding ClearCompletedCommand}"/>',
          '            </StackPanel>')),
        '            <TextBlock Text="{Binding Summary}" VerticalAlignment="Center" Foreground="SteelBlue"/>',
        '        </DockPanel>'),
      `        <!-- 가운데: 목록.${st >= 4 ? ' ItemsSource 는 원본(Todos)이 아니라 필터를 건 뷰(TodosView)' : ' 항목마다 DataTemplate 을 복사해 그린다'} -->`,
      `        <ListBox${st >= 3 ? ' x:Name="lstTodos"' : ''} ItemsSource="{Binding ${st >= 4 ? 'TodosView' : 'Todos'}}"${st >= 3 ? ' SelectedItem="{Binding SelectedTodo, Mode=TwoWay}"' : ''}`,
      '                 HorizontalContentAlignment="Stretch">',
      '            <ListBox.ItemTemplate>',
      '                <DataTemplate>',
      '                    <DockPanel Margin="2,3">',
      Q(st >= 3, `                        <!-- ✕: 명령은 창의 ViewModel 에 있으므로 lstTodos 의 DataContext 에서 찾고, 그 줄의 항목({Binding})을 넘긴다 -->
                        <Button DockPanel.Dock="Right" Content="✕" Width="26" Padding="0"
                                Command="{Binding DataContext.DeleteCommand, ElementName=lstTodos}"
                                CommandParameter="{Binding}"/>`),
      Q(o.important, `                        <CheckBox DockPanel.Dock="Right" Content="★" Foreground="Goldenrod" Margin="0,0,8,0"
                                  VerticalAlignment="Center" IsChecked="{Binding IsImportant, Mode=TwoWay}"/>`),
      '                        <CheckBox IsChecked="{Binding IsDone, Mode=TwoWay}" VerticalAlignment="Center"/>',
      st >= 3
        ? `                        <TextBlock Text="{Binding Title}" FontSize="14" Margin="8,0,0,0" VerticalAlignment="Center"
                                   TextDecorations="{Binding IsDone, Converter={StaticResource DoneToDecorations}}"/>`
        : '                        <TextBlock Text="{Binding Title}" FontSize="14" Margin="8,0,0,0" VerticalAlignment="Center"/>',
      '                    </DockPanel>',
      '                </DataTemplate>',
      '            </ListBox.ItemTemplate>',
      '        </ListBox>',
      '    </DockPanel>',
      '</Window>');
  }

  function codeBehind(o) {
    const ns = o.ns;
    if (o.dirty) return `// ===== File: MainWindow.xaml.cs =====
using System.ComponentModel;
using System.Windows;
using ${ns}.ViewModels;

namespace ${ns}
{
    public partial class MainWindow : Window
    {
        private readonly MainViewModel vm = new MainViewModel();

        public MainWindow()
        {
            InitializeComponent();
            DataContext = vm;
        }

        // 창이 닫히기 직전(Closing): 저장하지 않은 변경이 있으면 자동으로 저장한다
        private void Window_Closing(object? sender, CancelEventArgs e)
        {
${o.dirty === true ? `            if (vm.IsDirty)
                vm.SaveCommand.Execute(null);` : '            // TODO 4: vm.IsDirty 이면 vm.SaveCommand.Execute(null) 로 저장'}
        }
    }
}`;
    return `// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using ${ns}.ViewModels;

namespace ${ns}
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();   // View 와 ViewModel 을 잇는 한 줄 — 코드 비하인드는 이것이 전부
        }
    }
}`;
  }

  function vmCs(o) {
    const st = o.stage, ns = o.ns;
    const f3 = st >= 3, f4 = st >= 4, f5 = st >= 5;
    const usings = L(
      Q(f4, 'using System;'),
      Q(f5, 'using System.Collections.Generic;'),
      'using System.Collections.ObjectModel;',
      Q(st >= 2, 'using System.Collections.Specialized;'),
      Q(f3, 'using System.ComponentModel;'),
      Q(f5, 'using System.IO;'),
      'using System.Linq;',
      Q(f5, 'using System.Text.Json;'),
      Q(f4, 'using System.Windows.Data;'),
      Q(st >= 2, 'using System.Windows.Input;'),
      `using ${ns}.Models;`,
      Q(f5, `using ${ns}.Services;`));

    const fields = st < 2 ? '        // (단계 1 은 목록과 계산 속성만 — 필드는 단계 2 부터)' : L(
      '        // ── 필드 ──',
      Q(st >= 2, '        private string newTitle = "";'),
      Q(f3, '        private TodoItem? selectedTodo;'),
      Q(f4, '        private TodoFilter filter = TodoFilter.All;'),
      Q(o.search === true, '        private string searchText = "";'),
      Q(f5, '        private readonly TodoStorage storage = new TodoStorage("todos.json");   // 작업 폴더의 todos.json'),
      Q(f5, '        private string statusMessage = "";'),
      Q(o.dirty, '        private bool isDirty;'));

    const props = L(
      '',
      '        // Model 목록: 추가 · 삭제가 일어나면 화면(ListBox)에 알려 주는 컬렉션',
      '        public ObservableCollection<TodoItem> Todos { get; } = new ObservableCollection<TodoItem>();',
      Q(f4, `
        // 화면이 실제로 보여 주는 "뷰": 원본(Todos)은 그대로 두고 필터로 걸러서 보여 준다
        public ICollectionView TodosView { get; }`),
      Q(st >= 2, `
        public string NewTitle
        {
            get { return newTitle; }
            set { SetProperty(ref newTitle, value); }
        }`),
      Q(f3, o.edit === true ? `
        public TodoItem? SelectedTodo
        {
            get { return selectedTodo; }
            set { if (SetProperty(ref selectedTodo, value)) OnPropertyChanged(nameof(HasSelection)); }
        }

        // 고른 항목이 있을 때만 "제목 고치기" 칸을 켠다
        public bool HasSelection => SelectedTodo != null;` : o.edit === 'todo' ? `
        // TODO 1: 값이 바뀌면 HasSelection 도 알리기
        public TodoItem? SelectedTodo
        {
            get { return selectedTodo; }
            set { SetProperty(ref selectedTodo, value); }
        }

        // TODO 2: 고른 항목이 있으면 true 인 계산 속성 HasSelection 만들기 (XAML 의 IsEnabled 가 쓴다)` : `
        public TodoItem? SelectedTodo
        {
            get { return selectedTodo; }
            set { SetProperty(ref selectedTodo, value); }
        }`),
      Q(f4, `
        // 필터가 바뀌면 뷰를 다시 거른다
        public TodoFilter Filter
        {
            get { return filter; }
            set { if (SetProperty(ref filter, value)) RefreshView(); }
        }`),
      Q(o.search === true, `
        // 검색어: 한 글자 바뀔 때마다 다시 거른다
        public string SearchText
        {
            get { return searchText; }
            set { if (SetProperty(ref searchText, value)) RefreshView(); }
        }`),
      Q(o.search === 'todo', `
        // TODO 1: string SearchText 속성 (필드 searchText = "") — 값이 바뀌면 RefreshView()`),
      Q(f5, `
        public string StatusMessage
        {
            get { return statusMessage; }
            set { SetProperty(ref statusMessage, value); }
        }`),
      Q(o.dirty, `
        // 저장한 뒤에 바뀐 것이 있는가 — 창 제목 끝에 * 로 보인다
        public bool IsDirty
        {
            get { return isDirty; }
            private set { if (SetProperty(ref isDirty, value)) OnPropertyChanged(nameof(WindowTitle)); }
        }

        public string WindowTitle => IsDirty ? "할 일 관리 — MVVM *" : "할 일 관리 — MVVM";`),
      `
        // 계산 속성${st >= 2 ? ': 목록이나 항목의 IsDone 이 바뀔 때마다 NotifyCounts() 로 다시 알린다' : ''}
        public int RemainingCount => Todos.Count(t => !t.IsDone);
        public int DoneCount => Todos.Count(t => t.IsDone);
        public string Summary => $"남은 일 {RemainingCount}개 · 완료 {DoneCount}개";`,
      Q(o.counts === true, `
        // 필터 라디오 버튼의 글자: "진행 중 (2)"
        public string AllLabel => $"전체 ({Todos.Count})";
        public string ActiveLabel => $"진행 중 ({RemainingCount})";
        public string DoneLabel => $"완료 ({DoneCount})";`),
      Q(o.counts === 'todo', `
        // TODO 1: 계산 속성 AllLabel · ActiveLabel · DoneLabel — "전체 (3)" "진행 중 (2)" "완료 (1)"`),
      Q(st >= 2, L(
        '',
        '        public ICommand AddCommand { get; }',
        Q(f3, '        public ICommand DeleteCommand { get; }'),
        Q(f3, '        public ICommand ToggleCommand { get; }'),
        Q(f3, '        public ICommand ClearCompletedCommand { get; }'),
        Q(o.toggleAll, '        public ICommand ToggleAllCommand { get; }'),
        Q(f4, '        public ICommand FilterCommand { get; }'),
        Q(f5, '        public ICommand SaveCommand { get; }'),
        Q(f5, '        public ICommand LoadCommand { get; }'))));

    const seed = (indent) => L(
      `${indent}Todos.Add(new TodoItem { Title = "P05 요구사항 읽기", IsDone = true });`,
      `${indent}Todos.Add(new TodoItem { Title = "TodoItem 모델 만들기" });`,
      `${indent}Todos.Add(new TodoItem { Title = "필터 · 저장 기능 완성하기"${o.important === true ? ', IsImportant = true' : ''} });`);

    const ctor = L(
      '        public MainViewModel()',
      '        {',
      Q(f4, `            // 원본 컬렉션의 "기본 뷰" 를 얻어 필터 함수를 건다
            TodosView = CollectionViewSource.GetDefaultView(Todos);
            TodosView.Filter = FilterTodo;`),
      Q(o.important === true, '            TodosView.SortDescriptions.Add(new SortDescription(nameof(TodoItem.IsImportant), ListSortDirection.Descending));   // 중요한 일 먼저'),
      Q(o.important === 'todo', '            // TODO 3: TodosView.SortDescriptions 에 IsImportant 내림차순(ListSortDirection.Descending) 정렬 추가'),
      Q(f4 || o.important, ''),
      Q(st >= 2, '            AddCommand = new RelayCommand(_ => AddTodo(), _ => !string.IsNullOrWhiteSpace(NewTitle));'),
      Q(f3, `            DeleteCommand = new RelayCommand(p => DeleteTodo(p));                  // p = ✕ 를 누른 줄의 TodoItem
            ToggleCommand = new RelayCommand(_ => ToggleSelected(), _ => SelectedTodo != null);
            ClearCompletedCommand = new RelayCommand(_ => ClearCompleted(), _ => DoneCount > 0);`),
      Q(o.toggleAll === true, '            ToggleAllCommand = new RelayCommand(_ => ToggleAll(), _ => Todos.Count > 0);'),
      Q(o.toggleAll === 'todo', `            // TODO: 할 일이 하나라도 있을 때만 실행 가능. 남은 일이 있으면 모두 완료로, 모두 완료였으면 모두 해제
            ToggleAllCommand = new RelayCommand(_ => { });`),
      Q(f4, '            FilterCommand = new RelayCommand(p => SetFilter(p));                   // p = "All" · "Active" · "Done"'),
      Q(f5, `            SaveCommand = new RelayCommand(_ => Save());
            LoadCommand = new RelayCommand(_ => Load(), _ => storage.Exists);`),
      Q(st >= 2, `
            // 목록이 바뀔 때(추가 · 삭제) 알림을 받는다 — 처음 항목을 넣기 전에 구독해야 한다
            Todos.CollectionChanged += Todos_CollectionChanged;
`),
      f5 ? `            if (storage.Exists)
            {
                Load();                                  // 저장해 둔 목록이 있으면 불러오고
            }
            else
            {
${seed('                ')}
                StatusMessage = "새 목록입니다 — 저장하면 todos.json 이 만들어집니다";
            }` : seed('            '),
      Q(o.dirty === true, '            IsDirty = false;                             // 막 불러온(만든) 상태 = 바뀐 것 없음'),
      '        }');

    const methods = [];
    if (st >= 2) methods.push(`        private void AddTodo()
        {
            Todos.Add(new TodoItem { Title = NewTitle.Trim() });
            NewTitle = "";                               // 입력 칸 비우기 (TwoWay 라서 TextBox 도 비워진다)
        }`);
    if (f3) methods.push(`        // 항목 옆 ✕ 버튼: CommandParameter 로 그 줄의 TodoItem 이 넘어온다
        private void DeleteTodo(object? parameter)
        {
            if (parameter is TodoItem item)
            {
                SelectedTodo = null;
                Todos.Remove(item);
            }
        }

        // "완료 전환" 버튼: 고른 항목의 완료 여부를 뒤집는다 (체크박스를 누른 것과 같다)
        private void ToggleSelected()
        {
            if (SelectedTodo != null)
                SelectedTodo.IsDone = !SelectedTodo.IsDone;
        }

        private void ClearCompleted()
        {
            SelectedTodo = null;
            // 컬렉션을 foreach 로 돌면서 지우면 예외 → 지울 항목을 먼저 복사(ToList)한다
            foreach (TodoItem item in Todos.Where(t => t.IsDone).ToList())
                Todos.Remove(item);
        }`);
    if (o.toggleAll === true) methods.push(`        // 남은 일이 하나라도 있으면 모두 완료, 모두 완료였으면 모두 해제
        private void ToggleAll()
        {
            bool makeDone = Todos.Any(t => !t.IsDone);
            foreach (TodoItem item in Todos)
                item.IsDone = makeDone;                  // 항목마다 알림 → 개수 · 취소선이 저절로 바뀐다
        }`);
    if (f4) methods.push(`        // 라디오 버튼의 CommandParameter("All" "Active" "Done") → 열거형 값
        private void SetFilter(object? parameter)
        {
            if (parameter is string name && Enum.TryParse(name, out TodoFilter value))
                Filter = value;
        }

        // 뷰의 필터 함수: 항목마다 불려서 "보일까(true) 숨길까(false)" 를 답한다
        private bool FilterTodo(object obj)
        {
            if (obj is not TodoItem item) return false;
${o.search === true ? `            // 검색어가 있으면 제목에 들어 있는 것만 (대소문자 무시)
            if (!string.IsNullOrWhiteSpace(SearchText) &&
                !item.Title.Contains(SearchText.Trim(), StringComparison.OrdinalIgnoreCase))
                return false;
` : o.search === 'todo' ? `            // TODO 2: 검색어가 있으면 제목에 검색어가 들어 있는 항목만 true (StringComparison.OrdinalIgnoreCase)
` : ''}            switch (Filter)
            {
                case TodoFilter.Active: return !item.IsDone;     // 진행 중 = 아직 끝나지 않은 일
                case TodoFilter.Done: return item.IsDone;        // 완료
                default: return true;                            // 전체
            }
        }

        private void RefreshView()
        {
            SelectedTodo = null;                         // 걸러진 뒤 엉뚱한 항목이 선택되어 있지 않게
            TodosView.Refresh();                         // 모든 항목에 FilterTodo 를 다시 적용
        }`);
    if (f5) methods.push(`        private void Save()
        {
            try
            {
                storage.Save(Todos);
                StatusMessage = $"저장했습니다 — {Todos.Count}개 → {storage.FilePath}";${o.dirty === true ? '\n                IsDirty = false;' : o.dirty === 'todo' ? '\n                // TODO 3: 저장했으니 IsDirty = false' : ''}
            }
            catch (IOException ex)                       // 파일이 잠겨 있거나 쓸 수 없는 폴더
            {
                StatusMessage = "저장하지 못했습니다: " + ex.Message;
            }
        }

        private void Load()
        {
            try
            {
                List<TodoItem> items = storage.Load();
                SelectedTodo = null;
                Todos.Clear();
                foreach (TodoItem item in items)
                    Todos.Add(item);                     // Add 마다 CollectionChanged → 항목 알림 구독
                StatusMessage = $"불러왔습니다 — {Todos.Count}개 ← {storage.FilePath}";${o.dirty === true ? '\n                IsDirty = false;' : ''}
            }
            catch (JsonException)                        // 파일 내용이 JSON 형식이 아님
            {
                StatusMessage = "파일 내용이 올바른 JSON 이 아닙니다";
            }
            catch (IOException ex)
            {
                StatusMessage = "불러오지 못했습니다: " + ex.Message;
            }
        }`);
    if (st === 2) methods.push(`        // 목록 알림: 추가 · 삭제되면 개수를 다시 알린다
        private void Todos_CollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            NotifyCounts();
        }`);
    if (f3) methods.push(`        // ① 목록 알림: 새 항목은 알림을 구독하고, 빠진 항목은 구독을 끊는다
        private void Todos_CollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
                foreach (TodoItem item in e.NewItems) item.PropertyChanged += Todo_PropertyChanged;
            if (e.OldItems != null)
                foreach (TodoItem item in e.OldItems) item.PropertyChanged -= Todo_PropertyChanged;
            NotifyCounts();${o.dirty === true ? '\n            IsDirty = true;' : o.dirty === 'todo' ? '\n            // TODO 1: 목록이 바뀌었으니 IsDirty = true' : ''}
        }

        // ② 항목 알림: 어떤 항목의 IsDone 이 바뀌면 개수를 다시 알린다${f4 ? ' (필터 중이면 다시 거른다)' : ''}
        private void Todo_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {${o.dirty === true ? '\n            IsDirty = true;' : o.dirty === 'todo' ? '\n            // TODO 2: 항목이 바뀌었으니 IsDirty = true' : ''}
            if (e.PropertyName == nameof(TodoItem.IsDone))
            {
                NotifyCounts();${f4 ? `
                if (Filter != TodoFilter.All) RefreshView();   // "진행 중" 에서 완료하면 목록에서 빠지게` : ''}
            }${o.important === true ? `
            if (e.PropertyName == nameof(TodoItem.IsImportant))
                RefreshView();                           // ★ 가 바뀌면 다시 정렬` : o.important === 'todo' ? `
            // TODO 4: IsImportant 가 바뀌면 RefreshView() 로 다시 정렬` : ''}
        }`);
    if (st >= 2) methods.push(`        private void NotifyCounts()
        {
${L('            OnPropertyChanged(nameof(RemainingCount));',
      '            OnPropertyChanged(nameof(DoneCount));',
      '            OnPropertyChanged(nameof(Summary));',
      Q(o.counts === true, `            OnPropertyChanged(nameof(AllLabel));
            OnPropertyChanged(nameof(ActiveLabel));
            OnPropertyChanged(nameof(DoneLabel));`),
      Q(o.counts === 'todo', '            // TODO 2: 라벨 세 개(AllLabel · ActiveLabel · DoneLabel)도 알리기'))}
        }`);

    return `// ===== File: ViewModels/MainViewModel.cs =====
${usings}

namespace ${ns}.ViewModels
{${f4 ? `
    // 목록을 보는 방법 세 가지
    public enum TodoFilter { All, Active, Done }
` : ''}
    public class MainViewModel : ViewModelBase
    {
${fields}
${props}

${ctor}${methods.length ? '\n\n' + methods.join('\n\n') : ''}
    }
}`;
  }

  const TODO = (o) => L(
    todoXaml(o),
    codeBehind(o),
    TODO_ITEM(o.ns, o.important),
    vmCs(o),
    VMBASE(o.ns),
    Q(o.stage >= 2, RELAY(o.ns)),
    Q(o.stage >= 3, CONVERTER(o.ns)),
    Q(o.stage >= 5, STORAGE(o.ns)));

  /* ---------- 단계별 예제 · 완성 코드 ---------- */
  const STEP1 = TODO({ ns: 'P05Step1', stage: 1, title: '할 일 관리 — 단계 1 View · Model · ViewModel' });
  const STEP2 = TODO({ ns: 'P05Step2', stage: 2, title: '할 일 관리 — 단계 2 추가 명령' });
  const STEP3 = TODO({ ns: 'P05Step3', stage: 3, title: '할 일 관리 — 단계 3 삭제 · 완료' });
  const STEP4 = TODO({ ns: 'P05Step4', stage: 4, title: '할 일 관리 — 단계 4 필터' });
  const STEP5 = TODO({ ns: 'P05Step5', stage: 5, title: '할 일 관리 — 단계 5 JSON 저장' });
  const FINAL = TODO({ ns: 'P05Final', stage: 5, counts: true, title: '할 일 관리 — MVVM' });

  const PR3_S = TODO({ ns: 'P05ToggleAll', stage: 3, toggleAll: 'todo', title: '실습 P5-3 — 모두 전환' });
  const PR3_A = TODO({ ns: 'P05ToggleAll', stage: 3, toggleAll: true, title: '실습 P5-3 — 모두 전환' });
  const PR4_S = TODO({ ns: 'P05Edit', stage: 3, edit: 'todo', title: '실습 P5-4 — 제목 고치기' });
  const PR4_A = TODO({ ns: 'P05Edit', stage: 3, edit: true, title: '실습 P5-4 — 제목 고치기' });
  const PR5_S = TODO({ ns: 'P05Counts', stage: 4, counts: 'todo', title: '실습 P5-5 — 필터 개수' });
  const PR5_A = TODO({ ns: 'P05Counts', stage: 4, counts: true, title: '실습 P5-5 — 필터 개수' });
  const PR6_S = TODO({ ns: 'P05Search', stage: 4, search: 'todo', title: '실습 P5-6 — 검색' });
  const PR6_A = TODO({ ns: 'P05Search', stage: 4, search: true, title: '실습 P5-6 — 검색' });
  const EX1_S = TODO({ ns: 'P05Dirty', stage: 5, counts: true, dirty: 'todo', title: '' });
  const EX1_A = TODO({ ns: 'P05Dirty', stage: 5, counts: true, dirty: true, title: '' });
  const EX2_S = TODO({ ns: 'P05Star', stage: 5, counts: true, important: 'todo', title: '할 일 관리 — 중요 표시' });
  const EX2_A = TODO({ ns: 'P05Star', stage: 5, counts: true, important: true, title: '할 일 관리 — 중요 표시' });

  /* ---------- 준비 예제 (콘솔) ---------- */
  const ITEM_CONSOLE = `class TodoItem : INotifyPropertyChanged
{
    private string title = "";
    private bool isDone;

    public string Title
    {
        get { return title; }
        set { if (title == value) return; title = value; OnPropertyChanged(); }
    }

    public bool IsDone
    {
        get { return isDone; }
        set { if (isDone == value) return; isDone = value; OnPropertyChanged(); }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}`;
  const PREP_ITEM = `using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

// Model: 값이 "바뀌었을 때만" 알린다
${ITEM_CONSOLE}

class Program
{
    static void Main()
    {
        var item = new TodoItem { Title = "우유 사기" };
        // 바인딩 대신 우리가 알림을 받아 출력해 본다
        item.PropertyChanged += (s, e) => Console.WriteLine($"  (알림) {e.PropertyName} 이(가) 바뀜");

        Console.WriteLine("IsDone = true");
        item.IsDone = true;
        Console.WriteLine("IsDone = true (같은 값)");
        item.IsDone = true;
        Console.WriteLine("Title 바꾸기");
        item.Title = "우유 두 개 사기";
        Console.WriteLine($"결과: {item.Title} / 완료 {item.IsDone}");
    }
}`;
  const PREP_FILTER = `using System;
using System.Collections.Generic;
using System.Linq;

enum TodoFilter { All, Active, Done }

class TodoItem
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}

class Program
{
    // 필터 = 항목 하나를 받아 "보일까?" 를 bool 로 답하는 함수
    static bool Matches(TodoItem item, TodoFilter filter)
    {
        switch (filter)
        {
            case TodoFilter.Active: return !item.IsDone;
            case TodoFilter.Done: return item.IsDone;
            default: return true;
        }
    }

    static void Main()
    {
        var todos = new List<TodoItem>
        {
            new TodoItem { Title = "요구사항 읽기", IsDone = true },
            new TodoItem { Title = "모델 만들기" },
            new TodoItem { Title = "필터 만들기" }
        };

        foreach (TodoFilter filter in Enum.GetValues<TodoFilter>())
        {
            IEnumerable<string> shown = todos.Where(t => Matches(t, filter)).Select(t => t.Title);
            Console.WriteLine($"{filter,-6}: {string.Join(", ", shown)}");
        }

        // 원본은 그대로 — 필터는 "보는 방법" 만 바꾼다
        Console.WriteLine($"원본 개수: {todos.Count}");
    }
}`;
  const PREP_JSON = `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

class TodoItem
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}

class Program
{
    static void Main()
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,                                   // 줄바꿈 · 들여쓰기
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase       // Title → "title"
        };

        var todos = new List<TodoItem>
        {
            new TodoItem { Title = "JSON 배우기", IsDone = true },
            new TodoItem { Title = "할 일 앱 저장 기능" }
        };

        // ① 저장: 객체 → JSON 문자열(직렬화) → 파일
        string json = JsonSerializer.Serialize(todos, options);
        File.WriteAllText("sample.json", json);
        Console.WriteLine("--- sample.json ---");
        Console.WriteLine(File.ReadAllText("sample.json"));

        // ② 불러오기: 파일 → JSON 문자열 → 객체(역직렬화)
        string text = File.ReadAllText("sample.json");
        List<TodoItem> loaded = JsonSerializer.Deserialize<List<TodoItem>>(text, options) ?? new List<TodoItem>();
        Console.WriteLine("--- 불러온 목록 ---");
        foreach (TodoItem t in loaded)
            Console.WriteLine($"[{(t.IsDone ? "완료" : "    ")}] {t.Title}");
    }
}`;
  const PREP_JSON_EXPECT = `--- sample.json ---
[
  {
    "title": "JSON \\uBC30\\uC6B0\\uAE30",
    "isDone": true
  },
  {
    "title": "\\uD560 \\uC77C \\uC571 \\uC800\\uC7A5 \\uAE30\\uB2A5",
    "isDone": false
  }
]
--- 불러온 목록 ---
[완료] JSON 배우기
[    ] 할 일 앱 저장 기능`;

  /* ---------- 실습 P5-1 · P5-2 (콘솔) ---------- */
  const PR1_MAIN = `class Program
{
    static void Main()
    {
        var item = new TodoItem();
        int count = 0;
        item.PropertyChanged += (s, e) => { count++; Console.WriteLine($"알림 {count}: {e.PropertyName}"); };

        item.Title = "  보고서 쓰기  ";
        Console.WriteLine($"Title = [{item.Title}]");
        item.Title = "보고서 쓰기";            // 앞뒤 공백을 빼면 같은 값 → 알림 없음
        item.IsDone = true;
        item.IsDone = true;                    // 같은 값 → 알림 없음
        item.Toggle();                         // true → false
        Console.WriteLine($"IsDone = {item.IsDone}, 알림은 모두 {count}번");
    }
}`;
  const PR1_S = `using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

class TodoItem : INotifyPropertyChanged
{
    // TODO 1: Title — 앞뒤 공백을 뺀(Trim) 값으로 저장. 값이 바뀌었을 때만 알림
    public string Title { get; set; } = "";

    // TODO 2: IsDone — 값이 바뀌었을 때만 알림
    public bool IsDone { get; set; }

    // TODO 3: 완료 여부를 뒤집는다
    public void Toggle()
    {
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

${PR1_MAIN}`;
  const PR1_A = `using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

class TodoItem : INotifyPropertyChanged
{
    private string title = "";
    private bool isDone;

    public string Title
    {
        get { return title; }
        set
        {
            string trimmed = value.Trim();         // 규칙은 Model 이 지킨다
            if (title == trimmed) return;
            title = trimmed;
            OnPropertyChanged();
        }
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

    public void Toggle()
    {
        IsDone = !IsDone;                          // 속성을 거쳐야 알림도 간다
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

${PR1_MAIN}`;
  const PR1_EXPECT = `알림 1: Title
Title = [보고서 쓰기]
알림 2: IsDone
알림 3: IsDone
IsDone = False, 알림은 모두 3번`;

  const PR2_HEAD = `using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

class TodoItem
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}
`;
  const PR2_MAIN = `class Program
{
    static void Main()
    {
        var storage = new TodoStorage("p52.json");
        if (File.Exists(storage.FilePath)) File.Delete(storage.FilePath);   // 깨끗한 상태에서 시작

        Console.WriteLine($"처음 불러오기: {storage.Load().Count}개");       // 파일 없음

        storage.Save(new List<TodoItem>
        {
            new TodoItem { Title = "빨래", IsDone = true },
            new TodoItem { Title = "장보기" }
        });
        List<TodoItem> loaded = storage.Load();
        Console.WriteLine($"저장 후 불러오기: {loaded.Count}개");
        foreach (TodoItem t in loaded)
            Console.WriteLine($"  {t.Title} (완료: {t.IsDone})");

        File.WriteAllText(storage.FilePath, "{ 이건 JSON 이 아님");           // 파일을 일부러 망가뜨림
        Console.WriteLine($"깨진 파일 불러오기: {storage.Load().Count}개");
        Console.WriteLine(storage.LastError);
    }
}`;
  const PR2_S = `${PR2_HEAD}
class TodoStorage
{
    public string FilePath { get; }
    public string LastError { get; private set; } = "";

    public TodoStorage(string filePath)
    {
        FilePath = filePath;
    }

    // TODO 1: items 를 JSON 문자열로 바꿔(JsonSerializer.Serialize) FilePath 에 쓰기
    public void Save(List<TodoItem> items)
    {
    }

    // TODO 2: 파일이 없으면 빈 목록.
    //         있으면 읽어서 JsonSerializer.Deserialize<List<TodoItem>>(…) — null 이면 빈 목록
    //         JsonException 이 나면 LastError = "오류: 파일이 올바른 JSON 이 아닙니다" 로 두고 빈 목록
    public List<TodoItem> Load()
    {
        return new List<TodoItem>();
    }
}

${PR2_MAIN}`;
  const PR2_A = `${PR2_HEAD}
class TodoStorage
{
    public string FilePath { get; }
    public string LastError { get; private set; } = "";

    public TodoStorage(string filePath)
    {
        FilePath = filePath;
    }

    public void Save(List<TodoItem> items)
    {
        string json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(FilePath, json);
    }

    public List<TodoItem> Load()
    {
        if (!File.Exists(FilePath)) return new List<TodoItem>();       // 처음 실행: 파일이 아직 없다
        try
        {
            string json = File.ReadAllText(FilePath);
            return JsonSerializer.Deserialize<List<TodoItem>>(json) ?? new List<TodoItem>();
        }
        catch (JsonException)
        {
            LastError = "오류: 파일이 올바른 JSON 이 아닙니다";
            return new List<TodoItem>();
        }
    }
}

${PR2_MAIN}`;
  const PR2_EXPECT = `처음 불러오기: 0개
저장 후 불러오기: 2개
  빨래 (완료: True)
  장보기 (완료: False)
깨진 파일 불러오기: 0개
오류: 파일이 올바른 JSON 이 아닙니다`;

  /* ---------- 슬라이드용 짧은 코드 ---------- */
  const SL_ITEM = `using System; using System.ComponentModel;
class TodoItem : INotifyPropertyChanged
{
    private bool isDone;
    public string Title { get; set; } = "";
    public bool IsDone
    {
        get => isDone;
        set { if (isDone == value) return; isDone = value; Notify(nameof(IsDone)); }
    }
    public event PropertyChangedEventHandler? PropertyChanged;
    private void Notify(string name) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}
class Program
{
    static void Main()
    {
        var item = new TodoItem { Title = "우유 사기" };
        item.PropertyChanged += (s, e) => Console.WriteLine($"(알림) {e.PropertyName}");
        item.IsDone = true;      // 알림
        item.IsDone = true;      // 같은 값 → 알림 없음
        item.IsDone = false;     // 알림
    }
}`;
  const SL_FILTER = `using System; using System.Collections.Generic; using System.Linq;
enum TodoFilter { All, Active, Done }
record Todo(string Title, bool IsDone);
class Program
{
    static bool Matches(Todo t, TodoFilter f) =>
        f == TodoFilter.Active ? !t.IsDone : f == TodoFilter.Done ? t.IsDone : true;
    static void Main()
    {
        var todos = new List<Todo> { new("요구사항 읽기", true), new("모델 만들기", false), new("필터 만들기", false) };
        foreach (TodoFilter f in Enum.GetValues<TodoFilter>())
            Console.WriteLine($"{f,-6}: {string.Join(", ", todos.Where(t => Matches(t, f)).Select(t => t.Title))}");
    }
}`;
  const SL_ADD = `// ===== File: MainWindow.xaml =====
<Window x:Class="P05Slide1.MainWindow" Title="추가 명령" Width="320" Height="240"
        ${NS}>
    <StackPanel Margin="10">
        <TextBox Text="{Binding NewTitle, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>
        <Button Content="추가" IsDefault="True" Margin="0,6" Command="{Binding AddCommand}"/>
        <ListBox ItemsSource="{Binding Todos}" Height="110"/>
    </StackPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Collections.ObjectModel; using System.Windows; using System.Windows.Input;
namespace P05Slide1
{
    public class RelayCommand : ICommand
    {
        private readonly Action run; private readonly Func<bool> can;
        public RelayCommand(Action run, Func<bool> can) { this.run = run; this.can = can; }
        public bool CanExecute(object? p) => can();
        public void Execute(object? p) => run();
        public event EventHandler? CanExecuteChanged { add => CommandManager.RequerySuggested += value; remove => CommandManager.RequerySuggested -= value; }
    }
    public class MainViewModel
    {
        public string NewTitle { get; set; } = "";
        public ObservableCollection<string> Todos { get; } = new ObservableCollection<string> { "우유 사기" };
        public ICommand AddCommand => new RelayCommand(() => Todos.Add(NewTitle.Trim()), () => NewTitle.Trim().Length > 0);
    }
    public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); DataContext = new MainViewModel(); } }
}`;
  const SL_VIEW = `// ===== File: MainWindow.xaml =====
<Window x:Class="P05Slide2.MainWindow" Title="ICollectionView 필터" Width="320" Height="260"
        ${NS}>
    <DockPanel Margin="10">
        <CheckBox x:Name="chkEven" DockPanel.Dock="Top" Content="짝수만 보기" Checked="Even_Changed" Unchecked="Even_Changed"/>
        <ListBox x:Name="lstNumbers" Margin="0,8,0,0"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.ObjectModel; using System.ComponentModel; using System.Windows; using System.Windows.Data;
namespace P05Slide2
{
    public partial class MainWindow : Window
    {
        private readonly ObservableCollection<int> numbers = new ObservableCollection<int> { 1, 2, 3, 4, 5, 6 };
        private readonly ICollectionView view;
        public MainWindow()
        {
            InitializeComponent();
            view = CollectionViewSource.GetDefaultView(numbers);
            lstNumbers.ItemsSource = view;                     // 원본이 아니라 뷰를 보여 준다
        }
        private void Even_Changed(object sender, RoutedEventArgs e)
        {
            if (chkEven.IsChecked == true) view.Filter = o => (int)o % 2 == 0;   // 필터를 바꾸면 바로 다시 거른다
            else view.Filter = null;
        }
    }
}`;
  const SL_JSON = `using System; using System.Collections.Generic; using System.IO; using System.Text.Json;
class TodoItem
{
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}
class Program
{
    static void Main()
    {
        var todos = new List<TodoItem> { new TodoItem { Title = "JSON 배우기", IsDone = true } };
        File.WriteAllText("slide.json", JsonSerializer.Serialize(todos));        // 저장
        Console.WriteLine(File.ReadAllText("slide.json"));

        var loaded = JsonSerializer.Deserialize<List<TodoItem>>(File.ReadAllText("slide.json"));
        Console.WriteLine($"불러온 개수: {loaded?.Count}, 첫 제목: {loaded?[0].Title}");
    }
}`;

  /* ---------- 그림 1. 앱 구조 ---------- */
  const line = (x, y, t, style) => `<text x="${x}" y="${y}" style="${style || `${MONO};font-size:17px;fill:var(--fg)`}">${t}</text>`;
  const SVG_ARCH = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="할 일 앱의 구조. View 는 바인딩과 명령으로 MainViewModel 을 쓰고, MainViewModel 은 TodoItem 과 TodoStorage 를 쓰며, TodoStorage 는 todos.json 파일에 읽고 쓴다">
  <defs>
    <marker id="ap5a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ap5b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--warn)"/></marker>
  </defs>
  <rect x="30" y="30" width="360" height="440" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="210" y="68" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent2)">View</text>
  <text x="210" y="96" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">MainWindow.xaml</text>
  ${line(52, 140, 'TextBox  → NewTitle')}
  ${line(52, 176, '추가 버튼 → AddCommand')}
  ${line(52, 212, 'RadioButton ×3 → FilterCommand')}
  ${line(52, 248, 'ListBox  → TodosView')}
  ${line(52, 284, '  CheckBox → IsDone')}
  ${line(52, 320, '  ✕ 버튼  → DeleteCommand')}
  ${line(52, 356, '저장 · 불러오기 → 명령')}
  ${line(52, 392, 'TextBlock → Summary')}
  <text x="210" y="448" text-anchor="middle" style="font-size:17px;fill:var(--muted)">코드 비하인드 = DataContext 한 줄</text>
  <rect x="470" y="30" width="370" height="440" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="655" y="68" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--accent)">ViewModel</text>
  <text x="655" y="96" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">MainViewModel.cs</text>
  ${line(492, 140, 'Todos (ObservableCollection)')}
  ${line(492, 176, 'TodosView (ICollectionView)')}
  ${line(492, 212, 'NewTitle · SelectedTodo')}
  ${line(492, 248, 'Filter · StatusMessage')}
  ${line(492, 284, 'Summary (계산 속성)')}
  ${line(492, 330, 'Add · Delete · Toggle')}
  ${line(492, 366, 'ClearCompleted · Filter')}
  ${line(492, 402, 'Save · Load   (명령)')}
  <text x="655" y="448" text-anchor="middle" style="font-size:17px;fill:var(--muted)">컨트롤을 모른다</text>
  <rect x="920" y="30" width="330" height="180" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1085" y="68" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--ok)">Model</text>
  <text x="1085" y="96" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Models/TodoItem.cs</text>
  ${line(945, 140, 'Title · IsDone')}
  ${line(945, 176, 'INotifyPropertyChanged')}
  <rect x="920" y="250" width="330" height="130" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="4"/>
  <text x="1085" y="288" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--warn)">Service</text>
  <text x="1085" y="316" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Services/TodoStorage.cs</text>
  ${line(945, 356, 'Save(items) · Load()')}
  <path d="M1040,420 L1110,420 L1130,440 L1130,500 L1040,500 Z" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="1085" y="530" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">todos.json</text>
  <g stroke-width="4" fill="none">
    <line x1="394" y1="170" x2="464" y2="170" stroke="var(--accent)" marker-end="url(#ap5a)"/>
    <line x1="394" y1="330" x2="464" y2="330" stroke="var(--accent)" marker-end="url(#ap5a)"/>
    <line x1="466" y1="250" x2="396" y2="250" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ap5b)"/>
    <line x1="844" y1="120" x2="914" y2="120" stroke="var(--accent)" marker-end="url(#ap5a)"/>
    <line x1="916" y1="170" x2="846" y2="170" stroke="var(--warn)" stroke-dasharray="10 7" marker-end="url(#ap5b)"/>
    <line x1="844" y1="315" x2="914" y2="315" stroke="var(--accent)" marker-end="url(#ap5a)"/>
    <line x1="1085" y1="384" x2="1085" y2="414" stroke="var(--accent)" marker-end="url(#ap5a)"/>
  </g>
  <text x="429" y="160" text-anchor="middle" style="font-size:16px;fill:var(--accent)">바인딩</text>
  <text x="429" y="320" text-anchor="middle" style="font-size:16px;fill:var(--accent)">명령</text>
  <text x="429" y="276" text-anchor="middle" style="font-size:16px;fill:var(--warn)">알림</text>
  <text x="640" y="535" text-anchor="middle" style="font-size:20px;fill:var(--fg)">실선 = 사용한다 · 점선 = PropertyChanged 알림 — 화살표는 View → ViewModel → Model · Service 한 방향</text>
</svg>`;

  /* ---------- 그림 2. 컬렉션 뷰 ---------- */
  const todoRow = (x, y, t, done, shown) => `<rect x="${x}" y="${y}" width="22" height="22" rx="3" fill="${done ? 'var(--ok)' : 'none'}" stroke="${done ? 'var(--ok)' : 'var(--fg)'}" stroke-width="2"${shown === false ? ' opacity="0.35"' : ''}/>
  <text x="${x + 34}" y="${y + 19}" style="font-size:19px;fill:${shown === false ? 'var(--muted)' : 'var(--fg)'}${done ? ';text-decoration:line-through' : ''}"${shown === false ? ' opacity="0.5"' : ''}>${t}</text>`;
  const SVG_VIEW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="원본 Todos 컬렉션 위에 필터를 건 TodosView 가 있고, ListBox 는 뷰가 통과시킨 항목만 보여 준다">
  <defs>
    <marker id="ap5c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  <rect x="30" y="60" width="360" height="300" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="210" y="100" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">Todos (원본)</text>
  <text x="210" y="128" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ObservableCollection&lt;TodoItem&gt;</text>
  ${todoRow(60, 160, '요구사항 읽기', true)}
  ${todoRow(60, 205, '모델 만들기', false)}
  ${todoRow(60, 250, '필터 만들기', false)}
  ${todoRow(60, 295, '보고서 쓰기', true)}
  <path d="M470,80 L810,80 L740,250 L740,340 L540,340 L540,250 Z" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="125" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">TodosView</text>
  <text x="640" y="160" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">ICollectionView</text>
  <text x="640" y="200" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--fg)">Filter = FilterTodo</text>
  <text x="640" y="290" text-anchor="middle" style="font-size:18px;fill:var(--fg)">"진행 중" 만</text>
  <rect x="890" y="60" width="360" height="300" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="1070" y="100" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent2)">ListBox (화면)</text>
  <text x="1070" y="128" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--muted)">ItemsSource="{Binding TodosView}"</text>
  ${todoRow(920, 160, '모델 만들기', false)}
  ${todoRow(920, 205, '필터 만들기', false)}
  <g stroke="var(--accent)" stroke-width="4">
    <line x1="394" y1="210" x2="500" y2="210" marker-end="url(#ap5c)"/>
    <line x1="744" y1="300" x2="884" y2="210" marker-end="url(#ap5c)"/>
  </g>
  <text x="440" y="198" text-anchor="middle" style="font-size:16px;fill:var(--accent)">4개</text>
  <text x="820" y="240" text-anchor="middle" style="font-size:16px;fill:var(--accent)">2개</text>
  <text x="640" y="415" text-anchor="middle" style="font-size:21px;fill:var(--fg)">원본은 그대로(4개) — 뷰가 항목마다 FilterTodo(item) 를 불러 true 인 것만 화면에 넘긴다</text>
  <text x="640" y="455" text-anchor="middle" style="font-size:21px;fill:var(--fg)">필터 조건이나 항목 값이 바뀌면 TodosView.Refresh() → 모든 항목을 다시 거른다</text>
  <text x="640" y="495" text-anchor="middle" style="font-size:19px;fill:var(--muted)">추가 · 삭제(원본의 CollectionChanged)는 뷰가 스스로 알고 다시 거른다</text>
</svg>`;

  /* ---------- 그림 3. 체크 한 번의 흐름 ---------- */
  const fbox = (x, y, w, h, color, t1, t2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="var(--card)" stroke="${color}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + (t2 ? 34 : h / 2 + 7)}" text-anchor="middle" style="font-size:19px;font-weight:700;fill:${color}">${t1}</text>${t2 ? `
  <text x="${x + w / 2}" y="${y + 62}" text-anchor="middle" style="${MONO};font-size:16px;fill:var(--fg)">${t2}</text>` : ''}`;
  const SVG_FLOW = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="체크박스를 한 번 누르면 IsDone 이 바뀌고, PropertyChanged 알림이 취소선, 남은 개수, 필터 다시 거르기로 이어진다">
  <defs>
    <marker id="ap5d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  ${fbox(30, 210, 210, 90, 'var(--accent2)', '① CheckBox 클릭', 'TwoWay 바인딩')}
  ${fbox(290, 210, 240, 90, 'var(--ok)', '② TodoItem', 'IsDone = true')}
  ${fbox(580, 210, 250, 90, 'var(--warn)', '③ PropertyChanged', '"IsDone"')}
  ${fbox(900, 40, 350, 100, 'var(--accent2)', '④ TextBlock 취소선', 'Converter=DoneToDecorations')}
  ${fbox(900, 205, 350, 100, 'var(--accent)', '⑤ Todo_PropertyChanged', 'NotifyCounts() → Summary')}
  ${fbox(900, 370, 350, 100, 'var(--accent)', '⑥ 필터 중이면', 'TodosView.Refresh()')}
  <g stroke="var(--accent)" stroke-width="4" fill="none">
    <line x1="244" y1="255" x2="284" y2="255" marker-end="url(#ap5d)"/>
    <line x1="534" y1="255" x2="574" y2="255" marker-end="url(#ap5d)"/>
    <path d="M834,240 C865,240 865,90 894,90" marker-end="url(#ap5d)"/>
    <line x1="834" y1="255" x2="894" y2="255" marker-end="url(#ap5d)"/>
    <path d="M834,270 C865,270 865,420 894,420" marker-end="url(#ap5d)"/>
  </g>
  <text x="1075" y="165" text-anchor="middle" style="font-size:17px;fill:var(--muted)">바인딩이 알림을 받고 다시 읽음</text>
  <text x="1075" y="330" text-anchor="middle" style="font-size:17px;fill:var(--muted)">“남은 일 1개 · 완료 2개”</text>
  <text x="1075" y="495" text-anchor="middle" style="font-size:17px;fill:var(--muted)">“진행 중” 목록에서 빠진다</text>
  <text x="640" y="540" text-anchor="middle" style="font-size:21px;fill:var(--fg)">클릭 처리기는 한 줄도 없다 — 알림 하나가 화면의 세 곳을 저절로 고친다</text>
</svg>`;

  /* ---------- 그림 4. JSON 저장 ---------- */
  const SVG_JSON = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="객체 목록을 JsonSerializer 로 JSON 문자열로 바꿔 파일에 쓰고, 반대로 파일을 읽어 객체 목록으로 되돌린다">
  <defs>
    <marker id="ap5e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
    <marker id="ap5f" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
  </defs>
  <rect x="30" y="100" width="330" height="260" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="195" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--ok)">메모리 속 객체</text>
  <text x="195" y="170" text-anchor="middle" style="${MONO};font-size:15px;fill:var(--muted)">ObservableCollection&lt;TodoItem&gt;</text>
  <rect x="60" y="195" width="270" height="60" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="75" y="220" style="${MONO};font-size:16px;fill:var(--fg)">Title = "JSON 배우기"</text>
  <text x="75" y="244" style="${MONO};font-size:16px;fill:var(--fg)">IsDone = true</text>
  <rect x="60" y="270" width="270" height="60" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
  <text x="75" y="295" style="${MONO};font-size:16px;fill:var(--fg)">Title = "저장 기능"</text>
  <text x="75" y="319" style="${MONO};font-size:16px;fill:var(--fg)">IsDone = false</text>
  <rect x="475" y="100" width="330" height="260" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="640" y="140" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">JSON 문자열</text>
  <text x="500" y="182" style="${MONO};font-size:16px;fill:var(--fg)">[</text>
  <text x="500" y="206" style="${MONO};font-size:16px;fill:var(--fg)">  { "title": "JSON 배우기",</text>
  <text x="500" y="230" style="${MONO};font-size:16px;fill:var(--fg)">    "isDone": true },</text>
  <text x="500" y="254" style="${MONO};font-size:16px;fill:var(--fg)">  { "title": "저장 기능",</text>
  <text x="500" y="278" style="${MONO};font-size:16px;fill:var(--fg)">    "isDone": false }</text>
  <text x="500" y="302" style="${MONO};font-size:16px;fill:var(--fg)">]</text>
  <path d="M960,120 L1130,120 L1170,160 L1170,340 L960,340 Z" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
  <text x="1065" y="240" text-anchor="middle" style="${MONO};font-size:20px;fill:var(--fg)">todos.json</text>
  <text x="1065" y="270" text-anchor="middle" style="font-size:16px;fill:var(--muted)">작업 폴더</text>
  <g stroke-width="4" fill="none">
    <line x1="364" y1="190" x2="469" y2="190" stroke="var(--accent)" marker-end="url(#ap5e)"/>
    <line x1="809" y1="190" x2="954" y2="190" stroke="var(--accent)" marker-end="url(#ap5e)"/>
    <line x1="954" y1="290" x2="811" y2="290" stroke="var(--ok)" marker-end="url(#ap5f)"/>
    <line x1="469" y1="290" x2="366" y2="290" stroke="var(--ok)" marker-end="url(#ap5f)"/>
  </g>
  <text x="416" y="90" text-anchor="middle" style="font-size:17px;fill:var(--accent)">Serialize</text>
  <text x="416" y="178" text-anchor="middle" style="font-size:15px;fill:var(--accent)">직렬화</text>
  <text x="880" y="178" text-anchor="middle" style="font-size:15px;fill:var(--accent)">WriteAllText</text>
  <text x="880" y="318" text-anchor="middle" style="font-size:15px;fill:var(--ok)">ReadAllText</text>
  <text x="416" y="318" text-anchor="middle" style="font-size:15px;fill:var(--ok)">Deserialize</text>
  <text x="640" y="420" text-anchor="middle" style="font-size:21px;fill:var(--fg)">저장 = 객체 → JSON 문자열 → 파일,   불러오기 = 파일 → JSON 문자열 → 객체</text>
  <text x="640" y="460" text-anchor="middle" style="font-size:19px;fill:var(--muted)">public 속성(get · set)만 저장된다 — 이벤트(PropertyChanged) · private 필드는 저장되지 않는다</text>
</svg>`;

  CS_COURSE.addChapter({
    id: 'p05',
    no: 'P05',
    title: 'WPF 할 일 관리 (MVVM)',
    subtitle: 'To-do App with MVVM · ICollectionView · JSON',
    summary: '20장의 MVVM 을 실제 앱 하나로 끝까지 만들어 봅니다. INotifyPropertyChanged 를 구현한 Model(TodoItem), ObservableCollection 과 계산 속성을 가진 ViewModel, 코드 비하인드가 DataContext 한 줄뿐인 View 로 나누고, RelayCommand 로 추가 · 삭제 · 완료 전환 · 완료 지우기를 만듭니다. CollectionViewSource.GetDefaultView 로 얻은 ICollectionView 의 Filter 와 Refresh() 로 전체 · 진행 중 · 완료 필터를 만들고, System.Text.Json 으로 목록을 작업 폴더의 todos.json 에 저장 · 불러오기 합니다.',
    goals: [
      '할 일 앱의 요구사항을 Model · ViewModel · View · Service 의 역할로 나눠 설계할 수 있다',
      'INotifyPropertyChanged 를 구현한 Model 과 ObservableCollection 으로 목록 화면을 자동으로 갱신할 수 있다',
      'RelayCommand 와 CommandParameter 로 추가 · 삭제 · 완료 전환 · 완료 지우기를 명령으로 만들 수 있다',
      '목록과 항목의 알림을 구독해 남은 개수 같은 계산 속성을 갱신할 수 있다',
      'ICollectionView 의 Filter 와 Refresh() 로 원본을 바꾸지 않고 목록을 걸러 보여 줄 수 있다',
      'System.Text.Json 으로 목록을 JSON 파일에 저장하고 불러오며 파일 오류를 처리할 수 있다'
    ],
    requires: ['ch18', 'ch19', 'ch20'],
    preview: 'assets/shots/p05-final.png',
    previewCode: FINAL,
    sections: [
      /* ===================================================================== p05-1 */
      {
        id: 'p05-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '할 일 앱의 기능을 요구사항 표로 정리할 수 있다',
          '요구사항을 Model · ViewModel · View · Service 의 역할로 나눌 수 있다',
          '화면의 각 컨트롤이 ViewModel 의 어떤 속성 · 명령에 바인딩되는지 설계할 수 있다',
          '속성 알림 · 필터 함수 · JSON 직렬화를 콘솔에서 먼저 확인할 수 있다'
        ],
        flow: [['도입 · 완성 앱 시연', 5], ['요구사항 · 기능 목록', 7], ['MVVM 설계 · 바인딩 지도', 13], ['준비 예제 (알림 · 필터 · JSON)', 15], ['정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '이번 프로젝트는 <b>할 일 관리(To-do) 앱</b>입니다. 할 일을 입력해 추가하고, 체크박스로 완료 표시를 하고, <b>전체 · 진행 중 · 완료</b> 로 골라 보고, 프로그램을 껐다 켜도 목록이 남도록 <b>파일에 저장</b>합니다. 20장 마지막 예제에서 만든 할 일 목록을 출발점으로, 실제로 매일 쓸 수 있는 앱으로 키웁니다.' },
          { type: 'p', html: 'P04 계산기는 코드 비하인드에 상태와 처리기를 두는 방식이었습니다. 이번에는 처음부터 <b>MVVM</b> 으로 만듭니다. 창(View)의 코드 비하인드는 <code>DataContext = new MainViewModel();</code> 한 줄뿐이고, 모든 동작은 <b>바인딩 · 명령 · 알림</b>으로 연결됩니다. Click 처리기가 하나도 없는 WPF 앱을 끝까지 완성해 보는 것이 목표입니다.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '규칙 · 예'], rows: [
            ['F1', '할 일 추가', '입력 칸에 쓰고 <b>추가</b> 또는 <kbd>Enter</kbd>. 빈 칸 · 공백만이면 추가 버튼이 꺼짐. 추가하면 입력 칸이 비워짐'],
            ['F2', '완료 표시', '항목의 체크박스, 또는 항목을 고르고 <b>완료 전환</b>. 완료한 일은 <s>취소선</s>'],
            ['F3', '삭제', '항목 오른쪽의 <b>✕</b> 로 그 항목만 삭제'],
            ['F4', '완료 지우기', '완료한 항목을 한꺼번에 삭제. 완료한 항목이 없으면 버튼이 꺼짐'],
            ['F5', '남은 개수', '“남은 일 2개 · 완료 1개” — 추가 · 삭제 · 체크할 때마다 바로 바뀜'],
            ['F6', '필터', '<b>전체 · 진행 중 · 완료</b> 라디오 버튼. 원본 목록은 그대로 두고 보기만 바꿈. 진행 중 보기에서 완료하면 목록에서 빠짐'],
            ['F7', '저장 · 불러오기', '작업 폴더의 <code>todos.json</code> (JSON 형식). 프로그램을 시작할 때 파일이 있으면 자동으로 불러옴'],
            ['F8', '오류 처리', '파일이 깨졌거나 읽을 수 없어도 프로그램이 멈추지 않고 아래쪽에 메시지']
          ], caption: '할 일 앱 요구사항 — 2교시에 F1~F5, 3교시에 F6~F8' },
          { type: 'h', text: '3. MVVM 설계 — 누가 무엇을 맡을까?' },
          { type: 'p', html: '요구사항을 20장의 세 역할에 나눠 담습니다. 여기에 파일 저장을 맡는 <b>Service</b>(서비스)를 하나 더 둡니다. 저장 방식(JSON · DB · 클라우드)은 바뀔 수 있으므로 ViewModel 에서 떼어 놓는 것이 좋습니다.' },
          { type: 'figure', html: SVG_ARCH, caption: '할 일 앱의 구조 — View 는 바인딩 · 명령으로 ViewModel 을, ViewModel 은 Model · Service 를 쓴다' },
          { type: 'table', head: ['역할', '파일', '맡는 일', '모르는 것'], rows: [
            ['Model', '<code>Models/TodoItem.cs</code>', '할 일 하나의 데이터(Title · IsDone)와 “바뀌면 알린다”', '목록 · 화면 · 파일'],
            ['ViewModel', '<code>ViewModels/MainViewModel.cs</code>', '화면에 보일 목록 · 입력 · 필터 · 개수, 명령(추가 · 삭제 …)', '컨트롤(TextBox · ListBox)'],
            ['Service', '<code>Services/TodoStorage.cs</code>', '목록을 JSON 파일로 저장 · 불러오기', '화면 · ViewModel'],
            ['View', '<code>MainWindow.xaml</code>', '컨트롤 배치 · 모양, <code>{Binding}</code> 연결', '규칙 · 저장 방법'],
            ['공통', '<code>ViewModelBase.cs</code> · <code>RelayCommand.cs</code>', '알림 도우미 · 범용 명령 (20장에서 만든 것)', '']
          ], caption: '역할별 파일 — 폴더 이름이 곧 네임스페이스(P05Final.Models …)' },
          { type: 'p', html: '이제 화면의 컨트롤 하나하나가 ViewModel 의 무엇과 연결될지 <b>바인딩 지도</b>를 그립니다. 이 표가 완성되면 XAML 과 ViewModel 을 서로 모르는 두 사람이 따로 만들어도 맞물립니다.' },
          { type: 'table', head: ['컨트롤', '바인딩', 'ViewModel 쪽', '방향'], rows: [
            ['입력 TextBox', '<code>Text</code>', '<code>NewTitle</code> (string)', 'TwoWay, 한 글자마다'],
            ['추가 Button', '<code>Command</code>', '<code>AddCommand</code> — CanExecute: 제목이 있을 때', '명령'],
            ['RadioButton 3개', '<code>Command</code> + <code>CommandParameter</code>', '<code>FilterCommand</code> + <code>"All"</code> · <code>"Active"</code> · <code>"Done"</code>', '명령'],
            ['ListBox', '<code>ItemsSource</code> · <code>SelectedItem</code>', '<code>TodosView</code> (필터를 건 뷰) · <code>SelectedTodo</code>', 'OneWay · TwoWay'],
            ['(항목) CheckBox', '<code>IsChecked</code>', '<code>TodoItem.IsDone</code>', 'TwoWay'],
            ['(항목) ✕ Button', '<code>Command</code> + <code>CommandParameter="{Binding}"</code>', '<code>DeleteCommand</code> + 그 줄의 TodoItem', '명령'],
            ['완료 전환 · 완료 지우기', '<code>Command</code>', '<code>ToggleCommand</code> · <code>ClearCompletedCommand</code>', '명령'],
            ['저장 · 불러오기', '<code>Command</code>', '<code>SaveCommand</code> · <code>LoadCommand</code>', '명령'],
            ['개수 TextBlock', '<code>Text</code>', '<code>Summary</code> (계산 속성)', 'OneWay'],
            ['상태 TextBlock', '<code>Text</code>', '<code>StatusMessage</code>', 'OneWay']
          ], caption: '바인딩 지도 — 코드 비하인드에는 Click 처리기가 하나도 없다' },
          { type: 'callout', kind: 'info', title: '“알림” 은 세 종류다', html: '<ul><li><b>ViewModel 속성 알림</b> — <code>NewTitle</code>, <code>Summary</code> 처럼 ViewModel 의 속성이 바뀌면 <code>OnPropertyChanged</code> (ViewModelBase).</li><li><b>목록 알림</b> — 항목이 추가 · 삭제되면 <code>ObservableCollection</code> 이 <code>CollectionChanged</code> 로 알린다. ListBox 가 항목을 늘리고 줄인다.</li><li><b>항목 알림</b> — 항목 하나의 <code>IsDone</code> 이 바뀌면 <code>TodoItem</code> 이 <code>PropertyChanged</code> 로 알린다. 체크박스 · 취소선이 바뀌고, ViewModel 은 이 알림을 <b>구독</b>해서 남은 개수를 다시 알린다.</li></ul>세 가지 중 하나라도 빠지면 “화면이 안 바뀌는” 버그가 생깁니다. 2교시에 차례로 확인합니다.' },
          { type: 'h', text: '4. 준비 운동 — 콘솔에서 먼저 확인하기' },
          { type: 'p', html: '앱에 쓸 세 가지 재료를 창 없이 확인해 봅니다. 첫째, Model 이 <b>값이 바뀌었을 때만</b> 알리는지.' },
          { type: 'code', title: '준비 예제 1. TodoItem — 값이 바뀔 때만 알린다', code: PREP_ITEM, expect: `IsDone = true
  (알림) IsDone 이(가) 바뀜
IsDone = true (같은 값)
Title 바꾸기
  (알림) Title 이(가) 바뀜
결과: 우유 두 개 사기 / 완료 True`, desc: '바인딩은 <code>PropertyChanged</code> 를 구독하는 “청취자” 입니다. 여기서는 람다로 직접 구독해 알림이 언제 오는지 봤습니다. 같은 값을 다시 넣었을 때 알리지 않는 것(<code>if (isDone == value) return;</code>)은 쓸데없는 화면 갱신과 “알림 → 갱신 → 알림” 의 무한 반복을 막아 줍니다. <code>[CallerMemberName]</code> 덕분에 <code>OnPropertyChanged()</code> 만 불러도 속성 이름이 들어갑니다.' },
          { type: 'p', html: '둘째, <b>필터</b>는 “항목 하나를 받아 보일지 말지를 bool 로 답하는 함수” 입니다. 3교시에 이 함수를 <code>ICollectionView.Filter</code> 에 넘깁니다.' },
          { type: 'code', title: '준비 예제 2. 필터 = 항목마다 bool 을 돌려주는 함수', code: PREP_FILTER, expect: `All   : 요구사항 읽기, 모델 만들기, 필터 만들기
Active: 모델 만들기, 필터 만들기
Done  : 요구사항 읽기
원본 개수: 3`, desc: '<code>Enum.GetValues&lt;TodoFilter&gt;()</code> 로 열거형의 모든 값을 돌면서 같은 목록을 세 가지로 걸러 봤습니다. <code>Where</code> 는 새 목록을 만들 뿐 원본 <code>todos</code> 는 바꾸지 않습니다. WPF 의 컬렉션 뷰도 같습니다 — <b>원본은 그대로, 보는 방법만</b> 바뀝니다.' },
          { type: 'p', html: '셋째, <b>JSON</b>(JavaScript Object Notation)은 객체를 <code>{ "이름": 값 }</code> 형태의 글자로 적는 형식입니다. 사람이 읽을 수 있고 거의 모든 언어가 지원해서, 설정 파일 · 웹 API · 앱 저장 파일에 널리 쓰입니다. .NET 에는 <code>System.Text.Json</code> 이 기본으로 들어 있습니다. 객체 → 글자를 <b>직렬화</b>(serialize), 글자 → 객체를 <b>역직렬화</b>(deserialize)라고 합니다.' },
          { type: 'code', title: '준비 예제 3. System.Text.Json 으로 저장하고 다시 읽기', code: PREP_JSON, expect: PREP_JSON_EXPECT, desc: '<code>JsonSerializer.Serialize(목록, 옵션)</code> 이 public 속성(<code>Title</code>, <code>IsDone</code>)을 JSON 으로 적고, <code>Deserialize&lt;List&lt;TodoItem&gt;&gt;</code> 가 새 객체들을 만들어 속성을 채웁니다(그래서 매개변수 없는 생성자와 public set 이 필요). 옵션 두 가지: <code>WriteIndented</code> 는 보기 좋게 줄바꿈 · 들여쓰기, <code>CamelCase</code> 는 JSON 관례대로 속성 이름의 첫 글자를 소문자로 바꿉니다. 한글이 <code>\\uBC30</code> 처럼 적히는 것은 System.Text.Json 이 기본으로 ASCII 가 아닌 글자를 <b>유니코드 이스케이프</b>(<code>\\u</code> + 16진수 4자리)로 쓰기 때문이며, 읽어 들이면 원래 한글로 돌아옵니다. 파일은 프로그램의 <b>작업 폴더</b>에 만들어집니다.' },
          { type: 'callout', kind: 'tip', title: '파일에도 한글을 그대로 쓰려면 (Visual Studio)', html: '옵션에 <code>Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)</code> 을 더하고 <code>using System.Text.Encodings.Web;</code> · <code>using System.Text.Unicode;</code> 를 쓰면 <code>todos.json</code> 에 “JSON 배우기” 가 그대로 저장되어 메모장으로 열어도 읽기 쉽습니다. 이 강좌의 웹 실습 환경은 <code>System.Text.Encodings.Web</code> 어셈블리를 컴파일 참조로 제공하지 않아서 예제에서는 이 옵션을 뺐습니다. 어느 쪽으로 저장해도 불러온 결과는 같습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 MVVM 프로젝트 구조 만들기', html: '<ul><li><b>새 프로젝트</b> → <b>WPF 애플리케이션</b>(.NET 9) → 이름 <code>TodoApp</code>.</li><li>솔루션 탐색기에서 프로젝트를 오른쪽 클릭 → <b>추가 → 새 폴더</b> 로 <code>Models</code>, <code>ViewModels</code>, <code>Services</code>, <code>Converters</code> 를 만듭니다.</li><li>폴더를 오른쪽 클릭 → <b>추가 → 클래스</b>(<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>)로 만들면 네임스페이스가 <code>TodoApp.Models</code> 처럼 폴더를 따라 붙습니다. 강좌 예제의 <code>P05Final</code> 은 프로젝트 이름(<code>TodoApp</code>)으로 바꿔 쓰세요.</li><li>20장에서 만든 <code>ViewModelBase.cs</code> · <code>RelayCommand.cs</code> 는 파일 탐색기에서 <code>ViewModels</code> 폴더로 끌어다 놓으면 복사됩니다. 복사한 파일의 <code>namespace</code> 줄을 고치는 것을 잊지 마세요.</li><li><code>System.Text.Json</code> 은 .NET 에 기본으로 들어 있으므로 NuGet 패키지를 따로 설치하지 않아도 됩니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P5-1. TodoItem 모델 완성하기',
            level: 1,
            desc: '<p>Model 이 스스로 규칙을 지키게 만듭니다. <code>TodoItem</code> 을 완성하세요.</p><ul><li><code>Title</code>: 앞뒤 공백을 뺀(<code>Trim</code>) 값으로 저장. 저장할 값이 지금과 같으면 알리지 않는다</li><li><code>IsDone</code>: 값이 바뀌었을 때만 알린다</li><li><code>Toggle()</code>: 완료 여부를 뒤집는다 (알림도 가야 한다)</li></ul><p>실행 결과:</p><pre><code>알림 1: Title\nTitle = [보고서 쓰기]\n알림 2: IsDone\n알림 3: IsDone\nIsDone = False, 알림은 모두 3번</code></pre>',
            hint: '자동 구현 속성(<code>{ get; set; }</code>)으로는 알릴 수 없으므로 <b>필드 + 속성</b>으로 바꿉니다. <code>Title</code> 의 set 에서는 <code>string trimmed = value.Trim();</code> 을 먼저 만들고 <b>trimmed</b> 와 비교해야 두 번째 대입에서 알림이 가지 않습니다. <code>Toggle</code> 은 필드(<code>isDone = !isDone</code>)가 아니라 속성(<code>IsDone = !IsDone</code>)을 바꿔야 알림이 갑니다.',
            starter: PR1_S,
            solution: PR1_A,
            expect: PR1_EXPECT
          },
          {
            title: '실습 P5-2. TodoStorage — 저장 · 불러오기 · 오류 처리',
            level: 2,
            desc: '<p>3교시에 쓸 저장 담당 클래스를 콘솔에서 먼저 만듭니다. <code>TodoStorage</code> 의 <code>Save</code> · <code>Load</code> 를 완성하세요.</p><ul><li><code>Save(items)</code>: JSON 으로 바꿔 <code>FilePath</code> 에 쓰기 (<code>WriteIndented</code>)</li><li><code>Load()</code>: 파일이 없으면 빈 목록. 있으면 읽어서 역직렬화 (결과가 null 이면 빈 목록)</li><li>파일 내용이 JSON 이 아니면(<code>JsonException</code>) <code>LastError</code> 에 “오류: 파일이 올바른 JSON 이 아닙니다” 를 넣고 빈 목록</li></ul><p>실행 결과:</p><pre><code>처음 불러오기: 0개\n저장 후 불러오기: 2개\n  빨래 (완료: True)\n  장보기 (완료: False)\n깨진 파일 불러오기: 0개\n오류: 파일이 올바른 JSON 이 아닙니다</code></pre>',
            hint: '<code>if (!File.Exists(FilePath)) return new List&lt;TodoItem&gt;();</code> 로 처음 실행을 처리하고, 읽기 · 역직렬화는 <code>try { … } catch (JsonException) { … }</code> 로 감쌉니다. <code>Deserialize</code> 는 파일 내용이 <code>null</code> 이라는 글자뿐이면 null 을 돌려줄 수 있으므로 <code>?? new List&lt;TodoItem&gt;()</code> 를 붙입니다. 예외를 잡아 “빈 목록 + 메시지” 로 바꾸면 부르는 쪽(ViewModel)은 프로그램이 멈출 걱정 없이 결과만 쓰면 됩니다.',
            starter: PR2_S,
            solution: PR2_A,
            expect: PR2_EXPECT
          }
        ],
        quiz: [
          { q: 'MVVM 할 일 앱에서 “체크박스를 누르면 남은 개수가 줄어든다” 는 규칙을 계산하는 곳은?', options: ['MainWindow.xaml.cs 의 Click 처리기', 'MainViewModel 의 계산 속성(RemainingCount · Summary)', 'TodoStorage', 'XAML 의 TextBlock'], answer: 1, explain: '개수 계산은 화면용 상태이므로 ViewModel 의 계산 속성입니다. View 는 <code>{Binding Summary}</code> 로 보여 주기만 하고, 코드 비하인드에는 처리기가 없습니다.' },
          { q: '다음 중 <b>ObservableCollection 이 알려 주지 않는</b> 변화는?', options: ['항목 추가(Add)', '항목 삭제(Remove)', '목록 비우기(Clear)', '어떤 항목의 IsDone 이 true 로 바뀜'], answer: 3, explain: 'ObservableCollection 은 목록 자체의 변화(추가 · 삭제 · 이동 · 비우기)만 CollectionChanged 로 알립니다. 항목 속성의 변화는 항목(TodoItem)이 INotifyPropertyChanged 로 따로 알려야 합니다.' },
          { q: '<code>JsonSerializer.Serialize(item)</code> 의 결과에 <b>들어가지 않는</b> 것은? (TodoItem 은 준비 예제 1 과 같다)', options: ['Title 속성', 'IsDone 속성', 'PropertyChanged 이벤트', '속성의 값'], answer: 2, explain: 'System.Text.Json 은 기본적으로 public 속성(get 이 있는 것)만 저장합니다. 이벤트 · private 필드 · 메서드는 저장되지 않습니다.' },
          { q: '준비 예제 2 의 필터 함수에서 <code>Matches(item, TodoFilter.Active)</code> 가 <code>true</code> 인 항목은?', options: ['IsDone 이 true 인 항목', 'IsDone 이 false 인 항목', '모든 항목', '제목이 비어 있는 항목'], answer: 1, explain: '“진행 중(Active)” 은 아직 끝나지 않은 일, 즉 <code>!item.IsDone</code> 입니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'WPF 할 일 관리 — MVVM · ICollectionView · JSON', badge: 'Project 05 · 1교시',
            notes: '<p><b>[도입 3분]</b> 4교시의 완성 프로그램을 실행합니다. 추가(Enter) → 체크 → 진행 중 필터 → 저장 → 창 닫고 다시 실행해 목록이 남아 있는 것까지 보여 주세요.</p><p>“이 앱의 코드 비하인드에는 몇 줄이 있을까?” → DataContext 한 줄. P04 계산기와의 차이를 강조합니다.</p>' },
          { layout: 'table', title: '요구사항 F1 ~ F8', head: ['번호', '기능', '예'], rows: [['F1', '추가', 'Enter 로 추가, 빈 제목이면 버튼 꺼짐'], ['F2~F4', '완료 · 삭제 · 완료 지우기', '체크박스 · ✕ · 한꺼번에'], ['F5', '남은 개수', '남은 일 2개 · 완료 1개'], ['F6', '필터', '전체 · 진행 중 · 완료'], ['F7', '저장 · 불러오기', 'todos.json, 시작할 때 자동'], ['F8', '오류 처리', '깨진 파일에도 멈추지 않기']],
            notes: '<p><b>[5분]</b> F6 의 “원본은 그대로, 보기만 바꾼다” 와 F7 의 “시작할 때 자동으로 불러온다” 를 특히 짚습니다. 2교시 F1~F5, 3교시 F6~F8 로 나눠 만든다고 안내합니다.</p>' },
          { layout: 'diagram', title: '누가 무엇을 맡을까?', html: SVG_ARCH, caption: 'View → ViewModel → Model · Service (알림은 거꾸로)',
            notes: '<p><b>[6분]</b> 20장 그림에 Service 가 하나 더 붙은 모양입니다. “저장 방식을 JSON 에서 데이터베이스로 바꾸면 어느 파일을 고칠까?” → TodoStorage 만. 역할을 나누는 이유를 이 질문으로 확인합니다.</p>' },
          { layout: 'table', title: '바인딩 지도 (일부)', head: ['컨트롤', 'ViewModel'], rows: [['입력 TextBox.Text', 'NewTitle (TwoWay)'], ['추가 Button.Command', 'AddCommand'], ['RadioButton ×3', 'FilterCommand + "All" · "Active" · "Done"'], ['ListBox.ItemsSource', 'TodosView'], ['항목 CheckBox.IsChecked', 'TodoItem.IsDone (TwoWay)'], ['항목 ✕ Button', 'DeleteCommand + {Binding}']],
            lead: '이 표만 있으면 XAML 과 ViewModel 을 따로 만들어도 맞물린다',
            notes: '<p><b>[5분]</b> 본문의 전체 표를 함께 읽습니다. ✕ 버튼의 CommandParameter="{Binding}" 은 “그 줄의 항목 자체” 라는 뜻이라는 것을 미리 알려 두고, 2교시에 자세히 다룹니다.</p>' },
          { layout: 'bullets', title: '알림은 세 종류', bullets: ['ViewModel 속성 — <code>OnPropertyChanged</code> (NewTitle · Summary)', '목록 — <code>ObservableCollection.CollectionChanged</code> (추가 · 삭제)', '항목 — <code>TodoItem.PropertyChanged</code> (IsDone)', 'ViewModel 이 항목 알림을 <b>구독</b> → 남은 개수 다시 알림', '하나라도 빠지면 “화면이 안 바뀌는” 버그'],
            notes: '<p><b>[3분]</b> 퀴즈 2번과 연결됩니다. “ObservableCollection 이면 항목 체크도 알려 주지 않나요?” 라는 오해가 가장 흔합니다.</p>' },
          { layout: 'code', title: '준비 1. 값이 바뀔 때만 알리는 Model', code: SL_ITEM, points: ['바인딩 = PropertyChanged 의 청취자', '같은 값이면 <code>return</code> → 알림 없음', '이벤트 구독: <code>+=</code> 람다', '실행 결과: 알림 두 번'],
            notes: '<p><b>[4분]</b> 실행 후 가운데 줄을 지우고 다시 실행해 알림 횟수를 비교합니다. 본문 준비 예제 1 은 Title 까지 포함한 전체 모델입니다.</p>' },
          { layout: 'code', title: '준비 2. 필터 = bool 을 돌려주는 함수', code: SL_FILTER, points: ['항목 하나 → 보일까? (bool)', '원본 목록은 바뀌지 않는다', '3교시: <code>TodosView.Filter = FilterTodo;</code>', '<code>Enum.GetValues&lt;T&gt;()</code> 로 모든 값'],
            notes: '<p><b>[4분]</b> <code>record Todo(string Title, bool IsDone)</code> 는 슬라이드를 짧게 하려고 쓴 레코드입니다. 앱의 TodoItem 은 알림이 필요해 보통 클래스입니다.</p>' },
          { layout: 'diagram', title: '준비 3. JSON — 직렬화와 역직렬화', html: SVG_JSON, caption: 'public 속성만 저장된다',
            notes: '<p><b>[6분]</b> 본문 준비 예제 3 을 실행해 파일 내용을 보여 줍니다. 옵션 두 가지(줄바꿈 · camelCase)를 하나씩 지우고 결과를 비교하면 효과적입니다. 한글이 \\uXXXX 로 적히는 이유(안전을 위한 기본 이스케이프)와, VS 에서는 JavaScriptEncoder 옵션으로 그대로 쓸 수 있다는 것도 알려 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'ObservableCollection 이 <b>알려 주지 않는</b> 변화는?', options: ['Add', 'Remove', 'Clear', '어떤 항목의 IsDone 변경'], answer: 3, explain: '항목 속성의 변화는 항목이 INotifyPropertyChanged 로 알린다. ViewModel 은 그 알림을 구독해야 한다.',
            notes: '<p>답을 확인한 뒤 “그럼 남은 개수는 어떻게 갱신할까?” 를 물어 2교시 단계 3 을 예고합니다.</p>' },
          { layout: 'practice', title: '실습 P5-1 · P5-2', desc: '<p>P5-1: TodoItem — Title 은 Trim 해서 저장, 바뀔 때만 알림, Toggle(). P5-2: TodoStorage — 저장 · 불러오기, 파일 없음 · 깨진 JSON 처리.</p>', starter: PR1_S, solution: PR1_A,
            notes: '<p><b>[실습]</b> P5-1 은 모두, P5-2 는 빨리 끝난 학생이. P5-2 의 TodoStorage 는 3교시 단계 5 에 거의 그대로 들어갑니다.</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: ['요구사항 F1~F8 → 2교시 F1~F5, 3교시 F6~F8', 'Model(TodoItem) · ViewModel · View · Service(TodoStorage)', '바인딩 지도: 컨트롤 ↔ 속성 · 명령', '알림 세 종류: 속성 · 목록 · 항목', '필터 = bool 함수, JSON = 직렬화 · 역직렬화'],
            notes: '<p>다음 교시: 단계 1 View · Model · ViewModel 연결 → 단계 2 추가 명령 → 단계 3 삭제 · 완료 · 남은 개수.</p>' }
        ]
      },
      /* ===================================================================== p05-2 */
      {
        id: 'p05-2',
        title: '단계별 구현 ① — Model · ViewModel · 명령',
        minutes: 50,
        goals: [
          'Model · ViewModel · View 파일을 나누고 DataContext 로 연결할 수 있다',
          'ObservableCollection 과 DataTemplate 으로 목록을 보여 줄 수 있다',
          'RelayCommand 의 CanExecute 로 추가 버튼을 켜고 끌 수 있다',
          'ElementName 바인딩과 CommandParameter="{Binding}" 으로 항목별 삭제 명령을 만들 수 있다',
          '목록 알림과 항목 알림을 구독해 남은 개수를 갱신하고, 변환기로 취소선을 그릴 수 있다'
        ],
        flow: [['설계 복습', 3], ['단계 1 View · Model · ViewModel', 12], ['단계 2 RelayCommand · 추가', 12], ['단계 3 삭제 · 완료 · 남은 개수', 15], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '단계 1. View · Model · ViewModel 연결하기' },
          { type: 'p', html: '먼저 세 역할의 파일을 만들고 연결만 합니다. <code>MainViewModel</code> 은 생성자에서 샘플 할 일 세 개를 <code>Todos</code> 에 넣고, View 는 <code>ItemsSource="{Binding Todos}"</code> 로 목록을, <code>{Binding Summary}</code> 로 개수를 보여 줍니다. ListBox 의 <b>DataTemplate</b> 이 항목 하나를 “체크박스 + 제목” 으로 그립니다(18장).' },
          { type: 'code', title: '단계 1. 세 역할로 나눈 첫 화면 (아직 명령 없음)', code: STEP1, desc: '파일이 다섯 개입니다: View(<code>MainWindow.xaml</code> · 코드 비하인드), Model(<code>Models/TodoItem.cs</code>), ViewModel(<code>ViewModels/MainViewModel.cs</code> · <code>ViewModelBase.cs</code>). 코드 비하인드는 <code>DataContext = new MainViewModel();</code> 한 줄입니다. 체크박스를 눌러 보세요. 체크 표시는 바뀌는데(TodoItem.IsDone 은 TwoWay 로 바뀜) <b>아래의 개수는 그대로</b>입니다. <code>Summary</code> 는 계산 속성이라 스스로 알리지 못하고, 아직 아무도 “개수가 바뀌었다” 고 알려 주지 않기 때문입니다. 단계 3 에서 해결합니다.' },
          { type: 'callout', kind: 'tip', title: '체크포인트', html: '<ul><li>DataTemplate 안의 <code>{Binding Title}</code> 은 창의 DataContext(MainViewModel)가 아니라 <b>그 줄의 항목(TodoItem)</b> 을 기준으로 찾습니다. ListBox 가 항목마다 DataContext 를 바꿔 주기 때문입니다.</li><li><code>MainViewModel</code> 에 <code>using System.Windows.Controls;</code> 가 없는지 확인하세요. ViewModel 은 컨트롤을 모릅니다.</li><li>XAML 에서 <code>{Binding Todoss}</code> 처럼 이름을 틀리게 쓰면 목록이 비어 보일 뿐 오류 창은 뜨지 않습니다. Visual Studio 의 <b>출력</b> 창(웹 실습에서는 콘솔의 “[바인딩 오류]”)을 확인하는 습관을 들이세요.</li></ul>' },
          { type: 'h', text: '단계 2. RelayCommand 와 추가 명령' },
          { type: 'p', html: '20장의 <code>RelayCommand</code> 를 <code>ViewModels</code> 폴더에 넣고 <code>AddCommand</code> 를 만듭니다. <b>CanExecute</b> 는 “제목이 비어 있지 않을 때만” 이므로, 입력 칸이 비면 추가 버튼이 저절로 회색이 됩니다. TextBox 는 <code>UpdateSourceTrigger=PropertyChanged</code> 로 한 글자마다 <code>NewTitle</code> 을 바꾸므로, 첫 글자를 치는 순간 버튼이 켜집니다.' },
          { type: 'list', items: [
            '<code>IsDefault="True"</code>: 창에서 <kbd>Enter</kbd> 를 누르면 이 버튼이 눌린 것으로 칩니다. 입력 칸에 쓰고 Enter 만 쳐도 추가됩니다. 명령이 CanExecute 로 꺼져 있으면 Enter 도 무시됩니다.',
            '추가한 뒤 <code>NewTitle = "";</code> — TwoWay 바인딩이므로 입력 칸도 비워집니다. ViewModel 은 TextBox 를 모르지만 <b>속성을 바꾸면 화면이 따라옵니다</b>.',
            '<code>Todos.CollectionChanged</code> 를 구독해 추가될 때마다 <code>NotifyCounts()</code> 로 개수를 다시 알립니다(목록 알림). 구독은 샘플 항목을 넣기 <b>전에</b> 해야 합니다.'
          ] },
          { type: 'code', title: '단계 2. 추가 명령 — CanExecute 로 버튼 켜고 끄기', code: STEP2, desc: '입력 칸을 비우면 추가 버튼이 꺼지고, 공백만 쳐도 꺼져 있습니다(<code>IsNullOrWhiteSpace</code>). 추가하면 목록 맨 아래에 붙고 “전체” 개수가 늘어납니다. 하지만 여전히 <b>체크박스를 눌러도</b> 남은 개수는 그대로입니다 — 목록 알림은 추가 · 삭제만 알려 주기 때문입니다.' },
          { type: 'callout', kind: 'warn', title: 'KeyBinding 과 명령', html: '실제 WPF 에서는 <code>&lt;Window.InputBindings&gt;&lt;KeyBinding Key="S" Modifiers="Ctrl" Command="{Binding SaveCommand}"/&gt;</code> 로 단축키를 ViewModel 명령에 연결할 수 있습니다. 이 강좌의 웹 실습 환경은 <b>KeyBinding.Command 에 바인딩을 쓸 수 없고</b>, 브라우저가 Ctrl+N · Ctrl+T · Ctrl+W 같은 키를 먼저 가져갈 수 있어서 이 프로젝트는 단축키 대신 <code>IsDefault</code>(Enter)만 씁니다. Visual Studio 에서는 KeyBinding 을 더해 보세요.' },
          { type: 'h', text: '단계 3. 삭제 · 완료 전환 · 완료 지우기 · 남은 개수' },
          { type: 'p', html: '항목 줄마다 <b>✕</b> 버튼을 두고 그 항목을 지우게 합니다. 문제가 두 가지 있습니다.' },
          { type: 'list', ordered: true, items: [
            '<b>명령이 어디 있나?</b> DataTemplate 안의 DataContext 는 TodoItem 이라서 <code>{Binding DeleteCommand}</code> 는 TodoItem 에서 찾다가 실패합니다. 명령은 창의 ViewModel 에 있으므로 목록에 이름(<code>x:Name="lstTodos"</code>)을 붙이고 <code>ElementName=lstTodos</code> 로 그 ListBox 를 원본으로 삼아 <code>DataContext.DeleteCommand</code> — “목록의 DataContext(MainViewModel)의 DeleteCommand” — 를 씁니다. 이름으로 찾기 때문에 템플릿 안에서도 템플릿 밖의 요소에 닿을 수 있습니다.',
            '<b>어느 항목을 지우나?</b> <code>CommandParameter="{Binding}"</code> — 경로 없는 Binding 은 “DataContext 그 자체”, 즉 그 줄의 TodoItem 입니다. 명령의 <code>Execute(parameter)</code> 로 넘어옵니다.'
          ] },
          { type: 'p', html: '남은 개수가 체크할 때마다 바뀌려면 <b>항목 알림</b>을 구독해야 합니다. 목록에 항목이 들어올 때(<code>e.NewItems</code>) 그 항목의 <code>PropertyChanged</code> 를 구독하고, 빠질 때(<code>e.OldItems</code>) 끊습니다. 어떤 항목이든 <code>IsDone</code> 이 바뀌면 <code>NotifyCounts()</code> 가 개수를 다시 알립니다. 완료한 일에는 18장의 <b>변환기</b>로 취소선을 긋습니다.' },
          { type: 'figure', html: SVG_FLOW, caption: '체크박스 한 번 → IsDone → PropertyChanged → 취소선 · 남은 개수 · (3교시) 필터' },
          { type: 'code', title: '단계 3. 삭제 · 완료 전환 · 완료 지우기 · 남은 개수', code: STEP3, desc: '체크박스를 누르면 이제 취소선이 그어지고 “남은 일 · 완료” 가 바로 바뀝니다. ✕ 는 그 줄만, <b>완료 지우기</b>는 완료한 것을 한꺼번에 지웁니다. <code>ClearCompleted</code> 는 <code>Todos.Where(…).ToList()</code> 로 <b>복사본</b>을 돌면서 원본에서 지웁니다. 원본을 foreach 로 돌면서 지우면 “컬렉션이 수정되었습니다” 예외가 납니다. <b>완료 전환</b>은 항목을 고른 뒤(<code>SelectedTodo</code>) 누르고, 고른 것이 없으면 꺼져 있습니다. 지우기 전에 <code>SelectedTodo = null</code> 로 선택을 풀어 “지운 항목을 여전히 선택 중” 인 상태를 막았습니다.' },
          { type: 'callout', kind: 'info', title: 'DataTrigger 로도 취소선을 그릴 수 있다', html: '실제 WPF 에서는 변환기 대신 스타일의 <b>DataTrigger</b> 를 쓸 수도 있습니다.<pre><code>&lt;TextBlock.Style&gt;\n  &lt;Style TargetType="TextBlock"&gt;\n    &lt;Style.Triggers&gt;\n      &lt;DataTrigger Binding="{Binding IsDone}" Value="True"&gt;\n        &lt;Setter Property="TextDecorations" Value="Strikethrough"/&gt;\n        &lt;Setter Property="Foreground" Value="Gray"/&gt;\n      &lt;/DataTrigger&gt;\n    &lt;/Style.Triggers&gt;\n  &lt;/Style&gt;\n&lt;/TextBlock.Style&gt;</code></pre>코드 없이 XAML 만으로 되고 여러 속성을 한꺼번에 바꿀 수 있어 편리합니다. 이 강좌의 웹 실습 환경은 IsMouseOver 트리거만 지원하므로 예제에서는 변환기(IValueConverter)를 썼습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 바인딩 오류 찾기', html: '<ul><li><kbd>F5</kbd> 로 디버그 실행한 뒤 <b>보기 → 출력</b>(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>O</kbd>) 창을 보면 <code>System.Windows.Data Error: 40 : BindingExpression path error: \'DeleteCommand\' property not found on \'object\' \'\'TodoItem\'</code> 같은 줄이 나옵니다. 템플릿 안에서 ElementName 없이 명령을 바인딩했을 때의 전형적인 메시지입니다.</li><li>Visual Studio 2022 는 <b>디버그 → 창 → XAML 바인딩 오류</b> 창에서 오류를 표로 보여 줍니다. 앱이 실행 중일 때 오류 개수가 도구 모음에 빨간 숫자로 뜹니다.</li><li><b>핫 리로드</b>: 디버그 실행 중에 XAML 을 고치고 저장하면 창이 바로 바뀝니다. DataTemplate 의 여백 · 글꼴을 조정할 때 편리합니다(C# 코드 변경은 다시 시작해야 할 수 있음).</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P5-3. 모두 완료 / 모두 해제',
            level: 2,
            desc: '<p>단계 3 의 앱에 <b>모두 전환</b> 버튼이 더해져 있습니다(<code>Command="{Binding ToggleAllCommand}"</code>). 명령을 완성하세요.</p><ul><li>남은 일이 하나라도 있으면 → 모두 완료</li><li>모두 완료였으면 → 모두 해제</li><li>할 일이 하나도 없으면 버튼이 꺼짐 (CanExecute)</li></ul><p>누를 때마다 체크박스 · 취소선 · 남은 개수가 한꺼번에 바뀌는지 확인하세요.</p>',
            hint: '<code>bool makeDone = Todos.Any(t =&gt; !t.IsDone);</code> 로 방향을 정하고 <code>foreach</code> 로 모든 항목의 <code>IsDone</code> 에 넣습니다. 화면을 고치는 코드는 필요 없습니다 — 항목마다 PropertyChanged 가 가고, 단계 3 에서 만든 구독이 개수를 알려 줍니다. CanExecute 는 <code>_ =&gt; Todos.Count &gt; 0</code>.',
            starter: PR3_S,
            solution: PR3_A
          },
          {
            title: '실습 P5-4. 고른 할 일의 제목 고치기',
            level: 2,
            desc: '<p>목록 아래에 “제목 고치기” 입력 칸이 있습니다. XAML 은 <code>Text="{Binding SelectedTodo.Title, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"</code> · <code>IsEnabled="{Binding HasSelection}"</code> 로 되어 있습니다. ViewModel 을 완성하세요.</p><ul><li><code>HasSelection</code>: 고른 항목이 있으면 true 인 계산 속성</li><li><code>SelectedTodo</code> 가 바뀌면 <code>HasSelection</code> 도 알리기</li><li>항목을 고르고 입력 칸에서 글자를 고치면 <b>목록의 제목이 한 글자마다 함께 바뀌는지</b> 확인</li></ul>',
            hint: '<code>set { if (SetProperty(ref selectedTodo, value)) OnPropertyChanged(nameof(HasSelection)); }</code>. 목록이 따라 바뀌는 이유: 두 곳(목록의 TextBlock, 아래 TextBox)이 <b>같은 TodoItem 객체의 Title</b> 에 바인딩되어 있고, TodoItem 이 PropertyChanged 로 알리기 때문입니다(마스터-디테일, 18장). 선택이 없을 때 <code>SelectedTodo.Title</code> 경로는 중간이 null 이라 값이 비어 보일 뿐 오류는 아닙니다.',
            starter: PR4_S,
            solution: PR4_A
          }
        ],
        quiz: [
          { q: 'DataTemplate 안에서 <code>Command="{Binding DeleteCommand}"</code> 라고만 쓰면 동작하지 않는 이유는?', options: ['DataTemplate 안에서는 Command 를 쓸 수 없어서', 'DataTemplate 안의 DataContext 가 TodoItem 이라 거기서 DeleteCommand 를 찾기 때문에', 'DeleteCommand 가 private 이라서', 'ListBox 가 버튼 클릭을 막아서'], answer: 1, explain: 'ListBox 는 항목마다 DataContext 를 그 항목(TodoItem)으로 바꿉니다. 명령은 MainViewModel 에 있으므로 <code>ElementName=lstTodos</code> 처럼 템플릿 밖의 요소를 원본으로 삼아 <code>DataContext.DeleteCommand</code> 를 써야 합니다.' },
          { q: '<code>CommandParameter="{Binding}"</code> 이 명령에 넘기는 값은?', options: ['null', '버튼 자신', '그 줄의 DataContext (TodoItem 객체)', 'ListBox 전체'], answer: 2, explain: '경로(Path)가 없는 Binding 은 DataContext 그 자체를 뜻합니다. 템플릿 안이므로 그 줄의 TodoItem 이 Execute(parameter) 로 넘어갑니다.' },
          { q: '다음 코드를 실행하면?<pre><code>foreach (TodoItem item in Todos)\n    if (item.IsDone) Todos.Remove(item);</code></pre>', options: ['완료한 항목이 모두 지워진다', '첫 번째 완료 항목만 지워진다', 'InvalidOperationException (컬렉션이 수정됨) 이 발생한다', '컴파일 오류'], answer: 2, explain: 'foreach 로 도는 도중에 같은 컬렉션을 바꾸면 다음 반복에서 예외가 납니다. <code>Todos.Where(t =&gt; t.IsDone).ToList()</code> 로 복사본을 돌면서 원본에서 지워야 합니다.' },
          { q: '단계 2 까지 만든 앱에서 체크박스를 눌러도 “남은 일” 개수가 바뀌지 않는 이유는?', options: ['CheckBox 가 IsDone 을 바꾸지 못해서', 'ObservableCollection 은 항목 속성 변화를 알리지 않고, 항목 알림을 아직 구독하지 않아서', 'Summary 가 private 이라서', 'NotifyCounts 가 너무 자주 불려서'], answer: 1, explain: '목록 알림(CollectionChanged)은 추가 · 삭제만 알립니다. 단계 3 에서 각 항목의 PropertyChanged 를 구독해 IsDone 이 바뀔 때 NotifyCounts() 를 부르게 했습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ①', subtitle: '단계 1 View · Model · ViewModel → 단계 2 추가 명령 → 단계 3 삭제 · 완료 · 남은 개수', badge: 'Project 05 · 2교시',
            notes: '<p><b>[복습 3분]</b> 1교시의 구조 그림과 바인딩 지도를 다시 띄웁니다. 오늘 만들 요구사항은 F1~F5 입니다.</p>' },
          { layout: 'bullets', title: '단계 1. 파일 다섯 개로 나누기', lead: '코드 비하인드 = DataContext 한 줄', bullets: ['<code>Models/TodoItem.cs</code> — Title · IsDone · 알림', '<code>ViewModels/MainViewModel.cs</code> — Todos · Summary', '<code>ViewModels/ViewModelBase.cs</code> — 20장 그대로', '<code>MainWindow.xaml</code> — ListBox + DataTemplate', '템플릿 안의 {Binding} = 그 줄의 항목'],
            notes: '<p><b>[8분]</b> 본문 단계 1 을 실행합니다. 체크해도 개수가 안 바뀌는 것을 <b>일부러</b> 보여 주고 “왜일까?” 를 칠판에 적어 둡니다. 답은 단계 3 에서.</p>' },
          { layout: 'code', title: '단계 2. RelayCommand · CanExecute', code: SL_ADD, points: ['<code>Command="{Binding AddCommand}"</code>', 'CanExecute false → 버튼이 저절로 회색', '<code>IsDefault="True"</code> → Enter 로 추가', '본문: + NewTitle 비우기 (알림 필요)'],
            notes: '<p><b>[6분]</b> 슬라이드 코드는 한 파일로 줄인 버전이라 추가 후 입력 칸이 비워지지 않습니다(NewTitle 에 알림이 없음). “어떻게 하면 입력 칸이 비워질까?” → ViewModelBase + SetProperty. 본문 단계 2 로 넘어가 확인합니다.</p>' },
          { layout: 'bullets', title: '단계 2 에서 확인할 것', bullets: ['빈 칸 · 공백만 → 추가 버튼 꺼짐', '추가 → 목록 맨 아래 + 입력 칸 비워짐', '<code>Todos.CollectionChanged</code> → NotifyCounts()', '구독은 샘플 항목 넣기 <b>전에</b>', '체크해도 개수는 여전히 그대로 (→ 단계 3)'],
            notes: '<p><b>[6분]</b> 구독 줄을 샘플 추가 뒤로 옮기면 무엇이 달라지는지 묻습니다 → 처음 세 개는 알림을 못 받음(단계 3 에서 특히 문제).</p>' },
          { layout: 'two', title: '단계 3. 항목별 ✕ 버튼', left: { title: '안 되는 코드', code: '<!-- DataTemplate 안 -->\n<Button Content="✕"\n        Command="{Binding DeleteCommand}"/>\n<!-- DataContext = TodoItem\n     → DeleteCommand 없음 -->', run: false }, right: { title: '되는 코드', code: '<ListBox x:Name="lstTodos" ...>\n  ...\n  <Button Content="✕"\n    Command="{Binding DataContext.DeleteCommand,\n                      ElementName=lstTodos}"\n    CommandParameter="{Binding}"/>', run: false },
            notes: '<p><b>[5분]</b> 왼쪽 코드로 실행하면 버튼이 눌려도 아무 일이 없고, 출력 창에 바인딩 오류가 뜹니다. 오른쪽: ① 명령은 이름으로 찾은 ListBox 의 DataContext(MainViewModel)에서, ② 매개변수는 그 줄의 항목. 두 가지를 나눠 설명하세요.</p><p>실제 WPF 에서는 <code>RelativeSource={RelativeSource AncestorType=ListBox}</code> 로 “나를 감싼 ListBox” 를 찾는 방법도 많이 씁니다. 이 강좌의 웹 실습 환경은 템플릿 안의 RelativeSource(FindAncestor)를 찾지 못하므로 두 환경에서 모두 되는 ElementName 을 썼습니다.</p>' },
          { layout: 'diagram', title: '체크 한 번의 흐름', html: SVG_FLOW, caption: '항목 알림을 구독하면 남은 개수가 저절로',
            notes: '<p><b>[5분]</b> 이 그림으로 칠판의 “왜일까?” 에 답합니다. ⑥ 필터는 3교시 내용이라고 표시해 두세요. 구독을 끊는(<code>-=</code>) 이유: 지운 항목이 나중에 바뀌어도 ViewModel 이 반응하지 않게(그리고 메모리에서 정리되게).</p>' },
          { layout: 'table', title: '단계 3 의 명령', head: ['명령', 'CanExecute', '매개변수'], rows: [['DeleteCommand', '(항상)', '그 줄의 TodoItem'], ['ToggleCommand', 'SelectedTodo != null', '없음 (SelectedTodo)'], ['ClearCompletedCommand', 'DoneCount > 0', '없음'], ['AddCommand', '제목이 있을 때', '없음']],
            notes: '<p><b>[4분]</b> 매개변수로 대상을 받는 방식(Delete)과 ViewModel 의 상태(SelectedTodo)로 대상을 정하는 방식(Toggle)을 비교합니다. 둘 다 흔히 씁니다.</p>' },
          { layout: 'bullets', title: '흔한 실수', bullets: ['foreach 로 돌면서 Remove → 예외 (ToList 로 복사)', '구독만 하고 끊지 않음 (<code>-=</code>)', '템플릿 안에서 <code>{Binding DeleteCommand}</code>', '계산 속성 알림 누락 → 개수 멈춤', 'ViewModel 에서 ListBox.SelectedItem 을 직접 읽기'],
            notes: '<p><b>[3분]</b> 마지막 항목: ViewModel 은 컨트롤을 모르므로 SelectedItem 을 TwoWay 로 SelectedTodo 에 바인딩해 두고 그 속성을 씁니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>CommandParameter="{Binding}"</code> 이 넘기는 값은?', options: ['null', '버튼 자신', '그 줄의 TodoItem', 'ListBox 전체'], answer: 2, explain: '경로 없는 Binding = DataContext 그 자체. 템플릿 안이므로 그 줄의 항목입니다.',
            notes: '<p>이어서 “CommandParameter=\"{Binding Title}\" 이면?” → 제목 문자열이 넘어간다.</p>' },
          { layout: 'practice', title: '실습 P5-3 · P5-4', desc: '<p>P5-3: 모두 전환 — 남은 일이 있으면 모두 완료, 아니면 모두 해제. P5-4: 고른 할 일의 제목 고치기 — HasSelection 과 SelectedTodo.Title 바인딩.</p>', starter: PR3_S, solution: PR3_A,
            notes: '<p><b>[실습]</b> P5-3 은 “화면 코드가 한 줄도 필요 없다” 는 것을 체험하게 하는 과제입니다. P5-4 는 18장 마스터-디테일의 복습입니다.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: ['DataContext 한 줄로 View ↔ ViewModel', 'ObservableCollection + DataTemplate = 목록', 'RelayCommand + CanExecute = 버튼 켜고 끄기', 'ElementName + CommandParameter="{Binding}"', '목록 알림 + 항목 알림 구독 → 남은 개수', '변환기로 취소선'],
            notes: '<p>다음 교시: ICollectionView 로 필터(F6), JSON 저장 · 불러오기(F7 · F8).</p>' }
        ]
      },
      /* ===================================================================== p05-3 */
      {
        id: 'p05-3',
        title: '단계별 구현 ② — 필터와 JSON 저장',
        minutes: 50,
        goals: [
          'CollectionViewSource.GetDefaultView 로 컬렉션의 기본 뷰를 얻을 수 있다',
          'ICollectionView 의 Filter 와 Refresh() 로 원본을 바꾸지 않고 목록을 걸러 보여 줄 수 있다',
          '라디오 버튼 여러 개가 CommandParameter 로 한 명령을 나눠 쓰게 만들 수 있다',
          'System.Text.Json 을 쓰는 저장 서비스를 만들어 ViewModel 에서 저장 · 불러오기 할 수 있다',
          '파일이 없거나 깨졌을 때를 예외 처리해 상태 메시지로 알릴 수 있다'
        ],
        flow: [['단계 3 복습', 3], ['단계 4 ICollectionView 필터', 18], ['단계 5 JSON 저장 · 불러오기', 20], ['정리 · 퀴즈', 9]],
        content: [
          { type: 'h', text: '단계 4. ICollectionView 로 필터 만들기' },
          { type: 'p', html: '“진행 중만 보기” 를 만들 때 <code>Todos</code> 에서 완료 항목을 <b>지우면 안 됩니다</b> — 다시 “전체” 를 누르면 돌아와야 하니까요. WPF 는 컬렉션과 화면 사이에 <b>컬렉션 뷰(collection view)</b>라는 층을 둡니다. 뷰는 원본을 그대로 둔 채 <b>걸러 보기(Filter)</b>, <b>정렬(SortDescriptions)</b>, <b>현재 항목</b>을 관리합니다. <code>CollectionViewSource.GetDefaultView(Todos)</code> 가 원본의 기본 뷰(<code>ICollectionView</code>)를 돌려줍니다.' },
          { type: 'figure', html: SVG_VIEW, caption: '원본(Todos) → 뷰(TodosView, 필터) → ListBox' },
          { type: 'table', head: ['멤버', '뜻', '이 앱에서'], rows: [
            ['<code>CollectionViewSource.GetDefaultView(원본)</code>', '원본 컬렉션의 기본 뷰를 얻는다 (같은 원본이면 늘 같은 뷰)', '생성자에서 <code>TodosView</code> 에 저장'],
            ['<code>Filter</code>', '<code>Predicate&lt;object&gt;</code> — 항목마다 불러 true 인 것만 보인다', '<code>TodosView.Filter = FilterTodo;</code>'],
            ['<code>Refresh()</code>', '모든 항목에 필터 · 정렬을 다시 적용', '필터 조건(<code>Filter</code> 속성)이나 항목의 IsDone 이 바뀔 때'],
            ['<code>SortDescriptions</code>', '정렬 기준 목록', '확장 과제 2 (중요한 일 먼저)']
          ], caption: 'ICollectionView 의 주요 멤버' },
          { type: 'p', html: '필터 함수는 1교시 준비 예제 2 의 <code>Matches</code> 와 같은 모양입니다. 다만 뷰는 항목을 <code>object</code> 로 넘기므로 <code>if (obj is not TodoItem item) return false;</code> 로 형식을 확인하고 씁니다. 조건이 되는 <code>Filter</code> 속성(열거형 <code>TodoFilter</code>)이 바뀌면 <code>Refresh()</code> 로 다시 거릅니다.' },
          { type: 'list', items: [
            '<b>라디오 버튼 → 명령</b>: 세 버튼 모두 <code>Command="{Binding FilterCommand}"</code> 이고 <code>CommandParameter</code> 만 <code>"All"</code> · <code>"Active"</code> · <code>"Done"</code> 으로 다릅니다. <code>Enum.TryParse</code> 로 문자열을 열거형으로 바꿉니다.',
            '<b>추가 · 삭제</b>는 원본의 <code>CollectionChanged</code> 를 뷰가 스스로 듣고 다시 거르므로 따로 할 일이 없습니다.',
            '<b>항목의 IsDone 변경</b>은 뷰가 모릅니다. 그래서 “진행 중” 보기에서 체크한 항목이 목록에 남아 있지 않도록, 항목 알림 처리기(<code>Todo_PropertyChanged</code>)에서 필터 중이면 <code>RefreshView()</code> 를 부릅니다.',
            '<b>ItemsSource 는 TodosView</b>: 실제 WPF 는 <code>{Binding Todos}</code> 로 원본에 바인딩해도 내부적으로 같은 기본 뷰를 쓰지만, 뷰를 ViewModel 의 속성으로 드러내 두면 “화면은 걸러진 뷰를 본다” 는 의도가 분명해지고 어떤 환경에서도 같게 동작합니다.'
          ] },
          { type: 'code', title: '단계 4. 전체 · 진행 중 · 완료 필터 — ICollectionView', code: STEP4, desc: '“진행 중” 을 고르고 항목을 체크하면 그 항목이 목록에서 사라집니다. “전체” 로 돌아가면 다시 보입니다(원본은 그대로). 필터 중에 새 할 일을 추가하면 진행 중이므로 바로 보입니다. <code>RefreshView()</code> 는 다시 거르기 전에 <code>SelectedTodo = null</code> 로 선택을 풉니다. 걸러진 뒤에 <b>보이지 않는 항목이 선택되어 있는</b> 이상한 상태를 막기 위해서입니다. 아래의 “남은 일 · 완료” 는 뷰가 아니라 원본(Todos)으로 세므로 필터와 상관없이 전체 개수입니다.' },
          { type: 'callout', kind: 'warn', title: 'ICollectionView 는 어느 네임스페이스?', html: '<code>ICollectionView</code> 인터페이스는 실제 WPF 에서 <code>System.ComponentModel</code> 에, <code>CollectionViewSource</code> 는 <code>System.Windows.Data</code> 에 있습니다. ViewModel 에 두 using 을 모두 두세요. <code>System.Windows.Data</code> 를 쓰는 것이 “ViewModel 이 WPF 를 안다” 는 뜻이라 꺼리는 사람도 있습니다. 더 엄격하게 하려면 필터 결과를 ViewModel 이 직접 만든 컬렉션으로 가지는 방법도 있지만, 컬렉션 뷰는 컨트롤이 아니라 데이터를 다루는 도구라서 ViewModel 에서 쓰는 것이 일반적입니다.' },
          { type: 'h', text: '단계 5. JSON 으로 저장하고 불러오기' },
          { type: 'p', html: '저장은 <b>Service</b> 가 맡습니다. 실습 P5-2 에서 만든 것과 비슷한 <code>TodoStorage</code> 를 <code>Services</code> 폴더에 두고, ViewModel 은 <code>storage.Save(Todos)</code> · <code>storage.Load()</code> 만 부릅니다. 파일 경로 <code>"todos.json"</code> 은 <b>상대 경로</b>라서 프로그램의 작업 폴더(Visual Studio 에서 실행하면 <code>bin\\Debug\\net9.0-windows</code>)에 만들어집니다.' },
          { type: 'figure', html: SVG_JSON, caption: '저장 = 직렬화 + 파일 쓰기, 불러오기 = 파일 읽기 + 역직렬화' },
          { type: 'list', items: [
            '<b>저장</b>: <code>JsonSerializer.Serialize(Todos, Options)</code> — ObservableCollection 도 목록이므로 그대로 JSON 배열이 됩니다. <code>TodoItem</code> 의 public 속성 Title · IsDone 만 저장되고, <code>PropertyChanged</code> 이벤트는 저장되지 않습니다.',
            '<b>불러오기</b>: <code>Deserialize&lt;List&lt;TodoItem&gt;&gt;</code> 로 <b>새 TodoItem 객체들</b>을 만든 뒤, <code>Todos.Clear()</code> 하고 하나씩 <code>Add</code> 합니다. Add 할 때마다 CollectionChanged 가 불려 새 항목의 알림도 구독됩니다. <code>Todos = new …</code> 로 컬렉션 자체를 바꾸면 화면 · 뷰 · 구독이 모두 옛 컬렉션을 보고 있게 되므로 하지 않습니다(그래서 <code>Todos</code> 는 get 만 있는 속성).',
            '<b>시작할 때</b>: 생성자에서 파일이 있으면 불러오고, 없으면 샘플 항목을 넣습니다.',
            '<b>오류</b>: 파일 내용이 깨졌으면 <code>JsonException</code>, 파일이 잠겨 있거나 쓸 수 없으면 <code>IOException</code> — 잡아서 <code>StatusMessage</code> 로 알립니다. 프로그램은 멈추지 않습니다.'
          ] },
          { type: 'code', title: '단계 5. JSON 저장 · 불러오기 — TodoStorage 서비스', code: STEP5, desc: '할 일을 몇 개 추가 · 체크하고 <b>저장</b>을 누른 뒤 창을 닫았다가 다시 실행해 보세요. 시작할 때 <code>todos.json</code> 을 자동으로 불러옵니다. 저장한 뒤 목록을 바꾸고 <b>불러오기</b>를 누르면 저장해 둔 상태로 돌아갑니다(불러오기는 파일이 있을 때만 켜짐). 웹 실습에서는 브라우저 안의 작업 폴더(<code>/work</code>)에 저장되므로 같은 페이지에서 다시 실행하면 불러와집니다.' },
          { type: 'callout', kind: 'more', title: '📘 작업 폴더 대신 사용자 데이터 폴더', html: '<p>실제로 배포하는 앱은 exe 옆(작업 폴더)에 파일을 쓰면 안 되는 경우가 많습니다. <code>C:\\Program Files</code> 에 설치된 프로그램은 관리자 권한 없이 그 폴더에 쓸 수 없기 때문입니다. 사용자별 데이터는 보통 <code>Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)</code>(<code>C:\\Users\\이름\\AppData\\Roaming</code>) 아래에 앱 이름 폴더를 만들어 저장합니다: <code>Path.Combine(appData, "TodoApp", "todos.json")</code> + <code>Directory.CreateDirectory</code>. 경로를 <code>TodoStorage</code> 생성자로 받게 만들어 두었으므로 ViewModel 한 줄만 바꾸면 됩니다.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 todos.json 찾아보기', html: '<ul><li>솔루션 탐색기 위쪽의 <b>모든 파일 표시</b> 단추를 누르면 <code>bin\\Debug\\net9.0-windows</code> 폴더가 보입니다. 저장한 뒤 그 안의 <code>todos.json</code> 을 더블클릭하면 VS 의 JSON 편집기로 열립니다(들여쓰기 확인, 한글은 <code>\\uXXXX</code> 로 적혀 있음).</li><li>파일을 직접 고쳐서 일부러 망가뜨려 보고(괄호 하나 지우기) 앱에서 <b>불러오기</b> → “올바른 JSON 이 아닙니다” 메시지가 나오는지 확인하세요.</li><li>프로젝트 폴더를 오른쪽 클릭 → <b>파일 탐색기에서 폴더 열기</b> 로 실제 위치를 열 수도 있습니다.</li><li><b>Release</b> 로 빌드하면 경로가 <code>bin\\Release\\…</code> 로 바뀌어 저장 파일도 따로 생깁니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P5-5. 필터 버튼에 개수 표시하기',
            level: 2,
            desc: '<p>라디오 버튼의 글자를 <b>전체 (3) · 진행 중 (2) · 완료 (1)</b> 처럼 개수와 함께 보이게 하세요. XAML 은 <code>Content="{Binding AllLabel}"</code> 처럼 바뀌어 있습니다.</p><ul><li>계산 속성 <code>AllLabel</code> · <code>ActiveLabel</code> · <code>DoneLabel</code> 만들기</li><li>추가 · 삭제 · 체크할 때마다 세 글자가 바뀌도록 <code>NotifyCounts()</code> 에서 함께 알리기</li><li>필터를 바꿔도 개수는 원본 기준 (전체 개수는 그대로)</li></ul>',
            hint: '<code>public string AllLabel =&gt; $"전체 ({Todos.Count})";</code> — ActiveLabel 은 RemainingCount, DoneLabel 은 DoneCount 를 쓰면 됩니다. 계산 속성은 스스로 알리지 못하므로 “재료가 바뀌는 곳” 인 NotifyCounts() 에 알림 세 줄을 더합니다(20장 계산 속성 규칙). 완성 프로그램에도 이 기능이 들어갑니다.',
            starter: PR5_S,
            solution: PR5_A
          },
          {
            title: '실습 P5-6. 검색 상자',
            level: 2,
            desc: '<p>필터 줄 아래에 검색 칸이 있습니다(<code>{Binding SearchText, UpdateSourceTrigger=PropertyChanged}</code>). 한 글자 칠 때마다 제목에 검색어가 들어 있는 할 일만 보이게 하세요.</p><ul><li><code>SearchText</code> 속성: 바뀌면 <code>RefreshView()</code></li><li><code>FilterTodo</code>: 검색어가 있으면 제목에 들어 있는 것만 (대소문자 무시), 그리고 기존의 전체 · 진행 중 · 완료 조건도 함께</li><li>시험: “만들” 을 치면 “TodoItem 모델 만들기” 만, 진행 중 + “기능” → “필터 · 저장 기능 완성하기”</li></ul>',
            hint: '<code>if (!string.IsNullOrWhiteSpace(SearchText) &amp;&amp; !item.Title.Contains(SearchText.Trim(), StringComparison.OrdinalIgnoreCase)) return false;</code> 를 switch 앞에 넣으면 “검색 조건 <b>그리고</b> 상태 조건” 이 됩니다. 필터 조건이 두 가지로 늘었지만 뷰 · 화면 코드는 그대로이고 FilterTodo 한 곳만 바뀝니다 — 필터를 함수 하나로 모아 둔 효과입니다.',
            starter: PR6_S,
            solution: PR6_A
          }
        ],
        quiz: [
          { q: '“진행 중” 보기를 만들 때 완료 항목을 <code>Todos</code> 에서 Remove 하지 않고 ICollectionView 의 Filter 를 쓰는 가장 큰 이유는?', options: ['Remove 가 느려서', '원본을 그대로 두어야 “전체” 로 돌아갔을 때 항목이 다시 보이기 때문에', 'Filter 가 자동으로 파일에 저장해서', 'ObservableCollection 은 Remove 를 지원하지 않아서'], answer: 1, explain: '필터는 보기만 바꿉니다. 원본은 그대로라서 조건을 바꾸면 다시 보이고, 저장할 때도 모든 항목이 저장됩니다.' },
          { q: '다음 중 <b>Refresh() 를 직접 부르지 않아도</b> 뷰에 반영되는 것은?', options: ['Filter 속성(TodoFilter)을 Active 로 바꿈', '어떤 항목의 IsDone 이 바뀜', 'Todos 에 새 항목을 Add', '어떤 항목의 Title 이 바뀌어 검색 결과가 달라짐'], answer: 2, explain: '뷰는 원본의 CollectionChanged(추가 · 삭제)를 스스로 듣습니다. 필터 조건이나 항목 속성의 변화는 알 수 없으므로 Refresh() 가 필요합니다.' },
          { q: '불러오기에서 <code>Todos = new ObservableCollection&lt;TodoItem&gt;(items);</code> 처럼 컬렉션을 새로 만들지 않고 Clear() 후 Add 하는 이유는?', options: ['새로 만드는 것이 문법 오류라서', '화면 · 뷰(TodosView) · 구독이 모두 처음 컬렉션에 연결되어 있어서, 새 컬렉션을 만들면 화면이 옛 것을 계속 보기 때문에', 'Clear 가 더 빨라서', 'JSON 이 ObservableCollection 을 만들 수 없어서'], answer: 1, explain: 'TodosView 는 생성자에서 처음 컬렉션으로 만들었고 CollectionChanged 구독도 그 컬렉션에 있습니다. 같은 컬렉션의 내용을 바꾸면 모든 연결이 그대로 유지됩니다.' },
          { q: '<code>JsonSerializer.Deserialize&lt;List&lt;TodoItem&gt;&gt;("{ 이건 JSON 이 아님")</code> 을 실행하면?', options: ['빈 목록을 돌려준다', 'null 을 돌려준다', 'JsonException 이 발생한다', 'IOException 이 발생한다'], answer: 2, explain: 'JSON 형식이 아니면 JsonException 입니다. 파일을 읽는 단계의 문제(없음 · 잠김)는 IOException 계열입니다. 둘을 나눠 잡으면 사용자에게 알맞은 메시지를 줄 수 있습니다.' },
          { q: '라디오 버튼 세 개가 <code>Command="{Binding FilterCommand}"</code> 를 함께 쓸 때 어느 버튼인지 구분하는 방법은?', options: ['버튼마다 x:Name 을 붙여 ViewModel 에서 읽는다', 'CommandParameter 에 서로 다른 값("All" "Active" "Done")을 준다', 'GroupName 을 다르게 준다', 'IsChecked 를 ViewModel 에서 읽는다'], answer: 1, explain: '명령은 하나, 매개변수만 다르게 — P04 계산기에서 Tag 로 연산자를 구분한 것과 같은 생각입니다. ViewModel 은 버튼(x:Name)을 모릅니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ②', subtitle: '단계 4 ICollectionView 필터 → 단계 5 JSON 저장 · 불러오기', badge: 'Project 05 · 3교시',
            notes: '<p><b>[복습 3분]</b> 단계 3 앱을 실행해 체크 → 개수 변화를 다시 보여 줍니다. “진행 중인 것만 보려면 완료 항목을 지우면 될까?” 로 시작합니다.</p>' },
          { layout: 'diagram', title: '컬렉션 뷰 — 원본은 그대로', html: SVG_VIEW, caption: 'GetDefaultView → Filter → Refresh()',
            notes: '<p><b>[5분]</b> 사진 필터 비유: 원본 사진(Todos)은 그대로 두고 보는 방법(뷰)만 바꾼다. 필터를 끄면 원본이 그대로 보인다.</p>' },
          { layout: 'code', title: 'ICollectionView 필터 — 가장 짧은 예', code: SL_VIEW, points: ['<code>CollectionViewSource.GetDefaultView(원본)</code>', 'ListBox 에는 <b>뷰</b>를 연결', '<code>view.Filter = o =&gt; …</code> 로 조건', '<code>Filter = null</code> → 전체'],
            notes: '<p><b>[5분]</b> 체크박스를 켜고 끄며 원본 개수(6개)는 그대로라는 것을 강조합니다. Filter 에 새 함수를 넣는 순간 다시 걸러진다는 점, 조건이 바깥 변수에 있으면 Refresh() 가 필요하다는 점을 대비시키세요.</p>' },
          { layout: 'table', title: '단계 4 — 언제 다시 거르나?', head: ['일', '뷰가 알까?', '할 일'], rows: [['Todos.Add · Remove', '안다 (CollectionChanged)', '없음'], ['Filter 속성 변경', '모른다', 'RefreshView()'], ['항목 IsDone 변경', '모른다', '필터 중이면 RefreshView()'], ['검색어 변경 (P5-6)', '모른다', 'RefreshView()']],
            notes: '<p><b>[5분]</b> 본문 단계 4 를 실행하며 표의 네 줄을 하나씩 확인합니다. RefreshView 가 선택을 푸는 이유도 함께.</p>' },
          { layout: 'bullets', title: '라디오 버튼 → 명령 하나', bullets: ['세 버튼 모두 <code>Command="{Binding FilterCommand}"</code>', '<code>CommandParameter</code> 만 "All" · "Active" · "Done"', '<code>Enum.TryParse(name, out TodoFilter value)</code>', 'Filter 속성의 set → RefreshView()', 'P04 의 Tag 와 같은 생각'],
            notes: '<p><b>[3분]</b> ViewModel 은 RadioButton 을 모르고 문자열만 받는다는 점을 강조합니다.</p>' },
          { layout: 'code', title: '단계 5. JSON — 저장과 불러오기', code: SL_JSON, points: ['<code>JsonSerializer.Serialize(목록)</code>', '<code>File.WriteAllText</code> / <code>ReadAllText</code>', '<code>Deserialize&lt;List&lt;TodoItem&gt;&gt;</code>', '옵션 없이: 한 줄 · 한글은 \\uXXXX'],
            notes: '<p><b>[5분]</b> 옵션 없이 저장한 결과를 보여 주고 1교시 준비 예제 3(옵션 세 개)과 비교합니다. 앱의 TodoStorage 는 옵션을 static 필드로 한 번만 만들어 재사용합니다.</p>' },
          { layout: 'bullets', title: 'ViewModel 의 Save · Load', bullets: ['Save: <code>storage.Save(Todos)</code> + 상태 메시지', 'Load: <code>Todos.Clear()</code> → 하나씩 <code>Add</code>', '<code>Todos = new …</code> 는 금지 (연결이 끊긴다)', '시작할 때: 파일이 있으면 Load, 없으면 샘플', 'catch JsonException · IOException → StatusMessage'],
            notes: '<p><b>[8분]</b> 본문 단계 5 를 실행합니다: 추가 → 저장 → 다시 실행 → 자동 불러오기. 이어서 todos.json 을 망가뜨리고 불러오기 → 메시지(VS 에서 시연하거나 본문 vs 상자 참고).</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: 'Refresh() 를 부르지 않아도 뷰에 반영되는 것은?', options: ['Filter 속성 변경', '항목의 IsDone 변경', 'Todos.Add', '항목 Title 변경'], answer: 2, explain: '뷰는 원본의 추가 · 삭제만 스스로 안다.',
            notes: '<p>이어서 “Todos = new ObservableCollection(...) 을 하면 왜 화면이 안 바뀔까?” 를 물어 퀴즈 3번과 연결합니다.</p>' },
          { layout: 'practice', title: '실습 P5-5 · P5-6', desc: '<p>P5-5: 라디오 버튼에 “진행 중 (2)” 처럼 개수 표시 — 계산 속성 세 개 + NotifyCounts. P5-6: 검색 상자 — SearchText + FilterTodo 에 조건 추가.</p>', starter: PR6_S, solution: PR6_A,
            notes: '<p><b>[실습]</b> 두 과제 모두 “한 곳만 고치면 된다” 는 MVVM 의 장점을 체험하게 합니다. P5-5 는 계산 속성 알림, P5-6 은 필터 함수 확장입니다.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: ['<code>GetDefaultView(Todos)</code> → <code>TodosView</code>', '<code>Filter = FilterTodo</code>, 조건이 바뀌면 <code>Refresh()</code>', '라디오 버튼 → 명령 하나 + CommandParameter', 'TodoStorage: Serialize · Deserialize + 파일', 'Load 는 Clear + Add (컬렉션을 바꾸지 않기)', 'JsonException · IOException → StatusMessage'],
            notes: '<p>다음 교시: 완성 프로그램 점검과 확장 과제(자동 저장 · 중요 표시와 정렬).</p>' }
        ]
      },
      /* ===================================================================== p05-4 */
      {
        id: 'p05-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '완성 프로그램의 파일 구조와 각 파일의 책임을 설명할 수 있다',
          '요구사항 표로 MVVM 앱을 점검할 수 있다',
          '변경 여부(IsDirty)를 추적하고 창을 닫을 때 자동 저장할 수 있다',
          'ICollectionView 의 SortDescriptions 로 정렬을 더할 수 있다'
        ],
        flow: [['완성 프로그램 구조', 10], ['실행 · 점검', 8], ['개선 아이디어', 5], ['확장 과제', 22], ['발표 · 정리', 5]],
        content: [
          { type: 'h', text: '1. 완성 프로그램' },
          { type: 'p', html: '단계 5 에 실습 P5-5 의 <b>필터 개수 표시</b>를 더한 것이 완성 프로그램입니다. 파일 구조를 다시 정리하면 다음과 같습니다.' },
          { type: 'table', head: ['파일', '역할', '주요 멤버'], rows: [
            ['<code>MainWindow.xaml</code>', 'View', '입력 줄 · 필터 줄(+ 저장 · 불러오기) · 목록(DataTemplate) · 개수 줄 · 상태 줄'],
            ['<code>MainWindow.xaml.cs</code>', 'View', '<code>DataContext = new MainViewModel();</code> 한 줄'],
            ['<code>Models/TodoItem.cs</code>', 'Model', 'Title · IsDone · PropertyChanged'],
            ['<code>ViewModels/MainViewModel.cs</code>', 'ViewModel', 'Todos · TodosView · NewTitle · SelectedTodo · Filter · Summary · 라벨 · 명령 7개'],
            ['<code>ViewModels/ViewModelBase.cs</code> · <code>RelayCommand.cs</code>', '공통', 'OnPropertyChanged · SetProperty · ICommand'],
            ['<code>Services/TodoStorage.cs</code>', 'Service', 'Save · Load · Exists (System.Text.Json)'],
            ['<code>Converters/DoneToDecorationsConverter.cs</code>', 'View 도우미', 'IsDone → 취소선']
          ], caption: '완성 프로그램의 파일 구성 — 새 기능이 어느 파일에 들어갈지 먼저 정하는 습관' },
          { type: 'code', title: '완성 프로그램. WPF 할 일 관리 (MVVM · 필터 · JSON 저장)', code: FINAL, desc: '추가(Enter) → 체크 → 필터 → 저장 → 다시 실행(자동 불러오기) 순서로 시험해 보세요. 라디오 버튼의 개수는 원본 기준이라 필터를 바꿔도 그대로이고, 추가 · 삭제 · 체크할 때마다 바뀝니다. XAML 과 ViewModel 사이에는 <b>바인딩 지도(1교시)</b> 의 이름만 오가고, 코드 비하인드에는 처리기가 하나도 없습니다.' },
          { type: 'callout', kind: 'tip', title: '최종 점검 체크리스트 (1교시 요구사항 표)', html: '<ul><li>☐ F1 빈 칸 · 공백만이면 추가 버튼이 꺼진다 / Enter 로 추가되고 입력 칸이 비워진다</li><li>☐ F2 체크하면 취소선, 완료 전환은 고른 항목이 있을 때만 켜진다</li><li>☐ F3 ✕ 는 그 줄만 지운다 (선택한 항목이 아니어도)</li><li>☐ F4 완료 지우기는 완료 항목이 있을 때만 켜지고, 완료한 것만 지운다</li><li>☐ F5 추가 · 삭제 · 체크할 때마다 “남은 일 · 완료” 와 필터 개수가 바뀐다</li><li>☐ F6 진행 중 보기에서 체크하면 목록에서 빠지고, 전체로 돌아가면 보인다</li><li>☐ F7 저장 → 다시 실행하면 자동으로 불러온다 / 불러오기는 파일이 있을 때만</li><li>☐ F8 todos.json 을 망가뜨려도 멈추지 않고 메시지가 나온다</li></ul>' },
          { type: 'h', text: '2. 더 좋게 만들려면?' },
          { type: 'callout', kind: 'more', title: '📘 ViewModel 테스트하기', html: '<p>MainViewModel 은 창 없이 만들 수 있으므로 20장처럼 테스트 코드에서 <code>vm.NewTitle = "우유"; vm.AddCommand.Execute(null);</code> 후 <code>vm.Todos.Count</code> · <code>vm.Summary</code> 를 확인할 수 있습니다. 다만 지금은 생성자에서 <code>new TodoStorage("todos.json")</code> 을 직접 만들기 때문에 테스트할 때도 진짜 파일을 건드립니다. 저장소를 <b>생성자 매개변수로 받게</b> 바꾸면(<code>MainViewModel(ITodoStorage storage)</code>) 테스트에서는 메모리에만 저장하는 가짜 저장소를 넘길 수 있습니다 — <b>의존성 주입(dependency injection)</b> 입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 MVVM 라이브러리 — CommunityToolkit.Mvvm', html: '<p>ViewModelBase · RelayCommand 같은 코드는 모든 MVVM 앱이 거의 똑같이 씁니다. Microsoft 의 <b>CommunityToolkit.Mvvm</b> NuGet 패키지를 쓰면 <code>[ObservableProperty] private string newTitle;</code> · <code>[RelayCommand] private void AddTodo() { … }</code> 처럼 특성(attribute)만 붙여도 속성과 명령 코드가 자동으로 만들어집니다(소스 생성기). 직접 만들어 원리를 이해한 지금이 라이브러리를 쓰기 좋은 때입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 저장을 비동기로', html: '<p>할 일이 수천 개가 되면 저장 · 불러오기 동안 창이 잠깐 멈출 수 있습니다. <code>await File.WriteAllTextAsync(…)</code> · <code>await JsonSerializer.SerializeAsync(stream, …)</code> 를 쓰면 파일 작업 동안에도 화면이 반응합니다. 명령도 <code>async</code> 메서드를 부르는 형태(AsyncRelayCommand)로 바꿔야 하고, 저장 중에는 저장 버튼을 끄는(CanExecute) 처리가 필요합니다.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 창을 닫을 때 동작 확인하기', html: '<ul><li>XAML 의 <code>&lt;Window</code> 안에서 <code>Closing="</code> 까지 입력하고 <b>&lt;새 이벤트 처리기&gt;</b> 를 고르면 코드 비하인드에 <code>Window_Closing(object? sender, CancelEventArgs e)</code> 가 만들어집니다(확장 과제 1).</li><li><code>e.Cancel = true;</code> 로 두면 창이 닫히지 않습니다. “저장하시겠습니까?” 를 물어 <b>취소</b>를 고르면 닫기를 멈추는 데 씁니다.</li><li>디버그 중에 VS 의 <b>디버깅 중지</b>(<kbd>Shift</kbd>+<kbd>F5</kbd>)로 끝내면 Closing 이 불리지 않습니다. 반드시 창의 <b>X</b> 단추로 닫아서 시험하세요.</li></ul>' },
          { type: 'h', text: '3. 확장 과제' },
          { type: 'list', items: [
            '<b>과제 1 (응용)</b> 변경 표시와 자동 저장 — 저장하지 않은 변경이 있으면 창 제목 끝에 <code>*</code>, 창을 닫을 때 자동 저장',
            '<b>과제 2 (도전)</b> 중요 표시와 정렬 — 항목마다 ★ 체크박스, 중요한 일이 목록 위쪽에 오도록 <code>SortDescriptions</code>'
          ] },
          { type: 'p', html: '두 과제 모두 XAML 은 준비되어 있고 ViewModel(과제 2 는 Model 도)만 고칩니다. 과제 1 은 “무엇이 바뀌면 변경인가?” 를 알림 처리기에서 찾는 문제이고, 과제 2 는 Model 에 속성 하나를 더하면 JSON 저장까지 저절로 따라온다는 것을 확인하는 문제입니다.' }
        ],
        practice: [
          {
            title: '확장 과제 1. 변경 표시(*)와 닫을 때 자동 저장',
            level: 2,
            desc: '<p>창 제목이 <code>Title="{Binding WindowTitle}"</code> 로 바뀌어 있고, <code>IsDirty</code> · <code>WindowTitle</code> 속성과 창의 <code>Closing</code> 처리기가 준비되어 있습니다. TODO 네 곳을 채우세요.</p><ul><li>목록이 바뀌면(추가 · 삭제) <code>IsDirty = true</code></li><li>항목이 바뀌면(체크 등) <code>IsDirty = true</code></li><li>저장하면 <code>IsDirty = false</code> (불러오기 · 시작 직후도 false — 이미 되어 있음)</li><li>창을 닫을 때 <code>IsDirty</code> 이면 저장 명령 실행</li></ul><p>시험: 체크 → 제목에 * → 저장 → * 사라짐 → 체크 → X 로 닫기 → 다시 실행하면 체크가 남아 있음</p>',
            hint: '“바뀜” 은 두 알림 처리기(<code>Todos_CollectionChanged</code>, <code>Todo_PropertyChanged</code>)에서 모두 알 수 있습니다. 창을 닫는 것은 View 의 일이므로 Closing 처리기는 코드 비하인드에 두고, 저장 자체는 <code>vm.SaveCommand.Execute(null)</code> 로 ViewModel 에 맡깁니다. <code>IsDirty</code> 의 set 이 <code>WindowTitle</code> 도 알리므로 제목은 저절로 바뀝니다. 웹 실습에서는 창을 닫는 동작이 실제 WPF 와 다를 수 있으니 Visual Studio 로도 확인해 보세요.',
            starter: EX1_S,
            solution: EX1_A
          },
          {
            title: '확장 과제 2. 중요 표시(★)와 정렬',
            level: 3,
            desc: '<p>항목마다 <b>★</b> 체크박스가 있습니다(<code>IsChecked="{Binding IsImportant, Mode=TwoWay}"</code>). 중요한 일이 목록 위쪽에 오게 하세요.</p><ul><li>Model: <code>TodoItem.IsImportant</code> 속성 (알림 포함)</li><li>ViewModel: <code>TodosView.SortDescriptions</code> 에 <code>IsImportant</code> 내림차순(true 먼저) 정렬</li><li>★ 를 켜고 끌 때 다시 정렬 (<code>RefreshView()</code>)</li><li>저장 · 불러오기에도 중요 표시가 남는지 확인 (JSON 에 <code>"isImportant"</code>)</li></ul>',
            hint: '<code>TodosView.SortDescriptions.Add(new SortDescription(nameof(TodoItem.IsImportant), ListSortDirection.Descending));</code> — bool 은 false &lt; true 이므로 내림차순이면 true 가 위입니다. 필터처럼 정렬도 항목 값이 바뀐 것을 뷰가 모르므로 <code>Todo_PropertyChanged</code> 에서 <code>e.PropertyName == nameof(TodoItem.IsImportant)</code> 일 때 RefreshView() 를 부릅니다. JSON 은 public 속성을 모두 저장하므로 TodoStorage 는 고칠 필요가 없습니다.',
            starter: EX2_S,
            solution: EX2_A
          }
        ],
        quiz: [
          { q: '완성 프로그램에서 “할 일에 마감일(DueDate)을 추가” 하려면 <b>반드시</b> 고쳐야 하는 파일이 아닌 것은?', options: ['Models/TodoItem.cs (속성 추가)', 'MainWindow.xaml (DatePicker · 표시 추가)', 'Services/TodoStorage.cs', 'ViewModels/MainViewModel.cs (새 항목의 마감일 입력 속성)'], answer: 2, explain: 'System.Text.Json 은 public 속성을 모두 저장하므로 TodoItem 에 속성만 더하면 저장 · 불러오기가 저절로 따라옵니다.' },
          { q: '<code>SortDescription(nameof(TodoItem.IsImportant), ListSortDirection.Descending)</code> 로 정렬하면 목록 맨 위에 오는 것은?', options: ['IsImportant 가 false 인 항목', 'IsImportant 가 true 인 항목', '제목이 가나다순으로 빠른 항목', '가장 최근에 추가한 항목'], answer: 1, explain: 'bool 은 false &lt; true 입니다. 내림차순(Descending)이면 큰 값(true)이 먼저 옵니다.' },
          { q: '창을 닫을 때 자동 저장하는 코드를 코드 비하인드의 Closing 처리기에 두는 이유로 알맞은 것은?', options: ['ViewModel 에서는 파일을 쓸 수 없어서', '“창이 닫힌다” 는 것은 View 의 사건이므로 View 가 받아서 ViewModel 의 저장 명령에 맡기는 것이 역할에 맞아서', 'Closing 은 XAML 에서 쓸 수 없어서', '코드 비하인드가 더 빨라서'], answer: 1, explain: '창의 생명 주기(열림 · 닫힘)는 View 의 일입니다. View 는 사건을 받아 ViewModel 에 “저장해” 라고 시키기만 하고, 저장 규칙은 ViewModel · Service 에 남습니다.' },
          { q: 'ViewModel 이 <code>new TodoStorage("todos.json")</code> 을 직접 만드는 대신 생성자 매개변수로 저장소를 받게 바꾸면 좋은 점은?', options: ['파일 크기가 작아진다', '테스트할 때 진짜 파일 대신 가짜(메모리) 저장소를 넘길 수 있다', 'JSON 대신 XML 만 쓸 수 있다', '바인딩이 더 빨라진다'], answer: 1, explain: '필요한 부품을 밖에서 넣어 주는 의존성 주입입니다. 테스트 · 저장 위치 변경 · 다른 저장 방식으로 바꾸기가 쉬워집니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: '완성 프로그램 점검 · 개선 아이디어 · 확장 과제', badge: 'Project 05 · 4교시',
            notes: '<p><b>[도입 2분]</b> 3교시까지의 앱에 필터 개수(P5-5)가 더해진 것이 완성 프로그램이라고 안내하고, 파일 구조부터 함께 봅니다.</p>' },
          { layout: 'table', title: '완성 프로그램의 파일', head: ['파일', '역할'], rows: [['MainWindow.xaml (+ .cs 한 줄)', 'View'], ['Models/TodoItem.cs', 'Model'], ['ViewModels/MainViewModel.cs', 'ViewModel'], ['ViewModelBase · RelayCommand', '공통'], ['Services/TodoStorage.cs', 'Service'], ['Converters/DoneToDecorations…', 'View 도우미']],
            notes: '<p><b>[5분]</b> “검색 기능을 더하려면 어느 파일?” “저장 위치를 바꾸려면?” “완료한 일을 회색으로?” 처럼 질문하고 파일을 고르게 합니다.</p>' },
          { layout: 'diagram', title: '다시 보는 구조', html: SVG_ARCH, caption: '코드 비하인드에 처리기가 하나도 없다',
            notes: '<p><b>[3분]</b> 1교시에 설계한 그림이 그대로 코드가 되었다는 것을 확인합니다. P04 계산기의 코드 비하인드와 비교해 보세요.</p>' },
          { layout: 'bullets', title: '최종 점검 (F1~F8)', bullets: ['F1 빈 칸이면 추가 꺼짐 · Enter 로 추가', 'F2~F4 체크 · ✕ · 완료 지우기 (CanExecute)', 'F5 개수 · 필터 개수가 바로 바뀜', 'F6 진행 중에서 체크 → 빠짐 → 전체에서 보임', 'F7 저장 → 다시 실행 → 자동 불러오기', 'F8 깨진 파일 → 메시지'],
            notes: '<p><b>[8분]</b> 짝끼리 서로의 앱을 체크리스트로 점검하게 합니다. 실패한 항목은 “어느 알림이 빠졌나?” 로 원인을 찾게 하세요.</p>' },
          { layout: 'table', title: '개선 아이디어', head: ['주제', '방향'], rows: [['테스트', '저장소를 생성자로 받기 (의존성 주입)'], ['반복 코드', 'CommunityToolkit.Mvvm ([ObservableProperty] · [RelayCommand])'], ['큰 파일', 'async 저장 · 불러오기'], ['저장 위치', 'AppData 폴더'], ['단축키', 'KeyBinding (Ctrl+S) — VS 에서']],
            notes: '<p><b>[5분]</b> 본문 more 상자 세 개를 요약합니다. CommunityToolkit.Mvvm 은 실무에서 가장 많이 쓰는 MVVM 도구라는 것을 알려 주세요.</p>' },
          { layout: 'two', title: '확장 과제 1 — 변경 표시 · 자동 저장', left: { title: 'ViewModel', code: 'public bool IsDirty\n{\n    get { return isDirty; }\n    private set\n    {\n        if (SetProperty(ref isDirty, value))\n            OnPropertyChanged(nameof(WindowTitle));\n    }\n}\n// 목록 · 항목 알림에서 IsDirty = true\n// Save · Load 뒤에 IsDirty = false', run: false }, right: { title: 'View (코드 비하인드)', code: '<Window Title="{Binding WindowTitle}"\n        Closing="Window_Closing">\n\nprivate void Window_Closing(object? sender,\n                            CancelEventArgs e)\n{\n    if (vm.IsDirty)\n        vm.SaveCommand.Execute(null);\n}', run: false },
            notes: '<p><b>[3분]</b> 닫기는 View 의 사건, 저장은 ViewModel 의 일 — 역할을 나누는 기준을 다시 확인합니다.</p>' },
          { layout: 'bullets', title: '확장 과제 2 — 중요 표시와 정렬', bullets: ['Model: <code>IsImportant</code> (알림 포함)', '<code>SortDescriptions.Add(new SortDescription(…, Descending))</code>', '★ 가 바뀌면 <code>RefreshView()</code> (정렬도 뷰가 모른다)', 'JSON 저장은 고칠 것 없음 (public 속성은 저장)', '필터 + 정렬이 함께 동작'],
            notes: '<p><b>[안내 2분 + 실습 20분]</b> 과제 2 는 Model 까지 고쳐야 해서 더 어렵습니다. 저장 후 todos.json 을 열어 "isImportant" 가 생긴 것을 확인하게 하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '마감일(DueDate)을 추가할 때 반드시 고칠 필요가 <b>없는</b> 파일은?', options: ['TodoItem.cs', 'MainWindow.xaml', 'TodoStorage.cs', 'MainViewModel.cs'], answer: 2, explain: 'JSON 직렬화는 public 속성을 모두 저장하므로 저장소는 그대로.',
            notes: '<p>시간이 남으면 마감일을 실제로 추가해 보는 것을 과제 3 으로 제안해도 좋습니다(DatePicker 는 16장).</p>' },
          { layout: 'practice', title: '확장 과제 1. 변경 표시 · 자동 저장', desc: '<p>목록 · 항목 알림에서 IsDirty = true, 저장하면 false, 창을 닫을 때 IsDirty 이면 저장.</p>', starter: EX1_S, solution: EX1_A,
            notes: '<p><b>[실습]</b> TODO 가 네 곳에 흩어져 있습니다. “바뀜을 알 수 있는 곳이 어디인가?” 를 먼저 찾게 하세요.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['Model(알림) · ViewModel(상태 · 명령) · View(바인딩) · Service(저장)', '목록 알림 + 항목 알림 구독 → 계산 속성', 'RelayCommand · CanExecute · CommandParameter · ElementName', 'ICollectionView: Filter · Refresh · SortDescriptions', 'System.Text.Json + 예외 처리 → 멈추지 않는 저장', '코드 비하인드 = DataContext 한 줄'],
            notes: '<p><b>[발표 · 정리 5분]</b> 확장 과제 결과를 두세 명이 시연합니다. 다음 프로젝트 P06 주소록에서도 같은 구조(Model · ViewModel · Storage)를 다시 쓸 수 있다고 예고합니다.</p>' }
        ]
      }
    ]
  });
})();
