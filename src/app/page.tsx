import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.appName} | International Business Directory`,
  description:
    `Official International Business Directory for verified companies across all industries worldwide by ${siteConfig.company.name}.`,
  alternates: {
    canonical: `${siteConfig.urls.base}/en`,
  },
  openGraph: {
    title: `${siteConfig.appName} | International Business Directory`,
    description:
      'Discover and connect with verified companies across all industries worldwide – 100% verified.',
    url: `${siteConfig.urls.base}/en`,
    siteName: siteConfig.appName,
    type: 'website',
  },
};

export default function RootDirectoryPage() {
  redirect('/en');
}
