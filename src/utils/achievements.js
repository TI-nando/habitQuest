// Sistema de conquistas e badges
export const ACHIEVEMENT_CATEGORIES = {
  MISSIONS: 'missions',
  LEVELS: 'levels',
  STREAKS: 'streaks',
  RESOURCES: 'resources',
  SPECIAL: 'special'
}

export const ACHIEVEMENT_TYPES = {
  COUNTER: 'counter',      // Baseado em contadores (ex: completar X missões)
  MILESTONE: 'milestone',  // Marcos específicos (ex: alcançar nível 10)
  STREAK: 'streak',       // Sequências (ex: 7 dias consecutivos)
  SPECIAL: 'special'      // Conquistas especiais
}

// Definição de todas as conquistas
export const ACHIEVEMENTS = {
  // Conquistas de Missões
  FIRST_MISSION: {
    id: 'first_mission',
    title: 'Primeira Tarefa',
    description: 'Complete sua primeira tarefa de desenvolvimento',
    icon: '💻',
    category: ACHIEVEMENT_CATEGORIES.MISSIONS,
    type: ACHIEVEMENT_TYPES.MILESTONE,
    requirement: { missions: 1 },
    rewards: { xp: 50, gold: 25 },
    rarity: 'common'
  },
  
  MISSION_VETERAN: {
    id: 'mission_veteran',
    title: 'Desenvolvedor Experiente',
    description: 'Complete 10 tarefas de desenvolvimento',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.MISSIONS,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { missions: 10 },
    rewards: { xp: 200, gold: 100 },
    rarity: 'uncommon'
  },
  
  MISSION_MASTER: {
    id: 'mission_master',
    title: 'Mestre do Código',
    description: 'Complete 50 tarefas de desenvolvimento',
    icon: '🚀',
    category: ACHIEVEMENT_CATEGORIES.MISSIONS,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { missions: 50 },
    rewards: { xp: 500, gold: 250 },
    rarity: 'rare'
  },
  
  MISSION_LEGEND: {
    id: 'mission_legend',
    title: 'Lenda da Programação',
    description: 'Complete 100 tarefas de desenvolvimento',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.MISSIONS,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { missions: 100 },
    rewards: { xp: 1000, gold: 500 },
    rarity: 'legendary'
  },

  // Conquistas de Níveis
  LEVEL_UP: {
    id: 'level_up',
    title: 'Evoluindo',
    description: 'Alcance o nível 5',
    icon: '📈',
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    type: ACHIEVEMENT_TYPES.MILESTONE,
    requirement: { level: 5 },
    rewards: { xp: 100, gold: 50 },
    rarity: 'common'
  },
  
  EXPERIENCED: {
    id: 'experienced',
    title: 'Experiente',
    description: 'Alcance o nível 10',
    icon: '⭐',
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    type: ACHIEVEMENT_TYPES.MILESTONE,
    requirement: { level: 10 },
    rewards: { xp: 300, gold: 150 },
    rarity: 'uncommon'
  },
  
  EXPERT: {
    id: 'expert',
    title: 'Especialista',
    description: 'Alcance o nível 25',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    type: ACHIEVEMENT_TYPES.MILESTONE,
    requirement: { level: 25 },
    rewards: { xp: 750, gold: 375 },
    rarity: 'rare'
  },
  
  MASTER: {
    id: 'master',
    title: 'Mestre Supremo',
    description: 'Alcance o nível 50',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.LEVELS,
    type: ACHIEVEMENT_TYPES.MILESTONE,
    requirement: { level: 50 },
    rewards: { xp: 1500, gold: 750 },
    rarity: 'legendary'
  },

  // Conquistas de Sequências
  STREAK_STARTER: {
    id: 'streak_starter',
    title: 'Começando a Sequência',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    type: ACHIEVEMENT_TYPES.STREAK,
    requirement: { streak: 3 },
    rewards: { xp: 75, gold: 40 },
    rarity: 'common'
  },
  
  STREAK_KEEPER: {
    id: 'streak_keeper',
    title: 'Guardião da Sequência',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    type: ACHIEVEMENT_TYPES.STREAK,
    requirement: { streak: 7 },
    rewards: { xp: 200, gold: 100 },
    rarity: 'uncommon'
  },
  
  STREAK_MASTER: {
    id: 'streak_master',
    title: 'Mestre da Consistência',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🚀',
    category: ACHIEVEMENT_CATEGORIES.STREAKS,
    type: ACHIEVEMENT_TYPES.STREAK,
    requirement: { streak: 30 },
    rewards: { xp: 1000, gold: 500 },
    rarity: 'rare'
  },

  // Conquistas de Recursos
  GOLD_COLLECTOR: {
    id: 'gold_collector',
    title: 'Colecionador de Pontos',
    description: 'Acumule 1000 pontos',
    icon: '🎯',
    category: ACHIEVEMENT_CATEGORIES.RESOURCES,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { totalGold: 1000 },
    rewards: { xp: 300, gold: 200 },
    rarity: 'uncommon'
  },
  
  GOLD_HOARDER: {
    id: 'gold_hoarder',
    title: 'Acumulador de Conquistas',
    description: 'Acumule 5000 pontos',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.RESOURCES,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { totalGold: 5000 },
    rewards: { xp: 750, gold: 500 },
    rarity: 'rare'
  },
  
  XP_HUNTER: {
    id: 'xp_hunter',
    title: 'Caçador de Experiência',
    description: 'Ganhe 5000 pontos de XP',
    icon: '📊',
    category: ACHIEVEMENT_CATEGORIES.RESOURCES,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { totalXP: 5000 },
    rewards: { xp: 500, gold: 250 },
    rarity: 'uncommon'
  },

  // Conquistas Especiais
  EARLY_BIRD: {
    id: 'early_bird',
    title: 'Desenvolvedor Matinal',
    description: 'Complete uma tarefa antes das 8h',
    icon: '🌅',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    type: ACHIEVEMENT_TYPES.SPECIAL,
    requirement: { earlyMission: true },
    rewards: { xp: 100, gold: 50 },
    rarity: 'uncommon'
  },
  
  NIGHT_OWL: {
    id: 'night_owl',
    title: 'Programador Noturno',
    description: 'Complete uma tarefa depois das 22h',
    icon: '🌙',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    type: ACHIEVEMENT_TYPES.SPECIAL,
    requirement: { lateMission: true },
    rewards: { xp: 100, gold: 50 },
    rarity: 'uncommon'
  },
  
  PERFECTIONIST: {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Complete 10 tarefas difíceis',
    icon: '💯',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    type: ACHIEVEMENT_TYPES.COUNTER,
    requirement: { hardMissions: 10 },
    rewards: { xp: 400, gold: 200 },
    rarity: 'rare'
  }
}

