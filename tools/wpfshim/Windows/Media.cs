using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace System.Windows.Media.Animation
{
    /// <summary>값이 바뀌면 알리는 객체 (브러시 · 변환 등): 요소가 구독해 렌더러에 다시 보낸다</summary>
    public abstract class Animatable : DependencyObject, IChangeNotifier
    {
        public event Action? Changed;
        protected void OnChanged() => Changed?.Invoke();
        internal void ClearChanged() => Changed = null;
        public void BeginAnimation(DependencyProperty dp, AnimationTimeline? animation) => Animator.Begin(this, dp.Name, animation);
        public void BeginAnimation(DependencyProperty dp, AnimationTimeline? animation, HandoffBehavior handoff) => Animator.Begin(this, dp.Name, animation);
        public bool HasAnimatedProperties => false;
    }
    public enum HandoffBehavior { SnapshotAndReplace, Compose }
}

namespace System.Windows.Media
{
    /// <summary>내용이 바뀌었음을 알리는 객체</summary>
    public interface IChangeNotifier { event Action? Changed; }

    public struct Color : IEquatable<Color>
    {
        public byte A, R, G, B;
        public static Color FromArgb(byte a, byte r, byte g, byte b) => new Color { A = a, R = r, G = g, B = b };
        public static Color FromRgb(byte r, byte g, byte b) => new Color { A = 255, R = r, G = g, B = b };
        public static Color FromScRgb(float a, float r, float g, float b) => FromArgb((byte)(a * 255), (byte)(r * 255), (byte)(g * 255), (byte)(b * 255));
        public bool Equals(Color o) => A == o.A && R == o.R && G == o.G && B == o.B;
        public override bool Equals(object? obj) => obj is Color c && Equals(c);
        public override int GetHashCode() => HashCode.Combine(A, R, G, B);
        public static bool operator ==(Color a, Color b) => a.Equals(b);
        public static bool operator !=(Color a, Color b) => !a.Equals(b);
        public override string ToString() => $"#{A:X2}{R:X2}{G:X2}{B:X2}";
        /// <summary>CSS 색 문자열</summary>
        public string ToCss() => A == 255 ? $"#{R:X2}{G:X2}{B:X2}" : FormattableString.Invariant($"rgba({R},{G},{B},{A / 255.0:0.###})");
        public static Color Parse(string s)
        {
            s = s.Trim();
            if (s.StartsWith("#"))
            {
                var h = s.Substring(1);
                if (h.Length == 3) h = string.Concat(h[0], h[0], h[1], h[1], h[2], h[2]);
                if (h.Length == 6) return FromRgb(Hex(h, 0), Hex(h, 2), Hex(h, 4));
                if (h.Length == 8) return FromArgb(Hex(h, 0), Hex(h, 2), Hex(h, 4), Hex(h, 6));
                throw new FormatException("색 형식 오류: " + s);
            }
            if (Colors.TryGet(s, out var c)) return c;
            throw new FormatException("알 수 없는 색 이름: " + s);
        }
        private static byte Hex(string h, int i) => byte.Parse(h.Substring(i, 2), NumberStyles.HexNumber);
    }

    public static class ColorConverter
    {
        public static object ConvertFromString(string s) => Color.Parse(s);
    }

