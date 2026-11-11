# Pocket Factory — DESIGN.md (v2)

Tek tasarım kaynağı. Kaynak: Figma "Ekranlar v2" (58:1065) + "Components v2" (58:1064), FigJam V4 referans panosu.
v1 (krem panel + kurdele + robot Pito + karartılmış fabrika sahnesi) `DESIGN-v1.md`'de arşivde; **v2'de kullanılmaz**.

Tarz: parlak, tombul, 3D/cartoon casual mobil oyun. Mavi gökyüzü degradesi zemin, üstünde açık krem kartlar ve lacivert
çerçeveli "basılabilir" butonlar. Rehber karakter: **baretli işçi çocuk** (sarı baret, mavi tulum, beyaz gömlek).

## Renk token'ları (Figma variable koleksiyonu `PF v2 Tokens`, VariableCollectionId:58:1036)

| Token | Hex | Kullanım |
|---|---|---|
| `color/sky/top` | #2F7FE3 | ekran zemini degradesi üst |
| `color/sky/bottom` | #9ED3F7 | ekran zemini degradesi alt |
| `color/navy/900` | #1B2F6B | oyun ekranı zemini, kart/buton kontur ve 3D alt gölgesi, kart başlığı vurgu |
| `color/navy/700` | #2B4FA3 | kilitli öğe zemini, ikincil mavi yüzey |
| `color/cream/50` | #FFF7F2 | kart, modal, HUD hapı, ikon butonu zemini |
| `color/cream/100` | #F6E9E1 | ikincil buton, menü satırı, kart içi kutu |
| `color/cream/stroke` | #E3D2C8 | krem yüzey konturu ve alt dudağı |
| `color/ink/900` | #1E2230 | kart üstü başlık/metin |
| `color/ink/500` | #5B6072 | kart üstü ikincil metin |
| `color/green/500` | #35B93A | birincil buton (Üretimi Başlat, Başla, Tamam) |
| `color/green/700` | #1C8A26 | yeşil buton alt dudağı |
| `color/orange/500` | #FF8B1F | vurgulu eylem (Devam, Oyna, Yeniden Başlat), aktif bölüm, vurgu çerçevesi |
| `color/orange/700` | #D75F00 | turuncu buton alt dudağı |
| `color/gold/400` | #FFC425 | yıldız, coin, ilerleme çubuğu, ipucu vurgusu |
| `color/red/500` | #E8413A | hata ekranı zemini (degrade #E8413A → #F6E9E1), uyarı |
| `color/scrim` | #141A33 | modal arkası karartma (opacity ~0.75) |
| `color/white` | #FFFFFF | zemin üstü başlık, buton metni |

Token dışı renk kullanma.

## Tipografi (tek aile: **Baloo 2**, Türkçe tam destek)

