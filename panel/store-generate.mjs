// Mağaza karelerini OpenAI ile üretir (Claude yok): node panel/store-generate.mjs <proje>
// job: { stores: ['ios','play'], items: [{ frame, screen, prompt?, regen? }] }
// Kare başına hedef (efektli İngilizce başlık + telefon) ve temiz zemin (yazı ve telefon yok) üretir. Figma'da zemin konur,
// telefon maketine GERÇEK ekran kopyası yerleşir, başlık hedeften metin katmanı olarak klonlanır; diller Figma'da kopyalanır.
// Model: OPENAI_STORE_MODEL / OPENAI_REFERENCE_MODEL varsa en üst GPT modeli Responses API + image_generation aracıyla çizer;
// yoksa images/edits (OPENAI_STORE_IMAGE_MODEL, varsayılan gpt-image-2). İlk dilden sonraki diller, ilk dilin karesinden çevrilir.
// Girdi görseller: references/store-ref-* (stil) + previews/<ekran>.png (gerçek ekran) + yeniden üretimde mevcut kare.
// Çıktı: store/base/<platform>-<NN>.png (App Store 1242×2688, Play Store 1080×1920), kayıt store.json → base[].
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
const model = env.OPENAI_STORE_IMAGE_MODEL || env.OPENAI_SCREEN_IMAGE_MODEL || 'gpt-image-2';
const planner = env.OPENAI_STORE_MODEL || env.OPENAI_REFERENCE_MODEL || '';
const progress = (...args) => execFileSync(process.execPath, [path.join(ROOT, 'panel', 'progress.mjs'), slug, ...args.map(String)], { stdio: 'ignore' });
if (!key) { progress('error', 1, '.env içinde OPENAI_API_KEY yok'); process.exit(1); }

