import { useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { useEventSystem } from './hooks/useEventSystem'
import { TitleScreen } from './components/TitleScreen'
import { IntroSequence } from './components/IntroSequence'
import { GameView } from './components/GameView'

// Game phases
const PHASES = {
  TITLE: 'title',
  INTRO: 'intro',
  PLAYING: 'playing',
}

function App() {
  const [phase, setPhase] = useState(PHASES.TITLE)
  const [hasSave, setHasSave] = useState(false)
  
  const { state: gameState, actions } = useGameState()
  
  // Initialize event system
  useEventSystem(gameState, actions.triggerEvent)
  
  // Check for existing save on mount
  useEffect(() => {
    const savedData = localStorage.getItem('quietDominion_save')
    setHasSave(!!savedData)
  }, [])
  
  // Handle new game
  const handleNewGame = () => {
    // Clear any existing save for new game
    localStorage.removeItem('quietDominion_save')
    actions.startGame()
    setPhase(PHASES.INTRO)
  }
  
  // Handle continue
  const handleContinue = () => {
    const loaded = actions.loadGame()
    if (loaded) {
      setPhase(PHASES.PLAYING)
    } else {
      // If load fails, start new game
      handleNewGame()
    }
  }
  
  // Handle intro completion
  const handleIntroComplete = () => {
    actions.completeIntro()
    setPhase(PHASES.PLAYING)
    
    // Add welcome notification
    actions.addNotification({
      type: 'info',
      message: 'The fire stirs. Your dominion begins.',
      duration: 4000,
    })
  }
  
  // Render based on phase
  const renderPhase = () => {
    switch (phase) {
      case PHASES.TITLE:
        return (
          <TitleScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            hasSave={hasSave}
          />
        )
      
      case PHASES.INTRO:
        return (
          <IntroSequence onComplete={handleIntroComplete} />
        )
      
      case PHASES.PLAYING:
        return (
          <GameView
            gameState={gameState}
            actions={actions}
          />
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-ink">
      {renderPhase()}
    </div>
  )
}

export default App
