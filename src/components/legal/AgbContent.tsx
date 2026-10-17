'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { siteConfig } from '@/config/site';
import { LegalPageLayout, TocItem } from './LegalPageLayout';

const TOC_DE: TocItem[] = [
  { id: 'geltungsbereich', title: '§ 1 Geltungsbereich & Vertragsgegenstand' },
  { id: 'leistungen', title: '§ 2 Leistungsangebot der Plattform' },
  { id: 'eintraege', title: '§ 3 Unternehmenseinträge, Verifizierung & Korrekturen' },
  { id: 'bewertungen', title: '§ 4 Richtlinien für Kundenbewertungen' },
  { id: 'partner-billing', title: '§ 5 Partner-Abonnements & Zahlungsbedingungen' },
  { id: 'haftung', title: '§ 6 Gewährleistung & Haftungsbeschränkung' },
  { id: 'marken', title: '§ 7 Geistiges Eigentum & Markenrechte Dritter' },
  { id: 'schlussbestimmungen', title: '§ 8 Anwendbares Recht & Gerichtsstand' },
];

const TOC_EN: TocItem[] = [
  { id: 'geltungsbereich', title: '§ 1 Scope & Subject Matter' },
  { id: 'leistungen', title: '§ 2 Platform Services & Directory Features' },
  { id: 'eintraege', title: '§ 3 Listings, Verification & Takedowns' },
  { id: 'bewertungen', title: '§ 4 Review Guidelines & Moderation' },
  { id: 'partner-billing', title: '§ 5 Partner Subscriptions & Billing' },
  { id: 'haftung', title: '§ 6 Warranty & Limitation of Liability' },
  { id: 'marken', title: '§ 7 Intellectual Property & Trademarks' },
  { id: 'schlussbestimmungen', title: '§ 8 Governing Law & Jurisdiction' },
];

