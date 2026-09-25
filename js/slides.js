/* 교사용 PPT 슬라이드 엔진: 16:9 슬라이드, 코드 편집·실행, 전체 화면, 교사 노트, 발표자 창, 타이머 */
(function () {
  const { esc, highlightInline, fileName, makeEditor } = window.JU;
  const $ = (id) => document.getElementById(id);
  const LAYOUT_NAME = { title: '제목', goals: '학습 목표', bullets: '개념', code: '코드', two: '비교', table: '표', diagram: '그림', quiz: '퀴즈', practice: '실습', summary: '정리', shot: '실행 화면' };
  const LAYOUT_ICON = { title: '🎬', goals: '🎯', bullets: '📌', code: '💻', two: '⚖️', table: '📊', diagram: '🧭', quiz: '❓', practice: '🛠️', summary: '✅', shot: '🖥️' };

  function bulletsHtml(items, dense) {
    if (!Array.isArray(items)) return '';
    return `<ul class="s-bullets${dense ? ' dense' : ''}">${items.map((b) => {
      if (Array.isArray(b)) return `<li>${b[0]}${Array.isArray(b[1]) ? `<ul>${b[1].map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}</li>`;
      return `<li>${b}</li>`;
    }).join('')}</ul>`;
  }

  /** 슬라이드 안의 코드가 잘리지 않도록 글자 크기(cqw)를 계산한다 */
  function autoCodeFont(code, hasPoints, isPractice) {
    const lines = String(code || '').split('\n');
    const n = Math.max(1, lines.length);
    const cols = Math.max(24, ...lines.map((l) => l.replace(/\t/g, '    ').length));
    const boxH = 32;                                   // 코드 상자 높이 (cqw 기준 대략값)
    const boxW = hasPoints ? 55 : isPractice ? 48 : 86; // 코드 상자 폭
    const byLines = boxH / (n * 1.55);
    const byCols = boxW / (cols * 0.62);
    return Math.max(0.78, Math.min(1.55, byLines, byCols));
  }


  // ====================================================================
  //  판서(잉크) — 슬라이드 좌표(1280×720) 기준, 화면 배율의 2배 해상도로 그린다
  // ====================================================================
  const SW = 1280, SH = 720;          // 슬라이드 좌표계
  const UNDO_MAX = 50;                // 되돌리기 단계
  const TOOLS = ['pen', 'marker', 'eraser', 'pointer'];

  class Ink {
    constructor(deck) {
      this.deck = deck;
      this.canvas = $('inkCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.strokes = {};               // 슬라이드키 → [획]
      this.undoStack = {};             // 슬라이드키 → [되돌리기 기록]
      const st = Runner.store;
      const t = st.get('cs.ink.tool', 'pen');
      this.tool = TOOLS.includes(t) ? t : 'pen';
      this.color = st.get('cs.ink.color', '#e53935');
      this.width = +st.get('cs.ink.width', 6) || 6;
      this.drawing = null;
      this.erasing = null;
      this.bindBar();
      this.bindStage();
      this.syncBar();
    }

    get key() { return this.deck.sec ? `${this.deck.sec.id}@${this.deck.index}` : '?'; }
    list() { return this.strokes[this.key] || (this.strokes[this.key] = []); }
    acts() { return this.undoStack[this.key] || (this.undoStack[this.key] = []); }
    push(act) { const a = this.acts(); a.push(act); if (a.length > UNDO_MAX) a.shift(); }

    // ---------------------------------------------------------------- 도구 막대
    bindBar() {
      $('inkTools').addEventListener('click', (e) => {
        const b = e.target.closest('[data-tool]');
        if (b) this.setTool(b.dataset.tool);
      });
      $('inkColors').addEventListener('click', (e) => {
        const b = e.target.closest('[data-color]');
        if (!b) return;
        this.color = b.dataset.color;
        Runner.store.set('cs.ink.color', this.color);
        // 지우개 · 지시봉 상태에서 색을 고르면 펜으로 바뀐다
        if (this.tool === 'eraser' || this.tool === 'pointer') this.setTool('pen');
        else this.syncBar();
      });
      $('inkWidths').addEventListener('click', (e) => {
        const b = e.target.closest('[data-width]');
        if (!b) return;
        this.width = +b.dataset.width;
        Runner.store.set('cs.ink.width', String(this.width));
        if (this.tool === 'eraser' || this.tool === 'pointer') this.setTool('pen');
        else this.syncBar();
      });
      $('inkUndo').onclick = () => this.undoOne();
      $('inkClear').onclick = () => { this.strokes[this.key] = []; this.undoStack[this.key] = []; this.redraw(); };
      $('inkClearAll').onclick = () => {
        if (!confirm('이 강의(교시)의 판서를 모두 지울까요?')) return;
        const pre = (this.deck.sec ? this.deck.sec.id : '') + '@';
        Object.keys(this.strokes).forEach((k) => { if (k.indexOf(pre) === 0) { delete this.strokes[k]; delete this.undoStack[k]; } });
        this.redraw();
      };
    }

    setTool(t) {
      this.tool = TOOLS.includes(t) ? t : 'pen';
      Runner.store.set('cs.ink.tool', this.tool);
      this.syncBar();
    }

    syncBar() {
      document.querySelectorAll('#inkTools [data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === this.tool));
      document.querySelectorAll('#inkColors [data-color]').forEach((b) => b.classList.toggle('on', b.dataset.color === this.color));
      document.querySelectorAll('#inkWidths [data-width]').forEach((b) => b.classList.toggle('on', +b.dataset.width === this.width));
      this.deck.stage.dataset.tool = this.deck.app.role === 'teacher' ? this.tool : 'none';
      this.deck.stage.style.setProperty('--ink-color', this.color);
    }

    // ---------------------------------------------------------------- 좌표 · 그리기
    toSlide(e) {
      const r = this.deck.stage.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * SW, y: (e.clientY - r.top) / r.height * SH };
    }

    resize() {
      const r = this.deck.stage.getBoundingClientRect();
      if (!r.width) return;
      const w = Math.max(640, Math.round(r.width * 2));     // 화면 크기의 2배 해상도
      const h = Math.round(w * SH / SW);
      if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
      this.redraw();
    }

    redraw() {
      const c = this.ctx, W = this.canvas.width, H = this.canvas.height;
      if (!W) return;
      c.clearRect(0, 0, W, H);
      c.save();
      c.scale(W / SW, W / SW);
      c.lineCap = 'round';
      c.lineJoin = 'round';
      for (const st of this.list()) this.paint(st);
      if (this.drawing) this.paint(this.drawing);
      c.restore();
    }

    paint(st) {
      const c = this.ctx;
      if (st.pts.length < 2) return;
      c.globalAlpha = st.tool === 'marker' ? 0.38 : 1;
      c.strokeStyle = st.color;
      c.lineWidth = st.tool === 'marker' ? st.width * 3 : st.width;
      c.beginPath();
      c.moveTo(st.pts[0][0], st.pts[0][1]);
      for (let i = 1; i < st.pts.length; i++) c.lineTo(st.pts[i][0], st.pts[i][1]);
      c.stroke();
      c.globalAlpha = 1;
    }

    start(e) {
      if (this.tool === 'pointer') return false;
      if (this.tool === 'eraser') { this.erasing = []; this.eraseAt(e); return true; }
      const p = this.toSlide(e);
      this.drawing = { tool: this.tool, color: this.color, width: this.width, pts: [[p.x, p.y]] };
      return true;
    }

    move(e) {
      if (this.tool === 'eraser') { this.eraseAt(e); return; }
      if (!this.drawing) return;
      const p = this.toSlide(e);
      const last = this.drawing.pts[this.drawing.pts.length - 1];
      if (Math.hypot(p.x - last[0], p.y - last[1]) < 1.2) return;
      this.drawing.pts.push([p.x, p.y]);
      this.redraw();
    }

    end() {
      if (this.tool === 'eraser') {
        if (this.erasing && this.erasing.length) this.push({ type: 'erase', items: this.erasing });
        this.erasing = null;
        return;
      }
      const st = this.drawing;
      this.drawing = null;
      if (!st || st.pts.length < 2) { this.redraw(); return; }   // 끌지 않은 단순 클릭은 점을 찍지 않는다
      this.list().push(st);
      this.push({ type: 'add' });
      this.redraw();
    }

    /** 커서가 스친 획을 통째로 삭제 */
    eraseAt(e) {
      const p = this.toSlide(e);
      const list = this.list();
      const R = Math.max(10, this.width * 2);
      for (let i = list.length - 1; i >= 0; i--) {
        if (this.hit(list[i], p, R)) {
          const st = list.splice(i, 1)[0];
          (this.erasing = this.erasing || []).push({ index: i, stroke: st });
          this.redraw();
        }
      }
    }

    hit(st, p, R) {
      const half = (st.tool === 'marker' ? st.width * 3 : st.width) / 2;
      const lim = R + half;
      for (let i = 1; i < st.pts.length; i++) {
        const x1 = st.pts[i - 1][0], y1 = st.pts[i - 1][1], x2 = st.pts[i][0], y2 = st.pts[i][1];
        const dx = x2 - x1, dy = y2 - y1;
        const len2 = dx * dx + dy * dy || 1;
        let t = ((p.x - x1) * dx + (p.y - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        if (Math.hypot(p.x - (x1 + t * dx), p.y - (y1 + t * dy)) <= lim) return true;
      }
      return false;
    }

    undoOne() {
      const a = this.acts().pop();
      if (!a) return;
      if (a.type === 'add') this.list().pop();
      else a.items.slice().reverse().forEach((it) => this.list().splice(it.index, 0, it.stroke));
      this.redraw();
    }

    clearSection(secId) {
      const pre = secId + '@';
      Object.keys(this.strokes).forEach((k) => { if (k.indexOf(pre) === 0) { delete this.strokes[k]; delete this.undoStack[k]; } });
    }

    // ---------------------------------------------------------------- 무대 위 조작
    bindStage() {
      const stage = this.deck.stage;
      const INTERACTIVE = 'button, a, input, textarea, select, .opt, .CodeMirror, [data-act], [data-opt]';
      let down = null;

      stage.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest(INTERACTIVE)) return;               // 버튼 · 링크 · 퀴즈 보기는 그대로
        const edge = e.target.closest('[data-edge]');
        down = { x: e.clientX, y: e.clientY, edge: edge ? +edge.dataset.edge : 0, moved: false, drew: false };
        if (this.deck.app.role === 'teacher' && !edge && this.start(e)) {
          down.drew = true;
          stage.classList.add('drawing');                        // 그리는 동안에는 가장자리 커서로 바뀌지 않는다
          try { stage.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
          e.preventDefault();
        }
      });

      stage.addEventListener('pointermove', (e) => {
        if (!down) return;
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 3) down.moved = true;
        if (down.drew) this.move(e);
      });

      const finish = () => {
        if (!down) return;
        const d = down;
        down = null;
        stage.classList.remove('drawing');
        if (d.drew) { this.end(); return; }                      // 그리기를 끝낸 클릭으로는 쪽이 넘어가지 않는다
        if (d.edge && !d.moved) this.deck.go(this.deck.index + d.edge);
      };
      stage.addEventListener('pointerup', finish);
      stage.addEventListener('pointercancel', finish);
    }
  }

  class Deck {
    constructor(app) {
      this.app = app;
      this.console = app.console;
      this.slides = [];
      this.index = 0;
      this.edits = {};
      this.solutionOn = {};
      this.editor = null;
      this.notesOpen = Runner.store.get('cs.notesOpen', '1') === '1';
      this.stage = $('stage');
      this.slideHost = $('slideHost');
      this.wrap = $('deckWrap');
      this.view = $('slideView');
      this.host = $('stageHost');
      this.ink = new Ink(this);
      this.timer = { start: 0, acc: 0 };
      this.channel = 'BroadcastChannel' in window ? new BroadcastChannel('cs-presenter') : null;
      this.bind();
    }

    get active() { return !$('slideView').classList.contains('hidden'); }

    // ---------------------------------------------------------------- 데이터
    open(ch, sec, index) {
      this.ch = ch;
      this.sec = sec;
      this.slides = this.build(ch, sec);
      const n = this.slides.length;
      this.index = index === 'last' ? n - 1 : Math.max(0, Math.min(n - 1, (index | 0)));
      $('notesPane').classList.toggle('collapsed', !this.notesOpen);
      this.fsConsole = false;
      this.render();
    }

    build(ch, sec) {
      const list = (sec.slides || []).map((s, i) => Object.assign({ srcIndex: i }, s));
      const hasGoals = list.some((s) => s.layout === 'goals' || /학습\s*목표/.test(s.title || ''));
      let at = 0;
      if (!list.length || list[0].layout !== 'title') {
        list.unshift({ layout: 'title', title: sec.title, subtitle: ch.title, notes: '<p>섹션을 소개합니다.</p>', auto: true });
      }
      at = 1;
      if (!hasGoals && sec.goals && sec.goals.length) {
        list.splice(at, 0, {
          layout: 'goals', title: '학습 목표', goals: sec.goals, flow: sec.flow, auto: true,
          notes: `<p>이번 시간에 배울 내용을 소개합니다. 목표를 소리 내어 함께 읽고, 수업이 끝날 때 다시 확인합니다.</p>${(sec.flow || []).length ? `<p class="muted">수업 흐름: ${sec.flow.map((f) => `${esc(f[0])} ${f[1]}분`).join(' → ')}</p>` : ''}`
        });
      }
      return list;
    }

    // ---------------------------------------------------------------- 렌더링
    render() {
      const s = this.slides[this.index];
      if (!s) { this.stage.innerHTML = ''; return; }
      const teacher = this.app.role === 'teacher';
      this.editor = null;
      const key = `${this.sec.id}@${this.index}`;
      const top = `<div class="s-top"><span class="s-ch">${this.ch.group === 'project' ? 'Project' : 'Chapter'} ${esc(this.ch.no)}</span><span>${esc(this.ch.title)}</span><span class="spacer"></span><span>${window.JU.textish(this.sec.title)}</span></div>`;
      const foot = `<div class="s-foot"><span>🪟 C# · WPF 프로그래밍</span><span class="spacer"></span><span class="pg">${this.index + 1} / ${this.slides.length}</span></div>`;
      const title = `<h2 class="s-title">${window.JU.textish(s.title || '')}</h2>`;
      const lead = s.lead ? `<p class="s-lead">${s.lead}</p>` : '';
      let html = '';
      let cls = 'slide';

      switch (s.layout) {
        case 'title':
          cls += ' title-slide';
          html = `<div class="badge">${esc(s.badge || `${this.ch.group === 'project' ? 'Project' : 'Chapter'} ${this.ch.no} · ${this.ch.title}`)}</div>
            <h1>${window.JU.textish(s.title)}</h1>
            ${s.subtitle ? `<div class="sub">${s.subtitle}</div>` : ''}
            <div class="meta"><span>⏱ ${this.sec.minutes || 50}분</span><span>🖼️ 슬라이드 ${this.slides.length}장</span></div>
            <div class="deco">C#</div>`;
          break;
        case 'goals':
          html = top + title + `<div class="s-body"><div class="s-goals${s.goals.length > 3 ? ' dense' : ''}">${s.goals.map((g) => `<div>${window.JU.textish(g)}</div>`).join('')}</div>
            ${(s.flow || []).length ? `<div class="s-flow">${s.flow.map((f) => `<div style="flex:${f[1]}"><b>${esc(f[0])}</b> ${f[1]}분</div>`).join('')}</div>` : ''}</div>` + foot;
          break;
        case 'bullets':
          html = top + title + lead + `<div class="s-body">${bulletsHtml(s.bullets, (s.bullets || []).length > 5)}</div>` + foot;
          break;
        case 'summary':
          cls += ' summary-slide';
          html = top + title + lead + `<div class="s-body">${bulletsHtml(s.bullets, (s.bullets || []).length > 5)}</div>` + foot;
          break;
        case 'shot': {
          const src = s.src || (this.app.shotPath ? this.app.shotPath(`${this.sec.id}-s${s.srcIndex}`) : null);
          html = top + title + lead + `<div class="s-body"><div class="s-shot"><div><img src="${esc(src || '')}" alt="${esc(s.title || '')}">${s.caption ? `<div class="cap" style="text-align:center;font-size:1.3cqw;color:var(--s-muted);margin-top:.6cqw">${s.caption}</div>` : ''}</div></div></div>` + foot;
          break;
        }
        case 'code': {
          const shot = s.shot || (this.app.shotPath && s.srcIndex != null ? this.app.shotPath(`${this.sec.id}-s${s.srcIndex}`) : null);
          const side = shot ? `<div class="s-side-shot"><img src="${esc(shot)}" alt="실행 화면">${s.points && s.points.length ? `<ul class="s-points" style="font-size:1.3cqw;gap:.5cqw">${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>` : '<div class="cap">Visual Studio 실행 화면</div>'}</div>` : (s.points && s.points.length ? `<ul class="s-points">${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>` : '');
          html = top + title + lead + `<div class="s-body"><div class="s-code${shot ? ' has-shot' : (s.points && s.points.length ? ' has-points' : '')}">
              <div class="s-editor">
                <div class="s-editor-bar"><span class="fname">📄 ${esc(fileName(s.code))}</span>
                  <button class="btn ghost small" data-act="font-" title="글자 작게">A−</button>
                  <button class="btn ghost small" data-act="font+" title="글자 크게">A+</button>
                  <button class="btn ghost small" data-act="reset" title="원래 코드로">↺</button>
                  <button class="btn primary small" data-act="run" title="실행 (Ctrl+Enter)">▶ 실행</button></div>
                <div class="s-editor-host"></div>
                ${s.stdin ? `<div class="s-stdin">⌨ 입력 예: <code>${esc(s.stdin.replace(/\n$/, '').replace(/\n/g, ' ⏎ '))}</code> <button class="btn ghost small" data-act="run-stdin">예시 입력으로 실행</button></div>` : ''}
              </div>
              ${side}
            </div></div>` + foot;
          break;
        }
        case 'two': {
          const col = (c, i) => {
            if (!c) return '<div class="s-col"></div>';
            let inner = '';
            if (c.bullets) inner += bulletsHtml(c.bullets, true);
            if (c.html) inner += `<div>${JU.scoped(c.html)}</div>`;
            if (c.code) inner += `<pre class="s-static">${highlightInline(c.code)}</pre>`;
            const runBtn = c.code && c.run !== false && /static\s+void\s+main/.test(c.code) ? `<button class="btn ghost small" data-act="run-col" data-col="${i}" style="float:right;font-size:1.1cqw">▶ 실행</button>` : '';
            return `<div class="s-col"><h3>${runBtn}${c.title || ''}</h3>${inner}</div>`;
          };
          html = top + title + lead + `<div class="s-body"><div class="s-two">${col(s.left, 'left')}${col(s.right, 'right')}</div></div>` + foot;
          break;
        }
        case 'table': {
          const rows = s.rows || [];
          const dense = rows.length > 6 || (s.head || []).length > 3;
          html = top + title + lead + `<div class="s-body"><table class="s-table${dense ? ' dense' : ''}"><thead><tr>${(s.head || []).map((h) => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` + foot;
          break;
        }
        case 'diagram':
          html = top + title + lead + `<div class="s-body"><div class="s-diagram"><div class="d-host">${JU.scoped(s.html)}</div>${s.caption ? `<div class="cap">${s.caption}</div>` : ''}</div></div>` + foot;
          break;
        case 'quiz':
          html = top + title + `<div class="s-body s-quiz"><div class="q">${s.q || ''}</div>
            <div class="opts">${(s.options || []).map((o, i) => `<button class="opt" data-opt="${i}"><span class="n">${i + 1}</span><span>${o}</span></button>`).join('')}</div>
            <div class="explain hidden">${s.explain || ''}</div>
            ${teacher ? '<div class="reveal"><button class="btn ghost small" data-act="reveal">정답 공개</button></div>' : ''}</div>` + foot;
          break;
        case 'practice': {
          const sol = !!this.solutionOn[key];
          html = top + title + `<div class="s-body"><div class="s-practice"><div class="desc">${s.desc || ''}</div>
              <div class="s-editor">
                <div class="s-editor-bar"><span class="fname">📝 ${sol ? '정답 코드' : '실습 코드'}</span>
                  ${teacher && s.solution ? `<button class="btn ghost small${sol ? ' sol-on' : ''}" data-act="solution" title="정답 코드 보기/숨기기">${sol ? '✓ 정답' : '🔑 정답'}</button>` : ''}
                  <button class="btn ghost small" data-act="reset" title="원래 코드로">↺</button>
                  <button class="btn primary small" data-act="run" title="실행 (Ctrl+Enter)">▶ 실행</button></div>
                <div class="s-editor-host"></div>
                ${s.stdin ? `<div class="s-stdin">⌨ 입력 예: <code>${esc(s.stdin.replace(/\n$/, '').replace(/\n/g, ' ⏎ '))}</code> <button class="btn ghost small" data-act="run-stdin">예시 입력으로 실행</button></div>` : ''}
              </div></div></div>` + foot;
          break;
        }
        default:
          html = top + title + `<div class="s-body">${s.html ? JU.scoped(s.html) : bulletsHtml(s.bullets)}</div>` + foot;
      }

      this.slideHost.innerHTML = `<div class="${cls}">${html}</div>`;
      const slideEl = this.slideHost.firstElementChild;

      // 코드 편집기
      const edHost = slideEl.querySelector('.s-editor-host');
      if (edHost) {
        const isPractice = s.layout === 'practice';
        const sol = isPractice && this.solutionOn[key];
        const editKey = key + (sol ? ':sol' : '');
        const original = isPractice ? (sol ? s.solution : (s.starter || '')) : s.code;
        const ed = makeEditor(edHost, this.edits[editKey] != null ? this.edits[editKey] : original, { onRun: () => this.runCode() });
        ed.on('change', () => { this.edits[editKey] = ed.getValue(); });
        const manual = +(Runner.store.get('cs.slideCodeFont', '0')) || 0;
        const fs = manual || autoCodeFont(ed.getValue(), !!(s.points && s.points.length) || !!slideEl.querySelector('.s-side-shot'), s.layout === 'practice');
        slideEl.querySelector('.s-editor').style.setProperty('--s-code-font', fs.toFixed(2) + 'cqw');
        this.editor = ed;
        this.editorOriginal = original;
        this.editorKey = editKey;
        requestAnimationFrame(() => ed.refresh());
      }

      slideEl.addEventListener('click', (e) => this.onSlideClick(e, s));
      this.ink.syncBar();
      this.ink.redraw();
      this.updateChrome();
      this.renderNotes();
      this.broadcast();
      this.app.onSlideChange(this.sec, this.index);
      this.fit();
    }

    onSlideClick(e, s) {
      const act = e.target.closest('[data-act]');
      const opt = e.target.closest('[data-opt]');
      if (opt && s.layout === 'quiz') {
        const i = +opt.dataset.opt;
        opt.classList.add(i === s.answer ? 'right' : 'wrong');
        if (i === s.answer) this.stage.querySelector('.explain').classList.remove('hidden');
        return;
      }
      if (!act) return;
      const a = act.dataset.act;
      if (a === 'run') this.runCode();
      else if (a === 'run-stdin') this.runCode(s.stdin);
      else if (a === 'reset' && this.editor) { this.editor.setValue(this.editorOriginal); delete this.edits[this.editorKey]; }
      else if (a === 'font+' || a === 'font-') {
        const cur = +(Runner.store.get('cs.slideCodeFont', '0')) || 1.45;
        const next = Math.max(0.9, Math.min(2.6, cur + (a === 'font+' ? 0.15 : -0.15)));
        Runner.store.set('cs.slideCodeFont', next.toFixed(2));
        this.stage.querySelector('.s-editor').style.setProperty('--s-code-font', next.toFixed(2) + 'cqw');
        this.editor && this.editor.refresh();
      } else if (a === 'solution') {
        const key = `${this.sec.id}@${this.index}`;
        this.solutionOn[key] = !this.solutionOn[key];
        this.render();
      } else if (a === 'reveal') {
        this.stage.querySelectorAll('.opt').forEach((o) => { if (+o.dataset.opt === s.answer) o.classList.add('right'); });
        this.stage.querySelector('.explain').classList.remove('hidden');
      } else if (a === 'run-col') {
        const c = s[act.dataset.col];
        this.showConsole(true);
        this.app.runCode(c.code, { label: `${s.title} · ${c.title || ''}` });
      }
    }

    runCode(stdin) {
      if (!this.editor) return;
      const s = this.slides[this.index];
      this.showConsole(true);
      this.app.runCode(this.editor.getValue(), { label: s.title, stdin, editor: this.editor });
    }

    renderNotes() {
      const pane = $('notesPane');
      if (this.app.role !== 'teacher') { pane.innerHTML = ''; return; }
      const s = this.slides[this.index];
      let answer = '';
      if (s.layout === 'quiz' && typeof s.answer === 'number') {
        answer = `<div class="answer"><b>정답: ${s.answer + 1}번</b> — ${(s.options || [])[s.answer] || ''}${s.explain ? `<div>${s.explain}</div>` : ''}</div>`;
      }
      if (s.layout === 'practice' && s.solution) {
        answer = `<div class="answer"><b>🔑 정답 코드</b> <button class="btn small ghost" id="noteRunSol">▶ 정답 실행</button> <button class="btn small ghost" id="noteShowSol">슬라이드에 표시</button>
          <pre style="margin:6px 0 0;font-size:12.5px;overflow:auto;max-height:260px">${highlightInline(s.solution)}</pre></div>`;
      }
      const flow = (this.sec.flow || []).map((f) => `<div class="row"><span>${esc(f[0])}</span><b>${f[1]}분</b></div>`).join('');
      const nextS = this.slides[this.index + 1];
      const nextTitle = nextS ? String(nextS.title || '').replace(/<[^>]+>/g, '') : '섹션의 마지막 슬라이드';
      pane.innerHTML = `<div class="n-head" id="notesHead" title="눌러서 접기/펴기 (N)"><b>🗒 교사용 노트</b>
          <span class="muted">${LAYOUT_ICON[s.layout] || ''} ${LAYOUT_NAME[s.layout] || ''} · ${this.index + 1}/${this.slides.length}</span>
          <span class="spacer"></span>
          <span class="n-next muted">다음: ${esc(nextTitle)}</span>
          <button class="btn ghost small" id="notesFold">${this.notesOpen ? '▾ 접기' : '▴ 펴기'}</button></div>
        <div class="n-grid"><div class="n-notes">
          ${s.notes || '<p class="muted">노트 없음</p>'}${answer}</div>
        <div class="n-side"><h5>⏱ 수업 흐름 (${this.sec.minutes || 50}분)</h5>${flow || '<span class="muted">-</span>'}
          <h5 style="margin-top:12px">다음 슬라이드</h5><div>${nextS ? `${LAYOUT_ICON[nextS.layout] || ''} ${window.JU.textish(nextS.title)}` : '<span class="muted">섹션의 마지막 슬라이드</span>'}</div></div></div>`;
      $('notesHead').onclick = (e) => { if (!e.target.closest('a')) this.toggleNotes(); };
      const run = $('noteRunSol');
      if (run) run.onclick = () => { this.showConsole(true); this.app.runCode(s.solution, { label: s.title + ' (정답)', stdin: s.stdin }); };
      const show = $('noteShowSol');
      if (show) show.onclick = () => { this.solutionOn[`${this.sec.id}@${this.index}`] = true; this.render(); };
    }

    updateChrome() {
      const n = this.slides.length;
      const txt = `${this.index + 1} / ${n}`;
      $('sCount').textContent = txt;
      $('fsCount').textContent = txt;
      const sl = $('sSlider');
      sl.max = String(Math.max(1, n));
      sl.value = String(this.index + 1);
      $('deckProgress').style.width = (n > 1 ? (this.index / (n - 1)) * 100 : 100) + '%';
      const s = this.slides[this.index] || {};
      $('sTitle').textContent = String(s.title || '').replace(/<[^>]+>/g, '');
      if (!$('gridOverlay').classList.contains('hidden')) this.renderGrid();
    }

    // ---------------------------------------------------------------- 이동
    go(i) {
      if (i < 0) return this.app.stepSection(-1, 'last');
      if (i >= this.slides.length) return this.app.stepSection(1, 0);
      this.index = i;
      if (this.isFull()) this.showConsole(false);
      this.render();
    }
    next() { this.go(this.index + 1); }
    prev() { this.go(this.index - 1); }

    renderGrid() {
      const g = $('gridOverlay');
      g.innerHTML = `<h4>▦ ${window.JU.textish(this.sec.title)} <span class="muted" style="font-weight:500">슬라이드 ${this.slides.length}장</span><span class="spacer"></span><button class="btn small ghost" data-close>닫기 (Esc)</button></h4>
        <div class="grid-list">${this.slides.map((s, i) => `<button class="grid-item${i === this.index ? ' cur' : ''}" data-i="${i}">
          <span class="gi-n">${i + 1}</span><span class="gi-l">${LAYOUT_ICON[s.layout] || ''} ${LAYOUT_NAME[s.layout] || s.layout}</span>
          <span class="gi-t">${String(s.title || '').replace(/<[^>]+>/g, '')}</span></button>`).join('')}</div>`;
    }
    toggleGrid(force) {
      const g = $('gridOverlay');
      const show = force != null ? force : g.classList.contains('hidden');
      g.classList.toggle('hidden', !show);
      if (show) this.renderGrid();
    }

    toggleNotes() {
      this.notesOpen = !this.notesOpen;
      Runner.store.set('cs.notesOpen', this.notesOpen ? '1' : '0');
      $('notesPane').classList.toggle('collapsed', !this.notesOpen);
      this.fit();
    }

    // ---------------------------------------------------------------- 전체 화면 · 결과 패널
    isFull() { return this.view.classList.contains('is-full'); }

    async toggleFull() {
      if (this.isFull()) {
        if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch (e) { /* 무시 */ } }
        this.view.classList.remove('pfull');
        this.onFullChange();
        return;
      }
      try {
        if (!this.view.requestFullscreen) throw new Error('unsupported');
        await this.view.requestFullscreen();
      } catch (e) {
        // 전체 화면 API 를 쓸 수 없는 환경(iframe 등): 창 전체를 채우는 발표 모드
        this.view.classList.add('pfull');
        this.onFullChange();
      }
    }

    onFullChange() {
      const panel = $('consolePanel');
      const slot = $('fsConsoleSlot');
      const full = document.fullscreenElement === this.view || this.view.classList.contains('pfull');
      this.view.classList.toggle('is-full', full);
      if (full) {
        this.fsConsole = false;          // 발표를 시작하면 결과 창은 닫힌 상태
        slot.appendChild(panel);
        slot.classList.add('off');
      } else {
        $('output').appendChild(panel);  // 일반 화면에서는 결과 창을 늘 보여 준다
      }
      this.fit();
      setTimeout(() => this.fit(), 120);
    }

    showConsole(on) {
      this.fsConsole = on;
      $('fsConsoleSlot').classList.toggle('off', !on);
      this.fit();
    }

    fit() {
      const host = this.host;
      const cs = getComputedStyle(host);
      const w = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = host.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (w <= 0 || h <= 0) return;
      const width = Math.floor(Math.min(w, h * 16 / 9));
      if (this.stage.style.width !== width + 'px') {
        this.stage.style.width = width + 'px';
        if (this.editor) requestAnimationFrame(() => this.editor && this.editor.refresh());
      }
      if (this.ink) this.ink.resize();
    }

    blackout(force) {
      const b = $('blackout');
      b.classList.toggle('hidden', force != null ? !force : !b.classList.contains('hidden'));
    }

    // ---------------------------------------------------------------- 타이머
    timerToggle() {
      if (this.timer.start) { this.timer.acc += Date.now() - this.timer.start; this.timer.start = 0; }
      else this.timer.start = Date.now();
      this.timerDraw();
    }
    timerReset() { this.timer.acc = 0; if (this.timer.start) this.timer.start = Date.now(); this.timerDraw(); }
    timerDraw() {
      const ms = this.timer.acc + (this.timer.start ? Date.now() - this.timer.start : 0);
      const m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60;
      $('timerText').textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      $('timerBox').classList.toggle('running', !!this.timer.start);
      $('timerBox').classList.toggle('over', this.sec && m >= (this.sec.minutes || 50));
      $('timerBtn').title = this.timer.start ? '수업 타이머 일시정지 (T)' : '수업 타이머 시작 (T)';
    }

    // ---------------------------------------------------------------- 발표자 창
    broadcast() {
      if (!this.channel || !this.sec) return;
      const s = this.slides[this.index];
      const n = this.slides[this.index + 1];
      let notes = s.notes || '';
      if (s.layout === 'quiz' && typeof s.answer === 'number') notes += `<p><b>정답: ${s.answer + 1}번</b> ${(s.options || [])[s.answer] || ''}</p>`;
      this.channel.postMessage({
        type: 'state', lesson: `Chapter ${this.ch.no} ${this.ch.title} · ${this.sec.title}`, index: this.index, total: this.slides.length,
        title: s.title, notes, next: n ? n.title : '', schedule: this.sec.flow || [], minutes: this.sec.minutes || 50
      });
    }

    // ---------------------------------------------------------------- 이벤트
    bind() {
      $('sFirst').onclick = () => this.go(0);
      $('sPrev').onclick = () => this.prev();
      $('sNext').onclick = () => this.next();
      $('sGrid').onclick = () => this.toggleGrid();
      $('sDoc').onclick = () => this.app.setView('doc');
      $('sFull').onclick = () => this.toggleFull();
      $('sSlider').oninput = (e) => { const i = (+e.target.value || 1) - 1; if (i !== this.index) { this.index = Math.max(0, Math.min(this.slides.length - 1, i)); this.render(); } };
      $('sPresenter').onclick = () => { window.open('presenter.html', 'cs-presenter', 'width=1100,height=720'); setTimeout(() => this.broadcast(), 800); };
      $('timerBtn').onclick = () => this.timerToggle();
      $('timerReset').onclick = () => this.timerReset();
      $('consoleHideBtn').onclick = () => this.showConsole(false);
      setInterval(() => this.timerDraw(), 500);

      $('gridOverlay').addEventListener('click', (e) => {
        const it = e.target.closest('[data-i]');
        if (it) { this.toggleGrid(false); this.go(+it.dataset.i); }
        if (e.target.closest('[data-close]')) this.toggleGrid(false);
      });
      this.wrap.querySelector('.fs-controls').addEventListener('click', (e) => {
        const b = e.target.closest('[data-fs]');
        if (!b) return;
        const a = b.dataset.fs;
        if (a === 'prev') this.prev();
        if (a === 'next') this.next();
        if (a === 'grid') this.toggleGrid();
        if (a === 'console') this.showConsole(!this.fsConsole);
        if (a === 'black') this.blackout();
        if (a === 'exit') this.toggleFull();
      });
      document.addEventListener('fullscreenchange', () => this.onFullChange());
      new ResizeObserver(() => this.fit()).observe(this.host);

      let idleT = 0;
      this.view.addEventListener('mousemove', (e) => {
        this.wrap.classList.remove('idle');
        clearTimeout(idleT);
        idleT = setTimeout(() => { if (this.isFull()) this.wrap.classList.add('idle'); }, 2500);
        if (this.isFull()) {
          const y = e.clientY - this.view.getBoundingClientRect().top;
          this.view.classList.toggle('bars-on', y < 76);
        }
      });
      this.view.addEventListener('mouseleave', () => this.view.classList.remove('bars-on'));

      document.addEventListener('keydown', (e) => {
        if (!this.active || !this.sec) return;
        if (!$('modal').classList.contains('hidden')) return;
        const t = e.target;
        if (t.closest && (t.closest('.CodeMirror') || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) {
          if (e.key === 'Escape' && t.closest('.CodeMirror')) t.blur ? document.activeElement.blur() : 0;
          return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); this.ink.undoOne(); return; }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const k = e.key;
        if (['ArrowRight', 'PageDown', ' '].includes(k)) { e.preventDefault(); this.next(); }
        else if (['ArrowLeft', 'PageUp'].includes(k)) { e.preventDefault(); this.prev(); }
        else if (k === 'Home') { e.preventDefault(); this.go(0); }
        else if (k === 'End') { e.preventDefault(); this.go(this.slides.length - 1); }
        else if (k === 'f' || k === 'F') { e.preventDefault(); this.toggleFull(); }
        else if (k === 'g' || k === 'G') { e.preventDefault(); this.toggleGrid(); }
        else if (k === 'r' || k === 'R') { e.preventDefault(); if (this.isFull()) this.showConsole(!this.fsConsole); }
        else if ((k === 'n' || k === 'N') && this.app.role === 'teacher') { e.preventDefault(); this.toggleNotes(); }
        else if (k === 'b' || k === 'B' || k === '.') { e.preventDefault(); this.blackout(); }
        else if ((k === 't' || k === 'T') && this.app.role === 'teacher') { e.preventDefault(); this.timerToggle(); }
        else if (k === 'Escape') {
          if ($('gridOverlay').classList.contains('hidden') && this.view.classList.contains('pfull')) this.toggleFull();
          this.toggleGrid(false); this.blackout(false);
        }
      });

      if (this.channel) {
        this.channel.onmessage = (ev) => {
          const m = ev.data || {};
          if (m.type === 'hello') this.broadcast();
          if (m.type === 'nav' && this.active) { if (m.dir > 0) this.next(); else this.prev(); }
        };
      }
    }
  }

  window.Deck = Deck;
})();
