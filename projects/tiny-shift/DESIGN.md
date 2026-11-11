# Tiny Shift — DESIGN.md

Kaynak: FigJam referans görselleri (2:199 arayüz koleksiyonu, 2:203 oyun, 2:180 ayarlar, 2:181/2:176 kasaba). design-md-library kullanılmadı.
Ton: sıcak, neşeli, "casual puzzle" mobil oyun. Akdeniz kasabası illüstrasyonu üstünde krem paneller, parlak ve tok (3D hissi veren) butonlar.
Oyun metinleri İngilizce (MVP). Hesap yok, çevrimdışı — giriş/satın alma ekranı yok.

## Renk token'ları (`Tiny Shift/Color` koleksiyonu)

| Token | Hex | Kullanım |
|---|---|---|
| `panel/base` | #FFF6E5 | Kart/diyalog zemini |
| `panel/row` | #F7EAD0 | Liste satırı, görev kartı, ikincil yüzey |
| `panel/border` | #E6CC9A | Panel ve satır kenarı (2–3 px) |
| `ink/primary` | #3B2A1A | Ana metin (koyu kahve) |
| `ink/secondary` | #7A5C3E | İkincil metin, grup başlığı |
| `ink/onColor` | #FFFFFF | Renkli buton/şerit üstü metin, ikon |
| `brand/green` | #3DB53A | Birincil eylem (Play, Next, Resume, Restore) |
| `brand/greenDark` | #23861F | Yeşil buton kenar + alt gölge |
| `brand/blue` | #2F8CEB | İkincil eylem, ikon buton, başlık şeridi |
| `brand/blueDark` | #1B5FB0 | Mavi kenar + alt gölge |
| `brand/red` | #E5483B | Yıkıcı eylem, kapat (X) |
| `brand/redDark` | #A92A20 | Kırmızı kenar + alt gölge |
| `brand/yellow` | #FFC72C | Yıldız, vurgulu rota, ipucu |
| `brand/yellowDark` | #C98A0A | Yıldız/para kenarı |
| `neutral/button` | #EEF1F5 | Nötr buton (Cancel, Town) |
| `neutral/buttonDark` | #B8C0CC | Nötr kenar + alt gölge |
| `neutral/white` | #FFFFFF | HUD hapı, toggle topuzu |
| `board/grass` | #8CCB5E | Yol karosu zemini |
| `board/grassDark` | #5E9E3A | Karo kenarı |
| `board/road` | #6B7280 | Asfalt |
| `board/frame` | #C9A46A | Oyun tahtası çerçevesi |
| `scrim` | #1B2A3A | Diyalog arkası karartma — opaklık node'da %80 (%55 parlak illüstrasyonda yetersiz kaldı, a-015) |

Token dışı renk yok. Efekt (gölge) renkleri sabit: kart gölgesi #3B2A1A %20, buton alt gölgesi = o rengin `Dark` tonu.

## Tipografi

- **Display:** Lilita One Regular — logo, başlık şeridi, buton etiketi, sayılar (HUD). Logo: 56/56, sarı dolgu + 4 px kahve kontur.
- **Metin:** Nunito — ExtraBold (etiket, satır başlığı), Bold (gövde), SemiBold (yardımcı).

| Stil | Font | Boyut/Satır |
|---|---|---|
| Logo | Lilita One | 56/56 |
| Title | Lilita One | 32/36 |
| Button L | Lilita One | 24/28 |
| Button M | Lilita One | 20/24 |
| Number | Lilita One | 28/30 (Level Tile, Reward Chip) |
| HUD | Lilita One | 18/20 |
| Heading | Nunito ExtraBold | 20/26 |
| Body | Nunito Bold | 16/22 |
| Label | Nunito ExtraBold | 13/16, büyük harf, +0.5 harf aralığı (grup başlığı) |
| Caption | Nunito SemiBold | 13/18 |

## Ölçü

- Boşluk: 4 · 8 · 12 · 16 · 20 · 24 · 32. Ekran kenarı 16.
- Köşe: 12 (karo, satır) · 16 (buton) · 24 (panel/diyalog) · 999 (hap, ikon buton, avatar).
- Dokunma alanı ≥ 48 (buton L 60, M 52, ikon buton 48, satır 56).
- Buton: dolgu + 2 px `Dark` kenar + alt sert gölge (0, 4, blur 0, `Dark`) + üstte beyaz iç parlama (0, 2, %35). Basılı: gölge 0, 4 px aşağı.
- Panel: `panel/base`, 3 px `panel/border`, köşe 24, gölge 0/8/24 %20.

