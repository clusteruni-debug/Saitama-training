export function SectionWarmup() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        워밍업의 중요성
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        본 운동 전 <span className="text-[var(--color-hero-yellow)] font-medium">50% 강도</span>로 가볍게 몸을 풀면:
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">부상 방지</span>
          <span className="text-sm text-[var(--color-text-secondary)]">근육과 관절이 준비됨 — 갑작스러운 부하 방지</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">퍼포먼스</span>
          <span className="text-sm text-[var(--color-text-secondary)]">체온 상승 + 혈류 증가 &rarr; 더 많은 렙수 가능</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">신경 활성</span>
          <span className="text-sm text-[var(--color-text-secondary)]">운동 패턴 리허설 &rarr; 정확한 폼 유지</span>
        </div>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
        앱에서 운동 시작 전 자동으로 워밍업 안내가 표시됩니다. 건너뛰기도 가능하지만, 가능하면 해주세요!
      </p>
    </section>
  )
}
