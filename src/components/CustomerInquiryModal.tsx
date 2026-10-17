'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Sparkles, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { BusinessListing } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { PhoneInputWithCountry } from '@/components/PhoneInputWithCountry';

const emptySubscribe = () => () => {};

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessListing;
  tenantId?: string;
  onOpenInbox?: () => void;
}

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({
  isOpen,
  onClose,
  business,
  tenantId,
  onOpenInbox,
}) => {
  const { locale, t } = useTranslation();
  const presetSubjects = [
    t('inquiry.subjectGeneral'),
    t('inquiry.subjectQuote'),
    t('inquiry.subjectAppointment'),
    t('inquiry.subjectPartnership'),
  ];

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [subject, setSubject] = useState(presetSubjects[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isOpen || !isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerEmail || !message.trim()) {
      setError(t('inquiry.errorRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          tenantId: tenantId || business.tenantId,
          customerName,
          customerEmail,
          customerPhone,
          subject: subject || presetSubjects[0],
          message,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || t('inquiry.errorSending'));
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : t('inquiry.errorUnexpected')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setMessage('');
    setError(null);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0 -z-10" onClick={handleResetAndClose} />
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#E8ECF4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8ECF4] bg-gradient-to-r from-[#F3F7FF] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-[#0D2B75] leading-tight">
                {t('inquiry.title', { name: business.name })}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {t('inquiry.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-[#0D2B75]">
                  {t('inquiry.successTitle')}
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                  {t('inquiry.successDesc', { name: business.name, email: customerEmail })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E8ECF4] text-left text-xs text-gray-700 space-y-1.5 max-w-md mx-auto">
                <div className="font-bold text-[#0D2B75] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{t('inquiry.notificationTitle')}</span>
                </div>
                <p className="text-gray-500">
                  {t('inquiry.notificationDesc')}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onOpenInbox && (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAndClose();
                      onOpenInbox();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {t('inquiry.openInbox')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {t('inquiry.close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Subject Presets */}
              <div>
                <label className="block text-xs font-bold text-[#0D2B75] mb-2">
                  {t('inquiry.subjectLabel')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetSubjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        subject === s
                          ? 'bg-[#145BFF] text-white border-[#145BFF] font-bold shadow-xs'
                          : 'bg-[#FAFBFF] text-gray-700 border-[#E8ECF4] hover:border-blue-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                    {t('inquiry.nameLabel')}{' '}
                    <span className="text-gray-400 font-normal">
                      ({t('inquiry.optional')})
                    </span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('inquiry.namePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                    {t('inquiry.emailLabel')}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                  {t('inquiry.phoneLabel')}{' '}
                  <span className="text-gray-400 font-normal">
                    ({t('inquiry.optionalCallback')})
                  </span>
                </label>
                <PhoneInputWithCountry
                  value={customerPhone}
                  onChange={setCustomerPhone}
                  placeholder={t('inquiry.phonePlaceholder')}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                  {t('inquiry.messageLabel')}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('inquiry.messagePlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* AI Triage Information Banner */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5 text-[11px] text-[#0D2B75]">
                <Sparkles className="w-4 h-4 text-[#145BFF] shrink-0" />
                <span>
                  <strong>
                    {t('inquiry.assistantLabel')}
                  </strong>{' '}
                  {t('inquiry.assistantDesc', { name: business.name })}
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {t('inquiry.submitting')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('inquiry.submit')}</span>
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
