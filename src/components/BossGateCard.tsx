import type { GateDef, GateState, Lang } from '../domain/types'
import { judgeConsecutive, judgeCumulative } from '../domain/judge'
import { gateDisplayName } from '../content/courses'
import { StampButton } from './StampButton'
import { ProgressSegments } from './ProgressSegments'
import {
  BOSS_ENTRY_NOTICE,
  BOSS_FINAL_ENTRY_NOTICE,
  BOSS_DAY_SUCCESS_MESSAGES,
  BOSS_STREAK_BROKEN,
  BOSS_RETRY_START,
  BOSS_TITLE_BEFORE_MASTER,
  BOSS_TITLE_WITH_NEXT_BELT,
  CURRENT_GATE_LABEL,
  CONSECUTIVE_STREAK_ARIA_LABEL,
  REMAINING_DAYS_LABEL,
  DEADLINE_WARNING,
  consecutiveConditionText,
  cumulativeConditionText
} from '../content/microcopy'
import styles from './BossGateCard.module.css'

type ConsecutiveRule = Extract<GateDef['rule'], { type: 'consecutive' }>

interface BossGateCardProps {
  gate: GateDef
  gateState: GateState
  nextBeltName: string | undefined
  gateOrder: number
  today: string
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  lang: Lang
}

const DAY_MS = 24 * 60 * 60 * 1000

function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((Date.parse(toKey) - Date.parse(fromKey)) / DAY_MS)
}

function bossTitle(nextBeltName: string | undefined, lang: Lang): string {
  if (nextBeltName === undefined) return BOSS_TITLE_BEFORE_MASTER[lang]
  return BOSS_TITLE_WITH_NEXT_BELT(nextBeltName, lang)
}

function entryNotice(rule: ConsecutiveRule, lang: Lang): string {
  return rule.days >= 5 ? BOSS_FINAL_ENTRY_NOTICE[lang] : BOSS_ENTRY_NOTICE[lang]
}

/** 보스전(연속 판정) 카드 — 원형 진행 표시, 연속 끊김 시 재도전 안내. */
function ConsecutiveBossCard({
  gate,
  rule,
  gateState,
  gateOrder,
  today,
  onStamp,
  lastReactionIndex,
  onReactionShown,
  lang,
  title
}: {
  gate: GateDef
  rule: ConsecutiveRule
  gateState: GateState
  gateOrder: number
  today: string
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  lang: Lang
  title: string
}): JSX.Element {
  const { streak, cleared } = judgeConsecutive(gateState, rule, today)
  const alreadyStampedToday = gateState.stamps.includes(today)
  const wasBroken = gateState.attempts >= 1 && streak === 0 && !alreadyStampedToday

  const circles = Array.from({ length: rule.days }, (_, i) => i < streak)

  // 06문서 섹션5: 심사 중 하루 성공 문구는 일차별 고정 (풀에 1·2일차만 존재).
  const daySuccessPool = BOSS_DAY_SUCCESS_MESSAGES[lang]
  const daySuccessMessage =
    alreadyStampedToday && !cleared && streak >= 1 && streak <= daySuccessPool.length
      ? daySuccessPool[streak - 1]
      : undefined

  return (
    <section className={styles.card}>
      <p className={styles.label}>{CURRENT_GATE_LABEL(gateOrder, lang)}</p>
      <h2 className={styles.name}>{title}</h2>
      <p className={styles.condition}>{gateDisplayName(gate, lang)}</p>
      <p className={styles.condition}>{consecutiveConditionText(rule.days, lang)}</p>

      <div
        className={styles.circleRow}
        role="img"
        aria-label={CONSECUTIVE_STREAK_ARIA_LABEL(streak, rule.days, lang)}
      >
        {circles.map((filled, i) => (
          <span key={i} className={`${styles.circle} ${filled ? styles.circleFilled : ''}`} />
        ))}
      </div>

      {wasBroken ? (
        <div className={styles.brokenNotice}>
          <p className={styles.brokenText}>{BOSS_STREAK_BROKEN[lang]}</p>
          <p className={styles.retryText}>{BOSS_RETRY_START[lang]}</p>
        </div>
      ) : (
        <>
          {!cleared && streak === 0 && gateState.attempts === 0 && (
            <p className={styles.entryNotice}>{entryNotice(rule, lang)}</p>
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
        stamps={gateState.stamps}
        today={today}
        lang={lang}
      />
    </section>
  )
}

type CumulativeRule = Extract<GateDef['rule'], { type: 'cumulative' }>

/**
 * 보스전(누적 판정) 카드 — B-FINAL-BOSS 전용. 기한 초과 실패는 Dojang.tsx가
 * RetrainCard로 먼저 걸러내므로 여기서는 "아직 실패하지 않은" 진행 상태만 그린다.
 */
function CumulativeBossCard({
  gate,
  rule,
  gateState,
  gateOrder,
  today,
  onStamp,
  lastReactionIndex,
  onReactionShown,
  lang,
  title
}: {
  gate: GateDef
  rule: CumulativeRule
  gateState: GateState
  gateOrder: number
  today: string
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  lang: Lang
  title: string
}): JSX.Element {
  const alreadyStampedToday = gateState.stamps.includes(today)
  const { count, deadline } = judgeCumulative(gateState, rule, today)
  const remainingDays = daysBetween(today, deadline) + 1
  const remainingRequired = rule.required - count
  const isDeadlineNear = remainingDays === remainingRequired && remainingRequired > 0

  return (
    <section className={styles.card}>
      <p className={styles.label}>{CURRENT_GATE_LABEL(gateOrder, lang)}</p>
      <h2 className={styles.name}>{title}</h2>
      <p className={styles.condition}>{gateDisplayName(gate, lang)}</p>
      <p className={styles.condition}>{cumulativeConditionText(rule.required, rule.windowDays, lang)}</p>

      <ProgressSegments filled={count} total={rule.required} lang={lang} />
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

/** 보스 관문 카드. 연속/누적 어느 판정이든 같은 어두운 톤 껍데기 안에서 그린다. */
export function BossGateCard(props: BossGateCardProps): JSX.Element {
  const { gate, nextBeltName, lang } = props
  const title = bossTitle(nextBeltName, lang)

  if (gate.rule.type === 'consecutive') {
    return <ConsecutiveBossCard {...props} rule={gate.rule} title={title} />
  }
  return <CumulativeBossCard {...props} rule={gate.rule} title={title} />
}
