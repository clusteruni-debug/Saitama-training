import { useState } from 'react'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { RankBadge } from '../rank/rank-badge'
import { LoginButton } from './login-button'
import { Settings } from './settings'
import { showToast } from '../ui/toast'

const syncStatusLabels = {
  offline: { text: '오프라인', color: 'text-zinc-400' },
  syncing: { text: '동기화 중...', color: 'text-yellow-400' },
  synced: { text: '동기화 완료', color: 'text-green-400' },
  error: { text: '동기화 오류', color: 'text-red-400' },
}

export function ProfilePage() {
  const rank = useTrainingStore((s) => s.rank)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const resetAllData = useTrainingStore((s) => s.resetAllData)
  const syncStatus = useAuthStore((s) => s.syncStatus)
  const statusInfo = syncStatusLabels[syncStatus]

  // 데이터 초기화 2단계 확인
  const [resetStep, setResetStep] = useState(0) // 0: 미시작, 1: 1차 확인, 2: 최종 확인

  const handleResetClick = () => {
    if (resetStep === 0) {
      setResetStep(1)
    } else if (resetStep === 1) {
      setResetStep(2)
    }
  }

  const handleResetConfirm = () => {
    resetAllData()
    setResetStep(0)
    showToast('모든 데이터가 초기화되었습니다', 'success')
  }

  const handleResetCancel = () => {
    setResetStep(0)
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-black text-[var(--color-hero-yellow)]">
          프로필
        </h1>
      </header>

      {/* 랭크 카드 */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-6 flex items-center gap-5">
        <RankBadge rank={rank} size="lg" />
        <div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">
            {rank === 'S' ? 'S급 히어로' : rank === 'A' ? 'A급 히어로' : rank === 'B' ? 'B급 히어로' : 'C급 히어로'}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            볼륨 {totalVolume.toLocaleString()} · {streakDays}일 연속
          </p>
        </div>
      </div>

      {/* 로그인 */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium">
            클라우드 동기화
          </h3>
          <span className={`text-xs ${statusInfo.color}`}>
            ● {statusInfo.text}
          </span>
        </div>
        <LoginButton />
      </div>

      {/* 설정 */}
      <Settings />

      {/* 데이터 초기화 */}
      <div className="mt-6 bg-[var(--color-bg-card)] rounded-2xl p-4">
        <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium mb-3">
          데이터 관리
        </h3>

        {resetStep === 0 && (
          <button
            onClick={handleResetClick}
            className="w-full py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 transition-all active:scale-[0.97]"
          >
            모든 데이터 초기화
          </button>
        )}

        {resetStep === 1 && (
          <div className="animate-scale-in">
            <p className="text-sm text-[var(--color-hero-red)] font-medium mb-3 text-center">
              정말 초기화하시겠습니까?
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 text-center">
              모든 운동 기록, 랭크, 스트릭이 삭제됩니다
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleResetCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] bg-white/5"
              >
                취소
              </button>
              <button
                onClick={handleResetClick}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30"
              >
                네, 초기화합니다
              </button>
            </div>
          </div>
        )}

        {resetStep === 2 && (
          <div className="animate-scale-in">
            <p className="text-sm text-[var(--color-hero-red)] font-bold mb-3 text-center">
              마지막 확인
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 text-center">
              이 작업은 되돌릴 수 없습니다. 정말로 진행하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleResetCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] bg-white/10"
              >
                아니요, 취소
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 active:scale-[0.97]"
              >
                삭제 확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
