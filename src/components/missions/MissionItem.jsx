import React, { useState, useRef } from 'react'
import './MissionItem.css'

const MissionItem = ({ mission, onComplete, onDelete, onEdit }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showXPGain, setShowXPGain] = useState(false)
  const [showGoldGain, setShowGoldGain] = useState(false)
  const itemRef = useRef(null)

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

  const createFloatingText = (text, className) => {
    const element = document.createElement('div')
    element.textContent = text
    element.className = className
    element.style.position = 'absolute'
    element.style.zIndex = '1000'
    element.style.pointerEvents = 'none'
    
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      element.style.left = `${rect.left + rect.width / 2}px`
      element.style.top = `${rect.top}px`
      document.body.appendChild(element)
      
      setTimeout(() => {
        document.body.removeChild(element)
      }, 1500)
    }
  }

  const handleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    
    // Adicionar efeito visual de conclusão
    if (itemRef.current) {
      itemRef.current.classList.add('mission-complete-effect')
    }
    
    try {
      await onComplete(mission.id)
      
      // Mostrar ganhos de XP e Gold
      const xpGain = mission.rewards?.xp || mission.xpReward || 10
      const goldGain = mission.rewards?.gold || mission.goldReward || 0
      
      setTimeout(() => {
        createFloatingText(`+${xpGain} XP`, 'xp-gain-effect')
      }, 200)
      
      if (goldGain > 0) {
        setTimeout(() => {
          createFloatingText(`+${goldGain} 🪙`, 'gold-gain-effect')
        }, 400)
      }
      
    } finally {
      setTimeout(() => {
        setIsCompleting(false)
        if (itemRef.current) {
          itemRef.current.classList.remove('mission-complete-effect')
        }
      }, 600)
    }
  }

  return (
    <div 
      ref={itemRef}
      className={`todo-item gamified-card ${mission.isCompleted ? 'completed' : ''} ${isCompleting ? 'completing' : ''}`}
    >
      {/* Particles effect */}
      <div className="particles-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Checkbox */}
      <div className="todo-checkbox-container">
        <button
          className={`todo-checkbox gamified-button ${mission.isCompleted ? 'checked' : ''}`}
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