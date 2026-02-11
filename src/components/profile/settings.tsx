import { useTrainingStore } from '../../stores/useTrainingStore'

export function Settings() {
  const settings = useTrainingStore((s) => s.settings)
  const updateSettings = useTrainingStore((s) => s.updateSettings)

  return (
    <div>
      <h3 className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wider mb-3 font-medium">
        설정
      </h3>

      {/* 휴식 타이머 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">휴식 시간</p>
            <p className="text-xs text-[var(--color-text-secondary)]">세트 사이 휴식</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSettings({ restTimerSeconds: Math.max(15, settings.restTimerSeconds - 15) })}
              className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center"
            >
              −
            </button>
            <span className="text-sm font-medium text-[var(--color-text-primary)] w-10 text-center">
              {settings.restTimerSeconds}초
            </span>
            <button
              onClick={() => updateSettings({ restTimerSeconds: Math.min(180, settings.restTimerSeconds + 15) })}
              className="w-8 h-8 rounded-lg bg-white/10 text-[var(--color-text-primary)] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 사운드 */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">사운드</p>
            <p className="text-xs text-[var(--color-text-secondary)]">타이머 알림음</p>
          </div>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              settings.soundEnabled ? 'bg-[var(--color-hero-yellow)]' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
