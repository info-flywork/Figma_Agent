# Dashink — DESIGN.md

Kaynak: FigJam referans görselleri (5:123 ana menü, 5:124 eğitim, 5:126 oyun sonu, 5:127 mağaza), 2026-11-05.
Tek cümle: **Krem defter kâğıdı üzerinde lacivert mürekkep çizimler; domates turuncusu ana eylem, nane yeşili ödül.**
Hiper-casual mobil oyun, dil Türkçe. Ekran 430 px, kenar 16 px.

## Renk (variable koleksiyonu `Dashink`)

| Token | Hex | Kullanım |
|---|---|---|
| `paper` | #F7F0E1 | ekran zemini (görsel yoksa) |
| `paper-card` | #FFFBF2 | kart, modal, sekmeli kontrol zemini |
| `paper-line` | #E6DBC4 | ayırıcı, pasif nokta, devre dışı zemin |
| `ink` | #1D2550 | metin, çizgi/kenar, ikon, başlıklar |
| `ink-soft` | #5A6082 | ikincil metin, pasif sekme |
| `tomato` | #F45D35 | birincil buton, aktif sekme, vurgu |
| `tomato-dark` | #C4401C | birincil butonun alt "kalınlık" gölgesi |
| `tomato-tint` | #FCD9CC | aktif tab-bar öğesi arka planı |
| `mint` | #2BBF98 | kuşanıldı, yeni rekor, başarı |
| `gold` | #F6B830 | taç, premium, altın vurgusu |
| `white` | #FFFFFF | birincil buton metni |

Kontrast: `ink` / `paper` ≈ 13:1, `white` / `tomato` büyük metinde (≥18 px kalın) kullanılır.
Karartma (scrim): tam ekran modallarda `paper` 0.55; koyu karartma gerekirse `ink` 0.8 — her zaman node opaklığı (paint opaklığı değil).

## Tipografi
- **Display:** Luckiest Guy Regular — başlık, skor, buton etiketi. Hep BÜYÜK HARF (Türkçe: `İ`, `Ş`, `Ğ` dahil; destekli).
  - `display-xl` 96/96 (skor), `display-l` 44/48 (ekran başlığı, wordmark 56), `display-m` 26/30 (birincil buton, kart başlığı), `display-s` 20/24 (ikincil buton).
- **Metin:** Baloo 2 — `body` Medium 16/22, `label` Bold 15/20, `caption` SemiBold 13/18, `tab` Bold 12/16.
- Rakamlar: Baloo 2 ExtraBold (altın sayacı, fiyat).

## Biçim
- Köşe: kart/modal 24, ızgara kartı 20, buton yüksekliği 60 → tam hap (30), ikon buton daire 56, rozet 12.
- Kenar: kart ve ikincil buton **2.5 px `ink`** (elle çizilmiş görünüm).
- Gölge: "basılı kâğıt" — y 4, blur 0, `ink` %18 (kart); birincil butonda y 5, blur 0, `tomato-dark` %100.
- Boşluk ölçeği: 4, 8, 12, 16, 20, 24, 32.
- Dokunma alanı ≥ 44 (ikon butonlar 56, tab 64 yükseklik).

## Component'ler (Figma `Components` sayfası)
- `StatusBar` — 430×54, saat 9:41 + sinyal/pil, `ink`.
- `CoinPill` — `paper-card` hap, 2.5 kenar, altın görseli (img/coin) 24 + Baloo 2 ExtraBold 17.
- `Button` — varyant `Type=Primary|Secondary|Ghost`, `Icon=true|false`; Primary 60 yükseklik `tomato` + alt gölge, metin `white` display-m; Secondary `paper-card` + `ink` kenar, display-s; Ghost metin-yalnız (`ink-soft`, label).
- `IconButton` — 56 daire, `paper-card` + `ink` kenar, 26 ikon (share, home, pause, close, settings).
- `TabBar` — 430×88 (safe area dahil), 4 öğe Oyna/Mağaza/Görevler/Ayarlar; aktif öğe `tomato-tint` zemin + `tomato` ikon.
- `Segmented` — 3 sekme, aktif `tomato` dolgu + beyaz metin.
- `ShopCard` — 124×150, `State=Equipped|Price|Locked|Premium`; üstte top görseli (img) 88, altta etiket. Kuşanılmış: `mint` kenar 3 + `KUŞANILDI` rozeti.
- `ScoreCard` (modal) — `paper-card`, 24 köşe, kenar 2.5.
- `PageDots` — 3 nokta, aktif `tomato` 24×8 hap, pasif `paper-line` 8.
- `ImageArea` — `img/<id>` adlı dikdörtgen, placeholder ikonlu; görsel gelince ikon gizlenir.
- İkonlar: 2.5 px yuvarlak uçlu `ink` çizgi ikonlar (play, bag, checklist, gear, calendar, trophy, crown, pause, share, home, hand, lock, ad).

