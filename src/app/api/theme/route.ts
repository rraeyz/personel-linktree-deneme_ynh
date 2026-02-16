import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function PUT(request: NextRequest) {
  try {
    // Token kontrolü
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token.value, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const {
      themePreset,
      primaryColor,
      accentColor,
      backgroundColor,
      cardColor,
      textColor,
      buttonStyle,
      fontFamily,
      borderRadius,
      animationSpeed,
      backgroundType,
      backgroundImage,
      backgroundOpacity,
    } = await request.json()

    // İlk profili bul ve güncelle
    const profile = await prisma.profile.findFirst()
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        themePreset: themePreset || 'purple-dream',
        primaryColor: primaryColor || '#a855f7',
        accentColor: accentColor || '#ec4899',
        backgroundColor: backgroundColor || '#0a0a0a',
        cardColor: cardColor || '#1a1a1a',
        textColor: textColor || '#ffffff',
        buttonStyle: buttonStyle || 'gradient',
        fontFamily: fontFamily || 'Inter',
        borderRadius: borderRadius || 'xl',
        animationSpeed: animationSpeed || 'normal',
        backgroundType: backgroundType || 'gradient-blur',
        backgroundImage: backgroundImage || '',
        backgroundOpacity: backgroundOpacity !== undefined ? backgroundOpacity : 100,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Theme update error:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}
