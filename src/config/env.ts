/**
 * Centralized Strict Environment Configuration
 * Zero hardcoded fallback strings. All values are read via static literal `${process.env.*}` extraction
 * to support Next.js compiler inlining. Fails fast if any variable is missing, undefined, empty, or invalid.
 */

const isServer = typeof window === 'undefined';

function validate(
  name: string,
  raw: string,
  validator?: (v: string) => boolean,
  expectedFormat?: string
): string {
  if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
    throw new Error(
      `[FATAL ENV ERROR] Environment variable "${name}" is missing, undefined, or empty. Server cannot start without a valid .env configuration.`
    );
  }
  const clean = raw.trim();
  if (validator && !validator(clean)) {
    throw new Error(
      `[FATAL ENV ERROR] Environment variable "${name}" has an invalid format. Expected: ${expectedFormat || 'valid format'}, but received: "${clean.slice(0, 10)}..."`
    );
  }
  return clean;
}

// Strict Format Validators
const isHttpUrl = (v: string) => /^https?:\/\/.+/i.test(v);
const isGaId = (v: string) => /^G-[A-Z0-9]+$/i.test(v);
const isOpenRouterKey = (v: string) => /^sk-or-v1-[a-zA-Z0-9]{40,}$/.test(v);
const isModelSlug = (v: string) => /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(v);
const isEmailList = (v: string) =>
  v.split(',').every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()));

// 1. Client-accessible variables (statically inlined by Next.js compiler via literal property access)
const siteUrl = validate(
  'NEXT_PUBLIC_SITE_URL',
  `${process.env.NEXT_PUBLIC_SITE_URL}`,
  isHttpUrl,
  'valid URL starting with http:// or https://'
);

const gaId = validate(
  'NEXT_PUBLIC_GA_ID',
  `${process.env.NEXT_PUBLIC_GA_ID}`,
  isGaId,
  'valid Google Analytics measurement ID (e.g. G-XXXXX)'
);

// 2. Server-only variables (strictly validated on the server with zero fallbacks)
const supabaseUrl = isServer
  ? validate(
      'SUPABASE_URL',
      `${process.env.SUPABASE_URL}`,
      isHttpUrl,
      'valid Supabase URL starting with https://'
    )
  : '';

const supabaseAnonKey = isServer
  ? validate(
      'SUPABASE_ANON_KEY',
      `${process.env.SUPABASE_ANON_KEY}`,
      (v) => v.length > 20,
      'valid non-empty Supabase API key'
    )
  : '';

const mailApiUrl = isServer
  ? validate(
      'MAIL_API_URL',
      `${process.env.MAIL_API_URL}`,
      isHttpUrl,
      'valid Mail API URL starting with https://'
    )
  : '';

const mailApiSecret = isServer
  ? validate(
      'MAIL_API_SECRET',
      `${process.env.MAIL_API_SECRET}`,
      (v) => v.length > 0,
      'non-empty secret string'
    )
  : '';

const adminSecret = isServer
  ? validate(
      'ADMIN_SECRET',
      `${process.env.ADMIN_SECRET}`,
      (v) => v.length > 0,
      'non-empty admin secret string'
    )
  : '';

const adminEmailsRaw = isServer
  ? validate(
      'ADMIN_EMAILS',
      `${process.env.ADMIN_EMAILS}`,
      isEmailList,
      'comma-separated list of valid email addresses'
    )
  : '';

const openRouterApiKey = isServer
  ? validate(
      'OPENROUTER_API_KEY',
      `${process.env.OPENROUTER_API_KEY}`,
      isOpenRouterKey,
      'valid OpenRouter API key starting with sk-or-v1-'
    )
  : '';

const openRouterModel = isServer
  ? validate(
      'OPENROUTER_MODEL',
      `${process.env.OPENROUTER_MODEL}`,
      isModelSlug,
      'valid OpenRouter model identifier (e.g. deepseek/deepseek-chat)'
    )
  : '';

export const env = {
  // Public Client Variables
  siteUrl,
  gaId,

  // Database & Supabase (Server-Only)
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  },

  // Email & Admin Service (Server-Only)
  mail: {
    apiUrl: mailApiUrl,
    apiSecret: mailApiSecret,
    adminEmails: adminEmailsRaw ? adminEmailsRaw.split(',').map((s) => s.trim().toLowerCase()) : [],
    adminSecret: adminSecret,
  },

  // AI Business Onboarding Extraction (Server-Only)
  ai: {
    openRouterApiKey,
    openRouterModel,
  },

  // Node Environment
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type EnvConfig = typeof env;
