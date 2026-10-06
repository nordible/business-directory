'use client';

import React, { useState } from 'react';
import { BusinessListing } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Star, ShieldCheck, MapPin, Phone, Globe, ChevronDown, ChevronUp, Clock, Settings } from 'lucide-react';

interface BusinessCardProps {
  listing: BusinessListing;
  categoryName: string;
  primaryColor: string;
  onClaimListing?: (listing: BusinessListing) => void;
  onOpenDashboard?: (listing: BusinessListing) => void;
  onOpenReviews?: (listing: BusinessListing) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  listing,
  categoryName,
  primaryColor,
  onClaimListing,
  onOpenDashboard,
  onOpenReviews,
}) => {
  const { locale, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-[#145BFF]/30">
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3F7FF] text-[#0D2B75] border border-[#E8ECF4]">
            {categoryName}
          </span>
          {listing.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('listing.verified')}
            </span>
          )}
        </div>

        {/* Title & Rating */}
        <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] group-hover:text-[#145BFF] transition-colors tracking-tight">
          {listing.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 mb-3">
          <button
            type="button"
            onClick={() => onOpenReviews?.(listing)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="flex items-center text-[#FF9F1A]">
              <Star className="w-4 h-4 fill-[#FF9F1A] text-[#FF9F1A]" />
              <span className="ml-1 text-sm font-bold text-[#0D2B75] group-hover:underline">
                {listing.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-600 group-hover:underline">
              {listing.reviewCount} {t('listing.reviews')}
            </span>
          </button>
          <span className="text-xs text-gray-400">•</span>
          <span
            className={`text-xs font-semibold ${
              listing.isOpenNow ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {listing.isOpenNow ? '• Offen' : '• Geschlossen'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {listing.description[locale]}
        </p>

        {/* Address */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
          <MapPin className="w-4 h-4 text-[#145BFF] shrink-0" />
          <span>
            {listing.address}, {listing.city}
          </span>
        </div>

        {/* Progressive Disclosure (Expanded details) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#E8ECF4] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Clock className="w-4 h-4 text-gray-500 shrink-0" />
              <span>
                <strong className="text-[#0D2B75]">{t('listing.openingHours')}:</strong> {listing.hours}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Phone className="w-4 h-4 text-gray-500 shrink-0" />
              <a
                href={`tel:${listing.phone}`}
                className="hover:underline font-semibold"
                style={{ color: primaryColor }}
              >
                {listing.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Globe className="w-4 h-4 text-gray-500 shrink-0" />
              <a
                href={listing.website}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-semibold"
                style={{ color: primaryColor }}
              >
                {listing.website.replace('https://', '')}
              </a>
            </div>

            {/* Owner Management / Claim Listing action */}
            <div className="pt-2 border-t border-[#E8ECF4] flex items-center justify-between">
              {!listing.isVerified ? (
                <button
                  type="button"
                  onClick={() => onClaimListing?.(listing)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF9F1A]" />
                  <span>{t('listing.claimListing')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenDashboard?.(listing)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D2B75] hover:text-[#145BFF] bg-[#F3F7FF] hover:bg-blue-100/50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-[#E8ECF4]"
                >
                  <Settings className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{t('dashboard.title')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-[#E8ECF4] flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-gray-600 hover:text-[#0D2B75] flex items-center gap-1 py-2 px-1 cursor-pointer transition-colors"
        >
          {isExpanded ? (
            <>
              {t('listing.hideDetails')}
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              {t('listing.details')}
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${listing.phone}`}
            className="p-2.5 rounded-xl bg-[#FAFBFF] hover:bg-[#F3F7FF] text-gray-700 transition-colors border border-[#E8ECF4]"
            title={t('listing.call')}
          >
            <Phone className="w-4 h-4 text-[#0D2B75]" />
          </a>
          <a
            href={listing.website}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 hover:opacity-95"
            style={{ backgroundColor: primaryColor }}
          >
            <span>{t('listing.website')}</span>
          </a>
        </div>
      </div>
    </article>
  );
};
