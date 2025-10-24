import React from 'react'
import './AchievementCard.css'
import { RARITY_CONFIG, getAchievementProgress } from '../../utils/achievements'

const AchievementCard = ({ 
  achievement, 
  heroData, 
  isUnlocked = false, 
  showProgress = true,
  onClick 
}) => {
  const progress = getAchievementProgress(achievement.id, heroData)
  const rarityConfig = RARITY_CONFIG[achievement.rarity]
  
  const handleClick = () => {
    if (onClick) {
      onClick(achievement)
    }
  }

  const formatRewards = () => {
    const rewards = []
    if (achievement.rewards.xp) {
      rewards.push(`${achievement.rewards.xp} XP`)
    }
    if (achievement.rewards.gold) {
      rewards.push(`${achievement.rewards.gold} Pontos`)
    }
    return rewards.join(' • ')
  }

  return (
    <div 
      className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity} gamified-card achievement-badge-glow`}
      onClick={handleClick}
      style={{
        '--rarity-color': rarityConfig.color,
        '--rarity-bg': rarityConfig.bgColor,
        '--rarity-border': rarityConfig.borderColor
      }}
    >
      <div className="particles-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="achievement-header">
        <div className="achievement-icon">
          {isUnlocked ? achievement.icon : '🔒'}
        </div>
        <div className="achievement-rarity">
          {rarityConfig.name}
        </div>
      </div>

      <div className="achievement-content">
        <h3 className="achievement-title">
          {isUnlocked ? achievement.title : '???'}
        </h3>
        <p className="achievement-description">
          {isUnlocked ? achievement.description : 'Conquista bloqueada'}
        </p>
      </div>

      {showProgress && !isUnlocked && (
        <div className="achievement-progress">
          <div className="progress-info">
            <span className="progress-text">
              {progress.current} / {progress.required}
            </span>
            <span className="progress-percentage">
              {progress.percentage}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {isUnlocked && (
        <div className="achievement-rewards">
          <div className="rewards-label">Recompensas:</div>
          <div className="rewards-text">{formatRewards()}</div>
        </div>
      )}

      {isUnlocked && (
        <div className="achievement-badge">
          <span className="badge-text">✓ Desbloqueada</span>
        </div>
      )}
    </div>
  )
}

export default AchievementCard