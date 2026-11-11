# Femia_V2 — DESIGN.md

Adet ve hamilelik takibi uygulaması (iOS, 430 px). Tek tasarım kaynağı budur.

**Kaynak:** FigJam'deki 5 referans görsel (5:581–5:585, kopyaları `references/`). Marka kütüphanesi kullanılmıyor (2026-10-30 revizyonu,
kullanıcı notu). Dil: açık pembe zemin, yumuşak pembe/lila cam yaprak-çiçek illüstrasyonları, kalın koyu mürdüm sans başlıklar,
gül rengi pill butonlar (yumuşak pembe gölgeli), beyaz yuvarlak kartlar, küçük "femia" logosu üstte ortada.
Ek kurallar: taste-skill (app-screen ev kuralları), web-interface-guidelines (Figma tablosu).

## Renk tokenları (Figma collection `Femia/Color`)

| Token | Değer | Kullanım |
|---|---|---|
| `bg/canvas` | #FFF4F7 | Tüm ekran zemini (açık pembe; beyaz zemin yok) |
| `bg/surface` | #FFFFFF | Kart, liste grubu, input, sheet |
| `bg/sunken` | #FCE8EE | Ton adımı: seçilmemiş chip/segment, ilerleme izi, ikon dairesi, bilgi kutusu |
| `text/primary` | #2A1730 | Başlık ve okunan metin (koyu mürdüm) |
| `text/secondary` | #5B4760 | İkincil metin, değer |
| `text/tertiary` | #7A6479 | Açıklama, meta (canvas üzerinde 4.98:1) |
| `text/on-primary` | #FFFFFF | Gül üstü metin |
| `brand/primary` | #C2436D | Birincil CTA, aktif sekme, seçili durum, toggle açık, logo yaprağı, metin linki (beyaz üstünde 4.86:1) |
| `brand/primary-pressed` | #A6355A | Basılı |
| `brand/primary-soft` | #FBDDE7 | Seçili chip zemini, regl günleri, vurgu yüzeyi |
| `phase/fertile` | #7B5FC0 | Doğurgan dönem (lila) — yalnızca veri |
| `phase/fertile-soft` | #EEE7FA | Doğurgan dönem zemini, nötr bilgi kutusu |
| `phase/ovulation` | #B4562E | Yumurtlama (şeftali) — yalnızca veri |
| `phase/ovulation-soft` | #FDE8DC | Yumurtlama zemini |
| `line/field` | #F1DCE4 | Input/kontrol ve ikincil buton kenarı |
| `state/error` | #C0321E | Hata, yıkıcı eylem |
| `state/error-soft` | #FCE3DF | Hata zemini |
| `state/success` | #2F7D55 | Başarı |
| `scrim` | #2A1730, **node opacity 0.4** | Sheet/diyalog arkası (opaklık paint'e değil node'a) |

## Tipografi (text style `Femia/…`)

Tek aile: **Plus Jakarta Sans**. Başlıklar ExtraBold, sıkı harf aralığı. Tabular rakam: sayılar, saatler, yıllar.

| Stil | Ağırlık | Boyut/Satır | Kullanım |
|---|---|---|---|
| `Display` | ExtraBold | 32/38, -0.6 | Soru/karşılama başlığı — **ortalı** |
| `Title 1` | ExtraBold | 30/36, -0.5 | Sekme ekranı başlığı (sola dayalı) |
| `Title 2` | Bold | 22/28, -0.2 | Kart/sheet/diyalog başlığı |
| `Stat` | ExtraBold | 48/52, -1 | Büyük sayı (tabular) |
| `Headline` | Bold | 17/24 | Nav başlığı, liste grubu başlığı |
| `Body` | Regular | 16/24 | Gövde, satır etiketi, input değeri (≥16) |
| `Body Medium` | Medium | 16/24 | Satır etiketi vurgulu |
| `Callout` | Regular | 15/22 | Açıklama (soru ekranında ortalı) |
| `Caption` | Medium | 13/18 | Meta, yardımcı metin |
| `Button` | Bold | 16/20 | Buton etiketi |

Başlık en fazla 2 satır. Metinler cümle düzeninde (Türkçe), hitap "siz" (mevcut ekranlarla tutarlı).

## Logo

`Logo` component: küçük harf "femia" (Plus Jakarta Sans Bold 22, `text/primary`) + "i" üstünde gül yaprak (`brand/primary`).
Soru/onboarding/auth ekranlarında üstte ortada (NavBar Progress içinde). Sekme ekranlarında kullanılmaz.

## Boşluk & şekil

- Boşluk: 4 · 8 · 12 · 16 · 24 · 32 · 40 (variable `Femia/Space`). Ekran kenarı 16; bölümler arası 24–32; grup içi 8–12.
- Köşe: `sm 8` · `md 12` · `lg 20` (kart, liste grubu, input) · `xl 28` (sheet, diyalog, illüstrasyon alanı) · `full` (buton, chip, toggle, avatar, ikon buton).
- Butonlar **tam yuvarlak (pill)**, yükseklik 52; alt CTA ekran genişliğinde (FILL).
- Gölgeler (effect style): `Glow` — Primary buton: y 8, blur 20, #C2436D %28. `Soft` — beyaz kart/liste grubu: y 6, blur 24, #C2436D %8.
  `Float` — sheet/diyalog: y 12, blur 40, #2A1730 %16. Başka gölge yok.
