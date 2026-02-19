'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Bell, User, Settings, LogOut,
  Package, Plus, ShieldCheck, Search,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  Edit,
  Wallet,
  Lock,
  X,
  Check,
  Camera,
  Upload,
  Star,
  Truck
} from 'lucide-react';

type UserType = 'buyer' | 'seller';
type View = 'dashboard' | 'profile' | 'transaction-detail';

interface TransactionForm {
  sellerEmail: string;
  productName: string;
  productDescription: string;
  amount: string;
}

interface Transaction {
  id: string;
  productName: string;
  seller: string;
  amount: number;
  status: string;
  statusText: string;
  statusColor: string;
  date: string;
  icon: string;
  timeline: {
    step: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

// Mock transaction data with timeline
const transactions: Transaction[] = [
  {
    id: 'ESC-9901',
    productName: 'iPhone 15 Pro',
    seller: 'amazon.com',
    amount: 999.00,
    status: 'shipped',
    statusText: 'Shipped',
    statusColor: 'text-blue-600 bg-blue-50',
    date: 'Oct 24',
    icon: '📱',
    timeline: [
      { step: 'Payment Secured', completed: true, timestamp: 'Oct 24, 10:30 AM' },
      { step: 'Seller Confirmed', completed: true, timestamp: 'Oct 24, 11:15 AM' },
      { step: 'Shipped', completed: true, timestamp: 'Oct 24, 2:45 PM' },
      { step: 'On the Way', completed: false },
      { step: 'Delivered', completed: false },
    ]
  },
  {
    id: 'ESC-8820',
    productName: 'Vintage Watch',
    seller: 'ebay.com',
    amount: 450.00,
    status: 'delivered',
    statusText: 'Delivered Pending Confirmation',
    statusColor: 'text-orange-600 bg-orange-50',
    date: 'Oct 23',
    icon: '⌚',
    timeline: [
      { step: 'Payment Secured', completed: true, timestamp: 'Oct 23, 9:00 AM' },
      { step: 'Seller Confirmed', completed: true, timestamp: 'Oct 23, 9:30 AM' },
      { step: 'Shipped', completed: true, timestamp: 'Oct 23, 1:00 PM' },
      { step: 'On the Way', completed: true, timestamp: 'Oct 24, 8:00 AM' },
      { step: 'Delivered', completed: true, timestamp: 'Oct 25, 3:20 PM' },
    ]
  },
  {
    id: 'ESC-7712',
    productName: 'MacBook Air',
    seller: 'bestbuy.com',
    amount: 1200.00,
    status: 'secured',
    statusText: 'Payment Secured',
    statusColor: 'text-green-600 bg-green-50',
    date: 'Oct 20',
    icon: '💻',
    timeline: [
      { step: 'Payment Secured', completed: true, timestamp: 'Oct 20, 2:15 PM' },
      { step: 'Seller Confirmed', completed: false },
      { step: 'Shipped', completed: false },
      { step: 'On the Way', completed: false },
      { step: 'Delivered', completed: false },
    ]
  },
  {
    id: 'ESC-6543',
    productName: 'Gaming Chair',
    seller: 'secretlab.co',
    amount: 350.00,
    status: 'refunded',
    statusText: 'Refunded',
    statusColor: 'text-red-600 bg-red-50',
    date: 'Oct 18',
    icon: '🪑',
    timeline: [
      { step: 'Payment Secured', completed: true, timestamp: 'Oct 18, 11:00 AM' },
      { step: 'Refund Requested', completed: true, timestamp: 'Oct 19, 2:30 PM' },
      { step: 'Refund Approved', completed: true, timestamp: 'Oct 19, 4:00 PM' },
    ]
  },
];

// Verified sellers data
const verifiedSellers = [
  {
    name: 'Apple Official Store',
    domain: 'apple.com',
    description: 'Authorized electronics and hardware provider.',
    rating: 4.9,
  },
  {
    name: 'Amazon Warehouse',
    domain: 'amazon.com',
    description: 'Certified refurbished and open-box products.',
    rating: 4.7,
  },
  {
    name: 'Best Buy Elite',
    domain: 'bestbuy.com',
    description: 'Premium partner for high-end home appliances.',
    rating: 4.8,
  },
  {
    name: 'eBay Premium',
    domain: 'ebay.com',
    description: 'Trusted marketplace for new and pre-owned items.',
    rating: 4.6,
  },
  {
    name: 'Newegg Elite',
    domain: 'newegg.com',
    description: 'Leading tech and electronics retailer.',
    rating: 4.7,
  },
  {
    name: 'B&H Photo Video',
    domain: 'bhphotovideo.com',
    description: 'Professional photography and video equipment.',
    rating: 4.9,
  },
];

// Seller orders
const sellerOrders = [
  {
    id: 'ESC-9901',
    buyer: 'John Doe',
    amount: 999.00,
    status: 'secured',
    statusText: 'Payment Secured',
    statusColor: 'text-orange-600 bg-orange-50',
    date: 'Oct 24',
    canShip: true,
  },
  {
    id: 'ESC-8820',
    buyer: 'Sarah Smith',
    amount: 450.00,
    status: 'shipped',
    statusText: 'Shipped',
    statusColor: 'text-blue-600 bg-blue-50',
    date: 'Oct 23',
    canShip: false,
  },
  {
    id: 'ESC-7712',
    buyer: 'Mike Ross',
    amount: 1200.00,
    status: 'completed',
    statusText: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
    date: 'Oct 20',
    canShip: false,
  },
];

// ─────────────────────────────────────────────
// New Purchase Modal
// ─────────────────────────────────────────────
function NewPurchaseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<TransactionForm>({
    sellerEmail: '', productName: '', productDescription: '', amount: '',
  });

  const handleChange = (field: keyof TransactionForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New transaction:', form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Create New Transaction</h2>
              <p className="text-slate-300 text-xs mt-1">Initiate a secure Escrow payment</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Seller Email</label>
            <input
              type="email"
              value={form.sellerEmail}
              onChange={(e) => handleChange('sellerEmail', e.target.value)}
              placeholder="seller@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              placeholder="e.g., iPhone 15 Pro"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Description</label>
            <textarea
              value={form.productDescription}
              onChange={(e) => handleChange('productDescription', e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm mt-2"
          >
            Create Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Transaction Detail View
// ─────────────────────────────────────────────
function TransactionDetailView({
  transaction,
  onBack
}: {
  transaction: Transaction;
  onBack: () => void;
}) {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDelivery = () => {
    setIsConfirmed(true);
    // Here you would typically send the confirmation to your backend
  };

  const isDelivered = transaction.timeline.some(t => t.step === 'Delivered' && t.completed);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Transactions</span>
      </button>

      {/* Transaction Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
              {transaction.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{transaction.productName}</h1>
              <p className="text-sm text-gray-500">Order ID: {transaction.id}</p>
              <p className="text-sm text-slate-600 mt-1">{transaction.seller}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">${transaction.amount.toFixed(2)}</p>
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mt-2 ${transaction.statusColor}`}>
              {transaction.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Timeline</h2>
        <div className="space-y-6">
          {transaction.timeline.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* Icon */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-slate-900' : 'bg-gray-200'
                  }`}>
                  {step.completed ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : index === transaction.timeline.findIndex(t => !t.completed) ? (
                    <Clock className="w-5 h-5 text-gray-500" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </div>
                {index < transaction.timeline.length - 1 && (
                  <div className={`w-0.5 h-12 ${step.completed ? 'bg-slate-900' : 'bg-gray-200'}`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <p className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.step}
                </p>
                {step.timestamp && (
                  <p className="text-sm text-gray-500 mt-1">{step.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Upload Section - Only show if delivered */}
      {isDelivered && !isConfirmed && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Confirm Delivery</h2>
              <p className="text-sm text-gray-500">
                Upload a photo of the received product to confirm delivery and release payment to the seller.
              </p>
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="mb-6">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-900 hover:bg-slate-50/50 transition-all">
                {uploadedPhoto ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedPhoto}
                      alt="Uploaded product"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-green-600 font-medium">Photo uploaded successfully!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Click to upload photo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Confirm Button */}
          {uploadedPhoto && (
            <button
              onClick={handleConfirmDelivery}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Confirm Delivery & Release Payment
            </button>
          )}
        </div>
      )}

      {/* Confirmation Success */}
      {isConfirmed && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Delivery Confirmed!</h3>
              <p className="text-sm text-green-700 mt-1">
                Payment has been released to the seller. Thank you for using SecurePay CH!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Profile View
// ─────────────────────────────────────────────
function ProfileView({ userType, userEmail, onSignOut, onBack }: {
  userType: UserType;
  userEmail: string;
  onSignOut: () => void;
  onBack: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Utkarsh Bhaiya',
    email: userEmail || 'jgadjgjd@gmail.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* Profile Hero */}
      <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 z-0" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-[24px] bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-900/20 rotate-3">
            <User className="w-16 h-16 text-white -rotate-3" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-3xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-slate-900/5 w-full"
                />
              ) : (
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{profileData.name}</h2>
              )}
              <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {userType}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8">
              <div className="group cursor-default">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">Member Since</p>
                <p className="text-2xl font-black text-slate-900">2024</p>
              </div>
              <div className="group cursor-default">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">Performance</p>
                <p className="text-2xl font-black text-slate-900">4.8 <span className="text-sm font-medium text-slate-400">/ 5.0</span></p>
              </div>
              <div className="group cursor-default">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">Trust Score</p>
                <p className="text-2xl font-black text-slate-900">98%</p>
              </div>
              {userType === 'seller' && (
                <div className="group cursor-default">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">Total Received</p>
                  <p className="text-2xl font-black text-slate-900">$12,450</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[160px]">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Contact Info */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Contact Information</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profileData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                ) : (
                  <p className="text-slate-900 font-bold">{profileData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mailing Address</p>
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
                  />
                ) : (
                  <p className="text-slate-900 font-bold leading-relaxed">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Security & Account</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Lock className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-400">Update your account security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900">Notifications</p>
                  <p className="text-xs text-slate-400">Manage transaction alerts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors group border border-transparent hover:border-red-100 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-red-600">Delete Account</p>
                  <p className="text-xs text-red-300">Permanently remove all data</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('buyer');
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeTab, setActiveTab] = useState<'sellers' | 'transactions'>('sellers');
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null;
      const storedEmail = localStorage.getItem('userEmail');
      if (storedUserType === 'buyer' || storedUserType === 'seller') setUserType(storedUserType);
      if (storedEmail) setUserEmail(storedEmail);
    }
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
    }
    router.push('/');
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setCurrentView('transaction-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
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
              <p className="text-xs text-gray-400">{userType === 'buyer' ? 'Buyer Portal' : 'Seller Portal'}</p>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'profile' : 'dashboard')}
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <User className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            {userType === 'buyer' && currentView === 'dashboard' && (
              <button
                onClick={() => setShowNewPurchaseModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Purchase
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Page Header - Premium Hero */}
      {currentView === 'dashboard' && (
        <section className="bg-slate-900 px-8 py-16 relative overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-32" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Verified Secure Portal</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
                  {userType === 'buyer' ? 'Buyer' : 'Seller'} <span className="text-blue-400">Dashboard</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Welcome back, <span className="text-white font-bold">Utkarsh</span>. You have <span className="text-white font-bold">3 active deals</span> pending your review.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:max-w-2xl">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:bg-white/15 transition-all group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">Active Deals</p>
                  <p className="text-4xl font-black text-white">03</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:bg-white/15 transition-all group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">Completed</p>
                  <p className="text-4xl font-black text-white">12</p>
                </div>
                {userType === 'seller' && (
                  <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 p-8 rounded-[32px] hover:bg-blue-500/20 transition-all group lg:col-span-full">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4 group-hover:text-blue-200 transition-colors flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Total Amount Received
                    </p>
                    <p className="text-4xl font-black text-white leading-none tracking-tight">$12,450.00</p>
                    <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-widest mt-4">Swiss Standard Verified</p>
                  </div>
                )}
                {userType === 'buyer' && (
                  <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 p-8 rounded-[32px] hover:bg-green-500/20 transition-all group">
                    <p className="text-[10px] font-black text-green-300 uppercase tracking-widest mb-4 group-hover:text-green-200 transition-colors">Trust Score</p>
                    <p className="text-4xl font-black text-white">99%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="p-8">
        {currentView === 'profile' ? (
          <ProfileView
            userType={userType}
            userEmail={userEmail}
            onSignOut={handleSignOut}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : currentView === 'transaction-detail' && selectedTransaction ? (
          <TransactionDetailView
            transaction={selectedTransaction}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : (
          <>
            {/* Tab Switcher for Buyer */}
            {userType === 'buyer' && (
              <div className="flex gap-2 mb-6 max-w-md">
                <button
                  onClick={() => setActiveTab('sellers')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${activeTab === 'sellers'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  Verified Sellers
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${activeTab === 'transactions'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  Transactions
                </button>
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">

              {/* Buyer - Verified Sellers */}
              {userType === 'buyer' && activeTab === 'sellers' && verifiedSellers.map((seller) => (
                <div
                  key={seller.domain}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-slate-600 transition-colors">
                        {seller.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">{seller.domain}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-semibold text-amber-700">{seller.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{seller.description}</p>
                </div>
              ))}

              {/* Buyer - Transactions */}
              {userType === 'buyer' && activeTab === 'transactions' && transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                        {transaction.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-slate-600 transition-colors">
                          {transaction.productName}
                        </h3>
                        <p className="text-sm text-gray-500">{transaction.seller}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${transaction.statusColor}`}>
                      {transaction.statusText}
                    </span>
                    <span className="text-xs text-gray-400">{transaction.date}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ))}

              {/* Seller - Orders */}
              {userType === 'seller' && sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-600 mb-1">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${order.amount.toFixed(2)}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">Buyer</p>
                    <p className="text-base font-semibold text-gray-900">{order.buyer}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${order.statusColor}`}>
                      {order.statusText}
                    </span>
                    {order.canShip ? (
                      <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                        Mark as Shipped
                      </button>
                    ) : (
                      <button className="text-sm text-gray-400 font-semibold">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
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

      {/* Modal */}
      {showNewPurchaseModal && (
        <NewPurchaseModal onClose={() => setShowNewPurchaseModal(false)} />
      )}
    </div>
  );
}