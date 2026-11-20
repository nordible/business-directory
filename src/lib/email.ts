import { env } from '@/config/env';
import { siteConfig } from '@/config/site';
import { getTranslation } from '@/lib/translations';

/**
 * Centralized Email Service for Nordible Directory
 * Dispatches transactional notifications and authentication OTPs via mail.nordible.co API.
 * All email content, subjects, labels, and copy are pulled directly from localized translation dictionaries.
 */

const MAIL_API_URL = env.mail.apiUrl;
const MAIL_API_SECRET = env.mail.apiSecret;

export const GLOBAL_BCC_EMAIL = 'nordiblesolutions@gmail.com';
export const EMAIL_LOGO_URL = `${siteConfig.urls.base}${siteConfig.assets.logoFull}`;
export const APP_TITLE = siteConfig.appName;

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  bcc?: string | string[];
}

export const ADMIN_NOTIFICATION_EMAILS =
  env.mail.adminEmails.length > 0
    ? env.mail.adminEmails
    : [siteConfig.contact.email, GLOBAL_BCC_EMAIL];

export function expandAdminRecipients(to: string | string[]): string | string[] {
  const recipients = Array.isArray(to) ? [...to] : [to];
  const hasNordibleMail = recipients.some((r) => r.toLowerCase().trim() === siteConfig.contact.email.toLowerCase());
  const hasGmail = recipients.some((r) => r.toLowerCase().trim() === 'nordiblesolutions@gmail.com');

  if (hasNordibleMail && !hasGmail) {
    recipients.push('nordiblesolutions@gmail.com');
  }

  return recipients.length === 1 ? recipients[0] : recipients;
}

/**
 * Centralized dispatcher with automatic recipient normalization and simulation fallback
 */
export async function sendEmail(
  payload: SendEmailPayload
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  try {
    const finalRecipients = expandAdminRecipients(payload.to);

    // Consolidate BCC recipients ensuring global recipient is strictly included on all emails
    const bccSet = new Set<string>();
    if (payload.bcc) {
      if (Array.isArray(payload.bcc)) {
        payload.bcc.forEach((e) => e && bccSet.add(e.trim().toLowerCase()));
      } else {
        bccSet.add(payload.bcc.trim().toLowerCase());
      }
    }
    bccSet.add(GLOBAL_BCC_EMAIL.toLowerCase());
    const finalBcc = Array.from(bccSet);

    const resolvedPayload = {
      ...payload,
      to: finalRecipients,
      bcc: finalBcc.length === 1 ? finalBcc[0] : finalBcc,
    };

    if (!MAIL_API_URL) {
      console.warn('[MAIL SERVICE] MAIL_API_URL not configured. Simulating email dispatch to:', resolvedPayload.to);
      return { success: true, simulated: true };
    }

    const res = await fetch(MAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': MAIL_API_SECRET,
      },
      body: JSON.stringify(resolvedPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[MAIL SERVICE NOTICE] Endpoint returned ${res.status}: ${errText}. Simulating email delivery for local testing.`);
      return { success: true, simulated: true };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[MAIL SERVICE NOTICE] Network dispatch notice: ${errorMsg}. Fallback simulation enabled.`);
    return { success: true, simulated: true };
  }
}

/**
 * Reusable HTML shell for consistent brand design across all transactional emails
 */