export const AgbContent: React.FC = () => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <LegalPageLayout
      title={isDe ? 'Allgemeine Geschäfts- & Nutzungsbedingungen (AGB)' : 'Terms of Service / AGB'}
      subtitle={
        isDe
          ? 'Nutzungsbedingungen und rechtliche Bestimmungen für Besucher, Unternehmensinhaber und Partner des Branchenportals "Nordible for Businesses".'
          : 'Terms of service and legal conditions for visitors, business owners, and enterprise partners of the directory platform "Nordible for Businesses".'
      }
      lastUpdated={isDe ? '17. Oktober 2026' : 'October 17, 2026'}
      toc={isDe ? TOC_DE : TOC_EN}
    >
      {/* § 1 Geltungsbereich */}
      <section id="geltungsbereich" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 1 Geltungsbereich & Vertragsgegenstand' : '§ 1 Scope & Subject Matter'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? `Diese Allgemeinen Geschäfts- und Nutzungsbedingungen (nachfolgend "AGB") regeln die Nutzung der Plattform "Nordible for Businesses" (abrufbar unter ${siteConfig.urls.base} sowie den zugehörigen Subdomains) bereitgestellt von ${siteConfig.company.legalName}, ${siteConfig.company.street}, ${siteConfig.company.postalCode} ${siteConfig.company.city}, Deutschland (nachfolgend "Betreiber" oder "Nordible").`
            : `These General Terms and Conditions (hereinafter "Terms") govern the use of the platform "Nordible for Businesses" (accessible at ${siteConfig.urls.base} and affiliated subdomains) operated by ${siteConfig.company.legalName}, ${siteConfig.company.street}, ${siteConfig.company.postalCode} ${siteConfig.company.city}, Germany (hereinafter "Operator" or "Nordible").`}
        </p>
      </section>

      {/* § 2 Leistungsangebot */}
      <section id="leistungen" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 2 Leistungsangebot der Plattform' : '§ 2 Platform Services & Directory Features'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Nordible betreibt ein internationales Wirtschafts- und Branchenverzeichnis. Das Angebot umfasst:'
            : 'Nordible operates an international business directory platform offering:'}
        </p>
        <ul className="text-xs list-disc pl-5 space-y-1 text-gray-600">
          <li>{isDe ? 'Die kostenlose Auffindbarkeit von Unternehmensprofilen mit Kontaktdaten, Öffnungszeiten und Leistungsbeschreibungen.' : 'Free discovery of business profiles, contact data, opening hours, and service descriptions.'}</li>
          <li>{isDe ? 'Die Vermittlung von Kundenanfragen an gelistete Unternehmen.' : 'Customer inquiry routing to listed enterprises.'}</li>
          <li>{isDe ? 'Die Verifizierung von Unternehmensinhabern ("Claim Listing").' : 'Business owner verification and listing claims.'}</li>
          <li>{isDe ? 'Redaktionell geprüfte Kundenbewertungen zur Sicherstellung von Qualität und Glaubwürdigkeit.' : 'Editorially verified customer reviews to preserve trust and prevent manipulation.'}</li>
          <li>{isDe ? 'Optionale kostenpflichtige Partner-Tarife und White-Label-Lizenzen für Gewerbetreibende.' : 'Optional paid partner tiers and white-label licensing for commercial operators.'}</li>
        </ul>
      </section>

      {/* § 3 Unternehmenseinträge */}
      <section id="eintraege" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 3 Unternehmenseinträge, Verifizierung & Korrekturen' : '§ 3 Listings, Verification & Takedowns'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Die Verzeichnisinhalte basieren sowohl auf offiziellen Registern und frei zugänglichen Unternehmensseiten als auch auf direkten Einreichungen durch Gewerbetreibende.'
            : 'Directory contents are compiled from official public registers, publicly available company sites, and direct owner submissions.'}
        </p>
        <div className="bg-[#FAFBFF] border border-[#E8ECF4] rounded-2xl p-4 text-xs space-y-2">
          <p className="font-bold text-[#0D2B75]">
            {isDe ? 'Host-Provider-Status & Notice-and-Takedown (§§ 7–10 DDG):' : 'Host-Provider Status & Notice-and-Takedown (§§ 7–10 DDG):'}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {isDe
              ? `Als Host-Provider übernimmt Nordible keine Gewähr für die ständige Vollständigkeit und Aktualität von Drittangaben. Sollte ein Unternehmenseintrag unrichtige Daten enthalten oder die Löschung eines Profils gewünscht sein, genügt eine formlose E-Mail an ${siteConfig.contact.email}. Wir prüfen Beanstandungen unverzüglich und nehmen Korrekturen oder Löschungen innerhalb von 24 Stunden vor.`
              : `As a host provider under German law (§§ 7–10 DDG), Nordible does not warrant the continuous completeness of third-party data. If any profile contains inaccuracies or requires permanent removal, a simple email to ${siteConfig.contact.email} suffices. We review and execute corrections or removals within 24 hours.`}
          </p>
        </div>
      </section>

      {/* § 4 Richtlinien für Kundenbewertungen */}
      <section id="bewertungen" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 4 Richtlinien für Kundenbewertungen' : '§ 4 Review Guidelines & Moderation'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Kundenbewertungen dienen dem fairen und transparenten Austausch über echte Geschäftserfahrungen. Es gelten folgende verbindliche Grundsätze:'
            : 'Reviews serve honest and transparent sharing of genuine commercial experiences. The following rules apply:'}
        </p>
        <ul className="text-xs list-disc pl-5 space-y-1 text-gray-600">
          <li>{isDe ? 'Bewertungen müssen auf einer tatsächlichen Kunden- oder Geschäftsbeziehung beruhen.' : 'Reviews must be based on a verifiable customer or business relationship.'}</li>
          <li>{isDe ? 'Unwahre Tatsachenbehauptungen, Beleidigungen, Verleumdungen und Schmähkritik sind strikt untersagt.' : 'Untrue factual allegations, defamation, hate speech, and libel are strictly prohibited.'}</li>
          <li>{isDe ? 'Gekaufte, manipulierte oder von Konkurrenten initiierte Scheinbewertungen werden redaktionell herausgefiltert und nicht veröffentlicht.' : 'Incentivized, fake, or competitor-driven reviews are filtered editorially and will not be published.'}</li>
        </ul>
      </section>

      {/* § 5 Partner-Billing */}
      <section id="partner-billing" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 5 Partner-Abonnements & Zahlungsbedingungen' : '§ 5 Partner Subscriptions & Billing'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Für kostenpflichtige B2B-Partnertarife (White-Label oder Premium-Platzierungen) gelten die im jeweiligen Angebot bzw. in der Buchungsbestätigung vereinbarten Preise. Sofern nicht anders vereinbart, verlängern sich Abonnements nach Ablauf der Mindestvertragslaufzeit jeweils um die gewählte Laufzeitperiode und können vor Ablauf formlos per E-Mail gekündigt werden.'
            : 'For commercial B2B partner tiers (white-label or premium placements), rates specified in the respective order confirmation apply. Unless otherwise stipulated, subscriptions renew for equivalent periods and may be cancelled anytime via email prior to renewal.'}
        </p>
      </section>

      {/* § 6 Haftung */}
      <section id="haftung" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 6 Gewährleistung & Haftungsbeschränkung' : '§ 6 Warranty & Limitation of Liability'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Der Betreiber haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt. Die Vorschriften des Produkthaftungsgesetzes bleiben unberührt.'
            : 'The Operator is liable without limitation for intent, gross negligence, and injury to life, limb, or health. In the event of slight negligence involving essential contractual obligations, liability is limited to foreseeable typical damages.'}
        </p>
      </section>

      {/* § 7 Geistiges Eigentum */}
      <section id="marken" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 7 Geistiges Eigentum & Markenrechte Dritter' : '§ 7 Intellectual Property & Trademarks'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Alle auf der Plattform dargestellten Marken, Firmennamen und Logos verbleiben im ausschließlichen Eigentum der jeweiligen Inhaber. Die Darstellung erfolgt rein hinweisend zur Identifikation und Auffindbarkeit des jeweiligen Unternehmens.'
            : 'All trademarks, logos, and business names displayed on this directory platform remain the exclusive property of their respective owners. Display is solely referential to enable identification and discoverability of the business.'}
        </p>
      </section>

      {/* § 8 Schlussbestimmungen */}
      <section id="schlussbestimmungen" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '§ 8 Anwendbares Recht & Gerichtsstand' : '§ 8 Governing Law & Jurisdiction'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? `Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Soweit der Nutzer Kaufmann im Sinne des Handelsgesetzbuches (HGB), juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, ist ausschließlicher Gerichtsstand für alle Streitigkeiten Frankfurt am Main.`
            : `The laws of the Federal Republic of Germany apply, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Insofar as the user is a commercial entity under the German Commercial Code (HGB) or a public body, the exclusive place of jurisdiction is Frankfurt am Main, Germany.`}
        </p>
      </section>
    </LegalPageLayout>
  );
};
