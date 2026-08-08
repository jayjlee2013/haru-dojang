# 07. 영어 번역 원문 (오케스트레이터 작성, 임의 수정 금지)

이 문서의 영어 텍스트를 `journal.ts`/`courses.ts`/`beltLabels.ts`에 **그대로** 옮긴다.
관장의 목소리·후반부(B시리즈) 수신인 전환("너")·"도장" 이중 의미는 이미 영어로
자연스럽게 재구성해뒀다 — 직역하지 말고 이 문서의 표현을 그대로 쓸 것.

## 일지 (journal.ts) — id: title / text

- PROLOGUE: `Prologue` /
  `A parcel arrived with an old key and a short note. "The dojang — it's yours now." In the middle of the dusty hall, a journal sits on a cushion. On the cover:\n「Master's training journal — do not read without permission. Unless you've trained.」`
- W1: `Cleared: drink a cup of water` /
  `Day 1. My first student arrived. Said he wanted to learn swordsmanship.\nI handed him a cup of water. "Start with this."\nHe laughed. Three days later, he wasn't laughing.`
- W2: `Cleared: air out the room` /
  `Day 9. Today's lesson: doors and windows exist to be opened.\nNo new air, no new thoughts.\nMy student asked, "Is that martial arts?" Instead of answering, I opened the window.`
- W3: `Cleared: make the bed` /
  `Day 17. Whoever makes their bed has already won the day's first match.\nThe opponent: yesterday's self. Looks like the easiest one. Is actually the most stubborn.`
- W4: `Cleared: stretch` /
  `Day 23. Two minutes to stretch.\nTwenty years spent begrudging those two minutes.\nDidn't tell my student that. Too embarrassing.`
- W-BOSS: `Cleared: promotion trial (yellow belt earned)` /
  `Promotion day. My student pulled off three days straight. I handed over the yellow belt.\n"Now it begins."\nHe asked, "What was all that, then?"\n"Opening the door."`
- Y1: `Cleared: walk` /
  `Day 38. My student came back from a 10-minute walk, face bright.\nWalking is the oldest form of training there is. Move the feet, the mind follows.\nThe reverse rarely works.`
- Y2: `Cleared: tidy the desk` /
  `Day 44. Cleaning my desk, I found an old photo.\nThe dojang's opening day. Strange, though —\nthe sign in the photo... that's not my handwriting.`
- Y3: `Cleared: water before phone` /
  `Day 47. Wake up, and before the world's news, there's something to tend to first. Yourself.\nA cup of water. The world comes after. Order is everything.`
- Y4: `Cleared: free gate (just after unlock)` /
  `Day 50. Starting today, I let my student choose one gate for himself.\n"Only a promise you make to yourself becomes real training."\nI didn't write that line. Whoever kept this journal before me did.\n...Yes. This journal wasn't mine from the start.`
- Y5: `Cleared: one-line journal` /
  `Day 57. Reread the earlier pages.\nRecords of everyone who kept this dojang before me.\n"Master" was never a name. It was a turn.`
- Y-BOSS: `Cleared: promotion trial (green belt earned)` /
  `Promotion day. Tying the green belt on, I wondered —\nwill I hand this journal to someone myself, someday?\nWhen that day comes, what will I leave behind?`
- G1: `Cleared: 15-minute walk` /
  `I hesitated a long time before writing this page.\nI was never a martial artist. When I first came to this dojang,\nI was someone who hadn't left the house in three months.`
- G2: `Cleared: screen off` /
  `The master back then asked me nothing. Just handed me a cup of water. "Start with this."\nThe way my students laugh now — that's how I laughed then.`
- G3: `Cleared: free gate A` /
  `A cup of water became a made bed. A made bed became a walk. A walk became a season.\nOne day I looked up and realized — I wasn't just alive. I was living.`
- G4: `Cleared: write tomorrow's one thing` /
  `The day the master left, I asked, "Where are you going?"\n"A place whose training is finished needs no master. I go where I'm needed."\nThen he left me this journal.`
- G5: `Cleared: free gate B` /
  `Understand now? This dojang holds no secret.\nIf there's one, it's this — a very small thing, done a little at a time, kept going.\nThat's the only secret this place has.`
- G-BOSS: `Cleared: promotion trial (black belt earned)` /
  `Promotion day. The black belt isn't a mark of completion.\nIt means "you can train alone now."\nWhich is why the black belt is the loneliest belt — and the freest.`
- B1: `Cleared: 30-minute workout` /
  `From here on, I'm writing to a future master.\nYes. You. Reading this right now.`
- B2: `Cleared: free gate A` /
  `You reading this far means two things.\nOne, you're black belt.\nTwo, I'm already gone.`
- B3: `Cleared: screen-free evening` /
  `Did you notice? Your white-belt record and this journal's first page — they match.\nThe student who laughed at a cup of water — that story was always true.\nIt was every master's first page.`
- B4: `Cleared: free gate B` /
  `This dojang isn't a building.\nSomeone reading the journal, training, writing the next page —\nwherever that person is, that's the dojang.`
