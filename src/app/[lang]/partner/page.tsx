import PartnerPage from '@/app/partner/page';
import { SUPPORTED_LANGUAGES } from '@/lib/types';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default function LocalizedPartnerPage() {
  return <PartnerPage />;
}
