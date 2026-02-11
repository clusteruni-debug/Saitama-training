interface SetCounterProps {
  currentSet: number
  totalSets: number
}

export function SetCounter({ currentSet, totalSets }: SetCounterProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSets }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors ${
            i < currentSet
              ? 'bg-[var(--color-hero-yellow)]'
              : i === currentSet
                ? 'bg-[var(--color-hero-yellow)]/50 animate-pulse'
                : 'bg-white/10'
          }`}
        />
      ))}
      <span className="text-[var(--color-text-secondary)] text-sm ml-2">
        {currentSet + 1} / {totalSets}
      </span>
    </div>
  )
}
