'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function ArtistsHero() {
  const { t } = useLanguageStore()

  return (
    <section className="pt-48 pb-12 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        <div className="border-b border-borderColor pb-12 mb-0">
          <span data-anim="artists-hero-label" className="section-number">{t('artists.title')}</span>
          <h1 data-anim="artists-hero-title" className="text-6xl md:text-8xl serif font-light leading-tight">
            {t('artists.hero.headingMain')}{' '}
            <span className="italic text-gold-accent">
              {t('artists.hero.headingAccent')}
            </span>
          </h1>
          <p data-anim="artists-hero-descriptor" className="text-[11px] uppercase tracking-[0.3em] text-grayText mt-6 max-w-xl leading-relaxed bricolage-grotesque">
            {t('artists.hero.descriptor')}
          </p>
        </div>
      </div>
    </section>
  )
}
