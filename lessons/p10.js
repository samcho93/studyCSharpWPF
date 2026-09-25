/* Project 10. WPF 벽돌 깨기 게임 — Canvas · 도형 · DispatcherTimer 게임 루프 · 키보드/마우스 · 충돌 · enum 상태 · 클래스 설계 */
(function () {
  const MONO = "font-family:Consolas,'D2Coding',monospace";
  const NS = `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;

  // 문자열 치환 도우미: 찾을 글이 없으면 바로 오류 (단계별 코드가 조용히 어긋나지 않게)
  function rep(src, pairs) {
    let s = src;
    for (const [a, b] of pairs) {
      if (!s.includes(a)) throw new Error('p10 rep: 찾을 수 없음 → ' + a.slice(0, 80));
      s = s.split(a).join(b);
    }
    return s;
  }

  // ---------- 모든 단계가 함께 쓰는 게임 화면 XAML (위: 점수 · 레벨 · 생명, 아래: 480×360 게임 판) ----------
  function fieldXaml(o) {
    const shapes = o.noShapes ? '' : `
            <Rectangle x:Name="paddle" Width="80" Height="12" RadiusX="6" RadiusY="6" Fill="DeepSkyBlue"
                       Canvas.Left="200" Canvas.Top="330"/>
            <Ellipse x:Name="ball" Width="12" Height="12" Fill="White" Canvas.Left="234" Canvas.Top="317"/>`;
    return `// ===== File: MainWindow.xaml =====
<Window x:Class="${o.ns}.MainWindow"
        ${NS}
        Title="${o.title}" Width="520" Height="460" ResizeMode="NoResize"
        Background="#1E1E2E"${o.win ? '\n        ' + o.win : ''}>
    <DockPanel Margin="10,4,10,10">
        <!-- 위쪽 정보 막대(HUD): 점수 · 레벨 · 생명 -->
        <Grid DockPanel.Dock="Top" Height="30">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <TextBlock x:Name="lblScore" Grid.Column="0" Text="${o.score || '점수 0'}" Foreground="White"
                       FontSize="16" VerticalAlignment="Center"/>
            <TextBlock x:Name="lblLevel" Grid.Column="1" Text="${o.level || '레벨 1'}" Foreground="LightGray"
                       FontSize="16" VerticalAlignment="Center" TextAlignment="Center"/>
            <TextBlock x:Name="lblLives" Grid.Column="2" Text="생명 ♥♥♥" Foreground="Tomato"
                       FontSize="16" VerticalAlignment="Center" TextAlignment="Right"/>
        </Grid>
        <!-- 게임 판: 480×360, 밖으로 나간 부분은 잘라서 안 보이게 -->
        <Canvas x:Name="field" Width="480" Height="360" Background="#10101C" ClipToBounds="True"${o.canvas ? '\n                ' + o.canvas : ''}>${shapes}
            <TextBlock x:Name="lblMessage" Canvas.Left="0" Canvas.Top="230" Width="480" TextAlignment="Center"
                       Foreground="Gold" FontSize="18" Text="${o.msg || ''}"/>
        </Canvas>
    </DockPanel>
</Window>
// ===== File: MainWindow.xaml.cs =====
`;
  }

  /* ======================================================================
   * 그림
   * ====================================================================== */
  /* ---------- 그림 1. 게임 화면 설계 (Canvas 좌표) ---------- */
  const SVG_FIELD = (() => {
    const k = 1.1, ox = 40, oy = 86;          // 480×360 → 528×396
    const colors = ['#dc143c', '#ff8c00', '#ffd700', '#32cd32', '#1e90ff'];
    let bricks = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
      bricks += `<rect x="${(ox + (10 + c * 58) * k).toFixed(1)}" y="${(oy + (40 + r * 22) * k).toFixed(1)}" width="${(54 * k).toFixed(1)}" height="${(18 * k).toFixed(1)}" rx="3" fill="${colors[r]}"/>`;
    }
    const px = ox + 200 * k, py = oy + 330 * k, bx = ox + 250 * k, by = oy + 250 * k;
    return `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="480 곱하기 360 게임 판 위의 벽돌 5줄 8칸, 패들, 공과 좌표축">
  <defs><marker id="ap10a" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  <marker id="ap10a2" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="${ox}" y="30" width="${480 * k}" height="46" rx="6" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="${ox + 14}" y="60" style="font-size:20px;fill:var(--fg)">점수 120</text>
  <text x="${ox + 240 * k}" y="60" text-anchor="middle" style="font-size:20px;fill:var(--muted)">레벨 1 · 진행</text>
  <text x="${ox + 480 * k - 14}" y="60" text-anchor="end" style="font-size:20px;fill:var(--danger)">생명 ♥♥♥</text>
  <rect x="${ox}" y="${oy}" width="${480 * k}" height="${360 * k}" fill="#10101c" stroke="var(--line)" stroke-width="3"/>
  ${bricks}
  <rect x="${px}" y="${py}" width="${80 * k}" height="${12 * k}" rx="6" fill="#00bfff"/>
  <circle cx="${bx + 6 * k}" cy="${by + 6 * k}" r="${6 * k}" fill="#fff"/>
  <line x1="${bx + 6 * k}" y1="${by + 6 * k}" x2="${bx + 6 * k + 60}" y2="${by + 6 * k - 72}" stroke="var(--accent)" stroke-width="4" marker-end="url(#ap10a)"/>
  <text x="${bx + 6 * k + 66}" y="${by - 64}" style="${MONO};font-size:19px;fill:var(--accent)">(vx, vy)</text>
  <line x1="${ox}" y1="${oy}" x2="${ox + 100}" y2="${oy}" stroke="var(--warn)" stroke-width="4" marker-end="url(#ap10a)"/>
  <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + 90}" stroke="var(--warn)" stroke-width="4" marker-end="url(#ap10a)"/>
  <text x="${ox + 108}" y="${oy + 22}" style="${MONO};font-size:18px;fill:var(--warn)">x</text>
  <text x="${ox + 8}" y="${oy + 110}" style="${MONO};font-size:18px;fill:var(--warn)">y</text>
  <text x="${ox + 8}" y="${oy + 440 * k - 30}" style="${MONO};font-size:16px;fill:#aaa">(480, 360) ↘</text>
  <g style="font-size:21px;fill:var(--fg)">
    <text x="640" y="60"><tspan font-weight="700" style="fill:var(--warn)">좌표</tspan>  (0, 0) = 왼쪽 위, x 는 오른쪽 · y 는 <tspan font-weight="700">아래</tspan>로 증가</text>
    <text x="640" y="140"><tspan font-weight="700" style="fill:var(--danger)">벽돌</tspan>  5줄 × 8칸 = 40개, 54×18, 간격 4</text>
    <text x="640" y="172" style="font-size:18px;fill:var(--muted)">첫 벽돌 (10, 40) · 줄마다 색과 점수가 다름 (50 … 10점)</text>
    <text x="640" y="252"><tspan font-weight="700" style="fill:var(--accent)">공</tspan>  Ellipse 12×12, 속도 벡터 (vx, vy)</text>
    <text x="640" y="284" style="font-size:18px;fill:var(--muted)">매 프레임 x += vx, y += vy</text>
    <text x="640" y="364"><tspan font-weight="700" style="fill:var(--accent2)">패들</tspan>  Rectangle 80×12, y = 330 에서 좌우로만</text>
    <text x="640" y="396" style="font-size:18px;fill:var(--muted)">← → 키 또는 마우스, 0 ≤ x ≤ 480 − 80</text>
    <text x="640" y="476"><tspan font-weight="700" style="fill:var(--ok)">HUD</tspan>  TextBlock 3개 (Grid 3칸) + 가운데 안내 글</text>
    <text x="640" y="508" style="font-size:18px;fill:var(--muted)">“스페이스바를 누르면 시작합니다”</text>
  </g>
</svg>`;
  })();

  /* ---------- 그림 2. 게임 루프 ---------- */
  const SVG_LOOP = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="타이머 Tick 마다 입력 반영, 이동, 충돌 검사, 그리기를 반복하는 게임 루프">
  <defs><marker id="ap10b" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <rect x="470" y="24" width="340" height="70" rx="35" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="640" y="56" text-anchor="middle" style="font-size:23px;font-weight:700;fill:var(--accent)">DispatcherTimer.Tick</text>
  <text x="640" y="82" text-anchor="middle" style="${MONO};font-size:17px;fill:var(--muted)">Interval = 16 ms (≈ 60번/초)</text>
  <g style="font-size:21px;fill:var(--fg)">
    <rect x="860" y="150" width="340" height="96" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1030" y="188" text-anchor="middle" font-weight="700">① 입력 반영</text>
    <text x="1030" y="222" text-anchor="middle" style="font-size:18px;fill:var(--muted)">눌린 키 플래그 → 패들 x 이동</text>
    <rect x="860" y="330" width="340" height="96" rx="12" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1030" y="368" text-anchor="middle" font-weight="700">② 이동</text>
    <text x="1030" y="402" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">x += vx;  y += vy;</text>
    <rect x="470" y="440" width="340" height="96" rx="12" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="640" y="478" text-anchor="middle" font-weight="700">③ 충돌 검사</text>
    <text x="640" y="512" text-anchor="middle" style="font-size:18px;fill:var(--muted)">벽 · 패들 · 벽돌 · 바닥 → 반사 · 점수 · 생명</text>
    <rect x="80" y="330" width="340" height="96" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="250" y="368" text-anchor="middle" font-weight="700">④ 그리기</text>
    <text x="250" y="402" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--muted)">Canvas.SetLeft/SetTop · HUD</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <path d="M812,60 Q1030,60 1030,146" marker-end="url(#ap10b)"/>
    <line x1="1030" y1="248" x2="1030" y2="326" marker-end="url(#ap10b)"/>
    <path d="M1030,428 Q1030,488 814,488" marker-end="url(#ap10b)"/>
    <path d="M468,488 Q250,488 250,430" marker-end="url(#ap10b)"/>
    <path d="M250,328 Q250,60 466,60" marker-end="url(#ap10b)"/>
  </g>
  <text x="290" y="160" style="font-size:19px;fill:var(--muted)">다음 Tick 까지 쉼 (UI 는 자유)</text>
  <rect x="440" y="170" width="380" height="200" rx="12" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="630" y="206" text-anchor="middle" style="font-size:20px;font-weight:700;fill:var(--fg)">입력 이벤트는 따로 온다</text>
  <text x="630" y="246" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">KeyDown → leftDown = true</text>
  <text x="630" y="280" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">KeyUp   → leftDown = false</text>
  <text x="630" y="314" text-anchor="middle" style="${MONO};font-size:18px;fill:var(--fg)">MouseMove → paddleX = 마우스 x</text>
  <text x="630" y="350" text-anchor="middle" style="font-size:17px;fill:var(--muted)">처리기는 “기록”만, 실제 이동은 루프 ①에서</text>
</svg>`;

  /* ---------- 그림 3. 게임 상태 전이 ---------- */
  const SVG_STATES = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="준비, 진행, 일시정지, 게임 오버, 클리어 다섯 상태와 전이 조건">
  <defs><marker id="ap10c" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker></defs>
  <g style="font-size:22px;font-weight:700" text-anchor="middle">
    <rect x="60" y="210" width="240" height="90" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="180" y="248" style="fill:var(--accent)">준비</text>
    <text x="180" y="280" style="${MONO};font-size:17px;font-weight:400;fill:var(--muted)">Ready</text>
    <rect x="520" y="210" width="240" height="90" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
    <text x="640" y="248" style="fill:var(--ok)">진행</text>
    <text x="640" y="280" style="${MONO};font-size:17px;font-weight:400;fill:var(--muted)">Playing</text>
    <rect x="980" y="50" width="240" height="90" rx="16" fill="var(--card)" stroke="var(--warn)" stroke-width="3"/>
    <text x="1100" y="88" style="fill:var(--warn)">일시정지</text>
    <text x="1100" y="120" style="${MONO};font-size:17px;font-weight:400;fill:var(--muted)">Paused</text>
    <rect x="400" y="420" width="240" height="90" rx="16" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
    <text x="520" y="458" style="fill:var(--danger)">게임 오버</text>
    <text x="520" y="490" style="${MONO};font-size:17px;font-weight:400;fill:var(--muted)">GameOver</text>
    <rect x="900" y="420" width="240" height="90" rx="16" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="1020" y="458" style="fill:var(--accent2)">클리어</text>
    <text x="1020" y="490" style="${MONO};font-size:17px;font-weight:400;fill:var(--muted)">Cleared</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <line x1="302" y1="236" x2="516" y2="236" marker-end="url(#ap10c)"/>
    <line x1="518" y1="276" x2="304" y2="276" marker-end="url(#ap10c)"/>
    <path d="M740,208 Q820,110 976,100" marker-end="url(#ap10c)"/>
    <path d="M1060,142 Q1000,250 764,258" marker-end="url(#ap10c)"/>
    <line x1="600" y1="302" x2="548" y2="416" marker-end="url(#ap10c)"/>
    <line x1="700" y1="302" x2="960" y2="416" marker-end="url(#ap10c)"/>
    <path d="M398,470 L230,470 L230,304" marker-end="url(#ap10c)"/>
    <path d="M1020,512 L1020,540 L130,540 L130,304" marker-end="url(#ap10c)"/>
  </g>
  <g style="font-size:19px;fill:var(--fg)">
    <text x="410" y="224" text-anchor="middle"><tspan font-weight="700">Space</tspan> (공 발사)</text>
    <text x="410" y="304" text-anchor="middle" style="font-size:17px;fill:var(--muted)">공 놓침(생명 남음) · 레벨 1 클리어</text>
    <text x="800" y="120" text-anchor="middle"><tspan font-weight="700">Space</tspan></text>
    <text x="930" y="220" text-anchor="middle"><tspan font-weight="700">Space</tspan></text>
    <text x="500" y="370" text-anchor="end">생명 0</text>
    <text x="850" y="370">레벨 2 의 벽돌 0개</text>
    <text x="250" y="456"><tspan font-weight="700">Space</tspan> 새 게임</text>
    <text x="640" y="534" text-anchor="middle" style="font-size:17px;fill:var(--muted)">Space → 새 게임 (레벨 1 · 점수 0 · 생명 3)</text>
  </g>
</svg>`;

  /* ---------- 그림 4. 패들에 맞은 위치 → 반사 각도 ---------- */
  const SVG_PADDLE = (() => {
    const pts = [[-1, 240], [-0.5, 440], [0, 640], [0.5, 840], [1, 1040]];
    let arrows = '', labels = '';
    for (const [h, x] of pts) {
      const deg = h * 60, rad = deg * Math.PI / 180;
      const ex = x + 190 * Math.sin(rad), ey = 400 - 190 * Math.cos(rad);
      arrows += `<line x1="${x}" y1="400" x2="${ex.toFixed(0)}" y2="${ey.toFixed(0)}" marker-end="url(#ap10d)"/>`;
      labels += `<text x="${x}" y="500" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">${h > 0 ? '+' : ''}${h}</text>`;
      labels += `<text x="${(ex + (h < 0 ? -8 : h > 0 ? 8 : 0)).toFixed(0)}" y="${(ey - 10).toFixed(0)}" text-anchor="${h < 0 ? 'end' : h > 0 ? 'start' : 'middle'}" style="font-size:19px;font-weight:700;fill:var(--accent)">${deg > 0 ? '+' : ''}${deg}°</text>`;
    }
    return `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="패들의 왼쪽 끝은 -60도, 가운데는 0도, 오른쪽 끝은 +60도로 공이 튕겨 나간다">
  <defs><marker id="ap10d" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="240" y="404" width="800" height="44" rx="22" fill="#00bfff" opacity="0.85"/>
  <text x="640" y="433" text-anchor="middle" style="font-size:20px;font-weight:700;fill:#10101c">패들 (너비 80 → 그림에서는 크게)</text>
  <g stroke="var(--accent)" stroke-width="4">${arrows}</g>
  ${labels}
  <text x="640" y="532" text-anchor="middle" style="font-size:19px;fill:var(--muted)">hit = (공 중심 x − 패들 왼쪽 x) ÷ 패들 너비 × 2 − 1     →     −1 (왼쪽 끝) … 0 (가운데) … +1 (오른쪽 끝)</text>
  <g style="font-size:20px;fill:var(--fg)">
    <text x="30" y="46"><tspan font-weight="700">각도</tspan> = hit × 60°  (0° = 똑바로 위)</text>
    <text x="30" y="80" style="${MONO};font-size:18px">vx = speed × sin(각도)</text>
    <text x="30" y="110" style="${MONO};font-size:18px">vy = −speed × cos(각도)</text>
    <text x="1250" y="46" text-anchor="end">속도의 <tspan font-weight="700">크기</tspan>(speed)는 그대로,</text>
    <text x="1250" y="80" text-anchor="end"><tspan font-weight="700">방향</tspan>만 맞은 자리에 따라 바뀐다</text>
  </g>
</svg>`;
  })();

  /* ---------- 그림 5. 벽돌에 부딪힌 면 찾기 ---------- */
  const SVG_BRICK = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="겹친 부분의 폭이 좁으면 옆면 충돌이라 vx 를, 높이가 낮으면 윗면이나 아랫면 충돌이라 vy 를 뒤집는다">
  <defs><marker id="ap10e" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="300" y="50" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">① 옆면에 맞음</text>
  <rect x="180" y="170" width="300" height="110" rx="8" fill="#ff8c00" opacity="0.85"/>
  <rect x="80" y="190" width="130" height="130" rx="65" fill="none" stroke="var(--fg)" stroke-width="4"/>
  <rect x="180" y="190" width="30" height="90" fill="var(--danger)" opacity="0.6"/>
  <text x="195" y="360" text-anchor="middle" style="font-size:19px;fill:var(--danger)">폭 30 &lt; 높이 90</text>
  <line x1="60" y1="140" x2="130" y2="200" stroke="var(--muted)" stroke-width="3" stroke-dasharray="7 5"/>
  <line x1="140" y1="250" x2="60" y2="330" stroke="var(--accent)" stroke-width="4" marker-end="url(#ap10e)"/>
  <text x="300" y="420" text-anchor="middle" style="font-size:22px;fill:var(--fg)">→ <tspan font-weight="700" style="${MONO};fill:var(--accent)">vx = -vx</tspan> (좌우 반사)</text>
  <text x="940" y="50" text-anchor="middle" style="font-size:24px;font-weight:700;fill:var(--fg)">② 아랫면에 맞음</text>
  <rect x="790" y="120" width="300" height="110" rx="8" fill="#1e90ff" opacity="0.85"/>
  <rect x="875" y="200" width="130" height="130" rx="65" fill="none" stroke="var(--fg)" stroke-width="4"/>
  <rect x="885" y="200" width="110" height="30" fill="var(--danger)" opacity="0.6"/>
  <text x="940" y="360" text-anchor="middle" style="font-size:19px;fill:var(--danger)">높이 30 &lt; 폭 110</text>
  <line x1="1080" y1="420" x2="990" y2="320" stroke="var(--muted)" stroke-width="3" stroke-dasharray="7 5"/>
  <line x1="1000" y1="260" x2="1110" y2="150" stroke="var(--accent)" stroke-width="4" marker-end="url(#ap10e)"/>
  <text x="940" y="420" text-anchor="middle" style="font-size:22px;fill:var(--fg)">→ <tspan font-weight="700" style="${MONO};fill:var(--accent)">vy = -vy</tspan> (상하 반사)</text>
  <line x1="640" y1="70" x2="640" y2="440" stroke="var(--line)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="640" y="490" text-anchor="middle" style="${MONO};font-size:19px;fill:var(--fg)">overlapX = min(오른쪽, 오른쪽) − max(왼쪽, 왼쪽)    overlapY = min(아래, 아래) − max(위, 위)</text>
  <text x="640" y="528" text-anchor="middle" style="font-size:19px;fill:var(--muted)">겹친 사각형(빨강)이 “세로로 길쭉”하면 옆면, “가로로 납작”하면 윗면 · 아랫면</text>
</svg>`;

  /* ---------- 그림 6. 완성 프로그램의 클래스 구조 ---------- */
  const SVG_CLASSES = `<svg viewBox="0 0 1280 560" width="100%" role="img" aria-label="MainWindow 가 Game 을 사용하고, Game 은 Ball, Paddle, Brick 목록을 가지며, 세 클래스는 추상 클래스 GameObject 를 상속한다">
  <defs>
    <marker id="ap10f" markerWidth="13" markerHeight="13" refX="10" refY="6" orient="auto" viewBox="0 0 12 12" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="var(--muted)"/></marker>
    <marker id="ap10g" markerWidth="22" markerHeight="22" refX="20" refY="10" orient="auto" viewBox="0 0 22 20" markerUnits="userSpaceOnUse"><path d="M0,0 L20,10 L0,20 z" fill="var(--card)" stroke="var(--muted)" stroke-width="2"/></marker>
    <marker id="ap10h" markerWidth="24" markerHeight="16" refX="2" refY="8" orient="auto" viewBox="0 0 24 16" markerUnits="userSpaceOnUse"><path d="M0,8 L12,0 L24,8 L12,16 z" fill="var(--muted)"/></marker>
  </defs>
  <g style="font-size:19px;fill:var(--fg)">
    <rect x="20" y="24" width="320" height="120" rx="10" fill="var(--card)" stroke="var(--accent2)" stroke-width="3"/>
    <text x="180" y="56" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent2)">MainWindow</text>
    <line x1="20" y1="68" x2="340" y2="68" stroke="var(--line)" stroke-width="2"/>
    <text x="36" y="96" style="${MONO};font-size:17px">timer (16 ms) → game.Update()</text>
    <text x="36" y="124" style="${MONO};font-size:17px">KeyDown · MouseMove · UpdateHud</text>

    <rect x="20" y="190" width="320" height="340" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
    <text x="180" y="224" text-anchor="middle" style="font-size:22px;font-weight:700;fill:var(--accent)">Game</text>
    <line x1="20" y1="238" x2="340" y2="238" stroke="var(--line)" stroke-width="2"/>
    <text x="36" y="266" style="${MONO};font-size:17px">Score · Lives · Level</text>
    <text x="36" y="292" style="${MONO};font-size:17px">State : GameState (enum)</text>
    <text x="36" y="318" style="${MONO};font-size:17px">Ball · Paddle · List&lt;Brick&gt;</text>
    <line x1="20" y1="332" x2="340" y2="332" stroke="var(--line)" stroke-width="2"/>
    <text x="36" y="360" style="${MONO};font-size:17px">NewGame() · PressSpace()</text>
    <text x="36" y="386" style="${MONO};font-size:17px">Update()  ← 한 프레임</text>
    <text x="36" y="412" style="${MONO};font-size:17px">MovePaddleTo(x)</text>
    <text x="36" y="438" style="${MONO};font-size:17px">event Action Changed</text>
    <text x="36" y="464" style="${MONO};font-size:17px">Message · StateName()</text>
    <text x="180" y="510" text-anchor="middle" style="font-size:17px;fill:var(--muted)">게임 규칙이 모두 여기에</text>

    <rect x="620" y="24" width="400" height="176" rx="10" fill="var(--card)" stroke="var(--fg)" stroke-width="3"/>
    <text x="820" y="56" text-anchor="middle" style="font-size:22px;font-weight:700;font-style:italic">GameObject (abstract)</text>
    <line x1="620" y1="68" x2="1020" y2="68" stroke="var(--line)" stroke-width="2"/>
    <text x="636" y="96" style="${MONO};font-size:17px">X · Y · Width · Height · Shape</text>
    <line x1="620" y1="110" x2="1020" y2="110" stroke="var(--line)" stroke-width="2"/>
    <text x="636" y="138" style="${MONO};font-size:17px">Bounds : Rect   (충돌용 사각형)</text>
    <text x="636" y="164" style="${MONO};font-size:17px">CenterX</text>
    <text x="636" y="190" style="${MONO};font-size:17px">Draw()  → Canvas.SetLeft/SetTop</text>

    <rect x="400" y="320" width="270" height="210" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="535" y="352" text-anchor="middle" style="font-size:22px;font-weight:700">Ball</text>
    <line x1="400" y1="364" x2="670" y2="364" stroke="var(--line)" stroke-width="2"/>
    <text x="414" y="392" style="${MONO};font-size:16px">VX · VY · Speed</text>
    <text x="414" y="420" style="${MONO};font-size:16px">Launch(각도) · Move()</text>
    <text x="414" y="446" style="${MONO};font-size:16px">StickTo(paddle)</text>
    <text x="414" y="472" style="${MONO};font-size:16px">BounceOffWalls(w)</text>
    <text x="414" y="498" style="${MONO};font-size:16px">BounceOff(paddle | rect)</text>

    <rect x="700" y="320" width="270" height="170" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="835" y="352" text-anchor="middle" style="font-size:22px;font-weight:700">Paddle</text>
    <line x1="700" y1="364" x2="970" y2="364" stroke="var(--line)" stroke-width="2"/>
    <text x="714" y="392" style="${MONO};font-size:16px">Speed</text>
    <text x="714" y="420" style="${MONO};font-size:16px">MoveBy(dx, w)</text>
    <text x="714" y="446" style="${MONO};font-size:16px">CenterAt(x, w)</text>
    <text x="714" y="472" style="${MONO};font-size:16px">HitOffset(공 중심)</text>

    <rect x="1000" y="320" width="260" height="170" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
    <text x="1130" y="352" text-anchor="middle" style="font-size:22px;font-weight:700">Brick</text>
    <line x1="1000" y1="364" x2="1260" y2="364" stroke="var(--line)" stroke-width="2"/>
    <text x="1014" y="392" style="${MONO};font-size:16px">Points</text>
    <text x="1014" y="420" style="${MONO};font-size:16px">virtual Hit() → bool</text>
    <text x="1014" y="460" style="font-size:16px;fill:var(--muted)">확장: HardBrick 이 재정의</text>
  </g>
  <g stroke="var(--muted)" stroke-width="3" fill="none">
    <line x1="180" y1="146" x2="180" y2="186" marker-end="url(#ap10f)"/>
    <line x1="535" y1="318" x2="700" y2="204" marker-end="url(#ap10g)"/>
    <line x1="835" y1="318" x2="828" y2="204" marker-end="url(#ap10g)"/>
    <line x1="1130" y1="318" x2="960" y2="204" marker-end="url(#ap10g)"/>
    <line x1="342" y1="420" x2="396" y2="420" marker-start="url(#ap10h)"/>
  </g>
  <text x="196" y="172" style="font-size:17px;fill:var(--muted)">사용</text>
  <text x="352" y="408" style="font-size:16px;fill:var(--muted)">has-a</text>
  <text x="1150" y="250" text-anchor="middle" style="font-size:17px;fill:var(--muted)">▷ 상속 (is-a)</text>
  <text x="1150" y="276" text-anchor="middle" style="font-size:17px;fill:var(--muted)">◆ 합성 (has-a)</text>
</svg>`;

  /* ======================================================================
   * 1교시 코드
   * ====================================================================== */
  const PREP_MOVE = `using System;

class Program
{
    static void Main()
    {
        const double Width = 100, Height = 60, Size = 10;   // 판 크기, 공 크기
        double x = 20, y = 30;       // 공의 왼쪽 위 좌표
        double vx = 15, vy = -12;    // 속도: 한 프레임에 움직이는 거리

        for (int frame = 1; frame <= 8; frame++)
        {
            x += vx;                 // ① 이동
            y += vy;

            string hit = "";         // ② 벽에 닿았으면 안으로 되돌리고 방향을 뒤집는다
            if (x < 0)             { x = 0;             vx = -vx; hit += " 왼쪽 벽"; }
            if (x + Size > Width)  { x = Width - Size;  vx = -vx; hit += " 오른쪽 벽"; }
            if (y < 0)             { y = 0;             vy = -vy; hit += " 천장"; }
            if (y + Size > Height) { y = Height - Size; vy = -vy; hit += " 바닥"; }

            Console.WriteLine($"프레임 {frame}: ({x,3}, {y,3})  속도 ({vx,3}, {vy,3}){hit}");
        }
    }
}
`;

  const PREP_HIT = `using System;

