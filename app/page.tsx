'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Shield, Lock, CreditCard, ChevronRight } from 'lucide-react';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState('buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        // --- REGISTER API CALL ---
        const payload = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: accountType
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Auto-switch to login mode or directly set user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('userType', data.data?.role || accountType);
          localStorage.setItem('userEmail', data.data?.email || formData.email);
          localStorage.setItem('userName', data.data?.name || formData.fullName);
        }
        
        alert('Registration Successful! Redirecting to Dashboard...');
        router.push('/dashboard');
        
      } else {
        // --- LOGIN LOGIC ---
        // (Currently backend has no login API based on your recent changes, using mock for now)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userType', accountType);
          localStorage.setItem('userEmail', formData.email || 'user@example.com');
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Enterprise Grade Security</span>
          </div>

          <div className="mb-12">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 overflow-hidden shadow-2xl border border-white/20">
              <Image
                src="/logo.jpg"
                alt="SecurePay CH Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tight mb-6 leading-tight">
              SecurePay <span className="text-blue-400">CH</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              The Swiss standard for secure commercial exchanges. Protect your transactions with our advanced escrow solutions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Encrypted Transactions</h3>
                <p className="text-slate-500 text-sm">Every data point is encrypted with military-grade protocols.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Global Payments</h3>
                <p className="text-slate-500 text-sm">Send and receive funds across 150+ countries instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="/logo.jpg"
                alt="SecurePay CH Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SecurePay CH</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Start for free'}
            </h2>
            <p className="text-slate-500 font-medium">Please enter your details to continue</p>
          </div>

          {/* Form Card */}
          <div className="space-y-8">
            {/* Toggle */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${isLogin ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${!isLogin ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                  {error}
                </div>
              )}
              {/* Account Type Selection */}
              <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 cursor-pointer rounded-xl transition-all border ${accountType === 'buyer' ? 'bg-white border-slate-200 shadow-sm' : 'border-transparent'}`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="buyer"
                    checked={accountType === 'buyer'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-black ${accountType === 'buyer' ? 'text-slate-900' : 'text-slate-400'}`}>Buyer Account</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 cursor-pointer rounded-xl transition-all border ${accountType === 'seller' ? 'bg-white border-slate-200 shadow-sm' : 'border-transparent'}`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="seller"
                    checked={accountType === 'seller'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-black ${accountType === 'seller' ? 'text-slate-900' : 'text-slate-400'}`}>Seller Account</span>
                </label>
              </div>

              <div className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2 group">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center">
              {isLogin ? (
                <button className="text-sm text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  Forgot your password?
                </button>
              ) : (
                <p className="text-sm text-slate-400 font-bold">
                  By signing up, you agree to our <span className="text-slate-900 hover:underline cursor-pointer">Terms of Service</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center w-full px-8 pointer-events-none opacity-40">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
            © 2024 SecurePay CH · Digital Asset Protection · Global Escrow
          </p>
        </div>
      </div>
    </div>
  );
}