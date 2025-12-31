// Events that can trigger during gameplay
export const EVENTS = {
  // Early game events
  wanderer_arrives: {
    id: 'wanderer_arrives',
    title: 'A Wanderer Approaches',
    description: 'A lone figure emerges from the treeline, drawn by your fire.',
    conditions: {
      minDay: 2,
      minPopulation: 5,
      maxPopulation: 30,
    },
    weight: 1.0,
    choices: [
      {
        text: 'Welcome them warmly',
        effects: { population: 1, food: -10 },
        outcome: 'The wanderer accepts your hospitality. Another soul joins your settlement.',
      },
      {
        text: 'Ask what skills they bring',
        effects: { population: 1, materials: 5 },
        outcome: 'A carpenter by trade. They join you, grateful for purpose.',
      },
      {
        text: 'Turn them away',
        effects: {},
        outcome: 'The wanderer moves on. Perhaps for the best.',
      },
    ],
  },
  
  good_harvest: {
    id: 'good_harvest',
    title: 'Bountiful Yield',
    description: 'The fields have produced beyond expectation.',
    conditions: {
      minDay: 5,
      requiredStructures: ['farm'],
    },
    weight: 0.8,
    choices: [
      {
        text: 'Store the surplus',
        effects: { food: 50 },
        outcome: 'The storehouse fills. Winter will be kinder.',
      },
      {
        text: 'Feast to celebrate',
        effects: { food: 20, population: 1 },
        outcome: 'Word of your prosperity spreads. A family arrives seeking a new home.',
      },
    ],
  },
  
  traders_pass: {
    id: 'traders_pass',
    title: 'Traveling Merchants',
    description: 'A small caravan has stopped at your settlement.',
    conditions: {
      minDay: 10,
      minPopulation: 15,
    },
    weight: 0.7,
    choices: [
      {
        text: 'Trade food for materials',
        effects: { food: -40, materials: 30 },
        outcome: 'A fair exchange. The merchants move on.',
      },
      {
        text: 'Trade materials for food',
        effects: { materials: -30, food: 40 },
        outcome: 'Grain and preserved meats fill your stores.',
      },
      {
        text: 'Invite them to stay the night',
        effects: { food: -15, influence: 5 },
        outcome: 'They leave at dawn, promising to speak well of your hospitality.',
      },
    ],
  },
  
  forest_discovery: {
    id: 'forest_discovery',
    title: 'Discovery in the Woods',
    description: 'Woodcutters have found something unusual in the forest.',
    conditions: {
      minDay: 7,
      requiredStructures: ['woodcutter'],
    },
    weight: 0.6,
    choices: [
      {
        text: 'Investigate personally',
        effects: {},
        outcome: 'An ancient marker stone, worn by time. What it once marked is long forgotten.',
        unlocks: { lore: 'ancient_marker' },
      },
      {
        text: 'Send workers to clear the area',
        effects: { materials: 25 },
        outcome: 'The clearing yields good timber and something more—the foundation of an old structure.',
      },
    ],
  },
  
  harsh_weather: {
    id: 'harsh_weather',
    title: 'Storm on the Horizon',
    description: 'Dark clouds gather. A storm approaches.',
    conditions: {
      minDay: 8,
    },
    weight: 0.5,
    choices: [
      {
        text: 'Prepare defenses',
        effects: { materials: -20 },
        outcome: 'The storm passes. Your preparations held.',
      },
      {
        text: 'Trust in your structures',
        effects: {},
        outcome: 'Some damage, but nothing catastrophic. The settlement endures.',
        randomOutcome: {
          chance: 0.3,
          badEffects: { materials: -15, food: -10 },
          badOutcome: 'The storm proves fierce. Supplies are lost.',
        },
      },
    ],
  },
  
  maren_counsel: {
    id: 'maren_counsel',
    title: 'Maren Seeks Audience',
    description: 'Your practical advisor has concerns to share.',
    conditions: {
      minDay: 5,
      unlockedAdvisors: ['maren'],
    },
    weight: 0.4,
    advisor: 'maren',
    choices: [
      {
        text: 'Hear her out',
        effects: {},
        outcome: '"We should focus on the essentials," she says. "Food and shelter before ambition."',
        dialogue: [
          '"The settlement grows, but we must not outpace our supplies."',
          '"I\'ve seen communities fail from reaching too far, too fast."',
          '"Steady hands build lasting foundations."',
        ],
      },
    ],
  },
  
  tomas_vision: {
    id: 'tomas_vision',
    title: 'Tomas Has Plans',
    description: 'The builder approaches with sketches in hand.',
    conditions: {
      minDay: 8,
      minStructureCount: 3,
      unlockedAdvisors: ['tomas'],
    },
    weight: 0.4,
    advisor: 'tomas',
    choices: [
      {
        text: 'Review his designs',
        effects: {},
        outcome: 'Ambitious plans for expansion. Perhaps too ambitious. Perhaps exactly right.',
        dialogue: [
          '"Look here—if we redirect the stream, we could power a mill."',
          '"The eastern ridge would make a perfect site for a watchtower."',
          '"This settlement could be a town. A city, even. I see it clearly."',
        ],
      },
    ],
  },
}

