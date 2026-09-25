using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using WpfShim;

namespace System.Windows.Controls
{
    public enum ClickMode { Release, Press, Hover }
    public enum ScrollBarVisibility { Disabled, Auto, Hidden, Visible }
    public enum SelectionMode { Single, Multiple, Extended }
    public enum CharacterCasing { Normal, Lower, Upper }
    public enum ExpandDirection { Down, Up, Left, Right }
    public enum TickPlacement { None, TopLeft, BottomRight, Both }
    public enum DataGridHeadersVisibility { None = 0, Column = 1, Row = 2, All = 3 }
    public enum DataGridSelectionMode { Single, Extended }
    public enum DataGridGridLinesVisibility { All, Horizontal, None, Vertical }
    public enum DataGridLengthUnitType { Auto, Pixel, SizeToCells, SizeToHeader, Star }
    public enum StretchDirection { UpOnly, DownOnly, Both }
    public enum PanningMode { None, HorizontalOnly, VerticalOnly, Both, HorizontalFirst, VerticalFirst }

    /// <summary>글꼴 · 색 · 테두리 · 패딩을 가진 컨트롤</summary>
    public class Control : FrameworkElement
    {
        public static readonly DependencyProperty BackgroundProperty = DependencyProperty.Register("Background", typeof(Brush), typeof(Control));
        public static readonly DependencyProperty ForegroundProperty = DependencyProperty.Register("Foreground", typeof(Brush), typeof(Control));
        public static readonly DependencyProperty BorderBrushProperty = DependencyProperty.Register("BorderBrush", typeof(Brush), typeof(Control));
        public static readonly DependencyProperty BorderThicknessProperty = DependencyProperty.Register("BorderThickness", typeof(Thickness), typeof(Control));
        public static readonly DependencyProperty FontSizeProperty = DependencyProperty.Register("FontSize", typeof(double), typeof(Control));
        public static readonly DependencyProperty FontWeightProperty = DependencyProperty.Register("FontWeight", typeof(FontWeight), typeof(Control));
        public static readonly DependencyProperty FontFamilyProperty = DependencyProperty.Register("FontFamily", typeof(FontFamily), typeof(Control));
        public static readonly DependencyProperty PaddingProperty = DependencyProperty.Register("Padding", typeof(Thickness), typeof(Control));
        public Brush? Background { get => Get<Brush?>("Background"); set => Set("Background", value); }
        public Brush? Foreground { get => Get<Brush?>("Foreground"); set => Set("Foreground", value); }
        public Brush? BorderBrush { get => Get<Brush?>("BorderBrush"); set => Set("BorderBrush", value); }
        public Thickness BorderThickness { get => Get("BorderThickness", new Thickness(1)); set => Set("BorderThickness", value); }
        public double FontSize { get => Get("FontSize", 12.0); set => Set("FontSize", value); }
        public FontFamily FontFamily { get => Get("FontFamily", new FontFamily("Segoe UI")); set => Set("FontFamily", value); }
        public FontWeight FontWeight { get => Get("FontWeight", FontWeights.Normal); set => Set("FontWeight", value); }
        public FontStyle FontStyle { get => Get("FontStyle", FontStyles.Normal); set => Set("FontStyle", value); }
        public FontStretch FontStretch { get; set; }
        public Thickness Padding { get => Get("Padding", new Thickness(0)); set => Set("Padding", value); }
        public HorizontalAlignment HorizontalContentAlignment { get => Get("HorizontalContentAlignment", HorizontalAlignment.Left); set => Set("HorizontalContentAlignment", value); }
        public VerticalAlignment VerticalContentAlignment { get => Get("VerticalContentAlignment", VerticalAlignment.Top); set => Set("VerticalContentAlignment", value); }
        public bool IsTabStop { get; set; } = true;
        public ControlTemplate? Template { get; set; }
        public CommandBindingCollection CommandBindings { get; } = new CommandBindingCollection();
        public InputBindingCollection InputBindings { get; } = new InputBindingCollection();
        public event MouseButtonEventHandler? PreviewMouseDoubleClick;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "keydown" && (InputBindings.Count > 0 || CommandBindings.Count > 0))
            {
                var key = KeyMap.FromDom(S(a, "code"), S(a, "key"));
                var mods = (B(a, "ctrl") ? ModifierKeys.Control : 0) | (B(a, "shift") ? ModifierKeys.Shift : 0) | (B(a, "alt") ? ModifierKeys.Alt : 0);
                bool inText = B(a, "text");   // 입력칸 안: Ctrl+C/V/Z 등은 입력칸이 처리
                // 1) KeyBinding / InputBinding
                foreach (var ib in InputBindings)
                {
                    if (!(ib.Gesture is KeyGesture kg) || !kg.Matches(key, mods) || ib.Command == null) continue;
                    if (ib.Command is RoutedCommand r) { if (r.CanExecute(ib.CommandParameter, this)) r.Execute(ib.CommandParameter, this); }
                    else if (ib.Command.CanExecute(ib.CommandParameter)) ib.Command.Execute(ib.CommandParameter);
                    return;
                }
                // 2) CommandBinding 된 명령의 기본 단축키 (ApplicationCommands.Save = Ctrl+S …)
                foreach (var cb in CommandBindings)
                {
                    if (!(cb.Command is RoutedCommand rc) || (inText && ApplicationCommands.IsEditing(rc))) continue;
                    foreach (var g in rc.InputGestures)
                        if (g is KeyGesture kg && kg.Matches(key, mods)) { if (cb.CheckCanExecute(this, null)) cb.Run(this, null); return; }
                }
            }
            base.HandleDomEvent(name, a);
        }
    }
    public class ControlTemplate { public Type? TargetType { get; set; } public object? Content { get; set; } }
    public class ToolTip : ContentControl { public bool IsOpen { get; set; } public PlacementMode Placement { get; set; } }
    public enum PlacementMode { Absolute, Relative, Bottom, Center, Right, Left, Top, Mouse, MousePoint }
    public static class ToolTipService { public static void SetToolTip(DependencyObject d, object? v) { if (d is FrameworkElement f) f.ToolTip = v; } public static object? GetToolTip(DependencyObject d) => (d as FrameworkElement)?.ToolTip; public static void SetShowDuration(DependencyObject d, int v) { } public static void SetInitialShowDelay(DependencyObject d, int v) { } }

    /// <summary>내용(Content) 하나를 표시하는 컨트롤: 문자열 · 요소 · 임의 객체(템플릿)</summary>
    [Markup.ContentProperty("Content")]
    public class ContentControl : Control
    {
        public static readonly DependencyProperty ContentProperty = DependencyProperty.Register("Content", typeof(object), typeof(ContentControl));
        private object? _content;
        private UIElement? _presented;
        public object? Content
        {
            get => _content;
            set { _content = value; LocalSet.Add("Content"); Present(); RaiseLocalChanged("Content"); }
        }
        public DataTemplate? ContentTemplate { get => Get<DataTemplate?>("ContentTemplate"); set { Values["ContentTemplate"] = value; Present(); } }
        public string? ContentStringFormat { get; set; }
        public bool HasContent => _content != null;
        internal void Present()
        {
            var v = _content;
            if (v is UIElement el)
            {
                _presented = el;
                if (el is FrameworkElement f) f.SetParent(this);
                UiTree.Children(Id, new List<int> { el.Id });
                UiTree.Prop(Id, "Content", null);
            }
            else if (v != null && (ContentTemplate != null || (FindTemplate(v) is DataTemplate)))
            {
                var t = ContentTemplate ?? (DataTemplate)FindTemplate(v)!;
                var e = t.Instantiate(v, this);
                _presented = e;
                if (e is FrameworkElement f) f.SetParent(this);
                UiTree.Children(Id, e == null ? new List<int>() : new List<int> { e.Id });
                UiTree.Prop(Id, "Content", null);
            }
            else
            {
                _presented = null;
                UiTree.Children(Id, new List<int>());
                var text = v == null ? null : ContentStringFormat != null ? string.Format(ContentStringFormat, v) : v is IFormattable f ? f.ToString(null, CultureInfo.CurrentCulture) : v.ToString();
                UiTree.Prop(Id, "Content", text);
            }
        }
        private object? FindTemplate(object v)
        {
            var t = v.GetType();
            return TryFindResource(new DataTemplateKey(t));
        }
        internal override IEnumerable<FrameworkElement> LogicalChildren() { if (_presented is FrameworkElement f) yield return f; }
        public override string ToString() => GetType().Name + ": " + (_content is string s ? s : _content?.GetType().Name ?? "");
    }
    public class DataTemplateKey
    {
        public Type DataType { get; }
        public DataTemplateKey(Type t) { DataType = t; }
        public override bool Equals(object? o) => o is DataTemplateKey k && k.DataType == DataType;
        public override int GetHashCode() => DataType.GetHashCode();
    }
    public class ContentPresenter : ContentControl { }
    [Markup.ContentProperty("Content")]
    public class HeaderedContentControl : ContentControl
    {
        private object? _header;
        public object? Header { get => _header; set { _header = value; if (value is UIElement el) { if (el is FrameworkElement f) f.SetParent(this); UiTree.Prop(Id, "Header", Conv.ToWire(el)); } else UiTree.Prop(Id, "Header", value?.ToString()); } }
        public DataTemplate? HeaderTemplate { get; set; }
        public bool HasHeader => _header != null;
    }
    public class UserControl : ContentControl { }
    public class Page : ContentControl { public string Title { get; set; } = ""; }
    public class GroupBox : HeaderedContentControl { }
    public class Expander : HeaderedContentControl
    {
        public bool IsExpanded { get => Get("IsExpanded", false); set { var o = IsExpanded; Set("IsExpanded", value); if (o != value) (value ? Expanded : Collapsed)?.Invoke(this, new RoutedEventArgs { Source = this }); } }
        public ExpandDirection ExpandDirection { get => Get("ExpandDirection", ExpandDirection.Down); set => Set("ExpandDirection", value); }
        public event RoutedEventHandler? Expanded;
        public event RoutedEventHandler? Collapsed;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "toggle") { var v = B(a, "checked"); SetFromUi("IsExpanded", v); (v ? Expanded : Collapsed)?.Invoke(this, new RoutedEventArgs { Source = this }); return; }
            base.HandleDomEvent(name, a);
        }
    }
    public class ScrollViewer : ContentControl
    {
        public ScrollBarVisibility VerticalScrollBarVisibility { get => Get("VerticalScrollBarVisibility", ScrollBarVisibility.Visible); set => Set("VerticalScrollBarVisibility", value); }
        public ScrollBarVisibility HorizontalScrollBarVisibility { get => Get("HorizontalScrollBarVisibility", ScrollBarVisibility.Disabled); set => Set("HorizontalScrollBarVisibility", value); }
        public double VerticalOffset { get; private set; }
        public double HorizontalOffset { get; private set; }
        public double ScrollableHeight => 0;
        public double ViewportHeight => ActualHeight;
        public double ExtentHeight => 0;
        public PanningMode PanningMode { get; set; }
        public void ScrollToEnd() => UiTree.Op("call", Id, "scrollToEnd");
        public void ScrollToBottom() => UiTree.Op("call", Id, "scrollToEnd");
        public void ScrollToTop() => UiTree.Op("call", Id, "scrollToTop");
        public void ScrollToHome() => UiTree.Op("call", Id, "scrollToTop");
        public void ScrollToVerticalOffset(double o) { VerticalOffset = o; UiTree.Op("call", Id, "scrollTo", o); }
        public void ScrollToHorizontalOffset(double o) { HorizontalOffset = o; }
        public void LineDown() { } public void LineUp() { } public void PageDown() { } public void PageUp() { }
        public event ScrollChangedEventHandler? ScrollChanged;
        public static void SetVerticalScrollBarVisibility(DependencyObject d, ScrollBarVisibility v) { if (d is UIElement e) e.SetAttached("ScrollViewer.VerticalScrollBarVisibility", v); }
        public static void SetHorizontalScrollBarVisibility(DependencyObject d, ScrollBarVisibility v) { if (d is UIElement e) e.SetAttached("ScrollViewer.HorizontalScrollBarVisibility", v); }
        public static ScrollBarVisibility GetVerticalScrollBarVisibility(DependencyObject d) => (d as UIElement)?.GetAttached("ScrollViewer.VerticalScrollBarVisibility") is ScrollBarVisibility v ? v : ScrollBarVisibility.Auto;
        public static void SetCanContentScroll(DependencyObject d, bool v) { }
    }
    public class ScrollChangedEventArgs : RoutedEventArgs { public double VerticalOffset { get; set; } public double HorizontalOffset { get; set; } public double VerticalChange { get; set; } public double ExtentHeight { get; set; } public double ViewportHeight { get; set; } }
    public delegate void ScrollChangedEventHandler(object sender, ScrollChangedEventArgs e);
    public class Separator : Control { }

    // ------------------------------------------------------------------ 텍스트
    [Markup.ContentProperty("Text")]
    public class TextBlock : FrameworkElement
    {
        public static readonly DependencyProperty TextProperty = DependencyProperty.Register("Text", typeof(string), typeof(TextBlock));
        public static readonly DependencyProperty ForegroundProperty = DependencyProperty.Register("Foreground", typeof(Brush), typeof(TextBlock));
        public static readonly DependencyProperty BackgroundProperty = DependencyProperty.Register("Background", typeof(Brush), typeof(TextBlock));
        public static readonly DependencyProperty FontSizeProperty = DependencyProperty.Register("FontSize", typeof(double), typeof(TextBlock));
        public static readonly DependencyProperty FontWeightProperty = DependencyProperty.Register("FontWeight", typeof(FontWeight), typeof(TextBlock));
        public static readonly DependencyProperty TextWrappingProperty = DependencyProperty.Register("TextWrapping", typeof(TextWrapping), typeof(TextBlock));
        public string Text { get => Get("Text", ""); set => Set("Text", value ?? ""); }
        public TextWrapping TextWrapping { get => Get("TextWrapping", TextWrapping.NoWrap); set => Set("TextWrapping", value); }
        public TextAlignment TextAlignment { get => Get("TextAlignment", TextAlignment.Left); set => Set("TextAlignment", value); }
        public TextTrimming TextTrimming { get => Get("TextTrimming", TextTrimming.None); set => Set("TextTrimming", value); }
        public TextDecorationCollection? TextDecorations { get => Get<TextDecorationCollection?>("TextDecorations"); set => Set("TextDecorations", value); }
        public Brush? Foreground { get => Get<Brush?>("Foreground"); set => Set("Foreground", value); }
        public Brush? Background { get => Get<Brush?>("Background"); set => Set("Background", value); }
        public double FontSize { get => Get("FontSize", 12.0); set => Set("FontSize", value); }
        public FontFamily FontFamily { get => Get("FontFamily", new FontFamily("Segoe UI")); set => Set("FontFamily", value); }
        public FontWeight FontWeight { get => Get("FontWeight", FontWeights.Normal); set => Set("FontWeight", value); }
        public FontStyle FontStyle { get => Get("FontStyle", FontStyles.Normal); set => Set("FontStyle", value); }
        public Thickness Padding { get => Get("Padding", new Thickness(0)); set => Set("Padding", value); }
        public double LineHeight { get => Get("LineHeight", double.NaN); set => Set("LineHeight", value); }
        public Documents.InlineCollection Inlines { get; }
        public TextBlock() { Inlines = new Documents.InlineCollection(this); }
        public TextBlock(Documents.Inline inline) : this() { Inlines.Add(inline); }
        internal void SyncInlines() { UiTree.Prop(Id, "$inlines", Inlines.ToWire()); }
        public override string ToString() => Text;
    }
    public class Label : ContentControl
    {
        public UIElement? Target { get; set; }
        public Label() { Values["Padding"] = new Thickness(5); }
    }
    public class AccessText : TextBlock { }

    public abstract class TextBoxBase : Control
    {
        public bool IsReadOnly { get => Get("IsReadOnly", false); set => Set("IsReadOnly", value); }
        public bool AcceptsReturn { get => Get("AcceptsReturn", false); set => Set("AcceptsReturn", value); }
        public bool AcceptsTab { get => Get("AcceptsTab", false); set => Set("AcceptsTab", value); }
        public ScrollBarVisibility VerticalScrollBarVisibility { get => Get("VerticalScrollBarVisibility", ScrollBarVisibility.Hidden); set => Set("VerticalScrollBarVisibility", value); }
        public ScrollBarVisibility HorizontalScrollBarVisibility { get => Get("HorizontalScrollBarVisibility", ScrollBarVisibility.Hidden); set => Set("HorizontalScrollBarVisibility", value); }
        public bool IsUndoEnabled { get; set; } = true;
        public Brush? SelectionBrush { get; set; }
        public Brush? CaretBrush { get; set; }
        public static readonly RoutedEvent TextChangedEvent = new RoutedEvent("TextChanged", typeof(TextBoxBase));
        public event TextChangedEventHandler? TextChanged;
        public event RoutedEventHandler? SelectionChanged;
        protected void RaiseTextChanged()
        {
            var e = new TextChangedEventArgs { Source = this, OriginalSource = this, RoutedEvent = TextChangedEvent };
            TextChanged?.Invoke(this, e);
            UIElement.RaiseRouted(this, TextChangedEvent, e);
        }
        public void SelectAll() => UiTree.Op("call", Id, "selectAll");
        public void Select(int start, int length)
        {
            // 값을 바로 반영 (같은 처리기 안에서 SelectionStart 를 다시 읽어도 새 위치)
            Values["SelectionStart"] = start; Values["SelectionLength"] = length; Values["CaretIndex"] = start + length;
            UiTree.Op("call", Id, "select", start, length);
            RaiseSelectionChanged();
        }
        internal void RaiseSelectionChanged() => SelectionChanged?.Invoke(this, new RoutedEventArgs { Source = this, OriginalSource = this });
        public void ScrollToEnd() => UiTree.Op("call", Id, "scrollToEnd");
        public void ScrollToHome() => UiTree.Op("call", Id, "scrollToTop");
        public void ScrollToLine(int line) { }
        public void Undo() { } public void Redo() { }
        public void Copy() { } public void Cut() { } public void Paste() { }
        public void AppendText(string text) { if (this is TextBox tb) tb.Text += text; }
        public void Clear() { if (this is TextBox tb) tb.Text = ""; }
    }
    public class TextChangedEventArgs : RoutedEventArgs { public UndoAction UndoAction { get; set; } }
    public enum UndoAction { None, Merge, Undo, Redo, Clear, Create }
    public delegate void TextChangedEventHandler(object sender, TextChangedEventArgs e);

    [Markup.ContentProperty("Text")]
    public class TextBox : TextBoxBase
    {
        public static readonly DependencyProperty TextProperty = DependencyProperty.Register("Text", typeof(string), typeof(TextBox));
        public string Text
        {
            get => Get("Text", "");
            set { var v = value ?? ""; var old = Text; Set("Text", v); if (old != v) RaiseTextChanged(); }
        }
        public int MaxLength { get => Get("MaxLength", 0); set => Set("MaxLength", value); }
        public int MaxLines { get => Get("MaxLines", 0); set => Set("MaxLines", value); }
        public int MinLines { get => Get("MinLines", 0); set => Set("MinLines", value); }
        public TextWrapping TextWrapping { get => Get("TextWrapping", TextWrapping.NoWrap); set => Set("TextWrapping", value); }
        public TextAlignment TextAlignment { get => Get("TextAlignment", TextAlignment.Left); set => Set("TextAlignment", value); }
        public CharacterCasing CharacterCasing { get => Get("CharacterCasing", CharacterCasing.Normal); set => Set("CharacterCasing", value); }
        public int CaretIndex { get => Get("CaretIndex", 0); set { Values["CaretIndex"] = value; UiTree.Op("call", Id, "select", value, 0); } }
        public int SelectionStart { get => Get("SelectionStart", 0); set { Values["SelectionStart"] = value; UiTree.Op("call", Id, "select", value, SelectionLength); } }
        public int SelectionLength { get => Get("SelectionLength", 0); set { Values["SelectionLength"] = value; UiTree.Op("call", Id, "select", SelectionStart, value); } }
        public string SelectedText { get { var t = Text; var s = Math.Min(SelectionStart, t.Length); var l = Math.Min(SelectionLength, t.Length - s); return t.Substring(s, l); } set { var t = Text; var s = Math.Min(SelectionStart, t.Length); var l = Math.Min(SelectionLength, t.Length - s); Text = t.Substring(0, s) + value + t.Substring(s + l); } }
        public int LineCount => Text.Split('\n').Length;
        public string GetLineText(int i) { var ls = Text.Split('\n'); return i < ls.Length ? ls[i] : ""; }
        public int GetLineIndexFromCharacterIndex(int i) => Text.Substring(0, Math.Max(0, Math.Min(i, Text.Length))).Count(c => c == '\n');
        public int GetCharacterIndexFromLineIndex(int line)
        {
            var t = Text; int idx = 0;
            for (int l = 0; l < line; l++) { var n = t.IndexOf('\n', idx); if (n < 0) return -1; idx = n + 1; }
            return idx;
        }
        public int GetLineLength(int line) { var ls = Text.Split('\n'); return line < ls.Length ? ls[line].Length + (line < ls.Length - 1 ? 1 : 0) : 0; }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "input")
            {
                Values["SelectionStart"] = (int)D(a, "selStart"); Values["SelectionLength"] = 0; Values["CaretIndex"] = (int)D(a, "selStart");
                var v = S(a, "value");
                if (v != Text) { SetFromUi("Text", v); RaiseTextChanged(); }
                return;
            }
            if (name == "select")
            {
                int s = (int)D(a, "selStart"), l = (int)D(a, "selLength");
                bool changed = s != SelectionStart || l != SelectionLength;
                Values["SelectionStart"] = s; Values["SelectionLength"] = l; Values["CaretIndex"] = s + l;
                if (changed) RaiseSelectionChanged();
                return;
            }
            base.HandleDomEvent(name, a);
        }
        public override string ToString() => Text;
    }
    public class PasswordBox : Control
    {
        public string Password { get => Get("Password", ""); set { var old = Password; Set("Password", value ?? ""); if (old != (value ?? "")) PasswordChanged?.Invoke(this, new RoutedEventArgs { Source = this }); } }
        public int MaxLength { get => Get("MaxLength", 0); set => Set("MaxLength", value); }
        public char PasswordChar { get => Get("PasswordChar", '●'); set => Set("PasswordChar", value); }
        public event RoutedEventHandler? PasswordChanged;
        public void Clear() => Password = "";
        public void SelectAll() => UiTree.Op("call", Id, "selectAll");
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "input") { SetFromUi("Password", S(a, "value")); PasswordChanged?.Invoke(this, new RoutedEventArgs { Source = this }); return; }
            base.HandleDomEvent(name, a);
        }
    }
    public class RichTextBox : TextBoxBase
    {
        public Documents.FlowDocument Document { get; set; } = new Documents.FlowDocument();
        public RichTextBox() { Values["AcceptsReturn"] = true; }
        public RichTextBox(Documents.FlowDocument doc) : this() { Document = doc; }
    }

    // ------------------------------------------------------------------ 버튼
    public abstract class ButtonBase : ContentControl
    {
        private ICommand? _command;
        public ICommand? Command
        {
            get => _command;
            set
            {
                if (_command != null) _command.CanExecuteChanged -= OnCanExecuteChanged;
                _command = value;
                if (_command != null) { _command.CanExecuteChanged += OnCanExecuteChanged; UpdateCanExecute(); }
            }
        }
        public object? CommandParameter { get; set; }
        public IInputElement? CommandTarget { get; set; }
        public ClickMode ClickMode { get; set; }
        public bool IsPressed { get; internal set; }
        public static readonly RoutedEvent ClickEvent = new RoutedEvent("Click", typeof(ButtonBase));
        public event RoutedEventHandler? Click;
        private void OnCanExecuteChanged(object? s, EventArgs e) => UpdateCanExecute();
        internal void UpdateCanExecute()
        {
            if (_command == null) return;
            if (_command is RoutedCommand rc) rc.Target = this;
            var can = _command.CanExecute(CommandParameter);
            SetStyleValue("IsEnabled", can);
        }
        internal virtual void OnClick()
        {
            var e = new RoutedEventArgs(ClickEvent, this);
            Click?.Invoke(this, e);
            UIElement.RaiseRouted(this, ClickEvent, e);   // 부모의 Button.Click="…" · AddHandler(ButtonBase.ClickEvent, …)
            if (_command != null)
            {
                if (_command is RoutedCommand rc) { if (rc.CanExecute(CommandParameter, this)) rc.Execute(CommandParameter, this); }
                else if (_command.CanExecute(CommandParameter)) _command.Execute(CommandParameter);
            }
        }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "click") { OnClick(); return; }
            base.HandleDomEvent(name, a);
        }
        public void RaiseClick() => OnClick();
    }
    public class Button : ButtonBase
    {
        public bool IsDefault { get => Get("IsDefault", false); set => Set("IsDefault", value); }
        public bool IsCancel { get => Get("IsCancel", false); set => Set("IsCancel", value); }
        public Button() { Values["Padding"] = new Thickness(10, 1, 10, 1); }
        internal override void OnClick()
        {
            base.OnClick();
            if (IsCancel) { var w = FindWindow(); if (w != null && w.IsDialog) { w.DialogResult = false; } }
        }
        internal Window? FindWindow() { for (FrameworkElement? e = this; e != null; e = e.ParentElement) if (e is Window w) return w; return null; }
    }
    public class RepeatButton : ButtonBase { public int Delay { get; set; } = 500; public int Interval { get; set; } = 50; }
    public class ToggleButton : ButtonBase
    {
        public static readonly DependencyProperty IsCheckedProperty = DependencyProperty.Register("IsChecked", typeof(bool?), typeof(ToggleButton));
        public bool? IsChecked
        {
            get => Values.TryGetValue("IsChecked", out var v) ? (v is bool b ? b : (bool?)null) : false;
            set { var old = IsChecked; Set("IsChecked", value); if (old != value) RaiseCheckedEvents(value); }
        }
        public bool IsThreeState { get => Get("IsThreeState", false); set => Set("IsThreeState", value); }
        public static readonly RoutedEvent CheckedEvent = new RoutedEvent("Checked", typeof(ToggleButton));
        public static readonly RoutedEvent UncheckedEvent = new RoutedEvent("Unchecked", typeof(ToggleButton));
        public static readonly RoutedEvent IndeterminateEvent = new RoutedEvent("Indeterminate", typeof(ToggleButton));
        public event RoutedEventHandler? Checked;
        public event RoutedEventHandler? Unchecked;
        public event RoutedEventHandler? Indeterminate;
        protected void RaiseCheckedEvents(bool? v)
        {
            var re = v == true ? CheckedEvent : v == false ? UncheckedEvent : IndeterminateEvent;
            var e = new RoutedEventArgs(re, this);
            if (v == true) Checked?.Invoke(this, e); else if (v == false) Unchecked?.Invoke(this, e); else Indeterminate?.Invoke(this, e);
            UIElement.RaiseRouted(this, re, e);
        }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "toggle")
            {
                bool? v = a.TryGetProperty("checked", out var c) ? (c.ValueKind == JsonValueKind.Null ? (bool?)null : c.GetBoolean()) : true;
                OnUiToggle(v);
                return;
            }
            if (name == "click") { OnClick(); return; }
            base.HandleDomEvent(name, a);
        }
        internal virtual void OnUiToggle(bool? v)
        {
            SetFromUi("IsChecked", v);
            RaiseCheckedEvents(v);
            OnClick();
        }
    }
    public class CheckBox : ToggleButton { }
    public class RadioButton : ToggleButton
    {
        public string? GroupName { get => Get<string?>("GroupName"); set => Set("GroupName", value); }
        internal override void OnUiToggle(bool? v)
        {
            if (v == true && ParentElement != null)
            {
                foreach (var s in ParentElement.LogicalChildren())
                    if (s is RadioButton r && !ReferenceEquals(r, this) && (r.GroupName ?? "") == (GroupName ?? "") && r.IsChecked == true)
                    { r.SetFromUi("IsChecked", false); r.RaiseCheckedEvents(false); }
            }
            base.OnUiToggle(v);
        }
    }

    // ------------------------------------------------------------------ 범위
    public abstract class RangeBase : Control
    {
        public static readonly DependencyProperty ValueProperty = DependencyProperty.Register("Value", typeof(double), typeof(RangeBase));
        public static readonly DependencyProperty MinimumProperty = DependencyProperty.Register("Minimum", typeof(double), typeof(RangeBase));
        public static readonly DependencyProperty MaximumProperty = DependencyProperty.Register("Maximum", typeof(double), typeof(RangeBase));
        public double Minimum { get => Get("Minimum", 0.0); set => Set("Minimum", value); }
        public double Maximum { get => Get("Maximum", 100.0); set => Set("Maximum", value); }
        public double Value
        {
            get => Get("Value", 0.0);
            set { var old = Value; var v = Math.Max(Minimum, Math.Min(Maximum, value)); Set("Value", v); if (old != v) ValueChanged?.Invoke(this, new RoutedPropertyChangedEventArgs<double>(old, v) { Source = this }); }
        }
        public double SmallChange { get => Get("SmallChange", 1.0); set => Set("SmallChange", value); }
        public double LargeChange { get => Get("LargeChange", 10.0); set => Set("LargeChange", value); }
        public event RoutedPropertyChangedEventHandler<double>? ValueChanged;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "change") { var old = Value; var v = D(a, "value"); if (old != v) { SetFromUi("Value", v); ValueChanged?.Invoke(this, new RoutedPropertyChangedEventArgs<double>(old, v) { Source = this }); } return; }
            base.HandleDomEvent(name, a);
        }
    }
    public class Slider : RangeBase
    {
        public Orientation Orientation { get => Get("Orientation", Orientation.Horizontal); set => Set("Orientation", value); }
        public double TickFrequency { get => Get("TickFrequency", 1.0); set => Set("TickFrequency", value); }
        public TickPlacement TickPlacement { get => Get("TickPlacement", TickPlacement.None); set => Set("TickPlacement", value); }
        public bool IsSnapToTickEnabled { get => Get("IsSnapToTickEnabled", false); set => Set("IsSnapToTickEnabled", value); }
        public bool IsMoveToPointEnabled { get; set; }
        public bool IsDirectionReversed { get; set; }
        public AutoToolTipPlacement AutoToolTipPlacement { get; set; }
        public DoubleCollection? Ticks { get; set; }
        public Slider() { Values["Maximum"] = 10.0; }
    }
    public enum AutoToolTipPlacement { None, TopLeft, BottomRight }
    public class ProgressBar : RangeBase
    {
        public bool IsIndeterminate { get => Get("IsIndeterminate", false); set => Set("IsIndeterminate", value); }
        public Orientation Orientation { get => Get("Orientation", Orientation.Horizontal); set => Set("Orientation", value); }
    }
    public class ScrollBar : RangeBase { public Orientation Orientation { get => Get("Orientation", Orientation.Vertical); set => Set("Orientation", value); } public double ViewportSize { get; set; } }

    // ------------------------------------------------------------------ 이미지 · 날짜
    public class Image : FrameworkElement
    {
        public static readonly DependencyProperty SourceProperty = DependencyProperty.Register("Source", typeof(ImageSource), typeof(Image));
        public ImageSource? Source { get => Get<ImageSource?>("Source"); set => Set("Source", value); }
        public Stretch Stretch { get => Get("Stretch", Stretch.Uniform); set => Set("Stretch", value); }
        public StretchDirection StretchDirection { get; set; }
        public event EventHandler<ExceptionRoutedEventArgs>? ImageFailed;
    }
    public class DatePicker : Control
    {
        public DateTime? SelectedDate
        {
            get => Get<DateTime?>("SelectedDate");
            set { var old = SelectedDate; Set("SelectedDate", value); if (old != value) SelectedDateChanged?.Invoke(this, new SelectionChangedEventArgs(old == null ? Array.Empty<object>() : new object[] { old }, value == null ? Array.Empty<object>() : new object[] { value })); }
        }
        public DateTime DisplayDate { get; set; } = DateTime.Today;
        public DateTime? DisplayDateStart { get; set; }
        public DateTime? DisplayDateEnd { get; set; }
        public DatePickerFormat SelectedDateFormat { get; set; }
        public string Text { get => SelectedDate?.ToString("yyyy-MM-dd") ?? ""; set { if (DateTime.TryParse(value, out var d)) SelectedDate = d; } }
        public bool IsTodayHighlighted { get; set; } = true;
        public event EventHandler<SelectionChangedEventArgs>? SelectedDateChanged;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "change") { var s = S(a, "value"); DateTime? v = DateTime.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.None, out var d) ? d : null; var old = SelectedDate; SetFromUi("SelectedDate", v); if (old != v) SelectedDateChanged?.Invoke(this, new SelectionChangedEventArgs(Array.Empty<object>(), v == null ? Array.Empty<object>() : new object[] { v })); return; }
            base.HandleDomEvent(name, a);
        }
    }
    public enum DatePickerFormat { Long, Short }
    public class Calendar : Control
    {
        public DateTime? SelectedDate { get => Get<DateTime?>("SelectedDate"); set { var old = SelectedDate; Set("SelectedDate", value); if (old != value) SelectedDatesChanged?.Invoke(this, new SelectionChangedEventArgs(Array.Empty<object>(), value == null ? Array.Empty<object>() : new object[] { value })); } }
        public DateTime DisplayDate { get; set; } = DateTime.Today;
        public event EventHandler<SelectionChangedEventArgs>? SelectedDatesChanged;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "change") { var s = S(a, "value"); DateTime? v = DateTime.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.None, out var d) ? d : null; SetFromUi("SelectedDate", v); SelectedDatesChanged?.Invoke(this, new SelectionChangedEventArgs(Array.Empty<object>(), v == null ? Array.Empty<object>() : new object[] { v })); return; }
            base.HandleDomEvent(name, a);
        }
    }
    public class MediaElement : FrameworkElement { public Uri? Source { get => Get<Uri?>("Source"); set => Set("Source", value); } public MediaState LoadedBehavior { get; set; } public void Play() { } public void Pause() { } public void Stop() { } public double Volume { get; set; } = 0.5; }
    public enum MediaState { Manual, Play, Close, Pause, Stop }
    public class WebBrowser : FrameworkElement { public Uri? Source { get; set; } public void Navigate(string url) { } public void Navigate(Uri url) { } public void NavigateToString(string html) { } }

    // ------------------------------------------------------------------ 항목 컨트롤
    public class ItemCollection : ObservableCollection<object> { }

    public class SelectionChangedEventArgs : RoutedEventArgs
    {
        public IList RemovedItems { get; }
        public IList AddedItems { get; }
        public SelectionChangedEventArgs(IList removed, IList added) { RemovedItems = removed; AddedItems = added; }
    }
    public delegate void SelectionChangedEventHandler(object sender, SelectionChangedEventArgs e);

    /// <summary>Items 또는 ItemsSource 의 항목마다 컨테이너 요소를 만들어 표시한다</summary>
    [Markup.ContentProperty("Items")]
    public class ItemsControl : Control
    {
        public static readonly DependencyProperty ItemsSourceProperty = DependencyProperty.Register("ItemsSource", typeof(IEnumerable), typeof(ItemsControl));
        public static readonly DependencyProperty ItemTemplateProperty = DependencyProperty.Register("ItemTemplate", typeof(DataTemplate), typeof(ItemsControl));
        public ItemCollection Items { get; } = new ItemCollection();
        private IEnumerable? _itemsSource;
        internal readonly List<UIElement> Containers = new List<UIElement>();
        internal readonly List<object?> ItemList = new List<object?>();
        private bool _syncing;

        public ItemsControl()
        {
            ItemContainerGenerator = new ItemContainerGenerator(this);
            Items.CollectionChanged += (s, e) => { if (_itemsSource == null) Regenerate(); };
        }
        public IEnumerable? ItemsSource
        {
            get => _itemsSource;
            set
            {
                if (_view is INotifyCollectionChanged oldN) oldN.CollectionChanged -= OnSourceChanged;
                _itemsSource = value;
                // 실제 WPF 처럼 컬렉션의 기본 뷰를 통해 표시 → GetDefaultView(list).Filter 가 바로 적용된다
                _view = value == null ? null : value is string ? value : (IEnumerable)CollectionViewSource.GetDefaultView(value);
                LocalSet.Add("ItemsSource");
                if (_view is INotifyCollectionChanged n) n.CollectionChanged += OnSourceChanged;
                Regenerate();
                RaiseLocalChanged("ItemsSource");
            }
        }
        public DataTemplate? ItemTemplate { get => Get<DataTemplate?>("ItemTemplate"); set { Values["ItemTemplate"] = value; Regenerate(); } }
        public string? DisplayMemberPath { get => Get<string?>("DisplayMemberPath"); set { Values["DisplayMemberPath"] = value; Regenerate(); } }
        public ItemsPanelTemplate? ItemsPanel { get => Get<ItemsPanelTemplate?>("ItemsPanel"); set { Values["ItemsPanel"] = value; UiTree.Prop(Id, "$panel", value?.PanelName); } }
        public Style? ItemContainerStyle { get => Get<Style?>("ItemContainerStyle"); set { Values["ItemContainerStyle"] = value; Regenerate(); } }
        public string? ItemStringFormat { get; set; }
        public bool HasItems => ItemList.Count > 0;
        public bool IsGrouping => false;
        public ItemContainerGenerator ItemContainerGenerator { get; }
        private IEnumerable? _view;
        internal IEnumerable Source => _view ?? (IEnumerable)Items;

        private void OnSourceChanged(object? s, NotifyCollectionChangedEventArgs e) => Regenerate();

        protected virtual UIElement CreateContainer() => new ContentPresenter();
        protected virtual bool IsContainer(object item) => item is UIElement;

        internal virtual void Regenerate()
        {
            if (_syncing) return;
            _syncing = true;
            try
            {
                Containers.Clear(); ItemList.Clear();
                foreach (var item in Source)
                {
                    ItemList.Add(item);
                    UIElement c;
                    if (item is UIElement el && IsContainer(el)) c = el;
                    else
                    {
                        c = CreateContainer();
                        // 템플릿 안의 StaticResource 가 창 · 목록의 Resources 를 찾을 수 있도록 부모부터 연결
                        if (c is FrameworkElement pf) pf.SetParent(this);
                        if (c is ContentControl cc)
                        {
                            cc.ContentTemplate = ItemTemplate;
                            var content = item;
                            if (DisplayMemberPath != null && item != null && cc is FrameworkElement dfe)
                            {
                                // 항목의 속성이 바뀌면 표시도 바뀌도록 바인딩으로 연결
                                dfe.DataContext = item;
                                BindingOperations.SetBinding(cc, ContentControl.ContentProperty, new Binding(DisplayMemberPath));
                                goto made;
                            }
                            else if (ItemStringFormat != null && item != null) content = string.Format(ItemStringFormat, item);
                            if (cc is FrameworkElement fe && !(content is UIElement)) fe.DataContext = item;
                            cc.Content = content;
                        }
                        made:
                        if (ItemContainerStyle != null && c is FrameworkElement f) f.Style = ItemContainerStyle;
                    }
                    if (c is FrameworkElement cf && cf.ParentElement != this) cf.SetParent(this);
                    Containers.Add(c);
                }
                var ids = new List<int>(); foreach (var c in Containers) ids.Add(c.Id);
                UiTree.Children(Id, ids);
                OnItemsRegenerated();
            }
            finally { _syncing = false; }
        }
        protected virtual void OnItemsRegenerated() { }
        internal override IEnumerable<FrameworkElement> LogicalChildren() { foreach (var c in Containers) if (c is FrameworkElement f) yield return f; }
        public UIElement? ContainerFromItem(object item) { var i = ItemList.IndexOf(item); return i >= 0 && i < Containers.Count ? Containers[i] : null; }
        public object? ItemFromContainer(UIElement c) { var i = Containers.IndexOf(c); return i >= 0 ? ItemList[i] : null; }
    }
    public class ItemContainerGenerator
    {
        private readonly ItemsControl _o;
        public ItemContainerGenerator(ItemsControl o) { _o = o; }
        public DependencyObject? ContainerFromItem(object item) => _o.ContainerFromItem(item);
        public DependencyObject? ContainerFromIndex(int i) => i >= 0 && i < _o.Containers.Count ? _o.Containers[i] : null;
        public object? ItemFromContainer(DependencyObject c) => c is UIElement e ? _o.ItemFromContainer(e) : null;
        public int IndexFromContainer(DependencyObject c) => c is UIElement e ? _o.Containers.IndexOf(e) : -1;
    }
    public class ItemsPanelTemplate { public string PanelName { get; set; } = "StackPanel"; public object? Content { get; set; } }

    public abstract class Selector : ItemsControl
    {
        public static readonly DependencyProperty SelectedItemProperty = DependencyProperty.Register("SelectedItem", typeof(object), typeof(Selector));
        public static readonly DependencyProperty SelectedIndexProperty = DependencyProperty.Register("SelectedIndex", typeof(int), typeof(Selector));
        public static readonly DependencyProperty SelectedValueProperty = DependencyProperty.Register("SelectedValue", typeof(object), typeof(Selector));
        private int _selIndex = -1;
        public int SelectedIndex
        {
            get => _selIndex;
            set { if (value == _selIndex) return; SetSelection(value, true); }
        }
        public object? SelectedItem
        {
            get => _selIndex >= 0 && _selIndex < ItemList.Count ? ItemList[_selIndex] : null;
            set { var i = value == null ? -1 : ItemList.IndexOf(value); if (i < 0 && value != null) { for (int k = 0; k < Containers.Count; k++) if (ReferenceEquals(Containers[k], value)) { i = k; break; } } SetSelection(i, true); }
        }
        public string? SelectedValuePath { get; set; }
        public object? SelectedValue
        {
            get => SelectedItem == null ? null : string.IsNullOrEmpty(SelectedValuePath) ? SelectedItem : BindingExpression.GetPathValue(SelectedItem, SelectedValuePath);
            set { for (int i = 0; i < ItemList.Count; i++) { var v = string.IsNullOrEmpty(SelectedValuePath) ? ItemList[i] : BindingExpression.GetPathValue(ItemList[i], SelectedValuePath); if (Equals(v, value) || (v != null && value != null && v.ToString() == value.ToString())) { SetSelection(i, true); return; } } SetSelection(-1, true); }
        }
        public bool IsSynchronizedWithCurrentItem { get; set; }
        public event SelectionChangedEventHandler? SelectionChanged;
        internal void SetSelection(int index, bool notifyRenderer)
        {
            if (index >= ItemList.Count) index = -1;
            var oldItem = SelectedItem; var oldIndex = _selIndex;
            _selIndex = index;
            if (notifyRenderer) UiTree.Prop(Id, "SelectedIndex", index);
            if (oldIndex == index) return;
            foreach (var c in Containers) if (c is ListBoxItem li) li.SetSelectedInternal(false);
            if (index >= 0 && index < Containers.Count && Containers[index] is ListBoxItem sel) sel.SetSelectedInternal(true);
            // 코드에서 바꾼 선택도 TwoWay 바인딩 원본에 반영 (실제 WPF 와 같다)
            if (Bindings.TryGetValue("SelectedItem", out var b1)) b1.UpdateSource(SelectedItem);
            if (Bindings.TryGetValue("SelectedIndex", out var b2)) b2.UpdateSource(index);
            if (Bindings.TryGetValue("SelectedValue", out var b3)) b3.UpdateSource(SelectedValue);
            RaiseLocalChanged("SelectedItem"); RaiseLocalChanged("SelectedIndex"); RaiseLocalChanged("SelectedValue");
            var e = new SelectionChangedEventArgs(oldItem == null ? Array.Empty<object>() : new[] { oldItem }, SelectedItem == null ? Array.Empty<object>() : new[] { SelectedItem }) { Source = this, OriginalSource = this, RoutedEvent = SelectionChangedEvent };
            SelectionChanged?.Invoke(this, e);
            UIElement.RaiseRouted(this, SelectionChangedEvent, e);
        }
        public static readonly RoutedEvent SelectionChangedEvent = new RoutedEvent("SelectionChanged", typeof(Selector));
        protected override void OnItemsRegenerated()
        {
            if (_selIndex >= ItemList.Count) { _selIndex = -1; UiTree.Prop(Id, "SelectedIndex", -1); }
            else if (_selIndex >= 0) { UiTree.Prop(Id, "SelectedIndex", _selIndex); if (Containers[_selIndex] is ListBoxItem li) li.SetSelectedInternal(true); }
            // 컨테이너 자신이 IsSelected 를 가진 경우 (XAML 의 <ListBoxItem IsSelected="True">) — 실제 WPF 처럼 SelectionChanged 도 발생
            if (_selIndex < 0)
                for (int i = 0; i < Containers.Count; i++) if (Containers[i] is ListBoxItem li && li.IsSelected) { SetSelection(i, true); break; }
        }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "select") { SetSelection((int)D(a, "index"), false); OnUiSelect(a); return; }
            base.HandleDomEvent(name, a);
        }
        internal virtual void OnUiSelect(JsonElement a) { }
        public static bool GetIsSelected(DependencyObject d) => (d as ListBoxItem)?.IsSelected ?? false;
        public static void SetIsSelected(DependencyObject d, bool v) { if (d is ListBoxItem li) li.IsSelected = v; }
    }

    public class ListBoxItem : ContentControl
    {
        public bool IsSelected { get => Get("IsSelected", false); set { Set("IsSelected", value); if (ParentElement is Selector s && value) s.SelectedItem = s.ItemFromContainer(this) ?? this; } }
        internal void SetSelectedInternal(bool v) { Values["IsSelected"] = v; }
        public event RoutedEventHandler? Selected;
        public event RoutedEventHandler? Unselected;
        internal void RaiseSel(bool v) { (v ? Selected : Unselected)?.Invoke(this, new RoutedEventArgs { Source = this }); }
        public ListBoxItem() { Values["Padding"] = new Thickness(4, 1, 4, 1); }
    }
    public class ListBox : Selector
    {
        public SelectionMode SelectionMode { get => Get("SelectionMode", SelectionMode.Single); set => Set("SelectionMode", value); }
        public IList SelectedItems { get; } = new List<object?>();
        protected override UIElement CreateContainer() => new ListBoxItem();
        protected override bool IsContainer(object item) => item is ListBoxItem;
        public void ScrollIntoView(object item) { var c = ContainerFromItem(item); if (c != null) UiTree.Op("call", c.Id, "scrollIntoView"); }
        public void SelectAll() { }
        public void UnselectAll() { SelectedIndex = -1; SelectedItems.Clear(); }
        internal override void OnUiSelect(JsonElement a)
        {
            SelectedItems.Clear();
            if (a.TryGetProperty("indices", out var arr) && arr.ValueKind == JsonValueKind.Array)
                foreach (var i in arr.EnumerateArray()) { var k = i.GetInt32(); if (k >= 0 && k < ItemList.Count) SelectedItems.Add(ItemList[k]); }
            else if (SelectedItem != null) SelectedItems.Add(SelectedItem);
        }
    }
    public class ComboBoxItem : ListBoxItem { }
    public class ComboBox : Selector
    {
        public bool IsEditable { get => Get("IsEditable", false); set => Set("IsEditable", value); }
        public bool IsDropDownOpen { get => Get("IsDropDownOpen", false); set => Set("IsDropDownOpen", value); }
        public bool IsReadOnly { get => Get("IsReadOnly", false); set => Set("IsReadOnly", value); }
        public bool StaysOpenOnEdit { get; set; }
        public double MaxDropDownHeight { get; set; } = 300;
        public string Text { get => Get("Text", SelectedItem?.ToString() ?? ""); set => Set("Text", value ?? ""); }
        protected override UIElement CreateContainer() => new ComboBoxItem();
        protected override bool IsContainer(object item) => item is ComboBoxItem;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "input") { SetFromUi("Text", S(a, "value")); return; }
            base.HandleDomEvent(name, a);
        }
        internal override void OnUiSelect(JsonElement a) { Values["Text"] = SelectedItem?.ToString() ?? ""; }
    }
    public class ListViewItem : ListBoxItem { }
    public class ViewBase { }
    [Markup.ContentProperty("Columns")]
    public class GridView : ViewBase
    {
        public GridViewColumnCollection Columns { get; } = new GridViewColumnCollection();
        public bool AllowsColumnReorder { get; set; }
        public string? ColumnHeaderToolTip { get; set; }
    }
    public class GridViewColumnCollection : List<GridViewColumn> { }
    public class GridViewColumn
    {
        public object? Header { get; set; }
        public double Width { get; set; } = double.NaN;
        public Binding? DisplayMemberBinding { get; set; }
        public DataTemplate? CellTemplate { get; set; }
        public string? HeaderStringFormat { get; set; }
    }
    public class ListView : ListBox
    {
        public ViewBase? View { get => Get<ViewBase?>("View"); set { Values["View"] = value; Regenerate(); } }
        protected override UIElement CreateContainer() => new ListViewItem();
        protected override bool IsContainer(object item) => item is ListViewItem;
        internal override void Regenerate()
        {
            base.Regenerate();
            if (View is GridView gv)
            {
                var heads = new List<object?>(); var widths = new List<object?>();
                foreach (var c in gv.Columns) { heads.Add(c.Header?.ToString()); widths.Add(double.IsNaN(c.Width) ? null : (object)c.Width); }
                var rows = new List<List<string?>>();
                foreach (var item in ItemList)
                {
                    var row = new List<string?>();
                    foreach (var c in gv.Columns)
                        row.Add(c.DisplayMemberBinding != null ? BindingExpression.Format(c.DisplayMemberBinding, item) : item?.ToString());
                    rows.Add(row);
                }
                UiTree.Prop(Id, "$grid", new Dictionary<string, object?> { ["heads"] = heads, ["widths"] = widths, ["rows"] = rows });
                WatchItems();
            }
        }
        private readonly List<INotifyPropertyChanged> _watched = new List<INotifyPropertyChanged>();
        private void WatchItems()
        {
            foreach (var w in _watched) w.PropertyChanged -= ItemChanged;
            _watched.Clear();
            foreach (var it in ItemList) if (it is INotifyPropertyChanged n) { n.PropertyChanged += ItemChanged; _watched.Add(n); }
        }
        private void ItemChanged(object? s, PropertyChangedEventArgs e) => Regenerate();
    }

    public class TabItem : HeaderedContentControl
    {
        public bool IsSelected { get => Get("IsSelected", false); set { Set("IsSelected", value); if (value && ParentElement is TabControl tc) tc.SelectedItem = tc.ItemFromContainer(this) ?? this; } }
    }
    public class TabControl : Selector
    {
        public Dock TabStripPlacement { get => Get("TabStripPlacement", Dock.Top); set => Set("TabStripPlacement", value); }
        public DataTemplate? ContentTemplate { get; set; }
        public object? SelectedContent => SelectedItem is TabItem t ? t.Content : SelectedItem;
        protected override UIElement CreateContainer() => new TabItem();
        protected override bool IsContainer(object item) => item is TabItem;
        protected override void OnItemsRegenerated()
        {
            base.OnItemsRegenerated();
            if (SelectedIndex < 0 && ItemList.Count > 0) SetSelection(0, true);
        }
    }

    // ------------------------------------------------------------------ 메뉴
    [Markup.ContentProperty("Items")]
    public class MenuItem : HeaderedItemsControl
    {
        private ICommand? _command;
        public static readonly RoutedEvent ClickEvent = new RoutedEvent("Click", typeof(MenuItem));
        public ICommand? Command
        {
            get => _command;
            set
            {
                if (_command != null) _command.CanExecuteChanged -= OnCan;
                _command = value;
                if (_command == null) return;
                _command.CanExecuteChanged += OnCan;
                OnCan(null, EventArgs.Empty);
                // 실제 WPF 처럼 명령의 이름 · 단축키를 메뉴에 자동으로 표시
                if (_command is RoutedUICommand ui && Header == null && ui.Text.Length > 0) Header = ui.Text;
                if (_command is RoutedCommand rc && InputGestureText == null && rc.InputGestures.Count > 0 && rc.InputGestures[0] is KeyGesture kg) Values["$autoGesture"] = kg.DisplayString;
                if (Values.TryGetValue("$autoGesture", out var g) && g is string gs && InputGestureText == null) UiTree.Prop(Id, "InputGestureText", gs);
            }
        }
        public object? CommandParameter { get; set; }
        public string? InputGestureText { get => Get<string?>("InputGestureText"); set => Set("InputGestureText", value); }
        public bool IsCheckable { get => Get("IsCheckable", false); set => Set("IsCheckable", value); }
        public bool IsChecked { get => Get("IsChecked", false); set { var o = IsChecked; Set("IsChecked", value); if (o != value) (value ? Checked : Unchecked)?.Invoke(this, new RoutedEventArgs { Source = this }); } }
        public object? Icon { get => GetObj("Icon"); set => Set("Icon", value is UIElement ? null : value); }
        public bool StaysOpenOnClick { get; set; }
        public bool IsSubmenuOpen { get; set; }
        public event RoutedEventHandler? Click;
        public event RoutedEventHandler? Checked;
        public event RoutedEventHandler? Unchecked;
        public event RoutedEventHandler? SubmenuOpened;
        private void OnCan(object? s, EventArgs e) { if (_command != null) { if (_command is RoutedCommand rc) rc.Target = this; SetStyleValue("IsEnabled", _command.CanExecute(CommandParameter)); } }
        protected override UIElement CreateContainer() => new MenuItem();
        protected override bool IsContainer(object item) => item is MenuItem || item is Separator;
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "click")
            {
                if (IsCheckable) { var v = !IsChecked; SetFromUi("IsChecked", v); (v ? Checked : Unchecked)?.Invoke(this, new RoutedEventArgs { Source = this }); }
                var ce = new RoutedEventArgs(ClickEvent, this);
                Click?.Invoke(this, ce);
                UIElement.RaiseRouted(this, ClickEvent, ce);   // <Menu MenuItem.Click="…"> 처럼 부모에서 한꺼번에 처리
                if (_command != null) { if (_command is RoutedCommand rc) { if (rc.CanExecute(CommandParameter, this)) rc.Execute(CommandParameter, this); } else if (_command.CanExecute(CommandParameter)) _command.Execute(CommandParameter); }
                return;
            }
            base.HandleDomEvent(name, a);
        }
    }
    [Markup.ContentProperty("Items")]
    public class HeaderedItemsControl : ItemsControl
    {
        private object? _header;
        public object? Header { get => _header; set { _header = value; UiTree.Prop(Id, "Header", value is UIElement el ? Conv.ToWire(el) : value?.ToString()); } }
        public DataTemplate? HeaderTemplate { get; set; }
    }
    public class MenuBase : ItemsControl
    {
        protected override UIElement CreateContainer() => new MenuItem();
        protected override bool IsContainer(object item) => item is MenuItem || item is Separator;
    }
    public class Menu : MenuBase { public bool IsMainMenu { get; set; } = true; }
    public class ContextMenu : MenuBase
    {
        internal FrameworkElement? Owner;
        public bool IsOpen { get => Get("IsOpen", false); set => Set("IsOpen", value); }
        public UIElement? PlacementTarget { get; set; }
        public PlacementMode Placement { get; set; }
        public event RoutedEventHandler? Opened;
        public event RoutedEventHandler? Closed;
    }
    public class ToolBar : ItemsControl { public int Band { get; set; } public int BandIndex { get; set; } protected override UIElement CreateContainer() => new ContentPresenter(); protected override bool IsContainer(object item) => item is UIElement; }
    [Markup.ContentProperty("ToolBars")]
    public class ToolBarTray : FrameworkElement
    {
        public UIElementCollection ToolBars { get; }
        public Orientation Orientation { get => Get("Orientation", Orientation.Horizontal); set => Set("Orientation", value); }
        public ToolBarTray() { ToolBars = new UIElementCollection(this); }
        internal override IEnumerable<FrameworkElement> LogicalChildren() { foreach (var t in ToolBars) if (t is FrameworkElement f) yield return f; }
    }
    public class TreeViewItem : HeaderedItemsControl
    {
        public bool IsExpanded { get => Get("IsExpanded", false); set => Set("IsExpanded", value); }
        public bool IsSelected { get => Get("IsSelected", false); set { Set("IsSelected", value); if (value) FindTree()?.SelectFromUi(this); } }
        public event RoutedEventHandler? Selected;
        public event RoutedEventHandler? Expanded;
        public event RoutedEventHandler? Collapsed;
        protected override UIElement CreateContainer() => new TreeViewItem();
        protected override bool IsContainer(object item) => item is TreeViewItem;
        internal TreeView? FindTree() { for (FrameworkElement? e = ParentElement; e != null; e = e.ParentElement) if (e is TreeView t) return t; return null; }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "toggle") { var v = B(a, "checked"); SetFromUi("IsExpanded", v); (v ? Expanded : Collapsed)?.Invoke(this, new RoutedEventArgs { Source = this }); return; }
            if (name == "select") { FindTree()?.SelectFromUi(this); Selected?.Invoke(this, new RoutedEventArgs { Source = this }); return; }
            base.HandleDomEvent(name, a);
        }
    }
    public class TreeView : ItemsControl
    {
        private TreeViewItem? _selected;
        public object? SelectedItem => _selected == null ? null : (_selected.ParentElement as ItemsControl)?.ItemFromContainer(_selected) ?? _selected;
        public event RoutedPropertyChangedEventHandler<object?>? SelectedItemChanged;
        protected override UIElement CreateContainer() => new TreeViewItem();
        protected override bool IsContainer(object item) => item is TreeViewItem;
        internal void SelectFromUi(TreeViewItem item)
        {
            var old = SelectedItem;
            if (_selected != null && !ReferenceEquals(_selected, item)) _selected.SetFromUi("IsSelected", false);
            _selected = item;
            item.SetFromUi("IsSelected", true);
            UiTree.Prop(Id, "$selected", item.Id);
            SelectedItemChanged?.Invoke(this, new RoutedPropertyChangedEventArgs<object?>(old, SelectedItem) { Source = this });
        }
    }

    // ------------------------------------------------------------------ DataGrid (읽기 · 선택 위주)
    public abstract class DataGridColumn
    {
        public object? Header { get; set; }
        public DataGridLength Width { get; set; } = DataGridLength.Auto;
        public bool IsReadOnly { get; set; }
        public int DisplayIndex { get; set; }
        public Visibility Visibility { get; set; }
        public bool CanUserSort { get; set; } = true;
        public bool CanUserResize { get; set; } = true;
        public string? SortMemberPath { get; set; }
        public double MinWidth { get; set; }
        public double MaxWidth { get; set; } = double.PositiveInfinity;
        internal abstract string? Cell(object? item);
        internal virtual string Kind => "text";
    }
    public class DataGridBoundColumn : DataGridColumn
    {
        public Binding? Binding { get; set; }
        internal override string? Cell(object? item) => Binding == null ? item?.ToString() : BindingExpression.Format(Binding, item);
    }
    public class DataGridTextColumn : DataGridBoundColumn { public double FontSize { get; set; } public FontWeight FontWeight { get; set; } public Brush? Foreground { get; set; } }
    public class DataGridCheckBoxColumn : DataGridBoundColumn { internal override string Kind => "check"; }
    public class DataGridComboBoxColumn : DataGridBoundColumn { public IEnumerable? ItemsSource { get; set; } public string? DisplayMemberPath { get; set; } public string? SelectedValuePath { get; set; } public Binding? SelectedItemBinding { get; set; } internal override string? Cell(object? item) => (SelectedItemBinding != null ? BindingExpression.Format(SelectedItemBinding, item) : null) ?? base.Cell(item); }
    public class DataGridHyperlinkColumn : DataGridBoundColumn { }
    public class DataGridTemplateColumn : DataGridColumn { public DataTemplate? CellTemplate { get; set; } public DataTemplate? CellEditingTemplate { get; set; } internal override string? Cell(object? item) => item?.ToString(); }
    public struct DataGridLength
    {
        public double Value; public DataGridLengthUnitType UnitType;
        public DataGridLength(double v) { Value = v; UnitType = DataGridLengthUnitType.Pixel; }
        public DataGridLength(double v, DataGridLengthUnitType t) { Value = v; UnitType = t; }
        public static DataGridLength Auto => new DataGridLength(1, DataGridLengthUnitType.Auto);
        public static DataGridLength SizeToCells => new DataGridLength(1, DataGridLengthUnitType.SizeToCells);
        public static DataGridLength SizeToHeader => new DataGridLength(1, DataGridLengthUnitType.SizeToHeader);
        public static implicit operator DataGridLength(double v) => new DataGridLength(v);
        public static DataGridLength Parse(string s) { s = s.Trim(); if (s.Equals("Auto", StringComparison.OrdinalIgnoreCase)) return Auto; if (s.Equals("SizeToCells", StringComparison.OrdinalIgnoreCase)) return SizeToCells; if (s.Equals("SizeToHeader", StringComparison.OrdinalIgnoreCase)) return SizeToHeader; if (s.EndsWith("*")) { var v = s.Substring(0, s.Length - 1); return new DataGridLength(v.Length == 0 ? 1 : double.Parse(v, CultureInfo.InvariantCulture), DataGridLengthUnitType.Star); } return new DataGridLength(double.Parse(s, CultureInfo.InvariantCulture)); }
        public override string ToString() => UnitType == DataGridLengthUnitType.Auto ? "Auto" : UnitType == DataGridLengthUnitType.Star ? Value + "*" : Value.ToString(CultureInfo.InvariantCulture);
    }
    public class DataGridColumnCollection : ObservableCollection<DataGridColumn> { }
    public class DataGridRow : ContentControl { }
    public class DataGridCell : ContentControl { }
    public class DataGridCellInfo { public object? Item { get; set; } public DataGridColumn? Column { get; set; } }
    public class DataGridCellEditEndingEventArgs : EventArgs { public DataGridRow? Row { get; set; } public DataGridColumn? Column { get; set; } public FrameworkElement? EditingElement { get; set; } public bool Cancel { get; set; } }
    public class DataGridRowEventArgs : EventArgs { public DataGridRow? Row { get; set; } }
    public class AddingNewItemEventArgs : EventArgs { public object? NewItem { get; set; } }
    public class InitializingNewItemEventArgs : EventArgs { public object? NewItem { get; set; } }
    public class DataGrid : Selector
    {
        public DataGridColumnCollection Columns { get; } = new DataGridColumnCollection();
        public bool AutoGenerateColumns { get => Get("AutoGenerateColumns", true); set { Values["AutoGenerateColumns"] = value; Regenerate(); } }
        public bool IsReadOnly { get => Get("IsReadOnly", false); set => Set("IsReadOnly", value); }
        public bool CanUserAddRows { get => Get("CanUserAddRows", true); set => Set("CanUserAddRows", value); }
        public bool CanUserDeleteRows { get; set; } = true;
        public bool CanUserSortColumns { get; set; } = true;
        public bool CanUserResizeColumns { get; set; } = true;
        public bool CanUserReorderColumns { get; set; } = true;
        public DataGridHeadersVisibility HeadersVisibility { get => Get("HeadersVisibility", DataGridHeadersVisibility.Column); set => Set("HeadersVisibility", value); }
        public DataGridSelectionMode SelectionMode { get => Get("SelectionMode", DataGridSelectionMode.Extended); set => Set("SelectionMode", value); }
        public DataGridGridLinesVisibility GridLinesVisibility { get => Get("GridLinesVisibility", DataGridGridLinesVisibility.All); set => Set("GridLinesVisibility", value); }
        public Brush? AlternatingRowBackground { get => Get<Brush?>("AlternatingRowBackground"); set => Set("AlternatingRowBackground", value); }
        public Brush? RowBackground { get => Get<Brush?>("RowBackground"); set => Set("RowBackground", value); }
        public Brush? HorizontalGridLinesBrush { get; set; }
        public Brush? VerticalGridLinesBrush { get; set; }
        public double RowHeight { get => Get("RowHeight", double.NaN); set => Set("RowHeight", value); }
        public double ColumnHeaderHeight { get; set; } = double.NaN;
        public DataGridLength ColumnWidth { get; set; } = DataGridLength.SizeToHeader;
        public Style? ColumnHeaderStyle { get; set; }
        public Style? RowStyle { get; set; }
        public Style? CellStyle { get; set; }
        public DataGridCellInfo CurrentCell { get; set; } = new DataGridCellInfo();
        public IList SelectedItems { get; } = new List<object?>();
        public event EventHandler<DataGridCellEditEndingEventArgs>? CellEditEnding;
        public event EventHandler<DataGridRowEventArgs>? LoadingRow;
        public event EventHandler<AddingNewItemEventArgs>? AddingNewItem;
        public event EventHandler<InitializingNewItemEventArgs>? InitializingNewItem;
        public event EventHandler<EventArgs>? AutoGeneratingColumn;
        public DataGrid() { Columns.CollectionChanged += (s, e) => Regenerate(); }
        protected override UIElement CreateContainer() => new DataGridRow();
        protected override bool IsContainer(object item) => false;
        private readonly List<INotifyPropertyChanged> _watched = new List<INotifyPropertyChanged>();
        internal override void Regenerate()
        {
            ItemList.Clear(); Containers.Clear();
            foreach (var it in Source) ItemList.Add(it);
            var cols = new List<DataGridColumn>(Columns);
            if (AutoGenerateColumns && ItemList.Count > 0 && ItemList[0] != null)
                foreach (var p in ItemList[0]!.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
                    if (p.CanRead && p.GetIndexParameters().Length == 0)
                        cols.Add(new DataGridTextColumn { Header = p.Name, Binding = new Binding(p.Name), IsReadOnly = !p.CanWrite });
            var heads = new List<object?>(); var kinds = new List<string>(); var widths = new List<string>();
            foreach (var c in cols) { heads.Add(c.Header?.ToString()); kinds.Add(c.Kind); widths.Add(c.Width.ToString()); }
            var rows = new List<List<string?>>();
            foreach (var it in ItemList) { var r = new List<string?>(); foreach (var c in cols) r.Add(c.Cell(it)); rows.Add(r); }
            UiTree.Prop(Id, "$grid", new Dictionary<string, object?> { ["heads"] = heads, ["kinds"] = kinds, ["widths"] = widths, ["rows"] = rows });
            UiTree.Children(Id, new List<int>());
            foreach (var w in _watched) w.PropertyChanged -= ItemChanged;
            _watched.Clear();
            foreach (var it in ItemList) if (it is INotifyPropertyChanged n) { n.PropertyChanged += ItemChanged; _watched.Add(n); }
            OnItemsRegenerated();
        }
        private void ItemChanged(object? s, PropertyChangedEventArgs e) => Regenerate();
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            if (name == "edit")
            {
                // 셀 편집: 행 · 열 인덱스와 새 값 → 항목의 속성에 반영
                var ri = (int)D(a, "row"); var ci = (int)D(a, "col"); var v = S(a, "value");
                var cols = new List<DataGridColumn>(Columns);
                if (AutoGenerateColumns && ItemList.Count > 0 && ItemList[0] != null)
                    foreach (var p in ItemList[0]!.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)) if (p.CanRead && p.GetIndexParameters().Length == 0) cols.Add(new DataGridTextColumn { Header = p.Name, Binding = new Binding(p.Name) });
                if (ri >= 0 && ri < ItemList.Count && ci >= 0 && ci < cols.Count && cols[ci] is DataGridBoundColumn bc && bc.Binding != null && ItemList[ri] != null)
                {
                    var target = ItemList[ri]!;
                    BindingExpression.SetPathValue(target, bc.Binding.Path, v);
                    if (!(target is INotifyPropertyChanged)) Regenerate();
                }
                return;
            }
            base.HandleDomEvent(name, a);
        }
    }
    public class StatusBar : ItemsControl { protected override UIElement CreateContainer() => new StatusBarItem(); protected override bool IsContainer(object item) => item is StatusBarItem || item is Separator; }
    public class StatusBarItem : ContentControl { }
    public class Frame : ContentControl { public Uri? Source { get; set; } public void Navigate(object content) { Content = content; } public bool CanGoBack => false; public void GoBack() { } }
    public class Popup : FrameworkElement { public UIElement? Child { get; set; } public bool IsOpen { get; set; } public UIElement? PlacementTarget { get; set; } public PlacementMode Placement { get; set; } public bool StaysOpen { get; set; } = true; }
}

