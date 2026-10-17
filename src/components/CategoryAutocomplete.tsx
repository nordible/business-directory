'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tag, Sparkles, Check, ChevronDown, Plus } from 'lucide-react';
import { Category } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface CategoryAutocompleteProps {
  value: string; // Category name or ID
  onChange: (category: { id?: string; name: string }) => void;
  placeholder?: string;
  className?: string;
}

export const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { locale, t } = useTranslation();
  const defaultPlaceholder =
    locale === 'de'
      ? 'Branche suchen oder neu eingeben...'
      : 'Search category or type new...';
  const effectivePlaceholder = placeholder || defaultPlaceholder;

  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories.filter((c: Category) => c.slug !== 'all'));
        }
      })
      .catch(() => {
        // Fallback silently handled
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value || '');
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((c) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const nameDe = c.name?.de?.toLowerCase() || '';
    const nameEn = c.name?.en?.toLowerCase() || '';
    const slug = c.slug.toLowerCase();
    return nameDe.includes(q) || nameEn.includes(q) || slug.includes(q);
  });

  const exactMatch = categories.find((c) => {
    const q = query.toLowerCase().trim();
    return (
      c.name?.de?.toLowerCase() === q ||
      c.name?.en?.toLowerCase() === q ||
      c.slug.toLowerCase() === q
    );
  });

  const handleSelect = (category: Category) => {
    const key = `categories.${category.slug}`;
    const translated = t(key);
    const name = (translated && translated !== key)
      ? translated
      : (category.name?.en || (locale === 'de' ? category.name?.de : category.name?.en) || category.slug);
    setQuery(name);
    onChange({ id: category.id, name });
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onChange({ name: trimmed });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onChange({ name: e.target.value });
          }}
          placeholder={effectivePlaceholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#E8ECF4] shadow-xl max-h-60 overflow-y-auto p-1.5 space-y-1">
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs bg-blue-50/70 hover:bg-blue-100/70 text-[#145BFF] font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 shrink-0 text-[#145BFF]" />
              <div className="flex-1 truncate">
                <span>{locale === 'de' ? 'Neu anlegen: ' : '✨ Create new: '}</span>
                <span className="underline">{query.trim()}</span>
              </div>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}

          {filteredCategories.length === 0 && !query.trim() ? (
            <div className="px-3 py-3 text-center text-xs text-gray-400">
              {locale === 'de'
                ? 'Beginnen Sie mit der Eingabe einer Branche...'
                : 'Start typing an industry or category...'}
            </div>
          ) : (
            filteredCategories.map((c) => {
              const key = `categories.${c.slug}`;
              const translated = t(key);
              const displayName = (translated && translated !== key)
                ? translated
                : (c.name?.en || (locale === 'de' ? c.name?.de : c.name?.en) || c.slug);
              const isSelected = query.toLowerCase().trim() === displayName.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAFBFF] text-[#145BFF] font-bold'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="truncate">{displayName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#145BFF]" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
