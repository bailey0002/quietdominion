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
      <div className="absolute bottom-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <p className="font-body text-xs text-sepia/40 mb-3">
          An incremental strategy experience
        </p>
        
        {/* Grey Stratum / Mandatum branding */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-px bg-sepia/20" />
          <p className="font-display text-[10px] tracking-[0.2em] uppercase text-sepia/40">
            Delivered by
          </p>
          <div className="w-6 h-px bg-sepia/20" />
        </div>
        
        <a 
          href="https://www.greystratum.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-block"
        >
          <p className="font-display text-xs tracking-[0.15em] uppercase text-gold/60 group-hover:text-gold transition-colors duration-300">
            Mandatum
          </p>
          <p className="font-display text-[10px] tracking-[0.25em] uppercase text-sepia/35 group-hover:text-sepia/50 transition-colors duration-300">
            of Grey Stratum
          </p>
        </a>
        
        <p className="font-mono text-[10px] text-sepia/20 mt-3">
          v0.2.0
        </p>
      </div>
      
      {/* Decorative bottom element */}
      <div className="absolute bottom-44 left-1/2 -translate-x-1/2">
        <div className="w-px h-20 bg-gradient-to-t from-transparent via-sepia/30 to-transparent" />
      </div>
    </div>
  )
}
