'use client'

import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // LocalStorage'dan tercihi oku
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isDark = savedTheme === 'dark'
      setDarkMode(isDark)
      applyTheme(isDark)
    } else {
      // Kullanıcının daha önce bir tercihi yok: varsayılan dark mode.
      // Yalnızca sistem teması AÇIKÇA "light" ise buna saygı duyulur.
      // Sistemde net bir tercih yoksa (no-preference) veya dark ise, dark mode ile açılır.
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      const initialIsDark = !prefersLight
      setDarkMode(initialIsDark)
      applyTheme(initialIsDark)
    }
  }, [])

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement

    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
      // Sayfanın gerçekten kullandığı CSS değişkenlerini güncelle
      root.style.setProperty('--color-background', '#0a0a0a')
      root.style.setProperty('--color-card', '#1a1a1a')
      root.style.setProperty('--color-text', '#ffffff')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.setProperty('--color-background', '#f5f5f7')
      root.style.setProperty('--color-card', '#ffffff')
      root.style.setProperty('--color-text', '#0a0a0a')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    applyTheme(newMode)
  }

  if (!mounted) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl group"
      aria-label="Toggle theme"
      title={darkMode ? 'Light Mode' : 'Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <FaSun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
        ) : (
          <FaMoon className="w-5 h-5 text-purple-600 group-hover:text-purple-500 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  )
}