// Dilemmas - larger decisions with significant consequences
export const DILEMMAS = {
  northern_settlers: {
    id: 'northern_settlers',
    title: 'Distant Plea',
    description: 'Word reaches you: settlers to the north face hardship. They request aid.',
    conditions: {
      minDay: 20,
      minFood: 200,
      minPopulation: 30,
    },
    weight: 0.3,
    consequence_delay: 10, // Effects play out over days
    choices: [
      {
        text: 'Send supplies (-100 Food)',
        effects: { food: -100 },
        outcome: 'A significant portion of your stores departs northward.',
        delayed_effects: {
          influence: 15,
          population: 3,
        },
        delayed_outcome: 'The northern settlers remember your generosity. Some join your settlement.',
      },
      {
        text: 'Offer shelter instead',
        effects: { food: -50 },
        outcome: 'You invite them to join your settlement.',
        delayed_effects: {
          population: 8,
          food: -30,
        },
        delayed_outcome: 'Families arrive from the north. Your settlement grows, but so do its needs.',
      },
      {
        text: 'Decline—we have our own to care for',
        effects: {},
        outcome: 'A difficult choice, but perhaps a necessary one.',
        delayed_effects: {
          influence: -5,
        },
        delayed_outcome: 'Rumors of your refusal spread quietly. Some question your leadership.',
      },
    ],
  },
  
  expansion_choice: {
    id: 'expansion_choice',
    title: 'The Question of Growth',
    description: 'Your advisors debate the path forward. The settlement stands at a crossroads.',
    conditions: {
      minDay: 30,
      minPopulation: 50,
      minStructureCount: 8,
    },
    weight: 0.2,
    choices: [
      {
        text: 'Focus on prosperity—we grow what we have',
        effects: {},
        outcome: 'A path of consolidation. Quality over quantity.',
        sets_path: 'prosperity',
        path_effects: {
          productionMultiplier: 1.2,
          capMultiplier: 0.8,
        },
      },
      {
        text: 'Push outward—there is more to claim',
        effects: {},
        outcome: 'A path of expansion. The dominion will spread.',
        sets_path: 'expansion',
        path_effects: {
          productionMultiplier: 0.9,
          capMultiplier: 1.3,
        },
      },
      {
        text: 'Seek knowledge—understanding before action',
        effects: {},
        outcome: 'A path of wisdom. Let learning guide growth.',
        sets_path: 'knowledge',
        path_effects: {
          knowledgeMultiplier: 1.5,
        },
        requires: { structures: ['library'] },
      },
    ],
  },
}

