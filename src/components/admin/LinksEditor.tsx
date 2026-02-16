'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaTrash, FaTimes, FaGripVertical, FaSave, FaChartBar, FaFolder, FaEdit, FaLock, FaClock, FaCalendarCheck } from 'react-icons/fa'
import ScheduleStatus from '@/components/ScheduleStatus'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface LinksEditorProps {
  initialLinks: any[]
}

const popularIcons = [
  { name: 'FaGithub', label: 'GitHub' },
  { name: 'FaTwitter', label: 'Twitter/X' },
  { name: 'FaLinkedin', label: 'LinkedIn' },
  { name: 'FaInstagram', label: 'Instagram' },
  { name: 'FaYoutube', label: 'YouTube' },
  { name: 'FaGlobe', label: 'Website' },
  { name: 'FaEnvelope', label: 'Email' },
  { name: 'FaDiscord', label: 'Discord' },
  { name: 'SiTelegram', label: 'Telegram' },
  { name: 'FaMedium', label: 'Medium' },
  { name: 'FaLink', label: 'Link' },
  { name: 'FaDonate', label: 'Bağış' },
  { name: 'FaPhone', label: 'Telefon' },
  { name: 'FaMapMarkerAlt', label: 'Konum' },
  { name: 'FaCalendarAlt', label: 'Etkinlik' },
  { name: 'FaFileAlt', label: 'Dosya' },
  { name: 'FaMusic', label: 'Müzik' },
  { name: 'FaVideo', label: 'Video' },
  { name: 'FaGamepad', label: 'Oyun' },
  { name: 'FaCamera', label: 'Fotoğraf' },
  { name: 'FaBook', label: 'Kitap' },
  { name: 'FaHeart', label: 'Favori' },
  { name: 'FaStar', label: 'Yıldız' },
  { name: 'FaShoppingCart', label: 'Mağaza' },
  { name: 'FaUser', label: 'Kullanıcı' },
  { name: 'FaUsers', label: 'Topluluk' },
  { name: 'FaCode', label: 'Kod' },
  { name: 'FaCogs', label: 'Ayarlar' },
  { name: 'FaCloud', label: 'Bulut' },
]

const linkCategories = [
  'Sosyal Medya',
  'İş & Kariyer',
  'Projeler',
  'İletişim',
  'Blog & Yazılar',
  'Video & Podcast',
  'Diğer'
]

const linkTypes = [
  { value: 'link', label: 'Normal Link', icon: 'FaLink', description: 'Başka sayfaya yönlendir' },
  { value: 'contact', label: 'Bana Ulaşın', icon: 'FaEnvelope', description: 'İletişim formu aç' },
  { value: 'donation', label: 'Bağış Yap', icon: 'FaDonate', description: 'Bağış sayfasına git' },
  { value: 'embed-youtube', label: 'YouTube Embed', icon: 'FaYoutube', description: 'YouTube video göm' },
  { value: 'embed-twitter', label: 'Twitter Embed', icon: 'FaTwitter', description: 'Tweet göm' },
  { value: 'embed-instagram', label: 'Instagram Embed', icon: 'FaInstagram', description: 'Instagram post göm' },
]

// Icon renderer helper
const getIconComponent = (iconName: string) => {
  const allIcons = { ...require('react-icons/fa'), ...require('react-icons/si') } as any
  return allIcons[iconName] || allIcons['FaLink']
}

