// 06-microcopy.md 원문 + 07-i18n-en-content.md 영어 원문을 그대로 옮긴 문구 모음. 임의 수정·창작 금지.
import type { Belt, Lang } from '../domain/types'

// 섹션 1: 도장 찍은 직후 반응 (랜덤 풀)
export const STAMP_REACTIONS: Record<Lang, readonly string[]> = {
  ko: [
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
  ],
  en: [
    'Good.',
    "Did today's share.",
    'It adds up.',
    "That's enough.",
    "One more than yesterday's you.",
    'Training makes no sound. It just accumulates, like this.',
    "The mark doesn't lie.",
    "Don't laugh at small. Mountains start with one stone.",
    'Done. Go live your day.',
    'Like water flowing. Again tomorrow.'
  ]
}

// 관장이 먼저 건네는 말: 특별한 순간(연속·복귀)에만. 06문서 톤(짧고 담백, 무뚝뚝하나 온기)을 따른다.
const MASTER_RETURN_LINES: Record<Lang, readonly string[]> = {
  ko: [
    '다시 왔구나. 수련은 이어 붙이는 것이다.',
    '하루 쉬었다고 무너지지 않는다. 봐라, 여기 있지 않느냐.',
    '어제는 어제고, 오늘은 오늘이다.',
    '돌아온 발걸음이 가장 무겁다. 그걸 네가 뗐다.'
  ],
  en: [
    "You're back. Training is something you stitch together.",
    "One day off doesn't break it. Look — here you are.",
    'Yesterday was yesterday. Today is today.',
    'The step back is the heaviest one. You took it.'
  ]
}

const MASTER_STREAK_LINES: Record<Lang, readonly string[]> = {
  ko: [
    '요즘 발이 가볍구나.',
    '연달아 오는군. 이런 날이 수련을 만든다.',
    '멈추지 않는 자를 이길 방법은 없다.',
    '몸이 리듬을 기억하기 시작했다.'
  ],
  en: [
    "Your steps have gotten lighter lately.",
    'Day after day. This is what makes training.',
    "There's no beating someone who doesn't stop.",
    "The body's starting to remember the rhythm."
  ]
}

/** 관장의 문맥 반응 문구를 하나 고른다 (return/streak 순간에만 호출). */
export function masterReactionLine(context: 'return' | 'streak', lang: Lang): string {
  const pool = context === 'return' ? MASTER_RETURN_LINES[lang] : MASTER_STREAK_LINES[lang]
  return pool[Math.floor(Math.random() * pool.length)]
}

// 섹션 2: 오늘 이미 찍음 상태
export const ALREADY_STAMPED_BUTTON: Record<Lang, string> = {
  ko: '오늘 수련 완료',
  en: "Today's training done"
}
export const ALREADY_STAMPED_SUBTEXT: Record<Lang, string> = {
  ko: '내일 새벽 4시에 새 하루가 열린다',
  en: 'A new day opens at 4am tomorrow'
}

// 섹션 3: 기한 임박 경고
export const DEADLINE_WARNING: Record<Lang, string> = {
  ko: '이제부터는 하루도 빠질 수 없다.',
  en: 'No days left to spare from here.'
}

// 섹션 4: 관문 실패 → 재수련 카드 (랜덤 풀)
export const RETRAIN_MESSAGES: Record<Lang, readonly string[]> = {
  ko: [
    '괜찮다. 다시.',
    '넘어진 것까지가 수련이다.',
    '실패한 관문은 있어도, 끝난 수련은 없다.',
    '이 관문이 유난히 미끄러웠을 뿐이다. 다시 잡아라.',
    '돌아온 것만으로 반은 됐다.',
    '기록은 지워졌지만, 몸은 기억한다.'
  ],
  en: [
    "It's fine. Again.",
    'Falling is part of the training too.',
    'A gate can fail. Training never ends.',
    'This gate was just slippery. Take hold again.',
    'Coming back is already half of it.',
    "The record's gone. The body remembers."
  ]
}
export const RETRAIN_BUTTON: Record<Lang, string> = { ko: '재수련 시작', en: 'Start over' }
export const RETRAIN_ATTEMPT_SUBTEXT = (attempt: number, lang: Lang): string =>
  lang === 'ko'
    ? `${attempt}번째 도전. 관장은 횟수를 세지 않는다.`
    : `Attempt ${attempt}. The master doesn't count them.`

