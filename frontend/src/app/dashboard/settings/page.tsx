"use client";

import { useAuth } from '@/components/AuthProvider';
import { User, ShieldCheck, Mail, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-medium mb-1 border-b border-zinc-800 pb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Profile Information
          </h3>
          
          <div className="space-y-6 mt-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-medium text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-lg">Personal Account</p>
                <p className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-500 text-sm font-bold">Secure Session Active</p>
                <p className="text-emerald-500/80 text-xs mt-1">
                  Your account is secured via Firebase Authentication. All uploaded journal data is encrypted at rest using Supabase RLS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
           <h3 className="text-white font-medium mb-1 border-b border-zinc-800 pb-4 flex items-center gap-2">
            Data Management
          </h3>
          
          <div className="space-y-4 mt-6">
             <p className="text-zinc-400 text-sm leading-relaxed">
               Poinsix now uses 100% automated cloud data ingestion. To add trades to your journal, simply export your CSV statement from your broker or take a screenshot, and upload it via the <span className="text-amber-400 font-medium">Import Data</span> tab.
             </p>

             <div className="p-4 mt-4 bg-zinc-950 rounded-xl border border-zinc-800">
               <p className="text-xs text-zinc-500 font-mono mb-2 uppercase tracking-wider">Storage Usage</p>
               <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '5%' }}></div>
               </div>
               <div className="flex justify-between text-xs text-zinc-400">
                 <span>12 MB used</span>
                 <span>Unlimited</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
