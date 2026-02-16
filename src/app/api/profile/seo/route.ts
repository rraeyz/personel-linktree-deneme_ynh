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

    const { pageTitle, pageDescription, ogImageUrl, faviconUrl } = await request.json()

    // İlk profili bul ve güncelle
    const profile = await prisma.profile.findFirst()
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Sadece gönderilen alanları güncelle
    const updateData: any = {}
    if (pageTitle !== undefined) updateData.pageTitle = pageTitle || "Personal Link Tree"
    if (pageDescription !== undefined) updateData.pageDescription = pageDescription || "Welcome to my link tree"
    if (ogImageUrl !== undefined) updateData.ogImageUrl = ogImageUrl || ""
    if (faviconUrl !== undefined) updateData.faviconUrl = faviconUrl || ""

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('SEO update error:', error)
    return NextResponse.json(
      { error: 'Failed to update SEO settings' },
      { status: 500 }
    )
  }
}
