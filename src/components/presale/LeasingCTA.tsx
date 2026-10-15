'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function LeasingCTA() {
  const { t } = useTranslation()

  return (
    <section className="my-24 border-t border-borderColor pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left — copy */}
        <div>
          <span className="section-number" suppressHydrationWarning>
            {t('presale.leasing.eyebrow')}
          </span>

          <h2 className="serif font-light text-4xl sm:text-5xl italic text-textColor leading-tight mt-2">
            {t('presale.leasing.title').split(' ').slice(0, -1).join(' ')}{' '}
            <em className="text-gold-accent not-italic">
              {t('presale.leasing.title').split(' ').slice(-1)}
            </em>
          </h2>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-textColor/50 leading-relaxed max-w-md" suppressHydrationWarning>
            {t('presale.leasing.subtitle')}
          </p>
        </div>

        {/* Right — bullets + CTA */}
        <div>
          {/* Deux traitements fiscaux distincts : leasing (loyers) et achat (art. 238 bis AB) */}
          <div className="space-y-8 mb-10">
            {(['lease', 'purchase'] as const).map((mode) => (
              <div key={mode} className="flex items-start gap-4">
                {/* Thin gold rule */}
                <span className="mt-1.5 w-5 h-px bg-[#b89c72] flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-xs uppercase tracking-[0.3em] text-textColor leading-relaxed" suppressHydrationWarning>
                    {t(`presale.leasing.${mode}.title`)}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-textColor/70 leading-relaxed" suppressHydrationWarning>
                    {t(`presale.leasing.${mode}.text`)}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-xs tracking-[0.1em] text-textColor/50 leading-relaxed" suppressHydrationWarning>
              {t('presale.leasing.disclaimer')}
            </p>
          </div>

          {/* CTA */}
          <div>
            <Link href="/loa-simulator" className="btn-cta inline-flex items-center gap-3">
              <span className="text-[0.6rem] uppercase tracking-[0.25em]" suppressHydrationWarning>
                {t('presale.leasing.cta')}
              </span>
              {/* Arrow */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-textColor/30" suppressHydrationWarning>
              {t('presale.leasing.ctaNote')}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
