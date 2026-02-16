'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  theme: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    cardColor: string
    textColor: string
    buttonStyle: string
    fontFamily: string
    borderRadius: string
    animationSpeed: string
  }
}

export default function ThemeProvider({ theme }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement

    // Renk değişkenlerini ayarla
    root.style.setProperty('--color-primary', theme.primaryColor)
    root.style.setProperty('--color-accent', theme.accentColor)
    root.style.setProperty('--color-background', theme.backgroundColor)
    root.style.setProperty('--color-card', theme.cardColor)
    root.style.setProperty('--color-text', theme.textColor)

    // Border radius mapping
    const radiusMap: Record<string, string> = {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    }
    root.style.setProperty('--border-radius', radiusMap[theme.borderRadius] || '0.75rem')

    // Animation speed mapping
    const speedMap: Record<string, string> = {
      slow: '500ms',
      normal: '300ms',
      fast: '150ms',
    }
    root.style.setProperty('--animation-duration', speedMap[theme.animationSpeed] || '300ms')

    // Font family
    document.body.style.fontFamily = `${theme.fontFamily}, sans-serif`
  }, [theme])

  return null
}
