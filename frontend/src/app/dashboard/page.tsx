"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { EquityChart } from '@/components/EquityChart';
import { Loader2, UploadCloud, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPnL: 0, winRate: 0, totalTrades: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch Trades directly from Supabase (Uploaded via CSV/AI)
    const { data: trades } = await supabase
      .from('trades')
      .select('pnl')
      .eq('user_id', user.uid);

    if (trades) {
      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => t.pnl > 0).length;
      const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      setStats({ totalPnL, winRate, totalTrades });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
        </div>
        
        <Link 
          href="/dashboard/import"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Import Trades
        </Link>
      </div>

      {stats.totalTrades === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:bg-amber-500/20 transition-colors" onClick={() => window.location.href='/dashboard/import'}>
          <div>
            <h3 className="text-amber-500 font-bold text-lg mb-1">Your journal is empty!</h3>
            <p className="text-amber-500/80 text-sm">Upload a CSV, PDF, or screenshot of your broker statement to generate your analytics.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

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

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-96 flex flex-col">
        <h3 className="text-white font-medium mb-4">Equity Curve</h3>
        <div className="flex-1 w-full h-full min-h-[300px]">
          <EquityChart />
        </div>
      </div>
    </div>
  )
}
