# Personal Link Tree 🌳

<div align="center">

A modern, self-hosted link-in-bio solution with analytics, email newsletter, and customizable themes. Perfect for creators, developers, and professionals who want full control over their link sharing platform.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?style=for-the-badge&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[Features](#-features) •
[Quick Start](#-quick-start) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

---

## ✨ Features

- 🎨 **Customizable Themes** - Multiple built-in themes with dark mode support
- 📊 **Advanced Analytics** - Track clicks, visitors, and engagement with detailed statistics
- 📧 **Email Newsletter** - Built-in subscriber management and custom email campaigns
- 🔗 **Smart Links** - Password protection, scheduling, expiration, and click limits
- 📱 **Fully Responsive** - Beautiful on all devices
- 🎯 **SEO Optimized** - Custom meta tags, Open Graph, and Twitter Cards
- 🐳 **Docker Ready** - Easy deployment with Docker and Docker Compose
- 🔒 **Secure** - JWT authentication, bcrypt password hashing
- 📦 **Self-Hosted** - Your data, your server, your control

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd personal-linktree

# Start with Docker Compose
docker-compose up -d

# Visit http://localhost:3000/setup for first-time setup
```

### Option 2: Manual Installation

```bash
# Clone repository
git clone <your-repo-url>
cd personal-linktree

# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start

# Visit http://localhost:3000/setup for first-time setup
```

## 🎯 First-Time Setup

After starting the application for the first time:

1. Visit `/setup` in your browser
2. **Security Configuration:**
   - Set your admin password (minimum 8 characters)
   - Configure your site URL
3. **Profile Setup:**
   - Enter your name
   - Add a bio description
   - Set page title and meta description
4. Click "Complete Setup"
5. Login at `/admin/login` with your password

The setup wizard will automatically:
- Generate secure JWT secret
- Create `.env` configuration file
- Initialize database schema
- Create your profile

## 📖 Documentation

- [Docker Installation Guide](DOCKER-KURULUM.md) - Complete Docker setup and deployment
- [Yunohost Installation](YUNOHOST-KURULUM.md) - Deploy on Yunohost servers

## 🔧 Admin Panel Features

Access your admin dashboard at `/admin/dashboard` after setup:

### 📝 Profile Management
- Edit name, bio, and avatar
- Social media links integration
- SEO settings (page title, description)
- Custom favicon

### 🔗 Link Management
- Add/edit/delete links
- Drag & drop reordering
- Password protection
- Click limits and scheduling
- Link expiration dates
- QR code generation

### 🎨 Theme Customization
- Multiple built-in themes
- Dark mode support
- Custom color schemes
- Font selection
- Background styles

### 📊 Analytics Dashboard
- Real-time click tracking
- Visitor statistics
- Geographic data
- Device & browser analytics
- Referrer tracking
- Export data (CSV/JSON)
- Customizable retention period

### 📧 Email Features
- SMTP configuration
- Subscriber management
- Bulk email campaigns
- Rich text editor
- Professional email templates
- Custom signatures

### ⚙️ Settings
- Export/import all settings
- Analytics configuration
- Email preferences
- Password management
- Backup & restore

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite + Prisma ORM
- **Authentication:** JWT + bcryptjs
- **Email:** Nodemailer
- **Rich Text:** TipTap Editor
- **Charts:** Chart.js
- **QR Codes:** qrcode library
- **Icons:** React Icons

## 📁 Project Structure

```
personal-linktree/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── go/           # Link redirects
│   │   └── setup/        # Setup wizard
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/               # Static assets
├── docker/               # Docker configs
└── yunohost/             # Yunohost package
```

## 🐳 Docker Deployment

### Production

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Update
docker-compose pull && docker-compose up -d
```

### Environment Variables

Configure via Docker Compose or `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# Security (auto-generated by setup)
JWT_SECRET="your-secret-key"
ADMIN_PASSWORD="your-password"

# Application
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
PORT=3000
NODE_ENV=production
```

### SMTP Configuration

Configure through admin panel after setup:

**Gmail:**
- Host: smtp.gmail.com
- Port: 587
- Secure: No
- Use App Password (not regular password)

**Outlook/Hotmail:**
- Host: smtp-mail.outlook.com
- Port: 587
- Secure: No

**Custom Domain:**
- Check your email provider documentation
- Usually port 587 (TLS) or 465 (SSL)

## 🚀 Deployment Options

### Yunohost
See [YUNOHOST-KURULUM.md](YUNOHOST-KURULUM.md) for complete guide.

### VPS / Cloud
1. Install Docker and Docker Compose
2. Clone repository
3. Run `docker-compose up -d`
4. Configure reverse proxy (nginx/traefik)
5. Setup SSL certificate

### Platform as a Service
- **Vercel:** Next.js native support
- **Railway:** One-click Docker deployment
- **DigitalOcean App Platform:** Docker support

## 🔒 Security Best Practices

- ✅ Change default admin password immediately
- ✅ Use strong JWT secret (auto-generated)
- ✅ Enable HTTPS in production
- ✅ Regular database backups
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets

## 📊 Analytics Features

- Real-time click tracking
- Unique visitor counting
- Geolocation data (country/city)
- Device detection
- Browser and OS statistics
- Referrer tracking
- Custom retention periods (7/30/90 days or unlimited)
- Export data as CSV or JSON

## 🔗 Link Features

- **Password Protection:** Require password to access link
- **Click Limits:** Set maximum number of clicks
- **Scheduling:** Set start and end dates
- **Expiration:** Auto-disable after date
- **Social Embeds:** Preview for social platforms
- **QR Codes:** Generate downloadable QR codes
- **Custom Styling:** Icons, colors, and effects

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🌟 Roadmap

- [ ] Multi-language support
- [ ] API webhooks
- [ ] Custom domains per link
- [ ] A/B testing
- [ ] Advanced scheduling rules
- [ ] Integration marketplace
- [ ] Mobile app

## 💡 Tips & Tricks

- Use high-quality images for avatar (square format recommended)
- Enable dark mode for better user experience
- Set up analytics retention based on your needs
- Export settings regularly for backup
- Use password protection for sensitive links
- Schedule links for time-sensitive content

## 📧 Support

For questions and support:
- Open an issue on GitHub
- Check documentation guides
- Review setup wizard

---

Made with ❤️ for the open-source community
- SQLite database dosyası `prisma/dev.db` konumundadır
- Backup için sadece `prisma/` klasörünü yedekleyin

## 🆘 Sorun Giderme

**Port 3000 kullanımda hatası:**
```bash
# docker-compose.yml içinde portu değiştirin
ports:
  - "3001:3000"  # 3000 yerine 3001
```

**Database hatası:**
```bash
npx prisma db push
npx prisma generate
```

**Build hatası:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**⭐ Beğendiyseniz yıldız vermeyi unutmayın!**
