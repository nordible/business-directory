'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[] | number[];
  primaryColor?: string;
  className?: string;
  showItemCount?: boolean;
  showPageSizeSelector?: boolean;
}

/**
 * Generates an array of page numbers and ellipsis tokens for smart pagination display.
 * Keeps at most 7 interactive slots for consistent width and cognitive ease (Miller's Law).
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near the start
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  // Near the end
  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // Somewhere in the middle
  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 20, 50],
  primaryColor = '#145BFF',
  className = '',
  showItemCount = true,
  showPageSizeSelector = true,
}) => {
  const { t } = useTranslation();

  if (totalItems <= 0) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const paginationRange = getPaginationRange(safeCurrentPage, totalPages);

  const handlePrev = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handleFirst = () => {
    if (safeCurrentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (safeCurrentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label={t('pagination.ariaLabel')}
      className={`w-full py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-nordible-border pt-6 select-none ${className}`}
    >
      {/* Left Metadata: Item Range & Optional Page Size Selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
        {showItemCount && (
          <p className="text-xs font-semibold text-slate-500 font-sans tracking-tight">
            {t('pagination.showing', {
              start: startItem,
              end: endItem,
              total: totalItems,
            })}
          </p>
        )}

        {showPageSizeSelector && onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-xl border border-nordible-border shadow-2xs">
            <label htmlFor="pagination-page-size" className="text-[11px] font-bold text-slate-500">
              {t('pagination.perPage')}:
            </label>
            <select
              id="pagination-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent font-bold text-nordible-dark focus:outline-none cursor-pointer py-0.5 text-xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Controls: Ergonomic Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* First Page Button (Desktop) */}
          <button
            type="button"
            onClick={handleFirst}
            disabled={safeCurrentPage === 1}
            aria-disabled={safeCurrentPage === 1}
            aria-label={t('pagination.first')}
            className={`hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl border border-nordible-border bg-white text-nordible-dark shadow-2xs transition-colors active:scale-95 cursor-pointer hover:border-nordible-blue/30 hover:bg-nordible-section-bg ${
              safeCurrentPage === 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={safeCurrentPage === 1}
            aria-disabled={safeCurrentPage === 1}
            aria-label={t('pagination.prevAria')}
            className={`inline-flex items-center gap-1 px-3 sm:px-3.5 h-10 sm:h-9 rounded-xl border border-nordible-border bg-white text-nordible-dark text-xs font-bold shadow-2xs transition-colors active:scale-95 cursor-pointer hover:border-nordible-blue/30 hover:bg-nordible-section-bg ${
              safeCurrentPage === 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{t('pagination.previous')}</span>
          </button>

          {/* Mobile Current Page Indicator */}
          <div className="sm:hidden px-3 py-1.5 rounded-xl bg-white border border-nordible-border text-xs font-bold text-nordible-dark shadow-2xs">
            <span>
              {safeCurrentPage} / {totalPages}
            </span>
          </div>

          {/* Desktop Page Numbers & Ellipses */}
          <div className="hidden sm:flex items-center gap-1">
            {paginationRange.map((page, idx) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    aria-hidden="true"
                    className="w-9 h-9 flex items-center justify-center text-slate-400"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                );
              }

              const isCurrent = page === safeCurrentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={
                    isCurrent
                      ? t('pagination.currentPageAria', { page })
                      : t('pagination.pageAria', { page })
                  }
                  className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-colors active:scale-95 cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'text-white shadow-xs'
                      : 'bg-white border border-nordible-border text-nordible-dark hover:bg-nordible-section-bg hover:border-nordible-blue/30 shadow-2xs'
                  }`}
                  style={isCurrent ? { backgroundColor: primaryColor } : {}}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={safeCurrentPage === totalPages}
            aria-disabled={safeCurrentPage === totalPages}
            aria-label={t('pagination.nextAria')}
            className={`inline-flex items-center gap-1 px-3 sm:px-3.5 h-10 sm:h-9 rounded-xl border border-nordible-border bg-white text-nordible-dark text-xs font-bold shadow-2xs transition-colors active:scale-95 cursor-pointer hover:border-nordible-blue/30 hover:bg-nordible-section-bg ${
              safeCurrentPage === totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <span className="hidden sm:inline">{t('pagination.next')}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Last Page Button (Desktop) */}
          <button
            type="button"
            onClick={handleLast}
            disabled={safeCurrentPage === totalPages}
            aria-disabled={safeCurrentPage === totalPages}
            aria-label={t('pagination.last')}
            className={`hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl border border-nordible-border bg-white text-nordible-dark shadow-2xs transition-colors active:scale-95 cursor-pointer hover:border-nordible-blue/30 hover:bg-nordible-section-bg ${
              safeCurrentPage === totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};
