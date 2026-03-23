"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { EquityChart } from '@/components/EquityChart';
import { Loader2, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPnL: 0, winRate: 0, totalTrades: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data: trades, error } = await supabase
      .from('trades')
      .select('pnl')
      .eq('user_id', user.uid);

    if (error) {
      console.error('Error fetching trades:', error);
    } else if (trades) {
      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => t.pnl > 0).length;
      const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      setStats({
        totalPnL,
        winRate,
        totalTrades
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sync-trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, broker_name: 'xm_global' }) // Defaulting for now
      });
      if (response.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
        >
          {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sync Trades'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Total PnL</h3>
          <p className={`text-3xl font-bold mt-2 ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Win Rate</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Total Trades</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.totalTrades}</p>
        </div>
      </div>

      {/* Equity Chart Shell */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-96 flex flex-col">
        <h3 className="text-white font-medium mb-4">Equity Curve</h3>
        <div className="flex-1 w-full h-full min-h-[300px]">
          <EquityChart />
        </div>
      </div>
    </div>
  )
}
