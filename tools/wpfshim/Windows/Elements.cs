using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Reflection;
using System.Text.Json;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using WpfShim;

namespace System.Windows
{
    public interface IInputElement { }

    /// <summary>모든 화면 요소의 기본. 속성 값을 저장하고 바뀔 때마다 렌더러에 알린다.</summary>
    public abstract class UIElement : DependencyObject, IInputElement
    {
        public int Id { get; }
        internal readonly Dictionary<string, object?> Values = new Dictionary<string, object?>();
        internal readonly HashSet<string> LocalSet = new HashSet<string>();
        internal readonly Dictionary<string, BindingExpression> Bindings = new Dictionary<string, BindingExpression>();
        internal readonly HashSet<string> DomEvents = new HashSet<string>();
        internal FrameworkElement? ParentElement;

        protected UIElement()
        {
            Id = UiTree.NextId();
            UiTree.Register(this);
            UiTree.Op("new", Id, GetType().Name, GetType().FullName);
        }

        // ---------------------------------------------------------------- 속성 저장소
        protected T Get<T>(string name, T def) => Values.TryGetValue(name, out var v) && v is T t ? t : def;
        protected T? Get<T>(string name) => Values.TryGetValue(name, out var v) && v is T t ? t : default;

        // 자주 쓰는 의존 속성 (SetBinding · BeginAnimation · SetValue 용)
        public static readonly DependencyProperty OpacityProperty = DependencyProperty.Register("Opacity", typeof(double), typeof(UIElement));
        public static readonly DependencyProperty VisibilityProperty = DependencyProperty.Register("Visibility", typeof(Visibility), typeof(UIElement));
        public static readonly DependencyProperty IsEnabledProperty = DependencyProperty.Register("IsEnabled", typeof(bool), typeof(UIElement));
        public static readonly DependencyProperty RenderTransformProperty = DependencyProperty.Register("RenderTransform", typeof(Transform), typeof(UIElement));
        public static readonly DependencyProperty RenderTransformOriginProperty = DependencyProperty.Register("RenderTransformOrigin", typeof(Point), typeof(UIElement));
        protected object? GetObj(string name) => Values.TryGetValue(name, out var v) ? v : null;

        /// <summary>코드/XAML 에서 값을 설정 (지역 값)</summary>
        protected void Set(string name, object? value)
        {
            LocalSet.Add(name);
            SetCore(name, value, true);
        }
        /// <summary>스타일 등 낮은 우선순위로 설정 (지역 값이 있으면 무시)</summary>
        internal void SetStyleValue(string name, object? value)
        {
            if (LocalSet.Contains(name)) return;
            SetCore(name, value, true);
        }
        /// <summary>UI(사용자 조작)에서 온 변경: 렌더러에 다시 보내지 않는다</summary>
        internal void SetFromUi(string name, object? value)
        {
            SetCore(name, value, false);
            if (Bindings.TryGetValue(name, out var be)) be.UpdateSource(value);
        }
        internal virtual void SetCore(string name, object? value, bool notify)
        {
            Values.TryGetValue(name, out var old);
            Values[name] = value;
            if (notify) UiTree.Prop(Id, name, value);
            OnPropertyChanged(name, old, value);
        }
        protected virtual void OnPropertyChanged(string name, object? oldValue, object? newValue) { }

        /// <summary>부착 속성 (Grid.Row 등)</summary>
        public void SetAttached(string key, object? value) => Set(key, value);
        public object? GetAttached(string key) => GetObj(key);

        /// <summary>리플렉션으로 속성 값을 설정 (바인딩 · 스타일 · XAML 공용)</summary>
        internal void SetPropertyValue(string name, object? value, bool fromStyle = false)
        {
            if (name.Contains('.')) { if (fromStyle) SetStyleValue(name, value); else Set(name, value); return; }
            var pi = GetType().GetProperty(name, BindingFlags.Public | BindingFlags.Instance);
            if (pi == null || !pi.CanWrite) { if (fromStyle) SetStyleValue(name, value); else Set(name, value); return; }
            var conv = Conv.To(pi.PropertyType, value);
            if (fromStyle)
            {
                if (LocalSet.Contains(name)) return;
                pi.SetValue(this, conv);
                LocalSet.Remove(name);
            }
            else pi.SetValue(this, conv);
        }
        internal object? GetPropertyValue(string name)
        {
            if (name.Contains('.')) return GetObj(name);
            var pi = GetType().GetProperty(name, BindingFlags.Public | BindingFlags.Instance);
            return pi != null && pi.CanRead ? pi.GetValue(this) : GetObj(name);
        }

