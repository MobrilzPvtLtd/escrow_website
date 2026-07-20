

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
import { SellerWalletView } from '@/components/profile/SellerWalletView';

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

  const totalReceived = (dashboard.transactions || []).reduce(
    (sum, tx) => (tx.status === 'RELEASED' ? sum + tx.amount : sum),
    0
  );

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
          totalReceived={totalReceived}
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
            onRefresh={dashboard.refresh}
            onWallet={() => setCurrentView('wallet')}
          />
        )}

        {/* Wallet View */}
        {currentView === 'wallet' && (
          <SellerWalletView
            onBack={() => setCurrentView('profile')}
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
                    className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${activeTab === tab
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
              {dashboard.userType === 'buyer' && activeTab === 'sellers' && (
                dashboard.isLoading ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
                    <p className="text-sm font-medium text-gray-600">Loading verified sellers...</p>
                  </div>
                ) : (dashboard.sellers || []).length > 0 ? (
                  (dashboard.sellers || []).map((seller) => (
                    <SellerCard
                      key={seller.id}
                      seller={seller}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <p className="text-base font-semibold text-gray-800 mb-1">No Verified Sellers Found</p>
                    <p className="text-sm text-gray-500">There are currently no verified sellers available on the platform.</p>
                  </div>
                )
              )}

              {/* Buyer - Transactions */}
              {dashboard.userType === 'buyer' && activeTab === 'transactions' && (
                dashboard.isLoading ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
                    <p className="text-sm font-medium text-gray-600">Loading transactions...</p>
                  </div>
                ) : (dashboard.transactions || []).length > 0 ? (
                  (dashboard.transactions || []).map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      onClick={handleTransactionClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <p className="text-base font-semibold text-gray-800 mb-1">No Transactions Found</p>
                    <p className="text-sm text-gray-500">You haven't initiated any escrow transactions yet.</p>
                  </div>
                )
              )}

              {/* Seller Orders */}
              {dashboard.userType === 'seller' && (
                dashboard.isLoading ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent mb-3" />
                    <p className="text-sm font-medium text-gray-600">Loading incoming orders...</p>
                  </div>
                ) : (dashboard.transactions || []).length > 0 ? (
                  (dashboard.transactions || []).map((order) => (
                    <SellerOrderCard
                      key={order.id}
                      order={order}
                      onView={handleTransactionClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
                    <p className="text-base font-semibold text-gray-800 mb-1">No Orders Found</p>
                    <p className="text-sm text-gray-500">No buyer has created an order for your business yet.</p>
                  </div>
                )
              )}
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
          sellers={dashboard.sellers || []}
          onClose={() => setShowNewPurchaseModal(false)}
          onCreated={() => {
            dashboard.refresh();
            setActiveTab('transactions');
          }}
        />
      )}
    </div>
  );
}