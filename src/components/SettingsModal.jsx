export function SettingsModal({ 
  onClose, 
  isMuted, 
  ambientEnabled, 
  onToggleMute, 
  onToggleAmbient,
  onOpenPrestige,
  canPrestige,
  onResetGame
}) {
  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete all progress, including legacy points.')) {
      onResetGame()
      onClose()
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-fade-in">
      <div className="
        w-full max-w-md
        bg-ink border border-sepia/40 rounded-lg
        shadow-2xl
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sepia/20">
          <h2 className="font-display text-xl tracking-wider text-parchment">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-sepia/50 hover:text-parchment text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audio section */}
          <div>
            <h3 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
              Audio
            </h3>
            
            <div className="space-y-3">
              {/* Master mute */}
              <div className="flex items-center justify-between">
                <span className="font-body text-parchment/80">Sound Effects</span>
                <button
                  onClick={onToggleMute}
                  className={`
                    w-12 h-6 rounded-full transition-colors relative
                    ${isMuted ? 'bg-sepia/30' : 'bg-moss/50'}
                  `}
                >
                  <span className={`
                    absolute top-1 w-4 h-4 rounded-full bg-parchment
                    transition-transform
                    ${isMuted ? 'left-1' : 'left-7'}
                  `} />
                </button>
              </div>
              
              {/* Ambient toggle */}
              <div className="flex items-center justify-between">
                <span className="font-body text-parchment/80">Ambient Sounds</span>
                <button
                  onClick={onToggleAmbient}
                  disabled={isMuted}
                  className={`
                    w-12 h-6 rounded-full transition-colors relative
                    ${isMuted ? 'opacity-50 cursor-not-allowed' : ''}
                    ${!isMuted && ambientEnabled ? 'bg-moss/50' : 'bg-sepia/30'}
                  `}
                >
                  <span className={`
                    absolute top-1 w-4 h-4 rounded-full bg-parchment
                    transition-transform
                    ${!isMuted && ambientEnabled ? 'left-7' : 'left-1'}
                  `} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Game section */}
          <div>
            <h3 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
              Game
            </h3>
            
            <div className="space-y-3">
              {/* Prestige button */}
              <button
                onClick={() => { onOpenPrestige(); onClose(); }}
                disabled={!canPrestige}
                className={`
                  w-full py-3 rounded border
                  font-display text-sm tracking-wider
                  transition-all
                  ${canPrestige 
                    ? 'border-gold/50 text-gold hover:bg-gold/10' 
                    : 'border-sepia/20 text-sepia/40 cursor-not-allowed'
                  }
                `}
              >
                Found New Dominion
              </button>
              
              {!canPrestige && (
                <p className="font-body text-xs text-sepia/50 text-center">
                  Reach Day 50 with 75 population to unlock
                </p>
              )}
            </div>
          </div>
          
          {/* Danger zone */}
          <div className="pt-4 border-t border-sepia/20">
            <h3 className="font-display text-sm tracking-widest uppercase text-ember/70 mb-4">
              Danger Zone
            </h3>
            
            <button
              onClick={handleReset}
              className="
                w-full py-2 rounded border
                border-ember/30 text-ember/70
                font-body text-sm
                hover:bg-ember/10
                transition-colors
              "
            >
              Reset All Progress
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-sepia/20 text-center">
          <p className="font-mono text-xs text-sepia/40">
            The Quiet Dominion v0.2.0
          </p>
        </div>
      </div>
    </div>
  )
}
