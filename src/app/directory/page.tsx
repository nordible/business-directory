'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { INITIAL_TENANTS, CATEGORIES, MOCK_LISTINGS } from '@/lib/mockData';
import { TenantBranding, BusinessListing } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { FilterSheet } from '@/components/FilterSheet';
import { BusinessCard } from '@/components/BusinessCard';
import { AddListingModal } from '@/components/AddListingModal';
import { ClaimListingModal } from '@/components/ClaimListingModal';
import { BusinessDashboardModal } from '@/components/BusinessDashboardModal';
import { ReviewModal } from '@/components/ReviewModal';
import { Mascot } from '@/components/mascot/Mascot';
import { siteConfig } from '@/config/site';
import { Search, SlidersHorizontal, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

function getInitialTenant(): TenantBranding {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const targetSlug = tenantParam || subdomain;
    const matched = INITIAL_TENANTS.find(
      (tItem) => tItem.slug === targetSlug || tItem.id === targetSlug
    );
    if (matched) return matched;
  }
  return INITIAL_TENANTS[0];
}

export default function DirectoryAppPage() {
  const { locale, t } = useTranslation();
  const isDe = locale === 'de';

  const [currentTenant] = useState<TenantBranding>(getInitialTenant);
  const [listings, setListings] = useState<BusinessListing[]>(MOCK_LISTINGS);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<BusinessListing | null>(null);
  const [dashboardTarget, setDashboardTarget] = useState<BusinessListing | null>(null);
  const [reviewTarget, setReviewTarget] = useState<BusinessListing | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter((item: BusinessListing) => {
      const matchesTenant = item.tenantId === currentTenant.id;
      if (!matchesTenant) return false;

      if (selectedCategory !== 'cat-all' && item.categoryId !== selectedCategory) {
        return false;
      }

      if (onlyOpenNow && !item.isOpenNow) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const descText = item.description[locale] || item.description['de'] || '';
        const matchesDesc = descText.toLowerCase().includes(query);
        return matchesName || matchesCity || matchesDesc;
      }

      return true;
    });
  }, [listings, currentTenant.id, selectedCategory, onlyOpenNow, searchQuery, locale]);

  const handleListingClaimed = (claimedId: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === claimedId ? { ...item, isVerified: true } : item))
    );
  };

  const handleSaveListing = (updated: BusinessListing) => {
    setListings((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleReviewAdded = (listingId: string, newRating: number, newCount: number) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? { ...item, rating: newRating, reviewCount: newCount }
          : item
      )
    );
  };

  const activeFilterCount = (selectedCategory !== 'cat-all' ? 1 : 0) + (onlyOpenNow ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('cat-all');
    setOnlyOpenNow(false);
    setSearchQuery('');
  };

  const getCategoryName = (catId: string) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.name[locale] || found.name['de'] : catId;
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-[#FAFBFF]">
      <style jsx global>{`
        :root {
          --tenant-primary: ${currentTenant.primaryColor};
          --tenant-accent: ${currentTenant.accentColor};
        }
      `}</style>

      {/* Top Header */}
      <Header
        currentTenant={currentTenant}
        onOpenAiModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-10">
        {/* Navigation Breadcrumb / Back to Home link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#145BFF] transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-[#E8ECF4] flex items-center justify-center group-hover:border-[#145BFF]/30">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#145BFF]" />
            </div>
            <span>{isDe ? '← Zurück zur Startseite' : '← Back to Overview'}</span>
          </Link>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            📍 Frankfurt am Main & Metropolregionen
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#145BFF]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Mascot Badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 drop-shadow-md">
                <Mascot variant="hero-wave" alt="Nordible Mascot" priority />
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: currentTenant.primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentTenant.logoText}</span>
              </div>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#0D2B75] tracking-tight leading-tight">
              {currentTenant.name}
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl font-medium">
              {currentTenant.tagline[locale] || currentTenant.tagline['de']}
            </p>

            {/* Ergonomic Search Bar */}
            <div className="mt-6 w-full max-w-2xl flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E8ECF4] shadow-md hover:border-[#145BFF]/30 transition-all">
              <div className="flex items-center flex-1 pl-3 text-gray-400">
                <Search className="w-5 h-5 mr-2 shrink-0 text-[#145BFF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full py-2 bg-transparent text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-medium"
                />
              </div>

              {/* Desktop filter button */}
              <button
                onClick={() => setIsFilterSheetOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] text-xs font-bold text-[#0D2B75] hover:bg-[#F3F7FF] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#145BFF]" />
                <span>{t('search.filterButton')}</span>
                {activeFilterCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: currentTenant.primaryColor }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Category Quick Chips */}
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto py-1 max-w-full scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white border-transparent shadow-xs'
                        : 'bg-white border-[#E8ECF4] text-[#0D2B75] hover:bg-[#F3F7FF]'
                    }`}
                    style={isActive ? { backgroundColor: currentTenant.primaryColor } : {}}
                  >
                    {cat.name[locale] || cat.name['de']}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Directory Results Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-xs font-extrabold text-[#0D2B75]/70 uppercase tracking-wider font-heading">
            {t('search.resultsFound', { count: filteredListings.length })}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#145BFF] hover:underline cursor-pointer"
            >
              {t('search.resetFilters')}
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredListings.map((listing: BusinessListing) => (
              <BusinessCard
                key={listing.id}
                listing={listing}
                categoryName={getCategoryName(listing.categoryId)}
                primaryColor={currentTenant.primaryColor}
                onClaimListing={(item) => setClaimTarget(item)}
                onOpenDashboard={(item) => setDashboardTarget(item)}
                onOpenReviews={(item) => setReviewTarget(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-8 sm:p-12 text-center max-w-md mx-auto my-10 shadow-xs">
            <div className="w-24 h-24 mx-auto mb-4">
              <Mascot variant="working-laptop" alt="Keine Einträge gefunden" />
            </div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#0D2B75]">
              Keine Einträge gefunden
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
              Versuchen Sie, Ihre Filter anzupassen oder einen anderen Suchbegriff einzugeben.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              style={{ backgroundColor: currentTenant.primaryColor }}
            >
              {t('search.resetFilters')}
            </button>
          </div>
        )}

        {/* Bottom Banner: Directory Listing CTA */}
        <section className="mt-16 bg-gradient-to-r from-[#0D2B75] via-[#145BFF]/85 to-[#0D2B75] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
              <Mascot variant="celebrate" alt={`${siteConfig.appName} Business Directory`} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold tracking-wider uppercase text-[#FF9F1A]">
                100% Verifiziert • Weltweit • Offen für alle Branchen
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                Ist Ihr Unternehmen noch nicht in {siteConfig.appName} gelistet?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed font-medium">
                Präsentieren Sie Ihre Leistungen, Adresse und Kontaktdaten vor Kunden und Partnern rund um die Welt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unternehmen jetzt eintragen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <BottomNav
        primaryColor={currentTenant.primaryColor}
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onOpenAiModal={() => setIsAddModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyOpenNow={onlyOpenNow}
        onToggleOpenNow={setOnlyOpenNow}
        primaryColor={currentTenant.primaryColor}
        onReset={handleResetFilters}
      />

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        primaryColor={currentTenant.primaryColor}
      />

      <ClaimListingModal
        isOpen={Boolean(claimTarget)}
        onClose={() => setClaimTarget(null)}
        listing={claimTarget}
        primaryColor={currentTenant.primaryColor}
        onListingClaimed={handleListingClaimed}
        onOpenDashboard={(item) => setDashboardTarget(item)}
      />

      <BusinessDashboardModal
        isOpen={Boolean(dashboardTarget)}
        onClose={() => setDashboardTarget(null)}
        listing={dashboardTarget}
        primaryColor={currentTenant.primaryColor}
        onSaveListing={handleSaveListing}
      />

      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        listing={reviewTarget}
        primaryColor={currentTenant.primaryColor}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
}
