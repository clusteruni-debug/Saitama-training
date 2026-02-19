interface ProgressBarProps {
  value: number   // 0-100
  color?: string
  className?: string
}

export function ProgressBar({ value, color = 'var(--color-hero-yellow)', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
