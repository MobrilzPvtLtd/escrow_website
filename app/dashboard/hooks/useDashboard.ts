'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  DashboardStats,
  Seller,
  Transaction,
  Notification,
  UserType,
  SellerProfile,
  BuyerProfile,
} from '@/types';

import {
  fetchStats,
  fetchSellers,
  fetchTransactions,
  fetchNotifications,
  fetchSellerProfile,
  fetchBuyerProfile,
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
  profile: SellerProfile | BuyerProfile;
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
    profile: {} as SellerProfile | BuyerProfile,
  });

  const loadDashboardData = useCallback(
    async (token: string, userType: UserType) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const profilePromise =
          userType === 'seller'
            ? fetchSellerProfile()
            : fetchBuyerProfile();

        const [
          stats,
          sellers,
          transactions,
          notifications,
          profile,
        ] = await Promise.allSettled([
          fetchStats(),
          fetchSellers(),
          fetchTransactions(),
          fetchNotifications(),
          profilePromise,
        ]);

        setState((prev) => ({
          ...prev,
          isLoading: false,

          stats:
            stats.status === 'fulfilled'
              ? stats.value
              : prev.stats,

          sellers:
            sellers.status === 'fulfilled'
              ? sellers.value
              : prev.sellers,

          transactions:
            transactions.status === 'fulfilled'
              ? transactions.value
              : prev.transactions,

          notifications:
            notifications.status === 'fulfilled'
              ? notifications.value
              : prev.notifications,

          profile:
            profile.status === 'fulfilled'
              ? profile.value
              : prev.profile,
        }));
        
        // Log any rejected promises for debugging
        if (stats.status === 'rejected') console.error('Stats failed:', stats.reason);
        if (sellers.status === 'rejected') console.error('Sellers failed:', sellers.reason);
        if (transactions.status === 'rejected') console.error('Transactions failed:', transactions.reason);
        if (notifications.status === 'rejected') console.error('Notifications failed:', notifications.reason);
        if (profile.status === 'rejected') console.error('Profile failed:', profile.reason);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Dashboard load error:', errorMsg);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
      }
    },
    []
  );

  const refresh = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    const userType =
      (localStorage.getItem('userType') as UserType | null) ?? 'buyer';

    if (token) {
      loadDashboardData(token, userType);
    }
  }, [loadDashboardData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUserType =
      localStorage.getItem('userType') as UserType | null;

    const storedEmail =
      localStorage.getItem('userEmail') ?? '';

    const storedName =
      localStorage.getItem('userName') ?? 'User';

    const token =
      localStorage.getItem('token');

    const finalUserType: UserType =
      storedUserType === 'buyer' || storedUserType === 'seller'
        ? storedUserType
        : 'buyer';

    setState((prev) => ({
      ...prev,
      userType: finalUserType,
      userEmail: storedEmail,
      userName: storedName,
    }));

    if (token) {
      loadDashboardData(token, finalUserType);
    }
  }, [loadDashboardData]);

  return {
    ...state,
    refresh,
  };
}
