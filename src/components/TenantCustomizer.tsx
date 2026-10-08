'use client';

import React, { useState } from 'react';
import { TenantBranding } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { X, Check, Sparkles } from 'lucide-react';

interface TenantCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTenant: TenantBranding;
  onSaveTenant: (updated: TenantBranding) => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky blue
  '#059669', // Emerald
  '#7c3aed', // Violet
  '#dc2626', // Crimson red
  '#ea580c', // Warm orange
  '#0f172a', // Slate black
];

export const TenantCustomizer: React.FC<TenantCustomizerProps> = ({
  isOpen,
  onClose,
  currentTenant,
  onSaveTenant,
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState(currentTenant.name);
  const [taglineDe, setTaglineDe] = useState(currentTenant.tagline.de);
  const [taglineEn, setTaglineEn] = useState(currentTenant.tagline.en);
  const [logoText, setLogoText] = useState(currentTenant.logoText);
  const [primaryColor, setPrimaryColor] = useState(currentTenant.primaryColor);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTenant({
      ...currentTenant,
      name,
      logoText,
      primaryColor,
      tagline: {
        de: taglineDe,
        en: taglineEn,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">{t('brand.customizeBrand')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('brand.brandName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              placeholder={t('brand.brandNamePlaceholder')}
              required
            />
          </div>

          {/* Logo Icon / Text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('brand.logoText')}
            </label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              placeholder={t('brand.logoTextPlaceholder')}
              required
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              {t('brand.primaryColor')}
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                  style={{ backgroundColor: color }}
                >
                  {primaryColor === color && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-9 h-9 rounded-full cursor-pointer border-0 bg-transparent p-0"
                title="Custom Color"
              />
            </div>
          </div>

          {/* German Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('brand.tagline')} (Deutsch)
            </label>
            <textarea
              rows={2}
              value={taglineDe}
              onChange={(e) => setTaglineDe(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={t('brand.taglineDePlaceholder')}
            />
          </div>

          {/* English Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('brand.tagline')} (English)
            </label>
            <textarea
              rows={2}
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={t('brand.taglineEnPlaceholder')}
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              {t('brand.previewTitle')}
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {logoText.slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">{name || t('brand.defaultName')}</div>
                <div className="text-xs text-gray-600 line-clamp-1">{taglineDe || t('brand.defaultTagline')}</div>
              </div>
            </div>
          </div>

          {/* Actions - anchored at bottom */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer min-h-[48px]"
            >
              {t('brand.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl text-white font-bold text-sm shadow-md transition-transform active:scale-98 cursor-pointer min-h-[48px]"
              style={{ backgroundColor: primaryColor }}
            >
              {t('brand.applyChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