// Raridades e suas cores
export const RARITY_CONFIG = {
  common: {
    name: 'Comum',
    color: '#9E9E9E',
    bgColor: 'rgba(158, 158, 158, 0.1)',
    borderColor: 'rgba(158, 158, 158, 0.3)'
  },
  uncommon: {
    name: 'Incomum',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)'
  },
  rare: {
    name: 'Raro',
    color: '#2196F3',
    bgColor: 'rgba(33, 150, 243, 0.1)',
    borderColor: 'rgba(33, 150, 243, 0.3)'
  },
  epic: {
    name: 'Épico',
    color: '#9C27B0',
    bgColor: 'rgba(156, 39, 176, 0.1)',
    borderColor: 'rgba(156, 39, 176, 0.3)'
  },
  legendary: {
    name: 'Lendário',
    color: '#FF9800',
    bgColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: 'rgba(255, 152, 0, 0.3)'
  }
}

// Verificar se uma conquista foi desbloqueada
export const checkAchievement = (achievementId, heroData, missionData = {}) => {
  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement || !heroData) return false

  const { requirement } = achievement
  const { stats } = heroData

  switch (achievement.type) {
    case ACHIEVEMENT_TYPES.MILESTONE:
      if (requirement.level && heroData.level >= requirement.level) return true
      if (requirement.missions && stats.missionsCompleted >= requirement.missions) return true
      break

    case ACHIEVEMENT_TYPES.COUNTER:
      if (requirement.missions && stats.missionsCompleted >= requirement.missions) return true
      if (requirement.totalGold && stats.totalGoldEarned >= requirement.totalGold) return true
      if (requirement.totalXP && stats.totalXPGained >= requirement.totalXP) return true
      if (requirement.hardMissions && (stats.missionDifficulty?.hard || 0) >= requirement.hardMissions) return true
      break

    case ACHIEVEMENT_TYPES.STREAK:
      if (requirement.streak && stats.longestStreak >= requirement.streak) return true
      break

    case ACHIEVEMENT_TYPES.SPECIAL:
      if (requirement.earlyMission && missionData.completedEarly) return true
      if (requirement.lateMission && missionData.completedLate) return true
      break

    default:
      return false
  }

  return false
}

