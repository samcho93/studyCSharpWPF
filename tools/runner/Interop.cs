using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text;
using System.Text.Json;

namespace CsRunner;

/// <summary>JS 워커 ↔ .NET 연결 (js/cs-worker.js 참조)</summary>
[SupportedOSPlatform("browser")]
public static partial class Interop
{
    // ------------------------------------------------------------ JS 가 제공 (runtime.setModuleImports('runner', {...}))
    [JSImport("write", "runner")] internal static partial void JsWrite(int fd, string text);
    [JSImport("readLine", "runner")] internal static partial string? JsReadLine();
    [JSImport("uiOps", "runner")] internal static partial void JsUiOps(string json);
    [JSImport("syncCall", "runner")] internal static partial string? JsSyncCall(string kind, string payload);
    [JSImport("appExit", "runner")] internal static partial void JsAppExit();
    [JSImport("canBlock", "runner")] internal static partial bool JsCanBlock();

    private sealed class ConsoleWriter : TextWriter
    {
        private readonly int _fd;
        public ConsoleWriter(int fd) { _fd = fd; }
        public override Encoding Encoding => Encoding.UTF8;
        public override void Write(char value) => JsWrite(_fd, value.ToString());
        public override void Write(string? value) { if (!string.IsNullOrEmpty(value)) JsWrite(_fd, value); }
        public override void Write(char[] buffer, int index, int count) => JsWrite(_fd, new string(buffer, index, count));
        public override void WriteLine(string? value) => JsWrite(_fd, (value ?? "") + "\n");
        public override void WriteLine() => JsWrite(_fd, "\n");
        public override string NewLine { get => "\n"; set { } }
    }

    // ------------------------------------------------------------ .NET 이 제공 (exports.CsRunner.Interop.*)
    [JSExport]
    internal static void Init()
    {
        WpfShim.Bridge.Write = JsWrite;
        WpfShim.Bridge.ReadLine = JsReadLine;
        WpfShim.Bridge.UiOps = JsUiOps;
        WpfShim.Bridge.SyncCall = JsSyncCall;
        WpfShim.Bridge.AppExit = () => { Executor.AppExited(); JsAppExit(); };
        WpfShim.Bridge.CanBlock = JsCanBlock();
        WpfShim.Bridge.NestedEvent = json => { using var d = JsonDocument.Parse(json); var r = d.RootElement; UiEvent(r.GetProperty("id").GetInt32(), r.GetProperty("name").GetString() ?? "", r.TryGetProperty("args", out var a) ? a.GetRawText() : "{}"); };
        // System.Console 을 직접 쓰는 코드도 웹 콘솔로 나가게
        Console.SetOut(new ConsoleWriter(1));
        Console.SetError(new ConsoleWriter(2));
        try { Console.SetIn(CsRunner.Runtime.Console.In); } catch { }
        try
        {
            var ko = new System.Globalization.CultureInfo("ko-KR");
            System.Globalization.CultureInfo.DefaultThreadCurrentCulture = ko;
            System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = ko;
            System.Globalization.CultureInfo.CurrentCulture = ko;
            System.Globalization.CultureInfo.CurrentUICulture = ko;
        }
        catch { /* ICU 데이터가 없으면 기본 문화권 사용 */ }
        try { Directory.CreateDirectory("/work"); Directory.SetCurrentDirectory("/work"); } catch { }
    }

    /// <summary>참조 어셈블리 등록 (JS 가 _framework 의 .dll 바이트를 넘긴다)</summary>
    [JSExport]
    internal static void AddReference(string name, byte[] bytes) => Compiler.AddReference(name, bytes);

    [JSExport]
    internal static string ReferenceNames() => JsonSerializer.Serialize(Compiler.WantedReferences);

    /// <summary>컴파일. filesJson = [{"name":"Program.cs","text":"..."}] → 결과 JSON</summary>
    [JSExport]
    internal static string Compile(string filesJson) => Compiler.Compile(filesJson);

    /// <summary>마지막으로 컴파일한 프로그램 실행 (WPF 앱이면 창이 모두 닫힐 때까지 기다린다)</summary>
    [JSExport]
    internal static Task<int> Run() => Executor.Run();

    /// <summary>DOM 이벤트 전달 (id 0 = 전역 키/마우스 상태)</summary>
    [JSExport]
    internal static void UiEvent(int id, string name, string argsJson)
    {
        if (id == 0)
        {
            using var d = JsonDocument.Parse(string.IsNullOrEmpty(argsJson) ? "{}" : argsJson);
            if (name == "keystate") System.Windows.Input.Keyboard.FromDom(d.RootElement);
            else if (name == "mousestate") System.Windows.Input.Mouse.FromDom(d.RootElement);
            return;
        }
        WpfShim.UiTree.Dispatch(id, name, argsJson);
    }

    [JSExport]
    internal static bool IsAppRunning() => WpfShim.UiTree.AppRunning && WpfShim.UiTree.OpenWindows.Count > 0;

    /// <summary>작업 폴더(/work)의 파일 목록 JSON</summary>
    [JSExport]
    internal static string ListFiles()
    {
        var list = new List<object>();
        try
        {
            foreach (var f in Directory.GetFiles("/work", "*", SearchOption.AllDirectories))
                list.Add(new { name = f.Substring("/work/".Length), size = new FileInfo(f).Length });
        }
        catch { }
        return JsonSerializer.Serialize(list);
    }
    [JSExport]
    internal static string? ReadFile(string name)
    {
        try { return File.ReadAllText(Path.Combine("/work", name)); } catch { return null; }
    }
    [JSExport]
    internal static void WriteFile(string name, string text)
    {
        try { var p = Path.Combine("/work", name); Directory.CreateDirectory(Path.GetDirectoryName(p)!); File.WriteAllText(p, text); } catch { }
    }
    [JSExport]
    internal static void ClearFiles()
    {
        try { foreach (var f in Directory.GetFiles("/work", "*", SearchOption.AllDirectories)) File.Delete(f); } catch { }
    }
}
