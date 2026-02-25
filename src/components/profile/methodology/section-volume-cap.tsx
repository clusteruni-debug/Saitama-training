import type { TrackType, TrackProgress } from '../../../types'
import { VOLUME_CAP, TRACK_INFO } from '../../../data/progression-data'

interface SectionVolumeCapProps {
  trackProgress: Record<TrackType, TrackProgress>
}

export function SectionVolumeCap({ trackProgress }: SectionVolumeCapProps) {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        볼륨 캡 (최대 렙수)
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        각 레벨마다 <span className="text-[var(--color-hero-yellow)] font-medium">최대 렙수 제한</span>이 있습니다.
        50개 이상 푸시업을 반복하면 근력보다 <span className="text-[var(--color-text-primary)]">지구력 훈련</span>이 되어버려요.
      </p>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        캡에 가까워지면 <span className="text-[var(--color-text-primary)] font-medium">동작 난이도를 올리는 것</span>이 더 효과적입니다.
        이것이 프로그레시브 오버로드의 핵심이에요.
      </p>

      <div className="rounded-xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-6 text-center text-[10px] font-medium bg-white/10 text-[var(--color-text-secondary)]">
          <div className="py-2">트랙</div>
          <div className="py-2">Lv0</div>
          <div className="py-2">Lv1</div>
          <div className="py-2">Lv2</div>
          <div className="py-2">Lv3</div>
          <div className="py-2">Lv4</div>
        </div>
        {(['push', 'squat', 'pull', 'core', 'run'] as TrackType[]).map((track) => (
          <div key={track} className="grid grid-cols-6 text-center text-xs border-t border-white/5">
            <div className="py-2 text-[var(--color-text-secondary)] font-medium">
              {TRACK_INFO[track].emoji}
            </div>
            {VOLUME_CAP[track].slice(0, 5).map((cap, i) => {
              const isCurrentLevel = trackProgress[track]?.currentLevel === i
              return (
                <div
                  key={i}
                  className={`py-2 ${isCurrentLevel ? 'text-[var(--color-hero-yellow)] font-bold' : 'text-[var(--color-text-secondary)]'}`}
                >
                  {cap}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">
        노란색 = 현재 레벨의 캡
      </p>
    </section>
  )
}