class Program
{
    // 두 사각형(왼쪽 위 x, y, 너비 w, 높이 h)이 겹치는가? — AABB 검사
    static bool Intersects(double ax, double ay, double aw, double ah,
                           double bx, double by, double bw, double bh)
    {
        return ax < bx + bw && bx < ax + aw     // 가로로 겹치고
            && ay < by + bh && by < ay + ah;    // 세로로도 겹친다
    }

    // 패들의 어디에 맞았나 → -1(왼쪽 끝) ~ 0(가운데) ~ +1(오른쪽 끝)
    static double HitOffset(double ballCenterX, double paddleX, double paddleWidth)
    {
        double t = (ballCenterX - paddleX) / paddleWidth * 2 - 1;
        return Math.Clamp(t, -1, 1);
    }

    static void Main()
    {
        // 벽돌: 왼쪽 위 (100, 40), 크기 54×18 / 공: 12×12
        Console.WriteLine(Intersects(90, 50, 12, 12, 100, 40, 54, 18));    // 왼쪽에서 살짝 겹침
        Console.WriteLine(Intersects(80, 50, 12, 12, 100, 40, 54, 18));    // 떨어져 있음
        Console.WriteLine(Intersects(120, 58, 12, 12, 100, 40, 54, 18));   // 아래에 딱 붙음

        // 패들: x = 200, 너비 80, 공 속도 5
        foreach (double cx in new[] { 200.0, 220.0, 240.0, 260.0, 280.0 })
        {
            double hit = HitOffset(cx, 200, 80);
            double angle = hit * 60;                     // 최대 ±60도
            double rad = angle * Math.PI / 180;
            double vx = 5 * Math.Sin(rad), vy = -5 * Math.Cos(rad);
            Console.WriteLine($"공 중심 {cx} → hit {hit,5:F2}, 각도 {angle,3}°, 속도 ({vx:F2}, {vy:F2})");
        }
    }
}
`;

  const PREP_MOVE_SLIDE = `using System;

class Program
{
    static void Main()
    {
        const double Width = 100, Height = 60, Size = 10;
        double x = 20, y = 30, vx = 15, vy = -12;

        for (int frame = 1; frame <= 8; frame++)
        {
            x += vx;  y += vy;                               // ① 이동
            if (x < 0)             { x = 0;             vx = -vx; }   // ② 반사
            if (x + Size > Width)  { x = Width - Size;  vx = -vx; }
            if (y < 0)             { y = 0;             vy = -vy; }
            if (y + Size > Height) { y = Height - Size; vy = -vy; }
            Console.WriteLine($"프레임 {frame}: ({x}, {y})  속도 ({vx}, {vy})");
        }
    }
}
`;

  const PREP_HIT_SLIDE = `using System;

class Program
{
    static bool Intersects(double ax, double ay, double aw, double ah,
                           double bx, double by, double bw, double bh)
        => ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;

    static double HitOffset(double ballCenterX, double paddleX, double paddleWidth)
        => Math.Clamp((ballCenterX - paddleX) / paddleWidth * 2 - 1, -1, 1);

    static void Main()
    {
        Console.WriteLine(Intersects(90, 50, 12, 12, 100, 40, 54, 18));   // True
        Console.WriteLine(Intersects(80, 50, 12, 12, 100, 40, 54, 18));   // False
        foreach (double cx in new[] { 200.0, 240.0, 270.0 })
        {
            double angle = HitOffset(cx, 200, 80) * 60;
            Console.WriteLine($"공 중심 {cx} → 각도 {angle}°");
        }
    }
}
`;

  const STEP1 = fieldXaml({ ns: 'P10Step1', title: '벽돌 깨기 — 단계 1: 화면 틀', msg: '' }) + `using System.Windows;
using System.Windows.Controls;

namespace P10Step1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // XAML 에서 x:Name 을 붙인 요소는 코드에서 바로 쓸 수 있다 — 위치를 읽어 보자
            double px = Canvas.GetLeft(paddle);
            double py = Canvas.GetTop(paddle);
            lblMessage.Text = $"게임 판 {field.Width} × {field.Height} · 패들 ({px}, {py})";
        }
    }
}`;

  const P1_STARTER = `using System;

class Program
{
    static void Main()
    {
        const double Width = 100, Height = 60, Size = 10;
        double x = 20, y = 30;
        double vx = 15, vy = -12;
        int lives = 3, bounces = 0;

        for (int frame = 1; frame <= 30; frame++)
        {
            x += vx;
            y += vy;

            // TODO 1: 왼쪽 벽(x < 0) · 오른쪽 벽(x + Size > Width)
            //         → 안쪽으로 되돌리고 vx 를 뒤집고 bounces 를 1 늘린다
            // TODO 2: 천장(y < 0) → 안쪽으로 되돌리고 vy 를 뒤집고 bounces 를 1 늘린다
            // TODO 3: 바닥(y + Size > Height) → 생명 1 감소, "프레임 n: 놓침! 남은 생명 m" 출력
            //         생명이 0 이면 "게임 오버" 를 출력하고 break
            //         아니면 공을 (45, 20) 에 다시 두고 vy = -12 (vx 는 그대로)
            if (frame == 30) Console.WriteLine($"판 {Width}×{Height}, 공 {Size} — 마지막 위치 ({x}, {y}), 속도 ({vx}, {vy})");
        }
        Console.WriteLine($"벽 반사 {bounces}번, 남은 생명 {lives}");
    }
}
`;
  const P1_SOLUTION = `using System;

class Program
{
    static void Main()
    {
        const double Width = 100, Height = 60, Size = 10;
        double x = 20, y = 30;
        double vx = 15, vy = -12;
        int lives = 3, bounces = 0;

        for (int frame = 1; frame <= 30; frame++)
        {
            x += vx;
            y += vy;

            if (x < 0)            { x = 0;            vx = -vx; bounces++; }
            if (x + Size > Width) { x = Width - Size; vx = -vx; bounces++; }
            if (y < 0)            { y = 0;            vy = -vy; bounces++; }

            if (y + Size > Height)                     // 바닥 = 놓침
            {
                lives--;
                Console.WriteLine($"프레임 {frame}: 놓침! 남은 생명 {lives}");
                if (lives == 0)
                {
                    Console.WriteLine("게임 오버");
                    break;
                }
                x = 45; y = 20; vy = -12;              // 다시 출발
            }
        }
        Console.WriteLine($"벽 반사 {bounces}번, 남은 생명 {lives}");
    }
}
`;

  const P2_STARTER = `using System;

class Program
{
    // 두 사각형이 겹치는가? (a = 공, b = 벽돌)
    static bool Intersects(double ax, double ay, double aw, double ah,
                           double bx, double by, double bw, double bh)
    {
        // TODO 1: 가로로도 세로로도 겹치면 true
        return false;
    }

    // 겹친 부분의 폭(overlapX)과 높이(overlapY)를 비교해
    // 폭이 더 좁으면 "좌우", 아니면 "상하" 를 돌려준다
    static string BounceAxis(double ax, double ay, double aw, double ah,
                             double bx, double by, double bw, double bh)
    {
        // TODO 2: overlapX = (두 오른쪽 중 작은 값) - (두 왼쪽 중 큰 값)
        //         overlapY = (두 아래쪽 중 작은 값) - (두 위쪽 중 큰 값)
        return "";
    }

    static void Main()
    {
        // 벽돌: (100, 40) 크기 54×18, 공 크기 12×12
        (double x, double y)[] balls = { (95, 44), (120, 55), (150, 30), (130, 29), (60, 44) };
        foreach (var (x, y) in balls)
        {
            if (!Intersects(x, y, 12, 12, 100, 40, 54, 18))
            {
                Console.WriteLine($"공 ({x}, {y}): 안 겹침");
                continue;
            }
            Console.WriteLine($"공 ({x}, {y}): 겹침 → {BounceAxis(x, y, 12, 12, 100, 40, 54, 18)} 반사");
        }
    }
}
`;
  const P2_SOLUTION = `using System;

class Program
{
    static bool Intersects(double ax, double ay, double aw, double ah,
                           double bx, double by, double bw, double bh)
    {
        return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
    }

    static string BounceAxis(double ax, double ay, double aw, double ah,
                             double bx, double by, double bw, double bh)
    {
        double overlapX = Math.Min(ax + aw, bx + bw) - Math.Max(ax, bx);
        double overlapY = Math.Min(ay + ah, by + bh) - Math.Max(ay, by);
        return overlapX < overlapY ? "좌우" : "상하";
    }

    static void Main()
    {
        (double x, double y)[] balls = { (95, 44), (120, 55), (150, 30), (130, 29), (60, 44) };
        foreach (var (x, y) in balls)
        {
            if (!Intersects(x, y, 12, 12, 100, 40, 54, 18))
            {
                Console.WriteLine($"공 ({x}, {y}): 안 겹침");
                continue;
            }
            Console.WriteLine($"공 ({x}, {y}): 겹침 → {BounceAxis(x, y, 12, 12, 100, 40, 54, 18)} 반사");
        }
    }
}
`;

  /* ======================================================================
   * 2교시 코드 — 게임 루프 · 패들 · 패들 충돌
   * ====================================================================== */
  const STEP2 = fieldXaml({ ns: 'P10Step2', title: '벽돌 깨기 — 단계 2: 게임 루프', score: '프레임 0', msg: '공이 네 벽에서 튕깁니다' }) + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;    // DispatcherTimer

namespace P10Step2
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private double ballX = 234, ballY = 200;    // 공의 왼쪽 위 좌표
        private double vx = 3, vy = -4;             // 속도 벡터 (한 프레임에 움직이는 픽셀)
        private int frame = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(16);   // 약 60 프레임/초
            timer.Tick += GameLoop;                            // 16 ms 마다 GameLoop 호출
            timer.Start();
            Closed += (s, e) => timer.Stop();                  // 창을 닫으면 타이머도 멈춘다
        }

        // 한 프레임 = ① 이동 → ② 충돌 검사 → ③ 그리기
        private void GameLoop(object sender, EventArgs e)
        {
            frame++;

            // ① 이동
            ballX += vx;
            ballY += vy;

            // ② 벽에 닿으면 안으로 되돌리고 방향 반전 (지금은 바닥에서도 튕긴다)
            if (ballX < 0) { ballX = 0; vx = -vx; }
            if (ballX + ball.Width > field.Width) { ballX = field.Width - ball.Width; vx = -vx; }
            if (ballY < 0) { ballY = 0; vy = -vy; }
            if (ballY + ball.Height > field.Height) { ballY = field.Height - ball.Height; vy = -vy; }

            // ③ 그리기: 계산한 좌표를 도형에 옮긴다
            Canvas.SetLeft(ball, ballX);
            Canvas.SetTop(ball, ballY);
            lblScore.Text = $"프레임 {frame}";
        }
    }
}`;

  const STEP3 = fieldXaml({
    ns: 'P10Step3', title: '벽돌 깨기 — 단계 3: 패들 조작',
    win: 'KeyDown="Window_KeyDown" KeyUp="Window_KeyUp"', canvas: 'MouseMove="Field_MouseMove"',
    msg: '창을 클릭한 뒤 ← → 키 또는 마우스로 움직이세요'
  }) + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;        // Key, KeyEventArgs, MouseEventArgs
using System.Windows.Threading;

namespace P10Step3
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private double ballX = 234, ballY = 200;
        private double vx = 3, vy = -4;

        private double paddleX = 200;              // 패들의 왼쪽 x (y 는 330 고정)
        private const double PaddleSpeed = 7;      // 한 프레임에 움직이는 거리
        private bool leftDown, rightDown;          // 지금 ← / → 키가 눌려 있나?

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            // 키를 누른 채 다른 창을 누르면 KeyUp 이 오지 않는다 → 창이 비활성화되면 모두 뗀 것으로
            Deactivated += (s, e) => { leftDown = false; rightDown = false; };
        }

        // 키 처리기는 “눌렸다 / 떼었다” 를 기록만 한다. 실제 이동은 게임 루프에서.
        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = true;
            if (e.Key == Key.Right) rightDown = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = false;
            if (e.Key == Key.Right) rightDown = false;
        }

        // 마우스: 게임 판 기준 x 좌표에 패들 가운데를 맞춘다
        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        private void GameLoop(object sender, EventArgs e)
        {
            // ① 입력 반영 → 패들 이동 (판 밖으로 못 나가게 Clamp)
            if (leftDown) paddleX -= PaddleSpeed;
            if (rightDown) paddleX += PaddleSpeed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);

            // ② 공 이동 · 벽 반사 (단계 2 와 같음)
            ballX += vx;
            ballY += vy;
            if (ballX < 0) { ballX = 0; vx = -vx; }
            if (ballX + ball.Width > field.Width) { ballX = field.Width - ball.Width; vx = -vx; }
            if (ballY < 0) { ballY = 0; vy = -vy; }
            if (ballY + ball.Height > field.Height) { ballY = field.Height - ball.Height; vy = -vy; }

            // ③ 그리기
            Canvas.SetLeft(paddle, paddleX);
            Canvas.SetLeft(ball, ballX);
            Canvas.SetTop(ball, ballY);
            lblScore.Text = $"← {(leftDown ? "ON" : "off")}  → {(rightDown ? "ON" : "off")}";
        }
    }
}`;

  const STEP4 = fieldXaml({
    ns: 'P10Step4', title: '벽돌 깨기 — 단계 4: 패들 충돌',
    win: 'KeyDown="Window_KeyDown" KeyUp="Window_KeyUp"', canvas: 'MouseMove="Field_MouseMove"',
    msg: '패들로 공을 받아 보세요 — 맞은 위치에 따라 각도가 바뀝니다'
  }) + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

namespace P10Step4
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private const double BallSpeed = 5;        // 공의 빠르기 = 속도 벡터의 길이
        private const double PaddleSpeed = 7;
        private const double PaddleY = 330;        // XAML 의 Canvas.Top 과 같게

        private double ballX, ballY, vx, vy;
        private double paddleX = 200;
        private bool leftDown, rightDown;
        private int lives = 3;

        public MainWindow()
        {
            InitializeComponent();
            ResetBall();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            Deactivated += (s, e) => { leftDown = false; rightDown = false; };
        }

        // 공을 패들 위에 올려놓고 오른쪽 위(20도)로 발사
        private void ResetBall()
        {
            ballX = paddleX + paddle.Width / 2 - ball.Width / 2;
            ballY = PaddleY - ball.Height - 1;
            SetVelocity(20);
        }

        // 각도(도 단위, 0 = 똑바로 위, + = 오른쪽) → 속도 벡터. 길이는 늘 BallSpeed
        private void SetVelocity(double degrees)
        {
            double rad = degrees * Math.PI / 180;
            vx = BallSpeed * Math.Sin(rad);
            vy = -BallSpeed * Math.Cos(rad);        // 화면 y 는 아래가 + 라서 위로 가려면 -
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = true;
            if (e.Key == Key.Right) rightDown = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = false;
            if (e.Key == Key.Right) rightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        private void GameLoop(object sender, EventArgs e)
        {
            // ① 패들 이동
            if (leftDown) paddleX -= PaddleSpeed;
            if (rightDown) paddleX += PaddleSpeed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);

            // ② 공 이동
            ballX += vx;
            ballY += vy;

            // ③ 옆 벽 · 천장 (바닥은 이제 뚫려 있다)
            if (ballX < 0) { ballX = 0; vx = -vx; }
            if (ballX + ball.Width > field.Width) { ballX = field.Width - ball.Width; vx = -vx; }
            if (ballY < 0) { ballY = 0; vy = -vy; }

            // ④ 패들: 내려오던 공(vy > 0)이 패들과 겹치면 튕긴다 — 맞은 위치로 각도 결정
            Rect ballRect = new Rect(ballX, ballY, ball.Width, ball.Height);
            Rect paddleRect = new Rect(paddleX, PaddleY, paddle.Width, paddle.Height);
            if (vy > 0 && ballRect.IntersectsWith(paddleRect))
            {
                ballY = PaddleY - ball.Height;                                        // 패들 위로 꺼내기
                double hit = (ballX + ball.Width / 2 - paddleX) / paddle.Width * 2 - 1;  // -1 ~ +1
                SetVelocity(Math.Clamp(hit, -1, 1) * 60);                             // 최대 ±60도
            }

            // ⑤ 바닥으로 빠짐 → 생명 감소
            if (ballY > field.Height)
            {
                lives--;
                lblLives.Text = "생명 " + new string('♥', lives);
                if (lives == 0)
                {
                    timer.Stop();
                    lblMessage.Text = "게임 오버";
                    return;
                }
                ResetBall();
            }

            // ⑥ 그리기
            Canvas.SetLeft(paddle, paddleX);
            Canvas.SetLeft(ball, ballX);
            Canvas.SetTop(ball, ballY);
        }
    }
}`;

  // 슬라이드용 짧은 WPF 코드 (30줄 이내): 파일 범위 네임스페이스(namespace X;)로 줄 수를 줄였다
  const SLIDE_LOOP = `// ===== File: MainWindow.xaml =====
<Window x:Class="P10SlideLoop.MainWindow" Title="게임 루프" Width="360" Height="280"
        ${NS}>
    <Canvas Width="320" Height="220" Background="#10101C">
        <Ellipse x:Name="ball" Width="14" Height="14" Fill="White"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
namespace P10SlideLoop;
public partial class MainWindow : Window
{
    double x = 20, y = 20, vx = 3, vy = 2;
    readonly DispatcherTimer timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(16) };
    public MainWindow()
    {
        InitializeComponent();
        timer.Tick += (s, e) =>
        {
            x += vx; y += vy;                                   // ① 이동
            if (x < 0 || x > 320 - 14) vx = -vx;                // ② 충돌
            if (y < 0 || y > 220 - 14) vy = -vy;
            Canvas.SetLeft(ball, x); Canvas.SetTop(ball, y);    // ③ 그리기
        };
        timer.Start(); Closed += (s, e) => timer.Stop();
    }
}`;

  const SLIDE_KEYS = `// ===== File: MainWindow.xaml =====
<Window x:Class="P10SlideKeys.MainWindow" Title="플래그로 패들 움직이기" Width="360" Height="170"
        ${NS} KeyDown="OnKey" KeyUp="OnKey">
    <Canvas Width="320" Height="100" Background="#10101C">
        <Rectangle x:Name="paddle" Width="80" Height="12" Fill="DeepSkyBlue" Canvas.Top="70"/>
    </Canvas>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;
namespace P10SlideKeys;
public partial class MainWindow : Window
{
    bool left, right; double x = 120;
    readonly DispatcherTimer timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(16) };
    public MainWindow()
    {
        InitializeComponent();
        timer.Tick += (s, e) => { x = Math.Clamp(x + (right ? 7 : 0) - (left ? 7 : 0), 0, 240); Canvas.SetLeft(paddle, x); };
        timer.Start(); Closed += (s, e) => timer.Stop();
    }
    void OnKey(object sender, KeyEventArgs e)      // KeyDown · KeyUp 공용
    {
        if (e.Key == Key.Left) left = e.IsDown;     // 누르면 true, 떼면 false
        if (e.Key == Key.Right) right = e.IsDown;
    }
}`;

  const P3_XAML = (ns) => fieldXaml({
    ns, title: '실습 P10-3. 패들 조작 다듬기',
    win: 'KeyDown="Window_KeyDown" KeyUp="Window_KeyUp"', canvas: 'MouseMove="Field_MouseMove"',
    msg: '← → 또는 A · D, Shift 를 함께 누르면 빠르게'
  });
  const P3_STARTER = P3_XAML('P10Practice3') + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

namespace P10Practice3
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private const double BaseSpeed = 6;        // 기본 패들 속도
        private double paddleX = 200;
        private bool leftDown, rightDown;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            // TODO 3: 창이 비활성화(Deactivated)되면 두 플래그를 false 로
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            // TODO 1: A 키도 ← 처럼, D 키도 → 처럼 동작하게
            if (e.Key == Key.Left) leftDown = true;
            if (e.Key == Key.Right) rightDown = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = false;
            if (e.Key == Key.Right) rightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        private void GameLoop(object sender, EventArgs e)
        {
            // TODO 2: Shift(왼쪽 또는 오른쪽)가 눌려 있으면 속도 2배
            //         → Keyboard.IsKeyDown(Key.LeftShift) 로 “지금” 눌려 있는지 물어볼 수 있다
            double speed = BaseSpeed;
            if (leftDown) paddleX -= speed;
            if (rightDown) paddleX += speed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);
            Canvas.SetLeft(paddle, paddleX);
            lblScore.Text = $"속도 {speed}";
        }
    }
}`;
  const P3_SOLUTION = P3_XAML('P10Practice3S') + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;

namespace P10Practice3S
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private const double BaseSpeed = 6;
        private double paddleX = 200;
        private bool leftDown, rightDown;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            Deactivated += (s, e) => { leftDown = false; rightDown = false; };
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left || e.Key == Key.A) leftDown = true;
            if (e.Key == Key.Right || e.Key == Key.D) rightDown = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left || e.Key == Key.A) leftDown = false;
            if (e.Key == Key.Right || e.Key == Key.D) rightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        private void GameLoop(object sender, EventArgs e)
        {
            bool fast = Keyboard.IsKeyDown(Key.LeftShift) || Keyboard.IsKeyDown(Key.RightShift);
            double speed = fast ? BaseSpeed * 2 : BaseSpeed;
            if (leftDown) paddleX -= speed;
            if (rightDown) paddleX += speed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);
            Canvas.SetLeft(paddle, paddleX);
            lblScore.Text = $"속도 {speed}" + (fast ? " (Shift)" : "");
        }
    }
}`;

  const P4_STARTER = rep(STEP4, [
    ['P10Step4', 'P10Practice4'],
    ['벽돌 깨기 — 단계 4: 패들 충돌', '실습 P10-4. 랠리와 가속'],
    ['private const double BallSpeed = 5;        // 공의 빠르기 = 속도 벡터의 길이', 'private double ballSpeed = 4;              // 공의 빠르기 (이제 바뀔 수 있으므로 변수)'],
    ['vx = BallSpeed * Math.Sin(rad);', 'vx = ballSpeed * Math.Sin(rad);'],
    ['vy = -BallSpeed * Math.Cos(rad);', 'vy = -ballSpeed * Math.Cos(rad);'],
    ['                SetVelocity(Math.Clamp(hit, -1, 1) * 60);                             // 최대 ±60도\n',
     '                // TODO 1: 랠리(연속으로 받아 낸 횟수)를 1 늘리고, 5번마다 ballSpeed 를 1 올린다 (최대 9)\n                // TODO 2: lblScore 에 "랠리 n · 속도 s" 표시\n                SetVelocity(Math.Clamp(hit, -1, 1) * 60);                             // 최대 ±60도\n'],
    ['                lives--;\n', '                lives--;\n                // TODO 3: 놓치면 랠리 0, 속도 4 로 되돌린다\n']
  ]);
  const P4_SOLUTION = rep(STEP4, [
    ['P10Step4', 'P10Practice4S'],
    ['벽돌 깨기 — 단계 4: 패들 충돌', '실습 P10-4. 랠리와 가속'],
    ['private const double BallSpeed = 5;        // 공의 빠르기 = 속도 벡터의 길이', 'private double ballSpeed = 4;              // 공의 빠르기 (바뀔 수 있으므로 변수)\n        private int rally = 0;                     // 연속으로 받아 낸 횟수'],
    ['vx = BallSpeed * Math.Sin(rad);', 'vx = ballSpeed * Math.Sin(rad);'],
    ['vy = -BallSpeed * Math.Cos(rad);', 'vy = -ballSpeed * Math.Cos(rad);'],
    ['                SetVelocity(Math.Clamp(hit, -1, 1) * 60);                             // 최대 ±60도\n',
     '                rally++;\n                if (rally % 5 == 0 && ballSpeed < 9) ballSpeed += 1;               // 5번마다 가속\n                lblScore.Text = $"랠리 {rally} · 속도 {ballSpeed}";\n                SetVelocity(Math.Clamp(hit, -1, 1) * 60);                             // 최대 ±60도\n'],
    ['                lives--;\n', '                lives--;\n                rally = 0;\n                ballSpeed = 4;\n                lblScore.Text = "랠리 0 · 속도 4";\n']
  ]);

  /* ======================================================================
   * 3교시 코드 — 벽돌 · 점수 · 상태 · 레벨
   * ====================================================================== */
  const STEP5 = fieldXaml({
    ns: 'P10Step5', title: '벽돌 깨기 — 단계 5: 벽돌 배치',
    canvas: 'MouseLeftButtonDown="Field_MouseLeftButtonDown"', msg: ''
  }) + `using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;        // Brush, Brushes
using System.Windows.Shapes;       // Rectangle

namespace P10Step5
{
    public partial class MainWindow : Window
    {
        private const int Rows = 5, Cols = 8;                      // 5줄 × 8칸 = 40개
        private const double BrickW = 54, BrickH = 18, Gap = 4;
        private const double OffsetX = 10, OffsetY = 40;           // 첫 벽돌의 왼쪽 위
        private readonly Brush[] rowColors =
            { Brushes.Crimson, Brushes.DarkOrange, Brushes.Gold, Brushes.LimeGreen, Brushes.DodgerBlue };
        private readonly Rectangle?[,] bricks = new Rectangle?[Rows, Cols];   // [줄, 칸], 깨진 자리는 null
        private int remaining = 0;

        public MainWindow()
        {
            InitializeComponent();
            CreateBricks();
        }

        private void CreateBricks()
        {
            for (int row = 0; row < Rows; row++)
            {
                for (int col = 0; col < Cols; col++)
                {
                    var brick = new Rectangle
                    {
                        Width = BrickW, Height = BrickH,
                        Fill = rowColors[row],                     // 줄마다 다른 색
                        Stroke = Brushes.Black, StrokeThickness = 1,
                        RadiusX = 3, RadiusY = 3,
                        Tag = (Rows - row) * 10                    // 점수: 윗줄일수록 높다 (50 … 10)
                    };
                    Canvas.SetLeft(brick, OffsetX + col * (BrickW + Gap));
                    Canvas.SetTop(brick, OffsetY + row * (BrickH + Gap));
                    field.Children.Add(brick);                     // 화면(Canvas)에 추가
                    bricks[row, col] = brick;                      // 배열에도 기억
                    remaining++;
                }
            }
            lblMessage.Text = $"벽돌 {remaining}개 — 벽돌을 클릭해 보세요";
        }

        // 클릭한 도형이 벽돌이면 배열에서 찾아 지운다
        private void Field_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.OriginalSource is not Rectangle clicked || clicked == paddle) return;

            for (int row = 0; row < Rows; row++)
            {
                for (int col = 0; col < Cols; col++)
                {
                    if (bricks[row, col] != clicked) continue;
                    field.Children.Remove(clicked);                // 화면에서 제거
                    bricks[row, col] = null;                       // 배열에서도 제거
                    remaining--;
                    lblScore.Text = $"[{row}, {col}] +{clicked.Tag}점";
                    lblMessage.Text = $"남은 벽돌 {remaining}개";
                    return;
                }
            }
        }
    }
}`;

  const STEP6 = fieldXaml({
    ns: 'P10Step6', title: '벽돌 깨기 — 단계 6: 벽돌 충돌과 점수',
    win: 'KeyDown="Window_KeyDown" KeyUp="Window_KeyUp"', canvas: 'MouseMove="Field_MouseMove"', msg: ''
  }) + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace P10Step6
{
    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private const double BallSpeed = 4.5, PaddleSpeed = 7, PaddleY = 330;
        private const int Rows = 5, Cols = 8;
        private const double BrickW = 54, BrickH = 18, Gap = 4, OffsetX = 10, OffsetY = 40;
        private readonly Brush[] rowColors =
            { Brushes.Crimson, Brushes.DarkOrange, Brushes.Gold, Brushes.LimeGreen, Brushes.DodgerBlue };
        private readonly Rectangle?[,] bricks = new Rectangle?[Rows, Cols];

        private double ballX, ballY, vx, vy;
        private double paddleX = 200;
        private bool leftDown, rightDown;
        private int lives = 3, score = 0, remaining = 0;

        public MainWindow()
        {
            InitializeComponent();
            CreateBricks();
            ResetBall();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();
            Closed += (s, e) => timer.Stop();
            Deactivated += (s, e) => { leftDown = false; rightDown = false; };
        }

        private void CreateBricks()
        {
            for (int row = 0; row < Rows; row++)
                for (int col = 0; col < Cols; col++)
                {
                    var brick = new Rectangle
                    {
                        Width = BrickW, Height = BrickH, Fill = rowColors[row],
                        Stroke = Brushes.Black, StrokeThickness = 1, RadiusX = 3, RadiusY = 3
                    };
                    Canvas.SetLeft(brick, OffsetX + col * (BrickW + Gap));
                    Canvas.SetTop(brick, OffsetY + row * (BrickH + Gap));
                    field.Children.Add(brick);
                    bricks[row, col] = brick;
                    remaining++;
                }
        }

        private void ResetBall()
        {
            ballX = paddleX + paddle.Width / 2 - ball.Width / 2;
            ballY = PaddleY - ball.Height - 1;
            SetVelocity(20);
        }

        private void SetVelocity(double degrees)
        {
            double rad = degrees * Math.PI / 180;
            vx = BallSpeed * Math.Sin(rad);
            vy = -BallSpeed * Math.Cos(rad);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = true;
            if (e.Key == Key.Right) rightDown = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = false;
            if (e.Key == Key.Right) rightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        private void GameLoop(object sender, EventArgs e)
        {
            if (leftDown) paddleX -= PaddleSpeed;
            if (rightDown) paddleX += PaddleSpeed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);

            ballX += vx;
            ballY += vy;
            if (ballX < 0) { ballX = 0; vx = -vx; }
            if (ballX + ball.Width > field.Width) { ballX = field.Width - ball.Width; vx = -vx; }
            if (ballY < 0) { ballY = 0; vy = -vy; }

            Rect ballRect = new Rect(ballX, ballY, ball.Width, ball.Height);
            Rect paddleRect = new Rect(paddleX, PaddleY, paddle.Width, paddle.Height);
            if (vy > 0 && ballRect.IntersectsWith(paddleRect))
            {
                ballY = PaddleY - ball.Height;
                double hit = (ballX + ball.Width / 2 - paddleX) / paddle.Width * 2 - 1;
                SetVelocity(Math.Clamp(hit, -1, 1) * 60);
            }

            HitBrick();                                     // 새로 추가: 벽돌 충돌
            if (remaining == 0)
            {
                timer.Stop();
                lblMessage.Text = $"클리어! 점수 {score}";
            }

            if (ballY > field.Height)
            {
                lives--;
                lblLives.Text = "생명 " + new string('♥', lives);
                if (lives == 0)
                {
                    timer.Stop();
                    lblMessage.Text = $"게임 오버 — 점수 {score}";
                    return;
                }
                ResetBall();
            }

            Canvas.SetLeft(paddle, paddleX);
            Canvas.SetLeft(ball, ballX);
            Canvas.SetTop(ball, ballY);
        }

        // 공과 겹친 벽돌을 하나 찾아 깨고, 부딪힌 면에 맞게 튕긴다
        private void HitBrick()
        {
            Rect b = new Rect(ballX, ballY, ball.Width, ball.Height);
            for (int row = 0; row < Rows; row++)
            {
                for (int col = 0; col < Cols; col++)
                {
                    Rectangle? brick = bricks[row, col];
                    if (brick == null) continue;                   // 이미 깨진 자리
                    Rect r = new Rect(Canvas.GetLeft(brick), Canvas.GetTop(brick), brick.Width, brick.Height);
                    if (!b.IntersectsWith(r)) continue;

                    // 겹친 폭이 좁으면 옆면 → vx 반전, 아니면 윗면 · 아랫면 → vy 반전
                    double overlapX = Math.Min(b.Right, r.Right) - Math.Max(b.Left, r.Left);
                    double overlapY = Math.Min(b.Bottom, r.Bottom) - Math.Max(b.Top, r.Top);
                    if (overlapX < overlapY) vx = -vx; else vy = -vy;

                    field.Children.Remove(brick);
                    bricks[row, col] = null;
                    remaining--;
                    score += (Rows - row) * 10;                    // 윗줄 50점 … 아랫줄 10점
                    lblScore.Text = $"점수 {score}";
                    return;                                        // 한 프레임에 벽돌 하나만
                }
            }
        }
    }
}`;

  const STATE_CONSOLE = `using System;

