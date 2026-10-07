'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { INITIAL_TENANTS } from '@/lib/mockData';
import { TenantBranding } from '@/lib/types';
import { Mascot } from '@/components/mascot/Mascot';
import { TenantCustomizer } from '@/components/TenantCustomizer';
import { PricingModal } from '@/components/PricingModal';
import { DomainSettingsModal } from '@/components/DomainSettingsModal';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';
import {
  Sparkles,
  ArrowLeft,
  Palette,
  CreditCard,
  ShieldCheck,
  Globe,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function PartnerPage() {
  const { locale, t } = useTranslation();

  const [currentTenant, setCurrentTenant] = useState<TenantBranding>(INITIAL_TENANTS[0]);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isDomainSettingsOpen, setIsDomainSettingsOpen] = useState(false);

  const handleSaveTenant = (updated: TenantBranding) => {
    setCurrentTenant(updated);
  };

  const handleSaveDomain = (customDomain: string) => {
    setCurrentTenant((prev) => ({
      ...prev,
      customDomain,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECF4] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-[#0D2B75] hover:text-[#145BFF] transition-colors group font-bold text-xs sm:text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAFBFF] border border-[#E8ECF4] flex items-center justify-center group-hover:border-[#145BFF]/30 transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0D2B75] group-hover:text-[#145BFF]" />
            </div>
            <span>{t('partner.backToDirectory')}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-2xs border border-[#E8ECF4]">
                <Image
                  src={siteConfig.assets.logoIcon}
                  alt={siteConfig.company.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-extrabold text-sm text-[#0D2B75] hidden sm:inline">
                {siteConfig.appNameShort} Partner
              </span>
            </div>

            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#145BFF] hover:bg-[#0F47D1] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('partner.plansAndLicense')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#E8ECF4] text-xs font-bold text-[#145BFF] mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
            <span>{t('partner.badge')}</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#0D2B75] tracking-tight leading-tight">
            {t('partner.heroTitle')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
            {t('partner.heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0D2B75] hover:bg-[#145BFF] text-white font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4 text-[#FF9F1A]" />
              <span>{t('partner.btnTestLive')}</span>
            </button>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] font-extrabold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#145BFF]" />
              <span>{t('partner.btnViewPricing')}</span>
            </button>
          </div>
        </section>

        {/* Feature Highlights with Mascot */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F7FF] flex items-center justify-center text-[#145BFF] mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] mb-2">
              {t('partner.featDomainTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featDomainDesc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#FF9F1A] mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] mb-2">
              {t('partner.featAiTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featAiDesc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] mb-2">
              {t('partner.featClaimTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featClaimDesc')}
            </p>
          </div>
        </section>

        {/* Live Interactive Branding Preview Box */}
        <section className="bg-white rounded-3xl border border-[#E8ECF4] p-8 sm:p-12 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg text-center md:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A]">
                {t('partner.previewBadge')}
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#0D2B75] tracking-tight">
                {t('partner.previewTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('partner.previewSubtitle')}
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0D2B75] hover:bg-[#145BFF] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-[#FF9F1A]" />
                  <span>{t('partner.btnChangeColors')}</span>
                </button>
                <button
                  onClick={() => setIsDomainSettingsOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FAFBFF] hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{t('partner.btnConfigureDomain')}</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-[#FAFBFF] border border-[#E8ECF4] rounded-2xl p-5 shadow-xs text-center">
              <div className="w-20 h-20 mx-auto mb-3">
                <Mascot variant="celebrate" alt="Partner Mascot" />
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                style={{ backgroundColor: currentTenant.primaryColor }}
              >
                {currentTenant.logoText}
              </div>
              <h4 className="font-heading font-extrabold text-base text-[#0D2B75]">
                {currentTenant.name}
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                {currentTenant.tagline[locale]}
              </p>
              {currentTenant.customDomain && (
                <div className="mt-3 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-200">
                  🌐 {currentTenant.customDomain}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact & Consultation Banner */}
        <section className="bg-gradient-to-r from-[#0D2B75] via-[#145BFF]/85 to-[#0D2B75] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
              <Mascot variant="hero-wave" alt="Nordible Partner Support" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A]">
                {t('partner.supportBadge')}
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tight">
                {t('partner.supportTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed">
                {t('partner.supportDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://nordible.co/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t('partner.btnBookConsult')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals for live demo */}
      <TenantCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTenant={currentTenant}
        onSaveTenant={handleSaveTenant}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        primaryColor={currentTenant.primaryColor}
        onOpenDomainSettings={() => setIsDomainSettingsOpen(true)}
      />

      <DomainSettingsModal
        isOpen={isDomainSettingsOpen}
        onClose={() => setIsDomainSettingsOpen(false)}
        currentTenant={currentTenant}
        primaryColor={currentTenant.primaryColor}
        onSaveDomain={handleSaveDomain}
      />
    </div>
  );
}
