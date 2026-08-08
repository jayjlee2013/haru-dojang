import { useState } from 'react'
import type { Lang } from '../domain/types'
import {
  STAMP_REACTIONS,
  ALREADY_STAMPED_BUTTON,
  ALREADY_STAMPED_SUBTEXT,
  STAMP_TODAY_BUTTON,
  masterReactionLine
} from '../content/microcopy'
import { stampContext } from '../domain/judge'
import { pickNonRepeatingIndex } from '../store/useGameStore'
import styles from './StampButton.module.css'

const STAMP_ANIMATION_MS = 500
const REACTION_DISPLAY_MS = 1500

interface StampButtonProps {
  alreadyStampedToday: boolean
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
  /** 오늘 도장을 찍기 직전의 stamps(오늘 미포함)와 오늘 dayKey — 관장 문맥 반응 판단용. */
  stamps: string[]
  today: string
  lang: Lang
}

/**
 * 도장 찍기 버튼. 찍으면 0.5초 애니메이션 후 랜덤 반응 문구를 1.5초간 보여주고
 * 버튼을 "오늘 수련 완료" 상태로 전환한다.
 */
export function StampButton({
  alreadyStampedToday,
  onStamp,
  lastReactionIndex,
  onReactionShown,
  stamps,
  today,
  lang
}: StampButtonProps): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false)
  const [reaction, setReaction] = useState<string | null>(null)

  function handleClick(): void {
    if (alreadyStampedToday || isAnimating) return

    setIsAnimating(true)
    onStamp()

    // 연속·복귀 같은 특별한 순간엔 관장이 먼저 말을 건네고, 평범한 날은 기존 랜덤 반응.
    const context = stampContext(stamps, today)
    if (context === 'normal') {
      const pool = STAMP_REACTIONS[lang]
      const index = pickNonRepeatingIndex(pool.length, lastReactionIndex)
      onReactionShown(index)
      setReaction(pool[index])
    } else {
      setReaction(masterReactionLine(context, lang))
    }

    window.setTimeout(() => setIsAnimating(false), STAMP_ANIMATION_MS)
    window.setTimeout(() => setReaction(null), REACTION_DISPLAY_MS)
  }

  if (alreadyStampedToday) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.doneButton} disabled>
          {ALREADY_STAMPED_BUTTON[lang]}
        </button>
        {reaction !== null ? (
          <p className={styles.reaction}>{reaction}</p>
        ) : (
          <p className={styles.subtext}>{ALREADY_STAMPED_SUBTEXT[lang]}</p>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.stampButton} ${isAnimating ? styles.stamping : ''}`}
        onClick={handleClick}
      >
        {STAMP_TODAY_BUTTON[lang]}
      </button>
      {reaction !== null && <p className={styles.reaction}>{reaction}</p>}
    </div>
  )
}