// 섹션 7: 관문 클리어 (보스 아닌 일반 관문)
export const GATE_CLEARED_LABEL = (gateName: string, lang: Lang): string =>
  lang === 'ko' ? `관문 돌파 ${gateName}` : `Gate cleared: ${gateName}`
export const JOURNAL_OPEN_BUTTON: Record<Lang, string> = {
  ko: '일지가 한 장 열렸다',
  en: 'A page of the journal opened'
}

// 섹션 11: 온보딩
export const ONBOARDING_NEXT_BUTTON: Record<Lang, string> = { ko: '다음', en: 'Next' }
export const ONBOARDING_OPEN_JOURNAL_BUTTON: Record<Lang, string> = {
  ko: '일지를 펼친다',
  en: 'Open the journal'
}
export const ONBOARDING_START_BUTTON: Record<Lang, string> = { ko: '수련 시작', en: 'Begin training' }
export const DAY_BOUNDARY_NOTICE: Record<Lang, string> = {
  ko: '새벽 4시까지는 오늘로 칩니다',
  en: 'Anything before 4am still counts as today'
}

// 섹션 5: 보스전
export const BOSS_ENTRY_NOTICE: Record<Lang, string> = {
  ko: '승급 심사다. 사흘. 변명은 접어두고.',
  en: 'Promotion trial. Three days. Fold up the excuses.'
}
export const BOSS_FINAL_ENTRY_NOTICE: Record<Lang, string> = {
  ko: '마지막 심사다. 닷새. 네가 고른 것들로 치른다.',
  en: 'The last trial. Five days. Fought with what you chose.'
}
export const BOSS_DAY_SUCCESS_MESSAGES: Record<Lang, readonly string[]> = {
  ko: ['하루. 흔들리지 마라.', '이틀. 반환점이다.'],
  en: ["One day. Don't waver.", 'Two days. The turning point.']
}
export const BOSS_STREAK_BROKEN: Record<Lang, string> = {
  ko: '심사는 다시 열린다. 언제든.',
  en: 'The trial opens again. Anytime.'
}
export const BOSS_RETRY_START: Record<Lang, string> = {
  ko: '숨 고르고. 다시 사흘.',
  en: 'Catch your breath. Three days again.'
}

// 섹션 6: 승급 오버레이
export const PROMOTION_MESSAGES: Partial<Record<Belt, Record<Lang, string>>> = {
  yellow: { ko: '노란 띠를 맨다. 이제 시작이다.', en: 'Tying on the yellow belt. Now it begins.' },
  green: { ko: '초록 띠를 맨다. 몸이 기억하기 시작했다.', en: 'Tying on the green belt. The body\'s started to remember.' },
  black: { ko: '검은 띠를 맨다. 이제 혼자서도 갈 수 있다.', en: 'Tying on the black belt. You can go on alone now.' }
  // master(관장 취임): 문구 없음 — 일지 조각이 전부를 말한다.
}

// 섹션 10: 일지 화면
export const JOURNAL_COUNTER = (unlocked: number, total: number, lang: Lang): string =>
  lang === 'ko' ? `일지 ${unlocked}/${total}장` : `Journal ${unlocked}/${total}`
export const JOURNAL_LOCKED_MARK = '▨▨▨' // 그대로 (양쪽 언어 동일)
export const JOURNAL_LOCKED_HINT: Record<Lang, string> = {
  ko: '다음 관문을 깨면 열린다',
  en: 'Opens when you clear the next gate'
}

