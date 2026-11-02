import { BusinessLandingPage } from '@/components/BusinessLandingPage';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { getDefaultTenant } from '@/lib/db/client';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default async function LocalizedBusinessPage() {
  const tenant = await getDefaultTenant();
  return <BusinessLandingPage tenant={tenant} />;
}
