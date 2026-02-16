# 🐳 Docker Installation Guide

Complete guide for deploying Personal Link Tree using Docker.

## 📋 Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher
- 2GB RAM minimum
- 5GB disk space

## 🚀 Quick Start

The easiest way to get started:

```bash
# Clone the repository
git clone <your-repo-url>
cd personal-linktree

# Run the quick start script
chmod +x start.sh
./start.sh
```

This will:
1. ✅ Check Docker installation
2. 🏗️ Build the Docker image
3. 🚀 Start the container
4. 📊 Initialize the database
5. 📝 Show setup instructions

Then visit **http://localhost:3000/setup** to complete the initial setup wizard.

## 📝 Setup Methods

### Method 1: Setup Wizard (Recommended)

Best for first-time users:

```bash
# Start the application
docker-compose up -d

# Visit http://localhost:3000/setup in your browser
```

The setup wizard will guide you through:
1. **Security Configuration**
   - Set admin password (min 8 characters)
   - Configure site URL

2. **Profile Setup**
   - Enter your name
   - Add bio description
   - Set page title and meta description

3. **Automatic Configuration**
   - Generates secure JWT secret
   - Creates `.env` file
   - Initializes database
   - Creates your profile

### Method 2: Manual Configuration

For advanced users who want to configure before starting:

```bash
# Create .env file from example
cp .env.example .env

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Edit .env file
nano .env
```

Update these values in `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="<generated-secret>"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
PORT=3000
NODE_ENV=production
```

Then start the application:
```bash
docker-compose up -d
```

## 🔧 Docker Commands

### Basic Operations

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# Restart application
docker-compose restart

# View logs (live)
docker-compose logs -f

# View logs (last 100 lines)
docker-compose logs --tail=100

# Check status
docker-compose ps
```

### Building and Updating

```bash
# Rebuild image after code changes
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Pull latest changes and update
git pull
docker-compose down
docker-compose up -d --build
```

### Database Operations

```bash
# Access database shell
docker-compose exec app npx prisma studio

# View database
docker-compose exec app npx prisma db push

# Reset database (⚠️ deletes all data)
docker-compose exec app npx prisma db push --force-reset
```

### Container Management

```bash
# Access container shell
docker-compose exec app sh

# View container stats
docker stats personal-linktree

# Inspect container
docker inspect personal-linktree

# Remove all containers and volumes
docker-compose down -v
```

## 🌐 Production Deployment

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd personal-linktree

# Start application
docker-compose up -d

# Complete setup at http://your-server-ip:3000/setup
```

### Step 3: Configure Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/linktree
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/linktree /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 4: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

## 📊 Monitoring and Maintenance

### View Application Logs

```bash
# Real-time logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Filter by time
docker-compose logs --since 30m app
```

### Health Check

```bash
# Check if container is healthy
docker inspect --format='{{.State.Health.Status}}' personal-linktree

# Test health endpoint
curl http://localhost:3000/api/profile
```

### Backup Database

```bash
# Create backup directory
mkdir -p backups

# Backup database
docker cp personal-linktree:/app/prisma/dev.db ./backups/backup-$(date +%Y%m%d-%H%M%S).db

# Or use docker-compose
docker-compose exec app cp /app/prisma/dev.db /app/prisma/backup-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Stop application
docker-compose down

# Restore database file
docker cp ./backups/backup-file.db personal-linktree:/app/prisma/dev.db

# Restart application
docker-compose up -d
```

## 🔒 Security Best Practices

1. **Change Default Passwords**
   ```bash
   # Use setup wizard or update .env
   ADMIN_PASSWORD="strong-password-here"
   ```

2. **Use Strong JWT Secret**
   ```bash
   # Generate secure secret
   JWT_SECRET=$(openssl rand -base64 32)
   ```

3. **Enable HTTPS**
   - Use Let's Encrypt (see SSL setup above)
   - Force HTTPS in Nginx configuration

4. **Regular Updates**
   ```bash
   # Update application
   git pull
   docker-compose up -d --build
   ```

5. **Backup Regularly**
   ```bash
   # Create automated backup script
   cat > backup.sh << 'EOF'
   #!/bin/bash
   docker cp personal-linktree:/app/prisma/dev.db ./backups/backup-$(date +%Y%m%d).db
   find ./backups -name "*.db" -mtime +30 -delete
   EOF
   chmod +x backup.sh
   
   # Add to crontab (daily at 2 AM)
   echo "0 2 * * * /path/to/backup.sh" | crontab -
   ```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs

# Remove and rebuild
docker-compose down -v
docker-compose up -d --build
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Or change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Database Locked

```bash
# Stop container
docker-compose down

# Remove database lock
docker-compose run --rm app rm -f /app/prisma/dev.db-journal

# Restart
docker-compose up -d
```

### Permission Issues

```bash
# Fix volume permissions
docker-compose down
sudo chown -R 1001:1001 prisma/
docker-compose up -d
```

### Out of Memory

```bash
# Check container memory usage
docker stats personal-linktree

# Increase memory limit in docker-compose.yml
services:
  app:
    mem_limit: 2g
```

## 📚 Advanced Configuration

### Custom Environment Variables

Create `.env` file with additional settings:
```env
# Database
DATABASE_URL="file:./dev.db"

# Security
JWT_SECRET="your-secret-key"
ADMIN_PASSWORD="your-password"

# Application
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
PORT=3000
NODE_ENV=production

# SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Multi-Container Setup

For high-traffic deployments, separate database:
```yaml
version: '3.8'

services:
  app:
    build: .
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/linktree

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=linktree
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

volumes:
  postgres-data:
```

## 📖 Additional Resources

- [Main README](README.md) - Project overview
- [Yunohost Installation](YUNOHOST-KURULUM.md) - Deploy on Yunohost
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 💡 Tips

- Use `./start.sh` for the easiest setup experience
- Complete the setup wizard at `/setup` on first run
- Export your settings regularly from admin panel
- Monitor logs during initial setup
- Keep Docker and images updated
- Backup database before updates

---

Need help? Open an issue on GitHub or check the troubleshooting section above.
