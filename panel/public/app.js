const root = document.querySelector('#icerik');
const titleEl = document.querySelector('#title');
const summaryEl = document.querySelector('#summary');
const countEl = document.querySelector('#count');
const addProjectBtn = document.querySelector('#add-project');
const projectDialog = document.querySelector('#project-dialog');
const projectBody = document.querySelector('#project-body');
const statusEl = document.querySelector('#status');
const navEl = document.querySelector('#nav');
const filterEl = document.querySelector('#filter');
const settingsBtn = document.querySelector('#settings');
const libraryBtn = document.querySelector('#library');
const settingsDialog = document.querySelector('#settings-dialog');
const settingsBody = document.querySelector('#settings-body');

const ICONS = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  figma: '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>',
  workflow: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
  'pen-line': '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'image-plus': '<path d="M16 5h6"/><path d="M19 2v6"/><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  download: '<path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  'rotate-cw': '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

function icon(name, size = 18) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', '0 0 24 24');
  node.setAttribute('width', String(size));
  node.setAttribute('height', String(size));
  node.setAttribute('fill', 'none');
  node.setAttribute('stroke', 'currentColor');
  node.setAttribute('stroke-width', '2');
  node.setAttribute('stroke-linecap', 'round');
  node.setAttribute('stroke-linejoin', 'round');
  node.setAttribute('aria-hidden', 'true');
  node.innerHTML = ICONS[name];
  return node;
}

const STAGES = [
  ['flow', 'FigJam'],
  ['figma', 'Figma tasarımı'],
  ['rest', 'Kalan ekranlar'],
  ['audit', 'Denetim'],
  ['store', 'Mağaza görselleri'],
];

const JOBS = {
  'extract-flow': 'FigJam akışını çıkar',
  'import-figma': 'Figma dosyasını içe aktar',
  'generate-references': 'Referans görselleri üret',
  'design-references': 'Rastgele 5 ekranı Figma’da tasarla',
  'design-rest': 'Kalan ekranları tasarla',
  audit: 'Tasarımı UI/UX ilkelerine göre denetle',
  'audit-fix': 'Denetim bulgularını düzelt',
  'screen-edit': 'Ekran düzenleme',
  'screen-add': 'Yeni ekran ekleme',
  'dev-notes': 'Yazılımcı notları',
  'store-generate': 'Yazısız mağaza görsellerini üret (OpenAI)',
  'store-figma': 'Mağaza: Figma’ya yerleştir + İngilizce yazılar',
  'store-translate': 'Mağaza: dilleri kopyala ve çevir',
  'store-play': 'Mağaza: Play Store’u App Store’dan türet',
  'store-banner': 'Mağaza: tanıtım görseli',
};

const SEVERITY = { high: ['Kritik', 0], medium: ['Orta', 1], low: ['Düşük', 2] };

let queue = [];
let dirty = false;

function setStatus(message) {
  statusEl.textContent = message;
}

function stageIndex(stage) {
  return STAGES.findIndex(([id]) => id === stage);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function button(label, className, onClick) {
  const node = el('button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function parseRoute() {
  const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  if (!raw) return { slug: '', step: '' };
  const [slug, step] = raw.split('/');
  return { slug, step: step || '' };
}

function openStep(slug, step) {
  const next = `#/${slug}/${step}`;
  if (location.hash === next) renderProject(slug, step);
  else location.hash = `/${slug}/${step}`;
}

function route() {
  if (settingsDialog.open) settingsDialog.close();
  if (projectDialog.open) projectDialog.close();
  filterEl.value = '';
  const { slug, step } = parseRoute();
  if (!slug) renderHome();
  else renderProject(slug, step);
}

async function loadProjects() {
  const response = await fetch('/api/projects');
  const data = await response.json();
  return data.projects || [];
}

function applyFilter() {
  const query = filterEl.value.trim().toLocaleLowerCase('tr');
  const nodes = [...document.querySelectorAll('[data-filter]')];
  let shown = 0;
  for (const node of nodes) {
    const match = !query || node.dataset.filter.toLocaleLowerCase('tr').includes(query);
    node.hidden = !match;
    if (match) shown += 1;
  }
  const empty = document.querySelector('#filter-empty');
  if (empty) empty.hidden = !query || shown > 0;
}

function filterEmpty() {
  const node = el('p', 'help', 'Aramaya uyan kayıt yok.');
  node.id = 'filter-empty';
  node.hidden = true;
  return node;
}

function navLink(href, label, current, icon) {
  const link = el('a', 'nav-item');
  link.href = href;
  if (current) link.setAttribute('aria-current', 'page');
  if (icon) link.append(icon);
  else link.append(el('span', 'dot'));
  link.append(el('span', 'nav-text', label));
  return link;
}

function gridIcon() {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', '0 0 24 24');
  node.setAttribute('width', '18');
  node.setAttribute('height', '18');
  node.setAttribute('aria-hidden', 'true');
  node.innerHTML = '<rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>';
  return node;
}

function renderSide(projects, state) {
  navEl.replaceChildren();
  navEl.append(el('p', 'nav-label', 'Ana'));
  navEl.append(navLink('#/', 'Projeler', !state, gridIcon()));
  if (projects.length) {
    navEl.append(el('p', 'nav-label', 'Çalışmalar'));
    for (const project of projects) {
      navEl.append(navLink(`#/${project.slug}`, project.name, state?.slug === project.slug));
    }
  }
}

async function renderHome() {
  setStatus('');
  document.title = 'Tasarım paneli';
  titleEl.textContent = 'Projeler';
  summaryEl.textContent = 'Akış, referans ve Figma onayı.';
  settingsBtn.hidden = true;
  libraryBtn.hidden = true;
  addProjectBtn.hidden = false;
  const projects = await loadProjects();
  renderSide(projects, null);
  countEl.textContent = '';
  root.replaceChildren();

  const cards = el('div', 'cards');
  if (!projects.length) cards.append(el('p', 'help', 'Henüz proje yok. Proje ekle ile ilkini oluştur.'));
  for (const project of projects) {
    const card = el('a', 'card');
    card.href = `#/${project.slug}`;
    card.dataset.filter = `${project.name} ${project.stageLabel}`;
    card.append(el('span', 'meta', project.stageLabel));
    card.append(el('strong', '', project.name));
    const detail = project.total ? `${project.builtCount} / ${project.total}` : 'Akış yok';
    card.append(el('span', 'stat', detail));
    if (project.job) card.append(el('span', 'flag', 'İş bekliyor'));
    cards.append(card);
  }
  root.append(cards, filterEmpty());
  applyFilter();
}

function createForm() {
  const panel = document.createElement('form');
  panel.className = 'dialog-form';
  // Yeni tasarım (FigJam → tasarım) ya da tasarımı bitmiş Figma dosyasını içe aktarma
  let mode = 'new';
  const modes = el('div', 'mode-switch');
  modes.setAttribute('role', 'radiogroup');
  modes.setAttribute('aria-label', 'Proje türü');
  const help = el('p', 'help');
  const name = field('Proje adı', 'name', 'text', 'Femia');
  const figjam = field('FigJam linki', 'figjam', 'url', 'https://www.figma.com/board/…');
  const figma = field('Figma tasarım linki', 'figma', 'url', 'https://www.figma.com/design/…');
  const setMode = (m) => {
    mode = m;
    for (const b of modes.children) b.setAttribute('aria-checked', b.dataset.mode === m ? 'true' : 'false');
    figjam.label.hidden = figjam.input.hidden = m === 'import';
    figjam.input.required = m !== 'import';
    help.textContent = m === 'import'
      ? 'Tasarımı bitmiş bir Figma dosyası. Ekranlar dosyadan okunur, bölümlere ayrılır ve panelde gösterilir. Belirli bir sayfayı almak için o sayfanın linkini ver.'
      : 'Ad, FigJam akışı ve Figma tasarım dosyası. Kayıttan sonra akış çıkarılır.';
  };
  for (const [m, label] of [['new', 'Yeni tasarım'], ['import', 'Hazır tasarımı içe aktar']]) {
    const b = button(label, 'mode-btn', () => setMode(m));
    b.dataset.mode = m;
    b.setAttribute('role', 'radio');
    modes.append(b);
  }
  panel.append(modes, help);
  setMode('new');
  const error = el('p', 'error');
  error.id = 'form-error';
  error.tabIndex = -1;
  error.hidden = true;
  const submit = el('button', 'primary', 'Projeyi oluştur');
  submit.type = 'submit';
  panel.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    setStatus('Proje oluşturuluyor…');
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.input.value.trim(),
          mode,
          figjamUrl: mode === 'import' ? '' : figjam.input.value.trim(),
          figmaUrl: figma.input.value.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        error.hidden = false;
        error.textContent = payload.error || 'Proje oluşturulamadı.';
        setStatus('');
        error.focus();
        return;
      }
      for (const file of assets.files) {
        const type = file.type || (file.name.endsWith('.svg') ? 'image/svg+xml' : '');
        setStatus(`Asset yükleniyor: ${file.name}`);
        const r = await fetch(`/api/projects/${payload.slug}/library?name=${encodeURIComponent(file.name)}&kind=${type === "image/svg+xml" ? "icon" : "asset"}`, { method: 'POST', headers: { 'content-type': type }, body: file });
        if (!r.ok) setStatus(`Yüklenemedi: ${file.name}`);
      }
      location.hash = `/${payload.slug}`;
    } catch {
      error.hidden = false;
      error.textContent = 'Proje oluşturulamadı.';
      error.focus();
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
  // Asset'ler: proje kurulunca kütüphaneye yüklenir, tasarım işleri önce bunları kullanır
  const assetsLabel = el('label', '', 'Asset’ler (isteğe bağlı)');
  assetsLabel.htmlFor = 'assets';
  const assets = document.createElement('input');
  assets.type = 'file'; assets.id = 'assets'; assets.multiple = true;
  assets.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
  const assetsHelp = el('p', 'help', 'Karakter, ikon, zemin gibi hazır görseller. Kütüphaneye eklenir; tasarımlarda önce bunlar kullanılır. Dosya adı asset’in adı olur (ör. kirmizi-araba.png).');
  assets.addEventListener('change', () => { assetsHelp.textContent = assets.files.length ? `${assets.files.length} dosya seçildi: ${[...assets.files].map((f) => f.name).join(', ')}` : 'Karakter, ikon, zemin gibi hazır görseller.'; });
  panel.append(name.label, name.input, figjam.label, figjam.input, figma.label, figma.input, assetsLabel, assets, assetsHelp, error);
  const actions = el('div', 'actions');
  actions.append(submit);
  panel.append(actions);
  return panel;
}

function field(labelText, name, type, placeholder) {
  const label = el('label', '', labelText);
  const input = document.createElement('input');
  input.name = name;
  input.type = type;
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  label.htmlFor = name;
  input.id = name;
  return { label, input };
}

async function renderProject(slug, step = parseRoute().step) {
  setStatus('');
  const [response, projects] = await Promise.all([
    fetch(`/api/state?project=${encodeURIComponent(slug)}`),
    loadProjects(),
  ]);
  if (!response.ok) {
    titleEl.textContent = 'Proje yok';
    summaryEl.textContent = 'Bu adres bir projeye ait değil.';
    countEl.textContent = '';
    settingsBtn.hidden = true;
    libraryBtn.hidden = true;
    addProjectBtn.hidden = true;
    renderSide(projects, null);
    root.replaceChildren(el('p', 'help', 'Bu proje bulunamadı.'), navLink('#/', 'Projelere dön', false, gridIcon()));
    return;
  }
  const state = await response.json();
  if (!dirty) queue = state.queue.map((item) => ({ ...item }));
  document.title = state.name;
  titleEl.textContent = state.name;
  summaryEl.textContent = state.imported && state.hasFlow ? `İçe aktarıldı · ${state.total} ekran` : state.stageLabel;
  countEl.textContent = state.hasFlow ? `${state.builtCount} / ${state.total}` : '';
  settingsBtn.hidden = false;
  addProjectBtn.hidden = true;
  settingsBtn.onclick = () => openSettings(state);
  libraryBtn.hidden = false;
  libraryBtn.replaceChildren(icon('layers', 16), document.createTextNode(` Kütüphane${state.library?.length ? ` · ${state.library.length}` : ''}`));
  libraryBtn.setAttribute('aria-pressed', step === 'library' ? 'true' : 'false');
  libraryBtn.onclick = () => openStep(slug, step === 'library' ? state.stage : 'library');
  const asked = step === 'pick' || step === 'visual' || step === 'references' ? 'figma' : step;
  let open = STAGES.some(([id]) => id === asked) ? asked : state.stage;
  // İçe aktarılan projede onay adımları yok: ekranlar doğrudan açılır
  if (state.imported && state.hasFlow && ['flow', 'figma', 'rest'].includes(open)) open = 'rest';
  if (state.imported && state.hasFlow && !step) open = 'rest';
  renderSide(projects, state);
  root.replaceChildren();
  root.append(projectOverview(state, open));
  if (state.job) root.append(jobBanner(state));
  else { const d = doneBanner(state); if (d) root.append(d); }
  startPolling(slug, state);
  if (step === 'library') root.append(libraryPanel(state), filterEmpty());
  else root.append(stepPanel(state, open), filterEmpty());
  applyFilter();
}

function projectOverview(state, open) {
  const card = el('section', 'flow-card');
  const list = el('ol', 'flow');
  const currentIndex = stageIndex(state.stage);
  const steps = state.imported && state.hasFlow ? STAGES.filter(([id]) => ['rest', 'audit', 'store'].includes(id)) : STAGES;
  steps.forEach(([id, label], index) => {
    if (state.imported && state.hasFlow) index = stageIndex(id);
    // Mağaza adımı denetimden bağımsız: tüm ekranlar kurulunca açılır
    const storeDone = state.store?.ready;
    const done = id === 'store' ? storeDone : index < currentIndex;
    const now = id === 'store' ? !storeDone && state.allBuilt : index === currentIndex;
    const waitingApproval = now && id === 'rest' && state.allBuilt && !state.job;
    const item = el('li');
    const stepButton = button('', `flow-step ${done ? 'done' : now ? 'now' : 'wait'}`, () => openStep(state.slug, id));
    stepButton.setAttribute('aria-pressed', id === open ? 'true' : 'false');
    if (now) stepButton.setAttribute('aria-current', 'step');
    const track = el('div', 'flow-track');
    const mark = el('span', 'flow-mark');
    mark.append(icon(done ? 'check' : now ? (id === 'audit' ? 'shield-check' : 'pen-line') : 'lock', 16));
    track.append(mark, el('span', 'flow-line'));
    stepButton.append(track);
    stepButton.append(el('span', 'flow-kicker', state.imported && state.hasFlow ? `Adım ${steps.findIndex(([x]) => x === id) + 1}` : `Adım ${index + 1}`));
    stepButton.append(el('span', 'flow-title', id === 'flow' && state.imported ? 'İçe aktarma' : id === 'rest' && state.imported ? 'Ekranlar' : label));
    stepButton.append(el('span', 'pill', done ? 'Tamamlandı' : waitingApproval ? 'Onayını bekliyor' : now ? 'Şimdi' : 'Sırada'));
    item.append(stepButton);
    list.append(item);
  });
  card.append(list);
  return card;
}

// Uygulama içi popup (window.prompt/confirm yerine). Not alanı varsa metni, yoksa true döner; vazgeçilirse null.
// images: true → görsel ekleme alanı; sonuç { note, files }
function askDialog({ title, help = '', placeholder = '', confirmLabel = 'Gönder', danger = false, field = true, images = false, optional = false }) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'ask-dialog';
    const head = el('div', 'dialog-head');
    head.append(el('h2', '', title));
    const form = el('form', 'dialog-form ask-form');
    if (help) form.append(el('p', 'help', help));
    let input = null;
    if (field) {
      input = document.createElement('textarea');
      input.placeholder = placeholder;
      input.rows = 5;
      input.setAttribute('aria-label', title);
      form.append(input);
    }
    let files = [];
    if (images) {
      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = 'image/png,image/jpeg,image/webp';
      picker.multiple = true;
      picker.hidden = true;
      const thumbs = el('div', 'attach-thumbs');
      const pick = button('', 'attach-button', () => picker.click());
      pick.append(icon('image-plus', 16), el('span', '', 'Referans görsel ekle'));
      const draw = () => {
        thumbs.replaceChildren(...files.map((file, i) => {
          const item = el('div', 'attach-thumb');
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.alt = file.name;
          const remove = button('×', 'attach-remove', () => { files.splice(i, 1); draw(); });
          remove.setAttribute('aria-label', `${file.name} görselini kaldır`);
          item.append(img, remove);
          return item;
        }));
      };
      picker.addEventListener('change', () => { files = [...files, ...picker.files].slice(0, 6); picker.value = ''; draw(); });
      form.addEventListener('paste', (event) => {
        const pasted = [...(event.clipboardData?.files || [])].filter((f) => f.type.startsWith('image/'));
        if (pasted.length) { files = [...files, ...pasted].slice(0, 6); draw(); }
      });
      const row = el('div', 'attach-row');
      row.append(pick, thumbs, picker);
      form.append(row);
    }
    const actions = el('div', 'actions');
    const ok = el('button', danger ? 'danger-button' : 'primary', confirmLabel);
    ok.type = 'submit';
    if (field && !optional) ok.disabled = true;
    if (!optional) input?.addEventListener('input', () => { ok.disabled = !input.value.trim(); });
    actions.append(button('Vazgeç', '', () => dialog.close()), ok);
    form.append(actions);
    let result = null;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      result = field ? input.value.trim() : true;
      if (images) result = { note: result, files };
      dialog.close();
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { dialog.remove(); resolve(result); });
    dialog.append(head, form);
    document.body.append(dialog);
    dialog.showModal();
    (input || ok).focus();
  });
}

