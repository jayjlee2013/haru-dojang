import type { GateDef, Lang } from '../domain/types'
import { FREE_GATE_DEFAULT_NAME } from './microcopy'

export const courses: GateDef[] = [
  // 흰띠 — 문을 여는 수련 (튜토리얼)
  {
    id: 'W1',
    belt: 'white',
    order: 1,
    kind: 'normal',
    name: { ko: '물 한 컵 마시기', en: 'Drink a cup of water' },
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W1'
  },
  {
    id: 'W2',
    belt: 'white',
    order: 2,
    kind: 'normal',
    name: { ko: '창문 열고 환기 1분', en: 'Open a window, air out for 1 min' },
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W2'
  },
  {
    id: 'W3',
    belt: 'white',
    order: 3,
    kind: 'normal',
    name: { ko: '이불 정리하고 나오기', en: 'Make the bed before leaving it' },
    rule: { type: 'cumulative', required: 4, windowDays: 6 },
    journalId: 'W3'
  },
  {
    id: 'W4',
    belt: 'white',
    order: 4,
    kind: 'normal',
    name: { ko: '잠들기 전 스트레칭 2분', en: 'Stretch 2 min before bed' },
    rule: { type: 'cumulative', required: 4, windowDays: 6 },
    journalId: 'W4'
  },
  {
    id: 'W-BOSS',
    belt: 'white',
    order: 5,
    kind: 'boss',
    name: { ko: '아침 3종 세트 (물 + 환기 + 이불)', en: 'Morning trio (water + air + bed)' },
    rule: { type: 'consecutive', days: 3 },
    journalId: 'W-BOSS'
  },

  // 노란띠 — 몸을 움직이는 수련
  {
    id: 'Y1',
    belt: 'yellow',
    order: 1,
    kind: 'normal',
    name: { ko: '10분 동네 한 바퀴', en: '10-min walk around the block' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y1'
  },
  {
    id: 'Y2',
    belt: 'yellow',
    order: 2,
    kind: 'normal',
    name: { ko: '책상 위 3분 정리', en: '3-min desk tidy' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y2'
  },
  {
    id: 'Y3',
    belt: 'yellow',
    order: 3,
    kind: 'normal',
    name: { ko: '아침에 휴대폰 보기 전 물 한 컵', en: 'Water before checking your phone' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y3'
  },
  {
    id: 'Y4-free',
    belt: 'yellow',
    order: 4,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y4'
  },
  {
    id: 'Y5',
    belt: 'yellow',
    order: 5,
    kind: 'normal',
    name: { ko: '하루 한 줄 일기', en: 'One line a day' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y5'
  },
  {
    id: 'Y-BOSS',
    belt: 'yellow',
    order: 6,
    kind: 'boss',
    name: { ko: '산책 + 정리 + 한 줄 일기', en: 'Walk + tidy + one line' },
    rule: { type: 'consecutive', days: 3 },
    journalId: 'Y-BOSS'
  },

  // 초록띠 — 마음을 붙드는 수련
  {
    id: 'G1',
    belt: 'green',
    order: 1,
    kind: 'normal',
    name: { ko: '15분 걷기 (동네 밖까지)', en: '15-min walk (past the block)' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G1'
  },
  {
    id: 'G2',
    belt: 'green',
    order: 2,
    kind: 'normal',
    name: { ko: '밥 먹을 때 화면 끄기', en: 'Screen off at meals' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G2'
  },
  {
    id: 'G3-free',
    belt: 'green',
    order: 3,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G3'
  },
  {
    id: 'G4',
    belt: 'green',
    order: 4,
    kind: 'normal',
    name: { ko: '자기 전 내일 할 일 딱 하나 적기', en: 'Write tomorrow\'s one task before bed' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G4'
  },
  {
    id: 'G5-free',
    belt: 'green',
    order: 5,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G5'
  },
  {
    id: 'G-BOSS',
    belt: 'green',
    order: 6,
    kind: 'boss',
    name: { ko: '걷기 + 화면 끄기 + 내일 하나 적기', en: 'Walk + screen off + tomorrow\'s one' },
    rule: { type: 'consecutive', days: 3 },
    journalId: 'G-BOSS'
  },

  // 검은띠 — 혼자 서는 수련
  {
    id: 'B1',
    belt: 'black',
    order: 1,
    kind: 'normal',
    name: { ko: '30분 걷기 또는 운동', en: '30-min walk or workout' },
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'B1'
  },
  {
    id: 'B2-free',
    belt: 'black',
    order: 2,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'B2'
  },
  {
    id: 'B3',
    belt: 'black',
    order: 3,
    kind: 'normal',
    name: { ko: '일주일에 하루 "화면 없는 저녁"', en: 'One "screen-free evening" a week' },
    rule: { type: 'cumulative', required: 2, windowDays: 10 },
    journalId: 'B3'
  },
  {
    id: 'B4-free',
    belt: 'black',
    order: 4,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'B4'
  },
  {
    id: 'B5',
    belt: 'black',
    order: 5,
    kind: 'normal',
    name: { ko: '다섯 줄 일기 (한 줄 → 다섯 줄)', en: 'Five lines (one line → five)' },
    rule: { type: 'cumulative', required: 7, windowDays: 10 },
    journalId: 'B5'
  },
  {
    id: 'B6-free',
    belt: 'black',
    order: 6,
    kind: 'free',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'B6'
  },
  {
    id: 'B-FINAL-BOSS',
    belt: 'black',
    order: 7,
    kind: 'boss',
    name: { ko: '나의 하루 의식 (직접 고른 3가지 묶음)', en: 'My daily ritual (your own set of 3)' },
    rule: { type: 'consecutive', days: 5 },
    journalId: 'B-FINAL-BOSS'
  }
]

/**
 * 관문 표시용 이름을 언어에 맞게 고른다.
 * 빌트인 관문은 LocalizedText, 자유/커스텀 관문은 사용자가 입력한 string.
 * 이름이 아예 없으면(자유 슬롯 미설정) 자유 관문 기본 이름으로 대체한다.
 */
export function gateDisplayName(gate: GateDef, lang: Lang): string {
  if (gate.name === undefined) return FREE_GATE_DEFAULT_NAME[lang]
  return typeof gate.name === 'string' ? gate.name : gate.name[lang]
}
