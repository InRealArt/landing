'use client'

import { useTranslation } from '@/hooks/useTranslation'
import AgenceBriefForm from './AgenceBriefForm'

export default function AgenceBriefPageClient() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">

      {/* Hero */}
      <section className="relative bg-backgroundColor border-b border-borderColor pt-headerSize pb-20">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />
        <div className="max-w-screen-2xl mx-auto px-10 pt-16">
          <span className="section-number">{t('agence.brief.hero.eyebrow')}</span>
          <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-textColor mt-4 mb-6">
            {t('agence.brief.hero.title')}
            <br />
            <em className="italic text-gold-accent">{t('agence.brief.hero.titleAccent')}</em>
          </h1>
          <div className="flex items-center gap-4 mt-8 max-w-2xl">
            <div className="w-12 h-px bg-gold-accent shrink-0" />
            <p className="text-sm uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed">
              {t('agence.brief.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="max-w-3xl">
            <AgenceBriefForm t={t} />
          </div>
        </div>
      </section>

    </main>
  )
}
