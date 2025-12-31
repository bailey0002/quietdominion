import { STRUCTURES } from '../data/gameData'

function StructureCard({ structureId, count, unlocked, canAfford, onBuild }) {
  const structure = STRUCTURES[structureId]
  if (!structure) return null
  
  const isMaxed = count >= structure.maxCount
  const canBuild = unlocked && canAfford && !isMaxed
  
  // Format cost display
  const costDisplay = Object.entries(structure.cost)
    .map(([resource, amount]) => `${amount} ${resource}`)
    .join(', ')
  
  // Format effect display
  const effectDisplay = []
  if (structure.productionBonus) {
    Object.entries(structure.productionBonus).forEach(([resource, bonus]) => {
      effectDisplay.push(`+${(bonus * 60).toFixed(1)} ${resource}/min`)
    })
  }
  if (structure.capBonus) {
    Object.entries(structure.capBonus).forEach(([resource, bonus]) => {
      effectDisplay.push(`+${bonus} max ${resource}`)
    })
  }
  
  if (!unlocked) return null
  
  return (
    <div 
      className={`
        structure-card
        ${!canBuild ? 'locked' : ''}
      `}
      onClick={() => canBuild && onBuild(structureId)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-sm tracking-wide text-parchment">
          {structure.name}
        </h3>
        <span className="font-mono text-xs text-sepia/70">
          {count}/{structure.maxCount}
        </span>
      </div>
      
      {/* Description */}
      <p className="font-body text-xs text-parchment/60 mb-3 leading-relaxed">
        {structure.description}
      </p>
      
      {/* Cost */}
      {!isMaxed && (
        <div className="mt-auto pt-2 border-t border-sepia/20">
          <div className="flex justify-between items-center">
            <span className={`
              font-mono text-xs
              ${canAfford ? 'text-moss' : 'text-ember/70'}
            `}>
              {costDisplay || 'Free'}
            </span>
            
            {canBuild && (
              <span className="
                font-display text-xs tracking-wider uppercase
                text-gold/80 hover:text-gold
                transition-colors
              ">
                Build
              </span>
            )}
          </div>
          
          {/* Effects preview */}
          {effectDisplay.length > 0 && (
            <div className="mt-1 font-mono text-xs text-moss/60">
              {effectDisplay.join(' • ')}
            </div>
          )}
        </div>
      )}
      
      {isMaxed && (
        <div className="mt-auto pt-2 border-t border-sepia/20">
          <span className="font-mono text-xs text-parchment/40">
            Maximum built
          </span>
        </div>
      )}
    </div>
  )
}

export function StructurePanel({ structures, structureUnlocks, canAffordStructure, onBuild }) {
  // Get all unlocked structures
  const availableStructures = Object.entries(STRUCTURES)
    .filter(([id]) => structureUnlocks[id])
    .sort((a, b) => a[1].tier - b[1].tier)
  
  // Group by tier
  const tiers = {}
  availableStructures.forEach(([id, structure]) => {
    if (!tiers[structure.tier]) tiers[structure.tier] = []
    tiers[structure.tier].push(id)
  })
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      <h2 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
        Structures
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableStructures.map(([id]) => (
          <StructureCard
            key={id}
            structureId={id}
            count={structures[id] || 0}
            unlocked={structureUnlocks[id]}
            canAfford={canAffordStructure(id)}
            onBuild={onBuild}
          />
        ))}
      </div>
      
      {availableStructures.length === 0 && (
        <p className="font-body text-sm text-parchment/50 italic">
          No structures available yet.
        </p>
      )}
    </div>
  )
}