    public static class Colors
    {
        private static readonly Dictionary<string, uint> _map = new Dictionary<string, uint>(StringComparer.OrdinalIgnoreCase)
        {
            ["AliceBlue"] = 0xFFF0F8FF, ["AntiqueWhite"] = 0xFFFAEBD7, ["Aqua"] = 0xFF00FFFF, ["Aquamarine"] = 0xFF7FFFD4, ["Azure"] = 0xFFF0FFFF, ["Beige"] = 0xFFF5F5DC, ["Bisque"] = 0xFFFFE4C4, ["Black"] = 0xFF000000,
            ["BlanchedAlmond"] = 0xFFFFEBCD, ["Blue"] = 0xFF0000FF, ["BlueViolet"] = 0xFF8A2BE2, ["Brown"] = 0xFFA52A2A, ["BurlyWood"] = 0xFFDEB887, ["CadetBlue"] = 0xFF5F9EA0, ["Chartreuse"] = 0xFF7FFF00, ["Chocolate"] = 0xFFD2691E,
            ["Coral"] = 0xFFFF7F50, ["CornflowerBlue"] = 0xFF6495ED, ["Cornsilk"] = 0xFFFFF8DC, ["Crimson"] = 0xFFDC143C, ["Cyan"] = 0xFF00FFFF, ["DarkBlue"] = 0xFF00008B, ["DarkCyan"] = 0xFF008B8B, ["DarkGoldenrod"] = 0xFFB8860B,
            ["DarkGray"] = 0xFFA9A9A9, ["DarkGreen"] = 0xFF006400, ["DarkKhaki"] = 0xFFBDB76B, ["DarkMagenta"] = 0xFF8B008B, ["DarkOliveGreen"] = 0xFF556B2F, ["DarkOrange"] = 0xFFFF8C00, ["DarkOrchid"] = 0xFF9932CC, ["DarkRed"] = 0xFF8B0000,
            ["DarkSalmon"] = 0xFFE9967A, ["DarkSeaGreen"] = 0xFF8FBC8F, ["DarkSlateBlue"] = 0xFF483D8B, ["DarkSlateGray"] = 0xFF2F4F4F, ["DarkTurquoise"] = 0xFF00CED1, ["DarkViolet"] = 0xFF9400D3, ["DeepPink"] = 0xFFFF1493, ["DeepSkyBlue"] = 0xFF00BFFF,
            ["DimGray"] = 0xFF696969, ["DodgerBlue"] = 0xFF1E90FF, ["Firebrick"] = 0xFFB22222, ["FloralWhite"] = 0xFFFFFAF0, ["ForestGreen"] = 0xFF228B22, ["Fuchsia"] = 0xFFFF00FF, ["Gainsboro"] = 0xFFDCDCDC, ["GhostWhite"] = 0xFFF8F8FF,
            ["Gold"] = 0xFFFFD700, ["Goldenrod"] = 0xFFDAA520, ["Gray"] = 0xFF808080, ["Green"] = 0xFF008000, ["GreenYellow"] = 0xFFADFF2F, ["Honeydew"] = 0xFFF0FFF0, ["HotPink"] = 0xFFFF69B4, ["IndianRed"] = 0xFFCD5C5C,
            ["Indigo"] = 0xFF4B0082, ["Ivory"] = 0xFFFFFFF0, ["Khaki"] = 0xFFF0E68C, ["Lavender"] = 0xFFE6E6FA, ["LavenderBlush"] = 0xFFFFF0F5, ["LawnGreen"] = 0xFF7CFC00, ["LemonChiffon"] = 0xFFFFFACD, ["LightBlue"] = 0xFFADD8E6,
            ["LightCoral"] = 0xFFF08080, ["LightCyan"] = 0xFFE0FFFF, ["LightGoldenrodYellow"] = 0xFFFAFAD2, ["LightGray"] = 0xFFD3D3D3, ["LightGreen"] = 0xFF90EE90, ["LightPink"] = 0xFFFFB6C1, ["LightSalmon"] = 0xFFFFA07A, ["LightSeaGreen"] = 0xFF20B2AA,
            ["LightSkyBlue"] = 0xFF87CEFA, ["LightSlateGray"] = 0xFF778899, ["LightSteelBlue"] = 0xFFB0C4DE, ["LightYellow"] = 0xFFFFFFE0, ["Lime"] = 0xFF00FF00, ["LimeGreen"] = 0xFF32CD32, ["Linen"] = 0xFFFAF0E6, ["Magenta"] = 0xFFFF00FF,
            ["Maroon"] = 0xFF800000, ["MediumAquamarine"] = 0xFF66CDAA, ["MediumBlue"] = 0xFF0000CD, ["MediumOrchid"] = 0xFFBA55D3, ["MediumPurple"] = 0xFF9370DB, ["MediumSeaGreen"] = 0xFF3CB371, ["MediumSlateBlue"] = 0xFF7B68EE, ["MediumSpringGreen"] = 0xFF00FA9A,
            ["MediumTurquoise"] = 0xFF48D1CC, ["MediumVioletRed"] = 0xFFC71585, ["MidnightBlue"] = 0xFF191970, ["MintCream"] = 0xFFF5FFFA, ["MistyRose"] = 0xFFFFE4E1, ["Moccasin"] = 0xFFFFE4B5, ["NavajoWhite"] = 0xFFFFDEAD, ["Navy"] = 0xFF000080,
            ["OldLace"] = 0xFFFDF5E6, ["Olive"] = 0xFF808000, ["OliveDrab"] = 0xFF6B8E23, ["Orange"] = 0xFFFFA500, ["OrangeRed"] = 0xFFFF4500, ["Orchid"] = 0xFFDA70D6, ["PaleGoldenrod"] = 0xFFEEE8AA, ["PaleGreen"] = 0xFF98FB98,
            ["PaleTurquoise"] = 0xFFAFEEEE, ["PaleVioletRed"] = 0xFFDB7093, ["PapayaWhip"] = 0xFFFFEFD5, ["PeachPuff"] = 0xFFFFDAB9, ["Peru"] = 0xFFCD853F, ["Pink"] = 0xFFFFC0CB, ["Plum"] = 0xFFDDA0DD, ["PowderBlue"] = 0xFFB0E0E6,
            ["Purple"] = 0xFF800080, ["Red"] = 0xFFFF0000, ["RosyBrown"] = 0xFFBC8F8F, ["RoyalBlue"] = 0xFF4169E1, ["SaddleBrown"] = 0xFF8B4513, ["Salmon"] = 0xFFFA8072, ["SandyBrown"] = 0xFFF4A460, ["SeaGreen"] = 0xFF2E8B57,
            ["SeaShell"] = 0xFFFFF5EE, ["Sienna"] = 0xFFA0522D, ["Silver"] = 0xFFC0C0C0, ["SkyBlue"] = 0xFF87CEEB, ["SlateBlue"] = 0xFF6A5ACD, ["SlateGray"] = 0xFF708090, ["Snow"] = 0xFFFFFAFA, ["SpringGreen"] = 0xFF00FF7F,
            ["SteelBlue"] = 0xFF4682B4, ["Tan"] = 0xFFD2B48C, ["Teal"] = 0xFF008080, ["Thistle"] = 0xFFD8BFD8, ["Tomato"] = 0xFFFF6347, ["Transparent"] = 0x00FFFFFF, ["Turquoise"] = 0xFF40E0D0, ["Violet"] = 0xFFEE82EE,
            ["Wheat"] = 0xFFF5DEB3, ["White"] = 0xFFFFFFFF, ["WhiteSmoke"] = 0xFFF5F5F5, ["Yellow"] = 0xFFFFFF00, ["YellowGreen"] = 0xFF9ACD32
        };
        public static IEnumerable<string> Names => _map.Keys;
        public static bool TryGet(string name, out Color c)
        {
            if (_map.TryGetValue(name, out var v)) { c = Color.FromArgb((byte)(v >> 24), (byte)(v >> 16), (byte)(v >> 8), (byte)v); return true; }
            c = default; return false;
        }
        private static Color C(string n) { TryGet(n, out var c); return c; }
        public static Color AliceBlue => C("AliceBlue"); public static Color AntiqueWhite => C("AntiqueWhite"); public static Color Aqua => C("Aqua"); public static Color Aquamarine => C("Aquamarine"); public static Color Azure => C("Azure"); public static Color Beige => C("Beige"); public static Color Bisque => C("Bisque"); public static Color Black => C("Black");
        public static Color BlanchedAlmond => C("BlanchedAlmond"); public static Color Blue => C("Blue"); public static Color BlueViolet => C("BlueViolet"); public static Color Brown => C("Brown"); public static Color BurlyWood => C("BurlyWood"); public static Color CadetBlue => C("CadetBlue"); public static Color Chartreuse => C("Chartreuse"); public static Color Chocolate => C("Chocolate");
        public static Color Coral => C("Coral"); public static Color CornflowerBlue => C("CornflowerBlue"); public static Color Cornsilk => C("Cornsilk"); public static Color Crimson => C("Crimson"); public static Color Cyan => C("Cyan"); public static Color DarkBlue => C("DarkBlue"); public static Color DarkCyan => C("DarkCyan"); public static Color DarkGoldenrod => C("DarkGoldenrod");
        public static Color DarkGray => C("DarkGray"); public static Color DarkGreen => C("DarkGreen"); public static Color DarkKhaki => C("DarkKhaki"); public static Color DarkMagenta => C("DarkMagenta"); public static Color DarkOliveGreen => C("DarkOliveGreen"); public static Color DarkOrange => C("DarkOrange"); public static Color DarkOrchid => C("DarkOrchid"); public static Color DarkRed => C("DarkRed");
        public static Color DarkSalmon => C("DarkSalmon"); public static Color DarkSeaGreen => C("DarkSeaGreen"); public static Color DarkSlateBlue => C("DarkSlateBlue"); public static Color DarkSlateGray => C("DarkSlateGray"); public static Color DarkTurquoise => C("DarkTurquoise"); public static Color DarkViolet => C("DarkViolet"); public static Color DeepPink => C("DeepPink"); public static Color DeepSkyBlue => C("DeepSkyBlue");
        public static Color DimGray => C("DimGray"); public static Color DodgerBlue => C("DodgerBlue"); public static Color Firebrick => C("Firebrick"); public static Color FloralWhite => C("FloralWhite"); public static Color ForestGreen => C("ForestGreen"); public static Color Fuchsia => C("Fuchsia"); public static Color Gainsboro => C("Gainsboro"); public static Color GhostWhite => C("GhostWhite");
        public static Color Gold => C("Gold"); public static Color Goldenrod => C("Goldenrod"); public static Color Gray => C("Gray"); public static Color Green => C("Green"); public static Color GreenYellow => C("GreenYellow"); public static Color Honeydew => C("Honeydew"); public static Color HotPink => C("HotPink"); public static Color IndianRed => C("IndianRed");
        public static Color Indigo => C("Indigo"); public static Color Ivory => C("Ivory"); public static Color Khaki => C("Khaki"); public static Color Lavender => C("Lavender"); public static Color LavenderBlush => C("LavenderBlush"); public static Color LawnGreen => C("LawnGreen"); public static Color LemonChiffon => C("LemonChiffon"); public static Color LightBlue => C("LightBlue");
        public static Color LightCoral => C("LightCoral"); public static Color LightCyan => C("LightCyan"); public static Color LightGoldenrodYellow => C("LightGoldenrodYellow"); public static Color LightGray => C("LightGray"); public static Color LightGreen => C("LightGreen"); public static Color LightPink => C("LightPink"); public static Color LightSalmon => C("LightSalmon"); public static Color LightSeaGreen => C("LightSeaGreen");
        public static Color LightSkyBlue => C("LightSkyBlue"); public static Color LightSlateGray => C("LightSlateGray"); public static Color LightSteelBlue => C("LightSteelBlue"); public static Color LightYellow => C("LightYellow"); public static Color Lime => C("Lime"); public static Color LimeGreen => C("LimeGreen"); public static Color Linen => C("Linen"); public static Color Magenta => C("Magenta");
        public static Color Maroon => C("Maroon"); public static Color MediumAquamarine => C("MediumAquamarine"); public static Color MediumBlue => C("MediumBlue"); public static Color MediumOrchid => C("MediumOrchid"); public static Color MediumPurple => C("MediumPurple"); public static Color MediumSeaGreen => C("MediumSeaGreen"); public static Color MediumSlateBlue => C("MediumSlateBlue"); public static Color MediumSpringGreen => C("MediumSpringGreen");
        public static Color MediumTurquoise => C("MediumTurquoise"); public static Color MediumVioletRed => C("MediumVioletRed"); public static Color MidnightBlue => C("MidnightBlue"); public static Color MintCream => C("MintCream"); public static Color MistyRose => C("MistyRose"); public static Color Moccasin => C("Moccasin"); public static Color NavajoWhite => C("NavajoWhite"); public static Color Navy => C("Navy");
        public static Color OldLace => C("OldLace"); public static Color Olive => C("Olive"); public static Color OliveDrab => C("OliveDrab"); public static Color Orange => C("Orange"); public static Color OrangeRed => C("OrangeRed"); public static Color Orchid => C("Orchid"); public static Color PaleGoldenrod => C("PaleGoldenrod"); public static Color PaleGreen => C("PaleGreen");
        public static Color PaleTurquoise => C("PaleTurquoise"); public static Color PaleVioletRed => C("PaleVioletRed"); public static Color PapayaWhip => C("PapayaWhip"); public static Color PeachPuff => C("PeachPuff"); public static Color Peru => C("Peru"); public static Color Pink => C("Pink"); public static Color Plum => C("Plum"); public static Color PowderBlue => C("PowderBlue");
        public static Color Purple => C("Purple"); public static Color Red => C("Red"); public static Color RosyBrown => C("RosyBrown"); public static Color RoyalBlue => C("RoyalBlue"); public static Color SaddleBrown => C("SaddleBrown"); public static Color Salmon => C("Salmon"); public static Color SandyBrown => C("SandyBrown"); public static Color SeaGreen => C("SeaGreen");
        public static Color SeaShell => C("SeaShell"); public static Color Sienna => C("Sienna"); public static Color Silver => C("Silver"); public static Color SkyBlue => C("SkyBlue"); public static Color SlateBlue => C("SlateBlue"); public static Color SlateGray => C("SlateGray"); public static Color Snow => C("Snow"); public static Color SpringGreen => C("SpringGreen");
        public static Color SteelBlue => C("SteelBlue"); public static Color Tan => C("Tan"); public static Color Teal => C("Teal"); public static Color Thistle => C("Thistle"); public static Color Tomato => C("Tomato"); public static Color Transparent => C("Transparent"); public static Color Turquoise => C("Turquoise"); public static Color Violet => C("Violet");
        public static Color Wheat => C("Wheat"); public static Color White => C("White"); public static Color WhiteSmoke => C("WhiteSmoke"); public static Color Yellow => C("Yellow"); public static Color YellowGreen => C("YellowGreen");
    }

