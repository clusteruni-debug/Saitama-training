import type { TrackType, WorkoutSession, TrackProgress, ProgramGoal } from '../types'
import { STRENGTH_TRACKS, TRACK_INFO, SAITAMA_GOALS, LEVEL_UP_CRITERIA, VOLUME_CAP } from '../data/progression-data'

// ─── 스마트 코치: 3축 프로그레션 프로그램 생성 ────────────────

// 홈 화면에 표시되는 코치 메시지
export interface CoachTip {
  type: 'program' | 'personal-best' | 'streak' | 'saitama' | 'level-up-suggest'
    | 'deload-suggest' | 'overtraining-warning' | 'plateau-warning'
  message: string
  track?: TrackType
  action?: 'level-up' // UI에서 레벨업 버튼 표시
  priority: number
}

interface AnalysisInput {
  trackProgress: Record<TrackType, TrackProgress>
  sessions: Record<string, WorkoutSession[]>
  consecutiveEasy: Record<TrackType, number>
  streakDays: number
  totalVolume: number
  activeTracks: TrackType[]
  programs: ProgramGoal[]
}

// ─── 프로그램 생성 ────────────────────────────────────────

export function generatePrograms(input: AnalysisInput): ProgramGoal[] {
  const goals: ProgramGoal[] = []
  const now = new Date().toISOString()

  for (const track of input.activeTracks) {
    const progress = input.trackProgress[track]
    const saitamaTarget = SAITAMA_GOALS[track]
    const info = TRACK_INFO[track]

    // 이미 달성 안된 기존 프로그램이 있으면 스킵
    const existing = input.programs.find((p) => p.track === track && !p.achieved)
    if (existing) continue

    // 1. 볼륨 목표 (기본): 현재 렙수 + 5~10 단위 목표
    const nextVolumeTarget = getNextVolumeTarget(progress.currentReps, saitamaTarget)
    if (nextVolumeTarget > progress.currentReps) {
      goals.push({
        id: `vol-${track}-${nextVolumeTarget}`,
        track,
        axis: 'volume',
        title: `${info.label} ${nextVolumeTarget}${track === 'run' ? '분' : '개'} 도전`,
        description: `현재 ${progress.currentReps} → ${nextVolumeTarget}으로! RPE easy를 받으면 +10%씩 올라가요.`,
        target: nextVolumeTarget,
        current: progress.currentReps,
        achieved: false,
        createdAt: now,
      })
      continue
    }

    // 2. 속도 목표: 볼륨이 높으면 속도 챌린지
    if (progress.bestSeconds && progress.currentReps >= 20) {
      const speedTarget = Math.round(progress.bestSeconds * 0.9) // 10% 빠르게
      goals.push({
        id: `spd-${track}-${speedTarget}`,
        track,
        axis: 'speed',
        title: `${info.label} 속도 챌린지`,
        description: `같은 운동을 ${formatSeconds(speedTarget)} 안에 끝내기! (최고: ${formatSeconds(progress.bestSeconds)})`,
        target: speedTarget,
        current: progress.bestSeconds,
        achieved: false,
        createdAt: now,
      })
      continue
    }

    // 3. 사이타마 목표 도달
    if (progress.currentReps >= saitamaTarget) {
      goals.push({
        id: `saitama-${track}`,
        track,
        axis: 'volume',
        title: `${info.emoji} 사이타마 달성!`,
        description: `${info.label} ${saitamaTarget}${track === 'run' ? '분' : '개'} 클리어! 더 높은 목표를 세우거나 동작 난이도를 올려보세요.`,
        target: saitamaTarget,
        current: progress.currentReps,
        achieved: true,
        createdAt: now,
      })
    }
  }

  return goals
}

// 다음 볼륨 목표 계산: 5개 단위로 올라가되, 마일스톤(20, 30, 50, 100)은 특별 표시
function getNextVolumeTarget(current: number, saitamaGoal: number): number {
  const milestones = [10, 15, 20, 25, 30, 40, 50, 60, 75, 100]
  for (const m of milestones) {
    if (m > current && m <= saitamaGoal) return m
  }
  // 마일스톤 넘었으면 +10 단위
  const next = Math.ceil((current + 1) / 10) * 10
  return Math.min(next, saitamaGoal)
}

