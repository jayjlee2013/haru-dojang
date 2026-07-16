import { useGameStore } from './store/useGameStore'
import { Onboarding } from './screens/Onboarding'
import { Dojang } from './screens/Dojang'
import { Journal } from './screens/Journal'
import { Settings } from './screens/Settings'
import './styles.css'

export default function App(): JSX.Element {
  const onboardingCompleted = useGameStore((s) => s.onboardingCompleted)
  const completeOnboarding = useGameStore((s) => s.completeOnboarding)
  const currentScreen = useGameStore((s) => s.currentScreen)
  const journalUnlocked = useGameStore((s) => s.save.journalUnlocked)
  const closeJournal = useGameStore((s) => s.closeJournal)
  const closeSettings = useGameStore((s) => s.closeSettings)

  if (!onboardingCompleted) {
    return <Onboarding onComplete={completeOnboarding} />
  }

  if (currentScreen === 'journal') {
    return <Journal journalUnlocked={journalUnlocked} onBack={closeJournal} />
  }

  if (currentScreen === 'settings') {
    return <Settings onBack={closeSettings} />
  }

  return <Dojang />
}