    // ------------------------------------------------------------------ 브러시
    public abstract class Brush : Animation.Animatable
    {
        public static readonly DependencyProperty OpacityProperty = DependencyProperty.Register("Opacity", typeof(double), typeof(Brush));
        private double _opacity = 1;
        public double Opacity { get => _opacity; set { _opacity = value; OnChanged(); } }
        /// <summary>CSS background/color 값</summary>
        public abstract string ToCss();
        public override string ToString() => ToCss();
        public static Brush Parse(string s)
        {
            s = s.Trim();
            if (s.StartsWith("{")) throw new FormatException("마크업 확장은 여기서 처리하지 않습니다: " + s);
            return new SolidColorBrush(Color.Parse(s));
        }
        public Brush Clone() { var b = (Brush)MemberwiseClone(); b.ClearChanged(); return b; }
        public void Freeze() { }
        public bool IsFrozen => false;
        public bool CanFreeze => true;
    }
    public class BrushConverter { public object ConvertFromString(string s) => Brush.Parse(s); public object ConvertFrom(object v) => Brush.Parse(v.ToString()!); }

    public class SolidColorBrush : Brush
    {
        public static readonly DependencyProperty ColorProperty = DependencyProperty.Register("Color", typeof(Color), typeof(SolidColorBrush));
        private Color _color;
        public Color Color { get => _color; set { _color = value; OnChanged(); } }
        public SolidColorBrush() { Color = Colors.Transparent; }
        public SolidColorBrush(Color color) { Color = color; }
        public override string ToCss() => Opacity >= 1 ? Color.ToCss() : FormattableString.Invariant($"rgba({Color.R},{Color.G},{Color.B},{Color.A / 255.0 * Opacity:0.###})");
    }

