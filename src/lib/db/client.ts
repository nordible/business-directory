import { BusinessListing, TenantBranding, Category } from '@/lib/types';

/**
 * Directory Database Service
 * Provides direct connection to Supabase REST API (supporting both server-only and client env variables).
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isDbConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

function getHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
}

export const DEFAULT_TENANT: TenantBranding = {
  id: 'dbb7134c-4a7a-4bb8-96b1-111171c82e7a',
  slug: 'nordible',
  name: 'Nordible for Businesses',
  tagline: {
    de: 'Das internationale Branchenverzeichnis für alle Unternehmensarten weltweit',
    en: 'The International Business Directory for all types of businesses across the world',
  },
  primaryColor: '#145BFF',
  accentColor: '#FF9F1A',
  logoText: '🌟 Nordible for Businesses',
  customDomain: 'business-directory.nordible.co',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-all', slug: 'all', name: { de: 'Alle Branchen', en: 'All Categories' }, icon: 'Grid' },
  { id: 'tech', slug: 'tech', name: { de: 'IT, Software & Medien', en: 'IT, Software & Media' }, icon: 'Laptop' },
  { id: 'architektur-planung', slug: 'architektur-planung', name: { de: 'Architektur & Planung', en: 'Architecture & Planning' }, icon: 'Hammer' },
  { id: 'gastronomie', slug: 'gastronomie', name: { de: 'Gastronomie & Food', en: 'Food & Dining' }, icon: 'Utensils' },
  { id: 'immobilien-beratung', slug: 'immobilien-beratung', name: { de: 'Immobilien, Finanzen & Beratung', en: 'Real Estate, Finance & Consulting' }, icon: 'Briefcase' },
  { id: 'gesundheit-wellness', slug: 'gesundheit-wellness', name: { de: 'Gesundheit & Medizin', en: 'Healthcare & Wellness' }, icon: 'Heart' },
  { id: 'handel-ecommerce', slug: 'handel-ecommerce', name: { de: 'Handel & E-Commerce', en: 'Retail & E-Commerce' }, icon: 'ShoppingBag' },
  { id: 'industrie-bau', slug: 'industrie-bau', name: { de: 'Industrie, Fertigung & Handwerk', en: 'Industry & Craftsmanship' }, icon: 'Factory' },
];

function mapDbBusiness(b: Record<string, unknown>): BusinessListing {
  return {
    id: String(b.id),
    tenantId: String(b.tenant_id),
    slug: b.slug ? String(b.slug) : undefined,
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
    logoUrl: b.logo_url ? String(b.logo_url) : undefined,
    rating: Number(b.rating || 5.0),
    reviewCount: Number(b.review_count || 0),
    isVerified: Boolean(b.is_verified),
    isOpenNow: Boolean(b.is_open_now),
    hours: String(b.hours || ''),
  };
}

export async function getTenants(): Promise<TenantBranding[]> {
  if (!isDbConfigured) return [DEFAULT_TENANT];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants?select=*`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [DEFAULT_TENANT];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [DEFAULT_TENANT];

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
    return [DEFAULT_TENANT];
  }
}

export async function getDefaultTenant(): Promise<TenantBranding> {
  const tenants = await getTenants();
  return tenants[0] || DEFAULT_TENANT;
}

export async function getCategories(): Promise<Category[]> {
  if (!isDbConfigured) return DEFAULT_CATEGORIES;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) return DEFAULT_CATEGORIES;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_CATEGORIES;

    const allCat: Category = {
      id: 'cat-all',
      slug: 'all',
      name: { de: 'Alle Branchen', en: 'All Categories' },
      icon: 'Grid',
    };

    const fetched: Category[] = data.map((c: Record<string, string>) => ({
      id: c.id,
      slug: c.slug,
      name: { de: c.name_de, en: c.name_en },
      icon: c.icon || 'Grid',
    }));

    return [allCat, ...fetched];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function getAllBusinesses(): Promise<BusinessListing[]> {
  if (!isDbConfigured) return [];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses?select=*`, {
      headers: getHeaders(),
      next: { revalidate: 30 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapDbBusiness);
  } catch {
    return [];
  }
}

export async function getListingsByTenant(tenantId: string): Promise<BusinessListing[]> {
  if (!isDbConfigured) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?tenant_id=eq.${tenantId}&select=*`,
      {
        headers: getHeaders(),
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapDbBusiness);
  } catch {
    return [];
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getBusinessByIdOrSlug(idOrSlug: string): Promise<BusinessListing | null> {
  if (!isDbConfigured || !idOrSlug) return null;

  try {
    // If input is clean UUID
    const isUuid = UUID_REGEX.test(idOrSlug);
    const filter = isUuid ? `id=eq.${idOrSlug}` : `slug=eq.${encodeURIComponent(idOrSlug)}`;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?${filter}&select=*&limit=1`,
      {
        headers: getHeaders(),
        next: { revalidate: 15 },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      // Fallback: check if slug matches normalized name
      if (!isUuid) {
        const all = await getAllBusinesses();
        const normalized = idOrSlug.toLowerCase();
        return (
          all.find(
            (b) =>
              b.slug === normalized ||
              b.id === normalized ||
              b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
          ) || null
        );
      }
      return null;
    }

    return mapDbBusiness(data[0]);
  } catch {
    return null;
  }
}
