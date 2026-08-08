// 06-microcopy.md 원문 그대로 옮긴 문구 모음. 임의 수정·창작 금지.
import type { Belt } from '../domain/types'

// 섹션 1: 도장 찍은 직후 반응 (랜덤 풀)
export const STAMP_REACTIONS: readonly string[] = [
  '좋다.',
  '오늘 몫을 했다.',
  '쌓인다.',
  '그거면 된다.',
  '어제의 너보다 한 번 더.',
  '수련은 소리가 나지 않는다. 이렇게 쌓일 뿐.',
  '도장은 거짓말을 하지 않는다.',
  '작다고 웃지 마라. 산도 돌 하나부터다.',
  '됐다. 가서 네 하루를 살아라.',
  '물 흐르듯. 내일 또.'
]

// 관장이 먼저 건네는 말: 특별한 순간(연속·복귀)에만. 06문서 톤(짧고 담백, 무뚝뚝하나 온기)을 따른다.
const MASTER_RETURN_LINES: readonly string[] = [
  '다시 왔구나. 수련은 이어 붙이는 것이다.',
  '하루 쉬었다고 무너지지 않는다. 봐라, 여기 있지 않느냐.',
  '어제는 어제고, 오늘은 오늘이다.',
  '돌아온 발걸음이 가장 무겁다. 그걸 네가 뗐다.'
]

const MASTER_STREAK_LINES: readonly string[] = [
  '요즘 발이 가볍구나.',
  '연달아 오는군. 이런 날이 수련을 만든다.',
  '멈추지 않는 자를 이길 방법은 없다.',
  '몸이 리듬을 기억하기 시작했다.'
]

/** 관장의 문맥 반응 문구를 하나 고른다 (return/streak 순간에만 호출). */
export function masterReactionLine(context: 'return' | 'streak'): string {
  const pool = context === 'return' ? MASTER_RETURN_LINES : MASTER_STREAK_LINES
  return pool[Math.floor(Math.random() * pool.length)]
}

// 섹션 2: 오늘 이미 찍음 상태
export const ALREADY_STAMPED_BUTTON = '오늘 수련 완료'
export const ALREADY_STAMPED_SUBTEXT = '내일 새벽 4시에 새 하루가 열린다'

// 섹션 3: 기한 임박 경고
export const DEADLINE_WARNING = '이제부터는 하루도 빠질 수 없다.'

// 섹션 4: 관문 실패 → 재수련 카드 (랜덤 풀)
export const RETRAIN_MESSAGES: readonly string[] = [
  '괜찮다. 다시.',
  '넘어진 것까지가 수련이다.',
  '실패한 관문은 있어도, 끝난 수련은 없다.',
  '이 관문이 유난히 미끄러웠을 뿐이다. 다시 잡아라.',
  '돌아온 것만으로 반은 됐다.',
  '기록은 지워졌지만, 몸은 기억한다.'
]
export const RETRAIN_BUTTON = '재수련 시작'
export const RETRAIN_ATTEMPT_SUBTEXT = (attempt: number): string =>
  `${attempt}번째 도전. 관장은 횟수를 세지 않는다.`

// 섹션 7: 관문 클리어 (보스 아닌 일반 관문)
export const GATE_CLEARED_LABEL = (gateName: string): string => `관문 돌파 ${gateName}`
export const JOURNAL_OPEN_BUTTON = '일지가 한 장 열렸다'

// 섹션 11: 온보딩
export const ONBOARDING_NEXT_BUTTON = '다음'
export const ONBOARDING_OPEN_JOURNAL_BUTTON = '일지를 펼친다'
export const ONBOARDING_START_BUTTON = '수련 시작'
export const DAY_BOUNDARY_NOTICE = '새벽 4시까지는 오늘로 칩니다'

// 섹션 5: 보스전
export const BOSS_ENTRY_NOTICE = '승급 심사다. 사흘. 변명은 접어두고.'
export const BOSS_FINAL_ENTRY_NOTICE = '마지막 심사다. 닷새. 네가 고른 것들로 치른다.'
export const BOSS_DAY_SUCCESS_MESSAGES: readonly string[] = [
  '하루. 흔들리지 마라.',
  '이틀. 반환점이다.'
]
export const BOSS_STREAK_BROKEN = '심사는 다시 열린다. 언제든.'
export const BOSS_RETRY_START = '숨 고르고. 다시 사흘.'

