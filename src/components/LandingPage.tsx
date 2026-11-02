'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing, TenantBranding } from '@/lib/types';
import { DEFAULT_TENANT, getAllBusinesses } from '@/lib/db/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mascot } from '@/components/mascot/Mascot';
import { AddListingModal } from '@/components/AddListingModal';
import { StructuredData } from '@/components/StructuredData';
import { InteractiveGlobe } from '@/components/InteractiveGlobe';
import { getBusinessPermalink } from '@/lib/permalinks';
import { siteConfig } from '@/config/site';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Compass,
  Coins,
  Search,
  CheckCircle2,
  Pause,
  Play,
} from 'lucide-react';

function ListingLogo({ logoUrl, name, size = 36 }: { logoUrl?: string; name: string; size?: number }) {
  const [error, setError] = useState(false);

  if (logoUrl && !error) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#E8ECF4] shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
        <Image
          src={logoUrl}
          alt={name}
          width={size}
          height={size}
          unoptimized
          onError={() => setError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#145BFF]/10 to-[#0D2B75]/10 border border-[#E8ECF4] text-[#0D2B75] font-black font-heading text-xs flex items-center justify-center shrink-0">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

interface LandingPageProps {
  initialBusinesses?: BusinessListing[];
  tenant?: TenantBranding;
}

export function LandingPage({
  initialBusinesses = [],
  tenant = DEFAULT_TENANT,
}: LandingPageProps) {
  const { locale, t } = useTranslation();
  const isDe = locale === 'de';
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessListing[]>(initialBusinesses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalWantsGrowth, setModalWantsGrowth] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openAddModal = (wantsGrowth = false) => {
    setModalWantsGrowth(wantsGrowth);
    setIsAddModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/${locale}/directory?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/${locale}/directory`);
    }
  };

  React.useEffect(() => {
    if (initialBusinesses.length === 0) {
      getAllBusinesses().then((data) => {
        if (data.length > 0) setBusinesses(data);
      });
    }
  }, [initialBusinesses]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const quickCategories = [
    { name: isDe ? 'Handwerk & Bau' : 'Craft & Construction', query: 'Handwerk', icon: '🛠️' },
    { name: isDe ? 'IT & Software' : 'IT & Software', query: 'Software', icon: '💻' },
    { name: isDe ? 'Gastronomie' : 'Dining & Cafés', query: 'Restaurant', icon: '🍽️' },
    { name: isDe ? 'Gesundheit' : 'Health & Medical', query: 'Gesundheit', icon: '🩺' },
    { name: isDe ? 'Beratung & Recht' : 'Legal & Consulting', query: 'Beratung', icon: '⚖️' },
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
    {
      q: t('landing.faq4Q'),
      a: t('landing.faq4A'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] text-slate-800 font-sans selection:bg-[#145BFF]/10 selection:text-[#145BFF]">
      <StructuredData locale={locale} />

      {/* Header */}
      <Header
        currentTenant={tenant}
        onOpenAiModal={() => openAddModal(false)}
      />

      <main className="flex-1">
        {/* CONSUMER-FIRST HERO SECTION */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8ECF4]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headlines & Search Form */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('landing.badge')}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#0D2B75] tracking-tight font-heading leading-[1.14]">
                  {t('landing.heroTitle')}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  {t('landing.heroSubtitle')}
                </p>

                {/* Instant Consumer Service Search Input */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-white rounded-2xl border-2 border-[#145BFF]/30 p-2 shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isDe ? 'Dienstleistung, Handwerker, Stadt suchen...' : 'Search service, craftsman, city...'}
                      className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl focus:outline-none font-medium text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] text-white px-6 py-3 text-xs sm:text-sm font-extrabold shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isDe ? 'Suchen' : 'Search'}</span>
                  </button>
                </form>

                {/* Quick 1-Tap Category Pills (Fitts's Law Mobile Reach) */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">
                    {isDe ? 'Beliebt:' : 'Popular:'}
                  </span>
                  {quickCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/${locale}/directory?q=${encodeURIComponent(cat.query)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8ECF4] hover:border-[#145BFF]/40 hover:bg-[#F3F7FF] text-[#0D2B75] font-bold text-xs transition-colors shadow-2xs"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href={`/${locale}/directory`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#0D2B75] px-7 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-[#145BFF] transition-all hover:scale-102 active:scale-95"
                  >
                    <Compass className="h-4 w-4" />
                    <span>{t('landing.ctaExplore')} →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openAddModal(false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#E8ECF4] hover:bg-[#F3F7FF] px-6 py-3.5 text-sm font-bold text-[#0D2B75] shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-[#FF9F1A]" />
                    <span>{t('landing.ctaAdd')}</span>
                  </button>
                </div>

                {/* Friction-Free Consumer Trust Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 font-bold shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('landing.heroFreeTrust')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 font-bold shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-[#FF9F1A] text-[#FF9F1A] shrink-0" />
                    <span>{isDe ? 'Echte Kundenbewertungen' : 'Real Customer Reviews'}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Welcoming Mascot */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl">
                  <div className="absolute inset-0 bg-[#145BFF]/10 rounded-full blur-2xl animate-pulse" />
                  <Mascot
                    variant="hero-wave"
                    alt={`${siteConfig.appName} Mascot Googloo`}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONSUMER VALUE LOOP: HOW IT WORKS FOR CUSTOMERS */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#E8ECF4] relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-extrabold text-[#145BFF] mb-3 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#145BFF]" />
                <span>{t('landing.benefitsBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight leading-tight">
                {t('landing.benefitsTitle')}
              </h2>
            </div>

            {/* 4 Customer Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Pillar 1 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-[#E8ECF4] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#145BFF]/40">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {t('landing.benefit1Title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('landing.benefit1Desc')}
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-[#E8ECF4] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-300">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {t('landing.benefit2Title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('landing.benefit2Desc')}
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-[#E8ECF4] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-300">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FF9F1A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Star className="w-5 h-5 fill-[#FF9F1A]" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {t('landing.benefit3Title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('landing.benefit3Desc')}
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-[#E8ECF4] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-300">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {t('landing.benefit4Title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('landing.benefit4Desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* DEDICATED HIGH-CONVERTING B2B BANNER (PROVING CONSUMER DEMAND TO BUSINESSES) */}
            <div className="mt-12 bg-gradient-to-br from-[#0D2B75] to-[#145BFF] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-blue-100 text-[11px] font-bold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
                  <span>{t('landing.b2bBannerBadge')}</span>
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tight">
                  {t('landing.b2bBannerTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl leading-relaxed font-medium">
                  {t('landing.b2bBannerSubtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href={`/${locale}/fuer-unternehmen`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F3F7FF] text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-md text-center"
                >
                  <span>{t('landing.b2bBannerCtaBusiness')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openAddModal(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0D2B75]" />
                  <span>{t('landing.b2bBannerCtaAdd')}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 3D GLOBAL CONNECTION GLOBE */}
        <InteractiveGlobe />

        {/* INTERACTIVE FAQ SECTION (Rich Snippets SEO) */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#E8ECF4]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A] font-heading">
                {t('landing.faqBadge')}
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

        {/* SOCIAL PROOF: CONTINUOUS MOVING VERIFIED BUSINESSES CAROUSEL (BELOW FAQ) */}
        <section className="py-12 sm:py-16 bg-white border-t border-b border-[#E8ECF4] overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A] font-heading">
                {t('landing.featuredTitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0D2B75] font-heading tracking-tight mt-0.5">
                {locale === 'de' ? 'Bereits gelistete Unternehmen weltweit' : 'Verified Businesses Listed Worldwide'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Accessible Pause / Play Control */}
              <button
                type="button"
                onClick={() => setIsCarouselPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:bg-white text-[#0D2B75] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                title={
                  isCarouselPaused
                    ? locale === 'de'
                      ? 'Laufband fortsetzen'
                      : 'Play Carousel'
                    : locale === 'de'
                    ? 'Laufband anhalten'
                    : 'Pause Carousel'
                }
              >
                {isCarouselPaused ? (
                  <>
                    <Play className="w-3 h-3 text-[#145BFF] fill-[#145BFF]" />
                    <span>{locale === 'de' ? 'Fortsetzen' : 'Play'}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-[#145BFF]" />
                    <span>{locale === 'de' ? 'Pause' : 'Pause'}</span>
                  </>
                )}
              </button>

              <Link
                href={`/${locale}/directory`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#145BFF] hover:underline whitespace-nowrap"
              >
                <span>
                  {locale === 'de'
                    ? 'Alle Unternehmen im Verzeichnis ansehen'
                    : 'Explore all businesses in directory'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Smooth Horizontal Scrolling Ribbon */}
          <div className="relative w-full overflow-hidden">
            {/* Subtle Gradient Fade Masks at Left & Right Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Continuous Marquee Track */}
            <div
              className={`animate-marquee gap-5 py-3 px-4 ${
                isCarouselPaused ? 'animate-marquee-paused' : ''
              }`}
            >
              {(businesses.length < 6
                ? [...businesses, ...businesses, ...businesses, ...businesses]
                : [...businesses, ...businesses]
              ).map((listing, index) => (
                <Link
                  key={`${listing.id}-${index}`}
                  href={getBusinessPermalink(listing, locale)}
                  className="w-72 sm:w-80 shrink-0 bg-[#FAFBFF] hover:bg-white rounded-2xl border border-[#E8ECF4] p-4 shadow-2xs hover:shadow-lg hover:border-[#145BFF]/40 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('landing.verifiedPill')}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3 h-3 fill-[#FF9F1A] text-[#FF9F1A]" />
                        <span>{listing.rating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({listing.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 my-2">
                      <ListingLogo logoUrl={listing.logoUrl} name={listing.name} size={32} />
                      <div className="truncate">
                        <h3 className="font-heading font-extrabold text-sm text-[#0D2B75] group-hover:text-[#145BFF] transition-colors truncate">
                          {listing.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate">
                          {listing.city} &bull; {listing.categoryName || listing.categoryId}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {listing.description[locale] || listing.description['en'] || listing.description['de']}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E8ECF4] flex items-center justify-between text-xs font-bold text-[#145BFF]">
                    <span className="group-hover:underline flex items-center gap-1">
                      {t('listing.viewProfile')}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {locale === 'de' ? 'Im Verzeichnis' : 'In Directory'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HIGH-CONVERTING BOTTOM CTA BANNER */}
        <section className="py-14 sm:py-20 bg-[#FAFBFF]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0D2B75] via-[#145BFF]/90 to-[#0D2B75] rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
                  <Mascot variant="celebrate" alt={`${siteConfig.appName} Celebration`} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1A]">
                    {t('landing.ctaBannerBadge')}
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-3xl tracking-tight">
                    {t('landing.ctaBannerTitle', { name: siteConfig.appName })}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed font-medium">
                    {t('landing.ctaBannerSubtitle')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto">
                <Link
                  href={`/${locale}/directory`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <span>{t('landing.ctaBannerOpen')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openAddModal(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer text-center"
                >
                  {t('landing.ctaBannerSubmit')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <Footer showPromo={true} />

      {/* Add Business Coming Soon Modal */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        primaryColor="#145BFF"
        initialWantsGrowthResource={modalWantsGrowth}
      />
    </div>
  );
}
