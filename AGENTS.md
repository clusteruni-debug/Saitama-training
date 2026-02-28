# Saitama Training — AGENTS.md

> Global rules: See `~/.codex/instructions.md`
> Detailed context: See `CLAUDE.md`

## MUST (PR rejected if violated)

- [ ] Use zustand stores (Redux, Context API forbidden)
- [ ] Firebase Security Rules UID-based isolation
- [ ] Environment variables use `import.meta.env.VITE_*`
- [ ] TypeScript strict — no `: any` usage
- [ ] Progression data (level-up criteria, volume caps) must use `LEVEL_UP_CRITERIA`, `VOLUME_CAP` constants

## NEVER

- Never commit `.env`
- Never hardcode API keys / Firebase config values in code
- Never use `localStorage` directly for purposes other than zustand persist
- Never arbitrarily change RPE feedback ratios (fixed: easy +10%, moderate +5%, hard -5%)
- Never change `src/stores/` store structure without prior approval
- Never change the order/names of the 5 exercise tracks (Push/Squat/Pull/Core/Run)

## Stack / Structure

- **Stack**: React + TypeScript + Tailwind CSS v4 + Firebase + zustand
- **Deployment**: Vercel (`git push` = auto-deploy)
- **State Management**: `src/stores/` (zustand + persist middleware)
- **UI**: `src/components/{training,progression,rank,stats,ui}/`
- **DB**: `src/lib/firebase.ts` — Auth + Firestore
- **Styling**: CSS variables (`src/index.css`), dark theme default

## Definition of Done (Pre-PR Checklist)

- [ ] `npm run build` succeeds (0 type errors)
- [ ] Workout record -> persists after refresh (Firestore sync)
- [ ] RPE feedback -> volume auto-adjustment works correctly
- [ ] Mobile responsive not broken (touch target 44px+ since used during workouts)

## Git Permissions (Common, cannot be overridden)
- **Codex must NEVER run `git commit` / `git push`.**
- Codex performs code changes + build verification only, and reports changed files + verification results upon completion.
- All commit/push operations are handled by Claude Code (or the user).

## Multi-Platform Execution Context (Common)
- This project operates on the premise of Windows source files + WSL /mnt/c/... accessing the same files.
- External (laptop/mobile) work defaults to SSH -> WSL.
- Execution environment: **Windows default** (remote access via SSH -> WSL for editing, execution constraints follow project rules)
- When confused about paths, refer to the "Development Environment (Multi-Platform)" section in CLAUDE.md first.

<!-- BEGIN: CODEX_GIT_POLICY_BLOCK -->
## Codex Git Permissions (Global Enforcement)

This section is a workspace-wide enforced rule and cannot be overridden by project documents.

| Action | Claude Code/User | Codex |
|--------|:----------------:|:-----:|
| Code changes | YES | YES |
| Build/test verification | YES | YES |
| `git commit` | YES | **Forbidden** |
| `git push` | YES | **Forbidden** |

- Codex performs code changes + verification + completion reporting only.
- Commits/pushes are handled by Claude Code or the user.
- This section takes precedence over any conflicting statements in the document.
<!-- END: CODEX_GIT_POLICY_BLOCK -->
