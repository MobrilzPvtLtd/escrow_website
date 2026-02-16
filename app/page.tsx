'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [accountType, setAccountType] = useState('buyer');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, accountType, type: isLogin ? 'login' : 'signup' });
    
    // Store the account type in localStorage so dashboard can read it
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', accountType);
      localStorage.setItem('userEmail', formData.email);
    }
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SecureEscrow Platform
          </h1>
          <p className="text-gray-500 text-center">
            Trusted intermediary for secure commercial exchanges
          </p>
        </div>

        {/* Login/Sign Up Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              isLogin
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-md font-medium transition-all ${
              !isLogin
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Account Type
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="buyer"
                  checked={accountType === 'buyer'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 font-medium">Buyer</span>
              </label>
              <label className="flex-1 flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="seller"
                  checked={accountType === 'seller'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 font-medium">Seller</span>
              </label>
            </div>
          </div>

          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          {/* Phone Number (Sign Up only) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Forgot Password (Login only) */}
        {isLogin && (
          <div className="mt-4 text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}