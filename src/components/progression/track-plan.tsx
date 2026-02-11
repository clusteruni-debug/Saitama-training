import { useState, useMemo } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO, SAITAMA_GOALS } from '../../data/progression-data'
import { analyzeRPERatio, calculatePlan, compareFrequencies } from '../../lib/plan-calculator'

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

  // 목표 편집 상태
  const [editingTarget, setEditingTarget] = useState(false)
  const [tempTarget, setTempTarget] = useState(String(trackGoal.targetReps))

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

  // 주간 플랜 표시 (축약)
  const [showAllWeeks, setShowAllWeeks] = useState(false)
  const displayWeeks = showAllWeeks ? plan.weeklyPlan : plan.weeklyPlan.slice(0, 8)

  const pct = trackGoal.targetReps > 0
    ? Math.min(100, Math.round((trackProgress.currentReps / trackGoal.targetReps) * 100))
    : 0

  const handleSaveTarget = () => {
    const val = parseInt(tempTarget)
    if (val > 0 && val <= 500) {
      setTrackGoal(track, { targetReps: val })
    }
    setEditingTarget(false)
  }

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

      {/* 목표 설정 카드 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">목표</h2>
          <button
            onClick={() => { setEditingTarget(true); setTempTarget(String(trackGoal.targetReps)) }}
            className="text-xs text-[var(--color-hero-yellow)] font-medium"
          >
            변경
          </button>
        </div>

        {editingTarget ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempTarget}
              onChange={(e) => setTempTarget(e.target.value)}
              className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-[var(--color-text-primary)] text-sm outline-none"
              min={1}
              max={500}
              autoFocus
            />
            <span className="text-xs text-[var(--color-text-secondary)]">{unit}</span>
            <button
              onClick={handleSaveTarget}
              className="px-3 py-2 bg-[var(--color-hero-yellow)] text-black rounded-lg text-xs font-bold"
            >
              저장
            </button>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-hero-yellow)]">
              {Math.round(trackProgress.currentReps)}
            </span>
            <span className="text-lg text-[var(--color-text-secondary)]">/</span>
            <span className="text-3xl font-black text-[var(--color-text-primary)]">
              {trackGoal.targetReps}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">{unit}</span>
          </div>
        )}

        {/* 진행률 바 */}
        <div className="mt-3">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: info.color }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--color-text-secondary)]">현재 {pct}%</span>
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              {pct >= 100 ? '달성!' : `${trackGoal.targetReps - Math.round(trackProgress.currentReps)}${unit} 남음`}
            </span>
          </div>
        </div>

        {/* 사이타마 프리셋 버튼 */}
        {trackGoal.targetReps !== SAITAMA_GOALS[track] && (
          <button
            onClick={() => setTrackGoal(track, { targetReps: SAITAMA_GOALS[track] })}
            className="mt-3 w-full py-2 rounded-lg border border-[var(--color-hero-yellow)]/30 text-xs text-[var(--color-hero-yellow)]"
          >
            사이타마 목표로 설정 ({SAITAMA_GOALS[track]}{unit})
          </button>
        )}
      </div>

      {/* 예상 일정 */}
      {plan.totalWeeks > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">예상 일정</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-[var(--color-hero-yellow)]">{plan.totalWeeks}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">주</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{plan.totalSessions}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">세션</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">{plan.estimatedDate}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">예상 달성일</p>
            </div>
          </div>
        </div>
      )}

      {/* 훈련 빈도 설정 + 비교 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">훈련 빈도</h2>

        <div className="flex gap-2 mb-4">
          {[2, 3, 4, 5, 6].map((days) => (
            <button
              key={days}
              onClick={() => handleFreqChange(days)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                trackGoal.daysPerWeek === days
                  ? 'bg-[var(--color-hero-yellow)] text-black'
                  : 'bg-white/10 text-[var(--color-text-secondary)]'
              }`}
            >
              {days}일
            </button>
          ))}
        </div>

        {/* 빈도별 비교 */}
        <div className="space-y-2">
          {freqComparison.map((comp) => (
            <div
              key={comp.daysPerWeek}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                comp.daysPerWeek === trackGoal.daysPerWeek
                  ? 'bg-[var(--color-hero-yellow)]/10 border border-[var(--color-hero-yellow)]/30'
                  : 'bg-white/5'
              }`}
            >
              <span className="text-xs text-[var(--color-text-secondary)]">
                주 {comp.daysPerWeek}회
              </span>
              <span className={`text-sm font-bold ${
                comp.daysPerWeek === trackGoal.daysPerWeek
                  ? 'text-[var(--color-hero-yellow)]'
                  : 'text-[var(--color-text-primary)]'
              }`}>
                {comp.weeks > 0 ? `${comp.weeks}주` : '달성!'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 마일스톤 */}
      {plan.milestones.length > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">마일스톤</h2>
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />

            {plan.milestones.map((ms, idx) => {
              const reached = trackProgress.currentReps >= ms.reps
              return (
                <div key={idx} className="relative flex items-start gap-3 mb-4 last:mb-0">
                  <div
                    className={`absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center z-10 ${
                      reached
                        ? 'bg-[var(--color-hero-yellow)] border-[var(--color-hero-yellow)]'
                        : 'bg-[var(--color-bg-dark)] border-white/20'
                    }`}
                  >
                    {reached && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className={reached ? 'opacity-60' : ''}>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {ms.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {ms.reps}{unit} — {ms.week}주차
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 주간 플랜 */}
      {plan.weeklyPlan.length > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">
            주간 플랜 ({plan.weeklyPlan.length}주)
          </h2>
          <div className="space-y-1">
            {displayWeeks.map((week) => (
              <div
                key={week.week}
                className="flex items-center gap-3 py-1.5"
              >
                <span className="text-xs text-[var(--color-text-secondary)] w-10 shrink-0">
                  {week.week}주차
                </span>
                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (week.endReps / trackGoal.targetReps) * 100)}%`,
                      backgroundColor: info.color,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--color-text-primary)] w-14 text-right shrink-0">
                  {week.endReps}{unit}
                </span>
                {week.milestone && (
                  <span className="text-[10px] text-[var(--color-hero-yellow)]">★</span>
                )}
              </div>
            ))}
          </div>

          {plan.weeklyPlan.length > 8 && (
            <button
              onClick={() => setShowAllWeeks(!showAllWeeks)}
              className="mt-3 w-full py-2 text-xs text-[var(--color-hero-yellow)] font-medium"
            >
              {showAllWeeks ? '접기' : `전체 ${plan.weeklyPlan.length}주 보기`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