enum GameState { Ready, Playing, Paused, GameOver, Cleared }

class Program
{
    // 스페이스바를 눌렀을 때의 다음 상태
    static GameState OnSpace(GameState s) => s switch
    {
        GameState.Ready   => GameState.Playing,     // 발사
        GameState.Playing => GameState.Paused,      // 일시정지
        GameState.Paused  => GameState.Playing,     // 계속
        _                 => GameState.Ready        // 게임 오버 · 클리어 → 새 게임
    };

    // 공을 놓쳤을 때: 생명이 남았으면 준비, 없으면 게임 오버
    static GameState OnMiss(int livesLeft) => livesLeft > 0 ? GameState.Ready : GameState.GameOver;

    static void Main()
    {
        GameState state = GameState.Ready;
        int lives = 2;
        string[] events = { "Space", "Space", "Space", "Miss", "Space", "Miss", "Space" };

        foreach (string ev in events)
        {
            GameState before = state;
            if (ev == "Space") state = OnSpace(state);
            else { lives--; state = OnMiss(lives); }
            Console.WriteLine($"{before,-8} --{ev,-5}--> {state}");
        }
    }
}
`;

  const STEP7 = fieldXaml({
    ns: 'P10Step7', title: '벽돌 깨기 — 단계 7: 게임 상태', level: '레벨 1 · 준비',
    win: 'KeyDown="Window_KeyDown" KeyUp="Window_KeyUp"', canvas: 'MouseMove="Field_MouseMove"', msg: ''
  }) + `using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace P10Step7
{
    // 게임의 상태 — 같은 스페이스바도 상태에 따라 하는 일이 다르다
    public enum GameState { Ready, Playing, Paused, GameOver, Cleared }

    public partial class MainWindow : Window
    {
        private readonly DispatcherTimer timer = new DispatcherTimer();
        private const double BallSpeed = 4.5, PaddleSpeed = 7, PaddleY = 330;
        private const int Rows = 5, Cols = 8;
        private const double BrickW = 54, BrickH = 18, Gap = 4, OffsetX = 10, OffsetY = 40;
        private readonly Brush[] rowColors =
            { Brushes.Crimson, Brushes.DarkOrange, Brushes.Gold, Brushes.LimeGreen, Brushes.DodgerBlue };
        private readonly Rectangle?[,] bricks = new Rectangle?[Rows, Cols];

        private GameState state = GameState.Ready;
        private double ballX, ballY, vx, vy;
        private double paddleX = 200;
        private bool leftDown, rightDown;
        private int lives, score, remaining;

        public MainWindow()
        {
            InitializeComponent();
            NewGame();
            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += GameLoop;
            timer.Start();                     // 타이머는 계속 돈다 — 무엇을 할지는 상태가 정한다
            Closed += (s, e) => timer.Stop();
            Deactivated += (s, e) => { leftDown = false; rightDown = false; };
        }

        // ---------------- 게임 준비 ----------------
        private void NewGame()
        {
            score = 0;
            lives = 3;
            CreateBricks();
            SetState(GameState.Ready);
        }

        private void CreateBricks()
        {
            foreach (Rectangle? old in bricks)            // 2차원 배열도 foreach 로 모든 칸을 돈다
                if (old != null) field.Children.Remove(old);
            remaining = 0;
            for (int row = 0; row < Rows; row++)
                for (int col = 0; col < Cols; col++)
                {
                    var brick = new Rectangle
                    {
                        Width = BrickW, Height = BrickH, Fill = rowColors[row],
                        Stroke = Brushes.Black, StrokeThickness = 1, RadiusX = 3, RadiusY = 3
                    };
                    Canvas.SetLeft(brick, OffsetX + col * (BrickW + Gap));
                    Canvas.SetTop(brick, OffsetY + row * (BrickH + Gap));
                    field.Children.Add(brick);
                    bricks[row, col] = brick;
                    remaining++;
                }
        }

        // ---------------- 상태 ----------------
        private void SetState(GameState newState)
        {
            state = newState;
            if (state == GameState.Ready) StickBallToPaddle();
            lblMessage.Text = state switch
            {
                GameState.Ready    => "스페이스바를 누르면 시작합니다",
                GameState.Paused   => "일시정지 — 스페이스바로 계속",
                GameState.GameOver => $"게임 오버! 점수 {score} — 스페이스바로 새 게임",
                GameState.Cleared  => $"클리어! 점수 {score} — 스페이스바로 새 게임",
                _                  => ""                  // 진행 중에는 안내 글 없음
            };
            UpdateHud();
            Draw();
        }

        private static string StateName(GameState s) => s switch
        {
            GameState.Ready    => "준비",
            GameState.Playing  => "진행",
            GameState.Paused   => "일시정지",
            GameState.GameOver => "게임 오버",
            _                  => "클리어"
        };

        private void UpdateHud()
        {
            lblScore.Text = $"점수 {score}";
            lblLevel.Text = $"레벨 1 · {StateName(state)}";
            lblLives.Text = "생명 " + new string('♥', lives);
        }

        // ---------------- 입력 ----------------
        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = true;
            else if (e.Key == Key.Right) rightDown = true;
            else if (e.Key == Key.Space && !e.IsRepeat)   // 꾹 누를 때의 자동 반복은 무시
            {
                switch (state)
                {
                    case GameState.Ready:   SetVelocity(20); SetState(GameState.Playing); break;
                    case GameState.Playing: SetState(GameState.Paused); break;
                    case GameState.Paused:  SetState(GameState.Playing); break;
                    default:                NewGame(); break;          // 게임 오버 · 클리어 → 새 게임
                }
            }
            else return;
            e.Handled = true;                              // 이 키는 게임이 처리했다
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) leftDown = false;
            if (e.Key == Key.Right) rightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            if (state == GameState.Ready || state == GameState.Playing)
                paddleX = e.GetPosition(field).X - paddle.Width / 2;
        }

        // ---------------- 게임 루프 ----------------
        private void GameLoop(object sender, EventArgs e)
        {
            if (state != GameState.Ready && state != GameState.Playing) return;   // 일시정지 · 끝: 멈춤

            if (leftDown) paddleX -= PaddleSpeed;
            if (rightDown) paddleX += PaddleSpeed;
            paddleX = Math.Clamp(paddleX, 0, field.Width - paddle.Width);

            if (state == GameState.Ready) StickBallToPaddle();   // 준비: 공이 패들을 따라다닌다
            else UpdateBall();
            Draw();
        }

        private void UpdateBall()
        {
            ballX += vx;
            ballY += vy;
            if (ballX < 0) { ballX = 0; vx = -vx; }
            if (ballX + ball.Width > field.Width) { ballX = field.Width - ball.Width; vx = -vx; }
            if (ballY < 0) { ballY = 0; vy = -vy; }

            Rect ballRect = new Rect(ballX, ballY, ball.Width, ball.Height);
            Rect paddleRect = new Rect(paddleX, PaddleY, paddle.Width, paddle.Height);
            if (vy > 0 && ballRect.IntersectsWith(paddleRect))
            {
                ballY = PaddleY - ball.Height;
                double hit = (ballX + ball.Width / 2 - paddleX) / paddle.Width * 2 - 1;
                SetVelocity(Math.Clamp(hit, -1, 1) * 60);
            }

            HitBrick();
            if (remaining == 0) { SetState(GameState.Cleared); return; }

            if (ballY > field.Height)                          // 놓침
            {
                lives--;
                SetState(lives > 0 ? GameState.Ready : GameState.GameOver);
            }
        }

        private void HitBrick()
        {
            Rect b = new Rect(ballX, ballY, ball.Width, ball.Height);
            for (int row = 0; row < Rows; row++)
                for (int col = 0; col < Cols; col++)
                {
                    Rectangle? brick = bricks[row, col];
                    if (brick == null) continue;
                    Rect r = new Rect(Canvas.GetLeft(brick), Canvas.GetTop(brick), brick.Width, brick.Height);
                    if (!b.IntersectsWith(r)) continue;

                    double overlapX = Math.Min(b.Right, r.Right) - Math.Max(b.Left, r.Left);
                    double overlapY = Math.Min(b.Bottom, r.Bottom) - Math.Max(b.Top, r.Top);
                    if (overlapX < overlapY) vx = -vx; else vy = -vy;

                    field.Children.Remove(brick);
                    bricks[row, col] = null;
                    remaining--;
                    score += (Rows - row) * 10;
                    UpdateHud();
                    return;
                }
        }

        // ---------------- 도우미 ----------------
        private void StickBallToPaddle()
        {
            ballX = paddleX + paddle.Width / 2 - ball.Width / 2;
            ballY = PaddleY - ball.Height - 1;
        }

        private void SetVelocity(double degrees)
        {
            double rad = degrees * Math.PI / 180;
            vx = BallSpeed * Math.Sin(rad);
            vy = -BallSpeed * Math.Cos(rad);
        }

        private void Draw()
        {
            Canvas.SetLeft(paddle, paddleX);
            Canvas.SetLeft(ball, ballX);
            Canvas.SetTop(ball, ballY);
        }
    }
}`;

  const STEP8 = rep(STEP7, [
    ['P10Step7', 'P10Step8'],
    ['벽돌 깨기 — 단계 7: 게임 상태', '벽돌 깨기 — 단계 8: 레벨 2'],
    ['private const double BallSpeed = 4.5, PaddleSpeed = 7, PaddleY = 330;', 'private const double PaddleSpeed = 7, PaddleY = 330;'],
    ['        private int lives, score, remaining;\n', `        private int lives, score, remaining;
        private int level;                         // 지금 레벨 (1 또는 2)
        private double ballSpeed;                  // 레벨마다 다른 공 속도
`],
    ['            score = 0;\n            lives = 3;\n', `            score = 0;
            lives = 3;
            level = 1;
            ballSpeed = 4.5;
`],
    ['GameState.Ready    => "스페이스바를 누르면 시작합니다",', `GameState.Ready    => level == 1 ? "스페이스바를 누르면 시작합니다"
                                              : "레벨 2 — 공이 빨라집니다! 스페이스바로 시작",`],
    ['$"클리어! 점수 {score} — 스페이스바로 새 게임"', '$"모두 클리어! 점수 {score} — 스페이스바로 새 게임"'],
    ['$"레벨 1 · {StateName(state)}"', '$"레벨 {level} · {StateName(state)}"'],
    ['            if (remaining == 0) { SetState(GameState.Cleared); return; }\n', `            if (remaining == 0)                                // 이 레벨의 벽돌을 모두 깼다
            {
                if (level == 1)
                {
                    level = 2;
                    ballSpeed = 6;                             // 레벨 2: 공이 더 빠르다
                    CreateBricks();                            // 벽돌 다시 채우기
                    SetState(GameState.Ready);
                }
                else SetState(GameState.Cleared);              // 마지막 레벨까지 끝
                return;
            }
`],
    ['vx = BallSpeed * Math.Sin(rad);', 'vx = ballSpeed * Math.Sin(rad);'],
    ['vy = -BallSpeed * Math.Cos(rad);', 'vy = -ballSpeed * Math.Cos(rad);']
  ]);

  const SLIDE_BRICKS = `// ===== File: MainWindow.xaml =====
<Window x:Class="P10SlideBricks.MainWindow" Title="벽돌 배치" Width="520" Height="240"
        ${NS}>
    <Canvas x:Name="field" Width="480" Height="170" Background="#10101C"/>
</Window>
// ===== File: MainWindow.xaml.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
namespace P10SlideBricks;
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        Brush[] colors = { Brushes.Crimson, Brushes.DarkOrange, Brushes.Gold, Brushes.LimeGreen, Brushes.DodgerBlue };
        var bricks = new Rectangle[5, 8];                        // [줄, 칸]
        for (int row = 0; row < 5; row++)
            for (int col = 0; col < 8; col++)
            {
                var r = new Rectangle { Width = 54, Height = 18, Fill = colors[row], RadiusX = 3, RadiusY = 3 };
                Canvas.SetLeft(r, 10 + col * 58);                // 54 + 간격 4
                Canvas.SetTop(r, 20 + row * 22);                 // 18 + 간격 4
                field.Children.Add(r);
                bricks[row, col] = r;
            }
    }
}`;

  const STATE_SLIDE = `using System;

enum GameState { Ready, Playing, Paused, GameOver, Cleared }

class Program
{
    static GameState OnSpace(GameState s) => s switch
    {
        GameState.Ready   => GameState.Playing,
        GameState.Playing => GameState.Paused,
        GameState.Paused  => GameState.Playing,
        _                 => GameState.Ready
    };

    static void Main()
    {
        GameState state = GameState.Ready;
        for (int i = 0; i < 4; i++)
        {
            GameState next = OnSpace(state);
            Console.WriteLine($"{state} --Space--> {next}");
            state = next;
        }
        Console.WriteLine($"GameOver --Space--> {OnSpace(GameState.GameOver)}");
    }
}
`;

  const P5_STARTER = rep(STEP7, [
    ['P10Step7', 'P10Practice5'],
    ['벽돌 깨기 — 단계 7: 게임 상태', '실습 P10-5. 단축키와 남은 벽돌'],
    ['            else return;\n            e.Handled = true;', `            // TODO 1: P 키 — 진행 중이면 일시정지, 일시정지 중이면 계속 (다른 상태에서는 아무 일 없음)
            // TODO 2: Esc 키 — 언제든 새 게임
            else return;
            e.Handled = true;`],
    ['            lblScore.Text = $"점수 {score}";\n', '            lblScore.Text = $"점수 {score}";          // TODO 3: 남은 벽돌 수도 함께 표시 (예: 점수 30 · 벽돌 38)\n']
  ]);
  const P5_SOLUTION = rep(STEP7, [
    ['P10Step7', 'P10Practice5S'],
    ['벽돌 깨기 — 단계 7: 게임 상태', '실습 P10-5. 단축키와 남은 벽돌'],
    ['            else return;\n            e.Handled = true;', `            else if (e.Key == Key.P && !e.IsRepeat)
            {
                if (state == GameState.Playing) SetState(GameState.Paused);
                else if (state == GameState.Paused) SetState(GameState.Playing);
            }
            else if (e.Key == Key.Escape) NewGame();
            else return;
            e.Handled = true;`],
    ['            lblScore.Text = $"점수 {score}";\n', '            lblScore.Text = $"점수 {score} · 벽돌 {remaining}";\n']
  ]);

  const P6_STARTER = `using System;

enum GameState { Ready, Playing, Paused, GameOver, Cleared }

class Program
{
    static GameState OnSpace(GameState s) => s switch
    {
        GameState.Ready   => GameState.Playing,
        GameState.Playing => GameState.Paused,
        GameState.Paused  => GameState.Playing,
        _                 => GameState.Ready
    };

    // TODO 1: 벽돌을 모두 깼을 때 — 레벨 1 이면 Ready(다음 레벨 준비), 레벨 2 이면 Cleared
    static GameState OnAllBricks(int level) => GameState.Playing;

    // TODO 2: 상태의 한글 이름 — 준비 · 진행 · 일시정지 · 게임 오버 · 클리어
    static string KoreanName(GameState s) => s.ToString();

    static void Main()
    {
        GameState state = GameState.Ready;
        int level = 1;
        string[] events = { "Space", "AllBricks", "Space", "Space", "Space", "AllBricks", "Space" };
        foreach (string ev in events)
        {
            GameState before = state;
            if (ev == "Space") state = OnSpace(state);
            else
            {
                state = OnAllBricks(level);
                if (level == 1) level = 2;
            }
            Console.WriteLine($"[레벨 {level}] {KoreanName(before)} → {KoreanName(state)}  ({ev})");
        }
    }
}
`;
  const P6_SOLUTION = `using System;

enum GameState { Ready, Playing, Paused, GameOver, Cleared }

class Program
{
    static GameState OnSpace(GameState s) => s switch
    {
        GameState.Ready   => GameState.Playing,
        GameState.Playing => GameState.Paused,
        GameState.Paused  => GameState.Playing,
        _                 => GameState.Ready
    };

    static GameState OnAllBricks(int level) => level == 1 ? GameState.Ready : GameState.Cleared;

    static string KoreanName(GameState s) => s switch
    {
        GameState.Ready    => "준비",
        GameState.Playing  => "진행",
        GameState.Paused   => "일시정지",
        GameState.GameOver => "게임 오버",
        _                  => "클리어"
    };

    static void Main()
    {
        GameState state = GameState.Ready;
        int level = 1;
        string[] events = { "Space", "AllBricks", "Space", "Space", "Space", "AllBricks", "Space" };
        foreach (string ev in events)
        {
            GameState before = state;
            if (ev == "Space") state = OnSpace(state);
            else
            {
                state = OnAllBricks(level);
                if (level == 1) level = 2;
            }
            Console.WriteLine($"[레벨 {level}] {KoreanName(before)} → {KoreanName(state)}  ({ev})");
        }
    }
}
`;

  /* ======================================================================
   * 4교시 코드 — 클래스로 정리한 완성 프로그램
   * ====================================================================== */
  const F_XAML = `// ===== File: MainWindow.xaml =====
<Window x:Class="P10Final.MainWindow"
        ${NS}
        Title="벽돌 깨기" Width="520" Height="460" ResizeMode="NoResize"
        Background="#1E1E2E" KeyDown="Window_KeyDown" KeyUp="Window_KeyUp">
    <DockPanel Margin="10,4,10,10">
        <Grid DockPanel.Dock="Top" Height="30">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <TextBlock x:Name="lblScore" Grid.Column="0" Foreground="White" FontSize="16" VerticalAlignment="Center"/>
            <TextBlock x:Name="lblLevel" Grid.Column="1" Foreground="LightGray" FontSize="16"
                       VerticalAlignment="Center" TextAlignment="Center"/>
            <TextBlock x:Name="lblLives" Grid.Column="2" Foreground="Tomato" FontSize="16"
                       VerticalAlignment="Center" TextAlignment="Right"/>
        </Grid>
        <!-- 패들 · 공 · 벽돌은 Game 이 코드로 만들어 넣는다 -->
        <Canvas x:Name="field" Width="480" Height="360" Background="#10101C" ClipToBounds="True"
                MouseMove="Field_MouseMove">
            <TextBlock x:Name="lblMessage" Canvas.Left="0" Canvas.Top="230" Width="480" TextAlignment="Center"
                       Foreground="Gold" FontSize="18"/>
        </Canvas>
    </DockPanel>
</Window>`;

  const F_MAIN = `// ===== File: MainWindow.xaml.cs =====
using System;
using System.Windows;
using System.Windows.Input;
using System.Windows.Threading;

namespace P10Final
{
    // 화면(View) 담당: 입력을 Game 에 전달하고, Game 이 알려 주면 HUD 를 다시 그린다
    public partial class MainWindow : Window
    {
        private readonly Game game;
        private readonly DispatcherTimer timer = new DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            game = new Game(field);
            game.Changed += UpdateHud;                 // 점수 · 생명 · 상태가 바뀌면 호출된다
            UpdateHud();

            timer.Interval = TimeSpan.FromMilliseconds(16);
            timer.Tick += (s, e) => game.Update();     // 한 프레임 진행은 Game 이 한다
            timer.Start();
            Closed += (s, e) => timer.Stop();
            Deactivated += (s, e) => { game.LeftDown = false; game.RightDown = false; };
        }

        private void UpdateHud()
        {
            lblScore.Text = $"점수 {game.Score}";
            lblLevel.Text = $"레벨 {game.Level} · {Game.StateName(game.State)}";
            lblLives.Text = "생명 " + new string('♥', game.Lives);
            lblMessage.Text = game.Message;
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) game.LeftDown = true;
            else if (e.Key == Key.Right) game.RightDown = true;
            else if (e.Key == Key.Space && !e.IsRepeat) game.PressSpace();
            else return;
            e.Handled = true;
        }

        private void Window_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Left) game.LeftDown = false;
            else if (e.Key == Key.Right) game.RightDown = false;
        }

        private void Field_MouseMove(object sender, MouseEventArgs e)
        {
            game.MovePaddleTo(e.GetPosition(field).X);
        }
    }
}`;

  const F_OBJ = `// ===== File: GameObject.cs =====
using System.Windows;
using System.Windows.Controls;
using System.Windows.Shapes;

namespace P10Final
{
    // 화면에 그려지는 모든 게임 물체의 공통 부모: 위치 · 크기 · 도형 · 충돌 사각형
    public abstract class GameObject
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; }
        public double Height { get; }
        public Shape Shape { get; }                    // 실제로 Canvas 에 놓이는 WPF 도형

        protected GameObject(Shape shape, double x, double y, double width, double height)
        {
            Shape = shape;
            X = x; Y = y;
            Width = width; Height = height;
            shape.Width = width;
            shape.Height = height;
        }

        public Rect Bounds => new Rect(X, Y, Width, Height);   // 충돌 검사용 사각형
        public double CenterX => X + Width / 2;

        // 계산한 좌표를 도형에 옮긴다
        public void Draw()
        {
            Canvas.SetLeft(Shape, X);
            Canvas.SetTop(Shape, Y);
        }
    }
}`;

  const F_BALL = `// ===== File: Ball.cs =====
using System;
using System.Windows;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P10Final
{
    public class Ball : GameObject
    {
        public double VX { get; private set; }         // 속도 벡터
        public double VY { get; private set; }
        public double Speed { get; set; } = 4.5;       // 속도 벡터의 길이

        public Ball() : base(new Ellipse { Fill = Brushes.White }, 0, 0, 12, 12) { }

        // 각도(0 = 똑바로 위, + = 오른쪽)로 발사 — 길이는 늘 Speed
        public void Launch(double degrees)
        {
            double rad = degrees * Math.PI / 180;
            VX = Speed * Math.Sin(rad);
            VY = -Speed * Math.Cos(rad);
        }

        public void Move()
        {
            X += VX;
            Y += VY;
        }

        // 준비 상태: 패들 위에 올라가 함께 움직인다
        public void StickTo(Paddle paddle)
        {
            X = paddle.CenterX - Width / 2;
            Y = paddle.Y - Height - 1;
            VX = 0;
            VY = 0;
        }

        public void BounceOffWalls(double fieldWidth)
        {
            if (X < 0) { X = 0; VX = -VX; }
            if (X + Width > fieldWidth) { X = fieldWidth - Width; VX = -VX; }
            if (Y < 0) { Y = 0; VY = -VY; }
        }

        // 패들: 내려오다 겹치면 맞은 위치(-1 ~ +1)에 따라 최대 ±60도로 튕긴다
        public void BounceOff(Paddle paddle)
        {
            if (VY <= 0 || !Bounds.IntersectsWith(paddle.Bounds)) return;
            Y = paddle.Y - Height;
            Launch(paddle.HitOffset(CenterX) * 60);
        }

        // 벽돌: 겹친 부분이 좁은 쪽이 부딪힌 면 → 그 축의 속도를 뒤집는다
        public void BounceOff(Rect r)
        {
            Rect b = Bounds;
            double overlapX = Math.Min(b.Right, r.Right) - Math.Max(b.Left, r.Left);
            double overlapY = Math.Min(b.Bottom, r.Bottom) - Math.Max(b.Top, r.Top);
            if (overlapX < overlapY) VX = -VX;
            else VY = -VY;
        }
    }
}`;

  const F_PADDLE = `// ===== File: Paddle.cs =====
using System;
using System.Windows.Media;
using System.Windows.Shapes;

namespace P10Final
{
    public class Paddle : GameObject
    {
        public double Speed { get; set; } = 7;         // 키보드로 한 프레임에 움직이는 거리

        public Paddle(double x, double y)
            : base(new Rectangle { Fill = Brushes.DeepSkyBlue, RadiusX = 6, RadiusY = 6 }, x, y, 80, 12) { }

        public void MoveBy(double dx, double fieldWidth) => X = Math.Clamp(X + dx, 0, fieldWidth - Width);

        public void CenterAt(double centerX, double fieldWidth) => X = Math.Clamp(centerX - Width / 2, 0, fieldWidth - Width);

        // 공 중심이 패들의 어디에 있나: -1(왼쪽 끝) ~ 0(가운데) ~ +1(오른쪽 끝)
        public double HitOffset(double ballCenterX) => Math.Clamp((ballCenterX - X) / Width * 2 - 1, -1, 1);
    }
}`;

  const F_BRICK = `// ===== File: Brick.cs =====
