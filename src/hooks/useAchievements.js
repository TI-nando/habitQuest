import { useState, useCallback } from 'react'
import { checkAllAchievements, ACHIEVEMENTS } from '../utils/achievements'

export const useAchievements = (heroData, updateHeroData, showNotification) => {
  const [processingAchievements, setProcessingAchievements] = useState(false)

  // Verificar e processar novas conquistas
  const checkAndProcessAchievements = useCallback(async (missionData = {}) => {
    if (!heroData || processingAchievements) return []

    setProcessingAchievements(true)

    try {
      // Verificar conquistas especiais baseadas na missão
      const specialMissionData = {
        ...missionData,
        completedEarly: missionData.completedAt && 
          new Date(missionData.completedAt).getHours() < 8,
        completedLate: missionData.completedAt && 
          new Date(missionData.completedAt).getHours() >= 22
      }

      // Verificar todas as conquistas
      const newAchievements = checkAllAchievements(heroData, specialMissionData)
      
      if (newAchievements.length > 0) {
        // Atualizar dados do herói com novas conquistas
        const currentAchievements = heroData.achievements || []
        const newAchievementIds = newAchievements.map(achievement => achievement.id)
        const updatedAchievements = [...currentAchievements, ...newAchievementIds]

        // Calcular recompensas totais
        const totalRewards = newAchievements.reduce((total, achievement) => {
          return {
            xp: total.xp + (achievement.rewards.xp || 0),
            gold: total.gold + (achievement.rewards.gold || 0)
          }
        }, { xp: 0, gold: 0 })

        // Atualizar estatísticas de conquistas
        const updatedStats = {
          ...heroData.stats,
          achievementsUnlocked: updatedAchievements.length,
          totalAchievementXP: (heroData.stats.totalAchievementXP || 0) + totalRewards.xp,
          totalAchievementGold: (heroData.stats.totalAchievementGold || 0) + totalRewards.gold
        }

        // Atualizar dados do herói
        const updatedHeroData = {
          ...heroData,
          achievements: updatedAchievements,
          xp: heroData.xp + totalRewards.xp,
          gold: heroData.gold + totalRewards.gold,
          stats: updatedStats
        }

        // Salvar alterações
        updateHeroData(updatedHeroData)

        // Mostrar notificações para cada conquista
        for (const achievement of newAchievements) {
          if (showNotification) {
            showNotification({
              type: 'achievement',
              title: 'Conquista Desbloqueada!',
              message: `${achievement.icon} ${achievement.title}`,
              description: achievement.description,
              rewards: achievement.rewards,
              rarity: achievement.rarity
            })
          }
        }

        // Mostrar notificação de recompensas se houver múltiplas conquistas
        if (newAchievements.length > 1 && showNotification) {
          showNotification({
            type: 'success',
            title: 'Múltiplas Conquistas!',
            message: `Você desbloqueou ${newAchievements.length} conquistas!`,
            rewards: totalRewards
          })
        }

        return newAchievements
      }

      return []
    } catch (error) {
      console.error('Erro ao processar conquistas:', error)
      if (showNotification) {
        showNotification({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao processar conquistas'
        })
      }
      return []
    } finally {
      setProcessingAchievements(false)
    }
  }, [heroData, updateHeroData, showNotification, processingAchievements])

  // Verificar conquista específica
  const checkSpecificAchievement = useCallback((achievementId, missionData = {}) => {
    if (!heroData || !ACHIEVEMENTS[achievementId]) return false

    const achievement = ACHIEVEMENTS[achievementId]
    const alreadyUnlocked = heroData.achievements?.includes(achievementId)
    
    if (alreadyUnlocked) return false

    // Usar a função de verificação do sistema de conquistas
    const { checkAchievement } = require('../utils/achievements')
    return checkAchievement(achievementId, heroData, missionData)
  }, [heroData])

  // Obter progresso de uma conquista específica
  const getAchievementProgress = useCallback((achievementId) => {
    if (!heroData || !ACHIEVEMENTS[achievementId]) {
      return { current: 0, required: 1, percentage: 0 }
    }

    const { getAchievementProgress } = require('../utils/achievements')
    return getAchievementProgress(achievementId, heroData)
  }, [heroData])

  // Obter conquistas por categoria
  const getAchievementsByCategory = useCallback((category) => {
    const { getAchievementsByCategory } = require('../utils/achievements')
    return getAchievementsByCategory(category)
  }, [])

  // Obter estatísticas de conquistas
  const getAchievementStats = useCallback(() => {
    if (!heroData) {
      return {
        total: Object.keys(ACHIEVEMENTS).length,
        unlocked: 0,
        completionPercentage: 0,
        rarityStats: {}
      }
    }

    const { getAchievementStats } = require('../utils/achievements')
    return getAchievementStats(heroData)
  }, [heroData])

  // Verificar se uma conquista está desbloqueada
  const isAchievementUnlocked = useCallback((achievementId) => {
    return heroData?.achievements?.includes(achievementId) || false
  }, [heroData])

  // Obter conquistas recentes (últimas 5)
  const getRecentAchievements = useCallback(() => {
    if (!heroData?.achievements) return []

    return heroData.achievements
      .slice(-5)
      .reverse()
      .map(id => ACHIEVEMENTS[id])
      .filter(Boolean)
  }, [heroData])

  // Obter próximas conquistas (mais próximas de serem desbloqueadas)
  const getUpcomingAchievements = useCallback(() => {
    if (!heroData) return []

    const unlockedIds = heroData.achievements || []
    const lockedAchievements = Object.values(ACHIEVEMENTS)
      .filter(achievement => !unlockedIds.includes(achievement.id))

    // Calcular progresso e ordenar por proximidade
    const achievementsWithProgress = lockedAchievements.map(achievement => {
      const progress = getAchievementProgress(achievement.id)
      return {
        ...achievement,
        progress
      }
    })

    // Ordenar por progresso (maior progresso primeiro)
    return achievementsWithProgress
      .sort((a, b) => b.progress.percentage - a.progress.percentage)
      .slice(0, 3) // Retornar apenas as 3 mais próximas
  }, [heroData, getAchievementProgress])

  return {
    checkAndProcessAchievements,
    checkSpecificAchievement,
    getAchievementProgress,
    getAchievementsByCategory,
    getAchievementStats,
    isAchievementUnlocked,
    getRecentAchievements,
    getUpcomingAchievements,
    processingAchievements
  }
}

export default useAchievements