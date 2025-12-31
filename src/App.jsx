import { useState, useEffect, useCallback } from 'react'
import { useGameState } from './hooks/useGameState'
import { useEventSystem } from './hooks/useEventSystem'
import { useAudio } from './hooks/useAudio'
import { TitleScreen } from './components/TitleScreen'
import { IntroSequence } from './components/IntroSequence'
import { GameView } from './components/GameView'
import { EndingCinematic } from './components/EndingCinematic'

// Game phases
const PHASES = {
  TITLE: 'title',
  INTRO: 'intro',
  PLAYING: 'playing',
  ENDING: 'ending',
}

function App() {
  const [phase, setPhase] = useState(PHASES.TITLE)
  const [hasSave, setHasSave] = useState(false)
  const [endingData, setEndingData] = useState(null)
  
  const { state: gameState, actions } = useGameState()
  const audio = useAudio()
  
  // Initialize event system
  useEventSystem(gameState, actions.triggerEvent)
  
  // Check for existing save on mount
  useEffect(() => {
    const savedData = localStorage.getItem('quietDominion_save')
    setHasSave(!!savedData)
  }, [])
  
  // Initialize audio on first interaction
  const handleFirstInteraction = useCallback(() => {
    audio.initAudio()
  }, [audio])
  
  // Handle new game
  const handleNewGame = () => {
    audio.playSound('click')
    // Clear any existing save for new game
    localStorage.removeItem('quietDominion_save')
    actions.startGame()
    setPhase(PHASES.INTRO)
  }
  
  // Handle continue
  const handleContinue = () => {
    audio.playSound('click')
    const loaded = actions.loadGame()
    if (loaded) {
      setPhase(PHASES.PLAYING)
      // Start ambient after a short delay
      setTimeout(() => {
        audio.startAmbient()
      }, 1000)
    } else {
      // If load fails, start new game
      handleNewGame()
    }
  }
  
  // Handle intro completion
  const handleIntroComplete = () => {
    audio.playSound('fire')
    actions.completeIntro()
    setPhase(PHASES.PLAYING)
    
    // Start ambient sounds
    audio.startAmbient()
    
    // Add welcome notification
    actions.addNotification({
      type: 'info',
      message: 'The fire stirs. Your dominion begins.',
      duration: 4000,
    })
  }
  
  // Handle prestige with ending cinematic
  const handlePrestige = (data) => {
    audio.playSound('prestige')
    audio.stopAmbient()
    
    setEndingData(data)
    setPhase(PHASES.ENDING)
  }
  
  // Handle ending cinematic completion
  const handleEndingComplete = () => {
    if (endingData) {
      actions.prestige(endingData)
    }
    setEndingData(null)
    setPhase(PHASES.INTRO)
    
    // Add notification about legacy
    setTimeout(() => {
      actions.addNotification({
        type: 'success',
        message: `Legacy carries forward. ${endingData?.legacyPoints || 0} ✦ earned.`,
        duration: 5000,
      })
    }, 2000)
  }
  
  // Handle full reset
  const handleResetGame = () => {
    localStorage.removeItem('quietDominion_save')
    window.location.reload()
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
            audio={audio}
            onPrestige={handlePrestige}
            onResetGame={handleResetGame}
          />
        )
      
      case PHASES.ENDING:
        return (
          <EndingCinematic
            endingId={endingData?.ending}
            legacyPoints={endingData?.legacyPoints || 0}
            onComplete={handleEndingComplete}
          />
        )
      
      default:
        return null
    }
  }
  
  return (
    <div 
      className="min-h-screen bg-ink"
      onClick={handleFirstInteraction}
    >
      {renderPhase()}
    </div>
  )
}

export default App
