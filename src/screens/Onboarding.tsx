import { useState } from 'react'
import { journalEntries } from '../content/journal'
import { courses } from '../content/courses'
import {
  ONBOARDING_NEXT_BUTTON,
  ONBOARDING_OPEN_JOURNAL_BUTTON,
  ONBOARDING_START_BUTTON,
  DAY_BOUNDARY_NOTICE
} from '../content/microcopy'
import styles from './Onboarding.module.css'

const PROLOGUE = journalEntries.find((j) => j.id === 'PROLOGUE')
const PROLOGUE_LINES = PROLOGUE !== undefined ? PROLOGUE.text.split('\n') : []
const FIRST_GATE = courses[0]

interface OnboardingProps {
  onComplete: () => void
}

type Step = 'prologue' | 'firstGate'

function PrologueStep({ onFinished }: { onFinished: () => void }): JSX.Element {
  const [lineIndex, setLineIndex] = useState(0)
  const isLastLine = lineIndex === PROLOGUE_LINES.length - 1

  function handleTap(): void {
    if (isLastLine) {
      onFinished()
      return
    }
    setLineIndex((i) => i + 1)
  }

  return (
    <button type="button" className={styles.step} onClick={handleTap}>
      <p className={styles.prologueLine}>{PROLOGUE_LINES[lineIndex]}</p>
      <p className={styles.tapHint}>{isLastLine ? ONBOARDING_OPEN_JOURNAL_BUTTON : ONBOARDING_NEXT_BUTTON}</p>
    </button>
  )
}

function FirstGateStep({ onComplete }: { onComplete: () => void }): JSX.Element {
  return (
    <div className={styles.step}>
      <p className={styles.beltLabel}>흰띠 1관문</p>
      <h2 className={styles.gateName}>{FIRST_GATE.name}</h2>
      <p className={styles.gateCondition}>
        {FIRST_GATE.rule.type === 'cumulative'
          ? `${FIRST_GATE.rule.windowDays}일 안에 ${FIRST_GATE.rule.required}번이면 도장 획득`
          : ''}
      </p>
      <button className={styles.button} onClick={onComplete}>
        {ONBOARDING_START_BUTTON}
      </button>
      <p className={styles.boundaryNotice}>{DAY_BOUNDARY_NOTICE}</p>
    </div>
  )
}

/** 온보딩 2단계: 프롤로그 → 흰띠 1관문 소개(완료) → 도장(홈)으로. 이름 입력/설문/알림 요청 없음. */
export function Onboarding({ onComplete }: OnboardingProps): JSX.Element {
  const [step, setStep] = useState<Step>('prologue')

  if (step === 'prologue') {
    return <PrologueStep onFinished={() => setStep('firstGate')} />
  }

  return <FirstGateStep onComplete={onComplete} />
}
