import type { Belt, Lang } from './types'

// UI 표시용 띠 이름 (도메인 로직과 무관한 표시 전용 매핑 — domain/ 잠긴 파일이 아닌 별도 파일).
const BELT_NAMES: Record<Belt, Record<Lang, string>> = {
  white: { ko: '흰띠', en: 'White belt' },
  yellow: { ko: '노란띠', en: 'Yellow belt' },
  green: { ko: '초록띠', en: 'Green belt' },
  black: { ko: '검은띠', en: 'Black belt' },
  master: { ko: '관장', en: 'Head master' }
}

export function beltName(belt: Belt, lang: Lang): string {
  return BELT_NAMES[belt][lang]
}
