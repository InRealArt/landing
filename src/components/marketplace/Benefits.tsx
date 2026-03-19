'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function Benefits() {
  const { t } = useLanguageStore()

  const benefits = [
    {
      index: '01',
      title: t('marketplace.benefits.items.authenticity.title'),
      description: t('marketplace.benefits.items.authenticity.description'),
    },
    {
      index: '02',
      title: t('marketplace.benefits.items.exclusivity.title'),
      description: t('marketplace.benefits.items.exclusivity.description'),
    },
    {
      index: '03',
      title: t('marketplace.benefits.items.resale.title'),
      description: t('marketplace.benefits.items.resale.description'),
    },
    {
      index: '04',
      title: t('marketplace.benefits.items.copyright.title'),
      description: t('marketplace.benefits.items.copyright.description'),
    },
  ]

  return (
    <section className="py-32 px-10 bg-backgroundColor">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section header with border separator */}
        <div className="border-b border-borderColor pb-14 mb-20">
          <span className="section-number">{t('marketplace.benefits.sectionLabel')}</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl serif">
            {t('marketplace.benefits.title')}{' '}
            <span className="italic text-gold-accent">{t('marketplace.benefits.titleAccent')}</span>
          </h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-grayText mt-8 max-w-xl leading-relaxed">
            {t('marketplace.benefits.description')}
          </p>
        </div>

        {/* Benefits grid — 2 cols mobile, 4 cols desktop, border-top editorial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {benefits.map((benefit) => (
            <div key={benefit.index} className="border-t border-borderColor pt-10">
              <span className="serif text-3xl italic text-gold-accent block mb-6">
                {benefit.index}.
              </span>
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-textColor mb-6">
                {benefit.title}
              </h3>
              <p className="text-[13px] text-grayText leading-loose">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
