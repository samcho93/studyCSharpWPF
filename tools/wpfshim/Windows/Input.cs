using System;
using System.Collections.Generic;
using System.Text.Json;
using WpfShim;

namespace System.Windows.Input
{
    public enum MouseButton { Left, Middle, Right, XButton1, XButton2 }
    public enum MouseButtonState { Released, Pressed }
    [Flags] public enum ModifierKeys { None = 0, Alt = 1, Control = 2, Shift = 4, Windows = 8 }
    public enum KeyStates { None = 0, Down = 1, Toggled = 2 }

    public enum Key
    {
        None = 0, Cancel = 1, Back = 2, Tab = 3, LineFeed = 4, Clear = 5, Return = 6, Enter = 6, Pause = 7, Capital = 8, CapsLock = 8, KanaMode = 9, HangulMode = 9, JunjaMode = 10, FinalMode = 11, HanjaMode = 12, KanjiMode = 12,
        Escape = 13, ImeConvert = 14, ImeNonConvert = 15, ImeAccept = 16, ImeModeChange = 17, Space = 18, Prior = 19, PageUp = 19, Next = 20, PageDown = 20, End = 21, Home = 22, Left = 23, Up = 24, Right = 25, Down = 26,
        Select = 27, Print = 28, Execute = 29, Snapshot = 30, PrintScreen = 30, Insert = 31, Delete = 32, Help = 33,
        D0 = 34, D1 = 35, D2 = 36, D3 = 37, D4 = 38, D5 = 39, D6 = 40, D7 = 41, D8 = 42, D9 = 43,
        A = 44, B = 45, C = 46, D = 47, E = 48, F = 49, G = 50, H = 51, I = 52, J = 53, K = 54, L = 55, M = 56, N = 57, O = 58, P = 59, Q = 60, R = 61, S = 62, T = 63, U = 64, V = 65, W = 66, X = 67, Y = 68, Z = 69,
        LWin = 70, RWin = 71, Apps = 72, Sleep = 73,
        NumPad0 = 74, NumPad1 = 75, NumPad2 = 76, NumPad3 = 77, NumPad4 = 78, NumPad5 = 79, NumPad6 = 80, NumPad7 = 81, NumPad8 = 82, NumPad9 = 83,
        Multiply = 84, Add = 85, Separator = 86, Subtract = 87, Decimal = 88, Divide = 89,
        F1 = 90, F2 = 91, F3 = 92, F4 = 93, F5 = 94, F6 = 95, F7 = 96, F8 = 97, F9 = 98, F10 = 99, F11 = 100, F12 = 101, F13 = 102, F14 = 103, F15 = 104, F16 = 105, F17 = 106, F18 = 107, F19 = 108, F20 = 109, F21 = 110, F22 = 111, F23 = 112, F24 = 113,
        NumLock = 114, Scroll = 115, LeftShift = 116, RightShift = 117, LeftCtrl = 118, RightCtrl = 119, LeftAlt = 120, RightAlt = 121,
        BrowserBack = 122, BrowserForward = 123, BrowserRefresh = 124, BrowserStop = 125, BrowserSearch = 126, BrowserFavorites = 127, BrowserHome = 128,
        VolumeMute = 129, VolumeDown = 130, VolumeUp = 131, MediaNextTrack = 132, MediaPreviousTrack = 133, MediaStop = 134, MediaPlayPause = 135, LaunchMail = 136, SelectMedia = 137, LaunchApplication1 = 138, LaunchApplication2 = 139,
        Oem1 = 140, OemSemicolon = 140, OemPlus = 141, OemComma = 142, OemMinus = 143, OemPeriod = 144, Oem2 = 145, OemQuestion = 145, Oem3 = 146, OemTilde = 146, AbntC1 = 147, AbntC2 = 148,
        Oem4 = 149, OemOpenBrackets = 149, Oem5 = 150, OemPipe = 150, Oem6 = 151, OemCloseBrackets = 151, Oem7 = 152, OemQuotes = 152, Oem8 = 153, Oem102 = 154, OemBackslash = 154,
        ImeProcessed = 155, System = 156, OemAttn = 157, DbeAlphanumeric = 157, OemFinish = 158, DbeKatakana = 158, OemCopy = 159, DbeHiragana = 159, OemAuto = 160, DbeSbcsChar = 160, OemEnlw = 161, DbeDbcsChar = 161, OemBackTab = 162, DbeRoman = 162,
        Attn = 163, DbeNoRoman = 163, CrSel = 164, DbeEnterWordRegisterMode = 164, ExSel = 165, DbeEnterImeConfigureMode = 165, EraseEof = 166, DbeFlushString = 166, Play = 167, DbeCodeInput = 167, Zoom = 168, DbeNoCodeInput = 168, NoName = 169, DbeDetermineString = 169, Pa1 = 170, DbeEnterDialogConversionMode = 170, OemClear = 171, DeadCharProcessed = 172
    }