    public class GradientStop
    {
        public Color Color { get; set; }
        public double Offset { get; set; }
        public GradientStop() { }
        public GradientStop(Color color, double offset) { Color = color; Offset = offset; }
    }
    public class GradientStopCollection : List<GradientStop> { }
    [Markup.ContentProperty("GradientStops")]
    public abstract class GradientBrush : Brush
    {
        public GradientStopCollection GradientStops { get; set; } = new GradientStopCollection();
        protected string Stops() { var sb = new StringBuilder(); foreach (var g in GradientStops) { if (sb.Length > 0) sb.Append(", "); sb.Append(g.Color.ToCss()).Append(' ').Append((g.Offset * 100).ToString("0.#", CultureInfo.InvariantCulture)).Append('%'); } return sb.ToString(); }
    }
    public class LinearGradientBrush : GradientBrush
    {
        public Point StartPoint { get; set; } = new Point(0, 0);
        public Point EndPoint { get; set; } = new Point(1, 1);
        public LinearGradientBrush() { }
        public LinearGradientBrush(Color start, Color end, double angle) { GradientStops.Add(new GradientStop(start, 0)); GradientStops.Add(new GradientStop(end, 1)); var r = angle * Math.PI / 180; StartPoint = new Point(0, 0); EndPoint = new Point(Math.Cos(r), Math.Sin(r)); }
        public LinearGradientBrush(Color start, Color end, Point s, Point e) { GradientStops.Add(new GradientStop(start, 0)); GradientStops.Add(new GradientStop(end, 1)); StartPoint = s; EndPoint = e; }
        public LinearGradientBrush(GradientStopCollection stops) { GradientStops = stops; }
        public LinearGradientBrush(GradientStopCollection stops, double angle) : this() { GradientStops = stops; var r = angle * Math.PI / 180; EndPoint = new Point(Math.Cos(r), Math.Sin(r)); }
        public override string ToCss()
        {
            double dx = EndPoint.X - StartPoint.X, dy = EndPoint.Y - StartPoint.Y;
            var deg = Math.Atan2(dy, dx) * 180 / Math.PI + 90;   // CSS 는 위쪽이 0deg
            return FormattableString.Invariant($"linear-gradient({deg:0.#}deg, {Stops()})");
        }
    }
    public class RadialGradientBrush : GradientBrush
    {
        public Point Center { get; set; } = new Point(0.5, 0.5);
        public Point GradientOrigin { get; set; } = new Point(0.5, 0.5);
        public double RadiusX { get; set; } = 0.5;
        public double RadiusY { get; set; } = 0.5;
        public RadialGradientBrush() { }
        public RadialGradientBrush(Color start, Color end) { GradientStops.Add(new GradientStop(start, 0)); GradientStops.Add(new GradientStop(end, 1)); }
        public override string ToCss() => FormattableString.Invariant($"radial-gradient(ellipse {RadiusX * 100:0.#}% {RadiusY * 100:0.#}% at {Center.X * 100:0.#}% {Center.Y * 100:0.#}%, {Stops()})");
    }
    public class ImageBrush : Brush
    {
        public ImageSource? ImageSource { get; set; }
        public Stretch Stretch { get; set; } = Stretch.Fill;
        public ImageBrush() { }
        public ImageBrush(ImageSource src) { ImageSource = src; }
        public override string ToCss() => ImageSource == null ? "transparent" : $"url(\"{ImageSource.UriString}\") center / {(Stretch == Stretch.Uniform ? "contain" : Stretch == Stretch.UniformToFill ? "cover" : Stretch == Stretch.None ? "auto" : "100% 100%")} no-repeat";
    }

