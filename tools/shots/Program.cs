using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

// WPF 예제 실행 화면 캡처 도구
// 사용: Shots <items.json> <outDir> [--only id] [--keep]
//   items.json = [{ "id": "ch13-1-0", "code": "...", "delay": 1500 }]
//   결과: <outDir>/<id>.png, <outDir>/index.json (캡처된 id 목록), <outDir>/shots.log
//
// 방식
//  - 일괄(batch): App.xaml · Main 이 없는 예제는 한 WPF 프로젝트에 모아(예제마다 네임스페이스를 바꿔) 한 번만 빌드하고,
//    한 프로세스가 창을 차례로 띄운다. 창이 뜨면 이 도구가 PrintWindow 로 창을 캡처하고 다음 창으로 넘어가게 한다.
//  - 개별(single): App.xaml · 직접 쓴 Main · 데이터 파일이 있는 예제는 예제마다 프로젝트를 만들어 실행한다.
var inPath = args[0];
var outDir = Path.GetFullPath(args[1]);
string? only = null; bool keep = false;
for (int i = 2; i < args.Length; i++) { if (args[i] == "--only") only = args[++i]; else if (args[i] == "--keep") keep = true; }
Directory.CreateDirectory(outDir);
var all = JsonNode.Parse(File.ReadAllText(inPath))!.AsArray()
    .Select(n => new Item(n!["id"]!.GetValue<string>(), n["code"]!.GetValue<string>(), n["delay"]?.GetValue<int>() ?? 1500))
    .Where(it => only == null || it.Id == only).ToList();
var root = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", ".."));   // bin/Release/net9.0-windows → tools/shots
var workRoot = Path.Combine(root, "work");
Directory.CreateDirectory(workRoot);
var indexPath = Path.Combine(outDir, "index.json");
var index = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
if (File.Exists(indexPath)) foreach (var n in JsonNode.Parse(File.ReadAllText(indexPath))!.AsArray()) index.Add(n!.GetValue<string>());
var log = new List<string>();
void Log(string s) { log.Add(s); Console.WriteLine(s); }
int ok = 0, fail = 0;

// 같은 코드는 한 번만 캡처하고 복사한다
var groups = all.GroupBy(it => Hash(it.Code)).ToList();
var batch = new List<Item>(); var single = new List<Item>();
foreach (var g in groups)
{
    var first = g.First();
    var files = SplitFiles(first.Code);
    bool needSingle = files.Any(f => f.name.Equals("App.xaml", StringComparison.OrdinalIgnoreCase))
        || files.Any(f => !f.name.EndsWith(".cs") && !f.name.EndsWith(".xaml"))
        || files.Any(f => f.name.EndsWith(".cs") && Regex.IsMatch(f.text, @"static\s+(async\s+)?(void|int|Task)\s+Main\s*\("));
    (needSingle ? single : batch).Add(first);
}
var dupOf = groups.ToDictionary(g => g.First().Id, g => g.Skip(1).Select(x => x.Id).ToList());
void Saved(string id)
{
    index.Add(id); ok++;
    foreach (var d in dupOf.GetValueOrDefault(id) ?? new List<string>())
    {
        File.Copy(Path.Combine(outDir, id + ".png"), Path.Combine(outDir, d + ".png"), true);
        index.Add(d); ok++;
        Log($"  = {d} (같은 코드 → {id} 복사)");
    }
}

if (batch.Count > 0) RunBatch(batch);
foreach (var it in single) RunSingle(it);

File.WriteAllText(indexPath, JsonSerializer.Serialize(index.OrderBy(x => x).ToList(), new JsonSerializerOptions { WriteIndented = true }));
File.WriteAllText(Path.Combine(outDir, "shots.log"), string.Join("\n", log));
Console.WriteLine($"완료: 성공 {ok}, 실패 {fail} → {indexPath}");
return fail > 0 ? 1 : 0;

