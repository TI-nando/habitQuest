import { useState, useCallback } from 'react'

const useNotifications = () => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      isNew: true,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Mark as not new after animation
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isNew: false } : n)
      )
    }, 300)

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Notification helpers
  const showSuccess = useCallback((title, message, rewards) => {
    return addNotification({
      type: 'success',
      title,
      message,
      rewards
    })
  }, [addNotification])

  const showXPGain = useCallback((xpAmount, message) => {
    return addNotification({
      type: 'xp',
      title: `+${xpAmount} XP Ganho!`,
      message,
      rewards: { xp: xpAmount }
    })
  }, [addNotification])

  const showGoldGain = useCallback((goldAmount, message) => {
    return addNotification({
      type: 'gold',
      title: `+${goldAmount} Ouro Ganho!`,
      message,
      rewards: { gold: goldAmount }
    })
  }, [addNotification])

  const showLevelUp = useCallback((newLevel, message) => {
    return addNotification({
      type: 'level',
      title: `Nível ${newLevel} Alcançado!`,
      message: message || 'Parabéns! Você subiu de nível!'
    })
  }, [addNotification])

  // Mostrar conquista desbloqueada
  const showAchievement = useCallback((achievementData) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: 'achievement',
      title: achievementData.title || 'Conquista Desbloqueada!',
      message: achievementData.message || 'Parabéns!',
      description: achievementData.description,
      rewards: achievementData.rewards,
      rarity: achievementData.rarity,
      timestamp: new Date().toISOString()
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto-remover após 8 segundos (conquistas ficam mais tempo)
    setTimeout(() => {
      removeNotification(notification.id)
    }, 8000)
  }, [])

  const showMissionComplete = useCallback((missionTitle, rewards) => {
    return addNotification({
      type: 'success',
      title: 'Missão Completa!',
      message: `"${missionTitle}" foi concluída com sucesso!`,
      rewards
    })
  }, [addNotification])

  const showWarning = useCallback((title, message) => {
    return addNotification({
      type: 'warning',
      title,
      message
    })
  }, [addNotification])

  const showError = useCallback((title, message) => {
    return addNotification({
      type: 'error',
      title,
      message
    })
  }, [addNotification])

  const showInfo = useCallback((title, message) => {
    return addNotification({
      type: 'info',
      title,
      message
    })
  }, [addNotification])

  // Batch notifications for multiple rewards
  const showRewards = useCallback((rewards, message) => {
    if (rewards.xp && rewards.gold) {
      return addNotification({
        type: 'success',
        title: 'Recompensas Recebidas!',
        message,
        rewards
      })
    } else if (rewards.xp) {
      return showXPGain(rewards.xp, message)
    } else if (rewards.gold) {
      return showGoldGain(rewards.gold, message)
    }
  }, [addNotification, showXPGain, showGoldGain])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showXPGain,
    showGoldGain,
    showLevelUp,
    showAchievement,
    showMissionComplete,
    showWarning,
    showError,
    showInfo,
    showRewards
  }
}

export default useNotifications