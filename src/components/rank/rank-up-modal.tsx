import type { HeroRank } from '../../types'
import { RankBadge } from './rank-badge'
import { Button } from '../ui/button'

interface RankUpModalProps {
  newRank: HeroRank
  onClose: () => void
}

const rankNames: Record<HeroRank, string> = {
  C: 'C급 히어로',
  B: 'B급 히어로',
  A: 'A급 히어로',
  S: 'S급 히어로',
}

export function RankUpModal({ newRank, onClose }: RankUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--color-bg-card)] rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in">
        <p className="text-4xl mb-4">🏆</p>
        <h2 className="text-xl font-black text-[var(--color-hero-yellow)] mb-2">
          랭크 업!
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {rankNames[newRank]}로 승급했습니다
        </p>

        <div className="flex justify-center mb-8">
          <RankBadge rank={newRank} size="lg" />
        </div>

        <Button onClick={onClose} size="lg" className="w-full">
          계속하기
        </Button>
      </div>
    </div>
  )
}
