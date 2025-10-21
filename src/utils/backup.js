/**
 * Sistema de Backup e Export de Dados do HabitDev
 */

// Chaves do localStorage que devem ser incluídas no backup
const STORAGE_KEYS = [
  'habitdev_hero',
  'habitdev_missions',
  'habitdev_achievements',
  'habitdev_settings',
  'habitdev_stats'
]

/**
 * Exporta todos os dados do jogo para um objeto JSON
 */
export const exportGameData = () => {
  try {
    const gameData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {}
    }

    // Coleta todos os dados relevantes do localStorage
    BACKUP_KEYS.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          gameData.data[key] = JSON.parse(data)
        } catch (error) {
          console.warn(`Erro ao parsear dados de ${key}:`, error)
          gameData.data[key] = data // Salva como string se não conseguir parsear
        }
      }
    })

    return gameData
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    throw new Error('Falha ao exportar dados do jogo')
  }
}

/**
 * Importa dados do jogo de um objeto JSON
 */
export const importGameData = (gameData) => {
  try {
    if (!gameData || !gameData.data) {
      throw new Error('Dados de backup inválidos')
    }

    // Valida a versão (futura expansão)
    if (gameData.version && !isVersionCompatible(gameData.version)) {
      console.warn('Versão do backup pode ser incompatível:', gameData.version)
    }

    // Importa cada chave de dados
    Object.entries(gameData.data).forEach(([key, value]) => {
      if (BACKUP_KEYS.includes(key)) {
        try {
          const dataString = typeof value === 'string' ? value : JSON.stringify(value)
          localStorage.setItem(key, dataString)
        } catch (error) {
          console.warn(`Erro ao importar dados de ${key}:`, error)
        }
      }
    })

    return true
  } catch (error) {
    console.error('Erro ao importar dados:', error)
    throw new Error('Falha ao importar dados do jogo')
  }
}

/**
 * Baixa os dados do jogo como arquivo JSON
 */
export const downloadBackup = () => {
  try {
    const gameData = exportGameData()
    const dataStr = JSON.stringify(gameData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `habitdev-backup-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Erro ao baixar backup:', error)
    throw new Error('Falha ao baixar backup')
  }
}

/**
 * Carrega backup de um arquivo
 */
export const loadBackupFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Nenhum arquivo selecionado'))
      return
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Arquivo deve ser do tipo JSON'))
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const gameData = JSON.parse(e.target.result)
        resolve(gameData)
      } catch (error) {
        reject(new Error('Arquivo JSON inválido'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * Cria backup automático no localStorage
 */
export const createAutoBackup = () => {
  try {
    const gameData = exportGameData()
    const backupKey = `habitdev_auto_backup_${Date.now()}`
    
    localStorage.setItem(backupKey, JSON.stringify(gameData))
    
    // Limita a 5 backups automáticos
    cleanupAutoBackups()
    
    return backupKey
  } catch (error) {
    console.error('Erro ao criar backup automático:', error)
    return null
  }
}

/**
 * Lista backups automáticos disponíveis
 */
export const getAutoBackups = () => {
  const backups = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('habitdev_auto_backup_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key))
        backups.push({
          key,
          date: data.exportDate,
          timestamp: parseInt(key.split('_').pop())
        })
      } catch (error) {
        console.warn('Backup automático corrompido:', key)
      }
    }
  }
  
  return backups.sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Restaura backup automático
 */
export const restoreAutoBackup = (backupKey) => {
  try {
    const backupData = localStorage.getItem(backupKey)
    if (!backupData) {
      throw new Error('Backup não encontrado')
    }
    
    const gameData = JSON.parse(backupData)
    return importGameData(gameData)
  } catch (error) {
    console.error('Erro ao restaurar backup automático:', error)
    throw new Error('Falha ao restaurar backup automático')
  }
}

/**
 * Remove backups automáticos antigos (mantém apenas os 5 mais recentes)
 */
const cleanupAutoBackups = () => {
  const backups = getAutoBackups()
  
  if (backups.length > 5) {
    const toRemove = backups.slice(5)
    toRemove.forEach(backup => {
      localStorage.removeItem(backup.key)
    })
  }
}

/**
 * Verifica compatibilidade de versão (futura expansão)
 */
const isVersionCompatible = (version) => {
  // Por enquanto, aceita todas as versões
  // Futuramente pode implementar lógica de compatibilidade
  return true
}

/**
 * Limpa todos os dados do jogo (reset completo)
 */
export const clearAllGameData = () => {
  try {
    BACKUP_KEYS.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Remove também backups automáticos
    const backups = getAutoBackups()
    backups.forEach(backup => {
      localStorage.removeItem(backup.key)
    })
    
    return true
  } catch (error) {
    console.error('Erro ao limpar dados:', error)
    throw new Error('Falha ao limpar dados do jogo')
  }
}

/**
 * Valida integridade dos dados
 */
export const validateGameData = (gameData) => {
  const errors = []
  
  if (!gameData || typeof gameData !== 'object') {
    errors.push('Dados inválidos')
    return { isValid: false, errors }
  }
  
  if (!gameData.version) {
    errors.push('Versão não especificada')
  }
  
  if (!gameData.data || typeof gameData.data !== 'object') {
    errors.push('Dados do jogo ausentes')
    return { isValid: false, errors }
  }
  
  // Valida estrutura básica dos dados do herói
  if (gameData.data.habitdev_hero) {
    const heroData = gameData.data.habitdev_hero
    if (!heroData.name || typeof heroData.level !== 'number') {
      errors.push('Dados do herói inválidos')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}