    public static class KeyMap
    {
        public static Key FromDom(string code, string key)
        {
            if (code.StartsWith("Key") && code.Length == 4) return (Key)((int)Key.A + (code[3] - 'A'));
            if (code.StartsWith("Digit") && code.Length == 6) return (Key)((int)Key.D0 + (code[5] - '0'));
            if (code.StartsWith("Numpad") && code.Length == 7 && char.IsDigit(code[6])) return (Key)((int)Key.NumPad0 + (code[6] - '0'));
            if (code.StartsWith("F") && int.TryParse(code.Substring(1), out var fn) && fn >= 1 && fn <= 24) return (Key)((int)Key.F1 + fn - 1);
            switch (code)
            {
                case "Enter": case "NumpadEnter": return Key.Return;
                case "Escape": return Key.Escape;
                case "Space": return Key.Space;
                case "Backspace": return Key.Back;
                case "Tab": return Key.Tab;
                case "ArrowLeft": return Key.Left; case "ArrowRight": return Key.Right; case "ArrowUp": return Key.Up; case "ArrowDown": return Key.Down;
                case "Delete": return Key.Delete; case "Insert": return Key.Insert; case "Home": return Key.Home; case "End": return Key.End;
                case "PageUp": return Key.PageUp; case "PageDown": return Key.PageDown;
                case "ShiftLeft": return Key.LeftShift; case "ShiftRight": return Key.RightShift;
                case "ControlLeft": return Key.LeftCtrl; case "ControlRight": return Key.RightCtrl;
                case "AltLeft": return Key.LeftAlt; case "AltRight": return Key.RightAlt;
                case "CapsLock": return Key.Capital; case "NumLock": return Key.NumLock; case "ScrollLock": return Key.Scroll;
                case "MetaLeft": return Key.LWin; case "MetaRight": return Key.RWin; case "ContextMenu": return Key.Apps;
                case "Minus": return Key.OemMinus; case "Equal": return Key.OemPlus; case "Comma": return Key.OemComma; case "Period": return Key.OemPeriod;
                case "Slash": return Key.OemQuestion; case "Backquote": return Key.OemTilde; case "BracketLeft": return Key.OemOpenBrackets; case "BracketRight": return Key.OemCloseBrackets;
                case "Backslash": return Key.OemPipe; case "Semicolon": return Key.OemSemicolon; case "Quote": return Key.OemQuotes;
                case "NumpadAdd": return Key.Add; case "NumpadSubtract": return Key.Subtract; case "NumpadMultiply": return Key.Multiply; case "NumpadDivide": return Key.Divide; case "NumpadDecimal": return Key.Decimal;
                case "Pause": return Key.Pause; case "PrintScreen": return Key.PrintScreen;
                case "HangulMode": case "Lang1": return Key.HangulMode; case "Hanja": case "Lang2": return Key.HanjaMode;
            }
            if (key.Length == 1)
            {
                var c = char.ToUpperInvariant(key[0]);
                if (c >= 'A' && c <= 'Z') return (Key)((int)Key.A + (c - 'A'));
                if (c >= '0' && c <= '9') return (Key)((int)Key.D0 + (c - '0'));
            }
            return Key.None;
        }
    }

    public class InputEventArgs : RoutedEventArgs { public int Timestamp { get; set; } public InputDevice? Device { get; set; } }
    public class InputDevice { }
    public class KeyboardDevice : InputDevice { public ModifierKeys Modifiers => Keyboard.Modifiers; public bool IsKeyDown(Key k) => Keyboard.IsKeyDown(k); }
    public class MouseDevice : InputDevice { }

