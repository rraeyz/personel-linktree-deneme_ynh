# 🚀 Quick Start Guide

Get Personal Link Tree up and running in minutes!

## ⚡ Fastest Method (Docker)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd personal-linktree

# 2. Run quick start script
./start.sh

# 3. Open browser and complete setup
# Visit: http://localhost:3000/setup
```

That's it! The setup wizard will guide you through the rest.

## 🎯 What Happens Next?

### Step 1: Security Setup
- Set your admin password (minimum 8 characters)
- Configure your site URL (auto-detected)

### Step 2: Profile Setup
- Enter your name
- Add a bio description
- Set page title and SEO description

### Step 3: Automatic Configuration
The wizard automatically:
- ✅ Generates secure JWT secret
- ✅ Creates `.env` configuration
- ✅ Initializes database
- ✅ Creates your profile

### Step 4: Start Using
After setup completes:
1. Login at `/admin/login`
2. Customize your theme
3. Add your links
4. Share your page!

## 📦 Without Docker

```bash
# 1. Clone and install
git clone <your-repo-url>
cd personal-linktree
npm install

# 2. Build application
npm run build

# 3. Start server
npm start

# 4. Complete setup
# Visit: http://localhost:3000/setup
```

## 🎨 After Setup

Once setup is complete, you can:

### Customize Your Page
- `/admin/dashboard` - Main admin panel
- Choose from multiple themes
- Enable dark mode
- Upload avatar
- Add social links

### Add Links
- Create new links
- Password protect sensitive links
- Set click limits
- Schedule links (start/end dates)
- Generate QR codes

### Email Features
- Configure SMTP in settings
- Build subscriber list
- Send custom email campaigns

### Analytics
- Track clicks and visitors
- View geographic data
- Export analytics data
- Set retention period

## 🔧 Configuration

### Change Admin Password
1. Login to admin panel
2. Go to Settings
3. Change Password section
4. Enter new password

### Setup Email (Optional)
1. Go to Settings → Email
2. Enter SMTP details:
   - Gmail: smtp.gmail.com:587
   - Outlook: smtp-mail.outlook.com:587
3. Test connection
4. Save settings

### Customize Theme
1. Go to Theme Editor
2. Choose preset or customize:
   - Colors
   - Fonts
   - Button styles
   - Backgrounds
3. Preview changes live
4. Save when satisfied

## 📊 Common Tasks

### Add a New Link
1. Admin Dashboard → Links
2. Click "Add Link"
3. Enter URL and title
4. Choose icon
5. Optional: Set password, limits, schedule
6. Save

### Export Settings
1. Admin Dashboard → Settings
2. Click "Export Settings"
3. Save JSON file (use as backup)

### Import Settings
1. Admin Dashboard → Settings
2. Click "Import Settings"
3. Select previously exported JSON
4. Confirm import

## 🐛 Troubleshooting

### Setup page not loading?
```bash
# Check if app is running
docker-compose ps
# or
curl http://localhost:3000
```

### Forgot admin password?
```bash
# Stop application
docker-compose down

# Delete .env file
rm .env

# Restart and run setup again
docker-compose up -d
```

### Port 3000 already in use?
Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any free port
```

## 📚 Full Documentation

- [README.md](README.md) - Complete project overview
- [DOCKER-KURULUM.md](DOCKER-KURULUM.md) - Detailed Docker guide
- [YUNOHOST-KURULUM.md](YUNOHOST-KURULUM.md) - Yunohost deployment
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guide

## 💡 Tips

- ✅ Use strong passwords (minimum 12 characters)
- ✅ Enable HTTPS in production
- ✅ Export settings regularly
- ✅ Set analytics retention based on needs
- ✅ Test email setup before sending campaigns

## 🎉 You're Ready!

Your Personal Link Tree is now set up and ready to use. Customize it, add your links, and share it with the world!

Need help? Check the [full documentation](README.md) or open an issue on GitHub.
