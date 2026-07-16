import type { Belt } from './types'

// UI 표시용 띠 이름 (도메인 로직과 무관한 표시 전용 매핑 — domain/ 잠긴 파일이 아닌 별도 파일).
const BELT_NAMES: Record<Belt, string> = {
  white: '흰띠',
  yellow: '노란띠',
  green: '초록띠',
  black: '검은띠',
  master: '관장'
}

export function beltName(belt: Belt): string {
  return BELT_NAMES[belt]
}
