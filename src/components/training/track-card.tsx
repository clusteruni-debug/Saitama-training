import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getExerciseForTrack, TRACK_INFO, isTimeBased, isRunTrack } from '../../data/progression-data'

interface TrackCardProps {
  track: TrackType
}

// 트랙별 마지막 운동 시간 기반 회복 상태 계산
function getRecoveryStatus(sessions: Record<string, { track: string; createdAt: string }[]>, track: TrackType): {
  label: string
  color: string
} | null {
  // 모든 세션에서 이 트랙의 가장 최근 운동 찾기
  let lastTime: number | null = null
  for (const daySessions of Object.values(sessions)) {
    for (const s of daySessions) {
      if (s.track === track) {
        const t = new Date(s.createdAt).getTime()
        if (lastTime === null || t > lastTime) lastTime = t
      }
    }
  }
  if (lastTime === null) return null

  const hoursAgo = (Date.now() - lastTime) / (1000 * 60 * 60)
  if (hoursAgo < 24) return { label: '회복 중', color: '#f97316' }     // 주황
  if (hoursAgo < 48) return { label: '거의 회복', color: '#eab308' }   // 노랑
  return { label: '완전 회복', color: '#22c55e' }                      // 초록
}

export function TrackCard({ track }: TrackCardProps) {
  const navigate = useNavigate()
  const progress = useTrainingStore((s) => s.trackProgress[track])
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)
  const isCompleted = useTrainingStore((s) => s.isTrackCompletedToday(track))
  const sessions = useTrainingStore((s) => s.sessions)
  const exercise = getExerciseForTrack(track, progress.currentLevel, hasPullUpBar)
  const info = TRACK_INFO[track]
  const timeBased = isTimeBased(exercise.id, hasPullUpBar)
  const runTrack = isRunTrack(exercise.id)
  const unit = runTrack ? '분' : timeBased ? '초' : '회'

  const recovery = useMemo(() => getRecoveryStatus(sessions, track), [sessions, track])

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
            <div className="flex items-center gap-2">
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                {info.label} · Lv.{progress.currentLevel}
              </p>
              {recovery && !isCompleted && (
                <span
                  className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ color: recovery.color, backgroundColor: `${recovery.color}20` }}
                >
                  {recovery.label}
                </span>
              )}
            </div>
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
