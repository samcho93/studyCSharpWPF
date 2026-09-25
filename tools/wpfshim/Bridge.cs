using System;
using System.Collections.Generic;
using System.Text;

namespace WpfShim
{
    /// <summary>
    /// 라이브러리 ↔ 호스트(CsRunner, JS 워커) 연결점. CsRunner 가 시작할 때 대리자를 채운다.
    /// </summary>
    public static class Bridge
    {
        /// <summary>표준 출력(1)/오류(2)/제어(3: clear 등) 쓰기</summary>
        public static Action<int, string> Write = (fd, s) => { };
        /// <summary>한 줄 입력 (없으면 null = EOF). 워커에서는 사용자가 입력할 때까지 블록된다.</summary>
        public static Func<string?> ReadLine = () => null;
        /// <summary>UI 갱신 명령(JSON 배열) 전달</summary>
        public static Action<string> UiOps = s => { };
        /// <summary>동기 요청(메시지 박스 · 파일 대화상자 · 모달 창). 응답 JSON 을 돌려준다. 블록 불가 환경이면 null.</summary>
        public static Func<string, string, string?> SyncCall = (kind, payload) => null;
        /// <summary>모달 대기 중 중첩 이벤트 처리 (payload JSON) — CsRunner 가 UiTree.Dispatch 로 연결</summary>
        public static Action<string>? NestedEvent;
        /// <summary>WPF 앱이 끝났음(모든 창 닫힘)을 알린다</summary>
        public static Action AppExit = () => { };
        /// <summary>블로킹(동기 대기)이 가능한 환경인지 (SharedArrayBuffer)</summary>
        public static bool CanBlock = false;
        /// <summary>현재 실행 중인 사용자 어셈블리 (XAML 의 local: 타입 해석용)</summary>
        public static System.Reflection.Assembly? UserAssembly;
    }
}
