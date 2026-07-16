import type { GateDef, GateState } from '../domain/types'
import { judgeConsecutive } from '../domain/judge'
import { StampButton } from './StampButton'
import {
  BOSS_ENTRY_NOTICE,
  BOSS_FINAL_ENTRY_NOTICE,
  BOSS_DAY_SUCCESS_MESSAGES,
  BOSS_STREAK_BROKEN,
  BOSS_RETRY_START
} from '../content/microcopy'
import styles from './BossGateCard.module.css'

type ConsecutiveRule = Extract<GateDef['rule'], { type: 'consecutive' }>

interface BossGateCardProps {
  gate: GateDef
  rule: ConsecutiveRule
  gateState: GateState
  nextBeltName: string | undefined
  gateOrder: number
  today: string
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
}

function bossTitle(nextBeltName: string | undefined): string {
  if (nextBeltName === undefined) return '승급 심사 — 관장 취임전'
  return `승급 심사 — ${nextBeltName} 보스전`
}

function entryNotice(rule: ConsecutiveRule): string {
  return rule.days >= 5 ? BOSS_FINAL_ENTRY_NOTICE : BOSS_ENTRY_NOTICE
}

/** 보스전(연속 판정) 관문 카드. 어두운 톤, 원형 진행 표시, 연속 끊김 시 재도전 안내. */
export function BossGateCard({
  gate,
  rule,
  gateState,
  nextBeltName,
  gateOrder,
  today,
  onStamp,
  lastReactionIndex,
  onReactionShown
}: BossGateCardProps): JSX.Element {
  const { streak, cleared } = judgeConsecutive(gateState, rule, today)
  const alreadyStampedToday = gateState.stamps.includes(today)
  const wasBroken = gateState.attempts >= 1 && streak === 0 && !alreadyStampedToday

  const circles = Array.from({ length: rule.days }, (_, i) => i < streak)

  // 06문서 섹션5: 심사 중 하루 성공 문구는 일차별 고정 (풀에 1·2일차만 존재).
  const daySuccessMessage =
    alreadyStampedToday && !cleared && streak >= 1 && streak <= BOSS_DAY_SUCCESS_MESSAGES.length
      ? BOSS_DAY_SUCCESS_MESSAGES[streak - 1]
      : undefined

  return (
    <section className={styles.card}>
      <p className={styles.label}>지금 도전 중인 관문 · {gateOrder}번째</p>
      <h2 className={styles.name}>{bossTitle(nextBeltName)}</h2>
      <p className={styles.condition}>{gate.name}</p>
      <p className={styles.condition}>{rule.days}일 연속이면 도장 획득</p>

      <div className={styles.circleRow} role="img" aria-label={`${rule.days}일 중 ${streak}일 연속`}>
        {circles.map((filled, i) => (
          <span key={i} className={`${styles.circle} ${filled ? styles.circleFilled : ''}`} />
        ))}
      </div>

      {wasBroken ? (
        <div className={styles.brokenNotice}>
          <p className={styles.brokenText}>{BOSS_STREAK_BROKEN}</p>
          <p className={styles.retryText}>{BOSS_RETRY_START}</p>
        </div>
      ) : (
        <>
          {!cleared && streak === 0 && gateState.attempts === 0 && (
            <p className={styles.entryNotice}>{entryNotice(rule)}</p>
          )}
          {daySuccessMessage !== undefined && (
            <p className={styles.daySuccess}>{daySuccessMessage}</p>
          )}
        </>
      )}

      <StampButton
        alreadyStampedToday={alreadyStampedToday}
        onStamp={onStamp}
        lastReactionIndex={lastReactionIndex}
        onReactionShown={onReactionShown}
      />
    </section>
  )
}
