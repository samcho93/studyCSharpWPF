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
    public struct RepeatBehavior { public double Count; public bool IsForever; public RepeatBehavior(double count) { Count = count; IsForever = false; } public static RepeatBehavior Forever => new RepeatBehavior { IsForever = true }; }
    public abstract class Timeline { public Duration Duration { get; set; } = new Duration(TimeSpan.FromSeconds(1)); public TimeSpan? BeginTime { get; set; } public RepeatBehavior RepeatBehavior { get; set; } public bool AutoReverse { get; set; } public FillBehavior FillBehavior { get; set; } public double SpeedRatio { get; set; } = 1; public event EventHandler? Completed; internal void RaiseCompleted() => Completed?.Invoke(this, EventArgs.Empty); }
    public abstract class AnimationTimeline : Timeline { public IEasingFunction? EasingFunction { get; set; } }
    public interface IEasingFunction { double Ease(double t); }
    public enum EasingMode { EaseIn, EaseOut, EaseInOut }
    public abstract class EasingFunctionBase : IEasingFunction { public EasingMode EasingMode { get; set; } public virtual double Ease(double t) => t; }
    public class QuadraticEase : EasingFunctionBase { } public class CubicEase : EasingFunctionBase { } public class BounceEase : EasingFunctionBase { public int Bounces { get; set; } = 3; public double Bounciness { get; set; } = 2; } public class ElasticEase : EasingFunctionBase { public int Oscillations { get; set; } = 3; public double Springiness { get; set; } = 3; } public class SineEase : EasingFunctionBase { } public class BackEase : EasingFunctionBase { public double Amplitude { get; set; } = 1; } public class CircleEase : EasingFunctionBase { } public class ExponentialEase : EasingFunctionBase { public double Exponent { get; set; } = 2; } public class PowerEase : EasingFunctionBase { public double Power { get; set; } = 2; } public class QuarticEase : EasingFunctionBase { } public class QuinticEase : EasingFunctionBase { }
    public class DoubleAnimation : AnimationTimeline
    {
        public double? From { get; set; }
        public double? To { get; set; }
        public double? By { get; set; }
        public DoubleAnimation() { }
        public DoubleAnimation(double to, Duration d) { To = to; Duration = d; }
        public DoubleAnimation(double from, double to, Duration d) { From = from; To = to; Duration = d; }
        public DoubleAnimation(double to, Duration d, FillBehavior fb) { To = to; Duration = d; FillBehavior = fb; }
    }
    public class ColorAnimation : AnimationTimeline { public Color? From { get; set; } public Color? To { get; set; } public ColorAnimation() { } public ColorAnimation(Color to, Duration d) { To = to; Duration = d; } }
    public class ThicknessAnimation : AnimationTimeline { public Thickness? From { get; set; } public Thickness? To { get; set; } }
    public class PointAnimation : AnimationTimeline { public Point? From { get; set; } public Point? To { get; set; } }
    [Markup.ContentProperty("Children")]
    public class Storyboard : Timeline
    {
        public List<Timeline> Children { get; } = new List<Timeline>();
        public static void SetTargetName(Timeline t, string name) { _targets[t] = name; }
        public static void SetTargetProperty(Timeline t, PropertyPath p) { _props[t] = p.Path; }
        public static void SetTarget(Timeline t, DependencyObject d) { _targetObjs[t] = d; }
        private static readonly Dictionary<Timeline, string> _targets = new Dictionary<Timeline, string>();
        private static readonly Dictionary<Timeline, string> _props = new Dictionary<Timeline, string>();
        private static readonly Dictionary<Timeline, DependencyObject> _targetObjs = new Dictionary<Timeline, DependencyObject>();
        public void Begin() => Begin(null);
        public void Begin(FrameworkElement? containingObject)
        {
            foreach (var c in Children)
            {
                DependencyObject? target = _targetObjs.TryGetValue(c, out var to) ? to : (_targets.TryGetValue(c, out var n) && containingObject != null ? containingObject.FindName(n) as DependencyObject : containingObject);
                if (target is UIElement el && _props.TryGetValue(c, out var prop)) Animator.Run(el, prop, c);
            }
        }
        public void Stop() { } public void Stop(FrameworkElement e) { } public void Pause() { } public void Resume() { }
    }
    [Markup.ContentProperty("Storyboard")]
    public class BeginStoryboard { public Storyboard? Storyboard { get; set; } public string? Name { get; set; } }

    /// <summary>애니메이션: 렌더러의 CSS 전환에 맡기고, 끝나면 최종 값으로 속성을 설정한다</summary>
    internal static class Animator
    {
        public static void Run(UIElement el, string prop, Timeline t)
        {
            var ms = t.Duration.HasTimeSpan ? t.Duration.TimeSpan.TotalMilliseconds : 1000;
            // 부착 속성 경로 "(Canvas.Left)" 정리
            prop = prop.Trim('(', ')');
            if (t is DoubleAnimation da)
            {
                var cur = el.GetPropertyValue(prop);
                double from = da.From ?? (cur is double d0 && !double.IsNaN(d0) ? d0 : 0);
                double to = da.To ?? (da.By.HasValue ? from + da.By.Value : from);
                UiTree.Op("anim", el.Id, prop, from, to, ms, t.RepeatBehavior.IsForever, t.AutoReverse);
                var timer = new Timer(_ => { try { el.SetPropertyValue(prop, to); t.RaiseCompleted(); } catch (Exception ex) { UiTree.ReportException(ex); } finally { UiTree.Flush(); } }, null, (int)ms, Timeout.Infinite);
                GC.KeepAlive(timer);
            }
            else if (t is ColorAnimation ca && ca.To.HasValue)
            {
                var timer = new Timer(_ => { try { el.SetPropertyValue(prop, new SolidColorBrush(ca.To.Value)); t.RaiseCompleted(); } catch (Exception ex) { UiTree.ReportException(ex); } finally { UiTree.Flush(); } }, null, (int)ms, Timeout.Infinite);
                UiTree.Op("anim", el.Id, prop, null, ca.To.Value.ToCss(), ms, false, false);
                GC.KeepAlive(timer);
            }
        }
    }
}

namespace System.Windows
{
    public static class AnimationExtensions
    {
        public static void BeginAnimation(this UIElement el, DependencyProperty dp, Media.Animation.AnimationTimeline? animation)
        {
            if (animation == null) return;
            var name = dp.IsAttached ? dp.OwnerType.Name + "." + dp.Name : dp.Name;
            Media.Animation.Storyboard.SetTargetProperty(animation, new PropertyPath(name));
            Media.Animation.Storyboard.SetTarget(animation, el);
            var sb = new Media.Animation.Storyboard();
            sb.Children.Add(animation);
            sb.Begin();
        }
    }
}
