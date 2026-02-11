import type { TrackType, Exercise, HeroRank } from '../types'

// 단순하고 기초적인 동작만. 누구나 아는 운동.
// 프로그레션 = 같은 계열 동작의 난이도만 올림.
// 달리기: 사이타마의 매일 10km — reps = 목표 분

const PUSH_TRACK: Exercise[] = [
  { id: 'push-0', track: 'push', level: 0, name: '벽 푸시업', description: '벽에 손 짚고 밀기', reps: 10, sets: 3 },
  { id: 'push-1', track: 'push', level: 1, name: '무릎 푸시업', description: '무릎 대고 팔굽혀펴기', reps: 10, sets: 3 },
  { id: 'push-2', track: 'push', level: 2, name: '푸시업', description: '기본 팔굽혀펴기', reps: 10, sets: 3 },
  { id: 'push-3', track: 'push', level: 3, name: '와이드 푸시업', description: '손 넓게 벌리고 팔굽혀펴기', reps: 10, sets: 3 },
  { id: 'push-4', track: 'push', level: 4, name: '다이아몬드 푸시업', description: '손 모아서 팔굽혀펴기', reps: 8, sets: 3 },
  { id: 'push-5', track: 'push', level: 5, name: '한손 푸시업', description: '한 팔로 팔굽혀펴기', reps: 5, sets: 3 },
]

const SQUAT_TRACK: Exercise[] = [
  { id: 'squat-0', track: 'squat', level: 0, name: '반 스쿼트', description: '반만 앉았다 일어서기', reps: 10, sets: 3 },
  { id: 'squat-1', track: 'squat', level: 1, name: '스쿼트', description: '기본 맨몸 스쿼트', reps: 10, sets: 3 },
  { id: 'squat-2', track: 'squat', level: 2, name: '와이드 스쿼트', description: '다리 넓게 벌리고 스쿼트', reps: 10, sets: 3 },
  { id: 'squat-3', track: 'squat', level: 3, name: '런지', description: '한 발 앞으로 내딛고 앉기', reps: 10, sets: 3 },
  { id: 'squat-4', track: 'squat', level: 4, name: '점프 스쿼트', description: '스쿼트 후 점프', reps: 8, sets: 3 },
  { id: 'squat-5', track: 'squat', level: 5, name: '피스톨 스쿼트', description: '한 다리로 앉았다 일어서기', reps: 5, sets: 3 },
]

// 철봉 있을 때
const PULL_BAR_TRACK: Exercise[] = [
  { id: 'pull-0', track: 'pull', level: 0, name: '매달리기', description: '철봉에 매달려 버티기 (초)', reps: 15, sets: 3 },
  { id: 'pull-1', track: 'pull', level: 1, name: '네거티브 풀업', description: '점프 후 천천히 내려오기', reps: 5, sets: 3 },
  { id: 'pull-2', track: 'pull', level: 2, name: '친업', description: '손바닥 안쪽으로 당기기', reps: 5, sets: 3 },
  { id: 'pull-3', track: 'pull', level: 3, name: '풀업', description: '기본 풀업', reps: 5, sets: 3 },
  { id: 'pull-4', track: 'pull', level: 4, name: '와이드 풀업', description: '넓게 잡고 풀업', reps: 5, sets: 3 },
  { id: 'pull-5', track: 'pull', level: 5, name: '머슬업', description: '풀업 후 몸 위로 올리기', reps: 3, sets: 3 },
]

// 맨몸 (장비 없이) — 정말 기초 동작만
const PULL_HOME_TRACK: Exercise[] = [
  { id: 'pull-0', track: 'pull', level: 0, name: '엎드려 상체 들기', description: '바닥에 엎드려 상체만 들기', reps: 10, sets: 3 },
  { id: 'pull-1', track: 'pull', level: 1, name: '슈퍼맨', description: '엎드려 팔다리 동시에 들기', reps: 10, sets: 3 },
  { id: 'pull-2', track: 'pull', level: 2, name: '슈퍼맨 홀드', description: '팔다리 들고 버티기 (초)', reps: 20, sets: 3 },
  { id: 'pull-3', track: 'pull', level: 3, name: '브릿지', description: '누워서 엉덩이 들기', reps: 15, sets: 3 },
  { id: 'pull-4', track: 'pull', level: 4, name: '한다리 브릿지', description: '한 다리로 엉덩이 들기', reps: 10, sets: 3 },
  { id: 'pull-5', track: 'pull', level: 5, name: '풀 브릿지', description: '손발 짚고 몸 아치로 들기', reps: 5, sets: 3 },
]

