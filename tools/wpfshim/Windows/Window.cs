using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media;
using WpfShim;

namespace System.Windows
{
    public class Window : ContentControl
    {
        public static readonly DependencyProperty TitleProperty = DependencyProperty.Register("Title", typeof(string), typeof(Window));
        private static int _cascade;
        public string Title { get => Get("Title", ""); set => Set("Title", value ?? ""); }
        public double Left { get => Get("Left", double.NaN); set => Set("Left", value); }
        public double Top { get => Get("Top", double.NaN); set => Set("Top", value); }
        public WindowStartupLocation WindowStartupLocation { get => Get("WindowStartupLocation", WindowStartupLocation.Manual); set => Set("WindowStartupLocation", value); }
        public WindowState WindowState { get => Get("WindowState", WindowState.Normal); set { var o = WindowState; Set("WindowState", value); if (o != value) StateChanged?.Invoke(this, EventArgs.Empty); } }
        public WindowStyle WindowStyle { get => Get("WindowStyle", WindowStyle.SingleBorderWindow); set => Set("WindowStyle", value); }
        public ResizeMode ResizeMode { get => Get("ResizeMode", ResizeMode.CanResize); set => Set("ResizeMode", value); }
        public SizeToContent SizeToContent { get => Get("SizeToContent", SizeToContent.Manual); set => Set("SizeToContent", value); }
        public bool Topmost { get => Get("Topmost", false); set => Set("Topmost", value); }
        public bool ShowInTaskbar { get; set; } = true;
        public bool AllowsTransparency { get; set; }
        public ImageSource? Icon { get => Get<ImageSource?>("Icon"); set => Set("Icon", value); }
        public Window? Owner { get; set; }
        public bool IsActive { get; private set; }
        public bool IsDialog { get; internal set; }
        public bool IsOpen { get; private set; }
        public TaskbarItemInfo? TaskbarItemInfo { get; set; }
        public List<Window> OwnedWindows { get; } = new List<Window>();
        private bool? _dialogResult;
        public bool? DialogResult
        {
            get => _dialogResult;
            set { _dialogResult = value; if (IsOpen && IsDialog) Close(); }
        }
        public event EventHandler? Activated;
        public event EventHandler? Deactivated;
        public event EventHandler? StateChanged;
        public event EventHandler? LocationChanged;
        public event EventHandler? ContentRendered;
        public event EventHandler? SourceInitialized;
        public event CancelEventHandler? Closing;
        public event EventHandler? Closed;

        public Window()
        {
            Values["Background"] = Brushes.White;
            Values["FontSize"] = 12.0;
            Values["Padding"] = new Thickness(0);
            Values["BorderThickness"] = new Thickness(0);
        }

        public void Show()
        {
            if (IsOpen) { Activate(); return; }
            IsOpen = true;
            if (Application.Current != null && Application.Current.MainWindow == null) Application.Current.MainWindow = this;
            UiTree.WindowOpened(this);
            var idx = _cascade++;
            UiTree.Op("window", Id, "show", new Dictionary<string, object?> { ["cascade"] = idx, ["modal"] = IsDialog, ["owner"] = Owner?.Id });
            Subscribe("keydown"); Subscribe("keyup");
            SourceInitialized?.Invoke(this, EventArgs.Empty);
            IsActive = true;
            Activated?.Invoke(this, EventArgs.Empty);
            RaiseLoaded();
            ContentRendered?.Invoke(this, EventArgs.Empty);
            UiTree.Flush();
        }

        /// <summary>모달로 열고 닫힐 때까지 기다린다 (블록 가능 환경에서만 진짜로 기다림)</summary>
        public bool? ShowDialog()
        {
            IsDialog = true;
            _dialogResult = null;
            Owner?.OwnedWindows.Add(this);
            Show();
            if (Bridge.CanBlock)
            {
                // 창이 닫힐 때까지 중첩 이벤트 루프: 대기 중 들어오는 UI 이벤트는 SyncCall 안에서 NestedEvent 로 처리된다
                UiTree.SyncCall("dialog", UiTree.Json(new { id = Id }));
            }
            return _dialogResult;
        }

        public void Close()
        {
            if (!IsOpen) return;
            var ce = new CancelEventArgs();
            Closing?.Invoke(this, ce);
            if (ce.Cancel) return;
            IsOpen = false;
            IsActive = false;
            foreach (var w in OwnedWindows.ToArray()) w.Close();
            UiTree.Op("window", Id, "close", null);
            Closed?.Invoke(this, EventArgs.Empty);
            UiTree.WindowClosed(this);
            if (Application.Current != null && ReferenceEquals(Application.Current.MainWindow, this) && Application.Current.ShutdownMode == ShutdownMode.OnMainWindowClose) Application.Current.Shutdown();
            UiTree.Flush();
        }
        public void Hide() { UiTree.Op("window", Id, "hide", null); }
        public bool Activate() { IsActive = true; UiTree.Op("window", Id, "activate", null); Activated?.Invoke(this, EventArgs.Empty); return true; }
        public void DragMove() { }
        internal override void HandleDomEvent(string name, JsonElement a)
        {
            switch (name)
            {
                case "close": Close(); return;
                case "activate": IsActive = true; Activated?.Invoke(this, EventArgs.Empty); return;
                case "deactivate": IsActive = false; Deactivated?.Invoke(this, EventArgs.Empty); return;
                case "keydown": case "keyup": Input.Keyboard.FromDom(a); break;
                case "move": Values["Left"] = D(a, "left"); Values["Top"] = D(a, "top"); LocationChanged?.Invoke(this, EventArgs.Empty); return;
                case "state": Values["WindowState"] = Enum.TryParse<WindowState>(S(a, "value"), out var st) ? st : WindowState.Normal; StateChanged?.Invoke(this, EventArgs.Empty); return;
            }
            base.HandleDomEvent(name, a);
        }
        public static Window? GetWindow(DependencyObject d)
        {
            for (var e = d as FrameworkElement; e != null; e = e.ParentElement) if (e is Window w) return w;
            return Application.Current?.MainWindow;
        }
    }
    public class TaskbarItemInfo { public double ProgressValue { get; set; } public string? Description { get; set; } }
    public class NavigationWindow : Window { }

