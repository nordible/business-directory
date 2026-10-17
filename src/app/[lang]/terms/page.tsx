import { AgbContent } from '@/components/legal/AgbContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Terms of Service / AGB | ${siteConfig.appName}`,
  description: `General terms and conditions and terms of service for ${siteConfig.appName}.`,
};

export default function LocalizedTermsPage() {
  return <AgbContent />;
}
