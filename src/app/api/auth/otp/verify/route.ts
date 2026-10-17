import { NextResponse } from 'next/server';
import { verifyOtpToken, createCustomerSessionToken, COOKIE_NAME } from '@/lib/auth-customer';

export async function POST(req: Request) {
  try {
    const { email, code, token } = await req.json();

    if (!email || !code || !token) {
      return NextResponse.json(
        { success: false, error: 'E-Mail, Bestätigungscode und Token sind erforderlich.' },
        { status: 400 }
      );
    }

    const isValid = verifyOtpToken(token, email, code);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Der eingegebene Code ist ungültig oder abgelaufen.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const sessionToken = createCustomerSessionToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      email: cleanEmail,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
