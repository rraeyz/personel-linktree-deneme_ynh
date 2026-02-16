'use client'

import { useState, useEffect } from 'react'
import { FaChartLine, FaMousePointer, FaLink, FaCrown, FaGlobe, FaDesktop, FaMobile, FaCalendar, FaInfoCircle } from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsProps {
  links: any[]
}

const COLORS = ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#c026d3', '#9333ea', '#a21caf', '#7c3aed']

export default function AnalyticsDashboard({ links }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, all
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toplam istatistikler
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter(l => l.enabled).length
  const passwordProtected = links.filter(l => l.password).length
  const scheduledLinks = links.filter(l => l.startDate || l.endDate).length

  // Fallback function for demo data - önce tanımla
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' })
      days.push({
        day: dayName,
        clicks: 0
      })
    }
    return days
  }

  // Link başına tıklama verileri (En popüler 10)
  const topLinks = [...links]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map(link => ({
      name: link.title.length > 20 ? link.title.substring(0, 20) + '...' : link.title,
      clicks: link.clicks
    }))

  // Son 7 gün trend - API'den gelen veriyi dönüştür
  const trendData = analytics?.dailyClicks 
    ? analytics.dailyClicks.map((item: any) => ({
        day: new Date(item.date).toLocaleDateString('tr-TR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        clicks: item.count
      }))
    : getLast7Days()

  // Grafik başlığı
  const getTrendTitle = () => {
    if (timeRange === '7d') return 'Son 7 Gün Trend'
    if (timeRange === '30d') return 'Son 30 Gün Trend'
    return 'Tüm Zamanlar Trend'
  }

  // Cihaz ve tarayıcı istatistikleri - API'den gelen object'i array'e çevir
  const deviceStats = analytics?.devices 
    ? Object.entries(analytics.devices).map(([name, value]) => ({ name, value }))
    : []
  const browserStats = analytics?.browsers
    ? Object.entries(analytics.browsers).map(([name, value]) => ({ name, value }))
    : []
  const countryStats = analytics?.countries
    ? Object.entries(analytics.countries).map(([name, value]) => ({ name, value }))
    : []
  const referrerStats = analytics?.referrers
    ? Object.entries(analytics.referrers).slice(0, 10).map(([name, value]) => ({ name, value }))
    : []

  // Eğer gerçek veri yoksa uyarı göster
  const hasRealData = analytics && analytics.dailyClicks && analytics.dailyClicks.length > 0

  // Kategori dağılımı
  const categoryData = links.reduce((acc: any[], link) => {
    const category = link.category || 'Diğer'
    const existing = acc.find(c => c.name === category)
    if (existing) {
      existing.value += link.clicks
    } else {
      acc.push({ name: category, value: link.clicks })
    }
    return acc
  }, []).filter(c => c.value > 0)

  if (loading) {
    return (
      <div className="bg-dark-card border border-gray-800 rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Veri Uyarısı */}
      {!hasRealData && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <FaInfoCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Analytics Verisi Bulunamadı</h4>
              <p className="text-sm text-gray-300">
                Henüz detaylı analytics verisi toplanmamış. Linklere tıklanmaya başlandıkça konum, cihaz ve tarayıcı bilgileri burada görünecek.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                💡 İpucu: Analytics toplamak için linkteki bir butona tıklayın veya kısa link kullanın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaChartLine className="text-purple-400" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Link performansınızı takip edin</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[
            { value: '7d', label: 'Son 7 Gün' },
            { value: '30d', label: 'Son 30 Gün' },
            { value: 'all', label: 'Tüm Zamanlar' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-dark-card text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Toplam Tıklama</p>
              <p className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl">
              <FaMousePointer className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Aktif Linkler</p>
              <p className="text-3xl font-bold text-white">{activeLinks}</p>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-xl">
              <FaLink className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">VIP Linkler</p>
              <p className="text-3xl font-bold text-white">{passwordProtected}</p>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl">
              <FaCrown className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Zamanlanmış</p>
              <p className="text-3xl font-bold text-white">{scheduledLinks}</p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-xl">
              <FaCalendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{getTrendTitle()}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Kategori Dağılımı</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Links Table */}
      <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">En Popüler Linkler</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topLinks} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" width={150} stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="clicks" fill="#a855f7" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Advanced Analytics - Device, Browser, Country */}
      {hasRealData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Stats */}
            <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaDesktop className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Cihaz Dağılımı</h3>
              </div>
              {deviceStats.length > 0 ? (
                <div className="space-y-3">
                  {deviceStats.map((stat: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-dark-bg border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-gray-300 text-sm capitalize">{stat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(stat.value / deviceStats.reduce((sum: number, s: any) => sum + s.value, 0)) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="text-purple-400 font-semibold text-sm w-8 text-right">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">Veri yok</p>
              )}
            </div>

            {/* Browser Stats */}
            <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaGlobe className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Tarayıcı Dağılımı</h3>
              </div>
              {browserStats.length > 0 ? (
                <div className="space-y-3">
                  {browserStats.map((stat: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-dark-bg border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-gray-300 text-sm">{stat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(stat.value / browserStats.reduce((sum: number, s: any) => sum + s.value, 0)) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="text-purple-400 font-semibold text-sm w-8 text-right">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">Veri yok</p>
              )}
            </div>

            {/* Country Stats */}
            <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaGlobe className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Ülke Dağılımı</h3>
              </div>
              {countryStats.length > 0 ? (
                <div className="space-y-2">
                  {countryStats.slice(0, 5).map((stat: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{stat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                            style={{ 
                              width: `${(stat.value / Math.max(...countryStats.map((s: any) => s.value))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold text-sm w-8 text-right">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">Veri yok</p>
              )}
            </div>
          </div>

          {/* Referrer Stats */}
          {referrerStats.length > 0 && (
            <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trafik Kaynakları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {referrerStats.map((stat: any, index: number) => (
                  <div key={index} className="bg-dark-bg border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm truncate flex-1">
                        {stat.name === 'direct' ? '🔗 Direkt Erişim' : `🌐 ${stat.name}`}
                      </span>
                      <span className="text-purple-400 font-semibold ml-2">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Export Analytics Button */}
      {hasRealData && (
        <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Veri Dışa Aktarma</h3>
              <p className="text-gray-400 text-sm">
                Tüm analytics verilerini CSV formatında indir (Excel&apos;de açılabilir)
              </p>
            </div>
            <a
              href="/api/admin/export-analytics"
              download
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all"
            >
              <FaInfoCircle className="w-4 h-4" />
              <span>CSV İndir</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
