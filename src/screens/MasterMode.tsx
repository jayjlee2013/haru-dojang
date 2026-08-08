import { useEffect, useRef, useState } from 'react'
import type { CustomGate, GateDef, GateState, Lang } from '../domain/types'
import { judgeCumulative } from '../domain/judge'
import { GateCard } from '../components/GateCard'
import { RetrainCard } from '../components/RetrainCard'
import { GateEditor } from './GateEditor'
import {
  MASTER_MODE_EMPTY_MESSAGE,
  MASTER_MODE_EMPTY_BUTTON,
  MASTER_MODE_JOURNAL_PROMPT,
  MASTER_MODE_JOURNAL_PLACEHOLDER,
  MASTER_MODE_JOURNAL_SAVED,
  MASTER_MODE_JOURNAL_COUNT_LABEL,
  ONBOARDING_NEXT_BUTTON
} from '../content/microcopy'
import styles from './MasterMode.module.css'

const MASTER_BELT_GATE_ORDER = 1

interface MasterModeProps {
  today: string
  masterModeDays: number
  customGates: CustomGate[]
  customGateStates: Record<string, GateState>
  journalEntryCount: number
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  onAddCustomGate: (name: string, required: number, windowDays: number) => void
  onStampCustomGate: (gateId: string) => void
  onRetrainCustomGate: (gateId: string) => void
  onSaveJournalEntry: (text: string) => void
  lang: Lang
}

/** CustomGate + GateState를 기존 GateCard가 받는 GateDef 형태로 합성한다. */
function toGateDef(gate: CustomGate): GateDef {
  return { id: gate.id, belt: 'master', order: MASTER_BELT_GATE_ORDER, kind: 'normal', name: gate.name, rule: gate.rule, journalId: '' }
}

/** 아직 클리어되지 않은 첫 커스텀 관문을 "현재 도전 중" 관문으로 다룬다 (단순 순차 진행). */
function findCurrentCustomGate(
  customGates: CustomGate[],
  states: Record<string, GateState>
): CustomGate | undefined {
  return customGates.find((g) => states[g.id]?.status !== 'cleared')
}

function JournalEntryForm({
  masterModeDays,
  onSave,
  onClose,
  lang
}: {
  masterModeDays: number
  onSave: (text: string) => void
  onClose: () => void
  lang: Lang
}): JSX.Element {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  function handleNext(): void {
    if (saved) {
      onClose()
      return
    }
    if (text.trim().length === 0) {
      onClose()
      return
    }
    onSave(text)
    setSaved(true)
  }

  if (saved) {
    return (
      <section className={styles.journalCard}>
        <p className={styles.journalSaved}>{MASTER_MODE_JOURNAL_SAVED[lang]}</p>
        <button className={styles.journalButton} onClick={handleNext}>
          {ONBOARDING_NEXT_BUTTON[lang]}
        </button>
      </section>
    )
  }

  return (
    <section className={styles.journalCard}>
      <p className={styles.journalPrompt}>{MASTER_MODE_JOURNAL_PROMPT[lang]}</p>
      <textarea
        className={styles.journalInput}
        value={text}
        placeholder={MASTER_MODE_JOURNAL_PLACEHOLDER(masterModeDays, lang)}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.journalButton} onClick={handleNext}>
        {ONBOARDING_NEXT_BUTTON[lang]}
      </button>
    </section>
  )
}

/**
 * 무한 수련 모드 화면 (검은띠 최종 보스 클리어 후).
 * 커스텀 관문을 하나씩 순서대로 도전하고, 클리어할 때마다 일지 2권에 짧은 기록을 남길 수 있다.
 */
export function MasterMode({
  today,
  masterModeDays,
  customGates,
  customGateStates,
  journalEntryCount,
  lastReactionIndex,
  onReactionShown,
  onAddCustomGate,
  onStampCustomGate,
  onRetrainCustomGate,
  onSaveJournalEntry,
  lang
}: MasterModeProps): JSX.Element {
  const [showJournalPrompt, setShowJournalPrompt] = useState(false)
  const [showEmptyEditor, setShowEmptyEditor] = useState(false)
  const previousCurrentIdRef = useRef<string | undefined>(
    findCurrentCustomGate(customGates, customGateStates)?.id
  )

  const currentGate = findCurrentCustomGate(customGates, customGateStates)

  useEffect(() => {
    const currentId = currentGate?.id
    if (previousCurrentIdRef.current !== undefined && currentId !== previousCurrentIdRef.current) {
      setShowJournalPrompt(true)
    }
    previousCurrentIdRef.current = currentId
  }, [currentGate?.id])

  function handleSaveJournal(text: string): void {
    onSaveJournalEntry(text)
  }

  if (currentGate === undefined) {
    return (
      <div className={styles.screen}>
        <p className={styles.emptyMessage}>{MASTER_MODE_EMPTY_MESSAGE[lang]}</p>
        {showEmptyEditor ? (
          <GateEditor onSubmit={onAddCustomGate} lang={lang} />
        ) : (
          <button className={styles.emptyButton} onClick={() => setShowEmptyEditor(true)}>
            {MASTER_MODE_EMPTY_BUTTON[lang]}
          </button>
        )}
      </div>
    )
  }

  const gateState = customGateStates[currentGate.id]
  if (gateState === undefined) {
    return <div className={styles.screen}>{MASTER_MODE_EMPTY_MESSAGE[lang]}</div>
  }

  const isFailed =
    currentGate.rule.type === 'cumulative' &&
    judgeCumulative(gateState, currentGate.rule, today).failed

  return (
    <div className={styles.screen}>
      {isFailed ? (
        <RetrainCard
          attempts={gateState.attempts}
          onRetrain={() => onRetrainCustomGate(currentGate.id)}
          lang={lang}
        />
      ) : (
        <GateCard
          gate={toGateDef(currentGate)}
          gateState={gateState}
          gateOrder={customGates.indexOf(currentGate) + 1}
          today={today}
          onStamp={() => onStampCustomGate(currentGate.id)}
          lastReactionIndex={lastReactionIndex}
          onReactionShown={onReactionShown}
          lang={lang}
        />
      )}

      {showJournalPrompt && (
        <JournalEntryForm
          masterModeDays={masterModeDays}
          onSave={handleSaveJournal}
          onClose={() => setShowJournalPrompt(false)}
          lang={lang}
        />
      )}

      <p className={styles.journalCount}>{MASTER_MODE_JOURNAL_COUNT_LABEL(journalEntryCount, lang)}</p>
    </div>
  )
}
