import type { TrackType, TrackProgress } from '../../types'
import { STRENGTH_TRACKS, SAITAMA_GOALS } from '../../data/progression-data'

// ─── 사이타마 진행률 ─────────────────────────────────────

export function getSaitamaProgress(
  trackProgress: Record<TrackType, TrackProgress>,
  activeTracks: TrackType[]
): number {
  const tracks = activeTracks.length > 0 ? activeTracks : [...STRENGTH_TRACKS, 'run' as TrackType]
  const total = tracks.reduce((sum, t) => {
    const target = SAITAMA_GOALS[t]
    const current = trackProgress[t]?.currentReps || 0
    return sum + Math.min(1, current / target)
  }, 0)
  return Math.round((total / tracks.length) * 100)
}
