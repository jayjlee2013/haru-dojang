import type { GateDef } from '../domain/types'

export const courses: GateDef[] = [
  // 흰띠 — 문을 여는 수련 (튜토리얼)
  {
    id: 'W1',
    belt: 'white',
    order: 1,
    kind: 'normal',
    name: '물 한 컵 마시기',
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W1'
  },
  {
    id: 'W2',
    belt: 'white',
    order: 2,
    kind: 'normal',
    name: '창문 열고 환기 1분',
    rule: { type: 'cumulative', required: 3, windowDays: 5 },
    journalId: 'W2'
  },
  {
    id: 'W3',
    belt: 'white',
    order: 3,
    kind: 'normal',
    name: '이불 정리하고 나오기',
    rule: { type: 'cumulative', required: 4, windowDays: 6 },
    journalId: 'W3'
  },
  {
    id: 'W4',
    belt: 'white',
    order: 4,
    kind: 'normal',
    name: '잠들기 전 스트레칭 2분',
    rule: { type: 'cumulative', required: 4, windowDays: 6 },
    journalId: 'W4'
  },
  {
    id: 'W-BOSS',
    belt: 'white',
    order: 5,
    kind: 'boss',
    name: '아침 3종 세트 (물 + 환기 + 이불)',
    rule: { type: 'consecutive', days: 3 },
    journalId: 'W-BOSS'
  },

  // 노란띠 — 몸을 움직이는 수련
  {
    id: 'Y1',
    belt: 'yellow',
    order: 1,
    kind: 'normal',
    name: '10분 동네 한 바퀴',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y1'
  },
  {
    id: 'Y2',
    belt: 'yellow',
    order: 2,
    kind: 'normal',
    name: '책상 위 3분 정리',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y2'
  },
  {
    id: 'Y3',
    belt: 'yellow',
    order: 3,
    kind: 'normal',
    name: '아침에 휴대폰 보기 전 물 한 컵',
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
    name: '하루 한 줄 일기',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'Y5'
  },
  {
    id: 'Y-BOSS',
    belt: 'yellow',
    order: 6,
    kind: 'boss',
    name: '산책 + 정리 + 한 줄 일기',
    rule: { type: 'consecutive', days: 3 },
    journalId: 'Y-BOSS'
  },

  // 초록띠 — 마음을 붙드는 수련
  {
    id: 'G1',
    belt: 'green',
    order: 1,
    kind: 'normal',
    name: '15분 걷기 (동네 밖까지)',
    rule: { type: 'cumulative', required: 5, windowDays: 7 },
    journalId: 'G1'
  },
  {
    id: 'G2',
    belt: 'green',
    order: 2,
    kind: 'normal',
    name: '밥 먹을 때 화면 끄기',
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
    name: '자기 전 내일 할 일 딱 하나 적기',
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
    name: '걷기 + 화면 끄기 + 내일 하나 적기',
    rule: { type: 'consecutive', days: 3 },
    journalId: 'G-BOSS'
  },

  // 검은띠 — 혼자 서는 수련
  {
    id: 'B1',
    belt: 'black',
    order: 1,
    kind: 'normal',
    name: '30분 걷기 또는 운동',
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
    name: '일주일에 하루 "화면 없는 저녁"',
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
    name: '다섯 줄 일기 (한 줄 → 다섯 줄)',
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
    name: '나의 하루 의식 (직접 고른 3가지 묶음)',
    rule: { type: 'consecutive', days: 5 },
    journalId: 'B-FINAL-BOSS'
  }
]
