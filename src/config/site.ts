export const siteConfig = {
  appName: 'Nordible for Businesses',
  appNameShort: 'Nordible',
  tagline: {
    de: 'Das internationale Branchenverzeichnis für alle Unternehmensarten weltweit',
    en: 'The International Business Directory for all types of businesses across the world',
  },
  company: {
    name: 'Nordible Technologies',
    legalName: 'Nordible Technologies',
    street: 'Breitlacherstraße 101',
    postalCode: '60489',
    city: 'Frankfurt am Main',
    country: 'Germany',
    fullAddress: 'Nordible Technologies, Breitlacherstraße 101, 60489 Frankfurt am Main, Germany',
    website: 'https://nordible.co/',
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
    base: process.env.NEXT_PUBLIC_SITE_URL || 'https://nordible.co',
    directory: '/directory',
    partner: '/partner',
  },
  geo: {
    defaultRegion: 'Global',
    topCities: ['Global / Weltweit', 'Frankfurt am Main', 'New York', 'London', 'Berlin', 'Mumbai', 'Dubai', 'Tokyo', 'Zürich', 'Singapore'],
  },
  assets: {
    logo: '/images/logos/nordible-logo.png',
    logoIcon: '/images/logos/nordible-icon.png',
    logoFull: '/images/logos/nordible-logo-full.png',
    badge: '/images/logos/nordible-apple-business-1024x1024.png',
  },
} as const;

export type SiteConfig = typeof siteConfig;