const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
const job = meta.job;
if (!job || job.type !== 'store-generate') { console.error('Bekleyen store-generate işi yok.'); process.exit(1); }
const langs = job.langs?.length ? job.langs : [job.lang || 'English'];
// Kullanıcının seçtiği palet (panel → Renkler): varsa referansların renkleri yok sayılır
const palette = (store_palette()).filter((c) => /^#[0-9a-f]{6}$/i.test(c.hex));
function store_palette() { try { return JSON.parse(fs.readFileSync(path.join(dir, 'store.json'), 'utf8')).palette || []; } catch { return []; } }
const paletteText = palette.length
  ? `COLOURS: use ONLY this palette — ${palette.map((c) => `${c.role}: ${c.hex}`).join(', ')}. Background, props, stickers and accents must come from these colours (plus white/black for legibility). Ignore every colour in the style references; take only their layout and composition from them.`
  : '';
const stores = job.stores?.length ? job.stores : ['ios', 'play'];

const storeFile = path.join(dir, 'store.json');
const store = fs.existsSync(storeFile) ? JSON.parse(fs.readFileSync(storeFile, 'utf8')) : { frames: [] };
store.frames ||= [];
store.base ||= [];
const save = () => fs.writeFileSync(storeFile, JSON.stringify(store, null, 2) + '\n');

const refDir = path.join(dir, 'references');
const styleRefs = fs.existsSync(refDir) ? fs.readdirSync(refDir).filter((f) => /^store-ref-/.test(f)).sort().map((f) => path.join(refDir, f)).slice(0, 6) : [];
const design = fs.existsSync(path.join(dir, 'DESIGN.md')) ? fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8') : '';
const flow = fs.existsSync(path.join(dir, 'flow.md')) ? fs.readFileSync(path.join(dir, 'flow.md'), 'utf8') : '';
const about = flow.split('\n').filter((l) => l.trim() && !l.startsWith('- `') && !l.startsWith('#')).slice(0, 8).join(' ');
const titles = Object.fromEntries([...flow.matchAll(/`([^`]+)` — [^—]+ — ([^·\n]+)/g)].map((m) => [m[1], m[2].trim()]));
const mime = (f) => (f.endsWith('.webp') ? 'image/webp' : /\.jpe?g$/.test(f) ? 'image/jpeg' : 'image/png');

async function edit(prompt, images, size) {
  if (planner) return plan(prompt, images, size);
  return imagesEdit(prompt, images, size);
}

// En üst GPT modeli: görselleri okuyup image_generation aracıyla tek görsel çizer
async function plan(prompt, images, size) {
  const call = async (s) => {
    const content = [{ type: 'input_text', text: prompt }];
    for (const file of images) content.push({ type: 'input_image', image_url: `data:${mime(file)};base64,${fs.readFileSync(file).toString('base64')}` });
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: planner, input: [{ role: 'user', content }], tools: [{ type: 'image_generation', quality: 'high', size: s }], tool_choice: { type: 'image_generation' } }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    const out = (body.output || []).find((o) => o.type === 'image_generation_call')?.result;
    if (!out) throw new Error('Görsel dönmedi');
    return Buffer.from(out, 'base64');
  };
  try { return await call(size); } catch { return call('1024x1536'); }
}

async function imagesEdit(prompt, images, size) {
  const call = async (s) => {
    const form = new FormData();
    for (const [k, v] of Object.entries({ model, prompt, size: s, quality: 'high', n: '1' })) form.append(k, v);
    for (const file of images) form.append('image[]', new Blob([fs.readFileSync(file)], { type: mime(file) }), path.basename(file));
    const res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    return Buffer.from(body.data[0].b64_json, 'base64');
  };
  try { return await call(size); } catch { return call('1024x1536'); } // özel boyut desteklenmezse standart dikey
}

// Referans okuma (2026-11-10, kullanıcı kararı): referanslar birebir kopyalanmaz ama yazı dili, tipografi, düzen ve görsel dil
// önce bir kez çözümlenir (store.json → styleBrief, referans dosyaları değişince yenilenir) ve tüm karelerin brief'ine girer.
async function readStyle() {
  if (!styleRefs.length) return '';
  const sig = styleRefs.map((f) => `${path.basename(f)}:${fs.statSync(f).size}`).join('|');
  if (store.styleBrief?.sig === sig) return store.styleBrief.text;
  const content = [{ type: 'input_text', text: [
    'These are app store screenshot references the client likes. Study them carefully and write a concise STYLE BRIEF (max 220 words, English, bullet points) that another designer can follow to create a NEW, original series in the same spirit — not a copy. Cover:',
    '1) COPY: headline length, tone, wording patterns, casing, line breaks, use of numbers/social proof, sub-line style.',
    '2) TYPOGRAPHY: font category (geometric sans / rounded display / serif…), weights, size contrast, effects or flatness, colour of text, alignment.',
    '3) LAYOUT: headline position, phone count, phone angle/perspective, panoramic phones spanning frames, floating UI cards/chips, people/photos, cropping.',
    '4) VISUAL LANGUAGE: background type (flat, gradient, scene, photo), props/illustration style (3D, flat, none), depth, shadows, overall mood.',
    '5) COLOURS: the palette used (hex guesses).',
    'Do not mention brand names from the references.',
  ].join('\n') }];
  for (const f of styleRefs) content.push({ type: 'input_image', image_url: `data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}` });
  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: env.OPENAI_STYLE_MODEL || planner || 'gpt-4.1', input: [{ role: 'user', content }] }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
    const text = (body.output || []).flatMap((o) => o.content || []).filter((c) => c.type === 'output_text').map((c) => c.text).join('\n').trim();
    if (!text) return '';
    store.styleBrief = { sig, text, at: new Date().toISOString() };
    save();
    return text;
  } catch (e) { console.error('Stil çözümlemesi yapılamadı:', e.message); return ''; }
}
const styleBrief = await readStyle();

const SIZE = { ios: { api: '1152x2496', out: [1242, 2688], label: 'App Store screenshot (portrait 1242x2688)' },
  play: { api: '1088x1936', out: [1080, 1920], label: 'Google Play screenshot (portrait 9:16, 1080x1920)' } };
const fit = (src, out, platform) => {
  const [w, h] = SIZE[platform].out;
  execFileSync('python3', [path.join(ROOT, 'panel', 'store_fit.py'), src, out, String(w), String(h), 'cover', 'center']);
};

const total = job.items.length;
let failed = 0;
let step = 0;
const outDir = path.join(dir, 'store', 'base');
fs.mkdirSync(path.join(outDir, 'src'), { recursive: true });
const NO_TEXT = 'No watermarks, no store UI, no extra text besides the requested headline.';
// Her kare/mağaza için iki görsel (2026-11-09, kullanıcı kararı):
//  concept: hedef tasarım — efektli İngilizce başlık + telefon maketi (ekran yalnızca yer tutucu; gerçek ekran Figma'da konur)
//  clean:   aynı görselden yazı VE telefon kaldırılmış arka plan → Figma'da zemin olur
const CLEAN = 'Return this exact image with ALL text/lettering, the phone/device mockup AND every foreground element (characters, people, hands, 3D icon badges, stickers, UI cards/chips, emoji, floating props) completely removed; keep ONLY the background itself (gradient, soft blob shapes, subtle texture, thin doodle lines) and fill erased areas naturally so nothing looks cut out. Same colours and lighting. No text at all.';
// ön katman: telefonun ÖNÜNDE duracak öğeler (karakter, rozet, kart, süs) — magenta zeminde, sonra store_key.py ile şeffaf
const FRONT = 'Return this exact image at the exact same size and composition, but keep ONLY the foreground elements that sit in front of or around the phone: characters, people, hands, 3D icon badges, stickers, floating UI cards/chips, emoji, doodles. Draw each COMPLETE (also the parts that were hidden behind the phone), at exactly the same position, scale and angle. Remove the phone/device, all text/headlines and the whole background: replace everything else with a perfectly flat solid pure magenta #FF00FF (no gradient, no shadow on it, no checkerboard). Do not use magenta or pink inside the elements. Nothing may sit over the middle of the phone screen.';
for (const [i, item] of job.items.entries()) {
  let frame = store.base.find((f) => f.id === item.frame);
  if (!frame) { frame = { id: item.frame, screen: item.screen, files: {}, concept: {} }; store.base.push(frame); }
  frame.screen = item.screen;
  frame.concept ||= {};
  const screenFile = path.join(dir, 'previews', `${item.screen}.png`);
  const screens = fs.existsSync(screenFile) ? [screenFile] : [];
  const brief = [
    `Premium store screenshot ${i + 1} of ${total} for the mobile app "${meta.name}". Award-level 2026 app store marketing art.`,
    `Game: ${about.slice(0, 700)}`,
    ...(styleBrief
      ? [
        `This screenshot sells the feature shown on the "${titles[item.screen] || item.screen}" screen. Write an English headline (and sub-line if the style uses one) in the SAME copywriting style as the references: same length, tone, casing and wording patterns. Spell it correctly.`,
        `STYLE BRIEF distilled from the client's reference screenshots — follow it closely for copy, typography, layout, phone angle/perspective, floating UI cards and visual language${palette.length ? ' (but NOT its colours)' : ''}:\n${styleBrief}`,
        `The first ${styleRefs.length} input image(s) are those references: create an ORIGINAL design in the same spirit; do not copy their content, people, brands or text.`,
        'PHONE SCREEN: never leave the phone screen blank or white. Put the provided app screen image INSIDE the phone screen, fully filling it (scaled to the screen width, top-aligned), clearly visible and readable; floating UI cards may echo elements from that screen.',
      ]
      : [
        `This screenshot sells the feature shown on the "${titles[item.screen] || item.screen}" screen. Write ONE punchy English headline (max 5 words) with 1–2 highlighted words, plus an optional short sub-line (max 7 words). Make the typography EXCITING, not flat: chunky rounded display letters, thick outline, gradient fill, layered drop shadow / slight 3D depth, a slight tilt, highlighted word on a colourful pill or sticker shape, playful accents (sparkles, burst). Spell it correctly.`,
        (i % 2 === 0
          ? 'LAYOUT: headline block in the TOP ~26% of the canvas; the phone mockup below it.'
          : 'LAYOUT: headline block in the BOTTOM ~26% of the canvas; the phone mockup above it.'),
        'PHONE: exactly one phone mockup, NEAT and orderly: upright (or at most a gentle 5–8° tilt), centred horizontally, large (about 70% of canvas width), the whole screen fully visible and unobstructed, no hands, nothing overlapping the screen; same phone size and style in every screenshot of the series. 3D props stay around the edges, never on the screen.',
      ]),
    screens.length ? 'The next input image is the real app screen: it MUST appear inside the phone screen (never an empty/white screen), keep it clearly visible and unobstructed.' : '',
    paletteText,
    `Use the game's own characters and illustration style${palette.length ? '' : ' and colours'}: ${design.replace(/\s+/g, ' ').slice(0, 1000)}`,
    `Keep the series consistent across all ${total} screenshots; vary the composition.`,
    NO_TEXT,
    item.prompt ? `Changes requested: ${item.prompt}` : '',
  ].filter(Boolean).join('\n');

  let iosConcept = null;
  for (const platform of stores) {
    step += 1;
    progress('start', step, `${planner || model} high · hedef + temiz zemin`);
    try {
      const previous = item.regen && frame.concept?.[platform] ? [path.join(dir, frame.concept[platform])] : [];
      const iosFile = frame.concept?.ios ? path.join(dir, frame.concept.ios) : null;
      const base = iosConcept || (iosFile && fs.existsSync(iosFile) && !previous.length ? iosFile : null);
      const fromIos = platform === 'play' && base;
      const prompt = fromIos
        ? `Recompose this exact store screenshot as a ${SIZE.play.label}: same headline text and typography style, same background, colours, characters and props, but replace the iPhone with a modern ANDROID phone mockup (centred punch-hole camera, thin even bezels, no Apple design cues). Rearrange and scale so nothing is cut off. ${NO_TEXT}${item.prompt ? ` Also apply: ${item.prompt}` : ''}`
        : `${SIZE[platform].label}.${platform === 'ios' ? ' Use a modern iPhone mockup (Dynamic Island).' : ' Use a modern ANDROID phone mockup (centred punch-hole camera, thin bezels).'}\n${brief}${previous.length ? '\nThe last input image is the current version: keep what works and apply the changes.' : ''}`;
      const inputs = fromIos ? [base] : [...styleRefs, ...screens, ...previous];
      // 1) hedef (yazılı)
      const conceptRaw = path.join(outDir, 'src', `concept-${platform}-${frame.id}.png`);
      fs.writeFileSync(conceptRaw, await edit(prompt, inputs, SIZE[platform].api));
      const conceptOut = path.join(outDir, `concept-${platform}-${frame.id}.png`);
      fit(conceptRaw, conceptOut, platform);
      if (platform === 'ios') iosConcept = conceptOut;
      frame.concept[platform] = path.relative(dir, conceptOut);
      // 2) temiz zemin (yazı ve telefon yok)
      const cleanRaw = path.join(outDir, 'src', `${platform}-${frame.id}.png`);
      fs.writeFileSync(cleanRaw, await edit(CLEAN, [conceptOut], SIZE[platform].api));
      const out = path.join(outDir, `${platform}-${frame.id}.png`);
      fit(cleanRaw, out, platform);
      frame.files = { ...frame.files, [platform]: path.relative(dir, out) };
      // 3) ön katman (şeffaf PNG; Figma'da telefonun üstüne, tam kare boyutunda konur)
      const frontRaw = path.join(outDir, 'src', `front-${platform}-${frame.id}.png`);
      fs.writeFileSync(frontRaw, await edit(FRONT, [conceptOut], SIZE[platform].api));
      const frontFit = path.join(outDir, 'src', `front-${platform}-${frame.id}-fit.png`);
      fit(frontRaw, frontFit, platform);
      const frontOut = path.join(outDir, `front-${platform}-${frame.id}.png`);
      execFileSync('python3', [path.join(ROOT, 'panel', 'store_key.py'), frontFit, frontOut]);
      frame.front = { ...(frame.front || {}), [platform]: path.relative(dir, frontOut) };
      store.placed = false;
      save();
      progress('done', step);
    } catch (err) { failed++; progress('error', step, String(err.message).slice(0, 160)); }
  }
}
save();
if (!failed) progress('finish');
console.log(failed ? `${failed} hata` : 'tamam');
