using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;

namespace CsRunner.Runtime
{
    /// <summary>
    /// 브라우저용 Console. 사용자 코드에는 <c>global using Console = CsRunner.Runtime.Console;</c> 로 주입되어
    /// System.Console 대신 쓰인다 (ReadKey · 색 · Clear 등을 웹 콘솔에 맞게 처리).
    /// </summary>
    public static class Console
    {
        private sealed class OutWriter : TextWriter
        {
            private readonly int _fd;
            public OutWriter(int fd) { _fd = fd; }
            public override Encoding Encoding => Encoding.UTF8;
            public override void Write(char value) => WpfShim.Bridge.Write(_fd, value.ToString());
            public override void Write(string? value) { if (!string.IsNullOrEmpty(value)) WpfShim.Bridge.Write(_fd, value); }
            public override void Write(char[] buffer, int index, int count) => WpfShim.Bridge.Write(_fd, new string(buffer, index, count));
            public override void WriteLine() => WpfShim.Bridge.Write(_fd, "\n");
            public override void WriteLine(string? value) => WpfShim.Bridge.Write(_fd, (value ?? "") + "\n");
            public override string NewLine { get => "\n"; set { } }
        }

        private sealed class InReader : TextReader
        {
            private string? _pending;   // ReadLine 으로 받아 둔 줄 중 아직 읽지 않은 부분
            private bool _eof;
            private string? Fetch()
            {
                if (_eof) return null;
                var s = WpfShim.Bridge.ReadLine();
                if (s == null) { _eof = true; return null; }
                return s;
            }
            public override string? ReadLine()
            {
                if (_pending != null) { var p = _pending; _pending = null; return p; }
                return Fetch();
            }
            public override int Read()
            {
                if (string.IsNullOrEmpty(_pending))
                {
                    var s = Fetch();
                    if (s == null) return -1;
                    _pending = s + "\n";
                }
                var c = _pending[0];
                _pending = _pending.Length > 1 ? _pending.Substring(1) : null;
                return c;
            }
            public override int Peek()
            {
                if (string.IsNullOrEmpty(_pending))
                {
                    var s = Fetch();
                    if (s == null) return -1;
                    _pending = s + "\n";
                }
                return _pending[0];
            }
            public override string ReadToEnd()
            {
                var sb = new StringBuilder();
                if (_pending != null) { sb.Append(_pending); _pending = null; }
                string? s;
                while ((s = Fetch()) != null) sb.Append(s).Append('\n');
                return sb.ToString();
            }
        }

        private static readonly OutWriter _out = new OutWriter(1);
        private static readonly OutWriter _err = new OutWriter(2);
        private static readonly InReader _in = new InReader();

        public static TextWriter Out => _out;
        public static TextWriter Error => _err;
        public static TextReader In => _in;
        public static Encoding OutputEncoding { get; set; } = Encoding.UTF8;
        public static Encoding InputEncoding { get; set; } = Encoding.UTF8;
        public static string Title { get; set; } = "";
        public static bool CursorVisible { get; set; } = true;
        public static int CursorLeft { get; set; }
        public static int CursorTop { get; set; }
        public static int WindowWidth { get; set; } = 100;
        public static int WindowHeight { get; set; } = 30;
        public static int BufferWidth { get; set; } = 100;
        public static int BufferHeight { get; set; } = 300;
        public static int LargestWindowWidth => 200;
        public static int LargestWindowHeight => 60;
        public static bool KeyAvailable => false;
        public static bool IsInputRedirected => false;
        public static bool IsOutputRedirected => false;
        public static bool IsErrorRedirected => false;
        public static bool TreatControlCAsInput { get; set; }
        public static bool NumberLock => false;
        public static bool CapsLock => false;
        public static event ConsoleCancelEventHandler? CancelKeyPress;

        private static ConsoleColor _fg = ConsoleColor.Gray, _bg = ConsoleColor.Black;
        public static ConsoleColor ForegroundColor
        {
            get => _fg;
            set { _fg = value; WpfShim.Bridge.Write(3, "fg:" + (int)value); }
        }
        public static ConsoleColor BackgroundColor
        {
            get => _bg;
            set { _bg = value; WpfShim.Bridge.Write(3, "bg:" + (int)value); }
        }
        public static void ResetColor() { _fg = ConsoleColor.Gray; _bg = ConsoleColor.Black; WpfShim.Bridge.Write(3, "reset"); }
        public static void Clear() => WpfShim.Bridge.Write(3, "clear");
        public static void Beep() => WpfShim.Bridge.Write(3, "beep");
        public static void Beep(int frequency, int duration) => WpfShim.Bridge.Write(3, "beep");
        public static void SetCursorPosition(int left, int top) { CursorLeft = left; CursorTop = top; }
        public static (int Left, int Top) GetCursorPosition() => (CursorLeft, CursorTop);
        public static void SetWindowSize(int width, int height) { WindowWidth = width; WindowHeight = height; }
        public static void SetBufferSize(int width, int height) { BufferWidth = width; BufferHeight = height; }
        public static void SetOut(TextWriter newOut) => System.Console.SetOut(newOut);
        public static void SetIn(TextReader newIn) => System.Console.SetIn(newIn);
        public static void SetError(TextWriter newError) => System.Console.SetError(newError);
        public static Stream OpenStandardOutput() => System.Console.OpenStandardOutput();
        public static Stream OpenStandardInput() => System.Console.OpenStandardInput();
        public static Stream OpenStandardError() => System.Console.OpenStandardError();