        // ---------------------------------------------------------------- 공통 속성
        public Visibility Visibility { get => Get("Visibility", Visibility.Visible); set => Set("Visibility", value); }
        public bool IsEnabled { get => Get("IsEnabled", true); set => Set("IsEnabled", value); }
        public double Opacity { get => Get("Opacity", 1.0); set => Set("Opacity", value); }
        public bool IsHitTestVisible { get => Get("IsHitTestVisible", true); set => Set("IsHitTestVisible", value); }
        public bool Focusable { get => Get("Focusable", true); set => Set("Focusable", value); }
        public bool IsVisible => Visibility == Visibility.Visible;
        public bool IsFocused { get; internal set; }
        public bool IsMouseOver { get; internal set; }
        public bool IsKeyboardFocused => IsFocused;
        public bool IsKeyboardFocusWithin => IsFocused;
        public Transform? RenderTransform { get => Get<Transform?>("RenderTransform"); set => Set("RenderTransform", value); }
        public Point RenderTransformOrigin { get => Get("RenderTransformOrigin", new Point(0, 0)); set => Set("RenderTransformOrigin", value); }
        public bool ClipToBounds { get => Get("ClipToBounds", false); set => Set("ClipToBounds", value); }
        public bool SnapsToDevicePixels { get; set; }
        public bool AllowDrop { get; set; }
        public int TabIndex { get; set; }
        public string Uid { get; set; } = "";
        public Size DesiredSize => new Size(ActualWidthCore, ActualHeightCore);
        public Size RenderSize => new Size(ActualWidthCore, ActualHeightCore);
        internal double ActualWidthCore, ActualHeightCore;

        public bool Focus() { UiTree.Op("call", Id, "focus"); return true; }
        public void InvalidateVisual() { }
        public void InvalidateMeasure() { }
        public void InvalidateArrange() { }
        public void UpdateLayout() { }
        public void Measure(Size s) { }
        public void Arrange(Rect r) { }
        public bool CaptureMouse() => true;
        public void ReleaseMouseCapture() { }
        public void RaiseEvent(RoutedEventArgs e) { }
        public void AddHandler(RoutedEvent ev, Delegate handler) { AddHandler(ev, handler, false); }
        public void AddHandler(RoutedEvent ev, Delegate handler, bool handledEventsToo)
        {
            var evi = GetType().GetEvent(ev.Name.Replace("Event", ""));
            evi?.AddEventHandler(this, handler);
        }
        public void RemoveHandler(RoutedEvent ev, Delegate handler) { }
        public Point TranslatePoint(Point p, UIElement relativeTo) => p;
        public Point PointToScreen(Point p) => p;
        public Point PointFromScreen(Point p) => p;

        // ---------------------------------------------------------------- 마우스 · 키보드 이벤트
        private MouseButtonEventHandler? _mouseDown, _mouseUp, _mouseLeftDown, _mouseLeftUp, _mouseRightDown, _mouseRightUp, _pMouseDown, _pMouseUp, _pMouseLeftDown, _pMouseLeftUp, _pMouseRightDown, _pMouseRightUp, _mouseDoubleClick;
        private MouseEventHandler? _mouseMove, _mouseEnter, _mouseLeave, _pMouseMove;
        private MouseWheelEventHandler? _mouseWheel, _pMouseWheel;
        private KeyEventHandler? _keyDown, _keyUp, _pKeyDown, _pKeyUp;
        private TextCompositionEventHandler? _textInput, _pTextInput;
        private RoutedEventHandler? _gotFocus, _lostFocus;
        private DragEventHandler? _drop, _dragOver, _dragEnter, _dragLeave;

