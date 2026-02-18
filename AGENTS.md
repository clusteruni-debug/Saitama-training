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
