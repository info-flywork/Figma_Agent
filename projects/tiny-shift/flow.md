# Tiny Shift akışı

FigJam panosundan çıkarıldı (2026-10-30). Mobil yol döndürme bulmaca oyunu; 430×932 dikey, dokunma alanı ≥44 px, hesap yok, çevrimdışı.
Oyun metinleri MVP'de İngilizce olabilir; akış ve dokümantasyon Türkçe.

Referanslar (panonun üstündeki görseller, hepsi tasarım referansı):
- 2:203 — Akdeniz bulmacası: oyun ekranı (yol ızgarası) → 02-01
- 2:181 — Renkli kasabada yerel pazar restorasyonu → 03-01 (kasaba)
- 2:176 — Renkli kasabada yerel market restorasyonu → 03-02 (bina yenileme)
- 2:180 — Renkli Tiny Shift ayarlar menüsü → 05-01
- 2:199 — Tiny Shift mobil oyun arayüzü koleksiyonu (720×480, birden çok ekran) — genel stil referansı, tek ekrana bağlı değil

Ekonomi: ilk tamamlamada 1 yıldız + 50 oyun parası; ipucu B1–3 ücretsiz, sonra 100 para; bina yenileme parça parça: her bina 5 parça × 3 yıldız = 15 yıldız (2026-11-02, ör. Local Market: tente → çatı → duvar → kapı/pencere → tezgâh); tekrar oyununda ödül yok.
Bölüm 11–20 hamle sınırlı. 20 bölüm, 5 bina (Eski Ev, Kasaba Parkı, Yerel Market, İtfaiye İstasyonu, Kasaba Meydanı).

Karar noktaları:
- Tüm rotalar geçerli mi? Evet → araç hareketi · Hayır → yol döndürmeye devam
- Hamle hakkı kaldı mı? Evet → oyuna devam · Hayır → başarısızlık
- Yıldız yeterli mi? Evet → binayı yenile · Hayır → sonraki bölüm
- 100 oyun parası var mı? Evet → ipucu göster · Hayır → yetersiz para

## 01-opening
- `01-01-splash` — 01-01 — İlk açılış: Kasabayı kurtar!
- `01-02-tutorial` — 01-02 — Öğretici: Milo "Döndürmek için yola dokun"

## 02-gameplay
- `02-01-game` — 02-01 — Oyun ekranı: yol ızgarası · ref: 2:203
- `02-02-route-check` — 02-02 — Rota kontrolü
- `02-03-vehicle-move` — 02-03 — Araç hareketi: hedefe ulaşıldı
- `02-04-level-complete` — 02-04 — Bölüm tamamlandı
- `02-05-out-of-moves` — 02-05 — Başarısızlık: hamle hakkın bitti
- `02-06-level-01` — 02-06 — Bölüm 1 (çok kolay): 3×3 tahta, 4 karoluk rota, 2 karo döndürülecek, ücretsiz ipucu
- `02-07-level-02` — 02-07 — Bölüm 2 (kolay): 3×4 tahta, viraj ağırlıklı rota, 3 karo döndürülecek, ücretsiz ipucu
- `02-08-level-03` — 02-08 — Bölüm 3 (orta-kolay): 4×4 tahta, T kavşaklı rota + şaşırtmaca karolar, son ücretsiz ipucu
- `02-09-level-04` — 02-09 — Bölüm 4 (orta): 4×5 tahta, uzun dolambaçlı rota, 5 karo döndürülecek, ipucu 100 para
- `02-10-level-05` — 02-10 — Bölüm 5 (zor): 4×5 tahta, ortadan başlangıç, 3 dörtlü kavşak + T, yanıltıcı yan kol, ipucu 100 para
- `02-11-level-50` — 02-11 — Bölüm 50 (zor): 5×6 tahta, 12 karoluk dolambaçlı rota, T + dörtlü kavşak, ~%35 yanıltıcı karo, 30 hamle, 3:00
- `02-12-level-100` — 02-12 — Bölüm 100 (çok zor): 6×7 tahta, 16 karoluk rota, 2 T + 2 dörtlü kavşak, ~%50 yanıltıcı karo, 32 hamle, 3:00
- `02-13-level-150` — 02-13 — Bölüm 150 (uzman): 7×8 tahta, 22 karoluk rota, 3 T + 3 dörtlü kavşak, ~%60 yanıltıcı karo, 34 hamle, 3:00
- `02-14-level-200` — 02-14 — Bölüm 200 (usta): 7×9 tahta, 25 karoluk rota, 4 T + 4 dörtlü kavşak, ~%70 yanıltıcı karo, yalnız başlangıç karosu bağlı, 36 hamle, 3:00

## 03-town
- `03-01-town` — 03-01 — Kasaba · ref: 2:181
- `03-02-renovate` — 03-02 — Bina yenileme: öncesi → sonrası · ref: 2:176
- `03-03-level-select` — 03-03 — Bölüm seçimi
- `03-04-town-complete` — 03-04 — Kasaba tamamlandı
- `03-05-home` — 03-05 — Ana ekran: kasaba meydanı sahnesi, HUD, bina ilerlemesi, yan kısayollar, büyük Play (Bölüm N) butonu, alt sekme çubuğu · ref: references/attach-1793626041821-gely.jpg
- `03-06-building-complete` — 03-06 — Bina tamamlandı: yenilenmiş binanın bitmiş hali (5/5 parça, 15★), ödül ve sonraki bina

## 04-game-dialogs
- `04-01-pause` — 04-01 — Duraklatma
- `04-02-restart-confirm` — 04-02 — Yeniden başlat onayı
- `04-03-hint` — 04-03 — İpucu kullanılsın mı?
- `04-04-not-enough-coins` — 04-04 — Yetersiz oyun parası
- `04-05-continue` — 04-05 — Devam et: süre/hamle bitince coin karşılığı +20 sn (veya +5 hamle) ile kaldığı yerden devam hakkı

## 05-settings
- `05-01-settings` — 05-01 — Ayarlar · ref: 2:180

## 06-shop
- `06-01-paywall` — 06-01 — Mağaza / Paywall: Town Pass, Travel Deal (-90%, süreli), Special Offer, daha fazla teklif, satın alımları geri yükle · ref: references/attach-1793686852959-msc7.png
