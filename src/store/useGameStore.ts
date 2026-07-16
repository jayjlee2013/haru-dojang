import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SaveData, GateState, CustomGate, GateRule, GateDef } from '../domain/types'
import { dayKey } from '../domain/day'
import { stampGate, judgeGate, retrainGate } from '../domain/judge'
import { clearGate } from '../domain/progression'
import { courses } from '../content/courses'

/**
 * 자유 슬롯 관문은 courses.ts의 기본 rule 대신 사용자가 freeGateDefs에 설정한
 * required/windowDays로 판정해야 한다 (표시 화면(Dojang.resolveEffectiveGate)과 동일 규칙).
 * 여기서 어긋나면 화면에 보이는 조건과 실제 클리어 판정이 달라지는 버그가 된다.
 */
function effectiveRule(gate: GateDef, save: SaveData): GateDef['rule'] {
  if (gate.kind !== 'free') return gate.rule
  const freeDef = save.freeGateDefs[gate.id]
  if (freeDef === undefined) return gate.rule
  return { type: 'cumulative', required: freeDef.required, windowDays: freeDef.windowDays }
}

const SAVE_STORAGE_KEY = 'haru-dojang-save'
const FIRST_GATE_ID = courses[0].id
let customGateSequence = 0

/** 무한 수련 모드 커스텀 관문 id 생성기 (시간 + 순번 조합, 충돌 방지). */
function nextCustomGateId(): string {
  customGateSequence += 1
  return `custom-${Date.now()}-${customGateSequence}`
}

function newCustomGateState(startedDayKey: string): GateState {
  return { status: 'active', stamps: [], startedDayKey, attempts: 0 }
}

/** 최초 실행 시 초기 SaveData를 만든다. */
function createInitialSave(now: Date): SaveData {
  const today = dayKey(now)
  const firstGateState: GateState = {
    status: 'active',
    stamps: [],
    startedDayKey: today,
    attempts: 0
  }

  return {
    schemaVersion: 1,
    createdAt: now.toISOString(),
    dayBoundaryHour: 4,
    currentGateId: FIRST_GATE_ID,
    gates: { [FIRST_GATE_ID]: firstGateState },
    freeGateDefs: {},
    journalUnlocked: [],
    masterMode: { active: false, customGates: [], journalEntries: [] }
  }
}

export type Screen = 'dojang' | 'journal' | 'settings'

interface GameStore {
  save: SaveData
  onboardingCompleted: boolean
  lastStampReactionIndex: number | null
  currentScreen: Screen
  /** 무한 수련 모드 커스텀 관문의 진행 상태. SaveData(잠긴 타입)에 넣을 수 없어 스토어에 별도로 둔다. */
  customGateStates: Record<string, GateState>
  stampToday: () => void
  retrainCurrentGate: () => void
  completeOnboarding: () => void
  openJournal: () => void
  closeJournal: () => void
  openSettings: () => void
  closeSettings: () => void
  /** 하루 경계 시각(0~23)을 바꾼다. 범위를 벗어나면 안쪽으로 잘라낸다. */
  setDayBoundaryHour: (hour: number) => void
  /** zod 검증을 통과한 SaveData로 전체 상태를 교체한다 (설정 화면의 가져오기). */
  importSave: (data: SaveData) => void
  /** 모든 진행 상태를 초기값으로 되돌린다 (설정 화면의 전체 초기화). */
  resetSave: () => void
  /** 자유 슬롯 관문에 이름/조건을 설정한다. 현재 관문이 free이고 아직 미설정일 때만 동작. */
  configureFreeGate: (name: string, required: number, windowDays: number) => void
  /** 무한 수련 모드에 커스텀 관문을 하나 추가한다. */
  addCustomGate: (name: string, required: number, windowDays: number) => void
  /** 커스텀 관문에 오늘 도장을 찍는다. */
  stampCustomGate: (gateId: string) => void
  /** 실패한 커스텀 관문을 재수련 상태로 되돌린다. */
  retrainCustomGate: (gateId: string) => void
  /** 일지 2권에 오늘의 기록을 남긴다. */
  addMasterJournalEntry: (text: string) => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      save: createInitialSave(new Date()),
      onboardingCompleted: false,
      lastStampReactionIndex: null,
      currentScreen: 'dojang',
      customGateStates: {},

      stampToday: () => {
        const { save } = get()
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)
        const currentGate = save.gates[save.currentGateId]
        if (currentGate === undefined) return
        if (currentGate.stamps.includes(today)) return

