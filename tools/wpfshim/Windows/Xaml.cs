using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Windows.Controls;
using System.Windows.Data;
using System.Xml.Linq;
using WpfShim;

namespace System.Windows.Markup
{
    public class XamlParseException : Exception
    {
        public int LineNumber { get; }
        public int LinePosition { get; }
        public XamlParseException(string message) : base(message) { }
        public XamlParseException(string message, int line, int pos) : base(message) { LineNumber = line; LinePosition = pos; }
        public XamlParseException(string message, Exception inner) : base(message, inner) { }
    }

    /// <summary>XAML 요소 이름 → 형식 해석</summary>
    public static class XamlTypes
    {
        public const string NsPresentation = "http://schemas.microsoft.com/winfx/2006/xaml/presentation";
        public const string NsXaml = "http://schemas.microsoft.com/winfx/2006/xaml";
        public const string NsBlend = "http://schemas.microsoft.com/expression/blend/2008";
        public const string NsMc = "http://schemas.openxmlformats.org/markup-compatibility/2006";
        private static Dictionary<string, Type>? _shim;

        private static Dictionary<string, Type> Shim()
        {
            if (_shim != null) return _shim;
            var d = new Dictionary<string, Type>(StringComparer.Ordinal);
            var order = new[] { "System.Windows.Controls", "System.Windows", "System.Windows.Shapes", "System.Windows.Media", "System.Windows.Controls.Primitives", "System.Windows.Data", "System.Windows.Documents", "System.Windows.Input", "System.Windows.Media.Animation", "System.Windows.Media.Imaging", "System.Windows.Threading", "System.Windows.Markup" };
            foreach (var ns in order)
                foreach (var t in typeof(XamlTypes).Assembly.GetTypes())
                    if (t.Namespace == ns && t.IsPublic && !t.IsGenericTypeDefinition && !d.ContainsKey(t.Name)) d[t.Name] = t;
            _shim = d;
            return d;
        }
        public static bool IsPresentation(string ns) => ns == NsPresentation || ns == "http://schemas.microsoft.com/netfx/2007/xaml/presentation" || ns == "http://schemas.microsoft.com/netfx/2009/xaml/presentation" || ns.Length == 0;

        /// <summary>네임스페이스 URI + 이름 → 형식 (없으면 null)</summary>
        public static Type? Resolve(string ns, string name)
        {
            if (IsPresentation(ns)) return Shim().TryGetValue(name, out var t) ? t : null;
            if (ns == NsXaml)
            {
                return name switch { "String" => typeof(string), "Double" => typeof(double), "Int32" => typeof(int), "Boolean" => typeof(bool), "Object" => typeof(object), "Char" => typeof(char), "Decimal" => typeof(decimal), "Single" => typeof(float), "Int64" => typeof(long), "Byte" => typeof(byte), _ => null };
            }
            if (ns.StartsWith("clr-namespace:"))
            {
                var body = ns.Substring("clr-namespace:".Length);
                var semi = body.IndexOf(';');
                var clrNs = semi >= 0 ? body.Substring(0, semi) : body;
                var asm = semi >= 0 && body.Substring(semi + 1).StartsWith("assembly=") ? body.Substring(semi + 10) : "";
                var full = clrNs.Length > 0 ? clrNs + "." + name : name;
                if (asm.Length == 0 || asm.Equals(Bridge.UserAssembly?.GetName().Name, StringComparison.OrdinalIgnoreCase))
                {
                    var ut = Bridge.UserAssembly?.GetType(full);
                    if (ut != null) return ut;
                }
                // System.* (mscorlib / System.Runtime)
                var st = Type.GetType(full) ?? typeof(string).Assembly.GetType(full) ?? typeof(Uri).Assembly.GetType(full) ?? typeof(Enumerable).Assembly.GetType(full);
                if (st != null) return st;
                var sh = typeof(XamlTypes).Assembly.GetType(full);
                if (sh != null) return sh;
                if (Bridge.UserAssembly != null)
                    foreach (var t in Bridge.UserAssembly.GetTypes()) if (t.Name == name && (clrNs.Length == 0 || t.Namespace == clrNs)) return t;
                return null;
            }
            return Shim().TryGetValue(name, out var t2) ? t2 : null;
        }

        /// <summary>"local:Foo" · "Button" 같은 접두사 이름 → 형식 (현재 로드 중인 요소의 네임스페이스 사용)</summary>
        public static Type Resolve(string qualified)
        {
            qualified = qualified.Trim();
            var el = XamlLoader.CurrentElement;
            string prefix = "", name = qualified;
            var i = qualified.IndexOf(':');
            if (i > 0) { prefix = qualified.Substring(0, i); name = qualified.Substring(i + 1); }
            string ns = NsPresentation;
            if (el != null)
            {
                var xn = prefix.Length == 0 ? el.GetDefaultNamespace() : el.GetNamespaceOfPrefix(prefix);
                if (xn != null && xn.NamespaceName.Length > 0) ns = xn.NamespaceName;
            }
            var t = Resolve(ns, name);
            if (t == null && Bridge.UserAssembly != null) foreach (var ut in Bridge.UserAssembly.GetTypes()) if (ut.Name == name) return ut;
            return t ?? throw new XamlParseException($"형식을 찾을 수 없습니다: {qualified}");
        }
        public static string? FullNameFor(string ns, string name) => Resolve(ns, name)?.FullName;
    }

