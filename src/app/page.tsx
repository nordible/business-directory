'use client';

import React, { useState, useMemo } from 'react';
import { INITIAL_TENANTS, CATEGORIES, MOCK_LISTINGS } from '@/lib/mockData';
import { TenantBranding, BusinessListing } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FilterSheet } from '@/components/FilterSheet';
import { BusinessCard } from '@/components/BusinessCard';
import { TenantCustomizer } from '@/components/TenantCustomizer';
import { AiListingModal } from '@/components/AiListingModal';
import { ClaimListingModal } from '@/components/ClaimListingModal';
import { BusinessDashboardModal } from '@/components/BusinessDashboardModal';
import { ReviewModal } from '@/components/ReviewModal';
import { PricingModal } from '@/components/PricingModal';
import { DomainSettingsModal } from '@/components/DomainSettingsModal';
import { Search, SlidersHorizontal, Building2, Sparkles, CreditCard } from 'lucide-react';

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

export default function DirectoryPage() {
  const { locale, t } = useTranslation();

  // Multi-tenant state
  const [tenants, setTenants] = useState<TenantBranding[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<TenantBranding>(getInitialTenant);

  // Listings state (starts with mock, supports AI additions)
  const [listings, setListings] = useState<BusinessListing[]>(MOCK_LISTINGS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  // Modals state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isDomainSettingsOpen, setIsDomainSettingsOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<BusinessListing | null>(null);
  const [dashboardTarget, setDashboardTarget] = useState<BusinessListing | null>(null);
  const [reviewTarget, setReviewTarget] = useState<BusinessListing | null>(null);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item: BusinessListing) => {
      // Tenant match (or all if general)
      const matchesTenant = item.tenantId === currentTenant.id;
      if (!matchesTenant) return false;

      // Category match
      if (selectedCategory !== 'cat-all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Open now filter
      if (onlyOpenNow && !item.isOpenNow) {
        return false;
      }

      // Query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesDesc = item.description[locale].toLowerCase().includes(query);
        return matchesName || matchesCity || matchesDesc;
      }

      return true;
    });
  }, [listings, currentTenant.id, selectedCategory, onlyOpenNow, searchQuery, locale]);

  const handleListingCreated = (newListing: BusinessListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

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

  // Active filter count for badge
  const activeFilterCount = (selectedCategory !== 'cat-all' ? 1 : 0) + (onlyOpenNow ? 1 : 0);

  const handleSaveTenant = (updated: TenantBranding) => {
    setCurrentTenant(updated);
    setTenants((prev) =>
      prev.map((tItem) => (tItem.id === updated.id ? updated : tItem))
    );
  };

  const handleSaveDomain = (customDomain: string) => {
    handleSaveTenant({
      ...currentTenant,
      customDomain,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('cat-all');
    setOnlyOpenNow(false);
    setSearchQuery('');
  };

  const getCategoryName = (catId: string) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.name[locale] : catId;
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-8">
      {/* Dynamic CSS variable for primary branding color */}
      <style jsx global>{`
        :root {
          --tenant-primary: ${currentTenant.primaryColor};
          --tenant-accent: ${currentTenant.accentColor};
        }
      `}</style>

      {/* Top Header */}
      <Header
        currentTenant={currentTenant}
        tenants={tenants}
        onSelectTenant={(selected) => {
          setCurrentTenant(selected);
          handleResetFilters();
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-10">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white shadow-xs"
            style={{ backgroundColor: currentTenant.primaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentTenant.logoText}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {currentTenant.name}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            {currentTenant.tagline[locale]}
          </p>

          {/* Search bar with instant ergonomics */}
          <div className="mt-6 flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-md">
            <div className="flex items-center flex-1 pl-3 text-gray-400">
              <Search className="w-5 h-5 mr-2 shrink-0 text-gray-500" />
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
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span>{t('search.filterButton')}</span>
              {activeFilterCount > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: currentTenant.primaryColor }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Quick Chips */}
          <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto py-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  style={isActive ? { backgroundColor: currentTenant.primaryColor } : {}}
                >
                  {cat.name[locale]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Directory Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t('search.resultsFound', { count: filteredListings.length })}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
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
          <div className="bg-white rounded-3xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-8">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">Keine Einträge gefunden</h3>
            <p className="text-xs text-gray-500 mt-1">
              Versuchen Sie, Ihre Filter anzupassen oder einen anderen Suchbegriff einzugeben.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 text-xs font-bold text-white rounded-xl cursor-pointer"
              style={{ backgroundColor: currentTenant.primaryColor }}
            >
              {t('search.resetFilters')}
            </button>
          </div>
        )}

        {/* White-Label Banner for Directory Entrepreneurs */}
        <section className="mt-12 bg-linear-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-400">
              White-Label Business Directory
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Starten Sie Ihr eigenes Branchenverzeichnis
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg">
              Vollständig unter Ihrer eigenen Marke (Domain, Logo, Farben, Kategorien) mit modernster, mobiler Nutzerführung.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('pricing.title')}</span>
            </button>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer"
            >
              {t('brand.customizeBrand')}
            </button>
          </div>
        </section>
      </main>

      {/* Science-backed UX: Bottom Navigation Bar for Mobile */}
      <BottomNav
        primaryColor={currentTenant.primaryColor}
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Filter Bottom Sheet */}
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

      {/* Tenant White-Label Customizer Modal */}
      <TenantCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTenant={currentTenant}
        onSaveTenant={handleSaveTenant}
      />

      {/* AI Listing Ingestion Bottom Sheet Modal */}
      <AiListingModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        categories={CATEGORIES}
        currentTenantId={currentTenant.id}
        primaryColor={currentTenant.primaryColor}
        onListingCreated={handleListingCreated}
      />

      {/* Claim Listing Modal */}
      <ClaimListingModal
        isOpen={Boolean(claimTarget)}
        onClose={() => setClaimTarget(null)}
        listing={claimTarget}
        primaryColor={currentTenant.primaryColor}
        onListingClaimed={handleListingClaimed}
        onOpenDashboard={(item) => setDashboardTarget(item)}
      />

      {/* Business Owner Dashboard Modal */}
      <BusinessDashboardModal
        isOpen={Boolean(dashboardTarget)}
        onClose={() => setDashboardTarget(null)}
        listing={dashboardTarget}
        primaryColor={currentTenant.primaryColor}
        onSaveListing={handleSaveListing}
      />

      {/* Reviews & Ratings Modal */}
      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        listing={reviewTarget}
        primaryColor={currentTenant.primaryColor}
        onReviewAdded={handleReviewAdded}
      />

      {/* SaaS Pricing & Subscription Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        primaryColor={currentTenant.primaryColor}
        onOpenDomainSettings={() => setIsDomainSettingsOpen(true)}
      />

      {/* Custom Domain & SSL Provisioning Modal */}
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
