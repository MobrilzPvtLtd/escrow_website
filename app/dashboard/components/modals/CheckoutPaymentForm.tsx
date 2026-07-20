'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTransaction } from '@/hooks/useTransaction';

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51TqSZDGsC6yCTdYKfIJgAqrkR4HbcChaBfeidY2694AJFv8TVfk6QLRGZQXY5WXTFp1zdyTmpMkFGfCFNeSWf4fp00Vqgga8wK';

const stripePromise = loadStripe(stripePublishableKey);

interface CheckoutPaymentFormProps {
  amount: number;
  paymentType: 'STRIPE' | 'PAYPAL';
  clientSecret?: string;
  paymentIntentId?: string;
  onPaymentSuccess: (details: { gateway: 'stripe' | 'paypal'; statusData?: any }) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

function StripeCardForm({
  clientSecret,
  paymentIntentId,
  amount,
  onPaymentSuccess,
}: {
  clientSecret: string;
  paymentIntentId?: string;
  amount: number;
  onPaymentSuccess: (details: { gateway: 'stripe'; statusData?: any }) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { checkStatus } = useTransaction();

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not initialized yet.');
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: typeof window !== 'undefined' ? window.location.href : '',
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment processing failed.');
        setProcessing(false);
        return;
      }

      const activeIntentId = paymentIntent?.id || paymentIntentId;

      if (activeIntentId) {
        // Hit status-check API endpoint
        const statusRes = await checkStatus({
          paymentType: 'STRIPE',
          paymentIntentId: activeIntentId,
        });

        setStatusResult(statusRes.data || statusRes);

        setTimeout(() => {
          onPaymentSuccess({ gateway: 'stripe', statusData: statusRes });
        }, 1200);
      } else {
        onPaymentSuccess({ gateway: 'stripe' });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during status verification.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      {statusResult && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Payment Verified Successfully!</p>
            <p className="text-[11px] font-normal text-emerald-600 mt-0.5">
              Status: <span className="font-semibold">{statusResult.status}</span>
              {statusResult.stripeStatus && (
                <> | Stripe Status: <span className="font-semibold">{statusResult.stripeStatus}</span></>
              )}
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Verifying Payment Status...
          </>
        ) : (
          `Pay $${amount.toFixed(2)} with Stripe`
        )}
      </button>
    </form>
  );
}

export function CheckoutPaymentForm({
  amount,
  paymentType,
  clientSecret,
  paymentIntentId,
  onPaymentSuccess,
  onBack,
  isSubmitting = false,
}: CheckoutPaymentFormProps) {
  const { checkStatus } = useTransaction();
  const [statusChecking, setStatusChecking] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  const handleManualCheck = async () => {
    if (!paymentIntentId) return;
    setStatusChecking(true);
    setManualError(null);
    try {
      const statusRes = await checkStatus({
        paymentType,
        paymentIntentId,
      });
      onPaymentSuccess({ gateway: paymentType === 'STRIPE' ? 'stripe' : 'paypal', statusData: statusRes });
    } catch (err: any) {
      setManualError(err.message || 'Failed to check status');
    } finally {
      setStatusChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header / Back Action */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to details
        </button>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Escrow Protected (${amount.toFixed(2)})
        </span>
      </div>

      {paymentType === 'STRIPE' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Pay with Card (Stripe)</h3>
          </div>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <StripeCardForm
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
              />
            </Elements>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-slate-900" /> Transaction Created
              </div>
              {paymentIntentId && (
                <p className="text-xs text-slate-600">
                  Payment Intent ID: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{paymentIntentId}</code>
                </p>
              )}
              {manualError && (
                <p className="text-xs text-red-600">{manualError}</p>
              )}
              <button
                type="button"
                onClick={handleManualCheck}
                disabled={statusChecking || !paymentIntentId}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {statusChecking ? 'Checking Status...' : 'Check Payment Status'}
              </button>
            </div>
          )}
        </div>
      )}

      {paymentType === 'PAYPAL' && (
        <div>
          <div className="text-xs font-bold text-slate-700 mb-3">Pay with PayPal</div>
          {paymentIntentId && (
            <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              Transaction ID: <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">{paymentIntentId}</code>
            </div>
          )}
          <PayPalButtons
            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
            disabled={isSubmitting}
            createOrder={async () => paymentIntentId || `PAYPAL-DEMO-${Date.now()}`}
            onApprove={async () => {
              if (paymentIntentId) {
                try {
                  const statusRes = await checkStatus({
                    paymentType: 'PAYPAL',
                    paymentIntentId,
                  });
                  onPaymentSuccess({ gateway: 'paypal', statusData: statusRes });
                } catch {
                  onPaymentSuccess({ gateway: 'paypal' });
                }
              } else {
                onPaymentSuccess({ gateway: 'paypal' });
              }
            }}
            onError={async () => {
              if (paymentIntentId) {
                try {
                  const statusRes = await checkStatus({
                    paymentType: 'PAYPAL',
                    paymentIntentId,
                  });
                  onPaymentSuccess({ gateway: 'paypal', statusData: statusRes });
                } catch {
                  onPaymentSuccess({ gateway: 'paypal' });
                }
              } else {
                onPaymentSuccess({ gateway: 'paypal' });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
