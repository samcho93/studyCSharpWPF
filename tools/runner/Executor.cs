using System.Reflection;
using System.Text;

namespace CsRunner;

/// <summary>컴파일된 사용자 어셈블리를 실행한다</summary>
public static class Executor
{
    private static TaskCompletionSource<bool>? _exit;

    public static async Task<int> Run()
    {
        if (Compiler.Assembly == null) { WpfShim.Bridge.Write(2, "먼저 컴파일에 성공해야 실행할 수 있습니다.\n"); return 1; }
        WpfShim.UiTree.OpenWindows.Clear();
        WpfShim.UiTree.AppRunning = false;
        WpfShim.UiTree.OnIdle = () => System.Windows.Input.CommandManager.InvalidateRequerySuggested();
        _exit = null;
        Assembly asm;
        try { asm = Compiler.Pdb != null ? Assembly.Load(Compiler.Assembly, Compiler.Pdb) : Assembly.Load(Compiler.Assembly); }
        catch (Exception ex) { WpfShim.Bridge.Write(2, "어셈블리를 불러오지 못했습니다: " + ex.Message + "\n"); return 1; }
        WpfShim.Bridge.UserAssembly = asm;
        var ep = asm.EntryPoint;
        if (ep == null) { WpfShim.Bridge.Write(2, "진입점(Main)이 없습니다.\n"); return 1; }
        // async Main / 최상위 await: 컴파일러가 만든 동기 래퍼 대신 Task 를 돌려주는 진짜 Main 을 직접 await 한다
        var real = ep.DeclaringType?.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
            .FirstOrDefault(m => (m.Name == "Main" || m.Name == "<Main>$") && (m.ReturnType == typeof(Task) || m.ReturnType == typeof(Task<int>)));
        var target = real ?? ep;
        int exit = 0;
        try
        {
            var ps = target.GetParameters();
            var args = ps.Length == 1 ? new object[] { Array.Empty<string>() } : null;
            var r = target.Invoke(null, args);
            if (r is Task<int> ti) exit = await ti;
            else if (r is Task t) await t;
            else if (r is int i) exit = i;
        }
        catch (Exception ex)
        {
            Report(ex);
            exit = 134;
        }
        // WPF: 창이 열려 있으면 모두 닫힐 때까지 기다린다
        if (WpfShim.UiTree.AppRunning && WpfShim.UiTree.OpenWindows.Count > 0)
        {
            _exit = new TaskCompletionSource<bool>();
            WpfShim.UiTree.Flush();
            await _exit.Task;
        }
        WpfShim.UiTree.Flush();
        return exit;
    }

    public static void AppExited() { _exit?.TrySetResult(true); }

    private static void Report(Exception ex)
    {
        if (ex is TargetInvocationException tie && tie.InnerException != null) ex = tie.InnerException;
        var sb = new StringBuilder();
        sb.Append("처리되지 않은 예외(Unhandled exception). ").Append(ex.GetType().FullName).Append(": ").Append(ex.Message).Append('\n');
        if (ex.InnerException != null) sb.Append(" ---> ").Append(ex.InnerException.GetType().FullName).Append(": ").Append(ex.InnerException.Message).Append('\n');
        var st = ex.StackTrace ?? "";
        foreach (var raw in st.Split('\n'))
        {
            var l = raw.TrimEnd('\r');
            if (l.Length == 0) continue;
            if (l.Contains("CsRunner.") || l.Contains("WpfShim.") || l.Contains("System.Windows.") || l.Contains("System.Reflection.") || l.Contains("System.RuntimeMethodHandle") || l.Contains("System.RuntimeType") || l.Contains("--- End of stack trace")) continue;
            sb.Append(l).Append('\n');
        }
        WpfShim.Bridge.Write(2, sb.ToString());
    }
}
