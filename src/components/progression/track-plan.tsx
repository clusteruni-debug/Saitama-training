import { useMemo } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO } from '../../data/progression-data'
import { analyzeRPERatio, calculatePlan, compareFrequencies } from '../../lib/plan-calculator'
import { GoalCard } from './plan/goal-card'
import { ScheduleCard } from './plan/schedule-card'
import { FrequencySelector } from './plan/frequency-selector'
import { MilestoneList } from './plan/milestone-list'
import { WeeklyPlan } from './plan/weekly-plan'

interface TrackPlanViewProps {
  track: TrackType
  onBack: () => void
}

export function TrackPlanView({ track, onBack }: TrackPlanViewProps) {
  const trackProgress = useTrainingStore((s) => s.trackProgress[track])
  const trackGoal = useTrainingStore((s) => s.trackGoals[track])
  const sessions = useTrainingStore((s) => s.sessions)
  const setTrackGoal = useTrainingStore((s) => s.setTrackGoal)
  const info = TRACK_INFO[track]
  const isRun = track === 'run'
  const unit = isRun ? '분' : '개'

  // 플랜 계산
  const rpeRatio = useMemo(() => analyzeRPERatio(sessions, track), [sessions, track])
  const plan = useMemo(
    () => calculatePlan(track, trackProgress.currentReps, trackGoal, rpeRatio),
    [track, trackProgress.currentReps, trackGoal, rpeRatio]
  )
  const freqComparison = useMemo(
    () => compareFrequencies(track, trackProgress.currentReps, trackGoal.targetReps, rpeRatio),
    [track, trackProgress.currentReps, trackGoal.targetReps, rpeRatio]
  )

  const handleFreqChange = (daysPerWeek: number) => {
    setTrackGoal(track, { daysPerWeek })
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* 헤더 */}
      <header className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          돌아가기
        </button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{info.emoji}</span>
          <div>
            <h1 className="text-xl font-black text-[var(--color-text-primary)]">{info.label} 플랜</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              세션당 평균 +{plan.avgGainPerSession}{unit}
            </p>
          </div>
        </div>
      </header>

      <GoalCard
        track={track}
        trackProgress={trackProgress}
        trackGoal={trackGoal}
        info={info}
        unit={unit}
        setTrackGoal={setTrackGoal}
      />

      <ScheduleCard
        totalWeeks={plan.totalWeeks}
        totalSessions={plan.totalSessions}
        estimatedDate={plan.estimatedDate}
      />

      <FrequencySelector
        trackGoal={trackGoal}
        freqComparison={freqComparison}
        onFreqChange={handleFreqChange}
      />

      <MilestoneList
        milestones={plan.milestones}
        currentReps={trackProgress.currentReps}
        unit={unit}
      />

      <WeeklyPlan
        weeklyPlan={plan.weeklyPlan}
        targetReps={trackGoal.targetReps}
        info={info}
        unit={unit}
      />
    </div>
  )
}
