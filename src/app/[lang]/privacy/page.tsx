import { DatenschutzContent } from '@/components/legal/DatenschutzContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Privacy Policy / Datenschutzerklärung | ${siteConfig.appName}`,
  description: `Data protection and privacy disclosures pursuant to GDPR for ${siteConfig.appName}.`,
};

export default function LocalizedPrivacyPage() {
  return <DatenschutzContent />;
}
