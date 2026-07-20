'use client';

import { useState } from 'react';
import {
  createTransaction,
  updateTransactionStatus,
  checkTransactionStatus,
  type CreateTransactionPayload,
  type CheckStatusPayload,
} from '@/lib/api';

export function useTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const create = async (payload: CreateTransactionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createTransaction(payload);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async (payload: CheckStatusPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await checkTransactionStatus(payload);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to check transaction status';
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
      await updateTransactionStatus(transactionId, status);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, create, checkStatus, updateStatus };
}
