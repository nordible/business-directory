'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing } from '@/lib/types';
import { ShieldCheck, X, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';

interface ClaimListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BusinessListing | null;
  primaryColor: string;
  onListingClaimed: (claimedListingId: string) => void;
  onOpenDashboard: (listing: BusinessListing) => void;
}

export const ClaimListingModal: React.FC<ClaimListingModalProps> = ({
  isOpen,
  onClose,
  listing,
  primaryColor,
  onListingClaimed,
  onOpenDashboard,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onListingClaimed(listing.id);
      setStep('success');
    }, 600);
  };

  const handleGoToDashboard = () => {
    onClose();
    onOpenDashboard(listing);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#0D2B75] text-sm md:text-base leading-tight">
                {t('claimModal.title')}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-1">
                {t('claimModal.subtitle', { name: listing.name })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'email' && (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20">
                  <Mascot variant="security-shield" alt="Nordible Security Mascot" priority />
                </div>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1.5">
                    {t('claimModal.emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('claimModal.emailPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAFBFF] border border-[#E8ECF4] rounded-xl text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {t('claimModal.securityCodeNote')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{t('claimModal.sendCode')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16">
                  <Mascot variant="security-shield" alt="Nordible Security Mascot" />
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1.5">
                    {t('claimModal.codeLabel')}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAFBFF] border border-[#E8ECF4] rounded-xl text-base tracking-widest text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-mono font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {t('claimModal.testCodeHint')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('claimModal.verifyCode')}</span>
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-24 h-24 mx-auto">
                <Mascot variant="celebrate" alt="Celebration Mascot" priority />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-lg text-[#0D2B75]">
                  {t('claimModal.successTitle')}
                </h4>
                <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                  {t('claimModal.successSubtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <span>{t('claimModal.openDashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
