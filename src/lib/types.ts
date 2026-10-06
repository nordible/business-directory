export type Locale = 'de' | 'en' | 'fr' | 'es' | 'it';

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
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpenNow: boolean;
  hours: string;
}

export type UserRole = 'visitor' | 'business_owner' | 'tenant_admin' | 'super_admin';
