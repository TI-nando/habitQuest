import React, { useState } from 'react'
import './AddMissionForm.css'

const AddMissionForm = ({ onAddMission, onCancel, defaultType = 'daily' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: defaultType,
    difficulty: 'medium',
    xpReward: 25,
    goldReward: 10,
    dueDate: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Ajustar recompensas baseado na dificuldade (valores fixos mais desafiadores)
    if (name === 'difficulty') {
      const rewards = {
        easy: { xp: 10, gold: 4 },    // Fácil: 10 XP, 4 ouro
        medium: { xp: 25, gold: 10 }, // Médio: 25 XP, 10 ouro  
        hard: { xp: 50, gold: 20 }    // Difícil: 50 XP, 20 ouro
      }
      
      setFormData(prev => ({
        ...prev,
        xpReward: rewards[value].xp,
        goldReward: rewards[value].gold
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (formData.xpReward < 1) {
      newErrors.xpReward = 'Recompensa XP deve ser maior que 0'
    }

    if (formData.goldReward < 0) {
      newErrors.goldReward = 'Recompensa de ouro não pode ser negativa'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const missionData = {
      ...formData,
      id: Date.now(), // ID temporário
      isCompleted: false,
      createdAt: new Date().toISOString(),
      xpReward: parseInt(formData.xpReward),
      goldReward: parseInt(formData.goldReward)
    }

    onAddMission(missionData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: defaultType,
      difficulty: 'medium',
      xpReward: 25,
      goldReward: 10,
      dueDate: ''
    })
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
      case 'daily': return '☀️'
      case 'weekly': return '📅'
      case 'campaign': return '🏆'
      default: return '📋'
    }
  }

  return (
    <div className="add-mission-form">
      <div className="form-header">
        <h3 className="form-title">
          <span className="form-icon">➕</span>
          Nova Missão
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mission-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título da Missão *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Ex: Beber 2L de água"
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Descreva sua missão..."
              rows={3}
              maxLength={500}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Tipo da Missão
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="daily">{getTypeIcon('daily')} Diária</option>
              <option value="weekly">{getTypeIcon('weekly')} Semanal</option>
              <option value="campaign">{getTypeIcon('campaign')} Campanha</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty" className="form-label">
              Dificuldade
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="form-select"
            >
              <option value="easy">{getDifficultyIcon('easy')} Fácil</option>
              <option value="medium">{getDifficultyIcon('medium')} Médio</option>
              <option value="hard">{getDifficultyIcon('hard')} Difícil</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="xpReward" className="form-label">
              Recompensa XP
            </label>
            <input
              type="number"
              id="xpReward"
              name="xpReward"
              value={formData.xpReward}
              onChange={handleChange}
              className={`form-input ${errors.xpReward ? 'error' : ''}`}
              min="1"
              max="1000"
            />
            {errors.xpReward && <span className="error-message">{errors.xpReward}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="goldReward" className="form-label">
              Recompensa Ouro
            </label>
            <input
              type="number"
              id="goldReward"
              name="goldReward"
              value={formData.goldReward}
              onChange={handleChange}
              className={`form-input ${errors.goldReward ? 'error' : ''}`}
              min="0"
              max="1000"
            />
            {errors.goldReward && <span className="error-message">{errors.goldReward}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Data Limite (Opcional)
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            ❌ Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
          >
            ✅ Criar Missão
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMissionForm