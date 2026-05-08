'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get('returnTo') || '/admin/super-easy-dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(returnTo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-black mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Passcode</label>
            <input 
              type="password" 
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="Enter admin passcode"
            />
          </div>
          <button className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
