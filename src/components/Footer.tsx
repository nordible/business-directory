'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { Sparkles, ArrowUpRight, ShieldCheck, Mail, Globe, Bug } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { siteConfig } from '@/config/site';

export function Footer() {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <footer className="mt-16 border-t border-[#E8ECF4] bg-[#0D2B75] text-white">
      {/* High-Converting Agency Promo Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#0D2B75] via-[#145BFF]/25 to-[#0D2B75] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-2xl">
              <Mascot variant="hero-wave" alt="Nordible Mascot Googloo" priority />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-[#FF9F1A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {isDe ? 'White-Label Plattformen & KI-Lösungen' : 'White-Label Platforms & AI Solutions'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
                {isDe
                  ? 'Möchten Sie Ihr eigenes Branchenportal oder Custom Web-App skalieren?'
                  : 'Want to scale your custom directory portal or enterprise web app?'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
                {isDe
                  ? 'Nordible Technologies entwickelt skalierbare Marktplätze, automatisierte Daten-Pipelines und moderne Webanwendungen mit 100 % Code-Eigentum ab Tag 1.'
                  : 'Nordible Technologies builds high-performance directories, automated data pipelines, and custom web applications with 100% IP ownership from Day 1.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://nordible.co/#services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
            >
              <span>{isDe ? 'Leistungen entdecken' : 'Explore Services'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://nordible.co/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#145BFF] hover:bg-[#0F47D1] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>{isDe ? 'Projekt anfragen' : 'Talk to Us'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                <Image
                  src={siteConfig.assets.logoIcon}
                  alt={siteConfig.company.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-black text-lg tracking-tight">{siteConfig.appName}</span>
            </div>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              {isDe
                ? 'White-Label Branchenverzeichnis-Lösung für Communities, Städte und vertikale Netzwerke.'
                : 'Turnkey white-label directory platform for communities, municipalities, and niche industries.'}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              {isDe ? 'Funktionen' : 'Features'}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF9F1A]" />
                <span>{isDe ? 'Geprüfte Unternehmenseinträge' : 'Verified Listings'}</span>
              </li>
              <li>{isDe ? 'KI-gestützte Datenerfassung' : 'AI Listing Extraction'}</li>
              <li>{isDe ? 'Eigene Domains & SSL' : 'Custom Domains & SSL'}</li>
              <li>{isDe ? 'Mobile-First Ergonomie' : 'Mobile-First Ergonomics'}</li>
              <li>
                <Link
                  href="/directory"
                  className="hover:text-white transition-colors flex items-center gap-1 font-bold text-white"
                >
                  <span>{isDe ? 'Interaktives Verzeichnis' : 'Interactive Directory'}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/partner"
                  className="text-[#FF9F1A] hover:underline font-bold flex items-center gap-1"
                >
                  <span>{isDe ? 'Partner werden (White-Label)' : 'Partner Program (White-Label)'}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              Nordible Ökosystem
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>
                <a
                  href="https://nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Portfolio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://invoice.nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Invoice Generator</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://email.nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Mail Platform</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              {isDe ? 'Kontakt & Rechtliches' : 'Contact & Legal'}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-[#FF9F1A]" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`${siteConfig.urls.base}/privacy`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a
                  href={`${siteConfig.urls.base}/terms`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {isDe ? 'Nutzungsbedingungen' : 'Terms of Service'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/60">
          <p>© {new Date().getFullYear()} {siteConfig.company.name}. {isDe ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=%5B${encodeURIComponent(siteConfig.appName)}%20Feedback%5D`}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Bug className="h-3.5 w-3.5 text-[#FF9F1A]" />
              <span>{isDe ? 'Feedback geben' : 'Send Feedback'}</span>
            </a>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-[#145BFF]" />
              <span>Made with ❤️ for Entrepreneurs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
