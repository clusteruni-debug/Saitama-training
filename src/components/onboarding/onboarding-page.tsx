import { useState } from 'react'
import type { TrackType } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getTree, TRACK_INFO } from '../../data/progression-data'
import { Button } from '../ui/button'

const STRENGTH_TRACKS: TrackType[] = ['push', 'squat', 'pull', 'core']

export function OnboardingPage() {
  const completeOnboarding = useTrainingStore((s) => s.completeOnboarding)
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
    completeOnboarding(levels, hasPullUpBar)
  }

  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      {/* 헤더 — 사이타마 아이콘 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-hero-yellow)] flex items-center justify-center">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <ellipse cx="30" cy="24" rx="18" ry="19" fill="#ffc107"/>
            <ellipse cx="30" cy="30" rx="15" ry="15" fill="#ffe0a0"/>
            <circle cx="24" cy="28" r="2" fill="#1a1a1a"/>
            <circle cx="36" cy="28" r="2" fill="#1a1a1a"/>
            <line x1="27" y1="36" x2="33" y2="36" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx="24" cy="18" rx="5" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-15 24 18)"/>
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[var(--color-hero-yellow)]">
          시작하기
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-2">
          현재 수준에 맞게 설정하세요
        </p>
      </div>

      {/* 장비 선택 */}
      <section className="mb-6">
        <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
          장비
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setHasPullUpBar(false)}
            className={`flex-1 p-4 rounded-xl text-center transition-all ${
              !hasPullUpBar
                ? 'bg-[var(--color-hero-yellow)]/15 border-2 border-[var(--color-hero-yellow)] text-[var(--color-hero-yellow)]'
                : 'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-text-secondary)]'
            }`}
          >
            <p className="text-2xl mb-1">🏠</p>
            <p className="text-sm font-semibold">맨몸만</p>
            <p className="text-[10px] mt-0.5 opacity-70">장비 없이 집에서</p>
          </button>
          <button
            onClick={() => setHasPullUpBar(true)}
            className={`flex-1 p-4 rounded-xl text-center transition-all ${
              hasPullUpBar
                ? 'bg-[var(--color-hero-yellow)]/15 border-2 border-[var(--color-hero-yellow)] text-[var(--color-hero-yellow)]'
                : 'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-text-secondary)]'
            }`}
          >
            <p className="text-2xl mb-1">🏋️</p>
            <p className="text-sm font-semibold">철봉 있음</p>
            <p className="text-[10px] mt-0.5 opacity-70">풀업바 / 문틀 철봉</p>
          </button>
        </div>
      </section>

      {/* 트랙별 레벨 선택 */}
      <section className="mb-8 flex-1">
        <h2 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
          시작 레벨
        </h2>
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

      {/* 시작 버튼 */}
      <Button onClick={handleStart} size="lg" className="w-full">
        트레이닝 시작
      </Button>
    </div>
  )
}