// ================================================================== 일괄 캡처
void RunBatch(List<Item> items)
{
    var dir = Path.Combine(workRoot, "_batch");
    if (Directory.Exists(dir)) { try { Directory.Delete(dir, true); } catch { } }
    Directory.CreateDirectory(dir);
    var entries = new Dictionary<int, (Item item, string type)>();
    for (int i = 0; i < items.Count; i++)
    {
        var it = items[i];
        var files = SplitFiles(it.Code);
        var win = files.FirstOrDefault(f => f.name.EndsWith(".xaml") && Regex.IsMatch(f.text, @"^\s*<Window\b", RegexOptions.Multiline));
        var m = win.text == null ? null : Regex.Match(win.text, @"x:Class\s*=\s*""([^""]+)""");
        if (m == null || !m.Success) { fail++; Log($"✗ {it.Id}: Window 의 x:Class 를 찾지 못했습니다"); continue; }
        var full = m.Groups[1].Value;
        var dot = full.LastIndexOf('.');
        var ns = dot > 0 ? full.Substring(0, dot) : "";
        var cls = dot > 0 ? full.Substring(dot + 1) : full;
        var newNs = $"B{i}_" + (ns.Length > 0 ? ns.Replace('.', '_') : "Root");
        var sub = Path.Combine(dir, "I" + i);
        Directory.CreateDirectory(sub);
        foreach (var (name, text) in files)
        {
            var t = ns.Length > 0 ? RenameNamespace(text, ns, newNs) : text.Replace("x:Class=\"" + cls + "\"", "x:Class=\"" + newNs + "." + cls + "\"");
            if (ns.Length == 0 && name.EndsWith(".cs")) t = "namespace " + newNs + " {\n" + t + "\n}";
            var p = Path.Combine(sub, name);
            Directory.CreateDirectory(Path.GetDirectoryName(p)!);
            File.WriteAllText(p, t, new UTF8Encoding(true));
        }
        entries[i] = (it, newNs + "." + cls);
    }
    File.WriteAllText(Path.Combine(dir, "ShotBatch.csproj"), Csproj("Exe", false), new UTF8Encoding(true));
    File.WriteAllText(Path.Combine(dir, "__ShotBatch.cs"), BatchHost(), new UTF8Encoding(true));
    // 빌드: 컴파일 오류가 난 예제는 빼고 다시 빌드
    for (int attempt = 0; attempt < 4 && entries.Count > 0; attempt++)
    {
        var b = Run("dotnet", "build -c Release -nologo -v q -p:UseSharedCompilation=true", dir, 900000);
        if (b.exit == 0) goto built;
        var bad = new HashSet<int>();
        foreach (Match em in Regex.Matches(b.output, @"[\\/]I(\d+)[\\/][^\r\n]*?(error [A-Z]+\d+[^\r\n]*)"))
        {
            var k = int.Parse(em.Groups[1].Value);
            if (bad.Add(k) && entries.TryGetValue(k, out var e)) { fail++; Log($"✗ {e.item.Id}: 빌드 실패 — {em.Groups[2].Value.Trim()}"); }
        }
        if (bad.Count == 0) { foreach (var e in entries.Values) { fail++; Log($"✗ {e.item.Id}: 일괄 빌드 실패\n{Trim(b.output, 15)}"); } return; }
        foreach (var k in bad) { entries.Remove(k); try { Directory.Delete(Path.Combine(dir, "I" + k), true); } catch { } }
    }
    if (entries.Count == 0) return;
    built:
    var exe = Directory.GetFiles(Path.Combine(dir, "bin", "Release"), "ShotBatch.exe", SearchOption.AllDirectories).FirstOrDefault();
    if (exe == null) { foreach (var e in entries.Values) { fail++; Log($"✗ {e.item.Id}: exe 없음"); } return; }
    var listFile = Path.Combine(dir, "list.txt");
    File.WriteAllLines(listFile, entries.Values.Select(e => $"{e.item.Id}|{e.type}|{e.item.Delay}"));
    Log($"일괄 실행: 창 {entries.Count}개");
    var psi = new ProcessStartInfo(exe, $"\"{listFile}\"") { WorkingDirectory = Path.GetDirectoryName(exe)!, UseShellExecute = false, RedirectStandardInput = true, RedirectStandardOutput = true, RedirectStandardError = true, StandardOutputEncoding = Encoding.UTF8 };
    using var proc = Process.Start(psi)!;
    var pending = new HashSet<string>(entries.Values.Select(e => e.item.Id));
    var sw = Stopwatch.StartNew();
    while (true)
    {
        var lineTask = proc.StandardOutput.ReadLineAsync();
        // 첫 창은 프로세스 시작 · JIT 때문에 오래 걸릴 수 있다
        if (!lineTask.Wait(TimeSpan.FromSeconds(pending.Count == entries.Count ? 300 : 120))) { Log("  (일괄 실행 응답 없음 — 중단)"); break; }
        var line = lineTask.Result;
        if (line == null || line == "DONE") break;
        if (line.StartsWith("SHOW "))
        {
            var p = line.Split(' ');
            var id = p[1]; var h = new IntPtr(long.Parse(p[2]));
            try
            {
                using var bmp = CaptureWindow(h) ?? CaptureScreen(GetBounds(h));
                bmp.Save(Path.Combine(outDir, id + ".png"), ImageFormat.Png);
                Log($"✓ {id} ({bmp.Width}x{bmp.Height}, {sw.Elapsed.TotalSeconds:0}s)");
                pending.Remove(id);
                Saved(id);
            }
            catch (Exception ex) { fail++; pending.Remove(id); Log($"✗ {id}: 캡처 실패 — {ex.Message}"); }
            proc.StandardInput.WriteLine("NEXT"); proc.StandardInput.Flush();
        }
        else if (line.StartsWith("FAIL "))
        {
            var rest = line.Substring(5); var sp = rest.IndexOf(' ');
            var id = sp > 0 ? rest.Substring(0, sp) : rest;
            if (pending.Remove(id)) { fail++; Log($"✗ {id}: 실행 오류 — {(sp > 0 ? rest.Substring(sp + 1) : "")}"); }
        }
    }
    try { if (!proc.HasExited) proc.Kill(true); } catch { }
    foreach (var id in pending) { fail++; Log($"✗ {id}: 창이 뜨지 않음"); }
    if (!keep) { try { Directory.Delete(dir, true); } catch { } }
}

