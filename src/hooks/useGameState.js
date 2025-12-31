import { useReducer, useCallback, useEffect, useRef } from 'react'
import { GAME_CONFIG, RESOURCES, STRUCTURES } from '../data/gameData'

// Initial game state
const createInitialState = (legacyData = null) => ({
  // Meta
  gameStarted: false,
  introComplete: false,
  day: 1,
  tickCount: 0,
  lastSaved: null,
  lastOnline: Date.now(),
  
  // Resources (with legacy bonuses applied)
  resources: applyLegacyBonuses(
    { ...GAME_CONFIG.INITIAL_RESOURCES },
    legacyData?.legacyUpgrades || {}
  ),
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
    corvus: 0,
  },
  
  // Events
  activeEvent: null,
  eventHistory: [],
  pendingConsequences: [],
  
  // Exploration
  discoveredTerritories: [],
  activeExpedition: null,
  
  // Lore
  discoveredLore: legacyData?.startingLore || [],
  newLore: [],
  
  // Progression
  prestigeCount: legacyData?.prestigeCount || 0,
  legacyPoints: legacyData?.legacyPoints || 0,
  legacyUpgrades: legacyData?.legacyUpgrades || {},
  chosenPath: null,
  
  // UI State
  notifications: [],
})

// Apply legacy bonuses to starting resources
const applyLegacyBonuses = (resources, upgrades) => {
  const quickStartLevel = upgrades.quickStart || 0
  if (quickStartLevel > 0) {
    const bonus = 1 + (0.2 * quickStartLevel)
    Object.keys(resources).forEach(key => {
      if (resources[key] > 0) {
        resources[key] = Math.floor(resources[key] * bonus)
      }
    })
  }
  return resources
}

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
  UPDATE_EXPEDITION: 'UPDATE_EXPEDITION',
  DISCOVER_LORE: 'DISCOVER_LORE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  CALCULATE_OFFLINE: 'CALCULATE_OFFLINE',
  LOAD_SAVE: 'LOAD_SAVE',
  ADVANCE_DAY: 'ADVANCE_DAY',
  UPDATE_ADVISOR_RELATION: 'UPDATE_ADVISOR_RELATION',
  UNLOCK_ADVISOR: 'UNLOCK_ADVISOR',
  PRESTIGE: 'PRESTIGE',
  PURCHASE_LEGACY_UPGRADE: 'PURCHASE_LEGACY_UPGRADE',
  SET_PATH: 'SET_PATH',
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
    
    case ACTIONS.START_EXPEDITION: {
      const { territoryId, cost } = action
      
      // Deduct costs
      const newResources = { ...state.resources }
      for (const [resource, amount] of Object.entries(cost)) {
        newResources[resource] = (newResources[resource] || 0) - amount
        if (newResources[resource] < 0) return state // Can't afford
      }
      
      return {
        ...state,
        resources: newResources,
        activeExpedition: {
          territoryId,
          startDay: state.day,
        },
      }
    }
    
    case ACTIONS.COMPLETE_EXPEDITION: {
      const { territoryId, rewards, loreFragment } = action
      const newResources = { ...state.resources }
      const newCaps = { ...state.resourceCaps }
      const newRates = { ...state.productionRates }
      
      // Apply rewards
      if (rewards) {
        Object.entries(rewards).forEach(([key, value]) => {
          if (key === 'capBonus') {
            Object.entries(value).forEach(([res, bonus]) => {
              newCaps[res] = (newCaps[res] || 0) + bonus
            })
          } else if (key === 'productionBonus') {
            Object.entries(value).forEach(([res, bonus]) => {
              newRates[res] = (newRates[res] || 0) + bonus
            })
          } else if (key !== 'unlocks') {
            newResources[key] = Math.min(
              (newResources[key] || 0) + value,
              newCaps[key] || Infinity
            )
          }
        })
      }
      
      // Discover lore if any
      const newLore = loreFragment && !state.discoveredLore.includes(loreFragment)
        ? [...state.discoveredLore, loreFragment]
        : state.discoveredLore
      
      const newNewLore = loreFragment && !state.discoveredLore.includes(loreFragment)
        ? [...(state.newLore || []), loreFragment]
        : state.newLore
      
      return {
        ...state,
        resources: newResources,
        resourceCaps: newCaps,
        productionRates: newRates,
        activeExpedition: null,
        discoveredTerritories: [...state.discoveredTerritories, territoryId],
        discoveredLore: newLore,
        newLore: newNewLore,
      }
    }
    
    case ACTIONS.DISCOVER_LORE: {
      const { loreId } = action
      if (state.discoveredLore.includes(loreId)) return state
      
      return {
        ...state,
        discoveredLore: [...state.discoveredLore, loreId],
        newLore: [...(state.newLore || []), loreId],
      }
    }
    
    case ACTIONS.UPDATE_ADVISOR_RELATION: {
      const { advisorId, change } = action
      const currentRelation = state.advisorRelations[advisorId] || 50
      const newRelation = Math.max(0, Math.min(100, currentRelation + change))
      
      return {
        ...state,
        advisorRelations: {
          ...state.advisorRelations,
          [advisorId]: newRelation,
        },
      }
    }
    
    case ACTIONS.UNLOCK_ADVISOR: {
      const { advisorId } = action
      if (state.unlockedAdvisors.includes(advisorId)) return state
      
      return {
        ...state,
        unlockedAdvisors: [...state.unlockedAdvisors, advisorId],
        advisorRelations: {
          ...state.advisorRelations,
          [advisorId]: 50,
        },
      }
    }
    
    case ACTIONS.SET_PATH:
      return {
        ...state,
        chosenPath: action.path,
      }
    
    case ACTIONS.PRESTIGE: {
      const { legacyPoints, ending } = action
      
      // Preserve legacy data
      const newLegacyPoints = (state.legacyPoints || 0) + legacyPoints
      const newPrestigeCount = state.prestigeCount + 1
      
      // Calculate starting lore from legacy upgrades
      const ancientKnowledgeLevel = state.legacyUpgrades?.ancientKnowledge || 0
      const startingLore = state.discoveredLore.slice(0, ancientKnowledgeLevel)
      
      return {
        ...createInitialState({
          prestigeCount: newPrestigeCount,
          legacyPoints: newLegacyPoints,
          legacyUpgrades: state.legacyUpgrades || {},
          startingLore,
        }),
        prestigeCount: newPrestigeCount,
        legacyPoints: newLegacyPoints,
        legacyUpgrades: state.legacyUpgrades || {},
        discoveredLore: startingLore,
      }
    }
    
    case ACTIONS.PURCHASE_LEGACY_UPGRADE: {
      const { upgradeId, cost } = action
      
      if ((state.legacyPoints || 0) < cost) return state
      
      const currentLevel = state.legacyUpgrades?.[upgradeId] || 0
      
      return {
        ...state,
        legacyPoints: (state.legacyPoints || 0) - cost,
        legacyUpgrades: {
          ...state.legacyUpgrades,
          [upgradeId]: currentLevel + 1,
        },
      }
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
  
  // Start expedition
  const startExpedition = useCallback((territoryId, cost) => {
    dispatch({ type: ACTIONS.START_EXPEDITION, territoryId, cost })
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: {
        type: 'info',
        message: 'Expedition dispatched. They will return with news.',
        duration: 3000,
      },
    })
  }, [])
  
  // Complete expedition
  const completeExpedition = useCallback((territoryId, rewards, loreFragment) => {
    dispatch({ type: ACTIONS.COMPLETE_EXPEDITION, territoryId, rewards, loreFragment })
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: {
        type: 'success',
        message: 'The expedition has returned!',
        duration: 4000,
      },
    })
  }, [])
  
  // Discover lore
  const discoverLore = useCallback((loreId) => {
    dispatch({ type: ACTIONS.DISCOVER_LORE, loreId })
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: {
        type: 'info',
        message: 'New lore discovered. Check the Codex.',
        duration: 3000,
      },
    })
  }, [])
  
  // Update advisor relationship
  const updateAdvisorRelation = useCallback((advisorId, change) => {
    dispatch({ type: ACTIONS.UPDATE_ADVISOR_RELATION, advisorId, change })
  }, [])
  
  // Unlock advisor
  const unlockAdvisor = useCallback((advisorId) => {
    dispatch({ type: ACTIONS.UNLOCK_ADVISOR, advisorId })
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: {
        type: 'success',
        message: 'A new advisor has joined your council.',
        duration: 4000,
      },
    })
  }, [])
  
  // Set chosen path
  const setPath = useCallback((path) => {
    dispatch({ type: ACTIONS.SET_PATH, path })
  }, [])
  
  // Prestige
  const prestige = useCallback((data) => {
    dispatch({ type: ACTIONS.PRESTIGE, ...data })
  }, [])
  
  // Purchase legacy upgrade
  const purchaseLegacyUpgrade = useCallback((upgradeId, cost) => {
    dispatch({ type: ACTIONS.PURCHASE_LEGACY_UPGRADE, upgradeId, cost })
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
      startExpedition,
      completeExpedition,
      discoverLore,
      updateAdvisorRelation,
      unlockAdvisor,
      setPath,
      prestige,
      purchaseLegacyUpgrade,
    },
  }
}

export { ACTIONS }
