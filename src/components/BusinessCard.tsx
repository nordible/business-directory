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
    <article className="group bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-[#145BFF]/30">
      <div>
        {/* Top Badges: Category & Verification */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3F7FF] text-[#0D2B75] border border-[#E8ECF4] truncate max-w-[200px]">
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
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-[#E8ECF4] shadow-2xs flex items-center justify-center overflow-hidden">
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#145BFF]/10 to-[#0D2B75]/10 border border-[#E8ECF4] text-[#0D2B75] font-black font-heading text-sm flex items-center justify-center">
                {listing.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={permalink} className="block group-hover:text-[#145BFF] transition-colors">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] group-hover:text-[#145BFF] transition-colors tracking-tight leading-snug line-clamp-1">
                {listing.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mt-1">
              {locationString && (
                <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                  <span className="truncate">{locationString}</span>
                </div>
              )}
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
          {listing.description[locale] || listing.description.en || listing.description.de}
        </p>

        {/* Key Service Tags */}
        {listing.services && listing.services.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {listing.services.slice(0, 3).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F3F7FF] text-[#0D2B75] border border-[#E8ECF4]"
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
<<<<<<< HEAD

        {/* Address */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
          <MapPin className="w-4 h-4 text-[#145BFF] shrink-0" />
          <span>
            {[
              listing.address,
              [listing.postalCode, listing.city].filter(Boolean).join(' '),
            ]
              .filter(Boolean)
              .join(', ') || (locale === 'de' ? 'Digital / Online' : 'Digital / Remote')}
          </span>
        </div>

        {/* Progressive Disclosure (Expanded details) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#E8ECF4] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Clock className="w-4 h-4 text-gray-500 shrink-0" />
              <span>
                <strong className="text-[#0D2B75]">{t('listing.openingHours')}:</strong> {listing.hours}
                {openStatus.localTime && (
                  <span className="text-gray-400 text-[11px] ml-1.5 font-medium">
                    ({t('business.localTimeLabel', { location: openStatus.locationName })} {openStatus.localTime})
                  </span>
                )}
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
=======
>>>>>>> a0d888f8b8cc63aecba01dab2973481faf443774
      </div>

      {/* Action Footer: High-Signal Action Flow */}
      <div className="mt-5 pt-3 border-t border-[#E8ECF4] flex items-center justify-between gap-2">
        <Link
          href={permalink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#145BFF] bg-blue-50/70 hover:bg-blue-100 transition-colors"
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
