'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing } from '@/lib/types';
import { LayoutDashboard, X, Clock, Phone, Globe, MapPin, CheckCircle, Save } from 'lucide-react';

interface BusinessDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BusinessListing | null;
  primaryColor: string;
  onSaveListing: (updated: BusinessListing) => void;
}

export const BusinessDashboardModal: React.FC<BusinessDashboardModalProps> = ({
  isOpen,
  onClose,
  listing,
  primaryColor,
  onSaveListing,
}) => {
  const { locale, t } = useTranslation();
  const [prevListingId, setPrevListingId] = useState<string | undefined>(listing?.id);
  const [formData, setFormData] = useState<BusinessListing | null>(listing);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state during render when listing prop changes
  if (listing && listing.id !== prevListingId) {
    setPrevListingId(listing.id);
    setFormData(listing);
    setSavedSuccess(false);
  }

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    onSaveListing(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Handle for mobile ergonomics */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                {t('dashboard.title')}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">{formData.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('dashboard.saved')}</span>
            </div>
          )}

          {/* Quick Toggle: Open/Closed status */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  formData.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-bold text-gray-800">
                {t('dashboard.isOpenLabel')}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOpenNow}
                onChange={(e) =>
                  setFormData({ ...formData, isOpenNow: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Öffnungszeiten
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Clock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Telefonnummer
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <Phone className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Webseite
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <Globe className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Straße & Hausnummer
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stadt & PLZ
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Unternehmensbeschreibung
            </label>
            <textarea
              rows={3}
              value={formData.description[locale]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: {
                    ...formData.description,
                    [locale]: e.target.value,
                  },
                })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-900 focus:outline-none resize-none"
            />
          </div>

          {/* Action button anchored at bottom */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>{t('dashboard.saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
