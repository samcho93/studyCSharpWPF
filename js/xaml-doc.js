/* 위치를 기억하는 XAML 파서 + 텍스트 편집 도우미
 *
 * 디자이너는 화면 조작을 "XAML 원문 고치기" 로 바꿔서 처리한다.
 * 그래서 파서는 각 요소 · 속성이 원문의 어디(문자 위치)에 있는지 기억해 두고,
 * 편집은 그 위치만 갈아 끼운다 — 들여쓰기 · 주석 · 줄바꿈이 그대로 남는다.
 *
 * 노드: { name, prefix, local, attrs[], children[], parent,
 *        start, end,            요소 전체 (여는 태그 ~ 닫는 태그)
 *        openStart, openEnd,    여는 태그만
 *        contentStart, contentEnd, selfClose, depth }
 * 속성: { name, value, start, end, valueStart, valueEnd, quote }
 */
(function () {
  'use strict';

  const NAME = /[A-Za-z_][\w.\-]*(?::[A-Za-z_][\w.\-]*)?/y;

  function parse(text) {
    text = String(text == null ? '' : text);
    const all = [];
    const errors = [];
    const stack = [];
    let root = null;
    let i = 0;
    const n = text.length;

    while (i < n) {
      const lt = text.indexOf('<', i);
      if (lt < 0) break;
      if (text.startsWith('<!--', lt)) { const e = text.indexOf('-->', lt); i = e < 0 ? n : e + 3; continue; }
      if (text.startsWith('<?', lt)) { const e = text.indexOf('?>', lt); i = e < 0 ? n : e + 2; continue; }
      if (text.startsWith('<![CDATA[', lt)) { const e = text.indexOf(']]>', lt); i = e < 0 ? n : e + 3; continue; }

      // 닫는 태그
      if (text[lt + 1] === '/') {
        const gt = text.indexOf('>', lt);
        const end = gt < 0 ? n : gt + 1;
        const name = text.slice(lt + 2, gt < 0 ? n : gt).trim();
        const top = stack[stack.length - 1];
        if (!top) errors.push({ pos: lt, message: `짝이 없는 닫는 태그 </${name}>` });
        else if (top.name !== name) errors.push({ pos: lt, message: `<${top.name}> 를 </${name}> 로 닫았습니다` });
        else { stack.pop(); top.contentEnd = lt; top.end = end; }
        i = end;
        continue;
      }

      const node = readTag(text, lt, errors);
      if (!node) { i = lt + 1; continue; }
      node.depth = stack.length;
      node.parent = stack[stack.length - 1] || null;
      if (node.parent) node.parent.children.push(node);
      else if (!root) root = node;
      all.push(node);
      if (node.selfClose) { node.contentStart = node.contentEnd = node.openEnd; }
      else { node.contentStart = node.openEnd; stack.push(node); }
      i = node.openEnd;
    }
    while (stack.length) {
      const t = stack.pop();
      errors.push({ pos: t.openStart, message: `<${t.name}> 를 닫지 않았습니다` });
      t.contentEnd = t.end = n;
    }
    return { text, root, all, errors };
  }

  function readTag(text, lt, errors) {
    NAME.lastIndex = lt + 1;
    const m = NAME.exec(text);
    if (!m || m.index !== lt + 1) return null;
    const name = m[0];
    const colon = name.indexOf(':');
    const node = {
      name,
      prefix: colon < 0 ? '' : name.slice(0, colon),
      local: colon < 0 ? name : name.slice(colon + 1),
      attrs: [],
      children: [],
      parent: null,
      openStart: lt,
      openEnd: -1,
      start: lt,
      end: -1,
      contentStart: -1,
      contentEnd: -1,
      selfClose: false,
      depth: 0,
    };
    let i = NAME.lastIndex;
    const n = text.length;
    while (i < n) {
      while (i < n && /\s/.test(text[i])) i++;
      if (i >= n) break;
      if (text[i] === '>') { node.openEnd = i + 1; break; }
      if (text[i] === '/' && text[i + 1] === '>') { node.selfClose = true; node.openEnd = i + 2; node.end = i + 2; break; }
      NAME.lastIndex = i;
      const am = NAME.exec(text);
      if (!am || am.index !== i) { i++; continue; }          // 알 수 없는 글자는 건너뛴다
      const attr = { name: am[0], value: '', start: i, end: -1, valueStart: -1, valueEnd: -1, quote: '"' };
      i = NAME.lastIndex;
      while (i < n && /\s/.test(text[i])) i++;
      if (text[i] === '=') {
        i++;
        while (i < n && /\s/.test(text[i])) i++;
        const q = text[i];
        if (q === '"' || q === "'") {
          const e = text.indexOf(q, i + 1);
          attr.quote = q;
          attr.valueStart = i + 1;
          attr.valueEnd = e < 0 ? n : e;
          attr.value = decode(text.slice(attr.valueStart, attr.valueEnd));
          i = e < 0 ? n : e + 1;
        } else {
          let e = i;
          while (e < n && !/[\s/>]/.test(text[e])) e++;
          attr.valueStart = i; attr.valueEnd = e; attr.quote = '';
          attr.value = decode(text.slice(i, e));
          i = e;
        }
      }
      attr.end = i;
      node.attrs.push(attr);
    }
    if (node.openEnd < 0) { node.openEnd = n; if (errors) errors.push({ pos: lt, message: `<${name}> 태그를 닫지 않았습니다 (> 없음)` }); }
    return node;
  }

  const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  function decode(s) {
    return String(s).replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (m, g) => {
      if (g[0] === '#') return String.fromCodePoint(parseInt(g[1] === 'x' || g[1] === 'X' ? g.slice(2) : g.slice(1), g[1] === 'x' || g[1] === 'X' ? 16 : 10));
      return ENT[g] != null ? ENT[g] : m;
    });
  }
  function encode(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  // ---------------------------------------------------------------- 조회
  function attr(node, name) { return node ? node.attrs.find((a) => a.name === name) || null : null; }
  function attrValue(node, name, def) { const a = attr(node, name); return a ? a.value : def; }
  /** 속성 요소(<Grid.RowDefinitions>) 가 아닌 진짜 자식 요소들 */
  function elementChildren(node) { return node ? node.children.filter((c) => c.local.indexOf('.') < 0) : []; }
  /** 속성 요소 (<Button.Content> 처럼 점이 있는 것) */
  function propertyChildren(node) { return node ? node.children.filter((c) => c.local.indexOf('.') >= 0) : []; }

  // ---------------------------------------------------------------- 편집 (모두 {from,to,text} 목록을 돌려준다)
  /** 속성 값 바꾸기 · 없으면 추가 · value 가 null 이면 삭제 */
  function setAttr(node, name, value) {
    const a = attr(node, name);
    if (value == null) {
      if (!a) return [];
      let from = a.start, to = a.end;
      // 앞의 공백 한 칸까지 지운다
      return [{ from: from - 1, to, text: '' }];
    }
    const v = encode(value);
    if (a) {
      if (a.quote) return [{ from: a.valueStart, to: a.valueEnd, text: v }];
      return [{ from: a.start, to: a.end, text: `${name}="${v}"` }];
    }
    // 새 속성: 여는 태그의 > (또는 />) 바로 앞에 넣는다
    const at = node.selfClose ? node.openEnd - 2 : node.openEnd - 1;
    return [{ from: at, to: at, text: ` ${name}="${v}"` }];
  }

  /** 여러 속성을 한 번에 (from 이 큰 것부터 적용해야 위치가 안 밀린다) */
  function setAttrs(node, map) {
    const edits = [];
    for (const k of Object.keys(map)) edits.push(...setAttr(node, k, map[k]));
    return edits;
  }

  /** 자식 XAML 한 줄 넣기. before 가 있으면 그 앞에, 없으면 마지막에 */
  function insertChild(doc, parent, xaml, before) {
    const text = doc.text;
    const pad = indentOf(text, parent.openStart) + '    ';
    if (parent.selfClose) {
      // <Canvas/> → <Canvas>\n  ...\n</Canvas>
      const open = { from: parent.openEnd - 2, to: parent.openEnd, text: '>' };
      const close = { from: parent.openEnd, to: parent.openEnd, text: `\n${pad}${xaml}\n${indentOf(text, parent.openStart)}</${parent.name}>` };
      return [close, open];   // 뒤쪽부터
    }
    const at = before ? before.start : lastChildEnd(parent);
    const anchor = before ? before.start : at;
    const insert = before ? `${xaml}\n${pad}` : `\n${pad}${xaml}`;
    return [{ from: anchor, to: anchor, text: insert }];
  }
  function lastChildEnd(parent) {
    const kids = parent.children;
    return kids.length ? kids[kids.length - 1].end : parent.contentStart;
  }

  /** 요소 지우기 (앞쪽 들여쓰기와 줄바꿈까지) */
  function remove(doc, node) {
    const text = doc.text;
    let from = node.start;
    while (from > 0 && (text[from - 1] === ' ' || text[from - 1] === '\t')) from--;
    if (from > 0 && text[from - 1] === '\n') from--;
    return [{ from, to: node.end, text: '' }];
  }

  function indentOf(text, pos) {
    let s = pos;
    while (s > 0 && text[s - 1] !== '\n') s--;
    let e = s;
    while (e < text.length && (text[e] === ' ' || text[e] === '\t')) e++;
    return text.slice(s, e);
  }

  /** 편집 목록을 위치가 밀리지 않게 뒤에서부터 적용 */
  function applyEdits(text, edits) {
    const sorted = edits.slice().sort((a, b) => b.from - a.from || b.to - a.to);
    let out = text;
    for (const e of sorted) out = out.slice(0, e.from) + e.text + out.slice(e.to);
    return out;
  }

  window.XamlDoc = { parse, attr, attrValue, elementChildren, propertyChildren, setAttr, setAttrs, insertChild, remove, applyEdits, indentOf, encode, decode };
})();
