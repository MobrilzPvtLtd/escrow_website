export type UserType = 'buyer' | 'seller';
export type View = 'dashboard' | 'profile' | 'transaction-detail';
export type ActiveTab = 'sellers' | 'transactions';

export interface TransactionForm {
  sellerEmail: string;
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

export type TransactionStatus = 'BLOCKED' | 'SHIPPED' | 'RECEIVED' | 'RELEASED' | 'REFUNDED';

export interface Seller {
  id: number;
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
