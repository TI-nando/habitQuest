import React, { useState, useEffect } from 'react'
import HeroDashboard from './components/hero/HeroDashboard'
import MissionCenter from './components/missions/MissionCenter'
import AchievementCenter from './components/achievements/AchievementCenter'
import StatsDashboard from './components/stats/StatsDashboard'
import UserProfile from './components/user/UserProfile'
import NotificationSystem from './components/common/NotificationSystem'
import ToastContainer from './components/ui/ToastContainer'
import AuthPage from './components/auth/AuthPage'
import WelcomeScreen from './components/auth/WelcomeScreen'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useHero } from './hooks/useHero'
import useNotifications from './hooks/useNotifications'
import useMissions from './hooks/useMissions'
import useAchievements from './hooks/useAchievements'
import useToast from './hooks/useToast'
import { updateStreak, STREAK_TYPES } from './utils/streaks'
import './App.css'

// Componente principal da aplicação
const AppContent = () => {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Verificar se o usuário precisa do onboarding
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowWelcome(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>🎮 HabitQuest</h2>
          <div className="loading-spinner"></div>
          <p>Carregando sua aventura...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onComplete={() => setShowWelcome(false)}
      />
    );
  }

  return <GameDashboard />;
};

// Componente do dashboard do jogo (código original do App)
const GameDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const { 
    heroData, 
    loading: heroLoading,
    gainXP, 
    updateResources, 
    updateStats,
    saveHero,
    getXPProgress
  } = useHero()
  
  const { 
    missions, 
    loading: missionsLoading,
    addMission, 
    completeMission, 
    deleteMission, 
    editMission 
  } = useMissions()
  
  const { 
    notifications, 
    showSuccess, 
    showXPGain, 
    showGoldGain, 
    showLevelUp, 
    showMissionComplete,
    showAchievement,
    removeNotification, 
    clearNotifications 
  } = useNotifications()

  const {
    toasts,
    removeToast,
    showMissionCompleteToast,
    showLevelUpToast
  } = useToast()

  const {
    checkAndProcessAchievements,
    getAchievementStats,
    isAchievementUnlocked,
    getRecentAchievements
  } = useAchievements(heroData, saveHero, showAchievement)

  const loading = heroLoading || missionsLoading

  // Função para completar missão com notificações
  const handleCompleteMission = async (missionId) => {
    try {
      const mission = missions.find(m => m.id === missionId)
      if (!mission) return

      // Completar a missão
      const completedMission = await completeMission(missionId)
      
      // Ganhar XP e ouro
      const xpGained = gainXP(mission.rewards.xp, 'missions')
      updateResources(mission.rewards.gold, 0, 0)

      // Atualizar estatísticas de dificuldade
      updateStats({
        [`missionDifficulty.${mission.difficulty}`]: (heroData.stats.missionDifficulty?.[mission.difficulty] || 0) + 1
      })

      // Atualizar sequência diária
      const streakResult = updateStreak(heroData, STREAK_TYPES.DAILY_MISSIONS)

      // Verificar conquistas
      const missionData = {
        ...completedMission,
        difficulty: mission.difficulty,
        completedAt: new Date().toISOString(),
        streakResult
      }
      
      await checkAndProcessAchievements(missionData)

      // Mostrar toasts de feedback visual
      showMissionCompleteToast(mission.title, mission.rewards.xp, mission.rewards.gold)
      
      if (streakResult.updated) {
        if (streakResult.isNewRecord) {
          showSuccess(`🔥 Nova sequência recorde: ${streakResult.streak} dias!`)
        } else {
          showSuccess(`🔥 Sequência: ${streakResult.streak} dias`)
        }
      }
      
      if (xpGained.leveledUp) {
        showLevelUpToast(xpGained.newLevel)
        showLevelUp(xpGained.newLevel, xpGained.levelBonuses)
      }
      
    } catch (error) {
      console.error('Erro ao completar missão:', error)
      showError('Erro ao completar missão')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <HeroDashboard 
            heroData={heroData}
            onUpdateResources={updateResources}
            getXPProgress={getXPProgress}
            onRestoreEnergy={() => showXPGain('Energia restaurada!', 0)}
            onRestoreHealth={() => showSuccess('Saúde restaurada!')}
          />
        )
      case 'missions':
        // Converter o formato das missões de objeto para array
        const allMissions = [
          ...(missions.daily || []).map(m => ({ ...m, type: 'daily' })),
          ...(missions.weekly || []).map(m => ({ ...m, type: 'weekly' })),
          ...(missions.campaign || []).map(m => ({ ...m, type: 'campaign' }))
        ]
        
        return (
          <MissionCenter
            missions={allMissions}
            heroData={heroData}
            onAddMission={addMission}
            onComplete={handleCompleteMission}
            onDelete={deleteMission}
            onEdit={editMission}
          />
        )
      case 'achievements':
        return (
          <AchievementCenter
            heroData={heroData}
          />
        )
      case 'stats':
        return (
          <StatsDashboard
            heroData={heroData}
          />
        )
      case 'profile':
        return (
          <UserProfile />
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-container">
          <h1 className="app-title">🏰 HabitQuest</h1>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              🏠 Dashboard
            </button>
            <button
              className={`nav-tab ${activeTab === 'missions' ? 'active' : ''}`}
              onClick={() => setActiveTab('missions')}
            >
              ⚔️ Missões
            </button>
            <button
              className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              🏆 Conquistas
            </button>
            <button
              className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Estatísticas
            </button>
            <button
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Perfil
            </button>
          </div>
        </div>
      </nav>

      <main className="app-content">
        {renderContent()}
      </main>

      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />

      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  )
}

// Componente principal com AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App