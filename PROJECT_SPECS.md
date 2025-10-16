# HabitQuest RPG - Especificações do Projeto

## 📋 Visão Geral do Projeto

O **HabitQuest RPG** é uma aplicação web gamificada de gerenciamento de tarefas que transforma a produtividade pessoal em uma aventura de RPG. Os usuários assumem o papel de heróis em sua própria jornada, onde cada tarefa se torna uma "missão" que, ao ser completada, concede XP (Pontos de Experiência) e Gold (Ouro). O sistema incentiva a consistência através de diferentes tipos de missões e um sistema de progressão por níveis, criando uma experiência envolvente que motiva o usuário a manter seus hábitos e completar suas tarefas.

## 🛠️ Stack de Tecnologia Recomendada

### Frontend Framework
- **React** ou **Vue.js** (escolha do desenvolvedor)
- **Vite** como bundler para desenvolvimento rápido e otimizado

### Linguagem
- **JavaScript** (ES6+) ou **TypeScript** para tipagem adicional

### Estilização
- **CSS puro** com variáveis CSS customizadas
- **SASS/SCSS** (opcional) para melhor organização
- **CSS Modules** ou **Styled Components** para escopo de estilos

### Armazenamento
- **localStorage** para persistência de dados no navegador
- **JSON** como formato de dados

### Ferramentas de Desenvolvimento
- **ESLint** para qualidade de código
- **Prettier** para formatação consistente
- **Vite** para hot reload e build otimizado

## 📊 Modelo de Dados (localStorage)

