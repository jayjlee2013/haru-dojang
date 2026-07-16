// 가져오기(JSON import) 시 SaveData 구조를 검증하는 zod 스키마.
// 04-tech-spec.md "데이터 모델" 섹션의 타입과 반드시 일치시킬 것.
import { z } from 'zod'
import type { SaveData } from '../domain/types'

const gateRuleSchema = z.union([
  z.object({
    type: z.literal('cumulative'),
    required: z.number().int().positive(),
    windowDays: z.number().int().positive()
  }),
  z.object({
    type: z.literal('consecutive'),
    days: z.number().int().positive()
  })
])

const gateStateSchema = z.object({
  status: z.enum(['locked', 'active', 'cleared']),
  stamps: z.array(z.string()),
  startedDayKey: z.string(),
  attempts: z.number().int().nonnegative(),
  clearedAt: z.string().optional()
})

const customGateSchema = z.object({
  id: z.string(),
  name: z.string(),
  rule: gateRuleSchema
})

const freeGateDefSchema = z.object({
  name: z.string(),
  required: z.number().int().positive(),
  windowDays: z.number().int().positive()
})

const saveDataSchema = z.object({
  schemaVersion: z.literal(1),
  createdAt: z.string(),
  dayBoundaryHour: z.number().int().min(0).max(23),
  currentGateId: z.string(),
  gates: z.record(z.string(), gateStateSchema),
  freeGateDefs: z.record(z.string(), freeGateDefSchema),
  journalUnlocked: z.array(z.string()),
  masterMode: z.object({
    active: z.boolean(),
    customGates: z.array(customGateSchema),
    journalEntries: z.array(z.object({ dayKey: z.string(), text: z.string() }))
  })
})

/** 가져온 JSON을 SaveData 스키마로 검증한다. 통과하면 SaveData, 실패하면 null. */
export function parseSaveData(json: unknown): SaveData | null {
  const result = saveDataSchema.safeParse(json)
  if (!result.success) return null
  return result.data as SaveData
}
