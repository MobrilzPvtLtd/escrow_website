'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProfile } from '@/lib/api';
import type { UserType } from '@/types';

interface EditProfileModalProps {
  userType: UserType;
  name: string;
  businessName?: string;
  website?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function EditProfileModal({
  userType,
  name: initialName,
  businessName: initialBusinessName,
  website: initialWebsite,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: initialName,
    businessName: initialBusinessName || '',
    website: initialWebsite || '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: form.name,
        ...(userType === 'seller' && {
          businessName: form.businessName,
          website: form.website,
        }),
      };

      await updateProfile(payload);
      setSuccess(true);
      setTimeout(() => {
        onSaved();
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
            <p className="text-slate-300 text-xs mt-1">Update your profile information</p>
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
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-green-700">
              ✓ Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Name Field */}
          <Field label="Full Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={inputCls}
              required
            />
          </Field>

          {/* Seller-specific Fields */}
          {userType === 'seller' && (
            <>
              <Field label="Business Name">
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  className={inputCls}
                />
              </Field>

              <Field label="Website">
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className={inputCls}
                />
              </Field>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving…' : success ? '✓ Saved' : 'Save Changes'}
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
