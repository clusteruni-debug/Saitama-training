# CHANGELOG

## [2026-02-13] (Session 8)
> GitHub Pages Deployment + PWA Completion — Production-Ready State

### GitHub Pages Deployment
- `.github/workflows/deploy.yml` — auto build + GitHub Pages deploy on main push
- `vite.config.ts` — added `base: '/Saitama-training/'`
- Deploy URL: https://clusteruni-debug.github.io/Saitama-training/

### Path Fixes (GitHub Pages Subdirectory Support)
- `src/App.tsx` — added `BrowserRouter basename="/Saitama-training"`
- `index.html` — manifest, favicon, apple-touch-icon, SW registration paths all prefixed with `/Saitama-training/`
- `public/manifest.json` — `start_url`, icon paths all prefixed with `/Saitama-training/`

### PWA Enhancements
- `public/sw.js` v3 — BASE path reflection, offline SPA fallback (navigate request -> index.html)
- `public/icon-192.png`, `public/icon-512.png` — SVG -> PNG conversion (PWA install compatibility)
- `public/manifest.json` — added PNG icon entries (`purpose: "any maskable"`)

### CLAUDE.md
- Deploy URL changed from Vercel to GitHub Pages
- Roadmap: P0/P1 all completed, P2 PWA+deploy completed

### Build
- tsc + vite build verified successfully

---

## [2026-02-12] (Session 7)
> Training Theory Enhancement + UX Improvements — Deload/Overtraining/Plateau Detection, Smart Rest, Warmup, RPE Improvements

### Smart Coach — Deload/Overtraining/Plateau Detection
- `src/lib/smart-coach.ts` — 3 new coach tip types added
  - `deload-suggest`: 14+ consecutive training days + hard ratio > 30% -> deload week recommendation
  - `overtraining-warning`: Last 3 sessions all hard -> overtraining warning (priority: 11)
  - `plateau-warning`: Volume cap reached + no level-up / moderate-only for 14 days -> plateau detection
- `suggestRestSeconds()` function added — NSCA-based optimal rest time per rep range
- Max coach tips display 3 -> 5 (to include critical warnings)

### Smart Rest Timer
- `src/components/training/rest-timer.tsx` — fixed 60s -> rep-based auto recommendation
  - 1-5 reps: 120s, 6-12 reps: 75s, 13-20 reps: 60s, 21+ reps: 45s
  - +/-15s adjustment buttons added (personal preference)
  - Rep range guide message display

### RPE Feedback Improvements
- `src/components/training/rpe-feedback.tsx` — ratio-based predicted reps real-time display
  - "Next: 22 (+2, +10%)" format prediction display
  - "Form broke down" form quality toggle added -> additional -5% applied when selected
- `src/stores/useTrainingStore.ts` — added formBroken parameter to `completeWorkout`

### Warmup Phase
- `src/components/training/workout-page.tsx` — warmup screen added before workout starts
  - Phase now includes `'warmup'`: warmup -> exercise -> rest -> rpe -> done
  - 50% of current reps recommended for warmup, skip option available
  - Running-specific warmup (5-min walk + stretching)
  - Warmup not included in records (startTimeRef reset after warmup)

### Set Results During Rest
- `src/components/training/workout-page.tsx` — full set results list displayed during rest
  - Checkmark Set 1: 10 reps / Checkmark Set 2: 10 reps / -> Set 3 waiting

### Home Screen Recovery Status
- `src/components/training/home-page.tsx` — deload/overtraining banner (top of home)
- `src/components/training/track-card.tsx` — per-track recovery status display
  - <24h: "Recovering" (orange) / 24-48h: "Almost recovered" (yellow) / 48h+: "Fully recovered" (green)

### plan-calculator Ratio-Based Conversion
- `src/lib/plan-calculator.ts` — `RPE_DELTA` constant -> `calculateRepsDelta()` function
  - Expected timeline differs for someone at 10 reps vs 50 reps (accurate prediction)
  - Per-session rep reflection with cumulative calculation in loop

### Methodology Page Expansion
- `src/components/profile/methodology-page.tsx` — 3 sections added
  - Deload and Recovery — 50% volume reduction every 3-4 weeks, overtraining symptoms, app auto-detection
  - Smart Rest Time — NSCA-based optimal rest per rep range (table)
  - Importance of Warmup — injury prevention, performance, neural activation
  - Added Schoenfeld & Grgic (2019) to references

### Build
- tsc + vite build verified successfully

---

## [2026-02-11] (Session 6)
> Training Methodology Improvements + Methodology Explanation Page

