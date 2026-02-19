import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO, SAITAMA_GOALS, getExerciseForTrack, isRunTrack } from '../../data/progression-data'
import { ProgressBar } from '../ui/progress-bar'

const TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core', 'run']

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
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)
  const info = TRACK_INFO[track]
  const exercise = getExerciseForTrack(track, progress.currentLevel, hasPullUpBar)
  const runTrack = isRunTrack(exercise.id)
  const unit = runTrack ? '분' : '개'
  const saitamaTarget = SAITAMA_GOALS[track]
  const saitamaPct = Math.min(100, Math.round((progress.currentReps / saitamaTarget) * 100))

  const bestTime = progress.bestSeconds
    ? `${Math.floor(progress.bestSeconds / 60)}분 ${progress.bestSeconds % 60}초`
    : null

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span>{info.emoji}</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {exercise.name}
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {progress.currentReps}/{saitamaTarget}{unit}
        </span>
      </div>
      {bestTime && (
        <p className="text-[10px] text-[var(--color-text-secondary)] mb-1 ml-7">
          최고 기록: {bestTime}
        </p>
      )}
      <ProgressBar value={saitamaPct} color={info.color} />
    </div>
  )
}
