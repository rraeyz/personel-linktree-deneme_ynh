# 🏠 Yunohost Panel Kurulumu

## 📦 Yunohost App Package Hazırlama

### 1. Projeyi GitHub'a Yükle (Gerekli)

Yunohost, uygulamaları GitHub'dan çeker. Projenizi bir GitHub repo'suna yükleyin:

```bash
cd ~/Masaüstü/projeler/personal-linktree

# Git repo başlat (eğer yoksa)
git init
git add .
git commit -m "Initial commit"

# GitHub'a push et
git remote add origin https://github.com/rraeyz/personal-linktree_ynh.git
git branch -M main
git push -u origin main
```

### 2. Yunohost Package Hazırlama

Yunohost app package'ı ayrı bir repo olmalı:

```bash
# Yeni bir dizin oluştur
mkdir ~/personal-linktree_ynh
cd ~/personal-linktree_ynh

# Yunohost klasöründeki dosyaları kopyala
cp -r ~/Masaüstü/projeler/personal-linktree/yunohost/* .

# manifest.toml'de GitHub URL'ini güncelle
nano manifest.toml
# "code" satırını kendi GitHub repo URL'inle değiştir
```

**manifest.toml düzenlenmesi gereken satırlar:**
```toml
[upstream]
code = "https://github.com/rraeyz/personal-linktree_ynh"
```

### 3. sources.toml Oluştur

Yunohost'un projeyi nereden çekeceğini belirt:

```bash
cd ~/personal-linktree_ynh
mkdir conf
nano conf/sources.toml
```

**conf/sources.toml içeriği:**
```toml
[main]
url = "https://github.com/rraeyz/personal-linktree_ynh/archive/refs/heads/main.tar.gz"
sha256 = "SHA256_HASH_BURAYA"
format = "tar.gz"
in_subdir = true
```

SHA256 hash almak için:
```bash
curl -sL "https://github.com/rraeyz/personal-linktree_ynh/archive/refs/heads/main.tar.gz" | sha256sum
```

### 4. Package'ı GitHub'a Yükle

```bash
cd ~/personal-linktree_ynh
git init
git add .
git commit -m "Initial Yunohost package"
git remote add origin https://github.com/rraeyz/personal-linktree_ynh_ynh.git
git branch -M main
git push -u origin main
```

---

## 🚀 Yunohost Panelden Kurulum

### Yöntem 1: Custom App (Önerilen - Basit)

1. **Yunohost admin paneline giriş yap**
   - https://your-yunohost-domain.com/yunohost/admin

2. **Applications menüsüne git**

3. **"Install custom app" butonuna tık**

4. **GitHub URL'ini gir:**
   ```
   https://github.com/rraeyz/personal-linktree_ynh_ynh
   ```

5. **Kurulum formunu doldur:**
   - **Domain**: Alt domain seç (örn: `linktree.yourdomain.com`)
   - **Path**: `/` (veya `/linktree`)
   - **Admin user**: Yunohost admin kullanıcın
   - **Admin password**: Linktree panel şifresi (güçlü olmalı)

6. **"Install" butonuna bas**

7. **Kurulum tamamlanınca:**
   - Ana sayfa: `https://linktree.yourdomain.com`
   - Admin panel: `https://linktree.yourdomain.com/admin/login`

### Yöntem 2: SSH ile Manuel

```bash
# Sunucuya bağlan
ssh admin@your-yunohost-domain.com

# Root'a geç
sudo -i

# App'i kur
yunohost app install https://github.com/rraeyz/personal-linktree_ynh_ynh

# Soruları cevapla:
# - Domain: linktree.yourdomain.com
# - Path: /
# - Admin user: admin
# - Password: güçlü-şifre
```

---

## 📋 Basitleştirilmiş Kurulum (Hızlı Test)

Eğer GitHub'a yüklemek istemiyorsan, local kurulum yapabilirsin:

### 1. Projeyi Sunucuya Kopyala

```bash
# Local'den sunucuya kopyala
scp -r ~/Masaüstü/projeler/personal-linktree admin@your-server:/tmp/

# Sunucuya bağlan
ssh admin@your-server
sudo -i

# Kurulum dizinine taşı
mv /tmp/personal-linktree /opt/yunohost/apps/personal_linktree
```

### 2. Manuel Docker Kurulumu

```bash
cd /opt/yunohost/apps/personal_linktree

# Docker kur (yoksa)
curl -fsSL https://get.docker.com | bash

# .env oluştur
cat > .env << 'EOF'
DATABASE_URL="file:/app/prisma/dev.db"
JWT_SECRET="BURAYA_RASTGELE_32_KARAKTER"
ADMIN_PASSWORD="güçlü-şifreniz"
NEXT_PUBLIC_BASE_URL="https://linktree.yourdomain.com"
PORT=3000
NODE_ENV=production
EOF

# Başlat
docker-compose up -d --build

# Database oluştur
sleep 30
docker-compose exec app npx prisma db push
```