    public static class Brushes
    {
        private static SolidColorBrush B(string n) { Colors.TryGet(n, out var c); return new SolidColorBrush(c); }
        public static SolidColorBrush AliceBlue => B("AliceBlue"); public static SolidColorBrush AntiqueWhite => B("AntiqueWhite"); public static SolidColorBrush Aqua => B("Aqua"); public static SolidColorBrush Aquamarine => B("Aquamarine"); public static SolidColorBrush Azure => B("Azure"); public static SolidColorBrush Beige => B("Beige"); public static SolidColorBrush Bisque => B("Bisque"); public static SolidColorBrush Black => B("Black");
        public static SolidColorBrush BlanchedAlmond => B("BlanchedAlmond"); public static SolidColorBrush Blue => B("Blue"); public static SolidColorBrush BlueViolet => B("BlueViolet"); public static SolidColorBrush Brown => B("Brown"); public static SolidColorBrush BurlyWood => B("BurlyWood"); public static SolidColorBrush CadetBlue => B("CadetBlue"); public static SolidColorBrush Chartreuse => B("Chartreuse"); public static SolidColorBrush Chocolate => B("Chocolate");
        public static SolidColorBrush Coral => B("Coral"); public static SolidColorBrush CornflowerBlue => B("CornflowerBlue"); public static SolidColorBrush Cornsilk => B("Cornsilk"); public static SolidColorBrush Crimson => B("Crimson"); public static SolidColorBrush Cyan => B("Cyan"); public static SolidColorBrush DarkBlue => B("DarkBlue"); public static SolidColorBrush DarkCyan => B("DarkCyan"); public static SolidColorBrush DarkGoldenrod => B("DarkGoldenrod");
        public static SolidColorBrush DarkGray => B("DarkGray"); public static SolidColorBrush DarkGreen => B("DarkGreen"); public static SolidColorBrush DarkKhaki => B("DarkKhaki"); public static SolidColorBrush DarkMagenta => B("DarkMagenta"); public static SolidColorBrush DarkOliveGreen => B("DarkOliveGreen"); public static SolidColorBrush DarkOrange => B("DarkOrange"); public static SolidColorBrush DarkOrchid => B("DarkOrchid"); public static SolidColorBrush DarkRed => B("DarkRed");
        public static SolidColorBrush DarkSalmon => B("DarkSalmon"); public static SolidColorBrush DarkSeaGreen => B("DarkSeaGreen"); public static SolidColorBrush DarkSlateBlue => B("DarkSlateBlue"); public static SolidColorBrush DarkSlateGray => B("DarkSlateGray"); public static SolidColorBrush DarkTurquoise => B("DarkTurquoise"); public static SolidColorBrush DarkViolet => B("DarkViolet"); public static SolidColorBrush DeepPink => B("DeepPink"); public static SolidColorBrush DeepSkyBlue => B("DeepSkyBlue");
        public static SolidColorBrush DimGray => B("DimGray"); public static SolidColorBrush DodgerBlue => B("DodgerBlue"); public static SolidColorBrush Firebrick => B("Firebrick"); public static SolidColorBrush FloralWhite => B("FloralWhite"); public static SolidColorBrush ForestGreen => B("ForestGreen"); public static SolidColorBrush Fuchsia => B("Fuchsia"); public static SolidColorBrush Gainsboro => B("Gainsboro"); public static SolidColorBrush GhostWhite => B("GhostWhite");
        public static SolidColorBrush Gold => B("Gold"); public static SolidColorBrush Goldenrod => B("Goldenrod"); public static SolidColorBrush Gray => B("Gray"); public static SolidColorBrush Green => B("Green"); public static SolidColorBrush GreenYellow => B("GreenYellow"); public static SolidColorBrush Honeydew => B("Honeydew"); public static SolidColorBrush HotPink => B("HotPink"); public static SolidColorBrush IndianRed => B("IndianRed");
        public static SolidColorBrush Indigo => B("Indigo"); public static SolidColorBrush Ivory => B("Ivory"); public static SolidColorBrush Khaki => B("Khaki"); public static SolidColorBrush Lavender => B("Lavender"); public static SolidColorBrush LavenderBlush => B("LavenderBlush"); public static SolidColorBrush LawnGreen => B("LawnGreen"); public static SolidColorBrush LemonChiffon => B("LemonChiffon"); public static SolidColorBrush LightBlue => B("LightBlue");
        public static SolidColorBrush LightCoral => B("LightCoral"); public static SolidColorBrush LightCyan => B("LightCyan"); public static SolidColorBrush LightGoldenrodYellow => B("LightGoldenrodYellow"); public static SolidColorBrush LightGray => B("LightGray"); public static SolidColorBrush LightGreen => B("LightGreen"); public static SolidColorBrush LightPink => B("LightPink"); public static SolidColorBrush LightSalmon => B("LightSalmon"); public static SolidColorBrush LightSeaGreen => B("LightSeaGreen");
        public static SolidColorBrush LightSkyBlue => B("LightSkyBlue"); public static SolidColorBrush LightSlateGray => B("LightSlateGray"); public static SolidColorBrush LightSteelBlue => B("LightSteelBlue"); public static SolidColorBrush LightYellow => B("LightYellow"); public static SolidColorBrush Lime => B("Lime"); public static SolidColorBrush LimeGreen => B("LimeGreen"); public static SolidColorBrush Linen => B("Linen"); public static SolidColorBrush Magenta => B("Magenta");
        public static SolidColorBrush Maroon => B("Maroon"); public static SolidColorBrush MediumAquamarine => B("MediumAquamarine"); public static SolidColorBrush MediumBlue => B("MediumBlue"); public static SolidColorBrush MediumOrchid => B("MediumOrchid"); public static SolidColorBrush MediumPurple => B("MediumPurple"); public static SolidColorBrush MediumSeaGreen => B("MediumSeaGreen"); public static SolidColorBrush MediumSlateBlue => B("MediumSlateBlue"); public static SolidColorBrush MediumSpringGreen => B("MediumSpringGreen");
        public static SolidColorBrush MediumTurquoise => B("MediumTurquoise"); public static SolidColorBrush MediumVioletRed => B("MediumVioletRed"); public static SolidColorBrush MidnightBlue => B("MidnightBlue"); public static SolidColorBrush MintCream => B("MintCream"); public static SolidColorBrush MistyRose => B("MistyRose"); public static SolidColorBrush Moccasin => B("Moccasin"); public static SolidColorBrush NavajoWhite => B("NavajoWhite"); public static SolidColorBrush Navy => B("Navy");
        public static SolidColorBrush OldLace => B("OldLace"); public static SolidColorBrush Olive => B("Olive"); public static SolidColorBrush OliveDrab => B("OliveDrab"); public static SolidColorBrush Orange => B("Orange"); public static SolidColorBrush OrangeRed => B("OrangeRed"); public static SolidColorBrush Orchid => B("Orchid"); public static SolidColorBrush PaleGoldenrod => B("PaleGoldenrod"); public static SolidColorBrush PaleGreen => B("PaleGreen");
        public static SolidColorBrush PaleTurquoise => B("PaleTurquoise"); public static SolidColorBrush PaleVioletRed => B("PaleVioletRed"); public static SolidColorBrush PapayaWhip => B("PapayaWhip"); public static SolidColorBrush PeachPuff => B("PeachPuff"); public static SolidColorBrush Peru => B("Peru"); public static SolidColorBrush Pink => B("Pink"); public static SolidColorBrush Plum => B("Plum"); public static SolidColorBrush PowderBlue => B("PowderBlue");
        public static SolidColorBrush Purple => B("Purple"); public static SolidColorBrush Red => B("Red"); public static SolidColorBrush RosyBrown => B("RosyBrown"); public static SolidColorBrush RoyalBlue => B("RoyalBlue"); public static SolidColorBrush SaddleBrown => B("SaddleBrown"); public static SolidColorBrush Salmon => B("Salmon"); public static SolidColorBrush SandyBrown => B("SandyBrown"); public static SolidColorBrush SeaGreen => B("SeaGreen");
        public static SolidColorBrush SeaShell => B("SeaShell"); public static SolidColorBrush Sienna => B("Sienna"); public static SolidColorBrush Silver => B("Silver"); public static SolidColorBrush SkyBlue => B("SkyBlue"); public static SolidColorBrush SlateBlue => B("SlateBlue"); public static SolidColorBrush SlateGray => B("SlateGray"); public static SolidColorBrush Snow => B("Snow"); public static SolidColorBrush SpringGreen => B("SpringGreen");
        public static SolidColorBrush SteelBlue => B("SteelBlue"); public static SolidColorBrush Tan => B("Tan"); public static SolidColorBrush Teal => B("Teal"); public static SolidColorBrush Thistle => B("Thistle"); public static SolidColorBrush Tomato => B("Tomato"); public static SolidColorBrush Transparent => B("Transparent"); public static SolidColorBrush Turquoise => B("Turquoise"); public static SolidColorBrush Violet => B("Violet");
        public static SolidColorBrush Wheat => B("Wheat"); public static SolidColorBrush White => B("White"); public static SolidColorBrush WhiteSmoke => B("WhiteSmoke"); public static SolidColorBrush Yellow => B("Yellow"); public static SolidColorBrush YellowGreen => B("YellowGreen");
    }

