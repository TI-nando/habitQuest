import { useState, useEffect, useCallback } from 'react'
import { missionStorage, calculateMissionRewards } from '../utils/storage'
import { useAuth } from './useAuth'

export const useMissions = () => {
  const [missions, setMissions] = useState({ daily: [], weekly: [], campaign: [] })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Carregar missões
  useEffect(() => {
    const loadMissions = () => {
      try {
        const userId = user?.id
        const data = missionStorage.load(userId)
        setMissions(data)
      } catch (error) {
        console.error('Erro ao carregar missões:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [user?.id])

  // Adicionar nova missão
  const addMission = useCallback((missionData) => {
    try {
      const userId = user?.id
      const newMission = missionStorage.add(missionData, userId)
      const updatedMissions = missionStorage.load(userId)
      setMissions(updatedMissions)
      
      return { success: true, mission: newMission }
    } catch (error) {
      console.error('Erro ao adicionar missão:', error)
      return { success: false, error }
    }
  }, [user?.id])

  // Completar missão
  const completeMission = useCallback((missionId, type) => {
    try {
      const userId = user?.id
      const result = missionStorage.complete(missionId, type, userId)
      
      if (result) {
        const updatedMissions = missionStorage.load(userId)
        setMissions(updatedMissions)
        
        return { 
          success: true, 
          mission: result.mission, 
          rewards: result.rewards 
        }
      }
      
      return { success: false, error: 'Missão não encontrada ou já completada' }
    } catch (error) {
      console.error('Erro ao completar missão:', error)
      return { success: false, error }
    }
  }, [user?.id])

  // Deletar missão
  const deleteMission = useCallback((missionId, type) => {
    try {
      const userId = user?.id
      const updatedMissions = missionStorage.delete(missionId, type, userId)
      setMissions(updatedMissions)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar missão:', error)
      return { success: false, error }
    }
  }, [user?.id])

  // Editar missão
  const editMission = useCallback((missionId, type, updates) => {
    try {
      const userId = user?.id
      const updatedMission = missionStorage.edit(missionId, type, updates, userId)
      
      if (updatedMission) {
        const updatedMissions = missionStorage.load(userId)
        setMissions(updatedMissions)
        
        return { success: true, mission: updatedMission }
      }
      
      return { success: false, error: 'Missão não encontrada' }
    } catch (error) {
      console.error('Erro ao editar missão:', error)
      return { success: false, error }
    }
  }, [user?.id])

  // Obter missões por tipo
  const getMissionsByType = useCallback((type) => {
    return missions[type] || []
  }, [missions])

  // Obter missões ativas
  const getActiveMissions = useCallback((type) => {
    return missions[type]?.filter(mission => !mission.completed) || []
  }, [missions])

  // Obter missões completas
  const getCompletedMissions = useCallback((type) => {
    return missions[type]?.filter(mission => mission.completed) || []
  }, [missions])

  // Obter estatísticas das missões
  const getMissionStats = useCallback(() => {
    const stats = {
      total: 0,
      completed: 0,
      active: 0,
      byType: {
        daily: { total: 0, completed: 0, active: 0 },
        weekly: { total: 0, completed: 0, active: 0 },
        campaign: { total: 0, completed: 0, active: 0 }
      }
    }

    Object.keys(missions).forEach(type => {
      const typeMissions = missions[type] || []
      const completed = typeMissions.filter(m => m.completed)
      const active = typeMissions.filter(m => !m.completed)

      stats.byType[type] = {
        total: typeMissions.length,
        completed: completed.length,
        active: active.length
      }

      stats.total += typeMissions.length
      stats.completed += completed.length
      stats.active += active.length
    })

    return stats
  }, [missions])

  // Calcular recompensas de uma missão
  const getRewards = useCallback((mission) => {
    return calculateMissionRewards(mission)
  }, [])

  // Resetar missões diárias (para ser chamado diariamente)
  const resetDailyMissions = useCallback(() => {
    try {
      const currentMissions = missionStorage.load()
      
      // Remover missões diárias completas do dia anterior
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      currentMissions.daily = currentMissions.daily.filter(mission => {
        if (mission.completed) {
          const completedDate = new Date(mission.completedAt)
          return completedDate.toDateString() === new Date().toDateString()
        }
        return true
      })

      missionStorage.save(currentMissions)
      setMissions(currentMissions)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao resetar missões diárias:', error)
      return { success: false, error }
    }
  }, [])

  return {
    missions,
    loading,
    addMission,
    completeMission,
    deleteMission,
    editMission,
    getMissionsByType,
    getActiveMissions,
    getCompletedMissions,
    getMissionStats,
    getRewards,
    resetDailyMissions
  }
}

export default useMissions