// ─── 코치 팁 생성 ─────────────────────────────────────────

export function generateCoachTips(input: AnalysisInput): CoachTip[] {
  const tips: CoachTip[] = []

  // 1. 난이도 레벨업 제안 (트랙/레벨별 기준)
  for (const track of input.activeTracks) {
    const progress = input.trackProgress[track]
    const easyCount = input.consecutiveEasy[track] || 0
    const criteria = LEVEL_UP_CRITERIA[track]?.[progress.currentLevel]
    if (
      criteria &&
      progress.currentReps >= criteria.minReps &&
      easyCount >= criteria.consecutiveEasy &&
      progress.currentLevel < 5
    ) {
      const info = TRACK_INFO[track]
      tips.push({
        type: 'level-up-suggest',
        message: `${info.emoji} ${info.label}: ${progress.currentReps}개를 easy로 하고 있어요. 다음 동작으로 넘어갈 준비 됐어요!`,
        track,
        action: 'level-up',
        priority: 10,
      })
    }
  }

  // 2. 활성 프로그램 진행률
  const activePrograms = input.programs.filter((p) => !p.achieved)
  for (const p of activePrograms.slice(0, 2)) {
    const info = TRACK_INFO[p.track]
    const pct = p.axis === 'speed'
      ? Math.round((1 - (p.current - p.target) / p.current) * 100)
      : Math.round((p.current / p.target) * 100)
    tips.push({
      type: 'program',
      message: `${info.emoji} ${p.title} — ${Math.min(100, pct)}% 진행 중`,
      track: p.track,
      priority: 8,
    })
  }

  // 3. 개인 최고 기록 축하 (최근 세션에서)
  const recent = getRecentSessions(input.sessions, 1)
  for (const session of recent) {
    const progress = input.trackProgress[session.track]
    if (session.totalVolume >= (progress.bestVolume || 0) && session.totalVolume > 0) {
      const info = TRACK_INFO[session.track]
      tips.push({
        type: 'personal-best',
        message: `${info.emoji} ${info.label}: 개인 최고 볼륨 ${session.totalVolume}! 💥`,
        track: session.track,
        priority: 9,
      })
    }
  }

  // 4. 스트릭
  if (input.streakDays >= 7 && input.streakDays % 7 === 0) {
    tips.push({
      type: 'streak',
      message: `🔥 ${input.streakDays}일 연속! 사이타마처럼 매일 하고 있어!`,
      priority: 7,
    })
  } else if (input.streakDays >= 3) {
    tips.push({
      type: 'streak',
      message: `🔥 ${input.streakDays}일 연속 훈련 중!`,
      priority: 4,
    })
  }

  // 5. 사이타마 진행률 (전체)
  const saitamaPct = getSaitamaProgress(input.trackProgress, input.activeTracks)
  if (saitamaPct >= 50 && saitamaPct < 100) {
    tips.push({
      type: 'saitama',
      message: `사이타마 루틴 ${saitamaPct}% 달성! 반 넘었다!`,
      priority: 6,
    })
  } else if (saitamaPct >= 100) {
    tips.push({
      type: 'saitama',
      message: `🏆 사이타마 루틴 완성! 넌 이미 S급 히어로야!`,
      priority: 10,
    })
  }

  // 6. 과훈련 경고 — 최근 5세션 중 hard 3회 이상
  const recent5 = getRecentSessions(input.sessions, 5)
  if (recent5.length >= 3) {
    const hardCount = recent5.filter((s) => s.rpe === 'hard').length
    const recent3 = getRecentSessions(input.sessions, 3)
    const recent3AllHard = recent3.length >= 3 && recent3.every((s) => s.rpe === 'hard')

    if (recent3AllHard) {
      tips.push({
        type: 'overtraining-warning',
        message: '⚠️ 최근 3세션 연속 "힘들었다"! 과훈련 징후예요. 하루 쉬거나 볼륨을 줄이세요.',
        priority: 11,
      })
    } else if (hardCount >= 3) {
      tips.push({
        type: 'overtraining-warning',
        message: '⚠️ 최근 5세션 중 3회 이상 "힘들었다". 피로가 쌓이고 있어요.',
        priority: 9,
      })
    }
  }

  // 7. 디로드 주기 제안 — 14일 이상 연속 운동 + hard 비율 > 30%
  // 근거: Schoenfeld & Grgic (2019) — 3~4주마다 디로드 권장
  const recent21 = getRecentSessions(input.sessions, 21)
  if (recent21.length >= 14) {
    const hardRatio = recent21.filter((s) => s.rpe === 'hard').length / recent21.length
    const easyRatio = recent21.filter((s) => s.rpe === 'easy').length / recent21.length

    if (hardRatio > 0.3 || easyRatio < 0.2) {
      tips.push({
        type: 'deload-suggest',
        message: '💛 이번 주는 가볍게! 디로드 주간을 추천해요. 평소 볼륨의 50%로 회복하세요.',
        priority: 10,
      })
    }
  }

  // 8. 정체 감지 — 같은 레벨 14일 이상 + moderate만 반복 또는 볼륨 캡 도달
  for (const track of input.activeTracks) {
    const progress = input.trackProgress[track]
    const trackSessions14 = getRecentSessions(input.sessions, 14).filter((s) => s.track === track)
    const cap = VOLUME_CAP[track]?.[progress.currentLevel] ?? 100
    const info = TRACK_INFO[track]

    // 볼륨 캡 도달했는데 레벨업 안 함
    if (progress.currentReps >= cap && progress.currentLevel < 5) {
      tips.push({
        type: 'plateau-warning',
        message: `${info.emoji} ${info.label}: 볼륨 캡(${cap})에 도달! 다음 동작으로 레벨업하세요.`,
        track,
        action: 'level-up',
        priority: 10,
      })
    }
    // 14일간 세션 있는데 moderate만 반복 (성장 정체)
    else if (
      trackSessions14.length >= 5 &&
      trackSessions14.every((s) => s.rpe === 'moderate') &&
      progress.currentLevel < 5
    ) {
      tips.push({
        type: 'plateau-warning',
        message: `${info.emoji} ${info.label}: 계속 "적당하다"만 나와요. 자세를 점검하거나 강도를 높여보세요.`,
        track,
        priority: 7,
      })
    }
  }

  // 9. 트랙 밸런스
  const recentWeek = getRecentSessions(input.sessions, 7)
  if (recentWeek.length >= 3) {
    const trackCounts: Partial<Record<TrackType, number>> = {}
    for (const s of recentWeek) trackCounts[s.track] = (trackCounts[s.track] || 0) + 1
    const neglected = input.activeTracks.filter((t) => !trackCounts[t])
    if (neglected.length > 0) {
      const info = TRACK_INFO[neglected[0]]
      tips.push({
        type: 'program',
        message: `${info.emoji} ${info.label}을 최근 안 했어요. 오늘 해보는 건?`,
        track: neglected[0],
        priority: 5,
      })
    }
  }

  return tips.sort((a, b) => b.priority - a.priority).slice(0, 5)
}

