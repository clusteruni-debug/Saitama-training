import type { WorkoutSession } from '../../types'

export function getRecentSessions(sessions: Record<string, WorkoutSession[]>, days: number): WorkoutSession[] {
  const result: WorkoutSession[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (sessions[key]) result.push(...sessions[key])
  }
  return result
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}초`
  if (s === 0) return `${m}분`
  return `${m}분 ${s}초`
}
