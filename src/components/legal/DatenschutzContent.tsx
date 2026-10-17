'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { siteConfig } from '@/config/site';
import { LegalPageLayout, TocItem } from './LegalPageLayout';

const TOC_DE: TocItem[] = [
  { id: 'verantwortlicher', title: '1. Verantwortlicher & Datenschutz-Kontakt' },
  { id: 'ueberblick', title: '2. Allgemeine Hinweise & Rechtsgrundlagen' },
  { id: 'verzeichnisdaten', title: '3. Verarbeitung von Verzeichnis- & Unternehmensdaten' },
  { id: 'loeschung', title: '4. Löschung & Aktualisierung von Unternehmenseinträgen' },
  { id: 'anfragen', title: '5. Kundenanfragen & Vermittlung' },
  { id: 'ki-verarbeitung', title: '6. KI-gestützte Datenverarbeitung (Google Gemini)' },
  { id: 'bewertungen', title: '7. Kundenbewertungen & redaktionelle Prüfung' },
  { id: 'hosting-infrastruktur', title: '8. Hosting, Datenbank (Supabase) & E-Mail (Resend)' },
  { id: 'cookies', title: '9. Cookies & Lokaler Speicher' },
  { id: 'betroffenenrechte', title: '10. Ihre Rechte nach der DSGVO' },
  { id: 'aufsichtsbehoerde', title: '11. Beschwerderecht bei der Aufsichtsbehörde' },
];

const TOC_EN: TocItem[] = [
  { id: 'verantwortlicher', title: '1. Data Controller & Contact' },
  { id: 'ueberblick', title: '2. General Information & Legal Bases' },
  { id: 'verzeichnisdaten', title: '3. Directory & Company Data Processing' },
  { id: 'loeschung', title: '4. Updating & Deleting Business Listings' },
  { id: 'anfragen', title: '5. Customer Inquiries & Lead Routing' },
  { id: 'ki-verarbeitung', title: '6. AI-Assisted Processing (Google Gemini)' },
  { id: 'bewertungen', title: '7. Customer Reviews & Editorial Verification' },
  { id: 'hosting-infrastruktur', title: '8. Hosting, Database (Supabase) & Email (Resend)' },
  { id: 'cookies', title: '9. Cookies & Local Storage' },
  { id: 'betroffenenrechte', title: '10. Your Rights under GDPR' },
  { id: 'aufsichtsbehoerde', title: '11. Right to Lodge a Complaint' },
];

