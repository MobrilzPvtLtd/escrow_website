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

/**
 * Refresh Access Token
 */
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
        window.location.href = '/login';
      }

      return null;
    }

    /**
     * Get new tokens from response headers
     */
    const newAccessToken = res.headers.get('authorization');
    const newRefreshToken = res.headers.get('refreshtoken');

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
      window.location.href = '/login';
    }

    return null;
  }
}

/**
 * Common API Fetch Wrapper
 */
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

  /**
   * If token expired
   */
  if (res.status === 401 && retry) {
    console.log('Token expired. Refreshing token...');

    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new Error('Session expired. Please login again.');
    }

    /**
     * Retry original request with new token
     */
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

  if (!data.success) {
    throw new Error('Failed to fetch stats');
  }

  return data.stats as DashboardStats;
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await apiFetch(`${BASE_URL}/dashboard/sellers`);

  const data = await res.json();

  console.log('Sellers Response:', data);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch sellers`);
  }

  if (!data.success) {
    throw new Error('Failed to fetch sellers');
  }

  return data.sellers as Seller[];
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

  if (!data.success) {
    throw new Error('Failed to fetch transactions');
  }

  return data.transactions as Transaction[];
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

  return data as SellerProfile;
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

  return data as BuyerProfile;
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
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<Transaction> {
  const res = await apiFetch(
    `${BASE_URL}/transactions/create`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to create transaction');
  }

  const data = await res.json();

  return data.transaction as Transaction;
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