// Sortable Link Item Component
function SortableLinkItem({ link, onToggle, onDelete, onEdit }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Tarih kontrolü
  const now = new Date()
  const isScheduled = !!(link.startDate || link.endDate)
  const isNotYetActive = link.startDate && new Date(link.startDate) > now
  const isExpired = link.endDate && new Date(link.endDate) < now
  const hasPassword = !!link.password

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-dark-bg rounded-xl border border-gray-700 ${
        !link.enabled ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <FaGripVertical className="text-gray-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* İkon Önizleme */}
            <div className="p-2 bg-purple-500/10 rounded-lg">
              {link.icon.startsWith('http') ? (
                <img 
                  src={link.icon} 
                  alt="icon" 
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                (() => {
                  const IconComponent = getIconComponent(link.icon)
                  return <IconComponent className="w-5 h-5 text-purple-400" />
                })()
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">{link.title}</h3>
                {link.category && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                    <FaFolder className="w-3 h-3" />
                    {link.category}
                  </span>
                )}
                {hasPassword && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1" title="Şifreli">
                    <FaLock className="w-3 h-3" />
                    VIP
                  </span>
                )}
                {isScheduled && (
                  <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                    isNotYetActive ? 'bg-orange-500/20 text-orange-400' :
                    isExpired ? 'bg-red-500/20 text-red-400' :
                    'bg-green-500/20 text-green-400'
                  }`} title={
                    isNotYetActive ? 'Henüz aktif değil' :
                    isExpired ? 'Süresi dolmuş' :
                    'Zamanlanmış'
                  }>
                    <FaClock className="w-3 h-3" />
                    {isNotYetActive ? 'Bekliyor' : isExpired ? 'Dolmuş' : 'Zamanlanmış'}
                  </span>
                )}
                {link.slug && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full" title={`/go/${link.slug}`}>
                    /go/{link.slug}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">
                  {link.icon.startsWith('http') ? 'Özel İkon' : link.icon}
                </span>
                {link.clicks > 0 && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                    <FaChartBar className="w-3 h-3" />
                    {link.clicks} tıklama
                  </span>
                )}
              </div>
            </div>
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors ml-12 mt-1 block"
          >
            {link.url}
          </a>
          {isScheduled && (
            <div className="ml-12 mt-2">
              <ScheduleStatus startDate={link.startDate} endDate={link.endDate} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(link)}
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onToggle(link.id, link.enabled)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              link.enabled
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {link.enabled ? 'Aktif' : 'Pasif'}
          </button>
          
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LinksEditor({ initialLinks }: LinksEditorProps) {
  const [links, setLinks] = useState(initialLinks)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [formData, setFormData] = useState({ 
    title: '', 
    url: '', 
    icon: 'FaLink', 
    customIconUrl: '', 
    category: '',
    type: 'link',
    password: '',
    passwordHint: '',
    slug: '',
    startDate: '',
    endDate: ''
  })
  const [useCustomIcon, setUseCustomIcon] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link: any) => link.id === active.id)
      const newIndex = links.findIndex((link: any) => link.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)

      // Update order in database
      try {
        await Promise.all(
          newLinks.map((link: any, index: number) =>
            fetch(`/api/links/${link.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: index }),
            })
          )
        )
        router.refresh()
      } catch (error) {
        console.error('Sıralama güncellenirken hata:', error)
      }
    }
  }

  const handleAdd = async () => {
    try {
      const iconToSave = useCustomIcon && formData.customIconUrl 
        ? formData.customIconUrl 
        : formData.icon

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: formData.title, 
          url: formData.url, 
          icon: iconToSave,
          category: formData.category,
          type: formData.type,
          password: formData.password,
          passwordHint: formData.passwordHint,
          slug: formData.slug,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null
        }),
      })

      if (response.ok) {
        setFormData({ title: '', url: '', icon: 'FaLink', customIconUrl: '', category: '', type: 'link', password: '', passwordHint: '', slug: '', startDate: '', endDate: '' })
        setUseCustomIcon(false)
        setShowAddForm(false)
        router.refresh()
        const updatedLinks = await fetch('/api/links').then(r => r.json())
        setLinks(updatedLinks)
      }
    } catch (error) {
      alert('Link eklenirken hata oluştu')
    }
  }

  const handleUpdate = async (id: number, updates: any) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        router.refresh()
        const updatedLinks = await fetch('/api/links').then(r => r.json())
        setLinks(updatedLinks)
      }
    } catch (error) {
      alert('Link güncellenirken hata oluştu')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu linki silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
        const updatedLinks = await fetch('/api/links').then(r => r.json())
        setLinks(updatedLinks)
      }
    } catch (error) {
      alert('Link silinirken hata oluştu')
    }
  }

  const toggleEnabled = async (id: number, enabled: boolean) => {
    await handleUpdate(id, { enabled: !enabled })
  }

  const handleEditClick = (link: any) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon.startsWith('http') ? 'FaLink' : link.icon,
      customIconUrl: link.icon.startsWith('http') ? link.icon : '',
      category: link.category || '',
      type: link.type || 'link',
      password: link.password || '',
      passwordHint: link.passwordHint || '',
      slug: link.slug || '',
      startDate: link.startDate ? new Date(link.startDate).toISOString().slice(0, 16) : '',
      endDate: link.endDate ? new Date(link.endDate).toISOString().slice(0, 16) : ''
    })
    setUseCustomIcon(link.icon.startsWith('http'))
    setShowAddForm(false)
  }

  const handleEditSave = async () => {
    if (!editingLink) return

    try {
      const iconToSave = useCustomIcon ? formData.customIconUrl : formData.icon
      
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          icon: iconToSave,
          category: formData.category,
          type: formData.type,
          password: formData.password,
          passwordHint: formData.passwordHint,
          slug: formData.slug,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null
        }),
      })

      if (response.ok) {
        setFormData({ title: '', url: '', icon: 'FaLink', customIconUrl: '', category: '', type: 'link', password: '', passwordHint: '', slug: '', startDate: '', endDate: '' })
        setUseCustomIcon(false)
        setEditingLink(null)
        router.refresh()
        const updatedLinks = await fetch('/api/links').then(r => r.json())
        setLinks(updatedLinks)
      }
    } catch (error) {
      alert('Link güncellenirken hata oluştu')
    }
  }

  const handleCancelEdit = () => {
    setEditingLink(null)
    setFormData({ title: '', url: '', icon: 'FaLink', customIconUrl: '', category: '', type: 'link', password: '', passwordHint: '', slug: '', startDate: '', endDate: '' })
    setUseCustomIcon(false)
  }

  return (
    <div className="bg-dark-card border border-gray-800 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Link Yönetimi</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
        >
          <FaPlus className="w-4 h-4" />
          <span>Yeni Link Ekle</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-dark-bg rounded-xl border-2 border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Yeni Link Ekle</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="GitHub Profilim"
              />
            </div>

            {/* Link Türü Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Link Türü</label>
              <div className="grid grid-cols-3 gap-3">
                {linkTypes.map((linkType) => {
                  const IconComponent = getIconComponent(linkType.icon)
                  return (
                    <button
                      key={linkType.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: linkType.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === linkType.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-dark-card'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs font-medium text-white">{linkType.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{linkType.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'contact' ? 'Form Başlığı (URL gerekmez)' : 'URL'}
              </label>
              <input
                type={formData.type === 'contact' ? 'text' : 'url'}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder={formData.type === 'contact' ? 'İletişim formu' : 'https://github.com/username'}
                required={formData.type !== 'contact'}
              />
              {formData.type === 'contact' && (
                <p className="text-xs text-gray-500 mt-1">
                  İletişim formu için URL gerekmez, dropdown açılır
                </p>
              )}
            </div>
            
            {/* İkon Seçim Tipi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">İkon Türü</label>
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => setUseCustomIcon(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    !useCustomIcon
                      ? 'bg-purple-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-hover'
                  }`}
                >
                  Hazır İkonlar
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustomIcon(true)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    useCustomIcon
                      ? 'bg-purple-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-hover'
                  }`}
                >
                  Özel İkon (URL)
                </button>
              </div>
            </div>

            {/* İkon Seçimi */}
            {!useCustomIcon ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İkon Seç</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon)
                      return <IconComponent className="w-5 h-5" />
                    })()}
                  </div>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full pl-12 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {popularIcons.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İkon URL</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.customIconUrl}
                    onChange={(e) => setFormData({ ...formData, customIconUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com/icon.png"
                  />
                  {formData.customIconUrl && (
                    <div className="flex items-center gap-2 p-3 bg-dark-card rounded-lg border border-gray-700">
                      <span className="text-sm text-gray-400">Önizleme:</span>
                      <img 
                        src={formData.customIconUrl} 
                        alt="Icon preview" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kategori Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kategori (Opsiyonel)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                  <FaFolder className="w-4 h-4" />
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Kategorisiz</option>
                  {linkCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Protection */}
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FaLock className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white">Şifre Koruması (VIP/Premium İçerik)</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Şifre (Boş = Korumasız)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    placeholder="Şifre belirleyin"
                  />
                </div>
                {formData.password && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Şifre İpucu (Opsiyonel)</label>
                    <input
                      type="text"
                      value={formData.passwordHint}
                      onChange={(e) => setFormData({ ...formData, passwordHint: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Örn: İlk evcil hayvanın adı"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FaChartBar className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white">Zamanlama (Opsiyonel)</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Başlangıç Tarihi</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bitiş Tarihi</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Link sadece bu tarihler arasında gösterilir</p>
            </div>

            {/* Short URL Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kısa Link (Opsiyonel)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">/go/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="flex-1 px-3 py-2 bg-dark-card border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="github"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Örn: /go/github (Sadece küçük harf, rakam ve tire)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <FaSave className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ title: '', url: '', icon: 'FaLink', customIconUrl: '', category: '', type: 'link', password: '', passwordHint: '', slug: '', startDate: '', endDate: '' })
                  setUseCustomIcon(false)
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingLink && (
        <div className="mb-6 p-6 bg-dark-bg rounded-xl border-2 border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Link Düzenle</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="GitHub Profilim"
              />
            </div>

            {/* Link Türü Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Link Türü</label>
              <div className="grid grid-cols-3 gap-3">
                {linkTypes.map((linkType) => {
                  const IconComponent = getIconComponent(linkType.icon)
                  return (
                    <button
                      key={linkType.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: linkType.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === linkType.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-dark-card'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs font-medium text-white">{linkType.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{linkType.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'contact' ? 'Form Başlığı (URL gerekmez)' : 'URL'}
              </label>
              <input
                type={formData.type === 'contact' ? 'text' : 'url'}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder={formData.type === 'contact' ? 'İletişim formu' : 'https://github.com/username'}
                required={formData.type !== 'contact'}
              />
              {formData.type === 'contact' && (
                <p className="text-xs text-gray-500 mt-1">
                  İletişim formu için URL gerekmez, dropdown açılır
                </p>
              )}
            </div>
            
            {/* İkon Seçim Tipi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">İkon Türü</label>
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => setUseCustomIcon(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    !useCustomIcon
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-hover'
                  }`}
                >
                  Hazır İkonlar
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustomIcon(true)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    useCustomIcon
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:bg-dark-hover'
                  }`}
                >
                  Özel İkon (URL)
                </button>
              </div>
            </div>

            {/* İkon Seçimi */}
            {!useCustomIcon ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İkon Seç</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon)
                      return <IconComponent className="w-5 h-5" />
                    })()}
                  </div>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full pl-12 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {popularIcons.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İkon URL</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.customIconUrl}
                    onChange={(e) => setFormData({ ...formData, customIconUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/icon.png"
                  />
                  {formData.customIconUrl && (
                    <div className="flex items-center gap-2 p-3 bg-dark-card rounded-lg border border-gray-700">
                      <span className="text-sm text-gray-400">Önizleme:</span>
                      <img 
                        src={formData.customIconUrl} 
                        alt="Icon preview" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kategori (Opsiyonel)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <FaFolder className="w-4 h-4" />
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Kategorisiz</option>
                  {linkCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEditSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FaSave className="w-4 h-4" />
                <span>Güncelle</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Henüz link eklenmemiş</p>
          ) : (
            <SortableContext
              items={links.map((link: any) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map((link: any) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onToggle={toggleEnabled}
                  onDelete={handleDelete}
                  onEdit={handleEditClick}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>
    </div>
  )
}
