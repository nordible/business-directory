'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing } from '@/lib/types';
import { siteConfig } from '@/config/site';
import { getBusinessPermalink } from '@/lib/permalinks';
import { Star, X, Mail, Copy, Check, ShieldCheck, ExternalLink } from 'lucide-react';

const emptySubscribe = () => () => {};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BusinessListing | null;
  primaryColor?: string;
  onReviewAdded?: (listingId: string, newRating: number, newCount: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  listing,
  primaryColor = '#145BFF',
}) => {
  const { locale, t } = useTranslation();

  const [copiedEmail, setCopiedEmail] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isOpen || !listing || !isMounted) return null;

  const businessUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${siteConfig.urls.base}${getBusinessPermalink(listing, locale)}`;

  const emailSubject = t('business.reviewEmailSubject', { name: listing.name });

  const emailBody = `Business: ${listing.name}\nURL: ${businessUrl}\n\nRating (1-5 stars):\nReview / Feedback:\n`;

  const mailtoUrl = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const copyToClipboard = (text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-gray-900 text-sm md:text-base leading-tight">
                {t('reviewModal.modalTitle')}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-1">{listing.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Trust guarantee banner */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#145BFF] shrink-0 mt-0.5" />
            <p className="text-gray-700 leading-relaxed text-[11px]">
              {t('reviewModal.guarantee')}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {t('reviewModal.instruction', { name: listing.name })}
          </p>

          {/* Action button: Direct click to email */}
          <div className="space-y-2 pt-1">
            <a
              href={mailtoUrl}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-98 transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-4 h-4" />
              <span>{t('reviewModal.sendEmail')}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAFBFF] border border-[#E8ECF4]">
              <div className="text-[11px] text-gray-500 font-medium">
                {t('reviewModal.emailLabel')}{' '}
                <strong className="text-[#0D2B75] font-mono">{siteConfig.contact.email}</strong>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(siteConfig.contact.email)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#145BFF] hover:text-[#0D2B75] transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? t('reviewModal.copied') : t('reviewModal.copy')}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-1">
            <span className="font-bold text-gray-700 block">
              {t('reviewModal.autoDetailsTitle')}
            </span>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>{t('reviewModal.detail1')}</li>
              <li>{t('reviewModal.detail2')}</li>
              <li>{t('reviewModal.detail3')}</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAFBFF] border-t border-[#E8ECF4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {t('reviewModal.close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
