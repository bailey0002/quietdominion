import { useState } from 'react'
import { ADVISORS } from '../data/gameData'

export function EventModal({ event, onResolve }) {
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState('')
  
  const advisor = event.advisor ? ADVISORS[event.advisor] : null
  
  const handleChoice = (index, choice) => {
    setSelectedChoice(index)
    setOutcome(choice.outcome)
    setShowOutcome(true)
    
    // Delay before closing
    setTimeout(() => {
      onResolve(index, choice)
    }, 3000)
  }
  
  // Format effect display
  const formatEffects = (effects) => {
    if (!effects || Object.keys(effects).length === 0) return null
    
    return Object.entries(effects)
      .map(([resource, amount]) => {
        const sign = amount > 0 ? '+' : ''
        return `${sign}${amount} ${resource}`
      })
      .join(', ')
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-fade-in">
      <div className="
        w-full max-w-lg
        bg-ink border border-sepia/40 rounded-lg
        shadow-2xl shadow-ink/50
        overflow-hidden
      ">
        {/* Header with optional advisor */}
        <div className="p-6 border-b border-sepia/20">
          {advisor && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{advisor.portrait}</span>
              <div>
                <h3 className="font-display text-sm text-gold">
                  {advisor.name}
                </h3>
                <p className="font-body text-xs text-sepia/70">
                  {advisor.title}
                </p>
              </div>
            </div>
          )}
          
          <h2 className="font-display text-xl tracking-wide text-parchment">
            {event.title}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {!showOutcome ? (
            <>
              <p className="font-body text-parchment/90 leading-relaxed mb-6">
                {event.description}
              </p>
              
              {/* Choices */}
              <div className="space-y-3">
                {event.choices.map((choice, index) => {
                  const effects = formatEffects(choice.effects)
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleChoice(index, choice)}
                      className="
                        w-full text-left p-4
                        border border-sepia/30 rounded
                        bg-ink/50 hover:bg-sepia/10
                        transition-all duration-300
                        hover:border-gold/50
                        group
                      "
                    >
                      <span className="font-body text-parchment group-hover:text-gold transition-colors">
                        {choice.text}
                      </span>
                      
                      {effects && (
                        <span className="
                          block mt-1 font-mono text-xs text-sepia/60
                          group-hover:text-sepia/80
                        ">
                          {effects}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              {/* Show selected choice */}
              <p className="font-body text-sepia/70 italic mb-4">
                "{event.choices[selectedChoice].text}"
              </p>
              
              {/* Show outcome */}
              <p className="font-body text-parchment leading-relaxed">
                {outcome}
              </p>
              
              {/* Effects applied */}
              {event.choices[selectedChoice].effects && 
               Object.keys(event.choices[selectedChoice].effects).length > 0 && (
                <div className="mt-4 pt-4 border-t border-sepia/20">
                  <span className="font-mono text-xs text-moss">
                    {formatEffects(event.choices[selectedChoice].effects)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
