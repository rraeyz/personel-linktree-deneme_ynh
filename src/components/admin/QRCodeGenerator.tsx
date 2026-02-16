'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { FaQrcode, FaDownload } from 'react-icons/fa'

interface QRCodeGeneratorProps {
  url: string
  title?: string
}

export default function QRCodeGenerator({ url, title = 'Link Tree' }: QRCodeGeneratorProps) {
  const [qrSize, setQrSize] = useState(256)

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = qrSize
    canvas.height = qrSize

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-code-${Date.now()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <FaQrcode className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">QR Kod Oluşturucu</h3>
      </div>

      <div className="space-y-6">
        {/* QR Kod Önizleme */}
        <div className="flex justify-center p-6 bg-white rounded-xl">
          <QRCodeSVG
            id="qr-code-svg"
            value={url}
            size={qrSize}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Boyut Seçici */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            QR Kod Boyutu: {qrSize}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="64"
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>128px</span>
            <span>256px</span>
            <span>512px</span>
          </div>
        </div>

        {/* URL Göster */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">QR Kod Linki</label>
          <div className="p-3 bg-dark-bg rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 break-all">{url}</p>
          </div>
        </div>

        {/* İndir Butonu */}
        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
        >
          <FaDownload className="w-4 h-4" />
          QR Kodu İndir (PNG)
        </button>

        <p className="text-xs text-gray-500 text-center">
          Bu QR kod ile profilinizi kolayca paylaşabilirsiniz
        </p>
      </div>
    </div>
  )
}
