import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { useGameStore } from '../store/useGameStore'
import { parseSaveData } from '../store/saveSchema'
import { dayKey } from '../domain/day'
import type { Lang } from '../domain/types'
import {
  SETTINGS_DAY_BOUNDARY_LABEL,
  SETTINGS_DAY_BOUNDARY_SUBTEXT,
  SETTINGS_REMINDER_LABEL,
  SETTINGS_REMINDER_SUBTEXT,
  SETTINGS_REMINDER_BUTTON,
  REMINDER_EVENT_TITLE,
  REMINDER_EVENT_DESCRIPTION,
  SETTINGS_EXPORT_LABEL,
  SETTINGS_IMPORT_LABEL,
  SETTINGS_IMPORT_FAILURE,
  SETTINGS_IMPORT_CONFIRM_MESSAGE,
  SETTINGS_IMPORT_CONFIRM_BUTTON,
  SETTINGS_IMPORT_CANCEL_BUTTON,
  SETTINGS_RESET_STEP1_TITLE,
  SETTINGS_RESET_STEP1_SUBTEXT,
  SETTINGS_RESET_STEP2_TITLE,
  SETTINGS_RESET_CONFIRM_BUTTON,
  SETTINGS_RESET_CANCEL_BUTTON,
  BACK_TO_DOJANG,
  appInfoLabel
} from '../content/microcopy'
import type { SaveData } from '../domain/types'
import styles from './Settings.module.css'

const HOUR_MIN = 0
const HOUR_MAX = 23
const APP_VERSION = '0.1.0'
// 저녁으로 잡아둔다 — 하루 경계가 새벽 4시라 이 시각에 알아도 아직 몇 시간 남는다.
const DEFAULT_REMINDER_TIME = '21:00'

type ResetStep = 'idle' | 'confirm1' | 'confirm2'

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

