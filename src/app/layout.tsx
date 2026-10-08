import type { Metadata } from 'next';
import Script from 'next/script';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { siteConfig } from '@/config/site';

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
  metadataBase: new URL(siteConfig.urls.base),
  title: `${siteConfig.appName} | International Business Directory`,
  description: `Official International Business Directory for verified companies across all industries worldwide by ${siteConfig.company.name}.`,
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    url: siteConfig.urls.base,
    title: `${siteConfig.appName} | International Business Directory`,
    description: `Official International Business Directory for verified companies across all industries worldwide by ${siteConfig.company.name}.`,
    siteName: siteConfig.appName,
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: siteConfig.appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.appName} | International Business Directory`,
    description: `Official International Business Directory for verified companies across all industries worldwide by ${siteConfig.company.name}.`,
    images: ['/images/logo.png'],
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
      <head>
        <link rel="help" type="text/plain" href="/llms.txt" title="AI Agent Listing Protocol" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FAFBFF] text-gray-900">
        <I18nProvider>{children}</I18nProvider>

        {/* Google Analytics (matches main portfolio & invoice generator) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-E5H1MEHYYB'}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-E5H1MEHYYB'}');
          `}
        </Script>
      </body>
    </html>
  );
}
