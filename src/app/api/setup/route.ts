import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Setup tamamlanmış mı kontrol et
    const envPath = path.join(process.cwd(), '.env')
    const envExists = fs.existsSync(envPath)
    
    if (!envExists) {
      return NextResponse.json({ setupRequired: true, step: 'initial' })
    }

    // Admin şifresi ayarlanmış mı kontrol et
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || adminPassword === 'admin123' || adminPassword === 'change-this-password' || adminPassword === 'auto-generated-on-first-setup') {
      // .env var ama şifre belirlenmemiş - tekrar initial'a dön
      return NextResponse.json({ setupRequired: true, step: 'initial' })
    }

    // Database kontrol et - eğer yoksa otomatik oluştur
    try {
      const profile = await prisma.profile.findFirst()
      if (!profile) {
        // Database var ama profil yok - oluştur
        await prisma.profile.create({
          data: {
            id: 1,
            name: 'Your Name',
            bio: 'Welcome to my link tree!',
            pageTitle: 'Personal Link Tree',
            pageDescription: 'My personal links',
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
      }
    } catch (error: any) {
      // Database tabloları yok - oluştur
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        try {
          console.log('📦 Database tabloları oluşturuluyor...')
          const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
          execSync(`npx prisma db push --url="${dbUrl}" --accept-data-loss`, { 
            cwd: process.cwd(),
            stdio: 'inherit'
          })
          console.log('✅ Database tabloları oluşturuldu')
          
          // Profil oluştur
          await prisma.profile.create({
            data: {
              id: 1,
              name: 'Your Name',
              bio: 'Welcome to my link tree!',
              pageTitle: 'Personal Link Tree',
              pageDescription: 'My personal links',
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
        } catch (dbError) {
          console.error('Database oluşturma hatası:', dbError)
          return NextResponse.json({ setupRequired: true, step: 'initial' })
        }
      } else {
        return NextResponse.json({ setupRequired: true, step: 'initial' })
      }
    }

    return NextResponse.json({ setupRequired: false })
  } catch (error) {
    console.error('Setup check error:', error)
    return NextResponse.json({ setupRequired: true, step: 'initial' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { step, data } = await request.json()

    if (step === 'initial') {
      // .env dosyası oluştur
      const jwtSecret = crypto.randomBytes(32).toString('base64')
      const envContent = `# Database
DATABASE_URL="file:./dev.db"

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
      process.env.DATABASE_URL = "file:./dev.db"
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
      // Ensure DATABASE_URL is loaded (in case .env was just created)
      if (!process.env.DATABASE_URL) {
        const envPath = path.join(process.cwd(), '.env')
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8')
          const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/)
          if (dbUrlMatch && dbUrlMatch[1]) {
            process.env.DATABASE_URL = dbUrlMatch[1]
          }
        }
      }

      // Database'i initialize et
      try {
        // Önce database tablolarını oluştur
        console.log('📦 Database tabloları oluşturuluyor...')
        const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
        execSync(`npx prisma db push --url="${dbUrl}" --accept-data-loss`, { 
          cwd: process.cwd(),
          stdio: 'inherit'
        })
        console.log('✅ Database tabloları oluşturuldu')

        // Prisma client'ı yeniden initialize et (DATABASE_URL yeni set edildi)
        const { PrismaClient } = require('@prisma/client')
        const newPrisma = new PrismaClient({
          datasources: {
            db: {
              url: dbUrl
            }
          }
        })

        // Default profil oluştur
        await newPrisma.profile.upsert({
          where: { id: 1 },
          update: {},
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

        // Bağlantıyı kapat
        await newPrisma.$disconnect()

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