function openSettings(state) {
  settingsBody.replaceChildren();
  const files = [
    ['FigJam', 'Akış dosyası', state.figjamUrl, 'workflow'],
    ['Figma', 'Tasarım dosyası', state.figmaUrl, 'figma'],
  ];
  let shown = 0;
  for (const [title, meta, href, glyph] of files) {
    if (!href) continue;
    shown += 1;
    const row = anchor(title, href, 'file-row');
    row.replaceChildren();
    const badge = el('span', 'file-badge');
    badge.append(icon(glyph, 18));
    const text = el('span', 'file-text');
    text.append(el('span', 'meta', meta), el('strong', '', title));
    row.append(badge, text, icon('external-link', 16));
    settingsBody.append(row);
  }
  if (!shown) settingsBody.append(el('p', 'help dialog-empty', 'Bu projede dosya linki yok.'));
  // Claude modeli (bu projedeki tüm panel işleri)
  const modelRow = el('label', 'store-lang');
  modelRow.append(el('span', 'legend', 'Claude modeli'));
  const pick = document.createElement('select');
  for (const [v, t] of [['auto', 'Otomatik (önerilen): tasarım ve referanslı işler Opus, küçük işler Sonnet'], ['opus', 'Hep Opus: en iyi sonuç, pahalı'], ['sonnet', 'Hep Sonnet: ucuz, daha az titiz']]) {
    const o = new Option(t, v); o.selected = state.model === v; pick.append(o);
  }
  pick.addEventListener('change', async () => {
    await fetch(`/api/projects/${state.slug}/model`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: pick.value }) });
    state.model = pick.value;
    setStatus('Model kaydedildi; sonraki işlerde geçerli.');
  });
  modelRow.append(pick);
  settingsBody.append(modelRow);
  if (state.costs?.runs) {
    settingsBody.append(el('p', 'help', `Claude maliyeti (panel işleri): $${state.costs.total.toFixed(2)} · ${state.costs.runs} iş`));
  }
  settingsBody.append(button('Projeyi sil', 'danger-button', async () => {
    const yes = await askDialog({
      title: 'Projeyi sil',
      help: `“${state.name || state.slug}” panelden kaldırılacak. Klasör projects/.trash/ altına taşınır, istersen oradan geri alabilirsin.`,
      confirmLabel: 'Projeyi sil',
      danger: true,
      field: false,
    });
    if (!yes) return;
    const response = await fetch(`/api/projects/${state.slug}`, { method: 'DELETE' });
    const payload = await response.json();
    if (!response.ok) return setStatus(payload.error || 'Silinemedi.');
    settingsDialog.close();
    location.hash = '';
    renderHome();
    setStatus('Proje silindi.');
  }));
  settingsDialog.showModal();
}

function anchor(text, href, className = 'link') {
  const node = el('a', className, text);
  node.href = href;
  node.target = '_blank';
  node.rel = 'noreferrer';
  return node;
}

