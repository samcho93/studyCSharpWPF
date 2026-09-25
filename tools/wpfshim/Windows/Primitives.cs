using System;
using System.Collections.Generic;
using System.Globalization;

namespace System.Windows
{
    // ------------------------------------------------------------------ 구조체
    public struct Thickness : IEquatable<Thickness>
    {
        public double Left, Top, Right, Bottom;
        public Thickness(double uniform) { Left = Top = Right = Bottom = uniform; }
        public Thickness(double left, double top, double right, double bottom) { Left = left; Top = top; Right = right; Bottom = bottom; }
        public bool Equals(Thickness o) => Left == o.Left && Top == o.Top && Right == o.Right && Bottom == o.Bottom;
        public override bool Equals(object? obj) => obj is Thickness t && Equals(t);
        public override int GetHashCode() => HashCode.Combine(Left, Top, Right, Bottom);
        public static bool operator ==(Thickness a, Thickness b) => a.Equals(b);
        public static bool operator !=(Thickness a, Thickness b) => !a.Equals(b);
        public override string ToString() => FormattableString.Invariant($"{Left},{Top},{Right},{Bottom}");
        public static Thickness Parse(string s)
        {
            var p = s.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            double D(int i) => double.Parse(p[i], CultureInfo.InvariantCulture);
            if (p.Length == 1) return new Thickness(D(0));
            if (p.Length == 2) return new Thickness(D(0), D(1), D(0), D(1));
            if (p.Length == 4) return new Thickness(D(0), D(1), D(2), D(3));
            throw new FormatException("Thickness 형식 오류: " + s);
        }
    }

    public struct CornerRadius : IEquatable<CornerRadius>
    {
        public double TopLeft, TopRight, BottomRight, BottomLeft;
        public CornerRadius(double uniform) { TopLeft = TopRight = BottomRight = BottomLeft = uniform; }
        public CornerRadius(double tl, double tr, double br, double bl) { TopLeft = tl; TopRight = tr; BottomRight = br; BottomLeft = bl; }
        public bool Equals(CornerRadius o) => TopLeft == o.TopLeft && TopRight == o.TopRight && BottomRight == o.BottomRight && BottomLeft == o.BottomLeft;
        public override bool Equals(object? obj) => obj is CornerRadius c && Equals(c);
        public override int GetHashCode() => HashCode.Combine(TopLeft, TopRight, BottomRight, BottomLeft);
        public static bool operator ==(CornerRadius a, CornerRadius b) => a.Equals(b);
        public static bool operator !=(CornerRadius a, CornerRadius b) => !a.Equals(b);
        public override string ToString() => FormattableString.Invariant($"{TopLeft},{TopRight},{BottomRight},{BottomLeft}");
        public static CornerRadius Parse(string s)
        {
            var p = s.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            double D(int i) => double.Parse(p[i], CultureInfo.InvariantCulture);
            if (p.Length == 1) return new CornerRadius(D(0));
            if (p.Length == 4) return new CornerRadius(D(0), D(1), D(2), D(3));
            throw new FormatException("CornerRadius 형식 오류: " + s);
        }
    }

    public struct Point : IEquatable<Point>
    {
        public double X, Y;
        public Point(double x, double y) { X = x; Y = y; }
        public bool Equals(Point o) => X == o.X && Y == o.Y;
        public override bool Equals(object? obj) => obj is Point p && Equals(p);
        public override int GetHashCode() => HashCode.Combine(X, Y);
        public static bool operator ==(Point a, Point b) => a.Equals(b);
        public static bool operator !=(Point a, Point b) => !a.Equals(b);
        public static Vector operator -(Point a, Point b) => new Vector(a.X - b.X, a.Y - b.Y);
        public static Point operator +(Point a, Vector v) => new Point(a.X + v.X, a.Y + v.Y);
        public static Point operator -(Point a, Vector v) => new Point(a.X - v.X, a.Y - v.Y);
        public void Offset(double dx, double dy) { X += dx; Y += dy; }
        public override string ToString() => FormattableString.Invariant($"{X},{Y}");
        public static Point Parse(string s)
        {
            var p = s.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            return new Point(double.Parse(p[0], CultureInfo.InvariantCulture), double.Parse(p[1], CultureInfo.InvariantCulture));
        }
    }

