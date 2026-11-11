# Traffic Tangle — DESIGN.md

Kaynak: FigJam'deki 5 referans görsel (açılış, şehir ana sayfa, bölüm seç, oyun tahtası ×2), 2026-11-03.
Kaynak dosyalar: `references/figjam-1..5.png`. Design-md-library kullanılmadı (referans var).

## Karakter
Sıcak, neşeli, çizgi film 3D kasaba. Güneşli Akdeniz kasabası (kırmızı kiremit çatılar, taş sokaklar, çiçekler),
yüzü olan sevimli araçlar. UI krem renkli, kalın, yumuşak köşeli "şekerleme" kartlar; butonlar parlak ve alttan koyu kenarlı (3D bas).
Görsel zengin ama okunur: içerik her zaman krem kart ya da koyu perde (scrim) üstünde.

## Renk (Figma variable: `Tokens` koleksiyonu)
| token | değer | kullanım |
|---|---|---|
| color/surface | #FFF6E3 | kart, pill, ikon buton zemini |
| color/surface-inset | #F3E4C4 | kart içi alan, ilerleme çubuğu yolu |
| color/border | #E6CFA0 | kart kenarı (2 px) |
| color/text | #4A2C17 | başlık ve metin (koyu kahve) |
| color/text-muted | #7A5A3F | ikincil metin |
| color/on-color | #FFFFFF | renkli buton üstü metin |
| color/primary | #3CC23A | ana buton (Oyna, Devam et, Sonraki) |
| color/primary-edge | #22901F | ana butonun alt kenarı / gölgesi |
| color/secondary | #2F7BEA | ikincil buton (Bölümler, Binalar, Şehre dön) |
| color/secondary-edge | #1B55B5 | |
| color/danger | #E8463A | yıkıcı eylem (Sıfırla) |
| color/danger-edge | #B02A20 | |
| color/locked | #D3D3D3 | kilitli/pasif |
| color/locked-edge | #A9A9A9 | |
| color/star | #FFC531 | yıldız vurgusu, rozet |
| color/scrim | #2B1A0E | modal perdesi (node opacity 0.75 — 0.6 parlak arka planda zayıf kaldı) |
| color/board | #C9CED6 | tahta çerçevesi |
| color/board-cell | #ECEEF1 | tahta hücresi |
| color/car-red / car-blue / car-yellow / car-green | #E8463A / #2F7BEA / #FFC531 / #3CC23A | araç ve kapı renkleri (kapı = aracın rengi + sembol) |

Kapı sembolleri renk körlüğü için: kırmızı ★, mavi ●, sarı ▲, yeşil ■. Renk asla tek başına bilgi taşımaz.

## Tipografi — Baloo 2 (Türkçe glif destekli; Lilita One/Fredoka kullanma)
| stil | boyut / satır | ağırlık |
|---|---|---|
| Display | 40 / 44 | ExtraBold |
| Title | 28 / 34 | ExtraBold |
| Heading | 22 / 28 | ExtraBold |
| Body | 17 / 24 | SemiBold |
| Label | 15 / 20 | Bold |
| Caption | 13 / 18 | SemiBold |
| Button-L | 24 / 30 | ExtraBold |
| Button-M | 18 / 24 | ExtraBold |
Sayaçlar (yıldız, coin, hamle) ExtraBold, tabular. Metin rengi her zaman color/text; renkli buton üstü color/on-color.

## Şekil, boşluk, gölge
- Radius: radius/sm 12 (ikon buton, hücre), radius/md 18 (buton), radius/lg 24 (kart, modal), radius/full 999 (pill).
- Spacing: 4 / 8 / 12 / 16 / 24 / 32. Ekran kenarı 16.
- 3D buton: dolgu + `DROP_SHADOW y=5 blur=0` edge rengiyle; üstte ince beyaz iç parlama (INNER_SHADOW y=2, beyaz %35).
- Kart: color/surface + 2 px color/border + `DROP_SHADOW y=4 blur=12 #4A2C17 %18`.
- Dokunma alanı ≥ 48 (ikon buton 48×48, Button-M 56 yük., Button-L 68 yük.).

## Ekran iskeleti
430 × HUG (min 930), dikey auto layout, kenar 16, üst güvenli alan 54, alt 34. Arka plan: tam ekran `img/bg-*` (ABSOLUTE, en altta).
- **Üst çubuk (TopBar):** sol IconButton (Geri / Duraklat), orta pill başlık (ör. "Bölüm 9"), sağ CounterPill(ler) (yıldız, coin).
- **Oyun ekranı:** TopBar → GoalPanel (Hamle + Kalan araçlar) → Board → ToolBar (Geri Al / İpucu / Yeniden Başlat).
- **Modal:** tam ekran scrim (opacity 0.75) + ortada Modal kartı (krem, radius 24, padding 24, gap 16): başlık (Title), açıklama (Body), görsel (isteğe bağlı), buton yığını (FILL).
- **Sonuç ekranı:** arka plan + başlık şeridi + büyük görsel + ödül satırı + iki buton.

