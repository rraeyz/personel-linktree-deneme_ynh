import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Profil var mı kontrol et
    let profile = await prisma.profile.findFirst()

    if (profile) {
      // Güncelle - gelen tüm alanları güncelle
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          ...data
        },
      })
    } else {
      // Oluştur
      profile = await prisma.profile.create({
        data: {
          ...data
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
