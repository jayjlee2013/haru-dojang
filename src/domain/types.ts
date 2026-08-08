// 도메인 타입 전부 (04-tech-spec.md "데이터 모델" 섹션 기준)

// ---- 콘텐츠 (정적, content/) ----
export type Belt = 'white' | 'yellow' | 'green' | 'black' | 'master' // master = 무한 수련

// ---- i18n (한/영 지원) ----
export type Lang = 'ko' | 'en'
export interface LocalizedText {
  ko: string
  en: string
}

export interface GateDef {
  id: string // 'W1', 'Y-BOSS', 'B3' ... 자유 슬롯은 'Y4-free'
  belt: Belt
  order: number
  kind: 'normal' | 'boss' | 'free' // free = 사용자 정의 슬롯
  // 기본 관문(빌트인)은 LocalizedText, 자유/커스텀 관문은 사용자가 입력한 string. free면 없음.
  name?: string | LocalizedText
  rule: GateRule
  journalId: string // 클리어 시 열리는 일지 조각
}

export type GateRule =
  | { type: 'cumulative'; required: number; windowDays: number } // N일 안에 M번
  | { type: 'consecutive'; days: number } // 연속 N일 (보스전)

// ---- 사용자 상태 (저장 대상) ----
export interface CustomGate {
  id: string
  name: string
  rule: GateRule
}

export interface SaveData {
  schemaVersion: 1
  createdAt: string // ISO
  dayBoundaryHour: number // 기본 4
  currentGateId: string
  gates: Record<string, GateState>
  freeGateDefs: Record<string, { name: string; required: number; windowDays: number }>
  journalUnlocked: string[] // journalId 목록
  masterMode: {
    active: boolean
    customGates: CustomGate[] // 무한 수련 모드 관문
    journalEntries: { dayKey: string; text: string }[] // 일지 2권
  }
}

export interface GateState {
  status: 'locked' | 'active' | 'cleared'
  stamps: string[] // dayKey 목록 ('2026-07-06'), 정렬 유지, 중복 없음
  startedDayKey: string // 관문 시작일 (누적 판정 고정 기간의 기준)
  attempts: number // 재수련 횟수 (표시용 아님, 통계용)
  clearedAt?: string
}
