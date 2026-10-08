'use client';

import React from 'react';
import { Locale } from '@/lib/types';
import { siteConfig } from '@/config/site';
import { useTranslation } from '@/lib/i18n';

interface StructuredDataProps {
  locale: Locale;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const { t } = useTranslation();

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.urls.base}/#website`,
        url: `${siteConfig.urls.base}/`,
        inLanguage: locale,
        name: `${siteConfig.appName} | ${t('nav.tagline')}`,
        description: t('footer.aboutDesc'),
        publisher: {
          '@type': 'Organization',
          name: siteConfig.company.name,
          url: siteConfig.company.website,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.urls.base}${siteConfig.assets.logoIcon}`,
          },
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteConfig.urls.base}/#organization`,
        name: siteConfig.company.name,
        url: siteConfig.company.website,
        logo: `${siteConfig.urls.base}${siteConfig.assets.logoIcon}`,
        sameAs: [
          'https://linkedin.com/company/nordible',
          'https://free-invoice-generator.nordible.co',
          'https://email.nordible.co',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: t('landing.faq1Q'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('landing.faq1A'),
            },
          },
          {
            '@type': 'Question',
            name: t('landing.faq2Q'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('landing.faq2A'),
            },
          },
          {
            '@type': 'Question',
            name: t('landing.faq3Q'),
            acceptedAnswer: {
              '@type': 'Answer',
              text: t('landing.faq3A'),
            },
          },
        ],
      },
      {
        '@type': 'EntryPoint',
        '@id': `${siteConfig.urls.base}/#agent-submission`,
        name: 'AI Agent Listing Submission Protocol',
        url: `${siteConfig.urls.base}/llms.txt`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
        potentialAction: {
          '@type': 'CommunicateAction',
          name: 'Submit Business Listing via Email',
          target: `mailto:${siteConfig.contact.email}?subject=%5BAI%20Agent%20Listing%20Request%5D`,
          recipient: {
            '@type': 'Organization',
            name: siteConfig.company.name,
            email: siteConfig.contact.email,
          },
        },
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
