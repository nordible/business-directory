import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/types';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.urls.base || 'https://nordible.co';
  const currentDate = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/directory', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/partner', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

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
