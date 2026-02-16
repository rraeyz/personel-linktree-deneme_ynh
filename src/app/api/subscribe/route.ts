import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // E-posta validasyonu
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      )
    }

    // Abone ekle veya güncelle
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { name: name || '' },
      create: {
        email,
        name: name || '',
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Bültene başarıyla abone oldunuz!'
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Abonelik işlemi başarısız' },
      { status: 500 }
    )
  }
}