### Estrutura do Usuário (Hero)
```json
{
  "hero": {
    "id": "hero_001",
    "name": "Aventureiro",
    "level": 1,
    "currentXP": 0,
    "xpToNextLevel": 100,
    "totalXP": 0,
    "gold": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Estrutura das Missões
```json
{
  "missions": [
    {
      "id": "mission_001",
      "title": "Beber 2L de água",
      "description": "Manter-se hidratado durante o dia",
      "type": "daily", // "daily", "weekly", "campaign"
      "difficulty": "easy", // "easy", "medium", "hard"
      "xpReward": 10,
      "goldReward": 5,
      "isCompleted": false,
      "completedAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastReset": "2024-01-01T00:00:00.000Z", // Para missões diárias
      "dueDate": null // Para missões de campanha
    }
  ]
}
```

### Configurações do Sistema
```json
{
  "gameSettings": {
    "xpMultipliers": {
      "easy": 1,
      "medium": 1.5,
      "hard": 2
    },
    "goldMultipliers": {
      "easy": 1,
      "medium": 1.2,
      "hard": 1.5
    },
    "baseRewards": {
      "daily": { "xp": 10, "gold": 5 },
      "weekly": { "xp": 50, "gold": 25 },
      "campaign": { "xp": 100, "gold": 50 }
    },
    "levelProgression": {
      "baseXP": 100,
      "multiplier": 1.2
    }
  }
}
```

## 🏗️ Estrutura de Componentes

### Arquitetura de Componentes (React)
```
App
├── Header
│   ├── Logo
│   └── Navigation
├── HeroDashboard
│   ├── HeroProfile
│   │   ├── HeroAvatar
│   │   ├── HeroStats
│   │   └── XPProgressBar
│   └── HeroResources
│       ├── GoldDisplay
│       └── LevelDisplay
├── MissionCenter
│   ├── MissionTabs
│   │   ├── DailyMissions
│   │   ├── WeeklyMissions
│   │   └── CampaignMissions
│   ├── MissionList
│   │   └── MissionItem
│   │       ├── MissionInfo
│   │       ├── MissionActions
│   │       └── CompletionButton
│   └── AddMissionForm
│       ├── MissionTypeSelector
│       ├── DifficultySelector
│       └── FormFields
├── Notifications
│   ├── LevelUpModal
│   ├── MissionCompleteToast
│   └── RewardAnimation
└── Footer
```

### Hooks Customizados
- `useHero` - Gerencia estado do herói
- `useMissions` - Gerencia CRUD de missões
- `useGameLogic` - Lógica de XP, níveis e recompensas
- `useLocalStorage` - Persistência de dados
- `useNotifications` - Sistema de notificações

## 📋 Plano de Desenvolvimento Passo a Passo

### Passo 1: Setup do Ambiente
**Objetivo**: Configurar o ambiente de desenvolvimento

**Tarefas**:
1. Inicializar projeto com Vite
2. Configurar estrutura de pastas
3. Instalar dependências essenciais
4. Configurar ESLint e Prettier
5. Criar arquivos de configuração base

**Comandos**:
```bash
npm create vite@latest habitquest-rpg -- --template react
cd habitquest-rpg
npm install
npm install -D eslint prettier eslint-config-prettier
```

**Estrutura de Pastas**:
```
src/
├── components/
│   ├── common/
│   ├── hero/
│   ├── missions/
│   └── ui/
├── hooks/
├── utils/
├── styles/
├── data/
└── constants/
```

### Passo 2: Estrutura Básica e Estática
**Objetivo**: Criar layout e componentes visuais sem funcionalidade

**Tarefas**:
1. Criar componentes base (Header, Footer, Layout)
2. Implementar HeroDashboard estático
3. Criar estrutura visual do MissionCenter
4. Definir tema e variáveis CSS
5. Implementar design responsivo básico

**Entregáveis**:
- Layout principal funcional
- Componentes visuais estáticos
- Sistema de cores e tipografia
- Design responsivo básico

### Passo 3: Lógica de Adicionar e Listar Missões
**Objetivo**: Implementar CRUD básico de missões

**Tarefas**:
1. Criar hook `useMissions`
2. Implementar formulário de criação de missões
3. Criar lista de missões por tipo
4. Implementar edição e exclusão de missões
5. Adicionar validações de formulário

**Funcionalidades**:
- Adicionar nova missão
- Listar missões por categoria
- Editar missão existente
- Deletar missão
- Validação de dados

### Passo 4: Sistema de XP e Níveis
**Objetivo**: Implementar mecânica de gamificação

**Tarefas**:
1. Criar hook `useGameLogic`
2. Implementar cálculo de XP e Gold
3. Criar sistema de progressão de níveis
4. Implementar conclusão de missões
5. Adicionar feedback visual de recompensas

**Funcionalidades**:
- Completar missões e receber recompensas
- Sistema de níveis automático
- Cálculo dinâmico de XP necessário
- Feedback visual de progressão

### Passo 5: Persistência com localStorage
**Objetivo**: Salvar e recuperar dados do usuário

**Tarefas**:
1. Criar hook `useLocalStorage`
2. Implementar salvamento automático
3. Criar sistema de backup/restore
4. Implementar reset de missões diárias
5. Adicionar migração de dados

**Funcionalidades**:
- Dados persistem entre sessões
- Reset automático de missões diárias
- Sistema de backup de dados
- Migração de versões de dados

### Passo 6: Polimento e UX
**Objetivo**: Melhorar experiência do usuário

**Tarefas**:
1. Adicionar animações e transições
2. Implementar sistema de notificações
3. Criar efeitos sonoros (opcional)
4. Otimizar performance
5. Testes finais e correções

**Funcionalidades**:
- Animações suaves
- Notificações de conquistas
- Feedback visual aprimorado
- Performance otimizada

## 🎮 Funcionalidades Detalhadas (MVP)

### Dashboard do Herói
- **Perfil do Herói**: Nome, nível, avatar
- **Barra de XP**: Progresso visual para próximo nível
- **Recursos**: Display de Gold atual
- **Estatísticas**: Missões completadas, streak diário

### Sistema de Missões
- **Tipos de Missão**:
  - **Diárias**: Resetam a cada 24h
  - **Semanais**: Resetam semanalmente
  - **Campanha**: Missões únicas de longo prazo

- **Níveis de Dificuldade**:
  - **Fácil**: 1x recompensa base
  - **Médio**: 1.5x XP, 1.2x Gold
  - **Difícil**: 2x XP, 1.5x Gold

### Sistema de Recompensas
- **XP**: Pontos de experiência para progressão
- **Gold**: Moeda do jogo (futuras expansões)
- **Níveis**: Progressão baseada em XP acumulado
- **Conquistas**: Sistema de badges (expansão futura)

## 🎨 Design e UX

### Tema Visual
- **Estilo**: Fantasia moderna com elementos de RPG
- **Paleta de Cores**: 
  - Primária: Azul mágico (#4A90E2)
  - Secundária: Dourado (#F5A623)
  - Sucesso: Verde esmeralda (#7ED321)
  - Perigo: Vermelho rubi (#D0021B)

### Princípios de UX
- **Feedback Imediato**: Toda ação tem resposta visual
- **Progressão Clara**: Usuário sempre sabe seu progresso
- **Simplicidade**: Interface limpa e intuitiva
- **Gamificação Sutil**: Elementos de jogo sem sobrecarregar

### Responsividade
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch Friendly**: Botões e áreas de toque adequadas

## 🔧 Considerações Técnicas

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo para componentes pesados
- **Otimização de Bundle**: Code splitting quando necessário

### Acessibilidade
- **ARIA Labels**: Elementos semânticos adequados
- **Contraste**: Cores com contraste adequado
- **Navegação por Teclado**: Suporte completo

### Manutenibilidade
- **Componentes Modulares**: Reutilização máxima
- **Hooks Customizados**: Lógica compartilhada
- **Tipagem**: TypeScript para maior robustez
- **Testes**: Testes unitários para funções críticas

## 🚀 Expansões Futuras

### Funcionalidades Avançadas
- **Sistema de Classes**: Guerreiro, Mago, Ladino
- **Loja de Itens**: Gastar Gold em melhorias
- **Conquistas**: Sistema de badges e troféus
- **Estatísticas**: Gráficos de produtividade
- **Modo Escuro**: Tema alternativo

### Integrações
- **Sincronização**: Backup em nuvem
- **Compartilhamento**: Redes sociais
- **Notificações**: Push notifications
- **Calendário**: Integração com Google Calendar

## 📈 Métricas de Sucesso

### KPIs do Produto
- **Retenção**: Usuários ativos diários/semanais
- **Engajamento**: Missões completadas por sessão
- **Progressão**: Tempo médio para subir de nível
- **Satisfação**: Feedback qualitativo dos usuários

### Métricas Técnicas
- **Performance**: Tempo de carregamento < 2s
- **Acessibilidade**: Score Lighthouse > 90
- **Responsividade**: Funcional em todos os dispositivos
- **Estabilidade**: Zero crashes em uso normal

---

*Este documento serve como guia completo para o desenvolvimento do HabitQuest RPG. Cada seção pode ser expandida conforme necessário durante o desenvolvimento.*