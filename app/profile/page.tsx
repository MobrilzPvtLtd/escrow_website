'use client';

import { ArrowLeft, Edit, User, Wallet, Clock, Lock, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileScreen() {
  const router = useRouter();

  const userProfile = {
    name: 'Utkarsh',
    email: 'jgadjgjd@gmail.com',
    accountType: 'Buyer Account'
  };

  const accountSettings = [
    {
      icon: User,
      label: 'Personal Information',
      href: '/profile/personal-info'
    },
    {
      icon: Wallet,
      label: 'Payment Methods',
      href: '/profile/payment-methods'
    },
    {
      icon: Clock,
      label: 'Transaction History',
      href: '/profile/transaction-history'
    }
  ];

  const securitySettings = [
    {
      icon: Lock,
      label: 'Change Password',
      href: '/profile/change-password'
    },
    {
      icon: Bell,
      label: 'Notification Settings',
      href: '/profile/notifications'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/profile/support'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            
            <button
              onClick={() => handleNavigation('/profile/edit')}
              className="p-2 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Edit className="w-6 h-6 text-indigo-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-16 h-16 text-indigo-600" />
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {userProfile.name}
            </h2>
            <p className="text-gray-500 mb-4">
              {userProfile.email}
            </p>

            {/* Account Type Badge */}
            <div className="bg-indigo-50 px-6 py-2 rounded-full">
              <span className="text-indigo-600 font-medium">
                {userProfile.accountType}
              </span>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Account Settings
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {accountSettings.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    index !== accountSettings.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Security & App Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Security & App
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {securitySettings.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    index !== securitySettings.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-white border-2 border-red-500 text-red-500 font-semibold py-4 rounded-2xl hover:bg-red-50 transition-colors">
          Logout
        </button>
      </main>
    </div>
  );
}