# Figma Agent — genel kurallar

Mobil uygulama tasarımlarını Figma'da **az krediyle** üreten çalışma alanı. Kullanıcıyla Türkçe konuş.
Temel ilke: **bir kez tasarla, sonra yeniden kullan.** Her ekranı sıfırdan tasarlama, Figma'yı her seferinde baştan okuma.

## Yapı

```
CLAUDE.md                  # bu dosya — tüm uygulamalar için ortak kurallar
.claude/skills/            # ortak skill'ler (taste-skill, design-md-library, web-interface-guidelines)
.env                       # OPENAI_API_KEY — asla okuma/yazdırma
panel/server.mjs           # yerel sıra paneli — node panel/server.mjs
projects/<uygulama>/       # her uygulama ayrı ve bağımsız
  project.json             # ad, FigJam ve Figma linkleri, referans onayları, bekleyen iş
  flow.md                  # ekran listesi (FigJam akışından, bir kez çıkarılır)
  DESIGN.md                # o uygulamanın tek tasarım kaynağı (token, kural, component listesi, referans ekranlar)
  figma.json               # Figma dosya/sayfa id'leri, variable ve component node id'leri, ekran durumları (önbellek)
  queue.json               # panelin yazdığı yapılacak ekran sırası
  references/              # panelden yüklenen referans görseller
  previews/                # Figma ekran görüntüleri, panelde gösterilir
  assets/manifest.json     # img/<id> görsel alanları: prompt, boyut, durum
```

Bir uygulamada çalışırken **yalnızca o uygulamanın klasörünü** oku. Başka uygulamanın DESIGN.md'si okunmaz.

## Yeni uygulama akışı

1. **Flow:** FigJam'i bir kez oku (`get_figjam`, `includeImagesOfNodes:false`) → `flow.md`. FigJam'deki ekran görselleri kullanıcının referanslarıdır (bkz. Panel).
2. **Tasarım dili:** design-md-library `INDEX.md`'den 2–3 marka öner → kullanıcı seçer → o markanın dosyası + taste-skill
   + web-interface-guidelines ile `DESIGN.md` yaz → kullanıcı onayı. Marka kütüphanesi bundan sonra okunmaz.
3. **Temel (bir kez):** Figma'da variable'lar + component'ler + rastgele 5 ekran (kullanıcı onayı). Node id'leri `figma.json`'a yaz.
4. **Ekranlar:** `flow.md`'deki her ekran için `DESIGN.md` + `figma.json`'u oku, en yakın referans ekranı klonla,
   içeriği değiştir, mevcut component instance'larını kullan. Yeni tasarım kararı alma; gerekiyorsa önce DESIGN.md'ye ekle.
