// Sistema de níveis e XP
export const LEVEL_SYSTEM = {
  // XP base necessário para o nível 2
  BASE_XP: 100,
  
  // Multiplicador de crescimento por nível
  GROWTH_MULTIPLIER: 1.5,
  
  // Nível máximo
  MAX_LEVEL: 100,
  
  // Bônus por nível
  LEVEL_BONUSES: {
    GOLD_MULTIPLIER: 0.1,    // +10% de ouro por nível
    XP_MULTIPLIER: 0.05,     // +5% de XP por nível
    ENERGY_BONUS: 5,         // +5 energia máxima por nível
    HEALTH_BONUS: 10         // +10 vida máxima por nível
  }
}

// Calcula XP necessário para um nível específico
export const calculateXPForLevel = (level) => {
  if (level <= 1) return 0
  
  let totalXP = 0
  for (let i = 2; i <= level; i++) {
    totalXP += Math.floor(LEVEL_SYSTEM.BASE_XP * Math.pow(1.2, i - 2))
  }
  
  return totalXP
}

// Calcula XP necessário para o próximo nível
export const calculateXPForNextLevel = (currentLevel) => {
  if (currentLevel >= LEVEL_SYSTEM.MAX_LEVEL) return 0
  
  return Math.floor(LEVEL_SYSTEM.BASE_XP * Math.pow(1.2, currentLevel - 1))
}

// Calcula nível baseado no XP total
export const calculateLevelFromXP = (totalXP) => {
  if (totalXP < 0) return 1
  
  let level = 1
  let xpNeeded = 0
  
  while (level < LEVEL_SYSTEM.MAX_LEVEL) {
    const xpForNextLevel = calculateXPForNextLevel(level)
    if (xpNeeded + xpForNextLevel > totalXP) break
    
    xpNeeded += xpForNextLevel
    level++
  }
  
  return level
}

// Calcula XP atual no nível (progresso para o próximo nível)
export const calculateCurrentLevelXP = (totalXP) => {
  const level = calculateLevelFromXP(totalXP)
  const xpForCurrentLevel = calculateXPForLevel(level)
  
  return totalXP - xpForCurrentLevel
}

// Calcula progresso percentual para o próximo nível
// Calcula progresso do nível atual
export const calculateLevelProgress = (totalXP, currentLevel) => {
  if (!currentLevel) {
    currentLevel = calculateLevelFromXP(totalXP)
  }
  
  if (currentLevel >= LEVEL_SYSTEM.MAX_LEVEL) {
    return {
      current: 0,
      needed: 0,
      percentage: 100
    }
  }
  
  const currentLevelXP = calculateCurrentLevelXP(totalXP)
  const xpForNextLevel = calculateXPForNextLevel(currentLevel)
  const percentage = xpForNextLevel > 0 ? Math.round((currentLevelXP / xpForNextLevel) * 100 * 100) / 100 : 100
  
  return {
    current: currentLevelXP,
    needed: xpForNextLevel,
    percentage: percentage
  }
}

// Verifica se houve level up
export const checkLevelUp = (oldXP, newXP) => {
  const oldLevel = calculateLevelFromXP(oldXP)
  const newLevel = calculateLevelFromXP(newXP)
  
  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
    levelsGained: newLevel - oldLevel
  }
}

// Calcula bônus baseado no nível
export const calculateLevelBonuses = (level) => {
  return {
    goldMultiplier: 1 + (level - 1) * LEVEL_SYSTEM.LEVEL_BONUSES.GOLD_MULTIPLIER,
    xpMultiplier: 1 + (level - 1) * LEVEL_SYSTEM.LEVEL_BONUSES.XP_MULTIPLIER,
    maxEnergy: 100 + (level - 1) * LEVEL_SYSTEM.LEVEL_BONUSES.ENERGY_BONUS,
    maxHealth: 100 + (level - 1) * LEVEL_SYSTEM.LEVEL_BONUSES.HEALTH_BONUS
  }
}

// Calcula recompensas ajustadas pelo nível
export const calculateAdjustedRewards = (baseRewards, level) => {
  const bonuses = calculateLevelBonuses(level)
  
  return {
    xp: Math.floor(baseRewards.xp * bonuses.xpMultiplier),
    gold: Math.floor(baseRewards.gold * bonuses.goldMultiplier)
  }
}

// Gera estatísticas de nível
export const generateLevelStats = (level) => {
  const bonuses = calculateLevelBonuses(level)
  const xpForCurrentLevel = calculateXPForLevel(level)
  const xpForNextLevel = level < LEVEL_SYSTEM.MAX_LEVEL ? calculateXPForNextLevel(level) : 0
  
  return {
    level,
    xpForCurrentLevel,
    xpForNextLevel,
    bonuses,
    isMaxLevel: level >= LEVEL_SYSTEM.MAX_LEVEL
  }
}

// Calcula XP necessário para alcançar um nível específico
export const calculateXPToReachLevel = (currentXP, targetLevel) => {
  const currentLevel = calculateLevelFromXP(currentXP)
  
  if (targetLevel <= currentLevel) return 0
  
  const xpNeededForTarget = calculateXPForLevel(targetLevel)
  return xpNeededForTarget - currentXP
}

// Simula ganho de XP e retorna informações detalhadas
export const simulateXPGain = (currentXP, xpGain) => {
  const oldLevel = calculateLevelFromXP(currentXP)
  const newXP = currentXP + xpGain
  const newLevel = calculateLevelFromXP(newXP)
  
  const levelUp = checkLevelUp(currentXP, newXP)
  const oldProgress = calculateLevelProgress(currentXP)
  const newProgress = calculateLevelProgress(newXP)
  
  return {
    oldXP: currentXP,
    newXP,
    xpGain,
    levelUp,
    oldProgress,
    newProgress,
    oldBonuses: calculateLevelBonuses(oldLevel),
    newBonuses: calculateLevelBonuses(newLevel)
  }
}