        internal void Subscribe(string domEvent)
        {
            if (DomEvents.Add(domEvent)) UiTree.Prop(Id, "$events", new List<string>(DomEvents));
        }
        public event MouseButtonEventHandler MouseDown { add { _mouseDown += value; Subscribe("mousedown"); } remove { _mouseDown -= value; } }
        public event MouseButtonEventHandler MouseUp { add { _mouseUp += value; Subscribe("mouseup"); } remove { _mouseUp -= value; } }
        public event MouseButtonEventHandler MouseLeftButtonDown { add { _mouseLeftDown += value; Subscribe("mousedown"); } remove { _mouseLeftDown -= value; } }
        public event MouseButtonEventHandler MouseLeftButtonUp { add { _mouseLeftUp += value; Subscribe("mouseup"); } remove { _mouseLeftUp -= value; } }
        public event MouseButtonEventHandler MouseRightButtonDown { add { _mouseRightDown += value; Subscribe("mousedown"); } remove { _mouseRightDown -= value; } }
        public event MouseButtonEventHandler MouseRightButtonUp { add { _mouseRightUp += value; Subscribe("mouseup"); } remove { _mouseRightUp -= value; } }
        public event MouseButtonEventHandler PreviewMouseDown { add { _pMouseDown += value; Subscribe("mousedown"); } remove { _pMouseDown -= value; } }
        public event MouseButtonEventHandler PreviewMouseUp { add { _pMouseUp += value; Subscribe("mouseup"); } remove { _pMouseUp -= value; } }
        public event MouseButtonEventHandler PreviewMouseLeftButtonDown { add { _pMouseLeftDown += value; Subscribe("mousedown"); } remove { _pMouseLeftDown -= value; } }
        public event MouseButtonEventHandler PreviewMouseLeftButtonUp { add { _pMouseLeftUp += value; Subscribe("mouseup"); } remove { _pMouseLeftUp -= value; } }
        public event MouseButtonEventHandler PreviewMouseRightButtonDown { add { _pMouseRightDown += value; Subscribe("mousedown"); } remove { _pMouseRightDown -= value; } }
        public event MouseButtonEventHandler PreviewMouseRightButtonUp { add { _pMouseRightUp += value; Subscribe("mouseup"); } remove { _pMouseRightUp -= value; } }
        public event MouseButtonEventHandler MouseDoubleClick { add { _mouseDoubleClick += value; Subscribe("dblclick"); } remove { _mouseDoubleClick -= value; } }
        public event MouseEventHandler MouseMove { add { _mouseMove += value; Subscribe("mousemove"); } remove { _mouseMove -= value; } }
        public event MouseEventHandler PreviewMouseMove { add { _pMouseMove += value; Subscribe("mousemove"); } remove { _pMouseMove -= value; } }
        public event MouseEventHandler MouseEnter { add { _mouseEnter += value; Subscribe("mouseenter"); } remove { _mouseEnter -= value; } }
        public event MouseEventHandler MouseLeave { add { _mouseLeave += value; Subscribe("mouseleave"); } remove { _mouseLeave -= value; } }
        public event MouseWheelEventHandler MouseWheel { add { _mouseWheel += value; Subscribe("wheel"); } remove { _mouseWheel -= value; } }
        public event MouseWheelEventHandler PreviewMouseWheel { add { _pMouseWheel += value; Subscribe("wheel"); } remove { _pMouseWheel -= value; } }
        public event KeyEventHandler KeyDown { add { _keyDown += value; Subscribe("keydown"); } remove { _keyDown -= value; } }
        public event KeyEventHandler KeyUp { add { _keyUp += value; Subscribe("keyup"); } remove { _keyUp -= value; } }
        public event KeyEventHandler PreviewKeyDown { add { _pKeyDown += value; Subscribe("keydown"); } remove { _pKeyDown -= value; } }
        public event KeyEventHandler PreviewKeyUp { add { _pKeyUp += value; Subscribe("keyup"); } remove { _pKeyUp -= value; } }
        public event TextCompositionEventHandler TextInput { add { _textInput += value; Subscribe("textinput"); } remove { _textInput -= value; } }
        public event TextCompositionEventHandler PreviewTextInput { add { _pTextInput += value; Subscribe("textinput"); } remove { _pTextInput -= value; } }
        public event RoutedEventHandler GotFocus { add { _gotFocus += value; Subscribe("focus"); } remove { _gotFocus -= value; } }
        public event RoutedEventHandler LostFocus { add { _lostFocus += value; Subscribe("blur"); } remove { _lostFocus -= value; } }
        public event RoutedEventHandler GotKeyboardFocus { add { _gotFocus += value; Subscribe("focus"); } remove { _gotFocus -= value; } }
        public event RoutedEventHandler LostKeyboardFocus { add { _lostFocus += value; Subscribe("blur"); } remove { _lostFocus -= value; } }
        public event DragEventHandler Drop { add { _drop += value; } remove { _drop -= value; } }
        public event DragEventHandler DragOver { add { _dragOver += value; } remove { _dragOver -= value; } }
        public event DragEventHandler DragEnter { add { _dragEnter += value; } remove { _dragEnter -= value; } }
        public event DragEventHandler DragLeave { add { _dragLeave += value; } remove { _dragLeave -= value; } }

