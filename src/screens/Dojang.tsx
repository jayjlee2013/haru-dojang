import { useEffect, useRef, useState } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { GateDef } from '../domain/types'
import { useGameStore, setLastStampReactionIndex } from '../store/useGameStore'
import { courses, gateDisplayName } from '../content/courses'
import { journalEntries } from '../content/journal'
import { dayKey } from '../domain/day'
import { judgeCumulative, isClockRollback } from '../domain/judge'
import { findNextGate } from '../domain/progression'
import { beltName } from '../domain/beltLabels'
import { SETTINGS_CLOCK_ROLLBACK_WARNING, FREE_SLOT_UNLOCK_NOTICE, GATE_NOT_FOUND } from '../content/microcopy'
import { TopBar } from '../components/TopBar'
import { GateCard } from '../components/GateCard'
import { RetrainCard } from '../components/RetrainCard'
import { JournalRevealCard } from '../components/JournalRevealCard'
import { PromotionOverlay } from '../components/PromotionOverlay'
import { TrainingPath } from '../components/TrainingPath'
import { GateEditor } from './GateEditor'
import { MasterMode } from './MasterMode'
import styles from './Dojang.module.css'

function totalStamps(gates: Record<string, { stamps: string[] }>): number {
  return Object.values(gates).reduce((sum, g) => sum + g.stamps.length, 0)
}

/** 도장 창립일(createdAt)부터 오늘까지의 일수 (1일차부터 시작). */
export function computeMasterModeDays(createdAt: string, today: Date): number {
  return differenceInCalendarDays(today, parseISO(createdAt)) + 1
}

/** 자유 슬롯 관문에 freeGateDefs로 설정된 이름/조건이 있으면 병합해 실제 사용할 GateDef를 만든다. */
export function resolveEffectiveGate(
  gate: GateDef,
  freeGateDef: { name: string; required: number; windowDays: number } | undefined
): GateDef {
  if (gate.kind !== 'free' || freeGateDef === undefined) return gate
  return {
    ...gate,
    name: freeGateDef.name,
    rule: { type: 'cumulative', required: freeGateDef.required, windowDays: freeGateDef.windowDays }
  }
}

