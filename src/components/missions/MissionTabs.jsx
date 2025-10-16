import React from 'react'
import './MissionTabs.css'

const MissionTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'daily',
      label: 'Diárias',
      icon: '☀️',
      description: 'Missões que resetam diariamente'
    },
    {
      id: 'weekly',
      label: 'Semanais',
      icon: '📅',
      description: 'Missões que resetam semanalmente'
    },
    {
      id: 'campaign',
      label: 'Campanhas',
      icon: '🏆',
      description: 'Missões de longo prazo'
    },
    {
      id: 'all',
      label: 'Todas',
      icon: '📋',
      description: 'Ver todas as missões'
    }
  ]

  return (
    <div className="mission-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          title={tab.description}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-text">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default MissionTabs