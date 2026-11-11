# Knot Escape — DESIGN.md

Tek tasarım kaynağı. Kaynak: FigJam referans paftası `9:780` (14 ekran, kullanıcının kendi görselleri). Marka kütüphanesi kullanılmadı.
Tarz: parlak, sıcak, 3D/cartoon casual bulmaca oyunu. Ekranın "dünyası" fotoğraf gibi illüstrasyon (sahil, ada, deniz feneri);
arayüz bunun üstünde tombul, kalın kenarlı, oyuncak gibi parçalardır. Oyun tahtası ahşap/bej; popup'lar krem; arka plan karartması lacivert.

## Renk token'ları (Figma collection `Knot / Color`)

| Token | Hex | Kullanım |
|---|---|---|
| `navy/900` | #0F2143 | scrim (node opacity 0.72), koyu metin gölgesi |
| `navy/700` | #1F3F73 | ikincil buton, koyu pill, popup kenarı |
| `navy/500` | #2E5C9E | ikincil buton alt kenarı |
| `blue/500` | #2F80ED | güçlendirici karo, ikon butonu |
| `blue/700` | #1C55B8 | mavi karo alt kenarı (3D tabanı) |
| `green/500` | #3DBE2F | birincil buton (Oyna, Sonraki, Al, Tamam) |
| `green/700` | #23861B | birincil buton alt kenarı |
| `orange/500` | #FF7A1A | yeniden başlat, başlık kurdelesi |
| `orange/700` | #C24E06 | turuncu alt kenar |
| `gold/400` | #FFC93C | yıldız, jeton vurgusu, ilerleme dolgusu (alternatif) |
| `gold/600` | #D48A00 | yıldız/jeton kontur |
| `purple/500` | #A04DFF | elmas fiyat butonu |
| `purple/700` | #6B22CC | mor alt kenar |
| `red/500` | #EE3F3A | bildirim rozeti, başarısızlık zemini |
| `red/700` | #B8231F | krem üstünde kırmızı metin (≤ 24 px; red/500 kontrastı yetmez) |
| `cream/50` | #FFF8EC | popup / kart zemini |
| `cream/200` | #F5E4C6 | kart içi satır, boş ilerleme çubuğu |
| `cream/400` | #E3C796 | krem kart kenarı |
| `wood/300` | #EED0A4 | oyun tahtası yüzeyi |
| `wood/500` | #CFA06A | tahta kenarı/gölgesi |
| `wood/700` | #A9764A | boş pin deliği |
| `ink/900` | #3A2614 | krem üstü ana metin (kahve) |
| `ink/600` | #7A5A3A | krem üstü ikincil metin |
| `white` | #FFFFFF | renkli zemin üstü metin, ikon |

İp/pin renkleri (oyun parçası, yalnızca tahtada): kırmızı #F0453F, sarı #FFC23A, mavi #2F8BFF, yeşil #36B24A, mor #A24BFF.
İpler **gerçekçi burgulu halat** görselidir (OpenAI `img/ropes`, kullanıcı isteği 2026-11-03): spiral iplik dokusu, 3D hacim,
tahtaya düşen yumuşak gölge; düz vektör çizgi kullanılmaz. Görsel, Figma'daki ip yollarından çizilen referansla (`/images/edits`) üretilir;
pinler görselin üstünde durur.

## Tipografi

Tek aile: **Baloo 2** (Türkçe karakterlerin tamamı var). Lilita One kullanılmaz — Ğ ğ Ş ş İ ı glifleri yok (kullanıcı isteği, 2026-11-03).

- **Baloo 2 ExtraBold** — başlıklar, buton etiketleri, sayılar (Hamle, bölüm no, fiyat). Beyaz metinde drop shadow 0/2/0 `#0F2143` %35;
  yeşil/turuncu/mor buton, MenuTile ve WorldCard üstündeki beyaz etikette ayrıca 2 px `navy/900` dış kontur (kontrast, denetim a-001).