5. **Görseller (ekran tasarımının parçası, ayrı iş değil):** Ekran kurarken her `img/<id>` alanını `assets/manifest.json`'a ekle
   (`id, screen, w, h, prompt`; ortak `style` DESIGN.md'deki görsel tarifinden). Ekranlar bitince `node panel/fill-images.mjs <proje>`
   (model `.env` → `OPENAI_SCREEN_IMAGE_MODEL`, varsayılan gpt-image-2) → `upload_assets` (count, currentPageId = component sayfası; dönen
   `imageHash`'i `use_figma` ile alanın dolgusuna ver, geçici frame'i sil, alanın placeholder ikonunu gizle) → manifest `status: placed`.
   Önizlemeleri görseller yerleştikten sonra al. Not: curl ile upload'ta `-F "file=@x.png;type=image/png"` kullan ve yanıtı kontrol et.
6. **Denetim:** web-interface-guidelines + DESIGN.md "Yapma listesi".

## Panel

`node panel/server.mjs` → http://127.0.0.1:4317

Her proje `projects/<uygulama>/project.json` ile ayrıdır: ad, FigJam linki, Figma tasarım linki. Akış (2026-10-26, kullanıcı kararı):

1. **FigJam** — `extract-flow`: FigJam'i oku → `flow.md`. Ekran görselleri artık **kullanıcının kendi eklediği referanslardır**:
   bir ekran kutusuna bağlı/yanındaki görsel varsa node id'sini `flow.md`'de o ekranın satırının sonuna ` · ref: <nodeId>` olarak yaz (satır biçimi: ``- `id` — 01-02 — Başlık · ref: 12:34``).
   **Panonun herhangi bir yerindeki (ör. en üstte toplu duran) tüm görseller de referanstır** (kullanıcı kararı, 2026-10-30): hepsini bul
   (`fills` içinde IMAGE olan node'lar), ilgili ekranla eşleştirip `ref:` yaz; eşleşmeyenleri `flow.md` başına `Referanslar:` listesi olarak
   (`nodeId — kısa tarif`) ekle. Referansta olup akışta olmayan ekran varsa (ör. karşılama) akışa ekle ve job notunda belirt. İlk okumada
   `includeImagesOfNodes:false`; görsel yalnızca o ekran tasarlanırken `get_screenshot` ile tek tek, küçük ölçekte alınır.
2. **Figma tasarımı** — `design-references`: panel her bölümden olacak şekilde **rastgele 5 ekran** seçer (`referenceIds`, `job.ids`).
   **FigJam'deki referans görseli olan ekran, o referansın birebir aynısı olarak kurulur** (2026-11-05, kullanıcı kararı; design-references,
   design-rest, screen-add hepsi için): yerleşim, ölçü, renk, metin, ikon ve süsler referanstan ölçülür; çizim/3D öğeler OpenAI ile referansa göre üretilir
   (bkz. "Referans görsel varsa referans kazanır"). Referansı olmayan ekranlar referanslı ekranların diliyle kurulur.
   **Tasarım dili her zaman FigJam referans görsellerinden çıkarılır** (renk, tipografi, köşe, illüstrasyon tarzı, buton/kart biçimi): önce referansları
   `get_screenshot` ile küçük ölçekte bir kez gör, DESIGN.md'yi bunlara göre yaz; design-md-library yalnızca referans yoksa kullanılır.
   DESIGN.md yoksa önce yaz (referans yoksa design-md-library'den uygun markayı sen seç, gerekçesini job notuna yaz), token + component'leri kur, 5 ekranı tasarla,
   `figma.json` ve `previews/<id>.png` yaz, `finish`. Kullanıcı panelden **Onayla** ya da **Değişiklik iste** der; değişiklikte `job.note` vardır → aynı 5 ekranı nota göre düzelt.
3. **Kalan ekranlar** — onaydan sonra `design-rest`: `queue.json` sırasıyla FigJam'deki diğer ekranları, onaylı 5 ekranı klonlayarak ve varsa FigJam referans görseline bakarak kur.
   Tüm ekranlar kurulunca kullanıcı panelden **Onayla ve denetle** der (`restApproved: true`) → 4. adım açılır.
4. **Denetim** — `audit`: denetçi rolündesin; tasarımı düzeltme, yalnızca kontrol et. Her bölüm için tek `use_figma` (salt okuma) ile
   ekranların metin/boyut/component/durum bilgisini topla, gerekirse `previews/` görsellerine bak; web-interface-guidelines
   (`references/review-checklist.md`) + DESIGN.md "Yapma listesi" + `flow.md` (eksik ekran/durum) ile karşılaştır:
   dokunma alanı ≥44, kontrast, boş/yükleme/hata durumları, geri/kapat yolu, tutarsız spacing/token dışı renk, kesik/taşan metin,
   placeholder kalmış metin veya görsel, eksik onay/iptal, klavye/safe area. Bulguları `projects/<uygulama>/audit.json`'a yaz:
   `{ "updatedAt": ISO, "items": [{ "id": "a-001", "section": "01-opening", "screen": "<ekran id | null>", "severity": "high|medium|low",
   "title": "kısa sorun", "detail": "neden sorun", "fix": "önerilen düzeltme", "rule": "kaynak kural", "status": "open" }] }`.
   Yeniden denetimde düzeltilmiş kayıtları koru, yenilerini ekle.
   `audit-fix`: `job.ids` = açık bulgu id'leri; her birini Figma'da düzelt, `status: "fixed"` yap, değişen ekranların önizlemesini yenile.

5. **Ekran düzenleme** — `screen-edit` (tüm ekranlar kurulduktan sonra, kullanıcı panelden ekran kartındaki kalem ikonuyla ya da
   "Tüm ekranlarda düzenle" ile ister): `job.note` = kullanıcının isteği; `job.ids` doluysa yalnızca o ekranları, boşsa tüm ekranları
   nota göre Figma'da düzenle (DESIGN.md ve component'lerle tutarlı kal; nota yeni tasarım kararı gerekiyorsa önce DESIGN.md'ye ekle).
   Değişen ekranların `previews/<id>.png`'ini yenile, `figma.json` durumunu `built` bırak, `finish`.

6. **Ekran ekleme** — `screen-add`: `job.section` = bölüm başlığı, `job.note` = kullanıcının tarifi, `job.after` = bölümün son ekranı.
   Nota göre yeni ekranı `flow.md`'de o bölüme (nottaki sıraya, yoksa sona) aynı satır biçimiyle ekle (yeni id, sıra numarası),
   en yakın onaylı ekranı klonlayıp Figma'da o bölümün Section'ına kur, `figma.json`'a `status: built` yaz, görsel alanı varsa
   manifest + fill-images, `previews/<id>.png`, `finish`. Not akıştaki başka ekranları da etkiliyorsa yalnızca job notunda belirt.

7. **Mağaza görselleri** (2026-11-09, kullanıcı kararı — maliyet için yazılar Figma'da):
   a) `store-generate` (Claude yok, `panel/store-generate.mjs`): kullanıcı referans (`references/store-ref-*`), mağaza, kare sayısı (1–10), isteğe bağlı
      **Renkler** paleti (`store.json` → `palette`) seçer. OpenAI (quality high; `.env` → `OPENAI_STORE_MODEL` varsa Responses API) kare/mağaza başına iki görsel:
      **hedef** (`store/base/concept-<ios|play>-NN.png`: efektli İngilizce başlık + telefon maketi; ekran yalnızca yer tutucu) ve ondan **temiz zemin**
      (`store/base/<ios|play>-NN.png`: yazı, telefon ve tüm ön plan öğeleri kaldırılmış) ile **ön katman** (`front-<ios|play>-NN.png`: yalnızca karakter/rozet/kart/süs, magenta zeminde üretilip `panel/store_key.py` ile şeffaf). App Store iPhone 1242×2688, Play Store Android maket 1080×1920. Kayıt `store.json` → `base[]` (`files`, `concept`).
      **Referans okuma** (2026-11-10, kullanıcı kararı): referanslar birebir kopyalanmaz ama yazı dili (uzunluk, ton, büyük/küçük harf, alt yazı),
      tipografi (font türü, kalınlık, efekt ya da düzlük), düzen (başlık yeri, telefon sayısı/açısı/perspektifi, kareler arası panoramik telefon,
      taşan UI kartları) ve görsel dil (zemin türü, süs stili, derinlik) önce bir kez çözümlenir → `store.json` → `styleBrief`; tüm karelerin brief'i buna uyar.
      Renk: kullanıcı palet seçtiyse yalnızca palet. `store-figma` da kurarken `styleBrief` + referanslara bakar (2b'deki varsayılan düzen kuralları yalnızca referans yoksa geçerli).
   b) `store-figma` (Opus): Figma'da **Store** sayfası (yoksa oluştur); Section "App Store 1242×2688" ve "Play Store 1080×1920"; her dil bir satır
      (English en üstte, her yeni dil 200 px altına), kareler soldan sağa 40 px arayla, frame adı Türkçe (aşağıdaki adlandırma kuralı). Hedef görsele (concept) bakarak kur:
      1) Frame dolgusu = temiz zemin (upload_assets bir kez; hash'i `base[].figmaHash.<platform>`'a yaz).
      2) **Telefon:** "Store/Phone iPhone" ve "Store/Phone Android" component'lerini bir kez kur (gövde, çerçeve, Dynamic Island / ortalı kamera deliği, gölge);
         içindeki ekran alanına `base[].screen` ekranının **Figma'daki gerçek frame'inin kopyası** konur (ölçekle sığdır, kırp, OpenAI ekranı kullanma).
         Konum, ölçek ve eğim hedef görseldeki telefonla aynı olsun. **Ön katman** (2026-11-10, kullanıcı kararı): temiz zeminde karakter/insan/rozet/kart/süs YOKTUR; bunlar `store-generate` tarafından `store/base/front-<ios|play>-NN.png` (`base[].front`) olarak tam kare boyutunda şeffaf PNG üretilir. Katman sırası: zemin → telefon → **ön katman** (kare boyutunda, x=0 y=0, `Ön katman` adıyla, upload_assets bir kez) → çipler/başlık. Öğeleri zeminden kesmeye/elle ayırmaya çalışma. Ön katmandaki bir öğe ekranın ortasını kapatıyorsa telefonu hedefe göre biraz kaydır; yine olmuyorsa notta belirt. Eski kayıtlarda `front` yoksa yalnızca bu durumda OpenAI ile şeffaf PNG üret.
      2b) **Düzen** (2026-11-09, kullanıcı kararı): başlıklar sırayla bir **üstte** bir **altta** (tek kareler üst, çift kareler alt — hedef görseldeki gibi);
         telefonlar **muntazam**: dik ya da en fazla 5–8° eğik (**istisna** 2026-11-10: referans/not açılı telefon istiyorsa 12–25° döndür ve `relativeTransform` ile hafif skew vererek 3B perspektif hissi ver; kareler arası taşan panoramik telefon ve ekrandan dışarı taşan UI çipleri serbest), yatayda ortalı, serideki tüm karelerde aynı boyut (genişliğin ~%70'i), ekran tamamen görünür,
         ekranın üstüne süs/el binmez. Ekranlar panelin önerdiği en dolu ekranlardır (`panel/screen_density.py`).
         **Telefon oranı standart** (2026-11-09): iPhone maketi gerçek iPhone oranında (ekran 393×852 pt ≈ 1:2.17, ör. maket ~860×1760 px karede),
         Android maketi ~1:2.2; uzun/esnetilmiş telefon yok. Uzun ekranın yalnızca ÜST kısmı görünür (ekran kopyası telefona genişlikte sığdırılır,
         üstten hizalanır, alt kısım maske/clip ile kesilir). Hedef görseldeki telefon daha uzunsa yine de standart oranı kullan.
      3) **Başlık:** hedef görseldeki başlık ve alt yazıyı **metin katmanı** olarak klonla; tipografi efektli olsun, düz değil: kalın yuvarlak display font
         (DESIGN.md ya da yakın Google fontu), kalın dış kontur (stroke), degrade dolgu, katmanlı drop shadow ile 3D derinlik, hafif eğim, vurgulu kelime renkli
         hap/çıkartma şekli üstünde, gerekirse ışıltı süsleri. Metni hedeften birebir al; `store.json` → `copy.English[NN] = { headline, highlight, sub }`.
      4) Her kareyi dışa aktar: `get_screenshot` (nodeId = frame, maxDimension = uzun kenar) URL → `curl -sfL -o projects/<proje>/store/English/<ios|play>-NN.png`
         → `sips -z <h> <w>`; `store.json` → `frames[]` (`{ id, lang, screen, files }`) ve `figma.nodes.English.NN = { ios, play }`. Hedefle yan yana kontrol et.
   c) `store-translate` (Sonnet): `job.langs` için English satırını kopyala (aynı Section, yeni satır), yalnızca metinleri doğal pazarlama çevirisiyle değiştir
      (birebir değil; vurgulu kelime(ler)i koru, taşarsa punto küçült). Font betik desteği: Türkçe/Latin/Kiril → proje fontu (glif yoksa Noto Sans);
      日本語 Noto Sans JP, 한국어 Noto Sans KR, 简体中文 Noto Sans SC, हिन्दी Noto Sans Devanagari (soldan sağa). `copy.<Dil>`, dışa aktarma ve kayıtlar (b) gibi.
   d) `store-play` (Opus): Play Store'u App Store'dan türet — OpenAI yok. Panel temiz zeminleri 9:16 kırpıp `store/base/play-NN.png` yazar.
      Store sayfasında Section "Play Store 1080×1920" (yoksa oluştur), `job.langs` her dil bir satır (English önce). Her `<Dil>/ios-NN` için `<Dil>/play-NN`:
      zemin = play temiz zemini; telefon "Store/Phone Android" component'i (yoksa kur: ortalı kamera deliği, ince eşit çerçeve, standart ~1:2.2 oran),
      içinde aynı gerçek ekran kopyası (genişliğe sığdır, üstten hizala, alt kırp); başlık bloğu aynı dilin iOS karesinden kopyalanır, orantılı küçültülür,
      aynı üst/alt sırası; kenar boşluğu ≥ 88 px, kırpma kapalı. Dışa aktar `store/<Dil>/play-NN.png` (1080×1920), `frames[].files.play`, `figma.nodes.<Dil>.NN.play`.
   e) `store-banner` (Opus): tanıtım/kapak görseli (`job.banner = { w, h, name }`, ör. Play kapak 1024×500). **Sıfırdan üretme, OpenAI yok**: mevcut kareler
      içinden en güçlü olanın temiz zeminini (`store/base`), bir ya da iki telefon maketini (gerçek ekran kopyası) ve o dilin en iyi başlığını kullan;
      yatay düzen: başlık solda/ortada büyük, telefon(lar) sağda hafif eğik, zemin kırpılarak genişletilir. Section "Tanıtım <w>×<h>", her dil bir satır.
      Dışa aktar `store/<Dil>/banner-<w>x<h>.png`, `store.json` → `banners[] = { lang, name, w, h, file }`.
      **İki aşama** (2026-11-09, kullanıcı kararı): `job.phase = "english"` → yalnızca İngilizce satırı tasarla (Opus); kullanıcı beğenince
      `job.phase = "clone"` → İngilizce kareyi `job.langs` için kopyala, yalnızca metinleri çevir (store-translate kuralları, Sonnet). Görsele dokunma.
      `job.banners` birden çok ölçü içerebilir (her biri `{ w, h, name }`, ayrı Section); hepsini aynı işte yap.
      Hazır ölçüler: App Store Header 3840×1646, App Store Search Result 3840×2560, Play kapak 1024×500. Büyük kareleri `get_screenshot` maxDimension 3840 ile al.
   f) `store-add-frame` (2026-11-09): mevcut setin sonuna yeni kare `job.frame` (NN). `phase: "english"` (Opus): `job.screen` ekranıyla İngilizce
      App Store + Play Store karesini kur — OpenAI yok; zemin olarak mevcut temiz zeminlerden ekrana en uygun olanı (ya da ekranın kendi sahne görseli)
      kullan, telefon component'leri ve başlık stili serideki diğer karelerle aynı, üst/alt sırası serinin devamı. Başlığı ekrana göre yaz (`copy.English[NN]`),
      `base[]`'e kayıt, `frames[]`, `figma.nodes.English.NN`, PNG'ler. `phase: "clone"` (Sonnet): NN karesini `job.langs` satırlarına kopyala, metni çevir (c kuralları).
      `job.note` varsa uygula.
   **Figma'da adlandırma Türkçe** (2026-11-09, kullanıcı kararı): kare ve satır adları Türkçe dil adıyla yazılır:
   English→İngilizce, Türkçe→Türkçe, Deutsch→Almanca, Español→İspanyolca, Français→Fransızca, Italiano→İtalyanca, Português (Brasil)→Portekizce (Brezilya),
   Русский→Rusça, 日本語→Japonca, 한국어→Korece, 简体中文→Çince, हिन्दी→Hintçe. Biçim: `<Türkçe dil> / App Store 01`, `<Türkçe dil> / Play Store 01`,
   `<Türkçe dil> / Tanıtım 1024×500`. `store.json`'daki dil anahtarları değişmez (English, Deutsch…).
   Görsellere dokunma; değişiklik yalnızca metin. Panel PNG'leri `store/<Dil>/` altından gösterir ve zip'ler.

