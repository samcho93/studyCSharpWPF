using System.Collections.Immutable;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Emit;

namespace CsRunner;

/// <summary>Roslyn 으로 사용자 코드(C# + XAML)를 컴파일한다</summary>
public static class Compiler
{
    private static readonly Dictionary<string, MetadataReference> _refs = new(StringComparer.OrdinalIgnoreCase);
    private static int _seq;
    public static byte[]? Assembly;
    public static byte[]? Pdb;
    public static string? AssemblyName;

    /// <summary>JS 가 _framework 에서 찾아 넘겨줄 참조 어셈블리 이름</summary>
    public static readonly string[] WantedReferences =
    {
        "System.Private.CoreLib", "System.Runtime", "System.Console", "System.Collections", "System.Collections.Concurrent", "System.Collections.NonGeneric", "System.Collections.Specialized", "System.Collections.Immutable",
        "System.Linq", "System.Linq.Expressions", "System.Linq.Parallel", "System.Text.RegularExpressions", "System.Text.Json", "System.Text.Encodings.Web", "System.Text.Encoding.Extensions", "System.Text.Encoding",
        "System.ObjectModel", "System.ComponentModel", "System.ComponentModel.Primitives", "System.ComponentModel.TypeConverter", "System.ComponentModel.Annotations", "System.ComponentModel.EventBasedAsync",
        "System.Runtime.InteropServices", "System.Runtime.Extensions", "System.Runtime.Numerics", "System.Runtime.Serialization.Primitives", "System.Runtime.Intrinsics",
        "System.Threading", "System.Threading.Tasks", "System.Threading.Tasks.Parallel", "System.Threading.Thread", "System.Threading.Timer", "System.Threading.Channels",
        "System.Memory", "System.Xml.Linq", "System.Private.Xml.Linq", "System.Private.Xml", "System.Xml.ReaderWriter", "System.Xml.XDocument",
        "System.Net.Http", "System.Net.Primitives", "System.Net.WebClient", "System.Private.Uri", "System.IO.FileSystem", "System.IO", "System.Globalization",
        "System.Diagnostics.Debug", "System.Diagnostics.Process", "System.Diagnostics.Tools", "System.Diagnostics.TraceSource", "System.Diagnostics.StackTrace", "System.Diagnostics.Stopwatch", "System.Diagnostics.Tracing",
        "System.Reflection", "System.Reflection.Extensions", "System.Reflection.Primitives", "System.Reflection.Emit", "System.Reflection.Emit.Lightweight", "System.Reflection.Emit.ILGeneration",
        "System.Security.Cryptography", "System.Security.Cryptography.Algorithms", "System.Security.Cryptography.Primitives", "System.IO.Compression", "System.Data.Common", "System.Drawing.Primitives", "System.Timers",
        "netstandard", "mscorlib", "System", "System.Core", "System.Xml", "System.Data", "Microsoft.CSharp", "Microsoft.VisualBasic.Core", "Microsoft.VisualBasic", "WpfShim"
    };

    public static void AddReference(string name, byte[] bytes)
    {
        try { _refs[name] = MetadataReference.CreateFromImage(ImmutableArray.Create(bytes), filePath: name + ".dll"); }
        catch (Exception ex) { WpfShim.Bridge.Write(2, $"[참조 로드 실패] {name}: {ex.Message}\n"); }
    }

    private sealed class SrcFile { public string Name = ""; public string Text = ""; }

