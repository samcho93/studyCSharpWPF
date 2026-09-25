/* 공용 유틸: HTML 이스케이프, C#/XAML 코드 정적 강조(CodeMirror runMode), 편집기 생성 */
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** 제목 등 짧은 글: HTML 태그가 있으면 그대로, 없으면 엔티티(&lt; 등)를 풀었다가 다시 이스케이프 → List<int> 와 List&lt;int&gt; 모두 올바르게 표시 */
  const unent = (s) => String(s).replace(/&(lt|gt|amp|quot|#39);/g, (m, k) => ({ lt: '<', gt: '>', amp: '&', quot: '"', '#39': "'" }[k]));
  const textish = (s) => { s = String(s == null ? '' : s); return /<\/?[a-z][^>]*>/i.test(s) ? s : esc(unent(s)); };
  /** 파일 구분 주석: // ===== File: MainWindow.xaml =====  (C# · XAML · 데이터 파일) */
  const FILE_MARK = /^\s*\/\/\s*=+\s*(?:file|파일)\s*:\s*([\w./-]+?\.(?:cs|xaml|txt|dat|csv|json|xml|md))\s*=*\s*$/i;

  // ------------------------------------------------------------------ CodeMirror 혼합 모드 (C# + XAML)
  // 파일 구분 주석 뒤의 파일 확장자에 따라 C# (clike) 또는 XML 모드로 바꿔 가며 강조한다.
  if (window.CodeMirror) {
    CodeMirror.defineMode('csxaml', function (config) {
      const cs = CodeMirror.getMode(config, 'text/x-csharp');
      const xml = CodeMirror.getMode(config, { name: 'xml', htmlMode: false });
      return {
        startState() { return { file: 'cs', cs: CodeMirror.startState(cs), xml: CodeMirror.startState(xml) }; },
        copyState(s) { return { file: s.file, cs: CodeMirror.copyState(cs, s.cs), xml: CodeMirror.copyState(xml, s.xml) }; },
        token(stream, state) {
          if (stream.sol()) {
            const m = FILE_MARK.exec(stream.string);
            if (m) {
              state.file = /\.xaml$/i.test(m[1]) ? 'xml' : /\.cs$/i.test(m[1]) ? 'cs' : 'txt';
              if (state.file === 'xml') state.xml = CodeMirror.startState(xml);
              stream.skipToEnd();
              return 'file-mark';
            }
          }
          if (state.file === 'xml') return xml.token(stream, state.xml);
          if (state.file === 'txt') { stream.skipToEnd(); return null; }
          return cs.token(stream, state.cs);
        },
        indent(state, textAfter) { return state.file === 'xml' ? (xml.indent ? xml.indent(state.xml, textAfter) : CodeMirror.Pass) : (cs.indent ? cs.indent(state.cs, textAfter) : CodeMirror.Pass); },
        innerMode(state) { return state.file === 'xml' ? { state: state.xml, mode: xml } : { state: state.cs, mode: cs }; },
        lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/', electricChars: '{}'
      };
    });
    CodeMirror.defineMIME('text/x-csxaml', 'csxaml');
  }
  const MODE = 'text/x-csxaml';

  /** 코드를 줄 단위 <span class="ln"> 로 강조한 HTML 로 만든다 */
  function highlightLines(code) {
    code = String(code || '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
    const lines = [];
    let cur = '';
    const push = () => { lines.push(cur); cur = ''; };
    if (window.CodeMirror && CodeMirror.runMode) {
      CodeMirror.runMode(code, MODE, (text, style) => {
        if (text === '\n') { push(); return; }
        cur += style ? `<span class="${style.split(' ').map((s) => 'cm-' + s).join(' ')}">${esc(text)}</span>` : esc(text);
      });
      push();
    } else {
      code.split('\n').forEach((l) => lines.push(esc(l)));
    }
    const raw = code.split('\n');
    return lines.map((html, i) => {
      const mark = FILE_MARK.test(raw[i] || '');
      return `<span class="ln${mark ? ' file-mark' : ''}" data-n="${i + 1}">${mark ? `<span class="cm-file-mark">${esc(raw[i])}</span>` : html || ' '}</span>`;
    }).join('');
  }

  /** 줄 번호 없이 강조만 */
  function highlightInline(code) {
    code = String(code || '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
    if (!(window.CodeMirror && CodeMirror.runMode)) return esc(code);
    let out = '';
    CodeMirror.runMode(code, MODE, (text, style) => {
      out += style ? `<span class="${style.split(' ').map((s) => 'cm-' + s).join(' ')}">${esc(text)}</span>` : esc(text);
    });
    return out;
  }

  /** 코드의 대표 파일 이름 */
  function fileName(code) {
    const f = FILE_MARK.exec((code || '').split('\n')[0] || '');
    if (f) return f[1] + ' …';
    return /<Window\b|<UserControl\b|<Application\b/.test(code || '') ? 'MainWindow.xaml' : 'Program.cs';
  }

  /** 편집기 내용을 파일 목록으로 나눈다 (구분 주석이 없으면 Program.cs 하나) */
  function splitFiles(code) {
    const lines = String(code || '').replace(/\r\n/g, '\n').split('\n');
    const files = [];
    let cur = { name: 'Program.cs', text: [], startLine: 1 };
    let any = false;
    lines.forEach((l, i) => {
      const m = FILE_MARK.exec(l);
      if (m) {
        if (any || cur.text.some((t) => t.trim())) files.push(cur);
        cur = { name: m[1], text: [], startLine: i + 2 };
        any = true;
      } else cur.text.push(l);
    });
    files.push(cur);
    // 구분 주석 없이 XAML 로 시작하면 MainWindow.xaml 로 취급
    return files.map((f) => {
      let name = f.name;
      const text = f.text.join('\n');
      if (!any && /^\s*<(Window|UserControl|Application|Page)\b/.test(text)) name = 'MainWindow.xaml';
      return { name, text, startLine: f.startLine };
    });
  }

  /**
   * 코드 편집기 생성 (CodeMirror 5, 없으면 textarea 로 대체)
   * @returns {{getValue, setValue, refresh, focus, markErrors, clearErrors, jump, on}}
   */
  function makeEditor(host, value, opts = {}) {
    if (window.CodeMirror) {
      const cm = CodeMirror(host, {
        value: value || '',
        mode: MODE,
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        styleActiveLine: true,
        lineWrapping: !!opts.wrap,
        gutters: ['CodeMirror-linenumbers', 'err-gutter-col'],
        extraKeys: {
          'Ctrl-Enter': () => opts.onRun && opts.onRun(),
          'Cmd-Enter': () => opts.onRun && opts.onRun(),
          'Ctrl-/': 'toggleComment',
          'Cmd-/': 'toggleComment',
          Tab: (c) => (c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ', 'end')),
          'Shift-Tab': (c) => c.indentSelection('subtract')
        }
      });
      let marks = [];
      const api = {
        cm,
        getValue: () => cm.getValue(),
        setValue: (v) => { cm.setValue(v || ''); cm.clearHistory(); },
        refresh: () => cm.refresh(),
        focus: () => cm.focus(),
        on: (ev, fn) => cm.on(ev, fn),
        clearErrors() {
          marks.forEach((l) => { cm.removeLineClass(l, 'background', 'err-line'); });
          cm.clearGutter('err-gutter-col');
          marks = [];
        },
        markErrors(diags) {
          api.clearErrors();
          (diags || []).filter((d) => d.kind === 'error').forEach((d) => {
            const ln = (d.editorLine || d.line) - 1;
            if (ln < 0 || ln >= cm.lineCount()) return;
            const h = cm.addLineClass(ln, 'background', 'err-line');
            marks.push(h);
            const g = document.createElement('span');
            g.className = 'err-gutter';
            g.textContent = '●';
            g.title = d.message;
            cm.setGutterMarker(ln, 'err-gutter-col', g);
          });
        },
        jump(line) {
          const ln = Math.max(0, Math.min(cm.lineCount() - 1, line - 1));
          cm.focus();
          cm.setCursor({ line: ln, ch: 0 });
          cm.scrollIntoView({ line: ln, ch: 0 }, 80);
          const h = cm.addLineClass(ln, 'background', 'err-line');
          setTimeout(() => { if (!marks.includes(h)) cm.removeLineClass(h, 'background', 'err-line'); }, 1200);
        }
      };
      cm.on('change', () => { if (marks.length) api.clearErrors(); });
      return api;
    }
    const ta = document.createElement('textarea');
    ta.className = 'fallback';
    ta.spellcheck = false;
    ta.value = value || '';
    host.appendChild(ta);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); opts.onRun && opts.onRun(); } });
    return {
      cm: null,
      getValue: () => ta.value,
      setValue: (v) => { ta.value = v || ''; },
      refresh() {}, focus: () => ta.focus(), on: (ev, fn) => ta.addEventListener(ev === 'change' ? 'input' : ev, fn),
      clearErrors() {}, markErrors() {}, jump() { ta.focus(); }
    };
  }

  /**
   * 그림(SVG) 안의 <style> 규칙이 페이지 전체에 퍼지지 않도록 범위를 한정한다.
   */
  let scopeSeq = 0;
  function scoped(html) {
    html = String(html || '');
    if (!/<style/i.test(html)) return html;
    const cls = 'scope-' + (++scopeSeq);
    const out = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, css) => {
      const rules = css.replace(/([^{}]+)\{([^{}]*)\}/g, (mm, sel, body) => {
        if (/^\s*@/.test(sel)) return mm;
        const s = sel.split(',').map((x) => x.trim()).filter(Boolean).map((x) => `.${cls} ${x}`).join(', ');
        return `${s}{${body}}`;
      });
      return `<style${attrs}>${rules}</style>`;
    });
    return `<div class="${cls}" style="display:contents">${out}</div>`;
  }

  window.JU = { esc, textish, highlightLines, highlightInline, fileName, splitFiles, FILE_MARK, makeEditor, scoped };
})();
