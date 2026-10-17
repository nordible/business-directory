import { LocalizedString, UserRole } from '@/lib/types';

export interface DbTenant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  primary_color: string;
  accent_color: string;
  logo_text: string;
  custom_domain?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  tenant_id?: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  tenant_id: string;
  slug: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface DbBusiness {
  id: string;
  tenant_id: string;
  category_id: string;
  owner_id?: string | null;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  phone?: string | null;
  website?: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_open_now: boolean;
  hours?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Mapper utilities converting database rows to UI entities
 */
export function mapDbTenantToTenantBranding(dbTenant: DbTenant) {
  return {
    id: dbTenant.id,
    slug: dbTenant.slug,
    name: dbTenant.name,
    tagline: {
      de: dbTenant.tagline,
      en: dbTenant.tagline,
    } as LocalizedString,
    primaryColor: dbTenant.primary_color,
    accentColor: dbTenant.accent_color,
    logoText: dbTenant.logo_text,
    customDomain: dbTenant.custom_domain || undefined,
  };
}

export function mapDbBusinessToBusinessListing(dbBusiness: DbBusiness) {
  const desc = dbBusiness.description || '';
  return {
    id: dbBusiness.id,
    tenantId: dbBusiness.tenant_id,
    categoryId: dbBusiness.category_id,
    name: dbBusiness.name,
    description: {
      de: desc,
      en: desc,
    },
    address: dbBusiness.address,
    city: dbBusiness.city,
    phone: dbBusiness.phone || '',
    website: dbBusiness.website || '',
    rating: Number(dbBusiness.rating),
    reviewCount: dbBusiness.review_count,
    isVerified: dbBusiness.is_verified,
    isOpenNow: dbBusiness.is_open_now,
    hours: dbBusiness.hours || '',
  };
}