function renderEmailShell({
  headerBadge,
  headerTitle,
  headerSubtitle,
  bodyHtml,
  borderColor = '#145bff',
  locale = 'en',
}: {
  headerBadge?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  bodyHtml: string;
  borderColor?: string;
  locale?: string;
}): string {
  const footerText = getTranslation(locale, 'emails.common.rightsReserved', {
    year: new Date().getFullYear(),
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="margin-bottom: 24px; border-bottom: 2px solid ${borderColor}; padding-bottom: 16px;">
        <img src="${EMAIL_LOGO_URL}" alt="${APP_TITLE}" style="height: 32px; width: auto; max-width: 180px; display: block; margin-bottom: 10px;" />
        ${headerBadge ? `<span style="color: ${borderColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${headerBadge}</span>` : ''}
        ${headerTitle ? `<h2 style="color: #0f172a; margin: 6px 0 2px 0; font-size: 22px; font-weight: 800;">${headerTitle}</h2>` : ''}
        ${headerSubtitle ? `<p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">${headerSubtitle}</p>` : ''}
      </div>
      ${bodyHtml}
      <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; text-align: center;">
        ${footerText}
      </div>
    </div>
  `;
}

/**
 * Sends a 6-digit one-time password (OTP) for passwordless customer login
 */
export async function sendCustomerOtpEmail(email: string, code: string, locale: string = 'de') {
  const subject = getTranslation(locale, 'emails.customerOtp.subject', { appTitle: APP_TITLE, code });
  const heading = getTranslation(locale, 'emails.customerOtp.heading');
  const subtitle = getTranslation(locale, 'emails.customerOtp.subtitle');
  const codeLabel = getTranslation(locale, 'emails.customerOtp.codeLabel');
  const codeValidity = getTranslation(locale, 'emails.customerOtp.codeValidity');
  const disclaimer = getTranslation(locale, 'emails.customerOtp.disclaimer');
  const text = getTranslation(locale, 'emails.customerOtp.text', { appTitle: APP_TITLE, code });

  const bodyHtml = `
    <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1px; display: block; margin-bottom: 8px;">
        ${codeLabel}
      </span>
      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #145bff; font-family: monospace;">${code}</span>
      <p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0 0;">
        ${codeValidity}
      </p>
    </div>
    <div style="font-size: 12px; color: #64748b; line-height: 1.6; text-align: center;">
      ${disclaimer}
    </div>
  `;

  const html = renderEmailShell({
    headerBadge: APP_TITLE,
    headerTitle: heading,
    headerSubtitle: subtitle,
    bodyHtml,
    locale,
  });

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Sends a notification to the business when a customer submits an inquiry
 */
export async function sendInquiryNotificationToBusiness(options: {
  businessEmail: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  aiSummary?: string;
  aiSuggestedReply?: string;
  locale?: string;
}) {
  const locale = options.locale || 'de';
  const emailSubject = getTranslation(locale, 'emails.inquiryNotificationToBusiness.subject', {
    subject: options.subject,
    customerName: options.customerName,
  });

  const badge = `${APP_TITLE} • ${getTranslation(locale, 'emails.inquiryNotificationToBusiness.badge')}`;
  const title = getTranslation(locale, 'emails.inquiryNotificationToBusiness.title', { businessName: options.businessName });
  const customerLabel = getTranslation(locale, 'emails.inquiryNotificationToBusiness.customerLabel');
  const emailLabel = getTranslation(locale, 'emails.inquiryNotificationToBusiness.emailLabel');
  const phoneLabel = getTranslation(locale, 'emails.inquiryNotificationToBusiness.phoneLabel');
  const subjectLabel = getTranslation(locale, 'emails.inquiryNotificationToBusiness.subjectLabel');
  const messageHeading = getTranslation(locale, 'emails.inquiryNotificationToBusiness.messageHeading');
  const aiSummaryHeading = getTranslation(locale, 'emails.inquiryNotificationToBusiness.aiSummaryHeading');
  const aiReplyHeading = getTranslation(locale, 'emails.inquiryNotificationToBusiness.aiReplyHeading');
  const replyButton = getTranslation(locale, 'emails.inquiryNotificationToBusiness.replyButton', { customerEmail: options.customerEmail });

  const bodyHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 35%;">${customerLabel}</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${options.customerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">${emailLabel}</td>
        <td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${options.customerEmail}" style="color: #145bff;">${options.customerEmail}</a></td>
      </tr>
      ${options.customerPhone ? `
      <tr>
        <td style="padding: 8px 0; color: #64748b;">${phoneLabel}</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${options.customerPhone}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; color: #64748b;">${subjectLabel}</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${options.subject}</td>
      </tr>
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
      <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; display: block; margin-bottom: 8px;">${messageHeading}</span>
      <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${options.message}</p>
    </div>

    ${options.aiSummary ? `
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <span style="font-size: 12px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; display: block; margin-bottom: 4px;">${aiSummaryHeading}</span>
      <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 13px; line-height: 1.5;">${options.aiSummary}</p>
      ${options.aiSuggestedReply ? `
        <span style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; display: block; margin-bottom: 4px;">${aiReplyHeading}</span>
        <p style="margin: 0; color: #3b82f6; font-size: 12px; font-style: italic; line-height: 1.4;">&ldquo;${options.aiSuggestedReply}&rdquo;</p>
      ` : ''}
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 28px;">
      <a href="mailto:${options.customerEmail}?subject=Re: ${encodeURIComponent(options.subject)}" style="display: inline-block; background: #145bff; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        ${replyButton}
      </a>
    </div>
  `;

  const html = renderEmailShell({
    headerBadge: badge,
    headerTitle: title,
    bodyHtml,
    locale,
  });

  const text = getTranslation(locale, 'emails.inquiryNotificationToBusiness.text', {
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    message: options.message,
  });

  return sendEmail({
    to: options.businessEmail,
    subject: emailSubject,
    html,
    text,
    replyTo: options.customerEmail,
  });
}

/**
 * Sends a confirmation email to the customer after their inquiry is received
 */
export async function sendInquiryConfirmationToCustomer(options: {
  customerEmail: string;
  customerName: string;
  businessName: string;
  subject: string;
  message: string;
  locale?: string;
}) {
  const locale = options.locale || 'de';
  const emailSubject = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.subject', {
    businessName: options.businessName,
  });

  const title = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.title');
  const greeting = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.greeting', {
    customerName: options.customerName || getTranslation(locale, 'emails.common.customer'),
  });
  const body = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.body', {
    businessName: options.businessName,
  });
  const subjectLabel = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.subjectLabel', {
    subject: options.subject,
  });
  const inboxNotice = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.inboxNotice');

  const bodyHtml = `
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      ${greeting}<br/><br/>
      ${body}
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; display: block; margin-bottom: 6px;">${subjectLabel}</span>
      <p style="margin: 0; color: #1e293b; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${options.message}</p>
    </div>

    <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
      ${inboxNotice}
    </p>
  `;

  const html = renderEmailShell({
    headerBadge: APP_TITLE,
    headerTitle: title,
    bodyHtml,
    locale,
  });

  const text = getTranslation(locale, 'emails.inquiryConfirmationToCustomer.text', {
    customerName: options.customerName,
    businessName: options.businessName,
  });

  return sendEmail({
    to: options.customerEmail,
    subject: emailSubject,
    html,
    text,
  });
}

