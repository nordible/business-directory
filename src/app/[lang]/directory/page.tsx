import DirectoryAppPage from '@/app/directory/page';
import { SUPPORTED_LANGUAGES } from '@/lib/types';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((l) => ({ lang: l.code }));
}

export default function LocalizedDirectoryPage() {
  return <DirectoryAppPage />;
}
