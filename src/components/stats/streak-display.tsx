interface StreakDisplayProps {
  days: number
}

export function StreakDisplay({ days }: StreakDisplayProps) {
  const flame = days >= 7 ? '🔥🔥🔥' : days >= 3 ? '🔥🔥' : days > 0 ? '🔥' : '❄️'

  return (
    <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 text-center">
      <p className="text-3xl mb-1">{flame}</p>
      <p className="text-3xl font-black text-[var(--color-text-primary)]">{days}</p>
      <p className="text-xs text-[var(--color-text-secondary)] uppercase mt-1">연속 운동일</p>
    </div>
  )
}
