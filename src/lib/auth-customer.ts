import crypto from 'crypto';

const AUTH_SECRET = process.env.MAIL_API_SECRET || 'nordible-secure-auth-secret-key-321';
const COOKIE_NAME = 'nordible_customer_session';

export { COOKIE_NAME };

interface OtpPayload {
  email: string;
  code: string;
  exp: number;
}

interface SessionPayload {
  email: string;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64').toString('utf8');
}

function sign(payloadStr: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('hex');
}

/**
 * Creates an HMAC-signed token encapsulating the OTP code and expiration (15 minutes).
 */
export function createOtpToken(email: string, code: string): string {
  const payload: OtpPayload = {
    email: email.toLowerCase().trim(),
    code: code.trim(),
    exp: Date.now() + 15 * 60 * 1000, // 15 mins
  };
  const str = JSON.stringify(payload);
  const sig = sign(str);
  return `${base64UrlEncode(str)}.${sig}`;
}

/**
 * Validates the OTP code against the signed token.
 */
export function verifyOtpToken(token: string, email: string, inputCode: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [strB64, sig] = parts;
    const str = base64UrlDecode(strB64);
    const expectedSig = sign(str);

    if (sig !== expectedSig) return false;

    const payload: OtpPayload = JSON.parse(str);
    if (payload.exp < Date.now()) return false;
    if (payload.email !== email.toLowerCase().trim()) return false;
    if (payload.code !== inputCode.trim()) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a signed customer session token (valid for 30 days).
 */
export function createCustomerSessionToken(email: string): string {
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  const str = JSON.stringify(payload);
  const sig = sign(str);
  return `${base64UrlEncode(str)}.${sig}`;
}

/**
 * Verifies a customer session token and returns the authenticated email.
 */
export function verifyCustomerSessionToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [strB64, sig] = parts;
    const str = base64UrlDecode(strB64);
    const expectedSig = sign(str);

    if (sig !== expectedSig) return null;

    const payload: SessionPayload = JSON.parse(str);
    if (payload.exp < Date.now()) return null;

    return payload.email;
  } catch {
    return null;
  }
}

export const ADMIN_EMAILS = [
  'mail@nordible.co',
  'nordiblesolutions@gmail.com',
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((s) => s.trim().toLowerCase()) : []),
];

export function isUserAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.MAIL_API_SECRET || 'Golya123';

/**
 * Checks whether an incoming HTTP request is authenticated as an admin.
 * Checks:
 * 1. An 'x-admin-key' header matching ADMIN_SECRET
 * 2. An Authorization header with Bearer matching ADMIN_SECRET or signed admin session
 * 3. A signed customer session cookie whose email matches ADMIN_EMAILS
 */
export function verifyAdminRequest(req: Request): { authorized: boolean; email?: string } {
  // Check header secret
  const adminKey = req.headers.get('x-admin-key');
  if (adminKey && adminKey === ADMIN_SECRET) {
    return { authorized: true, email: 'mail@nordible.co' };
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SECRET) {
      return { authorized: true, email: 'mail@nordible.co' };
    }
    const sessionEmail = verifyCustomerSessionToken(token);
    if (sessionEmail && isUserAdmin(sessionEmail)) {
      return { authorized: true, email: sessionEmail };
    }
  }

  // Check cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (match) {
    const sessionEmail = verifyCustomerSessionToken(match[1]);
    if (sessionEmail && isUserAdmin(sessionEmail)) {
      return { authorized: true, email: sessionEmail };
    }
  }

  return { authorized: false };
}
