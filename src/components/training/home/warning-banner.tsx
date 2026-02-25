import type { CoachTip } from '../../../lib/coach/types'

interface WarningBannerProps {
  coachTips: CoachTip[]
}

export function WarningBanner({ coachTips }: WarningBannerProps) {
  const warningTips = coachTips.filter(
    (t) => t.type === 'overtraining-warning' || t.type === 'deload-suggest'
  )
  if (warningTips.length === 0) return null

  const tip = warningTips[0]
  return (
    <section className="mb-4">
      <div
        className={`rounded-xl px-4 py-3 border ${
          tip.type === 'overtraining-warning'
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}
      >
        <p className={`text-sm font-medium ${
          tip.type === 'overtraining-warning' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {tip.message}
        </p>
      </div>
    </section>
  )
}
