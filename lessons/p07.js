/* Project 07. WPF 그림판 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // XAML 루트 요소에 반복되는 네임스페이스 선언 (Visual Studio 템플릿과 같음)
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  /* ======================================================================
   * 그림
   * ==================================================================== */

  /* ---------- 그림 1. 화면 설계 ---------- */
  const SVG_SCREEN = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="그림판 화면 설계: 메뉴, 도구 줄, 색과 굵기 줄, 그림 캔버스, 상태 표시줄">
  <defs><marker id="ap7a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="20" width="720" height="520" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <text x="60" y="50" style="font-size:19px;fill:var(--fg)">내 그림.pnt - 그림판</text>
  <line x1="40" y1="64" x2="760" y2="64" stroke="var(--line)" stroke-width="2"/>
  <rect x="46" y="68" width="708" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <text x="60" y="90" style="font-size:18px;fill:var(--fg)">파일(<tspan text-decoration="underline">F</tspan>)</text>
  <rect x="46" y="104" width="708" height="36" rx="4" fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <g style="font-size:17px;fill:var(--fg)">
    <circle cx="66" cy="122" r="7" fill="var(--fg)"/><text x="80" y="128">펜</text>
    <circle cx="126" cy="122" r="7" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="140" y="128">선</text>
    <circle cx="186" cy="122" r="7" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="200" y="128">사각형</text>
    <circle cx="276" cy="122" r="7" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="290" y="128">원</text>
    <circle cx="336" cy="122" r="7" fill="none" stroke="var(--fg)" stroke-width="2"/><text x="350" y="128">지우개</text>
    <rect x="430" y="110" width="80" height="26" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/><text x="470" y="129" text-anchor="middle">↶ 취소</text>
    <rect x="518" y="110" width="110" height="26" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/><text x="573" y="129" text-anchor="middle">모두 지우기</text>
  </g>
  <rect x="46" y="146" width="708" height="36" rx="4" fill="none" stroke="var(--ok)" stroke-width="3"/>
  <g>
    <text x="60" y="170" style="font-size:17px;fill:var(--fg)">색</text>
    <rect x="86" y="153" width="34" height="22" fill="#222" stroke="var(--line)"/>
    <rect x="132" y="153" width="22" height="22" fill="#222"/><rect x="158" y="153" width="22" height="22" fill="#DC143C"/>
    <rect x="184" y="153" width="22" height="22" fill="#FF8C00"/><rect x="210" y="153" width="22" height="22" fill="#FFD700"/>
    <rect x="236" y="153" width="22" height="22" fill="#228B22"/><rect x="262" y="153" width="22" height="22" fill="#1E90FF"/>
    <rect x="288" y="153" width="22" height="22" fill="#9370DB"/><rect x="314" y="153" width="22" height="22" fill="#8B4513"/>
    <text x="360" y="170" style="font-size:17px;fill:var(--fg)">굵기 3</text>
    <line x1="430" y1="164" x2="560" y2="164" stroke="var(--line)" stroke-width="4"/><circle cx="450" cy="164" r="8" fill="var(--accent)"/>
  </g>
  <rect x="46" y="188" width="708" height="300" rx="4" fill="none" stroke="var(--danger)" stroke-width="3"/>
  <ellipse cx="660" cy="250" rx="34" ry="34" fill="none" stroke="#FFA500" stroke-width="4"/>
  <rect x="160" y="330" width="150" height="110" fill="none" stroke="#8B4513" stroke-width="4"/>
  <polyline points="146,332 235,265 324,332 146,332" fill="none" stroke="#B22222" stroke-width="4" stroke-linejoin="round"/>
  <rect x="440" y="300" width="140" height="90" fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="9 6"/>
  <path d="M70,460 q30,-14 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" fill="none" stroke="#32CD32" stroke-width="4"/>
  <rect x="46" y="494" width="708" height="38" rx="4" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <text x="62" y="519" style="font-size:17px;fill:var(--fg)">(412, 233)   │   사각형 을(를) 그렸습니다.  도구 사각형 · 도형 14개</text>
  <g stroke="var(--muted)" stroke-width="3">
    <line x1="812" y1="84" x2="762" y2="84" marker-end="url(#ap7a)"/>
    <line x1="812" y1="122" x2="762" y2="122" marker-end="url(#ap7a)"/>
    <line x1="812" y1="164" x2="762" y2="164" marker-end="url(#ap7a)"/>
    <line x1="812" y1="330" x2="590" y2="340" marker-end="url(#ap7a)"/>
    <line x1="812" y1="512" x2="762" y2="512" marker-end="url(#ap7a)"/>
  </g>
  <text x="820" y="80" style="font-size:21px;font-weight:700;fill:var(--accent)">① Menu — 열기 · 저장</text>
  <text x="820" y="128" style="font-size:21px;font-weight:700;fill:var(--accent2)">② 도구 (RadioButton) · 명령 버튼</text>
  <text x="820" y="170" style="font-size:21px;font-weight:700;fill:var(--ok)">③ 색 팔레트 · 굵기 Slider</text>
  <text x="820" y="320" style="font-size:21px;font-weight:700;fill:var(--danger)">④ Canvas — 마우스로 그리기</text>
  <text x="820" y="348" style="font-size:18px;fill:var(--muted)">점선 = 끌고 있는 동안의 미리 보기</text>
  <text x="820" y="506" style="font-size:21px;font-weight:700;fill:var(--warn)">⑤ StatusBar — 좌표 · 안내</text>
</svg>`;

  /* ---------- 그림 2. 마우스 이벤트 흐름 ---------- */
  const SVG_MOUSE = `<svg viewBox="0 0 1280 520" width="100%" role="img" aria-label="마우스를 누르면 도형을 만들고, 움직이는 동안 모양을 바꾸고, 놓으면 확정하는 세 이벤트의 흐름">
  <defs><marker id="ap7b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="170" width="260" height="170" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <text x="170" y="214" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">MouseLeftButtonDown</text>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="62" y="252">start = 누른 곳</text>
    <text x="62" y="282">current = 새 도형</text>
    <text x="62" y="312">Children.Add · CaptureMouse</text>
  </g>
  <rect x="510" y="170" width="260" height="170" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <text x="640" y="214" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent2)">MouseMove (여러 번)</text>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="532" y="252">current == null → 좌표만 표시</text>
    <text x="532" y="282">아니면 UpdateShape(p)</text>
    <text x="532" y="312">곡선: 점 추가 · 도형: 크기</text>
  </g>
  <rect x="980" y="170" width="260" height="170" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="1110" y="214" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--ok)">MouseLeftButtonUp</text>
  <g style="font-size:18px;fill:var(--fg)">
    <text x="1002" y="252">점선 → 실선</text>
    <text x="1002" y="282">history.Push(current)</text>
    <text x="1002" y="312">current = null · 캡처 풀기</text>
  </g>
  <g stroke="var(--muted)" stroke-width="4" fill="none">
    <line x1="304" y1="255" x2="504" y2="255" marker-end="url(#ap7b)"/>
    <line x1="774" y1="255" x2="974" y2="255" marker-end="url(#ap7b)"/>
    <path d="M600,166 C600,90 690,90 690,160" marker-end="url(#ap7b)"/>
    <path d="M1110,344 C1110,460 170,460 170,346" marker-end="url(#ap7b)"/>
  </g>
  <text x="645" y="84" text-anchor="middle" style="font-size:18px;fill:var(--muted)">누르고 있는 동안 계속</text>
  <text x="404" y="240" text-anchor="middle" style="font-size:18px;fill:var(--fg)">누른 채 움직임</text>
  <text x="874" y="240" text-anchor="middle" style="font-size:18px;fill:var(--fg)">버튼을 놓음</text>
  <text x="640" y="490" text-anchor="middle" style="font-size:19px;fill:var(--fg)">다음 획 — “지금 그리는 중인가?” 는 필드 current 가 null 인지로 안다</text>
  <text x="640" y="40" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--fg)">세 이벤트가 하나의 “그리기” 를 이룬다</text>
</svg>`;

  /* ---------- 그림 3. 러버밴드 좌표 ---------- */
  const SVG_BOX = `<svg viewBox="0 0 1280 500" width="100%" role="img" aria-label="누른 점과 현재 점으로 사각형을 만들 때 왼쪽 위는 두 좌표의 작은 값, 크기는 차이의 절댓값">
  <defs><marker id="ap7c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="40" width="560" height="400" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="56" y="70" style="font-size:18px;fill:var(--muted)">(0, 0)</text>
  <rect x="160" y="140" width="300" height="190" fill="none" stroke="var(--accent)" stroke-width="4" stroke-dasharray="12 8"/>
  <circle cx="460" cy="140" r="9" fill="var(--danger)"/>
  <text x="472" y="128" style="font-size:19px;fill:var(--danger)">start (460, 140)</text>
  <circle cx="160" cy="330" r="9" fill="var(--ok)"/>
  <text x="70" y="366" style="font-size:19px;fill:var(--ok)">p (160, 330) — 왼쪽 아래로 끌었다</text>
  <circle cx="160" cy="140" r="7" fill="var(--accent)"/>
  <text x="170" y="128" style="font-size:18px;fill:var(--accent)">Left, Top</text>
  <line x1="160" y1="300" x2="460" y2="300" stroke="var(--muted)" stroke-width="2" marker-end="url(#ap7c)"/>
  <text x="310" y="292" text-anchor="middle" style="font-size:18px;fill:var(--fg)">Width = 300</text>
  <line x1="430" y1="140" x2="430" y2="330" stroke="var(--muted)" stroke-width="2" marker-end="url(#ap7c)"/>
  <text x="372" y="240" text-anchor="middle" style="font-size:18px;fill:var(--fg)">Height = 190</text>
  <g style="${MONO};font-size:21px;fill:var(--fg)">
    <text x="650" y="120">Left   = Math.Min(start.X, p.X)</text>
    <text x="650" y="150" style="fill:var(--muted)">       = Math.Min(460, 160) = 160</text>
    <text x="650" y="200">Top    = Math.Min(start.Y, p.Y)</text>
    <text x="650" y="230" style="fill:var(--muted)">       = Math.Min(140, 330) = 140</text>
    <text x="650" y="280">Width  = Math.Abs(p.X - start.X)</text>
    <text x="650" y="310" style="fill:var(--muted)">       = |160 - 460| = 300</text>
    <text x="650" y="360">Height = Math.Abs(p.Y - start.Y)</text>
    <text x="650" y="390" style="fill:var(--muted)">       = |330 - 140| = 190</text>
  </g>
  <text x="640" y="480" text-anchor="middle" style="font-size:20px;fill:var(--fg)">어느 방향으로 끌어도 Width · Height 는 음수가 되지 않는다 (음수면 WPF 가 예외를 던진다)</text>
</svg>`;

  /* ---------- 그림 4. 실행 취소 스택 ---------- */
  const SVG_STACK = `<svg viewBox="0 0 1280 460" width="100%" role="img" aria-label="그릴 때마다 스택에 쌓고, 실행 취소는 맨 위의 도형을 꺼내 캔버스에서 지운다">
  <defs><marker id="ap7d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <text x="200" y="50" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">history (Stack&lt;UIElement&gt;)</text>
  <path d="M90,80 L90,410 L310,410 L310,80" fill="none" stroke="var(--line)" stroke-width="4"/>
  <g style="font-size:20px;fill:var(--fg)">
    <rect x="104" y="340" width="192" height="58" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="200" y="376" text-anchor="middle">① 자유 곡선</text>
    <rect x="104" y="274" width="192" height="58" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="200" y="310" text-anchor="middle">② 사각형</text>
    <rect x="104" y="208" width="192" height="58" rx="8" fill="var(--card)" stroke="var(--line)" stroke-width="2"/><text x="200" y="244" text-anchor="middle">③ 선</text>
    <rect x="104" y="142" width="192" height="58" rx="8" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/><text x="200" y="178" text-anchor="middle">④ 원 ← 맨 위</text>
  </g>
  <g stroke="var(--muted)" stroke-width="4" fill="none">
    <path d="M560,120 C460,120 400,150 318,168" marker-end="url(#ap7d)"/>
    <path d="M318,178 C420,210 480,250 560,262" marker-end="url(#ap7d)"/>
  </g>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="570" y="112"><tspan font-weight="700" style="fill:var(--ok)">그리기 끝 (MouseUp)</tspan></text>
    <text x="570" y="142" style="${MONO};font-size:19px">history.Push(current);</text>
    <text x="570" y="256"><tspan font-weight="700" style="fill:var(--danger)">실행 취소</tspan></text>
    <text x="570" y="286" style="${MONO};font-size:19px">UIElement last = history.Pop();</text>
    <text x="570" y="316" style="${MONO};font-size:19px">board.Children.Remove(last);</text>
    <text x="570" y="380">후입선출(LIFO) — 나중에 넣은 것이 먼저 나온다</text>
    <text x="570" y="414">= “가장 최근에 그린 것부터” 지우는 실행 취소와 딱 맞는다</text>
  </g>
</svg>`;

  /* ---------- 그림 5. 저장 형식 ---------- */
  const SVG_FORMAT = `<svg viewBox="0 0 1280 440" width="100%" role="img" aria-label="캔버스의 도형 하나를 종류, 색, 굵기, 좌표가 들어 있는 글자 한 줄로 저장한다">
  <defs><marker id="ap7e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="40" y="40" width="300" height="220" rx="12" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <rect x="100" y="90" width="160" height="110" fill="none" stroke="#1E90FF" stroke-width="4"/>
  <text x="100" y="80" style="font-size:17px;fill:var(--muted)">(100, 90)</text>
  <text x="180" y="230" text-anchor="middle" style="font-size:17px;fill:var(--muted)">160 × 110, 굵기 2</text>
  <line x1="350" y1="150" x2="440" y2="150" stroke="var(--muted)" stroke-width="4" marker-end="url(#ap7e)"/>
  <rect x="450" y="110" width="790" height="80" rx="10" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
  <g style="${MONO};font-size:26px">
    <text x="474" y="162"><tspan style="fill:var(--accent)">RECT</tspan> <tspan style="fill:var(--danger)">#FF1E90FF</tspan> <tspan style="fill:var(--ok)">2</tspan> <tspan style="fill:var(--accent2)">100,90</tspan> <tspan style="fill:var(--warn)">160,110</tspan></text>
  </g>
  <g style="font-size:18px">
    <text x="474" y="226" style="fill:var(--accent)">종류</text>
    <text x="560" y="226" style="fill:var(--danger)">색 (Color.ToString)</text>
    <text x="780" y="226" style="fill:var(--ok)">굵기</text>
    <text x="850" y="226" style="fill:var(--accent2)">왼쪽 위</text>
    <text x="990" y="226" style="fill:var(--warn)">너비,높이</text>
  </g>
  <g style="${MONO};font-size:19px;fill:var(--fg)">
    <text x="60" y="310"># 그림판 v1</text>
    <text x="60" y="340">PEN #FF000000 3 10,20 14,26 20,31 …   ← 자유 곡선: 점 목록</text>
    <text x="60" y="370">LINE #FFDC143C 4 30,200 250,120        ← 시작점 · 끝점</text>
    <text x="60" y="400">ELLIPSE #FFFFA500 4 440,24 56,56       ← 사각형과 같은 “상자”</text>
  </g>
  <text x="1240" y="310" text-anchor="end" style="font-size:18px;fill:var(--muted)">저장: 한 줄씩 만들어 File.WriteAllLines</text>
  <text x="1240" y="340" text-anchor="end" style="font-size:18px;fill:var(--muted)">읽기: Split(' ') → 첫 칸으로 switch</text>
</svg>`;

  /* ======================================================================
   * 공통 조각 (단계 5 · 6 · 완성)
   * ==================================================================== */
  const PALETTE = ['Black', 'Crimson', 'DarkOrange', 'Gold', 'ForestGreen', 'DodgerBlue', 'MediumPurple', 'SaddleBrown'];
  const PALETTE_ROW = (indent) => {
    const sp = ' '.repeat(indent);
    return `${sp}<StackPanel Orientation="Horizontal" Margin="0,4,0,0">
${sp}    <TextBlock Text="색" VerticalAlignment="Center" Margin="0,0,4,0"/>
${sp}    <Border x:Name="swatch" Width="30" Height="22" Background="Black" BorderBrush="Gray" BorderThickness="1" Margin="0,0,8,0"/>
${PALETTE.map((c) => `${sp}    <Button Background="${c}" Width="22" Height="22" Margin="1" ToolTip="${c}" Click="Color_Click"/>`).join('\n')}
${sp}    <TextBlock Text="{Binding ElementName=sldThick, Path=Value, StringFormat='굵기 {0:F0}'}" Width="52"
${sp}               VerticalAlignment="Center" Margin="12,0,4,0"/>
${sp}    <Slider x:Name="sldThick" Minimum="1" Maximum="20" Value="3" Width="110"
${sp}            IsSnapToTickEnabled="True" TickFrequency="1" VerticalAlignment="Center"/>
${sp}</StackPanel>`;
  };

  const RADIO = (text, tag, extra = '') => `<RadioButton ${extra}Content="${text}" Tag="${tag}" GroupName="tool" Margin="0,0,8,0" VerticalAlignment="Center" Click="Tool_Click"/>`;

  // 도구 줄 (undo = 취소 버튼의 속성, tools · buttons = 확장 과제용 끼워 넣기)
  const TOOL_ROW = (indent, o = {}) => {
    const sp = ' '.repeat(indent);
    return `${sp}<StackPanel Orientation="Horizontal">
${sp}    ${RADIO('펜', 'pen', 'x:Name="rbPen" IsChecked="True" ')}
${sp}    ${RADIO('선', 'line')}
${sp}    ${RADIO('사각형', 'rect')}
${sp}    ${RADIO('원', 'ellipse')}
${o.tools || ''}${sp}    ${RADIO('지우개', 'eraser')}
${sp}    <Button Content="↶ 취소" Padding="8,2" Margin="4,0,0,0" ${o.undo || 'Click="Undo_Click"'}/>
${o.buttons || ''}${sp}    <Button Content="모두 지우기" Padding="8,2" Margin="4,0,0,0" Click="Clear_Click"/>
${sp}</StackPanel>`;
  };

  const STATUS_XAML = `        <StatusBar DockPanel.Dock="Bottom">
            <StatusBarItem><TextBlock x:Name="lblPos" Width="80" Text="(0, 0)"/></StatusBarItem>
            <Separator/>
            <StatusBarItem><TextBlock x:Name="lblInfo"/></StatusBarItem>
        </StatusBar>`;

  const CANVAS_XAML = `        <!-- Background 가 있어야 빈 곳에서도 마우스 이벤트를 받는다 -->
        <Canvas x:Name="board" Background="White" ClipToBounds="True" Cursor="Cross"
                MouseLeftButtonDown="Board_MouseLeftButtonDown" MouseMove="Board_MouseMove"
                MouseLeftButtonUp="Board_MouseLeftButtonUp"/>`;

  const USINGS = `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;       // Polyline, Line, Rectangle, Ellipse (Path 는 System.IO 와 이름이 겹친다!)
