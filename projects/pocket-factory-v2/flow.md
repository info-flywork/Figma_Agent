# Pocket Factory — Mini Fabrika (v2) — Akış

Kaynak: FigJam `63Y2EiIMk3sUMljdur6eqE` (Page 1 akış; Page 2 mekanik/uygulama sözleşmesi, ekran değil).
Oyun: dikey mobil (Unity), taşıma bantlarındaki yönlendiricilere dokunup 90° döndürerek ürünü doğru makinelerden geçirme; 10 dünya × 20 bölüm = 200 bölüm.

Referanslar:
- 52:1143 — "Pocket Factory Mini Fabrika Tasarım Panosu 1" (tüm oyun tasarım panosu, genel görsel referans; tek ekrana bağlı değil)

## 01-acilis
Karar: "İlk giriş mi?" (evet → Intro 1; hayır → Ana Menü)
- `splash` — 01-01 — Splash · ref: 52:1143 (01. Splash)
- `intro-1` — 01-02 — Intro 1: Mini fabrika · ref: 52:1143 (02. Tanıtım 1)
- `intro-2` — 01-03 — Intro 2: Bandı döndür · ref: 52:1143 (03. Tanıtım 2)
- `intro-3` — 01-04 — Intro 3: Üretimi başlat · ref: 52:1143 (04. Tanıtım 3)
- `b001-ogretici` — 01-05 — B001 öğretici · ref: 52:1143 (05. Tutorial Bölüm 1)
- `ana-menu` — 01-06 — Ana Menü (ilk giriş değilse) · ref: 52:1143 (07. Ana Menü)
Geçiş: Yeni → 2. alan / Kayıtlı → 3. alan

## 02-bolum-1
Karar: "Doğru yön mü?" (hayır → tekrar vurgula)
- `b1-gorev` — 02-01 — 1 kırmızı oyuncak araba
- `b1-kavsak` — 02-02 — Kavşağa dokun
- `b1-baslat` — 02-03 — Başlat
- `b1-uretim` — 02-04 — Şekil → Boya → Paketle
- `b1-basari` — 02-05 — Başarı: +1★ +50 coin
- `b1-tekrar-vurgu` — 02-06 — Hayır → Tekrar vurgula
Geçiş: Başarı → B002 / Fabrika → 3. alan

## 03-fabrika
Kararlar: "Dünya açık mı?", "Bölüm açık mı?"
- `fabrika-ana` — 03-01 — Fabrika Ana Sayfa
- `dunya-sec` — 03-02 — Dünya seç · ref: 52:1143 (08. Dünya Seçimi)
- `bolum-sec` — 03-03 — Bölüm seç · ref: 52:1143 (09. Bölüm Seçimi)
- `hazirliga-gec` — 03-04 — Hazırlığa geç
- `kilit-kosulu` — 03-05 — Hayır → Kilit koşulu
- `kilitli-bolum` — 03-06 — Hayır → Kilitli bölüm
Geçiş: Oyna → 4. alan

## 04-hazirlik
Karar: "Dönen parça mı?" (hayır → sabit parça)
- `siparis-recete` — 04-01 — Sipariş ve reçete · ref: 52:1143 (Kolay Bölüm 5)
- `kavsak-dondur` — 04-02 — 90° kavşağı döndür
- `uretimi-baslat` — 04-03 — BAŞLAT
- `uretim-simulasyon` — 04-04 — Üretim simülasyonu
- `sonuc-denetle` — 04-05 — Sonucu denetle
- `sabit-parca` — 04-06 — Hayır → Sabit parça
Geçiş: Sonuç → 5. alan

## 05-basari-basarisizlik
Kararlar: "Tüm ürünler doğru mu?", "İlk kazanış mı?"
- `bolum-tamam` — 05-01 — Bölüm tamamlandı · ref: 52:1143 (06. Tutorial Sonu)
- `odul` — 05-02 — +1★ +50 coin
- `sonraki-bolum` — 05-03 — Sonraki bölüm
- `uretim-hatasi` — 05-04 — Hayır → Üretim hatası · ref: 52:1143 (11. Başarısızlık Ekranı)
- `tekrar-ipucu` — 05-05 — Tekrar dene / İpucu
Geçiş: Sonraki → 4. alan / Tekrar → 4. alan

## 06-ipucu-duraklat
Karar: "İlk 3 bölüm mü?" (hayır → 100 coin denetimi)
- `ipucu-butonu` — 06-01 — İpucu butonu · ref: 52:1143 (10. İpucu Ekranı)
- `dogru-kavsak-vurgu` — 06-02 — Doğru kavşak vurgusu
- `coin-denetimi` — 06-03 — Hayır → 100 coin denetimi
- `duraklat` — 06-04 — Duraklat · ref: 52:1143 (12. Duraklatma)
- `devam-yeniden` — 06-05 — Devam / Yeniden Başlat
- `onay-ayarlar` — 06-06 — Onay / Ayarlar
Geçiş: Kapanınca geldiği ekrana dön

## 07-dunya-final
Kararlar: "20. bölüm mü?", "B200 tamamlandı mı?"
- `bolum-tamam-2` — 07-01 — Bölüm tamamlandı · ref: 52:1143 (13. Dünya Tamamlama)
- `yeni-dunya` — 07-02 — Yeni dünya açıldı
- `yeni-makine` — 07-03 — Yeni makine tanıtımı
- `final-200` — 07-04 — 200 bölüm finali
- `sonraki-bolum-2` — 07-05 — Hayır → Sonraki bölüm
Geçiş: Yeni dünya → 4. alan / B200 → Final
