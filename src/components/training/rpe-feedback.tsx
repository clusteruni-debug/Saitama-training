import type { RPEFeedback as RPEType } from '../../types'

interface RPEFeedbackProps {
  onSelect: (rpe: RPEType) => void
}

const options: { value: RPEType; emoji: string; label: string; description: string; color: string }[] = [
  { value: 'easy', emoji: '😤', label: '쉬웠다', description: '렙수 +2', color: '#22c55e' },
  { value: 'moderate', emoji: '💪', label: '적당했다', description: '유지', color: '#f59e0b' },
  { value: 'hard', emoji: '🥵', label: '힘들었다', description: '렙수 -2', color: '#ef4444' },
]

export function RPEFeedback({ onSelect }: RPEFeedbackProps) {
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
            onClick={() => onSelect(opt.value)}
            className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--color-bg-card)] border-2 border-transparent hover:border-[var(--color-hero-yellow)] active:scale-95 transition-all"
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {opt.label}
            </span>
            <span className="text-[10px] font-medium" style={{ color: opt.color }}>
              {opt.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