/** 도장(홈) 화면 — 앱의 핵심 루프. */
export function Dojang(): JSX.Element {
  const save = useGameStore((s) => s.save)
  const lang = useGameStore((s) => s.lang)
  const lastReactionIndex = useGameStore((s) => s.lastStampReactionIndex)
  const stampToday = useGameStore((s) => s.stampToday)
  const retrainCurrentGate = useGameStore((s) => s.retrainCurrentGate)
  const openJournal = useGameStore((s) => s.openJournal)
  const openSettings = useGameStore((s) => s.openSettings)
  const configureFreeGate = useGameStore((s) => s.configureFreeGate)
  const customGateStates = useGameStore((s) => s.customGateStates)
  const addCustomGate = useGameStore((s) => s.addCustomGate)
  const stampCustomGate = useGameStore((s) => s.stampCustomGate)
  const retrainCustomGate = useGameStore((s) => s.retrainCustomGate)
  const addMasterJournalEntry = useGameStore((s) => s.addMasterJournalEntry)

  const [revealForGateId, setRevealForGateId] = useState<string | null>(null)
  const previousGateIdRef = useRef(save.currentGateId)
  const previousMasterModeRef = useRef(save.masterMode.active)

  const today = dayKey(new Date(), save.dayBoundaryHour)
  const currentGate = courses.find((g) => g.id === save.currentGateId)
  const currentGateState = save.gates[save.currentGateId]

  useEffect(() => {
    const gateChanged = previousGateIdRef.current !== save.currentGateId
    const becameMasterMode = !previousMasterModeRef.current && save.masterMode.active

    if (gateChanged) {
      setRevealForGateId(previousGateIdRef.current)
    } else if (becameMasterMode) {
      setRevealForGateId(save.currentGateId)
    }

    previousGateIdRef.current = save.currentGateId
    previousMasterModeRef.current = save.masterMode.active
  }, [save.currentGateId, save.masterMode.active])

  if (currentGate === undefined || currentGateState === undefined) {
    return <div className={styles.screen}>{GATE_NOT_FOUND[lang]}</div>
  }

  const freeGateDef = save.freeGateDefs[currentGate.id]
  const effectiveGate = resolveEffectiveGate(currentGate, freeGateDef)
  const needsFreeGateSetup = currentGate.kind === 'free' && freeGateDef === undefined
  const masterModeDays = computeMasterModeDays(save.createdAt, new Date())

  const isFailed =
    effectiveGate.rule.type === 'cumulative' &&
    judgeCumulative(currentGateState, effectiveGate.rule, today).failed

  const clockRolledBack = isClockRollback(currentGateState, today)

  const revealedGate = courses.find((g) => g.id === revealForGateId)
  const revealedJournal = journalEntries.find((j) => j.id === revealedGate?.journalId)
  const isPromotion = revealedGate?.kind === 'boss'

  const nextGateAfterCurrent = findNextGate(courses, currentGate)
  const nextBeltName =
    currentGate.kind === 'boss' && nextGateAfterCurrent !== undefined
      ? beltName(nextGateAfterCurrent.belt, lang)
      : undefined

  const promotedToBelt =
    revealedGate !== undefined
      ? (findNextGate(courses, revealedGate)?.belt ?? 'master')
      : undefined

  function closeReveal(): void {
    setRevealForGateId(null)
  }

  function promotionUnlockNotice(): string | undefined {
    if (revealedGate === undefined) return undefined
    const nextGate = findNextGate(courses, revealedGate)
    if (nextGate?.kind === 'free') return FREE_SLOT_UNLOCK_NOTICE[lang]
    return undefined
  }

  return (
    <div className={styles.screen}>
      <TopBar
        belt={currentGate.belt}
        totalStamps={totalStamps(save.gates)}
        masterModeDays={save.masterMode.active ? masterModeDays : undefined}
        onOpenJournal={openJournal}
        onOpenSettings={openSettings}
        lang={lang}
      />

      {clockRolledBack && <p className={styles.clockWarning}>{SETTINGS_CLOCK_ROLLBACK_WARNING[lang]}</p>}

      {save.masterMode.active ? (
        <MasterMode
          today={today}
          masterModeDays={masterModeDays}
          customGates={save.masterMode.customGates}
          customGateStates={customGateStates}
          journalEntryCount={save.masterMode.journalEntries.length}
          lastReactionIndex={lastReactionIndex}
          onReactionShown={setLastStampReactionIndex}
          onAddCustomGate={addCustomGate}
          onStampCustomGate={stampCustomGate}
          onRetrainCustomGate={retrainCustomGate}
          onSaveJournalEntry={addMasterJournalEntry}
          lang={lang}
        />
      ) : needsFreeGateSetup ? (
        <GateEditor onSubmit={configureFreeGate} lang={lang} />
      ) : isFailed ? (
        <RetrainCard attempts={currentGateState.attempts} onRetrain={retrainCurrentGate} lang={lang} />
      ) : (
        <GateCard
          gate={effectiveGate}
          gateState={currentGateState}
          gateOrder={effectiveGate.order}
          today={today}
          onStamp={stampToday}
          lastReactionIndex={lastReactionIndex}
          onReactionShown={setLastStampReactionIndex}
          nextBeltName={nextBeltName}
          lang={lang}
        />
      )}

      {!save.masterMode.active && (
        <TrainingPath
          orderedGates={courses}
          currentGateId={save.currentGateId}
          clearedGateIds={
            new Set(Object.entries(save.gates).filter(([, g]) => g.status === 'cleared').map(([id]) => id))
          }
          lang={lang}
        />
      )}

      {revealedGate !== undefined && revealedJournal !== undefined && isPromotion && promotedToBelt !== undefined && (
        <PromotionOverlay
          fromBelt={revealedGate.belt}
          toBelt={promotedToBelt}
          journalTitle={revealedJournal.title[lang]}
          journalText={revealedJournal.text[lang]}
          unlockNotice={promotionUnlockNotice()}
          onClose={closeReveal}
          lang={lang}
        />
      )}

      {revealedGate !== undefined && revealedJournal !== undefined && !isPromotion && (
        <JournalRevealCard
          gateName={gateDisplayName(revealedGate, lang)}
          journalTitle={revealedJournal.title[lang]}
          journalText={revealedJournal.text[lang]}
          onClose={closeReveal}
          lang={lang}
        />
      )}
    </div>
  )
}
