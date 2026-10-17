import { ImpressumContent } from '@/components/legal/ImpressumContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Legal Notice / Impressum | ${siteConfig.appName}`,
  description: `Statutory provider identification and legal disclosure pursuant to § 5 DDG for ${siteConfig.appName}.`,
};

export default function LocalizedLegalNoticePage() {
  return <ImpressumContent />;
}
