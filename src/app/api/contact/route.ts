import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Profil bilgisinden contact email'i al
    const profile = await prisma.profile.findFirst()
    
    if (!profile || !profile.contactEmail) {
      return NextResponse.json(
        { error: 'Contact email not configured' },
        { status: 400 }
      )
    }

    // E-posta gönderimi
    try {
      // SMTP ayarları environment variables'dan al
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      // E-posta içeriği
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: profile.contactEmail,
        replyTo: email,
        subject: `🔗 İletişim Formu - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #a855f7; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">
              Yeni İletişim Formu Mesajı
            </h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>İsim:</strong> ${name}</p>
              <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #a855f7; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Mesaj:</h3>
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Bu mesaj rraeyz.me iletişim formundan gönderildi<br>
              Tarih: ${new Date().toLocaleString('tr-TR')}
            </p>
          </div>
        `,
        text: `
İletişim Formu Mesajı

İsim: ${name}
E-posta: ${email}

Mesaj:
${message}

---
Tarih: ${new Date().toLocaleString('tr-TR')}
        `,
      }

      await transporter.sendMail(mailOptions)

      console.log('Contact email sent successfully to:', profile.contactEmail)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // E-posta gönderimi başarısız olsa bile formu kaydet
      // Böylece kullanıcı deneyimi bozulmaz
    }

    return NextResponse.json({ 
      success: true,
      message: 'Mesajınız alındı, en kısa sürede dönüş yapılacaktır.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
