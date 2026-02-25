import type { TrackType } from '../../../types'
import { TRACK_INFO } from '../../../data/progression-data'

interface NextMilestoneBannerProps {
  milestone: {
    track: TrackType
    label: string
    week: number
    estimatedDate: string
  } | null
}

export function NextMilestoneBanner({ milestone }: NextMilestoneBannerProps) {
  if (!milestone) return null

  return (
    <section className="mb-6">
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-l-4 border-[var(--color-hero-yellow)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase mb-1">다음 마일스톤</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {TRACK_INFO[milestone.track].emoji} {milestone.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-[var(--color-hero-yellow)]">{milestone.week}주</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">{milestone.estimatedDate}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
