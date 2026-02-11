import { useState } from 'react'
import type { TrackType, TrainingPurpose } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getTree, TRACK_INFO } from '../../data/progression-data'
import { Button } from '../ui/button'

const STRENGTH_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

const PURPOSE_OPTIONS: { value: TrainingPurpose; emoji: string; label: string; description: string }[] = [
  { value: 'saitama', emoji: '👊', label: '사이타마 도전', description: '푸시업 100, 스쿼트 100, 10km 달리기' },
  { value: 'strength', emoji: '💪', label: '근력 향상', description: '더 강한 맨몸운동을 목표로' },
  { value: 'endurance', emoji: '🏃', label: '체력 개선', description: '지구력과 심폐 기능 향상' },
  { value: 'diet', emoji: '🔥', label: '다이어트', description: '칼로리 소모와 체중 감량' },
  { value: 'health', emoji: '🧘', label: '건강 유지', description: '꾸준한 운동 습관 만들기' },
]

type Step = 'purpose' | 'profile' | 'equipment' | 'levels'

export function OnboardingPage() {
  const completeOnboarding = useTrainingStore((s) => s.completeOnboarding)

  const [step, setStep] = useState<Step>('purpose')
  const [purpose, setPurpose] = useState<TrainingPurpose>('saitama')
  const [nickname, setNickname] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [hasPullUpBar, setHasPullUpBar] = useState(false)
  const [levels, setLevels] = useState<Record<TrackType, number>>({
    push: 0, squat: 0, pull: 0, core: 0, run: 0,
  })

  const tree = getTree(hasPullUpBar)

  const handleLevel = (track: TrackType, delta: number) => {
    setLevels((prev) => ({
      ...prev,
      [track]: Math.max(0, Math.min(5, prev[track] + delta)),
    }))
  }

  const handleStart = () => {
    completeOnboarding(levels, hasPullUpBar, nickname, purpose, targetDate || undefined)
  }

  // 단계 1: 운동 목적 선택
  if (step === 'purpose') {
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

        <Button onClick={() => setStep('profile')} size="lg" className="w-full mt-6">
          다음
        </Button>
      </div>
    )
  }

  // 단계 2: 닉네임 + 목표 기한
  if (step === 'profile') {
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
            onClick={() => setStep('purpose')}
            className="px-6 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] bg-white/5"
          >
            이전
          </button>
          <Button onClick={() => setStep('equipment')} size="lg" className="flex-1">
            다음
          </Button>
        </div>
      </div>
    )
  }

  // 단계 3: 장비 선택
  if (step === 'equipment') {
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
            onClick={() => setStep('profile')}
            className="px-6 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] bg-white/5"
          >
            이전
          </button>
          <Button onClick={() => setStep('levels')} size="lg" className="flex-1">
            다음
          </Button>
        </div>
      </div>
    )
  }

  // 단계 4: 레벨 선택 + 시작
  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl block mb-4">💪</span>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          시작 레벨
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          현재 수준에 맞게 설정하세요
        </p>
      </div>

      <section className="mb-8 flex-1">
        <div className="flex flex-col gap-3">
          {STRENGTH_TRACKS.map((track) => {
            const info = TRACK_INFO[track]
            const exercise = tree[track][levels[track]]
            const isTimeEx = track === 'core' && levels[track] === 0
            return (
              <div key={track} className="bg-[var(--color-bg-card)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.emoji}</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {info.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLevel(track, -1)}
                      disabled={levels[track] <= 0}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[var(--color-hero-yellow)] w-8 text-center">
                      Lv.{levels[track]}
                    </span>
                    <button
                      onClick={() => handleLevel(track, 1)}
                      disabled={levels[track] >= 5}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {exercise.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {exercise.sets} × {exercise.reps}{isTimeEx ? '초' : '회'}
                  </p>
                </div>
              </div>
            )
          })}

          {/* 달리기 트랙 */}
          {(() => {
            const runInfo = TRACK_INFO['run']
            const runExercise = tree['run'][levels['run']]
            return (
              <div className="bg-[var(--color-bg-card)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{runInfo.emoji}</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {runInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLevel('run', -1)}
                      disabled={levels['run'] <= 0}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[var(--color-hero-yellow)] w-8 text-center">
                      Lv.{levels['run']}
                    </span>
                    <button
                      onClick={() => handleLevel('run', 1)}
                      disabled={levels['run'] >= 5}
                      className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {runExercise.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {runExercise.reps}분
                  </p>
                </div>
              </div>
            )
          })()}
        </div>

        <p className="text-[var(--color-text-secondary)] text-xs text-center mt-4">
          잘 모르겠으면 Lv.0으로 시작 — 운동 후 자동으로 올라갑니다
        </p>
      </section>

      <div className="flex gap-3">
        <button
          onClick={() => setStep('equipment')}
          className="px-6 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] bg-white/5"
        >
          이전
        </button>
        <Button onClick={handleStart} size="lg" className="flex-1">
          트레이닝 시작!
        </Button>
      </div>
    </div>
  )
}
