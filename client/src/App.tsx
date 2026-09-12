import React from 'react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070a12] text-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-rose-600/25 border border-rose-400/50 mb-4 animate-pulse">
          <Shield className="w-8 h-8 text-slate-950 fill-rose-300" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-fantasy font-bold text-rose-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Synchronizing with PostgreSQL Realm...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SoundProvider>
          <MainApp />
        </SoundProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;