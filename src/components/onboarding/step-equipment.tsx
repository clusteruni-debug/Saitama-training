import { Button } from '../ui/button'

interface StepEquipmentProps {
  hasPullUpBar: boolean
  setHasPullUpBar: (v: boolean) => void
  onNext: () => void
  onBack: () => void
}

export function StepEquipment({ hasPullUpBar, setHasPullUpBar, onNext, onBack }: StepEquipmentProps) {
  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl block mb-4">🏠</span>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          장비 선택
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          철봉 유무에 따라 운동이 달라집니다
        </p>
      </div>

      <div className="flex gap-3 flex-1">
        <button
          onClick={() => setHasPullUpBar(false)}
          className={`flex-1 p-6 rounded-xl text-center transition-all ${
            !hasPullUpBar
              ? 'bg-[var(--color-hero-yellow)]/15 border-2 border-[var(--color-hero-yellow)] text-[var(--color-hero-yellow)]'
              : 'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-text-secondary)]'
          }`}
        >
          <p className="text-3xl mb-2">🏠</p>
          <p className="text-sm font-semibold">맨몸만</p>
          <p className="text-[10px] mt-1 opacity-70">장비 없이 집에서</p>
        </button>
        <button
          onClick={() => setHasPullUpBar(true)}
          className={`flex-1 p-6 rounded-xl text-center transition-all ${
            hasPullUpBar
              ? 'bg-[var(--color-hero-yellow)]/15 border-2 border-[var(--color-hero-yellow)] text-[var(--color-hero-yellow)]'
              : 'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-text-secondary)]'
          }`}
        >
          <p className="text-3xl mb-2">🏋️</p>
          <p className="text-sm font-semibold">철봉 있음</p>
          <p className="text-[10px] mt-1 opacity-70">풀업바 / 문틀 철봉</p>
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] bg-white/5"
        >
          이전
        </button>
        <Button onClick={onNext} size="lg" className="flex-1">
          다음
        </Button>
      </div>
    </div>
  )
}
