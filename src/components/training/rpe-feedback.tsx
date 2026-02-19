import { useState } from 'react'
import type { RPEFeedback as RPEType } from '../../types'
import { calculateRepsDelta } from '../../data/progression-data'

interface RPEFeedbackProps {
  onSelect: (rpe: RPEType, formBroken?: boolean) => void
  currentReps: number
}

const options: { value: RPEType; emoji: string; label: string; color: string }[] = [
  { value: 'easy', emoji: '😤', label: '쉬웠다', color: '#22c55e' },
  { value: 'moderate', emoji: '💪', label: '적당했다', color: '#f59e0b' },
  { value: 'hard', emoji: '🥵', label: '힘들었다', color: '#ef4444' },
]

export function RPEFeedback({ onSelect, currentReps }: RPEFeedbackProps) {
  const [formBroken, setFormBroken] = useState(false)

  // 비율 기반 다음 렙수 예측
  function predictNext(rpe: RPEType): string {
    const delta = calculateRepsDelta(currentReps, rpe)
    const next = Math.max(1, currentReps + delta)
    const sign = delta >= 0 ? '+' : ''
    const pct = rpe === 'easy' ? '+10%' : rpe === 'moderate' ? '+5%' : '-5%'
    return `다음 ${next}개 (${sign}${delta}, ${pct})`
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h3 className="text-[var(--color-text-primary)] text-lg font-bold">
        오늘 운동 어땠어?
      </h3>
      <p className="text-[var(--color-text-secondary)] text-sm">
        다음 운동 강도를 조절합니다
      </p>

      <div className="flex gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value, formBroken)}
            className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--color-bg-card)] border-2 border-transparent hover:border-[var(--color-hero-yellow)] active:scale-95 transition-all"
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {opt.label}
            </span>
            <span className="text-[10px] font-medium" style={{ color: opt.color }}>
              {predictNext(opt.value)}
            </span>
          </button>
        ))}
      </div>

      {/* 폼 퀄리티 체크 */}
      <button
        onClick={() => setFormBroken(!formBroken)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm ${
          formBroken
            ? 'bg-red-500/20 border border-red-500/30 text-red-400'
            : 'bg-white/5 border border-white/10 text-[var(--color-text-secondary)]'
        }`}
      >
        <span className="text-base">{formBroken ? '⚠️' : '🏋️'}</span>
        <span className="font-medium">자세가 무너졌다</span>
        {formBroken && (
          <span className="text-[10px] text-red-400/70 ml-1">추가 -5%</span>
        )}
      </button>
    </div>
  )
}
