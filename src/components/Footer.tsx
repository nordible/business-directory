'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { ArrowUpRight, ShieldCheck, Mail, Globe, Bug } from 'lucide-react';
import { CustomerInboxDrawer } from '@/components/CustomerInboxDrawer';
import { siteConfig } from '@/config/site';

interface FooterProps {
  showPromo?: boolean;
}

export function Footer({}: FooterProps = {}) {
  const { locale, t } = useTranslation();
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  return (
    <footer className="mt-16 border-t border-[#E8ECF4] bg-[#0D2B75] text-white">
      {/* Main Footer Links & Information */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                <Image
                  src={siteConfig.assets.logoIcon}
                  alt={siteConfig.company.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-black text-lg tracking-tight">{siteConfig.appName}</span>
            </div>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              {t('footer.aboutDesc')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              {t('footer.featuresTitle')}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF9F1A]" />
                <span>{t('footer.featVerified')}</span>
              </li>
              <li>{t('footer.featAi')}</li>
              <li>{t('footer.featDomains')}</li>
              <li>{t('footer.featMobile')}</li>
              <li>
                <Link
                  href={`/${locale}/directory`}
                  className="hover:text-white transition-colors flex items-center gap-1 font-bold text-white"
                >
                  <span>{t('footer.featDirectory')}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href={`/${locale}/partner`}
                  className="text-[#FF9F1A] hover:underline font-bold flex items-center gap-1"
                >
                  <span>{t('footer.featPartner')}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              {t('footer.ecosystemTitle')}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>
                <a
                  href="https://nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Portfolio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://free-invoice-generator.nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Invoice Generator</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://email.nordible.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Nordible Mail Platform</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-200 mb-3 font-heading">
              {t('footer.contactLegal')}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-[#FF9F1A]" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/impressum`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.legalNotice')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/datenschutz`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/agb`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/60">
          <p>© {new Date().getFullYear()} {siteConfig.company.name}. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=%5B${encodeURIComponent(siteConfig.appName)}%20Feedback%5D`}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Bug className="h-3.5 w-3.5 text-[#FF9F1A]" />
              <span>{t('footer.feedback')}</span>
            </a>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-[#145BFF]" />
              <span>{t('footer.madeWithLove')}</span>
            </div>
            <span className="text-white/20">•</span>
            {/* Subtle administrative & future mailbox links below regular view */}
            <button
              type="button"
              onClick={() => setIsInboxOpen(true)}
              className="hover:text-white transition-colors cursor-pointer text-[11px] text-blue-200/50 hover:text-white/90"
              title={t('footer.inboxTitle')}
            >
              {t('footer.inbox')}
            </button>
            <span className="text-white/20">•</span>
            <Link
              href={`/${locale}/admin`}
              className="hover:text-white transition-colors text-[11px] text-blue-200/50 hover:text-white/90"
              title={t('footer.adminTitle')}
            >
              {t('footer.admin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Large Nordible Technologies Footer Brand Section (Single Line) */}
      <div className="w-full border-t border-white/10 py-10 sm:py-14 bg-gradient-to-b from-transparent to-black/25">
        <a
          href={siteConfig.company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 text-center focus:outline-hidden transition-all duration-300"
          aria-label={`${siteConfig.company.name} - ${siteConfig.company.website}`}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
            {/* Logo */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-white p-2 sm:p-2.5 md:p-3 shadow-xl shadow-black/40 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/25 shrink-0 flex items-center justify-center">
              <Image
                src={siteConfig.assets.logoIcon}
                alt={siteConfig.company.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Very large brand name on one line */}
            <span className="font-heading font-black tracking-tight uppercase whitespace-nowrap text-[5.2vw] sm:text-4xl md:text-5xl lg:text-6xl text-white/90 group-hover:text-white transition-colors duration-300 select-none">
              {siteConfig.company.name}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-blue-200/80 font-medium max-w-2xl group-hover:text-blue-100 transition-colors">
            {t('nav.tagline')}
          </p>
        </a>
      </div>

      <CustomerInboxDrawer
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </footer>
  );
}
