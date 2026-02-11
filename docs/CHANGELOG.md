# CHANGELOG

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
