import { NextResponse } from 'next/server';
import { BusinessListing } from '@/lib/types';
import { env } from '@/config/env';
import { siteConfig } from '@/config/site';

interface ExtractRequestBody {
  url?: string;
  prompt?: string;
  sourceType?: 'url' | 'document' | 'prompt';
  documentName?: string;
  tenantId?: string;
}

interface ExtractedBusinessData {
  name?: string;
  legalForm?: string;
  categoryName?: string;
  description?: string;
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
  services?: string[];
}

const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Extracts structured Schema.org JSON-LD data from HTML before any scripts are removed.
 */
function extractJsonLdData(html: string): Partial<ExtractedBusinessData> {
  const result: Partial<ExtractedBusinessData> = {};
  const jsonLdRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];

      for (const item of items) {
        if (!item || typeof item !== 'object') continue;

        if (item.name && !result.name) result.name = String(item.name).trim();
        if (item.legalName && !result.legalForm) result.legalForm = String(item.legalName).trim();
        if (item.description && !result.description) result.description = String(item.description).trim();
        if (item.telephone && !result.phone) result.phone = String(item.telephone).trim();
        if (item.email && !result.email) result.email = String(item.email).trim();
        if (item.url && !result.website) result.website = String(item.url).trim();

        const addr = item.address;
        if (addr && typeof addr === 'object') {
          if (addr.streetAddress && !result.address) result.address = String(addr.streetAddress).trim();
          if (addr.postalCode && !result.postalCode) result.postalCode = String(addr.postalCode).trim();
          if (addr.addressLocality && !result.city) result.city = String(addr.addressLocality).trim();
          if (addr.addressRegion && !result.state) result.state = String(addr.addressRegion).trim();
          if (addr.addressCountry && !result.country) result.country = String(addr.addressCountry).trim();
        } else if (typeof addr === 'string' && !result.address) {
          result.address = addr.trim();
        }

        if (item.foundingLocation && !result.city) {
          result.city = String(item.foundingLocation).trim();
        }

        const image = item.image || item.logo;
        if (image && !result.logoUrl) {
          result.logoUrl = typeof image === 'string' ? image : image.url || undefined;
        }
      }
    } catch {
      // Ignore malformed JSON-LD scripts
    }
  }

  return result;
}

/**
 * Strips non-content tags and returns high-signal plain text for LLM processing.
 */
function extractCleanTextFromHtml(html: string, maxLength = 7000): string {
  const withoutNoise = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

  const title = ogTitleMatch?.[1] || titleMatch?.[1] || '';
  const desc = ogDescMatch?.[1] || metaDescMatch?.[1] || '';

  const cleanBody = withoutNoise
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  return `Title: ${title}\nDescription: ${desc}\nPage Content:\n${cleanBody}`.slice(0, maxLength);
}

/**
 * Attempts to fetch a linked contact or legal subpage if available.
 */
async function fetchSubpageText(baseUrl: string, html: string): Promise<string> {
  try {
    const origin = new URL(baseUrl).origin;
    const linkMatch = html.match(/href=["'](\/[^"']*(?:about|contact|legal|impressum|kontakt|imprint)[^"']*)["']/i);
    const targetUrl = linkMatch?.[1] ? `${origin}${linkMatch[1]}` : null;
    if (!targetUrl) return '';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': BROWSER_USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const subHtml = await res.text();
      return `\n\n[Contact / About / Legal Subpage Text]:\n${extractCleanTextFromHtml(subHtml, 3000)}`;
    }
  } catch {
    // Graceful fallback if subpage doesn't exist
  }
  return '';
}

/**
 * Calls OpenRouter AI with a single uniform instruction to extract all database fields in the website's native language.
 */
