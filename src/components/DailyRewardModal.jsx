import { useState, useEffect } from 'react'
import { DAILY_LOGIN_CONFIG, RESOURCES } from '../data/gameData'

// Calculate daily reward based on streak
const calculateDailyReward = (streak) => {
  const dayIndex = ((streak - 1) % 7)
  const baseReward = { ...DAILY_LOGIN_CONFIG.rewards[dayIndex] }
  
  // Apply streak multiplier for weeks beyond first
  const weeksComplete = Math.floor((streak - 1) / 7)
  if (weeksComplete > 0) {
    const multiplier = Math.min(
      1 + (weeksComplete * DAILY_LOGIN_CONFIG.streakBonus),
      DAILY_LOGIN_CONFIG.maxStreakMultiplier
    )
    
    Object.keys(baseReward).forEach(key => {
      if (key !== 'day' && key !== 'description' && typeof baseReward[key] === 'number') {
        baseReward[key] = Math.floor(baseReward[key] * multiplier)
      }
    })
  }
  
  return baseReward
}

// Format resource for display
const formatResource = (key, amount) => {
  const resource = RESOURCES[key]
  if (!resource) return null
  
  return (
    <div key={key} className="flex items-center gap-2">
      <span className="text-lg">{resource.icon}</span>
      <span className="font-mono text-parchment">+{amount}</span>
      <span className="font-body text-sepia/70 text-sm">{resource.name}</span>
    </div>
  )
}

export function DailyRewardModal({ streak, onClaim, onClose }) {
  const [claimed, setClaimed] = useState(false)
  const [showReward, setShowReward] = useState(false)
  
  const reward = calculateDailyReward(streak)
  const dayInCycle = ((streak - 1) % 7) + 1
  const weeksComplete = Math.floor((streak - 1) / 7)
  const multiplier = weeksComplete > 0 
    ? Math.min(1 + (weeksComplete * DAILY_LOGIN_CONFIG.streakBonus), DAILY_LOGIN_CONFIG.maxStreakMultiplier)
    : 1
  
  // Animate reward reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowReward(true), 300)
    return () => clearTimeout(timer)
  }, [])
  
  const handleClaim = () => {
    setClaimed(true)
    onClaim()
    
    // Close after animation
    setTimeout(onClose, 1500)
  }
  
  // Get rewards to display (filter out metadata)
  const rewardEntries = Object.entries(reward).filter(
    ([key]) => key !== 'day' && key !== 'description'
  )
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm animate-fade-in">
      <div className="
        w-full max-w-md
        bg-ink border border-gold/40 rounded-lg
        shadow-2xl shadow-gold/20
        overflow-hidden
      ">
        {/* Header */}
        <div className="p-6 border-b border-sepia/20 text-center">
          <div className="mb-2">
            <span className="text-4xl">🌅</span>
          </div>
          <h2 className="font-display text-2xl tracking-wider text-gold mb-1">
            Daily Return
          </h2>
          <p className="font-body text-parchment/70">
            {reward.description || 'Welcome back to your dominion'}
          </p>
        </div>
        
        {/* Streak Info */}
        <div className="px-6 py-4 bg-gold/5 border-b border-sepia/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-sm tracking-wider uppercase text-sepia">
                Current Streak
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-gold">{streak}</span>
                <span className="font-body text-parchment/50 text-sm">days</span>
              </div>
            </div>
            
            {/* Week progress dots */}
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-xs text-sepia/50">Day {dayInCycle}/7</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <div
                    key={d}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300
                      ${d < dayInCycle ? 'bg-gold/60' : ''}
                      ${d === dayInCycle ? 'bg-gold scale-125' : ''}
                      ${d > dayInCycle ? 'bg-sepia/30' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Multiplier indicator */}
          {multiplier > 1 && (
            <div className="mt-3 pt-3 border-t border-sepia/20">
              <span className="font-mono text-xs text-moss">
                ✦ Week {weeksComplete + 1} Bonus: {((multiplier - 1) * 100).toFixed(0)}% increased rewards!
              </span>
            </div>
          )}
        </div>
        
        {/* Rewards */}
        <div className={`
          p-6 transition-all duration-500
          ${showReward ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <h3 className="font-display text-sm tracking-widest uppercase text-sepia mb-4 text-center">
            Today's Reward
          </h3>
          
          <div className="space-y-3 mb-6">
            {rewardEntries.map(([key, amount]) => formatResource(key, amount))}
          </div>
          
          {/* Claim button */}
          {!claimed ? (
            <button
              onClick={handleClaim}
              className="
                w-full py-4 rounded-lg
                font-display text-lg tracking-wider uppercase
                bg-gradient-to-r from-gold/80 to-gold text-ink
                border border-gold
                transition-all duration-300
                hover:from-gold hover:to-gold/90
                hover:shadow-lg hover:shadow-gold/30
                active:scale-95
              "
            >
              Claim Reward
            </button>
          ) : (
            <div className="text-center py-4 animate-pulse">
              <span className="font-display text-lg text-gold">✓ Claimed!</span>
            </div>
          )}
        </div>
        
        {/* Footer hint */}
        <div className="px-6 pb-4 text-center">
          <p className="font-body text-xs text-sepia/40">
            Return tomorrow to continue your streak
          </p>
        </div>
      </div>
    </div>
  )
}
