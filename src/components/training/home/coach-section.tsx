import type { TrackType } from '../../../types'
import type { CoachTip } from '../../../lib/coach/types'

interface CoachSectionProps {
  coachTips: CoachTip[]
  onLevelUp: (track: TrackType) => void
}

export function CoachSection({ coachTips, onLevelUp }: CoachSectionProps) {
  if (coachTips.length === 0) return null

  return (
    <section className="mt-6">
      <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium mb-3">
        코치
      </h2>
      <div className="flex flex-col gap-2">
        {coachTips.map((tip, i) => (
          <div
            key={i}
            className="bg-[var(--color-bg-card)] rounded-xl px-4 py-3 border-l-4 border-[var(--color-hero-yellow)]"
          >
            <p className="text-sm text-[var(--color-text-primary)]">{tip.message}</p>
            {tip.action === 'level-up' && tip.track && (
              <button
                onClick={() => onLevelUp(tip.track!)}
                className="mt-2 px-4 py-1.5 rounded-lg bg-[var(--color-hero-yellow)] text-black text-xs font-bold"
              >
                다음 동작으로!
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