    public class MouseEventArgs : InputEventArgs
    {
        internal double X, Y, WX, WY;
        internal UIElement? Sender;
        internal Dictionary<int, (double l, double t)>? Anc;
        public MouseButtonState LeftButton { get; set; }
        public MouseButtonState RightButton { get; set; }
        public MouseButtonState MiddleButton { get; set; }
        public MouseDevice MouseDevice { get; } = new MouseDevice();
        public MouseEventArgs() { }
        public MouseEventArgs(MouseDevice d, int timestamp) { }
        /// <summary>요소 기준 마우스 위치 (요소를 지정하지 않으면 이벤트를 받은 요소 기준)</summary>
        public Point GetPosition(IInputElement? relativeTo)
        {
            if (relativeTo == null || ReferenceEquals(relativeTo, Sender)) return new Point(X, Y);
            if (relativeTo is Window) return new Point(WX, WY);
            if (relativeTo is UIElement el && Anc != null && Anc.TryGetValue(el.Id, out var r)) return new Point(WX - r.l, WY - r.t);
            return new Point(X, Y);
        }
        internal static void Fill(MouseEventArgs e, UIElement sender, JsonElement a)
        {
            e.Sender = sender; e.Source = sender; e.OriginalSource = sender;
            e.X = UIElement.D(a, "x"); e.Y = UIElement.D(a, "y"); e.WX = UIElement.D(a, "wx"); e.WY = UIElement.D(a, "wy");
            var buttons = (int)UIElement.D(a, "buttons");
            e.LeftButton = (buttons & 1) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released;
            e.RightButton = (buttons & 2) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released;
            e.MiddleButton = (buttons & 4) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released;
            if (a.TryGetProperty("anc", out var anc) && anc.ValueKind == JsonValueKind.Object)
            {
                e.Anc = new Dictionary<int, (double, double)>();
                foreach (var p in anc.EnumerateObject())
                    if (int.TryParse(p.Name, out var id) && p.Value.ValueKind == JsonValueKind.Array && p.Value.GetArrayLength() >= 2)
                        e.Anc[id] = (p.Value[0].GetDouble(), p.Value[1].GetDouble());
            }
            Mouse.LastX = e.WX; Mouse.LastY = e.WY;
            Keyboard.Modifiers = (UIElement.B(a, "ctrl") ? ModifierKeys.Control : 0) | (UIElement.B(a, "shift") ? ModifierKeys.Shift : 0) | (UIElement.B(a, "alt") ? ModifierKeys.Alt : 0);
        }
        internal static MouseEventArgs From(UIElement sender, JsonElement a) { var e = new MouseEventArgs(); Fill(e, sender, a); return e; }
    }
    public class MouseButtonEventArgs : MouseEventArgs
    {
        public MouseButton ChangedButton { get; set; }
        public MouseButtonState ButtonState { get; set; }
        public int ClickCount { get; set; } = 1;
        public MouseButtonEventArgs() { }
        public MouseButtonEventArgs(MouseDevice d, int timestamp, MouseButton button) { ChangedButton = button; }
        internal new static MouseButtonEventArgs From(UIElement sender, JsonElement a)
        {
            var e = new MouseButtonEventArgs();
            Fill(e, sender, a);
            e.ChangedButton = (int)UIElement.D(a, "button") switch { 1 => MouseButton.Middle, 2 => MouseButton.Right, _ => MouseButton.Left };
            e.ButtonState = UIElement.S(a, "name") == "mouseup" ? MouseButtonState.Released : MouseButtonState.Pressed;
            e.ClickCount = Math.Max(1, (int)UIElement.D(a, "clicks"));
            return e;
        }
    }
    public class MouseWheelEventArgs : MouseEventArgs
    {
        public int Delta { get; set; }
        internal new static MouseWheelEventArgs From(UIElement sender, JsonElement a) { var e = new MouseWheelEventArgs(); Fill(e, sender, a); e.Delta = (int)UIElement.D(a, "delta"); return e; }
    }
    public class KeyEventArgs : InputEventArgs
    {
        public Key Key { get; set; }
        public Key SystemKey { get; set; }
        public bool IsRepeat { get; set; }
        public bool IsDown { get; set; }
        public bool IsUp => !IsDown;
        public bool IsToggled { get; set; }
        public KeyStates KeyStates => IsDown ? KeyStates.Down : KeyStates.None;
        public KeyboardDevice KeyboardDevice { get; } = new KeyboardDevice();
        public KeyEventArgs() { }
        public KeyEventArgs(KeyboardDevice d, object? src, int timestamp, Key key) { Key = key; }
        internal static KeyEventArgs From(UIElement sender, JsonElement a)
        {
            var e = new KeyEventArgs { Source = sender, OriginalSource = sender };
            e.Key = KeyMap.FromDom(UIElement.S(a, "code"), UIElement.S(a, "key"));
            e.IsRepeat = UIElement.B(a, "repeat");
            e.IsDown = UIElement.S(a, "name") != "keyup";
            Keyboard.Modifiers = (UIElement.B(a, "ctrl") ? ModifierKeys.Control : 0) | (UIElement.B(a, "shift") ? ModifierKeys.Shift : 0) | (UIElement.B(a, "alt") ? ModifierKeys.Alt : 0);
            Keyboard.Track(e.Key, e.IsDown);
            return e;
        }
    }
    public delegate void MouseEventHandler(object sender, MouseEventArgs e);
    public delegate void MouseButtonEventHandler(object sender, MouseButtonEventArgs e);
    public delegate void MouseWheelEventHandler(object sender, MouseWheelEventArgs e);
    public delegate void KeyEventHandler(object sender, KeyEventArgs e);
    public class TextCompositionEventArgs : InputEventArgs
    {
        public string Text { get; }
        public string ControlText => "";
        public string SystemText => "";
        public TextCompositionEventArgs(string text) { Text = text; }
    }
    public delegate void TextCompositionEventHandler(object sender, TextCompositionEventArgs e);
    public class DragEventArgs : RoutedEventArgs
    {
        public DataObject Data { get; set; } = new DataObject();
        public DragDropEffects Effects { get; set; }
        public DragDropEffects AllowedEffects { get; set; }
        public Point GetPosition(IInputElement? e) => new Point(0, 0);
    }
    public delegate void DragEventHandler(object sender, DragEventArgs e);
    [Flags] public enum DragDropEffects { None = 0, Copy = 1, Move = 2, Link = 4, Scroll = unchecked((int)0x80000000), All = Copy | Move | Scroll }
    public static class DragDrop { public static DragDropEffects DoDragDrop(DependencyObject src, object data, DragDropEffects allowed) => DragDropEffects.None; }

