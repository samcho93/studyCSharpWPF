#!/usr/bin/env node
/* WPF 예제 실행 화면 캡처 (Windows + .NET 9 SDK 필요)
 *   node tools/shots.mjs ch13 [ch14 ...|all] [--only <id>] [--force]
 * lessons/*.js 의 WPF 코드(본문 예제 · 실습 정답 · 슬라이드 코드)를 실제 WPF 앱으로 빌드 · 실행해 창을 캡처하고
 * assets/shots/<id>.png 로 저장한다. 강좌 화면은 assets/shots/index.json 을 보고 캡처가 있는 예제에 자동으로 붙인다.
 *   id 규칙: 본문 코드  <섹션id>-<섹션 안 WPF 예제 순번>      예) ch13-1-0
 *            실습 정답  <섹션id>-p<실습 순번>                 예) ch16-2-p0
 *            슬라이드   <섹션id>-s<슬라이드 순번>             예) ch15-1-s4
 *            프로젝트 완성 화면(preview)  <챕터id>-final       예) p04-final
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'shots');
const args = process.argv.slice(2);
let only = null, force = false;
const ids = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--only') only = args[++i]; else if (args[i] === '--force') force = true; else ids.push(args[i]); }

// 창을 띄우는 예제만 캡처한다 (System.Windows.Input.ICommand 만 쓰는 콘솔 예제는 제외)
const isWpf = (code) => /<Window\b|<UserControl\b/.test(code || '') || /\bnew Window\s*[({]|:\s*Window\b/.test(code || '');
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/course.js'), 'utf8'), ctx, { filename: 'course.js' });
const course = ctx.CS_COURSE;
const list = ids.length && ids[0] !== 'all' ? ids : course.order.map((o) => o.id);
const existing = new Set(fs.existsSync(path.join(OUT, 'index.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'index.json'), 'utf8')) : []);
const items = [];
for (const id of list) {
  const file = path.join(ROOT, 'lessons', id + '.js');
  if (!fs.existsSync(file)) continue;
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: id + '.js' });
  const ch = course.chapters[id];
  if (!ch) continue;
  const D = 1500;   // 창이 뜬 뒤 캡처까지 기다리는 시간(ms) — 예제에 shotDelay 로 바꿀 수 있다
  if (ch.previewCode && isWpf(ch.previewCode)) items.push({ id: `${id}-final`, code: ch.previewCode, delay: ch.previewDelay || D });
  for (const s of ch.sections) {
    let n = 0;
    (s.content || []).forEach((b) => { if (b.type === 'code' && b.run !== false && isWpf(b.code)) { items.push({ id: `${s.id}-${n}`, code: b.code, delay: b.shotDelay || D }); n++; } });
    (s.practice || []).forEach((p, i) => { if (p.solution && isWpf(p.solution)) items.push({ id: `${s.id}-p${i}`, code: p.solution, delay: p.shotDelay || D }); });
    (s.slides || []).forEach((sl, i) => { if (sl.layout === 'code' && sl.run !== false && isWpf(sl.code)) items.push({ id: `${s.id}-s${i}`, code: sl.code, delay: sl.shotDelay || D }); });
  }
}
const todo = items.filter((it) => (only ? it.id === only : true) && (force || !existing.has(it.id) || !fs.existsSync(path.join(OUT, it.id + '.png'))));
console.log(`WPF 예제 ${items.length}개 중 캡처할 것 ${todo.length}개`);
if (!todo.length) process.exit(0);
fs.mkdirSync(OUT, { recursive: true });
const tmp = path.join(ROOT, 'tools', 'shots', 'work');
fs.mkdirSync(tmp, { recursive: true });
const inFile = path.join(tmp, 'items.json');
fs.writeFileSync(inFile, JSON.stringify(todo));
const r = spawnSync('dotnet', ['run', '--project', path.join(ROOT, 'tools/shots'), '-c', 'Release', '--', inFile, OUT], { stdio: 'inherit', maxBuffer: 1 << 28 });
process.exit(r.status || 0);
