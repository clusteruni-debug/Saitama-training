import type { TrackType, Exercise, HeroRank } from '../types'

// 4트랙 x 6레벨 = 24개 운동 정의
export const PROGRESSION_TREE: Record<TrackType, Exercise[]> = {
  push: [
    { id: 'push-0', track: 'push', level: 0, name: '무릎 푸시업', description: '무릎을 대고 팔굽혀펴기', reps: 10, sets: 3 },
    { id: 'push-1', track: 'push', level: 1, name: '일반 푸시업', description: '기본 팔굽혀펴기', reps: 10, sets: 3 },
    { id: 'push-2', track: 'push', level: 2, name: '다이아몬드 푸시업', description: '손을 모아서 팔굽혀펴기', reps: 8, sets: 3 },
    { id: 'push-3', track: 'push', level: 3, name: '디클라인 푸시업', description: '발을 높은 곳에 올리고 팔굽혀펴기', reps: 8, sets: 3 },
    { id: 'push-4', track: 'push', level: 4, name: '아처 푸시업', description: '한쪽 팔을 옆으로 뻗으며 팔굽혀펴기', reps: 6, sets: 3 },
    { id: 'push-5', track: 'push', level: 5, name: '한손 푸시업', description: '한 팔로 팔굽혀펴기 (사이타마 레벨)', reps: 5, sets: 3 },
  ],
  squat: [
    { id: 'squat-0', track: 'squat', level: 0, name: '어시스트 스쿼트', description: '의자/벽 잡고 스쿼트', reps: 10, sets: 3 },
    { id: 'squat-1', track: 'squat', level: 1, name: '일반 스쿼트', description: '기본 맨몸 스쿼트', reps: 10, sets: 3 },
    { id: 'squat-2', track: 'squat', level: 2, name: '와이드 스쿼트', description: '넓은 자세로 스쿼트', reps: 10, sets: 3 },
    { id: 'squat-3', track: 'squat', level: 3, name: '점프 스쿼트', description: '점프하며 스쿼트', reps: 8, sets: 3 },
    { id: 'squat-4', track: 'squat', level: 4, name: '불가리안 스플릿', description: '한 발을 뒤에 올리고 스쿼트', reps: 8, sets: 3 },
    { id: 'squat-5', track: 'squat', level: 5, name: '피스톨 스쿼트', description: '한 다리로 스쿼트 (사이타마 레벨)', reps: 5, sets: 3 },
  ],
  pull: [
    { id: 'pull-0', track: 'pull', level: 0, name: '인버티드 로우', description: '테이블 아래에서 당기기', reps: 5, sets: 3 },
    { id: 'pull-1', track: 'pull', level: 1, name: '네거티브 풀업', description: '천천히 내려오기만 하는 풀업', reps: 5, sets: 3 },
    { id: 'pull-2', track: 'pull', level: 2, name: '친업', description: '손바닥 안쪽으로 당기기', reps: 5, sets: 3 },
    { id: 'pull-3', track: 'pull', level: 3, name: '풀업', description: '기본 풀업', reps: 5, sets: 3 },
    { id: 'pull-4', track: 'pull', level: 4, name: '와이드 풀업', description: '넓은 그립 풀업', reps: 5, sets: 3 },
    { id: 'pull-5', track: 'pull', level: 5, name: '머슬업', description: '풀업 후 팔꿈치 위로 (사이타마 레벨)', reps: 3, sets: 3 },
  ],
  core: [
    { id: 'core-0', track: 'core', level: 0, name: '플랭크', description: '버티기 (초 단위)', reps: 20, sets: 3 },
    { id: 'core-1', track: 'core', level: 1, name: '크런치', description: '상체 들어올리기', reps: 15, sets: 3 },
    { id: 'core-2', track: 'core', level: 2, name: '레그레이즈', description: '누워서 다리 들어올리기', reps: 10, sets: 3 },
    { id: 'core-3', track: 'core', level: 3, name: '행잉 레그레이즈', description: '매달려서 다리 들어올리기', reps: 8, sets: 3 },
    { id: 'core-4', track: 'core', level: 4, name: 'L-sit', description: '공중에서 L자 버티기 (초 단위)', reps: 15, sets: 3 },
    { id: 'core-5', track: 'core', level: 5, name: '드래곤 플래그', description: '벤치에서 몸 일직선 들기 (사이타마 레벨)', reps: 5, sets: 3 },
  ],
}

// 레벨업 조건
export const LEVEL_UP_THRESHOLD = { targetReps: 20, consecutiveEasy: 3 }

// 랭크 기준
export const RANK_THRESHOLDS: Record<HeroRank, { minVolume: number; minAvgLevel: number }> = {
  C: { minVolume: 0, minAvgLevel: 0 },
  B: { minVolume: 5000, minAvgLevel: 1 },
  A: { minVolume: 20000, minAvgLevel: 3 },
  S: { minVolume: 100000, minAvgLevel: 5 },
}

// 트랙 표시 정보
export const TRACK_INFO: Record<TrackType, { label: string; emoji: string; color: string }> = {
  push: { label: '푸시', emoji: '💪', color: '#ef4444' },
  squat: { label: '스쿼트', emoji: '🦵', color: '#3b82f6' },
  pull: { label: '풀', emoji: '🏋️', color: '#8b5cf6' },
  core: { label: '코어', emoji: '🔥', color: '#f59e0b' },
}

// 현재 트랙의 운동 가져오기
export function getExerciseForTrack(track: TrackType, level: number): Exercise {
  const exercises = PROGRESSION_TREE[track]
  const clampedLevel = Math.min(level, exercises.length - 1)
  return exercises[clampedLevel]
}

// 시간 기반 운동인지 확인 (플랭크, L-sit 등)
export function isTimeBased(exerciseId: string): boolean {
  return ['core-0', 'core-4'].includes(exerciseId)
}