export const DatenschutzContent: React.FC = () => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <LegalPageLayout
      title={isDe ? 'Datenschutzerklärung' : 'Privacy Policy / Datenschutzerklärung'}
      subtitle={
        isDe
          ? 'Informationen über die Erhebung, Verarbeitung und Nutzung personenbezogener Daten im Rahmen unseres internationalen Branchenverzeichnisses gemäß der Datenschutz-Grundverordnung (DSGVO).'
          : 'Information on the collection, processing, and use of personal data within our international business directory pursuant to the General Data Protection Regulation (GDPR).'
      }
      lastUpdated={isDe ? '17. Oktober 2026' : 'October 17, 2026'}
      toc={isDe ? TOC_DE : TOC_EN}
    >
      {/* 1. Verantwortlicher */}
      <section id="verantwortlicher" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '1. Verantwortlicher & Datenschutz-Kontakt' : '1. Data Controller & Contact'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Verantwortliche Stelle für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG) ist:'
            : 'The responsible party (controller) for data processing on this website pursuant to the General Data Protection Regulation (GDPR) is:'}
        </p>
        <div className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-4 text-xs space-y-1 font-mono">
          <p className="font-bold text-[#0D2B75]">{siteConfig.company.legalName}</p>
          <p>{siteConfig.company.street}</p>
          <p>{siteConfig.company.postalCode} {siteConfig.company.city}, {siteConfig.company.country}</p>
          <p>{isDe ? 'E-Mail' : 'Email'}: {siteConfig.contact.email}</p>
          <p>{isDe ? 'Telefon' : 'Phone'}: {siteConfig.contact.phoneDisplay}</p>
        </div>
      </section>

      {/* 2. Allgemeine Hinweise */}
      <section id="ueberblick" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '2. Allgemeine Hinweise & Rechtsgrundlagen' : '2. General Information & Legal Bases'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Wir verarbeiten personenbezogene Daten unserer Nutzer nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt stets im Einklang mit der DSGVO:'
            : 'We process personal data only insofar as necessary to provide a functioning directory website, contents, and services, strictly compliant with GDPR standards:'}
        </p>
        <ul className="text-xs list-disc pl-5 space-y-1 text-gray-600">
          <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> {isDe ? 'Einwilligung der betroffenen Person.' : 'Consent of the data subject.'}</li>
          <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> {isDe ? 'Erfüllung eines Vertrages oder vorvertraglicher Maßnahmen (z. B. Eintragung oder Inhaberanspruch).' : 'Performance of a contract or pre-contractual steps (e.g. listing submission or claim).'}</li>
          <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> {isDe ? 'Erfüllung rechtlicher Verpflichtungen.' : 'Compliance with legal obligations.'}</li>
          <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> {isDe ? 'Wahrung berechtigter Interessen unseres Unternehmens oder Dritter (z. B. Bereitstellung eines internationalen Wirtschaftsverzeichnisses).' : 'Legitimate interests of our company or third parties (e.g. operating a public business registry).'}</li>
        </ul>
      </section>

      {/* 3. Verzeichnisdaten */}
      <section id="verzeichnisdaten" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '3. Verarbeitung von Verzeichnis- & Unternehmensdaten' : '3. Directory & Company Data Processing'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Auf unserer Plattform listen wir gewerbliche Unternehmensprofile (Firma, Rechtsform, Anschrift, Branche, Öffnungszeiten, Telefonnummer, geschäftliche E-Mail-Adresse und Website). Diese Angaben dienen der geschäftlichen Auffindbarkeit und der Vermittlung von B2B- und B2C-Kontakten.'
            : 'Our platform indexes commercial business profiles (company name, legal form, physical address, industry category, opening hours, business phone, business email, and website). This facilitates commercial discoverability and B2B/B2C communication.'}
        </p>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Rechtsgrundlage für die Veröffentlichung ist entweder die direkte Einreichung durch den Inhaber/Bevollmächtigten (Art. 6 Abs. 1 lit. b DSGVO) oder unser berechtigtes Interesse an der Bereitstellung eines umfassenden Wirtschafts- und Branchenverzeichnisses (Art. 6 Abs. 1 lit. f DSGVO) basierend auf öffentlich zugänglichen Registern und offiziellen Unternehmensseiten.'
            : 'The legal basis for publication is either direct submission by the authorized representative (Art. 6(1)(b) GDPR) or our legitimate interest in operating an international business directory (Art. 6(1)(f) GDPR) based on public business registers and published company data.'}
        </p>
      </section>

      {/* 4. Löschung & Aktualisierung */}
      <section id="loeschung" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '4. Löschung & Aktualisierung von Unternehmenseinträgen' : '4. Updating & Deleting Business Listings'}
        </h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
          <p className="font-bold text-emerald-900">
            {isDe ? 'Schnelle & unbürokratische Berichtigung oder Löschung:' : 'Expedited & Frictionless Updates or Deletion:'}
          </p>
          <p className="text-emerald-800 leading-relaxed">
            {isDe
              ? `Jeder Inhaber oder bevollmächtigte Unternehmensvertreter hat jederzeit das Recht, Angaben seines Unternehmens kostenlos aktualisieren oder den gesamten Eintrag dauerhaft löschen zu lassen. Senden Sie hierfür einfach eine formlose E-Mail an ${siteConfig.contact.email} unter Nennung der Unternehmens-URL. Unser Redaktionsteam führt die gewünschte Änderung oder Löschung innerhalb von 24 Stunden durch.`
              : `Any business owner or authorized representative may request immediate updates or permanent deletion of their business listing at any time, free of charge. Simply email ${siteConfig.contact.email} with your listing URL. Our editorial team processes your request within 24 hours.`}
          </p>
        </div>
      </section>

      {/* 5. Kundenanfragen */}
      <section id="anfragen" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '5. Kundenanfragen & Lead-Vermittlung' : '5. Customer Inquiries & Lead Routing'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Wenn Besucher über unser Anfrage-Formular Kontakt zu einem gelisteten Unternehmen aufnehmen, erfassen wir die vom Nutzer eingegebenen Daten (Name, E-Mail-Adresse, Telefonnummer, Betreff und Nachrichtentext). Diese Daten werden zum Zwecke der Weiterleitung an das gewählte Unternehmen verarbeitet und per verschlüsselter E-Mail zugestellt (Art. 6 Abs. 1 lit. b DSGVO).'
            : 'When visitors send an inquiry to a listed enterprise via our inquiry modal, we collect the submitted details (name, email, phone, subject, and message). This data is processed exclusively to deliver your inquiry to the chosen business via encrypted email (Art. 6(1)(b) GDPR).'}
        </p>
      </section>

      {/* 6. KI-Verarbeitung */}
      <section id="ki-verarbeitung" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '6. KI-gestützte Datenverarbeitung (Google Gemini)' : '6. AI-Assisted Processing (Google Gemini)'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Um gelisteten Unternehmen eine effiziente und strukturierte Bearbeitung von Kundenanfragen zu ermöglichen, setzen wir Schnittstellen moderner Sprachmodelle (Google Gemini API) ein. Hierbei wird der Anfragetext automatisiert zusammengefasst und ein unverbindlicher Antwortentwurf für den Inhaber generiert. Die Verarbeitung erfolgt ausschließlich flüchtig im Rahmen des API-Aufrufs; die Daten werden von uns nicht für das Training von KI-Modellen verwendet (Art. 6 Abs. 1 lit. f DSGVO).'
            : 'To facilitate swift customer response workflows for business owners, we utilize Google Gemini API to generate executive inquiry summaries and preliminary draft replies. Processing occurs ephemerally during the API call; data is not stored or utilized for machine learning model training (Art. 6(1)(f) GDPR).'}
        </p>
      </section>

      {/* 7. Kundenbewertungen */}
      <section id="bewertungen" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '7. Kundenbewertungen & redaktionelle Prüfung' : '7. Customer Reviews & Editorial Verification'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Um Reputationsschäden durch manipulierte oder gefälschte Rezensionen zu verhindern, erfolgt die Abgabe von Kundenbewertungen redaktionell vermittelt über E-Mail. Verarbeitet werden Sterne-Wertung, Erfahrungsbericht sowie die E-Mail-Adresse des Bewertenden zur Überprüfung der Authentizität (Art. 6 Abs. 1 lit. f DSGVO). Unangemessene oder nicht nachweisbare Bewertungen werden nicht veröffentlicht.'
            : 'To protect businesses from defamatory or fake reviews, customer reviews are editorially verified via email. We process star ratings, written testimonials, and the reviewer’s email address solely to verify authenticity (Art. 6(1)(f) GDPR).'}
        </p>
      </section>

      {/* 8. Hosting & Infrastruktur */}
      <section id="hosting-infrastruktur" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '8. Hosting, Datenbank (Supabase) & E-Mail (Resend)' : '8. Hosting, Database (Supabase) & Email (Resend)'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Unsere Plattform nutzt moderne Cloud-Infrastrukturen zur sicheren Datenverarbeitung:'
            : 'Our platform relies on enterprise cloud infrastructure for secure processing:'}
        </p>
        <ul className="text-xs list-disc pl-5 space-y-1.5 text-gray-600">
          <li>
            <strong>Supabase Inc.</strong> {isDe ? '(PostgreSQL-Datenbank): Datenhaltung erfolgt verschlüsselt in europäischen Rechenzentren (Frankfurt am Main, Deutschland). Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO liegt vor.' : '(PostgreSQL Database): Data is stored encrypted in European data centers (Frankfurt am Main, Germany). Data Processing Agreement (DPA) under Art. 28 GDPR is in place.'}
          </li>
          <li>
            <strong>Resend Inc.</strong> {isDe ? '(Transaktions-E-Mail-Dienst): Zum sicheren Versand von Bestätigungen und Benachrichtigungen. AVV nach Art. 28 DSGVO liegt vor.' : '(Transactional Email Dispatch): For secure dispatch of verification codes and notification alerts. DPA under Art. 28 GDPR is in place.'}
          </li>
          <li>
            <strong>Webhosting & CDN (Vercel / Next.js):</strong> {isDe ? 'Bereitstellung der Website mit weltweitem Content Delivery Network und SSL/TLS-Verschlüsselung.' : 'Delivery of web assets via global CDN with end-to-end SSL/TLS encryption.'}
          </li>
        </ul>
      </section>

      {/* 9. Cookies */}
      <section id="cookies" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '9. Cookies & Lokaler Speicher' : '9. Cookies & Local Storage'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Unsere Webseite setzt ausschließlich technisch notwendige Cookies und lokale Speicherobjekte (z. B. zur Speicherung der gewählten Sprache `nordible_lang`) ein. Wir verwenden keine Tracking- oder Werbe-Cookies von Drittanbietern. Eine gesonderte Cookie-Einwilligung ist für rein funktionale Speicherungen nach § 25 Abs. 2 TDDDG nicht erforderlich.'
            : 'Our website utilizes strictly necessary cookies and local storage tokens (such as language preference `nordible_lang`). We do not deploy third-party advertising or cross-site tracking cookies. Purely functional technical tokens require no cookie banner pursuant to § 25 (2) TDDDG.'}
        </p>
      </section>

      {/* 10. Betroffenenrechte */}
      <section id="betroffenenrechte" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '10. Ihre Rechte nach der DSGVO' : '10. Your Rights under GDPR'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Sie haben jederzeit folgende gesetzliche Rechte hinsichtlich Ihrer bei uns verarbeiteten Daten:'
            : 'You possess the following statutory rights regarding your personal data processed by us:'}
        </p>
        <ul className="text-xs list-disc pl-5 space-y-1 text-gray-600">
          <li><strong>Art. 15 DSGVO:</strong> {isDe ? 'Recht auf Auskunft über Ihre verarbeiteten Daten.' : 'Right of access to your personal data.'}</li>
          <li><strong>Art. 16 DSGVO:</strong> {isDe ? 'Recht auf Berichtigung unrichtiger Daten.' : 'Right to rectification of incorrect data.'}</li>
          <li><strong>Art. 17 DSGVO:</strong> {isDe ? 'Recht auf Löschung („Recht auf Vergessenwerden“).' : 'Right to erasure ("right to be forgotten").'}</li>
          <li><strong>Art. 18 DSGVO:</strong> {isDe ? 'Recht auf Einschränkung der Verarbeitung.' : 'Right to restriction of processing.'}</li>
          <li><strong>Art. 20 DSGVO:</strong> {isDe ? 'Recht auf Datenübertragbarkeit.' : 'Right to data portability.'}</li>
          <li><strong>Art. 21 DSGVO:</strong> {isDe ? 'Recht auf Widerspruch gegen die Verarbeitung.' : 'Right to object to data processing.'}</li>
        </ul>
        <p className="text-xs leading-relaxed">
          {isDe
            ? `Zur Ausübung Ihrer Rechte genügt eine E-Mail an: ${siteConfig.contact.email}`
            : `To exercise any of these rights, simply email: ${siteConfig.contact.email}`}
        </p>
      </section>

      {/* 11. Aufsichtsbehörde */}
      <section id="aufsichtsbehoerde" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '11. Beschwerderecht bei der Aufsichtsbehörde' : '11. Right to Lodge a Complaint'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Im Falle datenschutzrechtlicher Verstöße steht Ihnen gemäß Art. 77 DSGVO ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde für Nordible Technologies in Hessen ist:'
            : 'In the event of GDPR violations, you have the right to lodge a complaint with the competent supervisory authority (Art. 77 GDPR). For Nordible Technologies in Hesse, Germany, this is:'}
        </p>
        <p className="text-xs bg-[#FAFBFF] border border-[#E8ECF4] rounded-2xl p-4 font-mono">
          <strong>Der Hessische Beauftragte für Datenschutz und Informationsfreiheit</strong><br />
          Gustav-Stresemann-Ring 1<br />
          65189 Wiesbaden<br />
          Webseite: <a href="https://datenschutz.hessen.de" target="_blank" rel="noreferrer" className="text-[#145BFF] hover:underline">https://datenschutz.hessen.de</a>
        </p>
      </section>
    </LegalPageLayout>
  );
};
