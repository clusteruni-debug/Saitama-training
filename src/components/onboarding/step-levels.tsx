import type { TrackType } from '../../types'
import type { Exercise } from '../../types'
import { TRACK_INFO } from '../../data/progression-data'
import { Button } from '../ui/button'

const STRENGTH_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

interface StepLevelsProps {
  levels: Record<TrackType, number>
  handleLevel: (track: TrackType, delta: number) => void
  tree: Record<TrackType, Exercise[]>
  onStart: () => void
  onBack: () => void
}

export function StepLevels({ levels, handleLevel, tree, onStart, onBack }: StepLevelsProps) {
  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl block mb-4">💪</span>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          시작 레벨
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          현재 수준에 맞게 설정하세요
        </p>
      </div>

      <section className="mb-8 flex-1">
        <div className="flex flex-col gap-3">
          {STRENGTH_TRACKS.map((track) => {
            const info = TRACK_INFO[track]
            const exercise = tree[track][levels[track]]
            const isTimeEx = track === 'core' && levels[track] === 0
            return (
              <div key={track} className="bg-[var(--color-bg-card)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {info.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLevel(track, -1)}
                      disabled={levels[track] <= 0}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[var(--color-hero-yellow)] w-8 text-center">
                      Lv.{levels[track]}
                    </span>
                    <button
                      onClick={() => handleLevel(track, 1)}
                      disabled={levels[track] >= 5}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {exercise.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {exercise.sets} × {exercise.reps}{isTimeEx ? '초' : '회'}
                  </p>
                </div>
              </div>
            )
          })}

          {/* 달리기 트랙 */}
          {(() => {
            const runInfo = TRACK_INFO['run']
            const runExercise = tree['run'][levels['run']]
            return (
              <div className="bg-[var(--color-bg-card)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{runInfo.emoji}</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {runInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLevel('run', -1)}
                      disabled={levels['run'] <= 0}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[var(--color-hero-yellow)] w-8 text-center">
                      Lv.{levels['run']}
                    </span>
                    <button
                      onClick={() => handleLevel('run', 1)}
                      disabled={levels['run'] >= 5}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {runExercise.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {runExercise.reps}분
                  </p>
                </div>
              </div>
            )
          })()}
        </div>

        <p className="text-[var(--color-text-secondary)] text-xs text-center mt-4">
          잘 모르겠으면 Lv.0으로 시작 — 운동 후 자동으로 올라갑니다
        </p>
      </section>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] bg-white/5"
        >
          이전
        </button>
        <Button onClick={onStart} size="lg" className="flex-1">
          트레이닝 시작!
        </Button>
      </div>
    </div>
  )
}
