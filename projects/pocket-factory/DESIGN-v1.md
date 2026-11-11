# Pocket Factory — DESIGN.md

Tek tasarım kaynağı. Kaynak: FigJam referans paftası `8:768` (21 ekranlık Türkçe oyun arayüzü montajı) + `7:7xx` tam ekranlar.
Tarz: parlak, tombul, 3D/cartoon casual mobil oyun. İzometrik oyuncak fabrikası sahnesi arka planda, üstünde krem paneller,
renkli kurdele başlıklar, kalın "basılabilir" butonlar, maskot robot Pito.

## Renk token'ları (Figma variable koleksiyonu `PF Tokens`)

| Token | Hex | Kullanım |
|---|---|---|
| `green/500` | #4CC33A | birincil buton (Devam Et, Evet, Başla, Tamam) |
| `green/700` | #2E8F22 | yeşil buton alt dudağı / koyu yeşil |
| `blue/500` | #3B8CF0 | ikincil buton (Yeniden Başlat, Fabrikama Dön), bilgi |
| `blue/700` | #2160C0 | mavi buton alt dudağı |
| `orange/500` | #FFA21F | vurgulu eylem (Sonraki Dünya, Mağazaya Git, Anladım) |
| `orange/700` | #D96F00 | turuncu buton alt dudağı |
| `red/500` | #E8463C | başarısız kurdelesi, hata vurgusu |
| `red/700` | #A82A24 | kırmızı kurdele gölgesi |
| `purple/500` | #7C4DE6 | "Yeni" kurdelesi (Yeni Makine, Final) |
| `purple/700` | #5230A8 | mor kurdele gölgesi |
| `gold/400` | #FFD23F | yıldız, coin, ödül vurgusu |
| `gold/600` | #F2A900 | yıldız/coin kenarı, altın kurdele gölgesi |
| `neutral/btn` | #E4DEF2 | nötr buton (İptal, Ana Menü) |
| `neutral/btn-lip` | #B5ADCB | nötr buton alt dudağı |
| `panel/bg` | #FFF6E6 | krem modal paneli |
| `panel/inset` | #F5E7CE | panel içi kutu (ödül satırı, liste öğesi) |
| `panel/stroke` | #FFFFFF | panel iç kenarı (3 px) |
| `ink/900` | #3A2E5C | panel üstü başlık/metin (mor-lacivert) |
| `ink/600` | #6E6488 | panel üstü ikincil metin |
| `hud/bg` | #1E2547 | HUD hapı, kapat/duraklat düğmesi zemini |
| `hud/stroke` | #3A4680 | HUD hapı kenarı |
| `scrim` | #141833 | arka plan karartma (node opacity 0.80) |
| `white` | #FFFFFF | buton metni, kurdele metni |

Token dışı renk kullanma. Arka plan sahnesi görseldir (img), düz renk değil.

## Tipografi

- **Display / kurdele başlığı:** Lilita One 32 / 36, beyaz, gölge 0 3 0 rgba(0,0,0,.35). Türkçe karakterleri destekler.
- **Panel başlığı:** Lilita One 28 / 32, `ink/900`.
- **Büyük sayı (ödül):** Lilita One 32, `ink/900`.
- **Buton:** Baloo 2 Bold 20, beyaz (nötr butonda `ink/900`), gölge 0 2 0 rgba(0,0,0,.25).
- **Gövde:** Baloo 2 Medium 16 / 22, `ink/600`, ortalı.
- **Etiket / küçük:** Baloo 2 SemiBold 13 / 16.
- **HUD değeri:** Baloo 2 Bold 16, beyaz.

## Ölçü

- Ekran 430 × min 930, dikey auto layout, yatay kenar 16, alt safe area 34, üstte StatusBar 47.
- Boşluk ölçeği: 4 · 8 · 12 · 16 · 20 · 24 · 32.
- Köşe: buton 18, panel 32, panel içi kutu 20, hap/HUD tam yuvarlak, ikon düğmesi 16.
- Dokunma alanı ≥ 48 (buton yüksekliği 56, ikon düğmesi 48).

## Component'ler (Figma sayfası `Components`)

