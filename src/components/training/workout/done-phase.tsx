interface DonePhaseProps {
  totalSets: number
  setResults: { reps: number; completed: boolean }[]
  timeBased: boolean
}

export function DonePhase({ totalSets, setResults, timeBased }: DonePhaseProps) {
  return (
    <div className="text-center animate-scale-in">
      <p className="text-6xl mb-4">🎉</p>
      <h2 className="text-2xl font-black text-[var(--color-hero-yellow)]">
        운동 완료!
      </h2>
      <p className="text-[var(--color-text-secondary)] mt-2">
        {totalSets}세트 · 총 {setResults.reduce((s, r) => s + r.reps, 0)}회 수행
      </p>
      {/* 세트별 결과 */}
      <div className="flex justify-center gap-2 mt-4">
        {setResults.map((r, i) => (
          <div key={i} className="bg-[var(--color-bg-card)] rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] text-[var(--color-text-secondary)]">{i + 1}세트</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {timeBased ? `${r.reps}초` : `${r.reps}회`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
