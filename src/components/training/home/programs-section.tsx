import type { ProgramGoal } from '../../../types'
import { TRACK_INFO } from '../../../data/progression-data'

interface ProgramsSectionProps {
  programs: ProgramGoal[]
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  const activePrograms = programs.filter((p) => !p.achieved)
  if (activePrograms.length === 0) return null

  return (
    <section className="mt-6">
      <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium mb-3">
        내 프로그램
      </h2>
      <div className="flex flex-col gap-2">
        {activePrograms.slice(0, 3).map((goal) => {
          const info = TRACK_INFO[goal.track]
          const pct = goal.axis === 'speed'
            ? Math.max(0, Math.round((1 - Math.max(0, goal.current - goal.target) / (goal.current || 1)) * 100))
            : Math.round((goal.current / goal.target) * 100)
          return (
            <div key={goal.id} className="bg-[var(--color-bg-card)] rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {info.emoji} {goal.title}
                </span>
                <span className="text-xs text-[var(--color-hero-yellow)] font-bold">
                  {Math.min(100, pct)}%
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">{goal.description}</p>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    backgroundColor: info.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