// ─── 사이타마 진행률 ─────────────────────────────────────

export function getSaitamaProgress(
  trackProgress: Record<TrackType, TrackProgress>,
  activeTracks: TrackType[]
): number {
  const tracks = activeTracks.length > 0 ? activeTracks : [...STRENGTH_TRACKS, 'run' as TrackType]
  const total = tracks.reduce((sum, t) => {
    const target = SAITAMA_GOALS[t]
    const current = trackProgress[t]?.currentReps || 0
    return sum + Math.min(1, current / target)
  }, 0)
  return Math.round((total / tracks.length) * 100)
}

// ─── 스마트 휴식 시간 (NSCA 가이드라인) ───────────────────
// 근력(1-5 reps): 120-180초, 근비대(6-12): 60-90초, 근지구력(13+): 30-60초

export function suggestRestSeconds(reps: number, track: TrackType): number {
  void track
  if (reps <= 5) return 120
  if (reps <= 12) return 75
  if (reps <= 20) return 60
  return 45
}

// ─── 유틸 ─────────────────────────────────────────────────

function getRecentSessions(sessions: Record<string, WorkoutSession[]>, days: number): WorkoutSession[] {
  const result: WorkoutSession[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (sessions[key]) result.push(...sessions[key])
  }
  return result
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}초`
  if (s === 0) return `${m}분`
  return `${m}분 ${s}초`
}
