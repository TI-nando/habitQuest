import React from 'react'
import HeroProfile from './HeroProfile'
import HeroStats from './HeroStats'
import ResourceManager from './ResourceManager'
import './HeroDashboard.css'

const HeroDashboard = ({ 
  heroData, 
  onGainXP, 
  onUpdateResources, 
  getXPProgress,
  onRestoreEnergy,
  onRestoreHealth 
}) => {
  if (!heroData) {
    return (
      <div className="hero-dashboard loading">
        <div className="loading-message">Carregando dados do desenvolvedor...</div>
      </div>
    )
  }

  return (
    <div className="hero-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="title-icon">💻</span>
          Dashboard do Desenvolvedor
        </h2>
      </div>

      <div className="dashboard-content">
        <HeroProfile 
          heroData={heroData} 
          getXPProgress={getXPProgress}
        />
        
        <ResourceManager
          heroData={heroData}
          onUpdateResources={onUpdateResources}
          onRestoreEnergy={onRestoreEnergy}
          onRestoreHealth={onRestoreHealth}
        />
        
        <HeroStats 
          stats={heroData.stats} 
          heroData={heroData}
        />
      </div>
    </div>
  )
}

export default HeroDashboard