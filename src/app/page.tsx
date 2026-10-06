import { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.appName} | Verifiziertes Branchenverzeichnis für Qualitätsunternehmen`,
  description:
    `Das offizielle Branchenverzeichnis für verifizierte Unternehmen in Frankfurt am Main, Berlin, München, Hamburg und der DACH-Region. 100% qualitätsgeprüft von ${siteConfig.company.name}.`,
  alternates: {
    canonical: `${siteConfig.urls.base}/`,
  },
  openGraph: {
    title: `${siteConfig.appName} | Verifiziertes Branchenverzeichnis`,
    description:
      'Entdecken Sie handverlesene Tech-Agenturen, Gastronomie, Architekten und Dienstleister – 100% verifiziert.',
    url: `${siteConfig.urls.base}/`,
    siteName: siteConfig.appName,
    type: 'website',
  },
};

export default function RootDirectoryPage() {
  return <LandingPage />;
}
