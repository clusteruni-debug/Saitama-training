import { useMemo, useEffect } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO, SAITAMA_GOALS } from '../../data/progression-data'
import { generateCoachTips, generatePrograms, getSaitamaProgress } from '../../lib/smart-coach'
import { analyzeRPERatio, calculatePlan } from '../../lib/plan-calculator'
import { TrackCard } from './track-card'
import { showToast } from '../ui/toast'

const ALL_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core', 'run']

const PURPOSE_LABELS: Record<string, string> = {
  saitama: '사이타마 도전',
  strength: '근력 향상',
  endurance: '체력 개선',
  diet: '다이어트',
  health: '건강 유지',
}

export function HomePage() {
  const rank = useTrainingStore((s) => s.rank)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const sessions = useTrainingStore((s) => s.sessions)
  const activeTracks = useTrainingStore((s) => s.activeTracks)
  const toggleActiveTrack = useTrainingStore((s) => s.toggleActiveTrack)
  const trackProgress = useTrainingStore((s) => s.trackProgress)
  const consecutiveEasy = useTrainingStore((s) => s.consecutiveEasy)
  const programs = useTrainingStore((s) => s.programs)
  const setPrograms = useTrainingStore((s) => s.setPrograms)
  const levelUp = useTrainingStore((s) => s.levelUp)
  const nickname = useTrainingStore((s) => s.nickname)
  const trainingPurpose = useTrainingStore((s) => s.trainingPurpose)
  const targetDate = useTrainingStore((s) => s.targetDate)
  const trackGoals = useTrainingStore((s) => s.trackGoals)

  // 프로그램 자동 생성 (미달성 프로그램 없는 트랙에 대해)
  useEffect(() => {
    const input = { trackProgress, sessions, consecutiveEasy, streakDays, totalVolume, activeTracks, programs }
    const newGoals = generatePrograms(input)
    if (newGoals.length > 0) {
      setPrograms([...programs.filter((p) => !p.achieved || Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000), ...newGoals])
    }
  }, [activeTracks.length]) // 트랙 변경 시 + 최초 마운트

  // 스마트 코치 팁
  const coachTips = useMemo(() => generateCoachTips({
    trackProgress, sessions, consecutiveEasy, streakDays, totalVolume, activeTracks, programs,
  }), [trackProgress, sessions, consecutiveEasy, streakDays, totalVolume, activeTracks, programs])

  // 사이타마 진행률
  const saitamaPct = useMemo(
    () => getSaitamaProgress(trackProgress, activeTracks),
    [trackProgress, activeTracks]
  )

  // 오늘 완료 트랙 수
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const todaySessions = sessions[todayStr] || []
  const completedTracks = new Set(todaySessions.map((s) => s.track)).size
  const activeCount = activeTracks.length

  // D-day 계산
  const dDay = useMemo(() => {
    if (!targetDate) return null
    const target = new Date(targetDate)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }, [targetDate])

  // 가장 가까운 마일스톤
  const nextMilestone = useMemo(() => {
    for (const t of activeTracks) {
      const goal = trackGoals[t]
      const prog = trackProgress[t]
      if (prog.currentReps >= goal.targetReps) continue
      const rpeRatio = analyzeRPERatio(sessions, t)
      const plan = calculatePlan(t, prog.currentReps, goal, rpeRatio)
      const nextMs = plan.milestones.find((ms) => ms.reps > prog.currentReps)
      if (nextMs) {
        return { track: t, label: nextMs.label, week: nextMs.week, estimatedDate: plan.estimatedDate }
      }
    }
    return null
  }, [activeTracks, trackGoals, trackProgress, sessions])

  const handleLevelUp = (track: TrackType) => {
    const ok = levelUp(track)
    if (ok) {
      const info = TRACK_INFO[track]
      showToast(`${info.emoji} ${info.label} 레벨업!`, 'success')
    }
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* 히어로 헤더 */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
              {nickname ? `${nickname}의 훈련` : 'SAITAMA TRAINING'}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">
              {PURPOSE_LABELS[trainingPurpose] || '매일 한계를 넘어서라'}
              {dDay !== null && dDay > 0 && (
                <span className="ml-2 text-[var(--color-hero-yellow)] font-bold">D-{dDay}</span>
              )}
              {dDay !== null && dDay <= 0 && (
                <span className="ml-2 text-green-400 font-bold">D-Day!</span>
              )}
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

        {/* 스트릭 + 볼륨 + 오늘 */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{streakDays}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">연속일</p>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{totalVolume.toLocaleString()}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">총 볼륨</p>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{completedTracks}/{activeCount}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">오늘</p>
          </div>
        </div>

        {/* 사이타마 진행률 바 */}
        <div className="mt-4 bg-[var(--color-bg-card)] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">사이타마 루틴</span>
            <span className="text-xs font-bold text-[var(--color-hero-yellow)]">{saitamaPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-hero-yellow)] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, saitamaPct)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {activeTracks.slice(0, 5).map((t) => {
              const info = TRACK_INFO[t]
              const pct = Math.min(100, Math.round((trackProgress[t].currentReps / SAITAMA_GOALS[t]) * 100))
              return (
                <div key={t} className="flex flex-col items-center">
                  <span className="text-xs">{info.emoji}</span>
                  <span className="text-[9px] text-[var(--color-text-secondary)]">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* 향후 플랜 요약 */}
      {nextMilestone && (
        <section className="mb-6">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-l-4 border-[var(--color-hero-yellow)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[var(--color-text-secondary)] uppercase mb-1">다음 마일스톤</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {TRACK_INFO[nextMilestone.track].emoji} {nextMilestone.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-[var(--color-hero-yellow)]">{nextMilestone.week}주</p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">{nextMilestone.estimatedDate}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 디로드/과훈련 배너 */}
      {coachTips.some((t) => t.type === 'overtraining-warning' || t.type === 'deload-suggest') && (
        <section className="mb-4">
          {coachTips
            .filter((t) => t.type === 'overtraining-warning' || t.type === 'deload-suggest')
            .slice(0, 1)
            .map((tip, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 border ${
                  tip.type === 'overtraining-warning'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <p className={`text-sm font-medium ${
                  tip.type === 'overtraining-warning' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {tip.message}
                </p>
              </div>
            ))}
        </section>
      )}

      {/* 오늘의 트레이닝 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium">
            오늘의 트레이닝
          </h2>
        </div>

        {/* 트랙 토글 칩 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {ALL_TRACKS.map((track) => {
            const info = TRACK_INFO[track]
            const isActive = activeTracks.includes(track)
            return (
              <button
                key={track}
                onClick={() => toggleActiveTrack(track)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-[var(--color-text-primary)]'
                    : 'bg-white/5 text-[var(--color-text-secondary)] opacity-50'
                }`}
              >
                <span>{info.emoji}</span>
                <span>{info.label}</span>
              </button>
            )
          })}
        </div>

        {/* 활성 트랙 카드 */}
        <div className="flex flex-col gap-3">
          {activeTracks.map((track) => (
            <TrackCard key={track} track={track} />
          ))}
        </div>
      </section>

      {/* 내 프로그램 */}
      {programs.filter((p) => !p.achieved).length > 0 && (
        <section className="mt-6">
          <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium mb-3">
            내 프로그램
          </h2>
          <div className="flex flex-col gap-2">
            {programs.filter((p) => !p.achieved).slice(0, 3).map((goal) => {
              const info = TRACK_INFO[goal.track]
              const pct = goal.axis === 'speed'
                ? Math.max(0, Math.round((1 - Math.max(0, goal.current - goal.target) / (goal.current || 1)) * 100))
                : Math.round((goal.current / goal.target) * 100)
              return (
                <div key={goal.id} className="bg-[var(--color-bg-card)] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {info.emoji} {goal.title}
                    </span>
                    <span className="text-xs text-[var(--color-hero-yellow)] font-bold">
                      {Math.min(100, pct)}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">{goal.description}</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 스마트 코치 */}
      {coachTips.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium mb-3">
            코치
          </h2>
          <div className="flex flex-col gap-2">
            {coachTips.map((tip, i) => (
              <div
                key={i}
                className="bg-[var(--color-bg-card)] rounded-xl px-4 py-3 border-l-4 border-[var(--color-hero-yellow)]"
              >
                <p className="text-sm text-[var(--color-text-primary)]">{tip.message}</p>
                {tip.action === 'level-up' && tip.track && (
                  <button
                    onClick={() => handleLevelUp(tip.track!)}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[var(--color-hero-yellow)] text-black text-xs font-bold"
                  >
                    다음 동작으로!
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
