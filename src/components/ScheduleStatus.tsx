'use client'

import { useState, useEffect } from 'react'
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface ScheduleStatusProps {
  startDate?: Date | string | null
  endDate?: Date | string | null
}

export default function ScheduleStatus({ startDate, endDate }: ScheduleStatusProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [status, setStatus] = useState<'waiting' | 'active' | 'expired'>('active')

  useEffect(() => {
    const calculateStatus = () => {
      const now = new Date()
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && start > now) {
        // Henüz başlamamış
        setStatus('waiting')
        const diff = start.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeLeft(`${days} gün ${hours} saat`)
        } else if (hours > 0) {
          setTimeLeft(`${hours} saat ${minutes} dakika`)
        } else {
          setTimeLeft(`${minutes} dakika`)
        }
      } else if (end && end < now) {
        // Süresi dolmuş
        setStatus('expired')
        setTimeLeft('Süresi doldu')
      } else if (end && end > now) {
        // Aktif ama süre sınırı var
        setStatus('active')
        const diff = end.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        
        if (days > 0) {
          setTimeLeft(`${days} gün kaldı`)
        } else if (hours > 0) {
          setTimeLeft(`${hours} saat kaldı`)
        } else {
          setTimeLeft('Yakında sona erecek')
        }
      } else {
        setStatus('active')
        setTimeLeft('Aktif')
      }
    }

    calculateStatus()
    const interval = setInterval(calculateStatus, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [startDate, endDate])

  if (status === 'active' && !endDate) {
    return null // Scheduled değilse gösterme
  }

  const statusConfig = {
    waiting: {
      icon: FaClock,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      label: 'Bekliyor',
    },
    active: {
      icon: FaCheckCircle,
      color: 'text-green-400 bg-green-500/10 border-green-500/20',
      label: 'Aktif',
    },
    expired: {
      icon: FaTimesCircle,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      label: 'Süresi Doldu',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.color} text-xs font-medium`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{timeLeft}</span>
    </div>
  )
}
