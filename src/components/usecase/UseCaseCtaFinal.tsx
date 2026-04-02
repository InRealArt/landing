'use client'

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
        <a href="/contact" className="btn-action">
          {t('usecase.ctaFinal.button')}
        </a>
      </div>
    </section>
  )
}