## Component listesi (sayfa: `Components`)
- `Icon/*` — 24 px, stroke 2.5 yuvarlak: back, pause, gear, play, grid, home, undo, bulb, restart, lock, close, check, arrow-right.
- `Star`, `Coin` — görsel (img/star, img/coin), 32 px.
- `Button` — Kind = Primary | Secondary | Danger | Neutral | Locked, Size = L | M; ikon (INSTANCE_SWAP, gizlenebilir) + etiket.
- `IconButton` — 48×48 krem, ikon.
- `CounterPill` — Type = Star | Coin; görsel + sayı.
- `TitlePill` — krem pill, Heading metin.
- `ProgressBar` — yol + yeşil dolgu + etiket "7/10".
- `GoalChip` — araç rengi sembolü + "0/1", Done=true ise yeşil tik.
- `ToolButton` — krem kare kart 104×88: ikon + etiket (+ coin fiyatı satırı).
- `GameToolBar` (2026-11-05, kullanıcı referansı) — oyun ekranlarının alt çubuğu: 4 krem kart 136 yükseklik (Süreyi Dondur ·2, Sihirli Çubuk ·1,
  Renk Kutusu 150 seçili sarı çerçeve, İpucu 100); ikonlar referans görselden kırpılmış 3D görseller (`assets/crops/game-board-*`), coin hapı altta.
  Süre başlığının solunda saat ikonu. Oyun ekranları HUG; kısa kalırsa Spacer 930'a tamamlar, uzun içerik kesilmez.
- `Board` — 6×6 hücre ızgarası, kapılar kenarda; araçlar `Car` instance'ı (ABSOLUTE, hücre 52 px).
- `Car` — Color = Red | Blue | Yellow | Green, Length = 2 (minibüs/araba) | 3 (otobüs); **tam üstten (ortografik, perspektifsiz)** kesme görsel,
  yatay, ön sağa; görsel hücre ayak izinin içinde kalır, taşmaz (2'li 108×52, 3'lü 164×52; 2 px iç boşluk, FIT, clip açık).
  Görseller yüksek çözünürlük (~3000 px uzun kenar). Dikey için instance rotation −90.
- `Gate` — Color ×; renkli kapı + sembol, Locked=true ise kilit rozeti.
- `ModalHeader` — Title + Body + sağ üst Kapat (ShowBody, ShowClose). Modal kartı ekranda frame: krem, radius 24, padding 24, gap 16,
  ModalHeader + isteğe bağlı görsel/rozet + butonlar (FILL). Birincil buton L, diğerleri M.
- Kart/aksiyon frame'lerinde `clipsContent = false` (buton alt kenar gölgesi kesilmesin).
- `LevelTile` — State = Done | Current | Locked, 64×64, radius/sm, alt kenar gölgesi (edge rengi): Done krem + numara + küçük yıldız,
  Current yeşil + beyaz numara, Locked gri + kilit. Bölüm seç ızgarası: 5 sütun, gap 10, WRAP.
- `Toggle` — On = true | false, 56×32 pill (yeşil / gri), beyaz düğme. Ayar satırı 56 yük. (etiket solda, anahtar sağda).
- Oyun içi uyarı (`AlertTip`, TutorialTip deseni): tahtanın üstünde mavi şerit kart, beyaz metin; hata uyarısında zemin color/danger.
  İlgili araç/kapı 3–4 px dış kontur ile vurgulanır (hata: danger, ipucu: star).

## Görsel tarifi (assets/manifest.json → style)
"Bright cheerful 3D cartoon render, like a premium casual mobile game (Toon Blast / Royal Match quality). Sunny Mediterranean
small town, terracotta roofs, cobblestone, flowers, soft warm daylight, saturated but soft colours, smooth rounded shapes,
cute vehicles with big friendly eyes. Sharp focus everywhere, no depth of field, no bokeh, no blur."
Nesne görselleri (araç, yıldız, coin, el) düz magenta #FF00FF zeminde üretilip kesilir (bkz. image gotchas).

## Yapma listesi
- Lilita One, Fredoka, Chewy, Titan One kullanma (Türkçe glif eksik).
- Renkli zemin üstüne kahve metin, krem zemin üstüne beyaz metin koyma.
- Rengi tek bilgi taşıyıcı yapma — kapı ve hedeflerde sembol zorunlu.
- Görsel üstüne doğrudan metin koyma; krem kart veya scrim kullan.
- Düz (gölgesiz) buton, keskin köşe, 48'den küçük dokunma alanı yok.
- Token dışı renk, 16 dışı ekran kenarı yok.
- Bulanık/odak dışı görsel, sahte dama deseni, görselde yazı yok.
- Tahtada 3/4 ya da yamuk perspektifli araç, hücre dışına taşan araç görseli yok.
- Her modalda kapatma/geri yolu olmalı (Kapat ikonu ya da ikincil buton).

## Referans ekranlar (onaylı, 2026-11-03)
building-next, paused, hint-none, tutorial, level-complete — node id'leri `figma.json`.
