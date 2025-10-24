import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Mostrar o toast com animação
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Configurar timer para fechar
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 400);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'xp':
        return '⭐';
      case 'gold':
        return '⭐';
      case 'level':
        return '🚀';
      default:
        return '✅';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type} ${isExiting ? 'animate-slideOutRight' : 'animate-fadeInRight'} ${type === 'level' ? 'animate-bounceIn' : ''}`}>
      <div className={`toast-icon ${type === 'xp' ? 'animate-pulse' : type === 'gold' ? 'animate-coinFlip' : type === 'level' ? 'animate-sparkle' : 'animate-scaleIn'}`}>
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className={`toast-message ${type === 'xp' ? 'xp-number' : type === 'gold' ? 'gold-number' : ''}`}>{message}</div>
      </div>
      <button className="toast-close hover-glow" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;