"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { EquityChart } from '@/components/EquityChart';
import { Loader2, UploadCloud, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    totalPnL: 0, 
    winRate: 0, 
    totalTrades: 0,
    totalPips: 0,
    avgRR: 0,
    profitFactor: 0,
    rulesAdherence: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);

    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.uid);

    if (trades && trades.length > 0) {
      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => t.pnl > 0);
      const losingTrades = trades.filter(t => t.pnl < 0);
      
      const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winRate = (winningTrades.length / totalTrades) * 100;
      
      const totalPips = trades.reduce((sum, t) => sum + (t.pips || 0), 0);
      
      // Calculate Profit Factor
      const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
      const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
      
      // Rules Adherence
      const followedRules = trades.filter(t => t.rules_followed === 'followed').length;
      const rulesAdherence = (followedRules / totalTrades) * 100;

      setStats({ 
        totalPnL, 
        winRate, 
        totalTrades,
        totalPips,
        avgRR: 1.5, // Placeholder for now - needs entry/stop data
        profitFactor,
        rulesAdherence
      });
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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Trading Desk
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-500/20">
              Live Data
            </span>
          </h1>
        </div>
        
        <Link 
          href="/dashboard/import"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Import Data
        </Link>
      </div>

      {stats.totalTrades === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:bg-amber-500/20 transition-colors" onClick={() => window.location.href='/dashboard/import'}>
          <div>
            <h3 className="text-amber-500 font-bold text-lg mb-1">Your trading vault is empty!</h3>
            <p className="text-amber-500/80 text-sm">Synchronize your MT5 or upload a statement to unlock advanced prop-firm analytics.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Core Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Net PnL</p>
             <h3 className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </h3>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Win Rate</p>
             <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</h3>
                <p className="text-zinc-500 text-xs mb-1">({stats.totalTrades} trades)</p>
             </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Profit Factor</p>
             <h3 className="text-2xl font-bold text-white">{stats.profitFactor.toFixed(2)}</h3>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Pips</p>
             <h3 className="text-2xl font-bold text-emerald-400">+{stats.totalPips}</h3>
          </div>
        </div>

        {/* Chart View */}
        <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-white font-bold transition-all">Performance Curve</h3>
             <div className="flex gap-4">
                <div className="text-right">
                   <p className="text-zinc-500 text-[10px] uppercase font-bold">Rules Adherence</p>
                   <p className="text-emerald-500 font-bold">{stats.rulesAdherence.toFixed(0)}%</p>
                </div>
                <div className="text-right border-l border-zinc-800 pl-4">
                   <p className="text-zinc-500 text-[10px] uppercase font-bold">Avg RR</p>
                   <p className="text-white font-bold">1:{stats.avgRR.toFixed(1)}</p>
                </div>
             </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <EquityChart />
          </div>
        </div>
      </div>
    </div>
  )
}
