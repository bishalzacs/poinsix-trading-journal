"use client";

import { useState, useCallback } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, FileSpreadsheet, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/utils/supabaseClient';

export default function ImportDataPage() {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [parsedCount, setParsedCount] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file) return;
    if (!user) {
      setStatusText('Error: Must be logged in.');
      return;
    }

    setUploading(true);
    setSuccess(false);
    
    setStatusText('Uploading file to AI Vision Engine...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);

      setStatusText('Analyzing statement layout and data...');
      
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        setStatusText(`Error: ${result.message}`);
        setUploading(false);
        return;
      }

      setParsedCount(result.data?.length || 0);
      setStatusText(`Parsed ${result.data?.length || 0} trades! Saving to database...`);
      
      if (result.data && result.data.length > 0) {
        
        const tradesToInsert = result.data.map((t: any) => ({
          user_id: user.uid,
          symbol: t.symbol || 'UNKNOWN',
          broker_name: 'AI Vision', // Added to match schema requirements
          trade_type: (t.type || 'BUY').toUpperCase(),
          position_size: parseFloat(t.volume || '0') || 0,
          pnl: parseFloat(t.profit || '0') || 0,
          opened_at: t.open_time ? new Date(t.open_time).toISOString() : new Date().toISOString(),
          closed_at: t.close_time ? new Date(t.close_time).toISOString() : new Date().toISOString(),
          session: 'Imported AI',
          sl_used: 'UNKNOWN',
          pips: 0,
          rules_followed: 'followed',
          reason: 'Auto-extracted by AI Vision'
        }));

        const { error } = await supabase.from('trades').insert(tradesToInsert);
        if (error) throw error;
      }

      setSuccess(true);

    } catch (err: any) {
      console.error(err);
      setStatusText('Upload failed. Check network.');
    } finally {
      if (!success) setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Import Data
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full uppercase tracking-widest border border-amber-500/20">
              AI Powered
            </span>
          </h1>
          <p className="text-zinc-400 mt-2">Upload your broker statements as CSV, PDF, or Images. Our AI handles the rest.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Dropzone */}
        <div className="md:col-span-2">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300
              ${isDragging 
                ? 'border-amber-500 bg-amber-500/5 scale-[1.02]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
              min-h-[400px] group cursor-pointer overflow-hidden
            `}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".csv,.pdf,image/png,image/jpeg"
              onChange={handleChange}
              disabled={uploading}
            />
            
            {success ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Import Successful!</h3>
                <p className="text-zinc-400 text-center max-w-sm">
                  We successfully extracted {parsedCount} trades from your statement. They are now visible in your dashboard.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors"
                >
                  Import Another File
                </button>
              </div>
            ) : uploading ? (
              <div className="flex flex-col items-center animate-in fade-in duration-300">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">{statusText}</h3>
                <p className="text-zinc-500 text-sm">Please keep this window open</p>
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors group-hover:scale-110 duration-300">
                  <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Drop your statement here</h3>
                <p className="text-zinc-400 text-center max-w-sm mb-8">
                  Supports CSV exports, PDF reports, or screenshot images from ANY broker.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
                  <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-4 h-4" /> CSV</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> PDF</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> JPG/PNG</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature side box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vision AI Extraction</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Don't have a CSV? No problem. Just take a screenshot of your MT4, MT5, or Exness history on your phone and upload it. 
            </p>
            <p className="text-zinc-400 leading-relaxed mt-4 text-sm">
              Our AI reads the image perfectly and digitizes your entries, exits, lot sizes, and PnL automatically.
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <p className="text-xs text-zinc-500 font-mono mb-2">Supported Brokers</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md">MetaTrader 4/5</span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md">Exness</span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md">cTrader</span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md">Any Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
