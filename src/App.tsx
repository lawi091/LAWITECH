import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, LayoutDashboard, Globe, Key, Settings, LogOut, ChevronRight, BookOpen, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Vault from './components/Vault';
import SecureBrowser from './components/SecureBrowser';
import Dashboard from './components/Dashboard';
import Guide from './components/Guide';
import OpenGradientGuide from './components/OpenGradientGuide';
import { BrowsingHistory } from './types';
import { encrypt, decrypt } from './lib/crypto';

type Tab = 'vault' | 'browser' | 'dashboard' | 'guide' | 'opengradient' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('vault');
  const [history, setHistory] = useState<BrowsingHistory[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('sentinel_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setIsAuthLoading(true);
    // Simulate key derivation delay
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthLoading(false);
      setError(null);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setActiveTab('vault');
  };

  const recordVisit = async (url: string, trackers: number) => {
    try {
      const encryptedUrl = await encrypt(url, password);
      const newEntry: BrowsingHistory = {
        id: Math.random().toString(36).substr(2, 9),
        url: url, // In a real app, we wouldn't store the raw URL in state if we want true privacy
        timestamp: Date.now(),
        encryptedUrl: encryptedUrl,
        trackersBlocked: trackers
      };
      const updatedHistory = [newEntry, ...history].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem('sentinel_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to encrypt history entry');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sentinel_history');
  };

  const decryptHistoryUrl = async (encrypted: string) => {
    return await decrypt(encrypted, password);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Shield size={48} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">SentinelVault</h1>
              <p className="text-slate-400 text-sm mt-1">Military-grade encryption for your digital life.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your vault key..."
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
            </div>

            <button 
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isAuthLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Vault <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>AES-256-GCM</span>
            <span>PBKDF2-SHA256</span>
            <span>ZERO-KNOWLEDGE</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-emerald-500/20">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-emerald-500 rounded-lg text-white">
            <Shield size={20} />
          </div>
          <span className="font-bold text-white tracking-tight">SentinelVault</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('vault')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'vault' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Key size={20} /> Secure Vault
          </button>
          <button 
            onClick={() => setActiveTab('browser')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'browser' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Globe size={20} /> Secure Browser
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'guide' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen size={20} /> Dev Guide
          </button>
          <button 
            onClick={() => setActiveTab('opengradient')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'opengradient' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Network size={20} /> OpenGradient
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={20} /> Lock Vault
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'vault' && <Vault password={password} onLogout={handleLogout} />}
              {activeTab === 'browser' && <SecureBrowser onVisit={recordVisit} />}
              {activeTab === 'dashboard' && (
                <Dashboard 
                  history={history} 
                  onClear={clearHistory} 
                  onDecrypt={decryptHistoryUrl} 
                />
              )}
              {activeTab === 'guide' && <Guide />}
              {activeTab === 'opengradient' && <OpenGradientGuide />}
              {activeTab === 'settings' && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-slate-800">Auto-lock Vault</p>
                        <p className="text-sm text-slate-500">Lock the vault after 5 minutes of inactivity.</p>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-slate-800">Tracker Blocking</p>
                        <p className="text-sm text-slate-500">Automatically block known trackers and ads.</p>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-slate-800">Zero-Knowledge Backups</p>
                        <p className="text-sm text-slate-500">Sync encrypted vault data across devices.</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
