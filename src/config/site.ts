import { env } from '@/config/env';

export const siteConfig = {
  appName: 'Nordible for Businesses',
  appNameShort: 'Nordible',
  rootDomain: 'nordible.co',
  customDomain: 'business-directory.nordible.co',
  cnameTarget: 'cname.nordible.co',
  isBeta: true,
  tagline: {
    de: 'Das kostenlose globale Branchenverzeichnis für verifizierte Unternehmen weltweit',
    en: 'The Free Global Business Directory for Verified Enterprises Worldwide',
  },
  company: {
    name: 'Nordible Technologies',
    legalName: 'Nordible Technologies',
    founder: 'Kabeer',
    founderRole: 'Founder & Executive',
    street: 'Breitlacherstraße 101',
    postalCode: '60489',
    city: 'Frankfurt am Main',
    state: 'Hessen',
    country: 'Germany',
    fullAddress: 'Nordible Technologies, Breitlacherstraße 101, 60489 Frankfurt am Main, Germany',
    website: 'https://nordible.co/',
    linkedin: 'https://linkedin.com/company/nordible',
    github: 'https://github.com/nordible/business-directory',
  },
  ecosystem: {
    portfolio: 'https://nordible.co',
    invoiceGenerator: 'https://free-invoice-generator.nordible.co',
    mailPlatform: 'https://email.nordible.co',
  },
  contact: {
    email: 'mail@nordible.co',
    founderEmail: 'kabeer@nordible.co',
    phoneDisplay: '+49 1521 1065739',
    phoneRaw: '+4915211065739',
    phoneHref: 'tel:+4915211065739',
    whatsappUrl: 'https://wa.me/4915211065739?text=Hello%20Nordible,%20I%20want%20to%20list%20my%20business%20in%20Nordible%20for%20Businesses',
    bookingUrl: 'https://calendar.app.google/N4XakE4t9zZVmHqYA',
  },
  urls: {
    base: env.siteUrl,
    directory: '/directory',
    partner: '/partner',
    forBusinesses: '/fuer-unternehmen',
    agencyServices: 'https://nordible.co/#services',
    agencyContact: 'https://nordible.co/#contact',
    github: 'https://github.com/nordible/business-directory',
  },
  geo: {
    defaultRegion: 'Global',
    topCities: ['Global / Worldwide', 'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Singapore', 'Dubai', 'Mumbai', 'Sydney', 'Zürich'],
  },
  assets: {
    logo: '/images/logos/nordible-logo.png',
    logoIcon: '/images/logos/nordible-icon.png',
    logoFull: '/images/logos/nordible-logo-full.png',
    badge: '/images/logos/nordible-apple-business-1024x1024.png',
  },
  pagination: {
    directoryPageSize: 10,
    directoryPageSizeOptions: [6, 10, 20, 50],
    adminPageSize: 10,
    adminPageSizeOptions: [5, 10, 20, 50],
  },
} as const;

export type SiteConfig = typeof siteConfig;
