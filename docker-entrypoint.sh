#!/bin/sh
set -e

# ============================================
# Personal Linktree - Docker Entrypoint
# ============================================

# İlk kurulumda database template'den kopyala
# (data_dir/prisma volume mount ediliyor, dev.db yoksa oluştur)
if [ ! -f /app/prisma/dev.db ]; then
  echo "📦 İlk kurulum: Database template kopyalanıyor..."
  cp /app/template.db /app/prisma/dev.db
  echo "✅ Database başarıyla oluşturuldu"
else
  echo "✅ Mevcut database bulundu: /app/prisma/dev.db"
fi

echo "🚀 Next.js server başlatılıyor..."
exec node server.js
