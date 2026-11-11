import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'panel', 'public');
const PROJECTS = path.join(ROOT, 'projects');
const PORT = Number(process.env.PANEL_PORT || 4317);
const HOST = '127.0.0.1';
const MAX_IMAGE = 6_000_000;

const SECTION_TITLES = {
  '01-splash': 'Splash',
  '02-onboarding': 'Onboarding',
  '03-auth': 'Giriş',
  '04-user-questions': 'Kullanıcı soruları',
  '05-home': 'Ana sayfa',
  '06-calendar': 'Takvim',
  '07-discover': 'Keşfet',
  '08-reminders': 'Hatırlatmalar',
  '09-profile': 'Profil',
  '10-pregnancy-setup': 'Hamilelik kurulumu',
  '11-pregnancy-mode': 'Hamilelik modu',
  '12-baby-born': 'Bebeğim doğdu',
  '01-opening': 'Açılış ve onboarding',
  '02-setup': 'Kurulum',
  '03-decisions': 'Kararlar',
  '04-new-decision': 'Yeni karar',
  '05-support': 'Destek',
  '06-checkin': 'Yoklama',
  '07-insights': 'İçgörüler',
  '08-profile': 'Profil',
  '09-premium': 'Premium',
  '02-auth': 'Giriş / Kayıt',
  '03-user-questions': 'Kullanıcı soruları',
  '04-today': 'Bugün',
  '05-calendar': 'Takvim',
  '06-daily-log': 'Günlük kayıt',
  '07-reminders': 'Hatırlatmalar',
  '09-pregnancy-setup': 'Hamilelik kurulumu',
  '10-pregnancy-mode': 'Hamilelik modu',
  '11-baby-born': 'Bebeğim doğdu',
};

const STAGE_LABEL = {
  flow: 'FigJam',
  figma: 'Figma tasarımı',
  rest: 'Kalan ekranlar',
  audit: 'Denetim',
};

const IMAGE_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

const STATIC = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/fonts/urbanist-400.ttf': ['fonts/urbanist-400.ttf', 'font/ttf'],
  '/fonts/urbanist-500.ttf': ['fonts/urbanist-500.ttf', 'font/ttf'],
  '/fonts/urbanist-600.ttf': ['fonts/urbanist-600.ttf', 'font/ttf'],
  '/fonts/urbanist-700.ttf': ['fonts/urbanist-700.ttf', 'font/ttf'],
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function slugify(name) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', i: 'i', ö: 'o', ş: 's', ü: 'u' };
  return String(name || '')
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (char) => map[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function parseLink(value, kind) {
  let url;
  try {
    url = new URL(String(value || '').trim());
  } catch {
    return null;
  }
  if (!url.hostname.endsWith('figma.com')) return null;
  const parts = url.pathname.split('/').filter(Boolean);
  const expected = kind === 'figjam' ? 'board' : 'design';
  if (parts[0] !== expected) return null;
  const fileKey = parts[1];
  if (!fileKey || !/^[0-9a-zA-Z]{22,128}$/.test(fileKey)) return null;
  return { url: url.toString(), fileKey, nodeId: (url.searchParams.get('node-id') || '').replace('-', ':') || null };
}

function projectDir(slug) {
  return path.join(PROJECTS, slug);
}

function listSlugs() {
  if (!fs.existsSync(PROJECTS)) return [];
  return fs.readdirSync(PROJECTS).filter((name) => {
    if (!/^[a-z0-9-]+$/.test(name)) return false;
    const dir = projectDir(name);
    return fs.existsSync(path.join(dir, 'project.json')) || fs.existsSync(path.join(dir, 'flow.md'));
  });
}

function loadMeta(slug) {
  const dir = projectDir(slug);
  const meta = readJson(path.join(dir, 'project.json'), null);
  if (meta) return meta;
  const figma = readJson(path.join(dir, 'figma.json'), {});
  return {
    name: slug,
    slug,
    figjamUrl: figma.flowFileKey ? `https://www.figma.com/board/${figma.flowFileKey}` : '',
    figmaUrl: figma.fileKey ? `https://www.figma.com/design/${figma.fileKey}` : '',
    figjamKey: figma.flowFileKey || '',
    figmaKey: figma.fileKey || '',
    referenceIds: [],
    visual: {},
    figmaReview: {},
    job: null,
  };
}

function saveMeta(slug, meta) {
  writeJson(path.join(projectDir(slug), 'project.json'), meta);
}

function parseFlow(markdown) {
  const sections = [];
  let current = null;
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (\S+)\s*$/);
    if (heading) {
      current = { id: heading[1], title: SECTION_TITLES[heading[1]] || heading[1], screens: [] };
      sections.push(current);
      continue;
    }
    const screen = line.match(/^- `([^`]+)` — (\S+) — (.+?)(?:\s+·\s+ref:\s*(\S+))?\s*$/);
    if (screen && current) {
      current.screens.push({
        id: screen[1],
        index: screen[2],
        title: screen[3].trim(),
        section: current.id,
        sectionTitle: current.title,
        ref: screen[4] || null,
      });
    }
  }
  return sections;
}

function referenceFile(slug, id) {
  const dir = path.join(projectDir(slug), 'references');
  if (!fs.existsSync(dir)) return null;
  for (const ext of ['.png', '.jpg', '.webp']) {
    const file = path.join(dir, id + ext);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function previewFile(slug, id) {
  const file = path.join(projectDir(slug), 'previews', `${id}.png`);
  return fs.existsSync(file) ? file : null;
}

function screenMap(sections) {
  return new Map(sections.flatMap((section) => section.screens.map((screen) => [screen.id, screen])));
}

function visualStatus(meta, id) {
  const stored = meta.visual?.[id];
  if (stored === 'approved' || stored === 'rejected') return stored;
  return referenceFile(meta.slug, id) ? 'review' : 'missing';
}

// Ekran kuruldu mu: status 'built' (ya da referans ekranlarda 'reference') + node id
function isBuilt(record) {
  return Boolean(record && ['built', 'designed', 'reference'].includes(record.status) && (record.id || record.node));
}

function figmaStatus(meta, id, built) {
  const stored = meta.figmaReview?.[id];
  if (stored === 'approved' || stored === 'rejected') return stored;
  return built ? 'review' : 'waiting';
}


// İşler panelden kendiliğinden başlar: görsel üretimi bir node scripti, geri kalanı arka planda `claude -p`.
// Kapatmak için PANEL_AUTORUN=0 ile başlat.
const AUTORUN = process.env.PANEL_AUTORUN !== '0';
const CLAUDE_BIN = process.env.CLAUDE_BIN
  || [path.join(process.env.HOME || '', '.local', 'bin', 'claude')].find((file) => fs.existsSync(file))
  || 'claude';
const CLAUDE_TOOLS = [
  'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'ToolSearch', 'mcp__figma',
  'Bash(node:*)', 'Bash(python3:*)', 'Bash(curl:*)', 'Bash(ls:*)', 'Bash(mkdir:*)', 'Bash(wc:*)', 'Bash(sips:*)',
  'Bash(cd:*)', 'Bash(grep:*)', 'Bash(head:*)', 'Bash(tail:*)', 'Bash(cp:*)', 'Bash(mv:*)', 'Bash(find:*)',
];
// .env asla okunmaz (fill-images.mjs anahtarı kendisi okur).
const CLAUDE_DENY = ['Read(./.env)', 'Read(.env)', 'Edit(./.env)', 'Write(./.env)', 'Bash(cat:*)'];
// Model seçimi: tasarım dilini kuran işler Opus, kalıbı tekrar eden küçük işler Sonnet (kullanıcı kararı, 2026-11-03).
const JOB_MODELS = {
  'design-references': 'claude-opus-5-5',
  'design-rest': 'claude-opus-5-5',
  'store-figma': 'claude-opus-5-5',
  'store-play': 'claude-opus-5-5',
  'store-banner': 'claude-opus-5-5',
  'store-banner-clone': 'claude-sonnet-5-5',
  'store-add-frame': 'claude-opus-5-5',
  'store-add-frame-clone': 'claude-sonnet-5-5',
};
const PANEL_MODELS = { opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5' };
const DEFAULT_JOB_MODEL = process.env.PANEL_MODEL || 'claude-sonnet-5-5';
const running = new Set();
function autoRun(slug) {
  const meta = loadMeta(slug);
  const job = meta.job;
  if (!job || running.has(slug)) return;
  if (job.type === 'generate-references' || job.type === 'store-generate') {
    if (job.steps?.some((step) => step.status !== 'wait')) return; // yarım kalmış iş kendiliğinden yeniden başlamaz
    running.add(slug);
    const script = job.type === 'store-generate' ? 'store-generate.mjs' : 'generate-references.mjs';
    const child = spawn(process.execPath, [path.join(ROOT, 'panel', script), slug], { cwd: ROOT, stdio: 'ignore' });
    child.on('exit', () => running.delete(slug));
    return;
  }
  // Elle başlatılmış ya da daha önce başlatılıp durmuş işi tekrar açma; panelden "Yeniden başlat" ile açılır.
  if (!AUTORUN || job.runner || (job.steps || []).some((step) => step.status !== 'wait')) return;
  startClaude(slug);
}

function startClaude(slug) {
  const meta = loadMeta(slug);
  const job = meta.job;
  if (!job || running.has(slug)) return false;
  const logDir = path.join(projectDir(slug), 'runs');
  fs.mkdirSync(logDir, { recursive: true });
  const logFile = path.join(logDir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${job.type}.log`);
  const out = fs.openSync(logFile, 'a');
  const prompt = `${meta.name} panelindeki işi yap. Arka planda, kullanıcı olmadan çalışıyorsun: soru sorma, onay bekleme; `
    + 'CLAUDE.md ve job.steps neyse onu bitir, her adımda progress.mjs çalıştır, sonunda finish de. '
    + 'Bir adım yapılamıyorsa progress.mjs error ile nedenini yaz ve dur. .env dosyasını okuma. '
    + `Çalışma klasörün ${ROOT}; komutları buradan göreli yolla çalıştır (ör. node panel/progress.mjs ${slug} start 1). `
    + 'Dosya okumak için Bash değil Read/Grep kullan; cat kullanma. Bir Bash komutu reddedilirse işi bırakma, başka araçla devam et.';
  // Referans görselli düzenleme/ekleme birebir uygulanmalı: Opus (2026-11-05, kullanıcı kararı)
  // Projede model seçildiyse o; yoksa otomatik (referanslı iş Opus, tasarım kuran işler Opus, diğerleri Sonnet)
  const model = PANEL_MODELS[meta.model] || (job.images?.length ? 'claude-opus-5-5' : JOB_MODELS[job.phase === 'clone' && ['store-banner', 'store-add-frame'].includes(job.type) ? `${job.type}-clone` : job.type] || DEFAULT_JOB_MODEL);
  const child = spawn(CLAUDE_BIN, [
    '-p', prompt,
    '--model', model,
    '--output-format', 'json',
    '--permission-mode', 'acceptEdits',
    '--allowedTools', ...CLAUDE_TOOLS,
    '--disallowedTools', ...CLAUDE_DENY,
  ], { cwd: ROOT, stdio: ['ignore', out, out] });
  fs.closeSync(out);
  running.add(slug);
  meta.job.runner = { pid: child.pid, startedAt: new Date().toISOString(), log: path.relative(ROOT, logFile) };
  saveMeta(slug, meta);
  const requestedAt = job.requestedAt;
  const steps = (job.steps || []).length;
  const done = (code) => {
    if (!running.delete(slug)) return;
    const fresh = loadMeta(slug);
    // Gerçek maliyet: --output-format json çıktısının sonundaki total_cost_usd
    try {
      const text = fs.readFileSync(logFile, 'utf8');
      const result = JSON.parse(text.trim().split('\n').filter((l) => l.startsWith('{')).pop());
      if (typeof result.total_cost_usd === 'number') {
        fresh.costs = [...(fresh.costs || []), { type: job.type, model, usd: +result.total_cost_usd.toFixed(3), steps, turns: result.num_turns, at: new Date().toISOString() }];
        fs.writeFileSync(logFile.replace(/\.log$/, '.txt'), String(result.result || ''));
        if (fresh.lastJob?.requestedAt === requestedAt) fresh.lastJob.summary = String(result.result || '').slice(0, 4000);
      }
    } catch {}
    // İş hâlâ açıksa Claude bitirmeden çıktı: panel bunu hata olarak gösterir.
    if (fresh.job?.requestedAt === requestedAt && fresh.job.runner) {
      fresh.job.runner = { ...fresh.job.runner, exitedAt: new Date().toISOString(), exitCode: code };
    }
    saveMeta(slug, fresh);
    // Bu süreç kapanırken yeni bir iş açıldıysa (önceki finish'ten hemen sonra) şimdi başlat
    if (fresh.job && fresh.job.requestedAt !== requestedAt && !fresh.job.runner) setTimeout(() => autoRun(slug), 500);
  };
  child.on('exit', (code) => done(code ?? -1));
  child.on('error', () => done(-1));
  return true;
}

