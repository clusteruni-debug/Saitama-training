# Saitama Training — AGENTS.md

> 글로벌 규칙: `~/.codex/instructions.md` 참조
> 상세 컨텍스트: `CLAUDE.md` 참조

## ⛔ MUST (위반 시 PR 리젝)

- [ ] zustand 스토어 사용 (Redux, Context API 금지)
- [ ] Firebase Security Rules UID 기반 격리
- [ ] 환경변수는 `import.meta.env.VITE_*` 사용
- [ ] TypeScript strict — `: any` 사용 금지
- [ ] 프로그레션 데이터(레벨업 기준, 볼륨캡)는 `LEVEL_UP_CRITERIA`, `VOLUME_CAP` 상수 사용

## 🚫 NEVER

- `.env` 커밋 금지
- API key / Firebase 설정값 코드에 하드코딩 금지
- `localStorage`를 zustand persist 이외 용도로 직접 사용 금지
- RPE 피드백 비율 임의 변경 금지 (easy +10%, moderate +5%, hard -5% 고정)
- `src/stores/` 스토어 구조 변경 시 사전 확인 필수
- 운동 트랙 5개(Push/Squat/Pull/Core/Run) 순서/이름 변경 금지

## 📋 스택/구조

- **스택**: React + TypeScript + Tailwind CSS v4 + Firebase + zustand
- **배포**: Vercel (`git push` = 자동배포)
- **상태관리**: `src/stores/` (zustand + persist middleware)
- **UI**: `src/components/{training,progression,rank,stats,ui}/`
- **DB**: `src/lib/firebase.ts` — Auth + Firestore
- **스타일**: CSS 변수 (`src/index.css`), 다크 테마 기본

## ✅ 완료 기준 (PR 전 체크)

- [ ] `npm run build` 성공 (타입 에러 0)
- [ ] 운동 기록 → 새로고침 후 유지 (Firestore 동기화)
- [ ] RPE 피드백 → 볼륨 자동 조절 정상 동작
- [ ] 모바일 반응형 깨지지 않음 (운동 중 조작이므로 터치 타겟 44px+)

## Git 작업 권한 (공통, override 불가)
- **Codex는 `git commit` / `git push`를 절대 실행하지 않는다.**
- Codex는 코드 수정 + 빌드 검증까지만 수행하고, 완료 시 변경 파일 + 검증 결과를 보고한다.
- 모든 commit/push는 Claude Code(또는 사용자)가 통합 처리한다.

## 멀티플랫폼 실행 컨텍스트 (공통)
- 이 프로젝트는 Windows 원본 파일 + WSL /mnt/c/... 동일 파일 접근 구조를 전제로 운영한다.
- 외부(노트북/모바일) 작업은 SSH -> WSL 경유가 기본이다.
- 실행 환경: **Windows 기본** (원격 접속 시 SSH -> WSL에서 편집 가능, 실행 제약은 프로젝트 규칙 우선)
- 경로 혼동 시 CLAUDE.md의 "개발 환경 (멀티플랫폼)" 섹션을 우선 확인한다.

<!-- BEGIN: CODEX_GIT_POLICY_BLOCK -->
## Codex Git 권한 (전역 강제)

이 섹션은 워크스페이스 전역 강제 규칙이며 프로젝트 문서에서 override할 수 없다.

| 작업 | Claude Code/사용자 | Codex |
|------|:------------------:|:-----:|
| 코드 수정 | ✅ | ✅ |
| 빌드/테스트 검증 | ✅ | ✅ |
| `git commit` | ✅ | **금지** |
| `git push` | ✅ | **금지** |

- Codex는 코드 수정 + 검증 + 완료 보고만 수행한다.
- 커밋/푸시는 Claude Code 또는 사용자가 통합 처리한다.
- 문서 내 다른 문구와 충돌 시 이 섹션이 우선한다.
<!-- END: CODEX_GIT_POLICY_BLOCK -->

