import { useCallback, useEffect, useRef } from 'react'
import { EVENTS, DILEMMAS } from '../data/events'

// Check if event conditions are met
const checkEventConditions = (event, gameState) => {
  const { conditions } = event
  if (!conditions) return true
  
  // Check minimum day
  if (conditions.minDay && gameState.day < conditions.minDay) {
    return false
  }
  
  // Check maximum day
  if (conditions.maxDay && gameState.day > conditions.maxDay) {
    return false
  }
  
  // Check minimum population
  if (conditions.minPopulation && gameState.resources.population < conditions.minPopulation) {
    return false
  }
  
  // Check maximum population
  if (conditions.maxPopulation && gameState.resources.population > conditions.maxPopulation) {
    return false
  }
  
  // Check minimum food
  if (conditions.minFood && gameState.resources.food < conditions.minFood) {
    return false
  }
  
  // Check minimum materials
  if (conditions.minMaterials && gameState.resources.materials < conditions.minMaterials) {
    return false
  }
  
  // Check required structures
  if (conditions.requiredStructures) {
    for (const structureId of conditions.requiredStructures) {
      if (!gameState.structures[structureId]) {
        return false
      }
    }
  }
  
  // Check minimum structure count
  if (conditions.minStructureCount) {
    const totalStructures = Object.values(gameState.structures).reduce((a, b) => a + b, 0)
    if (totalStructures < conditions.minStructureCount) {
      return false
    }
  }
  
  // Check unlocked advisors
  if (conditions.unlockedAdvisors) {
    for (const advisorId of conditions.unlockedAdvisors) {
      if (!gameState.unlockedAdvisors.includes(advisorId)) {
        return false
      }
    }
  }
  
  return true
}

// Check if event was already triggered recently
const wasRecentlyTriggered = (eventId, eventHistory, cooldownDays = 10) => {
  const recentOccurrence = eventHistory.find(
    h => h.eventId === eventId && h.day > (eventHistory.length > 0 ? eventHistory[eventHistory.length - 1].day : 0) - cooldownDays
  )
  return !!recentOccurrence
}

// Select a random event based on weights
const selectRandomEvent = (eligibleEvents) => {
  if (eligibleEvents.length === 0) return null
  
  const totalWeight = eligibleEvents.reduce((sum, e) => sum + (e.weight || 1), 0)
  let random = Math.random() * totalWeight
  
  for (const event of eligibleEvents) {
    random -= event.weight || 1
    if (random <= 0) {
      return event
    }
  }
  
  return eligibleEvents[0]
}

export function useEventSystem(gameState, triggerEvent) {
  const lastEventDayRef = useRef(0)
  const eventCheckIntervalRef = useRef(null)
  
  // Get eligible events
  const getEligibleEvents = useCallback(() => {
    const allEvents = { ...EVENTS, ...DILEMMAS }
    
    return Object.values(allEvents).filter(event => {
      // Check basic conditions
      if (!checkEventConditions(event, gameState)) return false
      
      // Check cooldown
      if (wasRecentlyTriggered(event.id, gameState.eventHistory)) return false
      
      return true
    })
  }, [gameState])
  
  // Try to trigger an event
  const tryTriggerEvent = useCallback(() => {
    // Don't trigger if there's already an active event
    if (gameState.activeEvent) return
    
    // Don't trigger too frequently (minimum 1 day between events)
    if (gameState.day <= lastEventDayRef.current) return
    
    // Base chance of event (increases with population)
    const baseChance = 0.1 + (gameState.resources.population || 0) * 0.002
    
    // Check tavern bonus
    const tavernBonus = (gameState.structures.tavern || 0) * 0.1
    
    const eventChance = Math.min(baseChance + tavernBonus, 0.5)
    
    if (Math.random() < eventChance) {
      const eligibleEvents = getEligibleEvents()
      const selectedEvent = selectRandomEvent(eligibleEvents)
      
      if (selectedEvent) {
        lastEventDayRef.current = gameState.day
        triggerEvent(selectedEvent)
      }
    }
  }, [gameState, getEligibleEvents, triggerEvent])
  
  // Check for events periodically
  useEffect(() => {
    if (gameState.gameStarted && gameState.introComplete) {
      // Check every 10 seconds
      eventCheckIntervalRef.current = setInterval(() => {
        tryTriggerEvent()
      }, 10000)
      
      return () => {
        if (eventCheckIntervalRef.current) {
          clearInterval(eventCheckIntervalRef.current)
        }
      }
    }
  }, [gameState.gameStarted, gameState.introComplete, tryTriggerEvent])
  
  // Manual event trigger for debugging
  const forceEvent = useCallback((eventId) => {
    const event = EVENTS[eventId] || DILEMMAS[eventId]
    if (event) {
      triggerEvent(event)
    }
  }, [triggerEvent])
  
  return {
    getEligibleEvents,
    forceEvent,
  }
}
