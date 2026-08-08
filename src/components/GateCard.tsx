import type { GateDef, GateState, Lang } from '../domain/types'
import { judgeCumulative } from '../domain/judge'
import { gateDisplayName } from '../content/courses'
import { ProgressSegments } from './ProgressSegments'
import { StampButton } from './StampButton'
import { BossGateCard } from './BossGateCard'
import {
  DEADLINE_WARNING,
  CURRENT_GATE_LABEL,
  REMAINING_DAYS_LABEL,
  cumulativeConditionText,
  consecutiveConditionText
} from '../content/microcopy'
import styles from './GateCard.module.css'

const DAY_MS = 24 * 60 * 60 * 1000

interface GateCardProps {
  gate: GateDef
  gateState: GateState
  gateOrder: number
  today: string
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  nextBeltName?: string
  lang: Lang
}

function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS)
}

function gateConditionText(gate: GateDef, lang: Lang): string {
  if (gate.rule.type === 'cumulative') {
    return cumulativeConditionText(gate.rule.required, gate.rule.windowDays, lang)
  }
  return consecutiveConditionText(gate.rule.days, lang)
}

/** 현재 도전 중인 관문 카드. 조건, 진행 세그먼트, 남은 기한, 도장 찍기 버튼을 담는다. */
export function GateCard({
  gate,
  gateState,
  gateOrder,
  today,
  onStamp,
  lastReactionIndex,
  onReactionShown,
  nextBeltName,
  lang
}: GateCardProps): JSX.Element {
  const alreadyStampedToday = gateState.stamps.includes(today)
  const gateName = gateDisplayName(gate, lang)

  if (gate.rule.type === 'consecutive') {
    return (
      <BossGateCard
        gate={gate}
        rule={gate.rule}
        gateState={gateState}
        nextBeltName={nextBeltName}
        gateOrder={gateOrder}
        today={today}
        onStamp={onStamp}
        lastReactionIndex={lastReactionIndex}
        onReactionShown={onReactionShown}
        lang={lang}
      />
    )
  }

  const { count, deadline } = judgeCumulative(gateState, gate.rule, today)
  const remainingDays = daysBetween(today, deadline) + 1
  const remainingRequired = gate.rule.required - count
  const isDeadlineNear = remainingDays === remainingRequired && remainingRequired > 0

  return (
    <section className={styles.card}>
      <p className={styles.label}>{CURRENT_GATE_LABEL(gateOrder, lang)}</p>
      <h2 className={styles.name}>{gateName}</h2>
      <p className={styles.condition}>{gateConditionText(gate, lang)}</p>
      <ProgressSegments filled={count} total={gate.rule.required} lang={lang} />
      <p className={styles.remaining}>{REMAINING_DAYS_LABEL(remainingDays, lang)}</p>
      {isDeadlineNear && <p className={styles.warning}>{DEADLINE_WARNING[lang]}</p>}
      <StampButton
        alreadyStampedToday={alreadyStampedToday}
        onStamp={onStamp}
        lastReactionIndex={lastReactionIndex}
        onReactionShown={onReactionShown}
        stamps={gateState.stamps}
        today={today}
        lang={lang}
      />
    </section>
  )
}

export { daysBetween, gateConditionText }
