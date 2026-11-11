# Woodbloom — ekran akışı

Kaynak: FigJam `mikmBoynyftwWuELlmdU1A` (2026-11-09). Board'da görsel/referans node'u bulunmadı; `ref:` yok.
Not: Akışta ekran olarak kutu bulunmayan ama gerekli olanlar (oyun tahtası, yerleşim önizleme) ekran olarak eklendi.

## 01-baslangic
- `splash` — 01-01 — Açılış: WOODBLOOM logosu, Fındık, yükleme çubuğu ve ipucu
- `egitim` — 01-02 — Eğitim 1/3: parçayı sürükle, satırı patlat
- `egitim-2` — 01-03 — Eğitim 2/3: satır ve sütun dolunca patlar, kombo puanı
- `egitim-3` — 01-04 — Eğitim 3/3: Cep'i kullan, sığmayan parçayı sakla (Başla)
- `ana-sayfa` — 01-05 — Ana sayfa (Oyna, Bahçe, Ayarlar; yarım kalan oyun varsa Devam)

## 02-oyun
- `oyun-tahta` — 02-01 — Oyun: 8x8 tahta, rafta 3 parça, Cep
- `oyun-surukle` — 02-02 — Parça sürükleniyor, yerleşim önizlemesi
- `oyun-patlama` — 02-03 — Satır/sütun patlaması: yaprak ve çiçek, tohum puanı, kombo

## 03-oyunsonu
- `devam-teklifi` — 03-01 — Teklif: 100 yaprak ver, 3 küçük parça al ve devam et (yetersiz bakiye → mağaza)
- `oyun-sonu` — 03-02 — Oyun sonu: skor, rekor, kazanılan tohum

## 04-cep
- `cep-dolu` — 04-01 — Cep'te parça saklı, rafta yer boş
- `cep-yerlestir` — 04-02 — Cep'teki parçayı tahtaya sürükle

## 05-duraklatma
- `duraklatma` — 05-01 — Duraklatma ekranı: Fındık uyuyor (Devam et, Yeniden başla, Ana sayfa, Ayarlar)
- `yeniden-basla-onay` — 05-02 — Emin misin? Skor kaybolur

## 06-ayarlar
- `ayarlar` — 06-01 — Ayarlar paneli: ses/müzik, titreşim, dil, bildirim, gizlilik, satın alımları geri yükle
- `dil-secimi` — 06-02 — Dil seçimi

## 07-bahce
- `bahce` — 07-01 — Bahçe sahnesi: parseller ve Fındık
- `bahce-yetersiz` — 07-02 — Tohum puanı yetersiz: kaç satır kaldığını göster
- `tohum-sec` — 07-03 — Tohum seç ve ek
- `bahce-buyume` — 07-04 — Fındık sular, bitki bir aşama büyür
- `bahce-yeni-alan` — 07-05 — Yeni bahçe alanı ve yeni dekor açıldı

## 08-duello
- `duello-internet-yok` — 08-01 — Düello için internet gerekli
- `duello-paylas` — 08-02 — Düello linki oluşturuldu, paylaşım menüsü (WhatsApp, mesaj, kopyala)
- `duello-ekrani` — 08-03 — Düello ekranı: rakibin skoru gizli
- `duello-sonuc` — 08-04 — Sonuç: iki skor yan yana, kazanan (Rövanş, Ana sayfa)
- `duello-bildirim` — 08-05 — Meydan okuyana sonuç bildirimi

## 09-magaza
- `magaza` — 09-01 — Mağaza: yaprak paketleri (500 / 1.200 / 3.000 / 7.500), yardımcı paketler (Cep +1, Karıştır x3, Bomba x3), satın alımları geri yükle
