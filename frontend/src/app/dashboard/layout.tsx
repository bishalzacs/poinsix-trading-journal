"use client";

import Link from 'next/link'
import { LayoutDashboard, LogOut, Settings, List, Loader2, UploadCloud } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { signOut } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
    { name: 'Trades', href: '/dashboard/trades', icon: List, color: 'text-emerald-400' },
    { name: 'Import Data', href: '/dashboard/import', icon: UploadCloud, color: 'text-amber-400' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'text-purple-400' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Poinsix</h2>
          <p className="text-xs text-zinc-400 mt-1">Trading Journal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50 text-zinc-300 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-400 truncate">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
