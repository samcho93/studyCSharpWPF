using System;
using System.Collections;
using System.Collections.Generic;
using System.Windows.Media;
using WpfShim;

namespace System.Windows.Controls
{
    /// <summary>패널의 자식 목록: 바뀔 때마다 렌더러에 순서를 알린다</summary>
    public class UIElementCollection : IList<UIElement>, IList
    {
        private readonly List<UIElement> _list = new List<UIElement>();
        private readonly FrameworkElement _owner;
        public UIElementCollection(FrameworkElement owner) { _owner = owner; }
        public UIElementCollection(UIElement visualParent, FrameworkElement logicalParent) { _owner = logicalParent; }
        private void Sync()
        {
            var ids = new List<int>(_list.Count);
            foreach (var e in _list) ids.Add(e.Id);
            UiTree.Children(_owner.Id, ids);
        }
        private void Attach(UIElement e) { if (e is FrameworkElement fe) fe.SetParent(_owner); }
        public UIElement this[int index] { get => _list[index]; set { _list[index] = value; Attach(value); Sync(); } }
        public int Count => _list.Count;
        public bool IsReadOnly => false;
        public int Add(UIElement e) { _list.Add(e); Attach(e); Sync(); return _list.Count - 1; }
        void ICollection<UIElement>.Add(UIElement e) => Add(e);
        public void Clear() { _list.Clear(); Sync(); }
        public bool Contains(UIElement e) => _list.Contains(e);
        public void CopyTo(UIElement[] array, int i) => _list.CopyTo(array, i);
        public IEnumerator<UIElement> GetEnumerator() => _list.GetEnumerator();
        public int IndexOf(UIElement e) => _list.IndexOf(e);
        public void Insert(int index, UIElement e) { _list.Insert(index, e); Attach(e); Sync(); }
        public bool Remove(UIElement e) { var r = _list.Remove(e); if (r) Sync(); return r; }
        public void RemoveAt(int index) { _list.RemoveAt(index); Sync(); }
        public void RemoveRange(int index, int count) { _list.RemoveRange(index, count); Sync(); }
        IEnumerator IEnumerable.GetEnumerator() => _list.GetEnumerator();
        // IList
        object? IList.this[int index] { get => _list[index]; set => this[index] = (UIElement)value!; }
        bool IList.IsFixedSize => false;
        bool ICollection.IsSynchronized => false;
        object ICollection.SyncRoot => this;
        int IList.Add(object? value) => Add((UIElement)value!);
        bool IList.Contains(object? value) => value is UIElement e && Contains(e);
        int IList.IndexOf(object? value) => value is UIElement e ? IndexOf(e) : -1;
        void IList.Insert(int index, object? value) => Insert(index, (UIElement)value!);
        void IList.Remove(object? value) { if (value is UIElement e) Remove(e); }
        void ICollection.CopyTo(Array array, int index) { foreach (var e in _list) array.SetValue(e, index++); }
    }

    [Markup.ContentProperty("Children")]
    public abstract class Panel : FrameworkElement
    {
        public static readonly DependencyProperty BackgroundProperty = DependencyProperty.Register("Background", typeof(Brush), typeof(Panel));
        public UIElementCollection Children { get; }
        public Brush? Background { get => Get<Brush?>("Background"); set => Set("Background", value); }
        public bool IsItemsHost { get; set; }
        protected Panel() { Children = new UIElementCollection(this); }
        internal override IEnumerable<FrameworkElement> LogicalChildren() { foreach (var c in Children) if (c is FrameworkElement f) yield return f; }
        public static int GetZIndex(UIElement e) => e.GetAttached("Panel.ZIndex") is int i ? i : 0;
        public static void SetZIndex(UIElement e, int v) => e.SetAttached("Panel.ZIndex", v);
        public static readonly DependencyProperty ZIndexProperty = DependencyProperty.RegisterAttached("ZIndex", typeof(int), typeof(Panel));
    }

