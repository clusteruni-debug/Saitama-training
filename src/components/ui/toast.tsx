/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react'

interface ToastData {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

// 전역 토스트 상태 (간단한 이벤트 기반)
let toastListeners: ((toast: ToastData) => void)[] = []

export function showToast(message: string, type: ToastData['type'] = 'info') {
  const toast: ToastData = { id: crypto.randomUUID(), message, type }
  toastListeners.forEach((fn) => fn(toast))
}

const typeStyles = {
  success: 'bg-green-600',
  info: 'bg-[var(--color-bg-card)] border border-white/10',
  error: 'bg-red-600',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, 3000)
  }, [])

  useEffect(() => {
    toastListeners.push(addToast)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast)
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-slide-down`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
