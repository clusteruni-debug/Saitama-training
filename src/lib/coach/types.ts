import type { TrackType, WorkoutSession, TrackProgress, ProgramGoal } from '../../types'

// 홈 화면에 표시되는 코치 메시지
export interface CoachTip {
  type: 'program' | 'personal-best' | 'streak' | 'saitama' | 'level-up-suggest'
    | 'deload-suggest' | 'overtraining-warning' | 'plateau-warning'
  message: string
  track?: TrackType
  action?: 'level-up' // UI에서 레벨업 버튼 표시
  priority: number
}

export interface AnalysisInput {
  trackProgress: Record<TrackType, TrackProgress>
  sessions: Record<string, WorkoutSession[]>
  consecutiveEasy: Record<TrackType, number>
  streakDays: number
  totalVolume: number
  activeTracks: TrackType[]
  programs: ProgramGoal[]
}