using Microsoft.Win32;`;

  // 그리기 핵심: 마우스 세 이벤트 + 도형 만들기 · 모양 맞추기 · 마무리
  const CS_DRAW = (o = {}) => `        // ---------- 마우스로 그리기 ----------
        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (current != null) Finish();                 // (캔버스 밖에서 버튼을 놓친 경우) 하던 것부터 마무리
            start = e.GetPosition(board);
            current = CreateShape(start);
            if (current == null) return;
            board.Children.Add(current);
            board.CaptureMouse();                          // 캔버스 밖으로 나가도 마우스 이벤트를 계속 받는다
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(board);
            lblPos.Text = $"({p.X:F0}, {p.Y:F0})";
            if (current == null) return;                   // 누르지 않고 움직이는 중
            if (e.LeftButton != MouseButtonState.Pressed) { Finish(); return; }   // 버튼을 놓친 경우
            UpdateShape(current, p);
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            UpdateShape(current, e.GetPosition(board));
            Finish();
        }

        // 도구에 맞는 새 도형 — 선 · 사각형 · 원은 점선 미리 보기로 시작한다
        private Shape? CreateShape(Point p)
        {
            double thick = sldThick.Value;
            switch (tool)
            {
                case "pen":
                    return NewStroke(penBrush, thick, p);
                case "eraser":
                    return NewStroke(Brushes.White, thick * 4, p);    // 지우개 = 배경색(흰색)으로 굵게 칠하기
                case "line":
                    return Preview(new Line { X1 = p.X, Y1 = p.Y, X2 = p.X, Y2 = p.Y });
                case "rect":
                    return Preview(new Rectangle());
                case "ellipse":
                    return Preview(new Ellipse());
${o.create || ''}                default:
                    return null;
            }
        }

        // 러버밴드(고무줄) 미리 보기: 끄는 동안은 점선, 마우스를 놓으면 실선
        private Shape Preview(Shape s)
        {
            s.Stroke = penBrush;
            s.StrokeThickness = sldThick.Value;
            s.StrokeDashArray = new DoubleCollection { 3, 2 };
            UpdateShape(s, start);                         // 처음에는 크기 0
            return s;
        }

        // 자유 곡선 한 획 (끝과 꺾이는 곳을 둥글게)
        private static Polyline NewStroke(Brush brush, double thickness, Point first)
        {
            return new Polyline
            {
                Stroke = brush,
                StrokeThickness = thickness,
                StrokeLineJoin = PenLineJoin.Round,
                StrokeStartLineCap = PenLineCap.Round,
                StrokeEndLineCap = PenLineCap.Round,
                Points = new PointCollection { first }
            };
        }

        // 마우스가 p 에 있을 때 도형의 모양을 맞춘다
        private void UpdateShape(Shape shape, Point p)
        {
            if (shape is Polyline stroke)
            {
                AddPoint(stroke, p);
            }
            else if (shape is Line line)
            {
                line.X2 = p.X;
                line.Y2 = p.Y;
            }
${o.update || ''}            else    // Rectangle · Ellipse: 누른 곳(start)과 지금 위치(p)를 두 모서리로 하는 상자
            {
                Canvas.SetLeft(shape, Math.Min(start.X, p.X));
                Canvas.SetTop(shape, Math.Min(start.Y, p.Y));
                shape.Width = Math.Abs(p.X - start.X);
                shape.Height = Math.Abs(p.Y - start.Y);
            }
        }

        // 자유 곡선에 점 하나 더하기
        private static void AddPoint(Polyline stroke, Point p)
        {
            Point last = stroke.Points[stroke.Points.Count - 1];
            if (Math.Abs(p.X - last.X) + Math.Abs(p.Y - last.Y) < 2) return;   // 너무 가까운 점은 건너뛴다
            // 점을 하나 더한 새 목록으로 바꿔 끼운다
            // (stroke.Points.Add(p) 만 써도 다시 그려진다 — 여기서는 새 컬렉션으로 바꾸는 방법도 보여 준다)
            PointCollection points = new PointCollection(stroke.Points);
            points.Add(p);
            stroke.Points = points;
        }

        // 그리기 끝: 점선 → 실선, 실행 취소 목록에 쌓기
        private void Finish()
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            Shape done = current;
            current = null;
${o.tiny ? `            if (IsTooSmall(done)) { board.Children.Remove(done); return; }   // 클릭만 하고 끌지 않은 도형은 버린다
` : ''}            done.StrokeDashArray = null;
            history.Push(done);
${o.onCommit || ''}            UpdateInfo($"{ToolName(tool)} 을(를) 그렸습니다.");
        }
${o.tiny ? `
        private static bool IsTooSmall(Shape s)
        {
            if (s is Polyline stroke) return stroke.Points.Count < 2;          // 점 하나짜리 획은 보이지 않는다
            if (s is Line line) return Math.Abs(line.X2 - line.X1) + Math.Abs(line.Y2 - line.Y1) < 3;
            return s.Width < 3 && s.Height < 3;
        }
` : ''}
        // ---------- 도구 · 색 ----------
        private void Tool_Click(object sender, RoutedEventArgs e)
        {
            tool = ((RadioButton)sender).Tag as string ?? "pen";   // XAML 의 Tag="rect" 같은 글자
            UpdateInfo($"{ToolName(tool)} 도구를 골랐습니다.");
        }

        private void Color_Click(object sender, RoutedEventArgs e)
        {
            penBrush = ((Button)sender).Background ?? Brushes.Black;   // 누른 버튼의 배경색 = 펜 색
            swatch.Background = penBrush;
            if (tool == "eraser") { tool = "pen"; rbPen.IsChecked = true; }   // 색을 고르면 펜으로 돌아온다
            UpdateInfo("색을 바꿨습니다.");
        }`;

  const CS_CLEAR = (o = {}) => `        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            if (board.Children.Count == 0) return;
            MessageBoxResult r = MessageBox.Show("그림을 모두 지울까요? (실행 취소할 수 없습니다)", "모두 지우기",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (r != MessageBoxResult.Yes) return;
            board.Children.Clear();
            history.Clear();
${o.onClear || ''}            UpdateInfo("모두 지웠습니다.");
        }`;

  const CS_INFO = (o = {}) => `        private void UpdateInfo(string message)
        {
            lblInfo.Text = $"{message}   도구 {ToolName(tool)} · 도형 {board.Children.Count}개";
        }

        private static string ToolName(string t) => t switch
        {
            "pen" => "펜",
            "line" => "선",
            "rect" => "사각형",
            "ellipse" => "원",
            "eraser" => "지우개",
${o.names || ''}            _ => t
        };`;

  const CS_FILE = (o = {}) => `        // ---------- 파일: 도형 하나 = 글자 한 줄 ----------
        //   PEN #FF000000 3 10,20 12,25 …   자유 곡선 · 지우개 (점 목록)
        //   LINE #FFDC143C 2 x1,y1 x2,y2     선 (시작점 · 끝점)
        //   RECT #FF1E90FF 2 x,y w,h         사각형 (왼쪽 위 · 너비,높이)
        //   ELLIPSE #FFFFA500 4 x,y w,h      원 (사각형과 같은 상자)
        private List<string> ToLines()
        {
            List<string> lines = new List<string> { "# 그림판 v1" };
            foreach (UIElement el in board.Children)
            {
                if (el is not Shape s || s.Stroke is not SolidColorBrush brush) continue;
                string head = $"{brush.Color} {(int)s.StrokeThickness}";              // 색 · 굵기
                if (s is Polyline stroke)
                    lines.Add($"PEN {head} {string.Join(" ", stroke.Points.Select(Xy))}");
                else if (s is Line line)
                    lines.Add($"LINE {head} {Xy(new Point(line.X1, line.Y1))} {Xy(new Point(line.X2, line.Y2))}");
${o.save || ''}                else if (s is Rectangle || s is Ellipse)
                    lines.Add($"{(s is Rectangle ? "RECT" : "ELLIPSE")} {head} {Xy(new Point(Canvas.GetLeft(s), Canvas.GetTop(s)))} {Xy(new Point(s.Width, s.Height))}");
            }
            return lines;
        }

        // 좌표는 정수 "x,y" 로 (소수점 · 문화권 걱정 없음)
        private static string Xy(Point p) => $"{(int)Math.Round(p.X)},{(int)Math.Round(p.Y)}";

        private static Point ParseXy(string text)
        {
            string[] xy = text.Split(',');
            return new Point(int.Parse(xy[0]), int.Parse(xy[1]));
        }

        // 글자 줄들로 그림을 다시 만든다 — 형식이 틀리면 FormatException · IndexOutOfRangeException
        private void LoadLines(IEnumerable<string> lines)
        {
            board.Children.Clear();
            history.Clear();
${o.onClear || ''}            foreach (string text in lines)
            {
                if (text.Trim() == "" || text.StartsWith("#")) continue;         // 빈 줄 · 설명 줄
                string[] parts = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                Brush brush = new SolidColorBrush((Color)ColorConverter.ConvertFromString(parts[1]));
                double thick = int.Parse(parts[2]);
                Shape shape;
                switch (parts[0])
                {
                    case "PEN":
                        Polyline stroke = NewStroke(brush, thick, ParseXy(parts[3]));
                        PointCollection points = new PointCollection(stroke.Points);
                        for (int i = 4; i < parts.Length; i++) points.Add(ParseXy(parts[i]));
                        stroke.Points = points;
                        shape = stroke;
                        break;
                    case "LINE":
                        Point a = ParseXy(parts[3]), b = ParseXy(parts[4]);
                        shape = new Line { X1 = a.X, Y1 = a.Y, X2 = b.X, Y2 = b.Y };
                        break;
                    case "RECT":
                    case "ELLIPSE":
                        shape = parts[0] == "RECT" ? new Rectangle() : new Ellipse();
                        Point pos = ParseXy(parts[3]), size = ParseXy(parts[4]);
                        Canvas.SetLeft(shape, pos.X);
                        Canvas.SetTop(shape, pos.Y);
                        shape.Width = size.X;
                        shape.Height = size.Y;
                        break;
${o.load || ''}                    default:
                        continue;                                                // 모르는 종류는 건너뛴다
                }
                shape.Stroke = brush;
                shape.StrokeThickness = thick;
                board.Children.Add(shape);
                history.Push(shape);                                             // 읽은 그림도 한 획씩 취소할 수 있다
            }
        }

        private void Save_Click(object sender, RoutedEventArgs e)
        {
            SaveFileDialog dlg = new SaveFileDialog();
            dlg.Filter = FileFilter;
            dlg.DefaultExt = ".pnt";
            dlg.FileName = "내 그림.pnt";
            if (dlg.ShowDialog() != true) return;
            File.WriteAllLines(dlg.FileName, ToLines());
            Title = $"{System.IO.Path.GetFileName(dlg.FileName)} - 그림판";   // Path 는 이름을 모두 적는다
            UpdateInfo($"저장했습니다 ({board.Children.Count}개).");
        }

        private void Open_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Filter = FileFilter;
            if (dlg.ShowDialog() != true) return;
            try
            {
                LoadLines(File.ReadAllLines(dlg.FileName));
                Title = $"{System.IO.Path.GetFileName(dlg.FileName)} - 그림판";
                UpdateInfo($"불러왔습니다 ({board.Children.Count}개).");
            }
            catch (Exception ex)       // 그림판 형식이 아닌 파일 (숫자 · 색이 아닌 글자, 칸 부족 …)
            {
                MessageBox.Show($"그림 파일을 읽지 못했습니다.\\n{ex.Message}", "열기 오류",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Exit_Click(object sender, RoutedEventArgs e) { Close(); }`;

  const MENU_XAML = `        <Menu DockPanel.Dock="Top">
            <MenuItem Header="파일(_F)">
                <MenuItem Header="열기(_O)..." Click="Open_Click"/>
                <MenuItem Header="저장(_S)..." Click="Save_Click"/>
                <Separator/>
                <MenuItem Header="끝내기(_X)" Click="Exit_Click"/>
            </MenuItem>
        </Menu>`;

  const FIELDS = `        private string tool = "pen";                   // 지금 도구: pen · line · rect · ellipse · eraser
        private Brush penBrush = Brushes.Black;        // 지금 색
        private Shape? current;                        // 그리는 중인 도형 (마우스를 누르고 있을 때만)
        private Point start;                           // 마우스를 누른 곳
        private readonly Stack<UIElement> history = new Stack<UIElement>();   // 그린 순서 — 실행 취소는 맨 위부터`;

  /* ======================================================================
   * p07-1 준비 예제 · 단계 1
   * ==================================================================== */
  const EX_BOX = `using System;

class Program
{
    // 누른 점(sx, sy)과 지금 점(px, py)으로 사각형의 왼쪽 위 · 크기 구하기
    static void Box(double sx, double sy, double px, double py)
    {
        double left = Math.Min(sx, px);
        double top = Math.Min(sy, py);
        double width = Math.Abs(px - sx);
        double height = Math.Abs(py - sy);
        Console.WriteLine($"({sx},{sy}) → ({px},{py}) : Left {left}, Top {top}, {width} × {height}");
    }

    static void Main()
    {
        Box(100, 50, 300, 200);   // 오른쪽 아래로
        Box(300, 200, 100, 50);   // 왼쪽 위로
        Box(460, 140, 160, 330);  // 왼쪽 아래로
        Box(80, 80, 80, 80);      // 클릭만 (끌지 않음)
    }
}`;

  const EX_STACK = `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Stack<string> history = new Stack<string>();   // 나중에 넣은 것이 먼저 나온다

        history.Push("자유 곡선");
        history.Push("사각형");
        history.Push("선");
        Console.WriteLine($"그린 것 {history.Count}개, 맨 위 = {history.Peek()}");

        // 실행 취소 두 번
        for (int i = 0; i < 2; i++)
        {
            string last = history.Pop();
            Console.WriteLine($"실행 취소 → '{last}' 지움 (남은 {history.Count}개)");
        }

        history.Push("원");
        Console.WriteLine("남은 순서 (위부터): " + string.Join(", ", history));

        history.Clear();
        Console.WriteLine(history.Count == 0 ? "비었습니다 — 더 취소할 것이 없음" : "아직 남음");
    }
}`;

  const EX_STEP1 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step1.MainWindow"
        ${NS}
        Title="그림판 — 단계 1. 화면 틀" Width="560" Height="460">
    <DockPanel>
        <!-- ① 도구 줄 · ② 색과 굵기 줄 -->
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
            <StackPanel>
${TOOL_ROW(16).replace(/ Click="[A-Za-z_]+"/g, '')}
${PALETTE_ROW(16).replace(/ Click="[A-Za-z_]+"/g, '')}
            </StackPanel>
        </Border>
${STATUS_XAML}
        <!-- ③ 캔버스: 좌표로 도형을 놓는 판. 지금은 XAML 로 몇 개 놓아 본다 -->
        <Canvas x:Name="board" Background="White" ClipToBounds="True">
            <Polyline Points="30,210 60,180 90,210 120,180 150,210 180,180" Stroke="Crimson" StrokeThickness="4"
                      StrokeLineJoin="Round"/>
            <Line X1="210" Y1="40" X2="300" Y2="200" Stroke="DodgerBlue" StrokeThickness="3"/>
            <Ellipse Canvas.Left="40" Canvas.Top="30" Width="100" Height="100" Stroke="DarkOrange" StrokeThickness="4"/>
            <Rectangle Canvas.Left="340" Canvas.Top="40" Width="150" Height="90" Stroke="ForestGreen" StrokeThickness="3"/>
            <Rectangle Canvas.Left="340" Canvas.Top="160" Width="150" Height="60" Stroke="MediumPurple"
                       StrokeThickness="2" StrokeDashArray="3 2"/>
            <TextBlock Canvas.Left="344" Canvas.Top="228" Text="점선 = 끄는 동안의 미리 보기" Foreground="Gray"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;

namespace P07Step1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            lblInfo.Text = $"캔버스 위 도형 {board.Children.Count}개 (TextBlock 포함) — 다음 단계부터 마우스로 그립니다";
        }
    }
}`;

  /* ---------- p07-1 실습 ---------- */
  const P1_STARTER = `using System;

class Program
{
    // TODO 1: 사각형 정보를 "RECT 색 굵기 x,y w,h" 한 줄로 만들기 (좌표는 반올림한 정수)
    //         예) MakeRect("#FF1E90FF", 2, 30.4, 40.6, 100, 50) → "RECT #FF1E90FF 2 30,41 100,50"
    static string MakeRect(string color, int thickness, double x, double y, double w, double h)
    {
        return "";
    }

    // TODO 2: "LINE 색 굵기 x1,y1 x2,y2" 를 나누어 출력하기
    //         선: (10, 20) → (200, 120)
    //         색 #FFFF0000, 굵기 3, 길이 214.7
    static void ShowLine(string line)
    {
    }

    static void Main()
    {
        Console.WriteLine(MakeRect("#FF1E90FF", 2, 30.4, 40.6, 100, 50));
        ShowLine("LINE #FFFF0000 3 10,20 200,120");
    }
}`;

  const P1_SOLUTION = `using System;

class Program
{
    static string MakeRect(string color, int thickness, double x, double y, double w, double h)
    {
        return $"RECT {color} {thickness} {(int)Math.Round(x)},{(int)Math.Round(y)} {(int)Math.Round(w)},{(int)Math.Round(h)}";
    }

    static void ShowLine(string line)
    {
        string[] parts = line.Split(' ');          // [0]LINE [1]색 [2]굵기 [3]시작 [4]끝
        string[] a = parts[3].Split(',');
        string[] b = parts[4].Split(',');
        int x1 = int.Parse(a[0]), y1 = int.Parse(a[1]);
        int x2 = int.Parse(b[0]), y2 = int.Parse(b[1]);
        double length = Math.Sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));   // 피타고라스
        Console.WriteLine($"선: ({x1}, {y1}) → ({x2}, {y2})");
        Console.WriteLine($"색 {parts[1]}, 굵기 {parts[2]}, 길이 {length:F1}");
    }

    static void Main()
    {
        Console.WriteLine(MakeRect("#FF1E90FF", 2, 30.4, 40.6, 100, 50));
        ShowLine("LINE #FFFF0000 3 10,20 200,120");
    }
}`;

  const P2_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Practice2.MainWindow"
        ${NS}
        Title="점 찍기와 실행 취소" Width="440" Height="340">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="8">
            <Button Content="↶ 마지막 점 지우기" Padding="10,3" Click="BtnUndo_Click"/>
            <TextBlock x:Name="lblInfo" VerticalAlignment="Center" Margin="10,0,0,0" Text="캔버스를 클릭해 보세요"/>
        </StackPanel>
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown"/>
    </DockPanel>
</Window>`;

  const P2_STARTER = `${P2_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Practice2
{
    public partial class MainWindow : Window
    {
        private const double Size = 14;          // 점의 지름
        // TODO 1: 찍은 점을 쌓아 둘 Stack<UIElement> 필드 dots

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);
            // TODO 2: 지름 Size 의 DodgerBlue 원을 클릭한 곳이 "중심" 이 되게 놓고, dots 에도 쌓기
            //         lblInfo 에 "점 n개"
        }

        private void BtnUndo_Click(object sender, RoutedEventArgs e)
        {
            // TODO 3: 쌓인 점이 없으면 "지울 점이 없습니다", 있으면 맨 위 점을 꺼내 캔버스에서 지우고 "점 n개"
        }
    }
}`;

  const P2_SOLUTION = `${P2_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Practice2
{
    public partial class MainWindow : Window
    {
        private const double Size = 14;
        private readonly Stack<UIElement> dots = new Stack<UIElement>();

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);
            Ellipse dot = new Ellipse { Width = Size, Height = Size, Fill = Brushes.DodgerBlue };
            Canvas.SetLeft(dot, p.X - Size / 2);       // 반지름만큼 빼면 클릭한 곳이 중심
            Canvas.SetTop(dot, p.Y - Size / 2);
            board.Children.Add(dot);
            dots.Push(dot);
            lblInfo.Text = $"점 {dots.Count}개";
        }

        private void BtnUndo_Click(object sender, RoutedEventArgs e)
        {
            if (dots.Count == 0) { lblInfo.Text = "지울 점이 없습니다"; return; }
            board.Children.Remove(dots.Pop());         // 가장 나중에 찍은 점
            lblInfo.Text = $"점 {dots.Count}개";
        }
    }
}`;

  /* ---------- p07-1 슬라이드 코드 ---------- */
  const SL_BOX = `using System;

class Program
{
    static void Main()
    {
        double sx = 460, sy = 140;   // 누른 곳
        double px = 160, py = 330;   // 지금 마우스
        Console.WriteLine($"Left {Math.Min(sx, px)}, Top {Math.Min(sy, py)}");
        Console.WriteLine($"Width {Math.Abs(px - sx)}, Height {Math.Abs(py - sy)}");
    }
}`;

  const SL_STACK = `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var history = new Stack<string>();
        history.Push("곡선"); history.Push("사각형"); history.Push("선");
        Console.WriteLine($"취소 → {history.Pop()}");     // 선
        Console.WriteLine($"취소 → {history.Pop()}");     // 사각형
        Console.WriteLine($"남은 {history.Count}개, 맨 위 {history.Peek()}");
    }
}`;

  /* ======================================================================
   * p07-2 단계 2 ~ 4
   * ==================================================================== */
  const EX_STEP2 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step2.MainWindow"
        ${NS}
        Title="그림판 — 단계 2. 자유 곡선" Width="560" Height="460">
    <DockPanel>
        <TextBlock DockPanel.Dock="Top" Margin="8,6" Text="왼쪽 버튼을 누른 채 움직이면 선이 그려집니다."/>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;       // Polyline

