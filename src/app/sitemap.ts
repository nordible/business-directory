import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/types';
import { siteConfig } from '@/config/site';
import { getAllBusinesses } from '@/lib/db/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.urls.base || 'https://nordible.co';
  const currentDate = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  const routes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/directory', priority: 0.9, changeFrequency: 'daily' },
    { path: '/partner', priority: 0.7, changeFrequency: 'weekly' },
  ];

  const businesses = await getAllBusinesses();

  businesses.forEach((listing) => {
    routes.push({
      path: `/directory/${listing.slug || listing.id}`,
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  });

  routes.forEach((route) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const url = `${baseUrl}/${locale}${route.path}`;
      const languagesMap: Record<string, string> = {};

      SUPPORTED_LOCALES.forEach((altLocale) => {
        languagesMap[altLocale] = `${baseUrl}/${altLocale}${route.path}`;
      });

      entries.push({
        url,
        lastModified: currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: languagesMap,
        },
      });
    });
  });

  return entries;
}
