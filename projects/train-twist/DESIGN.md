# Train Twist — DESIGN.md

Kaynak: FigJam referans görselleri (24:831 splash, 24:835 onboarding, 24:839 home, 24:843 level-select, 24:851 game, 24:858 level-complete).
Tarz: sıcak, parlak, 3D-cartoon mobil bulmaca oyunu. Arka plan tam ekran resimli sahne (yeşil tepeler, kırmızı kiremitli kasaba, raylar);
UI üstünde krem paneller ve kalın, alt kenarı koyu "basılabilir" butonlar.

## Renk token'ları (`tt/color/*`)
| token | hex | kullanım |
|---|---|---|
| primary | #3DBA2B | ana CTA (Bölüm 8, Devam, Treni başlat, Sonraki bölüm) |
| primary-dark | #23861A | CTA alt kenar/gölge, aktif bölüm çerçevesi |
| secondary | #2F7DE1 | ikincil buton (Bölümler, Kasaba, Tekrar oyna, Ana ekran), ikon daireleri |
| secondary-dark | #1C58A8 | ikincil buton alt kenar |
| surface | #FFF7E6 | krem panel/kart, üst bar hapları |
| surface-edge | #E9D3A8 | panel kenarı |
| ink | #5A2E14 | başlık ve gövde metni (koyu kahve) |
| ink-soft | #8A5A3A | yardımcı metin |
| on-color | #FFFFFF | buton üstü metin |
| wood | #F2A43A | açık bölüm kutusu |
| wood-dark | #B8661C | ahşap kenar |
| stone | #A7ABB0 | kilitli bölüm kutusu |
| stone-dark | #6E7378 | kilitli kenar, kilit ikonu |
| star | #FFC21A | yıldız |
| coin | #F5B014 | para |
| danger | #E5483B | uyarı rozeti, hata |
| scrim | #2B1A0E @ 55% | modal arkası |

## Tipografi
- Display: **Baloo 2 ExtraBold** (Türkçe Ğ/Ş/İ/ı destekli). Başlık 32/36, ekran başlığı 26/30, buton L 26, buton M 18.
- Gövde: **Nunito Bold** 16/22, küçük 14/18; sayı/etiket Nunito ExtraBold.
- Buton ve başlık metni hiçbir zaman ince font kullanmaz.

## Biçim
- Köşe: buton L 22, buton M 16, panel 24, hap 999, bölüm kutusu 16.
- "Basılabilir" kalınlık: butonlarda alt kenar = koyu ton, 5 px (drop shadow y=5, blur 0) + yumuşak gölge y=8 blur 16 %18.
- Panel: surface + 3 px surface-edge iç kenar + yumuşak gölge.
- Boşluk ölçeği: 4, 8, 12, 16, 20, 24, 32. Ekran kenarı 16.
- Dokunma alanı ≥ 48 (ikon butonları 48×48).

## Component listesi (Figma "Components" sayfası)
- `Button` — variant: style=primary|secondary, size=L|M; ikon + metin.
- `IconButton` — 48×48 krem daire, kahve ikon (pause, settings, back, close).
- `ActionCircle` — 64 mavi daire + altında etiket (Yeniden başlat, İpucu); opsiyonel para rozeti.
- `StatPill` — krem hap: ikon (yıldız/para) + sayı.
- `TimerPill` (50:1232) — StatPill türevi: saat ikonu + `mm:ss`. Bulmaca (oyun) ekranlarında TopBar'ın altında ortalı `TimerRow` içinde; süre 1–3 dk (bölüm başı 03:00 → azalır), ≤01:15 ise metin `danger`. Oyun ekranları bu yüzden 430×986.
- `TopBar` — sol IconButton, orta başlık hapı, sağ StatPill'ler.
- `Panel` — krem kart, başlık + içerik slotu.
- `LevelTile` — state=done|current|locked; numara + yıldız/tren/kilit.
- `RewardItem` — büyük yıldız/para + "+1"/"+50".
- `Switch` — oyun tahtasındaki makas düğmesi (yeşil daire, ok ikonu), state=straight|turn.
- `RailTile` — oyun tahtası karesi 62×62 (radius tile); type=empty|straight|curve|switch|start-red|start-blue|dest-build|dest-water,
  rotation=0|90|180|270 (yalnız anlamlı olanlar). Her kare kendi görseli (`img/tile-*`, dolgu rotation ile döner); switch'te
  boolean `Makas` → 32px Switch göstergesi. Kütüphanede duruyor; oyun ekranındaki tahtada artık kullanılmıyor (aşağıya bakın).
- Oyun tahtası (2026-11-03, kullanıcı isteği "FigJam referans puzzle görseliyle birebir aynı"): `img/game-board` tek şeffaf görsel,
  398×300. İçinde 4×4 çim karo, kıvrımlı raylar (karo kenarlarını aşar), 4 yeşil makas düğmesi, solda iki trenli istasyon, sağ üstte inşaat,
  sağ altta su kulesi var. Kaynağı `references/figjam-game-board.png` (refImage). Raylar kareleri aştığı için RailTile ızgarası bırakıldı.
