import { useState } from 'react'

interface RepCounterProps {
  targetReps: number
  isTimeBased: boolean
  onComplete: (actualReps: number) => void
}

export function RepCounter({ targetReps, isTimeBased, onComplete }: RepCounterProps) {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null)

  // 시간 기반 운동 (플랭크 등) — 타이머 모드
  if (isTimeBased) {
    const handleStart = () => {
      if (isRunning) return
      setIsRunning(true)
      setCount(0)
      const id = setInterval(() => {
        setCount((prev) => {
          const next = prev + 1
          if (next >= targetReps) {
            clearInterval(id)
            setIsRunning(false)
            onComplete(next)
            return next
          }
          return next
        })
      }, 1000)
      setTimerId(id)
    }

    const handleStop = () => {
      if (timerId) clearInterval(timerId)
      setIsRunning(false)
      if (count > 0) onComplete(count)
    }

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* 원형 진행 표시 */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="var(--color-hero-yellow)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(count / targetReps) * 283} 283`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center z-10">
            <p className="text-5xl font-black text-[var(--color-text-primary)]">{count}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">/ {targetReps}초</p>
          </div>
        </div>

        <button
          onClick={isRunning ? handleStop : handleStart}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all active:scale-[0.97] ${
            isRunning
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-[var(--color-hero-yellow)] text-black'
          }`}
        >
          {isRunning ? '중단' : count > 0 ? '다시 시작' : '시작'}
        </button>
      </div>
    )
  }

  // 횟수 기반 운동 — 탭 카운터
  const handleTap = () => {
    const next = count + 1
    setCount(next)
    if (next >= targetReps) {
      onComplete(next)
    }
  }

  const progress = Math.min(100, (count / targetReps) * 100)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 큰 원형 탭 버튼 */}
      <button
        onClick={handleTap}
        disabled={count >= targetReps}
        className="relative w-48 h-48 rounded-full flex items-center justify-center active:scale-95 transition-transform"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="var(--color-hero-yellow)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 283} 283`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-5xl font-black text-[var(--color-text-primary)]">{count}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">/ {targetReps}회</p>
        </div>
      </button>

      {count < targetReps && (
        <p className="text-[var(--color-text-secondary)] text-sm animate-pulse">
          탭하여 카운트
        </p>
      )}

      {/* 수동 완료 버튼 (도중에 끝낼 때) */}
      {count > 0 && count < targetReps && (
        <button
          onClick={() => onComplete(count)}
          className="text-[var(--color-text-secondary)] text-sm underline"
        >
          {count}회로 완료
        </button>
      )}
    </div>
  )
}