        /// <summary>DOM 이벤트 → WPF 이벤트. 파생 클래스는 base 를 호출한 뒤 자기 이벤트를 처리한다.</summary>
        internal virtual void HandleDomEvent(string name, JsonElement a)
        {
            switch (name)
            {
                case "mousedown": case "mouseup": case "dblclick":
                {
                    var e = MouseButtonEventArgs.From(this, a);
                    if (name == "dblclick") { _mouseDoubleClick?.Invoke(this, e); return; }
                    var down = name == "mousedown";
                    if (down) { _pMouseDown?.Invoke(this, e); if (e.ChangedButton == MouseButton.Left) _pMouseLeftDown?.Invoke(this, e); else if (e.ChangedButton == MouseButton.Right) _pMouseRightDown?.Invoke(this, e); }
                    else { _pMouseUp?.Invoke(this, e); if (e.ChangedButton == MouseButton.Left) _pMouseLeftUp?.Invoke(this, e); else if (e.ChangedButton == MouseButton.Right) _pMouseRightUp?.Invoke(this, e); }
                    if (e.Handled) return;
                    if (down) { if (e.ChangedButton == MouseButton.Left) _mouseLeftDown?.Invoke(this, e); else if (e.ChangedButton == MouseButton.Right) _mouseRightDown?.Invoke(this, e); _mouseDown?.Invoke(this, e); }
                    else { if (e.ChangedButton == MouseButton.Left) _mouseLeftUp?.Invoke(this, e); else if (e.ChangedButton == MouseButton.Right) _mouseRightUp?.Invoke(this, e); _mouseUp?.Invoke(this, e); }
                    break;
                }
                case "mousemove": { var e = MouseEventArgs.From(this, a); _pMouseMove?.Invoke(this, e); if (!e.Handled) _mouseMove?.Invoke(this, e); break; }
                case "mouseenter": IsMouseOver = true; _mouseEnter?.Invoke(this, MouseEventArgs.From(this, a)); break;
                case "mouseleave": IsMouseOver = false; _mouseLeave?.Invoke(this, MouseEventArgs.From(this, a)); break;
                case "wheel": { var e = MouseWheelEventArgs.From(this, a); _pMouseWheel?.Invoke(this, e); if (!e.Handled) _mouseWheel?.Invoke(this, e); break; }
                case "keydown": { var e = KeyEventArgs.From(this, a); _pKeyDown?.Invoke(this, e); if (!e.Handled) _keyDown?.Invoke(this, e); break; }
                case "keyup": { var e = KeyEventArgs.From(this, a); _pKeyUp?.Invoke(this, e); if (!e.Handled) _keyUp?.Invoke(this, e); break; }
                case "textinput": { var e = new TextCompositionEventArgs(a.TryGetProperty("text", out var t) ? t.GetString() ?? "" : "") { Source = this }; _pTextInput?.Invoke(this, e); if (!e.Handled) _textInput?.Invoke(this, e); break; }
                case "focus": IsFocused = true; _gotFocus?.Invoke(this, new RoutedEventArgs { Source = this }); break;
                case "blur": IsFocused = false; _lostFocus?.Invoke(this, new RoutedEventArgs { Source = this }); break;
                case "size": ActualWidthCore = a.GetProperty("w").GetDouble(); ActualHeightCore = a.GetProperty("h").GetDouble(); (this as FrameworkElement)?.RaiseSizeChanged(); break;
            }
        }
        internal static double D(JsonElement a, string n) => a.TryGetProperty(n, out var v) && v.ValueKind == JsonValueKind.Number ? v.GetDouble() : 0;
        internal static string S(JsonElement a, string n) => a.TryGetProperty(n, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString() ?? "" : "";
        internal static bool B(JsonElement a, string n) => a.TryGetProperty(n, out var v) && v.ValueKind == JsonValueKind.True;
    }

