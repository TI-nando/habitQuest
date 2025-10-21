import React, { useState, useRef } from 'react'
import { 
  exportGameData, 
  importGameData, 
  downloadBackup, 
  loadBackupFromFile,
  createAutoBackup,
  getAutoBackups,
  restoreAutoBackup,
  clearAllGameData,
  validateGameData
} from '../../utils/backup'
import useToast from '../../hooks/useToast'
import './BackupManager.css'

const BackupManager = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [autoBackups, setAutoBackups] = useState(getAutoBackups())
  const fileInputRef = useRef(null)
  const { showToast } = useToast()

  const handleDownloadBackup = async () => {
    setIsLoading(true)
    try {
      await downloadBackup()
      showToast('Backup baixado com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao baixar backup: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    try {
      const gameData = await loadBackupFromFile(file)
      
      // Valida os dados antes de importar
      const validation = validateGameData(gameData)
      if (!validation.isValid) {
        throw new Error('Dados inválidos: ' + validation.errors.join(', '))
      }

      // Confirma antes de importar
      const confirmed = window.confirm(
        'Tem certeza que deseja importar este backup? Todos os dados atuais serão substituídos.'
      )
      
      if (confirmed) {
        await importGameData(gameData)
        showToast('Backup importado com sucesso!', 'success')
        // Recarrega a página para aplicar os novos dados
        window.location.reload()
      }
    } catch (error) {
      showToast('Erro ao importar backup: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
      // Limpa o input
      event.target.value = ''
    }
  }

  const handleCreateAutoBackup = async () => {
    setIsLoading(true)
    try {
      const backupKey = createAutoBackup()
      if (backupKey) {
        setAutoBackups(getAutoBackups())
        showToast('Backup automático criado!', 'success')
      } else {
        throw new Error('Falha ao criar backup automático')
      }
    } catch (error) {
      showToast('Erro ao criar backup: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreAutoBackup = async (backupKey) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos.'
    )
    
    if (!confirmed) return

    setIsLoading(true)
    try {
      await restoreAutoBackup(backupKey)
      showToast('Backup restaurado com sucesso!', 'success')
      // Recarrega a página para aplicar os novos dados
      window.location.reload()
    } catch (error) {
      showToast('Erro ao restaurar backup: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      'ATENÇÃO: Esta ação irá apagar TODOS os seus dados permanentemente. Tem certeza absoluta?'
    )
    
    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      'Esta é sua última chance! Todos os dados serão perdidos. Continuar?'
    )
    
    if (!doubleConfirmed) return

    setIsLoading(true)
    try {
      await clearAllGameData()
      showToast('Todos os dados foram apagados', 'success')
      // Recarrega a página
      window.location.reload()
    } catch (error) {
      showToast('Erro ao apagar dados: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (!isOpen) return null

  return (
    <div className="backup-manager-overlay">
      <div className="backup-manager">
        <div className="backup-manager-header">
          <h2>Gerenciar Backups</h2>
          <button 
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="backup-manager-content">
          {/* Seção de Export/Import */}
          <div className="backup-section">
            <h3>Backup Manual</h3>
            <div className="backup-actions">
              <button 
                className="backup-button primary"
                onClick={handleDownloadBackup}
                disabled={isLoading}
              >
                📥 Baixar Backup
              </button>
              
              <button 
                className="backup-button secondary"
                onClick={handleFileSelect}
                disabled={isLoading}
              >
                📤 Importar Backup
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Seção de Backups Automáticos */}
          <div className="backup-section">
            <h3>Backups Automáticos</h3>
            <div className="backup-actions">
              <button 
                className="backup-button primary"
                onClick={handleCreateAutoBackup}
                disabled={isLoading}
              >
                💾 Criar Backup Agora
              </button>
            </div>
            
            {autoBackups.length > 0 && (
              <div className="auto-backups-list">
                <h4>Backups Disponíveis:</h4>
                {autoBackups.map((backup) => (
                  <div key={backup.key} className="backup-item">
                    <span className="backup-date">
                      {formatDate(backup.date)}
                    </span>
                    <button
                      className="backup-button small"
                      onClick={() => handleRestoreAutoBackup(backup.key)}
                      disabled={isLoading}
                    >
                      🔄 Restaurar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Perigo */}
          <div className="backup-section danger-zone">
            <h3>⚠️ Zona de Perigo</h3>
            <p>Esta ação não pode ser desfeita!</p>
            <button 
              className="backup-button danger"
              onClick={handleClearAllData}
              disabled={isLoading}
            >
              🗑️ Apagar Todos os Dados
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="backup-loading">
            <div className="loading-spinner"></div>
            <p>Processando...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BackupManager