    public struct Vector
    {
        public double X, Y;
        public Vector(double x, double y) { X = x; Y = y; }
        public double Length => Math.Sqrt(X * X + Y * Y);
        public double LengthSquared => X * X + Y * Y;
        public static Vector operator +(Vector a, Vector b) => new Vector(a.X + b.X, a.Y + b.Y);
        public static Vector operator -(Vector a, Vector b) => new Vector(a.X - b.X, a.Y - b.Y);
        public static Vector operator *(Vector a, double k) => new Vector(a.X * k, a.Y * k);
        public static Vector operator *(double k, Vector a) => new Vector(a.X * k, a.Y * k);
        public static Vector operator -(Vector a) => new Vector(-a.X, -a.Y);
        public void Normalize() { var l = Length; if (l > 0) { X /= l; Y /= l; } }
        public override string ToString() => FormattableString.Invariant($"{X},{Y}");
    }

    public struct Size
    {
        public double Width, Height;
        public Size(double width, double height) { Width = width; Height = height; }
        public bool IsEmpty => Width < 0;
        public static Size Empty => new Size(-1, -1);
        public override string ToString() => FormattableString.Invariant($"{Width},{Height}");
    }

    public struct Rect
    {
        public double X, Y, Width, Height;
        public Rect(double x, double y, double width, double height) { X = x; Y = y; Width = width; Height = height; }
        public Rect(Point p, Size s) { X = p.X; Y = p.Y; Width = s.Width; Height = s.Height; }
        public Rect(Point a, Point b) { X = Math.Min(a.X, b.X); Y = Math.Min(a.Y, b.Y); Width = Math.Abs(a.X - b.X); Height = Math.Abs(a.Y - b.Y); }
        public double Left => X; public double Top => Y; public double Right => X + Width; public double Bottom => Y + Height;
        public Point Location => new Point(X, Y);
        public Size Size => new Size(Width, Height);
        public Point TopLeft => new Point(X, Y);
        public Point BottomRight => new Point(Right, Bottom);
        public bool IsEmpty => Width < 0;
        public static Rect Empty => new Rect(0, 0, -1, -1);
        public bool Contains(Point p) => p.X >= X && p.X <= Right && p.Y >= Y && p.Y <= Bottom;
        public bool Contains(double x, double y) => Contains(new Point(x, y));
        public bool IntersectsWith(Rect r) => !(r.Left > Right || r.Right < Left || r.Top > Bottom || r.Bottom < Top);
        public void Offset(double dx, double dy) { X += dx; Y += dy; }
        public void Inflate(double w, double h) { X -= w; Y -= h; Width += 2 * w; Height += 2 * h; }
        public override string ToString() => FormattableString.Invariant($"{X},{Y},{Width},{Height}");
    }

    public struct Int32Rect { public int X, Y, Width, Height; public Int32Rect(int x, int y, int w, int h) { X = x; Y = y; Width = w; Height = h; } }

    public enum GridUnitType { Auto, Pixel, Star }
    public struct GridLength
    {
        public double Value;
        public GridUnitType GridUnitType;
        public GridLength(double value) { Value = value; GridUnitType = GridUnitType.Pixel; }
        public GridLength(double value, GridUnitType type) { Value = value; GridUnitType = type; }
        public static GridLength Auto => new GridLength(1, GridUnitType.Auto);
        public bool IsAuto => GridUnitType == GridUnitType.Auto;
        public bool IsStar => GridUnitType == GridUnitType.Star;
        public bool IsAbsolute => GridUnitType == GridUnitType.Pixel;
        public override string ToString() => GridUnitType == GridUnitType.Auto ? "Auto" : GridUnitType == GridUnitType.Star ? (Value == 1 ? "*" : Value.ToString(CultureInfo.InvariantCulture) + "*") : Value.ToString(CultureInfo.InvariantCulture);
        public static GridLength Parse(string s)
        {
            s = s.Trim();
            if (s.Equals("Auto", StringComparison.OrdinalIgnoreCase)) return Auto;
            if (s.EndsWith("*")) { var v = s.Substring(0, s.Length - 1); return new GridLength(v.Length == 0 ? 1 : double.Parse(v, CultureInfo.InvariantCulture), GridUnitType.Star); }
            return new GridLength(double.Parse(s, CultureInfo.InvariantCulture));
        }
    }
    public class GridLengthConverter { public object ConvertFromString(string s) => GridLength.Parse(s); }

