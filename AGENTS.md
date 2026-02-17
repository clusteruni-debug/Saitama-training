# Saitama Training — AGENTS.md

> 글로벌 규칙: `~/.codex/instructions.md` 참조

## 개요
- **스택**: React + TypeScript + Tailwind CSS v4 + Firebase + zustand
- **배포**: Vercel (git push = 자동배포)
- **DB**: Firebase (Firestore)

## 디렉토리 구조
- `src/components/` — UI 컴포넌트
- `src/stores/` — zustand 상태관리
- `src/lib/firebase.ts` — Firebase 설정
- `src/types/` — TypeScript 타입 정의

## 주의사항
- Firebase Security Rules UID 기반 격리
- PWA 지원
- 비율 기반 RPE 피드백 시스템
