import { NextResponse } from 'next/server';
import { createOtpToken } from '@/lib/auth-customer';
import { sendCustomerOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, locale = 'de' } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error:
            locale === 'de'
              ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
              : 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = createOtpToken(cleanEmail, code);

    // Send email via mail.nordible.co API (in visitor's selected language)
    await sendCustomerOtpEmail(cleanEmail, code, locale);

    // In local dev, also print code to server console for testing convenience
    console.log(`[AUTH OTP GENERATED] For: ${cleanEmail} -> Code: ${code}`);

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
