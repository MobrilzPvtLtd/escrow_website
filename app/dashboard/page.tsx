

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDashboard } from '@/hooks/useDashboard';
import { signOut } from '@/lib/api';

import { TopNav } from '@/components/dashboard/TopNav';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { SellerCard } from '@/components/dashboard/SellerCard';
import { TransactionCard } from '@/components/dashboard/TransactionCard';
import { SellerOrderCard } from '@/components/dashboard/SellerOrderCard';
import NotificationList from '@/components/dashboard/NotificationList';

import { NewPurchaseModal } from '@/components/modals/NewPurchaseModal';
import { TransactionDetailView } from '@/components/transactions/TransactionDetailView';
import { ProfileView } from '@/components/profile/ProfileView';

import type { View, ActiveTab, Transaction, Seller } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const dashboard = useDashboard();

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('sellers');
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setCurrentView('transaction-detail');
  };

  const handleTransactionUpdate = () => {
    dashboard.refresh();
    setCurrentView('dashboard');
  };

  const toggleProfile = () => {
    setCurrentView((view) =>
      view === 'profile' ? 'dashboard' : 'profile'
    );
  };

  const toggleNotification = () => {
    setCurrentView((view) =>
      view === 'notifications' ? 'dashboard' : 'notifications'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        userType={dashboard.userType}
        currentView={currentView}
        onToogleNotification={toggleNotification}
        onToggleProfile={toggleProfile}
        onSignOut={handleSignOut}
        onNewPurchase={() => setShowNewPurchaseModal(true)}
      />

      {currentView === 'dashboard' && (
        <DashboardHero
          userType={dashboard.userType}
          userName={dashboard.userName}
          stats={dashboard.stats}
        />
      )}

      <main className="p-8">
        {/* Profile View */}
        {currentView === 'profile' && (
          <ProfileView
            userType={dashboard.userType}
            userEmail={dashboard.userEmail}
            trustScore={dashboard.stats.trustScore}
            profile={dashboard.profile}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'notifications' && (
          <NotificationList
            notifications={dashboard.notifications}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {/* Transaction Detail View */}
        {currentView === 'transaction-detail' &&
          selectedTransaction && (
            <TransactionDetailView
              transaction={selectedTransaction}
              userType={dashboard.userType}
              onBack={() => setCurrentView('dashboard')}
              onUpdate={handleTransactionUpdate}
            />
          )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            {/* Buyer Tabs */}
            {dashboard.userType === 'buyer' && (
              <div className="flex gap-2 mb-6 max-w-md">
                {(['sellers', 'transactions'] as ActiveTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'sellers'
                      ? 'Verified Sellers'
                      : 'Transactions'}
                  </button>
                ))}
              </div>
            )}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Buyer - Sellers */}
              {dashboard.userType === 'buyer' &&
                activeTab === 'sellers' &&
                dashboard.sellers.map((seller) => (
                  <SellerCard
                    key={seller.id}
                    seller={seller}
                  />
                ))}

              {/* Buyer - Transactions */}
              {dashboard.userType === 'buyer' &&
                activeTab === 'transactions' &&
                dashboard.transactions.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    onClick={handleTransactionClick}
                  />
                ))}

              {/* Seller Orders */}
              {dashboard.userType === 'seller' &&
                dashboard.transactions.map((order) => (
                  <SellerOrderCard
                    key={order.id}
                    order={order}
                    onView={handleTransactionClick}
                  />
                ))}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            SecurePay CH Platform · Trusted Intermediary · Demo Mode
          </p>
        </footer>
      </main>

      {/* New Purchase Modal */}
      {showNewPurchaseModal && (
        <NewPurchaseModal
          sellers={dashboard.sellers}
          onClose={() => setShowNewPurchaseModal(false)}
          onCreated={dashboard.refresh}
        />
      )}
    </div>
  );
}