import React, { useState, useEffect } from 'react'
import './NotificationSystem.css'

const NotificationSystem = ({ notifications, onRemoveNotification }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([])

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const newNotifications = notifications.filter(
        notification => !visibleNotifications.find(vn => vn.id === notification.id)
      )
      
      if (newNotifications.length > 0) {
        setVisibleNotifications(prev => [...prev, ...newNotifications])
        
        // Auto-remove notifications after 5 seconds
        newNotifications.forEach(notification => {
          setTimeout(() => {
            removeNotification(notification.id)
          }, 5000)
        })
      }
    }
  }, [notifications])

  const removeNotification = (id) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id))
    if (onRemoveNotification) {
      onRemoveNotification(id)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '🎉'
      case 'xp': return '⭐'
      case 'gold': return '🪙'
      case 'level': return '🆙'
      case 'achievement': return '🏆'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success': return 'success'
      case 'xp': return 'xp'
      case 'gold': return 'gold'
      case 'level': return 'level'
      case 'achievement': return 'achievement'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'info'
    }
  }

  if (!visibleNotifications || visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="notification-system">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${getNotificationClass(notification.type)} ${notification.isNew ? 'entering' : ''}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="notification-content">
            <div className="notification-title">
              {notification.title}
            </div>
            {notification.message && (
              <div className="notification-message">
                {notification.message}
              </div>
            )}
            {notification.rewards && (
              <div className="notification-rewards">
                {notification.rewards.xp && (
                  <span className="reward-item">
                    <span className="reward-icon">⭐</span>
                    +{notification.rewards.xp} XP
                  </span>
                )}
                {notification.rewards.gold && (
                  <span className="reward-item">
                    <span className="reward-icon">🪙</span>
                    +{notification.rewards.gold} Ouro
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem