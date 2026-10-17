import { Metadata } from 'next';
import { AdminPortalPage } from '@/components/AdminPortalPage';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Admin Moderation | ${siteConfig.appName}`,
  description: 'Geschützter Administrationsbereich für verifizierte Administratoren.',
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default function LocalizedAdminPage() {
  return <AdminPortalPage />;
}
