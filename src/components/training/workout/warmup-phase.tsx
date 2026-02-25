interface WarmupPhaseProps {
  warmupReps: number
  timeBased: boolean
  onWarmupDone: () => void
}

export function WarmupPhase({ warmupReps, timeBased, onWarmupDone }: WarmupPhaseProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[var(--color-hero-yellow)]/20 flex items-center justify-center">
        <span className="text-3xl">🔥</span>
      </div>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">워밍업</h2>
      <p className="text-sm text-[var(--color-text-secondary)] text-center leading-relaxed">
        가벼운 <span className="text-[var(--color-hero-yellow)] font-bold">{warmupReps}{timeBased ? '초' : '회'}</span>로 몸을 풀어요
      </p>
      <p className="text-[10px] text-[var(--color-text-tertiary)]">
        부상 방지 + 퍼포먼스 향상
      </p>
      <div className="flex gap-3 w-full">
        <button
          onClick={onWarmupDone}
          className="flex-1 py-3 rounded-2xl bg-[var(--color-hero-yellow)] text-black font-bold text-sm active:scale-[0.97] transition-transform"
        >
          워밍업 완료
        </button>
        <button
          onClick={onWarmupDone}
          className="px-6 py-3 rounded-2xl bg-white/10 text-[var(--color-text-secondary)] font-medium text-sm active:scale-[0.97] transition-transform"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
