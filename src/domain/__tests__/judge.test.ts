import { describe, it, expect } from 'vitest'
import {
  addDayKey,
  stampGate,
  judgeCumulative,
  judgeConsecutive,
  judgeGate,
  retrainGate,
  isClockRollback
} from '../judge'
import type { GateState, GateRule } from '../types'

function makeState(overrides: Partial<GateState> = {}): GateState {
  return {
    status: 'active',
    stamps: [],
    startedDayKey: '2026-07-06',
    attempts: 0,
    ...overrides
  }
}

describe('addDayKey (dayKey 문자열 산술)', () => {
  it('dayKey에 일수를 더한다', () => {
    expect(addDayKey('2026-07-06', 4)).toBe('2026-07-10')
  })

  it('음수도 처리한다', () => {
    expect(addDayKey('2026-07-06', -2)).toBe('2026-07-04')
  })

  it('월 경계를 넘는다', () => {
    expect(addDayKey('2026-07-30', 3)).toBe('2026-08-02')
  })
})

describe('stampGate — 도장 찍기 (멱등)', () => {
  // 테스트 계획 케이스 2: 같은 날 두 번 찍기 → 멱등 (stamps 1개)
  it('같은 dayKey를 두 번 찍어도 stamps는 1개다 (멱등)', () => {
    const s1 = stampGate(makeState(), '2026-07-06')
    const s2 = stampGate(s1, '2026-07-06')
    expect(s2.stamps).toEqual(['2026-07-06'])
  })

  it('서로 다른 날을 순서대로 찍으면 모두 추가되고 정렬 상태를 유지한다', () => {
    let s = makeState()
    s = stampGate(s, '2026-07-06')
    s = stampGate(s, '2026-07-07')
    s = stampGate(s, '2026-07-08')
    expect(s.stamps).toEqual(['2026-07-06', '2026-07-07', '2026-07-08'])
  })

  it('불변성: 원본 state를 변경하지 않는다', () => {
    const original = makeState()
    const next = stampGate(original, '2026-07-06')
    expect(original.stamps).toEqual([])
    expect(next).not.toBe(original)
  })

  // 테스트 계획 케이스 7: 시스템 시계 되돌림 — 마지막 stamp 이전 dayKey는 무효
  it('마지막 stamp보다 과거의 dayKey는 무시한다 (시계 되돌림 방지)', () => {
    const s = makeState({ stamps: ['2026-07-06', '2026-07-07'] })
    const next = stampGate(s, '2026-07-05')
    expect(next.stamps).toEqual(['2026-07-06', '2026-07-07'])
  })
})

describe('isClockRollback — 시계 되돌림 감지', () => {
  // 테스트 계획 케이스 7: 오늘 < 마지막 stamp 감지 (경고만)
  it('오늘이 마지막 stamp보다 과거면 true', () => {
    const s = makeState({ stamps: ['2026-07-06', '2026-07-07'] })
    expect(isClockRollback(s, '2026-07-05')).toBe(true)
  })

  it('오늘이 마지막 stamp와 같거나 이후면 false', () => {
    const s = makeState({ stamps: ['2026-07-06', '2026-07-07'] })
    expect(isClockRollback(s, '2026-07-07')).toBe(false)
    expect(isClockRollback(s, '2026-07-08')).toBe(false)
  })

  it('stamp가 없으면 false', () => {
    expect(isClockRollback(makeState(), '2026-07-01')).toBe(false)
  })
})

describe('judgeCumulative — 누적 판정 (고정 기간)', () => {
  const rule: Extract<GateRule, { type: 'cumulative' }> = {
    type: 'cumulative',
    required: 5,
    windowDays: 7
  }

  it('deadline = startedDayKey + (windowDays - 1)일', () => {
    const s = makeState({ startedDayKey: '2026-07-06' })
    const result = judgeCumulative(s, rule, '2026-07-06')
    expect(result.deadline).toBe('2026-07-12')
  })

  // 테스트 계획 케이스 4: 고정 기간 마지막 날 딱 맞춰 M번째 도장 → 클리어
  it('마지막 날에 M번째 도장을 찍으면 클리어', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-12']
    })
    const result = judgeCumulative(s, rule, '2026-07-12')
    expect(result.cleared).toBe(true)
    expect(result.failed).toBe(false)
    expect(result.count).toBe(5)
  })

  it('기간 내 도장이 M 미만이고 아직 마감 전이면 진행 중 (클리어/실패 아님)', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-06', '2026-07-07']
    })
    const result = judgeCumulative(s, rule, '2026-07-08')
    expect(result.cleared).toBe(false)
    expect(result.failed).toBe(false)
    expect(result.count).toBe(2)
  })

  // 테스트 계획 케이스 5: 기간 초과 후 미달성 → 실패 상태 노출
  it('deadline을 넘겼고 M 미달성이면 실패', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-06', '2026-07-07', '2026-07-08']
    })
    const result = judgeCumulative(s, rule, '2026-07-13')
    expect(result.cleared).toBe(false)
    expect(result.failed).toBe(true)
  })

  it('기간 밖의 stamp는 count에 포함하지 않는다 (고정 기간)', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      // 2026-07-13, 2026-07-14는 deadline(2026-07-12) 이후 → 제외
      stamps: ['2026-07-06', '2026-07-07', '2026-07-13', '2026-07-14']
    })
    const result = judgeCumulative(s, rule, '2026-07-14')
    expect(result.count).toBe(2)
  })

  it('startedDayKey 이전의 stamp도 기간 밖으로 제외한다', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-04', '2026-07-06', '2026-07-07']
    })
    const result = judgeCumulative(s, rule, '2026-07-08')
    expect(result.count).toBe(2)
  })
})

