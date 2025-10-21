// Sistema de títulos de desenvolvedor baseado em níveis
export const DEVELOPER_TITLES = {
  1: { title: 'Desenvolvedor Iniciante', icon: '💻', description: 'Começando a jornada no desenvolvimento' },
  5: { title: 'Desenvolvedor Junior', icon: '⚡', description: 'Ganhando experiência e confiança' },
  15: { title: 'Desenvolvedor Pleno', icon: '🚀', description: 'Dominando as tecnologias principais' },
  30: { title: 'Desenvolvedor Senior', icon: '💎', description: 'Liderando projetos e mentorando outros' },
  50: { title: 'Desenvolvedor Mestre', icon: '🏆', description: 'Especialista reconhecido na área' },
  75: { title: 'Arquiteto de Software', icon: '🔥', description: 'Projetando sistemas complexos' },
  100: { title: 'Tech Lead Supremo', icon: '⭐', description: 'Liderança técnica excepcional' }
}

// Função para obter o título baseado no nível
export const getTitleByLevel = (level) => {
  // Encontra o maior nível que não excede o nível atual
  const availableLevels = Object.keys(DEVELOPER_TITLES)
    .map(Number)
    .sort((a, b) => b - a) // Ordena em ordem decrescente
  
  for (const titleLevel of availableLevels) {
    if (level >= titleLevel) {
      return DEVELOPER_TITLES[titleLevel]
    }
  }
  
  // Fallback para o título inicial
  return DEVELOPER_TITLES[1]
}

// Função para obter o próximo título
export const getNextTitle = (level) => {
  const availableLevels = Object.keys(DEVELOPER_TITLES)
    .map(Number)
    .sort((a, b) => a - b) // Ordena em ordem crescente
  
  for (const titleLevel of availableLevels) {
    if (level < titleLevel) {
      return {
        ...DEVELOPER_TITLES[titleLevel],
        levelRequired: titleLevel
      }
    }
  }
  
  // Se já está no nível máximo
  return null
}

// Função para obter todos os títulos disponíveis
export const getAllTitles = () => {
  return Object.entries(DEVELOPER_TITLES).map(([level, titleData]) => ({
    level: Number(level),
    ...titleData
  }))
}

// Função para verificar se houve mudança de título
export const checkTitleChange = (oldLevel, newLevel) => {
  const oldTitle = getTitleByLevel(oldLevel)
  const newTitle = getTitleByLevel(newLevel)
  
  return {
    titleChanged: oldTitle.title !== newTitle.title,
    oldTitle,
    newTitle
  }
}