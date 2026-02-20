# Saitama Training — 원펀 트레이닝

## 스택
React + TypeScript + Tailwind CSS v4 + Firebase + zustand

## 실행
```bash
cp .env.example .env    # Firebase 환경변수 설정
npm install
npm run dev             # http://localhost:5173
```

## 배포
Vercel (git push = 자동 배포)

## 구조
```
src/
├── components/         # training/, progression/, rank/, stats/, ui/
├── stores/             # zustand 스토어 (기능별 분리)
├── lib/                # firebase.ts, smart-coach.ts, plan-calculator.ts
├── types/              # TypeScript 타입
├── hooks/              # 커스텀 훅
├── data/               # 프로그레션 트리 데이터
└── docs/CHANGELOG.md
```

## 고유 제약
- 상태관리: zustand만 사용 (Redux 금지)
- localStorage persist + Firebase 동기화 (서버/클라이언트 상태 분리)
- Firebase Auth (Google) + Firestore (운동 기록)
- Security Rules UID 기반 필수
- 디자인: 다크 테마, 노란색(#ffc107)/빨간색(#ef4444) 액센트, 모바일 퍼스트
- 스타일: Tailwind v4 (@tailwindcss/vite), 인라인 스타일 금지
- 파일명: kebab-case, any 타입 금지

## 검증 체크리스트
- [ ] 빌드: npm run build 에러 없음
- [ ] 운동 기록 저장 → Firebase 동기화
- [ ] RPE 피드백 → 볼륨 자동 조절

## 참조
- CC/CX 파일 담당: agent_docs/domain-map.md
- CHANGELOG: docs/CHANGELOG.md
