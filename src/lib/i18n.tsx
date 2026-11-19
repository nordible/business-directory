'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, LanguageOption, SUPPORTED_LANGUAGES, SUPPORTED_LOCALES, RTL_LOCALES, DISPLAYED_LANGUAGES } from './types';
import { getTranslation } from './translations';
export { SUPPORTED_LANGUAGES, SUPPORTED_LOCALES, RTL_LOCALES, DISPLAYED_LANGUAGES };
export type { LanguageOption };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

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
    return getTranslation(locale, path, params);
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
