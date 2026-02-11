import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { TrackType, RPEFeedback as RPEType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getExerciseForTrack, TRACK_INFO, isTimeBased } from '../../data/progression-data'
import { SetCounter } from './set-counter'
import { RepCounter } from './rep-counter'
import { RestTimer } from './rest-timer'
import { RPEFeedback } from './rpe-feedback'
import { showToast } from '../ui/toast'

type Phase = 'exercise' | 'rest' | 'rpe' | 'done'

export function WorkoutPage() {
  const { track } = useParams<{ track: string }>()
  const navigate = useNavigate()
  const trackType = track as TrackType

  const progress = useTrainingStore((s) => s.trackProgress[trackType])
  const completeWorkout = useTrainingStore((s) => s.completeWorkout)

  const exercise = getExerciseForTrack(trackType, progress.currentLevel)
  const info = TRACK_INFO[trackType]
  const timeBased = isTimeBased(exercise.id)

  const [currentSet, setCurrentSet] = useState(0)
  const [phase, setPhase] = useState<Phase>('exercise')
  const [setResults, setSetResults] = useState<{ reps: number; completed: boolean }[]>([])

  const totalSets = progress.currentSets

  const handleRepComplete = useCallback((actualReps: number) => {
    const newResults = [...setResults, { reps: actualReps, completed: true }]
    setSetResults(newResults)

    // 마지막 세트면 RPE로
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

  const handleRPE = useCallback((rpe: RPEType) => {
    completeWorkout(trackType, setResults, rpe)
    setPhase('done')
    showToast(`${info.label} 운동 완료!`, 'success')

    // 1초 후 홈으로
    setTimeout(() => navigate('/'), 1200)
  }, [trackType, setResults, completeWorkout, info.label, navigate])

  // 유효하지 않은 트랙
  if (!progress) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 max-w-lg mx-auto">
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
        {phase === 'exercise' && (
          <RepCounter
            key={`set-${currentSet}`}
            targetReps={progress.currentReps}
            isTimeBased={timeBased}
            onComplete={handleRepComplete}
          />
        )}

        {phase === 'rest' && (
          <RestTimer onFinish={handleRestFinish} />
        )}

        {phase === 'rpe' && (
          <RPEFeedback onSelect={handleRPE} />
        )}

        {phase === 'done' && (
          <div className="text-center animate-scale-in">
            <p className="text-6xl mb-4">🎉</p>
            <h2 className="text-2xl font-black text-[var(--color-hero-yellow)]">
              운동 완료!
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2">
              총 {setResults.reduce((s, r) => s + r.reps, 0)}회 수행
            </p>
          </div>
        )}
      </div>

      {/* 세트 스킵 (운동 중일 때만) */}
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
