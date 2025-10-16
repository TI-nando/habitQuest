import React from 'react'
import XPProgressBar from './XPProgressBar'
import './HeroProfile.css'

const HeroProfile = ({ heroData, getXPProgress }) => {
  if (!heroData) return null

  const xpProgress = getXPProgress()

  return (
    <div className="hero-profile">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">{heroData.avatar}</div>
          <div className="level-badge">
            <span className="level-number">{heroData.level}</span>
          </div>
        </div>
        
        <div className="hero-info">
          <h3 className="hero-name">{heroData.name}</h3>
          <p className="hero-title">Nível {heroData.level}</p>
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
        <div className="resource-item gold">
          <span className="resource-icon">💰</span>
          <div className="resource-info">
            <span className="resource-value">{heroData.gold}</span>
            <span className="resource-label">Ouro</span>
          </div>
        </div>
        
        <div className="resource-item energy">
          <span className="resource-icon">⚡</span>
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