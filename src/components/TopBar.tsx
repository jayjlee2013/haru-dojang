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

/** 설정(톱니바퀴) 아이콘. 슬라이더 모양이 설정 메뉴로 안 읽힌다는 피드백으로 교체(2026-08-17). */
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
