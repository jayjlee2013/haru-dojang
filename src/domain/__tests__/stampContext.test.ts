import { describe, it, expect } from 'vitest'
import { stampContext } from '../judge'

describe('stampContext', () => {
  const today = '2026-08-08'

  it('첫 도장은 normal', () => {
    expect(stampContext([], today)).toBe('normal')
  })

  it('어제 걸렀다 돌아오면 return', () => {
    expect(stampContext(['2026-08-05'], today)).toBe('return')
  })

  it('어제까지 이어져 오늘 3일째면 streak', () => {
    expect(stampContext(['2026-08-06', '2026-08-07'], today)).toBe('streak')
  })

  it('어제만 찍어 오늘 2일째면 normal', () => {
    expect(stampContext(['2026-08-07'], today)).toBe('normal')
  })
})
