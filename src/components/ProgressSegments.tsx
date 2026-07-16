import styles from './ProgressSegments.module.css'

interface ProgressSegmentsProps {
  filled: number
  total: number
}

/** 목표 횟수만큼 칸을 만들고, 채운 만큼 색칠하는 진행 세그먼트 바. */
export function ProgressSegments({ filled, total }: ProgressSegmentsProps): JSX.Element {
  const segments = Array.from({ length: total }, (_, i) => i < filled)

  return (
    <div className={styles.row} role="img" aria-label={`${total}번 중 ${filled}번 완료`}>
      {segments.map((isFilled, i) => (
        <span
          key={i}
          className={`${styles.segment} ${isFilled ? styles.filled : ''}`}
        />
      ))}
    </div>
  )
}