## Ekran iskeleti

430 × HUG (min 930), dikey auto layout, kenar 16, `SPACE_BETWEEN`: **Top Bar** → içerik → alt eylemler.
Arka plan her ekranda tam boy `img/<ekran>-bg` (absolute, STRETCH) — UI metni asla doğrudan illüstrasyon üstüne yazılmaz; hep panel/hap içinde.
Diyalog ekranlarında: bg görseli + `scrim` (%80) + ortada diyalog kartı (genişlik 360).

## Component listesi (Components sayfası)

- **Icon** (Name=…): 24 px çizgi ikonlar — pause, play, restart, home, settings, back, close, chevron, sound, music, haptics, globe, document, shield, bulb, lock, check, image. Renk instance'ta değiştirilir.
- **Star / Coin**: dolu para birimi ikonları (24).
- **Button** (Style=Primary|Secondary|Danger|Neutral, Size=L|M): ikonlu/ikonsuz (Show Icon), etiket Lilita One.
- **Icon Button** (Color=Blue|Red|White): 48 daire, Icon instance.
- **Stat Pill** (Type=Star|Coin): beyaz hap, ikon + Lilita sayı.
- **Top Bar**: Stat Pill×2 + boşluk + Icon Button (pause/settings).
- **Title Ribbon**: mavi şerit, beyaz Title metni.
- **Panel** (component değil, frame stili): krem kart — diyalog/ayar kartı zemini, içerik serbest. 04-01 diyaloğundan veya 05-01 kartından klonla.
- **Toggle** (State=On|Off): 52×32.
- **Settings Row** (Trailing=Toggle|Chevron|Value): ikon kutusu + etiket + sağ öğe, yükseklik 56.
- **Reward Chip** (Type=Star|Coin): +1 / +50 ödül kutusu.
- **Level Tile** (State=Done|Current|Locked): 72 kare, yıldız sayısı. Locked: kilit 24 + altında numara (Nunito ExtraBold 13/16, `ink/primary` — gri zeminde beyaz kontrastı yetersiz).
- **Pasif buton**: Neutral instance, ikon/etiket `ink/secondary`, gölge yok, opaklık %60.
- **Road Tile** (Type=Straight|Curve|Cross|T|Grass|House, Lit=Yes|No): 88 kare karo, içerik OpenAI görseli (`img/tile-<type>`, üstten
  ortografik). Taban yönler: Straight dikey, Curve sağ↔alt, T üst+alt+sağ; yön döndürme instance rotasyonu ile. House = dekor ev karosu
  (tahtadaki boş çimlerin bir kısmı). Lit = bağlı rota (4 px sarı kenar + %22 sarı "Lit Glow").
- **Vehicle**: üstten görünüm itfaiye aracı, 36×56, şeffaf PNG görsel (`img/vehicle-firetruck`), ön yüz yukarı.
- **Speech Bubble**: Milo'nun konuşma balonu (krem, kuyruklu).
- **Timer Chip** (State=Normal|Low) + **Icon/timer** (2026-11-02, kullanıcı isteği "puzzle ekranlarına 1–3 dk süre"): Status hapıyla aynı biçim
  (`panel/row`, köşe 999, yükseklik 28) + 18 px kronometre ikonu (`brand/blue`) + kalan süre `m:ss` (Lilita One 18/20, `ink/primary`).
  Low (≤15 sn): `brand/red` dolgu, 2 px `brand/redDark` iç kenar, ikon/metin `ink/onColor`. Oyun ekranlarında Task kartında Status hapının
  sağında (`Meta` satırı, aralık 8). Süre sınırı: B1 1:00 · B2 1:30 · B3 2:00 · B4 2:30 · B5+ 3:00 (en fazla 3 dk). Öğretici süresiz.
- **Tahta büyümesi (2026-11-02, kullanıcı isteği "50/100/150/200. bölüm, tahta büyüsün ve zorlaşsın"):** tahta iç genişliği ≤ 372 (Board
  398 içinde). Karo boyutu = sığan en büyük, **en az 48** (dokunma alanı) → en fazla 7 sütun; daha fazla zorluk satır ekleyerek.
  Aralık: 5 sütuna kadar 6, 7 sütunda 4. Road Tile/Vehicle instance'ı `rescale` ile küçülür. Ölçek: B1–5 3×3…4×5 (88) · B50 5×6 (68) ·
  B100 6×7 (56) · B150 7×8 (48) · B200 7×9 (48). Zorluk ayrıca: daha çok T/dörtlü kavşak, daha çok yanıltıcı yol karosu, daha az
  önceden bağlı (Lit) karo. B11+ hamle sınırlı: Status metni `Moves 0 / N · N left`.

