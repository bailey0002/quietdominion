import { useState } from 'react'
import { LORE } from '../data/events'

function LoreEntry({ lore, isDiscovered, isNew }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!isDiscovered) {
    return (
      <div className="
        p-3 rounded border
        bg-ink/30 border-sepia/10
      ">
        <div className="flex items-center gap-2">
          <span className="text-sepia/30">📜</span>
          <span className="font-display text-xs text-sepia/30 italic">
            Undiscovered
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className={`
        p-3 rounded border cursor-pointer
        transition-all duration-300
        ${isExpanded 
          ? 'bg-sepia/15 border-gold/40' 
          : 'bg-ink/50 border-sepia/20 hover:border-sepia/40'
        }
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-gold/80">📜</span>
        <h3 className="font-display text-sm text-parchment flex-1">
          {lore.title}
        </h3>
        {isNew && (
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
        )}
        <span className={`
          text-sepia/50 text-xs transition-transform duration-300
          ${isExpanded ? 'rotate-180' : ''}
        `}>
          ▼
        </span>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-sepia/20">
          <p className="font-body text-sm text-parchment/80 leading-relaxed italic">
            {lore.content}
          </p>
        </div>
      )}
    </div>
  )
}

export function LoreCodex({ discoveredLore, newLore = [] }) {
  const [filter, setFilter] = useState('all') // 'all', 'discovered', 'undiscovered'
  
  const allLore = Object.values(LORE)
  
  // Filter lore based on selection
  const filteredLore = allLore.filter(lore => {
    const isDiscovered = discoveredLore.includes(lore.id)
    if (filter === 'discovered') return isDiscovered
    if (filter === 'undiscovered') return !isDiscovered
    return true
  })
  
  // Count discovered
  const discoveredCount = allLore.filter(l => discoveredLore.includes(l.id)).length
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm tracking-widest uppercase text-sepia">
          Codex
        </h2>
        <span className="font-mono text-xs text-sepia/50">
          {discoveredCount}/{allLore.length} fragments
        </span>
      </div>
      
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'discovered', 'undiscovered'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-3 py-1 text-xs font-display tracking-wider uppercase
              rounded transition-colors
              ${filter === f 
                ? 'bg-sepia/20 text-parchment' 
                : 'text-sepia/50 hover:text-sepia'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>
      
      {/* Lore entries */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {filteredLore.map(lore => (
          <LoreEntry
            key={lore.id}
            lore={lore}
            isDiscovered={discoveredLore.includes(lore.id)}
            isNew={newLore.includes(lore.id)}
          />
        ))}
        
        {filteredLore.length === 0 && (
          <p className="font-body text-sm text-parchment/50 italic text-center py-4">
            No lore fragments {filter === 'discovered' ? 'discovered yet' : 'remaining'}.
          </p>
        )}
      </div>
      
      {/* Mystery hint */}
      {discoveredCount >= 3 && discoveredCount < allLore.length && (
        <div className="mt-4 pt-3 border-t border-sepia/20">
          <p className="font-body text-xs text-sepia/50 italic text-center">
            The fragments hint at a larger truth...
          </p>
        </div>
      )}
    </div>
  )
}
