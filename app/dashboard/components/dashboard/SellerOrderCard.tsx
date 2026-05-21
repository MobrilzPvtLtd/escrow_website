import { StatusBadge } from '../../components/ui/StatusBadge';
import type { Transaction } from '../../types';

interface SellerOrderCardProps {
  order: Transaction;
  onView: (order: Transaction) => void;
}

export function SellerOrderCard({ order, onView }: SellerOrderCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-slate-600 mb-1">#{order.id}</p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-2xl font-bold text-gray-900">${order.amount.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-1">Title</p>
        <p className="text-base font-semibold text-gray-900">{order.title}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <StatusBadge status={order.status} />
        <button
          onClick={() => onView(order)}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
