'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TenantBranding, Locale } from '@/lib/types';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { Globe, PlusCircle, Handshake, ChevronDown, Compass } from 'lucide-react';

interface HeaderProps {
  currentTenant: TenantBranding;
  tenants?: TenantBranding[];
  onSelectTenant?: (tenant: TenantBranding) => void;
  onOpenCustomizer?: () => void;
  onOpenAiModal: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTenant,
  onOpenAiModal,
}) => {
  const { locale, setLocale, t } = useTranslation();
  const isDe = locale === 'de';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECF4] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-heading font-bold shadow-sm shrink-0 hover:scale-105 transition-transform"
            style={{ backgroundColor: currentTenant.primaryColor }}
          >
            {currentTenant.logoText.slice(0, 2)}
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] leading-tight tracking-tight hover:text-[#145BFF] transition-colors"
              >
                {currentTenant.name}
              </Link>
            </div>
            <a
              href="https://nordible.co"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-[#145BFF] transition-colors"
            >
              <Image
                src="/images/logos/nordible-icon.png"
                alt="Nordible"
                width={12}
                height={12}
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="hidden sm:inline">{t('brand.poweredBy')}</span>
              <span className="font-semibold text-gray-700 group-hover:text-[#145BFF]">Nordible</span>
            </a>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick link to Directory Tool */}
          <Link
            href="/directory"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:bg-[#F3F7FF] text-[#0D2B75] transition-colors"
            title={isDe ? 'Zum Verzeichnis' : 'To Directory'}
          >
            <Compass className="w-3.5 h-3.5 text-[#145BFF]" />
            <span>{isDe ? 'Verzeichnis' : 'Directory'}</span>
          </Link>

          {/* Add Business / Eintragen Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#0D2B75] text-white hover:bg-[#145BFF] shadow-xs transition-all active:scale-95 cursor-pointer"
            title={t('nav.addListing')}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('nav.addListing')}</span>
          </button>

          {/* Partnership / White-Label Link */}
          <Link
            href="/partner"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E8ECF4] bg-white hover:bg-[#F3F7FF] text-[#0D2B75] shadow-2xs transition-colors cursor-pointer"
            title={isDe ? 'White-Label & Partnerschaft' : 'White-Label & Partnership'}
          >
            <Handshake className="w-3.5 h-3.5 text-[#145BFF]" />
            <span>{t('nav.partner')}</span>
          </Link>

          {/* Ergonomic 5-Language Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-[#145BFF] absolute left-2.5 pointer-events-none" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label="Select Language / Sprache wählen"
              className="appearance-none pl-7 pr-6 py-1.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] text-xs font-extrabold text-[#0D2B75] hover:bg-white hover:border-[#145BFF]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#145BFF] cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