    /// <summary>이름 · 크기 · 여백 · 정렬 · DataContext · 리소스 · 스타일을 가진 요소</summary>
    [Markup.ContentProperty("Content")]
    public class FrameworkElement : UIElement
    {
        private static readonly Dictionary<string, WeakReference<FrameworkElement>> _names = new Dictionary<string, WeakReference<FrameworkElement>>();
        public static readonly DependencyProperty WidthProperty = DependencyProperty.Register("Width", typeof(double), typeof(FrameworkElement));
        public static readonly DependencyProperty HeightProperty = DependencyProperty.Register("Height", typeof(double), typeof(FrameworkElement));
        public static readonly DependencyProperty MarginProperty = DependencyProperty.Register("Margin", typeof(Thickness), typeof(FrameworkElement));
        public static readonly DependencyProperty NameProperty = DependencyProperty.Register("Name", typeof(string), typeof(FrameworkElement));
        public static readonly DependencyProperty TagProperty = DependencyProperty.Register("Tag", typeof(object), typeof(FrameworkElement));
        public static readonly DependencyProperty ToolTipProperty = DependencyProperty.Register("ToolTip", typeof(object), typeof(FrameworkElement));
        public static readonly DependencyProperty DataContextProperty = DependencyProperty.Register("DataContext", typeof(object), typeof(FrameworkElement));
        public static readonly DependencyProperty StyleProperty = DependencyProperty.Register("Style", typeof(Style), typeof(FrameworkElement));
        public static readonly DependencyProperty HorizontalAlignmentProperty = DependencyProperty.Register("HorizontalAlignment", typeof(HorizontalAlignment), typeof(FrameworkElement));
        public static readonly DependencyProperty VerticalAlignmentProperty = DependencyProperty.Register("VerticalAlignment", typeof(VerticalAlignment), typeof(FrameworkElement));
        public static readonly DependencyProperty MinWidthProperty = DependencyProperty.Register("MinWidth", typeof(double), typeof(FrameworkElement));
        public static readonly DependencyProperty MinHeightProperty = DependencyProperty.Register("MinHeight", typeof(double), typeof(FrameworkElement));
        public static readonly DependencyProperty CursorProperty = DependencyProperty.Register("Cursor", typeof(Cursor), typeof(FrameworkElement));

