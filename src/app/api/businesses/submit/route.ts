import { NextResponse } from 'next/server';
import { submitBusinessListing, SubmitBusinessPayload, formatWeekScheduleToString } from '@/lib/db/client';
import { sendNewListingNotificationToAdmin, sendBusinessRegistrationConfirmation } from '@/lib/email';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  try {
    const body: SubmitBusinessPayload = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = typeof body.email === 'string' && emailRegex.test(body.email.trim());

    if (!body.name || !body.website || !hasValidEmail) {
      return NextResponse.json(
        { error: 'Name, Webseite und eine gültige geschäftliche E-Mail-Adresse sind Pflichtfelder.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await submitBusinessListing(body);

    if (!result.success) {
      console.error('[SUBMIT BUSINESS ERROR]', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to submit business listing.' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Format readable hours
    const readableHours =
      body.hours ||
      (body.openingHoursJson
        ? formatWeekScheduleToString(body.openingHoursJson)
        : '24/7 Geöffnet (Rund um die Uhr)');

    // Determine business language: German for DACH countries, English for international
    const isDachCountry = /deutschland|germany|österreich|austria|schweiz|switzerland/i.test(body.country || '');
    const businessLocale = body.locale || (isDachCountry ? 'de' : 'en');

    // Dispatch admin notification (always in English) and confirmation to business submitter (in business language)
    const emailPromises: Promise<unknown>[] = [
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
      }),
    ];

    if (body.email && body.email.includes('@')) {
      emailPromises.push(
        sendBusinessRegistrationConfirmation({
          to: body.email.trim(),
          businessName: body.name.trim(),
          locale: businessLocale,
          city: body.city,
          categoryName: body.categoryName,
        })
      );
    }

    Promise.allSettled(emailPromises).then((results) => {
      results.forEach((res, idx) => {
        if (res.status === 'rejected') {
          console.error(`[NEW BUSINESS EMAIL ERROR #${idx}]:`, res.reason);
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        listing: result.data,
        message: 'Business listing submitted successfully as draft (pending manual verification and publishing).',
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
