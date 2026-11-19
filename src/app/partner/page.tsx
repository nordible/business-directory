'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { DEFAULT_TENANT } from '@/lib/db/client';
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
  Code2,
  ArrowUpRight,
} from 'lucide-react';

export default function PartnerPage() {
  const { locale, t } = useTranslation();

  const [currentTenant, setCurrentTenant] = useState<TenantBranding>(DEFAULT_TENANT);
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
    <div className="min-h-screen flex flex-col bg-nordible-bg">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-nordible-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-nordible-dark hover:text-nordible-blue transition-colors group font-bold text-xs sm:text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-nordible-bg border border-nordible-border flex items-center justify-center group-hover:border-nordible-blue/30 transition-colors">
              <ArrowLeft className="w-4 h-4 text-nordible-dark group-hover:text-nordible-blue" />
            </div>
            <span>{t('partner.backToDirectory')}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-2xs border border-nordible-border">
                <Image
                  src={siteConfig.assets.logoIcon}
                  alt={siteConfig.company.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-extrabold text-sm text-nordible-dark hidden sm:inline">
                {siteConfig.appNameShort} Partner
              </span>
            </div>

            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-nordible-blue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nordible-section-bg border border-nordible-border text-xs font-bold text-nordible-blue mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-nordible-orange" />
            <span>{t('partner.badge')}</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-nordible-dark tracking-tight leading-tight">
            {t('partner.heroTitle')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
            {t('partner.heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-nordible-dark hover:bg-nordible-blue text-white font-extrabold text-sm shadow-lg transition-colors active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4 text-nordible-orange" />
              <span>{t('partner.btnTestLive')}</span>
            </button>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-nordible-section-bg border border-nordible-border text-nordible-dark font-extrabold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-nordible-blue" />
              <span>{t('partner.btnViewPricing')}</span>
            </button>
          </div>
        </section>

        {/* Feature Highlights with Mascot */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl border border-nordible-border p-7 shadow-xs hover:shadow-md transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-nordible-section-bg flex items-center justify-center text-nordible-blue mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-nordible-dark mb-2">
              {t('partner.featDomainTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featDomainDesc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-nordible-border p-7 shadow-xs hover:shadow-md transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-nordible-orange mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-nordible-dark mb-2">
              {t('partner.featAiTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featAiDesc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-nordible-border p-7 shadow-xs hover:shadow-md transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-nordible-dark mb-2">
              {t('partner.featClaimTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('partner.featClaimDesc')}
            </p>
          </div>
        </section>

        {/* Live Interactive Branding Preview Box */}
        <section className="bg-white rounded-3xl border border-nordible-border p-8 sm:p-12 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg text-center md:text-left">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-nordible-dark tracking-tight">
                {t('partner.previewTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('partner.previewSubtitle')}
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-nordible-dark hover:bg-nordible-blue text-white text-xs font-bold transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-nordible-orange" />
                  <span>{t('partner.btnChangeColors')}</span>
                </button>
                <button
                  onClick={() => setIsDomainSettingsOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-nordible-bg hover:bg-nordible-section-bg border border-nordible-border text-nordible-dark text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-nordible-blue" />
                  <span>{t('partner.btnConfigureDomain')}</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-nordible-bg border border-nordible-border rounded-2xl p-5 shadow-xs text-center">
              <div className="w-20 h-20 mx-auto mb-3">
                <Mascot variant="celebrate" alt="Partner Mascot" />
              </div>
              {currentTenant.logoText && !currentTenant.logoText.includes(currentTenant.name) && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                  style={{ backgroundColor: currentTenant.primaryColor }}
                >
                  {currentTenant.logoText}
                </div>
              )}
              <h4 className="font-heading font-extrabold text-base text-nordible-dark">
                {currentTenant.name}
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                {currentTenant.tagline[locale]}
              </p>
              {currentTenant.customDomain && (
                <div className="mt-3 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-200 inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentTenant.customDomain}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Open Source Transparency Section */}
        <section className="bg-white rounded-3xl border border-nordible-border p-6 sm:p-8 mb-16 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-nordible-dark text-nordible-orange flex items-center justify-center shrink-0 shadow-xs">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                <span>100% Open Source (MIT)</span>
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-nordible-dark">
                {locale === 'de' ? 'Vollständige Code-Transparenz auf GitHub' : 'Full Code Transparency on GitHub'}
              </h3>
              <p className="text-xs text-gray-500 max-w-xl leading-relaxed mt-0.5">
                {locale === 'de'
                  ? 'Prüfen Sie unsere Architektur, auditieren Sie die Sicherheitsstandards oder hosten Sie die Plattform auf eigener Infrastruktur.'
                  : 'Audit the system architecture, inspect our data privacy standards, or self-host the directory platform on your own infrastructure.'}
              </p>
            </div>
          </div>
          <a
            href="https://github.com/nordible/business-directory"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-nordible-dark hover:bg-nordible-blue text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <span>{locale === 'de' ? 'GitHub Repository ansehen' : 'View GitHub Repository'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-nordible-orange" />
          </a>
        </section>

        {/* Contact & Consultation Banner */}
        <section className="bg-gradient-to-r from-nordible-dark via-nordible-blue/85 to-nordible-dark rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
              <Mascot variant="hero-wave" alt="Nordible Partner Support" />
            </div>
            <div className="space-y-1.5">
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
              className="px-6 py-3.5 rounded-2xl bg-nordible-orange hover:bg-amber-400 text-nordible-dark font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t('partner.btnBookConsult')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer showPromo={true} />

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
