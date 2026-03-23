'use client'

import { useLanguageStore } from '@/store/languageStore'
import Hero from '@/components/common/Hero'

export default function AboutHero() {
  const { t } = useLanguageStore()

  return (
    <Hero
      backgroundImage="/images/about/hero_about.webp"
      alt={t('about.title')}
      title={t('about.hero.title')}
      subtitle={t('about.hero.subtitle')}
      className="relative w-full h-[55vh] md:h-[65vh] lg:h-[70vh] overflow-hidden"
      contentAlignment="end"
      contentContainerClassName="max-w-screen-2xl mx-auto w-full px-10 pb-16 md:pb-20 lg:pb-28"
      priority={true}
      renderCustomContent={(_title, subtitle) => (
        <div className="max-w-3xl">
          <span className="section-number text-white/50 block mb-6">
            {t('nav.aboutInRealArt').toUpperCase()}
          </span>
          <h1 className="text-7xl md:text-9xl serif text-white leading-none mb-8">
            À{' '}
            <span className="italic text-gold-accent">propos</span>
          </h1>
          <div className="w-12 h-px bg-gold-accent mb-8" />
          <p className="text-sm text-white/60 leading-loose max-w-xl montserrat">
            {subtitle}
          </p>
        </div>
      )}
    />
  )
}
