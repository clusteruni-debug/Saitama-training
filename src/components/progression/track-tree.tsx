import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getTree, TRACK_INFO, isTimeBased, isRunTrack } from '../../data/progression-data'

interface TrackTreeProps {
  track: TrackType
}

export function TrackTree({ track }: TrackTreeProps) {
  const progress = useTrainingStore((s) => s.trackProgress[track])
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)
  const tree = getTree(hasPullUpBar)
  const exercises = tree[track]
  const info = TRACK_INFO[track]

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{info.emoji}</span>
        <h3 className="text-[var(--color-text-primary)] font-bold">{info.label}</h3>
        <span className="text-xs text-[var(--color-text-secondary)] ml-auto">
          Lv.{progress.currentLevel}
        </span>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />

        {exercises.map((ex, idx) => {
          const isCurrent = idx === progress.currentLevel
          const isCompleted = idx < progress.currentLevel
          const isLocked = idx > progress.currentLevel
          const timeBased = isTimeBased(ex.id, hasPullUpBar)
          const runTrack = isRunTrack(ex.id)
          const unit = runTrack ? '분' : timeBased ? '초' : '회'
          const repsDisplay = isCurrent ? progress.currentReps : ex.reps

          return (
            <div key={ex.id} className="relative flex items-start gap-3 mb-4 last:mb-0">
              <div
                className={`absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center z-10 ${
                  isCompleted
                    ? 'bg-[var(--color-hero-yellow)] border-[var(--color-hero-yellow)]'
                    : isCurrent
                      ? 'bg-[var(--color-bg-dark)] border-[var(--color-hero-yellow)] animate-pulse'
                      : 'bg-[var(--color-bg-dark)] border-white/20'
                }`}
              >
                {isCompleted && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-hero-yellow)]" />
                )}
              </div>

              <div className={`flex-1 ${isLocked ? 'opacity-40' : ''}`}>
                <div className="flex items-baseline justify-between">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-[var(--color-hero-yellow)]' : 'text-[var(--color-text-primary)]'
                  }`}>
                    {ex.name}
                  </p>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {runTrack ? `${repsDisplay}${unit}` : `${ex.sets} × ${repsDisplay}${unit}`}
                  </span>
                </div>
                {isCurrent && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {ex.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
