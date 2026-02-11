import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/ui/bottom-nav'
import { ToastContainer } from './components/ui/toast'
import { OnboardingPage } from './components/onboarding/onboarding-page'
import { HomePage } from './components/training/home-page'
import { WorkoutPage } from './components/training/workout-page'
import { ProgressionPage } from './components/progression/progression-page'
import { StatsPage } from './components/stats/stats-page'
import { ProfilePage } from './components/profile/profile-page'
import { RankUpModal } from './components/rank/rank-up-modal'
import { useTrainingStore } from './stores/useTrainingStore'
import { useFirebaseSync } from './hooks/use-firebase-sync'
import type { HeroRank } from './types'

function App() {
  const rank = useTrainingStore((s) => s.rank)
  const onboardingCompleted = useTrainingStore((s) => s.onboardingCompleted)
  const [rankUpRank, setRankUpRank] = useState<HeroRank | null>(null)
  const prevRankRef = useRef(rank)

  useFirebaseSync()

  useEffect(() => {
    if (rank !== prevRankRef.current) {
      setRankUpRank(rank)
      prevRankRef.current = rank
    }
  }, [rank])

  // 온보딩 미완료 시 설정 화면
  if (!onboardingCompleted) {
    return (
      <div className="min-h-dvh bg-[var(--color-bg-dark)]">
        <OnboardingPage />
        <ToastContainer />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-[var(--color-bg-dark)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workout/:track" element={<WorkoutPage />} />
          <Route path="/progression" element={<ProgressionPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
        <ToastContainer />

        {rankUpRank && (
          <RankUpModal
            newRank={rankUpRank}
            onClose={() => setRankUpRank(null)}
          />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
