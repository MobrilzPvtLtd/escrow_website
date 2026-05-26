import { ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Transaction } from '@/types';

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export function TransactionCard({
  transaction,
  onClick,
}: TransactionCardProps) {
  return (
    <div
      onClick={() => onClick(transaction)}
      className="bg-white text-black rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
          📦
        </div>

        <div>
          <h3 className="font-semibold text-black text-base group-hover:text-slate-600 transition-colors">
            {transaction.title}
          </h3>

          <p className="text-sm text-gray-500 !text-gray-500">
            Order ID: #{transaction.id}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={transaction.status} />

        <span className="text-xs text-gray-400">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-2xl font-bold text-black">
          ${transaction.amount.toFixed(2)}
        </span>

        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}