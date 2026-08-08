import { addDays, format, parseISO } from 'date-fns'
import type { GateState, GateRule } from './types'

const DAY_KEY_FORMAT = 'yyyy-MM-dd'

type CumulativeRule = Extract<GateRule, { type: 'cumulative' }>
type ConsecutiveRule = Extract<GateRule, { type: 'consecutive' }>

export interface CumulativeResult {
  cleared: boolean
  failed: boolean
  count: number
  deadline: string
}

export interface ConsecutiveResult {
  cleared: boolean
  streak: number
}

export type JudgeResult =
  | ({ type: 'cumulative' } & CumulativeResult)
  | ({ type: 'consecutive' } & ConsecutiveResult)

/** dayKey 문자열에 일수를 더한 새 dayKey를 반환한다 (date-fns 사용, 수동 연산 금지). */
export function addDayKey(key: string, days: number): string {
  return format(addDays(parseISO(key), days), DAY_KEY_FORMAT)
}

/**
 * 시스템 시계 되돌림 여부: 오늘 dayKey가 마지막 stamp보다 과거이면 true.
 * (테스트 계획 케이스 7 — 경고만, 데이터 훼손 없음)
 */
export function isClockRollback(state: GateState, today: string): boolean {
  const last = state.stamps[state.stamps.length - 1]
  if (last === undefined) return false
  return today < last
}

/**
 * 도장 찍기: today를 stamps에 추가한다.
 * - 이미 있으면 멱등 (그대로 반환)
 * - 마지막 stamp보다 과거인 dayKey는 무시 (시계 되돌림 방지)
 * - 정렬 유지, 중복 없음, 원본 불변
 */
export function stampGate(state: GateState, today: string): GateState {
  if (state.stamps.includes(today)) return state
  if (isClockRollback(state, today)) return state
  const stamps = [...state.stamps, today].sort()
  return { ...state, stamps }
}

/** 고정 기간 [startedDayKey, deadline] 안에 들어오는 stamp만 센다. */
function countStampsInWindow(stamps: string[], start: string, deadline: string): number {
  return stamps.filter((s) => s >= start && s <= deadline).length
}

/**
 * 누적 판정 (고정 기간 방식 — 롤링 윈도우 아님).
 * deadline = startedDayKey + (windowDays - 1)일.
 * 클리어: 기간 내 stamps 수 ≥ required.
 * 실패: today > deadline 이고 미달성.
 */
export function judgeCumulative(
  state: GateState,
  rule: CumulativeRule,
  today: string
): CumulativeResult {
  const deadline = addDayKey(state.startedDayKey, rule.windowDays - 1)
  const count = countStampsInWindow(state.stamps, state.startedDayKey, deadline)
  const cleared = count >= rule.required
  const failed = !cleared && today > deadline
  return { cleared, failed, count, deadline }
}

/**
 * 연속 판정.
 * streak = 오늘부터 거꾸로 연속으로 존재하는 stamp의 길이 (오늘 stamp가 없으면 0).
 * 클리어: streak ≥ days.
 */
export function judgeConsecutive(
  state: GateState,
  rule: ConsecutiveRule,
  today: string
): ConsecutiveResult {
  const present = new Set(state.stamps)
  let streak = 0
  let cursor = today
  while (present.has(cursor)) {
    streak += 1
    cursor = addDayKey(cursor, -1)
  }
  return { cleared: streak >= rule.days, streak }
}

export type StampContext = 'return' | 'streak' | 'normal'

/**
 * 오늘 도장을 찍기 직전 상태(stamps에 오늘은 아직 없음)로 관장의 반응 맥락을 판단한다.
 * return = 어제 걸렀다가 돌아옴, streak = 오늘 포함 3일 이상 연속, normal = 그 외(첫날 포함).
 */
export function stampContext(stamps: string[], today: string): StampContext {
  const set = new Set(stamps)
  const yesterday = addDayKey(today, -1)
  if (set.size > 0 && !set.has(yesterday)) return 'return'
  let streak = 1
  let cursor = yesterday
  while (set.has(cursor)) {
    streak += 1
    cursor = addDayKey(cursor, -1)
  }
  return streak >= 3 ? 'streak' : 'normal'
}

/** rule 종류에 따라 누적/연속 판정으로 위임한다. */
export function judgeGate(state: GateState, rule: GateRule, today: string): JudgeResult {
  if (rule.type === 'cumulative') {
    return { type: 'cumulative', ...judgeCumulative(state, rule, today) }
  }
  return { type: 'consecutive', ...judgeConsecutive(state, rule, today) }
}

/**
 * 재수련: stamps를 비우고 startedDayKey를 오늘로 갱신, attempts +1.
 * status는 active 유지. 원본 불변.
 */
export function retrainGate(state: GateState, today: string): GateState {
  return {
    ...state,
    status: 'active',
    stamps: [],
    startedDayKey: today,
    attempts: state.attempts + 1
  }
}
