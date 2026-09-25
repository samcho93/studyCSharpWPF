using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

// 사용: Validator <codes.json> <result.json>
//   codes.json = [{ "id": "ch01-1#0", "code": "...", "stdin": "...", "compileOnly": false }]
//   result.json = [{ "id", "ok", "phase": "compile"|"run", "diagnostics": [..], "output": "...", "exit": 0, "windows": 1, "error": "..." }]
var inPath = args.Length > 0 ? args[0] : throw new ArgumentException("codes.json 경로가 필요합니다");
var outPath = args.Length > 1 ? args[1] : Path.ChangeExtension(inPath, ".result.json");
var items = JsonNode.Parse(File.ReadAllText(inPath))!.AsArray();

// 참조 어셈블리: 이 프로세스에 로드된 BCL + WpfShim
var tpa = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator);
foreach (var p in tpa)
{
    var name = Path.GetFileNameWithoutExtension(p);
    if (CsRunner.Compiler.WantedReferences.Contains(name, StringComparer.OrdinalIgnoreCase))
        CsRunner.Compiler.AddReference(name, File.ReadAllBytes(p));
}
CsRunner.Compiler.AddReference("WpfShim", File.ReadAllBytes(typeof(WpfShim.Bridge).Assembly.Location));

var results = new JsonArray();
var sb = new StringBuilder();
int windows = 0;
WpfShim.Bridge.Write = (fd, s) => { if (fd != 3) sb.Append(s); };
WpfShim.Bridge.UiOps = _ => { };
WpfShim.Bridge.SyncCall = (kind, payload) => kind == "msgbox" ? "OK" : kind == "dialog" ? "" : "";
WpfShim.Bridge.AppExit = () => { };
WpfShim.Bridge.CanBlock = false;
var origOut = Console.Out;
Console.SetOut(new Writer(sb));
Console.SetError(new Writer(sb));

foreach (var it in items)
{
    var id = it!["id"]!.GetValue<string>();
    var code = it["code"]!.GetValue<string>();
    var stdin = it["stdin"]?.GetValue<string>() ?? "";
    var compileOnly = it["compileOnly"]?.GetValue<bool>() ?? false;
    var files = SplitFiles(code);
    var r = new JsonObject { ["id"] = id };
    string resJson;
    try { resJson = CsRunner.Compiler.Compile(JsonSerializer.Serialize(files)); }
    catch (Exception ex) { r["ok"] = false; r["phase"] = "compile"; r["error"] = ex.ToString(); results.Add(r); continue; }
    var cr = JsonNode.Parse(resJson)!;
    r["diagnostics"] = JsonNode.Parse(cr["diagnostics"]!.ToJsonString());
    if (!(bool)cr["ok"]!) { r["ok"] = false; r["phase"] = "compile"; results.Add(r); continue; }
    if (compileOnly) { r["ok"] = true; r["phase"] = "compile"; results.Add(r); continue; }

    sb.Clear(); windows = 0;
    var lines = new Queue<string>(stdin.Replace("\r", "").Split('\n'));
    if (lines.Count > 0 && stdin.EndsWith("\n")) { var arr = lines.ToArray(); lines = new Queue<string>(arr.Take(arr.Length - 1)); }
    WpfShim.Bridge.ReadLine = () => lines.Count > 0 ? lines.Dequeue() : null;
    Console.SetIn(CsRunner.Runtime.Console.In);
    int exit = 0; string? error = null;
    try
    {
        var asm = Assembly.Load(CsRunner.Compiler.Assembly!);
        WpfShim.Bridge.UserAssembly = asm;
        WpfShim.UiTree.OpenWindows.Clear();
        WpfShim.UiTree.AppRunning = false;
        var ep = asm.EntryPoint!;
        var real = ep.DeclaringType?.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic).FirstOrDefault(m => (m.Name == "Main" || m.Name == "<Main>$") && (m.ReturnType == typeof(Task) || m.ReturnType == typeof(Task<int>)));
        var target = real ?? ep;
        var ps = target.GetParameters();
        var task = Task.Run(() =>
        {
            var res = target.Invoke(null, ps.Length == 1 ? new object[] { Array.Empty<string>() } : null);
            if (res is Task<int> ti) return ti.GetAwaiter().GetResult();
            if (res is Task t) { t.GetAwaiter().GetResult(); return 0; }
            return res is int i ? i : 0;
        });
        if (!task.Wait(TimeSpan.FromSeconds(20))) { error = "시간 초과 (20초) — 무한 반복 또는 입력 부족"; exit = -1; }
        else exit = task.Result;
        windows = WpfShim.UiTree.OpenWindows.Count;
        foreach (var w in WpfShim.UiTree.OpenWindows.ToArray()) { try { w.Close(); } catch { } }
        WpfShim.UiTree.AppRunning = false;
    }
    catch (Exception ex)
    {
        var inner = ex is TargetInvocationException tie && tie.InnerException != null ? tie.InnerException : ex is AggregateException ae && ae.InnerException != null ? (ae.InnerException is TargetInvocationException t2 && t2.InnerException != null ? t2.InnerException : ae.InnerException) : ex;
        error = inner.GetType().FullName + ": " + inner.Message;
        exit = 134;
    }
    r["ok"] = exit == 0 && error == null;
    r["phase"] = "run";
    r["output"] = sb.ToString();
    r["exit"] = exit;
    r["windows"] = windows;
    if (error != null) r["error"] = error;
    results.Add(r);
}
Console.SetOut(origOut);
File.WriteAllText(outPath, results.ToJsonString(new JsonSerializerOptions { WriteIndented = false, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }));
Console.WriteLine($"validated {results.Count} items → {outPath}");

static List<Dictionary<string, string>> SplitFiles(string code)
{
    var mark = new System.Text.RegularExpressions.Regex(@"^\s*//\s*=+\s*(?:file|파일)\s*:\s*([\w./-]+?\.(?:cs|xaml|txt|dat|csv|json|xml|md))\s*=*\s*$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
    var files = new List<Dictionary<string, string>>();
    var cur = new List<string>(); string name = "Program.cs"; bool any = false;
    foreach (var l in code.Replace("\r\n", "\n").Split('\n'))
    {
        var m = mark.Match(l);
        if (m.Success)
        {
            if (any || cur.Any(t => t.Trim().Length > 0)) files.Add(new() { ["name"] = name, ["text"] = string.Join("\n", cur) });
            name = m.Groups[1].Value; cur = new List<string>(); any = true;
        }
        else cur.Add(l);
    }
    files.Add(new() { ["name"] = name, ["text"] = string.Join("\n", cur) });
    if (!any && System.Text.RegularExpressions.Regex.IsMatch(files[0]["text"], @"^\s*<(Window|UserControl|Application|Page)\b")) files[0]["name"] = "MainWindow.xaml";
    return files;
}

sealed class Writer : TextWriter
{
    private readonly StringBuilder _sb;
    public Writer(StringBuilder sb) { _sb = sb; }
    public override Encoding Encoding => Encoding.UTF8;
    public override void Write(char value) => _sb.Append(value);
    public override void Write(string? value) => _sb.Append(value);
}
