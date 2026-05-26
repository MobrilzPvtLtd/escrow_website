import type { DashboardStats, Seller, Transaction, Notification, SellerProfile, BuyerProfile } from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://escrow-website-backend.onrender.com/api';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: token,
  };
}


export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
}

export async function fetchStats(token: string): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: authHeaders(token),
  });
  console.log('Stats Response Status:', res.status);
  const data = await res.json();
  console.log('Stats Response Data:', data);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch stats`);
  if (!data.success) throw new Error('Failed to fetch stats');
  return data.stats as DashboardStats;
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await fetch(`${BASE_URL}/dashboard/sellers`);
  console.log('Sellers Response Status:', res.status);
  const data = await res.json();
  console.log('Sellers Response Data:', data);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch sellers`);
  if (!data.success) throw new Error('Failed to fetch sellers');
  return data.sellers as Seller[];
}

export async function fetchTransactions(token: string): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/dashboard/transactions`, {
    headers: authHeaders(token),
  });
  console.log('Transactions Response Status:', res.status);
  const data = await res.json();
  console.log('Transactions Response Data:', data);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch transactions`);
  if (!data.success) throw new Error('Failed to fetch transactions');
  return data.transactions as Transaction[];
}

export async function fetchSellerProfile(token: string): Promise<SellerProfile>{
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: authHeaders(token),
  });
  console.log('Seller Profile Response Status:', res.status);
  const data = await res.json();
  console.log('Seller Profile Response Data:', data);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch seller profile`);
  if(!data.success) throw new Error('Failed to fetch seller profile');
  return data as SellerProfile;
}

export async function fetchBuyerProfile(token: string): Promise<BuyerProfile>{
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: authHeaders(token),
  });
  console.log('Buyer Profile Response Status:', res.status);
  const data = await res.json();
  console.log('Buyer Profile Response Data:', data);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch buyer profile`);
  if(!data.success) throw new Error('Failed to fetch buyer profile');
  return data as BuyerProfile;
}


export async function fetchNotifications(
  token: string
): Promise<Notification[]> {
  const res = await fetch(
    `${BASE_URL}/transactions/notifications`,
    {
      method: 'GET',
      headers: authHeaders(token),
    }
  );

  console.log('Notifications Status:', res.status);

  const data = await res.json();

  console.log('Notifications Response:', data);
  console.log('Token used:', token.substring(0, 20) + '...');

  if (!res.ok) {
    console.error('Notifications Error:', data);
    throw new Error(
      data?.message || `HTTP ${res.status}: Failed to fetch notifications`
    );
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.notifications || [];
}

export interface CreateTransactionPayload {
  title: string;
  description: string;
  amount: number;
  sellerId: number;
}

export async function createTransaction(
  token: string,
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const res = await fetch(`${BASE_URL}/transactions/create`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  const data = await res.json();
  return data.transaction as Transaction;
}

export async function updateTransactionStatus(
  token: string,
  transactionId: string | number,
  status: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/transactions/status/${transactionId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update transaction status');
}
