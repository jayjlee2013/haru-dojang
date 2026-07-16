import { useEffect, useState } from 'react'
import type { Belt } from '../domain/types'
import { PROMOTION_MESSAGES } from '../content/microcopy'
import styles from './PromotionOverlay.module.css'

const BELT_COLOR_VAR: Record<Belt, string> = {
  white: 'var(--belt-white)',
  yellow: 'var(--belt-yellow)',
  green: 'var(--belt-green)',
  black: 'var(--belt-black)',
  master: 'var(--color-accent)'
}

/**
 * 오버레이 글자색은 시스템 다크모드가 아니라 배경으로 쓰이는 띠 색의 밝기를 따른다.
 * 검은띠(어두운 배경)만 밝은 글자, 나머지(밝은 배경)는 어두운 글자 — 다크모드에서
 * --color-ink를 그대로 썼다면 노란/초록 배경에 밝은 글자가 겹쳐 대비가 나빠졌을 것이다.
 */
const OVERLAY_INK_VAR: Record<Belt, string> = {
  white: 'var(--color-ink-on-light)',
  yellow: 'var(--color-ink-on-light)',
  green: 'var(--color-ink-on-light)',
  black: 'var(--color-ink-on-dark)',
  master: 'var(--color-ink-on-light)'
}

const TRANSITION_DELAY_MS = 50

interface PromotionOverlayProps {
  fromBelt: Belt
  toBelt: Belt
  journalTitle: string
  journalText: string
  unlockNotice?: string
  onClose: () => void
}

/**
 * 보스 관문 클리어 시 전체 화면 승급 오버레이.
 * 이전 띠 색 → 새 띠 색으로 배경이 전환되고, 승급 문구(있으면) + 일지 조각을 보여준다.
 * 관장 취임(master)은 승급 문구가 없다 — 일지 조각만.
 */
export function PromotionOverlay({
  fromBelt,
  toBelt,
  journalTitle,
  journalText,
  unlockNotice,
  onClose
}: PromotionOverlayProps): JSX.Element {
  const [transitioned, setTransitioned] = useState(false)
  const message = PROMOTION_MESSAGES[toBelt]

  useEffect(() => {
    const timer = window.setTimeout(() => setTransitioned(true), TRANSITION_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const style = {
    '--belt-from': BELT_COLOR_VAR[fromBelt],
    '--belt-to': BELT_COLOR_VAR[toBelt],
    '--overlay-ink': OVERLAY_INK_VAR[toBelt]
  } as React.CSSProperties

  return (
    <div className={`${styles.overlay} ${transitioned ? styles.transitioned : ''}`} style={style}>
      <div className={styles.beltBar} />
      {message !== undefined && <p className={styles.message}>{message}</p>}
      <article className={styles.journalCard}>
        <h3 className={styles.journalTitle}>{journalTitle}</h3>
        <p className={styles.journalText}>{journalText}</p>
      </article>
      {unlockNotice !== undefined && <p className={styles.unlockNotice}>{unlockNotice}</p>}
      <button className={styles.button} onClick={onClose}>
        다음
      </button>
    </div>
  )
}
