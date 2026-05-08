'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from   = params.get('from') ?? '/admin/super-easy-dashboard';

  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.');
      return;
    }
    router.replace(from);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-black">
            AZLAAN <span className="text-blue-600">ADMIN</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-sm tracking-wide">
            Secure Access — Super Easy Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/[0.03]">
          
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 text-center text-sm font-medium mb-8">Enter your admin password to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password..."
                required
                className={`w-full border-2 rounded-2xl px-5 py-4 outline-none text-gray-900 font-medium pr-14 transition-all text-sm ${
                  error
                    ? 'border-red-300 bg-red-50 focus:border-red-400'
                    : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold px-4 py-3 rounded-2xl text-center">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                'Enter Dashboard →'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-400 font-medium">
            Not an admin?{' '}
            <a href="/" className="text-blue-600 font-bold hover:underline">Go to site →</a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          AZLAAN System © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
