import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Trading Journal</h1>
          <p className="text-zinc-400">Sign in to sync your trades and view analytics</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              formAction={login} 
              className="w-full py-2 px-4 bg-zinc-100 text-zinc-900 font-medium rounded-lg hover:bg-white transition-colors"
            >
              Sign in
            </button>
            <button 
              formAction={signup} 
              className="w-full py-2 px-4 bg-zinc-800 text-white font-medium rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