namespace P07Step2
{
    public partial class MainWindow : Window
    {
        private Polyline? current;     // 지금 그리는 획 (누르고 있지 않으면 null)
        private int strokeCount = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        // ① 누르면: 새 획을 만들어 캔버스에 넣는다
        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);      // 캔버스 왼쪽 위가 (0, 0)
            current = new Polyline
            {
                Stroke = Brushes.Black,
                StrokeThickness = 3,
                StrokeLineJoin = PenLineJoin.Round,   // 꺾이는 곳을 둥글게
                Points = new PointCollection { p }
            };
            board.Children.Add(current);
            board.CaptureMouse();                // 캔버스 밖으로 나가도 이벤트를 계속 받는다
        }

        // ② 움직이면: 누르고 있는 동안만 점을 더한다
        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(board);
            lblPos.Text = $"({p.X:F0}, {p.Y:F0})";
            if (current == null) return;

            // 점을 하나 더한 새 목록으로 바꿔 끼운다
            // (current.Points.Add(p) 만 써도 다시 그려진다 — 여기서는 새 컬렉션으로 바꾸는 방법도 보여 준다)
            PointCollection points = new PointCollection(current.Points);
            points.Add(p);
            current.Points = points;
        }

        // ③ 놓으면: 이번 획 끝
        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            strokeCount++;
            lblInfo.Text = $"{strokeCount}번째 획 — 점 {current.Points.Count}개";
            current = null;
        }
    }
}`;

  const EX_STEP3 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step3.MainWindow"
        ${NS}
        Title="그림판 — 단계 3. 색과 굵기" Width="560" Height="460">
    <DockPanel>
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
${PALETTE_ROW(12).replace('Margin="0,4,0,0"', 'Margin="0"')}
        </Border>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Step3
{
    public partial class MainWindow : Window
    {
        private Polyline? current;
        private Brush penBrush = Brushes.Black;      // 지금 고른 색

        public MainWindow()
        {
            InitializeComponent();
            lblInfo.Text = "색 단추를 누르고, 굵기 막대를 움직여 보세요.";
        }

        // 색 단추 여덟 개가 이 처리기 하나를 함께 쓴다 → 누른 단추의 배경색이 곧 펜 색
        private void Color_Click(object sender, RoutedEventArgs e)
        {
            penBrush = ((Button)sender).Background ?? Brushes.Black;
            swatch.Background = penBrush;             // 지금 색 표시
            lblInfo.Text = $"색: {((Button)sender).ToolTip}";
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            current = new Polyline
            {
                Stroke = penBrush,
                StrokeThickness = sldThick.Value,     // 누르는 순간의 굵기
                StrokeLineJoin = PenLineJoin.Round,
                StrokeStartLineCap = PenLineCap.Round,
                StrokeEndLineCap = PenLineCap.Round,
                Points = new PointCollection { e.GetPosition(board) }
            };
            board.Children.Add(current);
            board.CaptureMouse();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(board);
            lblPos.Text = $"({p.X:F0}, {p.Y:F0})";
            if (current == null) return;
            PointCollection points = new PointCollection(current.Points);
            points.Add(p);
            current.Points = points;
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            lblInfo.Text = $"굵기 {current.StrokeThickness:F0} 의 획을 그렸습니다. (모두 {board.Children.Count}개)";
            current = null;
        }
    }
}`;

  const EX_STEP4 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step4.MainWindow"
        ${NS}
        Title="그림판 — 단계 4. 지우개 · 실행 취소" Width="560" Height="460">
    <DockPanel>
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
            <StackPanel>
                <StackPanel Orientation="Horizontal">
                    <CheckBox x:Name="chkEraser" Content="지우개" VerticalAlignment="Center" Margin="0,0,8,0"/>
                    <Button Content="↶ 취소" Padding="8,2" Margin="4,0,0,0" Click="Undo_Click"/>
                    <Button Content="모두 지우기" Padding="8,2" Margin="4,0,0,0" Click="Clear_Click"/>
                </StackPanel>
${PALETTE_ROW(16)}
            </StackPanel>
        </Border>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Step4
{
    public partial class MainWindow : Window
    {
        private Polyline? current;
        private Brush penBrush = Brushes.Black;
        private readonly Stack<UIElement> history = new Stack<UIElement>();   // 그린 순서대로 쌓는다

        public MainWindow()
        {
            InitializeComponent();
            UpdateInfo("그려 보고, ↶ 취소 로 하나씩 지워 보세요.");
        }

        private void Color_Click(object sender, RoutedEventArgs e)
        {
            penBrush = ((Button)sender).Background ?? Brushes.Black;
            swatch.Background = penBrush;
            chkEraser.IsChecked = false;              // 색을 고르면 펜으로 돌아온다
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            bool eraser = chkEraser.IsChecked == true;
            current = new Polyline
            {
                // 지우개 = 배경색(흰색)으로 4배 굵게 덧칠하기
                Stroke = eraser ? Brushes.White : penBrush,
                StrokeThickness = eraser ? sldThick.Value * 4 : sldThick.Value,
                StrokeLineJoin = PenLineJoin.Round,
                StrokeStartLineCap = PenLineCap.Round,
                StrokeEndLineCap = PenLineCap.Round,
                Points = new PointCollection { e.GetPosition(board) }
            };
            board.Children.Add(current);
            board.CaptureMouse();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            Point p = e.GetPosition(board);
            lblPos.Text = $"({p.X:F0}, {p.Y:F0})";
            if (current == null) return;
            PointCollection points = new PointCollection(current.Points);
            points.Add(p);
            current.Points = points;
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            history.Push(current);                    // 다 그린 획을 쌓는다
            current = null;
            UpdateInfo("획을 그렸습니다.");
        }

        // 실행 취소: 가장 나중에 그린 것부터 하나씩
        private void Undo_Click(object sender, RoutedEventArgs e)
        {
            if (history.Count == 0) { UpdateInfo("더 취소할 것이 없습니다."); return; }
            UIElement last = history.Pop();
            board.Children.Remove(last);
            UpdateInfo("실행 취소");
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            if (board.Children.Count == 0) return;
            MessageBoxResult r = MessageBox.Show("그림을 모두 지울까요? (실행 취소할 수 없습니다)", "모두 지우기",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (r != MessageBoxResult.Yes) return;
            board.Children.Clear();
            history.Clear();                          // 캔버스와 스택을 함께 비운다
            UpdateInfo("모두 지웠습니다.");
        }

        private void UpdateInfo(string message)
        {
            lblInfo.Text = $"{message}   획 {board.Children.Count}개 · 취소 가능 {history.Count}개";
        }
    }
}`;

  /* ---------- p07-2 실습 ---------- */
  const P3_XAML = (bind) => `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Practice3.MainWindow"
        ${NS}
        Title="펜 미리 보기" Width="420" Height="320">
    <StackPanel Margin="14">
        <StackPanel Orientation="Horizontal">
${['Black', 'Crimson', 'DarkOrange', 'ForestGreen', 'DodgerBlue', 'MediumPurple'].map((c) => `            <Button Background="${c}" Width="26" Height="26" Margin="2" Click="Color_Click"/>`).join('\n')}
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,10,0,0">
            <TextBlock Text="굵기" VerticalAlignment="Center" Margin="0,0,6,0"/>
            <Slider x:Name="sldThick" Minimum="1" Maximum="60" Value="12" Width="200"
                    IsSnapToTickEnabled="True" TickFrequency="1" VerticalAlignment="Center"/>
            <TextBlock Text="{Binding ElementName=sldThick, Path=Value, StringFormat='지름 {0:F0}px'}"
                       VerticalAlignment="Center" Margin="6,0,0,0"/>
        </StackPanel>
        <Border Width="120" Height="120" Margin="0,12,0,0" HorizontalAlignment="Left"
                BorderBrush="LightGray" BorderThickness="1" Background="White">
${bind
    ? `            <!-- 지름 = 굵기: 두 속성을 슬라이더 값에 바인딩 -->
            <Ellipse x:Name="preview" Fill="Black"
                     Width="{Binding ElementName=sldThick, Path=Value}"
                     Height="{Binding ElementName=sldThick, Path=Value}"/>`
    : `            <!-- TODO 1: Width · Height 를 슬라이더 값에 바인딩 (지름 = 굵기) -->
            <Ellipse x:Name="preview" Fill="Black" Width="12" Height="12"/>`}
        </Border>
        <TextBlock x:Name="lblInfo" Margin="0,10,0,0" Foreground="Gray" Text="색 단추를 누르고 굵기를 바꿔 보세요"/>
    </StackPanel>
</Window>`;

  const P3_STARTER = `${P3_XAML(false)}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace P07Practice3
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Color_Click(object sender, RoutedEventArgs e)
        {
            // TODO 2: 누른 단추의 배경색으로 preview 를 칠하고
            //         lblInfo 에 "색: #FFDC143C" 처럼 색 값 표시 ((SolidColorBrush)브러시).Color
        }
    }
}`;

  const P3_SOLUTION = `${P3_XAML(true)}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace P07Practice3
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Color_Click(object sender, RoutedEventArgs e)
        {
            Brush brush = ((Button)sender).Background ?? Brushes.Black;
            preview.Fill = brush;
            if (brush is SolidColorBrush solid)
                lblInfo.Text = $"색: {solid.Color}";      // Color.ToString() → #AARRGGBB
        }
    }
}`;

  const P4_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Practice4.MainWindow"
        ${NS}
        Title="무지개 펜" Width="500" Height="380">
    <DockPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Top" Margin="8,6" Text="선을 그을 때마다 색이 바뀝니다."/>
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown" MouseMove="Board_MouseMove"
                MouseLeftButtonUp="Board_MouseLeftButtonUp"/>
    </DockPanel>
</Window>`;

  const P4_STARTER = `${P4_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Practice4
{
    public partial class MainWindow : Window
    {
        // 무지개 일곱 색과 이름
        private readonly Brush[] colors = { Brushes.Red, Brushes.Orange, Brushes.Gold, Brushes.Green, Brushes.Blue, Brushes.Indigo, Brushes.Purple };
        private readonly string[] names = { "빨강", "주황", "노랑", "초록", "파랑", "남색", "보라" };
        private Polyline? current;
        private int strokeCount = 0;         // 지금까지 그은 획 수

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            current = new Polyline
            {
                Stroke = Brushes.Black,      // TODO 1: 획 수에 따라 colors 를 차례로 (일곱 번째 다음은 다시 빨강)
                StrokeThickness = 6,
                StrokeLineJoin = PenLineJoin.Round,
                Points = new PointCollection { e.GetPosition(board) }
            };
            board.Children.Add(current);
            board.CaptureMouse();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            if (current == null) return;
            PointCollection points = new PointCollection(current.Points);
            points.Add(e.GetPosition(board));
            current.Points = points;
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            current = null;
            lblInfo.Text = $"획 {strokeCount}개";   // TODO 2: 획 수를 1 늘리고 "획 3개 · 다음 색: 초록" 처럼 표시
        }
    }
}`;

  const P4_SOLUTION = `${P4_XAML}
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P07Practice4
{
    public partial class MainWindow : Window
    {
        private readonly Brush[] colors = { Brushes.Red, Brushes.Orange, Brushes.Gold, Brushes.Green, Brushes.Blue, Brushes.Indigo, Brushes.Purple };
        private readonly string[] names = { "빨강", "주황", "노랑", "초록", "파랑", "남색", "보라" };
        private Polyline? current;
        private int strokeCount = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            current = new Polyline
            {
                Stroke = colors[strokeCount % colors.Length],   // 0,1,…,6,0,1,… 로 돌아간다
                StrokeThickness = 6,
                StrokeLineJoin = PenLineJoin.Round,
                Points = new PointCollection { e.GetPosition(board) }
            };
            board.Children.Add(current);
            board.CaptureMouse();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            if (current == null) return;
            PointCollection points = new PointCollection(current.Points);
            points.Add(e.GetPosition(board));
            current.Points = points;
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            current = null;
            strokeCount++;
            lblInfo.Text = $"획 {strokeCount}개 · 다음 색: {names[strokeCount % names.Length]}";
        }
    }
}`;

  /* ---------- p07-2 슬라이드 코드 ---------- */
  const SL_PEN = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07SlidePen.MainWindow"
        ${NS}
        Title="자유 곡선" Width="400" Height="300">
    <Canvas x:Name="board" Background="White"
            MouseLeftButtonDown="Down" MouseMove="Move" MouseLeftButtonUp="Up"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows; using System.Windows.Input; using System.Windows.Media; using System.Windows.Shapes;
namespace P07SlidePen
{
    public partial class MainWindow : Window
    {
        private Polyline? line;                    // 그리는 중인 획
        public MainWindow() { InitializeComponent(); }
        private void Down(object sender, MouseButtonEventArgs e)
        {
            line = new Polyline { Stroke = Brushes.Black, StrokeThickness = 3, Points = new PointCollection { e.GetPosition(board) } };
            board.Children.Add(line);
            board.CaptureMouse();
        }
        private void Move(object sender, MouseEventArgs e)
        {
            if (line == null) return;              // 누르고 있을 때만
            line.Points = new PointCollection(line.Points) { e.GetPosition(board) };
        }
        private void Up(object sender, MouseButtonEventArgs e) { line = null; board.ReleaseMouseCapture(); }
    }
}`;

  /* ======================================================================
   * p07-3 단계 5 · 6
   * ==================================================================== */
  const EX_STEP5 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step5.MainWindow"
        ${NS}
        Title="그림판 — 단계 5. 도형 도구" Width="560" Height="460">
    <DockPanel>
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
            <StackPanel>
${TOOL_ROW(16)}
${PALETTE_ROW(16)}
            </StackPanel>
        </Border>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
${USINGS}

namespace P07Step5
{
    public partial class MainWindow : Window
    {
${FIELDS}

        public MainWindow()
        {
            InitializeComponent();
            UpdateInfo("도구를 고르고 캔버스에서 끌어 보세요.");
        }

${CS_DRAW()}

        // ---------- 실행 취소 · 모두 지우기 ----------
        private void Undo_Click(object sender, RoutedEventArgs e)
        {
            if (history.Count == 0) { UpdateInfo("더 취소할 것이 없습니다."); return; }
            board.Children.Remove(history.Pop());
            UpdateInfo("실행 취소");
        }

${CS_CLEAR()}

${CS_INFO()}
    }
}`;

  const EX_STEP6 = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07Step6.MainWindow"
        ${NS}
        Title="그림판 — 단계 6. 저장 · 불러오기" Width="560" Height="460">
    <DockPanel>
${MENU_XAML}
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
            <StackPanel>
${TOOL_ROW(16)}
${PALETTE_ROW(16)}
            </StackPanel>
        </Border>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
${USINGS}

namespace P07Step6
{
    public partial class MainWindow : Window
    {
        private const string FileFilter = "그림판 파일 (*.pnt)|*.pnt|텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";

${FIELDS}

        public MainWindow()
        {
            InitializeComponent();
            UpdateInfo("그린 뒤 파일 ▸ 저장, 파일 ▸ 열기 로 다시 불러와 보세요.");
        }

${CS_DRAW()}

        private void Undo_Click(object sender, RoutedEventArgs e)
        {
            if (history.Count == 0) { UpdateInfo("더 취소할 것이 없습니다."); return; }
            board.Children.Remove(history.Pop());
            UpdateInfo("실행 취소");
        }

${CS_CLEAR()}

${CS_FILE()}

${CS_INFO()}
    }
}`;

  /* ---------- p07-3 실습: 사각형 · 원 러버밴드 작은 프로그램 ---------- */
  const MINI_BOX = (ns, title, o = {}) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="${title}" Width="500" Height="380">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal" Margin="8,6">
            <RadioButton x:Name="rbRect" Content="사각형" IsChecked="True" GroupName="shape" Margin="0,0,10,0"/>
            <RadioButton Content="원" GroupName="shape" Margin="0,0,16,0"/>
${o.xaml || ''}        </StackPanel>
        <TextBlock x:Name="lblInfo" DockPanel.Dock="Bottom" Margin="8,4" Foreground="Gray" Text="${o.hint || '캔버스에서 끌어 보세요'}"/>
        <Canvas x:Name="board" Background="White" ClipToBounds="True"
                MouseLeftButtonDown="Board_MouseLeftButtonDown" MouseMove="Board_MouseMove"
                MouseLeftButtonUp="Board_MouseLeftButtonUp"/>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace ${ns}
{
    public partial class MainWindow : Window
    {
        private Shape? current;
        private Point start;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Board_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            start = e.GetPosition(board);
            current = rbRect.IsChecked == true ? new Rectangle() : new Ellipse();
            current.Stroke = Brushes.DodgerBlue;
            current.StrokeThickness = 3;
            current.StrokeDashArray = new DoubleCollection { 3, 2 };    // 미리 보기는 점선
${o.create || ''}            Box(current, start);
            board.Children.Add(current);
            board.CaptureMouse();
        }

        private void Board_MouseMove(object sender, MouseEventArgs e)
        {
            if (current != null) Box(current, e.GetPosition(board));
        }

        private void Board_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            if (current == null) return;
            board.ReleaseMouseCapture();
            current.StrokeDashArray = null;                              // 확정 → 실선
            lblInfo.Text = $"{current.Width:F0} × {current.Height:F0} 도형을 그렸습니다. (모두 {board.Children.Count}개)";
            current = null;
        }

        // 누른 곳(start)과 지금 위치(p)를 두 모서리로 하는 상자에 맞추기
        private void Box(Shape shape, Point p)
        {
${o.box || `            Canvas.SetLeft(shape, Math.Min(start.X, p.X));
            Canvas.SetTop(shape, Math.Min(start.Y, p.Y));
            shape.Width = Math.Abs(p.X - start.X);
            shape.Height = Math.Abs(p.Y - start.Y);
