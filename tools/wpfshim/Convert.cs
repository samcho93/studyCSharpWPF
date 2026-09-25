using System;
using System.Collections.Generic;
using System.Globalization;
using System.Windows;
using System.Windows.Markup;
using System.Windows.Media;

namespace WpfShim
{
    /// <summary>XAML 속성 문자열 · 바인딩 값을 목표 형식으로 변환한다 (WPF 의 TypeConverter 역할)</summary>
    public static class Conv
    {
        public static object? To(Type target, object? value)
        {
            if (value == null) return target.IsValueType && Nullable.GetUnderlyingType(target) == null ? Activator.CreateInstance(target) : null;
            var nt = Nullable.GetUnderlyingType(target);
            if (nt != null) target = nt;
            if (target.IsInstanceOfType(value)) return value;
            if (value is string s) return FromString(target, s);
            if (target == typeof(string)) return value is IFormattable f ? f.ToString(null, CultureInfo.CurrentCulture) : value.ToString();
            if (target.IsEnum) return Enum.ToObject(target, System.Convert.ToInt64(value, CultureInfo.InvariantCulture));
            if (target == typeof(Brush) && value is Color c) return new SolidColorBrush(c);
            if (target == typeof(Thickness) && (value is double || value is int)) return new Thickness(System.Convert.ToDouble(value));
            if (target == typeof(GridLength) && (value is double || value is int)) return new GridLength(System.Convert.ToDouble(value));
            if (target == typeof(object)) return value;
            try { return System.Convert.ChangeType(value, target, CultureInfo.CurrentCulture); }
            catch { return value; }
        }

        public static object? FromString(Type target, string s)
        {
            if (target == typeof(string) || target == typeof(object)) return s;
            var nt = Nullable.GetUnderlyingType(target);
            if (nt != null) { if (s.Length == 0 || s == "{x:Null}") return null; target = nt; }
            var t = s.Trim();
            var ci = CultureInfo.InvariantCulture;
            if (target == typeof(double)) return t.Equals("Auto", StringComparison.OrdinalIgnoreCase) || t == "NaN" ? double.NaN : t.Equals("Infinity", StringComparison.OrdinalIgnoreCase) ? double.PositiveInfinity : double.Parse(t, ci);
            if (target == typeof(float)) return float.Parse(t, ci);
            if (target == typeof(int)) return int.Parse(t, ci);
            if (target == typeof(long)) return long.Parse(t, ci);
            if (target == typeof(short)) return short.Parse(t, ci);
            if (target == typeof(byte)) return byte.Parse(t, ci);
            if (target == typeof(decimal)) return decimal.Parse(t, ci);
            if (target == typeof(bool)) return bool.Parse(t);
            if (target == typeof(char)) return t.Length > 0 ? t[0] : '\0';
            if (target.IsEnum) return Enum.Parse(target, t.Replace(" ", ""), true);
            if (target == typeof(Thickness)) return Thickness.Parse(t);
            if (target == typeof(CornerRadius)) return CornerRadius.Parse(t);
            if (target == typeof(GridLength)) return GridLength.Parse(t);
            if (target == typeof(Brush) || target == typeof(SolidColorBrush)) return Brush.Parse(t);
            if (target == typeof(Color)) return Color.Parse(t);
            if (target == typeof(FontWeight)) return FontWeight.Parse(t);
            if (target == typeof(FontStyle)) return FontStyle.Parse(t);
            if (target == typeof(FontFamily)) return new FontFamily(t);
            if (target == typeof(Point)) return Point.Parse(t);
            if (target == typeof(Size)) { var p = Point.Parse(t); return new Size(p.X, p.Y); }
            if (target == typeof(Rect)) { var p = t.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries); return new Rect(double.Parse(p[0], ci), double.Parse(p[1], ci), double.Parse(p[2], ci), double.Parse(p[3], ci)); }
            if (target == typeof(PointCollection)) return PointCollection.Parse(t);
            if (target == typeof(DoubleCollection)) return DoubleCollection.Parse(t);
            if (target == typeof(Geometry)) return Geometry.Parse(t);
            if (target == typeof(Transform)) return Transform.Parse(t);
            if (target == typeof(ImageSource)) return new System.Windows.Media.Imaging.BitmapImage(new Uri(t, UriKind.RelativeOrAbsolute));
            if (target == typeof(Uri)) return new Uri(t, UriKind.RelativeOrAbsolute);
            if (target == typeof(TimeSpan)) return TimeSpan.Parse(t, ci);
            if (target == typeof(DateTime)) return DateTime.Parse(t, CultureInfo.CurrentCulture);
            if (target == typeof(Duration)) return new Duration(TimeSpan.Parse(t, ci));
            if (target == typeof(TextDecorationCollection)) return t.Equals("Underline", StringComparison.OrdinalIgnoreCase) ? TextDecorations.Underline : t.Equals("Strikethrough", StringComparison.OrdinalIgnoreCase) ? TextDecorations.Strikethrough : new TextDecorationCollection();
            if (target == typeof(System.Windows.Input.Cursor)) return System.Windows.Input.Cursors.Parse(t);
            if (target == typeof(Type)) return XamlTypes.Resolve(t);
            if (target == typeof(PropertyPath)) return new PropertyPath(t);
            if (target == typeof(System.Windows.Input.KeyGesture)) return System.Windows.Input.KeyGesture.Parse(t);
            if (target == typeof(System.Windows.Input.InputGesture)) return System.Windows.Input.KeyGesture.Parse(t);
            if (typeof(System.Windows.Input.ICommand).IsAssignableFrom(target) && target.IsAssignableFrom(typeof(System.Windows.Input.RoutedUICommand)))
                return System.Windows.Input.ApplicationCommands.FromName(t) ?? throw new FormatException("알 수 없는 명령 이름: " + t + " (ApplicationCommands.Save 처럼 쓰거나 {x:Static …} 사용)");
            // 정적 Parse(string) 이 있으면 사용
            var m = target.GetMethod("Parse", new[] { typeof(string) });
            if (m != null && m.IsStatic) return m.Invoke(null, new object[] { s });
            try { return System.Convert.ChangeType(s, target, ci); } catch { return s; }
        }

