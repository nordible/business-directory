import { ImpressumContent } from '@/components/legal/ImpressumContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Impressum & Rechtliche Hinweise | ${siteConfig.appName}`,
  description: `Gesetzliche Anbieterkennzeichnung und rechtliche Angaben gemäß § 5 DDG für ${siteConfig.appName}.`,
};

export default function LocalizedImpressumPage() {
  return <ImpressumContent />;
}
