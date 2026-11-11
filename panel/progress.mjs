// Panel iş ilerlemesini günceller. İşi yapan (Claude/Cursor) her adımda bir kez çağırır.
//   node panel/progress.mjs <proje> start <n> [not]   n. adımı "çalışıyor" yapar (1'den başlar)
//   node panel/progress.mjs <proje> done <n> [not]    n. adımı bitirir
//   node panel/progress.mjs <proje> error <n> <not>   n. adımı hata ile işaretler
//   node panel/progress.mjs <proje> add <etiket>      listeye yeni adım ekler
//   node panel/progress.mjs <proje> finish            işi kapatır (job → lastJob)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, action, arg, ...rest] = process.argv.slice(2);
const file = path.join(ROOT, 'projects', slug || '', 'project.json');
if (!slug || !fs.existsSync(file)) { console.error('Proje bulunamadı:', slug); process.exit(1); }

const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
const job = meta.job;
if (!job) { console.error('Bekleyen iş yok.'); process.exit(1); }
job.steps ||= [];
const note = rest.join(' ');
const now = new Date().toISOString();
const step = (n) => {
  const s = job.steps[Number(n) - 1];
  if (!s) { console.error('Adım yok:', n, '/', job.steps.length); process.exit(1); }
  return s;
};

if (action === 'start') { const s = step(arg); s.status = 'run'; s.startedAt = now; if (note) s.note = note; }
else if (action === 'done') { const s = step(arg); s.status = 'done'; s.doneAt = now; if (note) s.note = note; }
else if (action === 'error') { const s = step(arg); s.status = 'error'; s.note = note || 'Hata'; }
else if (action === 'add') { job.steps.push({ label: [arg, ...rest].join(' '), status: 'wait' }); }
else if (action === 'finish') { meta.lastJob = { ...job, finishedAt: now }; meta.job = null; }
else { console.error('Bilinmeyen komut:', action); process.exit(1); }

if (meta.job) meta.job.updatedAt = now;
fs.writeFileSync(file, JSON.stringify(meta, null, 2) + '\n');
console.log(action, arg ?? '', 'ok');
