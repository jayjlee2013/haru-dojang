import { journalEntries } from '../content/journal'
import type { Lang } from '../domain/types'
import { JOURNAL_COUNTER, JOURNAL_LOCKED_MARK, JOURNAL_LOCKED_HINT, BACK_TO_DOJANG } from '../content/microcopy'
import styles from './Journal.module.css'

const PROLOGUE_ID = 'PROLOGUE'
const CHAPTER_ENTRIES = journalEntries.filter((entry) => entry.id !== PROLOGUE_ID)

interface JournalProps {
  journalUnlocked: string[]
  onBack: () => void
  lang: Lang
}

/** 일지 화면: 조각들을 순서대로 세로 스크롤로 보여준다. 잠긴 조각은 표시만 가림. */
export function Journal({ journalUnlocked, onBack, lang }: JournalProps): JSX.Element {
  const unlockedCount = journalUnlocked.filter((id) => id !== PROLOGUE_ID).length

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          {BACK_TO_DOJANG[lang]}
        </button>
        <span className={styles.counter}>
          {JOURNAL_COUNTER(unlockedCount, CHAPTER_ENTRIES.length, lang)}
        </span>
      </header>

      <ul className={styles.list}>
        {CHAPTER_ENTRIES.map((entry) => {
          const isUnlocked = journalUnlocked.includes(entry.id)
          return (
            <li key={entry.id}>
              {isUnlocked ? (
                <article className={styles.entry}>
                  <h3 className={styles.entryTitle}>{entry.title[lang]}</h3>
                  <p className={styles.entryText}>{entry.text[lang]}</p>
                </article>
              ) : (
                <div className={styles.lockedEntry}>
                  <p className={styles.lockedMark}>{JOURNAL_LOCKED_MARK}</p>
                  <p className={styles.lockedHint}>{JOURNAL_LOCKED_HINT[lang]}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
