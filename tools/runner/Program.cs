namespace CsRunner;

public static class Program
{
    // 런타임은 js/cs-worker.js 가 직접 띄우고 Interop 의 [JSExport] 메서드를 호출한다. Main 은 쓰이지 않는다.
    public static void Main() { }
}
