import React, { useState, useEffect, createContext, useContext } from 'react'
import { storage } from '../utils/storage'

// Context para autenticação
const AuthContext = createContext()

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = storage.load('currentUser');
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função para registrar novo usuário
  const register = async (userData) => {
    try {
      const { username, email, password, confirmPassword } = userData;

      // Validações
      if (!username || !email || !password || !confirmPassword) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }

      // Verificar se usuário já existe
      const existingUsers = storage.load('users') || [];
      const userExists = existingUsers.find(u => 
        u.username === username || u.email === email
      );

      if (userExists) {
        throw new Error('Usuário ou email já existe');
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        createdAt: new Date().toISOString(),
        level: 1,
        xp: 0,
        gold: 0,
        avatar: '🎮',
        title: 'Desenvolvedor Iniciante',
        stats: {
          totalMissions: 0,
          completedMissions: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      };

      // Salvar usuário na lista de usuários
      const updatedUsers = [...existingUsers, newUser];
      storage.save('users', updatedUsers);

      // Definir como usuário atual
      storage.save('currentUser', newUser);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função para fazer login
  const login = async (credentials) => {
    try {
      const { username, password } = credentials;

      if (!username || !password) {
        throw new Error('Username e senha são obrigatórios');
      }

      // Buscar usuário
      const users = storage.load('users') || [];
      const user = users.find(u => 
        (u.username === username || u.email === username)
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Em um sistema real, você verificaria a senha hash
      // Por simplicidade, vamos simular que a senha está correta
      // se o usuário existe (em produção, NUNCA faça isso!)
      
      // Definir como usuário atual
      storage.save('currentUser', user);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função para fazer logout
  const logout = () => {
    storage.save('currentUser', null);
    setUser(null);
  };

  // Função para atualizar perfil do usuário
  const updateProfile = (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      
      // Atualizar na lista de usuários
      const users = storage.load('users') || [];
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        storage.save('users', users);
      }

      // Atualizar usuário atual
      storage.save('currentUser', updatedUser);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;