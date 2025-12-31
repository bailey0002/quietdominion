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
    explorationTime: 3,
    discovered: false,
    narratives: [
      'Your scouts climb toward the ridge as morning mist parts around them.',
      'Stone outcroppings jut from the earth like broken teeth.',
      'From the summit, they see: a quarry, ancient and abandoned.',
    ],
    rewards: {
      materials: 50,
      capBonus: { materials: 100 },
      unlocks: ['quarry_structure'],
    },
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
      lore: 'old_watchtower',
      unlocks: ['watchtower_structure'],
    },
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
      unlocks: ['fishery_structure'],
    },
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
}
