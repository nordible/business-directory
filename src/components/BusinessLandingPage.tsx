'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { TenantBranding } from '@/lib/types';
import { DEFAULT_TENANT } from '@/lib/db/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mascot } from '@/components/mascot/Mascot';
import { AddListingModal } from '@/components/AddListingModal';
import { siteConfig } from '@/config/site';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Coins,
  TrendingUp,
  CheckCircle2,
  Globe,
  Bot,
  Compass,
} from 'lucide-react';

interface BusinessLandingPageProps {
  tenant?: TenantBranding;
}

export function BusinessLandingPage({
  tenant = DEFAULT_TENANT,
}: BusinessLandingPageProps) {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickUrl, setQuickUrl] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddModalOpen(true);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const b2bFaqs = [
    {
      q: isDe
        ? 'Ist der Eintrag für mein Unternehmen wirklich dauerhaft kostenlos?'
        : 'Is listing my business truly 100% free forever?',
      a: isDe
        ? 'Ja. Der Basis-Eintrag für echte Betriebe ist und bleibt kostenlos. Es gibt keine versteckten Gebühren, keine Einrichtungsgebühr und keine Vermittlungsprovisionen bei Kundenkontakten.'
        : 'Yes. The verified listing for genuine businesses is completely free. There are no setup fees, no recurring hidden charges, and zero commissions on customer leads.',
    },
    {
      q: isDe
        ? 'Wie treten Kunden mit mir in Kontakt?'
        : 'How do customers contact my business?',
      a: isDe
        ? 'Kunden können Sie unmittelbar über Ihre hinterlegte Telefonnummer anrufen, Ihre Webseite besuchen oder über das integrierte DSGVO-konforme Anfrageformular eine Direktnachricht senden, die sofort in Ihrem E-Mail-Postfach landet.'
        : 'Customers can call your verified phone number directly, visit your official website, or submit a GDPR-compliant inquiry that lands straight in your email inbox.',
    },
    {
      q: isDe
        ? 'Wie funktioniert der 1-Klick KI-Import über unsere Website-URL?'
        : 'How does the 1-click AI import via website URL work?',
      a: isDe
        ? 'Sie geben einfach die URL Ihrer Firmenhomepage ein. Unsere intelligente Extraktions-KI liest automatisch Ihren Firmennamen, Adresse, Branche, Leistungen und Öffnungszeiten aus. Sie prüfen die Daten kurz und schalten Ihren Eintrag frei – das spart über 5 Minuten manuelles Eintippen!'
        : 'Simply paste your company homepage URL. Our AI extracts your company name, location, category, key services, and business hours. You verify the preview and publish in seconds.',
    },
    {
      q: isDe
        ? 'Wie werden Kundenbewertungen geprüft?'
        : 'How are customer reviews verified?',
      a: isDe
        ? 'Um Manipulationen und Fake-Bewertungen zu verhindern, durchlaufen alle eingereichten Kundenbewertungen eine redaktionelle Prüfung, bevor sie freigeschaltet werden. So sichern wir höchste Glaubwürdigkeit für Ihren Betrieb.'
        : 'To prevent fake reviews and review spam, customer submissions undergo editorial verification before being published, ensuring high trust and credibility for your brand.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] text-slate-800 font-sans selection:bg-[#145BFF]/10 selection:text-[#145BFF]">
      {/* Header */}
      <Header
        currentTenant={tenant}
        onOpenAiModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        {/* HERO SECTION FOR BUSINESSES */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 border-b border-[#E8ECF4]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: B2B Conversion Hook & URL Input */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-[#145BFF] shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[#145BFF] animate-pulse" />
                  <span>
                    {isDe
                      ? 'Für Dienstleister & Unternehmen • 0 % Provision'
                      : 'For Service Providers & Businesses • 0% Commission'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#0D2B75] tracking-tight font-heading leading-[1.15]">
                  {isDe
                    ? 'Gewinnen Sie Neukunden, die aktiv nach Ihren Leistungen suchen'
                    : 'Win new customers actively searching for your services'}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  {isDe
                    ? 'Präsentieren Sie Ihr Unternehmen im verifizierten Branchenindex. Kunden kontaktieren Sie direkt per Telefon, E-Mail oder Anfrage – 100 % provisionsfrei und ohne Werbevermittler.'
                    : 'Showcase your company in the verified business index. Customers reach out directly via phone, email, or quote requests – 100% commission-free with no middlemen.'}
                </p>

                {/* 1-Click AI Website URL Onboarding Box */}
                <div className="bg-white rounded-3xl border-2 border-[#145BFF]/30 p-4 sm:p-5 shadow-lg shadow-blue-500/10 space-y-3">
                  <div className="flex items-center justify-between text-left">
                    <span className="text-xs font-black text-[#0D2B75] uppercase tracking-wider font-heading flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF9F1A]" />
                      <span>{isDe ? 'Blitz-Eintrag mit KI aus Website-URL' : '1-Click AI Import via Website URL'}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {isDe ? 'Dauert 30 Sek.' : 'Takes 30 sec'}
                    </span>
                  </div>

                  <form onSubmit={handleQuickStart} className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="url"
                        value={quickUrl}
                        onChange={(e) => setQuickUrl(e.target.value)}
                        placeholder="https://ihre-firma.de"
                        className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm rounded-2xl border border-[#E8ECF4] bg-[#FAFBFF] focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#145BFF] hover:bg-[#0D2B75] text-white px-6 py-3 text-xs sm:text-sm font-extrabold shadow-md shadow-blue-500/20 transition-all hover:scale-102 active:scale-95 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF9F1A]" />
                      <span>{isDe ? 'Mit KI eintragen' : 'Import with AI'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isDe ? 'Dauerhaft kostenlos' : 'Free forever'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isDe ? '0 % Provision' : '0% Commission'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isDe ? 'Inhaber-Verifiziert' : 'Owner-Verified'}</span>
                    </span>
                  </div>
                </div>

                {/* Backlink to consumer directory */}
                <div className="pt-1 text-center lg:text-left">
                  <Link
                    href={`/${locale}/directory`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#145BFF] transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isDe ? '← Zurück zur Kundensuche / Verzeichnis' : '← Back to customer directory'}</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Welcoming Mascot */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl">
                  <div className="absolute inset-0 bg-[#145BFF]/10 rounded-full blur-2xl animate-pulse" />
                  <Mascot
                    variant="hero-wave"
                    alt={`${siteConfig.appName} Mascot Googloo`}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE VALUE PILLARS FOR BUSINESSES */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#E8ECF4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-extrabold text-[#145BFF] mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#145BFF]" />
                <span>{isDe ? 'Ihre geschäftlichen Vorteile' : 'Commercial Benefits'}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight leading-tight">
                {isDe
                  ? 'Warum sich ein Eintrag für Ihren Betrieb lohnt'
                  : 'Why listing your business drives real growth'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
                {isDe
                  ? 'Keine teuren Klickpreise, keine Vermittlergebühren – nur direkte, echte Kundenkontakte für Ihr Unternehmen.'
                  : 'No costly cost-per-click ads, zero middlemen cuts – direct, genuine customer connections.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-emerald-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-300">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {isDe ? 'Direkte Kundenanfragen' : 'Direct Customer Leads'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isDe
                      ? 'Kunden rufen Sie direkt an oder fordern Angebote an. Anfragen landen ohne Verzögerung direkt in Ihrem Postfach.'
                      : 'Customers contact your business directly via phone or quote forms with immediate delivery.'}
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-gradient-to-b from-white to-blue-50/40 rounded-3xl border-2 border-[#145BFF]/30 p-6 shadow-md transition-all flex flex-col justify-between group hover:border-[#145BFF]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {isDe ? '0 % Provision – 100 % Marge' : '0% Commission – 100% Margin'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isDe
                      ? 'Keine Vermittlungsprovisionen. Jeder Euro, den Sie mit Ihren Aufträgen verdienen, bleibt zu 100 % in Ihrem Betrieb.'
                      : 'Zero intermediary fees. Every dollar or euro earned from customer bookings stays entirely yours.'}
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-amber-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-300">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FF9F1A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Star className="w-6 h-6 fill-[#FF9F1A]" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {isDe ? 'Geprüfte Kundenbewertungen' : 'Verified Customer Reviews'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isDe
                      ? 'Zufriedene Kunden verfassen Sterne-Bewertungen. Redaktionelle Prüfungen schützen Ihren Ruf zuverlässig vor Fake-Spam.'
                      : 'Satisfied clients submit star reviews. Editorial screening safeguards your business against fake spam.'}
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-[#FAFBFF] rounded-3xl border border-indigo-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-300">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2 leading-snug">
                    {isDe ? 'KI- & Google-Auffindbarkeit' : 'AI & Google Discoverability'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isDe
                      ? 'Schema.org-Strukturdaten und llms.txt machen Ihren Betrieb auffindbar für Google, Perplexity und ChatGPT.'
                      : 'Schema.org structured data and llms.txt make your firm visible to Google, Perplexity, and ChatGPT.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STEP ONBOARDING HOW IT WORKS */}
        <section className="py-16 sm:py-24 bg-[#FAFBFF] border-b border-[#E8ECF4]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1A] font-heading">
                {isDe ? 'Einfacher Ablauf' : 'Simple Process'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight mt-1">
                {isDe ? 'In 3 Schritten zum fertigen Unternehmenseintrag' : 'Listed in 3 simple steps'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs text-center relative">
                <div className="w-10 h-10 rounded-full bg-[#145BFF] text-white font-black flex items-center justify-center mx-auto mb-4 shadow-sm">
                  1
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2">
                  {isDe ? 'Website-URL eingeben' : 'Paste Website URL'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isDe
                    ? 'Unsere KI analysiert Ihre Homepage und übernimmt Name, Adresse, Branche & Leistungen in Sekunden.'
                    : 'Our AI scans your website and populates company info, address, category, and services instantly.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs text-center relative">
                <div className="w-10 h-10 rounded-full bg-[#145BFF] text-white font-black flex items-center justify-center mx-auto mb-4 shadow-sm">
                  2
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2">
                  {isDe ? 'Daten prüfen & anpassen' : 'Review & Customize'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isDe
                    ? 'Überprüfen Sie Telefonnummer, Öffnungszeiten und Beschreibung in unserem einfachen Formular.'
                    : 'Quickly check phone, hours, and description inside our simple intuitive interface.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E8ECF4] p-7 shadow-xs text-center relative">
                <div className="w-10 h-10 rounded-full bg-[#145BFF] text-white font-black flex items-center justify-center mx-auto mb-4 shadow-sm">
                  3
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#0D2B75] mb-2">
                  {isDe ? 'Veröffentlichen & Anfragen erhalten' : 'Publish & Win Clients'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isDe
                    ? 'Ihr Profil ist live. Kunden finden Sie regional und überregional und nehmen direkten Kontakt auf.'
                    : 'Your listing goes live. Local and global clients discover your business and reach out.'}
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#145BFF] hover:bg-[#0D2B75] text-white px-8 py-4 text-sm font-extrabold shadow-lg shadow-blue-500/25 transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF9F1A]" />
                <span>{isDe ? 'Jetzt Betrieb kostenlos eintragen' : 'Add your business for free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* B2B FAQ SECTION */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#E8ECF4]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF9F1A] font-heading">
                {isDe ? 'Fragen & Antworten' : 'FAQ'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0D2B75] font-heading tracking-tight mt-1">
                {isDe ? 'Häufige Fragen von Unternehmen' : 'Frequently Asked Questions by Businesses'}
              </h2>
            </div>

            <div className="space-y-3">
              {b2bFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E8ECF4] rounded-2xl overflow-hidden bg-[#FAFBFF] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-[#0D2B75] hover:text-[#145BFF] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0 text-[#145BFF]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#E8ECF4] bg-white font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add Listing Modal */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        primaryColor={tenant.primaryColor}
      />
    </div>
  );
}
