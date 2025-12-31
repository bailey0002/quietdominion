import { useState } from 'react'
import { PRESTIGE_CONFIG, ENDINGS } from '../data/gameData'

function LegacyUpgradeCard({ upgrade, currentLevel, legacyPoints, onPurchase }) {
  const isMaxed = currentLevel >= upgrade.maxLevel
  const canAfford = legacyPoints >= upgrade.cost
  const canPurchase = !isMaxed && canAfford
  
  // Calculate effect display
  const getEffectDisplay = () => {
    const [effectKey, effectValue] = Object.entries(upgrade.effect)[0]
    const currentBonus = effectValue * currentLevel * 100
    const nextBonus = effectValue * (currentLevel + 1) * 100
    
    if (isMaxed) {
      return `+${currentBonus.toFixed(0)}%`
    }
    return `+${currentBonus.toFixed(0)}% → +${nextBonus.toFixed(0)}%`
  }
  
  return (
    <div className={`
      p-4 rounded-lg border
      transition-all duration-300
      ${isMaxed 
        ? 'bg-gold/10 border-gold/30' 
        : canPurchase 
          ? 'bg-ink/50 border-sepia/30 hover:border-gold/50 cursor-pointer'
          : 'bg-ink/30 border-sepia/10 opacity-60'
      }
    `}
    onClick={() => canPurchase && onPurchase(upgrade.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm text-parchment">
          {upgrade.name}
        </h3>
        <span className="font-mono text-xs text-sepia/50">
          {currentLevel}/{upgrade.maxLevel}
        </span>
      </div>
      
      {/* Description */}
      <p className="font-body text-xs text-parchment/60 mb-3">
        {upgrade.description}
      </p>
      
      {/* Effect and cost */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-moss">
          {getEffectDisplay()}
        </span>
        
        {!isMaxed && (
          <span className={`
            font-mono text-xs
            ${canAfford ? 'text-gold' : 'text-ember/70'}
          `}>
            {upgrade.cost} ✦
          </span>
        )}
        
        {isMaxed && (
          <span className="font-display text-xs text-gold/80">
            MAXED
          </span>
        )}
      </div>
    </div>
  )
}

function EndingCard({ ending, isAchievable, isSelected, onSelect }) {
  return (
    <div 
      className={`
        p-4 rounded-lg border cursor-pointer
        transition-all duration-300
        ${isSelected 
          ? 'bg-gold/15 border-gold/50' 
          : isAchievable 
            ? 'bg-ink/50 border-sepia/30 hover:border-sepia/50'
            : 'bg-ink/30 border-sepia/10 opacity-50'
        }
      `}
      onClick={() => isAchievable && onSelect(ending.id)}
    >
      <h3 className="font-display text-sm text-parchment mb-1">
        {ending.name}
      </h3>
      <p className="font-body text-xs text-parchment/60 mb-2">
        {ending.description}
      </p>
      <span className="font-mono text-xs text-gold/70">
        +{ending.legacyBonus} ✦
      </span>
    </div>
  )
}

export function PrestigeModal({ gameState, onPrestige, onClose }) {
  const [selectedEnding, setSelectedEnding] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const { requirements, legacyFormula } = PRESTIGE_CONFIG
  
  // Check if can prestige
  const meetsRequirements = {
    day: gameState.day >= requirements.day,
    population: gameState.resources.population >= requirements.population,
    structures: Object.values(gameState.structures).reduce((a, b) => a + b, 0) >= requirements.totalStructures,
  }
  
  const canPrestige = Object.values(meetsRequirements).every(Boolean)
  
  // Calculate legacy points to be earned
  const calculateLegacyPoints = () => {
    let points = legacyFormula.basePoints
    points += gameState.resources.population * legacyFormula.perPopulation
    points += Object.values(gameState.structures).reduce((a, b) => a + b, 0) * legacyFormula.perStructure
    points += gameState.discoveredTerritories?.length || 0 * legacyFormula.perTerritory
    points += gameState.discoveredLore?.length || 0 * legacyFormula.perLore
    
    // Day bonus (faster completion = more points)
    if (gameState.day < 100) {
      points += (100 - gameState.day) * legacyFormula.dayBonus
    }
    
    // Ending bonus
    if (selectedEnding) {
      points += ENDINGS[selectedEnding].legacyBonus
    }
    
    return Math.floor(points)
  }
  
  // Check which endings are achievable
  const getAchievableEndings = () => {
    return Object.values(ENDINGS).filter(ending => {
      const req = ending.requirements
      
      if (req.path && gameState.chosenPath !== req.path) return false
      if (req.population && gameState.resources.population < req.population) return false
      if (req.food && gameState.resources.food < req.food) return false
      if (req.knowledge && (gameState.resources.knowledge || 0) < req.knowledge) return false
      if (req.territories && (gameState.discoveredTerritories?.length || 0) < req.territories) return false
      if (req.lore && (gameState.discoveredLore?.length || 0) < req.lore) return false
      if (req.day && gameState.day < req.day) return false
      
      return true
    })
  }
  
  const achievableEndings = getAchievableEndings()
  const legacyPoints = calculateLegacyPoints()
  
  const handlePrestige = () => {
    if (canPrestige && selectedEnding) {
      onPrestige({
        ending: selectedEnding,
        legacyPoints,
      })
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm">
      <div className="
        w-full max-w-2xl max-h-[90vh] overflow-y-auto
        bg-ink border border-gold/30 rounded-lg
        shadow-2xl shadow-gold/10
      ">
        {/* Header */}
        <div className="p-6 border-b border-sepia/20">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wider text-gold">
              Found a New Dominion
            </h2>
            <button
              onClick={onClose}
              className="text-sepia/50 hover:text-parchment text-2xl"
            >
              ×
            </button>
          </div>
          <p className="mt-2 font-body text-parchment/70">
            Leave this settlement behind and begin anew—carrying the wisdom of what you've built.
          </p>
        </div>
        
        {/* Requirements check */}
        <div className="p-6 border-b border-sepia/20">
          <h3 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
            Requirements
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className={`
              p-3 rounded border text-center
              ${meetsRequirements.day ? 'border-moss/50 bg-moss/10' : 'border-ember/30 bg-ember/5'}
            `}>
              <span className="block font-mono text-lg text-parchment">
                {gameState.day}/{requirements.day}
              </span>
              <span className="font-body text-xs text-sepia/60">Days</span>
            </div>
            
            <div className={`
              p-3 rounded border text-center
              ${meetsRequirements.population ? 'border-moss/50 bg-moss/10' : 'border-ember/30 bg-ember/5'}
            `}>
              <span className="block font-mono text-lg text-parchment">
                {Math.floor(gameState.resources.population)}/{requirements.population}
              </span>
              <span className="font-body text-xs text-sepia/60">Population</span>
            </div>
            
            <div className={`
              p-3 rounded border text-center
              ${meetsRequirements.structures ? 'border-moss/50 bg-moss/10' : 'border-ember/30 bg-ember/5'}
            `}>
              <span className="block font-mono text-lg text-parchment">
                {Object.values(gameState.structures).reduce((a, b) => a + b, 0)}/{requirements.totalStructures}
              </span>
              <span className="font-body text-xs text-sepia/60">Structures</span>
            </div>
          </div>
        </div>
        
        {/* Ending selection */}
        {canPrestige && (
          <div className="p-6 border-b border-sepia/20">
            <h3 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
              Choose Your Legacy
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ENDINGS).map(ending => (
                <EndingCard
                  key={ending.id}
                  ending={ending}
                  isAchievable={achievableEndings.some(e => e.id === ending.id)}
                  isSelected={selectedEnding === ending.id}
                  onSelect={setSelectedEnding}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Legacy points preview */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-sm tracking-widest uppercase text-sepia">
                Legacy Points Earned
              </h3>
              <p className="font-body text-xs text-parchment/50">
                Use these between runs to unlock permanent bonuses
              </p>
            </div>
            <span className="font-display text-3xl text-gold">
              {legacyPoints} ✦
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Not Yet
            </button>
            
            <button
              onClick={() => canPrestige && selectedEnding ? setShowConfirm(true) : null}
              disabled={!canPrestige || !selectedEnding}
              className={`
                btn-primary flex-1
                ${(!canPrestige || !selectedEnding) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              Begin Anew
            </button>
          </div>
        </div>
        
        {/* Confirmation overlay */}
        {showConfirm && (
          <div className="absolute inset-0 bg-ink/95 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="font-display text-xl text-gold mb-4">
                Are you certain?
              </h3>
              <p className="font-body text-parchment/70 mb-8">
                Your settlement will be lost. Only your legacy remains.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary"
                >
                  Wait
                </button>
                <button
                  onClick={handlePrestige}
                  className="btn-primary"
                >
                  Found New Dominion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function LegacyUpgradesPanel({ legacyPoints, legacyUpgrades, onPurchase }) {
  const upgrades = PRESTIGE_CONFIG.legacyUpgrades
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm tracking-widest uppercase text-sepia">
          Legacy
        </h2>
        <span className="font-display text-lg text-gold">
          {legacyPoints} ✦
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(upgrades).map(upgrade => (
          <LegacyUpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            currentLevel={legacyUpgrades[upgrade.id] || 0}
            legacyPoints={legacyPoints}
            onPurchase={onPurchase}
          />
        ))}
      </div>
    </div>
  )
}
