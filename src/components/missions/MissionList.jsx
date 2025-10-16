import React from 'react'
import MissionItem from './MissionItem'
import './MissionList.css'

const MissionList = ({ missions, onCompleteMission, onDeleteMission, onEditMission }) => {
  if (!missions || missions.length === 0) {
    return (
      <div className="mission-list empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhuma missão encontrada</h3>
          <p>Adicione uma nova missão para começar!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mission-list">
      <div className="missions-container">
        {missions.map(mission => (
          <MissionItem
            key={mission.id}
            mission={mission}
            onComplete={() => onCompleteMission(mission.id)}
            onDelete={() => onDeleteMission(mission.id)}
            onEdit={() => onEditMission(mission.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default MissionList