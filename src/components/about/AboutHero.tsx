'use client'

import { useLanguageStore } from '@/store/languageStore'
import Hero from '@/components/common/Hero'

export default function AboutHero() {
  const { t } = useLanguageStore()

  return (
    <Hero
      backgroundImage="/images/hero_about.webp"
      alt={t('about.title')}
      title={t('about.hero.title')}
      subtitle={t('about.hero.subtitle')}
      className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden"
      contentAlignment="end"
      contentContainerClassName="max-w-screen-2xl mx-auto w-full px-10 pb-12 md:pb-16 lg:pb-20"
      titleClassName="text-6xl md:text-8xl serif text-white mb-6"
      subtitleClassName="section-number text-white/70"
      priority={true}
      renderCustomContent={(_title, subtitle) => (
        <div className="max-w-4xl">
          <span className="section-number text-white/70">{subtitle}</span>
          <h1 className="text-6xl md:text-8xl serif text-white mb-6">À <span className="italic text-gold-accent">propos</span></h1>
        </div>
      )}
    />
  )
}
