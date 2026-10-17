import { AgbContent } from '@/components/legal/AgbContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Allgemeine Geschäfts- & Nutzungsbedingungen (AGB) | ${siteConfig.appName}`,
  description: `Nutzungsbedingungen und AGB für das Branchenportal ${siteConfig.appName}.`,
};

export default function LocalizedAgbPage() {
  return <AgbContent />;
}
