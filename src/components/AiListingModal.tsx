'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing, Category } from '@/lib/types';
import {
  Sparkles,
  X,
  Globe,
  UploadCloud,
  CheckCircle2,
  Building,
  MapPin,
  Phone,
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

  if (!isOpen) return null;

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
          alert('Fehler bei der Extraktion');
          setStep('input');
        }
      }, 2000);
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      alert('Verbindungsfehler beim Extrahieren');
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
      onListingCreated(extractedListing);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      {/* Backdrop touch dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-white w-full md:max-w-xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden border border-[#E8ECF4]">
        {/* Handle bar for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#0D2B75] text-base leading-tight">
                {t('aiModal.title')}
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                {t('aiModal.subtitle')}
              </p>
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
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Input & Mode Selection */}
          {step === 'input' && (
            <div className="space-y-5">
              {/* Tab Selector (Segmented Control) */}
              <div className="flex bg-[#F3F7FF] border border-[#E8ECF4] p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-white text-[#0D2B75] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{t('aiModal.tabUrl')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('prompt')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'prompt'
                      ? 'bg-white text-[#0D2B75] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-[#FF9F1A]" />
                  <span>AI Prompt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white text-[#0D2B75] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{t('aiModal.tabUpload')}</span>
                </button>
              </div>

              {/* Tab 1 Content: URL input */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#0D2B75]">
                    {t('aiModal.urlLabel')}
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://nordible.co"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAFBFF] border border-[#E8ECF4] rounded-xl text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium"
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
                        className="px-2.5 py-1 text-xs bg-blue-50 text-[#145BFF] border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-bold flex items-center gap-1"
                      >
                        ⚡ nordible.co
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySample('coffee')}
                        className="px-2.5 py-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer font-medium"
                      >
                        ☕ Café & Rösterei
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplySample('craft')}
                        className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer font-medium"
                      >
                        🪵 Tischlerei
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2 Content: AI Prompt input */}
              {activeTab === 'prompt' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#0D2B75]">
                    Freitext oder KI-Prompt (auch für KI-Agenten)
                  </label>
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="z.B. Trage Nordible Technologies ein: Software-Agentur aus Frankfurt am Main, Web: https://nordible.co, Tel: +49 69 9999 8888, Spezialisiert auf KI-Agenten und Webplattformen."
                    className="w-full p-3 bg-[#FAFBFF] border border-[#E8ECF4] rounded-xl text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium leading-relaxed"
                  />

                  {/* Sample Prompt Chips */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                      Prompt-Beispiel testen:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPromptSample(
                          'Trage Nordible Technologies ein: AI & Software Engineering Agentur aus Frankfurt, Web: https://nordible.co, Tel: +49 69 9999 8888'
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-[#F3F7FF] text-[#0D2B75] border border-[#E8ECF4] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-semibold text-left block"
                    >
                      🤖 „Trage Nordible Technologies ein: Software & KI-Agentur aus Frankfurt...“
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
                    className="border-2 border-dashed border-[#E8ECF4] hover:border-[#145BFF] rounded-2xl p-6 text-center cursor-pointer bg-[#FAFBFF] hover:bg-white transition-colors"
                  >
                    <UploadCloud className="w-10 h-10 text-[#145BFF] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#0D2B75]">
                      {t('aiModal.uploadPlaceholder')}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Klicken zum Hochladen oder hier ablegen
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
                <h4 className="font-heading font-extrabold text-base text-[#0D2B75]">
                  {t('aiModal.analyzing')}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Extraktion läuft automatisch im Hintergrund
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="w-full max-w-sm space-y-3 text-left bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4]">
                <div className="flex items-center gap-2.5 text-xs">
                  {progressStep >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      progressStep >= 1 ? 'font-bold text-[#0D2B75]' : 'text-gray-500'
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
                      progressStep >= 2 ? 'font-bold text-[#0D2B75]' : 'text-gray-500'
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
                      progressStep >= 3 ? 'font-bold text-[#0D2B75]' : 'text-gray-500'
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
                <span className="text-xs font-extrabold text-[#0D2B75] uppercase tracking-wider font-heading">
                  {t('aiModal.reviewTitle')}
                </span>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs font-semibold text-gray-500 hover:text-[#145BFF] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Neu erfassen</span>
                </button>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4]">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    {t('aiModal.businessName')}
                  </label>
                  <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
                    <Building className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={extractedListing.name}
                      onChange={(e) =>
                        setExtractedListing({ ...extractedListing, name: e.target.value })
                      }
                      className="w-full text-xs font-bold text-[#0D2B75] focus:outline-none"
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
                    className="w-full text-xs font-semibold bg-white border border-[#E8ECF4] rounded-xl px-3 py-2 text-[#0D2B75] focus:outline-none cursor-pointer"
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
                    <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
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
                    <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
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
                    <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
                      <Phone className="w-4 h-4 text-gray-400 mr-1.5 shrink-0" />
                      <input
                        type="text"
                        value={extractedListing.phone}
                        onChange={(e) =>
                          setExtractedListing({
                            ...extractedListing,
                            phone: e.target.value,
                          })
                        }
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {t('aiModal.website')}
                    </label>
                    <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
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
                  <div className="flex items-center bg-white border border-[#E8ECF4] rounded-xl px-3 py-2">
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
                    {t('aiModal.descDe')}
                  </label>
                  <textarea
                    rows={2}
                    value={extractedListing.description.de}
                    onChange={(e) =>
                      setExtractedListing({
                        ...extractedListing,
                        description: {
                          ...extractedListing.description,
                          de: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs font-medium text-gray-900 bg-white border border-[#E8ECF4] rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#FAFBFF] border-t border-[#E8ECF4] flex items-center justify-between gap-3">
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
                className="flex-1 py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('aiModal.startExtract')}</span>
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="w-full text-center text-xs font-semibold text-[#0D2B75] py-1">
              KI analysiert und formatiert die Daten...
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
                className="flex-1 py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
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
    </div>
  );
};
