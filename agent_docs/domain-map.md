# Saitama Training — CC/CX File Ownership

| Domain | File/Directory | Owner | Rationale |
|--------|---------------|:-----:|-----------|
| State Management | src/stores/* | CC | Zustand, global state |
| Firebase Integration | src/lib/firebase.ts, src/hooks/use-firebase-sync.ts | CC | DB synchronization |
| Coaching Logic | src/lib/smart-coach.ts, src/lib/plan-calculator.ts | CC | Business logic |
| Type Definitions | src/types/* | CC | Shared interfaces |
| UI Components | src/components/** | CX | Repetitive patterns |
| Data | src/data/* | CX | Static data |
| Environment Config | .env* | Manual | — |