        public string Name { get => Get("Name", ""); set { Set("Name", value); if (!string.IsNullOrEmpty(value)) RegisterName(value, this); } }
        public double Width { get => Get("Width", double.NaN); set => Set("Width", value); }
        public double Height { get => Get("Height", double.NaN); set => Set("Height", value); }
        public double MinWidth { get => Get("MinWidth", 0.0); set => Set("MinWidth", value); }
        public double MinHeight { get => Get("MinHeight", 0.0); set => Set("MinHeight", value); }
        public double MaxWidth { get => Get("MaxWidth", double.PositiveInfinity); set => Set("MaxWidth", value); }
        public double MaxHeight { get => Get("MaxHeight", double.PositiveInfinity); set => Set("MaxHeight", value); }
        public Thickness Margin { get => Get("Margin", new Thickness(0)); set => Set("Margin", value); }
        public HorizontalAlignment HorizontalAlignment { get => Get("HorizontalAlignment", HorizontalAlignment.Stretch); set => Set("HorizontalAlignment", value); }
        public VerticalAlignment VerticalAlignment { get => Get("VerticalAlignment", VerticalAlignment.Stretch); set => Set("VerticalAlignment", value); }
        public object? Tag { get => GetObj("Tag"); set { LocalSet.Add("Tag"); Values["Tag"] = value; } }
        public object? ToolTip { get => GetObj("ToolTip"); set => Set("ToolTip", value is UIElement ? value.ToString() : value); }
        public Cursor? Cursor { get => Get<Cursor?>("Cursor"); set => Set("Cursor", value); }
        public FlowDirection FlowDirection { get; set; }
        public Style? Style { get => Get<Style?>("Style"); set { Values["Style"] = value; LocalSet.Add("Style"); value?.ApplyTo(this); } }
        public ResourceDictionary Resources { get; set; } = new ResourceDictionary();
        public TriggerCollection Triggers { get; } = new TriggerCollection();
        public Controls.ContextMenu? ContextMenu { get => Get<Controls.ContextMenu?>("ContextMenu"); set { Values["ContextMenu"] = value; if (value != null) { value.Owner = this; UiTree.Prop(Id, "ContextMenu", value.Id); } } }
        public Media.Imaging.BitmapSource? ToolTipImage { get; set; }
        public string Language { get; set; } = "ko-KR";
        public bool OverridesDefaultStyle { get; set; }
        public bool UseLayoutRounding { get; set; }
        public double ActualWidth => ActualWidthCore > 0 || double.IsNaN(Width) ? ActualWidthCore : Width;
        public double ActualHeight => ActualHeightCore > 0 || double.IsNaN(Height) ? ActualHeightCore : Height;
        public DependencyObject? Parent => ParentElement;
        public FrameworkElement? TemplatedParent => null;
        public Data.BindingGroup? BindingGroup { get; set; }
        public bool IsLoaded { get; internal set; }
        public bool IsInitialized => true;
        public Controls.DataTemplate? ContentTemplateCache { get; set; }

        private object? _dataContext;
        private bool _dataContextSet;
        public object? DataContext
        {
            get => _dataContextSet ? _dataContext : ParentElement?.DataContext;
            set { _dataContext = value; _dataContextSet = true; LocalSet.Add("DataContext"); OnDataContextChanged(); }
        }
        internal bool HasLocalDataContext => _dataContextSet;
        public event DependencyPropertyChangedEventHandler? DataContextChanged;
        internal virtual void OnDataContextChanged()
        {
            foreach (var be in Bindings.Values) be.OnDataContextChanged();
            DataContextChanged?.Invoke(this, new DependencyPropertyChangedEventArgs(DataContextProperty, null, DataContext));
            PropagateDataContext();
        }
        internal virtual void PropagateDataContext()
        {
            foreach (var c in LogicalChildren()) if (!c.HasLocalDataContext) c.OnDataContextChanged();
        }
        internal virtual IEnumerable<FrameworkElement> LogicalChildren() { yield break; }

        internal void SetParent(FrameworkElement? p)
        {
            ParentElement = p;
            if (p != null)
            {
                ApplyImplicitStyle();
                if (!_dataContextSet) OnDataContextChanged();
                if (p.IsLoaded) RaiseLoaded();
            }
        }
        internal void ApplyImplicitStyle()
        {
            if (LocalSet.Contains("Style")) return;
            var st = TryFindResource(GetType()) as Style;
            if (st != null) { Values["Style"] = st; st.ApplyTo(this); }
        }

        public event RoutedEventHandler? Loaded;
        public event RoutedEventHandler? Unloaded;
        public event RoutedEventHandler? Initialized;
        public event SizeChangedEventHandler? SizeChanged;
        public event RoutedEventHandler? LayoutUpdated;
        public event ContextMenuEventHandler? ContextMenuOpening;
        public event RoutedEventHandler? ToolTipOpening;
        public event RoutedEventHandler? RequestBringIntoView;

        internal void RaiseLoaded()
        {
            if (IsLoaded) return;
            IsLoaded = true;
            Loaded?.Invoke(this, new RoutedEventArgs { Source = this });
            foreach (var t in Triggers)
                if (t is EventTrigger et && (et.RoutedEvent.EndsWith("Loaded") || et.RoutedEvent.Length == 0))
                    foreach (var a in et.Actions) if (a is Media.Animation.BeginStoryboard bs) bs.Storyboard?.Begin(this);
            foreach (var c in LogicalChildren()) c.RaiseLoaded();
        }
        internal void RaiseSizeChanged() => SizeChanged?.Invoke(this, new SizeChangedEventArgs { Source = this, NewSize = new Size(ActualWidthCore, ActualHeightCore) });
        public void BringIntoView() { UiTree.Op("call", Id, "scrollIntoView"); }

