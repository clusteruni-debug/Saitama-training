# CHANGELOG

## [2026-02-11] (세션 5)
> 🔧 UI/UX 개선 + 개인화 목적 설정 + 향후 플랜

### 개인화 목적 설정
- `src/types/index.ts` — `TrainingPurpose` 타입 추가 (saitama/strength/endurance/diet/health)
- `src/stores/useTrainingStore.ts` — `nickname`, `trainingPurpose`, `targetDate` 상태 + 액션 추가
- `src/components/onboarding/onboarding-page.tsx` — 4단계 온보딩 (목적→프로필→장비→레벨)
- `src/components/profile/profile-page.tsx` — 목표/닉네임/목적/기한 편집 UI

### 향후 플랜 (홈 위젯)
- `src/components/training/home-page.tsx` — 닉네임 인사 + D-day 카운트다운 + 다음 마일스톤 위젯

### 랭크업 애니메이션 강화
- `src/components/rank/rank-up-modal.tsx` — 파티클 폭죽 + 배지 회전 + 글로우 링 + 랭크별 색상/메시지
- `src/index.css` — rank-up-spin, particle-burst, glow-pulse, flame-flicker, progress-stripe 애니메이션 추가

### 스트릭 표시 강화
- `src/stores/useTrainingStore.ts` — `maxStreakDays` 추가 (persist + Firebase sync)
- `src/components/stats/streak-display.tsx` — 최고 기록 표시, 마일스톤 진행률 바, 불꽃 애니메이션, 스트릭 끊김 경고

### 주간/월간 차트 개선
- `src/components/stats/weekly-chart.tsx` — Y축 눈금, 합계/평균 표시, 평균 점선, 월간 30일 모드 지원
- `src/components/stats/stats-page.tsx` — 주간/월간 토글 UI 추가

### 운동 중 진행률 바
- `src/components/training/workout-page.tsx` — 상단 세트 진행률 바 + 세트별 결과 표시 + 휴식 중 이전 세트 결과

### 프로필 데이터 초기화
- `src/components/profile/profile-page.tsx` — 2단계 확인 모달 + 전체 데이터 리셋 기능
- `src/stores/useTrainingStore.ts` — `resetAllData()` 액션 추가

### Firebase sync
- `src/hooks/use-firebase-sync.ts` — `nickname`, `trainingPurpose`, `targetDate`, `maxStreakDays` 필드 추가

### 빌드
- 빌드 성공 검증 완료 (tsc -b + vite build)

---

## [2026-02-11] (세션 4)
> 🗺️ 로드맵/플랜 + Firebase sync 완성 + SW 업데이트

### 로드맵 & 플랜 계산기
- `src/lib/plan-calculator.ts` — RPE 히스토리 분석 → 세션당 평균 증가량 → 예상 주차/달성일 계산
- `src/types/index.ts` — `TrackGoal` 타입 추가 (목표 렙수 + 주 운동 빈도)
- `src/stores/useTrainingStore.ts` — `trackGoals` 상태 + `setTrackGoal` 액션 + persist
- `src/components/progression/progression-page.tsx` — 프로그레션 트리 → 로드맵 리라이트
- `src/components/progression/track-plan.tsx` — 트랙별 상세 플랜 (목표 편집, 빈도 비교, 마일스톤, 주간 플랜 바)

### Firebase sync 완성
- `src/hooks/use-firebase-sync.ts` — `mergeFromCloud` 전체 필드 병합 (기존 trackProgress만 → 13개 필드)
- `syncToFirebase`에 `trackGoals`, `programs`, `activeTracks` 추가
- `firestore.rules` — Firestore Security Rules (UID 기반 접근 제한)

### SW 개선
- `public/sw.js` v2 — 업데이트 감지 → `SW_UPDATED` 메시지 → 클라이언트 알림 바
- `index.html` — 1시간 주기 SW 업데이트 체크 + 업데이트 알림 UI

### 커밋
- `be82fa7` feat: 로드맵/플랜 계산기 + Firebase sync 완성 + SW 업데이트 알림

---

## [2026-02-11] (세션 3)
> 💪 3축 프로그레션 + 달리기 트랙 + 스마트 코치

### 달리기 트랙
- `src/data/progression-data.ts` — RUN_TRACK 6레벨 (걷기 → 10km)
- 전 컴포넌트 run 트랙 대응 (온보딩, 홈, 운동, 통계, 프로그레션)

