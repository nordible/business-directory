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
  const { locale } = useTranslation();
  const isDe = locale === 'de';

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
            <span>{isDe ? 'Zurück zum Verzeichnis' : 'Back to Directory'}</span>
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
              <span>{isDe ? 'Tarife & Lizenz' : 'Plans & License'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#E8ECF4] text-xs font-bold text-[#145BFF] mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
            <span>{isDe ? 'B2B Partner & White-Label Plattform' : 'B2B Partner & White-Label Platform'}</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#0D2B75] tracking-tight leading-tight">
            {isDe
              ? 'Starten Sie Ihr eigenes regionales oder vertikales Branchenportal'
              : 'Launch Your Own Regional or Vertical Business Directory'}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
            {isDe
              ? '100% unter Ihrer eigenen Marke. Mit automatisierter KI-Erfassung per URL, mobiler Ergonomie, Inhaber-Verifizierung und eigener Domain.'
              : '100% white-labeled under your brand. Powered by automated AI URL ingestion, mobile-first ergonomics, business owner claiming, and custom domains.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0D2B75] hover:bg-[#145BFF] text-white font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4 text-[#FF9F1A]" />
              <span>{isDe ? 'Live-Branding testen' : 'Test Live Branding'}</span>
            </button>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] font-extrabold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#145BFF]" />
              <span>{isDe ? 'Preise & Pakete ansehen' : 'View Pricing & Plans'}</span>
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
              {isDe ? 'Eigene Domain & SSL' : 'Custom Domain & SSL'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isDe
                ? 'Verbinden Sie Ihre Wunsch-Domain (z.B. verzeichnis-muenchen.de) mit automatischer SSL-Verschlüsselung innerhalb von 60 Sekunden.'
                : 'Connect your custom domain with instant automated SSL provisioning in under 60 seconds.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#FF9F1A] mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] mb-2">
              {isDe ? 'Autonome KI-Erfassung' : 'Autonomous AI Ingestion'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isDe
                ? 'Geben Sie eine URL oder einen kurzen Text ein – unsere KI liest Öffnungszeiten, Kontaktdaten und Beschreibungen automatisch aus.'
                : 'Input a website URL or text prompt – our AI agents parse business hours, contacts, and services automatically.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0D2B75] mb-2">
              {isDe ? 'Inhaber-Verifizierung' : 'Owner Claim Verification'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isDe
                ? 'Unternehmen können ihre Einträge per 2-Faktor-Code beanspruchen, Bewertungen verwalten und ihr Profil eigenständig pflegen.'
                : 'Businesses can claim listings via 2FA codes, answer reviews, and maintain opening hours directly.'}
            </p>
          </div>
        </section>

        {/* Live Interactive Branding Preview Box */}
        <section className="bg-white rounded-3xl border border-[#E8ECF4] p-8 sm:p-12 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg text-center md:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A]">
                {isDe ? 'Interaktive Vorschau' : 'Interactive Preview'}
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#0D2B75] tracking-tight">
                {isDe
                  ? 'Passen Sie Farben, Logo und Domain in Echtzeit an'
                  : 'Customize Colors, Logo, and Domain in Real-Time'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isDe
                  ? 'Ihr Verzeichnis passt sich flexibel Ihrer Corporate Identity an – von Primärfarben bis zu individuellen Kategorien.'
                  : 'Your directory dynamically reflects your brand identity with customizable palettes, categories, and typography.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0D2B75] hover:bg-[#145BFF] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-[#FF9F1A]" />
                  <span>{isDe ? 'Farben & Logo ändern' : 'Change Colors & Logo'}</span>
                </button>
                <button
                  onClick={() => setIsDomainSettingsOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FAFBFF] hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{isDe ? 'Domain konfigurieren' : 'Configure Domain'}</span>
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
                {isDe ? 'Persönliche Betreuung' : 'Dedicated Consultation'}
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tight">
                {isDe ? 'Haben Sie Fragen zur Partnerschaft?' : 'Have Questions About Partnering?'}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed">
                {isDe
                  ? 'Unser Engineering-Team unterstützt Sie beim Setup, Datenimport und bei der Anbindung Ihrer bestehenden Systeme.'
                  : 'Our engineering team helps with onboarding, database setup, and custom API integrations.'}
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
              <span>{isDe ? 'Beratungsgespräch buchen' : 'Book Consultation'}</span>
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