// 섹션 8: 자유 관문 만들기
export const GATE_EDITOR_TITLE: Record<Lang, string> = { ko: '나만의 관문', en: 'My own gate' }
export const GATE_EDITOR_GUIDE: Record<Lang, string> = {
  ko: '작게 정할수록 좋은 관문이다. — 관장',
  en: 'The smaller the goal, the better the gate. — Master'
}
export const GATE_EDITOR_LABEL_NAME: Record<Lang, string> = { ko: '무엇을', en: 'What' }
export const GATE_EDITOR_LABEL_REQUIRED: Record<Lang, string> = { ko: '몇 번', en: 'How many times' }
export const GATE_EDITOR_LABEL_WINDOW: Record<Lang, string> = { ko: '며칠 안에', en: 'Within how many days' }
export const GATE_EDITOR_ERROR_NAME_REQUIRED: Record<Lang, string> = {
  ko: '관문의 이름이 필요하다',
  en: 'The gate needs a name'
}
export const GATE_EDITOR_ERROR_WINDOW_TOO_SHORT: Record<Lang, string> = {
  ko: '횟수보다 기간이 짧다. 하루에 한 번씩이 최대다',
  en: "The window's shorter than the count. Once a day is the max."
}
// 자동 추천 모드 — 정하기 어려운 사람을 위해 관장이 프리셋 하나를 먼저 내민다.
export const GATE_EDITOR_SUGGEST_TITLE: Record<Lang, string> = {
  ko: '관장이 정해준 관문',
  en: "The master's pick"
}
export const GATE_EDITOR_SUGGEST_GUIDE: Record<Lang, string> = {
  ko: '정하기 어렵다면, 이걸로.',
  en: "Can't decide? Take this one."
}
export const GATE_EDITOR_USE_THIS: Record<Lang, string> = { ko: '이걸로 한다', en: 'Use this' }
export const GATE_EDITOR_TRY_ANOTHER: Record<Lang, string> = { ko: '다른 걸로', en: 'Something else' }
export const GATE_EDITOR_CHOOSE_MYSELF: Record<Lang, string> = { ko: '직접 정한다', en: "I'll decide" }

export const GATE_EDITOR_PRESETS: Record<Lang, readonly string[]> = {
  ko: [
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
  ],
  en: [
    'Read for 10 minutes',
    'Do the dishes right away',
    'Evening walk',
    'Drink morning coffee sitting down',
    'Look at the sky once a day',
    'Take your vitamins',
    'Sit with eyes closed for 5 minutes',
    "Make one call you've been putting off",
    'Eat lunch away from your desk',
    'Tidy up 5 minutes before bed',
    'Six cups of water',
    'Take the stairs'
  ]
}

// 섹션 9: 무한 수련 모드
export const MASTER_MODE_EMPTY_MESSAGE: Record<Lang, string> = {
  ko: '도장이 비어 있다. 다음 관문은 관장이 정한다 — 그게 너다.',
  en: 'The dojang is empty. The master decides the next gate — that\'s you.'
}
export const MASTER_MODE_EMPTY_BUTTON: Record<Lang, string> = { ko: '관문 만들기', en: 'Make a gate' }
export const MASTER_MODE_JOURNAL_PROMPT: Record<Lang, string> = {
  ko: '오늘의 장을 남기겠는가. 짧아도 된다.',
  en: 'Leave today\'s page? Short is fine.'
}
export const MASTER_MODE_JOURNAL_PLACEHOLDER = (day: number, lang: Lang): string =>
  lang === 'ko' ? `수련 ${day}일. ` : `Day ${day}. `
export const MASTER_MODE_JOURNAL_SAVED: Record<Lang, string> = {
  ko: '일지가 두꺼워진다.',
  en: 'The journal grows thicker.'
}

