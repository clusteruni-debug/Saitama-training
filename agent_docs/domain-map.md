# Saitama Training — CC/CX 파일 담당

| 영역 | 파일/디렉토리 | 담당 | 근거 |
|------|-------------|:----:|------|
| 상태 관리 | src/stores/* | CC | Zustand, 전역 상태 |
| Firebase 연동 | src/lib/firebase.ts, src/hooks/use-firebase-sync.ts | CC | DB 동기화 |
| 코칭 로직 | src/lib/smart-coach.ts, src/lib/plan-calculator.ts | CC | 비즈니스 로직 |
| 타입 정의 | src/types/* | CC | 공유 인터페이스 |
| UI 컴포넌트 | src/components/** | CX | 패턴 반복 |
| 데이터 | src/data/* | CX | 정적 데이터 |
| 환경 설정 | .env* | 수동 | — |
