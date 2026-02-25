import { ReferenceItem } from './reference-item'

export function SectionReferences() {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        참고 문헌
      </h2>
      <div className="flex flex-col gap-2">
        <ReferenceItem
          title="Schoenfeld et al. (2017)"
          desc="근비대를 위한 볼륨 증가: 주당 5-10% 증가 권장"
        />
        <ReferenceItem
          title="Helms et al. (2016)"
          desc="RPE 기반 자동조절 — 주관적 난이도로 훈련 부하 조절"
        />
        <ReferenceItem
          title="Schoenfeld & Grgic (2019)"
          desc="디로드 타이밍: 3~4주마다 볼륨 50% 감소 권장"
        />
        <ReferenceItem
          title="NSCA CSCS 가이드라인"
          desc="프로그레시브 오버로드 원칙 + 렙수별 최적 휴식 시간"
        />
        <ReferenceItem
          title="Convict Conditioning (Paul Wade)"
          desc="맨몸운동 프로그레션 — 동작별 마스터리 기준"
        />
      </div>
    </section>
  )
}
