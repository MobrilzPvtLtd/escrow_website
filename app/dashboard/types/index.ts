export type UserType = 'buyer' | 'seller';
export type View = 'dashboard' | 'profile' | 'transaction-detail' | 'notifications';
export type ActiveTab = 'sellers' | 'transactions';

export interface TransactionForm {
  sellerId: string;
  productName: string;
  productDescription: string;
  amount: string;
}

export interface TimelineStep {
  step: string;
  completed: boolean;
  timestamp?: string;
}

export interface Transaction {
  id: string | number;
  title: string;
  productName?: string;
  seller?: { name: string; id: number };
  buyer?: { name: string; id: number };
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  timeline?: TimelineStep[];
}

export interface SellerProfile {
  succes : boolean;
  profile: {
    id: number;
    name: string; 
    email: string; 
    role: string;
    sellerProfile: {
      id: number; 
      userId: number; 
      businessName: string; 
      description: string;
      website: string;
      rating: number;
      logoUrl: string; 
      isVerified: boolean;
    };
  }
}

export interface BuyerProfile {
  succes : boolean;
  profile: {
    id: number;
    name: string; 
    email: string; 
    role: string;
    sellerProfile: null;
  }
}

export type TransactionStatus = 'BLOCKED' | 'SHIPPED' | 'RECEIVED' | 'RELEASED' | 'REFUNDED';

export interface Seller {
  id: number;
  userId?: number;
  businessName: string;
  website?: string;
  domain?: string;
  description?: string;
  rating?: number;
}

export interface DashboardStats {
  activeDeals: number;
  completedDeals: number;
  trustScore: number;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}
