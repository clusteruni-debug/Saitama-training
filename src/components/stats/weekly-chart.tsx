import { useMemo } from 'react'
import type { WorkoutSession } from '../../types'

interface WeeklyChartProps {
  sessions: Record<string, WorkoutSession[]>
  mode?: 'weekly' | 'monthly'
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

// Y축 눈금 계산 (적절한 간격)
function getYTicks(max: number): number[] {
  if (max <= 0) return [0]
  const step = max <= 50 ? 10 : max <= 100 ? 25 : max <= 200 ? 50 : 100
  const ticks: number[] = [0]
  let v = step
  while (v <= max) {
    ticks.push(v)
    v += step
  }
  if (ticks[ticks.length - 1] < max) ticks.push(Math.ceil(max / step) * step)
  return ticks
}

export function WeeklyChart({ sessions, mode = 'weekly' }: WeeklyChartProps) {
  const dayCount = mode === 'monthly' ? 30 : 7
  const days = useMemo(() => getLastNDays(dayCount), [dayCount])

  const dayVolumes = useMemo(() =>
    days.map((d) => {
      const daySessions = sessions[d] || []
      return daySessions.reduce((sum, s) => sum + s.totalVolume, 0)
    }),
    [days, sessions]
  )

  const maxVolume = Math.max(...dayVolumes, 1)
  const totalWeekVolume = dayVolumes.reduce((a, b) => a + b, 0)
  const activeDayCount = dayVolumes.filter((v) => v > 0).length
  const avgVolume = activeDayCount > 0 ? Math.round(totalWeekVolume / activeDayCount) : 0
  const yTicks = getYTicks(maxVolume)
  const yMax = yTicks[yTicks.length - 1] || 1

  // 월간 모드: 날짜 라벨 간소화 (5일 간격)
  const showLabel = (i: number) => {
    if (mode === 'weekly') return true
    return i % 5 === 0 || i === dayCount - 1
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium">
          {mode === 'monthly' ? '월간 볼륨' : '주간 볼륨'}
        </h3>
        <div className="flex gap-3">
          <span className="text-xs text-[var(--color-text-secondary)]">
            합계 <span className="text-[var(--color-hero-yellow)] font-bold">{totalWeekVolume.toLocaleString()}</span>
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            평균 <span className="text-[var(--color-text-primary)] font-bold">{avgVolume}</span>
          </span>
        </div>
      </div>

      {/* 차트 */}
      <div className="flex">
        {/* Y축 눈금 */}
        <div className="flex flex-col justify-between h-28 mr-2 py-0">
          {[...yTicks].reverse().map((tick) => (
            <span key={tick} className="text-[8px] text-[var(--color-text-secondary)] leading-none text-right w-6">
              {tick}
            </span>
          ))}
        </div>

        {/* 바 영역 */}
        <div className="flex-1 flex items-end gap-[2px] h-28 relative">
          {/* 평균 라인 */}
          {avgVolume > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-dashed border-white/20 pointer-events-none"
              style={{ bottom: `${(avgVolume / yMax) * 100}%` }}
            />
          )}

          {days.map((day, i) => {
            const vol = dayVolumes[i]
            const height = (vol / yMax) * 100
            const dayOfWeek = new Date(day).getDay()
            const dateNum = new Date(day).getDate()

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                {/* 볼륨 숫자 (주간 모드만) */}
                {mode === 'weekly' && vol > 0 && (
                  <span className="text-[8px] text-[var(--color-text-secondary)] truncate">
                    {vol}
                  </span>
                )}
                {/* 바 */}
                <div className="w-full flex items-end" style={{ height: mode === 'weekly' ? '5.5rem' : '6rem' }}>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${Math.max(vol > 0 ? 8 : 2, height)}%`,
                      backgroundColor: vol > 0 ? 'var(--color-hero-yellow)' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                </div>
                {/* 라벨 */}
                {showLabel(i) && (
                  <span className="text-[9px] text-[var(--color-text-secondary)] truncate">
                    {mode === 'monthly' ? `${dateNum}` : DAY_LABELS[dayOfWeek]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
