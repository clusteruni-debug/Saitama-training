import type { TrackType, WorkoutSession, TrackGoal } from '../types'
import { calculateRepsDelta } from '../data/progression-data'

// ─── 플랜 계산기: 목표까지의 로드맵 생성 ─────────────────

export interface WeekPlan {
  week: number
  startReps: number
  endReps: number
  sessions: number
  milestone?: string
}

export interface TrackPlan {
  track: TrackType
  currentReps: number
  targetReps: number
  daysPerWeek: number
  totalWeeks: number
  totalSessions: number
  estimatedDate: string       // YYYY-MM-DD
  avgGainPerSession: number   // 세션당 평균 증가량
  weeklyPlan: WeekPlan[]
  milestones: { reps: number; week: number; label: string }[]
}

// RPE 히스토리에서 easy/moderate/hard 비율 분석
export function analyzeRPERatio(
  sessions: Record<string, WorkoutSession[]>,
  track: TrackType
): { easy: number; moderate: number; hard: number } {
  const allSessions = Object.values(sessions).flat().filter((s) => s.track === track && s.rpe)
  if (allSessions.length < 3) {
    // 데이터 부족 → 보수적 기본값
    return { easy: 0.5, moderate: 0.35, hard: 0.15 }
  }

  let easy = 0, moderate = 0, hard = 0
  for (const s of allSessions) {
    if (s.rpe === 'easy') easy++
    else if (s.rpe === 'moderate') moderate++
    else hard++
  }
  const total = easy + moderate + hard
  return {
    easy: easy / total,
    moderate: moderate / total,
    hard: hard / total,
  }
}

// 세션당 평균 렙 증가량 계산 (비율 기반 — 현재 렙수 반영)
function calcAvgGain(ratio: { easy: number; moderate: number; hard: number }, currentReps: number): number {
  return ratio.easy * calculateRepsDelta(currentReps, 'easy')
       + ratio.moderate * calculateRepsDelta(currentReps, 'moderate')
       + ratio.hard * calculateRepsDelta(currentReps, 'hard')
}

// 마일스톤 정의
const MILESTONES: { reps: number; label: string }[] = [
  { reps: 15, label: '15개 돌파' },
  { reps: 20, label: '20개 달성!' },
  { reps: 30, label: '30개! 꽤 강해졌어' },
  { reps: 50, label: '50개! 절반 왔다' },
  { reps: 75, label: '75개! 거의 다 왔어' },
  { reps: 100, label: '100개! 사이타마!' },
]

const RUN_MILESTONES: { reps: number; label: string }[] = [
  { reps: 15, label: '15분 달리기' },
  { reps: 20, label: '20분! 조깅 시작' },
  { reps: 30, label: '30분! 5km급' },
  { reps: 45, label: '45분! 사이타마급' },
  { reps: 60, label: '60분! 10km 완주' },
]

// 전체 플랜 계산
export function calculatePlan(
  track: TrackType,
  currentReps: number,
  goal: TrackGoal,
  rpeRatio: { easy: number; moderate: number; hard: number }
): TrackPlan {
  const targetReps = goal.targetReps
  const daysPerWeek = goal.daysPerWeek
  const avgGain = calcAvgGain(rpeRatio, currentReps)

  // 이미 달성
  if (currentReps >= targetReps) {
    return {
      track, currentReps, targetReps, daysPerWeek,
      totalWeeks: 0, totalSessions: 0,
      estimatedDate: formatDate(new Date()),
      avgGainPerSession: avgGain,
      weeklyPlan: [],
      milestones: [],
    }
  }

  const weeklyPlan: WeekPlan[] = []
  const milestones: { reps: number; week: number; label: string }[] = []
  const milestoneList = track === 'run' ? RUN_MILESTONES : MILESTONES
  const passedMilestones = new Set<number>()

  let reps = currentReps
  let week = 0
  let totalSessions = 0

  while (reps < targetReps && week < 200) {
    week++
    const startReps = reps
    const sessionsThisWeek = Math.min(daysPerWeek, 7)

    for (let s = 0; s < sessionsThisWeek && reps < targetReps; s++) {
      // 비율 기반이라 현재 렙수에 따라 증가량이 달라짐
      const gain = calcAvgGain(rpeRatio, Math.round(reps))
      reps = Math.min(targetReps, reps + gain)
      totalSessions++
    }

    const endReps = Math.round(reps * 10) / 10

    // 마일스톤 체크
    let milestone: string | undefined
    for (const ms of milestoneList) {
      if (ms.reps > startReps && ms.reps <= endReps && ms.reps <= targetReps && !passedMilestones.has(ms.reps)) {
        passedMilestones.add(ms.reps)
        milestone = ms.label
        milestones.push({ reps: ms.reps, week, label: ms.label })
      }
    }

    weeklyPlan.push({
      week,
      startReps: Math.round(startReps),
      endReps: Math.round(endReps),
      sessions: sessionsThisWeek,
      milestone,
    })
  }

  // 예상 달성일
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + week * 7)

  return {
    track,
    currentReps: Math.round(currentReps),
    targetReps,
    daysPerWeek,
    totalWeeks: week,
    totalSessions,
    estimatedDate: formatDate(estimatedDate),
    avgGainPerSession: Math.round(avgGain * 10) / 10,
    weeklyPlan,
    milestones,
  }
}

// "주 N회로 바꾸면?" 비교 계산
export function compareFrequencies(
  track: TrackType,
  currentReps: number,
  targetReps: number,
  rpeRatio: { easy: number; moderate: number; hard: number }
): { daysPerWeek: number; weeks: number }[] {
  return [3, 4, 5, 6].map((daysPerWeek) => {
    const plan = calculatePlan(track, currentReps, { track, targetReps, daysPerWeek }, rpeRatio)
    return { daysPerWeek, weeks: plan.totalWeeks }
  })
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