8. **Yazılımcı notları** — `dev-notes` (Sonnet; `job.note` varsa ek istek): her ekran frame'inin **altına**, aynı Section içinde, 430 px genişlikte
   bir not kartı ("Dev Note / <ekran id>", ekranın 40 px altı, sol kenarı hizalı; açık sarı #FFF8DC zemin, 16 px iç boşluk, Inter 14/20, koyu metin;
   auto layout, yükseklik HUG). İçerik (kısa maddeler, Türkçe):
   **Amaç** · **Giriş** (hangi ekrandan/aksiyondan gelinir) · **Etkileşimler** (her buton/dokunma alanı → sonuç veya hedef ekran id) ·
   **Durumlar** (boş/yükleniyor/hata/kilitli, ilgili ekran id'leri) · **Dinamik veri** (sayaç, süre, para, metin değişkenleri) ·
   **Asset'ler** (kütüphane adı ya da manifest id) · **Animasyon/geri bildirim** · **Uç durumlar**.
   Kaynak: `flow.md` (bağlantılar), bölüm başına tek salt-okuma `use_figma` (buton/metin adları), `library.json`, `assets/manifest.json`. Uydurma kural yazma;
   bilinmeyeni "Belirsiz: …" diye işaretle. Not frame id'sini `figma.json` → `screens[id].devNote`'a yaz; varsa aynı kartı güncelle, ikinci kart açma.
   Section yüksekliğini notları kapsayacak şekilde uzat. Ekranların kendisine dokunma, önizleme alma.

9. **Hazır tasarımı içe aktarma** — `import-figma` (Sonnet; proje `imported: true`, FigJam yok): tasarım bitmiş, **hiçbir ekrana dokunma**.
   `project.json` → `figmaKey` (ve varsa `importNode` = kullanıcının verdiği sayfa/node). Tek salt-okuma `use_figma` ile sayfaları listele, sonra
   ekran sayfası başına tek çağrıda üst düzey ekran frame'lerini topla (Section içindekiler dahil; component, not kartı, 300 px'ten dar frame'ler hariç):
   id, ad, Section/sayfa adı, x/y, w/h. `importNode` varsa yalnızca o sayfa/Section. `flow.md` yaz: Section (yoksa sayfa) = bölüm (başlık tek kelime: `## 01-<bolum-slug>`, ör. `## 02-ana-ekran`),
   frame'ler soldan sağa/yukarıdan aşağıya sırayla, satır biçimi ``- `<id>` — 01-02 — <frame adı>`` (id: frame adından slug, benzersiz).
   `figma.json` → `fileKey`, `screens[id] = { id: <node>, status: "built" }`. Önizleme: her frame için `get_screenshot` (maxDimension 930) URL'si →
   `curl -sfL -o projects/<proje>/previews/<id>.png`. DESIGN.md yoksa yazma (ilk düzenleme işinde gerekirse ekranlardan çıkarılır).

`screen-edit` / `screen-add` işinde `job.images` varsa (proje klasörüne göreli `references/attach-*` yolları) bunlar kullanıcının
o istek için eklediği referans görsellerdir: Read ile bak, notla birlikte uygula.
**Referans görsel varsa referans kazanır** (2026-11-05, kullanıcı kararı): kullanıcı "birebir/aynısı" diyorsa ya da görsel eklediyse hedef referansla
görsel olarak aynı sonuçtur. DESIGN.md ve mevcut component'lerle çelişen yerde referansa uy ("yeni tasarım kararı" gerekçesiyle öğe atlama;
gerekirse DESIGN.md'ye not düş). Yerleşim, ölçü, renk, metin ve sırayı referanstan ölç (piksel oranıyla 430 genişliğe çevir).
Çizim/3D/parlama gibi vektörle aynısı yapılamayan öğeleri (ikon, kutu, karakter, araç, rozet süsü) **OpenAI ile üret** (2026-11-05, kullanıcı kararı;
referanstan kırpma yok): öğeyi `assets/manifest.json`'a ekle, `refImage` = referans görselden o öğenin kırpıntısı (`python3` + PIL,
`assets/crops/<ekran>-<öğe>.png`, yalnızca üretime girdi, ekrana konmaz), prompt "aynı öğeyi aynı stil, renk ve açıyla, yüksek çözünürlükte
yeniden çiz"; `quality: high`. `fill-images.mjs` → upload_assets → alanın görsel dolgusu. Şeffaf zemin gereken öğede sahte dama deseni çıkarsa temizle.
Metin, buton, kart, sayaç gibi UI öğeleri düzenlenebilir frame/text kalır. İş tek seferde bitsin; bitince önizlemeyi referansla yan yana kontrol et,
fark kalırsa düzelt, raporda yalnızca gerçekten kalan farkları yaz.

