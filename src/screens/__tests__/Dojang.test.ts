import { describe, it, expect } from 'vitest'
import { computeMasterModeDays, resolveEffectiveGate } from '../Dojang'
import type { GateDef } from '../../domain/types'

describe('computeMasterModeDays (무한 수련 모드 경과일)', () => {
  // 호스트 타임존에 따른 날짜 경계 오차를 피하기 위해 로컬 정오 기준으로 비교한다.
  const createdAtLocalNoon = new Date(2026, 6, 1, 12, 0, 0)

  it('창립일 당일은 1일째다', () => {
    const today = new Date(2026, 6, 1, 12, 0, 0)
    expect(computeMasterModeDays(createdAtLocalNoon.toISOString(), today)).toBe(1)
  })

  it('창립일로부터 9일 뒤는 10일째다', () => {
    const today = new Date(2026, 6, 10, 12, 0, 0)
    expect(computeMasterModeDays(createdAtLocalNoon.toISOString(), today)).toBe(10)
  })
})

describe('resolveEffectiveGate (자유 슬롯 병합)', () => {
  const freeGate: GateDef = {
    id: 'Y4-free',
    belt: 'yellow',
    order: 4,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y4'
  }

  it('설정이 없으면 원본 그대로 반환한다', () => {
    expect(resolveEffectiveGate(freeGate, undefined)).toBe(freeGate)
  })

  it('설정이 있으면 이름/규칙을 병합한다', () => {
    const merged = resolveEffectiveGate(freeGate, { name: '10분 책 읽기', required: 5, windowDays: 7 })
    expect(merged.name).toBe('10분 책 읽기')
    expect(merged.rule).toEqual({ type: 'cumulative', required: 5, windowDays: 7 })
    expect(merged.id).toBe('Y4-free')
  })

  it('일반 관문(kind !== free)은 설정이 있어도 그대로 반환한다', () => {
    const normalGate: GateDef = { ...freeGate, kind: 'normal', name: '원래 이름' }
    const result = resolveEffectiveGate(normalGate, { name: '바뀐 이름', required: 1, windowDays: 1 })
    expect(result).toBe(normalGate)
  })
})
