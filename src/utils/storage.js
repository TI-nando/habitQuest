// Utilitários para persistência de dados no localStorage

export const STORAGE_KEYS = {
  HERO_DATA: 'habitdev_hero_data',
  MISSIONS: 'habitdev_missions',
  ACHIEVEMENTS: 'habitdev_achievements',
  SETTINGS: 'habitdev_settings'
}

// Função para gerar chaves específicas do usuário
const getUserStorageKey = (userId, baseKey) => {
  return `${baseKey}_user_${userId}`
}

// Funções auxiliares para localStorage
export const storage = {
  // Salvar dados
  save: (key, data, userId = null) => {
    try {
      const storageKey = userId ? getUserStorageKey(userId, key) : key
      localStorage.setItem(storageKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      return false
    }
  },

  // Carregar dados
  load: (key, defaultValue = null, userId = null) => {
    try {
      const storageKey = userId ? getUserStorageKey(userId, key) : key
      const data = localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      return defaultValue
    }
  },

  // Remover dados
  remove: (key, userId = null) => {
    try {
      const storageKey = userId ? getUserStorageKey(userId, key) : key
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error('Erro ao remover dados:', error)
      return false
    }
  },

  // Limpar todos os dados de um usuário específico
  clearUser: (userId) => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        const userKey = getUserStorageKey(userId, key)
        localStorage.removeItem(userKey)
      })
      return true
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error)
      return false
    }
  },

  // Limpar todos os dados (mantido para compatibilidade)
  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      return false
    }
  }
}

// Dados padrão do herói
export const getDefaultHeroData = () => ({
  name: 'Desenvolvedor',
  level: 1,
  xp: 0,
  gold: 100,
  energy: 100,
  maxEnergy: 100,
  health: 100,
  maxHealth: 100,
  bonuses: {
    goldMultiplier: 1.0,
    xpMultiplier: 1.0,
    maxEnergyBonus: 0,
    maxHealthBonus: 0
  },
  achievements: [],
  streaks: {
    daily_missions: {
      current: 0,
      longest: 0,
      lastDate: null,
      history: []
    },
    xp_gain: {
      current: 0,
      longest: 0,
      lastDate: null,
      history: []
    }
  },
  stats: {
    missionsCompleted: 0,
    totalXPGained: 0,
    totalGoldEarned: 0,
    currentStreak: 0,
    longestStreak: 0,
    levelsGained: 0,
    achievementsUnlocked: 0,
    totalAchievementXP: 0,
    totalAchievementGold: 0,
    xpSources: {
      missions: 0,
      achievements: 0,
      bonuses: 0
    },
    missionDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    }
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString()
})

// Dados padrão das missões
export const getDefaultMissions = () => ({
  daily: [],
  weekly: [],
  campaign: []
})

// Funções específicas para dados do herói
export const saveHeroData = (heroData, userId = null) => {
  return storage.save(STORAGE_KEYS.HERO_DATA, heroData, userId)
}

export const loadHeroData = (userId = null) => {
  return storage.load(STORAGE_KEYS.HERO_DATA, getDefaultHeroData(), userId)
}

export const updateHeroStats = (statUpdates, userId = null) => {
  const heroData = loadHeroData(userId)
  Object.keys(statUpdates).forEach(key => {
    if (heroData.stats && heroData.stats.hasOwnProperty(key)) {
      heroData.stats[key] = statUpdates[key]
    }
  })
  
  saveHeroData(heroData, userId)
  return heroData
}

// Funções específicas para missões
export const missionStorage = {
  save: (missions, userId = null) => storage.save(STORAGE_KEYS.MISSIONS, missions, userId),
  load: (userId = null) => storage.load(STORAGE_KEYS.MISSIONS, getDefaultMissions(), userId),
  
  // Adicionar nova missão
  add: (mission, userId = null) => {
    const missions = missionStorage.load(userId)
    const newMission = {
      id: Date.now().toString(),
      ...mission,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    
    missions[mission.type].push(newMission)
    missionStorage.save(missions, userId)
    return newMission
  },

  // Completar missão
  complete: (missionId, type, userId = null) => {
    const missions = missionStorage.load(userId)
    const mission = missions[type].find(m => m.id === missionId)
    
    if (mission && !mission.completed) {
      mission.completed = true
      mission.completedAt = new Date().toISOString()
      
      // Calcular recompensas
      const rewards = calculateMissionRewards(mission)
      
      // Atualizar herói
      const heroData = loadHeroData(userId)
      const updatedHero = {
        ...heroData,
        xp: heroData.xp + rewards.xp,
        gold: heroData.gold + rewards.gold,
        stats: {
          ...heroData.stats,
          missionsCompleted: heroData.stats.missionsCompleted + 1,
          totalXPGained: heroData.stats.totalXPGained + rewards.xp,
          totalGoldEarned: heroData.stats.totalGoldEarned + rewards.gold
        }
      }
      
      saveHeroData(updatedHero, userId)
      missionStorage.save(missions, userId)
      
      return { mission, rewards }
    }
    
    return null
  },

  // Deletar missão
  delete: (missionId, type, userId = null) => {
    const missions = missionStorage.load(userId)
    missions[type] = missions[type].filter(m => m.id !== missionId)
    missionStorage.save(missions, userId)
    return missions
  },

  // Editar missão
  edit: (missionId, type, updates, userId = null) => {
    const missions = missionStorage.load(userId)
    const missionIndex = missions[type].findIndex(m => m.id === missionId)
    
    if (missionIndex !== -1) {
      missions[type][missionIndex] = {
        ...missions[type][missionIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      missionStorage.save(missions, userId)
      return missions[type][missionIndex]
    }
    
    return null
  }
}

// Calcular recompensas da missão
export const calculateMissionRewards = (mission) => {
  // Valores fixos de XP por dificuldade para tornar mais desafiador
  const xpByDifficulty = {
    easy: 10,    // Fácil: 10 XP
    medium: 25,  // Médio: 25 XP
    hard: 50     // Difícil: 50 XP
  }

  // Multiplicadores de ouro baseados no tipo de missão
  const goldMultipliers = {
    daily: 1,
    weekly: 2,
    campaign: 3
  }

  const baseXP = xpByDifficulty[mission.difficulty] || xpByDifficulty.easy
  const goldMultiplier = goldMultipliers[mission.type] || goldMultipliers.daily
  const baseGold = Math.round(baseXP * 0.4) // Ouro é 40% do XP base

  return {
    xp: baseXP,
    gold: Math.round(baseGold * goldMultiplier)
  }
}

// Exportações adicionais para compatibilidade
export const load = storage.load
export const save = storage.save
export const remove = storage.remove