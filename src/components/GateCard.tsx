import type { GateDef, GateState } from '../domain/types'
import { judgeCumulative } from '../domain/judge'
import { ProgressSegments } from './ProgressSegments'
import { StampButton } from './StampButton'
import { BossGateCard } from './BossGateCard'
import { DEADLINE_WARNING } from '../content/microcopy'
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
}

function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS)
}

function gateConditionText(gate: GateDef): string {
  if (gate.rule.type === 'cumulative') {
    return `${gate.rule.windowDays}일 안에 ${gate.rule.required}번이면 도장 획득`
  }
  return `${gate.rule.days}일 연속이면 도장 획득`
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
  nextBeltName
}: GateCardProps): JSX.Element {
  const alreadyStampedToday = gateState.stamps.includes(today)
  const gateName = gate.name ?? '나만의 관문'

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
      />
    )
  }

  const { count, deadline } = judgeCumulative(gateState, gate.rule, today)
  const remainingDays = daysBetween(today, deadline) + 1
  const remainingRequired = gate.rule.required - count
  const isDeadlineNear = remainingDays === remainingRequired && remainingRequired > 0

  return (
    <section className={styles.card}>
      <p className={styles.label}>지금 도전 중인 관문 · {gateOrder}번째</p>
      <h2 className={styles.name}>{gateName}</h2>
      <p className={styles.condition}>{gateConditionText(gate)}</p>
      <ProgressSegments filled={count} total={gate.rule.required} />
      <p className={styles.remaining}>오늘 포함 {remainingDays}일 남음</p>
      {isDeadlineNear && <p className={styles.warning}>{DEADLINE_WARNING}</p>}
      <StampButton
        alreadyStampedToday={alreadyStampedToday}
        onStamp={onStamp}
        lastReactionIndex={lastReactionIndex}
        onReactionShown={onReactionShown}
      />
    </section>
  )
}

export { daysBetween, gateConditionText }
