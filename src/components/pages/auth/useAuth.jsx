import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './auth';

// 1. Criação do Contexto
const AuthContext = createContext();

// 2. O Provider que gerencia o estado e faz a requisição única
export const AuthProvider = ({ children }) => {
  // Inicializa o estado do usuário lendo do localStorage para evitar piscar na tela
  const [user, setUserState] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  
  const [loading, setLoading] = useState(true);

  // useEffect que roda SOMENTE UMA VEZ para toda a aplicação
  useEffect(() => {
    async function fetchAndValidateUser() {
      // Se já carregamos e o usuário é válido, só setamos loading para false e saímos
      if (user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // REQUISIÇÃO AO BACKEND É FEITA AQUI (e só aqui!)
        const userResp = await api.get('me/'); 
        const userData = userResp.data;

        // Atualiza o estado global e o localStorage
        localStorage.setItem('auth', JSON.stringify(userData));
        setUserState(userData);

      } catch (error) {
        // Limpa tudo se a sessão for inválida
        localStorage.removeItem('auth');
        setUserState(null);
        window.location.href = '/login'; 

      } finally {
        setLoading(false);
      }
    }
    
    fetchAndValidateUser();
  }, []); // O array vazio garante que rode apenas uma vez!

  // Função simples de login (exemplo)
  const login = (userData) => {
    setUserState(userData);
    localStorage.setItem('auth', JSON.stringify(userData));
    // Opcional: Redirecionar para a home
  };

  // Função simples de logout (exemplo)
  const sair = () => {
    setUserState(null);
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  const value = { user, loading, login, sair };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. O Custom Hook para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};