const CORE_TRACK: Exercise[] = [
  { id: 'core-0', track: 'core', level: 0, name: '플랭크', description: '팔꿈치 짚고 버티기 (초)', reps: 20, sets: 3 },
  { id: 'core-1', track: 'core', level: 1, name: '크런치', description: '누워서 상체 살짝 들기', reps: 15, sets: 3 },
  { id: 'core-2', track: 'core', level: 2, name: '레그레이즈', description: '누워서 다리 들기', reps: 10, sets: 3 },
  { id: 'core-3', track: 'core', level: 3, name: '마운틴 클라이머', description: '푸시업 자세에서 무릎 당기기', reps: 20, sets: 3 },
  { id: 'core-4', track: 'core', level: 4, name: 'V-up', description: '누워서 몸 V자로 접기', reps: 10, sets: 3 },
  { id: 'core-5', track: 'core', level: 5, name: '드래곤 플래그', description: '어깨만 대고 몸 일직선 들기', reps: 5, sets: 3 },
]

const RUN_TRACK: Exercise[] = [
  { id: 'run-0', track: 'run', level: 0, name: '걷기', description: '빠르게 걷기', reps: 10, sets: 1 },
  { id: 'run-1', track: 'run', level: 1, name: '걷기 + 조깅', description: '2분 걷기, 1분 조깅 반복', reps: 15, sets: 1 },
  { id: 'run-2', track: 'run', level: 2, name: '가벼운 조깅', description: '천천히 꾸준히 달리기', reps: 20, sets: 1 },
  { id: 'run-3', track: 'run', level: 3, name: '조깅', description: '편한 속도로 조깅', reps: 25, sets: 1 },
  { id: 'run-4', track: 'run', level: 4, name: '달리기', description: '좀 더 빠르게 달리기', reps: 30, sets: 1 },
  { id: 'run-5', track: 'run', level: 5, name: '10km 달리기', description: '사이타마처럼 매일 10km', reps: 45, sets: 1 },
]

export const PROGRESSION_TREE: Record<TrackType, Exercise[]> = {
  push: PUSH_TRACK,
  squat: SQUAT_TRACK,
  pull: PULL_BAR_TRACK,
  core: CORE_TRACK,
  run: RUN_TRACK,
}

export const PROGRESSION_TREE_HOME: Record<TrackType, Exercise[]> = {
  push: PUSH_TRACK,
  squat: SQUAT_TRACK,
  pull: PULL_HOME_TRACK,
  core: CORE_TRACK,
  run: RUN_TRACK,
}

// 볼륨 프로그레션: RPE별 렙 증가량
export const RPE_DELTA = { easy: 3, moderate: 1, hard: -1 } as const

// 사이타마 최종 목표 (각 트랙 목표 렙수/분)
export const SAITAMA_GOALS: Record<TrackType, number> = {
  push: 100,   // 푸시업 100개
  squat: 100,  // 스쿼트 100개
  pull: 50,    // 풀업 50개 (이미 대단)
  core: 100,   // 윗몸일으키기 100개
  run: 60,     // 60분 (약 10km)
}

// 난이도 레벨업 제안 기준 (렙수 + easy 연속)
export const DIFFICULTY_UP_THRESHOLD = { minReps: 50, consecutiveEasy: 5 }

export const RANK_THRESHOLDS: Record<HeroRank, { minVolume: number; minAvgLevel: number }> = {
  C: { minVolume: 0, minAvgLevel: 0 },
  B: { minVolume: 5000, minAvgLevel: 1 },
  A: { minVolume: 20000, minAvgLevel: 3 },
  S: { minVolume: 100000, minAvgLevel: 5 },
}

export const TRACK_INFO: Record<TrackType, { label: string; emoji: string; color: string }> = {
  push: { label: '푸시', emoji: '💪', color: '#ef4444' },
  squat: { label: '스쿼트', emoji: '🦵', color: '#3b82f6' },
  pull: { label: '당기기', emoji: '🔙', color: '#8b5cf6' },
  core: { label: '코어', emoji: '🔥', color: '#f59e0b' },
  run: { label: '달리기', emoji: '🏃', color: '#10b981' },
}

export function getTree(hasPullUpBar: boolean): Record<TrackType, Exercise[]> {
  return hasPullUpBar ? PROGRESSION_TREE : PROGRESSION_TREE_HOME
}

export function getExerciseForTrack(track: TrackType, level: number, hasPullUpBar: boolean): Exercise {
  const tree = getTree(hasPullUpBar)
  const exercises = tree[track]
  return exercises[Math.min(level, exercises.length - 1)]
}

// 시간 기반 운동 (플랭크, 매달리기, 슈퍼맨 홀드, 달리기 전체)
export function isTimeBased(exerciseId: string, hasPullUpBar: boolean): boolean {
  // 달리기 트랙 전체는 분 단위 시간 기반
  if (exerciseId.startsWith('run-')) return true
  const timeIds = ['core-0'] // 플랭크
  if (hasPullUpBar) {
    timeIds.push('pull-0') // 매달리기
  } else {
    timeIds.push('pull-2') // 슈퍼맨 홀드
  }
  return timeIds.includes(exerciseId)
}

// 달리기 트랙인지 확인 (분 단위)
export function isRunTrack(exerciseId: string): boolean {
  return exerciseId.startsWith('run-')
}

// 4대 근력 트랙 (달리기 제외)
export const STRENGTH_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']