### 3. Nginx Yapılandır

```bash
# Nginx config oluştur
cat > /etc/nginx/conf.d/linktree.conf << 'EOF'
server {
    listen 80;
    server_name linktree.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
EOF

# Nginx reload
nginx -t
systemctl reload nginx

# SSL ekle
yunohost domain cert install linktree.yourdomain.com
```

---

## 🔧 Kurulum Sonrası

### Domain DNS Ayarları

Yunohost panelden:
1. **Domains** → Kendi domain'in
2. **DNS** sekmesi
3. A kaydı ekle: `linktree.yourdomain.com` → Sunucu IP'si
4. DNS'in yayılmasını bekle (15-60 dakika)

### İlk Giriş

1. `https://linktree.yourdomain.com/admin/login` aç
2. Belirlediğin şifreyle giriş yap
3. Profil ayarlarını düzenle
4. İlk linki ekle!

---

## 📊 Yönetim Komutları

### Yunohost CLI ile

```bash
# App durumu
yunohost app info personal_linktree

# App logları
yunohost app log personal_linktree

# App yeniden başlat
yunohost app restart personal_linktree

# App güncelle
yunohost app upgrade personal_linktree

# App kaldır
yunohost app remove personal_linktree

# Yedek al
yunohost backup create --apps personal_linktree

# Yedek geri yükle
yunohost backup restore BACKUP_NAME
```

### Docker Komutları

```bash
cd /opt/yunohost/apps/personal_linktree

# Loglar
docker-compose logs -f

# Yeniden başlat
docker-compose restart

# Durdur
docker-compose down

# Güncelleme
docker-compose up -d --build
```

---

## 🐛 Sorun Giderme

### App kurulmadı

```bash
# Yunohost loglarını kontrol et
tail -f /var/log/yunohost/yunohost.log

# Script hatalarını kontrol et
journalctl -u yunohost-api -f
```

### Docker çalışmıyor

```bash
# Docker durumunu kontrol et
systemctl status docker

# Docker loglarını kontrol et
docker-compose logs app

# Container'a bağlan
docker-compose exec app sh
```

### Database hatası

```bash
# Database'i sıfırla
docker-compose exec app npx prisma db push --accept-data-loss
```

### Port çakışması

```bash
# .env'de PORT değiştir
nano /opt/yunohost/apps/personal_linktree/.env

# docker-compose.yml'de de değiştir
nano /opt/yunohost/apps/personal_linktree/docker-compose.yml

# Restart
docker-compose down && docker-compose up -d
```

---

## 📦 Paket Yapısı

```
personal-linktree_ynh/
├── manifest.toml           # App metadata
├── scripts/
│   ├── install            # Kurulum scripti
│   ├── remove             # Kaldırma scripti
│   ├── upgrade            # Güncelleme scripti
│   ├── backup             # Yedekleme scripti
│   └── restore            # Geri yükleme scripti
└── conf/
    ├── nginx.conf         # Nginx template
    ├── systemd.service    # Systemd service
    ├── docker-compose.yml # Docker Compose template
    └── sources.toml       # Kaynak URL'leri
```

---

## ✅ Production Checklist

- [ ] GitHub repo oluşturuldu ve code push'landı
- [ ] Yunohost package repo oluşturuldu
- [ ] sources.toml'de doğru URL ve hash var
- [ ] manifest.toml'de doğru bilgiler var
- [ ] DNS A kaydı eklendi
- [ ] Yunohost'tan kurulum yapıldı
- [ ] SSL sertifikası otomatik kuruldu
- [ ] İlk giriş yapıldı ve test edildi
- [ ] Yedekleme sistemi kuruldu

---

## 🎯 Hızlı Özet

**En Basit Yol (Test için):**
1. Docker ve Docker Compose kur
2. Projeyi `/opt/yunohost/apps/personal_linktree` kopyala
3. `.env` oluştur
4. `docker-compose up -d --build` çalıştır
5. Nginx reverse proxy ekle
6. SSL kur

**Proper Yunohost Yolu:**
1. Projeyi GitHub'a yükle
2. Yunohost package'ı GitHub'a yükle
3. Yunohost panel → Custom App Install
4. GitHub URL'ini gir, kurulum formunu doldur
5. Kurulumu tamamla

Her iki yol da çalışır! İlki daha hızlı test için, ikincisi production için önerilir.
