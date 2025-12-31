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
      contentContainerClassName="max-w-90 xl:max-w-screen-xl mx-auto w-full pb-12 md:pb-16 lg:pb-20"
      titleClassName="bricolage-grotesque text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-textColor mb-4 md:mb-6 leading-tight"
      subtitleClassName="text-base md:text-lg lg:text-xl text-textColor/90 max-w-2xl leading-relaxed"
      priority={true}
    />
  )
}