describe('judgeConsecutive — 연속 판정', () => {
  const rule: Extract<GateRule, { type: 'consecutive' }> = {
    type: 'consecutive',
    days: 3
  }

  it('오늘 포함 최근 K일 연속 dayKey가 모두 있으면 클리어', () => {
    const s = makeState({ stamps: ['2026-07-05', '2026-07-06', '2026-07-07'] })
    const result = judgeConsecutive(s, rule, '2026-07-07')
    expect(result.cleared).toBe(true)
    expect(result.streak).toBe(3)
  })

  // 테스트 계획 케이스 6: 연속 3일 중 하루 건너뜀 → 연속 길이 리셋
  it('중간에 하루 건너뛰면 오늘 기준 연속 길이가 리셋된다', () => {
    // 07-05 있음, 07-06 없음, 07-07 있음 → 오늘(07-07) 기준 연속 1
    const s = makeState({ stamps: ['2026-07-05', '2026-07-07'] })
    const result = judgeConsecutive(s, rule, '2026-07-07')
    expect(result.cleared).toBe(false)
    expect(result.streak).toBe(1)
  })

  it('오늘 도장이 없으면 오늘 기준 연속은 0이다', () => {
    const s = makeState({ stamps: ['2026-07-05', '2026-07-06'] })
    const result = judgeConsecutive(s, rule, '2026-07-07')
    expect(result.cleared).toBe(false)
    expect(result.streak).toBe(0)
  })

  it('K일보다 더 길게 연속이어도 클리어 (streak는 실제 길이)', () => {
    const s = makeState({
      stamps: ['2026-07-04', '2026-07-05', '2026-07-06', '2026-07-07']
    })
    const result = judgeConsecutive(s, rule, '2026-07-07')
    expect(result.cleared).toBe(true)
    expect(result.streak).toBe(4)
  })
})

describe('judgeGate — rule 종류에 따라 위임', () => {
  it('cumulative rule이면 누적 판정 결과를 낸다', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-06', '2026-07-07', '2026-07-08']
    })
    const rule: GateRule = { type: 'cumulative', required: 3, windowDays: 5 }
    const result = judgeGate(s, rule, '2026-07-08')
    expect(result.cleared).toBe(true)
  })

  it('consecutive rule이면 연속 판정 결과를 낸다', () => {
    const s = makeState({ stamps: ['2026-07-06', '2026-07-07', '2026-07-08'] })
    const rule: GateRule = { type: 'consecutive', days: 3 }
    const result = judgeGate(s, rule, '2026-07-08')
    expect(result.cleared).toBe(true)
  })
})

describe('retrainGate — 재수련', () => {
  // 테스트 계획 케이스 8: stamps 초기화 + startedDayKey 갱신 + attempts 증가
  it('stamps를 비우고 startedDayKey를 오늘로 갱신하며 attempts를 1 증가시킨다', () => {
    const s = makeState({
      startedDayKey: '2026-07-06',
      stamps: ['2026-07-06', '2026-07-07'],
      attempts: 1
    })
    const next = retrainGate(s, '2026-07-20')
    expect(next.stamps).toEqual([])
    expect(next.startedDayKey).toBe('2026-07-20')
    expect(next.attempts).toBe(2)
    expect(next.status).toBe('active')
  })

  it('불변성: 원본을 변경하지 않는다', () => {
    const original = makeState({ stamps: ['2026-07-06'], attempts: 0 })
    const next = retrainGate(original, '2026-07-20')
    expect(original.stamps).toEqual(['2026-07-06'])
    expect(original.attempts).toBe(0)
    expect(next).not.toBe(original)
  })
})
