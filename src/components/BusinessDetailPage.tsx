'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BusinessListing, TenantBranding, Category } from '@/lib/types';
import { DEFAULT_TENANT, DEFAULT_CATEGORIES, getBusinessByIdOrSlug } from '@/lib/db/client';
import { useTranslation } from '@/lib/i18n';
import { isBusinessOpenNow } from '@/lib/openingHours';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mascot } from '@/components/mascot/Mascot';
import { CustomerInquiryModal } from '@/components/CustomerInquiryModal';
import { CustomerInboxDrawer } from '@/components/CustomerInboxDrawer';
import { ReviewModal } from '@/components/ReviewModal';
import { ClaimListingModal } from '@/components/ClaimListingModal';
import { BusinessDashboardModal } from '@/components/BusinessDashboardModal';
import { getBusinessPermalink } from '@/lib/permalinks';
import { siteConfig } from '@/config/site';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Settings,
  CheckCircle2,
  CheckCircle,
  Navigation,
  Building2,
  AlertCircle,
} from 'lucide-react';

interface BusinessDetailPageProps {
  businessId: string;
  initialListing?: BusinessListing | null;
  tenant?: TenantBranding;
  categories?: Category[];
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({
  businessId,
  initialListing = null,
  tenant,
  categories = DEFAULT_CATEGORIES,
}) => {
  const { locale, t } = useTranslation();

  const [listing, setListing] = useState<BusinessListing | null>(initialListing);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!initialListing && businessId) {
      getBusinessByIdOrSlug(businessId).then((data) => {
        if (data) setListing(data);
      });
    }
  }, [initialListing, businessId]);

  // Modals state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isCustomerInboxOpen, setIsCustomerInboxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [copiedReviewEmail, setCopiedReviewEmail] = useState(false);
  const [copiedSidebarEmail, setCopiedSidebarEmail] = useState(false);

  const currentTenant: TenantBranding = tenant || DEFAULT_TENANT;

  const category = listing
    ? categories.find((c) => c.id === listing.categoryId || c.slug === listing.categoryId)
    : null;
  const categoryKey = category ? `categories.${category.slug}` : '';
  const translatedCategory = categoryKey ? t(categoryKey) : '';
  const categoryName = category
    ? (translatedCategory && translatedCategory !== categoryKey
        ? translatedCategory
        : (category.name['en'] || (locale === 'de' ? category.name['de'] : category.name['en']) || category.name[locale] || ''))
    : '';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFBFF]">
        <Header currentTenant={currentTenant} onOpenAiModal={() => {}} />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 mb-6">
            <Mascot variant="working-laptop" alt={t('business.notFound')} />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0D2B75] mb-2">
            {t('business.notFound')}
          </h1>
          <p className="text-sm text-gray-500 max-w-md mb-8">
            {t('business.notFoundDesc')}
          </p>
          <Link
            href={`/${locale}/directory`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#145BFF] text-white text-xs font-bold shadow-md hover:bg-[#0D2B75] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('business.backToDirectory')}</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const localizedDescription =
    (locale === 'de' ? listing.description['de'] : listing.description['en']) ||
    listing.description['en'] ||
    listing.description[locale] ||
    '';

  const mapsQuery = encodeURIComponent(`${listing.name}, ${listing.address}, ${listing.city}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const businessUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${siteConfig.urls.base}${getBusinessPermalink(listing, locale)}`;

  const openStatus = isBusinessOpenNow(listing, locale);

  // LocalBusiness Structured Data (JSON-LD)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: localizedDescription,
    telephone: listing.phone,
    url: listing.website,
    image: listing.logoUrl || `${siteConfig.urls.base}${siteConfig.assets.logoIcon}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressCountry: listing.country || 'DE',
    },
    ...(listing.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: listing.rating,
            reviewCount: listing.reviewCount,
          },
        }
      : {}),
    openingHours: listing.hours,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <style jsx global>{`
        :root {
          --tenant-primary: ${currentTenant.primaryColor};
          --tenant-accent: ${currentTenant.accentColor};
        }
      `}</style>

      {/* Top Global Header */}
      <Header currentTenant={currentTenant} onOpenAiModal={() => {}} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-10">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-between">
          <Link
            href={`/${locale}/directory`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#145BFF] transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E8ECF4] flex items-center justify-center group-hover:border-[#145BFF]/30 shadow-2xs">
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#145BFF]" />
            </div>
            <span>{t('business.backToDirectory')}</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8ECF4] text-xs font-bold text-[#0D2B75] hover:border-[#145BFF]/30 hover:bg-[#F3F7FF] transition-all shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{t('business.copied')}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#145BFF]" />
                <span>{t('business.share')}</span>
              </>
            )}
          </button>
        </nav>

        {/* Hero Card */}
        <section className="bg-white rounded-3xl border border-[#E8ECF4] shadow-xs mb-8 relative overflow-hidden">
          {listing.bannerUrl ? (
            <div className="relative w-full h-36 sm:h-48 md:h-56 bg-slate-100 overflow-hidden">
              <Image
                src={listing.bannerUrl}
                alt={`${listing.name} cover banner`}
                fill
                unoptimized
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
            </div>
          ) : (
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#145BFF]/5 to-transparent rounded-bl-full pointer-events-none" />
          )}

          <div className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Logo / Monogram */}
              {listing.logoUrl && !imgError ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 border border-[#E8ECF4] shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                  <Image
                    src={listing.logoUrl}
                    alt={listing.name}
                    width={88}
                    height={88}
                    unoptimized
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#145BFF]/10 to-[#0D2B75]/10 border border-[#E8ECF4] text-[#0D2B75] font-black font-heading text-2xl flex items-center justify-center shrink-0">
                  {listing.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3F7FF] text-[#0D2B75] border border-[#E8ECF4]">
                    {categoryName}
                  </span>

                  {listing.legalForm && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      title={t('business.legalFormTitle', { form: listing.legalForm })}
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{listing.legalForm}</span>
                    </span>
                  )}

                  {listing.isVerified ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t('listing.verified')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsClaimModalOpen(true)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 transition-colors cursor-pointer"
                      title={t('business.unverifiedTitle')}
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('business.unverifiedBadge')}</span>
                    </button>
                  )}

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      openStatus.isOpen
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    • {openStatus.isOpen ? t('listing.openNow') : t('listing.closed')}
                    {openStatus.localTime && (
                      <span className="ml-1 opacity-85 font-medium">
                        ({t('business.localTimeLabel', { location: openStatus.locationName })} {openStatus.localTime})
                      </span>
                    )}
                  </span>
                </div>

                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0D2B75] tracking-tight leading-tight">
                  {listing.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-gray-500">
                  {listing.reviewCount > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-[#FF9F1A]">
                        <Star className="w-4 h-4 fill-[#FF9F1A] text-[#FF9F1A]" />
                        <span className="ml-1 font-extrabold text-[#0D2B75]">
                          {listing.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400 font-medium">
                        ({listing.reviewCount} {t('listing.reviews')})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="font-medium">
                        {t('business.noReviews')}
                      </span>
                    </div>
                  )}

                  <span className="text-gray-300">•</span>

                  <div className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#145BFF]" />
                    <span>
                      {[listing.postalCode, listing.city, listing.state && listing.state !== listing.city ? listing.state : null, listing.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Quick Primary Action Bar */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href={`tel:${listing.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] text-xs font-bold text-[#0D2B75] hover:bg-[#F3F7FF] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#145BFF]" />
                <span>{t('listing.call')}</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] text-xs font-bold text-[#0D2B75] hover:bg-[#F3F7FF] transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#145BFF]" />
                <span>{t('listing.directions')}</span>
              </a>

              <a
                href={listing.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer"
                style={{ backgroundColor: currentTenant.primaryColor }}
              >
                <span>{t('listing.website')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Card */}
            <section className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#145BFF] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-extrabold text-lg text-[#0D2B75]">
                  {t('business.about')}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                {localizedDescription}
              </p>
            </section>

            {/* Services & Offerings (from Database) */}
            {listing.services && listing.services.length > 0 && (
              <section className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#145BFF] flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading font-extrabold text-lg text-[#0D2B75]">
                    {t('business.servicesTitle')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4] text-xs font-semibold text-[#0D2B75]"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quality Highlights (Science-backed Trust Signals) - Only shown when verified */}
            {listing.isVerified && (
              <section className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading font-extrabold text-lg text-[#0D2B75]">
                    {t('business.highlights')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4]">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-xs text-[#0D2B75] mb-1">
                      {t('business.highlightVerified')}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {t('business.highlightVerifiedDesc')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4]">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#145BFF] flex items-center justify-center mb-2.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-xs text-[#0D2B75] mb-1">
                      {t('business.highlightDirect')}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {t('business.highlightDirectDesc')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4]">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-xs text-[#0D2B75] mb-1">
                      {t('business.highlightSpeed')}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {t('business.highlightSpeedDesc')}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Customer Reviews Section */}
            <section className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#FF9F1A] flex items-center justify-center">
                      <Star className="w-4 h-4 fill-[#FF9F1A]" />
                    </div>
                    <h2 className="font-heading font-extrabold text-lg text-[#0D2B75]">
                      {t('business.reviews')}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {listing.reviewCount > 0
                      ? `${listing.rating.toFixed(1)} / 5.0 (${listing.reviewCount} ${t('listing.reviews')})`
                      : t('business.noReviews')}
                  </p>
                </div>

                <a
                  href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                    t('business.reviewEmailSubject', { name: listing.name })
                  )}&body=${encodeURIComponent(
                    `Business: ${listing.name}\nURL: ${businessUrl}\n\nRating (1-5): \nFeedback: \n`
                  )}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#145BFF] text-white hover:bg-[#0D2B75] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('business.addReviewViaEmail')}</span>
                </a>
              </div>

              {/* Review instruction & direct action card */}
              <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4] space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#145BFF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-bold text-xs text-[#0D2B75]">
                      {t('business.howToReviewTitle')}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('business.howToReviewDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                      t('business.reviewEmailSubject', { name: listing.name })
                    )}&body=${encodeURIComponent(
                      `Business: ${listing.name}\nURL: ${businessUrl}\n\nRating (1-5): \nFeedback: \n`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{t('business.sendReviewEmailBtn')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(siteConfig.contact.email);
                      setCopiedReviewEmail(true);
                      setTimeout(() => setCopiedReviewEmail(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E8ECF4] text-xs font-bold text-[#0D2B75] transition-colors cursor-pointer"
                  >
                    {copiedReviewEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    <span>{siteConfig.contact.email}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-xs font-semibold text-[#145BFF] hover:underline px-2 py-1 cursor-pointer"
                  >
                    {t('business.viewTemplateBtn')}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Direct Inquiry & Message Card (Science-backed Primary Action) */}
            <div className="bg-gradient-to-br from-[#145BFF] to-[#0D2B75] rounded-3xl p-6 text-white shadow-lg shadow-blue-500/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-white">
                    {t('business.inquiryTitle')}
                  </h3>
                  <p className="text-[11px] text-blue-100 font-medium">
                    {t('business.inquirySubtitle')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-50 leading-relaxed font-normal">
                {t('business.inquiryPrompt', { name: listing.name })}
              </p>
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-[#0D2B75] hover:bg-blue-50 font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#145BFF]" />
                <span>
                  {t('business.sendMessageTo', { name: listing.name })}
                </span>
              </button>
            </div>

            {/* Contact & Location Card */}
            <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 shadow-xs space-y-5">
              <h3 className="font-heading font-extrabold text-base text-[#0D2B75]">
                {t('business.contactAndLocation')}
              </h3>

              {/* Address */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5 text-xs text-gray-700">
                  <MapPin className="w-4 h-4 text-[#145BFF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0D2B75]">{listing.address}</div>
                    <div className="text-gray-500">
                      {[
                        listing.postalCode,
                        listing.city,
                        listing.state && listing.state !== listing.city ? listing.state : null,
                        listing.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 ml-6 text-xs font-bold text-[#145BFF] hover:underline"
                >
                  <span>{t('business.openGoogleMaps')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Email */}
              {listing.email && (
                <>
                  <hr className="border-[#E8ECF4]" />
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-gray-700 min-w-0">
                      <Mail className="w-4 h-4 text-[#145BFF] shrink-0" />
                      <span className="truncate font-bold text-[#0D2B75]">{listing.email}</span>
                    </div>
                    <a
                      href={`mailto:${listing.email}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#145BFF] hover:bg-blue-100 font-bold transition-colors shrink-0"
                    >
                      E-Mail
                    </a>
                  </div>
                </>
              )}

              <hr className="border-[#E8ECF4]" />

              {/* Phone */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Phone className="w-4 h-4 text-[#145BFF] shrink-0" />
                  <span className="font-bold text-[#0D2B75]">{listing.phone}</span>
                </div>
                <a
                  href={`tel:${listing.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#145BFF] hover:bg-blue-100 font-bold transition-colors"
                >
                  {t('listing.call')}
                </a>
              </div>

              <hr className="border-[#E8ECF4]" />

              {/* Website */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-gray-700 min-w-0">
                  <Globe className="w-4 h-4 text-[#145BFF] shrink-0" />
                  <span className="truncate text-gray-600 font-medium">
                    {listing.website.replace('https://', '')}
                  </span>
                </div>
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FAFBFF] border border-[#E8ECF4] text-[#0D2B75] hover:text-[#145BFF] font-bold shrink-0 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Social Media Links (from Database) */}
              {listing.socialLinks && Object.entries(listing.socialLinks).some(([, url]) => Boolean(url)) && (
                <>
                  <hr className="border-[#E8ECF4]" />
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {t('business.socialProfiles')}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {Object.entries(listing.socialLinks).map(([platform, url]) => {
                        if (!url) return null;
                        const href = url.startsWith('http') ? url : `https://${url}`;
                        return (
                          <a
                            key={platform}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFBFF] hover:bg-blue-50 border border-[#E8ECF4] text-xs font-bold text-[#0D2B75] hover:text-[#145BFF] transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#145BFF]" />
                            <span className="capitalize">{platform}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Opening Hours Card */}
            <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#145BFF]" />
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75]">
                    {t('listing.openingHours')}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    openStatus.isOpen
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {openStatus.isOpen ? t('listing.openNow') : t('listing.closed')}
                </span>
              </div>

              {openStatus.localTime && (
                <div className="text-[11px] text-gray-500 mb-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    {t('business.localTimeLabel', { location: openStatus.locationName })}{' '}
                    <strong className="text-gray-700 font-mono font-bold">{openStatus.localTime}</strong> ({openStatus.dayName})
                  </span>
                </div>
              )}

              {listing.openingHoursJson && Object.keys(listing.openingHoursJson).length > 0 ? (
                <div className="space-y-1.5 border border-[#E8ECF4] rounded-2xl p-3 bg-[#FAFBFF] text-xs">
                  {[
                    { key: 'monday', day: 1 },
                    { key: 'tuesday', day: 2 },
                    { key: 'wednesday', day: 3 },
                    { key: 'thursday', day: 4 },
                    { key: 'friday', day: 5 },
                    { key: 'saturday', day: 6 },
                    { key: 'sunday', day: 0 },
                  ].map((d) => {
                    const label = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(
                      new Date(2026, 9, 18 + (d.day === 0 ? 7 : d.day))
                    );
                    const item = listing.openingHoursJson?.[d.key as keyof typeof listing.openingHoursJson];
                    return (
                      <div key={d.key} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-none">
                        <span className="font-semibold text-gray-700 capitalize">{label}</span>
                        {item && !item.closed ? (
                          <span className="font-mono text-gray-900 font-medium">{item.open} - {item.close}</span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">
                            {t('listing.closed')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4] text-xs text-gray-700 leading-relaxed font-medium">
                  {listing.hours}
                </div>
              )}
            </div>

            {/* Owner Management or Claim Card */}
            <div className="bg-gradient-to-br from-[#F3F7FF] to-white rounded-3xl border border-[#E8ECF4] p-6 shadow-xs">
              {!listing.isVerified ? (
                <>
                  <div className="flex items-center gap-2 mb-2 text-[#0D2B75]">
                    <ShieldCheck className="w-5 h-5 text-[#FF9F1A]" />
                    <h3 className="font-heading font-extrabold text-sm">
                      {t('business.claimListing')}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {t('business.claimListingDesc')}
                  </p>

                  <div className="space-y-2">
                    <a
                      href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                        t('business.claimEmailSubject', { name: listing.name })
                      )}&body=${encodeURIComponent(
                        `Business: ${listing.name}\nURL: ${businessUrl}\n\nI am the owner / representative and would like to claim this listing.\n`
                      )}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{t('business.claimEmailBtn')}</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(siteConfig.contact.email);
                          setCopiedSidebarEmail(true);
                          setTimeout(() => setCopiedSidebarEmail(false), 2000);
                        }}
                        className="font-mono text-[#0D2B75] font-semibold hover:text-[#145BFF] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSidebarEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        <span>{siteConfig.contact.email}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsClaimModalOpen(true)}
                        className="text-[#145BFF] hover:underline font-semibold cursor-pointer"
                      >
                        {t('business.instructionsBtn')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2 text-[#0D2B75]">
                    <Settings className="w-5 h-5 text-[#145BFF]" />
                    <h3 className="font-heading font-extrabold text-sm">
                      {t('business.ownerDashboard')}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {t('business.ownerUpdateNotice')}
                  </p>

                  <div className="space-y-2">
                    <a
                      href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                        t('business.updateEmailSubject', { name: listing.name })
                      )}&body=${encodeURIComponent(
                        `Business: ${listing.name}\nURL: ${businessUrl}\n\nI would like to request updates for my business profile:\n`
                      )}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] text-white font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{t('business.requestUpdatesBtn')}</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(siteConfig.contact.email);
                          setCopiedSidebarEmail(true);
                          setTimeout(() => setCopiedSidebarEmail(false), 2000);
                        }}
                        className="font-mono text-[#0D2B75] font-semibold hover:text-[#145BFF] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSidebarEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        <span>{siteConfig.contact.email}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDashboardModalOpen(true)}
                        className="text-[#145BFF] hover:underline font-semibold cursor-pointer"
                      >
                        {t('business.instructionsBtn')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Fitts's Law & Science-Backed Thumb Reach) */}
      <nav
        aria-label="Mobile Action Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8ECF4] px-4 py-2.5 pb-safe shadow-[0_-4px_20px_rgba(13,43,117,0.08)] flex items-center justify-between gap-2"
      >
        <button
          type="button"
          onClick={() => setIsInquiryModalOpen(true)}
          className="flex-1 py-3 px-3 rounded-xl bg-[#145BFF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('business.sendInquiryMobile')}</span>
        </button>

        <a
          href={`tel:${listing.phone}`}
          className="py-3 px-3.5 rounded-xl bg-blue-50 text-[#145BFF] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          title={t('listing.call')}
        >
          <Phone className="w-4 h-4" />
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-3.5 rounded-xl bg-white border border-[#E8ECF4] text-[#0D2B75] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F3F7FF] active:scale-95 transition-transform"
          title={t('listing.directions')}
        >
          <Navigation className="w-4 h-4 text-[#145BFF]" />
        </a>

        <a
          href={listing.website}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-xl bg-[#FAFBFF] border border-[#E8ECF4] text-[#0D2B75] active:scale-95 transition-transform flex items-center justify-center"
          title={t('listing.website')}
        >
          <Globe className="w-4 h-4" />
        </a>
      </nav>

      {/* Global Modals */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        listing={listing}
        primaryColor={currentTenant.primaryColor}
      />

      <ClaimListingModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        listing={listing}
        primaryColor={currentTenant.primaryColor}
      />

      <BusinessDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        listing={listing}
        primaryColor={currentTenant.primaryColor}
      />

      <CustomerInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        business={listing}
        tenantId={currentTenant.id}
        onOpenInbox={() => setIsCustomerInboxOpen(true)}
      />

      <CustomerInboxDrawer
        isOpen={isCustomerInboxOpen}
        onClose={() => setIsCustomerInboxOpen(false)}
      />

      <Footer />
    </div>
  );
};
