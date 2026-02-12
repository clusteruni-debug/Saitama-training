import { useState, useEffect, useRef, useCallback } from 'react'
import type { TrackType } from '../../types'
import { suggestRestSeconds } from '../../lib/smart-coach'

interface RestTimerProps {
  onFinish: () => void
  targetReps: number
  track: TrackType
}

export function RestTimer({ onFinish, targetReps, track }: RestTimerProps) {
  const suggestedSeconds = suggestRestSeconds(targetReps, track)
  const [totalSeconds, setTotalSeconds] = useState(suggestedSeconds)
  const [remaining, setRemaining] = useState(suggestedSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ±15초 조절
  const adjust = useCallback((delta: number) => {
    setTotalSeconds((prev) => {
      const next = Math.max(15, Math.min(300, prev + delta))
      setRemaining((r) => Math.max(0, r + delta))
      return next
    })
  }, [])

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

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100

  // 렙수 기반 가이드 메시지
  const guideMessage = targetReps <= 5
    ? '근력 운동은 충분히 쉬세요'
    : targetReps <= 12
      ? '근비대 범위 — 적당한 휴식'
      : '고반복은 짧게 쉬어도 OK'

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

      {/* ±15초 조절 버튼 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => adjust(-15)}
          className="w-10 h-10 rounded-full bg-white/10 text-[var(--color-text-secondary)] text-sm font-bold active:scale-90 transition-transform"
        >
          -15
        </button>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {totalSeconds}초
        </span>
        <button
          onClick={() => adjust(15)}
          className="w-10 h-10 rounded-full bg-white/10 text-[var(--color-text-secondary)] text-sm font-bold active:scale-90 transition-transform"
        >
          +15
        </button>
      </div>

      <p className="text-[10px] text-[var(--color-text-tertiary)]">
        {guideMessage}
      </p>

      <button
        onClick={onFinish}
        className="text-[var(--color-hero-yellow)] text-sm font-medium"
      >
        건너뛰기 →
      </button>
    </div>
  )
}
