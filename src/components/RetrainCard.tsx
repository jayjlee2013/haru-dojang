import { useMemo } from 'react'
import type { Lang } from '../domain/types'
import { RETRAIN_MESSAGES, RETRAIN_BUTTON, RETRAIN_ATTEMPT_SUBTEXT } from '../content/microcopy'
import styles from './RetrainCard.module.css'

interface RetrainCardProps {
  attempts: number
  onRetrain: () => void
  lang: Lang
}

/** 관문 기한 초과 실패 시 보여주는 재수련 카드 (06문서 섹션 4). */
export function RetrainCard({ attempts, onRetrain, lang }: RetrainCardProps): JSX.Element {
  // 카드가 뜨는 동안은 문구가 고정되도록 최초 렌더 시 한 번만 고른다.
  const pool = RETRAIN_MESSAGES[lang]
  const message = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [pool])

  return (
    <section className={styles.card}>
      <p className={styles.message}>{message}</p>
      {attempts >= 1 && <p className={styles.subtext}>{RETRAIN_ATTEMPT_SUBTEXT(attempts + 1, lang)}</p>}
      <button className={styles.button} onClick={onRetrain}>
        {RETRAIN_BUTTON[lang]}
      </button>
    </section>
  )
}
