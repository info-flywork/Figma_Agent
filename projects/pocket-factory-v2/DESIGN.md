# Pocket Factory v2 — DESIGN.md

Kaynak: FigJam referans panosu `52:1143` ("Pocket Factory Mini Fabrika Tasarım Panosu 1"). Tasarım dili tamamen bu panodan çıkarıldı;
marka kütüphanesi kullanılmadı. Kırpıntılar: `assets/crops/ref-*.png`.

Not: Figma dosyası v1 (`pocket-factory`) ile ortak. v2 yalnızca **"Ekranlar v2"** ve **"Components v2"** sayfalarında ve
**"PF v2 Tokens"** koleksiyonunda çalışır; v1 sayfalarına dokunulmaz.

## Karakter
Parlak, sıcak, oyuncak gibi 3D casual mobil oyun. Gökyüzü mavisi zemin, krem kartlar, kalın yuvarlak başlıklar,
alt kenarı koyu "basılabilir" 3D butonlar, altın yıldız/coin, bol ışık ve konfeti. Çizimler 3D render (Pixar/oyuncak stili).

## Renk token'ları (`PF v2 Tokens`)
| token | hex | kullanım |
|---|---|---|
| sky/top | #2F7FE3 | ekran gradyan üstü |
| sky/bottom | #9ED3F7 | ekran gradyan altı |
| navy/900 | #1B2F6B | başlık bandı, koyu başlık metni |
| navy/700 | #2B4FA3 | oyun ekranı zemini |
| cream/50 | #FFF7F2 | kart zemini |
| cream/100 | #F6E9E1 | ikincil buton, ayırıcı |
| cream/stroke | #E3D2C8 | kart kenarı |
| ink/900 | #1E2230 | kart içi metin |
| ink/500 | #5B6072 | ikincil metin |
| green/500 | #35B93A | birincil buton |
| green/700 | #1C8A26 | birincil buton alt kenar |
| orange/500 | #FF8B1F | intro/tanıtım butonu, oynat |
| orange/700 | #D75F00 | turuncu buton alt kenar |
| gold/400 | #FFC425 | yükleme çubuğu, yıldız vurgusu |
| red/500 | #E8413A | hata, kırmızı ürün |
| scrim | #141A33 (node opacity 0.8) | duraklat arka planı |
| white | #FFFFFF | başlık metni (mavi zemin üstü) |

## Tipografi
Türkçe glif testi geçen font: **Baloo 2** (Lilita One/Fredoka kullanılmaz — Ğ/Ş/İ eksik).
- Display: Baloo 2 ExtraBold 40/44 (beyaz, navy gölge 0,3) — "Üretim Tamamlandı!"
- Title: Baloo 2 ExtraBold 28/32 — modal ve bant başlıkları
- Button: Baloo 2 ExtraBold 22/28 (büyük), 18/24 (orta)
- Body: Baloo 2 Bold 18/24; Label: Baloo 2 SemiBold 16/20; Caption: Baloo 2 SemiBold 14/18

## Biçim
- Köşe: ekran kartı 24, kart 20, buton 18, küçük kare buton 16, ödül hapı 20.
- 3D buton: dolgu + alt kenar gölgesi (DROP_SHADOW 0,5 blur 0, renk */700) + hafif iç parlama (beyaz %35 üst inner shadow 0,2).
- Kart: cream/50 + 2 px cream/stroke + gölge 0,4 blur 0 #000 %12.
- Boşluk: 4'ün katı; ekran kenarı 16, kart içi 16–20, buton arası 12.
- Dokunma alanı ≥ 56 (büyük butonlar 64 yükseklik).
- İkonlar: Lucide (UI: play, rotate-ccw, settings, house, x, undo-2, redo-2). 3D ikonlar (coin, yıldız, ampul, ürün, makine) OpenAI görseli.

## Component'ler (`Components v2`)
- `Button` — Variant: Primary (yeşil) / Orange / Secondary (krem, ink metin); Size: L (64) / M (52). Opsiyonel sağ/sol ikon.
- `IconButton` — 64×64 krem kare, Lucide ikon (undo/redo/pause).
- `MenuButton` — krem, tam genişlik 64, solda 32 px ikon, ortada etiket (Duraklat menüsü).
- `RewardPill` — beyaz %55 zemin, 3D ikon görseli 40 + "+50" Body ExtraBold 26.
- `CloseButton` — 52 daire krem, Lucide x.
- `Card` — krem kart kabı.

## Ekran kalıpları (design-rest, 2026-11-06)
- Intro/tanıtım zemini: dikey gradyan sky/top → sky/bottom; başlık beyaz + navy gölge, gövde navy/900 Bold 22.
- Öğretici: oyun ekranı + `TutorialBubble` (krem kart, işçi avatarı 72 + metin). Yanlışta kart kenarı red/500 3 px.
- Vurgu: `Highlight` = gold/400 5 px kenar + altın parıltı; dokunma ipucu `img/hand-pointer` (OpenAI). Sabit parça vurgusu red/500, parıltısız.
- `Toast`: krem kart, tahtanın üst kenarında ortalı, Lucide ikon 26 + ExtraBold 18.
- Kilitli kart/karo (dünya, bölüm): beyaz %18 cam zemin (bağlı olmayan paint — bağlı paint opaklığı kaybediyor), beyaz metin, Lucide lock.
- Hata ekranı: dikey gradyan red/500 → cream/100, ortada krem modal kart.
- Ayar anahtarı: 60×34 hap, açık green/500, kapalı cream/stroke, beyaz düğme 26.

## Görsel stili (manifest `style`)
"Bright glossy 3D casual mobile game render, toy-like Pixar style, soft studio lighting, saturated warm colors, sky blue and cream palette,
sharp focus, crisp clean edges, no depth of field, no blur, high detail."

## Referans ekranlar (onaya giden 5)
| ekran | panodaki karşılığı |
|---|---|
| splash | 01. Splash |
| bolum-tamam | 06. Tutorial Sonu ("Üretim Tamamlandı!") |
| bolum-tamam-2 | 13. Dünya Tamamlama (dünyanın 20. bölümü bitince) |
| duraklat | 12. Duraklatma |
| siparis-recete | Kolay Bölüm Örneği (Bölüm 5) + 05. Tutorial ekranının dikey yerleşimi |

## Yapma listesi
- Düz/flat buton yapma; her birincil buton 3D alt kenarlı.
- Token dışı renk, Inter ya da başka font kullanma.
- Mavi zemin üstüne gölgesiz beyaz ince metin koyma.
- Referanstaki çizimleri vektörle taklit etme; OpenAI görseli kullan.
- Ekranda placeholder metin/görsel bırakma.
