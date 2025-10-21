import React, { useState, useMemo } from 'react'
import './StatsDashboard.css'
import StatsChart from './StatsChart'
import { getAchievementStats } from '../../utils/achievements'

const StatsDashboard = ({ heroData, missions = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all') // all, week, month
  const [selectedChart, setSelectedChart] = useState('overview') // overview, missions, xp, achievements

  // Calcular estatísticas gerais
  const generalStats = useMemo(() => {
    if (!heroData) return {}

    const stats = heroData.stats || {}
    const achievementStats = getAchievementStats(heroData)

    return {
      level: heroData.level || 1,
      totalXP: heroData.xp || 0,
      totalGold: heroData.gold || 0,
      missionsCompleted: stats.missionsCompleted || 0,
      currentStreak: stats.currentStreak || 0,
      longestStreak: stats.longestStreak || 0,
      achievementsUnlocked: achievementStats.unlocked || 0,
      totalAchievements: achievementStats.total || 0,
      completionRate: achievementStats.completionPercentage || 0
    }
  }, [heroData])

  // Dados para gráfico de missões por dificuldade
  const missionDifficultyData = useMemo(() => {
    if (!heroData?.stats?.missionDifficulty) return []

    const difficulty = heroData.stats.missionDifficulty
    return [
      { label: 'Fácil', value: difficulty.easy || 0 },
      { label: 'Médio', value: difficulty.medium || 0 },
      { label: 'Difícil', value: difficulty.hard || 0 }
    ].filter(item => item.value > 0)
  }, [heroData])

  // Dados para gráfico de fontes de XP
  const xpSourcesData = useMemo(() => {
    if (!heroData?.stats?.xpSources) return []

    const sources = heroData.stats.xpSources
    return [
      { label: 'Missões', value: sources.missions || 0 },
      { label: 'Conquistas', value: sources.achievements || 0 },
      { label: 'Bônus', value: sources.bonuses || 0 }
    ].filter(item => item.value > 0)
  }, [heroData])

  // Dados para gráfico de progresso semanal (simulado)
  const weeklyProgressData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const currentDay = new Date().getDay()
    
    return days.map((day, index) => ({
      label: day,
      value: index <= currentDay ? Math.floor(Math.random() * 5) + 1 : 0
    }))
  }, [])

  // Dados para gráfico de conquistas por raridade
  const achievementRarityData = useMemo(() => {
    if (!heroData) return []

    const achievementStats = getAchievementStats(heroData)
    const rarityStats = achievementStats.rarityStats || {}

    return Object.entries(rarityStats).map(([rarity, stats]) => ({
      label: rarity.charAt(0).toUpperCase() + rarity.slice(1),
      value: stats.unlocked || 0
    })).filter(item => item.value > 0)
  }, [heroData])

  const renderOverviewStats = () => (
    <div className="overview-stats">
      <div className="stat-cards">
        <div className="stat-card level gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{generalStats.level}</div>
            <div className="stat-label">Nível</div>
          </div>
        </div>

        <div className="stat-card xp gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{generalStats.totalXP.toLocaleString()}</div>
            <div className="stat-label">XP Total</div>
          </div>
        </div>

        <div className="stat-card gold gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">🪙</div>
          <div className="stat-content">
            <div className="stat-value">{generalStats.totalGold.toLocaleString()}</div>
            <div className="stat-label">Pontos</div>
          </div>
        </div>

        <div className="stat-card missions gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">⚔️</div>
          <div className="stat-content">
            <div className="stat-value">{generalStats.missionsCompleted}</div>
            <div className="stat-label">Missões</div>
          </div>
        </div>

        <div className="stat-card streak gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{generalStats.currentStreak}</div>
            <div className="stat-label">Sequência</div>
          </div>
        </div>

        <div className="stat-card achievements gamified-card">
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">
              {generalStats.achievementsUnlocked}/{generalStats.totalAchievements}
            </div>
            <div className="stat-label">Conquistas</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <StatsChart
          data={missionDifficultyData}
          type="pie"
          title="Missões por Dificuldade"
          showValues={true}
        />

        <StatsChart
          data={weeklyProgressData}
          type="bar"
          title="Progresso Semanal"
          color="#4CAF50"
          showValues={true}
        />
      </div>
    </div>
  )

  const renderMissionStats = () => (
    <div className="mission-stats">
      <div className="stats-summary">
        <h3>📊 Estatísticas de Missões</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Completadas:</span>
            <span className="summary-value">{generalStats.missionsCompleted}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Sequência Atual:</span>
            <span className="summary-value">{generalStats.currentStreak} dias</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Melhor Sequência:</span>
            <span className="summary-value">{generalStats.longestStreak} dias</span>
          </div>
        </div>
      </div>

      <StatsChart
        data={missionDifficultyData}
        type="bar"
        title="Distribuição por Dificuldade"
        color="#667eea"
        height={250}
      />

      <StatsChart
        data={weeklyProgressData}
        type="line"
        title="Missões Completadas (Última Semana)"
        color="#4CAF50"
        height={200}
      />
    </div>
  )

  const renderXPStats = () => (
    <div className="xp-stats">
      <div className="stats-summary">
        <h3>⭐ Estatísticas de XP</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">XP Total:</span>
            <span className="summary-value">{generalStats.totalXP.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Nível Atual:</span>
            <span className="summary-value">{generalStats.level}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Níveis Ganhos:</span>
            <span className="summary-value">{heroData?.stats?.levelsGained || 0}</span>
          </div>
        </div>
      </div>

      <StatsChart
        data={xpSourcesData}
        type="pie"
        title="Fontes de XP"
        showValues={true}
      />

      <StatsChart
        data={[
          { label: 'Nível 1-10', value: Math.min(generalStats.level, 10) },
          { label: 'Nível 11-25', value: Math.max(0, Math.min(generalStats.level - 10, 15)) },
          { label: 'Nível 26-50', value: Math.max(0, Math.min(generalStats.level - 25, 25)) },
          { label: 'Nível 50+', value: Math.max(0, generalStats.level - 50) }
        ].filter(item => item.value > 0)}
        type="bar"
        title="Progresso por Faixa de Nível"
        color="#FF9800"
        height={200}
      />
    </div>
  )

  const renderAchievementStats = () => (
    <div className="achievement-stats">
      <div className="stats-summary">
        <h3>🏆 Estatísticas de Conquistas</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Desbloqueadas:</span>
            <span className="summary-value">
              {generalStats.achievementsUnlocked}/{generalStats.totalAchievements}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Taxa de Conclusão:</span>
            <span className="summary-value">{generalStats.completionRate}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">XP de Conquistas:</span>
            <span className="summary-value">
              {heroData?.stats?.totalAchievementXP?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      <StatsChart
        data={achievementRarityData}
        type="pie"
        title="Conquistas por Raridade"
        showValues={true}
      />

      <div className="completion-progress">
        <h4>Progresso de Conclusão</h4>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${generalStats.completionRate}%` }}
            />
          </div>
          <span className="progress-text">{generalStats.completionRate}%</span>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedChart) {
      case 'missions':
        return renderMissionStats()
      case 'xp':
        return renderXPStats()
      case 'achievements':
        return renderAchievementStats()
      case 'overview':
      default:
        return renderOverviewStats()
    }
  }

  return (
    <div className="stats-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">📊 Dashboard de Estatísticas</h2>
        
        <div className="dashboard-controls">
          <div className="chart-selector">
            <button
              className={`chart-btn ${selectedChart === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedChart('overview')}
            >
              📈 Visão Geral
            </button>
            <button
              className={`chart-btn ${selectedChart === 'missions' ? 'active' : ''}`}
              onClick={() => setSelectedChart('missions')}
            >
              ⚔️ Missões
            </button>
            <button
              className={`chart-btn ${selectedChart === 'xp' ? 'active' : ''}`}
              onClick={() => setSelectedChart('xp')}
            >
              ⭐ XP
            </button>
            <button
              className={`chart-btn ${selectedChart === 'achievements' ? 'active' : ''}`}
              onClick={() => setSelectedChart('achievements')}
            >
              🏆 Conquistas
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default StatsDashboard