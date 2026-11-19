'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TenantBranding, Locale, LanguageOption } from '@/lib/types';
import { useTranslation, SUPPORTED_LANGUAGES, DISPLAYED_LANGUAGES } from '@/lib/i18n';
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

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-nordible-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}`}
            title={siteConfig.appName}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 border border-nordible-border shrink-0 hover:scale-105 transition-transform"
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
                href={`/${locale}`}
                className="font-heading font-extrabold text-base sm:text-lg text-nordible-dark leading-tight tracking-tight hover:text-nordible-blue transition-colors"
              >
                {siteConfig.appName}
              </Link>
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 hover:bg-nordible-section-bg border border-nordible-border px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:text-nordible-blue transition-colors hidden sm:inline-block"
              >
                {t('nav.by', { name: siteConfig.appNameShort })}
              </a>
              {siteConfig.isBeta && (
                <span
                  title={t('nav.betaNotice')}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-500/20 cursor-help select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {t('nav.betaBadge')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-tight hidden md:block">
              {t('nav.tagline')}
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick link to Directory Tool */}
          <Link
            href={`/${locale}/directory`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-nordible-border bg-nordible-bg hover:bg-nordible-section-bg text-nordible-dark transition-colors"
            title={t('nav.toDirectory')}
          >
            <Compass className="w-3.5 h-3.5 text-nordible-blue" />
            <span>{t('nav.toDirectory')}</span>
          </Link>

          {/* Dedicated Page for Businesses */}
          <Link
            href={`/${locale}/fuer-unternehmen`}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-nordible-border bg-white hover:bg-blue-50/50 text-nordible-blue hover:border-nordible-blue/40 transition-colors"
            title={locale === 'de' ? 'Für Unternehmen & Dienstleister' : 'For Businesses & Service Providers'}
          >
            <span>{locale === 'de' ? 'Für Unternehmen' : 'For Businesses'}</span>
          </Link>

          {/* Add Business / Eintragen Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-nordible-dark text-white hover:bg-nordible-blue shadow-xs transition-colors active:scale-95 cursor-pointer"
            title={t('nav.addListing')}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('nav.addListing')}</span>
          </button>

          {/* Language Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-nordible-blue absolute left-2.5 pointer-events-none" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label="Select Language / Sprache wählen"
              className="appearance-none pl-7 pr-6 py-1.5 rounded-xl border border-nordible-border bg-nordible-bg text-xs font-extrabold text-nordible-dark hover:bg-white hover:border-nordible-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-nordible-blue cursor-pointer"
            >
              {(() => {
                const options = DISPLAYED_LANGUAGES.some((l) => l.code === locale)
                  ? DISPLAYED_LANGUAGES
                  : [
                      ...DISPLAYED_LANGUAGES,
                      SUPPORTED_LANGUAGES.find((l) => l.code === locale),
                    ].filter((l): l is LanguageOption => Boolean(l));
                return options.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ));
              })()}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
