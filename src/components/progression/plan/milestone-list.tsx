interface Milestone {
  label: string
  reps: number
  week: number
}

interface MilestoneListProps {
  milestones: Milestone[]
  currentReps: number
  unit: string
}

export function MilestoneList({ milestones, currentReps, unit }: MilestoneListProps) {
  if (milestones.length === 0) return null

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">마일스톤</h2>
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />

        {milestones.map((ms, idx) => {
          const reached = currentReps >= ms.reps
          return (
            <div key={idx} className="relative flex items-start gap-3 mb-4 last:mb-0">
              <div
                className={`absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center z-10 ${
                  reached
                    ? 'bg-[var(--color-hero-yellow)] border-[var(--color-hero-yellow)]'
                    : 'bg-[var(--color-bg-dark)] border-white/20'
                }`}
              >
                {reached && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className={reached ? 'opacity-60' : ''}>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {ms.label}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {ms.reps}{unit} — {ms.week}주차
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
