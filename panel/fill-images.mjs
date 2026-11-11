// Ekran içi görselleri (img/<id> alanları) OpenAI ile üretir.
//   node panel/fill-images.mjs <proje> [id ...]
// Kaynak: projects/<proje>/assets/manifest.json
//   { "style": "...", "items": [ { "id", "screen", "w", "h", "prompt", "status" } ] }
// Çıktı: projects/<proje>/assets/generated/<id>.png (alan boyutunun 2 katı). status → "generated".
// Figma'ya yerleştirme ayrı adımdır (Figma MCP upload_assets) → status "placed".
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, ...only] = process.argv.slice(2);
const dir = path.join(ROOT, 'projects', slug || '');
const manifestFile = path.join(dir, 'assets', 'manifest.json');
if (!slug || !fs.existsSync(manifestFile)) { console.error('manifest yok:', manifestFile); process.exit(1); }

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const key = env.OPENAI_API_KEY;
const model = env.OPENAI_SCREEN_IMAGE_MODEL || 'gpt-image-2';
if (!key) { console.error('.env içinde OPENAI_API_KEY yok.'); process.exit(1); }

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const outDir = path.join(dir, 'assets', 'generated');
fs.mkdirSync(outDir, { recursive: true });

// Alan oranına en yakın, 16'nın katı; uzun kenar alanın 2 katı (en az 1536) — sonradan büyütme (bulanıklık) olmasın
function apiSize(w, h) {
  const scale = Math.max(1536, Math.max(w, h) * 2) / Math.max(w, h);
  const r16 = (x) => Math.max(256, Math.round((x * scale) / 16) * 16);
  return `${r16(w)}x${r16(h)}`;
}

// background: manifest öğesinde isteğe bağlı ("transparent" → şeffaf PNG, ör. araç/sprite)
// quality: isteğe bağlı ("high" | "medium" | "low")
// refImage: isteğe bağlı, proje klasörüne göreli stil referansı → /images/edits ile girdi görseli olarak verilir
async function generate(prompt, size, background, quality, refImage) {
  const call = async (s, bg) => {
    const opts = { size: s, n: 1, ...(bg ? { background: bg } : {}), ...(quality ? { quality } : {}) };
    let res;
    if (refImage) {
      const form = new FormData();
      form.append('model', model);
      form.append('prompt', prompt);
      for (const [k, v] of Object.entries(opts)) form.append(k, String(v));
      form.append('image[]', new Blob([fs.readFileSync(path.join(dir, refImage))], { type: 'image/png' }), path.basename(refImage));
      res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
    } else {
      res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, ...opts }),
      });
    }
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    return body.data[0].b64_json;
  };
  const [w, h] = size.split('x').map(Number);
  const std = w > h * 1.2 ? '1536x1024' : h > w * 1.2 ? '1024x1536' : '1024x1024';
  try { return await call(size, background); }
  catch (e) {
    try { return await call(std, background); }
    catch (e2) { if (!background) throw e2; return call(std); }
  }
}

const items = manifest.items.filter((it) => (only.length ? only.includes(it.id) : it.status !== 'generated' && it.status !== 'placed'));
let failed = 0;
await Promise.all(items.map(async (it) => {
  // it.style: isteğe bağlı, ortak style yerine geçer (ör. oyun tahtası karoları gibi sahne içermeyen görseller)
  // it.allowText: logo/wordmark gibi metni bilerek içeren öğeler — "metin yok" eki yerine yalnızca istenen metin
  const suffix = it.allowText ? 'Only the exact text given above, spelled exactly; no other text, no UI elements, no people.' : 'No text, no letters, no logos, no UI elements, no people unless asked.';
  const prompt = [it.style ?? manifest.style, it.prompt, suffix].filter(Boolean).join('\n');
  try {
    const b64 = await generate(prompt, apiSize(it.w, it.h), it.background, it.quality, it.refImage);
    const out = path.join(outDir, `${it.id}.png`);
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    // Yalnızca küçült; üretilen görsel 2x'ten küçükse olduğu gibi bırak (büyütme bulanıklaştırır)
    const nativeW = Number(execFileSync('sips', ['-g', 'pixelWidth', out]).toString().match(/pixelWidth:\s*(\d+)/)?.[1] || 0);
    if (nativeW > it.w * 2) execFileSync('sips', ['-z', String(it.h * 2), String(it.w * 2), out], { stdio: 'ignore' });
    it.status = 'generated'; it.file = `assets/generated/${it.id}.png`; it.model = model; delete it.error;
    console.log('ok', it.id);
  } catch (err) { failed++; it.status = 'error'; it.error = String(err.message).slice(0, 200); console.log('hata', it.id, it.error); }
}));
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(failed ? `${failed} hata` : 'tamam');
