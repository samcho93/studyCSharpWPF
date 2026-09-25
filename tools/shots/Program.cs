using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

// 사용: Shots <items.json> <outDir> [--only id] [--keep]
//   items.json = [{ "id": "ch13-1-0", "code": "...", "delay": 800, "size": "" }]
//   결과: <outDir>/<id>.png + <outDir>/index.json (성공한 id 목록) + 콘솔 로그
var inPath = args[0];
var outDir = args[1];
string? only = null; bool keep = false;
for (int i = 2; i < args.Length; i++) { if (args[i] == "--only") only = args[++i]; else if (args[i] == "--keep") keep = true; }
Directory.CreateDirectory(outDir);
var items = JsonNode.Parse(File.ReadAllText(inPath))!.AsArray();
var root = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".."));   // tools/shots
var workRoot = Path.Combine(root, "work");
Directory.CreateDirectory(workRoot);
var indexPath = Path.Combine(outDir, "index.json");
var index = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
if (File.Exists(indexPath)) foreach (var n in JsonNode.Parse(File.ReadAllText(indexPath))!.AsArray()) index.Add(n!.GetValue<string>());
var log = new List<string>();
int ok = 0, fail = 0;

foreach (var it in items)
{
    var id = it!["id"]!.GetValue<string>();
    if (only != null && id != only) continue;
    var code = it["code"]!.GetValue<string>();
    var delay = it["delay"]?.GetValue<int>() ?? 900;
    var sw = Stopwatch.StartNew();
    try
    {
        var dir = Path.Combine(workRoot, Sanitize(id));
        if (Directory.Exists(dir)) Directory.Delete(dir, true);
        Directory.CreateDirectory(dir);
        var files = SplitFiles(code);
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
        bool userMain = files.Any(f => f.name.EndsWith(".cs") && Regex.IsMatch(f.text, @"static\s+(void|int|async\s+Task)\s+Main\s*\("));
        if (!hasApp && !userMain)
        {
            if (mainClass == null) throw new Exception("Window 의 x:Class 를 찾지 못했습니다");
            File.WriteAllText(Path.Combine(dir, "__Entry.cs"), $@"
internal static class __Entry
{{
    [System.STAThread]
    public static void Main()
    {{
        var app = new System.Windows.Application();
        app.Run(new {mainClass}());
    }}
}}", new UTF8Encoding(true));
        }
        // 진단: 처리되지 않은 예외를 파일로 남긴다 (창이 뜨지 않고 종료될 때 원인 보고)
        File.WriteAllText(Path.Combine(dir, "__ShotDiag.cs"), @"
internal static class __ShotDiag
{
    [System.Runtime.CompilerServices.ModuleInitializer]
    internal static void Init()
    {
        System.AppDomain.CurrentDomain.UnhandledException += (s, e) =>
        {
            try { System.IO.File.WriteAllText(System.IO.Path.Combine(System.AppContext.BaseDirectory, ""shot-error.txt""), e.ExceptionObject.ToString()); } catch { }
        };
    }
}", new UTF8Encoding(true));
        var errFile = Path.Combine(dir, "bin", "Release", "net9.0-windows", "shot-error.txt");
        var hasStartupUri = hasApp && files.Any(f => f.name.Equals("App.xaml", StringComparison.OrdinalIgnoreCase) && f.text.Contains("StartupUri"));
        File.WriteAllText(Path.Combine(dir, "ShotApp.csproj"), $@"<Project Sdk=""Microsoft.NET.Sdk"">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net9.0-windows</TargetFramework>
    <Nullable>disable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <AssemblyName>ShotApp</AssemblyName>
    <RootNamespace>ShotApp</RootNamespace>
    <NoWarn>$(NoWarn);CS8632;CS0168;CS0219;CS1998;CS0162;CS0414;CS0649;CS0169;CS0067</NoWarn>
    <SatelliteResourceLanguages>en</SatelliteResourceLanguages>
    <EnableDefaultApplicationDefinition>{(hasApp ? "true" : "false")}</EnableDefaultApplicationDefinition>
  </PropertyGroup>
</Project>", new UTF8Encoding(true));
        // 빌드
        var build = Run("dotnet", $"build -c Release -nologo -v q -p:UseSharedCompilation=true", dir, 120000);
        if (build.exit != 0) throw new Exception("빌드 실패:\n" + Trim(build.output, 20));
        var exe = Directory.GetFiles(Path.Combine(dir, "bin", "Release", "net9.0-windows"), "ShotApp.exe", SearchOption.AllDirectories).FirstOrDefault() ?? throw new Exception("exe 없음");
        // 실행 · 캡처
        var psi = new ProcessStartInfo(exe) { WorkingDirectory = Path.GetDirectoryName(exe)!, UseShellExecute = false };
        using var proc = Process.Start(psi)!;
        IntPtr hwnd = IntPtr.Zero;
        var t0 = Environment.TickCount64;
        while (Environment.TickCount64 - t0 < 10000)
        {
            Thread.Sleep(120);
            if (proc.HasExited) break;
            proc.Refresh();
            hwnd = FindMainWindow(proc.Id);
            if (hwnd != IntPtr.Zero) break;
        }
        if (hwnd == IntPtr.Zero)
        {
            if (!proc.HasExited) proc.Kill();
            var why = "";
            var ef = Path.Combine(Path.GetDirectoryName(exe)!, "shot-error.txt");
            if (File.Exists(ef)) why = "\n" + Trim(File.ReadAllText(ef), 8);
            throw new Exception((proc.HasExited ? $"프로그램이 창을 띄우지 않고 종료됨 (종료 코드 {proc.ExitCode})" : "창을 찾지 못함") + why);
        }
        Thread.Sleep(delay);
        SetForegroundWindow(hwnd);
        Thread.Sleep(150);
        // 메시지 박스 등 자식 창이 떠 있으면 그 창도 포함해 화면 영역을 캡처한다
        var rect = GetBounds(hwnd);
        var extra = FindOwnedWindows(proc.Id, hwnd);
        foreach (var e in extra) rect = Rectangle.Union(rect, GetBounds(e));
        using var bmp = CaptureScreen(rect);
        var outPath = Path.Combine(outDir, id + ".png");
        bmp.Save(outPath, ImageFormat.Png);
        try { if (!proc.HasExited) proc.Kill(true); } catch { }
        index.Add(id);
        ok++;
        log.Add($"✓ {id} ({sw.ElapsedMilliseconds / 1000.0:0.0}s, {rect.Width}x{rect.Height}{(extra.Count > 0 ? " +창" + extra.Count : "")})");
        Console.WriteLine(log[^1]);
        if (!keep) { try { Directory.Delete(dir, true); } catch { } }
    }
    catch (Exception ex)
    {
        fail++;
        log.Add($"✗ {id}: {ex.Message}");
        Console.WriteLine(log[^1]);
    }
}
File.WriteAllText(indexPath, JsonSerializer.Serialize(index.OrderBy(x => x).ToList(), new JsonSerializerOptions { WriteIndented = true }));
File.WriteAllText(Path.Combine(outDir, "shots.log"), string.Join("\n", log));
Console.WriteLine($"완료: 성공 {ok}, 실패 {fail} → {indexPath}");
return fail > 0 ? 1 : 0;

// ------------------------------------------------------------------ 도우미
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
static List<IntPtr> FindOwnedWindows(int pid, IntPtr main)
{
    var list = new List<IntPtr>();
    EnumWindows((h, l) =>
    {
        GetWindowThreadProcessId(h, out var wp);
        if (wp == pid && h != main && IsWindowVisible(h)) { var r = GetBounds(h); if (r.Width > 40 && r.Height > 20) list.Add(h); }
        return true;
    }, IntPtr.Zero);
    return list;
}
static Rectangle GetBounds(IntPtr hwnd)
{
    if (DwmGetWindowAttribute(hwnd, 9, out RECT r, Marshal.SizeOf<RECT>()) != 0) GetWindowRect(hwnd, out r);
    return Rectangle.FromLTRB(r.Left, r.Top, r.Right, r.Bottom);
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
[DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
[DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h, int attr, out RECT r, int size);
delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
[StructLayout(LayoutKind.Sequential)] struct RECT { public int Left, Top, Right, Bottom; }
