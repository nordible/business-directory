export type Locale = 'de' | 'en' | 'fr' | 'es' | 'it' | 'tr' | 'zh' | 'ar' | 'sw';

export interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

export const SUPPORTED_LOCALES: Locale[] = ['en', 'de', 'fr', 'es', 'it', 'tr', 'zh', 'ar', 'sw'];

export type LocalizedString = Record<string, string>;

export interface TenantBranding {
  id: string;
  slug: string;
  name: string;
  tagline: LocalizedString;
  primaryColor: string;
  accentColor: string;
  logoText: string;
  customDomain?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  icon: string;
}

export interface BusinessListing {
  id: string;
  tenantId: string;
  name: string;
  categoryId: string;
  description: LocalizedString;
  address: string;
  city: string;
  phone: string;
  website: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpenNow: boolean;
  hours: string;
}

export type UserRole = 'visitor' | 'business_owner' | 'tenant_admin' | 'super_admin';
