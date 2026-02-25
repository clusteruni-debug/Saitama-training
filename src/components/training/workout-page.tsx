import { useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { TrackType, RPEFeedback as RPEType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getExerciseForTrack, TRACK_INFO, isTimeBased, isRunTrack } from '../../data/progression-data'
import { SetCounter } from './set-counter'
import { RepCounter } from './rep-counter'
import { RestTimer } from './rest-timer'
import { RPEFeedback } from './rpe-feedback'
import { showToast } from '../ui/toast'
import type { WorkoutPhase } from './workout/workout-types'
import { RunWorkout } from './workout/run-workout'
import { WarmupPhase } from './workout/warmup-phase'
import { RestResults } from './workout/rest-results'
import { DonePhase } from './workout/done-phase'
import { WorkoutProgressBar } from './workout/progress-bar'

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
  const startTimeRef = useRef(0)

  const [currentSet, setCurrentSet] = useState(0)
  const [phase, setPhase] = useState<WorkoutPhase>('warmup')
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

  // 달리기 모드 -- 별도 UI
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

  // 워밍업 렙수 (50%)
  const warmupReps = Math.max(1, Math.round(progress.currentReps * 0.5))

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* 전체 진행률 바 */}
      <WorkoutProgressBar completedSets={setResults.length} totalSets={totalSets} phase={phase} />

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
          <WarmupPhase warmupReps={warmupReps} timeBased={timeBased} onWarmupDone={handleWarmupDone} />
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
            <RestResults setResults={setResults} timeBased={timeBased} />
            <RestTimer onFinish={handleRestFinish} targetReps={progress.currentReps} track={trackType} />
          </div>
        )}

        {phase === 'rpe' && (
          <RPEFeedback onSelect={handleRPE} currentReps={progress.currentReps} />
        )}

        {phase === 'done' && (
          <DonePhase totalSets={totalSets} setResults={setResults} timeBased={timeBased} />
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
