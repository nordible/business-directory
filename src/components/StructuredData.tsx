'use client';

import React from 'react';
import { Locale } from '@/lib/types';

interface StructuredDataProps {
  locale: Locale;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const isDe = locale === 'de';

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://directory.nordible.co/#website',
        url: 'https://directory.nordible.co/',
        name: isDe ? 'Nordible Directory | Verifiziertes Branchenverzeichnis' : 'Nordible Directory | Verified Business Directory',
        description: isDe
          ? 'Offizielles Verzeichnis verifizierter Unternehmen in Frankfurt am Main, Berlin, München, Hamburg und der DACH-Region.'
          : 'Official directory of verified enterprises across Frankfurt, Berlin, Munich, Hamburg, and the DACH region.',
        publisher: {
          '@type': 'Organization',
          name: 'Nordible Technologies',
          url: 'https://nordible.co/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://directory.nordible.co/images/logos/nordible-icon.png',
          },
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://directory.nordible.co/#organization',
        name: 'Nordible Technologies',
        url: 'https://nordible.co/',
        logo: 'https://directory.nordible.co/images/logos/nordible-icon.png',
        sameAs: [
          'https://linkedin.com/company/nordible',
          'https://invoice.nordible.co',
          'https://mail.nordible.co',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: isDe
              ? 'Wie kann ich mein Unternehmen in das Nordible Directory aufnehmen lassen?'
              : 'How can I get my business listed in the Nordible Directory?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isDe
                ? 'Senden Sie Ihre Unternehmensdaten (Name, Website, Adresse, Branche) einfach per E-Mail an mail@nordible.co. Unser Team prüft und schaltet Ihren Eintrag zeitnah frei.'
                : 'Simply email your company details (name, website, address, industry) to mail@nordible.co. Our team will verify and activate your listing promptly.',
            },
          },
          {
            '@type': 'Question',
            name: isDe
              ? 'Ist der Unternehmenseintrag im Verzeichnis kostenlos?'
              : 'Is the business listing in the directory free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isDe
                ? 'Ja, der Basiseintrag für verifizierte Unternehmen und regionale Betriebe ist dauerhaft kostenlos.'
                : 'Yes, basic verified listings for legitimate regional businesses and partners are permanently free.',
            },
          },
          {
            '@type': 'Question',
            name: isDe
              ? 'In welchen Städten und Regionen listet das Verzeichnis Firmen?'
              : 'Which cities and regions does the directory cover?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isDe
                ? 'Wir listen Betriebe schwerpunktmäßig in Frankfurt am Main, Berlin, München, Hamburg, Wien, Zürich sowie ausgewählte internationale Partner.'
                : 'We primarily list companies in Frankfurt am Main, Berlin, Munich, Hamburg, Vienna, Zurich, as well as selected international partners.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
