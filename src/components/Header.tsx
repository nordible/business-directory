'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TenantBranding, Locale } from '@/lib/types';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { Globe, PlusCircle, ChevronDown, Compass } from 'lucide-react';

import { siteConfig } from '@/config/site';

interface HeaderProps {
  currentTenant?: TenantBranding;
  tenants?: TenantBranding[];
  onSelectTenant?: (tenant: TenantBranding) => void;
  onOpenCustomizer?: () => void;
  onOpenAiModal: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
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
            title={siteConfig.appName}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 border border-[#E8ECF4] shrink-0 hover:scale-105 transition-transform"
          >
            <Image
              src={siteConfig.assets.logoIcon}
              alt={siteConfig.company.name}
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] leading-tight tracking-tight hover:text-[#145BFF] transition-colors"
              >
                {siteConfig.appName}
              </Link>
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 hover:bg-[#F3F7FF] border border-[#E8ECF4] px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:text-[#145BFF] transition-colors hidden sm:inline-block"
              >
                by {siteConfig.appNameShort}
              </a>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight hidden md:block">
              {isDe ? siteConfig.tagline.de : siteConfig.tagline.en}
            </p>
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

          {/* Language Dropdown */}
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
