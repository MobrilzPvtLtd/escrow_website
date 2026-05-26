'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Shield, Lock, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  website: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  password: '',
  businessName: '',
  website: '',
};

const inputCls =
  'w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black placeholder:text-gray-400 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all font-bold';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AuthScreen() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleChange = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  const persistSession = (
    data: any,
    fallbackEmail: string,
    fallbackName: string,
    fallbackRole: string
  ) => {
    if (typeof window === 'undefined') return;

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    localStorage.setItem(
      'userType',
      data.user?.role || fallbackRole
    );

    localStorage.setItem(
      'userEmail',
      data.user?.email || fallbackEmail
    );

    localStorage.setItem(
      'userName',
      data.user?.name || fallbackName
    );
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      // REGISTER
      if (!isLogin) {
        const payload: Record<string, string> = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: accountType,
        };

        if (accountType === 'seller') {
          payload.businessName = formData.businessName;
          payload.website = formData.website;
        }

        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        const token = res.headers.get('authorization');

        persistSession(
          {
            ...data,
            token,
          },
          formData.email,
          formData.fullName,
          accountType
        );

        router.push('/dashboard');
      }

      // LOGIN
      else {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }

        const token = res.headers.get('authorization');

        persistSession(
          {
            ...data,
            token,
          },
          formData.email,
          formData.fullName,
          accountType
        );

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const isSeller = accountType === 'seller';

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* LEFT HERO */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[120px] animate-pulse" />

          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-blue-400" />

            <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">
              Enterprise Grade Security
            </span>
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
              The Swiss standard for secure commercial exchanges.
              Protect your transactions with our advanced escrow
              solutions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <h3 className="text-white font-bold text-lg">
                  Encrypted Transactions
                </h3>

                <p className="text-slate-500 text-sm">
                  Every data point is encrypted with military-grade
                  protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <h3 className="text-white font-bold text-lg">
                  Global Payments
                </h3>

                <p className="text-slate-500 text-sm">
                  Send and receive funds across 150+ countries instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
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

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              SecurePay CH
            </h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Start for free'}
            </h2>

            <p className="text-slate-500 font-medium">
              Please enter your details to continue
            </p>
          </div>

          <div className="space-y-8">
            {/* LOGIN / SIGNUP TOGGLE */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              {(['login', 'signup'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setIsLogin(mode === 'login');
                    setError('');
                  }}
                  className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${
                    (mode === 'login') === isLogin
                      ? 'bg-white text-slate-900 shadow-xl'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {mode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                  {error}
                </div>
              )}

              {/* ACCOUNT TYPE */}
              <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                {(['buyer', 'seller'] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 cursor-pointer rounded-xl transition-all border ${
                      accountType === type
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={type}
                      checked={accountType === type}
                      onChange={() => setAccountType(type)}
                      className="sr-only"
                    />

                    <span
                      className={`text-sm font-black capitalize ${
                        accountType === type
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {type} Account
                    </span>
                  </label>
                ))}
              </div>

              <div className="space-y-5">
                {/* FULL NAME */}
                {!isLogin && (
                  <Field label="Full Name">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleChange('fullName', e.target.value)
                      }
                      placeholder="e.g. John Doe"
                      className={inputCls}
                      required
                    />
                  </Field>
                )}

                {/* SELLER FIELDS */}
                {!isLogin && isSeller && (
                  <>
                    <Field label="Business Name">
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleChange('businessName', e.target.value)
                        }
                        placeholder="e.g. Acme Corp"
                        className={inputCls}
                        required
                      />
                    </Field>

                    <Field label="Website">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleChange('website', e.target.value)
                        }
                        placeholder="https://yourstore.com"
                        className={inputCls}
                        required
                      />
                    </Field>
                  </>
                )}

                {/* EMAIL */}
                <Field label="Email Address">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange('email', e.target.value)
                    }
                    placeholder="name@example.com"
                    className={inputCls}
                    required
                  />
                </Field>

                {/* PASSWORD */}
                <Field label="Password">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleChange('password', e.target.value)
                    }
                    placeholder="••••••••"
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? 'Processing…'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}

                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center">
              {isLogin ? (
                <button
                  type="button"
                  className="text-sm text-slate-400 font-bold hover:text-slate-900 transition-colors"
                >
                  Forgot your password?
                </button>
              ) : (
                <p className="text-sm text-slate-400 font-bold">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-slate-900 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-center w-full px-8 pointer-events-none opacity-40">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
            © 2024 SecurePay CH · Digital Asset Protection · Global
            Escrow
          </p>
        </div>
      </div>
    </div>
  );
}