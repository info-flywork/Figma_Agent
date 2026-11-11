// Panelin "generate-references" işini Claude olmadan yapar: OpenAI Image API ile
// projects/<proje>/references/<id>.png üretir ve adımları progress.mjs ile işaretler.
//   node panel/generate-references.mjs <proje>
// Ekran tarifleri: projects/<proje>/prompts.json → { style, screens: { <id>: "..." } } (yoksa ekran başlığı kullanılır)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const dir = path.join(ROOT, 'projects', slug || '');
const metaFile = path.join(dir, 'project.json');
if (!slug || !fs.existsSync(metaFile)) { console.error('Proje bulunamadı:', slug); process.exit(1); }

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const key = env.OPENAI_API_KEY;
const model = env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
// Opsiyonel: genel model (ör. gpt-6-astra) isteği planlar, görseli image_generation aracıyla çizdirir.
const planner = env.OPENAI_REFERENCE_MODEL || '';

export async function generateImage(prompt) {
  if (!planner) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, size: '864x1872', n: 1 }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    return body.data?.[0]?.b64_json;
  }
  const call = async (tool) => {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: planner,
        input: `You are a senior mobile product designer. Turn the brief below into one precise image-generation call and call the image_generation tool exactly once. Keep every Turkish UI string verbatim. Enforce the layout rules strictly.\n\n${prompt}`,
        tools: [tool],
        tool_choice: { type: 'image_generation' },
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    return (body.output || []).find((o) => o.type === 'image_generation_call')?.result;
  };
  try { return await call({ type: 'image_generation', model, size: '864x1872' }); }
  catch (e) { return await call({ type: 'image_generation', size: '1024x1536' }); }
}
if (!key) { console.error('.env içinde OPENAI_API_KEY yok.'); process.exit(1); }

const progress = (...args) => execFileSync(process.execPath, [path.join(ROOT, 'panel', 'progress.mjs'), slug, ...args.map(String)], { stdio: 'ignore' });
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
const job = meta.job;
if (!job || job.type !== 'generate-references') { console.error('Bekleyen generate-references işi yok.'); process.exit(1); }
const ids = job.ids?.length ? job.ids : meta.referenceIds || [];

const flow = fs.existsSync(path.join(dir, 'flow.md')) ? fs.readFileSync(path.join(dir, 'flow.md'), 'utf8') : '';
const titles = Object.fromEntries([...flow.matchAll(/`([^`]+)` — (.+)/g)].map((m) => [m[1], m[2].replace(/^\d+-\d+ — /, '')]));
const prompts = fs.existsSync(path.join(dir, 'prompts.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'prompts.json'), 'utf8')) : {};
const design = fs.existsSync(path.join(dir, 'DESIGN.md')) ? fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8').slice(0, 1500) : '';
const style = prompts.style || design || 'Clean, modern, calm mobile app UI.';

fs.mkdirSync(path.join(dir, 'references'), { recursive: true });
let failed = 0;
for (const [i, id] of ids.entries()) {
  const n = i + 1;
  progress('start', n, planner ? `${planner} → ${model}` : model);
  const screen = prompts.screens?.[id] || `Screen: ${titles[id] || id}.`;
  const prompt = [
    `High-fidelity iPhone app screen mockup for the app "${meta.name}", flat UI render of the full screen only (no device frame, no hands, no background scene). Canvas is exactly one 430x930 pt screen, edge to edge, iOS status bar at top and home indicator at bottom.`,
    `Layout grid: 16 pt left and right margins on every screen — all text, cards, inputs and buttons align to these margins; only full-bleed hero images and bars may touch the edges. Consistent 8 pt spacing rhythm, 44 pt minimum touch targets.`,
    `Follow current (2026) mobile UI/UX trends: clean editorial typography with strong hierarchy, generous whitespace, large rounded cards and pill buttons, bottom-anchored primary action within thumb reach, subtle depth via tone steps instead of heavy shadows, native iOS patterns (sheets, segmented controls, large titles). No dated looks: no skeuomorphism, no heavy gradients, no glassmorphism overload, no emoji, no stock clip-art.`,
    `All UI text is in Turkish exactly as written.`,
    `Visual style: ${style}`,
    `Screen: ${screen}`,
  ].join('\n');
  try {
    const b64 = await generateImage(prompt);
    if (!b64) throw new Error('Görsel dönmedi');
    const out = path.join(dir, 'references', `${id}.png`);
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    // 430×930 ekranın @2x hali: 860×1860
    execFileSync('sips', ['-z', '1860', '860', out], { stdio: 'ignore' }); // oran farklıysa da 430×930'a oturtur
    progress('done', n);
  } catch (err) {
    failed++;
    progress('error', n, String(err.message).slice(0, 160));
  }
}
const last = ids.length + 1;
progress('start', last);
progress(failed ? 'error' : 'done', last, failed ? `${failed} görsel üretilemedi` : `${ids.length} görsel kaydedildi`);
if (!failed) progress('finish');
console.log(failed ? `${failed} hata` : 'tamam');