    public static class Keyboard
    {
        internal static readonly HashSet<Key> Down = new HashSet<Key>();
        public static ModifierKeys Modifiers { get; internal set; }
        public static IInputElement? FocusedElement { get; internal set; }
        internal static void Track(Key k, bool down) { if (down) Down.Add(k); else Down.Remove(k); }
        public static bool IsKeyDown(Key k) => Down.Contains(k);
        public static bool IsKeyUp(Key k) => !Down.Contains(k);
        public static bool IsKeyToggled(Key k) => false;
        public static IInputElement? Focus(IInputElement? e) { (e as UIElement)?.Focus(); FocusedElement = e; return e; }
        public static void ClearFocus() { FocusedElement = null; }
        public static KeyboardDevice PrimaryDevice { get; } = new KeyboardDevice();
        /// <summary>렌더러가 보내는 전역 키 상태</summary>
        public static void FromDom(JsonElement a)
        {
            var k = KeyMap.FromDom(UIElement.S(a, "code"), UIElement.S(a, "key"));
            Track(k, UIElement.S(a, "name") != "keyup");
            Modifiers = (UIElement.B(a, "ctrl") ? ModifierKeys.Control : 0) | (UIElement.B(a, "shift") ? ModifierKeys.Shift : 0) | (UIElement.B(a, "alt") ? ModifierKeys.Alt : 0);
        }
    }
    public static class Mouse
    {
        internal static double LastX, LastY;
        public static MouseButtonState LeftButton { get; internal set; }
        public static MouseButtonState RightButton { get; internal set; }
        public static Point GetPosition(IInputElement? relativeTo) => new Point(LastX, LastY);
        public static IInputElement? Captured { get; internal set; }
        public static bool Capture(IInputElement? e) { Captured = e; return true; }
        public static Cursor? OverrideCursor { get; set; }
        public static MouseDevice PrimaryDevice { get; } = new MouseDevice();
        public static void FromDom(JsonElement a) { LastX = UIElement.D(a, "wx"); LastY = UIElement.D(a, "wy"); var b = (int)UIElement.D(a, "buttons"); LeftButton = (b & 1) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released; RightButton = (b & 2) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released; }
    }

