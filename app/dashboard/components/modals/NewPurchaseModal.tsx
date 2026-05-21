'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTransaction } from '@/hooks/useTransaction';
import type { TransactionForm } from '@/types';

interface NewPurchaseModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const INITIAL_FORM: TransactionForm = {
  sellerEmail: '',
  productName: '',
  productDescription: '',
  amount: '',
};

export function NewPurchaseModal({ onClose, onCreated }: NewPurchaseModalProps) {
  const [form, setForm] = useState<TransactionForm>(INITIAL_FORM);
  const { isLoading, create } = useTransaction();

  const handleChange = (field: keyof TransactionForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await create({
        title: form.productName,
        description: form.productDescription,
        amount: parseFloat(form.amount),
        sellerId: 1, // TODO: resolve seller by email via API
      });
      onCreated();
      onClose();
    } catch {
      // error shown via hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Transaction</h2>
            <p className="text-slate-300 text-xs mt-1">Initiate a secure Escrow payment</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Seller Email">
            <input
              type="email"
              value={form.sellerEmail}
              onChange={(e) => handleChange('sellerEmail', e.target.value)}
              placeholder="seller@example.com"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Product Name">
            <input
              type="text"
              value={form.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              placeholder="e.g., iPhone 15 Pro"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Product Description">
            <textarea
              value={form.productDescription}
              onChange={(e) => handleChange('productDescription', e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              className={`${inputCls} resize-none`}
              required
            />
          </Field>

          <Field label="Amount (USD)">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className={`${inputCls} pl-8`}
                required
              />
            </div>
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating…' : 'Create Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
