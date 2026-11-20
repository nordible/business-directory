import { NextResponse } from 'next/server';
import {
  verifyBusiness,
  publishBusiness,
  rejectBusiness,
  getAllBusinesses,
  getListingsByTenant,
  getBusinessByIdOrSlug,
} from '@/lib/db/client';
import { verifyAdminRequest } from '@/lib/auth-customer';
import {
  sendBusinessPublishedNotification,
  sendBusinessRejectedNotification,
} from '@/lib/email';
import { getBusinessPermalink } from '@/lib/permalinks';
import { siteConfig } from '@/config/site';

export async function GET(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Admin-Zugriff verweigert. Bitte authentifizieren Sie sich als Administrator.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    // Return listings scoped by tenant if provided, including pending and unverified
    const listings = tenantId
      ? await getListingsByTenant(tenantId, true)
      : await getAllBusinesses(true);

    return NextResponse.json({ listings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Admin-Zugriff verweigert. Bitte authentifizieren Sie sich als Administrator.' },
        { status: 401 }
      );
    }

    const { id, action, locale: reqLocale } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing business ID or moderation action.' },
        { status: 400 }
      );
    }

    if (action === 'verify') {
      const ok = await verifyBusiness(id);
      return NextResponse.json({ success: ok, action: 'verify' });
    }

    if (action === 'reject') {
      const business = await getBusinessByIdOrSlug(id, true);
      const ok = await rejectBusiness(id);

      if (ok && business && business.email && business.email.includes('@')) {
        try {
          const locale = reqLocale && typeof reqLocale === 'string' ? reqLocale.trim().toLowerCase() : 'en';
          const resubmitUrl = `${siteConfig.urls.base}/${locale}`;

          await sendBusinessRejectedNotification({
            to: business.email.trim(),
            businessName: business.name,
            locale,
            resubmitUrl,
          });
        } catch (emailErr) {
          console.error('[REJECT NOTIFICATION ERROR]:', emailErr);
        }
      }

      return NextResponse.json({ success: ok, action: 'reject' });
    }

    if (action === 'publish') {
      const business = await getBusinessByIdOrSlug(id, true);
      const wasPublished = business?.isPublished;
      const ok = await publishBusiness(id);

      if (ok && business && !wasPublished && business.email && business.email.includes('@')) {
        try {
          const locale = reqLocale && typeof reqLocale === 'string' ? reqLocale.trim().toLowerCase() : 'en';
          const listingUrl = `${siteConfig.urls.base}${getBusinessPermalink(business, locale)}`;

          await sendBusinessPublishedNotification({
            to: business.email.trim(),
            businessName: business.name,
            locale,
            listingUrl,
            city: business.city,
            categoryName: business.categoryName,
          });
        } catch (emailErr) {
          console.error('[PUBLISH NOTIFICATION ERROR]:', emailErr);
        }
      }

      return NextResponse.json({ success: ok, action: 'publish' });
    }

    return NextResponse.json(
      { error: `Invalid action: ${action}. Expected 'verify', 'publish', or 'reject'.` },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
