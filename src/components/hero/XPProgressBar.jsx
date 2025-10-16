import React from 'react'
import './XPProgressBar.css'

const XPProgressBar = ({ currentXP, xpToNextLevel, percentage }) => {
  const progressPercentage = percentage || ((currentXP / xpToNextLevel) * 100)
  const isNearLevel = progressPercentage >= 80

  return (
    <div className={`xp-progress-bar ${isNearLevel ? 'near-level' : ''} gamified-progress`}>
      <div className="progress-track">
        <div 
          className="progress-fill gamified-progress-fill"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        >
          <div className="progress-shine"></div>
        </div>
      </div>
      <div className="progress-percentage">
        {Math.round(progressPercentage)}%
      </div>
    </div>
  )
}

export default XPProgressBar