'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutHero() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_about.webp"
          alt={t('about.title')}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>

      {/* Contenu du hero */}
      <div className="relative z-10 flex items-end h-full">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <h1 className="bricolage-grotesque text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