    public struct Duration
    {
        public TimeSpan TimeSpan;
        public bool HasTimeSpan;
        public Duration(TimeSpan ts) { TimeSpan = ts; HasTimeSpan = true; }
        public static Duration Automatic => new Duration();
        public static Duration Forever => new Duration(TimeSpan.MaxValue);
        public static implicit operator Duration(TimeSpan ts) => new Duration(ts);
    }

    // ------------------------------------------------------------------ 열거형
    public enum HorizontalAlignment { Left, Center, Right, Stretch }
    public enum VerticalAlignment { Top, Center, Bottom, Stretch }
    public enum Visibility { Visible, Hidden, Collapsed }
    public enum TextAlignment { Left, Right, Center, Justify }
    public enum TextWrapping { WrapWithOverflow, NoWrap, Wrap }
    public enum TextTrimming { None, CharacterEllipsis, WordEllipsis }
    public enum FlowDirection { LeftToRight, RightToLeft }
    public enum WindowStartupLocation { Manual, CenterScreen, CenterOwner }
    public enum WindowState { Normal, Minimized, Maximized }
    public enum WindowStyle { None, SingleBorderWindow, ThreeDBorderWindow, ToolWindow }
    public enum ResizeMode { NoResize, CanMinimize, CanResize, CanResizeWithGrip }
    public enum SizeToContent { Manual, Width, Height, WidthAndHeight }
    public enum ShutdownMode { OnLastWindowClose, OnMainWindowClose, OnExplicitShutdown }
    public enum MessageBoxButton { OK = 0, OKCancel = 1, YesNoCancel = 3, YesNo = 4 }
    public enum MessageBoxImage { None = 0, Error = 16, Hand = 16, Stop = 16, Question = 32, Exclamation = 48, Warning = 48, Information = 64, Asterisk = 64 }
    public enum MessageBoxResult { None = 0, OK = 1, Cancel = 2, Yes = 6, No = 7 }
    public enum MessageBoxOptions { None = 0, DefaultDesktopOnly = 0x20000, RightAlign = 0x80000, RtlReading = 0x100000, ServiceNotification = 0x200000 }
    public enum FontStretch { Normal }

