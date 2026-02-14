import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { TrackType, RPEFeedback as RPEType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getExerciseForTrack, TRACK_INFO, isTimeBased, isRunTrack } from '../../data/progression-data'
import { SetCounter } from './set-counter'
import { RepCounter } from './rep-counter'
import { RestTimer } from './rest-timer'
import { RPEFeedback } from './rpe-feedback'
import { showToast } from '../ui/toast'

type Phase = 'warmup' | 'exercise' | 'rest' | 'rpe' | 'done'

export function WorkoutPage() {
  const { track } = useParams<{ track: string }>()
  const navigate = useNavigate()
  const trackType = track as TrackType

  const progress = useTrainingStore((s) => s.trackProgress[trackType])
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)
  const completeWorkout = useTrainingStore((s) => s.completeWorkout)

  const exercise = getExerciseForTrack(trackType, progress.currentLevel, hasPullUpBar)
  const info = TRACK_INFO[trackType]
  const timeBased = isTimeBased(exercise.id, hasPullUpBar)
  const runMode = isRunTrack(exercise.id)

  // 운동 시작 시간 기록 (시간 기반 목표 추적)
  const startTimeRef = useRef(Date.now())

  const [currentSet, setCurrentSet] = useState(0)
  const [phase, setPhase] = useState<Phase>('warmup')
  const [setResults, setSetResults] = useState<{ reps: number; completed: boolean }[]>([])

  const totalSets = progress.currentSets

  const getDuration = () => Math.round((Date.now() - startTimeRef.current) / 1000)

  const handleWarmupDone = useCallback(() => {
    startTimeRef.current = Date.now()
    setPhase('exercise')
  }, [])

  const handleRepComplete = useCallback((actualReps: number) => {
    const newResults = [...setResults, { reps: actualReps, completed: true }]
    setSetResults(newResults)

    if (newResults.length >= totalSets) {
      setPhase('rpe')
    } else {
      setPhase('rest')
    }
  }, [setResults, totalSets])

  const handleRestFinish = useCallback(() => {
    setCurrentSet((prev) => prev + 1)
    setPhase('exercise')
  }, [])

  const handleRPE = useCallback((rpe: RPEType, formBroken?: boolean) => {
    const duration = getDuration()
    completeWorkout(trackType, setResults, rpe, duration, formBroken)
    setPhase('done')
    showToast(`${info.label} 운동 완료!`, 'success')
    setTimeout(() => navigate('/'), 1200)
  }, [trackType, setResults, completeWorkout, info.label, navigate])

  // 달리기 전용 완료
  const handleRunRPE = useCallback((rpe: RPEType, formBroken?: boolean) => {
    const duration = getDuration()
    const actualMinutes = Math.round(duration / 60)
    completeWorkout(trackType, [{ reps: actualMinutes, completed: true }], rpe, duration, formBroken)
    setPhase('done')
    showToast(`${info.label} 완료! ${actualMinutes}분`, 'success')
    setTimeout(() => navigate('/'), 1200)
  }, [trackType, completeWorkout, info.label, navigate])

  if (!progress) {
    navigate('/')
    return null
  }

  // 달리기 모드 — 별도 UI
  if (runMode) {
    return (
      <RunWorkout
        exercise={exercise}
        info={info}
        targetMinutes={progress.currentReps}
        phase={phase}
        setPhase={setPhase}
        onRPE={handleRunRPE}
        onWarmupDone={handleWarmupDone}
        navigate={navigate}
      />
    )
  }

  // 진행률 계산
  const completedSets = setResults.length
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  // 워밍업 렙수 (50%)
  const warmupReps = Math.max(1, Math.round(progress.currentReps * 0.5))

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* 전체 진행률 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[var(--color-text-secondary)]">
            {completedSets}/{totalSets} 세트
          </span>
          <span className="text-[10px] font-bold text-[var(--color-hero-yellow)]">
            {progressPct}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${phase === 'exercise' ? 'progress-stripe' : ''}`}
            style={{
              width: `${progressPct}%`,
              backgroundColor: 'var(--color-hero-yellow)',
            }}
          />
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-[var(--color-text-secondary)] text-sm"
          aria-label="뒤로가기"
        >
          ← 홈
        </button>
        <SetCounter currentSet={currentSet} totalSets={totalSets} />
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
              가벼운 <span className="text-[var(--color-hero-yellow)] font-bold">{warmupReps}{timeBased ? '초' : '회'}</span>로 몸을 풀어요
            </p>
            <p className="text-[10px] text-[var(--color-text-tertiary)]">
              부상 방지 + 퍼포먼스 향상
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleWarmupDone}
                className="flex-1 py-3 rounded-2xl bg-[var(--color-hero-yellow)] text-black font-bold text-sm active:scale-[0.97] transition-transform"
              >
                워밍업 완료
              </button>
              <button
                onClick={handleWarmupDone}
                className="px-6 py-3 rounded-2xl bg-white/10 text-[var(--color-text-secondary)] font-medium text-sm active:scale-[0.97] transition-transform"
              >
                건너뛰기
              </button>
            </div>
          </div>
        )}

        {phase === 'exercise' && (
          <RepCounter
            key={`set-${currentSet}`}
            targetReps={progress.currentReps}
            isTimeBased={timeBased}
            onComplete={handleRepComplete}
          />
        )}

        {phase === 'rest' && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* 전체 세트 결과 리스트 */}
            {setResults.length > 0 && (
              <div className="w-full bg-[var(--color-bg-card)] rounded-xl p-3 mb-2">
                {setResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-green-400 text-xs">✓</span>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {i + 1}세트: {timeBased ? `${r.reps}초` : `${r.reps}회`}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 py-1">
                  <span className="text-[var(--color-hero-yellow)] text-xs">→</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {setResults.length + 1}세트 대기 중
                  </span>
                </div>
              </div>
            )}
            <RestTimer onFinish={handleRestFinish} targetReps={progress.currentReps} track={trackType} />
          </div>
        )}

        {phase === 'rpe' && (
          <RPEFeedback onSelect={handleRPE} currentReps={progress.currentReps} />
        )}

        {phase === 'done' && (
          <div className="text-center animate-scale-in">
            <p className="text-6xl mb-4">🎉</p>
            <h2 className="text-2xl font-black text-[var(--color-hero-yellow)]">
              운동 완료!
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2">
              {totalSets}세트 · 총 {setResults.reduce((s, r) => s + r.reps, 0)}회 수행
            </p>
            {/* 세트별 결과 */}
            <div className="flex justify-center gap-2 mt-4">
              {setResults.map((r, i) => (
                <div key={i} className="bg-[var(--color-bg-card)] rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-[var(--color-text-secondary)]">{i + 1}세트</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {timeBased ? `${r.reps}초` : `${r.reps}회`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {phase === 'exercise' && currentSet < totalSets && (
        <div className="text-center pb-8">
          <button
            onClick={() => handleRepComplete(0)}
            className="text-[var(--color-text-secondary)] text-xs underline"
          >
            이 세트 건너뛰기
          </button>
        </div>
      )}
    </div>
  )
}

// ─── 달리기 전용 운동 화면 ────────────────────────────────

import type { Exercise } from '../../types'

interface RunWorkoutProps {
  exercise: Exercise
  info: { label: string; emoji: string; color: string }
  targetMinutes: number
  phase: Phase
  setPhase: (p: Phase) => void
  onRPE: (rpe: RPEType, formBroken?: boolean) => void
  onWarmupDone: () => void
  navigate: (path: string) => void
}

function RunWorkout({ exercise, info, targetMinutes, phase, setPhase, onRPE, onWarmupDone, navigate }: RunWorkoutProps) {
  const [elapsed, setElapsed] = useState(0) // 초
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progress_currentReps = useTrainingStore((s) => s.trackProgress.run.currentReps)

  const targetSeconds = targetMinutes * 60
  const progress = Math.min(100, (elapsed / targetSeconds) * 100)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const handleStart = () => {
    if (isRunning) return
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
  }

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
    if (elapsed > 0) {
      setPhase('rpe')
    }
  }

  // 목표 시간 도달 시 자동 완료
  useEffect(() => {
    if (elapsed >= targetSeconds && isRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsRunning(false)
      setPhase('rpe')
    }
  }, [elapsed, targetSeconds, isRunning])

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