- **Ana ekran öğeleri (2026-11-02, kullanıcı isteği "referans görselden anasayfa", 03-05-home):** yeni component değil, frame stilleri.
  - **Güncelleme (2026-11-02, kullanıcı referansı attach-1793627450814-3cpu):** aşağıdaki biçim eskisinin yerine geçer.
  - *Top Bar (ana ekran)*: ayar düğmesi Icon Button **White**, ikon `brand/blue`.
  - *Progress Card*: Panel stili (köşe 24, padding 14/16), bina görseli 68 (köşe 14) + sağda: başlık satırı (Nunito ExtraBold 18
    `ink/primary` · sağda Star 22 + Lilita 20 "2 / 4" `ink/primary`) + altında ilerleme çubuğu (yükseklik 22, köşe 999, iz `panel/row`
    + 2 px `panel/border`, dolum `brand/yellow`, içinde metin yok).
  - *Side Shortcut*: 88 daire `panel/base` + 3 px `panel/border` + içerikte görsel 68 / Icon 40, altında renkli etiket hapı (104×32,
    köşe 999, Lilita 18). Rozet yok. Yalnızca 2 kısayol: solda Renovate (yeşil), sağda Help (mavi) — Levels/Town sekme çubuğunda.
  - *Play Button*: 366×108, `brand/green` + 4 px `brand/greenDark` kenar + 0/6 sert gölge, köşe 32; yatay: solda beyaz dolu oynat
    üçgeni (48×52, `ink/onColor`) + metin sütunu ("Level N" Lilita 44/46, zorluk etiketi Nunito ExtraBold 16). Milo (img 96) sağ üstten bakar.
  - *Tab Bar*: tam genişlik 430, `panel/base` zemin, üst köşeler 32, üstte 3 px `panel/border`, alt safe area + home indicator
    (134×5, `ink/primary`). 3 sekme (Levels · Home · Town); ikon/görsel 40 + etiket Lilita 18 `ink/primary`. Aktif sekme: ikon ve
    etiket `brand/blue`, arkada `brand/blue` %15 vurgu (ayrı dikdörtgen, opaklık node'da), köşe 24, genişlik 132. Hesap/mağaza/sıralama sekmesi yok.

- **Parça parça restorasyon (2026-11-02, kullanıcı isteği, 03-01 / 03-02):** her bina 5 parçada yenilenir, parça başı 3 yıldız, toplam 15.
  Local Market sırası: Awning → Roof → Walls → Door & Windows → Stalls. Yeni component değil, frame stilleri:
  - *Restore Steps*: 5 adımlık yatay sıra (aralık 4, eşit genişlik). Adım = 44 daire + altında etiket (Label stili, `ink/secondary`).
    Done: `brand/green` + 2 px `brand/greenDark` + Icon/check beyaz. Current (sıradaki): `brand/yellow` + 2 px `brand/yellowDark` +
    Lilita 18 sıra no `ink/primary`. Locked: `panel/row` + 2 px `panel/border` + Icon/lock. 03-01'de Building Card'ın altında, 03-02'de
    öncesi/şimdi görsellerinin altında. 03-02 görselleri: BEFORE (harap) → NOW (o ana kadar yenilenen parçalar).
  - Restore eylemi yeşil Primary buton "Restore <Parça>" (Icon/check); maliyet ayrı Cost hapında (3 ★) ya da Milo metninde.
    Yetersiz yıldızda Pasif buton.

- **Mağaza / Paywall (2026-11-03, kullanıcı isteği "paywall, referans görseldeki gibi", ref attach-1793686852959-msc7, 06-01-paywall):**
  "satın alma ekranı yok" kuralı bu ekran için kaldırıldı; oyun yine hesapsız, satın alma zorunlu değil (kapat her zaman açık).
  Yeni component değil, frame stilleri:
  - *Shop Header*: Stat Pill (Coin) · ortada Title Ribbon "Shop" · sağda Icon Button **Red** (close). Yükseklik 48.
  - *Offer Card*: dış çerçeve `brand/yellow` + 4 px `brand/yellowDark` kenar + 0/6 sert gölge `brand/yellowDark`, köşe 24, iç padding 8;
    içinde renkli gövde (köşe 18): Pass = `brand/blue` gövde, Deal = `brand/blue` + sağda görsel, Special = `panel/row` gövde + alt
    `brand/blueDark` şerit. Kart başlığı sol üstte krem etiket hapı (`panel/base`, 2 px `panel/border`, Lilita 22 `ink/primary`).
  - *Offer Tile*: `panel/base` kutu, 2 px `panel/border`, köşe 14; para kutusu (Coin 48 + Lilita 26 miktar) ya da 2×2/3×2 öğe ızgarası
    (Icon 24 `brand/blue` + Lilita 16 "×3", hücre 52).
  - *Price*: fiyat her zaman yeşil Primary buton etiketinde ($0.99); abonelik/pass fiyatı krem fiyat hapında + "Activate" Primary.
  - *Discount Badge*: `brand/red` hap, 2 px `brand/redDark`, Lilita 18 beyaz "-90%", kartın sol üst köşesine hafif eğik (−12°, absolute).
  - *Deal Timer*: Timer Chip Normal, kartın üst kenarında ortalanmış (absolute).
  - Alt: Neutral M "More Offers" (chevron) + krem hap içinde "Restore Purchases · Terms · Privacy" (her biri ≥44 dokunma alanı).

## Görseller (img/<id>)

Ortak stil (manifest `style`): "Bright, cheerful 3D-cartoon mobile game illustration, Mediterranean seaside town with terracotta roofs, pastel houses,
flowers and greenery, soft warm sunlight, saturated but soft colors, smooth clay-like rendering, gentle depth of field."
- Ekran arka planı: ekran boyu, üst ve orta kısım sade/hafif bulanık (UI okunabilsin).
- Milo: sevimli kahverengi-beyaz köpek maskot (beagle tipi, mavi tasma), yuvarlak avatar çerçevesinde.
- Karo içi hedefler (ev, bina): üstten-izometrik, yeşil çim zeminli kare.
- Yol karoları (FigJam ref 2:203 gibi, 2026-10-30): üstten görünüm, geniş koyu antrasit asfalt (karonun ~%40'ı) + iki yanda bej taş kaldırım
  bordürü, beyaz kesikli orta çizgi; virajlar geniş yay. Çimde selvi ağaçları, yuvarlak çalılar, pembe çiçekler. Karo kenar kenara dolu
  (kabartma/çerçeve component'te). Üretim: `refImage: references/figjam-2-203-board.png`, `quality: high`.
- **Yol genişliği sabit (2026-11-02, kullanıcı isteği):** tüm yol karolarında yol ekseni karo ortasında; 176 px görselde bordür 52–124
  (karonun %41'i), asfalt 65–111 (%26), orta çizgi 2 px, 6 kesik/karo. Viraj aynı ölçülerle çeyrek çember (merkez karo köşesi, yarıçap 88).
  Kavşak köşeleri 14 px yuvarlak. Karolar bu ölçüyle yeniden çizildi (`assets/generated/tile-*.png`); AI görseli yeniden üretilirse bu ölçüye getir.

## Referans ekranlar

01-01-splash (açılış/ana sayfa iskeleti), 02-03-vehicle-move (oyun tahtası), 03-04-town-complete (kutlama), 04-01-pause (diyalog), 05-01-settings (liste paneli).
Diğer ekranlar bunlardan klonlanır: diyaloglar ← 04-01, oyun durumları ← 02-03, kasaba/liste ← 05-01 ve 03-04.

## Yapma listesi

- Metni doğrudan illüstrasyon üstüne koyma; panel ya da hap kullan.
- Token dışı renk, Lilita/Nunito dışı font kullanma.
- 48 px altı dokunma alanı yapma; ikon tek başına eylemse daire buton içinde olsun.
- Her diyalogda kapat/iptal yolu olsun (X veya Cancel); yıkıcı eylem (Restart) kırmızı ve onaylı.
- Para/yıldız değişimini sayı + ikonla göster; yalnız renkle anlatma.
- Hesap, giriş, reklam zorunluluğu ekleme (ipucu reklamla değil parayla). Mağaza yalnız 06-01-paywall'da, kapatılabilir, zorunlu değil.
- Yeni buton/kart biçimi uydurma; önce bu dosyaya ekle.
