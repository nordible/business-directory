import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyCustomerSessionToken, COOKIE_NAME } from '@/lib/auth-customer';
import { getConversationsByCustomerEmail } from '@/lib/db/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get('email');

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
    const sessionEmail = sessionCookie ? verifyCustomerSessionToken(sessionCookie) : null;

    const targetEmail = sessionEmail || emailParam;

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: 'Nicht authentifiziert. Bitte melden Sie sich an.' },
        { status: 401 }
      );
    }

    const conversations = await getConversationsByCustomerEmail(targetEmail);
    return NextResponse.json({ success: true, conversations });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
