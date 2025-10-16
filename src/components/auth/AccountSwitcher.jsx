import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { load } from '../../utils/storage'
import './AccountSwitcher.css'

const AccountSwitcher = ({ onClose }) => {
  const { user, login, logout } = useAuth()
  const [availableUsers, setAvailableUsers] = useState([])
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Carregar usuários disponíveis (exceto o atual)
    const users = load('users') || []
    const otherUsers = users.filter(u => u.id !== user?.id)
    setAvailableUsers(otherUsers)
  }, [user])

  const handleSwitchAccount = async (targetUser) => {
    setLoading(true)
    setError('')

    try {
      // Simular login com o usuário selecionado
      const result = await login({
        username: targetUser.username,
        password: 'dummy' // Em um sistema real, seria necessário autenticação
      })

      if (result.success) {
        onClose()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao trocar de conta')
    } finally {
      setLoading(false)
    }
  }

  const handleNewLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(loginData)
      
      if (result.success) {
        onClose()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair de todas as contas?')) {
      logout()
      onClose()
    }
  }

  return (
    <div className="account-switcher-overlay">
      <div className="account-switcher">
        <div className="switcher-header">
          <h2>🔄 Trocar de Conta</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="current-user">
          <h3>👤 Conta Atual</h3>
          <div className="user-card current">
            <div className="user-avatar">{user?.avatar}</div>
            <div className="user-info">
              <div className="user-name">{user?.heroName || user?.username}</div>
              <div className="user-email">{user?.email}</div>
              <div className="user-title">{user?.title}</div>
            </div>
            <div className="user-badge">Ativo</div>
          </div>
        </div>

        {availableUsers.length > 0 && (
          <div className="available-users">
            <h3>🔄 Contas Disponíveis</h3>
            <div className="users-list">
              {availableUsers.map(availableUser => (
                <div key={availableUser.id} className="user-card">
                  <div className="user-avatar">{availableUser.avatar}</div>
                  <div className="user-info">
                    <div className="user-name">{availableUser.heroName || availableUser.username}</div>
                    <div className="user-email">{availableUser.email}</div>
                    <div className="user-title">{availableUser.title}</div>
                  </div>
                  <button
                    className="switch-button"
                    onClick={() => handleSwitchAccount(availableUser)}
                    disabled={loading}
                  >
                    {loading ? '...' : 'Trocar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="switcher-actions">
          <button
            className="new-login-button"
            onClick={() => setShowLoginForm(!showLoginForm)}
          >
            ➕ {showLoginForm ? 'Cancelar' : 'Fazer Login em Outra Conta'}
          </button>

          {showLoginForm && (
            <form className="login-form" onSubmit={handleNewLogin}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Username ou Email"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          <button className="logout-all-button" onClick={handleLogout}>
            🚪 Sair de Todas as Contas
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountSwitcher