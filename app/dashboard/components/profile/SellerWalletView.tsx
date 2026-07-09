'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowDownToLine,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  Landmark
} from 'lucide-react';

import { fetchSellerWallet, requestWithdrawal } from '@/lib/api';
import type { SellerWallet, WithdrawRequest, WithdrawStatus } from '@/types';

interface SellerWalletViewProps {
  onBack: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: WithdrawStatus }) {
  const map: Record<WithdrawStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING: {
      label: 'Pending',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    APPROVED: {
      label: 'Approved',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REJECTED: {
      label: 'Rejected',
      cls: 'bg-red-50 text-red-600 border-red-200',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const { label, cls, icon } = map[status] ?? map['PENDING'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

export function SellerWalletView({ onBack }: SellerWalletViewProps) {
  const [wallet, setWallet] = useState<SellerWallet | null>(null);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Section collapse state
  const [showAllWd, setShowAllWd] = useState(false);

  const loadWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSellerWallet();
      setWallet(data.wallet);
      setWithdrawRequests(data.withdrawRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setSubmitError('Please enter a valid amount.');
      return;
    }
    if (wallet && amt > wallet.remainingBalance) {
      setSubmitError('Amount exceeds your available wallet balance.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await requestWithdrawal(amt, withdrawNote);
      setSubmitSuccess(true);
      setWithdrawAmount('');
      setWithdrawNote('');
      await loadWallet();
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowWithdrawModal(false);
      }, 2000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedWd = showAllWd ? withdrawRequests : withdrawRequests.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <button
          onClick={loadWallet}
          disabled={isLoading}
          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm group disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !wallet && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-lg animate-pulse">
                <div className="h-3 w-24 bg-slate-200 rounded-full mb-4" />
                <div className="h-8 w-32 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {wallet && (
        <>
          {/* ─── Summary Cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Generated */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-[28px] p-8 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Total Generated</p>
                <p className="text-3xl font-black tracking-tight">{formatCurrency(wallet.totalCredited)}</p>
                <p className="text-slate-400 text-xs font-semibold mt-2">All time earnings</p>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[28px] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Wallet Balance</p>
                <p className="text-3xl font-black tracking-tight">{formatCurrency(wallet.remainingBalance)}</p>
                <p className="text-emerald-200 text-xs font-semibold mt-2">Available to withdraw</p>
              </div>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-[28px] p-8 text-white shadow-2xl shadow-violet-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-2">Total Withdrawn</p>
                <p className="text-3xl font-black tracking-tight">{formatCurrency(wallet.totalWithdrawn)}</p>
                <p className="text-purple-200 text-xs font-semibold mt-2">Paid out so far</p>
              </div>
            </div>
          </div>

          {/* ─── Request Withdrawal CTA ─── */}
          <div className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Request a Withdrawal</h3>
              <p className="text-slate-500 font-semibold text-sm">
                Available balance:{' '}
                <span className="text-emerald-600 font-black">{formatCurrency(wallet.remainingBalance)}</span>
              </p>
            </div>
            <button
              onClick={() => { setShowWithdrawModal(true); setSubmitError(null); setSubmitSuccess(false); }}
              disabled={wallet.remainingBalance <= 0}
              className="cursor-pointer flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <ArrowDownToLine className="w-5 h-5" />
              Withdraw Funds
            </button>
          </div>

          {/* ─── Withdrawal History ─── */}
          <div className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-xl shadow-slate-200/30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Withdrawal History</h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {withdrawRequests.length} requests
              </span>
            </div>

            {withdrawRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <ArrowDownToLine className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">No withdrawal requests yet</p>
                <p className="text-slate-300 text-sm mt-1">Your withdrawal requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedWd.map((wd: WithdrawRequest) => (
                  <WdRow key={wd.id} wd={wd} />
                ))}

                {withdrawRequests.length > 5 && (
                  <button
                    onClick={() => setShowAllWd(!showAllWd)}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all border border-dashed border-slate-200 hover:border-slate-300"
                  >
                    {showAllWd ? (
                      <><ChevronUp className="w-4 h-4" /> Show Less</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Show All ({withdrawRequests.length})</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Withdraw Modal ─── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowWithdrawModal(false)}
          />

          <div className="relative bg-white rounded-[32px] p-10 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <ArrowDownToLine className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Withdraw Funds</h3>
                <p className="text-slate-400 font-semibold text-sm">
                  Available: {wallet ? formatCurrency(wallet.remainingBalance) : '—'}
                </p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <p className="text-xl font-black text-slate-900 mb-1">Request Submitted!</p>
                <p className="text-slate-400 font-semibold text-sm">We will process your withdrawal soon.</p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                      <input
                        id="withdraw-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => { setWithdrawAmount(e.target.value); setSubmitError(null); }}
                        placeholder="0.00"
                        className="w-full pl-10 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black text-xl outline-none focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 transition-all"
                      />
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  {wallet && wallet.remainingBalance > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {[25, 50, 100].map((pct) => {
                        const val = parseFloat(((wallet.remainingBalance * pct) / 100).toFixed(2));
                        return (
                          <button
                            key={pct}
                            onClick={() => setWithdrawAmount(String(val))}
                            className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
                          >
                            {pct}% ({formatCurrency(val)})
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setWithdrawAmount(String(wallet.remainingBalance))}
                        className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
                      >
                        Max
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Note (Optional)
                    </label>
                    <textarea
                      value={withdrawNote}
                      onChange={(e) => setWithdrawNote(e.target.value)}
                      placeholder="E.g. Please transfer to my account..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold text-sm outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all resize-none h-24"
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleWithdraw}
                    disabled={isSubmitting || !withdrawAmount}
                    className="cursor-pointer flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Submit Request</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="cursor-pointer flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────

function WdRow({ wd }: { wd: WithdrawRequest }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
          <ArrowDownToLine className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">Withdrawal Request</p>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{formatDate(wd.createdAt)}</p>
          {(wd.bankName || wd.accountNumber) && (
             <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-100 w-max shadow-sm">
               <Landmark className="w-3.5 h-3.5 text-slate-400" />
               {wd.bankName} ••••{wd.accountNumber?.slice(-4) || ''}
             </div>
          )}
          {wd.note && (
            <p className="text-xs text-slate-500 mt-2 italic border-l-2 border-slate-200 pl-2">`{wd.note}`</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 self-start">
        <p className="text-base font-black text-slate-900">{formatCurrency(wd.amount)}</p>
        <StatusBadge status={wd.status} />
      </div>
    </div>
  );
}
