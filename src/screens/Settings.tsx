import { useRef, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { parseSaveData } from '../store/saveSchema'
import { dayKey } from '../domain/day'
import {
  SETTINGS_DAY_BOUNDARY_LABEL,
  SETTINGS_DAY_BOUNDARY_SUBTEXT,
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

  function handleBoundaryChange(value: number): void {
    setDayBoundaryHour(value)
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
