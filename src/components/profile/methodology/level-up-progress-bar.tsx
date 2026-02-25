interface LevelUpProgressBarProps {
  label: string
  current: number
  target: number
  unit: string
}

export function LevelUpProgressBar({ label, current, target, unit }: LevelUpProgressBarProps) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  const met = current >= target

  return (
    <div className="mb-1.5 last:mb-0">
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-[var(--color-text-tertiary)]">{label}</span>
        <span className={met ? 'text-green-400 font-medium' : 'text-[var(--color-text-secondary)]'}>
          {current}/{target}{unit} {met && '\u2713'}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${met ? 'bg-green-500' : 'bg-[var(--color-hero-yellow)]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
