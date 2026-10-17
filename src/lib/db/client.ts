import { BusinessListing, TenantBranding, Category, Conversation, Message, WeekSchedule, LegalForm } from '@/lib/types';
import { extractIdFromPermalink } from '@/lib/permalinks';
import { isBusinessOpenNow } from '@/lib/openingHours';

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
    'Content-Type': 'application/json',
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
  logoText: '',
  customDomain: 'business-directory.nordible.co',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-all', slug: 'all', name: { en: 'All Categories' }, icon: 'Grid' },
  { id: 'tech', slug: 'tech', name: { en: 'IT, Software & Media' }, icon: 'Laptop' },
  { id: 'architektur-planung', slug: 'architektur-planung', name: { en: 'Architecture & Planning' }, icon: 'Hammer' },
  { id: 'gastronomie', slug: 'gastronomie', name: { en: 'Food & Dining' }, icon: 'Utensils' },
  { id: 'immobilien-beratung', slug: 'immobilien-beratung', name: { en: 'Real Estate, Finance & Consulting' }, icon: 'Briefcase' },
  { id: 'gesundheit-wellness', slug: 'gesundheit-wellness', name: { en: 'Healthcare & Wellness' }, icon: 'Heart' },
  { id: 'handel-ecommerce', slug: 'handel-ecommerce', name: { en: 'Retail & E-Commerce' }, icon: 'ShoppingBag' },
  { id: 'industrie-bau', slug: 'industrie-bau', name: { en: 'Industry & Craftsmanship' }, icon: 'Factory' },
];

export const DEFAULT_LEGAL_FORMS: LegalForm[] = [
  // Germany / DACH
  { code: 'GMBH', name: 'GmbH', countryCode: 'DE' },
  { code: 'AG', name: 'AG', countryCode: 'DE' },
  { code: 'UG', name: 'UG (haftungsbeschränkt)', countryCode: 'DE' },
  { code: 'EINZEL', name: 'Einzelunternehmen', countryCode: 'DE' },
  { code: 'GBR', name: 'GbR', countryCode: 'DE' },
  { code: 'FREIBERUF', name: 'Freiberufler', countryCode: 'DE' },
  { code: 'GMBH_CO_KG', name: 'GmbH & Co. KG', countryCode: 'DE' },
  { code: 'KG', name: 'KG', countryCode: 'DE' },
  { code: 'OHG', name: 'OHG', countryCode: 'DE' },
  { code: 'EV', name: 'e.V.', countryCode: 'DE' },

  // United States & Americas
  { code: 'LLC', name: 'LLC', countryCode: 'US' },
  { code: 'INC', name: 'Inc. / Corporation', countryCode: 'US' },
  { code: 'C_CORP', name: 'C-Corp', countryCode: 'US' },
  { code: 'S_CORP', name: 'S-Corp', countryCode: 'US' },
  { code: 'LLP_US', name: 'LLP', countryCode: 'US' },

  // United Kingdom & Commonwealth
  { code: 'LTD', name: 'Ltd', countryCode: 'GB' },
  { code: 'PLC', name: 'PLC', countryCode: 'GB' },
  { code: 'LLP_GB', name: 'LLP', countryCode: 'GB' },

  // France / Romance
  { code: 'SAS', name: 'SAS', countryCode: 'FR' },
  { code: 'SARL', name: 'SARL', countryCode: 'FR' },
  { code: 'SA', name: 'SA', countryCode: 'FR' },

  // India
  { code: 'PVT_LTD', name: 'Pvt Ltd', countryCode: 'IN' },
  { code: 'PUBLIC_LTD', name: 'Public Ltd', countryCode: 'IN' },
  { code: 'OPC', name: 'OPC', countryCode: 'IN' },

  // Netherlands
  { code: 'BV', name: 'B.V.', countryCode: 'NL' },
  { code: 'NV', name: 'N.V.', countryCode: 'NL' },

  // Spain & Latin America
  { code: 'SL', name: 'S.L.', countryCode: 'ES' },

  // Italy
  { code: 'SRL', name: 'S.r.l.', countryCode: 'IT' },

  // Australia / NZ
  { code: 'PTY_LTD', name: 'Pty Ltd', countryCode: 'AU' },
];

