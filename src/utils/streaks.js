// Sistema de rastreamento de sequências diárias
export const STREAK_TYPES = {
  DAILY_MISSIONS: 'daily_missions',
  LOGIN: 'login',
  XP_GAIN: 'xp_gain',
  ACHIEVEMENTS: 'achievements'
}

export const STREAK_REWARDS = {
  3: { xp: 50, gold: 25, title: 'Iniciante Consistente' },
  7: { xp: 150, gold: 75, title: 'Guerreiro Semanal' },
  14: { xp: 300, gold: 150, title: 'Campeão Quinzenal' },
  30: { xp: 750, gold: 375, title: 'Lenda Mensal' },
  60: { xp: 1500, gold: 750, title: 'Mestre da Disciplina' },
  100: { xp: 3000, gold: 1500, title: 'Imortal da Consistência' }
}

// Verificar se duas datas são consecutivas
export const areConsecutiveDays = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  // Normalizar para meia-noite
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays === 1
}

// Verificar se é o mesmo dia
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// Obter data de hoje normalizada
export const getTodayDate = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString().split('T')[0]
}

// Obter data de ontem normalizada
export const getYesterdayDate = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  return yesterday.toISOString().split('T')[0]
}

// Atualizar sequência
export const updateStreak = (heroData, streakType = STREAK_TYPES.DAILY_MISSIONS) => {
  const today = getTodayDate()
  const yesterday = getYesterdayDate()
  
  if (!heroData.streaks) {
    heroData.streaks = {}
  }

  if (!heroData.streaks[streakType]) {
    heroData.streaks[streakType] = {
      current: 0,
      longest: 0,
      lastDate: null,
      history: []
    }
  }

  const streak = heroData.streaks[streakType]
  
  // Se já foi atualizado hoje, não fazer nada
  if (streak.lastDate === today) {
    return { updated: false, streak: streak.current }
  }

  // Se a última data foi ontem, continuar a sequência
  if (streak.lastDate === yesterday) {
    streak.current += 1
  }
  // Se a última data foi há mais de um dia, resetar a sequência
  else if (streak.lastDate && streak.lastDate !== today) {
    streak.current = 1
  }
  // Se é a primeira vez, iniciar a sequência
  else if (!streak.lastDate) {
    streak.current = 1
  }

  // Atualizar a data
  streak.lastDate = today
  
  // Atualizar a maior sequência
  if (streak.current > streak.longest) {
    streak.longest = streak.current
  }

  // Adicionar ao histórico
  streak.history.push({
    date: today,
    streak: streak.current
  })

  // Manter apenas os últimos 100 registros
  if (streak.history.length > 100) {
    streak.history = streak.history.slice(-100)
  }

  // Atualizar estatísticas globais
  if (!heroData.stats) {
    heroData.stats = {}
  }

  heroData.stats.currentStreak = streak.current
  heroData.stats.longestStreak = streak.longest

  return {
    updated: true,
    streak: streak.current,
    isNewRecord: streak.current === streak.longest && streak.current > 1
  }
}

// Verificar se há recompensas de sequência disponíveis
export const checkStreakRewards = (streakCount) => {
  const availableRewards = []
  
  for (const [days, reward] of Object.entries(STREAK_REWARDS)) {
    if (streakCount >= parseInt(days)) {
      availableRewards.push({
        days: parseInt(days),
        ...reward
      })
    }
  }

  return availableRewards.sort((a, b) => b.days - a.days)
}

// Obter próxima recompensa de sequência
export const getNextStreakReward = (streakCount) => {
  const rewardDays = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => a - b)
  
  for (const days of rewardDays) {
    if (streakCount < days) {
      return {
        days,
        daysRemaining: days - streakCount,
        ...STREAK_REWARDS[days]
      }
    }
  }

  return null // Já alcançou todas as recompensas
}

// Obter estatísticas de sequência
export const getStreakStats = (heroData, streakType = STREAK_TYPES.DAILY_MISSIONS) => {
  if (!heroData.streaks || !heroData.streaks[streakType]) {
    return {
      current: 0,
      longest: 0,
      lastDate: null,
      history: [],
      isActive: false,
      daysUntilReset: 0
    }
  }

  const streak = heroData.streaks[streakType]
  const today = getTodayDate()
  const yesterday = getYesterdayDate()
  
  const isActive = streak.lastDate === today || streak.lastDate === yesterday
  
  let daysUntilReset = 0
  if (streak.lastDate === yesterday) {
    daysUntilReset = 1 // Precisa fazer algo hoje para manter a sequência
  } else if (streak.lastDate !== today) {
    daysUntilReset = 0 // Sequência já foi perdida
  }

  return {
    current: streak.current,
    longest: streak.longest,
    lastDate: streak.lastDate,
    history: streak.history,
    isActive,
    daysUntilReset
  }
}

// Obter dados para gráfico de sequência (últimos 30 dias)
export const getStreakChartData = (heroData, streakType = STREAK_TYPES.DAILY_MISSIONS) => {
  const stats = getStreakStats(heroData, streakType)
  const chartData = []
  
  // Gerar dados dos últimos 30 dias
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Verificar se há atividade neste dia
    const historyEntry = stats.history.find(entry => entry.date === dateStr)
    
    chartData.push({
      date: dateStr,
      day: date.getDate(),
      dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      hasActivity: !!historyEntry,
      streak: historyEntry ? historyEntry.streak : 0
    })
  }

  return chartData
}

// Resetar sequência (para casos especiais)
export const resetStreak = (heroData, streakType = STREAK_TYPES.DAILY_MISSIONS) => {
  if (!heroData.streaks || !heroData.streaks[streakType]) {
    return false
  }

  const streak = heroData.streaks[streakType]
  streak.current = 0
  streak.lastDate = null

  // Atualizar estatísticas globais se for a sequência principal
  if (streakType === STREAK_TYPES.DAILY_MISSIONS) {
    heroData.stats.currentStreak = 0
  }

  return true
}

// Simular atividade para teste (apenas para desenvolvimento)
export const simulateStreakActivity = (heroData, days = 7, streakType = STREAK_TYPES.DAILY_MISSIONS) => {
  if (!heroData.streaks) {
    heroData.streaks = {}
  }

  if (!heroData.streaks[streakType]) {
    heroData.streaks[streakType] = {
      current: 0,
      longest: 0,
      lastDate: null,
      history: []
    }
  }

  const streak = heroData.streaks[streakType]
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    streak.history.push({
      date: dateStr,
      streak: days - i
    })
  }

  streak.current = days
  streak.longest = Math.max(streak.longest, days)
  streak.lastDate = getTodayDate()

  // Atualizar estatísticas globais
  if (streakType === STREAK_TYPES.DAILY_MISSIONS) {
    heroData.stats.currentStreak = streak.current
    heroData.stats.longestStreak = streak.longest
  }

  return heroData
}