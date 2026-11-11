# Femia_V2 — ekran akışı

Kaynak: FigJam `6LGMlo4otM64PYwmjFHvRw` (2026-10-30, `get_figjam` 0:1, görselsiz okuma).
Yalnızca ekranlar listelendi; karar baklavaları (Mevcut kullanıcı mı?, Hedef = Hamileyim, Hamilelik / Bebeğim doğdu anahtarı),
bölüm geçiş kutuları (→ …) ve lejant listede yok. Sekme çubuğu (Bugün · Takvim · + Kayıt · Hatırlatmalar · Profil) bir component'tir.
`ref:` = kullanıcının FigJam'e eklediği referans görselin node id'si (board'un üstünde, adlarına göre eşleştirildi).

## 01-opening
- `splash` — 01-01 — Splash
- `onboarding-1` — 01-02 — Onboarding 1 · Adet döngünü tanı · ref: 5:585
- `onboarding-2` — 01-03 — Onboarding 2 · Döngü süreni belirle · ref: 5:584
- `onboarding-3` — 01-04 — Onboarding 3 · Adet süreni ayarla · ref: 5:582
- `notification-permission` — 01-05 — Bildirim izni
- `privacy-consent` — 01-06 — Gizlilik ve sağlık verisi onayı (KVKK)

## 02-auth
- `login` — 02-01 — Giriş yap
- `login-error` — 02-02 — Giriş hatası (yanlış şifre / kayıtlı e-posta)
- `forgot-password` — 02-03 — Şifremi unuttum
- `reset-email-sent` — 02-04 — Sıfırlama e-postası gönderildi
- `new-password` — 02-05 — Yeni şifre belirle
- `sign-up` — 02-06 — Hesap oluştur · ref: 5:581
- `email-verification` — 02-07 — E-posta doğrulama kodu
- `social-sign-in` — 02-08 — Apple / Google ile devam et

## 03-user-questions
- `q-goal` — 03-01 — Hedefiniz nedir?
- `q-birth-year` — 03-02 — Doğum yılınız
- `q-cycle-regular` — 03-03 — Adet döngünüz düzenli mi?
- `q-sudden-start` — 03-04 — Regliniz aniden mi başlıyor?
- `q-cramps` — 03-05 — Hiç adet sancısı yaşadınız mı?
- `q-birth-control` — 03-06 — Doğum kontrolü uyguluyor musunuz?
- `q-period-length` — 03-07 — Regliniz genelde kaç gün sürer?
- `q-cycle-length` — 03-08 — Döngünüz genelde kaç gün sürer?
- `q-last-period` — 03-09 — Son adet tarihi · ref: 5:583
- `cycle-calculating` — 03-10 — Döngün hesaplanıyor
- `we-can-help` — 03-11 — Yardımcı olabiliriz

## 04-today
- `today` — 04-01 — Bugün
- `cycle-phase` — 04-02 — Döngü fazı detayı
- `prediction-detail` — 04-03 — Tahmin detayı
- `tip-detail` — 04-04 — Günün ipucu / makale detayı
- `notification-center` — 04-05 — Bildirim merkezi
- `period-started-sheet` — 04-06 — Adet başladı mı? (sheet)
- `period-ended-sheet` — 04-07 — Adet bitti mi? (sheet)
- `period-late` — 04-08 — Regl gecikti uyarısı

## 05-calendar
- `calendar-month` — 05-01 — Ay görünümü
- `day-detail-sheet` — 05-02 — Gün detayı (sheet)
- `edit-period-days` — 05-03 — Regl günlerini düzenle
- `calendar-saved` — 05-04 — Kaydedildi (toast)
- `cycle-history` — 05-05 — Döngü geçmişi
- `cycle-detail` — 05-06 — Döngü detayı
- `statistics` — 05-07 — İstatistikler
- `add-past-period` — 05-08 — Geçmiş adet ekle

## 06-daily-log
- `daily-log` — 06-01 — Günlük kayıt
- `log-symptoms` — 06-02 — Belirti seçimi
- `log-mood` — 06-03 — Ruh hali ve enerji
- `log-other` — 06-04 — Diğer: ilişki, ilaç, kilo, sıcaklık
- `log-note` — 06-05 — Not ekle
- `log-saved` — 06-06 — Kaydedildi (toast)

## 07-reminders
- `reminders` — 07-01 — Hatırlatma listesi
- `reminder-period` — 07-02 — Regl başlangıcı
- `reminder-pill` — 07-03 — Doğum kontrol ilacı
- `reminder-doctor` — 07-04 — Doktor randevusu
- `reminder-daily-log` — 07-05 — Günlük kayıt hatırlatması
- `reminder-breast-exam` — 07-06 — Göğüs muayenesi
- `reminder-water` — 07-07 — Su içme
- `reminder-edit` — 07-08 — Hatırlatma düzenle
- `time-picker-sheet` — 07-09 — Saat seçici (sheet)
- `reminder-delete` — 07-10 — Hatırlatmayı sil (onay)
- `notifications-off` — 07-11 — Bildirimler kapalı uyarısı

## 08-profile
- `profile` — 08-01 — Profil
- `account-settings` — 08-02 — Hesap ayarları
- `edit-name` — 08-03 — Adınızı güncelleyin
- `edit-age` — 08-04 — Yaşınızı güncelleyin
- `profile-photo-sheet` — 08-05 — Profil fotoğrafı (kamera / galeri sheet)
- `change-email-password` — 08-06 — E-posta ve şifre değiştir
- `delete-account` — 08-07 — Hesabınızı silin
- `delete-confirm` — 08-08 — Silme onayı (diyalog)
- `upgrade-plan` — 08-09 — Planınızı yükseltin (aylık / yıllık)
- `payment` — 08-10 — Ödeme
- `payment-success` — 08-11 — Ödeme başarılı
- `payment-failed` — 08-12 — Ödeme başarısız
- `restore-purchases` — 08-13 — Satın alımları geri yükle
- `apple-health` — 08-14 — Apple Health
- `health-permission` — 08-15 — Health izin ekranı
- `apple-watch` — 08-16 — Apple Watch
- `prediction-settings` — 08-17 — Tahmin ayarları
- `notification-settings` — 08-18 — Bildirim ayarları
- `privacy-data` — 08-19 — Gizlilik ve veriler
- `faq` — 08-20 — S.S.S.
- `faq-answer` — 08-21 — SSS cevabı (açılır)
- `support` — 08-22 — Destek / iletişim
- `rate-app-sheet` — 08-23 — Bize oy verin (iOS sheet)
- `share-app-sheet` — 08-24 — Uygulamayı paylaş (sistem sheet)
- `logout-confirm` — 08-25 — Çıkış yap (onay)

## 09-pregnancy-setup
- `pregnancy-congrats` — 09-01 — Tebrikler!
- `pregnancy-week` — 09-02 — Gebelik haftası
- `due-date` — 09-03 — Tahmini doğum tarihi
- `q-morning-sickness` — 09-04 — Sabah bulantısı yaşıyor musunuz?
- `q-fatigue` — 09-05 — Sık sık yorgun hissediyor musunuz?
- `q-sleep` — 09-06 — Uyku sorununuz var mı?
- `pregnancy-building` — 09-07 — Haritanız oluşturuluyor
- `pregnancy-settings` — 09-08 — Gebelik ayarları
- `pregnancy-off-confirm` — 09-09 — Hamilelik modunu kapat (onay)

## 10-pregnancy-mode
- `pregnancy-today` — 10-01 — Bugün (hamilelik)
- `weekly-development` — 10-02 — Haftalık gelişim detayı
- `baby-size` — 10-03 — Bebeğim ne kadar büyük?
- `pregnancy-symptoms` — 10-04 — Hamilelik belirtileri kaydı
- `kick-counter` — 10-05 — Tekme sayacı
- `kick-history` — 10-06 — Tekme geçmişi
- `contraction-timer` — 10-07 — Kasılma sayacı
- `weight-tracking` — 10-08 — Kilo takibi
- `pregnancy-calendar` — 10-09 — Takvim (hamilelik)
- `doctor-checkups` — 10-10 — Doktor kontrolleri listesi
- `hospital-bag` — 10-11 — Hastane çantası listesi

## 11-baby-born
- `baby-congrats` — 11-01 — Tebrikler! (bebeğim doğdu)
- `birth-date` — 11-02 — Doğum tarihi
- `postpartum-info` — 11-03 — Doğum sonrası dönem bilgisi
- `back-to-cycle` — 11-04 — Döngü takibine dönüş
