export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-medium mb-1">Connected Brokers</h3>
          <p className="text-sm text-zinc-400 mb-6">Manage your API connections.</p>
          
          <div className="space-y-4">
            <div className="p-4 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Exness</p>
                <p className="text-xs text-zinc-500">Not connected</p>
              </div>
              <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-md transition-colors">Connect</button>
            </div>
            
            <div className="p-4 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-white">XM Global</p>
                <p className="text-xs text-emerald-500">Connected</p>
              </div>
              <button className="px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm rounded-md transition-colors">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