    public class RowDefinition : DependencyObject
    {
        internal Grid? Owner;
        private GridLength _h = new GridLength(1, GridUnitType.Star);
        private double _min, _max = double.PositiveInfinity;
        public GridLength Height { get => _h; set { _h = value; Owner?.SyncDefs(); } }
        public double MinHeight { get => _min; set { _min = value; Owner?.SyncDefs(); } }
        public double MaxHeight { get => _max; set { _max = value; Owner?.SyncDefs(); } }
        public double ActualHeight => 0;
        public string? Name { get; set; }
        internal string Css() => Grid.Track(_h, _min, _max);
    }
    public class ColumnDefinition : DependencyObject
    {
        internal Grid? Owner;
        private GridLength _w = new GridLength(1, GridUnitType.Star);
        private double _min, _max = double.PositiveInfinity;
        public GridLength Width { get => _w; set { _w = value; Owner?.SyncDefs(); } }
        public double MinWidth { get => _min; set { _min = value; Owner?.SyncDefs(); } }
        public double MaxWidth { get => _max; set { _max = value; Owner?.SyncDefs(); } }
        public double ActualWidth => 0;
        public string? Name { get; set; }
        internal string Css() => Grid.Track(_w, _min, _max);
    }
    public class RowDefinitionCollection : System.Collections.ObjectModel.Collection<RowDefinition>
    {
        internal Grid? Owner;
        protected override void InsertItem(int i, RowDefinition r) { base.InsertItem(i, r); r.Owner = Owner; Owner?.SyncDefs(); }
        protected override void SetItem(int i, RowDefinition r) { base.SetItem(i, r); r.Owner = Owner; Owner?.SyncDefs(); }
        protected override void RemoveItem(int i) { base.RemoveItem(i); Owner?.SyncDefs(); }
        protected override void ClearItems() { base.ClearItems(); Owner?.SyncDefs(); }
    }
    public class ColumnDefinitionCollection : System.Collections.ObjectModel.Collection<ColumnDefinition>
    {
        internal Grid? Owner;
        protected override void InsertItem(int i, ColumnDefinition c) { base.InsertItem(i, c); c.Owner = Owner; Owner?.SyncDefs(); }
        protected override void SetItem(int i, ColumnDefinition c) { base.SetItem(i, c); c.Owner = Owner; Owner?.SyncDefs(); }
        protected override void RemoveItem(int i) { base.RemoveItem(i); Owner?.SyncDefs(); }
        protected override void ClearItems() { base.ClearItems(); Owner?.SyncDefs(); }
    }

    public class Grid : Panel
    {
        public RowDefinitionCollection RowDefinitions { get; }
        public ColumnDefinitionCollection ColumnDefinitions { get; }
        public bool ShowGridLines { get => Get("ShowGridLines", false); set => Set("ShowGridLines", value); }
        public Grid()
        {
            RowDefinitions = new RowDefinitionCollection { Owner = this };
            ColumnDefinitions = new ColumnDefinitionCollection { Owner = this };
        }
        internal static string Track(GridLength g, double min, double max)
        {
            string v = g.IsAuto ? "auto" : g.IsStar ? UiTree.F(g.Value) + "fr" : UiTree.F(g.Value) + "px";
            if (min > 0 || !double.IsPositiveInfinity(max))
                v = "minmax(" + (min > 0 ? UiTree.F(min) + "px" : g.IsAuto ? "auto" : "0") + "," + (double.IsPositiveInfinity(max) ? (g.IsStar ? v : g.IsAuto ? "auto" : v) : UiTree.F(max) + "px") + ")";
            return v;
        }
        internal void SyncDefs()
        {
            var rows = new List<string>(); foreach (var r in RowDefinitions) rows.Add(r.Css());
            var cols = new List<string>(); foreach (var c in ColumnDefinitions) cols.Add(c.Css());
            UiTree.Prop(Id, "$rows", string.Join(" ", rows));
            UiTree.Prop(Id, "$cols", string.Join(" ", cols));
        }
        public static readonly DependencyProperty RowProperty = DependencyProperty.RegisterAttached("Row", typeof(int), typeof(Grid));
        public static readonly DependencyProperty ColumnProperty = DependencyProperty.RegisterAttached("Column", typeof(int), typeof(Grid));
        public static readonly DependencyProperty RowSpanProperty = DependencyProperty.RegisterAttached("RowSpan", typeof(int), typeof(Grid));
        public static readonly DependencyProperty ColumnSpanProperty = DependencyProperty.RegisterAttached("ColumnSpan", typeof(int), typeof(Grid));
        public static int GetRow(UIElement e) => e.GetAttached("Grid.Row") is int i ? i : 0;
        public static void SetRow(UIElement e, int v) => e.SetAttached("Grid.Row", v);
        public static int GetColumn(UIElement e) => e.GetAttached("Grid.Column") is int i ? i : 0;
        public static void SetColumn(UIElement e, int v) => e.SetAttached("Grid.Column", v);
        public static int GetRowSpan(UIElement e) => e.GetAttached("Grid.RowSpan") is int i ? i : 1;
        public static void SetRowSpan(UIElement e, int v) => e.SetAttached("Grid.RowSpan", v);
        public static int GetColumnSpan(UIElement e) => e.GetAttached("Grid.ColumnSpan") is int i ? i : 1;
        public static void SetColumnSpan(UIElement e, int v) => e.SetAttached("Grid.ColumnSpan", v);
    }

