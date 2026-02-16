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
      // Sistem temasını kontrol et
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
      applyTheme(prefersDark)
    }
  }, [])

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement
    
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.setProperty('--bg-color', '#0a0a0a')
      root.style.setProperty('--text-color', '#ffffff')
      root.style.setProperty('--card-color', '#1a1a1a')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.setProperty('--bg-color', '#ffffff')
      root.style.setProperty('--text-color', '#0a0a0a')
      root.style.setProperty('--card-color', '#f5f5f5')
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
