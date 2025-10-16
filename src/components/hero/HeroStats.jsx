import React from 'react'
import './HeroStats.css'

const HeroStats = ({ stats, heroData }) => {
  if (!stats || !heroData) return null

  const statItems = [
    {
      icon: '✅',
      value: stats.missionsCompleted || 0,
      label: 'Missões Completas',
      className: 'success'
    },
    {
      icon: '🔥',
      value: stats.dailyStreak || 0,
      label: 'Sequência Diária',
      className: 'warning'
    },
    {
      icon: '📅',
      value: stats.weeklyCompleted || 0,
      label: 'Semanais Completas',
      className: 'primary'
    },
    {
      icon: '🏆',
      value: `${stats.campaignProgress || 0}%`,
      label: 'Progresso Campanha',
      className: 'secondary'
    }
  ]

  return (
    <div className="hero-stats">
      <div className="stats-header">
        <h4 className="stats-title">Estatísticas</h4>
      </div>
      
      <div className="stats-grid">
        {statItems.map((stat, index) => (
          <div key={index} className={`stat-item ${stat.className} gamified-card`}>
            <div className="particles-container">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="additional-stats">
        <div className="stat-row">
          <span className="stat-name">XP Total:</span>
          <span className="stat-data">{heroData.totalXP || 0}</span>
        </div>
        <div className="stat-row">
          <span className="stat-name">Maior Sequência:</span>
          <span className="stat-data">{stats.longestStreak || 0} dias</span>
        </div>
        <div className="stat-row">
          <span className="stat-name">Dias Ativos:</span>
          <span className="stat-data">{stats.totalDaysActive || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default HeroStats