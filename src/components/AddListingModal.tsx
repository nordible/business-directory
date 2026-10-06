'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { X, Mail, Check, Copy, Sparkles, Building2, Globe, MapPin, Phone, FileText } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  primaryColor = '#145BFF',
}) => {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const emailSubject = encodeURIComponent(
    locale === 'de'
      ? 'Eintragsanfrage für das Nordible Directory'
      : 'Listing Request for Nordible Directory'
  );

  const emailBody = encodeURIComponent(
    locale === 'de'
      ? `Hallo Nordible Team,\n\nich möchte mein Unternehmen gerne im Nordible Directory listen lassen:\n\n• Unternehmensname & Branche: \n• Offizielle Webseite / URL: \n• Standort (Stadt & Adresse): \n• Telefonnummer & Ansprechpartner: \n• Kurzbeschreibung der Leistungen: \n\nViele Grüße,\n`
      : `Hello Nordible Team,\n\nI would like to list my business in the Nordible Directory:\n\n• Company Name & Industry: \n• Official Website / URL: \n• Location (City & Address): \n• Phone Number & Contact: \n• Short Description of Services: \n\nBest regards,\n`
  );

  const mailtoUrl = `mailto:mail@nordible.co?subject=${emailSubject}&body=${emailBody}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mail@nordible.co');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
              <span>{t('addModal.comingSoonBadge')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-24 h-24 mx-auto drop-shadow-md">
              <Mascot variant="mail-send" alt="Mascot sending mail" priority />
            </div>
            <h3 className="font-heading font-black text-xl text-[#0D2B75] leading-tight">
              {t('addModal.title')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto font-medium">
              {t('addModal.subtitle')}
            </p>
          </div>

          {/* Checklist of required items */}
          <div className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-4.5 space-y-3">
            <div className="text-xs font-extrabold text-[#0D2B75] uppercase tracking-wider font-heading">
              {t('addModal.infoNeeded')}
            </div>
            <ul className="space-y-2 text-xs text-gray-700 font-medium">
              <li className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field1')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field2')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field3')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field4')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field5')}</span>
              </li>
            </ul>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2.5 pt-1">
            <a
              href={mailtoUrl}
              className="w-full py-3.5 px-4 rounded-xl text-white text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:opacity-95 active:scale-98 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-4 h-4" />
              <span>{t('addModal.sendEmailBtn')}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{t('addModal.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>{t('addModal.copyEmailBtn')} (mail@nordible.co)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAFBFF] border-t border-[#E8ECF4] text-center text-[11px] text-gray-500">
          Geprüfte Einträge erscheinen nach redaktioneller Freigabe im Verzeichnis.
        </div>
      </div>
    </div>
  );
};