- Kesme işareti ve tırnak tipografik: ’ “ ” (düz ' kullanılmaz). Güçlendirici adları her yerde: **Geri Al · İpucu · Dondur · Pin Aç · +5 Hamle**.
- **Baloo 2** (SemiBold / Bold) — açıklama, satır metni, görev başlıkları.

| Stil | Font | Boyut / satır |
|---|---|---|
| `display` | Baloo 2 ExtraBold | 40 / 44 |
| `title` | Baloo 2 ExtraBold | 28 / 32 |
| `button-l` | Baloo 2 ExtraBold | 24 / 28 |
| `button-m` | Baloo 2 ExtraBold | 18 / 22 |
| `number` | Baloo 2 ExtraBold | 30 / 32 |
| `body` | Baloo 2 SemiBold | 16 / 22 |
| `body-bold` | Baloo 2 Bold | 16 / 22 |
| `caption` | Baloo 2 SemiBold | 13 / 18 |

Türkçe metin cümle düzeninde ("Sonraki bölüm" değil, referanstaki gibi başlık düzeni serbest: **Sonraki Bölüm**, **Tekrar Dene** — oyun dilinde kabul).

## Biçim

- Köşe: buton 18, ikon butonu 14, güçlendirici karo 16, kart 20, popup 28, pill tam yuvarlak.
- **3D taban:** her buton/karo altında 0/5/0 blur 0 drop shadow, rengi `*/700` (oyuncak hissi). Üstte iç parlaklık: inner shadow 0/3/0 beyaz %35.
- Krem kart: `cream/50` zemin, 3 px `cream/400` kontur, alt gölge 0/4/0 `wood/500`.
- Popup: `cream/50`, 4 px beyaz kontur, gölge 0/8/24 #000 %30; sağ üst kapat (X) butonu 44×44.
- Scrim: `navy/900` dikdörtgen, **node opacity 0.72** (paint opacity'si değil).
- Boşluk: 4'ün katları; ekran kenarı 16, kart içi 16, satır arası 12, bölümler arası 24.
  Tek istisna: ekranın en alt dolgusu 34 (home indicator safe area). Ekranın altına yapışan absolute öğeler alttan ≥ 42 (34 + 8) yukarıda durur.
- Dokunma alanı ≥ 44 (ikon butonları 48, güçlendirici karoları 72).

## Component listesi (`🧩 Components` sayfası; id'ler figma.json'da)

Icon (24, beyaz çizgi, 2.5 px) · StatusBar · Button (Primary/Secondary/Price × L/M) · IconButton (Blue/Orange/Navy) ·
CurrencyPill (Coin/Gem) · LevelPill · MoveCounter · BoosterButton · Pin (Red/Yellow/Blue/Green/Purple/Hole) ·
PopupHeader · BoosterRow · TaskCard (Progress/Claimable/Claimed) · Star (On/Off) · Ribbon · RewardCard ·
Toggle (On/Off) · SettingsRow (Toggle/Link) · LevelTile (Done/Current/Locked) · WorldCard (Open/Locked) · MenuTile · ShopCard (Booster/Coin/Gem).
Ek ikonlar: lock, music, sound, vibration, language, privacy, support, about, chevron-right.
Başarısızlık sonucu (Hamleler bitti): Ribbon dolgusu `red/500`. Koç/ipucu vurgusu: beyaz (öğretici) veya `gold/400` (ipucu) kesikli halka + kesikli yol.

## Ekran kalıpları (onaylı 5 referans ekran)

- `splash` — tam ekran illüstrasyon + logo + yükleme çubuğu (başka kontrol yok).
- `game-board` — oyun ekranı kalıbı: üst bar (duraklat · LevelPill · elmas pill), MoveCounter + yeniden başlat, ahşap tahta, alt güçlendirici çubuğu.
  Ayarlar oyun sırasında yalnızca duraklatma popup'ından açılır (tahtada dikkat dağıtmamak için; denetim a-014, 2026-11-03).
- `booster-select` — popup kalıbı: arka planda karartılmış oyun ekranı + krem popup + satır listesi.
- `daily-tasks` — liste-popup kalıbı: karartılmış ana menü + başlık ikonu + kart listesi.
- `level-complete` — sonuç kalıbı: karartılmış tahta + yıldız + kurdele + ödül kartı + birincil buton + ikincil ikon butonları.

## Görseller (`img/<id>`)

Ortak stil: *Glossy 3D cartoon mobile-game art, bright saturated colors, soft sunny lighting, rounded chunky shapes, Royal Match /
Gardenscapes quality, clean edges.* Arka planlar tam ekran (430×930), üst ve alt UI için sade alan bırakır. Görsellerde yazı yok;
logo yazısı Figma'da metindir (Baloo 2 ExtraBold, KNOT `gold/400` 96 + ESCAPE beyaz 64, 7–8 px `navy/900` dış kontur + 0/6/0 gölge).
**Görsel modeli şeffaf zemin üretmiyor:** küçük 3D nesneler (pano, sandık, ödül) 24 köşeli karo olarak kullanılır.
Jeton/elmas/yıldız (`Coin`, `Gem`, `Star` On/Off) OpenAI görselidir (kullanıcı isteği, 2026-11-03): düz magenta/yeşil zeminde
üretilip python ile şeffaflaştırılır, component içinde `img/coin` / `img/gem` / `img/star` (FIT) olarak durur — tüm instance'lar
otomatik güncellenir. Yıldız On = parlak altın, Off = mat koyu lacivert boş yıldız.

## Yapma listesi

- Düz, gölgesiz "web" butonu yapma — her buton/karo 3D tabanlı.
- Krem/ahşap dışında gri kart kullanma; saf siyah kullanma (koyu = `navy/900`).
- Scrim opaklığını boyaya bağlama (bağlı boya opaklığı kaybeder) — node opacity kullan.
- Token dışı renk kullanma (ip/pin renkleri yalnızca tahtada).
- 44 px'ten küçük dokunma alanı, kapatma yolu olmayan popup, ödül/fiyat bilgisi olmayan satın alma butonu yapma.
- Görsel içine yazı/logo koyma; metni kesik bırakma (Baloo 2 ExtraBold geniş, uzun etiketlerde M boyuta in).
