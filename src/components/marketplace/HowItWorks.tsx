'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      number: t('marketplace.howItWorks.steps.selection.number'),
      title: t('marketplace.howItWorks.steps.selection.title'),
      description: t('marketplace.howItWorks.steps.selection.description'),
    },
    {
      number: t('marketplace.howItWorks.steps.verification.number'),
      title: t('marketplace.howItWorks.steps.verification.title'),
      description: t('marketplace.howItWorks.steps.verification.description'),
    },
  ]

  return (
    <section className="py-32 px-10 bg-backgroundGrey border-y border-borderColor">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section header */}
        <div className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-6">
            <span className="section-number">{t('marketplace.howItWorks.sectionLabel')}</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight">
              {t('marketplace.howItWorks.title')}{' '}
              <span className="text-gold-accent">{t('marketplace.howItWorks.titleAccent')}</span>
            </h2>
          </div>
        </div>

        {/* Steps grid — 3 columns, border-top editorial style */}
        <div className="grid md:grid-cols-2 gap-20">
          {steps.map((step) => (
            <div key={step.number} className="border-t border-borderColor pt-12">
              <span className="serif text-4xl italic text-gold-accent mb-8 block">{step.number}.</span>
              <h3 className="text-3xl serif mb-6 italic">{step.title}</h3>
              <p className="text-sm text-grayText leading-loose">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
