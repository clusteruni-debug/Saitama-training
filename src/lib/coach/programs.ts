import type { ProgramGoal } from '../../types'
import { SAITAMA_GOALS, TRACK_INFO } from '../../data/progression-data'
import type { AnalysisInput } from './types'
import { formatSeconds } from './utils'

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
