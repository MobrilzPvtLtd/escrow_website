'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, Send, ArrowLeft, Mail, Phone, MapPin, Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'profile'
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    sellerEmail: '',
    productName: '',
    productDescription: '',
    amount: ''
  });

  // Load user type from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as 'buyer' | 'seller' | null;
      const storedEmail = localStorage.getItem('userEmail');
      
      if (storedUserType && (storedUserType === 'buyer' || storedUserType === 'seller')) {
        setUserType(storedUserType);
      }
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, []);

  const [stats] = useState({
    totalOrders: 0,
    pendingEarnings: 0.00,
    releasedEarnings: 0.00
  });

  // Profile data
  const profile: {
    buyer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      joinedDate: string;
      totalPurchases: number;
      rating: number;
    };
    seller: {
      name: string;
      email: string;
      phone: string;
      address: string;
      joinedDate: string;
      totalSales: number;
      rating: number;
    };
  } = {
    buyer: {
      name: 'Utkarsh Bhaiya',
      email: userEmail || 'jgadjgjd@gmail.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, City, State 12345',
      joinedDate: 'January 2024',
      totalPurchases: 0,
      rating: 0.0
    },
    seller: {
      name: 'John Seller',
      email: userEmail || 'john.seller@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Street, City, State 12345',
      joinedDate: 'January 2024',
      totalSales: 0,
      rating: 0.0
    }
  };

  const currentProfile = profile[userType];

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
    }
    router.push('/');
  };

  const handleNewPurchaseClick = () => {
    setShowNewPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowNewPurchaseModal(false);
    setNewTransaction({
      sellerEmail: '',
      productName: '',
      productDescription: '',
      amount: ''
    });
  };

  const handleTransactionChange = (field: keyof typeof newTransaction, value: string) => {
    setNewTransaction({
      ...newTransaction,
      [field]: value
    });
  };

  const handleSecurePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New transaction:', newTransaction);
    // Handle payment logic here
    handleCloseModal();
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Profile</h1>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleToggleNotifications}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentProfile.name}</h2>
                <p className="text-gray-500 mb-4">{userType === 'buyer' ? 'Buyer' : 'Seller'} since {currentProfile.joinedDate}</p>
                
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-gray-500">{userType === 'buyer' ? 'Total Purchases' : 'Total Sales'}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {userType === 'buyer' ? currentProfile.totalPurchases : currentProfile.totalSales}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="text-lg font-semibold text-gray-900">{currentProfile.rating.toFixed(1)} ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{currentProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{currentProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{currentProfile.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-900">Payment Methods</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-900">Notification Preferences</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-900">Security Settings</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-red-600"
              >
                <span className="text-sm font-medium">Sign Out</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Dashboard View (Buyer or Seller)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-lg font-bold text-gray-900">SecureEscrow</h1>
                <p className="text-xs text-gray-500">{userType === 'buyer' ? 'Buyer Portal' : 'Seller Portal'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleToggleNotifications}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-indigo-600" />
              </button>
              {userType === 'seller' && (
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Send className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === 'buyer' ? 'Buyer Dashboard' : 'Seller Dashboard'}
          </h2>
          <p className="text-gray-600">
            {userType === 'buyer' ? 'Manage your purchases and transactions' : 'Manage your sales and shipments'}
          </p>
        </div>

        {/* Buyer Dashboard */}
        {userType === 'buyer' && (
          <>
            <div className="flex justify-end mb-6">
              <button 
                onClick={handleNewPurchaseClick}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                New Purchase
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No transactions yet
                </h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Create your first purchase to get started
                </p>
              </div>
            </div>
          </>
        )}

        {/* Seller Dashboard */}
        {userType === 'seller' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Pending Earnings</p>
                <p className="text-4xl font-bold text-gray-900">
                  ${stats.pendingEarnings.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <p className="text-sm text-gray-500 mb-2">Released Earnings</p>
              <p className="text-4xl font-bold text-green-600">
                ${stats.releasedEarnings.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Your orders will appear here
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            SecureEscrow Platform - Trusted Intermediary for Safe Transactions
          </p>
          <p className="text-xs text-gray-500">
            Demo Mode: This is a prototype showcasing the core escrow workflow
          </p>
        </div>
      </main>

      {/* Create New Transaction Modal */}
      {showNewPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Transaction</h2>
                <p className="text-sm text-gray-500 mt-1">Initiate a secure payment for a product purchase</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSecurePayment} className="p-6 space-y-5">
              {/* Seller Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Seller Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={newTransaction.sellerEmail}
                    onChange={(e) => handleTransactionChange('sellerEmail', e.target.value)}
                    placeholder="seller@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newTransaction.productName}
                  onChange={(e) => handleTransactionChange('productName', e.target.value)}
                  placeholder="e.g., iPhone 15 Pro"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Description
                </label>
                <textarea
                  value={newTransaction.productDescription}
                  onChange={(e) => handleTransactionChange('productDescription', e.target.value)}
                  placeholder="Describe the product..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTransaction.amount}
                  onChange={(e) => handleTransactionChange('amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Secure Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Sidebar */}
      {showNotifications && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={handleToggleNotifications}
          />
          
          {/* Sidebar Panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <button 
                  onClick={handleToggleNotifications}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500">Stay updated on your transaction activities</p>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <Bell className="w-24 h-24 text-gray-300" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-medium text-gray-500">No notifications yet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}