### 3축 프로그레션
- 볼륨(렙↑, RPE_DELTA): easy +3, moderate +1, hard -1
- 스피드: 개인 최고 시간 추적 (bestSeconds)
- 난이도: 수동 레벨업 (코치 제안 → 유저 수락)

### 스마트 코치
- `src/lib/smart-coach.ts` — 프로그램 자동 생성 + 코치 팁 + 사이타마 진행률
- 홈 화면에 사이타마 프로그레스 바 + "내 프로그램" 섹션

### 커밋
- `5500d1b` feat: 3축 프로그레션 + 달리기 트랙 + 스마트 코치 + 사이타마 루틴

---

## [2026-02-11] (세션 2)
> 🚀 전체 앱 구현 — Phase 1~5 완료

### Phase 1: 코어 루프 MVP
- `src/data/progression-data.ts` — 4트랙 x 6레벨 = 24개 운동 정적 데이터
- `src/stores/useTrainingStore.ts` — 스토어 확장 (sessions, completeWorkout, 레벨업, 스트릭, 랭크)
- `src/components/ui/` — bottom-nav, card, button, progress-bar, toast
- `src/components/training/` — home-page, track-card, workout-page, set-counter, rep-counter, rest-timer, rpe-feedback
- `src/App.tsx` — 라우팅 (/, /workout/:track, /progression, /stats, /profile)
- `src/index.css` — 애니메이션 (slide-down, scale-in, fade-in)

### Phase 2: 프로그레션 트리 + 랭크
- `src/components/progression/` — progression-page, track-tree (수직 타임라인 UI)
- `src/components/rank/` — rank-badge (C/B/A/S), rank-up-modal (승급 애니메이션)
- 랭크 변경 감지 → RankUpModal 자동 표시

### Phase 3: 통계 대시보드
- `src/components/stats/` — stats-page, weekly-chart (SVG 바 차트), streak-display, track-summary
- 주간 볼륨 차트, 스트릭 카운터, 트랙별 진행률 바

### Phase 4: Firebase Auth + 동기화
- `src/stores/useAuthStore.ts` — 인증 전용 스토어
- `src/hooks/use-firebase-sync.ts` — Google 로그인 + Firestore 실시간 동기화 (디바운스 1.5초, 핑퐁 방지)
- `src/components/profile/` — profile-page, login-button, settings (휴식시간, 사운드 토글)

### Phase 5: PWA + 마감
- `public/manifest.json` — PWA 매니페스트
- `public/sw.js` — 서비스 워커 (네트워크 우선 + 캐시 폴백)
- `index.html` — PWA 메타태그 + SW 등록
- `vite.config.ts` — Firebase code-split (manualChunks)

### 기술 결정
- 단일 Zustand 스토어 + auth 별도 (앱 규모 고려)
- 차트: SVG/CSS 직접 구현 (의존성 최소화)
- 플랭크(시간 기반): reps 필드를 초 단위로 재활용, UI에서 분기
- 레벨업 조건: 20렙 도달 + easy 3연속

---

## [2026-02-11] (세션 1)
> 🔄 Supabase → Firebase 전환 + GitHub 연결

### 작업 내용
- Supabase 제거, Firebase SDK 설치
- `src/lib/firebase.ts` 생성 (Auth + Firestore)
- `src/lib/supabase.ts` 삭제
- zustand persist 미들웨어 적용 (localStorage 자동 저장)
- `.env.example` Firebase 환경변수로 업데이트
- CLAUDE.md 전체 Supabase → Firebase 반영
- GitHub remote 연결 + push

---

## [2026-02-11] (세션 0)
> 📦 프로젝트 초기화 | React + TypeScript + Tailwind + Supabase

### 작업 내용
- Vite + React + TypeScript 스캐폴딩
- Tailwind CSS v4 (@tailwindcss/vite) 설정
- zustand 상태관리, react-router-dom 라우팅
- Supabase 클라이언트 설정 (`src/lib/supabase.ts`)
- 타입 정의 (`src/types/index.ts`)
- 기본 스토어 (`src/stores/useTrainingStore.ts`)
- 폴더 구조 생성 (components, stores, lib, types, hooks)
- CLAUDE.md 프로젝트 컨텍스트 작성
