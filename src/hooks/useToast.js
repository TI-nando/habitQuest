import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration + 300); // Add extra time for exit animation

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccessToast = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const showXPToast = useCallback((xp, duration = 2000) => {
    return showToast(`+${xp} XP ganho! 🌟`, 'xp', duration);
  }, [showToast]);

  const showGoldToast = useCallback((gold, duration = 3000) => {
    return showToast(`+${gold} Pontos ganhos! ⭐`, 'gold', duration);
  }, [showToast]);

  const showLevelUpToast = useCallback((level, duration = 3000) => {
    return showToast(`Parabéns! Você subiu para o nível ${level}! 🚀`, 'level', duration);
  }, [showToast]);

  const showMissionCompleteToast = useCallback((missionTitle, xp, gold) => {
    showSuccessToast(`"${missionTitle}" concluída! 🎉`, 2500);
    
    setTimeout(() => {
      showXPToast(xp);
    }, 500);

    if (gold > 0) {
      setTimeout(() => {
        showGoldToast(gold);
      }, 1000);
    }
  }, [showSuccessToast, showXPToast, showGoldToast]);

  return {
    toasts,
    showToast,
    removeToast,
    showSuccessToast,
    showXPToast,
    showGoldToast,
    showLevelUpToast,
    showMissionCompleteToast
  };
};

export default useToast;