**Otomatik başlatma (2026-10-26, kullanıcı onayı):** panelde iş açılınca sunucu arka planda
`claude -p "<Proje> panelindeki işi yap…"` çalıştırır (izinler: dosya düzenleme, Figma MCP, node/python3/curl; `.env` okuma yasak).
Günlük `projects/<uygulama>/runs/*.log`; Claude işi bitirmeden çıkarsa `job.runner.exitCode` yazılır, panel "Yeniden başlat" gösterir.
Arka planda soru sorulamaz: karar gerekiyorsa `progress.mjs error` ile nedenini yaz ve dur. Kapatmak: `PANEL_AUTORUN=0 node panel/server.mjs`.

Referans görsel üretimi (OpenAI, `generate-references`) bu akışta **kullanılmıyor**; kod `panel/generate-references.mjs` içinde duruyor.

**İlerleme (zorunlu):** Panelden gelen her işin `job.steps` listesi vardır; panel bunu dönen göstergeyle canlı gösterir.
İşi yaparken her adımda tek satır çalıştır (ucuz, Figma'ya dokunmaz):
`node panel/progress.mjs <proje> start <n> [not]` → adım bitince `done <n> [not]`, hata olursa `error <n> <not>`,
listede olmayan bir adım gerekirse `add <etiket>`. İş tamamen bitince `job`'u elle silme, `node panel/progress.mjs <proje> finish` çalıştır.
Job'da `steps` yoksa önce `add` ile adımları ekle.

“&lt;Proje&gt; panelindeki işi yap” denince yalnızca o projenin klasörünü oku ve `job` neyse onu yap.

## Kütüphane (kullanıcının asset'leri) — 2026-11-05, kullanıcı kararı

Kullanıcı hazır asset'lerini panelden yükler: `projects/<proje>/library.json` → `items: [{ id, name, kind (asset|character|icon|background|ui), note, file }]`,
dosyalar `assets/library/`. Ayrıca Figma dosyasında **"Kütüphane"** adlı sayfaya kendi component'lerini koyabilir.
Her tasarım işinde (design-references, design-rest, screen-add, screen-edit, audit-fix) **önce kütüphaneye bak**:
- Ekrana gereken her görsel öğe için `library.json`'da ad/not/tür eşleşmesi ara (ör. "kırmızı araç", "coin", "kutu"). Eşleşen asset'i **olduğu gibi** kullan;
  değiştirme, yeniden üretme, kırpma. PNG/JPEG/WebP → upload_assets ile bir kez yükle, dönen `imageHash`'i item'a `figmaHash` olarak yaz ve sonraki
  her kullanımda aynı hash'i ver (tekrar yükleme). SVG → `figma.createNodeFromSvg`, ilk kullanımda component yap, node id'sini `figmaNode` olarak yaz.
- Figma'daki "Kütüphane" sayfasında uygun component varsa yenisini kurma, instance'ını kullan; id'lerini `figma.json` → `userComponents`'e yaz.
- Yalnızca kütüphanede karşılığı olmayan öğeyi OpenAI ile üret (aşağıdaki kurallar). Raporda hangi öğe kütüphaneden, hangisi üretildi yaz.

## İkonlar (2026-11-05, kullanıcı kararı)

Uygulama ikonları **yalnızca Lucide**'den alınır (https://lucide.dev/icons), elle çizilmez, başka set kullanılmaz.
SVG: `curl -sL https://unpkg.com/lucide-static@latest/icons/<ad>.svg`. `figma.createNodeFromSvg` ile eklenir, renk/kalınlık token'a bağlanır,
sık kullanılanlar component yapılır. Referans görseldeki çizim/3D ikonlar bu kuralın dışında: OpenAI ile referansa göre üretilir.

## Kredi kuralları

**Bağlamı küçük tut (2026-11-03, kullanıcı kararı — panel işleri her adımda tüm bağlamı yeniden okur):**
- Skill'lerden yalnızca SKILL.md'yi yükle; `references/` dosyalarını yalnızca o API'ye gerçekten takılınca, `grep` ile ilgili bölümü oku. `plugin-api-standalone.d.ts`'yi asla bütün okuma.
- `use_figma` dönüşü kısa olsun: yalnızca id, sayı ve hata. Ağaç, metin dökümü ya da büyük JSON döndürme.
- `get_screenshot` işin sonunda ekran başına bir kez, küçük ölçekte. Ara kontrol için yapısal dönüş yeterli.
- Dosyaları bir kez oku; flow.md, manifest gibi uzun dosyalarda yalnızca ilgili satırları `grep` ile al.
- `screen-edit` / `screen-add` / `audit-fix`: yalnızca ilgili ekranı oku ve düzenle; DESIGN.md'nin yalnızca ilgili bölümüne bak.
- Panel modeli: `design-references`, `design-rest` Opus, diğer işler Sonnet (`panel/server.mjs` → `JOB_MODELS`).

- Figma'dan okumadan önce `figma.json`'a bak; id oradaysa tekrar arama/okuma yapma.
- `get_screenshot` yalnızca bir ekranı bitirince doğrulama için, küçük ölçekte.
- Toplu işleri tek `use_figma` çağrısında yap; ekran ekran ayrı ayrı okuma döngüsü kurma.

## Figma kuralları

- `use_figma` öncesi `figma:figma-use` skill'ini yükle; ekran kurarken `figma-generate-design`, component kurarken `figma-generate-library`.
- Yazma yetkisi "Tunahan AVŞAR's team" (Pro) içinde; hata olursa `whoami`.
- Ekran: 430 px genişlik, yükseklik HUG + min 930, dikey auto layout, kenar boşluğu 16 px. Her flow bölümü ayrı Section;
  frame'ler soldan sağa 20 px arayla. Section zemini #444444, sayfa zemini #1E1E1E (kullanıcı Figma’da elle ayarladı, 2026-10-26 — yalnızca sunum). Auto layout zorunlu; absolute yalnızca üst üste binen öğelerde.
