using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Reflection;
using System.Xml.Linq;
using WpfShim;

namespace System.Windows.Data
{
    public enum BindingMode { TwoWay, OneWay, OneTime, OneWayToSource, Default }
    public enum UpdateSourceTrigger { Default, PropertyChanged, LostFocus, Explicit }
    public enum RelativeSourceMode { PreviousData, TemplatedParent, Self, FindAncestor }

    public interface IValueConverter
    {
        object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture);
        object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture);
    }
    public interface IMultiValueConverter
    {
        object? Convert(object?[] values, Type targetType, object? parameter, CultureInfo culture);
        object?[] ConvertBack(object? value, Type[] targetTypes, object? parameter, CultureInfo culture);
    }
    [AttributeUsage(AttributeTargets.Class)] public class ValueConversionAttribute : Attribute { public ValueConversionAttribute(Type s, Type t) { } }

    public class RelativeSource
    {
        public RelativeSourceMode Mode { get; set; }
        public Type? AncestorType { get; set; }
        public int AncestorLevel { get; set; } = 1;
        public RelativeSource() { }
        public RelativeSource(RelativeSourceMode mode) { Mode = mode; }
        public static RelativeSource Self => new RelativeSource(RelativeSourceMode.Self);
        public static RelativeSource TemplatedParent => new RelativeSource(RelativeSourceMode.TemplatedParent);
    }
    public abstract class BindingBase { public string? StringFormat { get; set; } public object? FallbackValue { get; set; } public object? TargetNullValue { get; set; } }

    public class Binding : BindingBase
    {
        public string Path { get; set; } = "";
        public BindingMode Mode { get; set; } = BindingMode.Default;
        public UpdateSourceTrigger UpdateSourceTrigger { get; set; } = UpdateSourceTrigger.Default;
        public string? ElementName { get; set; }
        public object? Source { get; set; }
        public RelativeSource? RelativeSource { get; set; }
        public IValueConverter? Converter { get; set; }
        public object? ConverterParameter { get; set; }
        public CultureInfo? ConverterCulture { get; set; }
        public bool ValidatesOnDataErrors { get; set; }
        public bool ValidatesOnExceptions { get; set; }
        public bool NotifyOnValidationError { get; set; }
        public bool IsAsync { get; set; }
        public int Delay { get; set; }
        public static readonly object DoNothing = new object();
        public Binding() { }
        public Binding(string path) { Path = path ?? ""; }
        public override string ToString() => "{Binding " + Path + "}";
    }
    [Markup.ContentProperty("Bindings")]
    public class MultiBinding : BindingBase
    {
        public List<BindingBase> Bindings { get; } = new List<BindingBase>();
        public IMultiValueConverter? Converter { get; set; }
        public object? ConverterParameter { get; set; }
        public BindingMode Mode { get; set; }
    }
    public class BindingGroup { public string? Name { get; set; } }

    /// <summary>요소의 속성 하나와 데이터 원본을 잇는 바인딩 (INotifyPropertyChanged 구독)</summary>
    public class BindingExpression
    {
        public Binding ParentBinding { get; }
        public FrameworkElement Target { get; }
        public string TargetProperty { get; }
        private object? _source;          // 실제 원본 (DataContext, ElementName 대상, Source)
        private readonly List<(INotifyPropertyChanged obj, string prop)> _subs = new List<(INotifyPropertyChanged, string)>();
        private bool _updating;
        private static int _seq;
        private readonly int _id = ++_seq;

        public BindingExpression(FrameworkElement target, string property, Binding b)
        {
            Target = target; TargetProperty = property; ParentBinding = b;
        }
        public object? DataItem => _source;
        public object? ResolvedSource => _source;
        public bool HasError => false;
        public bool IsDirty => false;
        internal bool IsTwoWay
        {
            get
            {
                if (ParentBinding.Mode == BindingMode.TwoWay || ParentBinding.Mode == BindingMode.OneWayToSource) return true;
                if (ParentBinding.Mode != BindingMode.Default) return false;
                // WPF 기본값: 사용자가 바꾸는 속성은 TwoWay
                return TargetProperty is "Text" or "IsChecked" or "Value" or "SelectedItem" or "SelectedIndex" or "SelectedValue" or "SelectedDate" or "Password" or "IsExpanded" or "IsSelected";
            }
        }

        internal void OnDataContextChanged() { Refresh(); }

        /// <summary>원본을 다시 찾고 대상 속성을 갱신한다</summary>
        internal void Refresh()
        {
            foreach (var (o, _) in _subs) o.PropertyChanged -= OnSourcePropertyChanged;
            _subs.Clear();
            if (ParentBinding.Source != null) _source = ParentBinding.Source;
            else if (ParentBinding.ElementName != null) _source = Target.FindName(ParentBinding.ElementName) ?? FindByName(ParentBinding.ElementName);
            else if (ParentBinding.RelativeSource != null)
            {
                var rs = ParentBinding.RelativeSource;
                if (rs.Mode == RelativeSourceMode.Self) _source = Target;
                else if (rs.Mode == RelativeSourceMode.FindAncestor) { FrameworkElement? e = Target.ParentElement; int lv = rs.AncestorLevel; while (e != null) { if (rs.AncestorType == null || rs.AncestorType.IsInstanceOfType(e)) { if (--lv <= 0) break; } e = e.ParentElement; } _source = e; }
                else _source = Target.DataContext;
            }
            else _source = Target.DataContext;
            if (ParentBinding.Mode != BindingMode.OneWayToSource) UpdateTarget();
            // 경로상의 각 객체를 구독
            var parts = SplitPath(ParentBinding.Path);
            object? cur = _source;
            for (int i = 0; i < parts.Count; i++)
            {
                if (cur is INotifyPropertyChanged n) { n.PropertyChanged += OnSourcePropertyChanged; _subs.Add((n, parts[i])); }
                if (cur == null) break;
                cur = GetMember(cur, parts[i]);
            }
            if (parts.Count == 0 && cur is INotifyPropertyChanged n0) { n0.PropertyChanged += OnSourcePropertyChanged; _subs.Add((n0, "")); }
        }
        private static object? FindByName(string name)
        {
            foreach (var w in UiTree.OpenWindows) { var f = w.FindName(name); if (f != null) return f; }
            return null;
        }
        private void OnSourcePropertyChanged(object? s, PropertyChangedEventArgs e)
        {
            if (_updating) return;
            var first = SplitPath(ParentBinding.Path);
            var name = e.PropertyName ?? "";
            // 바뀐 속성이 경로에 있으면 갱신 (빈 이름은 전체 갱신)
            if (name.Length == 0 || first.Contains(name) || first.Count == 0) { if (ParentBinding.Mode != BindingMode.OneWayToSource) { Refresh(); } }
        }

        public void UpdateTarget()
        {
            if (_updating) return;
            _updating = true;
            try
            {
                object? v = null;
                bool resolved = _source != null;
                if (resolved)
                {
                    var parts = SplitPath(ParentBinding.Path);
                    object? cur = _source;
                    foreach (var p in parts) { if (cur == null) { resolved = false; break; } cur = GetMember(cur, p); }
                    v = resolved ? cur : null;
                }
                var targetType = TargetType();
                if (!resolved)
                {
                    // 경로를 끝까지 따라갈 수 없으면(원본 없음 · 중간이 null) FallbackValue
                    v = ParentBinding.FallbackValue;
                    if (v == null && targetType == typeof(string)) v = "";
                }
                else
                {
                    if (ParentBinding.Converter != null) v = ParentBinding.Converter.Convert(v, targetType, ParentBinding.ConverterParameter, ParentBinding.ConverterCulture ?? CultureInfo.CurrentCulture);
                    if (v == null && ParentBinding.TargetNullValue != null) v = ParentBinding.TargetNullValue;
                    if (ParentBinding.StringFormat != null && (targetType == typeof(string) || targetType == typeof(object)))
                    {
                        var fmt = ParentBinding.StringFormat;
                        if (!fmt.Contains("{")) fmt = "{0:" + fmt + "}";
                        v = v == null ? "" : string.Format(CultureInfo.CurrentCulture, fmt, v);
                    }
                }
                if (ReferenceEquals(v, Binding.DoNothing)) return;
                Target.SetPropertyValue(TargetProperty, v, fromStyle: false);
                Target.LocalSet.Remove(TargetProperty);   // 바인딩된 값은 지역 값이 아니므로 스타일이 다시 덮어쓸 수 있게
            }
            catch (Exception ex) { Bridge.Write(2, $"[바인딩 오류] {TargetProperty} ← {ParentBinding.Path}: {ex.Message}\n"); }
            finally { _updating = false; }
        }

        /// <summary>UI 에서 바뀐 값을 원본에 쓴다</summary>
        public void UpdateSource() => UpdateSource(Target.GetPropertyValue(TargetProperty));
        internal void UpdateSource(object? value)
        {
            if (!IsTwoWay || _source == null || _updating) return;
            _updating = true;
            try
            {
                var parts = SplitPath(ParentBinding.Path);
                if (parts.Count == 0) return;
                object? cur = _source;
                for (int i = 0; i < parts.Count - 1; i++) { cur = GetMember(cur, parts[i]); if (cur == null) return; }
                var last = parts[parts.Count - 1];
                var pi = cur!.GetType().GetProperty(last, BindingFlags.Public | BindingFlags.Instance);
                if (pi == null || !pi.CanWrite) return;
                var v = value;
                if (ParentBinding.Converter != null) v = ParentBinding.Converter.ConvertBack(v, pi.PropertyType, ParentBinding.ConverterParameter, CultureInfo.CurrentCulture);
                if (ReferenceEquals(v, Binding.DoNothing)) return;
                object? conv;
                try { conv = Conv.To(pi.PropertyType, v); }
                catch { return; }   // "abc" → int 처럼 변환 실패: WPF 도 원본을 바꾸지 않는다
                if (conv is string && pi.PropertyType != typeof(string) && pi.PropertyType != typeof(object)) return;
                pi.SetValue(cur, conv);
            }
            catch (Exception ex) { Bridge.Write(2, $"[바인딩 오류] {ParentBinding.Path} ← {TargetProperty}: {(ex is TargetInvocationException t && t.InnerException != null ? t.InnerException.Message : ex.Message)}\n"); }
            finally { _updating = false; }
        }
        private Type TargetType()
        {
            var pi = Target.GetType().GetProperty(TargetProperty, BindingFlags.Public | BindingFlags.Instance);
            return pi?.PropertyType ?? typeof(object);
        }

        // ---------------------------------------------------------------- 경로 처리 (A.B.C, A[0], [Key])
        internal static List<string> SplitPath(string path)
        {
            var parts = new List<string>();
            if (string.IsNullOrWhiteSpace(path) || path == ".") return parts;
            var cur = "";
            foreach (var ch in path)
            {
                if (ch == '.') { if (cur.Length > 0) parts.Add(cur); cur = ""; }
                else if (ch == '[') { if (cur.Length > 0) parts.Add(cur); cur = "["; }
                else cur += ch;
            }
            if (cur.Length > 0) parts.Add(cur);
            return parts;
        }
        internal static object? GetMember(object? obj, string name)
        {
            if (obj == null) return null;
            if (name.StartsWith("["))
            {
                var key = name.Trim('[', ']');
                if (obj is IList list && int.TryParse(key, out var idx)) return idx >= 0 && idx < list.Count ? list[idx] : null;
                if (obj is IDictionary dict) return dict.Contains(key) ? dict[key] : null;
                var indexer = obj.GetType().GetProperty("Item", new[] { typeof(string) });
                if (indexer != null) return indexer.GetValue(obj, new object[] { key });
                return null;
            }
            var t = obj.GetType();
            var pi = t.GetProperty(name, BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);
            if (pi != null) return pi.GetValue(obj);
            var fi = t.GetField(name, BindingFlags.Public | BindingFlags.Instance);
            if (fi != null) return fi.GetValue(obj);
            if (obj is UIElement el) return el.GetAttached(name);
            return null;
        }
        public static object? GetPathValue(object? source, string path)
        {
            var cur = source;
            foreach (var p in SplitPath(path)) { if (cur == null) return null; cur = GetMember(cur, p); }
            return cur;
        }
        public static void SetPathValue(object target, string path, object? value)
        {
            var parts = SplitPath(path);
            if (parts.Count == 0) return;
            object? cur = target;
            for (int i = 0; i < parts.Count - 1; i++) { cur = GetMember(cur, parts[i]); if (cur == null) return; }
            var pi = cur!.GetType().GetProperty(parts[parts.Count - 1], BindingFlags.Public | BindingFlags.Instance);
            if (pi != null && pi.CanWrite) { try { pi.SetValue(cur, Conv.To(pi.PropertyType, value)); } catch { } }
        }
        /// <summary>바인딩을 항목 하나에 적용한 표시 문자열 (ListView 열 · DataGrid 셀)</summary>
        public static string? Format(Binding b, object? item)
        {
            var v = GetPathValue(item, b.Path);
            if (b.Converter != null) v = b.Converter.Convert(v, typeof(string), b.ConverterParameter, CultureInfo.CurrentCulture);
            if (v == null) return b.TargetNullValue?.ToString();
            if (b.StringFormat != null) { var f = b.StringFormat.Contains("{") ? b.StringFormat : "{0:" + b.StringFormat + "}"; return string.Format(CultureInfo.CurrentCulture, f, v); }
            return v is IFormattable fm ? fm.ToString(null, CultureInfo.CurrentCulture) : v.ToString();
        }
    }

    public static class BindingOperations
    {
        public static BindingExpression? SetBinding(DependencyObject target, DependencyProperty dp, BindingBase binding) => target is FrameworkElement fe ? SetBinding(fe, dp.Name, binding) : null;
        public static BindingExpression? SetBinding(FrameworkElement target, string property, BindingBase binding)
        {
            if (binding is MultiBinding mb)
            {
                // MultiBinding: 첫 바인딩만 실제 구독하고 값은 컨버터로 계산 (간이)
                var exprs = new List<BindingExpression>();
                foreach (var b in mb.Bindings) if (b is Binding bb) exprs.Add(new BindingExpression(target, "$multi" + property, bb));
                void Update()
                {
                    var vals = new object?[exprs.Count];
                    for (int i = 0; i < exprs.Count; i++) vals[i] = BindingExpression.GetPathValue(exprs[i].ResolvedSource, exprs[i].ParentBinding.Path);
                    object? v = mb.Converter != null ? mb.Converter.Convert(vals, typeof(object), mb.ConverterParameter, CultureInfo.CurrentCulture) : (mb.StringFormat != null ? string.Format(CultureInfo.CurrentCulture, mb.StringFormat, vals) : string.Join(" ", vals));
                    target.SetPropertyValue(property, v);
                }
                foreach (var e in exprs)
                {
                    e.Refresh();
                    if (e.ResolvedSource is INotifyPropertyChanged n) n.PropertyChanged += (s, a) => { e.Refresh(); Update(); };
                }
                Update();
                target.DataContextChanged += (s, a) => { foreach (var e in exprs) e.Refresh(); Update(); };
                return exprs.Count > 0 ? exprs[0] : null;
            }
            var bx = new BindingExpression(target, property, (Binding)binding);
            target.Bindings[property] = bx;
            bx.Refresh();
            return bx;
        }
        public static void ClearBinding(DependencyObject target, DependencyProperty dp) { if (target is FrameworkElement fe) fe.Bindings.Remove(dp.Name); }
        public static void ClearAllBindings(DependencyObject target) { if (target is FrameworkElement fe) fe.Bindings.Clear(); }
        public static BindingExpression? GetBindingExpression(DependencyObject target, DependencyProperty dp) => target is FrameworkElement fe && fe.Bindings.TryGetValue(dp.Name, out var b) ? b : null;
        public static bool IsDataBound(DependencyObject target, DependencyProperty dp) => GetBindingExpression(target, dp) != null;
    }

    /// <summary>CollectionViewSource 간이 구현: 필터 · 정렬 후의 목록을 View 로 제공</summary>
    public class CollectionViewSource
    {
        public IEnumerable? Source { get; set; }
        public ListCollectionView View => new ListCollectionView(Source ?? Array.Empty<object>());
        public static ICollectionView GetDefaultView(object? source) => new ListCollectionView(source as IEnumerable ?? Array.Empty<object>());
    }
    public interface ICollectionView : IEnumerable
    {
        Predicate<object>? Filter { get; set; }
        void Refresh();
        object? CurrentItem { get; }
        bool MoveCurrentTo(object? item);
        bool MoveCurrentToFirst();
        bool MoveCurrentToNext();
        bool MoveCurrentToPrevious();
        bool MoveCurrentToLast();
        int CurrentPosition { get; }
        SortDescriptionCollection SortDescriptions { get; }
    }
    public class SortDescription { public string PropertyName { get; } public ListSortDirection Direction { get; } public SortDescription(string p, ListSortDirection d) { PropertyName = p; Direction = d; } }
    public class SortDescriptionCollection : List<SortDescription> { }
    public class ListCollectionView : ICollectionView, INotifyCollectionChanged
    {
        private readonly IEnumerable _src;
        public ListCollectionView(IEnumerable src) { _src = src; if (src is INotifyCollectionChanged n) n.CollectionChanged += (s, e) => Refresh(); }
        public Predicate<object>? Filter { get; set; }
        public SortDescriptionCollection SortDescriptions { get; } = new SortDescriptionCollection();
        public object? CurrentItem { get; private set; }
        public int CurrentPosition { get; private set; } = -1;
        public event NotifyCollectionChangedEventHandler? CollectionChanged;
        public void Refresh() => CollectionChanged?.Invoke(this, new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
        public IEnumerator GetEnumerator()
        {
            var list = new List<object>();
            foreach (var o in _src) if (Filter == null || Filter(o)) list.Add(o);
            foreach (var sd in SortDescriptions)
            {
                var d = sd;
                list.Sort((a, b) => { var va = BindingExpression.GetPathValue(a, d.PropertyName); var vb = BindingExpression.GetPathValue(b, d.PropertyName); var c = Comparer.DefaultInvariant.Compare(va, vb); return d.Direction == ListSortDirection.Descending ? -c : c; });
            }
            return list.GetEnumerator();
        }
        public bool MoveCurrentTo(object? item) { CurrentItem = item; return item != null; }
        public bool MoveCurrentToFirst() { foreach (var o in this) { CurrentItem = o; CurrentPosition = 0; return true; } return false; }
        public bool MoveCurrentToNext() { int i = 0; bool take = false; foreach (var o in this) { if (take) { CurrentItem = o; CurrentPosition = i; return true; } if (ReferenceEquals(o, CurrentItem)) take = true; i++; } return false; }
        public bool MoveCurrentToPrevious() { object? prev = null; int i = 0; foreach (var o in this) { if (ReferenceEquals(o, CurrentItem)) { if (prev == null) return false; CurrentItem = prev; CurrentPosition = i - 1; return true; } prev = o; i++; } return false; }
        public bool MoveCurrentToLast() { object? last = null; int i = -1; foreach (var o in this) { last = o; i++; } CurrentItem = last; CurrentPosition = i; return last != null; }
        public int Count { get { int n = 0; foreach (var _ in this) n++; return n; } }
    }
}

