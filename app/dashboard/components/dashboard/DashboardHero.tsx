import { Star, Wallet } from 'lucide-react';
import type { DashboardStats, UserType } from '@/types';

interface DashboardHeroProps {
  userType: UserType;
  userName: string;
  stats: DashboardStats;
}

export function DashboardHero({ userType, userName, stats }: DashboardHeroProps) {
  return (
    <section className="bg-slate-900 px-8 py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">

          {/* Left: Greeting */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">
                Verified Secure Portal
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
              {userType === 'buyer' ? 'Buyer' : 'Seller'}{' '}
              <span className="text-blue-400">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Welcome back,{' '}
              <span className="text-white font-bold">{userName}</span>. You have{' '}
              <span className="text-white font-bold">{stats.activeDeals} active deals</span>{' '}
              pending your review.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:max-w-2xl">
            <StatCard label="Active Deals" value={String(stats.activeDeals).padStart(2, '0')} />
            <StatCard label="Completed"    value={String(stats.completedDeals).padStart(2, '0')} />

            {userType === 'seller' && (
              <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 p-8 rounded-[32px] hover:bg-blue-500/20 transition-all group lg:col-span-full">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4 group-hover:text-blue-200 transition-colors flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Total Amount Received
                </p>
                <p className="text-4xl font-black text-white leading-none tracking-tight">$0.00</p>
                <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-widest mt-4">
                  Swiss Standard Verified
                </p>
              </div>
            )}

            {userType === 'buyer' && (
              <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 p-8 rounded-[32px] hover:bg-green-500/20 transition-all group">
                <p className="text-[10px] font-black text-green-300 uppercase tracking-widest mb-4 group-hover:text-green-200 transition-colors">
                  Trust Score
                </p>
                <p className="text-4xl font-black text-white">{stats.trustScore}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:bg-white/15 transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">
        {label}
      </p>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  );
}