- **Ekran başlığı (zemin üstü):** Baloo 2 ExtraBold 30–32, beyaz, lacivert (#1B2F6B) kontur/gölge 0 3 0.
- **Büyük kutlama başlığı:** Baloo 2 ExtraBold 38–42, beyaz ya da navy/900 (açık zeminde).
- **Kart başlığı:** Baloo 2 ExtraBold 22–24, `ink/900`.
- **Buton:** Baloo 2 ExtraBold 20 (L) / 18 (M); yeşil/turuncu üstünde beyaz, krem üstünde `ink/900`.
- **Gövde:** Baloo 2 SemiBold 16–18 / 22, `ink/900` ya da `ink/500`, ortalı.
- **Etiket / küçük:** Baloo 2 SemiBold 14, `ink/500`.
- **Büyük sayı (ödül):** Baloo 2 ExtraBold 42–54.
- Lilita One kullanılmaz (Ğ/Ş/İ/ı yok).

## Ölçü

- Ekran 430 × min 930, dikey auto layout, yatay kenar 16, alt safe area 34.
- Boşluk ölçeği: 4 · 8 · 12 · 16 · 20 · 24.
- Köşe: buton 18, kart 20, modal 24–28, ikon butonu 16, kapat düğmesi tam yuvarlak, oyun tahtası karosu 16.
- Kontur: krem yüzeyde 2 px `cream/stroke`; buton ve oyun kartında 2–2.5 px `navy/900` ya da `ink/900`.
- 3D his: blur'suz alt gölge (0 4–6 0) — buton renginin `/700` tonu ya da `navy/900`; üstte beyaz iç parlama (inner 0 3 0, %35).
- Dokunma alanı ≥ 48 (Button L 64, M 52; IconButton 64; CloseButton 52).

## Component'ler (Figma sayfası `Components v2`, 58:1064)

- `Button` (58:1121) — `Variant=Primary|Orange|Secondary`, `Size=L|M`; 360×64 L, köşe 18. Primary yeşil, Orange turuncu, Secondary krem (`cream/50` + `cream/stroke` dudak). Sağda isteğe bağlı ikon (play, arrow-right, rotate-ccw).
- `IconButton` (58:1122) — 64×64 krem kare, köşe 16, `ink/900` ikon (pause, back, undo, redo, settings).
- `CloseButton` (58:1126) — 52 px yuvarlak krem, `x` ikonu; modalın sağ üst köşesine biner.
- `MenuButton` (58:1130) — 330×64 `cream/100` satır, solda ikon + metin (Duraklat menüsü, Ayarlar).
- `RewardPill` (58:1135) — beyaz hap, coin/yıldız görseli + "+50".
- `Icon/*` — Lucide 24 px: play, rotate-ccw, rotate-cw, settings, house, x, undo-2, redo-2, pause, chevron-right, arrow-right, arrow-left, globe, clipboard-list, store, lock, volume-2, music, vibrate, circle-check, languages.

## Ekran kalıpları

1. **Açılış/kutlama/tanıtım:** gökyüzü degradesi (ya da bulut-ışın `result-bg` görseli) → üstte beyaz başlık → ortada kahraman görseli → açıklama kartı → altta tam genişlik buton.
   Tanıtım için ayrı şablon var, aşağıdaki "Tanıtım şablonu"na bak.
1a. **Tanıtım şablonu (intro-1/2/3, 2026-11-06, kullanıcı kararı):** ekran zemini `cream/50`, dikey auto layout, boşluk -32 (kart sahneye biner).
   - Üst: `img/introN-scene` 430×600 tam genişlik 3D sahne (OpenAI, quality high, splash ile aynı dünya; her ekrana ayrı). Sahne altında
     `Wave` vektörü (`cream/50` %60) yumuşak dalga geçişi verir.
   - Sağ üst (sahne üstünde, absolute, y 56): `SkipButton` "Atla" hap — `cream/50` %94 zemin, 2 px `navy/900` kontur, Baloo 2 Bold 17 `ink/900`, yükseklik 48. Son tanıtımda yok.
   - Alt: `Card` — `cream/50`, üst köşeler 32, iç boşluk 28/24/34/24, aralık 12, ortalı: `StepBadge` (`gold/400` hap, "ADIM N/3", Baloo 2 ExtraBold 14 `navy/900`) →
     başlık (Baloo 2 ExtraBold 32/36 `ink/900`, iki satır, bir kelime `orange/500`) → gövde (SemiBold 17/24 `ink/500`, en fazla 2 satır) →
     `PageDots` (10 px `cream/stroke`, aktif 28×10 `orange/500`) → tam genişlik `Button` Orange L ("Devam →" / son ekranda "Başla").
   - intro-3: sahnedeki üç ürünün altında `StepLabel/*` hapları (Şekillendir / Boya / Paketle; krem, 2 px `navy/900` kontur, ExtraBold 14).
2. **Oyun ekranı:** `navy/900` zemin → HUD (solda IconButton pause, ortada "Bölüm N" + alt başlık, sağda "Hamle: N" krem hap) →
   Hedef kartı (araba ikonu + hedef, Üretim Sırası: Şekillendir › Boya › Paketle) → oyun tahtası görseli (krem ızgara, 3D makineler) →
   rehber balonu (işçi çocuk avatarı + ipucu metni) ya da alt kontrol satırı (undo, redo, ipucu "100") → birincil "Üretimi Başlat".
3. **Modal:** oyun ekranı + scrim → krem kart (köşe 24, `cream/stroke`), başlık, içerik, birincil + ikincil buton; sağ üstte CloseButton ya da ikincil "Vazgeç/Kapat".
4. **Ana menü/fabrika:** gökyüzü + fabrika sahnesi görseli, üstte ayarlar + coin/yıldız hapları, logo ya da başlık, turuncu "Oyna/Devam Et", alt menü (Dünyalar, Görevler, Mağaza, Ayarlar).
5. **Liste (dünya/bölüm seçimi):** `navy/900` zemin, geri butonu + başlık, krem kartlar; kilitli öğe `navy/700` + lock ikonu.

## v2.1 iç ekran şablonları (2026-11-06, kullanıcı kararı — intro-1/2/3 dilinden)

Tüm iç ekranlar intro dilini taşır: kenardan kenara 3D sahne + `Wave` yumuşak dalga + üst köşeleri 32 krem `Card`,
gold `StepBadge` hap, Baloo 2 ExtraBold 30–32/36 başlık (bir kelime `orange/500`), turuncu tam genişlik `Button` Orange L,
ikincil eylem krem hap. Düz degrade zemin, ortada küçük görsel ve boş alan bırakılmaz. Ortak ölçüler:
- **Üst çubuk (`TopBar`)** — her ekranda aynı: y 56, yatay 16, yükseklik 64. Sol: `IconButton` 64 (pause/back/settings);
  orta: `TitlePill` (`cream/50` %94, 2 px `navy/900`, köşe 999, iç 6/20; Baloo 2 ExtraBold 20 `ink/900` + SemiBold 14 `ink/500` alt başlık);
  sağ: `StatPill` (aynı hap dili, 48 yükseklik; "Hamle: N" ya da coin/yıldız `RewardPill`).
- **Kart köşeleri:** sahne-altı `Card` üst 32; modal kartı 32; iç kutu/çip 20; buton 18; hap 999.
- **Buton boyları:** birincil 64 (L, tam genişlik 382), ikincil krem hap 52; tek ekranda tek turuncu/yeşil birincil.
- **Birincil renk (v2.1):** iç ekranlarda birincil eylem dahil "Üretimi Başlat" artık `Button` Orange L (intro ile aynı); yeşil Primary
  varyantı component'te duruyor ama ekranlarda kullanılmıyor.
- **Görseller:** `img/game-stage` (tüm oyun ekranları), `img/menu-scene`, `img/factory-home-scene`, `img/worlds-header`, `img/levels-header`,
  `img/modal-order|pause|hint|lock`, `img/scene-success|reward|error|world-complete|new-world|new-machine|final` — manifest'te `figmaHash` ile.

1. **Oyun ekranı (`Stage + Card`):** zemin `cream/50`, dikey, aralık -32.
   - `Stage` 430 × ~560: `img/game-stage` (fabrika salonu, ortası sakin) dolgu; içinde TopBar, altında 398×300 tahta görseli
     (`BoardFrame`: köşe 24, 4 px beyaz kontur, `navy/900` 0 6 0 alt gölge). Altta `Wave`.
   - `Card`: `StepBadge` ("HEDEF" ya da durum), başlık (hedef, ürün adı turuncu), `Recipe` çip satırı (52 yükseklik krem `cream/100`
     çipler, ikon + etiket, aralarında `›`), rehber balonu (işçi çocuk avatarı + metin, `cream/100` köşe 20) ya da `Controls`
     (undo/redo/ipucu), birincil buton. Vurgu (Highlight, el, Toast, rozet) tahtanın üstünde absolute kalır.
2. **Modal:** arkada oyun ekranı aynen kalır, üstünde `Scrim` (`color/scrim` %55) + arka içerikte 6 px layer blur.
   `ModalCard` 382 genişlik, köşe 32, `cream/50`, 2 px `cream/stroke`, `navy/900` 0 8 0 alt gölge, clip: üstte 382×190 sahne
   (`img/modal-*`) + Wave, altında içerik (iç 8/24/24/24, aralık 12, ortalı): StepBadge → başlık 30/34 (turuncu kelime) → gövde →
   içerik (çip/menü/ayar satırları) → Orange L buton → ikincil krem hap ("Vazgeç/Kapat/Fabrikaya Dön"). `CloseButton` sahnenin sağ üstünde.
3. **Ödül/kutlama/hata (`Scene + Card`):** intro şablonunun aynısı: `img/scene-*` 430×600, sahne üstünde ortalı yıldız/başlık rozeti
   gerekirse; `Card`: StepBadge → başlık → gövde → `RewardRow` (krem `cream/100` köşe 20 kutular, coin/yıldız + sayı) → Orange L → ikincil hap.
   Hata ekranında badge `red/500` zemin beyaz metin, başlık vurgusu `red/500`.
4. **Seçim listesi:** üstte 430×330 `img/*-header` sahne + TopBar (back + TitlePill) + Wave; altında `Sheet` (`cream/50`, üst köşe 32, aralık 12):
   açık öğe beyaz-krem kart + turuncu 3 px kontur, kilitli öğe `cream/100` + lock ikonu %60 opaklık görsel; bölüm ızgarası 5 sütun 64 hücre.
5. **Menü (ana menü / fabrika):** kenardan kenara 430×930 sahne (`img/menu-scene`, `img/factory-home-scene`); TopBar (settings + coin/yıldız);
   logo ya da başlık sahne üstünde; altta krem `Card` (üst köşe 32): ilerleme (StepBadge + dünya adı + çubuk) → Orange L "Oyna/Devam Et" →
   `NavRow` 4 krem hap ikon butonu (Dünyalar, Görevler, Mağaza, Ayarlar).

## Görseller (img/<id>)

Ortak stil: `Bright glossy 3D cartoon casual mobile game art, toy factory world, soft rounded chunky shapes, saturated primary
colors (red, blue, yellow, green, orange), warm soft studio lighting, clean, high detail, Pocket Factory style. Transparent background, no text.`
- Rehber karakter her yerde aynı işçi çocuk (`intro1-worker`, `worker-avatar`).
- Oyun tahtası: krem ızgara zeminde gri bant, sarı yönlendirici karolar, 3D makineler (şekillendirme sarı, boya kırmızı, paket turkuaz).
- Kahraman görselleri şeffaf zeminli tek nesne; metin, harf, logo yok.

## Yapma listesi

- v1 dilini (kurdele başlık, krem panel + karartılmış fabrika sahnesi, robot Pito, Lilita One) geri getirme.
- Düz, flat butona dönme: her buton blur'suz alt dudaklı olmalı.
- İnce/kurumsal font kullanma; yalnızca Baloo 2.
- Krem kart üstünde beyaz metin, açık zemin üstünde düşük kontrastlı metin kullanma.
- Kapat/geri yolu olmayan modal yapma.
- Tek ekranda birden fazla yeşil birincil buton yapma.
- 48 px'ten küçük dokunma alanı, 14 px'ten küçük metin yok.
- İngilizce metin bırakma — tüm arayüz Türkçe.
- Görsel ile metin çelişmesin (ör. görev "araba" diyorsa tahtada araba olsun; "Ayırıcı Bant" görseli ayırıcı bant olsun).
- Görsel alanına placeholder bırakma; sahte dama desenli şeffaflık bırakma.
