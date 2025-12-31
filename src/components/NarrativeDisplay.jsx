import { useMemo } from 'react'
import { TIME_DESCRIPTIONS, STRUCTURES } from '../data/gameData'

// Get time of day based on tick count
const getTimeOfDay = (tickCount) => {
  const hourOfDay = (tickCount % 60) // 60 ticks = 1 day
  
  if (hourOfDay < 10) return 'dawn'
  if (hourOfDay < 25) return 'morning'
  if (hourOfDay < 40) return 'afternoon'
  if (hourOfDay < 50) return 'evening'
  return 'night'
}

// Generate contextual narrative based on game state
const generateNarrative = (gameState) => {
  const { day, tickCount, resources, structures } = gameState
  const timeOfDay = getTimeOfDay(tickCount)
  
  // Get base time description
  const timeDescriptions = TIME_DESCRIPTIONS[timeOfDay]
  const baseDescription = timeDescriptions[Math.floor(Math.random() * timeDescriptions.length)]
  
  // Generate contextual additions
  const additions = []
  
  // Population-based additions
  if (resources.population >= 100) {
    additions.push('The settlement has become a small town.')
  } else if (resources.population >= 50) {
    additions.push(`${Math.floor(resources.population)} souls now call this place home.`)
  } else if (resources.population >= 20) {
    additions.push('The settlement grows steadily.')
  }
  
  // Structure-based additions
  if (structures.smithy && Math.random() > 0.7) {
    additions.push('The ring of hammer on anvil echoes across the valley.')
  }
  if (structures.tavern && Math.random() > 0.7) {
    additions.push('Laughter drifts from the tavern.')
  }
  if (structures.library && Math.random() > 0.8) {
    additions.push('Scholars murmur over ancient texts.')
  }
  
  // Resource-based additions
  if (resources.food > resources.population * 10) {
    if (Math.random() > 0.8) {
      additions.push('The stores are well-stocked.')
    }
  } else if (resources.food < resources.population * 3) {
    if (Math.random() > 0.6) {
      additions.push('Provisions run thin.')
    }
  }
  
  // Day milestone additions
  if (day === 10) {
    additions.push('Ten days since the fire was stoked.')
  } else if (day === 30) {
    additions.push('A month has passed. The settlement endures.')
  } else if (day === 100) {
    additions.push('One hundred days. A century of quiet progress.')
  }
  
  // Combine
  const contextAddition = additions.length > 0 
    ? additions[Math.floor(Math.random() * additions.length)]
    : ''
  
  return { baseDescription, contextAddition }
}

export function NarrativeDisplay({ gameState }) {
  const { baseDescription, contextAddition } = useMemo(
    () => generateNarrative(gameState),
    // Only regenerate every few ticks to avoid constant changes
    [Math.floor(gameState.tickCount / 10), gameState.day]
  )
  
  // Count total structures for display
  const totalStructures = Object.values(gameState.structures).reduce((a, b) => a + b, 0)
  
  // Get structure names for display
  const structureNames = Object.entries(gameState.structures)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
      const structure = STRUCTURES[id]
      return count > 1 ? `${structure.name} ×${count}` : structure.name
    })
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      {/* Main narrative */}
      <div className="narrative-text mb-4">
        <p className="text-parchment/90">
          {baseDescription}
        </p>
        {contextAddition && (
          <p className="mt-2 text-sepia/80 text-base">
            {contextAddition}
          </p>
        )}
      </div>
      
      {/* Settlement stats */}
      <div className="pt-4 border-t border-sepia/20">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div>
            <span className="font-display tracking-wider uppercase text-sepia/60">
              Population
            </span>
            <span className="ml-2 font-mono text-parchment">
              {Math.floor(gameState.resources.population)}
            </span>
          </div>
          
          <div>
            <span className="font-display tracking-wider uppercase text-sepia/60">
              Structures
            </span>
            <span className="ml-2 font-mono text-parchment">
              {totalStructures}
            </span>
          </div>
        </div>
        
        {/* Structure list */}
        {structureNames.length > 0 && (
          <div className="mt-2 font-body text-xs text-parchment/50">
            {structureNames.join(' • ')}
          </div>
        )}
      </div>
    </div>
  )
}
