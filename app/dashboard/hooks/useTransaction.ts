'use client';

import { useState } from 'react';
import { createTransaction, updateTransactionStatus, type CreateTransactionPayload } from '../lib/api';

export function useTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const token = () =>
    typeof window !== 'undefined' ? (localStorage.getItem('token') ?? '') : '';

  const create = async (payload: CreateTransactionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createTransaction(token(), payload);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (transactionId: string | number, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateTransactionStatus(token(), transactionId, status);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, create, updateStatus };
}
