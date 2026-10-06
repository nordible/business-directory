'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Compass, SlidersHorizontal, PlusCircle } from 'lucide-react';

interface BottomNavProps {
  primaryColor: string;
  onOpenFilters: () => void;
  onOpenAiModal: () => void;
  activeFilterCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  primaryColor,
  onOpenFilters,
  onOpenAiModal,
  activeFilterCount,
}) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8ECF4] px-4 py-2 pb-safe shadow-[0_-4px_20px_rgba(13,43,117,0.08)]"
    >
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Explore Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] text-[#0D2B75] hover:text-[#145BFF] active:scale-95 transition-transform cursor-pointer"
        >
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-bold leading-none">{t('nav.explore')}</span>
        </button>

        {/* Filter / Search Button with thumb reach */}
        <button
          onClick={onOpenFilters}
          className="relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] text-[#0D2B75] hover:text-[#145BFF] active:scale-95 transition-transform cursor-pointer"
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5 mb-1" />
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1 -right-2 text-[10px] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold leading-none">{t('nav.search')}</span>
        </button>

        {/* Add Listing Button */}
        <button
          onClick={onOpenAiModal}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] text-[#0D2B75] hover:text-[#145BFF] active:scale-95 transition-transform cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 mb-1 text-[#145BFF]" />
          <span className="text-[11px] font-bold leading-none">{t('nav.addListing')}</span>
        </button>
      </div>
    </nav>
  );
};