    public struct FontWeight : IEquatable<FontWeight>
    {
        public int Weight;
        public FontWeight(int w) { Weight = w; }
        public bool Equals(FontWeight o) => Weight == o.Weight;
        public override bool Equals(object? obj) => obj is FontWeight f && Equals(f);
        public override int GetHashCode() => Weight;
        public static bool operator ==(FontWeight a, FontWeight b) => a.Weight == b.Weight;
        public static bool operator !=(FontWeight a, FontWeight b) => a.Weight != b.Weight;
        public override string ToString() => Weight switch { 100 => "Thin", 200 => "ExtraLight", 300 => "Light", 400 => "Normal", 500 => "Medium", 600 => "SemiBold", 700 => "Bold", 800 => "ExtraBold", 900 => "Black", _ => Weight.ToString() };
        public static FontWeight FromOpenTypeWeight(int w) => new FontWeight(w);
        public int ToOpenTypeWeight() => Weight;
        public static FontWeight Parse(string s)
        {
            switch (s.Trim().ToLowerInvariant())
            {
                case "thin": return FontWeights.Thin;
                case "extralight": case "ultralight": return FontWeights.ExtraLight;
                case "light": return FontWeights.Light;
                case "normal": case "regular": return FontWeights.Normal;
                case "medium": return FontWeights.Medium;
                case "semibold": case "demibold": return FontWeights.SemiBold;
                case "bold": return FontWeights.Bold;
                case "extrabold": case "ultrabold": return FontWeights.ExtraBold;
                case "black": case "heavy": return FontWeights.Black;
                default: return new FontWeight(int.Parse(s));
            }
        }
    }
    public static class FontWeights
    {
        public static FontWeight Thin => new FontWeight(100);
        public static FontWeight ExtraLight => new FontWeight(200);
        public static FontWeight UltraLight => new FontWeight(200);
        public static FontWeight Light => new FontWeight(300);
        public static FontWeight Normal => new FontWeight(400);
        public static FontWeight Regular => new FontWeight(400);
        public static FontWeight Medium => new FontWeight(500);
        public static FontWeight SemiBold => new FontWeight(600);
        public static FontWeight DemiBold => new FontWeight(600);
        public static FontWeight Bold => new FontWeight(700);
        public static FontWeight ExtraBold => new FontWeight(800);
        public static FontWeight UltraBold => new FontWeight(800);
        public static FontWeight Black => new FontWeight(900);
        public static FontWeight Heavy => new FontWeight(900);
    }
    public struct FontStyle : IEquatable<FontStyle>
    {
        public int Style;
        public FontStyle(int s) { Style = s; }
        public bool Equals(FontStyle o) => Style == o.Style;
        public override bool Equals(object? obj) => obj is FontStyle f && Equals(f);
        public override int GetHashCode() => Style;
        public static bool operator ==(FontStyle a, FontStyle b) => a.Style == b.Style;
        public static bool operator !=(FontStyle a, FontStyle b) => a.Style != b.Style;
        public override string ToString() => Style == 1 ? "Italic" : Style == 2 ? "Oblique" : "Normal";
        public static FontStyle Parse(string s) => s.Trim().ToLowerInvariant() switch { "italic" => FontStyles.Italic, "oblique" => FontStyles.Oblique, _ => FontStyles.Normal };
    }
    public static class FontStyles
    {
        public static FontStyle Normal => new FontStyle(0);
        public static FontStyle Italic => new FontStyle(1);
        public static FontStyle Oblique => new FontStyle(2);
    }
    public class TextDecoration { public string Kind = ""; public override string ToString() => Kind; }
    public class TextDecorationCollection : List<TextDecoration> { public override string ToString() => string.Join(" ", ConvertAll(d => d.Kind)); }
    public static class TextDecorations
    {
        public static TextDecorationCollection Underline => new TextDecorationCollection { new TextDecoration { Kind = "Underline" } };
        public static TextDecorationCollection Strikethrough => new TextDecorationCollection { new TextDecoration { Kind = "Strikethrough" } };
        public static TextDecorationCollection OverLine => new TextDecorationCollection { new TextDecoration { Kind = "OverLine" } };
        public static TextDecorationCollection Baseline => new TextDecorationCollection { new TextDecoration { Kind = "Baseline" } };
    }

    // ------------------------------------------------------------------ 이벤트
    public class RoutedEvent
    {
        public string Name { get; }
        public RoutedEvent(string name) { Name = name; }
        public override string ToString() => Name;
    }
    public class RoutedEventArgs : EventArgs
    {
        public bool Handled { get; set; }
        public object? Source { get; set; }
        public object? OriginalSource { get; set; }
        public RoutedEvent? RoutedEvent { get; set; }
        public RoutedEventArgs() { }
        public RoutedEventArgs(RoutedEvent? routedEvent) { RoutedEvent = routedEvent; }
        public RoutedEventArgs(RoutedEvent? routedEvent, object? source) { RoutedEvent = routedEvent; Source = source; OriginalSource = source; }
    }
    public delegate void RoutedEventHandler(object sender, RoutedEventArgs e);
    public class RoutedPropertyChangedEventArgs<T> : RoutedEventArgs
    {
        public T OldValue { get; }
        public T NewValue { get; }
        public RoutedPropertyChangedEventArgs(T oldValue, T newValue) { OldValue = oldValue; NewValue = newValue; }
    }
    public delegate void RoutedPropertyChangedEventHandler<T>(object sender, RoutedPropertyChangedEventArgs<T> e);
    public class SizeChangedEventArgs : RoutedEventArgs
    {
        public Size PreviousSize { get; set; }
        public Size NewSize { get; set; }
        public bool WidthChanged => PreviousSize.Width != NewSize.Width;
        public bool HeightChanged => PreviousSize.Height != NewSize.Height;
    }
    public delegate void SizeChangedEventHandler(object sender, SizeChangedEventArgs e);
    public class DependencyPropertyChangedEventArgs : EventArgs
    {
        public DependencyProperty Property { get; }
        public object? OldValue { get; }
        public object? NewValue { get; }
        public DependencyPropertyChangedEventArgs(DependencyProperty p, object? o, object? n) { Property = p; OldValue = o; NewValue = n; }
    }
    public delegate void DependencyPropertyChangedEventHandler(object sender, DependencyPropertyChangedEventArgs e);
    public class ExceptionRoutedEventArgs : RoutedEventArgs { public Exception? ErrorException { get; set; } }
    public class StartupEventArgs : EventArgs { public string[] Args { get; set; } = Array.Empty<string>(); }
    public class ExitEventArgs : EventArgs { public int ApplicationExitCode { get; set; } }
    public delegate void StartupEventHandler(object sender, StartupEventArgs e);
    public delegate void ExitEventHandler(object sender, ExitEventArgs e);

