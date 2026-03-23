export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Trades History</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-medium border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Entry / Exit</th>
                <th className="px-6 py-4">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">Mar 23, 2026</td>
                <td className="px-6 py-4 font-medium text-white">EURUSD</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md">Buy</span></td>
                <td className="px-6 py-4">1.0950 → 1.0980</td>
                <td className="px-6 py-4 text-emerald-400 font-medium">+$300.00</td>
              </tr>
              <tr className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">Mar 22, 2026</td>
                <td className="px-6 py-4 font-medium text-white">XAUUSD</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md">Sell</span></td>
                <td className="px-6 py-4">2050.00 → 2055.00</td>
                <td className="px-6 py-4 text-red-400 font-medium">-$500.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