namespace System.Windows.Controls
{
    /// <summary>XAML 조각을 보관했다가 항목마다 인스턴스를 만든다</summary>
    public class DataTemplate
    {
        public Type? DataType { get; set; }
        internal XElement? Xaml;
        internal object? Owner;                       // 이벤트 핸들러를 찾을 루트 객체
        internal Func<object?, UIElement?>? Factory;  // 코드로 만든 템플릿
        public DataTemplate() { }
        public DataTemplate(Type dataType) { DataType = dataType; }
        public DataTemplate(Func<object?, UIElement?> factory) { Factory = factory; }
        public object? VisualTree { get; set; }
        public UIElement? Instantiate(object? dataContext, FrameworkElement? parent)
        {
            UIElement? e = null;
            if (Factory != null) e = Factory(dataContext);
            else if (Xaml != null) e = Markup.XamlLoader.InstantiateTemplate(Xaml, Owner, dataContext, parent) as UIElement;
            if (e is FrameworkElement fe && !fe.HasLocalDataContext) fe.DataContext = dataContext;
            return e;
        }
        public UIElement? LoadContent() => Instantiate(null, null);
    }
    public class HierarchicalDataTemplate : DataTemplate { public Data.Binding? ItemsSource { get; set; } public DataTemplate? ItemTemplate { get; set; } }
}