// 섹션 12: 설정·시스템 문구 (앱 톤 — 관장 아님)
export const SETTINGS_DAY_BOUNDARY_LABEL: Record<Lang, string> = { ko: '하루의 시작 시각', en: 'Start of day' }
export const SETTINGS_DAY_BOUNDARY_SUBTEXT: Record<Lang, string> = {
  ko: '이 시각 전까지는 전날로 칩니다',
  en: 'Before this time still counts as the previous day'
}
export const SETTINGS_EXPORT_LABEL: Record<Lang, string> = {
  ko: '데이터 내보내기 (JSON)',
  en: 'Export data (JSON)'
}
export const SETTINGS_IMPORT_LABEL: Record<Lang, string> = { ko: '데이터 가져오기', en: 'Import data' }
export const SETTINGS_IMPORT_FAILURE: Record<Lang, string> = {
  ko: '파일을 읽을 수 없습니다. 하루도장에서 내보낸 파일인지 확인해 주세요',
  en: "Couldn't read the file. Make sure it was exported from Haru Dojang"
}
export const SETTINGS_IMPORT_CONFIRM_MESSAGE: Record<Lang, string> = {
  ko: '지금 데이터를 이 파일로 바꿉니다. 계속할까요?',
  en: 'This will replace your data with this file. Continue?'
}
export const SETTINGS_IMPORT_CONFIRM_BUTTON: Record<Lang, string> = { ko: '바꾸기', en: 'Replace' }
export const SETTINGS_IMPORT_CANCEL_BUTTON: Record<Lang, string> = { ko: '취소', en: 'Cancel' }
export const SETTINGS_RESET_STEP1_TITLE: Record<Lang, string> = {
  ko: '도장을 닫습니까?',
  en: 'Close the dojang?'
}
export const SETTINGS_RESET_STEP1_SUBTEXT: Record<Lang, string> = {
  ko: '모든 도장과 일지가 사라집니다',
  en: 'All stamps and journal entries will be gone'
}
export const SETTINGS_RESET_STEP2_TITLE: Record<Lang, string> = {
  ko: '정말로 닫습니까? 되돌릴 수 없습니다',
  en: "Really close it? This can't be undone"
}
export const SETTINGS_RESET_CONFIRM_BUTTON: Record<Lang, string> = { ko: '닫는다', en: 'Close it' }
export const SETTINGS_RESET_CANCEL_BUTTON: Record<Lang, string> = { ko: '남는다', en: 'Stay' }
export const SETTINGS_CLOCK_ROLLBACK_WARNING: Record<Lang, string> = {
  ko: '기기의 날짜가 마지막 수련보다 과거입니다. 날짜를 확인해 주세요',
  en: "Your device's date is earlier than your last training. Please check the date"
}
export const SETTINGS_REMINDER_LABEL: Record<Lang, string> = {
  ko: '매일 알림 걸기',
  en: 'Set a daily reminder'
}
export const SETTINGS_REMINDER_SUBTEXT: Record<Lang, string> = {
  ko: '앱은 알림을 보내지 않습니다. 고른 시각으로 폰 캘린더에 반복 일정을 하나 넣어 드립니다',
  en: "The app never sends notifications. This adds one repeating event to your phone's calendar at the time you choose"
}
export const SETTINGS_REMINDER_BUTTON: Record<Lang, string> = {
  ko: '캘린더에 넣기',
  en: 'Add to calendar'
}
// 캘린더 앱 안에서 보일 문구 (앱 밖이라 짧게 — .ics 한 줄 75바이트 제한도 감안)
export const REMINDER_EVENT_TITLE: Record<Lang, string> = { ko: '하루도장', en: 'Haru Dojang' }
export const REMINDER_EVENT_DESCRIPTION: Record<Lang, string> = {
  ko: '오늘의 도장을 찍을 시간입니다.',
  en: "Time to make today's mark."
}

// 컴포넌트/화면에 직접 박혀 있던 문구
export const FREE_GATE_DEFAULT_NAME: Record<Lang, string> = { ko: '나만의 관문', en: 'My own gate' }
export const FREE_SLOT_UNLOCK_NOTICE: Record<Lang, string> = {
  ko: '자유 관문이 열렸다',
  en: 'A free gate has opened'
}
export const GATE_NOT_FOUND: Record<Lang, string> = {
  ko: '관문 정보를 찾을 수 없다.',
  en: 'Gate not found.'
}
export const BACK_TO_DOJANG: Record<Lang, string> = { ko: '도장으로', en: 'Back to dojang' }
export const CURRENT_GATE_LABEL = (gateOrder: number, lang: Lang): string =>
  lang === 'ko' ? `지금 도전 중인 관문 · ${gateOrder}번째` : `Current gate · #${gateOrder}`
