# 🎮 HabitDev

> **Transforme sua produtividade em uma aventura épica!**

HabitQuest é uma aplicação web gamificada que transforma suas tarefas diárias em missões de RPG. Complete missões, ganhe XP, suba de nível e torne-se o herói da sua própria jornada de produtividade!

## ✨ Funcionalidades

### 🏆 Sistema de Gamificação
- **Sistema de Níveis**: Evolua de Novato a Lenda do Código
- **XP e Ouro**: Ganhe recompensas ao completar missões
- **Conquistas**: Desbloqueie títulos especiais baseados em suas ações
- **Streaks**: Mantenha sequências de dias ativos

### 📋 Gerenciamento de Missões
- **Missões Diárias**: Tarefas que se renovam todos os dias
- **Missões Semanais**: Desafios de longo prazo
- **Missões de Campanha**: Projetos únicos com prazos específicos
- **Níveis de Dificuldade**: Fácil, Médio e Difícil com recompensas proporcionais

### 👤 Perfil do Herói
- **Dashboard Personalizado**: Visualize seu progresso
- **Estatísticas Detalhadas**: Acompanhe seu desempenho
- **Títulos de Desenvolvedor**: De "Novato" até "Arquiteto de Software"
- **Histórico de Atividades**: Veja sua evolução ao longo do tempo

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/habitquest.git

# Entre no diretório
cd habitquest

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build de produção
npm run test         # Executar testes
npm run lint         # Verificar código com ESLint
npm run format       # Formatar código com Prettier
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **CSS Modules** - Estilização com escopo local
- **TypeScript** - Tipagem estática

### Ferramentas de Desenvolvimento
- **ESLint** - Análise estática de código
- **Prettier** - Formatação automática
- **Vitest** - Framework de testes
- **Testing Library** - Utilitários para testes

### Armazenamento
- **localStorage** - Persistência de dados no navegador
- **JSON** - Formato de dados estruturados

## 📱 Como Usar

### 1. **Criando Missões**
- Clique em "Nova Missão"
- Escolha o tipo (Diária, Semanal, Campanha)
- Defina a dificuldade
- Adicione título e descrição

### 2. **Completando Missões**
- Clique no botão "Completar" da missão
- Ganhe XP e Ouro instantaneamente
- Veja animações de recompensa

### 3. **Acompanhando Progresso**
- Visualize seu nível atual no perfil
- Acompanhe a barra de XP
- Confira suas conquistas desbloqueadas

### 4. **Sistema de Níveis**
- **Nível 1-5**: Novato 🌱
- **Nível 6-10**: Aprendiz 📚
- **Nível 11-20**: Desenvolvedor Jr. 💻
- **Nível 21-35**: Desenvolvedor Pleno ⚡
- **Nível 36-50**: Desenvolvedor Sênior 🚀
- **Nível 51+**: Arquiteto de Software 🏗️

## 🎯 Recompensas por Dificuldade

| Dificuldade | XP Base | Ouro Base | Multiplicador |
|-------------|---------|-----------|---------------|
| **Fácil**   | 10 XP   | 5 Gold    | 1x            |
| **Médio**   | 15 XP   | 6 Gold    | 1.5x          |
| **Difícil** | 20 XP   | 8 Gold    | 2x            |

## 🏅 Conquistas Disponíveis

- **🌟 Primeira Missão**: Complete sua primeira missão
- **🔥 Sequência de Fogo**: Complete 7 dias consecutivos
- **📊 Caçador de Experiência**: Alcance 1000 XP total
- **💰 Colecionador de Ouro**: Acumule 500 moedas de ouro
- **🌙 Programador Noturno**: Complete missões após 22h
- **⚡ Velocista**: Complete 10 missões em um dia

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── achievements/    # Sistema de conquistas
│   ├── auth/           # Autenticação (futuro)
│   ├── hero/           # Perfil do herói
│   ├── missions/       # Gerenciamento de missões
│   ├── stats/          # Estatísticas e dashboards
│   └── ui/             # Componentes de interface
├── hooks/              # Hooks customizados
├── utils/              # Utilitários e helpers
├── styles/             # Arquivos de estilo
└── data/               # Dados e configurações
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎮 Comece Sua Aventura!

Transforme sua rotina em uma jornada épica. Cada tarefa completada é um passo mais próximo de se tornar o herói da sua própria história!

---

**Desenvolvido por mim para gamificar sua produtividade**
