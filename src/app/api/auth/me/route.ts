import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyCustomerSessionToken, COOKIE_NAME, isUserAdmin } from '@/lib/auth-customer';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, email: null, isAdmin: false });
    }

    const email = verifyCustomerSessionToken(sessionCookie);

    if (!email) {
      return NextResponse.json({ authenticated: false, email: null, isAdmin: false });
    }

    return NextResponse.json({
      authenticated: true,
      email,
      isAdmin: isUserAdmin(email),
    });
  } catch {
    return NextResponse.json({ authenticated: false, email: null, isAdmin: false });
  }
}
