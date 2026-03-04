import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TrainingPurpose } from '../../types'
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

const PURPOSE_OPTIONS: { value: TrainingPurpose; emoji: string; label: string }[] = [
  { value: 'saitama', emoji: '👊', label: '사이타마 도전' },
  { value: 'strength', emoji: '💪', label: '근력 향상' },
  { value: 'endurance', emoji: '🏃', label: '체력 개선' },
  { value: 'diet', emoji: '🔥', label: '다이어트' },
  { value: 'health', emoji: '🧘', label: '건강 유지' },
]

export function ProfilePage() {
  const rank = useTrainingStore((s) => s.rank)
  const totalVolume = useTrainingStore((s) => s.totalVolume)
  const streakDays = useTrainingStore((s) => s.streakDays)
  const resetAllData = useTrainingStore((s) => s.resetAllData)
  const nickname = useTrainingStore((s) => s.nickname)
  const trainingPurpose = useTrainingStore((s) => s.trainingPurpose)
  const targetDate = useTrainingStore((s) => s.targetDate)
  const setNickname = useTrainingStore((s) => s.setNickname)
  const setTrainingPurpose = useTrainingStore((s) => s.setTrainingPurpose)
  const setTargetDate = useTrainingStore((s) => s.setTargetDate)
  const syncStatus = useAuthStore((s) => s.syncStatus)
  const statusInfo = syncStatusLabels[syncStatus]
  const navigate = useNavigate()

  const [editingProfile, setEditingProfile] = useState(false)
  const [tempNickname, setTempNickname] = useState(nickname)
  const [tempPurpose, setTempPurpose] = useState(trainingPurpose)
  const [tempDate, setTempDate] = useState(targetDate || '')

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
            {nickname || (rank === 'S' ? 'S급 히어로' : rank === 'A' ? 'A급 히어로' : rank === 'B' ? 'B급 히어로' : 'C급 히어로')}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            볼륨 {totalVolume.toLocaleString()} · {streakDays}일 연속
          </p>
        </div>
      </div>

      {/* 목표 & 개인화 */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider font-medium">
            내 목표
          </h3>
          <button
            onClick={() => {
              if (editingProfile) {
                setNickname(tempNickname)
                setTrainingPurpose(tempPurpose)
                setTargetDate(tempDate || null)
                showToast('프로필 저장됨', 'success')
              } else {
                setTempNickname(nickname)
                setTempPurpose(trainingPurpose)
                setTempDate(targetDate || '')
              }
              setEditingProfile(!editingProfile)
            }}
            className="text-xs text-[var(--color-hero-yellow)] font-medium"
          >
            {editingProfile ? '저장' : '편집'}
          </button>
        </div>

        {editingProfile ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-[var(--color-text-secondary)] mb-1 block">히어로 이름</label>
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                placeholder="닉네임"
                maxLength={20}
                className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--color-text-secondary)] mb-1 block">운동 목적</label>
              <div className="flex flex-wrap gap-2">
                {PURPOSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTempPurpose(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      tempPurpose === opt.value
                        ? 'bg-[var(--color-hero-yellow)] text-black'
                        : 'bg-white/10 text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[var(--color-text-secondary)] mb-1 block">목표 기한</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">목적</span>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {PURPOSE_OPTIONS.find((o) => o.value === trainingPurpose)?.emoji}{' '}
                {PURPOSE_OPTIONS.find((o) => o.value === trainingPurpose)?.label}
              </span>
            </div>
            {targetDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">목표 기한</span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{targetDate}</span>
              </div>
            )}
          </div>
        )}
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

      {/* 운동 방법론 */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6">
        <button
          onClick={() => navigate('/methodology')}
          className="w-full flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📖</span>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">운동 방법론</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">프로그레션 원리, 레벨업 기준, 참고 문헌</p>
            </div>
          </div>
          <span className="text-[var(--color-text-tertiary)]">&rsaquo;</span>
        </button>
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
