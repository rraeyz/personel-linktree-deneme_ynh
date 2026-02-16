'use client'

import { motion } from 'framer-motion'

interface DynamicBackgroundProps {
  type: string
  backgroundColor: string
  primaryColor: string
  accentColor: string
  imageUrl?: string
  opacity?: number
}

export default function DynamicBackground({ 
  type, 
  backgroundColor, 
  primaryColor, 
  accentColor, 
  imageUrl,
  opacity = 100 
}: DynamicBackgroundProps) {
  
  // Solid - Düz renk
  if (type === 'solid') {
    return (
      <div 
        className="fixed inset-0 -z-10" 
        style={{ backgroundColor }}
      />
    )
  }

  // Image - Özel görsel
  if (type === 'image' && imageUrl) {
    return (
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            opacity: opacity / 100,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: `${backgroundColor}80` }}
        />
      </div>
    )
  }

  // Mesh Gradient - Karışık gradient mesh
  if (type === 'mesh-gradient') {
    return (
      <div className="fixed inset-0 -z-10" style={{ backgroundColor }}>
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, ${primaryColor}40 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${accentColor}40 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, ${primaryColor}30 0%, transparent 50%),
                radial-gradient(circle at 90% 30%, ${accentColor}30 0%, transparent 50%),
                radial-gradient(circle at 10% 80%, ${primaryColor}30 0%, transparent 50%)
              `
            }}
          />
        </div>
      </div>
    )
  }

  // Particles - Yüzen noktalar
  if (type === 'particles') {
    return (
      <div className="fixed inset-0 -z-10" style={{ backgroundColor }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    )
  }

  // Gradient Blur (default) - Animasyonlu bulanık gradientler
  return (
    <div className="fixed inset-0 -z-10" style={{ backgroundColor }}>
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          style={{ background: primaryColor }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          style={{ background: accentColor }}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          style={{ background: primaryColor }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  )
}