    /// <summary>x:Class 클래스 ↔ XAML 파일 등록 (StartupUri 용)</summary>
    public static class XamlRegistry
    {
        private static readonly Dictionary<string, Type> _map = new Dictionary<string, Type>(StringComparer.OrdinalIgnoreCase);
        private static readonly Dictionary<string, string> _xaml = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        public static void Register(string file, Type type) { _map[Norm(file)] = type; }
        /// <summary>XAML 원문 등록 (ResourceDictionary Source="Styles.xaml" 등에서 사용)</summary>
        public static void RegisterXaml(string file, string text) { _xaml[Norm(file)] = text; }
        public static string? GetXaml(string file) => _xaml.TryGetValue(Norm(file), out var t) ? t : null;
        private static string Norm(string s) { s = s.Replace('\\', '/'); var i = s.LastIndexOf('/'); return (i >= 0 ? s.Substring(i + 1) : s).Trim(); }
        public static Type? Lookup(string file) => _map.TryGetValue(Norm(file), out var t) ? t : null;
        public static Window? CreateWindow(string file)
        {
            var t = Lookup(file);
            if (t == null) return null;
            return Activator.CreateInstance(t) as Window;
        }
    }

    public static class XamlReader
    {
        public static object Parse(string xaml) => XamlLoader.Parse(xaml);
        public static object Load(Stream s) { using var r = new StreamReader(s); return XamlLoader.Parse(r.ReadToEnd()); }
    }
    public static class XamlWriter { public static string Save(object o) => o.ToString() ?? ""; }

    /// <summary>XAML 문자열을 읽어 객체 트리를 만든다 (WPF 의 XAML 로더 역할, 리플렉션 기반)</summary>
    public static class XamlLoader
    {
        [ThreadStatic] internal static XElement? CurrentElement;

        /// <summary>x:Class 루트 객체(Window/UserControl/Application)에 XAML 을 적용한다 (InitializeComponent)</summary>
        public static void Load(object root, string xaml)
        {
            XElement doc;
            try { doc = XElement.Parse(xaml, LoadOptions.SetLineInfo | LoadOptions.PreserveWhitespace); }
            catch (Xml.XmlException ex) { throw new XamlParseException($"XAML 문법 오류 ({ex.LineNumber}행 {ex.LinePosition}열): {ex.Message}", ex.LineNumber, ex.LinePosition); }
            var b = new Builder { Root = root, Owner = root };
            if (root is Application app) { b.LoadApplication(app, doc); return; }
            b.Build(doc, root, null);
            if (root is FrameworkElement fe) fe.ApplyImplicitStyle();
        }

        /// <summary>루트 없이 XAML 조각을 객체로 만든다 (XamlReader.Parse)</summary>
        public static object Parse(string xaml)
        {
            var doc = XElement.Parse(xaml, LoadOptions.SetLineInfo | LoadOptions.PreserveWhitespace);
            var b = new Builder();
            return b.Build(doc, null, null) ?? throw new XamlParseException("XAML 에서 객체를 만들지 못했습니다");
        }

        internal static object? InstantiateTemplate(XElement el, object? owner, object? dataContext, FrameworkElement? parent)
        {
            var b = new Builder { Owner = owner, ScopeParent = parent };
            return b.Build(el, null, parent);
        }

        // ================================================================ Builder
        private sealed class Builder
        {
            public object? Root;          // x:Class 인스턴스 (최상위 요소로 사용)
            public object? Owner;         // 이벤트 핸들러를 찾을 객체
            public FrameworkElement? ScopeParent;   // 템플릿 인스턴스의 리소스 조회 부모
            private readonly Stack<object> _scope = new Stack<object>();   // 리소스 조회용 조상 객체들
            private static readonly HashSet<string> _skipAttrs = new HashSet<string> { "Class", "ClassModifier", "FieldModifier", "Subclass", "TypeArguments", "Uid", "Shared", "SynchronousMode", "Key", "Name" };

            public void LoadApplication(Application app, XElement doc)
            {
                _scope.Push(app);
                foreach (var a in doc.Attributes())
                {
                    if (a.IsNamespaceDeclaration || a.Name.NamespaceName == XamlTypes.NsXaml || a.Name.NamespaceName == XamlTypes.NsBlend || a.Name.NamespaceName == XamlTypes.NsMc) continue;
                    ApplyMember(app, a.Name.LocalName, a.Value, doc);
                }
                foreach (var c in doc.Elements())
                    if (c.Name.LocalName.Contains('.')) ApplyPropertyElement(app, c);
            }

            public object? Build(XElement el, object? existing, FrameworkElement? parentForScope)
            {
                var prev = CurrentElement;
                CurrentElement = el;
                try { return BuildCore(el, existing); }
                finally { CurrentElement = prev; }
            }

