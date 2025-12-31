import { useReducer, useCallback, useEffect, useRef } from 'react'
import { GAME_CONFIG, RESOURCES, STRUCTURES } from '../data/gameData'

// Initial game state
const createInitialState = () => ({
  // Meta
  gameStarted: false,
  introComplete: false,
  day: 1,
  tickCount: 0,
  lastSaved: null,
  lastOnline: Date.now(),
  
  // Resources
  resources: { ...GAME_CONFIG.INITIAL_RESOURCES },
  resourceCaps: { ...GAME_CONFIG.BASE_CAPS },
  productionRates: { ...GAME_CONFIG.BASE_RATES },
  
  // Structures
  structures: {},
  structureUnlocks: Object.fromEntries(
    Object.entries(STRUCTURES).map(([id, s]) => [id, s.unlocked])
  ),
  
  // Advisors
  unlockedAdvisors: ['maren', 'tomas'],
  advisorRelations: {
    maren: 50,
    tomas: 50,
    elara: 0,
  },
  
  // Events
  activeEvent: null,
  eventHistory: [],
  pendingConsequences: [],
  
  // Exploration
  discoveredTerritories: [],
  activeExpedition: null,
  
  // Lore
  discoveredLore: [],
  
  // Progression
  prestigeCount: 0,
  legacyBonuses: {},
  chosenPath: null,
  
  // UI State
  notifications: [],
})

// Action types
const ACTIONS = {
  START_GAME: 'START_GAME',
  COMPLETE_INTRO: 'COMPLETE_INTRO',
  TICK: 'TICK',
  ADD_RESOURCE: 'ADD_RESOURCE',
  SPEND_RESOURCE: 'SPEND_RESOURCE',
  BUILD_STRUCTURE: 'BUILD_STRUCTURE',
  UNLOCK_STRUCTURE: 'UNLOCK_STRUCTURE',
  TRIGGER_EVENT: 'TRIGGER_EVENT',
  RESOLVE_EVENT: 'RESOLVE_EVENT',
  START_EXPEDITION: 'START_EXPEDITION',
  COMPLETE_EXPEDITION: 'COMPLETE_EXPEDITION',
  DISCOVER_LORE: 'DISCOVER_LORE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  CALCULATE_OFFLINE: 'CALCULATE_OFFLINE',
  LOAD_SAVE: 'LOAD_SAVE',
  ADVANCE_DAY: 'ADVANCE_DAY',
}

// Calculate production rates based on structures
const calculateProductionRates = (structures) => {
  const rates = { ...GAME_CONFIG.BASE_RATES }
  
  Object.entries(structures).forEach(([structureId, count]) => {
    const structure = STRUCTURES[structureId]
    if (structure && structure.productionBonus) {
      Object.entries(structure.productionBonus).forEach(([resource, bonus]) => {
        rates[resource] = (rates[resource] || 0) + bonus * count
      })
    }
  })
  
  return rates
}

// Calculate resource caps based on structures
const calculateResourceCaps = (structures) => {
  const caps = { ...GAME_CONFIG.BASE_CAPS }
  
  Object.entries(structures).forEach(([structureId, count]) => {
    const structure = STRUCTURES[structureId]
    if (structure && structure.capBonus) {
      Object.entries(structure.capBonus).forEach(([resource, bonus]) => {
        caps[resource] = (caps[resource] || 0) + bonus * count
      })
    }
  })
  
  return caps
}

// Check structure unlock conditions
const checkStructureUnlocks = (state) => {
  const unlocks = { ...state.structureUnlocks }
  
  Object.entries(STRUCTURES).forEach(([id, structure]) => {
    if (unlocks[id]) return // Already unlocked
    
    const condition = structure.unlockCondition
    if (!condition) return
    
    let shouldUnlock = true
    
    // Check population requirement
    if (condition.population && state.resources.population < condition.population) {
      shouldUnlock = false
    }
    
    // Check structure requirements
    if (condition.structures) {
      if (typeof condition.structures === 'object') {
        Object.entries(condition.structures).forEach(([reqStructure, reqCount]) => {
          if ((state.structures[reqStructure] || 0) < reqCount) {
            shouldUnlock = false
          }
        })
      } else if (Array.isArray(condition.structures)) {
        condition.structures.forEach(reqStructure => {
          if (!state.structures[reqStructure]) {
            shouldUnlock = false
          }
        })
      }
    }
    
    if (shouldUnlock) {
      unlocks[id] = true
    }
  })
  
  return unlocks
}