function ago(iso) {
  if (!iso) return '';
  const sec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return `${sec} sn önce`;
  if (sec < 3600) return `${Math.round(sec / 60)} dk önce`;
  return `${Math.round(sec / 3600)} sa önce`;
}

// Kaba tahmin: adım başına süre (dk) ve maliyet ($: Claude API eşdeğeri + gpt-image-2 görselleri)
const JOB_RATES = {
  'extract-flow': { base: 2, per: 0.5, usd: 0.15 },
  'design-references': { base: 6, per: 5, usd: 1.3 },
  'design-rest': { base: 4, per: 2.5, usd: 0.55 },
  'audit': { base: 2, per: 1.5, usd: 0.25 },
  'audit-fix': { base: 2, per: 2, usd: 0.35 },
  'screen-edit': { base: 2, per: 2, usd: 0.35 },
  'screen-add': { base: 3, per: 3, usd: 0.5 },
  'dev-notes': { base: 2, per: 2, usd: 0.3 },
  'import-figma': { base: 2, per: 2, usd: 0.3 },
  'store-generate': { base: 0.5, per: 1.5, usd: 0.5 },
  'store-figma': { base: 3, per: 3, usd: 0.8 },
  'store-translate': { base: 2, per: 1.5, usd: 0.4 },
  'store-play': { base: 3, per: 2, usd: 0.3 },
  'store-banner': { base: 3, per: 1, usd: 0.2 },
  'generate-references': { base: 0.5, per: 0.5, usd: 0.12 },
};
function jobEstimate(job, costs) {
  const r = JOB_RATES[job.type] || { base: 2, per: 1, usd: 0.2 };
  const n = (job.steps || []).filter((s) => s.status !== 'done').length || 1;
  const min = r.base + r.per * n;
  // Bu projede aynı türde iş çalıştıysa gerçek ortalamayı kullan
  const seen = costs?.byType?.[job.type];
  const usd = (seen ? seen.perStep : r.usd) * Math.max(n, 1);
  const time = min < 1 ? `${Math.round(min * 60)} sn` : min < 60 ? `${Math.round(min)} dk` : `${(min / 60).toFixed(1).replace('.0', '')} sa`;
  const cost = usd < 1 ? `$${usd.toFixed(2)}` : `$${usd.toFixed(1)}`;
  return `Kalan süre yaklaşık ${time} · tahmini maliyet ~${cost}`;
}

function jobBanner(state) {
  const job = state.job;
  const banner = el('section', 'banner job');
  banner.id = 'job-banner';
  banner.setAttribute('aria-live', 'polite');
  const steps = job.steps || [];
  const done = steps.filter((s) => s.status === 'done').length;
  const failed = steps.some((s) => s.status === 'error');
  const running = steps.findIndex((s) => s.status === 'run');
  const started = steps.some((s) => s.status !== 'wait');

  const head = el('div', 'job-head');
  const spin = el('span', failed || job.runner?.exitedAt ? 'job-dot error' : started || job.running ? 'spinner' : 'job-dot wait');
  spin.setAttribute('aria-hidden', 'true');
  const titles = el('div', 'job-titles');
  titles.append(el('p', 'job-title', JOBS[job.type] || job.type));
  const runner = job.runner;
  const stopped = Boolean(runner?.exitedAt);
  const sub = failed ? 'Bir adımda hata var.'
    : stopped ? `Claude işi bitirmeden durdu (çıkış kodu ${runner.exitCode}) · ${ago(runner.exitedAt)}. Günlük: ${runner.log}`
    : started ? `${done} / ${steps.length} adım tamamlandı · son güncelleme ${ago(job.updatedAt)}`
    : runner ? `Claude arka planda başladı · ${ago(runner.startedAt)}`
    : `Sırada, henüz başlamadı · ${ago(job.requestedAt)} istendi.`;
  titles.append(el('p', 'help', sub));
  if (!failed && !stopped) titles.append(el('p', 'help job-eta', jobEstimate(job, state.costs)));
  head.append(spin, titles);
  if ((failed || stopped || !runner) && !job.running && job.type !== 'generate-references') {
    head.append(button(runner ? 'Yeniden başlat' : 'Claude’u başlat', 'job-run', async () => {
      const response = await fetch(`/api/projects/${state.slug}/run`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) return setStatus(payload.error || 'Başlatılamadı.');
      setStatus('Claude arka planda başladı.');
      renderProject(state.slug);
    }));
  }
  if ((failed || stopped) && !job.running) {
    head.append(button('İşi iptal et', 'job-run', async () => {
      if (!await askDialog({ title: 'İş iptal edilsin mi?', help: 'Yarım kalan iş kapatılır; Figma’da yapılmış değişiklikler olduğu gibi kalır.', confirmLabel: 'İptal et', danger: true, field: false })) return;
      const response = await fetch(`/api/projects/${state.slug}/job`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) return setStatus(payload.error || 'İptal edilemedi.');
      setStatus('İş iptal edildi.');
      renderProject(state.slug);
    }));
  }
  banner.append(head);

  if (steps.length) {
    const bar = el('div', 'job-bar');
    const fill = el('span');
    fill.style.width = `${Math.round((done / steps.length) * 100)}%`;
    bar.append(fill);
    banner.append(bar);

    const track = el('ol', 'job-steps');
    steps.forEach((s, i) => {
      const li = el('li', `job-step ${s.status}`);
      const mark = el('span', 'job-mark');
      if (s.status === 'done') mark.append(icon('check', 14));
      else if (s.status === 'run') mark.append(el('span', 'spinner small'));
      else mark.textContent = String(i + 1);
      const text = el('div', 'job-text');
      text.append(el('p', 'job-label', s.label));
      const state2 = { wait: 'Bekliyor', run: 'Çalışıyor…', done: 'Bitti', error: 'Hata' }[s.status] || s.status;
      text.append(el('p', 'job-note', s.note ? `${state2} · ${s.note}` : state2));
      li.append(mark, text);
      track.append(li);
    });
    banner.append(track);
    const focus = running >= 0 ? running : Math.min(done, steps.length - 1);
    requestAnimationFrame(() => {
      const target = track.children[focus];
      if (target) track.scrollTo({ left: target.offsetLeft - track.offsetLeft - 16, behavior: 'smooth' });
    });
  }
  return banner;
}

function doneBanner(state) {
  const job = state.lastJob;
  if (!job?.finishedAt || Date.now() - new Date(job.finishedAt).getTime() > 24 * 60 * 60 * 1000) return null;
  const banner = el('section', 'banner job finished');
  banner.id = 'job-banner';
  const head = el('div', 'job-head');
  const mark = el('span', 'job-dot ok'); mark.append(icon('check', 14));
  const titles = el('div', 'job-titles');
  titles.append(el('p', 'job-title', `${JOBS[job.type] || job.type} tamamlandı`));
  titles.append(el('p', 'help', `${(job.steps || []).length} adım · ${ago(job.finishedAt)}`));
  head.append(mark, titles);
  banner.append(head);
  // Claude'un ne yaptığı: adım notları + son rapor
  const notes = (job.steps || []).filter((st) => st.note).map((st) => `• ${st.label}: ${st.note}`);
  if (notes.length || job.summary) {
    const more = document.createElement('details');
    more.className = 'job-summary';
    more.append(el('summary', '', 'Ne yapıldı?'));
    if (job.note) more.append(el('p', 'meta', `İstek: ${job.note}`));
    for (const n of notes) more.append(el('p', 'help', n));
    if (job.summary) more.append(el('pre', 'job-report', job.summary));
    banner.append(more);
  }
  return banner;
}

let pollTimer = null;
let pollKey = '';
function startPolling(slug, state) {
  clearInterval(pollTimer);
  pollKey = JSON.stringify(state.job || null);
  if (!state.job) return;
  pollTimer = setInterval(async () => {
    if (parseRoute().slug !== slug || document.hidden) return;
    const response = await fetch(`/api/state?project=${encodeURIComponent(slug)}`);
    if (!response.ok) return;
    const fresh = await response.json();
    const key = JSON.stringify(fresh.job || null);
    if (!fresh.job || fresh.job.type !== state.job.type) {
      clearInterval(pollTimer);
      if (!dirty) renderProject(slug);
      return;
    }
    const current = document.querySelector('#job-banner');
    if (key !== pollKey && current) { pollKey = key; current.replaceWith(jobBanner(fresh)); }
    else if (current) current.querySelector('.job-titles .help').textContent = jobBanner(fresh).querySelector('.job-titles .help').textContent;
  }, 3000);
}

function stepPanel(state, step) {
  const panel = el('section', 'panel step-panel');
  panel.id = 'step-panel';
  if (step === 'flow') panel.append(flowDetail(state));
  if (step === 'figma') panel.append(figmaDetail(state));
  if (step === 'rest') panel.append(restDetail(state));
  if (step === 'audit') panel.append(auditDetail(state));
  if (step === 'store') return storeDetail(state);
  return panel;
}

function flowDetail(state) {
  const wrap = el('div');
  wrap.append(el('h2', '', 'FigJam okundu'));
  if (!state.hasFlow) {
    wrap.append(el('p', 'help', 'FigJam görselsiz okunur. Ekran listesi çıkınca bölümler burada görünür.'));
    if (!state.job) wrap.append(state.imported
      ? button('Figma dosyasını içe aktar', 'primary', () => askJob(state.slug, 'import-figma'))
      : button('Akışın çıkarılmasını iste', 'primary', () => askJob(state.slug, 'extract-flow')));
    return wrap;
  }
  const count = state.sections.reduce((sum, section) => sum + section.screens.length, 0);
  wrap.append(el('p', 'help', `FigJam görselsiz okundu. ${state.sections.length} bölüm, ${count} ekran çıkarıldı.`));
  wrap.append(sectionList(state, false));
  return wrap;
}

