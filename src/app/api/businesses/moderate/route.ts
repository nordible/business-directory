import { NextResponse } from 'next/server';
import { verifyBusiness, publishBusiness, getAllBusinesses, getListingsByTenant } from '@/lib/db/client';
import { verifyAdminRequest } from '@/lib/auth-customer';

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

    const { id, action } = await request.json();

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

    if (action === 'publish') {
      const ok = await publishBusiness(id);
      return NextResponse.json({ success: ok, action: 'publish' });
    }

    return NextResponse.json(
      { error: `Invalid action: ${action}. Expected 'verify' or 'publish'.` },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