// 섹션 6: 승급 오버레이
export const PROMOTION_MESSAGES: Partial<Record<Belt, string>> = {
  yellow: '노란 띠를 맨다. 이제 시작이다.',
  green: '초록 띠를 맨다. 몸이 기억하기 시작했다.',
  black: '검은 띠를 맨다. 이제 혼자서도 갈 수 있다.'
  // master(관장 취임): 문구 없음 — 일지 조각이 전부를 말한다.
}

// 섹션 10: 일지 화면
export const JOURNAL_COUNTER = (unlocked: number, total: number): string =>
  `일지 ${unlocked}/${total}장`
export const JOURNAL_LOCKED_MARK = '▨▨▨'
export const JOURNAL_LOCKED_HINT = '다음 관문을 깨면 열린다'

// 섹션 8: 자유 관문 만들기
export const GATE_EDITOR_TITLE = '나만의 관문'
export const GATE_EDITOR_GUIDE = '작게 정할수록 좋은 관문이다. — 관장'
export const GATE_EDITOR_LABEL_NAME = '무엇을'
export const GATE_EDITOR_LABEL_REQUIRED = '몇 번'
export const GATE_EDITOR_LABEL_WINDOW = '며칠 안에'
export const GATE_EDITOR_ERROR_NAME_REQUIRED = '관문의 이름이 필요하다'
export const GATE_EDITOR_ERROR_WINDOW_TOO_SHORT =
  '횟수보다 기간이 짧다. 하루에 한 번씩이 최대다'
export const GATE_EDITOR_PRESETS: readonly string[] = [
  '10분 책 읽기',
  '설거지 바로 하기',
  '저녁 산책',
  '아침 커피는 앉아서 마시기',
  '하루 한 번 하늘 보기',
  '영양제 챙겨 먹기',
  '5분 눈 감고 앉아 있기',
  '미루던 연락 하나 하기',
  '점심은 책상 밖에서',
  '자기 전 5분 정리',
  '물 여섯 컵',
  '계단으로 다니기'
]

// 섹션 9: 무한 수련 모드
export const MASTER_MODE_EMPTY_MESSAGE = '도장이 비어 있다. 다음 관문은 관장이 정한다 — 그게 너다.'
export const MASTER_MODE_EMPTY_BUTTON = '관문 만들기'
export const MASTER_MODE_JOURNAL_PROMPT = '오늘의 장을 남기겠는가. 짧아도 된다.'
export const MASTER_MODE_JOURNAL_PLACEHOLDER = (day: number): string => `수련 ${day}일. `
export const MASTER_MODE_JOURNAL_SAVED = '일지가 두꺼워진다.'

// 섹션 12: 설정·시스템 문구 (앱 톤 — 관장 아님)
export const SETTINGS_DAY_BOUNDARY_LABEL = '하루의 시작 시각'
export const SETTINGS_DAY_BOUNDARY_SUBTEXT = '이 시각 전까지는 전날로 칩니다'
export const SETTINGS_EXPORT_LABEL = '데이터 내보내기 (JSON)'
export const SETTINGS_IMPORT_LABEL = '데이터 가져오기'
export const SETTINGS_IMPORT_FAILURE =
  '파일을 읽을 수 없습니다. 하루도장에서 내보낸 파일인지 확인해 주세요'
export const SETTINGS_IMPORT_CONFIRM_MESSAGE = '지금 데이터를 이 파일로 바꿉니다. 계속할까요?'
export const SETTINGS_IMPORT_CONFIRM_BUTTON = '바꾸기'
export const SETTINGS_IMPORT_CANCEL_BUTTON = '취소'
export const SETTINGS_RESET_STEP1_TITLE = '도장을 닫습니까?'
export const SETTINGS_RESET_STEP1_SUBTEXT = '모든 도장과 일지가 사라집니다'
export const SETTINGS_RESET_STEP2_TITLE = '정말로 닫습니까? 되돌릴 수 없습니다'
export const SETTINGS_RESET_CONFIRM_BUTTON = '닫는다'
export const SETTINGS_RESET_CANCEL_BUTTON = '남는다'
export const SETTINGS_CLOCK_ROLLBACK_WARNING =
  '기기의 날짜가 마지막 수련보다 과거입니다. 날짜를 확인해 주세요'