// Exploration data
export const TERRITORIES = {
  eastern_ridge: {
    id: 'eastern_ridge',
    name: 'The Eastern Ridge',
    description: 'Rocky highlands visible from your settlement.',
    explorationCost: { food: 30, materials: 10 },
    explorationTime: 3, // in-game days
    discovered: false,
    narratives: [
      'Your scouts climb toward the ridge as morning mist parts around them.',
      'Stone outcroppings jut from the earth like broken teeth.',
      'From the summit, they see: a quarry, ancient and abandoned.',
    ],
    rewards: {
      materials: 50,
      capBonus: { materials: 100 },
      unlocks: ['quarry'],
    },
    loreFragment: 'ancient_quarry',
  },
  
  dark_forest: {
    id: 'dark_forest',
    name: 'The Deep Woods',
    description: 'Dense forest to the west, unexplored and quiet.',
    explorationCost: { food: 50, materials: 20 },
    explorationTime: 5,
    discovered: false,
    narratives: [
      'The forest swallows sound. Your scouts move carefully.',
      'Ancient trees tower overhead, their canopy blocking the sun.',
      'In a clearing, they find: ruins of a watchtower, vines claiming stone.',
    ],
    rewards: {
      knowledge: 20,
      unlocks: ['watchtower'],
    },
    loreFragment: 'old_watchtower',
  },
  
  river_delta: {
    id: 'river_delta',
    name: 'The River Delta',
    description: 'Where the valley stream meets wider waters.',
    explorationCost: { food: 40, materials: 30 },
    explorationTime: 4,
    discovered: false,
    narratives: [
      'Following the stream southward, your scouts reach marshland.',
      'The delta spreads before them, rich with life.',
      'Fish schools glint beneath the surface. This could feed many.',
    ],
    rewards: {
      food: 80,
      capBonus: { food: 150 },
      productionBonus: { food: 0.1 },
      unlocks: ['fishery'],
    },
    loreFragment: null,
  },
  
  northern_pass: {
    id: 'northern_pass',
    name: 'The Northern Pass',
    description: 'A gap in the mountains leading to lands unknown.',
    explorationCost: { food: 80, materials: 50 },
    explorationTime: 7,
    discovered: false,
    requires: { day: 30 },
    narratives: [
      'The pass is treacherous. Snow lingers even in summer.',
      'Your scouts press on, breath misting in the cold.',
      'Beyond the pass: a vast plain, and distant smoke. Others live here.',
    ],
    rewards: {
      influence: 30,
      unlocks: ['trading_post'],
    },
    loreFragment: 'northern_peoples',
    enablesTrading: true,
  },
  
  sunken_ruins: {
    id: 'sunken_ruins',
    name: 'The Sunken Ruins',
    description: 'Half-drowned structures glimpsed through reeds.',
    explorationCost: { food: 60, materials: 40, knowledge: 10 },
    explorationTime: 6,
    discovered: false,
    requires: { structures: ['library'] },
    narratives: [
      'The ruins emerge from still water like bones from earth.',
      'Your scholars wade carefully, preserving what they find.',
      'This was a place of learning once. The stones remember.',
    ],
    rewards: {
      knowledge: 50,
      capBonus: { knowledge: 100 },
    },
    loreFragment: 'sunken_academy',
  },
  
  obsidian_caves: {
    id: 'obsidian_caves',
    name: 'The Obsidian Caves',
    description: 'Dark openings in the cliff face, gleaming faintly.',
    explorationCost: { food: 70, materials: 60 },
    explorationTime: 5,
    discovered: false,
    requires: { structures: ['smithy'] },
    narratives: [
      'The caves breathe cold air. Torchlight catches volcanic glass.',
      'Deeper, your scouts find worked stone. This was a mine.',
      'Veins of ore line the walls. Untouched for generations.',
    ],
    rewards: {
      materials: 100,
      productionBonus: { materials: 0.15 },
      unlocks: ['deep_mine'],
    },
    loreFragment: 'obsidian_miners',
  },
  
  wanderers_shrine: {
    id: 'wanderers_shrine',
    name: "The Wanderer's Shrine",
    description: 'A place of pilgrimage, marked on no map.',
    explorationCost: { food: 50, influence: 15 },
    explorationTime: 4,
    discovered: false,
    requires: { unlockedAdvisors: ['corvus'] },
    narratives: [
      'Corvus leads the way. He alone knows this path.',
      'The shrine is small but ancient. Offerings line its base.',
      'Those who travel far leave something here. And take something too.',
    ],
    rewards: {
      influence: 40,
      population: 5,
    },
    loreFragment: 'wanderer_faith',
    specialEvent: 'shrine_blessing',
  },
}

