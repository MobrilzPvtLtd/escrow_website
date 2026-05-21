import type { TransactionStatus } from '@/types';

export interface StatusDetails {
  text: string;
  color: string;
}

export function getStatusDetails(status: TransactionStatus | string): StatusDetails {
  const map: Record<string, StatusDetails> = {
    BLOCKED:  { text: 'Payment Secured',              color: 'text-green-600 bg-green-50'  },
    SHIPPED:  { text: 'Shipped',                      color: 'text-blue-600 bg-blue-50'    },
    RECEIVED: { text: 'Delivered – Pending Confirm',  color: 'text-orange-600 bg-orange-50'},
    RELEASED: { text: 'Completed',                    color: 'text-slate-600 bg-slate-50'  },
    REFUNDED: { text: 'Refunded',                     color: 'text-red-600 bg-red-50'      },
  };
  return map[status] ?? { text: status, color: 'text-gray-600 bg-gray-50' };
}

export const STATUS_STEPS = [
  { label: 'Payment Secured', key: 'BLOCKED'  },
  { label: 'Shipped',         key: 'SHIPPED'  },
  { label: 'Received',        key: 'RECEIVED' },
  { label: 'Released',        key: 'RELEASED' },
] as const;
