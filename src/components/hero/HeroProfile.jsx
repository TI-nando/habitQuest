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

      <div className="points-section">
        <div className="points-header">
          <span className="points-icon animate-pulse">⭐</span>
          <div className="points-info">
            <span className="points-value gold-number">{Math.min(heroData.gold, 9999)}</span>
            <span className="points-label">Pontos</span>
          </div>
        </div>
        
        <div className="points-progress-container">
          <div className="points-progress-bar gamified-progress">
            <div className="progress-track">
              <div 
                className="progress-fill gamified-progress-fill"
                style={{ width: `${Math.min((heroData.gold / 9999) * 100, 100)}%` }}
              >
                <div className="progress-shine"></div>
              </div>
            </div>
            <div className="progress-percentage">
              {Math.round(Math.min((heroData.gold / 9999) * 100, 100))}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroProfile