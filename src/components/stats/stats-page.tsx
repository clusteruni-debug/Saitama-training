import { useMemo, useState } from 'react'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO, SAITAMA_GOALS } from '../../data/progression-data'
import { getSaitamaProgress } from '../../lib/smart-coach'
import { RankBadge } from '../rank/rank-badge'
import { WeeklyChart } from './weekly-chart'
import { StreakDisplay } from './streak-display'
import { TrackSummary } from './track-summary'

type ChartMode = 'weekly' | 'monthly'

export function StatsPage() {
  const rank = useTrainingStore((s) => s.rank)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const maxStreakDays = useTrainingStore((s) => s.maxStreakDays)
  const sessions = useTrainingStore((s) => s.sessions)
  const trackProgress = useTrainingStore((s) => s.trackProgress)
  const activeTracks = useTrainingStore((s) => s.activeTracks)

  const [chartMode, setChartMode] = useState<ChartMode>('weekly')

  const saitamaPct = useMemo(
    () => getSaitamaProgress(trackProgress, activeTracks),
    [trackProgress, activeTracks]
  )

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
        <StreakDisplay days={streakDays} maxDays={maxStreakDays} />
      </div>

      {/* 운동한 날 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center mb-6">
        <p className="text-lg font-bold text-[var(--color-text-primary)]">{activeDays}</p>
        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">운동한 날</span>
      </div>

      {/* 사이타마 목표 */}
      <div className="mb-6 bg-[var(--color-bg-card)] rounded-2xl p-4">
        <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
          사이타마 루틴 달성률
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-hero-yellow)] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, saitamaPct)}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-black text-[var(--color-hero-yellow)]">{saitamaPct}%</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {activeTracks.slice(0, 5).map((t) => {
            const info = TRACK_INFO[t]
            const current = trackProgress[t].currentReps
            const target = SAITAMA_GOALS[t]
            const unit = t === 'run' ? '분' : '개'
            return (
              <div key={t} className="text-center">
                <span className="text-lg">{info.emoji}</span>
                <p className="text-[10px] font-bold text-[var(--color-text-primary)]">
                  {current}/{target}
                </p>
                <p className="text-[9px] text-[var(--color-text-secondary)]">{unit}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 볼륨 차트 — 주간/월간 토글 */}
      <div className="mb-6 bg-[var(--color-bg-card)] rounded-2xl p-4">
        {/* 토글 */}
        <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-0.5">
          {(['weekly', 'monthly'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setChartMode(m)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartMode === m
                  ? 'bg-[var(--color-hero-yellow)] text-black'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {m === 'weekly' ? '주간' : '월간'}
            </button>
          ))}
        </div>
        <WeeklyChart sessions={sessions} mode={chartMode} />
      </div>

      {/* 트랙 요약 */}
      <TrackSummary />
    </div>
  )
}
