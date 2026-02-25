import type { TrainingPurpose } from '../../types'
import { Button } from '../ui/button'
import { PURPOSE_OPTIONS } from './onboarding-types'

interface StepPurposeProps {
  purpose: TrainingPurpose
  setPurpose: (p: TrainingPurpose) => void
  onNext: () => void
}

export function StepPurpose({ purpose, setPurpose, onNext }: StepPurposeProps) {
  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-hero-yellow)] flex items-center justify-center">
          <span className="text-4xl">👊</span>
        </div>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          운동 목적
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          어떤 목표를 가지고 운동하나요?
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {PURPOSE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPurpose(opt.value)}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              purpose === opt.value
                ? 'bg-[var(--color-hero-yellow)]/15 border-2 border-[var(--color-hero-yellow)]'
                : 'bg-[var(--color-bg-card)] border-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className={`text-sm font-bold ${
                  purpose === opt.value ? 'text-[var(--color-hero-yellow)]' : 'text-[var(--color-text-primary)]'
                }`}>
                  {opt.label}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {opt.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="w-full mt-6">
        다음
      </Button>
    </div>
  )
}
