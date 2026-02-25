import type { HeroRank, TrainingPurpose } from '../../../types'

const PURPOSE_LABELS: Record<string, string> = {
  saitama: '사이타마 도전',
  strength: '근력 향상',
  endurance: '체력 개선',
  diet: '다이어트',
  health: '건강 유지',
}

interface HeroHeaderProps {
  nickname: string
  trainingPurpose: TrainingPurpose
  dDay: number | null
  rank: HeroRank
  streakDays: number
  totalVolume: number
  completedTracks: number
  activeCount: number
}

export function HeroHeader({
  nickname, trainingPurpose, dDay, rank,
  streakDays, totalVolume, completedTracks, activeCount,
}: HeroHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
            {nickname ? `${nickname}의 훈련` : 'SAITAMA TRAINING'}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            {PURPOSE_LABELS[trainingPurpose] || '매일 한계를 넘어서라'}
            {dDay !== null && dDay > 0 && (
              <span className="ml-2 text-[var(--color-hero-yellow)] font-bold">D-{dDay}</span>
            )}
            {dDay !== null && dDay <= 0 && (
              <span className="ml-2 text-green-400 font-bold">D-Day!</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-[var(--color-hero-yellow)]">
            {rank}
          </span>
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">
            Rank
          </span>
        </div>
      </div>

      {/* 스트릭 + 볼륨 + 오늘 */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{streakDays}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">연속일</p>
        </div>
        <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{totalVolume.toLocaleString()}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">총 볼륨</p>
        </div>
        <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{completedTracks}/{activeCount}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">오늘</p>
        </div>
      </div>
    </header>
  )
}