        // ------------------------------------------------------------ 출력
        public static void Write(string? value) => _out.Write(value);
        public static void Write(object? value) => _out.Write(value?.ToString());
        public static void Write(bool value) => _out.Write(value ? "True" : "False");
        public static void Write(char value) => _out.Write(value);
        public static void Write(char[]? buffer) { if (buffer != null) _out.Write(new string(buffer)); }
        public static void Write(char[] buffer, int index, int count) => _out.Write(buffer, index, count);
        public static void Write(int value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(uint value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(long value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(ulong value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(float value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(double value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(decimal value) => _out.Write(value.ToString(CultureInfo.CurrentCulture));
        public static void Write(string format, object? arg0) => _out.Write(string.Format(format, arg0));
        public static void Write(string format, object? arg0, object? arg1) => _out.Write(string.Format(format, arg0, arg1));
        public static void Write(string format, object? arg0, object? arg1, object? arg2) => _out.Write(string.Format(format, arg0, arg1, arg2));
        public static void Write(string format, params object?[] args) => _out.Write(string.Format(format, args));

        public static void WriteLine() => _out.WriteLine();
        public static void WriteLine(string? value) => _out.WriteLine(value);
        public static void WriteLine(object? value) => _out.WriteLine(value?.ToString());
        public static void WriteLine(bool value) => _out.WriteLine(value ? "True" : "False");
        public static void WriteLine(char value) => _out.WriteLine(value.ToString());
        public static void WriteLine(char[]? buffer) => _out.WriteLine(buffer == null ? "" : new string(buffer));
        public static void WriteLine(char[] buffer, int index, int count) => _out.WriteLine(new string(buffer, index, count));
        public static void WriteLine(int value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(uint value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(long value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(ulong value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(float value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(double value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(decimal value) => _out.WriteLine(value.ToString(CultureInfo.CurrentCulture));
        public static void WriteLine(string format, object? arg0) => _out.WriteLine(string.Format(format, arg0));
        public static void WriteLine(string format, object? arg0, object? arg1) => _out.WriteLine(string.Format(format, arg0, arg1));
        public static void WriteLine(string format, object? arg0, object? arg1, object? arg2) => _out.WriteLine(string.Format(format, arg0, arg1, arg2));
        public static void WriteLine(string format, params object?[] args) => _out.WriteLine(string.Format(format, args));

        // ------------------------------------------------------------ 입력
        public static string? ReadLine() => _in.ReadLine();
        public static int Read() => _in.Read();

        /// <summary>한 글자 입력: 웹 콘솔에서는 한 줄을 입력받아 첫 글자를 돌려준다 (Enter 만 누르면 Enter 키)</summary>
        public static ConsoleKeyInfo ReadKey() => ReadKey(false);
        public static ConsoleKeyInfo ReadKey(bool intercept)
        {
            var line = _in.ReadLine();
            if (string.IsNullOrEmpty(line)) return new ConsoleKeyInfo('\r', ConsoleKey.Enter, false, false, false);
            var c = line[0];
            if (line.Length > 1) { /* 나머지 글자는 버린다 (ReadKey 는 한 글자만) */ }
            var key = CharToKey(c, out bool shift);
            return new ConsoleKeyInfo(c, key, shift, false, false);
        }

        private static ConsoleKey CharToKey(char c, out bool shift)
        {
            shift = char.IsUpper(c);
            if (char.IsLetter(c) && c < 128) return (ConsoleKey)((int)ConsoleKey.A + (char.ToUpperInvariant(c) - 'A'));
            if (char.IsDigit(c)) return (ConsoleKey)((int)ConsoleKey.D0 + (c - '0'));
            switch (c)
            {
                case ' ': return ConsoleKey.Spacebar;
                case '\t': return ConsoleKey.Tab;
                case '\b': return ConsoleKey.Backspace;
                case (char)27: return ConsoleKey.Escape;
                case '+': return ConsoleKey.Add;
                case '-': return ConsoleKey.Subtract;
                case '*': return ConsoleKey.Multiply;
                case '/': return ConsoleKey.Divide;
                case '.': return ConsoleKey.OemPeriod;
                case ',': return ConsoleKey.OemComma;
                default: return ConsoleKey.NoName;
            }
        }
    }
}
