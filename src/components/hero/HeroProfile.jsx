import React, { useEffect, useState } from 'react'
import XPProgressBar from './XPProgressBar'
import { getTitleByLevel } from '../../utils/developerTitles'
import './HeroProfile.css'

const HeroProfile = ({ heroData, getXPProgress }) => {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [previousLevel, setPreviousLevel] = useState(null)

  useEffect(() => {
    if (heroData && previousLevel !== null && heroData.level > previousLevel) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    if (heroData) {
      setPreviousLevel(heroData.level)
    }
  }, [heroData?.level, previousLevel])

  if (!heroData) return null

  const xpProgress = getXPProgress()
  const currentTitle = getTitleByLevel(heroData.level)

  return (
    <div className="hero-profile">
      {/* Level Up Effect */}
      {showLevelUp && (
        <div className="level-up-effect animate-bounceIn level-up-effect">
          <div className="level-up-text animate-pulse">LEVEL UP!</div>
          <div className="level-up-number animate-scaleIn">Nível {heroData.level}</div>
          <div className="level-up-particles animate-sparkle">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="level-up-particle animate-fadeInUp" style={{
                '--delay': `${i * 0.1}s`,
                '--angle': `${i * 30}deg`
              }}></div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar gamified-avatar hover-glow">{heroData.avatar}</div>
          <div className="level-badge gamified-badge animate-scaleIn">
            <span className="level-number">{heroData.level}</span>
          </div>
        </div>
        
        <div className="hero-info">
          <h3 className="hero-name">{heroData.name}</h3>
          <p className="hero-title">{currentTitle.title}</p>
          <p className="hero-level">Nível {heroData.level}</p>
        </div>
      </div>

      <div className="xp-section">
        <XPProgressBar 
          currentXP={xpProgress.current}
          xpToNextLevel={xpProgress.needed}
          percentage={xpProgress.percentage}
        />
        <div className="xp-info">
          <span className="xp-current">{xpProgress.current}</span>
          <span className="xp-separator">/</span>
          <span className="xp-needed">{xpProgress.needed} XP</span>
        </div>
      </div>

      <div className="resources">
        <div className="resource-item gold gamified-resource hover-glow">
          <span className="resource-icon animate-coinFlip">💰</span>
          <div className="resource-info">
            <span className="resource-value gold-number">{heroData.gold}</span>
            <span className="resource-label">Pontos</span>
          </div>
        </div>
        
        <div className="resource-item energy gamified-resource hover-glow">
          <span className="resource-icon animate-pulse">⚡</span>
          <div className="resource-info">
            <span className="resource-value">{heroData.energy}/{heroData.maxEnergy}</span>
            <span className="resource-label">Energia</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroProfile