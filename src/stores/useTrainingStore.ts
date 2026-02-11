import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrackType, RPEFeedback, WorkoutSession, TrackProgress, HeroRank, Settings } from '../types'
import { LEVEL_UP_THRESHOLD, RANK_THRESHOLDS, PROGRESSION_TREE } from '../data/progression-data'

// 날짜 유틸
function getLocalDateStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

interface TrainingState {
  // 현재 진행 상태
  trackProgress: Record<TrackType, TrackProgress>
  rank: HeroRank
  totalVolume: number
  streakDays: number

  // 운동 히스토리 (날짜별)
  sessions: Record<string, WorkoutSession[]>

  // 레벨업 연속 easy 카운트
  consecutiveEasy: Record<TrackType, number>

  // 설정
  settings: Settings

  // 마지막 운동 날짜 (스트릭 계산)
  lastWorkoutDate: string | null

  // 액션
  setTrackProgress: (track: TrackType, progress: TrackProgress) => void
  completeWorkout: (track: TrackType, sets: { reps: number; completed: boolean }[], rpe: RPEFeedback) => void
  checkAndLevelUp: (track: TrackType) => boolean
  calculateRank: () => HeroRank
  updateStreak: () => void
  updateSettings: (partial: Partial<Settings>) => void
  getTodaySessions: () => WorkoutSession[]
  isTrackCompletedToday: (track: TrackType) => boolean
}

const defaultProgress: Record<TrackType, TrackProgress> = {
  push: { track: 'push', currentLevel: 0, currentReps: 10, currentSets: 3 },
  squat: { track: 'squat', currentLevel: 0, currentReps: 10, currentSets: 3 },
  pull: { track: 'pull', currentLevel: 0, currentReps: 5, currentSets: 3 },
  core: { track: 'core', currentLevel: 0, currentReps: 10, currentSets: 3 },
}

const defaultConsecutiveEasy: Record<TrackType, number> = {
  push: 0, squat: 0, pull: 0, core: 0,
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      trackProgress: defaultProgress,
      rank: 'C',
      totalVolume: 0,
      streakDays: 0,
      sessions: {},
      consecutiveEasy: defaultConsecutiveEasy,
      settings: { restTimerSeconds: 60, soundEnabled: true },
      lastWorkoutDate: null,

      setTrackProgress: (track, progress) =>
        set((state) => ({
          trackProgress: { ...state.trackProgress, [track]: progress },
        })),

      completeWorkout: (track, sets, rpe) => {
        const state = get()
        const today = getLocalDateStr()
        const progress = state.trackProgress[track]
        const volume = sets.reduce((sum, s) => sum + (s.completed ? s.reps : 0), 0)

        // 세션 기록 생성
        const session: WorkoutSession = {
          id: crypto.randomUUID(),
          userId: 'local',
          date: today,
          track,
          exerciseId: `${track}-${progress.currentLevel}`,
          level: progress.currentLevel,
          sets: sets.map((s, i) => ({ setNumber: i + 1, reps: s.reps, completed: s.completed })),
          rpe,
          totalVolume: volume,
          createdAt: new Date().toISOString(),
        }

        // RPE에 따른 렙수 조정
        const rpeDelta = rpe === 'easy' ? 2 : rpe === 'hard' ? -2 : 0
        const newReps = Math.max(1, progress.currentReps + rpeDelta)

        // easy 연속 카운트
        const newConsecutiveEasy = { ...state.consecutiveEasy }
        if (rpe === 'easy') {
          newConsecutiveEasy[track] = (newConsecutiveEasy[track] || 0) + 1
        } else {
          newConsecutiveEasy[track] = 0
        }

        // 세션 추가
        const daySessions = [...(state.sessions[today] || []), session]

        set({
          sessions: { ...state.sessions, [today]: daySessions },
          totalVolume: state.totalVolume + volume,
          trackProgress: {
            ...state.trackProgress,
            [track]: { ...progress, currentReps: newReps },
          },
          consecutiveEasy: newConsecutiveEasy,
          lastWorkoutDate: today,
        })

        // 레벨업 체크
        get().checkAndLevelUp(track)

        // 스트릭 갱신
        get().updateStreak()

        // 랭크 재계산
        const newRank = get().calculateRank()
        if (newRank !== state.rank) {
          set({ rank: newRank })
        }
      },

      checkAndLevelUp: (track) => {
        const state = get()
        const progress = state.trackProgress[track]
        const maxLevel = PROGRESSION_TREE[track].length - 1
        const easyCount = state.consecutiveEasy[track]

        // 목표 렙수 도달 + easy 연속 달성 → 레벨업
        if (
          progress.currentReps >= LEVEL_UP_THRESHOLD.targetReps &&
          easyCount >= LEVEL_UP_THRESHOLD.consecutiveEasy &&
          progress.currentLevel < maxLevel
        ) {
          const nextExercise = PROGRESSION_TREE[track][progress.currentLevel + 1]
          set({
            trackProgress: {
              ...state.trackProgress,
              [track]: {
                ...progress,
                currentLevel: progress.currentLevel + 1,
                currentReps: nextExercise.reps,
              },
            },
            consecutiveEasy: { ...state.consecutiveEasy, [track]: 0 },
          })
          return true
        }
        return false
      },

      calculateRank: (): HeroRank => {
        const state = get()
        const avgLevel = (['push', 'squat', 'pull', 'core'] as TrackType[])
          .reduce((sum, t) => sum + state.trackProgress[t].currentLevel, 0) / 4

        // 높은 랭크부터 체크
        const ranks: HeroRank[] = ['S', 'A', 'B', 'C']
        for (const rank of ranks) {
          const threshold = RANK_THRESHOLDS[rank]
          if (state.totalVolume >= threshold.minVolume && avgLevel >= threshold.minAvgLevel) {
            return rank
          }
        }
        return 'C'
      },

      updateStreak: () => {
        const state = get()
        const today = getLocalDateStr()
        const lastDate = state.lastWorkoutDate

        if (!lastDate) {
          set({ streakDays: 1 })
          return
        }

        if (lastDate === today) return // 이미 오늘 운동함

        // 어제인지 확인
        const last = new Date(lastDate)
        const now = new Date(today)
        const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          set({ streakDays: state.streakDays + 1 })
        } else if (diffDays > 1) {
          set({ streakDays: 1 }) // 리셋
        }
      },

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      getTodaySessions: () => {
        const state = get()
        return state.sessions[getLocalDateStr()] || []
      },

      isTrackCompletedToday: (track) => {
        const state = get()
        const today = getLocalDateStr()
        const todaySessions = state.sessions[today] || []
        return todaySessions.some((s) => s.track === track)
      },
    }),
    {
      name: 'saitama-training',
      partialize: (state) => ({
        trackProgress: state.trackProgress,
        rank: state.rank,
        totalVolume: state.totalVolume,
        streakDays: state.streakDays,
        sessions: state.sessions,
        consecutiveEasy: state.consecutiveEasy,
        settings: state.settings,
        lastWorkoutDate: state.lastWorkoutDate,
      }),
    }
  )
)
