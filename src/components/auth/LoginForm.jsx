import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AuthForms.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>💻 Entrar no HabitDev</h2>
          <p>Continue sua jornada de desenvolvimento!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-content">
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">
              <span className="label-icon">👤</span>
              Username ou Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu username ou email"
              className={errors.username ? 'error' : ''}
              required
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Entrando...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Novo no HabitDev?{' '}
            <button 
              type="button" 
              className="switch-form-btn"
              onClick={onSwitchToRegister}
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;