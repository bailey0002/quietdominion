// Game balance constants
export const GAME_CONFIG = {
  // Time calculations
  TICK_INTERVAL: 1000, // 1 second per tick
  OFFLINE_MULTIPLIER: 0.5, // Offline progress is 50% of online
  MAX_OFFLINE_HOURS: 24, // Cap offline accumulation
  
  // Starting values
  INITIAL_RESOURCES: {
    food: 50,
    materials: 30,
    population: 5,
    influence: 0,
    knowledge: 0,
    legacy: 0,
  },
  
  // Resource caps (can be increased by structures)
  BASE_CAPS: {
    food: 200,
    materials: 150,
    population: 20,
    influence: 50,
    knowledge: 50,
    legacy: 100,
  },
  
  // Base production rates (per tick)
  BASE_RATES: {
    food: 0.1,
    materials: 0.05,
    population: 0, // Population grows via events
    influence: 0,
    knowledge: 0,
    legacy: 0,
  },
}

// Resource definitions with metadata
export const RESOURCES = {
  food: {
    id: 'food',
    name: 'Food',
    description: 'Sustenance for your people',
    icon: '🌾',
    color: 'moss',
    unlocked: true,
  },
  materials: {
    id: 'materials',
    name: 'Materials',
    description: 'Wood, stone, and metal for building',
    icon: '🪵',
    color: 'sepia',
    unlocked: true,
  },
  population: {
    id: 'population',
    name: 'Population',
    description: 'Souls who call this place home',
    icon: '👥',
    color: 'parchment',
    unlocked: true,
  },
  influence: {
    id: 'influence',
    name: 'Influence',
    description: 'Your reach and reputation',
    icon: '⚜️',
    color: 'gold',
    unlocked: false,
    unlockCondition: { population: 50 },
  },
  knowledge: {
    id: 'knowledge',
    name: 'Knowledge',
    description: 'Wisdom accumulated through study',
    icon: '📜',
    color: 'slate',
    unlocked: false,
    unlockCondition: { structures: ['library'] },
  },
  legacy: {
    id: 'legacy',
    name: 'Legacy',
    description: 'Permanent progress through prestige',
    icon: '✦',
    color: 'gold',
    unlocked: false,
    unlockCondition: { prestige: 1 },
  },
}

// Structure definitions
export const STRUCTURES = {
  campfire: {
    id: 'campfire',
    name: 'Campfire',
    description: 'A humble fire that draws wanderers to your settlement.',
    tier: 0,
    cost: {},
    effects: {
      populationGrowthChance: 0.01,
    },
    productionBonus: {},
    capBonus: {},
    unlocked: true,
    maxCount: 1,
    flavorText: 'The first light in the darkness.',
  },
  shelter: {
    id: 'shelter',
    name: 'Shelter',
    description: 'Basic protection from the elements.',
    tier: 1,
    cost: { materials: 20 },
    effects: {},
    productionBonus: {},
    capBonus: { population: 10 },
    unlocked: true,
    maxCount: 5,
    flavorText: 'Four walls and a roof. Enough.',
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    description: 'Tilled earth yields sustenance.',
    tier: 1,
    cost: { materials: 30, population: 2 },
    effects: {},
    productionBonus: { food: 0.2 },
    capBonus: { food: 100 },
    unlocked: true,
    maxCount: 10,
    flavorText: 'The soil here is rich.',
  },
  woodcutter: {
    id: 'woodcutter',
    name: "Woodcutter's Lodge",
    description: 'Skilled hands harvest timber from the forest.',
    tier: 1,
    cost: { food: 40, materials: 25 },
    effects: {},
    productionBonus: { materials: 0.15 },
    capBonus: { materials: 75 },
    unlocked: true,
    maxCount: 5,
    flavorText: 'The forest provides.',
  },
  storehouse: {
    id: 'storehouse',
    name: 'Storehouse',
    description: 'A place to keep your surplus safe.',
    tier: 2,
    cost: { materials: 60 },
    effects: {},
    productionBonus: {},
    capBonus: { food: 200, materials: 150 },
    unlocked: false,
    unlockCondition: { structures: { farm: 2 } },
    maxCount: 3,
    flavorText: 'Against the lean times.',
  },
  smithy: {
    id: 'smithy',
    name: 'Smithy',
    description: 'The ring of hammer on anvil brings progress.',
    tier: 2,
    cost: { materials: 80, population: 3 },
    effects: {
      structureDiscount: 0.1,
    },
    productionBonus: { materials: 0.1 },
    capBonus: {},
    unlocked: false,
    unlockCondition: { structures: { woodcutter: 1 } },
    maxCount: 2,
    flavorText: 'Metal shapes the future.',
  },
  tavern: {
    id: 'tavern',
    name: 'Tavern',
    description: 'A gathering place where stories are shared.',
    tier: 2,
    cost: { food: 100, materials: 50 },
    effects: {
      populationGrowthChance: 0.02,
      eventChanceBonus: 0.1,
    },
    productionBonus: {},
    capBonus: { population: 15 },
    unlocked: false,
    unlockCondition: { population: 15 },
    maxCount: 2,
    flavorText: 'Rumors travel far.',
  },
  library: {
    id: 'library',
    name: 'Library',
    description: 'Knowledge preserved for future generations.',
    tier: 3,
    cost: { materials: 120, population: 5 },
    effects: {
      unlocksKnowledge: true,
    },
    productionBonus: { knowledge: 0.05 },
    capBonus: { knowledge: 100 },
    unlocked: false,
    unlockCondition: { population: 30 },
    maxCount: 1,
    flavorText: 'What we learn, we keep.',
  },
}

