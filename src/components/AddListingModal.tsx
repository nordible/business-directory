'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { siteConfig } from '@/config/site';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
  defaultTab?: 'human' | 'ai';
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  primaryColor = '#145BFF',
  defaultTab = 'human',
}) => {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'human' | 'ai'>(defaultTab);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(defaultTab);
      setIsSubmitted(false);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const emailSubject = encodeURIComponent(
    locale === 'de'
      ? `Eintragsanfrage für ${siteConfig.appName}`
      : `Listing Request for ${siteConfig.appName}`
  );

  const rawTemplate =
    locale === 'de'
      ? `Hallo ${siteConfig.company.name} Team,\n\nich möchte mein Unternehmen gerne in ${siteConfig.appName} listen lassen:\n\n• Unternehmensname & Branche: \n• Offizielle Webseite / URL: \n• Standort (Stadt & Land): \n• Telefonnummer & Ansprechpartner: \n• Kurzbeschreibung der Leistungen: \n• Logo-URL (z.B. https://domain.de/logo.png): \n\nViele Grüße,\n`
      : `Hello ${siteConfig.company.name} Team,\n\nI would like to list my business in ${siteConfig.appName}:\n\n• Company Name & Industry: \n• Official Website / URL: \n• Location (City & Country): \n• Phone Number & Contact: \n• Short Description of Services: \n• Hosted Logo URL (e.g. https://domain.com/logo.png): \n\nBest regards,\n`;

  const emailBody = encodeURIComponent(rawTemplate);
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

  const handleCopyTextTemplate = () => {
    navigator.clipboard.writeText(rawTemplate);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
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
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-[#E8ECF4] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('addModal.verifiedBadge')}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audience Segment Tabs (Business Owner vs AI Agent) */}
        {!isSubmitted && (
          <div className="px-6 pt-3 bg-white">
            <div className="grid grid-cols-2 p-1 bg-[#F4F6FB] rounded-xl border border-[#E8ECF4] text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setActiveTab('human')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'human'
                    ? 'bg-white text-[#0D2B75] shadow-xs'
                    : 'text-slate-500 hover:text-[#0D2B75]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#145BFF]" />
                <span>Business Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? 'bg-white text-[#0D2B75] shadow-xs'
                    : 'text-slate-500 hover:text-[#0D2B75]'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#FF9F1A]" />
                <span>AI Agent / Crawler</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-6 overflow-y-auto space-y-5 animate-in fade-in duration-200">
            {/* Confirmation Header */}
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto drop-shadow-md">
                <Mascot variant="celebrate" alt="Listing submission initiated" priority />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('addModal.submittedBadge')}</span>
              </span>
              <h3 className="font-heading font-black text-lg sm:text-xl text-[#0D2B75] tracking-tight">
                {t('addModal.submittedTitle')}
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                {t('addModal.submittedSubtitle')}
              </p>
            </div>

            {/* Reciprocity Agency Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0D2B75] via-[#123E9B] to-[#0D2B75] text-white p-5 space-y-3.5 shadow-xl border border-blue-900/40">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 text-[#FF9F1A] border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('addModal.pitchBadge')}</span>
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold font-heading text-white">
                {t('addModal.pitchTitle')}
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                {t('addModal.pitchDesc')}
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href={siteConfig.urls.agencyServices}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF9F1A] hover:bg-amber-400 text-[#0D2B75] text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>{t('addModal.pitchExploreBtn')}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.urls.agencyContact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{t('addModal.pitchConsultBtn')}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-80" />
                </a>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {t('addModal.pitchDoneBtn')}
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                {t('addModal.viewTemplateAgain')}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5">
            {activeTab === 'human' ? (
              <>
                {/* Clean Welcome Header */}
                <div className="text-center space-y-1.5">
                  <div className="w-16 h-16 mx-auto drop-shadow-sm">
                    <Mascot variant="mail-send" alt="Mascot sending mail" priority />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#0D2B75] tracking-tight">
                    {t('addModal.title')}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                    {t('addModal.subtitle')}
                  </p>
                </div>

                {/* Compact 2-Column Checklist */}
                <div className="bg-[#FAFBFF] rounded-2xl border border-[#E8ECF4] p-4 space-y-2.5">
                  <span className="text-[11px] font-extrabold text-[#0D2B75] uppercase tracking-wider font-heading block">
                    {t('addModal.infoNeeded')}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <Building2 className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field1')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <Globe className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field2')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <MapPin className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field3')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <Phone className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field4')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <FileText className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field5')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#E8ECF4]">
                      <ImageIcon className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                      <span className="truncate">{t('addModal.field6')}</span>
                    </div>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="space-y-2 pt-1">
                  <a
                    href={mailtoUrl}
                    onClick={() => setIsSubmitted(true)}
                    className="w-full py-3.5 px-4 rounded-xl text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:opacity-95 active:scale-98 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>{t('addModal.sendEmailBtn')}</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyTextTemplate}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">{t('addModal.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>{t('addModal.copyEmailBtn')} ({siteConfig.contact.email})</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(true)}
                      className="text-[11px] text-slate-500 hover:text-[#145BFF] underline transition-colors cursor-pointer"
                    >
                      Already sent your email? View confirmation & next steps →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* AI Agent / Crawler Protocol Screen */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0D2B75] text-white">
                      <Bot className="w-3 h-3 text-[#FF9F1A]" />
                      <span>{t('addModal.aiAgentBadge')}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#145BFF]">
                      {siteConfig.contact.email}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('addModal.aiAgentNotice')}
                  </p>

                  {/* Pre-formatted JSON code preview */}
                  <div className="relative bg-slate-900 text-slate-200 rounded-xl p-3.5 text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                    <pre className="leading-tight">{aiJsonTemplate}</pre>
                  </div>

                  {/* Actions for AI & Automated Workflows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyAiTemplate}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F3F7FF] border border-[#E8ECF4] text-[#0D2B75] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedAi ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">{t('addModal.copiedAiTemplate')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#145BFF]" />
                          <span>{t('addModal.copyAiTemplate')}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${siteConfig.contact.email}?subject=%5BAI%20Agent%20Listing%20Request%5D&body=${encodeURIComponent(aiJsonTemplate)}`}
                      onClick={() => setIsSubmitted(true)}
                      className="py-2.5 px-3 rounded-xl bg-[#0D2B75] hover:bg-[#145BFF] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-center cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-[#FF9F1A]" />
                      <span>Send JSON Email</span>
                    </a>
                  </div>

                  <div className="text-center pt-1">
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#145BFF] hover:underline"
                    >
                      <span>View Machine-Readable Protocol (/llms.txt)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal Footer */}
        {!isSubmitted && (
          <div className="px-6 py-2.5 bg-[#FAFBFF] border-t border-[#E8ECF4] text-center text-[11px] text-slate-500 font-medium">
            {t('addModal.footerNotice')}
          </div>
        )}
      </div>
    </div>
  );
};
