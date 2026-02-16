'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPaperPlane, FaTimes } from 'react-icons/fa'

interface ContactFormProps {
  contactEmail: string
  onClose: () => void
}

export default function ContactForm({ contactEmail, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Gönderim başarısız')
      }

      setMessage('Mesajınız başarıyla gönderildi!')
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setMessage('Bir hata oluştu, lütfen tekrar deneyin.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 bg-dynamic-card rounded-xl border border-gray-800 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Bana Ulaşın</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adınız</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-dynamic-primary transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">E-posta</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-dynamic-primary transition-colors"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Mesajınız</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-dynamic-primary transition-colors resize-none"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                message.includes('başarıyla')
                  ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border border-red-500/50 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full gradient-primary-accent text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              <FaPaperPlane className="w-4 h-4" />
              <span>{sending ? 'Gönderiliyor...' : 'Gönder'}</span>
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
