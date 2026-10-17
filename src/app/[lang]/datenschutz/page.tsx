import { DatenschutzContent } from '@/components/legal/DatenschutzContent';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export const metadata: Metadata = {
  title: `Datenschutzerklärung | ${siteConfig.appName}`,
  description: `Informationen über die Datenverarbeitung gemäß der Datenschutz-Grundverordnung (DSGVO) bei ${siteConfig.appName}.`,
};

export default function LocalizedDatenschutzPage() {
  return <DatenschutzContent />;
}
