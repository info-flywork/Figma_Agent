# Woodbloom — DESIGN.md

Kaynak: FigJam'de referans görsel yok. Tasarım dili kullanıcının **kütüphanesinden** (`library.json`, 34 asset) çıkarıldı:
ahşap blok bulmaca + bahçe, maskot **Fındık** (hasır şapkalı, yeşil tulumlu kirpi). Sıcak, yumuşak 3D, el yapımı ahşap/keten dokular.
design-md-library kullanılmadı.

## Ruh hali
Sakin, sevimli, "ahşap oyuncak kutusu". Parlak ama doygunluğu ölçülü; neon yok, düz flat yok. Her yüzey bir malzeme gibi:
koyu ceviz çerçeve, akçaağaç panel, keten cep, yaprak yeşili buton.

## Renk token'ları (`Woodbloom/Color`)
| token | hex | kullanım |
|---|---|---|
| wood/900 | #4A2A12 | ana metin, ikon |
| wood/700 | #6B3F1F | panel çerçevesi, koyu buton kenarı |
| wood/500 | #A0652E | ikincil metin, ayraç |
| maple/300 | #E9C88E | panel iç kenar, pasif hücre |
| maple/100 | #F6E6C4 | panel zemini |
| cream/50 | #FBF5E6 | kart, açık buton |
| leaf/600 | #3E7B25 | birincil buton gölgesi |
| leaf/500 | #5FA83A | birincil buton, olumlu |
| orange/500 | #F07A1E | vurgu, oyuncu (sen), tehlike-yumuşak |
| orange/700 | #B9530C | turuncu buton gölgesi |
| sun/400 | #F5C02A | skor, tohum, ışıltı |
| sky/500 | #3FA3D9 | rakip |
| petal/300 | #F4A3B5 | çiçek, kombo süs |
| scrim | #2B1A0E @ 0.75 (node opacity) | modal arka perdesi |

Metin her zaman wood/900 ya da beyaz (yeşil/turuncu buton üstü). Token dışı renk yok.

## Tipografi
Tek aile **Baloo 2** (Türkçe glifleri tam). Fredoka / Lilita One kullanma (Ş, İ, ı eksik).
- Display 40/44 ExtraBold — sonuç başlığı, skor
- Title 28/32 ExtraBold — modal başlığı
- Heading 20/26 Bold — kart başlığı
- Body 17/24 SemiBold — açıklama
- Label 15/20 Bold — buton, rozet
- Caption 13/18 SemiBold — küçük not
Başlıklarda beyaz metin + wood/700 2 px dış kontur + 0,3 offset gölge (oyun tabelası hissi) yalnızca görsel zemin üstünde.

## Köşe, boşluk, gölge
- Köşe: 12 (hücre/çip), 20 (kart, buton), 28 (panel/modal), 999 (hap).
- Boşluk ölçeği 4/8/12/16/24/32. Ekran kenar boşluğu 16.
- "Ahşap derinlik": düz drop shadow yerine alt kenarda 4–6 px koyu ton (iç gölge benzeri) + yumuşak gölge `0 8 16 #4A2A12 @ 20%`.

## Component'ler (Figma, "Components" sayfası)
- **Button** — variant `Style = Primary | Secondary | Accent`, `Size = L (56) | M (48)`. Hap köşe, alt 5 px koyu ton.
  Primary leaf/500 + beyaz metin, Secondary cream/50 + wood/700 2 px kenar + wood/900 metin, Accent orange/500 + beyaz metin.
  Opsiyonel sol Lucide ikon (20 px).
- **IconButton** — 52×52 daire, cream/50, wood/700 2 px kenar, Lucide ikon 24 px wood/900.
- **TopBar** — sol IconButton, ortada skor kapsülü (maple/100, wood/700 kenar, Baloo 2 ExtraBold), sağda tohum sayacı.
- **Counter** — hap: ikon (görsel ya da Lucide) + sayı. Tohum = sun/400 nokta + "sprout" ikonu.
- **Panel** — modal kartı: maple/100 zemin, wood/700 6 px kenar, köşe 28, iç boşluk 24. Üstte isteğe bağlı yeşil kurdele başlık (kütüphane `lib-mw9ai7bb8l7`).
- **Tooltip/Hint** — cream/50 balon, wood/700 2 px kenar, köşe 20, kuyruklu.
- **Board** — kütüphane `lib-mw9ai77hubw` (8×8 ahşap tahta) görsel olarak; üstüne bloklar `lib-mw9ai76j4ey` (turuncu) ve `lib-mw9ai76s7j3` (sarı) hücre başına.
- **Tray** — 3 parçalık raf; zemin maple, parça önizlemeleri bloklarla.
- **Pocket (Cep)** — kütüphane `lib-mw9ai78185a` (boş) / `lib-mw9ai7879de` (parlayan, dolu).

## Görseller (kütüphane öncelikli)
Kütüphanede olan her şey **olduğu gibi** kullanılır: Fındık pozları (mutlu `79xwuz`, endişeli `7a1tex`, sulama `7a6u2u`, düşünen `7abh0w`,
uyuyan `7afq4z`), bloklar, tahta, cep, parçacıklar (yaprak/çiçek `78bhn3`, ışıltı `78hgbp`, patlama halkası `78tntk`, ışık izi `78kkn9`, toz `78ol6w`),
saksı/kasalar (`794y6l`, `798ue2`, `79bpvb`), bitki aşamaları `79gwyi`, dekor `79lsjy`, logo `7akn0x`, kurdele `7bb8l7`, düello çerçeveleri `7bh5j7`,
kupa tabelası `7bno56`, iç mekân zemini `79058b` (1024×1536).
Üretilecek görseller (OpenAI) ortak stil: "soft 3D cozy woodland game art, warm sunlight, hand-crafted wood and linen textures, gentle pastel greens,
sharp focus, no depth of field, no text". Karakter/obje → düz #FF00FF zemin + chroma key.

## İkonlar
Yalnızca Lucide (wood/900, 2.25 stroke). Sık: pause, settings, house, rotate-ccw, play, share-2, trophy, sprout, droplets, volume-2.

## Yapma listesi
- Düz flat renkli kare buton yapma; her buton ahşap/yaprak derinliğinde.
- Fındık'ı yeniden çizme ya da üretme; kütüphanedeki pozlar kullanılır.
- Saf siyah (#000) ve saf beyaz zemin kullanma; zemin krem/akçaağaç.
- Mavi yalnızca düello rakibi için.
- Dokunma alanı < 44 px yok; metin kontrastı wood/900 ya da beyaz-üstü-koyu.
- Modal'da kapatma/vazgeç yolu eksik olmasın.
- Fredoka, Lilita One, Inter kullanma.
