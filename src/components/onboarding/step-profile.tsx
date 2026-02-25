import { Button } from '../ui/button'

interface StepProfileProps {
  nickname: string
  setNickname: (v: string) => void
  targetDate: string
  setTargetDate: (v: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepProfile({ nickname, setNickname, targetDate, setTargetDate, onNext, onBack }: StepProfileProps) {
  // 오늘로부터 3개월 후 기본값
  const defaultDate = (() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 3)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })()

  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl block mb-4">🦸</span>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          프로필 설정
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          나만의 히어로 이름을 정해주세요
        </p>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* 닉네임 */}
        <div>
          <label className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-2 block font-medium">
            히어로 이름
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: 사이타마, 제노스..."
            maxLength={20}
            className="w-full bg-[var(--color-bg-card)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm outline-none border-2 border-transparent focus:border-[var(--color-hero-yellow)]/50 transition-all placeholder:text-[var(--color-text-secondary)]/50"
          />
        </div>

        {/* 목표 기한 */}
        <div>
          <label className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-2 block font-medium">
            목표 달성 기한 (선택)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[var(--color-bg-card)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm outline-none border-2 border-transparent focus:border-[var(--color-hero-yellow)]/50 transition-all"
          />
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
            설정하면 플랜에 맞춰 주당 운동 빈도를 추천합니다
          </p>
          {!targetDate && (
            <button
              onClick={() => setTargetDate(defaultDate)}
              className="mt-2 text-xs text-[var(--color-hero-yellow)] underline"
            >
              3개월 뒤로 설정
            </button>
          )}
        </div>
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
