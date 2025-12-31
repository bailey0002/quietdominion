export function GameHeader({ day, onSave, onSettings }) {
  return (
    <header className="
      fixed top-0 left-0 right-0 z-30
      px-4 py-3
      bg-ink/90 backdrop-blur-sm
      border-b border-sepia/20
    ">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Title */}
        <h1 className="font-display text-lg md:text-xl tracking-widest text-parchment">
          The Quiet Dominion
        </h1>
        
        {/* Day counter and actions */}
        <div className="flex items-center gap-4">
          {/* Day counter */}
          <div className="day-counter">
            Day <span className="text-gold">{day}</span>
          </div>
          
          {/* Save button */}
          <button
            onClick={onSave}
            className="
              p-2 text-sepia/60 hover:text-gold
              transition-colors
            "
            title="Save game"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
              />
            </svg>
          </button>
          
          {/* Settings button */}
          <button
            onClick={onSettings}
            className="
              p-2 text-sepia/60 hover:text-gold
              transition-colors
            "
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
