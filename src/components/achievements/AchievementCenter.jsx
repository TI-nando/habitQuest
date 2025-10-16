import React, { useState, useMemo } from 'react'
import './AchievementCenter.css'
import AchievementCard from './AchievementCard'
import { 
  ACHIEVEMENTS, 
  ACHIEVEMENT_CATEGORIES, 
  RARITY_CONFIG,
  getAchievementsByCategory,
  getAchievementsByRarity,
  getAchievementStats
} from '../../utils/achievements'

const AchievementCenter = ({ heroData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [sortBy, setSortBy] = useState('rarity') // rarity, progress, alphabetical
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false)

  const achievementStats = useMemo(() => 
    getAchievementStats(heroData), [heroData]
  )

  const filteredAchievements = useMemo(() => {
    let achievements = Object.values(ACHIEVEMENTS)

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      achievements = getAchievementsByCategory(selectedCategory)
    }

    // Filtrar por raridade
    if (selectedRarity !== 'all') {
      achievements = achievements.filter(achievement => 
        achievement.rarity === selectedRarity
      )
    }

    // Filtrar apenas desbloqueadas
    if (showOnlyUnlocked) {
      achievements = achievements.filter(achievement =>
        heroData.achievements?.includes(achievement.id)
      )
    }

    // Ordenar
    achievements.sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary']
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        
        case 'progress':
          const aUnlocked = heroData.achievements?.includes(a.id)
          const bUnlocked = heroData.achievements?.includes(b.id)
          if (aUnlocked && !bUnlocked) return -1
          if (!aUnlocked && bUnlocked) return 1
          return 0
        
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        
        default:
          return 0
      }
    })

    return achievements
  }, [selectedCategory, selectedRarity, sortBy, showOnlyUnlocked, heroData])

  const categoryStats = useMemo(() => {
    const stats = {}
    Object.values(ACHIEVEMENT_CATEGORIES).forEach(category => {
      const categoryAchievements = getAchievementsByCategory(category)
      const unlockedInCategory = categoryAchievements.filter(achievement =>
        heroData.achievements?.includes(achievement.id)
      ).length
      
      stats[category] = {
        total: categoryAchievements.length,
        unlocked: unlockedInCategory,
        percentage: categoryAchievements.length > 0 
          ? Math.round((unlockedInCategory / categoryAchievements.length) * 100) 
          : 0
      }
    })
    return stats
  }, [heroData])

  const getCategoryIcon = (category) => {
    const icons = {
      [ACHIEVEMENT_CATEGORIES.MISSIONS]: '🎯',
      [ACHIEVEMENT_CATEGORIES.LEVELS]: '📈',
      [ACHIEVEMENT_CATEGORIES.STREAKS]: '🔥',
      [ACHIEVEMENT_CATEGORIES.RESOURCES]: '💰',
      [ACHIEVEMENT_CATEGORIES.SPECIAL]: '⭐'
    }
    return icons[category] || '🏆'
  }

  const getCategoryName = (category) => {
    const names = {
      [ACHIEVEMENT_CATEGORIES.MISSIONS]: 'Missões',
      [ACHIEVEMENT_CATEGORIES.LEVELS]: 'Níveis',
      [ACHIEVEMENT_CATEGORIES.STREAKS]: 'Sequências',
      [ACHIEVEMENT_CATEGORIES.RESOURCES]: 'Recursos',
      [ACHIEVEMENT_CATEGORIES.SPECIAL]: 'Especiais'
    }
    return names[category] || 'Todas'
  }

  return (
    <div className="achievement-center">
      <div className="achievement-header">
        <div className="header-content">
          <h2 className="center-title">
            🏆 Centro de Conquistas
          </h2>
          <div className="achievement-summary">
            <div className="summary-stat">
              <span className="stat-value">{achievementStats.unlocked}</span>
              <span className="stat-label">/ {achievementStats.total} Desbloqueadas</span>
            </div>
            <div className="summary-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${achievementStats.completionPercentage}%` }}
                />
              </div>
              <span className="progress-text">{achievementStats.completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="achievement-filters">
        <div className="filter-section">
          <label className="filter-label">Categoria:</label>
          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span className="category-icon">🏆</span>
              <span className="category-name">Todas</span>
              <span className="category-count">({achievementStats.total})</span>
            </button>
            {Object.values(ACHIEVEMENT_CATEGORIES).map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{getCategoryName(category)}</span>
                <span className="category-count">
                  ({categoryStats[category]?.unlocked || 0}/{categoryStats[category]?.total || 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Raridade:</label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas</option>
              {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
                <option key={rarity} value={rarity}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="rarity">Raridade</option>
              <option value="progress">Progresso</option>
              <option value="alphabetical">Alfabética</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showOnlyUnlocked}
                onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              />
              <span className="checkbox-label">Apenas desbloqueadas</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rarity-stats">
        {Object.entries(RARITY_CONFIG).map(([rarity, config]) => {
          const stats = achievementStats.rarityStats[rarity]
          return (
            <div key={rarity} className="rarity-stat">
              <div 
                className="rarity-indicator"
                style={{ backgroundColor: config.color }}
              />
              <span className="rarity-name">{config.name}</span>
              <span className="rarity-count">
                {stats?.unlocked || 0}/{stats?.total || 0}
              </span>
            </div>
          )
        })}
      </div>

      <div className="achievements-grid">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              heroData={heroData}
              isUnlocked={heroData.achievements?.includes(achievement.id)}
              showProgress={!heroData.achievements?.includes(achievement.id)}
            />
          ))
        ) : (
          <div className="no-achievements">
            <div className="no-achievements-icon">🏆</div>
            <h3>Nenhuma conquista encontrada</h3>
            <p>Tente ajustar os filtros para ver mais conquistas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AchievementCenter