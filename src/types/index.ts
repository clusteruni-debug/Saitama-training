// 운동 트랙 (4갈래)
export type TrackType = 'push' | 'squat' | 'pull' | 'core'

// RPE 피드백 (운동 후 난이도 평가)
export type RPEFeedback = 'easy' | 'moderate' | 'hard'

// 히어로 랭크
export type HeroRank = 'C' | 'B' | 'A' | 'S'

// 프로그레션 단계 (동작 변형)
export interface Exercise {
  id: string
  track: TrackType
  level: number       // 0부터 시작
  name: string        // 예: "무릎 푸시업"
  description: string
  reps: number        // 기본 목표 횟수
  sets: number        // 기본 세트 수
}

// 사용자의 트랙별 진행 상태
export interface TrackProgress {
  track: TrackType
  currentLevel: number  // 현재 동작 레벨
  currentReps: number   // 현재 목표 횟수
  currentSets: number   // 현재 세트 수
}

// 세트 기록
export interface SetRecord {
  setNumber: number
  reps: number
  completed: boolean
}

// 운동 세션 기록
export interface WorkoutSession {
  id: string
  userId: string
  date: string          // YYYY-MM-DD
  track: TrackType
  exerciseId: string
  level: number
  sets: SetRecord[]
  rpe: RPEFeedback | null
  totalVolume: number   // 총 수행량 (세트 * 횟수)
  createdAt: string
}

// 사용자 프로필
export interface UserProfile {
  id: string
  displayName: string
  rank: HeroRank
  totalVolume: number   // 누적 총 볼륨
  streakDays: number    // 연속 운동 일수
  trackProgress: Record<TrackType, TrackProgress>
  createdAt: string
}
