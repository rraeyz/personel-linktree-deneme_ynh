import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { password } = await request.json()

    const link = await prisma.link.findUnique({
      where: { id: parseInt(id) },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    if (!link.password) {
      return NextResponse.json({ error: 'Link is not password protected' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, link.password)

    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Yanlış şifre' 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true,
      url: link.url 
    })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
