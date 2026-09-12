import React, { useState } from 'react';
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

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const { playClick, playCoin } = useSound();
  const [isLogin, setIsLogin] = useState(true);

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#060810] via-[#0b0f1d] to-[#04060c]">
      <div className="relative w-full max-w-xl bg-[#0f1526]/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Glow Halo Background */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 border border-amber-400/50 shadow-lg shadow-amber-500/20 mb-2">
            <Shield className="w-8 h-8 text-slate-950 fill-amber-300" />
          </div>

          <h1 className="font-fantasy text-3xl sm:text-4xl font-black text-slate-100 tracking-wider">
            LIFE RPG
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Transform everyday tasks, habits, and workouts into an epic role-playing progression adventure.
          </p>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              playClick();
              setIsLogin(true);
              setError('');
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              isLogin 
                ? 'bg-amber-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-slate-200'
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
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
              !isLogin 
                ? 'bg-amber-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FORGE HERO (SIGNUP)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-5 flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-200">✕</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
                      className={`p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-200">
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 block mb-0.5">
                        {c.perks}
                      </span>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {isLogin ? 'Hero Email or Username' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={isLogin ? 'text' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? 'e.g., hero@zephyr.com or AegisKnight' : 'hero@domain.com'}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Account Handle *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ShadowHunter"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hero Title / Name
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Sir Valerius"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Passcode *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-fantasy font-black text-sm tracking-wider shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'OPENING PORTAL...' : isLogin ? 'COMMENCE EXPEDITION' : 'AWAKEN HERO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill Helper for Hackathon Judges */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 mb-2">
            Hackathon Evaluator Quick-Start:
          </p>
          <button
            type="button"
            onClick={setDemoCredentials}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
          >
            Autofill Evaluator Credentials (hero@zephyr.com)
          </button>
        </div>
      </div>
    </div>
  );
};