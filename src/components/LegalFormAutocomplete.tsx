'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ChevronDown, Check, Plus, X } from 'lucide-react';
import { LegalForm } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface LegalFormAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LegalFormAutocomplete: React.FC<LegalFormAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  const defaultPlaceholder = isDe
    ? 'Rechtsform wählen oder frei eingeben (z. B. GmbH, LLC, Ltd...)'
    : 'Select legal form or type custom (e.g. LLC, Ltd, GmbH...)';
  const effectivePlaceholder = placeholder || defaultPlaceholder;

  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value || '');
  }

  // Fetch legal forms from API (falls back to defaults if DB unavailable)
  useEffect(() => {
    let isMounted = true;
    fetch('/api/legal-forms')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.legalForms && Array.isArray(data.legalForms)) {
          setLegalForms(data.legalForms);
        }
      })
      .catch(() => {
        // Fallback handled by API
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredForms = legalForms.filter((f) => {
    if (!trimmedQuery) return true;
    const nameMatch = f.name.toLowerCase().includes(trimmedQuery);
    const codeMatch = f.code.toLowerCase().includes(trimmedQuery);
    const countryMatch = f.countryCode?.toLowerCase().includes(trimmedQuery);
    return nameMatch || codeMatch || countryMatch;
  });

  const exactMatch = legalForms.find(
    (f) =>
      f.name.toLowerCase() === trimmedQuery ||
      f.code.toLowerCase() === trimmedQuery
  );

  const handleSelect = (formName: string) => {
    setQuery(formName);
    onChange(formName);
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    const clean = query.trim();
    if (!clean) return;
    onChange(clean);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Briefcase className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            onChange(val);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (query.trim()) {
                handleCustomSubmit();
              }
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={effectivePlaceholder}
          className="w-full pl-8 pr-14 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800 transition-colors"
        />

        <div className="absolute right-2 top-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear legal form"
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle legal forms list"
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#E8ECF4] shadow-xl max-h-60 overflow-y-auto p-1.5 space-y-1">
          {/* Custom option prompt if user typed something that isn't an exact match */}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs bg-blue-50/70 hover:bg-blue-100/70 text-[#145BFF] font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
              <span className="truncate">
                {isDe ? `„${query.trim()}“ als Rechtsform übernehmen` : `Use "${query.trim()}" as legal form`}
              </span>
            </button>
          )}

          {/* List of DB / Default Legal Forms */}
          {filteredForms.length > 0 ? (
            filteredForms.map((item) => {
              const isSelected = value?.trim().toLowerCase() === item.name.toLowerCase();
              return (
                <button
                  key={`${item.code}-${item.countryCode || 'INT'}`}
                  type="button"
                  onClick={() => handleSelect(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-[#145BFF] font-bold'
                      : 'hover:bg-gray-50 text-gray-700 font-medium'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.countryCode && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                        {item.countryCode}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#145BFF]" />}
                  </div>
                </button>
              );
            })
          ) : (
            !query.trim() && (
              <div className="px-3 py-3 text-center text-xs text-gray-400">
                {isDe ? 'Keine Optionen gefunden' : 'No legal forms found'}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
