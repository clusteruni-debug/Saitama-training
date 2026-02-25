export function SectionRestTime() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        스마트 휴식 시간
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        세트 간 휴식 시간은 운동 강도에 따라 달라야 합니다. NSCA 가이드라인 기반으로 자동 추천해요.
      </p>
      <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-3 text-center text-xs font-medium">
          <div className="bg-purple-500/20 text-purple-400 py-2">근력 (1-5회)</div>
          <div className="bg-blue-500/20 text-blue-400 py-2">근비대 (6-12회)</div>
          <div className="bg-green-500/20 text-green-400 py-2">근지구력 (13+회)</div>
        </div>
        <div className="grid grid-cols-3 text-center text-sm font-bold py-3 bg-white/5">
          <div className="text-purple-400">120초</div>
          <div className="text-blue-400">75초</div>
          <div className="text-green-400">45-60초</div>
        </div>
      </div>
      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">
        &plusmn;15초 버튼으로 개인 체감에 맞게 조절 가능
      </p>
    </section>
  )
}
