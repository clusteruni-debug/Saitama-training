import { useTrainingStore } from '../../stores/useTrainingStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { RankBadge } from '../rank/rank-badge'
import { LoginButton } from './login-button'
import { Settings } from './settings'

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
  const syncStatus = useAuthStore((s) => s.syncStatus)
  const statusInfo = syncStatusLabels[syncStatus]

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
    </div>
  )
}
