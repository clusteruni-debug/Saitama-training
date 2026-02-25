interface RestResultsProps {
  setResults: { reps: number; completed: boolean }[]
  timeBased: boolean
}

export function RestResults({ setResults, timeBased }: RestResultsProps) {
  if (setResults.length === 0) return null

  return (
    <div className="w-full bg-[var(--color-bg-card)] rounded-xl p-3 mb-2">
      {setResults.map((r, i) => (
        <div key={i} className="flex items-center gap-2 py-1">
          <span className="text-green-400 text-xs">✓</span>
          <span className="text-sm text-[var(--color-text-primary)]">
            {i + 1}세트: {timeBased ? `${r.reps}초` : `${r.reps}회`}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2 py-1">
        <span className="text-[var(--color-hero-yellow)] text-xs">→</span>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {setResults.length + 1}세트 대기 중
        </span>
      </div>
    </div>
  )
}