    public static string Compile(string filesJson)
    {
        var files = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(filesJson) ?? new List<Dictionary<string, string>>();
        var src = files.Select(f => new SrcFile { Name = f.GetValueOrDefault("name") ?? "Program.cs", Text = f.GetValueOrDefault("text") ?? "" }).ToList();
        var diags = new List<object>();
        var sw = System.Diagnostics.Stopwatch.StartNew();
        try
        {
            var parse = new CSharpParseOptions(LanguageVersion.Latest, DocumentationMode.None, SourceCodeKind.Regular);
            var trees = new List<SyntaxTree>();
            var xamls = src.Where(f => f.Name.EndsWith(".xaml", StringComparison.OrdinalIgnoreCase)).ToList();
            var isWpf = xamls.Count > 0 || src.Any(f => f.Text.Contains("System.Windows") || f.Text.Contains("using System.Windows"));
            foreach (var f in src.Where(f => f.Name.EndsWith(".cs", StringComparison.OrdinalIgnoreCase)))
                trees.Add(CSharpSyntaxTree.ParseText(f.Text, parse, path: f.Name, encoding: Encoding.UTF8));
            if (trees.Count == 0 && xamls.Count == 0) return Result(false, new[] { Diag("error", "CS0000", "", 0, 0, "컴파일할 C# 코드가 없습니다.") }, isWpf, sw);

            // 암시적 using + Console 대체
            trees.Add(CSharpSyntaxTree.ParseText(GlobalUsings, parse, path: "GlobalUsings.g.cs", encoding: Encoding.UTF8));

            // XAML → 부분 클래스 생성
            var userHasMain = trees.Any(t => t.GetRoot().DescendantNodes().OfType<MethodDeclarationSyntax>().Any(m => m.Identifier.Text == "Main" && m.Modifiers.Any(SyntaxKind.StaticKeyword)))
                              || trees.Any(t => t.GetRoot().DescendantNodes().OfType<GlobalStatementSyntax>().Any());
            var windowClasses = new List<(string file, string cls)>();
            string? appClass = null;
            var registrations = new StringBuilder();
            foreach (var x in xamls)
            {
                string gen;
                try { gen = GenerateFromXaml(x, out var cls, out var isApp, out var isWindow, registrations); if (isApp) appClass = cls; else if (isWindow && cls != null) windowClasses.Add((x.Name, cls)); }
                catch (Exception ex)
                {
                    return Result(false, new[] { Diag("error", "XAML", x.Name, (ex as System.Xml.XmlException)?.LineNumber ?? 1, (ex as System.Xml.XmlException)?.LinePosition ?? 1, "XAML 오류: " + ex.Message) }, true, sw);
                }
                if (gen.Length > 0) trees.Add(CSharpSyntaxTree.ParseText(gen, parse, path: x.Name + ".g.cs", encoding: Encoding.UTF8));
            }
            // 진입점: App.xaml 이 있으면 App.Main, 없고 창만 있으면 첫 창을 여는 Main 생성
            if (!userHasMain)
            {
                if (appClass != null)
                {
                    trees.Add(CSharpSyntaxTree.ParseText($@"
partial class {SplitName(appClass).cls}
{{
    [System.STAThread]
    public static void Main()
    {{
        {registrations}
        var app = new {appClass}();
        app.InitializeComponent();
        app.Run();
    }}
}}".WrapNamespace(SplitName(appClass).ns), parse, path: "App.Main.g.cs", encoding: Encoding.UTF8));
                }
                else if (windowClasses.Count > 0)
                {
                    trees.Add(CSharpSyntaxTree.ParseText($@"
internal static class __WpfEntry
{{
    [System.STAThread]
    public static void Main()
    {{
        {registrations}
        var app = new System.Windows.Application();
        app.Run(new {windowClasses[0].cls}());
    }}
}}", parse, path: "Entry.g.cs", encoding: Encoding.UTF8));
                }
            }
            else if (registrations.Length > 0)
            {
                // 사용자 Main 이 있어도 XAML 파일 등록은 필요하다 (모듈 초기화)
                trees.Add(CSharpSyntaxTree.ParseText($@"
internal static class __XamlInit
{{
    [System.Runtime.CompilerServices.ModuleInitializer]
    internal static void Init() {{ {registrations} }}
}}", parse, path: "XamlInit.g.cs", encoding: Encoding.UTF8));
            }

            AssemblyName = "UserApp" + (++_seq);
            var options = new CSharpCompilationOptions(OutputKind.ConsoleApplication, optimizationLevel: OptimizationLevel.Debug, allowUnsafe: true, nullableContextOptions: NullableContextOptions.Enable, warningLevel: 4,
                specificDiagnosticOptions: new Dictionary<string, ReportDiagnostic> { ["CS8632"] = ReportDiagnostic.Suppress, ["CS1998"] = ReportDiagnostic.Suppress, ["CS8600"] = ReportDiagnostic.Suppress, ["CS8602"] = ReportDiagnostic.Suppress, ["CS8603"] = ReportDiagnostic.Suppress, ["CS8604"] = ReportDiagnostic.Suppress, ["CS8618"] = ReportDiagnostic.Suppress, ["CS8625"] = ReportDiagnostic.Suppress, ["CS8622"] = ReportDiagnostic.Suppress, ["CS8601"] = ReportDiagnostic.Suppress, ["CS8619"] = ReportDiagnostic.Suppress, ["CS8620"] = ReportDiagnostic.Suppress, ["CS8629"] = ReportDiagnostic.Suppress, ["CS8605"] = ReportDiagnostic.Suppress, ["CS8767"] = ReportDiagnostic.Suppress, ["CS8765"] = ReportDiagnostic.Suppress, ["CS8612"] = ReportDiagnostic.Suppress, ["CS8610"] = ReportDiagnostic.Suppress, ["CS8613"] = ReportDiagnostic.Suppress, ["CS8714"] = ReportDiagnostic.Suppress, ["CS8981"] = ReportDiagnostic.Suppress, ["CS0108"] = ReportDiagnostic.Suppress, ["CS7022"] = ReportDiagnostic.Suppress, ["CS8321"] = ReportDiagnostic.Suppress },
                deterministic: true, concurrentBuild: false);
            var compilation = CSharpCompilation.Create(AssemblyName, trees, _refs.Values, options);

            using var pe = new MemoryStream();
            // PDB 는 만들지 않는다: Roslyn 의 PDB 작성기가 Task.Run + 블로킹 대기를 써서 단일 스레드 WebAssembly 에서 멈춘다
            var result = compilation.Emit(pe);
            foreach (var d in result.Diagnostics)
            {
                if (d.Severity == DiagnosticSeverity.Hidden) continue;
                if (d.Severity == DiagnosticSeverity.Info) continue;
                var loc = d.Location.GetLineSpan();
                var file = loc.Path ?? "";
                if (file.EndsWith(".g.cs")) file = file.Replace(".g.cs", "");
                diags.Add(Diag(d.Severity == DiagnosticSeverity.Error ? "error" : "warning", d.Id, file, loc.StartLinePosition.Line + 1, loc.StartLinePosition.Character + 1, d.GetMessage(System.Globalization.CultureInfo.InvariantCulture)));
            }
            if (!result.Success) { Assembly = null; Pdb = null; return Result(false, diags, isWpf, sw); }
            Assembly = pe.ToArray();
            Pdb = null;
            return Result(true, diags, isWpf, sw);
        }
        catch (Exception ex)
        {
            return Result(false, new[] { Diag("error", "CSX", "", 0, 0, "컴파일러 내부 오류: " + ex.GetType().Name + ": " + ex.Message + "\n" + ex.StackTrace) }, false, sw);
        }
    }

    private static string WrapNamespace(this string code, string? ns) => string.IsNullOrEmpty(ns) ? code : $"namespace {ns}\n{{\n{code}\n}}";
    private static (string? ns, string cls) SplitName(string full) { var i = full.LastIndexOf('.'); return i < 0 ? (null, full) : (full.Substring(0, i), full.Substring(i + 1)); }
    private static object Diag(string kind, string id, string file, int line, int col, string message) => new { kind, id, file, line, col, message };
    private static string Result(bool ok, IEnumerable<object> diags, bool isWpf, System.Diagnostics.Stopwatch sw) => JsonSerializer.Serialize(new { ok, diagnostics = diags, isWpf, compileMs = sw.ElapsedMilliseconds });

    private const string GlobalUsings = @"
global using System;
global using System.Collections.Generic;
global using System.IO;
global using System.Linq;
global using System.Text;
global using System.Threading;
global using System.Threading.Tasks;
global using Console = CsRunner.Runtime.Console;
";

    // ------------------------------------------------------------ XAML 코드 생성 (WPF 의 XAML 컴파일러 역할)
    private const string NsX = "http://schemas.microsoft.com/winfx/2006/xaml";

    private static string GenerateFromXaml(SrcFile x, out string? cls, out bool isApp, out bool isWindow, StringBuilder registrations)
    {
        cls = null; isApp = false; isWindow = false;
        var doc = XElement.Parse(x.Text, LoadOptions.SetLineInfo);
        var rootName = doc.Name.LocalName;
        var rootType = System.Windows.Markup.XamlTypes.Resolve(doc.Name.NamespaceName, rootName);
        var esc = "@\"" + x.Text.Replace("\"", "\"\"") + "\"";
        // 리소스 사전 파일 (Styles.xaml 등)
        if (rootType == typeof(System.Windows.ResourceDictionary) || doc.Attribute(XName.Get("Class", NsX)) == null)
        {
            registrations.Append($"System.Windows.Markup.XamlRegistry.RegisterXaml(\"{x.Name}\", {esc});\n");
            return "";
        }
        var full = doc.Attribute(XName.Get("Class", NsX))!.Value.Trim();
        cls = full;
        var (ns, cn) = SplitName(full);
        isApp = rootType == typeof(System.Windows.Application) || rootName == "Application";
        isWindow = rootType != null && typeof(System.Windows.Window).IsAssignableFrom(rootType);
        var baseName = rootType?.FullName ?? "System.Windows.Window";
        registrations.Append($"System.Windows.Markup.XamlRegistry.Register(\"{x.Name}\", typeof({full}));\n");
        registrations.Append($"System.Windows.Markup.XamlRegistry.RegisterXaml(\"{x.Name}\", {esc});\n");

        var fields = new StringBuilder();
        var assigns = new StringBuilder();
        var seen = new HashSet<string>();
        foreach (var el in doc.Descendants())
        {
            var n = el.Attribute(XName.Get("Name", NsX))?.Value ?? el.Attribute("Name")?.Value;
            if (string.IsNullOrWhiteSpace(n) || !seen.Add(n)) continue;
            if (el.Name.LocalName.Contains('.')) continue;
            var t = System.Windows.Markup.XamlTypes.Resolve(el.Name.NamespaceName, el.Name.LocalName);
            string tn;
            if (t != null) tn = t.FullName!;
            else if (el.Name.NamespaceName.StartsWith("clr-namespace:"))
            {
                var body = el.Name.NamespaceName.Substring("clr-namespace:".Length);
                var semi = body.IndexOf(';');
                var cns = semi >= 0 ? body.Substring(0, semi) : body;
                tn = cns.Length > 0 ? cns + "." + el.Name.LocalName : el.Name.LocalName;
            }
            else tn = "object";
            fields.Append($"        internal {tn} {n};\n");
            assigns.Append($"            {n} = ({tn})this.FindName(\"{n}\");\n");
        }
        var body2 = isApp
            ? $@"
    public partial class {cn} : {baseName}
    {{
        private bool _contentLoaded;
        public void InitializeComponent()
        {{
            if (_contentLoaded) return;
            _contentLoaded = true;
            System.Windows.Markup.XamlLoader.Load(this, {esc});
        }}
    }}"
            : $@"
    public partial class {cn} : {baseName}
    {{
{fields}        private bool _contentLoaded;
        public void InitializeComponent()
        {{
            if (_contentLoaded) return;
            _contentLoaded = true;
            System.Windows.Markup.XamlLoader.Load(this, {esc});
{assigns}        }}
    }}";
        return body2.WrapNamespace(ns);
    }
}
