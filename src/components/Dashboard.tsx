import React, { useState } from 'react';
import { History, Lock, Unlock, Eye, EyeOff, Shield, Activity, Globe, Trash2 } from 'lucide-react';
import { BrowsingHistory } from '../types';

interface DashboardProps {
  history: BrowsingHistory[];
  onClear: () => void;
  onDecrypt: (encrypted: string) => Promise<string>;
}

export default function Dashboard({ history, onClear, onDecrypt }: DashboardProps) {
  const [decryptedUrls, setDecryptedUrls] = useState<Record<string, string>>({});
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);

  const handleDecrypt = async (id: string, encrypted: string) => {
    if (decryptedUrls[id]) {
      const next = { ...decryptedUrls };
      delete next[id];
      setDecryptedUrls(next);
      return;
    }

    setIsDecrypting(id);
    try {
      const decrypted = await onDecrypt(encrypted);
      setDecryptedUrls(prev => ({ ...prev, [id]: decrypted }));
    } catch (e) {
      alert('Decryption failed. Please check your vault password.');
    } finally {
      setIsDecrypting(null);
    }
  };

  const totalTrackers = history.reduce((acc, curr) => acc + curr.trackersBlocked, 0);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Security Score</p>
            <p className="text-2xl font-bold text-slate-900">98/100</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Trackers Blocked</p>
            <p className="text-2xl font-bold text-slate-900">{totalTrackers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Encrypted Sessions</p>
            <p className="text-2xl font-bold text-slate-900">{history.length}</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-slate-400" />
            <h3 className="font-bold text-slate-800 text-lg">Encrypted Browsing History</h3>
          </div>
          <button 
            onClick={onClear}
            className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Trash2 size={16} /> Clear History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Encrypted Resource</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Trackers</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                        {decryptedUrls[item.id] ? <Unlock size={16} className="text-emerald-500" /> : <Lock size={16} />}
                      </div>
                      <div className="max-w-[300px]">
                        <p className="text-sm font-mono text-slate-500 truncate">
                          {decryptedUrls[item.id] || item.encryptedUrl.slice(0, 40) + '...'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.trackersBlocked > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {item.trackersBlocked} blocked
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDecrypt(item.id, item.encryptedUrl)}
                      disabled={isDecrypting === item.id}
                      className={`p-2 rounded-lg transition-all ${decryptedUrls[item.id] ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {isDecrypting === item.id ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : decryptedUrls[item.id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    No encrypted history found. Start browsing securely to see activity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
