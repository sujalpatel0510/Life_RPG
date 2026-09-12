import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { HeroClass } from '../types';
import { 
  Shield, 
  Sword, 
  Wand2, 
  Zap, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight,
  Check
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';


interface AuthPageProps {
  defaultTab?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { playClick, playCoin } = useSound();

  const isRegisterRoute = defaultTab === 'register' || location.pathname === '/register';
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else if (location.pathname === '/login') {
      setIsLogin(true);
    }
  }, [location.pathname]);


  // Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [password, setPassword] = useState('');
  const [heroClass, setHeroClass] = useState<HeroClass>('WARRIOR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const classes: { id: HeroClass; name: string; icon: any; perks: string; desc: string }[] = [
    { 
      id: 'WARRIOR', 
      name: 'Warrior', 
      icon: Sword, 
      perks: '+5 STR, +2 VIT', 
      desc: 'Master of physical discipline, endurance workouts, and bodily strength.' 
    },
    { 
      id: 'MAGE', 
      name: 'Mage', 
      icon: Wand2, 
      perks: '+5 INT, +2 WIS', 
      desc: 'Scholar of deep code architectures, relentless reading, and complex problem-solving.' 
    },
    { 
      id: 'ROGUE', 
      name: 'Rogue', 
      icon: Zap, 
      perks: '+5 AGI, +2 INT', 
      desc: 'Specialist in speed-coding, time-boxing sprints, and razor-sharp habit streaks.' 
    },
    { 
      id: 'PALADIN', 
      name: 'Paladin', 
      icon: Shield, 
      perks: '+4 VIT, +3 CHA', 
      desc: 'Guardian of health balance, restorative sleep, and motivational team leadership.' 
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    playClick();

    try {
      if (isLogin) {
        await login({ emailOrUsername: email || username, password });
      } else {
        if (!email || !username || !password) {
          throw new Error('Please fulfill all mandatory credentials.');
        }
        await register({
          email,
          username,
          characterName: characterName || username,
          password,
          heroClass,
        });
      }
      playCoin();
    } catch (err: any) {
      setError(err.message || 'Authentication quest failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = () => {
    playClick();
    setEmail('hero@zephyr.com');
    setPassword('zephyr123');
    setUsername('AegisKnight');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#090a0f] relative">
      {/* Top-Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle size="md" />
      </div>

      <div className="relative w-full max-w-xl surface border border-slate-200 dark:border-[#222533] rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Glow Halo Background */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 border border-indigo-400/50 shadow-lg shadow-indigo-600/25 mb-2">
            <Shield className="w-8 h-8 text-white fill-white/20" />
          </div>

          <h1 className="font-fantasy text-3xl sm:text-4xl font-black text-title tracking-wider">
            LIFE RPG
          </h1>
          <p className="text-xs sm:text-sm text-body max-w-sm mx-auto">
            Transform everyday tasks, habits, and workouts into an epic role-playing progression adventure.
          </p>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#151722] border border-slate-200 dark:border-[#222533] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              playClick();
              setIsLogin(true);
              setError('');
              navigate('/login');
            }}
            className={`btn-tactile py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              isLogin 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-600 dark:text-slate-400 hover:text-title dark:hover:text-[#f4f5f8]'
            }`}
          >
            ENTER REALM (LOGIN)
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setIsLogin(false);
              setError('');
              navigate('/register');
            }}
            className={`btn-tactile py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              !isLogin 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-600 dark:text-slate-400 hover:text-title dark:hover:text-[#f4f5f8]'
            }`}
          >
            FORGE HERO (SIGNUP)
          </button>

        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-semibold mb-5 flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200">✕</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                Choose Your Hero Class
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {classes.map((c) => {
                  const Icon = c.icon;
                  const isSelected = heroClass === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setHeroClass(c.id)}
                      className={`btn-tactile p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/10 shadow-sm ring-1 ring-indigo-400/40 font-bold'
                          : 'border-slate-200 dark:border-[#222533] bg-slate-50 dark:bg-[#151722] hover:bg-slate-100 dark:hover:bg-[#1a1d2b]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 font-bold text-xs text-title">
                          <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        {c.perks}
                      </span>
                      <p className="text-[10px] text-body line-clamp-1">
                        {c.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Email or Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
              {isLogin ? 'Hero Email or Username' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type={isLogin ? 'text' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? 'e.g., hero@zephyr.com or AegisKnight' : 'hero@domain.com'}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl input text-base sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                  Account Handle *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ShadowHunter"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl input text-base sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
                  Hero Title / Name
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Sir Valerius"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl input text-base sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
              Passcode *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl input text-base sm:text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="btn-tactile w-full py-3.5 mt-2 rounded-xl btn-primary text-white font-fantasy font-black text-sm tracking-wider shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'OPENING PORTAL...' : isLogin ? 'COMMENCE EXPEDITION' : 'AWAKEN HERO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill Helper for Hackathon Judges */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-[#222533] text-center">
          <p className="text-[11px] text-muted mb-2">
            Hackathon Evaluator Quick-Start:
          </p>
          <button
            type="button"
            onClick={setDemoCredentials}
            className="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 underline font-semibold transition"
          >
            Autofill Evaluator Credentials (hero@zephyr.com)
          </button>
        </div>
      </div>
    </div>
  );
};