namespace System.Windows.Documents
{
    public abstract class Inline { public Media.Brush? Foreground { get; set; } public double FontSize { get; set; } = double.NaN; public FontWeight FontWeight { get; set; } = FontWeights.Normal; public FontStyle FontStyle { get; set; } = FontStyles.Normal; public TextDecorationCollection? TextDecorations { get; set; } internal abstract object Wire(); }
    [Markup.ContentProperty("Text")]
    public class Run : Inline { public string Text { get; set; } = ""; public Run() { } public Run(string text) { Text = text; } internal override object Wire() => new Dictionary<string, object?> { ["t"] = "run", ["text"] = Text, ["fg"] = Foreground?.ToCss(), ["fw"] = FontWeight.Weight, ["fs"] = double.IsNaN(FontSize) ? null : (object)FontSize, ["it"] = FontStyle.Style == 1, ["td"] = TextDecorations?.ToString() }; }
    public class LineBreak : Inline { internal override object Wire() => new Dictionary<string, object?> { ["t"] = "br" }; }
    [Markup.ContentProperty("Inlines")]
    public class Span : Inline
    {
        public List<Inline> Inlines { get; } = new List<Inline>();
        public Span() { }
        public Span(Inline i) { Inlines.Add(i); }
        internal override object Wire() { var l = new List<object>(); foreach (var i in Inlines) l.Add(i.Wire()); return new Dictionary<string, object?> { ["t"] = GetType().Name.ToLowerInvariant(), ["inlines"] = l, ["fg"] = Foreground?.ToCss() }; }
    }
    public class Bold : Span { public Bold() { } public Bold(Inline i) : base(i) { } }
    public class Italic : Span { public Italic() { } public Italic(Inline i) : base(i) { } }
    public class Underline : Span { public Underline() { } public Underline(Inline i) : base(i) { } }
    public class Hyperlink : Span { public Uri? NavigateUri { get; set; } public event RoutedEventHandler? Click; public event RoutedEventHandler? RequestNavigate; public Hyperlink() { } public Hyperlink(Inline i) : base(i) { } }
    public class InlineCollection : IEnumerable<Inline>
    {
        private readonly List<Inline> _l = new List<Inline>();
        private readonly Controls.TextBlock _o;
        public InlineCollection(Controls.TextBlock o) { _o = o; }
        public void Add(Inline i) { _l.Add(i); _o.SyncInlines(); }
        public void Add(string s) { _l.Add(new Run(s)); _o.SyncInlines(); }
        public void Clear() { _l.Clear(); _o.SyncInlines(); }
        public int Count => _l.Count;
        internal List<object> ToWire() { var r = new List<object>(); foreach (var i in _l) r.Add(i.Wire()); return r; }
        public IEnumerator<Inline> GetEnumerator() => _l.GetEnumerator();
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => _l.GetEnumerator();
    }
    public class Block { }
    [Markup.ContentProperty("Inlines")]
    public class Paragraph : Block { public List<Inline> Inlines { get; } = new List<Inline>(); public Paragraph() { } public Paragraph(Inline i) { Inlines.Add(i); } }
    [Markup.ContentProperty("Blocks")]
    public class FlowDocument { public List<Block> Blocks { get; } = new List<Block>(); public FlowDocument() { } public FlowDocument(Block b) { Blocks.Add(b); } }
    public class TextRange { public string Text { get; set; } = ""; public TextRange(object a, object b) { } }
}
