import { useMemo } from 'react'
import type { WorkoutSession } from '../../types'

interface WeeklyChartProps {
  sessions: Record<string, WorkoutSession[]>
}

function getLastNDays(n: number): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return days
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function WeeklyChart({ sessions }: WeeklyChartProps) {
  const days = useMemo(() => getLastNDays(7), [])

  const dayVolumes = useMemo(() =>
    days.map((d) => {
      const daySessions = sessions[d] || []
      return daySessions.reduce((sum, s) => sum + s.totalVolume, 0)
    }),
    [days, sessions]
  )

  const maxVolume = Math.max(...dayVolumes, 1)

  return (
    <div>
      <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
        주간 볼륨
      </h3>
      <div className="flex items-end gap-2 h-32">
        {days.map((day, i) => {
          const vol = dayVolumes[i]
          const height = (vol / maxVolume) * 100
          const dayOfWeek = new Date(day).getDay()

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              {/* 볼륨 숫자 */}
              {vol > 0 && (
                <span className="text-[9px] text-[var(--color-text-secondary)]">
                  {vol}
                </span>
              )}
              {/* 바 */}
              <div className="w-full flex items-end h-24">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(vol > 0 ? 8 : 2, height)}%`,
                    backgroundColor: vol > 0 ? 'var(--color-hero-yellow)' : 'rgba(255,255,255,0.1)',
                  }}
                />
              </div>
              {/* 요일 */}
              <span className="text-[10px] text-[var(--color-text-secondary)]">
                {DAY_LABELS[dayOfWeek]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
