import type { DashboardStats, Seller, Transaction, Notification } from '../types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://escrow-website-backend.onrender.com/api';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function fetchStats(token: string): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Failed to fetch stats');
  return data.stats as DashboardStats;
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await fetch(`${BASE_URL}/dashboard/sellers`);
  const data = await res.json();
  if (!data.success) throw new Error('Failed to fetch sellers');
  return data.sellers as Seller[];
}

export async function fetchTransactions(token: string): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/dashboard/transactions`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Failed to fetch transactions');
  return data.transactions as Transaction[];
}

export async function fetchNotifications(token: string): Promise<Notification[]> {
  const res = await fetch(`${BASE_URL}/transactions/notifications`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error('Failed to fetch notifications');
  return data.notifications as Notification[];
}

// ─── Transactions ─────────────────────────────────────────────────────────────

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