- B5: `Cleared: five-line journal` /
  `I can finally tell you why I left. Truth is, I never did.\nIn this journal, I was there every time you made your mark.`
- B6: `Cleared: free gate C` /
  `To you, facing the last gate.\nNothing to fear.\nYou're already someone who made it from a single cup of water to here.`
- B-FINAL-BOSS: `Cleared (becoming master, infinite training unlocked)` /
  `「Congratulations on becoming master.\nThe next page is blank.\nIt's your turn now.」\n\n— The journal ends here. What comes after, you write.`

## 관문 이름 (courses.ts의 name 필드 — free 타입은 없음)

- W1: `Drink a cup of water`
- W2: `Open a window, air out for 1 min`
- W3: `Make the bed before leaving it`
- W4: `Stretch 2 min before bed`
- W-BOSS: `Morning trio (water + air + bed)`
- Y1: `10-min walk around the block`
- Y2: `3-min desk tidy`
- Y3: `Water before checking your phone`
- Y5: `One line a day`
- Y-BOSS: `Walk + tidy + one line`
- G1: `15-min walk (past the block)`
- G2: `Screen off at meals`
- G4: `Write tomorrow's one task before bed`
- G-BOSS: `Walk + screen off + tomorrow's one`
- B1: `30-min walk or workout`
- B3: `One "screen-free evening" a week`
- B5: `Five lines (one line → five)`
- B-FINAL-BOSS: `My daily ritual (your own set of 3)`

## 띠 이름 (beltLabels.ts)

- white: `White belt`
- yellow: `Yellow belt`
- green: `Green belt`
- black: `Black belt`
- master: `Head master`

## 자유 관문 기본 이름 (여러 곳에서 `나만의 관문` 대체용)

`My own gate`

## microcopy.ts 전체 (ko → en, 상수명 그대로 대응)

- STAMP_REACTIONS: `Good.` / `Did today's share.` / `It adds up.` / `That's enough.` / `One more than yesterday's you.` / `Training makes no sound. It just accumulates, like this.` / `The mark doesn't lie.` / `Don't laugh at small. Mountains start with one stone.` / `Done. Go live your day.` / `Like water flowing. Again tomorrow.`
- MASTER_RETURN_LINES: `You're back. Training is something you stitch together.` / `One day off doesn't break it. Look — here you are.` / `Yesterday was yesterday. Today is today.` / `The step back is the heaviest one. You took it.`
- MASTER_STREAK_LINES: `Your steps have gotten lighter lately.` / `Day after day. This is what makes training.` / `There's no beating someone who doesn't stop.` / `The body's starting to remember the rhythm.`
- ALREADY_STAMPED_BUTTON: `Today's training done`
- ALREADY_STAMPED_SUBTEXT: `A new day opens at 4am tomorrow`
- DEADLINE_WARNING: `No days left to spare from here.`
- RETRAIN_MESSAGES: `It's fine. Again.` / `Falling is part of the training too.` / `A gate can fail. Training never ends.` / `This gate was just slippery. Take hold again.` / `Coming back is already half of it.` / `The record's gone. The body remembers.`
- RETRAIN_BUTTON: `Start over`
- RETRAIN_ATTEMPT_SUBTEXT(attempt): `` `Attempt ${attempt}. The master doesn't count them.` ``
- GATE_CLEARED_LABEL(gateName): `` `Gate cleared: ${gateName}` ``
- JOURNAL_OPEN_BUTTON: `A page of the journal opened`
- ONBOARDING_NEXT_BUTTON: `Next`
- ONBOARDING_OPEN_JOURNAL_BUTTON: `Open the journal`
- ONBOARDING_START_BUTTON: `Begin training`
- DAY_BOUNDARY_NOTICE: `Anything before 4am still counts as today`
- BOSS_ENTRY_NOTICE: `Promotion trial. Three days. Fold up the excuses.`
- BOSS_FINAL_ENTRY_NOTICE: `The last trial. Five days. Fought with what you chose.`
- BOSS_DAY_SUCCESS_MESSAGES: `One day. Don't waver.` / `Two days. The turning point.`
- BOSS_STREAK_BROKEN: `The trial opens again. Anytime.`
- BOSS_RETRY_START: `Catch your breath. Three days again.`
- PROMOTION_MESSAGES: yellow `Tying on the yellow belt. Now it begins.` / green `Tying on the green belt. The body's started to remember.` / black `Tying on the black belt. You can go on alone now.` (master는 원본처럼 없음)
- JOURNAL_COUNTER(unlocked,total): `` `Journal ${unlocked}/${total}` ``
- JOURNAL_LOCKED_MARK: `▨▨▨` (그대로)
- JOURNAL_LOCKED_HINT: `Opens when you clear the next gate`
- GATE_EDITOR_TITLE: `My own gate`
- GATE_EDITOR_GUIDE: `The smaller the goal, the better the gate. — Master`
- GATE_EDITOR_LABEL_NAME: `What`
- GATE_EDITOR_LABEL_REQUIRED: `How many times`
- GATE_EDITOR_LABEL_WINDOW: `Within how many days`
- GATE_EDITOR_ERROR_NAME_REQUIRED: `The gate needs a name`
- GATE_EDITOR_ERROR_WINDOW_TOO_SHORT: `The window's shorter than the count. Once a day is the max.`
- GATE_EDITOR_PRESETS: `Read for 10 minutes` / `Do the dishes right away` / `Evening walk` / `Drink morning coffee sitting down` / `Look at the sky once a day` / `Take your vitamins` / `Sit with eyes closed for 5 minutes` / `Make one call you've been putting off` / `Eat lunch away from your desk` / `Tidy up 5 minutes before bed` / `Six cups of water` / `Take the stairs`
- MASTER_MODE_EMPTY_MESSAGE: `The dojang is empty. The master decides the next gate — that's you.`
- MASTER_MODE_EMPTY_BUTTON: `Make a gate`
- MASTER_MODE_JOURNAL_PROMPT: `Leave today's page? Short is fine.`
- MASTER_MODE_JOURNAL_PLACEHOLDER(day): `` `Day ${day}. ` ``
- MASTER_MODE_JOURNAL_SAVED: `The journal grows thicker.`
- SETTINGS_DAY_BOUNDARY_LABEL: `Start of day`
- SETTINGS_DAY_BOUNDARY_SUBTEXT: `Before this time still counts as the previous day`
- SETTINGS_EXPORT_LABEL: `Export data (JSON)`
- SETTINGS_IMPORT_LABEL: `Import data`
- SETTINGS_IMPORT_FAILURE: `Couldn't read the file. Make sure it was exported from Haru Dojang`
- SETTINGS_IMPORT_CONFIRM_MESSAGE: `This will replace your data with this file. Continue?`
- SETTINGS_IMPORT_CONFIRM_BUTTON: `Replace`
- SETTINGS_IMPORT_CANCEL_BUTTON: `Cancel`
- SETTINGS_RESET_STEP1_TITLE: `Close the dojang?`
- SETTINGS_RESET_STEP1_SUBTEXT: `All stamps and journal entries will be gone`
- SETTINGS_RESET_STEP2_TITLE: `Really close it? This can't be undone`
- SETTINGS_RESET_CONFIRM_BUTTON: `Close it`
- SETTINGS_RESET_CANCEL_BUTTON: `Stay`
- SETTINGS_CLOCK_ROLLBACK_WARNING: `Your device's date is earlier than your last training. Please check the date`