- Ayırma: yüzeyler ton adımı + Soft gölge ile ayrılır. Liste grubunda satırlar arası 1 px `bg/canvas` boşluğu.

## Componentler (sayfa `🧩 Components`)

| Component | Varyant / özellik | Not |
|---|---|---|
| `StatusBar` | — | 430×54, saat 9:41 |
| `HomeIndicator` | — | 430×34 |
| `Logo` | — | "femia" + gül yaprak |
| `NavBar` | Type = Back / Close / Progress | Back/Close: beyaz daire ikon butonu 44 + başlık ortada; Progress: geri + ortada Logo ve gül ilerleme çubuğu |
| `Button` | Style = Primary / Secondary / Tertiary / Destructive × State | 52, pill; Primary Glow gölgeli; Secondary beyaz + `line/field` kenar |
| `IconButton` | Style = Plain / Filled | 44×44; Filled = beyaz daire + Soft gölge |
| `ListRow` | Trailing = Chevron / Toggle / Value / None | min 56, solda 32'lik pembe ikon dairesi |
| `Toggle` | On = true / false | 51×31 |
| `TextField` | State = Default / Focused / Error / Disabled | etiket üstte, 52 alan, `lg` köşe |
| `Chip` | Selected = true / false | 40 yükseklik, pill |
| `TabBar` | Active = Today / Calendar / Log / Reminders / Profile | ortadaki "+ Kayıt" gül daire |
| `WheelPicker` | — | 5 satır, seçili bant `brand/primary-soft`, seçili değer Title 2 |
| `Dialog` | — | `xl` köşe, Float gölge, başlık + gövde + 2 buton (dikey) |
| `Icon/*` | 24×24, 1.75 çizgi | Lucide tarzı çizgi ikonlar |

## Ekran kalıpları

- **Soru ekranı (03, 09):** NavBar Progress (Logo + ilerleme) → ortalı Display başlık + ortalı Callout → illüstrasyon (`img/…`, 398×~150, `xl`)
  → kontrol beyaz kart içinde (wheel / chip / seçenek kartları) → alt FILL Primary "Devam et" + Caption ipucu.
- **Sekme ekranı:** StatusBar → Title 1 başlık (sol) + sağda IconButton → içerik grupları (beyaz kart, Soft gölge) → TabBar.
- **Detay/form ekranı:** NavBar Back → form grupları (surface kart içinde ListRow / TextField) → alt Primary buton.
- **Onay (yıkıcı):** arkadaki ekran + scrim 0.4 + `Dialog`; yıkıcı eylem Destructive, iptal Secondary. Metin sonucu açıkça söyler.
- **Geçmiş/liste:** özet kartı (Stat + grafik) → tarih başlıklı gruplar → boş durum tasarlanır.

## Görseller (`img/<id>`)

Ortak stil: *soft dreamy 3D illustration of translucent glassy flower petals and lotus forms, blush pink #FBDDE7, rose #C2436D and
soft lavender tones, gentle glow and light, a few tiny pearl spheres, plain very light pink #FFF4F7 background, airy, minimal, centered, no text.*
Alanlar `img/<id>` adlı frame'dir (dolgu `bg/sunken` + ortada image ikonu, görsel gelince gizlenir); `assets/manifest.json`'a yazılır.
Cam/parıltı/degrade **yalnızca illüstrasyonun içinde** yaşar; arayüz yüzeyleri düzdür.

## Yapma listesi

- Gülü dekor, büyük alan dolgusu ya da ikon zemini olarak kullanma — eylem, seçili durum ve logo yaprağı içindir.
- Lila/şeftali faz tonlarını butonda kullanma; yalnızca faz ve veri.
- Beyaz ekran zemini, arayüzde gradient/glass/glow (illüstrasyon hariç), dekoratif hairline, emoji kullanma.
- Eyebrow (küçük büyük-harf etiket), monospace kullanma. Adım göstergesi yalnızca ilerleme çubuğuyla.
- Serif font kullanma; Plus Jakarta Sans dışına çıkma.
- 44 px altında dokunma alanı, 16 px altında input metni bırakma.
- `...` yerine `…`; "Yükleniyor…" biçimi. Buton etiketleri eylem söyler.
- Yıkıcı eylemi onaysız bırakma; her alt ekranın geri/kapat yolu olsun.
- Placeholder metin (lorem) ya da boş img alanı bırakma.

## Referans ekranlar (onaydan sonra klonlanacak)

| Kalıp | Referans ekran |
|---|---|
| Soru ekranı | `q-birth-year` |
| Sekme / ayar listesi | `profile` |
| Form / detay | `reminder-doctor` |
| Yıkıcı onay diyaloğu | `pregnancy-off-confirm` |
| Geçmiş / istatistik listesi | `kick-history` |
