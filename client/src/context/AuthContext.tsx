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
  // Try loading cached user for instant 0ms rendering
  const getInitialUser = (): User | null => {
    try {
      const cached = localStorage.getItem('liferpg_user_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const initialUser = getInitialUser();
  const [user, setUser] = useState<User | null>(initialUser);
  const [character, setCharacter] = useState<Character | null>(initialUser ? initialUser.character : null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('liferpg_token'));
  
  // If we already have token and cached user, don't show full-page loading spinner!
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser && !!localStorage.getItem('liferpg_token'));

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('liferpg_token');
    if (!savedToken) {
      setUser(null);
      setCharacter(null);
      setIsLoading(false);
      return;
    }

    try {
      // Timeout after 3.5 seconds to guarantee no indefinite hanging if backend is cold
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const data = await api.auth.getMe(controller.signal);
      clearTimeout(timeoutId);

      if (data && data.user) {
        setUser(data.user);
        setCharacter(data.user.character);
        localStorage.setItem('liferpg_user_cache', JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn('Background session verification note:', err);
      // If error is 401 or token expired and no cached user, log out
      if (!initialUser) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    // Keep user on AuthPage with in-button spinner instead of full-screen unmount
    const data = await api.auth.login(credentials);
    localStorage.setItem('liferpg_token', data.token);
    localStorage.setItem('liferpg_user_cache', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setCharacter(data.user.character);
  };

  const register = async (payload: any) => {
    const data = await api.auth.register(payload);
    localStorage.setItem('liferpg_token', data.token);
    localStorage.setItem('liferpg_user_cache', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setCharacter(data.user.character);
  };

  const logout = () => {
    localStorage.removeItem('liferpg_token');
    localStorage.removeItem('liferpg_user_cache');
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