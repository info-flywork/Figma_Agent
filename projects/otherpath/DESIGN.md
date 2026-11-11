---
version: 1
name: Otherpath
description: >-
  Otherpath — karar günlüğü + YZ ile iki paralel öykü (iOS, 430 px). Kaynak: kullanıcının FigJam'e yüklediği
  5 referans ekran (flow.md'de `ref:`). Sıcak krem zemin, editoryal serif başlıklar, tek kararlı mor aksiyon,
  lila/şeftali ile "iki yol" ikiliği, yumuşak 3D yol ve kemer illüstrasyonları.
base: kullanıcı referansları + taste-skill (app rules) + web-interface-guidelines

colors:
  # Marka
  primary: "#6B5AA6"          # birincil buton dolgusu, aktif sekme, seçili ikon (beyaz metin 5.6:1)
  primary-pressed: "#56478D"
  primary-text: "#5B4B97"     # krem üstünde mor metin/bağlantı
  lilac: "#EDE7F8"            # seçilen yol kartı, vurgu kartı zemini
  lilac-strong: "#DCD2F1"     # seçili seçenek zemini, ilerleme dolgusu açık hali
  peach: "#F7E4D6"            # diğer yol kartı zemini
  peach-strong: "#E9B994"     # diğer yol vurgusu (grafik/çizgi, metin değil)
  sage: "#E6EBDF"             # nötr-sıcak bilgi kartı (ör. "Bugünkü puanın")
  on-primary: "#FFFFFF"
  # Zemin
  canvas: "#F8F4EE"           # tüm ekranların zemini
  surface: "#FFFFFF"          # kart, alan, sheet
  surface-sunk: "#F0EBE3"     # pasif segment, iskelet
  hairline: "#E7E0D6"
  scrim: "#1F1C2C"
  # Metin
  ink: "#1F1C2C"              # birincil (koyu mürekkep, hafif mor)
  ink-2: "#4A4658"            # ikincil
  ink-3: "#625E6E"            # meta / placeholder (≥4.5:1 krem, lilac, sage, peach üstünde; audit a-003, 2026-10-26)
  # Durum
  positive: "#3E6B4E"
  negative: "#B4232C"
  negative-tint: "#FBE9E7"

typography:
  # Serif: Fraunces (referanstaki yüksek kontrastlı editoryal serif). Ekran başlığı, büyük skorlar, öykü başlığı.
  # Sans: Inter. Geri kalan her şey.
  display:   { fontFamily: Fraunces, fontSize: 40, fontWeight: 400, lineHeight: 1.05, letterSpacing: -1.0 }   # "Hayat nasıl ilerledi?", "6/10" skor
  title-xl:  { fontFamily: Fraunces, fontSize: 34, fontWeight: 400, lineHeight: 1.1,  letterSpacing: -0.6 }   # ekran başlığı (Hangi yolu seçtin?)
  title-lg:  { fontFamily: Fraunces, fontSize: 26, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.3 }   # bölüm başlığı (Kararlarım), öykü başlığı
  title-md:  { fontFamily: Inter, fontSize: 17, fontWeight: 600, lineHeight: 1.35 }                          # kart başlığı, nav başlığı
  body-lg:   { fontFamily: Inter, fontSize: 16, fontWeight: 400, lineHeight: 1.5 }
  body:      { fontFamily: Inter, fontSize: 15, fontWeight: 400, lineHeight: 1.5 }
  label:     { fontFamily: Inter, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }
  meta:      { fontFamily: Inter, fontSize: 13, fontWeight: 400, lineHeight: 1.4 }
  caption:   { fontFamily: Inter, fontSize: 12, fontWeight: 500, lineHeight: 1.3 }
  button:    { fontFamily: Inter, fontSize: 16, fontWeight: 600, lineHeight: 1 }

rounded: { xs: 8, sm: 14, md: 20, lg: 28, full: 9999 }
spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 }
elevation:
  flat: none
  float: "0 8px 24px rgba(31,28,44,0.10)"   # yalnızca sheet, menü, toast
device: { width: 430, minHeight: 930, paddingX: 16, statusBar: 54, homeIndicator: 34, tabBar: 84 }
---

# Otherpath — DESIGN.md

Tek tasarım kaynağı. Ekranlar yalnızca bu token'larla ve `figma.json`'daki component'lerle kurulur.