### Ratio-Based RPE Progression
- `src/data/progression-data.ts` — `RPE_DELTA` constant -> `calculateRepsDelta()` function replacement
- Ratio-based (+10%/+5%/-5%) instead of fixed values (+3) — increment proportional to rep scale
- Evidence: Schoenfeld 2017 (5-10% weekly increase), Helms 2016 (RPE auto-regulation)

### Track/Level-Specific Level-Up Criteria
- `src/data/progression-data.ts` — added `LEVEL_UP_CRITERIA` (5 tracks x 5 levels)
- Before: Same criteria for all tracks (minReps: 50, consecutiveEasy: 5) -> 50 pull-ups unrealistic
- After: Pull Lv2->3 requires 10+ and 4 consecutive easy, Push Lv2->3 requires 25+ and 3 consecutive easy, etc.
- Higher difficulty movements have higher consecutiveEasy (4-5) -> safer transitions

### Volume Cap (Max Reps Per Level)
- `src/data/progression-data.ts` — added `VOLUME_CAP`
- Excessive reps (50+ push-ups) become endurance training, so per-level caps applied
- `src/stores/useTrainingStore.ts` — cap applied in `completeWorkout`

### smart-coach Improvements
- `src/lib/smart-coach.ts` — `DIFFICULTY_UP_THRESHOLD` -> `LEVEL_UP_CRITERIA` usage
- Program description "+3 each" -> "+10% each" reflected

### Methodology Explanation Page (New)
- `src/components/profile/methodology-page.tsx` — progressive overload, RPE auto-regulation, level-up criteria, volume cap, references
- Includes current progress bar (reps + consecutive easy count)
- `src/App.tsx` — `/methodology` route added
- `src/components/profile/profile-page.tsx` — "Training Methodology" link button added

### Build
- tsc + vite build verified successfully

---

## [2026-02-11] (Session 5)
> UI/UX Improvements + Personalized Purpose Settings + Future Plan

### Personalized Purpose Settings
- `src/types/index.ts` — added `TrainingPurpose` type (saitama/strength/endurance/diet/health)
- `src/stores/useTrainingStore.ts` — added `nickname`, `trainingPurpose`, `targetDate` state + actions
- `src/components/onboarding/onboarding-page.tsx` — 4-step onboarding (purpose -> profile -> equipment -> level)
- `src/components/profile/profile-page.tsx` — goal/nickname/purpose/deadline edit UI

### Future Plan (Home Widget)
- `src/components/training/home-page.tsx` — nickname greeting + D-day countdown + next milestone widget

### Rank-Up Animation Enhancement
- `src/components/rank/rank-up-modal.tsx` — particle fireworks + badge rotation + glow ring + rank-specific colors/messages
- `src/index.css` — rank-up-spin, particle-burst, glow-pulse, flame-flicker, progress-stripe animations added

### Streak Display Enhancement
- `src/stores/useTrainingStore.ts` — added `maxStreakDays` (persist + Firebase sync)
- `src/components/stats/streak-display.tsx` — best record display, milestone progress bar, flame animation, streak break warning

### Weekly/Monthly Chart Improvements
- `src/components/stats/weekly-chart.tsx` — Y-axis ticks, total/average display, average dashed line, monthly 30-day mode support
- `src/components/stats/stats-page.tsx` — weekly/monthly toggle UI added

### In-Workout Progress Bar
- `src/components/training/workout-page.tsx` — top set progress bar + per-set result display + previous set result during rest

### Profile Data Reset
- `src/components/profile/profile-page.tsx` — 2-step confirmation modal + full data reset feature
- `src/stores/useTrainingStore.ts` — added `resetAllData()` action

### Firebase sync
- `src/hooks/use-firebase-sync.ts` — added `nickname`, `trainingPurpose`, `targetDate`, `maxStreakDays` fields

### Build
- Build verified successfully (tsc -b + vite build)

---

## [2026-02-11] (Session 4)
> Roadmap/Plan + Firebase Sync Completion + SW Update

### Roadmap & Plan Calculator
- `src/lib/plan-calculator.ts` — RPE history analysis -> average per-session increase -> estimated weeks/achievement date calculation
- `src/types/index.ts` — added `TrackGoal` type (target reps + weekly frequency)
- `src/stores/useTrainingStore.ts` — `trackGoals` state + `setTrackGoal` action + persist
- `src/components/progression/progression-page.tsx` — progression tree -> roadmap rewrite
- `src/components/progression/track-plan.tsx` — per-track detailed plan (goal editing, frequency comparison, milestones, weekly plan bar)

