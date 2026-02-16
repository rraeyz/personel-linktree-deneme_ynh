import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'
import crypto from 'crypto'

// Make geoip-lite optional for build
let geoip: any = null
try {
  geoip = require('geoip-lite')
} catch (error) {
  console.log('GeoIP not available, will use default location data')
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ShortLink({ params }: PageProps) {
  const { slug } = params

  // Slug ile link'i bul
  const link = await prisma.link.findFirst({
    where: {
      slug: slug,
      enabled: true,
    },
  })

  // Link bulunamazsa 404
  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-gray-400 mb-8">Kısa link bulunamadı</p>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    )
  }

  // Tarih kontrolü - scheduled links
  const now = new Date()
  if (link.startDate && new Date(link.startDate) > now) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">⏰ Henüz Aktif Değil</h1>
          <p className="text-gray-400 mb-2">Bu link henüz aktif değil.</p>
          <p className="text-sm text-gray-500">
            Başlangıç: {new Date(link.startDate).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    )
  }

  if (link.endDate && new Date(link.endDate) < now) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">⏱️ Süresi Dolmuş</h1>
          <p className="text-gray-400">Bu linkin geçerlilik süresi dolmuş.</p>
        </div>
      </div>
    )
  }

  // Şifre korumalı ise ana sayfaya yönlendir
  if (link.password) {
    redirect(`/?link=${link.id}`)
  }

  // Analytics verisi kaydet (server-side)
  try {
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    // IP address ve GeoIP
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || 
              headersList.get('x-real-ip') || 
              '127.0.0.1'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
    
    let geo: any = null
    if (geoip) {
      geo = geoip.lookup(ip !== '127.0.0.1' ? ip : '8.8.8.8') // Localhost için Google DNS kullan
    }

    // Referrer
    const referrer = headersList.get('referer') || headersList.get('referrer') || ''

    // Analytics kaydı oluştur
    await prisma.analytics.create({
      data: {
        linkId: link.id,
        userAgent,
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        country: geo?.country || 'Unknown',
        city: geo?.city || '',
        region: geo?.region || '',
        referrer,
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        ipHash,
      }
    })

    // Link tıklama sayısını artır
    await prisma.link.update({
      where: { id: link.id },
      data: {
        clicks: {
          increment: 1
        }
      }
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Hata olsa da devam et
  }

  // Hedef URL'ye yönlendir
  redirect(link.url)
}
