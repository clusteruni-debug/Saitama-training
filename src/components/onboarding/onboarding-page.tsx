import { useState } from 'react'
import type { TrackType, TrainingPurpose } from '../../types'
import { useTrainingStore } from '../../stores/useTrainingStore'
import { getTree } from '../../data/progression-data'
import type { OnboardingStep } from './onboarding-types'
import { StepPurpose } from './step-purpose'
import { StepProfile } from './step-profile'
import { StepEquipment } from './step-equipment'
import { StepLevels } from './step-levels'

export function OnboardingPage() {
  const completeOnboarding = useTrainingStore((s) => s.completeOnboarding)

  const [step, setStep] = useState<OnboardingStep>('purpose')
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

  if (step === 'purpose') {
    return (
      <StepPurpose
        purpose={purpose}
        setPurpose={setPurpose}
        onNext={() => setStep('profile')}
      />
    )
  }

  if (step === 'profile') {
    return (
      <StepProfile
        nickname={nickname}
        setNickname={setNickname}
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        onNext={() => setStep('equipment')}
        onBack={() => setStep('purpose')}
      />
    )
  }

  if (step === 'equipment') {
    return (
      <StepEquipment
        hasPullUpBar={hasPullUpBar}
        setHasPullUpBar={setHasPullUpBar}
        onNext={() => setStep('levels')}
        onBack={() => setStep('profile')}
      />
    )
  }

  // step === 'levels'
  return (
    <StepLevels
      levels={levels}
      handleLevel={handleLevel}
      tree={tree}
      onStart={handleStart}
      onBack={() => setStep('equipment')}
    />
  )
}
