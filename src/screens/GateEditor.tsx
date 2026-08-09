import { useState } from 'react'
import type { Lang } from '../domain/types'
import { pickNonRepeatingIndex } from '../store/useGameStore'
import {
  GATE_EDITOR_TITLE,
  GATE_EDITOR_GUIDE,
  GATE_EDITOR_LABEL_NAME,
  GATE_EDITOR_LABEL_REQUIRED,
  GATE_EDITOR_LABEL_WINDOW,
  GATE_EDITOR_ERROR_NAME_REQUIRED,
  GATE_EDITOR_ERROR_WINDOW_TOO_SHORT,
  GATE_EDITOR_PRESETS,
  GATE_EDITOR_SUGGEST_TITLE,
  GATE_EDITOR_SUGGEST_GUIDE,
  GATE_EDITOR_USE_THIS,
  GATE_EDITOR_TRY_ANOTHER,
  GATE_EDITOR_CHOOSE_MYSELF,
  cumulativeConditionText,
  MASTER_MODE_EMPTY_BUTTON
} from '../content/microcopy'
import styles from './GateEditor.module.css'

const NAME_MAX_LENGTH = 30
const REQUIRED_MIN = 1
const REQUIRED_MAX = 14
const WINDOW_MAX = 21
const DEFAULT_REQUIRED = 5
const DEFAULT_WINDOW_DAYS = 7

export interface GateEditorProps {
  onSubmit: (name: string, required: number, windowDays: number) => void
  lang: Lang
}

/** 이름/횟수/기간 조합의 유효성을 검사한다. 통과하면 null, 아니면 06문서 원문 오류 문구. */
export function validateGateForm(
  name: string,
  required: number,
  windowDays: number,
  lang: Lang = 'ko'
): string | null {
  if (name.trim().length < 1) return GATE_EDITOR_ERROR_NAME_REQUIRED[lang]
  if (windowDays < required) return GATE_EDITOR_ERROR_WINDOW_TOO_SHORT[lang]
  return null
}

function clampRequired(value: number): number {
  return Math.min(REQUIRED_MAX, Math.max(REQUIRED_MIN, value))
}

function clampWindowDays(value: number): number {
  return Math.min(WINDOW_MAX, Math.max(1, value))
}

type Mode = 'suggest' | 'form'

/**
 * 자유 관문 / 무한 수련 모드 공용 "관문 만들기" 화면.
 * 스스로 정하기 어려운 사람을 위해 프리셋 하나를 먼저 추천하고(suggest 모드),
 * "직접 정한다"를 누르면 기존 3필드 폼(form 모드)이 열린다 — 06문서 섹션8 스펙.
 */
export function GateEditor({ onSubmit, lang }: GateEditorProps): JSX.Element {
  const [mode, setMode] = useState<Mode>('suggest')
  const [suggestIndex, setSuggestIndex] = useState(() =>
    pickNonRepeatingIndex(GATE_EDITOR_PRESETS[lang].length, null)
  )
  const [name, setName] = useState('')
  const [required, setRequired] = useState(DEFAULT_REQUIRED)
  const [windowDays, setWindowDays] = useState(DEFAULT_WINDOW_DAYS)
  const [error, setError] = useState<string | null>(null)

  function handlePreset(preset: string): void {
    setName(preset)
    setRequired(DEFAULT_REQUIRED)
    setWindowDays(DEFAULT_WINDOW_DAYS)
    setError(null)
  }

  function handleTryAnother(): void {
    setSuggestIndex((prev) => pickNonRepeatingIndex(GATE_EDITOR_PRESETS[lang].length, prev))
  }

  function handleUseSuggested(): void {
    const preset = GATE_EDITOR_PRESETS[lang][suggestIndex]
    onSubmit(preset, DEFAULT_REQUIRED, DEFAULT_WINDOW_DAYS)
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()
    const trimmedName = name.trim()
    const validationError = validateGateForm(trimmedName, required, windowDays, lang)
    if (validationError !== null) {
      setError(validationError)
      return
    }
    setError(null)
    onSubmit(trimmedName, required, windowDays)
  }

  if (mode === 'suggest') {
    const suggestedName = GATE_EDITOR_PRESETS[lang][suggestIndex]
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>{GATE_EDITOR_SUGGEST_TITLE[lang]}</h2>
        <p className={styles.guide}>{GATE_EDITOR_SUGGEST_GUIDE[lang]}</p>

        <p className={styles.suggestedName}>{suggestedName}</p>
        <p className={styles.suggestedCondition}>
          {cumulativeConditionText(DEFAULT_REQUIRED, DEFAULT_WINDOW_DAYS, lang)}
        </p>

        <button className={styles.submitButton} type="button" onClick={handleUseSuggested}>
          {GATE_EDITOR_USE_THIS[lang]}
        </button>
        <div className={styles.suggestActions}>
          <button className={styles.secondaryButton} type="button" onClick={handleTryAnother}>
            {GATE_EDITOR_TRY_ANOTHER[lang]}
          </button>
          <button className={styles.secondaryButton} type="button" onClick={() => setMode('form')}>
            {GATE_EDITOR_CHOOSE_MYSELF[lang]}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{GATE_EDITOR_TITLE[lang]}</h2>
      <p className={styles.guide}>{GATE_EDITOR_GUIDE[lang]}</p>

      <form onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>{GATE_EDITOR_LABEL_NAME[lang]}</span>
          <input
            className={styles.input}
            type="text"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{GATE_EDITOR_LABEL_REQUIRED[lang]}</span>
          <input
            className={styles.input}
            type="number"
            min={REQUIRED_MIN}
            max={REQUIRED_MAX}
            value={required}
            onChange={(e) => setRequired(clampRequired(Number(e.target.value)))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{GATE_EDITOR_LABEL_WINDOW[lang]}</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={WINDOW_MAX}
            value={windowDays}
            onChange={(e) => setWindowDays(clampWindowDays(Number(e.target.value)))}
          />
        </label>

        {error !== null && <p className={styles.error}>{error}</p>}

        <button className={styles.submitButton} type="submit">
          {MASTER_MODE_EMPTY_BUTTON[lang]}
        </button>
      </form>

      <div className={styles.presets}>
        {GATE_EDITOR_PRESETS[lang].map((preset) => (
          <button
            key={preset}
            type="button"
            className={styles.presetButton}
            onClick={() => handlePreset(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </section>
  )
}
