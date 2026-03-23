import Link from 'next/link';
import { ArrowRight, BarChart3, Database, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">P</div>
            <span className="text-xl font-bold tracking-tight">Poinsix</span>
          </div>
          <Link 
            href="/dashboard" 
            className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full font-medium hover:bg-white transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          Professional Trading <br />Journaling Simplified.
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform for serious traders. Track your performance, 
          identify patterns, and optimize your strategy with precision analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20 group"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-left hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Live Analytics</h3>
            <p className="text-zinc-400 leading-relaxed">Real-time stats and equity curves for every strategy you trade.</p>
          </div>
          
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-left hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Broker Sync</h3>
            <p className="text-zinc-400 leading-relaxed">Seamlessly connect Xness and XM to sync all your trades automatically.</p>
          </div>

          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-left hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Professional Grade</h3>
            <p className="text-zinc-400 leading-relaxed">Built for high-performance trading with zero compromise on data security.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 text-zinc-500 text-sm mt-20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 Poinsix Trading Journal. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-200 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-200 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