async function extractWithOpenRouter(
  textSnippet: string,
  urlHint?: string,
  structuredHint?: Partial<ExtractedBusinessData>
): Promise<ExtractedBusinessData | null> {
  const apiKey = env.ai.openRouterApiKey;
  if (!apiKey) return null;

  const model = env.ai.openRouterModel;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const systemPrompt = `You are a global AI business directory extraction engine.
Analyze the company information from the given website text.
Detect the website's primary language. Output all text fields (categoryName, description, services) strictly in that detected language (e.g. if English website, output in English; if German website, output in German; if French website, output in French).
Never translate content into another language unless the source website is primarily in that language.
Extract the physical street address (street name and house number). If no physical street address is explicitly listed, infer the central commercial area or city address so that 'address' is never empty.

Strictly return a single JSON object with these keys only (leave empty string or [] if not found):
- name (string: official business name)
- legalForm (string: e.g. LLC, Inc., Ltd., GmbH, Corp., etc. if applicable)
- categoryName (string: primary industry/service category in the website's language)
- description (string: concise 2-3 sentence overview of business and offerings in the website's language)
- address (string: street address or central commercial district, never empty)
- postalCode (string: zip / postal code)
- city (string: city name)
- state (string: state / province / region)
- country (string: country name in the website's language or English)
- phone (string: official telephone number)
- email (string: contact email address)
- website (string: official website URL)
- logoUrl (string: logo or primary brand image URL if found)
- hours (string: standard operating hours if found, e.g. "Mon - Fri: 09:00 - 18:00")
- services (array of strings: key offerings in the website's language)

Do NOT wrap in markdown \`\`\`json or add conversational text. Return ONLY the JSON object.`;

    const userPrompt = `URL: ${urlHint || 'Unknown'}\nStructured Data Hint: ${JSON.stringify(structuredHint || {})}\n\nContent:\n${textSnippet}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': env.siteUrl,
        'X-Title': `${siteConfig.appName} AI Extraction`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[OpenRouter Extract] API returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const cleaned = rawContent
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/m, '')
      .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    const jsonSubstring = firstBrace !== -1 && lastBrace !== -1 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;

    return JSON.parse(jsonSubstring) as ExtractedBusinessData;
  } catch (err) {
    console.warn('[OpenRouter Extract] Error during LLM extraction:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExtractRequestBody;
    const {
      url,
      prompt,
      sourceType = url ? 'url' : prompt ? 'prompt' : 'document',
      documentName,
      tenantId = 't-1',
    } = body;

    if (!url && !documentName && !prompt) {
      return NextResponse.json(
        { error: 'Entweder eine URL, ein Prompt oder ein Dokument muss angegeben werden.' },
        { status: 400 }
      );
    }

    let pageHtml = '';
    let extractedText = '';
    let structuredData: Partial<ExtractedBusinessData> = {};

    // 1. Fetch live webpage if URL provided
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const htmlRes = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': BROWSER_USER_AGENT,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        });
        clearTimeout(timeout);

        if (htmlRes.ok) {
          pageHtml = await htmlRes.text();
          // Extract JSON-LD first before stripping script tags
          structuredData = extractJsonLdData(pageHtml);
          extractedText = extractCleanTextFromHtml(pageHtml);

          // If address is still missing, attempt fetching linked contact / impressum subpage
          if (!structuredData.address) {
            const subpageText = await fetchSubpageText(url, pageHtml);
            if (subpageText) {
              extractedText += subpageText;
            }
          }
        }
      } catch (fetchErr) {
        console.warn('[AI Extract] Fetch warning:', fetchErr);
      }
    } else if (prompt) {
      extractedText = prompt;
    }

    // 2. AI Extraction via OpenRouter
    const aiResult = extractedText
      ? await extractWithOpenRouter(extractedText, url || prompt, structuredData)
      : null;

    // Merge structured data hints with AI results
    const combined: ExtractedBusinessData = {
      ...structuredData,
      ...(aiResult || {}),
    };

    // Fallback: derive name from domain if still empty
    let fallbackName = combined.name || '';
    if (!fallbackName && url) {
      try {
        const parsed = new URL(url);
        const domainParts = parsed.hostname.replace(/^www\./, '').split('.')[0];
        fallbackName = domainParts.charAt(0).toUpperCase() + domainParts.slice(1);
      } catch {
        fallbackName = 'Business';
      }
    }

    // Guarantee address field is never empty so database submission never fails
    const resolvedCity = combined.city || structuredData.city || '';
    let resolvedAddress = combined.address || structuredData.address || '';
    if (!resolvedAddress) {
      resolvedAddress = resolvedCity ? `${resolvedCity} Center` : 'Central Business District';
    }

    const finalDescription = combined.description || '';

    const newListing: BusinessListing = {
      id: `ai-${Date.now()}`,
      tenantId,
      name: fallbackName || 'Business Listing',
      legalForm: combined.legalForm || undefined,
      categoryId: 'cat-all',
      categoryName: combined.categoryName || 'General Business',
      description: finalDescription,
      address: resolvedAddress,
      postalCode: combined.postalCode || undefined,
      city: resolvedCity || 'Global',
      state: combined.state || undefined,
      country: combined.country || undefined,
      phone: combined.phone || '',
      email: combined.email || undefined,
      website: combined.website || url || '',
      logoUrl: combined.logoUrl || structuredData.logoUrl || undefined,
      hours: combined.hours || 'Mon - Fri: 09:00 - 18:00',
      services: combined.services && combined.services.length > 0 ? combined.services : undefined,
      isVerified: false,
      isOpenNow: true,
      isPublished: false,
    };

    return NextResponse.json({
      success: true,
      sourceType,
      listing: newListing,
      poweredBy: aiResult ? 'openrouter-ai' : 'metadata-heuristics',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown extraction error';
    return NextResponse.json(
      { error: 'Fehler bei der KI-Extraktion', details: message },
      { status: 500 }
    );
  }
}
