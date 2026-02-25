import type { WorkoutPhase } from './workout-types'

interface WorkoutProgressBarProps {
  completedSets: number
  totalSets: number
  phase: WorkoutPhase
}

export function WorkoutProgressBar({ completedSets, totalSets, phase }: WorkoutProgressBarProps) {
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          {completedSets}/{totalSets} 세트
        </span>
        <span className="text-[10px] font-bold text-[var(--color-hero-yellow)]">
          {progressPct}%
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${phase === 'exercise' ? 'progress-stripe' : ''}`}
          style={{
            width: `${progressPct}%`,
            backgroundColor: 'var(--color-hero-yellow)',
          }}
        />
      </div>
    </div>
  )
}
