import { useState, useEffect, useCallback } from 'react'
import { 
  saveHeroData, 
  loadHeroData, 
  getDefaultHeroData,
  updateHeroStats 
} from '../utils/storage'
import { 
  calculateLevelFromXP, 
  calculateCurrentLevelXP, 
  calculateXPForNextLevel,
  calculateLevelProgress,
  checkLevelUp,
  calculateLevelBonuses,
  simulateXPGain
} from '../utils/levelSystem'
import { checkTitleChange } from '../utils/developerTitles'
import { updateStreak, STREAK_TYPES } from '../utils/streaks'
import { useAuth } from './useAuth'

export const useHero = () => {
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Carrega dados do herói
  const loadHero = useCallback(() => {
    try {
      const userId = user?.id
      const savedHero = loadHeroData(userId)
      if (savedHero) {
        // Recalcula nível baseado no XP total para garantir consistência
        const calculatedLevel = calculateLevelFromXP(savedHero.xp)
        const updatedHero = {
          ...savedHero,
          level: calculatedLevel,
          bonuses: calculateLevelBonuses(calculatedLevel)
        }
        setHeroData(updatedHero)
        return updatedHero
      } else {
        const defaultHero = getDefaultHeroData()
        setHeroData(defaultHero)
        saveHeroData(defaultHero, userId)
        return defaultHero
      }
    } catch (error) {
      console.error('Erro ao carregar dados do herói:', error)
      const defaultHero = getDefaultHeroData()
      setHeroData(defaultHero)
      return defaultHero
    }
  }, [user?.id])

  // Carregar dados do herói
  useEffect(() => {
    const initializeHero = async () => {
      try {
        await loadHero()
      } finally {
        setLoading(false)
      }
    }

    initializeHero()
  }, [loadHero])

  // Salvar dados do herói
  const saveHero = useCallback((data) => {
    try {
      const userId = user?.id
      saveHeroData(data, userId)
      setHeroData(data)
    } catch (error) {
      console.error('Erro ao salvar dados do herói:', error)
    }
  }, [user?.id])

  // Ganhar XP e verificar level up
  const gainXP = useCallback((amount, source = 'Missão') => {
    if (!heroData || amount <= 0) return { leveledUp: false }

    const simulation = simulateXPGain(heroData.xp, amount)
    const titleChange = checkTitleChange(heroData.level, simulation.levelUp.newLevel)
    
    // Atualizar streak quando XP é ganho
    const streakResult = updateStreak(heroData, STREAK_TYPES.XP_GAIN)
    
    const updatedHero = {
      ...heroData,
      xp: simulation.newXP,
      level: simulation.levelUp.newLevel,
      bonuses: simulation.newBonuses,
      streaks: heroData.streaks || {},
      stats: {
        ...heroData.stats,
        totalXPGained: heroData.stats.totalXPGained + amount,
        currentStreak: streakResult.streak || heroData.stats.currentStreak || 0,
        longestStreak: Math.max(streakResult.streak || 0, heroData.stats.longestStreak || 0),
        xpSources: {
          ...heroData.stats.xpSources,
          [source]: (heroData.stats.xpSources[source] || 0) + amount
        }
      }
    }

    // Atualizar energia máxima se houve level up
    if (simulation.levelUp.leveledUp) {
      updatedHero.maxEnergy = simulation.newBonuses.maxEnergy
      updatedHero.stats.levelsGained = heroData.stats.levelsGained + simulation.levelUp.levelsGained
    }

    saveHero(updatedHero)
    
    return {
      ...simulation.levelUp,
      xpGained: amount,
      newBonuses: simulation.newBonuses,
      titleChange,
      streakUpdated: streakResult.updated,
      currentStreak: streakResult.streak
    }
  }, [heroData, saveHero])

  // Atualizar recursos
  const updateResources = useCallback((gold = 0, energy = 0, health = 0) => {
    if (!heroData) return

    const updatedHero = {
      ...heroData,
      gold: Math.max(0, Math.min(9999, heroData.gold + gold)), // Limite máximo de 9999
      energy: Math.max(0, Math.min(heroData.maxEnergy || 100, heroData.energy + energy)),
      health: Math.max(0, Math.min(heroData.maxHealth || 100, heroData.health + health)),
      stats: {
        ...heroData.stats,
        totalGoldEarned: heroData.stats.totalGoldEarned + Math.max(0, gold),
        totalGoldSpent: heroData.stats.totalGoldSpent + Math.max(0, -gold)
      }
    }

    saveHero(updatedHero)
  }, [heroData, saveHero])

  // Atualizar estatísticas
  const updateStats = useCallback((statUpdates) => {
    if (!heroData) return

    const updatedHero = {
      ...heroData,
      stats: {
        ...heroData.stats,
        ...statUpdates
      }
    }

    saveHero(updatedHero)
  }, [heroData, saveHero])

  // Resetar herói (para desenvolvimento/teste)
  const resetHero = useCallback(() => {
    const defaultHero = getDefaultHeroData()
    saveHero(defaultHero)
  }, [saveHero])

  // Calcular progresso para o próximo nível
  const getXPProgress = useCallback(() => {
    if (!heroData) return { current: 0, needed: 100, percentage: 0 }

    const currentLevelXP = calculateCurrentLevelXP(heroData.xp)
    const xpForNextLevel = calculateXPForNextLevel(heroData.level)
    const percentage = calculateLevelProgress(heroData.xp)

    return {
      current: currentLevelXP,
      needed: xpForNextLevel,
      percentage,
      total: heroData.xp
    }
  }, [heroData])

  return {
    heroData,
    loading,
    loadHero,
    saveHero,
    gainXP,
    updateResources,
    updateStats,
    getXPProgress,
    resetHero
  }
}