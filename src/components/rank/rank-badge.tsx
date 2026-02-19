import type { HeroRank } from '../../types'

interface RankBadgeProps {
  rank: HeroRank
  size?: 'sm' | 'md' | 'lg'
}

const rankColors: Record<HeroRank, { bg: string; text: string; border: string }> = {
  C: { bg: 'bg-zinc-700', text: 'text-zinc-300', border: 'border-zinc-500' },
  B: { bg: 'bg-blue-900/50', text: 'text-blue-400', border: 'border-blue-500' },
  A: { bg: 'bg-purple-900/50', text: 'text-purple-400', border: 'border-purple-500' },
  S: { bg: 'bg-yellow-900/50', text: 'text-[var(--color-hero-yellow)]', border: 'border-[var(--color-hero-yellow)]' },
}

const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-xl',
  lg: 'w-20 h-20 text-3xl',
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const colors = rankColors[rank]
  return (
    <div
      className={`${colors.bg} ${colors.text} ${colors.border} ${sizeStyles[size]} rounded-full border-2 flex items-center justify-center font-black`}
    >
      {rank}
    </div>
  )
}