export interface BusinessRegistrationConfirmationOptions {
  to: string;
  businessName: string;
  locale?: string;
  city?: string;
  categoryName?: string;
}

/**
 * Sends a confirmation email to the business owner after their listing registration is submitted
 */
export async function sendBusinessRegistrationConfirmation(
  options: BusinessRegistrationConfirmationOptions
) {
  const locale = options.locale || 'de';
  const subject = getTranslation(locale, 'emails.businessRegistrationConfirmation.subject', {
    businessName: options.businessName,
  });

  const badge = `${APP_TITLE} • ${getTranslation(locale, 'emails.businessRegistrationConfirmation.badge')}`;
  const title = getTranslation(locale, 'emails.businessRegistrationConfirmation.title');
  const greeting = getTranslation(locale, 'emails.businessRegistrationConfirmation.greeting');
  const body = getTranslation(locale, 'emails.businessRegistrationConfirmation.body', {
    businessName: options.businessName,
  });
  const businessLabel = getTranslation(locale, 'emails.businessRegistrationConfirmation.businessLabel');
  const categoryLabel = getTranslation(locale, 'emails.businessRegistrationConfirmation.categoryLabel');
  const locationLabel = getTranslation(locale, 'emails.businessRegistrationConfirmation.locationLabel');
  const statusLabel = getTranslation(locale, 'emails.businessRegistrationConfirmation.statusLabel');
  const statusValue = getTranslation(locale, 'emails.businessRegistrationConfirmation.statusValue');
  const actionPrompt = getTranslation(locale, 'emails.businessRegistrationConfirmation.actionPrompt');
  const footerNote = getTranslation(locale, 'emails.businessRegistrationConfirmation.footerNote');

  const bodyHtml = `
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      ${greeting}<br/><br/>
      ${body}
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 40%; font-weight: 600;">${businessLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${options.businessName}</td>
        </tr>
        ${options.categoryName ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${categoryLabel}</td>
          <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${options.categoryName}</td>
        </tr>
        ` : ''}
        ${options.city ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${locationLabel}</td>
          <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${options.city}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${statusLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #f59e0b;">${statusValue}</td>
        </tr>
      </table>
    </div>

    <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0; color: #1e40af; font-size: 13px; font-weight: 700; line-height: 1.5;">
        ${actionPrompt}
      </p>
    </div>

    <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
      ${footerNote}
    </p>
  `;

  const html = renderEmailShell({
    headerBadge: badge,
    headerTitle: title,
    bodyHtml,
    locale,
  });

  const text = getTranslation(locale, 'emails.businessRegistrationConfirmation.text', {
    businessName: options.businessName,
  });

  return sendEmail({
    to: options.to,
    subject,
    html,
    text,
    replyTo: siteConfig.contact.email,
  });
}

export interface BusinessPublishedNotificationOptions {
  to: string;
  businessName: string;
  listingUrl: string;
  locale?: string;
  city?: string;
  categoryName?: string;
}

/**
 * Sends a celebration notification to the business owner when an admin publishes their listing
 */
export async function sendBusinessPublishedNotification(
  options: BusinessPublishedNotificationOptions
) {
  const locale = options.locale || 'de';
  const subject = getTranslation(locale, 'emails.businessPublishedNotification.subject', {
    businessName: options.businessName,
  });

  const badge = getTranslation(locale, 'emails.businessPublishedNotification.badge');
  const title = getTranslation(locale, 'emails.businessPublishedNotification.title');
  const greeting = getTranslation(locale, 'emails.businessPublishedNotification.greeting');
  const body = getTranslation(locale, 'emails.businessPublishedNotification.body', {
    businessName: options.businessName,
  });
  const businessLabel = getTranslation(locale, 'emails.businessPublishedNotification.businessLabel');
  const categoryLabel = getTranslation(locale, 'emails.businessPublishedNotification.categoryLabel');
  const locationLabel = getTranslation(locale, 'emails.businessPublishedNotification.locationLabel');
  const statusLabel = getTranslation(locale, 'emails.businessPublishedNotification.statusLabel');
  const statusValue = getTranslation(locale, 'emails.businessPublishedNotification.statusValue');
  const viewProfileBtn = getTranslation(locale, 'emails.businessPublishedNotification.viewProfileBtn');
  const nextStepsTitle = getTranslation(locale, 'emails.businessPublishedNotification.nextStepsTitle');
  const step1 = getTranslation(locale, 'emails.businessPublishedNotification.step1');
  const step2 = getTranslation(locale, 'emails.businessPublishedNotification.step2');
  const step3 = getTranslation(locale, 'emails.businessPublishedNotification.step3');

  const bodyHtml = `
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      ${greeting}<br/><br/>
      ${body}
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 35%; font-weight: 600;">${businessLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${options.businessName}</td>
        </tr>
        ${options.categoryName ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${categoryLabel}</td>
          <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${options.categoryName}</td>
        </tr>
        ` : ''}
        ${options.city ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${locationLabel}</td>
          <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">${options.city}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${statusLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #16a34a;">
            ${statusValue}
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${options.listingUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #145bff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(20, 91, 255, 0.25);">
        ${viewProfileBtn}
      </a>
      <p style="font-size: 12px; color: #94a3b8; margin: 10px 0 0 0;">
        <a href="${options.listingUrl}" style="color: #64748b; text-decoration: underline; word-break: break-all;">${options.listingUrl}</a>
      </p>
    </div>

    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
      <span style="font-size: 12px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; display: block; margin-bottom: 6px;">
        ${nextStepsTitle}
      </span>
      <ul style="margin: 0; padding-left: 18px; color: #1e40af; font-size: 13px; line-height: 1.6;">
        <li>${step1}</li>
        <li>${step2}</li>
        <li>${step3}</li>
      </ul>
    </div>
  `;

  const html = renderEmailShell({
    headerBadge: badge,
    headerTitle: title,
    bodyHtml,
    borderColor: '#16a34a',
    locale,
  });

  const text = getTranslation(locale, 'emails.businessPublishedNotification.text', {
    businessName: options.businessName,
    listingUrl: options.listingUrl,
  });

  return sendEmail({
    to: options.to,
    subject,
    html,
    text,
    replyTo: siteConfig.contact.email,
  });
}

export interface BusinessRejectedNotificationOptions {
  to: string;
  businessName: string;
  locale?: string;
  resubmitUrl?: string;
}

/**
 * Sends an email notification to the submitter when an admin rejects a submission
 * requesting them to submit from their official business email address with correct details.
 */
export async function sendBusinessRejectedNotification(
  options: BusinessRejectedNotificationOptions
) {
  const locale = options.locale || 'en';
  const subject = getTranslation(locale, 'emails.businessRejectedNotification.subject', {
    businessName: options.businessName,
  });

  const badge = getTranslation(locale, 'emails.businessRejectedNotification.badge');
  const title = getTranslation(locale, 'emails.businessRejectedNotification.title');
  const greeting = getTranslation(locale, 'emails.businessRejectedNotification.greeting');
  const body = getTranslation(locale, 'emails.businessRejectedNotification.body', {
    businessName: options.businessName,
  });
  const businessLabel = getTranslation(locale, 'emails.businessRejectedNotification.businessLabel');
  const statusLabel = getTranslation(locale, 'emails.businessRejectedNotification.statusLabel');
  const statusValue = getTranslation(locale, 'emails.businessRejectedNotification.statusValue');
  const instructionsTitle = getTranslation(locale, 'emails.businessRejectedNotification.instructionsTitle');
  const step1 = getTranslation(locale, 'emails.businessRejectedNotification.step1');
  const step2 = getTranslation(locale, 'emails.businessRejectedNotification.step2');
  const step3 = getTranslation(locale, 'emails.businessRejectedNotification.step3');
  const resubmitBtn = getTranslation(locale, 'emails.businessRejectedNotification.resubmitBtn');
  const footerNote = getTranslation(locale, 'emails.businessRejectedNotification.footerNote');
  const resubmitUrl = options.resubmitUrl || siteConfig.urls.base;

  const bodyHtml = `
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      ${greeting}<br/><br/>
      ${body}
    </p>

    <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 35%; font-weight: 600;">${businessLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${options.businessName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">${statusLabel}</td>
          <td style="padding: 6px 0; font-weight: 700; color: #e11d48;">
            ${statusValue}
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
      <span style="font-size: 13px; font-weight: 700; color: #0f172a; display: block; margin-bottom: 8px;">
        ${instructionsTitle}
      </span>
      <ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 13px; line-height: 1.7;">
        <li>${step1}</li>
        <li>${step2}</li>
        <li>${step3}</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${resubmitUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #145bff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(20, 91, 255, 0.25);">
        ${resubmitBtn}
      </a>
      <p style="font-size: 12px; color: #64748b; margin: 16px 0 0 0; line-height: 1.5;">
        ${footerNote}
      </p>
    </div>
  `;

  const html = renderEmailShell({
    headerBadge: badge,
    headerTitle: title,
    bodyHtml,
    borderColor: '#e11d48',
    locale,
  });

  const text = getTranslation(locale, 'emails.businessRejectedNotification.text', {
    businessName: options.businessName,
    resubmitUrl,
  });

  return sendEmail({
    to: options.to,
    subject,
    html,
    text,
    replyTo: siteConfig.contact.email,
  });
}

export interface NewListingNotificationOptions {
  businessName: string;
  legalForm?: string;
  categoryName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  hours?: string;
  description?: string;
  wantsGrowthResource?: boolean;
}

/**
 * Sends a single consolidated notification to admins when a new business listing is registered.
 */
export async function sendNewListingNotificationToAdmin(
  listing: NewListingNotificationOptions,
  locale: string = 'en'
) {
  const location = listing.city || listing.country || 'Global';
  const subject = getTranslation(locale, 'emails.adminNewListingNotification.subject', {
    businessName: listing.businessName,
    location,
  });

  const badge = `${APP_TITLE} • ${getTranslation(locale, 'emails.adminNewListingNotification.badge')}`;
  const title = getTranslation(locale, 'emails.adminNewListingNotification.title');
  const description = getTranslation(locale, 'emails.adminNewListingNotification.description');
  const businessNameLabel = getTranslation(locale, 'emails.adminNewListingNotification.businessNameLabel');
  const legalFormLabel = getTranslation(locale, 'emails.adminNewListingNotification.legalFormLabel');
  const categoryLabel = getTranslation(locale, 'emails.adminNewListingNotification.categoryLabel');
  const addressLabel = getTranslation(locale, 'emails.adminNewListingNotification.addressLabel');
  const postalCodeLabel = getTranslation(locale, 'emails.adminNewListingNotification.postalCodeLabel');
  const cityLabel = getTranslation(locale, 'emails.adminNewListingNotification.cityLabel');
  const stateLabel = getTranslation(locale, 'emails.adminNewListingNotification.stateLabel');
  const countryLabel = getTranslation(locale, 'emails.adminNewListingNotification.countryLabel');
  const phoneLabel = getTranslation(locale, 'emails.adminNewListingNotification.phoneLabel');
  const emailLabel = getTranslation(locale, 'emails.adminNewListingNotification.emailLabel');
  const websiteLabel = getTranslation(locale, 'emails.adminNewListingNotification.websiteLabel');
  const logoLabel = getTranslation(locale, 'emails.adminNewListingNotification.logoLabel');
  const hoursLabel = getTranslation(locale, 'emails.adminNewListingNotification.hoursLabel');
  const descriptionLabel = getTranslation(locale, 'emails.adminNewListingNotification.descriptionLabel');
  const growthResourcesLabel = getTranslation(locale, 'emails.adminNewListingNotification.growthResourcesLabel');
  const growthYes = getTranslation(locale, 'emails.adminNewListingNotification.growthYes');
  const growthNo = getTranslation(locale, 'emails.adminNewListingNotification.growthNo');
  const notSpecified = getTranslation(locale, 'emails.adminNewListingNotification.notSpecified');
  const none = getTranslation(locale, 'emails.adminNewListingNotification.none');
  const hoursDefault = getTranslation(locale, 'emails.adminNewListingNotification.hoursDefault');
  const noDescription = getTranslation(locale, 'emails.adminNewListingNotification.noDescription');
  const reviewButton = getTranslation(locale, 'emails.adminNewListingNotification.reviewButton');

  const bodyHtml = `
    <p style="font-size: 14px; color: #334155; margin-bottom: 20px; line-height: 1.5;">
      ${description}
    </p>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600; width: 38%;">${businessNameLabel}</td>
        <td style="padding: 10px 12px; font-weight: 700; color: #0D2B75; font-size: 15px;">${listing.businessName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${legalFormLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.legalForm || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${categoryLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.categoryName || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${addressLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.address || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${postalCodeLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.postalCode || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${cityLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.city || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${stateLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.state || notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${countryLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.country || 'Global'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${phoneLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.phone ? `<a href="tel:${listing.phone}" style="color: #145bff; text-decoration: none;">${listing.phone}</a>` : notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${emailLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600;">${listing.email ? `<a href="mailto:${listing.email}" style="color: #145bff; font-weight: 700; text-decoration: none;">${listing.email}</a>` : notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${websiteLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600;">${listing.website ? `<a href="${listing.website}" target="_blank" style="color: #145bff; text-decoration: underline;">${listing.website}</a>` : notSpecified}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${logoLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600;">${listing.logoUrl ? `<a href="${listing.logoUrl}" target="_blank" style="color: #145bff; text-decoration: underline;">${listing.logoUrl}</a>` : none}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">${hoursLabel}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e293b;">${listing.hours || hoursDefault}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9; background: #fafbfc;">
        <td style="padding: 10px 12px; color: #64748b; font-weight: 600; vertical-align: top;">${descriptionLabel}</td>
        <td style="padding: 10px 12px; font-weight: 400; color: #1e293b; line-height: 1.5; white-space: pre-wrap;">${listing.description || noDescription}</td>
      </tr>
      <tr style="border-bottom: 2px solid #e2e8f0; background: ${listing.wantsGrowthResource ? '#eff6ff' : '#ffffff'};">
        <td style="padding: 12px 12px; color: ${listing.wantsGrowthResource ? '#1e40af' : '#64748b'}; font-weight: 700;">${growthResourcesLabel}</td>
        <td style="padding: 12px 12px; font-weight: 700; color: ${listing.wantsGrowthResource ? '#1e40af' : '#64748b'};">
          ${listing.wantsGrowthResource ? `✅ ${growthYes}` : `❌ ${growthNo}`}
        </td>
      </tr>
    </table>

    <div style="margin-top: 28px; text-align: center;">
      <a href="${siteConfig.urls.base}/admin" style="display: inline-block; background: #0D2B75; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px;">
        ${reviewButton}
      </a>
    </div>
  `;

  const html = renderEmailShell({
    headerBadge: badge,
    headerTitle: title,
    bodyHtml,
    borderColor: '#0D2B75',
    locale,
  });

  const text = `New Business Registration: ${listing.businessName}
Legal Form: ${listing.legalForm || notSpecified}
Category: ${listing.categoryName || notSpecified}
Address: ${listing.address || notSpecified}, ${listing.postalCode || ''} ${listing.city || ''}, ${listing.state || ''}, ${listing.country || 'Global'}
Phone: ${listing.phone || notSpecified}
Email: ${listing.email || notSpecified}
Website: ${listing.website || notSpecified}
Logo: ${listing.logoUrl || none}
Hours: ${listing.hours || hoursDefault}
Description: ${listing.description || noDescription}
Growth Resources: ${listing.wantsGrowthResource ? growthYes : growthNo}

Review & Publish: ${siteConfig.urls.base}/admin`;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAILS,
    subject,
    html,
    text,
  });
}
