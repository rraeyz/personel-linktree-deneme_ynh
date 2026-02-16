'use client'

import { useState, useRef } from 'react'
import { FaBold, FaItalic, FaLink, FaImage, FaListUl, FaListOl, FaExternalLinkAlt, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export default function RichTextEditor({ value, onChange, placeholder = 'Mesajınızı yazın...', minHeight = 200 }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showButtonModal, setShowButtonModal] = useState(false)
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Cursor pozisyonunu ayarla
    setTimeout(() => {
      textarea.focus()
      const newPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const handleBold = () => {
    insertText('**', '**')
  }

  const handleItalic = () => {
    insertText('*', '*')
  }

  const handleBulletList = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + '• ' + value.substring(lineStart)
    onChange(newText)
  }

  const handleNumberedList = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + '1. ' + value.substring(lineStart)
    onChange(newText)
  }

  const insertLink = () => {
    if (!linkText || !linkUrl) {
      alert('Lütfen hem metin hem de URL girin')
      return
    }

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const linkMarkdown = `[${linkText}](${linkUrl})`
    const newText = value.substring(0, start) + linkMarkdown + value.substring(start)
    
    onChange(newText)
    setShowLinkModal(false)
    setLinkText('')
    setLinkUrl('')
    
    setTimeout(() => textarea.focus(), 0)
  }

  const insertImage = () => {
    if (!imageUrl) {
      alert('Lütfen görsel URL\'si girin')
      return
    }

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const imageMarkdown = `![${imageAlt || 'Görsel'}](${imageUrl})`
    const newText = value.substring(0, start) + imageMarkdown + value.substring(start)
    
    onChange(newText)
    setShowImageModal(false)
    setImageUrl('')
    setImageAlt('')
    
    setTimeout(() => textarea.focus(), 0)
  }

  const insertButton = () => {
    if (!buttonText || !buttonUrl) {
      alert('Lütfen hem buton metni hem de URL girin')
      return
    }

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const buttonHtml = `<a href="${buttonUrl}" class="cta-button" style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;margin:10px 0">${buttonText}</a>`
    const newText = value.substring(0, start) + buttonHtml + value.substring(start)
    
    onChange(newText)
    setShowButtonModal(false)
    setButtonText('')
    setButtonUrl('')
    
    setTimeout(() => textarea.focus(), 0)
  }

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    if (!selectedText) {
      alert('Lütfen hizalamak istediğiniz metni seçin')
      return
    }
    
    const alignTag = `<div style="text-align: ${alignment};">${selectedText}</div>`
    const newText = value.substring(0, start) + alignTag + value.substring(end)
    onChange(newText)
    
    setTimeout(() => textarea.focus(), 0)
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 bg-dark-bg border border-gray-700 rounded-t-xl">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Kalın (Ctrl+B)"
        >
          <FaBold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={handleItalic}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="İtalik (Ctrl+I)"
        >
          <FaItalic className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-700 my-1" />

        <button
          type="button"
          onClick={handleBulletList}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Madde İşaretli Liste"
        >
          <FaListUl className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNumberedList}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Numaralı Liste"
        >
          <FaListOl className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-700 my-1" />

        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Link Ekle"
        >
          <FaLink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Görsel Ekle"
        >
          <FaImage className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowButtonModal(true)}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-blue-400 hover:text-blue-300"
          title="Buton Ekle"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700"></div>

        <button
          type="button"
          onClick={() => handleAlign('left')}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Sola Hizala"
        >
          <FaAlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleAlign('center')}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Ortala"
        >
          <FaAlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleAlign('right')}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Sağa Hizala"
        >
          <FaAlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight: `${minHeight}px` }}
        className="w-full px-4 py-3 bg-dark-bg border border-gray-700 border-t-0 rounded-b-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y font-mono text-sm"
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Link Ekle</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Görünen Metin</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Tıkla buraya"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={insertLink}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Görsel Ekle</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Görsel URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Açıklama (opsiyonel)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Görsel açıklaması"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={insertImage}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button Modal */}
      {showButtonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowButtonModal(false)}>
          <div className="bg-dark-card border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Buton Ekle</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Ziyaret Et"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Bağlantı URL</label>
                <input
                  type="url"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={insertButton}
                  className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowButtonModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 <strong>Kalın</strong> için **metin**, <em>italik</em> için *metin* veya yukarıdaki butonları kullanın
      </p>
    </div>
  )
}
