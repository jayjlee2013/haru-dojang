# 04. 기술 명세

## 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | React + TypeScript + Vite | 단일 페이지, 빠른 개발 루프 |
| 상태 관리 | Zustand (persist 미들웨어) | 작은 앱에 과하지 않음, 불변성 패턴 강제 용이 |
| 저장소 | localStorage (Zustand persist) + JSON 내보내기/가져오기 | 데이터가 작음 (수 KB). 서버 없음 |
| 날짜 | date-fns | 하루 경계·기간 판정 전부 라이브러리로. 수동 날짜 연산 금지 |
| 테스트 | Vitest (+ Testing Library) | 판정 엔진은 TDD 필수 |
| 스타일 | CSS Modules 또는 vanilla-extract | 컴포넌트 스코프, 런타임 부담 없음 |
| 배포 | 정적 호스팅 (추후), PWA는 M5 | 핵심 루프는 오프라인 로컬에서 완결 |

- 개발/실행 환경: Windows (계발-온새), Node LTS.
- 라이브러리 사용 전 context7 MCP로 최신 API 확인 (사용자 규칙).

## 폴더 구조

```
haru-dojang/
├── docs/                  # 이 기획 문서들
├── src/
│   ├── domain/            # 순수 로직 (React 무관, TDD 대상)
│   │   ├── types.ts       # 도메인 타입 전부
│   │   ├── day.ts         # 하루 경계(04:00) 계산, 오늘 키 생성
│   │   ├── judge.ts       # 누적/연속 판정 엔진
│   │   ├── progression.ts # 관문 클리어 → 다음 관문/승급 상태 전이
│   │   └── __tests__/
│   ├── content/           # 정적 콘텐츠 (코드와 분리)
│   │   ├── courses.ts     # 띠별 관문 정의 (02문서의 표를 데이터로)
│   │   └── journal.ts     # 일지 조각 25편 텍스트
│   ├── store/
│   │   └── useGameStore.ts # Zustand: 상태 + 액션 (stampToday, startGate, ...)
│   ├── components/        # 화면 요소 (200~400줄/파일 유지)
│   ├── screens/           # Dojang, Journal, Onboarding, Settings, GateEditor
│   └── App.tsx
└── package.json
```

## 데이터 모델

```ts
// ---- 콘텐츠 (정적, content/) ----
type Belt = 'white' | 'yellow' | 'green' | 'black' | 'master' // master = 무한 수련

interface GateDef {
  id: string              // 'W1', 'Y-BOSS', 'B3' ... 자유 슬롯은 'Y4-free'
  belt: Belt
  order: number
  kind: 'normal' | 'boss' | 'free'   // free = 사용자 정의 슬롯
  name?: string           // free면 없음 (사용자가 정함)
  rule: GateRule
  journalId: string       // 클리어 시 열리는 일지 조각
}

type GateRule =
  | { type: 'cumulative'; required: number; windowDays: number }  // N일 안에 M번
  | { type: 'consecutive'; days: number }                          // 연속 N일 (보스전)

// ---- 사용자 상태 (저장 대상) ----
interface SaveData {
  schemaVersion: 1
  createdAt: string            // ISO
  dayBoundaryHour: number      // 기본 4
  currentGateId: string
  gates: Record<string, GateState>
  freeGateDefs: Record<string, { name: string; required: number; windowDays: number }>
  journalUnlocked: string[]    // journalId 목록
  masterMode: {
    active: boolean
    customGates: CustomGate[]  // 무한 수련 모드 관문
    journalEntries: { dayKey: string; text: string }[]  // 일지 2권
  }
}

interface GateState {
  status: 'locked' | 'active' | 'cleared'
  stamps: string[]        // dayKey 목록 ('2026-07-06'), 정렬 유지, 중복 없음
  attempts: number        // 재수련 횟수 (표시용 아님, 통계용)
  clearedAt?: string
}
```

