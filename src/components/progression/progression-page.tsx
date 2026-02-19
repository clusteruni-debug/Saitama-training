import { useState, useMemo } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO } from '../../data/progression-data'
import { analyzeRPERatio, calculatePlan } from '../../lib/plan-calculator'
import { TrackPlanView } from './track-plan'

const ALL_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core', 'run']

export function ProgressionPage() {
  const activeTracks = useTrainingStore((s) => s.activeTracks)
  const [selectedTrack, setSelectedTrack] = useState<TrackType | null>(null)

  const tracks = ALL_TRACKS.filter((t) => activeTracks.includes(t))

  if (selectedTrack) {
    return (
      <TrackPlanView
        track={selectedTrack}
        onBack={() => setSelectedTrack(null)}
      />
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          내 로드맵
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          목표를 설정하고 플랜을 확인하세요
        </p>
      </header>

      {/* 트랙별 요약 카드 */}
      <div className="flex flex-col gap-3">
        {tracks.map((track) => (
          <TrackSummaryCard
            key={track}
            track={track}
            onSelect={() => setSelectedTrack(track)}
          />
        ))}
      </div>
    </div>
  )
}

// 트랙 요약 카드 — 현재 → 목표 + 예상 주차
function TrackSummaryCard({ track, onSelect }: { track: TrackType; onSelect: () => void }) {
  const trackProgress = useTrainingStore((s) => s.trackProgress[track])
  const trackGoal = useTrainingStore((s) => s.trackGoals[track])
  const sessions = useTrainingStore((s) => s.sessions)
  const info = TRACK_INFO[track]

  // 간단한 예상 주차 계산 (상세 계산은 TrackPlanView에서)
  const plan = useMemo(() => {
    const rpeRatio = analyzeRPERatio(sessions, track)
    return calculatePlan(track, trackProgress.currentReps, trackGoal, rpeRatio)
  }, [sessions, track, trackProgress.currentReps, trackGoal])

  const pct = trackGoal.targetReps > 0
    ? Math.min(100, Math.round((trackProgress.currentReps / trackGoal.targetReps) * 100))
    : 0

  const isRun = track === 'run'
  const unit = isRun ? '분' : '개'

  return (
    <button
      onClick={onSelect}
      className="w-full bg-[var(--color-bg-card)] rounded-xl p-4 text-left transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{info.emoji}</span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{info.label}</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            현재 {Math.round(trackProgress.currentReps)}{unit} → 목표 {trackGoal.targetReps}{unit}
          </p>
        </div>
        <div className="text-right">
          {plan.totalWeeks > 0 ? (
            <>
              <p className="text-lg font-bold text-[var(--color-hero-yellow)]">{plan.totalWeeks}주</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">예상 소요</p>
            </>
          ) : (
            <p className="text-sm font-bold text-green-400">달성!</p>
          )}
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: info.color,
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          주 {trackGoal.daysPerWeek}회
        </span>
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          {pct}%
        </span>
      </div>
    </button>
  )
}
