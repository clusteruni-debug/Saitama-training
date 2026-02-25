import { useNavigate } from 'react-router-dom'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { SectionProgressiveOverload } from './methodology/section-progressive-overload'
import { SectionRPE } from './methodology/section-rpe'
import { SectionLevelUp } from './methodology/section-level-up'
import { SectionVolumeCap } from './methodology/section-volume-cap'
import { SectionDeload } from './methodology/section-deload'
import { SectionRestTime } from './methodology/section-rest-time'
import { SectionWarmup } from './methodology/section-warmup'
import { SectionReferences } from './methodology/section-references'

export function MethodologyPage() {
  const navigate = useNavigate()
  const trackProgress = useTrainingStore((s) => s.trackProgress)
  const consecutiveEasy = useTrainingStore((s) => s.consecutiveEasy)
  const activeTracks = useTrainingStore((s) => s.activeTracks)
  const hasPullUpBar = useTrainingStore((s) => s.hasPullUpBar)

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* 헤더 */}
      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[var(--color-text-secondary)]"
        >
          &larr;
        </button>
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          운동 방법론
        </h1>
      </header>

      <SectionProgressiveOverload />
      <SectionRPE />
      <SectionLevelUp
        activeTracks={activeTracks}
        trackProgress={trackProgress}
        consecutiveEasy={consecutiveEasy}
        hasPullUpBar={hasPullUpBar}
      />
      <SectionVolumeCap trackProgress={trackProgress} />
      <SectionDeload />
      <SectionRestTime />
      <SectionWarmup />
      <SectionReferences />
    </div>
  )
}