    public class FontFamily
    {
        public string Source { get; }
        public FontFamily() { Source = "Segoe UI"; }
        public FontFamily(string source) { Source = source; }
        public override string ToString() => Source;
    }
    public enum Stretch { None, Fill, Uniform, UniformToFill }
    public enum PenLineCap { Flat, Square, Round, Triangle }
    public enum PenLineJoin { Miter, Bevel, Round }
    public enum FillRule { EvenOdd, Nonzero }

    /// <summary>점 목록: Add · 인덱서로 바꾸면 도형이 다시 그려진다</summary>
    public class PointCollection : System.Collections.ObjectModel.Collection<Point>, IChangeNotifier
    {
        public event Action? Changed;
        public PointCollection() { }
        public PointCollection(int capacity) { }
        public PointCollection(IEnumerable<Point> pts) { foreach (var p in pts) Items.Add(p); }
        protected override void InsertItem(int index, Point item) { base.InsertItem(index, item); Changed?.Invoke(); }
        protected override void SetItem(int index, Point item) { base.SetItem(index, item); Changed?.Invoke(); }
        protected override void RemoveItem(int index) { base.RemoveItem(index); Changed?.Invoke(); }
        protected override void ClearItems() { base.ClearItems(); Changed?.Invoke(); }
        public PointCollection Clone() => new PointCollection(this);
        public void Freeze() { }
        public override string ToString() { var sb = new StringBuilder(); foreach (var p in Items) { if (sb.Length > 0) sb.Append(' '); sb.Append(p.ToString()); } return sb.ToString(); }
        public static PointCollection Parse(string s)
        {
            var pc = new PointCollection();
            var nums = s.Split(new[] { ',', ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i + 1 < nums.Length; i += 2) pc.Add(new Point(double.Parse(nums[i], CultureInfo.InvariantCulture), double.Parse(nums[i + 1], CultureInfo.InvariantCulture)));
            return pc;
        }
    }
    public class DoubleCollection : List<double>
    {
        public DoubleCollection() { }
        public DoubleCollection(IEnumerable<double> v) : base(v) { }
        public override string ToString() => string.Join(" ", ConvertAll(d => d.ToString(CultureInfo.InvariantCulture)));
        public static DoubleCollection Parse(string s) { var c = new DoubleCollection(); foreach (var p in s.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)) c.Add(double.Parse(p, CultureInfo.InvariantCulture)); return c; }
    }

