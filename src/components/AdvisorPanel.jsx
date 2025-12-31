import { useState, useEffect } from 'react'
import { ADVISORS, getRelationshipLevel } from '../data/gameData'

function AdvisorCard({ advisorId, relationship, isSelected, onSelect, hasNewDialogue }) {
  const advisor = ADVISORS[advisorId]
  if (!advisor) return null
  
  const relationshipInfo = getRelationshipLevel(relationship)
  
  return (
    <button
      onClick={() => onSelect(advisorId)}
      className={`
        relative flex items-center gap-3 p-3 rounded-lg
        border transition-all duration-300
        ${isSelected 
          ? 'bg-sepia/20 border-gold/50' 
          : 'bg-ink/50 border-sepia/20 hover:border-sepia/40'
        }
      `}
    >
      {/* Portrait */}
      <span className="text-2xl">{advisor.portrait}</span>
      
      {/* Info */}
      <div className="text-left flex-1 min-w-0">
        <h3 className="font-display text-sm text-parchment truncate">
          {advisor.name}
        </h3>
        <p className="font-body text-xs text-sepia/60 truncate">
          {advisor.title}
        </p>
      </div>
      
      {/* Relationship indicator */}
      <div className={`
        w-2 h-2 rounded-full
        ${relationshipInfo.level === 'devoted' ? 'bg-gold' : ''}
        ${relationshipInfo.level === 'friendly' ? 'bg-moss' : ''}
        ${relationshipInfo.level === 'neutral' ? 'bg-sepia' : ''}
        ${relationshipInfo.level === 'wary' ? 'bg-rust/70' : ''}
        ${relationshipInfo.level === 'hostile' ? 'bg-ember' : ''}
      `} />
      
      {/* New dialogue indicator */}
      {hasNewDialogue && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
      )}
    </button>
  )
}

function AdvisorDialogue({ advisor, relationship, onDismiss, gameState }) {
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  
  const relationshipInfo = getRelationshipLevel(relationship)
  
  // Get contextual dialogue based on game state
  const getDialogue = () => {
    const dialogues = [...advisor.idleDialogue]
    
    // Add contextual dialogue based on game state
    if (gameState.resources.food < gameState.resources.population * 2) {
      if (advisor.id === 'maren') {
        dialogues.unshift("Food stores are dangerously low. We need to act.")
      }
    }
    
    if (gameState.resources.population > 50 && advisor.id === 'tomas') {
      dialogues.unshift("Fifty souls! We could build something grand now.")
    }
    
    if (gameState.day > 30 && advisor.id === 'elara') {
      dialogues.unshift("A month of study, and still so many questions...")
    }
    
    return dialogues
  }
  
  const dialogues = getDialogue()
  const currentDialogue = dialogues[dialogueIndex % dialogues.length]
  
  // Typewriter effect
  useEffect(() => {
    setIsTyping(true)
    setDisplayedText('')
    
    let charIndex = 0
    const text = currentDialogue
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, 30)
    
    return () => clearInterval(typeInterval)
  }, [currentDialogue, dialogueIndex])
  
  const handleNextDialogue = () => {
    if (!isTyping) {
      setDialogueIndex(prev => prev + 1)
    }
  }
  
  // Random greeting
  const greeting = advisor.greetings[Math.floor(Math.random() * advisor.greetings.length)]
  
  return (
    <div className="mt-4 p-4 bg-ink/80 border border-sepia/30 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{advisor.portrait}</span>
          <div>
            <h3 className="font-display text-sm text-gold">
              {advisor.name}
            </h3>
            <p className="font-mono text-xs text-sepia/50">
              {relationshipInfo.label}
            </p>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className="text-sepia/50 hover:text-parchment transition-colors"
        >
          ×
        </button>
      </div>
      
      {/* Dialogue */}
      <div 
        className="min-h-[60px] cursor-pointer"
        onClick={handleNextDialogue}
      >
        <p className="font-body text-parchment/90 italic leading-relaxed">
          "{displayedText}"
          {isTyping && (
            <span className="inline-block w-0.5 h-4 bg-gold/50 ml-0.5 animate-pulse" />
          )}
        </p>
      </div>
      
      {/* Hint */}
      {!isTyping && (
        <p className="mt-2 font-mono text-xs text-sepia/40 text-right">
          Click to continue...
        </p>
      )}
      
      {/* Relationship bar */}
      <div className="mt-4 pt-3 border-t border-sepia/20">
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-xs text-sepia/50">Trust</span>
          <span className="font-mono text-xs text-sepia/50">{relationship}/100</span>
        </div>
        <div className="h-1 bg-sepia/20 rounded overflow-hidden">
          <div 
            className={`
              h-full transition-all duration-500
              ${relationshipInfo.level === 'devoted' ? 'bg-gold' : ''}
              ${relationshipInfo.level === 'friendly' ? 'bg-moss' : ''}
              ${relationshipInfo.level === 'neutral' ? 'bg-sepia' : ''}
              ${relationshipInfo.level === 'wary' ? 'bg-rust' : ''}
              ${relationshipInfo.level === 'hostile' ? 'bg-ember' : ''}
            `}
            style={{ width: `${relationship}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function AdvisorPanel({ unlockedAdvisors, advisorRelations, gameState }) {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null)
  const [newDialogue, setNewDialogue] = useState({})
  
  // Simulate new dialogue availability (would be event-driven in full implementation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (unlockedAdvisors.length > 0 && Math.random() > 0.9) {
        const randomAdvisor = unlockedAdvisors[Math.floor(Math.random() * unlockedAdvisors.length)]
        setNewDialogue(prev => ({ ...prev, [randomAdvisor]: true }))
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [unlockedAdvisors])
  
  const handleSelectAdvisor = (advisorId) => {
    setSelectedAdvisor(advisorId === selectedAdvisor ? null : advisorId)
    // Clear new dialogue indicator
    setNewDialogue(prev => ({ ...prev, [advisorId]: false }))
  }
  
  if (unlockedAdvisors.length === 0) {
    return null
  }
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      <h2 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
        Advisors
      </h2>
      
      {/* Advisor cards */}
      <div className="grid grid-cols-2 gap-2">
        {unlockedAdvisors.map(advisorId => (
          <AdvisorCard
            key={advisorId}
            advisorId={advisorId}
            relationship={advisorRelations[advisorId] || 50}
            isSelected={selectedAdvisor === advisorId}
            onSelect={handleSelectAdvisor}
            hasNewDialogue={newDialogue[advisorId]}
          />
        ))}
      </div>
      
      {/* Selected advisor dialogue */}
      {selectedAdvisor && ADVISORS[selectedAdvisor] && (
        <AdvisorDialogue
          advisor={ADVISORS[selectedAdvisor]}
          relationship={advisorRelations[selectedAdvisor] || 50}
          onDismiss={() => setSelectedAdvisor(null)}
          gameState={gameState}
        />
      )}
    </div>
  )
}