        /// <summary>렌더러에 보낼 값으로 직렬화한다</summary>
        public static object? ToWire(object? v)
        {
            switch (v)
            {
                case null: return null;
                case string s: return s;
                case bool b: return b;
                case double d: return double.IsNaN(d) ? null : (object)d;
                case float f: return (double)f;
                case int i: return i;
                case long l: return l;
                case decimal m: return (double)m;
                case Enum e: return e.ToString();
                case Brush br: return br.ToCss();
                case Color c: return c.ToCss();
                case Thickness t: return t.ToString();
                case CornerRadius cr: return cr.ToString();
                case GridLength g: return g.ToString();
                case FontWeight fw: return fw.Weight;
                case FontStyle fs: return fs.ToString();
                case FontFamily ff: return ff.Source;
                case Point p: return p.ToString();
                case PointCollection pc: return pc.ToString();
                case DoubleCollection dc: return dc.ToString();
                case Geometry ge: return ge.Data;
                case Transform tr: return tr.ToCss();
                case ImageSource im: return im.UriString;
                case Uri u: return u.OriginalString;
                case TextDecorationCollection td: return td.ToString();
                case UIElement el: return new Dictionary<string, object?> { ["$el"] = el.Id };
                case System.Windows.Input.Cursor cu: return cu.Css;
                case TimeSpan ts: return ts.TotalMilliseconds;
                case DateTime dt: return dt.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                // 렌더러 전용 구조 데이터($events · $grid · $hover · $inlines): JSON 으로 그대로 보낸다
                case System.Collections.IDictionary dict:
                {
                    var d = new Dictionary<string, object?>();
                    foreach (System.Collections.DictionaryEntry kv in dict) d[kv.Key.ToString()!] = ToWire(kv.Value);
                    return d;
                }
                case System.Collections.IEnumerable seq when !(v is string):
                {
                    var l = new List<object?>();
                    foreach (var x in seq) l.Add(ToWire(x));
                    return l;
                }
                default: return v.ToString();
            }
        }
    }
}
