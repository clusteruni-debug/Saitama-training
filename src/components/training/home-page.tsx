import { useMemo, useEffect } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { TRACK_INFO } from '../../data/progression-data'
import { generateCoachTips, generatePrograms, getSaitamaProgress } from '../../lib/smart-coach'
import { analyzeRPERatio, calculatePlan } from '../../lib/plan-calculator'
import { showToast } from '../ui/toast'
import { HeroHeader } from './home/hero-header'
import { SaitamaProgress } from './home/saitama-progress'
import { NextMilestoneBanner } from './home/next-milestone-banner'
import { WarningBanner } from './home/warning-banner'
import { TrainingSection } from './home/training-section'
import { ProgramsSection } from './home/programs-section'
import { CoachSection } from './home/coach-section'

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
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
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
      <HeroHeader
        nickname={nickname}
        trainingPurpose={trainingPurpose}
        dDay={dDay}
        rank={rank}
        streakDays={streakDays}
        totalVolume={totalVolume}
        completedTracks={completedTracks}
        activeCount={activeCount}
      />

      {/* 사이타마 진행률 바 — header 아래에 위치 */}
      <SaitamaProgress
        saitamaPct={saitamaPct}
        activeTracks={activeTracks}
        trackProgress={trackProgress}
      />

      {/* 향후 플랜 요약 */}
      <div className="mt-6">
        <NextMilestoneBanner milestone={nextMilestone} />
      </div>

      {/* 디로드/과훈련 배너 */}
      <WarningBanner coachTips={coachTips} />

      {/* 오늘의 트레이닝 */}
      <TrainingSection activeTracks={activeTracks} toggleActiveTrack={toggleActiveTrack} />

      {/* 내 프로그램 */}
      <ProgramsSection programs={programs} />

      {/* 스마트 코치 */}
      <CoachSection coachTips={coachTips} onLevelUp={handleLevelUp} />
    </div>
  )
}
