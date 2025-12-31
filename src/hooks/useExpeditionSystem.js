import { useCallback, useEffect, useRef } from 'react'
import { TERRITORIES } from '../data/events'

export function useExpeditionSystem(gameState, actions) {
  const lastCheckDayRef = useRef(0)
  
  // Start an expedition
  const startExpedition = useCallback((territoryId) => {
    const territory = TERRITORIES[territoryId]
    if (!territory) return false
    
    // Check if already exploring
    if (gameState.activeExpedition) return false
    
    // Check if already discovered
    if (gameState.discoveredTerritories.includes(territoryId)) return false
    
    // Check requirements
    if (territory.requires) {
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
    }
    
    // Check cost
    for (const [resource, cost] of Object.entries(territory.explorationCost)) {
      if ((gameState.resources[resource] || 0) < cost) return false
    }
    
    // Start the expedition
    actions.startExpedition(territoryId, territory.explorationCost)
    return true
  }, [gameState, actions])
  
  // Check for expedition completion
  useEffect(() => {
    if (!gameState.activeExpedition) return
    if (gameState.day === lastCheckDayRef.current) return
    
    lastCheckDayRef.current = gameState.day
    
    const { territoryId, startDay } = gameState.activeExpedition
    const territory = TERRITORIES[territoryId]
    
    if (!territory) return
    
    const daysElapsed = gameState.day - startDay
    
    if (daysElapsed >= territory.explorationTime) {
      // Expedition complete!
      actions.completeExpedition(
        territoryId,
        territory.rewards,
        territory.loreFragment
      )
      
      // Show narrative notification
      if (territory.narratives && territory.narratives.length > 0) {
        const finalNarrative = territory.narratives[territory.narratives.length - 1]
        actions.addNotification({
          type: 'event',
          message: finalNarrative,
          duration: 6000,
        })
      }
    }
  }, [gameState.day, gameState.activeExpedition, actions])
  
  // Get exploration progress percentage
  const getExpeditionProgress = useCallback(() => {
    if (!gameState.activeExpedition) return 0
    
    const { territoryId, startDay } = gameState.activeExpedition
    const territory = TERRITORIES[territoryId]
    
    if (!territory) return 0
    
    const daysElapsed = gameState.day - startDay
    const ticksIntoDay = gameState.tickCount % 60
    const fractionalDay = ticksIntoDay / 60
    
    const progress = ((daysElapsed + fractionalDay) / territory.explorationTime) * 100
    return Math.min(progress, 100)
  }, [gameState])
  
  // Check if a territory can be explored
  const canExploreTerritory = useCallback((territoryId) => {
    const territory = TERRITORIES[territoryId]
    if (!territory) return false
    
    // Already exploring something
    if (gameState.activeExpedition) return false
    
    // Already discovered
    if (gameState.discoveredTerritories.includes(territoryId)) return false
    
    // Check requirements
    if (territory.requires) {
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
    }
    
    // Check cost
    for (const [resource, cost] of Object.entries(territory.explorationCost)) {
      if ((gameState.resources[resource] || 0) < cost) return false
    }
    
    return true
  }, [gameState])
  
  return {
    startExpedition,
    getExpeditionProgress,
    canExploreTerritory,
  }
}
