export function SectionProgressiveOverload() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        프로그레시브 오버로드란?
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        근력/체력을 향상시키려면 몸에 <span className="text-[var(--color-hero-yellow)] font-medium">점진적으로 더 큰 부하</span>를
        주어야 합니다. 같은 운동을 같은 강도로 계속하면 몸이 적응해서 더 이상 발전하지 않아요.
      </p>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-2">
        이 앱은 <span className="text-[var(--color-text-primary)] font-medium">3가지 축</span>으로 오버로드를 적용합니다:
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">볼륨</span>
          <span className="text-sm text-[var(--color-text-secondary)]">같은 동작, 횟수를 늘림 (10개 &rarr; 12개)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">속도</span>
          <span className="text-sm text-[var(--color-text-secondary)]">같은 횟수를 더 빠르게 (개인 기록 갱신)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">난이도</span>
          <span className="text-sm text-[var(--color-text-secondary)]">더 어려운 동작으로 진급 (푸시업 &rarr; 다이아몬드)</span>
        </div>
      </div>
    </section>
  )
}
