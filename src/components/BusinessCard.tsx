'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BusinessListing } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { getBusinessPermalink } from '@/lib/permalinks';
import { isBusinessOpenNow } from '@/lib/openingHours';
import { ShieldCheck, MapPin, Globe, ArrowRight } from 'lucide-react';

interface BusinessCardProps {
  listing: BusinessListing;
  categoryName: string;
  primaryColor: string;
  onClaimListing?: (listing: BusinessListing) => void;
  onOpenDashboard?: (listing: BusinessListing) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  listing,
  categoryName,
  primaryColor,
}) => {
  const { locale, t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const openStatus = isBusinessOpenNow(listing, locale);
  const permalink = getBusinessPermalink(listing, locale);
  const locationString = [listing.city, listing.country].filter(Boolean).join(', ');

  return (
    <article className="group bg-white rounded-2xl border border-nordible-border p-5 shadow-xs hover:shadow-md transition-colors duration-200 flex flex-col justify-between hover:border-nordible-blue/30">
      <div>
        {/* Top Badges: Category & Verification */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-nordible-section-bg text-nordible-dark border border-nordible-border truncate max-w-[200px]">
            {listing.categoryName || categoryName}
          </span>
          {listing.isVerified ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('listing.verified')}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
              {t('business.unverifiedBadge')}
            </span>
          )}
        </div>

        {/* Identity: Logo, Title, Location & Status */}
        <div className="flex items-start gap-3 mb-3">
          <Link href={permalink} className="shrink-0">
            {listing.logoUrl && !imgError ? (
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-nordible-border shadow-2xs flex items-center justify-center overflow-hidden">
                <Image
                  src={listing.logoUrl}
                  alt={listing.name}
                  width={44}
                  height={44}
                  unoptimized
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nordible-blue/10 to-nordible-dark/10 border border-nordible-border text-nordible-dark font-black font-heading text-sm flex items-center justify-center">
                {listing.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={permalink} className="block group-hover:text-nordible-blue transition-colors">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-nordible-dark group-hover:text-nordible-blue transition-colors tracking-tight leading-snug line-clamp-1">
                {listing.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-nordible-blue shrink-0" />
                <span className="truncate">{locationString || (locale === 'de' ? 'Digital / Online' : 'Digital / Remote')}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
                  openStatus.isOpen ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${openStatus.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {openStatus.isOpen ? t('listing.openNow') : t('listing.closed')}
              </span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {typeof listing.description === 'string'
            ? listing.description
            : (listing.description as Record<string, string>)?.[locale] ||
              (listing.description as Record<string, string>)?.en ||
              (listing.description as Record<string, string>)?.de ||
              ''}
        </p>

        {/* Key Service Tags */}
        {listing.services && listing.services.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {listing.services.slice(0, 3).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-nordible-section-bg text-nordible-dark border border-nordible-border"
              >
                {srv}
              </span>
            ))}
            {listing.services.length > 3 && (
              <span className="text-[10px] text-gray-400 font-medium">
                +{listing.services.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: High-Signal Action Flow */}
      <div className="mt-5 pt-3 border-t border-nordible-border flex items-center justify-between gap-2">
        <Link
          href={permalink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-nordible-blue bg-blue-50/70 hover:bg-blue-100 transition-colors"
        >
          <span>{t('listing.details')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 hover:opacity-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('listing.website')}</span>
          </a>
        )}
      </div>
    </article>
  );
};
