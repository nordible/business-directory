/**
 * Canonical Permalink & URL Utilities
 * Generates ID-First SEO-rich permalinks in the format:
 * /{locale}/directory/{uniqueId}-{category}-{country}-{state}-{postalCode}-{city}-{name}
 */

/**
 * Sanitizes a string segment for SEO-friendly URLs:
 * Converts umlauts, lowercases, replaces special characters with hyphens.
 */
export function slugify(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface PermalinkSource {
  id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  country?: string;
  state?: string;
  postalCode?: string;
  city?: string;
  slug?: string;
}

/**
 * Builds the canonical business URL slug:
 * {uniqueId}-{category}-{country}-{state}-{postalCode}-{city}-{name}
 */
export function buildBusinessSlug(business: PermalinkSource): string {
  if (!business.id) return slugify(business.name) || 'business';

  const categoryPart = slugify(business.categoryName || business.categoryId);
  const countryPart = slugify(business.country || 'deutschland');
  const statePart = slugify(business.state);
  const postalCodePart = slugify(business.postalCode);
  const cityPart = slugify(business.city);
  const namePart = slugify(business.name);

  const descriptiveParts = [
    categoryPart,
    countryPart,
    statePart,
    postalCodePart,
    cityPart,
    namePart,
  ].filter(Boolean);

  if (descriptiveParts.length === 0) {
    return business.id;
  }

  return `${business.id}-${descriptiveParts.join('-')}`;
}

/**
 * Generates the full localized permalink path:
 * /{locale}/directory/{uniqueId}-{category}-{country}-{state}-{postalCode}-{city}-{name}
 */
export function getBusinessPermalink(
  business: PermalinkSource,
  locale: string = 'de'
): string {
  return `/${locale}/directory/${buildBusinessSlug(business)}`;
}

/**
 * Extracts the primary identifier (e.g. UUID) from an ID-first permalink.
 * Supports:
 * - Full UUID at start: "66cb4b29-1894-4e6e-97ed-f8c7788bca8a-tech-..." -> "66cb4b29-1894-4e6e-97ed-f8c7788bca8a"
 * - Exact bare UUID: "66cb4b29-1894-4e6e-97ed-f8c7788bca8a"
 * - Fallback to original string (for legacy slugs like "nordible-technologies")
 */
export function extractIdFromPermalink(idOrSlug: string): string {
  if (!idOrSlug) return '';
  const uuidMatch = idOrSlug.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:-.*)?$/i
  );
  if (uuidMatch) {
    return uuidMatch[1];
  }
  return idOrSlug;
}
