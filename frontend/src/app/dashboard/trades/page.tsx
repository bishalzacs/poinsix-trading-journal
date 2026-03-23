"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, PlusCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function TradesPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.uid)
        .order('opened_at', { ascending: false });

      if (data) setTrades(data);
      if (error) console.error(error);
      
      setLoading(false);
    };

    fetchTrades();
  }, [user]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Trades Log</h1>
          <p className="text-zinc-400 text-sm">Review your custom trading history and adherence to rules.</p>
        </div>
        <Link 
          href="/dashboard/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Log Trade
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs border-b border-zinc-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Date & Session</th>
                <th className="px-6 py-4">Instrument</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4 text-center">SL Used</th>
                <th className="px-6 py-4">Lot Size</th>
                <th className="px-6 py-4">Win/Loss</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-right">Amount ($)</th>
                <th className="px-6 py-4 text-right">Pips</th>
                <th className="px-6 py-4">2 Trade Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-zinc-500">
                    No trades logged yet. Click "Log Trade" or "Import Data" to begin.
                  </td>
                </tr>
              ) : (
                trades.map((trade) => {
                  const pnl = parseFloat(trade.pnl || trade.profit || 0);
                  const isWin = pnl > 0;
                  const isBE = pnl === 0;
                  
                  return (
                    <tr key={trade.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{new Date(trade.opened_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        <div className="text-xs text-zinc-500 uppercase mt-0.5">{trade.session || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 font-bold tracking-wide text-white">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          trade.trade_type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {trade.trade_type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {trade.trade_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          trade.sl_used === 'YES' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {trade.sl_used || 'NO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-400">{trade.position_size} lot</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isWin ? 'bg-emerald-500 text-emerald-950' : isBE ? 'bg-blue-500 text-blue-950' : 'bg-red-500 text-red-950'
                        }`}>
                          {isWin ? 'Win' : isBE ? 'BE' : 'Lose'}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate text-zinc-400" title={trade.reason || trade.comment}>
                        {trade.reason || trade.comment || '-'}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold tracking-tight ${
                        isWin ? 'text-emerald-400' : isBE ? 'text-zinc-400' : 'text-red-400'
                      }`}>
                        {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-zinc-400">
                        {trade.pips ? `${trade.pips} pips` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                          trade.rules_followed === 'followed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 
                          trade.rules_followed === 'not followed' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-zinc-700 text-zinc-500'
                        }`}>
                          {trade.rules_followed || '-'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
