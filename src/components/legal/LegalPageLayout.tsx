'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { ArrowLeft, ShieldCheck, Mail, Clock, FileText, ChevronRight } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  toc,
  children,
}) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF]">
      <Header onOpenAiModal={() => {}} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link
            href={`/${locale}/directory`}
            className="hover:text-[#145BFF] transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isDe ? 'Zurück zum Verzeichnis' : 'Back to Directory'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-400">{isDe ? 'Rechtliches' : 'Legal'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="font-semibold text-[#0D2B75]">{title}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#145BFF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isDe ? 'Rechtssicherheit nach deutschem Recht' : 'Compliant with German & EU Law'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{isDe ? 'Stand' : 'Last updated'}: {lastUpdated}</span>
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#0D2B75] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Two-column layout: Sticky TOC on Desktop + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of contents (Desktop Sticky) */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2B75] mb-4 pb-2 border-b border-[#E8ECF4]">
                <FileText className="w-4 h-4 text-[#145BFF]" />
                <span>{isDe ? 'Inhaltsverzeichnis' : 'Table of Contents'}</span>
              </div>
              <nav className="space-y-1.5 text-xs">
                {toc.map((item, idx) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1.5 px-2.5 rounded-lg text-gray-600 hover:text-[#145BFF] hover:bg-blue-50/80 transition-colors font-medium leading-snug"
                  >
                    <span className="text-gray-400 mr-1.5 font-mono">{idx + 1}.</span>
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Listing Modification Card */}
            <div className="bg-gradient-to-br from-[#F3F7FF] to-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs text-xs space-y-2.5">
              <h4 className="font-heading font-bold text-[#0D2B75]">
                {isDe ? 'Unternehmenseintrag bearbeiten oder löschen?' : 'Modify or Remove a Business Listing?'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {isDe
                  ? 'Sie sind Inhaber oder bevollmächtigter Vertreter und möchten Ihren Eintrag aktualisieren oder entfernen lassen? Senden Sie uns eine E-Mail mit dem Link:'
                  : 'Are you a verified representative wishing to update or delete your business listing? Email us with your listing URL:'}
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=%5B${encodeURIComponent(siteConfig.appName)}%20${encodeURIComponent(isDe ? 'Eintragsverwaltung' : 'Listing Request')}%5D`}
                className="inline-flex items-center gap-1.5 font-bold text-[#145BFF] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>
          </aside>

          {/* Legal Document Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-10 shadow-xs prose-sm prose-slate max-w-none text-gray-700 leading-relaxed space-y-6">
            {children}

            {/* Direct Takedown & Concierge Notice (Bottom of page for mobile & desktop) */}
            <div className="mt-12 pt-8 border-t border-[#E8ECF4] bg-[#FAFBFF] -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#145BFF] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-[#0D2B75]">
                    {isDe ? 'Hinweis zur redaktionellen Prüfung & Beschwerden' : 'Editorial Verification & Dispute Notice'}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isDe
                      ? `Nordible Technologies verpflichtet sich zur Einhaltung aller Vorgaben des Digitale-Dienste-Gesetzes (DDG) und der Datenschutz-Grundverordnung (DSGVO). Für Rückfragen, Korrekturen oder Auskunftsersuchen erreichen Sie unsere Rechts- und Redaktionsabteilung jederzeit unter ${siteConfig.contact.email}.`
                      : `Nordible Technologies is dedicated to strict compliance with the German Digital Services Act (DDG) and GDPR. For inquiries, corrections, or data subject requests, please contact our legal and editorial department at ${siteConfig.contact.email}.`}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer showPromo={false} />
    </div>
  );
};
