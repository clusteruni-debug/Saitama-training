import { useState } from 'react'
import type { TrackType, TrackGoal, TrackProgress } from '../../../types'
import { SAITAMA_GOALS } from '../../../data/progression-data'

interface GoalCardProps {
  track: TrackType
  trackProgress: TrackProgress
  trackGoal: TrackGoal
  info: { color: string }
  unit: string
  setTrackGoal: (track: TrackType, goal: Partial<TrackGoal>) => void
}

export function GoalCard({ track, trackProgress, trackGoal, info, unit, setTrackGoal }: GoalCardProps) {
  const [editingTarget, setEditingTarget] = useState(false)
  const [tempTarget, setTempTarget] = useState(String(trackGoal.targetReps))

  const pct = trackGoal.targetReps > 0
    ? Math.min(100, Math.round((trackProgress.currentReps / trackGoal.targetReps) * 100))
    : 0

  const handleSaveTarget = () => {
    const val = parseInt(tempTarget)
    if (val > 0 && val <= 500) {
      setTrackGoal(track, { targetReps: val })
    }
    setEditingTarget(false)
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)]">목표</h2>
        <button
          onClick={() => { setEditingTarget(true); setTempTarget(String(trackGoal.targetReps)) }}
          className="text-xs text-[var(--color-hero-yellow)] font-medium"
        >
          변경
        </button>
      </div>

      {editingTarget ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tempTarget}
            onChange={(e) => setTempTarget(e.target.value)}
            className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-[var(--color-text-primary)] text-sm outline-none"
            min={1}
            max={500}
            autoFocus
          />
          <span className="text-xs text-[var(--color-text-secondary)]">{unit}</span>
          <button
            onClick={handleSaveTarget}
            className="px-3 py-2 bg-[var(--color-hero-yellow)] text-black rounded-lg text-xs font-bold"
          >
            저장
          </button>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[var(--color-hero-yellow)]">
            {Math.round(trackProgress.currentReps)}
          </span>
          <span className="text-lg text-[var(--color-text-secondary)]">/</span>
          <span className="text-3xl font-black text-[var(--color-text-primary)]">
            {trackGoal.targetReps}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)]">{unit}</span>
        </div>
      )}

      {/* 진행률 바 */}
      <div className="mt-3">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: info.color }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--color-text-secondary)]">현재 {pct}%</span>
          <span className="text-[10px] text-[var(--color-text-secondary)]">
            {pct >= 100 ? '달성!' : `${trackGoal.targetReps - Math.round(trackProgress.currentReps)}${unit} 남음`}
          </span>
        </div>
      </div>

      {/* 사이타마 프리셋 버튼 */}
      {trackGoal.targetReps !== SAITAMA_GOALS[track] && (
        <button
          onClick={() => setTrackGoal(track, { targetReps: SAITAMA_GOALS[track] })}
          className="mt-3 w-full py-2 rounded-lg border border-[var(--color-hero-yellow)]/30 text-xs text-[var(--color-hero-yellow)]"
        >
          사이타마 목표로 설정 ({SAITAMA_GOALS[track]}{unit})
        </button>
      )}
    </div>
  )
}
