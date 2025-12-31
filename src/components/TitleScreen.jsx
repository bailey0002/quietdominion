export function TitleScreen({ onNewGame, onContinue, hasSave }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Decorative top element */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-sepia/30 to-transparent" />
      </div>
      
      {/* Title */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="font-display text-4xl md:text-6xl tracking-[0.3em] text-parchment mb-4">
          THE QUIET
        </h1>
        <h1 className="font-display text-4xl md:text-6xl tracking-[0.3em] text-gold">
          DOMINION
        </h1>
        
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-sepia/30" />
          <span className="font-body text-sm text-sepia/60 italic">
            A settlement awaits
          </span>
          <div className="w-16 h-px bg-sepia/30" />
        </div>
      </div>
      
      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-64 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {hasSave && (
          <button
            onClick={onContinue}
            className="btn-primary w-full py-3"
          >
            Continue
          </button>
        )}
        
        <button
          onClick={onNewGame}
          className={hasSave ? 'btn-secondary w-full py-3' : 'btn-primary w-full py-3'}
        >
          New Game
        </button>
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-8 text-center">
        <p className="font-body text-xs text-sepia/40">
          An incremental strategy experience
        </p>
        <p className="font-mono text-xs text-sepia/30 mt-1">
          v0.1.0
        </p>
      </div>
      
      {/* Decorative bottom element */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
        <div className="w-px h-24 bg-gradient-to-t from-transparent via-sepia/30 to-transparent" />
      </div>
    </div>
  )
}
