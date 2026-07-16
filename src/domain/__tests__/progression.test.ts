import { describe, it, expect } from 'vitest'
import { clearGate, findNextGate, isFinalBoss } from '../progression'
import type { GateDef, SaveData, GateState } from '../types'

// 테스트용 축소 코스: 흰띠(W1 → W2 → W-BOSS) → 노란띠(Y1) 그리고 별도 free 슬롯
const testCourses: GateDef[] = [
  {
    id: 'W1',
    belt: 'white',
    order: 1,
    kind: 'normal',
    name: '물 한 컵',
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W1'
  },
  {
    id: 'W2',
    belt: 'white',
    order: 2,
    kind: 'normal',
    name: '환기',
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W2'
  },
  {
    id: 'W-BOSS',
    belt: 'white',
    order: 3,
    kind: 'boss',
    name: '보스',
    rule: { type: 'consecutive', days: 3 },
    journalId: 'W-BOSS'
  },
  {
    id: 'Y1',
    belt: 'yellow',
    order: 1,
    kind: 'normal',
    name: '산책',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y1'
  },
  {
    id: 'Y-FREE',
    belt: 'yellow',
    order: 2,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y-FREE'
  }
]

// 최종 보스만 있는 코스 (검은띠 마지막)
const finalBossCourse: GateDef[] = [
  {
    id: 'B-FINAL',
    belt: 'black',
    order: 1,
    kind: 'boss',
    name: '최종 보스',
    rule: { type: 'consecutive', days: 5 },
    journalId: 'B-FINAL'
  }
]

function gateState(overrides: Partial<GateState> = {}): GateState {
  return {
    status: 'active',
    stamps: [],
    startedDayKey: '2026-07-06',
    attempts: 0,
    ...overrides
  }
}

function makeSave(overrides: Partial<SaveData> = {}): SaveData {
  return {
    schemaVersion: 1,
    createdAt: '2026-07-06T00:00:00.000Z',
    dayBoundaryHour: 4,
    currentGateId: 'W1',
    gates: {
      W1: gateState()
    },
    freeGateDefs: {},
    journalUnlocked: ['PROLOGUE'],
    masterMode: { active: false, customGates: [], journalEntries: [] },
    ...overrides
  }
}

describe('findNextGate', () => {
  it('같은 belt 안에서 다음 order 관문을 찾는다', () => {
    const w1 = testCourses[0]
    expect(findNextGate(testCourses, w1)?.id).toBe('W2')
  })

  it('보스(마지막 order)면 다음 belt의 order 1 관문을 찾는다', () => {
    const wBoss = testCourses.find((g) => g.id === 'W-BOSS')!
    expect(findNextGate(testCourses, wBoss)?.id).toBe('Y1')
  })

  it('최종 관문이면 다음 관문이 없다', () => {
    const finalBoss = finalBossCourse[0]
    expect(findNextGate(finalBossCourse, finalBoss)).toBeUndefined()
  })
})

describe('isFinalBoss', () => {
  it('다음 관문이 없는 보스는 최종 보스다', () => {
    expect(isFinalBoss(finalBossCourse, finalBossCourse[0])).toBe(true)
  })

  it('뒤에 관문이 더 있는 보스는 최종 보스가 아니다', () => {
    const wBoss = testCourses.find((g) => g.id === 'W-BOSS')!
    expect(isFinalBoss(testCourses, wBoss)).toBe(false)
  })
})

describe('clearGate — 상태 전이', () => {
  it('일반 관문 클리어: 일지 해금 + 현재 관문 cleared + 다음 관문 active', () => {
    const save = makeSave()
    const next = clearGate(save, testCourses, 'W1', '2026-07-10')

    expect(next.gates['W1'].status).toBe('cleared')
    expect(next.gates['W1'].clearedAt).toBe('2026-07-10')
    expect(next.journalUnlocked).toContain('W1')
    expect(next.gates['W2']).toBeDefined()
    expect(next.gates['W2'].status).toBe('active')
    expect(next.gates['W2'].startedDayKey).toBe('2026-07-10')
    expect(next.currentGateId).toBe('W2')
  })

  it('불변성: 원본 save를 변경하지 않는다', () => {
    const save = makeSave()
    const next = clearGate(save, testCourses, 'W1', '2026-07-10')
    expect(save.gates['W1'].status).toBe('active')
    expect(save.journalUnlocked).not.toContain('W1')
    expect(next).not.toBe(save)
  })

  it('보스 클리어: 다음 belt의 1번 관문이 active로 승급', () => {
    const save = makeSave({
      currentGateId: 'W-BOSS',
      gates: { 'W-BOSS': gateState() }
    })
    const next = clearGate(save, testCourses, 'W-BOSS', '2026-07-15')

    expect(next.gates['W-BOSS'].status).toBe('cleared')
    expect(next.journalUnlocked).toContain('W-BOSS')
    expect(next.gates['Y1'].status).toBe('active')
    expect(next.currentGateId).toBe('Y1')
  })

  it('free 슬롯이 다음 관문이면 active로 열되 이름은 아직 없다', () => {
    const save = makeSave({
      currentGateId: 'Y1',
      gates: { Y1: gateState() }
    })
    const next = clearGate(save, testCourses, 'Y1', '2026-07-20')
    expect(next.currentGateId).toBe('Y-FREE')
    expect(next.gates['Y-FREE'].status).toBe('active')
  })

  it('최종 보스 클리어: masterMode.active = true', () => {
    const save = makeSave({
      currentGateId: 'B-FINAL',
      gates: { 'B-FINAL': gateState() }
    })
    const next = clearGate(save, finalBossCourse, 'B-FINAL', '2026-08-01')

    expect(next.gates['B-FINAL'].status).toBe('cleared')
    expect(next.journalUnlocked).toContain('B-FINAL')
    expect(next.masterMode.active).toBe(true)
  })

  it('일지 중복 해금은 하지 않는다 (멱등)', () => {
    const save = makeSave({
      journalUnlocked: ['PROLOGUE', 'W1'],
      gates: { W1: gateState() }
    })
    const next = clearGate(save, testCourses, 'W1', '2026-07-10')
    const w1Count = next.journalUnlocked.filter((j) => j === 'W1').length
    expect(w1Count).toBe(1)
  })

  it('알 수 없는 gateId면 변경 없이 원본을 그대로 반환한다', () => {
    const save = makeSave()
    const next = clearGate(save, testCourses, 'UNKNOWN', '2026-07-10')
    expect(next).toBe(save)
  })
})