// Lore fragments discovered through play
export const LORE = {
  ancient_marker: {
    id: 'ancient_marker',
    title: 'The Boundary Stone',
    content: 'Once, this land was claimed. The marker bears symbols worn beyond reading—but its placement suggests careful measurement. Someone surveyed this valley. Long ago.',
    discovered: false,
  },
  old_watchtower: {
    id: 'old_watchtower',
    title: 'The Abandoned Watch',
    content: 'The tower fell not to violence but to time. Its builders left peacefully, it seems. But what did they watch for? And why did they stop?',
    discovered: false,
  },
  ancient_quarry: {
    id: 'ancient_quarry',
    title: 'The Silent Quarry',
    content: 'Tools still lean against the stone, as if their owners stepped away for lunch and never returned. The cuts in the rock face are precise—masterwork.',
    discovered: false,
  },
  northern_peoples: {
    id: 'northern_peoples',
    title: 'Beyond the Mountains',
    content: 'The northern folk remember the valley-dwellers. "They were here before us," the elders say. "Then one summer, they walked away. All of them. Together."',
    discovered: false,
  },
  sunken_academy: {
    id: 'sunken_academy',
    title: 'The Drowned School',
    content: 'Waterlogged texts speak of a "gathering" and a "departure." The scholars here prepared for something. A journey? An ending? The water has claimed the answers.',
    discovered: false,
  },
  obsidian_miners: {
    id: 'obsidian_miners',
    title: 'The Deep Workers',
    content: 'Mine carts still sit on rusted rails. Bunks line one wall, personal effects undisturbed. They left mid-shift. All of them. The ore they sought remains.',
    discovered: false,
  },
  wanderer_faith: {
    id: 'wanderer_faith',
    title: 'The Road-Walkers',
    content: 'The shrine honors those who "walk between." Corvus calls them the first travelers. "They believed," he says, "that to stop moving was to die."',
    discovered: false,
  },
  the_departure: {
    id: 'the_departure',
    title: 'The Great Departure',
    content: 'Elara pieces it together from fragments: an entire civilization, thousands strong, simply... left. Not fleeing. Not conquered. Chosen. Deliberate. But for where? And why?',
    discovered: false,
    requires: { loreCount: 5 },
  },
  the_quiet: {
    id: 'the_quiet',
    title: 'The Quiet',
    content: 'The oldest texts name this valley "The Quiet." Not for its silence, but for what it promises: rest. An end to wandering. The final fire before sleep.',
    discovered: false,
    requires: { loreCount: 7 },
  },
}

// Additional structures unlocked by exploration
export const EXPLORATION_STRUCTURES = {
  quarry: {
    id: 'quarry',
    name: 'Quarry',
    description: 'Ancient stone-cutting operation, restored to function.',
    tier: 3,
    cost: { materials: 100, population: 5 },
    effects: {},
    productionBonus: { materials: 0.25 },
    capBonus: { materials: 200 },
    unlocked: false,
    unlockCondition: { territories: ['eastern_ridge'] },
    maxCount: 1,
    flavorText: 'The old masters knew their craft.',
  },
  watchtower: {
    id: 'watchtower',
    name: 'Watchtower',
    description: 'Eyes on the horizon, warning of what approaches.',
    tier: 3,
    cost: { materials: 80, food: 40 },
    effects: {
      eventWarning: true,
      explorationBonus: 0.2,
    },
    productionBonus: {},
    capBonus: {},
    unlocked: false,
    unlockCondition: { territories: ['dark_forest'] },
    maxCount: 3,
    flavorText: 'Some things are best seen from afar.',
  },
  fishery: {
    id: 'fishery',
    name: 'Fishery',
    description: 'Nets and weirs bring bounty from the waters.',
    tier: 3,
    cost: { materials: 60, food: 30 },
    effects: {},
    productionBonus: { food: 0.3 },
    capBonus: { food: 100 },
    unlocked: false,
    unlockCondition: { territories: ['river_delta'] },
    maxCount: 2,
    flavorText: 'The delta provides.',
  },
  trading_post: {
    id: 'trading_post',
    name: 'Trading Post',
    description: 'A waystation for merchants traveling the northern route.',
    tier: 4,
    cost: { materials: 150, food: 100, influence: 20 },
    effects: {
      enablesTrading: true,
      influenceGain: 0.05,
    },
    productionBonus: { influence: 0.1 },
    capBonus: { influence: 50 },
    unlocked: false,
    unlockCondition: { territories: ['northern_pass'] },
    maxCount: 1,
    flavorText: 'Coin and goods flow both ways.',
  },
  deep_mine: {
    id: 'deep_mine',
    name: 'Deep Mine',
    description: 'Shafts descending into rich ore veins.',
    tier: 4,
    cost: { materials: 200, population: 10 },
    effects: {},
    productionBonus: { materials: 0.4 },
    capBonus: { materials: 300 },
    unlocked: false,
    unlockCondition: { territories: ['obsidian_caves'] },
    maxCount: 1,
    flavorText: 'The earth holds treasures for those who dig.',
  },
  archive: {
    id: 'archive',
    name: 'Archive',
    description: 'A repository of recovered knowledge.',
    tier: 4,
    cost: { materials: 120, knowledge: 50 },
    effects: {
      loreDiscoveryBonus: 0.2,
    },
    productionBonus: { knowledge: 0.15 },
    capBonus: { knowledge: 150 },
    unlocked: false,
    unlockCondition: { territories: ['sunken_ruins'] },
    maxCount: 1,
    flavorText: 'What was lost can be remembered.',
  },
}
