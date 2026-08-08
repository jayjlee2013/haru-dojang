import { useState } from 'react'
import { journalEntries } from '../content/journal'
import { courses, gateDisplayName } from '../content/courses'
import { useGameStore } from '../store/useGameStore'
import type { Lang } from '../domain/types'
import {
  ONBOARDING_NEXT_BUTTON,
  ONBOARDING_OPEN_JOURNAL_BUTTON,
  ONBOARDING_START_BUTTON,
  DAY_BOUNDARY_NOTICE,
  WHITE_BELT_GATE1_LABEL,
  cumulativeConditionText
} from '../content/microcopy'
import styles from './Onboarding.module.css'

const PROLOGUE = journalEntries.find((j) => j.id === 'PROLOGUE')
const FIRST_GATE = courses[0]

interface OnboardingProps {
  onComplete: () => void
}

type Step = 'prologue' | 'firstGate'

function PrologueStep({ lang, onFinished }: { lang: Lang; onFinished: () => void }): JSX.Element {
  const [lineIndex, setLineIndex] = useState(0)
  const lines = PROLOGUE !== undefined ? PROLOGUE.text[lang].split('\n') : []
  const isLastLine = lineIndex === lines.length - 1

  function handleTap(): void {
    if (isLastLine) {
      onFinished()
      return
    }
    setLineIndex((i) => i + 1)
  }

  return (
    <button type="button" className={styles.step} onClick={handleTap}>
      <p className={styles.prologueLine}>{lines[lineIndex]}</p>
      <p className={styles.tapHint}>
        {isLastLine ? ONBOARDING_OPEN_JOURNAL_BUTTON[lang] : ONBOARDING_NEXT_BUTTON[lang]}
      </p>
    </button>
  )
}

function FirstGateStep({ lang, onComplete }: { lang: Lang; onComplete: () => void }): JSX.Element {
  return (
    <div className={styles.step}>
      <p className={styles.beltLabel}>{WHITE_BELT_GATE1_LABEL[lang]}</p>
      <h2 className={styles.gateName}>{gateDisplayName(FIRST_GATE, lang)}</h2>
      <p className={styles.gateCondition}>
        {FIRST_GATE.rule.type === 'cumulative'
          ? cumulativeConditionText(FIRST_GATE.rule.required, FIRST_GATE.rule.windowDays, lang)
          : ''}
      </p>
      <button className={styles.button} onClick={onComplete}>
        {ONBOARDING_START_BUTTON[lang]}
      </button>
      <p className={styles.boundaryNotice}>{DAY_BOUNDARY_NOTICE[lang]}</p>
    </div>
  )
}

/**
 * 온보딩 2단계: 프롤로그 → 흰띠 1관문 소개(완료) → 도장(홈)으로. 이름 입력/설문/알림 요청 없음.
 * 언어는 빌드 시점에 고정(VITE_LANG) — 화면 안에 전환 UI는 없다.
 */
export function Onboarding({ onComplete }: OnboardingProps): JSX.Element {
  const [step, setStep] = useState<Step>('prologue')
  const lang = useGameStore((s) => s.lang)

  return step === 'prologue' ? (
    <PrologueStep lang={lang} onFinished={() => setStep('firstGate')} />
  ) : (
    <FirstGateStep lang={lang} onComplete={onComplete} />
  )
}
