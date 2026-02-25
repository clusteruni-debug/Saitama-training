export function SectionDeload() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        디로드와 회복
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        <span className="text-[var(--color-hero-yellow)] font-medium">3~4주마다</span> 볼륨을 50%로 줄이는
        "디로드 주간"이 필요합니다. 계속 강하게 밀면 과훈련으로 부상이나 정체가 와요.
      </p>
      <div className="mt-3 bg-white/5 rounded-xl p-3">
        <p className="text-xs font-medium text-[var(--color-text-primary)] mb-2">과훈련 증상:</p>
        <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <li>- 연속 "힘들었다" 3회 이상</li>
          <li>- 수행 능력 저하 (렙수가 계속 줄어듦)</li>
          <li>- 만성 피로, 수면 장애, 관절통</li>
        </ul>
      </div>
      <div className="mt-3 bg-white/5 rounded-xl p-3">
        <p className="text-xs font-medium text-[var(--color-text-primary)] mb-2">앱의 자동 감지:</p>
        <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <li>- 14일 이상 연속 + hard 비율 &gt; 30% &rarr; 디로드 권장</li>
          <li>- 최근 3세션 연속 hard &rarr; 과훈련 경고</li>
          <li>- 근육군별 회복 상태 표시 (24h/48h)</li>
        </ul>
      </div>
    </section>
  )
}