    /// <summary>WPF 애플리케이션: StartupUri 의 창을 열고, 창이 모두 닫히면 끝난다</summary>
    [Markup.ContentProperty("Resources")]
    public class Application
    {
        public static Application? Current { get; private set; }
        public Window? MainWindow { get; set; }
        public Uri? StartupUri { get; set; }
        public ResourceDictionary Resources { get; set; } = new ResourceDictionary();
        public ShutdownMode ShutdownMode { get; set; } = ShutdownMode.OnLastWindowClose;
        public List<Window> Windows { get; } = new List<Window>();
        public IDictionary<object, object?> Properties { get; } = new Dictionary<object, object?>();
        public Threading.Dispatcher Dispatcher => Threading.Dispatcher.CurrentDispatcher;
        public event StartupEventHandler? Startup;
        public event ExitEventHandler? Exit;
        public event EventHandler? Activated;
        public event EventHandler? Deactivated;
        public event Threading.DispatcherUnhandledExceptionEventHandler? DispatcherUnhandledException;
        private bool _running;
        public Application() { Current = this; }

        public int Run() => Run(null);
        public int Run(Window? window)
        {
            Current = this;
            _running = true;
            UiTree.AppRunning = true;
            OnStartup(new StartupEventArgs());
            if (window != null) { MainWindow ??= window; window.Show(); }
            else if (StartupUri != null)
            {
                var w = Markup.XamlRegistry.CreateWindow(StartupUri.OriginalString);
                if (w == null) throw new InvalidOperationException("StartupUri 에 해당하는 창을 찾을 수 없습니다: " + StartupUri);
                MainWindow ??= w;
                w.Show();
            }
            UiTree.Flush();
            // 실제 WPF 는 여기서 메시지 루프를 돌며 블록되지만, 웹에서는 즉시 돌아가고 호스트가 이벤트를 전달한다.
            return 0;
        }
        protected virtual void OnStartup(StartupEventArgs e) { Startup?.Invoke(this, e); }
        protected virtual void OnExit(ExitEventArgs e) { Exit?.Invoke(this, e); }
        public void Shutdown() => Shutdown(0);
        public void Shutdown(int code)
        {
            if (!_running) return;
            _running = false;
            UiTree.AppRunning = false;
            foreach (var w in UiTree.OpenWindows.ToArray()) { w.IsDialog = false; w.Close(); }
            OnExit(new ExitEventArgs { ApplicationExitCode = code });
            UiTree.Flush();
            Bridge.AppExit();
        }
        public object? FindResource(object key) => Resources.TryGetValue(key, out var v) ? v : throw new ResourceReferenceKeyNotFoundException("리소스를 찾을 수 없습니다: " + key, key);
        public object? TryFindResource(object key) => Resources.TryGetValue(key, out var v) ? v : null;
        public static Uri GetResourceStream(Uri u) => u;
        public static void LoadComponent(object component, Uri uri) { }
        internal bool IsRunning => _running;
    }

