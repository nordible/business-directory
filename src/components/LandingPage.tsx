'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { MOCK_LISTINGS, INITIAL_TENANTS } from '@/lib/mockData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mascot } from '@/components/mascot/Mascot';
import { AddListingModal } from '@/components/AddListingModal';
import { StructuredData } from '@/components/StructuredData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  Globe,
  Compass,
  Phone,
} from 'lucide-react';

export function LandingPage() {
  const { locale, t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const geoLocations = [
    { name: 'Frankfurt am Main', count: 'Zentraler Hub', highlight: true },
    { name: 'Berlin', count: 'Hauptstadt-Region', highlight: false },
    { name: 'München', count: 'Süddeutschland', highlight: false },
    { name: 'Hamburg', count: 'Norddeutschland', highlight: false },
    { name: 'Wien & Zürich', count: 'DACH-Region', highlight: false },
    { name: 'International', count: 'Global Partners', highlight: false },
  ];

  const faqs = [
    {
      q: t('landing.faq1Q'),
      a: t('landing.faq1A'),
    },
    {
      q: t('landing.faq2Q'),
      a: t('landing.faq2A'),
    },
    {
      q: t('landing.faq3Q'),
      a: t('landing.faq3A'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] text-slate-800 font-sans selection:bg-[#145BFF]/10 selection:text-[#145BFF]">
      <StructuredData locale={locale} />

      {/* Header */}
      <Header
        currentTenant={INITIAL_TENANTS[0]}
        onOpenAiModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-10 pb-20 lg:pt-18 lg:pb-28 border-b border-[#E8ECF4]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & High-Converting CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('landing.badge')}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0D2B75] tracking-tight font-heading leading-[1.12]">
                  {t('landing.heroTitle')}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  {t('landing.heroSubtitle')}
                </p>

                {/* Geo Local Target Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  {geoLocations.map((loc, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        loc.highlight
                          ? 'bg-[#145BFF]/10 text-[#145BFF] border border-[#145BFF]/30'
                          : 'bg-white border border-[#E8ECF4] text-slate-600'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#FF9F1A]" />
                      <span>{loc.name}</span>
                    </span>
                  ))}
                </div>

                {/* Primary CTA (Fitts's Law Conversion Action) */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
                  <Link
                    href="/directory"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#145BFF] px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-500/25 hover:bg-[#0D2B75] transition-all hover:scale-102 active:scale-95"
                  >
                    <Compass className="h-4 w-4" />
                    <span>{t('landing.ctaExplore')} →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#E8ECF4] hover:bg-[#F3F7FF] px-6 py-4 text-sm font-bold text-[#0D2B75] shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-[#FF9F1A]" />
                    <span>{t('landing.ctaAdd')}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Welcoming Mascot */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl">
                  <div className="absolute inset-0 bg-[#145BFF]/10 rounded-full blur-2xl animate-pulse" />
                  <Mascot
                    variant="hero-wave"
                    alt="Nordible Directory Mascot Googloo"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED VERIFIED BUSINESSES SHOWCASE */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#E8ECF4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A] font-heading">
                {t('landing.featuredTitle')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight mt-1">
                Geprüfte Partner im Branchenindex
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                {t('landing.featuredSubtitle')}
              </p>
            </div>

            {/* Business Cards Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_LISTINGS.map((listing) => (
                <article
                  key={listing.id}
                  className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:border-[#145BFF]/30 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifiziert</span>
                      </span>

                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#FF9F1A] text-[#FF9F1A]" />
                        <span>{listing.rating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({listing.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-extrabold text-base text-[#0D2B75] group-hover:text-[#145BFF] transition-colors tracking-tight">
                      {listing.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                      {listing.description[locale] || listing.description['de']}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span>{listing.address}, {listing.city}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E8ECF4] flex items-center justify-between">
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#145BFF] hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Website besuchen</span>
                    </a>

                    <a
                      href={`tel:${listing.phone}`}
                      className="p-2 rounded-xl bg-white border border-[#E8ECF4] text-slate-600 hover:text-[#0D2B75] hover:bg-[#F3F7FF] transition-colors"
                      title="Anrufen"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Launch Directory Button Under Cards */}
            <div className="text-center mt-10">
              <Link
                href="/directory"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0D2B75] hover:bg-[#145BFF] text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <span>Alle Einträge im interaktiven Verzeichnis durchsuchen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* BENEFITS / WHY NORDIBLE DIRECTORY */}
        <section className="py-16 sm:py-20 bg-[#FAFBFF] border-b border-[#E8ECF4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A] font-heading">
                Qualität & Sicherheit
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight mt-1">
                {t('landing.benefitsTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] mb-2">
                  {t('landing.benefit1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {t('landing.benefit1Desc')}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center mb-5">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] mb-2">
                  {t('landing.benefit2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {t('landing.benefit2Desc')}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FF9F1A] flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75] mb-2">
                  {t('landing.benefit3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {t('landing.benefit3Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE FAQ SECTION (Rich Snippets SEO) */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#E8ECF4]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A] font-heading">
                Transparenz
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight mt-1">
                {t('landing.faqTitle')}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E8ECF4] rounded-2xl overflow-hidden bg-[#FAFBFF] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-[#0D2B75] hover:text-[#145BFF] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0 text-[#145BFF]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#E8ECF4] bg-white font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HIGH-CONVERTING BOTTOM CTA BANNER */}
        <section className="py-14 sm:py-20 bg-[#FAFBFF]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0D2B75] via-[#145BFF]/90 to-[#0D2B75] rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
                  <Mascot variant="celebrate" alt="Nordible Directory Celebration" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A]">
                    Verifiziert • Unabhängig • Lokal
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-3xl tracking-tight">
                    Starten Sie jetzt mit dem Nordible Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed font-medium">
                    Finden Sie geprüfte Dienstleister oder senden Sie Ihre Daten für einen kostenlosen Basiseintrag.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto">
                <Link
                  href="/directory"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verzeichnis öffnen</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer text-center"
                >
                  Unternehmen eintragen
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <Footer />

      {/* Add Business Coming Soon Modal */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        primaryColor="#145BFF"
      />
    </div>
  );
}