## Karakter
Sakin, düşünceli bir günlük: "iki yol" fikri her ekranda görsel olarak taşınır — **mor = seçtiğin yol**, **şeftali = seçmediğin yol**.
Duygu illüstrasyondan (yumuşak 3D kemer, yol, bitki) ve büyük serif başlıklardan gelir; arayüz sade kalır.

## Kurallar
- Zemin her zaman `canvas`. Kartlar `surface` + 1 px `hairline` **ya da** dolu tint (`lilac`, `peach`, `sage`), ikisi birden değil.
- **Ekranda tek dolu mor buton** (`primary`, pill, 52 px). İkincil: `surface` + `hairline` pill; üçüncül: `primary-text` metin.
- Mor/indigo, taste-skill'de yasaklı olsa da **bu projede marka rengidir** (kullanıcı referansı) — yalnızca aksiyon, seçili durum, ilerleme.
- Serif yalnızca başlık ve skor; 18 px altına inmez. Gövde Inter. İki aile, monospace yok.
- Büyük harf etiket yok (referanstaki "SEÇTİĞİN YOL" rozeti → cümle düzeni "Seçtiğin yol" pill).
- Yazım: uygulama adı **otherpath** (küçük harf wordmark). Türkçe cümle düzeni, "…" tek karakter.
- Dokunma alanı ≥ 44 px; alan metni ≥ 16 px (input) — gövde 15 px yalnızca okuma metni.
- İkonlar Lucide outline 1.5 px, 20/24 px, `ink-2`; ikon kutusu gerekiyorsa `lilac` daire (referans).
- Gradyan yok; illüstrasyonlar görsel alanı (`img/<id>`) içinde.

## Görseller (img/<id>)
Yumuşak 3D render: krem kemerler, kıvrılan iki yol (biri lila, biri şeftali), küçük zeytin dalları, sabah ışığı, mat malzeme. İnsan yok, metin yok.

## Component envanteri
Status Bar · Home Indicator · Button (Primary/Secondary/Text × Default/Pressed/Disabled/Loading) · Icon Button · Nav Header ·
Stepper (3 adımlı numaralı ilerleme) · Progress Bar · Option Card (default/selected, ikonlu) · Chip · Segmented Control ·
Text Area (sayaç + mikrofon) · Decision Card (ikon, başlık, kategori, tarih, durum pill) · Status Pill · Score Card ·
Path Card (Seçtiğin / Diğer yol) · Insight Card · Timeline (1·3·6 ay) · Tab Bar (Ana sayfa · Kararlar · Yeni karar · İçgörüler · Profil) · Image Slot
Ek (design-rest, 2026-10-26): Text Field (Default/Focused/Error; etiket + 52 px alan + yardım metni) · Search Field · Toggle (On/Off, 51×31) ·
List Row (Trailing=Chevron/Toggle/Value; lilac daire ikon, 56 px, alt çizgi) · Checkbox Row (On/Off) · Plan Card (Default/Selected; başlık, fiyat, meta, rozet)

## Kalıplar (design-rest)
- **Liste grubu:** `surface` + `hairline`, `rounded.md`, içinde List Row'lar; grup başlığı `meta` / `text/tertiary`, grubun 8 px üstünde.
- **Alt sayfa (sheet):** ekranın üstünde `scrim` %40 + alttan `surface` sheet, üst köşeler `rounded.lg`, `float` gölge, tutamak 36×4 `hairline`.
- **Diyalog:** ortalı `surface` kart, `rounded.lg`, `float`; serif `title-lg` başlık, gövde, dikey iki buton (yıkıcı işlemde birincil buton yerine `negative` metinli ikincil).
- **Durum ekranı (boş / başarı / yükleniyor):** ortalı görsel alanı + `title-xl` başlık + `body-lg` açıklama + tek birincil buton altta.
- **Sistem penceresi (iOS izin):** iOS alert taklidi — yarı saydam beyaz 270 px kart, 13/17 px sistem yazısı; uygulamanın token'ları kullanılmaz.


## Temel 5 ekran (kullanıcı referanslı)
`01-02-onboarding-live` · `03-01-decisions` · `04-02-write` · `04-08-two-paths` · `06-06-compare`

## Örnek veri
Kullanıcı **Deniz**. Kararlar: "Berlin teklifini reddettim" (İş, 12 Temmuz, 3. ay yoklaması hazır), "İstanbul'da kalmayı seçtim" (Taşınma, 4 Eylül),
"Yüksek lisansa başladım" (Eğitim, 20 Eylül). Yoklama: ilk tahmin 6/10, bugün 8/10.
