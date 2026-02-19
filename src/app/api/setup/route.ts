import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Admin şifresi ayarlanmış mı kontrol et
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || adminPassword === 'admin123' || adminPassword === 'change-this-password' || adminPassword === 'auto-generated-on-first-setup' || adminPassword === 'SETUP_REQUIRED') {
      return NextResponse.json({ setupRequired: true, step: 'initial' })
    }

    // Database kontrol et
    try {
      await prisma.profile.findFirst()
    } catch (error: any) {
      console.error('Database erişim hatası:', error)
      return NextResponse.json({ setupRequired: true, step: 'initial' })
    }

    return NextResponse.json({ setupRequired: false })
  } catch (error) {
    console.error('Setup check error:', error)
    return NextResponse.json({ setupRequired: true, step: 'initial' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { step, data = {} } = await request.json()

    if (step === 'initial') {
      // .env dosyası oluştur
      const jwtSecret = crypto.randomBytes(32).toString('base64')
      const envContent = `# Database
DATABASE_URL="file:./prisma/dev.db"

# Security
JWT_SECRET="${jwtSecret}"
ADMIN_USERNAME="${data.adminUsername}"
ADMIN_PASSWORD="${data.adminPassword}"

# Application
NEXT_PUBLIC_BASE_URL="${data.baseUrl}"
PORT=3000
NODE_ENV=production
`

      const envPath = path.join(process.cwd(), '.env')
      fs.writeFileSync(envPath, envContent)

      // Immediately load env vars into process.env
      // Note: NEXT_PUBLIC_* vars are replaced at build time, so we don't set them at runtime
      process.env.DATABASE_URL = "file:./prisma/dev.db"
      process.env.JWT_SECRET = jwtSecret
      process.env.ADMIN_USERNAME = data.adminUsername
      process.env.ADMIN_PASSWORD = data.adminPassword

      return NextResponse.json({ 
        success: true, 
        message: 'Environment configured',
        nextStep: 'database'
      })
    }

    if (step === 'database') {
      // Database tabloları build aşamasında template.db ile oluşturuldu
      // Burada sadece profil oluşturuyoruz
      try {
        console.log('📦 Profil oluşturuluyor...')
        
        await prisma.profile.upsert({
          where: { id: 1 },
          update: {
            name: data.name || 'Your Name',
            bio: data.bio || 'Welcome to my link tree!',
            pageTitle: data.pageTitle || 'Personal Link Tree',
            pageDescription: data.pageDescription || 'My personal links',
          },
          create: {
            id: 1,
            name: data.name || 'Your Name',
            bio: data.bio || 'Welcome to my link tree!',
            pageTitle: data.pageTitle || 'Personal Link Tree',
            pageDescription: data.pageDescription || 'My personal links',
            imageUrl: '/default-avatar.jpg',
            themePreset: 'purple-dream',
            primaryColor: '#a855f7',
            accentColor: '#ec4899',
            backgroundColor: '#0a0a0a',
            cardColor: '#1a1a1a',
            textColor: '#ffffff',
            buttonStyle: 'gradient',
            fontFamily: 'Inter',
            borderRadius: 'xl',
            animationSpeed: 'normal',
            backgroundType: 'gradient-blur',
            backgroundImage: '',
            backgroundOpacity: 100,
          }
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Database initialized',
          nextStep: 'complete'
        })
      } catch (error) {
        console.error('Database setup error:', error)
        return NextResponse.json({ 
          success: false, 
          error: 'Database initialization failed. Please ensure database is accessible.' 
        }, { status: 500 })
      }
    }

    if (step === 'complete') {
      return NextResponse.json({ 
        success: true, 
        message: 'Setup completed successfully!' 
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid step' 
    }, { status: 400 })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Setup failed' 
    }, { status: 500 })
  }
}
