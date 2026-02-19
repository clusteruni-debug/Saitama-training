// 운동 트랙 (4갈래)
export type TrackType = 'push' | 'squat' | 'pull' | 'core' | 'run'

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
  bestVolume: number         // 이 레벨에서 최고 총 볼륨 (한 세션)
  bestSeconds: number | null // 이 레벨에서 최단 완료 시간
}

// 프로그레션 축
export type ProgressionAxis = 'volume' | 'speed' | 'difficulty'

// 코치가 제안하는 프로그램 목표
export interface ProgramGoal {
  id: string
  track: TrackType
  axis: ProgressionAxis
  title: string           // "푸시업 20개 도전"
  description: string     // "현재 15개 → 20개로 올려보세요"
  target: number          // 목표 숫자
  current: number         // 현재 수치
  achieved: boolean
  createdAt: string
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
  durationSeconds?: number  // 운동 소요 시간 (초) — 시간 기반 목표 추적용
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

// 트랙별 사용자 목표
export interface TrackGoal {
  track: TrackType
  targetReps: number    // 목표 렙수 (달리기는 분)
  daysPerWeek: number   // 주 몇 회 운동 (1~7)
}

// 운동 목적
export type TrainingPurpose = 'strength' | 'endurance' | 'diet' | 'saitama' | 'health'

// 설정
export interface Settings {
  restTimerSeconds: number  // 기본 60초
  soundEnabled: boolean
}
