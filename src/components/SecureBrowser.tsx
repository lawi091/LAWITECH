import React, { useState } from 'react';
import { Globe, Shield, ShieldAlert, ArrowLeft, ArrowRight, RotateCcw, Lock, Search } from 'lucide-react';
import { BrowsingHistory } from '../types';

interface SecureBrowserProps {
  onVisit: (url: string, trackers: number) => void;
}

const TRACKER_LIST = [
  'doubleclick.net',
  'google-analytics.com',
  'facebook.com/tr',
  'adservice.google.com',
  'quantserve.com',
  'scorecardresearch.com'
];

export default function SecureBrowser({ onVisit }: SecureBrowserProps) {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://secure-web.sentinel');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;

    let targetUrl = url;
    if (!url.startsWith('http')) targetUrl = 'https://' + url;

    setIsLoading(true);
    // Simulate network delay and tracker detection
    setTimeout(() => {
      const trackers = Math.floor(Math.random() * 8);
      setCurrentUrl(targetUrl);
      onVisit(targetUrl, trackers);
      setIsLoading(false);
      setUrl('');
    }, 800);
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col h-[600px]">
      {/* Browser Chrome */}
      <div className="bg-slate-800 p-3 flex items-center gap-4 border-bottom border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
        </div>
        
        <div className="flex items-center gap-3 text-slate-400">
          <ArrowLeft size={18} className="cursor-not-allowed opacity-50" />
          <ArrowRight size={18} className="cursor-not-allowed opacity-50" />
          <RotateCcw size={18} className="cursor-pointer hover:text-white transition-colors" />
        </div>

        <form onSubmit={handleNavigate} className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Lock size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Encrypted</span>
          </div>
          <input 
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={currentUrl}
            className="w-full bg-slate-950 text-slate-200 pl-24 pr-10 py-1.5 rounded-lg border border-slate-700 focus:border-emerald-500 outline-none text-sm transition-all"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </form>

        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
          <Shield size={14} />
          <span className="text-xs font-bold">Sentinel Active</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-950 p-8 flex flex-col items-center justify-center text-center space-y-6 relative">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-mono text-sm">Encrypting tunnel to {url}...</p>
          </div>
        ) : (
          <>
            <div className="p-6 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
              <Globe size={64} className="text-slate-700" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white">Secure Viewport</h3>
              <p className="text-slate-400 text-sm">
                You are currently browsing through an encrypted AES-256-GCM tunnel. 
                All requests are proxied and trackers are automatically stripped.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold">Protected</span>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Trackers</p>
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldAlert size={16} />
                  <span className="text-sm font-bold">Blocked</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 px-8">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-md">
                    <Lock size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Real-time Encryption</p>
                    <p className="text-[10px] text-slate-500 font-mono">Tunnel ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500">ACTIVE</p>
                  <p className="text-[10px] text-slate-500">256-bit GCM</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
