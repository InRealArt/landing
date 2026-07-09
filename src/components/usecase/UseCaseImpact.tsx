'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function UseCaseImpact() {
  const { t } = useTranslation()

  const stats = [
    {
      value: '+63%',
      label: t('usecase.impact.stat1.label'),
    },
    {
      value: '+50%',
      label: t('usecase.impact.stat2.label'),
    },
    {
      value: '+30%',
      label: t('usecase.impact.stat3.label'),
    },
  ]

  return (
    <section
      data-anim="impact-section"
      className="section-dark-premium py-28 lg:py-40 px-4 sm:px-6 lg:px-10 text-center"
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
              className="text-xs uppercase tracking-[0.3em] montserrat leading-relaxed section-dark-muted"
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
