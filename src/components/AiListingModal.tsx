'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing, Category } from '@/lib/types';
import { PhoneInputWithCountry } from '@/components/PhoneInputWithCountry';

const emptySubscribe = () => () => {};
import {
  Sparkles,
  X,
  Globe,
  UploadCloud,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  MessageSquareCode,
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';

interface AiListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentTenantId: string;
  primaryColor: string;
  onListingCreated: (listing: BusinessListing) => void;
}

type TabType = 'url' | 'prompt' | 'upload';
type StepType = 'input' | 'processing' | 'review';

export const AiListingModal: React.FC<AiListingModalProps> = ({
  isOpen,
  onClose,
  categories,
  currentTenantId,
  primaryColor,
  onListingCreated,
}) => {
  const { locale, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabType>('url');
  const [step, setStep] = useState<StepType>('input');

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Processing simulation state
  const [progressStep, setProgressStep] = useState(1);

  // Extracted data state for review
  const [extractedListing, setExtractedListing] = useState<BusinessListing | null>(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('input');
        setUrlInput('');
        setPromptInput('');
        setSelectedFileName(null);
        setProgressStep(1);
        setExtractedListing(null);
      }, 300);
    }
  }, [isOpen]);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isOpen || !isMounted) return null;

  const handleStartExtraction = async (
    overrideUrl?: string,
    overrideDoc?: string,
    overridePrompt?: string
  ) => {
    const targetUrl = overrideUrl !== undefined ? overrideUrl : urlInput;
    const targetDoc = overrideDoc !== undefined ? overrideDoc : selectedFileName;
    const targetPrompt = overridePrompt !== undefined ? overridePrompt : promptInput;

    if (!targetUrl && !targetDoc && !targetPrompt) return;

    setStep('processing');
    setProgressStep(1);

    const t1 = setTimeout(() => setProgressStep(2), 700);
    const t2 = setTimeout(() => setProgressStep(3), 1400);

    try {
      const response = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          prompt: targetPrompt,
          documentName: targetDoc,
          sourceType: activeTab,
          tenantId: currentTenantId,
        }),
      });

      const data = await response.json();

      setTimeout(() => {
        if (data.listing) {
          setExtractedListing(data.listing);
          setStep('review');
        } else {
          alert(locale === 'de' ? 'Fehler bei der Extraktion' : 'Error during extraction');
          setStep('input');
        }
      }, 2000);
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      alert(locale === 'de' ? 'Verbindungsfehler beim Extrahieren' : 'Connection error during extraction');
      setStep('input');
    }
  };

  const handleApplySample = (sampleType: 'nordible' | 'coffee' | 'craft' | 'tech') => {
    if (sampleType === 'nordible') {
      setUrlInput('https://nordible.co');
      setActiveTab('url');
      handleStartExtraction('https://nordible.co');
      return;
    }

    let sampleUrl = 'https://spree-kaffee.berlin';
    if (sampleType === 'craft') sampleUrl = 'https://kreuzberg-holz.de';
    if (sampleType === 'tech') sampleUrl = 'https://nordic-code.berlin';

    setUrlInput(sampleUrl);
    setActiveTab('url');
    handleStartExtraction(sampleUrl);
  };

  const handleApplyPromptSample = (text: string) => {
    setPromptInput(text);
    setActiveTab('prompt');
    handleStartExtraction(undefined, undefined, text);
  };

  const handleConfirmListing = () => {
    if (extractedListing) {
      const rawWeb = extractedListing.website?.trim() || '';
      const normalizedWeb = rawWeb
        ? (/^https?:\/\//i.test(rawWeb) ? rawWeb : `https://${rawWeb}`)
        : '';
      onListingCreated({ ...extractedListing, website: normalizedWeb });
      onClose();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      {/* Backdrop touch dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-white w-full md:max-w-xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden border border-nordible-border">
        {/* Handle bar for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-nordible-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-nordible-dark text-base leading-tight">
                {t('aiModal.title')}
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                {t('aiModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-nordible-bg text-gray-500 hover:text-gray-800 border border-nordible-border flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Input & Mode Selection */}
          {step === 'input' && (
            <div className="space-y-5">
              {/* Tab Selector (Segmented Control) */}
              <div className="flex bg-nordible-section-bg border border-nordible-border p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-white text-nordible-dark shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-nordible-blue" />
                  <span>{t('aiModal.tabUrl')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('prompt')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'prompt'
                      ? 'bg-white text-nordible-dark shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-nordible-orange" />
                  <span>AI Prompt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white text-nordible-dark shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-nordible-blue" />
                  <span>{t('aiModal.tabUpload')}</span>
                </button>
              </div>

              {/* Tab 1 Content: URL input */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-nordible-dark">
                    {t('aiModal.urlLabel')}
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://nordible.co"
                      className="w-full pl-10 pr-4 py-3 bg-nordible-bg border border-nordible-border rounded-xl text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nordible-blue font-medium"
                    />
                  </div>

                  {/* Quick Sample Chips */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                      {t('aiModal.trySample')}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplySample('nordible')}
                        className="px-2.5 py-1 text-xs bg-blue-50 text-nordible-blue border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-bold flex items-center gap-1"
                      >
                        nordible.co
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySample('coffee')}
                        className="px-2.5 py-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer font-medium"
                      >
                        Café & Rösterei
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySample('craft')}
                        className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer font-medium"
                      >
                        Tischlerei
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2 Content: AI Prompt input */}
              {activeTab === 'prompt' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-nordible-dark">
                    {locale === 'de'
                      ? 'Freitext oder KI-Prompt (auch für KI-Agenten)'
                      : 'Free text or AI prompt (also for AI agents)'}
                  </label>
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={
                      locale === 'de'
                        ? 'z.B. Trage Nordible Technologies ein: Software-Agentur, Web: https://nordible.co, Tel: +49 1521 1065739, Spezialisiert auf KI-Agenten und globale Plattformen.'
                        : 'e.g. Add Nordible Technologies: Global software agency, Web: https://nordible.co, Tel: +49 1521 1065739, Specializing in AI agents and enterprise platforms.'
                    }
                    className="w-full p-3 bg-nordible-bg border border-nordible-border rounded-xl text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nordible-blue font-medium leading-relaxed"
                  />

                  {/* Sample Prompt Chips */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                      {locale === 'de' ? 'Prompt-Beispiel testen:' : 'Try sample prompt:'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPromptSample(
                          locale === 'de'
                            ? 'Trage Nordible Technologies ein: AI & Software Engineering Agentur, Web: https://nordible.co, Tel: +49 1521 1065739'
                            : 'Add Nordible Technologies: AI & Software Engineering agency, Web: https://nordible.co, Tel: +49 1521 1065739'
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-nordible-section-bg text-nordible-dark border border-nordible-border rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-semibold text-left block"
                    >
                      {locale === 'de'
                        ? '🤖 „Trage Nordible Technologies ein: Software & KI-Agentur...“'
                        : '🤖 "Add Nordible Technologies: Software & AI agency..."'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3 Content: Upload flyer/card */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <div
                    onClick={() => {
                      setSelectedFileName('nordible-visitenkarte.pdf');
                      handleStartExtraction(undefined, 'nordible-visitenkarte.pdf');
                    }}
                    className="border-2 border-dashed border-nordible-border hover:border-nordible-blue rounded-2xl p-6 text-center cursor-pointer bg-nordible-bg hover:bg-white transition-colors"
                  >
                    <UploadCloud className="w-10 h-10 text-nordible-blue mx-auto mb-2" />
                    <p className="text-xs font-bold text-nordible-dark">
                      {t('aiModal.uploadPlaceholder')}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {locale === 'de'
                        ? 'Klicken zum Hochladen oder hier ablegen'
                        : 'Click to upload or drag & drop here'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Extraction in Progress */}
          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center text-center space-y-5">
              <div className="w-24 h-24 drop-shadow-md">
                <Mascot variant="working-laptop" alt="KI analysiert Daten" priority />
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-base text-nordible-dark">
                  {t('aiModal.analyzing')}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {locale === 'de'
                    ? 'Extraktion läuft automatisch im Hintergrund'
                    : 'Extraction is running automatically in the background'}
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="w-full max-w-sm space-y-3 text-left bg-nordible-bg p-4 rounded-2xl border border-nordible-border">
                <div className="flex items-center gap-2.5 text-xs">
                  {progressStep >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      progressStep >= 1 ? 'font-bold text-nordible-dark' : 'text-gray-500'
                    }
                  >
                    {t('aiModal.stepScraping')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  {progressStep >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      progressStep >= 2 ? 'font-bold text-nordible-dark' : 'text-gray-500'
                    }
                  >
                    {t('aiModal.stepVision')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  {progressStep >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      progressStep >= 3 ? 'font-bold text-nordible-dark' : 'text-gray-500'
                    }
                  >
                    {t('aiModal.stepValidation')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Human-in-the-Loop Review */}
          {step === 'review' && extractedListing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-nordible-dark font-heading">
                  {t('aiModal.reviewTitle')}
                </span>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs font-semibold text-gray-500 hover:text-nordible-blue flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{locale === 'de' ? 'Neu erfassen' : 'Reset / Start over'}</span>
                </button>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 bg-nordible-bg p-4 rounded-2xl border border-nordible-border">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('aiModal.businessName')}
                  </label>
                  <div className="flex items-center bg-white border border-nordible-border rounded-xl px-3 py-2">
                    <Building className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={extractedListing.name}
                      onChange={(e) =>
                        setExtractedListing({ ...extractedListing, name: e.target.value })
                      }
                      className="w-full text-xs font-bold text-nordible-dark focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('aiModal.category')}
                  </label>
                  <select
                    value={extractedListing.categoryId}
                    onChange={(e) =>
                      setExtractedListing({
                        ...extractedListing,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full text-xs font-semibold bg-white border border-nordible-border rounded-xl px-3 py-2 text-nordible-dark focus:outline-none cursor-pointer"
                  >
                    {categories
                      .filter((c) => c.id !== 'cat-all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name[locale]}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('aiModal.address')}
                    </label>
                    <div className="flex items-center bg-white border border-nordible-border rounded-xl px-3 py-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1.5 shrink-0" />
                      <input
                        type="text"
                        value={extractedListing.address}
                        onChange={(e) =>
                          setExtractedListing({
                            ...extractedListing,
                            address: e.target.value,
                          })
                        }
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('aiModal.city')}
                    </label>
                    <div className="flex items-center bg-white border border-nordible-border rounded-xl px-3 py-2">
                      <input
                        type="text"
                        value={extractedListing.city}
                        onChange={(e) =>
                          setExtractedListing({
                            ...extractedListing,
                            city: e.target.value,
                          })
                        }
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('aiModal.phone')}
                    </label>
                    <PhoneInputWithCountry
                      value={extractedListing.phone}
                      onChange={(val) =>
                        setExtractedListing({
                          ...extractedListing,
                          phone: val,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('aiModal.website')}
                    </label>
                    <div className="flex items-center bg-white border border-nordible-border rounded-xl px-3 py-2">
                      <Globe className="w-4 h-4 text-gray-400 mr-1.5 shrink-0" />
                      <input
                        type="text"
                        value={extractedListing.website}
                        onChange={(e) =>
                          setExtractedListing({
                            ...extractedListing,
                            website: e.target.value,
                          })
                        }
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('aiModal.hours')}
                  </label>
                  <div className="flex items-center bg-white border border-nordible-border rounded-xl px-3 py-2">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={extractedListing.hours}
                      onChange={(e) =>
                        setExtractedListing({
                          ...extractedListing,
                          hours: e.target.value,
                        })
                      }
                      className="w-full text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('listing.description')}
                  </label>
                  <textarea
                    rows={2}
                    value={
                      typeof extractedListing.description === 'string'
                        ? extractedListing.description
                        : (extractedListing.description as Record<string, string>)?.[locale] ||
                          (extractedListing.description as Record<string, string>)?.en ||
                          (extractedListing.description as Record<string, string>)?.de ||
                          ''
                    }
                    onChange={(e) =>
                      setExtractedListing({
                        ...extractedListing,
                        description: e.target.value,
                      })
                    }
                    className="w-full text-xs font-medium text-gray-900 bg-white border border-nordible-border rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-nordible-bg border-t border-nordible-border flex items-center justify-between gap-3">
          {step === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {t('aiModal.back')}
              </button>
              <button
                type="button"
                disabled={
                  activeTab === 'url'
                    ? !urlInput.trim()
                    : activeTab === 'prompt'
                    ? !promptInput.trim()
                    : false
                }
                onClick={() => handleStartExtraction()}
                className="flex-1 py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors active:scale-98 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('aiModal.startExtract')}</span>
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="w-full text-center text-xs font-semibold text-nordible-dark py-1">
              {locale === 'de'
                ? 'KI analysiert und formatiert die Daten...'
                : 'AI is analyzing and formatting the data...'}
            </div>
          )}

          {step === 'review' && (
            <>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-3 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {t('aiModal.back')}
              </button>
              <button
                type="button"
                onClick={handleConfirmListing}
                className="flex-1 py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors active:scale-98 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('aiModal.confirmAndAdd')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
