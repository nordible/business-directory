import { NextResponse } from 'next/server';
import { BusinessListing } from '@/lib/types';
import { env } from '@/config/env';

interface ExtractRequestBody {
  url?: string;
  prompt?: string;
  sourceType?: 'url' | 'document' | 'prompt';
  documentName?: string;
  tenantId?: string;
}

interface OpenRouterExtractedData {
  name?: string;
  legalForm?: string;
  categoryName?: string;
  categoryId?: string;
  description?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  services?: string[];
  hours?: string;
}

/**
 * Strips script tags, style tags, and extra whitespace to extract readable text for LLM ingestion.
 */
function extractCleanTextFromHtml(html: string, maxLength = 8000): string {
  const withoutScripts = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  // Extract meta tags / title for high-signal context
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

  const title = ogTitleMatch?.[1] || titleMatch?.[1] || '';
  const desc = ogDescMatch?.[1] || metaDescMatch?.[1] || '';

  const cleanBody = withoutScripts
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  const preview = `Title: ${title}\nDescription: ${desc}\nPage Content:\n${cleanBody}`;
  return preview.slice(0, maxLength);
}

/**
 * Call OpenRouter API strictly to extract structured business details.
 */
async function extractWithOpenRouter(
  textSnippet: string,
  urlHint?: string
): Promise<OpenRouterExtractedData | null> {
  const apiKey = env.ai.openRouterApiKey;
  if (!apiKey) {
    return null;
  }

  const model = env.ai.openRouterModel;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const systemPrompt = `You are a specialized business directory extraction system.
Extract the company details from the given text snippet from a business website or user prompt.
Strictly return a single JSON object with these keys only (omit or leave empty string if not found):
- name (string: official business or company name)
- legalForm (string: e.g. GmbH, UG, AG, GbR, e.K., LLC, Corp, etc.)
- categoryName (string: primary industry or service type in German, e.g. Handwerk, IT-Dienstleistungen, Gastronomie, Beratung, Marketing, Gesundheit, etc.)
- description (string: concise summary of what the business does and services offered, max 2-3 sentences in German or primary site language)
- address (string: street and house number, e.g. Breitlacherstraße 101)
- postalCode (string: zip / postal code)
- city (string: city / town)
- state (string: state / province / Bundesland)
- country (string: country name, e.g. Deutschland or Germany)
- phone (string: official phone number)
- email (string: contact email)
- website (string: official website URL)
- services (array of strings: key services/products offered)
- hours (string: opening hours text if present)

Do NOT wrap in markdown \`\`\`json or add conversational text. Return ONLY the JSON object.`;

    const userPrompt = `URL: ${urlHint || 'Unknown'}\n\nContent:\n${textSnippet}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': env.siteUrl,
        'X-Title': 'Nordible Directory AI Extraction',
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

    // Clean any markdown code blocks if the model included them
    const cleaned = rawContent
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/m, '')
      .trim();

    // In case there is any surrounding text outside the outermost JSON { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    const jsonSubstring = firstBrace !== -1 && lastBrace !== -1 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;

    return JSON.parse(jsonSubstring) as OpenRouterExtractedData;
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

    const rawInput = (url || prompt || documentName || '').toLowerCase();

    // 1. First-class match: Nordible Technologies (official brand profile)
    if (rawInput.includes('nordible')) {
      const nordibleListing: BusinessListing = {
        id: `ai-${Date.now()}`,
        tenantId,
        name: 'Nordible Technologies',
        categoryId: 'cat-tech',
        categoryName: 'Software & IT-Services',
        legalForm: 'GmbH i.G.',
        description: {
          de: 'Spezialisierte Software-Agentur für maßgeschneiderte Webplattformen, autonome KI-Agenten, skalierbare Daten-Pipelines und Cloud-Architekturen.',
          en: 'Bespoke software engineering firm specializing in high-performance web platforms, autonomous AI agents, directory platforms, and cloud architectures.',
        },
        address: 'Breitlacherstraße 101',
        postalCode: '60489',
        city: 'Frankfurt am Main',
        state: 'Hessen',
        country: 'Deutschland',
        phone: '+49 1521 1065739',
        email: 'mail@nordible.co',
        website: 'https://nordible.co',
        services: [
          'Web-Entwicklung',
          'KI-Integrationen',
          'Cloud-Architektur',
          'Next.js Plattformen',
        ],
        rating: 5.0,
        reviewCount: 38,
        isVerified: true,
        isOpenNow: true,
        hours: 'Mo - Fr: 09:00 - 18:00 Uhr',
      };

      return NextResponse.json({
        success: true,
        sourceType,
        listing: nordibleListing,
      });
    }

    // Default baseline extracted listing
    const extracted: Omit<BusinessListing, 'id'> = {
      tenantId,
      name: 'Unternehmenseintrag',
      categoryId: 'cat-services',
      categoryName: 'Dienstleistungen',
      description: {
        de: 'Innovatives Dienstleistungsunternehmen mit erstklassiger Qualität und lokalem Kundenservice.',
        en: 'Innovative service business with premier quality and reliable customer focus.',
      },
      address: '',
      postalCode: '',
      city: '',
      state: '',
      country: 'Deutschland',
      phone: '',
      email: '',
      website: url || '',
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      isOpenNow: true,
      hours: 'Mo - Fr: 09:00 - 18:00 Uhr',
      services: [],
    };

    let pageHtml = '';
    let extractedText = '';

    // 2. Fetch live webpage if URL provided
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const htmlRes = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NordibleDirectoryBot/1.0; +https://nordible.co)',
            Accept: 'text/html,application/xhtml+xml',
          },
        });
        clearTimeout(timeout);

        if (htmlRes.ok) {
          pageHtml = await htmlRes.text();
          extractedText = extractCleanTextFromHtml(pageHtml);
        }
      } catch (fetchErr) {
        console.warn('[AI Extract] Fetch warning:', fetchErr);
      }
    } else if (prompt) {
      extractedText = prompt;
    }

    // 3. AI Extraction via OpenRouter (Strictly for business details extraction)
    const openRouterResult = extractedText
      ? await extractWithOpenRouter(extractedText, url || prompt)
      : null;

    if (openRouterResult) {
      if (openRouterResult.name) extracted.name = openRouterResult.name;
      if (openRouterResult.legalForm) extracted.legalForm = openRouterResult.legalForm;
      if (openRouterResult.categoryName) {
        extracted.categoryName = openRouterResult.categoryName;
        // Map category ID heuristics
        const lowerCat = openRouterResult.categoryName.toLowerCase();
        if (/handwerk|bau|elektro|sanitär|schrein/i.test(lowerCat)) extracted.categoryId = 'cat-craft';
        else if (/tech|software|it|ki|digital/i.test(lowerCat)) extracted.categoryId = 'cat-tech';
        else if (/gastro|restaurant|café|bar|hotel/i.test(lowerCat)) extracted.categoryId = 'cat-food';
        else if (/gesund|arzt|praxis|zahn|pflege/i.test(lowerCat)) extracted.categoryId = 'cat-health';
        else if (/recht|anwalt|notar|steuer/i.test(lowerCat)) extracted.categoryId = 'cat-legal';
      }
      if (openRouterResult.address) extracted.address = openRouterResult.address;
      if (openRouterResult.postalCode) extracted.postalCode = openRouterResult.postalCode;
      if (openRouterResult.city) extracted.city = openRouterResult.city;
      if (openRouterResult.state) extracted.state = openRouterResult.state;
      if (openRouterResult.country) extracted.country = openRouterResult.country;
      if (openRouterResult.phone) extracted.phone = openRouterResult.phone;
      if (openRouterResult.email) extracted.email = openRouterResult.email;
      if (openRouterResult.website) extracted.website = openRouterResult.website;
      if (openRouterResult.hours) extracted.hours = openRouterResult.hours;
      if (openRouterResult.services && Array.isArray(openRouterResult.services)) {
        extracted.services = openRouterResult.services;
      }
      if (openRouterResult.description) {
        extracted.description = {
          de: openRouterResult.description,
          en: openRouterResult.description,
        };
      }
    } else {
      // 4. Heuristic Fallback if OpenRouter key is not configured or remote call failed
      if (pageHtml) {
        const titleMatch = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
        const ogTitleMatch = pageHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const foundTitle = ogTitleMatch?.[1] || titleMatch?.[1];

        const descMatch = pageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const ogDescMatch = pageHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        const foundDesc = ogDescMatch?.[1] || descMatch?.[1];

        if (foundTitle) {
          extracted.name = foundTitle.split(/[-–|•]/)[0].trim();
        }

        if (foundDesc) {
          extracted.description = {
            de: foundDesc.trim(),
            en: foundDesc.trim(),
          };
        }

        // Search for phone regex in html
        const phoneMatch = pageHtml.match(/(?:tel:|href=["']tel:|\+49|0049|0[1-9][0-9]{1,4}[\s/-]?)[0-9\s/–-]{6,15}/i);
        if (phoneMatch) {
          extracted.phone = phoneMatch[0].replace(/tel:|href=["']|["']/gi, '').trim();
        }

        // Search for email
        const emailMatch = pageHtml.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          extracted.email = emailMatch[0];
        }

        // Search for German PLZ and City: 5 digits followed by City
        const plzMatch = pageHtml.match(/\b([0-9]{5})\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)\b/);
        if (plzMatch) {
          extracted.postalCode = plzMatch[1];
          extracted.city = plzMatch[2];
        }
      }

      // Fallback domain name parsing if name is still empty
      if (url && (!extracted.name || extracted.name === 'Unternehmenseintrag')) {
        try {
          const parsed = new URL(url);
          const domainParts = parsed.hostname.replace('www.', '').split('.')[0];
          extracted.name = domainParts.charAt(0).toUpperCase() + domainParts.slice(1);
          if (!extracted.website) extracted.website = parsed.origin;
        } catch {
          // ignore
        }
      }
    }

    const newListing: BusinessListing = {
      id: `ai-${Date.now()}`,
      ...extracted,
    };

    return NextResponse.json({
      success: true,
      sourceType,
      listing: newListing,
      poweredBy: openRouterResult ? 'openrouter-ai' : 'metadata-heuristics',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown extraction error';
    return NextResponse.json(
      { error: 'Fehler bei der KI-Extraktion', details: message },
      { status: 500 }
    );
  }
}