// Advisor definitions
export const ADVISORS = {
  maren: {
    id: 'maren',
    name: 'Maren',
    title: 'The Practical',
    description: 'A weathered farmer who speaks plainly.',
    personality: 'pragmatic',
    portrait: '👩‍🌾',
    bias: { food: 1.2, materials: 1.0 },
    unlocked: true,
  },
  tomas: {
    id: 'tomas',
    name: 'Tomas',
    title: 'The Builder',
    description: 'A carpenter whose eyes see what could be.',
    personality: 'ambitious',
    portrait: '👨‍🔧',
    bias: { materials: 1.2, population: 1.1 },
    unlocked: true,
  },
  elara: {
    id: 'elara',
    name: 'Elara',
    title: 'The Keeper',
    description: 'A scholar who arrived with books but no coin.',
    personality: 'cautious',
    portrait: '👩‍🏫',
    bias: { knowledge: 1.3, influence: 1.1 },
    unlocked: false,
    unlockCondition: { structures: ['library'] },
  },
}

// Time of day descriptions
export const TIME_DESCRIPTIONS = {
  dawn: [
    'The first light spills across the valley.',
    'Mist rises from the fields as dawn breaks.',
    'The settlement stirs with the coming day.',
  ],
  morning: [
    'Morning smoke curls from cooking fires.',
    'The settlement hums with activity.',
    'Clear skies promise a productive day.',
  ],
  afternoon: [
    'The sun hangs high and warm.',
    'Shadows grow short beneath the midday sun.',
    'Work continues under the afternoon sky.',
  ],
  evening: [
    'Golden light softens the settlement.',
    'The day\'s work draws to a close.',
    'Evening brings a moment of rest.',
  ],
  night: [
    'Stars emerge above the quiet settlement.',
    'Fires flicker against the darkness.',
    'The settlement sleeps beneath a watchful moon.',
  ],
}

// Opening narrative sequence
export const OPENING_NARRATIVE = [
  {
    text: "The fire has gone out.",
    delay: 2000,
  },
  {
    text: "You don't remember how long you've been walking.",
    delay: 2500,
  },
  {
    text: "But here, in this forgotten valley, something remains.",
    delay: 2500,
  },
  {
    text: "Embers. Faint, but not yet cold.",
    delay: 2000,
  },
]

export const FIRST_ACTION_PROMPT = {
  text: "The embers wait.",
  action: "Stoke the Fire",
  effect: "Begin your dominion",
}
