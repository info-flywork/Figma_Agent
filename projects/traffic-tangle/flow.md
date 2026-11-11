# Traffic Tangle — ekran akışı

Kaynak: FigJam `baXhzLRItYC7Iir8xRWqsK` (2026-11-03). Türkçe mobil trafik bulmacası: araçları sürükleyip aynı renkli kenar kapılarından çıkar.
Oyun yapısı: dünya başına 20 bölüm, toplam 200 bölüm (B01–B200). Para birimi: coin, ayrıca yıldız. Şehir ana sayfasında binalar yıldızla yenilenir.
Kurallar: araç yeni hücreye oturunca 1 hamle; kapı rengi eşleşmeli; kilitli kapı koşulla açılır; hamle sınırı olabilir; ipucu 100 coin (B01–B03 ücretsiz).

Referanslar:
- 34:2212 — image 1 (panonun üstündeki referans, tarif yok; görsel bu adımda alınmadı)
- 34:2219 — image 2 (aynı)
- 34:2223 — image 3 (aynı)
- 40:2227 — image 4 (aynı)
- 40:2231 — image 5 (aynı)
Not: 5 referans görseli tek tek ekrana bağlı değil; tasarım dili aşamasında `get_screenshot` ile bakılacak.

## 01-giris
- `splash` — 01-01 — Açılış
- `tutorial` — 01-02 — Öğretici (B01, yeni oyuncu)
- `resume-board` — 01-03 — Kayıtlı tahtaya dön (yarım kalan bölüm)

## 02-sehir
- `city-home` — 02-01 — Şehir ana sayfa (bina, yıldız, coin, Bölüm seç / Sıradaki bina / Ayarlar)
- `section-select` — 02-02 — Bölüm seç
- `section-locked` — 02-03 — Kilitli bölüm uyarısı
- `building-next` — 02-04 — Sıradaki bina (yıldız gereksinimi)
- `building-renewed` — 02-05 — Bina yenilendi (Devam et)
- `stars-missing` — 02-06 — X yıldız eksik (Bölüm oyna)
- `settings` — 02-07 — Ayarlar (Geri; duraklatmadan da açılır)
- `shop` — 02-08 — Mağaza (altın paketleri; Hamle bitti / Yetersiz coin'den yönlendirilir)

## 03-oyun
- `game-board` — 03-01 — Oyun tahtası (araçlar, kenar kapıları, hamle sayacı, İpucu, Duraklat)
- `wrong-color` — 03-02 — Yanlış renk uyarısı
- `door-locked` — 03-03 — Kapı kilitli uyarısı
- `level-intro` — 03-04 — Bölüm başlıyor (hedef, hamle sınırı, Başla)
- `low-moves` — 03-05 — Son 3 hamle uyarısı (Devam et / İpucu)
- `gate-opened` — 03-06 — Kapı açıldı (kilit koşulu sağlandı, Devam et)
- `puzzle-alt` — 03-07 — Farklı puzzle alanı (alternatif tahta düzeni)
- `puzzle-50` — 03-08 — Bölüm 50 puzzle'ı (daha çok kare ve araç, yoğun tahta)
- `frozen-blockers` — 03-09 — Donmuş araç engelleri (sabit engeller; renkleri gizli, ilerledikçe/sonlara doğru açılır)

## 04-sonuc
- `level-complete` — 04-01 — Bölüm tamamlandı (+1 yıldız, +50 coin; Şehre dön / Sonraki bölüm)
- `out-of-moves` — 04-02 — Hamle bitti (Tekrar dene / Şehre dön)
- `world-complete` — 04-03 — Dünya tamamlandı (20. bölüm)
- `final-200` — 04-04 — 200 bölüm finali (B200)

## 05-ipucu
- `hint-highlight` — 05-01 — İpucu: araç ve hedef vurgulanır (coin düşülür)
- `hint-no-coin` — 05-02 — Yetersiz coin (Oynamaya devam et)
- `hint-none` — 05-03 — Bu düzen için ipucu yok (Yeniden başlat)

## 06-duraklatma
- `paused` — 06-01 — Duraklatıldı (Devam et / Ayarlar / Şehre dön / Sıfırla)
- `reset-confirm` — 06-02 — Bölüm sıfırlansın mı? (Sıfırla / Vazgeç)
