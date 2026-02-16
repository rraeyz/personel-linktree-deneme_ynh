import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(links)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      title, 
      url, 
      icon, 
      category, 
      type, 
      password, 
      passwordHint, 
      slug, 
      startDate, 
      endDate 
    } = await request.json()

    // En yüksek order değerini bul
    const maxOrderLink = await prisma.link.findFirst({
      orderBy: { order: 'desc' },
    })

    const newOrder = (maxOrderLink?.order || 0) + 1

    // Eğer password varsa hash'le
    const hashedPassword = password ? await bcrypt.hash(password, 10) : ''

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon: icon || 'FaLink',
        order: newOrder,
        category: category || '',
        type: type || 'link',
        password: hashedPassword,
        passwordHint: passwordHint || '',
        slug: slug || '',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Link creation error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
