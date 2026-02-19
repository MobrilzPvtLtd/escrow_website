'use client';

import { useState } from 'react';
import { ArrowLeft, Edit, User, Wallet, Clock, Lock, Bell, HelpCircle, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Utkarsh',
    email: 'jgadjgjd@gmail.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    accountType: 'Buyer Account'
  });

  const accountSettings = [
    { icon: User, label: 'Personal Information', href: '/profile/personal-info' },
    { icon: Wallet, label: 'Payment Methods', href: '/profile/payment-methods' },
    { icon: Clock, label: 'Transaction History', href: '/profile/transaction-history' }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-100 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <h1 className="text-xl font-black text-slate-900 tracking-tight">Account Profile</h1>

          <div className="w-[100px] flex justify-end">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Profile Card */}
        <div className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-32 -mt-32 z-0" />

          <div className="flex flex-col items-center relative z-10 text-center">
            {/* Avatar */}
            <div className="w-40 h-40 bg-slate-900 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-slate-900/20 rotate-3">
              <User className="w-20 h-20 text-white -rotate-3" />
            </div>

            {/* User Info */}
            <div className="space-y-4 w-full max-w-md">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-3xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 outline-none text-center focus:ring-8 focus:ring-slate-900/5 transition-all"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full text-lg font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 outline-none text-center focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    {profileData.name}
                  </h2>
                  <p className="text-lg font-bold text-slate-400">
                    {profileData.email}
                  </p>
                </>
              )}

              {/* Account Type Badge */}
              <div className="inline-flex bg-slate-100 px-6 py-2 rounded-full border border-slate-200 mt-4">
                <span className="text-slate-900 font-black text-xs uppercase tracking-widest">
                  {profileData.accountType}
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-8 w-full max-w-sm">
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Info (Editable) */}
        <div className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </span>
            Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all font-bold"
                />
              ) : (
                <div className="px-6 py-5 rounded-3xl bg-slate-50 border border-transparent font-bold text-slate-900 flex items-center gap-4">
                  <Phone className="w-5 h-5 text-slate-400" />
                  {profileData.phone}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all font-bold"
                />
              ) : (
                <div className="px-6 py-5 rounded-3xl bg-slate-50 border border-transparent font-bold text-slate-900 flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  {profileData.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-[250px] -mt-[250px] blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-3">Premium Support</h3>
              <p className="text-slate-400 font-bold max-w-sm">Need help with your profile? Our VIP support team is ready to assist you 24/7.</p>
            </div>
            <button className="px-12 py-5 bg-white text-slate-900 rounded-[20px] font-black text-lg hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
              Contact VIP Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}