    public class Cursor
    {
        public string Css { get; }
        public Cursor(string css) { Css = css; }
        public override string ToString() => Css;
    }
    public static class Cursors
    {
        public static Cursor Arrow => new Cursor("default");
        public static Cursor Hand => new Cursor("pointer");
        public static Cursor Wait => new Cursor("wait");
        public static Cursor AppStarting => new Cursor("progress");
        public static Cursor Cross => new Cursor("crosshair");
        public static Cursor IBeam => new Cursor("text");
        public static Cursor No => new Cursor("not-allowed");
        public static Cursor None => new Cursor("none");
        public static Cursor Help => new Cursor("help");
        public static Cursor SizeAll => new Cursor("move");
        public static Cursor SizeNS => new Cursor("ns-resize");
        public static Cursor SizeWE => new Cursor("ew-resize");
        public static Cursor SizeNESW => new Cursor("nesw-resize");
        public static Cursor SizeNWSE => new Cursor("nwse-resize");
        public static Cursor Pen => new Cursor("crosshair");
        public static Cursor ScrollAll => new Cursor("all-scroll");
        public static Cursor UpArrow => new Cursor("default");
        public static Cursor Parse(string s) => s.Trim().ToLowerInvariant() switch
        {
            "hand" => Hand, "wait" => Wait, "cross" => Cross, "ibeam" => IBeam, "no" => No, "none" => None, "help" => Help, "sizeall" => SizeAll,
            "sizens" => SizeNS, "sizewe" => SizeWE, "sizenesw" => SizeNESW, "sizenwse" => SizeNWSE, "appstarting" => AppStarting, "pen" => Pen, "scrollall" => ScrollAll, _ => Arrow
        };
    }

    // ------------------------------------------------------------------ 명령
    public class ExecutedRoutedEventArgs : RoutedEventArgs { public ICommand Command { get; } public object? Parameter { get; } public ExecutedRoutedEventArgs(ICommand c, object? p) { Command = c; Parameter = p; } }
    public class CanExecuteRoutedEventArgs : RoutedEventArgs { public ICommand Command { get; } public object? Parameter { get; } public bool CanExecute { get; set; } public bool ContinueRouting { get; set; } public CanExecuteRoutedEventArgs(ICommand c, object? p) { Command = c; Parameter = p; } }
    public delegate void ExecutedRoutedEventHandler(object sender, ExecutedRoutedEventArgs e);
    public delegate void CanExecuteRoutedEventHandler(object sender, CanExecuteRoutedEventArgs e);

