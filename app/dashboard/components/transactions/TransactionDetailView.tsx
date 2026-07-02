'use client';

import { ArrowLeft, Check, Clock, Truck, CheckCircle, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { STATUS_STEPS } from '@/lib/status';
import { useTransaction } from '@/hooks/useTransaction';
import type { Transaction, UserType } from '@/types';

interface TransactionDetailViewProps {
  transaction: Transaction;
  userType: UserType;
  onBack: () => void;
  onUpdate: () => void;
}

export function TransactionDetailView({
  transaction,
  userType,
  onBack,
  onUpdate,
}: TransactionDetailViewProps) {
  const { isLoading, updateStatus } = useTransaction();

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === transaction.status);

  const handleUpdate = async (newStatus: string) => {
    try {
      await updateStatus(transaction.id, newStatus);
      onUpdate();
    } catch {

    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl text-white">
              📦
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{transaction.title}</h1>
              <p className="text-sm text-gray-500">Order ID: #{transaction.id}</p>
              <p className="text-sm text-slate-600 mt-1">
                {userType === 'buyer'
                  ? `Seller: ${transaction.seller?.name ?? '—'}`
                  : `Buyer: ${transaction.buyer?.name ?? '—'}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">${transaction.amount.toFixed(2)}</p>
            <StatusBadge status={transaction.status} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Progress</h2>
        <div className="space-y-6">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-slate-900' : 'bg-gray-200'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCompleted ? 'bg-slate-900' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-blue-600 font-bold mt-1">CURRENT STATUS</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">
          Available Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          {userType === 'seller' && transaction.status === 'BLOCKED' && (
            <ActionButton
              onClick={() => handleUpdate('SHIPPED')}
              disabled={isLoading}
              icon={<Truck className="w-5 h-5" />}
              label="Mark as Shipped"
            />
          )}
          {userType === 'buyer' && transaction.status === 'SHIPPED' && (
            <ActionButton
              onClick={() => handleUpdate('RECEIVED')}
              disabled={isLoading}
              icon={<CheckCircle className="w-5 h-5" />}
              label="Recieved Product"
            />
          )}
          {userType === 'buyer' && transaction.status === 'RECEIVED' && (
            <ActionButton
              onClick={() => handleUpdate('RELEASED')}
              disabled={isLoading}
              icon={<ShieldCheck className="w-5 h-5" />}
              label="Release Payment"
              variant="green"
            />
          )}
          {transaction.status === 'RELEASED' && (
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <CheckCircle className="w-6 h-6" /> Deal Successfully Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'green';
}

function ActionButton({ onClick, disabled, icon, label, variant = 'default' }: ActionButtonProps) {
  const base =
    'px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50';
  const colors =
    variant === 'green'
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-slate-900 text-white hover:bg-slate-800';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${colors} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      {icon} {label}
    </button>
  );
}