    /// <summary>경로 데이터: SVG 와 같은 미니 언어 문자열을 그대로 쓴다</summary>
    public class Geometry
    {
        public string Data { get; set; } = "";
        public static Geometry Parse(string s) => new PathGeometry { Data = s };
        public override string ToString() => Data;
        public Rect Bounds => new Rect(0, 0, 0, 0);
    }
    public class PathGeometry : Geometry { }
    public class StreamGeometry : Geometry { }
    public class RectangleGeometry : Geometry
    {
        public Rect Rect { get; set; }
        public double RadiusX { get; set; }
        public double RadiusY { get; set; }
        public RectangleGeometry() { }
        public RectangleGeometry(Rect r) { Rect = r; Data = FormattableString.Invariant($"M{r.X},{r.Y} h{r.Width} v{r.Height} h{-r.Width} z"); }
    }
    public class EllipseGeometry : Geometry
    {
        public Point Center { get; set; }
        public double RadiusX { get; set; }
        public double RadiusY { get; set; }
        public EllipseGeometry() { }
        public EllipseGeometry(Point c, double rx, double ry) { Center = c; RadiusX = rx; RadiusY = ry; Data = FormattableString.Invariant($"M{c.X - rx},{c.Y} a{rx},{ry} 0 1,0 {rx * 2},0 a{rx},{ry} 0 1,0 {-rx * 2},0"); }
    }
    public class LineGeometry : Geometry
    {
        public Point StartPoint { get; set; }
        public Point EndPoint { get; set; }
        public LineGeometry() { }
        public LineGeometry(Point a, Point b) { StartPoint = a; EndPoint = b; Data = FormattableString.Invariant($"M{a.X},{a.Y} L{b.X},{b.Y}"); }
    }

