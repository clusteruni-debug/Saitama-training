import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrackType, RPEFeedback, WorkoutSession, TrackProgress, HeroRank, Settings, ProgramGoal, TrackGoal, TrainingPurpose } from '../types'
import { RPE_DELTA, RANK_THRESHOLDS, getTree, STRENGTH_TRACKS, SAITAMA_GOALS } from '../data/progression-data'

// 날짜 유틸
function getLocalDateStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

interface TrainingState {
  // 온보딩
  onboardingCompleted: boolean
  hasPullUpBar: boolean

  // 개인화
  nickname: string
  trainingPurpose: TrainingPurpose
  targetDate: string | null  // YYYY-MM-DD 목표 달성 기한

  // 오늘 할 트랙 선택
  activeTracks: TrackType[]

  // 현재 진행 상태
  trackProgress: Record<TrackType, TrackProgress>
  rank: HeroRank
  totalVolume: number
  streakDays: number
  maxStreakDays: number

  // 운동 히스토리 (날짜별)
  sessions: Record<string, WorkoutSession[]>

  // 레벨업 연속 easy 카운트
  consecutiveEasy: Record<TrackType, number>

  // 코치 프로그램 (자동 생성)
  programs: ProgramGoal[]

  // 사용자 목표 (트랙별)
  trackGoals: Record<TrackType, TrackGoal>

  // 설정
  settings: Settings

  // 마지막 운동 날짜 (스트릭 계산)
  lastWorkoutDate: string | null

  // 액션
  completeOnboarding: (levels: Record<TrackType, number>, hasPullUpBar: boolean, nickname?: string, purpose?: TrainingPurpose, targetDate?: string) => void
  setNickname: (name: string) => void
  setTrainingPurpose: (purpose: TrainingPurpose) => void
  setTargetDate: (date: string | null) => void
  setTrackProgress: (track: TrackType, progress: TrackProgress) => void
  toggleActiveTrack: (track: TrackType) => void
  completeWorkout: (track: TrackType, sets: { reps: number; completed: boolean }[], rpe: RPEFeedback, durationSeconds?: number) => void
  levelUp: (track: TrackType) => boolean
  calculateRank: () => HeroRank
  updateStreak: () => void
  updateSettings: (partial: Partial<Settings>) => void
  setHasPullUpBar: (v: boolean) => void
  setPrograms: (programs: ProgramGoal[]) => void
  setTrackGoal: (track: TrackType, goal: Partial<TrackGoal>) => void
  getTodaySessions: () => WorkoutSession[]
  isTrackCompletedToday: (track: TrackType) => boolean
  resetAllData: () => void
}

const defaultProgress: Record<TrackType, TrackProgress> = {
  push: { track: 'push', currentLevel: 0, currentReps: 10, currentSets: 3, bestVolume: 0, bestSeconds: null },
  squat: { track: 'squat', currentLevel: 0, currentReps: 10, currentSets: 3, bestVolume: 0, bestSeconds: null },
  pull: { track: 'pull', currentLevel: 0, currentReps: 5, currentSets: 3, bestVolume: 0, bestSeconds: null },
  core: { track: 'core', currentLevel: 0, currentReps: 10, currentSets: 3, bestVolume: 0, bestSeconds: null },
  run: { track: 'run', currentLevel: 0, currentReps: 10, currentSets: 1, bestVolume: 0, bestSeconds: null },
}

const defaultConsecutiveEasy: Record<TrackType, number> = {
  push: 0, squat: 0, pull: 0, core: 0, run: 0,
}