    public class CommandBinding
    {
        public ICommand? Command { get; set; }
        public event ExecutedRoutedEventHandler? Executed;
        public event CanExecuteRoutedEventHandler? CanExecute;
        public CommandBinding() { }
        public CommandBinding(ICommand command) { Command = command; }
        public CommandBinding(ICommand command, ExecutedRoutedEventHandler executed) { Command = command; Executed += executed; }
        public CommandBinding(ICommand command, ExecutedRoutedEventHandler executed, CanExecuteRoutedEventHandler? canExecute) { Command = command; Executed += executed; if (canExecute != null) CanExecute += canExecute; }
        internal bool CheckCanExecute(object sender, object? p)
        {
            if (CanExecute == null) return Executed != null;
            var e = new CanExecuteRoutedEventArgs(Command!, p) { Source = sender };
            CanExecute(sender, e);
            return e.CanExecute;
        }
        internal void Run(object sender, object? p) => Executed?.Invoke(sender, new ExecutedRoutedEventArgs(Command!, p) { Source = sender });
    }
    public class CommandBindingCollection : List<CommandBinding> { }
    public class InputBinding
    {
        public ICommand? Command { get; set; }
        public object? CommandParameter { get; set; }
        public InputGesture? Gesture { get; set; }
        public InputBinding() { }
        public InputBinding(ICommand c, InputGesture g) { Command = c; Gesture = g; }
    }
    public class KeyBinding : InputBinding
    {
        public Key Key { get; set; }
        public ModifierKeys Modifiers { get; set; }
        public KeyBinding() { }
        public KeyBinding(ICommand c, Key k, ModifierKeys m) { Command = c; Key = k; Modifiers = m; Gesture = new KeyGesture(k, m); }
        public KeyBinding(ICommand c, KeyGesture g) { Command = c; Key = g.Key; Modifiers = g.Modifiers; Gesture = g; }
    }
    public class InputBindingCollection : List<InputBinding> { }
    public abstract class InputGesture { }
    public class KeyGesture : InputGesture
    {
        public Key Key { get; }
        public ModifierKeys Modifiers { get; }
        public string DisplayString { get; }
        public KeyGesture(Key key) : this(key, ModifierKeys.None) { }
        public KeyGesture(Key key, ModifierKeys modifiers) { Key = key; Modifiers = modifiers; DisplayString = (modifiers.HasFlag(ModifierKeys.Control) ? "Ctrl+" : "") + (modifiers.HasFlag(ModifierKeys.Shift) ? "Shift+" : "") + (modifiers.HasFlag(ModifierKeys.Alt) ? "Alt+" : "") + key; }
        public KeyGesture(Key key, ModifierKeys modifiers, string display) : this(key, modifiers) { DisplayString = display; }
        public static KeyGesture Parse(string s)
        {
            var mods = ModifierKeys.None; Key key = Key.None;
            foreach (var part in s.Split('+'))
            {
                var p = part.Trim();
                if (p.Equals("Ctrl", StringComparison.OrdinalIgnoreCase) || p.Equals("Control", StringComparison.OrdinalIgnoreCase)) mods |= ModifierKeys.Control;
                else if (p.Equals("Shift", StringComparison.OrdinalIgnoreCase)) mods |= ModifierKeys.Shift;
                else if (p.Equals("Alt", StringComparison.OrdinalIgnoreCase)) mods |= ModifierKeys.Alt;
                else if (Enum.TryParse<Key>(p, true, out var k)) key = k;
            }
            return new KeyGesture(key, mods);
        }
        public bool Matches(Key key, ModifierKeys mods) => key == Key && mods == Modifiers;
    }

