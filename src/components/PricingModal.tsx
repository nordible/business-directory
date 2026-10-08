'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Check, Sparkles, X, CreditCard, Shield, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  onOpenDomainSettings: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  primaryColor,
  onOpenDomainSettings,
}) => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: 'starter' | 'pro' | 'enterprise') => {
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        setTimeout(() => {
          setLoadingPlan(null);
          alert(t('pricing.checkoutSuccess', { plan: planId.toUpperCase(), cycle: billingCycle }));
          onClose();
        }, 800);
      }
    } catch {
      setLoadingPlan(null);
      alert(t('pricing.checkoutError'));
    }
  };

  const plans = [
    {
      id: 'starter' as const,
      name: t('pricing.tierStarter'),
      description: t('pricing.tierStarterDesc'),
      priceMonthly: 29,
      priceYearly: 24,
      features: [
        t('pricing.fStarter1'),
        t('pricing.fStarter2'),
        t('pricing.fStarter3'),
        t('pricing.fStarter4'),
        t('pricing.fStarter5'),
      ],
      isPopular: false,
    },
    {
      id: 'pro' as const,
      name: t('pricing.tierPro'),
      description: t('pricing.tierProDesc'),
      priceMonthly: 79,
      priceYearly: 65,
      features: [
        t('pricing.fPro1'),
        t('pricing.fPro2'),
        t('pricing.fPro3'),
        t('pricing.fPro4'),
        t('pricing.fPro5'),
        t('pricing.fPro6'),
      ],
      isPopular: true,
    },
    {
      id: 'enterprise' as const,
      name: t('pricing.tierEnterprise'),
      description: t('pricing.tierEnterpriseDesc'),
      priceMonthly: 199,
      priceYearly: 165,
      features: [
        t('pricing.fEnterprise1'),
        t('pricing.fEnterprise2'),
        t('pricing.fEnterprise3'),
        t('pricing.fEnterprise4'),
        t('pricing.fEnterprise5'),
      ],
      isPopular: false,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full md:max-w-4xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E8ECF4]">
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#0D2B75] text-base leading-tight">
                {t('pricing.title')}
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                {t('pricing.subtitle')}
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Billing Cycle Switcher with savings anchor */}
          <div className="flex items-center justify-center">
            <div className="bg-[#F3F7FF] border border-[#E8ECF4] p-1 rounded-2xl flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#0D2B75] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('pricing.monthly')}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-[#0D2B75] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t('pricing.yearly')}</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
              const isSelectedLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    plan.isPopular
                      ? 'border-2 shadow-lg relative bg-white'
                      : 'border-[#E8ECF4] bg-[#FAFBFF] hover:bg-white'
                  }`}
                  style={plan.isPopular ? { borderColor: primaryColor } : {}}
                >
                  {plan.isPopular && (
                    <>
                      {/* Peeking Mascot on Popular Plan */}
                      <div className="absolute -top-12 right-4 w-14 h-14 pointer-events-none drop-shadow-md">
                        <Mascot variant="pricing-peek" alt="Nordible Pricing Mascot" />
                      </div>

                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-[10px] font-extrabold tracking-wide uppercase shadow-xs flex items-center gap-1"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{t('pricing.popularBadge')}</span>
                      </div>
                    </>
                  )}

                  <div>
                    <h4 className="font-heading font-extrabold text-base text-[#0D2B75]">{plan.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 min-h-[32px]">{plan.description}</p>

                    <div className="mt-4 mb-5 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#0D2B75]">€{price}</span>
                      <span className="text-xs font-semibold text-gray-500">{t('pricing.perMonth')}</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-gray-700">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check
                            className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8ECF4]">
                    <button
                      type="button"
                      disabled={isSelectedLoading}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer disabled:opacity-50 ${
                        plan.isPopular
                          ? 'text-white shadow-md'
                          : 'bg-[#0D2B75] text-white hover:bg-[#145BFF]'
                      }`}
                      style={plan.isPopular ? { backgroundColor: primaryColor } : {}}
                    >
                      {isSelectedLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('pricing.redirectingStripe')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('pricing.subscribe')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Domain & SSL Direct Shortcut */}
          <div className="p-4 bg-[#F3F7FF] rounded-2xl border border-[#E8ECF4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECF4] flex items-center justify-center text-[#145BFF] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-xs text-[#0D2B75]">
                  {t('domain.title')}
                </h5>
                <p className="text-[11px] text-gray-600">
                  {t('domain.subtitle')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDomainSettings();
              }}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#E8ECF4] rounded-xl text-xs font-bold text-[#0D2B75] shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              {t('partner.btnConfigureDomain')}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAFBFF] border-t border-[#E8ECF4] flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>{t('pricing.securePayment')}</span>
          </div>
          <span className="hidden sm:inline">{t('pricing.cancelNotice')}</span>
        </div>
      </div>
    </div>
  );
};
