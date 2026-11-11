# Knot Escape — ekran akışı

Kaynak: FigJam `2G2olw7mOELokTaUqOWb38` (2026-11-03). Türkçe mobil bulmaca oyunu: renkli ipleri pinler arasında taşıyıp düğümleri/kesişimleri çöz.
Oyun yapısı: 5 dünya × 20 bölüm (B001–B200). Para birimleri: jeton ve elmas. Güçlendiriciler: geri al, ipucu, dondur (karışık çöz), pin aç, +5 hamle.

Referanslar:
- 9:780 — "Knot Escape Türkçe Mobil Oyun Arayüzleri" tek pafta, 14 ekran (2 sıra × 7). Panel numaraları:
  #1 Açılış (splash, logo + yükleme çubuğu), #2 Ana menü (Oyna, Dünyalar/Günlük Görev/Mağaza, jeton/elmas), #3 Dünya seçimi (5 dünya kartı, kilitler),
  #4 Bölüm seçimi (4×5 ızgara, yıldızlar, kilitler), #5 Oyun ekranı (Bölüm/Hamle, iplerle pinler, geri al/ipucu/dondur), #6 İp taşıma (etkileşim, el imleci),
  #7 Bölüm tamamlandı (3 yıldız, +50 jeton +1 elmas, Sonraki Bölüm), #8 Başarısız / Hamleler bitti (+5 Hamle 50 elmas, Tekrar Dene, Ana Menü),
  #9 İpucu popup (öğretici ipucu, Tamam), #10 Eşya / güçlendirici seçimi, #11 Mağaza (Eşyalar/Para sekmesi, jeton paketleri),
  #12 Ayarlar (müzik, ses, titreşim, dil, gizlilik, destek, hakkında), #13 Günlük görevler (ilerleme + ödül), #14 Dünya tamamlandı (sandık, Devam Et).
- Görsel tarz: parlak, 3D/cartoon casual oyun; ahşap/bej paneller, mavi lacivert popup, yeşil birincil buton, kalın beyaz kenarlı başlık, yuvarlak ikon butonlar.

## 01-giris-menu
- `splash` — 01-01 — Açılış (splash, yükleme) · ref: 9:780
- `splash-error` — 01-02 — Açılış bağlantı hatası (Tekrar Dene)
- `continue-game` — 01-03 — Kayıtlı oyuna dönüş (yarım kalan oyun varsa)
- `tutorial` — 01-04 — Öğretici (B001, ilk oyuncu) · ref: 9:780
- `home` — 01-05 — Ana menü · ref: 9:780
- `world-select` — 01-06 — Dünya seçimi · ref: 9:780
- `world-locked` — 01-07 — Kilit açma koşulu (kilitli dünya popup)
- `level-select` — 01-08 — Bölüm seçimi · ref: 9:780
- `daily-tasks` — 01-09 — Günlük görevler · ref: 9:780
- `reward-claimed` — 01-10 — Ödül alındı (popup)
- `shop` — 01-11 — Mağaza · Eşyalar sekmesi (güçlendiriciler) · ref: 9:780
- `shop-packs` — 01-12 — Mağaza · Paketler sekmesi (jeton + elmas paketleri)
- `purchase-processing` — 01-13 — Satın alma işleniyor (gerçek para)
- `purchase-success` — 01-14 — Satın alma tamamlandı
- `purchase-failed` — 01-15 — Satın alma başarısız (Tekrar Dene / Kapat)
- `settings` — 01-16 — Ayarlar · ref: 9:780
- `language-select` — 01-17 — Dil seçimi (popup)

