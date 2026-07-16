import { useState } from 'react'
import { STAMP_REACTIONS, ALREADY_STAMPED_BUTTON, ALREADY_STAMPED_SUBTEXT } from '../content/microcopy'
import { pickNonRepeatingIndex } from '../store/useGameStore'
import styles from './StampButton.module.css'

const STAMP_ANIMATION_MS = 500
const REACTION_DISPLAY_MS = 1500

interface StampButtonProps {
  alreadyStampedToday: boolean
  onStamp: () => void
  lastReactionIndex: number | null
  onReactionShown: (index: number) => void
}

/**
 * 도장 찍기 버튼. 찍으면 0.5초 애니메이션 후 랜덤 반응 문구를 1.5초간 보여주고
 * 버튼을 "오늘 수련 완료" 상태로 전환한다.
 */
export function StampButton({
  alreadyStampedToday,
  onStamp,
  lastReactionIndex,
  onReactionShown
}: StampButtonProps): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false)
  const [reaction, setReaction] = useState<string | null>(null)

  function handleClick(): void {
    if (alreadyStampedToday || isAnimating) return

    setIsAnimating(true)
    onStamp()

    const index = pickNonRepeatingIndex(STAMP_REACTIONS.length, lastReactionIndex)
    onReactionShown(index)
    setReaction(STAMP_REACTIONS[index])

    window.setTimeout(() => setIsAnimating(false), STAMP_ANIMATION_MS)
    window.setTimeout(() => setReaction(null), REACTION_DISPLAY_MS)
  }

  if (alreadyStampedToday) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.doneButton} disabled>
          {ALREADY_STAMPED_BUTTON}
        </button>
        {reaction !== null ? (
          <p className={styles.reaction}>{reaction}</p>
        ) : (
          <p className={styles.subtext}>{ALREADY_STAMPED_SUBTEXT}</p>
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
        오늘 도장 찍기
      </button>
      {reaction !== null && <p className={styles.reaction}>{reaction}</p>}
    </div>
  )
}
