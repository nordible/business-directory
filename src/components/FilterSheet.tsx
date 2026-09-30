'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { X, Check, RotateCcw } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onlyOpenNow: boolean;
  onToggleOpenNow: (open: boolean) => void;
  primaryColor: string;
  onReset: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  onlyOpenNow,
  onToggleOpenNow,
  primaryColor,
  onReset,
}) => {
  const { locale, t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{t('search.filterTitle')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto py-4 space-y-5 flex-1">
          {/* Categories */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              {t('search.allCategories')}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'text-white border-transparent shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    style={isSelected ? { backgroundColor: primaryColor } : {}}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    <span>{cat.name[locale]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick status toggle */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-800">
                {t('search.openNow')}
              </span>
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => onToggleOpenNow(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                style={{ accentColor: primaryColor }}
              />
            </label>
          </div>
        </div>

        {/* Bottom Actions - Ergonomically positioned for thumb reach */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-3 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer min-h-[48px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('search.resetFilters')}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 text-sm font-bold text-white rounded-xl shadow-md transition-transform active:scale-98 cursor-pointer min-h-[48px]"
            style={{ backgroundColor: primaryColor }}
          >
            {t('search.applyFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};
