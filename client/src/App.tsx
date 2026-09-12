import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Shield, Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-rpg-dark-bg text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-rose-600/25 border border-rose-400/50 mb-4 animate-pulse">
          <Shield className="w-8 h-8 text-white fill-rose-300" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-fantasy font-bold text-rose-600 dark:text-rose-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Synchronizing with PostgreSQL Realm...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage defaultTab="login" />} />
        <Route path="/register" element={<AuthPage defaultTab="register" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/quests" replace />} />
      <Route path="/register" element={<Navigate to="/quests" replace />} />
      <Route path="/" element={<Navigate to="/quests" replace />} />
      <Route path="/quests" element={<Dashboard activeTab="quests" />} />
      <Route path="/boss" element={<Dashboard activeTab="boss" />} />
      <Route path="/armoury" element={<Dashboard activeTab="armoury" />} />
      <Route path="/character" element={<Dashboard activeTab="character" />} />
      <Route path="/history" element={<Dashboard activeTab="history" />} />
      <Route path="*" element={<Navigate to="/quests" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SoundProvider>
            <MainApp />
          </SoundProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;