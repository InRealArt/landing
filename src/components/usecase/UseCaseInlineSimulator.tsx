'use client'

import { useTranslation } from '@/hooks/useTranslation'
import LoaSimulatorClient from '@/components/loa-simulator/LoaSimulatorClient'

export default function UseCaseInlineSimulator() {
  const { t } = useTranslation()

  return (
    <section className="bg-backgroundGrey border-y border-borderColor py-24 lg:py-32 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-16">
          <span className="section-number">{t('usecase.inlineSimulator.eyebrow')}</span>
          <h2 className="serif text-4xl md:text-5xl lg:text-6xl font-light leading-none text-textColor mt-4">
            {t('usecase.inlineSimulator.title')}
          </h2>
          <div className="flex items-center gap-4 mt-6 max-w-2xl">
            <div className="w-12 h-px bg-gold-accent shrink-0" />
            <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed">
              {t('usecase.inlineSimulator.subtitle')}
            </p>
          </div>
        </div>

        <LoaSimulatorClient />
      </div>
    </section>
  )
}