- Oyun tahtası güncellemesi (2026-11-05, kullanıcı isteği): BoardArt içindeki çim+ray katmanları yerine 4×4 kare kare ızgara (56 px, x96/y38, `tile-<satır>-<sütun>-<tür>`).
  Düz ray = kütüphane `image-10` (hash d8d44e44…), kıvrım = `arcon-ai-gorsel-…` (hash 6c33a5e4…, 0° = sol-alt; saat yönünde döndürülür), boş kare = düz yeşil. Makas/tren/istasyon/hedef katmanları üstte kaldı.
- `Toggle` — ayar anahtarı (2026-11-03, Ayarlar ekranı için): 60×34 hap, state=on (primary, alt kenar primary-dark) | off (stone, alt kenar stone-dark),
  28 px beyaz düğme; satır yüksekliği 56 → dokunma alanı ≥ 48.
- `ImageArea` — `img/<id>` görsel alanı (placeholder ikon gizlenir, görsel yerleşince).

## Görseller (img/<id>)
Ortak stil (manifest `style`): "Bright 3D cartoon mobile game art, crisp polished rendering, razor-sharp focus everywhere,
no blur, no depth of field, no bokeh, warm sunny light, lush green hills, red-tile-roof European village, wooden railway tracks,
saturated cheerful colors, no text, no UI."
Tüm görseller `quality: high`, en üst OpenAI görsel modeliyle; hiçbir görselde bulanıklık yok (2026-11-03, kullanıcı isteği).
Arka planlar tam ekran (430×930); karakter, tren, bina gibi nesneler şeffaf PNG.
Yıldız ve coin ikonları da görseldir: `Icon/star` / `Icon/coin` component'lerinde `img/icon-star` / `img/icon-coin` görsel katmanı
(parlak 3D altın yıldız / altın para, şeffaf); StatPill, RewardItem, LevelTile, ipucu rozeti bunlardan beslenir.

Tüm görseller FigJam referanslarından `refImage` ile üretilir (2026-11-03, kullanıcı isteği): sahneler tam referans ekranından
(`references/figjam-*-x.png`), nesneler referansın kırpılmış parçasından (`references/crop-*-x.png`), magenta zeminde → şeffaf.

## Ekran kalıpları
- Ana ekran (ref 24:839): tam ekran sahne + TopBar; altta tam genişlik krem alt panel (surface, üst köşe 24, 3 px surface-edge): "Kasaba" başlığı + ilerleme çubuğu (1/5) + "Sıradaki: Kereste Deposu ★3" hapı, ardından "Sıradaki bölüm", CTA ve ikincil butonlar. Güncelleme 2026-11-04 (kullanıcı referansı).
- Diğer menü ekranları: tam ekran arka plan görseli + üstte TopBar + altta krem panelde CTA grubu.
- Modal ekranlar (tamamlandı, duraklat, uyarılar) (ref 24:858): arka planda sahne + hafif scrim (tamamlandı 0.18, oyun üstü 0.45) + ortada Panel;
  başlık `img/ribbon` yeşil kurdele görseli (panel genişliğinde, ~5:1) + üstünde beyaz Baloo 2 ExtraBold 26–27, koyu yeşil 3 px alt gölge.
- Oyun (FigJam ref 24:851 ile birebir): çayır arka planı (gökyüzü + kenarlarda ağaç) + TopBar (pause, "Bölüm N", yıldız) + teslimat hedefleri
  paneli (başlık 22, tren 160×64 → hedef 112×72) + Board (`img/game-board`, zemin/çerçeve yok) + alt panel: ekranın altına yaslı, tam genişlik,
  yalnız üst köşeler 28, absolute (constraints bottom). İçinde ActionCircle'lar + primary CTA "TRENİ BAŞLAT".

- Kalan ekran kalıpları (2026-11-03, design-rest): Açılış = sahne + üstte logo görseli (`img/splash-logo`, yazı yalnız "TRAIN TWIST")
  + "Küçük Demiryolu" Figma metni + altta yükleme çubuğu (surface iz, primary dolgu, hap). Tanıtım = üstte tam genişlik `img/onboarding-hero`,
  altında üst köşeleri 32 krem panel (hero'ya 32 px biner), başlık 30, gövde, 3 nokta (aktif primary), primary "Devam", sağ üstte "Geç" hapı.
  Uyarı/onay modalleri `paused` kalıbıyla (Scrim + Modal + Panel + kurdele); vurgu halkası = star rengi 4 px halka + `img/hand-pointer`.
  Bölüm seçimi = oyun arka planı + TopBar (geri) + 4 sütun LevelTile ızgarası + altta primary CTA.

## Yapma listesi
- Düz, flat-ikon tarzı arka plan kullanma; sahne her zaman resimli.
- Görsellerde blur / alan derinliği / bulanık arka plan yok; görseli büyüterek (upscale) yerleştirme.
- Token dışı renk, ince font, 44'ten küçük dokunma alanı yok.
- Metinde İngilizce kalıntı ya da "Lorem" yok; tüm metin Türkçe.
- Kahve metni koyu zemine koyma; koyu zeminde beyaz + gölge.
- Modalda kapatma/geri yolu eksik bırakma.
