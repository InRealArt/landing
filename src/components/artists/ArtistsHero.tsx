'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function ArtistsHero() {
  const { t } = useLanguageStore()

  return (
    <section className="pt-48 pb-12 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        <div className="border-b border-borderColor pb-12 mb-0">
          <h1 data-anim="artists-hero-title" className="text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.15em] font-bold leading-tight bricolage-grotesque text-textColor">
            {t('artists.title')}
          </h1>
        </div>
      </div>
    </section>
  )
}
