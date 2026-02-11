import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TrackCard } from './track-card'

const TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

export function HomePage() {
  const rank = useTrainingStore((s) => s.rank)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const sessions = useTrainingStore((s) => s.sessions)

  // 오늘 완료 트랙 수
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const todaySessions = sessions[todayStr] || []
  const completedTracks = new Set(todaySessions.map((s) => s.track)).size

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* 히어로 헤더 */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
              SAITAMA TRAINING
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">
              매일 한계를 넘어서라
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-[var(--color-hero-yellow)]">
              {rank}
            </span>
            <span className="text-[10px] text-[var(--color-text-secondary)] uppercase">
              Rank
            </span>
          </div>
        </div>

        {/* 스트릭 + 볼륨 */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {streakDays}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">
              연속일
            </p>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {totalVolume.toLocaleString()}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">
              총 볼륨
            </p>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {completedTracks}/4
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">
              오늘
            </p>
          </div>
        </div>
      </header>

      {/* 오늘의 트레이닝 */}
      <section>
        <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
          오늘의 트레이닝
        </h2>
        <div className="flex flex-col gap-3">
          {TRACKS.map((track) => (
            <TrackCard key={track} track={track} />
          ))}
        </div>
      </section>
    </div>
  )
}
