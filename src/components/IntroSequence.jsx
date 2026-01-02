import { useState, useEffect, useCallback } from 'react'
import { OPENING_NARRATIVE, FIRST_ACTION_PROMPT } from '../data/gameData'

export function IntroSequence({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showAction, setShowAction] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [fadeState, setFadeState] = useState('in')
  const [typeIntervalId, setTypeIntervalId] = useState(null)
  const [delayTimeoutId, setDelayTimeoutId] = useState(null)
  const [fadeTimeoutId, setFadeTimeoutId] = useState(null)
  
  const currentNarrative = OPENING_NARRATIVE[currentIndex]
  
  // Skip to end of current text or advance to next
  const handleAdvance = useCallback(() => {
    if (showAction) return // Already at action button
    
    if (isTyping) {
      // If currently typing, complete the text immediately
      if (typeIntervalId) clearInterval(typeIntervalId)
      if (delayTimeoutId) clearTimeout(delayTimeoutId)
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
      
      setDisplayedText(currentNarrative.text)
      setIsTyping(false)
      
      // Immediately start fade transition
      setFadeState('out')
      const timeout = setTimeout(() => {
        if (currentIndex < OPENING_NARRATIVE.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setShowAction(true)
        }
      }, 300)
      setFadeTimeoutId(timeout)
    } else {
      // If not typing (waiting), advance immediately
      if (delayTimeoutId) clearTimeout(delayTimeoutId)
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
      
      setFadeState('out')
      const timeout = setTimeout(() => {
        if (currentIndex < OPENING_NARRATIVE.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setShowAction(true)
        }
      }, 300)
      setFadeTimeoutId(timeout)
    }
  }, [showAction, isTyping, typeIntervalId, delayTimeoutId, fadeTimeoutId, currentNarrative, currentIndex])
  
  // Skip intro entirely
  const handleSkip = useCallback(() => {
    if (typeIntervalId) clearInterval(typeIntervalId)
    if (delayTimeoutId) clearTimeout(delayTimeoutId)
    if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
    setShowAction(true)
  }, [typeIntervalId, delayTimeoutId, fadeTimeoutId])
  
  // Typewriter effect
  useEffect(() => {
    if (!currentNarrative || showAction) return
    
    setIsTyping(true)
    setDisplayedText('')
    setFadeState('in')
    
    let charIndex = 0
    const text = currentNarrative.text
    
    const intervalId = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(intervalId)
        setIsTyping(false)
        
        // Wait then advance
        const delayId = setTimeout(() => {
          setFadeState('out')
          const fadeId = setTimeout(() => {
            if (currentIndex < OPENING_NARRATIVE.length - 1) {
              setCurrentIndex(prev => prev + 1)
            } else {
              setShowAction(true)
            }
          }, 500)
          setFadeTimeoutId(fadeId)
        }, currentNarrative.delay)
        setDelayTimeoutId(delayId)
      }
    }, 50)
    
    setTypeIntervalId(intervalId)
    
    return () => {
      clearInterval(intervalId)
    }
  }, [currentIndex, currentNarrative, showAction])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeIntervalId) clearInterval(typeIntervalId)
      if (delayTimeoutId) clearTimeout(delayTimeoutId)
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
    }
  }, [typeIntervalId, delayTimeoutId, fadeTimeoutId])
  
  const handleStokeFire = () => {
    onComplete()
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 cursor-pointer select-none"
      onClick={handleAdvance}
    >
      {/* Skip button - always visible during narrative */}
      {!showAction && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSkip()
          }}
          className="
            absolute top-4 right-4
            px-3 py-1.5
            font-mono text-xs tracking-wider uppercase
            text-sepia/50 hover:text-sepia
            border border-sepia/30 hover:border-sepia/50
            rounded transition-all duration-300
            hover:bg-sepia/10
          "
        >
          Skip Intro
        </button>
      )}
      
      {/* Main narrative area */}
      <div className="max-w-xl text-center">
        {!showAction ? (
          <>
            <p 
              className={`
                font-body text-2xl md:text-3xl text-parchment/90 leading-relaxed
                transition-opacity duration-500
                ${fadeState === 'out' ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-6 bg-gold/70 ml-1 animate-pulse" />
              )}
            </p>
            
            {/* Click hint */}
            <p className="mt-8 font-mono text-xs text-sepia/30 animate-pulse">
              Click to continue...
            </p>
          </>
        ) : (
          <div className="animate-fade-in">
            <p className="font-body text-xl md:text-2xl text-sepia/80 mb-12">
              {FIRST_ACTION_PROMPT.text}
            </p>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleStokeFire()
              }}
              className="
                group relative px-8 py-4 
                font-display text-lg tracking-widest uppercase
                text-gold border-2 border-gold/50
                rounded-sm
                transition-all duration-500
                hover:border-gold hover:bg-gold/10
                hover:shadow-lg hover:shadow-gold/20
                active:scale-95
              "
            >
              {/* Glow effect */}
              <span className="
                absolute inset-0 rounded-sm
                bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                animate-pulse-slow
              " />
              
              <span className="relative">
                {FIRST_ACTION_PROMPT.action}
              </span>
            </button>
            
            <p className="mt-6 font-body text-sm text-sepia/50">
              {FIRST_ACTION_PROMPT.effect}
            </p>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {OPENING_NARRATIVE.map((_, index) => (
          <div
            key={index}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-500
              ${index <= currentIndex ? 'bg-gold/60' : 'bg-sepia/30'}
              ${index === currentIndex && !showAction ? 'scale-125' : ''}
            `}
          />
        ))}
        {showAction && (
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        )}
      </div>
    </div>
  )
}
