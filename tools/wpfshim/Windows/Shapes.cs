using System;
using System.Windows.Media;

namespace System.Windows.Shapes
{
    public abstract class Shape : FrameworkElement
    {
        public static readonly DependencyProperty FillProperty = DependencyProperty.Register("Fill", typeof(Brush), typeof(Shape));
        public static readonly DependencyProperty StrokeProperty = DependencyProperty.Register("Stroke", typeof(Brush), typeof(Shape));
        public static readonly DependencyProperty StrokeThicknessProperty = DependencyProperty.Register("StrokeThickness", typeof(double), typeof(Shape));
        public Brush? Fill { get => Get<Brush?>("Fill"); set => Set("Fill", value); }
        public Brush? Stroke { get => Get<Brush?>("Stroke"); set => Set("Stroke", value); }
        public double StrokeThickness { get => Get("StrokeThickness", 1.0); set => Set("StrokeThickness", value); }
        public DoubleCollection? StrokeDashArray { get => Get<DoubleCollection?>("StrokeDashArray"); set => Set("StrokeDashArray", value); }
        public PenLineCap StrokeStartLineCap { get => Get("StrokeStartLineCap", PenLineCap.Flat); set => Set("StrokeStartLineCap", value); }
        public PenLineCap StrokeEndLineCap { get => Get("StrokeEndLineCap", PenLineCap.Flat); set => Set("StrokeEndLineCap", value); }
        public PenLineJoin StrokeLineJoin { get => Get("StrokeLineJoin", PenLineJoin.Miter); set => Set("StrokeLineJoin", value); }
        public Stretch Stretch { get => Get("Stretch", Stretch.None); set => Set("Stretch", value); }
        public Geometry? RenderedGeometry => null;
    }
    public class Rectangle : Shape
    {
        public double RadiusX { get => Get("RadiusX", 0.0); set => Set("RadiusX", value); }
        public double RadiusY { get => Get("RadiusY", 0.0); set => Set("RadiusY", value); }
    }
    public class Ellipse : Shape { }
    public class Line : Shape
    {
        public double X1 { get => Get("X1", 0.0); set => Set("X1", value); }
        public double Y1 { get => Get("Y1", 0.0); set => Set("Y1", value); }
        public double X2 { get => Get("X2", 0.0); set => Set("X2", value); }
        public double Y2 { get => Get("Y2", 0.0); set => Set("Y2", value); }
    }
    public class Polygon : Shape
    {
        public PointCollection Points { get => Get("Points", new PointCollection()); set => Set("Points", value); }
        public FillRule FillRule { get => Get("FillRule", FillRule.EvenOdd); set => Set("FillRule", value); }
    }
    public class Polyline : Shape
    {
        public PointCollection Points { get => Get("Points", new PointCollection()); set => Set("Points", value); }
        public FillRule FillRule { get => Get("FillRule", FillRule.EvenOdd); set => Set("FillRule", value); }
    }
    public class Path : Shape
    {
        public Geometry? Data { get => Get<Geometry?>("Data"); set => Set("Data", value); }
    }
}
