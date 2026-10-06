import { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage';

export const metadata: Metadata = {
  title: 'Nordible Directory | Verifiziertes Branchenverzeichnis für Qualitätsunternehmen',
  description:
    'Das offizielle Branchenverzeichnis für verifizierte Unternehmen in Frankfurt am Main, Berlin, München, Hamburg und der DACH-Region. 100% qualitätsgeprüft.',
  alternates: {
    canonical: 'https://directory.nordible.co/',
  },
  openGraph: {
    title: 'Nordible Directory | Verifiziertes Branchenverzeichnis',
    description:
      'Entdecken Sie handverlesene Tech-Agenturen, Gastronomie, Architekten und Dienstleister – 100% verifiziert.',
    url: 'https://directory.nordible.co/',
    siteName: 'Nordible Directory',
    type: 'website',
  },
};

export default function RootDirectoryPage() {
  return <LandingPage />;
}
