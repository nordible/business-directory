import { NextResponse } from 'next/server';
import { BusinessListing } from '@/lib/types';

interface ExtractRequestBody {
  url?: string;
  prompt?: string;
  sourceType?: 'url' | 'document' | 'prompt';
  documentName?: string;
  tenantId?: string;
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
        description: {
          de: 'Spezialisierte Software-Agentur für maßgeschneiderte Webplattformen, autonome KI-Agenten, skalierbare Daten-Pipelines und Cloud-Architekturen.',
          en: 'Bespoke software engineering firm specializing in high-performance web platforms, autonomous AI agents, directory platforms, and cloud architectures.',
        },
        address: 'Westhafen Tower, Speicherstraße 55',
        city: '60327 Frankfurt am Main',
        phone: '+49 69 9999 8888',
        website: 'https://nordible.co',
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

    // Default template listing
    const extracted: Omit<BusinessListing, 'id'> = {
      tenantId,
      name: 'Unternehmenseintrag',
      categoryId: 'cat-services',
      description: {
        de: 'Innovatives Dienstleistungsunternehmen mit erstklassiger Qualität und lokalem Service.',
        en: 'Innovative service business with premier quality and reliable customer focus.',
      },
      address: 'Hauptstraße 10',
      city: 'Berlin',
      phone: '+49 30 1234567',
      website: url || 'https://example.com',
      rating: 4.8,
      reviewCount: 12,
      isVerified: true,
      isOpenNow: true,
      hours: 'Mo - Fr: 09:00 - 18:00 Uhr',
    };

    // 2. Live Web Scraper / Metadata Extractor if a real URL was provided
    if (url && url.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const htmlRes = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NordibleDirectoryBot/1.0; +https://nordible.co)',
            Accept: 'text/html',
          },
        });
        clearTimeout(timeout);

        if (htmlRes.ok) {
          const html = await htmlRes.text();

          // Extract title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          const foundTitle = ogTitleMatch?.[1] || titleMatch?.[1];

          // Extract meta description
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
          const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
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

          extracted.website = url;
        }
      } catch {
        // Fallback to domain parsing if remote fetch timed out or blocked
        try {
          const parsed = new URL(url);
          const domainParts = parsed.hostname.replace('www.', '').split('.')[0];
          extracted.name = domainParts.charAt(0).toUpperCase() + domainParts.slice(1);
          extracted.website = parsed.origin;
        } catch {
          // ignore
        }
      }
    }

    // 3. Natural Language Prompt Parsing (for user free-text or autonomous AI agents)
    if (prompt && prompt.length > 5) {
      const cleanPrompt = prompt.trim();

      // Heuristic extraction for company name
      const nameMatch = cleanPrompt.match(/(?:Trage|Füge|Add|Firma|Name|Unternehmen)[:\s]+([^,.\n]+)/i);
      if (nameMatch?.[1]) {
        extracted.name = nameMatch[1].trim();
      }

      // City extraction
      const cityMatch = cleanPrompt.match(/(?:in|aus|Ort|Stadt|City)[:\s]+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)/);
      if (cityMatch?.[1]) {
        extracted.city = cityMatch[1].trim();
      }

      // Phone extraction
      const phoneMatch = cleanPrompt.match(/(\+?[0-9][0-9\s/–-]{7,}[0-9])/);
      if (phoneMatch?.[1]) {
        extracted.phone = phoneMatch[1].trim();
      }

      // Website extraction from prompt
      const urlInPrompt = cleanPrompt.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/);
      if (urlInPrompt?.[1]) {
        const matched = urlInPrompt[1].trim();
        extracted.website = matched.startsWith('http') ? matched : `https://${matched}`;
      }

      // Category detection
      if (/tech|software|ki|ai|cloud|digital|it/i.test(cleanPrompt)) {
        extracted.categoryId = 'cat-tech';
      } else if (/craft|handwerk|bau|holz|tischler|elektro/i.test(cleanPrompt)) {
        extracted.categoryId = 'cat-craft';
      } else if (/café|kaffee|restaurant|essen|bäckerei|bar/i.test(cleanPrompt)) {
        extracted.categoryId = 'cat-food';
      }

      // Description
      extracted.description = {
        de: cleanPrompt,
        en: cleanPrompt,
      };
    } else if (rawInput.includes('craft') || rawInput.includes('holz') || rawInput.includes('tischler') || rawInput.includes('werkstatt')) {
      extracted.categoryId = 'cat-craft';
      if (!extracted.name || extracted.name === 'Unternehmenseintrag') {
        extracted.name = 'Kreuzberger Holzwerkstatt & Design';
      }
    } else if (rawInput.includes('tech') || rawInput.includes('software') || rawInput.includes('agentur') || rawInput.includes('digital')) {
      extracted.categoryId = 'cat-tech';
      if (!extracted.name || extracted.name === 'Unternehmenseintrag') {
        extracted.name = 'Nordic Code Studio';
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
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown extraction error';
    return NextResponse.json(
      { error: 'Fehler bei der KI-Extraktion', details: message },
      { status: 500 }
    );
  }
}