### Firebase Sync Completion
- `src/hooks/use-firebase-sync.ts` — `mergeFromCloud` full field merge (previously trackProgress only -> now 13 fields)
- Added `trackGoals`, `programs`, `activeTracks` to `syncToFirebase`
- `firestore.rules` — Firestore Security Rules (UID-based access restriction)

### SW Improvements
- `public/sw.js` v2 — update detection -> `SW_UPDATED` message -> client notification bar
- `index.html` — 1-hour periodic SW update check + update notification UI

### Commits
- `be82fa7` feat: roadmap/plan calculator + Firebase sync completion + SW update notification

---

## [2026-02-11] (Session 3)
> 3-Axis Progression + Running Track + Smart Coach

### Running Track
- `src/data/progression-data.ts` — RUN_TRACK 6 levels (walking -> 10km)
- All components support run track (onboarding, home, workout, stats, progression)

### 3-Axis Progression
- Volume (reps up, RPE_DELTA): easy +3, moderate +1, hard -1
- Speed: personal best time tracking (bestSeconds)
- Difficulty: manual level-up (coach suggestion -> user acceptance)

### Smart Coach
- `src/lib/smart-coach.ts` — auto program generation + coach tips + Saitama progress
- Home screen Saitama progress bar + "My Programs" section

### Commits
- `5500d1b` feat: 3-axis progression + running track + smart coach + Saitama routine

---

## [2026-02-11] (Session 2)
> Full App Implementation — Phase 1-5 Completed

### Phase 1: Core Loop MVP
- `src/data/progression-data.ts` — 4 tracks x 6 levels = 24 exercises static data
- `src/stores/useTrainingStore.ts` — store extended (sessions, completeWorkout, level-up, streak, rank)
- `src/components/ui/` — bottom-nav, card, button, progress-bar, toast
- `src/components/training/` — home-page, track-card, workout-page, set-counter, rep-counter, rest-timer, rpe-feedback
- `src/App.tsx` — routing (/, /workout/:track, /progression, /stats, /profile)
- `src/index.css` — animations (slide-down, scale-in, fade-in)

### Phase 2: Progression Tree + Rank
- `src/components/progression/` — progression-page, track-tree (vertical timeline UI)
- `src/components/rank/` — rank-badge (C/B/A/S), rank-up-modal (promotion animation)
- Rank change detection -> RankUpModal auto-display

### Phase 3: Stats Dashboard
- `src/components/stats/` — stats-page, weekly-chart (SVG bar chart), streak-display, track-summary
- Weekly volume chart, streak counter, per-track progress bar

### Phase 4: Firebase Auth + Sync
- `src/stores/useAuthStore.ts` — auth-only store
- `src/hooks/use-firebase-sync.ts` — Google login + Firestore real-time sync (debounce 1.5s, ping-pong prevention)
- `src/components/profile/` — profile-page, login-button, settings (rest time, sound toggle)

### Phase 5: PWA + Finishing
- `public/manifest.json` — PWA manifest
- `public/sw.js` — Service Worker (network-first + cache fallback)
- `index.html` — PWA meta tags + SW registration
- `vite.config.ts` — Firebase code-split (manualChunks)

### Technical Decisions
- Single Zustand store + separate auth (considering app scale)
- Charts: Direct SVG/CSS implementation (minimal dependencies)
- Plank (time-based): reps field reused as seconds, UI branching
- Level-up condition: 20 reps reached + 3 consecutive easy

---

## [2026-02-11] (Session 1)
> Supabase -> Firebase Migration + GitHub Connection

### Work Done
- Removed Supabase, installed Firebase SDK
- Created `src/lib/firebase.ts` (Auth + Firestore)
- Deleted `src/lib/supabase.ts`
- Applied zustand persist middleware (localStorage auto-save)
- Updated `.env.example` to Firebase environment variables
- Updated CLAUDE.md to reflect Supabase -> Firebase change
- GitHub remote connected + push

---

## [2026-02-11] (Session 0)
> Project Initialization | React + TypeScript + Tailwind + Supabase

### Work Done
- Vite + React + TypeScript scaffolding
- Tailwind CSS v4 (@tailwindcss/vite) setup
- zustand state management, react-router-dom routing
- Supabase client setup (`src/lib/supabase.ts`)
- Type definitions (`src/types/index.ts`)
- Base store (`src/stores/useTrainingStore.ts`)
- Folder structure created (components, stores, lib, types, hooks)
- CLAUDE.md project context written
