import { useState, useEffect, useRef } from 'react'
import { useTrainingStore } from '../../stores/useTrainingStore'

interface RestTimerProps {
  onFinish: () => void
}

export function RestTimer({ onFinish }: RestTimerProps) {
  const restSeconds = useTrainingStore((s) => s.settings.restTimerSeconds)
  const [remaining, setRemaining] = useState(restSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          onFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [onFinish])

  const progress = ((restSeconds - remaining) / restSeconds) * 100

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-wider">
        휴식
      </p>

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="var(--color-hero-yellow)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 283} 283`}
            className="transition-all duration-1000"
          />
        </svg>
        <p className="text-4xl font-black text-[var(--color-text-primary)] z-10">
          {remaining}
        </p>
      </div>

      <button
        onClick={onFinish}
        className="text-[var(--color-hero-yellow)] text-sm font-medium"
      >
        건너뛰기 →
      </button>
    </div>
  )
}
