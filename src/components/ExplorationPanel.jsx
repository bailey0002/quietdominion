import { useState } from 'react'
import { TERRITORIES } from '../data/events'

function TerritoryCard({ 
  territory, 
  isDiscovered, 
  isExploring, 
  explorationProgress, 
  canExplore, 
  onExplore,
  gameState 
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Check if territory requirements are met
  const meetsRequirements = () => {
    if (!territory.requires) return true
    
    const req = territory.requires
    
    if (req.day && gameState.day < req.day) return false
    if (req.structures) {
      for (const structureId of req.structures) {
        if (!gameState.structures[structureId]) return false
      }
    }
    if (req.unlockedAdvisors) {
      for (const advisorId of req.unlockedAdvisors) {
        if (!gameState.unlockedAdvisors.includes(advisorId)) return false
      }
    }
    
    return true
  }
  
  const requirementsMet = meetsRequirements()
  
  // Format cost display
  const formatCost = (cost) => {
    return Object.entries(cost)
      .map(([resource, amount]) => `${amount} ${resource}`)
      .join(', ')
  }
  
  // Check if can afford
  const canAfford = () => {
    for (const [resource, cost] of Object.entries(territory.explorationCost)) {
      if ((gameState.resources[resource] || 0) < cost) return false
    }
    return true
  }
  
  if (isDiscovered) {
    return (
      <div className="
        p-4 rounded-lg border
        bg-moss/10 border-moss/30
      ">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-moss">✓</span>
          <h3 className="font-display text-sm text-parchment">
            {territory.name}
          </h3>
        </div>
        <p className="font-body text-xs text-parchment/60">
          Explored and mapped.
        </p>
      </div>
    )
  }
  
  if (!requirementsMet) {
    return (
      <div className="
        p-4 rounded-lg border
        bg-ink/30 border-sepia/10 opacity-50
      ">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sepia/50">?</span>
          <h3 className="font-display text-sm text-sepia/50">
            Unknown Territory
          </h3>
        </div>
        <p className="font-body text-xs text-sepia/30 italic">
          Requirements not met
        </p>
      </div>
    )
  }
  
  if (isExploring) {
    return (
      <div className="
        p-4 rounded-lg border
        bg-gold/5 border-gold/30
      ">
        <div className="flex items-center gap-2 mb-2">
          <span className="animate-pulse">🔍</span>
          <h3 className="font-display text-sm text-gold">
            {territory.name}
          </h3>
        </div>
        <p className="font-body text-xs text-parchment/70 mb-3">
          Expedition in progress...
        </p>
        
        {/* Progress bar */}
        <div className="h-2 bg-sepia/20 rounded overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${explorationProgress}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-xs text-sepia/50 text-right">
          {Math.floor(explorationProgress)}%
        </p>
      </div>
    )
  }
  
  return (
    <div 
      className={`
        p-4 rounded-lg border cursor-pointer
        transition-all duration-300
        ${isHovered 
          ? 'bg-sepia/10 border-sepia/50' 
          : 'bg-ink/50 border-sepia/20'
        }
        ${!canAfford() ? 'opacity-60' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => canAfford() && onExplore(territory.id)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sepia">🗺️</span>
        <h3 className="font-display text-sm text-parchment">
          {territory.name}
        </h3>
      </div>
      
      {/* Description */}
      <p className="font-body text-xs text-parchment/70 mb-3 leading-relaxed">
        {territory.description}
      </p>
      
      {/* Cost and time */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className={`
          font-mono
          ${canAfford() ? 'text-moss/70' : 'text-ember/70'}
        `}>
          Cost: {formatCost(territory.explorationCost)}
        </span>
        <span className="font-mono text-sepia/50">
          • {territory.explorationTime} days
        </span>
      </div>
      
      {/* Explore button hint */}
      {isHovered && canAfford() && (
        <div className="mt-3 text-center">
          <span className="font-display text-xs tracking-wider uppercase text-gold/80">
            Send Expedition
          </span>
        </div>
      )}
    </div>
  )
}

export function ExplorationPanel({ 
  gameState, 
  discoveredTerritories, 
  activeExpedition,
  onStartExpedition 
}) {
  // Get all territories and sort by discovered status
  const territories = Object.values(TERRITORIES)
  
  // Calculate exploration progress if there's an active expedition
  const getExplorationProgress = (territoryId) => {
    if (!activeExpedition || activeExpedition.territoryId !== territoryId) {
      return 0
    }
    
    const territory = TERRITORIES[territoryId]
    const elapsedDays = gameState.day - activeExpedition.startDay
    const progress = (elapsedDays / territory.explorationTime) * 100
    return Math.min(progress, 100)
  }
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm tracking-widest uppercase text-sepia">
          Exploration
        </h2>
        <span className="font-mono text-xs text-sepia/50">
          {discoveredTerritories.length}/{territories.length} discovered
        </span>
      </div>
      
      {/* Territory grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {territories.map(territory => (
          <TerritoryCard
            key={territory.id}
            territory={territory}
            isDiscovered={discoveredTerritories.includes(territory.id)}
            isExploring={activeExpedition?.territoryId === territory.id}
            explorationProgress={getExplorationProgress(territory.id)}
            canExplore={!activeExpedition}
            onExplore={onStartExpedition}
            gameState={gameState}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {territories.length === 0 && (
        <p className="font-body text-sm text-parchment/50 italic text-center py-4">
          No territories visible yet.
        </p>
      )}
    </div>
  )
}