// Game reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return {
        ...state,
        gameStarted: true,
        lastOnline: Date.now(),
      }
    
    case ACTIONS.COMPLETE_INTRO:
      return {
        ...state,
        introComplete: true,
        structures: { campfire: 1 },
      }
    
    case ACTIONS.TICK: {
      // Don't tick if game hasn't started or intro isn't complete
      if (!state.gameStarted || !state.introComplete) return state
      
      const newResources = { ...state.resources }
      const rates = state.productionRates
      
      // Apply production
      Object.entries(rates).forEach(([resource, rate]) => {
        if (rate > 0) {
          const cap = state.resourceCaps[resource] || Infinity
          newResources[resource] = Math.min(
            (newResources[resource] || 0) + rate,
            cap
          )
        }
      })
      
      const newTickCount = state.tickCount + 1
      const newDay = Math.floor(newTickCount / 60) + 1 // 60 ticks = 1 day
      
      return {
        ...state,
        resources: newResources,
        tickCount: newTickCount,
        day: newDay,
        lastOnline: Date.now(),
      }
    }
    
    case ACTIONS.ADD_RESOURCE:
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: Math.min(
            (state.resources[action.resource] || 0) + action.amount,
            state.resourceCaps[action.resource] || Infinity
          ),
        },
      }
    
    case ACTIONS.SPEND_RESOURCE: {
      const newAmount = (state.resources[action.resource] || 0) - action.amount
      if (newAmount < 0) return state // Can't spend what you don't have
      
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: newAmount,
        },
      }
    }
    
    case ACTIONS.BUILD_STRUCTURE: {
      const structure = STRUCTURES[action.structureId]
      if (!structure) return state
      
      const currentCount = state.structures[action.structureId] || 0
      if (currentCount >= structure.maxCount) return state
      
      // Check cost
      const newResources = { ...state.resources }
      for (const [resource, cost] of Object.entries(structure.cost)) {
        if ((newResources[resource] || 0) < cost) return state
        newResources[resource] -= cost
      }
      
      const newStructures = {
        ...state.structures,
        [action.structureId]: currentCount + 1,
      }
      
      const newRates = calculateProductionRates(newStructures)
      const newCaps = calculateResourceCaps(newStructures)
      const newUnlocks = checkStructureUnlocks({
        ...state,
        structures: newStructures,
      })
      
      return {
        ...state,
        resources: newResources,
        structures: newStructures,
        productionRates: newRates,
        resourceCaps: newCaps,
        structureUnlocks: newUnlocks,
      }
    }
    
    case ACTIONS.TRIGGER_EVENT:
      return {
        ...state,
        activeEvent: action.event,
      }
    
    case ACTIONS.RESOLVE_EVENT: {
      const { choice, effects } = action
      const newResources = { ...state.resources }
      
      // Apply effects
      if (effects) {
        Object.entries(effects).forEach(([resource, amount]) => {
          newResources[resource] = Math.max(0, (newResources[resource] || 0) + amount)
        })
      }
      
      return {
        ...state,
        resources: newResources,
        activeEvent: null,
        eventHistory: [
          ...state.eventHistory,
          {
            eventId: state.activeEvent?.id,
            choiceIndex: action.choiceIndex,
            day: state.day,
          },
        ],
      }
    }
    
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.notification,
          },
        ],
      }
    
    case ACTIONS.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      }
    
    case ACTIONS.CALCULATE_OFFLINE: {
      const offlineMs = Date.now() - state.lastOnline
      const offlineSeconds = Math.min(
        offlineMs / 1000,
        GAME_CONFIG.MAX_OFFLINE_HOURS * 3600
      )
      const offlineTicks = offlineSeconds * GAME_CONFIG.OFFLINE_MULTIPLIER
      
      const newResources = { ...state.resources }
      Object.entries(state.productionRates).forEach(([resource, rate]) => {
        if (rate > 0) {
          const cap = state.resourceCaps[resource] || Infinity
          newResources[resource] = Math.min(
            (newResources[resource] || 0) + rate * offlineTicks,
            cap
          )
        }
      })
      
      return {
        ...state,
        resources: newResources,
        lastOnline: Date.now(),
      }
    }
    
    case ACTIONS.LOAD_SAVE:
      return {
        ...createInitialState(),
        ...action.savedState,
        lastOnline: Date.now(),
      }
    
    case ACTIONS.ADVANCE_DAY:
      return {
        ...state,
        day: state.day + 1,
      }
    
    default:
      return state
  }
}

