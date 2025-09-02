'use client'

import { useLanguageStore } from '@/store/languageStore'
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"

export default function ArtistsHero() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-screen h-96 md:h-[550px] overflow-hidden ml-[calc(-50vw+50%)]">
      <OptimizedBackgroundImage
        src="/images/artists/hero_artists.webp"
        alt={t('artists.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <h1 className="bricolage-grotesque text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
            {t('artists.hero.title')}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed">
            {t('artists.hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  )
}