    // ------------------------------------------------------------------ 의존 속성 (간이)
    public class DependencyProperty
    {
        private static readonly Dictionary<string, DependencyProperty> _all = new Dictionary<string, DependencyProperty>();
        public string Name { get; }
        public Type PropertyType { get; }
        public Type OwnerType { get; }
        public PropertyMetadata? DefaultMetadata { get; }
        public bool IsAttached { get; }
        private DependencyProperty(string name, Type type, Type owner, PropertyMetadata? meta, bool attached) { Name = name; PropertyType = type; OwnerType = owner; DefaultMetadata = meta; IsAttached = attached; }
        public static DependencyProperty Register(string name, Type propertyType, Type ownerType) => Register(name, propertyType, ownerType, null);
        public static DependencyProperty Register(string name, Type propertyType, Type ownerType, PropertyMetadata? typeMetadata)
        {
            var dp = new DependencyProperty(name, propertyType, ownerType, typeMetadata, false);
            _all[ownerType.FullName + "." + name] = dp;
            return dp;
        }
        public static DependencyProperty Register(string name, Type propertyType, Type ownerType, PropertyMetadata? typeMetadata, ValidateValueCallback? validate) => Register(name, propertyType, ownerType, typeMetadata);
        public static DependencyProperty RegisterAttached(string name, Type propertyType, Type ownerType) => RegisterAttached(name, propertyType, ownerType, null);
        public static DependencyProperty RegisterAttached(string name, Type propertyType, Type ownerType, PropertyMetadata? meta)
        {
            var dp = new DependencyProperty(name, propertyType, ownerType, meta, true);
            _all[ownerType.FullName + "." + name] = dp;
            return dp;
        }
        public static DependencyProperty? Lookup(Type owner, string name)
        {
            for (var t = owner; t != null; t = t.BaseType)
                if (_all.TryGetValue(t.FullName + "." + name, out var dp)) return dp;
            return null;
        }
        public override string ToString() => Name;
    }
    public delegate bool ValidateValueCallback(object? value);
    public delegate void PropertyChangedCallback(DependencyObject d, DependencyPropertyChangedEventArgs e);
    public delegate object? CoerceValueCallback(DependencyObject d, object? baseValue);
    public class PropertyMetadata
    {
        public object? DefaultValue { get; set; }
        public PropertyChangedCallback? PropertyChangedCallback { get; set; }
        public CoerceValueCallback? CoerceValueCallback { get; set; }
        public PropertyMetadata() { }
        public PropertyMetadata(object? defaultValue) { DefaultValue = defaultValue; }
        public PropertyMetadata(PropertyChangedCallback cb) { PropertyChangedCallback = cb; }
        public PropertyMetadata(object? defaultValue, PropertyChangedCallback? cb) { DefaultValue = defaultValue; PropertyChangedCallback = cb; }
        public PropertyMetadata(object? defaultValue, PropertyChangedCallback? cb, CoerceValueCallback? coerce) { DefaultValue = defaultValue; PropertyChangedCallback = cb; CoerceValueCallback = coerce; }
    }
    public class FrameworkPropertyMetadata : PropertyMetadata
    {
        public FrameworkPropertyMetadata() { }
        public FrameworkPropertyMetadata(object? defaultValue) : base(defaultValue) { }
        public FrameworkPropertyMetadata(object? defaultValue, PropertyChangedCallback? cb) : base(defaultValue, cb) { }
        public FrameworkPropertyMetadata(object? defaultValue, FrameworkPropertyMetadataOptions options) : base(defaultValue) { }
        public FrameworkPropertyMetadata(object? defaultValue, FrameworkPropertyMetadataOptions options, PropertyChangedCallback? cb) : base(defaultValue, cb) { }
        public FrameworkPropertyMetadata(PropertyChangedCallback cb) : base(cb) { }
    }
    [Flags] public enum FrameworkPropertyMetadataOptions { None = 0, AffectsMeasure = 1, AffectsArrange = 2, AffectsParentMeasure = 4, AffectsParentArrange = 8, AffectsRender = 16, Inherits = 32, BindsTwoWayByDefault = 256 }

