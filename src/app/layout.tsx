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

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.appName} | International Business Directory`,
  description: `Official International Business Directory for verified companies across all industries worldwide by ${siteConfig.company.name}.`,
  icons: {
    icon: siteConfig.assets.logoIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFBFF] text-gray-900">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
