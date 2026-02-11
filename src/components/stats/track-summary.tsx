import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO, getExerciseForTrack, isTimeBased } from '../../data/progression-data'
import { ProgressBar } from '../ui/progress-bar'

const TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

export function TrackSummary() {
  return (
    <div>
      <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
        트랙별 진행
      </h3>
      <div className="flex flex-col gap-3">
        {TRACKS.map((track) => (
          <TrackRow key={track} track={track} />
        ))}
      </div>
    </div>
  )
}

function TrackRow({ track }: { track: TrackType }) {
  const progress = useTrainingStore((s) => s.trackProgress[track])
  const info = TRACK_INFO[track]
  const exercise = getExerciseForTrack(track, progress.currentLevel)
  const timeBased = isTimeBased(exercise.id)

  // 레벨 진행률 (0-5 → 0-100%)
  const levelPercent = (progress.currentLevel / 5) * 100

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{info.emoji}</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {exercise.name}
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">
          Lv.{progress.currentLevel} · {progress.currentReps}{timeBased ? '초' : '회'}
        </span>
      </div>
      <ProgressBar value={levelPercent} color={info.color} />
    </div>
  )
}