// Bölümler açılır liste: başlığa basınca o bölümün ekranları görünür.
function sectionList(state, thumbs) {
  const list = el('div', 'section-list');
  for (const section of state.sections) {
    const box = document.createElement('details');
    box.className = 'section-box';
    box.dataset.filter = [section.title, ...section.screens.map((s) => `${s.index} ${s.title}`)].join(' ');
    const head = document.createElement('summary');
    head.className = 'section-row';
    const ready = section.screens.filter((s) => s.built).length;
    head.append(el('strong', '', section.title));
    const right = el('span', 'section-count');
    right.append(el('span', 'meta', thumbs ? `${ready} / ${section.screens.length} ekran` : `${section.screens.length} ekran`), icon('chevron-down', 18));
    head.append(right);
    box.append(head);
    if (thumbs) {
      const grid = el('div', 'designs compact');
      for (const screen of section.screens) grid.append(screenCard(state, screen));
      if (state.allBuilt && !state.job) {
        const add = button('', 'design add-screen', async () => {
          const note = await askDialog({
            title: `Ekran ekle: ${section.title}`,
            help: 'Eklenecek ekranı anlat: adı, içeriği, hangi ekrandan sonra geldiği. Claude akışa ekleyip onaylı ekranlarla aynı dilde Figma’da kurar.',
            placeholder: 'Örn. “Günlük ödül” ekranı: 7 günlük takvim, bugünkü ödül vurgulu, Topla butonu. Bölüm sonu ekranından sonra gelir.',
            confirmLabel: 'Ekranı ekle',
            images: true,
          });
          if (note?.note) askJob(state.slug, 'screen-add', { section: section.title, note: note.note, images: await uploadAttachments(state.slug, note.files) });
        });
        add.append(icon('plus', 22), el('span', '', 'Ekran ekle'));
        grid.append(add);
      }
      box.append(grid);
    } else {
      const rows = el('ol', 'screen-list');
      for (const screen of section.screens) {
        const row = el('li', 'screen-line');
        row.append(el('span', 'token', screen.index), el('span', 'screen-name', screen.title));
        const tail = el('span', 'flags');
        if (state.referenceIds.includes(screen.id)) tail.append(el('span', 'flag', 'Referans'));
        if (screen.built) tail.append(el('span', 'flag ready', 'Hazır'));
        if (screen.figmaUrl) tail.append(anchor('Figma', screen.figmaUrl));
        row.append(tail);
        rows.append(row);
      }
      box.append(rows);
    }
    list.append(box);
  }
  return list;
}

function screenCard(state, screen) {
  const card = el('article', 'design');
  const shot = el('div', 'design-shot');
  if (screen.hasPreview) {
    const image = document.createElement('img');
    image.alt = `${screen.title} ekran tasarımı`;
    image.src = `/api/screen/${state.slug}/${screen.id}?v=${encodeURIComponent(state.lastJob?.finishedAt || '')}`;
    image.loading = 'lazy';
    image.width = 324;
    image.height = 700;
    shot.append(image);
  } else shot.append(el('div', 'placeholder', screen.built ? 'Önizleme yok' : 'Bekliyor'));
  if (screen.built && state.allBuilt && !state.job) {
    const edit = button('', 'shot-edit', () => askEdit(state, [screen.id], screen.title));
    edit.append(icon('pen-line', 18));
    edit.setAttribute('aria-label', `${screen.title} ekranını düzenle`);
    edit.title = 'Bu ekranı düzenle';
    shot.append(edit);
  }
  const body = el('div', 'design-body');
  body.append(el('h3', '', screen.title));
  body.append(el('p', 'meta', `${screen.index} · ${screen.built ? 'Hazır' : 'Bekliyor'}`));
  if (screen.figmaUrl) body.append(anchor('Figma’da aç', screen.figmaUrl));
  card.append(shot, body);
  return card;
}

function referenceDetail(state) {
  const wrap = el('div');
  wrap.append(el('h2', '', 'Referans görseller'));
  if (!state.referenceIds.length) {
    wrap.append(el('p', 'help', 'OpenAI’nin görsel üreteceği 1 ile 5 ekranı seç. Üretilince burada görüp onaylarsın.'));
    wrap.append(pickStage(state));
    return wrap;
  }
  const needs = state.references.some((item) => item.visual === 'missing' || item.visual === 'rejected');
  wrap.append(el('p', 'help', 'Onaylamak istediğin görselleri seç. Onayla ve tasarla, seçilen ekranları Figma’da tasarlatır.'));
  const selected = new Set();
  const count = el('p', 'meta', '0 seçili');
  const approve = button('Onayla ve tasarla', 'primary', () => approveAndDesign(state, [...selected]));
  approve.disabled = true;
  const sync = () => {
    count.textContent = `${selected.size} seçili`;
    approve.disabled = selected.size < 1;
  };
  wrap.append(count, referenceList(state, selected, sync));
  const actions = el('div', 'actions');
  if (needs && state.job?.type !== 'generate-references') {
    actions.append(button('Referans görselleri üret', '', () => askJob(state.slug, 'generate-references')));
  }
  actions.append(approve);
  wrap.append(actions);
  return wrap;
}

function figmaDetail(state) {
  const wrap = el('div');
  wrap.append(el('h2', '', 'Figma tasarımı'));
  if (!state.hasFlow) {
    wrap.append(el('p', 'help', 'Önce FigJam okunur.'));
    return wrap;
  }
  const busy = state.job?.type === 'design-references';
  const built = state.references.length > 0 && state.references.every((item) => item.built);
  const approved = built && state.references.every((item) => item.figma === 'approved');
  if (!state.references.length) {
    wrap.append(el('p', 'help', 'FigJam’den her bölümden olacak şekilde rastgele 5 ekran seçilir ve Figma’da tasarlanır. Tasarım dili (DESIGN.md) ve component’ler de bu adımda kurulur. Sonra senin onayın beklenir.'));
    if (!busy) { const a = el('div', 'actions'); a.append(button('5 ekranı tasarla', 'primary', () => askJob(state.slug, 'design-references'))); wrap.append(a); }
    return wrap;
  }
  wrap.append(el('p', 'help', approved ? 'Onaylandı. Kalan ekranlar bu 5 ekran temel alınarak kurulur.'
    : built ? 'Tasarımları incele. Beğendiysen onayla; değilse ne değişmesi gerektiğini yaz.'
    : 'Seçilen 5 ekran Figma’da tasarlanıyor.'));
  const list = el('div', 'designs');
  for (const item of state.references) {
    const card = el('article', 'design');
    const shot = el('div', 'design-shot');
    if (item.hasPreview) {
      const image = document.createElement('img');
      image.alt = `${item.title} ekran tasarımı`;
      image.src = `/api/screen/${state.slug}/${item.id}?v=${Date.now()}`;
      image.loading = 'lazy';
      shot.append(image);
    } else shot.append(el('div', 'placeholder', item.built ? 'Önizleme yok' : 'Bekliyor'));
    const body = el('div', 'design-body');
    body.append(el('h3', '', item.title));
    body.append(el('p', 'meta', `${item.sectionTitle || ''} · ${item.built ? (item.figma === 'approved' ? 'Onaylandı' : 'Onay bekliyor') : 'Bekliyor'}`));
    if (item.figmaUrl) body.append(anchor('Figma’da aç', item.figmaUrl));
    card.append(shot, body);
    list.append(card);
  }
  wrap.append(list);
  if (built && !approved && !busy) {
    const actions = el('div', 'actions');
    actions.append(button('Değişiklik iste', '', async () => {
      const note = await askDialog({
        title: 'Değişiklik iste',
        help: 'Ne değişsin? Aynı 5 ekran bu nota göre düzeltilir.',
        placeholder: 'Örn. renkleri referans görsellere göre güncelle, başlıklar daha kalın olsun…',
        confirmLabel: 'Değişikliği gönder',
      });
      if (note) askJob(state.slug, 'design-references', { note });
    }));
    actions.append(button('Onayla', 'primary', async () => {
      const response = await fetch(`/api/projects/${state.slug}/approve-figma`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) return setStatus(payload.error || 'Onaylanamadı.');
      renderProject(state.slug, 'rest');
    }));
    wrap.append(actions);
  }
  if (!built && !busy) {
    const actions = el('div', 'actions');
    actions.append(button('Başka 5 ekran seç', '', () => askJob(state.slug, 'design-references', { reshuffle: true })));
    actions.append(button('Figma’da tasarla', 'primary', () => askJob(state.slug, 'design-references')));
    wrap.append(actions);
  }
  return wrap;
}

// Ekran listesi üstündeki genel işler: tüm ekranlarda düzenle, yazılımcı notları
function generalActions(state) {
  const general = el('div', 'actions');
  const all = button('Tüm ekranlarda düzenle', '', () => askEdit(state, [], ''));
  all.prepend(icon('pen-line', 16));
  general.append(all);
  general.append(button('Yazılımcı notları ekle', '', async () => {
    const note = await askDialog({
      title: 'Yazılımcı notları',
      help: 'Her ekranın altına, Figma’da yazılımcı için not kartı eklenir: ekranın amacı, giriş/çıkış yolları, her butonun ne yaptığı, durumlar, dinamik veriler, asset’ler, animasyon ve uç durumlar. Varsa önceki notlar güncellenir. Ek isteğin varsa yaz (boş geçebilirsin).',
      placeholder: 'Örn. notlar İngilizce olsun, analytics event adlarını da yaz…',
      confirmLabel: 'Notları ekle',
      optional: true,
    });
    if (note !== null) askJob(state.slug, 'dev-notes', note ? { note } : {});
  }));
  return general;
}

function restDetail(state) {
  const wrap = el('div');
  if (state.imported) {
    wrap.append(el('h2', '', 'Ekranlar'));
    wrap.append(el('p', 'help', `${state.total} ekran Figma’dan içe aktarıldı. Kalem ikonuyla tek ekranı düzenle, bölüm sonundaki “Ekran ekle” ile yeni ekran ekle.`));
    if (!state.job) wrap.append(generalActions(state));
    wrap.append(sectionList(state, true));
    return wrap;
  }
  wrap.append(el('h2', '', 'Kalan ekranlar'));
  const ready = state.references.length > 0 && state.references.every((item) => item.built && item.figma === 'approved');
  if (!ready) {
    wrap.append(el('p', 'help', 'Önce 5 ekran Figma’da tasarlanıp onaylanır. Sonra FigJam’deki diğer ekranlar tek düğmeyle kurulur.'));
    return wrap;
  }
  const remaining = state.sections
    .flatMap((section) => section.screens)
    .filter((screen) => !state.referenceIds.includes(screen.id)).length;
  const approved = state.stage === 'audit';
  if (!state.allBuilt) {
    wrap.append(el('p', 'help', `${remaining} ekran, onaylanan 5 ekran ve FigJam’deki referans görseller temel alınarak kurulur.`));
    const actions = el('div', 'actions');
    const start = button('Kalan ekranları tasarla', 'primary', () => askJob(state.slug, 'design-rest'));
    start.disabled = state.job?.type === 'design-rest';
    actions.append(start);
    wrap.append(actions);
    return wrap;
  }
  wrap.append(el('p', 'help', approved
    ? `Onaylandı. ${state.total} ekranın tamamı Figma’da. Denetim adımında UI/UX ilkelerine göre kontrol edilir.`
    : `${state.total} ekranın tamamı Figma’da kuruldu. Bölümleri açıp incele; onaylarsan denetçi tasarımı UI/UX ilkelerine göre kontrol eder.`));
  if (!approved && !state.job) {
    const actions = el('div', 'actions');
    actions.append(button('Onayla ve denetle', 'primary', async () => {
      const response = await fetch(`/api/projects/${state.slug}/approve-rest`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) return setStatus(payload.error || 'Onaylanamadı.');
      openStep(state.slug, 'audit');
    }));
    wrap.append(actions);
  }
  if (!state.job) wrap.append(generalActions(state));
  wrap.append(sectionList(state, true));
  return wrap;
}

