# Saitama Training — 원펀 트레이닝

## 스택
React + TypeScript + Tailwind CSS v4 + Firebase + zustand

## 실행
```bash
cp .env.example .env    # Firebase 환경변수 설정
npm install
npm run dev             # http://localhost:5173
```

## 배포
Vercel (git push = 자동 배포)

## 구조
```
src/
├── components/
│   ├── training/
│   │   ├── home-page.tsx          # 홈 오케스트레이터
│   │   ├── home/                  # 홈 서브컴포넌트
│   │   │   ├── hero-header.tsx
│   │   │   ├── saitama-progress.tsx
│   │   │   ├── next-milestone-banner.tsx
│   │   │   ├── warning-banner.tsx
│   │   │   ├── training-section.tsx
│   │   │   ├── programs-section.tsx
│   │   │   └── coach-section.tsx
│   │   ├── workout-page.tsx       # 운동 오케스트레이터
│   │   ├── workout/               # 운동 서브컴포넌트
│   │   │   ├── workout-types.ts
│   │   │   ├── run-workout.tsx
│   │   │   ├── warmup-phase.tsx
│   │   │   ├── rest-results.tsx
│   │   │   ├── done-phase.tsx
│   │   │   └── progress-bar.tsx
│   │   ├── track-card.tsx, set-counter.tsx, rep-counter.tsx, rest-timer.tsx, rpe-feedback.tsx
│   ├── onboarding/
│   │   ├── onboarding-page.tsx    # 온보딩 오케스트레이터
│   │   ├── onboarding-types.ts
│   │   ├── step-purpose.tsx
│   │   ├── step-profile.tsx
│   │   ├── step-equipment.tsx
│   │   └── step-levels.tsx
│   ├── progression/
│   │   ├── track-plan.tsx         # 플랜 오케스트레이터
│   │   └── plan/                  # 플랜 서브컴포넌트
│   │       ├── goal-card.tsx
│   │       ├── schedule-card.tsx
│   │       ├── frequency-selector.tsx
│   │       ├── milestone-list.tsx
│   │       └── weekly-plan.tsx
│   ├── profile/
│   │   ├── methodology-page.tsx   # 방법론 오케스트레이터
│   │   └── methodology/           # 방법론 섹션 컴포넌트
│   │       ├── section-progressive-overload.tsx
│   │       ├── section-rpe.tsx
│   │       ├── section-level-up.tsx
│   │       ├── section-volume-cap.tsx
│   │       ├── section-deload.tsx
│   │       ├── section-rest-time.tsx
│   │       ├── section-warmup.tsx
│   │       ├── section-references.tsx
│   │       ├── level-up-progress-bar.tsx
│   │       └── reference-item.tsx
│   ├── rank/, stats/, ui/
├── stores/             # zustand 스토어 (단일 persist 스토어, 분리 불필요)
├── lib/
│   ├── smart-coach.ts             # 배럴 re-export
│   ├── coach/                     # 코치 로직 분리
│   │   ├── types.ts
│   │   ├── programs.ts
│   │   ├── tips.ts
│   │   ├── saitama.ts
│   │   ├── rest.ts
│   │   └── utils.ts
│   ├── firebase.ts, plan-calculator.ts
├── types/              # TypeScript 타입
├── hooks/              # 커스텀 훅
├── data/               # 프로그레션 트리 데이터
└── docs/CHANGELOG.md
```

## 고유 제약
- 상태관리: zustand만 사용 (Redux 금지)
- localStorage persist + Firebase 동기화 (서버/클라이언트 상태 분리)
- Firebase Auth (Google) + Firestore (운동 기록)
- Security Rules UID 기반 필수
- 디자인: 다크 테마, 노란색(#ffc107)/빨간색(#ef4444) 액센트, 모바일 퍼스트
- 스타일: Tailwind v4 (@tailwindcss/vite), 인라인 스타일 금지
- 파일명: kebab-case, any 타입 금지

## 검증 체크리스트
- [ ] 빌드: npm run build 에러 없음
- [ ] 운동 기록 저장 → Firebase 동기화
- [ ] RPE 피드백 → 볼륨 자동 조절

## 참조
- CC/CX 파일 담당: agent_docs/domain-map.md
- CHANGELOG: docs/CHANGELOG.md
