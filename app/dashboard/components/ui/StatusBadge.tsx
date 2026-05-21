import { getStatusDetails } from '../../lib/status';
import type { TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: TransactionStatus | string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { text, color } = getStatusDetails(status);
  return (
    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${color} ${className}`}>
      {text}
    </span>
  );
}
