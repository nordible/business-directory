'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';
import {
  X,
  CheckCircle2,
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Loader2,
  ShieldCheck,
  ImageIcon,
  TrendingUp,
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { CategoryAutocomplete } from '@/components/CategoryAutocomplete';
import { LegalFormAutocomplete } from '@/components/LegalFormAutocomplete';
import { PhoneInputWithCountry } from '@/components/PhoneInputWithCountry';
import { OpeningHoursPicker, DEFAULT_WEEK_SCHEDULE } from '@/components/OpeningHoursPicker';
import { WeekSchedule } from '@/lib/types';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
  initialWantsGrowthResource?: boolean;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  primaryColor = '#145BFF',
  initialWantsGrowthResource = false,
}) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    legalForm: '',
    address: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    description: '',
  });

  const [openingHoursJson, setOpeningHoursJson] = useState<WeekSchedule>(DEFAULT_WEEK_SCHEDULE);
  const [wantsGrowthResource, setWantsGrowthResource] = useState(initialWantsGrowthResource);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWantsGrowthResource(initialWantsGrowthResource);
    }
  }, [isOpen, initialWantsGrowthResource]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen || !isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      (!formData.categoryId && !formData.categoryName.trim()) ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setErrorMessage(
        isDe
          ? 'Bitte füllen Sie mindestens Unternehmensname, Branche, Straße und Stadt aus.'
          : 'Please fill in at least Company Name, Category, Street, and City.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/businesses/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          categoryId: formData.categoryId || undefined,
          categoryName: formData.categoryName.trim() || undefined,
          legalForm: formData.legalForm,
          address: formData.address.trim(),
          postalCode: formData.postalCode.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state.trim() || undefined,
          country: formData.country.trim() || (isDe ? 'Deutschland' : 'Germany'),
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          website: formData.website.trim()
            ? /^https?:\/\//i.test(formData.website.trim())
              ? formData.website.trim()
              : `https://${formData.website.trim()}`
            : undefined,
          logoUrl: formData.logoUrl.trim() || undefined,
          description: formData.description.trim(),
          openingHoursJson,
          wantsGrowthResource,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isDe ? 'Fehler beim Einreichen.' : 'Submission failed.'));
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : isDe ? 'Fehler beim Einreichen.' : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={handleClose} />

      <div className="bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#145BFF] border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1A]" />
              <span>{isDe ? 'Unternehmen eintragen' : 'Add Business'}</span>
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 mx-auto">
                <Mascot variant="celebrate" alt="Success" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>{isDe ? 'Erfolgreich eingereicht' : 'Successfully Submitted'}</span>
              </div>
              <h3 className="font-heading font-black text-xl text-[#0D2B75]">
                {isDe ? 'Vielen Dank für Ihre Registrierung!' : 'Thank you for your registration!'}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed font-medium">
                {isDe
                  ? 'Ihr Unternehmenseintrag wurde in der Datenbank gespeichert und befindet sich im Status „Ausstehend“. Nach Prüfung durch den Administrator wird er im Verzeichnis freigeschaltet.'
                  : 'Your business listing has been saved to the database in "Pending" status. After review by the administrator, it will be published to the directory.'}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                {isDe ? 'Schließen' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-heading font-black text-lg text-[#0D2B75]">
                  {isDe ? 'Neues Unternehmen registrieren' : 'Register New Business'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {isDe
                    ? 'Tragen Sie Ihre Geschäftsdaten vollständig ein, um beste Sichtbarkeit und Kundenanfragen zu erhalten.'
                    : 'Submit your business details accurately to maximize visibility and receive customer inquiries.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* SECTION 1: Unternehmensdaten & Logo */}
              <div className="bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4] space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#145BFF] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Unternehmensdaten & Profil' : 'Company Details & Profile'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Unternehmensname *' : 'Company Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isDe ? 'z. B. Nordible Technologies' : 'e.g., Nordible Technologies'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Rechtsform' : 'Legal Form'}
                    </label>
                    <LegalFormAutocomplete
                      value={formData.legalForm}
                      onChange={(val) => setFormData({ ...formData, legalForm: val })}
                    />
                  </div>
                </div>

                {/* Dynamic Category Autocomplete */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isDe
                      ? 'Branche / Kategorie * (auswählen oder frei eingeben)'
                      : 'Industry / Category * (select or type new)'}
                  </label>
                  <CategoryAutocomplete
                    value={formData.categoryName}
                    onChange={(cat) =>
                      setFormData({
                        ...formData,
                        categoryId: cat.id || '',
                        categoryName: cat.name,
                      })
                    }
                  />
                </div>

                {/* Business Logo URL with Live Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isDe
                      ? 'Firmenlogo URL (optional Bildlink)'
                      : 'Company Logo URL (optional image link)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                      />
                    </div>
                    {/* Live Thumbnail Preview */}
                    <div className="w-9 h-9 rounded-xl border border-[#E8ECF4] bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {formData.logoUrl ? (
                        <Image
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Standort & Granulare Anschrift */}
              <div className="bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4] space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#145BFF] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Standort & Adresse' : 'Location & Address'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Straße & Hausnummer *' : 'Street & Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={isDe ? 'z. B. Taunusanlage 8' : 'e.g. 100 Main Street'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Postleitzahl (PLZ)' : 'Postal Code (ZIP)'}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder={isDe ? 'z. B. 60329' : 'e.g. 10001'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Stadt / Ort *' : 'City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={isDe ? 'z. B. Frankfurt am Main' : 'e.g. Berlin'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Bundesland / Region' : 'State / Region'}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder={isDe ? 'z. B. Hessen' : 'e.g. Bavaria'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Land' : 'Country'}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder={isDe ? 'z. B. Deutschland, Österreich, USA...' : 'e.g. Germany, United States, UK...'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Kontakt & Kommunikation */}
              <div className="bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4] space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#145BFF] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Kontaktkanäle für Kunden' : 'Customer Contact Channels'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Geschäfts-E-Mail (für Anfragen)' : 'Business Email (for inquiries)'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@company.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Telefonnummer' : 'Phone Number'}
                    </label>
                    <PhoneInputWithCountry
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                      placeholder={isDe ? '1521 1234567' : '555 123 4567'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isDe ? 'Webseite' : 'Website'}
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8ECF4] bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: 7-Tage Öffnungszeiten */}
              <div className="bg-[#FAFBFF] p-4 rounded-2xl border border-[#E8ECF4] space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#145BFF]">
                  {isDe ? 'Öffnungszeiten (7 Tage / Woche)' : 'Opening Hours (7 Days / Week)'}
                </h4>
                <OpeningHoursPicker
                  value={openingHoursJson}
                  onChange={(val) => setOpeningHoursJson(val)}
                />
              </div>

              {/* SECTION 5: Leistungsbeschreibung */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isDe
                    ? 'Beschreibung der Dienstleistungen & Spezialisierungen'
                    : 'Description of Services & Specialties'}
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    isDe
                      ? 'Beschreiben Sie Ihre Kernleistungen, Produkte, Zielgruppen und Schwerpunkte...'
                      : 'Describe your core services, specialties, target audiences, and products...'
                  }
                  className="w-full p-3 text-xs rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#145BFF] transition-all font-medium text-slate-800 resize-none"
                />
              </div>

              {/* SECTION 6: Wachstumsstrategie & Ressourcen */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border border-blue-200/70 shadow-xs">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantsGrowthResource}
                    onChange={(e) => setWantsGrowthResource(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#145BFF] focus:ring-[#145BFF] accent-[#145BFF] cursor-pointer"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#0D2B75] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#145BFF]" />
                      <span>
                        {isDe
                          ? 'Kostenlose Wachstumsstrategie & Ressourcen erhalten'
                          : 'Receive Free Growth Strategy & Resources'}
                      </span>
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {isDe
                        ? 'Möchten Sie praxiserprobte Strategien und Ressourcen erhalten, um Ihren Kundenstamm, Ihre digitale Reichweite und Ihren Umsatz nachhaltig zu steigern? Wir senden Ihnen das Material unverbindlich zu.'
                        : 'Would you like to receive proven strategies and resources to sustainably increase your customer reach and revenue? We will send the materials free of charge.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E8ECF4] text-xs font-bold text-slate-600 hover:bg-[#F3F7FF] transition-colors cursor-pointer"
                >
                  {isDe ? 'Abbrechen' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isDe ? 'Wird gespeichert...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDe ? 'Eintrag zur Prüfung einreichen' : 'Submit Listing for Review'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