function downloadSaveAsJson(save: SaveData): void {
  const json = JSON.stringify(save, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `haru-dojang-${dayKey(new Date(), save.dayBoundaryHour)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

/** ICS 텍스트 값에서 구분자로 쓰이는 문자를 이스케이프한다 (RFC 5545). */
function escapeIcs(text: string): string {
  return text.replace(/([,;\\])/g, '\\$1')
}

/**
 * 매일 같은 시각에 울리는 반복 일정을 캘린더 파일(.ics)로 만들어 내려받는다.
 *
 * 웹에는 알림을 예약하는 수단이 없다 — 크롬이 만들던 Notification Triggers API는
 * 플랫폼 간 일관성을 보장할 수 없다는 이유로 개발이 중단됐고, 서버 없이 푸시를 보낼
 * 방법도 없다. 그래서 알림 자체를 폰 캘린더에 맡긴다. 앱은 이 설정을 저장하지 않는다 —
 * 알림의 주인은 캘린더이고, 앱이 기억해봤자 사용자가 캘린더에서 지우면 거짓말이 된다.
 */
function downloadReminderIcs(time: string, lang: Lang): void {
  const [hours, minutes] = time.split(':')
  const now = new Date()
  // 타임존을 안 붙인 '부동 시각(floating time)' — 어느 나라에 있든 그 기기의 현지 시각에
  // 울린다. 앱의 날짜 판정도 기기 시각을 따르므로 둘이 어긋나지 않는다.
  const start = `${format(now, 'yyyyMMdd')}T${hours}${minutes}00`
  // DTSTAMP만은 규격상 UTC다. 현지 시각을 찍고 Z를 붙이면 시차만큼 거짓말이 된다.
  const stamp = `${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
  // 고정 UID — 시각을 바꿔 다시 받으면 캘린더가 새로 만들지 않고 기존 일정을 갱신한다.
  const uid = `haru-dojang-daily-reminder-${lang}@jayjlee2013.github.io`
  const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//haru-dojang//daily-reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${escapeIcs(REMINDER_EVENT_TITLE[lang])}`,
    `DESCRIPTION:${escapeIcs(REMINDER_EVENT_DESCRIPTION[lang])}`,
    `URL:${appUrl}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-PT0M',
    `DESCRIPTION:${escapeIcs(REMINDER_EVENT_TITLE[lang])}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ]

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'haru-dojang-reminder.ics'
  anchor.click()
  URL.revokeObjectURL(url)
}

export interface SettingsProps {
  onBack: () => void
}

/** 설정 화면 (03문서 "7. 설정" + 06문서 섹션12). */
export function Settings({ onBack }: SettingsProps): JSX.Element {
  const save = useGameStore((s) => s.save)
  const setDayBoundaryHour = useGameStore((s) => s.setDayBoundaryHour)
  const importSave = useGameStore((s) => s.importSave)
  const resetSave = useGameStore((s) => s.resetSave)
  const lang = useGameStore((s) => s.lang)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<SaveData | null>(null)
  const [resetStep, setResetStep] = useState<ResetStep>('idle')
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME)

  function handleBoundaryChange(value: number): void {
    setDayBoundaryHour(value)
  }

  function handleReminderDownload(): void {
    downloadReminderIcs(reminderTime, lang)
  }

  function handleExport(): void {
    downloadSaveAsJson(save)
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (file === undefined) return

    setImportError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json: unknown = JSON.parse(String(reader.result))
        const parsed = parseSaveData(json)
        if (parsed === null) {
          setImportError(SETTINGS_IMPORT_FAILURE[lang])
          return
        }
        setPendingImport(parsed)
      } catch {
        setImportError(SETTINGS_IMPORT_FAILURE[lang])
      }
    }
    reader.onerror = () => {
      setImportError(SETTINGS_IMPORT_FAILURE[lang])
    }
    reader.readAsText(file)
  }

  function cancelImport(): void {
    setPendingImport(null)
    if (fileInputRef.current !== null) fileInputRef.current.value = ''
  }

  function confirmImport(): void {
    if (pendingImport === null) return
    importSave(pendingImport)
    setPendingImport(null)
    if (fileInputRef.current !== null) fileInputRef.current.value = ''
  }

  function confirmReset(): void {
    resetSave()
    setResetStep('idle')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          {BACK_TO_DOJANG[lang]}
        </button>
      </header>

      <section className={styles.section}>
        <label className={styles.label} htmlFor="day-boundary-hour">
          {SETTINGS_DAY_BOUNDARY_LABEL[lang]}
        </label>
        <p className={styles.subtext}>{SETTINGS_DAY_BOUNDARY_SUBTEXT[lang]}</p>
        <div className={styles.boundaryRow}>
          <input
            id="day-boundary-hour"
            className={styles.hourInput}
            type="number"
            min={HOUR_MIN}
            max={HOUR_MAX}
            value={save.dayBoundaryHour}
            onChange={(e) => handleBoundaryChange(Number(e.target.value))}
          />
          <span className={styles.hourDisplay}>{formatHour(save.dayBoundaryHour)}</span>
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles.label} htmlFor="reminder-time">
          {SETTINGS_REMINDER_LABEL[lang]}
        </label>
        <p className={styles.subtext}>{SETTINGS_REMINDER_SUBTEXT[lang]}</p>
        <input
          id="reminder-time"
          className={styles.timeInput}
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <button className={styles.actionButton} onClick={handleReminderDownload}>
          {SETTINGS_REMINDER_BUTTON[lang]}
        </button>
      </section>

      <section className={styles.section}>
        <button className={styles.actionButton} onClick={handleExport}>
          {SETTINGS_EXPORT_LABEL[lang]}
        </button>

        <label className={styles.actionButton}>
          {SETTINGS_IMPORT_LABEL[lang]}
          <input
            ref={fileInputRef}
            className={styles.hiddenFileInput}
            type="file"
            accept="application/json"
            onChange={handleFileSelected}
          />
        </label>

        {importError !== null && <p className={styles.error}>{importError}</p>}

        {pendingImport !== null && (
          <div className={styles.confirmBox}>
            <p className={styles.confirmMessage}>{SETTINGS_IMPORT_CONFIRM_MESSAGE[lang]}</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmButton} onClick={confirmImport}>
                {SETTINGS_IMPORT_CONFIRM_BUTTON[lang]}
              </button>
              <button className={styles.cancelButton} onClick={cancelImport}>
                {SETTINGS_IMPORT_CANCEL_BUTTON[lang]}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        {resetStep === 'idle' && (
          <button className={styles.dangerButton} onClick={() => setResetStep('confirm1')}>
            {SETTINGS_RESET_STEP1_TITLE[lang]}
          </button>
        )}

        {resetStep === 'confirm1' && (
          <div className={styles.confirmBox}>
            <p className={styles.confirmMessage}>{SETTINGS_RESET_STEP1_TITLE[lang]}</p>
            <p className={styles.subtext}>{SETTINGS_RESET_STEP1_SUBTEXT[lang]}</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmButton} onClick={() => setResetStep('confirm2')}>
                {SETTINGS_RESET_CONFIRM_BUTTON[lang]}
              </button>
              <button className={styles.cancelButton} onClick={() => setResetStep('idle')}>
                {SETTINGS_RESET_CANCEL_BUTTON[lang]}
              </button>
            </div>
          </div>
        )}

        {resetStep === 'confirm2' && (
          <div className={styles.confirmBox}>
            <p className={styles.confirmMessage}>{SETTINGS_RESET_STEP2_TITLE[lang]}</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmButton} onClick={confirmReset}>
                {SETTINGS_RESET_CONFIRM_BUTTON[lang]}
              </button>
              <button className={styles.cancelButton} onClick={() => setResetStep('idle')}>
                {SETTINGS_RESET_CANCEL_BUTTON[lang]}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.appInfo}>{appInfoLabel(APP_VERSION, lang)}</p>
      </section>
    </div>
  )
}
