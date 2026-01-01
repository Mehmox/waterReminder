# WaterReminder

**WaterReminder**, Windows için geliştirilmiş, kullanıcıya günlük su tüketimini hatırlatan bir masaüstü uygulamasıdır. Electron ve React kullanılarak geliştirilmiştir. Kullanıcıya özelleştirilebilir bildirimler ve interaktif bir arayüz sunar.

## Özellikler

**Bildirim ayarları:** Bildirimlerin her zaman en üstte olup olmayacağını açıp kapatma, günlük kaç bildirim almak istediğini belirleme, her bildirimde kaç bardak su içileceğini ayarlama, bildirim sıklığını saniye, dakika veya saat cinsinden ayarlama ve bildirim mesajını kişiselleştirme.

**Bildirim yönetimi:** Günlük kalan bildirim sayısını takip etme, bildirimleri azaltma, arttırma veya manuel resetleme, bir sonraki bildirime kalan süreyi gerçek zamanlı gösterme.

**Kullanıcı deneyimi:** Butonlara basıldığında hoş bir click sesi çalma, bildirim zamanı geldiğinde ekranın sağ üstünde görünen bir bildirim penceresi ve Discord bildirim sesi.

**Kalıcılık:** Uygulama her açıldığında önceki günün kalan bildirim sayısını sıfırlamaz; kullanıcı manuel olarak resetleyebilir veya + / - butonlarıyla gün içi bildirim sayısını değiştirebilir.

## Teknolojiler

## Teknolojiler

- **Electron** – Windows için masaüstü uygulama geliştirme altyapısı  
- **React** – Kullanıcı arayüzü geliştirme  
- **JavaScript** – Uygulama mantığı ve iş akışları  
- **HTML & CSS** – Arayüz yapısı ve stiller  
- **Tailwind CSS** – Hızlı ve düzenli stil yönetimi  

- **Electron Notification API** – Sistem bildirimleri  
- **Web Audio API** – Bildirim ve etkileşim sesleri  

- **winreg** – Windows Registry ile etkileşim  

- **react-scripts** – React build ve geliştirme altyapısı  
- **electron-builder** – Uygulamanın dağıtılabilir `.exe` olarak paketlenmesi


## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/Mehmox/waterReminder.git
```
2. Bağımlılıkları yükleyin:
```bash
npm run i
```
3. Uygulamayı derleyin ve dağıtılabilir exe oluşturun:
```bash
npm run build
npm run dist
```
4. Oluşan `exe` dosyasını çalıştırarak uygulamayı başlatın.

## Notlar

Bu uygulama kişisel kullanım amaçlı geliştirilmiştir ve günlük su tüketimini takip etmek isteyen kullanıcılar için tasarlanmıştır. Günlük bildirim sayısı ve resetleme tamamen kullanıcı kontrolündedir; elektrik kesintisi veya bilgisayar yeniden başlatmaları reseti tetiklemez.