## 02-oyun-dongusu
- `game-board` — 02-01 — Oyun tahtası · ref: 9:780
- `rope-drag` — 02-02 — İp taşıma (sürükleme etkileşimi) · ref: 9:780
- `pause` — 02-03 — Duraklatma (devam, yeniden başlat, ayarlar, ana menü)
- `restart-confirm` — 02-04 — Yeniden başlat onayı
- `level-complete` — 02-05 — Bölüm tamamlandı · ref: 9:780
- `world-complete` — 02-06 — Dünya tamamlandı (20. bölüm) · ref: 9:780
- `all-complete` — 02-07 — Tüm dünyalar bitti (B200)
- `out-of-moves` — 02-08 — Hamleler bitti (tekrar dene, +5 hamle, ana menü) · ref: 9:780
- `puzzle-1` — 02-09 — Puzzle · Alan 1 (sahil arka planı, Bölüm 1)
- `puzzle-2` — 02-10 — Puzzle · Alan 2 (orman arka planı, Bölüm 21)
- `puzzle-3` — 02-11 — Puzzle · Alan 3 (buz arka planı, Bölüm 41)
- `puzzle-4` — 02-12 — Puzzle · Alan 4 (çöl arka planı, Bölüm 61)
- `puzzle-5` — 02-13 — Puzzle · Alan 5 (bulut şehir arka planı, Bölüm 81)
- `puzzle-30` — 02-14 — Puzzle · Bölüm 30 (orman, 14 hamle, daha yoğun)
- `puzzle-50` — 02-15 — Puzzle · Bölüm 50 (buz, 12 hamle, daha yoğun)
- `puzzle-100` — 02-16 — Puzzle · Bölüm 100 (bulut şehir, 10 hamle, çok yoğun)
- `puzzle-150` — 02-17 — Puzzle · Bölüm 150 (buz, 8 hamle, en yoğun)
- `continue-offer` — 02-14 — Devam hakkı (oyun geçilemedi: jeton karşılığı +5 hamle, kaçırılmaz teklif kartı)

## 03-guclendirici-ekonomi
- `booster-select` — 03-01 — Güçlendirici seçimi (geri al, ipucu, dondur, pin aç) · ref: 9:780
- `booster-hint` — 03-02 — Güçlendirici uygulandı (ipucu) · ref: 9:780
- `purchase-popup` — 03-03 — Satın alma popup (hak yoksa / +5 hamle, elmasla)
- `purchase-popup-unlock` — 03-04 — Satın alma popup, Pin Aç örneği (aynı şablon: başlık, ikon, metin, fiyat güçlendiriciye göre değişir)
- `booster-added` — 03-05 — Güçlendirici eklendi (toast, kendiliğinden kapanır)
- `insufficient-gems` — 03-06 — Yetersiz elmas (mağazaya git / iptal)

## Akış notları
- Açılış → yarım kalan oyun var mı? Evet → Kayıtlı oyuna dönüş → Oyun tahtası. Hayır → yeni oyuncu mu? Evet → Öğretici (B001) → Oyun tahtası; Hayır → Ana menü.
- Ana menü → Oyna (oyun tahtası), Dünya seçimi (açık → Bölüm seçimi → açık bölüm → Oyun tahtası; kilitli → Kilit açma koşulu), Günlük görevler (Al → Ödül alındı → Tamam), Mağaza, Ayarlar.
- Oyun tahtası: Sürükle → İp taşıma → kesişim kaldı mı? Hayır → Bölüm tamamlandı → 20. bölüm mü? Hayır → sonraki bölüm; Evet → Dünya tamamlandı → B200 mü? Hayır → yeni dünya bölüm 1; Evet → Tüm dünyalar bitti → Ana menü.
  Kesişim var → hamle kaldı mı? Evet → devam; Hayır → Hamleler bitti (Tekrar dene / +5 hamle satın al / Ana menü).
- Oyun tahtası → Duraklat (devam, yeniden başlat onayı, ayarlar, ana menü); Yeniden başlat → onay → tahta; Geri al/ipucu/dondur → Güçlendirici akışı.
- Güçlendirici: hakkı var → uygulanır → tahtaya dön; yok → Satın alma popup → elmas yeterli? Evet → elmas düşülür → tahtaya dön; Hayır → Yetersiz elmas → Mağazaya git (elmas paketi al → başarılıysa satın almaya dön, değilse önceki ekrana) / İptal → önceki ekran.
- "Mağaza" akış 1 ve 3'te aynı ekrandır (`shop` Eşyalar sekmesi, `shop-packs` Paketler sekmesi).
- Açılış yüklemesi başarısız → Açılış bağlantı hatası → Tekrar Dene → Açılış.
- Paket satın alma (₺): fiyat → Satın alma işleniyor → başarılı → Satın alma tamamlandı → Tamam (yetersiz elmastan gelindiyse satın alma popup'ına dön); başarısız/iptal → Satın alma başarısız → Tekrar Dene / Kapat (önceki ekran).
- Satın alma popup'ı (elmasla) → elmas düşülür → Güçlendirici eklendi toast'ı → tahta.
- Ayarlar → Dil → Dil seçimi popup'ı. Gizlilik, Destek, Hakkında harici web sayfası açar (uygulama içi ekran yok).