const defaultTrackGoals: Record<TrackType, TrackGoal> = {
  push: { track: 'push', targetReps: SAITAMA_GOALS.push, daysPerWeek: 3 },
  squat: { track: 'squat', targetReps: SAITAMA_GOALS.squat, daysPerWeek: 3 },
  pull: { track: 'pull', targetReps: SAITAMA_GOALS.pull, daysPerWeek: 3 },
  core: { track: 'core', targetReps: SAITAMA_GOALS.core, daysPerWeek: 3 },
  run: { track: 'run', targetReps: SAITAMA_GOALS.run, daysPerWeek: 3 },
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      onboardingCompleted: false,
      hasPullUpBar: false,
      nickname: '',
      trainingPurpose: 'saitama' as TrainingPurpose,
      targetDate: null,
      activeTracks: ['push', 'squat', 'pull', 'core', 'run'],
      trackProgress: defaultProgress,
      rank: 'C',
      totalVolume: 0,
      streakDays: 0,
      maxStreakDays: 0,
      sessions: {},
      consecutiveEasy: defaultConsecutiveEasy,
      programs: [],
      trackGoals: defaultTrackGoals,
      settings: { restTimerSeconds: 60, soundEnabled: true },
      lastWorkoutDate: null,

      completeOnboarding: (levels, hasPullUpBar, nickname, purpose, targetDate) => {
        const tree = getTree(hasPullUpBar)
        const newProgress: Record<string, TrackProgress> = {}
        for (const track of ['push', 'squat', 'pull', 'core', 'run'] as TrackType[]) {
          const level = levels[track] ?? 0
          const exercise = tree[track][level]
          newProgress[track] = {
            track,
            currentLevel: level,
            currentReps: exercise.reps,
            currentSets: exercise.sets,
            bestVolume: 0,
            bestSeconds: null,
          }
        }
        set({
          onboardingCompleted: true,
          hasPullUpBar,
          nickname: nickname || '',
          trainingPurpose: purpose || 'saitama',
          targetDate: targetDate || null,
          trackProgress: newProgress as Record<TrackType, TrackProgress>,
          consecutiveEasy: defaultConsecutiveEasy,
        })
      },

      setNickname: (name) => set({ nickname: name }),
      setTrainingPurpose: (purpose) => set({ trainingPurpose: purpose }),
      setTargetDate: (date) => set({ targetDate: date }),

      setTrackProgress: (track, progress) =>
        set((state) => ({
          trackProgress: { ...state.trackProgress, [track]: progress },
        })),

      toggleActiveTrack: (track) =>
        set((state) => {
          const current = state.activeTracks
          if (current.includes(track)) {
            if (current.length <= 1) return state
            return { activeTracks: current.filter((t) => t !== track) }
          }
          return { activeTracks: [...current, track] }
        }),

      completeWorkout: (track, sets, rpe, durationSeconds) => {
        const state = get()
        const today = getLocalDateStr()
        const progress = state.trackProgress[track]
        const volume = sets.reduce((sum, s) => sum + (s.completed ? s.reps : 0), 0)

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
          durationSeconds,
          createdAt: new Date().toISOString(),
        }

        // 3축 프로그레션: 볼륨 우선 증가
        const delta = RPE_DELTA[rpe]
        const newReps = Math.max(1, progress.currentReps + delta)

        // 개인 최고 기록 갱신
        const newBestVolume = Math.max(progress.bestVolume || 0, volume)
        const newBestSeconds = durationSeconds
          ? (progress.bestSeconds === null ? durationSeconds : Math.min(progress.bestSeconds, durationSeconds))
          : progress.bestSeconds

        // easy 연속 카운트
        const newConsecutiveEasy = { ...state.consecutiveEasy }
        if (rpe === 'easy') {
          newConsecutiveEasy[track] = (newConsecutiveEasy[track] || 0) + 1
        } else {
          newConsecutiveEasy[track] = 0
        }

        const daySessions = [...(state.sessions[today] || []), session]

        // 프로그램 목표 달성 체크
        const updatedPrograms = state.programs.map((p) => {
          if (p.achieved || p.track !== track) return p
          if (p.axis === 'volume' && newReps >= p.target) return { ...p, achieved: true, current: newReps }
          if (p.axis === 'speed' && durationSeconds && durationSeconds <= p.target) return { ...p, achieved: true, current: durationSeconds }
          // current 업데이트
          if (p.axis === 'volume') return { ...p, current: newReps }
          if (p.axis === 'speed' && durationSeconds) return { ...p, current: durationSeconds }
          return p
        })

        set({
          sessions: { ...state.sessions, [today]: daySessions },
          totalVolume: state.totalVolume + volume,
          trackProgress: {
            ...state.trackProgress,
            [track]: {
              ...progress,
              currentReps: newReps,
              bestVolume: newBestVolume,
              bestSeconds: newBestSeconds,
            },
          },
          consecutiveEasy: newConsecutiveEasy,
          programs: updatedPrograms,
          lastWorkoutDate: today,
        })

        get().updateStreak()

        const newRank = get().calculateRank()
        if (newRank !== state.rank) {
          set({ rank: newRank })
        }
      },

      // 수동 레벨업 (코치 제안 → 유저 수락)
      levelUp: (track) => {
        const state = get()
        const progress = state.trackProgress[track]
        const tree = getTree(state.hasPullUpBar)
        const maxLevel = tree[track].length - 1

        if (progress.currentLevel >= maxLevel) return false

        const nextExercise = tree[track][progress.currentLevel + 1]
        set({
          trackProgress: {
            ...state.trackProgress,
            [track]: {
              ...progress,
              currentLevel: progress.currentLevel + 1,
              currentReps: nextExercise.reps,
              currentSets: nextExercise.sets,
              bestVolume: 0,        // 새 동작이니 기록 리셋
              bestSeconds: null,
            },
          },
          consecutiveEasy: { ...state.consecutiveEasy, [track]: 0 },
        })
        return true
      },

      calculateRank: (): HeroRank => {
        const state = get()
        // 랭크 = 사이타마 목표 달성률 기반
        const saitamaProgress = STRENGTH_TRACKS
          .reduce((sum, t) => sum + Math.min(1, state.trackProgress[t].currentReps / SAITAMA_GOALS[t]), 0) / STRENGTH_TRACKS.length

        const ranks: HeroRank[] = ['S', 'A', 'B', 'C']
        for (const rank of ranks) {
          const threshold = RANK_THRESHOLDS[rank]
          if (state.totalVolume >= threshold.minVolume && saitamaProgress >= threshold.minAvgLevel / 5) {
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
          set({ streakDays: 1, maxStreakDays: Math.max(state.maxStreakDays || 0, 1) })
          return
        }
        if (lastDate === today) return

        const last = new Date(lastDate)
        const now = new Date(today)
        const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          const newStreak = state.streakDays + 1
          set({ streakDays: newStreak, maxStreakDays: Math.max(state.maxStreakDays || 0, newStreak) })
        } else if (diffDays > 1) {
          set({ streakDays: 1, maxStreakDays: Math.max(state.maxStreakDays || 0, state.streakDays) })
        }
      },

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      setHasPullUpBar: (v) => set({ hasPullUpBar: v }),

      setPrograms: (programs) => set({ programs }),

      setTrackGoal: (track, goal) =>
        set((state) => ({
          trackGoals: {
            ...state.trackGoals,
            [track]: { ...state.trackGoals[track], ...goal },
          },
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

      resetAllData: () => {
        set({
          onboardingCompleted: false,
          hasPullUpBar: false,
          nickname: '',
          trainingPurpose: 'saitama' as TrainingPurpose,
          targetDate: null,
          activeTracks: ['push', 'squat', 'pull', 'core', 'run'],
          trackProgress: defaultProgress,
          rank: 'C',
          totalVolume: 0,
          streakDays: 0,
          maxStreakDays: 0,
          sessions: {},
          consecutiveEasy: defaultConsecutiveEasy,
          programs: [],
          trackGoals: defaultTrackGoals,
          settings: { restTimerSeconds: 60, soundEnabled: true },
          lastWorkoutDate: null,
        })
      },
    }),
    {
      name: 'saitama-training',
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        hasPullUpBar: state.hasPullUpBar,
        nickname: state.nickname,
        trainingPurpose: state.trainingPurpose,
        targetDate: state.targetDate,
        activeTracks: state.activeTracks,
        trackProgress: state.trackProgress,
        rank: state.rank,
        totalVolume: state.totalVolume,
        streakDays: state.streakDays,
        maxStreakDays: state.maxStreakDays,
        sessions: state.sessions,
        consecutiveEasy: state.consecutiveEasy,
        programs: state.programs,
        trackGoals: state.trackGoals,
        settings: state.settings,
        lastWorkoutDate: state.lastWorkoutDate,
      }),
    }
  )
)
