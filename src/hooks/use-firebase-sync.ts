import { useEffect, useRef } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
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

  // 인증 상태 감지
  useEffect(() => {
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
  }, [setUser, setSyncStatus])

  // Firestore 실시간 구독
  useEffect(() => {
    if (!user) return

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
  }, [user, setSyncStatus])

  // 로컬 상태 변경 시 클라우드에 반영 (디바운스)
  useEffect(() => {
    if (!user) return

    const unsub = useTrainingStore.subscribe(() => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        syncToFirebase(user.uid)
      }, DEBOUNCE_MS)
    })

    return () => unsub()
  }, [user])

  async function loadFromFirebase(uid: string) {
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
  }

  function mergeFromCloud(data: Record<string, unknown>) {
    const store = useTrainingStore.getState()

    // 클라우드 데이터가 더 최신이면 병합
    if (data.trackProgress) {
      store.setTrackProgress('push', (data.trackProgress as Record<string, typeof store.trackProgress.push>).push || store.trackProgress.push)
      store.setTrackProgress('squat', (data.trackProgress as Record<string, typeof store.trackProgress.squat>).squat || store.trackProgress.squat)
      store.setTrackProgress('pull', (data.trackProgress as Record<string, typeof store.trackProgress.pull>).pull || store.trackProgress.pull)
      store.setTrackProgress('core', (data.trackProgress as Record<string, typeof store.trackProgress.core>).core || store.trackProgress.core)
    }
  }

  async function syncToFirebase(uid: string) {
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
        sessions: state.sessions,
        consecutiveEasy: state.consecutiveEasy,
        settings: state.settings,
        lastWorkoutDate: state.lastWorkoutDate,
        updatedAt: new Date().toISOString(),
      }, { merge: true })

      setSyncStatus('synced')
    } catch (error) {
      console.error('Firebase 동기화 실패:', error)
      setSyncStatus('error')
    }
  }
}

export async function loginWithGoogle() {
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
  try {
    await signOut(auth)
    useAuthStore.getState().setSyncStatus('offline')
    showToast('로그아웃 완료', 'info')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