const JOB_STEPS = {
  'extract-flow': () => ['FigJam board’u okunuyor', 'Ekranlar ve bölümler çıkarılıyor', 'flow.md yazılıyor'],
  'import-figma': () => ['Figma dosyası okunuyor (sayfalar, Section’lar, ekranlar)', 'flow.md ve figma.json yazılıyor', 'Önizlemeler indiriliyor'],
};

function makeJob(slug, type, ids = []) {
  const state = buildState(slug);
  const title = (id) => state?.sections.flatMap((s) => s.screens).find((x) => x.id === id)?.title || id;
  let labels;
  if (JOB_STEPS[type]) labels = JOB_STEPS[type]();
  else if (type === 'generate-references') labels = [...ids.map((id) => `Görsel üretiliyor: ${title(id)}`), 'Görseller references/ klasörüne kaydediliyor'];
  else if (type === 'design-references') labels = [...ids.map((id) => `Figma’da tasarlanıyor: ${title(id)}`), 'Ekran görselleri üretiliyor (gpt-image-2)', 'Görseller Figma’ya yerleştiriliyor', 'Önizlemeler kaydediliyor'];
  else if (type === 'design-rest') labels = [...ids.map((id) => `Figma’da kuruluyor: ${title(id)}`), 'Ekran görselleri üretiliyor (gpt-image-2)', 'Görseller Figma’ya yerleştiriliyor'];
  else if (type === 'audit') labels = [...(state?.sections || []).map((s) => `Denetleniyor: ${s.title}`), 'Bulgular audit.json’a yazılıyor'];
  else if (type === 'screen-edit') labels = [...(ids.length ? ids.map((id) => `Düzenleniyor: ${title(id)}`) : ['Tüm ekranlara uygulanıyor']), 'Önizlemeler güncelleniyor'];
  else if (type === 'dev-notes') labels = [...(state?.sections || []).map((sec) => `Notlar yazılıyor: ${sec.title}`), 'figma.json güncelleniyor'];
  else if (type === 'screen-add') labels = ['flow.md’ye ekleniyor', 'Figma’da kuruluyor', 'Görsel ve önizleme'];
  else if (type === 'audit-fix') labels = [...ids.map((id) => `Düzeltiliyor: ${auditItems(slug).find((x) => x.id === id)?.title || id}`), 'Önizlemeler güncelleniyor'];
  else labels = [type];
  const now = new Date().toISOString();
  return { type, ...(ids.length ? { ids } : {}), requestedAt: now, updatedAt: now, steps: labels.map((label) => ({ label, status: 'wait' })) };
}

