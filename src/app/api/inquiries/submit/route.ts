import { NextResponse } from 'next/server';
import { createInquiry, getBusinessByIdOrSlug } from '@/lib/db/client';
import { sendInquiryNotificationToBusiness, sendInquiryConfirmationToCustomer } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, tenantId, customerName, customerEmail, customerPhone, subject, message, locale = 'en' } = body;

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
    // Generates high-signal executive summary and suggested reply matching customer language
    const isDe = locale === 'de';
    const cleanMessage = message.trim();
    const wordCount = cleanMessage.split(/\s+/).length;
    const aiSummary = isDe
      ? `[Anfrage-Triage] Thema: ${subject.trim()}. Umfang: ca. ${wordCount} Wörter. Kunde ${customerName || customerEmail} bittet um Rückmeldung bezüglich "${subject.trim()}".`
      : `[Inquiry Triage] Topic: ${subject.trim()}. Length: ~${wordCount} words. Customer ${customerName || customerEmail} requested a response regarding "${subject.trim()}".`;

    const aiSuggestedReply = isDe
      ? `Sehr geehrte(r) ${customerName || 'Kunde/in'}, vielen Dank für Ihr Interesse an ${businessName}! Wir haben Ihre Anfrage zu "${subject.trim()}" erhalten und melden uns zeitnah bei Ihnen.`
      : `Dear ${customerName || 'Customer'}, thank you for your interest in ${businessName}! We have received your inquiry regarding "${subject.trim()}" and will get back to you shortly.`;

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

    // Dispatch Notifications via mail.nordible.co
    await Promise.allSettled([
      sendInquiryNotificationToBusiness({
        businessEmail: 'mail@nordible.co',
        businessName,
        customerName: customerName || (isDe ? 'Interessent' : 'Prospect'),
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
        customerName: customerName || (isDe ? 'Kunde' : 'Customer'),
        businessName,
        subject,
        message,
        locale,
      }),
    ]);

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
