import { useNavigate } from 'react-router-dom'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getExerciseForTrack, TRACK_INFO, isTimeBased, isRunTrack } from '../../data/progression-data'

interface TrackCardProps {
  track: TrackType
}

export function TrackCard({ track }: TrackCardProps) {
  const navigate = useNavigate()
  const progress = useTrainingStore((s) => s.trackProgress[track])
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)
  const isCompleted = useTrainingStore((s) => s.isTrackCompletedToday(track))
  const exercise = getExerciseForTrack(track, progress.currentLevel, hasPullUpBar)
  const info = TRACK_INFO[track]
  const timeBased = isTimeBased(exercise.id, hasPullUpBar)
  const runTrack = isRunTrack(exercise.id)
  const unit = runTrack ? '분' : timeBased ? '초' : '회'

  const handleClick = isCompleted ? undefined : () => navigate(`/workout/${track}`)

  return (
    <div
      onClick={handleClick}
      role={handleClick ? 'button' : undefined}
      tabIndex={handleClick ? 0 : undefined}
      onKeyDown={handleClick ? (e) => { if (e.key === 'Enter') handleClick() } : undefined}
      className={`bg-[var(--color-bg-card)] rounded-2xl p-4 border-l-4 ${
        isCompleted ? 'opacity-60' : 'cursor-pointer active:scale-[0.98] transition-transform'
      }`}
      style={{ borderLeftColor: info.color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.emoji}</span>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
              {info.label} · Lv.{progress.currentLevel}
            </p>
            <p className="text-[var(--color-text-primary)] font-semibold">
              {exercise.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          {isCompleted ? (
            <span className="text-green-400 text-sm font-medium">완료 ✓</span>
          ) : runTrack ? (
            <p className="text-[var(--color-text-secondary)] text-sm">
              {progress.currentReps}{unit}
            </p>
          ) : (
            <p className="text-[var(--color-text-secondary)] text-sm">
              {progress.currentSets} × {progress.currentReps}{unit}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
