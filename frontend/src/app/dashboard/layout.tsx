import Link from 'next/link'
import { LayoutDashboard, LogOut, Settings, List } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Poinsix</h2>
          <p className="text-xs text-zinc-400 mt-1">Trading Journal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800 text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            Dashboard
          </Link>
          <Link href="/dashboard/trades" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors">
            <List className="w-5 h-5 text-emerald-400" />
            Trades
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5 text-purple-400" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-medium text-white">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Demo User</p>
            </div>
          </div>
          
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
