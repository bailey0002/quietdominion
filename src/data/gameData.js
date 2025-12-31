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
    greetings: [
      "The soil doesn't lie. Neither do I.",
      "Another day. Let's make it count.",
      "I've been watching the fields...",
    ],
    farewells: [
      "Back to work, then.",
      "The crops won't tend themselves.",
      "We'll speak again.",
    ],
    approvalLines: [
      "A wise choice. Practical.",
      "This I can respect.",
      "You understand what matters.",
    ],
    disapprovalLines: [
      "Hmm. I hope you know what you're doing.",
      "The earth teaches patience. Perhaps you need the lesson.",
      "I'll hold my tongue. For now.",
    ],
    idleDialogue: [
      "The old songs say this valley was blessed once. I believe them.",
      "My grandmother farmed land like this. She'd have loved it here.",
      "Rain's coming. I can smell it.",
      "We have enough. But 'enough' has a way of becoming 'not enough.'",
    ],
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
    greetings: [
      "I've been sketching. Want to see?",
      "Every day I see more potential here.",
      "The settlement grows. As it should.",
    ],
    farewells: [
      "I'll be at the workshop.",
      "There's always more to build.",
      "Until next time.",
    ],
    approvalLines: [
      "Now we're talking!",
      "Vision! That's what this place needs.",
      "I knew you'd see it my way.",
    ],
    disapprovalLines: [
      "Playing it safe again, I see.",
      "Small thinking leads to small outcomes.",
      "Fine. But remember this moment.",
    ],
    idleDialogue: [
      "Picture it: watchtowers on every ridge. A wall around the valley.",
      "Wood and stone. Simple materials. Infinite possibilities.",
      "My father built ships. I build futures.",
      "The eastern ridge would be perfect for a quarry. Just saying.",
    ],
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
    greetings: [
      "I've found something in the texts...",
      "Knowledge is never idle. Neither am I.",
      "A moment of your time?",
    ],
    farewells: [
      "The books await.",
      "I'll be in the library.",
      "Think on what I've said.",
    ],
    approvalLines: [
      "Wisdom guides your hand.",
      "This is the path of understanding.",
      "History will remember this choice.",
    ],
    disapprovalLines: [
      "Hasty. Very hasty.",
      "The ancients would counsel patience.",
      "I pray you're right.",
    ],
    idleDialogue: [
      "The symbols on the boundary stones... I've seen them before. Somewhere.",
      "Whoever lived here before us—they left in peace. But why?",
      "Knowledge isn't just power. It's survival.",
      "There are gaps in the histories. Deliberate ones, I think.",
    ],
  },
  corvus: {
    id: 'corvus',
    name: 'Corvus',
    title: 'The Wanderer',
    description: 'A trader who knows paths others have forgotten.',
    personality: 'mysterious',
    portrait: '🧔',
    bias: { influence: 1.3, materials: 0.9 },
    unlocked: false,
    unlockCondition: { day: 50, influence: 20 },
    greetings: [
      "Word of your dominion spreads far.",
      "I bring news from beyond the valley.",
      "Interesting times, aren't they?",
    ],
    farewells: [
      "The roads call.",
      "We'll meet again. We always do.",
      "Watch the horizons.",
    ],
    approvalLines: [
      "Shrewd. Very shrewd.",
      "You understand how the world works.",
      "Perhaps you'll go far after all.",
    ],
    disapprovalLines: [
      "Isolated thinking. Dangerous.",
      "The valley is not the world.",
      "Remember: others are watching.",
    ],
    idleDialogue: [
      "There are other settlements. Some thriving. Some... not.",
      "Trade routes are lifelines. Never forget that.",
      "I've walked paths you've never dreamed of.",
      "The world beyond this valley is changing. Faster than you know.",
    ],
  },
}

// Advisor relationship thresholds
export const ADVISOR_RELATIONSHIP = {
  hostile: { min: 0, max: 19, label: 'Hostile' },
  wary: { min: 20, max: 39, label: 'Wary' },
  neutral: { min: 40, max: 59, label: 'Neutral' },
  friendly: { min: 60, max: 79, label: 'Friendly' },
  devoted: { min: 80, max: 100, label: 'Devoted' },
}