- `Button` — `Variant=Green|Blue|Orange|Neutral`, `Size=L|M`. 3D görünüm: dolgu + 5 px koyu alt dudak (y-offset gölge, blur 0)
  + üstte ince beyaz iç parlama. İsteğe bağlı sol ikon (`Show icon`, `Icon` swap). L: 56 yükseklik, M: 44.
- `IconButton` — 48×48, `hud/bg` zemin, 2 px `hud/stroke`, beyaz ikon (`close`, `pause`, `back`, `settings`).
- `CurrencyPill` — `hud/bg` hap, solda yıldız ya da coin rozeti, sağda değer (Baloo 2 Bold 16).
- `Ribbon` — kurdele başlık: `Color=Red|Green|Purple|Gold|Blue` (Red başarısız, Green başarı/yenileme, Purple yeni/özel teklif, Gold büyük ödül/dünya, Blue bilgi paneli), kıvrık uçlar + Lilita One 30 beyaz metin.
- `Panel` — krem modal kartı (frame deseni, component değil): `panel/bg`, 32 köşe, 3 px beyaz iç kenar, gölge 0 10 0 rgba(0,0,0,.18) + 0 24 48 rgba(0,0,0,.35); iç dolgu 24, aralık 16.
- `RewardChip` — `panel/inset` kutu, ikon (coin/yıldız) + "+100" Lilita One.
- `StatusBar` — 47 yükseklik, beyaz saat ve sistem ikonları.
- `Icon/*` — 24 px vektör ikonlar: close, pause, back, settings, play, video, restart, arrow-right, check, lock, unlock, home, star, coin, bolt, bulb (ipucu).
- Oyun tahtası alt barı (desen): 72×72 `hud/bg` kare karo (köşe 18, 2 px `hud/stroke`) içinde 26 px beyaz ikon + Baloo 2 Bold 13 etiket;
  yanında tam genişlikte yeşil `Başlat`. Bedel rozeti: `gold/400` hap, `ink/900` Bold 13, karonun sağ üstüne biner.

## Ekran kalıbı

1. Kök: `bg` görseli (absolute, stretch) + `scrim` (absolute, opacity 0.80) → StatusBar → HUD satırı → `Body` (dikey ortalı) → alt safe area.
2. HUD: solda IconButton (kapat/duraklat/geri), sağda CurrencyPill'ler (yıldız, coin).
3. Modal: Ribbon panelin üst kenarına biner (Panel üstünde -28 px, auto layout içinde negatif boşlukla değil, Ribbon + Panel bir "Modal" frame'inde dikey, aralık -28).
4. Panel içi: kahraman görseli (img, 20 köşe) → başlık/metin → ödül/bilgi satırları → buton(lar). Birincil buton tam genişlik; iki seçenekte yan yana (İptal solda nötr, onay sağda yeşil).
5. Panelin altında gerekiyorsa ikincil metin bağlantısı ("Hayır, teşekkürler").

## Görseller (img/<id>)

Ortak stil: `Bright glossy 3D cartoon casual mobile game art, isometric toy factory world, soft rounded shapes, saturated
primary colors (red, blue, yellow, green), warm soft lighting, clean, high detail, Pocket Factory style.`
- `bg-factory` — tüm ekranlarda ortak arka plan sahnesi (bir kez üretilir, hash kopyalanır).
- Kahraman görselleri panel içinde dikdörtgen, krem/açık zemine oturan sahneler; metin, harf, logo yok.

## Yapma listesi

- Düz, flat butona dönme: her buton alt dudaklı ve parlamalı olmalı.
- Gri-mavi kurumsal renkler, ince fontlar (Inter vb.) kullanma; başlıklar Lilita One, gövde Baloo 2 (Fredoka Türkçe Ş/İ içermiyor — kullanma).
- Panel üstünde beyaz metin, koyu zemin üstünde `ink` metin kullanma (kontrast).
- Kapat/geri yolu olmayan modal yapma (zorunlu karar ekranlarında bile İptal ya da X olmalı).
- Tek ekranda birden fazla yeşil birincil buton yapma.
- 48 px'ten küçük dokunma alanı, 13 px'ten küçük metin yok.
- İngilizce metin bırakma (Level, Retry vb.) — tüm arayüz Türkçe.
- Görsel alanına placeholder bırakma; görseller yerleşmeden önizleme alma.