            private object? BuildCore(XElement el, object? existing)
            {
                var ns = el.Name.NamespaceName;
                var name = el.Name.LocalName;
                if (ns == XamlTypes.NsBlend || ns == XamlTypes.NsMc) return null;
                object obj;
                if (existing != null) obj = existing;
                else
                {
                    var type = XamlTypes.Resolve(ns, name) ?? throw Err(el, $"알 수 없는 요소: <{name}>  (지원하지 않는 컨트롤이거나 xmlns 접두사가 잘못되었습니다)");
                    if (type == typeof(string)) return Collapse(el.Value, el);
                    if (type.IsPrimitive || type == typeof(decimal)) return Conv.FromString(type, el.Value.Trim());
                    // 값 형식 · Parse 가능한 형식을 글자 내용으로 쓴 경우: <Thickness x:Key="m">10,5</Thickness>, <Color>#FF0000</Color>
                    if (!el.Elements().Any() && !string.IsNullOrWhiteSpace(el.Value) && (type.IsValueType || type.GetMethod("Parse", BindingFlags.Public | BindingFlags.Static, null, new[] { typeof(string) }, null) != null))
                        return Conv.FromString(type, el.Value.Trim());
                    // 템플릿은 본문을 그대로 보관한다
                    if (typeof(DataTemplate).IsAssignableFrom(type))
                    {
                        var dt = (DataTemplate)Activator.CreateInstance(type)!;
                        dt.Owner = Owner;
                        foreach (var a in el.Attributes()) if (a.Name.LocalName == "DataType" && !a.IsNamespaceDeclaration) dt.DataType = ResolveTypeValue(a.Value, el);
                        dt.Xaml = el.Elements().FirstOrDefault(e => !e.Name.LocalName.Contains('.'));
                        return dt;
                    }
                    if (type == typeof(ControlTemplate)) return new ControlTemplate();
                    if (type == typeof(ItemsPanelTemplate))
                    {
                        var panel = el.Elements().FirstOrDefault();
                        var ipt = new ItemsPanelTemplate();
                        if (panel != null)
                        {
                            var parts = new List<string> { panel.Name.LocalName };
                            foreach (var a in panel.Attributes()) if (!a.IsNamespaceDeclaration) parts.Add(a.Name.LocalName + "=" + a.Value);
                            ipt.PanelName = string.Join(";", parts);
                        }
                        return ipt;
                    }
                    try { obj = Activator.CreateInstance(type) ?? throw Err(el, $"<{name}> 을 만들 수 없습니다"); }
                    catch (MissingMethodException) { throw Err(el, $"<{name}> 에는 매개변수 없는 생성자가 필요합니다"); }
                    catch (TargetInvocationException tie) { throw new XamlParseException($"<{name}> 생성자에서 예외: {tie.InnerException?.Message}", tie.InnerException ?? tie); }
                }
                _scope.Push(obj);
                try
                {
                    // 1) 속성(attribute)
                    foreach (var a in el.Attributes())
                    {
                        if (a.IsNamespaceDeclaration) continue;
                        var ans = a.Name.NamespaceName;
                        var an = a.Name.LocalName;
                        if (ans == XamlTypes.NsXaml)
                        {
                            if (an == "Name") SetName(obj, a.Value);
                            continue;   // Key 는 부모가 처리, Class 등은 무시
                        }
                        if (ans == XamlTypes.NsBlend || ans == XamlTypes.NsMc || ans == "http://www.w3.org/XML/1998/namespace") continue;
                        if (an == "Name") { SetName(obj, a.Value); continue; }
                        ApplyMember(obj, an, a.Value, el);
                    }
                    // 2) 자식 노드
                    var contentProp = ContentProperty(obj.GetType());
                    // 인라인 내용(TextBlock · Span · Bold · Paragraph): 글자와 요소를 적힌 순서대로 Run/Inline 으로 넣는다
                    bool inlineHost = obj is Documents.Span || obj is Documents.Paragraph
                        || (obj is TextBlock && el.Elements().Any(e => !e.Name.LocalName.Contains('.') && e.Name.NamespaceName != XamlTypes.NsBlend && e.Name.NamespaceName != XamlTypes.NsMc));
                    if (inlineHost)
                    {
                        var items = new List<object>();
                        foreach (var node in el.Nodes())
                        {
                            if (node is XText tx) items.Add(tx.Value);
                            else if (node is XElement c)
                            {
                                if (c.Name.NamespaceName == XamlTypes.NsBlend || c.Name.NamespaceName == XamlTypes.NsMc) continue;
                                if (c.Name.LocalName.Contains('.')) { ApplyPropertyElement(obj, c); continue; }
                                items.Add(c);
                            }
                        }
                        bool preserve = el.Attribute(XNamespace.Xml + "space")?.Value == "preserve";
                        for (int i = 0; i < items.Count; i++)
                        {
                            if (items[i] is string s)
                            {
                                if (!preserve)
                                {
                                    s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+", " ");
                                    if (i == 0) s = s.TrimStart();
                                    if (i == items.Count - 1) s = s.TrimEnd();
                                }
                                if (s.Length > 0) AddInline(obj, new Documents.Run(s));
                            }
                            else if (items[i] is XElement c)
                            {
                                var child = Build(c, null, obj as FrameworkElement);
                                if (child is Documents.Inline inl) AddInline(obj, inl);
                                else if (child != null) AddContent(obj, contentProp, child, c);
                            }
                        }
                        return obj;
                    }
                    var textBuf = new StringBuilder();
                    bool hadElementContent = false;
                    foreach (var node in el.Nodes())
                    {
                        if (node is XText tx)
                        {
                            textBuf.Append(tx.Value);
                            continue;
                        }
                        if (node is XElement c)
                        {
                            if (c.Name.NamespaceName == XamlTypes.NsBlend || c.Name.NamespaceName == XamlTypes.NsMc) continue;
                            if (c.Name.LocalName.Contains('.')) { ApplyPropertyElement(obj, c); continue; }
                            var child = Build(c, null, obj as FrameworkElement);
                            if (child == null) continue;
                            hadElementContent = true;
                            AddContent(obj, contentProp, child, c);
                        }
                    }
                    var text = el.Attribute(XNamespace.Xml + "space")?.Value == "preserve" ? textBuf.ToString() : Collapse(textBuf.ToString(), el);
                    if (text.Length > 0)
                    {
                        if (obj is TextBlock tb && hadElementContent) tb.Inlines.Add(new Documents.Run(text));
                        else if (contentProp != null) AddContent(obj, contentProp, text, el);
                        else if (obj is Documents.Run run) run.Text = text;
                    }
                }
                finally { _scope.Pop(); }
                return obj;
            }

