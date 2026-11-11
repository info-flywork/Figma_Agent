# Train Twist — ekran akışı

Kaynak: FigJam `zbSwFvgjfyqO6KQ1MduLWi` (Düzeltilmiş akış 1 ve 2). Oyun: makasları çevirerek trenleri doğru istasyona ulaştırma, 20 bölüm, kasaba inşası.

Referanslar (panonun üstündeki 6 görsel, ekranlarla eşleştirildi → `ref:`):
- 24:831 — splash · 24:835 — onboarding · 24:839 — home · 24:843 — level-select · 24:851 — game · 24:858 — level-complete

## 01-opening
- `splash` — 01-01 — Açılış · ref: 24:831
- `onboarding` — 01-02 — Tanıtım (3 kart) · ref: 24:835
- `tutorial` — 01-03 — Öğretici (Bölüm 1)
- `onboarding-2` — 01-04 — Tanıtım kartı 2 · ref: 24:835
- `onboarding-3` — 01-05 — Tanıtım kartı 3 · ref: 24:835

## 02-menu
- `home` — 02-01 — Ana ekran · ref: 24:839
- `level-select` — 02-02 — Bölüm seçimi · ref: 24:843
- `level-locked` — 02-03 — Kilitli bölüm uyarısı
- `settings` — 02-04 — Ayarlar
- `how-to-play` — 02-05 — Nasıl oynanır (Ayarlar'dan)
- `language` — 02-06 — Dil seçimi (Ayarlar'dan)

## 03-game
- `game` — 03-01 — Makasları ayarla (oyun ekranı; İpucu ve Duraklat butonları burada) · ref: 24:851
- `no-moves` — 03-02 — Hamle bitti uyarısı
- `trains-running` — 03-03 — Trenler sırayla çalışır
- `level-intro` — 03-04 — Bölüm başlangıcı (hedef + Başla)
- `game-level-10` — 03-05 — Makasları ayarla (Bölüm 10)
- `game-level-20` — 03-06 — Makasları ayarla (Bölüm 20)
- `game-level-50` — 03-07 — Makasları ayarla (Bölüm 50)
- `game-level-150` — 03-08 — Makasları ayarla (Bölüm 150; 6×9 ızgara, 5 hedef, 02:15)
- `game-level-250` — 03-09 — Makasları ayarla (Bölüm 250; 7×10 ızgara, 5 hedef, 02:00)
- `game-level-500` — 03-10 — Makasları ayarla (Bölüm 500; 7×11 ızgara, 6 hedef, 01:45)
- `game-level-1000` — 03-11 — Makasları ayarla (Bölüm 1000; 8×12 ızgara, 6 hedef, 01:30)
- `train-shop` — 03-12 — Tren mağazası (altınla tren satın al / seç)

## 04-result
- `level-complete` — 04-01 — Bölüm tamamlandı · ref: 24:858
- `reward` — 04-02 — +1 yıldız, +50 para (ilk tamamlama)
- `delivery-failed` — 04-03 — Teslimat başarısız (Tekrar dene / Ana ekran)
- `grand-finale` — 04-04 — Büyük final (Bölüm 20)
- `buy-moves` — 04-05 — Hamle bitti: altınla ek hamle satın al (Devam et / Vazgeç)

## 05-hint
- `hint-highlight` — 05-01 — Doğru makas vurgulanır (Bölüm 1-3 ücretsiz, sonra 100 para düşülür)
- `hint-no-coins` — 05-02 — Yetersiz para (Oynamaya devam et)

## 06-pause
- `paused` — 06-01 — Duraklatıldı (Devam et / Rotayı sıfırla / Ayarlar / Ana ekran)
- `reset-confirm` — 06-02 — Rotayı sıfırla onayı (Vazgeç / Sıfırla)
- `exit-confirm` — 06-03 — Ana ekrana dön onayı

## 07-town
- `town` — 07-01 — Kasaba
- `next-building` — 07-02 — Sıradaki yapı (yıldız yeterli mi?)
- `build-complete` — 07-03 — İnşaat tamamlandı (Devam et)
- `building-detail` — 07-04 — Yapı detayı (tamamlanmış yapı)

Notlar:
- Ayarlar, duraklatmadan da açılır (06 → `settings`, Geri ile duraklatmaya döner); ayrı ekran yok.
- "Kasaba akışı", "İpucu akışı", "Duraklatma akışı" ana akıştaki yönlendirme kutularıdır, ekran değildir.
- FigJam'de ekran kutularına bağlı görsel yok; üstteki 6 görsel toplu referanstır, ekranla eşleştirme tasarım aşamasında yapılacak (ref: yazılmadı).
