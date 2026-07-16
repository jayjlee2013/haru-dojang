import { beltName } from '../domain/beltLabels'
import type { Belt } from '../domain/types'
import styles from './TopBar.module.css'

interface TopBarProps {
  belt: Belt
  totalStamps: number
  masterModeDays?: number
  onOpenJournal?: () => void
  hasUnreadJournal?: boolean
  onOpenSettings?: () => void
}

/**
 * 상단 바: 현재 띠 표시 + 총 도장 수 + 일지·설정으로 이동하는 버튼.
 * 무한 수련 모드에서는 띠 표기 대신 "관장 수련 N일째"를 보여준다 (06문서 섹션 9).
 */
export function TopBar({
  belt,
  totalStamps,
  masterModeDays,
  onOpenJournal,
  hasUnreadJournal,
  onOpenSettings
}: TopBarProps): JSX.Element {
  return (
    <header className={styles.bar}>
      <div className={styles.beltInfo}>
        <span className={`${styles.beltBadge} ${styles[`belt-${belt}`]}`} />
        <span className={styles.beltLabel}>
          {masterModeDays !== undefined ? `관장 수련 ${masterModeDays}일째` : beltName(belt)}
        </span>
      </div>
      <div className={styles.rightGroup}>
        <div className={styles.stampCount}>도장 {totalStamps}개</div>
        {onOpenJournal !== undefined && (
          <button
            className={styles.journalButton}
            onClick={onOpenJournal}
            aria-label="일지"
            title={hasUnreadJournal === true ? '읽지 않은 장이 있다' : '일지'}
          >
            <span className={styles.journalIcon} />
            {hasUnreadJournal === true && <span className={styles.unreadDot} />}
          </button>
        )}
        {onOpenSettings !== undefined && (
          <button
            className={styles.settingsButton}
            onClick={onOpenSettings}
            aria-label="설정"
            title="설정"
          >
            <span className={styles.settingsIcon} />
          </button>
        )}
      </div>
    </header>
  )
}
