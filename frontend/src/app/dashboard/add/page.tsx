"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, PlusCircle, CheckCircle } from 'lucide-react';

export default function AddTradePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    opened_at: new Date().toISOString().split('T')[0],
    session: 'London',
    symbol: 'XAU/USD',
    trade_type: 'SELL',
    sl_used: 'YES',
    position_size: '0.01',
    pnl: '',
    pips: '',
    reason: '',
    rules_followed: 'YES' // Changed from 'followed'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate Pips if Profit or Lot Size changes
      if (name === 'pnl' || name === 'position_size') {
        const pnl = parseFloat(name === 'pnl' ? value : prev.pnl);
        const lots = parseFloat(name === 'position_size' ? value : prev.position_size);
        
        if (!isNaN(pnl) && !isNaN(lots) && lots > 0) {
          // Standard Calculation: 0.01 lot = $0.10 per pip
          // Pips = Profit / (Lots * 10)
          const calculatedPips = Math.round(Math.abs(pnl) / (lots * 10));
          newData.pips = calculatedPips.toString();
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess(false);

    try {
      const pnlNum = parseFloat(formData.pnl);
      
      const tradeData = {
        user_id: user.uid,
        symbol: formData.symbol.toUpperCase(),
        broker_name: 'Manual',
        trade_type: formData.trade_type,
        position_size: parseFloat(formData.position_size) || 0,
        pnl: pnlNum || 0,
        opened_at: new Date(formData.opened_at).toISOString(),
        closed_at: new Date(formData.opened_at).toISOString(),
        
        session: formData.session,
        sl_used: formData.sl_used,
        pips: parseFloat(formData.pips) || 0,
        rules_followed: formData.rules_followed === 'YES' ? 'followed' : 'not followed',
        reason: formData.reason
      };

      const { error } = await supabase.from('trades').insert([tradeData]);
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/trades');
      }, 1500);
      
    } catch (err: any) {
      console.error('Failed to add trade:', err);
      alert('Database Error: ' + (err?.message || err?.details || JSON.stringify(err)));
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-blue-500" />
          Log Trade
        </h1>
        <p className="text-zinc-400 mt-2">Manually record a trade matching your personal spreadsheet rules.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Date</label>
            <input 
              type="date" 
              name="opened_at"
              required
              value={formData.opened_at}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Session</label>
            <select 
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Asia">Asia</option>
              <option value="London">London</option>
              <option value="New York">New York</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Instrument</label>
            <input 
              type="text" 
              name="symbol"
              required
              placeholder="e.g. XAU/USD"
              value={formData.symbol}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Direction</label>
            <select 
              name="trade_type"
              value={formData.trade_type}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium ${formData.trade_type === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Lot Size (Risk)</label>
            <input 
              type="number" 
              step="0.01"
              name="position_size"
              required
              value={formData.position_size}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Stop Loss Used?</label>
            <select 
              name="sl_used"
              value={formData.sl_used}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium ${formData.sl_used === 'YES' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Followed Your Rules?</label>
            <select 
              name="rules_followed"
              value={formData.rules_followed}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium ${formData.rules_followed === 'YES' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Profit / Loss Amount ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-zinc-500">$</span>
              <input 
                type="number" 
                step="0.01"
                name="pnl"
                required
                placeholder="-4.31"
                value={formData.pnl}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Pips Captured (Auto)</label>
            <input 
              type="number" 
              name="pips"
              required
              placeholder="0"
              value={formData.pips}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none bg-blue-500/5"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Reason / Notes</label>
          <textarea 
            name="reason"
            placeholder="e.g., Good market direction and entry, SL hunt with wick, FOMO..."
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4 border-t border-zinc-800">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             success ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : 'Save Trade'}
          </button>
        </div>

        {/* Row 4 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Reason / Notes</label>
          <textarea 
            name="reason"
            placeholder="e.g., Good market direction and entry, SL hunt with wick, FOMO..."
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4 border-t border-zinc-800">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             success ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : 'Save Trade'}
          </button>
        </div>
      </form>
    </div>
  );
}
