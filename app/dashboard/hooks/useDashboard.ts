'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats, Seller, Transaction, Notification, UserType } from '@/types';
import {
  fetchStats,
  fetchSellers,
  fetchTransactions,
  fetchNotifications,
} from '../lib/api';

interface DashboardState {
  stats: DashboardStats;
  sellers: Seller[];
  transactions: Transaction[];
  notifications: Notification[];
  userType: UserType;
  userEmail: string;
  userName: string;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_STATS: DashboardStats = {
  activeDeals: 0,
  completedDeals: 0,
  trustScore: 100,
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    stats: DEFAULT_STATS,
    sellers: [],
    transactions: [],
    notifications: [],
    userType: 'buyer',
    userEmail: '',
    userName: 'User',
    isLoading: false,
    error: null,
  });

  const loadDashboardData = useCallback(async (token: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [stats, sellers, transactions, notifications] = await Promise.allSettled([
        fetchStats(token),
        fetchSellers(),
        fetchTransactions(token),
        fetchNotifications(token),
      ]);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        stats:         stats.status         === 'fulfilled' ? stats.value         : prev.stats,
        sellers:       sellers.status       === 'fulfilled' ? sellers.value       : prev.sellers,
        transactions:  transactions.status  === 'fulfilled' ? transactions.value  : prev.transactions,
        notifications: notifications.status === 'fulfilled' ? notifications.value : prev.notifications,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) loadDashboardData(token);
  }, [loadDashboardData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUserType = localStorage.getItem('userType') as UserType | null;
    const storedEmail    = localStorage.getItem('userEmail') ?? '';
    const storedName     = localStorage.getItem('userName')  ?? 'User';
    const token          = localStorage.getItem('token');

    setState((prev) => ({
      ...prev,
      userType:  storedUserType === 'buyer' || storedUserType === 'seller' ? storedUserType : 'buyer',
      userEmail: storedEmail,
      userName:  storedName,
    }));

    if (token) loadDashboardData(token);
  }, [loadDashboardData]);

  return { ...state, refresh };
}