## Görsel tarifi (manifest `style`)
"Hand-drawn doodle game art: navy blue ink (#1D2550) brush outlines on warm cream notebook paper (#F7F0E1) with a very faint grid, glossy tomato-orange ball (#F45D35), mint and gold accents, playful sketchy marker style, clean flat shading with soft highlights, crisp sharp focus, no blur, no depth of field, no text, no letters, no UI."
Nesne görselleri (top, altın): düz beyaz zemin üzerinde üretilip zemin silinir (cutout).

## Ekran kalıpları
- **Menü ekranları** (Ana ekran, Mağaza): zemin `img/zemin` (tam ekran, absolute) → StatusBar → içerik → TabBar.
- **Oyun ekranları** (Oyun, Eğitim): tam ekran sahne görseli (absolute) + üstte HUD ya da konuşma balonu; alt birincil buton.
- **Sonuç/uyarı**: sahne görseli + `paper` scrim (node opaklığı 0.55; lacivert StatusBar okunur kalsın diye `ink` scrim kullanılmaz) → ortada ScoreCard modal (rozet absolute, sağ üst, 8° eğik) → altta banner reklam alanı (`paper-line`, 50 yükseklik, "REKLAM").

## Referans ekranlar (klon kaynağı)
- Menü kalıbı: `ana-ekran` (8:6), `magaza` (8:103) · Oyun/eğitim kalıbı: `oyun` (10:257), `egitim` (10:209) · Modal kalıbı: `oyun-bitti` (10:296).
- Kalan ekranlar boşlukları `Spacer` frame'leriyle 930'a tamamlar (grow kullanma).

## "Oyun – Referans" sayfası (2026-11-06, kullanıcı isteği)
Ayrı Figma sayfası (`73:800`), referans `references/attach-1793961091332-8ili.png` birebir; yukarıdaki defter dili bu sayfaya **uygulanmaz**.
- Dil: parlak 3D casual oyun — mavi gökyüzü + orman yaprakları zemini, krem-beyaz kartlar (#FFFDF8, beyaz 2 kenar, yumuşak gölge y4 blur10), lacivert metin #1B2340.
- Font: Nunito (Black başlık/sayı, ExtraBold/Bold metin) — Türkçe glifler tam. Logo: Nunito Black Italic 76 + beyaz dış kontur + kırmızı #F04A2E kavis.
- Sarı ana buton (gradyan #FFE340→#FFC70D, beyaz 3 kenar, sert turuncu alt gölge), yeşil #3CC13B başarı/toggle, kırmızı #F2553A aktif sekme, koyu lacivert #1E2D4F sayaç hapları.
- Görseller `g-*` manifest öğeleri (OpenAI, referans kırpıntısından); ikonlar Lucide (`G-Icon/*`, 2.5 çizgi).
- Bu sayfada soft gölge ve gradyan buton referans gereği serbest.

## Yapma listesi
- Gri/soğuk nötr kullanma; tüm nötrler krem/lacivert.
- Saf siyah (#000) metin yok — `ink`.
- Gradyan buton, cam efekti (blur), bulanık gölge yok; gölgeler sert (blur 0).
- Birincil buton ekranda bir tane.
- Luckiest Guy'ı gövde metninde kullanma; Fredoka/Lilita One kullanma (Türkçe glif eksik).
- İngilizce metin bırakma (referanslar İngilizce; uygulama Türkçe).
- Dokunma alanı 44'ten küçük öğe yok; ikonlu butonda erişilebilir etiket metni.