            private static void AddInline(object host, Documents.Inline inl)
            {
                if (host is TextBlock tb) tb.Inlines.Add(inl);
                else if (host is Documents.Span sp) sp.Inlines.Add(inl);
                else if (host is Documents.Paragraph pg) pg.Inlines.Add(inl);
            }

            private static string Collapse(string s, XElement el)
            {
                if (string.IsNullOrWhiteSpace(s)) return "";
                var sb = new StringBuilder();
                bool ws = false;
                foreach (var ch in s)
                {
                    if (char.IsWhiteSpace(ch)) { if (!ws) sb.Append(' '); ws = true; }
                    else { sb.Append(ch); ws = false; }
                }
                return sb.ToString().Trim();
            }

            private void SetName(object obj, string name)
            {
                if (obj is FrameworkElement fe) fe.Name = name;
                else { var pi = obj.GetType().GetProperty("Name"); if (pi != null && pi.CanWrite && pi.PropertyType == typeof(string)) pi.SetValue(obj, name); }
                // 실제 WPF 처럼 x:Name 필드를 요소를 만드는 즉시 채운다 — 읽는 도중 발생하는 이벤트(SelectionChanged 등)의 처리기에서 앞에 선언된 요소를 쓸 수 있다
                // 요소가 아닌 객체(변환 · 브러시 · 스토리보드)는 루트의 이름 범위에 등록 → FindName · Storyboard.TargetName 이 찾는다
                if (!(obj is FrameworkElement) && (Root ?? ScopeParent) is FrameworkElement scopeRoot) scopeRoot.RegisterName(name, obj);
                if (Root != null && !ReferenceEquals(obj, Root))
                {
                    var f = Root.GetType().GetField(name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                    if (f != null && f.FieldType.IsInstanceOfType(obj)) f.SetValue(Root, obj);
                }
            }

            private static string? ContentProperty(Type t)
            {
                for (var x = t; x != null; x = x.BaseType)
                {
                    var a = x.GetCustomAttribute<ContentPropertyAttribute>(false);
                    if (a != null) return a.Name;
                }
                return null;
            }

            // ---------------------------------------------------------------- 내용 추가
            private void AddContent(object target, string? contentProp, object child, XElement childEl)
            {
                if (target is ResourceDictionary rd) { rd[KeyFor(child, childEl)] = child; return; }
                if (target is TextBlock tb && child is Documents.Inline inl) { tb.Inlines.Add(inl); return; }
                if (target is Documents.Span sp && child is Documents.Inline inl2) { sp.Inlines.Add(inl2); return; }
                if (target is Style st && child is Setter setter) { st.Setters.Add(setter); return; }
                if (target is Media.Animation.Storyboard sb && child is Media.Animation.Timeline tl) { sb.Children.Add(tl); return; }
                if (target is EventTrigger et) { if (child is SetterBase sb2) et.Setters.Add(sb2); else et.Actions.Add(child); return; }
                if (contentProp == null) throw Err(childEl, $"<{target.GetType().Name}> 안에 <{childEl.Name.LocalName}> 을 넣을 수 없습니다 (내용 속성 없음)");
                var pi = target.GetType().GetProperty(contentProp, BindingFlags.Public | BindingFlags.Instance);
                if (pi == null) throw Err(childEl, $"{target.GetType().Name}.{contentProp} 속성이 없습니다");
                var cur = pi.CanRead ? pi.GetValue(target) : null;
                if (cur is IList list && !(cur is string) && !(child is string && pi.PropertyType == typeof(string)))
                {
                    if (child is UIElement && cur is UIElementCollection) { list.Add(child); return; }
                    if (cur is ItemCollection || cur is UIElementCollection || cur.GetType().IsGenericType || cur is IList) { list.Add(ConvertForList(cur, child)); return; }
                }
                if (pi.CanWrite) { pi.SetValue(target, Conv.To(pi.PropertyType, child)); return; }
                // 읽기 전용 컬렉션 (Add 메서드 탐색)
                var add = cur?.GetType().GetMethod("Add", new[] { child.GetType() }) ?? cur?.GetType().GetMethods().FirstOrDefault(m => m.Name == "Add" && m.GetParameters().Length == 1);
                if (add != null && cur != null) { add.Invoke(cur, new[] { Conv.To(add.GetParameters()[0].ParameterType, child) }); return; }
                throw Err(childEl, $"{target.GetType().Name}.{contentProp} 에 <{childEl.Name.LocalName}> 을 추가할 수 없습니다");
            }
            private static object? ConvertForList(object list, object child)
            {
                var lt = list.GetType();
                var elemType = lt.IsGenericType ? lt.GetGenericArguments()[0] : (lt.BaseType != null && lt.BaseType.IsGenericType ? lt.BaseType.GetGenericArguments()[0] : typeof(object));
                return Conv.To(elemType, child);
            }
            private object KeyFor(object child, XElement el)
            {
                var k = el.Attribute(XName.Get("Key", XamlTypes.NsXaml))?.Value;
                if (k != null) return k;
                if (child is Style s && s.TargetType != null) return s.TargetType;
                if (child is DataTemplate dt && dt.DataType != null) return new DataTemplateKey(dt.DataType);
                throw Err(el, $"리소스 <{el.Name.LocalName}> 에 x:Key 가 없습니다");
            }

            // ---------------------------------------------------------------- 속성 요소 <Grid.RowDefinitions>
            private void ApplyPropertyElement(object target, XElement pe)
            {
                var ln = pe.Name.LocalName;
                var dot = ln.IndexOf('.');
                var typeName = ln.Substring(0, dot);
                var propName = ln.Substring(dot + 1);
                var ownerType = XamlTypes.Resolve(pe.Name.NamespaceName, typeName);
                // 부착 속성 요소 (<Grid.Row> 처럼 대상이 아닌 다른 형식) 는 문자열 값으로 처리
                if (ownerType != null && !ownerType.IsInstanceOfType(target))
                {
                    var single = pe.Elements().FirstOrDefault();
                    object? v = single != null ? Build(single, null, target as FrameworkElement) : Collapse(pe.Value, pe);
                    SetAttached(target, ownerType, propName, v, pe);
                    return;
                }
                var pi = target.GetType().GetProperty(propName, BindingFlags.Public | BindingFlags.Instance);
                if (pi == null)
                {
                    // 이벤트를 속성 요소로 쓰는 경우는 없으므로 오류
                    throw Err(pe, $"{target.GetType().Name} 에 {propName} 속성이 없습니다");
                }
                var cur = pi.CanRead ? pi.GetValue(target) : null;
                var children = pe.Elements().Where(e => e.Name.NamespaceName != XamlTypes.NsBlend && e.Name.NamespaceName != XamlTypes.NsMc).ToList();
                // Resources: <Window.Resources><ResourceDictionary>…</ResourceDictionary></Window.Resources> 또는 항목 직접 나열
                if (cur is ResourceDictionary rd)
                {
                    foreach (var c in children)
                    {
                        if (c.Name.LocalName == "ResourceDictionary" && XamlTypes.IsPresentation(c.Name.NamespaceName))
                        {
                            var inner = (ResourceDictionary)Build(c, null, target as FrameworkElement)!;
                            foreach (var kv in inner) rd[kv.Key] = kv.Value;
                            foreach (var m in inner.MergedDictionaries) rd.MergedDictionaries.Add(m);
                        }
                        else
                        {
                            var item = Build(c, null, target as FrameworkElement);
                            if (item != null) rd[KeyFor(item, c)] = item;
                        }
                    }
                    return;
                }
                if (cur is IList list && !(cur is string))
                {
                    // 컬렉션 속성: 자식이 컬렉션 자체(같은 형식)면 대입, 아니면 항목으로 추가 (Setters · Triggers · RowDefinitions …)
                    var built = children.Select(c => Build(c, null, target as FrameworkElement)).Where(x => x != null).ToList();
                    if (built.Count == 1 && pi.CanWrite && pi.PropertyType.IsInstanceOfType(built[0])) { pi.SetValue(target, built[0]); return; }
                    foreach (var item in built) list.Add(ConvertForList(cur, item!));
                    return;
                }
                if (cur != null && !pi.CanWrite)
                {
                    var add = cur.GetType().GetMethods().FirstOrDefault(m => m.Name == "Add" && m.GetParameters().Length == 1);
                    if (add != null) { foreach (var c in children) { var item = Build(c, null, target as FrameworkElement); if (item != null) add.Invoke(cur, new[] { Conv.To(add.GetParameters()[0].ParameterType, item) }); } return; }
                }
                if (children.Count == 0)
                {
                    var text = Collapse(pe.Value, pe);
                    if (pi.CanWrite) pi.SetValue(target, text.StartsWith("{") ? Evaluate(text, target, pe, pi.PropertyType) : Conv.FromString(pi.PropertyType, text));
                    return;
                }
                if (children.Count == 1 && pi.CanWrite)
                {
                    var v = Build(children[0], null, target as FrameworkElement);
                    if (v is Binding b && target is FrameworkElement fe) { BindingOperations.SetBinding(fe, propName, b); return; }
                    pi.SetValue(target, Conv.To(pi.PropertyType, v));
                    return;
                }
                if (pi.CanWrite && typeof(IList).IsAssignableFrom(pi.PropertyType))
                {
                    var l = (IList)(cur ?? Activator.CreateInstance(pi.PropertyType)!);
                    foreach (var c in children) { var item = Build(c, null, target as FrameworkElement); if (item != null) l.Add(item); }
                    pi.SetValue(target, l);
                    return;
                }
                throw Err(pe, $"{ln} 에는 요소 하나만 넣을 수 있습니다");
            }

            // ---------------------------------------------------------------- 속성 하나 적용 (attribute)
            private void ApplyMember(object target, string name, string value, XElement el)
            {
                var t = target.GetType();
                if (name.Contains('.'))
                {
                    var dot = name.IndexOf('.');
                    var ownerType = XamlTypes.Resolve(el.GetDefaultNamespace().NamespaceName, name.Substring(0, dot)) ?? XamlTypes.Resolve(XamlTypes.NsPresentation, name.Substring(0, dot));
                    if (ownerType == null) { Warn(el, $"알 수 없는 부착 속성 {name}"); return; }
                    // 부착 이벤트: <StackPanel Button.Click="…"> — 자식에서 올라오는(버블링) 이벤트를 부모가 한꺼번에 처리
                    var aev = ownerType.GetEvent(name.Substring(dot + 1), BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);
                    if (aev != null && target is UIElement tue) { HookAttachedEvent(tue, ownerType, aev, value, el); return; }
                    object? v = value.StartsWith("{") && !value.StartsWith("{}") ? Evaluate(value, target, el, typeof(object)) : value;
                    SetAttached(target, ownerType, name.Substring(dot + 1), v, el);
                    return;
                }
                // 이벤트
                var evi = t.GetEvent(name, BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);
                if (evi != null) { HookEvent(target, evi, value, el); return; }
                var pi = t.GetProperty(name, BindingFlags.Public | BindingFlags.Instance);
                if (pi == null)
                {
                    if (target is UIElement ue) { ue.SetAttached(name, value); return; }
                    Warn(el, $"{t.Name} 에 {name} 속성이 없어 무시합니다");
                    return;
                }
                if (value.StartsWith("{") && !value.StartsWith("{}"))
                {
                    var (ename, _, _) = ParseExtension(value);
                    if (ename == "Binding" || ename == "TemplateBinding" || ename == "MultiBinding")
                    {
                        var b = MakeBinding(value, target, el);
                        if (target is FrameworkElement fe && b != null) { BindingOperations.SetBinding(fe, name, b); return; }
                        if (pi.PropertyType == typeof(Binding) || pi.PropertyType == typeof(BindingBase)) { pi.SetValue(target, b); return; }
                        Warn(el, $"{t.Name}.{name} 에는 바인딩을 쓸 수 없습니다"); return;
                    }
                    var ev = Evaluate(value, target, el, pi.PropertyType);
                    if (!pi.CanWrite) return;
                    pi.SetValue(target, Conv.To(pi.PropertyType, ev));
                    return;
                }
                if (value.StartsWith("{}")) value = value.Substring(2);
                if (!pi.CanWrite) { Warn(el, $"{t.Name}.{name} 은 읽기 전용입니다"); return; }
                object? conv;
                try { conv = pi.PropertyType == typeof(Type) ? ResolveTypeValue(value, el) : Conv.FromString(pi.PropertyType, value); }
                catch (Exception ex) { throw Err(el, $"{t.Name}.{name}=\"{value}\" 값을 {pi.PropertyType.Name} 으로 바꿀 수 없습니다: {ex.Message}"); }
                try { pi.SetValue(target, conv); }
                catch (TargetInvocationException tie) { throw new XamlParseException($"{t.Name}.{name} 설정 중 예외: {tie.InnerException?.Message}", tie.InnerException ?? tie); }
            }

            private Type ResolveTypeValue(string value, XElement el)
            {
                if (value.StartsWith("{"))
                {
                    var (n, pos, _) = ParseExtension(value);
                    if (n == "x:Type" || n == "Type") value = pos.Count > 0 ? pos[0] : "";
                }
                var prev = CurrentElement; CurrentElement = el;
                try { return XamlTypes.Resolve(value); } finally { CurrentElement = prev; }
            }

            private void SetAttached(object target, Type ownerType, string prop, object? value, XElement el)
            {
                var setter = ownerType.GetMethod("Set" + prop, BindingFlags.Public | BindingFlags.Static);
                if (setter != null && setter.GetParameters().Length == 2)
                {
                    var ps = setter.GetParameters();
                    try { setter.Invoke(null, new[] { target, value is string s ? Conv.FromString(ps[1].ParameterType, s) : Conv.To(ps[1].ParameterType, value) }); }
                    catch (Exception ex) { throw Err(el, $"{ownerType.Name}.{prop}=\"{value}\" 오류: {(ex as TargetInvocationException)?.InnerException?.Message ?? ex.Message}"); }
                    return;
                }
                if (target is UIElement ue) { ue.SetAttached(ownerType.Name + "." + prop, value); return; }
                Warn(el, $"부착 속성 {ownerType.Name}.{prop} 을 {target.GetType().Name} 에 설정할 수 없습니다");
            }

            private void HookEvent(object target, EventInfo evi, string handlerName, XElement el)
            {
                var owner = Owner ?? Root;
                if (owner == null) { Warn(el, $"{evi.Name}=\"{handlerName}\": 이벤트 처리기를 연결할 코드 비하인드 객체가 없습니다"); return; }
                var mi = FindMethod(owner.GetType(), handlerName);
                if (mi == null) throw Err(el, $"{evi.Name}=\"{handlerName}\": {owner.GetType().Name} 클래스에 {handlerName} 메서드가 없습니다. 코드 비하인드(.xaml.cs)에 이벤트 처리기를 작성하세요.");
                var del = Delegate.CreateDelegate(evi.EventHandlerType!, mi.IsStatic ? null : owner, mi, false);
                if (del == null)
                {
                    var ps = evi.EventHandlerType!.GetMethod("Invoke")!.GetParameters();
                    throw Err(el, $"{evi.Name}=\"{handlerName}\": 메서드 시그니처가 맞지 않습니다. 필요한 형태: void {handlerName}({string.Join(", ", ps.Select(p => p.ParameterType.Name + " " + p.Name))})");
                }
                evi.AddEventHandler(target, del);
            }
            private void HookAttachedEvent(UIElement target, Type ownerType, EventInfo evi, string handlerName, XElement el)
            {
                var owner = Owner ?? Root;
                if (owner == null) { Warn(el, $"{ownerType.Name}.{evi.Name}=\"{handlerName}\": 이벤트 처리기를 연결할 코드 비하인드 객체가 없습니다"); return; }
                var mi = FindMethod(owner.GetType(), handlerName) ?? throw Err(el, $"{ownerType.Name}.{evi.Name}=\"{handlerName}\": {owner.GetType().Name} 클래스에 {handlerName} 메서드가 없습니다.");
                var del = Delegate.CreateDelegate(evi.EventHandlerType!, mi.IsStatic ? null : owner, mi, false)
                          ?? throw Err(el, $"{ownerType.Name}.{evi.Name}=\"{handlerName}\": 메서드 시그니처가 맞지 않습니다.");
                var f = ownerType.GetField(evi.Name + "Event", BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
                var re = f?.GetValue(null) as RoutedEvent ?? new RoutedEvent(evi.Name, evi.DeclaringType!);
                target.AddHandler(re, del);
            }

            private static MethodInfo? FindMethod(Type t, string name)
            {
                for (var x = t; x != null; x = x.BaseType)
                {
                    var m = x.GetMethods(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.DeclaredOnly).FirstOrDefault(mm => mm.Name == name);
                    if (m != null) return m;
                }
                return null;
            }

            // ---------------------------------------------------------------- 마크업 확장
            internal static (string name, List<string> positional, List<KeyValuePair<string, string>> named) ParseExtension(string s)
            {
                s = s.Trim();
                if (!s.StartsWith("{") || !s.EndsWith("}")) throw new XamlParseException("마크업 확장 형식 오류: " + s);
                var body = s.Substring(1, s.Length - 2).Trim();
                var sp = body.IndexOfAny(new[] { ' ', '\t', '\n' });
                var name = sp < 0 ? body : body.Substring(0, sp);
                var rest = sp < 0 ? "" : body.Substring(sp + 1).Trim();
                var positional = new List<string>();
                var named = new List<KeyValuePair<string, string>>();
                foreach (var arg in SplitArgs(rest))
                {
                    var eq = IndexOfTopLevel(arg, '=');
                    if (eq < 0) positional.Add(Unquote(arg.Trim()));
                    else named.Add(new KeyValuePair<string, string>(arg.Substring(0, eq).Trim(), Unquote(arg.Substring(eq + 1).Trim())));
                }
                return (name, positional, named);
            }
            private static string Unquote(string v) => v.Length >= 2 && ((v[0] == '\'' && v[^1] == '\'') || (v[0] == '"' && v[^1] == '"')) ? v.Substring(1, v.Length - 2) : v;
            private static int IndexOfTopLevel(string s, char ch)
            {
                int depth = 0; bool q = false; char qc = '\0';
                for (int i = 0; i < s.Length; i++)
                {
                    var c = s[i];
                    if (q) { if (c == qc) q = false; continue; }
                    if (c == '\'' || c == '"') { q = true; qc = c; continue; }
                    if (c == '{') depth++; else if (c == '}') depth--;
                    else if (c == ch && depth == 0) return i;
                }
                return -1;
            }
            private static List<string> SplitArgs(string s)
            {
                var list = new List<string>();
                if (s.Length == 0) return list;
                int depth = 0; bool q = false; char qc = '\0'; var cur = new StringBuilder();
                for (int i = 0; i < s.Length; i++)
                {
                    var c = s[i];
                    if (q) { cur.Append(c); if (c == qc) q = false; continue; }
                    if (c == '\'' || c == '"') { q = true; qc = c; cur.Append(c); continue; }
                    if (c == '{') depth++; else if (c == '}') depth--;
                    if (c == ',' && depth == 0) { list.Add(cur.ToString()); cur.Clear(); continue; }
                    cur.Append(c);
                }
                if (cur.Length > 0) list.Add(cur.ToString());
                return list;
            }

            private object? Evaluate(string value, object target, XElement el, Type expected)
            {
                var (name, pos, named) = ParseExtension(value);
                switch (name)
                {
                    case "x:Null": case "Null": return null;
                    case "x:Static": case "Static":
                    {
                        var member = pos.Count > 0 ? pos[0] : (named.FirstOrDefault(k => k.Key == "Member").Value ?? "");
                        var dot = member.LastIndexOf('.');
                        if (dot < 0) throw Err(el, "x:Static 형식 오류: " + member);
                        var type = ResolveTypeValue(member.Substring(0, dot), el);
                        var mn = member.Substring(dot + 1);
                        var p = type.GetProperty(mn, BindingFlags.Public | BindingFlags.Static);
                        if (p != null) return p.GetValue(null);
                        var f = type.GetField(mn, BindingFlags.Public | BindingFlags.Static);
                        if (f != null) return f.GetValue(null);
                        throw Err(el, $"x:Static: {type.Name}.{mn} 을 찾을 수 없습니다");
                    }
                    case "x:Type": case "Type": return ResolveTypeValue(pos.Count > 0 ? pos[0] : named.FirstOrDefault(k => k.Key == "TypeName").Value ?? "", el);
                    case "StaticResource": case "DynamicResource":
                    {
                        var key = pos.Count > 0 ? pos[0] : named.FirstOrDefault(k => k.Key == "ResourceKey").Value ?? "";
                        // {StaticResource {x:Type Button}} : 형식 키 (암시적 스타일을 BasedOn 으로 쓸 때)
                        object rkey = key.StartsWith("{") ? (Evaluate(key, target, el, typeof(object)) ?? key) : key;
                        var r = FindResource(rkey, target);
                        if (r == null && rkey is Type) return null;   // 기본 스타일을 가리키는 BasedOn: 실제 WPF 에서도 비어 있을 수 있다
                        if (r == null) throw Err(el, $"리소스 '{key}' 를 찾을 수 없습니다 (Resources 에 x:Key=\"{key}\" 로 정의했는지, 정의가 사용보다 앞에 있는지 확인)");
                        return r;
                    }
                    case "Binding": case "MultiBinding": return MakeBinding(value, target, el);
                    case "RelativeSource": return MakeRelativeSource(pos, named, el);
                    case "TemplateBinding": return null;
                    default:
                        Warn(el, $"지원하지 않는 마크업 확장 {{{name}}}");
                        return null;
                }
            }
            private RelativeSource MakeRelativeSource(List<string> pos, List<KeyValuePair<string, string>> named, XElement el)
            {
                var rs = new RelativeSource();
                if (pos.Count > 0 && Enum.TryParse<RelativeSourceMode>(pos[0], true, out var m)) rs.Mode = m;
                foreach (var kv in named)
                {
                    if (kv.Key == "Mode" && Enum.TryParse<RelativeSourceMode>(kv.Value, true, out var mm)) rs.Mode = mm;
                    else if (kv.Key == "AncestorType") { rs.AncestorType = ResolveTypeValue(kv.Value, el); rs.Mode = RelativeSourceMode.FindAncestor; }
                    else if (kv.Key == "AncestorLevel") rs.AncestorLevel = int.Parse(kv.Value);
                }
                return rs;
            }
            private BindingBase? MakeBinding(string value, object target, XElement el)
            {
                var (name, pos, named) = ParseExtension(value);
                if (name == "TemplateBinding") return null;
                var b = new Binding();
                if (pos.Count > 0) b.Path = pos[0];
                foreach (var kv in named)
                {
                    var pi = typeof(Binding).GetProperty(kv.Key);
                    if (pi == null) { Warn(el, $"Binding 에 {kv.Key} 속성이 없습니다"); continue; }
                    object? v;
                    if (kv.Value.StartsWith("{") && !kv.Value.StartsWith("{}")) v = Evaluate(kv.Value, target, el, pi.PropertyType);
                    else
                    {
                        var raw = kv.Value.StartsWith("{}") ? kv.Value.Substring(2) : kv.Value;
                        v = pi.PropertyType == typeof(object) ? raw : pi.PropertyType == typeof(string) ? raw : Conv.FromString(pi.PropertyType, raw);
                    }
                    pi.SetValue(b, Conv.To(pi.PropertyType, v));
                }
                return b;
            }
            private object? FindResource(object key, object target)
            {
                foreach (var o in _scope)
                {
                    if (o is FrameworkElement fe && fe.Resources.TryGetValue(key, out var v)) return v;
                    if (o is Application app && app.Resources.TryGetValue(key, out var v2)) return v2;
                    if (o is ResourceDictionary rd && rd.TryGetValue(key, out var v3)) return v3;
                    if (o is Style st && st.Resources.TryGetValue(key, out var v4)) return v4;
                }
                if (target is FrameworkElement t) { var r = t.TryFindResource(key); if (r != null) return r; }
                if (ScopeParent != null) { var r = ScopeParent.TryFindResource(key); if (r != null) return r; }
                if (Owner is FrameworkElement ow) { var r = ow.TryFindResource(key); if (r != null) return r; }   // 템플릿: 정의한 창의 Resources
                if (Root is FrameworkElement rf) { var r = rf.TryFindResource(key); if (r != null) return r; }
                if (Application.Current != null && Application.Current.Resources.TryGetValue(key, out var av)) return av;
                return null;
            }

            private static XamlParseException Err(XElement el, string msg)
            {
                var li = (Xml.IXmlLineInfo)el;
                return new XamlParseException($"XAML 오류 ({li.LineNumber}행): {msg}", li.LineNumber, li.LinePosition);
            }
            private static readonly HashSet<string> _warned = new HashSet<string>();
            private static void Warn(XElement el, string msg)
            {
                if (!_warned.Add(msg)) return;
                var li = (Xml.IXmlLineInfo)el;
                Bridge.Write(2, $"[XAML 경고 {li.LineNumber}행] {msg}\n");
            }
        }
    }
}