        // ---------------------------------------------------------------- 이름 · 리소스
        public static void RegisterName(string name, FrameworkElement el) { _names[name] = new WeakReference<FrameworkElement>(el); }
        public object? FindName(string name)
        {
            foreach (var c in Descendants()) if (c.Name == name) return c;
            if (Name == name) return this;
            return _names.TryGetValue(name, out var w) && w.TryGetTarget(out var t) ? t : null;
        }
        internal IEnumerable<FrameworkElement> Descendants()
        {
            foreach (var c in LogicalChildren()) { yield return c; foreach (var d in c.Descendants()) yield return d; }
        }
        public object? TryFindResource(object key)
        {
            for (FrameworkElement? e = this; e != null; e = e.ParentElement)
                if (e.Resources.TryGetValue(key, out var v)) return v;
            if (Application.Current != null && Application.Current.Resources.TryGetValue(key, out var av)) return av;
            return null;
        }
        public object FindResource(object key) => TryFindResource(key) ?? throw new ResourceReferenceKeyNotFoundException("리소스를 찾을 수 없습니다: " + key, key);
        public void SetResourceReference(DependencyProperty dp, object key) { var v = TryFindResource(key); if (v != null) SetPropertyValue(dp.Name, v); }

        // ---------------------------------------------------------------- 바인딩
        public BindingExpression? SetBinding(DependencyProperty dp, Binding binding) => BindingOperations.SetBinding(this, dp.Name, binding);
        public BindingExpression? SetBinding(DependencyProperty dp, string path) => BindingOperations.SetBinding(this, dp.Name, new Binding(path));
        public BindingExpression? SetBinding(string property, Binding binding) => BindingOperations.SetBinding(this, property, binding);
        public BindingExpression? GetBindingExpression(DependencyProperty dp) => Bindings.TryGetValue(dp.Name, out var b) ? b : null;
        public BindingExpression? GetBindingExpression(string property) => Bindings.TryGetValue(property, out var b) ? b : null;
        public void ClearBinding(string property) { Bindings.Remove(property); }

        protected override void OnPropertyChanged(string name, object? oldValue, object? newValue)
        {
            if (name == "Name" && newValue is string s && s.Length > 0) RegisterName(s, this);
        }
        public override string ToString() => GetType().Name + (Name.Length > 0 ? " " + Name : "");
    }

    public class ResourceReferenceKeyNotFoundException : Exception { public object Key { get; } public ResourceReferenceKeyNotFoundException(string msg, object key) : base(msg) { Key = key; } }

    public class ResourceDictionary : IDictionary<object, object?>
    {
        private readonly Dictionary<object, object?> _d = new Dictionary<object, object?>();
        public List<ResourceDictionary> MergedDictionaries { get; } = new List<ResourceDictionary>();
        private Uri? _source;
        /// <summary>다른 XAML 파일(리소스 사전)을 불러온다 — 편집기의 파일 구분(// ===== File: Styles.xaml =====)으로 등록된 파일</summary>
        public Uri? Source
        {
            get => _source;
            set
            {
                _source = value;
                if (value == null) return;
                var text = Markup.XamlRegistry.GetXaml(value.OriginalString);
                if (text == null) throw new Markup.XamlParseException($"리소스 사전 파일을 찾을 수 없습니다: {value.OriginalString} (파일 구분 주석으로 같은 이름의 .xaml 파일을 추가하세요)");
                if (Markup.XamlLoader.Parse(text) is ResourceDictionary rd)
                {
                    foreach (var kv in rd) _d[kv.Key] = kv.Value;
                    foreach (var m in rd.MergedDictionaries) MergedDictionaries.Add(m);
                }
            }
        }
        public object? this[object key]
        {
            get => TryGetValue(key, out var v) ? v : null;
            set => _d[key] = value;
        }
        public bool TryGetValue(object key, out object? value)
        {
            if (_d.TryGetValue(key, out value)) return true;
            foreach (var m in MergedDictionaries) if (m.TryGetValue(key, out value)) return true;
            value = null; return false;
        }
        public ICollection<object> Keys => _d.Keys;
        public ICollection<object?> Values => _d.Values;
        public int Count => _d.Count;
        public bool IsReadOnly => false;
        public void Add(object key, object? value) => _d[key] = value;
        public void Add(KeyValuePair<object, object?> item) => _d[item.Key] = item.Value;
        public void Clear() => _d.Clear();
        public bool Contains(KeyValuePair<object, object?> item) => _d.ContainsKey(item.Key);
        public bool ContainsKey(object key) => TryGetValue(key, out _);
        public bool Contains(object key) => TryGetValue(key, out _);
        public void CopyTo(KeyValuePair<object, object?>[] array, int i) { foreach (var kv in _d) array[i++] = kv; }
        public IEnumerator<KeyValuePair<object, object?>> GetEnumerator() => _d.GetEnumerator();
        public bool Remove(object key) => _d.Remove(key);
        public bool Remove(KeyValuePair<object, object?> item) => _d.Remove(item.Key);
        IEnumerator IEnumerable.GetEnumerator() => _d.GetEnumerator();
    }

