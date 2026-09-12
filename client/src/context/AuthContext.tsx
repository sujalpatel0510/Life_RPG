import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Character } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  character: Character | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('liferpg_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!localStorage.getItem('liferpg_token')) {
        setUser(null);
        setCharacter(null);
        setIsLoading(false);
        return;
      }
      const data = await api.auth.getMe();
      if (data && data.user) {
        setUser(data.user);
        setCharacter(data.user.character);
      }
    } catch (err) {
      console.error('Failed to verify hero session:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login(credentials);
      localStorage.setItem('liferpg_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setCharacter(data.user.character);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const data = await api.auth.register(payload);
      localStorage.setItem('liferpg_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setCharacter(data.user.character);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('liferpg_token');
    setToken(null);
    setUser(null);
    setCharacter(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        character,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setCharacter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};