// ================================================================== 개별 캡처
void RunSingle(Item it)
{
    var sw = Stopwatch.StartNew();
    try
    {
        var dir = Path.Combine(workRoot, Sanitize(it.Id));
        if (Directory.Exists(dir)) Directory.Delete(dir, true);
        Directory.CreateDirectory(dir);
        var files = SplitFiles(it.Code);
        bool hasApp = files.Any(f => f.name.Equals("App.xaml", StringComparison.OrdinalIgnoreCase));
        string? mainClass = null;
        foreach (var (name, text) in files)
        {
            var p = Path.Combine(dir, name);
            Directory.CreateDirectory(Path.GetDirectoryName(p)!);
            File.WriteAllText(p, text, new UTF8Encoding(true));
            if (mainClass == null && name.EndsWith(".xaml", StringComparison.OrdinalIgnoreCase) && !name.Equals("App.xaml", StringComparison.OrdinalIgnoreCase))
            {
                var m = Regex.Match(text, @"x:Class\s*=\s*""([^""]+)""");
                if (m.Success && Regex.IsMatch(text, @"^\s*<Window\b", RegexOptions.Multiline)) mainClass = m.Groups[1].Value;
            }
        }
        bool userMain = files.Any(f => f.name.EndsWith(".cs") && Regex.IsMatch(f.text, @"static\s+(async\s+)?(void|int|Task)\s+Main\s*\("));
        if (!hasApp && !userMain)
        {
            if (mainClass == null) throw new Exception("Window 의 x:Class 를 찾지 못했습니다");
            File.WriteAllText(Path.Combine(dir, "__Entry.cs"), $"internal static class __Entry {{ [System.STAThread] public static void Main() {{ new System.Windows.Application().Run(new {mainClass}()); }} }}", new UTF8Encoding(true));
        }
        // 데이터 파일(.txt 등)은 실행 폴더로 복사
        var csproj = Csproj("WinExe", hasApp).Replace("</Project>", "  <ItemGroup><None Update=\"**/*.txt;**/*.csv;**/*.json;**/*.dat\" CopyToOutputDirectory=\"PreserveNewest\" /></ItemGroup>\n</Project>");
        File.WriteAllText(Path.Combine(dir, "ShotApp.csproj"), csproj, new UTF8Encoding(true));
        var build = Run("dotnet", "build -c Release -nologo -v q -p:UseSharedCompilation=true", dir, 600000);
        if (build.exit != 0) throw new Exception("빌드 실패:\n" + Trim(build.output, 20));
        var exe = Directory.GetFiles(Path.Combine(dir, "bin", "Release"), "ShotApp.exe", SearchOption.AllDirectories).FirstOrDefault() ?? throw new Exception("exe 없음");
        using var proc = Process.Start(new ProcessStartInfo(exe) { WorkingDirectory = Path.GetDirectoryName(exe)!, UseShellExecute = false })!;
        IntPtr hwnd = IntPtr.Zero;
        var t0 = Environment.TickCount64;
        while (Environment.TickCount64 - t0 < 180000)
        {
            Thread.Sleep(200);
            if (proc.HasExited) break;
            hwnd = FindMainWindow(proc.Id);
            if (hwnd != IntPtr.Zero) break;
        }
        if (hwnd == IntPtr.Zero)
        {
            if (!proc.HasExited) proc.Kill();
            var ef = Path.Combine(Path.GetDirectoryName(exe)!, "shot-error.txt");
            throw new Exception((proc.HasExited ? $"프로그램이 창을 띄우지 않고 종료됨 (종료 코드 {proc.ExitCode})" : "창을 찾지 못함") + (File.Exists(ef) ? "\n" + Trim(File.ReadAllText(ef), 8) : ""));
        }
        Thread.Sleep(it.Delay);
        using var bmp = CaptureWindow(hwnd) ?? CaptureScreen(GetBounds(hwnd));
        bmp.Save(Path.Combine(outDir, it.Id + ".png"), ImageFormat.Png);
        try { if (!proc.HasExited) proc.Kill(true); } catch { }
        Log($"✓ {it.Id} (개별, {sw.Elapsed.TotalSeconds:0.0}s, {bmp.Width}x{bmp.Height})");
        Saved(it.Id);
        if (!keep) { try { Directory.Delete(dir, true); } catch { } }
    }
    catch (Exception ex) { fail++; Log($"✗ {it.Id}: {ex.Message}"); }
}

