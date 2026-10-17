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
  id?: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  country?: string;
  state?: string;
  postalCode?: string;
  city?: string;
  legalForm?: string;
  slug?: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Builds the canonical business URL slug with compact unique ID at the end:
 * {category}-{country}-{city}-{businessType}-{name}-{shortId}
 */
export function buildBusinessSlug(business: PermalinkSource): string {
  // 1. Extract 8-character compact unique ID from UUID
  const shortId = (business.id || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 8);

  const parts: string[] = [];

  // 2. Category part (never allow a raw UUID!)
  let categoryPart = '';
  if (business.categorySlug && !UUID_PATTERN.test(business.categorySlug)) {
    categoryPart = slugify(business.categorySlug);
  } else if (business.categoryName && !UUID_PATTERN.test(business.categoryName)) {
    categoryPart = slugify(business.categoryName);
  } else if (business.categoryId && !UUID_PATTERN.test(business.categoryId)) {
    categoryPart = slugify(business.categoryId.replace(/^cat-/, ''));
  }
  if (categoryPart) parts.push(categoryPart);

  // 3. Country part
  const countryPart = slugify(business.country);
  if (countryPart) parts.push(countryPart);

  // 4. City / Location part
  const cityPart = slugify(business.city);
  if (cityPart && cityPart !== countryPart) parts.push(cityPart);

  // 5. Business Type / Legal Form (e.g. gmbh, llc, ag, ug)
  const cleanLegalForm = business.legalForm ? business.legalForm.replace(/\./g, '') : '';
  const legalFormPart = slugify(cleanLegalForm);
  if (legalFormPart) parts.push(legalFormPart);

  // 6. Name / Slug part (deduplicated against city)
  let namePart = slugify(business.slug || business.name);
  if (cityPart && namePart.endsWith(`-${cityPart}`)) {
    namePart = namePart.slice(0, -(cityPart.length + 1));
  }
  if (namePart) parts.push(namePart);

  // 7. Short ID at the end
  if (shortId) parts.push(shortId);

  return parts.filter(Boolean).join('-') || business.id || 'business';
}

/**
 * Generates the full localized permalink path:
 * /{locale}/directory/{category}-{country}-{city}-{businessType}-{name}-{shortId}
 */
export function getBusinessPermalink(
  business: PermalinkSource,
  locale: string = 'de'
): string {
  return `/${locale}/directory/${buildBusinessSlug(business)}`;
}

/**
 * Extracts the primary identifier (short 8-char ID, full UUID, or bare slug) from a permalink.
 * Supports:
 * - End short 8-char ID: "...-quasi-homes-4a9d18fb" -> "4a9d18fb"
 * - Start short 8-char ID: "4a9d18fb-..." -> "4a9d18fb"
 * - Full UUID at start/anywhere: "4a9d18fb-eb4d-4aa8-adaf-666d8c40ab6b-..." -> "4a9d18fb-eb4d-4aa8-adaf-666d8c40ab6b"
 * - Bare UUID: "4a9d18fb-eb4d-4aa8-adaf-666d8c40ab6b"
 * - Bare slug: "quasi-homes-dubai" -> "quasi-homes-dubai"
 */
export function extractIdFromPermalink(idOrSlug: string): string {
  if (!idOrSlug) return '';
  const trimmed = idOrSlug.trim();

  // 1. Full UUID (36 chars) anywhere:
  const fullUuidMatch = trimmed.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  if (fullUuidMatch) {
    return fullUuidMatch[1];
  }

  // 2. Short 8-char hex ID at the end: "*-4a9d18fb"
  const shortEndMatch = trimmed.match(/-([0-9a-f]{8})$/i);
  if (shortEndMatch) {
    return shortEndMatch[1];
  }

  // 3. Short 8-char hex ID at start: "4a9d18fb-*"
  const shortStartMatch = trimmed.match(/^([0-9a-f]{8})-(.*)/i);
  if (shortStartMatch) {
    return shortStartMatch[1];
  }

  return trimmed;
}