export const REMAINING_DAYS_LABEL = (remainingDays: number, lang: Lang): string =>
  lang === 'ko' ? `오늘 포함 ${remainingDays}일 남음` : `${remainingDays} days left, including today`
export const PROGRESS_SEGMENTS_ARIA_LABEL = (filled: number, total: number, lang: Lang): string =>
  lang === 'ko' ? `${total}번 중 ${filled}번 완료` : `${filled} of ${total} done`
export const STAMP_TODAY_BUTTON: Record<Lang, string> = { ko: '오늘 도장 찍기', en: 'Stamp today' }
export const MASTER_MODE_DAYS_LABEL = (masterModeDays: number, lang: Lang): string =>
  lang === 'ko' ? `관장 수련 ${masterModeDays}일째` : `Day ${masterModeDays} as master`
export const TOTAL_STAMPS_LABEL = (totalStamps: number, lang: Lang): string =>
  lang === 'ko' ? `도장 ${totalStamps}개` : `${totalStamps} stamps`
export const JOURNAL_ARIA_LABEL: Record<Lang, string> = { ko: '일지', en: 'Journal' }
export const JOURNAL_UNREAD_TITLE: Record<Lang, string> = { ko: '읽지 않은 장이 있다', en: 'Unread page' }
export const SETTINGS_ARIA_LABEL: Record<Lang, string> = { ko: '설정', en: 'Settings' }
export const CLEARED_STATUS_LABEL: Record<Lang, string> = { ko: '클리어', en: 'Cleared' }
export const PROMOTION_TRIAL_STATUS_LABEL: Record<Lang, string> = { ko: '승급 심사', en: 'Promotion trial' }
export const IN_PROGRESS_STATUS_LABEL: Record<Lang, string> = { ko: '도전 중', en: 'In progress' }
export const TRAINING_PATH_HEADING: Record<Lang, string> = { ko: '수련 경로', en: 'Training path' }
export const WHITE_BELT_GATE1_LABEL: Record<Lang, string> = { ko: '흰띠 1관문', en: 'White belt · Gate 1' }
export const MASTER_MODE_JOURNAL_COUNT_LABEL = (journalEntryCount: number, lang: Lang): string =>
  lang === 'ko' ? `2권 — 나의 기록 ${journalEntryCount}편` : `Book 2 — my record: ${journalEntryCount} entries`
export const BOSS_TITLE_BEFORE_MASTER: Record<Lang, string> = {
  ko: '승급 심사 — 관장 취임전',
  en: 'Promotion trial — before becoming master'
}
export const BOSS_TITLE_WITH_NEXT_BELT = (nextBeltName: string, lang: Lang): string =>
  lang === 'ko' ? `승급 심사 — ${nextBeltName} 보스전` : `Promotion trial — ${nextBeltName}`
export const CONSECUTIVE_STREAK_ARIA_LABEL = (streak: number, days: number, lang: Lang): string =>
  lang === 'ko' ? `${days}일 중 ${streak}일 연속` : `${streak} of ${days} days in a row`

// 관문 조건 문구 (GateCard/BossGateCard/Onboarding 공용)
export const cumulativeConditionText = (required: number, windowDays: number, lang: Lang): string =>
  lang === 'ko'
    ? `${windowDays}일 안에 ${required}번이면 도장 획득`
    : `${required} times within ${windowDays} days earns the mark`
export const consecutiveConditionText = (days: number, lang: Lang): string =>
  lang === 'ko' ? `${days}일 연속이면 도장 획득` : `${days} days in a row earns the mark`

// 앱 버전 표시 (설정 화면 하단) — 앱 이름 자체는 로고라 번역하지 않지만, 영어 UI에서는 로마자 표기를 쓴다.
export const appInfoLabel = (version: string, lang: Lang): string =>
  lang === 'ko' ? `하루도장 v${version}` : `Haru Dojang v${version}`
