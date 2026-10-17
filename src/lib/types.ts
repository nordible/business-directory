export type Locale =
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'tr'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'id'
  | 'hi'
  | 'gu'
  | 'he'
  | 'ur'
  | 'fa'
  | 'ar'
  | 'sw';

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
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

/**
 * Curated list of languages shown in the UI dropdown (focusing on high-income global economies).
 * All other languages in SUPPORTED_LANGUAGES retain their translation files and /[lang]/ routing.
 */
export const DISPLAYED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
];

export const SUPPORTED_LOCALES: Locale[] = [
  'en',
  'de',
  'fr',
  'es',
  'it',
  'tr',
  'zh',
  'ja',
  'ko',
  'id',
  'hi',
  'gu',
  'he',
  'ur',
  'fa',
  'ar',
  'sw',
];

export const RTL_LOCALES: Locale[] = ['ar', 'he', 'ur', 'fa'];

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

export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface BusinessListing {
  id: string;
  tenantId: string;
  slug?: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  description: LocalizedString;
  address: string;
  postalCode?: string;
  city: string;
  state?: string;
  country?: string;
  phone: string;
  email?: string;
  website: string;
  logoUrl?: string;
  bannerUrl?: string;
  legalForm?: string;
  services?: string[];
  socialLinks?: Record<string, string>;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpenNow: boolean;
  hours: string;
  openingHoursJson?: WeekSchedule;
  status?: 'pending' | 'verified' | 'published';
  isPublished?: boolean;
}

export interface LegalForm {
  id?: string;
  code: string;
  name: string;
  countryCode?: string | null;
}

export type UserRole = 'visitor' | 'business_owner' | 'tenant_admin' | 'super_admin';

export interface Conversation {
  id: string;
  tenantId: string;
  businessId: string;
  businessName?: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  aiSummary?: string;
  aiSuggestedReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'business' | 'agent';
  senderName?: string;
  content: string;
  isAgentGenerated: boolean;
  createdAt: string;
}