using System.Windows.Media;
using System.Windows.Shapes;

namespace P10Final
{
    public class Brick : GameObject
    {
        public int Points { get; }                     // 깨면 얻는 점수

        public Brick(double x, double y, Brush color, int points)
            : base(new Rectangle { Fill = color, Stroke = Brushes.Black, StrokeThickness = 1, RadiusX = 3, RadiusY = 3 },
                   x, y, 54, 18)
        {
            Points = points;
        }

        // 공에 맞았을 때 호출 — 깨지면 true. 여러 번 맞아야 깨지는 벽돌은 재정의한다
        public virtual bool Hit() => true;
    }
}`;

  const F_GAME = `// ===== File: Game.cs =====
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Controls;
using System.Windows.Media;

namespace P10Final
{
    public enum GameState { Ready, Playing, Paused, GameOver, Cleared }

    // 게임 규칙 담당: 물체들을 가지고 한 프레임씩 진행한다
    public class Game
    {
        public const double FieldWidth = 480, FieldHeight = 360;
        private const int Rows = 5, Cols = 8;
        private static readonly Brush[] RowColors =
            { Brushes.Crimson, Brushes.DarkOrange, Brushes.Gold, Brushes.LimeGreen, Brushes.DodgerBlue };

        private readonly Canvas field;
        private readonly List<Brick> bricks = new List<Brick>();

        public Ball Ball { get; } = new Ball();
        public Paddle Paddle { get; } = new Paddle(200, 330);
        public int Score { get; private set; }
        public int Lives { get; private set; }
        public int Level { get; private set; }
        public GameState State { get; private set; }
        public bool LeftDown { get; set; }             // 키 플래그 (MainWindow 가 설정)
        public bool RightDown { get; set; }

        public event Action? Changed;                  // HUD 를 다시 그려야 할 때 알림

        public Game(Canvas field)
        {
            this.field = field;
            field.Children.Add(Paddle.Shape);
            field.Children.Add(Ball.Shape);
            NewGame();
        }

        // ---------------- 게임 · 레벨 준비 ----------------
        public void NewGame()
        {
            Score = 0;
            Lives = 3;
            Level = 1;
            StartLevel();
        }

        private void StartLevel()
        {
            Ball.Speed = Level == 1 ? 4.5 : 6;         // 레벨 2 는 공이 빠르다
            CreateBricks();
            GetReady();
        }

        private void CreateBricks()
        {
            foreach (Brick old in bricks) field.Children.Remove(old.Shape);
            bricks.Clear();
            for (int row = 0; row < Rows; row++)
                for (int col = 0; col < Cols; col++)
                {
                    var brick = new Brick(10 + col * 58, 40 + row * 22, RowColors[row], (Rows - row) * 10);
                    field.Children.Add(brick.Shape);
                    brick.Draw();
                    bricks.Add(brick);
                }
        }

        private void GetReady()                        // 공을 패들 위에 올리고 준비 상태로
        {
            Ball.StickTo(Paddle);
            SetState(GameState.Ready);
        }

        private void SetState(GameState s)
        {
            State = s;
            Draw();
            Changed?.Invoke();
        }

        // ---------------- 입력 ----------------
        public void PressSpace()
        {
            switch (State)
            {
                case GameState.Ready:   Ball.Launch(20); SetState(GameState.Playing); break;
                case GameState.Playing: SetState(GameState.Paused); break;
                case GameState.Paused:  SetState(GameState.Playing); break;
                default:                NewGame(); break;
            }
        }

        public void MovePaddleTo(double x)
        {
            if (State == GameState.Ready || State == GameState.Playing) Paddle.CenterAt(x, FieldWidth);
        }

        // ---------------- 한 프레임 ----------------
        public void Update()
        {
            if (State != GameState.Ready && State != GameState.Playing) return;

            if (LeftDown) Paddle.MoveBy(-Paddle.Speed, FieldWidth);
            if (RightDown) Paddle.MoveBy(Paddle.Speed, FieldWidth);

            if (State == GameState.Ready) Ball.StickTo(Paddle);
            else UpdateBall();
            Draw();
        }

        private void UpdateBall()
        {
            Ball.Move();
            Ball.BounceOffWalls(FieldWidth);
            Ball.BounceOff(Paddle);
            CheckBricks();
            if (State == GameState.Playing && Ball.Y > FieldHeight) LoseLife();
        }

        private void CheckBricks()
        {
            Brick? hit = bricks.FirstOrDefault(b => Ball.Bounds.IntersectsWith(b.Bounds));
            if (hit == null) return;

            Ball.BounceOff(hit.Bounds);
            if (!hit.Hit()) return;                    // 아직 안 깨지는 벽돌

            bricks.Remove(hit);
            field.Children.Remove(hit.Shape);
            Score += hit.Points;
            Changed?.Invoke();
            if (bricks.Count == 0) LevelCleared();
        }

        private void LoseLife()
        {
            Lives--;
            if (Lives > 0) GetReady();
            else SetState(GameState.GameOver);
        }

        private void LevelCleared()
        {
            if (Level == 1)
            {
                Level = 2;
                StartLevel();
            }
            else SetState(GameState.Cleared);
        }

        private void Draw()
        {
            Paddle.Draw();
            Ball.Draw();
        }

        // ---------------- 화면에 보여 줄 글 ----------------
        public string Message => State switch
        {
            GameState.Ready when Level == 1 => "스페이스바를 누르면 시작합니다",
            GameState.Ready    => "레벨 2 — 공이 빨라집니다! 스페이스바로 시작",
            GameState.Paused   => "일시정지 — 스페이스바로 계속",
            GameState.GameOver => $"게임 오버! 점수 {Score} — 스페이스바로 새 게임",
            GameState.Cleared  => $"모두 클리어! 점수 {Score} — 스페이스바로 새 게임",
            _                  => ""
        };

        public static string StateName(GameState s) => s switch
        {
            GameState.Ready    => "준비",
            GameState.Playing  => "진행",
            GameState.Paused   => "일시정지",
            GameState.GameOver => "게임 오버",
            _                  => "클리어"
        };
    }
}`;

  const FINAL_PARTS = { xaml: F_XAML, main: F_MAIN, obj: F_OBJ, ball: F_BALL, paddle: F_PADDLE, brick: F_BRICK, game: F_GAME };
  const joinFinal = (p, ns, extra) => [p.xaml, p.main, p.obj, p.ball, p.paddle, p.brick].concat(extra ? [extra] : []).concat([p.game]).join('\n').split('P10Final').join(ns);
  const FINAL = joinFinal(FINAL_PARTS, 'P10Final');

  // 확장 과제 1: 두 번 맞아야 깨지는 벽돌 (상속 · virtual/override)
  const HARD_BRICK = `// ===== File: HardBrick.cs =====
using System.Windows.Media;

namespace P10Final
{
    // 단단한 벽돌: 두 번 맞아야 깨진다. 한 번 맞으면 색이 어두워진다
    public class HardBrick : Brick
    {
        private int hitsLeft = 2;

        public HardBrick(double x, double y) : base(x, y, Brushes.Silver, 100) { }

        public override bool Hit()
        {
            hitsLeft--;
            if (hitsLeft > 0)
            {
                Shape.Fill = Brushes.DimGray;          // 금이 간 모습
                return false;                          // 아직 안 깨짐
            }
            return true;
        }
    }
}`;
  const EXT1_STARTER = joinFinal(Object.assign({}, FINAL_PARTS, {
    game: rep(F_GAME, [['                    var brick = new Brick(10 + col * 58, 40 + row * 22, RowColors[row], (Rows - row) * 10);\n',
      '                    // TODO 2: 맨 윗줄(row == 0)은 new HardBrick(x, y) 로 만든다 (변수 형식은 Brick)\n                    var brick = new Brick(10 + col * 58, 40 + row * 22, RowColors[row], (Rows - row) * 10);\n']]),
    brick: rep(F_BRICK, [['        public virtual bool Hit() => true;\n    }\n}', '        public virtual bool Hit() => true;\n    }\n\n    // TODO 1: Brick 을 상속한 HardBrick 클래스 — 은색(Silver), 100점,\n    //         Hit() 를 재정의해 첫 번째는 색만 DimGray 로 바꾸고 false, 두 번째에 true\n}']])
  }), 'P10Ext1');
  const EXT1_SOLUTION = joinFinal(Object.assign({}, FINAL_PARTS, {
    game: rep(F_GAME, [['                    var brick = new Brick(10 + col * 58, 40 + row * 22, RowColors[row], (Rows - row) * 10);\n',
      `                    double x = 10 + col * 58, y = 40 + row * 22;
                    Brick brick = row == 0 ? new HardBrick(x, y)                          // 맨 윗줄: 단단한 벽돌
                                           : new Brick(x, y, RowColors[row], (Rows - row) * 10);
`]])
  }), 'P10Ext1S', HARD_BRICK);

  // 확장 과제 2: 최고 점수 + 클리어 보너스
  const EXT2_STARTER = joinFinal(Object.assign({}, FINAL_PARTS, {
    game: rep(F_GAME, [
      ['        public int Score { get; private set; }\n', '        public int Score { get; private set; }\n        // TODO 1: 최고 점수 속성 HighScore (읽기는 공개, 쓰기는 private)\n'],
      ['            else SetState(GameState.GameOver);', '            else SetState(GameState.GameOver);         // TODO 2: 게임 오버 직전에 최고 점수 갱신'],
      ['            else SetState(GameState.Cleared);', '            else SetState(GameState.Cleared);          // TODO 3: 남은 생명 × 100 보너스를 더하고 최고 점수 갱신']
    ]),
    main: rep(F_MAIN, [['            lblScore.Text = $"점수 {game.Score}";', '            lblScore.Text = $"점수 {game.Score}";      // TODO 4: " · 최고 n" 도 표시']])
  }), 'P10Ext2');
  const EXT2_SOLUTION = joinFinal(Object.assign({}, FINAL_PARTS, {
    game: rep(F_GAME, [
      ['        public int Score { get; private set; }\n', '        public int Score { get; private set; }\n        public int HighScore { get; private set; }     // 새 게임을 해도 남는다\n'],
      ['            else SetState(GameState.GameOver);', `            else
            {
                UpdateHighScore();
                SetState(GameState.GameOver);
            }`],
      ['            else SetState(GameState.Cleared);', `            else
            {
                Score += Lives * 100;                  // 클리어 보너스: 남은 생명 × 100
                UpdateHighScore();
                SetState(GameState.Cleared);
            }`],
      ['        private void Draw()\n', `        private void UpdateHighScore()
        {
            if (Score > HighScore) HighScore = Score;
        }

        private void Draw()
`],
      ['$"모두 클리어! 점수 {Score} — 스페이스바로 새 게임"', '$"모두 클리어! 생명 보너스 +{Lives * 100} · 점수 {Score}"']
    ]),
    main: rep(F_MAIN, [['            lblScore.Text = $"점수 {game.Score}";', '            lblScore.Text = $"점수 {game.Score} · 최고 {game.HighScore}";']])
  }), 'P10Ext2S');

  const CLASS_CONSOLE = `using System;
using System.Collections.Generic;

// 콘솔판 설계 확인: WPF 도형 없이 “위치 · 크기 · 충돌 · 다형성” 만 먼저 시험한다
abstract class GameObject
{
    public double X, Y;
    public double Width { get; }
    public double Height { get; }
    protected GameObject(double x, double y, double w, double h) { X = x; Y = y; Width = w; Height = h; }
    public bool Overlaps(GameObject o) => X < o.X + o.Width && o.X < X + Width && Y < o.Y + o.Height && o.Y < Y + Height;
    public abstract string Name { get; }
    public override string ToString() => $"{Name}({X}, {Y})";
}

class Ball : GameObject
{
    public double VY;
    public Ball(double x, double y) : base(x, y, 12, 12) { }
    public override string Name => "공";
    public void Move() => Y += VY;
}

class Brick : GameObject
{
    public int Points { get; }
    public Brick(double x, double y, int points) : base(x, y, 54, 18) { Points = points; }
    public override string Name => $"벽돌{Points}";
    public virtual bool Hit() => true;                 // 보통 벽돌: 한 번에 깨짐
}

class HardBrick : Brick
{
    private int hitsLeft = 2;
    public HardBrick(double x, double y) : base(x, y, 100) { }
    public override string Name => $"단단한벽돌[{hitsLeft}]";
    public override bool Hit() => --hitsLeft == 0;     // 두 번 맞아야 깨짐
}

class Program
{
    static void Main()
    {
        var bricks = new List<Brick> { new HardBrick(68, 40), new Brick(68, 62, 40) };
        var ball = new Ball(80, 100) { VY = -8 };
        int score = 0;

        for (int frame = 1; frame <= 40 && bricks.Count > 0; frame++)
        {
            ball.Move();
            if (ball.Y > 100) ball.VY = -ball.VY;             // 바닥(패들 대신)에서 튕김
            Brick? hit = bricks.Find(b => ball.Overlaps(b));   // 겹친 벽돌 하나
            if (hit == null) continue;

            ball.VY = -ball.VY;
            Console.Write($"프레임 {frame,2}: {ball} → {hit} 맞음");
            if (hit.Hit())                                     // 실제 객체의 Hit() 가 불린다 (다형성)
            {
                bricks.Remove(hit);
                score += hit.Points;
                Console.WriteLine(" → 깨짐!");
            }
            else Console.WriteLine(" → 금이 감");
        }
        Console.WriteLine($"점수 {score}, 남은 벽돌 {bricks.Count}개");
    }
}
`;

  const CLASS_SLIDE = `using System;
using System.Collections.Generic;

