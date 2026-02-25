import type { TrackType, TrackProgress } from '../../../types'
import { TRACK_INFO, SAITAMA_GOALS } from '../../../data/progression-data'

interface SaitamaProgressProps {
  saitamaPct: number
  activeTracks: TrackType[]
  trackProgress: Record<TrackType, TrackProgress>
}

export function SaitamaProgress({ saitamaPct, activeTracks, trackProgress }: SaitamaProgressProps) {
  return (
    <div className="mt-4 bg-[var(--color-bg-card)] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">사이타마 루틴</span>
        <span className="text-xs font-bold text-[var(--color-hero-yellow)]">{saitamaPct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-hero-yellow)] rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, saitamaPct)}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {activeTracks.slice(0, 5).map((t) => {
          const info = TRACK_INFO[t]
          const pct = Math.min(100, Math.round((trackProgress[t].currentReps / SAITAMA_GOALS[t]) * 100))
          return (
            <div key={t} className="flex flex-col items-center">
              <span className="text-xs">{info.emoji}</span>
              <span className="text-[9px] text-[var(--color-text-secondary)]">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
