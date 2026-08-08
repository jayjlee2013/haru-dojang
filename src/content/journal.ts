import type { Belt, LocalizedText } from '../domain/types'

interface JournalEntry {
  id: string
  belt: Belt
  title: LocalizedText
  text: LocalizedText
}

export const journalEntries: JournalEntry[] = [
  {
    id: 'PROLOGUE',
    belt: 'white',
    title: { ko: '프롤로그', en: 'Prologue' },
    text: {
      ko: '낡은 열쇠와 함께 도착한 소포에는 짧은 쪽지가 들어 있었다.\n"생활도장 — 이제 네 것이다."\n먼지 쌓인 도장 한가운데, 방석 위에 일지 한 권이 놓여 있다. 표지에는 이렇게 적혀 있다.\n「관장 수련 일지 — 함부로 읽지 말 것. 단, 수련한 자는 예외.」',
      en: 'A parcel arrived with an old key and a short note. "The dojang — it\'s yours now." In the middle of the dusty hall, a journal sits on a cushion. On the cover:\n「Master\'s training journal — do not read without permission. Unless you\'ve trained.」'
    }
  },
  {
    id: 'W1',
    belt: 'white',
    title: { ko: '물 한 컵 마시기 클리어', en: 'Cleared: drink a cup of water' },
    text: {
      ko: '수련 1일. 첫 제자가 왔다. 검술을 배우고 싶다고 했다.\n나는 물 한 컵을 내밀었다. "이것을 마시는 것부터."\n그는 웃었다. 사흘 뒤, 그는 웃지 않았다.',
      en: 'Day 1. My first student arrived. Said he wanted to learn swordsmanship.\nI handed him a cup of water. "Start with this."\nHe laughed. Three days later, he wasn\'t laughing.'
    }
  },
  {
    id: 'W2',
    belt: 'white',
    title: { ko: '환기 클리어', en: 'Cleared: air out the room' },
    text: {
      ko: '수련 9일. 오늘의 가르침: 문과 창은 열라고 있는 것이다.\n새 공기가 들어오지 않는 방에서는 새 생각도 태어나지 않는다.\n제자가 물었다. "그게 무술입니까?" 나는 대답 대신 창문을 열었다.',
      en: 'Day 9. Today\'s lesson: doors and windows exist to be opened.\nNo new air, no new thoughts.\nMy student asked, "Is that martial arts?" Instead of answering, I opened the window.'
    }
  },
  {
    id: 'W3',
    belt: 'white',
    title: { ko: '이불 정리 클리어', en: 'Cleared: make the bed' },
    text: {
      ko: '수련 17일. 이불을 정리하는 자는 하루의 첫 승부에서 이긴 것이다.\n상대는 어제의 나. 가장 만만해 보이지만, 사실 가장 끈질긴 적이다.',
      en: 'Day 17. Whoever makes their bed has already won the day\'s first match.\nThe opponent: yesterday\'s self. Looks like the easiest one. Is actually the most stubborn.'
    }
  },
  {
    id: 'W4',
    belt: 'white',
    title: { ko: '스트레칭 클리어', en: 'Cleared: stretch' },
    text: {
      ko: '수련 23일. 몸을 펴는 데 2분.\n그 2분을 아까워한 세월이 20년.\n제자에게는 말하지 않았다. 부끄러우니까.',
      en: 'Day 23. Two minutes to stretch.\nTwenty years spent begrudging those two minutes.\nDidn\'t tell my student that. Too embarrassing.'
    }
  },
  {
    id: 'W-BOSS',
    belt: 'white',
    title: { ko: '승급 심사 클리어 (노란띠 수여)', en: 'Cleared: promotion trial (yellow belt earned)' },
    text: {
      ko: '승급 심사일. 제자가 사흘을 연달아 해냈다. 나는 노란 띠를 건넸다.\n"이제 시작이다."\n제자가 물었다. "지금까지는 뭐였습니까?"\n"문을 연 것이지."',
      en: 'Promotion day. My student pulled off three days straight. I handed over the yellow belt.\n"Now it begins."\nHe asked, "What was all that, then?"\n"Opening the door."'
    }
  },
  {
    id: 'Y1',
    belt: 'yellow',
    title: { ko: '산책 클리어', en: 'Cleared: walk' },
    text: {
      ko: '수련 38일. 10분을 걷고 돌아온 제자의 얼굴이 밝았다.\n걷기는 가장 오래된 수련법이다. 발이 움직이면 마음이 따라온다.\n반대는 잘 되지 않는다.',
      en: 'Day 38. My student came back from a 10-minute walk, face bright.\nWalking is the oldest form of training there is. Move the feet, the mind follows.\nThe reverse rarely works.'
    }
  },
  {
    id: 'Y2',
    belt: 'yellow',
    title: { ko: '책상 정리 클리어', en: 'Cleared: tidy the desk' },
    text: {
      ko: '수련 44일. 책상을 정리하다 오래된 사진 한 장을 발견했다.\n이 도장의 개관식 사진이다. 그런데 이상하다.\n사진 속 현판의 글씨가... 내 필체가 아니다.',
      en: 'Day 44. Cleaning my desk, I found an old photo.\nThe dojang\'s opening day. Strange, though —\nthe sign in the photo... that\'s not my handwriting.'
    }
  },
  {
    id: 'Y3',
    belt: 'yellow',
    title: { ko: '폰 전에 물 클리어', en: 'Cleared: water before phone' },
    text: {
      ko: '수련 47일. 아침에 눈을 뜨면 세상 소식보다 먼저 챙길 것이 있다. 나 자신이다.\n물 한 컵. 그 다음이 세상이다. 순서가 전부다.',
      en: 'Day 47. Wake up, and before the world\'s news, there\'s something to tend to first. Yourself.\nA cup of water. The world comes after. Order is everything.'
    }
  },
  {
    id: 'Y4',
    belt: 'yellow',
    title: { ko: '자유 관문 클리어 (해금 이벤트 직후)', en: 'Cleared: free gate (just after unlock)' },
    text: {
      ko: '수련 50일. 오늘부터 제자에게 관문 하나를 스스로 정하게 했다.\n"스스로 정한 약속만이 진짜 수련이 된다."\n이 말은 내가 만든 것이 아니다. 이 일지의 앞 주인이 남긴 말이다.\n...그렇다. 이 일지는 내가 처음부터 쓴 것이 아니다.',
      en: 'Day 50. Starting today, I let my student choose one gate for himself.\n"Only a promise you make to yourself becomes real training."\nI didn\'t write that line. Whoever kept this journal before me did.\n...Yes. This journal wasn\'t mine from the start.'
    }
  },
  {
    id: 'Y5',
    belt: 'yellow',
    title: { ko: '한 줄 일기 클리어', en: 'Cleared: one-line journal' },
    text: {
      ko: '수련 57일. 일지의 앞부분을 다시 읽었다.\n나보다 앞서 이 도장을 지킨 사람들의 기록.\n관장은 이름이 아니라, 차례였다.',
      en: 'Day 57. Reread the earlier pages.\nRecords of everyone who kept this dojang before me.\n"Master" was never a name. It was a turn.'
    }
  },
  {
    id: 'Y-BOSS',
    belt: 'yellow',
    title: { ko: '승급 심사 클리어 (초록띠 수여)', en: 'Cleared: promotion trial (green belt earned)' },
    text: {
      ko: '승급 심사일. 초록 띠를 매어주며 생각했다.\n나도 언젠가 누군가에게 이 일지를 넘기게 될까.\n그날이 오면, 나는 무엇을 적어 남길까.',
      en: 'Promotion day. Tying the green belt on, I wondered —\nwill I hand this journal to someone myself, someday?\nWhen that day comes, what will I leave behind?'
    }
  },
  {
    id: 'G1',
    belt: 'green',
    title: { ko: '15분 걷기 클리어', en: 'Cleared: 15-minute walk' },
    text: {
      ko: '이 장은 오래 망설이다 쓴다.\n나는 무술가가 아니었다. 이 도장에 처음 왔을 때,\n나는 석 달째 집 밖에 나가지 못하던 사람이었다.',
      en: 'I hesitated a long time before writing this page.\nI was never a martial artist. When I first came to this dojang,\nI was someone who hadn\'t left the house in three months.'
    }
  },
  {
    id: 'G2',
    belt: 'green',
    title: { ko: '화면 끄기 클리어', en: 'Cleared: screen off' },
    text: {
      ko: '그때의 관장님은 내게 아무것도 묻지 않았다.\n물 한 컵을 내밀었을 뿐이다. "이것을 마시는 것부터."\n지금 내 제자들이 웃는 것처럼, 나도 그때 웃었다.',
      en: 'The master back then asked me nothing. Just handed me a cup of water. "Start with this."\nThe way my students laugh now — that\'s how I laughed then.'
    }
  },
  {
    id: 'G3',
    belt: 'green',
    title: { ko: '자유 관문 A 클리어', en: 'Cleared: free gate A' },
    text: {
      ko: '물 한 컵이 이불이 되고, 이불이 산책이 되고, 산책이 계절이 되었다.\n어느 날 정신을 차려보니 나는 살아 있는 게 아니라, 살고 있었다.',
      en: 'A cup of water became a made bed. A made bed became a walk. A walk became a season.\nOne day I looked up and realized — I wasn\'t just alive. I was living.'
    }
  },
  {
    id: 'G4',
    belt: 'green',
    title: { ko: '내일 하나 적기 클리어', en: 'Cleared: write tomorrow\'s one thing' },
    text: {
      ko: '관장님이 떠나던 날 물었다. "어디로 가십니까."\n"수련이 끝난 곳에는 관장이 필요 없다. 필요한 곳으로 간다."\n그리고 내게 이 일지를 맡겼다.',
      en: 'The day the master left, I asked, "Where are you going?"\n"A place whose training is finished needs no master. I go where I\'m needed."\nThen he left me this journal.'
    }
  },
  {
    id: 'G5',
    belt: 'green',
    title: { ko: '자유 관문 B 클리어', en: 'Cleared: free gate B' },
    text: {
      ko: '이제 알겠는가. 이 도장에는 비밀이 없다.\n굳이 말하자면 단 하나 — 아주 작은 일을, 조금씩, 계속하는 것.\n그것이 이 도장의 유일한 비밀이다.',
      en: 'Understand now? This dojang holds no secret.\nIf there\'s one, it\'s this — a very small thing, done a little at a time, kept going.\nThat\'s the only secret this place has.'
    }
  },
  {
    id: 'G-BOSS',
    belt: 'green',
    title: { ko: '승급 심사 클리어 (검은띠 수여)', en: 'Cleared: promotion trial (black belt earned)' },
    text: {
      ko: '승급 심사일. 검은 띠는 완성의 표시가 아니다.\n"이제 혼자서도 수련할 수 있다"는 표시다.\n그래서 검은 띠가 가장 외롭고, 가장 자유롭다.',
      en: 'Promotion day. The black belt isn\'t a mark of completion.\nIt means "you can train alone now."\nWhich is why the black belt is the loneliest belt — and the freest.'
    }
  },
  {
    id: 'B1',
    belt: 'black',
    title: { ko: '30분 운동 클리어', en: 'Cleared: 30-minute workout' },
    text: {
      ko: '여기서부터는 미래의 관장에게 쓴다.\n그래. 지금 이 글을 읽는, 너에게.',
      en: 'From here on, I\'m writing to a future master.\nYes. You. Reading this right now.'
    }
  },
  {
    id: 'B2',
    belt: 'black',
    title: { ko: '자유 관문 A 클리어', en: 'Cleared: free gate A' },
    text: {
      ko: '네가 여기까지 읽었다는 건 두 가지를 뜻한다.\n하나, 너는 검은 띠다.\n둘, 나는 이미 떠났다.',
      en: 'You reading this far means two things.\nOne, you\'re black belt.\nTwo, I\'m already gone.'
    }
  },
  {
    id: 'B3',
    belt: 'black',
    title: { ko: '화면 없는 저녁 클리어', en: 'Cleared: screen-free evening' },
    text: {
      ko: '혹시 눈치챘는가. 흰띠 시절의 네 기록과 이 일지의 첫 장이 닮아 있다는 것을.\n물 한 컵 앞에서 웃던 제자 — 그 이야기는 언제나 사실이었다.\n모든 관장의 첫 장이었으니까.',
      en: 'Did you notice? Your white-belt record and this journal\'s first page — they match.\nThe student who laughed at a cup of water — that story was always true.\nIt was every master\'s first page.'
    }
  },
  {
    id: 'B4',
    belt: 'black',
    title: { ko: '자유 관문 B 클리어', en: 'Cleared: free gate B' },
    text: {
      ko: '이 도장은 건물이 아니다.\n일지를 읽고, 수련하고, 다음 장을 쓰는 사람.\n그 사람이 있는 곳이 도장이다.',
      en: 'This dojang isn\'t a building.\nSomeone reading the journal, training, writing the next page —\nwherever that person is, that\'s the dojang.'
    }
  },
  {
    id: 'B5',
    belt: 'black',
    title: { ko: '다섯 줄 일기 클리어', en: 'Cleared: five-line journal' },
    text: {
      ko: '떠난 이유를 이제 말할 수 있다. 사실은, 떠나는 것이 아니다.\n이 일지 속에서 나는 네가 도장을 찍을 때마다 함께 있었다.',
      en: 'I can finally tell you why I left. Truth is, I never did.\nIn this journal, I was there every time you made your mark.'
    }
  },
  {
    id: 'B6',
    belt: 'black',
    title: { ko: '자유 관문 C 클리어', en: 'Cleared: free gate C' },
    text: {
      ko: '마지막 관문을 앞둔 너에게.\n두려워할 것 없다.\n너는 이미, 물 한 컵에서 여기까지 온 사람이다.',
      en: 'To you, facing the last gate.\nNothing to fear.\nYou\'re already someone who made it from a single cup of water to here.'
    }
  },
  {
    id: 'B-FINAL-BOSS',
    belt: 'black',
    title: { ko: '클리어 (관장 취임, 무한 수련 모드 해금)', en: 'Cleared (becoming master, infinite training unlocked)' },
    text: {
      ko: '「관장 취임을 축하한다.\n다음 장은 백지다.\n이제 네 차례다.」\n\n— 일지는 여기서 끝난다. 이후의 기록은, 당신이 쓴다.',
      en: '「Congratulations on becoming master.\nThe next page is blank.\nIt\'s your turn now.」\n\n— The journal ends here. What comes after, you write.'
    }
  }
]