## 컴포넌트/화면에 직접 박혀 있던 문구 (ko → en)

- `승급 심사 — 관장 취임전` → `Promotion trial — before becoming master`
- `` `승급 심사 — ${nextBeltName} 보스전` `` → `` `Promotion trial — ${nextBeltName}` ``
- `지금 도전 중인 관문 · {gateOrder}번째` → `Current gate · #{gateOrder}`
- `{rule.days}일 연속이면 도장 획득` → `{rule.days} days in a row earns the mark`
- aria-label `` `${rule.days}일 중 ${streak}일 연속` `` → `` `${streak} of ${rule.days} days in a row` ``
- `` `${windowDays}일 안에 ${required}번이면 도장 획득` `` → `` `${required} times within ${windowDays} days earns the mark` ``
- `오늘 포함 {remainingDays}일 남음` → `{remainingDays} days left, including today`
- `다음` (버튼, 여러 곳) → `Next`
- aria-label `` `${total}번 중 ${filled}번 완료` `` → `` `${filled} of ${total} done` ``
- `오늘 도장 찍기` → `Stamp today`
- `` `관장 수련 ${masterModeDays}일째` `` → `` `Day ${masterModeDays} as master` ``
- `도장 {totalStamps}개` → `{totalStamps} stamps`
- TopBar aria-label `일지` → `Journal`, title `읽지 않은 장이 있다` → `Unread page`, title `일지` → `Journal`
- TopBar aria-label `설정` / title `설정` → `Settings`
- `클리어` (TrainingPath 상태) → `Cleared`
- `승급 심사` (TrainingPath 상태) → `Promotion trial`
- `도전 중` → `In progress`
- `수련 경로` (heading) → `Training path`
- `···` → `···` (그대로)
- `자유 관문이 열렸다` (FREE_SLOT_UNLOCK_NOTICE) → `A free gate has opened`
- `관문 정보를 찾을 수 없다.` → `Gate not found.`
- `도장으로` (Journal.tsx, Settings.tsx 뒤로가기) → `Back to dojang`
- `` `2권 — 나의 기록 ${journalEntryCount}편` `` → `` `Book 2 — my record: ${journalEntryCount} entries` ``
- `흰띠 1관문` (Onboarding) → `White belt · Gate 1`
- `` `하루도장 v${APP_VERSION}` `` → `` `Haru Dojang v${APP_VERSION}` `` (앱 이름은 로고이므로 안 바꿈)

## 설정 화면 언어 토글용 새 문구 (없던 것, 새로 추가)

- 라벨: `Language` / `언어`
- 옵션: `한국어` / `English`
