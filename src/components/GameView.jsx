import { useState } from 'react'
import { GameHeader } from './GameHeader'
import { NarrativeDisplay } from './NarrativeDisplay'
import { ResourcePanel } from './ResourcePanel'
import { StructurePanel } from './StructurePanel'
import { AdvisorPanel } from './AdvisorPanel'
import { ExplorationPanel } from './ExplorationPanel'
import { LoreCodex } from './LoreCodex'
import { EventModal } from './EventModal'
import { NotificationStack } from './NotificationStack'
import { PrestigeModal } from './PrestigeSystem'
import { useExpeditionSystem } from '../hooks/useExpeditionSystem'

// Tab navigation for different game sections
const TABS = {
  SETTLEMENT: 'settlement',
  EXPLORATION: 'exploration',
  CODEX: 'codex',
}

export function GameView({ gameState, actions }) {
  const [activeTab, setActiveTab] = useState(TABS.SETTLEMENT)
  const [showPrestige, setShowPrestige] = useState(false)
  
  // Initialize expedition system
  const expeditionSystem = useExpeditionSystem(gameState, actions)
  
  const handleSave = () => {
    actions.saveGame()
    actions.addNotification({
      type: 'success',
      message: 'Game saved.',
      duration: 2000,
    })
  }
  
  const handleSettings = () => {
    // Show prestige option if requirements might be met
    if (gameState.day >= 30) {
      setShowPrestige(true)
    }
  }
  
  const handlePrestige = (data) => {
    actions.prestige(data)
    setShowPrestige(false)
  }
  
  const handleStartExpedition = (territoryId) => {
    expeditionSystem.startExpedition(territoryId)
  }
  
  // Tab button component
  const TabButton = ({ tab, label, hasNotification }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        relative px-4 py-2 font-display text-xs tracking-widest uppercase
        transition-all duration-300 rounded-t
        ${activeTab === tab 
          ? 'bg-sepia/20 text-parchment border-b-2 border-gold' 
          : 'text-sepia/60 hover:text-sepia hover:bg-sepia/10'
        }
      `}
    >
      {label}
      {hasNotification && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse" />
      )}
    </button>
  )
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <GameHeader 
        day={gameState.day}
        onSave={handleSave}
        onSettings={handleSettings}
      />
      
      {/* Main content */}
      <main className="pt-16 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Narrative section - always visible */}
          <section className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <NarrativeDisplay gameState={gameState} />
          </section>
          
          {/* Tab navigation */}
          <div className="flex gap-1 mb-6 border-b border-sepia/20">
            <TabButton tab={TABS.SETTLEMENT} label="Settlement" />
            <TabButton 
              tab={TABS.EXPLORATION} 
              label="Exploration"
              hasNotification={gameState.activeExpedition !== null}
            />
            <TabButton 
              tab={TABS.CODEX} 
              label="Codex"
              hasNotification={(gameState.newLore?.length || 0) > 0}
            />
          </div>
          
          {/* Tab content */}
          {activeTab === TABS.SETTLEMENT && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                {/* Resources */}
                <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <ResourcePanel
                    resources={gameState.resources}
                    caps={gameState.resourceCaps}
                    rates={gameState.productionRates}
                  />
                </section>
                
                {/* Advisors */}
                <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <AdvisorPanel
                    unlockedAdvisors={gameState.unlockedAdvisors}
                    advisorRelations={gameState.advisorRelations}
                    gameState={gameState}
                  />
                </section>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                {/* Structures */}
                <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <StructurePanel
                    structures={gameState.structures}
                    structureUnlocks={gameState.structureUnlocks}
                    canAffordStructure={actions.canAffordStructure}
                    onBuild={actions.buildStructure}
                  />
                </section>
              </div>
            </div>
          )}
          
          {activeTab === TABS.EXPLORATION && (
            <section className="animate-fade-in">
              <ExplorationPanel
                gameState={gameState}
                discoveredTerritories={gameState.discoveredTerritories}
                activeExpedition={gameState.activeExpedition}
                onStartExpedition={handleStartExpedition}
              />
            </section>
          )}
          
          {activeTab === TABS.CODEX && (
            <section className="animate-fade-in">
              <LoreCodex
                discoveredLore={gameState.discoveredLore}
                newLore={gameState.newLore}
              />
            </section>
          )}
          
          {/* Legacy info if prestiged */}
          {gameState.prestigeCount > 0 && (
            <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display text-sm text-gold">
                    Legacy #{gameState.prestigeCount}
                  </span>
                  <p className="font-body text-xs text-sepia/60">
                    Your wisdom carries forward
                  </p>
                </div>
                <span className="font-display text-lg text-gold">
                  {gameState.legacyPoints || 0} ✦
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Event modal */}
      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          onResolve={actions.resolveEvent}
        />
      )}
      
      {/* Prestige modal */}
      {showPrestige && (
        <PrestigeModal
          gameState={gameState}
          onPrestige={handlePrestige}
          onClose={() => setShowPrestige(false)}
        />
      )}
      
      {/* Notifications */}
      <NotificationStack
        notifications={gameState.notifications}
        onDismiss={actions.dismissNotification}
      />
    </div>
  )
}
