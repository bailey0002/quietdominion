import { GameHeader } from './GameHeader'
import { NarrativeDisplay } from './NarrativeDisplay'
import { ResourcePanel } from './ResourcePanel'
import { StructurePanel } from './StructurePanel'
import { EventModal } from './EventModal'
import { NotificationStack } from './NotificationStack'

export function GameView({ gameState, actions }) {
  const handleSave = () => {
    actions.saveGame()
    actions.addNotification({
      type: 'success',
      message: 'Game saved.',
      duration: 2000,
    })
  }
  
  const handleSettings = () => {
    // TODO: Implement settings modal
    console.log('Settings clicked')
  }
  
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Narrative section */}
          <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <NarrativeDisplay gameState={gameState} />
          </section>
          
          {/* Two column layout for resources and structures */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resources */}
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ResourcePanel
                resources={gameState.resources}
                caps={gameState.resourceCaps}
                rates={gameState.productionRates}
              />
            </section>
            
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
          
          {/* Future: Advisors panel */}
          {/* Future: Exploration panel */}
          {/* Future: Lore/codex panel */}
        </div>
      </main>
      
      {/* Event modal */}
      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          onResolve={actions.resolveEvent}
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
