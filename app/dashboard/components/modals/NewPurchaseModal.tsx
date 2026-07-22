'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, CreditCard } from 'lucide-react';
import { useTransaction } from '@/hooks/useTransaction';
import type { TransactionForm, Seller } from '@/types';
import { CheckoutPaymentForm } from './CheckoutPaymentForm';

interface NewPurchaseModalProps {
  sellers: Seller[];
  onClose: () => void;
  onCreated: () => void;
}

const INITIAL_FORM: TransactionForm = {
  sellerId: '',
  productName: '',
  productDescription: '',
  amount: '',
};

export function NewPurchaseModal({ sellers, onClose, onCreated }: NewPurchaseModalProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [form, setForm] = useState<TransactionForm>(INITIAL_FORM);
  const [paymentType, setPaymentType] = useState<'STRIPE' | 'PAYPAL'>('STRIPE');
  const [formError, setFormError] = useState<string | null>(null);
  
  const [createdData, setCreatedData] = useState<{
    clientSecret?: string;
    paymentIntentId?: string;
    paypalUrl?: string;
  } | null>(null);

  const { isLoading, create } = useTransaction();

  const handleChange = (field: keyof TransactionForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (!form.sellerId && sellers.length > 0) {
      const defaultUserId = sellers[0].userId ?? sellers[0].id;
      setForm((prev) => ({ ...prev, sellerId: defaultUserId.toString() }));
    }
  }, [sellers, form.sellerId]);

  const handleProceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!form.sellerId) {
      setFormError('Please select a seller.');
      return;
    }

    const numericAmount = parseFloat(form.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid payment amount.');
      return;
    }

    try {
      const result = await create({
        title: form.productName,
        description: form.productDescription,
        amount: numericAmount,
        sellerId: Number(form.sellerId),
        paymentType,
        currency: 'usd',
      });

      setCreatedData({
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        paypalUrl: result.paypalUrl,
      });

      setStep('payment');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create transaction.');
    }
  };

  const handlePaymentSuccess = () => {
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Transaction</h2>
            <p className="text-slate-300 text-xs mt-1">
              {step === 'details' ? 'Step 1: Enter transaction details & choose gateway' : 'Step 2: Complete payment checkout'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
              {formError}
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <Field label="Seller">
                <select
                  value={form.sellerId}
                  onChange={(e) => handleChange('sellerId', e.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="" disabled>
                    {sellers.length > 0 ? 'Select a seller' : 'No sellers available'}
                  </option>
                  {sellers.map((seller) => {
                    const value = (seller.userId ?? seller.id).toString();
                    const name = seller.businessName || (seller as any).name || `Seller #${seller.id}`;
                    return (
                      <option key={seller.id} value={value}>
                        {name}
                      </option>
                    );
                  })}
                </select>
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
                  placeholder="Describe the product and terms..."
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
                    min="0.01"
                    value={form.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    className={`${inputCls} pl-8`}
                    required
                  />
                </div>
              </Field>

              <Field label="Payment Method">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('STRIPE')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-xs transition-all cursor-pointer ${
                      paymentType === 'STRIPE'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Stripe Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('PAYPAL')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-xs transition-all cursor-pointer ${
                      paymentType === 'PAYPAL'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-bold text-amber-500">Pay</span>
                    <span className="font-bold text-sky-400">Pal</span>
                  </button>
                </div>
              </Field>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm mt-3 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Creating Transaction...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <CheckoutPaymentForm
              amount={parseFloat(form.amount)}
              paymentType={paymentType}
              clientSecret={createdData?.clientSecret}
              paymentIntentId={createdData?.paymentIntentId}
              paypalUrl={createdData?.paypalUrl}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setStep('details')}
              isSubmitting={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent';

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