    // ------------------------------------------------------------------ 변환
    public abstract class Transform : Animation.Animatable
    {
        public abstract string ToCss();
        public override string ToString() => ToCss();
        public static Transform Identity => new MatrixTransform();
        public static Transform Parse(string s) => new MatrixTransform();
        protected static string F(double v) => v.ToString("0.####", CultureInfo.InvariantCulture);
        /// <summary>중심점(CenterX/Y) 기준 변환: 옮기고 → 변환 → 되돌리기</summary>
        protected static string Around(double cx, double cy, string t) => cx == 0 && cy == 0 ? t : $"translate({F(cx)}px,{F(cy)}px) {t} translate({F(-cx)}px,{F(-cy)}px)";
        public Transform Clone() { var t = (Transform)MemberwiseClone(); t.ClearChanged(); return t; }
        public Transform Inverse => new MatrixTransform();
    }
    public class MatrixTransform : Transform { public override string ToCss() => "none"; }
    public class RotateTransform : Transform
    {
        public static readonly DependencyProperty AngleProperty = DependencyProperty.Register("Angle", typeof(double), typeof(RotateTransform));
        public static readonly DependencyProperty CenterXProperty = DependencyProperty.Register("CenterX", typeof(double), typeof(RotateTransform));
        public static readonly DependencyProperty CenterYProperty = DependencyProperty.Register("CenterY", typeof(double), typeof(RotateTransform));
        private double _a, _cx, _cy;
        public double Angle { get => _a; set { _a = value; OnChanged(); } }
        public double CenterX { get => _cx; set { _cx = value; OnChanged(); } }
        public double CenterY { get => _cy; set { _cy = value; OnChanged(); } }
        public RotateTransform() { }
        public RotateTransform(double angle) { _a = angle; }
        public RotateTransform(double angle, double cx, double cy) { _a = angle; _cx = cx; _cy = cy; }
        public override string ToCss() => Around(_cx, _cy, $"rotate({F(_a)}deg)");
    }
    public class ScaleTransform : Transform
    {
        public static readonly DependencyProperty ScaleXProperty = DependencyProperty.Register("ScaleX", typeof(double), typeof(ScaleTransform));
        public static readonly DependencyProperty ScaleYProperty = DependencyProperty.Register("ScaleY", typeof(double), typeof(ScaleTransform));
        public static readonly DependencyProperty CenterXProperty = DependencyProperty.Register("CenterX", typeof(double), typeof(ScaleTransform));
        public static readonly DependencyProperty CenterYProperty = DependencyProperty.Register("CenterY", typeof(double), typeof(ScaleTransform));
        private double _sx = 1, _sy = 1, _cx, _cy;
        public double ScaleX { get => _sx; set { _sx = value; OnChanged(); } }
        public double ScaleY { get => _sy; set { _sy = value; OnChanged(); } }
        public double CenterX { get => _cx; set { _cx = value; OnChanged(); } }
        public double CenterY { get => _cy; set { _cy = value; OnChanged(); } }
        public ScaleTransform() { }
        public ScaleTransform(double sx, double sy) { _sx = sx; _sy = sy; }
        public ScaleTransform(double sx, double sy, double cx, double cy) { _sx = sx; _sy = sy; _cx = cx; _cy = cy; }
        public override string ToCss() => Around(_cx, _cy, $"scale({F(_sx)},{F(_sy)})");
    }
    public class TranslateTransform : Transform
    {
        public static readonly DependencyProperty XProperty = DependencyProperty.Register("X", typeof(double), typeof(TranslateTransform));
        public static readonly DependencyProperty YProperty = DependencyProperty.Register("Y", typeof(double), typeof(TranslateTransform));
        private double _x, _y;
        public double X { get => _x; set { _x = value; OnChanged(); } }
        public double Y { get => _y; set { _y = value; OnChanged(); } }
        public TranslateTransform() { }
        public TranslateTransform(double x, double y) { _x = x; _y = y; }
        public override string ToCss() => $"translate({F(_x)}px,{F(_y)}px)";
    }
    public class SkewTransform : Transform
    {
        public static readonly DependencyProperty AngleXProperty = DependencyProperty.Register("AngleX", typeof(double), typeof(SkewTransform));
        public static readonly DependencyProperty AngleYProperty = DependencyProperty.Register("AngleY", typeof(double), typeof(SkewTransform));
        private double _ax, _ay, _cx, _cy;
        public double AngleX { get => _ax; set { _ax = value; OnChanged(); } }
        public double AngleY { get => _ay; set { _ay = value; OnChanged(); } }
        public double CenterX { get => _cx; set { _cx = value; OnChanged(); } }
        public double CenterY { get => _cy; set { _cy = value; OnChanged(); } }
        public SkewTransform() { }
        public SkewTransform(double ax, double ay) { _ax = ax; _ay = ay; }
        public override string ToCss() => Around(_cx, _cy, $"skew({F(_ax)}deg,{F(_ay)}deg)");
    }
    public class TransformCollection : System.Collections.ObjectModel.Collection<Transform>
    {
        internal Action? Changed;
        private void Child() => Changed?.Invoke();
        protected override void InsertItem(int index, Transform item) { base.InsertItem(index, item); item.Changed += Child; Changed?.Invoke(); }
        protected override void SetItem(int index, Transform item) { this[index].Changed -= Child; base.SetItem(index, item); item.Changed += Child; Changed?.Invoke(); }
        protected override void RemoveItem(int index) { this[index].Changed -= Child; base.RemoveItem(index); Changed?.Invoke(); }
        protected override void ClearItems() { foreach (var t in Items) t.Changed -= Child; base.ClearItems(); Changed?.Invoke(); }
    }
    [Markup.ContentProperty("Children")]
    public class TransformGroup : Transform
    {
        private TransformCollection _children = null!;
        public TransformGroup() { Children = new TransformCollection(); }
        public TransformCollection Children { get => _children; set { if (_children != null) _children.Changed = null; _children = value; _children.Changed = OnChanged; OnChanged(); } }
        // WPF 는 첫 자식부터 차례로 적용하고, CSS transform 목록은 오른쪽 것부터 적용하므로 순서를 뒤집는다
        public override string ToCss() { var sb = new StringBuilder(); for (int i = _children.Count - 1; i >= 0; i--) { var c = _children[i].ToCss(); if (c == "none") continue; if (sb.Length > 0) sb.Append(' '); sb.Append(c); } return sb.Length == 0 ? "none" : sb.ToString(); }
    }

    public abstract class ImageSource
    {
        public abstract string UriString { get; }
        public double Width => 0;
        public double Height => 0;
        public override string ToString() => UriString;
    }
    public static class VisualTreeHelper
    {
        public static DependencyObject? GetParent(DependencyObject d) => (d as FrameworkElement)?.Parent;
        public static int GetChildrenCount(DependencyObject d) => (d as Controls.Panel)?.Children.Count ?? ((d as Controls.ContentControl)?.Content is UIElement ? 1 : 0);
        public static DependencyObject? GetChild(DependencyObject d, int i) => d is Controls.Panel p ? p.Children[i] : (d as Controls.ContentControl)?.Content as UIElement;
    }
    public class DrawingContext { }
    public class Visual : DependencyObject { }
    public class Pen
    {
        public Brush? Brush { get; set; }
        public double Thickness { get; set; } = 1;
        public Pen() { }
        public Pen(Brush b, double t) { Brush = b; Thickness = t; }
    }
}

namespace System.Windows.Media.Imaging
{
    public class BitmapImage : ImageSource
    {
        public Uri? UriSource { get; set; }
        public BitmapImage() { }
        public BitmapImage(Uri uri) { UriSource = uri; }
        public void BeginInit() { }
        public void EndInit() { }
        public int PixelWidth => 0;
        public int PixelHeight => 0;
        public override string UriString => UriSource?.OriginalString ?? "";
    }
    public class BitmapSource : ImageSource { public override string UriString => ""; }
    public class WriteableBitmap : BitmapSource { }
}
