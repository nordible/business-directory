'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import deDict from '@/locales/de.json';
import enDict from '@/locales/en.json';
import frDict from '@/locales/fr.json';
import esDict from '@/locales/es.json';
import itDict from '@/locales/it.json';
import trDict from '@/locales/tr.json';
import zhDict from '@/locales/zh.json';
import arDict from '@/locales/ar.json';
import swDict from '@/locales/sw.json';
import { Locale } from './types';

export interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

type Translations = typeof deDict;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Locale, Translations> = {
  de: deDict,
  en: enDict,
  fr: frDict as unknown as Translations,
  es: esDict as unknown as Translations,
  it: itDict as unknown as Translations,
  tr: trDict as unknown as Translations,
  zh: zhDict as unknown as Translations,
  ar: arDict as unknown as Translations,
  sw: swDict as unknown as Translations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nordible_lang') as Locale;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved);
      }
    } catch {
      // Local storage not available
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('nordible_lang', newLocale);
    } catch {
      // Ignore
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: unknown = dictionaries[locale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to English, then German
        let fallbackVal: unknown = dictionaries.en;
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = (fallbackVal as Record<string, unknown>)[fbKey];
          } else {
            fallbackVal = undefined;
            break;
          }
        }

        if (typeof fallbackVal === 'string') {
          current = fallbackVal;
          break;
        }

        return path;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    let text = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(val));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
