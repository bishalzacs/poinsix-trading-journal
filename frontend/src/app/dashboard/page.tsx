import { Suspense } from 'react'
import { EquityChart } from '@/components/EquityChart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Sync Trades
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Total PnL</h3>
          <p className="text-3xl font-bold text-emerald-400 mt-2">+$12,450.00</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Win Rate</h3>
          <p className="text-3xl font-bold text-white mt-2">68.5%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium">Total Trades</h3>
          <p className="text-3xl font-bold text-white mt-2">142</p>
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
