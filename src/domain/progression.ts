import type { GateDef, SaveData, GateState } from './types'

/**
 * 코스 정렬 순서: belt 순 → 같은 belt 내 order 순.
 * belt는 courses 배열의 등장 순서로 승급 순서를 결정한다 (white → yellow → ...).
 */
function beltRank(courses: GateDef[]): Map<string, number> {
  const rank = new Map<string, number>()
  for (const gate of courses) {
    if (!rank.has(gate.belt)) {
      rank.set(gate.belt, rank.size)
    }
  }
  return rank
}

function sortedCourses(courses: GateDef[]): GateDef[] {
  const rank = beltRank(courses)
  return [...courses].sort((a, b) => {
    const beltDiff = (rank.get(a.belt) ?? 0) - (rank.get(b.belt) ?? 0)
    if (beltDiff !== 0) return beltDiff
    return a.order - b.order
  })
}

/**
 * 주어진 관문의 다음 관문을 코스 진행 순서(belt → order)로 찾는다.
 * 보스(belt의 마지막)면 다음 belt의 첫 관문으로 넘어간다.
 * 최종 관문이면 undefined.
 */
export function findNextGate(courses: GateDef[], gate: GateDef): GateDef | undefined {
  const ordered = sortedCourses(courses)
  const idx = ordered.findIndex((g) => g.id === gate.id)
  if (idx === -1) return undefined
  return ordered[idx + 1]
}

/** 뒤에 다음 관문이 없는 보스는 최종 보스다. */
export function isFinalBoss(courses: GateDef[], gate: GateDef): boolean {
  return gate.kind === 'boss' && findNextGate(courses, gate) === undefined
}

function newActiveGate(startedDayKey: string): GateState {
  return {
    status: 'active',
    stamps: [],
    startedDayKey,
    attempts: 0
  }
}

function withJournalUnlocked(unlocked: string[], journalId: string): string[] {
  if (unlocked.includes(journalId)) return unlocked
  return [...unlocked, journalId]
}

/**
 * 관문 클리어에 따른 상태 전이 (순수 함수, 원본 불변).
 *
 * - 현재 관문 → cleared (+ clearedAt)
 * - journalUnlocked에 journalId 추가 (멱등)
 * - 다음 관문 → unlock + active (startedDayKey = today)
 *   - 보스 클리어면 다음 belt의 1번 관문으로 승급
 *   - free 슬롯이면 active로 열되 이름은 store에서 별도 입력
 * - 최종 보스 클리어 → masterMode.active = true
 *
 * gateId가 코스에 없으면 원본을 그대로 반환한다.
 */
export function clearGate(
  save: SaveData,
  courses: GateDef[],
  gateId: string,
  today: string
): SaveData {
  const gate = courses.find((g) => g.id === gateId)
  if (gate === undefined) return save

  const clearedState: GateState = {
    ...(save.gates[gateId] ?? newActiveGate(today)),
    status: 'cleared',
    clearedAt: today
  }

  const journalUnlocked = withJournalUnlocked(save.journalUnlocked, gate.journalId)
  const nextGate = findNextGate(courses, gate)

  // 최종 보스 클리어 → 무한 수련 모드 해금
  if (nextGate === undefined) {
    return {
      ...save,
      gates: { ...save.gates, [gateId]: clearedState },
      journalUnlocked,
      masterMode: { ...save.masterMode, active: true }
    }
  }

  return {
    ...save,
    currentGateId: nextGate.id,
    gates: {
      ...save.gates,
      [gateId]: clearedState,
      [nextGate.id]: newActiveGate(today)
    },
    journalUnlocked
  }
}