        const stampedState = stampGate(currentGate, today)
        const gateDef = courses.find((g) => g.id === save.currentGateId)
        if (gateDef === undefined) {
          set({ save: { ...save, gates: { ...save.gates, [save.currentGateId]: stampedState } } })
          return
        }

        const result = judgeGate(stampedState, effectiveRule(gateDef, save), today)
        const savedWithStamp: SaveData = {
          ...save,
          gates: { ...save.gates, [save.currentGateId]: stampedState }
        }

        if (result.cleared) {
          const cleared = clearGate(savedWithStamp, courses, save.currentGateId, today)
          set({ save: cleared })
          return
        }

        set({ save: savedWithStamp })
      },

      retrainCurrentGate: () => {
        const { save } = get()
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)
        const currentGate = save.gates[save.currentGateId]
        if (currentGate === undefined) return

        const retrained = retrainGate(currentGate, today)
        set({
          save: { ...save, gates: { ...save.gates, [save.currentGateId]: retrained } }
        })
      },

      completeOnboarding: () => set({ onboardingCompleted: true }),

      openJournal: () => set({ currentScreen: 'journal' }),
      closeJournal: () => set({ currentScreen: 'dojang' }),

      openSettings: () => set({ currentScreen: 'settings' }),
      closeSettings: () => set({ currentScreen: 'dojang' }),

      setDayBoundaryHour: (hour) => {
        const { save } = get()
        const clamped = Math.min(23, Math.max(0, Math.trunc(hour)))
        set({ save: { ...save, dayBoundaryHour: clamped } })
      },

      importSave: (data) => {
        set({ save: data, customGateStates: {} })
      },

      resetSave: () => {
        set({
          save: createInitialSave(new Date()),
          customGateStates: {},
          lastStampReactionIndex: null,
          currentScreen: 'dojang'
        })
      },

      configureFreeGate: (name, required, windowDays) => {
        const { save } = get()
        const gate = courses.find((g) => g.id === save.currentGateId)
        if (gate === undefined || gate.kind !== 'free') return
        if (save.freeGateDefs[gate.id] !== undefined) return

        set({
          save: {
            ...save,
            freeGateDefs: { ...save.freeGateDefs, [gate.id]: { name, required, windowDays } }
          }
        })
      },

      addCustomGate: (name, required, windowDays) => {
        const { save, customGateStates } = get()
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)
        const rule: GateRule = { type: 'cumulative', required, windowDays }
        const gate: CustomGate = { id: nextCustomGateId(), name, rule }

        set({
          save: {
            ...save,
            masterMode: {
              ...save.masterMode,
              customGates: [...save.masterMode.customGates, gate]
            }
          },
          customGateStates: { ...customGateStates, [gate.id]: newCustomGateState(today) }
        })
      },

      stampCustomGate: (gateId) => {
        const { save, customGateStates } = get()
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)
        const gateState = customGateStates[gateId]
        const customGate = save.masterMode.customGates.find((g) => g.id === gateId)
        if (gateState === undefined || customGate === undefined) return
        if (gateState.stamps.includes(today)) return

        const stampedState = stampGate(gateState, today)
        const result = judgeGate(stampedState, customGate.rule, today)
        const nextState: GateState = result.cleared
          ? { ...stampedState, status: 'cleared', clearedAt: today }
          : stampedState

        set({ customGateStates: { ...customGateStates, [gateId]: nextState } })
      },

      retrainCustomGate: (gateId) => {
        const { save, customGateStates } = get()
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)
        const gateState = customGateStates[gateId]
        if (gateState === undefined) return

        set({
          customGateStates: { ...customGateStates, [gateId]: retrainGate(gateState, today) }
        })
      },

      addMasterJournalEntry: (text) => {
        const { save } = get()
        const trimmed = text.trim()
        if (trimmed.length === 0) return
        const now = new Date()
        const today = dayKey(now, save.dayBoundaryHour)

        set({
          save: {
            ...save,
            masterMode: {
              ...save.masterMode,
              journalEntries: [...save.masterMode.journalEntries, { dayKey: today, text: trimmed }]
            }
          }
        })
      }
    }),
    {
      name: SAVE_STORAGE_KEY
    }
  )
)

/** 랜덤하게 반응 문구 인덱스를 고르되, 직전 인덱스와 중복되지 않게 한다. */
export function pickNonRepeatingIndex(poolSize: number, previous: number | null): number {
  if (poolSize <= 1) return 0
  let next = Math.floor(Math.random() * poolSize)
  while (next === previous) {
    next = Math.floor(Math.random() * poolSize)
  }
  return next
}

export function setLastStampReactionIndex(index: number): void {
  useGameStore.setState({ lastStampReactionIndex: index })
}
