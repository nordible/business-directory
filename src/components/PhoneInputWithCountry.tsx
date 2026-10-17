'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { COUNTRY_DIAL_CODES, parsePhoneNumber, CountryDialCode } from '@/config/countryDialCodes';
import { useTranslation } from '@/lib/i18n';

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountryCode?: string; // e.g. 'DE' or country name
  placeholder?: string;
  className?: string;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  defaultCountryCode = 'DE',
  placeholder,
  className = '',
}) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  const defaultItem =
    COUNTRY_DIAL_CODES.find((c) => c.countryCode === defaultCountryCode.toUpperCase()) ||
    COUNTRY_DIAL_CODES[0];

  const parsed = parsePhoneNumber(value, defaultItem.dialCode);
  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(() => {
    const matched = COUNTRY_DIAL_CODES.find((c) => c.dialCode === parsed.dialCode);
    return matched || defaultItem;
  });
  const [nationalNumber, setNationalNumber] = useState<string>(parsed.nationalNumber);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when external value changes
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const updated = parsePhoneNumber(value, selectedCountry.dialCode);
    const matched = COUNTRY_DIAL_CODES.find((c) => c.dialCode === updated.dialCode);
    if (matched && matched.countryCode !== selectedCountry.countryCode) {
      setSelectedCountry(matched);
    }
    setNationalNumber(updated.nationalNumber);
  }

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelectCountry = (country: CountryDialCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const cleanNumber = nationalNumber.replace(/^0+/, '').trim();
    if (cleanNumber) {
      onChange(`${country.dialCode} ${cleanNumber}`);
    } else {
      onChange('');
    }
  };

  const handleNumberChange = (rawText: string) => {
    // If user pastes/types a number with a leading '+'
    if (rawText.trim().startsWith('+')) {
      const detected = parsePhoneNumber(rawText, selectedCountry.dialCode);
      const matched = COUNTRY_DIAL_CODES.find((c) => c.dialCode === detected.dialCode);
      if (matched) {
        setSelectedCountry(matched);
      }
      setNationalNumber(detected.nationalNumber);
      onChange(detected.nationalNumber ? `${detected.dialCode} ${detected.nationalNumber}` : '');
      return;
    }

    // Strip leading 0 in international numbers when dialing code is selected
    const cleanNumber = rawText.replace(/^[0\s]+/, (match) => (match.includes('0') ? '' : match));
    setNationalNumber(cleanNumber);
    if (cleanNumber.trim()) {
      onChange(`${selectedCountry.dialCode} ${cleanNumber.trim()}`);
    } else {
      onChange('');
    }
  };

  const handleClear = () => {
    setNationalNumber('');
    onChange('');
  };

  const filteredCountries = COUNTRY_DIAL_CODES.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.countryName.de.toLowerCase().includes(q) ||
      c.countryName.en.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.countryCode.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} className={`relative flex items-center ${className}`}>
      {/* Country Prefix Selector Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Country Code"
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-l-xl border border-r-0 border-[#E8ECF4] bg-[#FAFBFF] hover:bg-slate-100 text-slate-800 transition-colors shrink-0 h-[38px] cursor-pointer"
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <span className="font-mono text-xs text-slate-700">{selectedCountry.dialCode}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Main National Phone Input */}
      <div className="relative flex-1">
        <input
          type="tel"
          value={nationalNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder || (isDe ? '1521 1234567' : '555 123 4567')}
          className="w-full pl-3 pr-8 py-2 text-xs rounded-r-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800 h-[38px]"
        />
        {nationalNumber && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear phone number"
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Searchable Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 top-[42px] z-50 w-72 bg-white rounded-2xl border border-[#E8ECF4] shadow-2xl overflow-hidden p-2 space-y-1.5 animate-in fade-in duration-150">
          {/* Search bar inside dropdown */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isDe ? 'Land oder Vorwahl suchen...' : 'Search country or code...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#145BFF]"
            />
          </div>

          {/* List of Countries */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry.countryCode === c.countryCode;
              return (
                <button
                  key={c.countryCode}
                  type="button"
                  onClick={() => handleSelectCountry(c)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50 text-[#145BFF] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate">{isDe ? c.countryName.de : c.countryName.en}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">{c.dialCode}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#145BFF]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
