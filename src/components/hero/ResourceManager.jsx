import React, { useState, useEffect } from 'react'
import './ResourceManager.css'

const ResourceManager = ({ heroData, onUpdateResources, onRestoreEnergy, onRestoreHealth }) => {
  const [isRestoring, setIsRestoring] = useState({ energy: false, health: false })
  const [lastRestoreTime, setLastRestoreTime] = useState({
    energy: localStorage.getItem('lastEnergyRestore') || 0,
    health: localStorage.getItem('lastHealthRestore') || 0
  })

  // Configurações de recursos
  const RESOURCE_CONFIG = {
    energy: {
      max: heroData?.maxEnergy || 100,
      restoreRate: 1, // 1 energia por minuto
      restoreInterval: 60000, // 1 minuto em ms
      restoreCost: 10, // custo em ouro para restaurar instantaneamente
      icon: '⚡',
      color: '#FFD700',
      name: 'Energia'
    },
    health: {
      max: heroData?.maxHealth || 100,
      restoreRate: 2, // 2 vida por minuto
      restoreInterval: 60000, // 1 minuto em ms
      restoreCost: 15, // custo em ouro para restaurar instantaneamente
      icon: '❤️',
      color: '#FF4444',
      name: 'Vida'
    }
  }

  // Restauração automática de recursos
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      let energyToRestore = 0
      let healthToRestore = 0

      // Calcular energia a restaurar
      if (heroData?.energy < RESOURCE_CONFIG.energy.max) {
        const timeSinceLastEnergyRestore = now - lastRestoreTime.energy
        if (timeSinceLastEnergyRestore >= RESOURCE_CONFIG.energy.restoreInterval) {
          energyToRestore = Math.min(
            RESOURCE_CONFIG.energy.restoreRate,
            RESOURCE_CONFIG.energy.max - heroData.energy
          )
        }
      }

      // Calcular vida a restaurar
      if (heroData?.health < RESOURCE_CONFIG.health.max) {
        const timeSinceLastHealthRestore = now - lastRestoreTime.health
        if (timeSinceLastHealthRestore >= RESOURCE_CONFIG.health.restoreInterval) {
          healthToRestore = Math.min(
            RESOURCE_CONFIG.health.restoreRate,
            RESOURCE_CONFIG.health.max - heroData.health
          )
        }
      }

      // Aplicar restauração
      if (energyToRestore > 0 || healthToRestore > 0) {
        onUpdateResources(0, energyToRestore, healthToRestore)
        
        if (energyToRestore > 0) {
          const newEnergyTime = now
          setLastRestoreTime(prev => ({ ...prev, energy: newEnergyTime }))
          localStorage.setItem('lastEnergyRestore', newEnergyTime.toString())
        }
        
        if (healthToRestore > 0) {
          const newHealthTime = now
          setLastRestoreTime(prev => ({ ...prev, health: newHealthTime }))
          localStorage.setItem('lastHealthRestore', newHealthTime.toString())
        }
      }
    }, 10000) // Verificar a cada 10 segundos

    return () => clearInterval(interval)
  }, [heroData, lastRestoreTime, onUpdateResources])

  // Restaurar energia instantaneamente
  const handleInstantEnergyRestore = async () => {
    if (isRestoring.energy || !heroData || heroData.gold < RESOURCE_CONFIG.energy.restoreCost) return

    setIsRestoring(prev => ({ ...prev, energy: true }))

    try {
      const energyToRestore = RESOURCE_CONFIG.energy.max - heroData.energy
      
      // Custar ouro e restaurar energia
      onUpdateResources(-RESOURCE_CONFIG.energy.restoreCost, energyToRestore, 0)
      
      // Atualizar tempo de última restauração
      const now = Date.now()
      setLastRestoreTime(prev => ({ ...prev, energy: now }))
      localStorage.setItem('lastEnergyRestore', now.toString())

      if (onRestoreEnergy) {
        onRestoreEnergy(energyToRestore)
      }

    } catch (error) {
      console.error('Erro ao restaurar energia:', error)
    } finally {
      setTimeout(() => {
        setIsRestoring(prev => ({ ...prev, energy: false }))
      }, 1000)
    }
  }

  // Restaurar vida instantaneamente
  const handleInstantHealthRestore = async () => {
    if (isRestoring.health || !heroData || heroData.gold < RESOURCE_CONFIG.health.restoreCost) return

    setIsRestoring(prev => ({ ...prev, health: true }))

    try {
      const healthToRestore = RESOURCE_CONFIG.health.max - heroData.health
      
      // Custar ouro e restaurar vida
      onUpdateResources(-RESOURCE_CONFIG.health.restoreCost, 0, healthToRestore)
      
      // Atualizar tempo de última restauração
      const now = Date.now()
      setLastRestoreTime(prev => ({ ...prev, health: now }))
      localStorage.setItem('lastHealthRestore', now.toString())

      if (onRestoreHealth) {
        onRestoreHealth(healthToRestore)
      }

    } catch (error) {
      console.error('Erro ao restaurar vida:', error)
    } finally {
      setTimeout(() => {
        setIsRestoring(prev => ({ ...prev, health: false }))
      }, 1000)
    }
  }

  // Calcular tempo até próxima restauração
  const getTimeToNextRestore = (resourceType) => {
    const now = Date.now()
    const lastRestore = lastRestoreTime[resourceType]
    const interval = RESOURCE_CONFIG[resourceType].restoreInterval
    const timeElapsed = now - lastRestore
    const timeRemaining = Math.max(0, interval - timeElapsed)
    
    return Math.ceil(timeRemaining / 1000) // em segundos
  }

  if (!heroData) return null

  return (
    <div className="resource-manager">
      <h3 className="resource-title">Gerenciar Recursos</h3>
      
      <div className="resources-grid">
        {/* Energia */}
        <div className="resource-card energy">
          <div className="resource-header">
            <span className="resource-icon">{RESOURCE_CONFIG.energy.icon}</span>
            <span className="resource-name">{RESOURCE_CONFIG.energy.name}</span>
          </div>
          
          <div className="resource-bar">
            <div 
              className="resource-fill"
              style={{ 
                width: `${(heroData.energy / RESOURCE_CONFIG.energy.max) * 100}%`,
                backgroundColor: RESOURCE_CONFIG.energy.color
              }}
            />
            <span className="resource-text">
              {heroData.energy}/{RESOURCE_CONFIG.energy.max}
            </span>
          </div>

          <div className="resource-actions">
            <div className="restore-info">
              <span className="restore-rate">
                +{RESOURCE_CONFIG.energy.restoreRate}/min
              </span>
              {heroData.energy < RESOURCE_CONFIG.energy.max && (
                <span className="next-restore">
                  Próxima em {getTimeToNextRestore('energy')}s
                </span>
              )}
            </div>
            
            {heroData.energy < RESOURCE_CONFIG.energy.max && (
              <button
                className={`instant-restore-btn ${isRestoring.energy ? 'restoring' : ''}`}
                onClick={handleInstantEnergyRestore}
                disabled={isRestoring.energy || heroData.gold < RESOURCE_CONFIG.energy.restoreCost}
              >
                {isRestoring.energy ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  <>
                    <span className="gold-icon">🪙</span>
                    {RESOURCE_CONFIG.energy.restoreCost}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Vida */}
        <div className="resource-card health">
          <div className="resource-header">
            <span className="resource-icon">{RESOURCE_CONFIG.health.icon}</span>
            <span className="resource-name">{RESOURCE_CONFIG.health.name}</span>
          </div>
          
          <div className="resource-bar">
            <div 
              className="resource-fill"
              style={{ 
                width: `${(heroData.health / RESOURCE_CONFIG.health.max) * 100}%`,
                backgroundColor: RESOURCE_CONFIG.health.color
              }}
            />
            <span className="resource-text">
              {heroData.health}/{RESOURCE_CONFIG.health.max}
            </span>
          </div>

          <div className="resource-actions">
            <div className="restore-info">
              <span className="restore-rate">
                +{RESOURCE_CONFIG.health.restoreRate}/min
              </span>
              {heroData.health < RESOURCE_CONFIG.health.max && (
                <span className="next-restore">
                  Próxima em {getTimeToNextRestore('health')}s
                </span>
              )}
            </div>
            
            {heroData.health < RESOURCE_CONFIG.health.max && (
              <button
                className={`instant-restore-btn ${isRestoring.health ? 'restoring' : ''}`}
                onClick={handleInstantHealthRestore}
                disabled={isRestoring.health || heroData.gold < RESOURCE_CONFIG.health.restoreCost}
              >
                {isRestoring.health ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  <>
                    <span className="gold-icon">🪙</span>
                    {RESOURCE_CONFIG.health.restoreCost}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="resource-tips">
        <h4>💡 Dicas de Recursos</h4>
        <ul>
          <li>Energia é necessária para completar missões</li>
          <li>Vida diminui quando você falha em missões diárias</li>
          <li>Recursos se restauram automaticamente com o tempo</li>
          <li>Use ouro para restauração instantânea quando necessário</li>
        </ul>
      </div>
    </div>
  )
}

export default ResourceManager