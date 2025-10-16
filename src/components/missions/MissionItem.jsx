import React, { useState } from 'react'
import './MissionItem.css'

const MissionItem = ({ mission, onComplete, onDelete, onEdit }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50'
      case 'medium': return '#FF9800'
      case 'hard': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢'
      case 'medium': return '🟡'
      case 'hard': return '🔴'
      default: return '⚪'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily': return '📅'
      case 'weekly': return '📆'
      case 'campaign': return '🎯'
      default: return '📋'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const handleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      await onComplete(mission.id)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className={`todo-item gamified-card ${mission.isCompleted ? 'completed' : ''} ${isCompleting ? 'completing' : ''}`}>
      {/* Particles effect */}
      <div className="particles-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Checkbox */}
      <div className="todo-checkbox-container">
        <button
          className={`todo-checkbox ${mission.isCompleted ? 'checked' : ''}`}
          onClick={handleComplete}
          disabled={isCompleting || mission.isCompleted}
        >
          {mission.isCompleted && '✓'}
        </button>
      </div>

      {/* Content */}
      <div className="todo-content">
        <div className="todo-header">
          <h3 className={`todo-title ${mission.isCompleted ? 'strikethrough' : ''}`}>
            {mission.title}
          </h3>
          <div className="todo-badges">
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(mission.difficulty) }}
            >
              {getDifficultyIcon(mission.difficulty)} {mission.difficulty}
            </span>
            <span className="type-badge">
              {getTypeIcon(mission.type)} {mission.type}
            </span>
          </div>
        </div>

        {mission.description && (
          <p className={`todo-description ${mission.isCompleted ? 'faded' : ''}`}>
            {mission.description}
          </p>
        )}

        <div className="todo-footer">
          <div className="todo-rewards">
            <span className="reward-badge xp">
              ⭐ {mission.rewards?.xp || mission.xpReward || 10} XP
            </span>
            {(mission.rewards?.gold || mission.goldReward) && (
              <span className="reward-badge gold">
                🪙 {mission.rewards?.gold || mission.goldReward} Ouro
              </span>
            )}
          </div>

          {mission.dueDate && (
            <div className="todo-due-date">
              📅 {formatDate(mission.dueDate)}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        {!mission.isCompleted && (
          <>
            <button 
              className="action-btn edit-btn"
              onClick={() => onEdit && onEdit(mission)}
              title="Editar missão"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => onDelete && onDelete(mission.id)}
              title="Deletar missão"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default MissionItem