function auditItems(slug) {
  return readJson(path.join(projectDir(slug), 'audit.json'), { items: [] }).items || [];
}

function buildState(slug) {
  if (!listSlugs().includes(slug)) return null;
  const dir = projectDir(slug);
  const meta = loadMeta(slug);
  meta.slug = slug;
  const flowPath = path.join(dir, 'flow.md');
  const hasFlow = fs.existsSync(flowPath);
  const sections = hasFlow ? parseFlow(fs.readFileSync(flowPath, 'utf8')) : [];
  const known = screenMap(sections);
  const figma = readJson(path.join(dir, 'figma.json'), {});
  const screens = figma.screens || {};
  const fileKey = meta.figmaKey || figma.fileKey || '';

  const decorated = sections.map((section) => ({
    ...section,
    screens: section.screens.map((screen) => {
      const record = screens[screen.id];
      const built = isBuilt(record);
      const nodeId = built ? (record.id || record.node) : null;
      return {
        ...screen,
        built,
        nodeId,
        figmaUrl: nodeId && fileKey
          ? `https://www.figma.com/design/${fileKey}?node-id=${String(nodeId).replace(':', '-')}`
          : null,
        hasReference: Boolean(referenceFile(slug, screen.id)),
        hasPreview: Boolean(previewFile(slug, screen.id)),
      };
    }),
  }));

  const ids = (meta.referenceIds || []).filter((id) => known.has(id));
  const references = ids.map((id) => {
    const screen = known.get(id);
    const record = screens[id];
    const built = isBuilt(record);
    return {
      ...decorated.flatMap((section) => section.screens).find((screen) => screen.id === id),
      title: screen.title,
      visual: visualStatus(meta, id),
      figma: figmaStatus(meta, id, built),
    };
  });

  // Akış: FigJam → rastgele 5 ekranın Figma tasarımı + onay → kalan ekranlar + onay → denetim
  const allBuilt = sections.length > 0 && decorated.every((section) => section.screens.every((screen) => screen.built));
  // İçe aktarılan proje: tasarım zaten bitmiş, onay adımları atlanır
  const referencesApproved = meta.imported ? hasFlow : references.length > 0 && references.every((item) => item.built && item.figma === 'approved');
  const restApproved = meta.imported ? hasFlow && allBuilt : referencesApproved && allBuilt && Boolean(meta.restApproved);
  const realStage = !hasFlow ? 'flow' : !referencesApproved ? 'figma' : !restApproved ? 'rest' : 'audit';
  const audit = readJson(path.join(dir, 'audit.json'), null);

  const queueFile = readJson(path.join(dir, 'queue.json'), { items: [] });
  const queue = (queueFile.items || []).flatMap((item) => {
    const screen = known.get(item.id);
    if (!screen || ids.includes(item.id)) return [];
    return [{ id: screen.id, title: screen.title, sectionTitle: screen.sectionTitle, note: String(item.note || '') }];
  });

  const flat = decorated.flatMap((section) => section.screens);
  return {
    slug,
    name: meta.name,
    figjamUrl: meta.figjamUrl,
    figmaUrl: meta.figmaUrl,
    hasFlow,
    stage: realStage,
    stageLabel: STAGE_LABEL[realStage],
    job: meta.job ? { ...meta.job, running: running.has(slug) } : null,
    lastJob: meta.lastJob || null,
    referenceIds: ids,
    references,
    sections: decorated,
    queue,
    updatedAt: queueFile.updatedAt || null,
    allBuilt,
    audit: audit ? { updatedAt: audit.updatedAt || null, items: (audit.items || []).map((item) => ({ ...item, sectionTitle: SECTION_TITLES[item.section] || item.section || '' })) } : null,
    builtCount: flat.filter((screen) => screen.built).length,
    total: flat.length,
    costs: costSummary(meta.costs || []),
    store: { ...storeState(slug), suggested: storeScreens(slug, { sections: decorated, referenceIds: ids }) },
    model: meta.model || 'auto',
    imported: Boolean(meta.imported),
    library: libraryState(slug),
  };
}

// İş türüne göre adım başı ortalama gerçek maliyet (panel tahmini bunu kullanır)
function costSummary(costs) {
  const byType = {};
  for (const c of costs) {
    const t = (byType[c.type] ||= { runs: 0, usd: 0, steps: 0 });
    t.runs += 1; t.usd += c.usd; t.steps += c.steps || 1;
  }
  for (const t of Object.values(byType)) t.perStep = t.usd / Math.max(t.steps, 1);
  return { total: +costs.reduce((a, c) => a + c.usd, 0).toFixed(2), runs: costs.length, byType };
}

