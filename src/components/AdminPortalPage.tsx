'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { AdminModerationModal } from '@/components/AdminModerationModal';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';

export function AdminPortalPage() {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECF4] shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-[#0D2B75] hover:text-[#145BFF] transition-colors group font-bold text-xs sm:text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAFBFF] border border-[#E8ECF4] flex items-center justify-center group-hover:border-[#145BFF]/30 transition-colors shadow-2xs">
              <ArrowLeft className="w-4 h-4 text-[#0D2B75] group-hover:text-[#145BFF]" />
            </div>
            <span>{isDe ? 'Zurück zur Startseite' : 'Back to Home'}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 border border-[#E8ECF4] shadow-2xs">
              <Image
                src={siteConfig.assets.logoIcon}
                alt={siteConfig.company.name}
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-heading font-black text-sm text-[#0D2B75] hidden sm:inline">
              {siteConfig.appName}
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-6">
        {/* Security & Access Restriction Notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div className="space-y-1">
            <h1 className="text-sm sm:text-base font-extrabold text-amber-950 font-heading">
              {isDe ? 'Geschützter Administrationsbereich' : 'Protected Administrator Portal'}
            </h1>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {isDe
                ? 'Dieser Bereich ist nicht öffentlich verfügbar. Der Zugriff auf Moderations- und Freigabefunktionen ist ausschließlich für autorisierte Administratoren von Nordible gestattet.'
                : 'This section is not publicly accessible. Access to moderation and publishing functions is strictly reserved for authorized Nordible administrators.'}
            </p>
          </div>
        </div>

        {/* Embedded Moderation Console */}
        <div className="w-full">
          <AdminModerationModal mode="embedded" isOpen={true} />
        </div>
      </main>

      <Footer showPromo={false} />
    </div>
  );
}
