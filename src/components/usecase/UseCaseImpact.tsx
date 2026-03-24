'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function UseCaseImpact() {
  const { t } = useLanguageStore()

  const stats = [
    {
      value: t('usecase.impact.stat1.value'),
      label: t('usecase.impact.stat1.label'),
    },
    {
      value: t('usecase.impact.stat2.value'),
      label: t('usecase.impact.stat2.label'),
    },
    {
      value: t('usecase.impact.stat3.value'),
      label: t('usecase.impact.stat3.label'),
    },
  ]

  return (
    <section
      data-anim="impact-section"
      className="py-28 lg:py-40 px-4 sm:px-6 lg:px-10 text-center"
      style={{ background: 'var(--ink-black)' }}
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
        {stats.map((stat, index) => (
          <div key={index} data-anim="impact-stat">
            <span
              className="serif text-[clamp(3rem,7vw,4rem)] block mb-4"
              style={{ color: 'var(--gold-accent)' }}
            >
              {stat.value}
            </span>
            <p
              className="text-[10px] uppercase tracking-[0.3em] montserrat leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
