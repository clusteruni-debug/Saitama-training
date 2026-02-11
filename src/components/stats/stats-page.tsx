import { useTrainingStore } from '../../stores/useTrainingStore'
import { RankBadge } from '../rank/rank-badge'
import { WeeklyChart } from './weekly-chart'
import { StreakDisplay } from './streak-display'
import { TrackSummary } from './track-summary'

export function StatsPage() {
  const rank = useTrainingStore((s) => s.rank)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const sessions = useTrainingStore((s) => s.sessions)

  // 총 세션 수
  const totalSessions = Object.values(sessions).reduce((sum, arr) => sum + arr.length, 0)

  // 운동한 날 수
  const activeDays = Object.keys(sessions).filter((d) => sessions[d].length > 0).length

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          통계
        </h1>
      </header>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center flex flex-col items-center gap-1">
          <RankBadge rank={rank} size="sm" />
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">랭크</span>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{totalVolume.toLocaleString()}</p>
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">총 볼륨</span>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{totalSessions}</p>
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">총 세션</span>
        </div>
      </div>

      {/* 스트릭 */}
      <div className="mb-6">
        <StreakDisplay days={streakDays} />
      </div>

      {/* 운동한 날 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center mb-6">
        <p className="text-lg font-bold text-[var(--color-text-primary)]">{activeDays}</p>
        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">운동한 날</span>
      </div>

      {/* 주간 차트 */}
      <div className="mb-6 bg-[var(--color-bg-card)] rounded-2xl p-4">
        <WeeklyChart sessions={sessions} />
      </div>

      {/* 트랙 요약 */}
      <TrackSummary />
    </div>
  )
}