    public class DependencyObject
    {
        private Dictionary<DependencyProperty, object?>? _dpValues;
        public object? GetValue(DependencyProperty dp)
        {
            if (_dpValues != null && _dpValues.TryGetValue(dp, out var v)) return v;
            // 같은 이름의 CLR 속성이 있으면 그것을 돌려준다 (Grid.Row 등 부착 속성은 UIElement 가 처리)
            var pi = GetType().GetProperty(dp.Name);
            if (pi != null && pi.CanRead && !dp.IsAttached) return pi.GetValue(this);
            return dp.DefaultMetadata?.DefaultValue ?? (dp.PropertyType.IsValueType ? Activator.CreateInstance(dp.PropertyType) : null);
        }
        public void SetValue(DependencyProperty dp, object? value)
        {
            var old = GetValue(dp);
            var pi = GetType().GetProperty(dp.Name);
            if (pi != null && pi.CanWrite && !dp.IsAttached) { pi.SetValue(this, WpfShim.Conv.To(pi.PropertyType, value)); }
            else
            {
                _dpValues ??= new Dictionary<DependencyProperty, object?>();
                _dpValues[dp] = value;
                if (this is UIElement el) el.SetAttached(dp.OwnerType.Name + "." + dp.Name, value);
            }
            dp.DefaultMetadata?.PropertyChangedCallback?.Invoke(this, new DependencyPropertyChangedEventArgs(dp, old, value));
        }
        public void ClearValue(DependencyProperty dp) { _dpValues?.Remove(dp); }
        public bool CheckAccess() => true;
        public void VerifyAccess() { }
        public Threading.Dispatcher Dispatcher => Threading.Dispatcher.CurrentDispatcher;
    }

    public class PropertyPath
    {
        public string Path { get; }
        public PropertyPath(string path) { Path = path; }
        public PropertyPath(object path) { Path = path?.ToString() ?? ""; }
        public PropertyPath(string path, params object[] pathParameters) { Path = path; }
        public override string ToString() => Path;
    }

    public class DataObject
    {
        private readonly Dictionary<string, object?> _data = new Dictionary<string, object?>();
        public DataObject() { }
        public DataObject(object data) { _data["Text"] = data; }
        public DataObject(string format, object data) { _data[format] = data; }
        public object? GetData(string format) => _data.TryGetValue(format, out var v) ? v : null;
        public bool GetDataPresent(string format) => _data.ContainsKey(format);
        public void SetData(string format, object? data) => _data[format] = data;
    }
    public static class DataFormats { public const string Text = "Text"; public const string UnicodeText = "UnicodeText"; public const string FileDrop = "FileDrop"; }

    public static class Clipboard
    {
        private static string _text = "";
        public static void SetText(string text) { _text = text ?? ""; }
        public static string GetText() => _text;
        public static bool ContainsText() => _text.Length > 0;
        public static void Clear() => _text = "";
    }

    public static class SystemParameters
    {
        public static double PrimaryScreenWidth => 1280;
        public static double PrimaryScreenHeight => 720;
        public static double WorkArea_Width => 1280;
        public static Rect WorkArea => new Rect(0, 0, 1280, 720);
        public static double VirtualScreenWidth => 1280;
        public static double VirtualScreenHeight => 720;
    }
}

namespace System.Windows.Markup
{
    [AttributeUsage(AttributeTargets.Class, Inherited = true)]
    public sealed class ContentPropertyAttribute : Attribute
    {
        public string Name { get; }
        public ContentPropertyAttribute(string name) { Name = name; }
    }
    public interface IComponentConnector { void InitializeComponent(); void Connect(int id, object target); }
}
