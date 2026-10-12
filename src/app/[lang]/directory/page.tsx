import DirectoryAppPage from '@/app/directory/page';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { getAllBusinesses, getDefaultTenant, getCategories } from '@/lib/db/client';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default async function LocalizedDirectoryPage() {
  const [businesses, tenant, categories] = await Promise.all([
    getAllBusinesses(),
    getDefaultTenant(),
    getCategories(),
  ]);

  return (
    <DirectoryAppPage
      initialListings={businesses}
      initialTenant={tenant}
      initialCategories={categories}
    />
  );
}
