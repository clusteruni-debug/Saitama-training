# Saitama Training — One Punch Training

## Stack
React + TypeScript + Tailwind CSS v4 + Firebase + zustand

## Running
```bash
cp .env.example .env    # Set Firebase environment variables
npm install
npm run dev             # http://localhost:5173
```

## Deployment
Vercel (git push = auto deploy)

## Structure
```
src/
├── components/
│   ├── training/
│   │   ├── home-page.tsx          # Home orchestrator
│   │   ├── home/                  # Home sub-components
│   │   │   ├── hero-header.tsx
│   │   │   ├── saitama-progress.tsx
│   │   │   ├── next-milestone-banner.tsx
│   │   │   ├── warning-banner.tsx
│   │   │   ├── training-section.tsx
│   │   │   ├── programs-section.tsx
│   │   │   └── coach-section.tsx
│   │   ├── workout-page.tsx       # Workout orchestrator
│   │   ├── workout/               # Workout sub-components
│   │   │   ├── workout-types.ts
│   │   │   ├── run-workout.tsx
│   │   │   ├── warmup-phase.tsx
│   │   │   ├── rest-results.tsx
│   │   │   ├── done-phase.tsx
│   │   │   └── progress-bar.tsx
│   │   ├── track-card.tsx, set-counter.tsx, rep-counter.tsx, rest-timer.tsx, rpe-feedback.tsx
│   ├── onboarding/
│   │   ├── onboarding-page.tsx    # Onboarding orchestrator
│   │   ├── onboarding-types.ts
│   │   ├── step-purpose.tsx
│   │   ├── step-profile.tsx
│   │   ├── step-equipment.tsx
│   │   └── step-levels.tsx
│   ├── progression/
│   │   ├── track-plan.tsx         # Plan orchestrator
│   │   └── plan/                  # Plan sub-components
│   │       ├── goal-card.tsx
│   │       ├── schedule-card.tsx
│   │       ├── frequency-selector.tsx
│   │       ├── milestone-list.tsx
│   │       └── weekly-plan.tsx
│   ├── profile/
│   │   ├── methodology-page.tsx   # Methodology orchestrator
│   │   └── methodology/           # Methodology section components
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
├── stores/             # zustand stores (single persist store, no split needed)
├── lib/
│   ├── smart-coach.ts             # Barrel re-export
│   ├── coach/                     # Coach logic split
│   │   ├── types.ts
│   │   ├── programs.ts
│   │   ├── tips.ts
│   │   ├── saitama.ts
│   │   ├── rest.ts
│   │   └── utils.ts
│   ├── firebase.ts, plan-calculator.ts
├── types/              # TypeScript types
├── hooks/              # Custom hooks
├── data/               # Progression tree data
└── docs/CHANGELOG.md
```

## Unique Constraints
- State management: zustand only (Redux forbidden)
- localStorage persist + Firebase synchronization (server/client state separation)
- Firebase Auth (Google) + Firestore (workout records)
- Security Rules UID-based required
- Design: dark theme, yellow (#ffc107) / red (#ef4444) accent, mobile-first
- Styling: Tailwind v4 (@tailwindcss/vite), inline styles forbidden
- File naming: kebab-case, any type forbidden

## Verification Checklist
- [ ] Build: npm run build with no errors
- [ ] Workout record save -> Firebase sync
- [ ] RPE feedback -> volume auto-adjustment

## References
- CC/CX file ownership: agent_docs/domain-map.md
- CHANGELOG: docs/CHANGELOG.md