    // ------------------------------------------------------------------ 스타일
    public class Setter : SetterBase
    {
        public string Property { get; set; } = "";
        public object? Value { get; set; }
        public string? TargetName { get; set; }
        public Setter() { }
        public Setter(DependencyProperty dp, object? value) { Property = dp.Name; Value = value; }
        public Setter(string property, object? value) { Property = property; Value = value; }
    }
    public abstract class SetterBase { }
    public class SetterBaseCollection : List<SetterBase> { }
    public class TriggerBase { }
    public class TriggerCollection : List<TriggerBase> { }
    [Markup.ContentProperty("Setters")]
    public class Trigger : TriggerBase
    {
        public string Property { get; set; } = "";
        public object? Value { get; set; }
        public SetterBaseCollection Setters { get; set; } = new SetterBaseCollection();
    }
    [Markup.ContentProperty("Setters")]
    public class DataTrigger : TriggerBase
    {
        public Binding? Binding { get; set; }
        public object? Value { get; set; }
        public SetterBaseCollection Setters { get; set; } = new SetterBaseCollection();
    }
    [Markup.ContentProperty("Setters")]
    public class EventTrigger : TriggerBase
    {
        public string RoutedEvent { get; set; } = "";
        public SetterBaseCollection Setters { get; set; } = new SetterBaseCollection();
        public List<object> Actions { get; set; } = new List<object>();
    }

    [Markup.ContentProperty("Setters")]
    public class Style
    {
        public Type? TargetType { get; set; }
        public Style? BasedOn { get; set; }
        public SetterBaseCollection Setters { get; set; } = new SetterBaseCollection();
        public TriggerCollection Triggers { get; set; } = new TriggerCollection();
        public ResourceDictionary Resources { get; set; } = new ResourceDictionary();
        public Style() { }
        public Style(Type targetType) { TargetType = targetType; }
        public Style(Type targetType, Style basedOn) { TargetType = targetType; BasedOn = basedOn; }
        public void Seal() { }
        internal void ApplyTo(FrameworkElement el)
        {
            BasedOn?.ApplyTo(el);
            foreach (var sb in Setters)
                if (sb is Setter s && s.Property.Length > 0)
                    el.SetPropertyValue(s.Property, s.Value, fromStyle: true);
            // 트리거: IsMouseOver 같은 상태 트리거는 렌더러에 힌트로 전달 (간이 지원)
            var hover = new Dictionary<string, object?>();
            foreach (var t in Triggers)
                if (t is Trigger tr && tr.Property == "IsMouseOver" && Equals(Conv.To(typeof(bool), tr.Value), true))
                    foreach (var sb in tr.Setters) if (sb is Setter s) hover[s.Property] = Conv.ToWire(s.Value is string str ? Conv.FromString(GuessType(s.Property), str) : s.Value);
            if (hover.Count > 0) UiTree.Prop(el.Id, "$hover", hover);
        }
        private static Type GuessType(string prop) => prop switch { "Background" or "Foreground" or "BorderBrush" or "Fill" or "Stroke" => typeof(Media.Brush), "FontWeight" => typeof(FontWeight), "Opacity" or "FontSize" or "Width" or "Height" => typeof(double), _ => typeof(string) };
    }
}
