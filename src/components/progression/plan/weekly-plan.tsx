import { useState } from 'react'

interface WeekPlan {
  week: number
  endReps: number
  milestone?: string
}

interface WeeklyPlanProps {
  weeklyPlan: WeekPlan[]
  targetReps: number
  info: { color: string }
  unit: string
}

export function WeeklyPlan({ weeklyPlan, targetReps, info, unit }: WeeklyPlanProps) {
  const [showAllWeeks, setShowAllWeeks] = useState(false)

  if (weeklyPlan.length === 0) return null

  const displayWeeks = showAllWeeks ? weeklyPlan : weeklyPlan.slice(0, 8)

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-4">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">
        주간 플랜 ({weeklyPlan.length}주)
      </h2>
      <div className="space-y-1">
        {displayWeeks.map((week) => (
          <div
            key={week.week}
            className="flex items-center gap-3 py-1.5"
          >
            <span className="text-xs text-[var(--color-text-secondary)] w-10 shrink-0">
              {week.week}주차
            </span>
            <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (week.endReps / targetReps) * 100)}%`,
                  backgroundColor: info.color,
                  opacity: 0.6,
                }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-primary)] w-14 text-right shrink-0">
              {week.endReps}{unit}
            </span>
            {week.milestone && (
              <span className="text-[10px] text-[var(--color-hero-yellow)]">★</span>
            )}
          </div>
        ))}
      </div>

      {weeklyPlan.length > 8 && (
        <button
          onClick={() => setShowAllWeeks(!showAllWeeks)}
          className="mt-3 w-full py-2 text-xs text-[var(--color-hero-yellow)] font-medium"
        >
          {showAllWeeks ? '접기' : `전체 ${weeklyPlan.length}주 보기`}
        </button>
      )}
    </div>
  )
}
