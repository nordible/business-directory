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
        name: 'AI Agent Listing Ingestion API',
        url: `${siteConfig.urls.base}/api/businesses/submit`,
        description: 'Direct REST API for autonomous AI agents to submit new business listings directly.',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
        potentialAction: {
          '@type': 'CreateAction',
          name: 'Submit Business Listing via API',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.urls.base}/api/businesses/submit`,
            httpMethod: 'POST',
            encodingType: 'application/json',
          },
          result: {
            '@type': 'LocalBusiness',
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
