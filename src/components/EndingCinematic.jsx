import { useState, useEffect } from 'react'
import { ENDINGS } from '../data/gameData'

export function EndingCinematic({ endingId, legacyPoints, onComplete }) {
  const [phase, setPhase] = useState('fade-in')
  const [narrativeIndex, setNarrativeIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const ending = ENDINGS[endingId]
  
  if (!ending) {
    onComplete()
    return null
  }
  
  const narratives = ending.narrative
  const currentNarrative = narratives[narrativeIndex]
  
  // Phase transitions
  useEffect(() => {
    if (phase === 'fade-in') {
      const timer = setTimeout(() => setPhase('title'), 1000)
      return () => clearTimeout(timer)
    }
    if (phase === 'title') {
      const timer = setTimeout(() => setPhase('narrative'), 2500)
      return () => clearTimeout(timer)
    }
  }, [phase])
  
  // Typewriter effect for narrative
  useEffect(() => {
    if (phase !== 'narrative' || !currentNarrative) return
    
    setIsTyping(true)
    setDisplayedText('')
    
    let charIndex = 0
    const text = currentNarrative
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, 40)
    
    return () => clearInterval(typeInterval)
  }, [phase, currentNarrative, narrativeIndex])
  
  // Handle advancing narrative
  const handleAdvance = () => {
    if (isTyping) {
      // Skip to end of current text
      setDisplayedText(currentNarrative)
      setIsTyping(false)
    } else if (narrativeIndex < narratives.length - 1) {
      // Advance to next narrative
      setNarrativeIndex(prev => prev + 1)
    } else {
      // Show legacy summary then complete
      setPhase('legacy')
    }
  }
  
  const handleComplete = () => {
    setPhase('fade-out')
    setTimeout(onComplete, 1000)
  }
  
  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-ink transition-opacity duration-1000
        ${phase === 'fade-in' ? 'opacity-0' : 'opacity-100'}
        ${phase === 'fade-out' ? 'opacity-0' : ''}
      `}
      onClick={phase === 'narrative' ? handleAdvance : undefined}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent" />
      </div>
      
      {/* Title phase */}
      {(phase === 'title' || phase === 'narrative' || phase === 'legacy') && (
        <div className={`
          text-center mb-12 transition-opacity duration-1000
          ${phase === 'title' ? 'opacity-100' : 'opacity-60'}
        `}>
          <h1 className="font-display text-3xl md:text-5xl tracking-widest text-gold mb-4">
            {ending.name}
          </h1>
          <p className="font-body text-lg text-sepia/70 italic">
            {ending.description}
          </p>
        </div>
      )}
      
      {/* Narrative phase */}
      {phase === 'narrative' && (
        <div className="max-w-2xl px-8 text-center">
          <p className="font-body text-xl md:text-2xl text-parchment/90 leading-relaxed">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-6 bg-gold/50 ml-1 animate-pulse" />
            )}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-12">
            {narratives.map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${i === narrativeIndex ? 'bg-gold scale-125' : 'bg-sepia/30'}
                  ${i < narrativeIndex ? 'bg-sepia/60' : ''}
                `}
              />
            ))}
          </div>
          
          {/* Continue hint */}
          {!isTyping && (
            <p className="mt-8 font-mono text-xs text-sepia/40 animate-pulse">
              Click to continue...
            </p>
          )}
        </div>
      )}
      
      {/* Legacy summary phase */}
      {phase === 'legacy' && (
        <div className="max-w-lg px-8 text-center animate-fade-in">
          <div className="mb-8 p-8 border border-gold/30 rounded-lg bg-gold/5">
            <h2 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
              Legacy Earned
            </h2>
            
            <div className="flex items-center justify-center gap-4">
              <span className="font-display text-5xl text-gold">
                {legacyPoints}
              </span>
              <span className="text-3xl text-gold/80">✦</span>
            </div>
            
            <p className="mt-4 font-body text-parchment/60">
              Your wisdom carries forward to the next dominion.
            </p>
          </div>
          
          <button
            onClick={handleComplete}
            className="btn-primary px-8 py-3"
          >
            Begin Anew
          </button>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-t from-transparent via-sepia/30 to-transparent" />
      </div>
    </div>
  )
}
