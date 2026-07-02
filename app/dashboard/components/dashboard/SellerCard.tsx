import { CheckCircle, Star } from 'lucide-react';
import type { Seller } from '@/types';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-slate-900" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-slate-600 transition-colors truncate">
            {seller.businessName}
          </h3>
          <a href={`${seller.website ?? seller.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 mb-2 hover:text-blue-600 hover:underline truncate block">{seller.website ?? seller.domain}</a>
        </div>
        {seller.rating != null && (
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg flex-shrink-0">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{seller.rating}</span>
          </div>
        )}
      </div>
      {seller.description && (
        <p className="text-sm text-gray-500 leading-relaxed break-words">{seller.description}</p>
      )}
    </div>
  );
}
