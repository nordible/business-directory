import { Metadata } from 'next';
import { BusinessDetailPage } from '@/components/BusinessDetailPage';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import {
  getBusinessByIdOrSlug,
  getAllBusinesses,
  getDefaultTenant,
  getCategories,
} from '@/lib/db/client';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const businesses = await getAllBusinesses();
  const params: { lang: string; id: string }[] = [];
  for (const l of SUPPORTED_LANGUAGES) {
    for (const listing of businesses) {
      if (listing.slug) params.push({ lang: l.code, id: listing.slug });
      params.push({ lang: l.code, id: listing.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const listing = await getBusinessByIdOrSlug(id);

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

  const canonicalId = listing.slug || listing.id;

  return {
    title: `${listing.name} – ${listing.city} | ${siteConfig.appName}`,
    description: desc,
    alternates: {
      canonical: `${siteConfig.urls.base}/${lang}/directory/${canonicalId}`,
    },
    openGraph: {
      title: `${listing.name} – ${listing.city} | ${siteConfig.appName}`,
      description: desc,
      url: `${siteConfig.urls.base}/${lang}/directory/${canonicalId}`,
      siteName: siteConfig.appName,
      type: 'website',
    },
  };
}

export default async function LocalizedBusinessPage({ params }: PageProps) {
  const { id } = await params;
  const [business, tenant, categories] = await Promise.all([
    getBusinessByIdOrSlug(id),
    getDefaultTenant(),
    getCategories(),
  ]);

  return (
    <BusinessDetailPage
      businessId={id}
      initialListing={business}
      tenant={tenant}
      categories={categories}
    />
  );
}
