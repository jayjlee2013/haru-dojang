import { beltName } from '../domain/beltLabels'
import type { Belt, Lang } from '../domain/types'
import {
  MASTER_MODE_DAYS_LABEL,
  TOTAL_STAMPS_LABEL,
  JOURNAL_ARIA_LABEL,
  JOURNAL_UNREAD_TITLE,
  SETTINGS_ARIA_LABEL
} from '../content/microcopy'
import styles from './TopBar.module.css'

interface TopBarProps {
  belt: Belt
  totalStamps: number
  masterModeDays?: number
  onOpenJournal?: () => void
  hasUnreadJournal?: boolean
  onOpenSettings?: () => void
  lang: Lang
}

/** 일지(책) 아이콘. stroke는 currentColor라 다크 모드에서도 자동으로 따라간다. */
function JournalIcon(): JSX.Element {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

/** 설정(슬라이더) 아이콘. 작은 크기에서 톱니바퀴보다 형태가 선명하다. */
function SettingsIcon(): JSX.Element {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
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
  onOpenSettings,
  lang
}: TopBarProps): JSX.Element {
  return (
    <header className={styles.bar}>
      <div className={styles.beltInfo}>
        <span className={`${styles.beltBadge} ${styles[`belt-${belt}`]}`} />
        <span className={styles.beltLabel}>
          {masterModeDays !== undefined ? MASTER_MODE_DAYS_LABEL(masterModeDays, lang) : beltName(belt, lang)}
        </span>
      </div>
      <div className={styles.rightGroup}>
        <div className={styles.stampCount}>{TOTAL_STAMPS_LABEL(totalStamps, lang)}</div>
        {onOpenJournal !== undefined && (
          <button
            className={styles.journalButton}
            onClick={onOpenJournal}
            aria-label={JOURNAL_ARIA_LABEL[lang]}
            title={hasUnreadJournal === true ? JOURNAL_UNREAD_TITLE[lang] : JOURNAL_ARIA_LABEL[lang]}
          >
            <JournalIcon />
            {hasUnreadJournal === true && <span className={styles.unreadDot} />}
          </button>
        )}
        {onOpenSettings !== undefined && (
          <button
            className={styles.settingsButton}
            onClick={onOpenSettings}
            aria-label={SETTINGS_ARIA_LABEL[lang]}
            title={SETTINGS_ARIA_LABEL[lang]}
          >
            <SettingsIcon />
          </button>
        )}
      </div>
    </header>
  )
}