// Mağaza görselleri: projects/<slug>/store.json + store/<frameId>.png
// Mağaza kareleri store-generate.mjs ile üretilir: store/<dil>/<ios|play>-<NN>.png
const STORE_LANGS = ['English', 'Türkçe', 'Deutsch', 'Español', 'Français', 'Italiano', 'Português (Brasil)', 'Русский', '日本語', '한국어', '简体中文', 'हिन्दी'];
// .env'den yalnızca model adlarını okur (anahtar asla dışarı verilmez)
function imageModels() {
  const env = {};
  try {
    for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
      const m = line.match(/^\s*(OPENAI_[A-Z_]*MODEL)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
  return { planner: env.OPENAI_STORE_MODEL || env.OPENAI_REFERENCE_MODEL || '', image: env.OPENAI_STORE_IMAGE_MODEL || env.OPENAI_SCREEN_IMAGE_MODEL || 'gpt-image-2' };
}

function storeState(slug) {
  const dir = projectDir(slug);
  const data = readJson(path.join(dir, 'store.json'), { frames: [] });
  const refDir = path.join(dir, 'references');
  const refs = fs.existsSync(refDir) ? fs.readdirSync(refDir).filter((f) => /^store-ref-/.test(f)).sort() : [];
  const frames = (data.frames || []).map((f) => {
    const files = {};
    for (const [platform, rel] of Object.entries(f.files || {})) {
      const file = path.join(dir, rel);
      if (fs.existsSync(file)) files[platform] = `/api/store/${slug}/${encodeURIComponent(rel)}?v=${Math.round(fs.statSync(file).mtimeMs)}`;
    }
    return { id: f.id, lang: f.lang, screen: f.screen, files };
  });
  const base = (data.base || []).map((f) => {
    const files = {};
    for (const [platform, rel] of Object.entries(f.files || {})) {
      const file = path.join(dir, rel);
      if (fs.existsSync(file)) files[platform] = `/api/store/${slug}/${encodeURIComponent(rel)}?v=${Math.round(fs.statSync(file).mtimeMs)}`;
    }
    const concept = {};
    for (const [platform, rel] of Object.entries(f.concept || {})) {
      const file = path.join(dir, rel);
      if (fs.existsSync(file)) concept[platform] = `/api/store/${slug}/${encodeURIComponent(rel)}?v=${Math.round(fs.statSync(file).mtimeMs)}`;
    }
    return { id: f.id, screen: f.screen, files, concept };
  }).filter((f) => Object.keys(f.files).length || Object.keys(f.concept).length);
  const banners = (data.banners || []).filter((b) => fs.existsSync(path.join(dir, b.file)))
    .map((b) => ({ ...b, url: `/api/store/${slug}/${encodeURIComponent(b.file)}?v=${Math.round(fs.statSync(path.join(dir, b.file)).mtimeMs)}` }));
  return { banners, suggested: [], base, figma: data.figma || null, palette: data.palette || [], models: imageModels(), refs: refs.map((f) => `references/${f}`), frames, langs: STORE_LANGS, placed: Boolean(data.placed), ready: frames.some((f) => Object.keys(f.files).length) };
}

// Kullanıcının yüklediği asset kütüphanesi: projects/<slug>/assets/library/ + library.json
const LIB_EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/svg+xml': '.svg' };
const LIB_KINDS = ['asset', 'icon', 'character', 'background', 'ui'];
function libraryState(slug) {
  const items = readJson(path.join(projectDir(slug), 'library.json'), { items: [] }).items || [];
  return items.filter((it) => fs.existsSync(path.join(projectDir(slug), it.file)))
    .map((it) => ({ id: it.id, name: it.name, kind: it.kind, note: it.note || '', url: `/api/lib/${slug}/${path.basename(it.file)}`, placed: Boolean(it.figmaHash || it.figmaNode) }));
}

// Mağaza için önerilen ekranlar: her bölümden EN DOLU ekran (screen_density.py), açılış/onboarding/ayar bölümleri hariç;
// kare sayısı bölüm sayısından fazlaysa kalanlar en dolu diğer ekranlardan. Onaylı 5 ekran varsa önce onlar.
const densityCache = new Map();
function density(files) {
  const need = files.filter((f) => {
    const m = fs.statSync(f).mtimeMs;
    return densityCache.get(f)?.m !== m;
  });
  if (need.length) {
    try {
      const out = execFileSync('python3', [path.join(ROOT, 'panel', 'screen_density.py'), ...need], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      for (const line of out.trim().split('\n')) {
        const [f, v] = line.split('\t');
        densityCache.set(f, { m: fs.statSync(f).mtimeMs, v: Number(v) || 0 });
      }
    } catch {}
  }
  return (f) => densityCache.get(f)?.v || 0;
}
function storeScreens(slug, state) {
  const prev = (id) => path.join(projectDir(slug), 'previews', `${id}.png`);
  const withPreview = (id) => fs.existsSync(prev(id));
  const skip = /onboard|acilis|açılış|splash|intro|giris|diger|ayar|settings|pause|duraklat/i;
  const pool = [];
  for (const sec of state.sections) {
    if (skip.test(sec.id || '') || skip.test(sec.title || '')) continue;
    for (const x of sec.screens) if (withPreview(x.id) && !/empty|bos|error|hata|confirm|onay|popup|modal|menu/i.test(x.id)) pool.push({ id: x.id, sec: sec.id || sec.title });
  }
  const score = density(pool.map((x) => prev(x.id)));
  for (const x of pool) x.score = score(prev(x.id));
  const best = [];
  for (const sec of [...new Set(pool.map((x) => x.sec))]) {
    const top = pool.filter((x) => x.sec === sec).sort((a, b) => b.score - a.score)[0];
    if (top) best.push(top.id);
  }
  const rest = pool.filter((x) => !best.includes(x.id)).sort((a, b) => b.score - a.score).map((x) => x.id);
  return [...new Set([...state.referenceIds.filter(withPreview), ...best, ...rest])];
}

function summaries() {
  return listSlugs().map((slug) => {
    const state = buildState(slug);
    return {
      slug,
      name: state.name,
      stage: state.stage,
      stageLabel: state.stageLabel,
      total: state.total,
      builtCount: state.builtCount,
      referenceCount: state.referenceIds.length,
      job: state.job?.type || null,
    };
  });
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('Dosya 6 MB sınırını aşıyor.'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function screenId(value) {
  return /^[a-z0-9-]+$/.test(value) ? value : null;
}

function slugOf(value) {
  return /^[a-z0-9-]+$/.test(value) && listSlugs().includes(value) ? value : null;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'projects' && !parts[2]) {
      return sendJson(res, 200, { projects: summaries() });
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && !parts[2]) {
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const name = String(payload.name || '').trim().slice(0, 80);
      const slug = slugify(name);
      // mode: 'import' → tasarımı bitmiş Figma dosyası; FigJam gerekmez, ekranlar dosyadan okunur
      const imported = payload.mode === 'import';
      const figjam = imported && !payload.figjamUrl ? { url: '', fileKey: '' } : parseLink(payload.figjamUrl, 'figjam');
      const design = parseLink(payload.figmaUrl, 'design');
      if (!name || !slug) return sendJson(res, 400, { error: 'Proje adı gerekli.' });
      if (listSlugs().includes(slug)) return sendJson(res, 409, { error: 'Bu proje adı kullanılıyor.' });
      if (!figjam) return sendJson(res, 400, { error: 'FigJam linki bir board adresi olmalı.' });
      if (!design) return sendJson(res, 400, { error: 'Figma linki bir design adresi olmalı.' });
      saveMeta(slug, {
        name,
        slug,
        figjamUrl: figjam.url,
        figmaUrl: design.url,
        figjamKey: figjam.fileKey,
        figmaKey: design.fileKey,
        referenceIds: [],
        visual: {},
        figmaReview: {},
        job: null,
        ...(imported ? { imported: true, importNode: design.nodeId || null } : {}),
      });
      { const m = loadMeta(slug); m.job = makeJob(slug, imported ? 'import-figma' : 'extract-flow'); saveMeta(slug, m); }
      autoRun(slug);
      return sendJson(res, 201, buildState(slug));
    }

    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'state') {
      const slug = slugOf(url.searchParams.get('project') || '');
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'PUT' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'references') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const state = buildState(slug);
      if (!state.hasFlow) return sendJson(res, 409, { error: 'Önce akış çıkarılmalı.' });
      if (state.references.some((item) => item.visual === 'approved' || item.figma === 'approved')) {
        return sendJson(res, 409, { error: 'Onaylanmış referansın seçimi değişmez.' });
      }
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const ids = [...new Set((payload.ids || []).map(screenId).filter(Boolean))];
      const known = screenMap(state.sections);
      if (ids.length < 1 || ids.length > 5 || ids.some((id) => !known.has(id))) {
        return sendJson(res, 400, { error: '1 ile 5 ekran seç.' });
      }
      const meta = loadMeta(slug);
      meta.referenceIds = ids;
      meta.visual = {};
      meta.figmaReview = {};
      saveMeta(slug, meta);
      meta.job = makeJob(slug, 'generate-references', ids);
      saveMeta(slug, meta);
      autoRun(slug);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'review') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const id = screenId(payload.id || '');
      const target = payload.target === 'figma' ? 'figma' : payload.target === 'visual' ? 'visual' : '';
      const status = payload.status === 'approved' || payload.status === 'rejected' ? payload.status : '';
      const state = buildState(slug);
      const item = state.references.find((entry) => entry.id === id);
      if (!item || !target || !status) return sendJson(res, 400, { error: 'Onay kaydı geçersiz.' });
      if (target === 'visual' && item.visual === 'missing') return sendJson(res, 409, { error: 'Önce görsel üretilmeli.' });
      if (target === 'figma' && item.visual !== 'approved') return sendJson(res, 409, { error: 'Önce görsel onaylanmalı.' });
      if (target === 'figma' && status === 'approved' && item.figma === 'waiting') {
        return sendJson(res, 409, { error: 'Önce ekran Figma’da kurulmalı.' });
      }
      const meta = loadMeta(slug);
      const bucket = target === 'visual' ? 'visual' : 'figmaReview';
      meta[bucket] = { ...meta[bucket], [id]: status };
      saveMeta(slug, meta);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'approve-design') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const state = buildState(slug);
      if (!state.hasFlow) return sendJson(res, 409, { error: 'Önce FigJam okunmalı.' });
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const ids = [...new Set((payload.ids || []).map(screenId).filter(Boolean))];
      const byId = new Map(state.references.map((item) => [item.id, item]));
      if (!ids.length || ids.some((id) => !byId.has(id))) {
        return sendJson(res, 400, { error: 'En az bir referans görsel seç.' });
      }
      if (ids.some((id) => byId.get(id).visual === 'missing')) {
        return sendJson(res, 409, { error: 'Görseli olmayan kart onaylanamaz. Önce görseller üretilmeli.' });
      }
      const meta = loadMeta(slug);
      meta.visual = { ...(meta.visual || {}) };
      for (const id of ids) {
        if (byId.get(id).visual !== 'approved') meta.visual[id] = 'approved';
      }
      meta.job = makeJob(slug, 'design-references', ids);
      saveMeta(slug, meta);
      autoRun(slug);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'approve-figma') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const state = buildState(slug);
      if (!state.references.length || !state.references.every((item) => item.built)) return sendJson(res, 409, { error: 'Önce 5 ekran Figma’da tasarlanmalı.' });
      const meta = loadMeta(slug);
      meta.figmaReview = Object.fromEntries(state.references.map((item) => [item.id, 'approved']));
      delete meta.revisionNote;
      saveMeta(slug, meta);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'approve-rest') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const state = buildState(slug);
      if (state.stage !== 'rest' || !state.allBuilt) return sendJson(res, 409, { error: 'Önce tüm ekranlar Figma’da kurulmalı.' });
      if (state.job) return sendJson(res, 409, { error: 'Bekleyen iş bitmeden onaylanamaz.' });
      const meta = loadMeta(slug);
      meta.restApproved = true;
      meta.job = makeJob(slug, 'audit');
      saveMeta(slug, meta);
      autoRun(slug);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'DELETE' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && !parts[3]) {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      if (running.has(slug)) return sendJson(res, 409, { error: 'Claude bu projede çalışıyor; bitince silebilirsin.' });
      // Kalıcı silme yok: klasör projects/.trash/ altına taşınır, gerekirse geri alınabilir.
      const trash = path.join(PROJECTS, '.trash');
      fs.mkdirSync(trash, { recursive: true });
      fs.renameSync(projectDir(slug), path.join(trash, `${slug}-${Date.now()}`));
      return sendJson(res, 200, { ok: true });
    }

    if (parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'library') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const dir = projectDir(slug);
      const file = path.join(dir, 'library.json');
      const data = readJson(file, { items: [] });
      data.items ||= [];
      if (req.method === 'POST' && !parts[4]) {
        const ext = LIB_EXT[req.headers['content-type']];
        if (!ext) return sendJson(res, 415, { error: 'PNG, JPEG, WebP ya da SVG yükle.' });
        const body = await readBody(req, 20_000_000);
        const raw = String(url.searchParams.get('name') || 'asset').replace(/\.[a-z0-9]+$/i, '');
        const base = raw.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/^-|-$/g, '') || 'asset';
        let name = base; let n = 2;
        while (data.items.some((it) => it.name === name)) name = `${base}-${n++}`;
        const id = `lib-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
        const rel = `assets/library/${id}${ext}`;
        fs.mkdirSync(path.join(dir, 'assets', 'library'), { recursive: true });
        fs.writeFileSync(path.join(dir, rel), body);
        const kind = LIB_KINDS.includes(url.searchParams.get('kind')) ? url.searchParams.get('kind') : (ext === '.svg' ? 'icon' : 'asset');
        data.items.push({ id, name, kind, note: '', file: rel, addedAt: new Date().toISOString() });
        writeJson(file, data);
        return sendJson(res, 200, buildState(slug));
      }
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const item = data.items.find((it) => it.id === payload.id);
      if (!item) return sendJson(res, 404, { error: 'Asset bulunamadı.' });
      if (req.method === 'POST' && parts[4] === 'update') {
        if (payload.name) item.name = String(payload.name).trim().slice(0, 60);
        if (LIB_KINDS.includes(payload.kind)) item.kind = payload.kind;
        if (typeof payload.note === 'string') item.note = payload.note.slice(0, 300);
        writeJson(file, data);
        return sendJson(res, 200, buildState(slug));
      }
      if (req.method === 'POST' && parts[4] === 'delete') {
        fs.rmSync(path.join(dir, item.file), { force: true });
        data.items = data.items.filter((it) => it !== item);
        writeJson(file, data);
        return sendJson(res, 200, buildState(slug));
      }
      return sendJson(res, 404, { error: 'Bulunamadı.' });
    }

    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'lib' && parts[2] && parts[3]) {
      const slug = slugOf(parts[2]);
      const name = decodeURIComponent(parts[3]);
      if (!slug || !/^lib-[\w]+\.(png|jpg|webp|svg)$/.test(name)) return sendJson(res, 404, { error: 'Bulunamadı.' });
      const f = path.join(projectDir(slug), 'assets', 'library', name);
      if (!fs.existsSync(f)) return sendJson(res, 404, { error: 'Bulunamadı.' });
      const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
      return send(res, 200, fs.readFileSync(f), types[path.extname(f)]);
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'model') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const payload = JSON.parse((await readBody(req, 2_000)).toString('utf8') || '{}');
      const meta = loadMeta(slug);
      if (PANEL_MODELS[payload.model]) meta.model = payload.model; else delete meta.model;
      saveMeta(slug, meta);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'run') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const meta = loadMeta(slug);
      if (!meta.job || meta.job.type === 'generate-references') return sendJson(res, 409, { error: 'Başlatılacak iş yok.' });
      if (running.has(slug)) return sendJson(res, 409, { error: 'Claude zaten çalışıyor.' });
      delete meta.job.runner;
      saveMeta(slug, meta);
      startClaude(slug);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'DELETE' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'job') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      if (running.has(slug)) return sendJson(res, 409, { error: 'İş şu an çalışıyor.' });
      const meta = loadMeta(slug);
      if (meta.job) meta.lastJob = { ...meta.job, cancelledAt: new Date().toISOString() };
      meta.job = null;
      saveMeta(slug, meta);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'job') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
      const type = payload.type;
      const state = buildState(slug);
      const allowed = {
        'extract-flow': state.stage === 'flow' && !state.imported,
        'import-figma': state.imported && !state.job,
        'generate-references': state.stage === 'references' && state.references.some((item) => item.visual === 'missing' || item.visual === 'rejected'),
        'design-references': state.stage === 'figma' && !state.job,
        'design-rest': state.stage === 'rest',
        audit: state.stage === 'audit' && !state.job,
        'screen-edit': Boolean(state.allBuilt) && !state.job,
        'screen-add': Boolean(state.allBuilt) && !state.job,
        'dev-notes': Boolean(state.allBuilt) && !state.job,
        'store-generate': Boolean(state.allBuilt) && !state.job,
        'store-figma': state.store.base.length > 0 && !state.job,
        'store-translate': Boolean(state.store.figma?.nodes?.English) && !state.job,
        'store-play': Boolean(state.store.figma?.nodes?.English) && !state.job,
        'store-banner': Boolean(state.store.figma?.nodes?.English) && !state.job,
        'store-add-frame': Boolean(state.store.figma?.nodes?.English) && !state.job,
        'audit-fix': state.stage === 'audit' && !state.job && Boolean(state.audit?.items.some((item) => item.status !== 'fixed')),
      };
      if (!allowed[type]) return sendJson(res, 409, { error: 'Bu iş şu aşamada istenemez.' });
      if (type === 'design-rest') {
        const known = screenMap(state.sections);
        const items = [...known.values()]
          .filter((screen) => !state.referenceIds.includes(screen.id))
          .map((screen) => ({ id: screen.id, note: '' }));
        writeJson(path.join(projectDir(slug), 'queue.json'), {
          project: slug,
          updatedAt: new Date().toISOString(),
          items,
        });
      }
      let meta = loadMeta(slug);
      if (type === 'design-references' && (!meta.referenceIds?.length || payload.reshuffle)) {
        // Her bölümden en fazla bir ekran, rastgele 5 ekran
        const bySection = state.sections.map((sec) => [...sec.screens].sort(() => Math.random() - 0.5)).sort(() => Math.random() - 0.5);
        const picked = [];
        for (let round = 0; picked.length < 5 && round < 10; round++) for (const list of bySection) if (list[round] && picked.length < 5) picked.push(list[round].id);
        meta.referenceIds = picked; meta.figmaReview = {}; saveMeta(slug, meta);
      }
      if (type === 'design-references' && payload.note) { meta.revisionNote = String(payload.note).slice(0, 2000); saveMeta(slug, meta); }
      meta = loadMeta(slug);
      const freshState = buildState(slug);
      const jobIds = type === 'design-references' ? freshState.references.map((item) => item.id)
        : type === 'generate-references'
        ? state.references.filter((item) => item.visual === 'missing' || item.visual === 'rejected').map((item) => item.id)
        : type === 'design-rest' ? readJson(path.join(projectDir(slug), 'queue.json'), { items: [] }).items.map((item) => item.id)
        : type === 'audit-fix' ? auditItems(slug)
          .filter((item) => item.status !== 'fixed' && (!Array.isArray(payload.ids) || payload.ids.includes(item.id)))
          .map((item) => item.id) : [];
      if (type === 'store-generate') {
        // Yazısız görseller (tek sefer, dilden bağımsız): store/base/
        const stores = ['ios', 'play'].filter((x) => (Array.isArray(payload.stores) ? payload.stores : ['ios', 'play']).includes(x));
        if (!stores.length) return sendJson(res, 400, { error: 'Mağaza seç.' });
        if (!state.store.refs.length) return sendJson(res, 409, { error: 'Önce referans görsel yükle.' });
        let items;
        if (payload.frame) {
          const f = state.store.base.find((x) => x.id === payload.frame);
          if (!f) return sendJson(res, 404, { error: 'Kare bulunamadı.' });
          items = [{ frame: f.id, screen: f.screen, prompt: String(payload.note || '').slice(0, 1500), regen: true }];
        } else {
          const count = Math.min(10, Math.max(1, Number(payload.count) || 5));
          const known = new Set(state.sections.flatMap((sec) => sec.screens.map((x) => x.id)));
          const picked = (Array.isArray(payload.screens) ? payload.screens : []).filter((id) => known.has(id)).slice(0, count);
          const screens = picked.length ? picked : storeScreens(slug, state).slice(0, count);
          if (!screens.length) return sendJson(res, 409, { error: 'Ekran önizlemesi yok.' });
          items = screens.map((screen, i) => ({ frame: String(i + 1).padStart(2, '0'), screen }));
          // Yeni üretim: eski hedef/temiz zeminler panelden kalkar (silinmez, store/_eski-<zaman>/ altına taşınır)
          const sdir = path.join(projectDir(slug), 'store');
          const sfile = path.join(projectDir(slug), 'store.json');
          const sdata = readJson(sfile, {});
          if ((sdata.base || []).length) {
            const arch = path.join(sdir, `_eski-${new Date().toISOString().replace(/[:.]/g, '-')}`);
            fs.mkdirSync(arch, { recursive: true });
            if (fs.existsSync(path.join(sdir, 'base'))) fs.renameSync(path.join(sdir, 'base'), path.join(arch, 'base'));
            fs.writeFileSync(path.join(arch, 'base.json'), JSON.stringify(sdata.base, null, 2));
            sdata.base = [];
            writeJson(sfile, sdata);
          }
        }
        const storeLabel = { ios: 'App Store (iPhone)', play: 'Play Store (Android)' };
        meta.job = makeJob(slug, 'store-generate');
        meta.job.steps = items.flatMap((item) => stores.map((st) => ({ label: `Kare ${item.frame} · ${storeLabel[st]} · yazısız`, status: 'wait' })));
        Object.assign(meta.job, { stores, items });
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'store-banner') {
        // Tanıtım/kapak görselleri (bir ya da birkaç ölçü): hazır zemin, ekran ve başlıklardan Figma'da kurulur, OpenAI yok
        const list = (Array.isArray(payload.banners) ? payload.banners : [payload]).slice(0, 6).map((x) => {
          const w = Math.round(Number(x.w)), h = Math.round(Number(x.h));
          return { w, h, name: String(x.name || `${w}×${h}`).slice(0, 60) };
        });
        if (!list.length || list.some(({ w, h }) => !(w >= 200 && w <= 4000 && h >= 200 && h <= 4000))) return sendJson(res, 400, { error: 'Geçerli bir ölçü gir (200–4000 px).' });
        const data = readJson(path.join(projectDir(slug), 'store.json'), {});
        const langs = Object.keys(data.figma?.nodes || {}).filter((l) => STORE_LANGS.includes(l));
        if (!langs.length) return sendJson(res, 409, { error: 'Önce App Store kareleri Figma’da kurulmalı.' });
        langs.sort((a, b) => (a === 'English' ? -1 : b === 'English' ? 1 : 0));
        // phase: 'english' = yalnızca İngilizce tasarım; 'clone' = onaylı İngilizce'yi diğer dillere klonla; yoksa ikisi birden
        const phase = ['english', 'clone'].includes(payload.phase) ? payload.phase : 'all';
        const hasEn = ({ w, h }) => (data.banners || []).some((b) => b.lang === 'English' && b.w === w && b.h === h);
        if (phase === 'clone' && list.some((x) => !hasEn(x))) return sendJson(res, 409, { error: 'Önce seçili ölçülerin İngilizce tanıtım görselini oluştur.' });
        const jobLangs = phase === 'english' ? ['English'] : phase === 'clone' ? langs.filter((l) => l !== 'English') : langs;
        meta.job = makeJob(slug, type);
        meta.job.steps = [
          ...list.flatMap((bn) => [...(phase !== 'clone' ? [{ label: `Tasarım (English): ${bn.name}`, status: 'wait' }] : []), ...(phase !== 'english' ? [{ label: `${bn.name}: ${jobLangs.filter((l) => l !== 'English').length} dile klon + çeviri`, status: 'wait' }] : [])]),
          { label: 'PNG’ler dışa aktarılıyor', status: 'wait' },
        ];
        Object.assign(meta.job, { langs: jobLangs, phase, banners: list, banner: list[0], ...(payload.note ? { note: String(payload.note).slice(0, 2000) } : {}) });
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'store-add-frame') {
        // Mevcut setin sonuna yeni kare(ler): phase english = İngilizce iOS + Play; clone = diğer dillere kopyala + çevir
        const data = readJson(path.join(projectDir(slug), 'store.json'), {});
        const en = data.figma?.nodes?.English || {};
        const phase = payload.phase === 'clone' ? 'clone' : 'english';
        const screen = String(payload.screen || '').slice(0, 120);
        let nn;
        if (phase === 'english') {
          if (!screen) return sendJson(res, 400, { error: 'Ekran seç.' });
          nn = String(Object.keys(en).length + 1).padStart(2, '0');
        } else {
          nn = String(payload.frame || Object.keys(en).sort().pop());
          if (!en[nn]) return sendJson(res, 409, { error: 'Önce İngilizce kareyi oluştur.' });
        }
        const langs = phase === 'english' ? ['English'] : Object.keys(data.figma?.nodes || {}).filter((l) => l !== 'English' && STORE_LANGS.includes(l));
        meta.job = makeJob(slug, type);
        meta.job.steps = phase === 'english'
          ? [{ label: `App Store ${nn} (English)`, status: 'wait' }, { label: `Play Store ${nn} (English)`, status: 'wait' }, { label: 'PNG’ler dışa aktarılıyor', status: 'wait' }]
          : [...langs.map((l) => ({ label: `${l}: kare ${nn} kopyalanıp çevriliyor`, status: 'wait' })), { label: 'PNG’ler dışa aktarılıyor', status: 'wait' }];
        Object.assign(meta.job, { phase, frame: nn, langs, ...(screen ? { screen } : {}), ...(payload.note ? { note: String(payload.note).slice(0, 2000) } : {}) });
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'store-play') {
        // Play Store'u App Store'dan türet: temiz zeminler 9:16 kırpılır (OpenAI yok), Claude Android maketle Figma'da kurar
        const dir = projectDir(slug);
        const sf = path.join(dir, 'store.json');
        const data = readJson(sf, { frames: [], base: [] });
        let cropped = 0;
        for (const b of data.base || []) {
          const ios = b.files?.ios && path.join(dir, b.files.ios);
          if (!ios || !fs.existsSync(ios)) continue;
          const rel = `store/base/play-${b.id}.png`;
          execFileSync('python3', [path.join(ROOT, 'panel', 'store_fit.py'), ios, path.join(dir, rel), '1080', '1920', 'cover', 'center']);
          b.files.play = rel;
          const front = b.front?.ios && path.join(dir, b.front.ios);
          if (front && fs.existsSync(front)) {
            const frel = `store/base/front-play-${b.id}.png`;
            execFileSync('python3', [path.join(ROOT, 'panel', 'store_fit.py'), front, path.join(dir, frel), '1080', '1920', 'cover', 'center']);
            b.front = { ...b.front, play: frel };
          }
          cropped++;
        }
        if (!cropped) return sendJson(res, 409, { error: 'App Store temiz zemini yok.' });
        writeJson(sf, data);
        const langs = Object.keys(data.figma?.nodes || {}).filter((l) => STORE_LANGS.includes(l));
        if (!langs.length) return sendJson(res, 409, { error: 'Önce App Store kareleri Figma’da kurulmalı.' });
        langs.sort((a, b) => (a === 'English' ? -1 : b === 'English' ? 1 : 0));
        meta.job = makeJob(slug, type);
        meta.job.steps = [{ label: 'Play Section, Android maket ve English kareleri', status: 'wait' }, ...langs.filter((l) => l !== 'English').map((l) => ({ label: `${l}: Play kareleri`, status: 'wait' })), { label: 'PNG’ler dışa aktarılıyor', status: 'wait' }];
        Object.assign(meta.job, { langs });
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'store-figma' || type === 'store-translate') {
        // Claude: yazısız görselleri Figma'ya koyar + İngilizce yazılar; ya da İngilizce kareleri kopyalayıp çevirir. PNG'ler store/<dil>/
        const langs = type === 'store-translate'
          ? STORE_LANGS.filter((l) => l !== 'English' && (Array.isArray(payload.langs) ? payload.langs : []).includes(l))
          : ['English'];
        if (!langs.length) return sendJson(res, 400, { error: 'En az bir dil seç.' });
        meta.job = makeJob(slug, type);
        meta.job.steps = type === 'store-figma'
          ? ['Store sayfası ve Section’lar hazırlanıyor', 'Yazısız görseller Figma’ya yerleştiriliyor', 'İngilizce başlıklar ve alt yazılar yazılıyor', 'PNG’ler dışa aktarılıyor (English)'].map((label) => ({ label, status: 'wait' }))
          : [...langs.map((l) => ({ label: `${l}: kopyalanıp çevriliyor`, status: 'wait' })), { label: 'PNG’ler dışa aktarılıyor', status: 'wait' }];
        Object.assign(meta.job, { langs, ...(payload.note ? { note: String(payload.note).slice(0, 2000) } : {}) });
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'dev-notes') {
        meta.job = makeJob(slug, type);
        if (payload.note) meta.job.note = String(payload.note).slice(0, 2000);
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'screen-add') {
        const section = state.sections.find((sec) => sec.title === payload.section);
        if (!section || !String(payload.note || '').trim()) return sendJson(res, 400, { error: 'Bölüm ve ekran tarifi gerekli.' });
        meta.job = makeJob(slug, type);
        Object.assign(meta.job, { section: section.title, after: section.screens.at(-1)?.id || null, note: String(payload.note).slice(0, 2000) });
        const images = (Array.isArray(payload.images) ? payload.images : []).filter((p) => /^references\/attach-[\w-]+\.(png|jpg|webp)$/.test(p)).slice(0, 6);
        if (images.length) meta.job.images = images;
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'screen-edit') {
        const known = screenMap(state.sections);
        const ids = (Array.isArray(payload.ids) ? payload.ids : []).map((id) => screenId(id)).filter((id) => id && known.has(id));
        if (!String(payload.note || '').trim()) return sendJson(res, 400, { error: 'Ne değişeceğini yaz.' });
        meta.job = makeJob(slug, type, ids);
        meta.job.note = String(payload.note).slice(0, 2000);
        const images = (Array.isArray(payload.images) ? payload.images : []).filter((p) => /^references\/attach-[\w-]+\.(png|jpg|webp)$/.test(p)).slice(0, 6);
        if (images.length) meta.job.images = images;
        saveMeta(slug, meta);
        autoRun(slug);
        return sendJson(res, 200, buildState(slug));
      }
      if (type === 'audit-fix' && !jobIds.length) return sendJson(res, 400, { error: 'Düzeltilecek bulgu seç.' });
      meta.job = makeJob(slug, type, jobIds);
      if (type === 'design-references' && meta.revisionNote) meta.job.note = meta.revisionNote;
      saveMeta(slug, meta);
      autoRun(slug);
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'PUT' && parts[0] === 'api' && parts[1] === 'queue' && parts[2]) {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const state = buildState(slug);
      if (state.stage !== 'rest') return sendJson(res, 409, { error: 'Kalan ekranlar, referanslar onaylanınca açılır.' });
      const payload = JSON.parse((await readBody(req, 200_000)).toString('utf8') || '{}');
      const known = screenMap(state.sections);
      const items = [];
      for (const item of payload.items || []) {
        const id = screenId(item?.id || '');
        if (!id || !known.has(id) || state.referenceIds.includes(id)) {
          return sendJson(res, 400, { error: 'Sırada tanımsız bir ekran var.' });
        }
        items.push({ id, note: String(item.note || '').slice(0, 2000) });
      }
      writeJson(path.join(projectDir(slug), 'queue.json'), {
        project: slug,
        updatedAt: new Date().toISOString(),
        items,
      });
      return sendJson(res, 200, buildState(slug));
    }

    if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'screen' && parts[2] && parts[3]) {
      const slug = slugOf(parts[2]);
      const id = screenId(parts[3]);
      if (!slug || !id) return sendJson(res, 404, { error: 'Ekran bulunamadı.' });
      const file = previewFile(slug, id);
      if (!file) return sendJson(res, 404, { error: 'Görsel yok.' });
      return send(res, 200, fs.readFileSync(file), 'image/png');
    }

    if (parts[0] === 'api' && parts[1] === 'reference' && parts[2] && parts[3]) {
      const slug = slugOf(parts[2]);
      const id = screenId(parts[3]);
      if (!slug || !id) return sendJson(res, 404, { error: 'Ekran bulunamadı.' });
      const state = buildState(slug);
      if (!state.referenceIds.includes(id) && !screenMap(state.sections).has(id)) {
        return sendJson(res, 404, { error: 'Ekran bulunamadı.' });
      }
      const dir = path.join(projectDir(slug), 'references');
      if (req.method === 'GET') {
        const file = referenceFile(slug, id);
        if (!file) return sendJson(res, 404, { error: 'Görsel yok.' });
        const ext = path.extname(file);
        const type = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        return send(res, 200, fs.readFileSync(file), type);
      }
      if (req.method === 'POST') {
        const ext = IMAGE_EXT[req.headers['content-type']];
        if (!ext) return sendJson(res, 415, { error: 'Yalnızca PNG, JPEG veya WebP.' });
        const body = await readBody(req, MAX_IMAGE);
        fs.mkdirSync(dir, { recursive: true });
        for (const old of ['.png', '.jpg', '.webp']) {
          const previous = path.join(dir, id + old);
          if (fs.existsSync(previous)) fs.unlinkSync(previous);
        }
        fs.writeFileSync(path.join(dir, id + ext), body);
        const meta = loadMeta(slug);
        if (meta.visual?.[id] !== 'approved') meta.visual = { ...meta.visual, [id]: undefined };
        delete meta.visual[id];
        saveMeta(slug, meta);
        return sendJson(res, 200, buildState(slug));
      }
    }

    // Mağaza: kare silme ve zip
    if (parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'store') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const dir = projectDir(slug);
      const file = path.join(dir, 'store.json');
      const data = readJson(file, { frames: [] });
      data.frames ||= [];
      if (req.method === 'POST' && parts[4] === 'palette') {
        const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
        data.palette = (Array.isArray(payload.palette) ? payload.palette : []).slice(0, 6)
          .filter((c) => /^#[0-9a-f]{6}$/i.test(c?.hex || ''))
          .map((c) => ({ role: String(c.role || 'Renk').slice(0, 30), hex: c.hex.toUpperCase() }));
        writeJson(file, data);
        return sendJson(res, 200, buildState(slug));
      }
      if (req.method === 'POST' && parts[4] === 'delete') {
        const payload = JSON.parse((await readBody(req, 20_000)).toString('utf8') || '{}');
        if (payload.base) {
          const f = (data.base || []).find((x) => x.id === payload.frame);
          if (!f) return sendJson(res, 404, { error: 'Görsel bulunamadı.' });
          for (const [platform, rel] of Object.entries(f.files || {})) {
            if (payload.platform && platform !== payload.platform) continue;
            fs.rmSync(path.join(dir, rel), { force: true });
            fs.rmSync(path.join(dir, 'store', 'base', 'src', `${platform}-${f.id}.png`), { force: true });
            delete f.files[platform];
          }
          for (const [platform, rel] of Object.entries(f.concept || {})) {
            if (payload.platform && platform !== payload.platform) continue;
            fs.rmSync(path.join(dir, rel), { force: true });
            delete f.concept[platform];
          }
          data.base = data.base.filter((x) => Object.keys(x.files || {}).length);
          writeJson(file, data);
          return sendJson(res, 200, buildState(slug));
        }
        // { lang } → o dilin tümü; { lang, frame } → o kare; { lang, frame, platform } → yalnızca o mağazanın görseli
        const hit = data.frames.filter((f) => f.lang === payload.lang && (!payload.frame || f.id === payload.frame));
        if (!hit.length) return sendJson(res, 404, { error: 'Görsel bulunamadı.' });
        const srcDir = (f) => path.join(dir, 'store', String(f.lang).replace(/[^\w-]+/g, '_'), 'src');
        for (const f of hit) {
          for (const [platform, rel] of Object.entries(f.files || {})) {
            if (payload.platform && platform !== payload.platform) continue;
            fs.rmSync(path.join(dir, rel), { force: true });
            fs.rmSync(path.join(srcDir(f), `${platform}-${f.id}.png`), { force: true });
            delete f.files[platform];
          }
        }
        data.frames = data.frames.filter((f) => Object.keys(f.files || {}).length);
        writeJson(file, data);
        return sendJson(res, 200, buildState(slug));
      }
      if (req.method === 'GET' && parts[4] === 'zip') {
        const lang = url.searchParams.get('lang');
        const dirs = [];
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'store-'));
        for (const f of data.frames.filter((x) => !lang || x.lang === lang)) {
          for (const [platform, rel] of Object.entries(f.files || {})) {
            const src = path.join(dir, rel);
            if (!fs.existsSync(src)) continue;
            const folder = path.join(f.lang.replace(/[^\w-]+/g, '_'), platform === 'ios' ? 'appstore' : 'playstore');
            fs.mkdirSync(path.join(tmp, folder), { recursive: true });
            fs.copyFileSync(src, path.join(tmp, folder, `${platform === 'ios' ? 'appstore' : 'playstore'}-${f.id}.png`));
            const top = folder.split(path.sep)[0];
            if (!dirs.includes(top)) dirs.push(top);
          }
        }
        for (const b of (data.banners || []).filter((x) => !lang || x.lang === lang)) {
          const src = path.join(dir, b.file);
          if (!fs.existsSync(src)) continue;
          const top = b.lang.replace(/[^\w-]+/g, '_');
          fs.mkdirSync(path.join(tmp, top, 'tanitim'), { recursive: true });
          fs.copyFileSync(src, path.join(tmp, top, 'tanitim', path.basename(b.file)));
          if (!dirs.includes(top)) dirs.push(top);
        }
        if (!dirs.length) { fs.rmSync(tmp, { recursive: true, force: true }); return sendJson(res, 409, { error: 'Henüz kare yok.' }); }
        execFileSync('zip', ['-rq', 'store.zip', ...dirs], { cwd: tmp });
        const buf = fs.readFileSync(path.join(tmp, 'store.zip'));
        fs.rmSync(tmp, { recursive: true, force: true });
        res.writeHead(200, { 'content-type': 'application/zip', 'content-disposition': `attachment; filename="${slug}-store.zip"` });
        return res.end(buf);
      }
      return sendJson(res, 404, { error: 'Bulunamadı.' });
    }

    // Mağaza karesi PNG'si ve referans görseller
    if (req.method === 'GET' && parts[0] === 'api' && (parts[1] === 'store' || parts[1] === 'ref') && parts[2] && parts[3]) {
      const slug = slugOf(parts[2]);
      const name = decodeURIComponent(parts[3]);
      const okName = parts[1] === 'store' ? /^store\/[^/]+\/((concept-)?(ios|play)-\d+|banner-\d+x\d+)\.png$/.test(name) && !name.includes('..') : /^[\w.-]+$/.test(name);
      if (!slug || !okName) return sendJson(res, 404, { error: 'Bulunamadı.' });
      const file = parts[1] === 'store' ? path.join(projectDir(slug), name) : path.join(projectDir(slug), 'references', name);
      if (!fs.existsSync(file)) return sendJson(res, 404, { error: 'Bulunamadı.' });
      const ext = path.extname(file);
      return send(res, 200, fs.readFileSync(file), ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg');
    }

    if (req.method === 'DELETE' && parts[0] === 'api' && parts[1] === 'ref' && parts[2] && parts[3]) {
      const slug = slugOf(parts[2]);
      const name = decodeURIComponent(parts[3]);
      if (!slug || !/^store-ref-[\w.-]+$/.test(name)) return sendJson(res, 404, { error: 'Bulunamadı.' });
      const file = path.join(projectDir(slug), 'references', name);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      return sendJson(res, 200, buildState(slug));
    }

    // Düzenleme/ekleme popup'ındaki referans görseller → references/attach-*.ext
    if (req.method === 'POST' && parts[0] === 'api' && parts[1] === 'projects' && parts[2] && parts[3] === 'attachments') {
      const slug = slugOf(parts[2]);
      if (!slug) return sendJson(res, 404, { error: 'Proje bulunamadı.' });
      const ext = IMAGE_EXT[req.headers['content-type']];
      if (!ext) return sendJson(res, 415, { error: 'Yalnızca PNG, JPEG veya WebP.' });
      const body = await readBody(req, MAX_IMAGE);
      const name = `${url.searchParams.get('kind') === 'store' ? 'store-ref' : 'attach'}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`;
      fs.mkdirSync(path.join(projectDir(slug), 'references'), { recursive: true });
      fs.writeFileSync(path.join(projectDir(slug), 'references', name), body);
      return sendJson(res, 200, { path: `references/${name}` });
    }

    if (req.method === 'GET' && STATIC[url.pathname]) {
      const [file, type] = STATIC[url.pathname];
      return send(res, 200, fs.readFileSync(path.join(PUBLIC, file)), type);
    }

    sendJson(res, 404, { error: 'Bulunamadı.' });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.status ? error.message : 'Panel isteği tamamlanamadı.' });
  }
});

server.listen(PORT, HOST, () => {
  for (const slug of listSlugs()) autoRun(slug);
  console.log(`Panel http://${HOST}:${PORT}`);
});
