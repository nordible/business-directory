'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import {
  X,
  Mail,
  Check,
  Copy,
  Building2,
  Globe,
  MapPin,
  Phone,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Bot,
  TrendingUp,
  Search,
  Sparkles,
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { siteConfig } from '@/config/site';

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
  const [copiedAi, setCopiedAi] = useState(false);

  if (!isOpen) return null;

  const emailSubject = encodeURIComponent(
    locale === 'de'
      ? `Eintragsanfrage für ${siteConfig.appName}`
      : `Listing Request for ${siteConfig.appName}`
  );

  const emailBody = encodeURIComponent(
    locale === 'de'
      ? `Hallo ${siteConfig.company.name} Team,\n\nich möchte mein Unternehmen gerne in ${siteConfig.appName} listen lassen:\n\n• Unternehmensname & Branche: \n• Offizielle Webseite / URL: \n• Standort (Stadt & Land): \n• Telefonnummer & Ansprechpartner: \n• Kurzbeschreibung der Leistungen: \n• Logo-URL (z.B. https://domain.de/logo.png): \n\nViele Grüße,\n`
      : `Hello ${siteConfig.company.name} Team,\n\nI would like to list my business in ${siteConfig.appName}:\n\n• Company Name & Industry: \n• Official Website / URL: \n• Location (City & Country): \n• Phone Number & Contact: \n• Short Description of Services: \n• Hosted Logo URL (e.g. https://domain.com/logo.png): \n\nBest regards,\n`
  );

  const mailtoUrl = `mailto:${siteConfig.contact.email}?subject=${emailSubject}&body=${emailBody}`;

  const aiJsonTemplate = JSON.stringify(
    {
      requestType: 'business_listing_submission',
      companyName: 'YOUR_COMPANY_NAME',
      industry: 'YOUR_INDUSTRY',
      websiteUrl: 'https://your-website.com',
      location: {
        city: 'YOUR_CITY',
        country: 'YOUR_COUNTRY',
        address: 'YOUR_ADDRESS',
      },
      contact: {
        phone: '+49 ...',
        email: 'contact@your-website.com',
        contactPerson: 'CONTACT_NAME',
      },
      description: 'SHORT_DESCRIPTION_OF_SERVICES',
      logoUrl: 'https://your-website.com/logo.png',
    },
    null,
    2
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAiTemplate = () => {
    navigator.clipboard.writeText(aiJsonTemplate);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('addModal.verifiedBadge')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto drop-shadow-md">
              <Mascot variant="mail-send" alt="Mascot sending mail" priority />
            </div>
            <h3 className="font-heading font-black text-xl text-[#0D2B75] leading-tight">
              {t('addModal.title')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto font-medium">
              {t('addModal.subtitle')}
            </p>
          </div>

          {/* WHAT A BUSINESS GETS - TANGIBLE OUTCOMES */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-extrabold text-[#0D2B75] uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
              <span>{t('addModal.benefitsTitle')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:border-[#145BFF]/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D2B75] font-heading">
                  <Building2 className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                  <span>{t('addModal.benefit1Title')}</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {t('addModal.benefit1Desc')}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D2B75] font-heading">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('addModal.benefit2Title')}</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {t('addModal.benefit2Desc')}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D2B75] font-heading">
                  <Search className="w-3.5 h-3.5 text-[#FF9F1A] shrink-0" />
                  <span>{t('addModal.benefit3Title')}</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {t('addModal.benefit3Desc')}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D2B75] font-heading">
                  <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{t('addModal.benefit4Title')}</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {t('addModal.benefit4Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* AI AGENT / AUTONOMOUS BOT SUBMISSION PROTOCOL */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0D2B75] text-white">
                <Bot className="w-3 h-3 text-[#FF9F1A]" />
                <span>{t('addModal.aiAgentBadge')}</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-semibold">mail@nordible.co</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {t('addModal.aiAgentNotice')}
            </p>
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCopyAiTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[#0D2B75] text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                {copiedAi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t('addModal.copiedAiTemplate')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('addModal.copyAiTemplate')}</span>
                  </>
                )}
              </button>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=%5BAI%20Agent%20Listing%20Request%5D&body=${encodeURIComponent(aiJsonTemplate)}`}
                className="text-[11px] font-bold text-[#145BFF] hover:underline flex items-center gap-1"
              >
                <span>{t('addModal.sendEmailBtn')}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Checklist of required items */}
          <div className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-4.5 space-y-3">
            <div className="text-[11px] font-extrabold text-[#0D2B75] uppercase tracking-wider font-heading">
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
              <li className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>{t('addModal.field6')}</span>
              </li>
            </ul>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={mailtoUrl}
              className="w-full py-3.5 px-4 rounded-xl text-white text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:opacity-95 active:scale-98 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-4 h-4" />
              <span>{t('addModal.sendEmailBtn')}</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
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
                  <span>{t('addModal.copyEmailBtn')} ({siteConfig.contact.email})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-2.5 bg-[#FAFBFF] border-t border-[#E8ECF4] text-center text-[11px] text-gray-500">
          {t('addModal.footerNotice')}
        </div>
      </div>
    </div>
  );
};
