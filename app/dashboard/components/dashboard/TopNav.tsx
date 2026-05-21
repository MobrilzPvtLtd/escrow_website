import Image from 'next/image';
import { Bell, User, LogOut, Plus } from 'lucide-react';
import type { UserType, View } from '../../types';

interface TopNavProps {
  userType: UserType;
  currentView: View;
  onToggleProfile: () => void;
  onSignOut: () => void;
  onNewPurchase: () => void;
}

export function TopNav({
  userType,
  currentView,
  onToggleProfile,
  onSignOut,
  onNewPurchase,
}: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-64 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm p-1">
            <Image
              src="/logo.jpg"
              alt="SecurePay CH Logo"
              width={180}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">SecurePay CH</p>
            <p className="text-xs text-gray-400">
              {userType === 'buyer' ? 'Buyer Portal' : 'Seller Portal'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={onToggleProfile}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          {userType === 'buyer' && currentView === 'dashboard' && (
            <button
              onClick={onNewPurchase}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Purchase
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
