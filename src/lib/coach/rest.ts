import type { TrackType } from '../../types'

// ─── 스마트 휴식 시간 (NSCA 가이드라인) ───────────────────
// 근력(1-5 reps): 120-180초, 근비대(6-12): 60-90초, 근지구력(13+): 30-60초

export function suggestRestSeconds(reps: number, track: TrackType): number {
  void track
  if (reps <= 5) return 120
  if (reps <= 12) return 75
  if (reps <= 20) return 60
  return 45
}