// Custom hook for game state
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)
  const tickIntervalRef = useRef(null)
  
  // Start the game
  const startGame = useCallback(() => {
    dispatch({ type: ACTIONS.START_GAME })
  }, [])
  
  // Complete intro sequence
  const completeIntro = useCallback(() => {
    dispatch({ type: ACTIONS.COMPLETE_INTRO })
  }, [])
  
  // Build a structure
  const buildStructure = useCallback((structureId) => {
    dispatch({ type: ACTIONS.BUILD_STRUCTURE, structureId })
  }, [])
  
  // Trigger an event
  const triggerEvent = useCallback((event) => {
    dispatch({ type: ACTIONS.TRIGGER_EVENT, event })
  }, [])
  
  // Resolve event with choice
  const resolveEvent = useCallback((choiceIndex, choice) => {
    dispatch({
      type: ACTIONS.RESOLVE_EVENT,
      choiceIndex,
      choice,
      effects: choice.effects,
    })
    
    // Add notification for outcome
    if (choice.outcome) {
      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,
        notification: {
          type: 'event',
          message: choice.outcome,
          duration: 5000,
        },
      })
    }
  }, [])
  
  // Add notification
  const addNotification = useCallback((notification) => {
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, notification })
  }, [])
  
  // Dismiss notification
  const dismissNotification = useCallback((id) => {
    dispatch({ type: ACTIONS.DISMISS_NOTIFICATION, id })
  }, [])
  
  // Check if can afford structure
  const canAffordStructure = useCallback((structureId) => {
    const structure = STRUCTURES[structureId]
    if (!structure) return false
    
    for (const [resource, cost] of Object.entries(structure.cost)) {
      if ((state.resources[resource] || 0) < cost) return false
    }
    return true
  }, [state.resources])
  
  // Save game
  const saveGame = useCallback(() => {
    const saveData = {
      ...state,
      lastSaved: Date.now(),
    }
    localStorage.setItem('quietDominion_save', JSON.stringify(saveData))
  }, [state])
  
  // Load game
  const loadGame = useCallback(() => {
    const savedData = localStorage.getItem('quietDominion_save')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        dispatch({ type: ACTIONS.LOAD_SAVE, savedState: parsed })
        dispatch({ type: ACTIONS.CALCULATE_OFFLINE })
        return true
      } catch (e) {
        console.error('Failed to load save:', e)
        return false
      }
    }
    return false
  }, [])
  
  // Game tick
  useEffect(() => {
    if (state.gameStarted && state.introComplete) {
      tickIntervalRef.current = setInterval(() => {
        dispatch({ type: ACTIONS.TICK })
      }, GAME_CONFIG.TICK_INTERVAL)
      
      return () => {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current)
        }
      }
    }
  }, [state.gameStarted, state.introComplete])
  
  // Auto-save every 30 seconds
  useEffect(() => {
    if (state.gameStarted) {
      const saveInterval = setInterval(saveGame, 30000)
      return () => clearInterval(saveInterval)
    }
  }, [state.gameStarted, saveGame])
  
  return {
    state,
    actions: {
      startGame,
      completeIntro,
      buildStructure,
      triggerEvent,
      resolveEvent,
      addNotification,
      dismissNotification,
      canAffordStructure,
      saveGame,
      loadGame,
    },
  }
}

export { ACTIONS }
