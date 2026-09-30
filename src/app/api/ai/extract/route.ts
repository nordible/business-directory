import { NextResponse } from 'next/server';
import { BusinessListing } from '@/lib/types';

interface ExtractRequestBody {
  url?: string;
  sourceType?: 'url' | 'document';
  documentName?: string;
  tenantId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExtractRequestBody;
    const { url, sourceType = 'url', documentName, tenantId = 't-berlin' } = body;

    if (!url && !documentName) {
      return NextResponse.json(
        { error: 'Entweder eine URL oder ein Dokument muss angegeben werden.' },
        { status: 400 }
      );
    }

    // Heuristics or AI extraction simulation
    const rawInput = (url || documentName || '').toLowerCase();

    let extracted: Omit<BusinessListing, 'id'> = {
      tenantId,
      name: 'Spree Kaffee & Rösterei',
      categoryId: 'cat-gastronomy',
      description: {
        de: 'Handwerklich gerösteter Spezialitätenkaffee, hausgemachtes Gebäck und entspannte Atmosphäre direkt am Wasser.',
        en: 'Artisan roasted specialty coffee, homemade pastries, and a relaxed atmosphere right by the river.'
      },
      address: 'Köpenicker Str. 42',
      city: '10179 Berlin',
      phone: '+49 30 55443322',
      website: url || 'https://spree-kaffee.berlin',
      rating: 4.9,
      reviewCount: 1,
      isVerified: true,
      isOpenNow: true,
      hours: 'Mo-Fr 08:00 - 18:00, Sa-So 09:00 - 19:00'
    };

    if (rawInput.includes('craft') || rawInput.includes('holz') || rawInput.includes('tischler') || rawInput.includes('werkstatt')) {
      extracted = {
        tenantId,
        name: 'Kreuzberger Holzwerkstatt & Design',
        categoryId: 'cat-crafts',
        description: {
          de: 'Maßgefertigte Möbel aus nachhaltigem Holz, individuelle Inneneinrichtung und Restaurierung antiker Schätze.',
          en: 'Custom furniture from sustainable timber, bespoke interior designs, and antique restoration.'
        },
        address: 'Oranienstraße 185',
        city: '10999 Berlin',
        phone: '+49 30 77889900',
        website: url || 'https://kreuzberg-holz.de',
        rating: 4.8,
        reviewCount: 1,
        isVerified: true,
        isOpenNow: true,
        hours: 'Mo-Fr 09:00 - 17:00'
      };
    } else if (rawInput.includes('tech') || rawInput.includes('software') || rawInput.includes('agentur') || rawInput.includes('digital')) {
      extracted = {
        tenantId,
        name: 'Nordic Code Studio',
        categoryId: 'cat-services',
        description: {
          de: 'Digitale Produktentwicklung, ergonomisches UI/UX-Design und Cloud-native Web-Anwendungen.',
          en: 'Digital product engineering, ergonomic UI/UX design, and cloud-native web applications.'
        },
        address: 'Torstraße 101',
        city: '10119 Berlin',
        phone: '+49 30 99001122',
        website: url || 'https://nordic-code.berlin',
        rating: 5.0,
        reviewCount: 1,
        isVerified: true,
        isOpenNow: true,
        hours: 'Mo-Fr 09:00 - 18:00'
      };
    } else if (rawInput.includes('arzt') || rawInput.includes('praxis') || rawInput.includes('health') || rawInput.includes('gesundheit')) {
      extracted = {
        tenantId,
        name: 'Praxis Dr. med. Weiland & Partner',
        categoryId: 'cat-health',
        description: {
          de: 'Ganzheitliche Allgemeinmedizin und Prävention mit modernen Diagnoseverfahren im Herzen der Stadt.',
          en: 'Holistic general medicine and preventive healthcare with state-of-the-art diagnostics.'
        },
        address: 'Friedrichstraße 210',
        city: '10969 Berlin',
        phone: '+49 30 22334455',
        website: url || 'https://praxis-weiland.de',
        rating: 4.7,
        reviewCount: 1,
        isVerified: true,
        isOpenNow: true,
        hours: 'Mo-Do 08:00 - 16:00, Fr 08:00 - 13:00'
      };
    } else if (url && url.length > 8) {
      // Derive a nice business name from the domain if user pasted a custom domain
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        const domainParts = parsed.hostname.replace('www.', '').split('.')[0];
        const formattedName = domainParts.charAt(0).toUpperCase() + domainParts.slice(1);
        extracted.name = `${formattedName} & Partner`;
        extracted.website = parsed.origin;
      } catch {
        // Fallback default
      }
    }

    const newListing: BusinessListing = {
      id: `ai-${Date.now()}`,
      ...extracted
    };

    return NextResponse.json({
      success: true,
      sourceType,
      listing: newListing
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown extraction error';
    return NextResponse.json(
      { error: 'Fehler bei der KI-Extraktion', details: message },
      { status: 500 }
    );
  }
}
