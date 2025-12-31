import { RESOURCES } from '../data/gameData'

export function ResourceBar({ resourceId, amount, cap, rate }) {
  const resource = RESOURCES[resourceId]
  if (!resource) return null
  
  const percentage = cap > 0 ? Math.min((amount / cap) * 100, 100) : 0
  const formattedAmount = amount >= 1000 
    ? `${(amount / 1000).toFixed(1)}k` 
    : Math.floor(amount)
  const formattedRate = rate > 0 
    ? `+${(rate * 60).toFixed(1)}/min` 
    : rate < 0 
      ? `${(rate * 60).toFixed(1)}/min`
      : ''
  
  return (
    <div className="flex items-center gap-3 group">
      {/* Icon */}
      <span className="text-lg w-6 text-center opacity-80 group-hover:opacity-100 transition-opacity">
        {resource.icon}
      </span>
      
      {/* Bar and labels */}
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-display text-xs tracking-wider uppercase text-parchment/70">
            {resource.name}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-parchment">
              {formattedAmount}
              <span className="text-parchment/50">/{cap}</span>
            </span>
            {formattedRate && (
              <span className={`
                font-mono text-xs 
                ${rate > 0 ? 'text-moss' : 'text-ember'}
              `}>
                ({formattedRate})
              </span>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="resource-bar h-2">
          <div 
            className="resource-bar-fill"
            style={{ width: `${percentage}%` }}
          />
          {percentage > 80 && (
            <div className="resource-bar-glow" />
          )}
        </div>
      </div>
    </div>
  )
}

export function ResourcePanel({ resources, caps, rates }) {
  const visibleResources = ['food', 'materials', 'population']
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      <h2 className="font-display text-sm tracking-widest uppercase text-sepia mb-4">
        Resources
      </h2>
      <div className="space-y-3">
        {visibleResources.map(resourceId => (
          <ResourceBar
            key={resourceId}
            resourceId={resourceId}
            amount={resources[resourceId] || 0}
            cap={caps[resourceId] || 100}
            rate={rates[resourceId] || 0}
          />
        ))}
      </div>
    </div>
  )
}