// Get relationship level from score
export const getRelationshipLevel = (score) => {
  for (const [level, range] of Object.entries(ADVISOR_RELATIONSHIP)) {
    if (score >= range.min && score <= range.max) {
      return { level, ...range }
    }
  }
  return { level: 'neutral', ...ADVISOR_RELATIONSHIP.neutral }
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

// Prestige system configuration
export const PRESTIGE_CONFIG = {
  // Minimum requirements to prestige
  requirements: {
    day: 50,
    population: 75,
    totalStructures: 15,
  },
  
  // Legacy points earned based on achievements
  legacyFormula: {
    basePoints: 10,
    perPopulation: 0.5,
    perStructure: 2,
    perTerritory: 5,
    perLore: 3,
    dayBonus: 0.1, // Bonus for completing faster
  },
  
  // Legacy upgrades purchasable between runs
  legacyUpgrades: {
    quickStart: {
      id: 'quickStart',
      name: 'Remembered Ways',
      description: 'Begin with additional starting resources.',
      cost: 10,
      maxLevel: 5,
      effect: { startingResources: 0.2 }, // +20% per level
    },
    efficientBuilders: {
      id: 'efficientBuilders',
      name: 'Efficient Builders',
      description: 'Structures cost less to build.',
      cost: 15,
      maxLevel: 3,
      effect: { structureCostReduction: 0.1 }, // -10% per level
    },
    ancientKnowledge: {
      id: 'ancientKnowledge',
      name: 'Ancient Knowledge',
      description: 'Start with lore already discovered.',
      cost: 20,
      maxLevel: 3,
      effect: { startingLore: 1 }, // +1 lore per level
    },
    famedSettlement: {
      id: 'famedSettlement',
      name: 'Famed Settlement',
      description: 'Wanderers arrive more frequently.',
      cost: 12,
      maxLevel: 4,
      effect: { populationGrowth: 0.15 }, // +15% per level
    },
    abundantLand: {
      id: 'abundantLand',
      name: 'Abundant Land',
      description: 'Higher resource production rates.',
      cost: 18,
      maxLevel: 5,
      effect: { productionBonus: 0.1 }, // +10% per level
    },
  },
}

// Endings based on path and achievements
export const ENDINGS = {
  prosperity: {
    id: 'prosperity',
    name: 'The Golden Valley',
    description: 'Your dominion became a beacon of abundance.',
    requirements: {
      path: 'prosperity',
      population: 150,
      food: 1000,
    },
    narrative: [
      "Seasons turn. Years pass. The valley flourishes.",
      "Travelers speak of the settlement in hushed, reverent tones.",
      "Not for its size, but for its peace. Its plenty.",
      "You have built something that will outlast you.",
      "And perhaps that was always the point.",
    ],
    legacyBonus: 25,
  },
  expansion: {
    id: 'expansion',
    name: 'The Spreading Dominion',
    description: 'Your influence stretched beyond the valley.',
    requirements: {
      path: 'expansion',
      population: 200,
      territories: 5,
    },
    narrative: [
      "The valley was only the beginning.",
      "Settlement after settlement rose under your guidance.",
      "Maps are redrawn. Borders shift.",
      "Your quiet dominion is quiet no longer.",
      "But the fire still burns at its heart.",
    ],
    legacyBonus: 30,
  },
  knowledge: {
    id: 'knowledge',
    name: 'The Remembered Truth',
    description: 'You uncovered the valley\'s ancient secrets.',
    requirements: {
      path: 'knowledge',
      knowledge: 200,
      lore: 10,
    },
    narrative: [
      "The texts revealed their secrets, one by one.",
      "You learned who came before. Why they left.",
      "And what they hoped would come after.",
      "Now you carry that knowledge forward.",
      "The quiet dominion becomes a quiet legacy.",
    ],
    legacyBonus: 35,
  },
  balanced: {
    id: 'balanced',
    name: 'The Steady Hand',
    description: 'Through wisdom and patience, you endured.',
    requirements: {
      population: 100,
      day: 100,
    },
    narrative: [
      "No grand conquest. No legendary discovery.",
      "Just a settlement that grew, and grew well.",
      "The people are fed. The stores are full.",
      "Children play where once there was only ash.",
      "This is victory enough.",
    ],
    legacyBonus: 20,
  },
}
