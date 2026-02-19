# Codex Review Report

- Project: `Saitama-training`
- Reviewer: `Codex (GPT-5 coding agent)`
- Date: `2026-02-16`
- Scope: Static review + lint/build validation

## Findings

### 1) [Critical] Side effects are executed during render in run workout flow

- File:
  - `src/components/training/workout-page.tsx:302`
  - `src/components/training/workout-page.tsx:303`
  - `src/components/training/workout-page.tsx:305`
- Observation:
  - Component render path contains imperative logic:
    - clears interval ref
    - calls `setIsRunning(false)`
    - calls `setPhase('rpe')`
  - This is render-time state mutation, not effect/event-driven logic.
- Impact:
  - Can cause unstable re-render loops and timing bugs under React 19 strict/compiler rules.
- Recommended fix:
  - Move completion transition logic into `useEffect` with proper dependencies (`elapsed`, `targetSeconds`, `isRunning`).

### 2) [High] Impure initialization in render path (`Date.now`) flagged by React rules

- File:
  - `src/components/training/workout-page.tsx:29`
- Observation:
  - `useRef(Date.now())` is treated as impure render-time call by current React lint/compiler set.
- Impact:
  - Non-idempotent render behavior risk and compiler optimization skip.
- Recommended fix:
  - Initialize with stable value and assign timestamp in event/effect (`start`/`warmup done`) instead of render call.

### 3) [High] Hook effect references functions before declaration in sync hook

- File:
  - `src/hooks/use-firebase-sync.ts:29`
  - `src/hooks/use-firebase-sync.ts:50`
  - `src/hooks/use-firebase-sync.ts:68`
  - `src/hooks/use-firebase-sync.ts:75`
  - `src/hooks/use-firebase-sync.ts:92`
  - `src/hooks/use-firebase-sync.ts:130`
- Observation:
  - Effects call `loadFromFirebase`, `mergeFromCloud`, `syncToFirebase` before their declaration.
  - Current lint config flags this as unstable closure/dependency issue.
- Impact:
  - Increased risk of stale references and difficult-to-debug synchronization behavior.
- Recommended fix:
  - Hoist stable callbacks (`useCallback`) before effects, then reference those callbacks in effects with explicit deps.

### 4) [Medium] Rank-up modal trigger uses effect-based setState pattern flagged by React rules

- File:
  - `src/App.tsx:25`
  - `src/App.tsx:27`
- Observation:
  - Effect compares ref and immediately sets state.
- Impact:
  - Extra render churn and compiler warnings in strict rule set.
- Recommended fix:
  - Derive modal trigger from store transition event or reducer-driven action instead of effect-side state copy.

### 5) [Low] Toast global listener registry uses module-level mutable singleton

- File:
  - `src/components/ui/toast.tsx:10`
  - `src/components/ui/toast.tsx:12`
  - `src/components/ui/toast.tsx:23`
- Observation:
  - `toastListeners` is shared mutable module state.
- Impact:
  - Harder lifecycle reasoning in HMR/multi-root scenarios.
- Recommended fix:
  - Replace with context/store-based emitter or scoped event bus.

## Validation Notes

- `npm run lint`: failed with 10 errors / 3 warnings.
- `npm run build`: failed in this environment with `spawn EPERM` (esbuild process spawn issue), so full build validation was not possible here.