function mapDbBusiness(b: Record<string, unknown>): BusinessListing {
  const openingSchedule = (b.opening_hours_json as WeekSchedule) || undefined;
  const hoursStr = String(b.hours || '');
  const calculatedOpen = isBusinessOpenNow({
    hours: hoursStr,
    openingHoursJson: openingSchedule,
    city: b.city ? String(b.city) : undefined,
    country: b.country ? String(b.country) : undefined,
    state: b.state ? String(b.state) : undefined,
    address: b.address ? String(b.address) : undefined,
  });

  return {
    id: String(b.id),
    tenantId: String(b.tenant_id),
    slug: b.slug ? String(b.slug) : undefined,
    categoryId: String(b.category_id),
    categoryName: (b.categories as { name?: string })?.name || undefined,
    categorySlug: (b.categories as { slug?: string })?.slug || undefined,
    name: String(b.name),
    description: {
      de: String(b.description || ''),
      en: String(b.description || ''),
    },
    address: String(b.address || ''),
    postalCode: b.postal_code ? String(b.postal_code) : undefined,
    city: String(b.city || ''),
    state: b.state ? String(b.state) : undefined,
    country: b.country ? String(b.country) : 'Germany',
    phone: String(b.phone || ''),
    email: b.email ? String(b.email) : undefined,
    website: String(b.website || ''),
    logoUrl: b.logo_url ? String(b.logo_url) : undefined,
    bannerUrl: b.banner_url ? String(b.banner_url) : undefined,
    legalForm: b.legal_form ? String(b.legal_form) : undefined,
    services: Array.isArray(b.services) ? (b.services as string[]) : undefined,
    socialLinks: (b.social_links as Record<string, string>) || undefined,
    rating: Number(b.rating ?? 0),
    reviewCount: Number(b.review_count ?? 0),
    isVerified: Boolean(b.is_verified),
    isOpenNow: calculatedOpen.isOpen,
    hours: hoursStr,
    openingHoursJson: openingSchedule,
    status: (b.status as 'pending' | 'verified' | 'published') || (b.is_published ? 'published' : 'pending'),
    isPublished: b.is_published !== undefined ? Boolean(b.is_published) : true,
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

    return data.map((t: Record<string, string>) => {
      let logoText = t.logo_text || '';
      if (t.name && logoText.includes(t.name)) {
        logoText = logoText.replace(t.name, '').trim();
      }
      const taglineText = t.tagline || '';
      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        tagline: { de: taglineText, en: taglineText },
        primaryColor: t.primary_color,
        accentColor: t.accent_color,
        logoText,
        customDomain: t.custom_domain || undefined,
      };
    });
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
      name: { en: 'All Categories' },
      icon: 'Grid',
    };

    const fetched: Category[] = data.map((c: Record<string, string>) => {
      const englishName = c.name || c.slug;
      return {
        id: c.id,
        slug: c.slug,
        name: { en: englishName },
        icon: c.icon || 'Grid',
      };
    });

    return [allCat, ...fetched];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function getLegalForms(): Promise<LegalForm[]> {
  if (!isDbConfigured) return DEFAULT_LEGAL_FORMS;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/legal_forms?select=*&order=name.asc`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) return DEFAULT_LEGAL_FORMS;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_LEGAL_FORMS;

    return data.map((item: Record<string, unknown>) => ({
      id: item.id ? String(item.id) : undefined,
      code: String(item.code || item.name),
      name: String(item.name),
      countryCode: item.country_code ? String(item.country_code) : undefined,
    }));
  } catch {
    return DEFAULT_LEGAL_FORMS;
  }
}

export async function getAllBusinesses(includeUnpublished = false): Promise<BusinessListing[]> {
  if (!isDbConfigured) return [];

  try {
    const query = includeUnpublished
      ? '?select=*,categories(id,slug,name)&order=created_at.desc'
      : '?is_published=eq.true&select=*,categories(id,slug,name)&order=created_at.desc';

    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses${query}`, {
      headers: getHeaders(),
      next: { revalidate: 15 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(mapDbBusiness);
  } catch {
    return [];
  }
}

export async function getListingsByTenant(tenantId: string, includeUnpublished = false): Promise<BusinessListing[]> {
  if (!isDbConfigured) return [];

  try {
    const filter = includeUnpublished
      ? `tenant_id=eq.${tenantId}`
      : `tenant_id=eq.${tenantId}&is_published=eq.true`;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?${filter}&select=*,categories(id,slug,name)&order=created_at.desc`,
      {
        headers: getHeaders(),
        next: { revalidate: 15 },
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
const SHORT_HEX_REGEX = /^[0-9a-f]{8}$/i;

export async function getBusinessByIdOrSlug(idOrSlug: string): Promise<BusinessListing | null> {
  if (!isDbConfigured || !idOrSlug) return null;

  try {
    const extracted = extractIdFromPermalink(idOrSlug);
    const isFullUuid = UUID_REGEX.test(extracted);
    const isShortHex = SHORT_HEX_REGEX.test(extracted);

    let filter = '';
    if (isFullUuid) {
      filter = `id=eq.${extracted}`;
    } else if (isShortHex) {
      const minUuid = `${extracted.toLowerCase()}-0000-0000-0000-000000000000`;
      const maxUuid = `${extracted.toLowerCase()}-ffff-ffff-ffff-ffffffffffff`;
      filter = `id=gte.${minUuid}&id=lte.${maxUuid}`;
    } else {
      filter = `slug=eq.${encodeURIComponent(extracted)}`;
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?${filter}&select=*,categories(id,slug,name)&limit=1`,
      {
        headers: getHeaders(),
        next: { revalidate: 15 },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      // Fallback: search across all listings (supports partial IDs, legacy slugs, and full permalinks)
      const all = await getAllBusinesses(true);
      const normalizedTarget = idOrSlug.toLowerCase();
      const normalizedExtracted = extracted.toLowerCase();

      return (
        all.find(
          (b) =>
            b.id.toLowerCase() === normalizedExtracted ||
            b.id.toLowerCase().startsWith(normalizedExtracted) ||
            (b.slug && b.slug.toLowerCase() === normalizedExtracted) ||
            (b.slug && b.slug.toLowerCase() === normalizedTarget) ||
            b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedExtracted
        ) || null
      );
    }

    return mapDbBusiness(data[0]);
  } catch {
    return null;
  }
}

export interface SubmitBusinessPayload {
  name: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  address: string;
  postalCode?: string;
  city: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  legalForm?: string;
  services?: string[];
  hours?: string;
  openingHoursJson?: WeekSchedule;
  tenantId?: string;
  wantsGrowthResource?: boolean;
}

export function formatWeekScheduleToString(s?: WeekSchedule): string {
  if (!s) return '24/7 Geöffnet (Rund um die Uhr)';
  const days: { key: keyof WeekSchedule; label: string }[] = [
    { key: 'monday', label: 'Mo' },
    { key: 'tuesday', label: 'Di' },
    { key: 'wednesday', label: 'Mi' },
    { key: 'thursday', label: 'Do' },
    { key: 'friday', label: 'Fr' },
    { key: 'saturday', label: 'Sa' },
    { key: 'sunday', label: 'So' },
  ];

  const is24_7 = days.every((d) => {
    const item = s[d.key];
    return item && !item.closed && item.open === '00:00' && (item.close === '23:59' || item.close === '24:00' || item.close === '00:00');
  });

  if (is24_7) {
    return '24/7 Geöffnet (Rund um die Uhr)';
  }

  return days
    .map((d) => {
      const item = s[d.key];
      if (!item || item.closed) return `${d.label}: Geschlossen`;
      return `${d.label}: ${item.open} - ${item.close}`;
    })
    .join(', ');
}

export async function getOrCreateCategory(name: string, tenantId?: string): Promise<Category> {
  const trimmed = name.trim();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general';

  // 1. Check existing
  const allCategories = await getCategories();
  const existing = allCategories.find(
    (c) => c.slug === slug || c.id === trimmed || c.name.de?.toLowerCase() === trimmed.toLowerCase() || c.name.en?.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) return existing;

  // 2. Insert into DB
  if (!isDbConfigured) {
    return {
      id: `cat-${slug}`,
      slug,
      name: { de: trimmed, en: trimmed },
      icon: 'Building2',
    };
  }

  try {
    const defaultTenant = await getDefaultTenant();
    const effectiveTenantId = tenantId || defaultTenant.id;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        tenant_id: effectiveTenantId,
        slug,
        name: trimmed,
        icon: 'Building2',
      }),
    });

    if (res.ok) {
      const created = await res.json();
      if (Array.isArray(created) && created[0]) {
        const catName = created[0].name || trimmed;
        return {
          id: created[0].id,
          slug: created[0].slug,
          name: { en: catName },
          icon: created[0].icon || 'Building2',
        };
      }
    } else {
      // Query existing if conflicted or already exists
      const lookupRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?slug=eq.${slug}&select=*`, {
        headers: getHeaders(),
      });
      if (lookupRes.ok) {
        const rows = await lookupRes.json();
        if (Array.isArray(rows) && rows[0]) {
          const catName = rows[0].name || trimmed;
          return {
            id: rows[0].id,
            slug: rows[0].slug,
            name: { en: catName },
            icon: rows[0].icon || 'Building2',
          };
        }
      }
    }
  } catch {
    // fallback
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const validFallback = allCategories.find((c) => isUuid.test(c.id));
  return (
    validFallback || {
      id: `cat-${slug}`,
      slug,
      name: { de: trimmed, en: trimmed },
      icon: 'Building2',
    }
  );
}

export async function submitBusinessListing(payload: SubmitBusinessPayload): Promise<{ success: boolean; data?: BusinessListing; error?: string }> {
  if (!isDbConfigured) {
    return { success: false, error: 'Database is not configured' };
  }

  try {
    const defaultTenant = await getDefaultTenant();
    const tenantId = payload.tenantId || defaultTenant.id;

    const isUuid = (val?: string) =>
      typeof val === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val.trim());

    // Resolve category to a valid UUID
    let finalCategoryId = payload.categoryId;
    if (!finalCategoryId || !isUuid(finalCategoryId)) {
      const searchKey = payload.categoryName || payload.categoryId;
      if (searchKey) {
        const cat = await getOrCreateCategory(searchKey, tenantId);
        finalCategoryId = cat.id;
      }
    }

    if (!finalCategoryId || !isUuid(finalCategoryId)) {
      const allCategories = await getCategories();
      const matched = allCategories.find(
        (c) =>
          isUuid(c.id) &&
          (c.slug === payload.categoryId ||
            c.slug === payload.categoryName?.toLowerCase() ||
            c.name.de?.toLowerCase() === payload.categoryName?.toLowerCase() ||
            c.name.en?.toLowerCase() === payload.categoryName?.toLowerCase())
      );
      if (matched) {
        finalCategoryId = matched.id;
      } else {
        const firstValid = allCategories.find((c) => isUuid(c.id));
        if (firstValid) {
          finalCategoryId = firstValid.id;
        }
      }
    }

    // Generate unique slug
    const cleanSlug = payload.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'business';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${cleanSlug}-${randomSuffix}`;

    const readableHours = payload.hours || (payload.openingHoursJson ? formatWeekScheduleToString(payload.openingHoursJson) : '24/7 Geöffnet (Rund um die Uhr)');

    const newRow = {
      tenant_id: tenantId,
      category_id: finalCategoryId,
      slug,
      name: payload.name.trim(),
      description: payload.description?.trim() || '',
      address: payload.address.trim(),
      postal_code: payload.postalCode?.trim() || null,
      city: payload.city.trim(),
      state: payload.state?.trim() || null,
      country: payload.country?.trim() || 'Germany',
      phone: payload.phone || null,
      email: payload.email?.trim() || null,
      website: payload.website || null,
      logo_url: payload.logoUrl || null,
      banner_url: payload.bannerUrl || null,
      legal_form: payload.legalForm || null,
      services: payload.services || [],
      hours: readableHours,
      opening_hours_json: payload.openingHoursJson || {},
      rating: 5.0,
      review_count: 0,
      is_verified: false,
      is_open_now: true,
      status: 'pending',
      is_published: false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify(newRow),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }

    const createdRows = await res.json();
    return { success: true, data: mapDbBusiness(createdRows[0]) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function verifyBusiness(id: string): Promise<boolean> {
  if (!isDbConfigured || !id) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        is_verified: true,
        status: 'verified',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function publishBusiness(id: string): Promise<boolean> {
  if (!isDbConfigured || !id) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        is_published: true,
        status: 'published',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface CreateInquiryPayload {
  tenantId?: string;
  businessId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  subject: string;
  message: string;
  aiSummary?: string;
  aiSuggestedReply?: string;
}

export async function createInquiry(payload: CreateInquiryPayload): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  if (!isDbConfigured) {
    return { success: false, error: 'Database is not configured' };
  }

  try {
    const defaultTenant = await getDefaultTenant();
    const tenantId = payload.tenantId || defaultTenant.id;

    // 1. Create conversation record
    const convBody = {
      tenant_id: tenantId,
      business_id: payload.businessId,
      customer_email: payload.customerEmail.toLowerCase().trim(),
      customer_name: payload.customerName?.trim() || null,
      customer_phone: payload.customerPhone?.trim() || null,
      subject: payload.subject.trim(),
      status: 'open',
      ai_summary: payload.aiSummary || null,
      ai_suggested_reply: payload.aiSuggestedReply || null,
    };

    const convRes = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify(convBody),
    });

    if (!convRes.ok) {
      const errText = await convRes.text();
      return { success: false, error: errText };
    }

    const convRows = await convRes.json();
    const convRow = convRows[0];

    // 2. Insert initial message
    await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        conversation_id: convRow.id,
        sender_type: 'customer',
        sender_name: payload.customerName?.trim() || 'Kunde',
        content: payload.message.trim(),
        is_agent_generated: false,
      }),
    });

    const conversation: Conversation = {
      id: convRow.id,
      tenantId: convRow.tenant_id,
      businessId: convRow.business_id,
      customerEmail: convRow.customer_email,
      customerName: convRow.customer_name,
      customerPhone: convRow.customer_phone,
      subject: convRow.subject,
      status: convRow.status,
      aiSummary: convRow.ai_summary,
      aiSuggestedReply: convRow.ai_suggested_reply,
      createdAt: convRow.created_at,
      updatedAt: convRow.updated_at,
    };

    return { success: true, conversation };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getConversationsByCustomerEmail(email: string): Promise<Conversation[]> {
  if (!isDbConfigured || !email) return [];

  try {
    const normalizedEmail = encodeURIComponent(email.toLowerCase().trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/conversations?customer_email=eq.${normalizedEmail}&select=*,businesses(name)&order=updated_at.desc`,
      {
        headers: getHeaders(),
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    interface DbConversationRow {
      id: string;
      tenant_id: string;
      business_id: string;
      businesses?: { name?: string };
      customer_email: string;
      customer_name?: string;
      customer_phone?: string;
      subject: string;
      status: 'open' | 'in_progress' | 'resolved' | 'closed';
      ai_summary?: string;
      ai_suggested_reply?: string;
      created_at: string;
      updated_at: string;
    }

    return (data as DbConversationRow[]).map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      businessId: row.business_id,
      businessName: row.businesses?.name || undefined,
      customerEmail: row.customer_email,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      subject: row.subject,
      status: row.status,
      aiSummary: row.ai_summary,
      aiSuggestedReply: row.ai_suggested_reply,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  if (!isDbConfigured || !conversationId) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?conversation_id=eq.${conversationId}&select=*&order=created_at.asc`,
      {
        headers: getHeaders(),
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    interface DbMessageRow {
      id: string;
      conversation_id: string;
      sender_type: 'customer' | 'business' | 'agent';
      sender_name?: string;
      content: string;
      is_agent_generated?: boolean;
      created_at: string;
    }

    return (data as DbMessageRow[]).map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderType: m.sender_type,
      senderName: m.sender_name,
      content: m.content,
      isAgentGenerated: Boolean(m.is_agent_generated),
      createdAt: m.created_at,
    }));
  } catch {
    return [];
  }
}

export async function addMessageToConversation(payload: {
  conversationId: string;
  senderType: 'customer' | 'business' | 'agent';
  senderName: string;
  content: string;
  isAgentGenerated?: boolean;
}): Promise<{ success: boolean; message?: Message; error?: string }> {
  if (!isDbConfigured) return { success: false, error: 'Database not configured' };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        conversation_id: payload.conversationId,
        sender_type: payload.senderType,
        sender_name: payload.senderName,
        content: payload.content,
        is_agent_generated: Boolean(payload.isAgentGenerated),
      }),
    });

    if (!res.ok) {
      return { success: false, error: await res.text() };
    }

    const data = await res.json();
    const m = data[0];

    // Update conversation timestamp
    await fetch(`${SUPABASE_URL}/rest/v1/conversations?id=eq.${payload.conversationId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ updated_at: new Date().toISOString() }),
    });

    return {
      success: true,
      message: {
        id: m.id,
        conversationId: m.conversation_id,
        senderType: m.sender_type,
        senderName: m.sender_name,
        content: m.content,
        isAgentGenerated: Boolean(m.is_agent_generated),
        createdAt: m.created_at,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

