import { useMemo } from 'react'
import { MICRO_GOALS, STRUCTURES } from '../data/gameData'

// Check goal progress for display
const getGoalProgress = (goal, gameState) => {
  const condition = goal.condition
  
  if (condition.structures) {
    const [structId, count] = Object.entries(condition.structures)[0]
    const current = gameState.structures[structId] || 0
    const target = count || 1
    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }
  
  if (condition.population) {
    const current = Math.floor(gameState.resources.population || 0)
    const target = condition.population
    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }
  
  if (condition.day) {
    const current = gameState.day
    const target = condition.day
    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }
  
  if (condition.territories) {
    const current = gameState.discoveredTerritories?.length || 0
    const target = condition.territories
    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }
  
  if (condition.lore) {
    const current = gameState.discoveredLore?.length || 0
    const target = condition.lore
    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }
  
  return { current: 0, target: 1, percentage: 0 }
}

// Format reward display
const formatReward = (rewards) => {
  const parts = []
  
  if (rewards.food) parts.push(`+${rewards.food} food`)
  if (rewards.materials) parts.push(`+${rewards.materials} materials`)
  if (rewards.population) parts.push(`+${rewards.population} pop`)
  if (rewards.influence) parts.push(`+${rewards.influence} influence`)
  if (rewards.knowledge) parts.push(`+${rewards.knowledge} knowledge`)
  
  return parts.join(', ')
}

function GoalCard({ goalId, goal, isCompleted, isNew, gameState }) {
  const progress = getGoalProgress(goal, gameState)
  
  if (isCompleted) {
    return (
      <div className="
        p-3 rounded-lg border
        bg-moss/10 border-moss/30
        opacity-70
      ">
        <div className="flex items-center gap-2">
          <span className="text-moss text-lg">✓</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-xs text-parchment/70 truncate">
              {goal.title}
            </h4>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`
      p-3 rounded-lg border transition-all duration-300
      ${isNew 
        ? 'bg-gold/10 border-gold/40 animate-pulse' 
        : 'bg-ink/50 border-sepia/30 hover:border-sepia/50'
      }
    `}>
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg">{goal.icon || '🎯'}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-sm text-parchment">
            {goal.title}
          </h4>
          <p className="font-body text-xs text-parchment/60 leading-tight">
            {goal.description}
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-xs text-sepia/60">Progress</span>
          <span className="font-mono text-xs text-parchment">
            {progress.current}/{progress.target}
          </span>
        </div>
        <div className="h-1.5 bg-sepia/20 rounded overflow-hidden">
          <div 
            className={`
              h-full transition-all duration-500 rounded
              ${progress.percentage >= 100 ? 'bg-gold' : 'bg-sepia/60'}
            `}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Reward preview */}
      <div className="pt-2 border-t border-sepia/20">
        <span className="font-mono text-xs text-moss/80">
          🎁 {formatReward(goal.rewards)}
        </span>
      </div>
    </div>
  )
}

export function MicroGoalsPanel({ gameState }) {
  const { activeGoals, completedGoals } = gameState
  
  // Get goal objects sorted by display order
  const sortedActiveGoals = useMemo(() => {
    return activeGoals
      .map(id => ({ id, ...MICRO_GOALS[id] }))
      .filter(g => g.title) // Filter out any invalid goal IDs
      .sort((a, b) => (a.order || 99) - (b.order || 99))
  }, [activeGoals])
  
  const recentlyCompleted = useMemo(() => {
    // Show last 3 completed goals
    return completedGoals
      .slice(-3)
      .map(id => ({ id, ...MICRO_GOALS[id] }))
      .filter(g => g.title)
      .reverse()
  }, [completedGoals])
  
  // Count stats
  const totalGoals = Object.keys(MICRO_GOALS).length
  const completedCount = completedGoals.length
  
  if (sortedActiveGoals.length === 0 && completedCount === 0) {
    return null // Don't show panel if no goals available
  }
  
  return (
    <div className="game-card">
      <div className="game-card-highlight" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm tracking-widest uppercase text-sepia">
          Objectives
        </h2>
        <span className="font-mono text-xs text-sepia/50">
          {completedCount}/{totalGoals} complete
        </span>
      </div>
      
      {/* Active Goals */}
      {sortedActiveGoals.length > 0 && (
        <div className="space-y-2 mb-4">
          {sortedActiveGoals.slice(0, 4).map(goal => (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              goal={goal}
              isCompleted={false}
              isNew={false}
              gameState={gameState}
            />
          ))}
          
          {sortedActiveGoals.length > 4 && (
            <p className="font-body text-xs text-sepia/50 text-center italic">
              +{sortedActiveGoals.length - 4} more objectives...
            </p>
          )}
        </div>
      )}
      
      {/* Completed Goals (collapsed) */}
      {recentlyCompleted.length > 0 && (
        <div className="pt-3 border-t border-sepia/20">
          <h3 className="font-display text-xs tracking-wider uppercase text-sepia/60 mb-2">
            Recently Completed
          </h3>
          <div className="space-y-1">
            {recentlyCompleted.map(goal => (
              <GoalCard
                key={goal.id}
                goalId={goal.id}
                goal={goal}
                isCompleted={true}
                isNew={false}
                gameState={gameState}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* All complete message */}
      {sortedActiveGoals.length === 0 && completedCount > 0 && (
        <div className="text-center py-4">
          <span className="text-2xl mb-2 block">🏆</span>
          <p className="font-body text-sm text-gold italic">
            All current objectives complete!
          </p>
          <p className="font-body text-xs text-sepia/50 mt-1">
            More will unlock as you progress.
          </p>
        </div>
      )}
    </div>
  )
}
