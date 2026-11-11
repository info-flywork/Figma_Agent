# Pocket Factory — ekran akışı

Kaynak: FigJam `63Y2EiIMk3sUMljdur6eqE` (V4, yeniden okundu 2026-11-06). Türkçe mobil bulmaca/fabrika oyunu: oyuncak ürünleri (araba vb.) makineler
(Giriş → Şekillendir → Boya → Paketle → Çıkış) arasında yönlendiricileri 90° döndürerek doğru sırayla işleyip çıkışa ulaştır.
Oyun yapısı: 10 dünya × 20 bölüm (B001–B200). Para birimleri: coin ve yıldız. İlk tamamlamada 1 yıldız + 50 coin. Hamle (döndürme) limiti, ipucu (ilk 3 bölüm ücretsiz, sonra 100 coin),
bina yenileme (yıldızla), ödüllü reklamla ödülü ikiye katlama.

Referanslar:
- 52:1143 — "Pocket Factory Mini Fabrika Tasarım Panosu 1" (2026-11-06'da panoda tek görsel): 01 Splash, 02–04 Tanıtım 1–3, 05 Tutorial Bölüm 1,
  06 Tutorial Sonu, 07 Ana Menü, 08 Dünya Seçimi, 09 Bölüm Seçimi, Kolay/Orta/Zor bölüm tahtası örnekleri (B5, B58, B142), yeni mekanikler listesi
  (Ayırıcı Bant, Birleştirici, Montaj Makinesi, Renk Karıştırıcı, Robot Kol, Sıralayıcı, Kilitli Bant, Çoklu Çıkış), 10 İpucu, 11 Başarısızlık,
  12 Duraklatma, 13 Dünya Tamamlama, 14 Ürün Koleksiyonu.
- Eski referanslar (8:768 montaj paftası, 7:741–7:751) panodan kaldırılmış; onaylı tasarım dili bunlardan çıkarılmıştı.
- Görsel tarz (onaylı): parlak 3D/cartoon casual oyun, izometrik oyuncak fabrikası; krem paneller, renkli kurdele başlık, Lilita One başlık,
  yeşil birincil buton, mavi ikincil buton, sarı/turuncu vurgular, maskot robot "Pito".

## 01-giris-fabrika
- `splash` — 01-01 — Açılış (logo, yükleme çubuğu) · ref: 52:1143
- `resume-prep` — 01-02 — Kayıtlı hazırlığa dön (yarım kalan bölüm)
- `intro-1` — 01-03 — Tanıtım 1: Kendi mini fabrikanı yönet · ref: 52:1143
- `intro-2` — 01-04 — Tanıtım 2: Bantları çevir, rotayı kur · ref: 52:1143
- `intro-3` — 01-05 — Tanıtım 3: Üretimi başlat ve tamamla · ref: 52:1143
- `tutorial` — 01-06 — İlk öğretici (B001, robot rehber) · ref: 52:1143
- `tutorial-complete` — 01-07 — Öğretici sonu (üretim tamamlandı, +1★ +50 coin) · ref: 52:1143
- `factory-home` — 01-08 — Fabrika ana sayfa · ref: 52:1143
- `world-select` — 01-09 — Dünya seç · ref: 52:1143
- `world-locked` — 01-10 — Kilit açma koşulu (kilitli dünya)
- `level-select` — 01-11 — Bölüm seç (dünya bölüm haritası) · ref: 52:1143
- `level-locked` — 01-12 — Kilitli bölüm uyarısı
- `building-upgrade` — 01-13 — Bina yenileme (yıldızla yükselt)
- `upgrade-celebration` — 01-14 — Yenileme kutlaması
- `settings` — 01-15 — Ayarlar
- `product-collection` — 01-16 — Ürün koleksiyonu · ref: 52:1143

## 02-hazirlik-uretim
- `level-mission` — 02-01 — Bölüm görevi / sipariş ve reçete (üretilecek ürün, ödüller, Başla)
- `new-machine` — 02-02 — Yeni makine tanıtımı
- `prep-board` — 02-03 — Hazırlık (oyun tahtası, yönlendirici döndürme) · ref: 52:1143
- `fixed-part` — 02-04 — Sabit parça uyarısı
- `out-of-moves` — 02-05 — Hamle limiti bitti uyarısı
- `production-queue` — 02-06 — Üretim sırası paneli
- `production-run` — 02-07 — Üretim simülasyonu (yönler kilitli)

## 03-sonuc-ilerleme
- `production-failed` — 03-01 — Üretim hatası (hata nedeni vurgusu) · ref: 52:1143
- `level-complete` — 03-02 — Bölüm tamamlandı (ödül)
- `double-reward` — 03-03 — Ödülü ikiye katla (ödüllü reklam)
- `world-complete` — 03-04 — Dünya tamamlandı / yeni dünya açıldı (20. bölüm) · ref: 52:1143
- `grand-final` — 03-05 — 200 bölüm finali

## 04-ipucu-duraklatma
- `hint` — 04-01 — İpucu (doğru kavşak vurgusu) · ref: 52:1143
- `insufficient-coins` — 04-02 — Yetersiz coin
- `paused` — 04-03 — Duraklatıldı · ref: 52:1143
- `restart-confirm` — 04-04 — Yeniden başlat onayı

## Akış notları (FigJam V4)
- 01 Açılış: Splash → ilk giriş mi? Evet → Tanıtım 1 → Tanıtım 2 → Tanıtım 3 → B001 öğretici. Hayır → Ana menü (Fabrika ana sayfa).
  Kayıtlı yarım bölüm varsa → Kayıtlı hazırlığa dön (tasarım ekranı; V4 FigJam'de ayrı kutu yok, "Kayıtlı → 3. alan" notu).
- 02 Bölüm 1 (oynayarak öğren): 1 kırmızı oyuncak araba → kavşağa dokun → doğru yön mü? Hayır → tekrar vurgula; Evet → Başlat → Şekil → Boya → Paketle → Başarı: +1★ +50 coin (Öğretici sonu) → B002 / Fabrika.
- 03 Fabrika ve seçimler: Fabrika ana sayfa → Dünya seç → dünya açık mı? Hayır → Kilit koşulu. Evet → Bölüm seç → bölüm açık mı? Hayır → Kilitli bölüm. Evet → Hazırlığa geç.
- 04 Hazırlık ve üretim: Sipariş ve reçete → 90° kavşağı döndür → dönen parça mı? Hayır → Sabit parça. → BAŞLAT → Üretim simülasyonu → Sonucu denetle.
- 05 Başarı/başarısızlık: tüm ürünler doğru mu? Evet → Bölüm tamamlandı → ilk kazanış mı? Evet → +1★ +50 coin → Sonraki bölüm. Hayır → Üretim hatası → Tekrar dene / İpucu.
- 06 İpucu ve duraklatma: İpucu butonu → ilk 3 bölüm mü? Evet → doğru kavşak vurgusu; Hayır → 100 coin denetimi (yetersizse Yetersiz coin). Duraklat → Devam / Yeniden başlat → Onay / Ayarlar. Kapanınca geldiği ekrana dön.
- 07 Dünya ve final: Bölüm tamamlandı → 20. bölüm mü? Hayır → sonraki bölüm. Evet → Yeni dünya açıldı → Yeni makine tanıtımı → B200 tamamlandı mı? Evet → 200 bölüm finali.
- Tasarımda olup V4 FigJam'de kutusu olmayan (korundu): `resume-prep`, `building-upgrade`, `upgrade-celebration`, `out-of-moves`, `production-queue`, `double-reward`, `restart-confirm`.
- `product-collection` yalnızca referans panoda var; giriş noktası (hangi butondan açıldığı) FigJam'de yok — Belirsiz.
