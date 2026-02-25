interface ScheduleCardProps {
  totalWeeks: number
  totalSessions: number
  estimatedDate: string
}

export function ScheduleCard({ totalWeeks, totalSessions, estimatedDate }: ScheduleCardProps) {
  if (totalWeeks <= 0) return null

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">예상 일정</h2>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-2xl font-bold text-[var(--color-hero-yellow)]">{totalWeeks}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">주</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{totalSessions}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">세션</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">{estimatedDate}</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">예상 달성일</p>
        </div>
      </div>
    </div>
  )
}
