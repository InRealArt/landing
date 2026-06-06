'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function UseCaseCtaFinal() {
  const { t } = useTranslation()

  return (
    <section
      data-anim="cta-final"
      className="py-28 lg:py-40 px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="serif text-[clamp(2rem,5vw,3.25rem)] italic mb-8 text-textColor">
          {t('usecase.ctaFinal.title')}
        </h3>
        <p className="text-[13px] montserrat font-light leading-relaxed mb-12 text-grayText">
          {t('usecase.ctaFinal.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/usecase/capital/contact"
            className="inline-flex items-center gap-3 border border-gold-accent text-textColor px-8 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent hover:text-white transition-all duration-300"
          >
            {t('usecase.ctaFinal.buttonSecondary')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
