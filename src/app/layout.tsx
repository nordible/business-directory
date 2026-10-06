import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Nordible Directory | Multi-Tenant White-Label Business Platform',
  description: 'Multi-tenant white-label business directory platform with AI ingestion, custom branding, and localized search by Nordible Technologies.',
  icons: {
    icon: '/images/logos/nordible-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFBFF] text-gray-900">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
