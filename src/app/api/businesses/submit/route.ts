import { NextResponse } from 'next/server';
import { submitBusinessListing, SubmitBusinessPayload, formatWeekScheduleToString } from '@/lib/db/client';
import { sendNewListingNotificationToAdmin } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body: SubmitBusinessPayload = await request.json();

    if (!body.name || (!body.categoryId && !body.categoryName) || !body.address || !body.city) {
      return NextResponse.json(
        { error: 'Name, Branche (Kategorie), Adresse und Stadt sind Pflichtfelder.' },
        { status: 400 }
      );
    }

    const result = await submitBusinessListing(body);

    if (!result.success) {
      console.error('[SUBMIT BUSINESS ERROR]', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to submit business listing.' },
        { status: 500 }
      );
    }

    // Format readable hours
    const readableHours =
      body.hours ||
      (body.openingHoursJson
        ? formatWeekScheduleToString(body.openingHoursJson)
        : '24/7 Geöffnet (Rund um die Uhr)');

    // Dispatch single consolidated admin notification asynchronously
    sendNewListingNotificationToAdmin({
      businessName: body.name,
      legalForm: body.legalForm,
      categoryName: body.categoryName,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      state: body.state,
      country: body.country,
      phone: body.phone,
      email: body.email,
      website: body.website,
      logoUrl: body.logoUrl,
      hours: readableHours,
      description: body.description,
      wantsGrowthResource: Boolean(body.wantsGrowthResource),
    }).catch(() => {
      // Background email dispatch error handled silently
    });

    return NextResponse.json({
      success: true,
      listing: result.data,
      message: 'Business listing submitted successfully for verification.',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
