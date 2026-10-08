import { NextRequest, NextResponse } from 'next/server';

// Known tenant slugs and custom domain map
const TENANT_SLUGS = ['handwerk-berlin', 'nordic-tech', 'alpen-genuss'];
const CUSTOM_DOMAINS: Record<string, string> = {
  'berlin-meister.de': 'handwerk-berlin',
  'www.berlin-meister.de': 'handwerk-berlin',
  'nordictech.io': 'nordic-tech',
  'www.nordictech.io': 'nordic-tech',
  'alpengenuss.at': 'alpen-genuss',
};

import { Locale, SUPPORTED_LOCALES } from '@/lib/types';
const DEFAULT_LOCALE: Locale = 'en';

const isSupportedLocale = (val?: string | null): val is Locale => {
  return typeof val === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(val);
};

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  const pathname = url.pathname;

  // Bypass root SEO files, APIs, and static assets with extensions
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/llms.txt' ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Enforce language parameter in URL (e.g. /en, /de/directory, /tr/partner)
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !isSupportedLocale(firstSegment)) {
    const queryLang = url.searchParams.get('lang');
    // Strict English default: only override if an explicit ?lang= parameter is passed
    const targetLang: Locale = isSupportedLocale(queryLang) ? queryLang : DEFAULT_LOCALE;

    if (queryLang) {
      url.searchParams.delete('lang');
    }

    url.pathname = `/${targetLang}${pathname === '/' ? '' : pathname}`;
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookies.set('nordible_lang', targetLang, { path: '/', maxAge: 31536000, sameSite: 'lax' });
    return redirectResponse;
  }

  // 1. Check query parameter override (ergonomic for local testing: ?tenant=nordic-tech)
  const queryTenant = url.searchParams.get('tenant');
  let resolvedTenantSlug = queryTenant && TENANT_SLUGS.includes(queryTenant) ? queryTenant : '';

  // 2. Check custom domains mapping
  if (!resolvedTenantSlug && CUSTOM_DOMAINS[hostname]) {
    resolvedTenantSlug = CUSTOM_DOMAINS[hostname];
  }

  // 3. Check subdomain mapping (e.g. nordic-tech.nordible.com or nordic-tech.localhost)
  if (!resolvedTenantSlug) {
    const parts = hostname.split('.');
    const isLocalhost = hostname.endsWith('localhost');
    const minParts = isLocalhost ? 2 : 3;

    if (parts.length >= minParts) {
      const subdomain = parts[0];
      if (TENANT_SLUGS.includes(subdomain)) {
        resolvedTenantSlug = subdomain;
      }
    }
  }

  // Fallback to default tenant if not resolved
  if (!resolvedTenantSlug) {
    resolvedTenantSlug = 'handwerk-berlin';
  }

  // Forward resolved tenant metadata via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', resolvedTenantSlug);
  requestHeaders.set('x-tenant-host', hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, icons (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)',
  ],
};
