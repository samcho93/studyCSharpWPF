using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Windows;

namespace WpfShim
{
    /// <summary>
    /// 요소 등록 · 렌더러(브라우저 메인 스레드)로 보낼 명령 모으기 · DOM 이벤트 전달.
    /// 명령은 JSON 배열 [ ["new", id, type], ["prop", id, name, value], ["children", id, [ids]], ["window", id, action, props], ... ] 로 보낸다.
    /// </summary>
    public static class UiTree
    {
        private static int _seq;
        private static readonly Dictionary<int, UIElement> _elements = new Dictionary<int, UIElement>();
        private static readonly List<object?[]> _ops = new List<object?[]>();
        private static int _depth;        // 이벤트 처리 중첩 깊이
        public static readonly List<Window> OpenWindows = new List<Window>();
        public static bool AppRunning;
        public static Action? OnIdle;      // 이벤트 처리가 끝날 때(RequerySuggested 등)

        public static int NextId() => ++_seq;
        public static void Register(UIElement el) { _elements[el.Id] = el; }
        public static UIElement? Get(int id) => _elements.TryGetValue(id, out var e) ? e : null;

        public static void Op(params object?[] op) { _ops.Add(op); }
        public static void Prop(int id, string name, object? value) => Op("prop", id, name, Conv.ToWire(value));
        public static void Children(int id, IList<int> ids) => Op("children", id, ids);

        /// <summary>모아 둔 명령을 렌더러로 보낸다</summary>
        public static void Flush()
        {
            if (_ops.Count == 0) return;
            var json = JsonSerializer.Serialize(_ops);
            _ops.Clear();
            Bridge.UiOps(json);
        }

        /// <summary>DOM 이벤트 처리 (JS → .NET). argsJson: {"name":..,"x":..,...}</summary>
        public static void Dispatch(int id, string name, string argsJson)
        {
            _depth++;
            try
            {
                if (_elements.TryGetValue(id, out var el))
                {
                    using var doc = JsonDocument.Parse(string.IsNullOrEmpty(argsJson) ? "{}" : argsJson);
                    el.HandleDomEvent(name, doc.RootElement);
                }
            }
            catch (Exception ex)
            {
                ReportException(ex);
            }
            finally
            {
                _depth--;
                if (_depth == 0) { try { OnIdle?.Invoke(); } catch { } Flush(); }
            }
        }

        /// <summary>처리되지 않은 예외를 콘솔에 표시한다 (WPF 는 이 경우 앱이 종료되지만 여기서는 계속 실행)</summary>
        public static void ReportException(Exception ex)
        {
            if (ex is System.Reflection.TargetInvocationException tie && tie.InnerException != null) ex = tie.InnerException;
            Bridge.Write(2, "처리되지 않은 예외: " + ex.GetType().FullName + ": " + ex.Message + "\n" + Trim(ex.StackTrace) + "\n");
        }
        private static string Trim(string? st)
        {
            if (string.IsNullOrEmpty(st)) return "";
            var lines = new List<string>();
            foreach (var l in st.Split('\n'))
            {
                var s = l.TrimEnd('\r');
                if (s.Contains("WpfShim.") || s.Contains("System.Windows.") || s.Contains("CsRunner.") || s.Contains("System.Reflection") || s.Contains("System.RuntimeMethodHandle") || s.Contains("System.RuntimeType")) continue;
                lines.Add(s);
            }
            return string.Join("\n", lines);
        }

        /// <summary>동기 호출(모달 대기). 대기 중 들어오는 이벤트는 NestedEvent 로 처리된다.</summary>
        public static string? SyncCall(string kind, string payload)
        {
            Flush();
            return Bridge.SyncCall(kind, payload);
        }

        public static void WindowOpened(Window w) { if (!OpenWindows.Contains(w)) OpenWindows.Add(w); }
        public static void WindowClosed(Window w)
        {
            OpenWindows.Remove(w);
            if (OpenWindows.Count == 0 && AppRunning && Application.Current != null && Application.Current.ShutdownMode == ShutdownMode.OnLastWindowClose)
                Application.Current.Shutdown();
        }

        public static string Json(object? o) => JsonSerializer.Serialize(o);
        public static string F(double d) => d.ToString(CultureInfo.InvariantCulture);
    }
}