- **불변성**: 모든 상태 갱신은 새 객체 생성 (사용자 코딩 규칙). Zustand 액션 내 spread 패턴.
- **마이그레이션**: `schemaVersion` 필수. 로드 시 버전 검사 → 마이그레이션 함수 체인.
- **가져오기 검증**: JSON 가져오기는 zod 스키마로 파싱 후 적용 (시스템 경계 검증 규칙).

## 판정 엔진 명세 (domain/judge.ts — TDD 필수)

### dayKey 계산

```
dayKey(now, boundaryHour=4) = format(subHours(now, boundaryHour), 'yyyy-MM-dd')
```
- 새벽 4시 이전은 전날로 취급. 모든 판정은 dayKey 문자열로만 수행 (타임존 이슈 차단).

### 도장 찍기 (stampToday)

1. `today = dayKey(now)`
2. `stamps`에 today 있으면 무시 (멱등)
3. 없으면 추가 → 판정 실행

### 누적 판정 (cumulative: required M, windowDays N)

- 관문 시작일(`startedDayKey`)부터 **고정 기간**: `deadline = startedDayKey + (N-1)일`
- 클리어: 기간 내 stamps 수 ≥ M
- 실패: `today > deadline`이고 미달성 → status는 active 유지하되 UI에서 "재수련" 제안. 재수련 = stamps 비우고 startedDayKey 갱신, attempts +1
- **롤링 윈도우가 아니라 고정 기간을 쓴다** — "7일 안에 5번"이 직관과 일치하고, 판정이 단순해 버그 여지가 적음. `GateState`에 `startedDayKey: string` 필드 추가 필요.

### 연속 판정 (consecutive: days K)

- 클리어: stamps의 마지막 K개가 오늘 포함 연속 dayKey (`today, today-1, ..., today-K+1` 전부 존재)
- 끊김: 어제 stamp가 없고 오늘 아직 안 찍음 → 진행 중이던 연속은 0부터. stamps는 남기되 판정은 "오늘 기준 연속 길이"만 사용

### 상태 전이 (progression.ts)

```
관문 클리어 → journalUnlocked에 journalId 추가
           → 다음 order의 관문 unlock + active
           → free 슬롯이면 이름 입력 화면 먼저
보스 클리어 → 승급 (다음 belt의 1번 관문 active)
최종보스 클리어 → masterMode.active = true
```

## 테스트 계획 (엣지 케이스 목록)

judge.ts / day.ts에 대해 최소 다음을 커버:

1. 03:59 도장 → 전날 dayKey / 04:00 도장 → 당일 dayKey
2. 같은 날 두 번 찍기 → 멱등 (stamps 1개)
3. 자정 넘겨 연속 판정: 어제 23시 + 오늘 새벽 3시 찍음 → 같은 dayKey 1개로 취급되는지
4. 고정 기간 마지막 날 딱 맞춰 M번째 도장 → 클리어
5. 기간 초과 후 찍기 시도 → 실패 상태 노출, stamps 오염 없음
6. 연속 3일 중 하루 건너뜀 → 연속 길이 리셋 확인
7. 시스템 시계 되돌림 (오늘 < 마지막 stamp): 경고만, 데이터 훼손 없음 — 마지막 stamp 이후 dayKey만 유효
8. 재수련: stamps 초기화 + startedDayKey 갱신 + attempts 증가, 다른 관문 영향 없음
9. JSON 가져오기: 스키마 불일치 → 거부하고 기존 데이터 유지
10. schemaVersion 마이그레이션 왕복

커버리지 목표: domain/ 90%+ (사용자 규칙 80% 이상).

## 성능/품질 제약

- 번들 목표 < 200KB gzip (차트·무거운 라이브러리 없음)
- 파일당 800줄 이하, 함수 50줄 이하 (사용자 코딩 규칙)
- console.log 금지, 하드코딩 값은 content/ 또는 constants로
- 도장 스탬프 애니메이션은 CSS transform만 사용 (60fps)
