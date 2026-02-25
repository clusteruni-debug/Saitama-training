import type { TrackType } from '../../../types'
import { LEVEL_UP_CRITERIA, TRACK_INFO, getExerciseForTrack } from '../../../data/progression-data'
import { LevelUpProgressBar } from './level-up-progress-bar'
import type { TrackProgress } from '../../../types'

interface SectionLevelUpProps {
  activeTracks: TrackType[]
  trackProgress: Record<TrackType, TrackProgress>
  consecutiveEasy: Record<TrackType, number>
  hasPullUpBar: boolean
}

export function SectionLevelUp({ activeTracks, trackProgress, consecutiveEasy, hasPullUpBar }: SectionLevelUpProps) {
  return (
    <section className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
        레벨업 기준
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        각 트랙마다 <span className="text-[var(--color-text-primary)] font-medium">다른 레벨업 기준</span>이 적용됩니다.
        풀업 50개는 비현실적이지만, 푸시업 25개는 합리적이죠. 고난도 동작으로 갈수록 안전을 위해 더 많은 확인이 필요합니다.
      </p>

      {activeTracks.map((track) => {
        const progress = trackProgress[track]
        const info = TRACK_INFO[track]
        const criteria = LEVEL_UP_CRITERIA[track]?.[progress.currentLevel]
        const easyCount = consecutiveEasy[track] || 0
        const exercise = getExerciseForTrack(track, progress.currentLevel, hasPullUpBar)
        const nextExercise = progress.currentLevel < 5
          ? getExerciseForTrack(track, progress.currentLevel + 1, hasPullUpBar)
          : null

        return (
          <div key={track} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{info.emoji}</span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{info.label}</span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                Lv.{progress.currentLevel} {exercise.name}
              </span>
            </div>

            {criteria && nextExercise ? (
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[var(--color-text-secondary)]">
                    다음: <span className="text-[var(--color-text-primary)] font-medium">{nextExercise.name}</span>
                  </span>
                </div>
                {/* 렙수 진행률 */}
                <LevelUpProgressBar
                  label="렙수"
                  current={progress.currentReps}
                  target={criteria.minReps}
                  unit={track === 'run' ? '분' : (exercise.id === 'core-0' || exercise.id === 'pull-0' ? '초' : '개')}
                />
                {/* Easy 연속 진행률 */}
                <LevelUpProgressBar
                  label="Easy 연속"
                  current={easyCount}
                  target={criteria.consecutiveEasy}
                  unit="회"
                />
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-[var(--color-text-tertiary)]">최고 레벨 도달!</p>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
