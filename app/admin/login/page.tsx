'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, EyeOff, Lock, User, Terminal } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devLoading, setDevLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent, devCredentials?: { u: string; p: string }) => {
    if (e) e.preventDefault()
    setError('')
    
    const isDev = !!devCredentials
    if (isDev) setDevLoading(true)
    else setLoading(true)

    const u = devCredentials ? devCredentials.u : username
    const p = devCredentials ? devCredentials.p : password

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(redirect)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setDevLoading(false)
    }
  }

  const handleDirectLogin = () => {
    handleSubmit(undefined, { u: 'admin', p: 'admin123' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-bg px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl shadow-xl mb-6">
              <span className="font-serif text-3xl font-bold">A</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Azlaan Admin</h1>
            <p className="text-text-muted text-sm mt-2 font-medium">Elevate your control center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-section-bg border border-transparent rounded-2xl focus:bg-white focus:border-secondary/30 focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-medium"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-secondary uppercase tracking-wider hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-section-bg border border-transparent rounded-2xl focus:bg-white focus:border-secondary/30 focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || devLoading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In to Portal'}
            </button>
          </form>

          {/* Dev Quick Login */}
          <div className="mt-8 pt-8 border-t border-border-light/50">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-light/50"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-text-muted font-black tracking-widest text-[9px]">Development Only</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleDirectLogin}
              disabled={loading || devLoading}
              className="mt-4 w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {devLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <Terminal size={14} className="group-hover:animate-pulse" />
                  Direct Login (No Credentials)
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-section-bg"><Loader2 className="animate-spin text-secondary" size={32} /></div>}>
      <LoginForm />
    </Suspense>
  )
}
