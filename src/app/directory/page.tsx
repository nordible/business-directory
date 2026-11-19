'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TenantBranding, BusinessListing, Category } from '@/lib/types';
import {
  DEFAULT_TENANT,
  DEFAULT_CATEGORIES,
  getAllBusinesses,
  getCategories,
  getDefaultTenant,
} from '@/lib/db/client';
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
import { Pagination } from '@/components/Pagination';
import { siteConfig } from '@/config/site';
import { Search, SlidersHorizontal, Sparkles, ArrowRight, ArrowLeft, X, Globe } from 'lucide-react';

interface DirectoryAppPageProps {
  initialListings?: BusinessListing[];
  initialTenant?: TenantBranding;
  initialCategories?: Category[];
}

function DirectoryAppContent({
  initialListings = [],
  initialTenant = DEFAULT_TENANT,
  initialCategories = DEFAULT_CATEGORIES,
}: DirectoryAppPageProps) {
  const { locale, t } = useTranslation();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get('q') || searchParams.get('query') || '';
  const pageFromUrl = searchParams.get('page');
  const catFromUrl = searchParams.get('category') || searchParams.get('cat') || 'cat-all';

  const [currentTenant, setCurrentTenant] = useState<TenantBranding>(initialTenant);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [listings, setListings] = useState<BusinessListing[]>(initialListings);

  React.useEffect(() => {
    if (initialListings.length === 0) {
      getAllBusinesses().then((data) => {
        if (data.length > 0) setListings(data);
      });
    }
    if (initialCategories.length <= 1) {
      getCategories().then((cats) => {
        if (cats.length > 0) setCategories(cats);
      });
    }
    getDefaultTenant().then((tnt) => {
      if (tnt) setCurrentTenant(tnt);
    });
  }, [initialListings.length, initialCategories.length]);

  // Synchronize search query with URL search parameter
  const [searchQuery, setSearchQuery] = useState(qFromUrl);
  const [prevQFromUrl, setPrevQFromUrl] = useState(qFromUrl);
  if (qFromUrl !== prevQFromUrl) {
    setPrevQFromUrl(qFromUrl);
    setSearchQuery(qFromUrl);
  }

  // Synchronize category with URL parameter
  const [selectedCategory, setSelectedCategory] = useState(catFromUrl);
  const [prevCatFromUrl, setPrevCatFromUrl] = useState(catFromUrl);
  if (catFromUrl !== prevCatFromUrl) {
    setPrevCatFromUrl(catFromUrl);
    setSelectedCategory(catFromUrl);
  }

  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<BusinessListing | null>(null);
  const [dashboardTarget, setDashboardTarget] = useState<BusinessListing | null>(null);
  const [reviewTarget, setReviewTarget] = useState<BusinessListing | null>(null);

  // Pagination state synced with URL parameter
  const parsedPage = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  const initialPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [prevPageFromUrl, setPrevPageFromUrl] = useState(pageFromUrl);
  if (pageFromUrl !== prevPageFromUrl) {
    setPrevPageFromUrl(pageFromUrl);
    setCurrentPage(initialPage);
  }

  const [pageSize, setPageSize] = useState<number>(siteConfig.pagination.directoryPageSize);
  const resultsTopRef = React.useRef<HTMLDivElement>(null);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (catId && catId !== 'cat-all') {
        url.searchParams.set('category', catId);
      } else {
        url.searchParams.delete('category');
      }
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (query.trim()) {
        url.searchParams.set('q', query.trim());
      } else {
        url.searchParams.delete('q');
      }
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleClearSearch = () => {
    handleSearchChange('');
  };

  const handleToggleOpenNow = (open: boolean) => {
    setOnlyOpenNow(open);
    setCurrentPage(1);
  };

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
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesSlug = item.slug ? item.slug.toLowerCase().includes(query) : false;
        const matchesCategory = item.categoryName ? item.categoryName.toLowerCase().includes(query) : false;
        const descText =
          typeof item.description === 'string'
            ? item.description
            : (item.description as Record<string, string>)?.[locale] ||
              (item.description as Record<string, string>)?.[locale === 'de' ? 'de' : 'en'] ||
              (item.description as Record<string, string>)?.[locale === 'de' ? 'en' : 'de'] ||
              '';
        const matchesDesc = descText.toLowerCase().includes(query);
        return matchesName || matchesCity || matchesDesc || matchesSlug || matchesCategory;
      }

      return true;
    });
  }, [listings, currentTenant.id, selectedCategory, onlyOpenNow, searchQuery, locale]);

  // Derived pagination calculations
  const totalItems = filteredListings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedListings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredListings.slice(startIndex, startIndex + pageSize);
  }, [filteredListings, safeCurrentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newPage > 1) {
        url.searchParams.set('page', String(newPage));
      } else {
        url.searchParams.delete('page');
      }
      window.history.replaceState({}, '', url.toString());
    }
    if (resultsTopRef.current) {
      resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url.toString());
    }
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

  const activeFilterCount = (selectedCategory !== 'cat-all' ? 1 : 0) + (onlyOpenNow ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('cat-all');
    setOnlyOpenNow(false);
    setSearchQuery('');
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      url.searchParams.delete('q');
      url.searchParams.delete('query');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId || c.slug === catId);
    if (!found) return catId;
    const key = `categories.${found.slug}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return found.name['en'] || (locale === 'de' ? found.name['de'] : found.name['en']) || catId;
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-nordible-bg">
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
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-nordible-blue transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-nordible-border flex items-center justify-center group-hover:border-nordible-blue/30">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-nordible-blue" />
            </div>
            <span>{t('directory.backToOverview')}</span>
          </Link>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-nordible-blue" />
            <span>{t('directory.badgeTitle')}</span>
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-nordible-blue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Mascot */}
            <div className="mb-3">
              <div className="w-12 h-12 drop-shadow-md">
                <Mascot variant="hero-wave" alt="Nordible Mascot" priority />
              </div>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-nordible-dark tracking-tight leading-tight">
              {currentTenant.name}
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl font-medium">
              {currentTenant.tagline[locale] || (locale === 'de' ? currentTenant.tagline['de'] : currentTenant.tagline['en'] || t('nav.tagline'))}
            </p>

            {/* Ergonomic Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (resultsTopRef.current) {
                  resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-6 w-full max-w-2xl flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-nordible-border shadow-md hover:border-nordible-blue/30 transition-colors"
            >
              <div className="flex items-center flex-1 pl-3 text-gray-400">
                <Search className="w-5 h-5 mr-2 shrink-0 text-nordible-blue" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full py-2 bg-transparent text-sm text-gray-900 focus:outline-none placeholder-gray-400 font-medium"
                />
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Desktop filter button */}
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-nordible-border bg-nordible-bg text-xs font-bold text-nordible-dark hover:bg-nordible-section-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-nordible-blue" />
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

              {/* Add Business CTA in Search Row */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-nordible-blue hover:bg-nordible-dark text-white text-xs font-extrabold shadow-sm transition-colors active:scale-95 cursor-pointer shrink-0"
                title={t('landing.ctaAdd')}
              >
                <Sparkles className="w-3.5 h-3.5 text-nordible-orange" />
                <span>{t('landing.ctaAdd')}</span>
              </button>
            </form>

            {/* Category Quick Chips */}
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto py-1 max-w-full scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const key = `categories.${cat.slug}`;
                const translated = t(key);
                const displayName =
                  translated && translated !== key
                    ? translated
                    : (cat.name['en'] || (locale === 'de' ? cat.name['de'] : cat.name['en']) || cat.slug);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white border-transparent shadow-xs'
                        : 'bg-white border-nordible-border text-nordible-dark hover:bg-nordible-section-bg'
                    }`}
                    style={isActive ? { backgroundColor: currentTenant.primaryColor } : {}}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Directory Results Header */}
        <div ref={resultsTopRef} className="flex items-center justify-between mb-4 px-1 gap-2 scroll-mt-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-nordible-blue text-xs font-bold border border-blue-200/60">
                <span>&ldquo;{searchQuery.trim()}&rdquo;</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-nordible-dark cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-nordible-blue hover:underline cursor-pointer"
              >
                {t('search.resetFilters')}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-nordible-blue hover:text-nordible-dark bg-white hover:bg-nordible-section-bg px-3.5 py-1.5 rounded-xl border border-blue-200/80 shadow-2xs transition-colors active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-nordible-orange" />
            <span>{t('landing.ctaAdd')}</span>
          </button>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {paginatedListings.map((listing: BusinessListing) => (
                <BusinessCard
                  key={listing.id}
                  listing={listing}
                  categoryName={getCategoryName(listing.categoryId)}
                  primaryColor={currentTenant.primaryColor}
                  onClaimListing={(item) => setClaimTarget(item)}
                  onOpenDashboard={(item) => setDashboardTarget(item)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={siteConfig.pagination.directoryPageSizeOptions}
              primaryColor={currentTenant.primaryColor}
              className="mt-8"
            />
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-nordible-border p-8 sm:p-12 text-center max-w-md mx-auto my-10 shadow-xs">
            <div className="w-24 h-24 mx-auto mb-4">
              <Mascot variant="working-laptop" alt={t('directory.emptyTitle')} />
            </div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-nordible-dark">
              {t('directory.emptyTitle')}
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
              {t('directory.emptyDesc')}
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
        <section className="mt-16 bg-gradient-to-r from-nordible-dark via-nordible-blue/85 to-nordible-dark rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-xl">
              <Mascot variant="celebrate" alt={`${siteConfig.appName} Business Directory`} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                {t('directory.ctaCardTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed font-medium">
                {t('directory.ctaCardDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-nordible-orange hover:bg-amber-400 text-nordible-dark font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('landing.ctaAdd')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer showPromo={true} />

      <BottomNav
        primaryColor={currentTenant.primaryColor}
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onOpenAiModal={() => setIsAddModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        onlyOpenNow={onlyOpenNow}
        onToggleOpenNow={handleToggleOpenNow}
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

export default function DirectoryAppPage(props: DirectoryAppPageProps) {
  return (
    <React.Suspense fallback={null}>
      <DirectoryAppContent {...props} />
    </React.Suspense>
  );
}
