"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, Plus, ShieldCheck, X, HardDrive, Key, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  
  // Form State
  const [mt5Login, setMt5Login] = useState('');
  const [mt5Server, setMt5Server] = useState('');
  const [mt5Password, setMt5Password] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('trading_accounts')
      .select('*')
      .eq('user_id', user.uid);
    
    if (data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    
    try {
      // 1. We send the password to the backend to be encrypted and saved, 
      // OR we encrypt it here if we have the public key. 
      // For this MVP simplicity, we'll let the backend handle the initial "Secure Add".
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          mt5_login: mt5Login,
          mt5_server: mt5Server,
          mt5_password: mt5Password
        })
      });

      if (response.ok) {
        await fetchAccounts();
        setShowConnect(false);
        setMt5Login('');
        setMt5Server('');
        setMt5Password('');
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to save account');
      }
    } catch (err) {
      setError('Connection refused by server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <button 
          onClick={() => setShowConnect(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-medium mb-1 border-b border-zinc-800 pb-4">MT5 Trading Accounts</h3>
          
          <div className="space-y-4 mt-6">
            {accounts.length === 0 ? (
              <p className="text-zinc-500 text-sm italic py-4 text-center">No accounts connected yet.</p>
            ) : (
              accounts.map((acc) => (
                <div key={acc.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                  <div>
                    <p className="font-bold text-white text-lg">#{acc.mt5_login}</p>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{acc.mt5_server}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Connect MT5 Modal */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Connect MetaTrader 5</h3>
              <button onClick={() => setShowConnect(false)} className="text-zinc-500 hover:text-white transition-colors"><X /></button>
            </div>
            
            <form onSubmit={handleConnect} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">MT5 Login ID</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    required
                    type="text"
                    value={mt5Login}
                    onChange={e => setMt5Login(e.target.value)}
                    placeholder="e.g. 50123456"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Server Name</label>
                <div className="relative group">
                  <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    required
                    type="text"
                    value={mt5Server}
                    onChange={e => setMt5Server(e.target.value)}
                    placeholder="e.g. XMGlobal-Real-12"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Investor Password</label>
                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    required
                    type="password"
                    value={mt5Password}
                    onChange={e => setMt5Password(e.target.value)}
                    placeholder="Read-only password"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500/50 outline-none transition-all" 
                  />
                </div>
              </div>

              {error && <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">{error}</p>}

              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                <p className="text-xs text-blue-200/50 leading-relaxed">
                  We use <span className="text-blue-400 font-bold">Fernet (AES)</span> encryption. We only request your <span className="text-white">Investor Password</span> for read-only access.
                </p>
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Securely Connect Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
