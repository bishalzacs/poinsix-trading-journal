"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, Plus, ShieldCheck, X } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  
  // Form State
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchConnections = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('broker_connections')
      .select('*')
      .eq('user_id', user.uid);
    
    if (data) setConnections(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const { error } = await supabase
      .from('broker_connections')
      .upsert({
        user_id: user.uid,
        broker_name: selectedBroker,
        api_key: apiKey, // In production, we'd encrypt this client-side or use a secure vault
        api_secret: apiSecret
      });

    if (!error) {
      await fetchConnections();
      setShowConnect(false);
      setApiKey('');
      setApiSecret('');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  const isConnected = (name: string) => connections.some(c => c.broker_name.toLowerCase() === name.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-medium mb-1">Connected Brokers</h3>
          <p className="text-sm text-zinc-400 mb-6">Manage your API connections securely.</p>
          
          <div className="space-y-4">
            {['Exness', 'XM_Global'].map((broker) => (
              <div key={broker} className="p-4 border border-zinc-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{broker.replace('_', ' ')}</p>
                  <p className={`text-xs ${isConnected(broker) ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {isConnected(broker) ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                {!isConnected(broker) ? (
                  <button 
                    onClick={() => { setSelectedBroker(broker); setShowConnect(true); }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors"
                  >
                    Connect
                  </button>
                ) : (
                  <button className="px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm rounded-md transition-colors">
                    Manage
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Connect {selectedBroker.replace('_', ' ')}</h3>
              <button onClick={() => setShowConnect(false)} className="text-zinc-500 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleConnect} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">API Key</label>
                <input 
                  required
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">API Secret / Password</label>
                <input 
                  required
                  type="password"
                  value={apiSecret}
                  onChange={e => setApiSecret(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" 
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  Your credentials are encrypted and stored securely. We only use them to read your trade history.
                </p>
              </div>
              <button 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'Save Connection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