`}        }
    }
}`;

  const P5_XAML_EXTRA = `            <CheckBox x:Name="chkFill" Content="안을 채우기" VerticalAlignment="Center"/>
`;
  const P5_STARTER = MINI_BOX('P07Practice5', '채운 도형', {
    xaml: P5_XAML_EXTRA,
    hint: '“안을 채우기” 를 체크하고 끌어 보세요',
    create: `            // TODO: chkFill 이 체크되어 있으면 선 색(DodgerBlue)을 30% 불투명도로 안을 채우기
            //       new SolidColorBrush(색) { Opacity = 0.3 } — Colors.DodgerBlue 는 Color(색 값)
`
  });
  const P5_SOLUTION = MINI_BOX('P07Practice5', '채운 도형', {
    xaml: P5_XAML_EXTRA,
    hint: '“안을 채우기” 를 체크하고 끌어 보세요',
    create: `            if (chkFill.IsChecked == true)
                current.Fill = new SolidColorBrush(Colors.DodgerBlue) { Opacity = 0.3 };   // 비치는 파랑
`
  });

  const P6_HINT = 'Shift 를 누른 채 끌면 정사각형 · 정원';
  const P6_STARTER = MINI_BOX('P07Practice6', 'Shift = 정사각형 · 정원', {
    hint: P6_HINT,
    box: `            double w = Math.Abs(p.X - start.X);
            double h = Math.Abs(p.Y - start.Y);
            // TODO 1: Shift 를 누르고 있으면 (Keyboard.Modifiers) 너비 = 높이 = 둘 중 큰 값
            // TODO 2: 왼쪽 위 — 왼쪽으로 끌었으면 start.X - w, 아니면 start.X (위쪽도 같은 방법)
            //         (지금은 Math.Min 을 써서 정사각형으로 바꾸면 모서리가 어긋난다)
            Canvas.SetLeft(shape, Math.Min(start.X, p.X));
            Canvas.SetTop(shape, Math.Min(start.Y, p.Y));
            shape.Width = w;
            shape.Height = h;
`
  });
  const P6_SOLUTION = MINI_BOX('P07Practice6', 'Shift = 정사각형 · 정원', {
    hint: P6_HINT,
    box: `            double w = Math.Abs(p.X - start.X);
            double h = Math.Abs(p.Y - start.Y);
            if ((Keyboard.Modifiers & ModifierKeys.Shift) != 0)       // Shift 를 누르고 있나?
            {
                w = Math.Max(w, h);
                h = w;
            }
            // 누른 곳에서 끈 방향으로 w · h 만큼 — 왼쪽(위쪽)으로 끌었으면 그만큼 앞에서 시작
            double left = p.X < start.X ? start.X - w : start.X;
            double top = p.Y < start.Y ? start.Y - h : start.Y;
            Canvas.SetLeft(shape, left);
            Canvas.SetTop(shape, top);
            shape.Width = w;
            shape.Height = h;
`
  });

  /* ---------- p07-3 슬라이드 코드 ---------- */
  const SL_RUBBER = `// ===== File: MainWindow.xaml =====
<Window x:Class="P07SlideRubber.MainWindow"
        ${NS}
        Title="러버밴드 사각형" Width="400" Height="300">
    <Canvas x:Name="board" Background="White" MouseLeftButtonDown="Down" MouseMove="Move" MouseLeftButtonUp="Up"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System; using System.Windows; using System.Windows.Controls; using System.Windows.Input; using System.Windows.Media; using System.Windows.Shapes;
namespace P07SlideRubber
{
    public partial class MainWindow : Window
    {
        private Rectangle? box; private Point start;
        public MainWindow() { InitializeComponent(); }
        private void Down(object sender, MouseButtonEventArgs e)
        {
            start = e.GetPosition(board);
            box = new Rectangle { Stroke = Brushes.DodgerBlue, StrokeThickness = 2, StrokeDashArray = new DoubleCollection { 3, 2 } };
            board.Children.Add(box); board.CaptureMouse();
        }
        private void Move(object sender, MouseEventArgs e)
        {
            if (box == null) return; Point p = e.GetPosition(board);
            Canvas.SetLeft(box, Math.Min(start.X, p.X)); Canvas.SetTop(box, Math.Min(start.Y, p.Y));
            box.Width = Math.Abs(p.X - start.X); box.Height = Math.Abs(p.Y - start.Y);
        }
        private void Up(object sender, MouseButtonEventArgs e) { if (box != null) box.StrokeDashArray = null; box = null; board.ReleaseMouseCapture(); }
    }
}`;

  const SL_SAVE = `private List<string> ToLines()
{
    var lines = new List<string> { "# 그림판 v1" };
    foreach (UIElement el in board.Children)
    {
        if (el is not Shape s || s.Stroke is not SolidColorBrush brush) continue;
        string head = $"{brush.Color} {(int)s.StrokeThickness}";
        if (s is Polyline stroke)
            lines.Add($"PEN {head} {string.Join(" ", stroke.Points.Select(Xy))}");
        else if (s is Line line)
            lines.Add($"LINE {head} {Xy(new Point(line.X1, line.Y1))} {Xy(new Point(line.X2, line.Y2))}");
        else …  // RECT · ELLIPSE: 왼쪽 위 · 너비,높이
    }
    return lines;
}`;

  const SL_LOAD = `string[] parts = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
Brush brush = new SolidColorBrush((Color)ColorConverter.ConvertFromString(parts[1]));
double thick = int.Parse(parts[2]);
Shape shape;
switch (parts[0])
{
    case "PEN":  … 점 목록으로 NewStroke …   break;
    case "LINE": … X1 Y1 X2 Y2 …             break;
    case "RECT": case "ELLIPSE": … 상자 …    break;
    default: continue;                        // 모르는 종류는 건너뛴다
}
shape.Stroke = brush; shape.StrokeThickness = thick;
board.Children.Add(shape); history.Push(shape);`;

  /* ======================================================================
   * p07-4 완성 프로그램
   * ==================================================================== */
  const SAMPLE_PICTURE = `        // 처음 보여 줄 예시 그림 — 파일 ▸ 저장 으로 만든 것과 똑같은 형식
        private static readonly string[] SamplePicture =
        {
            "# 그림판 v1 — 예시 그림 (맑은 날의 집)",
            "ELLIPSE #FFFFA500 4 440,24 56,56",
            "LINE #FFFFA500 3 468,6 468,16",
            "LINE #FFFFA500 3 468,88 468,98",
            "LINE #FFFFA500 3 420,52 430,52",
            "LINE #FFFFA500 3 506,52 516,52",
            "ELLIPSE #FF87CEEB 3 60,34 90,34",
            "ELLIPSE #FF87CEEB 3 100,20 80,40",
            "RECT #FF8B4513 3 120,160 150,108",
            "PEN #FFB22222 4 108,162 195,96 282,162 108,162",
            "RECT #FF8B4513 3 178,208 34,60",
            "RECT #FF1E90FF 3 136,182 30,24",
            "RECT #FF1E90FF 3 226,182 30,24",
            "LINE #FF8B4513 8 380,268 380,206",
            "ELLIPSE #FF228B22 4 340,128 80,84",
            "PEN #FF32CD32 3 6,272 36,265 66,273 96,265 126,273 156,265 186,273 216,265 246,273 276,265 306,273 336,265 366,273 396,265 426,273 456,265 486,273 516,265 536,270",
            "PEN #FF6A5ACD 3 452,206 462,196 474,202 472,216 458,220 448,208 454,190 472,182 490,194 490,216 474,232"
        };`;

  const FINAL = (ns, o = {}) => `// ===== File: MainWindow.xaml =====
<Window x:Class="${ns}.MainWindow"
        ${NS}
        Title="그림판" Width="560" Height="460">
    <DockPanel>
${MENU_XAML}
        <Border DockPanel.Dock="Top" Background="#F3F3F3" BorderBrush="#DDDDDD" BorderThickness="0,0,0,1" Padding="6,4">
            <StackPanel>
${TOOL_ROW(16, { undo: 'Command="{x:Static ApplicationCommands.Undo}" ToolTip="실행 취소 (Ctrl+Z)"', tools: o.tools, buttons: o.buttons })}
${PALETTE_ROW(16)}
            </StackPanel>
        </Border>
${STATUS_XAML}
${CANVAS_XAML}
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
${USINGS}

namespace ${ns}
{
    public partial class MainWindow : Window
    {
${o.todo || ''}        private const string FileFilter = "그림판 파일 (*.pnt)|*.pnt|텍스트 파일 (*.txt)|*.txt|모든 파일 (*.*)|*.*";

${FIELDS}
${o.fields || ''}
${SAMPLE_PICTURE}

        public MainWindow()
        {
            InitializeComponent();
            // 실행 취소 = 명령: ↶ 버튼 · Ctrl+Z 가 함께 동작하고, 취소할 것이 없으면 버튼이 저절로 꺼진다
            CommandBindings.Add(new CommandBinding(ApplicationCommands.Undo, Undo_Executed, Undo_CanExecute));
${o.init || ''}
            LoadLines(SamplePicture);
            UpdateInfo("예시 그림입니다. ↶ 취소 · 모두 지우기 뒤에 마음껏 그려 보세요!");
        }

${CS_DRAW({ tiny: true, create: o.create, update: o.update, onCommit: o.onCommit })}

        // ---------- 실행 취소 · 모두 지우기 ----------
        private void Undo_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (history.Count == 0) return;
            UIElement last = history.Pop();                // 가장 나중에 그린 것
            board.Children.Remove(last);
${o.onUndo || ''}            UpdateInfo("실행 취소");
        }

        private void Undo_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = history.Count > 0;
        }

${CS_CLEAR({ onClear: o.onClear })}

${CS_FILE({ save: o.save, load: o.load, onClear: o.onClear })}

${CS_INFO({ names: o.names })}
${o.methods || ''}    }
}`;

  const EX_FINAL = FINAL('P07Final');

  /* ---------- 확장 과제 1. 다시 실행(Redo) ---------- */
  const X1_BUTTON = `                    <Button Content="↷ 다시" Padding="8,2" Margin="4,0,0,0" Command="{x:Static ApplicationCommands.Redo}" ToolTip="다시 실행 (Ctrl+Y)"/>
`;
  const X1_INIT = `            CommandBindings.Add(new CommandBinding(ApplicationCommands.Redo, Redo_Executed, Redo_CanExecute));
`;
  const X1_STARTER = FINAL('P07Ext1', {
    buttons: X1_BUTTON,
    init: X1_INIT,
    todo: `        // 확장 과제 1 — 다시 실행(Redo)
        //  TODO 1: 취소한 도형을 쌓아 둘 두 번째 스택 redo
        //  TODO 2: Undo_Executed — 꺼낸 도형을 redo 에 쌓기
        //  TODO 3: Redo_Executed — redo 에서 꺼내 캔버스와 history 에 되돌리기, CanExecute = redo 에 있을 때
        //  TODO 4: 새로 그리거나(Finish) · 모두 지우거나 · 파일을 열면 redo 비우기

`,
    methods: `
        private void Redo_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            UpdateInfo("다시 실행은 아직 만들지 않았습니다.");
        }

        private void Redo_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = false;
        }
`
  });
  const X1_SOLUTION = FINAL('P07Ext1', {
    buttons: X1_BUTTON,
    init: X1_INIT,
    fields: '        private readonly Stack<UIElement> redo = new Stack<UIElement>();      // 취소한 것 — 다시 실행은 맨 위부터\n',
    onCommit: '            redo.Clear();                                  // 새로 그리면 “다시 실행” 할 것이 사라진다\n',
    onUndo: '            redo.Push(last);                               // 버리지 않고 redo 에 보관\n',
    onClear: '            redo.Clear();\n',
    methods: `
        // ---------- 확장 1: 다시 실행 ----------
        private void Redo_Executed(object sender, ExecutedRoutedEventArgs e)
        {
            if (redo.Count == 0) return;
            UIElement again = redo.Pop();
            board.Children.Add(again);                     // 같은 객체를 다시 넣으면 그대로 다시 보인다
            history.Push(again);
            UpdateInfo("다시 실행");
        }

        private void Redo_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = redo.Count > 0;
        }
`
  });

  /* ---------- 확장 과제 2. 삼각형 도구 ---------- */
  const X2_TOOL = `                    ${RADIO('삼각형', 'tri')}
`;
  const X2_NAME = `            "tri" => "삼각형",
`;
  const X2_STARTER = FINAL('P07Ext2', {
    tools: X2_TOOL,
    names: X2_NAME,
    todo: `        // 확장 과제 2 — 삼각형 도구 (Polygon)
        //  TODO 1: CreateShape — case "tri": 점선 미리 보기 Polygon
        //  TODO 2: UpdateShape — 끄는 상자의 왼쪽 아래 · 위쪽 가운데 · 오른쪽 아래 세 점
        //  TODO 3: ToLines — "TRI 색 굵기 x,y x,y x,y" / LoadLines — case "TRI"

`
  });
  const X2_SOLUTION = FINAL('P07Ext2', {
    tools: X2_TOOL,
    names: X2_NAME,
    create: `                case "tri":
                    return Preview(new Polygon());
`,
    update: `            else if (shape is Polygon tri)
            {
                // 끄는 상자의 왼쪽 아래 · 위쪽 가운데 · 오른쪽 아래 = 이등변삼각형
                double left = Math.Min(start.X, p.X), right = Math.Max(start.X, p.X);
                double top = Math.Min(start.Y, p.Y), bottom = Math.Max(start.Y, p.Y);
                tri.Points = new PointCollection { new Point(left, bottom), new Point((left + right) / 2, top), new Point(right, bottom) };
            }
`,
    save: `                else if (s is Polygon tri)
                    lines.Add($"TRI {head} {string.Join(" ", tri.Points.Select(Xy))}");
`,
    load: `                    case "TRI":
                        PointCollection corners = new PointCollection();
                        for (int i = 3; i < parts.Length; i++) corners.Add(ParseXy(parts[i]));
                        shape = new Polygon { Points = corners };
                        break;
`
  });

  /* ---------- p07-4 슬라이드 · 본문 조각 ---------- */
  const PNG_EXPORT = `// using System.Windows.Media.Imaging;   // RenderTargetBitmap, PngBitmapEncoder
private void ExportPng_Click(object sender, RoutedEventArgs e)
{
    SaveFileDialog dlg = new SaveFileDialog { Filter = "PNG 그림 (*.png)|*.png", DefaultExt = ".png" };
    if (dlg.ShowDialog() != true) return;

    // ① 캔버스를 그림(비트맵)으로 “찍는다” — 크기 · 해상도(96 DPI) · 픽셀 형식
    RenderTargetBitmap bitmap = new RenderTargetBitmap(
        (int)board.ActualWidth, (int)board.ActualHeight, 96, 96, PixelFormats.Pbgra32);
    bitmap.Render(board);

    // ② PNG 형식으로 파일에 쓴다
    PngBitmapEncoder encoder = new PngBitmapEncoder();
    encoder.Frames.Add(BitmapFrame.Create(bitmap));
    using (FileStream fs = File.Create(dlg.FileName))
        encoder.Save(fs);
}`;

  const SL_UNDO_CMD = `// 생성자
CommandBindings.Add(new CommandBinding(ApplicationCommands.Undo,
                                       Undo_Executed, Undo_CanExecute));

private void Undo_Executed(object sender, ExecutedRoutedEventArgs e)
{
    if (history.Count == 0) return;
    board.Children.Remove(history.Pop());
}

private void Undo_CanExecute(object sender, CanExecuteRoutedEventArgs e)
{
    e.CanExecute = history.Count > 0;      // false → ↶ 버튼이 저절로 꺼진다
}

// XAML: <Button Content="↶ 취소" Command="{x:Static ApplicationCommands.Undo}"/>`;

  /* ======================================================================
   * 챕터 등록
   * ==================================================================== */
  CS_COURSE.addChapter({
    id: 'p07',
    no: 'P07',
    title: 'WPF 그림판',
    subtitle: 'Paint — Canvas · Mouse Events · Shapes · Undo · File',
    summary: 'Canvas 위에서 마우스를 누르고(MouseDown) · 움직이고(MouseMove) · 놓는(MouseUp) 세 이벤트로 자유 곡선(Polyline)을 그리는 그림판을 만듭니다. 색 팔레트와 굵기 Slider, 선 · 사각형 · 원 도구와 점선 러버밴드 미리 보기, 지우개 · 모두 지우기, Stack 으로 만드는 실행 취소를 차례로 더하고, 도형마다 한 줄씩 글자로 저장해 다시 불러오는 파일 기능으로 완성합니다.',
    goals: [
      '그림판의 요구사항을 도구 · 도형 · 파일 형식으로 나누어 설계할 수 있다',
      'MouseLeftButtonDown · MouseMove · MouseLeftButtonUp 과 CaptureMouse 로 “끌기” 동작을 구현할 수 있다',
      'Polyline · Line · Rectangle · Ellipse 를 코드로 만들어 Canvas 에 놓고 모양을 바꿀 수 있다',
      '두 점으로 상자를 만드는 좌표 계산(Math.Min · Math.Abs)으로 러버밴드 미리 보기를 만들 수 있다',
      'Stack<UIElement> 로 실행 취소를 구현하고, 명령(ApplicationCommands.Undo)과 연결할 수 있다',
      '도형을 글자 한 줄로 저장하고, Split · switch 로 다시 읽어 그림을 복원할 수 있다'
    ],
    requires: ['ch15', 'ch17', 'ch22'],
    preview: 'assets/shots/p07-final.png',
    previewCode: EX_FINAL,
    sections: [
      /* ===================== p07-1 ===================== */
      {
        id: 'p07-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '그림판의 기능 요구사항을 표로 정리할 수 있다',
          '마우스 세 이벤트가 하나의 “그리기” 를 이루는 흐름을 설명할 수 있다',
          '두 점으로 사각형의 위치 · 크기를 구하고, Stack 으로 실행 취소를 설계할 수 있다',
          '도형 하나를 글자 한 줄로 나타내는 저장 형식을 설계할 수 있다'
        ],
        flow: [['도입 · 완성 프로그램 시연', 5], ['요구사항', 8], ['화면 · 마우스 흐름 · 좌표 설계', 15], ['실행 취소 · 저장 형식 설계', 10], ['준비 예제 · 화면 틀', 7], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '윈도우에 들어 있는 <b>그림판</b>을 작게 만들어 봅니다. 마우스 왼쪽 버튼을 누른 채 움직이면 선이 그려지고, 위쪽의 색 단추와 굵기 막대로 펜을 바꿉니다. 선 · 사각형 · 원 도구로 반듯한 도형을 그릴 때는 끄는 동안 <b>점선 미리 보기</b>(러버밴드, rubber band)가 따라다니다가 마우스를 놓는 순간 확정됩니다. 잘못 그렸으면 <b>↶ 취소</b>로 하나씩 되돌리고, 다 그린 그림은 파일로 저장했다가 다시 열 수 있습니다.' },
          { type: 'p', html: '15장의 <code>Canvas</code>(좌표로 놓는 판), 17장의 <b>마우스 이벤트</b>와 <code>e.GetPosition</code>, 22장의 <b>도형(Shapes)</b>이 주인공입니다. 여기에 10장의 파일 입출력, 7장의 <code>Stack&lt;T&gt;</code>, 21장의 메뉴 · 파일 대화상자 · 명령을 조립합니다.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '설명'], rows: [
            ['F1', '자유 곡선(펜)', '왼쪽 버튼을 누른 채 움직이는 대로 선이 그려진다'],
            ['F2', '색 · 굵기', '팔레트 8색 중 고르기, 굵기 1~20 (Slider), 지금 색 표시'],
            ['F3', '도형 도구', '선 · 사각형 · 원 — 끄는 동안 점선 미리 보기, 놓으면 실선으로 확정'],
            ['F4', '지우개', '배경색(흰색)으로 굵게 덧칠한다'],
            ['F5', '실행 취소', '가장 나중에 그린 것부터 하나씩 되돌린다 (Ctrl+Z)'],
            ['F6', '모두 지우기', '확인한 뒤 캔버스를 비운다'],
            ['F7', '저장 · 열기', '그림을 글자 파일(.pnt)로 저장하고, 다시 열면 같은 그림 (다시 고칠 수도 있음)'],
            ['F8', '상태 표시', '마우스 좌표 · 도구 · 도형 개수 · 방금 한 일']
          ], caption: '기능 요구사항' },
          { type: 'h', text: '3. 화면 설계' },
          { type: 'figure', html: SVG_SCREEN, caption: '그림판 화면 — DockPanel: Menu · 도구 줄 · 색 줄(위) → StatusBar(아래) → Canvas(나머지)' },
          { type: 'p', html: '도구 고르기는 “여럿 중 하나” 이므로 <code>RadioButton</code>(16장)이 알맞습니다. 버튼마다 <code>Tag="rect"</code> 처럼 도구 이름을 적어 두고, <b>처리기 하나</b>(<code>Tool_Click</code>)에서 <code>Tag</code> 를 읽어 지금 도구를 기억합니다. 색 단추 여덟 개도 처리기 하나(<code>Color_Click</code>)를 함께 쓰고, 누른 단추의 <code>Background</code> 가 곧 펜 색이 됩니다(17장의 “sender 로 누가 눌렀는지”).' },
          { type: 'h', text: '4. 마우스 세 이벤트 = 한 번의 그리기' },
          { type: 'p', html: '“끌어서 그리기” 는 이벤트 하나로 끝나지 않습니다. <b>누를 때</b> 새 도형을 만들어 캔버스에 넣고, <b>움직이는 동안</b> 그 도형의 모양을 계속 바꾸고, <b>놓을 때</b> 확정합니다. 세 처리기가 “지금 그리는 도형” 을 함께 써야 하므로 필드 <code>current</code> 에 담아 둡니다. <code>current</code> 가 <code>null</code> 이면 “그리는 중이 아님” 입니다.' },
          { type: 'figure', html: SVG_MOUSE, caption: 'Down(만들기) → Move(모양 바꾸기, 여러 번) → Up(확정) — 상태는 필드 current 로 기억' },
          { type: 'callout', kind: 'info', title: 'CaptureMouse — 마우스를 “붙잡기”', html: '<p>빠르게 끌다 보면 마우스가 캔버스 밖으로 나갈 수 있습니다. 그 상태에서 버튼을 놓으면 캔버스는 <code>MouseUp</code> 을 받지 못해 “영원히 그리는 중” 이 됩니다. 누를 때 <code>board.CaptureMouse()</code> 를 부르면 버튼을 놓을 때까지 마우스가 어디에 있든 이벤트가 캔버스로 옵니다. 놓을 때 <code>ReleaseMouseCapture()</code> 로 풀어 줍니다. (브라우저 실행 창은 캡처를 흉내만 내므로, 완성 프로그램은 <code>MouseMove</code> 에서 버튼이 이미 놓였는지(<code>e.LeftButton</code>)도 확인합니다.)</p>' },
          { type: 'h', text: '5. 두 점으로 상자 만들기' },
          { type: 'p', html: '사각형 · 원은 <code>Canvas.Left</code> · <code>Canvas.Top</code>(왼쪽 위)과 <code>Width</code> · <code>Height</code> 로 정해집니다. 그런데 사용자는 오른쪽 아래로만 끌지 않습니다. 왼쪽 위로 끌면 <code>p.X - start.X</code> 가 음수가 되고, <code>Width</code> 에 음수를 넣으면 WPF 는 예외를 던집니다. 그래서 왼쪽 위는 두 좌표 중 <b>작은 값</b>(<code>Math.Min</code>), 크기는 차이의 <b>절댓값</b>(<code>Math.Abs</code>)으로 구합니다.' },
          { type: 'figure', html: SVG_BOX, caption: '어느 방향으로 끌어도 같은 공식 — 원(Ellipse)도 이 상자 안에 꼭 맞게 그려진다' },
          { type: 'code', title: '준비 예제 1. 두 점으로 상자의 위치와 크기 구하기', code: EX_BOX, expect: '(100,50) → (300,200) : Left 100, Top 50, 200 × 150\n(300,200) → (100,50) : Left 100, Top 50, 200 × 150\n(460,140) → (160,330) : Left 160, Top 140, 300 × 190\n(80,80) → (80,80) : Left 80, Top 80, 0 × 0',
            desc: '첫 두 줄은 같은 두 점을 반대 순서로 끈 경우인데 결과가 똑같습니다. 세 번째는 그림의 예(왼쪽 아래로 끌기)입니다. 마지막은 클릭만 하고 끌지 않은 경우로 크기가 0 — 완성 프로그램은 이런 “보이지 않는 도형” 을 버립니다.' },
          { type: 'h', text: '6. 실행 취소 설계 — Stack' },
          { type: 'p', html: '실행 취소는 “가장 나중에 한 일” 부터 되돌립니다. 7장의 <code>Stack&lt;T&gt;</code>(스택)는 <b>나중에 넣은 것이 먼저 나오는</b>(후입선출, LIFO) 컬렉션이라 딱 맞습니다. 도형을 다 그릴 때마다 <code>history.Push(도형)</code> 으로 쌓고, 취소할 때 <code>history.Pop()</code> 으로 꺼낸 도형을 <code>board.Children.Remove</code> 로 캔버스에서 뺍니다. 도형 객체를 그대로 쌓아 두므로 따로 복사할 필요가 없습니다.' },
          { type: 'figure', html: SVG_STACK, caption: 'Push 로 쌓고 Pop 으로 꺼낸다 — 캔버스의 Children 과 함께 관리' },
          { type: 'code', title: '준비 예제 2. Stack — 쌓고 꺼내며 실행 취소 흉내 내기', code: EX_STACK, expect: '그린 것 3개, 맨 위 = 선\n실행 취소 → \'선\' 지움 (남은 2개)\n실행 취소 → \'사각형\' 지움 (남은 1개)\n남은 순서 (위부터): 원, 자유 곡선\n비었습니다 — 더 취소할 것이 없음',
            desc: '<code>Peek()</code> 은 맨 위를 <b>보기만</b> 하고, <code>Pop()</code> 은 <b>꺼내서</b> 없앱니다. 빈 스택에서 <code>Pop()</code> 을 부르면 <code>InvalidOperationException</code> 이 나므로, 그림판에서는 <code>Count == 0</code> 인지 먼저 확인합니다. <code>foreach</code> · <code>string.Join</code> 으로 스택을 훑으면 <b>맨 위부터</b> 나옵니다.' },
          { type: 'h', text: '7. 저장 형식 설계' },
          { type: 'p', html: '그림을 파일에 저장하는 방법은 크게 둘입니다. ① 화면을 <b>사진(PNG)</b>으로 찍어 저장 — 다른 프로그램에서 볼 수 있지만 다시 열어 도형을 고칠 수는 없습니다. ② 도형마다 <b>종류 · 색 · 굵기 · 좌표</b>를 글자로 저장 — 다시 열면 도형 하나하나가 살아 있어 이어서 그리거나 취소할 수 있습니다. 이 프로젝트는 ②를 직접 설계해서 만들고, ①은 4교시에 Visual Studio 전용 방법으로 소개합니다.' },
          { type: 'figure', html: SVG_FORMAT, caption: '도형 하나 = 공백으로 나눈 글자 한 줄 — 첫 칸(종류)을 보고 나머지 칸을 해석한다' },
          { type: 'table', head: ['결정', '이유'], rows: [
            ['칸은 공백으로, 좌표는 <code>x,y</code>', '<code>Split(\' \')</code> 한 번으로 칸을 나누고, 좌표는 다시 <code>Split(\',\')</code>'],
            ['좌표 · 굵기는 <b>정수</b>', '소수점(<code>12.5</code> / <code>12,5</code>)이 문화권마다 달라지는 문제를 피한다 — 화면 좌표는 1픽셀이면 충분'],
            ['색은 <code>Color.ToString()</code> = <code>#AARRGGBB</code>', '<code>ColorConverter.ConvertFromString</code> 으로 그대로 되돌릴 수 있다'],
            ['첫 줄 <code># 그림판 v1</code>', '<code>#</code> 로 시작하는 줄은 설명 — 나중에 형식이 바뀌면 버전으로 구분']
          ], caption: '저장 형식의 규칙' },
          { type: 'table', head: ['교시', '단계', '결과물'], rows: [
            ['1교시', '단계 1. 화면 틀', '도구 줄 · 색 줄 · 캔버스(XAML 도형) · 상태 표시줄'],
            ['2교시', '단계 2. 자유 곡선', '마우스 세 이벤트 + Polyline'],
            ['2교시', '단계 3. 색과 굵기', '팔레트 · Slider · 지금 색 표시'],
            ['2교시', '단계 4. 지우개 · 실행 취소', 'Stack&lt;UIElement&gt; · 모두 지우기'],
            ['3교시', '단계 5. 도형 도구', '선 · 사각형 · 원 + 러버밴드 미리 보기'],
            ['3교시', '단계 6. 저장 · 불러오기', '글자 형식 + 파일 대화상자'],
            ['4교시', '완성 · 확장', '명령(Ctrl+Z) · 예시 그림 · 다시 실행 · 삼각형']
          ], caption: '구현 계획' },
          { type: 'h', text: '8. 단계 1 — 화면 틀' },
          { type: 'code', title: '단계 1. 화면 틀 — 도구 줄 · 색 줄 · 캔버스 · 상태 표시줄', code: EX_STEP1, desc: '위쪽 두 줄은 <code>Border</code> 안의 <code>StackPanel</code> 두 개입니다. 색 단추는 <code>Background</code> 에 색 이름을 준 22×22 <code>Button</code> 이고, 굵기 글자는 <code>{Binding ElementName=sldThick, Path=Value, StringFormat=…}</code> 로 슬라이더를 따라 바뀝니다(18장). 캔버스에는 XAML 로 도형을 몇 개 놓아 보았습니다: <code>Polyline</code> 은 <code>Points="x,y x,y …"</code>, <code>Line</code> 은 <code>X1 Y1 X2 Y2</code>, <code>Rectangle</code> · <code>Ellipse</code> 는 <code>Canvas.Left</code> · <code>Canvas.Top</code> · <code>Width</code> · <code>Height</code> 로 놓입니다. 다음 단계부터는 똑같은 도형을 <b>코드로</b> 만들어 <code>board.Children.Add</code> 합니다. <code>Canvas</code> 에 <code>Background="White"</code> 를 꼭 주세요 — 배경이 없는(투명이 아니라 “없는”) 패널은 빈 곳에서 마우스 이벤트를 받지 못합니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 준비하기', html: '<ul><li><b>새 프로젝트 ▸ WPF 애플리케이션</b>(.NET 9) 을 <code>MiniPaint</code> 같은 이름으로 만들고, 예제의 네임스페이스 <code>P07Step1</code> 은 프로젝트 이름으로 바꿉니다.</li><li>코드 비하인드에 <code>using System.Windows.Shapes;</code> 와 <code>using System.IO;</code> 를 함께 쓰면 <code>Path</code> 가 두 곳(<code>Shapes.Path</code> 도형 · <code>IO.Path</code> 경로 도구)에 있어 <b>모호한 참조</b> 오류(CS0104)가 납니다. 이 프로젝트는 <code>System.IO.Path.GetFileName</code> 처럼 이름을 다 적어서 피합니다.</li><li>디자이너에서 캔버스 위 도형을 끌어 옮기면 XAML 의 <code>Canvas.Left</code> · <code>Canvas.Top</code> 값이 바뀌는 것을 볼 수 있습니다. 좌표 감각을 익히기 좋습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P7-1. 도형 한 줄 만들기와 읽기',
            level: 1,
            desc: '<p>저장 형식을 콘솔에서 연습합니다.</p><ul><li><code>MakeRect</code>: 색 · 굵기 · 왼쪽 위(x, y) · 크기(w, h)로 <code>RECT #FF1E90FF 2 30,41 100,50</code> 같은 한 줄을 만듭니다. 좌표는 <b>반올림한 정수</b>.</li><li><code>ShowLine</code>: <code>LINE #FFFF0000 3 10,20 200,120</code> 을 나누어 <code>선: (10, 20) → (200, 120)</code> 과 <code>색 #FFFF0000, 굵기 3, 길이 214.7</code> 을 출력합니다(길이는 피타고라스, 소수 한 자리).</li></ul>',
            hint: '반올림: <code>(int)Math.Round(30.4)</code> → 30, <code>(int)Math.Round(40.6)</code> → 41. 나누기: <code>line.Split(\' \')</code> 의 [3] · [4] 를 다시 <code>Split(\',\')</code>. 길이: <code>Math.Sqrt(dx * dx + dy * dy)</code>, 서식 <code>{length:F1}</code>.',
            starter: P1_STARTER,
            solution: P1_SOLUTION,
            expect: 'RECT #FF1E90FF 2 30,41 100,50\n선: (10, 20) → (200, 120)\n색 #FFFF0000, 굵기 3, 길이 214.7'
          },
          {
            title: '실습 P7-2. 점 찍기와 실행 취소',
            level: 1,
            desc: '<p>캔버스를 클릭하면 파란 점이 찍히고, <b>↶ 마지막 점 지우기</b> 로 가장 나중에 찍은 점부터 지워지게 하세요.</p><ul><li>지름 14 의 <code>DodgerBlue</code> 원을 클릭한 곳이 <b>중심</b>이 되게 놓기 → <code>점 n개</code></li><li>찍은 점은 <code>Stack&lt;UIElement&gt;</code> 에도 쌓기</li><li>취소: 점이 없으면 <code>지울 점이 없습니다</code>, 있으면 맨 위 점을 꺼내 캔버스에서 지우기</li></ul>',
            hint: '중심에 놓기: <code>Canvas.SetLeft(dot, p.X - Size / 2)</code> (17장). 취소는 한 줄로 <code>board.Children.Remove(dots.Pop());</code> — Pop 이 꺼낸 점을 바로 Remove 에 넘깁니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION
          }
        ],
        quiz: [
          { q: '사각형 도구로 (300, 200) 을 누르고 (100, 50) 까지 끌었다. 사각형의 <code>Canvas.Left</code> 와 <code>Width</code> 는?', options: ['Left 300, Width -200', 'Left 100, Width 200', 'Left 100, Width -200', 'Left 300, Width 200'], answer: 1, explain: 'Left = Math.Min(300, 100) = 100, Width = Math.Abs(100 - 300) = 200. Width 에 음수를 넣으면 WPF 가 예외를 던집니다.' },
          { q: '마우스 세 이벤트가 “지금 그리는 도형” 을 함께 쓰려면?', options: ['도형을 MouseMove 안의 지역 변수로 만든다', '매번 board.Children 의 첫 번째 요소를 쓴다', '필드(current)에 담아 두고, null 이면 그리는 중이 아닌 것으로 한다', 'Tag 속성에 저장한다'], answer: 2, explain: '지역 변수는 메서드가 끝나면 사라집니다. 세 메서드가 함께 쓰는 상태는 필드로 둡니다.' },
          { q: '<code>Stack&lt;string&gt;</code> 에 "A", "B", "C" 를 차례로 Push 한 뒤 Pop 을 두 번 하면 남는 것은?', options: ['C', 'B', 'A, B', 'A'], answer: 3, explain: '후입선출: 첫 Pop 은 C, 두 번째는 B 를 꺼냅니다. A 만 남습니다.' },
          { q: '<code>&lt;Canvas&gt;</code> 에 <code>Background</code> 를 주지 않았더니 빈 곳을 눌러도 MouseLeftButtonDown 이 오지 않는다. 이유는?', options: ['Canvas 는 원래 마우스 이벤트가 없다', '배경이 없는 영역은 “마우스로 칠 수 있는 곳(히트 테스트)” 이 아니기 때문에', 'ClipToBounds 를 주지 않아서', 'CaptureMouse 를 먼저 불러야 해서'], answer: 1, explain: 'WPF 는 무언가 그려진 곳만 마우스를 받습니다. <code>Background="White"</code>(또는 <code>Transparent</code>)를 주면 빈 곳도 “그려진 곳” 이 됩니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: 'Project 07 · Section 01 — WPF 그림판', badge: 'P07-1',
            notes: '<p><b>[도입 5분]</b> 완성 프로그램(예시 그림이 떠 있는 그림판)을 실행해 보여 줍니다: 펜으로 낙서 → 빨강 · 굵기 10 → 사각형 도구로 끌기(점선 미리 보기!) → ↶ 취소 여러 번 → 파일 ▸ 저장 → 모두 지우기 → 파일 ▸ 열기로 복원.</p><p>발문: “사각형을 끄는 동안 점선이 따라다니는 건 어떻게 만들까?” — 오늘 설계의 핵심 질문입니다.</p>' },
          { layout: 'table', title: '요구사항 (F1 ~ F8)', head: ['번호', '기능', '핵심'], rows: [
            ['F1 · F2', '펜 · 색 · 굵기', 'Polyline, 팔레트, Slider'],
            ['F3', '도형 도구', '선 · 사각형 · 원 + 점선 미리 보기'],
            ['F4 · F6', '지우개 · 모두 지우기', '흰색 덧칠 · 확인 후 비우기'],
            ['F5', '실행 취소', 'Stack, Ctrl+Z'],
            ['F7 · F8', '저장 · 상태 표시', '글자 형식 파일 · 좌표 · 도형 수']
          ], notes: '<p><b>[4분]</b> 학생들에게 “그림판에서 꼭 필요한 기능” 을 먼저 말하게 하고 표와 비교합니다. 채우기 · 선택 · 확대 같은 기능은 확장 아이디어로 남겨 둡니다.</p>' },
          { layout: 'diagram', title: '화면 설계', html: SVG_SCREEN, caption: 'Menu · 도구 줄 · 색 줄 → StatusBar → Canvas',
            notes: '<p><b>[3분]</b> DockPanel 복습(21장). 도구는 RadioButton + Tag, 색은 Button 의 Background — “처리기 하나로 여러 컨트롤” (17장) 패턴이 두 번 나옵니다.</p>' },
          { layout: 'diagram', title: '마우스 세 이벤트 = 한 번의 그리기', html: SVG_MOUSE, caption: 'Down 만들기 → Move 모양 바꾸기 → Up 확정',
            notes: '<p><b>[5분]</b> 손으로 칠판에 선을 그으며 “지금 누름 / 움직임 / 뗌” 을 말해 봅니다. 상태(current)를 필드에 두는 이유 — 퀴즈 2번.</p><p>CaptureMouse: 창 밖으로 끌고 나가 버튼을 떼는 상황을 시연하면 필요성이 바로 이해됩니다.</p>' },
          { layout: 'diagram', title: '두 점으로 상자 만들기', html: SVG_BOX, caption: 'Left = Min, Width = Abs — 어느 방향이든 같은 공식',
            notes: '<p><b>[4분]</b> 네 방향(오른쪽 아래 · 왼쪽 위 · 왼쪽 아래 · 오른쪽 위)을 칠판에 그리고 학생에게 Left · Width 를 계산하게 합니다.</p>' },
          { layout: 'code', title: '준비 예제 1. Min 과 Abs', code: SL_BOX, points: ['왼쪽 위 = 두 좌표의 <b>작은 값</b>', '크기 = 차이의 <b>절댓값</b>', 'Width 가 음수면 WPF 예외', '원(Ellipse)도 같은 상자에 그린다'],
            notes: '<p><b>[2분]</b> 실행 결과 Left 160, Top 140, Width 300, Height 190 — 그림과 같은지 확인.</p>' },
          { layout: 'diagram', title: '실행 취소 = Stack', html: SVG_STACK, caption: 'Push(그리기 끝) · Pop(실행 취소)',
            notes: '<p><b>[3분]</b> 접시 쌓기 비유. 7장 Stack 복습. 도형 “객체” 자체를 쌓으므로 Pop 한 것을 그대로 Children.Remove 에 넘기면 됩니다.</p>' },
          { layout: 'code', title: '준비 예제 2. Push · Pop · Peek', code: SL_STACK, points: ['<code>Push</code> 쌓기', '<code>Pop</code> 꺼내기 (없애기)', '<code>Peek</code> 보기만', '빈 스택 Pop → 예외 → Count 먼저'],
            notes: '<p><b>[2분]</b> 출력 예측을 먼저 시킨 뒤 실행: 선 → 사각형 → 남은 1개, 맨 위 곡선.</p>' },
          { layout: 'diagram', title: '저장 형식 — 도형 하나 = 한 줄', html: SVG_FORMAT, caption: '종류 · 색 · 굵기 · 좌표를 공백으로',
            notes: '<p><b>[4분]</b> PNG 로 저장하면 안 되나? — 다시 열어 고칠 수 없다는 점을 비교합니다. 정수 좌표를 쓰는 이유(문화권 소수점)도 짚어 주세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '(300, 200) 을 누르고 (100, 50) 까지 끌었다. Left 와 Width 는?', options: ['300, -200', '100, 200', '100, -200', '300, 200'], answer: 1, explain: 'Left = Min(300, 100) = 100, Width = Abs(100 - 300) = 200.',
            notes: '<p>음수 Width 를 고른 학생에게 “WPF 는 음수 크기를 받아 주지 않는다” 를 다시 강조합니다.</p>' },
          { layout: 'practice', title: '실습 P7-1 · P7-2', desc: '<p><b>P7-1</b> 저장 형식 한 줄 만들기 · 읽기(콘솔). <b>P7-2</b> 클릭하면 점 찍기 + Stack 으로 마지막 점 지우기(WPF).</p>', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[실습]</b> P7-1 은 <code>(int)30.6</code> 이 30(버림)이라는 실수가 흔합니다 — Math.Round 먼저. P7-2 는 단계 4 실행 취소의 축소판입니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['요구사항 → 화면 → 마우스 흐름 → 좌표 → 취소 · 저장 형식', 'Down · Move · Up + 필드 <code>current</code> + <code>CaptureMouse</code>', '상자 = <code>Math.Min</code> · <code>Math.Abs</code>', '실행 취소 = <code>Stack&lt;UIElement&gt;</code>', '저장 = 도형 하나에 글자 한 줄'],
            notes: '<p>다음 시간: 단계 2 ~ 4 — 자유 곡선, 색과 굵기, 지우개와 실행 취소.</p>' }
        ]
      },

      /* ===================== p07-2 ===================== */
      {
        id: 'p07-2',
        title: '단계별 구현 ① — 자유 곡선 · 색과 굵기 · 실행 취소',
        minutes: 50,
        goals: [
          'MouseLeftButtonDown · MouseMove · MouseLeftButtonUp 으로 Polyline 자유 곡선을 그릴 수 있다',
          '처리기 하나를 공유하는 색 팔레트와 Slider 로 펜의 색 · 굵기를 바꿀 수 있다',
          '지우개와 모두 지우기(확인)를 구현할 수 있다',
          'Stack<UIElement> 로 그린 도형을 하나씩 실행 취소할 수 있다'
        ],
        flow: [['단계 1 복습', 3], ['단계 2 자유 곡선', 15], ['단계 3 색 · 굵기', 10], ['단계 4 지우개 · 실행 취소', 12], ['정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 2 — 자유 곡선' },
          { type: 'p', html: '자유 곡선은 <code>Polyline</code>(점들을 차례로 이은 꺾은선)으로 그립니다. 점이 충분히 촘촘하면 사람 눈에는 부드러운 곡선으로 보입니다. 누를 때 점 하나짜리 <code>Polyline</code> 을 만들어 캔버스에 넣고, 움직일 때마다 지금 위치를 점으로 더하고, 놓으면 <code>current = null</code> 로 “이번 획 끝” 을 표시합니다.' },
          { type: 'code', title: '단계 2. 자유 곡선 — 마우스 세 이벤트와 Polyline', code: EX_STEP2, desc: '<code>e.GetPosition(board)</code> 는 <b>캔버스의 왼쪽 위</b>를 (0, 0) 으로 한 마우스 좌표입니다(17장). <code>MouseMove</code> 는 버튼을 누르지 않고 움직일 때도 오므로 <code>if (current == null) return;</code> 으로 걸러야 합니다 — 좌표 표시만 그 앞에서 합니다. 점을 더할 때 <code>current.Points.Add(p)</code> 대신 “점을 하나 더한 <b>새</b> <code>PointCollection</code>” 을 만들어 바꿔 끼웠습니다. 실제 WPF 는 <code>Add</code> 만으로 다시 그려지지만 브라우저 실행 창은 목록 안의 변화를 알아채지 못하기 때문이며, 이 방법은 두 곳 모두에서 똑같이 동작합니다. <code>StrokeLineJoin="Round"</code> 는 꺾이는 곳을 둥글게 해 빠르게 그어도 뾰족한 모서리가 생기지 않게 합니다.' },
          { type: 'callout', kind: 'tip', title: '점이 드문드문 찍힌다면?', html: '<p>마우스를 빨리 움직이면 <code>MouseMove</code> 가 점과 점 사이를 건너뛰어 발생합니다(이벤트는 “일정 시간마다” 오기 때문). <code>Polyline</code> 은 점 사이를 직선으로 이어 주므로 선이 끊어지지는 않고 살짝 각질 뿐입니다. 반대로 거의 움직이지 않을 때는 같은 자리의 점이 잔뜩 쌓이므로, 완성 프로그램은 앞 점과 2픽셀 이상 떨어졌을 때만 점을 더합니다.</p>' },
          { type: 'h', text: '단계 3 — 색 팔레트와 굵기' },
          { type: 'p', html: '색 단추 여덟 개는 모두 <code>Click="Color_Click"</code> 을 씁니다. 처리기에서 <code>((Button)sender).Background</code> 를 읽으면 “누른 단추의 색” 이므로, 그것을 펜 색 필드 <code>penBrush</code> 에 넣고 지금 색 표시(<code>swatch</code>)도 같은 색으로 칠합니다. 굵기는 <code>Slider</code> 의 <code>Value</code> 를 <b>누르는 순간</b> 읽어 새 획에 넣습니다. 이미 그린 획은 바뀌지 않습니다.' },
          { type: 'code', title: '단계 3. 색 팔레트 · 굵기 Slider · 지금 색 표시', code: EX_STEP3, desc: '<code>IsSnapToTickEnabled="True"</code> · <code>TickFrequency="1"</code> 로 슬라이더가 1, 2, 3 … 정수에만 멈추게 했습니다. 굵기 글자는 코드가 아니라 바인딩(<code>StringFormat=\'굵기 {0:F0}\'</code>)이 자동으로 바꿉니다. 굵은 선은 끝이 뭉툭해 보이므로 <code>StrokeStartLineCap</code> · <code>StrokeEndLineCap</code> 을 <code>Round</code> 로 해 둥근 펜 느낌을 냈습니다. 단추에는 <code>ToolTip</code> 으로 색 이름을 달아 두었는데, 처리기에서 그것을 안내 문구에도 씁니다.' },
          { type: 'callout', kind: 'warn', title: 'ValueChanged 는 InitializeComponent 도중에도 발생한다', html: '<p>굵기 글자를 <code>Slider</code> 의 <code>ValueChanged</code> 처리기에서 <code>lblThick.Text = …</code> 로 바꾸고 싶어질 수 있습니다. 그런데 실제 WPF 에서는 XAML 의 <code>Value="3"</code> 이 적용되는 순간(<code>InitializeComponent</code> 안) 이미 <code>ValueChanged</code> 가 발생하고, 그때는 XAML 에서 <b>슬라이더보다 뒤에 적힌</b> <code>lblThick</code> 이 아직 만들어지지 않아 <code>NullReferenceException</code> 이 납니다. <code>Checked</code>(RadioButton · CheckBox 의 <code>IsChecked="True"</code>)도 마찬가지입니다. 그래서 이 프로젝트는 ① 표시는 <b>바인딩</b>으로, ② 값은 필요할 때(<b>누르는 순간</b>) 읽기, ③ 도구 고르기는 <code>Checked</code> 대신 <code>Click</code> 으로 처리합니다.</p>' },
          { type: 'h', text: '단계 4 — 지우개 · 모두 지우기 · 실행 취소' },
          { type: 'p', html: '지우개는 새 기능이 아니라 <b>배경색으로 칠하는 펜</b>입니다. 흰색으로 4배 굵게 덧칠하면 아래 그림이 가려져 지워진 것처럼 보입니다. 실행 취소는 1교시 설계대로 <code>Stack&lt;UIElement&gt; history</code> 에 다 그린 획을 쌓고, ↶ 를 누르면 <code>Pop()</code> 해서 캔버스에서 뺍니다. 지우개로 칠한 것도 하나의 획이므로 취소하면 “지운 것이 되살아납니다”.' },
          { type: 'code', title: '단계 4. 지우개 · 모두 지우기 · 실행 취소 (Stack)', code: EX_STEP4, desc: '<code>MouseLeftButtonUp</code> 에서 <code>history.Push(current)</code> 로 다 그린 획만 쌓습니다(누르는 중에는 아직 쌓지 않음). <code>Undo_Click</code> 은 스택이 비었는지 먼저 확인한 뒤 <code>Pop</code> 합니다. <b>모두 지우기</b>는 되돌릴 수 없는 동작이라 <code>MessageBox</code> 로 확인하고, 캔버스(<code>board.Children.Clear()</code>)와 스택(<code>history.Clear()</code>)을 <b>함께</b> 비웁니다. 스택만 남겨 두면 이미 캔버스에 없는 도형을 “취소” 하게 됩니다. 색을 고르면 지우개 체크를 풀어 펜으로 돌아오게 했습니다.' },
          { type: 'callout', kind: 'more', title: '📘 진짜로 지우는 지우개', html: '<p>흰색 덧칠 방식은 간단하지만, 배경색을 바꾸거나 도형이 겹친 순서를 바꾸면 흰 자국이 드러납니다. “닿은 도형을 캔버스에서 빼는” 지우개를 만들려면 <code>VisualTreeHelper.HitTest(board, p)</code> 로 마우스 아래의 도형을 찾아 <code>board.Children.Remove</code> 하고, 실행 취소를 위해 “지운 도형” 도 기록해야 합니다(스택에 “무슨 일을 했는지” 를 담는 <b>명령 객체</b> 방식). 확장 아이디어로 도전해 보세요.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 확인해 보기', html: '<ul><li><code>Board_MouseMove</code> 의 <code>PointCollection points = …</code> 줄에 중단점(<kbd>F9</kbd>)을 걸면 마우스를 조금만 움직여도 멈춥니다. 이런 “자주 오는 이벤트” 는 중단점 대신 <code>System.Diagnostics.Debug.WriteLine($"{p}")</code> 로 <b>출력</b> 창에 찍어 보는 편이 편합니다.</li><li>실행 중 <b>라이브 시각적 트리</b>(디버그 ▸ 창)를 열면 <code>board</code> 아래에 그린 <code>Polyline</code> 이 하나씩 늘어나는 것을 볼 수 있습니다. 실행 취소를 누르면 줄어듭니다.</li><li>실제 WPF 에서는 <code>current.Points.Add(p);</code> 한 줄로 바꿔도 똑같이 동작합니다 — 직접 바꿔 비교해 보세요.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P7-3. 펜 미리 보기',
            level: 1,
            desc: '<p>색 단추와 굵기 막대로 “펜 끝” 을 미리 보여 주는 창을 완성하세요.</p><ul><li>미리 보기 원(<code>preview</code>)의 지름이 굵기와 같아지도록 <code>Width</code> · <code>Height</code> 를 슬라이더 값에 <b>바인딩</b>합니다 (코드 없이 XAML 로).</li><li>색 단추를 누르면 원을 그 색으로 칠하고, 아래에 <code>색: #FFDC143C</code> 처럼 색 값을 보여 줍니다.</li></ul>',
            hint: '<code>Width="{Binding ElementName=sldThick, Path=Value}"</code> — Height 도 같게. 색 값: <code>Brush brush = ((Button)sender).Background ?? Brushes.Black;</code> 후 <code>if (brush is SolidColorBrush solid) lblInfo.Text = $"색: {solid.Color}";</code>',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 P7-4. 무지개 펜',
            level: 2,
            desc: '<p>선을 그을 때마다 색이 무지개 순서(빨 · 주 · 노 · 초 · 파 · 남 · 보)로 바뀌는 펜을 만드세요.</p><ul><li>새 획의 색 = <code>colors[지금까지 그은 획 수 % 7]</code> — 일곱 번째 다음은 다시 빨강</li><li>획을 다 그으면 획 수를 1 늘리고 <code>획 3개 · 다음 색: 초록</code> 을 표시</li></ul>',
            hint: '<code>%</code>(나머지)를 쓰면 0, 1, …, 6, 0, 1, … 로 돌아갑니다. 획 수는 <b>놓을 때</b> 늘리므로, 누를 때는 “지금까지 그은 수” 가 곧 이번 획의 번호(0부터)입니다.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: '단계 2 에서 <code>Board_MouseMove</code> 의 <code>if (current == null) return;</code> 을 지우면?', options: ['버튼을 누르지 않고 움직이기만 해도 NullReferenceException 이 난다', '아무 변화 없다', '선이 더 부드러워진다', '컴파일 오류가 난다'], answer: 0, explain: 'MouseMove 는 버튼과 상관없이 옵니다. 그리는 중이 아닐 때 current 는 null 이므로 <code>current.Points</code> 에서 예외가 납니다.' },
          { q: '색 단추 여덟 개가 <code>Color_Click</code> 하나를 함께 쓸 때, 누른 단추의 색을 얻는 방법은?', options: ['<code>this.Background</code>', '<code>((Button)sender).Background</code>', '<code>e.Background</code>', '<code>swatch.Background</code>'], answer: 1, explain: '<code>sender</code> 가 이벤트를 일으킨 컨트롤(누른 단추)입니다. <code>this</code> 는 창입니다.' },
          { q: '굵기를 3 으로 선을 그은 뒤 슬라이더를 10 으로 올렸다. 이미 그린 선은?', options: ['굵기 10 으로 바뀐다', '사라진다', '굵기 3 그대로다 — 굵기는 누르는 순간 새 획에만 들어간다', '굵기 6.5 가 된다'], answer: 2, explain: '<code>StrokeThickness = sldThick.Value</code> 는 그 순간의 값을 복사할 뿐, 슬라이더와 연결(바인딩)된 것이 아닙니다.' },
          { q: '모두 지우기에서 <code>board.Children.Clear()</code> 만 하고 <code>history.Clear()</code> 를 빠뜨렸다. 그 뒤 새로 한 획을 그리고 ↶ 를 두 번 누르면?', options: ['두 번 다 새 획을 지운다', '첫 번째는 새 획을 지우고, 두 번째는 이미 캔버스에 없는 옛 도형을 Remove 해서 아무 변화가 없다', '예외가 발생한다', '지운 그림이 모두 되살아난다'], answer: 1, explain: '스택에는 옛 도형이 남아 있습니다. <code>Children.Remove</code> 는 없는 요소를 지우려 하면 조용히 아무것도 하지 않아 “취소가 안 되는” 이상한 동작이 됩니다. 캔버스와 스택은 함께 관리해야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ① — 자유 곡선 · 색과 굵기 · 실행 취소', subtitle: 'Project 07 · Section 02 — 단계 2 · 3 · 4', badge: 'P07-2',
            notes: '<p><b>[3분]</b> 단계 1 화면 틀과 1교시 마우스 흐름 그림을 다시 띄우고 시작합니다.</p>' },
          { layout: 'code', title: '자유 곡선의 최소 예', code: SL_PEN, points: ['Down: 점 하나짜리 Polyline 을 Add', 'Move: 누르고 있을 때만 점 추가', 'Up: current = null · 캡처 풀기', '새 PointCollection 으로 바꿔 끼우기'],
            notes: '<p><b>[6분]</b> 직접 실행해 그려 봅니다. <code>new PointCollection(line.Points) { 새 점 }</code> — 기존 점을 복사한 새 목록에 점을 하나 더하는 컬렉션 초기화입니다. 실제 WPF 는 <code>line.Points.Add</code> 로 충분하다는 점도 알려 주세요.</p>' },
          { layout: 'bullets', title: '단계 2. 주의할 점', bullets: ['<code>MouseMove</code> 는 버튼을 안 눌러도 온다 → <code>current == null</code> 확인', '<code>e.GetPosition(board)</code> — 캔버스 기준 좌표', '<code>CaptureMouse</code> / <code>ReleaseMouseCapture</code> 짝 맞추기', '<code>StrokeLineJoin = Round</code> — 꺾이는 곳 둥글게', 'Canvas 에 <code>Background</code> 필수'],
            notes: '<p><b>[4분]</b> 일부러 current == null 검사를 지우고 실행해 예외를 보여 줍니다(퀴즈 1번). 좌표 표시가 검사보다 “앞” 에 있어야 누르지 않을 때도 좌표가 보인다는 점도 짚으세요.</p>' },
          { layout: 'two', title: '단계 3. 색과 굵기', left: { title: 'XAML — 처리기 하나', code: '<Button Background="Crimson" Width="22" Height="22"\n        ToolTip="Crimson" Click="Color_Click"/>\n<Slider x:Name="sldThick" Minimum="1" Maximum="20"\n        Value="3" IsSnapToTickEnabled="True"/>', run: false }, right: { title: 'C# — sender 와 누르는 순간의 값', code: 'penBrush = ((Button)sender).Background ?? Brushes.Black;\nswatch.Background = penBrush;\n…\nStroke = penBrush,\nStrokeThickness = sldThick.Value,', run: false },
            notes: '<p><b>[5분]</b> 17장의 “처리기 하나로 여러 컨트롤” 복습. <code>?? Brushes.Black</code> 은 Background 가 비어 있을 때를 대비한 안전장치입니다.</p>' },
          { layout: 'bullets', title: 'InitializeComponent 중의 이벤트 함정', lead: 'XAML 의 초기값도 “값이 바뀐 것” 이다',
            bullets: ['<code>Value="3"</code> → <code>ValueChanged</code> 가 창이 다 만들어지기 전에 발생', '<code>IsChecked="True"</code> → <code>Checked</code> 도 마찬가지', '뒤에 적힌 컨트롤은 아직 <code>null</code> → 예외', ['해결: 표시는 <b>바인딩</b>, 값은 <b>필요할 때 읽기</b>, 도구는 <b>Click</b>']],
            notes: '<p><b>[3분]</b> 실제 WPF 에서만 나는 문제라 브라우저에서는 재현되지 않을 수 있습니다. Visual Studio 에서 ValueChanged 로 바꿔 보면 바로 NullReferenceException 을 볼 수 있습니다.</p>' },
          { layout: 'diagram', title: '단계 4. 실행 취소', html: SVG_STACK, caption: 'Up 에서 Push, ↶ 에서 Pop → Remove',
            notes: '<p><b>[4분]</b> 지우개로 칠한 것도 한 획 → 취소하면 지운 것이 되살아남을 시연합니다. 학생들이 재미있어합니다.</p>' },
          { layout: 'two', title: '지우개 · 모두 지우기', left: { title: '지우개 = 흰색 굵은 펜', code: 'bool eraser = chkEraser.IsChecked == true;\nStroke = eraser ? Brushes.White : penBrush,\nStrokeThickness = eraser ? sldThick.Value * 4\n                         : sldThick.Value,', run: false }, right: { title: '모두 지우기 — 둘 다 비우기', code: 'if (MessageBox.Show("그림을 모두 지울까요?", "모두 지우기",\n        MessageBoxButton.YesNo) != MessageBoxResult.Yes)\n    return;\nboard.Children.Clear();\nhistory.Clear();   // 스택도 함께!', run: false },
            notes: '<p><b>[4분]</b> history.Clear() 를 빠뜨리면 생기는 이상한 동작(퀴즈 4번)을 먼저 예측시키고 시연합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '굵기 3 으로 그은 뒤 슬라이더를 10 으로 올렸다. 이미 그린 선의 굵기는?', options: ['10 으로 바뀐다', '사라진다', '3 그대로', '6.5'], answer: 2, explain: '누르는 순간의 값을 복사했을 뿐 바인딩이 아닙니다.',
            notes: '<p>“이미 그린 선도 바뀌게 하려면?” — 바인딩을 하면 되지만 그림판에서는 원하지 않는 동작이죠. 복사 vs 연결의 차이를 짚습니다.</p>' },
          { layout: 'practice', title: '실습 P7-3 · P7-4', desc: '<p><b>P7-3</b> 펜 미리 보기(원 지름 = 굵기 바인딩, 색 단추로 칠하기). <b>P7-4</b> 무지개 펜(획마다 색 바꾸기, <code>%</code>).</p>', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[실습]</b> P7-3 은 코드 없이 XAML 바인딩만으로 지름이 바뀌는 것이 포인트. P7-4 는 획 수를 언제 늘리는지(놓을 때)와 다음 색 계산에 주의.</p>' },
          { layout: 'summary', title: '정리', bullets: ['Polyline + 세 이벤트 = 자유 곡선', '색: sender 의 Background, 굵기: 누르는 순간의 Slider 값', '초기값 이벤트 함정 → 바인딩 · Click', '지우개 = 흰색 굵은 펜', '실행 취소 = Stack, 캔버스와 함께 비우기'],
            notes: '<p>다음 시간: 선 · 사각형 · 원 도구(러버밴드)와 파일 저장 · 불러오기.</p>' }
        ]
      },

      /* ===================== p07-3 ===================== */
      {
        id: 'p07-3',
        title: '단계별 구현 ② — 도형 도구와 파일 저장',
        minutes: 50,
        goals: [
          'RadioButton 의 Tag 와 switch 로 도구를 나누어 알맞은 도형을 만들 수 있다',
          '점선(StrokeDashArray) 미리 보기로 러버밴드 선 · 사각형 · 원을 그릴 수 있다',
          '캔버스의 도형을 종류별로 글자 한 줄로 저장할 수 있다',
          'Split · switch · ColorConverter 로 파일을 읽어 그림을 복원할 수 있다'
        ],
        flow: [['단계 4 복습', 3], ['단계 5 도구 · 러버밴드', 20], ['단계 6 저장 · 불러오기', 17], ['정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '단계 5 — 선 · 사각형 · 원 도구' },
          { type: 'p', html: '지금까지 세 이벤트는 “Polyline 전용” 이었습니다. 도구가 늘어나면 이벤트마다 <code>if</code> 가 쌓이므로, 할 일을 <b>세 메서드</b>로 나눕니다. <code>CreateShape(p)</code> 는 도구에 맞는 새 도형을 만들고, <code>UpdateShape(shape, p)</code> 는 마우스 위치에 맞춰 모양을 바꾸고, <code>Finish()</code> 는 확정합니다. 이벤트 처리기는 이 셋을 부르기만 합니다. 모든 도형이 <code>Shape</code>(22장)를 상속하므로 필드 <code>current</code> 의 형식을 <code>Shape?</code> 로 바꾸면 곡선 · 선 · 사각형 · 원을 한 변수에 담을 수 있습니다.' },
          { type: 'table', head: ['도구 (Tag)', 'CreateShape', 'UpdateShape (마우스가 p 에 있을 때)'], rows: [
            ['<code>pen</code>', '<code>Polyline</code> (점 하나)', '점 추가'],
            ['<code>eraser</code>', '흰색 · 4배 굵기 <code>Polyline</code>', '점 추가'],
            ['<code>line</code>', '<code>Line</code> — 시작 = 끝 = 누른 곳 (점선)', '<code>X2</code> · <code>Y2</code> = p'],
            ['<code>rect</code>', '<code>Rectangle</code> (점선)', '<code>Math.Min</code> · <code>Math.Abs</code> 상자'],
            ['<code>ellipse</code>', '<code>Ellipse</code> (점선)', '같은 상자 — 원은 상자 안에 꼭 맞게']
          ], caption: '도구마다 다른 것은 “만들기” 와 “모양 맞추기” 뿐' },
          { type: 'p', html: '<b>러버밴드</b>는 끄는 동안 도형을 점선으로 보여 주는 것입니다. <code>StrokeDashArray = new DoubleCollection { 3, 2 }</code> 는 “선 3 · 빈칸 2(굵기의 배수)” 를 되풀이하는 점선이고, 마우스를 놓을 때 <code>StrokeDashArray = null</code> 로 실선이 됩니다. 미리 보기 도형을 따로 두지 않고 <b>그 도형 자체</b>를 점선으로 그렸다가 바꾸는 것이 요령입니다.' },
          { type: 'code', title: '단계 5. 도형 도구 — 선 · 사각형 · 원 + 러버밴드 미리 보기', code: EX_STEP5, desc: '<code>Tool_Click</code> 은 누른 라디오 단추의 <code>Tag</code>(<code>"rect"</code> 등)를 <code>tool</code> 에 담기만 합니다. <code>CreateShape</code> 의 <code>switch</code> 가 도구마다 도형을 만들고, 선 · 사각형 · 원은 <code>Preview</code> 가 색 · 굵기 · 점선을 입힌 뒤 <code>UpdateShape(s, start)</code> 로 크기 0 에서 시작합니다. <code>UpdateShape</code> 는 <code>is</code> 패턴으로 도형의 실제 형식을 확인합니다 — <code>Polyline</code> 이면 점 추가, <code>Line</code> 이면 끝점, 나머지(사각형 · 원)는 1교시의 상자 공식입니다. <code>MouseMove</code> 에서 <code>e.LeftButton</code> 이 이미 놓였으면 <code>Finish()</code> 하는 것은, 캔버스 밖에서 버튼을 놓쳐 <code>MouseUp</code> 을 받지 못한 경우를 위한 안전장치입니다. 실행 취소 · 모두 지우기는 단계 4 와 같습니다 — 도형도 <code>UIElement</code> 이므로 스택은 바꿀 필요가 없습니다.' },
          { type: 'callout', kind: 'tip', title: 'switch 와 is 패턴 — 두 가지 “나누기”', html: '<ul><li><b>만들 때</b>는 아직 도형이 없으므로 <b>도구 이름(문자열)</b>으로 나눕니다: <code>switch (tool) { case "rect": … }</code></li><li><b>모양을 바꿀 때</b>는 이미 도형이 있으므로 <b>도형의 형식</b>으로 나눕니다: <code>if (shape is Line line) { line.X2 = … }</code> — 조건이 맞으면 <code>line</code> 이라는 이름으로 <code>Line</code> 전용 속성을 바로 쓸 수 있습니다(9장 패턴 매칭).</li><li>새 도구를 더할 때 고칠 곳은 이 두 곳뿐입니다 — 4교시 삼각형 과제에서 확인!</li></ul>' },
          { type: 'figure', html: SVG_BOX, caption: '사각형 · 원의 러버밴드: 누른 곳(start)과 지금 위치(p)로 상자를 다시 계산' },
          { type: 'h', text: '단계 6 — 저장 · 불러오기' },
          { type: 'p', html: '1교시에 설계한 형식을 구현합니다. <b>저장</b>(<code>ToLines</code>)은 <code>board.Children</code> 을 훑으며 도형 형식마다 한 줄을 만들고, <code>File.WriteAllLines</code> 로 씁니다. <b>불러오기</b>(<code>LoadLines</code>)는 캔버스와 스택을 비운 뒤, 줄마다 <code>Split(\' \')</code> 로 칸을 나누어 첫 칸(<code>PEN</code> · <code>LINE</code> · <code>RECT</code> · <code>ELLIPSE</code>)을 <code>switch</code> 해 도형을 만듭니다. 읽은 도형도 스택에 쌓으므로 불러온 그림도 한 획씩 취소할 수 있습니다.' },
          { type: 'figure', html: SVG_FORMAT, caption: '저장: 도형 → 한 줄 · 읽기: 한 줄 → Split → switch → 도형' },
          { type: 'code', title: '단계 6. 글자 형식으로 저장 · 불러오기 + 파일 대화상자', code: EX_STEP6, desc: '<code>el is not Shape s || s.Stroke is not SolidColorBrush brush</code> 는 “도형이 아니거나 단색 선이 아니면 건너뛰기” 입니다(C# 9 의 <code>is not</code> 패턴). 색은 <code>{brush.Color}</code> 가 <code>#FF1E90FF</code> 모양으로 적히고, 읽을 때 <code>ColorConverter.ConvertFromString</code> 이 그 글자를 다시 <code>Color</code> 로 바꿉니다. 자유 곡선의 점 목록은 LINQ <code>stroke.Points.Select(Xy)</code> 로 점마다 <code>"x,y"</code> 를 만든 뒤 <code>string.Join(" ", …)</code> 으로 이었습니다. 읽는 쪽의 <code>default: continue;</code> 는 모르는 종류의 줄을 건너뛰어, 나중에 도형 종류가 늘어난 파일을 옛 프로그램으로 열어도 멈추지 않게 합니다. 숫자가 아닌 글자 · 칸 부족 같은 형식 오류는 <code>Open_Click</code> 의 <code>try</code> / <code>catch</code> 가 오류 창으로 알려 줍니다.' },
          { type: 'callout', kind: 'warn', title: 'Path 는 누구의 Path?', html: '<p><code>using System.IO;</code> 와 <code>using System.Windows.Shapes;</code> 를 함께 쓰면 <code>Path</code> 라는 이름이 두 곳에 있습니다: 파일 경로 도구 <code>System.IO.Path</code> 와 도형 <code>System.Windows.Shapes.Path</code>. 그냥 <code>Path.GetFileName(…)</code> 이라고 쓰면 컴파일러가 어느 쪽인지 몰라 <b>CS0104 모호한 참조</b> 오류를 냅니다. 예제처럼 <code>System.IO.Path.GetFileName</code> 으로 이름을 다 적거나, 파일 맨 위에 <code>using IOPath = System.IO.Path;</code> 같은 별칭을 만드세요.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 저장 파일 살펴보기', html: '<ul><li>그림을 저장한 <code>.pnt</code> 파일을 Visual Studio 로 열면(<b>파일 ▸ 열기 ▸ 파일</b>) 도형마다 한 줄씩 적힌 것을 볼 수 있습니다. 한 줄의 색을 <code>#FFDC143C</code> 로 고쳐 저장한 뒤 그림판에서 열어 보세요 — 그 도형만 빨갛게 바뀝니다.</li><li>한 줄의 좌표를 <code>abc</code> 로 망가뜨리고 열면 <code>catch</code> 의 오류 창이 뜹니다. <b>예외 설정</b> 창(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd>)에서 <code>FormatException</code> 을 체크하면 예외가 던져지는 줄에서 바로 멈춰 원인을 확인할 수 있습니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P7-5. 안을 채운 도형',
            level: 2,
            desc: '<p>사각형 · 원을 끌어 그리는 작은 프로그램에 <b>안을 채우기</b> 체크 상자가 있습니다. 체크되어 있으면 도형의 안을 선 색(<code>DodgerBlue</code>)으로 <b>30% 불투명하게</b>(비치게) 채우세요.</p>',
            hint: '<code>Shape</code> 의 <code>Fill</code> 이 안쪽 색입니다. <code>new SolidColorBrush(Colors.DodgerBlue) { Opacity = 0.3 }</code> — <code>Colors.DodgerBlue</code> 는 브러시가 아니라 색 값(<code>Color</code>)입니다. 체크 여부는 <code>chkFill.IsChecked == true</code> (<code>bool?</code> 이라 == true 로 비교).',
            starter: P5_STARTER,
            solution: P5_SOLUTION
          },
          {
            title: '실습 P7-6. Shift 를 누르면 정사각형 · 정원',
            level: 3,
            desc: '<p>그림판처럼 <kbd>Shift</kbd> 를 누른 채 끌면 정사각형 · 정원이 되게 하세요.</p><ul><li>Shift 를 누르고 있으면 너비 = 높이 = 둘 중 <b>큰 값</b></li><li>왼쪽 위 모서리: 왼쪽으로 끌었으면 <code>start.X - w</code>, 오른쪽이면 <code>start.X</code> (위쪽도 같은 방법) — <code>Math.Min</code> 을 그대로 쓰면 정사각형으로 늘린 쪽의 모서리가 어긋납니다.</li></ul>',
            hint: 'Shift 확인: <code>(Keyboard.Modifiers &amp; ModifierKeys.Shift) != 0</code> (<code>&amp;</code> 는 비트 AND — 여러 키 중 Shift 가 들어 있나). 방향: <code>double left = p.X &lt; start.X ? start.X - w : start.X;</code>',
            starter: P6_STARTER,
            solution: P6_SOLUTION
          }
        ],
        quiz: [
          { q: '<code>StrokeDashArray = new DoubleCollection { 3, 2 }</code> 인 도형을 실선으로 바꾸려면?', options: ['<code>StrokeDashArray = null;</code>', '<code>StrokeThickness = 0;</code>', '<code>Stroke = null;</code>', '<code>StrokeDashArray = new DoubleCollection { 0 };</code>'], answer: 0, explain: '점선 모양을 없애면(null) 기본값인 실선이 됩니다. Stroke 를 null 로 하면 선 자체가 사라집니다.' },
          { q: '<code>if (shape is Line line) { line.X2 = p.X; }</code> 에서 <code>line</code> 은?', options: ['새로 만든 Line 객체', 'shape 가 Line 일 때, 같은 객체를 Line 형식으로 가리키는 변수', 'shape 의 복사본', 'XAML 의 x:Name'], answer: 1, explain: '패턴 매칭: 형식이 맞으면 그 객체를 새 이름(그 형식)으로 쓸 수 있게 해 줍니다. 복사가 아니라 같은 객체입니다.' },
          { q: '저장 파일의 한 줄 <code>RECT #FF1E90FF 2 100,90 160,110</code> 을 <code>Split(\' \')</code> 하면 <code>parts[3]</code> 은?', options: ['"2"', '"160,110"', '"100,90"', '"#FF1E90FF"'], answer: 2, explain: '[0] RECT, [1] 색, [2] 굵기, [3] 왼쪽 위 "100,90", [4] 크기 "160,110".' },
          { q: '<code>using System.IO;</code> 와 <code>using System.Windows.Shapes;</code> 를 함께 쓰고 <code>Path.GetFileName(f)</code> 라고 쓰면?', options: ['잘 동작한다', 'Shapes.Path 가 불린다', '실행할 때 예외가 난다', 'CS0104 모호한 참조 컴파일 오류'], answer: 3, explain: '두 네임스페이스에 Path 가 모두 있어 컴파일러가 고를 수 없습니다. <code>System.IO.Path.GetFileName</code> 으로 이름을 다 적습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ② — 도형 도구와 파일 저장', subtitle: 'Project 07 · Section 03 — 단계 5 · 6', badge: 'P07-3',
            notes: '<p><b>[3분]</b> 단계 4 를 실행해 복습. “사각형 도구를 추가하려면 세 이벤트를 어떻게 바꿔야 할까?” 를 묻고 시작합니다.</p>' },
          { layout: 'table', title: '도구마다 다른 것', head: ['도구', '만들기', '모양 맞추기'], rows: [
            ['펜 · 지우개', 'Polyline', '점 추가'],
            ['선', 'Line (시작 = 끝)', 'X2 · Y2'],
            ['사각형 · 원', 'Rectangle · Ellipse', 'Min · Abs 상자']
          ], notes: '<p><b>[3분]</b> “다른 것만 따로, 같은 것은 한곳에” — CreateShape · UpdateShape · Finish 로 나누는 이유입니다. 세 이벤트 처리기는 거의 바뀌지 않습니다.</p>' },
          { layout: 'code', title: '러버밴드의 최소 예', code: SL_RUBBER, points: ['Down: 점선 Rectangle 을 Add', 'Move: Min · Abs 로 상자 다시 계산', 'Up: <code>StrokeDashArray = null</code> → 실선', '미리 보기 = 그 도형 자체'],
            notes: '<p><b>[6분]</b> 실행해서 네 방향으로 끌어 봅니다. 미리 보기 도형을 따로 두지 않는다는 점이 요령입니다.</p>' },
          { layout: 'two', title: '단계 5. 만들기와 모양 맞추기', left: { title: 'CreateShape — 도구 이름으로', code: 'switch (tool)\n{\n    case "pen":  return NewStroke(penBrush, thick, p);\n    case "line": return Preview(new Line { X1 = p.X, … });\n    case "rect": return Preview(new Rectangle());\n    case "ellipse": return Preview(new Ellipse());\n    default: return null;\n}', run: false }, right: { title: 'UpdateShape — 도형 형식으로', code: 'if (shape is Polyline stroke) AddPoint(stroke, p);\nelse if (shape is Line line) { line.X2 = p.X; line.Y2 = p.Y; }\nelse   // Rectangle · Ellipse\n{\n    Canvas.SetLeft(shape, Math.Min(start.X, p.X));\n    …\n}', run: false },
            notes: '<p><b>[6분]</b> 본문 단계 5 를 실행하며 코드를 따라갑니다. switch(문자열) vs is(형식) — 두 가지 나누기를 비교하세요.</p>' },
          { layout: 'bullets', title: '단계 5. 안전장치', bullets: ['MouseDown: <code>current != null</code> 이면 먼저 <code>Finish()</code>', 'MouseMove: <code>e.LeftButton</code> 이 놓였으면 <code>Finish()</code>', ['캔버스 밖에서 버튼을 놓쳐 MouseUp 이 안 온 경우'], '도형도 <code>UIElement</code> → 실행 취소 스택은 그대로'],
            notes: '<p><b>[2분]</b> 사용자는 예상 밖의 행동을 합니다. 빠르게 창 밖으로 끌고 나가 떼는 시연을 해 보세요.</p>' },
          { layout: 'diagram', title: '단계 6. 저장 형식', html: SVG_FORMAT, caption: '도형 → 한 줄 · 한 줄 → 도형',
            notes: '<p><b>[3분]</b> 1교시 설계 복습. 첫 칸이 “종류” 라서 읽는 쪽이 switch 로 나눌 수 있습니다.</p>' },
          { layout: 'code', title: '저장 — ToLines', code: SL_SAVE, run: false, points: ['<code>is not</code> — 도형 · 단색이 아니면 건너뛰기', '색: <code>{brush.Color}</code> → <code>#AARRGGBB</code>', '점 목록: <code>Select(Xy)</code> + <code>Join</code>', '<code>File.WriteAllLines</code> 로 한 번에'],
            notes: '<p><b>[4분]</b> <code>Select(Xy)</code> 는 메서드 이름을 그대로 넘기는 방법(메서드 그룹) — <code>Select(p =&gt; Xy(p))</code> 와 같습니다.</p>' },
          { layout: 'code', title: '읽기 — LoadLines', code: SL_LOAD, run: false, points: ['<code>Split(\' \', RemoveEmptyEntries)</code>', '<code>ColorConverter.ConvertFromString</code>', '첫 칸으로 <code>switch</code>', '읽은 도형도 스택에 → 취소 가능'],
            notes: '<p><b>[4분]</b> 본문 단계 6 을 실행: 그리기 → 저장 → 모두 지우기 → 열기. 파일 형식 오류는 Open_Click 의 try/catch 가 처리합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>RECT #FF1E90FF 2 100,90 160,110</code> 을 Split(\' \') 했을 때 parts[3] 은?', options: ['"2"', '"160,110"', '"100,90"', '"#FF1E90FF"'], answer: 2, explain: '[0] 종류 [1] 색 [2] 굵기 [3] 왼쪽 위 [4] 크기.',
            notes: '<p>0 부터 센다는 것을 다시 확인합니다.</p>' },
          { layout: 'practice', title: '실습 P7-5 · P7-6', desc: '<p><b>P7-5</b> “안을 채우기” 체크 → 30% 불투명 Fill. <b>P7-6</b> Shift 를 누르면 정사각형 · 정원 (끈 방향 고려).</p>', starter: P5_STARTER, solution: P5_SOLUTION,
            notes: '<p><b>[실습]</b> P7-5 는 Colors(색) 와 Brushes(브러시)의 차이가 포인트. P7-6 은 Math.Min 을 그대로 쓰면 왼쪽 위로 끌 때 모서리가 어긋나는 것을 직접 보게 한 뒤 고치게 합니다.</p>' },
          { layout: 'summary', title: '정리', bullets: ['CreateShape · UpdateShape · Finish 로 나누기', '러버밴드 = 점선 → <code>StrokeDashArray = null</code>', 'switch(도구 이름) · is(도형 형식)', '저장: 도형마다 한 줄, 읽기: Split → switch', '<code>System.IO.Path</code> 는 이름을 다 적는다'],
            notes: '<p>다음 시간: 명령으로 Ctrl+Z, 예시 그림, 그리고 확장 과제(다시 실행 · 삼각형).</p>' }
        ]
      },

      /* ===================== p07-4 ===================== */
      {
        id: 'p07-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          'ApplicationCommands.Undo 와 CanExecute 로 실행 취소 버튼 · Ctrl+Z 를 연결할 수 있다',
          '완성 프로그램의 구조(그리기 · 취소 · 파일 · 표시)를 설명할 수 있다',
          '그림을 PNG 로 내보내는 방법(RenderTargetBitmap)을 설명할 수 있다',
          '다시 실행 · 삼각형 도구 중 하나 이상을 기존 구조의 정해진 자리에 추가할 수 있다'
        ],
        flow: [['완성 프로그램 구조', 10], ['실행 · 점검', 8], ['개선 아이디어 · PNG', 7], ['확장 과제', 20], ['발표 · 정리', 5]],
        content: [
          { type: 'h', text: '1. 완성 프로그램' },
          { type: 'p', html: '단계 6 에 세 가지를 더해 완성합니다. ① 실행 취소를 21장의 <b>명령</b>(<code>ApplicationCommands.Undo</code>)으로 바꿉니다. ↶ 버튼에 <code>Command</code> 를 주고 <code>CommandBinding</code> 을 등록하면 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 가 저절로 동작하고, <code>CanExecute</code> 가 <code>history.Count &gt; 0</code> 을 돌려주므로 취소할 것이 없을 때 버튼이 <b>저절로 꺼집니다</b>. ② 클릭만 하고 끌지 않은 “크기 0” 도형은 <code>IsTooSmall</code> 로 버립니다(보이지 않는 도형이 취소 목록을 차지하지 않게). ③ 시작할 때 <b>예시 그림</b>을 보여 줍니다 — 그림을 저장 형식의 글자 배열(<code>SamplePicture</code>)로 적어 두고 <code>LoadLines</code> 로 읽기만 하면 되므로, 코드 몇 줄 없이 그림을 그릴 수 있습니다.' },
          { type: 'table', head: ['부분', '메서드', '하는 일'], rows: [
            ['그리기', '<code>Board_Mouse…</code> 세 개 · <code>CreateShape</code> · <code>Preview</code> · <code>UpdateShape</code> · <code>AddPoint</code> · <code>Finish</code>', '도구에 맞는 도형 만들기 · 끄는 동안 모양 맞추기 · 확정'],
            ['도구 · 색', '<code>Tool_Click</code> · <code>Color_Click</code>', 'Tag · Background 읽기'],
            ['취소 · 지우기', '<code>Undo_Executed</code> · <code>Undo_CanExecute</code> · <code>Clear_Click</code>', 'Stack 과 캔버스를 함께 관리'],
            ['파일', '<code>ToLines</code> · <code>LoadLines</code> · <code>Xy</code> · <code>ParseXy</code> · <code>Save_Click</code> · <code>Open_Click</code>', '도형 ⇄ 글자 줄'],
            ['표시', '<code>UpdateInfo</code> · <code>ToolName</code>', '상태 표시줄 안내']
          ], caption: '완성 프로그램의 구성 (MainWindow.xaml.cs 약 300줄)' },
          { type: 'code', title: '완성 프로그램. WPF 그림판', code: EX_FINAL, desc: '생성자는 명령을 등록하고 <code>LoadLines(SamplePicture)</code> 로 예시 그림을 그린 것이 전부입니다. 예시 그림의 해 · 구름 · 집 · 나무는 <code>ELLIPSE</code> · <code>RECT</code> · <code>LINE</code>, 지붕 · 풀밭 · 오른쪽 아래 낙서는 점 목록 <code>PEN</code> 입니다 — 파일 ▸ 저장 으로 만든 파일과 같은 형식이라, 반대로 내가 그린 그림을 저장한 파일의 내용을 이 배열에 붙여 넣으면 시작 그림이 바뀝니다. 예시 그림도 스택에 들어 있으므로 ↶ 를 누르면 나중에 그린 것(낙서)부터 하나씩 사라집니다. 명령의 <code>CanExecute</code> 는 WPF 가 입력이 있을 때마다 다시 물어보므로, 그리거나 취소한 직후 ↶ 버튼이 켜지고 꺼지는 것을 직접 관리하지 않아도 됩니다.' },
          { type: 'callout', kind: 'tip', title: '최종 점검 체크리스트', html: '<ul><li>☐ F1 빠르게 그어도 선이 끊기지 않고, 캔버스 밖으로 끌고 나가 떼도 “그리는 중” 이 남지 않는다</li><li>☐ F2 색 · 굵기를 바꾸면 <b>다음</b> 획부터 적용, 지금 색 표시가 바뀐다</li><li>☐ F3 네 방향으로 끌어도 사각형 · 원이 제대로, 놓으면 점선 → 실선</li><li>☐ F4 지우개로 칠한 뒤 ↶ → 지운 부분이 되살아난다</li><li>☐ F5 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 로 취소, 다 취소하면 ↶ 버튼이 꺼진다</li><li>☐ F6 모두 지우기는 [예] 일 때만</li><li>☐ F7 저장 → 모두 지우기 → 열기 = 같은 그림, 망가진 파일은 오류 창</li><li>☐ 클릭만 한 사각형은 남지 않는다</li></ul>' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서', html: '<ul><li><kbd>Ctrl</kbd>+<kbd>Z</kbd> 는 실행 창을 한 번 클릭해 포커스를 준 뒤 누르세요.</li><li><code>CaptureMouse</code> 덕분에 그리는 도중 캔버스 밖으로 나가도 이동 · 놓기 이벤트가 캔버스로 옵니다. 그래도 창 밖에서 버튼을 떼는 경우를 대비해 <code>e.LeftButton</code> 검사를 함께 둡니다.</li></ul>' },
          { type: 'h', text: '2. 더 좋게 만들려면?' },
          { type: 'p', html: '저장 형식은 “다시 고칠 수 있는” 그림이지만, 친구에게 보내거나 문서에 붙이려면 <b>PNG 그림 파일</b>이 필요합니다. WPF 의 <code>RenderTargetBitmap</code> 은 화면의 요소를 그대로 비트맵(픽셀 그림)으로 “찍어” 주고, <code>PngBitmapEncoder</code> 가 그것을 PNG 파일로 씁니다. 브라우저 실행 환경에는 이 기능이 없어 아래 상자의 코드는 Visual Studio 에서만 시험할 수 있습니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 PNG 로 내보내기 (실제 WPF 전용)', html: '<p>파일 메뉴에 <code>&lt;MenuItem Header="PNG 로 내보내기..." Click="ExportPng_Click"/&gt;</code> 를 더하고, 코드 비하인드 맨 위에 <code>using System.Windows.Media.Imaging;</code> 을 쓴 뒤 아래 메서드를 클래스 안에 붙여 넣습니다.</p><pre><code>' + esc(PNG_EXPORT) + '</code></pre><ul><li><code>ActualWidth</code> · <code>ActualHeight</code> 는 화면에 실제로 그려진 캔버스의 크기입니다. 96 DPI 는 윈도우의 기본 해상도로, 192 로 주고 크기도 두 배로 하면 더 선명한 그림이 됩니다.</li><li>캔버스의 <code>Background="White"</code> 덕분에 PNG 의 배경도 흰색입니다. 배경을 지우면 투명한 PNG 가 됩니다.</li><li>캔버스가 창 안에서 여백(<code>Margin</code>)을 가지면 찍힌 그림이 어긋날 수 있습니다. 그럴 때는 캔버스를 <code>Border</code> 로 감싸고 Border 를 찍으세요.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 JSON 형식으로 저장하기', html: '<p>P06 처럼 <code>System.Text.Json</code> 을 써도 됩니다. <code>class ShapeData { public string Kind { get; set; } public string Color { get; set; } public int Thickness { get; set; } public List&lt;int&gt; Numbers { get; set; } }</code> 같은 “저장용 클래스” 를 만들어 도형 ⇄ ShapeData 로 바꾸면, <code>JsonSerializer.Serialize(List&lt;ShapeData&gt;)</code> 한 줄로 저장됩니다. 도형 객체(Polyline 등)를 바로 직렬화하지 않는 이유는, WPF 요소에는 저장하면 안 되는 속성(부모 · 스타일 · 이벤트)이 잔뜩 있기 때문입니다.</p>' },
          { type: 'callout', kind: 'more', title: '📘 명령 패턴으로 모든 동작 취소하기', html: '<p>지금의 스택은 “그린 도형” 만 기억해서 <b>모두 지우기</b>는 취소할 수 없습니다. 스택에 도형 대신 “한 일” 객체(<code>interface IAction { void Undo(); void Redo(); }</code>)를 쌓으면 — 그리기(AddAction), 지우기(ClearAction: 지운 도형 목록을 기억), 색 바꾸기 … — 어떤 동작이든 취소 · 다시 실행할 수 있습니다. 이것을 <b>명령 패턴(Command pattern)</b>이라고 하며, 실제 그림판 · 워드 프로세서의 실행 취소가 이렇게 만들어집니다.</p>' },
          { type: 'h', text: '3. 확장 과제' },
          { type: 'list', items: [
            '<b>과제 1 (응용)</b> 다시 실행(Redo) — 취소한 도형을 두 번째 스택에 보관했다가 ↷ · <kbd>Ctrl</kbd>+<kbd>Y</kbd> 로 되돌리기',
            '<b>과제 2 (도전)</b> 삼각형 도구 — <code>Polygon</code> 으로 이등변삼각형 러버밴드 + 저장 · 불러오기(<code>TRI</code>)'
          ] },
          { type: 'p', html: '두 과제 모두 고칠 곳이 정해져 있습니다. 다시 실행은 <b>스택을 다루는 네 곳</b>(취소 · 확정 · 모두 지우기 · 불러오기)에 한 줄씩, 삼각형은 <b>도구가 늘 때 고치는 곳</b>(도구 단추 · <code>CreateShape</code> · <code>UpdateShape</code> · <code>ToLines</code> · <code>LoadLines</code> · <code>ToolName</code>)에 한 조각씩입니다. 세 이벤트 처리기와 실행 취소 · 파일 대화상자 코드는 전혀 고치지 않습니다.' }
        ],
        practice: [
          {
            title: '확장 과제 1. 다시 실행(Redo)',
            level: 2,
            desc: '<p>완성 프로그램에 <b>↷ 다시</b> 를 완성하세요. (버튼과 명령 등록, 빈 처리기는 뼈대에 있습니다.)</p><ul><li>취소한 도형을 버리지 말고 두 번째 스택 <code>redo</code> 에 쌓기</li><li>↷ · <kbd>Ctrl</kbd>+<kbd>Y</kbd>: <code>redo</code> 에서 꺼내 캔버스와 <code>history</code> 에 되돌리기. <code>redo</code> 가 비면 버튼이 꺼지게(<code>CanExecute</code>)</li><li><b>새로 그리면</b>(Finish) · 모두 지우면 · 파일을 열면 <code>redo</code> 를 비우기 — 새 획을 그린 뒤에 옛 도형이 “다시 실행” 되면 이상하니까요</li></ul>',
            hint: '<code>Undo_Executed</code> 에 <code>redo.Push(last);</code> 한 줄, <code>Finish</code> · <code>Clear_Click</code> · <code>LoadLines</code> 에 <code>redo.Clear();</code>. 다시 실행은 같은 도형 객체를 <code>board.Children.Add(again); history.Push(again);</code> 하면 그대로 다시 보입니다.',
            starter: X1_STARTER,
            solution: X1_SOLUTION
          },
          {
            title: '확장 과제 2. 삼각형 도구',
            level: 3,
            desc: '<p><b>삼각형</b> 라디오 단추(<code>Tag="tri"</code>)가 뼈대에 있습니다. 나머지를 완성하세요.</p><ul><li><code>CreateShape</code>: <code>case "tri":</code> — 점선 미리 보기 <code>Polygon</code></li><li><code>UpdateShape</code>: 끄는 상자의 <b>왼쪽 아래 · 위쪽 가운데 · 오른쪽 아래</b> 세 점으로 <code>Points</code> 를 정하기 (어느 방향으로 끌어도 꼭짓점이 위)</li><li>저장: <code>TRI 색 굵기 x,y x,y x,y</code> / 불러오기: <code>case "TRI":</code> 로 점 세 개를 읽어 <code>Polygon</code></li></ul>',
            hint: '<code>Polygon</code> 은 <code>Polyline</code> 과 달리 마지막 점과 첫 점을 자동으로 이어 닫힌 도형이 됩니다. <code>UpdateShape</code> 의 “나머지는 상자” <code>else</code> 보다 <b>앞에</b> <code>else if (shape is Polygon tri)</code> 를 넣어야 합니다. 상자: <code>left = Math.Min(start.X, p.X)</code>, <code>right = Math.Max(…)</code>, 위 · 아래도 같은 방법.',
            starter: X2_STARTER,
            solution: X2_SOLUTION
          }
        ],
        quiz: [
          { q: '↶ 버튼에 <code>Command="{x:Static ApplicationCommands.Undo}"</code> 를 주고 <code>CanExecute</code> 에서 <code>e.CanExecute = history.Count &gt; 0;</code> 으로 했다. 모두 취소하고 나면?', options: ['↶ 버튼이 저절로 꺼지고 Ctrl+Z 도 동작하지 않는다', '버튼을 누르면 예외가 난다', '버튼은 켜져 있지만 아무 일도 없다', '프로그램이 종료된다'], answer: 0, explain: '명령의 CanExecute 가 false 이면 그 명령을 쓰는 버튼 · 메뉴 · 단축키가 한꺼번에 꺼집니다(21장).' },
          { q: '확장 과제 1 에서 새로 그릴 때(Finish) <code>redo.Clear()</code> 를 빠뜨리면?', options: ['컴파일 오류', '취소 → 새 획 그리기 → ↷ 를 누르면 예전에 취소한 도형이 새 획 위에 되살아나는 이상한 동작', '다시 실행이 전혀 안 된다', '실행 취소가 안 된다'], answer: 1, explain: '다시 실행은 “방금 취소한 것을 되돌리기” 입니다. 그 사이 새로운 일을 했다면 되돌릴 대상이 의미를 잃으므로 비웁니다.' },
          { q: '완성 프로그램이 시작 그림을 그릴 때 쓴 방법은?', options: ['XAML 에 도형을 모두 적었다', 'PNG 그림을 Image 로 띄웠다', 'Random 으로 도형을 만들었다', '저장 형식의 글자 배열을 LoadLines 로 읽었다'], answer: 3, explain: '파일과 같은 형식의 글자를 배열로 두고 LoadLines 에 넘겼습니다. 그래서 불러온 그림처럼 한 획씩 취소할 수도 있습니다.' },
          { q: '삼각형 과제에서 <code>else if (shape is Polygon tri)</code> 를 사각형 · 원을 처리하는 마지막 <code>else</code> 뒤에 두면?', options: ['잘 동작한다', 'else 뒤에는 else if 를 쓸 수 없어 컴파일 오류', 'Polygon 은 Shape 가 아니라서 무시된다', '삼각형이 원으로 그려진다'], answer: 1, explain: '<code>else</code> 는 if 사슬의 마지막이어야 합니다. 조건이 있는 분기(else if)를 “나머지 모두” 보다 앞에 둡니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: 'Project 07 · Section 04 — 명령 · 예시 그림 · 확장 과제', badge: 'P07-4',
            notes: '<p><b>[도입]</b> 완성 프로그램을 실행하면 예시 그림이 떠 있습니다. “이 그림은 어떻게 그렸을까?” — 코드 몇 줄 없이 저장 형식 글자로 그렸다는 것을 곧 확인합니다.</p>' },
          { layout: 'bullets', title: '단계 6 에 더한 세 가지', bullets: ['실행 취소 = 명령 <code>ApplicationCommands.Undo</code>', ['Ctrl+Z 자동, CanExecute 로 버튼 자동 켜고 끄기'], '<code>IsTooSmall</code> — 클릭만 한 도형 버리기', '예시 그림 = 저장 형식의 글자 배열 + <code>LoadLines</code>'],
            notes: '<p><b>[4분]</b> 예시 그림 배열(SamplePicture)을 보여 주고, 한 줄을 고쳐(해의 색을 Crimson 으로) 다시 실행해 봅니다. 데이터와 코드를 나눈 효과를 체감하게 합니다.</p>' },
          { layout: 'code', title: '실행 취소를 명령으로', code: SL_UNDO_CMD, run: false, points: ['<code>CommandBinding</code> — 할 일 + 가능 여부', 'Ctrl+Z 는 Undo 명령에 기본으로 들어 있다', '<code>CanExecute = false</code> → 버튼이 꺼짐', '버튼은 <code>Command</code> 만 주면 된다'],
            notes: '<p><b>[4분]</b> 21장 복습. 다 취소하면 ↶ 가 회색이 되는 것을 시연합니다. Click 방식이었던 단계 6 과 비교해 “버튼 켜고 끄기를 직접 관리하지 않는다” 는 이점을 짚습니다.</p>' },
          { layout: 'table', title: '완성 프로그램의 구조', head: ['부분', '메서드'], rows: [
            ['그리기', '세 이벤트 · CreateShape · UpdateShape · Finish'],
            ['도구 · 색', 'Tool_Click · Color_Click'],
            ['취소 · 지우기', 'Undo_Executed · CanExecute · Clear_Click'],
            ['파일', 'ToLines · LoadLines · Save · Open'],
            ['표시', 'UpdateInfo · ToolName']
          ], notes: '<p><b>[4분]</b> “새 도구를 더하려면 어디를?” · “취소 방식을 바꾸려면 어디를?” 을 물어 구조를 복습합니다.</p>' },
          { layout: 'bullets', title: '실행 · 점검', lead: '체크리스트로 F1 ~ F8',
            bullets: ['네 방향으로 끌기 · 창 밖에서 떼기', '지우개 뒤 ↶ → 되살아나기', 'Ctrl+Z 로 모두 취소 → ↶ 꺼짐', '저장 → 모두 지우기 → 열기 = 같은 그림', '짝의 그림판에 “이상한 파일” 열어 보기'],
            notes: '<p><b>[8분]</b> 짝 점검. 저장 파일을 메모장으로 망가뜨려 열어 보게 하면 try/catch 의 역할이 분명해집니다.</p>' },
          { layout: 'code', title: '더 알아보기 — PNG 로 내보내기', code: PNG_EXPORT, run: false, points: ['<code>RenderTargetBitmap</code> — 요소를 비트맵으로 찍기', '<code>PngBitmapEncoder</code> — PNG 로 쓰기', 'Visual Studio(실제 WPF) 전용', '다시 고칠 수는 없다 → 두 형식을 함께'],
            notes: '<p><b>[4분]</b> 브라우저에서는 실행되지 않습니다. 시간이 되면 Visual Studio 에서 시연하세요. “고칠 수 있는 원본(.pnt) + 보여 주기용(.png)” 을 함께 쓰는 것은 실제 프로그램(포토샵 PSD + JPG 등)과 같습니다.</p>' },
          { layout: 'table', title: '확장 과제', head: ['과제', '고칠 곳'], rows: [
            ['1. 다시 실행', 'redo 스택 + Undo · Finish · Clear · LoadLines 에 한 줄씩 + Redo 처리기'],
            ['2. 삼각형', 'CreateShape · UpdateShape · ToLines · LoadLines · ToolName 에 한 조각씩']
          ], notes: '<p><b>[20분]</b> 과제 1 은 “스택 두 개가 주고받기” — 칠판에 두 스택을 그리고 취소 · 다시 실행 · 새로 그리기 때 무엇이 어디로 가는지 함께 따라가면 좋습니다. 과제 2 는 else if 의 위치(퀴즈 4번)에서 자주 막힙니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '다시 실행에서 새로 그릴 때 redo.Clear() 를 빠뜨리면?', options: ['컴파일 오류', '예전에 취소한 도형이 새 획 뒤에 되살아난다', '다시 실행이 안 된다', '실행 취소가 안 된다'], answer: 1, explain: '새로운 일을 하면 “되돌릴 취소” 는 의미를 잃습니다.',
            notes: '<p>워드 프로세서에서 되돌리기 → 새로 입력 → 다시 실행이 안 되는 것을 떠올리게 하세요.</p>' },
          { layout: 'practice', title: '확장 과제 1. 다시 실행', desc: '<p>redo 스택을 만들어 ↷ · Ctrl+Y 를 완성 (새로 그리기 · 모두 지우기 · 열기 때 redo 비우기). 끝나면 확장 과제 2(삼각형).</p>', starter: X1_STARTER, solution: X1_SOLUTION,
            notes: '<p><b>[과제]</b> 확인 순서: 세 획 그리기 → ↶ 두 번 → ↷ 한 번(하나 되살아남) → 새 획 → ↷ 꺼짐.</p>' },
          { layout: 'summary', title: '정리', bullets: ['세 이벤트 + current 필드 = 끌어서 그리기', '만들기(switch) · 모양 맞추기(is) · 확정 으로 나누기', 'Stack 으로 실행 취소, 명령으로 Ctrl+Z', '도형 ⇄ 글자 한 줄 = 다시 고칠 수 있는 저장', '데이터(예시 그림)와 코드를 나누면 바꾸기 쉽다'],
            notes: '<p><b>[발표 5분]</b> 학생 그림 한두 개를 저장 파일로 받아 교사 PC 에서 열어 보면 “파일 형식이 같으면 누구의 프로그램으로도 열린다” 를 보여 줄 수 있습니다. 다음 프로젝트 P08 은 스톱워치 · 타이머입니다.</p>' }
        ]
      }
    ]
  });
})();
