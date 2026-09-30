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
    <article className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {categoryName}
          </span>
          {listing.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('listing.verified')}
            </span>
          )}
        </div>

        {/* Title & Rating */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {listing.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 mb-3">
          <button
            type="button"
            onClick={() => onOpenReviews?.(listing)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="ml-1 text-sm font-bold text-gray-900 group-hover:underline">
                {listing.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-700 group-hover:underline">
              {listing.reviewCount} {t('listing.reviews')}
            </span>
          </button>
          <span className="text-xs text-gray-400">•</span>
          <span
            className={`text-xs font-medium ${
              listing.isOpenNow ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {listing.isOpenNow ? '• Offen' : '• Geschlossen'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {listing.description[locale]}
        </p>

        {/* Address */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-700">
          <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
          <span>
            {listing.address}, {listing.city}
          </span>
        </div>

        {/* Progressive Disclosure (Expanded details) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Clock className="w-4 h-4 text-gray-600 shrink-0" />
              <span>
                <strong className="text-gray-900">{t('listing.openingHours')}:</strong> {listing.hours}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Phone className="w-4 h-4 text-gray-600 shrink-0" />
              <a
                href={`tel:${listing.phone}`}
                className="hover:underline font-medium"
                style={{ color: primaryColor }}
              >
                {listing.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Globe className="w-4 h-4 text-gray-600 shrink-0" />
              <a
                href={listing.website}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-medium"
                style={{ color: primaryColor }}
              >
                {listing.website.replace('https://', '')}
              </a>
            </div>

            {/* Owner Management / Claim Listing action */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              {!listing.isVerified ? (
                <button
                  type="button"
                  onClick={() => onClaimListing?.(listing)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('listing.claimListing')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenDashboard?.(listing)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{t('dashboard.title')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 py-2 px-1 cursor-pointer"
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
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200"
            title={t('listing.call')}
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={listing.website}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: primaryColor }}
          >
            <span>{t('listing.website')}</span>
          </a>
        </div>
      </div>
    </article>
  );
};
