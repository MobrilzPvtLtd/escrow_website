


'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  User,
  Edit,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  Globe,
  BadgeCheck,
  Building2,
  Star,
} from 'lucide-react';

import { EditProfileModal } from '@/components/modals/EditProfileModal';

import type {
  UserType,
  ProfileData,
  SellerProfile,
  BuyerProfile,
} from '@/types';

interface ProfileViewProps {
  userType: UserType;
  userEmail: string;
  trustScore: number;
  onBack: () => void;
  onRefresh?: () => void;
  profile: SellerProfile | BuyerProfile | null;
}

export function ProfileView({
  userType,
  userEmail,
  trustScore,
  onBack,
  onRefresh,
  profile,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isSeller =
    userType === 'seller' &&
    profile &&
    profile.profile.sellerProfile;

  const [profileData, setProfileData] = useState<ProfileData>({
    name: profile?.profile?.name || '',
    email: profile?.profile?.email || '',
    phone: '',
    address: '',
  });

  console.log('ProfileView - profile prop:', profile);
  console.log('ProfileView - profileData:', profileData);

  const update = (field: keyof ProfileData, value: string) =>
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));

  const sellerProfile =
    isSeller && profile?.profile?.sellerProfile
      ? profile.profile.sellerProfile
      : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <button
          onClick={() => setShowEditModal(true)}
          className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white border border-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md group"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 z-0" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative">
            {sellerProfile?.logoUrl ? (
              <Image
                src={sellerProfile.logoUrl}
                alt={profileData.name}
                width={130}
                height={130}
                className="w-32 h-32 rounded-[24px] object-cover border border-slate-200 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-[24px] bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-900/20 rotate-3">
                <User className="w-16 h-16 text-white -rotate-3" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="text-3xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-slate-900/5 w-full"
                />
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {profileData.name}
                  </h2>

                  {sellerProfile?.isVerified && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                      <BadgeCheck className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>
              )}

              <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {userType}
              </span>
            </div>

            {/* Seller Business Info */}
            {sellerProfile && (
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-semibold justify-center md:justify-start">
                  <Building2 className="w-4 h-4" />
                  {sellerProfile.businessName}
                </div>

                {sellerProfile.description && (
                  <p className="text-slate-500 text-sm max-w-2xl">
                    {sellerProfile.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {sellerProfile.website && (
                    <a
                      href={sellerProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {sellerProfile.rating} Rating
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8">
              <Stat label="Member ID" value={`${profile?.profile?.id ?? ""}`} />

              <Stat
                label="Trust Score"
                value={`${trustScore}%`}
              />

              <Stat
                label="Role"
                value={profile?.profile?.role ?? ""}
              />

              {sellerProfile && (
                <Stat
                  label="Seller Rating"
                  value={`${sellerProfile.rating}`}
                  suffix="/ 5.0"
                />
              )}
            </div>

            {/* Actions */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
          <SectionTitle
            icon={<Mail className="w-5 h-5" />}
            title="Contact Information"
          />

          <div className="space-y-6">
            <ContactField
              icon={<Mail className="w-4 h-4 text-blue-500" />}
              bg="bg-blue-50"
              label="Email Address"
              value={profileData.email}
              isEditing={isEditing}
              type="email"
              onChange={(v) => update('email', v)}
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
          <SectionTitle
            icon={<Lock className="w-5 h-5" />}
            title="Security & Account"
          />

          <div className="space-y-4">
        
            {/* <SecurityRow
              icon={
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              }
              label="Notifications"
              sub="Manage transaction alerts"
            /> */}

            <button className="cursor-pointer w-full flex items-center p-4 rounded-2xl hover:bg-red-50 transition-colors group border border-transparent hover:border-red-100 mt-4 gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
              </div>

              <div className="text-left">
                <p className="text-sm font-black text-red-600">
                  Delete Account
                </p>

                <p className="text-xs text-red-300">
                  Permanently remove all data
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          userType={userType}
          name={profileData.name}
          businessName={sellerProfile?.businessName}
          website={sellerProfile?.website}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            onRefresh?.();
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="group cursor-default">
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">
        {label}
      </p>

      <p className="text-2xl font-black text-slate-900">
        {value}{' '}
        {suffix && (
          <span className="text-sm font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
        {icon}
      </div>

      <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
        {title}
      </h3>
    </div>
  );
}

interface ContactFieldProps {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  isEditing: boolean;
  type?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}

function ContactField({
  icon,
  bg,
  label,
  value,
  isEditing,
  type = 'text',
  multiline,
  onChange,
}: ContactFieldProps) {
  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-slate-900/5 transition-all';

  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-1 w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>

        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={inputCls}
            />
          )
        ) : (
          <p className="text-slate-900 font-bold leading-relaxed">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function SecurityRow({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
          {icon}
        </div>

        <div className="text-left">
          <p className="text-sm font-black text-slate-900">
            {label}
          </p>

          <p className="text-xs text-slate-400">
            {sub}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
