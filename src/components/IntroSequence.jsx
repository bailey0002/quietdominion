import { useState, useEffect } from 'react'
import { OPENING_NARRATIVE, FIRST_ACTION_PROMPT } from '../data/gameData'

export function IntroSequence({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showAction, setShowAction] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [fadeState, setFadeState] = useState('in')
  
  const currentNarrative = OPENING_NARRATIVE[currentIndex]
  
  // Typewriter effect
  useEffect(() => {
    if (!currentNarrative) return
    
    setIsTyping(true)
    setDisplayedText('')
    setFadeState('in')
    
    let charIndex = 0
    const text = currentNarrative.text
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        
        // Wait then advance
        setTimeout(() => {
          setFadeState('out')
          setTimeout(() => {
            if (currentIndex < OPENING_NARRATIVE.length - 1) {
              setCurrentIndex(prev => prev + 1)
            } else {
              setShowAction(true)
            }
          }, 500)
        }, currentNarrative.delay)
      }
    }, 50)
    
    return () => clearInterval(typeInterval)
  }, [currentIndex, currentNarrative])
  
  const handleStokeFire = () => {
    onComplete()
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Main narrative area */}
      <div className="max-w-xl text-center">
        {!showAction ? (
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
        ) : (
          <div className="animate-fade-in">
            <p className="font-body text-xl md:text-2xl text-sepia/80 mb-12">
              {FIRST_ACTION_PROMPT.text}
            </p>
            
            <button
              onClick={handleStokeFire}
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
