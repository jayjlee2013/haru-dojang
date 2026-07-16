import { describe, it, expect } from 'vitest'
import { dayKey, DEFAULT_BOUNDARY_HOUR } from '../day'

describe('dayKey', () => {
  // 테스트 계획 케이스 1: 03:59 도장 → 전날 / 04:00 도장 → 당일
  it('03:59 이전은 전날 dayKey로 취급한다', () => {
    const at0359 = new Date('2026-07-07T03:59:00')
    expect(dayKey(at0359)).toBe('2026-07-06')
  })

  it('04:00 정각은 당일 dayKey로 취급한다', () => {
    const at0400 = new Date('2026-07-07T04:00:00')
    expect(dayKey(at0400)).toBe('2026-07-07')
  })

  it('04:01은 당일 dayKey로 취급한다', () => {
    const at0401 = new Date('2026-07-07T04:01:00')
    expect(dayKey(at0401)).toBe('2026-07-07')
  })

  it('한낮은 당일 dayKey로 취급한다', () => {
    const noon = new Date('2026-07-07T12:00:00')
    expect(dayKey(noon)).toBe('2026-07-07')
  })

  it('자정 직후(00:00)는 전날 dayKey로 취급한다', () => {
    const midnight = new Date('2026-07-07T00:00:00')
    expect(dayKey(midnight)).toBe('2026-07-06')
  })

  // 테스트 계획 케이스 3: 자정 넘겨 연속 판정 — 어제 23시 + 오늘 새벽 3시 → 같은 dayKey
  it('어제 23시와 오늘 새벽 3시는 같은 dayKey다 (경계 4시)', () => {
    const yesterday23 = new Date('2026-07-06T23:00:00')
    const today03 = new Date('2026-07-07T03:00:00')
    expect(dayKey(yesterday23)).toBe(dayKey(today03))
    expect(dayKey(yesterday23)).toBe('2026-07-06')
  })

  // 경계 시각 커스터마이즈
  it('경계 시각을 0으로 주면 달력 날짜와 동일하다', () => {
    const at0100 = new Date('2026-07-07T01:00:00')
    expect(dayKey(at0100, 0)).toBe('2026-07-07')
  })

  it('경계 시각 6시일 때 05:00은 전날로 취급한다', () => {
    const at0500 = new Date('2026-07-07T05:00:00')
    expect(dayKey(at0500, 6)).toBe('2026-07-06')
  })

  it('기본 경계 시각 상수는 4이다', () => {
    expect(DEFAULT_BOUNDARY_HOUR).toBe(4)
  })

  it('boundaryHour 미지정 시 기본값 4를 사용한다', () => {
    const at0330 = new Date('2026-07-07T03:30:00')
    expect(dayKey(at0330)).toBe(dayKey(at0330, DEFAULT_BOUNDARY_HOUR))
  })
})
