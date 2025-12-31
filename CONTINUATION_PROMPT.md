# The Quiet Dominion - Development Continuation Prompt

Use this prompt to continue development in a new Claude session.

---

## Context Prompt

```
I'm developing "The Quiet Dominion" - a text-forward incremental strategy web game inspired by A Dark Room. The game is built with React + Vite + Tailwind CSS and is designed for simplified graphics but deep engagement.

## Current State (v0.2.0 - Phase 3 Complete)

### Core Mechanics Implemented:
- **Resource System**: Food, Materials, Population with production rates and caps
- **Structure Building**: 8 base structures + 6 exploration-unlocked structures with tier progression
- **Event System**: 20+ events and dilemmas with branching choices and consequences
- **Advisor System**: 4 advisors (Maren, Tomas, Elara, Corvus) with relationship tracking and contextual dialogue
- **Exploration**: 7 territories with expedition mechanics, costs, and rewards
- **Lore Codex**: 12 lore fragments revealing the valley's mystery
- **Prestige System**: "Found New Dominion" with 4 endings and 5 legacy upgrades
- **Audio System**: Web Audio API synthesized sounds and ambient fire/wind
- **Settings**: Mute, ambient toggle, prestige access, full reset

### Project Structure:
```
quiet-dominion/
├── src/
│   ├── components/
│   │   ├── AdvisorPanel.jsx      # Advisor dialogue and relationships
│   │   ├── EndingCinematic.jsx   # Prestige ending sequence
│   │   ├── EventModal.jsx        # Event/dilemma popup
│   │   ├── ExplorationPanel.jsx  # Territory exploration
│   │   ├── GameHeader.jsx        # Day counter, save, settings
│   │   ├── GameView.jsx          # Main game layout with tabs
│   │   ├── IntroSequence.jsx     # Opening typewriter narrative
│   │   ├── LoreCodex.jsx         # Discovered lore browser
│   │   ├── NarrativeDisplay.jsx  # Dynamic atmospheric text
│   │   ├── NotificationStack.jsx # Toast notifications
│   │   ├── PrestigeSystem.jsx    # Prestige modal and upgrades
│   │   ├── ResourcePanel.jsx     # Resource bars
│   │   ├── SettingsModal.jsx     # Audio and game settings
│   │   ├── StructurePanel.jsx    # Building cards
│   │   └── TitleScreen.jsx       # Main menu
│   ├── hooks/
│   │   ├── useAudio.js           # Web Audio synthesis
│   │   ├── useEventSystem.js     # Event triggering logic
│   │   ├── useExpeditionSystem.js # Expedition management
│   │   └── useGameState.js       # Core state reducer
│   ├── data/
│   │   ├── events.js             # Events, territories, lore
│   │   └── gameData.js           # Structures, advisors, config
│   ├── styles/
│   │   └── index.css             # Tailwind + custom styles
│   ├── App.jsx                   # Main app with phase management
│   └── main.jsx                  # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Tech Stack:
- React 18 with hooks (useReducer for state)
- Vite for bundling
- Tailwind CSS with custom theme (parchment, ink, sepia, moss, gold, rust colors)
- localStorage for persistence
- Web Audio API for sound (no external audio files)
- Pure client-side (no backend)

### Design Philosophy:
- Text-forward UI with minimal graphics
- Atmospheric, literary tone
- Respect player time (offline progress)
- Meaningful choices with consequences
- Progressive revelation of mystery
- "Simple to learn, deep to master, always progressing"

### What Could Be Added Next:
1. **More Events** - Expand random event pool (currently ~20)
2. **Trading System** - Use trading post for resource exchange
3. **Seasonal Cycles** - Weather affecting production
4. **Achievement System** - Tracked accomplishments
5. **Multiple Save Slots** - Different runs
6. **Tutorial Overlay** - First-time player guidance
7. **Statistics Page** - Lifetime stats across prestiges
8. **Mobile Optimization** - Touch targets and responsive polish
9. **Accessibility** - Keyboard navigation, screen reader support
10. **Content Expansion** - More structures, advisors, lore, endings

I have the source code available. What would you like to work on?
```

---

## Key Files Reference

**Game State (useGameState.js)**: Core reducer with actions for resources, structures, events, exploration, advisors, prestige

**Events Data (events.js)**: EVENTS, DILEMMAS, TERRITORIES, LORE, EXPLORATION_STRUCTURES objects

**Game Config (gameData.js)**: GAME_CONFIG, RESOURCES, STRUCTURES, ADVISORS, PRESTIGE_CONFIG, ENDINGS

**Styling**: Tailwind with custom colors (parchment, ink, sepia, moss, gold, rust, ember, slate) and fonts (Cinzel display, Crimson Text body, JetBrains Mono)

---

## Deployment

```bash
# Local development
npm install
npm run dev

# Production build
npm run build
# Deploy dist/ folder to any static host (Netlify, Vercel, GitHub Pages)
```
