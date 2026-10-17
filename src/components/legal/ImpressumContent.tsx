'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { siteConfig } from '@/config/site';
import { LegalPageLayout, TocItem } from './LegalPageLayout';

const TOC_DE: TocItem[] = [
  { id: 'anbieter', title: 'Angaben gemäß § 5 DDG' },
  { id: 'vertretung', title: 'Vertreten durch' },
  { id: 'kontakt', title: 'Kontaktmöglichkeiten' },
  { id: 'redaktion', title: 'Verantwortlich nach § 18 Abs. 2 MStV' },
  { id: 'streitbeilegung', title: 'Streitschlichtung & OS-Plattform' },
  { id: 'haftung-inhalte', title: 'Haftung für Inhalte (§ 7 DDG)' },
  { id: 'haftung-links', title: 'Haftung für externe Links (§§ 8–10 DDG)' },
  { id: 'urheberrecht', title: 'Urheberrecht & Markenzeichen' },
];

const TOC_EN: TocItem[] = [
  { id: 'anbieter', title: 'Information Pursuant to § 5 DDG' },
  { id: 'vertretung', title: 'Represented By' },
  { id: 'kontakt', title: 'Contact Information' },
  { id: 'redaktion', title: 'Editorial Responsibility (§ 18 MStV)' },
  { id: 'streitbeilegung', title: 'Dispute Resolution & EU Platform' },
  { id: 'haftung-inhalte', title: 'Liability for Contents (§ 7 DDG)' },
  { id: 'haftung-links', title: 'Liability for External Links (§§ 8–10 DDG)' },
  { id: 'urheberrecht', title: 'Copyright & Trademarks' },
];

export const ImpressumContent: React.FC = () => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  return (
    <LegalPageLayout
      title={isDe ? 'Impressum' : 'Legal Notice / Impressum'}
      subtitle={
        isDe
          ? 'Gesetzliche Anbieterkennzeichnung und Pflichtangaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV).'
          : 'Statutory provider identification and mandatory legal notices pursuant to the German Digital Services Act (§ 5 DDG) and Interstate Media Treaty (§ 18 MStV).'
      }
      lastUpdated={isDe ? '17. Oktober 2026' : 'October 17, 2026'}
      toc={isDe ? TOC_DE : TOC_EN}
    >
      {/* 1. Anbieterkennzeichnung */}
      <section id="anbieter" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '1. Angaben gemäß § 5 DDG' : '1. Information Pursuant to § 5 DDG'}
        </h2>
        <p className="text-sm">
          <strong>{siteConfig.company.legalName}</strong><br />
          {siteConfig.company.street}<br />
          {siteConfig.company.postalCode} {siteConfig.company.city}<br />
          {siteConfig.company.country}
        </p>
        <p className="text-xs text-gray-500">
          {isDe
            ? 'Betreiber dieses internationalen Branchenverzeichnisses ("Nordible for Businesses") auf der Subdomain business-directory.nordible.co sowie den zugehörigen Systemen.'
            : 'Operator of this international business directory ("Nordible for Businesses") on the subdomain business-directory.nordible.co and associated systems.'}
        </p>
      </section>

      {/* 2. Vertreten durch */}
      <section id="vertretung" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '2. Vertreten durch' : '2. Represented by'}
        </h2>
        <p className="text-sm">
          <strong>Kabeer</strong> (Founder & Executive)
        </p>
      </section>

      {/* 3. Kontakt */}
      <section id="kontakt" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '3. Kontaktmöglichkeiten' : '3. Contact Details'}
        </h2>
        <div className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-4 text-xs space-y-2">
          <p>
            <strong>{isDe ? 'Telefon' : 'Phone'}:</strong>{' '}
            <a href={siteConfig.contact.phoneHref} className="text-[#145BFF] hover:underline font-mono">
              {siteConfig.contact.phoneDisplay}
            </a>
          </p>
          <p>
            <strong>{isDe ? 'E-Mail' : 'Email'}:</strong>{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[#145BFF] hover:underline font-mono">
              {siteConfig.contact.email}
            </a>
          </p>
          <p>
            <strong>{isDe ? 'Webseite' : 'Website'}:</strong>{' '}
            <a href={siteConfig.company.website} target="_blank" rel="noreferrer" className="text-[#145BFF] hover:underline">
              {siteConfig.company.website}
            </a>
          </p>
        </div>
      </section>

      {/* 4. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV */}
      <section id="redaktion" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '4. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV' : '4. Editorial Responsibility (§ 18 Abs. 2 MStV)'}
        </h2>
        <p className="text-sm">
          Kabeer<br />
          Breitlacherstraße 101<br />
          60489 Frankfurt am Main<br />
          Deutschland
        </p>
      </section>

      {/* 5. Streitbeilegung */}
      <section id="streitbeilegung" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '5. EU-Streitschlichtung & Verbraucherstreitbeilegung' : '5. Dispute Resolution & EU Platform'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter '
            : 'The European Commission provides a platform for online dispute resolution (ODR), which can be accessed at '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#145BFF] hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          {isDe ? ' finden. Unsere E-Mail-Adresse finden Sie oben im Impressum.' : '. Our email address can be found in the contact section above.'}
        </p>
        <p className="text-xs leading-relaxed text-gray-600">
          {isDe
            ? 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).'
            : 'We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG).'}
        </p>
      </section>

      {/* 6. Haftung für Inhalte */}
      <section id="haftung-inhalte" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '6. Haftung für Inhalte (§ 7 DDG)' : '6. Liability for Contents (§ 7 DDG)'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
            : 'As a service provider, we are responsible for our own content on these pages under general law pursuant to Section 7 (1) DDG. However, pursuant to Sections 8 to 10 DDG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate unlawful activity.'}
        </p>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte unverzüglich entfernen.'
            : 'Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the moment of knowledge of a specific infringement. Upon becoming aware of any such infringements, we will remove such content immediately.'}
        </p>
      </section>

      {/* 7. Haftung für Links */}
      <section id="haftung-links" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '7. Haftung für externe Links (§§ 8–10 DDG)' : '7. Liability for External Links (§§ 8–10 DDG)'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.'
            : 'Our website contains links to external websites of third parties over whose content we have no influence. Therefore, we cannot accept any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Unlawful content was not recognizable at the time of linking.'}
        </p>
      </section>

      {/* 8. Urheberrecht */}
      <section id="urheberrecht" className="space-y-3">
        <h2 className="text-lg font-heading font-black text-[#0D2B75] border-b border-[#E8ECF4] pb-2">
          {isDe ? '8. Urheberrecht & Markenzeichen' : '8. Copyright & Trademarks'}
        </h2>
        <p className="text-xs leading-relaxed">
          {isDe
            ? 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet (z. B. eingetragene Firmenlogos und Markennamen der gelisteten Unternehmen).'
            : 'The content and works created by the site operators on these pages are subject to German copyright law. Duplication, editing, distribution, and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such (e.g. registered logos and company names of listed businesses).'}
        </p>
      </section>
    </LegalPageLayout>
  );
};
