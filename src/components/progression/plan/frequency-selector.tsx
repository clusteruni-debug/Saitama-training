import type { TrackGoal } from '../../../types'

interface FrequencyCompare {
  daysPerWeek: number
  weeks: number
}

interface FrequencySelectorProps {
  trackGoal: TrackGoal
  freqComparison: FrequencyCompare[]
  onFreqChange: (daysPerWeek: number) => void
}

export function FrequencySelector({ trackGoal, freqComparison, onFreqChange }: FrequencySelectorProps) {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">훈련 빈도</h2>

      <div className="flex gap-2 mb-4">
        {[2, 3, 4, 5, 6].map((days) => (
          <button
            key={days}
            onClick={() => onFreqChange(days)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              trackGoal.daysPerWeek === days
                ? 'bg-[var(--color-hero-yellow)] text-black'
                : 'bg-white/10 text-[var(--color-text-secondary)]'
            }`}
          >
            {days}일
          </button>
        ))}
      </div>

      {/* 빈도별 비교 */}
      <div className="space-y-2">
        {freqComparison.map((comp) => (
          <div
            key={comp.daysPerWeek}
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              comp.daysPerWeek === trackGoal.daysPerWeek
                ? 'bg-[var(--color-hero-yellow)]/10 border border-[var(--color-hero-yellow)]/30'
                : 'bg-white/5'
            }`}
          >
            <span className="text-xs text-[var(--color-text-secondary)]">
              주 {comp.daysPerWeek}회
            </span>
            <span className={`text-sm font-bold ${
              comp.daysPerWeek === trackGoal.daysPerWeek
                ? 'text-[var(--color-hero-yellow)]'
                : 'text-[var(--color-text-primary)]'
            }`}>
              {comp.weeks > 0 ? `${comp.weeks}주` : '달성!'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
