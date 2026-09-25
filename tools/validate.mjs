#!/usr/bin/env node
/* 강좌 콘텐츠 검증 도구 (Node 20+, .NET 9 SDK 필요)
 *   node tools/validate.mjs ch05 [ch06 ...|all] [--print] [--no-run] [--only 문자열]
 * - lessons/<id>.js 의 데이터 구조 검사
 * - 모든 C# 코드(본문 예제, 실습 정답/뼈대, 슬라이드 코드)를 브라우저와 같은 컴파일러(Roslyn + WpfShim)로
 *   컴파일하고 실행(tools/validator, 데스크톱 .NET) → expect 와 비교
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = { print: false, run: true, only: '' };
const ids = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--print') opt.print = true;
  else if (a === '--no-run') opt.run = false;
  else if (a === '--only') opt.only = args[++i];
  else ids.push(a);
}

function loadCourse() {
  const ctx = { console };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/course.js'), 'utf8'), ctx, { filename: 'course.js' });
  return ctx;
}

const LAYOUTS = ['title', 'bullets', 'code', 'two', 'table', 'diagram', 'quiz', 'practice', 'summary', 'shot'];
const BLOCKS = ['h', 'p', 'list', 'table', 'code', 'callout', 'figure', 'shot'];
const norm = (s) => String(s == null ? '' : s).replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
const indent = (s) => String(s).split('\n').map((l) => '    ' + l).join('\n');

function check(ch, errors) {
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const codes = [];
  ['id', 'no', 'title', 'summary'].forEach((k) => { if (!ch[k]) err(ch.id, `챕터 필드 없음: ${k}`); });
  if (!Array.isArray(ch.goals) || !ch.goals.length) err(ch.id, 'goals 없음');
  if (!Array.isArray(ch.sections) || !ch.sections.length) { err(ch.id, 'sections 없음'); return codes; }
  const seen = new Set();
  ch.sections.forEach((s, si) => {
    const W = `${s.id || ch.id + '#' + si}`;
    if (!s.id || seen.has(s.id)) err(W, 'id 없음/중복');
    if (s.id && !s.id.startsWith(ch.id + '-')) err(W, `섹션 id 는 '${ch.id}-번호' 형식이어야 합니다`);
    seen.add(s.id);
    ['title', 'minutes'].forEach((k) => { if (!s[k]) err(W, `필드 없음: ${k}`); });
    if (!Array.isArray(s.goals) || !s.goals.length) err(W, 'goals 없음');
    if (!Array.isArray(s.flow) || !s.flow.length) err(W, 'flow 없음');
    if (!Array.isArray(s.content) || !s.content.length) err(W, 'content 없음');
    (s.content || []).forEach((b, bi) => {
      const w = `${W} content[${bi}]`;
      if (!BLOCKS.includes(b.type)) err(w, `알 수 없는 type: ${b.type}`);
      if (b.type === 'code') {
        if (!b.code) err(w, 'code 없음');
        if (b.run !== false) codes.push({ where: `${w} ${b.title || ''}`, code: b.code, stdin: b.stdin, expect: b.expect, expectError: b.expectError, expectCompileError: b.expectCompileError, nondeterministic: b.nondeterministic, needExpect: !b.expectCompileError, compileOnly: !!b.expectCompileError });
        else codes.push({ where: `${w} ${b.title || ''} (run:false)`, code: b.code, fragment: true });
        if (b.shot && !fs.existsSync(path.join(ROOT, b.shot))) err(w, `캡처 파일 없음: ${b.shot}`);
      }
      if (b.type === 'shot' && (!b.src || !fs.existsSync(path.join(ROOT, b.src)))) err(w, `캡처 파일 없음: ${b.src}`);
      if (b.type === 'callout' && !['tip', 'warn', 'info', 'more', 'vs'].includes(b.kind)) err(w, `callout kind 오류: ${b.kind}`);
      if (b.type === 'list' && !Array.isArray(b.items)) err(w, 'items 없음');
      if (b.type === 'table' && (!Array.isArray(b.head) || !Array.isArray(b.rows))) err(w, 'head/rows 없음');
    });
    (s.practice || []).forEach((p, pi) => {
      const w = `${W} practice[${pi}] ${p.title || ''}`;
      ['title', 'desc', 'starter', 'solution'].forEach((k) => { if (!p[k]) err(w, `필드 없음: ${k}`); });
      if (p.solution) codes.push({ where: `${w} (정답)`, code: p.solution, stdin: p.stdin, expect: p.expect, expectError: p.expectError, nondeterministic: p.nondeterministic, needExpect: true });
      if (p.starter) codes.push({ where: `${w} (뼈대)`, code: p.starter, stdin: p.stdin, compileOnly: true, expectCompileError: p.starterHasErrors });
      if (p.shot && !fs.existsSync(path.join(ROOT, p.shot))) err(w, `캡처 파일 없음: ${p.shot}`);
    });
    if (!Array.isArray(s.quiz) || !s.quiz.length) err(W, 'quiz 없음');
    (s.quiz || []).forEach((q, qi) => {
      const w = `${W} quiz[${qi}]`;
      if (!q.q || !Array.isArray(q.options) || typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) err(w, '문항/보기/정답 오류');
    });
    if (!Array.isArray(s.slides) || s.slides.length < 3) err(W, 'slides 부족');
    (s.slides || []).forEach((sl, i) => {
      const w = `${W} slide[${i}]`;
      if (!LAYOUTS.includes(sl.layout)) err(w, `알 수 없는 layout: ${sl.layout}`);
      if (!sl.title) err(w, 'title 없음');
      if (!sl.notes) err(w, 'notes 없음');
      if (sl.layout === 'code') {
        if (!sl.code) err(w, 'code 없음');
        else if (sl.run !== false) codes.push({ where: `${w} ${sl.title}`, code: sl.code, stdin: sl.stdin, expectError: sl.expectError, expectCompileError: sl.expectCompileError, compileOnly: !!sl.expectCompileError });
        const lines = (sl.code || '').split('\n').length;
        if (lines > 30) err(w, `코드가 너무 깁니다 (${lines}줄, 30줄 이하)`);
        if (sl.shot && !fs.existsSync(path.join(ROOT, sl.shot))) err(w, `캡처 파일 없음: ${sl.shot}`);
      }
      if (sl.layout === 'shot' && (!sl.src || !fs.existsSync(path.join(ROOT, sl.src)))) err(w, `캡처 파일 없음: ${sl.src}`);
      if (sl.layout === 'quiz' && (typeof sl.answer !== 'number' || !Array.isArray(sl.options))) err(w, 'quiz 정답/보기 오류');
      if (sl.layout === 'practice' && sl.solution) codes.push({ where: `${w} (정답)`, code: sl.solution, stdin: sl.stdin, expectError: sl.expectError });
      ['left', 'right'].forEach((k) => { if (sl[k] && sl[k].code && sl[k].run !== false) codes.push({ where: `${w}.${k}`, code: sl[k].code, stdin: sl[k].stdin, compileOnly: sl[k].compileOnly }); });
      if (sl.layout === 'bullets' && !Array.isArray(sl.bullets)) err(w, 'bullets 없음');
    });
  });
  return codes;
}

// ------------------------------------------------------------------ 컴파일 · 실행 (tools/validator)
function runValidator(codes) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'csval-'));
  const inFile = path.join(tmp, 'codes.json'), outFile = path.join(tmp, 'result.json');
  fs.writeFileSync(inFile, JSON.stringify(codes.map((c, i) => ({ id: String(i), code: c.code, stdin: c.stdin || '', compileOnly: !!c.compileOnly || !!c.fragment }))));
  // 미리 빌드된 실행 파일이 있으면 그대로 쓴다 (여러 검증을 동시에 돌려도 빌드가 충돌하지 않게) — 없으면 dotnet run 으로 빌드
  const exe = path.join(ROOT, 'tools/validator/bin/Release/net9.0', process.platform === 'win32' ? 'Validator.exe' : 'Validator');
  const r = fs.existsSync(exe)
    ? spawnSync(exe, [inFile, outFile], { encoding: 'utf8', maxBuffer: 1 << 28 })
    : spawnSync('dotnet', ['run', '--project', path.join(ROOT, 'tools/validator'), '-c', 'Release', '--', inFile, outFile], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); throw new Error('validator 실행 실패'); }
  const res = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  fs.rmSync(tmp, { recursive: true, force: true });
  return res;
}

const ctx = loadCourse();
const course = ctx.CS_COURSE;
const list = ids.length && ids[0] !== 'all' ? ids : course.order.map((o) => o.id);
let total = 0, failed = 0;
for (const id of list) {
  const file = path.join(ROOT, 'lessons', id + '.js');
  if (!fs.existsSync(file)) { console.log(`- ${id}: 파일 없음 (건너뜀)`); continue; }
  const errors = [], warns = [];
  try {
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: id + '.js' });
  } catch (e) {
    console.log(`✗ ${id}: 스크립트 오류 ${e.stack}`); failed++; continue;
  }
  const ch = course.chapters[id];
  if (!ch) { console.log(`✗ ${id}: addChapter 로 등록되지 않음 (id 확인)`); failed++; continue; }
  let codes = check(ch, errors);
  if (opt.only) codes = codes.filter((c) => c.where.includes(opt.only));
  const t0 = Date.now();
  if (opt.run && codes.length) {
    const res = runValidator(codes);
    codes.forEach((c, i) => {
      const r = res[i];
      if (!r) { errors.push(`${c.where}: 결과 없음`); return; }
      const diagText = (r.diagnostics || []).map((d) => `${d.file}:${d.line} ${d.kind} ${d.id}: ${d.message}`).join('\n');
      if (c.expectCompileError) {
        if (r.phase === 'compile' && !r.ok) return;   // 의도한 컴파일 오류
        errors.push(`${c.where}: 컴파일 오류가 나야 하는데(expectCompileError) 컴파일에 성공했습니다`);
        return;
      }
      if (r.phase === 'compile' && !r.ok) {
        if (c.fragment) warns.push(`${c.where}: 실행 불가 조각(컴파일 안 됨 — run:false 이므로 경고만)`);
        else errors.push(`${c.where}: 컴파일 실패\n${indent(diagText || r.error || '')}`);
        return;
      }
      const wl = (r.diagnostics || []).filter((d) => d.kind === 'warning');
      if (wl.length) warns.push(`${c.where}: 컴파일 경고\n${indent(wl.slice(0, 5).map((d) => `${d.id}: ${d.message}`).join('\n'))}`);
      if (r.phase === 'compile') return;
      const output = r.output + (r.error ? `\n[error] ${r.error}` : '');
      if (r.exit === -1) { errors.push(`${c.where}: ${r.error}`); return; }
      if (r.exit !== 0 && !c.expectError) errors.push(`${c.where}: 종료 코드 ${r.exit}\n${indent(output)}`);
      if (c.expect != null && !c.nondeterministic) {
        if (norm(c.expect) !== norm(r.output)) errors.push(`${c.where}: 출력 불일치\n  --- expect\n${indent(norm(c.expect))}\n  --- actual\n${indent(norm(r.output))}`);
      } else if (c.needExpect && !c.nondeterministic && !r.windows) {
        warns.push(`${c.where}: expect 없음`);
      }
      if (opt.print) console.log(`\n### ${c.where}\n${output}${r.windows ? `\n[WPF 창 ${r.windows}개 열림]` : ''}`);
    });
  }
  total += codes.length;
  const nSlides = ch.sections.reduce((a, s) => a + (s.slides || []).length, 0);
  console.log(`${errors.length ? '✗' : '✓'} ${id}: 섹션 ${ch.sections.length}, 슬라이드 ${nSlides}, 코드 ${codes.length}, 오류 ${errors.length}, 경고 ${warns.length} (${((Date.now() - t0) / 1000).toFixed(0)}초)`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  warns.forEach((e) => console.log('  ⚠ ' + e));
  if (errors.length) failed++;
}
console.log(`\n코드 ${total}개 검사, 실패 ${failed}`);
process.exit(failed ? 1 : 0);