    public enum Orientation { Horizontal, Vertical }
    public class StackPanel : Panel
    {
        public Orientation Orientation { get => Get("Orientation", Orientation.Vertical); set => Set("Orientation", value); }
        public bool CanVerticallyScroll { get; set; }
        public bool CanHorizontallyScroll { get; set; }
    }
    public class WrapPanel : Panel
    {
        public Orientation Orientation { get => Get("Orientation", Orientation.Horizontal); set => Set("Orientation", value); }
        public double ItemWidth { get => Get("ItemWidth", double.NaN); set => Set("ItemWidth", value); }
        public double ItemHeight { get => Get("ItemHeight", double.NaN); set => Set("ItemHeight", value); }
    }
    public enum Dock { Left, Top, Right, Bottom }
    public class DockPanel : Panel
    {
        public bool LastChildFill { get => Get("LastChildFill", true); set => Set("LastChildFill", value); }
        public static readonly DependencyProperty DockProperty = DependencyProperty.RegisterAttached("Dock", typeof(Dock), typeof(DockPanel));
        public static Dock GetDock(UIElement e) => e.GetAttached("DockPanel.Dock") is Dock d ? d : Dock.Left;
        public static void SetDock(UIElement e, Dock v) => e.SetAttached("DockPanel.Dock", v);
    }
    public class Canvas : Panel
    {
        public static readonly DependencyProperty LeftProperty = DependencyProperty.RegisterAttached("Left", typeof(double), typeof(Canvas));
        public static readonly DependencyProperty TopProperty = DependencyProperty.RegisterAttached("Top", typeof(double), typeof(Canvas));
        public static readonly DependencyProperty RightProperty = DependencyProperty.RegisterAttached("Right", typeof(double), typeof(Canvas));
        public static readonly DependencyProperty BottomProperty = DependencyProperty.RegisterAttached("Bottom", typeof(double), typeof(Canvas));
        public static double GetLeft(UIElement e) => e.GetAttached("Canvas.Left") is double d ? d : double.NaN;
        public static void SetLeft(UIElement e, double v) => e.SetAttached("Canvas.Left", v);
        public static double GetTop(UIElement e) => e.GetAttached("Canvas.Top") is double d ? d : double.NaN;
        public static void SetTop(UIElement e, double v) => e.SetAttached("Canvas.Top", v);
        public static double GetRight(UIElement e) => e.GetAttached("Canvas.Right") is double d ? d : double.NaN;
        public static void SetRight(UIElement e, double v) => e.SetAttached("Canvas.Right", v);
        public static double GetBottom(UIElement e) => e.GetAttached("Canvas.Bottom") is double d ? d : double.NaN;
        public static void SetBottom(UIElement e, double v) => e.SetAttached("Canvas.Bottom", v);
    }
    public class VirtualizingStackPanel : StackPanel { }

    /// <summary>Border · Viewbox 처럼 자식 하나를 감싸는 요소</summary>
    [Markup.ContentProperty("Child")]
    public class Decorator : FrameworkElement
    {
        private UIElement? _child;
        public UIElement? Child
        {
            get => _child;
            set { _child = value; if (value is FrameworkElement f) f.SetParent(this); UiTree.Children(Id, value == null ? new List<int>() : new List<int> { value.Id }); }
        }
        internal override IEnumerable<FrameworkElement> LogicalChildren() { if (_child is FrameworkElement f) yield return f; }
    }
    public class Border : Decorator
    {
        public Brush? Background { get => Get<Brush?>("Background"); set => Set("Background", value); }
        public Brush? BorderBrush { get => Get<Brush?>("BorderBrush"); set => Set("BorderBrush", value); }
        public Thickness BorderThickness { get => Get("BorderThickness", new Thickness(0)); set => Set("BorderThickness", value); }
        public CornerRadius CornerRadius { get => Get("CornerRadius", new CornerRadius(0)); set => Set("CornerRadius", value); }
        public Thickness Padding { get => Get("Padding", new Thickness(0)); set => Set("Padding", value); }
    }
    public class Viewbox : Decorator
    {
        public Stretch Stretch { get => Get("Stretch", Stretch.Uniform); set => Set("Stretch", value); }
    }
    public class AdornerDecorator : Decorator { }
}

namespace System.Windows.Controls.Primitives
{
    public class UniformGrid : Panel
    {
        public int Rows { get => Get("Rows", 0); set => Set("Rows", value); }
        public int Columns { get => Get("Columns", 0); set => Set("Columns", value); }
        public int FirstColumn { get => Get("FirstColumn", 0); set => Set("FirstColumn", value); }
    }
}