// Mağaza: referans yükle → mağaza ve dil seç → panel OpenAI ile üretir (store-generate.mjs)
function imagePicker(onFiles, multiple = true) {
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = 'image/png,image/jpeg,image/webp'; picker.multiple = multiple; picker.hidden = true;
  picker.addEventListener('change', () => { const files = [...picker.files]; picker.value = ''; if (files.length) onFiles(files); });
  return picker;
}

let storeTab = null; // sonuçlarda seçili dil sekmesi

const STORE_LOGOS = {
  ios: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#111" d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.52ZM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#34A853" d="M3.6 2.3 13.4 12l-9.8 9.7c-.35-.2-.6-.6-.6-1.1V3.4c0-.5.25-.9.6-1.1Z"/><path fill="#FBBC04" d="m17 8.4-3.6 3.6L17 15.6l3.7-2.1c.9-.5.9-1.8 0-2.3L17 8.4Z"/><path fill="#EA4335" d="M3.6 21.7 13.4 12l3.6 3.6L5 22.1c-.5.3-1 .1-1.4-.4Z"/><path fill="#4285F4" d="M3.6 2.3c.4-.5.9-.7 1.4-.4L17 8.4 13.4 12 3.6 2.3Z"/></svg>',
};

async function storeDelete(slug, body) {
  const response = await fetch(`/api/projects/${slug}/store/delete`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json();
  setStatus(response.ok ? 'Silindi.' : payload.error || 'Silinemedi.');
  renderProject(slug, 'store');
}

function storeDetail(state) {
  const store = state.store || { refs: [], frames: [], langs: [] };
  const wrap = el('div', 'store-page');
  if (!state.allBuilt) {
    const card = el('section', 'panel step-panel');
    card.append(el('h2', '', 'Mağaza görselleri'), el('p', 'help', 'Önce tüm ekranlar Figma’da kurulur; mağaza kareleri bu gerçek ekranlarla üretilir.'));
    wrap.append(card);
    return wrap;
  }
  const busy = state.job?.type === 'store-generate';

  // Ayar kartı
  const setup = el('section', 'panel store-setup');
  setup.append(el('h2', '', 'Mağaza görselleri'));
  setup.append(el('p', 'help', `1) OpenAI her kare için efektli İngilizce başlıklı bir hedef tasarım ve ondan yazısı/telefonu kaldırılmış temiz zemin üretir (${store.models?.planner ? `${store.models.planner} + image_generation` : store.models?.image || 'gpt-image-2'}, en yüksek kalite). 2) Claude Figma’da zemini koyar, telefon maketine Figma’daki GERÇEK ekranı yerleştirir, başlığı hedeften efektli metin olarak klonlar. 3) Diğer diller Figma’da kopyalanıp çevrilir.`));

  const row = el('div', 'store-row');
  // 1. Referanslar
  const refCol = el('div', 'store-col-block');
  refCol.append(el('h3', '', '1. Referans görseller'));
  refCol.append(el('p', 'meta', 'Kopyalanmaz; yazı dili, tipografi, düzen, telefon açısı ve görsel dili okunup yeni seriye uygulanır. Renkler seçtiysen paletten gelir.'));
  const refs = el('div', 'store-ref-row');
  for (const ref of store.refs) {
    const name = ref.split('/').pop();
    const item = el('div', 'store-ref');
    const img = document.createElement('img');
    img.src = `/api/ref/${state.slug}/${encodeURIComponent(name)}`;
    img.alt = 'Referans';
    const remove = button('×', 'attach-remove', async () => { await fetch(`/api/ref/${state.slug}/${encodeURIComponent(name)}`, { method: 'DELETE' }); renderProject(state.slug, 'store'); });
    remove.setAttribute('aria-label', 'Referansı kaldır');
    item.append(img, remove);
    refs.append(item);
  }
  const refPicker = imagePicker(async (files) => {
    for (const file of files) await fetch(`/api/projects/${state.slug}/attachments?kind=store`, { method: 'POST', headers: { 'content-type': file.type }, body: file });
    renderProject(state.slug, 'store');
  });
  if (store.refs.length < 6) {
    const add = button('', 'store-ref-add', () => refPicker.click());
    add.append(icon('upload', 22), el('span', '', 'Referans yükle'));
    refs.append(add);
  }
  refCol.append(refs, refPicker);

  // 2. Mağaza
  const storeCol = el('div', 'store-col-block');
  storeCol.append(el('h3', '', '2. Mağaza'));
  const tiles = el('div', 'store-tiles');
  const checks = {};
  for (const [id, label, size] of [['ios', 'App Store', '1242×2688'], ['play', 'Play Store', '1080×1920']]) {
    const tile = el('label', 'store-tile');
    const c = document.createElement('input');
    c.type = 'checkbox'; c.checked = true; checks[id] = c;
    const logo = el('span', 'store-logo'); logo.innerHTML = STORE_LOGOS[id];
    tile.append(logo, el('strong', '', label), el('span', 'meta', size), c);
    tiles.append(tile);
  }
  storeCol.append(tiles);

  // 3. Kare sayısı
  const countCol = el('div', 'store-col-block narrow');
  countCol.append(el('h3', '', '3. Kare sayısı'));
  const count = document.createElement('select');
  count.className = 'store-select';
  count.setAttribute('aria-label', 'Kare sayısı');
  for (let n = 1; n <= 10; n++) { const o = new Option(`${n} kare`, String(n)); o.selected = n === 5; count.append(o); }
  countCol.append(count);
  row.append(refCol, storeCol, countCol);
  setup.append(row);

  // Kare başına telefonda gösterilecek ekran (öneri: her bölümün ana ekranı)
  setup.append(el('h3', 'store-langs-title', 'Karelerdeki ekranlar'));
  setup.append(el('p', 'meta', 'Her karede telefonun içinde Figma’daki bu ekran birebir görünür; başlık da bu ekrana göre yazılır.'));
  const allScreens = state.sections.flatMap((sec) => sec.screens.filter((x) => x.hasPreview).map((x) => ({ ...x, section: sec.title })));
  const picks = el('div', 'screen-picks');
  const pickSelects = [];
  const drawPicks = () => {
    const n = Number(count.value);
    while (pickSelects.length < n) {
      const i = pickSelects.length;
      const sel = document.createElement('select');
      sel.className = 'store-select';
      sel.setAttribute('aria-label', `Kare ${i + 1} ekranı`);
      for (const x of allScreens) sel.append(new Option(`${x.title} · ${x.section}`, x.id));
      sel.value = store.suggested?.[i] || store.base?.[i]?.screen || allScreens[i]?.id || '';
      pickSelects.push(sel);
    }
    picks.replaceChildren(...pickSelects.slice(0, n).map((sel, i) => { const l = el('label', 'screen-pick'); l.append(el('span', 'meta', `Kare ${i + 1}`), sel); return l; }));
  };
  count.addEventListener('change', drawPicks);
  drawPicks();
  setup.append(picks);

  // 4. Renkler: seçilirse referansların renkleri yok sayılır, yalnızca bu palet kullanılır
  setup.append(el('h3', 'store-langs-title', '4. Renkler'));
  setup.append(el('p', 'meta', 'Boş bırakırsan oyunun ve referansların renkleri kullanılır. Renk eklersen kareler yalnızca bu paletle üretilir; referanslardan sadece yerleşim alınır.'));
  const palette = (store.palette || []).map((c) => ({ ...c }));
  const swatches = el('div', 'palette-row');
  let saveTimer = null;
  const savePalette = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => fetch(`/api/projects/${state.slug}/store/palette`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ palette }) }), 300);
  };
  const ROLES = ['Arka plan', 'Başlık', 'Vurgu', 'İkincil', 'Detay', 'Ek renk'];
  const drawPalette = () => {
    swatches.replaceChildren();
    palette.forEach((c, i) => {
      const sw = el('div', 'swatch');
      const pick = document.createElement('input');
      pick.type = 'color'; pick.value = c.hex.toLowerCase();
      pick.setAttribute('aria-label', `${c.role} rengi`);
      const hex = el('span', 'swatch-hex', c.hex);
      pick.addEventListener('input', () => { c.hex = pick.value.toUpperCase(); hex.textContent = c.hex; savePalette(); });
      const role = document.createElement('input');
      role.type = 'text'; role.value = c.role; role.className = 'swatch-role';
      role.setAttribute('aria-label', 'Renk görevi');
      role.addEventListener('change', () => { c.role = role.value.trim() || 'Renk'; savePalette(); });
      const remove = button('×', 'attach-remove', () => { palette.splice(i, 1); savePalette(); drawPalette(); });
      remove.setAttribute('aria-label', `${c.role} rengini kaldır`);
      sw.append(pick, role, hex, remove);
      swatches.append(sw);
    });
    if (palette.length < 6) {
      const add = button('', 'swatch-add', () => { palette.push({ role: ROLES[palette.length] || 'Renk', hex: '#FFD43B' }); savePalette(); drawPalette(); });
      add.append(icon('plus', 18), el('span', '', 'Renk ekle'));
      swatches.append(add);
    }
  };
  drawPalette();
  setup.append(swatches);

  const start = button('', 'primary store-start', async () => {
    const stores = Object.keys(checks).filter((k) => checks[k].checked);
    if (!stores.length) return setStatus('En az bir mağaza seç.');
    if (store.base?.length && !await askDialog({ title: 'Görseller yeniden üretilsin mi?', help: 'Mevcut yazısız görsellerin üzerine yazılır.', confirmLabel: 'Yeniden üret', field: false })) return;
    askJob(state.slug, 'store-generate', { stores, count: Number(count.value), screens: pickSelects.slice(0, Number(count.value)).map((x) => x.value) });
  });
  start.append(icon('play', 18), el('span', '', busy ? 'Üretiliyor…' : store.base?.length ? 'Görselleri yeniden üret' : 'Hedef tasarımları üret'));
  start.disabled = Boolean(state.job) || !store.refs.length;
  if (!store.refs.length) start.title = 'Önce referans yükle';
  setup.append(start);
  wrap.append(setup);

  // 2. adım: yazısız görseller → Figma
  if (store.base?.length) {
    const baseCard = el('section', 'panel store-results-card');
    const bh = el('div', 'store-tabs-row');
    bh.append(el('h3', 'store-card-title', 'Hedef tasarımlar'));
    if (!state.job) {
      const toFigma = button('', 'primary store-zip', () => askJob(state.slug, 'store-figma'));
      toFigma.append(icon('figma', 16), el('span', '', store.figma?.nodes?.English ? 'Figma’ya yeniden yerleştir (English)' : 'Figma’ya yerleştir + İngilizce yazılar'));
      bh.append(toFigma);
    }
    baseCard.append(bh);
    const bg = el('div', 'store-grid-cards');
    for (const f of store.base) {
      for (const [platform, label] of [['ios', 'App Store'], ['play', 'Play Store']]) {
        if (!f.concept?.[platform] && !f.files[platform]) continue;
        const card = el('article', 'store-frame-card');
        const shot = el('div', `store-shot ${platform}`);
        const img = document.createElement('img');
        img.src = f.concept?.[platform] || f.files[platform]; img.alt = `Kare ${f.id} ${label} hedef tasarım`; img.loading = 'lazy';
        shot.append(img);
        card.append(shot, el('p', 'meta', `Kare ${f.id} · ${label}`));
        if (f.files[platform]) { const z = el('a', 'link', 'Temiz zemin'); z.href = f.files[platform]; z.target = '_blank'; card.append(z); }
        if (!state.job) {
          const regen = button('', 'store-pill', async () => {
            const note = await askDialog({ title: `Kare ${f.id} · yeniden üret`, help: 'Ne değişsin? Mevcut görsel girdi olarak verilir; iki mağaza birlikte yenilenir.', placeholder: 'Örn. telefon daha büyük, arka plan sarı…', confirmLabel: 'Yeniden üret' });
            if (note) askJob(state.slug, 'store-generate', { frame: f.id, note, stores: Object.keys(f.files) });
          });
          regen.append(icon('rotate-cw', 16), el('span', '', 'Yeniden üret'));
          const del = button('', 'store-pill danger-button', async () => {
            if (!await askDialog({ title: `Kare ${f.id} · ${label} silinsin mi?`, help: 'Yazısız görsel kalıcı olarak silinir.', confirmLabel: 'Sil', danger: true, field: false })) return;
            await storeDelete(state.slug, { base: true, frame: f.id, platform });
          });
          del.append(icon('trash', 16), el('span', '', 'Sil'));
          card.append(regen, del);
        }
        bg.append(card);
      }
    }
    baseCard.append(bg);
    wrap.append(baseCard);
  }

  // 3. adım: diller (English Figma'da hazırsa)
  if (store.figma?.nodes?.English) {
    const lc = el('section', 'panel store-results-card');
    lc.append(el('h3', 'store-card-title', 'Diğer diller'));
    lc.append(el('p', 'meta', 'Seçtiğin diller için İngilizce kareler Figma’da kopyalanır, yalnızca yazılar çevrilir. Yeni görsel üretilmez.'));
    const chips = el('div', 'lang-chips');
    const langChecks = [];
    const done = new Set(store.frames.map((f) => f.lang));
    for (const l of store.langs.filter((x) => x !== 'English')) {
      const chip = el('label', 'lang-chip');
      const c = document.createElement('input');
      c.type = 'checkbox'; c.value = l;
      langChecks.push(c);
      chip.append(c, el('span', '', done.has(l) ? `${l} ✓` : l));
      chips.append(chip);
    }
    lc.append(chips);
    const go = button('', 'primary store-start', () => {
      const langs = langChecks.filter((c) => c.checked).map((c) => c.value);
      if (!langs.length) return setStatus('En az bir dil seç.');
      askJob(state.slug, 'store-translate', { langs });
    });
    go.append(icon('play', 18), el('span', '', 'Seçili dilleri ekle'));
    go.disabled = Boolean(state.job);
    lc.append(go);
    const hasPlay = store.frames.some((f) => f.files?.play && f.lang === 'English');
    lc.append(el('h3', 'store-card-title store-langs-title', 'Play Store'));
    lc.append(el('p', 'meta', 'App Store kareleri Play Store’a (1080×1920) uyarlanır: temiz zeminler kırpılır (yeni görsel üretilmez), telefon Android maketle değişir, başlıklar aynı kalır. Figma’da olan tüm diller için yapılır.'));
    const play = button('', 'primary store-start', () => askJob(state.slug, 'store-play'));
    play.append(icon('play', 18), el('span', '', hasPlay ? 'Play Store’u yeniden türet' : 'Play Store’u App Store’dan türet'));
    play.disabled = Boolean(state.job);
    lc.append(play);

    // Tanıtım / kapak görselleri (hazır içerikten, 12 dil)
    lc.append(el('h3', 'store-card-title store-langs-title', 'Tanıtım görselleri'));
    lc.append(el('p', 'meta', 'Hazır zemin, ekran ve başlıklardan Figma’da kurulur; yeni görsel üretilmez. Figma’daki tüm diller için yapılır.'));
    const bRow = el('div', 'banner-row lang-chips banner-chips');
    const presets = [[3840, 1646, 'App Store Header'], [3840, 2560, 'App Store Search Result'], [1024, 500, 'Play Store kapak görseli']];
    const checks = presets.map(([w, h, name], i) => {
      const lab = el('label', 'lang-chip');
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = i === 0;
      lab.append(cb, el('span', '', `${name} · ${w}×${h}`));
      bRow.append(lab);
      return { cb, w, h, name };
    });
    const customLab = el('label', 'lang-chip');
    const customCb = document.createElement('input'); customCb.type = 'checkbox';
    customLab.append(customCb, el('span', '', 'Özel ölçü…'));
    bRow.append(customLab);
    const wIn = document.createElement('input'); wIn.type = 'number'; wIn.placeholder = 'Genişlik'; wIn.className = 'store-title'; wIn.setAttribute('aria-label', 'Genişlik (px)');
    const hIn = document.createElement('input'); hIn.type = 'number'; hIn.placeholder = 'Yükseklik'; hIn.className = 'store-title'; hIn.setAttribute('aria-label', 'Yükseklik (px)');
    const nIn = document.createElement('input'); nIn.type = 'text'; nIn.placeholder = 'Ad (ör. App Store tanıtım)'; nIn.className = 'store-title'; nIn.setAttribute('aria-label', 'Ad');
    const custom = el('div', 'banner-custom'); custom.append(wIn, hIn, nIn); custom.hidden = true;
    const pick = () => {
      const list = checks.filter((c) => c.cb.checked).map(({ w, h, name }) => ({ w, h, name }));
      if (customCb.checked) { const w = Number(wIn.value), h = Number(hIn.value); if (w && h) list.push({ w, h, name: nIn.value.trim() || `${w}×${h}` }); }
      return list;
    };
    const hasEn = ({ w, h }) => (store.banners || []).some((b) => b.lang === 'English' && b.w === w && b.h === h);
    const mk = button('', 'primary store-start', () => {
      const list = pick();
      if (!list.length) return setStatus('En az bir ölçü seç.');
      askJob(state.slug, 'store-banner', { banners: list, phase: 'english' });
    });
    mk.append(icon('play', 18), el('span', '', '1) İngilizce tasarımı oluştur'));
    const cl = button('', 'store-start', () => {
      const list = pick();
      if (!list.length) return setStatus('En az bir ölçü seç.');
      askJob(state.slug, 'store-banner', { banners: list, phase: 'clone' });
    });
    cl.append(icon('layers', 18), el('span', '', '2) Diğer dillere klonla'));
    const sync = () => {
      custom.hidden = !customCb.checked;
      const list = pick();
      mk.disabled = Boolean(state.job) || !list.length;
      cl.disabled = Boolean(state.job) || !list.length || !list.every(hasEn);
      cl.title = cl.disabled && !state.job && list.length ? 'Önce seçili ölçülerin İngilizce tasarımını oluştur' : '';
    };
    for (const x of [...checks.map((c) => c.cb), customCb]) x.addEventListener('change', sync);
    wIn.addEventListener('input', sync); hIn.addEventListener('input', sync);
    sync();
    lc.append(bRow, custom, mk, cl);
    wrap.append(lc);
  }

  // Sonuç kartı: Figma'dan dışa aktarılan PNG'ler, dil sekmeleri
  const langs = [...new Set(store.frames.map((f) => f.lang))];
  if (!langs.length) return wrap;
  if (!langs.includes(storeTab)) storeTab = langs[0];
  const results = el('section', 'panel store-results-card');
  const head = el('div', 'store-tabs-row');
  const tabs = el('div', 'store-tabs');
  tabs.setAttribute('role', 'tablist');
  for (const l of langs) {
    const t = button(l, 'store-tab', () => { storeTab = l; renderProject(state.slug, 'store'); });
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-selected', l === storeTab ? 'true' : 'false');
    tabs.append(t);
  }
  const zip = el('a', 'button store-zip');
  zip.href = `/api/projects/${state.slug}/store/zip?lang=${encodeURIComponent(storeTab)}`;
  zip.append(icon('download', 16), el('span', '', 'Bu dili indir (.zip)'));
  const delLang = button('', 'store-zip danger-button', async () => {
    if (!await askDialog({ title: `${storeTab} görselleri silinsin mi?`, help: 'Bu dildeki tüm mağaza kareleri (App Store ve Play Store) kalıcı olarak silinir.', confirmLabel: 'Hepsini sil', danger: true, field: false })) return;
    await storeDelete(state.slug, { lang: storeTab });
  });
  delLang.append(icon('trash', 16), el('span', '', 'Bu dili sil'));
  head.append(tabs, zip, delLang);
  if (langs.length > 1) {
    const all = el('a', 'button store-zip');
    all.href = `/api/projects/${state.slug}/store/zip`;
    all.append(icon('download', 16), el('span', '', 'Tümü (.zip)'));
    head.append(all);
  }
  results.append(head);

  const grid = el('div', 'store-grid-cards');
  for (const f of store.frames.filter((x) => x.lang === storeTab)) {
    for (const [platform, label] of [['ios', 'App Store'], ['play', 'Play Store']]) {
      if (!f.files[platform]) continue;
      const card = el('article', 'store-frame-card');
      const shot = el('div', `store-shot ${platform}`);
      const img = document.createElement('img');
      img.src = f.files[platform]; img.alt = `${storeTab} kare ${f.id} ${label}`; img.loading = 'lazy';
      shot.append(img);
      card.append(shot, el('p', 'meta', `Kare ${f.id} · ${label}`));
      const dl = el('a', 'button store-pill', 'PNG');
      dl.href = f.files[platform];
      dl.download = `${platform === 'ios' ? 'appstore' : 'playstore'}-${f.id}.png`;
      card.append(dl);
      if (!state.job) {
        const del = button('', 'store-pill danger-button', async () => {
          if (!await askDialog({ title: `Kare ${f.id} · ${label} silinsin mi?`, help: 'PNG kalıcı olarak silinir (Figma’daki kare kalır).', confirmLabel: 'Sil', danger: true, field: false })) return;
          await storeDelete(state.slug, { lang: storeTab, frame: f.id, platform });
        });
        del.append(icon('trash', 16), el('span', '', 'Sil'));
        del.setAttribute('aria-label', `Kare ${f.id} ${label} görselini sil`);
        card.append(del);
      }
      grid.append(card);
    }
  }
  results.append(grid);
  const bans = (store.banners || []).filter((b) => b.lang === storeTab);
  if (bans.length) {
    results.append(el('h3', 'store-group', 'Tanıtım görselleri'));
    const bg2 = el('div', 'banner-grid');
    for (const b of bans) {
      const card = el('article', 'store-frame-card');
      const img = document.createElement('img'); img.src = b.url; img.alt = `${b.name} ${storeTab}`; img.className = 'banner-img';
      const dl = el('a', 'button store-pill', 'PNG'); dl.href = b.url; dl.download = `${b.name}-${storeTab}.png`;
      card.append(img, el('p', 'meta', `${b.name} · ${b.w}×${b.h}`), dl);
      bg2.append(card);
    }
    results.append(bg2);
  }
  wrap.append(results);
  return wrap;
}

