import type {
  DashboardStats,
  Seller,
  Transaction,
  Notification,
  SellerProfile,
  BuyerProfile,
} from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://escrow-website-backend.onrender.com/api';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: token,
  };
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;

    if (!refreshToken) {
      console.error('No refresh token found');
      return null;
    }

    const res = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await res.json();

    console.log('Refresh Token Response:', data);

    if (!res.ok || !data.success) {
      console.error('Refresh token failed');

      await signOut();

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }

      return null;
    }

    const newAccessToken = res.headers.get('authorization') || data.token || data.accessToken;
    const newRefreshToken = res.headers.get('refreshtoken') || res.headers.get('refreshToken') || data.refreshToken;

    console.log('New Access Token:', newAccessToken);
    console.log('New Refresh Token:', newRefreshToken);

    if (newAccessToken) {
      localStorage.setItem('token', newAccessToken);
    }

    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return newAccessToken;
  } catch (error) {
    console.error('Refresh token error:', error);

    await signOut();

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }

    return null;
  }
}

async function apiFetch(
  url: string,
  options: RequestInit = {},
  retry = true
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? authHeaders(token) : {}),
    },
  });


  if (res.status === 401 && retry) {
    console.log('Token expired. Refreshing token...');

    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new Error('Session expired. Please login again.');
    }

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...authHeaders(newToken),
      },
    });
  }

  return res;
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await apiFetch(`${BASE_URL}/dashboard/stats`);

  const data = await res.json();

  console.log('Stats Response:', data);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch stats`);
  }

  if (data.success === false) {
    throw new Error('Failed to fetch stats');
  }

  const rawStats = data.stats || data.data?.stats || data.data || {};

  return {
    activeDeals: rawStats.activeDeals ?? rawStats.summary?.BLOCKED ?? rawStats.summary?.total ?? 0,
    completedDeals: rawStats.completedDeals ?? rawStats.summary?.RELEASED ?? 0,
    trustScore: rawStats.trustScore ?? 100,
  } as DashboardStats;
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await apiFetch(`${BASE_URL}/dashboard/sellers`);

  const data = await res.json();

  console.log('Sellers Response:', data);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch sellers`);
  }

  // Handle various backend response formats (e.g. data.sellers, data.data.sellers, data.data, or direct array)
  const rawList =
    data.sellers ||
    data.data?.sellers ||
    (Array.isArray(data.data) ? data.data : null) ||
    (Array.isArray(data) ? data : []);

  if (!Array.isArray(rawList)) {
    console.warn('Sellers payload is not an array:', data);
    return [];
  }

  return rawList.map((item: any) => ({
    id: item.id ?? item._id ?? item.userId ?? 0,
    userId: item.userId ?? item.id,
    businessName:
      item.businessName ||
      item.sellerProfile?.businessName ||
      item.name ||
      item.user?.name ||
      `Seller #${item.id ?? item.userId ?? ''}`,
    website: item.website || item.sellerProfile?.website || item.domain || '',
    domain: item.domain || item.website || item.sellerProfile?.website || '',
    description: item.description || item.sellerProfile?.description || '',
    rating: item.rating ?? item.sellerProfile?.rating ?? null,
  })) as Seller[];
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await apiFetch(`${BASE_URL}/dashboard/transactions`);

  const data = await res.json();

  console.log('Transactions Response:', data);

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}: Failed to fetch transactions`
    );
  }

  if (data.success === false) {
    throw new Error('Failed to fetch transactions');
  }

  const rawList =
    data.data?.transactions ||
    data.transactions ||
    (Array.isArray(data.data) ? data.data : null) ||
    (Array.isArray(data) ? data : []);

  if (!Array.isArray(rawList)) {
    console.warn('Transactions payload is not an array:', data);
    return [];
  }

  return rawList.map((item: any) => ({
    id: item.id,
    title: item.title || item.productName || `Transaction #${item.id}`,
    productName: item.productName || item.title,
    description: item.description || '',
    amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount || '0'),
    status: item.status || 'BLOCKED',
    paymentStatus: item.paymentStatus || 'PENDING',
    buyerId: item.buyerId,
    sellerId: item.sellerId,
    seller: item.seller,
    buyer: item.buyer,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt,
    timeline: item.timeline,
  })) as Transaction[];
}

