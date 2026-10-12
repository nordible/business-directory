import { LandingPage } from '@/components/LandingPage';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { getAllBusinesses, getDefaultTenant } from '@/lib/db/client';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default async function LocalizedLandingPage() {
  const [businesses, tenant] = await Promise.all([
    getAllBusinesses(),
    getDefaultTenant(),
  ]);

  return <LandingPage initialBusinesses={businesses} tenant={tenant} />;
}