// Verificar todas as conquistas
export const checkAllAchievements = (heroData, missionData = {}) => {
  const unlockedAchievements = []
  
  Object.keys(ACHIEVEMENTS).forEach(achievementId => {
    if (checkAchievement(achievementId, heroData, missionData)) {
      // Verificar se já foi desbloqueada
      const alreadyUnlocked = heroData.achievements?.includes(achievementId)
      if (!alreadyUnlocked) {
        unlockedAchievements.push(ACHIEVEMENTS[achievementId])
      }
    }
  })

  return unlockedAchievements
}

// Obter conquistas por categoria
export const getAchievementsByCategory = (category) => {
  return Object.values(ACHIEVEMENTS).filter(achievement => 
    achievement.category === category
  )
}

// Obter conquistas por raridade
export const getAchievementsByRarity = (rarity) => {
  return Object.values(ACHIEVEMENTS).filter(achievement => 
    achievement.rarity === rarity
  )
}

// Calcular progresso de uma conquista
export const getAchievementProgress = (achievementId, heroData) => {
  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement || !heroData) return { current: 0, required: 1, percentage: 0 }

  const { requirement } = achievement
  const { stats } = heroData

  let current = 0
  let required = 1

  switch (achievement.type) {
    case ACHIEVEMENT_TYPES.MILESTONE:
      if (requirement.level) {
        current = heroData.level
        required = requirement.level
      } else if (requirement.missions) {
        current = stats.missionsCompleted
        required = requirement.missions
      }
      break

    case ACHIEVEMENT_TYPES.COUNTER:
      if (requirement.missions) {
        current = stats.missionsCompleted
        required = requirement.missions
      } else if (requirement.totalGold) {
        current = stats.totalGoldEarned
        required = requirement.totalGold
      } else if (requirement.totalXP) {
        current = stats.totalXPGained
        required = requirement.totalXP
      } else if (requirement.hardMissions) {
        current = stats.missionDifficulty?.hard || 0
        required = requirement.hardMissions
      }
      break

    case ACHIEVEMENT_TYPES.STREAK:
      if (requirement.streak) {
        current = stats.longestStreak
        required = requirement.streak
      }
      break

    default:
      break
  }

  const percentage = Math.min((current / required) * 100, 100)

  return {
    current: Math.min(current, required),
    required,
    percentage: Math.round(percentage)
  }
}

// Obter estatísticas de conquistas
export const getAchievementStats = (heroData) => {
  const totalAchievements = Object.keys(ACHIEVEMENTS).length
  const unlockedAchievements = heroData.achievements?.length || 0
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100)

  const rarityStats = {}
  Object.keys(RARITY_CONFIG).forEach(rarity => {
    const totalInRarity = getAchievementsByRarity(rarity).length
    const unlockedInRarity = heroData.achievements?.filter(id => 
      ACHIEVEMENTS[id]?.rarity === rarity
    ).length || 0
    
    rarityStats[rarity] = {
      total: totalInRarity,
      unlocked: unlockedInRarity,
      percentage: totalInRarity > 0 ? Math.round((unlockedInRarity / totalInRarity) * 100) : 0
    }
  })

  return {
    total: totalAchievements,
    unlocked: unlockedAchievements,
    completionPercentage,
    rarityStats
  }
}