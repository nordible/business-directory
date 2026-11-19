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

const dictionaries: Record<string, Record<string, unknown>> = {
  en: enDict as unknown as Record<string, unknown>,
  de: deDict as unknown as Record<string, unknown>,
  fr: frDict as unknown as Record<string, unknown>,
  es: esDict as unknown as Record<string, unknown>,
  it: itDict as unknown as Record<string, unknown>,
  tr: trDict as unknown as Record<string, unknown>,
  zh: zhDict as unknown as Record<string, unknown>,
  ar: arDict as unknown as Record<string, unknown>,
  sw: swDict as unknown as Record<string, unknown>,
  ja: jaDict as unknown as Record<string, unknown>,
  ko: koDict as unknown as Record<string, unknown>,
  id: idDict as unknown as Record<string, unknown>,
  hi: hiDict as unknown as Record<string, unknown>,
  gu: guDict as unknown as Record<string, unknown>,
  he: heDict as unknown as Record<string, unknown>,
  ur: urDict as unknown as Record<string, unknown>,
  fa: faDict as unknown as Record<string, unknown>,
};

/**
 * Universal Server/Client Translation Helper
 * Safely resolves nested dot-path translation keys with optional parameters and fallback to English
 */
export function getTranslation(
  locale: string = 'en',
  path: string,
  params?: Record<string, string | number>
): string {
  const normLocale = (locale || 'en').toLowerCase().trim();
  const dict = dictionaries[normLocale] || dictionaries.en;
  const keys = path.split('.');

  let current: unknown = dict;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      current = undefined;
      break;
    }
  }

  // Fallback to English if key missing in selected locale
  if (typeof current !== 'string') {
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
}
