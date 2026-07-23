'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { deleteAccount, signOut } from '@/lib/api';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deleteAccount();
      if (response.success) {
        setSuccess(true);
        // Clear auth tokens
        await signOut();
        // Redirect to landing page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete account';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-red-600 px-6 py-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 z-0" />
          <div className="relative z-10 flex gap-3 items-center">
            <div className="p-2 bg-white/10 rounded-xl text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Delete Account</h2>
              <p className="text-red-100 text-xs mt-0.5">This action is permanent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleDelete} className="p-8 space-y-6">
          {success ? (
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                ✓
              </div>
              <p className="text-sm font-bold text-emerald-800">
                Account Deleted Successfully
              </p>
              <p className="text-xs text-emerald-600">
                Your session is closing. Redirecting to home...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-slate-600">
                <p className="text-sm font-semibold leading-relaxed">
                  Are you sure you want to delete your account? This will permanently remove all of your:
                </p>
                <ul className="text-xs font-bold space-y-1.5 pl-4 list-disc text-slate-500">
                  <li>Profile & business registration information</li>
                  <li>Active transaction details & histories</li>
                  <li>Linked payment profiles and credentials</li>
                </ul>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Type <span className="text-red-600 font-black">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all"
                  required
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirmText !== 'DELETE' || isLoading}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                  {isLoading ? 'Deleting…' : 'Delete Account'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
