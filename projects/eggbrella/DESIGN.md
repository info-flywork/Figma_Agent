# Eggbrella — DESIGN.md

Kaynak: FigJam referans görselleri (8:333–8:342), 2026-11-09. Tasarım dili tamamen bu görsellerden çıkarıldı; marka kütüphanesi kullanılmadı.
Ton: sıcak, sevimli, 3D çizgi film (Pixar benzeri yumuşak ışık). Sahne = tuğla apartman cephesi; UI = üstte yüzen krem kartlar, kalın yuvarlak yazı, parlak yeşil buton.

## Referans eşleşmesi
| Ref | Ekran |
|---|---|
| 8:333 | yeni-rekor |
| 8:334 | sayac |
| 8:335 | devam-teklifi (kırılma sahnesi + kart) |
| 8:336 | oyun-kapali (Bölge 3 gece neon örneği) |
| 8:337 | oyun-acik (Bölge 2 cam ofis örneği) |
| 8:338 | oyun-acik (Bölge 1, tente sekmesi) |
| 8:339 | oyun-kapali (Bölge 1, güvercin + çamaşır ipi) |
| 8:340 | ipucu + oyun-baslangic (oyun-baslangic = ipucu kartı olmadan) |
| 8:341 | ana-sayfa |
| 8:342 | acilis |

## Token'lar (Figma variable: koleksiyon `Eggbrella`)
Renk
- `color/navy` #1E2A4A — ana metin, yazı konturu, ikon
- `color/navy-soft` #5A6380 — ikincil metin ("Hayır, teşekkürler")
- `color/cream` #FFF7E6 — kart zemini
- `color/cream-line` #EADBC0 — kart içi ayraç, kart kenarı
- `color/white` #FFFFFF — HUD yazısı, yuvarlak ikon butonu
- `color/green` #34B233 — birincil buton; `color/green-dark` #1E7F22 — buton alt gölgesi/kontur
- `color/yellow` #FFC83D — başlık etiketi (Kırıldın!, Yeni rekor!); `color/yellow-dark` #E09A12
- `color/red` #E53935 — şemsiye/vurgu
- `color/sky` #7FC4F2 — gökyüzü
- `color/scrim` #1E2A4A, katman opaklığı 0.55 (popup arkası)
Boşluk: 4, 8, 12, 16, 20, 24, 32. Köşe: `radius/pill` 999, `radius/card` 24, `radius/md` 16.

## Tipografi (Türkçe glif testi: Baloo 2 geçer; Fredoka Ş/İ eksik — kullanma)
- Display: Baloo 2 ExtraBold 40/44 — "0. kat" HUD sayaç (beyaz, navy 3 px dış kontur), büyük skor
- Title: Baloo 2 ExtraBold 28/32 — kart başlık etiketi
- Button: Baloo 2 ExtraBold 22/26 — beyaz, yeşil buton üstünde
- Body: Baloo 2 Bold 18/24 — navy
- Caption: Baloo 2 SemiBold 14/18 — navy-soft
- HUD ipucu ("Başlamak için dokun"): Baloo 2 ExtraBold 22, beyaz, navy kontur 2 px

## Component'ler (Figma sayfası `Components`)
- `Button/Primary` — yeşil hap, 56 yükseklik, beyaz metin, alt 4 px koyu yeşil gölge, isteğe bağlı sol ikon
- `Button/Secondary` — krem hap, navy metin, cream-line kontur
- `Button/Text` — metin bağlantı ("Hayır, teşekkürler")
- `IconButton/Round` — 44×44 beyaz daire, navy Lucide ikon (pause, settings, x, home)
- `HUD/Floor` — üst orta "N. kat" sayaç
- `Card/Modal` — krem kart, radius 24, 24 iç boşluk, yumuşak gölge; üstte isteğe bağlı sarı `Label/Banner`
- `Label/Banner` — sarı hap, navy ExtraBold başlık
- `Row/Toggle` — ikon + etiket + anahtar (ayarlar)
- `Row/Select` — ikon + etiket + değer + chevron
- `Toggle` — 52×32 anahtar, açık = green

## Ekran kuralları
- 430×932, oyun ekranlarında tam ekran sahne görseli (absolute, arkada); HUD absolute üstte (safe area 54 px).
- Popup'lar: sahne + navy scrim 0.55 + ortada `Card/Modal` (genişlik 366, kenar 32).
- İkonlar yalnızca Lucide; çizim/3D öğeler (Yumi, sahne) OpenAI görseli.

## Görsel tarifi (manifest `style`)
Cute 3D cartoon render, soft warm sunlight, Pixar-like, terracotta brick apartment facades with cream stone window frames,
black iron balconies with potted green plants, light blue sky, crisp sharp focus everywhere, no depth of field, no blur.
Karakter Yumi: krem yumurta, büyük parlak kahverengi gözler, pembe yanaklar, beyaz eldivenli el, kırmızı-beyaz dilimli şemsiye, kahverengi baston sap.

## Yapma listesi
- Düz/ince yazı yok; başlıklar kalın yuvarlak (Baloo 2 ExtraBold).
- Token dışı renk yok; saf siyah metin yok (navy kullan).
- Referanstan kırpılmış görseli ekrana koyma (yalnızca üretim girdisi).
- 44 px altı dokunma alanı yok; popup'larda her zaman kapatma/geri yolu.
- Sahne görselinin üstüne scrim'siz okunmaz metin koyma (HUD metinleri navy konturlu).