class Brick
{
    public int Points { get; }
    public Brick(int points) { Points = points; }
    public virtual bool Hit() => true;                  // 보통 벽돌: 한 번에 깨짐
}
class HardBrick : Brick
{
    private int hitsLeft = 2;
    public HardBrick() : base(100) { }
    public override bool Hit() => --hitsLeft == 0;      // 두 번 맞아야 깨짐
}
class Program
{
    static void Main()
    {
        var bricks = new List<Brick> { new HardBrick(), new Brick(50), new Brick(40) };
        for (int shot = 1; bricks.Count > 0; shot++)
        {
            Brick target = bricks[0];                   // 늘 맨 앞 벽돌을 맞힌다
            bool broken = target.Hit();                 // 실제 객체의 Hit() (다형성)
            if (broken) bricks.Remove(target);
            Console.WriteLine($"{shot}번째: {target.GetType().Name}({target.Points}) → {(broken ? "깨짐" : "금이 감")}");
        }
    }
}
`;

  /* ======================================================================
   * 강좌 데이터
   * ====================================================================== */
  CS_COURSE.addChapter({
    id: 'p10',
    no: 'P10',
    title: 'WPF 벽돌 깨기 게임',
    subtitle: 'Breakout — Canvas · Shapes · DispatcherTimer Game Loop · Input · Collision · State',
    summary: '강좌의 마지막 프로젝트로 고전 게임 “벽돌 깨기(Breakout)” 를 만듭니다. Canvas 위에 패들(Rectangle) · 공(Ellipse) · 벽돌(코드로 만든 2차원 배치)을 놓고, DispatcherTimer 로 16 ms 마다 “입력 → 이동 → 충돌 → 그리기” 를 반복하는 게임 루프를 구현합니다. 키보드(눌린 키 플래그)와 마우스로 패들을 움직이고, 사각형 겹침(Rect.IntersectsWith)으로 벽 · 패들 · 벽돌 충돌을 판정해 속도 벡터를 반사시키며, 패들에 맞은 위치로 공의 각도를 바꿉니다. enum 으로 준비 · 진행 · 일시정지 · 게임 오버 · 클리어 상태를 관리하고, 레벨 2 에서는 공이 빨라집니다. 마지막으로 전체 코드를 GameObject · Ball · Paddle · Brick · Game 클래스로 정리하고 확장 과제에 도전합니다.',
    goals: [
      '게임 요구사항을 기능 목록 · 수치 표 · 상태 전이도로 정리하고 Canvas 좌표로 화면을 설계할 수 있다',
      'DispatcherTimer 로 UI 를 멈추지 않는 게임 루프(입력 → 이동 → 충돌 → 그리기)를 만들 수 있다',
      'KeyDown · KeyUp 의 눌린 키 플래그와 MouseMove 로 부드러운 조작을 구현할 수 있다',
      '속도 벡터와 Rect.IntersectsWith 로 벽 · 패들 · 벽돌 충돌과 반사를 구현하고, 맞은 위치로 각도를 계산할 수 있다',
      '2차원 배열과 반복문으로 벽돌을 코드에서 만들고, enum 과 switch 로 게임 상태를 관리할 수 있다',
      '절차적으로 만든 게임을 상속 · 다형성 · 이벤트를 쓰는 클래스(GameObject · Ball · Paddle · Brick · Game)로 리팩터링할 수 있다'
    ],
    requires: ['ch09', 'ch12', 'ch17', 'ch22'],
    preview: 'assets/shots/p10-final.png',
    previewCode: FINAL,
    sections: [
      /* ===================== p10-1 ===================== */
      {
        id: 'p10-1',
        title: '요구사항 분석과 설계',
        minutes: 50,
        goals: [
          '벽돌 깨기 게임의 규칙을 기능 목록과 수치 표로 정리할 수 있다',
          '게임 화면을 Canvas 좌표(왼쪽 위 원점, y 는 아래로)로 설계할 수 있다',
          '게임 루프(입력 → 이동 → 충돌 → 그리기)와 게임 상태 전이를 그림으로 설명할 수 있다',
          '속도 벡터 이동 · 벽 반사 · 사각형 겹침 · 패들 각도를 콘솔 코드로 미리 확인할 수 있다',
          '단계 1 — HUD 와 게임 판이 있는 화면 틀을 XAML 로 만들 수 있다'
        ],
        flow: [['도입 · 완성 게임 시연', 5], ['요구사항 · 수치 설계', 10], ['화면 · 게임 루프 · 상태 설계', 13], ['준비 예제 (이동 · 충돌 계산)', 12], ['단계 1 화면 틀 · 정리 · 퀴즈', 10]],
        content: [
          { type: 'h', text: '1. 무엇을 만들까?' },
          { type: 'p', html: '이번 프로젝트는 강좌의 마지막 작품, <b>벽돌 깨기(Breakout)</b> 게임입니다. 화면 위쪽에는 알록달록한 벽돌이 5줄 늘어서 있고, 아래쪽의 <b>패들(paddle, 받침대)</b>을 키보드나 마우스로 좌우로 움직여 <b>공</b>을 받아 냅니다. 공이 벽돌에 맞으면 벽돌이 깨지고 점수를 얻습니다. 공을 바닥으로 떨어뜨리면 생명이 하나 줄고, 생명 3개를 모두 잃으면 게임 오버입니다. 벽돌을 모두 깨면 공이 더 빠른 <b>레벨 2</b> 가 시작됩니다.' },
          { type: 'p', html: '지금까지 배운 것이 거의 모두 들어갑니다. <b>Canvas 와 도형</b>(Rectangle · Ellipse), 22장의 <b>DispatcherTimer</b>, 17장의 <b>키보드 · 마우스 이벤트</b>, 7장의 <b>2차원 배열</b>, 12장의 <b>열거형(enum)</b>, 그리고 9장의 <b>상속 · 다형성</b>으로 마지막에 코드를 클래스로 정리합니다. 게임은 “눈에 보이는 결과” 가 바로 나오기 때문에, 코드 한 줄이 무엇을 바꾸는지 확인하며 만들기에 아주 좋은 주제입니다.' },
          { type: 'h', text: '2. 요구사항 정리' },
          { type: 'table', head: ['번호', '기능', '설명'], rows: [
            ['F1', '게임 판', '480×360 Canvas. 위쪽 HUD 에 점수 · 레벨/상태 · 생명(♥) 표시'],
            ['F2', '벽돌', '5줄 × 8칸 = 40개, 코드에서 생성. 줄마다 색과 점수가 다름 (윗줄 50점 … 아랫줄 10점)'],
            ['F3', '패들 조작', '← → 키(누르고 있는 동안 계속 이동) 또는 마우스. 판 밖으로 나가지 않음'],
            ['F4', '공 이동', '속도 벡터 (vx, vy) 로 매 프레임 이동. 옆 벽 · 천장에서 반사'],
            ['F5', '충돌', '패들: 맞은 위치에 따라 각도가 바뀜(가운데 = 수직, 끝 = ±60°) / 벽돌: 깨지고 부딪힌 면에 맞게 반사'],
            ['F6', '생명', '공이 바닥으로 빠지면 생명 −1, 공은 패들 위로 돌아와 다시 준비. 0 이면 게임 오버'],
            ['F7', '상태', '준비 · 진행 · 일시정지 · 게임 오버 · 클리어. 스페이스바로 시작 · 일시정지 · 계속 · 새 게임'],
            ['F8', '레벨', '레벨 1 의 벽돌을 모두 깨면 레벨 2 (벽돌 다시 채움, 공 속도 4.5 → 6). 레벨 2 도 깨면 클리어']
          ], caption: '기능 요구사항' },
          { type: 'h', text: '3. 화면과 수치 설계' },
          { type: 'p', html: 'Canvas 의 좌표는 <b>왼쪽 위가 (0, 0)</b> 이고, x 는 오른쪽으로 · <b>y 는 아래로</b> 커집니다(15장). 수학 시간의 좌표와 y 방향이 반대라서, 공을 <b>위로</b> 보내려면 <code>vy</code> 가 <b>음수</b>여야 합니다. 모든 물체의 위치는 “왼쪽 위 모서리” 좌표(<code>Canvas.Left</code>, <code>Canvas.Top</code>)로 다룹니다.' },
          { type: 'figure', html: SVG_FIELD, caption: '게임 화면 설계 — 모든 크기와 위치를 숫자로 먼저 정한다' },
          { type: 'table', head: ['물체', '도형', '크기', '위치 · 규칙'], rows: [
            ['게임 판', '<code>Canvas</code>', '480 × 360', '<code>ClipToBounds="True"</code> — 판 밖으로 나간 공은 안 보이게'],
            ['패들', '<code>Rectangle</code>', '80 × 12', 'y = 330 고정, 0 ≤ x ≤ 400, 키보드 속도 7 px/프레임'],
            ['공', '<code>Ellipse</code>', '12 × 12', '속도 크기 4.5 (레벨 2: 6) px/프레임, 처음엔 패들 위'],
            ['벽돌', '<code>Rectangle</code> × 40', '54 × 18, 간격 4', '첫 벽돌 (10, 40), 칸 간격 58 · 줄 간격 22'],
            ['HUD', '<code>TextBlock</code> × 3 + 안내 글', '높이 30', '<code>Grid</code> 3칸 — 왼쪽 점수, 가운데 레벨 · 상태, 오른쪽 생명']
          ], caption: '수치 설계 — 벽돌 한 줄 폭: 10 + 8 × 54 + 7 × 4 = 470 (오른쪽 여백 10)' },
          { type: 'h', text: '4. 게임 루프 — 게임은 “아주 빠른 반복” 이다' },
          { type: 'p', html: '게임 화면이 움직여 보이는 것은 영화처럼 <b>1초에 수십 번</b> 조금씩 다른 그림을 보여 주기 때문입니다. 그 한 장을 <b>프레임(frame)</b>이라 하고, 매 프레임마다 똑같은 순서로 일하는 반복을 <b>게임 루프(game loop)</b>라고 합니다. ① 입력 반영 → ② 이동 → ③ 충돌 검사 → ④ 그리기.' },
          { type: 'figure', html: SVG_LOOP, caption: '게임 루프 — 타이머가 16 ms 마다 Tick 을 보내고, 입력 이벤트는 그 사이사이에 따로 도착한다' },
          { type: 'callout', kind: 'info', title: 'DispatcherTimer 한 번에 정리 (22장)', html: '<p><code>System.Windows.Threading.DispatcherTimer</code> 는 정해진 간격(<code>Interval</code>)마다 <code>Tick</code> 이벤트를 <b>UI 스레드에서</b> 발생시키는 타이머입니다. UI 스레드에서 실행되므로 <code>Tick</code> 처리기 안에서 도형 위치나 <code>TextBlock</code> 글자를 마음대로 바꿔도 됩니다.</p><pre><code>var timer = new DispatcherTimer();\ntimer.Interval = TimeSpan.FromMilliseconds(16);   // 16 ms ≈ 1초에 60번\ntimer.Tick += GameLoop;                            // (object sender, EventArgs e)\ntimer.Start();                                     // Stop() 으로 멈춤</code></pre><p>“1초에 60번” 은 목표일 뿐 정확하지는 않습니다. 컴퓨터가 바쁘면 Tick 이 조금 늦게 옵니다. 이 프로젝트는 간단하게 “한 프레임에 몇 픽셀” 로 속도를 정합니다.</p>' },
          { type: 'callout', kind: 'warn', title: 'while 반복과 Thread.Sleep 으로 게임 루프를 만들면 안 된다', html: '<p>콘솔 게임처럼 <code>while (true) { … Thread.Sleep(16); }</code> 을 창의 생성자나 버튼 처리기 안에 쓰면, 그 반복이 끝날 때까지 UI 스레드가 <b>다른 일을 전혀 못 합니다</b>. 화면을 다시 그리지도, 키 입력을 받지도 못해 창이 “응답 없음” 이 됩니다. WPF 에서는 반복을 직접 돌리지 말고, 타이머가 “잠깐씩 불러 주도록” 맡겨야 합니다.</p>' },
          { type: 'h', text: '5. 게임 상태 — 같은 키, 다른 동작' },
          { type: 'p', html: '스페이스바 하나로 “시작” · “일시정지” · “계속” · “새 게임” 을 모두 합니다. 무엇을 할지는 <b>지금 게임이 어떤 상태인가</b>에 달려 있습니다. 이렇게 상태 몇 개와 “무슨 일이 생기면 어느 상태로 가는가” 를 정해 두는 설계를 <b>상태 기계(state machine)</b>라고 합니다. C# 에서는 12장의 <code>enum</code> 이 딱 맞습니다.' },
          { type: 'figure', html: SVG_STATES, caption: '게임 상태 전이도 — 화살표 위의 글이 전이 조건' },
          { type: 'table', head: ['상태', '게임 루프가 하는 일', '스페이스바', '안내 글'], rows: [
            ['준비 Ready', '패들만 움직이고, 공은 패들 위에 붙어 따라다님', '공 발사 → 진행', '스페이스바를 누르면 시작합니다'],
            ['진행 Playing', '패들 · 공 이동, 충돌 검사', '→ 일시정지', '(없음)'],
            ['일시정지 Paused', '아무것도 안 함', '→ 진행', '일시정지 — 스페이스바로 계속'],
            ['게임 오버 GameOver', '아무것도 안 함', '새 게임 → 준비', '게임 오버! 점수 …'],
            ['클리어 Cleared', '아무것도 안 함', '새 게임 → 준비', '모두 클리어! 점수 …']
          ], caption: '상태별 동작표 — 이 표가 그대로 switch 문이 된다' },
          { type: 'h', text: '6. 구현 계획' },
          { type: 'table', head: ['교시', '단계', '결과물'], rows: [
            ['1교시', '준비 예제 · 단계 1 화면 틀', '콘솔로 이동 · 충돌 계산 확인, XAML 로 HUD + 게임 판'],
            ['2교시', '단계 2 게임 루프', 'DispatcherTimer 로 네 벽에서 튕기는 공'],
            ['2교시', '단계 3 패들 조작', '키 플래그 · 마우스로 부드럽게 움직이는 패들'],
            ['2교시', '단계 4 패들 충돌', '맞은 위치로 각도 결정, 바닥에 빠지면 생명 감소'],
            ['3교시', '단계 5 · 6 벽돌', '2차원 배열로 벽돌 40개 생성, 충돌 · 반사 · 점수'],
            ['3교시', '단계 7 · 8 상태 · 레벨', 'enum 상태와 스페이스바, 레벨 2'],
            ['4교시', '완성 · 확장', 'GameObject · Ball · Paddle · Brick · Game 클래스로 정리, 확장 과제']
          ], caption: '단계마다 “실행되는 게임” 이 조금씩 자란다' },
          { type: 'h', text: '7. 준비 운동 — 계산부터 콘솔로 확인' },
          { type: 'p', html: '화면에 그리기 전에, 게임의 핵심 계산이 맞는지 <b>콘솔 프로그램</b>으로 먼저 확인합니다. 화면에서는 공이 휙 지나가 버려 틀린 곳을 찾기 어렵지만, 콘솔에서는 프레임마다 숫자를 찍어 볼 수 있습니다. 첫 번째는 속도 벡터로 움직이고 벽에서 튕기는 계산입니다.' },
          { type: 'code', title: '준비 예제 1. 속도 벡터로 이동하고 벽에서 튕기기', code: PREP_MOVE,
            expect: '프레임 1: ( 35,  18)  속도 ( 15, -12)\n프레임 2: ( 50,   6)  속도 ( 15, -12)\n프레임 3: ( 65,   0)  속도 ( 15,  12) 천장\n프레임 4: ( 80,  12)  속도 ( 15,  12)\n프레임 5: ( 90,  24)  속도 (-15,  12) 오른쪽 벽\n프레임 6: ( 75,  36)  속도 (-15,  12)\n프레임 7: ( 60,  48)  속도 (-15,  12)\n프레임 8: ( 45,  50)  속도 (-15, -12) 바닥',
            desc: '공의 위치 <code>(x, y)</code> 에 매 프레임 속도 <code>(vx, vy)</code> 를 더하는 것이 이동의 전부입니다. 벽을 넘어가면 ① 공을 <b>벽 안쪽으로 되돌리고</b> ② 그 방향의 속도 부호만 뒤집습니다(<code>vx = -vx</code>). 오른쪽 벽 검사는 공의 <b>오른쪽 끝</b>인 <code>x + Size</code> 로 해야 합니다. 프레임 5 에서 x 가 95 가 되어 오른쪽 끝(105)이 벽(100)을 넘었으므로 90 으로 되돌렸습니다. 되돌리지 않으면 다음 프레임에도 여전히 벽 밖이라 또 뒤집혀서, 공이 벽에 “끼어” 떨게 됩니다. <code>{x,3}</code> 은 3칸 오른쪽 정렬 서식입니다.' },
          { type: 'p', html: '두 번째는 <b>충돌 판정</b>과 <b>패들 각도</b> 계산입니다. 게임 속 물체를 모두 “사각형” 으로 보고, 두 사각형이 겹치는지 검사합니다. 이렇게 축에 나란한 사각형끼리의 검사를 <b>AABB(Axis-Aligned Bounding Box)</b> 충돌 검사라고 합니다. 두 사각형은 <b>가로 구간도 겹치고 세로 구간도 겹칠 때만</b> 겹칩니다.' },
          { type: 'code', title: '준비 예제 2. 사각형 겹침과 패들 각도 계산', code: PREP_HIT,
            expect: 'True\nFalse\nFalse\n공 중심 200 → hit -1.00, 각도 -60°, 속도 (-4.33, -2.50)\n공 중심 220 → hit -0.50, 각도 -30°, 속도 (-2.50, -4.33)\n공 중심 240 → hit  0.00, 각도   0°, 속도 (0.00, -5.00)\n공 중심 260 → hit  0.50, 각도  30°, 속도 (2.50, -4.33)\n공 중심 280 → hit  1.00, 각도  60°, 속도 (4.33, -2.50)',
            desc: '<code>Intersects</code> 는 “a 의 왼쪽이 b 의 오른쪽보다 왼쪽에 있고, b 의 왼쪽이 a 의 오른쪽보다 왼쪽에 있다” 로 가로 겹침을, 같은 방법으로 세로 겹침을 봅니다. 세 번째 공은 y = 58 로 벽돌 아래쪽 끝(40 + 18 = 58)에 <b>딱 붙어</b> 있어 겹치지 않은 것으로 판정했습니다. <code>HitOffset</code> 은 공 중심이 패들 왼쪽 끝이면 −1, 가운데면 0, 오른쪽 끝이면 +1 이 되게 바꾸고, 여기에 60 을 곱해 각도를 만듭니다. 속도는 <code>sin</code> · <code>cos</code> 로 나누므로 어느 각도든 <b>빠르기(길이 5)</b>는 같습니다. 예: (−4.33)² + (−2.5)² ≈ 25.' },
          { type: 'callout', kind: 'tip', title: 'WPF 에는 이미 Rect.IntersectsWith 가 있다', html: '<p>WPF 의 <code>System.Windows.Rect</code> 구조체(12장의 struct)는 <code>new Rect(x, y, 너비, 높이)</code> 로 만들고, <code>a.IntersectsWith(b)</code> 로 겹침을 검사합니다. <code>Left</code> · <code>Top</code> · <code>Right</code> · <code>Bottom</code> 속성도 있어 계산이 편합니다. 단, <code>IntersectsWith</code> 는 모서리가 <b>딱 붙기만 해도</b> <code>true</code> 입니다(준비 예제 2 의 <code>&lt;</code> 대신 <code>&lt;=</code>). 게임에서는 그 차이가 1프레임 정도라 문제되지 않습니다. 2교시부터는 게임 코드에서 <code>Rect</code> 를 씁니다.</p>' },
          { type: 'h', text: '8. 단계 1 — 게임 화면 틀' },
          { type: 'p', html: '이제 WPF 창을 만듭니다. <code>DockPanel</code> 로 위쪽에 HUD(<code>Grid</code> 3칸)를, 나머지에 480×360 <code>Canvas</code> 를 놓습니다. 패들 · 공 · 안내 글은 XAML 에 직접 놓고 <code>x:Name</code> 을 붙여 코드에서 쓸 수 있게 합니다. 벽돌 40개는 XAML 에 하나하나 쓰기에 너무 많으므로 3교시에 코드로 만듭니다.' },
          { type: 'code', title: '단계 1. 게임 화면 틀 — HUD 와 게임 판', code: STEP1,
            desc: 'XAML 만으로 게임 화면이 완성되었습니다. 창 크기는 520×460, <code>ResizeMode="NoResize"</code> 로 크기를 고정해 게임 판이 늘었다 줄었다 하지 않게 했습니다. <code>Canvas</code> 의 <code>Background</code> 를 꼭 지정하세요 — 배경이 없으면 빈 곳에서 마우스 이벤트를 받지 못합니다(17장). HUD 의 세 <code>TextBlock</code> 은 <code>Grid</code> 의 세 칸에 두고 <code>TextAlignment</code> 로 왼쪽 · 가운데 · 오른쪽 정렬했습니다. 코드 비하인드에서는 <code>Canvas.GetLeft(paddle)</code> 처럼 <b>부착 속성</b>을 읽어 안내 글에 표시해 보았습니다. 공의 <code>Canvas.Top</code> 이 317 인 이유: 패들 위(330) − 공 높이(12) − 1.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 프로젝트 준비하기', html: '<ul><li><b>새 프로젝트 만들기</b> ▸ <b>WPF 애플리케이션</b>(C#, .NET) ▸ 이름 <code>Breakout</code>. 이 강좌의 예제는 단계마다 네임스페이스가 다르므로(<code>P10Step1</code> …), 직접 만들 때는 <code>x:Class="Breakout.MainWindow"</code> 와 <code>namespace Breakout</code> 처럼 프로젝트 이름에 맞춰 바꾸세요.</li><li><code>MainWindow.xaml</code> 에 위 XAML 을 붙여 넣으면 <b>디자이너</b>에 HUD · 패들 · 공이 바로 보입니다. 패들을 클릭하면 속성 창에서 <code>Canvas.Left</code> · <code>Canvas.Top</code> 값을 확인할 수 있습니다.</li><li>디자이너에서 도형을 마우스로 끌면 <code>Canvas.Left</code> 가 소수점 값(예: 200.37)으로 바뀝니다. 게임은 좌표 계산이 중요하므로 <b>XAML 에서 정수로 직접</b> 적는 편이 좋습니다.</li><li><kbd>F5</kbd>(디버깅 시작)로 실행합니다. 이 프로젝트는 단계마다 <code>MainWindow.xaml</code> · <code>MainWindow.xaml.cs</code> 두 파일을 바꿔 가며 키워 나갑니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 왜 Canvas 인가?', html: '<p><code>Grid</code> · <code>StackPanel</code> 은 자식의 위치를 <b>패널이 알아서</b> 정합니다. 게임은 반대로 <b>프로그램이 좌표를 직접</b> 정해야 하므로, 자식을 <code>Canvas.Left</code> · <code>Canvas.Top</code> 이 가리키는 곳에 그대로 놓는 <code>Canvas</code> 가 맞습니다. 좌표를 바꾸면 다음 화면 갱신 때 WPF 가 알아서 다시 그려 줍니다. 그림판(P07)에서 선을 그린 것과 같은 원리입니다.</p>' }
        ],
        practice: [
          {
            title: '실습 P10-1. 바닥에 빠지면 생명 잃기 (콘솔)',
            level: 1,
            desc: '<p>준비 예제 1 을 게임 규칙에 가깝게 바꿉니다. 100×60 판에서 공(크기 10)이 (20, 30) 에서 속도 (15, −12) 로 출발해 최대 30 프레임 움직입니다.</p><ul><li>왼쪽 · 오른쪽 벽과 천장에서는 되돌리고 반사하며, 반사할 때마다 <code>bounces</code> 를 1 늘립니다.</li><li><b>바닥</b>(<code>y + Size &gt; Height</code>)에 닿으면 반사하지 않고 생명을 1 줄인 뒤 <code>프레임 n: 놓침! 남은 생명 m</code> 을 출력합니다.</li><li>생명이 0 이면 <code>게임 오버</code> 를 출력하고 반복을 끝냅니다. 아니면 공을 (45, 20) 에 다시 두고 <code>vy = -12</code> 로 다시 출발합니다(<code>vx</code> 는 그대로).</li><li>마지막에 <code>벽 반사 n번, 남은 생명 m</code> 을 출력합니다.</li></ul>',
            hint: '벽 검사 세 개는 준비 예제 1 과 같고 끝에 <code>bounces++</code> 만 붙입니다. 바닥 검사 안에서 생명이 0 인지 먼저 확인하고 <code>break</code> 해야 공을 되돌리는 코드가 실행되지 않습니다. 시작 코드의 <code>frame == 30</code> 확인 줄은 지워도 됩니다.',
            starter: P1_STARTER,
            solution: P1_SOLUTION,
            expect: '프레임 8: 놓침! 남은 생명 2\n프레임 15: 놓침! 남은 생명 1\n프레임 22: 놓침! 남은 생명 0\n게임 오버\n벽 반사 6번, 남은 생명 0'
          },
          {
            title: '실습 P10-2. 어느 면에 부딪혔나? (콘솔)',
            level: 2,
            desc: '<p>공이 벽돌에 맞았을 때 <b>옆면</b>에 맞았으면 좌우로(<code>vx</code> 반전), <b>윗면 · 아랫면</b>에 맞았으면 상하로(<code>vy</code> 반전) 튕겨야 합니다. 두 메서드를 완성하세요.</p><ul><li><code>Intersects</code>: 두 사각형이 가로 · 세로 모두 겹치면 <code>true</code>.</li><li><code>BounceAxis</code>: 겹친 부분의 폭 <code>overlapX</code> 와 높이 <code>overlapY</code> 를 구해, 폭이 더 좁으면 <code>"좌우"</code>, 아니면 <code>"상하"</code> 를 돌려줍니다.</li></ul><p>벽돌은 (100, 40) 크기 54×18, 공은 12×12 입니다. 예: 공 (95, 44) 는 폭 7 · 높이 12 가 겹치므로 “좌우”.</p>',
            hint: '<code>overlapX = Math.Min(ax + aw, bx + bw) - Math.Max(ax, bx)</code> — “두 오른쪽 끝 중 더 왼쪽” 에서 “두 왼쪽 끝 중 더 오른쪽” 을 뺀 값입니다. 세로도 똑같이 위 · 아래로 계산합니다.',
            starter: P2_STARTER,
            solution: P2_SOLUTION,
            expect: '공 (95, 44): 겹침 → 좌우 반사\n공 (120, 55): 겹침 → 상하 반사\n공 (150, 30): 겹침 → 상하 반사\n공 (130, 29): 겹침 → 상하 반사\n공 (60, 44): 안 겹침'
          }
        ],
        quiz: [
          { q: '속도 벡터가 <code>(vx, vy) = (3, -4)</code> 인 공은 매 프레임 화면에서 어느 쪽으로 움직이는가?', options: ['왼쪽 아래', '오른쪽 아래', '오른쪽 위', '왼쪽 위'], answer: 2, explain: 'x 가 늘어나므로 오른쪽, WPF 화면 좌표는 <b>y 가 아래로 커지므로</b> vy 가 음수이면 위쪽입니다. 빠르기(길이)는 √(3² + 4²) = 5 입니다.' },
          { q: '<code>DispatcherTimer</code> 의 <code>Interval</code> 을 16 ms 로 두면 Tick 은 1초에 대략 몇 번 일어나는가?', options: ['약 16번', '약 60번', '약 160번', '정확히 1000번'], answer: 1, explain: '1000 ÷ 16 ≈ 62. 게임에서 흔히 쓰는 “초당 60 프레임” 입니다. 컴퓨터가 바쁘면 조금 늦어질 수 있어 정확한 값은 아닙니다.' },
          { q: 'WPF 창의 생성자에 <code>while (true) { 공 이동; Thread.Sleep(16); }</code> 을 넣으면 어떻게 되는가?', options: ['타이머와 똑같이 잘 동작한다', '공이 두 배 빨라진다', '컴파일 오류가 난다', 'UI 스레드가 반복에 묶여 창이 그려지지도, 입력을 받지도 못한다'], answer: 3, explain: 'UI 스레드는 한 번에 한 가지 일만 합니다. 반복이 끝나지 않으면 화면 갱신 · 이벤트 처리가 모두 멈춰 “응답 없음” 이 됩니다. 그래서 타이머에게 “잠깐씩 불러 달라” 고 맡깁니다.' },
          { q: '패들이 x = 200, 너비 80 이다. 공 중심이 x = 270 에 맞았을 때 준비 예제 2 의 방식(hit × 60°)으로 계산한 반사 각도는?', options: ['+45°', '+30°', '−45°', '+70°'], answer: 0, explain: 'hit = (270 − 200) ÷ 80 × 2 − 1 = 0.875 × 2 − 1 = 0.75, 각도 = 0.75 × 60 = 45°. 오른쪽으로 45° 기울어 위로 튕겨 나갑니다.' },
          { q: '준비 예제 1 에서 오른쪽 벽 검사를 <code>if (x &gt; Width)</code> 로 쓰면 생기는 문제는?', options: ['아무 문제 없다', '공의 왼쪽 끝 기준이라 공 크기만큼 벽 속으로 파고든 뒤에야 튕긴다', '공이 왼쪽 벽에서 튕기지 않는다', '공이 멈춘다'], answer: 1, explain: '<code>x</code> 는 공의 <b>왼쪽 위</b> 좌표입니다. 오른쪽 벽에 닿는 것은 공의 오른쪽 끝 <code>x + Size</code> 이므로 <code>x + Size &gt; Width</code> 로 검사해야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '요구사항 분석과 설계', subtitle: '벽돌 깨기 — Canvas · 게임 루프 · 충돌 · 상태', badge: 'Project 10 · 1교시',
            notes: '<p><b>[도입 3분]</b> 완성 게임(4교시 완성 예제)을 먼저 실행해 30초 정도 플레이해 보입니다. 스페이스바로 시작, 일시정지, 패들 끝으로 받아 각도가 바뀌는 모습, 공을 일부러 떨어뜨려 생명이 주는 모습을 보여 줍니다.</p><p>발문: “이 게임을 만들려면 지금까지 배운 것 중 무엇이 필요할까요?” → Canvas, 도형, 타이머, 키보드 이벤트, 배열, enum, 클래스… 칠판에 적어 둡니다.</p>' },
          { layout: 'bullets', title: '무엇을 만들까?', lead: '고전 게임 “벽돌 깨기(Breakout)”',
            bullets: ['벽돌 5줄 × 8칸 — 깨면 점수 (윗줄일수록 높다)', '패들: ← → 키 또는 마우스로 좌우 이동', '공: 벽 · 패들 · 벽돌에서 튕긴다, 바닥에 빠지면 생명 −1', '스페이스바: 시작 · 일시정지 · 계속 · 새 게임', '레벨 2: 공이 더 빠르다', '마지막엔 클래스로 정리 (GameObject · Ball · Paddle · Brick · Game)'],
            notes: '<p><b>[2분]</b> 기능을 짧게 훑습니다. 게임 규칙 하나하나가 나중에 <code>if</code> 문 하나가 된다는 점을 강조하세요.</p><p>이번 프로젝트는 4교시 동안 “매 단계 실행되는 게임” 을 키워 가는 방식이라는 것도 알려 줍니다.</p>' },
          { layout: 'table', title: '요구사항 (F1 ~ F8)', head: ['번호', '기능', '핵심'], rows: [
            ['F1 · F2', '게임 판 · 벽돌', '480×360 Canvas, 벽돌 40개를 코드로'],
            ['F3', '패들 조작', '키 플래그 + 마우스, 판 밖 금지'],
            ['F4 · F5', '공 · 충돌', '속도 벡터, 벽 · 패들(각도) · 벽돌 반사'],
            ['F6', '생명', '바닥 → −1, 0 이면 게임 오버'],
            ['F7', '상태', '준비 · 진행 · 일시정지 · 게임 오버 · 클리어'],
            ['F8', '레벨', '레벨 2 = 공 속도 4.5 → 6']
          ], notes: '<p><b>[3분]</b> 본문의 요구사항 표를 줄인 판입니다. 학생에게 “여기에 하나를 더한다면?” 을 물어 보고 확장 과제 아이디어(아이템, 단단한 벽돌, 최고 점수)로 적어 둡니다.</p>' },
          { layout: 'diagram', title: '화면 설계 — Canvas 좌표', html: SVG_FIELD, caption: '(0, 0) 은 왼쪽 위, y 는 아래로 증가',
            notes: '<p><b>[4분]</b> 가장 자주 틀리는 부분: <b>y 가 아래로 커진다</b>. “공을 위로 보내려면 vy 는?” → 음수.</p><p>모든 물체 위치는 <b>왼쪽 위 모서리</b> 기준입니다. 공의 중심은 <code>x + 6</code>. 벽돌 한 줄의 폭 계산(10 + 8×54 + 7×4 = 470)을 칠판에서 같이 해 보세요.</p>' },
          { layout: 'table', title: '수치 설계', head: ['물체', '크기', '규칙'], rows: [
            ['패들 Rectangle', '80 × 12', 'y = 330, 속도 7 px/프레임'],
            ['공 Ellipse', '12 × 12', '빠르기 4.5 (레벨 2: 6)'],
            ['벽돌 Rectangle', '54 × 18', '(10, 40) 부터 칸 58 · 줄 22 간격'],
            ['점수', '—', '윗줄 50 · 40 · 30 · 20 · 10'],
            ['생명', '3', '♥ 문자 반복으로 표시']
          ], notes: '<p><b>[2분]</b> 숫자를 먼저 정해 두면 코드는 그 숫자를 옮겨 적기만 하면 됩니다. 나중에 밸런스(속도, 크기)를 바꾸기도 쉬워요.</p><p>이 값들은 코드에서 <code>const</code> 로 이름을 붙여 둘 것이라고 예고합니다.</p>' },
          { layout: 'diagram', title: '게임 루프', html: SVG_LOOP, caption: '입력 → 이동 → 충돌 → 그리기, 16 ms 마다',
            notes: '<p><b>[4분]</b> 영화 필름 비유: 1초에 60장의 조금씩 다른 그림. 한 장 = 프레임.</p><p>중요: 키보드 · 마우스 이벤트 처리기는 <b>기록만</b> 하고, 실제 이동은 루프에서 합니다. 2교시에 이 구조가 왜 좋은지 직접 비교합니다.</p><p>발문: “while 반복 + Thread.Sleep 으로 하면 안 될까?” → 창이 얼어붙는다. 17장에서 배운 “UI 스레드는 하나” 와 연결합니다.</p>' },
          { layout: 'diagram', title: '게임 상태 전이도', html: SVG_STATES, caption: '같은 스페이스바도 상태마다 다른 일을 한다',
            notes: '<p><b>[4분]</b> 상태 5개와 화살표를 하나씩 읽습니다. 특히 “진행 → 준비” 는 두 가지 경우(공 놓침, 레벨 1 클리어)라는 점.</p><p>상태가 없으면 <code>bool isPlaying, isPaused, isGameOver …</code> 같은 변수가 잔뜩 생기고, “둘 다 true” 같은 이상한 조합이 생깁니다. <code>enum</code> 하나면 늘 정확히 한 상태입니다.</p>' },
          { layout: 'code', title: '준비 1. 속도 벡터와 벽 반사', code: PREP_MOVE_SLIDE, points: ['매 프레임 <code>x += vx; y += vy;</code>', '벽 밖이면 ① 안으로 되돌리고 ② 부호 반전', '오른쪽 · 아래쪽은 <code>x + Size</code> 로 검사', '되돌리지 않으면 벽에 끼어 떤다'],
            notes: '<p><b>[4분]</b> 실행하고 출력의 프레임 3(천장), 5(오른쪽 벽), 8(바닥)을 짚습니다.</p><p>실험: 되돌리는 코드(<code>x = Width - Size;</code>)를 지우고 실행하면? 속도가 매 프레임 뒤집히는 “떨림” 이 생길 수 있음을 보여 주세요.</p>' },
          { layout: 'code', title: '준비 2. 충돌 판정 · 패들 각도', code: PREP_HIT_SLIDE, points: ['AABB: 가로도 세로도 겹치면 충돌', 'hit = −1(왼쪽 끝) ~ +1(오른쪽 끝)', '각도 = hit × 60°', 'WPF 에서는 <code>Rect.IntersectsWith</code>'],
            notes: '<p><b>[4분]</b> 두 선분이 겹치는 조건을 먼저 칠판에 1차원으로 그립니다: [a1, a2] 와 [b1, b2] 가 겹친다 ⇔ a1 &lt; b2 그리고 b1 &lt; a2. 2차원은 이것을 가로 · 세로 두 번.</p><p>각도: 가운데에 맞으면 똑바로 위, 끝에 맞을수록 옆으로 — 플레이어가 공의 방향을 조종할 수 있게 해 주는 게임 디자인 장치입니다.</p>' },
          { layout: 'two', title: '단계 1. 게임 화면 틀', left: { title: 'MainWindow.xaml (요약)', code: '<DockPanel Margin="10,4,10,10">\n  <Grid DockPanel.Dock="Top" Height="30">\n    <!-- 점수 · 레벨 · 생명 TextBlock 3개 -->\n  </Grid>\n  <Canvas x:Name="field" Width="480" Height="360"\n          Background="#10101C" ClipToBounds="True">\n    <Rectangle x:Name="paddle" Width="80" Height="12"\n               Canvas.Left="200" Canvas.Top="330"/>\n    <Ellipse x:Name="ball" Width="12" Height="12"\n             Canvas.Left="234" Canvas.Top="317"/>\n    <TextBlock x:Name="lblMessage" .../>\n  </Canvas>\n</DockPanel>', run: false }, right: { title: '포인트', bullets: ['DockPanel: 위 HUD, 나머지 게임 판', 'Canvas 의 <code>Background</code> 필수 (마우스)', '<code>ClipToBounds</code>: 판 밖은 잘라냄', '<code>x:Name</code> → 코드에서 <code>paddle</code>, <code>ball</code>', '<code>ResizeMode="NoResize"</code>'] },
            notes: '<p><b>[5분]</b> 본문의 단계 1 을 실행해 보여 줍니다. 안내 글에 “게임 판 480 × 360 · 패들 (200, 330)” 이 나오면 성공.</p><p>브라우저 실행 창 · Visual Studio 모두 같은 모습입니다. 학생들은 Visual Studio 에서 Breakout 프로젝트를 만들어 따라 하게 합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '패들이 x = 200, 너비 80. 공 중심 x = 270 에 맞았다. hit × 60° 로 계산한 각도는?', options: ['+45°', '+30°', '−45°', '+70°'], answer: 0, explain: 'hit = (270 − 200) ÷ 80 × 2 − 1 = 0.75 → 0.75 × 60 = 45°.',
            notes: '<p><b>[2분]</b> 손으로 계산하게 한 뒤 공개. 준비 예제 2 의 foreach 목록에 270.0 을 넣어 확인해 볼 수도 있습니다.</p>' },
          { layout: 'practice', title: '실습 P10-1 · P10-2', desc: 'P10-1: 바닥 = 놓침, 생명 3개로 시뮬레이션. P10-2: 겹친 폭 · 높이로 부딪힌 면(좌우 / 상하) 찾기.', starter: P1_STARTER, solution: P1_SOLUTION,
            notes: '<p><b>[실습 안내]</b> 두 실습 모두 콘솔이라 결과가 정확히 정해져 있습니다. P10-1 은 “놓침! 남은 생명 2” 가 프레임 8 에 나와야 합니다. P10-2 는 3교시 벽돌 충돌에서 그대로 쓰이므로 꼭 해 보게 하세요.</p><p>빨리 끝낸 학생: P10-2 에 공 (154, 50) 처럼 모서리에 걸친 경우를 추가해 보게 합니다(폭 = 높이일 때 “상하”).</p>' },
          { layout: 'summary', title: '1교시 정리', bullets: ['요구사항 → 기능 표 · 수치 표 · 상태 전이도', 'Canvas 좌표: 왼쪽 위 (0, 0), y 는 아래로', '게임 루프 = 타이머 Tick 마다 입력 → 이동 → 충돌 → 그리기', '반사 = 안으로 되돌리기 + 속도 부호 반전', '충돌 = 사각형 겹침(AABB), 패들 각도 = hit × 60°'],
            notes: '<p><b>[1분]</b> 다음 시간 예고: DispatcherTimer 로 공을 실제로 움직이고, 키보드 · 마우스로 패들을 조종합니다. Visual Studio 의 Breakout 프로젝트를 저장해 오게 하세요.</p>' }
        ]
      },

      /* ===================== p10-2 ===================== */
      {
        id: 'p10-2',
        title: '단계별 구현 ① — 게임 루프 · 패들 · 패들 충돌',
        minutes: 50,
        goals: [
          'DispatcherTimer 로 16 ms 마다 실행되는 게임 루프를 만들고, 창을 닫을 때 타이머를 멈출 수 있다',
          'KeyDown · KeyUp 으로 눌린 키 플래그를 관리해 패들을 부드럽게 움직일 수 있다',
          'MouseMove 와 GetPosition 으로 마우스를 따라가는 패들을 만들고 Math.Clamp 로 범위를 제한할 수 있다',
          'Rect.IntersectsWith 로 패들 충돌을 판정하고, 맞은 위치로 반사 각도를 정할 수 있다',
          '바닥으로 빠진 공을 처리해 생명을 줄이고 게임 오버를 표시할 수 있다'
        ],
        flow: [['1교시 복습', 3], ['단계 2 게임 루프', 12], ['단계 3 키보드 · 마우스 패들', 15], ['단계 4 패들 충돌 · 생명', 12], ['정리 · 퀴즈', 8]],
        content: [
          { type: 'h', text: '1. 단계 2 — DispatcherTimer 로 게임 루프 만들기' },
          { type: 'p', html: '게임 루프의 심장은 <code>DispatcherTimer</code> 입니다. 생성자에서 <code>Interval</code> 을 16 ms 로 정하고 <code>Tick</code> 에 <code>GameLoop</code> 메서드를 연결한 뒤 <code>Start()</code> 합니다. 그러면 WPF 가 약 16 ms 마다 <code>GameLoop</code> 를 불러 줍니다. 공의 좌표는 <code>double</code> 필드(<code>ballX</code>, <code>ballY</code>)에 따로 두고, 계산이 끝나면 <code>Canvas.SetLeft</code> · <code>Canvas.SetTop</code> 으로 도형에 옮깁니다. 이렇게 <b>“계산용 값”</b> 과 <b>“화면의 도형”</b> 을 나눠 두면 계산이 간단해집니다.' },
          { type: 'code', title: '단계 2. 게임 루프 — 네 벽에서 튕기는 공', code: STEP2,
            desc: '실행하면 공이 게임 판 안을 비스듬히 날아다니며 네 벽에서 튕기고, 왼쪽 위에 프레임 수가 올라갑니다. <code>GameLoop</code> 는 1교시 준비 예제 1 의 반복문 <b>본문 한 번</b>과 똑같습니다. 콘솔에서는 <code>for</code> 문이 반복을 돌렸지만, WPF 에서는 <b>타이머가 반복</b>을 대신합니다. 벽 검사에 숫자(480) 대신 <code>field.Width</code> · <code>ball.Width</code> 를 써서 XAML 에서 크기를 바꿔도 코드가 따라가게 했습니다. <code>Closed += (s, e) =&gt; timer.Stop();</code> 은 창이 닫힐 때 타이머를 멈추는 람다(11장)입니다.' },
          { type: 'callout', kind: 'warn', title: '창을 닫을 때 타이머를 멈추자', html: '<p>타이머는 창과 따로 살아 있는 객체라, 창을 닫아도 계속 Tick 을 보낼 수 있습니다. 이미 닫힌 창의 도형을 움직이는 쓸모없는 일을 하거나, 창을 여러 개 여는 프로그램이라면 타이머가 쌓여 느려집니다. <b>타이머를 <code>Start</code> 했다면 <code>Closed</code> 에서 <code>Stop</code></b> — 습관으로 만드세요.</p>' },
          { type: 'h', text: '2. 단계 3 — 키보드로 패들 움직이기: 눌린 키 플래그' },
          { type: 'p', html: '17장에서는 <code>KeyDown</code> 이 올 때마다 도형을 10 픽셀씩 옮겼습니다. 그런데 이 방법으로 게임을 하면 답답합니다. 키를 꾹 누르면 운영체제가 <b>처음 한 번</b> 보낸 뒤 <b>잠깐(약 0.5초) 쉬었다가</b> 자동 반복(auto-repeat)을 보내기 때문에, 패들이 “툭 … 드르륵” 움직입니다. 반복 속도도 컴퓨터 설정마다 다릅니다.' },
          { type: 'p', html: '게임에서는 이렇게 합니다. <code>KeyDown</code> 에서 <code>leftDown = true</code>, <code>KeyUp</code> 에서 <code>leftDown = false</code> 로 <b>“지금 눌려 있는가” 만 기록</b>하고(이런 bool 변수를 <b>플래그(flag)</b>라고 합니다), 게임 루프가 매 프레임 플래그를 보고 7 픽셀씩 옮깁니다. 그러면 키를 누르는 동안 <b>매 프레임 일정하게</b> 움직입니다.' },
          { type: 'table', head: ['방법', '코드', '움직임'], rows: [
            ['KeyDown 에서 바로 이동', '<code>KeyDown: x -= 10;</code>', '툭 … 드르륵, 반복 속도는 OS 설정에 따라 다름'],
            ['눌린 키 플래그 + 게임 루프', '<code>KeyDown: leftDown = true;</code><br><code>KeyUp: leftDown = false;</code><br><code>루프: if (leftDown) x -= 7;</code>', '누르는 동안 매 프레임 일정 — <b>게임에 적합</b>'],
            ['Keyboard.IsKeyDown 으로 묻기', '<code>루프: if (Keyboard.IsKeyDown(Key.Left)) x -= 7;</code>', '플래그와 같은 효과 (실습 P10-3 에서 사용)']
          ], caption: '키보드 처리 방법 비교' },
          { type: 'p', html: '마우스는 더 간단합니다. 게임 판(<code>Canvas</code>)의 <code>MouseMove</code> 에서 <code>e.GetPosition(field).X</code> 로 <b>게임 판 기준</b> 마우스 x 를 얻어 패들 가운데에 맞춥니다. 키보드든 마우스든 패들이 판 밖으로 나가면 안 되므로, 루프에서 <code>Math.Clamp(값, 최소, 최대)</code> 로 0 ~ 400 사이로 자릅니다.' },
          { type: 'code', title: '단계 3. 패들 조작 — 키 플래그와 마우스', code: STEP3,
            desc: '창을 한 번 클릭한 뒤 ← → 키를 눌러 보세요. 왼쪽 위에 두 플래그의 상태(ON / off)가 실시간으로 보입니다. 두 키를 동시에 누르면 두 플래그가 모두 ON 이 되어 제자리에 멈춥니다(−7 + 7 = 0). 마우스를 게임 판 위에서 움직이면 패들이 따라옵니다. 키 처리기는 <b>기록만</b>, 이동 · 범위 제한 · 그리기는 모두 <code>GameLoop</code> 에서 합니다. <code>Deactivated</code>(창이 비활성화됨)에서 두 플래그를 끄는 이유: 키를 누른 채 다른 창을 클릭하면 이 창은 <code>KeyUp</code> 을 영영 받지 못해 패들이 혼자 계속 움직이기 때문입니다.' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창에서 키보드가 안 먹을 때', html: '<ul><li>키 입력은 <b>포커스를 가진 창</b>으로만 갑니다. 실행 창이 뜨면 <b>게임 판을 한 번 클릭</b>한 뒤 키를 누르세요. 강의 페이지를 클릭하면 포커스가 창 밖으로 나가 키가 전달되지 않습니다(이때 스페이스바 · 방향키가 페이지를 스크롤할 수도 있습니다).</li><li>실제 WPF 에서도 같습니다. 창을 띄운 뒤 다른 프로그램을 클릭하면 게임 창은 키를 받지 않습니다. 그래서 <code>Deactivated</code> 에서 플래그를 꺼 둡니다.</li><li>이 게임 창에는 <code>Button</code> 을 두지 않았습니다. 버튼이 포커스를 가지면 <b>스페이스바가 버튼 클릭</b>으로 쓰여 게임 조작과 부딪히기 때문입니다.</li></ul>' },
          { type: 'h', text: '3. 단계 4 — 패들로 공 받기: 충돌과 반사 각도' },
          { type: 'p', html: '이제 바닥을 뚫고, 대신 패들로 공을 받습니다. 매 프레임 공과 패들을 <code>Rect</code> 로 만들어 <code>IntersectsWith</code> 로 겹침을 검사합니다. 겹치면 ① 공을 패들 <b>위로 꺼내고</b> ② 맞은 위치(<code>hit</code>, −1 ~ +1)로 각도를 정해 새 속도를 만듭니다. 각도에서 속도를 만드는 일은 <code>SetVelocity(각도)</code> 메서드로 뽑아 두어, 처음 발사할 때(20°)와 패들에 맞을 때 함께 씁니다.' },
          { type: 'figure', html: SVG_PADDLE, caption: '패들에 맞은 위치 → 반사 각도. 속도의 크기는 같고 방향만 바뀐다' },
          { type: 'code', title: '단계 4. 패들 충돌 · 반사 각도 · 생명', code: STEP4,
            desc: '패들 가운데로 받으면 공이 거의 수직으로, 끝으로 받으면 비스듬히 튀어 나갑니다. 공을 놓치면 오른쪽 위의 ♥ 가 하나 줄고 공이 패들 위에서 다시 발사됩니다. 세 번 놓치면 타이머가 멈추고 “게임 오버” 가 뜹니다. <code>new string(\'♥\', lives)</code> 는 같은 글자를 <code>lives</code> 개 이어 붙인 문자열입니다(10장). <b>④ 의 <code>vy &gt; 0</code> 조건</b>이 중요합니다 — 아래 주의 상자를 보세요.' },
          { type: 'callout', kind: 'warn', title: '“끈끈이 패들” 버그 — vy &gt; 0 을 빼먹으면', html: '<p>공이 빠르게 패들 옆구리로 들어오면 한 프레임 뒤에도 여전히 패들과 겹쳐 있을 수 있습니다. 이때 <code>vy &gt; 0</code>(내려오는 중) 검사가 없으면 “겹침 → 위로 반사 → 아직 겹침 → 또 반사 …” 가 반복되어 공이 패들에 달라붙어 떨거나 패들 속으로 파고듭니다. 그래서 <b>① 내려오는 공만</b> 튕기고 <b>② 공을 패들 위로 꺼내는</b> 두 가지를 함께 합니다. 1교시의 “벽 안으로 되돌리기” 와 같은 원리입니다.</p>' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 이벤트 연결과 게임 디버깅', html: '<ul><li><b>이벤트 연결</b>: XAML 에서 <code>&lt;Window</code> 태그 안에 <code>KeyDown="</code> 을 입력하면 <b>&lt;새 이벤트 처리기&gt;</b> 가 떠서 <code>Window_KeyDown</code> 을 자동으로 만들어 줍니다. 또는 디자이너에서 창을 고르고 속성 창의 ⚡(이벤트) 단추 ▸ <code>KeyDown</code> 칸을 더블클릭합니다. <code>Canvas</code> 의 <code>MouseMove</code> 도 같은 방법입니다.</li><li><b>중단점은 조심</b>: <code>GameLoop</code> 안에 중단점(<kbd>F9</kbd>)을 걸면 16 ms 마다 멈춰서 게임을 할 수 없습니다. 조건부 중단점(중단점 ▸ 오른쪽 클릭 ▸ <b>조건</b> — 예: <code>ballY &gt; 350</code>)을 쓰면 “공이 바닥 근처일 때만” 멈출 수 있습니다.</li><li><b>값 찍어 보기</b>: <code>System.Diagnostics.Debug.WriteLine($"vx={vx:F2}, vy={vy:F2}");</code> 은 <b>출력</b> 창(보기 ▸ 출력)에 글을 남깁니다. 게임을 멈추지 않고 값을 볼 수 있습니다. 단계 3 처럼 HUD 에 잠깐 표시해도 좋습니다.</li></ul>' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 고정 프레임 대신 “흐른 시간” 으로 움직이기', html: '<p>이 프로젝트는 “한 프레임에 4.5 픽셀” 처럼 속도를 정합니다. 그래서 컴퓨터가 느려 Tick 이 늦게 오면 게임 전체가 느려집니다. 본격적인 게임은 <code>System.Diagnostics.Stopwatch</code> 로 지난 프레임 이후 흐른 시간 <code>dt</code>(초)를 재고 <code>x += vx * dt</code> 처럼 “초당 픽셀” 로 움직입니다. 또 WPF 에는 화면을 새로 그릴 때마다 불리는 <code>CompositionTarget.Rendering</code> 이벤트도 있어, 타이머 대신 쓰면 더 매끄럽습니다(22장 더 알아보기).</p>' }
        ],
        practice: [
          {
            title: '실습 P10-3. 패들 조작 다듬기 — A · D 키와 Shift 가속',
            level: 1,
            desc: '<p>패들만 있는 연습 창입니다. 다음을 완성하세요.</p><ul><li><kbd>←</kbd> <kbd>→</kbd> 뿐 아니라 <kbd>A</kbd>(왼쪽) · <kbd>D</kbd>(오른쪽) 키로도 움직입니다(<code>KeyDown</code> · <code>KeyUp</code> 모두).</li><li>왼쪽 또는 오른쪽 <kbd>Shift</kbd> 를 누르고 있는 동안에는 속도가 두 배(12)가 됩니다. 점수 칸에 <code>속도 12 (Shift)</code> / <code>속도 6</code> 을 표시합니다.</li><li>창이 비활성화되면(<code>Deactivated</code>) 두 플래그를 모두 끕니다.</li></ul>',
            hint: '조건을 <code>e.Key == Key.Left || e.Key == Key.A</code> 처럼 <code>||</code> 로 묶습니다. Shift 는 플래그를 따로 만들지 않고 게임 루프에서 <code>Keyboard.IsKeyDown(Key.LeftShift) || Keyboard.IsKeyDown(Key.RightShift)</code> 로 “지금 눌려 있나” 를 직접 물어보면 됩니다.',
            starter: P3_STARTER,
            solution: P3_SOLUTION
          },
          {
            title: '실습 P10-4. 랠리와 가속 — 받을수록 빨라지는 공',
            level: 2,
            desc: '<p>단계 4 를 고쳐 “오래 버틸수록 어려워지는” 규칙을 넣습니다.</p><ul><li>공을 패들로 받아 낼 때마다 <b>랠리</b>(연속으로 받은 횟수)를 1 늘리고, 점수 칸에 <code>랠리 n · 속도 s</code> 를 표시합니다.</li><li>랠리가 5의 배수가 될 때마다 공의 빠르기 <code>ballSpeed</code> 를 1 올립니다. 단, 9 를 넘지 않습니다.</li><li>공을 놓치면 랠리는 0, 빠르기는 4 로 되돌립니다.</li></ul>',
            hint: '시작 코드에서 빠르기는 이미 <code>const</code> 가 아닌 변수 <code>ballSpeed</code> 입니다. 필드 <code>private int rally = 0;</code> 을 추가하고, 패들 충돌 블록에서 <code>SetVelocity</code> 를 부르기 <b>전에</b> 속도를 올려야 새 속도로 튕겨 나갑니다. “5의 배수” 는 <code>rally % 5 == 0</code>.',
            starter: P4_STARTER,
            solution: P4_SOLUTION
          }
        ],
        quiz: [
          { q: 'KeyDown 에서 바로 패들을 10 픽셀씩 옮기면, 키를 꾹 눌렀을 때 움직임이 “툭 … 드르륵” 이 되는 이유는?', options: ['DispatcherTimer 가 느려서', 'Canvas 가 다시 그리기를 늦게 해서', '운영체제가 첫 KeyDown 뒤 잠깐 쉬었다가 자동 반복 KeyDown 을 보내서', 'KeyUp 이 먼저 와서'], answer: 2, explain: '키 자동 반복은 “처음 한 번 → 약간의 지연 → 반복” 입니다. 게임은 <b>눌린 상태만 플래그로 기록</b>하고 매 프레임 일정하게 움직여 이 문제를 피합니다.' },
          { q: '다음 중 단계 3 에서 <code>Deactivated</code> 에 플래그를 끄는 코드를 넣은 이유로 옳은 것은?', options: ['키를 누른 채 다른 창을 누르면 KeyUp 이 오지 않아 패들이 계속 움직이므로', '창이 비활성화되면 타이머가 저절로 멈추므로', 'Deactivated 가 KeyDown 보다 먼저 오므로', '마우스를 쓰기 위해서'], answer: 0, explain: '포커스를 잃은 창은 키보드 이벤트를 받지 못합니다. 누른 상태로 기록된 플래그가 영원히 <code>true</code> 로 남지 않게 비활성화될 때 모두 “뗀 것” 으로 처리합니다.' },
          { q: '<code>Math.Clamp(450, 0, 400)</code> 과 <code>Math.Clamp(-20, 0, 400)</code> 의 결과는?', options: ['450, -20', '400, 0', '400, -20', '0, 400'], answer: 1, explain: '<code>Math.Clamp(값, 최소, 최대)</code> 는 값을 범위 안으로 잘라 줍니다. 최대보다 크면 최대, 최소보다 작으면 최소.' },
          { q: '단계 4 의 패들 충돌 검사에서 <code>vy &gt; 0 &amp;&amp;</code> 를 빼면 생길 수 있는 문제는?', options: ['공이 패들을 그냥 통과한다', '컴파일 오류가 난다', '패들이 움직이지 않는다', '겹친 상태가 두 프레임 이어지면 반사가 반복되어 공이 패들에 달라붙어 떤다'], answer: 3, explain: '이미 위로 튕긴 공이 아직 겹쳐 있으면 또 반사됩니다. <b>내려오는 공만</b> 튕기고, 공을 패들 위로 꺼내 두면 해결됩니다.' },
          { q: '<code>SetVelocity(0)</code> 을 호출하면 <code>BallSpeed = 5</code> 일 때 속도 <code>(vx, vy)</code> 는?', options: ['(5, 0)', '(0, 5)', '(0, -5)', '(-5, 0)'], answer: 2, explain: 'sin 0 = 0, cos 0 = 1 → vx = 0, vy = −5 × 1 = −5. 0° 는 “똑바로 위” 이고, 화면에서 위쪽은 y 가 줄어드는 방향이라 음수입니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ①', subtitle: '단계 2 게임 루프 → 단계 3 패들 조작 → 단계 4 패들 충돌', badge: 'Project 10 · 2교시',
            notes: '<p><b>[도입 3분]</b> 1교시 복습 발문: “게임 루프의 네 단계는?” → 입력 · 이동 · 충돌 · 그리기. “y 가 커지면?” → 아래.</p><p>오늘은 세 단계를 거쳐 “패들로 공을 받는 게임” 까지 갑니다.</p>' },
          { layout: 'two', title: '반복을 누가 돌리나?', left: { title: '콘솔 (1교시)', code: 'for (int frame = 1; frame <= 8; frame++)\n{\n    x += vx; y += vy;\n    // 벽 반사 ...\n    Console.WriteLine(...);\n}', run: false }, right: { title: 'WPF (단계 2)', code: 'timer.Interval = TimeSpan.FromMilliseconds(16);\ntimer.Tick += GameLoop;\ntimer.Start();\n\nvoid GameLoop(object sender, EventArgs e)\n{\n    x += vx; y += vy;   // 본문 한 번\n    // 벽 반사 ...\n    Canvas.SetLeft(ball, x);\n}', run: false },
            notes: '<p><b>[3분]</b> 왼쪽의 for 반복 “본문” 이 오른쪽 GameLoop 한 번과 같다는 것을 짚습니다. 반복은 타이머가 대신 돌립니다.</p><p>while + Sleep 금지 이유를 다시 한 번: UI 스레드가 묶이면 창이 얼어붙는다.</p>' },
          { layout: 'code', title: '최소 게임 루프', code: SLIDE_LOOP, points: ['<code>DispatcherTimer</code> 16 ms', 'Tick = 이동 → 충돌 → 그리기', '좌표는 <code>double</code> 필드에', '<code>Closed</code> 에서 <code>Stop()</code>'],
            notes: '<p><b>[4분]</b> 가장 작은 게임 루프입니다. 실행해 보이고 <code>Interval</code> 을 16 → 100 으로 바꿔 “뚝뚝 끊기는” 모습, <code>vx</code> 를 3 → 8 로 바꿔 빨라지는 모습을 보여 주세요.</p><p>학생 발문: “Interval 을 1 ms 로 하면 더 부드러울까?” → 화면 갱신(보통 60Hz)보다 빠르면 의미가 없고 CPU 만 씁니다.</p>' },
          { layout: 'two', title: 'KeyDown 에서 바로 vs 플래그', left: { title: '바로 이동 — 툭 … 드르륵', code: 'void Window_KeyDown(object s, KeyEventArgs e)\n{\n    if (e.Key == Key.Left) x -= 10;\n    Canvas.SetLeft(paddle, x);\n}', run: false }, right: { title: '플래그 + 루프 — 매끄럽게', code: 'KeyDown: if (e.Key == Key.Left) leftDown = true;\nKeyUp:   if (e.Key == Key.Left) leftDown = false;\n\nGameLoop:\n    if (leftDown) x -= 7;     // 매 프레임\n    x = Math.Clamp(x, 0, 400);', run: false },
            notes: '<p><b>[4분]</b> 17장 예제(방향키로 공 움직이기)를 떠올리게 합니다. 직접 키를 꾹 눌러 “툭 … 드르륵” 을 느껴 보게 하면 설득력이 큽니다.</p><p>핵심 문장: “이벤트 처리기는 기록만, 행동은 루프에서.”</p>' },
          { layout: 'code', title: '플래그로 패들 움직이기', code: SLIDE_KEYS, points: ['KeyDown · KeyUp 이 <b>같은 처리기</b>', '<code>e.IsDown</code>: 누름 true · 뗌 false', '루프에서 오른쪽 − 왼쪽', '<code>Math.Clamp</code> 로 0 ~ 240'],
            notes: '<p><b>[4분]</b> 처리기 하나를 KeyDown · KeyUp 에 함께 연결하고 <code>e.IsDown</code> 으로 구분하는 짧은 버전입니다. 창을 클릭하고 ← → 를 눌러 보여 줍니다.</p><p>두 키를 동시에 누르면 멈추는 것도 확인 — 7 − 7 = 0.</p>' },
          { layout: 'table', title: '입력 방식 정리', head: ['입력', '이벤트 / 방법', '패들 x'], rows: [
            ['← → 키', 'KeyDown · KeyUp → 플래그', '루프에서 ±7'],
            ['A · D, Shift', '<code>Keyboard.IsKeyDown(Key.A)</code>', '루프에서 직접 묻기'],
            ['마우스', 'Canvas.MouseMove', '<code>e.GetPosition(field).X − 40</code>'],
            ['공통', '—', '<code>Math.Clamp(x, 0, 480 − 80)</code>']
          ], notes: '<p><b>[2분]</b> <code>GetPosition(field)</code> 의 인자는 “어느 요소 기준 좌표인가” 입니다. <code>this</code>(창)를 넣으면 HUD 높이만큼 어긋난다는 점을 짚어 주세요.</p><p>브라우저에서는 창을 클릭해 포커스를 줘야 키가 먹는다는 점도 여기서 안내합니다.</p>' },
          { layout: 'diagram', title: '단계 4. 맞은 위치 → 각도', html: SVG_PADDLE, caption: 'hit × 60°, 속도 크기는 그대로',
            notes: '<p><b>[3분]</b> 공이 늘 같은 각도로만 튀면 게임이 단조롭습니다. 맞은 위치로 각도를 바꾸면 플레이어가 공을 “조준” 할 수 있어요.</p><p>sin · cos 가 낯선 학생에게: “빗변 길이(빠르기)는 그대로 두고, 가로 · 세로로 나누는 계산” 정도로 설명합니다.</p>' },
          { layout: 'two', title: '패들 충돌 코드', left: { title: '충돌 판정 + 반사', code: 'Rect ballRect = new Rect(ballX, ballY, 12, 12);\nRect paddleRect = new Rect(paddleX, 330, 80, 12);\nif (vy > 0 && ballRect.IntersectsWith(paddleRect))\n{\n    ballY = 330 - 12;           // 위로 꺼내기\n    double hit = (ballX + 6 - paddleX) / 80 * 2 - 1;\n    SetVelocity(Math.Clamp(hit, -1, 1) * 60);\n}', run: false }, right: { title: '각도 → 속도', code: 'void SetVelocity(double degrees)\n{\n    double rad = degrees * Math.PI / 180;\n    vx = BallSpeed * Math.Sin(rad);\n    vy = -BallSpeed * Math.Cos(rad);\n}', run: false },
            notes: '<p><b>[4분]</b> <code>vy &gt; 0</code> 조건과 “위로 꺼내기” 두 가지가 “끈끈이 패들” 을 막는다는 점을 강조합니다. 시간이 있으면 <code>vy &gt; 0 &amp;&amp;</code> 을 지우고 패들 옆구리로 공을 받아 떨리는 모습을 보여 주세요.</p><p><code>Math.Sin</code> 은 라디안을 받으므로 도 × π / 180 변환이 필요합니다.</p>' },
          { layout: 'table', title: '흔한 버그 모음', head: ['증상', '원인 · 해결'], rows: [
            ['키를 눌러도 반응 없음', '창에 포커스 없음 → 창을 클릭'],
            ['공이 벽에 끼어 떤다', '벽 안으로 되돌리지 않음'],
            ['공이 패들에 달라붙음', '<code>vy &gt; 0</code> 검사 · 위로 꺼내기 누락'],
            ['패들이 혼자 계속 감', 'KeyUp 을 못 받음 → Deactivated 에서 플래그 끄기'],
            ['마우스와 패들이 어긋남', '<code>GetPosition(this)</code> → <code>GetPosition(field)</code>']
          ], notes: '<p><b>[2분]</b> 실습 중 학생들이 가장 많이 겪는 문제들입니다. 막히면 이 표부터 보게 하세요.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>SetVelocity(0)</code>, <code>BallSpeed = 5</code> 일 때 <code>(vx, vy)</code> 는?', options: ['(5, 0)', '(0, 5)', '(0, -5)', '(-5, 0)'], answer: 2, explain: 'sin 0 = 0, cos 0 = 1 → (0, −5). 0° 는 똑바로 위, 위쪽은 y 가 줄어드는 방향.',
            notes: '<p><b>[2분]</b> “그럼 SetVelocity(90) 은?” 까지 이어 물어 보세요 → (5, 0), 오른쪽으로 수평. 패들에서는 ±60° 로 제한해 수평으로 튀는 일이 없게 했습니다.</p>' },
          { layout: 'practice', title: '실습 P10-3 · P10-4', desc: 'P10-3: A · D 키, Shift 가속, Deactivated. P10-4: 랠리 5번마다 공 가속(최대 9), 놓치면 초기화.', starter: P3_STARTER, solution: P3_SOLUTION,
            notes: '<p><b>[실습 안내]</b> P10-3 은 조건에 <code>||</code> 를 더하는 연습, <code>Keyboard.IsKeyDown</code> 으로 “플래그 없이 묻기” 를 경험하게 합니다. P10-4 는 <code>const</code> 를 변수로 바꾸는 이유(바뀌는 값)를 느끼게 하는 과제입니다.</p><p>확인: P10-4 에서 5번 받으면 “랠리 5 · 속도 5” 가 되어야 합니다.</p>' },
          { layout: 'summary', title: '2교시 정리', bullets: ['게임 루프 = DispatcherTimer 16 ms + Tick 처리기', '타이머는 Closed 에서 Stop', '키보드: KeyDown/KeyUp → 플래그, 이동은 루프에서', '마우스: <code>GetPosition(field)</code> + <code>Math.Clamp</code>', '패들 충돌: <code>vy &gt; 0</code> + <code>IntersectsWith</code> + 위로 꺼내기, 각도 = hit × 60°'],
            notes: '<p><b>[1분]</b> 다음 시간: 벽돌 40개를 코드로 만들고, 벽돌 충돌 · 점수 · 게임 상태 · 레벨 2 까지 완성합니다.</p>' }
        ]
      },

      /* ===================== p10-3 ===================== */
      {
        id: 'p10-3',
        title: '단계별 구현 ② — 벽돌 · 점수 · 게임 상태 · 레벨',
        minutes: 50,
        goals: [
          '2차원 배열과 중첩 for 문으로 벽돌 40개를 코드에서 만들어 Canvas 에 추가할 수 있다',
          '겹친 폭과 높이를 비교해 벽돌의 어느 면에 부딪혔는지 판단하고 반사할 수 있다',
          '벽돌을 Canvas.Children 과 배열에서 함께 제거하고 줄마다 다른 점수를 줄 수 있다',
          'enum GameState 와 switch 로 준비 · 진행 · 일시정지 · 게임 오버 · 클리어를 관리할 수 있다',
          '레벨이 바뀔 때 벽돌을 다시 채우고 공 속도를 높일 수 있다'
        ],
        flow: [['2교시 복습', 3], ['단계 5 벽돌 배치', 9], ['단계 6 벽돌 충돌 · 점수', 12], ['단계 7 게임 상태', 14], ['단계 8 레벨 2 · 정리 · 퀴즈', 12]],
        content: [
          { type: 'h', text: '1. 단계 5 — 벽돌을 코드로 만들기: 2차원 배열' },
          { type: 'p', html: '벽돌은 5줄 × 8칸, 모두 40개입니다. XAML 에 <code>&lt;Rectangle&gt;</code> 을 40번 쓰는 대신 <b>중첩 for 문</b>으로 만듭니다. 바깥 반복은 줄(<code>row</code>), 안쪽 반복은 칸(<code>col</code>)이고, 위치는 “첫 벽돌 위치 + 번호 × (크기 + 간격)” 으로 계산합니다. 만든 벽돌은 두 곳에 넣습니다. ① <code>field.Children.Add(brick)</code> — 화면에 보이게, ② <code>bricks[row, col] = brick</code> — 나중에 찾을 수 있게. 7장의 <b>2차원 배열</b> <code>Rectangle?[,]</code> 은 벽돌 배치와 모양이 같아서 “몇 번째 줄 몇 번째 칸” 을 그대로 표현합니다.' },
          { type: 'code', title: '단계 5. 벽돌 배치 — 2차원 배열로 40개 만들기', code: STEP5,
            desc: '실행하면 줄마다 색이 다른 벽돌 40개가 나타납니다. 벽돌을 클릭하면 사라지고 어느 칸이었는지(<code>[줄, 칸]</code>)와 점수가 표시됩니다. 클릭한 도형은 <code>e.OriginalSource</code> 로 알 수 있습니다(17장). <code>is not Rectangle clicked</code> 는 “Rectangle 이 아니면” 이라는 형식 패턴이고, 맞으면 <code>clicked</code> 변수에 담깁니다. 패들도 <code>Rectangle</code> 이므로 따로 제외했습니다. 벽돌을 지울 때는 <b>화면(<code>Children.Remove</code>)과 배열(<code>= null</code>) 둘 다</b>에서 지워야 합니다. 점수는 <code>Tag</code> 속성(아무 값이나 담아 두는 칸)에 넣어 두었습니다.' },
          { type: 'callout', kind: 'more', title: '📘 더 알아보기 — 2차원 배열 vs List', html: '<p>2차원 배열은 “몇째 줄” 이 바로 보여서 <b>줄마다 다른 점수</b>를 주거나 “같은 줄을 모두 지우기” 같은 규칙에 편합니다. 대신 깨진 자리를 <code>null</code> 로 남겨 두고 매번 건너뛰어야 합니다. <code>List&lt;Rectangle&gt;</code> 은 깨진 벽돌을 <code>Remove</code> 로 아예 빼 버리면 되므로 반복이 간단하고, <code>Count</code> 가 곧 남은 벽돌 수입니다. 이번 교시는 배열로, 4교시 완성판은 <code>List&lt;Brick&gt;</code> 으로 만들어 두 방식을 모두 봅니다.</p>' },
          { type: 'h', text: '2. 단계 6 — 벽돌 충돌과 점수' },
          { type: 'p', html: '매 프레임 모든 벽돌에 대해 공과 겹치는지 검사합니다. 겹친 벽돌을 찾으면 ① 부딪힌 면에 맞게 반사하고 ② 벽돌을 지우고 ③ 점수를 더한 뒤 <b>바로 끝냅니다</b>(한 프레임에 벽돌 하나). 부딪힌 면은 실습 P10-2 의 방법 그대로, <b>겹친 사각형의 폭과 높이</b>를 비교해 정합니다.' },
          { type: 'figure', html: SVG_BRICK, caption: '겹친 부분이 세로로 길쭉하면 옆면(vx 반전), 가로로 납작하면 윗면 · 아랫면(vy 반전)' },
          { type: 'code', title: '단계 6. 벽돌 충돌 · 점수 · 클리어', code: STEP6,
            desc: '단계 4 에 <code>CreateBricks()</code> 와 <code>HitBrick()</code> 을 더했습니다. 벽돌의 <code>Rect</code> 는 <code>Canvas.GetLeft/GetTop</code> 과 크기로 만듭니다. <code>Rect</code> 의 <code>Left</code> · <code>Right</code> · <code>Top</code> · <code>Bottom</code> 속성 덕분에 겹친 폭 · 높이 계산이 한 줄씩입니다. 점수는 <code>(Rows - row) * 10</code> 으로 윗줄(row 0)이 50점, 아랫줄(row 4)이 10점입니다. <code>return</code> 으로 한 프레임에 벽돌 하나만 깨는 이유: 두 벽돌 사이 틈에 맞아 두 개가 동시에 겹치면 속도를 두 번 뒤집어 <b>반사가 취소</b>되기 때문입니다. 벽돌을 모두 깨면 타이머를 멈추고 “클리어!” 를 띄웁니다.' },
          { type: 'table', head: ['증상', '원인', '해결'], rows: [
            ['공이 벽돌을 뚫고 지나간다', '공 속도가 벽돌 두께보다 커서 한 프레임에 “건너뜀”', '속도 ≤ 벽돌 높이(18) 유지, 또는 한 프레임을 여러 번 나눠 계산'],
            ['두 벽돌 사이에서 그냥 통과', '벽돌 두 개를 동시에 깨며 vy 를 두 번 반전', '한 프레임에 하나만 (<code>return</code>)'],
            ['깨진 벽돌에 또 맞는다', '<code>Children.Remove</code> 만 하고 배열은 그대로', '배열에도 <code>null</code>'],
            ['점수가 반대', '<code>row * 10</code> 으로 계산 (아랫줄이 높음)', '<code>(Rows - row) * 10</code>']
          ], caption: '벽돌 충돌의 흔한 버그' },
          { type: 'h', text: '3. 단계 7 — 게임 상태: enum 과 switch' },
          { type: 'p', html: '지금까지는 창이 뜨자마자 공이 날아가고, 끝나면 타이머를 멈췄습니다. 이제 1교시에 설계한 <b>상태 전이</b>를 넣습니다. 먼저 콘솔에서 “스페이스바를 누르면 어느 상태로 가는가” 만 따로 만들어 확인해 봅니다. 12장의 <code>enum</code> 과 <b>switch 식</b>(<code>상태 switch { … =&gt; … }</code>)을 씁니다.' },
          { type: 'code', title: '예제. 상태 전이를 콘솔에서 먼저 확인', code: STATE_CONSOLE,
            expect: 'Ready    --Space--> Playing\nPlaying  --Space--> Paused\nPaused   --Space--> Playing\nPlaying  --Miss --> Ready\nReady    --Space--> Playing\nPlaying  --Miss --> GameOver\nGameOver --Space--> Ready',
            desc: '<code>OnSpace</code> 는 상태만 받아 다음 상태를 돌려주는 <b>순수한 함수</b>라서 화면 없이도 시험할 수 있습니다. <code>_</code> 는 “나머지 모든 경우”(게임 오버 · 클리어)입니다. 생명 2개로 시작해 두 번 놓치자 게임 오버가 되고, 거기서 스페이스바를 누르면 새 게임(준비)이 됩니다. <code>{before,-8}</code> 은 8칸 왼쪽 정렬 서식이고, enum 값은 <code>ToString()</code> 되어 이름(<code>Ready</code>)으로 출력됩니다.' },
          { type: 'p', html: '이 규칙을 게임에 넣습니다. 핵심은 세 곳입니다. ① <b>스페이스바</b>: <code>switch (state)</code> 로 상태마다 다른 일. ② <b>게임 루프</b>: 준비 · 진행이 아니면 아무것도 하지 않고, 준비일 때는 공이 패들을 따라다님. ③ <b><code>SetState</code></b>: 상태를 바꿀 때 안내 글 · HUD 를 <b>한 곳에서</b> 갱신. 타이머는 이제 멈추지 않고 계속 돌며, 무엇을 할지는 상태가 정합니다.' },
          { type: 'code', title: '단계 7. 게임 상태 — 준비 · 진행 · 일시정지 · 게임 오버 · 클리어', code: STEP7,
            desc: '창이 뜨면 공이 패들 위에 얹혀 있고 “스페이스바를 누르면 시작합니다” 가 보입니다. 패들을 움직이면 공이 함께 따라옵니다(<code>StickBallToPaddle</code>). 스페이스바로 발사하고, 게임 중에 다시 누르면 일시정지, 한 번 더 누르면 계속합니다. 공을 놓치면 생명이 줄고 다시 <b>준비</b> 상태가 되어, 플레이어가 준비됐을 때 스페이스바로 발사합니다. 게임 오버나 클리어에서 스페이스바를 누르면 <code>NewGame()</code> 이 벽돌을 다시 채웁니다 — <code>CreateBricks</code> 는 먼저 남아 있던 벽돌을 <code>foreach</code> 로 치웁니다(2차원 배열도 <code>foreach</code> 로 모든 칸을 돕니다). <code>!e.IsRepeat</code> 은 스페이스바를 꾹 누를 때의 자동 반복을 무시해, 일시정지 ↔ 계속이 마구 바뀌지 않게 합니다. <code>e.Handled = true</code> 는 “이 키는 처리했음” 표시입니다.' },
          { type: 'callout', kind: 'tip', title: '상태를 바꾸는 곳은 한 군데로 — SetState', html: '<p><code>state = GameState.Paused;</code> 를 여기저기서 직접 쓰면, 어떤 곳에서는 안내 글을 바꾸고 어떤 곳에서는 깜빡하게 됩니다. <code>SetState(새 상태)</code> 메서드 하나로만 상태를 바꾸게 하면 “상태가 바뀌면 할 일”(안내 글, HUD, 준비 상태면 공을 패들 위로)을 <b>한 번만</b> 쓰면 됩니다. 4교시의 <code>Game</code> 클래스에서는 여기에 <code>Changed</code> 이벤트까지 붙입니다.</p>' },
          { type: 'h', text: '4. 단계 8 — 레벨 2: 더 빠른 공' },
          { type: 'p', html: '마지막 규칙은 레벨입니다. 공 빠르기를 상수 <code>BallSpeed</code> 에서 필드 <code>ballSpeed</code> 로 바꾸고, <code>level</code> 필드를 더합니다. 레벨 1 의 벽돌을 모두 깨면 <code>level = 2</code>, <code>ballSpeed = 6</code> 으로 바꾸고 벽돌을 다시 채운 뒤 <b>준비</b> 상태로 갑니다. 레벨 2 까지 깨면 <b>클리어</b>입니다. 바뀐 곳은 단계 7 에서 10줄 남짓뿐입니다 — 상태 기계를 잘 만들어 두면 규칙을 더하기 쉽습니다.' },
          { type: 'code', title: '단계 8. 레벨 2 — 절차적 완성판', code: STEP8,
            desc: '단계 7 과 비교해 ① 필드 <code>level</code> · <code>ballSpeed</code>, ② <code>NewGame</code> 에서 레벨 1 · 속도 4.5 로 초기화, ③ <code>remaining == 0</code> 일 때 레벨에 따라 “다음 레벨 준비” 또는 “클리어”, ④ 준비 안내 글과 HUD 에 레벨 표시, ⑤ <code>SetVelocity</code> 가 <code>ballSpeed</code> 사용 — 이 다섯 곳이 바뀌었습니다. 레벨 2 를 빨리 확인하려면 <code>Rows</code> 를 1 로 줄여 보세요(벽돌 8개). 이것으로 게임의 모든 규칙이 완성되었습니다. 다만 <code>MainWindow</code> 한 클래스에 필드가 20개 가까이, 메서드가 15개나 모여 있습니다. 4교시에 이것을 역할별 클래스로 나눕니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 게임 상태 추적하기', html: '<ul><li><b>조사식 창</b>: 디버깅 중 <b>디버그 ▸ 창 ▸ 조사식</b> 에 <code>state</code>, <code>remaining</code>, <code>level</code> 을 넣어 두면, 중단점에서 멈출 때마다 값이 한눈에 보입니다.</li><li><b>작업 중 변경(Hot Reload)</b>: 실행 중에 <code>PaddleSpeed</code> 같은 값을 고치고 도구 모음의 🔥(핫 다시 로드) 단추를 누르면, 게임을 다시 시작하지 않고 바뀐 코드가 적용되는 경우가 많습니다. 밸런스 조정에 편리합니다(필드 추가 등 큰 변경은 다시 시작 필요).</li><li><b>enum 과 switch</b>: <code>switch (state)</code> 를 입력하고 <kbd>Tab</kbd> 두 번(코드 조각) 또는 전구(💡) ▸ <b>누락된 case 추가</b>를 고르면 모든 enum 값의 <code>case</code> 가 자동으로 생깁니다.</li></ul>' }
        ],
        practice: [
          {
            title: '실습 P10-5. 단축키와 남은 벽돌 표시',
            level: 2,
            desc: '<p>단계 7 의 게임에 편의 기능을 더합니다.</p><ul><li><kbd>P</kbd> 키: 진행 중이면 일시정지, 일시정지 중이면 계속합니다. 준비 · 게임 오버 · 클리어 상태에서는 아무 일도 하지 않습니다(스페이스바와 다른 점).</li><li><kbd>Esc</kbd> 키: 어느 상태에서든 새 게임을 시작합니다.</li><li>점수 칸에 남은 벽돌 수도 함께 표시합니다. 예: <code>점수 30 · 벽돌 38</code></li></ul>',
            hint: '<code>Window_KeyDown</code> 의 <code>else return;</code> 앞에 <code>else if (e.Key == Key.P &amp;&amp; !e.IsRepeat) { … }</code> 와 <code>else if (e.Key == Key.Escape) NewGame();</code> 을 넣습니다. 상태 변경은 반드시 <code>SetState</code> 로. 벽돌 수는 <code>UpdateHud</code> 한 곳만 고치면 됩니다 — <code>HitBrick</code> 이 이미 <code>UpdateHud()</code> 를 부르기 때문입니다.',
            starter: P5_STARTER,
            solution: P5_SOLUTION
          },
          {
            title: '실습 P10-6. 상태 전이 함수 늘리기 (콘솔)',
            level: 1,
            desc: '<p>콘솔판 상태 기계에 두 함수를 완성하세요.</p><ul><li><code>OnAllBricks(level)</code>: 벽돌을 모두 깼을 때의 다음 상태 — 레벨 1 이면 <code>Ready</code>(다음 레벨 준비), 레벨 2 이면 <code>Cleared</code>.</li><li><code>KoreanName(s)</code>: 상태의 한글 이름 — 준비 · 진행 · 일시정지 · 게임 오버 · 클리어.</li></ul><p><code>Main</code> 은 “시작 → 레벨 1 클리어 → 시작 → 일시정지 → 계속 → 레벨 2 클리어 → 새 게임” 순서로 사건을 흘려 보냅니다.</p>',
            hint: '<code>OnAllBricks</code> 는 조건 연산자 한 줄로 됩니다. <code>KoreanName</code> 은 예제의 <code>OnSpace</code> 처럼 switch 식으로 쓰고, 마지막 갈래는 <code>_ =&gt; "클리어"</code>.',
            starter: P6_STARTER,
            solution: P6_SOLUTION,
            expect: '[레벨 1] 준비 → 진행  (Space)\n[레벨 2] 진행 → 준비  (AllBricks)\n[레벨 2] 준비 → 진행  (Space)\n[레벨 2] 진행 → 일시정지  (Space)\n[레벨 2] 일시정지 → 진행  (Space)\n[레벨 2] 진행 → 클리어  (AllBricks)\n[레벨 2] 클리어 → 준비  (Space)'
          }
        ],
        quiz: [
          { q: '벽돌 위치를 <code>OffsetX + col * (BrickW + Gap)</code> 로 계산한다. <code>OffsetX = 10, BrickW = 54, Gap = 4</code> 일 때 <code>col = 3</code> 인 벽돌의 왼쪽 x 는?', options: ['172', '184', '174', '226'], answer: 1, explain: '10 + 3 × (54 + 4) = 10 + 174 = 184. 첫 벽돌(col 0)은 10, 한 칸마다 58씩 오른쪽으로.' },
          { q: '공과 벽돌이 겹쳤는데 겹친 부분이 폭 3, 높이 10 이다. 어떻게 반사해야 하는가?', options: ['vx = -vx (옆면에 맞음)', 'vy = -vy (윗면 · 아랫면에 맞음)', '둘 다 뒤집는다', '반사하지 않는다'], answer: 0, explain: '겹친 부분이 세로로 길쭉(폭 &lt; 높이)하면 공이 <b>옆에서</b> 들어온 것입니다. 좌우 속도 <code>vx</code> 를 뒤집습니다.' },
          { q: '벽돌을 깰 때 <code>field.Children.Remove(brick)</code> 만 하고 <code>bricks[row, col] = null</code> 을 빼먹으면?', options: ['컴파일 오류', '벽돌이 화면에 남는다', '보이지 않는 벽돌에 공이 계속 부딪히고, 남은 벽돌 수도 틀어진다', '아무 문제 없다'], answer: 2, explain: '화면에서는 사라졌지만 배열에는 남아 있어 <code>HitBrick</code> 이 계속 그 벽돌과 충돌을 검사합니다. <b>화면과 데이터 두 곳</b>에서 함께 지워야 합니다.' },
          { q: '다음 코드의 출력은?<pre><code>enum S { Ready, Playing, Paused }\nS Next(S s) =&gt; s switch\n{\n    S.Ready   =&gt; S.Playing,\n    S.Playing =&gt; S.Paused,\n    _         =&gt; S.Playing\n};\nConsole.WriteLine(Next(Next(Next(S.Ready))));</code></pre>', options: ['Ready', 'Paused', 'Playing', '2'], answer: 2, explain: 'Ready → Playing → Paused → Playing. enum 값은 <code>WriteLine</code> 에서 이름으로 출력됩니다(숫자 1 이 아니라 <code>Playing</code>).' },
          { q: '단계 7 에서 스페이스바 처리에 <code>!e.IsRepeat</code> 조건을 넣은 이유는?', options: ['스페이스바를 꾹 누르면 자동 반복 KeyDown 이 계속 와서 일시정지 ↔ 계속이 마구 바뀌므로', '스페이스바가 두 번 눌려야 시작하게 하려고', 'KeyUp 을 막기 위해', '브라우저에서만 필요해서'], answer: 0, explain: '<code>IsRepeat</code> 은 자동 반복으로 온 KeyDown 이면 <code>true</code> 입니다. “한 번 누를 때 한 번” 동작해야 하는 키에는 이 검사를 넣습니다.' }
        ],
        slides: [
          { layout: 'title', title: '단계별 구현 ②', subtitle: '단계 5 벽돌 배치 → 6 벽돌 충돌 · 점수 → 7 게임 상태 → 8 레벨 2', badge: 'Project 10 · 3교시',
            notes: '<p><b>[도입 3분]</b> 2교시 결과(단계 4)를 실행해 보이고 발문: “게임으로서 무엇이 빠졌나?” → 벽돌, 점수, 시작/일시정지, 레벨.</p><p>오늘로 게임 규칙이 모두 완성됩니다.</p>' },
          { layout: 'bullets', title: '단계 5. 벽돌 40개를 코드로', lead: 'XAML 40번 대신 중첩 for 문',
            bullets: ['바깥 반복 = 줄(row), 안쪽 반복 = 칸(col)', '위치 = 시작점 + 번호 × (크기 + 간격)', '색 · 점수는 줄 번호로 정한다', '만든 벽돌은 두 곳에: <code>field.Children</code> + <code>bricks[row, col]</code>', '지울 때도 두 곳에서: <code>Remove</code> + <code>null</code>'],
            notes: '<p><b>[3분]</b> “화면에 보이는 것” 과 “프로그램이 기억하는 것” 이 따로라는 점이 핵심입니다. 도형만 지우면 프로그램은 아직 있다고 생각합니다.</p>' },
          { layout: 'code', title: '벽돌 배치', code: SLIDE_BRICKS, points: ['<code>new Rectangle[5, 8]</code> — 줄 × 칸', '<code>colors[row]</code> 로 줄마다 색', '<code>Canvas.SetLeft/SetTop</code> 으로 위치', '<code>Children.Add</code> 로 화면에'],
            notes: '<p><b>[4분]</b> 실행 후 숫자를 바꿔 보는 실험: 간격 4 → 0, 줄 5 → 8. 폭이 판을 넘지 않는지 계산으로 확인하는 습관을 들이게 합니다.</p><p>본문 단계 5 는 여기에 “클릭하면 지우기” 를 더한 판입니다.</p>' },
          { layout: 'diagram', title: '단계 6. 어느 면에 부딪혔나?', html: SVG_BRICK, caption: '겹친 사각형의 폭 &lt; 높이 → 옆면(vx), 아니면 윗면 · 아랫면(vy)',
            notes: '<p><b>[3분]</b> 실습 P10-2 에서 이미 해 본 계산입니다. 학생에게 그림의 두 경우를 손으로 가리키며 설명하게 해 보세요.</p><p>한계: 모서리에 정확히 맞으면 폭 ≈ 높이라 어느 쪽이든 될 수 있습니다 — 게임에서는 크게 티 나지 않습니다.</p>' },
          { layout: 'two', title: 'HitBrick — 찾기 · 반사 · 지우기 · 점수', left: { title: '충돌 검사', code: 'Rectangle? brick = bricks[row, col];\nif (brick == null) continue;       // 깨진 자리\nRect r = new Rect(Canvas.GetLeft(brick),\n                  Canvas.GetTop(brick), 54, 18);\nif (!b.IntersectsWith(r)) continue;\n\ndouble ox = Math.Min(b.Right, r.Right) - Math.Max(b.Left, r.Left);\ndouble oy = Math.Min(b.Bottom, r.Bottom) - Math.Max(b.Top, r.Top);\nif (ox < oy) vx = -vx; else vy = -vy;', run: false }, right: { title: '처리', code: 'field.Children.Remove(brick);   // 화면에서\nbricks[row, col] = null;        // 배열에서\nremaining--;\nscore += (Rows - row) * 10;     // 50 … 10점\nlblScore.Text = $"점수 {score}";\nreturn;                         // 한 프레임에 하나', run: false },
            notes: '<p><b>[4분]</b> <code>return</code> 이 왜 필요한지 질문: 두 벽돌 틈에 맞으면? → 두 번 뒤집혀 반사가 취소됩니다.</p><p>공이 벽돌을 “뚫는” 현상: 속도가 벽돌 두께(18)보다 크면 한 프레임에 건너뛸 수 있습니다. 레벨 2 속도 6 은 안전합니다.</p>' },
          { layout: 'code', title: '단계 7 준비 — 상태 전이 (콘솔)', code: STATE_SLIDE, points: ['<code>enum GameState</code> — 늘 정확히 하나', 'switch 식으로 “다음 상태”', '<code>_</code> = 나머지 모두', '화면 없이 규칙만 시험'],
            notes: '<p><b>[4분]</b> 실행하면 Ready → Playing → Paused → Playing → Paused, 그리고 GameOver → Ready. 상태 전이도(1교시 그림)와 한 줄씩 대조해 보게 합니다.</p><p>bool 여러 개 대신 enum 하나를 쓰는 이유: “isPlaying 도 true, isPaused 도 true” 같은 불가능한 조합이 원천적으로 사라진다.</p>' },
          { layout: 'diagram', title: '게임 상태 전이도 (다시)', html: SVG_STATES, caption: '이 그림 = 스페이스바 switch + 루프의 상태 검사',
            notes: '<p><b>[2분]</b> 이제 이 그림을 코드로 옮길 차례입니다. 화살표마다 코드의 어느 줄이 되는지 예고합니다: Space 화살표 → <code>Window_KeyDown</code> 의 switch, 놓침 → <code>UpdateBall</code>, 벽돌 0개 → <code>remaining == 0</code>.</p>' },
          { layout: 'two', title: '단계 7 의 세 가지 핵심', left: { title: '스페이스바 = switch', code: 'switch (state)\n{\n    case GameState.Ready:\n        SetVelocity(20); SetState(GameState.Playing); break;\n    case GameState.Playing: SetState(GameState.Paused); break;\n    case GameState.Paused:  SetState(GameState.Playing); break;\n    default:                NewGame(); break;\n}', run: false }, right: { title: '루프 = 상태 확인', code: 'if (state != GameState.Ready &&\n    state != GameState.Playing) return;   // 멈춤\n\n// 패들 이동 ...\nif (state == GameState.Ready) StickBallToPaddle();\nelse UpdateBall();\nDraw();', run: false },
            notes: '<p><b>[4분]</b> 세 번째 핵심은 <code>SetState</code>: 상태를 바꾸는 곳을 하나로 모아 안내 글 · HUD · 공 위치를 함께 갱신합니다.</p><p>타이머는 멈추지 않고 계속 돈다 — 무엇을 할지는 상태가 정한다. 일시정지도 타이머를 멈추는 게 아니라 루프가 “아무것도 안 하는” 것.</p>' },
          { layout: 'bullets', title: '단계 8. 레벨 2', lead: '단계 7 에서 다섯 곳만 바뀐다',
            bullets: ['상수 <code>BallSpeed</code> → 필드 <code>ballSpeed</code> (+ <code>level</code>)', '<code>NewGame</code>: level 1, 속도 4.5', '벽돌 0개: 레벨 1 이면 level 2 · 속도 6 · 벽돌 다시 · 준비', '레벨 2 에서 벽돌 0개 → 클리어', '안내 글 · HUD 에 레벨 표시'],
            notes: '<p><b>[3분]</b> 레벨 2 를 빨리 보여 주려면 <code>Rows = 1</code> 로 바꿔 실행하세요(벽돌 8개).</p><p>“상태 기계를 잘 만들어 두면 규칙 추가가 쉽다” 는 경험을 강조합니다. 하지만 MainWindow 가 너무 커졌다는 문제 제기로 4교시를 예고합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '공과 벽돌의 겹친 부분이 폭 3, 높이 10 이다. 올바른 반사는?', options: ['vx = -vx (옆면에 맞음)', 'vy = -vy (윗면 · 아랫면)', '둘 다 뒤집기', '반사 없음'], answer: 0, explain: '세로로 길쭉한 겹침 = 옆에서 들어옴 → 좌우 속도 반전.',
            notes: '<p><b>[2분]</b> 이어서 “폭 12, 높이 2 라면?” → vy 반전. 그림(단계 6)을 다시 띄워 확인합니다.</p>' },
          { layout: 'practice', title: '실습 P10-5 · P10-6', desc: 'P10-5: P 키 일시정지, Esc 새 게임, 남은 벽돌 표시. P10-6: 콘솔 상태 기계에 OnAllBricks · KoreanName 추가.', starter: P6_STARTER, solution: P6_SOLUTION,
            notes: '<p><b>[실습 안내]</b> P10-6(콘솔)을 먼저 하면 상태 개념이 정리되고, P10-5 에서 그것을 실제 게임에 적용합니다. P10-5 에서 상태를 <code>state = …</code> 로 직접 바꾼 학생이 있으면 안내 글이 안 바뀌는 문제를 보여 주고 <code>SetState</code> 를 쓰게 하세요.</p>' },
          { layout: 'summary', title: '3교시 정리', bullets: ['벽돌: 2차원 배열 + 중첩 for, 화면 · 배열 두 곳에서 관리', '벽돌 반사: 겹친 폭 &lt; 높이 → vx, 아니면 vy', '한 프레임에 벽돌 하나 (<code>return</code>)', '<code>enum GameState</code> + switch + <code>SetState</code> 한 곳', '레벨 2: 필드 두 개와 “벽돌 0개” 처리만 추가'],
            notes: '<p><b>[1분]</b> 다음 시간: 이 게임을 GameObject · Ball · Paddle · Brick · Game 클래스로 정리하고, 단단한 벽돌 · 최고 점수 같은 확장에 도전합니다. 9장(상속 · 다형성)을 복습해 오게 하세요.</p>' }
        ]
      },

      /* ===================== p10-4 ===================== */
      {
        id: 'p10-4',
        title: '완성과 확장',
        minutes: 50,
        goals: [
          '한 클래스에 몰린 게임 코드를 역할(물체 · 규칙 · 화면)에 따라 여러 클래스로 나눌 수 있다',
          '추상 클래스 GameObject 에 공통 속성(위치 · 크기 · Bounds · Draw)을 모으고 Ball · Paddle · Brick 이 상속하게 할 수 있다',
          'Game 클래스가 규칙과 상태를 맡고, 이벤트(Changed)로 화면(MainWindow)에 변화를 알리게 할 수 있다',
          'virtual · override 로 새 종류의 벽돌을 기존 코드를 거의 고치지 않고 추가할 수 있다',
          '완성 게임을 점검하고 개선 · 확장 아이디어를 구현할 수 있다'
        ],
        flow: [['리팩터링 동기 · 클래스 설계', 10], ['완성 프로그램 읽기', 12], ['실행 · 점검', 5], ['확장 과제', 18], ['발표 · 정리', 5]],
        content: [
          { type: 'h', text: '1. 왜 클래스로 나누나?' },
          { type: 'p', html: '단계 8 은 잘 동작하지만 <code>MainWindow</code> 한 클래스에 공 · 패들 · 벽돌의 좌표, 점수 · 생명 · 레벨 · 상태, 키 처리, 화면 갱신이 모두 섞여 있습니다. 공의 좌표는 <code>ballX</code> · <code>ballY</code> · <code>vx</code> · <code>vy</code> 네 변수에 흩어져 있고, “공에 관한 코드” 를 찾으려면 파일 전체를 뒤져야 합니다. 새 기능(예: 두 번 맞아야 깨지는 벽돌)을 넣으려면 어디를 고쳐야 할지도 막막합니다.' },
          { type: 'p', html: '동작은 그대로 두고 코드의 구조만 더 좋게 바꾸는 일을 <b>리팩터링(refactoring)</b>이라고 합니다. 이번에는 “누가 무엇을 책임지나” 를 기준으로 나눕니다. <b>물체</b>(공 · 패들 · 벽돌)는 자기 위치와 움직임을, <b>Game</b> 은 게임 규칙과 상태를, <b>MainWindow</b> 는 입력 전달과 화면 표시를 책임집니다.' },
          { type: 'figure', html: SVG_CLASSES, caption: '완성 프로그램의 클래스 구조 — 빈 삼각형은 상속(is-a), 마름모는 합성(has-a)' },
          { type: 'table', head: ['클래스', '파일', '책임', '단계 8 의 어디에서 왔나'], rows: [
            ['<code>GameObject</code> (abstract)', 'GameObject.cs', '위치 · 크기 · WPF 도형 · 충돌 사각형(<code>Bounds</code>) · <code>Draw()</code>', '<code>new Rect(ballX, …)</code>, <code>Canvas.SetLeft(…)</code> 반복'],
            ['<code>Ball</code>', 'Ball.cs', '속도 · 발사 · 이동 · 벽/패들/벽돌 반사', '<code>ballX</code> · <code>vx</code> · <code>SetVelocity</code> · 반사 코드'],
            ['<code>Paddle</code>', 'Paddle.cs', '좌우 이동 · 범위 제한 · 맞은 위치 계산', '<code>paddleX</code> · <code>Math.Clamp</code> · <code>hit</code> 계산'],
            ['<code>Brick</code>', 'Brick.cs', '점수 · 맞았을 때 깨지는지(<code>virtual Hit()</code>)', '<code>Rectangle?[,]</code> · <code>(Rows - row) * 10</code>'],
            ['<code>Game</code>', 'Game.cs', '상태 · 점수 · 생명 · 레벨, 한 프레임 진행(<code>Update</code>), <code>Changed</code> 이벤트', '<code>state</code> · <code>SetState</code> · <code>GameLoop</code> · <code>HitBrick</code>'],
            ['<code>MainWindow</code>', 'MainWindow.xaml(.cs)', '타이머 · 키/마우스를 Game 에 전달 · HUD 표시', '이벤트 처리기 · <code>UpdateHud</code>']
          ], caption: '클래스별 책임' },
          { type: 'h', text: '2. 설계를 콘솔에서 먼저 시험하기' },
          { type: 'p', html: '클래스 설계가 맞는지 WPF 없이 먼저 확인해 봅니다. 아래 콘솔 프로그램은 도형 없이 <b>위치 · 크기 · 충돌 · 다형성</b>만 가진 작은 판입니다. <code>Brick</code> 의 <code>Hit()</code> 를 <code>virtual</code> 로 두고, 두 번 맞아야 깨지는 <code>HardBrick</code> 이 <code>override</code> 합니다. 게임 코드는 벽돌의 실제 종류를 모른 채 <code>hit.Hit()</code> 만 부릅니다(9장의 다형성).' },
          { type: 'code', title: '예제. 클래스 설계 시험 — 상속과 다형성 (콘솔)', code: CLASS_CONSOLE,
            expect: '프레임  3: 공(80, 76) → 벽돌40(68, 62) 맞음 → 깨짐!\n프레임 14: 공(80, 52) → 단단한벽돌[2](68, 40) 맞음 → 금이 감\n프레임 28: 공(80, 52) → 단단한벽돌[1](68, 40) 맞음 → 깨짐!\n점수 140, 남은 벽돌 0개',
            desc: '공은 위로 올라가 아래 벽돌(40점)을 먼저 깨고, 위쪽의 단단한 벽돌은 두 번째 맞았을 때 깨집니다. <code>bricks</code> 는 <code>List&lt;Brick&gt;</code> 이지만 그 안에 <code>HardBrick</code> 도 들어갑니다(“단단한 벽돌은 벽돌이다”, is-a). <code>hit.Hit()</code> 는 변수 형식이 아니라 <b>실제 객체</b>의 메서드가 불립니다. <code>Name</code> 도 추상 속성이라 종류마다 다른 이름이 나옵니다. <code>bricks.Find(조건)</code> 은 조건에 맞는 첫 요소를, 없으면 <code>null</code> 을 돌려줍니다(11장 람다). <code>--hitsLeft == 0</code> 은 “먼저 1 줄이고, 0 이 되었나?” 입니다.' },
          { type: 'h', text: '3. 완성 프로그램' },
          { type: 'p', html: '이제 단계 8 을 클래스로 나눈 완성판입니다. 파일은 7개(<code>MainWindow.xaml</code> · <code>MainWindow.xaml.cs</code> · <code>GameObject.cs</code> · <code>Ball.cs</code> · <code>Paddle.cs</code> · <code>Brick.cs</code> · <code>Game.cs</code>)이고, 게임 규칙과 화면 모습은 단계 8 과 <b>똑같습니다</b>. 패들 · 공 · 벽돌 도형은 XAML 이 아니라 각 클래스의 생성자가 만들고, <code>Game</code> 이 게임 판(<code>Canvas</code>)에 넣습니다.' },
          { type: 'code', title: '완성 예제. 클래스로 정리한 벽돌 깨기', code: FINAL,
            desc: '<b>MainWindow</b> 는 아주 얇아졌습니다. 타이머 Tick 마다 <code>game.Update()</code> 한 줄, 키와 마우스는 <code>game.LeftDown</code> · <code>game.PressSpace()</code> · <code>game.MovePaddleTo()</code> 로 넘기기만 합니다. <code>Game</code> 은 화면의 <code>TextBlock</code> 을 모릅니다. 점수 · 생명 · 상태가 바뀌면 <code>Changed</code> 이벤트(11장)로 “바뀌었어요” 라고 알리고, <code>MainWindow</code> 가 <code>UpdateHud</code> 에서 <code>game.Score</code> · <code>game.Message</code> 를 읽어 표시합니다. <b>GameObject</b> 의 <code>Bounds</code> 속성 덕분에 충돌 검사는 <code>Ball.Bounds.IntersectsWith(b.Bounds)</code> 처럼 읽기 쉬워졌고, <code>Draw()</code> 하나로 모든 물체를 그립니다. <b>Ball</b> 의 <code>BounceOff</code> 는 패들용(<code>Paddle</code>)과 벽돌용(<code>Rect</code>) 두 가지로 <b>오버로드</b>했습니다. <code>Game.CheckBricks</code> 는 LINQ <code>FirstOrDefault</code> 로 겹친 벽돌 하나를 찾고, <code>hit.Hit()</code> 가 <code>true</code> 일 때만 지웁니다 — 확장 과제 1 의 단단한 벽돌을 위한 자리입니다. <code>public Ball Ball { get; }</code> 처럼 속성 이름과 형식 이름이 같아도 C# 은 문맥으로 구분합니다.' },
          { type: 'callout', kind: 'vs', title: 'Visual Studio 에서 — 클래스 파일 추가와 리팩터링 도구', html: '<ul><li><b>클래스 파일 추가</b>: 솔루션 탐색기에서 프로젝트를 오른쪽 클릭 ▸ <b>추가</b> ▸ <b>클래스</b>(<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>) ▸ 이름 <code>Ball.cs</code>. 네임스페이스가 프로젝트 이름으로 자동으로 들어갑니다. <code>public class Ball : GameObject</code> 처럼 부모를 적어 주세요.</li><li><b>메서드 추출</b>: 긴 코드 부분을 선택하고 <kbd>Ctrl</kbd>+<kbd>.</kbd>(빠른 작업) ▸ <b>메서드 추출</b>을 고르면 새 메서드로 뽑아 줍니다. 단계 8 의 “패들 충돌” 부분을 뽑아 보세요.</li><li><b>이름 바꾸기</b>: 변수 위에서 <kbd>Ctrl</kbd>+<kbd>R</kbd>, <kbd>Ctrl</kbd>+<kbd>R</kbd> 을 누르면 그 변수를 쓰는 모든 곳의 이름이 함께 바뀝니다.</li><li><b>클래스 다이어그램</b>: 개별 구성 요소로 “클래스 디자이너” 를 설치했다면 프로젝트 오른쪽 클릭 ▸ <b>보기</b> ▸ <b>클래스 다이어그램 보기</b>로 위 그림 같은 상속 구조를 자동으로 그려 볼 수 있습니다.</li></ul>' },
          { type: 'callout', kind: 'info', title: '브라우저 실행 창과 실제 WPF 의 차이', html: '<ul><li>브라우저의 WPF 는 실제 WPF 를 흉내 낸 것이라, 타이머 간격이 조금 불규칙해 공이 가끔 미세하게 끊겨 보일 수 있습니다. Visual Studio 로 실행하면 훨씬 매끄럽습니다.</li><li>키 입력은 실행 창을 한 번 클릭해 포커스를 준 뒤에 동작합니다. 강의 페이지에 포커스가 있으면 스페이스바 · 방향키가 페이지를 스크롤할 수 있습니다.</li><li>실제 WPF 의 <code>Rect</code> 에는 겹친 사각형을 돌려주는 <code>Rect.Intersect(a, b)</code> 도 있지만, 이 강좌는 브라우저에서도 동작하도록 겹친 폭 · 높이를 <code>Math.Min</code> · <code>Math.Max</code> 로 직접 계산했습니다.</li></ul>' },
          { type: 'h', text: '4. 실행 · 점검 체크리스트' },
          { type: 'list', items: [
            '처음 화면: 벽돌 40개, 패들 위의 공, “스페이스바를 누르면 시작합니다”, HUD 에 <code>점수 0 · 레벨 1 · 준비 · 생명 ♥♥♥</code>',
            '준비 상태에서 패들을 움직이면 공이 따라온다 / 스페이스바로 발사',
            '패들 가운데로 받으면 거의 수직, 끝으로 받으면 비스듬히',
            '벽돌을 깨면 점수가 50 · 40 · 30 · 20 · 10 씩 오른다 (윗줄일수록 높게)',
            '진행 중 스페이스바 → 일시정지(모든 것이 멈춤), 다시 → 계속',
            '공을 놓치면 ♥ 하나가 줄고 준비 상태 / 세 번 놓치면 게임 오버 → 스페이스바로 새 게임',
            '레벨 1 을 모두 깨면 “레벨 2 — 공이 빨라집니다!” / 레벨 2 도 깨면 “모두 클리어!”'
          ] },
          { type: 'h', text: '5. 개선 아이디어' },
          { type: 'table', head: ['주제', '방향', '관련 장'], rows: [
            ['수직 반복 막기', '패들 한가운데로만 받으면 공이 0° 로 같은 기둥만 오르내린다 → <code>Launch</code> 각도를 최소 ±8° 로 (<code>Math.Abs(각도) &lt; 8</code> 이면 8 또는 −8)', '4장 조건문'],
            ['아이템', '벽돌이 깨질 때 가끔 떨어지는 아이템 — 패들 넓히기 · 공 느리게. <code>Item : GameObject</code>', '9장 상속'],
            ['효과음', '<code>System.Media.SystemSounds.Beep.Play()</code> 또는 <code>MediaPlayer</code> (실제 WPF 만)', '—'],
            ['공 여러 개', '<code>Ball</code> 하나 → <code>List&lt;Ball&gt;</code>, 모두 놓치면 생명 감소', '7장 컬렉션'],
            ['레벨 맵', '문자열 배열 <code>"XX..XX.."</code> 로 레벨마다 다른 벽돌 모양', '10장 문자열'],
            ['최고 점수 저장', '<code>File.WriteAllText("best.txt", …)</code> 로 프로그램을 껐다 켜도 유지', '10장 파일'],
            ['시간 기반 이동', '<code>Stopwatch</code> 로 흐른 시간만큼 이동 — 컴퓨터 속도와 무관하게', '22장']
          ], caption: '더 해 볼 만한 것들' },
          { type: 'h', text: '6. 확장 과제' },
          { type: 'p', html: '아래 두 과제 중 하나 이상을 골라 완성하세요. 두 과제 모두 시작 코드는 완성 예제에 <code>TODO</code> 주석을 붙인 것입니다. 목표는 <b>기존 코드를 되도록 적게 고치고</b> 기능을 더하는 것 — 클래스로 나눈 효과를 직접 느껴 보는 과제입니다.' }
        ],
        practice: [
          {
            title: '확장 과제 1. 두 번 맞아야 깨지는 단단한 벽돌 (★★)',
            level: 2,
            desc: '<p>맨 윗줄 8개를 <b>단단한 벽돌</b>로 바꿉니다.</p><ul><li><code>Brick</code> 을 상속한 <code>HardBrick</code> 클래스를 만듭니다(새 파일 <code>HardBrick.cs</code> 또는 <code>Brick.cs</code> 안). 색은 <code>Brushes.Silver</code>, 점수는 100.</li><li><code>Hit()</code> 를 재정의해, 첫 번째로 맞으면 색을 <code>Brushes.DimGray</code> 로 바꾸고 <code>false</code>(안 깨짐), 두 번째에 <code>true</code> 를 돌려줍니다.</li><li><code>Game.CreateBricks</code> 에서 <code>row == 0</code> 이면 <code>HardBrick</code> 을 만듭니다. <code>Game</code> 의 다른 부분은 고치지 않습니다!</li></ul>',
            hint: '생성자는 <code>public HardBrick(double x, double y) : base(x, y, Brushes.Silver, 100) { }</code>. 남은 횟수는 <code>private int hitsLeft = 2;</code>. 도형 색은 상속받은 <code>Shape.Fill</code> 로 바꿉니다. <code>CreateBricks</code> 에서는 <code>Brick brick = row == 0 ? new HardBrick(x, y) : new Brick(…);</code> 처럼 변수 형식을 <code>Brick</code> 으로 두면 두 종류를 한 변수에 담을 수 있습니다.',
            starter: EXT1_STARTER,
            solution: EXT1_SOLUTION
          },
          {
            title: '확장 과제 2. 최고 점수와 클리어 보너스 (★★)',
            level: 2,
            desc: '<p>게임을 여러 번 해도 남는 <b>최고 점수</b>와, 모두 클리어했을 때의 <b>생명 보너스</b>를 넣습니다.</p><ul><li><code>Game</code> 에 <code>HighScore</code> 속성(읽기 공개, 쓰기 private)을 추가합니다. <code>NewGame</code> 에서 초기화하지 않습니다.</li><li>게임 오버가 되기 직전, 그리고 클리어했을 때 <code>Score</code> 가 <code>HighScore</code> 보다 크면 갱신합니다.</li><li>레벨 2 까지 클리어하면 <b>남은 생명 × 100</b> 점을 더한 뒤 최고 점수를 갱신하고, 안내 글에 <code>모두 클리어! 생명 보너스 +200 · 점수 1400</code> 처럼 표시합니다.</li><li>HUD 점수 칸: <code>점수 120 · 최고 1400</code></li></ul>',
            hint: '갱신 코드 <code>if (Score &gt; HighScore) HighScore = Score;</code> 를 <code>UpdateHighScore()</code> 메서드로 만들어 두 곳에서 부르세요. <code>else SetState(…);</code> 한 줄을 <code>else { …; SetState(…); }</code> 블록으로 바꾸면 됩니다. HUD 는 <code>MainWindow.UpdateHud</code> 의 한 줄만 고칩니다 — Game 이 <code>Changed</code> 로 알려 주므로 따로 부를 필요가 없습니다.',
            starter: EXT2_STARTER,
            solution: EXT2_SOLUTION
          }
        ],
        quiz: [
          { q: '완성판의 <code>Game</code> 클래스는 HUD 의 <code>TextBlock</code> 을 직접 바꾸지 않고 <code>Changed</code> 이벤트만 발생시킨다. 이렇게 한 가장 큰 이유는?', options: ['이벤트가 TextBlock 보다 빠르기 때문에', 'Game 이 화면 모습을 몰라도 되게 해서, 화면을 바꿔도 Game 을 고치지 않게 하려고', 'TextBlock 은 다른 클래스에서 접근할 수 없어서', '타이머가 이벤트만 부를 수 있어서'], answer: 1, explain: '규칙(Game)과 화면(MainWindow)을 분리하면, HUD 모양을 바꾸거나 HUD 를 다른 창에 옮겨도 Game 은 그대로입니다. 20장 MVVM 의 “ViewModel 은 View 를 모른다” 와 같은 생각입니다.' },
          { q: '<code>List&lt;Brick&gt; bricks</code> 에 <code>new HardBrick(…)</code> 을 넣고 <code>bricks[0].Hit()</code> 을 호출했다. <code>Hit</code> 은 <code>Brick</code> 에서 <code>virtual</code>, <code>HardBrick</code> 에서 <code>override</code> 이다. 어느 메서드가 실행되는가?', options: ['Brick.Hit — 변수 형식이 Brick 이므로', '컴파일 오류 — 형변환이 필요하다', 'HardBrick.Hit — 실제 객체의 형식으로 결정되므로', '둘 다 차례로 실행된다'], answer: 2, explain: '가상 메서드는 <b>실제 객체</b>의 형식으로 호출할 메서드가 결정됩니다(동적 바인딩). 그래서 Game 은 벽돌 종류를 몰라도 됩니다.' },
          { q: '<code>GameObject</code> 를 <code>abstract</code> 로 선언한 효과는?', options: ['new GameObject(…) 로 “그냥 물체” 를 만들 수 없고, Ball · Paddle · Brick 같은 파생 클래스만 만들 수 있다', 'GameObject 의 속성을 읽을 수 없다', '파생 클래스가 모든 메서드를 재정의해야 한다', 'Canvas 에 추가할 수 없다'], answer: 0, explain: '추상 클래스는 객체를 직접 만들 수 없는 “공통 설계도” 입니다. 공통 코드(위치 · Bounds · Draw)는 물려주고, 실제 물체는 파생 클래스로만 만듭니다.' },
          { q: '<code>Rect</code> 는 구조체(struct)이다. <code>Rect r = ball.Bounds; r.X += 100;</code> 을 실행하면 공은?', options: ['오른쪽으로 100 이동한다', '왼쪽으로 100 이동한다', '예외가 발생한다', '움직이지 않는다 — r 은 복사본이다'], answer: 3, explain: '<code>Bounds</code> 는 매번 <code>new Rect(X, Y, …)</code> 를 만들어 돌려주고, 구조체는 대입할 때 <b>값이 복사</b>됩니다(12장). 공을 옮기려면 <code>ball.X</code> 를 바꿔야 합니다.' }
        ],
        slides: [
          { layout: 'title', title: '완성과 확장', subtitle: '클래스로 리팩터링 · 상속과 다형성 · 이벤트 · 확장 과제', badge: 'Project 10 · 4교시',
            notes: '<p><b>[도입 3분]</b> 단계 8 코드를 화면에 띄우고 스크롤하며 발문: “공에 관한 코드가 어디어디에 있나요?” → 필드, ResetBall, SetVelocity, UpdateBall, Draw … 여기저기.</p><p>오늘 목표: 동작은 그대로, 구조만 바꾸는 리팩터링. 그리고 새 기능을 “쉽게” 넣어 본다.</p>' },
          { layout: 'diagram', title: '클래스 구조', html: SVG_CLASSES, caption: 'MainWindow → Game ◆ Ball · Paddle · List<Brick>,  ▷ GameObject',
            notes: '<p><b>[4분]</b> 9장 복습: is-a 는 상속, has-a 는 합성. “공은 게임 물체이다” → 상속, “게임은 공을 가진다” → 합성.</p><p>GameObject 를 기울임(abstract)으로 표시한 이유: “그냥 게임 물체” 는 만들 일이 없다.</p>' },
          { layout: 'table', title: '누가 무엇을 책임지나', head: ['클래스', '책임'], rows: [
            ['GameObject', '위치 · 크기 · 도형 · Bounds · Draw'],
            ['Ball', '속도 · 발사 · 이동 · 반사'],
            ['Paddle', '이동 · 범위 제한 · 맞은 위치'],
            ['Brick', '점수 · virtual Hit()'],
            ['Game', '상태 · 점수 · 생명 · 레벨 · Update · Changed'],
            ['MainWindow', '타이머 · 입력 전달 · HUD 표시']
          ], notes: '<p><b>[3분]</b> 단계 8 의 각 부분이 어느 클래스로 갔는지 짝지어 보게 합니다(본문 표 참고).</p><p>원칙: 한 클래스는 한 가지 이유로만 바뀌어야 한다(단일 책임 원칙).</p>' },
          { layout: 'two', title: '같은 일, 다른 모습', left: { title: '단계 8 (절차적)', code: 'Rect ballRect = new Rect(ballX, ballY, 12, 12);\nRect paddleRect = new Rect(paddleX, 330, 80, 12);\nif (vy > 0 && ballRect.IntersectsWith(paddleRect))\n{\n    ballY = 330 - 12;\n    double hit = (ballX + 6 - paddleX) / 80 * 2 - 1;\n    SetVelocity(Math.Clamp(hit, -1, 1) * 60);\n}', run: false }, right: { title: '완성판 (객체)', code: '// Game.UpdateBall()\nBall.Move();\nBall.BounceOffWalls(FieldWidth);\nBall.BounceOff(Paddle);\nCheckBricks();\n\n// Ball.BounceOff(Paddle paddle)\nif (VY <= 0 || !Bounds.IntersectsWith(paddle.Bounds)) return;\nY = paddle.Y - Height;\nLaunch(paddle.HitOffset(CenterX) * 60);', run: false },
            notes: '<p><b>[4분]</b> 오른쪽 <code>UpdateBall</code> 은 거의 “문장” 처럼 읽힌다는 점을 보여 줍니다. 세부 계산은 각 클래스 안에 숨었습니다(캡슐화).</p><p>계산 내용 자체는 왼쪽과 똑같다는 것도 확인 — 리팩터링은 동작을 바꾸지 않는다.</p>' },
          { layout: 'code', title: 'virtual Hit() — 다형성', code: CLASS_SLIDE, points: ['<code>Brick.Hit()</code> 은 <code>virtual</code>', '<code>HardBrick</code> 이 <code>override</code>', '<code>List&lt;Brick&gt;</code> 에 둘 다', '호출하는 쪽은 종류를 모른다'],
            notes: '<p><b>[4분]</b> 실행하면 1번째: 금이 감, 2번째: 깨짐, 3 · 4번째: 보통 벽돌. 호출 코드 <code>target.Hit()</code> 는 한 줄인데 결과가 다릅니다.</p><p>“새 벽돌 종류를 추가할 때 Game 을 고쳐야 할까?” → 아니요, 클래스 하나만 추가. 확장 과제 1 로 이어집니다.</p>' },
          { layout: 'two', title: 'Game 과 MainWindow 의 대화', left: { title: 'Game — 알리기만', code: 'public event Action? Changed;\n\nprivate void SetState(GameState s)\n{\n    State = s;\n    Draw();\n    Changed?.Invoke();   // “바뀌었어요”\n}', run: false }, right: { title: 'MainWindow — 듣고 표시', code: 'game = new Game(field);\ngame.Changed += UpdateHud;\ntimer.Tick += (s, e) => game.Update();\n\nvoid UpdateHud()\n{\n    lblScore.Text = $"점수 {game.Score}";\n    lblMessage.Text = game.Message;\n}', run: false },
            notes: '<p><b>[3분]</b> 11장의 이벤트 복습. <code>?.Invoke()</code> 는 구독자가 없을 때(null) 오류를 막습니다.</p><p>Game 은 TextBlock 을 모르고, MainWindow 는 게임 규칙을 모릅니다. 20장 MVVM 과 같은 생각 — 규칙과 화면의 분리.</p>' },
          { layout: 'bullets', title: '완성 프로그램 실행 · 점검', lead: '단계 8 과 똑같이 동작하면 리팩터링 성공',
            bullets: ['첫 화면: 벽돌 40 · 공은 패들 위 · “스페이스바를 누르면 시작합니다”', '패들 끝으로 받으면 비스듬히, 가운데는 수직', '스페이스바: 시작 → 일시정지 → 계속', '세 번 놓치면 게임 오버 → 스페이스바로 새 게임', '레벨 1 클리어 → 레벨 2 (공 빨라짐) → 모두 클리어'],
            notes: '<p><b>[5분]</b> 완성 예제를 실행해 체크리스트를 하나씩 확인합니다. 학생들은 Visual Studio 에서 7개 파일로 나눠 따라 만들고, 같은 동작인지 비교합니다.</p><p>레벨 2 확인이 오래 걸리면 <code>Game</code> 의 <code>Rows</code> 를 1 로 바꿔서 시연하세요.</p>' },
          { layout: 'table', title: '개선 아이디어', head: ['주제', '방향'], rows: [
            ['아이템', '<code>Item : GameObject</code> — 패들 넓히기 · 공 느리게'],
            ['공 여러 개', '<code>List&lt;Ball&gt;</code>'],
            ['레벨 맵', '문자열 배열로 벽돌 모양'],
            ['최고 점수 저장', '<code>File.WriteAllText</code>'],
            ['시간 기반 이동', '<code>Stopwatch</code> 로 dt 측정']
          ], notes: '<p><b>[2분]</b> 시간이 남는 학생을 위한 도전 목록입니다. 대부분 “클래스 하나 추가” 또는 “Game 의 한 부분 수정” 으로 끝난다는 점을 강조하세요.</p>' },
          { layout: 'bullets', title: '확장 과제 — 하나 이상 선택', bullets: ['과제 1 (★★) 단단한 벽돌 — <code>HardBrick : Brick</code>, <code>override Hit()</code>', '과제 2 (★★) 최고 점수 · 클리어 보너스 — <code>HighScore</code> 속성', '규칙: 기존 코드는 되도록 적게 고치기', '끝나면 짝과 코드 바꿔 보고, 고친 줄 수 세어 보기'],
            notes: '<p><b>[18분 실습]</b> 과제 1 은 Game.CreateBricks 의 한 줄 + 새 클래스, 과제 2 는 Game 의 몇 곳 + MainWindow 한 줄이면 됩니다.</p><p>마지막 5분: 한두 명이 결과를 시연하고 “몇 줄 고쳤는지” 발표하게 합니다.</p>' },
          { layout: 'quiz', title: '확인 퀴즈', q: '<code>Rect r = ball.Bounds; r.X += 100;</code> 을 실행하면 공은?', options: ['오른쪽으로 100 이동', '왼쪽으로 100 이동', '예외 발생', '움직이지 않는다 — r 은 복사본'], answer: 3, explain: 'Rect 는 구조체라 대입하면 값이 복사됩니다. 게다가 Bounds 는 매번 새 Rect 를 만들어 돌려줍니다.',
            notes: '<p><b>[2분]</b> 12장 struct 와 class 의 차이를 다시 떠올리게 합니다. “그럼 공을 옮기려면?” → <code>ball.X += 100;</code></p>' },
          { layout: 'practice', title: '확장 과제 1 (슬라이드판)', desc: 'HardBrick : Brick — 은색 100점, 첫 번째 Hit 은 색만 DimGray 로 바꾸고 false, 두 번째에 true. CreateBricks 에서 맨 윗줄만 HardBrick.', starter: EXT1_STARTER, solution: EXT1_SOLUTION,
            notes: '<p><b>[실습 안내]</b> 정답 실행 후 맨 윗줄 벽돌을 한 번 맞히면 회색으로 변하고, 두 번째에 깨지며 100점이 오르는지 확인합니다.</p><p>포인트: Game.CheckBricks 는 한 줄도 고치지 않았다 — 다형성의 힘.</p>' },
          { layout: 'summary', title: '프로젝트 정리', bullets: ['게임 루프: DispatcherTimer + 입력 → 이동 → 충돌 → 그리기', '입력: 키 플래그 · MouseMove · Deactivated', '충돌: Rect.IntersectsWith, 겹친 폭 · 높이, 맞은 위치 → 각도', '상태: <code>enum GameState</code> + switch + SetState', '설계: GameObject 상속 · Game 이 규칙 · Changed 이벤트로 화면 분리'],
            notes: '<p><b>[마무리 2분]</b> 강좌 전체를 돌아보며: 변수 · 조건 · 반복(공 이동), 배열(벽돌), 클래스 · 상속 · 다형성(GameObject · HardBrick), 이벤트 · 람다(Changed, Tick), enum(상태), WPF 레이아웃 · 도형 · 입력 · 타이머 — 모두 이 게임 하나에 들어 있습니다.</p><p>수고했다는 인사와 함께, 자기만의 게임(스네이크, 슈팅, 퐁)을 만들어 보라고 권합니다.</p>' }
        ]
      }
    ]
  });
})();
