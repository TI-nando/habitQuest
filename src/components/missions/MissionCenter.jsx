import React, { useState } from 'react'
import MissionTabs from './MissionTabs'
import MissionList from './MissionList'
import AddMissionForm from './AddMissionForm'
import './MissionCenter.css'

const MissionCenter = ({ 
  missions, 
  onAddMission, 
  onComplete, 
  onDelete, 
  onEdit,
  heroData 
}) => {
  const [activeTab, setActiveTab] = useState('daily')
  const [showAddForm, setShowAddForm] = useState(false)

  if (!missions) {
    return (
      <div className="mission-center loading">
        <div className="loading-message">Carregando missões...</div>
      </div>
    )
  }

  const filteredMissions = missions.filter(mission => {
    if (activeTab === 'all') return true
    return mission.type === activeTab
  })

  const handleAddMission = (missionData) => {
    onAddMission(missionData)
    setShowAddForm(false)
  }

  const completedCount = filteredMissions.filter(m => m.isCompleted).length
  const totalCount = filteredMissions.length

  return (
    <div className="mission-center">
      <div className="mission-header">
        <div className="header-content">
          <h2 className="mission-title">
            📋 Lista de Atividades Diárias
          </h2>
          <div className="progress-summary">
            {totalCount > 0 && (
              <span className="progress-text">
                {completedCount} de {totalCount} concluídas
              </span>
            )}
          </div>
        </div>
        <button 
          className="add-mission-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '❌ Cancelar' : '➕ Nova Atividade'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-mission-section">
          <AddMissionForm 
            onAddMission={handleAddMission}
            onCancel={() => setShowAddForm(false)}
            defaultType={activeTab !== 'all' ? activeTab : 'daily'}
          />
        </div>
      )}

      <MissionTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="mission-list-container">
        <MissionList 
          missions={filteredMissions}
          onCompleteMission={onComplete}
          onDeleteMission={onDelete}
          onEditMission={onEdit}
        />

        {filteredMissions.length === 0 && (
          <div className="no-missions">
            <div className="no-missions-icon">📝</div>
            <h3>Nenhuma atividade encontrada</h3>
            <p>
              {activeTab === 'daily' && 'Adicione suas atividades diárias para começar!'}
              {activeTab === 'weekly' && 'Crie metas semanais para manter o foco!'}
              {activeTab === 'campaign' && 'Defina objetivos de longo prazo!'}
              {activeTab === 'all' && 'Comece adicionando sua primeira atividade!'}
            </p>
            <button 
              className="cta-button"
              onClick={() => setShowAddForm(true)}
            >
              ➕ Adicionar Primeira Atividade
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MissionCenter