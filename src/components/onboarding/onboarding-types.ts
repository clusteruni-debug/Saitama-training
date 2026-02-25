import type { TrainingPurpose } from '../../types'

export type OnboardingStep = 'purpose' | 'profile' | 'equipment' | 'levels'

export const PURPOSE_OPTIONS: { value: TrainingPurpose; emoji: string; label: string; description: string }[] = [
  { value: 'saitama', emoji: '👊', label: '사이타마 도전', description: '푸시업 100, 스쿼트 100, 10km 달리기' },
  { value: 'strength', emoji: '💪', label: '근력 향상', description: '더 강한 맨몸운동을 목표로' },
  { value: 'endurance', emoji: '🏃', label: '체력 개선', description: '지구력과 심폐 기능 향상' },
  { value: 'diet', emoji: '🔥', label: '다이어트', description: '칼로리 소모와 체중 감량' },
  { value: 'health', emoji: '🧘', label: '건강 유지', description: '꾸준한 운동 습관 만들기' },
]
