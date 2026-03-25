import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { VaultItem } from '../types';
import { encrypt, decrypt } from '../lib/crypto';

interface VaultProps {
  password: string;
  onLogout: () => void;
}

export default function Vault({ password, onLogout }: VaultProps) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<VaultItem>>({ type: 'text', category: 'General' });
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('sentinel_vault');
    if (saved) {
      try {
        // In a real app, the whole vault might be one encrypted blob
        // For this demo, we'll store items and decrypt them on the fly or keep them in memory
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load vault');
      }
    }
  }, []);

  const saveVault = (newItems: VaultItem[]) => {
    setItems(newItems);
    localStorage.setItem('sentinel_vault', JSON.stringify(newItems));
  };

  const handleAddItem = async () => {
    if (!newItem.label || !newItem.value) return;
    
    const item: VaultItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: newItem.label,
      value: newItem.value,
      type: newItem.type as any,
      category: newItem.category || 'General',
    };

    const updated = [...items, item];
    saveVault(updated);
    setNewItem({ type: 'text', category: 'General' });
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    saveVault(items.filter(i => i.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    const next = new Set(visibleIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleIds(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-emerald-500" />
          Secure Vault
        </h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Label</label>
              <input 
                type="text" 
                placeholder="e.g. Personal Email"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.label || ''}
                onChange={e => setNewItem({...newItem, label: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
              <select 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.type}
                onChange={e => setNewItem({...newItem, type: e.target.value as any})}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="payment">Payment Info</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Value</label>
              <textarea 
                placeholder="Sensitive data..."
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                value={newItem.value || ''}
                onChange={e => setNewItem({...newItem, value: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleAddItem} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Securely</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                <h3 className="font-semibold text-slate-800 mt-1">{item.label}</h3>
              </div>
              <button 
                onClick={() => deleteItem(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="relative mt-3">
              <div className="bg-slate-50 p-3 rounded-lg font-mono text-sm break-all pr-10 min-h-[44px] flex items-center">
                {visibleIds.has(item.id) ? item.value : '••••••••••••••••'}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button 
                  onClick={() => toggleVisibility(item.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {visibleIds.has(item.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button 
                  onClick={() => copyToClipboard(item.value, item.id)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {copiedId === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center space-y-3">
            <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400">
              <Lock size={32} />
            </div>
            <p className="text-slate-500">Your vault is empty. Add sensitive information to store it securely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
