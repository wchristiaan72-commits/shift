import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, User } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (token: string, user: any) => void;
  }

export function AuthScreen({ onLogin}: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && !acceptTerms) {
        throw new Error('You must accept the terms and conditions to sign up.');
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email, password } 
        : { email, password, firstName, lastName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLogin(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-neutral-100">
      <div className="w-full max-w-md p-8 text-neutral-900">
        <div className="mb-10 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl">
  <img
    src="/subpilot.png"
    alt="SubPilot Logo"
    className="w-full h-full object-cover"
  />
</div>
          <h1 className="text-3xl font-bold mb-2">SubPilot</h1>
          <p className="text-neutral-500">Manage all your subscriptions in one place</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-500 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neutral-900 transition-colors bg-white border-neutral-200 text-neutral-900"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-500 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neutral-900 transition-colors bg-white border-neutral-200 text-neutral-900"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neutral-900 transition-colors bg-white border-neutral-200 text-neutral-900"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neutral-900 transition-colors bg-white border-neutral-200 text-neutral-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center gap-3 mt-4">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 bg-transparent"
              />
              <label htmlFor="terms" className="text-sm text-neutral-500">
                I accept the <a href="#" className="text-neutral-900 hover:underline">Terms and Conditions</a>
              </label>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-neutral-900 text-white font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-neutral-900 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