// ================================================================== 도우미
static string Csproj(string outputType, bool appDefinition) => $@"<Project Sdk=""Microsoft.NET.Sdk"">
  <PropertyGroup>
    <OutputType>{outputType}</OutputType>
    <TargetFramework>net9.0-windows</TargetFramework>
    <Nullable>disable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <NoWarn>$(NoWarn);CS8632;CS0168;CS0219;CS1998;CS0162;CS0414;CS0649;CS0169;CS0067;CS0108</NoWarn>
    <SatelliteResourceLanguages>en</SatelliteResourceLanguages>
    <EnableDefaultApplicationDefinition>{(appDefinition ? "true" : "false")}</EnableDefaultApplicationDefinition>
  </PropertyGroup>
</Project>";

// 일괄 실행 프로그램: 창을 하나씩 띄우고 "SHOW id hwnd" 를 알린 뒤, 캡처가 끝났다는 "NEXT" 를 받으면 다음 창으로
static string BatchHost() => @"
internal static class __ShotBatch
{
    [System.STAThread]
    public static void Main(string[] args)
    {
        var list = System.IO.File.ReadAllLines(args[0]);
        var app = new System.Windows.Application { ShutdownMode = System.Windows.ShutdownMode.OnExplicitShutdown };
        string current = """";
        app.DispatcherUnhandledException += (s, e) =>
        {
            System.Console.WriteLine(""FAIL "" + current + "" "" + e.Exception.GetType().Name + "": "" + e.Exception.Message.Replace('\r', ' ').Replace('\n', ' '));
            System.Console.Out.Flush();
            e.Handled = true;
        };
        app.Startup += async (s, e) =>
        {
            foreach (var line in list)
            {
                var p = line.Split('|');
                current = p[0];
                System.Windows.Window w = null;
                try
                {
                    var t = typeof(__ShotBatch).Assembly.GetType(p[1], true);
                    w = (System.Windows.Window)System.Activator.CreateInstance(t);
                    w.Show();
                    w.Activate();
                    await System.Threading.Tasks.Task.Delay(int.Parse(p[2]));
                    await w.Dispatcher.InvokeAsync(() => { }, System.Windows.Threading.DispatcherPriority.ApplicationIdle);
                    var h = new System.Windows.Interop.WindowInteropHelper(w).Handle;
                    System.Console.WriteLine(""SHOW "" + current + "" "" + h.ToInt64());
                    System.Console.Out.Flush();
                    await System.Threading.Tasks.Task.Run(() => System.Console.ReadLine());
                }
                catch (System.Exception ex)
                {
                    var inner = ex is System.Reflection.TargetInvocationException tie && tie.InnerException != null ? tie.InnerException : ex;
                    System.Console.WriteLine(""FAIL "" + current + "" "" + inner.GetType().Name + "": "" + inner.Message.Replace('\r', ' ').Replace('\n', ' '));
                    System.Console.Out.Flush();
                }
                foreach (System.Windows.Window x in app.Windows) { try { x.Hide(); } catch { } }
            }
            System.Console.WriteLine(""DONE"");
            System.Console.Out.Flush();
            System.Environment.Exit(0);
        };
        app.Run();
    }
}";

static string RenameNamespace(string text, string ns, string newNs)
{
    var e = Regex.Escape(ns);
    text = Regex.Replace(text, @"\bnamespace\s+" + e + @"(?=[\s.;{])", "namespace " + newNs);
    text = Regex.Replace(text, @"x:Class\s*=\s*""" + e + @"\.", "x:Class=\"" + newNs + ".");
    text = Regex.Replace(text, @"clr-namespace:" + e + @"(?=[.;""])", "clr-namespace:" + newNs);
    text = Regex.Replace(text, @"\busing\s+" + e + @"(?=[.;])", "using " + newNs);
    text = Regex.Replace(text, @"(?<![\w.])" + e + @"\.(?=[A-Z])", newNs + ".");   // Ns.Type 처럼 완전한 이름으로 쓴 경우
    return text;
}
static string Hash(string s) => Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(s.Replace("\r\n", "\n").Trim())));
static string Sanitize(string s) => Regex.Replace(s, @"[^\w\-]", "_");
static string Trim(string s, int lines) => string.Join("\n", s.Split('\n').Where(l => l.Trim().Length > 0).Take(lines));
static List<(string name, string text)> SplitFiles(string code)
{
    var mark = new Regex(@"^\s*//\s*=+\s*(?:file|파일)\s*:\s*([\w./-]+?\.(?:cs|xaml|txt|dat|csv|json|xml|md))\s*=*\s*$", RegexOptions.IgnoreCase);
    var files = new List<(string, string)>();
    var cur = new List<string>(); string name = "Program.cs"; bool any = false;
    foreach (var l in code.Replace("\r\n", "\n").Split('\n'))
    {
        var m = mark.Match(l);
        if (m.Success) { if (any || cur.Any(t => t.Trim().Length > 0)) files.Add((name, string.Join("\n", cur))); name = m.Groups[1].Value; cur = new List<string>(); any = true; }
        else cur.Add(l);
    }
    files.Add((name, string.Join("\n", cur)));
    if (!any && Regex.IsMatch(files[0].Item2, @"^\s*<(Window|UserControl|Application|Page)\b")) files[0] = ("MainWindow.xaml", files[0].Item2);
    return files;
}
static (int exit, string output) Run(string file, string a, string cwd, int timeoutMs)
{
    var psi = new ProcessStartInfo(file, a) { WorkingDirectory = cwd, RedirectStandardOutput = true, RedirectStandardError = true, UseShellExecute = false, CreateNoWindow = true, StandardOutputEncoding = Encoding.UTF8, StandardErrorEncoding = Encoding.UTF8 };
    using var p = Process.Start(psi)!;
    var so = p.StandardOutput.ReadToEndAsync(); var se = p.StandardError.ReadToEndAsync();
    if (!p.WaitForExit(timeoutMs)) { try { p.Kill(true); } catch { } return (-1, "시간 초과"); }
    return (p.ExitCode, so.Result + se.Result);
}
static IntPtr FindMainWindow(int pid)
{
    IntPtr found = IntPtr.Zero;
    EnumWindows((h, l) =>
    {
        GetWindowThreadProcessId(h, out var wp);
        if (wp != pid || !IsWindowVisible(h)) return true;
        if (GetWindow(h, 4) != IntPtr.Zero) return true;   // GW_OWNER: 소유된 창(메시지 박스)은 건너뜀
        var r = GetBounds(h);
        if (r.Width < 40 || r.Height < 20) return true;
        found = h; return false;
    }, IntPtr.Zero);
    return found;
}
static Rectangle GetBounds(IntPtr hwnd)
{
    if (DwmGetWindowAttribute(hwnd, 9, out RECT r, Marshal.SizeOf<RECT>()) != 0) GetWindowRect(hwnd, out r);
    return Rectangle.FromLTRB(r.Left, r.Top, r.Right, r.Bottom);
}
/// <summary>PrintWindow(PW_RENDERFULLCONTENT) 로 창을 그려 받는다 — 다른 창에 가려져도 창 내용만 찍힌다. DWM 의 보이지 않는 테두리는 잘라낸다.</summary>
static Bitmap? CaptureWindow(IntPtr hwnd)
{
    if (!GetWindowRect(hwnd, out var wr)) return null;
    int w = wr.Right - wr.Left, h = wr.Bottom - wr.Top;
    if (w <= 0 || h <= 0) return null;
    var full = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(full))
    {
        var hdc = g.GetHdc();
        bool ok;
        try { ok = PrintWindow(hwnd, hdc, 2); } finally { g.ReleaseHdc(hdc); }
        if (!ok) { full.Dispose(); return null; }
    }
    var vis = GetBounds(hwnd);
    var crop = new Rectangle(vis.Left - wr.Left, vis.Top - wr.Top, vis.Width, vis.Height);
    crop.Intersect(new Rectangle(0, 0, w, h));
    if (crop.Width <= 0 || crop.Height <= 0 || crop.Size == full.Size) return full;
    var outBmp = full.Clone(crop, PixelFormat.Format32bppArgb);
    full.Dispose();
    return outBmp;
}
static Bitmap CaptureScreen(Rectangle rect)
{
    var bmp = new Bitmap(Math.Max(1, rect.Width), Math.Max(1, rect.Height), PixelFormat.Format32bppArgb);
    using var g = Graphics.FromImage(bmp);
    g.CopyFromScreen(rect.Left, rect.Top, 0, 0, bmp.Size, CopyPixelOperation.SourceCopy);
    return bmp;
}

[DllImport("user32.dll")] static extern bool EnumWindows(EnumWindowsProc cb, IntPtr l);
[DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out int pid);
[DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
[DllImport("user32.dll")] static extern IntPtr GetWindow(IntPtr h, uint cmd);
[DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
[DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h, int attr, out RECT r, int size);
[DllImport("user32.dll")] static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
[StructLayout(LayoutKind.Sequential)] struct RECT { public int Left, Top, Right, Bottom; }
record Item(string Id, string Code, int Delay);
