import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const linkId = parseInt(id)

    // User-Agent analizi
    const userAgent = request.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    // IP adresi al (production'da cloudflare/nginx headerları)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1'

    // GeoIP lookup (localhost değilse)
    let country = 'Unknown'
    let city = ''
    let region = ''
    
    if (geoip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      const geo = geoip.lookup(ip)
      if (geo) {
        country = geo.country || 'Unknown'
        city = geo.city || ''
        region = geo.region || ''
      }
    } else {
      // Localhost - sunucuya atınca otomatik gerçek IP'yi kullanacak
      country = 'Local'
    }

    // 1) Link'i güncelle - tıklama sayısını artır
    const link = await prisma.link.update({
      where: { id: linkId },
      data: {
        clicks: {
          increment: 1
        }
      }
    })

    // 2) Analytics kaydı oluştur (gerçek verilerle)
    await prisma.analytics.create({
      data: {
        linkId,
        timestamp: new Date(),
        userAgent,
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        country,
        city,
        region,
        referrer: request.headers.get('referer') || '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        ipHash: ip // Orijinal IP (sunucuda gerçek IP olacak)
      }
    })

    return NextResponse.json({ success: true, clicks: link.clicks })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Click tracking failed' },
      { status: 500 }
    )
  }
}
