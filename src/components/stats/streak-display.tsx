interface StreakDisplayProps {
  days: number
  maxDays?: number
}

// 다음 마일스톤 계산
function getNextMilestone(days: number): number {
  const milestones = [3, 7, 14, 30, 60, 100, 200, 365]
  return milestones.find((m) => m > days) ?? days + 50
}

export function StreakDisplay({ days, maxDays }: StreakDisplayProps) {
  const nextMilestone = getNextMilestone(days)
  const remaining = nextMilestone - days
  const milestoneProgress = days > 0 ? Math.round((days / nextMilestone) * 100) : 0

  // 불꽃 단계
  const isHot = days >= 7
  const isWarm = days >= 3

  return (
    <div className="bg-[var(--color-bg-card)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* 불꽃 아이콘 (7일 이상이면 애니메이션) */}
          <span className={`text-3xl ${isHot ? 'animate-flame' : ''}`}>
            {days === 0 ? '❄️' : isHot ? '🔥' : isWarm ? '🔥' : '🕯️'}
          </span>
          <div>
            <p className="text-3xl font-black text-[var(--color-text-primary)] leading-none">
              {days}
              <span className="text-sm font-medium text-[var(--color-text-secondary)] ml-1">일</span>
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">연속 운동</p>
          </div>
        </div>

        {/* 최대 스트릭 */}
        {maxDays !== undefined && maxDays > 0 && (
          <div className="text-right">
            <p className="text-sm font-bold text-[var(--color-hero-yellow)]">{maxDays}</p>
            <p className="text-[9px] text-[var(--color-text-secondary)] uppercase">최고 기록</p>
          </div>
        )}
      </div>

      {/* 마일스톤 진행률 */}
      {days > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              다음 목표: {nextMilestone}일
            </span>
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              {remaining}일 남음
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isHot ? 'progress-stripe' : ''}`}
              style={{
                width: `${Math.min(100, milestoneProgress)}%`,
                backgroundColor: isHot ? 'var(--color-hero-red)' : isWarm ? 'var(--color-hero-yellow)' : 'var(--color-text-secondary)',
              }}
            />
          </div>
        </div>
      )}

      {/* 스트릭 끊김 경고 */}
      {days === 0 && maxDays !== undefined && maxDays > 0 && (
        <p className="text-xs text-[var(--color-hero-red)] mt-2">
          스트릭이 끊겼어요! 다시 시작해봐요 💪
        </p>
      )}
    </div>
  )
}
