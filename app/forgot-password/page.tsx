'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Lock, CreditCard, Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://escrow-website-backend.onrender.com/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            setResetSent(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success Screen
    if (resetSent) {
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

                {/* RIGHT SIDE - SUCCESS */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden flex flex-col items-center mb-10">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden shadow-lg border border-slate-100">
                                <Image src="/logo.jpg" alt="SecurePay CH Logo" width={64} height={64} className="object-contain" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SecurePay CH</h2>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-3">Check Your Email</h2>
                                <p className="text-slate-600 mb-6">
                                    We've sent a password reset link to <strong className="text-slate-900">{email}</strong>
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                                    <p className="text-sm text-blue-800">
                                        📧 Didn't receive the email? Check your spam folder or try again in a few minutes.
                                    </p>
                                </div>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all w-full justify-center"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 text-center w-full px-8 pointer-events-none opacity-40">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                            © 2024 SecurePay CH · Digital Asset Protection · Global Escrow
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Main Form
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

            {/* RIGHT SIDE - FORGOT PASSWORD FORM */}
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
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">SecurePay CH</h2>
                    </div>

                    {/* Back to Login Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Forgot Password?</h1>
                            <p className="text-slate-500">
                                No worries! Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-700 font-medium text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-black placeholder:text-gray-400 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all font-bold"
                                    placeholder="name@example.com"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                            <p className="text-sm text-slate-500">
                                Remember your password?{' '}
                                <Link href="/" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-xs text-slate-400 mt-6">
                        We'll send a password reset link to your registered email address.
                    </p>
                </div>

                <div className="absolute bottom-8 text-center w-full px-8 pointer-events-none opacity-40">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                        © 2024 SecurePay CH · Digital Asset Protection · Global Escrow
                    </p>
                </div>
            </div>
        </div>
    );
}