    public static class MessageBox
    {
        public static MessageBoxResult Show(string messageBoxText) => Show(messageBoxText, "", MessageBoxButton.OK, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(string messageBoxText, string caption) => Show(messageBoxText, caption, MessageBoxButton.OK, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(string messageBoxText, string caption, MessageBoxButton button) => Show(messageBoxText, caption, button, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(string messageBoxText, string caption, MessageBoxButton button, MessageBoxImage icon) => Show(messageBoxText, caption, button, icon, MessageBoxResult.None);
        public static MessageBoxResult Show(string messageBoxText, string caption, MessageBoxButton button, MessageBoxImage icon, MessageBoxResult defaultResult, MessageBoxOptions options) => Show(messageBoxText, caption, button, icon, defaultResult);
        public static MessageBoxResult Show(Window owner, string messageBoxText) => Show(messageBoxText, "", MessageBoxButton.OK, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(Window owner, string messageBoxText, string caption) => Show(messageBoxText, caption, MessageBoxButton.OK, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(Window owner, string messageBoxText, string caption, MessageBoxButton button) => Show(messageBoxText, caption, button, MessageBoxImage.None, MessageBoxResult.None);
        public static MessageBoxResult Show(Window owner, string messageBoxText, string caption, MessageBoxButton button, MessageBoxImage icon) => Show(messageBoxText, caption, button, icon, MessageBoxResult.None);
        public static MessageBoxResult Show(string messageBoxText, string caption, MessageBoxButton button, MessageBoxImage icon, MessageBoxResult defaultResult)
        {
            var payload = UiTree.Json(new { text = messageBoxText ?? "", caption = caption ?? "", button = button.ToString(), icon = icon.ToString(), def = defaultResult.ToString() });
            var r = UiTree.SyncCall("msgbox", payload);
            if (r == null)
            {
                // 블록 불가 환경: 기본 결과를 돌려준다
                return defaultResult != MessageBoxResult.None ? defaultResult : button switch { MessageBoxButton.OK => MessageBoxResult.OK, MessageBoxButton.OKCancel => MessageBoxResult.OK, MessageBoxButton.YesNo => MessageBoxResult.Yes, MessageBoxButton.YesNoCancel => MessageBoxResult.Yes, _ => MessageBoxResult.OK };
            }
            return Enum.TryParse<MessageBoxResult>(r.Trim('"'), out var res) ? res : MessageBoxResult.None;
        }
    }
}

namespace System.Windows.Threading
{
    public enum DispatcherPriority { Invalid = -1, Inactive = 0, SystemIdle = 1, ApplicationIdle = 2, ContextIdle = 3, Background = 4, Input = 5, Loaded = 6, Render = 7, DataBind = 8, Normal = 9, Send = 10 }
    public class DispatcherUnhandledExceptionEventArgs : EventArgs { public Exception Exception { get; } public bool Handled { get; set; } public DispatcherUnhandledExceptionEventArgs(Exception e) { Exception = e; } }
    public delegate void DispatcherUnhandledExceptionEventHandler(object sender, DispatcherUnhandledExceptionEventArgs e);
    public class DispatcherOperation { public Task Task { get; internal set; } = Task.CompletedTask; public object? Result { get; internal set; } }

    /// <summary>단일 스레드이므로 Invoke 는 바로 실행, BeginInvoke 는 다음 틱에 실행</summary>
    public class Dispatcher
    {
        public static Dispatcher CurrentDispatcher { get; } = new Dispatcher();
        public bool CheckAccess() => true;
        public void VerifyAccess() { }
        public bool HasShutdownStarted => false;
        public Thread Thread => Thread.CurrentThread;
        public event DispatcherUnhandledExceptionEventHandler? UnhandledException;
        public void Invoke(Action a) { a(); UiTree.Flush(); }
        public void Invoke(Action a, DispatcherPriority p) { a(); UiTree.Flush(); }
        public T Invoke<T>(Func<T> f) { var r = f(); UiTree.Flush(); return r; }
        public object? Invoke(Delegate d, params object?[] args) { var r = d.DynamicInvoke(args); UiTree.Flush(); return r; }
        public object? Invoke(DispatcherPriority p, Delegate d, params object?[] args) { var r = d.DynamicInvoke(args); UiTree.Flush(); return r; }
        public DispatcherOperation BeginInvoke(Action a) => Later(() => { a(); return null; });
        public DispatcherOperation BeginInvoke(Action a, DispatcherPriority p) => Later(() => { a(); return null; });
        public DispatcherOperation BeginInvoke(Delegate d, params object?[] args) => Later(() => d.DynamicInvoke(args));
        public DispatcherOperation BeginInvoke(DispatcherPriority p, Delegate d, params object?[] args) => Later(() => d.DynamicInvoke(args));
        public DispatcherOperation InvokeAsync(Action a) => Later(() => { a(); return null; });
        public DispatcherOperation InvokeAsync(Action a, DispatcherPriority p) => Later(() => { a(); return null; });
        public Task<T> InvokeAsync<T>(Func<T> f) { var tcs = new TaskCompletionSource<T>(); Later(() => { tcs.SetResult(f()); return null; }); return tcs.Task; }
        private static DispatcherOperation Later(Func<object?> f)
        {
            var op = new DispatcherOperation();
            var tcs = new TaskCompletionSource<bool>();
            op.Task = tcs.Task;
            var t = new Timer(_ => { try { op.Result = f(); } catch (Exception ex) { UiTree.ReportException(ex); } finally { UiTree.Flush(); tcs.TrySetResult(true); } }, null, 0, Timeout.Infinite);
            GC.KeepAlive(t);
            return op;
        }
        public void InvokeShutdown() { }
        public static void Run() { }
        public static void ExitAllFrames() { }
        public static void PushFrame(DispatcherFrame f) { }
    }
    public class DispatcherFrame { public bool Continue { get; set; } = true; }
    public class DispatcherObject : DependencyObject { }

    /// <summary>주기적으로 Tick 이벤트를 발생시키는 타이머 (System.Threading.Timer 로 구현)</summary>
    public class DispatcherTimer
    {
        private Timer? _timer;
        private TimeSpan _interval = TimeSpan.FromMilliseconds(1000);
        public TimeSpan Interval { get => _interval; set { _interval = value; if (IsEnabled) { Stop(); Start(); } } }
        public bool IsEnabled { get => _timer != null; set { if (value) Start(); else Stop(); } }
        public object? Tag { get; set; }
        public Dispatcher Dispatcher => Dispatcher.CurrentDispatcher;
        public event EventHandler? Tick;
        public DispatcherTimer() { }
        public DispatcherTimer(DispatcherPriority p) { }
        public DispatcherTimer(DispatcherPriority p, Dispatcher d) { }
        public DispatcherTimer(TimeSpan interval, DispatcherPriority p, EventHandler callback, Dispatcher d) { _interval = interval; Tick += callback; Start(); }
        public void Start()
        {
            if (_timer != null) return;
            var ms = Math.Max(1, (int)_interval.TotalMilliseconds);
            _timer = new Timer(_ => OnTick(), null, ms, ms);
        }
        public void Stop() { _timer?.Dispose(); _timer = null; }
        private void OnTick()
        {
            if (_timer == null) return;
            try { Tick?.Invoke(this, EventArgs.Empty); }
            catch (Exception ex) { UiTree.ReportException(ex); }
            finally { try { Input.CommandManager.Requery(); } catch { } UiTree.Flush(); }
        }
    }
}

namespace System.Windows.Media.Animation
{
    public enum FillBehavior { HoldEnd, Stop }
    /// <summary>반복 방식: 횟수("3x") · 시간("0:0:5") · 무한("Forever")</summary>
    public struct RepeatBehavior
    {
        private readonly int _kind;   // 0 = 기본(1회), 1 = 횟수, 2 = 시간, 3 = 무한
        private readonly double _count;
        private readonly TimeSpan _duration;
        public RepeatBehavior(double count) { _kind = 1; _count = count; _duration = TimeSpan.Zero; }
        public RepeatBehavior(TimeSpan duration) { _kind = 2; _count = 0; _duration = duration; }
        private RepeatBehavior(int kind) { _kind = kind; _count = 0; _duration = TimeSpan.Zero; }
        public static RepeatBehavior Forever => new RepeatBehavior(3);
        public bool IsForever => _kind == 3;
        public bool HasCount => _kind == 1 || _kind == 0;
        public bool HasDuration => _kind == 2;
        public double Count => _kind == 1 ? _count : 1;
        public TimeSpan Duration => _duration;
        public static RepeatBehavior Parse(string s)
        {
            s = s.Trim();
            if (s.Equals("Forever", StringComparison.OrdinalIgnoreCase)) return Forever;
            if (s.EndsWith("x", StringComparison.OrdinalIgnoreCase)) return new RepeatBehavior(double.Parse(s.Substring(0, s.Length - 1), Globalization.CultureInfo.InvariantCulture));
            return new RepeatBehavior(TimeSpan.Parse(s, Globalization.CultureInfo.InvariantCulture));
        }
        public override string ToString() => IsForever ? "Forever" : HasDuration ? _duration.ToString() : Count.ToString(Globalization.CultureInfo.InvariantCulture) + "x";
    }
    public abstract class Timeline : DependencyObject
    {
        public Duration Duration { get; set; } = Duration.Automatic;
        public TimeSpan? BeginTime { get; set; } = TimeSpan.Zero;
        public RepeatBehavior RepeatBehavior { get; set; }
        public bool AutoReverse { get; set; }
        public FillBehavior FillBehavior { get; set; }
        public double SpeedRatio { get; set; } = 1;
        public double AccelerationRatio { get; set; }
        public double DecelerationRatio { get; set; }
        public string? Name { get; set; }
        public event EventHandler? Completed;
        internal void RaiseCompleted() => Completed?.Invoke(this, EventArgs.Empty);
        public Timeline Clone() => (Timeline)MemberwiseClone();
    }
    public abstract class AnimationTimeline : Timeline { public IEasingFunction? EasingFunction { get; set; } public bool IsAdditive { get; set; } public bool IsCumulative { get; set; } }
    public interface IEasingFunction { double Ease(double normalizedTime); }
    public enum EasingMode { EaseIn, EaseOut, EaseInOut }
    /// <summary>가속 함수: EaseInCore 를 EasingMode 에 따라 뒤집거나 합친다 (WPF 와 같은 방식)</summary>
    public abstract class EasingFunctionBase : IEasingFunction
    {
        public EasingMode EasingMode { get; set; } = EasingMode.EaseOut;
        public double Ease(double t)
        {
            switch (EasingMode)
            {
                case EasingMode.EaseIn: return EaseInCore(t);
                case EasingMode.EaseOut: return 1 - EaseInCore(1 - t);
                default: return t < 0.5 ? EaseInCore(t * 2) / 2 : 1 - EaseInCore((1 - t) * 2) / 2;
            }
        }
        protected virtual double EaseInCore(double t) => t;
    }
    public class QuadraticEase : EasingFunctionBase { protected override double EaseInCore(double t) => t * t; }
    public class CubicEase : EasingFunctionBase { protected override double EaseInCore(double t) => t * t * t; }
    public class QuarticEase : EasingFunctionBase { protected override double EaseInCore(double t) => t * t * t * t; }
    public class QuinticEase : EasingFunctionBase { protected override double EaseInCore(double t) => t * t * t * t * t; }
    public class PowerEase : EasingFunctionBase { public double Power { get; set; } = 2; protected override double EaseInCore(double t) => Math.Pow(t, Math.Max(0, Power)); }
    public class SineEase : EasingFunctionBase { protected override double EaseInCore(double t) => 1 - Math.Sin(Math.PI / 2 * (1 - t)); }
    public class CircleEase : EasingFunctionBase { protected override double EaseInCore(double t) => 1 - Math.Sqrt(1 - Math.Min(1, t * t)); }
    public class ExponentialEase : EasingFunctionBase { public double Exponent { get; set; } = 2; protected override double EaseInCore(double t) => Math.Abs(Exponent) < 1e-9 ? t : (Math.Exp(Exponent * t) - 1) / (Math.Exp(Exponent) - 1); }
    public class BackEase : EasingFunctionBase { public double Amplitude { get; set; } = 1; protected override double EaseInCore(double t) => t * t * t - t * Math.Max(0, Amplitude) * Math.Sin(Math.PI * t); }
    public class ElasticEase : EasingFunctionBase
    {
        public int Oscillations { get; set; } = 3;
        public double Springiness { get; set; } = 3;
        protected override double EaseInCore(double t)
        {
            var osc = Math.Max(0, Oscillations); var spring = Math.Max(0, Springiness);
            var exp = Math.Abs(spring) < 1e-9 ? t : (Math.Exp(spring * t) - 1) / (Math.Exp(spring) - 1);
            return exp * Math.Sin((Math.PI * 2 * osc + Math.PI / 2) * t);
        }
    }
    public class BounceEase : EasingFunctionBase
    {
        public int Bounces { get; set; } = 3;
        public double Bounciness { get; set; } = 2;
        protected override double EaseInCore(double t) => 1 - Out(1 - t);
        private static double Out(double t)
        {
            // 표준 easeOutBounce (4번 튀기)
            const double n = 7.5625, d = 2.75;
            if (t < 1 / d) return n * t * t;
            if (t < 2 / d) { t -= 1.5 / d; return n * t * t + 0.75; }
            if (t < 2.5 / d) { t -= 2.25 / d; return n * t * t + 0.9375; }
            t -= 2.625 / d; return n * t * t + 0.984375;
        }
    }
    public class DoubleAnimation : AnimationTimeline
    {
        public double? From { get; set; }
        public double? To { get; set; }
        public double? By { get; set; }
        public DoubleAnimation() { }
        public DoubleAnimation(double to, Duration d) { To = to; Duration = d; }
        public DoubleAnimation(double from, double to, Duration d) { From = from; To = to; Duration = d; }
        public DoubleAnimation(double to, Duration d, FillBehavior fb) { To = to; Duration = d; FillBehavior = fb; }
        public DoubleAnimation(double from, double to, Duration d, FillBehavior fb) { From = from; To = to; Duration = d; FillBehavior = fb; }
    }
    public class ColorAnimation : AnimationTimeline
    {
        public Color? From { get; set; }
        public Color? To { get; set; }
        public Color? By { get; set; }
        public ColorAnimation() { }
        public ColorAnimation(Color to, Duration d) { To = to; Duration = d; }
        public ColorAnimation(Color from, Color to, Duration d) { From = from; To = to; Duration = d; }
    }
    public class ThicknessAnimation : AnimationTimeline
    {
        public Thickness? From { get; set; }
        public Thickness? To { get; set; }
        public ThicknessAnimation() { }
        public ThicknessAnimation(Thickness to, Duration d) { To = to; Duration = d; }
        public ThicknessAnimation(Thickness from, Thickness to, Duration d) { From = from; To = to; Duration = d; }
    }
    public class PointAnimation : AnimationTimeline
    {
        public Point? From { get; set; }
        public Point? To { get; set; }
        public PointAnimation() { }
        public PointAnimation(Point to, Duration d) { To = to; Duration = d; }
        public PointAnimation(Point from, Point to, Duration d) { From = from; To = to; Duration = d; }
    }
    [Markup.ContentProperty("Children")]
    public class Storyboard : Timeline
    {
        public List<Timeline> Children { get; } = new List<Timeline>();
        public static void SetTargetName(DependencyObject t, string name) { _targets[t] = name; }
        public static string? GetTargetName(DependencyObject t) => _targets.TryGetValue(t, out var n) ? n : null;
        public static void SetTargetProperty(DependencyObject t, PropertyPath p) { _props[t] = p.Path; }
        public static PropertyPath? GetTargetProperty(DependencyObject t) => _props.TryGetValue(t, out var p) ? new PropertyPath(p) : null;
        public static void SetTarget(DependencyObject t, DependencyObject d) { _targetObjs[t] = d; }
        public static DependencyObject? GetTarget(DependencyObject t) => _targetObjs.TryGetValue(t, out var d) ? d : null;
        private static readonly Dictionary<DependencyObject, string> _targets = new Dictionary<DependencyObject, string>();
        private static readonly Dictionary<DependencyObject, string> _props = new Dictionary<DependencyObject, string>();
        private static readonly Dictionary<DependencyObject, DependencyObject> _targetObjs = new Dictionary<DependencyObject, DependencyObject>();
        public void Begin() => Begin(null);
        public void Begin(FrameworkElement? containingObject) => Begin(containingObject, false);
        public void Begin(FrameworkElement? containingObject, bool isControllable)
        {
            Animator.StopOwner(this, false);
            int started = 0;
            foreach (var c in Children)
            {
                DependencyObject? target = _targetObjs.TryGetValue(c, out var to) ? to : null;
                if (target == null && _targets.TryGetValue(c, out var n)) target = ResolveName(containingObject, n);
                target ??= (_targetObjs.TryGetValue(this, out var sto) ? sto : null) ?? (_targets.TryGetValue(this, out var sn) ? ResolveName(containingObject, sn) : null) ?? containingObject;
                var prop = _props.TryGetValue(c, out var p) ? p : _props.TryGetValue(this, out var sp) ? sp : null;
                if (target != null && prop != null && c is AnimationTimeline at) { Animator.Start(target, prop, at, this); started++; }
            }
            if (started == 0) RaiseCompleted();
        }
        private static DependencyObject? ResolveName(FrameworkElement? scope, string name)
        {
            if (scope != null && scope.FindName(name) is DependencyObject d) return d;
            // 창이 아직 열리기 전(Loaded 중)일 수 있으므로 조상을 따라 올라가 맨 위 요소(창)에서 찾는다
            var roots = new List<FrameworkElement>();
            for (var e = scope; e != null; e = e.ParentElement) if (e.ParentElement == null) roots.Add(e);
            foreach (var w in UiTree.OpenWindows) roots.Add(w);
            foreach (var w in roots)
            {
                if (w.FindName(name) is DependencyObject d2) return d2;
                // x:Name 을 붙인 변환 · 브러시(요소가 아닌 객체)는 창의 필드로 찾는다
                var f = w.GetType().GetField(name, Reflection.BindingFlags.Instance | Reflection.BindingFlags.NonPublic | Reflection.BindingFlags.Public);
                if (f?.GetValue(w) is DependencyObject d3) return d3;
            }
            return null;
        }
        public void Stop() => Animator.StopOwner(this, true);
        public void Stop(FrameworkElement e) => Stop();
        public void Pause() => Animator.PauseOwner(this, true);
        public void Pause(FrameworkElement e) => Pause();
        public void Resume() => Animator.PauseOwner(this, false);
        public void Resume(FrameworkElement e) => Resume();
        public void Remove() => Stop();
        public void Remove(FrameworkElement e) => Stop();
        public void SkipToFill() => Animator.SkipOwner(this);
        public void SkipToFill(FrameworkElement e) => SkipToFill();
        public new Storyboard Clone() => (Storyboard)MemberwiseClone();
    }
    [Markup.ContentProperty("Storyboard")]
    public class BeginStoryboard { public Storyboard? Storyboard { get; set; } public string? Name { get; set; } }

    /// <summary>
    /// 애니메이션 시계: 약 30ms 마다 진행 중인 모든 애니메이션의 값을 계산해 대상 속성에 직접 쓴다.
    /// (요소 속성은 SetPropertyValue, 변환 · 브러시는 CLR 속성 → Changed 알림으로 다시 그림)
    /// </summary>
    internal static class Animator
    {
        private sealed class Clock
        {
            public object Obj = null!;          // 값을 쓸 객체 (요소 또는 변환 · 브러시)
            public string Prop = "";
            public AnimationTimeline Anim = null!;
            public Storyboard? Owner;
            public object? Base;                 // 애니메이션 전 값 (Stop 때 되돌림)
            public object? From, To;
            public double Elapsed;               // 진행 시간(ms, SpeedRatio 적용 전)
            public DateTime Last;
            public bool Paused, Done;
        }
        private static readonly List<Clock> _clocks = new List<Clock>();
        private static readonly object _lock = new object();
        private static Timer? _timer;

        /// <summary>BeginAnimation(dp, anim): anim 이 null 이면 그 속성의 애니메이션을 멈추고 원래 값으로</summary>
        public static void Begin(object target, string prop, AnimationTimeline? anim)
        {
            if (anim == null) { StopProp(target, prop, true); return; }
            Start(target, prop, anim, null);
        }

        public static void Start(object target, string path, AnimationTimeline anim, Storyboard? owner)
        {
            if (!Resolve(target, path, out var obj, out var prop)) return;
            object? baseVal = null; bool hadBase = false;
            lock (_lock)
            {
                foreach (var c in _clocks) if (ReferenceEquals(c.Obj, obj) && c.Prop == prop) { c.Done = true; if (!hadBase) { baseVal = c.Base; hadBase = true; } }
                _clocks.RemoveAll(c => c.Done);
            }
            var cur = GetValue(obj, prop);
            if (!hadBase) baseVal = cur;
            var clock = new Clock { Obj = obj, Prop = prop, Anim = anim, Owner = owner, Base = baseVal, Last = DateTime.UtcNow };
            switch (anim)
            {
                case DoubleAnimation da:
                {
                    double c0 = cur is double d0 && !double.IsNaN(d0) ? d0 : 0;
                    double from = da.From ?? c0;
                    clock.From = from; clock.To = da.To ?? (da.By.HasValue ? from + da.By.Value : c0);
                    break;
                }
                case ColorAnimation ca:
                {
                    var c0 = cur is Color cc ? cc : cur is SolidColorBrush sb ? sb.Color : Colors.Transparent;
                    var from = ca.From ?? c0;
                    clock.From = from; clock.To = ca.To ?? (ca.By.HasValue ? Color.FromArgb((byte)Math.Min(255, from.A + ca.By.Value.A), (byte)Math.Min(255, from.R + ca.By.Value.R), (byte)Math.Min(255, from.G + ca.By.Value.G), (byte)Math.Min(255, from.B + ca.By.Value.B)) : c0);
                    // 요소의 Background 등 브러시 속성: 새 단색 브러시로 바꿔 가며 그린다
                    if (obj is UIElement && !(cur is Color)) clock.Base = cur;
                    break;
                }
                case ThicknessAnimation ta: { var c0 = cur is Thickness t0 ? t0 : new Thickness(0); clock.From = ta.From ?? c0; clock.To = ta.To ?? c0; break; }
                case PointAnimation pa: { var c0 = cur is Point p0 ? p0 : new Point(0, 0); clock.From = pa.From ?? c0; clock.To = pa.To ?? c0; break; }
                default: return;
            }
            lock (_lock)
            {
                _clocks.Add(clock);
                _timer ??= new Timer(_ => Tick(), null, 0, 30);
            }
        }

        private static double DurationMs(Timeline t) => t.Duration.HasTimeSpan ? (t.Duration.TimeSpan == TimeSpan.MaxValue ? double.PositiveInfinity : Math.Max(1, t.Duration.TimeSpan.TotalMilliseconds)) : 1000;

        private static void Tick()
        {
            List<Clock> list; List<Clock> finished = new List<Clock>();
            lock (_lock)
            {
                if (UiTree.OpenWindows.Count == 0) { _clocks.Clear(); _timer?.Dispose(); _timer = null; return; }
                list = new List<Clock>(_clocks);
            }
            var now = DateTime.UtcNow;
            try
            {
                foreach (var c in list)
                {
                    if (c.Done) continue;
                    var dt = (now - c.Last).TotalMilliseconds; c.Last = now;
                    if (c.Paused) continue;
                    c.Elapsed += dt * (c.Anim.SpeedRatio > 0 ? c.Anim.SpeedRatio : 1) * (c.Owner != null && c.Owner.SpeedRatio > 0 ? c.Owner.SpeedRatio : 1);
                    var t = c.Elapsed - (c.Anim.BeginTime?.TotalMilliseconds ?? 0) - (c.Owner?.BeginTime?.TotalMilliseconds ?? 0);
                    if (t < 0) continue;
                    double dur = DurationMs(c.Anim);
                    double single = c.Anim.AutoReverse ? dur * 2 : dur;
                    var rb = c.Anim.RepeatBehavior;
                    double total = rb.IsForever ? double.PositiveInfinity : rb.HasDuration ? rb.Duration.TotalMilliseconds : single * rb.Count;
                    double p;
                    if (t >= total) { p = c.Anim.AutoReverse ? 0 : 1; if (rb.HasCount && rb.Count % 1 != 0) p = Phase(total % single, dur); c.Done = true; }
                    else p = Phase(t % single, dur);
                    if (c.Anim.EasingFunction != null) p = c.Anim.EasingFunction.Ease(p);
                    Apply(c, p);
                    if (c.Done) finished.Add(c);
                }
                lock (_lock) _clocks.RemoveAll(c => c.Done);
                var owners = new List<Storyboard>();
                foreach (var c in finished)
                {
                    if (c.Anim.FillBehavior == FillBehavior.Stop) SetValue(c.Obj, c.Prop, c.Base);
                    c.Anim.RaiseCompleted();
                    if (c.Owner != null && !owners.Contains(c.Owner)) owners.Add(c.Owner);
                }
                // 스토리보드의 모든 애니메이션이 끝나면 스토리보드 Completed
                foreach (var o in owners) { bool any; lock (_lock) any = _clocks.Exists(x => x.Owner == o); if (!any) o.RaiseCompleted(); }
            }
            catch (Exception ex) { UiTree.ReportException(ex); }
            finally { UiTree.Flush(); }
        }
        // 한 번의 (왕복) 주기 안에서의 위치 → 0~1 진행률
        private static double Phase(double local, double dur) { if (double.IsInfinity(dur)) return 0; var p = local / dur; return p > 1 ? 2 - p : p; }

        private static void Apply(Clock c, double p)
        {
            object? v;
            switch (c.From)
            {
                case double a: v = a + ((double)c.To! - a) * p; break;
                case Color a: { var b = (Color)c.To!; v = Color.FromArgb(L(a.A, b.A, p), L(a.R, b.R, p), L(a.G, b.G, p), L(a.B, b.B, p)); break; }
                case Thickness a: { var b = (Thickness)c.To!; v = new Thickness(a.Left + (b.Left - a.Left) * p, a.Top + (b.Top - a.Top) * p, a.Right + (b.Right - a.Right) * p, a.Bottom + (b.Bottom - a.Bottom) * p); break; }
                case Point a: { var b = (Point)c.To!; v = new Point(a.X + (b.X - a.X) * p, a.Y + (b.Y - a.Y) * p); break; }
                default: return;
            }
            SetValue(c.Obj, c.Prop, v);
        }
        private static byte L(byte a, byte b, double p) => (byte)Math.Max(0, Math.Min(255, Math.Round(a + (b - a) * p)));

        private static object? GetValue(object obj, string prop)
        {
            if (obj is UIElement el) return el.GetPropertyValue(prop);
            return obj.GetType().GetProperty(prop)?.GetValue(obj);
        }
        private static void SetValue(object obj, string prop, object? v)
        {
            if (obj is UIElement el)
            {
                // 브러시 속성에 색 애니메이션: 단색 브러시로 감싼다
                if (v is Color col) { var pi0 = obj.GetType().GetProperty(prop); if (pi0 != null && typeof(Brush).IsAssignableFrom(pi0.PropertyType)) v = new SolidColorBrush(col); }
                el.SetPropertyValue(prop, v);
                return;
            }
            var pi = obj.GetType().GetProperty(prop);
            if (pi != null && pi.CanWrite) pi.SetValue(obj, WpfShim.Conv.To(pi.PropertyType, v));
        }

        /// <summary>
        /// 속성 경로 풀이: "Opacity", "(Canvas.Left)", "RenderTransform.Angle",
        /// "(UIElement.RenderTransform).(RotateTransform.Angle)", "(Rectangle.Fill).(SolidColorBrush.Color)",
        /// "RenderTransform.Children[0].Angle"
        /// </summary>
        private static bool Resolve(object target, string path, out object obj, out string prop)
        {
            obj = target; prop = "";
            var segs = new List<string>(); int depth = 0; var cur = new Text.StringBuilder();
            foreach (var ch in path.Trim())
            {
                if (ch == '(') depth++; else if (ch == ')') depth--;
                if (ch == '.' && depth == 0) { segs.Add(cur.ToString()); cur.Clear(); continue; }
                cur.Append(ch);
            }
            if (cur.Length > 0) segs.Add(cur.ToString());
            for (int i = 0; i < segs.Count; i++)
            {
                var s = segs[i].Trim(); int? index = null;
                var br = s.LastIndexOf('[');
                if (br > 0 && s.EndsWith("]")) { if (int.TryParse(s.Substring(br + 1, s.Length - br - 2), out var ix)) index = ix; s = s.Substring(0, br); }
                s = s.Trim('(', ')');
                var dot = s.LastIndexOf('.');
                string name = s;
                if (dot > 0)
                {
                    var owner = s.Substring(0, dot);
                    name = s.Substring(dot + 1);
                    // 부착 속성 (Canvas.Left 등) 은 이름 그대로, 나머지 "형식.속성" 은 속성 이름만
                    if (owner is "Canvas" or "Grid" or "DockPanel") name = owner + "." + name;
                }
                if (i == segs.Count - 1 && index == null) { prop = name; return true; }
                var next = GetValue(obj, name);
                if (index != null && next is Collections.IList l && index.Value < l.Count) next = l[index.Value];
                if (next == null) return false;
                obj = next;
            }
            return false;
        }

        public static void StopProp(object target, string prop, bool restore)
        {
            List<Clock> rm;
            lock (_lock) { rm = _clocks.FindAll(c => ReferenceEquals(c.Obj, target) && c.Prop == prop); _clocks.RemoveAll(c => rm.Contains(c)); }
            foreach (var c in rm) { c.Done = true; if (restore) SetValue(c.Obj, c.Prop, c.Base); }
            UiTree.Flush();
        }
        public static void StopOwner(Storyboard sb, bool restore)
        {
            List<Clock> rm;
            lock (_lock) { rm = _clocks.FindAll(c => c.Owner == sb); _clocks.RemoveAll(c => c.Owner == sb); }
            foreach (var c in rm) { c.Done = true; if (restore) SetValue(c.Obj, c.Prop, c.Base); }
            if (restore) UiTree.Flush();
        }
        public static void PauseOwner(Storyboard sb, bool pause) { lock (_lock) foreach (var c in _clocks) if (c.Owner == sb) { c.Paused = pause; c.Last = DateTime.UtcNow; } }
        public static void SkipOwner(Storyboard sb)
        {
            List<Clock> rm;
            lock (_lock) { rm = _clocks.FindAll(c => c.Owner == sb); _clocks.RemoveAll(c => c.Owner == sb); }
            foreach (var c in rm) { c.Done = true; Apply(c, c.Anim.AutoReverse ? 0 : 1); }
            UiTree.Flush();
        }
    }
}

namespace System.Windows
{
    public static class AnimationExtensions
    {
        public static void BeginAnimation(this UIElement el, DependencyProperty dp, Media.Animation.AnimationTimeline? animation)
        {
            var name = dp.IsAttached ? dp.OwnerType.Name + "." + dp.Name : dp.Name;
            Media.Animation.Animator.Begin(el, name, animation);
        }
        public static void BeginAnimation(this UIElement el, DependencyProperty dp, Media.Animation.AnimationTimeline? animation, Media.Animation.HandoffBehavior handoff) => BeginAnimation(el, dp, animation);
        public static void BeginStoryboard(this FrameworkElement el, Media.Animation.Storyboard sb) => sb.Begin(el);
    }
}
