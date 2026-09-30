'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { TenantBranding } from '@/lib/types';
import { Globe, X, Check, Copy, ShieldCheck, ArrowRight, Server } from 'lucide-react';

interface DomainSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTenant: TenantBranding;
  primaryColor: string;
  onSaveDomain: (customDomain: string) => void;
}

export const DomainSettingsModal: React.FC<DomainSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTenant,
  primaryColor,
  onSaveDomain,
}) => {
  const { t } = useTranslation();
  const [domainInput, setDomainInput] = useState(currentTenant.customDomain || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDomain(domainInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                {t('domain.title')}
              </h3>
              <p className="text-xs text-gray-600 leading-tight">
                {t('domain.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Domain erfolgreich gespeichert & verknüpft!</span>
            </div>
          )}

          {/* Current Domain Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Eigene Wunsch-Domain
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Globe className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="z.B. verzeichnis.meine-stadt.de"
                className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none placeholder-gray-400"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              Aktuelle interne Subdomain: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">{currentTenant.slug}.nordible.com</code>
            </p>
          </div>

          {/* DNS Configuration Helper */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-gray-600" />
              <span>Erforderliche DNS-Einträge bei Ihrem Registrar</span>
            </h4>

            {/* CNAME record */}
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Typ: CNAME</span>
                <span className="font-mono font-semibold text-gray-800">cname.nordible.com</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('cname', 'cname.nordible.com')}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'cname' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t('domain.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('domain.copy')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SSL Status Indicator */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                {t('domain.sslStatus')}
              </span>
              <p className="text-xs font-semibold text-emerald-900">
                {t('domain.sslActive')}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Domain speichern & SSL bereitstellen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
