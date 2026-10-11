import { Metadata } from 'next';
import { BusinessDetailPage } from '@/components/BusinessDetailPage';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { MOCK_LISTINGS } from '@/lib/mockData';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  for (const l of SUPPORTED_LANGUAGES) {
    for (const listing of MOCK_LISTINGS) {
      params.push({ lang: l.code, id: listing.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const listing = MOCK_LISTINGS.find(
    (b) => b.id === id || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
  );

  if (!listing) {
    return {
      title: `Not Found | ${siteConfig.appName}`,
    };
  }

  const desc =
    listing.description[lang] ||
    listing.description['de'] ||
    listing.description['en'] ||
    '';

  return {
    title: `${listing.name} – ${listing.city} | ${siteConfig.appName}`,
    description: desc,
    alternates: {
      canonical: `${siteConfig.urls.base}/${lang}/directory/${listing.id}`,
    },
    openGraph: {
      title: `${listing.name} – ${listing.city} | ${siteConfig.appName}`,
      description: desc,
      url: `${siteConfig.urls.base}/${lang}/directory/${listing.id}`,
      siteName: siteConfig.appName,
      type: 'website',
    },
  };
}

export default async function LocalizedBusinessPage({ params }: PageProps) {
  const { id } = await params;
  return <BusinessDetailPage businessId={id} />;
}
