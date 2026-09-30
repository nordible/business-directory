import { BusinessListing, TenantBranding } from '@/lib/types';
import { INITIAL_TENANTS, MOCK_LISTINGS } from '@/lib/mockData';

/**
 * Directory Database Service
 * Provides data access abstraction for tenants, categories, and business listings.
 * Connects to Supabase / PostgreSQL when SUPABASE_URL and SUPABASE_ANON_KEY are configured,
 * otherwise gracefully falls back to local data.
 */

export const isDbConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getTenants(): Promise<TenantBranding[]> {
  if (!isDbConfigured) {
    return INITIAL_TENANTS;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tenants?select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return INITIAL_TENANTS;
    const data = await res.json();
    return data.map((t: Record<string, string>) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      tagline: { de: t.tagline_de, en: t.tagline_en },
      primaryColor: t.primary_color,
      accentColor: t.accent_color,
      logoText: t.logo_text,
      customDomain: t.custom_domain || undefined,
    }));
  } catch {
    return INITIAL_TENANTS;
  }
}

export async function getListingsByTenant(tenantId: string): Promise<BusinessListing[]> {
  if (!isDbConfigured) {
    return MOCK_LISTINGS.filter((l) => l.tenantId === tenantId);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/businesses?tenant_id=eq.${tenantId}&select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) return MOCK_LISTINGS.filter((l) => l.tenantId === tenantId);
    const data = await res.json();
    return data.map((b: Record<string, unknown>) => ({
      id: String(b.id),
      tenantId: String(b.tenant_id),
      categoryId: String(b.category_id),
      name: String(b.name),
      description: {
        de: String(b.description_de || ''),
        en: String(b.description_en || ''),
      },
      address: String(b.address || ''),
      city: String(b.city || ''),
      phone: String(b.phone || ''),
      website: String(b.website || ''),
      rating: Number(b.rating || 5.0),
      reviewCount: Number(b.review_count || 0),
      isVerified: Boolean(b.is_verified),
      isOpenNow: Boolean(b.is_open_now),
      hours: String(b.hours || ''),
    }));
  } catch {
    return MOCK_LISTINGS.filter((l) => l.tenantId === tenantId);
  }
}
