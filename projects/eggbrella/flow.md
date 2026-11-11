# Eggbrella — ekran akışı

Kaynak: FigJam (zeuIkuuBXSFBYy37DFRnQ5), 2026-11-09. Oyun: Yumi (yumurta) şemsiyeyle çatıdan sonsuz düşer; basılı tut = şemsiye açık/yavaş, bırak = kapalı/hızlı; skor = kat.

Referanslar:
8:333 — referans görsel 1 (panonun üstünde toplu duruyor; ekranla eşleştirme tasarım sırasında `get_screenshot` ile yapılacak)
8:334 — referans görsel 2
8:335 — referans görsel 3
8:336 — referans görsel 4
8:337 — referans görsel 5
8:338 — referans görsel 6
8:339 — referans görsel 7
8:340 — referans görsel 8
8:341 — referans görsel 9
8:342 — referans görsel 10

## 01-baslangic
- `acilis` — 01-01 — Açılış ekranı: logo, 2 sn
- `ana-sayfa` — 01-02 — Ana sayfa: Yumi çatıda, OYNA, Rekor, Ayarlar (dişli)
- `oyun-baslangic` — 01-03 — Oyun başlangıç: Yumi çatı kenarında, şemsiye açık
- `ipucu` — 01-04 — İpucu: Basılı tut = yavaş, Bırak = hızlı (yalnızca ilk 3 oyun)

## 02-oyun
- `oyun-acik` — 02-01 — Oyun akışı: şemsiye açık, yavaş düşüş, sakin yüz, skor = kat
- `oyun-kapali` — 02-02 — Oyun akışı: şemsiye kapalı, hızlı düşüş, korkmuş yüz, hız çizgileri
- `kirilma` — 02-03 — Kırılma animasyonu (engele çarpma / tenteye hızlı düşüş), 1 sn
- `devam-teklifi` — 02-04 — Devam teklifi: 5 sn geri sayım (Devam et · 50 coin / Hayır, teşekkürler; reklam yok)
- `sayac` — 02-05 — 3-2-1 sayaç (yeni yumurta, 2 sn koruma, aynı kattan devam; duraklatmadan devamda da kullanılır)

## 03-oyun-sonu
- `oyun-sonu` — 03-01 — Oyun sonu: skor, rekor satırı, Tekrar oyna, Klibi paylaş, Ana sayfa
- `yeni-rekor` — 03-02 — Oyun sonu: Yeni rekor! rozeti + konfeti
- `klip-hazirlaniyor` — 03-03 — Klip hazırlanıyor göstergesi, en fazla 3 sn
- `klip-hata` — 03-04 — Uyarı: Klip oluşturulamadı
- `paylasim` — 03-05 — Sistem paylaşım sayfası

## 04-duraklatma
- `duraklatma` — 04-01 — Duraklatma ekranı: Yumi şemsiye altında uyuyor (Devam et, Ayarlar, Ana sayfa)
- `cikis-onayi` — 04-02 — Çıkılsın mı? Skor rekora sayılır (Evet / Hayır)

## 05-ayarlar
- `ayarlar` — 05-01 — Ayarlar popup: Ses, Müzik, Titreşim, Dil, Kontrol (basılı tut / dokun aç-kapa), Gizlilik, Satın alımları geri yükle, Kapat

Altın: oyun ekranlarında toplanır (HUD/Coins sayacı, sahnede altın dizisi); oyun sonunda kazanılan altın gösterilir. Coin ile devam edilir.

Notlar (ekran olmayan kurallar — Zorluk ilerlemesi, Tente kuralı, Kontrol, Rekor kontrolü): bölge görselleri oyun ekranlarında kullanılır — Bölge 1 çatı/balkonlar (kat 1-99), Bölge 2 Cam ofis gün batımı (kat 100+), Bölge 3 Gece neon (kat 200+); engeller: güvercin, çamaşır ipi, tente.
