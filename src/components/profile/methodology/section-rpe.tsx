export function SectionRPE() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        RPE 자동조절
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        운동 후 <span className="text-[var(--color-text-primary)] font-medium">"쉬웠다 / 적당했다 / 힘들었다"</span> 피드백에 따라
        다음 세션의 목표 횟수가 <span className="text-[var(--color-hero-yellow)] font-medium">비율 기반</span>으로 자동 조절됩니다.
      </p>

      <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-3 text-center text-xs font-medium">
          <div className="bg-green-500/20 text-green-400 py-2">쉬웠다</div>
          <div className="bg-yellow-500/20 text-yellow-400 py-2">적당했다</div>
          <div className="bg-red-500/20 text-red-400 py-2">힘들었다</div>
        </div>
        <div className="grid grid-cols-3 text-center text-sm font-bold py-3 bg-white/5">
          <div className="text-green-400">+10%</div>
          <div className="text-yellow-400">+5%</div>
          <div className="text-red-400">-5%</div>
        </div>
      </div>

      <div className="mt-3 bg-white/5 rounded-xl p-3">
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-text-primary)] font-medium">예시:</span> 현재 20개 &times; "쉬웠다" = 다음에 22개 (+10%)
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          현재 50개 &times; "쉬웠다" = 다음에 55개 (+10%)
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
          고정값(+3)이 아니라 비율이라서, 적은 횟수에서도 많은 횟수에서도 적절한 증가폭을 유지합니다.
        </p>
      </div>
    </section>
  )
}