    /// <summary>라우트된 명령: 대상 요소에서 창까지 CommandBindings 를 찾아 실행한다</summary>
    public class RoutedCommand : ICommand
    {
        public string Name { get; }
        public Type? OwnerType { get; }
        public InputGestureCollection InputGestures { get; } = new InputGestureCollection();
        public RoutedCommand() { Name = ""; }
        public RoutedCommand(string name, Type ownerType) { Name = name; OwnerType = ownerType; }
        public RoutedCommand(string name, Type ownerType, InputGestureCollection gestures) : this(name, ownerType) { InputGestures = gestures; }
        public event EventHandler? CanExecuteChanged { add { CommandManager.RequerySuggested += value; } remove { CommandManager.RequerySuggested -= value; } }
        internal UIElement? Target;
        private CommandBinding? Find(IInputElement? target)
        {
            for (var e = (target as UIElement) ?? Target ?? (UIElement?)Application.Current?.MainWindow; e != null; e = (e as FrameworkElement)?.ParentElement)
                if (e is Controls.Control c) foreach (var b in c.CommandBindings) if (ReferenceEquals(b.Command, this)) return b;
            if (Application.Current?.MainWindow != null) foreach (var b in Application.Current.MainWindow.CommandBindings) if (ReferenceEquals(b.Command, this)) return b;
            return null;
        }
        public bool CanExecute(object? parameter) => CanExecute(parameter, null);
        public bool CanExecute(object? parameter, IInputElement? target) { var b = Find(target); return b != null && b.CheckCanExecute(target ?? (object)this, parameter); }
        public void Execute(object? parameter) => Execute(parameter, null);
        public void Execute(object? parameter, IInputElement? target) { var b = Find(target); if (b != null && b.CheckCanExecute(target ?? (object)this, parameter)) b.Run(target ?? (object)this, parameter); }
        public override string ToString() => Name;
    }
    public class RoutedUICommand : RoutedCommand
    {
        public string Text { get; set; }
        public RoutedUICommand() { Text = ""; }
        public RoutedUICommand(string text, string name, Type ownerType) : base(name, ownerType) { Text = text; }
        public RoutedUICommand(string text, string name, Type ownerType, InputGestureCollection gestures) : base(name, ownerType, gestures) { Text = text; }
    }
    public class InputGestureCollection : List<InputGesture> { }
    public static class ApplicationCommands
    {
        public static RoutedUICommand New { get; } = new RoutedUICommand("새로 만들기", "New", typeof(ApplicationCommands));
        public static RoutedUICommand Open { get; } = new RoutedUICommand("열기", "Open", typeof(ApplicationCommands));
        public static RoutedUICommand Save { get; } = new RoutedUICommand("저장", "Save", typeof(ApplicationCommands));
        public static RoutedUICommand SaveAs { get; } = new RoutedUICommand("다른 이름으로 저장", "SaveAs", typeof(ApplicationCommands));
        public static RoutedUICommand Close { get; } = new RoutedUICommand("닫기", "Close", typeof(ApplicationCommands));
        public static RoutedUICommand Print { get; } = new RoutedUICommand("인쇄", "Print", typeof(ApplicationCommands));
        public static RoutedUICommand Copy { get; } = new RoutedUICommand("복사", "Copy", typeof(ApplicationCommands));
        public static RoutedUICommand Cut { get; } = new RoutedUICommand("잘라내기", "Cut", typeof(ApplicationCommands));
        public static RoutedUICommand Paste { get; } = new RoutedUICommand("붙여넣기", "Paste", typeof(ApplicationCommands));
        public static RoutedUICommand Undo { get; } = new RoutedUICommand("실행 취소", "Undo", typeof(ApplicationCommands));
        public static RoutedUICommand Redo { get; } = new RoutedUICommand("다시 실행", "Redo", typeof(ApplicationCommands));
        public static RoutedUICommand Delete { get; } = new RoutedUICommand("삭제", "Delete", typeof(ApplicationCommands));
        public static RoutedUICommand SelectAll { get; } = new RoutedUICommand("모두 선택", "SelectAll", typeof(ApplicationCommands));
        public static RoutedUICommand Help { get; } = new RoutedUICommand("도움말", "Help", typeof(ApplicationCommands));
        public static RoutedUICommand Find { get; } = new RoutedUICommand("찾기", "Find", typeof(ApplicationCommands));
        public static RoutedUICommand Properties { get; } = new RoutedUICommand("속성", "Properties", typeof(ApplicationCommands));
        public static RoutedUICommand Stop { get; } = new RoutedUICommand("중지", "Stop", typeof(ApplicationCommands));
        public static RoutedUICommand NotACommand { get; } = new RoutedUICommand("", "NotACommand", typeof(ApplicationCommands));
    }
    public static class NavigationCommands
    {
        public static RoutedUICommand BrowseBack { get; } = new RoutedUICommand("뒤로", "BrowseBack", typeof(NavigationCommands));
        public static RoutedUICommand BrowseForward { get; } = new RoutedUICommand("앞으로", "BrowseForward", typeof(NavigationCommands));
        public static RoutedUICommand Refresh { get; } = new RoutedUICommand("새로 고침", "Refresh", typeof(NavigationCommands));
    }
    public static class CommandManager
    {
        public static event EventHandler? RequerySuggested;
        public static void InvalidateRequerySuggested() => RequerySuggested?.Invoke(null, EventArgs.Empty);
        internal static void Requery() => RequerySuggested?.Invoke(null, EventArgs.Empty);
        public static void RegisterClassCommandBinding(Type t, CommandBinding b) { }
    }
    public static class FocusManager
    {
        public static IInputElement? GetFocusedElement(DependencyObject d) => Keyboard.FocusedElement;
        public static void SetFocusedElement(DependencyObject d, IInputElement? e) => Keyboard.Focus(e);
    }
}

namespace System.Windows.Controls
{
    public class ContextMenuEventArgs : RoutedEventArgs { public double CursorLeft { get; set; } public double CursorTop { get; set; } }
    public delegate void ContextMenuEventHandler(object sender, ContextMenuEventArgs e);
}
