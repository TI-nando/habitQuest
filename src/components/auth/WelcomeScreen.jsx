import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './WelcomeScreen.css'

const WelcomeScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [heroName, setHeroName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🧙‍♂️')
  const [selectedTitle, setSelectedTitle] = useState('Iniciante')
  const { updateProfile } = useAuth()

  const avatarOptions = [
    '🧙‍♂️', '🧙‍♀️', '⚔️', '🏹', '🛡️', '🗡️', 
    '🧝‍♂️', '🧝‍♀️', '🧚‍♂️', '🧚‍♀️', '🐉', '🦄'
  ]

  const titleOptions = [
    'Iniciante', 'Aventureiro', 'Explorador', 'Guerreiro',
    'Mago', 'Arqueiro', 'Cavaleiro', 'Druida'
  ]

  const steps = [
    {
      title: '🏰 Bem-vindo ao HabitQuest!',
      subtitle: 'Transforme seus hábitos em uma aventura épica',
      content: (
        <div className="welcome-intro">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">⚔️</span>
              <div>
                <h4>Missões Épicas</h4>
                <p>Transforme suas tarefas em missões heroicas</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <div>
                <h4>Conquistas</h4>
                <p>Desbloqueie conquistas conforme progride</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <div>
                <h4>Progressão</h4>
                <p>Ganhe XP e suba de nível como um verdadeiro herói</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🎭 Crie seu Herói',
      subtitle: 'Como você gostaria de ser conhecido?',
      content: (
        <div className="hero-creation">
          <div className="name-input-section">
            <label htmlFor="heroName">Nome do seu Herói:</label>
            <input
              id="heroName"
              type="text"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder="Digite o nome do seu herói..."
              maxLength={20}
            />
          </div>
        </div>
      )
    },
    {
      title: '🎨 Escolha seu Avatar',
      subtitle: 'Selecione um avatar que represente você',
      content: (
        <div className="avatar-selection">
          <div className="avatar-grid">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <span className="avatar-emoji">{avatar}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '🏅 Escolha seu Título',
      subtitle: 'Como você quer começar sua jornada?',
      content: (
        <div className="title-selection">
          <div className="title-grid">
            {titleOptions.map((title) => (
              <button
                key={title}
                className={`title-option ${selectedTitle === title ? 'selected' : ''}`}
                onClick={() => setSelectedTitle(title)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '🚀 Pronto para a Aventura!',
      subtitle: 'Sua jornada heroica está prestes a começar',
      content: (
        <div className="final-step">
          <div className="hero-preview">
            <div className="hero-avatar">{selectedAvatar}</div>
            <h3>{heroName || 'Herói'}</h3>
            <p className="hero-title">{selectedTitle}</p>
          </div>
          <div className="tips">
            <h4>💡 Dicas para começar:</h4>
            <ul>
              <li>Crie suas primeiras missões diárias</li>
              <li>Complete tarefas para ganhar XP e ouro</li>
              <li>Desbloqueie conquistas conforme progride</li>
              <li>Acompanhe suas estatísticas na aba Stats</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      // Atualizar perfil do usuário com as informações coletadas
      await updateProfile({
        heroName: heroName || 'Herói',
        avatar: selectedAvatar,
        title: selectedTitle,
        onboardingCompleted: true
      })
      
      onComplete()
    } catch (error) {
      console.error('Erro ao completar onboarding:', error)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return heroName.trim().length >= 2
    }
    return true
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="step-counter">
          Passo {currentStep + 1} de {steps.length}
        </div>

        <div className="welcome-content">
          <h1>{currentStepData.title}</h1>
          <p className="subtitle">{currentStepData.subtitle}</p>
          
          <div className="step-content">
            {currentStepData.content}
          </div>
        </div>

        <div className="welcome-actions">
          {currentStep > 0 && (
            <button 
              className="btn-secondary" 
              onClick={handlePrevious}
            >
              ← Voltar
            </button>
          )}
          
          <button 
            className={`btn-primary ${!canProceed() ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === steps.length - 1 ? 'Começar Aventura! 🚀' : 'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen