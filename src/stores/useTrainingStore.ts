import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrackType, RPEFeedback, WorkoutSession, TrackProgress, HeroRank } from '../types'

interface TrainingState {
  // 현재 진행 상태
  trackProgress: Record<TrackType, TrackProgress>
  rank: HeroRank
  totalVolume: number
  streakDays: number

  // 오늘의 운동
  todaysSessions: WorkoutSession[]

  // 액션
  setTrackProgress: (track: TrackType, progress: TrackProgress) => void
  addSession: (session: WorkoutSession) => void
  applyRPE: (track: TrackType, rpe: RPEFeedback) => void
}

const defaultProgress: Record<TrackType, TrackProgress> = {
  push: { track: 'push', currentLevel: 0, currentReps: 10, currentSets: 3 },
  squat: { track: 'squat', currentLevel: 0, currentReps: 10, currentSets: 3 },
  pull: { track: 'pull', currentLevel: 0, currentReps: 5, currentSets: 3 },
  core: { track: 'core', currentLevel: 0, currentReps: 10, currentSets: 3 },
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      trackProgress: defaultProgress,
      rank: 'C',
      totalVolume: 0,
      streakDays: 0,
      todaysSessions: [],

      setTrackProgress: (track, progress) =>
        set((state) => ({
          trackProgress: { ...state.trackProgress, [track]: progress },
        })),

      addSession: (session) =>
        set((state) => ({
          todaysSessions: [...state.todaysSessions, session],
          totalVolume: state.totalVolume + session.totalVolume,
        })),

      applyRPE: (track, rpe) =>
        set((state) => {
          const current = state.trackProgress[track]
          const delta = rpe === 'easy' ? 2 : rpe === 'hard' ? -2 : 0
          return {
            trackProgress: {
              ...state.trackProgress,
              [track]: {
                ...current,
                currentReps: Math.max(1, current.currentReps + delta),
              },
            },
          }
        }),
    }),
    {
      name: 'saitama-training',
      // 액션 함수는 persist에서 제외
      partialize: (state) => ({
        trackProgress: state.trackProgress,
        rank: state.rank,
        totalVolume: state.totalVolume,
        streakDays: state.streakDays,
        todaysSessions: state.todaysSessions,
      }),
    }
  )
)
