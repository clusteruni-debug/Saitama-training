import { useState, useRef } from 'react'
import type { RPEFeedback as RPEType, Exercise } from '../../../types'
import { useTrainingStore } from '../../../stores/useTrainingStore'
import { RPEFeedback } from '../rpe-feedback'
import type { WorkoutPhase } from './workout-types'

interface RunWorkoutProps {
  exercise: Exercise
  info: { label: string; emoji: string; color: string }
  targetMinutes: number
  phase: WorkoutPhase
  setPhase: (p: WorkoutPhase) => void
  onRPE: (rpe: RPEType, formBroken?: boolean) => void
  onWarmupDone: () => void
  navigate: (path: string) => void
}

export function RunWorkout({ exercise, info, targetMinutes, phase, setPhase, onRPE, onWarmupDone, navigate }: RunWorkoutProps) {
  const [elapsed, setElapsed] = useState(0) // 초
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)
  const progress_currentReps = useTrainingStore((s) => s.trackProgress.run.currentReps)

  const targetSeconds = targetMinutes * 60
  const progress = Math.min(100, (elapsed / targetSeconds) * 100)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const handleStart = () => {
    if (isRunning) return
    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now()
    }
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= targetSeconds) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRunning(false)
          setPhase('rpe')
        }
        return next
      })
    }, 1000)
  }

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
    if (elapsed > 0) {
      setPhase('rpe')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current)
            navigate('/')
          }}
          className="text-[var(--color-text-secondary)] text-sm"
          aria-label="뒤로가기"
        >
          ← 홈
        </button>
        <span className="text-xs text-[var(--color-text-secondary)]">
          목표 {targetMinutes}분
        </span>
      </div>

      {/* 운동 정보 */}
      <div className="text-center mb-8">
        <span className="text-4xl mb-2 block">{info.emoji}</span>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">
          {exercise.name}
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          {exercise.description}
        </p>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {phase === 'warmup' && (
          <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[var(--color-hero-yellow)]/20 flex items-center justify-center">
              <span className="text-3xl">🔥</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">워밍업</h2>
            <p className="text-sm text-[var(--color-text-secondary)] text-center leading-relaxed">
              가벼운 스트레칭과 <span className="text-[var(--color-hero-yellow)] font-bold">5분 걷기</span>로 몸을 풀어요
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { onWarmupDone(); setPhase('exercise') }}
                className="flex-1 py-3 rounded-2xl bg-[var(--color-hero-yellow)] text-black font-bold text-sm active:scale-[0.97] transition-transform"
              >
                워밍업 완료
              </button>
              <button
                onClick={() => { onWarmupDone(); setPhase('exercise') }}
                className="px-6 py-3 rounded-2xl bg-white/10 text-[var(--color-text-secondary)] font-medium text-sm active:scale-[0.97] transition-transform"
              >
                건너뛰기
              </button>
            </div>
          </div>
        )}

        {phase === 'exercise' && (
          <div className="flex flex-col items-center gap-6">
            {/* 큰 원형 타이머 */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke={info.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 283} 283`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center z-10">
                <p className="text-5xl font-black text-[var(--color-text-primary)] tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  / {targetMinutes}:00
                </p>
              </div>
            </div>

            {/* 시작/중단 버튼 */}
            <button
              onClick={isRunning ? handleStop : handleStart}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all active:scale-[0.97] ${
                isRunning
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-[var(--color-hero-yellow)] text-black'
              }`}
            >
              {isRunning ? '운동 완료' : elapsed > 0 ? '이어서' : '출발!'}
            </button>
          </div>
        )}

        {phase === 'rpe' && (
          <div className="w-full">
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {minutes}분 {seconds > 0 ? `${seconds}초` : ''} 달렸어요!
              </p>
            </div>
            <RPEFeedback onSelect={onRPE} currentReps={progress_currentReps} />
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center animate-scale-in">
            <p className="text-6xl mb-4">🎉</p>
            <h2 className="text-2xl font-black text-[var(--color-hero-yellow)]">
              달리기 완료!
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2">
              {minutes}분 {seconds > 0 ? `${seconds}초` : ''} 수행
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
