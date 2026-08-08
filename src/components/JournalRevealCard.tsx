import { useState } from 'react'
import type { Lang } from '../domain/types'
import { GATE_CLEARED_LABEL, JOURNAL_OPEN_BUTTON, ONBOARDING_NEXT_BUTTON } from '../content/microcopy'
import styles from './JournalRevealCard.module.css'

interface JournalRevealCardProps {
  gateName: string
  journalTitle: string
  journalText: string
  onClose: () => void
  lang: Lang
}

/** 관문 클리어 직후: 도장 획득 연출 → 일지 조각 카드(열람) → 닫기. */
export function JournalRevealCard({
  gateName,
  journalTitle,
  journalText,
  onClose,
  lang
}: JournalRevealCardProps): JSX.Element {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return (
      <div className={styles.overlay}>
        <div className={styles.stampMark} />
        <p className={styles.clearedLabel}>{GATE_CLEARED_LABEL(gateName, lang)}</p>
        <button className={styles.button} onClick={() => setOpened(true)}>
          {JOURNAL_OPEN_BUTTON[lang]}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <article className={styles.journalCard}>
        <h3 className={styles.journalTitle}>{journalTitle}</h3>
        <p className={styles.journalText}>{journalText}</p>
      </article>
      <button className={styles.button} onClick={onClose}>
        {ONBOARDING_NEXT_BUTTON[lang]}
      </button>
    </div>
  )
}
