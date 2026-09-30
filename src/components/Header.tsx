'use client';

import React from 'react';
import { TenantBranding } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Palette, Globe, Layers, PlusCircle, CreditCard } from 'lucide-react';

interface HeaderProps {
  currentTenant: TenantBranding;
  tenants: TenantBranding[];
  onSelectTenant: (tenant: TenantBranding) => void;
  onOpenCustomizer: () => void;
  onOpenAiModal: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTenant,
  tenants,
  onSelectTenant,
  onOpenCustomizer,
  onOpenAiModal,
  onOpenPricing,
}) => {
  const { locale, setLocale, t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
            style={{ backgroundColor: currentTenant.primaryColor }}
          >
            {currentTenant.logoText.slice(0, 2)}
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 leading-tight">
              {currentTenant.name}
            </h1>
            <span className="text-xs text-gray-700 hidden sm:inline">
              {t('brand.poweredBy')}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Tenant Switcher */}
          <div className="relative flex items-center">
            <Layers className="w-4 h-4 text-gray-600 absolute left-2 pointer-events-none" />
            <select
              aria-label={t('tenant.switchTenant')}
              value={currentTenant.id}
              onChange={(e) => {
                const found = tenants.find((item) => item.id === e.target.value);
                if (found) onSelectTenant(found);
              }}
              className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tenants.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  {tItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Listing Onboarding Button (Desktop) */}
          <button
            onClick={onOpenAiModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-transform active:scale-95 cursor-pointer"
            title={t('nav.addListing')}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('nav.addListing')}</span>
          </button>

          {/* White-Label Customizer Button */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
            style={{ backgroundColor: currentTenant.primaryColor }}
            title={t('brand.customizeBrand')}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('brand.customizeBrand')}</span>
          </button>

          {/* Pricing & SaaS Plans Button */}
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-2xs transition-colors cursor-pointer"
              title={t('pricing.title')}
            >
              <CreditCard className="w-3.5 h-3.5 text-gray-600" />
              <span>Preise</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 ml-1.5 text-gray-600" />
            <button
              onClick={() => setLocale('de')}
              className={`px-2 py-1 rounded-md transition-all ${
                locale === 'de'
                  ? 'bg-white shadow-xs text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                locale === 'en'
                  ? 'bg-white shadow-xs text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
