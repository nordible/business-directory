'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import deDict from '@/locales/de.json';
import enDict from '@/locales/en.json';
import frDict from '@/locales/fr.json';
import esDict from '@/locales/es.json';
import itDict from '@/locales/it.json';
import trDict from '@/locales/tr.json';
import zhDict from '@/locales/zh.json';
import arDict from '@/locales/ar.json';
import swDict from '@/locales/sw.json';
import jaDict from '@/locales/ja.json';
import koDict from '@/locales/ko.json';
import idDict from '@/locales/id.json';
import hiDict from '@/locales/hi.json';
import guDict from '@/locales/gu.json';
import heDict from '@/locales/he.json';
import urDict from '@/locales/ur.json';
import faDict from '@/locales/fa.json';
import { Locale, LanguageOption, SUPPORTED_LANGUAGES, SUPPORTED_LOCALES, RTL_LOCALES } from './types';
export { SUPPORTED_LANGUAGES, SUPPORTED_LOCALES, RTL_LOCALES };
export type { LanguageOption };

type Translations = typeof enDict;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Locale, Translations> = {
  en: enDict,
  de: deDict as unknown as Translations,
  fr: frDict as unknown as Translations,
  es: esDict as unknown as Translations,
  it: itDict as unknown as Translations,
  tr: trDict as unknown as Translations,
  zh: zhDict as unknown as Translations,
  ja: jaDict as unknown as Translations,
  ko: koDict as unknown as Translations,
  id: idDict as unknown as Translations,
  hi: hiDict as unknown as Translations,
  gu: guDict as unknown as Translations,
  he: heDict as unknown as Translations,
  ur: urDict as unknown as Translations,
  fa: faDict as unknown as Translations,
  ar: arDict as unknown as Translations,
  sw: swDict as unknown as Translations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getLocaleFromPath = (path: string | null): Locale | null => {
  if (!path) return null;
  const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match) {
    const code = match[1] as Locale;
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return code;
    }
  }
  return null;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [locale, setLocaleState] = useState<Locale>(() => {
    return getLocaleFromPath(pathname) || 'en';
  });

  // Keep state in sync with URL pathname
  useEffect(() => {
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale && pathLocale !== locale) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(pathLocale);
    }
  }, [pathname, locale]);

  // Update HTML document attributes for SEO and accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('nordible_lang', newLocale);
      document.cookie = `nordible_lang=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore
    }

    // Seamlessly navigate to same route with updated language parameter in URL
    if (pathname) {
      const currentPathLocale = getLocaleFromPath(pathname);
      let newPath = pathname;
      if (currentPathLocale) {
        newPath = pathname.replace(new RegExp(`^/${currentPathLocale}`), `/${newLocale}`);
      } else {
        newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`;
      }
      router.push(newPath);
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
