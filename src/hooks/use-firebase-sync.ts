import { useCallback, useEffect, useRef } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import { useAuthStore } from '../stores/useAuthStore'
import { useTrainingStore } from '../stores/useTrainingStore'
import { showToast } from '../components/ui/toast'

const DEBOUNCE_MS = 1500

export function useFirebaseSync() {
  const setUser = useAuthStore((s) => s.setUser)
  const setSyncStatus = useAuthStore((s) => s.setSyncStatus)
  const user = useAuthStore((s) => s.user)
  const lastOwnWriteRef = useRef(0)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mergeFromCloud = useCallback((data: Record<string, unknown>) => {
    const store = useTrainingStore.getState()
    const updates: Record<string, unknown> = {}

    // trackProgress 병합
    if (data.trackProgress) {
      const tp = data.trackProgress as Record<string, typeof store.trackProgress.push>
      const merged = { ...store.trackProgress }
      for (const track of ['push', 'squat', 'pull', 'core', 'run'] as const) {
        if (tp[track]) merged[track] = tp[track]
      }
      updates.trackProgress = merged
    }

    // 단순 값 병합
    if (data.rank != null) updates.rank = data.rank
    if (typeof data.totalVolume === 'number') updates.totalVolume = data.totalVolume
    if (typeof data.streakDays === 'number') updates.streakDays = data.streakDays
    if (typeof data.maxStreakDays === 'number') updates.maxStreakDays = data.maxStreakDays
    if (data.lastWorkoutDate !== undefined) updates.lastWorkoutDate = data.lastWorkoutDate
    if (typeof data.nickname === 'string') updates.nickname = data.nickname
    if (typeof data.trainingPurpose === 'string') updates.trainingPurpose = data.trainingPurpose
    if (data.targetDate !== undefined) updates.targetDate = data.targetDate

    // 객체 병합 (클라우드 데이터 우선)
    if (data.sessions) updates.sessions = data.sessions
    if (data.consecutiveEasy) updates.consecutiveEasy = data.consecutiveEasy
    if (data.settings) updates.settings = { ...store.settings, ...(data.settings as object) }
    if (data.programs) updates.programs = data.programs
    if (data.trackGoals) updates.trackGoals = { ...store.trackGoals, ...(data.trackGoals as object) }
    if (data.activeTracks) updates.activeTracks = data.activeTracks

    // 한 번에 set
    if (Object.keys(updates).length > 0) {
      useTrainingStore.setState(updates)
    }
  }, [])

  const loadFromFirebase = useCallback(async (uid: string) => {
    if (!db) return
    try {
      const docRef = doc(db, 'users', uid)
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        mergeFromCloud(snapshot.data())
        showToast('클라우드 데이터 로드 완료', 'success')
      }
      setSyncStatus('synced')
    } catch (error) {
      console.error('Firebase 로드 실패:', error)
      setSyncStatus('error')
      showToast('동기화 실패', 'error')
    }
  }, [mergeFromCloud, setSyncStatus])

  const syncToFirebase = useCallback(async (uid: string) => {
    if (!db) return
    try {
      setSyncStatus('syncing')
      lastOwnWriteRef.current = Date.now()

      const state = useTrainingStore.getState()
      const docRef = doc(db, 'users', uid)
      await setDoc(docRef, {
        trackProgress: state.trackProgress,
        rank: state.rank,
        totalVolume: state.totalVolume,
        streakDays: state.streakDays,
        maxStreakDays: state.maxStreakDays,
        nickname: state.nickname,
        trainingPurpose: state.trainingPurpose,
        targetDate: state.targetDate,
        sessions: state.sessions,
        consecutiveEasy: state.consecutiveEasy,
        programs: state.programs,
        trackGoals: state.trackGoals,
        activeTracks: state.activeTracks,
        settings: state.settings,
        lastWorkoutDate: state.lastWorkoutDate,
        updatedAt: new Date().toISOString(),
      }, { merge: true })

      setSyncStatus('synced')
    } catch (error) {
      console.error('Firebase 동기화 실패:', error)
      setSyncStatus('error')
    }
  }, [setSyncStatus])

  // Firebase 미설정 시 오프라인 모드
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setSyncStatus('offline')
      return
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        setSyncStatus('syncing')
        loadFromFirebase(firebaseUser.uid)
      } else {
        setSyncStatus('offline')
      }
    })
    return () => unsub()
  }, [loadFromFirebase, setUser, setSyncStatus])

  // Firestore 실시간 구독
  useEffect(() => {
    if (!user || !db) return

    const docRef = doc(db, 'users', user.uid)
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return

      // 핑퐁 방지: 자기 쓰기 직후 무시
      if (Date.now() - lastOwnWriteRef.current < 3000) return

      const data = snapshot.data()
      if (data) {
        mergeFromCloud(data)
        setSyncStatus('synced')
      }
    }, (error) => {
      console.error('Firestore 구독 에러:', error)
      setSyncStatus('error')
    })

    return () => unsub()
  }, [mergeFromCloud, setSyncStatus, user])

  // 로컬 상태 변경 시 클라우드에 반영 (디바운스)
  useEffect(() => {
    if (!user || !db) return

    const unsub = useTrainingStore.subscribe(() => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        syncToFirebase(user.uid)
      }, DEBOUNCE_MS)
    })

    return () => unsub()
  }, [syncToFirebase, user])
}

export async function loginWithGoogle() {
  if (!auth) {
    showToast('Firebase 미설정 — .env 파일 필요', 'error')
    return
  }
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    showToast('로그인 성공!', 'success')
  } catch (error) {
    console.error('로그인 실패:', error)
    showToast('로그인 실패', 'error')
  }
}

export async function logout() {
  if (!auth) return
  try {
    await signOut(auth)
    useAuthStore.getState().setSyncStatus('offline')
    showToast('로그아웃 완료', 'info')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
