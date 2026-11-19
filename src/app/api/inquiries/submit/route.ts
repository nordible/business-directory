import { NextResponse } from 'next/server';
import { createInquiry, getBusinessByIdOrSlug } from '@/lib/db/client';
import { sendInquiryNotificationToBusiness, sendInquiryConfirmationToCustomer } from '@/lib/email';
import { getTranslation } from '@/lib/translations';
import { env } from '@/config/env';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, tenantId, customerName, customerEmail, customerPhone, subject, message, locale = 'de' } = body;

    if (!businessId || !customerEmail || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Pflichtfelder fehlen (businessId, customerEmail, subject, message).' },
        { status: 400 }
      );
    }

    // Fetch business details
    const business = await getBusinessByIdOrSlug(businessId);
    const businessName = business?.name || (locale === 'de' ? 'Unternehmen' : 'Business');

    // Agentic AI Triage & Summary generation
    // Generates high-signal executive summary and suggested reply matching customer language from translations
    const cleanMessage = message.trim();
    const wordCount = cleanMessage.split(/\s+/).length;
    const customerDisplayName = customerName || customerEmail || getTranslation(locale, 'emails.common.prospect');
    const aiSummary = getTranslation(locale, 'inquiry.aiSummary', {
      subject: subject.trim(),
      wordCount,
      customer: customerDisplayName,
    });
    const aiSuggestedReply = getTranslation(locale, 'inquiry.aiSuggestedReply', {
      customer: customerName || getTranslation(locale, 'emails.common.customer'),
      businessName,
      subject: subject.trim(),
    });

    // Save to Database
    const result = await createInquiry({
      tenantId,
      businessId,
      customerEmail,
      customerName,
      customerPhone,
      subject,
      message,
      aiSummary,
      aiSuggestedReply,
    });

    if (!result.success || !result.conversation) {
      return NextResponse.json(
        { success: false, error: result.error || 'Fehler beim Speichern der Anfrage' },
        { status: 500 }
      );
    }

    // Determine target recipient: business's registered email or platform fallback
    const targetBusinessEmail =
      business?.email && business.email.includes('@')
        ? business.email.trim()
        : env.mail.adminEmails[0] || 'mail@nordible.co';

    // Dispatch Notifications via mail.nordible.co (Global BCC ensures nordiblesolutions@gmail.com receives all incoming leads)
    const dispatchResults = await Promise.allSettled([
      sendInquiryNotificationToBusiness({
        businessEmail: targetBusinessEmail,
        businessName,
        customerName: customerName || getTranslation(locale, 'emails.common.prospect'),
        customerEmail,
        customerPhone,
        subject,
        message,
        aiSummary,
        aiSuggestedReply,
        locale,
      }),
      sendInquiryConfirmationToCustomer({
        customerEmail,
        customerName: customerName || getTranslation(locale, 'emails.common.customer'),
        businessName,
        subject,
        message,
        locale,
      }),
    ]);

    dispatchResults.forEach((res, idx) => {
      if (res.status === 'rejected') {
        console.error(`[INQUIRY DISPATCH ERROR #${idx}]:`, res.reason);
      }
    });

    return NextResponse.json({
      success: true,
      conversationId: result.conversation.id,
      conversation: result.conversation,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