// Kullanıcının hazırladığı asset'ler: tasarım işleri önce bunları kullanır (CLAUDE.md → Kütüphane)
const LIB_KINDS = [['asset', 'Asset görseli'], ['character', 'Karakter'], ['icon', 'İkon'], ['background', 'Arka plan'], ['ui', 'UI parçası']];
async function libCall(slug, action, body) {
  const response = await fetch(`/api/projects/${slug}/library/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json();
  if (!response.ok) setStatus(payload.error || 'Kaydedilemedi.');
  return response.ok;
}

async function libUpload(slug, files, kind) {
  for (const file of files) {
    const type = file.type || (file.name.endsWith('.svg') ? 'image/svg+xml' : '');
    setStatus(`Yükleniyor: ${file.name}`);
    const response = await fetch(`/api/projects/${slug}/library?name=${encodeURIComponent(file.name)}&kind=${kind}`, { method: 'POST', headers: { 'content-type': type }, body: file });
    if (!response.ok) { setStatus((await response.json()).error || 'Yüklenemedi.'); return; }
  }
  setStatus('Kütüphaneye eklendi.');
  renderProject(slug, 'library');
}

function libraryPanel(state) {
  const panel = el('section', 'panel step-panel');
  panel.append(el('h2', '', 'Kütüphane'));
  panel.append(el('p', 'help', 'Ekranlarda kullanılacak hazır asset’lerini buraya yükle: araçlar, karakterler, 3D ikonlar, arka planlar, buton süsleri… Panel tasarım yaparken önce burada arar; uygun olanı olduğu gibi kullanır, yalnızca bulamadığını OpenAI ile üretir. Adı ve “nerede kullanılır” notu ne kadar açıksa eşleşme o kadar doğru olur.'));
  panel.append(el('p', 'meta', 'Figma’da kendin component kurduysan dosyada “Kütüphane” adlı bir sayfaya koy; panel o component’leri de yeni oluşturmak yerine kullanır.'));

  const drop = el('div', 'store-drop');
  const kind = document.createElement('select');
  kind.setAttribute('aria-label', 'Tür');
  for (const [v, t] of LIB_KINDS) kind.append(new Option(t, v));
  const picker = document.createElement('input');
  picker.type = 'file'; picker.multiple = true; picker.hidden = true;
  picker.accept = 'image/png,image/jpeg,image/webp,image/svg+xml,.svg';
  picker.addEventListener('change', () => { const files = [...picker.files]; picker.value = ''; if (files.length) libUpload(state.slug, files, kind.value); });
  const add = button('', 'primary', () => picker.click());
  add.append(icon('image-plus', 16), el('span', '', 'Asset yükle'));
  drop.append(add, kind, el('span', 'meta', 'ya da dosyaları buraya sürükle · PNG (şeffaf), JPEG, WebP, SVG'), picker);
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault(); drop.classList.remove('over');
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/') || f.name.endsWith('.svg'));
    if (files.length) libUpload(state.slug, files, kind.value);
  });
  panel.append(drop);

  const items = state.library || [];
  if (!items.length) { panel.append(el('p', 'meta', 'Henüz asset yok.')); return panel; }
  for (const [k, label] of LIB_KINDS) {
    const group = items.filter((it) => it.kind === k);
    if (!group.length) continue;
    panel.append(el('h3', 'store-group', `${label} · ${group.length}`));
    const grid = el('div', 'lib-grid');
    for (const it of group) {
      const card = el('article', 'lib-card');
      card.dataset.filter = `${it.name} ${it.note}`;
      const shot = el('div', 'lib-shot');
      const img = document.createElement('img');
      img.src = it.url; img.alt = it.name; img.loading = 'lazy';
      shot.append(img);
      const name = document.createElement('input');
      name.value = it.name; name.setAttribute('aria-label', 'Ad');
      name.addEventListener('change', () => libCall(state.slug, 'update', { id: it.id, name: name.value }));
      const note = document.createElement('textarea');
      note.rows = 2; note.value = it.note; note.placeholder = 'Nerede kullanılır? (ör. oyun tahtasındaki kırmızı araç)';
      note.setAttribute('aria-label', 'Nerede kullanılır');
      note.addEventListener('change', () => libCall(state.slug, 'update', { id: it.id, note: note.value }));
      const row = el('div', 'lib-row');
      const type = document.createElement('select');
      type.setAttribute('aria-label', 'Tür');
      for (const [v, t] of LIB_KINDS) { const o = new Option(t, v); o.selected = it.kind === v; type.append(o); }
      type.addEventListener('change', async () => { if (await libCall(state.slug, 'update', { id: it.id, kind: type.value })) renderProject(state.slug, 'library'); });
      const del = button('Sil', 'danger-button', async () => {
        if (await askDialog({ title: `${it.name} silinsin mi?`, help: 'Figma’ya önceden yerleştirildiyse orada kalır.', confirmLabel: 'Sil', danger: true, field: false })) {
          if (await libCall(state.slug, 'delete', { id: it.id })) renderProject(state.slug, 'library');
        }
      });
      row.append(type, del);
      card.append(shot, name, note, row);
      if (it.placed) card.append(el('span', 'flag ready', 'Figma’da kullanıldı'));
      grid.append(card);
    }
    panel.append(grid);
  }
  return panel;
}

function auditDetail(state) {
  const wrap = el('div');
  wrap.append(el('h2', '', 'Denetim'));
  if (state.stage !== 'audit') {
    wrap.append(el('p', 'help', 'Tüm ekranlar kurulup onaylanınca denetçi tasarımı web-interface-guidelines ve DESIGN.md “Yapma listesi”ne göre kontrol eder: erişilebilirlik, dokunma alanı, boş/hata/yükleme durumları, tutarlılık, eksik ekran ve metinler.'));
    return wrap;
  }
  const busy = state.job?.type === 'audit' || state.job?.type === 'audit-fix';
  const items = [...(state.audit?.items || [])].sort((a, b) => (SEVERITY[a.severity]?.[1] ?? 3) - (SEVERITY[b.severity]?.[1] ?? 3));
  if (!state.audit) {
    wrap.append(el('p', 'help', busy ? 'Denetçi ekranları bölüm bölüm kontrol ediyor. Bulgular burada listelenecek.' : 'Henüz denetim yapılmadı.'));
    if (!busy) { const a = el('div', 'actions'); a.append(button('Denetimi başlat', 'primary', () => askJob(state.slug, 'audit'))); wrap.append(a); }
    return wrap;
  }
  const open = items.filter((item) => item.status !== 'fixed');
  const counts = Object.entries(SEVERITY).map(([key, [label]]) => `${open.filter((i) => i.severity === key).length} ${label.toLocaleLowerCase('tr')}`).join(' · ');
  wrap.append(el('p', 'help', items.length
    ? `${items.length} bulgu, ${open.length} açık (${counts}). ${state.audit.updatedAt ? `Son denetim ${ago(state.audit.updatedAt)}.` : ''}`
    : 'Denetçi sorun bulmadı.'));
  // Düzeltilecek bulgular seçilir; varsayılan olarak kritikler işaretli.
  const picked = new Set(open.filter((item) => item.severity === 'high').map((item) => item.id));
  let fixBtn = null;
  const syncFix = () => {
    if (!fixBtn) return;
    fixBtn.textContent = picked.size ? `Seçili ${picked.size} bulguyu düzelt` : 'Düzeltilecek bulgu seç';
    fixBtn.disabled = !picked.size;
  };
  const boxes = [];
  if (!busy) {
    const actions = el('div', 'actions');
    actions.append(button('Yeniden denetle', '', () => askJob(state.slug, 'audit')));
    if (open.length) {
      fixBtn = button('', '', () => askJob(state.slug, 'audit-fix', { ids: [...picked] }));
      actions.append(fixBtn);
      actions.append(button('Hepsini seç ve düzelt', 'primary', () => {
        for (const item of open) picked.add(item.id);
        for (const box of boxes) box.checked = true;
        syncFix();
        askJob(state.slug, 'audit-fix', { ids: open.map((item) => item.id) });
      }));
      syncFix();
    }
    wrap.append(actions);
  }
  const screens = new Map(state.sections.flatMap((s) => s.screens).map((s) => [s.id, s]));
  const list = el('ol', 'findings');
  for (const item of items) {
    const [label] = SEVERITY[item.severity] || [item.severity || '—'];
    const row = el('li', `finding ${item.severity || ''} ${item.status === 'fixed' ? 'fixed' : ''}`);
    const screen = screens.get(item.screen);
    row.dataset.filter = `${item.title} ${item.detail || ''} ${screen?.title || ''} ${item.sectionTitle}`;
    const head = el('div', 'finding-head');
    if (!busy && item.status !== 'fixed') {
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = picked.has(item.id);
      box.setAttribute('aria-label', `Düzelt: ${item.title}`);
      box.addEventListener('change', () => { if (box.checked) picked.add(item.id); else picked.delete(item.id); syncFix(); });
      boxes.push(box);
      head.append(box);
    }
    head.append(el('span', 'sev', label), el('strong', '', item.title));
    if (item.status === 'fixed') head.append(el('span', 'flag ready', 'Düzeltildi'));
    row.append(head);
    if (item.detail) row.append(el('p', 'help', item.detail));
    if (item.fix) row.append(el('p', 'finding-fix', `Öneri: ${item.fix}`));
    const where = el('p', 'meta');
    where.append(screen ? `${screen.index} ${screen.title}` : item.sectionTitle || 'Genel');
    if (item.rule) where.append(` · ${item.rule}`);
    row.append(where);
    if (screen?.figmaUrl) row.append(anchor('Figma’da aç', screen.figmaUrl));
    list.append(row);
  }
  wrap.append(list);
  return wrap;
}

function pickStage(state) {
  const panel = el('div');
  const selected = new Set();
  const count = el('p', 'meta', '0 / 5');
  const list = el('div', 'screens');
  const screens = state.sections.flatMap((section) => section.screens);
  for (const screen of screens) {
    const row = el('label', 'screen');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('change', () => {
      if (input.checked && selected.size >= 5) {
        input.checked = false;
        return;
      }
      if (input.checked) selected.add(screen.id);
      else selected.delete(screen.id);
      count.textContent = `${selected.size} / 5`;
      save.disabled = selected.size < 1;
    });
    row.dataset.filter = `${screen.index} ${screen.title} ${screen.sectionTitle}`;
    row.append(input, el('span', '', `${screen.index} ${screen.title}`), el('span', 'meta', screen.sectionTitle));
    list.append(row);
  }
  const save = button('Referansları kaydet', 'primary', async () => {
    save.disabled = true;
    const response = await fetch(`/api/projects/${state.slug}/references`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ids: [...selected] }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error || 'Seçim kaydedilemedi.');
      save.disabled = false;
      return;
    }
    openStep(state.slug, 'pick');
  });
  save.disabled = true;
  panel.append(count, list);
  const actions = el('div', 'actions');
  actions.append(save);
  panel.append(actions);
  return panel;
}

function referenceList(state, selected, onToggle) {
  const list = el('div', 'refs');
  for (const item of state.references) {
    const card = button('', 'ref pick-card', () => {
      if (selected.has(item.id)) selected.delete(item.id);
      else selected.add(item.id);
      const on = selected.has(item.id);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
      mark.textContent = on ? 'Seçili' : 'Seç';
      onToggle();
    });
    card.disabled = item.visual === 'missing';
    card.setAttribute('aria-pressed', 'false');
    card.dataset.filter = `${item.title} ${item.id}`;
    const visual = el('div');
    if (item.hasReference) {
      const image = document.createElement('img');
      image.alt = '';
      image.src = `/api/reference/${state.slug}/${item.id}?t=${Date.now()}`;
      visual.append(image);
    } else visual.append(el('div', 'placeholder', 'Görsel yok'));
    const body = el('div');
    body.append(el('h3', '', item.title));
    body.append(el('p', 'token', item.id));
    body.append(el('p', 'meta', statusLabel('visual', item.visual)));
    const mark = el('span', 'flag', item.visual === 'missing' ? 'Görsel bekleniyor' : 'Seç');
    body.append(mark);
    card.append(visual, body);
    list.append(card);
  }
  return list;
}

function statusLabel(target, status) {
  const visual = { missing: 'Görsel bekleniyor', review: 'Onay bekliyor', approved: 'Görsel onaylandı', rejected: 'Görsel reddedildi' };
  const figma = { waiting: 'Figma’da henüz yok', review: 'Ekran onay bekliyor', approved: 'Ekran onaylandı', rejected: 'Ekran reddedildi' };
  return (target === 'visual' ? visual : figma)[status] || status;
}

async function approveAndDesign(state, ids) {
  const response = await fetch(`/api/projects/${state.slug}/approve-design`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  const payload = await response.json();
  if (!response.ok) {
    setStatus(payload.error || 'Onay kaydedilemedi.');
    return;
  }
  setStatus('Onaylandı. Figma tasarımı istendi.');
  openStep(state.slug, 'figma');
}

async function uploadAttachments(slug, files) {
  const paths = [];
  for (const file of files) {
    const response = await fetch(`/api/projects/${slug}/attachments`, { method: 'POST', headers: { 'content-type': file.type }, body: file });
    const payload = await response.json();
    if (!response.ok) { setStatus(payload.error || 'Görsel yüklenemedi.'); continue; }
    paths.push(payload.path);
  }
  return paths;
}

// Ekran düzenleme: ids boşsa not tüm ekranlara uygulanır
async function askEdit(state, ids, title) {
  const note = await askDialog({
    title: title ? `Düzenle: ${title}` : 'Tüm ekranlarda düzenle',
    help: title ? 'Bu ekranda ne değişsin? Claude Figma’da düzeltip önizlemeyi yeniler.' : 'Tüm ekranlara uygulanacak değişikliği yaz. Claude her ekranı bu nota göre günceller.',
    placeholder: title ? 'Örn. alt butonu büyüt, başlığı Türkçe yap…' : 'Örn. tüm metinleri Türkçeye çevir, butonların köşelerini yuvarlat…',
    confirmLabel: 'Düzenlemeyi gönder',
    images: true,
  });
  if (note?.note) askJob(state.slug, 'screen-edit', { ids, note: note.note, images: await uploadAttachments(state.slug, note.files) });
}

async function askJob(slug, type, extra = {}) {
  const response = await fetch(`/api/projects/${slug}/job`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type, ...extra }),
  });
  const payload = await response.json();
  if (!response.ok) {
    setStatus(payload.error || 'İş istenemedi.');
    return;
  }
  setStatus('İş istendi.');
  renderProject(slug);
}

function restStage(state) {
  const grid = el('div', 'work-grid');
  const main = el('div', 'stack');
  const intro = el('section', 'block');
  intro.append(el('h2', '', 'Kalan ekranlar'));
  intro.append(el('p', 'help', 'Onaylı referanslar klonlanır. Karta basınca ekran sıraya eklenir.'));
  main.append(intro);
  const sections = state.sections
    .map((section) => ({
      title: section.title,
      screens: section.screens.filter((screen) => !state.referenceIds.includes(screen.id)),
    }))
    .filter((section) => section.screens.length);
  for (const section of sections) {
    const block = el('section', 'block');
    block.append(el('h2', '', section.title));
    const cards = el('div', 'cards');
    for (const screen of section.screens) {
      const queued = queue.some((item) => item.id === screen.id);
      const card = button('', 'card screen-card', () => addRest(state, screen));
      if (queued) card.classList.add('queued');
      card.dataset.filter = `${screen.index} ${screen.title} ${section.title}`;
      card.append(el('span', 'meta', screen.index));
      card.append(el('strong', '', screen.title));
      const flags = el('span', 'flags');
      if (screen.built) flags.append(el('span', 'flag ready', 'Hazır'));
      flags.append(el('span', 'flag', queued ? 'Sırada' : 'Sıraya ekle'));
      card.append(flags);
      cards.append(card);
    }
    block.append(cards);
    main.append(block);
  }

  const queuePanel = el('section', 'panel queue-panel');
  queuePanel.append(el('h2', '', 'Sıra'));
  queuePanel.append(el('p', 'help', 'Kaydettikten sonra kalan ekranların tasarlanması istenir.'));
  const queueList = el('ol', 'screens');
  if (!queue.length) queueList.append(el('li', 'help', 'Henüz ekran yok.'));
  queue.forEach((item, index) => {
    const row = el('li', 'row');
    row.dataset.filter = item.title;
    row.append(el('span', '', `${index + 1}. ${item.title}`));
    row.append(button('Çıkar', '', () => {
      queue.splice(index, 1);
      dirty = true;
      renderProject(state.slug);
    }));
    queueList.append(row);
  });
  const save = button('Sırayı kaydet', 'primary', () => saveQueue(state.slug));
  const ask = button('Kalanları tasarla', '', async () => {
    if (await saveQueue(state.slug)) askJob(state.slug, 'design-rest');
  });
  ask.disabled = !queue.length;
  const actions = el('div', 'actions');
  actions.append(save, ask);
  queuePanel.append(queueList, actions);
  grid.append(main, queuePanel);
  return grid;
}

function addRest(state, screen) {
  if (queue.some((item) => item.id === screen.id)) return;
  queue.push({ id: screen.id, title: screen.title, note: '' });
  dirty = true;
  renderProject(state.slug);
}

async function saveQueue(slug) {
  const response = await fetch(`/api/queue/${slug}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items: queue.map((item) => ({ id: item.id, note: item.note || '' })) }),
  });
  const payload = await response.json();
  if (!response.ok) {
    setStatus(payload.error || 'Sıra kaydedilemedi.');
    return;
  }
  dirty = false;
  queue = payload.queue.map((item) => ({ ...item }));
  setStatus('Sıra kaydedildi.');
  return true;
}

filterEl.addEventListener('input', applyFilter);
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    filterEl.focus();
  }
});
const kbd = document.querySelector('.kbd');
if (kbd && !/Mac|iPhone|iPad/.test(navigator.platform)) kbd.textContent = 'Ctrl K';

document.querySelector('#settings-close').addEventListener('click', () => settingsDialog.close());
settingsDialog.addEventListener('click', (event) => {
  if (event.target === settingsDialog) settingsDialog.close();
});

projectBody.append(createForm());
addProjectBtn.addEventListener('click', () => {
  const form = projectBody.querySelector('form');
  form.reset();
  const error = form.querySelector('.error');
  error.hidden = true;
  error.textContent = '';
  projectDialog.showModal();
  form.querySelector('input')?.focus();
});
document.querySelector('#project-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

window.addEventListener('hashchange', route);
route();
