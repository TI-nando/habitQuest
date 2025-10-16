import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AccountSwitcher from '../auth/AccountSwitcher';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '🎮',
    title: user?.title || 'Aventureiro Iniciante'
  });
  const [errors, setErrors] = useState({});

  const avatarOptions = [
    '🎮', '⚔️', '🏆', '🌟', '🔥', '💎', '🚀', '🎯',
    '🦸', '🧙', '🏃', '💪', '🎨', '📚', '🎵', '🌈'
  ];

  const titleOptions = [
    'Aventureiro Iniciante',
    'Explorador Corajoso',
    'Guerreiro Determinado',
    'Mestre das Missões',
    'Lenda Viva',
    'Conquistador Épico'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setEditData(prev => ({
      ...prev,
      avatar
    }));
  };

  const handleTitleSelect = (title) => {
    setEditData(prev => ({
      ...prev,
      title
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (editData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!editData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    return newErrors;
  };

  const handleSave = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const result = updateProfile(editData);
    if (result.success) {
      setIsEditing(false);
      setErrors({});
    } else {
      setErrors({ general: result.error });
    }
  };

  const handleCancel = () => {
    setEditData({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '🎮',
      title: user?.title || 'Aventureiro Iniciante'
    });
    setIsEditing(false);
    setErrors({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {isEditing ? (
              <div className="avatar-selector">
                <div className="current-avatar">{editData.avatar}</div>
                <div className="avatar-options">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      className={`avatar-option ${editData.avatar === avatar ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="avatar-display">{user.avatar}</span>
            )}
          </div>
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && (
                  <span className="field-error">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Título</label>
                <select
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                >
                  {titleOptions.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  <span className="btn-icon">💾</span>
                  Salvar
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <span className="btn-icon">❌</span>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <h2 className="profile-username">{user.username}</h2>
              <p className="profile-title">{user.title}</p>
              <p className="profile-email">{user.email}</p>
              
              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <span className="btn-icon">✏️</span>
                  Editar Perfil
                </button>
                <button className="logout-btn" onClick={logout}>
                  <span className="btn-icon">🚪</span>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <h3>📊 Estatísticas do Jogador</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-label">Level</span>
              <span className="stat-value">{user.level}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-label">XP Total</span>
              <span className="stat-value">{user.xp}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-label">Ouro</span>
              <span className="stat-value">{user.gold}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <span className="stat-label">Missões Totais</span>
              <span className="stat-value">{user.stats?.totalMissions || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">Missões Completas</span>
              <span className="stat-value">{user.stats?.completedMissions || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-label">Sequência Atual</span>
              <span className="stat-value">{user.stats?.currentStreak || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-section">
        <h3>ℹ️ Informações da Conta</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Membro desde:</span>
            <span className="info-value">{formatDate(user.createdAt)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID do Usuário:</span>
            <span className="info-value">{user.id}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions-section">
        <h3>⚙️ Ações da Conta</h3>
        <div className="account-actions">
          <button 
            className="switch-account-button"
            onClick={() => setShowAccountSwitcher(true)}
          >
            🔄 Trocar de Conta
          </button>
          
          <button 
            className="logout-button"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair da sua conta?')) {
                logout();
              }
            }}
          >
            🚪 Sair da Conta
          </button>
        </div>
      </div>

      {showAccountSwitcher && (
        <AccountSwitcher onClose={() => setShowAccountSwitcher(false)} />
      )}
    </div>
  );
};

export default UserProfile;