export async function fetchSellerProfile(): Promise<SellerProfile> {
  const res = await apiFetch(`${BASE_URL}/profile`);

  const data = await res.json();

  console.log('Seller Profile Response:', data);

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}: Failed to fetch seller profile`
    );
  }

  if (!data.success) {
    throw new Error('Failed to fetch seller profile');
  }

  return {
    succes: data.success,
    profile: data.data?.profile || data.profile,
  } as SellerProfile;
}

export async function fetchBuyerProfile(): Promise<BuyerProfile> {
  const res = await apiFetch(`${BASE_URL}/profile`);

  const data = await res.json();

  console.log('Buyer Profile Response:', data);

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status}: Failed to fetch buyer profile`
    );
  }

  if (!data.success) {
    throw new Error('Failed to fetch buyer profile');
  }

  return {
    succes: data.success,
    profile: data.data?.profile || data.profile,
  } as BuyerProfile;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await apiFetch(
    `${BASE_URL}/transactions/notifications`,
    {
      method: 'GET',
    }
  );

  const data = await res.json();

  console.log('Notifications Response:', data);

  if (!res.ok) {
    throw new Error(
      data?.message ||
        `HTTP ${res.status}: Failed to fetch notifications`
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
  paymentType?: 'STRIPE' | 'PAYPAL';
  currency?: string;
}

export interface CreateTransactionResult {
  transaction: Transaction;
  clientSecret?: string;
  paymentIntentId?: string;
  paypalUrl?: string;
  orderId?: string;
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<CreateTransactionResult> {
  const body = {
    title: payload.title,
    description: payload.description,
    amount: payload.amount,
    sellerId: payload.sellerId,
    paymentType: payload.paymentType || 'STRIPE',
    currency: payload.currency || 'usd',
  };

  const res = await apiFetch(
    `${BASE_URL}/transactions/create`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Failed to create transaction');
  }

  const txData = data.data?.transaction || data.transaction || data;
  const clientSecret = data.data?.clientSecret || data.clientSecret;
  const paypalUrl = data.data?.paypalUrl || data.paypalUrl;
  const orderId = data.data?.orderId || data.orderId;
  const paymentIntentId = data.data?.paymentIntentId || data.paymentIntentId || orderId;

  return {
    transaction: txData as Transaction,
    clientSecret,
    paymentIntentId,
    paypalUrl,
    orderId,
  };
}

export interface CheckStatusPayload {
  paymentType: 'STRIPE' | 'PAYPAL';
  paymentIntentId: string;
}

export interface CheckStatusData {
  paymentIntentId?: string;
  orderId?: string;
  dealId?: number;
  status: string;
  stripeStatus?: string;
  amount: number;
  currency?: string;
}

export interface CheckStatusResponse {
  success: boolean;
  message: string;
  data?: CheckStatusData;
}

export async function checkTransactionStatus(
  payload: CheckStatusPayload
): Promise<CheckStatusResponse> {
  const res = await apiFetch(`${BASE_URL}/transactions/status-check`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to check payment status');
  }

  return data as CheckStatusResponse;
}

export async function updateTransactionStatus(
  transactionId: string | number,
  status: string
): Promise<void> {
  const res = await apiFetch(
    `${BASE_URL}/transactions/status/${transactionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to update transaction status');
  }
}

export interface UpdateProfilePayload {
  name: string;
  businessName?: string;
  website?: string;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<{ success: boolean; message: string }> {
  const res = await apiFetch(
    `${BASE_URL}/update-profile`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }

  const data = await res.json();
  return data;
}

import type { SellerWallet, WithdrawRequest } from '@/types';

export async function fetchSellerWallet(): Promise<{ wallet: SellerWallet, withdrawRequests: WithdrawRequest[] }> {
  // Fetch wallet details
  const walletRes = await apiFetch(`${BASE_URL}/transactions/wallet`);
  if (!walletRes.ok) {
    throw new Error(`HTTP ${walletRes.status}: Failed to fetch wallet`);
  }
  const walletData = await walletRes.json();

  const success = walletData.success;
  const wallet = walletData.wallet || walletData.data?.wallet;

  if (!success || !wallet) {
    throw new Error('Failed to fetch wallet data');
  }

  // Withdraw requests can be in the same response
  let withdrawRequests: WithdrawRequest[] = walletData.withdrawRequests || walletData.data?.withdrawRequests || [];

  // Fallback to fetch wallet history (for withdraw requests) if not returned in primary response
  if (!walletData.withdrawRequests && !walletData.data?.withdrawRequests) {
    try {
      const historyRes = await apiFetch(`${BASE_URL}/transactions/wallet-history`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.success) {
          withdrawRequests = historyData.withdrawRequests || historyData.data?.withdrawRequests || [];
        }
      }
    } catch (err) {
      console.warn('Failed to fetch wallet history:', err);
    }
  }

  return {
    wallet,
    withdrawRequests,
  };
}

export async function requestWithdrawal(
  amount: number,
  note?: string
): Promise<{ success: boolean; message: string }> {
  const res = await apiFetch(`${BASE_URL}/transactions/wallet/withdraw`, {
    method: 'POST',
    body: JSON.stringify({ amount, note }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to submit withdrawal request');
  }

  return data;
}
